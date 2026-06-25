/**
 * ============================================================
 * Music Lyrics Service — synced karaoke lyrics (Phase 2b)
 * ============================================================
 *
 * One row per track (UNIQUE track_id). Two shapes:
 *   - format='synced': `synced` = [{ t:<seconds>, text:<line> }]
 *     sorted ascending by t. The now-playing screen highlights the
 *     active line and auto-scrolls.
 *   - format='plain':  `plain` = newline-separated text, shown as a
 *     static block (graceful fallback when there are no timestamps).
 *
 * IDEMPOTENCY: `upsertLyrics` writes against the UNIQUE(track_id)
 * constraint, so re-saving the same track's lyrics updates the row
 * in place — it never creates a duplicate.
 *
 * SAFETY: all input is normalized/validated server-side. Lines with
 * non-finite/negative timestamps or empty text are dropped, lines are
 * re-sorted by time, and the array is capped — so a malformed payload
 * can never poison the client's karaoke scroll or blow up memory.
 * Reads of `getLyrics` return `null` (not a throw) when a track has
 * no lyrics, so the frontend can render its empty state cleanly.
 */

import { prisma } from '../config/database.js';

// A single time-synced line.
export interface SyncedLine {
  t: number; // seconds from track start, >= 0
  text: string;
}

export type LyricsFormat = 'synced' | 'plain';

export interface LyricsDTO {
  trackId: number;
  format: LyricsFormat;
  synced: SyncedLine[]; // always an array ([] when format='plain')
  plain: string | null;
  updatedAt: string;
}

// Hard caps so a crafted payload can't exhaust memory / DB.
const MAX_LINES = 2000;
const MAX_LINE_LEN = 1000;
const MAX_PLAIN_LEN = 50_000;

class MusicLyricsService {
  /**
   * Normalize a raw `synced` payload into a clean, sorted array.
   * Drops anything malformed rather than throwing — partial lyrics
   * are better than none, and the client should never receive junk.
   */
  private normalizeSynced(raw: unknown): SyncedLine[] {
    if (!Array.isArray(raw)) return [];
    const cleaned: SyncedLine[] = [];
    for (const item of raw) {
      if (!item || typeof item !== 'object') continue;
      const t = Number((item as any).t);
      const text = String((item as any).text ?? '');
      if (!Number.isFinite(t) || t < 0) continue;
      const trimmed = text.slice(0, MAX_LINE_LEN);
      if (trimmed.trim().length === 0) continue;
      cleaned.push({ t: Math.round(t * 1000) / 1000, text: trimmed });
      if (cleaned.length >= MAX_LINES) break;
    }
    // Stable sort by time so the karaoke highlight advances monotonically.
    cleaned.sort((a, b) => a.t - b.t);
    return cleaned;
  }

  /**
   * Read a track's lyrics. Returns `null` when none exist so the
   * frontend can render its "no lyrics yet" empty state.
   */
  async getLyrics(trackId: number): Promise<LyricsDTO | null> {
    const row = await prisma.musicLyrics.findUnique({ where: { trackId } });
    if (!row) return null;

    const synced = this.normalizeSynced(row.synced);
    // If the stored format says 'synced' but nothing survived
    // normalization, fall back to 'plain' so the client still shows
    // whatever plain text exists instead of an empty karaoke view.
    const format: LyricsFormat =
      row.format === 'synced' && synced.length > 0 ? 'synced' : 'plain';

    return {
      trackId,
      format,
      synced: format === 'synced' ? synced : [],
      plain: row.plain ?? (synced.length > 0 ? synced.map((l) => l.text).join('\n') : null),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  /**
   * Create or update a track's lyrics (idempotent upsert on the
   * UNIQUE track_id). Validates the track exists + is active first.
   *
   * @param input.synced  optional synced lines (preferred)
   * @param input.plain   optional plain fallback text
   */
  async upsertLyrics(
    trackId: number,
    input: { synced?: unknown; plain?: unknown },
    updatedById?: number,
  ): Promise<LyricsDTO> {
    const track = await prisma.musicTrack.findFirst({
      where: { id: trackId, active: true },
      select: { id: true },
    });
    if (!track) {
      const err: Error & { code?: string } = new Error('Track not found or inactive');
      err.code = 'TRACK_NOT_FOUND';
      throw err;
    }

    const synced = this.normalizeSynced(input.synced);
    const plainRaw = typeof input.plain === 'string' ? input.plain : '';
    const plain = plainRaw.slice(0, MAX_PLAIN_LEN).trim() || null;

    if (synced.length === 0 && !plain) {
      const err: Error & { code?: string } = new Error('Lyrics must contain at least one line');
      err.code = 'EMPTY_LYRICS';
      throw err;
    }

    const format: LyricsFormat = synced.length > 0 ? 'synced' : 'plain';

    await prisma.musicLyrics.upsert({
      where: { trackId },
      create: {
        trackId,
        format,
        synced: synced.length > 0 ? (synced as any) : undefined,
        plain,
        updatedById: updatedById ?? null,
      },
      update: {
        format,
        // Always overwrite both so clearing one shape actually clears it.
        synced: synced.length > 0 ? (synced as any) : null,
        plain,
        updatedById: updatedById ?? null,
      },
    });

    const saved = await this.getLyrics(trackId);
    // getLyrics can't be null here (we just upserted), but guard anyway.
    return (
      saved ?? {
        trackId,
        format,
        synced,
        plain,
        updatedAt: new Date().toISOString(),
      }
    );
  }

  /**
   * Delete a track's lyrics. Idempotent — no-op if none exist.
   */
  async deleteLyrics(trackId: number): Promise<void> {
    await prisma.musicLyrics.deleteMany({ where: { trackId } });
  }
}

export const musicLyricsService = new MusicLyricsService();
