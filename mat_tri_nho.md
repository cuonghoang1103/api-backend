# 🧠 MAT_TRI_NHO.md — SỔ TAY TIẾP QUẢN DỰ ÁN

> **Mục đích**: File này được viết bởi "bạn hôm nay" (Cursor Assistant phiên hôm nay) để giao lại cho "bạn ngày mai" (Cursor Assistant phiên tiếp theo, sau khi mất trí nhớ) — hoặc cho bất kỳ AI assistant khác — để tiếp tục công việc mà **không phá hỏng những phần đang hoạt động bình thường**.
>
> **Ngày tạo**: 2026-06-17 (UTC+7)
> **Cập nhật cuối**: 2026-06-17 20:40
> **Branch hiện tại**: `main`
> **Trạng thái deploy**: ✅ Production tại `https://cuongthai.com`

---

## 🚨 PHẦN 0: TRƯỚC KHI SỬA BẤT KỲ THỨ GÌ — HÃY ĐỌC

### 0.1. Nguyên tắc vàng (GOLDEN RULES)

> 🔴 **KHÔNG BAO GIỜ** sửa code mà không hiểu nó đang làm gì.
> 🟡 **LUÔN LUÔN** test trên dev/staging trước khi deploy production.
> 🟢 **KHI NGHI NGỜ** → hỏi user, đọc lại docs, đọc lại comment trong code.

### 0.2. Câu thần chú khi mất trí nhớ

```
Nếu bạn là AI Assistant mới vừa đọc file này và đang chuẩn bị sửa code:

1. ĐỪNG vội vàng — đọc file mat_tri_nho.md này từ đầu đến cuối
2. Mở Tong_du_an.md (file 4776 dòng) để hiểu kiến trúc tổng thể
3. Mở Error_Sum.md, LOI_DA_FIX.md, fix_update.md, loi_thuong_gap.md để hiểu lịch sử bug
4. Đọc .cursorrules (workspace rule) để hiểu coding conventions
5. Khi sửa code, CHẠY npm run build ở frontend + backend để verify
6. Nếu thấy .env, secrets, hoặc tài khoản admin → ĐỪNG push lên GitHub
7. Nếu sửa middleware/auth → test kỹ auth flow trước khi commit
8. Nếu thay đổi DB schema → chạy prisma generate + tạo migration mới
```

### 0.3. Câu hỏi cần hỏi "bạn hôm nay" trước khi sửa

Nếu bạn (AI mới) cần sửa gì đó mà không rõ, hãy hỏi user những câu này:

```
1. "Anh/chị muốn sửa bug gì? Cho em xem console.error + URL + steps to reproduce."
2. "Đây là production hay dev? Có thể chạy lại trên local để debug trước không?"
3. "Anh/chị đã thử restart backend container chưa? (CuongHoangDev thường bị stale dist)"
4. "Có cần thay đổi DB schema không? Nếu có nhớ chạy prisma generate."
5. "Sau khi sửa, deploy workflow chính là backend-vps.yml. Em push lên main nhé?"
```

---

# 📋 PHẦN I: TỔNG QUAN DỰ ÁN (Project Overview)

## 1.1. Định danh dự án

| Field | Value |
|---|---|
| **Tên dự án** | CuongHoangDev (Portfolio + Blog + LMS + Shop) |
| **Domain chính** | `https://cuongthai.com` |
| **API domain** | `https://api.cuongthai.com` (proxied qua nginx) |
| **Repo path** | `/Users/admin/Downloads/api-backend` |
| **Admin email** | `cuongthaihnhe176322@gmail.com` |
| **Admin username** | `admin` (env: `ADMIN_EMAILS=...`, `ADMIN_USERNAME=admin`) |
| **Tác giả** | CuongHoangDev (sinh viên năm cuối) |
| **Tech stack chính** | Next.js 14 + Express + Prisma + PostgreSQL + Redis + Docker |
| **Số commits** | **510+ commits** |
| **Số Prisma models** | **74 models** |
| **Backend code** | ~21,500 dòng TS |
| **Frontend code** | ~77,000 dòng TS/TSX |
| **Schema lines** | 1,789 dòng prisma schema |
| **Tài liệu** | 12+ file .md (Tong_du_an.md 4776 dòng, Tien_do_du_an.md, etc.) |

## 1.2. 4 Services trong Docker Compose

```
┌─────────────────────────────────────────────────────────────┐
│  Docker Compose project: "cuonghoangdev"                    │
│  Network: backend (bridge, name: cuonghoangdev_network)     │
├─────────────────────────────────────────────────────────────┤
│  Container name                │ Image              │ Port  │
├─────────────────────────────────────────────────────────────┤
│  cuonghoangdev_postgres       │ postgis/postgis:16  │ 5432  │
│  cuonghoangdev_redis          │ redis:7-alpine     │ 6379  │
│  cuonghoangdev_backend        │ custom (Node 22)   │ 3001  │
│  cuonghoangdev_frontend       │ custom (Next.js)   │ 3000  │
│  cuonghoangdev_nginx          │ nginx:1.27-alpine  │ 80/443│
└─────────────────────────────────────────────────────────────┘
```

## 1.3. URL Mapping (Nginx → Service)

```
cuongthai.com:443     → frontend:3000  (Next.js SSR/RSC)
cuongthai.com/api/v1/ → backend:3001   (Express API)
cuongthai.com/uploads/* → nginx static (alias to /var/www/cuongthai.com/uploads)
cuongthai.com/socket.io/ → backend:3001 (WebSocket)
cuongthai.com/monitoring/ → Sentry tunnel (Next.js config)
```

## 1.4. Host paths trên VPS

```
/opt/cuonghoangdev/                ← Project root
/opt/cuonghoangdev/.env             ← Production env (CONFIDENTIAL)
/opt/cuonghoangdev/dist/            ← Compiled backend (TypeScript → JS)
/opt/cuonghoangdev/frontend/.next/  ← Built Next.js
/opt/cuonghoangdev/postgres/        ← PostgreSQL data (bind mount)
/opt/cuonghoangdev/redis/           ← Redis data (bind mount)
/opt/cuonghoangdev/uploads/         ← User uploads (bind mount)
/opt/cuonghoangdev/backups/         ← DB backups (cron: 0 2 * * *)
/opt/certbot/conf/                  ← Let's Encrypt certificates
/opt/certbot/www/                   ← ACME challenges
```

---

# 🏗️ PHẦN II: KIẾN TRÚC & TECH STACK (QUAN TRỌNG!)

## 2.1. Backend Stack (`src/`)

### Ngôn ngữ & Runtime
- **TypeScript 5.6** (strict mode)
- **Node.js 22** (engines: `>=20.0.0`)
- **ESM modules** (`"type": "module"` trong package.json)
- **tsx** cho dev hot-reload
- **tsc** cho build → output ở `dist/`

