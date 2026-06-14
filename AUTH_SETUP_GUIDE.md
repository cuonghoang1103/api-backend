# Hướng dẫn Setup Auth bảo mật cao + OAuth Google/GitHub

> **Cập nhật**: 2026-06-14
> **Phạm vi**: Bảo mật tài khoản (email verify, password mạnh, lockout) + sửa lỗi OAuth Google/GitHub
> **Môi trường**: **VPS riêng** (160.187.1.208) chạy Docker — domain chính là `cuongthai.com`
> **Triển khai**: Giai đoạn 1 đã xong. Giai đoạn 2 (2FA, refresh token rotation) sẽ làm sau.

---

## Mục lục

1. [Lỗi OAuth hiện tại](#1-lỗi-oauth-hiện-tại)
2. [Đã làm gì trong commit này](#2-đã-làm-gì-trong-commit-này)
3. [Setup Google OAuth credentials](#3-setup-google-oauth-credentials)
4. [Setup GitHub OAuth credentials](#4-setup-github-oauth-credentials)
5. [Setup Resend (email)](#5-setup-resend-email)
6. [Cập nhật env trên VPS](#6-cập-nhật-env-trên-vps)
7. [Deploy](#7-deploy)
8. [Test toàn bộ flow](#8-test-toàn-bộ-flow)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Lỗi OAuth hiện tại

### Lỗi 1: Google trả `400 invalid_request: Missing required parameter: client_id`
- **Nguyên nhân**: `GOOGLE_CLIENT_ID` rỗng trong file `/opt/cuonghoangdev/.env` → NextAuth build URL thiếu param
- **Fix**: Thêm `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` vào env file (xem mục 6)

### Lỗi 2: GitHub trả `404 Not Found`
- **Nguyên nhân**: Tương tự — `GITHUB_CLIENT_ID` rỗng → GitHub không nhận diện được app
- **Fix**: Thêm `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` vào env file

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
| `src/app/api/auth/oauth/token/route.ts` | Fix `BACKEND_URL` đọc từ env (VPS cũng dùng được) |

### Config
| File | Thay đổi |
|---|---|
| `package.json` | Thêm dependency `resend` |
| `.env.example` (backend) | Thêm section Resend |
| `frontend/.env.example` | Hướng dẫn chi tiết setup Google + GitHub OAuth |
| `docker-compose.yml` | **CẦN CẬP NHẬT** — thêm env Resend + `RESEND_API_KEY` (xem mục 6) |

> ⚠️ **Quan trọng**: Tôi CHƯA update `docker-compose.yml` vì cần bạn xác nhận trước — xem mục 6 bước 6.3.

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
   https://cuongthai.com
   https://www.cuongthai.com
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://cuongthai.com/api/auth/callback/google
   https://www.cuongthai.com/api/auth/callback/google
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
   - Homepage URL: `https://cuongthai.com`
   - Application description: `Portfolio & Learning Platform`
   - Authorization callback URL:
     ```
     https://cuongthai.com/api/auth/callback/github
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
2. Nhập domain: `cuongthai.com`
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

## 6. Cập nhật env trên VPS

> **Mọi biến môi trường production nằm trong `/opt/cuonghoangdev/.env`** — đây là file duy nhất, được load bởi `docker-compose.yml` (line 95: `env_file:`) và bởi `scripts/deploy-vps.sh`.

### Bước 6.1: SSH vào VPS

```bash
ssh -i ~/.ssh/id_rsa root@160.187.1.208
```

### Bước 6.2: Backup file env hiện tại

```bash
cp /opt/cuonghoangdev/.env /opt/cuonghoangdev/.env.bak.$(date +%Y%m%d-%H%M%S)
```

### Bước 6.3: Edit env file

```bash
nano /opt/cuonghoangdev/.env
```

Thêm/cập nhật các dòng sau:

```bash
# ─── NextAuth (bắt buộc) ──────────────────────────────
NEXTAUTH_URL=https://cuongthai.com
AUTH_SECRET=<openssl rand -base64 32>

# ─── OAuth Google ──────────────────────────────────────
GOOGLE_CLIENT_ID=<client-id-từ-bước-3.2>
GOOGLE_CLIENT_SECRET=<client-secret-từ-bước-3.2>

# ─── OAuth GitHub ──────────────────────────────────────
GITHUB_CLIENT_ID=<client-id-từ-bước-4.1>
GITHUB_CLIENT_SECRET=<client-secret-từ-bước-4.1>

# ─── Resend (email) ────────────────────────────────────
RESEND_API_KEY=<api-key-từ-bước-5.3>
RESEND_FROM_EMAIL=CuongHoangDev <noreply@cuongthai.com>

# ─── Admin (đã có sẵn) ─────────────────────────────────
ADMIN_EMAILS=cuongthaihnhe176322@gmail.com
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`.

### Bước 6.4: Generate `AUTH_SECRET`

Trên VPS (hoặc local rồi paste):

```bash
openssl rand -base64 32
# Output ví dụ: 7xK9mP2vL8nQ4wR6yT3jH1fD5sB0aC9eG2hI4jK6lM8=
```

Dùng giá trị output làm `AUTH_SECRET`.

### Bước 6.5: Cập nhật docker-compose.yml

Vẫn ở trên VPS:

```bash
cd /home/deployer/repo
nano docker-compose.yml
```

Thêm/cập nhật 2 dòng sau vào service `backend`:

```yaml
  backend:
    environment:
      # ... các env hiện có ...
      RESEND_API_KEY: ${RESEND_API_KEY:-}
      RESEND_FROM_EMAIL: ${RESEND_FROM_EMAIL:-noreply@cuongthai.com}
```

Và 1 dòng vào service `frontend`:

```yaml
  frontend:
    environment:
      # ... các env hiện có ...
      BACKEND_URL: ${NEXT_PUBLIC_API_URL:-https://api.cuongthai.com}
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`.

> 💡 **Tại sao cần `BACKEND_URL` cho frontend?** Route `/api/auth/oauth/token` trong frontend Next.js cần gọi sang backend Node.js để lấy JWT mới (cookie `backend_token`). Trong Docker thì gọi qua tên service `http://backend:3001` (đã có sẵn ở `INTERNAL_BACKEND_URL`). Nhưng fix gần đây đã ưu tiên `BACKEND_URL` env để linh hoạt hơn.

### Bước 6.6: Verify lại bằng cách check container env

Sau khi deploy (bước 7), verify env đã load:

```bash
ssh -i ~/.ssh/id_rsa root@160.187.1.208 \
  "cd /home/deployer/repo && docker compose -p repo exec backend printenv | grep -E 'GOOGLE|GITHUB|RESEND|AUTH_SECRET'"
```

Phải thấy các biến có giá trị, không phải rỗng.

---

## 7. Deploy

Sau khi commit code mới (đã làm xong), chạy lệnh deploy như bình thường (xem `DEPLOY-FASTER.md`):

```bash
git push origin main && \
rsync -avz -e "ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no" \
  --exclude "node_modules" --exclude ".git" --exclude ".next" \
  --exclude "dist" --exclude "*.log" \
  --exclude ".env" --exclude ".env.local" --exclude ".env.production" \
  --exclude "coverage" \
  ./ root@160.187.1.208:/home/deployer/repo/ && \
ssh -i ~/.ssh/id_rsa -o BatchMode=yes root@160.187.1.208 \
  "cd /home/deployer/repo && bash scripts/deploy-vps.sh"
```

**Lưu ý**:
- Lần đầu build sẽ chậm hơn (~3-5 phút) vì đổi `package.json` (thêm `resend`).
- Schema mới (User + EmailVerificationToken) sẽ tự apply bởi `prisma db push` trong script.
- Health check tự động verify backend sẵn sàng.

### ⚠️ QUAN TRỌNG: User cũ sẽ bị block login

Sau khi `prisma db push`, tất cả user hiện tại sẽ có `email_verified = false` → không login được. Có 2 cách xử lý:

**Cách 1** (khuyến nghị): Tự động verify user OAuth và admin ngay sau migrate.

SSH vào VPS:
```bash
ssh -i ~/.ssh/id_rsa root@160.187.1.208
cd /home/deployer/repo
docker compose -p repo exec postgres psql -U postgres -d cuonghoangdev_db
```

Rồi chạy:
```sql
-- Auto-verify user đã từng login bằng OAuth
UPDATE users SET email_verified = true, email_verified_at = NOW()
WHERE provider IS NOT NULL AND provider != '';

-- Auto-verify user là admin (theo ADMIN_EMAILS trong env)
UPDATE users SET email_verified = true, email_verified_at = NOW()
WHERE email = 'cuongthaihnhe176322@gmail.com';

-- (Tuỳ chọn) Auto-verify TẤT CẢ user cũ — rủi ro thấp nếu đây là portfolio cá nhân
-- UPDATE users SET email_verified = true, email_verified_at = NOW();

\q
```

**Cách 2** (an toàn nhất): Giữ `email_verified = false`, mỗi user phải click link verify trong email lần đầu login. Nhưng cần SMTP hoạt động trước — Resend phải có API key đúng.

---

## 8. Test toàn bộ flow

### Test 1: Đăng ký tài khoản credentials
1. Vào https://cuongthai.com/register
2. Điền form với password mạnh (vd: `MyP@ssw0rd2026!`)
3. Submit → màn hình "Check your email"
4. Mở email → click link xác thực
5. Redirect về `/login` với thông báo thành công
6. Đăng nhập → vào trang chủ

### Test 2: Đăng nhập Google
1. Vào https://cuongthai.com/login
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

1. **Kiểm tra env trong container**:
   ```bash
   ssh root@160.187.1.208 "cd /home/deployer/repo && \
     docker compose -p repo exec frontend printenv | grep GOOGLE"
   ```
   Nếu rỗng → check `/opt/cuonghoangdev/.env` có dòng `GOOGLE_CLIENT_ID=...` chưa.

2. **Kiểm tra redirect URI**:
   - Vào Google Cloud Console → Credentials → OAuth Client
   - Authorized redirect URIs phải CHÍNH XÁC là:
     ```
     https://cuongthai.com/api/auth/callback/google
     ```
   - Lưu ý: `cuongthai.com` ≠ `www.cuongthai.com` (phải add cả 2)

3. **Check log frontend**:
   ```bash
   ssh root@160.187.1.208 "cd /home/deployer/repo && \
     docker compose -p repo logs --tail=200 frontend | grep -E 'nextauth|oauth'"
   ```
   Sẽ thấy warning nếu env rỗng.

4. **Clear cache trình duyệt**:
   - Cmd+Shift+Delete → clear cookies + cache
   - Hoặc test trong Incognito

### GitHub trả `404 Not Found`

1. Verify `GITHUB_CLIENT_ID` đã có trong container:
   ```bash
   ssh root@160.187.1.208 "cd /home/deployer/repo && \
     docker compose -p repo exec frontend printenv | grep GITHUB"
   ```
2. Verify callback URL trên GitHub OAuth App:
   ```
   https://cuongthai.com/api/auth/callback/github
   ```
3. Verify app chưa bị suspend (GitHub suspend nếu lâu không dùng)

### Email verification không gửi

1. **Kiểm tra logs backend**:
   ```bash
   ssh root@160.187.1.208 "cd /home/deployer/repo && \
     docker compose -p repo logs --tail=200 backend | grep -E 'email|Resend'"
   ```
2. **Verify `RESEND_API_KEY` đúng**:
   ```bash
   ssh root@160.187.1.208 "cd /home/deployer/repo && \
     docker compose -p repo exec backend printenv RESEND_API_KEY"
   ```
   Phải bắt đầu bằng `re_`, không có khoảng trắng.
3. **Verify domain** (nếu dùng domain tùy chỉnh):
   - Vào Resend dashboard → Domains → check status = "Verified"
4. **Test với sandbox sender**:
   ```bash
   # Trên VPS
   nano /opt/cuonghoangdev/.env
   # Sửa: RESEND_FROM_EMAIL=onboarding@resend.dev
   # Rồi restart:
   cd /home/deployer/repo && docker compose -p repo restart frontend backend
   ```
   Nhưng chỉ gửi được tới email đã đăng ký tài khoản Resend.

### Login fail với "Email chưa xác thực" mà đã verify rồi

1. Check database:
   ```bash
   ssh root@160.187.1.208 "cd /home/deployer/repo && \
     docker compose -p repo exec postgres psql -U postgres -d cuonghoangdev_db \
     -c \"SELECT id, email, email_verified, email_verified_at FROM users WHERE email = '...'\""
   ```
2. Nếu `email_verified = false` dù đã click link:
   - Có thể token đã expire (24h)
   - Click "Gửi lại email xác thực" trong trang login

### Account bị khoá nhưng không phải do nhập sai

Check field `lockoutUntil` trong DB:
```bash
ssh root@160.187.1.208 "cd /home/deployer/repo && \
  docker compose -p repo exec postgres psql -U postgres -d cuonghoangdev_db \
  -c \"SELECT email, failed_login_count, lockout_until FROM users WHERE email = '...'\""
```

Nếu `lockout_until > now()`: thực sự bị khoá, đợi hết hạn hoặc manually reset:
```sql
UPDATE users SET failed_login_count = 0, lockout_until = NULL WHERE email = '...';
```

### Frontend vẫn gọi `http://backend:3001` (lỗi khi dev local ngoài Docker)

Đó là **bình thường** khi chạy dev ngoài Docker. Trong Docker thì `backend` là tên service nội bộ. Nếu muốn dev local mà vẫn gọi đúng:

Tạo `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
INTERNAL_BACKEND_URL=http://localhost:3001
```

---

## Tóm tắt các bước cần làm NGAY

| # | Bước | Mất thời gian |
|---|---|---|
| 1 | Lấy Google Client ID + Secret (mục 3) | ~5 phút |
| 2 | Lấy GitHub Client ID + Secret (mục 4) | ~3 phút |
| 3 | Đăng ký Resend + lấy API key (mục 5) | ~10 phút (verify DNS có thể chậm hơn) |
| 4 | Update `/opt/cuonghoangdev/.env` trên VPS (mục 6.3) | ~2 phút |
| 5 | Update `docker-compose.yml` trên VPS (mục 6.5) | ~2 phút |
| 6 | Auto-verify user cũ trong DB (mục 7) | ~1 phút |
| 7 | Deploy như bình thường (mục 7) | ~3-5 phút (cold build vì đổi package.json) |
| 8 | Test toàn bộ flow (mục 8) | ~5 phút |

Nếu gặp lỗi gì, check mục 9 trước khi báo lại.
