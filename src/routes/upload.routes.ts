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
import { getStorageProvider } from '../storage/StorageProvider.js';
import { generateSignedUploadUrl, verifySignedUploadToken } from '../services/upload.service.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();
const SIGNED_URL_EXPIRY_MS = 30 * 60 * 1000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB hard cap; per-category caps live in uploadService
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
        results.push(out);
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
  multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } }).single('file'),
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

export default router;