### Framework & Libraries chính
| Library | Version | Mục đích |
|---|---|---|
| **Express 4.21** | 4.21.0 | HTTP server |
| **Prisma 5.22** | 5.22.0 | ORM (PostgreSQL) |
| **@prisma/client** | 5.22.0 | Database client |
| **Socket.IO 4.8** | 4.8.3 | Real-time messaging |
| **jsonwebtoken 9** | 9.0.2 | JWT auth |
| **bcryptjs 2.4** | 2.4.3 | Password hashing |
| **ioredis 5** | 5.4.1 | Redis cache |
| **redis 4** | 4.7.1 | Alternative Redis client |
| **@sentry/node 7.120** | 7.120.4 | Error tracking |
| **multer 1.4** | 1.4.5-lts.1 | File upload (multipart) |
| **vnpay 2.5** | 2.5.0 | VNPay payment SDK |
| **resend 6.12** | 6.12.4 | Transactional email |
| **openai 4.77** | 4.77.0 | OpenAI-compatible (Groq, OpenRouter) |
| **@xenova/transformers 2.17** | 2.17.2 | Local ONNX embeddings |
| **fluent-ffmpeg 2.1** | 2.1.3 | Video/audio processing |
| **zod 3.23** | 3.23.8 | Schema validation |
| **helmet 8** | 8.0.0 | Security headers |
| **cors 2.8** | 2.8.5 | CORS handling |
| **compression 1.7** | 1.7.4 | Gzip response |
| **express-rate-limit 7.4** | 7.4.1 | Rate limiting |
| **node-cron 3** | 3.0.3 | Scheduled jobs |
| **nanoid 5** | 5.0.7 | ID generation |
| **slugify 1.6** | 1.6.6 | URL slug generation |
| **uuid 10** | 10.0.0 | UUID generation |

### Cấu trúc thư mục `src/`
```
src/
├── index.ts               ← ENTRY POINT (Express setup, middleware, routes)
├── config/
│   ├── env.ts             ← Zod env validation (REQUIRED in prod)
│   ├── database.ts        ← Prisma client singleton
│   └── redis.ts           ← Redis client + helpers
├── middleware/
│   ├── auth.ts            ← authenticate, requireRole, requireAdmin, extractToken
│   ├── captcha.ts         ← captchaMiddleware + softCaptchaMiddleware
│   ├── errorHandler.ts    ← AppError class + global error handler
│   ├── validate.ts        ← Zod validation middleware
│   └── vnpayIpnGuard.ts   ← VNPay IPN security guard
├── routes/                ← 28 route files (Express Router)
│   ├── auth.routes.ts     ← Login, register, OTP
│   ├── admin.routes.ts    ← Admin CRUD endpoints
│   ├── ai.routes.ts       ← AI chat (streaming SSE)
│   ├── messages.routes.ts ← Direct messaging REST
│   ├── payment.routes.ts  ← VNPay integration
│   ├── music.routes.ts + music-admin.routes.ts
│   ├── courses, blog, social, etc.
├── services/              ← 18 service files
│   ├── ai.service.ts      ← RAG + Groq streaming
│   ├── aiProviders.ts     ← Multi-provider fallback (circuit breaker!)
│   ├── auth.service.ts    ← JWT + bcrypt + OTP
│   ├── messages.service.ts← Direct messaging logic
│   ├── payment.service.ts ← VNPay IPN handler
│   ├── email.service.ts   ← Resend + SMTP fallback
│   ├── ffmpeg.service.ts  ← Audio/video processing
│   └── ... (cron, captcha, github, embedQueue, sentry, social, upload)
├── socket/
│   └── messaging.socket.ts← Socket.IO server for DMs
├── utils/
│   ├── cidr.ts            ← IP CIDR matcher
│   └── dashboard.ts       ← Dashboard helpers
└── types/                 ← TypeScript type definitions
```

## 2.2. Frontend Stack (`frontend/`)

### Framework & Libraries chính
| Library | Version | Mục đích |
|---|---|---|
| **Next.js 14.2.15** | 14.2.15 | App Router, RSC, SSR |
| **React 18.3** | 18.3.1 | UI library |
| **TypeScript 5.6** | 5.6.3 | Type safety |
| **TailwindCSS 3.4** | 3.4.14 | Utility CSS |
| **next-intl 4.13** | 4.13.0 | i18n (vi/en) |
| **next-auth 5 beta** | 5.0.0-beta.31 | NextAuth (auth sessions) |
| **@tanstack/react-query 5.101** | 5.101.0 | Data fetching + cache |
| **zustand 4.5** | 4.5.5 | State management (12 stores) |
| **axios 1.7** | 1.7.7 | HTTP client |
| **framer-motion 11.9** | 11.9.0 | Animations |
| **lucide-react 0.453** | 0.453.0 | Icons |
| **socket.io-client 4.8** | 4.8.3 | Real-time client |
| **@sentry/nextjs 7.120** | 7.120.4 | Error tracking |
| **react-hook-form 7.53** | 7.53.0 | Form state |
| **react-markdown 9** | 9.1.0 | Markdown rendering |
| **react-syntax-highlighter 15.6** | 15.6.1 | Code highlighting |
| **react-player 3.4** | 3.4.0 | Video player |
| **jspdf 4.2** | 4.2.1 | PDF generation (certificates) |
| **lottie-react 2.4** | 2.4.1 | Lottie animations |
| **googleapis 173** | 173.0.0 | Google APIs (Indexing) |
| **zod 3.23** | 3.23.8 | Validation |
| **sonner 1.7** | 1.7.0 | Toast notifications |
| **dompurify 3.4** | 3.4.10 | HTML sanitization |
| **sharp 0.34** | 0.34.3 | Image optimization |
| **tailwind-merge 2.5** | 2.5.4 | Class name merging |

### Cấu trúc `frontend/src/`
```
frontend/src/
├── app/                          ← Next.js App Router (40+ routes)
│   ├── (auth)/                   ← Group: login, register pages
│   ├── admin/                    ← 20+ admin pages
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── courses/
│   │   ├── blog/
│   │   ├── music/
│   │   ├── social/
│   │   ├── messages/
│   │   ├── tech-trends/
│   │   ├── seo-tools/
│   │   └── ... 20+ admin routes
│   ├── api/                      ← Next.js API routes
│   │   ├── v1/                   ← Internal proxy to backend
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── index-url/            ← Google Indexing API
│   │   ├── music/
│   │   └── revalidate/
│   ├── blog/, cart/, certificates/, chat/, checkout/, courses/,
│   ├── dashboard/, dev-hub/, forgot-password/, games/, messages/,
│   ├── music/, my-courses/, my-orders/, oauth-callback/, offline/,
│   ├── payment/, profile/, projects/, repos/, reset-password/,
│   ├── shop/, social/, tech-trends/, uploads/, verify-email/, verify-otp/
│   ├── error.tsx, global-error.tsx
│   ├── layout.tsx, page.tsx (root)
│   ├── robots.ts, sitemap.ts
│
├── components/                   ← 25+ component folders
│   ├── admin/ (admin UI components)
│   ├── auth/ (login, register, OTP)
│   ├── blog/, cart/, chat/, course/, cyber/, dev-hub/
│   ├── games/, home/, layout/, messaging/, music/
│   ├── projects/, providers/, repos/, shop/, social/
│   ├── ui/ (generic UI: SafeImage, etc.)
│   ├── LanguageSwitcher.tsx
│   ├── LoginRequired.tsx
│   ├── OtpInput.tsx
│   └── TurnstileWidget.tsx
│
├── hooks/                        ← 6 custom hooks
│   ├── useAuth.ts
│   ├── useChatSSE.ts             ← Server-Sent Events for AI chat
│   ├── useAudioAnalyser.ts
│   ├── useAudioStream.ts
│   ├── useMusicQueries.ts
│   └── useTranslation.ts
│
├── lib/                          ← 11 lib files
│   ├── api.ts                    ← ALL API endpoints (authApi, musicApi, etc.)
│   ├── server-api.ts             ← Server-side API URL resolver
│   ├── api/ (subfolder)
│   ├── auth.ts                   ← Client auth helpers
│   ├── socket.ts                 ← Socket.IO client
│   ├── constants.ts
│   ├── formatDate.ts
│   ├── invoice.ts
│   ├── markdown.ts
│   ├── repos.ts
│   ├── ssrSafeStorage.ts         ← SSR-safe localStorage wrapper
│   ├── youtube-player.ts
│   └── ai-static-responses.ts
│
├── store/                        ← 12 Zustand stores
│   ├── authStore.ts              ← Auth state (with persist)
│   ├── cartStore.ts
│   ├── chatStore.ts
│   ├── discountStore.ts
│   ├── messagingStore.ts
│   ├── musicStore.ts
│   ├── orderStore.ts
│   ├── playlistStore.ts
│   ├── productStore.ts
│   ├── projectStore.ts
│   ├── socialStore.ts
│   └── ssrSafeStorage.ts
│
├── config/                       ← App configuration
├── context/                      ← React contexts
├── data/                         ← Static data
├── styles/                       ← Global styles
└── types/                        ← TypeScript types
```

