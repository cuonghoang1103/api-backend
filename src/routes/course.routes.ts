import { Router, Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/courses ────────────────────────────────
router.get('/', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 1, size = 12, keyword, category, level } = req.query;
    const skip = (Number(page) - 1) * Number(size);

    const where: Record<string, unknown> = { isPublished: true };
    if (keyword) where.OR = [
      { title: { contains: String(keyword), mode: 'insensitive' } },
      { shortDescription: { contains: String(keyword), mode: 'insensitive' } },
    ];
    if (category) where.category = { slug: String(category) };
    if (level) where.level = String(level);

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where, skip, take: Number(size),
        orderBy: { createdAt: 'desc' },
        include: { category: true, instructor: { select: { id: true, username: true, avatarUrl: true } } },
      }),
      prisma.course.count({ where }),
    ]);

    res.json({ success: true, data: courses, pagination: { page: Number(page), limit: Number(size), total, totalPages: Math.ceil(total / Number(size)) } });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/courses/featured ─────────────────────
router.get('/featured', async (req, res: Response<ApiResponse>, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const courses = await prisma.course.findMany({
      where: { isPublished: true, isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true, instructor: { select: { id: true, username: true, avatarUrl: true } } },
    });
    res.json({ success: true, data: courses });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/courses/my ───────────────────────────
router.get('/my', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.userId, status: 'ACTIVE' },
      include: { course: { include: { category: true } } },
      orderBy: { enrolledAt: 'desc' },
    });
    res.json({ success: true, data: enrollments });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/courses/:slug ─────────────────────────
router.get('/:slug', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        instructor: { select: { id: true, username: true, avatarUrl: true, bio: true } },
        sections: {
          include: { lessons: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' } } },
          orderBy: { sortOrder: 'asc' },
        },
        reviews: { where: { isApproved: true }, take: 10, orderBy: { createdAt: 'desc' } },
        _count: { select: { enrollments: true, reviews: true } },
      },
    });
    if (!course) throw new AppError('Course not found', 404);
    res.json({ success: true, data: course });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/courses/:id/curriculum ────────────────
router.get('/:id/curriculum', async (req, res: Response<ApiResponse>, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        sections: {
          include: { lessons: { include: { details: true }, orderBy: { sortOrder: 'asc' } } },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!course) throw new AppError('Course not found', 404);
    res.json({ success: true, data: course.sections });
  } catch (error) { next(error); }
});

// ─── GET /api/v1/courses/:id/progress ─────────────────
router.get('/:id/progress', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId: parseInt(req.params.id) } },
      include: { lessonProgress: true },
    });
    res.json({ success: true, data: enrollment });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/courses/:id/enroll ───────────────────
router.post('/:id/enroll', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new AppError('Course not found', 404);

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId } },
    });
    if (existing) throw new AppError('Already enrolled', 409);

    const enrollment = await prisma.enrollment.create({
      data: { userId: req.userId!, courseId },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { totalStudents: { increment: 1 } },
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) { next(error); }
});

// ─── POST /api/v1/courses/:id/progress ─────────────────
router.post('/:id/progress', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const courseId = parseInt(req.params.id);
    const { lessonId, isCompleted, watchTimeSeconds, lastPositionSeconds } = req.body;

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId } },
    });
    if (!enrollment) throw new AppError('Not enrolled in this course', 400);

    const progress = await prisma.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        isCompleted: isCompleted || false,
        watchTimeSeconds: watchTimeSeconds || 0,
        lastPositionSeconds: lastPositionSeconds || 0,
      },
      update: {
        ...(isCompleted !== undefined && { isCompleted }),
        ...(watchTimeSeconds !== undefined && { watchTimeSeconds }),
        ...(lastPositionSeconds !== undefined && { lastPositionSeconds }),
      },
    });

    res.json({ success: true, data: progress });
  } catch (error) { next(error); }
});

export default router;
