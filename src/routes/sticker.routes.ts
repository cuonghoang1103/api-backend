/**
 * ============================================================
 * Sticker Routes
 * ============================================================
 *
 * Mounted at /api/v1/stickers
 *
 * Public (authenticated) reads — drive the chat sticker picker:
 *   GET  /packs                  — active packs (with cover + count)
 *   GET  /packs/:id/stickers     — stickers in a pack
 *
 * Admin writes (requireAdmin) — drive the /admin/stickers page:
 *   GET    /admin/packs                 — all packs (incl. inactive)
 *   POST   /admin/packs                 — create pack { name, slug? }
 *   PATCH  /admin/packs/:id             — { name?, isActive?, coverUrl? }
 *   DELETE /admin/packs/:id             — delete pack + its stickers
 *   POST   /admin/packs/:id/stickers    — upload one image (multipart "file")
 *   DELETE /admin/stickers/:id          — delete a sticker
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  listActivePacks,
  listStickers,
  createPack,
  addSticker,
  updatePack,
  deleteSticker,
  deletePack,
  listAllPacksForAdmin,
} from '../services/sticker.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// 2MB cap per sticker image, in-memory (service optimizes via Sharp).
const stickerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ─── Public reads (any signed-in user) ───────────────────────
router.get('/packs', authenticate, async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await listActivePacks() });
  } catch (e) {
    next(e);
  }
});

router.get('/packs/:id/stickers', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid pack ID', 400, 'INVALID_ID');
    res.json({ success: true, data: await listStickers(id) });
  } catch (e) {
    next(e);
  }
});

// ─── Admin writes ────────────────────────────────────────────
router.get('/admin/packs', authenticate, requireAdmin(), async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await listAllPacksForAdmin() });
  } catch (e) {
    next(e);
  }
});

router.post('/admin/packs', authenticate, requireAdmin(), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const pack = await createPack(req.user.userId!, { name: req.body?.name, slug: req.body?.slug });
    res.status(201).json({ success: true, data: pack });
  } catch (e) {
    next(e);
  }
});

router.patch('/admin/packs/:id', authenticate, requireAdmin(), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid pack ID', 400, 'INVALID_ID');
    await updatePack(id, { name: req.body?.name, isActive: req.body?.isActive, coverUrl: req.body?.coverUrl });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.delete('/admin/packs/:id', authenticate, requireAdmin(), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid pack ID', 400, 'INVALID_ID');
    await deletePack(id);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

router.post(
  '/admin/packs/:id/stickers',
  authenticate,
  requireAdmin(),
  stickerUpload.single('file'),
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) throw new AppError('Invalid pack ID', 400, 'INVALID_ID');
      const file = (req as Request).file;
      if (!file) throw new AppError('Thiếu file ảnh', 400, 'NO_FILE');
      const sticker = await addSticker(
        id,
        {
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
          originalName: file.originalname,
        },
        req.body?.label,
      );
      res.status(201).json({ success: true, data: sticker });
    } catch (e) {
      next(e);
    }
  },
);

router.delete('/admin/stickers/:id', authenticate, requireAdmin(), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid sticker ID', 400, 'INVALID_ID');
    await deleteSticker(id);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

export default router;