## 2.3. Database (PostgreSQL + PostGIS)

- **Image**: `postgis/postgis:16-3.4`
- **Extensions**: PostGIS (chuẩn bị cho geospatial)
- **Vector storage**: JSONB column (KHÔNG dùng pgvector — vì Docker image không bundle pgvector)
- **74 Prisma models** — quá nhiều để liệt kê, xem `prisma/schema.prisma`
- **7 migrations** trong `prisma/migrations/`:
  - `20260616_add_course_order_payment`
  - `20260616_course_order_coupon`
  - `20260616_course_order_idempotency`
  - `20260616_course_order_refund`
  - `20260616_dashboard_models`
  - `20260616_github_repo_hub`
  - `20260617_tech_trend_articles`

### 1 model quan trọng KHÔNG có trong schema.prisma (raw SQL)

**`document_chunks`** — bảng cho RAG AI:
```sql
CREATE TABLE IF NOT EXISTS document_chunks (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  chunk_index INTEGER NOT NULL,
  document_id VARCHAR(100) NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  embedding JSONB  -- 384-dim float array (Xenova/all-MiniLM-L6-v2)
);
-- Tự động tạo bởi src/index.ts khi startup
```

## 2.4. AI Architecture (Quan trọng - 1 dự án con)

### Multi-Provider Fallback (Circuit Breaker)

```
User gửi message
    ↓
AIService.streamChat()  (src/services/ai.service.ts)
    ↓
getRAGContext()  →  Lấy context từ document_chunks (semantic search)
    ↓
Provider thử: Groq (ưu tiên 1)
    ↓ nếu fail
Provider thử: OpenRouter (ưu tiên 2)
    ↓ nếu fail
Provider thử: OpenAI (ưu tiên 3)
    ↓ nếu fail
Throw AppError(503, "AI_ALL_PROVIDERS_FAILED")
```

### Circuit Breaker Logic (src/services/aiProviders.ts)

- Sau **2 lần fail liên tiếp** → mở circuit (skip provider đó)
- Cooldown duration theo loại lỗi:
  - 401/403 (auth): **5 phút**
  - 429 (rate limit): **60s**
  - 5xx/timeout: **60s**
  - 408 (timeout): **30s**
  - Default: **45s**
- Sau cooldown → "half-open" (cho thử 1 lần). Nếu OK → close circuit
- State lưu **in-memory** (không persist) — reset khi restart

### Embedding Model (Local)

- **Model**: `Xenova/all-MiniLM-L6-v2` (Transformers.js)
- **Dimensions**: 384
- **Caching**: `/app/.cache/transformers` (trong container)
- **Tại sao local**: API key Gemini không đáng tin cậy + muốn tiết kiệm
- **Lazy load**: `@xenova/transformers` được import động để tránh crash Alpine (musl vs glibc)

### RAG Document Chunks

- Lưu trong `document_chunks` table (JSONB, không phải pgvector)
- Index khi admin upload tài liệu qua `/api/v1/ai/admin/documents`
- Chunking: max 1000 chars, overlap 200 chars, tại ranh giới câu/đoạn

## 2.5. Auth Flow (PHẢI HIỂU!)

### Token sources (read theo thứ tự trong `extractToken()`)

```
1. Authorization: Bearer <token>  (header)
2. Cookie backend_token           (httpOnly)
3. ?token=...                     (query param - for SSE)
4. Raw Cookie header (manual parse cho Socket.IO)
```

### Role-based access

- `authenticate` middleware: parse JWT → gắn `req.user`
- `requireRole(...roles)`: check role + refresh roleVersion từ DB (CHỐNG stale session)
- `requireAdmin(role)`: tương tự nhưng chỉ cho admin
- `requireCyberProfile()`: auto-upsert CyberProfile + CyberInventory

### Roles trong DB
- `ROLE_USER`: user thường
- `ROLE_ADMIN`: admin (full quyền)
- `ROLE_INSTRUCTOR`: instructor (course management)

### Captcha (Cloudflare Turnstile)

- 2 modes: `captchaMiddleware` (strict) + `softCaptchaMiddleware` (soft)
- Bypass cho: ADMIN_EMAILS + email_verified users
- Master switch: `CAPTCHA_REQUIRED=false` trong env
- Token gửi trong: header `cf-turnstile-response` hoặc body field

### OTP flow

- `/api/v1/auth/register` → gửi OTP qua email (Resend) → `/api/v1/auth/verify-email-otp`
- `/api/v1/auth/forgot-password` → gửi OTP → `/api/v1/auth/reset-password-otp`
- OTP lưu trong DB với TTL (thường 10-15 phút)

## 2.6. Direct Messaging (Socket.IO + REST)

- **Transport**: WebSocket (qua Nginx proxy `/socket.io/`)
- **Auth**: parse Cookie header manually trên Socket.IO handshake
- **Features**:
  - User ↔ Admin thread
  - User ↔ User thread
  - Real-time presence (online users)
  - Read receipts
  - Reactions (emoji)
  - File attachments
  - Message recall (thu hồi)
  - Nickname (đặt biệt danh trong thread)
  - Unread count badge
- **Tables mới**: `MessageThread`, `Message`, `MessageReaction`, `ThreadNickname`, `MessageRead` (KHÔNG phải tất cả có trong schema.prisma — có cái được thêm bằng raw SQL)

## 2.7. VNPay Payment Flow

### Endpoints

- `POST /api/v1/payments/course` → Tạo order + return VNPay paymentUrl
- `GET  /api/v1/payments/vnpay/return` → User redirect về sau thanh toán
- `POST /api/v1/payments/vnpay/ipn` → VNPay server-to-server callback
- `GET  /api/v1/payments/order/:code` → Poll status
- Admin: `/api/v1/payments/admin/orders`, `/refund`, `/enrollment`

### Idempotency

- Client generate `idempotencyKey` (UUIDv4)
- Backend lưu theo key → retry trả về cùng order (không tạo 2)

### IPN Security (3 layers)

1. **User-Agent check**: phải chứa "VNPay" (case-insensitive)
2. **IP allowlist**: `203.171.20.0/24`, `123.30.235.0/24`, `113.161.69.0/24`, ...
3. **Payload size**: < 4KB

`vnpayIpnGuard` middleware enforce tất cả.

### Sandbox vs Production

- `VNPAY_SANDBOX=1` → skip IP check (dev only)
- `VNPAY_SANDBOX=0` (hoặc unset) → enforce IP allowlist (production)

## 2.8. CI/CD Workflows (12 workflows!)

### Main workflows

| File | Trigger | Mục đích |
|---|---|---|
| `backend-vps.yml` | push to main | **DEPLOY CHÍNH** (compile TS, sync VPS, inject dist, restart containers, setup cron) |
| `restart-containers.yml` | manual | Restart tất cả containers |
| `sync-frontend.yml` | manual | Sync frontend .next lên VPS |

### Debug workflows (rất nhiều - dấu hiệu dự án đã trải qua nhiều sự cố!)

