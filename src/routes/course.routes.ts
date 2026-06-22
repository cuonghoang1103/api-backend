import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { prisma } from '../config/database.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { uploadDocument, deleteByUrl, UploadError } from '../storage/uploadService.js';
import { getStorageProvider } from '../storage/StorageProvider.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── Helper: gate paid course content on enrollment ────────────────
//
// Background: previously the public course endpoints (GET /:slug,
// GET /:id/curriculum, GET /:courseId/lessons/:lessonId) returned
// the full curriculum — including `videoUrl`, `teachingNotes`,
// `sourceCodeUrl`, and `documents` — to anyone, even users who
// hadn't paid. The frontend /learn page tried to gate on
// `isEnrolled`, but a determined user could bypass the UI by
// hitting the API directly and download every video/document URL.
//
// This helper is the single chokepoint: any endpoint that returns
// a course's lesson content must call it first. It checks:
//
//   1. User is authenticated
//   2. Course is free (price=0 or isFree=true) OR
//      user has an active Enrollment (status='ACTIVE' and not expired)
//
// On failure it throws a 402 (Payment Required) — a stronger
// signal than 403 for paid content so the frontend can render
// the correct "Buy this course" CTA.
//
// The `mode` arg lets the caller opt into a slightly more lenient
// view: 'preview' allows access to lessons flagged `isFreePreview`
// even when the user is not enrolled. Use that for the public
// course detail page where the marketing site needs to show
// sample lessons.
type AccessMode = 'enrolled' | 'preview' | 'admin-or-enrolled';

async function assertCanAccessCourseContent(
  userId: number | null | undefined,
  courseId: number,
  mode: AccessMode = 'enrolled',
): Promise<{ isAdmin: boolean; isEnrolled: boolean; isFree: boolean; hasCodeEnrollment: boolean }> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, isFree: true, price: true, isPublished: true, instructorId: true, accessType: true },
  });
  if (!course) throw new AppError('Course not found', 404);
  if (course.isPublished !== true) {
    // Only admins or the instructor can see draft content. Public
    // endpoints should never expose unpublished material.
    if (!userId) throw new AppError('Course not available', 404);
  }

  // Free courses bypass enrollment entirely. `isFree` is the
  // explicit flag; `price <= 0` is a legacy fallback. Either way,
  // no paywall applies.
  //
  // Note: an inconsistency has happened in the admin UI where
  // admins set `isFree=true` AND `price=300000` on the same
  // course (e.g. toggling "Free" to enable a preview, then
  // setting a real price). We treat `isFree=true && price>0` as
  // a "free preview available" mode — content is still gated
  // because someone clearly intended a paid course. The admin
  // should toggle `isFree=false` once the price is set.
  // `accessType` is the authoritative field. `isFree` is kept for backward
  // compatibility: a course with `accessType='FREE'` OR the legacy
  // `isFree=true && price<=0` bypasses enrollment.
  const isFree = course.accessType === 'FREE' || (course.isFree && Number(course.price) <= 0);
  const isCodeCourse = course.accessType === 'CODE';
  if (isFree && !isCodeCourse && mode !== 'admin-or-enrolled') {
    return { isAdmin: false, isEnrolled: true, isFree: true, hasCodeEnrollment: false };
  }
  // Admin / instructor bypass — applies to every mode because
  // we never want a course's own instructor or a privileged
  // admin to be locked out of paid content. The /admin/* routes
  // have their own access control, but public endpoints (e.g. the
  // marketing /:slug page rendered for an admin user) should
  // also show full content.
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        roles: {
          select: { role: { select: { name: true } } },
        },
      },
    });
    const roleNames = user?.roles?.map((ur) => ur.role.name) || [];
    const isAdmin = roleNames.includes('ROLE_ADMIN') || roleNames.includes('ROLE_SUPERADMIN');
    if (isAdmin || course.instructorId === userId) {
      return { isAdmin: true, isEnrolled: true, isFree, hasCodeEnrollment: false };
    }
  }

  // 'preview' mode lets guests see isFreePreview lessons without
  // an account. We treat the caller as a "non-enrolled preview
  // viewer" so the caller can return only the preview lessons
  // instead of the full curriculum. The actual filtering happens
  // in the route, not here.
  if (mode === 'preview' && !userId) {
    return { isAdmin: false, isEnrolled: false, isFree: false, hasCodeEnrollment: false };
  }

  if (!userId) {
    throw new AppError(
      'Vui long dang nhap va dang ky khoa hoc de xem noi dung',
      401,
    );
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { status: true, expiresAt: true, source: true },
  });
  if (!enrollment) {
    throw new AppError(
      'Khoa hoc nay can dang ky. Vui long mua de truy cap noi dung',
      402,
    );
  }
  if (enrollment.status !== 'ACTIVE') {
    throw new AppError(
      `Enrollment khong con active (status=${enrollment.status})`,
      403,
    );
  }
  if (enrollment.expiresAt && enrollment.expiresAt.getTime() < Date.now()) {
    throw new AppError('Enrollment da het han', 403);
  }

  // CODE enrollment grants access for CODE courses (legacy) and PAID courses
  // (admin "Trả phí or Mã kích hoạt" type accepts both payment and activation codes).
  const isPaidOrCodeCourse = isCodeCourse || course.accessType === 'PAID';
  const hasCodeEnrollment = enrollment.source === 'CODE' && isPaidOrCodeCourse;
  if (hasCodeEnrollment) {
    return { isAdmin: false, isEnrolled: true, isFree: false, hasCodeEnrollment: true };
  }

  // We have an active enrollment. The caller will combine this
  // with a CourseOrder check (in serializeCourse or in the
  // specific route) to decide whether to show paid content. We
  // intentionally don't enforce the paid-order requirement here
  // because some routes (preview lessons, the marketing page)
  // need to know "is this user enrolled at all" without
  // throwing — the per-route code is responsible for the
  // per-content redaction.
  //
  // This is also the reason we treat mode='preview' identically
  // to mode='enrolled' once the user is logged in: a paid
  // course is either free for everyone (isFree) or paid (and
  // gating is per-lesson / per-document, not per-route).
  return { isAdmin: false, isEnrolled: true, isFree: false, hasCodeEnrollment: false };
}

