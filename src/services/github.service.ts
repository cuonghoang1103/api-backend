// ─── GitHub Repo Hub service ───────────────────────────────────────
//
// All interactions with the public GitHub REST API
// (api.github.com) and the database live here. The route layer
// (github.routes.ts) is a thin adapter that just parses the
// request, calls a service method, and serializes the result.
//
// Reliability features:
//   - withRetry(): wraps every GitHub fetch with exponential
//     backoff so transient 5xx / 403-rate-limit responses don't
//     fail the whole batch.
//   - pMap(): runs the sync loop in parallel with a bounded
//     concurrency so we don't hammer the GitHub API (which would
//     burn through the 5000/hr token quota in seconds).
//   - parseRepoUrl(): accepts the canonical HTTPS form, the SSH
//     shorthand, the .git suffix, and the `owner/repo` shorthand.
// ────────────────────────────────────────────────────────────────────

import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import type { GithubRepoStatus, Prisma } from '@prisma/client';

// ─── Public types ─────────────────────────────────────────────────

/** Result of a successful GitHub API metadata fetch. */
export interface GithubRepoMetadata {
  owner: string;
  repoName: string;
  url: string;
  stars: number;
  language: string | null;
  description: string | null;
  forks?: number;
  openIssues?: number;
}

/** A small projection used by the auto-draft list. */
export interface GithubStarredRepo {
  owner: string;
  repoName: string;
  url: string;
  stars: number;
  language: string | null;
  description: string | null;
}

// ─── URL parsing ──────────────────────────────────────────────────

/**
 * Parse a GitHub repo URL and return the owner + repo name.
 *
 * Accepts:
 *   - https://github.com/owner/repo
 *   - https://github.com/owner/repo.git
 *   - https://github.com/owner/repo/tree/main/some/path
 *   - git@github.com:owner/repo.git
 *   - owner/repo (shorthand — useful for the admin form)
 *
 * Throws AppError(400) on anything that doesn't match.
 */
export function parseRepoUrl(input: string): { owner: string; repoName: string; url: string } {
  if (!input || typeof input !== 'string') {
    throw new AppError('GitHub URL khong hop le', 400, 'INVALID_URL');
  }

  const raw = input.trim();

  // Shorthand: "owner/repo" with no protocol.
  if (/^[\w.-]+\/[\w.-]+$/.test(raw) && !raw.includes('://') && !raw.startsWith('git@')) {
    const [owner, repoName] = raw.split('/');
    return {
      owner,
      repoName: stripGitSuffix(repoName),
      url: `https://github.com/${owner}/${stripGitSuffix(repoName)}`,
    };
  }

  // SSH form: git@github.com:owner/repo.git
  if (raw.startsWith('git@github.com:')) {
    const path = raw.replace('git@github.com:', '').replace(/\.git$/, '');
    const [owner, repoName] = path.split('/');
    if (!owner || !repoName) {
      throw new AppError('GitHub URL khong hop le', 400, 'INVALID_URL');
    }
    return {
      owner,
      repoName,
      url: `https://github.com/${owner}/${repoName}`,
    };
  }

  // HTTPS form.
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new AppError('GitHub URL khong hop le', 400, 'INVALID_URL');
  }
  if (parsed.hostname !== 'github.com') {
    throw new AppError('Chi ho tro URL github.com', 400, 'INVALID_HOST');
  }

  // pathname looks like /owner/repo or /owner/repo/...
  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.length < 2) {
    throw new AppError('GitHub URL thieu owner hoac repo', 400, 'INVALID_URL');
  }
  const owner = segments[0];
  const repoName = stripGitSuffix(segments[1]);
  return {
    owner,
    repoName,
    url: `https://github.com/${owner}/${repoName}`,
  };
}

function stripGitSuffix(name: string): string {
  return name.replace(/\.git$/, '');
}

// ─── GitHub API call (with retry) ──────────────────────────────────