| File | Mục đích |
|---|---|
| `vps-debug.yml` | General debug |
| `vps-debug-nginx.yml` | Debug nginx issues |
| `vps-check-ai.yml` | Check AI providers |
| `vps-dump-env.yml` | Dump env vars (debug) |
| `vps-fix-secrets.yml` | Fix missing secrets |
| `vps-force-restart.yml` | Force restart all containers |
| `vps-restart-nginx.yml` | Restart nginx only |
| `vps-fix-nginx.yml` | Fix nginx (recreate) |

### GitHub Secrets cần có (12+)

```
VPS_SSH_PRIVATE_KEY          ← SSH key (base64)
VPS_HOST                     ← VPS IP/hostname
VPS_USER                     ← SSH user (e.g. "root")
POSTGRES_PASSWORD            ← DB password
JWT_SECRET                   ← JWT secret (32+ chars)
JWT_REFRESH_SECRET           ← Refresh secret (32+ chars)
COOKIE_SECRET                ← Cookie signing secret
SIGNED_URL_SECRET            ← Signed URL secret
GROQ_API_KEY                 ← Groq API key
OPENAI_API_KEY               ← OpenAI API key
OPENROUTER_API_KEY           ← OpenRouter key (optional)
YOUTUBE_API_KEY              ← YouTube Data API v3
SENTRY_DSN                   ← Sentry DSN (optional)
NEXT_PUBLIC_SENTRY_DSN       ← Frontend Sentry DSN
SENTRY_AUTH_TOKEN            ← Sentry source maps upload
```

---

# ⚙️ PHẦN III: BIẾN MÔI TRƯỜNG (.env)

## 3.1. Biến BẮT BUỘC (Required in production - throws on startup)

```bash
# Server
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL="postgresql://postgres:PASSWORD@postgres:5432/cuonghoangdev_db?schema=public"

# JWT (each MUST be 32+ chars)
JWT_SECRET="CuongHoangDevV2SecretKeyNangCao2026NheMaNayCanItNhat256BitNhe"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_SECRET="CuongHoangDevRefreshSecret2026NheMaNayCanItNhat256BitNhe"
JWT_REFRESH_EXPIRES_IN="7d"

# Cookie & Signed URL
COOKIE_SECRET="..."   # 32+ chars
SIGNED_URL_SECRET="..." # 32+ chars
```

## 3.2. Biến QUAN TRỌNG (functionality)

```bash
# Frontend URL (CORS)
FRONTEND_URL="https://cuongthai.com"
ALLOWED_ORIGINS="https://cuongthai.com,https://www.cuongthai.com"

# Admin
ADMIN_EMAILS="cuongthaihnhe176322@gmail.com"
ADMIN_USERNAME="admin"

# File upload
UPLOAD_DIR="/app/uploads"
MAX_FILE_SIZE_IMAGES=10485760      # 10MB
MAX_FILE_SIZE_AUDIO=104857600      # 100MB
MAX_FILE_SIZE_VIDEO=524288000      # 500MB
MAX_FILE_SIZE_DOCUMENT=52428800    # 50MB

# Rate limit
RATE_LIMIT_WINDOW_MS=900000        # 15 phút
RATE_LIMIT_MAX_REQUESTS=100

# CAPTCHA (Turnstile)
CAPTCHA_REQUIRED="true"            # set "false" để tắt globally
TURNSTILE_SECRET_KEY="..."         # Cloudflare secret

# AI providers (ít nhất 1 phải có)
GROQ_API_KEY="gsk_..."
GROQ_CHAT_MODEL="llama-3.1-8b-instant"
OPENROUTER_API_KEY="sk-or-..."
OPENROUTER_CHAT_MODEL="meta-llama/llama-3.1-8b-instruct:free"
OPENAI_API_KEY="sk-..."
OPENAI_CHAT_MODEL="gpt-4o-mini"
GEMINI_API_KEY="..."               # dùng cho embeddings (optional, có local fallback)

# AI config
AI_CHAT_MODEL="llama-3.1-8b-instant"
AI_EMBEDDING_MODEL="gemini-embedding-002"
AI_EMBEDDING_DIMENSIONS=768
AI_MAX_TOKENS=2048
AI_TEMPERATURE=0.7
AI_CHUNK_SIZE=1000
AI_CHUNK_OVERLAP=200
AI_SIMILARITY_THRESHOLD=0.7

# Email
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="CuongHoangDev <noreply@cuongthai.com>"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="..."
SMTP_PASS="..."
SMTP_FROM="noreply@cuongthai.com"

# Contact form
CONTACT_ADMIN_EMAIL="cuongthaihnhe176322@gmail.com"

# YouTube
YOUTUBE_API_KEY="..."

# VNPay
VNPAY_TMN_CODE="..."
VNPAY_HASH_SECRET="..."
VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_RETURN_URL="https://cuongthai.com/payment/return"
VNPAY_IPN_URL="https://cuongthai.com/api/v1/payments/vnpay/ipn"
VNPAY_VERSION="2.1.0"
VNPAY_SANDBOX="1"                  # SET TO 0 IN PRODUCTION
VNPAY_ORDER_TTL_MINUTES="15"

# Sentry
SENTRY_DSN="..."
SENTRY_TRACES_SAMPLE_RATE="0.1"
SENTRY_ENVIRONMENT="production"
SENTRY_RELEASE="..."

# Public base
PUBLIC_BASE_URL="https://api.cuongthai.com"

# OAuth (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# Quota (per-user rate limit)
QUOTA_PER_MINUTE=30
QUOTA_PER_DAY=500
QUOTA_PER_MONTH=10000
```

## 3.3. Validation khi startup

`src/config/env.ts` dùng Zod schema:

- **Production**: throw nếu thiếu → app KHÔNG start
- **Development**: log warning, continue

Đây là lý do nếu thiếu 1 secret → backend không boot được.

---

# 🔥 PHẦN IV: LỊCH SỬ BUG & CÁCH FIX (ĐỌC KỸ!)

## 4.1. BigInt serialization crash

**Lỗi**: Prisma trả về BigInt → `JSON.stringify` throw "Do not know how to serialize a BigInt"

**Fix** (src/index.ts:36-38):
```ts
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};
```

**Bài học**: Nếu thấy lỗi này trong log → patch đã bị mất. Cần thêm lại.

## 4.2. Rate limit colllapse (tất cả user share 1 IP)

**Lỗi**: Production có Cloudflare + Nginx + Express (3 hops). `trust proxy = 1` chỉ trust Nginx → `req.ip` = Nginx IP → tất cả user share 1 bucket → 429 liên tục.

**Fix** (src/index.ts:112-121):
```ts
app.set('trust proxy', (ip: string, hop: number): boolean => {
  if (!ip) return false;
  if (hop <= 1) return true;  // Trust Cloudflare + Nginx
  return false;
});
```

## 4.3. Spinner mãi vĩnh viễn (3 layers of bugs)

**Lỗi 1**: CSS bị block bởi `@import url(...fonts.googleapis.com...)` ở đầu `globals.css` → Tailwind không apply → `Loader2` xoay (do CSS inline mặc định) → trông như "đang load".

**Fix**: Dùng `next/font/google` thay vì `@import`.

**Lỗi 2**: Auth gate AND của 3 signals (`mounted && isHydrated && isSessionReady`) → 1 signal false → effect đứng yên.

**Fix**: Server Component check `backend_token` cookie trực tiếp → redirect nếu chưa login. Client bỏ gate.

**Lỗi 3**: `onRehydrateStorage: () => (state) => { state.set({isHydrated: true}) }` — `state` không có method `set` → no-op.

**Fix**: `useAuthStore.setState({isHydrated: true})` (static method).

