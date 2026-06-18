/**
 * ============================================================
 * Music Service — Streaming & Track Management
 *
 * Cung cấp các hàm xử lý nghiệp vụ cho module nhạc:
 * - CRUD tracks, playlists
 * - HTTP 206 Partial Content streaming (core feature)
 * - Range request parsing (seek/tua nhạc)
 * - File integrity validation
 *
 * Streaming Architecture:
 *
 *   Browser Audio ──▶ GET /api/v1/music/stream/:id
 *                   ──▶ Range: bytes=0-102400    (request header)
 *                    │
 *                    ▼
 *              fs.statSync()     ──▶ Lấy file size (OS metadata, ~µs)
 *                    │
 *                    ▼
 *         Parse Range header      ──▶ start=0, end=102400
 *                    │
 *                    ▼
 *   fs.createReadStream()         ──▶ Chỉ đọc bytes 0-102400
 *   (start, end) options         ──▶ KHÔNG load toàn bộ file vào RAM
 *                    │
 *                    ▼
 *   HTTP 206 Partial Content     ──▶ Status + headers
 *   res.pipe(res)                ──▶ Stream về browser
 *                    │
 *                    ▼
 *   Browser Audio Player         ──▶ Decode & phát nhạc
 *   (HTML5 <audio>)              ──▶ Tự động gửi Range header khi seek
 *
 * Tại sao dùng createReadStream(start, end)?
 * - readFile() → đọc toàn bộ file vào RAM → crash với file 100MB
 * - createReadStream() → đọc từng chunk 64KB → RAM constant ~2MB
 * ============================================================
 */

import fs from 'fs';
import path from 'path';
import { createReadStream, statSync, existsSync } from 'fs';

import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

// ─── Types ────────────────────────────────────────────────────

export interface StreamOptions {
  /** HTTP Range header, ví dụ: "bytes=0-102400" */
  range?: string;
  /** Đường dẫn tương đối trong uploads/, ví dụ: "audio/my-song.mp3" */
  filePath: string;
  /** MIME type, ví dụ: "audio/mpeg" */
  contentType: string;
}

export interface StreamResult {
  /** Readable stream để pipe về client */
  stream: fs.ReadStream;
  /** Kích thước phần trả về (end - start + 1) */
  contentLength: number;
  /** Byte bắt đầu (0-based) */
  start: number;
  /** Byte kết thúc */
  end: number;
  /** Content-Range header value */
  contentRange: string;
  /** Accept-Ranges header value */
  acceptRanges: string;
  /** Content-Type header */
  contentType: string;
}

export interface PaginationOptions {
  page?: number;
  size?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── MIME Type Map ────────────────────────────────────────────

const AUDIO_MIME_TYPES: Record<string, string> = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.aac': 'audio/aac',
  '.m4a': 'audio/mp4',
  '.opus': 'audio/opus',
  '.webm': 'audio/webm',
};

const VIDEO_MIME_TYPES: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
};

function detectMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return (
    AUDIO_MIME_TYPES[ext]
    || VIDEO_MIME_TYPES[ext]
    || 'application/octet-stream'
  );
}

// ─── Range Header Parser ───────────────────────────────────────

/**
 * Parse HTTP Range header thành start/end bytes.
 *
 * HTTP Range spec (RFC 7233):
 * - "bytes=0-"        → start=0, end=fileSize-1  (toàn bộ file)
 * - "bytes=0-102399"  → start=0, end=102399       (102400 bytes đầu)
 * - "bytes=500000-"   → start=500000, end=fileSize-1 (từ byte 500k đến cuối)
 * - "bytes=-500000"   → last 500000 bytes            (suffix range)
 *
 * Edge cases:
 * - Range: bytes=500-499 → invalid (start > end)
 * - Range: bytes=500-     → valid (open-ended)
 * - Range: bytes=-100     → valid (suffix)
 * - Range: bytes=abc      → invalid unit
 */
