/**
 * ============================================================
 * Music Play Counts Service — per-user play counters (Phase 2a)
 * ============================================================
 *
 * One row per (userId, trackId). `count` is incremented each time
 * the user actually plays the track (driven by the existing
 * `POST /api/v1/music/history` endpoint — no new round-trip needed
 * on the frontend).
 *
 * The increment is ATOMIC at the SQL layer using
 *   UPDATE music_play_counts
 *   SET count = count + 1, last_played_at = NOW()
 *   WHERE user_id = $1 AND track_id = $2
 *
 * If no row exists, an INSERT … ON CONFLICT … DO UPDATE handles
 * the first-play case in the same statement. This avoids the
 * classic "read-then-write race" where two concurrent plays could
 * both read count=0 and both write count=1 (losing one increment).
 *
 * Why a separate table instead of GROUP BY MusicHistory?
 * MusicHistory is unique-on-(userId, trackId) with last-play
 * semantics, so it can only answer "did the user ever play this".
 * For "how many times has the user played this" we need an
 * additive counter — that's this table's purpose.
 *
 * Reads always default to `[]` rather than `null/undefined`.
 */

import { prisma } from '../config/database.js';

export interface PlayCountTrackDTO {
  trackId: number;
  count: number;
  lastPlayedAt: string;
  title: string;
  artist: string;
  coverImage: string | null;
  audioUrl: string | null;
  localPath: string | null;
  durationSeconds: number | null;
}

class MusicPlayCountsService {
  /**
   * Atomically increment the user's play count for a track.
   * Creates the row on first play. Uses raw SQL with
   * `ON CONFLICT DO UPDATE` so concurrent plays are race-safe.
   *
   * Returns the new count + lastPlayedAt.
   */
  async increment(
    userId: number,
    trackId: number,
  ): Promise<{ count: number; lastPlayedAt: Date }> {
    // Verify the track exists + is active (defense-in-depth —
    // the FK constraint will reject invalid IDs too, but this
    // gives a clearer error before the INSERT).
    const track = await prisma.musicTrack.findFirst({
      where: { id: trackId, active: true },
      select: { id: true },
    });
    if (!track) {
      const err: Error & { code?: string } = new Error('Track not found or inactive');
      err.code = 'TRACK_NOT_FOUND';
      throw err;
    }

    // UPSERT with `count = count + 1` — Postgres executes the
    // UPDATE branch atomically (single statement, single tuple
    // lock). No application-level read-then-write race.
    const rows = await prisma.$queryRaw<
      { count: number; last_played_at: Date }[]
    >`
      INSERT INTO "music_play_counts" ("user_id", "track_id", "count", "last_played_at", "created_at", "updated_at")
      VALUES (${userId}, ${trackId}, 1, NOW(), NOW(), NOW())
      ON CONFLICT ("user_id", "track_id") DO UPDATE
        SET "count" = "music_play_counts"."count" + 1,
            "last_played_at" = NOW(),
            "updated_at" = NOW()
      RETURNING "count", "last_played_at";
    `;

    const row = rows[0];
    if (!row) {
      throw new Error('Play count upsert returned no row');
    }
    return { count: Number(row.count), lastPlayedAt: new Date(row.last_played_at) };
  }

  /**
   * List the user's most-played tracks. Sorted by count DESC,
   * then last_played_at DESC as tiebreaker (the most recent
   * replay wins).
   * Always returns an array.
   */
  async listMostPlayed(userId: number, limit = 50): Promise<PlayCountTrackDTO[]> {
    const rows = await prisma.musicPlayCount.findMany({
      where: { userId },
      orderBy: [{ count: 'desc' }, { lastPlayedAt: 'desc' }],
      take: Math.max(1, Math.min(limit, 200)),
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
        count: r.count,
        lastPlayedAt: r.lastPlayedAt.toISOString(),
        title: r.track.title,
        artist: r.track.artist,
        coverImage: r.track.coverImage ?? null,
        audioUrl: r.track.audioUrl ?? null,
        localPath: r.track.localPath ?? null,
        durationSeconds: r.track.durationSeconds ?? null,
      }));
  }

  /**
   * Get a single track's play count for the user. Returns 0
   * if no row exists (cleaner than null for the frontend).
   */
  async getCount(userId: number, trackId: number): Promise<number> {
    const row = await prisma.musicPlayCount.findUnique({
      where: {
        music_play_counts_user_track_unique: { userId, trackId },
      },
      select: { count: true },
    });
    return row?.count ?? 0;
  }
}

export const musicPlayCountsService = new MusicPlayCountsService();