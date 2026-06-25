/**
 * ============================================================
 * Music Likes Service — per-user track favorites (Phase 2a)
 * ============================================================
 *
 * One row per (userId, trackId) in the `music_likes` table. The
 * unique constraint at the DB layer prevents duplicate likes from
 * concurrent clicks — the service uses `upsert` so a second like
 * click from the same user is a no-op (idempotent).
 *
 * Reads always default to `[]` rather than `null/undefined` so
 * the frontend can safely iterate the result without the
 * "x is not iterable" runtime crash.
 */

import { prisma } from '../config/database.js';

export interface LikedTrackDTO {
  trackId: number;
  likedAt: string;
  title: string;
  artist: string;
  coverImage: string | null;
  audioUrl: string | null;
  localPath: string | null;
  durationSeconds: number | null;
}

class MusicLikesService {
  /**
   * List the user's liked tracks, most-recently-liked first.
   * Always returns an array.
   */
  async listLikedTracks(userId: number, limit = 200): Promise<LikedTrackDTO[]> {
    const rows = await prisma.musicLike.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: Math.max(1, Math.min(limit, 500)),
      include: {
        track: {
          select: {
            id: true,
            title: true,
            artist: true,
            coverImage: true,
            audioUrl: true,
            localPath: true,
            durationSeconds: true,
            active: true,
          },
        },
      },
    });

    return (rows ?? [])
      .filter((r) => r.track && r.track.active !== false)
      .map((r) => ({
        trackId: r.trackId,
        likedAt: r.createdAt.toISOString(),
        title: r.track.title,
        artist: r.track.artist,
        coverImage: r.track.coverImage ?? null,
        audioUrl: r.track.audioUrl ?? null,
        localPath: r.track.localPath ?? null,
        durationSeconds: r.track.durationSeconds ?? null,
      }));
  }

  /**
   * List just the track IDs the user has liked. Used to hydrate
   * the heart-icon state on the frontend without pulling full
   * track data. Always returns an array of numbers.
   */
  async listLikedTrackIds(userId: number): Promise<number[]> {
    const rows = await prisma.musicLike.findMany({
      where: { userId },
      select: { trackId: true },
    });
    return (rows ?? []).map((r) => r.trackId);
  }

  /**
   * Like a track. Idempotent: a second like from the same user
   * is a no-op (the unique constraint enforces this).
   */
  async like(userId: number, trackId: number): Promise<{ liked: true; trackId: number }> {
    const track = await prisma.musicTrack.findFirst({
      where: { id: trackId, active: true },
      select: { id: true },
    });
    if (!track) {
      const err: Error & { code?: string } = new Error('Track not found or inactive');
      err.code = 'TRACK_NOT_FOUND';
      throw err;
    }

    // Upsert: if (userId, trackId) row already exists, leave it.
    await prisma.musicLike.upsert({
      where: {
        music_likes_user_track_unique: { userId, trackId },
      },
      create: { userId, trackId },
      update: {}, // no-op; preserves createdAt
    });

    return { liked: true, trackId };
  }

  /**
   * Unlike a track. Idempotent: removing a non-existent like
   * is a no-op (deleteMany with where that matches 0 rows).
   */
  async unlike(userId: number, trackId: number): Promise<{ liked: false; trackId: number }> {
    await prisma.musicLike.deleteMany({ where: { userId, trackId } });
    return { liked: false, trackId };
  }

  /**
   * Check whether a single track is liked by the user.
   * Returns false if no row exists (cleaner than the alternative
   * of returning null/undefined).
   */
  async isLiked(userId: number, trackId: number): Promise<boolean> {
    const row = await prisma.musicLike.findUnique({
      where: {
        music_likes_user_track_unique: { userId, trackId },
      },
      select: { id: true },
    });
    return row !== null;
  }
}

export const musicLikesService = new MusicLikesService();