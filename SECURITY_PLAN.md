# Kế hoạch: Bảo mật Authentication + Phân quyền User

> **Mục tiêu**: Hoàn thiện luồng đăng ký/đăng nhập/quên mật khẩu với OTP + chống robot, đồng thời gắn "bắt buộc đăng nhập" cho các action quan trọng (Academy, Music Playlist, Admin).
>
> **Ngày tạo**: 2026-06-14
>
> **Phạm vi**: Toàn bộ user-facing flows. Admin flows giữ nguyên (admin = full quyền, không cần kiểm tra thêm).

---

## Mục lục

1. [Phân tích hiện trạng](#1-phân-tích-hiện-trạng)
2. [Phần 1: Bảo mật Authentication](#2-phần-1-bảo-mật-authentication)
3. [Phần 2: Phân quyền Admin vs User](#3-phần-2-phân-quyền-admin-vs-user)
4. [Phần 3: Login Required cho Action](#4-phần-3-login-required-cho-action)
5. [Bài toán kỹ thuật](#5-bài-toán-kỹ-thuật)
6. [Lộ trình triển khai](#6-lộ-trình-triển-khai)
7. [Test cases](#7-test-cases)

---

## 1. Phân tích hiện trạng

### 1.1. Đã có trong codebase (kiểm tra 2026-06-14)

| Tính năng | Backend | Frontend | Ghi chú |
|---|---|---|---|
| `POST /auth/register` | ✅ Có | ✅ Có form | Đã có flow cơ bản |
| `POST /auth/login` | ✅ Có | ✅ Có form | username + password |
| `POST /auth/verify-email` | ✅ Có | ✅ Có | Gửi token qua email |
| `POST /auth/resend-verification` | ✅ Có | ✅ Có | Resend OTP token |
| `POST /auth/forgot-password` | ✅ Có (tôi đoán) | 🟡 Có thể có | Cần verify |
| `POST /auth/reset-password` | ✅ Có (tôi đoán) | 🟡 Có thể có | Cần verify |
| Cookie httpOnly cho JWT | ✅ Có | — | `backend_token` |
| `requireAdmin` middleware | ✅ Có | — | Dùng cho /admin/* |
| Quota middleware | ✅ Có | ✅ Có indicator | 500/day cho user |
| Academy paywall | 🟡 Có schema, chưa có middleware | ❌ Chưa có UI gate | Xem `PAYWALL_PLAN.md` |
| Music playlist ownership | ❌ Cần check | ❌ Cần check | Xem dưới |

### 1.2. CẦN BỔ SUNG

| Tính năng | Mức độ | Lý do |
|---|---|---|
| **OTP 6 số** cho register/verify | Trung bình | Bảo mật tốt hơn token dài, UX tốt hơn |
| **CAPTCHA** (chống robot) | Trung bình | Chặn spam đăng ký, brute force |
| **Rate limit** cho register/login | ✅ Đã có (authLimiter) | Verify lại giới hạn |
| **2FA** cho admin (optional) | Cao | Làm sau |
| **Login gate** cho Academy "tiếp tục học" | Trung bình | Yêu cầu user |
| **Login gate** cho Music "tạo playlist" | Trung bình | Yêu cầu user |
| **Login gate** cho /admin/* | Trung bình | Nếu chưa login → toast |
| **Show "Created by: username"** dưới playlist | Nhỏ | Yêu cầu user |

---

## 2. Phần 1: Bảo mật Authentication

### 2.1. OTP 6 số thay vì token dài

**Hiện tại**: `verify-email` dùng token dài ~64 ký tự gửi qua link. User phải click link trong email → token lộ nếu user share link.

**Đề xuất**: Đổi sang OTP 6 số.

```
Flow mới:
1. User register → email "Mã xác thực của bạn: 482917 (5 phút)"
2. User nhập 482917 vào form → POST /auth/verify-email { email, otp }
3. Backend so sánh OTP trong Redis (key: otp:verify:user@email.com, TTL 5min)
4. Nếu đúng → set user.verified = true → return JWT cookie
```

**Schema lưu trữ** (Redis):
```
otp:verify:cuongthaihnhe176322@gmail.com = "482917" (TTL 300s)
otp:reset:cuongthaihnhe176322@gmail.com = "918273" (TTL 600s)
```

**Rate limit**:
- Tối đa 5 lần nhập sai / 15 phút / email
- Tối đa 3 lần gửi lại OTP / 1 giờ / email

**File cần sửa**:
- `src/services/auth.service.ts` — thêm `sendOtp()`, `verifyOtp()`
- `src/routes/auth.routes.ts` — `POST /verify-otp`, `POST /resend-otp`
- `frontend/src/app/(auth)/verify-email/page.tsx` — form 6 ô input OTP
- `frontend/src/app/(auth)/forgot-password/page.tsx` — form OTP

### 2.2. CAPTCHA chống robot

**Các option**:

| Loại | Provider | Miễn phí | UX | Bảo mật |
|---|---|---|---|---|
| Google reCAPTCHA v3 | Google | ✅ (10K/tháng) | Tốt (không cần click) | Cao |
| Cloudflare Turnstile | Cloudflare | ✅ (miễn phí unlimited) | Rất tốt | Cao |
| hCaptcha | hCaptcha | ✅ (1M/tháng) | Trung bình | Cao |
| **Custom math/image** | Tự build | ✅ | Kém | Thấp |

**Đề xuất**: **Cloudflare Turnstile** vì:
- Miễn phí không giới hạn
- Không cần user click (chỉ 1 lần verify invisible)
- Tốt cho mobile
- Setup đơn giản (chỉ cần 1 site key + secret)

**Flow**:
```
1. User load form login/register
2. Turnstile widget tự render ở góc (invisible)
3. User submit → frontend có token "cf-turnstile-response"
4. Gửi kèm token lên backend
5. Backend verify với Cloudflare API:
   POST https://challenges.cloudflare.com/turnstile/v0/siteverify
   { secret: TURNSTILE_SECRET, response: <token> }
6. Nếu success: true → cho login
7. Nếu fail → 403
```

**File cần thêm**:
- `src/services/captcha.service.ts` (mới) — verify token với Cloudflare
- `src/middleware/verifyCaptcha.ts` (mới) — middleware
- Gắn vào `POST /auth/login`, `POST /auth/register`, `POST /auth/forgot-password`
- Frontend: thêm `<TurnstileWidget sitekey={TURNSTILE_SITE_KEY} />` ở các form

**Env cần thêm**:
```
TURNSTILE_SITE_KEY=0x4AAAAAA... (public)
TURNSTILE_SECRET_KEY=0x4AAAAAA... (private, chỉ backend)
```

### 2.3. Rate limit cho auth endpoints

**Hiện tại** (xác nhận lại):
- `authLimiter` đã có trong `index.ts` (5-10 req/15min tùy config)
- Cần verify số lần cụ thể

**Đề xuất** (mặc định, có thể config qua env):

| Endpoint | Limit | Lý do |
|---|---|---|
| `POST /auth/login` | 10 req / 15 min / IP | Chống brute force password |
| `POST /auth/register` | 5 req / 1 giờ / IP | Chống spam account |
| `POST /auth/forgot-password` | 5 req / 1 giờ / IP | Chống spam email |
| `POST /auth/verify-otp` | 10 req / 15 phút / email | Chống brute force OTP |
| `POST /auth/resend-otp` | 3 req / 1 giờ / email | Chống spam email |

### 2.4. Audit log cho admin login (optional)

Lưu log mỗi lần admin login:
- IP, user agent, timestamp
- Ghi vào bảng `AuditLog` (Prisma) hoặc Redis stream

---

## 3. Phần 2: Phân quyền Admin vs User

### 3.1. Quy tắc chung

| Role | Quyền |
|---|---|
| **Guest** (chưa login) | Xem blog, landing, courses list, free previews |
| **User** (USER role) | Tất cả guest + comment, like, chat AI (có quota), tạo playlist, xem profile |
| **Admin** (ADMIN role) | Tất cả user + `/admin/*`, embed jobs, manage users, manage courses, manual enrollment |

### 3.2. Admin full quyền không cần mua

Đã có trong `requireLessonAccess` (PAYWALL_PLAN.md line 350):
```typescript
// Rule 3: admin → always allowed
if (user.role === 'ROLE_ADMIN') return next();
```

Đã chuẩn. Admin xem được mọi khoá học, mọi bài học, không cần mua.

### 3.3. Middleware tổng quát

Thêm middleware `optionalAuth` (không bắt buộc login) cho các route public:

```typescript
// src/middleware/optionalAuth.ts
export function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return next(); // guest, continue without req.user
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch {
    next(); // invalid token → treat as guest
  }
}
```

Dùng cho các route cần biết user là ai nhưng không bắt buộc login (vd: blog list — show "đã thích" nếu có user, không thì chỉ show nút "Thích").

---

## 4. Phần 3: Login Required cho Action

### 4.1. Academy: "Tiếp tục học"

**Yêu cầu user**:
> Vào trang Academy. Phải bắt đăng nhập khi ấn vào "Tiếp tục học". Nếu chưa login mà vào trang admin sẽ có thông báo "Vui lòng đăng nhập để vào khoá học".

**Có 2 case cần phân biệt**:

#### Case A: Click "Tiếp tục học" khi đang xem course overview

```
User → /courses/:slug → click "Tiếp tục học"
  → Nếu chưa login: redirect /login?redirect=/learn/:lessonId
  → Nếu đã login: 
    - Nếu đã enroll: vào /learn/:lastLessonId
    - Nếu chưa enroll: 
      - Nếu isFree: auto-enroll → vào /learn
      - Nếu !isFree: show Paywall
```

#### Case B: Truy cập thẳng `/learn/:lessonId` khi chưa login

```
Guest → /learn/:lessonId
  → Middleware: chưa login → 401 với code LOGIN_REQUIRED
  → Frontend: hiện toast "Vui lòng đăng nhập để vào khoá học"
  → Sau 3s tự redirect về /login?redirect=/learn/:lessonId
```

**Đề xuất code (frontend)**:

```tsx
// Trang /courses/[slug]/page.tsx
async function handleContinueLearning() {
  if (!user) {
    toast.error('Vui lòng đăng nhập để tiếp tục học');
    router.push(`/login?redirect=/courses/${slug}`);
    return;
  }
  // user đã login → check enrollment
  if (enrollment) {
    router.push(`/learn/${enrollment.lastLessonId}`);
  } else if (course.isFree) {
    // auto-enroll
    await api.post('/enrollments/free', { courseId: course.id });
    router.push(`/learn/${course.firstLessonId}`);
  } else {
    // show Paywall
    setShowPaywall(true);
  }
}
```

### 4.2. Music: "Tạo playlist"

**Yêu cầu user**:
> Muốn tạo playlist nhạc, cũng phải bắt user đăng nhập. Hiện bên dưới playlist là user nào đã tạo.

**Flow**:
```
User → /music → click "Tạo playlist"
  → Nếu chưa login: toast "Vui lòng đăng nhập" → redirect /login?redirect=/music
  → Nếu đã login: mở modal tạo playlist

User tạo playlist → POST /api/v1/music/playlists { name, description }
  → Backend lưu userId = current user → return playlist object
  → Frontend redirect vào playlist mới
  → Hiện badge "Tạo bởi: Cuong03dx" dưới title
```

**Schema** (cần check):
```
Playlist {
  id, name, description, isPublic,
  userId,      // ← quan trọng, liên kết User
  coverUrl,
  createdAt, updatedAt,
  tracks: PlaylistTrack[]
}
```

**Nếu schema chưa có `userId`**: cần thêm + migration.

**Backend check ownership**:
```typescript
// PATCH /api/v1/music/playlists/:id
router.patch('/:id', authenticate, async (req, res) => {
  const playlist = await prisma.playlist.findUnique({ where: { id: req.params.id } });
  if (!playlist) return res.status(404).json({ message: 'Not found' });
  if (playlist.userId !== req.userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền sửa playlist này' });
  }
  // ... update
});
```

### 4.3. Admin: "Vui lòng đăng nhập"

**Yêu cầu user**:
> Nếu vào trang admin mà chưa đăng nhập sẽ có thông báo hiện lên.

**Flow**:
```
Guest → /admin/*
  → Next.js middleware check session (NextAuth)
  → Nếu chưa login: redirect /login?redirect=/admin/...
  → Nếu đã login nhưng role !== admin: 
    → Hiện toast "Bạn không có quyền truy cập trang này" → redirect /
  → Nếu là admin: cho vào
```

**Code Next.js (file `middleware.ts` ở root frontend)**:
```typescript
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token?.role === 'admin';
      }
      return !!token;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/admin/:path*', '/learn/:path*', '/chat', '/profile/:path*'],
};
```

---

## 5. Bài toán kỹ thuật

### 5.1. OTP storage

**Dùng Redis** (đã có sẵn `cuonghoangdev_redis`):
```
SET otp:verify:email@x.com "482917" EX 300
SET otp:reset:email@x.com "918273" EX 600
```

**Helper function**:
```typescript
// src/services/otp.service.ts
export async function generateOtp(email: string, type: 'verify' | 'reset'): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  const key = `otp:${type}:${email}`;
  await redis.set(key, otp, 'EX', type === 'verify' ? 300 : 600);
  return otp;
}

export async function verifyOtp(email: string, otp: string, type: 'verify' | 'reset'): Promise<boolean> {
  const key = `otp:${type}:${email}`;
  const stored = await redis.get(key);
  if (!stored || stored !== otp) return false;
  await redis.del(key); // one-time use
  return true;
}
```

### 5.2. Email service

**Hiện tại**: Có thể đã dùng SendGrid / Mailgun / SES.

**Cần check**:
- File `src/services/email.service.ts` (nếu có)
- Cấu hình SMTP / API key trong env

**Template email mới** (cho OTP):
```html
<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #1e293b;">Mã xác thực của bạn</h2>
  <p>Sử dụng mã dưới đây để hoàn tất đăng ký:</p>
  <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #0ea5e9;">
    482917
  </div>
  <p style="color: #64748b; font-size: 14px;">Mã có hiệu lực trong 5 phút. Nếu bạn không yêu cầu mã này, hãy bỏ qua email.</p>
</div>
```

### 5.3. CAPTCHA env config

**Cần thêm vào `.env`**:
```
# Cloudflare Turnstile (https://dash.cloudflare.com/?to=/:account/turnstile)
TURNSTILE_SITE_KEY=0x4AAAAAAAA...  # public, dùng cho frontend
TURNSTILE_SECRET_KEY=0x4AAAAAAAA...  # private, chỉ backend
```

**Cách đăng ký**:
1. Vào Cloudflare Dashboard → Turnstile → Add widget
2. Chọn mode "Invisible" (user không cần click)
3. Lấy Site Key (public) + Secret Key (private)
4. Add vào env

### 5.4. Frontend OTP input UX

Dùng component `<OtpInput>` với 6 ô input riêng biệt:
```tsx
<OtpInput length={6} onComplete={(otp) => submitVerify(otp)} autoFocus />
```

Sau khi nhập xong ô 6 → tự động submit. Paste cả 6 số vào ô đầu → tự fill các ô còn lại.

**Library đề xuất**: `react-otp-input` (npm) hoặc tự build (8-12 dòng code).

### 5.5. Toast component

Đã có thư viện toast chưa? Nếu chưa:
- Đề xuất: `sonner` (npm) — nhẹ, đẹp, dễ dùng
- Hoặc `react-hot-toast`

---

## 6. Lộ trình triển khai

### Ưu tiên 1: Bảo mật auth (1-1.5 ngày)

| # | Task | File | Thời gian |
|---|---|---|---|
| 1.1 | Thêm `otp.service.ts` (generate/verify) | `src/services/otp.service.ts` (mới) | 1h |
| 1.2 | Thêm `POST /auth/send-otp` + `POST /auth/verify-otp` | `src/routes/auth.routes.ts` | 2h |
| 1.3 | Update email template (HTML có mã 6 số) | `src/services/email.service.ts` | 1h |
| 1.4 | Update frontend form verify (6 ô input) | `frontend/src/app/(auth)/verify-email/page.tsx` | 2h |
| 1.5 | Update frontend form forgot-password (OTP) | `frontend/src/app/(auth)/forgot-password/page.tsx` | 2h |
| 1.6 | Thêm Cloudflare Turnstile service + middleware | `src/services/captcha.service.ts` + `src/middleware/verifyCaptcha.ts` | 2h |
| 1.7 | Gắn CAPTCHA vào /login, /register, /forgot-password | `src/routes/auth.routes.ts` | 1h |
| 1.8 | Thêm Turnstile widget vào frontend | Form components | 1h |
| 1.9 | Verify rate limit config (authLimiter) | `src/index.ts` | 0.5h |
| **Tổng** | | | **~12.5h** |

### Ưu tiên 2: Phân quyền + Login gate (0.5-1 ngày)

| # | Task | File | Thời gian |
|---|---|---|---|
| 2.1 | Thêm `optionalAuth` middleware | `src/middleware/optionalAuth.ts` (mới) | 1h |
| 2.2 | Next.js middleware check admin route | `frontend/middleware.ts` (mới) | 2h |
| 2.3 | Frontend: "Tiếp tục học" → check login | `frontend/src/app/courses/[slug]/page.tsx` | 1h |
| 2.4 | Frontend: "Tạo playlist" → check login | `frontend/src/app/music/page.tsx` | 1h |
| 2.5 | Check Playlist schema có `userId` chưa | `prisma/schema.prisma` | 0.5h |
| 2.6 | Backend: enforce ownership trên PATCH/DELETE playlist | `src/routes/music.routes.ts` | 1h |
| 2.7 | Frontend: hiện "Tạo bởi: username" dưới playlist | `frontend/src/app/music/playlists/[id]/page.tsx` | 1h |
| **Tổng** | | | **~7.5h** |

### Ưu tiên 3: Tích hợp & test (0.5 ngày)

| # | Task | Thời gian |
|---|---|---|
| 3.1 | Test E2E toàn bộ flow (xem Test cases dưới) | 3h |
| 3.2 | Update docs (DEPLOY-FASTER.md) | 1h |
| **Tổng** | | **~4h** |

### Tổng thời gian ước tính

**~24h (~3 ngày làm việc)**

---

## 7. Test cases

### 7.1. Authentication

| # | Scenario | Expected |
|---|---|---|
| 1 | Register với email mới + CAPTCHA | Gửi OTP, hiện form nhập OTP |
| 2 | Nhập OTP đúng | Set verified=true, login thành công |
| 3 | Nhập OTP sai 5 lần | Khóa 15 phút, phải gửi lại |
| 4 | OTP hết hạn (5 phút) | Báo lỗi, nút "Gửi lại mã" |
| 5 | Bấm "Gửi lại" 3 lần | Bị chặn 1 giờ |
| 6 | Login sai password 10 lần | Khóa tài khoản 30 phút |
| 7 | Forgot password → nhập email | Gửi OTP reset qua email |
| 8 | Reset password với OTP đúng | Đổi password, có thể login |
| 9 | Submit form không có CAPTCHA | Bị chặn 403 |
| 10 | CAPTCHA token hết hạn (300s) | Bị chặn 403, yêu cầu refresh |

### 7.2. Phân quyền

| # | Scenario | Expected |
|---|---|---|
| 1 | Guest vào /admin | Redirect /login với toast |
| 2 | User thường vào /admin | Toast "Không có quyền", redirect / |
| 3 | Admin vào /admin/users | Hiển thị danh sách users |
| 4 | User xem khoá free | OK, không cần mua |
| 5 | User xem khoá trả phí, chưa mua | Hiện Paywall |
| 6 | User đã mua vào khoá trả phí | OK, xem full |
| 7 | Admin vào khoá trả phí | OK, không cần mua |
| 8 | Guest xem free preview lesson | OK |
| 9 | Guest vào /learn/:lessonId không phải preview | Toast "Đăng nhập", redirect /login |

### 7.3. Music playlist

| # | Scenario | Expected |
|---|---|---|
| 1 | Guest click "Tạo playlist" | Toast "Đăng nhập", redirect /login |
| 2 | User tạo playlist | Lưu DB với userId = current user |
| 3 | User A edit playlist của User B | 403 Forbidden |
| 4 | Admin edit playlist của User A | OK |
| 5 | Hiển thị "Tạo bởi: Cuong03dx" dưới playlist | OK |
| 6 | Click vào username → /profile/Cuong03dx | OK |

### 7.4. Paywall (tích hợp từ PAYWALL_PLAN.md)

Xem file `PAYWALL_PLAN.md` section 5.8 (9 test cases đã liệt kê).

---

## Ghi chú cuối

- **Ưu tiên 1 nên làm trước** vì bảo mật auth nền tảng cho mọi flow khác.
- **Ưu tiên 2** có thể làm song song với **PAYWALL_PLAN.md** giai đoạn 1.
- **Cloudflare Turnstile** chọn vì miễn phí + UX tốt; nếu user thích reCAPTCHA v3 cũng OK (cùng pattern).
- **OTP 6 số** chỉ áp dụng cho register + forgot-password. Login bình thường vẫn dùng password.
- **Không lưu password plaintext** ở bất kỳ đâu. Đã dùng bcrypt ở code hiện tại.
- **Nếu deploy nhiều backend** (load balancer): rate limit phải dùng Redis store, không phải memory store.

---

## Liên kết

- `PAYWALL_PLAN.md` — Kế hoạch paywall (Manual Enrollment + Auto Payment)
- `DEPLOY-FASTER.md` — Quy trình deploy nhanh + bug log
- Cloudflare Turnstile docs: https://developers.cloudflare.com/turnstile/
- Next.js middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
