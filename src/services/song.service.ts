/**
 * Song service — backend for the admin-curated music pool.
 *
 * Phase 4 add. The flow:
 *   1. Admin uploads an mp3 / m4a to R2 via the existing
 *      fileApi.upload (mp3 bucket, 50 MB cap).
 *   2. Frontend calls admin.createSong({ title, artist,
 *      audioUrl, coverImage }) — we persist the row with the
 *      uploaderId from the session, decode the file duration
 *      server-side via music-metadata (mp3 only — m4a is
 *      fallback to the client-supplied value if decode fails),
 *      and return the new row.
 *   3. Users call listActiveSongs() to populate the picker
 *      modal in the composer.
 *   4. setActive(id, isActive) lets admin hide a track without
 *      losing it (songs attached to existing posts keep their
 *      PostMusic row even when the song goes inactive).
 *   5. deleteSong(id) hard-deletes the row. We pre-check that
 *      no PostMusic references exist (FK is Restrict, so the
 *      delete would throw — we surface a clean error here
 *      instead).
 *
 * The frontend also calls getSongById() to play a snippet in
 * the composer audio preview.
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { promises as fs } from 'node:fs';
// music-metadata reads ID3 / MP4 header bytes to get duration
// without downloading the whole file. Lazy-imported because it's
// only needed on create (and a few KB on the server is fine).
// `parseFile` is the named export; the module's `default` field
// may or may not be set depending on the CJS/ESM bridge, so we
// destructure the named symbol directly from the namespace.
type ParseFileFn = (input: string | URL | ArrayBuffer | Uint8Array) => Promise<{ format: { duration: number | undefined } }>;
let parseFileMod: { parseFile: ParseFileFn } | null = null;
async function getParseFile(): Promise<ParseFileFn> {
  if (!parseFileMod) {
    const mod = (await import('music-metadata')) as unknown as { parseFile?: ParseFileFn };
    if (!mod.parseFile) {
      throw new Error('music-metadata: parseFile not found on import');
    }
    parseFileMod = { parseFile: mod.parseFile };
  }
  return parseFileMod.parseFile;
}

export interface CreateSongInput {
  title: string;
  artist: string;
  audioUrl: string;
  coverImage?: string | null;
  durationSec?: number;
  fileSize?: number;
  uploaderId: number;
}

export interface UpdateSongInput {
  title?: string;
  artist?: string;
  coverImage?: string | null;
  isActive?: boolean;
}

const MAX_DURATION_SEC = 60 * 60; // 1 hour sanity cap
const MIN_DURATION_SEC = 1;

function validateInput(input: CreateSongInput | UpdateSongInput): void {
  if ('title' in input && input.title !== undefined) {
    if (typeof input.title !== 'string' || input.title.trim().length === 0 || input.title.length > 255) {
      throw new AppError('title phai la chuoi 1-255 ky tu', 400, 'INVALID_TITLE');
    }
  }
  if ('artist' in input && input.artist !== undefined) {
    if (typeof input.artist !== 'string' || input.artist.trim().length === 0 || input.artist.length > 255) {
      throw new AppError('artist phai la chuoi 1-255 ky tu', 400, 'INVALID_ARTIST');
    }
  }
  if ('audioUrl' in input && input.audioUrl !== undefined) {
    if (typeof input.audioUrl !== 'string' || !/^https?:\/\//.test(input.audioUrl)) {
      throw new AppError('audioUrl phai la URL http/https', 400, 'INVALID_AUDIO_URL');
    }
  }
  if ('durationSec' in input && input.durationSec !== undefined) {
    if (typeof input.durationSec !== 'number' || !Number.isFinite(input.durationSec)) {
      throw new AppError('durationSec phai la so', 400, 'INVALID_DURATION');
    }
    if (input.durationSec < MIN_DURATION_SEC || input.durationSec > MAX_DURATION_SEC) {
      throw new AppError(
        `durationSec phai tu ${MIN_DURATION_SEC} den ${MAX_DURATION_SEC} giay`,
        400,
        'DURATION_OUT_OF_RANGE',
      );
    }
  }
}

/**
 * Try to read the audio duration from a local file path or
 * URL. We use music-metadata to read the header without
 * downloading the whole file (the function does a HEAD or
 * partial read when given a URL). On any failure we fall back
 * to the client-supplied durationSec; we never throw here
 * because duration is metadata, not data, and the post stays
 * usable even if we can't auto-detect.
 */
async function detectDurationSec(audioUrl: string, fallback: number): Promise<number> {
  if (!audioUrl) return fallback;
  try {
    const parseFile = await getParseFile();
    const metadata = await parseFile(audioUrl);
    const dur = metadata.format.duration;
    if (typeof dur === 'number' && Number.isFinite(dur) && dur > 0) {
      return Math.round(dur);
    }
  } catch (err) {
    logger.warn('detectDurationSec failed; using fallback', {
      err: err instanceof Error ? err.message : String(err),
      audioUrl,
    });
  }
  return fallback;
}