**Pattern cần tránh**:
- ❌ KHÔNG `@import` ở đầu CSS — dùng `next/font`
- ❌ KHÔNG gate auth trên AND của nhiều signals
- ❌ KHÔNG gọi `state.set` trong Zustand `onRehydrateStorage` — dùng `useStore.setState`

## 4.4. Prisma Client stale (Prisma models mới không có trong container)

**Lỗi**: Sau khi thêm models mới (`ThreadNickname`, `MessageReaction`) vào `schema.prisma` → deploy → trong container `prisma.threadNickname = undefined` → 500 Internal Server Error.

**Fix**: Build lại `dist/` + `.prisma/` locally, copy vào container.

**Bài học**: Mỗi lần thêm model mới → phải `npx prisma generate` + rebuild + `docker restart cuonghoangdev_backend`.

## 4.5. VNPay IPN bị block

**Lỗi**: Production VNPay gọi IPN từ IP không trong allowlist → 403.

**Fix**: Thêm CIDR `103.220.87.0/24`, `103.220.88.0/24` (Cloudflare-fronted VNPay). Có thể extend qua `VNPAY_IP_ALLOWLIST` env.

## 4.6. AI embedding Alpine crash

**Lỗi**: `@xenova/transformers` import onnxruntime-node (glibc only) → Alpine dùng musl → `ERR_DLOPEN_FAILED` → crash toàn bộ server.

**Fix**: Lazy-load `@xenova/transformers` bên trong function thay vì top-level import.

## 4.7. Hydration mismatch

**Lỗi**: `authStore.isLoading = true` initial → UI gated trên `isLoading` → click không hoạt động.

**Fix**: Set `isLoading: false` initial. `onRehydrateStorage` vẫn set đúng sau khi hydrate.

## 4.8. `state.set` trong Zustand

**Lỗi**: `onRehydrateStorage: (state) => { state.set({...}) }` — `state` là rehydrated state object, không phải set function.

**Fix**: `useStore.setState({...})` (static method).

## 4.9. NextAuth params dùng Promise

**Lỗi**: Dùng `React.use(params)` trong Next 14 → throw.

**Fix**: Đọc `params.slug` trực tiếp (Next 14: params là plain object).

## 4.10. CSS @import blocking

Xem 4.3 lỗi 1.

## 4.11. Container restart order (nginx upstream)

**Lỗi**: Restart nginx trước backend/frontend → nginx không resolve được upstream → 502 Bad Gateway.

**Fix**: Workflow `vps-fix-nginx` restart containers theo thứ tự: postgres, redis, backend, frontend, nginx.

## 4.12. /repos cold-start 8s → 500ms

**Lỗi**: RSC fetch từ `https://api.cuongthai.com` qua TLS handshake → 8s.

**Fix**: Dùng `API_INTERNAL_URL=http://backend:3001` (Docker internal network) cho SSR fetches. Latency giảm xuống ~50ms.

## 4.13. /music page stale cache

**Lỗi**: Music page render stale data.

**Fix**: `Cache-Control: no-store, must-revalidate` cho `/music` route trong `next.config.js`.

## 4.14. Nginx healthcheck với HTTPS

**Lỗi**: Healthcheck dùng `wget https://localhost/` → cert verify fail.

**Fix**: `wget --no-check-certificate` (vì cert SAN không bao gồm localhost).

## 4.15. Captcha CDN bị block

**Lỗi**: Turnstile challenges.cloudflare.com bị corporate firewall chặn → user thấy 403 "CAPTCHA verification required" không có widget.

**Fix**: 
- `CAPTCHA_REQUIRED=false` master switch
- Soft captcha mode cho `/register` (chỉ check nếu có token)
- Bypass cho admin + email-verified users

## 4.16. Tổng kết pattern

**Khi sửa code, LUÔN check:**

1. ✅ Trust proxy setting đúng (Cloudflare + Nginx)
2. ✅ BigInt prototype patched
3. ✅ Sentry DSN có thì capture 5xx, 4xx thì skip
4. ✅ Rate limit config (general 500/15min, auth 10/min prod, 100/min dev)
5. ✅ Captcha bypass cho admin
6. ✅ Static file serving (Next.js rewrite `/uploads` → `http://backend:3001`)
7. ✅ Internal backend URL cho SSR (API_INTERNAL_URL)
8. ✅ document_chunks table auto-create khi startup
9. ✅ Không `state.set` trong `onRehydrateStorage`
10. ✅ Hydration safety: mounted guard, useEffect
11. ✅ Imports đầy đủ (motion, useState, useEffect, lucide-react)
12. ✅ Build pass: `npm run build` cho cả backend + frontend

---

# 🛠️ PHẦN V: WORKFLOW ĐỀ XUẤT (Best Practices)

## 5.1. Khi nhận yêu cầu sửa gì đó

```
BƯỚC 1: ĐỌC KỸ
  - Hỏi user: "Bạn đang gặp lỗi gì? Cho xem console.error + URL + steps"
  - Nếu có stack trace → grep file + đọc code
  - Nếu không có → hỏi thêm

BƯỚC 2: KIỂM TRA
  - Đọc file mat_tri_nho.md (file này)
  - Đọc Error_Sum.md, LOI_DA_FIX.md, fix_update.md, loi_thuong_gap.md
  - Đọc Tong_du_an.md (nếu cần hiểu kiến trúc)
  - Search Google nếu là Next.js/Prisma/Express API mới

BƯỚC 3: SỬA (nhỏ nhất có thể)
  - Sửa file được chỉ định, KHÔNG sửa file khác
  - Nếu cần sửa nhiều file → confirm với user
  - Giữ nguyên code style hiện có (strict TS, comments)

BƯỚC 4: VERIFY
  - Backend: `cd /Users/admin/Downloads/api-backend && npm run build` (phải exit 0)
  - Frontend: `cd frontend && npm run build` (phải exit 0)
  - Check lints: `ReadLints` cho files vừa sửa
  - Check imports: `grep -E "motion\.|useState|useEffect|useRef|useCallback|AnimatePresence" <file>`

BƯỚC 5: COMMIT & DEPLOY
  - Commit với message rõ ràng (theo convention có sẵn)
  - Push → GitHub Actions tự deploy qua backend-vps.yml
  - Đợi 3-5 phút cho deploy xong
  - Verify bằng: `curl -sI https://cuongthai.com`
  - Verify bằng: Playwright test (nếu có)
```

## 5.2. Khi thay đổi database schema

```bash
# 1. Sửa prisma/schema.prisma
# 2. Tạo migration
cd /Users/admin/Downloads/api-backend
npx prisma migrate dev --name ten_migration_moi

# 3. Generate Prisma Client (BẮT BUỘC)
npx prisma generate

# 4. Build
npm run build

# 5. Commit + push → GitHub Actions tự deploy
# LƯU Ý: Container sẽ tự chạy `prisma db push` khi restart
#        (xem src/index.ts:508-552)
```

## 5.3. Khi thêm env var mới

```bash
# 1. Sửa src/config/env.ts (thêm vào Zod schema)
# 2. Sửa .env.example
# 3. Update GitHub Secrets (nếu secret)
# 4. Update deploy workflow (nếu cần inject)
# 5. Test trên dev
# 6. Commit + push
```

## 5.4. Khi sửa middleware/auth

```
⚠️  CỰC KỲ CẨN THẬN — auth bugs phá hỏng toàn bộ app.

CHECKLIST:
□ Đọc src/middleware/auth.ts
□ Đọc src/middleware/captcha.ts
□ Đọc frontend/src/lib/auth.ts
□ Test với account admin
□ Test với account user thường
□ Test với account chưa verify email
□ Test với account bị lock
□ Test cross-tab (login trên 2 tab)
□ Test đăng xuất
□ Test refresh token
```

## 5.5. Khi sửa Prisma schema

```
⚠️  Trong production, schema changes cần migration.

