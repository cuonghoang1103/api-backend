/**
 * POST /api/v1/music/admin/upload
 * Alias route for music track upload.
 * Reuses the same logic as POST /api/v1/music/tracks via musicRoutes.
 */
import { Router, type Response } from 'express';
import multer from 'multer';

import { musicService } from '../services/music.service.js';
import { uploadService } from '../services/upload.service.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file: Express.Multer.File, cb) => {
    const allowed = ['audio/mpeg','audio/mp3','audio/wav','audio/ogg','audio/flac','audio/aac','audio/mp4','audio/x-m4a','audio/opus','video/mp4'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported audio format: ${file.mimetype}`));
    }
  },
});

const coverUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file: Express.Multer.File, cb) => {
    const allowed = ['image/jpeg','image/png','image/gif','image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported image format: ${file.mimetype}`));
    }
  },
});

router.post(
  '/',
  authenticate,
  audioUpload.fields([{ name: 'audio', maxCount: 1 }]),
  coverUpload.fields([{ name: 'cover', maxCount: 1 }]),
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const { title, artist, durationSeconds } = req.body;

      if (!title?.trim()) {
        throw new AppError('Track title is required', 400, 'MISSING_TITLE');
      }
      if (!artist?.trim()) {
        throw new AppError('Artist name is required', 400, 'MISSING_ARTIST');
      }

      let localPath: string | undefined;
      let audioFileSize: number | undefined;

      const audioFile = req.files?.audio?.[0] as Express.Multer.File | undefined;
      if (audioFile) {
        const uploadResult = await uploadService.uploadFile(audioFile, 'audio', req.userId);
        localPath = uploadResult.filePath;
        audioFileSize = Number(uploadResult.fileSize);
      }

      let coverUrl: string | undefined;
      const coverFile = req.files?.cover?.[0] as Express.Multer.File | undefined;
      if (coverFile) {
        const uploadResult = await uploadService.uploadFile(coverFile, 'images', req.userId);
        coverUrl = uploadResult.url;
      }

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

export default router;
