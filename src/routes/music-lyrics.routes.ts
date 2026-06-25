/**
 * ============================================================
 * Music Lyrics Routes — synced karaoke lyrics (Phase 2b)
 * ============================================================
 *
 * Mount: app.use('/api/v1/music', musicLyricsRoutes)
 *
 * Endpoints:
 *   GET    /tracks/:id/lyrics   Read a track's lyrics (public)
 *   PUT    /tracks/:id/lyrics   Create/update lyrics (auth, idempotent)
 *   DELETE /tracks/:id/lyrics   Remove lyrics (auth)
 *
 * Read is public (optionalAuth) so anyone viewing the now-playing
 * screen gets the karaoke scroll. Write requires a logged-in user —
 * matching the existing PUT /tracks/:id policy (tracks have no owner,
 * so any authenticated user can curate metadata/lyrics).
 */

import { Router, type Response, type NextFunction } from 'express';
import { optionalAuth, authenticate } from '../middleware/auth.js';
import { musicLyricsService } from '../services/music-lyrics.service.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

function parseTrackId(raw: unknown): number | null {
  const id = parseInt(String(raw ?? ''), 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

// ─── GET /tracks/:id/lyrics — public read ─────────────────────
router.get(
  '/tracks/:id/lyrics',
  optionalAuth,
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const trackId = parseTrackId(req.params.id);
      if (trackId === null) {
        res.status(400).json({ success: false, message: 'Valid track id is required' });
        return;
      }
      // `data: null` (stable shape) when a track has no lyrics — the
      // frontend renders its "add lyrics" empty state.
      const lyrics = await musicLyricsService.getLyrics(trackId);
      res.json({ success: true, data: lyrics ?? null });
    } catch (error: any) {
      logger.error('[music-lyrics] GET failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── PUT /tracks/:id/lyrics — upsert (idempotent) ─────────────
router.put(
  '/tracks/:id/lyrics',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const trackId = parseTrackId(req.params.id);
      if (trackId === null) {
        res.status(400).json({ success: false, message: 'Valid track id is required' });
        return;
      }
      const { synced, plain } = req.body ?? {};
      const dto = await musicLyricsService.upsertLyrics(
        trackId,
        { synced, plain },
        req.userId,
      );
      res.json({ success: true, data: dto, message: 'Lyrics saved' });
    } catch (error: any) {
      if (error?.code === 'TRACK_NOT_FOUND') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      if (error?.code === 'EMPTY_LYRICS') {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      logger.error('[music-lyrics] PUT failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

// ─── DELETE /tracks/:id/lyrics ────────────────────────────────
router.delete(
  '/tracks/:id/lyrics',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const trackId = parseTrackId(req.params.id);
      if (trackId === null) {
        res.status(400).json({ success: false, message: 'Valid track id is required' });
        return;
      }
      await musicLyricsService.deleteLyrics(trackId);
      res.json({ success: true, message: 'Lyrics removed' });
    } catch (error: any) {
      logger.error('[music-lyrics] DELETE failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  },
);

export default router;