export function parseRangeHeader(
  rangeHeader: string,
  fileSize: number,
): { start: number; end: number } {
  // Validate unit
  const unitSeparator = rangeHeader.indexOf('=');
  if (unitSeparator === -1) {
    throw new AppError('Invalid Range header: missing "="', 416, 'RANGE_INVALID');
  }

  const unit = rangeHeader.slice(0, unitSeparator).trim();
  if (unit !== 'bytes') {
    throw new AppError(
      `Range unit "${unit}" not supported. Use "bytes".`,
      416,
      'RANGE_NOT_SUPPORTED',
    );
  }

  const rangeValue = rangeHeader.slice(unitSeparator + 1).trim();
  if (!rangeValue) {
    throw new AppError('Range header is empty', 416, 'RANGE_EMPTY');
  }

  // Parse first-last
  const dashIndex = rangeValue.indexOf('-');
  if (dashIndex === -1) {
    throw new AppError('Invalid Range format: missing "-"', 416, 'RANGE_INVALID');
  }

  const firstStr = rangeValue.slice(0, dashIndex);
  const lastStr = rangeValue.slice(dashIndex + 1);

  // Case 1: "-500000" → suffix range (last N bytes)
  if (firstStr === '' && lastStr !== '') {
    const suffixLength = parseInt(lastStr, 10);
    if (isNaN(suffixLength) || suffixLength <= 0) {
      throw new AppError('Invalid suffix range', 416, 'RANGE_INVALID');
    }
    return {
      start: Math.max(0, fileSize - suffixLength),
      end: fileSize - 1,
    };
  }

  // Case 2: "500-" → open-ended (from byte N to end)
  if (lastStr === '') {
    const start = parseInt(firstStr, 10);
    if (isNaN(start) || start < 0) {
      throw new AppError('Invalid byte position', 416, 'RANGE_INVALID');
    }
    return { start, end: fileSize - 1 };
  }

  // Case 3: "0-102399" → closed range
  const start = parseInt(firstStr, 10);
  const end = parseInt(lastStr, 10);

  if (isNaN(start) || isNaN(end)) {
    throw new AppError('Invalid byte range values', 416, 'RANGE_INVALID');
  }

  // Validate range
  if (start < 0) {
    throw new AppError('Negative start byte is invalid', 416, 'RANGE_INVALID');
  }

  if (start > fileSize - 1) {
    throw new AppError(
      `Start byte ${start} exceeds file size ${fileSize}`,
      416,
      'RANGE_NOT_SATISFIABLE',
    );
  }

  if (end < start) {
    throw new AppError(
      `End byte ${end} is less than start byte ${start}`,
      416,
      'RANGE_INVALID',
    );
  }

  // Clamp end to file size
  const clampedEnd = Math.min(end, fileSize - 1);

  return { start, end: clampedEnd };
}

// ─── Range Stream Factory ────────────────────────────────────

/**
 * Tạo Readable Stream cho một phần của file.
 *
 * Kỹ thuật: Dùng fs.createReadStream() với options { start, end }
 * thay vì fs.readFile() để:
 * - Không load toàn bộ file vào RAM
 * - Stream từng chunk 64KB
 * - Hỗ trợ HTTP 206 Partial Content
 *
 * @example
 * const { stream, contentLength } = createRangeStream({
 *   range: req.headers.range,
 *   filePath: 'audio/my-song.mp3',
 *   contentType: 'audio/mpeg',
 * });
 * res.status(206).set(headers).pipe(stream);
 */
export function createRangeStream(options: StreamOptions): StreamResult {
  const { range, filePath, contentType } = options;

  // Resolve absolute path
  const absolutePath = path.resolve(config.uploadDir, filePath);

  // Validate file exists
  if (!existsSync(absolutePath)) {
    throw new AppError(
      `File not found: ${filePath}`,
      404,
      'FILE_NOT_FOUND',
    );
  }

  // Get file size from OS metadata (fast, no I/O)
  let fileSize: number;
  try {
    const stat = statSync(absolutePath);
    fileSize = stat.size;
  } catch (err) {
    throw new AppError(
      `Cannot read file stats: ${filePath}`,
      500,
      'FILE_STAT_ERROR',
    );
  }

  // Handle full file request (no Range header)
  if (!range) {
    const stream = createReadStream(absolutePath);
    return {
      stream,
      contentLength: fileSize,
      start: 0,
      end: fileSize - 1,
      contentRange: `bytes 0-${fileSize - 1}/${fileSize}`,
      acceptRanges: 'bytes',
      contentType,
    };
  }

  // Parse Range header
  const { start, end } = parseRangeHeader(range, fileSize);
  const contentLength = end - start + 1;

  // Create sliced stream: chỉ đọc bytes [start, end]
  // Node.js đọc từng chunk 64KB, không load toàn bộ file
  const stream = createReadStream(absolutePath, {
    start,
    end,
    // highWaterMark: 64 * 1024, // default 64KB chunks
    autoClose: true,
  });

  return {
    stream,
    contentLength,
    start,
    end,
    contentRange: `bytes ${start}-${end}/${fileSize}`,
    acceptRanges: 'bytes',
    contentType,
  };
}

