/**
 * ============================================================
 * Music Queue Routes — per-user play queue (Phase 1)
 * ============================================================
 *
 * Mount: app.use('/api/v1/music/queue', musicQueueRoutes)
 *
 * Endpoints:
 *   GET    /                 List current user's queue (oldest first)
 *   POST   /                 Add a track to the queue (idempotent upsert)
 *   DELETE /:trackId         Remove a single track from the queue
 *   DELETE /                 Clear the entire queue
 *   PUT    /reorder          Reorder the queue (sparse-float positions)
 *   POST   /pop              Pop + return the next track (atomic)
 *
 * All endpoints are authenticated. The queue is per-user, so no
 * ownership check beyond `req.userId` is needed.
 */

import { Router, type Response, type NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import { musicQueueService, type QueueIntent } from '../services/music-queue.service.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// All queue endpoints require a logged-in user — there's no
// per-device localStorage queue concept on the server side (the
// client keeps its own optimistic mirror in Zustand for instant UX).
router.use(authenticate);

// ─── GET / ────────────────────────────────────────────────────
router.get(
  '/',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      const items = await musicQueueService.getUserQueue(userId);
      res.json({ success: true, data: items });
    } catch (error: any) {
      logger.error('[music-queue] GET / failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── POST / — add to queue (idempotent upsert) ────────────────
router.post(
  '/',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      const rawTrackId = req.body?.trackId;
      const trackId = parseInt(String(rawTrackId ?? ''), 10);
      if (!Number.isFinite(trackId) || trackId <= 0) {
        res.status(400).json({
          success: false,
          message: 'Valid trackId is required',
        });
        return;
      }

      const rawIntent = String(req.body?.intent ?? 'queue');
      const intent: QueueIntent = rawIntent === 'next' ? 'next' : 'queue';

      const dto = await musicQueueService.addToQueue(userId, trackId, intent);
      res.json({ success: true, data: dto });
    } catch (error: any) {
      if (error?.code === 'TRACK_NOT_FOUND') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      logger.error('[music-queue] POST / failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── DELETE /:trackId — remove a single item ──────────────────
router.delete(
  '/:trackId',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      const trackId = parseInt(String(req.params.trackId ?? ''), 10);
      if (!Number.isFinite(trackId) || trackId <= 0) {
        res.status(400).json({
          success: false,
          message: 'Valid trackId is required',
        });
        return;
      }
      await musicQueueService.removeFromQueue(userId, trackId);
      res.json({ success: true });
    } catch (error: any) {
      logger.error('[music-queue] DELETE /:trackId failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── DELETE / — clear entire queue ────────────────────────────
router.delete(
  '/',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      await musicQueueService.clearQueue(userId);
      res.json({ success: true });
    } catch (error: any) {
      logger.error('[music-queue] DELETE / failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── PUT /reorder — replace order in one transaction ─────────
router.put(
  '/reorder',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      const ids = req.body?.trackIds;
      if (!Array.isArray(ids)) {
        res.status(400).json({
          success: false,
          message: 'trackIds must be an array',
        });
        return;
      }
      await musicQueueService.reorderQueue(
        userId,
        ids.map((x: unknown) => parseInt(String(x), 10)).filter(Number.isFinite),
      );
      res.json({ success: true });
    } catch (error: any) {
      logger.error('[music-queue] PUT /reorder failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── POST /pop — pop the next queue track (atomic) ────────────
// Used for sync flows (e.g. "Listen Together" in Phase 3) and as
// the authoritative fallback when the client-side Zustand queue
// is empty but the server still has items (e.g. after a fresh
// login on a new device).
router.post(
  '/pop',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      const next = await musicQueueService.popNextFromQueue(userId);
      // Always return `data: null` rather than `data: undefined`
      // so the JSON body has a stable shape the frontend can
      // safely `?? []` guard against.
      res.json({ success: true, data: next ?? null });
    } catch (error: any) {
      logger.error('[music-queue] POST /pop failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

export default router;