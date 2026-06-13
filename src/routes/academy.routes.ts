import { Router, Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

router.get('/semesters', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const semesters = await prisma.semester.findMany({
      where: { isActive: true },
      orderBy: [{ ordinal: 'asc' }, { id: 'asc' }],
    });
    res.json({ success: true, data: semesters });
  } catch (error) {
    next(error);
  }
});

router.post('/semesters', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const code = String(req.body.code || '').trim();
    const ordinal = Number(req.body.ordinal ?? 0);
    if (!name || !code) throw new AppError('name and code are required', 400);

    // Reject early with a friendly 409 instead of a Prisma P2002
    // stack trace, so the admin can fix the form (or pick a different
    // code) without having to dig into the server log.
    const duplicate = await prisma.semester.findFirst({ where: { code } });
    if (duplicate) {
      throw new AppError(`Mã kỳ học "${code}" đã tồn tại (đang dùng cho "${duplicate.name}"). Vui lòng chọn mã khác.`, 409);
    }

    const created = await prisma.semester.create({
      data: {
        name,
        code,
        ordinal,
        description: req.body.description ? String(req.body.description) : null,
        isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
      },
    });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

router.put('/semesters/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    // If the admin is changing the code, make sure it doesn't collide
    // with another semester. The Prisma `@@unique` constraint on
    // `code` would otherwise throw P2002 ("Unique constraint failed")
    // and the user would see a raw 500 in the toast. Translating it
    // to a 409 with a Vietnamese message here turns a confusing
    // stack trace into actionable feedback.
    if (req.body.code !== undefined) {
      const nextCode = String(req.body.code).trim();
      if (nextCode) {
        const duplicate = await prisma.semester.findFirst({
          where: { code: nextCode, NOT: { id } },
        });
        if (duplicate) {
          throw new AppError(
            `Mã kỳ học "${nextCode}" đã tồn tại (đang dùng cho "${duplicate.name}"). Vui lòng chọn mã khác.`,
            409
          );
        }
      }
    }

    const updated = await prisma.semester.update({
      where: { id },
      data: {
        ...(req.body.name !== undefined ? { name: String(req.body.name).trim() } : {}),
        ...(req.body.code !== undefined ? { code: String(req.body.code).trim() } : {}),
        ...(req.body.ordinal !== undefined ? { ordinal: Number(req.body.ordinal) } : {}),
        ...(req.body.description !== undefined ? { description: req.body.description ? String(req.body.description) : null } : {}),
        ...(req.body.isActive !== undefined ? { isActive: Boolean(req.body.isActive) } : {}),
      },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    // Last-resort translation: Prisma P2002 → friendly 409 in case a
    // race condition slips through (two admins editing at the same
    // time, etc.).
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002') {
      next(new AppError('Mã kỳ học đã tồn tại. Vui lòng chọn mã khác.', 409));
      return;
    }
    next(error);
  }
});

router.delete('/semesters/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.semester.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
});

router.get('/courses/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        semester: true,
        sections: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
              include: {
                details: true,
                documents: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
                assignments: { orderBy: { sortOrder: 'asc' } },
              },
            },
          },
        },
      },
    });

    if (!course) throw new AppError('Course not found', 404);

    res.json({
      success: true,
      data: {
        ...course,
        sections: course.sections.map((section) => ({
          ...section,
          lessons: section.lessons.map((lesson) => ({
            ...lesson,
            videoPlatform: lesson.details?.videoPlatform ?? 'EMBED',
            sourceCodeUrl: lesson.details?.sourceCodeUrl,
            teachingNotes: lesson.details?.teachingNotes,
            documents: lesson.documents.map((document) => ({
              ...document,
              fileSizeBytes: Number(document.fileSizeBytes),
            })),
          })),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/assignments/:assignmentId/submissions', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId, 10);
    const submissions = await prisma.assignmentSubmission.findMany({
      where: { assignmentId },
      orderBy: [{ submittedAt: 'desc' }],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
    res.json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
});

router.post('/assignments/grade', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const submissionId = Number(req.body.submissionId);
    if (!submissionId) throw new AppError('submissionId is required', 400);

    const existingSubmission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      select: { id: true },
    });

    if (!existingSubmission) {
      throw new AppError('Submission not found', 404);
    }

    if (req.body.grade !== undefined && (Number.isNaN(Number(req.body.grade)) || !Number.isFinite(Number(req.body.grade)))) {
      throw new AppError('grade must be a valid number', 400);
    }

    const updated = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        ...(req.body.grade !== undefined ? { grade: Number(req.body.grade) } : {}),
        ...(req.body.feedback !== undefined ? { feedback: req.body.feedback ? String(req.body.feedback) : null } : {}),
        ...(req.body.status !== undefined ? { status: String(req.body.status) } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
