/**
 * CV Builder — GitHub import (Phase 2c).
 * ─────────────────────────────────────────────────────────────────────────
 * This user base is engineers — their GitHub IS their evidence. We import a
 * user's PUBLIC repos by username (no OAuth redirect needed — public repos are
 * exactly the CV-relevant ones, and this avoids reconfiguring the platform's
 * existing GitHub OAuth login app). We score repos by SUBSTANCE and surface only
 * real ones — tutorial follow-alongs, empty forks and abandoned one-file repos
 * are not CV material and suggesting them wastes the user's attention.
 *
 * Unauthenticated GitHub REST API (60 req/hr/IP is ample for a single user's
 * import); results are cached in CvGitHubProfile so we don't refetch.
 */
import { prisma } from '../../config/database.js';
import { getOrCreateProfile } from './profile.service.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { z } from 'zod';

const GH = 'https://api.github.com';
const UA = 'cuongthai-cv-builder';

interface GhRepo {
  name: string; full_name: string; html_url: string; description: string | null;
  fork: boolean; archived: boolean; stargazers_count: number; forks_count: number;
  language: string | null; size: number; topics?: string[]; pushed_at: string; created_at: string;
}

export interface ScoredRepo {
  name: string; url: string; description: string | null; language: string | null;
  stars: number; topics: string[]; pushedAt: string; score: number; reason: string;
  hasReadme: boolean;
}

async function ghFetch(path: string): Promise<Response> {
  return fetch(`${GH}${path}`, { headers: { 'user-agent': UA, accept: 'application/vnd.github+json' } });
}

/** Score a repo by substance. Higher = more likely to be real CV material. */
function scoreRepo(r: GhRepo): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];
  if (r.fork) { score -= 3; reasons.push('là fork'); } else { score += 3; reasons.push('code của bạn'); }
  if (r.archived) score -= 1;
  if (r.description) { score += 2; } else { reasons.push('thiếu mô tả'); }
  if (r.size > 300) score += 2; else if (r.size < 30) { score -= 1; reasons.push('rất nhỏ'); }
  score += Math.min(r.stargazers_count, 20) * 0.4;
  if (r.stargazers_count > 0) reasons.push(`${r.stargazers_count}★`);
  if (r.language) score += 1;
  const yearsSincePush = (Date.parse('2026-07-16') - Date.parse(r.pushed_at)) / (365 * 864e5);
  if (yearsSincePush < 2) score += 1;
  return { score: Math.round(score * 10) / 10, reason: reasons.join(', ') };
}

export async function syncGitHub(userId: number, usernameRaw: string) {
  const username = String(usernameRaw).trim().replace(/^@/, '').replace(/^https?:\/\/github\.com\//i, '').replace(/\/.*$/, '');
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) throw new BadRequestError('Tên GitHub không hợp lệ');

  const res = await ghFetch(`/users/${username}/repos?sort=pushed&per_page=100&type=owner`);
  if (res.status === 404) throw new NotFoundError('Không tìm thấy user GitHub này');
  if (res.status === 403) throw new BadRequestError('GitHub tạm giới hạn tần suất — thử lại sau vài phút.');
  if (!res.ok) throw new BadRequestError('Không lấy được dữ liệu GitHub');
  const repos = (await res.json()) as GhRepo[];

  const scored: ScoredRepo[] = repos
    .map((r) => {
      const { score, reason } = scoreRepo(r);
      return {
        name: r.name, url: r.html_url, description: r.description, language: r.language,
        stars: r.stargazers_count, topics: r.topics ?? [], pushedAt: r.pushed_at, score, reason, hasReadme: false,
      };
    })
    .filter((r) => r.score >= 2) // drop forks/empty/tutorial noise
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  // Language profile across all owned repos (for the skills cross-check).
  const languageProfile: Record<string, number> = {};
  for (const r of repos) if (!r.fork && r.language) languageProfile[r.language] = (languageProfile[r.language] ?? 0) + 1;

  // README presence for the top few (cheap quality signal). Best-effort.
  for (const r of scored.slice(0, 8)) {
    try {
      const rr = await ghFetch(`/repos/${username}/${r.name}/readme`);
      if (rr.ok) { const j = (await rr.json()) as { size?: number }; r.hasReadme = (j.size ?? 0) > 300; if (r.hasReadme) r.score += 1; }
    } catch { /* ignore per-repo README failures */ }
  }
  scored.sort((a, b) => b.score - a.score);

  await prisma.cvGitHubProfile.upsert({
    where: { userId },
    update: { username, repos: scored as unknown as object, languageProfile: languageProfile as unknown as object, lastSyncedAt: new Date() },
    create: { userId, username, repos: scored as unknown as object, languageProfile: languageProfile as unknown as object, lastSyncedAt: new Date() },
  });

  return { username, candidates: scored, languageProfile };
}

export async function getGitHubProfile(userId: number) {
  const p = await prisma.cvGitHubProfile.findUnique({ where: { userId } });
  if (!p) return null;
  return { username: p.username, candidates: (p.repos ?? []) as unknown as ScoredRepo[], languageProfile: (p.languageProfile ?? {}) as Record<string, number>, lastSyncedAt: p.lastSyncedAt };
}

const addSchema = z.object({
  name: z.string().trim().min(1).max(120),
  url: z.string().trim().max(300).optional().nullable(),
  description: z.string().trim().max(1000).optional().nullable(),
  language: z.string().trim().max(60).optional().nullable(),
  topics: z.array(z.string().trim().max(60)).max(30).optional(),
});

/** Create a PROJECT item from a chosen repo. The user then refines it (or runs
 *  intake against it to extract what the repo doesn't say). Not fabricated —
 *  seeded only from the repo's own metadata. */
export async function addRepoAsItem(userId: number, body: unknown) {
  const data = addSchema.parse(body);
  const profile = await getOrCreateProfile(userId);
  const techStack = [...new Set([data.language, ...(data.topics ?? [])].filter(Boolean) as string[])].slice(0, 12);
  return prisma.cvItem.create({
    data: {
      profileId: profile.id,
      kind: 'OPEN_SOURCE',
      title: data.name,
      url: data.url ?? null,
      techStack,
      // The repo description becomes a starting bullet (unverified — the user
      // should sharpen it, ideally via intake). Not invented; it's their repo's
      // own description.
      bullets: data.description ? { create: [{ text: data.description, verified: false, aiGenerated: false }] } : undefined,
      sortOrder: profile.items.length,
    },
    include: { bullets: true },
  });
}
