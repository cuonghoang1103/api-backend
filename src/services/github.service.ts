// ─── GitHub Repo Hub service ───────────────────────────────────────
//
// All interactions with the public GitHub REST API
// (api.github.com) and the database live here. The route layer
// (github.routes.ts) is a thin adapter that just parses the
// request, calls a service method, and serializes the result.
//
// Why a service:
//   1. The GitHub API is rate-limited (60/hr unauthenticated,
//      5000/hr with a token). Centralizing calls makes it easy
//      to add caching or backoff later.
//   2. The same `parseRepoUrl` + `fetchRepoMetadata` is reused
//      by the manual POST endpoint AND the auto-fetch-starred
//      flow, so we want the parsing in one place.
//   3. Tests (when added) can stub the service without touching
//      HTTP plumbing.
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

// ─── GitHub API call ──────────────────────────────────────────────

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
 */
export async function fetchRepoMetadata(
  owner: string,
  repoName: string,
): Promise<GithubRepoMetadata | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'cuongthai-repo-hub',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (config.githubApiToken) {
    headers.Authorization = `Bearer ${config.githubApiToken}`;
  }

  const apiUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}`;
  const res = await fetch(apiUrl, { headers });

  // 404 → not found. Return null so the route can render a
  // precise "Repo not found on GitHub" error.
  if (res.status === 404) return null;

  if (!res.ok) {
    // For other errors (403 rate limit, 5xx), throw so the
    // route can return a 502 with a generic message. We don't
    // leak the upstream status code to the client.
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
  };
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
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'cuongthai-repo-hub',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (config.githubApiToken) {
    headers.Authorization = `Bearer ${config.githubApiToken}`;
  }

  const perPage = Math.min(Math.max(limit, 1), 30);
  const apiUrl =
    `https://api.github.com/users/${encodeURIComponent(username)}/starred?per_page=${perPage}&sort=created&direction=desc`;

  const res = await fetch(apiUrl, { headers });

  if (res.status === 404) {
    throw new AppError(
      `GitHub user "${username}" khong ton tai`,
      404,
      'USER_NOT_FOUND',
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
  if (!myReview || !myReview.trim()) {
    throw new AppError('Vui long nhap bai hoc / nhan xet', 400, 'EMPTY_REVIEW');
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
      myReview: myReview.trim(),
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
      myReview: myReview.trim(),
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
 */
export async function listRepos(params: {
  status?: GithubRepoStatus;
  tagId?: number;
  tagSlug?: string;
  language?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: unknown[]; total: number; page: number; pageSize: number; totalPages: number }> {
  const {
    status = 'PUBLISHED',
    tagId,
    tagSlug,
    language,
    keyword,
    page = 1,
    pageSize = 12,
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

  const safePage = Math.max(1, page);
  const safeSize = Math.min(Math.max(1, pageSize), 50);
  const skip = (safePage - 1) * safeSize;

  const [items, total] = await Promise.all([
    prisma.githubRepo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
 */
export async function updateRepoReview(params: {
  id: string;
  myReview: string;
  tagIds?: number[];
  tagNames?: string[];
}): Promise<unknown> {
  const exists = await prisma.githubRepo.findUnique({ where: { id: params.id } });
  if (!exists) throw new AppError('Repo khong ton tai', 404, 'NOT_FOUND');

  if (!params.myReview || !params.myReview.trim()) {
    throw new AppError('Vui long nhap bai hoc / nhan xet', 400, 'EMPTY_REVIEW');
  }

  const tagIdList = await resolveTagList(params.tagIds, params.tagNames);

  await prisma.$transaction([
    prisma.githubRepo.update({
      where: { id: params.id },
      data: { myReview: params.myReview.trim() },
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

  // Sequential to stay well under the rate limit. With a
  // personal access token (5000/hr) you can safely process
  // thousands of repos in one run; without one (60/hr) the
  // request will start failing around repo #50.
  for (const repo of repos) {
    try {
      const meta = await fetchRepoMetadata(repo.owner, repo.repoName);
      if (!meta) {
        failed.push({ id: repo.id, url: repo.url, error: 'Repo 404 tren GitHub' });
        continue;
      }
      if (meta.stars === repo.stars) {
        // No change — skip the DB write to avoid useless churn.
        continue;
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
  }

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
