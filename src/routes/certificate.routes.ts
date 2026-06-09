import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/certificates/my ──────────────────────
router.get('/my', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.userId },
      include: {
        course: { select: { id: true, title: true, thumbnailUrl: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });
    res.json({ success: true, data: certificates });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/certificates/verify/:number ──────────
router.get('/verify/:number', async (req, res: Response<ApiResponse>, next) => {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { certificateNumber: req.params.number },
      include: {
        course: { select: { id: true, title: true } },
        user: { select: { fullName: true, username: true } },
      },
    });

    if (!cert) {
      throw new AppError('Certificate not found', 404);
    }

    res.json({
      success: true,
      data: {
        certificateNumber: cert.certificateNumber,
        issuedAt: cert.issuedAt,
        courseTitle: cert.course.title,
        userName: cert.user.fullName || cert.user.username,
      },
    });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/certificates/enrollment/:id ───────────
router.get('/enrollment/:id', optionalAuth, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { enrollmentId: parseInt(req.params.id, 10) },
      include: {
        course: { select: { id: true, title: true, thumbnailUrl: true } },
      },
    });

    if (!cert) {
      throw new AppError('Certificate not found for this enrollment', 404);
    }

    res.json({ success: true, data: cert });
  } catch (error) { next(error); }
});

export default router;