/**
 * Execute `fn` with exponential backoff on transient errors.
 *
 * The GitHub REST API returns 403 when we're hitting the rate
 * limit and 5xx when something on their side is broken. Both
 * are recoverable if we wait a few seconds and try again, so we
 * retry up to `retries` times (default 3) with delays of 1s,
 * 2s, 4s. 4xx errors that are NOT 403 or 429 (e.g. 404) are
 * considered permanent and bubble up immediately.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; baseDelayMs?: number; label?: string } = {},
): Promise<T> {
  const retries = options.retries ?? 3;
  const base = options.baseDelayMs ?? 1000;
  const label = options.label ?? 'github-api';

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      // Permanent (non-retryable) errors: 4xx other than 403 / 429.
      // We detect this by the AppError code (set in the throw
      // branches below) so we don't need to inspect the response
      // body again.
      if (err instanceof AppError && (err as AppError & { code?: string }).code === 'GITHUB_API_NOT_FOUND') {
        throw err;
      }
      if (attempt === retries) break;
      // Exponential backoff with full jitter.
      const delay = base * 2 ** attempt + Math.random() * 250;
      // eslint-disable-next-line no-console
      console.warn(`[${label}] retry ${attempt + 1}/${retries} after ${Math.round(delay)}ms`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'cuongthai-repo-hub',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (config.githubApiToken) {
    headers.Authorization = `Bearer ${config.githubApiToken}`;
  }
  return headers;
}

/**
 * Fetch public metadata for a repo from the GitHub REST API.
 *
 * The function attaches the personal access token (if set) so we
 * stay well under the rate limit. The 60/hr anonymous limit is
 * easy to hit on a busy day with this endpoint being called from
 * both the manual form and the auto-fetch-starred flow.
 *
 * Returns null when the repo doesn't exist (404) so callers can
 * translate that into a user-friendly error.
 *
 * Wrapped in withRetry: a transient 5xx or 403 will be retried
 * with backoff before bubbling up as GITHUB_API_ERROR.
 */
export async function fetchRepoMetadata(
  owner: string,
  repoName: string,
): Promise<GithubRepoMetadata | null> {
  return withRetry(async () => {
    const apiUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}`;
    const res = await fetch(apiUrl, { headers: githubHeaders() });

    if (res.status === 404) {
      // Marked as a permanent error so withRetry doesn't retry it.
      throw new AppError('Repo 404 tren GitHub', 404, 'GITHUB_API_NOT_FOUND');
    }

    if (res.status === 403 || res.status === 429) {
      // Rate limit — throw a transient error so withRetry backs off.
      const text = await res.text().catch(() => '');
      throw new AppError(
        `GitHub rate limit (${res.status}): ${text.slice(0, 200)}`,
        503,
        'GITHUB_RATE_LIMIT',
      );
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new AppError(
        `GitHub API loi (${res.status}): ${text.slice(0, 200)}`,
        502,
        'GITHUB_API_ERROR',
      );
    }

    const body = (await res.json()) as {
      full_name?: string;
      html_url?: string;
      stargazers_count?: number;
      language?: string | null;
      description?: string | null;
      forks_count?: number;
      open_issues_count?: number;
      owner?: { login?: string };
      name?: string;
    };

    return {
      owner: body.owner?.login || owner,
      repoName: body.name || repoName,
      url: body.html_url || `https://github.com/${owner}/${repoName}`,
      stars: body.stargazers_count ?? 0,
      language: body.language ?? null,
      description: body.description ?? null,
      forks: body.forks_count ?? 0,
      openIssues: body.open_issues_count ?? 0,
    };
  }, { label: `repo:${owner}/${repoName}` });
}

/**
 * Fetch the N most recently starred repos for a GitHub user.
 * The GitHub API returns starred repos in reverse-chronological
 * order (most recently starred first), so we just take the
 * first page.
 *
 * We only pull a small page (per_page=10) because the auto-draft
 * flow is meant to surface a handful of candidates, not the
 * full star history.
 */
