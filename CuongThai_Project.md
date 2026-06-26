# 📘 CuongThai_Project — Tài liệu tổng hợp dự án `cuonghoangdev-api`

> **Mục đích:** Bản ghi chép đầy đủ về dự án `api-backend` (CuongHoangDev - cuongthai.com) để người mới hiểu hệ thống và build lại.
> 
> **Cập nhật lần cuối:** 2026-06-26 (thêm đánh giá Hub)
> 
> **Thống kê:** ~205 tính năng • 107 Prisma models • 10 enums • 39 routers • 31 services • ~34,334 dòng TS trong backend • 4,125 dòng TS trong Hub frontend.

---

## Mục lục nhanh

**PHẦN A — TÀI LIỆU KỸ THUẬT DỰ ÁN** (§1–14)
1. Tổng quan kiến trúc
2. Cấu trúc thư mục  
3. Tech stack
4. Cấu hình & môi trường
5. Backend
6. Frontend
7. R2 Storage
8. Authentication
9. AI Chatbot & RAG
10. 205 tính năng
11. CI/CD & Deployment
12. Build từ đầu
13. Tài liệu nội bộ
14. Conventions

**PHẦN B — HƯỚNG DẪN NGHỀ NGHIỆP** (§15–19)
15. Lộ trình học từ số 0
16. Kỹ năng cần học
17. 500 câu hỏi phỏng vấn
18. Kỹ năng công ty lớn
19. 10 dự án luyện tập

**PHẦN C — ĐÁNH GIÁ CHUYÊN SÂU** (§20+)
20. Báo cáo đánh giá Hub (mới nhất)

---


# PHẦN A — TÀI LIỆU KỸ THUẬT DỰ ÁN

## 1. Tổng quan kiến trúc

**CuongHoangDev** là portfolio full-stack trên **https://cuongthai.com**, gồm:

- **Frontend**: Next.js 14 + React + TypeScript (port 3000)
- **Backend**: Node.js + Express + TypeScript (port 3001)
- **Database**: PostgreSQL 16 + PostGIS + pg_trgm + pgvector (port 5432)
- **Cache/OTP**: Redis 7 (port 6379)
- **Object Storage**: Cloudflare R2 (S3-compatible) qua CDN `media.cuongthai.com`
- **Realtime**: Socket.IO 4.8
- **AI Providers**: Groq → OpenRouter → OpenAI → Gemini (auto-fallback)
- **Container**: Docker Compose (multi-stage build)
- **Reverse Proxy**: Nginx 1.27 + Let's Encrypt + Cloudflare
- **Email**: Resend (transactional)
- **Error tracking**: Sentry
- **Captcha**: Cloudflare Turnstile
- **Payment**: VNPay (Vietnamese)

**VPS**: `160.187.1.208` (Ubuntu), deploy path `/home/deployer/repo`, env `/opt/cuonghoangdev/.env`. SSH key auth.

**Domain**: `https://cuongthai.com` (Frontend) + `https://api.cuongthai.com` (Backend API qua nginx `/api/v1/*`) + `https://media.cuongthai.com` (R2 CDN).

## 2. Cấu trúc thư mục