NẾU THÊM MODEL MỚI:
  1. prisma migrate dev --name add_new_model
  2. prisma generate
  3. Build → copy dist/ + .prisma/ vào container
  4. Restart container

NẾU XÓA MODEL/COLUMN:
  - CẨN THẬN — có thể mất data
  - Backup database trước: /opt/cuonghoangdev/scripts/backup-db.sh
  - Migration sẽ chạy khi container restart
```

## 5.6. Khi update dependencies

```bash
# 1. Sửa package.json
# 2. npm install
# 3. npm run build (check types)
# 4. Test manually
# 5. Commit + push

⚠️ CẨN THẬN với:
  - Next.js major upgrade (14 → 15: params Promise change!)
  - Prisma major upgrade
  - Express major upgrade
  - Node.js major upgrade
```

---

# 🐛 PHẦN VI: CÁC FILE "BÁO CÁO" HIỆN CÓ (ĐỌC SONG SONG)

User đã viết rất nhiều file tài liệu. Khi gặp vấn đề, đọc các file này:

| File | Nội dung | Khi nào đọc |
|---|---|---|
| `Tong_du_an.md` (4776 dòng) | Toàn bộ dự án A-Z, schema, RAG, 200 câu hỏi PV | Hiểu tổng quan, chuẩn bị PV |
| `Tien_do_du_an.md` | Tiến độ dự án qua từng giai đoạn | Lịch sử phát triển |
| `DEPLOY-FASTER.md` | Hướng dẫn deploy nhanh | Triển khai môi trường mới |
| `DEPLOY-OPTIMIZATION.md` | Tối ưu deploy (BuildKit cache) | Cải thiện tốc độ deploy |
| `QUICK-DEPLOY.md` | Deploy nhanh trong vài bước | Khi cần deploy gấp |
| `NODE_VPS_GO_LIVE_CHECKLIST.md` | Checklist go-live | Trước khi go-live |
| `PRISMA_MIGRATION_GUIDE.md` | Hướng dẫn Prisma migrations | Khi đổi DB schema |
| `AUTH_SETUP_GUIDE.md` | Setup auth chi tiết | Khi debug auth |
| `PAYMENT_FLOWS.md` | VNPay payment flows | Khi sửa payment |
| `PAYWALL_PLAN.md` | Plan cho paywall/course access | Khi sửa course logic |
| `SECURITY_PLAN.md` | Security architecture | Khi sửa bảo mật |
| `SENTRY_SETUP.md` | Setup Sentry error tracking | Khi setup Sentry |
| `PROJECT_STATUS.md` | Trạng thái dự án | Tổng quan |
| `NODE_VPS_GO_LIVE_CHECKLIST.md` | Production checklist | Trước khi go-live |
| `fix_update.md` | Bản update fixes gần đây | Recent fixes |
| `Error_Sum.md` | Lỗi courses/learn page | Bug courses/learn |
| `LOI_DA_FIX.md` | Lỗi music + messages đã fix | Bug music/messages |
| `loi_thuong_gap.md` | Lỗi thường gặp | Debug nhanh |

---

# 📁 PHẦN VII: KEY FILES - BẢN ĐỒ NHANH

## 7.1. Backend files cần biết

```
src/index.ts                  ← Express setup, middleware order, route mounting
src/config/env.ts             ← Env validation (Zod)
src/config/database.ts        ← Prisma singleton
src/config/redis.ts           ← Redis client

src/middleware/auth.ts        ← authenticate, requireRole, requireAdmin
src/middleware/captcha.ts     ← captchaMiddleware (strict + soft)
src/middleware/errorHandler.ts← AppError class + global error handler
src/middleware/vnpayIpnGuard.ts← VNPay IPN security

src/services/ai.service.ts    ← RAG + streaming chat
src/services/aiProviders.ts   ← Multi-provider + circuit breaker
src/services/auth.service.ts  ← JWT + bcrypt + OTP
src/services/messages.service.ts ← Direct messaging
src/services/payment.service.ts← VNPay handlers
src/services/email.service.ts ← Resend + SMTP
src/services/cron.service.ts  ← Cron jobs (backup, cleanup, reindex)
src/services/sentry.service.ts← Sentry init

src/socket/messaging.socket.ts← Socket.IO server

src/routes/payment.routes.ts  ← VNPay routes
src/routes/ai.routes.ts       ← AI routes (SSE)
src/routes/messages.routes.ts ← Messages REST
src/routes/messages.routes.ts (adminRoutes)
```

## 7.2. Frontend files cần biết

```
frontend/src/lib/api.ts       ← TẤT CẢ API endpoints (authApi, musicApi, etc.)
frontend/src/lib/server-api.ts← Server-side API base URL resolver
frontend/src/lib/socket.ts    ← Socket.IO client
frontend/src/lib/auth.ts      ← Client auth helpers
frontend/src/lib/ssrSafeStorage.ts ← SSR-safe localStorage

frontend/src/store/authStore.ts ← Auth state (Zustand + persist)
frontend/src/store/messagingStore.ts
frontend/src/store/chatStore.ts
frontend/src/store/musicStore.ts
... (12 stores total)

frontend/src/hooks/useAuth.ts ← Auth hook
frontend/src/hooks/useChatSSE.ts ← SSE for AI chat
frontend/src/hooks/useAudioAnalyser.ts
frontend/src/hooks/useAudioStream.ts
frontend/src/hooks/useMusicQueries.ts

frontend/middleware.ts        ← NextAuth middleware (auth gate)

frontend/next.config.js       ← CSP, rewrites, security headers, Sentry
frontend/src/instrumentation.ts ← Sentry init
frontend/sentry.{client,server,edge}.config.ts
```

## 7.3. Database files cần biết

```
prisma/schema.prisma          ← 74 models, 1789 dòng
prisma/seed.ts                ← Seed admin
prisma/seed-repos.ts          ← Seed GitHub repos
prisma/migrations/            ← 7 migration folders
```

## 7.4. Infrastructure files cần biết

```
docker-compose.yml            ← 5 services (postgres, redis, backend, frontend, nginx)
Dockerfile.backend            ← Backend image
frontend/Dockerfile           ← Frontend image
nginx/nginx.conf              ← Reverse proxy + static files

.github/workflows/backend-vps.yml      ← Main deploy
.github/workflows/vps-debug.yml         ← Debug
.github/workflows/vps-debug-nginx.yml   ← Debug nginx
.github/workflows/vps-fix-nginx.yml     ← Fix nginx
... (12 workflows total)

scripts/deploy-vps.sh         ← VPS deploy script
scripts/backup-cron.sh        ← DB backup cron
scripts/monitor.sh            ← Health monitoring
scripts/migrate-database.sh   ← DB migration helper
scripts/copy-secrets.sh       ← Copy secrets to VPS
```

---

# 🎯 PHẦN VIII: ĐẶC ĐIỂM RIÊNG CỦA PROJECT NÀY

## 8.1. Code style

- **TypeScript strict mode** — KHÔNG tắt
- **Comments rất chi tiết** — Giữ phong cách này
- **ESM modules** — Dùng `import x from 'y.js'` (KHÔNG dùng `require`)
- **Async/await** — KHÔNG dùng `.then()` (trừ khi cần thiết)
- **Error handling**: throw `AppError(message, statusCode, code)`
- **Validation**: Zod schemas

## 8.2. Quy ước đặt tên

- **Routes**: `/api/v1/{resource}/{action}` (plural nouns)
- **Files**: `camelCase.ts` (backend), `PascalCase.tsx` (frontend components)
- **Database columns**: `snake_case` (Prisma `@map`)
- **Env vars**: `SCREAMING_SNAKE_CASE`
- **Constants**: `UPPER_SNAKE_CASE`

## 8.3. Quy ước commit

```
Conventional commits:
- feat: Tính năng mới
- fix: Sửa bug
- chore: Tasks phụ (deps, config, etc.)
- docs: Tài liệu
- refactor: Refactor code (không thêm tính năng)
- perf: Performance
- test: Tests
- build: Build/CI
- security: Security fixes

