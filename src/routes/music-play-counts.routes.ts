/**
 * ============================================================
 * Music Play Counts Routes — per-user play counts (Phase 2a)
 * ============================================================
 *
 * Mount: app.use('/api/v1/music/play-counts', musicPlayCountsRoutes)
 *
 * Endpoints:
 *   GET  /                List the current user's most-played tracks (sorted by count DESC)
 *   GET  /:trackId        Get the user's play count for one track
 *
 * NOTE: the per-play INCREMENT happens inside
 * POST /api/v1/music/history (see src/routes/music-history.routes.ts).
 * No separate "record a play" endpoint — the existing one does both
 * jobs in a single request, which keeps the frontend's recordPlay
 * mutation at exactly one HTTP call per actual play.
 *
 * Both endpoints require authentication.
 */

import { Router, type Response, type NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import { musicPlayCountsService } from '../services/music-play-counts.service.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

router.use(authenticate);

// ─── GET / — list most-played tracks ──
router.get(
  '/',
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const userId: number = req.userId;
      const limit = Math.max(
        1,
        Math.min(parseInt(String(req.query.limit ?? '50'), 10) || 50, 200),
      );
      const tracks = await musicPlayCountsService.listMostPlayed(userId, limit);
      // Always return an array (never null/undefined) — even when
      // empty — so the frontend can safely iterate without the
      // "x is not iterable" crash.
      res.json({ success: true, data: Array.isArray(tracks) ? tracks : [] });
    } catch (error: any) {
      logger.error('[music-play-counts] GET / failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── GET /:trackId — single track's play count for this user ──
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
      const count = await musicPlayCountsService.getCount(userId, trackId);
      res.json({ success: true, data: { trackId, count } });
    } catch (error: any) {
      logger.error('[music-play-counts] GET /:trackId failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

export default router;