import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import * as svc from '../services/games/game.service.js';

/**
 * Game Library ("Playground") — public + admin REST API.
 *
 * Exports THREE routers, mounted in src/index.ts:
 *   publicRouter        → /api/v1/games            (read + play/score)
 *   adminRouter         → /api/v1/admin/games      (CRUD, ROLE_ADMIN)
 *   adminCategoryRouter → /api/v1/admin/game-categories
 *
 * Note on the master prompt: it specified Next.js App Router route handlers
 * (/api/admin/games). This project's business logic lives in this Express
 * backend and Next only proxies /api/v1/* to it, so the endpoints live here —
 * matching every other module (see techTrends.routes.ts) rather than adding a
 * second, parallel API surface.
 */

// ─── Rate-limit key ────────────────────────────────────────────────
// Mirrors `clientIpKey` in src/index.ts: use the RIGHTMOST X-Forwarded-For
// entry (written by our own Nginx). The leftmost entry is client-supplied and
// spoofable, so keying on it would let anyone bypass the limiter. Duplicated
// rather than imported because index.ts imports these routers (circular).
const clientIpKey = (req: Request): string => {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || 'unknown';
};

/** Score/play submission is the only publicly writable surface here. */
const playLimiter = rateLimit({
  windowMs: 60_000,
  max: 40, // generous for real play, hostile to scripted score spam
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientIpKey,
  message: { success: false, message: 'Bạn thao tác quá nhanh, thử lại sau ít giây.', code: 'RATE_LIMIT_EXCEEDED' },
});

function intParam(raw: string, what = 'id'): number {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) throw new AppError(`Invalid ${what}`, 400, 'INVALID_ID');
  return n;
}
function userIdOf(req: unknown): number | null {
  return (req as { userId?: number }).userId ?? null;
}

// ═══════════════════════════════════════════════════════════════════
// Public router — /api/v1/games
// ═══════════════════════════════════════════════════════════════════
const publicRouter = Router();

// Static paths first so they can't be shadowed by /:id patterns.

// GET /api/v1/games — catalogue (PUBLISHED + COMING_SOON).
publicRouter.get('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await svc.listPublicGames({
      categorySlug: req.query.category ? String(req.query.category) : undefined,
      q: req.query.q ? String(req.query.q) : undefined,
      featured: req.query.featured === 'true',
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// GET /api/v1/games/categories — with published game counts.
publicRouter.get('/categories', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.listCategories() });
  } catch (e) { next(e); }
});

// GET /api/v1/games/stats — hero band counters.
publicRouter.get('/stats', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getStats() });
  } catch (e) { next(e); }
});

// GET /api/v1/games/leaderboard — top scores across all games.
publicRouter.get('/leaderboard', async (req, res: Response<ApiResponse>, next) => {
  try {
    const limit = parseInt(String(req.query.limit ?? '5'), 10) || 5;
    res.json({ success: true, data: await svc.leaderboardGlobal(limit) });
  } catch (e) { next(e); }
});

// GET /api/v1/games/by-slug/:slug — single game. Admins may preview DRAFTs.
publicRouter.get('/by-slug/:slug', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const slug = String(req.params.slug || '').trim();
    if (!slug) throw new AppError('Invalid slug', 400, 'INVALID_SLUG');

    let game = await svc.getGameBySlug(slug, false);
    if (!game) {
      // Only pay for the admin lookup when the game isn't publicly visible.
      const uid = userIdOf(req);
      if (uid && (await svc.isAdminUser(uid))) game = await svc.getGameBySlug(slug, true);
    }
    if (!game) throw new AppError('Game not found', 404, 'GAME_NOT_FOUND');

    const bestScore = await svc.bestScoreFor(game.id);
    res.json({ success: true, data: { ...game, bestScore } });
  } catch (e) { next(e); }
});

// GET /api/v1/games/:id/related
publicRouter.get('/:id/related', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getRelatedGames(intParam(req.params.id)) });
  } catch (e) { next(e); }
});

// GET /api/v1/games/:id/leaderboard — top 20 for one game.
publicRouter.get('/:id/leaderboard', async (req, res: Response<ApiResponse>, next) => {
  try {
    const limit = parseInt(String(req.query.limit ?? '20'), 10) || 20;
    res.json({ success: true, data: await svc.leaderboardForGame(intParam(req.params.id), limit) });
  } catch (e) { next(e); }
});