export async function fetchRecentlyStarred(
  username: string,
  limit: number = 10,
): Promise<GithubStarredRepo[]> {
  return withRetry(async () => {
    const perPage = Math.min(Math.max(limit, 1), 30);
    const apiUrl =
      `https://api.github.com/users/${encodeURIComponent(username)}/starred?per_page=${perPage}&sort=created&direction=desc`;

    const res = await fetch(apiUrl, { headers: githubHeaders() });

    if (res.status === 404) {
      throw new AppError(
        `GitHub user "${username}" khong ton tai`,
        404,
        'USER_NOT_FOUND',
      );
    }
    if (res.status === 403 || res.status === 429) {
      const text = await res.text().catch(() => '');
      throw new AppError(
        `GitHub rate limit (${res.status}): ${text.slice(0, 200)}`,
        503,
        'GITHUB_RATE_LIMIT',
      );
    }
    if (!res.ok) {
      throw new AppError(
        `GitHub API loi (${res.status})`,
        502,
        'GITHUB_API_ERROR',
      );
    }

    const list = (await res.json()) as Array<{
      full_name?: string;
      html_url?: string;
      stargazers_count?: number;
      language?: string | null;
      description?: string | null;
    }>;

    return list.map((item) => {
      const [owner = '', repoName = ''] = (item.full_name || '').split('/');
      return {
        owner,
        repoName: stripGitSuffix(repoName),
        url: item.html_url || `https://github.com/${owner}/${repoName}`,
        stars: item.stargazers_count ?? 0,
        language: item.language ?? null,
        description: item.description ?? null,
      };
    });
  }, { label: `starred:${username}` });
}

// ─── Database operations ──────────────────────────────────────────

/**
 * Create a new repo entry from a GitHub URL + admin review +
 * tag identifiers. The flow:
 *
 *   1. Parse the URL to extract owner/repoName.
 *   2. Fetch live metadata from GitHub (fails fast if 404).
 *   3. Upsert into the DB by URL — re-POSTing the same URL
 *      updates the existing row instead of creating a duplicate.
 *   4. Reconcile the tag list: delete tags not in the input,
 *      create new ones, leave the rest alone.
 *
 * `tagIds` and `tagNames` are both accepted. `tagNames` creates
 * new tags on the fly (slugified) which is convenient for the
 * admin form when typing a brand-new topic.
 */
export async function createOrUpdateRepoFromUrl(params: {
  githubUrl: string;
  myReview: string;
  status: GithubRepoStatus;
  tagIds?: number[];
  tagNames?: string[];
}): Promise<unknown> {
  const { githubUrl, myReview, status } = params;
  // Allow empty review for DRAFT entries; require it for
  // PUBLISHED so the public feed always shows curated content.
  if (status === 'PUBLISHED' && (!myReview || !myReview.trim())) {
    throw new AppError('Vui long nhap bai hoc / nhan xet truoc khi xuat ban', 400, 'EMPTY_REVIEW');
  }

  const { owner, repoName } = parseRepoUrl(githubUrl);
  const meta = await fetchRepoMetadata(owner, repoName);
  if (!meta) {
    throw new AppError(
      `Khong tim thay repo "${owner}/${repoName}" tren GitHub`,
      404,
      'REPO_NOT_FOUND',
    );
  }

  // Resolve tag list. We need both the existing IDs and any
  // new names, deduplicated.
  const tagIdList = await resolveTagList(params.tagIds, params.tagNames);

  // Upsert on url. The unique constraint on `url` is what makes
  // this idempotent.
  const repo = await prisma.githubRepo.upsert({
    where: { url: meta.url },
    create: {
      repoName: meta.repoName,
      owner: meta.owner,
      url: meta.url,
      stars: meta.stars,
      language: meta.language,
      description: meta.description,
      myReview: (myReview || '').trim(),
      status,
      tags: tagIdList.length > 0
        ? { create: tagIdList.map((tagId) => ({ tagId })) }
        : undefined,
    },
    update: {
      repoName: meta.repoName,
      owner: meta.owner,
      stars: meta.stars,
      language: meta.language,
      description: meta.description,
      myReview: (myReview || '').trim(),
      status,
    },
  });

  // For an upsert, the `create.tags` path only runs on the
  // insert branch. On the update branch we need to reconcile
  // manually. We delete join rows that aren't in the new set
  // and create ones that are.
  if (tagIdList.length > 0) {
    await prisma.$transaction([
      prisma.githubRepoTag.deleteMany({
        where: {
          repoId: repo.id,
          tagId: { notIn: tagIdList },
        },
      }),
      ...tagIdList.map((tagId) =>
        prisma.githubRepoTag.upsert({
          where: { repoId_tagId: { repoId: repo.id, tagId } },
          create: { repoId: repo.id, tagId },
          update: {},
        }),
      ),
    ]);
  } else {
    // No tags requested → clear them.
    await prisma.githubRepoTag.deleteMany({ where: { repoId: repo.id } });
  }

  return getRepoById(repo.id);
}