\`\`\`
api-backend/
├── src/                          ← Backend (~34,334 dòng TS)
│   ├── index.ts                  ← Express app entry (653 dòng, có comment dày)
│   ├── config/                   ← 4 file (env, database, redis, r2)
│   ├── routes/                   ← 39 router files (~200+ endpoints)
│   ├── services/                 ← 31 service files
│   ├── middleware/               ← 5 middleware (auth, error, captcha, validate, vnpayIpnGuard)
│   ├── storage/                  ← Storage abstraction (R2 + Local)
│   ├── socket/                   ← Socket.IO (messaging, listen-together)
│   ├── types/, utils/
├── prisma/
│   ├── schema.prisma             ← 2963 dòng, 107 models, 10 enums
│   ├── migrations/               ← 19 migrations
│   └── seed.ts
├── frontend/                     ← Next.js 14 (độc lập)
│   ├── src/app/                  ← App Router (~50 pages)
│   ├── src/components/           ← UI theo module
│   ├── src/lib/                  ← API client, helpers
├── nginx/, scripts/              ← 40 shell/ts scripts
├── Dockerfile, docker-compose.yml
├── deploy.sh                     ← One-click deploy (319 dòng)
├── package.json, tsconfig.json
└── *.md                          ← ~20 file tài liệu nội bộ
\`\`\`

## 3. Tech stack chi tiết

**Backend runtime (45 packages):**
- Express 4.21 + helmet + cors + express-rate-limit + express-validator + cookie-parser
- Prisma 5.22 + pgvector 0.3
- ioredis 5 + redis 4
- bcryptjs + jsonwebtoken
- @aws-sdk/client-s3 3.1071 (cho R2)
- openai 4.77 + @xenova/transformers 2.17
- multer + sharp 0.35 (image optimization → WebP)
- fluent-ffmpeg 2.1 (audio metadata)
- socket.io 4.8
- resend 6.12 (email)
- unified/remark/rehype (Markdown → HTML)
- zod 3.23, nanoid 5, uuid 10
- node-cron 3, @sentry/node 7, vnpay 2.5

**Frontend (Next.js 14.2 + React 18.3):**
- Tailwind 3.4 + shadcn/ui + Radix UI
- Tiptap 2.27 (rich text - Notes)
- @dnd-kit (Kanban trong Hub)
- React Query 5.101 + Zustand 4.5
- next-intl 4.13 (i18n)
- next-auth 5 beta + jose 6
- @sentry/nextjs 7.120
- socket.io-client 4.8
- framer-motion + KaTeX + shiki
- jspdf + html2canvas (Notes export)
- sharp 0.34.3 + dompurify

**Database (Prisma):**
- PostgreSQL 16 với PostGIS, pg_trgm, pgvector extensions
- 107 models + 10 enums, snake_case naming
- Per-user scoping + cascade delete
- Soft-delete (archivedAt) cho 1 số model
- Unique constraints cho idempotency

**19 migrations** (2026-06-22 → 2026-07-03): từ `0_init` → add notes, content creator, vocab, social notifications, music queue/likes/lyrics...

## 4. Cấu hình & môi trường

**`tsconfig.json`**: ES2022, NodeNext, strict mode max (noImplicitAny, strictNullChecks, noUnusedLocals, noUnusedParameters, noImplicitReturns...)

**`package.json` scripts:**
\`\`\`json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "db:generate": "prisma generate",
  "db:push": "prisma db push",
  "db:migrate": "prisma migrate dev",
  "db:seed": "tsx prisma/seed.ts",
  "lint": "eslint src --ext .ts",
  "test:*": "tsx scripts/test-*.ts"
}
\`\`\`

**Environment (Zod-validated, fail-fast trong production):**

Bắt buộc: `DATABASE_URL`, `JWT_SECRET` (≥32 chars), `JWT_REFRESH_SECRET`, `SIGNED_URL_SECRET`, `COOKIE_SECRET`

Có default: `PORT=3001`, `NODE_ENV`, `REDIS_HOST/PORT/PASSWORD`, `FRONTEND_URL`, `UPLOAD_DIR`, `MAX_FILE_SIZE_*`, `RATE_LIMIT_*`, AI providers, Email...

Optional: OAuth (Google/GitHub), AI providers, Captcha, R2, Sentry, VNPay, GemAPI...

## 5. Backend (cấu trúc & luồng)

### 5.1. Entry point — `src/index.ts` (653 dòng)

14 bước setup theo thứ tự:
1. dotenv + Sentry init (đầu tiên)
2. Patch BigInt.toJSON (Prisma → JSON-safe)
3. Dynamic ESM import
4. HTTP server + Express
5. Trust proxy (Cloudflare → Nginx → Express)
6. Helmet (CSP off cho Next.js)
7. CORS allowlist (cuongthai.com, www., localhost)
8. Body parsers (json + urlencoded 10MB)
9. Compression (gzip level 6)
10. Morgan HTTP logging (skip /health)
11. Static file serving (chỉ dev)
12. Rate limiting 3 tiers: general 500/15min, auth 10/1min, upload 20/1min
13. Sentry request middleware
14. Mount 35+ routers
15. Socket.IO init
16. 3 health endpoints
17. 404 handler + Sentry error handler + Global error handler
18. Graceful shutdown (SIGTERM/SIGINT, 30s force close)
19. Auto-sync Prisma (document_chunks + pg_trgm)
20. Start cron jobs

### 5.2. Config layer (`src/config/`)

- `env.ts` (302 dòng): Zod validation, fail-fast trong production. Xử lý circular import với logger (dùng `process.stderr.write` thay vì `logger`).
- `database.ts` (126 dòng): Prisma singleton + log level theo NODE_ENV.
- `redis.ts` (76 dòng): Lazy connection + exponential backoff (cap 2s).
- `r2.ts` (236 dòng): S3Client + putObject, deleteObject (batch 1000), getSignedDownloadUrl (5min TTL), buildPublicUrl.

### 5.3. Middleware (`src/middleware/`)

- `auth.ts` (258 dòng): `authenticate` (JWT + re-check DB), `optionalAuth`, `requireRole`, `requireAdmin`, `requireCyberProfile`, `extractToken` (header/cookie/query/raw Cookie).
- `errorHandler.ts` (105 dòng): `notFoundHandler`, `errorHandler` + 6 error classes: AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, ValidationError.
- `captcha.ts` (206 dòng): `captchaMiddleware` (strict) + `softCaptchaMiddleware` (soft). Bypass cho admin/verified users.
- `validate.ts`: Wrap express-validator results.
- `vnpayIpnGuard.ts`: CIDR check IP VNPay + signature verify.

### 5.4. Routes (`src/routes/` — 39 files)

Mount tại `/api/v1/*`:
- `/auth`, `/profile`, `/users`, `/blog`, `/skills`, `/projects`, `/certificates`, `/contact`
- `/courses`, `/course-categories`, `/academy`, `/payments`
- `/shop` (567 dòng - lớn nhất)
- `/music` + `/music/admin`, `/music/history`, `/music/queue`, `/music/likes`, `/music/play-counts`, `/music/lyrics`
- `/ai`, `/admin`, `/admin/embed-jobs`, `/admin/content`, `/admin/tech-trends`, `/admin/reports`
- `/files`, `/dev-posts`, `/tech-trends`, `/system`
- `/social` (1142 dòng - lớn nhất), `/social/notifications`, `/feed` (alias)
- `/repos`, `/dashboard`, `/hub`, `/notes`, `/cyber`, `/quota`
- `/messages`, `/admin/messages`, `/admin/reports`

### 5.5. Services (`src/services/` — 31 files)

Business logic. Quan trọng nhất:
- `auth.service.ts` (898 dòng) - login (lockout 5 fail → 15 min), register (12-char policy), verify OTP 6 số, OAuth
- `ai.service.ts` (889 dòng) - chat streaming (Groq SSE với 8s watchdog), RAG cosine similarity
- `social.service.ts` (1762 dòng - lớn nhất) - posts, comments (2-level), likes (multi-emoji), saves, polls
- `music.service.ts` (999 dòng) - streaming 206 Partial Content, Range parser
- `messages.service.ts` (1372 dòng) - DM threads, reactions, blocks, reports
- `hub.service.ts` (1104 dòng) - folders, links, files, scrape, AI tags ← Xem §20
- `notes.service.ts` (716 dòng) - TipTap notebooks
- `payment/vnpay.service.ts` - VNPay wrapper
- `storage/uploadService.ts` - unified upload
- `cron.service.ts` - 5 cron jobs
- `email.service.ts` - Resend + SMTP

### 5.6. Storage abstraction (`src/storage/`)

\`\`\`
StorageProvider interface
├── R2StorageProvider (production)   ← Cloudflare R2 qua AWS SDK v3
└── LocalStorageProvider (dev)        ← ./uploads/

Files: StorageProvider.ts (360 dòng), uploadService.ts (274 dòng), imageOptimizer.ts (155 dòng), keys.ts (92 dòng)
\`\`\`

`getStorageProvider()`: R2 nếu 4 env vars đủ → Production. Dev OK với Local. Production mà thiếu R2 → **throw error, refuse to start**.

**Image pipeline**: Sharp → resize max 1200px (no enlarge), rotate EXIF, encode WebP q80. Output luôn `.webp`.

**Music streaming pipeline (critical bug đã fix):**
\`\`\`
Browser Audio ──▶ GET /api/v1/music/stream/:id (Range header)
                       │
                       ▼
              StorageProvider.readStream(key, { range })
                  ┌────┴────┐
                  ▼         ▼
            LocalProvider  R2Provider
            createReadStream (start, end)
                              GetObjectCommand (forward Range!)
                       │
                       ▼
            HTTP 206 Partial Content
\`\`\`

**Key insight:** Phải forward Range header xuống R2 (qua `Range: 'bytes=…'` trong GetObjectCommand) — nếu không, R2 trả full object nhưng Content-Range nói N-M, browser chỉ play N-M bytes đầu → seek về 0.

### 5.7. Socket.IO (`src/socket/`)

- `messaging.socket.ts` (322 dòng) - DM bridge
- Rooms: `user:<id>`, `admin:<id>`, `thread:<id>`
- Events: `thread:new-message`, `thread:read`, `social:notification`, `feed:has-new`
- `listen-together.ts` (302 dòng) - sync playback

