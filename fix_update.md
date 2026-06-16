# fix_update.md — Backlog Fixes & Improvements

> File note các bug, edge case, và feature cần fix. Làm theo thứ tự P0 → P1 → P2 → P3.
> Cập nhật: 2026-06-16

---

## Phần 1: Bug Paywall — Revenue Leak (P0 — Ưu tiên cao nhất)

> Tất cả 4 bug dưới đây đều có **cùng root cause**: trước đó tôi đã bỏ `paidOrder` check khỏi `assertCanAccessCourseContent` helper (src/routes/course.routes.ts) để support free preview lessons. Nhưng một số routes vẫn chỉ gọi helper mà không tự check `hasPaidOrder` → user có enrollment free-era vẫn xem được paid content.

### 1.1. `/api/v1/courses/documents/:id/download` — **File leak (NGHIÊM TRỌNG)**

- **Vị trí**: `src/routes/course.routes.ts:1622-1660`
- **Verify trên prod**: User 28 (enrollment ACTIVE, no paid order) → `GET /api/v1/courses/documents/2/download` (paid lesson #2) → **HTTP 302** → download được file `Rules.zip`.
- **Root cause**: Line 1648 chỉ gọi `assertCanAccessCourseContent(userId, courseId, 'admin-or-enrolled')`. Sau khi tôi sửa helper return `{isEnrolled: true}` cho user có enrollment (kể cả khi không có paid order) → route này pass → download được.
- **Fix**:
  ```ts
  // Thêm check hasPaidOrder riêng, tương tự như route /:courseId/lessons/:lessonId
  const access = await assertCanAccessCourseContent(req.userId, courseId, 'admin-or-enrolled');
  let hasPaidOrder = false;
  if (req.userId && access.isEnrolled && !access.isFree && !access.isAdmin) {
    const paidOrderRow = await prisma.courseOrder.findFirst({
      where: { userId: req.userId, courseId, status: { in: ['PAID', 'COMPLETED'] } },
      select: { id: true },
    });
    hasPaidOrder = Boolean(paidOrderRow);
  }
  if (!access.isFree && !access.isAdmin && !hasPaidOrder) {
    throw new AppError(
      'Vui long mua khoa hoc de tai tai lieu',
      req.userId ? 402 : 401,
    );
  }
  ```
- **Effort**: 30 phút

### 1.2. `/api/v1/courses/lessons/:lessonId/assignments` — **No auth (Public leak)**

- **Vị trí**: `src/routes/course.routes.ts:1125-1148`
- **Bug**: Route trả về assignments + `mySubmission` cho **bất kỳ ai** (kể cả guest chưa đăng nhập).
- **Side effect**:
  - Guest xem được đề bài paid course
  - Leak `submissionUrl` (link nộp bài) → có thể xem bài nộp của người khác
- **Fix**:
  ```ts
  // Thay vì async (req, ...) → optionalAuth, async (req, ...)
  router.get('/lessons/:lessonId/assignments', optionalAuth, async (req, res, next) => {
    // Validate lesson thuộc course hợp lệ
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, section: { courseId } },
      select: { id: true, section: { select: { courseId: true } } },
    });
    if (!lesson) throw new AppError('Lesson not found', 404);

    // Check paywall
    const access = await assertCanAccessCourseContent(req.userId, lesson.section.courseId, 'admin-or-enrolled');
    // ... thêm hasPaidOrder check tương tự 1.1

    // Existing query
  });
  ```
- **Effort**: 30 phút

### 1.3. `/api/v1/courses/assignments/submit` — **Submit không cần paid order**

- **Vị trí**: `src/routes/course.routes.ts:1198-1222`
- **Bug**: User có enrollment ACTIVE (free-era) vẫn submit assignment được. Lợi dụng: ăn điểm, lấy feedback miễn phí.
- **Fix**:
  ```ts
  // Validate assignment tồn tại, lấy courseId
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { id: true, lesson: { select: { section: { select: { courseId: true } } } } },
  });
  if (!assignment) throw new AppError('Assignment not found', 404);

  // Paywall check
  const access = await assertCanAccessCourseContent(req.userId, assignment.lesson.section.courseId, 'admin-or-enrolled');
  let hasPaidOrder = false;
  if (req.userId && access.isEnrolled && !access.isFree && !access.isAdmin) {
    const paidOrderRow = await prisma.courseOrder.findFirst({
      where: { userId: req.userId, courseId: assignment.lesson.section.courseId, status: { in: ['PAID', 'COMPLETED'] } },
      select: { id: true },
    });
    hasPaidOrder = Boolean(paidOrderRow);
  }
  if (!access.isFree && !access.isAdmin && !hasPaidOrder) {
    throw new AppError('Vui long mua khoa hoc de nop bai', 402);
  }
  ```
- **Effort**: 30 phút

### 1.4. `/api/v1/courses/:id/progress` (POST) — **Mark complete không cần paid order**

- **Vị trí**: `src/routes/course.routes.ts:1403-1452`
- **Bug**: User mark lesson complete mà không cần trả tiền → status enrollment = `COMPLETED` → **trigger auto-cert** (nếu implement). Revenue leak gián tiếp.
- **Fix**:
  ```ts
  // Đầu route, trước khi check enrollment
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { isFree: true, price: true },
  });
  if (!course) throw new AppError('Course not found', 404);
  const isFreeCourse = course.isFree && Number(course.price) <= 0;

  if (!isFreeCourse) {
    const access = await assertCanAccessCourseContent(req.userId, courseId, 'admin-or-enrolled');
    if (!access.isEnrolled) throw new AppError('Not enrolled', 403);
    const paidOrderRow = await prisma.courseOrder.findFirst({
      where: { userId: req.userId!, courseId, status: { in: ['PAID', 'COMPLETED'] } },
      select: { id: true },
    });
    if (!paidOrderRow && !access.isAdmin) {
      throw new AppError('Vui long mua khoa hoc de cap nhat tien do', 402);
    }
  }
  ```
- **Effort**: 30 phút

---

## Phần 2: Bug Logic khác (P1 — Quan trọng)

### 2.1. `progressPercent` không cap 100% + count draft lessons

- **Vị trí**: `src/routes/course.routes.ts:1430-1446`
- **Bug A**: `(completedCount / courseLessons) * 100` có thể > 100% nếu lesson bị xóa sau khi user complete.
  - VD: 3 lessons, user complete 3 → 100%. Admin xóa 1 lesson → 3/2 = 150%.
- **Bug B**: `courseLessons` count không filter `isPublished: true` → admin thêm 1 draft lesson làm % tự động giảm.
  - VD: User đang 80%, admin draft 1 lesson → 80/4 = 20% (false impression).
- **Fix**:
  ```ts
  // Filter chỉ lesson published
  const courseLessons = await prisma.lesson.count({
    where: { section: { courseId }, isPublished: true },
  });

  // Cap progressPercent ở 100
  const safePercent = courseLessons > 0
    ? Math.min(100, (completedCount / courseLessons) * 100)
    : 0;

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progressPercent: safePercent,
      // ...
    },
  });
  ```
- **Effort**: 15 phút

### 2.2. Coupon abuse: `DiscountCode.userId === null` cho phép dùng nhiều lần

- **Vị trí**:
  - Schema: `prisma/schema.prisma:814-838` (model `DiscountCode`)
  - Logic: `src/routes/payment.routes.ts:117-155` (function `applyDiscountCode`)
- **Bug**: Một coupon global (e.g. `WELCOME10`, không gán user) hiện tại user dùng được 5-10 lần liên tục cho cùng 1 course.
- **Root cause**: Helper chỉ check `maxUses` (tổng toàn hệ thống) + `userId` (nếu set thì scope 1 user). Không có flag `onePerUser` cho coupon global.
- **Fix**:
  1. **Thêm field vào schema**:
     ```prisma
     model DiscountCode {
       // ... existing fields
       onePerUser Boolean @default(false) @map("one_per_user")
     }
     ```
  2. **Migration**: `npx prisma migrate dev --name add_discount_one_per_user`
  3. **Update helper** `applyDiscountCode`:
     ```ts
     async function applyDiscountCode(
       code: { /* ... existing */ onePerUser: boolean },
       baseAmount: number,
       userId: number,
       tx?: Prisma.TransactionClient,
     ): Promise<{ finalAmount: number; discountAmount: number; error?: string }> {
       // ... existing checks (active, startsAt, expiresAt, maxUses, userId, minOrderAmount)

       if (code.onePerUser) {
         // Check if this user already used this code
         const client = tx || prisma;
         const existing = await client.courseOrder.findFirst({
           where: {
             userId,
             discountCodeId: code.id, // cần lookup ID trước
             status: { in: ['PAID', 'COMPLETED'] },
           },
           select: { id: true },
         });
         if (existing) {
           return { finalAmount: baseAmount, discountAmount: 0, error: 'Ban da su dung ma nay roi' };
         }
       }
       // ... rest
     }
     ```
  4. **Update caller** để pass `tx` (cùng transaction với order create) — tránh race condition khi 2 request đồng thời cùng apply coupon.
- **Effort**: 1.5 giờ (cần migration + test transaction)

### 2.3. Refund chưa verify với VNPay

- **Vị trí**: `src/routes/payment.routes.ts:907-1063` (route `/admin/refund`)
- **Bug**: Admin gọi `/admin/refund` → cập nhật DB (status=REFUNDED, giảm enrollment, send email) **NHƯNG KHÔNG gọi VNPay refund API**. Admin mistake = tiền mất (user vẫn có enrollment nếu quên revoke).
- **Fix**:
  1. **Thêm field vào schema**:
     ```prisma
     model CourseOrder {
       // ... existing
       refundProcessed Boolean @default(false) @map("refund_processed")
       refundVnpayTxnNo String? @map("refund_vnpay_txn_no") @db.VarChar(64)
     }
     ```
  2. **Thêm function gọi VNPay refund API** (nếu VNPay có endpoint refund — cần check docs):
     ```ts
     async function callVnpayRefund(orderCode: string, amount: number, txnNo: string): Promise<{ ok: boolean; vnpayTxnNo?: string; error?: string }> {
       // Build signed request to VNPay refund endpoint
       // https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
     }
     ```
  3. **Update admin route**:
     ```ts
     // 1. Call VNPay refund FIRST
     if (order.paymentTxnNo) {
       const result = await callVnpayRefund(order.orderCode, refundAmount, order.paymentTxnNo);
       if (!result.ok) {
         throw new AppError(`VNPay refund failed: ${result.error}`, 502);
       }
       // Lưu vnpayTxnNo refund
     }
     // 2. Sau khi VNPay OK → update DB
     await prisma.$transaction(async (tx) => { /* ... */ });
     ```
  4. **UI reminder**: Hiển thị badge "Refund processed" / "Refund pending" trong admin UI.
- **Effort**: 2 giờ (cần test với VNPay sandbox)

### 2.4. Certificate auto-generation (Missing feature)

- **Vị trí**:
  - Schema: `prisma/schema.prisma:666-681` (model `Certificate` — đã có sẵn)
  - Routes: `src/routes/certificate.routes.ts` (chỉ có 3 routes read-only)
- **Bug/Feature gap**: User complete course 100% → enrollment status = `COMPLETED` → **NHƯNG KHÔNG CÓ certificate nào được sinh ra**. Backend có 3 routes đọc, 0 routes tạo.
- **Fix**:
  1. **Tạo service** `src/services/certificate.service.ts`:
     ```ts
     import crypto from 'crypto';

     export async function issueCertificateForEnrollment(enrollmentId: number): Promise<Certificate> {
       return prisma.$transaction(async (tx) => {
         const enrollment = await tx.enrollment.findUnique({
           where: { id: enrollmentId },
           include: { course: { select: { id: true, title: true, instructorId: true } } },
         });
         if (!enrollment) throw new AppError('Enrollment not found', 404);
         if (enrollment.status !== 'COMPLETED') {
           throw new AppError('Enrollment chua hoan thanh', 400);
         }

         // Check existing (idempotent)
         const existing = await tx.certificate.findUnique({
           where: { enrollmentId },
         });
         if (existing) return existing;

         // Generate certificate number: CERT-YYYYMMDD-USERID-COURSEID-RAND
         const date = new Date();
         const yyyymmdd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
         const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
         const certNumber = `CERT-${yyyymmdd}-${enrollment.userId}-${enrollment.courseId}-${rand}`;

         return tx.certificate.create({
           data: {
             certificateNumber: certNumber,
             userId: enrollment.userId,
             courseId: enrollment.courseId,
             enrollmentId: enrollment.id,
             issuedAt: new Date(),
           },
         });
       });
     }
     ```
  2. **Hook vào progress route** `src/routes/course.routes.ts:1440-1447`:
     ```ts
     const isJustCompleted = completedCount === courseLessons && courseLessons > 0;
     await prisma.enrollment.update({
       where: { id: enrollment.id },
       data: {
         progressPercent: safePercent, // từ fix 2.1
         lastLessonId: lessonId,
         lastAccessedAt: new Date(),
         status: isJustCompleted ? 'COMPLETED' : 'ACTIVE',
       },
     });

     // Auto-issue cert khi vừa complete
     if (isJustCompleted) {
       try {
         await issueCertificateForEnrollment(enrollment.id);
       } catch (e) {
         console.error('[progress] failed to issue cert', e);
         // Không throw — enrollment vẫn COMPLETED, user có thể retry
       }
     }
     ```
  3. **Endpoint cho user tự retry** (khi cert chưa được sinh vì lỗi):
     ```ts
     router.post('/certificates/issue/:enrollmentId', authenticate, async (req, res, next) => {
       try {
         // Verify enrollment thuộc user
         const enrollment = await prisma.enrollment.findFirst({
           where: { id: parseInt(req.params.enrollmentId), userId: req.userId },
         });
         if (!enrollment) throw new AppError('Not found', 404);

         const cert = await issueCertificateForEnrollment(enrollment.id);
         res.json({ success: true, data: cert });
       } catch (e) { next(e); }
     });
     ```
  4. **UI update**: Khi user vào `/my-courses`, hiển thị link "Xem chứng chỉ" nếu enrollment status = COMPLETED.
- **Effort**: 1.5 giờ

---

## Phần 3: Missing Feature (P2 — UX lớn)

### 3.1. Course Review — không có endpoint tạo

- **Vị trí**:
  - Schema: `prisma/schema.prisma:683-705` (model `CourseReview` — đã có sẵn)
  - Backend: tìm `courseReview` → 0 kết quả
- **Bug**: Schema có nhưng 0 endpoint POST. User chỉ xem được review, không đăng được.
- **Fix**:
  ```ts
  // Trong src/routes/course.routes.ts, thêm route mới
  router.post(
    '/:id/reviews',
    authenticate,
    async (req: Request, res: Response<ApiResponse>, next) => {
      try {
        const courseId = parseInt(req.params.id, 10);
        const { rating, title, content } = req.body;

        // Validate
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
          throw new AppError('Rating phai tu 1 den 5', 400);
        }
        if (title && typeof title === 'string' && title.length > 255) {
          throw new AppError('Title qua dai', 400);
        }

        // Check user đã enrolled + paid
        const access = await assertCanAccessCourseContent(req.userId, courseId, 'admin-or-enrolled');
        let hasPaidOrder = false;
        if (access.isEnrolled && !access.isFree && !access.isAdmin) {
          const order = await prisma.courseOrder.findFirst({
            where: { userId: req.userId!, courseId, status: { in: ['PAID', 'COMPLETED'] } },
            select: { id: true },
          });
          hasPaidOrder = Boolean(order);
        }
        if (!access.isFree && !access.isAdmin && !hasPaidOrder) {
          throw new AppError('Vui long mua khoa hoc de danh gia', 402);
        }

        // Check user đã complete ít nhất 30% chưa (chống spam)
        const enrollment = await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId: req.userId!, courseId } },
          select: { progressPercent: true },
        });
        if (!enrollment || enrollment.progressPercent < 30) {
          throw new AppError('Can hoc it nhat 30% khoa hoc de danh gia', 403);
        }

        // Upsert review (1 user / 1 course)
        const review = await prisma.courseReview.upsert({
          where: { userId_courseId: { userId: req.userId!, courseId } },
          create: {
            userId: req.userId!,
            courseId,
            rating,
            title: title || null,
            content: content || null,
            isApproved: false, // cần admin duyệt
          },
          update: {
            rating,
            title: title || null,
            content: content || null,
            isApproved: false, // reset approval khi update
          },
        });

        res.status(201).json({ success: true, data: review });
      } catch (e) { next(e); }
    }
  );

  // Admin duyệt
  router.patch(
    '/reviews/:id/approve',
    authenticate,
    requireAdmin('ROLE_ADMIN'),
    async (req, res, next) => {
      try {
        const review = await prisma.courseReview.update({
          where: { id: parseInt(req.params.id) },
          data: { isApproved: true },
        });
        res.json({ success: true, data: review });
      } catch (e) { next(e); }
    }
  );
  ```
- **Frontend**: Thêm form "Đánh giá khóa học" trên `/courses/[slug]` (chỉ hiện khi user enrolled + progress >= 30%).
- **Effort**: 2 giờ

### 3.2. My Learning widget trên Dashboard

- **Vị trí**: `frontend/src/app/dashboard/page.tsx`
- **Bug/Feature gap**: Dashboard hiện tại chỉ show activity timeline, không show:
  - Course progress (đang học / hoàn thành)
  - Certificate list
  - Last accessed course
- **Fix**:
  1. **API mới** `GET /api/v1/courses/my/summary`:
     ```ts
     router.get('/my/summary', authenticate, async (req, res, next) => {
       try {
         const [enrollments, certificates] = await Promise.all([
           prisma.enrollment.findMany({
             where: { userId: req.userId!, status: { in: ['ACTIVE', 'COMPLETED'] } },
             include: {
               course: { select: { id: true, title: true, thumbnailUrl: true, slug: true } },
             },
             orderBy: { lastAccessedAt: 'desc' },
             take: 5,
           }),
           prisma.certificate.findMany({
             where: { userId: req.userId! },
             include: { course: { select: { id: true, title: true, slug: true } } },
             orderBy: { issuedAt: 'desc' },
             take: 3,
           }),
         ]);
         res.json({ success: true, data: { enrollments, certificates } });
       } catch (e) { next(e); }
     });
     ```
  2. **Widget trên Dashboard**:
     ```tsx
     // Trong /dashboard/page.tsx
     <section className="rounded-2xl border border-darkborder/50 bg-darkcard/40 p-5">
       <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
         <GraduationCap className="w-5 h-5 text-neon-violet" />
         My Learning
       </h2>
       {enrollments.map(e => (
         <Link key={e.id} href={`/courses/${e.course.slug}/learn`} className="flex items-center gap-3 p-3 hover:bg-darkbg/60 rounded-lg">
           <img src={e.course.thumbnailUrl} className="w-12 h-12 rounded-lg object-cover" />
           <div className="flex-1 min-w-0">
             <p className="text-sm font-medium text-text-primary truncate">{e.course.title}</p>
             <div className="flex items-center gap-2 mt-1">
               <div className="flex-1 h-1.5 bg-darkborder rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-neon-indigo to-neon-violet" style={{ width: `${e.progressPercent}%` }} />
               </div>
               <span className="text-xs text-text-muted">{Math.round(e.progressPercent)}%</span>
             </div>
           </div>
         </Link>
       ))}
     </section>
     ```
- **Effort**: 2 giờ

---

## Phần 4: Nice-to-have (P3 — Làm sau)

### 4.1. Course Recommendation System
- **Mô tả**: Gợi ý khóa học dựa trên tags, category, level, enrollment history
- **Backend**: Endpoint `GET /api/v1/courses/recommendations?userId=` (hoặc từ JWT)
- **Logic gợi ý đơn giản**:
  1. User đã enroll vào course thuộc category X → recommend courses cùng category, cùng level
  2. Nếu user chưa enroll gì → recommend top enrolled courses
- **Frontend**: Widget "Có thể bạn quan tâm" trên `/courses/[slug]` + `/`
- **Effort**: 3-4 giờ

### 4.2. Wishlist / Save for later
- **Schema**: `model Wishlist { userId, courseId, createdAt }` (M2M)
- **Endpoints**: `POST/DELETE/GET /api/v1/courses/wishlist`
- **Frontend**: Icon trái tim trên `CourseCard`, page `/wishlist`
- **Effort**: 2 giờ

### 4.3. Quiz system cho lesson (thay vì chỉ Assignment)
- **Schema**: `model Quiz { lessonId, questions[] }` với MCQ
- **Self-grading** → tự cập nhật progress
- **Effort**: 4 giờ

### 4.4. Email notification cho course events
- New lesson added → email subscribers
- User đạt 50%/100% → congrats
- Cert issued → email + PDF link
- **Effort**: 2-3 giờ (cần integrate email service đã có)

### 4.5. Q&A / Discussion trong lesson
- **Schema**: `model LessonComment { lessonId, userId, content, parentId? }` (threaded)
- **Endpoints**: CRUD + like
- **Frontend**: Panel dưới video player
- **Effort**: 3 giờ

### 4.6. Course bundle (multi-course discount)
- **Schema**: `model CourseBundle { id, name, courseIds[], price, discountPercent }`
- **Mở rộng payment flow**
- **Effort**: 4 giờ

---

## Tổng kết ưu tiên

| # | Bug/Feature | Priority | Effort | File chính |
|---|-------------|----------|--------|------------|
| 1.1 | Document download paywall leak | 🔴 P0 | 30m | course.routes.ts:1622 |
| 1.2 | Assignments no auth (public leak) | 🔴 P0 | 30m | course.routes.ts:1125 |
| 1.3 | Assignment submit no paid check | 🔴 P0 | 30m | course.routes.ts:1198 |
| 1.4 | Progress no paid check | 🔴 P0 | 30m | course.routes.ts:1403 |
| 2.1 | progressPercent cap + filter draft | 🟡 P1 | 15m | course.routes.ts:1430 |
| 2.2 | Coupon onePerUser flag | 🟡 P1 | 1.5h | schema.prisma + payment.routes.ts |
| 2.3 | Refund verify with VNPay | 🟡 P1 | 2h | payment.routes.ts:907 + schema |
| 2.4 | Certificate auto-generation | 🟡 P1 | 1.5h | certificate.service.ts (new) |
| 3.1 | Course Review endpoint | 🟢 P2 | 2h | course.routes.ts (new routes) |
| 3.2 | My Learning widget | 🟢 P2 | 2h | dashboard/page.tsx + new API |
| 4.x | Recommendations, Wishlist, Quiz, etc. | 🟢 P3 | 2-4h each | various |

**Tổng thời gian ước tính**:
- P0: ~2 giờ
- P1: ~5.5 giờ
- P2: ~4 giờ
- P3: 12-20 giờ

---

## Commit checklist khi fix

Khi làm bất kỳ fix nào:

1. ✅ Đọc file liên quan trước khi sửa (bắt buộc theo .cursorrules)
2. ✅ Verify imports cho JSX hooks/motion/icons
3. ✅ `npm run build` phải pass
4. ✅ Commit message format: `fix(scope): mô tả ngắn gọn`
5. ✅ Push + `git push origin main` trigger CI/CD
6. ✅ Verify trên production bằng `curl` + token test
7. ✅ Update `fix_update.md` nếu cần (mark ✅ done hoặc note issue mới phát hiện)