/**
 * List repos for the public feed. Supports:
 *   - `status` filter (default PUBLISHED for public callers)
 *   - `tagId` filter (repos with this tag)
 *   - `tagSlug` filter (alternative to tagId, friendly for URLs)
 *   - `language` filter (exact match, case-insensitive)
 *   - `keyword` filter (substring on repoName + description, case-insensitive)
 *   - pagination via `page` + `pageSize`
 *   - `sort` (newest | oldest | most-stars | least-stars |
 *     name-asc | name-desc) — defaults to newest
 */
export async function listRepos(params: {
  status?: GithubRepoStatus;
  tagId?: number;
  tagSlug?: string;
  language?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
  sort?: 'newest' | 'oldest' | 'most-stars' | 'least-stars' | 'name-asc' | 'name-desc';
  isAdmin?: boolean;
}): Promise<{ items: unknown[]; total: number; page: number; pageSize: number; totalPages: number; sort: string }> {
  const {
    status = 'PUBLISHED',
    tagId,
    tagSlug,
    language,
    keyword,
    page = 1,
    pageSize = 12,
    sort = 'newest',
  } = params;

  const where: Prisma.GithubRepoWhereInput = { status };
  if (language) where.language = { equals: language, mode: 'insensitive' };
  if (keyword) {
    where.OR = [
      { repoName: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
    ];
  }
  if (tagId) {
    where.tags = { some: { tagId } };
  } else if (tagSlug) {
    where.tags = { some: { tag: { slug: tagSlug } } };
  }

  // Map the friendly sort key to a Prisma orderBy. The DB does
  // the heavy lifting so we don't pay an in-memory sort cost on
  // large result sets.
  const orderBy: Prisma.GithubRepoOrderByWithRelationInput = (() => {
    switch (sort) {
      case 'oldest': return { createdAt: 'asc' };
      case 'most-stars': return { stars: 'desc' };
      case 'least-stars': return { stars: 'asc' };
      case 'name-asc': return { repoName: 'asc' };
      case 'name-desc': return { repoName: 'desc' };
      case 'newest':
      default: return { createdAt: 'desc' };
    }
  })();

  // The pageSize cap depends on whether the caller is an admin
  // (200, so the admin dashboard can show all repos in one shot)
  // or a public user (50, to keep the public feed snappy).
  const isAdmin = !!params.isAdmin;
  const maxSize = isAdmin ? 200 : 50;
  const safePage = Math.max(1, page);
  const safeSize = Math.min(Math.max(1, pageSize), maxSize);
  const skip = (safePage - 1) * safeSize;

  const [items, total] = await Promise.all([
    prisma.githubRepo.findMany({
      where,
      orderBy,
      skip,
      take: safeSize,
      include: {
        tags: { include: { tag: true } },
      },
    }),
    prisma.githubRepo.count({ where }),
  ]);

  return {
    items: items.map(serializeRepo),
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.ceil(total / safeSize),
    sort,
  };
}

export async function getRepoById(id: string): Promise<unknown> {
  const repo = await prisma.githubRepo.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });
  if (!repo) throw new AppError('Repo khong ton tai', 404, 'NOT_FOUND');
  return serializeRepo(repo);
}

export async function getRepoByUrl(url: string): Promise<unknown | null> {
  const repo = await prisma.githubRepo.findUnique({
    where: { url },
    include: { tags: { include: { tag: true } } },
  });
  return repo ? serializeRepo(repo) : null;
}

export async function updateRepoStatus(id: string, status: GithubRepoStatus): Promise<unknown> {
  const exists = await prisma.githubRepo.findUnique({ where: { id } });
  if (!exists) throw new AppError('Repo khong ton tai', 404, 'NOT_FOUND');
  // If we're publishing a DRAFT that has an empty review,
  // refuse the transition so the public feed never shows a
  // blank review card.
  if (status === 'PUBLISHED' && (!exists.myReview || !exists.myReview.trim())) {
    throw new AppError(
      'Khong the publish khi review dang trong. Vui long nhap review truoc.',
      400,
      'EMPTY_REVIEW',
    );
  }
  const updated = await prisma.githubRepo.update({
    where: { id },
    data: { status },
    include: { tags: { include: { tag: true } } },
  });
  return serializeRepo(updated);
}

