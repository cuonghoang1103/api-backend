/**
 * File upload routes.
 *
 * All routes use multer in memory mode — the file is held in
 * RAM as a Buffer until the route handler passes it to
 * `uploadService` (R2 or local), so we never write a temp file
 * to the VPS disk for a normal upload.
 *
 * The signed-URL flow (`/upload/signed-url` + `/upload/signed/:token`)
 * is preserved for large direct uploads: the client requests a
 * short-lived token, then `PUT`s the file body directly. We
 * still receive it as a buffer and run it through the same
 * upload pipeline, so the optimization/storage rules apply
 * uniformly.
 */
import { Router, type Response } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { prisma } from '../config/database.js';
import {
  uploadGeneric,
  uploadImage,
  deleteByKey,
  UploadError,
} from '../storage/uploadService.js';
import { extractVideoThumbnail, extractVideoThumbnailFromUrl } from '../services/video.service.js';
import { getStorageProvider } from '../storage/StorageProvider.js';
import { generateSignedUploadUrl, verifySignedUploadToken } from '../services/upload.service.js';
import { buildKey } from '../storage/keys.js';
import {
  getSignedUploadUrl as r2SignedUploadUrl,
  getSignedDownloadUrl as r2SignedDownloadUrl,
  headObject as r2HeadObject,
  buildPublicUrl as r2BuildPublicUrl,
} from '../config/r2.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();
const SIGNED_URL_EXPIRY_MS = 30 * 60 * 1000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 160 * 1024 * 1024, // 160MB hard cap (150MB videos + headroom); per-category caps live in uploadService
  },
});

/**
 * Map a public `category` string (as sent by the client) to a
 * bucket prefix. We accept the existing client vocabulary
 * (`images`, `documents`, `audio`, `video`) so nothing on the
 * frontend has to change.
 */
function resolveCategory(raw: string | undefined): {
  bucket: 'images/avatar' | 'images/post' | 'images/cover' | 'images/chat' | 'images/playlist-covers' | 'images/thumbnails' | 'documents/lesson' | 'documents/chat' | 'audio/songs' | 'audio/notifications' | 'video';
  optimize: boolean;
} {
  const c = (raw || 'documents').toLowerCase();
  if (c === 'avatar' || c === 'avatars') return { bucket: 'images/avatar', optimize: true };
  if (c === 'post' || c === 'posts' || c === 'images') return { bucket: 'images/post', optimize: true };
  if (c === 'cover' || c === 'covers') return { bucket: 'images/cover', optimize: true };
  if (c === 'chat' || c === 'messages') return { bucket: 'images/chat', optimize: true };
  if (c === 'playlist' || c === 'playlist-covers') return { bucket: 'images/playlist-covers', optimize: true };
  if (c === 'thumbnails' || c === 'thumb') return { bucket: 'images/thumbnails', optimize: true };
  if (c === 'lesson' || c === 'lesson-documents' || c === 'documents') return { bucket: 'documents/lesson', optimize: false };
  if (c === 'chat-docs' || c === 'chat-attachments') return { bucket: 'documents/chat', optimize: false };
  if (c === 'audio' || c === 'songs') return { bucket: 'audio/songs', optimize: false };
  if (c === 'notification-sound' || c === 'notifications') return { bucket: 'audio/notifications', optimize: false };
  if (c === 'video') return { bucket: 'video', optimize: false };
  // Unknown — fall back to documents so we never silently drop.
  return { bucket: 'documents/lesson', optimize: false };
}