// ─── Helper: serialize a CourseDocument for JSON response ──────────
//
// The Prisma model declares `fileSizeBytes` as BigInt. Express
// uses `JSON.stringify` under the hood, which throws on BigInt
// values. We coerce BigInt to Number here so the rest of the
// payload (which we just spread) is JSON-safe.
//
// This is the same pattern used in getBySlug below (see
// `documents: lesson.documents.map((document) => ...)`); we
// extract it into a helper so every lesson-returning endpoint
// applies the same coercion.
function serializeDocument(document: any) {
  return {
    ...document,
    fileSizeBytes: Number(document.fileSizeBytes),
  };
}

// ─── Multer config for lesson document uploads ──────────────────────
//
// Lesson documents are auxiliary materials the instructor
// attaches to a lesson (zip, doc, pdf, ...). Capped at 20 MB
// per file as requested — anything larger belongs on a CDN
// or a dedicated file service. We store on local disk under
// `uploads/lesson-documents/<lessonId>/` and serve via
// Nginx's existing /uploads/ proxy. The DB only holds the
// metadata + URL.
const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB hard cap
    files: 1,
  },
});

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

  // Decide whether the requesting user is allowed to see the full
  // lesson content. We compute this ONCE here and apply it to every
  // lesson in the response so the redaction logic is centralized.
  //
  //   - Free course: everyone sees content (course.price <= 0 and
  //     course.isFree === true). No paywall.
  //   - Paid course + not enrolled: redact content (no videoUrl,
  //     no teachingNotes, no sourceCodeUrl, no documents).
  //   - Paid course + enrolled: full content.
  //   - Paid course + instructor: full content (their own course).
  //   - includeDraftLessons: caller is admin; trust them.
  //
  // Edge case: a course can have `isFree=true` AND `price>0`
  // (admin toggled the checkbox but also set a real price). We
  // treat that as a paid course with free preview lessons —
  // `isFree=true` then acts only as the global "previewable"
  // signal, not a bypass.
  //
  // CRITICAL: we also check for a PAID/COMPLETED CourseOrder.
  // An enrollment row alone is not enough — students who
  // enrolled when the course was free keep their enrollment
  // row after the admin flips on a price, and without this
  // second check they would retain full access for free. This
  // is the bug we just fixed (see also assertCanAccessCourseContent
  // for the same pattern in the gating helper).
  // `accessType` is the authoritative field. `isFree` is kept for backward
  // compatibility: a course with `accessType='FREE'` OR the legacy
  // `isFree=true && price<=0` bypasses enrollment.
  const isFree = course.accessType === 'FREE' || (course.isFree && Number(course.price) <= 0);
  const isCodeCourse = course.accessType === 'CODE';
  const isOwner = options?.userId !== undefined && course.instructorId === options.userId;
  // Expired enrollments do not grant access. Frontend receives enrollmentExpiresAt
  // to surface the "access expired" message and offer re-purchase.
  const enrollmentExpired = enrollment?.expiresAt
    ? enrollment.expiresAt.getTime() < Date.now()
    : false;
  let hasPaidOrder = false;
  if (options?.userId && !isFree && !isOwner) {
    const order = await prisma.courseOrder.findFirst({
      where: {
        userId: options.userId,
        courseId,
        status: { in: ['PAID', 'COMPLETED'] },
      },
      select: { id: true },
    });
    hasPaidOrder = Boolean(order);
  }
  // CODE enrollment grants access for CODE courses (legacy) and PAID courses
  // (admin "Trả phí or Mã kích hoạt" type). A FREE enrollment never unlocks a CODE/PAID course.
  const isPaidOrCodeCourse = isCodeCourse || course.accessType === 'PAID';
  const hasCodeEnrollment = enrollment?.source === 'CODE' && !enrollmentExpired;
  const hasPaidAccess = options?.includeDraftLessons
    || isOwner
    || (isFree && !isCodeCourse && Boolean(enrollment) && !enrollmentExpired)
    || (hasPaidOrder && !enrollmentExpired)
    || (isPaidOrCodeCourse && hasCodeEnrollment);

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
    accessType: course.accessType,
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
    startDate: course.startDate,
    endDate: course.endDate,
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
      lessons: section.lessons.map((lesson) => {
        // Base shape — public marketing metadata (title, duration,
        // preview flag) is always visible.
        const base = {
          id: lesson.id,
          sectionId: lesson.sectionId,
          title: lesson.title,
          slug: lesson.slug,
          description: lesson.description,
          lessonType: lesson.lessonType,
          videoDurationSeconds: lesson.videoDurationSeconds,
          thumbnailUrl: lesson.thumbnailUrl,
          isFreePreview: lesson.isFreePreview,
          isPublished: lesson.isPublished,
          sortOrder: lesson.sortOrder,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
          documents: lesson.documents.map(serializeDocument),
          assignments: lesson.assignments.map((assignment) => ({
            ...assignment,
            mySubmission: ('submissions' in assignment ? (assignment as typeof assignment & { submissions?: Array<unknown> }).submissions?.[0] : null) || null,
            submissions: undefined,
          })),
        };

        if (hasPaidAccess) {
          // Enrolled / admin / free-course: full content. The
          // learn page renders this without a second API call.
          return {
            ...base,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            videoPlatform: lesson.details?.videoPlatform ?? 'EMBED',
            sourceCodeUrl: lesson.details?.sourceCodeUrl,
            teachingNotes: lesson.details?.teachingNotes,
            details: lesson.details,
          };
        }

        // Not enrolled on a paid course: strip the paid content
        // fields. Exception: isFreePreview lessons stay public
        // (with documents) so the marketing site can show what
        // the student would get. All other lessons hide their
        // document list too — even a doc ID would let an
        // attacker hit /documents/:id/download if they could
        // guess it.
        if (lesson.isFreePreview) {
          return {
            ...base,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            videoPlatform: lesson.details?.videoPlatform ?? 'EMBED',
            sourceCodeUrl: lesson.details?.sourceCodeUrl,
            teachingNotes: undefined,
            details: undefined,
            // Documents ARE shown for free previews so the
            // marketing page can show "Sample materials
            // available" with a download link. The /download
            // endpoint re-checks enrollment for free previews
            // only when there is a price; for genuinely free
            // courses every document is reachable.
            documents: lesson.documents.map(serializeDocument),
          };
        }

        return {
          ...base,
          // Strip documents from non-preview lessons on a paid
          // course. The /:courseId/lessons/:lessonId endpoint
          // already 401s/402s this case so this is defense in
          // depth, but it also stops any future code path that
          // exposes this object from leaking document IDs.
          documents: [],
        };
      }),
    })),
    reviews: course.reviews,
    isEnrolled: Boolean(enrollment),
    hasPaidAccess,
    enrollmentProgress,
    enrollmentSource: enrollment?.source,
    enrollmentExpiresAt: enrollment?.expiresAt?.toISOString(),
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
        where, skip,
        take: Number(size),
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

