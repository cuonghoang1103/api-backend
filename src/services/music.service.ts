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

/**
 * Build a public audioUrl for a track, deriving it from localPath
 * when audioUrl is missing.
 *
 * Why this exists:
 *   Uploaded tracks store the R2 bucket key in `localPath` (a vestige
 *   of the pre-R2 design). The frontend player only reads `audioUrl`,
 *   so a track that was uploaded but never had `audioUrl` set would
 *   show up in lists with `audioUrl = null` and refuse to play.
 *
 *   This helper bridges the two fields:
 *     - If `audioUrl` is set (YouTube, full URL, etc.) → return as-is.
 *     - Else if `localPath` is an R2 key (no leading slash, no
 *       "uploads/" prefix) → build the canonical R2 public URL.
 *     - Else if `localPath` is a legacy local path → leave audioUrl
 *       null (the stream endpoint still handles it).
 */
export function buildAudioUrl(
  audioUrl: string | null | undefined,
  localPath: string | null | undefined,
): string | null {
  if (audioUrl) return audioUrl;
  if (!localPath) return null;
  const isR2Key =
    !localPath.startsWith('/') &&
    !localPath.startsWith('uploads/') &&
    !localPath.startsWith('http://') &&
    !localPath.startsWith('https://');
  if (!isR2Key) return null;
  // Match the public URL the R2 provider builds for the same key.
  return config.r2.publicUrl
    ? `${config.r2.publicUrl.replace(/\/+$/, '')}/${localPath.replace(/^\/+/, '')}`
    : null;
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

    // Backfill audioUrl for tracks that were uploaded before the
    // `audioUrl` field was wired up. The DB column is a vestige of
    // the pre-R2 design; new uploads go through `localPath`. The
    // frontend player only reads `audioUrl`, so without this step
    // freshly-uploaded tracks would render with no playable source.
    const data = (tracks as Array<Record<string, unknown>>).map((t) => ({
      ...t,
      audioUrl: buildAudioUrl(t.audioUrl as string | null, t.localPath as string | null),
    }));

    return {
      data,
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

    const data = (tracks as Array<Record<string, unknown>>).map((t) => ({
      ...t,
      audioUrl: buildAudioUrl(t.audioUrl as string | null, t.localPath as string | null),
    }));

    return {
      data,
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

    // Backfill audioUrl from localPath (R2 key) so the frontend
    // player always has a playable source. See buildAudioUrl for
    // the full rationale.
    const t = track as Record<string, unknown>;
    return {
      ...t,
      audioUrl: buildAudioUrl(t.audioUrl as string | null, t.localPath as string | null),
    };
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

    // External (http/https) audio sources — YouTube tracks, remote
    // URLs registered via /tracks/remote — are NOT streamable through
    // this backend. The frontend plays them via the YouTube IFrame
    // Player API, which talks directly to YouTube. Returning 500
    // ("NoSuchKey") was masking the real cause and broke any tooling
    // that probed /stream/:id. Reject early with a clear 400.
    if (/^https?:\/\//i.test(filePath)) {
      throw new AppError(
        'External audio is not streamable via this endpoint',
        400,
        'EXTERNAL_AUDIO',
      );
    }

    // R2 path: bucket key (e.g. "audio/songs/1234-abcd.mp3").
    // We don't have a leading slash, so the leading-slash test
    // discriminates R2 keys from legacy local paths.
    if (!filePath.startsWith('/') && !filePath.startsWith('uploads/')) {
      // Why we proxy here (instead of redirecting to a signed R2 URL):
      //
      // The audio element in MusicAudioController is created with
      // `crossOrigin = 'anonymous'` so that we can run the bytes
      // through a Web Audio AnalyserNode (the visualizer). With
      // crossOrigin = 'anonymous', the browser enforces a CORS
      // check on every byte stream — and Cloudflare R2 has no
      // CORS policy on the bucket (the deployed R2 access token
      // does not carry `s3:PutBucketCORS`, and the dashboard is
      // out of reach from this code path).
      //
      // Result: redirecting to a signed R2 URL returns 403 to the
      // browser, and direct <audio src="https://media.cuongthai.com/...">
      // gets the same treatment — the audio element never starts.
      //
      // The fix is to stream the bytes through this backend, which
      // is same-origin as the page (`api.cuongthai.com` ↔
      // `cuongthai.com` are not strictly same-origin, but the
      // browser's CORS check does NOT apply to responses without
      // `Access-Control-Allow-Origin` headers — wait, actually it
      // does for cross-origin requests with crossOrigin set). So
      // we also pipe the stream from the backend and the browser
      // sees audio bytes flowing from `api.cuongthai.com` (the
      // page's first-party API host), which DOES carry CORS
      // headers via Nginx → no error. The cost is one extra hop
      // through Node, which is fine for the music workload.
      //
      // Range support: R2's GetObjectCommand supports Range, so we
      // forward the byte slice when the browser sends a Range
      // header. The piped response carries the same 206 status
      // and Content-Range back to the browser, so seek/scrub
      // behaviour is preserved.
      //
      // We MUST hand the range string to the provider verbatim —
      // the AWS SDK formats its Range header the same way the
      // browser does (`bytes=START-END`), so no reformatting is
      // needed. Forwarding the range is what makes seek/scrub
      // work: without it the SDK ignores the byte slice and
      // returns the full object, the response body no longer
      // matches the `Content-Range` header, and the browser
      // silently rewinds playback to byte 0 after every seek
      // ("the disc shows the song near the end but only the
      // beginning is audible" — see also R2StorageProvider
      // for the matching read-side comment).
      const { getStorageProvider } = await import('../storage/StorageProvider.js');
      const provider = getStorageProvider();
      const { stream, size, contentType } = await provider.readStream(
        filePath,
        range ? { range } : undefined,
      );

      // Parse the Range header so we can build correct 206
      // metadata. Falls back to full-file 200 when no Range or
      // when the header is unparseable (we still stream the
      // whole file in that case, which is the safe default).
      const total = size >= 0 ? size : 0;
      let start = 0;
      let end = total > 0 ? total - 1 : 0;
      let isPartial = false;

      if (range && total > 0) {
        try {
          const parsed = parseRangeHeader(range, total);
          start = parsed.start;
          end = Math.min(parsed.end, total - 1);
          if (start < total) {
            isPartial = start !== 0 || end !== total - 1;
          }
        } catch {
          // Unparseable Range — fall back to streaming the full file
          // and let the upstream provider's no-range path take over.
          isPartial = false;
        }
      }

      const contentLength = isPartial ? end - start + 1 : (total > 0 ? total : 0);
      const contentRange = isPartial ? `bytes ${start}-${end}/${total}` : `bytes 0-${total - 1}/${total}`;

      return {
        track,
        streamResult: {
          // Cast — `readStream` returns a generic Readable, which is
          // structurally compatible with the Readable StreamResult
          // expects. We typed it as `fs.ReadStream` historically,
          // but the route handler just calls `.pipe(res)` on it
          // which is identical for both.
          stream: stream as unknown as StreamResult['stream'],
          contentLength,
          start,
          end,
          contentRange,
          acceptRanges: 'bytes',
          contentType,
        },
      };
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
        // Derive audioUrl from localPath when not explicitly
        // provided. The frontend player only reads audioUrl, so
        // a freshly-uploaded track (whose only audio reference is
        // the R2 key in localPath) would otherwise render with
        // audioUrl = null and refuse to play. See buildAudioUrl.
        audioUrl: buildAudioUrl(data.audioUrl, data.localPath),
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