Format: <type>(<scope>): <message>
Example: fix(music): widen YouTube id type
```

## 8.4. "KHÔNG" rules (đọc kỹ!)

❌ **KHÔNG** thay đổi port 3001 (backend) / 3000 (frontend) / 5432 (postgres) / 6379 (redis) / 80/443 (nginx) — đã wire hết với CI/CD, nginx, monitoring.

❌ **KHÔNG** xóa models Prisma mà không backup database.

❌ **KHÔNG** commit `.env` (đã có trong `.gitignore`).

❌ **KHÔNG** xóa dòng `(BigInt.prototype as any).toJSON = ...` ở `src/index.ts:36-38`.

❌ **KHÔNG** tắt `app.set('trust proxy', ...)` — production sẽ break.

❌ **KHÔNG** tắt auto-create `document_chunks` table trong `src/index.ts:508-552`.

❌ **KHÔNG** đổi `output: 'standalone'` trong `next.config.js` — Docker cần standalone.

❌ **KHÔNG** xóa volumes: `postgres_data`, `redis_data`, `uploads_data` trong `docker-compose.yml`.

❌ **KHÔNG** tắt Sentry (trừ khi DSN rỗng — graceful disable).

❌ **KHÔNG** gọi `state.set` trong Zustand `onRehydrateStorage`.

❌ **KHÔNG** `@import` external resources ở đầu `globals.css`.

❌ **KHÔNG** dùng `React.use(params)` — Next 14: `params` là plain object.

❌ **KHÔNG** quên `loading.tsx` / `error.tsx` ở mỗi route segment.

---

# 📊 PHẦN IX: THỐNG KÊ PROJECT (CHO BẠN NGÀY MAI)

## 9.1. Số liệu

```
Tổng commits:        510+
Tổng Prisma models:  74
Tổng backend code:   ~21,500 dòng TS
Tổng frontend code:  ~77,000 dòng TS/TSX
Schema lines:        1,789
Migrations:          7
Routes (backend):    28
Services (backend):  18
Frontend pages:      40+
Frontend components: 25+ folders
Stores (Zustand):    12
CI/CD workflows:     12
Docker services:     5
```

## 9.2. Cấu trúc tổ chức

```
Backend:
  - Express + TypeScript ESM
  - 28 routes (theo resource: auth, admin, ai, music, courses, etc.)
  - 18 services (logic tách riêng)
  - 5 middleware (auth, captcha, error, validate, vnpayIpn)
  - 1 Socket.IO server

Frontend:
  - Next.js 14 App Router
  - 12 Zustand stores
  - 6 custom hooks
  - 11 lib files (api.ts chứa TẤT CẢ endpoints)
  - 40+ pages (public + admin)
  - 25+ component folders

Database:
  - PostgreSQL + PostGIS
  - 74 models
  - JSONB cho embeddings (không pgvector)
  - 7 migrations

AI:
  - Multi-provider (Groq, OpenRouter, OpenAI)
  - Circuit breaker với cooldown
  - RAG với local embeddings (Transformers.js)
  - Streaming SSE
```

## 9.3. Tính năng nổi bật

- 🔐 **Auth**: JWT + bcrypt + OAuth (Google, GitHub) + OTP + CAPTCHA
- 💳 **Payment**: VNPay tích hợp đầy đủ (sandbox + production)
- 💬 **Real-time**: Socket.IO messaging (DMs iOS-style)
- 🤖 **AI**: Multi-provider + RAG + streaming
- 📚 **LMS**: Courses với enrollment, lessons, progress, certificates
- 🎵 **Music**: Player 3 modes (default, cinematic, premium) + playlists + YouTube search
- 🛒 **Shop**: Products, cart, orders
- 📰 **Blog**: Posts, comments, categories
- 📱 **Social**: Feed, posts, comments, likes, polls, saves
- 🎮 **Cyber Gamification**: Tasks, EXP, levels, coupons
- 📊 **Dashboard**: Personal (per-user) với timeline, celebrations
- 🔍 **Tech Trends**: Public articles + admin CMS
- 📁 **GitHub Repo Hub**: Curated repos với tags
- 🔧 **SEO**: robots.txt, sitemap, JSON-LD, OG-meta, Google Indexing API
- 🛡️ **Security**: Helmet, CSP, rate limiting, trust proxy, CORS, captcha
- 📊 **Monitoring**: Sentry (errors), UptimeRobot (uptime), healthcheck endpoints

---

# 🎓 PHẦN X: HỌC TỪ DỰ ÁN NÀY (BÀI HỌC ĐÚC KẾT)

## 10.1. Lessons learned (technical)

1. **Trust proxy**: 3-hop (Cloudflare + Nginx + Express) cần custom function
2. **BigInt in Prisma**: patch prototype để JSON serialize
3. **JSONB > pgvector**: khi Docker image không có pgvector
4. **Circuit breaker**: critical cho multi-provider AI
5. **Idempotency**: quan trọng cho payment, retry-safe
6. **Lazy loading**: tránh crash khi deps có native bindings (Alpine vs glibc)
7. **Health check**: phải có cho cả process và DB
8. **Graceful shutdown**: xử lý SIGTERM đúng cách
9. **CSP + self-host fonts**: tránh bị block ở corporate network
10. **Internal Docker network**: giảm latency cho SSR fetches

## 10.2. Architectural patterns

- **Layered defense** cho payment (UA + IP + payload size)
- **Fail-open** cho captcha (verified users bypass)
- **Idempotency keys** cho critical operations
- **Soft-delete** (archived) thay vì hard-delete
- **Optimistic UI** với background sync
- **Server-side auth check** thay vì client gate
- **Single source of truth** cho tokens (httpOnly cookie)
- **Document everything** (đã viết 12+ file .md)

## 10.3. Khi review PR hoặc viết code mới

```
CHECKLIST TRƯỚC KHI COMMIT:

□ Code passes `npm run build` (backend + frontend)
□ TypeScript strict (không dùng `any` trừ khi thực sự cần)
□ Comments giải thích WHY (không phải WHAT)
□ Imports đầy đủ (motion, hooks, lucide)
□ Không hardcode secret/API key
□ Error handling: throw AppError với code rõ ràng
□ Validation: dùng Zod
□ Database query: dùng Prisma
□ Test trên dev trước khi push
□ Đã đọc file mat_tri_nho.md (file này) để hiểu context
```

---

# 🚀 PHẦN XI: DEPLOY & MAINTENANCE

## 11.1. Deploy workflow chính

```bash
# 1. Commit changes
git add .
git commit -m "type(scope): message"

# 2. Push to main
git push origin main

# 3. GitHub Actions tự động:
#    - Checkout repo
#    - Build backend TypeScript → dist/
#    - Build Next.js frontend
#    - rsync files to VPS
#    - Inject dist/ vào backend container
#    - docker restart cuonghoangdev_backend
#    - docker restart cuonghoangdev_frontend
#    - Setup cron jobs

# 4. Verify
curl -sI https://cuongthai.com
```

## 11.2. SSH vào VPS (nếu cần debug)

```bash
# Local (macOS) → VPS
ssh root@<VPS_IP>

