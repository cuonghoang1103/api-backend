import { Router, type Response } from 'express';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import { isProEffective } from '../services/pro.service.js';
import {
  listPublic,
  getBySlug,
  getRelated,
  togglePostLike,
  adminList,
  adminGet,
  createPost,
  updatePost,
  deletePost,
  setStatus,
  listSeries,
  createSeries,
  updateSeries,
  deleteSeries,
  VOICE_TYPES,
  VOICE_MEDIA_KINDS,
} from '../services/voiceHub/voice.service.js';
import { generateMeta, summarizePost, aiStatus } from '../services/voiceHub/ai.service.js';
import {
  listComments,
  createComment,
  editComment,
  deleteComment,
  toggleLike,
} from '../services/voiceHub/comment.service.js';

/**
 * Voice Hub — public + admin REST API.
 *
 * Two routers, mounted separately in src/index.ts:
 *   - `publicRouter` → /api/v1/voice        (read + auth-gated comments/likes)
 *   - `adminRouter`  → /api/v1/admin/voice  (full CRUD, ROLE_ADMIN only)
 */

function reqUserId(req: unknown): number | null {
  return (req as { userId?: number }).userId ?? null;
}
function requireUserId(req: unknown): number {
  const id = reqUserId(req);
  if (!id) throw new AppError('Bạn cần đăng nhập', 401, 'UNAUTHENTICATED');
  return id;
}

const publicRouter = Router();

// ─── Meta ─────────────────────────────────────────────────────────────────
publicRouter.get('/meta', (_req, res: Response<ApiResponse>) => {
  res.json({ success: true, data: { types: VOICE_TYPES, mediaKinds: VOICE_MEDIA_KINDS } });
});