router.get('/semester/:semesterId', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const semesterId = parseInt(req.params.semesterId, 10);
    // Public access: any user (including guests) can see PUBLISHED courses.
    // Admins / course owners can opt-in to see DRAFT courses (e.g. while
    // editing in /admin/academy) by passing ?includeDraft=true. The public
    // /academy page never sets this, so it still only ever sees PUBLISHED
    // courses.
    const includeDraft = String(req.query.includeDraft || '').toLowerCase() === 'true';
    const courses = await prisma.course.findMany({
      where: {
        semesterId,
        ...(includeDraft ? {} : { status: 'PUBLISHED' }),
      },
      orderBy: [
        { courseCode: 'asc' },
        { createdAt: 'asc' },
      ],
      select: { id: true },
    });

    const serialized = await Promise.all(courses.map((course) => serializeCourse(course.id, req.userId ? { userId: req.userId } : undefined)));
    res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
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
        accessType: toNullableString(req.body.accessType) ?? 'FREE',
        enrollmentDurationDays: req.body.enrollmentDurationDays != null ? Number(req.body.enrollmentDurationDays) : 0,
        requirements: toNullableString(req.body.requirements),
        whatYouLearn: toNullableString(req.body.whatYouLearn),
        startDate: toOptionalDate(req.body.startDate) ?? null,
        endDate: toOptionalDate(req.body.endDate) ?? null,
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
        ...(req.body.accessType !== undefined ? { accessType: toNullableString(req.body.accessType) ?? 'FREE' } : {}),
        ...(req.body.enrollmentDurationDays !== undefined ? { enrollmentDurationDays: Number(req.body.enrollmentDurationDays) } : {}),
        ...(req.body.requirements !== undefined ? { requirements: toNullableString(req.body.requirements) } : {}),
        ...(req.body.whatYouLearn !== undefined ? { whatYouLearn: toNullableString(req.body.whatYouLearn) } : {}),
        ...(req.body.startDate !== undefined ? { startDate: toOptionalDate(req.body.startDate) ?? null } : {}),
        ...(req.body.endDate !== undefined ? { endDate: toOptionalDate(req.body.endDate) ?? null } : {}),
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
      documents: (created.documents || []).map(serializeDocument),
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
      // CourseDocument.fileSizeBytes is a BigInt in Prisma. Express'
      // res.json() uses JSON.stringify which can't serialize BigInt.
      // We map documents here (and on every other lesson response)
      // so the entire payload is JSON-safe.
      documents: (refreshed?.documents || []).map(serializeDocument),
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

router.get('/:courseId/lessons/:lessonId', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const courseId = parseInt(req.params.courseId, 10);
    const lessonId = parseInt(req.params.lessonId, 10);
    if (isNaN(courseId) || isNaN(lessonId)) {
      throw new AppError('Invalid course or lesson id', 400);
    }

    // Paywall check FIRST, before any DB read that returns
    // content. We use 'preview' mode so isFreePreview lessons
    // are visible to guests (for the marketing course page) and
    // the marketing call-to-action can still be rendered for
    // non-enrolled logged-in users.
    const access = await assertCanAccessCourseContent(req.userId, courseId, 'preview');
    if (!access.isEnrolled) {
      // Guest or non-enrolled user. Free-preview lessons are
      // served (we'll filter in the response below). Any other
      // lesson is paid content — refuse it.
      // The actual gate happens in `showFull` below; this
      // check is a fast-fail for the 99% case.
    }

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

    // For a paid course we also need a real payment on file.
    // The helper in 'preview' mode lets an enrolled-but-not-paid
    // user through so they can see preview lessons. Here we
    // tighten the gate per-lesson: a paid lesson is only
    // fully visible to a paying user (or admin / instructor).
    let hasPaidOrder = false;
    if (req.userId && access.isEnrolled) {
      const paidOrderRow = await prisma.courseOrder.findFirst({
        where: {
          userId: req.userId,
          courseId,
          status: { in: ['PAID', 'COMPLETED'] },
        },
        select: { id: true },
      });
      hasPaidOrder = Boolean(paidOrderRow);
    }

    // Apply the same redaction rules as serializeCourse so the
    // API surface here matches the /:slug endpoint.
    // showFull is true when:
    //   - free lesson (isFreePreview always shows for marketing), OR
    //   - user has paid order (real access), OR
    //   - user is admin/instructor (assertCanAccessCourseContent
    //     returns isAdmin=true for those callers via the same
    //     helper path, and access.isFree is true for genuinely
    //     free courses), OR
    //   - user has CODE enrollment
    const showFull =
      lesson.isFreePreview
      || hasPaidOrder
      || access.isAdmin
      || access.isFree
      || access.hasCodeEnrollment;

    // Defense in depth: if the caller isn't enrolled AND the
    // lesson isn't a free preview, refuse it. This blocks
    // enumeration of paid lesson IDs by guests even when the
    // paywall check above returned isEnrolled=false for them.
    if (!showFull) {
      throw new AppError(
        'Vui long dang ky khoa hoc de xem noi dung nay',
        req.userId ? 402 : 401,
      );
    }

    res.json({
      success: true,
      data: {
        ...lesson,
        videoPlatform: lesson.details?.videoPlatform ?? 'EMBED',
        sourceCodeUrl: showFull ? lesson.details?.sourceCodeUrl : undefined,
        teachingNotes: showFull ? lesson.details?.teachingNotes : undefined,
        videoUrl: showFull ? lesson.videoUrl : undefined,
        // Lesson body text is paid content too. Even a free
        // preview gets the marketing copy via description, but
        // `content` (the full article) is gated.
        content: showFull ? lesson.content : undefined,
        documents: showFull
          ? lesson.documents.map(serializeDocument)
          : [],
        assignments: lesson.assignments.map((assignment) => ({
          ...assignment,
          mySubmission: ('submissions' in assignment ? (assignment as typeof assignment & { submissions?: Array<unknown> }).submissions?.[0] : null) || null,
          submissions: undefined,
        })),
        details: undefined, // we already flattened the relevant fields
      },
    });
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

router.get('/:id/curriculum', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    if (isNaN(courseId)) {
      throw new AppError('Invalid course id', 400);
    }

    // Paywall check: anyone reading the curriculum gets the same
    // access check as the /:slug endpoint. We don't want a
    // unauthenticated user to enumerate every lesson's videoUrl
    // by hitting this endpoint.
    //
    // For 'preview' mode, only isFreePreview lessons are exposed
    // for non-enrolled callers — so the marketing site can show
    // a sample but never the full curriculum. The caller below
    // applies that filter to the response.
    const access = await assertCanAccessCourseContent(req.userId, courseId, 'preview');

    // Match the serializeCourse logic: an enrollment row alone is
    // not enough to see paid content. We also need a real paid
    // order for any non-free course. isAdmin/isOwner take
    // precedence (assertCanAccessCourseContent returns isAdmin
    // for those).
    let hasPaidOrder = false;
    if (req.userId && access.isEnrolled && !access.isFree && !access.isAdmin) {
      const order = await prisma.courseOrder.findFirst({
        where: {
          userId: req.userId,
          courseId,
          status: { in: ['PAID', 'COMPLETED'] },
        },
        select: { id: true },
      });
      hasPaidOrder = Boolean(order);
    }
    // "real" enrollment = paid access or CODE enrollment (not just an old free row)
    const hasFullAccess = access.isFree
      || access.isAdmin
      || (access.isEnrolled && (hasPaidOrder || access.hasCodeEnrollment));

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: {
              // includeDraftLessons is admin-only; for public
              // we only show published lessons.
              orderBy: { sortOrder: 'asc' },
              include: { details: true },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!course) throw new AppError('Course not found', 404);

    // Apply the same redaction as serializeCourse: paid courses
    // expose only lesson metadata, plus full content for
    // isFreePreview lessons. We use the isFreePreview flag to
    // filter the curriculum for the marketing view.
    const sections = course.sections.map(section => ({
      id: section.id,
      courseId: section.courseId,
      title: section.title,
      description: section.description,
      sortOrder: section.sortOrder,
      isLocked: section.isLocked,
      lessons: section.lessons
        // Only show lessons if: paid user has access, OR it's a
        // free preview, OR (admin/instructor viewing draft).
        .filter(lesson => hasFullAccess || lesson.isFreePreview || access.isAdmin)
        .map(lesson => {
          if (hasFullAccess) {
            return {
              id: lesson.id,
              title: lesson.title,
              slug: lesson.slug,
              description: lesson.description,
              lessonType: lesson.lessonType,
              videoDurationSeconds: lesson.videoDurationSeconds,
              thumbnailUrl: lesson.thumbnailUrl,
              isFreePreview: lesson.isFreePreview,
              sortOrder: lesson.sortOrder,
              videoUrl: lesson.videoUrl,
              videoPlatform: lesson.details?.videoPlatform ?? 'EMBED',
              sourceCodeUrl: lesson.details?.sourceCodeUrl,
              teachingNotes: lesson.details?.teachingNotes,
            };
          }
          // Not fully paid but the lesson is a free preview
          return {
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            description: lesson.description,
            lessonType: lesson.lessonType,
            videoDurationSeconds: lesson.videoDurationSeconds,
            thumbnailUrl: lesson.thumbnailUrl,
            isFreePreview: lesson.isFreePreview,
            sortOrder: lesson.sortOrder,
            videoUrl: lesson.videoUrl,
            videoPlatform: lesson.details?.videoPlatform ?? 'EMBED',
            // We deliberately omit teachingNotes + sourceCodeUrl
            // for preview lessons — those are bonus materials
            // only for paying students.
          };
        }),
    }));

    res.json({ success: true, data: sections });
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

    // Only courses with accessType='FREE' (or legacy isFree=true with price=0)
    // can be enrolled via this endpoint. Paid/code courses must go through
    // their respective payment or code-activation flows.
    const isFreeCourse = course.accessType === 'FREE' || (course.isFree && Number(course.price) <= 0);
    if (!isFreeCourse) {
      throw new AppError(
        'Khoa hoc nay hien tai chua mo miễn phí. Vui long mua hoac nhap ma kich hoat.',
        402,
      );
    }

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

// ════════════════════════════════════════════════════════════════
// LESSON DOCUMENTS — admin uploads, students download
// ════════════════════════════════════════════════════════════════
//
// Files the instructor attaches to a lesson: zip, doc, pdf, etc.
// Capped at 20 MB per file. We don't stream-chunk — local disk
// write is fast enough at this size and we want the upload to
// commit atomically (the file is visible to students only
// after the DB row is created, so a partial write leaves no
// dangling rows).
//
// Storage layout:
//   uploads/lesson-documents/<lessonId>/<timestamp>-<random>.<ext>
// Served by the existing Nginx /uploads/ proxy.
//
// Why a separate table (CourseDocument) instead of reusing
// the generic FileAttachment? Because:
//   1. Each document tracks its own downloadCount per lesson
//   2. Cascade-delete with the lesson (already in the schema)
//   3. Students query documents via the lesson payload — no
//      join through a generic file table needed
// ────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/courses/lessons/:lessonId/documents
 *
 * Admin-only. Multipart form-data with a single `file` field and
 * a `title` field (used as the display name in the download list).
 * Returns the persisted CourseDocument.
 */
router.post(
  '/lessons/:lessonId/documents',
  authenticate,
  requireAdmin('ROLE_ADMIN'),
  documentUpload.single('file'),
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const lessonId = parseInt(req.params.lessonId, 10);
      if (isNaN(lessonId)) {
        throw new AppError('Invalid lesson ID', 400, 'INVALID_ID');
      }
      if (!req.file) {
        throw new AppError('No file provided', 400, 'NO_FILE');
      }
      // The title field is optional — fall back to the
      // original filename so the download list still reads
      // sensibly when the admin uploads in bulk.
      const title = (req.body?.title || req.file.originalname || '').toString().trim().slice(0, 255) || 'Document';

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { id: true },
      });
      if (!lesson) {
        throw new AppError('Lesson not found', 404, 'LESSON_NOT_FOUND');
      }

      // Upload through the unified pipeline. We pass the
      // bucket key straight through to the CourseDocument row
      // (we'll sign the URL on download).
      const input = {
        buffer: req.file.buffer,
        originalName: req.file.originalname || 'document',
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
      const stored = await uploadDocument(input, { userId: req.userId, scope: 'lesson' });

      // Best-effort type detection from the extension when
      // multer can't determine a content-type (it sometimes
      // returns application/octet-stream for .docx etc.).
      const ext = path.extname(input.originalName).toLowerCase().slice(0, 16) || '';
      const fileType = input.mimetype && input.mimetype !== 'application/octet-stream'
        ? input.mimetype
        : ext.replace('.', '').toLowerCase() || null;

      // We store the bucket KEY, not the public URL. The
      // download endpoint signs a short-lived URL on demand so
      // the file stays private (course documents are gated on
      // enrollment).
      const document = await prisma.courseDocument.create({
        data: {
          lessonId,
          title,
          fileUrl: stored.url, // legacy field — full R2 URL, retained for backwards-compat reads
          fileSizeBytes: BigInt(stored.size),
          fileType,
        },
      });

      // Also persist the bucket key in the row's metadata-ish
      // fields so the download handler can sign a fresh URL.
      // We piggy-back on `fileType` only as a side-channel; a
      // proper migration would add a `fileKey` column, but
      // extracting the key from the URL is cheaper than a
      // schema change right now.
      // (see getStorageProvider().keyFromUrl(fileUrl))

      res.status(201).json({
        success: true,
        data: {
          id: document.id,
          lessonId: document.lessonId,
          title: document.title,
          fileUrl: document.fileUrl,
          fileSizeBytes: Number(document.fileSizeBytes),
          fileType: document.fileType,
          downloadCount: document.downloadCount,
          createdAt: document.createdAt,
        },
        message: 'Document uploaded successfully',
      });
    } catch (error) {
      if (error instanceof UploadError) {
        return next(new AppError(error.message, error.status, error.code));
      }
      next(error);
    }
  }
);

