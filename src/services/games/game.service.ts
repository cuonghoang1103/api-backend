/**
 * Game Library ("Playground") — service layer.
 *
 * Public reads expose PUBLISHED + COMING_SOON (the portal renders coming-soon
 * cards in a locked state); DRAFT is admin-only. Scores are recorded per play
 * in `game_plays` and may be anonymous.
 *
 * Score integrity: the client is untrusted, so every submitted score is capped
 * server-side per game (SCORE_CAPS below) and must be a non-negative integer.
 * The client-side registry mirrors these numbers for display only — THIS map is
 * the enforcement point.
 */
import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

/** Per-game score ceilings, keyed by componentKey. Anything above is rejected. */
const SCORE_CAPS: Record<string, number> = {
  snake: 2_000,
  'memory-card': 10_000,
  'math-blitz': 5_000,
  projectile: 20_000,
  'tic-tac-toe': 100,
};
const DEFAULT_SCORE_CAP = 50_000;

export function scoreCapFor(componentKey: string | null | undefined): number {
  if (!componentKey) return DEFAULT_SCORE_CAP;
  return SCORE_CAPS[componentKey] ?? DEFAULT_SCORE_CAP;
}

const categorySelect = {
  select: { id: true, slug: true, name: true, nameVi: true, icon: true, color: true },
} as const;

/** Used only to decide whether a viewer may preview a DRAFT game. */
export async function isAdminUser(userId: number): Promise<boolean> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { roles: { select: { role: { select: { name: true } } } } },
  });
  return !!u?.roles.some((r) => /admin/i.test(r.role.name));
}

/** Fields the public portal needs for a card. */
const publicGameSelect = {
  id: true,
  slug: true,
  title: true,
  titleVi: true,
  description: true,
  descriptionVi: true,
  coverImage: true,
  difficulty: true,
  status: true,
  featured: true,
  sortOrder: true,
  playCount: true,
  kind: true,
  componentKey: true,
  estimatedTime: true,
  techStack: true,
  tags: true,
  createdAt: true,
  category: categorySelect,
} as const;

/** Statuses a non-admin may see. */
const PUBLIC_STATUSES: Prisma.EnumGameStatusFilter = { in: ['PUBLISHED', 'COMING_SOON'] };

// ─── Public reads ──────────────────────────────────────────────────

export async function listPublicGames(opts: { categorySlug?: string; q?: string; featured?: boolean }) {
  const where: Prisma.GameWhereInput = { status: PUBLIC_STATUSES };
  if (opts.categorySlug) where.category = { slug: opts.categorySlug };
  if (opts.featured) where.featured = true;
  if (opts.q) {
    const kw = opts.q.trim();
    where.OR = [
      { title: { contains: kw, mode: 'insensitive' } },
      { titleVi: { contains: kw, mode: 'insensitive' } },
      { description: { contains: kw, mode: 'insensitive' } },
      { tags: { has: kw } },
    ];
  }
  return prisma.game.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    select: publicGameSelect,
  });
}

export async function listCategories() {
  const cats = await prisma.gameCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true, slug: true, name: true, nameVi: true, icon: true, color: true, sortOrder: true,
      _count: { select: { games: { where: { status: PUBLIC_STATUSES } } } },
    },
  });
  return cats.map((c) => ({
    id: c.id, slug: c.slug, name: c.name, nameVi: c.nameVi,
    icon: c.icon, color: c.color, sortOrder: c.sortOrder,
    gameCount: c._count.games,
  }));
}

/** Portal hero stats. */
export async function getStats() {
  const [games, categories, plays] = await Promise.all([
    prisma.game.count({ where: { status: PUBLIC_STATUSES } }),
    prisma.gameCategory.count(),
    prisma.game.aggregate({ where: { status: PUBLIC_STATUSES }, _sum: { playCount: true } }),
  ]);
  return { games, categories, totalPlays: plays._sum.playCount ?? 0 };
}

