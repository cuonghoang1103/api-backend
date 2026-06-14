# Hướng dẫn Setup Auth bảo mật cao + OAuth Google/GitHub

> **Cập nhật**: 2026-06-14
> **Phạm vi**: Bảo mật tài khoản (email verify, password mạnh, lockout) + sửa lỗi OAuth Google/GitHub
> **Triển khai**: Giai đoạn 1 đã xong. Giai đoạn 2 (2FA, refresh token rotation) sẽ làm sau.

---

## Mục lục

1. [Lỗi OAuth hiện tại](#1-lỗi-oauth-hiện-tại)
2. [Đã làm gì trong commit này](#2-đã-làm-gì-trong-commit-này)
3. [Setup Google OAuth credentials](#3-setup-google-oauth-credentials)
4. [Setup GitHub OAuth credentials](#4-setup-github-oauth-credentials)
5. [Setup Resend (email)](#5-setup-resend-email)
6. [Cấu hình env trên Vercel](#6-cấu-hình-env-trên-vercel)
7. [Cấu hình env trên Render (backend)](#7-cấu-hình-env-trên-render-backend)
8. [Test toàn bộ flow](#8-test-toàn-bộ-flow)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Lỗi OAuth hiện tại

### Lỗi 1: Google trả `400 invalid_request: Missing required parameter: client_id`
- **Nguyên nhân**: `GOOGLE_CLIENT_ID` rỗng trên Vercel → NextAuth build URL thiếu param
- **Fix**: Thêm env `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` trên Vercel (xem mục 6)

### Lỗi 2: GitHub trả `404 Not Found`
- **Nguyên nhân**: Tương tự — `GITHUB_CLIENT_ID` rỗng → GitHub không nhận diện được app
- **Fix**: Thêm env `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` trên Vercel

### Bảo mật bổ sung (Giai đoạn 1)
- ✅ Email verification bắt buộc trước khi login (OAuth tự động verify vì provider đã xác thực)
- ✅ Password policy mạnh: min 12, có hoa/thường/số/đặc biệt
- ✅ Account lockout: 5 lần sai → khoá 15 phút
- ✅ Timing-safe (không enumerate username)
- ✅ Email service qua Resend

---

## 2. Đã làm gì trong commit này

### Backend
| File | Thay đổi |
|---|---|
| `prisma/schema.prisma` | Thêm `emailVerified`, `failedLoginCount`, `lockoutUntil`, `lastLogin*` + model `EmailVerificationToken` |
| `src/services/auth.service.ts` | Thêm `validatePasswordStrength`, account lockout, email verification flow, timing-safe login, login tracking |
| `src/services/email.service.ts` | **Mới** — gửi email qua Resend (verification + password reset) |
| `src/routes/auth.routes.ts` | Thêm route `POST /verify-email` và `POST /resend-verification`; login nhận IP + User-Agent |
| `src/config/env.ts` | Thêm `resendApiKey`, `resendFromEmail` |

### Frontend
| File | Thay đổi |
|---|---|
| `src/lib/auth.ts` | Warn nếu thiếu OAuth env, thêm `signIn` callback chặn khi env rỗng |
| `src/lib/api.ts` | Thêm `verifyEmail`, `resendVerification`; thêm message thân thiện cho `ACCOUNT_LOCKED`, `EMAIL_NOT_VERIFIED`, `WEAK_PASSWORD` |
| `src/app/(auth)/login/page.tsx` | Handle `EMAIL_NOT_VERIFIED` → chuyển sang prompt resend |
| `src/app/(auth)/register/page.tsx` | Password policy mạnh (5 checks), màn hình "check your email" sau khi đăng ký, button gửi lại |
| `src/app/verify-email/page.tsx` | **Mới** — trang xác thực email từ link trong email |
| `src/app/api/auth/oauth/token/route.ts` | Fix `BACKEND_URL` đọc từ env (Vercel sẽ dùng `BACKEND_URL` hoặc `NEXT_PUBLIC_API_URL` thay vì hardcode Docker) |

### Config
| File | Thay đổi |
|---|---|
| `package.json` | Thêm dependency `resend` |
| `.env.example` (backend) | Thêm section Resend |
| `frontend/.env.example` | Hướng dẫn chi tiết setup Google + GitHub OAuth |

---

## 3. Setup Google OAuth credentials

### Bước 3.1: Tạo project trên Google Cloud Console

1. Truy cập: https://console.cloud.google.com/
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** → **OAuth consent screen**:
   - User type: **External**
   - App name: `CuongHoangDev`
   - User support email: email của bạn
   - Developer contact: email của bạn
   - Scopes: mặc định (`openid`, `email`, `profile`) — KHÔNG cần thêm
   - Test users: thêm email của bạn để test trước khi publish
   - **Save and Continue**

### Bước 3.2: Tạo OAuth Client ID

1. Vào **APIs & Services** → **Credentials**
2. **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `CuongHoangDev Web`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://cuonghoangdev.com
   https://www.cuonghoangdev.com
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://cuonghoangdev.com/api/auth/callback/google
   https://www.cuonghoangdev.com/api/auth/callback/google
   ```
7. Click **Create**
8. Copy **Client ID** và **Client Secret**

### Bước 3.3: Publish app (sau khi test xong)

Nếu muốn user khác (không phải test user) cũng login được:
1. OAuth consent screen → **Publishing status** → **Publish App**
2. Có thể cần Google verify (vài ngày) nếu dùng sensitive scopes
3. Với scopes cơ bản (`email`, `profile`) thì KHÔNG cần verify

---

## 4. Setup GitHub OAuth credentials

### Bước 4.1: Tạo OAuth App

1. Truy cập: https://github.com/settings/developers
2. **New OAuth App**
3. Điền:
   - Application name: `CuongHoangDev`
   - Homepage URL: `https://cuonghoangdev.com`
   - Application description: `Portfolio & Learning Platform`
   - Authorization callback URL:
     ```
     https://cuonghoangdev.com/api/auth/callback/github
     ```
4. Click **Register application**
5. Copy **Client ID**
6. **Generate a new client secret** → Copy **Client Secret**

### Bước 4.2: Thêm dev callback (nếu test local)

Nếu bạn dev local và muốn test GitHub OAuth:
- Tạo một OAuth App riêng cho dev với callback:
  ```
  http://localhost:3000/api/auth/callback/github
  ```
- Hoặc dùng `ngrok` để expose localhost và dùng callback của production app

---

## 5. Setup Resend (email)

### Bước 5.1: Tạo tài khoản

1. Truy cập: https://resend.com/signup
2. Đăng ký bằng GitHub hoặc email
3. Verify email

### Bước 5.2: Verify domain (cho production)

1. Vào https://resend.com/domains → **Add Domain**
2. Nhập domain: `cuonghoangdev.com`
3. Resend sẽ cung cấp DNS records cần thêm:
   - **SPF**: TXT record
   - **DKIM**: TXT record
   - **DMARC** (optional): TXT record
4. Vào DNS provider (Cloudflare / domain registrar) thêm các records
5. Click **Verify** trên Resend dashboard

### Bước 5.3: Tạo API key

1. Vào https://resend.com/api-keys → **Create API Key**
2. Name: `CuongHoangDev Production`
3. Permission: **Full access** (hoặc chỉ Sending access)
4. Domain: chọn domain đã verify
5. Click **Create**
6. **Copy API key ngay** — sẽ không hiển thị lại

### Bước 5.4: Test với sandbox (không cần verify domain)

Nếu muốn test nhanh không cần verify domain:
- Resend cho phép gửi từ `onboarding@resend.dev` tới email đã đăng ký tài khoản
- Set env:
  ```
  RESEND_FROM_EMAIL=onboarding@resend.dev
  ```
- Hữu ích cho dev, không dùng được cho production

---

## 6. Cấu hình env trên Vercel

Vào https://vercel.com/dashboard → chọn project → **Settings** → **Environment Variables**

Thêm các biến sau (áp dụng cho **Production**, **Preview**, và **Development**):

```bash
# NextAuth (bắt buộc)
NEXTAUTH_URL=https://cuonghoangdev.com
AUTH_SECRET=<openssl rand -base64 32>   # Generate key mới

# Google OAuth
GOOGLE_CLIENT_ID=<client-id-từ-bước-3.2>
GOOGLE_CLIENT_SECRET=<client-secret-từ-bước-3.2>

# GitHub OAuth
GITHUB_CLIENT_ID=<client-id-từ-bước-4.1>
GITHUB_CLIENT_SECRET=<client-secret-từ-bước-4.1>

# Backend URL (cho /api/auth/oauth/token proxy)
BACKEND_URL=https://api.cuongthai.com
# HOẶC dùng NEXT_PUBLIC_API_URL
# NEXT_PUBLIC_API_URL=https://api.cuongthai.com

# Admin emails (CSV)
ADMIN_EMAILS=cuongthaihnhe176322@gmail.com

# Database (cho NextAuth session nếu dùng DB strategy — hiện đang JWT nên không cần)
# DATABASE_URL=<neondb-url>
```

**Sau khi thêm xong**, click **Redeploy** để áp dụng.

### Cách generate `AUTH_SECRET`

```bash
openssl rand -base64 32
# Output ví dụ: 7xK9mP2vL8nQ4wR6yT3jH1fD5sB0aC9eG2hI4jK6lM8=
```

Dùng giá trị output làm `AUTH_SECRET`.

---

## 7. Cấu hình env trên Render (backend)

Vào https://dashboard.render.com → chọn backend service → **Environment**

Thêm:

```bash
# Database (NeonDB PostgreSQL)
DATABASE_URL=<neon-connection-string>

# JWT
JWT_SECRET=<openssl rand -base64 64>
JWT_REFRESH_SECRET=<openssl rand -base64 64>

# Resend
RESEND_API_KEY=<api-key-từ-bước-5.3>
RESEND_FROM_EMAIL=CuongHoangDev <noreply@cuonghoangdev.com>

# CORS — QUAN TRỌNG: thêm domain Vercel
ALLOWED_ORIGINS=https://cuonghoangdev.com,https://www.cuonghoangdev.com,https://cuongthai.com,https://api.cuongthai.com

FRONTEND_URL=https://cuonghoangdev.com

# Email admin (cho contact form)
CONTACT_ADMIN_EMAIL=cuongthaihnhe176322@gmail.com
```

Click **Save Changes** → Render tự redeploy.

---

## 8. Test toàn bộ flow

### Test 1: Đăng ký tài khoản credentials
1. Vào https://cuonghoangdev.com/register
2. Điền form với password mạnh (vd: `MyP@ssw0rd2026!`)
3. Submit → màn hình "Check your email"
4. Mở email → click link xác thực
5. Redirect về `/login` với thông báo thành công
6. Đăng nhập → vào trang chủ

### Test 2: Đăng nhập Google
1. Vào https://cuonghoangdev.com/login
2. Click nút **Google**
3. Redirect sang Google → chọn tài khoản
4. Redirect về `/oauth-callback`
5. Loading 1-2s → redirect về `/` (hoặc `/admin` nếu email nằm trong `ADMIN_EMAILS`)

### Test 3: Đăng nhập GitHub
1. Click nút **GitHub** ở trang login
2. Authorize app
3. Redirect về → thành công

### Test 4: Account lockout
1. Nhập sai password 5 lần liên tiếp
2. Sau lần 5: thông báo "Tài khoản bị khoá 15 phút"
3. Thử lại sau 15 phút → đăng nhập bình thường

### Test 5: Email chưa xác thực
1. Đăng ký tài khoản mới
2. **KHÔNG** click link xác thực
3. Thử đăng nhập → thông báo "Email chưa được xác thực"
4. Click "Gửi lại email xác thực" → nhận email mới

---

## 9. Troubleshooting

### Google vẫn lỗi `400 invalid_request: client_id`

1. **Kiểm tra env trên Vercel**:
   - Vào Vercel Dashboard → Settings → Environment Variables
   - Verify `GOOGLE_CLIENT_ID` đã được set cho **Production**
   - Sau khi thêm, phải **Redeploy**

2. **Kiểm tra redirect URI**:
   - Vào Google Cloud Console → Credentials → OAuth Client
   - Authorized redirect URIs phải CHÍNH XÁC là:
     ```
     https://cuonghoangdev.com/api/auth/callback/google
     ```
   - Lưu ý: `cuonghoangdev.com` ≠ `www.cuonghoangdev.com` ≠ `cuongthai.com`

3. **Clear cache trình duyệt**:
   - Cmd+Shift+Delete → clear cookies + cache
   - Hoặc test trong Incognito

### GitHub trả `404 Not Found`

1. Verify `GITHUB_CLIENT_ID` đã set trên Vercel
2. Verify callback URL trên GitHub OAuth App:
   ```
   https://cuonghoangdev.com/api/auth/callback/github
   ```
3. Verify app chưa bị suspend (GitHub suspend nếu lâu không dùng)

### Email verification không gửi

1. **Kiểm tra logs Render**:
   - Vào Render dashboard → Logs
   - Tìm `[email] Resend error: ...` hoặc `[email] Failed to send: ...`
2. **Verify `RESEND_API_KEY` đúng**:
   - Bắt đầu bằng `re_`
   - Không có khoảng trắng thừa
3. **Verify domain** (nếu dùng domain tùy chỉnh):
   - Vào Resend dashboard → Domains → check status = "Verified"
4. **Test với sandbox sender**:
   ```
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```
   Nhưng chỉ gửi được tới email đã đăng ký tài khoản Resend.

### Login fail với "Email chưa xác thực" mà đã verify rồi

1. Kiểm tra database:
   ```sql
   SELECT id, email, email_verified, email_verified_at FROM users WHERE email = '...';
   ```
2. Nếu `email_verified = false` dù đã click link:
   - Có thể token đã expire (24h)
   - Click "Gửi lại email xác thực" trong trang login

### Build fail sau khi update schema

```bash
cd /Users/admin/Downloads/api-backend
npx prisma generate
npx prisma db push   # Cho dev (HOẶC migrate cho prod)
npm run build
```

### Account bị khoá nhưng không phải do nhập sai

Check field `lockoutUntil` trong DB. Nếu > now(): thực sự bị khoá, đợi đến khi hết hạn hoặc manually reset:
```sql
UPDATE users SET failed_login_count = 0, lockout_until = NULL WHERE email = '...';
```

---

## Tóm tắt các bước cần làm NGAY

1. ✅ Lấy Google Client ID + Secret (mục 3)
2. ✅ Lấy GitHub Client ID + Secret (mục 4)
3. ✅ Đăng ký Resend + lấy API key (mục 5)
4. ✅ Set env trên Vercel (mục 6)
5. ✅ Set env trên Render (mục 7)
6. ✅ Redeploy cả 2
7. ✅ Test toàn bộ flow (mục 8)

Nếu gặp lỗi gì, check mục 9 trước khi báo lại.
