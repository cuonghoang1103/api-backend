/**
 * ============================================================
 * Music Routes — Spotify Clone Streaming API
 *
 * Endpoint chinh:
 *   GET /api/v1/music/stream/:id
 *     HTTP 206 Partial Content
 *     Tiep nhan Range header tu trinh duyet
 *     Tra ve chunk du lieu am thanh
 *     Ho tro tua nhac (seek) tren giao dien
 *
 * How browsers request audio:
 *
 *  1. Browser gui: GET /api/v1/music/stream/1
 *     Header: Range: bytes=0-1 (chi hoi 2 bytes dau)
 *     Backend tra: HTTP 416 Range Not Satisfiable
 *     Backend tra: Content-Range: bytes STAR_SLASH TOTAL_SIZE
 *     Browser biet duoc totalSize
 *
 *  2. Browser gui: GET /api/v1/music/stream/1
 *     Header: Range: bytes=0-CHUNK_SIZE
 *     Backend tra: HTTP 206 Partial Content
 *     Tra ve chunk dau tien
 *
 *  3. Browser gui: GET /api/v1/music/stream/1
 *     Header: Range: bytes=SEEK_POSITION-TOTAL_SIZE_MINUS_1
 *     Backend tra: HTTP 206 Partial Content
 *     Tra ve chunk tu vi tri seek
 * ============================================================
 */

import { Router, type Response, type NextFunction } from 'express';
import multer from 'multer';

import { musicService } from '../services/music.service.js';
import { uploadService } from '../services/upload.service.js';
import { normalizeAudio, isFFmpegAvailable } from '../services/ffmpeg.service.js';
import { optionalAuth, authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import { config } from '../config/env.js';

const router = Router();

// Multer: single middleware that handles both audio and cover fields
// fileFilter checks fieldname to decide which MIME types are allowed
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max for audio
  },
  fileFilter: (_req, file: Express.Multer.File, cb) => {
    if (file.fieldname === 'audio') {
      const allowed = [
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
        'audio/flac', 'audio/aac', 'audio/mp4', 'audio/x-m4a',
        'audio/opus', 'video/mp4',
      ];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Unsupported audio format: ${file.mimetype}`));
      }
    } else if (file.fieldname === 'cover') {
      const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Unsupported image format: ${file.mimetype}`));
      }
    } else {
      cb(new Error(`Unexpected field: ${file.fieldname}`));
    }
  },
});

// ════════════════════════════════════════════════════════════════
// GET /api/v1/music/tracks
// ════════════════════════════════════════════════════════════════
router.get(
  '/tracks',
  optionalAuth,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const result = await musicService.getTracks({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        size: req.query.size ? parseInt(req.query.size as string, 10) : undefined,
        keyword: req.query.keyword as string | undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortDir: req.query.sortDir as string | undefined,
      });

      const serializedData = result.data.map((track: any) => {
        const t = { ...track };
        if (t.id !== undefined) t.id = Number(t.id);
        if (t.fileSize !== undefined) t.fileSize = Number(t.fileSize);
        if (t.durationSeconds !== undefined) t.durationSeconds = Number(t.durationSeconds);
        if (t.playCount !== undefined) t.playCount = Number(t.playCount);
        return t;
      });

      const pag: any = result.pagination;
      const serializedPagination = {
        page: Number(pag.page),
        limit: Number(pag.limit ?? pag.size),
        total: Number(pag.total),
        totalPages: Number(pag.totalPages),
      };

      res.json({
        success: true,
        data: serializedData,
        pagination: serializedPagination,
      });
    } catch (error) {
      next(error);
    }
  },
);

