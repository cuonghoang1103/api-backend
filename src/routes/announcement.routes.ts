import { Router, type Response } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import { getIO } from '../socket/messaging.socket.js';
import {
  listAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../services/announcement.service.js';

/**
 * Announcements — site-wide broadcast notices.
 *
 * Mounted at /api/v1/announcements.
 *
 *   GET    /            → public list (pinned first, then newest)
 *   GET    /:id         → public single read
 *   POST   /            → admin: create + global socket broadcast
 *   PATCH  /:id         → admin: update
 *   DELETE /:id         → admin: delete
 *
 * Reads are public (consistent with tech-trends public reads).
 * Writes require ROLE_ADMIN — the same guard tech-trends' admin
 * router uses (`authenticate, requireAdmin('ROLE_ADMIN')`).
 */

const router = Router();

// GET /api/v1/announcements — public list.
router.get('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const cursorRaw = req.query.cursor as string | undefined;
    const cursor = cursorRaw ? parseInt(cursorRaw, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const { items, nextCursor } = await listAnnouncements({
      cursor: cursor && !Number.isNaN(cursor) ? cursor : undefined,
      limit: limit && !Number.isNaN(limit) ? limit : undefined,
    });

    res.json({ success: true, data: { items, nextCursor } });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/announcements/:id — public single read.
router.get('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid announcement id', 400, 'INVALID_ID');
    const announcement = await getAnnouncement(id);
    res.json({ success: true, data: announcement });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/announcements — admin only.
router.post('/', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { title, body, category, coverImageUrl, isPinned } = req.body as Record<string, unknown>;
    const a = await createAnnouncement(req.userId ?? null, {
      title,
      body,
      category,
      coverImageUrl,
      isPinned,
    });

    // Global broadcast to every connected socket so clients can
    // surface the new announcement in real time.
    const io = getIO();
    io?.emit('admin:announcement', {
      id: a.id,
      title: a.title,
      category: a.category,
      createdAt: a.createdAt,
    });

    res.status(201).json({ success: true, data: a });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/announcements/:id — admin only.
router.patch('/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid announcement id', 400, 'INVALID_ID');
    const { title, body, category, coverImageUrl, isPinned } = req.body as Record<string, unknown>;
    const a = await updateAnnouncement(id, { title, body, category, coverImageUrl, isPinned });
    res.json({ success: true, data: a });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/announcements/:id — admin only.
router.delete('/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid announcement id', 400, 'INVALID_ID');
    const result = await deleteAnnouncement(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