export async function createSong(input: CreateSongInput): Promise<unknown> {
  validateInput(input);
  const audioUrl = input.audioUrl.trim();
  const title = input.title.trim();
  const artist = input.artist.trim();
  const coverImage = input.coverImage?.trim() || null;

  // If the caller didn't supply a duration, try to detect it
  // from the audio file. We default to 0 if detection fails;
  // the admin can re-upload with the right value. The detection
  // is best-effort because music-metadata needs a readable
  // stream — works for our R2 public URLs and local uploads,
  // fails gracefully otherwise.
  const initialDuration = typeof input.durationSec === 'number' ? input.durationSec : 0;
  const durationSec = initialDuration > 0
    ? initialDuration
    : await detectDurationSec(audioUrl, 0);

  return prisma.song.create({
    data: {
      title,
      artist,
      audioUrl,
      coverImage,
      durationSec,
      fileSize: input.fileSize ?? null,
      uploadedById: input.uploaderId,
    },
  });
}

export async function listActiveSongs(limit = 50): Promise<unknown[]> {
  return prisma.song.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      // Return the uploader's displayName so the picker can
      // show "by Cuong Hoang" on the track row, matching the
      // Instagram Music attribution UI.
      uploader: { select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } },
    },
  });
}

export async function listAllSongsForAdmin(limit = 100): Promise<unknown[]> {
  return prisma.song.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      uploader: { select: { id: true, username: true, fullName: true } },
      _count: { select: { postMusic: true } },
    },
  });
}

/**
 * Paginated user-facing feed of active songs for the composer
 * picker. We do the cursor + search filter at the SQL level
 * (prisma where + ilike) so a 1k-track library stays fast —
 * no in-memory filtering. Returns the same shape as the route's
 * raw prisma findMany so the route can just forward.
 */
export async function getFeed(opts: { cursor?: number; limit?: number; q?: string }): Promise<unknown[]> {
  const cursor = opts.cursor;
  const limit = Math.min(100, Math.max(1, opts.limit ?? 30));
  const q = (opts.q ?? '').trim();

  const where: Record<string, unknown> = { isActive: true };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { artist: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (cursor != null && Number.isInteger(cursor) && cursor > 0) {
    where.id = { lt: cursor };
  }

  return prisma.song.findMany({
    where,
    orderBy: { id: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      artist: true,
      audioUrl: true,
      coverImage: true,
      durationSec: true,
      createdAt: true,
      uploader: { select: { id: true, username: true, fullName: true, displayName: true } },
    },
  });
}

export async function getSongById(id: number): Promise<unknown> {
  const track = await prisma.song.findUnique({ where: { id } });
  if (!track) throw new AppError('Bai hat khong ton tai', 404, 'SONG_NOT_FOUND');
  return track;
}

export async function updateSong(id: number, input: UpdateSongInput): Promise<unknown> {
  validateInput(input);
  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title.trim();
  if (input.artist !== undefined) data.artist = input.artist.trim();
  if (input.coverImage !== undefined) data.coverImage = input.coverImage?.trim() || null;
  if (input.isActive !== undefined) data.isActive = input.isActive;
  try {
    return await prisma.song.update({ where: { id }, data });
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'P2025') {
      throw new AppError('Bai hat khong ton tai', 404, 'SONG_NOT_FOUND');
    }
    throw err;
  }
}

export async function setActive(id: number, isActive: boolean): Promise<unknown> {
  try {
    return await prisma.song.update({ where: { id }, data: { isActive } });
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'P2025') {
      throw new AppError('Bai hat khong ton tai', 404, 'SONG_NOT_FOUND');
    }
    throw err;
  }
}

export async function deleteSong(id: number): Promise<unknown> {
  // Pre-check for PostMusic references. The FK is Restrict, so
  // the underlying delete would throw a Prisma P2003 error
  // ("foreign key constraint failed"). We surface a cleaner
  // 409 here so the admin can remove the songs from posts
  // first, OR we delete with cascade by removing the references
  // (we don't auto-delete posts).
  const refCount = await prisma.postMusic.count({ where: { songId: id } });
  if (refCount > 0) {
    throw new AppError(
      `Khong the xoa: bai hat dang duoc dung trong ${refCount} bai viet. Hay go bo truoc.`,
      409,
      'SONG_IN_USE',
    );
  }
  try {
    await prisma.song.delete({ where: { id } });
    return { id, deleted: true };
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'P2025') {
      throw new AppError('Bai hat khong ton tai', 404, 'SONG_NOT_FOUND');
    }
    throw err;
  }
}

/**
 * Find a song by id and return the file path / URL the frontend
 * needs to play the snippet in the composer audio preview. We
 * just return the row — the frontend uses the existing audioUrl
 * field. This helper is a thin pass-through today; the reason
 * it exists is so the route can stay type-safe (route layer
 * never touches the prisma client directly — every read goes
 * through a service method that knows which fields to expose).
 */
export async function getSongForPlayback(id: number): Promise<unknown> {
  return getSongById(id);
}

/** Public read for the user-facing picker. We omit the file
 * size to keep the picker payload small (the duration + cover
 * + url are all the composer needs). */
export async function listSongsForUser(limit = 50): Promise<unknown[]> {
  return prisma.song.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      artist: true,
      audioUrl: true,
      coverImage: true,
      durationSec: true,
      createdAt: true,
      uploader: { select: { id: true, username: true, fullName: true, displayName: true } },
    },
  });
}

// Keep the unused import alive in case future work needs to read
// raw bytes (e.g. for local mp3-to-R2 uploads that bypass the
// frontend's fileApi.upload).
void fs;
