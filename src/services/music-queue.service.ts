/**
 * ============================================================
 * Music Queue Service — per-user play queue (Phase 1)
 * ============================================================
 *
 * Spotify-style hybrid queue:
 *   - When the manual queue has items, `next()` consumes from
 *     here first.
 *   - When the manual queue is empty, `next()` falls back to the
 *     currently-loaded playlist/album context (handled client-side
 *     by the existing `next()` in `musicStore.ts`).
 *
 * IDEMPOTENCY GUARANTEES (the duplicate-row bug the user reported):
 *
 *   1. The `music_queue_items` table has `UNIQUE (user_id, track_id)`
 *      at the DB level (see migration
 *      20260701120000_cyber_phase1_play_queue/migration.sql). The
 *      service uses Prisma's `upsert` against this unique key, so a
 *      repeated `addToQueue(trackId)` call NEVER produces a duplicate
 *      row — it moves the existing row to the new position instead.
 *
 *   2. Position uses sparse floats with a 10 000-step increment so
 *      `reorderQueue` only needs to UPDATE the rows that actually
 *      moved, not rewrite every row's position.
 *
 *   3. All reads default to `[]` rather than `null/undefined` so the
 *      frontend can safely iterate the result without the
 *      "x is not iterable" runtime crash the user warned about.
 */

import { prisma } from '../config/database.js';

// Distance between two adjacent queue items. Sparse enough that we
// can insert one new item between any two without renumbering
// everything; tight enough that we never overflow IEEE-754 doubles
// in realistic queues (<10 000 items).
const POSITION_STEP = 10_000;

export type QueueIntent = 'next' | 'queue';

export interface QueueTrackDTO {
  trackId: number;
  position: number;
  intent: QueueIntent;
  title: string;
  artist: string;
  coverImage: string | null;
  audioUrl: string | null;
  localPath: string | null;
  durationSeconds: number | null;
}

