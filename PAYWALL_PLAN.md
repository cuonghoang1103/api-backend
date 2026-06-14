# Kế hoạch triển khai: Paywall cho môn học & bài học

> Mục tiêu: Cho phép một số bài học / môn học miễn phí (demo), phần còn lại khoá — chỉ mở khi user trả phí hoặc được admin cấp quyền thủ công.
>
> **Trạng thái**: Chưa triển khai. Tài liệu này note lại để triển khai sau khi **phần quyền tài khoản hoàn thành**.
>
> **Ngày tạo**: 2026-06-14
>
> **Cập nhật cuối**: 2026-06-14

---

## Mục lục

1. [Tổng quan & mục tiêu](#1-tổng-quan--mục-tiêu)
2. [Kiến trúc tổng thể](#2-kiến-trúc-tổng-thể)
3. [Những gì ĐÃ CÓ trong codebase](#3-những-gi-đã-có-trong-codebase)
4. [Những gì CẦN LÀM](#4-những-gi-cần-làm)
5. [Bước triển khai chi tiết](#5-bước-triển-khai-chi-tiết)
6. [Phụ lục: Mẫu code](#6-phụ-lục-mẫu-code)
7. [Đánh giá độ khó & thời gian](#7-đánh-giá-độ-khó--thời-gian)

---

## 1. Tổng quan & mục tiêu

### Vấn đề cần giải quyết

Hiện tại khi user truy cập một môn học bất kỳ, họ có thể xem tất cả bài học trong đó. Điều này không phù hợp với mô hình thương mại điện tử: cần phải:

- **Khoá một số bài học** lại, chỉ cho xem khi user trả phí (mua cả môn hoặc mua lẻ bài).
- **Mở khoá một số bài học "demo"** (thường là 1–2 bài đầu) để user thử trước khi mua.
- **Khoá toàn bộ môn học** nếu admin đánh dấu khoá (`isLocked` trên Section, hoặc course là trả phí và user chưa mua).

### 3 trạng thái của một bài học

| Trạng thái | Điều kiện | Hành vi |
|---|---|---|
| **FREE_PREVIEW** | `lesson.isFreePreview = true` | Ai cũng xem được, kể cả khách vãng lai |
| **LOCKED** | Section cha `isLocked = true` **HOẶC** course là trả phí mà user chưa mua | Hiện Paywall component |
| **UNLOCKED** | Đã mua/đăng ký, chưa hết hạn | Xem nội dung bình thường |

### 3 trạng thái của một môn học

| Trạng thái | Điều kiện | Hành vi |
|---|---|---|
| **FREE** | `course.isFree = true` | Tất cả bài học trong môn đều mở, không cần mua |
| **PREVIEW_ONLY** | `course.isFree = false` và user chưa mua | Chỉ các bài `isFreePreview = true` được xem, còn lại bị khoá |
| **ENROLLED** | User có `Enrollment` ACTIVE và chưa hết hạn | Tất cả bài học mở (trừ bài khoá cứng bởi Section) |

---

## 2. Kiến trúc tổng thể

```
┌──────────────────────────────────────────────────────────────────┐
│                         User truy cập                            │
│                       /learn/:lessonSlug                         │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│        Frontend: LessonViewer component                          │
│        - gọi GET /api/v1/courses/lessons/:id                     │
│        - nhận 200 / 401 / 403                                    │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│        Backend: middleware requireLessonAccess                    │
│                                                                  │
│   IF lesson.isFreePreview → cho qua                              │
│   ELSE IF !user → 401 (cần đăng nhập)                            │
│   ELSE IF course.isFree → cho qua                                │
│   ELSE IF user có Enrollment ACTIVE chưa hết hạn → cho qua      │
│   ELSE → 403 (cần mua)                                           │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│        Backend: trả về lesson content                            │
│        (200 OK)                                                  │
└──────────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│        Frontend:                                                  │
│        - 200: render nội dung bài học                            │
│        - 401: popup "Đăng nhập để tiếp tục"                     │
│        - 403: render <Paywall> với nút "Mua khoá học"           │
└──────────────────────────────────────────────────────────────────┘
```

### Luồng mua hàng (sau này)

```
User click "Mua khoá học" trong Paywall
    → POST /api/v1/payments/create { courseId }
        → Backend tạo Order(PENDING) + redirectUrl
    → User thanh toán trên VNPay/Momo/Stripe
    → Cổng redirect về /api/v1/payments/callback
        → Verify chữ ký, update Order(SUCCESS) → tạo Enrollment(ACTIVE)
    → Frontend reload → bài học mở khoá
```

---

## 3. Những gì ĐÃ CÓ trong codebase

Kiểm tra ngày 2026-06-14. Đánh dấu ✅ = đã sẵn sàng, 🟡 = có một phần, ❌ = chưa có.

### 3.1. Database (Prisma schema)

✅ **`Course.price`** (`Decimal(10,2)`) — đã có cột giá bán
✅ **`Course.discountPrice`** — đã có cột giá khuyến mãi
✅ **`Course.discountExpiresAt`** — đã có cột ngày hết hạn KM
✅ **`Course.isFree`** (`Boolean @default(false)`) — đã có cờ free
✅ **`CourseSection.isLocked`** (`Boolean @default(false)`) — đã có cờ khoá section
✅ **`Lesson.isFreePreview`** (`Boolean @default(false)`) — đã có cờ bài demo
✅ **`Enrollment`** model — bảng user-course **đã có sẵn**:
   - `userId`, `courseId`
   - `status` (String, default `"ACTIVE"`)
   - `expiresAt` (DateTime?)
   - `enrolledAt` (DateTime, default now())
   - `progressPercent`, `lastLessonId`, `lastAccessedAt`
   - Unique constraint `[userId, courseId]`
   - Index trên `userId`, `courseId`, `status`
✅ **`LessonProgress`** model — theo dõi tiến độ từng bài (đã có)
✅ **`Certificate`** model — cấp chứng chỉ khi hoàn thành (đã có)

❌ **Order / Payment / Transaction** model — **CHƯA CÓ**, cần tạo khi tích hợp cổng thanh toán.

### 3.2. Backend

🟡 **`getBySlug` (course.routes.ts ~line 187)** — đã có logic load `enrollment` theo `userId`, tính `progressPercent` và `completedLessons` → **tận dụng được pattern này** cho middleware.
🟡 **Auth middleware (`authenticate`)** — đã có, set `req.user` với `id`/`email`/`role`.
✅ **Role-based middleware (`requireAdmin`)** — đã có.

❌ **`requireLessonAccess` middleware** — CHƯA CÓ, cần tạo.
❌ **`/api/v1/payments/*` routes** — CHƯA CÓ.
❌ **Order/Payment controller** — CHƯA CÓ.

### 3.3. Frontend

🟡 **Trang `/admin/academy`** — đã có toggle `isPublished` cho từng bài (line ~1200 page.tsx), nhưng **CHƯA có toggle `isFreePreview`** trên UI (mặc dù field đã có trong DB).
🟡 **Trang `/courses/[slug]`** — đã hiển thị danh sách bài học, có thể cần thêm badge "🔒 Khoá" / "✓ Mở" cho từng bài.
🟡 **Trang `/learn/[lessonId]`** (hoặc tương đương) — đã render nội dung, nhưng **CHƯA xử lý 401/403** để hiện Paywall.

❌ **`<Paywall>` component** — CHƯA CÓ, cần tạo.
❌ **Form giá trong `/admin/academy`** — CHƯA CÓ input `price` / `discountPrice` / `isFree`.
❌ **Trang `/admin/enrollments`** (cấp quyền thủ công) — CHƯA CÓ.

### 3.4. Kết luận

**Tổng kết**: Khoảng **60–70% nền tảng đã có sẵn**:
- Schema đầy đủ (`Enrollment`, `isFreePreview`, `isLocked`, `isFree`, `price`).
- Logic check enrollment đã có pattern trong `getBySlug`.
- Middleware auth đã sẵn.

**Còn thiếu ~30–40%**:
- Middleware `requireLessonAccess`.
- Paywall component + flow xử lý 401/403.
- Tích hợp cổng thanh toán (nếu muốn auto).
- Manual enrollment UI (nếu không làm auto trước).
- UI toggle `isFreePreview` trong admin form.

---

## 4. Những gì CẦN LÀM

### 4.1. Giai đoạn 1: Paywall thủ công (Manual Enrollment) — **ƯU TIÊN**

Mục tiêu: Cho phép admin cấp quyền truy cập khoá học cho user thủ công. **Không cần cổng thanh toán.** Thời gian: ~0.5–1 ngày.

| # | Task | Loại | File |
|---|---|---|---|
| 1.1 | Tạo `requireLessonAccess` middleware | Backend | `src/middleware/requireLessonAccess.ts` (mới) |
| 1.2 | Gắn middleware vào route `GET /api/v1/courses/lessons/:id` | Backend | `src/routes/course.routes.ts` |
| 1.3 | Thêm UI toggle `isFreePreview` trong form lesson | Frontend | `frontend/src/app/admin/academy/page.tsx` |
| 1.4 | Thêm input `price` / `discountPrice` / `isFree` trong form course | Frontend | `frontend/src/app/admin/academy/page.tsx` |
| 1.5 | Tạo `<Paywall>` component | Frontend | `frontend/src/components/Paywall.tsx` (mới) |
| 1.6 | Xử lý response 401/403 trong `LessonViewer` | Frontend | `frontend/src/app/learn/[lessonId]/page.tsx` (hoặc tương đương) |
| 1.7 | Tạo trang `/admin/enrollments` (admin cấp quyền) | Frontend + Backend | `frontend/src/app/admin/enrollments/page.tsx` (mới) + `src/routes/enrollment.routes.ts` (mới) |
| 1.8 | Test E2E: guest xem demo, user thường bị khoá, enrolled user xem full | Test | Manual |

### 4.2. Giai đoạn 2: Tích hợp cổng thanh toán (Auto Enrollment)

Mục tiêu: User tự mua khoá học qua VNPay/Momo/Stripe, sau khi thanh toán thành công tự động tạo Enrollment.

| # | Task | Loại | File |
|---|---|---|---|
| 2.1 | Tạo `Order` model trong Prisma | Backend | `prisma/schema.prisma` + migration |
| 2.2 | Tạo `Payment` model (log từng lần thanh toán) | Backend | `prisma/schema.prisma` + migration |
| 2.3 | Tạo service xử lý từng cổng (VNPay/Momo/Stripe) — tách rời để dễ test | Backend | `src/services/payment/vnpay.ts` (mới) |
| 2.4 | Tạo routes `POST /api/v1/payments/create` + `/callback` | Backend | `src/routes/payment.routes.ts` (mới) |
| 2.5 | Trong Paywall, thêm nút "Thanh toán" → gọi `create` → redirect sang cổng | Frontend | `frontend/src/components/Paywall.tsx` |
| 2.6 | Trang `/courses/[slug]?payment=success` xử lý callback từ frontend | Frontend | `frontend/src/app/courses/[slug]/page.tsx` |
| 2.7 | Test với sandbox (VNPay có sandbox miễn phí) | Test | Manual |

### 4.3. Giai đoạn 3: Nâng cao (tuỳ chọn, làm sau)

| # | Task | Ghi chú |
|---|---|---|
| 3.1 | Subscription model (gói tháng/năm thay vì mua lẻ) | Lớn hơn, ~1 tuần |
| 3.2 | Coupon / mã giảm giá | Trung bình, ~2 ngày |
| 3.3 | Affiliate / giới thiệu bạn bè | Trung bình, ~3 ngày |
| 3.4 | Email xác nhận sau khi mua | Nhỏ, ~4 giờ |
| 3.5 | Refund flow | Lớn, ~1 tuần |

---

## 5. Bước triển khai chi tiết

### Bước 1.1: Tạo middleware `requireLessonAccess`

**Vị trí**: `src/middleware/requireLessonAccess.ts` (file mới)

**Logic**:
```typescript
// 1. Lấy lesson + course từ DB
// 2. IF lesson.isFreePreview === true → next() (ai cũng xem được)
// 3. IF !req.user → return 401 (chưa đăng nhập)
// 4. IF req.user.role === 'ROLE_ADMIN' → next() (admin luôn xem được)
// 5. IF course.isFree === true → next() (khoá free, ai đăng nhập cũng xem)
// 6. Tìm enrollment của user với course
//    - Nếu không có → return 403
//    - Nếu có nhưng status !== 'ACTIVE' → return 403
//    - Nếu có expiresAt < now() → return 403
// 7. → next()
```

**Đính kèm vào route**:
```typescript
router.get('/lessons/:id', authenticate, requireLessonAccess, async (req, res) => { ... });
```

### Bước 1.3: Toggle `isFreePreview` trong admin form

Trong `frontend/src/app/admin/academy/page.tsx`, lesson card (~line 1200):

```typescript
// Thêm cạnh toggle isPublished hiện tại
<button
  type="button"
  onClick={() => updateLesson(sectionIndex, lessonIndex, { isFreePreview: !lesson.isFreePreview })}
  className={...}
>
  <span>Bài demo miễn phí</span>
</button>
```

Cũng cần:
- Thêm `isFreePreview` vào `LessonFormState` type.
- Thêm vào payload của `adminCoursesApi.updateLesson(...)`.

### Bước 1.4: Form giá trong admin

Trong course form (~line 1036):

```typescript
<input type="number" value={courseForm.price} onChange={...} placeholder="Giá bán (VND)" />
<input type="number" value={courseForm.discountPrice || ''} onChange={...} placeholder="Giá khuyến mãi" />
<label>
  <input type="checkbox" checked={courseForm.isFree} onChange={...} />
  Khoá học miễn phí
</label>
```

### Bước 1.5: Paywall component

**Vị trí**: `frontend/src/components/Paywall.tsx` (file mới)

**Nội dung**:
- Ảnh thumbnail mờ (filter blur hoặc opacity 50%).
- Tiêu đề: "Mua khoá học để tiếp tục".
- Giá hiển thị: `299.000đ` (gạch ngang `499.000đ` nếu có discount).
- Bullet: "Bạn nhận được: X bài học · Source code · Chứng chỉ hoàn thành".
- Nút "Mua khoá học ngay" (primary).
- Nút phụ "Đã mua? Đăng nhập" (chỉ hiện nếu chưa đăng nhập).

### Bước 1.7: Trang `/admin/enrollments`

**Backend** (`src/routes/enrollment.routes.ts`):
- `GET /api/v1/enrollments` — list tất cả (admin only), filter theo `userId` / `courseId` / `status`.
- `POST /api/v1/enrollments` — tạo mới (admin only), body: `{ userId, courseId, expiresAt? }`.
- `DELETE /api/v1/enrollments/:id` — xoá (admin only).
- `PATCH /api/v1/enrollments/:id` — sửa status / expiresAt.

**Frontend** (`frontend/src/app/admin/enrollments/page.tsx`):
- Bảng danh sách: User | Khoá học | Ngày đăng ký | Hết hạn | Trạng thái | Actions.
- Form thêm: dropdown user (search) + dropdown course + date picker expiresAt.
- Nút "Cấp quyền" / "Thu hồi" / "Gia hạn".

### Bước 1.8: Test E2E

Test case cần cover:

| # | Scenario | Expected |
|---|---|---|
| 1 | Guest (không đăng nhập) mở bài `isFreePreview=true` | Hiện nội dung, không cần login |
| 2 | Guest mở bài `isFreePreview=false` (course `isFree=false`) | Hiện Paywall + nút "Đăng nhập" |
| 3 | User thường mở bài `isFreePreview=true` | Hiện nội dung |
| 4 | User thường mở bài `isFreePreview=false`, chưa mua | Hiện Paywall + nút "Mua khoá học" |
| 5 | User đã mua, mở mọi bài | Hiện nội dung đầy đủ |
| 6 | User mua course `isFree=true` | Tất cả bài đều mở, không cần mua |
| 7 | Admin mở mọi bài | Luôn hiện nội dung, bỏ qua paywall |
| 8 | Section `isLocked=true` | Mọi bài trong section đều khoá, kể cả đã mua |
| 9 | User enrollment hết hạn | Quay lại trạng thái khoá |

---

## 6. Phụ lục: Mẫu code

### 6.1. `requireLessonAccess` middleware (sketch)

```typescript
// src/middleware/requireLessonAccess.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export async function requireLessonAccess(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const lessonId = parseInt(req.params.id, 10);
    if (!lessonId) {
      return res.status(400).json({ success: false, message: 'Invalid lesson id' });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: { include: { course: true } } },
    });
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Rule 1: free preview → always allowed
    if (lesson.isFreePreview) return next();

    // Rule 2: not logged in → 401
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Login required', code: 'LOGIN_REQUIRED' });
    }

    // Rule 3: admin → always allowed
    if (user.role === 'ROLE_ADMIN') return next();

    // Rule 4: free course → any logged-in user
    if (lesson.section.course.isFree) return next();

    // Rule 5: section locked → 403
    if (lesson.section.isLocked) {
      return res.status(403).json({ success: false, message: 'Section is locked', code: 'SECTION_LOCKED' });
    }

    // Rule 6: enrolled + active + not expired
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: lesson.section.courseId } },
    });
    const now = new Date();
    const isActive = enrollment
      && enrollment.status === 'ACTIVE'
      && (!enrollment.expiresAt || enrollment.expiresAt > now);

    if (!isActive) {
      return res.status(403).json({
        success: false,
        message: 'You need to enroll in this course',
        code: 'ENROLLMENT_REQUIRED',
        courseId: lesson.section.courseId,
      });
    }

    return next();
  } catch (err) {
    return next(err);
  }
}
```

### 6.2. Paywall component (sketch)

```tsx
// frontend/src/components/Paywall.tsx
'use client';
import { Lock } from 'lucide-react';

export function Paywall({ course, onPurchase }: { course: Course; onPurchase: () => void }) {
  return (
    <div className="relative">
      {/* Blurred preview of content */}
      <div className="filter blur-md pointer-events-none">
        <p>Đây là phần nội dung bị khoá, sẽ hiển thị mờ phía sau...</p>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-2xl p-8">
        <Lock className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Mua khoá học để tiếp tục
        </h2>
        <p className="text-slate-300 text-center mb-6 max-w-md">
          Bạn sẽ nhận được trọn đời quyền truy cập {course.totalLessons} bài học, source code, và chứng chỉ hoàn thành.
        </p>
        <div className="flex items-baseline gap-2 mb-6">
          {course.discountPrice ? (
            <>
              <span className="text-3xl font-bold text-amber-400">
                {formatVnd(course.discountPrice)}
              </span>
              <span className="text-lg text-slate-500 line-through">
                {formatVnd(course.price)}
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-amber-400">
              {formatVnd(course.price)}
            </span>
          )}
        </div>
        <button
          onClick={onPurchase}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-semibold"
        >
          Mua khoá học ngay
        </button>
      </div>
    </div>
  );
}
```

### 6.3. LessonViewer xử lý 401/403 (sketch)

```tsx
// frontend/src/app/learn/[lessonId]/page.tsx (đoạn xử lý)
const { data: lesson, error } = useSWR(`/api/v1/courses/lessons/${id}`, fetcher);

if (error?.response?.status === 401) {
  return <LoginRequiredPopup onLogin={() => router.push('/login')} />;
}

if (error?.response?.status === 403) {
  const courseId = error.response.data.courseId;
  return <Paywall courseId={courseId} onPurchase={() => router.push(`/courses/${slug}`)} />;
}

if (lesson) return <LessonContent lesson={lesson} />;
```

---

## 7. Đánh giá độ khó & thời gian

### Giai đoạn 1: Manual Enrollment (khuyến nghị làm trước)

| Task | Độ khó | Thời gian |
|---|---|---|
| 1.1 Middleware `requireLessonAccess` | Dễ | 2–3 giờ |
| 1.2 Gắn vào route | Dễ | 0.5 giờ |
| 1.3 Toggle `isFreePreview` UI | Dễ | 1 giờ |
| 1.4 Form giá (price/discount/isFree) | Dễ | 1 giờ |
| 1.5 Paywall component | Trung bình | 3–4 giờ |
| 1.6 Xử lý 401/403 trong LessonViewer | Dễ | 2 giờ |
| 1.7 Trang `/admin/enrollments` (CRUD) | Trung bình | 4–6 giờ |
| 1.8 Test E2E | Dễ | 2 giờ |
| **Tổng giai đoạn 1** | | **~1–1.5 ngày** |

### Giai đoạn 2: Cổng thanh toán

| Task | Độ khó | Thời gian |
|---|---|---|
| 2.1–2.2 Prisma models (Order/Payment) | Dễ | 1 giờ |
| 2.3 Service cho cổng (VNPay sandbox) | Trung bình | 4–6 giờ |
| 2.4 Routes tạo/callback payment | Trung bình | 3–4 giờ |
| 2.5 Nút thanh toán trong Paywall | Dễ | 1 giờ |
| 2.6 Xử lý callback từ frontend | Trung bình | 2 giờ |
| 2.7 Test với sandbox | Trung bình | 2–3 giờ |
| **Tổng giai đoạn 2** | | **~2–3 ngày** |

### Tổng cộng (giai đoạn 1 + 2)

- **Manual + 1 cổng thanh toán**: ~3–4.5 ngày làm việc.
- **Đủ để demo khách hàng**: Sau giai đoạn 1 (~1.5 ngày).

---

## Ghi chú cuối

- File này **note lại** để triển khai sau khi **phần quyền tài khoản hoàn thành** (theo yêu cầu của user).
- Khi triển khai, **bắt đầu từ Giai đoạn 1** (Manual Enrollment) vì:
  - Không phụ thuộc cổng thanh toán.
  - Demo được ngay cho khách hàng.
  - Có thể thay thế bằng auto-enrollment sau này mà không cần đổi data model.
- Nếu có thay đổi về schema (ví dụ: cổng thanh toán yêu cầu thêm field), cập nhật file này trước khi code.
