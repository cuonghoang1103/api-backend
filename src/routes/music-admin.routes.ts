/**
 * POST /api/v1/music/admin/upload
 * Alias route for music track upload.
 * Reuses the same logic as POST /api/v1/music/tracks via musicRoutes.
 */
import { Router, type Response } from 'express';
import multer from 'multer';

import { musicService } from '../services/music.service.js';
import { uploadAudio, uploadImage, UploadError } from '../storage/uploadService.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file: Express.Multer.File, cb) => {
    if (file.fieldname === 'audio') {
      const allowed = ['audio/mpeg','audio/mp3','audio/wav','audio/ogg','audio/flac','audio/aac','audio/mp4','audio/x-m4a','audio/opus','video/mp4'];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Unsupported audio format: ${file.mimetype}`));
      }
    } else if (file.fieldname === 'cover') {
      const allowed = ['image/jpeg','image/png','image/gif','image/webp'];
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

router.post(
  '/',
  authenticate,
  uploadMiddleware.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const { title, artist, durationSeconds } = req.body;

      if (!title?.trim()) {
        throw new AppError('Track title is required', 400, 'MISSING_TITLE');
      }
      if (!artist?.trim()) {
        throw new AppError('Artist name is required', 400, 'MISSING_ARTIST');
      }

      let audioKey: string | undefined;
      let audioFileSize: number | undefined;

      const audioFile = req.files?.audio?.[0] as Express.Multer.File | undefined;
      if (audioFile) {
        const res2 = await uploadAudio(
          {
            buffer: audioFile.buffer,
            originalName: audioFile.originalname,
            mimetype: audioFile.mimetype,
            size: audioFile.size,
          },
          { userId: req.userId, kind: 'songs' },
        );
        audioKey = res2.key;
        audioFileSize = res2.size;
      }

      let coverUrl: string | undefined;
      const coverFile = req.files?.cover?.[0] as Express.Multer.File | undefined;
      if (coverFile) {
        const res2 = await uploadImage(
          {
            buffer: coverFile.buffer,
            originalName: coverFile.originalname,
            mimetype: coverFile.mimetype,
            size: coverFile.size,
          },
          'images/playlist-covers',
          { userId: req.userId },
        );
        coverUrl = res2.url;
      }

      const track = await musicService.createTrack({
        title: title.trim(),
        artist: artist.trim(),
        localPath: audioKey,
        coverImage: coverUrl,
        durationSeconds: durationSeconds
          ? parseInt(durationSeconds as string, 10)
          : undefined,
        fileSize: audioFileSize,
        // NORMAL (default) or REMIX — matches the main /tracks upload route.
        category: req.body.category as string | undefined,
      });

      // Serialize BigInt fields for JSON response
      const serialized = track as Record<string, unknown>;
      if (serialized.id !== undefined) serialized.id = Number(serialized.id);
      if (serialized.fileSize !== undefined) serialized.fileSize = Number(serialized.fileSize);
      if (serialized.durationSeconds !== undefined) serialized.durationSeconds = Number(serialized.durationSeconds);
      if (serialized.playCount !== undefined) serialized.playCount = Number(serialized.playCount);
      if (serialized.uploadedBy !== undefined) serialized.uploadedBy = Number(serialized.uploadedBy);

      res.status(201).json({
        success: true,
        data: serialized,
        message: 'Track created successfully',
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