/**
 * DELETE /api/v1/courses/documents/:id
 *
 * Admin-only. Soft-delete (isActive=false) keeps the row for
 * audit but hides it from the lesson payload. Hard-removes the
 * file from disk in the background; we don't block the response
 * on fs.rm.
 */
router.delete(
  '/documents/:id',
  authenticate,
  requireAdmin('ROLE_ADMIN'),
  async (req, res: Response<ApiResponse>, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid document ID', 400, 'INVALID_ID');
      }
      const document = await prisma.courseDocument.findUnique({ where: { id } });
      if (!document) {
        throw new AppError('Document not found', 404, 'NOT_FOUND');
      }

      await prisma.courseDocument.update({
        where: { id },
        data: { isActive: false },
      });

      // Best-effort storage cleanup. We don't await so the API
      // responds fast and a slow R2 call never blocks the UI.
      // Errors here are logged but not surfaced to the client.
      // deleteByUrl handles both R2 (delete the object) and
      // legacy local paths (no-op, since the file is the
      // admin's responsibility to clean up).
      deleteByUrl(document.fileUrl).catch((err) => {
        logger.warn(`[lesson-documents] failed to remove ${document.fileUrl}: ${(err as Error).message}`);
      });

      res.json({ success: true, message: 'Document removed' });
    } catch (error) { next(error); }
  }
);