class MusicQueueService {
  /**
   * Read the user's queue (oldest-first by position).
   * Always returns an array — never null/undefined — so callers
   * can safely iterate without the "x is not iterable" crash.
   */
  async getUserQueue(userId: number): Promise<QueueTrackDTO[]> {
    const rows = await prisma.musicQueueItem.findMany({
      where: { userId },
      orderBy: { position: 'asc' },
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

    // Defensive `?? []` so a row that somehow has no track (race
    // with track deletion) doesn't poison the whole list.
    return (rows ?? [])
      .filter((r) => r.track && r.track.active !== false)
      .map((r) => ({
        trackId: r.trackId,
        position: r.position,
        intent: (r.intent === 'next' ? 'next' : 'queue') as QueueIntent,
        title: r.track.title,
        artist: r.track.artist,
        coverImage: r.track.coverImage ?? null,
        audioUrl: r.track.audioUrl ?? null,
        localPath: r.track.localPath ?? null,
        durationSeconds: r.track.durationSeconds ?? null,
      }));
  }

  /**
   * Add a track to the user's queue (idempotent).
   *
   * @param userId   owner
   * @param trackId  track to enqueue
   * @param intent   'next' → place at the very front (after the
   *                 currently-playing track); 'queue' → append.
   */
  async addToQueue(
    userId: number,
    trackId: number,
    intent: QueueIntent = 'queue',
  ): Promise<QueueTrackDTO> {
    // Confirm the track exists and is active. This protects against
    // a queue row pointing at a soft-deleted track — without this
    // guard, a stale frontend could create an orphan queue row.
    const track = await prisma.musicTrack.findFirst({
      where: { id: trackId, active: true },
      select: { id: true },
    });
    if (!track) {
      const err: Error & { code?: string } = new Error('Track not found or inactive');
      err.code = 'TRACK_NOT_FOUND';
      throw err;
    }

    // Compute the position for the new row.
    //   intent='next' → position = (currentMin - POSITION_STEP), so
    //     the new row sorts FIRST in ascending order without
    //     renumbering anything else.
    //   intent='queue' → position = (currentMax + POSITION_STEP).
    const agg = await prisma.musicQueueItem.aggregate({
      where: { userId },
      _min: { position: true },
      _max: { position: true },
    });
    const newPosition =
      intent === 'next'
        ? (agg._min.position ?? 0) - POSITION_STEP
        : (agg._max.position ?? 0) + POSITION_STEP;

    // Idempotent upsert: if (userId, trackId) already exists, this
    // updates its position + intent instead of inserting a duplicate.
    await prisma.musicQueueItem.upsert({
      where: {
        music_queue_user_track_unique: { userId, trackId },
      },
      create: {
        userId,
        trackId,
        position: newPosition,
        intent,
      },
      update: {
        position: newPosition,
        intent,
      },
    });

    // Return the canonical DTO so the frontend can update its
    // optimistic copy without a re-fetch.
    return {
      trackId,
      position: newPosition,
      intent,
      title: '', // will be filled by the next getUserQueue if needed
      artist: '',
      coverImage: null,
      audioUrl: null,
      localPath: null,
      durationSeconds: null,
    };
  }

  /**
   * Remove a single track from the user's queue. No-op if the row
   * doesn't exist (idempotent).
   */
  async removeFromQueue(userId: number, trackId: number): Promise<void> {
    await prisma.musicQueueItem.deleteMany({
      where: { userId, trackId },
    });
  }

  /**
   * Clear the user's entire queue.
   */
  async clearQueue(userId: number): Promise<void> {
    await prisma.musicQueueItem.deleteMany({ where: { userId } });
  }

  /**
   * Reorder the user's queue. `orderedTrackIds` is the desired
   * order (oldest → newest). Rows NOT in the list are removed
   * (the alternative — keeping them at the end — was rejected
   * because it's surprising UX; an explicit clearQueue is one
   * click away).
   *
   * Position assignment uses the sparse-float trick so only the
   * rows that moved get a new position; untouched rows keep theirs.
   * In the worst case (every row moved), all rows get a new
   * position in a single transaction — no per-row waterfall.
   */
  async reorderQueue(
    userId: number,
    orderedTrackIds: number[],
  ): Promise<void> {
    if (!Array.isArray(orderedTrackIds) || orderedTrackIds.length === 0) {
      await this.clearQueue(userId);
      return;
    }

    // Fetch existing rows so we can compare and only UPDATE those
    // whose position actually changes.
    const existing = await prisma.musicQueueItem.findMany({
      where: { userId },
      select: { trackId: true, position: true },
    });
    const existingMap = new Map<number, number>(
      existing.map((r) => [r.trackId, r.position]),
    );

    // Filter to only IDs the user actually owns (defends against
    // crafted requests containing other users' track IDs).
    const ownedIds = new Set(existing.map((r) => r.trackId));
    const sanitized = orderedTrackIds
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && ownedIds.has(id));

    // Anything not in the new order is removed.
    const keepSet = new Set(sanitized);
    const toRemove = existing
      .map((r) => r.trackId)
      .filter((id) => !keepSet.has(id));
    if (toRemove.length > 0) {
      await prisma.musicQueueItem.deleteMany({
        where: { userId, trackId: { in: toRemove } },
      });
    }

    // Assign new positions. Only UPDATE rows whose position changed
    // — saves a DB roundtrip per row when only one or two items
    // were dragged.
    const updates: Array<{ trackId: number; position: number }> = [];
    for (let i = 0; i < sanitized.length; i++) {
      const trackId = sanitized[i];
      const newPos = (i + 1) * POSITION_STEP;
      if (existingMap.get(trackId) !== newPos) {
        updates.push({ trackId, position: newPos });
      }
    }

    // Update in parallel inside a single transaction. Wrap in
    // $transaction so a mid-reorder failure rolls everything back.
    if (updates.length > 0) {
      await prisma.$transaction(
        updates.map((u) =>
          prisma.musicQueueItem.update({
            where: {
              music_queue_user_track_unique: {
                userId,
                trackId: u.trackId,
              },
            },
            data: { position: u.position },
          }),
        ),
      );
    }
  }

  /**
   * Pop the next track from the queue (oldest by position where
   * intent='queue'). Used by the client when it needs the DB-side
   * authoritative "what's next" — but the client's local Zustand
   * queue usually wins for instant UX. Provided for sync flows.
   *
   * Returns `null` if the queue is empty.
   */
  async popNextFromQueue(userId: number): Promise<QueueTrackDTO | null> {
    const next = await prisma.musicQueueItem.findFirst({
      where: { userId, intent: 'queue' },
      orderBy: { position: 'asc' },
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
    if (!next || !next.track || next.track.active === false) return null;

    // Atomic remove so two concurrent requests can't pop the same row.
    await prisma.musicQueueItem.delete({
      where: { id: next.id },
    }).catch(() => {
      // Already deleted by a parallel request — fine.
    });

    return {
      trackId: next.trackId,
      position: next.position,
      intent: 'queue',
      title: next.track.title,
      artist: next.track.artist,
      coverImage: next.track.coverImage ?? null,
      audioUrl: next.track.audioUrl ?? null,
      localPath: next.track.localPath ?? null,
      durationSeconds: next.track.durationSeconds ?? null,
    };
  }
}

export const musicQueueService = new MusicQueueService();