import { Router, Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureUniqueCourseSlug(baseValue: string, excludeId?: number): Promise<string> {
  const baseSlug = slugify(baseValue) || `course-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.course.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return candidate;
    candidate = `${baseSlug}-${suffix++}`;
  }
}

function toNullableString(value: unknown): string | null {
  if (value == null) return null;
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function toOptionalNumber(value: unknown): number | undefined {
  if (value == null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toOptionalDate(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    throw new AppError('Invalid date value', 400);
  }
  return parsed;
}

function normalizeCourseStatus(status?: unknown): string {
  const normalized = String(status || 'DRAFT').toUpperCase();
  return normalized || 'DRAFT';
}

function normalizeLessonType(lessonType?: unknown): string {
  const normalized = String(lessonType || 'VIDEO').toUpperCase();
  return normalized || 'VIDEO';
}

function normalizeVideoPlatform(videoPlatform?: unknown): string {
  const normalized = String(videoPlatform || 'EMBED').toUpperCase();
  return normalized || 'EMBED';
}

function normalizePublishedAt(status: string, currentPublishedAt?: Date | null): Date | null {
  if (status === 'PUBLISHED') {
    return currentPublishedAt ?? new Date();
  }
  return null;
}

async function syncCourseStats(courseId: number) {
  const sections = await prisma.courseSection.findMany({
    where: { courseId },
    include: { lessons: true },
  });

  const totalLessons = sections.reduce((sum, section) => sum + section.lessons.length, 0);
  const totalDurationSeconds = sections.reduce(
    (sum, section) => sum + section.lessons.reduce((lessonSum, lesson) => lessonSum + lesson.videoDurationSeconds, 0),
    0,
  );

  await prisma.course.update({
    where: { id: courseId },
    data: {
      totalLessons,
      totalDurationSeconds,
    },
  });
}

async function serializeCourse(
  courseId: number,
  options?: { includeDraftLessons?: boolean; userId?: number }
) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      category: true,
      instructor: { select: { id: true, username: true, avatarUrl: true, bio: true } },
      semester: true,
      tags: true,
      sections: {
        include: {
          lessons: {
            where: options?.includeDraftLessons ? undefined : { isPublished: true },
            include: {
              details: true,
              documents: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
              assignments: {
                orderBy: { sortOrder: 'asc' },
                include: options?.userId
                  ? {
                      submissions: {
                        where: { userId: options.userId },
                        take: 1,
                        orderBy: { submittedAt: 'desc' },
                      },
                    }
                  : undefined,
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
      reviews: { where: { isApproved: true }, take: 10, orderBy: { createdAt: 'desc' } },
      _count: { select: { enrollments: true, reviews: true } },
    },
  });

  if (!course) throw new AppError('Course not found', 404);

  const enrollment = options?.userId
    ? await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: options.userId, courseId } },
        include: { lessonProgress: true },
      })
    : null;

  const totalPublishedLessons = course.sections.reduce(
    (sum, section) => sum + section.lessons.length,
    0,
  );
  const completedLessons = enrollment?.lessonProgress?.filter((item) => item.isCompleted).length ?? 0;
  const enrollmentProgress = totalPublishedLessons > 0
    ? Math.round((completedLessons / totalPublishedLessons) * 100)
    : 0;

  return {
    id: course.id,
    title: course.title,
    courseCode: course.courseCode,
    slug: course.slug,
    shortDescription: course.shortDescription,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    previewVideoUrl: course.previewVideoUrl,
    price: Number(course.price),
    discountPrice: course.discountPrice ? Number(course.discountPrice) : undefined,
    discountExpiresAt: course.discountExpiresAt,
    level: course.level,
    language: course.language,
    academyType: course.academyType,
    isFree: course.isFree,
    isFeatured: course.isFeatured,
    isPublished: course.isPublished,
    publishedAt: course.publishedAt,
    totalDurationSeconds: course.totalDurationSeconds,
    totalLessons: course.totalLessons,
    totalStudents: course.totalStudents,
    totalReviews: course.totalReviews,
    avgRating: Number(course.avgRating),
    requirements: course.requirements,
    whatYouLearn: course.whatYouLearn,
    status: course.status,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    categoryId: course.categoryId,
    categoryName: course.category?.name,
    categorySlug: course.category?.slug,
    instructorId: course.instructorId,
    instructorName: course.instructor?.username,
    instructorAvatar: course.instructor?.avatarUrl,
    semesterId: course.semesterId,
    semesterName: course.semester?.name,
    semesterCode: course.semester?.code,
    semesterOrdinal: course.semester?.ordinal,
    tags: course.tags.map((courseTag) => courseTag.tag),
    sections: course.sections.map((section) => ({
      id: section.id,
      courseId: section.courseId,
      title: section.title,
      description: section.description,
      sortOrder: section.sortOrder,
      isLocked: section.isLocked,
      lessonCount: section.lessons.length,
      totalDurationSeconds: section.lessons.reduce((sum, lesson) => sum + lesson.videoDurationSeconds, 0),
      createdAt: section.createdAt,
      updatedAt: section.updatedAt,
      lessons: section.lessons.map((lesson) => ({
        id: lesson.id,
        sectionId: lesson.sectionId,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        content: lesson.content,
        lessonType: lesson.lessonType,
        videoUrl: lesson.videoUrl,
        videoPlatform: lesson.details?.videoPlatform ?? 'EMBED',
        sourceCodeUrl: lesson.details?.sourceCodeUrl,
        teachingNotes: lesson.details?.teachingNotes,
        videoDurationSeconds: lesson.videoDurationSeconds,
        thumbnailUrl: lesson.thumbnailUrl,
        isFreePreview: lesson.isFreePreview,
        isPublished: lesson.isPublished,
        sortOrder: lesson.sortOrder,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        details: lesson.details,
        documents: lesson.documents.map((document) => ({
          ...document,
          fileSizeBytes: Number(document.fileSizeBytes),
        })),
        assignments: lesson.assignments.map((assignment) => ({
          ...assignment,
          mySubmission: ('submissions' in assignment ? (assignment as typeof assignment & { submissions?: Array<unknown> }).submissions?.[0] : null) || null,
          submissions: undefined,
        })),
      })),
    })),
    reviews: course.reviews,
    isEnrolled: Boolean(enrollment),
    enrollmentProgress,
    enrollmentCount: course._count.enrollments,
    reviewCount: course._count.reviews,
  };
}

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
        select: { id: true },
      }),
      prisma.course.count({ where }),
    ]);

    const serializedCourses = await Promise.all(
      courses.map((course) => serializeCourse(course.id, req.userId ? { userId: req.userId } : undefined))
    );

    res.json({ success: true, data: serializedCourses, pagination: { page: Number(page), limit: Number(size), total, totalPages: Math.ceil(total / Number(size)) } });
  } catch (error) { next(error); }
});

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

router.get('/my', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.userId, status: 'ACTIVE' },
      include: {
        course: {
          include: {
            semester: true,
            sections: {
              include: { lessons: { where: { isPublished: true } } },
            },
          },
        },
        lessonProgress: true,
        certificate: true,
      },
      orderBy: { enrolledAt: 'desc' },
    });

    const serializedEnrollments = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
      const completedLessons = enrollment.lessonProgress.filter((item) => item.isCompleted).length;
      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      const lastProgress = [...enrollment.lessonProgress]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
      const lastLesson = lastProgress
        ? enrollment.course.sections.flatMap((section) => section.lessons).find((lesson) => lesson.id === lastProgress.lessonId)
        : null;

      return {
        id: enrollment.id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        courseTitle: enrollment.course.title,
        courseSlug: enrollment.course.slug,
        courseThumbnail: enrollment.course.thumbnailUrl,
        courseCode: enrollment.course.courseCode,
        semesterName: enrollment.course.semester?.name,
        enrolledAt: enrollment.enrolledAt,
        expiresAt: enrollment.expiresAt,
        status: progressPercent >= 100 ? 'COMPLETED' : progressPercent > 0 ? 'IN_PROGRESS' : enrollment.status,
        progressPercent,
        lastLessonId: lastLesson?.id,
        lastLessonTitle: lastLesson?.title,
        lastAccessedAt: lastProgress?.updatedAt,
        certificateId: enrollment.certificate?.id,
        certificateNumber: enrollment.certificate?.certificateNumber,
      };
    });

    res.json({ success: true, data: serializedEnrollments });
  } catch (error) { next(error); }
});

router.get('/admin/all', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { page = 0, size = 10, keyword, status, categoryId } = req.query;
    const pageNumber = Math.max(0, Number(page));
    const pageSize = Math.min(50, Math.max(1, Number(size)));
    const skip = pageNumber * pageSize;

    const where: Record<string, unknown> = {
      ...(keyword ? {
        OR: [
          { title: { contains: String(keyword), mode: 'insensitive' } },
          { shortDescription: { contains: String(keyword), mode: 'insensitive' } },
          { slug: { contains: String(keyword), mode: 'insensitive' } },
        ],
      } : {}),
      ...(status ? { status: String(status) } : {}),
      ...(categoryId ? { categoryId: Number(categoryId) } : {}),
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      }),
      prisma.course.count({ where }),
    ]);

    const serializedCourses = await Promise.all(courses.map((course) => serializeCourse(course.id, { includeDraftLessons: true })));

    res.json({
      success: true,
      data: serializedCourses,
      pagination: { page: pageNumber, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) { next(error); }
});

router.get('/admin/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const serializedCourse = await serializeCourse(courseId, { includeDraftLessons: true });
    res.json({ success: true, data: serializedCourse });
  } catch (error) { next(error); }
});

router.get('/semester/:semesterId', async (req, res: Response<ApiResponse>, next) => {
  try {
    const semesterId = parseInt(req.params.semesterId, 10);
    const courses = await prisma.course.findMany({
      where: {
        semesterId,
        status: 'PUBLISHED',
      },
      orderBy: [
        { courseCode: 'asc' },
        { createdAt: 'asc' },
      ],
      select: { id: true },
    });

    const serialized = await Promise.all(courses.map((course) => serializeCourse(course.id, req.userId ? { userId: req.userId } : undefined)));
    res.json({ success: true, data: serialized });
  } catch (error) { next(error); }
});

router.post('/', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const title = String(req.body.title || '').trim();
    if (!title) throw new AppError('Title is required', 400);

    const status = normalizeCourseStatus(req.body.status);
    const slug = await ensureUniqueCourseSlug(title);
    const publishedAt = normalizePublishedAt(status, null);

    const created = await prisma.course.create({
      data: {
        title,
        slug,
        shortDescription: toNullableString(req.body.shortDescription),
        description: toNullableString(req.body.description),
        thumbnailUrl: toNullableString(req.body.thumbnailUrl),
        previewVideoUrl: toNullableString(req.body.previewVideoUrl),
        categoryId: toOptionalNumber(req.body.categoryId),
        instructorId: toOptionalNumber(req.body.instructorId) ?? req.userId!,
        semesterId: toOptionalNumber(req.body.semesterId),
        courseCode: toNullableString(req.body.courseCode),
        academyType: toNullableString(req.body.academyType) ?? 'FPT',
        price: req.body.price != null ? Number(req.body.price) : 0,
        discountPrice: req.body.discountPrice != null && req.body.discountPrice !== '' ? Number(req.body.discountPrice) : null,
        discountExpiresAt: toOptionalDate(req.body.discountExpiresAt) ?? null,
        level: toNullableString(req.body.level) ?? 'BEGINNER',
        language: toNullableString(req.body.language) ?? 'Vietnamese',
        isFree: Boolean(req.body.isFree),
        isFeatured: Boolean(req.body.isFeatured),
        isPublished: status === 'PUBLISHED',
        requirements: toNullableString(req.body.requirements),
        whatYouLearn: toNullableString(req.body.whatYouLearn),
        status,
        publishedAt,
      },
      select: { id: true },
    });

    const serialized = await serializeCourse(created.id, { includeDraftLessons: true });
    res.status(201).json({ success: true, data: serialized });
  } catch (error) { next(error); }
});

router.put('/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) throw new AppError('Course not found', 404);

    const nextTitle = req.body.title ? String(req.body.title).trim() : existing.title;
    const nextSlug = nextTitle !== existing.title
      ? await ensureUniqueCourseSlug(nextTitle, id)
      : existing.slug;
    const status = req.body.status ? normalizeCourseStatus(req.body.status) : existing.status;
    const publishedAt = normalizePublishedAt(status, existing.publishedAt);

    await prisma.course.update({
      where: { id },
      data: {
        ...(req.body.title !== undefined ? { title: nextTitle, slug: nextSlug } : {}),
        ...(req.body.shortDescription !== undefined ? { shortDescription: toNullableString(req.body.shortDescription) } : {}),
        ...(req.body.description !== undefined ? { description: toNullableString(req.body.description) } : {}),
        ...(req.body.thumbnailUrl !== undefined ? { thumbnailUrl: toNullableString(req.body.thumbnailUrl) } : {}),
        ...(req.body.previewVideoUrl !== undefined ? { previewVideoUrl: toNullableString(req.body.previewVideoUrl) } : {}),
        ...(req.body.categoryId !== undefined ? { categoryId: toOptionalNumber(req.body.categoryId) ?? null } : {}),
        ...(req.body.instructorId !== undefined ? { instructorId: toOptionalNumber(req.body.instructorId) ?? null } : {}),
        ...(req.body.semesterId !== undefined ? { semesterId: toOptionalNumber(req.body.semesterId) ?? null } : {}),
        ...(req.body.courseCode !== undefined ? { courseCode: toNullableString(req.body.courseCode) } : {}),
        ...(req.body.academyType !== undefined ? { academyType: toNullableString(req.body.academyType) ?? 'FPT' } : {}),
        ...(req.body.price !== undefined ? { price: Number(req.body.price) } : {}),
        ...(req.body.discountPrice !== undefined ? { discountPrice: req.body.discountPrice === '' || req.body.discountPrice == null ? null : Number(req.body.discountPrice) } : {}),
        ...(req.body.discountExpiresAt !== undefined ? { discountExpiresAt: toOptionalDate(req.body.discountExpiresAt) ?? null } : {}),
        ...(req.body.level !== undefined ? { level: toNullableString(req.body.level) ?? 'BEGINNER' } : {}),
        ...(req.body.language !== undefined ? { language: toNullableString(req.body.language) ?? 'Vietnamese' } : {}),
        ...(req.body.isFree !== undefined ? { isFree: Boolean(req.body.isFree) } : {}),
        ...(req.body.isFeatured !== undefined ? { isFeatured: Boolean(req.body.isFeatured) } : {}),
        ...(req.body.requirements !== undefined ? { requirements: toNullableString(req.body.requirements) } : {}),
        ...(req.body.whatYouLearn !== undefined ? { whatYouLearn: toNullableString(req.body.whatYouLearn) } : {}),
        ...(req.body.status !== undefined ? { status, isPublished: status === 'PUBLISHED', publishedAt } : {}),
      },
    });

    const serialized = await serializeCourse(id, { includeDraftLessons: true });
    res.json({ success: true, data: serialized });
  } catch (error) { next(error); }
});

router.delete('/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.course.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (error) { next(error); }
});

router.post('/sections', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const courseId = Number(req.body.courseId);
    const title = String(req.body.title || '').trim();
    if (!courseId || !title) throw new AppError('courseId and title are required', 400);

    const created = await prisma.courseSection.create({
      data: {
        courseId,
        title,
        description: toNullableString(req.body.description),
        sortOrder: toOptionalNumber(req.body.sortOrder) ?? 0,
        isLocked: Boolean(req.body.isLocked),
      },
    });

    const serialized = await prisma.courseSection.findUnique({
      where: { id: created.id },
      include: { lessons: { orderBy: { sortOrder: 'asc' } } },
    });
    res.status(201).json({ success: true, data: serialized });
  } catch (error) { next(error); }
});

router.put('/sections/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await prisma.courseSection.update({
      where: { id },
      data: {
        ...(req.body.courseId !== undefined ? { courseId: Number(req.body.courseId) } : {}),
        ...(req.body.title !== undefined ? { title: String(req.body.title).trim() } : {}),
        ...(req.body.description !== undefined ? { description: toNullableString(req.body.description) } : {}),
        ...(req.body.sortOrder !== undefined ? { sortOrder: Number(req.body.sortOrder) } : {}),
        ...(req.body.isLocked !== undefined ? { isLocked: Boolean(req.body.isLocked) } : {}),
      },
      include: { lessons: { orderBy: { sortOrder: 'asc' } } },
    });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});

router.delete('/sections/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.courseSection.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (error) { next(error); }
});

router.post('/lessons', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const sectionId = Number(req.body.sectionId);
    const title = String(req.body.title || '').trim();
    if (!sectionId || !title) throw new AppError('sectionId and title are required', 400);

    const baseSlug = toNullableString(req.body.slug) || slugify(title) || `lesson-${Date.now()}`;
    const created = await prisma.lesson.create({
      data: {
        sectionId,
        title,
        slug: baseSlug,
        description: toNullableString(req.body.description),
        content: toNullableString(req.body.content),
        lessonType: normalizeLessonType(req.body.lessonType),
        videoUrl: toNullableString(req.body.videoUrl),
        videoDurationSeconds: toOptionalNumber(req.body.videoDurationSeconds) ?? 0,
        thumbnailUrl: toNullableString(req.body.thumbnailUrl),
        isFreePreview: Boolean(req.body.isFreePreview),
        isPublished: Boolean(req.body.isPublished),
        sortOrder: toOptionalNumber(req.body.sortOrder) ?? 0,
        details: {
          create: {
            videoPlatform: normalizeVideoPlatform(req.body.videoPlatform),
            videoUrl: toNullableString(req.body.videoUrl),
            sourceCodeUrl: toNullableString(req.body.sourceCodeUrl),
            teachingNotes: toNullableString(req.body.teachingNotes),
          },
        },
      },
      include: {
        details: true,
        documents: true,
        assignments: { orderBy: { sortOrder: 'asc' } },
      },
    });

    const courseId = (await prisma.courseSection.findUnique({ where: { id: sectionId }, select: { courseId: true } }))?.courseId;
    if (courseId) await syncCourseStats(courseId);

    res.status(201).json({ success: true, data: {
      ...created,
      videoPlatform: created.details?.videoPlatform ?? 'EMBED',
      sourceCodeUrl: created.details?.sourceCodeUrl,
      teachingNotes: created.details?.teachingNotes,
    } });
  } catch (error) { next(error); }
});

router.put('/lessons/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.lesson.findUnique({ where: { id }, include: { section: true } });
    if (!existing) throw new AppError('Lesson not found', 404);

    const nextTitle = req.body.title !== undefined ? String(req.body.title).trim() : existing.title;
    const nextSlug = req.body.slug !== undefined
      ? (toNullableString(req.body.slug) || slugify(nextTitle) || existing.slug)
      : existing.slug;

    const updated = await prisma.lesson.update({
      where: { id },
      data: {
        ...(req.body.sectionId !== undefined ? { sectionId: Number(req.body.sectionId) } : {}),
        ...(req.body.title !== undefined ? { title: nextTitle } : {}),
        ...(req.body.slug !== undefined ? { slug: nextSlug } : {}),
        ...(req.body.description !== undefined ? { description: toNullableString(req.body.description) } : {}),
        ...(req.body.content !== undefined ? { content: toNullableString(req.body.content) } : {}),
        ...(req.body.lessonType !== undefined ? { lessonType: normalizeLessonType(req.body.lessonType) } : {}),
        ...(req.body.videoUrl !== undefined ? { videoUrl: toNullableString(req.body.videoUrl) } : {}),
        ...(req.body.videoDurationSeconds !== undefined ? { videoDurationSeconds: Number(req.body.videoDurationSeconds) } : {}),
        ...(req.body.thumbnailUrl !== undefined ? { thumbnailUrl: toNullableString(req.body.thumbnailUrl) } : {}),
        ...(req.body.isFreePreview !== undefined ? { isFreePreview: Boolean(req.body.isFreePreview) } : {}),
        ...(req.body.isPublished !== undefined ? { isPublished: Boolean(req.body.isPublished) } : {}),
        ...(req.body.sortOrder !== undefined ? { sortOrder: Number(req.body.sortOrder) } : {}),
      },
      include: {
        details: true,
        documents: true,
        assignments: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (
      req.body.videoPlatform !== undefined ||
      req.body.videoUrl !== undefined ||
      req.body.sourceCodeUrl !== undefined ||
      req.body.teachingNotes !== undefined
    ) {
      await prisma.lessonDetail.upsert({
        where: { lessonId: id },
        create: {
          lessonId: id,
          videoPlatform: normalizeVideoPlatform(req.body.videoPlatform),
          videoUrl: toNullableString(req.body.videoUrl),
          sourceCodeUrl: toNullableString(req.body.sourceCodeUrl),
          teachingNotes: toNullableString(req.body.teachingNotes),
        },
        update: {
          ...(req.body.videoPlatform !== undefined ? { videoPlatform: normalizeVideoPlatform(req.body.videoPlatform) } : {}),
          ...(req.body.videoUrl !== undefined ? { videoUrl: toNullableString(req.body.videoUrl) } : {}),
          ...(req.body.sourceCodeUrl !== undefined ? { sourceCodeUrl: toNullableString(req.body.sourceCodeUrl) } : {}),
          ...(req.body.teachingNotes !== undefined ? { teachingNotes: toNullableString(req.body.teachingNotes) } : {}),
        },
      });
    }

    const courseId = (await prisma.courseSection.findUnique({ where: { id: updated.sectionId }, select: { courseId: true } }))?.courseId;
    if (courseId) await syncCourseStats(courseId);

    const refreshed = await prisma.lesson.findUnique({
      where: { id },
      include: {
        details: true,
        documents: { where: { isActive: true } },
        assignments: { orderBy: { sortOrder: 'asc' } },
      },
    });

    res.json({ success: true, data: {
      ...refreshed,
      videoPlatform: refreshed?.details?.videoPlatform ?? 'EMBED',
      sourceCodeUrl: refreshed?.details?.sourceCodeUrl,
      teachingNotes: refreshed?.details?.teachingNotes,
    } });
  } catch (error) { next(error); }
});

router.delete('/lessons/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const lesson = await prisma.lesson.findUnique({ where: { id }, select: { sectionId: true } });
    await prisma.lesson.delete({ where: { id } });
    if (lesson?.sectionId) {
      const courseId = (await prisma.courseSection.findUnique({ where: { id: lesson.sectionId }, select: { courseId: true } }))?.courseId;
      if (courseId) await syncCourseStats(courseId);
    }
    res.json({ success: true, data: { id } });
  } catch (error) { next(error); }
});

router.put('/lessons/:lessonId/detail', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const lessonId = parseInt(req.params.lessonId, 10);
    const detail = await prisma.lessonDetail.upsert({
      where: { lessonId },
      create: {
        lessonId,
        videoPlatform: normalizeVideoPlatform(req.body.videoPlatform),
        videoUrl: toNullableString(req.body.videoUrl),
        sourceCodeUrl: toNullableString(req.body.sourceCodeUrl),
        teachingNotes: toNullableString(req.body.teachingNotes),
      },
      update: {
        ...(req.body.videoPlatform !== undefined ? { videoPlatform: normalizeVideoPlatform(req.body.videoPlatform) } : {}),
        ...(req.body.videoUrl !== undefined ? { videoUrl: toNullableString(req.body.videoUrl) } : {}),
        ...(req.body.sourceCodeUrl !== undefined ? { sourceCodeUrl: toNullableString(req.body.sourceCodeUrl) } : {}),
        ...(req.body.teachingNotes !== undefined ? { teachingNotes: toNullableString(req.body.teachingNotes) } : {}),
      },
    });
    res.json({ success: true, data: detail });
  } catch (error) { next(error); }
});

router.get('/:courseId/lessons/:lessonId', async (req, res: Response<ApiResponse>, next) => {
  try {
    const courseId = parseInt(req.params.courseId, 10);
    const lessonId = parseInt(req.params.lessonId, 10);

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        section: { courseId },
      },
      include: {
        details: true,
        documents: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
        assignments: {
          orderBy: { sortOrder: 'asc' },
          include: req.userId
            ? {
                submissions: {
                  where: { userId: req.userId },
                  take: 1,
                  orderBy: { submittedAt: 'desc' },
                },
              }
            : undefined,
        },
      },
    });

    if (!lesson) throw new AppError('Lesson not found', 404);

    res.json({ success: true, data: {
      ...lesson,
      videoPlatform: lesson.details?.videoPlatform ?? 'EMBED',
      sourceCodeUrl: lesson.details?.sourceCodeUrl,
      teachingNotes: lesson.details?.teachingNotes,
      documents: lesson.documents.map((document) => ({
        ...document,
        fileSizeBytes: Number(document.fileSizeBytes),
      })),
      assignments: lesson.assignments.map((assignment) => ({
        ...assignment,
        mySubmission: ('submissions' in assignment ? (assignment as typeof assignment & { submissions?: Array<unknown> }).submissions?.[0] : null) || null,
        submissions: undefined,
      })),
    } });
  } catch (error) { next(error); }
});

router.get('/lessons/:lessonId/assignments', async (req, res: Response<ApiResponse>, next) => {
  try {
    const lessonId = parseInt(req.params.lessonId, 10);
    const assignments = await prisma.assignment.findMany({
      where: { lessonId },
      orderBy: { sortOrder: 'asc' },
      include: req.userId
        ? {
            submissions: {
              where: { userId: req.userId },
              take: 1,
              orderBy: { submittedAt: 'desc' },
            },
          }
        : undefined,
    });

    res.json({ success: true, data: assignments.map((assignment) => ({
      ...assignment,
      mySubmission: ('submissions' in assignment ? (assignment as typeof assignment & { submissions?: Array<unknown> }).submissions?.[0] : null) || null,
      submissions: undefined,
    })) });
  } catch (error) { next(error); }
});

router.post('/assignments', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const lessonId = Number(req.body.lessonId);
    const title = String(req.body.title || '').trim();
    if (!lessonId || !title) throw new AppError('lessonId and title are required', 400);

    const created = await prisma.assignment.create({
      data: {
        lessonId,
        title,
        instructions: toNullableString(req.body.instructions),
        deadline: toOptionalDate(req.body.deadline) ?? null,
        sortOrder: toOptionalNumber(req.body.sortOrder) ?? 0,
        isPublished: req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : true,
        maxScore: req.body.maxScore != null ? Number(req.body.maxScore) : 10,
      },
    });
    res.status(201).json({ success: true, data: created });
  } catch (error) { next(error); }
});

router.put('/assignments/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        ...(req.body.lessonId !== undefined ? { lessonId: Number(req.body.lessonId) } : {}),
        ...(req.body.title !== undefined ? { title: String(req.body.title).trim() } : {}),
        ...(req.body.instructions !== undefined ? { instructions: toNullableString(req.body.instructions) } : {}),
        ...(req.body.deadline !== undefined ? { deadline: toOptionalDate(req.body.deadline) ?? null } : {}),
        ...(req.body.sortOrder !== undefined ? { sortOrder: Number(req.body.sortOrder) } : {}),
        ...(req.body.isPublished !== undefined ? { isPublished: Boolean(req.body.isPublished) } : {}),
        ...(req.body.maxScore !== undefined ? { maxScore: Number(req.body.maxScore) } : {}),
      },
    });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});

router.delete('/assignments/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.assignment.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (error) { next(error); }
});

router.post('/assignments/submit', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const assignmentId = Number(req.body.assignmentId);
    const submissionUrl = String(req.body.submissionUrl || '').trim();
    if (!assignmentId || !submissionUrl) throw new AppError('assignmentId and submissionUrl are required', 400);

    const saved = await prisma.assignmentSubmission.upsert({
      where: { assignmentId_userId: { assignmentId, userId: req.userId! } },
      create: {
        assignmentId,
        userId: req.userId!,
        submissionUrl,
        notes: toNullableString(req.body.notes),
        status: 'SUBMITTED',
      },
      update: {
        submissionUrl,
        notes: toNullableString(req.body.notes),
        status: 'SUBMITTED',
      },
    });

    res.json({ success: true, data: saved });
  } catch (error) { next(error); }
});

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
    const serializedCourse = await serializeCourse(course.id, req.userId ? { userId: req.userId } : undefined);
    res.json({ success: true, data: serializedCourse });
  } catch (error) { next(error); }
});

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

router.get('/:id/progress', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.userId!, courseId: parseInt(req.params.id) } },
      include: { lessonProgress: true },
    });
    res.json({ success: true, data: enrollment?.lessonProgress || [] });
  } catch (error) { next(error); }
});

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
        completedAt: isCompleted ? new Date() : null,
        watchTimeSeconds: watchTimeSeconds || 0,
        lastPositionSeconds: lastPositionSeconds || 0,
      },
      update: {
        ...(isCompleted !== undefined && { isCompleted, completedAt: isCompleted ? new Date() : null }),
        ...(watchTimeSeconds !== undefined && { watchTimeSeconds }),
        ...(lastPositionSeconds !== undefined && { lastPositionSeconds }),
      },
    });

    const courseLessons = await prisma.lesson.count({
      where: { section: { courseId } },
    });
    const completedCount = await prisma.lessonProgress.count({
      where: {
        enrollmentId: enrollment.id,
        isCompleted: true,
      },
    });

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progressPercent: courseLessons > 0 ? (completedCount / courseLessons) * 100 : 0,
        lastLessonId: lessonId,
        lastAccessedAt: new Date(),
        status: completedCount >= courseLessons && courseLessons > 0 ? 'COMPLETED' : 'ACTIVE',
      },
    });

    res.json({ success: true, data: progress });
  } catch (error) { next(error); }
});

export default router;