/** Single game by slug. `includeDrafts` is admin-only (draft preview). */
export async function getGameBySlug(slug: string, includeDrafts = false) {
  const game = await prisma.game.findUnique({
    where: { slug },
    select: {
      ...publicGameSelect,
      longDescription: true,
      controls: true,
      controlsVi: true,
      iframeSrc: true,
      screenshots: true,
      updatedAt: true,
    },
  });
  if (!game) return null;
  if (!includeDrafts && game.status === 'DRAFT') return null;
  return game;
}

export async function getRelatedGames(gameId: number, limit = 4) {
  const base = await prisma.game.findUnique({ where: { id: gameId }, select: { categoryId: true } });
  if (!base) return [];
  return prisma.game.findMany({
    where: { status: PUBLIC_STATUSES, id: { not: gameId }, categoryId: base.categoryId },
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
    take: limit,
    select: publicGameSelect,
  });
}

// ─── Plays + scores ────────────────────────────────────────────────

/** Count one play. Client debounces to once per session per game. */
export async function recordPlay(gameId: number) {
  const game = await prisma.game.findUnique({ where: { id: gameId }, select: { id: true, status: true } });
  if (!game || game.status === 'DRAFT') throw new AppError('Game not found', 404, 'GAME_NOT_FOUND');
  const updated = await prisma.game.update({
    where: { id: gameId },
    data: { playCount: { increment: 1 } },
    select: { playCount: true },
  });
  return { playCount: updated.playCount };
}

/**
 * Record a score. The score is clamped to the per-game cap rather than
 * rejected outright, so a legitimate edge-case high score still lands while a
 * forged one can't poison the leaderboard.
 */
export async function submitScore(opts: { gameId: number; userId?: number | null; score: number; duration?: number | null }) {
  const game = await prisma.game.findUnique({
    where: { id: opts.gameId },
    select: { id: true, status: true, componentKey: true },
  });
  if (!game || game.status !== 'PUBLISHED') throw new AppError('Game not found', 404, 'GAME_NOT_FOUND');

  const cap = scoreCapFor(game.componentKey);
  const score = Math.max(0, Math.min(cap, Math.floor(opts.score)));
  const duration =
    opts.duration != null && Number.isFinite(opts.duration)
      ? Math.max(0, Math.min(86_400, Math.floor(opts.duration)))
      : null;

  const play = await prisma.gamePlay.create({
    data: { gameId: opts.gameId, userId: opts.userId ?? null, score, duration },
    select: { id: true, score: true, duration: true, playedAt: true },
  });
  return { play, capped: Math.floor(opts.score) > cap, cap };
}

interface LeaderRow {
  id: number;
  score: number;
  playedAt: Date;
  userId: number | null;
  user: { id: number; username: string; displayName: string | null; fullName: string | null; avatarUrl: string | null } | null;
}

function toLeaderEntry(r: LeaderRow, rank: number) {
  return {
    rank,
    id: r.id,
    score: r.score,
    playedAt: r.playedAt,
    userId: r.userId,
    player: r.user
      ? { id: r.user.id, name: r.user.displayName || r.user.fullName || r.user.username, avatarUrl: r.user.avatarUrl }
      : null, // null → render as "Anonymous"
  };
}

const leaderUserSelect = {
  select: { id: true, username: true, displayName: true, fullName: true, avatarUrl: true },
} as const;

/** Top scores for one game. */
export async function leaderboardForGame(gameId: number, limit = 20) {
  const rows = await prisma.gamePlay.findMany({
    where: { gameId },
    orderBy: [{ score: 'desc' }, { playedAt: 'asc' }],
    take: Math.min(100, Math.max(1, limit)),
    select: { id: true, score: true, playedAt: true, userId: true, user: leaderUserSelect },
  });
  return rows.map((r, i) => toLeaderEntry(r as LeaderRow, i + 1));
}

