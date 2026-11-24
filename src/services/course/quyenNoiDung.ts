/**
 * LUẬT XEM NỘI DUNG KHOÁ HỌC (paywall) — tách nguyên văn từ routes/course.routes.ts ngày 24/11/2026 để công cụ đọc học liệu
 * `hoc_lieu` (CuongMini) dùng ĐÚNG luật của web: một chỗ duy nhất, sửa một lần là cả web lẫn AI cùng đổi.
 * Thứ tự: khoá "Sắp ra mắt" ⇒ chưa xuất bản ⇒ FREE ⇒ admin/giảng viên ⇒ Pro ⇒ khách (preview) ⇒ ghi danh ACTIVE (+ CODE).
 * Quyết định "xem trọn một bài" (cần thêm đơn đã trả tiền) nằm ở `xemTronBai` bên dưới, cùng công thức `showFull` của route bài học.
 */
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { chanSapRaMat, laSapRaMat } from '../khoaSapRaMat.js';

export type AccessMode = 'enrolled' | 'preview' | 'admin-or-enrolled';

export async function laAdminNguoiDung(userId: number): Promise<boolean> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { roles: { select: { role: { select: { name: true } } } } },
  });
  return (u?.roles ?? []).some((ur) => /^(role_)?(admin|superadmin)$/i.test(ur.role.name));
}

export async function assertCanAccessCourseContent(
  userId: number | null | undefined,
  courseId: number,
  mode: AccessMode = 'enrolled',
): Promise<{ isAdmin: boolean; isEnrolled: boolean; isFree: boolean; hasCodeEnrollment: boolean }> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, isFree: true, price: true, isPublished: true, instructorId: true, accessType: true, status: true },
  });
  if (!course) throw new AppError('Course not found', 404);
  // Khoá "Sắp ra mắt": chỉ admin / giảng viên của khoá được vào nội dung (để soạn). Người khác — kể cả Pro, kể cả khoá
  // FREE — nhận 409 COURSE_COMING_SOON. Đặt TRƯỚC nhánh khoá FREE bên dưới, vì nhánh đó trả "được đọc" ngay.
  if (laSapRaMat(course)) {
    const laNguoiSoan = Boolean(userId) && (course.instructorId === userId || await laAdminNguoiDung(userId!));
    if (!laNguoiSoan) chanSapRaMat(course);
  }
  if (course.isPublished !== true) {
    // Only admins or the instructor can see draft content. Public
    // endpoints should never expose unpublished material.
    if (!userId) throw new AppError('Course not available', 404);
  }

  // Free courses need no enrollment — but a LOGGED-IN user is still
  // required to see full content. Anonymous visitors fall through to the
  // 'preview' path below (isFreePreview lessons only, + a frontend
  // "đăng nhập để xem thêm" notice). `isFree` is the explicit flag;
  // `price <= 0` is a legacy fallback.
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
  if (isFree && !isCodeCourse && mode !== 'admin-or-enrolled' && userId) {
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
        isPro: true,
        proExpiresAt: true,
        roles: {
          select: { role: { select: { name: true } } },
        },
      },
    });
    const roleNames = user?.roles?.map((ur) => ur.role.name) || [];
    const isAdmin = roleNames.some((n) => /^(role_)?(admin|superadmin)$/i.test(n));
    if (isAdmin || course.instructorId === userId) {
      return { isAdmin: true, isEnrolled: true, isFree, hasCodeEnrollment: false };
    }
    // Pro members get full Academy access — no code, no enrollment needed.
    if (user?.isPro && (!user.proExpiresAt || user.proExpiresAt > new Date())) {
      return { isAdmin: false, isEnrolled: true, isFree, hasCodeEnrollment: true };
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

/**
 * Người này có được đọc TRỌN một bài (nội dung, video, quiz) không — cùng công thức `showFull` của
 * GET /courses/:courseId/lessons/:lessonId. Không ném lỗi: trả false khi bị chặn (khoá nháp, chưa ghi danh…).
 */
export async function xemTronBai(userId: number, courseId: number, isFreePreview: boolean): Promise<boolean> {
  if (isFreePreview) return true;
  let a: Awaited<ReturnType<typeof assertCanAccessCourseContent>>;
  try { a = await assertCanAccessCourseContent(userId, courseId, 'preview'); } catch { return false; }
  if (a.isAdmin || a.isFree || a.hasCodeEnrollment) return true;
  if (!a.isEnrolled) return false;
  const da = await prisma.courseOrder.findFirst({ where: { userId, courseId, status: { in: ['PAID', 'COMPLETED'] } }, select: { id: true } });
  return Boolean(da);
}
