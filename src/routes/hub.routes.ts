// ─── Hub — Personal Bookmark Manager (HTTP routes) ───────────────
//
// Authenticated endpoints (mounted at /api/v1/hub):
//   GET    /folders
//   POST   /folders
//   PATCH  /folders/:id
//   DELETE /folders/:id
//   GET    /links
//   POST   /links
//   PATCH  /links/:id
//   DELETE /links/:id
//   POST   /scrape
//
// Public endpoint (no auth, exported separately as `hubPublicRouter`):
//   GET    /public/:slug
//
// All mutating routes validate input, all reads/writes are scoped
// by req.userId (set by the `authenticate` middleware) — there is
// no way for a hostile client to read or mutate another user's data
// because the WHERE clause always includes userId.

import { Router, type Response, type Request } from 'express';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import {
  createFolder,
  deleteFolder,
  listFolders,
  updateFolder,
  createLink,
  deleteLink,
  listLinks,
  updateLink,
  scrapeUrl,
  getPublicLink,
} from '../services/hub.service.js';

const router = Router();
router.use(authenticate);

// ─── Folders ─────────────────────────────────────────────────

router.get('/folders', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const items = await listFolders(req.userId!);
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

router.post('/folders', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { name, icon, sortOrder } = req.body ?? {};
    if (typeof name !== 'string') {
      throw new AppError('name phai la chuoi', 400, 'INVALID_NAME');
    }
    const folder = await createFolder(req.userId!, { name, icon, sortOrder });
    res.status(201).json({ success: true, data: folder });
  } catch (err) { next(err); }
});

router.patch('/folders/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const { name, icon, sortOrder } = req.body ?? {};
    const folder = await updateFolder(req.userId!, id, { name, icon, sortOrder });
    res.json({ success: true, data: folder });
  } catch (err) { next(err); }
});

router.delete('/folders/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteFolder(req.userId!, id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Links ───────────────────────────────────────────────────

router.get('/links', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const raw = req.query.folderId;
    let folderId: number | null | 'all' = 'all';
    if (raw === 'null') {
      folderId = null;
    } else if (raw === 'all' || raw == null) {
      folderId = 'all';
    } else {
      const n = Number(raw);
      if (!Number.isInteger(n) || n <= 0) {
        throw new AppError('folderId khong hop le', 400, 'INVALID_FOLDER_ID');
      }
      folderId = n;
    }
    const keyword = typeof req.query.q === 'string' ? req.query.q : undefined;
    const result = await listLinks(req.userId!, {
      folderId,
      keyword,
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
});

router.post('/links', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const body = req.body ?? {};
    const link = await createLink(req.userId!, {
      folderId: body.folderId ?? null,
      url: body.url,
      title: body.title,
      description: body.description,
      thumbnailUrl: body.thumbnailUrl,
      faviconUrl: body.faviconUrl,
      notes: body.notes,
      tags: body.tags,
      isPublic: body.isPublic,
    });
    res.status(201).json({ success: true, data: link });
  } catch (err) { next(err); }
});

router.patch('/links/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const body = req.body ?? {};
    const link = await updateLink(req.userId!, id, {
      folderId: body.folderId,
      url: body.url,
      title: body.title,
      description: body.description,
      thumbnailUrl: body.thumbnailUrl,
      faviconUrl: body.faviconUrl,
      notes: body.notes,
      tags: body.tags,
      isPublic: body.isPublic,
    });
    res.json({ success: true, data: link });
  } catch (err) { next(err); }
});

router.delete('/links/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteLink(req.userId!, id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Scrape ──────────────────────────────────────────────────

router.post('/scrape', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const url = typeof req.body?.url === 'string' ? req.body.url : '';
    const data = await scrapeUrl(req.userId!, url);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

export default router;

// ─── Public router (no auth) ─────────────────────────────────

export const hubPublicRouter = Router();
hubPublicRouter.get('/public/:slug', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const slug = String(req.params.slug ?? '');
    const link = await getPublicLink(slug);
    if (!link) {
      throw new AppError('Khong tim thay hoac link khong cong khai', 404, 'NOT_FOUND');
    }
    res.json({ success: true, data: link });
  } catch (err) { next(err); }
});
