/**
 * POST /api/v1/music/history
 * Records a track play event in the user's listening history.
 * Also upserts so the same track played again updates the timestamp.
 *
 * Phase 2a: ALSO atomically increments the user's MusicPlayCount
 * for this track in the same request handler (no extra round-trip).
 * The count drives the "Most Played" sort.
 */
import { Router, type Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { prisma } from '../config/database.js';
import { musicPlayCountsService } from '../services/music-play-counts.service.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

router.post(
  '/',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const { trackId } = req.body;
      const userId = req.userId;

      if (!trackId || isNaN(parseInt(String(trackId), 10))) {
        res.status(400).json({ success: false, message: 'Valid trackId required' });
        return;
      }

      const trackIdInt = parseInt(String(trackId), 10);

      // Upsert: update playedAt if already exists
      const existing = await prisma.musicHistory.findFirst({
        where: { userId, trackId: trackIdInt },
      });

      let entry;
      if (existing) {
        entry = await prisma.musicHistory.update({
          where: { id: existing.id },
          data: { playedAt: new Date() },
          include: {
            track: {
              select: {
                id: true, title: true, artist: true,
                coverImage: true, durationSeconds: true, localPath: true,
              },
            },
          },
        });
      } else {
        entry = await prisma.musicHistory.create({
          data: { userId, trackId: trackIdInt },
          include: {
            track: {
              select: {
                id: true, title: true, artist: true,
                coverImage: true, durationSeconds: true, localPath: true,
              },
            },
          },
        });
      }

      // Keep only the last 100 entries per user (cleanup old records)
      const count = await prisma.musicHistory.count({ where: { userId } });
      if (count > 100) {
        const oldestToDelete = await prisma.musicHistory.findMany({
          where: { userId },
          orderBy: { playedAt: 'asc' },
          take: count - 100,
          select: { id: true },
        });
        await prisma.musicHistory.deleteMany({
          where: { id: { in: oldestToDelete.map((e) => e.id) } },
        });
      }

      // Phase 2a: atomically increment the play count for this user
      // + track. Best-effort: a failure here must NOT break history
      // recording (the user's listening log is the more critical
      // feature; the count is just for sorting).
      try {
        await musicPlayCountsService.increment(userId, trackIdInt);
      } catch (countErr: any) {
        logger.warn('[music-history] play-count increment failed (non-fatal)', {
          error: countErr instanceof Error ? countErr.message : String(countErr),
          userId,
          trackId: trackIdInt,
        });
      }

      res.json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * GET /api/v1/music/history
 * Returns the user's recent listening history (last 50 tracks, deduplicated by track).
 */
router.get(
  '/',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const userId = req.userId;

      const entries = await prisma.musicHistory.findMany({
        where: { userId },
        orderBy: { playedAt: 'desc' },
        take: 50,
        include: {
          track: {
            select: {
              id: true, title: true, artist: true,
              coverImage: true, durationSeconds: true, localPath: true,
              audioUrl: true,
            },
          },
        },
      });

      // Deduplicate: keep most recent play for each track
      const seen = new Set<number>();
      const unique = entries.filter((e) => {
        if (seen.has(e.trackId)) return false;
        seen.add(e.trackId);
        return true;
      });

      const tracks = unique.map((e) => ({
        ...e.track,
        playedAt: e.playedAt,
      }));

      res.json({ success: true, data: tracks });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * DELETE /api/v1/music/history
 * Clears all listening history for the current user.
 */
router.delete(
  '/',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const userId = req.userId;
      await prisma.musicHistory.deleteMany({ where: { userId } });
      res.json({ success: true, message: 'History cleared' });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