/** Top scores across every game — the portal teaser. */
export async function leaderboardGlobal(limit = 5) {
  const rows = await prisma.gamePlay.findMany({
    where: { game: { status: 'PUBLISHED' } },
    orderBy: [{ score: 'desc' }, { playedAt: 'asc' }],
    take: Math.min(50, Math.max(1, limit)),
    select: {
      id: true, score: true, playedAt: true, userId: true,
      user: leaderUserSelect,
      game: { select: { id: true, slug: true, title: true, titleVi: true } },
    },
  });
  return rows.map((r, i) => ({ ...toLeaderEntry(r as unknown as LeaderRow, i + 1), game: r.game }));
}

/** Best score for a game (used by the featured spotlight). */
export async function bestScoreFor(gameId: number): Promise<number | null> {
  const agg = await prisma.gamePlay.aggregate({ where: { gameId }, _max: { score: true } });
  return agg._max.score ?? null;
}

// ─── Admin ─────────────────────────────────────────────────────────

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function ensureUniqueSlug(base: string, excludeId?: number): Promise<string> {
  const root = slugify(base) || `game-${Date.now()}`;
  let candidate = root;
  let n = 1;
  while (true) {
    const hit = await prisma.game.findFirst({
      where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    });
    if (!hit) return candidate;
    candidate = `${root}-${n++}`;
  }
}

export async function listAdminGames(opts: { page: number; size: number; status?: string; categoryId?: number; q?: string }) {
  const where: Prisma.GameWhereInput = {};
  if (opts.status) where.status = opts.status as Prisma.GameWhereInput['status'];
  if (opts.categoryId) where.categoryId = opts.categoryId;
  if (opts.q) where.title = { contains: opts.q.trim(), mode: 'insensitive' };

  const [items, total] = await Promise.all([
    prisma.game.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip: opts.page * opts.size,
      take: opts.size,
      include: { category: categorySelect },
    }),
    prisma.game.count({ where }),
  ]);
  return { items, total };
}

/** Dashboard widgets: totals + a 14-day play histogram. */
export async function getAdminStats() {
  const since7 = new Date(Date.now() - 7 * 86_400_000);
  const since14 = new Date(Date.now() - 14 * 86_400_000);

  const [total, published, drafts, comingSoon, playsAll, plays7, recent] = await Promise.all([
    prisma.game.count(),
    prisma.game.count({ where: { status: 'PUBLISHED' } }),
    prisma.game.count({ where: { status: 'DRAFT' } }),
    prisma.game.count({ where: { status: 'COMING_SOON' } }),
    prisma.gamePlay.count(),
    prisma.gamePlay.count({ where: { playedAt: { gte: since7 } } }),
    prisma.gamePlay.findMany({ where: { playedAt: { gte: since14 } }, select: { playedAt: true } }),
  ]);

  // Bucket into 14 day-slots (oldest → newest) for the mini bar chart.
  const buckets: { date: string; plays: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    d.setHours(0, 0, 0, 0);
    buckets.push({ date: d.toISOString().slice(0, 10), plays: 0 });
  }
  const idx = new Map(buckets.map((b, i) => [b.date, i]));
  for (const p of recent) {
    const key = new Date(p.playedAt).toISOString().slice(0, 10);
    const i = idx.get(key);
    if (i !== undefined) buckets[i].plays++;
  }

  return { total, published, drafts, comingSoon, playsAll, plays7, daily: buckets };
}

export async function reorderGames(items: { id: number; sortOrder: number }[]) {
  await prisma.$transaction(
    items.map((it) =>
      prisma.game.update({ where: { id: it.id }, data: { sortOrder: it.sortOrder } }),
    ),
  );
  return { updated: items.length };
}

export async function deleteCategory(id: number) {
  const games = await prisma.game.count({ where: { categoryId: id } });
  if (games > 0) {
    // The FK is ON DELETE RESTRICT; surface a usable message instead of a 500.
    throw new AppError(
      `Không thể xoá: còn ${games} game thuộc chuyên mục này. Hãy chuyển chúng sang chuyên mục khác trước.`,
      400,
      'CATEGORY_NOT_EMPTY',
    );
  }
  await prisma.gameCategory.delete({ where: { id } });
  return { id };
}
