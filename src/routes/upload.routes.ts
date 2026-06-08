import { Router, type Response } from 'express';
import multer from 'multer';
import { uploadService } from '../services/upload.service.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse, UploadResult } from '../types/index.js';
import type { FileCategory } from '../types/index.js';

const router = Router();

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

export default router;