// ─── Helper: serialize a playlist object for API responses ────────────────────
function serializePlaylist(raw: any): any {
  const out: any = { ...raw };

  // Numeric fields
  if (out.id !== undefined) out.id = Number(out.id);
  if (out.userId !== undefined) out.userId = Number(out.userId);
  if (out.trackCount !== undefined) out.trackCount = Number(out.trackCount);
  if (out.totalDurationSeconds !== undefined) out.totalDurationSeconds = Number(out.totalDurationSeconds);
  if (out.ownerId !== undefined) out.ownerId = Number(out.ownerId);

  // user.username → createdByName for frontend convenience
  if (raw.user?.username) out.createdByName = raw.user.username;

  // Prisma _count.tracks → trackCount
  if (raw._count?.tracks !== undefined && out.trackCount === undefined) {
    out.trackCount = raw._count.tracks;
  }

  // Prisma junction tracks: [{ track: {...} }] → [track] (flatten for frontend)
  if (Array.isArray(raw.tracks)) {
    out.tracks = raw.tracks.map((pt: any) => {
      if (pt.track) {
        const t: any = { ...pt.track };
        if (t.id !== undefined) t.id = Number(t.id);
        if (t.durationSeconds !== undefined) t.durationSeconds = Number(t.durationSeconds);
        if (t.fileSize !== undefined) t.fileSize = Number(t.fileSize);
        if (t.playCount !== undefined) t.playCount = Number(t.playCount);
        return t;
      }
      return pt;
    });
  }

  return out;
}

// ─── Helper: serialize multiple playlists ──────────────────────────────────────
function serializePlaylists(items: any[]): any[] {
  return items.map(serializePlaylist);
}

// ════════════════════════════════════════════════════════════════
// GET /api/v1/music/tracks/:id
// ════════════════════════════════════════════════════════════════
router.get(
  '/tracks/:id',
  optionalAuth,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('Invalid track ID', 400, 'INVALID_ID');
      }

      const track: any = await musicService.getTrackById(id);
      if (track.fileSize !== undefined) {
        track.fileSize = Number(track.fileSize);
      }
      // Serialize BigInt fields
      const serializedTrack = { ...track };
      if (serializedTrack.fileSize !== undefined) serializedTrack.fileSize = Number(serializedTrack.fileSize);
      if (serializedTrack.playCount !== undefined) serializedTrack.playCount = Number(serializedTrack.playCount);
      if (serializedTrack.id !== undefined) serializedTrack.id = Number(serializedTrack.id);
      if (serializedTrack.uploadedBy !== undefined) serializedTrack.uploadedBy = Number(serializedTrack.uploadedBy);
      if (serializedTrack.durationSeconds !== undefined) serializedTrack.durationSeconds = Number(serializedTrack.durationSeconds);

      res.json({ success: true, data: serializedTrack });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/music/admin/tracks