publicRouter.get('/series', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const data = await listSeries();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// ─── Feed ───────────────────────────────────────────────────────────────────
publicRouter.get('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page, size, type, series, tag, q, featured } = req.query;
    const data = await listPublic({
      page: page ? Number(page) : undefined,
      size: size ? Number(size) : undefined,
      type: type ? String(type) : undefined,
      seriesSlug: series ? String(series) : undefined,
      tag: tag ? String(tag) : undefined,
      q: q ? String(q) : undefined,
      featured: featured === 'true' || featured === '1',
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// ─── Detail by slug ─────────────────────────────────────────────────────────
publicRouter.get('/posts/:slug', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const slug = String(req.params.slug);
    const countView = req.query.view === '1' || req.query.view === 'true';
    const post = await getBySlug(slug, reqUserId(req), countView);
    const related = await getRelated(post.id as number, (post.series as { id?: number } | null)?.id ?? null, post.type as string);
    res.json({ success: true, data: { post, related } });
  } catch (error) {
    next(error);
  }
});

// ─── Post like (toggle) ─────────────────────────────────────────────────────
publicRouter.post('/posts/:id/like', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = requireUserId(req);
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid post id', 400, 'INVALID_ID');
    const data = await togglePostLike(id, userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// ─── Comments ───────────────────────────────────────────────────────────────
publicRouter.get('/posts/:id/comments', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid post id', 400, 'INVALID_ID');
    const data = await listComments(id, reqUserId(req));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

publicRouter.post('/posts/:id/comments', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = requireUserId(req);
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid post id', 400, 'INVALID_ID');
    const { content, parentId } = req.body as { content?: unknown; parentId?: unknown };
    const pid = parentId != null ? parseInt(String(parentId), 10) : null;
    const data = await createComment(id, userId, String(content ?? ''), Number.isNaN(pid as number) ? null : pid);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

publicRouter.patch('/comments/:cid', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = requireUserId(req);
    const cid = parseInt(req.params.cid, 10);
    if (Number.isNaN(cid)) throw new AppError('Invalid comment id', 400, 'INVALID_ID');
    const data = await editComment(cid, userId, String((req.body as { content?: unknown }).content ?? ''));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

publicRouter.delete('/comments/:cid', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = requireUserId(req);
    const cid = parseInt(req.params.cid, 10);
    if (Number.isNaN(cid)) throw new AppError('Invalid comment id', 400, 'INVALID_ID');
    await deleteComment(cid, userId);
    res.json({ success: true, data: { id: cid } });
  } catch (error) {
    next(error);
  }
});

publicRouter.post('/comments/:cid/like', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = requireUserId(req);
    const cid = parseInt(req.params.cid, 10);
    if (Number.isNaN(cid)) throw new AppError('Invalid comment id', 400, 'INVALID_ID');
    const data = await toggleLike(cid, userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// ─── Reader AI (PRO-gated) ──────────────────────────────────────────────────
const PRO_MESSAGE = 'Trợ lý AI dành cho tài khoản Pro. Nâng cấp tại /pro để dùng tóm tắt nội dung.';

async function assertReaderPro(req: unknown): Promise<number> {
  const userId = (req as { userId?: number }).userId ?? null;
  if (!userId || !(await isProEffective(userId))) {
    throw new AppError(PRO_MESSAGE, 403, 'PRO_REQUIRED');
  }
  return userId;
}

publicRouter.get('/ai/status', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = reqUserId(req);
    const isPro = userId ? await isProEffective(userId) : false;
    res.json({ success: true, data: { available: aiStatus().available, isPro } });
  } catch (error) {
    next(error);
  }
});

publicRouter.post('/posts/:slug/tldr', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = await assertReaderPro(req);
    const slug = String(req.params.slug);
    const post = await getBySlug(slug, userId, false);
    const text = (post.descriptionHtml as string | null) || (post.summary as string | null) || '';
    const data = await summarizePost({ title: post.title as string, text, userId });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN — all inherit authenticate + requireAdmin('ROLE_ADMIN')
// ═══════════════════════════════════════════════════════════════════════════
const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin('ROLE_ADMIN'));

adminRouter.get('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page, size, status, type, q } = req.query;
    const data = await adminList({
      page: page ? Number(page) : undefined,
      size: size ? Number(size) : undefined,
      status: status ? String(status) : undefined,
      type: type ? String(type) : undefined,
      q: q ? String(q) : undefined,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid id', 400, 'INVALID_ID');
    const data = await adminGet(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const authorId = reqUserId(req);
    const data = await createPost(req.body ?? {}, authorId);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid id', 400, 'INVALID_ID');
    const data = await updatePost(id, req.body ?? {});
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid id', 400, 'INVALID_ID');
    await deletePost(id);
    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/:id/publish', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid id', 400, 'INVALID_ID');
    const data = await setStatus(id, 'PUBLISHED');
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/:id/unpublish', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid id', 400, 'INVALID_ID');
    const data = await setStatus(id, 'DRAFT');
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// ─── Series admin CRUD ──────────────────────────────────────────────────────
adminRouter.get('/series/all', async (_req, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await listSeries() });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/series', async (req, res: Response<ApiResponse>, next) => {
  try {
    res.status(201).json({ success: true, data: await createSeries(req.body ?? {}) });
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/series/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid id', 400, 'INVALID_ID');
    res.json({ success: true, data: await updateSeries(id, req.body ?? {}) });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/series/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid id', 400, 'INVALID_ID');
    await deleteSeries(id);
    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
});

// ─── Admin AI ───────────────────────────────────────────────────────────────
adminRouter.get('/ai/status', (_req, res: Response<ApiResponse>) => {
  res.json({ success: true, data: aiStatus() });
});

adminRouter.post('/ai/generate-meta', async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = reqUserId(req);
    const { title, notes, type } = req.body as { title?: unknown; notes?: unknown; type?: unknown };
    const data = await generateMeta({ title: String(title ?? ''), notes: notes ? String(notes) : '', type: type ? String(type) : 'VLOG', userId });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export { publicRouter, adminRouter };