# Hoặc qua script
ssh vps "docker ps"
ssh vps "docker logs --tail=50 cuonghoangdev_backend"
ssh vps "docker exec -it cuonghoangdev_postgres psql -U postgres -d cuonghoangdev_db"
```

## 11.3. Container commands (trên VPS)

```bash
# List containers
docker ps

# Restart specific container
docker restart cuonghoangdev_backend
docker restart cuonghoangdev_frontend
docker restart cuonghoangdev_nginx

# Logs
docker logs --tail=100 cuonghoangdev_backend
docker logs -f cuonghoangdev_backend   # follow mode

# Execute command in container
docker exec cuonghoangdev_backend sh
docker exec cuonghoangdev_backend npx prisma studio
docker exec -it cuonghoangdev_postgres psql -U postgres

# Prisma commands
docker exec cuonghoangdev_backend npx prisma generate
docker exec cuonghoangdev_backend npx prisma db push
docker exec cuonghoangdev_backend npx prisma migrate deploy
```

## 11.4. Backup & Restore

```bash
# Backup database (auto: 0 2 * * *)
/opt/cuonghoangdev/scripts/backup-cron.sh

# Manual backup
/opt/cuonghoangdev/scripts/backup-db.sh

# Restore
/opt/cuonghoangdev/scripts/restore-db.sh <backup_file>
```

## 11.5. Monitoring

```bash
# Health check
curl https://cuongthai.com/health
curl https://api.cuongthai.com/api/v1/system/health

# Run monitor
/opt/cuonghoangdev/scripts/monitor.sh

# Sentry dashboard
# https://sentry.io/organizations/.../issues/
```

---

# 📞 PHẦN XII: LIÊN HỆ & CREDENTIALS

## 12.1. Tài khoản quan trọng

```
Admin email:     cuongthaihnhe176322@gmail.com
Admin username:  admin
Contact email:   cuongthaihnhe176322@gmail.com (same)
SMTP_FROM:       noreply@cuongthai.com
RESEND_FROM:     noreply@cuongthai.com
```

## 12.2. Tài liệu tham chiếu

```
Domain chính:    https://cuongthai.com
API:             https://api.cuongthai.com  (proxied via nginx)
Sentry:          https://sentry.io (nếu setup)
Google Cloud:    console.cloud.google.com (OAuth + YouTube API)
Cloudflare:      dash.cloudflare.com (Turnstile)
Resend:          resend.com (email)
VNPay sandbox:   sandbox.vnpayment.vn
GitHub:          github.com (OAuth)
```

## 12.3. Files KHÔNG push lên GitHub

```
.env                     ← Production secrets
.env.bak-pre-rotation   ← Old backup (cũng nhạy cảm)
frontend/src/config/google-key.json ← Google service account key
BACKUP-VPS-CREDENTIALS.txt ← VPS credentials
hoangappvps.txt         ← VPS info
```

**Bài học**: GitHub Actions dùng GitHub Secrets để inject env. KHÔNG BAO GIỜ commit `.env`.

---

# 🆘 PHẦN XIII: TROUBLESHOOTING NHANH

## 13.1. "Backend crash" / restart liên tục

```bash
# Check logs
ssh vps "docker logs --tail=100 cuonghoangdev_backend"

# Common causes:
# 1. Missing env var → check .env
# 2. Prisma client outdated → re-generate
# 3. Database connection lost → check postgres
# 4. Out of memory → check memory limits in docker-compose
```

## 13.2. "AI không trả lời" / 503

```bash
# Check circuit breaker state
ssh vps "docker exec cuonghoangdev_backend node -e \"import('./dist/services/aiProviders.js').then(m => console.log(m.getAllCircuitStates()))\""

# Reset circuit manually
ssh vps "docker exec cuonghoangdev_backend node -e \"import('./dist/services/aiProviders.js').then(m => { m.resetCircuitManually('groq'); m.resetCircuitManually('openrouter'); m.resetCircuitManually('openai'); })\""
```

## 13.3. "Frontend trắng trang" / Hydration error

```bash
# Common causes:
# 1. Browser cache stale chunk hash → hard refresh (Ctrl+Shift+R)
# 2. Build mismatch → check next.config.js Cache-Control
# 3. Missing useState/useEffect imports → check via grep
# 4. Mounted guard missing → check component
```

## 13.4. "Database connection error"

```bash
# Check postgres container
ssh vps "docker logs cuonghoangdev_postgres | tail -20"
ssh vps "docker exec cuonghoangdev_postgres pg_isready -U postgres"

# Check DATABASE_URL
ssh vps "grep DATABASE_URL /opt/cuonghoangdev/.env"
```

## 13.5. "Payment failed" / VNPay IPN

```bash
# Check IPN endpoint
curl -I https://cuongthai.com/api/v1/payments/vnpay/ipn

# Check IP allowlist
# Default: 203.171.20.0/24, 123.30.235.0/24, 113.161.69.0/24, 103.220.87.0/24, 103.220.88.0/24
# Override: VNPAY_IP_ALLOWLIST env

# Sandbox: VNPAY_SANDBOX=1 (skip IP check)
# Production: VNPAY_SANDBOX=0 (enforce IP)
```

## 13.6. "Socket.IO không kết nối"

```bash
# Check nginx config
ssh vps "docker exec cuonghoangdev_nginx cat /etc/nginx/nginx.conf | grep -A 20 'location /socket.io'"

# Check backend
ssh vps "docker exec cuonghoangdev_backend sh -c 'curl -sf http://localhost:3001/health'"
```

## 13.7. "CORS error"

```bash
# Allowed origins (in src/index.ts:141-145)
# https://cuongthai.com
# https://www.cuongthai.com
# http://localhost:3000

# Extend via env
# ALLOWED_ORIGINS="https://cuongthai.com,https://staging.cuongthai.com"
```

---

# 🎬 PHẦN XIV: KẾT THÚC

## 14.1. Tóm tắt project

**CuongHoangDev** là một full-stack portfolio + blog + LMS + shop + social platform, được build bởi sinh viên năm cuối với:
- 510+ commits
- 74 Prisma models
- 21K+ backend code
- 77K+ frontend code
- 5 Docker services
- 12 CI/CD workflows
- 12 Zustand stores
- 40+ pages
- AI với RAG
- Real-time messaging
- VNPay payment
- SEO + Google Indexing
- Sentry monitoring

## 14.2. Câu thần chú cuối cùng

> 🔴 **TRƯỚC KHI SỬA GÌ → ĐỌC FILE NÀY + LIÊN HỆ USER**
> 🟡 **SAU KHI SỬA → BUILD + TEST + DEPLOY**
> 🟢 **NẾU KHÔNG CHẮC → HỎI USER**

## 14.3. Files PHẢI đọc khi nhận task mới

```
1. mat_tri_nho.md (file này)  ← Project context
2. Tong_du_an.md              ← Architecture overview
3. .cursorrules               ← Workspace rules
4. Error_Sum.md               ← Recent bug fixes
5. LOI_DA_FIX.md              ← Music + Messages fixes
6. fix_update.md              ← Recent updates
7. loi_thuong_gap.md          ← Common errors
```

---

**📝 Tạo bởi**: Cursor Assistant (phiên 2026-06-17)
**📅 Ngày tạo**: 2026-06-17 20:40 (UTC+7)
**🔖 Version**: 1.0
**📍 Path**: `/Users/admin/Downloads/api-backend/mat_tri_nho.md`

**💡 LƯU Ý CUỐI**: Nếu bạn (AI mới) đang đọc file này, hãy thông báo cho user rằng bạn đã đọc và sẵn sàng tiếp tục. Hỏi user task cụ thể cần làm.