// ════════════════════════════════════════════════════════════════
router.get(
  '/admin/tracks',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const result = await musicService.getAdminTracks({
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        size: req.query.size ? parseInt(req.query.size as string, 10) : undefined,
        keyword: req.query.keyword as string | undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortDir: req.query.sortDir as string | undefined,
        includeInactive: req.query.includeInactive === 'true',
      });

      // Serialize BigInt fields in data array
      const serializedData = result.data.map((track: any) => {
        const t = { ...track };
        if (t.id !== undefined) t.id = Number(t.id);
        if (t.fileSize !== undefined) t.fileSize = Number(t.fileSize);
        if (t.durationSeconds !== undefined) t.durationSeconds = Number(t.durationSeconds);
        if (t.playCount !== undefined) t.playCount = Number(t.playCount);
        return t;
      });

      // Serialize BigInt in pagination
      const pag: any = result.pagination;
      const serializedPagination = {
        page: Number(pag.page),
        limit: Number(pag.limit ?? pag.size),
        total: Number(pag.total),
        totalPages: Number(pag.totalPages),
      };

      res.json({
        success: true,
        data: serializedData,
        pagination: serializedPagination,
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/music/stream/:id
// CORE: HTTP 206 Partial Content — Spotify-style streaming
// ════════════════════════════════════════════════════════════════
router.get('/stream/:id', optionalAuth, async (req: any, res: Response, next) => {
  try {
    // ─── Step 1: Parse track ID ───────────────────────────
    const trackId = parseInt(req.params.id, 10);
    if (isNaN(trackId) || trackId <= 0) {
      res.status(400);
      res.json({ success: false, message: 'Invalid track ID' });
      return;
    }

    // ─── Step 2: Lấy Range header từ trình duyệt ───────
    // Browser gửi: Range: bytes=0-102400
    // Browser seek:  Range: bytes=5000000-6000000
    const rangeHeader = req.headers.range as string | undefined;

    // ─── Step 3: Get stream options từ service ───────────
    const { streamResult, track } = await musicService.getStreamOptions(
      trackId,
      rangeHeader,
    );

    // ─── Step 4: Set HTTP headers ─────────────────────────
    // HTTP 206 Partial Content khi có Range header
    // HTTP 200 OK khi không có Range header (hoặc Range không satisfiable)
    const isPartialContent = rangeHeader !== undefined;

    if (isPartialContent) {
      res.status(206); // Partial Content
    } else {
      res.status(200); // OK
    }

    // Thiết lập headers cho streaming response
    res.set({
      // MIME type: audio/mpeg cho MP3, audio/wav cho WAV, etc.
      'Content-Type': streamResult.contentType,

      // Kích thước chunk trả về (bytes)
      // Nếu có Range: 102400 bytes
      // Nếu không Range: toàn bộ file
      'Content-Length': streamResult.contentLength,

      // Header này báo cho browser biết server hỗ trợ range request
      'Accept-Ranges': streamResult.acceptRanges,

      // Chunk này chứa bytes nào trong file
      // Ví dụ: "bytes 0-102399/5242880" (102400 bytes đầu trong file 5MB)
      'Content-Range': streamResult.contentRange,

      // Cache: cho phép browser cache 1 giờ
      // Vì file nhạc hiếm khi thay đổi
      'Cache-Control': 'public, max-age=3600',

      // Inline: browser tự động phát, không tải về
      'Content-Disposition': `inline; filename="${encodeURIComponent((track as Record<string, unknown>).title as string ?? 'audio')}.mp3"`,

      // Không buffer bởi Nginx proxy (quantam)
      'X-Accel-Buffering': 'no',

      // CORS headers cho cross-origin requests
      'Access-Control-Expose-Headers': 'Content-Range,Accept-Ranges,Content-Length',
    });

    // ─── Step 5: Pipe stream về browser ──────────────────
    // createReadStream() đọc file theo chunks 64KB
    // Không load toàn bộ file vào RAM
    streamResult.stream.pipe(res);

    // ─── Step 6: Error handling cho stream ────────────────
    // Xử lý lỗi khi streaming (file deleted, disk error, etc.)
    streamResult.stream.on('error', (err: Error) => {
      console.error(`[MusicStream] Stream error for track ${trackId}:`, err.message);

      // Nếu headers đã được gửi, không thể set status code
      // Chỉ có thể kết thúc connection
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Audio streaming error',
        });
      }

      // Ensure response is closed
      if (!res.writableEnded) {
        res.end();
      }
    });

    // ─── Step 7: Stream completion ────────────────────────
    // Log khi streaming hoàn thành (để monitor)
    streamResult.stream.on('end', () => {
      // (debug log removed 2026-06-17 — too noisy, fires on every track play)
    });

    // ─── Step 8: Handle client disconnect ─────────────────
    // Khi user tua nhạc (seek) hoặc tắt nhạc,
    // browser aborts connection → req closes
    req.on('close', () => {
      // destroy() ngắt stream ngay lập tức
      // Giải phóng file descriptor
      streamResult.stream.destroy();
    });
  } catch (error) {
    // Xử lý các lỗi không phải streaming
    // (track not found, file not found, etc.)
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// POST /api/v1/music/tracks
// Upload track (audio + cover image) + create DB record
// Auto-normalizes audio using FFmpeg loudnorm after upload
// ════════════════════════════════════════════════════════════════
router.post(
  '/tracks',
  authenticate,
  uploadMiddleware.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const { title, artist, durationSeconds } = req.body;

      // ─── Validate required fields ────────────────────────
      if (!title?.trim()) {
        throw new AppError('Track title is required', 400, 'MISSING_TITLE');
      }
      if (!artist?.trim()) {
        throw new AppError('Artist name is required', 400, 'MISSING_ARTIST');
      }

      // ─── Handle audio file upload ───────────────────────
      let localPath: string | undefined;
      let audioFileSize: number | undefined;

      const audioFile = req.files?.audio?.[0] as Express.Multer.File | undefined;
      if (audioFile) {
        const uploadResult = await uploadService.uploadFile(
          audioFile,
          'audio',
          req.userId,
        );
          localPath = uploadResult.filePath;

        // ─── FFmpeg loudnorm normalization ──────────────
        // Only normalize if FFmpeg is available and file is large enough
        // (tiny files under 100KB are usually notifications/system sounds)
        const ffmpegAvailable = await isFFmpegAvailable();
        if (ffmpegAvailable && audioFile.size > 100 * 1024) {
          const fs = await import('fs/promises');
          const pathMod = await import('path');
          const srcAbs = pathMod.resolve(config.uploadDir, localPath);
          const tmpNormalized = pathMod.resolve(config.uploadDir, `temp-normalized-${Date.now()}.mp3`);
          try {
            await normalizeAudio(srcAbs, tmpNormalized);
            // Replace original with normalized version
            const { rename } = await import('fs/promises');
            await rename(tmpNormalized, srcAbs);
            // Update file size to the normalized version
            const stats = await fs.stat(srcAbs);
            audioFileSize = stats.size;
            // (debug log removed 2026-06-17)
          } catch (normErr) {
            // Non-fatal: log and continue with original file
            console.warn('[FFmpeg] Normalization failed, using original:', normErr);
            audioFileSize = Number(uploadResult.fileSize);
          }
        } else {
          audioFileSize = Number(uploadResult.fileSize);
        }
      }

      // ─── Handle cover image upload ────────────────────
      let coverUrl: string | undefined;
      const coverFile = req.files?.cover?.[0] as Express.Multer.File | undefined;
      if (coverFile) {
        const uploadResult = await uploadService.uploadFile(
          coverFile,
          'images',
          req.userId,
        );
        coverUrl = uploadResult.url;
      }

      // ─── Create track record ────────────────────────────
      const track = await musicService.createTrack({
        title: title.trim(),
        artist: artist.trim(),
        localPath,
        coverImage: coverUrl,
        durationSeconds: durationSeconds
          ? parseInt(durationSeconds as string, 10)
          : undefined,
        fileSize: audioFileSize,
      });

      // Serialize BigInt fields for JSON response
      const serialized = track as Record<string, unknown>;
      if (serialized.fileSize !== undefined) {
        serialized.fileSize = Number(serialized.fileSize);
      }

      res.status(201).json({
        success: true,
        data: serialized,
        message: 'Track created successfully',
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// PUT /api/v1/music/tracks/:id
// Update track metadata
// ════════════════════════════════════════════════════════════════
router.put(
  '/tracks/:id',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('Invalid track ID', 400, 'INVALID_ID');
      }

      const {
        title,
        artist,
        coverImage,
        durationSeconds,
        active,
      } = req.body;

      const track: any = await musicService.updateTrack(id, {
        ...(title !== undefined && { title }),
        ...(artist !== undefined && { artist }),
        ...(coverImage !== undefined && { coverImage }),
        ...(durationSeconds !== undefined && { durationSeconds }),
        ...(active !== undefined && { active }),
      });

      const serialized: any = { ...track };
      if (serialized.id !== undefined) serialized.id = Number(serialized.id);
      if (serialized.fileSize !== undefined) serialized.fileSize = Number(serialized.fileSize);
      if (serialized.durationSeconds !== undefined) serialized.durationSeconds = Number(serialized.durationSeconds);
      if (serialized.playCount !== undefined) serialized.playCount = Number(serialized.playCount);

      res.json({ success: true, data: serialized, message: 'Track updated' });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// DELETE /api/v1/music/tracks/:id
// Soft delete (set active = false)
// ════════════════════════════════════════════════════════════════
router.delete(
  '/tracks/:id',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('Invalid track ID', 400, 'INVALID_ID');
      }

      await musicService.deleteTrack(id);

      res.json({
        success: true,
        message: 'Track deleted (soft delete)',
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/music/playlists
// ════════════════════════════════════════════════════════════════
router.get(
  '/playlists',
  optionalAuth,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const playlists = await musicService.getPlaylists(req.userId);
      const serialized = serializePlaylists(playlists);
      res.json({ success: true, data: serialized });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/music/playlists/:id
// ════════════════════════════════════════════════════════════════
router.get(
  '/playlists/:id',
  optionalAuth,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('Invalid playlist ID', 400, 'INVALID_ID');
      }

      const playlist = await musicService.getPlaylistById(id);
      if (!playlist) {
        throw new AppError('Playlist not found', 404, 'PLAYLIST_NOT_FOUND');
      }

      const serialized = serializePlaylist(playlist);
      res.json({ success: true, data: serialized });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/music/playlists
// ════════════════════════════════════════════════════════════════
router.post(
  '/playlists',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const { name, description, coverUrl, isPublic } = req.body;

      if (!name?.trim()) {
        throw new AppError('Playlist name is required', 400, 'MISSING_NAME');
      }

      const playlist: any = await musicService.createPlaylist({
        name: name.trim(),
        description,
        coverUrl,
        userId: req.userId,
        isPublic: isPublic ?? true,
      });

      const serialized = serializePlaylist(playlist);

      res.status(201).json({
        success: true,
        data: serialized,
        message: 'Playlist created',
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// PUT /api/v1/music/playlists/:id
// ════════════════════════════════════════════════════════════════
router.put(
  '/playlists/:id',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('Invalid playlist ID', 400, 'INVALID_ID');
      }

      // ─── Ownership check: only the creator or an admin can edit ───
      const existing = await musicService.getPlaylistById(id);
      if (!existing) {
        throw new AppError('Playlist not found', 404, 'PLAYLIST_NOT_FOUND');
      }
      const isOwner = (existing as any).userId === req.userId;
      const isAdmin = req.user?.roles?.some(
        (r: string) => r.toUpperCase().replace('ROLE_', '') === 'ADMIN',
      );
      if (!isOwner && !isAdmin) {
        throw new AppError('You do not have permission to edit this playlist', 403, 'FORBIDDEN');
      }

      const { name, description, coverUrl, isPublic } = req.body;

      const playlist: any = await musicService.updatePlaylist(id, {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(isPublic !== undefined && { isPublic }),
      });

      const serialized = serializePlaylist(playlist);

      res.json({ success: true, data: serialized, message: 'Playlist updated' });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// DELETE /api/v1/music/playlists/:id
// ════════════════════════════════════════════════════════════════
router.delete(
  '/playlists/:id',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('Invalid playlist ID', 400, 'INVALID_ID');
      }

      // ─── Ownership check: only the creator or an admin can delete ───
      const existing = await musicService.getPlaylistById(id);
      if (!existing) {
        throw new AppError('Playlist not found', 404, 'PLAYLIST_NOT_FOUND');
      }
      const isOwner = (existing as any).userId === req.userId;
      const isAdmin = req.user?.roles?.some(
        (r: string) => r.toUpperCase().replace('ROLE_', '') === 'ADMIN',
      );
      if (!isOwner && !isAdmin) {
        throw new AppError('You do not have permission to delete this playlist', 403, 'FORBIDDEN');
      }

      await musicService.deletePlaylist(id);

      res.json({ success: true, message: 'Playlist deleted' });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/music/tracks/remote
// Create a "remote" track record (e.g. YouTube) without uploading a file.
// The frontend uses this when a user picks a YouTube result from the
// search bar and wants to save it into a playlist — the existing
// /playlists/:id/tracks endpoint requires a numeric trackId from the
// music_tracks table, so we need a real DB row first.
//
// Returns the newly-created track in the same shape as the upload
// endpoint, so the frontend can replace the yt- placeholder id with
// the real numeric id.
// ════════════════════════════════════════════════════════════════
router.post(
  '/tracks/remote',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next): Promise<Response<ApiResponse> | void> => {
    try {
      // `source` is accepted from the client (e.g. "youtube") for
      // future analytics / filtering. We currently don't persist it
      // anywhere, hence the void cast below.
      const { title, artist, audioUrl, coverImage, durationSeconds } = req.body;
      void req.body.source;

      if (!title?.trim()) {
        throw new AppError('Track title is required', 400, 'MISSING_TITLE');
      }
      if (!artist?.trim()) {
        throw new AppError('Artist name is required', 400, 'MISSING_ARTIST');
      }
      if (!audioUrl?.trim()) {
        throw new AppError('audioUrl is required for remote tracks', 400, 'MISSING_AUDIO_URL');
      }

      // De-dupe by audioUrl: if a track with the same audioUrl already
      // exists (e.g. user re-searches the same song), reuse it instead
      // of creating a duplicate row. This also keeps playlists stable —
      // the same YouTube video always maps to the same numeric trackId.
      const existing: any = await musicService.getTrackByAudioUrl(audioUrl);
      if (existing) {
        return res.status(200).json({
          success: true,
          data: {
            ...existing,
            id: Number(existing.id),
            durationSeconds: existing.durationSeconds != null ? Number(existing.durationSeconds) : null,
            fileSize: existing.fileSize != null ? Number(existing.fileSize) : null,
          },
          message: 'Track already exists',
        });
      }

      const created: any = await musicService.createTrack({
        title: String(title).trim().slice(0, 255),
        artist: String(artist).trim().slice(0, 255),
        audioUrl: String(audioUrl).trim().slice(0, 700),
        coverImage: coverImage ? String(coverImage).trim().slice(0, 700) : undefined,
        durationSeconds: typeof durationSeconds === 'number' && Number.isFinite(durationSeconds) && durationSeconds > 0
          ? Math.floor(durationSeconds)
          : undefined,
      });

      return res.status(201).json({
        success: true,
        data: {
          ...created,
          id: Number(created.id),
          durationSeconds: created.durationSeconds != null ? Number(created.durationSeconds) : null,
          fileSize: created.fileSize != null ? Number(created.fileSize) : null,
        },
        message: 'Remote track created',
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/music/playlists/:id/tracks
// Add track to playlist
// ════════════════════════════════════════════════════════════════
router.post(
  '/playlists/:id/tracks',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const playlistId = parseInt(req.params.id, 10);
      const { trackId } = req.body;

      if (isNaN(playlistId) || playlistId <= 0) {
        throw new AppError('Invalid playlist ID', 400, 'INVALID_ID');
      }
      if (!trackId || isNaN(parseInt(trackId as string, 10))) {
        throw new AppError('Valid trackId is required', 400, 'INVALID_TRACK_ID');
      }

      await musicService.addTrackToPlaylist(
        playlistId,
        parseInt(trackId as string, 10),
      );

      // Return the full updated playlist so frontend can update its store
      const updatedPlaylist: any = await musicService.getPlaylistById(playlistId);
      const serialized = serializePlaylist(updatedPlaylist);

      res.status(201).json({
        success: true,
        data: serialized,
        message: 'Track added to playlist',
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// DELETE /api/v1/music/playlists/:id/tracks/:trackId
// Remove track from playlist
// ════════════════════════════════════════════════════════════════
router.delete(
  '/playlists/:id/tracks/:trackId',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const playlistId = parseInt(req.params.id, 10);
      const trackId = parseInt(req.params.trackId, 10);

      if (isNaN(playlistId) || isNaN(trackId)) {
        throw new AppError('Invalid IDs', 400, 'INVALID_ID');
      }

      await musicService.removeTrackFromPlaylist(playlistId, trackId);

      // Return full updated playlist so frontend can update its store
      const updatedPlaylist: any = await musicService.getPlaylistById(playlistId);
      const serialized = serializePlaylist(updatedPlaylist);

      res.json({
        success: true,
        data: serialized,
        message: 'Track removed from playlist',
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// PUT /api/v1/music/playlists/:id/tracks/reorder
// Reorder tracks in playlist
// ════════════════════════════════════════════════════════════════
router.put(
  '/playlists/:id/tracks/reorder',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const playlistId = parseInt(req.params.id, 10);
      const { trackIds } = req.body;

      if (isNaN(playlistId) || playlistId <= 0) {
        throw new AppError('Invalid playlist ID', 400, 'INVALID_ID');
      }
      if (!Array.isArray(trackIds) || trackIds.length === 0) {
        throw new AppError('trackIds array is required', 400, 'INVALID_TRACK_IDS');
      }

      await musicService.reorderPlaylistTracks(
        playlistId,
        trackIds.map((id: string | number) => parseInt(String(id), 10)),
      );

      res.json({
        success: true,
        message: 'Playlist tracks reordered',
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// POST /api/v1/music/admin/youtube-import
// Import a track from YouTube URL (video URL + thumbnail)
// ════════════════════════════════════════════════════════════════
router.post(
  '/admin/youtube-import',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const { url, title, artist } = req.body as {
        url?: string;
        title?: string;
        artist?: string;
      };

      if (!url?.trim()) {
        throw new AppError('YouTube URL is required', 400, 'MISSING_URL');
      }

      const apiKey = config.youtubeApiKey;
      if (!apiKey) {
        throw new AppError(
          'YouTube API key is not configured. Set YOUTUBE_API_KEY in environment.',
          503,
          'YOUTUBE_NOT_CONFIGURED',
        );
      }

      // Parse video ID from various YouTube URL formats
      const videoIdMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      );
      if (!videoIdMatch) {
        throw new AppError('Invalid YouTube URL', 400, 'INVALID_YOUTUBE_URL');
      }
      const videoId = videoIdMatch[1];

      // Fetch video details from YouTube Data API
      const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
      detailsUrl.searchParams.set('part', 'snippet,contentDetails');
      detailsUrl.searchParams.set('id', videoId);
      detailsUrl.searchParams.set('key', apiKey);

      const detailsRes = await fetch(detailsUrl.toString());
      if (!detailsRes.ok) {
        const errText = await detailsRes.text();
        console.error('[YouTube Import] API error:', errText);
        throw new AppError('Failed to fetch YouTube video details', 502, 'YOUTUBE_ERROR');
      }
      const detailsData = await detailsRes.json() as {
        items?: Array<{
          snippet: {
            title: string;
            channelTitle: string;
            thumbnails: { maxres?: { url?: string }; high?: { url?: string }; medium?: { url?: string } };
          };
          contentDetails: { duration?: string };
        }>;
        error?: { message?: string };
      };

      if (detailsData.error?.message) {
        throw new AppError(`YouTube API error: ${detailsData.error.message}`, 502, 'YOUTUBE_ERROR');
      }

      const item = detailsData.items?.[0];
      if (!item) {
        throw new AppError('YouTube video not found', 404, 'VIDEO_NOT_FOUND');
      }

      const snippet = item.snippet;
      const rawDuration = item.contentDetails?.duration || '';

      // Parse ISO 8601 duration to seconds
      function parseDuration(iso: string): number {
        if (!iso) return 0;
        const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return 0;
        return (
          parseInt(match[1] || '0', 10) * 3600
          + parseInt(match[2] || '0', 10) * 60
          + parseInt(match[3] || '0', 10)
        );
      }

      const trackTitle = (title?.trim() || snippet.title || 'Unknown').replace(/["\n\r]/g, ' ').trim();
      const trackArtist = (artist?.trim() || snippet.channelTitle || 'Unknown Artist').replace(/["\n\r]/g, ' ').trim();
      const thumbnail =
        snippet.thumbnails?.maxres?.url
        || snippet.thumbnails?.high?.url
        || snippet.thumbnails?.medium?.url
        || '';
      const durationSeconds = parseDuration(rawDuration);

      // Build the embed/audio URL (uses YouTube nocookie embed — no ads)
      const audioUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Create track in database
      const track = await musicService.createTrack({
        title: trackTitle,
        artist: trackArtist,
        audioUrl,
        coverImage: thumbnail || undefined,
        durationSeconds: durationSeconds || undefined,
      });

      const serialized = track as Record<string, unknown>;
      if (serialized.id !== undefined) serialized.id = Number(serialized.id);
      if (serialized.fileSize !== undefined) serialized.fileSize = Number(serialized.fileSize);
      if (serialized.durationSeconds !== undefined) serialized.durationSeconds = Number(serialized.durationSeconds);

      res.status(201).json({
        success: true,
        data: serialized,
        message: 'Track imported from YouTube successfully',
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/music/youtube-search (PUBLIC — anyone can search)
// Used by the in-app search bar so guests and regular users get the
// same experience as admins. Result is metadata only — playback for
// YouTube tracks still happens client-side (no DB row created).
// ════════════════════════════════════════════════════════════════
router.get(
  '/youtube-search',
  optionalAuth,
  async (req: any, res: Response<ApiResponse>, next) => {
    return handleYouTubeSearch(req, res, next);
  },
);

// ════════════════════════════════════════════════════════════════
// GET /api/v1/music/admin/youtube-search (ADMIN — kept for back-compat)
// Functionally identical to the public route, but reserved as a
// separate path so we can enrich admin-only fields later (e.g.
// private tracks, import-into-library action).
// ════════════════════════════════════════════════════════════════
router.get(
  '/admin/youtube-search',
  authenticate,
  async (req: any, res: Response<ApiResponse>, next) => {
    return handleYouTubeSearch(req, res, next);
  },
);

// ─── Shared YouTube search handler ────────────────────────────
async function handleYouTubeSearch(
  req: any,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> {
  try {
    const { q } = req.query as { q?: string };

    if (!q?.trim()) {
      throw new AppError('Search query is required', 400, 'MISSING_QUERY');
    }

    const apiKey = config.youtubeApiKey;
    if (!apiKey) {
      throw new AppError(
        'YouTube API key is not configured. Set YOUTUBE_API_KEY in environment.',
        503,
        'YOUTUBE_NOT_CONFIGURED',
      );
    }

    const query = q.trim();

    // Step 1: Search YouTube for the music video
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('q', query);
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('videoCategoryId', '10'); // Music category
    searchUrl.searchParams.set('maxResults', '20');
    searchUrl.searchParams.set('key', apiKey);

    const searchRes = await fetch(searchUrl.toString());
    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error('[YouTube Search] Search API error:', errText);
      throw new AppError('YouTube search failed', 502, 'YOUTUBE_ERROR');
    }
    const searchData = (await searchRes.json()) as {
      items?: Array<{ id: { videoId: string }; snippet: { title: string; channelTitle: string; thumbnails: { medium?: { url?: string }; high?: { url?: string } } } }>;
      error?: { message?: string };
    };

    if (searchData.error?.message) {
      throw new AppError(`YouTube API error: ${searchData.error.message}`, 502, 'YOUTUBE_ERROR');
    }

    const items = searchData.items || [];
    if (items.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    // Step 2: Get video durations
    const videoIds = items.map((item) => item.id.videoId).filter(Boolean);
    const videoDetailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videoDetailsUrl.searchParams.set('part', 'contentDetails');
    videoDetailsUrl.searchParams.set('id', videoIds.join(','));
    videoDetailsUrl.searchParams.set('key', apiKey);

    const detailsRes = await fetch(videoDetailsUrl.toString());
    const durationMap: Record<string, string> = {};
    if (detailsRes.ok) {
      const detailsData = (await detailsRes.json()) as {
        items?: Array<{ id: string; contentDetails: { duration?: string } }>;
      };
      if (detailsData.items) {
        for (const item of detailsData.items) {
          if (item.contentDetails?.duration) {
            durationMap[item.id] = item.contentDetails.duration;
          }
        }
      }
    }

    // Step 3: Build result array
    const results = items.map((item) => {
      const snippet = item.snippet;
      const videoId = item.id.videoId;
      const rawTitle = snippet.title || '';

      // Try to extract artist - title pattern
      let artistName = snippet.channelTitle || 'Unknown Artist';
      let trackTitle = rawTitle;

      // Common separators: " - ", " — ", " | "
      const separators = [' - ', ' — ', ' | ', ' – ', ' // '];
      for (const sep of separators) {
        if (rawTitle.includes(sep)) {
          const parts = rawTitle.split(sep);
          // Usually artist comes first, title comes second
          artistName = parts[0].trim();
          trackTitle = parts.slice(1).join(sep).trim();
          break;
        }
      }

      // Clean up "Official Video", "Audio", "Lyric Video" etc.
      const junkPatterns = [
        /\(Official (?:Music )?Video\)/i,
        /\(Official (?:Music )?Audio\)/i,
        /\(Lyric (?:Video|Audio)\)/i,
        /\[Official (?:Music )?Video\]/i,
        /\[Official (?:Music )?Audio\]/i,
        /\[Lyric (?:Video|Audio)\]/i,
        /\(Audio\)/i,
        /\[Audio\]/i,
      ];
      for (const pat of junkPatterns) {
        trackTitle = trackTitle.replace(pat, '').trim();
      }

      const thumbnail =
        snippet.thumbnails?.medium?.url || snippet.thumbnails?.high?.url || '';

      const rawDuration = durationMap[videoId] || '';
      const duration = parseYouTubeDuration(rawDuration);

      return {
        id: videoId,
        title: trackTitle,
        artist: artistName,
        thumbnail,
        videoId,
        durationSeconds: duration,
        duration: formatDuration(duration),
      };
    });

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
}



function parseYouTubeDuration(iso: string): number {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return (
    parseInt(match[1] || '0', 10) * 3600
    + parseInt(match[2] || '0', 10) * 60
    + parseInt(match[3] || '0', 10)
  );
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default router;