// ─── POST /api/v1/files/upload ─────────────────────────
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  async (req, res: Response<ApiResponse>, next) => {
    try {
      if (!req.file) {
        throw new AppError('No file provided', 400, 'NO_FILE');
      }
      const { bucket, optimize } = resolveCategory(req.body.category);
      const input = {
        buffer: req.file.buffer,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
      const result = optimize
        ? await uploadImage(input, bucket, { userId: req.userId })
        : await uploadGeneric(input, bucket, { userId: req.userId, optimize: false });

      // Auto-generate thumbnail for uploaded videos
      let thumbnail: string | null = null;
      if (req.file.mimetype.includes('video')) {
        thumbnail = await extractVideoThumbnail(
          req.file.buffer,
          req.file.originalname,
          req.userId,
        );

        // ─── Track pending video upload for cleanup ──────────────────────
        // For videos, record in pending_uploads so orphaned R2 objects
        // from interrupted posts can be cleaned up by the cron job.
        const pendingExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const videoKey = result.key || result.url?.split('/').pop() || '';
        if (videoKey) {
          await prisma.pendingUpload.upsert({
            where: { userId_r2Key: { userId: req.userId!, r2Key: videoKey } },
            create: {
              userId: req.userId!,
              r2Key: videoKey,
              url: result.url,
              thumbnail: thumbnail || null,
              fileSize: BigInt(req.file.size),
              mimeType: req.file.mimetype,
              fileName: req.file.originalname,
              status: 'PENDING',
              expiresAt: pendingExpiry,
            },
            update: {
              status: 'PENDING',
              expiresAt: pendingExpiry,
            },
          }).catch(() => {
            logger.warn('[upload] pending_upload tracking skipped (table may not exist)');
          });
        }
      }

      res.status(201).json({
        success: true,
        data: { ...result, thumbnail },
        message: 'File uploaded successfully',
      });
    } catch (error) {
      if (error instanceof UploadError) {
        return next(new AppError(error.message, error.status, error.code));
      }
      next(error);
    }
  },
);

// ─── POST /api/v1/files/upload/multiple ────────────────
router.post(
  '/upload/multiple',
  authenticate,
  upload.array('files', 10),
  async (req, res: Response<ApiResponse>, next) => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        throw new AppError('No files provided', 400, 'NO_FILES');
      }
      const { bucket, optimize } = resolveCategory(req.body.category);
      const results = [];
      for (const f of req.files as Express.Multer.File[]) {
        const input = {
          buffer: f.buffer,
          originalName: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
        };
        const out = optimize
          ? await uploadImage(input, bucket, { userId: req.userId })
          : await uploadGeneric(input, bucket, { userId: req.userId, optimize: false });

        // Auto-generate thumbnail for uploaded videos
        let thumbnail: string | null = null;
        if (f.mimetype.includes('video')) {
          thumbnail = await extractVideoThumbnail(f.buffer, f.originalname, req.userId);
        }

        results.push({ ...out, thumbnail });
      }
      res.status(201).json({
        success: true,
        data: results,
        message: `${results.length} files uploaded successfully`,
      });
    } catch (error) {
      if (error instanceof UploadError) {
        return next(new AppError(error.message, error.status, error.code));
      }
      next(error);
    }
  },
);