// ─── Music Service Class ────────────────────────────────────

export class MusicService {
  // ─── GET /tracks ─────────────────────────────────────────
  async getTracks(params: {
    page?: number;
    size?: number;
    keyword?: string;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, params.page ?? 1);
    const size = Math.min(100, Math.max(1, params.size ?? 20));
    const skip = (page - 1) * size;

    const where = {
      active: true,
      ...(params.keyword && {
        OR: [
          { title: { contains: params.keyword, mode: 'insensitive' as const } },
          { artist: { contains: params.keyword, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [tracks, total] = await Promise.all([
      prisma.musicTrack.findMany({
        where,
        skip,
        take: size,
        orderBy: {
          [params.sortBy ?? 'createdAt']:
            params.sortDir === 'asc' ? 'asc' : 'desc',
        },
        select: {
          id: true,
          title: true,
          artist: true,
          coverImage: true,
          durationSeconds: true,
          audioUrl: true,
          localPath: true,
          createdAt: true,
        },
      }),
      prisma.musicTrack.count({ where }),
    ]);

    return {
      data: tracks,
      pagination: {
        page,
        limit: size,
        total,
        totalPages: Math.ceil(total / size),
      },
    };
  }

  // ─── GET /admin/tracks ─────────────────────────────────────
  async getAdminTracks(params: {
    page?: number;
    size?: number;
    keyword?: string;
    sortBy?: string;
    sortDir?: string;
    includeInactive?: boolean;
  }): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, params.page ?? 1);
    const size = Math.min(100, Math.max(1, params.size ?? 20));
    const skip = (page - 1) * size;

    const where = {
      ...(params.includeInactive ? {} : { active: true }),
      ...(params.keyword && {
        OR: [
          { title: { contains: params.keyword, mode: 'insensitive' as const } },
          { artist: { contains: params.keyword, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [tracks, total] = await Promise.all([
      prisma.musicTrack.findMany({
        where,
        skip,
        take: size,
        orderBy: {
          [params.sortBy ?? 'createdAt']:
            params.sortDir === 'asc' ? 'asc' : 'desc',
        },
        select: {
          id: true,
          title: true,
          artist: true,
          coverImage: true,
          durationSeconds: true,
          audioUrl: true,
          localPath: true,
          fileSize: true,
          active: true,
          createdAt: true,
        },
      }),
      prisma.musicTrack.count({ where }),
    ]);

    return {
      data: tracks,
      pagination: {
        page,
        limit: size,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / size),
      },
    };
  }

  // ─── GET /tracks/:id ─────────────────────────────────────
  async getTrackById(id: number, allowInactive = false): Promise<unknown> {
    const track = await prisma.musicTrack.findUnique({
      where: { id },
      include: {
        playlists: {
          include: { playlist: true },
        },
      },
    });

    if (!track) {
      throw new AppError('Track not found', 404, 'TRACK_NOT_FOUND');
    }

    if (!allowInactive && !track.active) {
      throw new AppError('Track has been removed', 404, 'TRACK_NOT_FOUND');
    }

    return track;
  }

  // ─── GET /stream/:id — Stream audio với Range support ───
  /**
   * Build the response the streaming endpoint should hand to the
   * client. Two branches:
   *
   *   - The track is backed by a local file (`localPath`
   *     references the old `/uploads/...` layout) — return a
   *     `streamResult` for the route handler to pipe.
   *   - The track is backed by R2 (the `localPath` is a bucket
   *     key) — return a `redirect` URL pointing at a short-
   *     lived signed R2 URL. The browser follows the redirect
   *     and streams directly from the CDN, which is faster
   *     (no Node.js in the hot path) and supports HTTP Range
   *     natively.
   */
  async getStreamOptions(
    id: number,
    range?: string,
  ): Promise<{
    track: Awaited<ReturnType<MusicService['getTrackById']>>;
    streamResult?: StreamResult;
    redirect?: string;
  }> {
    const track = await this.getTrackById(id);

    // Ưu tiên: localPath → audioUrl → error
    const filePath = (track as Record<string, unknown>).localPath as string | null
      ?? (track as Record<string, unknown>).audioUrl as string | null;

    if (!filePath) {
      throw new AppError(
        'No audio file available for this track',
        404,
        'AUDIO_NOT_FOUND',
      );
    }

    // R2 path: bucket key (e.g. "audio/songs/1234-abcd.mp3").
    // We don't have a leading slash, so the leading-slash test
    // discriminates R2 keys from legacy local paths.
    if (!filePath.startsWith('/') && !filePath.startsWith('uploads/')) {
      const { getStorageProvider } = await import('../storage/StorageProvider.js');
      const provider = getStorageProvider();
      // 10-minute signed URL. Long enough to stream a long
      // track, short enough that a leaked link is useless.
      const signed = await provider.signedUrl(filePath, 600);
      return { track, redirect: signed };
    }

    // Local path: build the legacy range stream.
    const mimeType = detectMimeType(filePath);
    const streamResult = createRangeStream({
      range,
      filePath,
      contentType: mimeType,
    });
    return { track, streamResult };
  }

  // ─── Find track by audioUrl (for de-duplication of remote tracks) ───
  // Used by the /tracks/remote endpoint to avoid creating a new row
  // every time the user picks the same YouTube song. We scope to
  // active tracks so deleted/soft-deleted entries don't shadow new
  // creates.
  async getTrackByAudioUrl(audioUrl: string): Promise<unknown> {
    if (!audioUrl) return null;
    return prisma.musicTrack.findFirst({
      where: { audioUrl, active: true },
    });
  }

  // ─── POST /tracks ─────────────────────────────────────────
  async createTrack(data: {
    title: string;
    artist: string;
    localPath?: string;
    audioUrl?: string;
    coverImage?: string;
    durationSeconds?: number;
    fileSize?: number;
  }): Promise<unknown> {
    // Validate the audio reference. Two cases:
    //   1. R2 bucket key — e.g. "audio/songs/1234-abcd.mp3". No
    //      leading slash, no "uploads/" prefix. We can't
    //      existsSync() a remote object, so we just sanity-check
    //      the key shape. The upload route has already put the
    //      object successfully, so if we got a key it's live.
    //   2. Legacy local path — leading slash OR "uploads/"
    //      prefix. The pre-R2 upload route wrote files under
    //      `config.uploadDir`; existing rows still point there.
    //      existsSync() is the right check for those.
    // Anything else (e.g. a YouTube URL) is also accepted as
    // long as `audioUrl` is set, since the streaming endpoint
    // routes YouTube links directly.
    if (data.localPath) {
      const looksLikeR2Key =
        !data.localPath.startsWith('/') &&
        !data.localPath.startsWith('uploads/');
      if (looksLikeR2Key) {
        // R2 key — basic shape check; the storage provider has
        // already verified the object exists on PUT.
        if (data.localPath.length === 0 || data.localPath.includes('..')) {
          throw new AppError(
            `Invalid storage key: ${data.localPath}`,
            400,
            'INVALID_STORAGE_KEY',
          );
        }
      } else {
        const absolutePath = path.resolve(config.uploadDir, data.localPath);
        if (!existsSync(absolutePath)) {
          throw new AppError(
            `Uploaded file not found: ${data.localPath}`,
            400,
            'FILE_NOT_FOUND',
          );
        }
      }
    }

    return prisma.musicTrack.create({
      data: {
        title: data.title,
        artist: data.artist,
        localPath: data.localPath,
        audioUrl: data.audioUrl,
        coverImage: data.coverImage,
        durationSeconds: data.durationSeconds,
        fileSize: data.fileSize,
        active: true,
      },
    });
  }

  // ─── PUT /tracks/:id ─────────────────────────────────────
  async updateTrack(
    id: number,
    data: {
      title?: string;
      artist?: string;
      coverImage?: string;
      durationSeconds?: number;
      localPath?: string;
      audioUrl?: string;
      active?: boolean;
    },
  ): Promise<unknown> {
    // Allow updating inactive tracks (admin restore)
    await this.getTrackById(id, true);

    return prisma.musicTrack.update({
      where: { id },
      data,
    });
  }

  // ─── DELETE /tracks/:id ──────────────────────────────────
  async deleteTrack(id: number): Promise<void> {
    // Allow deleting inactive tracks (idempotent)
    await this.getTrackById(id, true);

    await prisma.musicTrack.update({
      where: { id },
      data: { active: false },
    });
  }

  // ─── Hard delete (admin cleanup) ─────────────────────────
  async hardDeleteTrack(id: number): Promise<void> {
    // Capture the storage references BEFORE we delete the row
    // so we know what to remove from R2 afterwards.
    const track = await prisma.musicTrack.findUnique({ where: { id } });
    if (track) {
      const { deleteByUrls } = await import('../storage/uploadService.js');
      const urls: Array<string | null | undefined> = [track.coverImage];
      // Only the audio row is deletable on R2 — the localPath
      // might be a remote (YouTube) URL, in which case
      // deleteByUrl is a no-op.
      if (track.localPath && !track.localPath.startsWith('http')) {
        // The track's localPath stores the bucket key, not a
        // URL. Build the canonical public URL so deleteByUrls
        // can extract the key.
        const { getStorageProvider } = await import('../storage/StorageProvider.js');
        urls.push(getStorageProvider().publicUrl(track.localPath));
      }
      await deleteByUrls(urls);
    }
    await prisma.musicTrack.delete({ where: { id } });
  }

  // ─── GET /playlists ──────────────────────────────────────
  async getPlaylists(userId?: number): Promise<unknown[]> {
    const where = userId
      ? { OR: [{ userId }, { isPublic: true }] }
      : { isPublic: true };

    return prisma.musicPlaylist.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
        tracks: {
          include: { track: true },
          orderBy: { position: 'asc' },
          take: 5,
        },
        _count: { select: { tracks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── GET /playlists/:id ──────────────────────────────────
  async getPlaylistById(id: number): Promise<unknown> {
    return prisma.musicPlaylist.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
        tracks: {
          include: { track: true },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  // ─── POST /playlists ──────────────────────────────────────
  async createPlaylist(data: {
    name: string;
    description?: string;
    coverUrl?: string;
    userId?: number;
    isPublic?: boolean;
  }): Promise<unknown> {
    return prisma.musicPlaylist.create({
      data: {
        name: data.name,
        description: data.description,
        coverUrl: data.coverUrl,
        userId: data.userId,
        isPublic: data.isPublic ?? true,
      },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
        _count: {
          select: { tracks: true },
        },
      },
    });
  }

  // ─── PUT /playlists/:id ──────────────────────────────────
  async updatePlaylist(
    id: number,
    data: {
      name?: string;
      description?: string;
      coverUrl?: string;
      isPublic?: boolean;
    },
  ): Promise<unknown> {
    return prisma.musicPlaylist.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { tracks: true } },
      },
    });
  }

  // ─── DELETE /playlists/:id ───────────────────────────────
  async deletePlaylist(id: number): Promise<void> {
    await prisma.musicPlaylist.delete({ where: { id } });
  }

  // ─── POST /playlists/:id/tracks ──────────────────────────
  async addTrackToPlaylist(
    playlistId: number,
    trackId: number,
  ): Promise<unknown> {
    // Verify both exist
    await Promise.all([
      prisma.musicPlaylist.findUnique({ where: { id: playlistId } }),
      prisma.musicTrack.findUnique({ where: { id: trackId, active: true } }),
    ]);

    // Get current max position
    const maxPos = await prisma.musicPlaylistTrack.aggregate({
      where: { playlistId },
      _max: { position: true },
    });

    return prisma.musicPlaylistTrack.create({
      data: {
        playlistId,
        trackId,
        position: (maxPos._max.position ?? -1) + 1,
      },
    });
  }

  // ─── DELETE /playlists/:id/tracks/:trackId ──────────────
  async removeTrackFromPlaylist(
    playlistId: number,
    trackId: number,
  ): Promise<void> {
    await prisma.musicPlaylistTrack.delete({
      where: {
        playlistId_trackId: { playlistId, trackId },
      },
    });
  }

  // ─── PUT /playlists/:id/tracks/reorder ──────────────────
  async reorderPlaylistTracks(
    playlistId: number,
    trackIds: number[],
  ): Promise<void> {
    await Promise.all(
      trackIds.map((trackId, index) =>
        prisma.musicPlaylistTrack.update({
          where: {
            playlistId_trackId: { playlistId, trackId },
          },
          data: { position: index },
        }),
      ),
    );
  }

  // ─── Batch create tracks (admin) ─────────────────────────
  async batchCreateTracks(
    tracks: Array<{
      title: string;
      artist: string;
      localPath?: string;
      audioUrl?: string;
      coverImage?: string;
      durationSeconds?: number;
      fileSize?: number;
    }>,
  ): Promise<unknown> {
    return prisma.$transaction(
      tracks.map((t) =>
        prisma.musicTrack.create({
          data: { ...t, active: true },
        }),
      ),
    );
  }
}

export const musicService = new MusicService();