export async function deleteRepo(id: string): Promise<void> {
  const exists = await prisma.githubRepo.findUnique({ where: { id } });
  if (!exists) throw new AppError('Repo khong ton tai', 404, 'NOT_FOUND');
  await prisma.githubRepo.delete({ where: { id } });
}

/**
 * Update a repo's review + tags in place. Used by the admin
 * "Edit review" flow. Does NOT re-fetch from GitHub — the
 * admin can hit /sync to refresh metadata.
 *
 * Review can be empty for DRAFT entries. If the admin is editing
 * a PUBLISHED entry, we require a non-empty review.
 */
export async function updateRepoReview(params: {
  id: string;
  myReview: string;
  tagIds?: number[];
  tagNames?: string[];
}): Promise<unknown> {
  const exists = await prisma.githubRepo.findUnique({ where: { id: params.id } });
  if (!exists) throw new AppError('Repo khong ton tai', 404, 'NOT_FOUND');

  // Reject empty review when the repo is already PUBLISHED.
  if (exists.status === 'PUBLISHED' && (!params.myReview || !params.myReview.trim())) {
    throw new AppError('Khong the xoa review cua repo da publish. Hay chuyen ve DRAFT truoc.', 400, 'EMPTY_REVIEW');
  }

  const tagIdList = await resolveTagList(params.tagIds, params.tagNames);

  await prisma.$transaction([
    prisma.githubRepo.update({
      where: { id: params.id },
      data: { myReview: (params.myReview || '').trim() },
    }),
    prisma.githubRepoTag.deleteMany({
      where: { repoId: params.id, tagId: { notIn: tagIdList } },
    }),
    ...tagIdList.map((tagId) =>
      prisma.githubRepoTag.upsert({
        where: { repoId_tagId: { repoId: params.id, tagId } },
        create: { repoId: params.id, tagId },
        update: {},
      }),
    ),
  ]);

  return getRepoById(params.id);
}

/**
 * Re-fetch stars + language + description for every repo in the
 * database. The admin clicks "Sync all" in the dashboard to
 * refresh cached values.
 *
 * We deliberately don't update `myReview` here — that's editorial
 * content and shouldn't be clobbered by GitHub data.
 *
 * Concurrency is bounded so a token-authenticated user (5000/hr)
 * can still safely sync hundreds of repos in one run, and an
 * anonymous user (60/hr) will fail gracefully with a clear
 * per-repo error rather than 502-ing the whole batch.
 */
export async function syncAllRepoMetadata(): Promise<{
  total: number;
  updated: number;
  failed: Array<{ id: string; url: string; error: string }>;
}> {
  const repos = await prisma.githubRepo.findMany({
    select: { id: true, owner: true, repoName: true, url: true, stars: true },
  });

  let updated = 0;
  const failed: Array<{ id: string; url: string; error: string }> = [];

  // pMap: bounded-concurrency parallel map. Authenticated users
  // get a higher concurrency; anonymous users stay at 1 (sequential)
  // because their rate-limit budget is tiny.
  const concurrency = config.githubApiToken ? 5 : 1;
  await pMap(repos, concurrency, async (repo) => {
    try {
      const meta = await fetchRepoMetadata(repo.owner, repo.repoName);
      if (!meta) {
        failed.push({ id: repo.id, url: repo.url, error: 'Repo 404 tren GitHub' });
        return;
      }
      if (meta.stars === repo.stars && meta.language && meta.description) {
        // No change — skip the DB write to avoid useless churn.
        return;
      }
      await prisma.githubRepo.update({
        where: { id: repo.id },
        data: {
          stars: meta.stars,
          language: meta.language,
          description: meta.description,
        },
      });
      updated += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      failed.push({ id: repo.id, url: repo.url, error: message });
    }
  });

  return { total: repos.length, updated, failed };
}

/**
 * Pull the most recent starred repos for a GitHub user and save
 * them as DRAFT entries. We dedupe against the existing URL
 * unique index so re-running the flow doesn't create duplicates.
 */
