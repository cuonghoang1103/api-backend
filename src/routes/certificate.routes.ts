import { Router, type Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { saveUserCode } from './savedCodes.routes.js';
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

// ─── GET /api/v1/certificates/course/:courseId ─────────
// The signed-in user's certificate for a specific course (or 404).
// Used by the learn page to show the completion banner + redeem CTA.
router.get('/course/:courseId', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const courseId = parseInt(req.params.courseId, 10);
    if (isNaN(courseId)) throw new AppError('Invalid course ID', 400);
    const cert = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId: req.userId, courseId } },
      include: { course: { select: { id: true, title: true, thumbnailUrl: true } } },
    });
    if (!cert) throw new AppError('Certificate not found for this course', 404);
    res.json({ success: true, data: cert });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/certificates/:id/redeem ──────────────
// Redeem a completion certificate for a one-time 10% discount code the
// student can apply to their NEXT course purchase. Idempotent: the code
// is deterministic per certificate (CERT10-<id>), so calling twice
// returns the same code instead of minting a second one.
router.post('/:id/redeem', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new AppError('Invalid certificate ID', 400);

    const cert = await prisma.certificate.findUnique({ where: { id } });
    if (!cert) throw new AppError('Certificate not found', 404);
    if (cert.userId !== req.userId) throw new AppError('Không có quyền với chứng chỉ này', 403);

    const code = `CERT10-${cert.id}`;

    // Already redeemed? Hand back the existing code (idempotent).
    const existing = await prisma.discountCode.findUnique({ where: { code } });
    if (existing) {
      res.json({
        success: true,
        data: { code: existing.code, discountValue: Number(existing.discountValue), expiresAt: existing.expiresAt, alreadyRedeemed: true },
      });
      return;
    }

    // 90-day validity, single use, scoped to this user only.
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const created = await prisma.discountCode.create({
      data: {
        code,
        userId: req.userId,
        discountType: 'PERCENT',
        discountValue: 10,
        maxUses: 1,
        usedCount: 0,
        active: true,
        expiresAt,
        description: `Ưu đãi hoàn thành khoá học (chứng chỉ ${cert.certificateNumber})`,
      },
    });

    // Auto-save into the user's "My Code" wallet so they can find it later.
    await saveUserCode(req.userId, {
      label: 'Ưu đãi hoàn thành khoá học (giảm 10%)',
      code: created.code,
      codeType: 'DISCOUNT',
      note: 'Áp dụng cho khoá học tiếp theo · dùng 1 lần',
      expiresAt: created.expiresAt,
      source: 'AUTO',
    });

    res.status(201).json({
      success: true,
      data: { code: created.code, discountValue: 10, expiresAt: created.expiresAt, alreadyRedeemed: false },
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
