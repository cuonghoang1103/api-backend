import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/contact ───────────────────────────────
router.post('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) throw new AppError('Name, email and message are required', 400);

    const submission = await prisma.contactSubmission.create({
      data: { name, email, subject, message },
    });

    res.status(201).json({ success: true, data: submission });
  } catch (error) { next(error); }
});

export default router;
