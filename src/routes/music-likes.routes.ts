/**
 * ============================================================
 * Music Likes Routes — per-user track favorites (Phase 2a)
 * ============================================================
 *
 * Mount: app.use('/api/v1/music/likes', musicLikesRoutes)
 *
 * Endpoints:
 *   GET  /            List the current user's liked tracks (newest-first)
 *   GET  /ids         List just the liked track IDs (cheap hydration)
 *   GET  /:trackId    Check whether a single track is liked
 *   POST /:trackId    Like a track (idempotent)
 *   DEL  /:trackId    Unlike a track (idempotent)
 *
 * All endpoints require a logged-in user — likes are per-user.
 */

import { Router, type Response, type NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import { musicLikesService } from '../services/music-likes.service.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

router.use(authenticate);

// ─── GET /ids — list liked track IDs only (cheap hydration) ──
// Returned BEFORE the /:trackId routes so Express matches this
// literal path first.
router.get(
  '/ids',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      const ids = await musicLikesService.listLikedTrackIds(userId);
      // Always return an array (never null/undefined) — even when
      // empty — so the frontend can safely iterate without the
      // "x is not iterable" crash.
      res.json({ success: true, data: Array.isArray(ids) ? ids : [] });
    } catch (error: any) {
      logger.error('[music-likes] GET /ids failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── GET / — list all liked tracks with full data ──
router.get(
  '/',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      const limit = Math.max(
        1,
        Math.min(parseInt(String(req.query.limit ?? '200'), 10) || 200, 500),
      );
      const tracks = await musicLikesService.listLikedTracks(userId, limit);
      res.json({ success: true, data: Array.isArray(tracks) ? tracks : [] });
    } catch (error: any) {
      logger.error('[music-likes] GET / failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── POST /:trackId — like ──
router.post(
  '/:trackId',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      const trackId = parseInt(String(req.params.trackId ?? ''), 10);
      if (!Number.isFinite(trackId) || trackId <= 0) {
        res.status(400).json({ success: false, message: 'Valid trackId is required' });
        return;
      }
      const result = await musicLikesService.like(userId, trackId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      if (error?.code === 'TRACK_NOT_FOUND') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      logger.error('[music-likes] POST /:trackId failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── DELETE /:trackId — unlike ──
router.delete(
  '/:trackId',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      const trackId = parseInt(String(req.params.trackId ?? ''), 10);
      if (!Number.isFinite(trackId) || trackId <= 0) {
        res.status(400).json({ success: false, message: 'Valid trackId is required' });
        return;
      }
      const result = await musicLikesService.unlike(userId, trackId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      logger.error('[music-likes] DELETE /:trackId failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── GET /:trackId — is liked? ──
router.get(
  '/:trackId',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      const trackId = parseInt(String(req.params.trackId ?? ''), 10);
      if (!Number.isFinite(trackId) || trackId <= 0) {
        res.status(400).json({ success: false, message: 'Valid trackId is required' });
        return;
      }
      const liked = await musicLikesService.isLiked(userId, trackId);
      // data: { liked: true|false } — cleaner than a bare boolean
      res.json({ success: true, data: { liked, trackId } });
    } catch (error: any) {
      logger.error('[music-likes] GET /:trackId failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

export default router;