// POST /api/v1/games/:id/play — count one play. The client guards this to once
// per session per game via sessionStorage; the limiter is the backstop.
publicRouter.post('/:id/play', playLimiter, async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.recordPlay(intParam(req.params.id)) });
  } catch (e) { next(e); }
});

// POST /api/v1/games/:id/score — submit a run's score. Public (anonymous plays
// allowed); score is clamped server-side to the per-game cap.
const scoreSchema = z.object({
  score: z.number().int().min(0).max(10_000_000),
  duration: z.number().int().min(0).max(86_400).optional().nullable(),
});
publicRouter.post('/:id/score', playLimiter, optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const parsed = scoreSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError('Dữ liệu điểm không hợp lệ', 400, 'INVALID_SCORE');
    const data = await svc.submitScore({
      gameId: intParam(req.params.id),
      userId: userIdOf(req),
      score: parsed.data.score,
      duration: parsed.data.duration ?? null,
    });
    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
});

// ═══════════════════════════════════════════════════════════════════
// Admin router — /api/v1/admin/games
// ═══════════════════════════════════════════════════════════════════
const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin('ROLE_ADMIN'));

const gameBodySchema = z.object({
  title: z.string().min(1).max(160),
  titleVi: z.string().max(160).optional().nullable(),
  slug: z.string().max(160).optional().nullable(),
  description: z.string().min(1),
  descriptionVi: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
  coverImage: z.string().max(500).optional().nullable(),
  screenshots: z.array(z.string().max(500)).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'COMING_SOON']).optional(),
  kind: z.enum(['REACT', 'IFRAME']).optional(),
  componentKey: z.string().max(64).optional().nullable(),
  iframeSrc: z.string().max(500).optional().nullable(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  estimatedTime: z.string().max(40).optional().nullable(),
  techStack: z.array(z.string().max(60)).optional(),
  tags: z.array(z.string().max(40)).optional(),
  controls: z.string().optional().nullable(),
  controlsVi: z.string().optional().nullable(),
  categoryId: z.number().int(),
});

// GET /api/v1/admin/games — paginated + filterable.
adminRouter.get('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const page = Math.max(0, parseInt(String(req.query.page ?? '0'), 10) || 0);
    const size = Math.min(100, Math.max(1, parseInt(String(req.query.size ?? '20'), 10) || 20));
    const { items, total } = await svc.listAdminGames({
      page, size,
      status: req.query.status ? String(req.query.status) : undefined,
      categoryId: req.query.categoryId ? parseInt(String(req.query.categoryId), 10) : undefined,
      q: req.query.q ? String(req.query.q) : undefined,
    });
    res.json({
      success: true,
      data: items,
      pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) },
    });
  } catch (e) { next(e); }
});

// GET /api/v1/admin/games/stats — dashboard widgets.
adminRouter.get('/stats', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.getAdminStats() });
  } catch (e) { next(e); }
});

// POST /api/v1/admin/games/reorder — persist drag-and-drop order.
const reorderSchema = z.object({
  items: z.array(z.object({ id: z.number().int(), sortOrder: z.number().int() })).min(1).max(500),
});
adminRouter.post('/reorder', async (req, res: Response<ApiResponse>, next) => {
  try {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError('Payload sắp xếp không hợp lệ', 400, 'INVALID_REORDER');
    res.json({ success: true, data: await svc.reorderGames(parsed.data.items) });
  } catch (e) { next(e); }
});

// POST /api/v1/admin/games — create.
adminRouter.post('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const parsed = gameBodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ', 400, 'INVALID_BODY');
    }
    const b = parsed.data;
    const slug = await svc.ensureUniqueSlug(b.slug?.trim() || b.title);
    const game = await prisma.game.create({
      data: {
        ...b,
        slug,
        screenshots: b.screenshots ?? [],
        techStack: b.techStack ?? [],
        tags: b.tags ?? [],
      },
      include: { category: true },
    });
    res.status(201).json({ success: true, data: game });
  } catch (e) { next(e); }
});