// ─── DELETE /api/v1/files/:id ───────────────────────────
router.delete('/:id', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new AppError('Invalid file ID', 400, 'INVALID_ID');
    }
    const file = await prisma.fileAttachment.findUnique({ where: { id } });
    if (!file) {
      throw new AppError('File not found', 404, 'FILE_NOT_FOUND');
    }
    if (file.uploadedBy !== req.userId && !req.user?.roles?.includes('ROLE_ADMIN')) {
      throw new AppError('Not authorized to delete this file', 403, 'FORBIDDEN');
    }
    // Best-effort storage delete. We do it BEFORE the DB delete
    // so a failed DB delete still leaves the file marked for
    // cleanup. Conversely, if the storage delete throws, we
    // still proceed — orphaned files are a smaller problem than
    // orphaned DB rows that point at nothing.
    await deleteByKey(file.filePath);
    await prisma.fileAttachment.delete({ where: { id } });
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/files/:id ──────────────────────────────
router.get('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw new AppError('Invalid file ID', 400, 'INVALID_ID');
    }
    const file = await prisma.fileAttachment.findUnique({ where: { id } });
    if (!file) {
      throw new AppError('File not found', 404, 'FILE_NOT_FOUND');
    }
    res.json({
      success: true,
      data: {
        id: file.id,
        originalName: file.originalName,
        storedName: file.storedName,
        url: getStorageProvider().publicUrl(file.filePath),
        contentType: file.contentType,
        fileSize: Number(file.fileSize),
        fileCategory: file.fileCategory,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/v1/files/upload/signed-url ────────────────────
router.get('/upload/signed-url', authenticate, (req, res: Response<ApiResponse>, next) => {
  try {
    const filename = req.query.filename as string;
    const folder = (req.query.folder as string) || 'social/images';
    const contentType = (req.query.contentType as string) || 'image/jpeg';

    if (!filename) {
      throw new AppError('filename is required', 400, 'MISSING_FILENAME');
    }

    const { uploadUrl } = generateSignedUploadUrl(filename, contentType, folder, req.userId);

    res.json({
      success: true,
      data: {
        uploadUrl,
        expiresIn: Math.round(SIGNED_URL_EXPIRY_MS / 1000),
        method: 'PUT',
        contentType,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/v1/files/upload/signed/:token ────────────────
router.put(
  '/upload/signed/:token',
  multer({ storage: multer.memoryStorage(), limits: { fileSize: 160 * 1024 * 1024 } }).single('file'),
  async (req, res: Response<ApiResponse>, next) => {
    try {
      const { token } = req.params;
      if (!token) {
        throw new AppError('Token is required', 400, 'MISSING_TOKEN');
      }
      const payload = verifySignedUploadToken(token);
      if (!payload) {
        throw new AppError('Invalid or expired upload token', 401, 'INVALID_TOKEN');
      }
      if (!req.file) {
        throw new AppError('No file provided', 400, 'NO_FILE');
      }
      if (req.file.mimetype !== payload.contentType) {
        throw new AppError(
          `File type mismatch. Expected ${payload.contentType}, got ${req.file.mimetype}`,
          400,
          'TYPE_MISMATCH',
        );
      }

      const { bucket, optimize } = resolveCategory(payload.folder);
      const input = {
        buffer: req.file.buffer,
        originalName: payload.filename || req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
      const result = optimize
        ? await uploadImage(input, bucket, { userId: payload.userId ?? undefined })
        : await uploadGeneric(input, bucket, { userId: payload.userId ?? undefined, optimize: false });

      logger.info(`[upload] signed PUT ${result.url} (${result.size}B)`);

      res.status(201).json({
        success: true,
        data: result,
        message: 'File uploaded successfully',
      });
    } catch (error) {
      if (error instanceof UploadError) {
        return next(new AppError(error.message, error.status, error.code));
      }
      next(error);
    }
  },
);

// ─── Presigned DIRECT-to-R2 upload (large videos) ─────────────────────────
//
// The normal multipart path buffers the file on the API server AND flows
// through the Cloudflare proxy, whose free/pro plans cap request bodies at
// 100MB. For 150MB feed videos the browser instead:
//   1. POST /upload/presign-r2            → presigned PUT URL + object key
//   2. PUT <presigned URL> (file body)    → straight to r2.cloudflarestorage.com
//   3. POST /upload/presign-r2/complete   → server verifies the object landed,
//      extracts the poster thumbnail (ffmpeg reads a signed GET URL), and
//      returns the same payload shape as POST /upload.
//
// Requires a CORS rule on the R2 bucket allowing PUT from the site origin.
// Video-only on purpose — every other category fits the normal path.

const PRESIGN_KEY_RE = /^video\/[\w./-]+$/;

router.post('/upload/presign-r2', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    if (getStorageProvider().kind !== 'r2') {
      // Local-dev storage — client should fall back to the multipart path.
      throw new AppError('Direct upload unavailable on this storage backend', 400, 'PRESIGN_UNAVAILABLE');
    }
    const { filename, contentType, size } = req.body ?? {};
    if (!filename || typeof filename !== 'string') {
      throw new AppError('filename is required', 400, 'MISSING_FILENAME');
    }
    if (!contentType || typeof contentType !== 'string' || !contentType.startsWith('video/')) {
      throw new AppError('Only video uploads may use the direct path', 400, 'INVALID_CONTENT_TYPE');
    }
    const numSize = Number(size);
    if (!Number.isFinite(numSize) || numSize <= 0 || numSize > config.maxFileSizeVideo) {
      throw new AppError(
        `Video exceeds the ${Math.round(config.maxFileSizeVideo / (1024 * 1024))}MB limit`,
        400,
        'FILE_TOO_LARGE',
      );
    }

    const key = buildKey('video', filename, { userId: req.userId });
    const uploadUrl = await r2SignedUploadUrl(key, contentType, 3600);

    res.json({
      success: true,
      data: { uploadUrl, key, method: 'PUT', headers: { 'Content-Type': contentType }, expiresIn: 3600 },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/upload/presign-r2/complete', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    if (getStorageProvider().kind !== 'r2') {
      throw new AppError('Direct upload unavailable on this storage backend', 400, 'PRESIGN_UNAVAILABLE');
    }
    const { key, originalName } = req.body ?? {};
    if (!key || typeof key !== 'string' || !PRESIGN_KEY_RE.test(key) || key.includes('..')) {
      throw new AppError('Invalid object key', 400, 'INVALID_KEY');
    }

    const head = await r2HeadObject(key);
    if (!head) {
      throw new AppError('Uploaded object not found — did the PUT succeed?', 404, 'OBJECT_NOT_FOUND');
    }
    if (head.size > config.maxFileSizeVideo) {
      // Guard against a client uploading more than it declared at presign.
      throw new AppError('Uploaded object exceeds the video size limit', 400, 'FILE_TOO_LARGE');
    }

    // Poster thumbnail: ffmpeg reads a short-lived signed GET URL (Range
    // requests — it only pulls the first ~seconds of the file).
    const name = typeof originalName === 'string' && originalName ? originalName : key.split('/').pop() || 'video.mp4';
    const signedGet = await r2SignedDownloadUrl(key, 600);
    const thumbnail = await extractVideoThumbnailFromUrl(signedGet, name, req.userId);

    // ─── Track pending upload for cleanup ──────────────────────────────────
    // Record this upload so a cron job can clean up orphaned R2 objects
    // if the user navigates away mid-post or the browser crashes.
    // PendingUpload rows are marked CONFIRMED when the post is successfully
    // created, and EXPIRED + deleted by the nightly cron.
    const pendingExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h TTL
    await prisma.pendingUpload.upsert({
      where: { userId_r2Key: { userId: req.userId!, r2Key: key } },
      create: {
        userId: req.userId!,
        r2Key: key,
        url: r2BuildPublicUrl(key),
        thumbnail: thumbnail || null,
        fileSize: BigInt(head.size),
        mimeType: head.contentType || 'video/mp4',
        fileName: name,
        status: 'PENDING',
        expiresAt: pendingExpiry,
      },
      update: {
        // Re-upload of the same key — refresh TTL and status
        status: 'PENDING',
        expiresAt: pendingExpiry,
      },
    }).catch(() => {
      // Non-fatal: if the table doesn't exist yet (pre-migration), skip
      logger.warn('[upload] pending_upload tracking skipped (table may not exist)');
    });

    logger.info(`[upload] presigned direct video ${key} (${head.size}B)`);

    res.status(201).json({
      success: true,
      data: {
        key,
        url: r2BuildPublicUrl(key),
        size: head.size,
        contentType: head.contentType,
        thumbnail,
      },
      message: 'File uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
