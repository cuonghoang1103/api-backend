import { Router, type Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { uploadService, generateSignedUploadUrl, verifySignedUploadToken } from '../services/upload.service.js';
import type { ApiResponse, UploadResult } from '../types/index.js';
import type { FileCategory } from '../types/index.js';

const router = Router();
const SIGNED_URL_EXPIRY_MS = 30 * 60 * 1000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (_req, _file, cb) => {
    // Allow all file types; validation happens in service
    cb(null, true);
  },
});

// ─── POST /api/v1/files/upload ─────────────────────────
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  async (
    req,
    res: Response<ApiResponse<UploadResult>>,
    next,
  ) => {
    try {
      if (!req.file) {
        throw new AppError('No file provided', 400, 'NO_FILE');
      }

      const category = (req.body.category || 'documents') as FileCategory;
      const result = await uploadService.uploadFile(req.file, category, req.userId);

      res.status(201).json({
        success: true,
        data: result,
        message: 'File uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  },
);

// ─── POST /api/v1/files/upload/multiple ────────────────
router.post(
  '/upload/multiple',
  authenticate,
  upload.array('files', 10),
  async (
    req,
    res: Response<ApiResponse<UploadResult[]>>,
    next,
  ) => {
    try {
      if (!req.files || req.files.length === 0) {
        throw new AppError('No files provided', 400, 'NO_FILES');
      }

      const category = (req.body.category || 'documents') as FileCategory;
      const results = await uploadService.uploadMultiple(
        req.files as Express.Multer.File[],
        category,
        req.userId,
      );

      res.status(201).json({
        success: true,
        data: results,
        message: `${results.length} files uploaded successfully`,
      });
    } catch (error) {
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

    const file = await uploadService.getFile(id);
    if (!file) {
      throw new AppError('File not found', 404, 'FILE_NOT_FOUND');
    }

    // Only uploader or admin can delete
    if (file.uploadedBy !== req.userId && !req.user?.roles.includes('ROLE_ADMIN')) {
      throw new AppError('Not authorized to delete this file', 403, 'FORBIDDEN');
    }

    await uploadService.deleteFile(id);

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

    const file = await uploadService.getFile(id);
    if (!file) {
      throw new AppError('File not found', 404, 'FILE_NOT_FOUND');
    }

    res.json({ success: true, data: file });
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
  async (req, res: Response<ApiResponse<UploadResult>>, next) => {
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

      // Validate file type against signed payload
      if (req.file.mimetype !== payload.contentType) {
        throw new AppError(
          `File type mismatch. Expected ${payload.contentType}, got ${req.file.mimetype}`,
          400,
          'TYPE_MISMATCH',
        );
      }

      // Save file locally
      const baseSlug = payload.filename
        ? payload.filename.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 50)
        : 'file';
      const timestamp = Date.now();
      const randomStr = uuidv4().split('-')[0];
      const ext = path.extname(payload.filename || req.file.originalname || 'file').toLowerCase();
      const storedName = `${baseSlug}-${timestamp}-${randomStr}${ext}`;

      const relativePath = `${payload.folder}/${storedName}`;
      const fullPath = path.join(config.uploadDir, relativePath);

      await fs.mkdir(path.dirname(fullPath), { recursive: true, mode: 0o777 });
      await fs.chmod(path.dirname(fullPath), 0o777).catch(() => { /* ignore */ });
      await fs.writeFile(fullPath, req.file.buffer);

      const publicUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;

      // Save to database
      const attachment = await prisma.fileAttachment.create({
        data: {
          originalName: payload.filename || req.file.originalname,
          storedName,
          filePath: relativePath,
          contentType: payload.contentType,
          fileSize: req.file.size,
          uploadedBy: payload.userId || undefined,
          fileCategory: payload.folder.split('/')[0] || 'documents',
        },
      });

      res.status(201).json({
        success: true,
        data: {
          id: attachment.id,
          originalName: attachment.originalName,
          storedName: attachment.storedName,
          filePath: attachment.filePath,
          url: publicUrl,
          contentType: attachment.contentType,
          fileSize: Number(attachment.fileSize),
          fileCategory: attachment.fileCategory || payload.folder.split('/')[0],
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