// GET /api/v1/admin/games/:id
adminRouter.get('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const game = await prisma.game.findUnique({
      where: { id: intParam(req.params.id) },
      include: { category: true },
    });
    if (!game) throw new AppError('Game not found', 404, 'GAME_NOT_FOUND');
    res.json({ success: true, data: game });
  } catch (e) { next(e); }
});

// PATCH /api/v1/admin/games/:id — partial update (also powers quick toggles).
adminRouter.patch('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = intParam(req.params.id);
    const existing = await prisma.game.findUnique({ where: { id }, select: { id: true, title: true, slug: true } });
    if (!existing) throw new AppError('Game not found', 404, 'GAME_NOT_FOUND');

    const parsed = gameBodySchema.partial().safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ', 400, 'INVALID_BODY');
    }
    // The slug changes ONLY when the admin edits it explicitly. Renaming a
    // title must never silently break an existing /games/<slug> URL.
    const { slug: rawSlug, ...rest } = parsed.data;
    let nextSlug: string | undefined;
    if (rawSlug != null && rawSlug.trim() && rawSlug.trim() !== existing.slug) {
      nextSlug = await svc.ensureUniqueSlug(rawSlug.trim(), id);
    }

    const game = await prisma.game.update({
      where: { id },
      data: { ...rest, ...(nextSlug ? { slug: nextSlug } : {}) },
      include: { category: true },
    });
    res.json({ success: true, data: game });
  } catch (e) { next(e); }
});

// DELETE /api/v1/admin/games/:id
adminRouter.delete('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = intParam(req.params.id);
    const existing = await prisma.game.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new AppError('Game not found', 404, 'GAME_NOT_FOUND');
    await prisma.game.delete({ where: { id } }); // plays cascade
    res.json({ success: true, data: { id } });
  } catch (e) { next(e); }
});

// ═══════════════════════════════════════════════════════════════════
// Admin categories — /api/v1/admin/game-categories
// ═══════════════════════════════════════════════════════════════════
const adminCategoryRouter = Router();
adminCategoryRouter.use(authenticate, requireAdmin('ROLE_ADMIN'));

const categorySchema = z.object({
  name: z.string().min(1).max(80),
  nameVi: z.string().max(80).optional().nullable(),
  slug: z.string().max(80).optional().nullable(),
  icon: z.string().max(40).optional().nullable(),
  color: z.string().max(16).optional().nullable(),
  sortOrder: z.number().int().optional(),
});

adminCategoryRouter.get('/', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const cats = await prisma.gameCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { games: true } } },
    });
    res.json({ success: true, data: cats });
  } catch (e) { next(e); }
});

adminCategoryRouter.post('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) throw new AppError('Dữ liệu không hợp lệ', 400, 'INVALID_BODY');
    const b = parsed.data;
    const slug = svc.slugify(b.slug?.trim() || b.name);
    const dup = await prisma.gameCategory.findUnique({ where: { slug }, select: { id: true } });
    if (dup) throw new AppError('Slug chuyên mục đã tồn tại', 400, 'SLUG_TAKEN');
    const cat = await prisma.gameCategory.create({ data: { ...b, slug } });
    res.status(201).json({ success: true, data: cat });
  } catch (e) { next(e); }
});

adminCategoryRouter.patch('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = intParam(req.params.id);
    const parsed = categorySchema.partial().safeParse(req.body);
    if (!parsed.success) throw new AppError('Dữ liệu không hợp lệ', 400, 'INVALID_BODY');
    // `slug` is non-nullable in the schema: only set it when a real value came
    // in (the rest of the fields are nullable, so null passes through fine).
    const { slug: rawSlug, ...rest } = parsed.data;
    const cat = await prisma.gameCategory.update({
      where: { id },
      data: { ...rest, ...(rawSlug?.trim() ? { slug: svc.slugify(rawSlug) } : {}) },
    });
    res.json({ success: true, data: cat });
  } catch (e) { next(e); }
});

adminCategoryRouter.delete('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await svc.deleteCategory(intParam(req.params.id)) });
  } catch (e) { next(e); }
});

export { publicRouter, adminRouter, adminCategoryRouter };
export default publicRouter;