export async function fetchStarredAsDrafts(
  username: string,
  limit: number = 10,
): Promise<{ inserted: number; skipped: number; items: unknown[] }> {
  const starred = await fetchRecentlyStarred(username, limit);
  if (starred.length === 0) {
    return { inserted: 0, skipped: 0, items: [] };
  }

  // Build a set of URLs we already have so we can skip them
  // without an INSERT-and-fail loop.
  const existing = await prisma.githubRepo.findMany({
    where: { url: { in: starred.map((s) => s.url) } },
    select: { url: true },
  });
  const existingUrls = new Set(existing.map((r) => r.url));

  let inserted = 0;
  let skipped = 0;
  const createdItems: unknown[] = [];

  for (const item of starred) {
    if (existingUrls.has(item.url)) {
      skipped += 1;
      continue;
    }
    const created = await prisma.githubRepo.create({
      data: {
        repoName: item.repoName,
        owner: item.owner,
        url: item.url,
        stars: item.stars,
        language: item.language,
        description: item.description,
        // Empty review is intentional — the admin will fill it
        // in via the edit modal. We mark it DRAFT so it doesn't
        // show up in the public feed.
        myReview: '',
        status: 'DRAFT',
      },
    });
    inserted += 1;
    createdItems.push(serializeRepo({ ...created, tags: [] }));
  }

  return { inserted, skipped, items: createdItems };
}

// ─── Helpers ──────────────────────────────────────────────────────

/**
 * Bounded-concurrency parallel map. Runs `worker` for each
 * element in `items` with at most `concurrency` inflight at
 * any time. Preserves the input order in the result.
 */
async function pMap<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  const workers: Array<Promise<void>> = [];
  for (let w = 0; w < concurrency; w += 1) {
    workers.push(
      (async () => {
        while (true) {
          const i = nextIndex;
          nextIndex += 1;
          if (i >= items.length) return;
          results[i] = await worker(items[i], i);
        }
      })(),
    );
  }
  await Promise.all(workers);
  return results;
}

/**
 * Convert an incoming `tagIds` and `tagNames` list into a list
 * of existing tag IDs, creating new tag rows on the fly for any
 * names that don't already exist. We slugify the names to keep
 * the URL-friendly column clean.
 */
async function resolveTagList(
  tagIds: number[] | undefined,
  tagNames: string[] | undefined,
): Promise<number[]> {
  const ids = new Set<number>();
  if (tagIds && tagIds.length > 0) {
    // Verify the IDs actually exist. We don't want a stray ID
    // to break the create.
    const existing = await prisma.tag.findMany({
      where: { id: { in: tagIds } },
      select: { id: true },
    });
    for (const t of existing) ids.add(t.id);
  }
  if (tagNames && tagNames.length > 0) {
    for (const raw of tagNames) {
      const name = raw.trim();
      if (!name) continue;
      const slug = slugify(name);
      // Upsert by slug so concurrent calls don't race two
      // creates with the same slug.
      const tag = await prisma.tag.upsert({
        where: { slug },
        create: { name, slug },
        update: {},
      });
      ids.add(tag.id);
    }
  }
  return Array.from(ids);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

/**
 * Public-facing shape for a repo. The DB stores FK joins
 * (`tags: GithubRepoTag[]`), but the API returns a flat
 * `tags: Tag[]` so the client doesn't have to unwrap the join.
 */
function serializeRepo(repo: {
  id: string;
  repoName: string;
  owner: string;
  url: string;
  stars: number;
  language: string | null;
  description: string | null;
  myReview: string;
  status: GithubRepoStatus;
  createdAt: Date;
  updatedAt: Date;
  tags?: Array<{ tag: { id: number; name: string; slug: string } }>;
}) {
  return {
    id: repo.id,
    repoName: repo.repoName,
    owner: repo.owner,
    url: repo.url,
    stars: repo.stars,
    language: repo.language,
    description: repo.description,
    myReview: repo.myReview,
    status: repo.status,
    createdAt: repo.createdAt,
    updatedAt: repo.updatedAt,
    tags: (repo.tags || []).map((t) => ({
      id: t.tag.id,
      name: t.tag.name,
      slug: t.tag.slug,
    })),
  };
}