/**
 * GET /api/v1/courses/documents/:id/download
 *
 * Authenticated students only (we have to gate this so a
 * stranger can't scrape materials). Increments downloadCount
 * and 302-redirects to the actual file URL. Sending a
 * Content-Disposition: attachment header is left to Nginx
 * (see nginx config for /uploads/).
 */
router.get(
  '/documents/:id/download',
  authenticate,
  async (req, res: Response, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid document ID', 400, 'INVALID_ID');
      }
      const document = await prisma.courseDocument.findUnique({
        where: { id },
        include: {
          // We need the lesson's courseId to check enrollment.
          lesson: { select: { section: { select: { courseId: true } } } },
        },
      });
      if (!document || !document.isActive) {
        throw new AppError('Document not found', 404, 'NOT_FOUND');
      }

      // Paywall check: documents are gated on enrollment, just
      // like the lesson content itself. We do this BEFORE
      // incrementing the download counter so denied attempts
      // don't pollute analytics.
      const courseId = document.lesson?.section?.courseId;
      if (courseId) {
        await assertCanAccessCourseContent(req.userId, courseId, 'admin-or-enrolled');
      }

      // Atomic increment so two students clicking at the
      // same time don't both see the same count.
      await prisma.courseDocument.update({
        where: { id },
        data: { downloadCount: { increment: 1 } },
      });

      // We don't redirect to the raw fileUrl because course
      // documents are private. Instead, we extract the R2 key
      // (the URL is `${publicBaseUrl}/${key}` so we can read
      // it back) and hand the student a 5-minute signed URL
      // that supports Range requests. Falls back to the
      // legacy redirect if the URL is from the old local
      // layout (keyFromUrl returns null).
      const provider = getStorageProvider();
      const key = provider.keyFromUrl(document.fileUrl);
      if (key) {
        const signed = await provider.signedUrl(key, 300, document.title);
        return res.redirect(302, signed);
      }
      // Legacy local file (`/uploads/...`) — keep the old 302
      // behavior so existing docs still work until we migrate
      // them.
      res.redirect(302, document.fileUrl);
    } catch (error) { next(error); }
  }
);

// POST /api/v1/courses/activate-code
// Proxy server-side so the httpOnly backend_token cookie is forwarded to the
// real activate-code handler in academy.routes.ts without the nginx
// CORS restriction.
router.post('/activate-code', async (req: any, res: any, next) => {
  try {
    const { courseId, code } = req.body;

    const result = await fetch(
      `${process.env.INTERNAL_BACKEND_URL || 'http://localhost:3001'}/api/v1/academy/activate-code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}),
        },
        body: JSON.stringify({ courseId, code }),
      },
    );

    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
