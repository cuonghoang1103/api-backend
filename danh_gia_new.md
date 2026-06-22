# CuongHoangDev — Đánh Giá Toàn Diện & Kế Hoạch Nâng Cấp

> Ngày đánh giá: 2026-06-22
> Scope: Backend (Node.js/Express) + Frontend (Next.js 14) + Database (PostgreSQL) + Infrastructure (Docker/Nginx/VPS)

---

## 1. Tổng Quan Kiến Trúc

```
Browser (HTTPS)
    │
    ▼
Nginx (TLS terminator, static files, reverse proxy)
    │
    ├── / → Next.js (Docker: cuonghoangdev_frontend:3000)
    ├── /api/v1/* → Node.js Backend (Docker: cuonghoangdev_backend:3001)
    ├── /socket.io/* → Node.js Backend (WebSocket)
    └── /uploads/* → Host filesystem (/var/www/cuongthai.com/uploads/)
           │
           ▼
    PostgreSQL 16 + pgvector (Docker: cuonghoangdev_postgres:5432)
    Redis 7 (Docker: cuonghoangdev_redis:6379)
```

### Tech Stack

| Layer | Tech | Version |
|---|---|---|
| Frontend | Next.js | 14.2.15 |
| UI | React | 18.3.1 |
| State | Zustand | 4.5.5 |
| API Client | Axios + React Query | TanStack Query 5 |
| Animation | Framer Motion | 11.9.0 |
| Backend | Node.js + Express | Latest |
| Database ORM | Prisma | 5.22.0 |
| Database | PostgreSQL + pgvector | 16-3.4 |
| Cache | Redis | 7-alpine |
| Realtime | Socket.IO | 4.8.3 |
| Auth | JWT (jsonwebtoken) | 9.0.2 |
| Payment | VNPay SDK | 2.5.0 |
| File Storage | Cloudflare R2 + Sharp | 0.35.1 |
| AI | OpenRouter / Hugging Face | DeepSeek R1 |
| Email | Resend | 6.12.4 |
| Error Tracking | Sentry | 7.120.4 |
| Reverse Proxy | Nginx | 1.27 |
| Deploy | Docker Compose | Latest |

### Module hệ thống

| Module | Files | Mô tả |
|---|---|---|
| Auth | `auth.routes.ts`, `auth.service.ts` | Login, register, OTP, OAuth (Google/GitHub), JWT, account lockout |
| Academy | `academy.routes.ts`, `course.routes.ts` | Khóa học, bài giảng, enrollment, progress |
| Social | `social.routes.ts`, `social.service.ts` | Feed, posts, comments, reactions, saves, collections |
| Messaging | `messages.routes.ts`, `messaging.socket.ts` | Chat real-time qua Socket.IO |
| Music | `music.routes.ts`, `music.service.ts` | Upload, stream, playlist, history |
| Payment | `payment.routes.ts`, `vnpay.service.ts` | VNPay checkout, IPN, enrollment |
| Hub | `hub.routes.ts`, `hub.service.ts` | Bookmark manager (links, files, folders) |
| AI Chat | `ai.routes.ts` | DeepSeek R1 chat, RAG, session history |
| Dashboard | `dashboard.routes.ts` | Personal productivity (tasks, level, exp) |
| Cyber | `cyber.routes.ts` | Gamification (tasks, profile, inventory) |
| Blog | `blog.routes.ts` | Blog posts, comments, download source |
| Tech Trends | `techTrends.routes.ts` | Tech articles CRUD |
| GitHub Hub | `github.routes.ts` | Curated repo feed, star sync |
| Notifications | `notifications.routes.ts` | In-app social notifications |
| Email | `email.service.ts` | Resend transactional email |
| CAPTCHA | `captcha.service.ts` | Cloudflare Turnstile |

---

## 2. ĐÁNH GIÁ CHI TIẾT THEO TỪNG LĨNH VỰC

---

### 2.1 Security (Bảo Mật)

#### Điểm mạnh

| Feature | Trạng thái | Chi tiết |
|---|---|---|
| Password hashing | ✅ Tốt | bcrypt cost factor = 12 (`src/services/auth.service.ts:11`) |
| Password policy | ✅ Tốt | Min 12 chars, uppercase, lowercase, number, special char, no username/email |
| Account lockout | ✅ Tốt | 5 failed logins → 15 min lockout |
| JWT httpOnly cookie | ✅ Tốt | `httpOnly: true`, `sameSite: 'lax'`, `secure` in production |
| JWT secret length | ✅ Tốt | 64+ chars random string |
| Refresh token rotation | ✅ Tốt | Separate `backend_refresh_token` cookie, 7-day expiry |
| Role versioning | ✅ Tốt | `roleVersion` in JWT prevents stale admin sessions |
| Rate limiting | ✅ Tốt | nginx zone limits + express-rate-limit |
| Helmet.js | ✅ Tốt | Security headers middleware |
| CORS allowlist | ✅ Tốt | Explicit origin checking |
| Cloudflare Turnstile CAPTCHA | ✅ Tốt | Soft mode (graceful fallback) |
| VNPay IPN signature | ✅ Tốt | HMAC SHA512 verification |
| Email OTP | ✅ Tốt | 6-digit, 5-min TTL, dev bypass |
| Timing-attack mitigation | ✅ Tốt | Dummy hash cho user-not-found case |
| Error handler dev-only stack | ✅ Tốt | Stack trace only in development |
| CSRF via SameSite cookie | ✅ Tốt | `sameSite: 'lax'` |
| Input validation | ✅ Tốt | express-validator + Zod |
| Helmet CSP | ✅ Tốt | Strict CSP in next.config.js |

#### Điểm yếu & Nâng cấp khuyến nghị

| # | Severity | Issue | Fix |
|---|---|---|---|
| S1 | **HIGH** | `secure: process.env.NODE_ENV === 'production'` trong cookie config — khi `NODE_ENV=production` nhưng HTTPS không được enable (VD: test environment), cookie được set với `secure=true` và bị browser từ chối. Nên dùng explicit env var `COOKIE_SECURE=true`. | Thêm `COOKIE_SECURE=true/false` env var, mặc định `true` khi `NODE_ENV=production` |
| S2 | **MEDIUM** | Không có 2FA (TOTP) cho tài khoản admin. Chỉ có email OTP cho login thường. Admin tài khoản nếu bị leak password → full access. | Thêm TOTP 2FA cho ROLE_ADMIN |
| S3 | **MEDIUM** | VNPay đang ở sandbox mode (`VNPAY_SANDBOX=1` trong .env). Nếu deploy lên production mà quên đổi → tiền thật bị redirect sang sandbox. | Thêm startup check: nếu `VNPAY_SANDBOX=1` và `NODE_ENV=production` → throw fatal error |
| S4 | **MEDIUM** | JWT access token expiry = 24h. Nếu token bị intercept trong 24h, attacker có full access. Không có token revocation (logout chỉ xóa cookie phía client). | Thêm Redis-backed token blacklist, hoặc giảm expiry xuống 1h |
| S5 | **MEDIUM** | Rate limiting chỉ áp dụng ở nginx level và 1 số endpoint auth. Nhiều endpoint API (VD: `/api/v1/posts`, `/api/v1/music/tracks`) không có rate limit riêng → có thể bị abuse. | Thêm per-user rate limiting ở application level với Redis |
| S6 | **LOW** | Không có audit log cho các action quan trọng (đổi password, đổi role, xóa data). Khó trace nếu có incident. | Thêm bảng `AuditLog` + service ghi lại admin actions |
| S7 | **LOW** | `password` field trong DB có thể đọc bởi admin (dù đã hash). Không có masking khi trả về user profile. | Thêm middleware filter loại bỏ `password` khỏi mọi response |
| S8 | **LOW** | Socket.IO `cors.origin: true` chấp nhận mọi origin. Dù Express CORS là source of truth, nhưng Socket.IO handshake vẫn có thể bị abuse từ cross-site. | Giới hạn Socket.IO CORS origin về same-origin hoặc explicit list |
| S9 | **LOW** | Không có brute-force protection cho API endpoints ngoài auth (VD: gửi 1000 request activate-code). | Thêm per-IP rate limit bằng Redis cho tất cả protected endpoints |
| S10 | **LOW** | VNPay IPN có `VNPAY_IP_ALLOWLIST` nhưng không thấy implementation code. VNPay có thể gửi IPN từ IP không có trong allowlist. | Verify IPN handler check IP against VNPay official ranges (203.171.20.0/24, 123.30.235.0/24) |

---

### 2.2 Database & ORM (Prisma)

#### Điểm mạnh

| Feature | Trạng thái |
|---|---|
| Migration workflow | ✅ Prisma Migrate |
| Connection pooling | ✅ Prisma connection pool |
| Soft deletes | ✅ `deletedAt` fields |
| Timestamps | ✅ `createdAt`/`updatedAt` on all models |
| Indexes | ✅ Composite indexes on foreign keys, unique constraints |
| pgvector | ✅ Vector embeddings cho AI similarity search |

#### Điểm yếu & Nâng cấp

| # | Severity | Issue | Fix |
|---|---|---|---|
| D1 | **HIGH** | Không có migration history thực sự — chỉ dùng `db push` trong CI. `prisma migrate` chưa bao giờ được dùng → không có `_prisma_migrations` table. Nếu cần rollback hoặc reproduce DB ở môi trường khác → khó. | Setup proper `prisma migrate` với migration files, commit vào repo. Chạy `prisma migrate dev` cho dev, `prisma migrate deploy` cho production. |
| D2 | **HIGH** | Nhiều bảng không có indexes cho query phổ biến. VD: `SocialPost` không có index trên `authorId` + `createdAt` (dùng cho feed pagination). `CourseOrder` không có index trên `userId` + `status`. | Thêm indexes cho tất cả foreign key columns và columns dùng trong WHERE/ORDER BY |
| D3 | **MEDIUM** | Không có database connection timeout config. Default Prisma timeout có thể gây hanging requests. | Thêm `connectTimeoutDb`, `socketTimeout` vào Prisma config |
| D4 | **MEDIUM** | Không có read replicas. Tất cả reads (feed, course list, music search) đánh primary DB. Scale poorly. | Cấu hình Prisma với read replica (AWS RDS Read Replica / Neon branching) |
| D5 | **MEDIUM** | Seed data không có trong migration. `prisma/seed.ts` chạy thủ công. New dev hoặc fresh DB không có data mẫu. | Tích hợp seed vào `prisma migrate deploy` lifecycle, hoặc dùng `db seed` command |
| D6 | **LOW** | `Json?` fields (VD: `socialLinks`, `preferences`) không có JSON validation ở DB level. PostgreSQL không enforce schema. | Thêm DB-level check constraints hoặc validate in service layer |
| D7 | **LOW** | Không có cascade delete config rõ ràng. Xóa user có thể leave orphaned records. | Review và set `onDelete: Cascade` hoặc `onDelete: SetNull` explicitly cho từng relation |

---

### 2.3 Backend Performance

#### Điểm mạnh

| Feature | Trạng thái |
|---|---|
| Redis caching | ✅ AI response caching, quota tracking |
| Image optimization | ✅ Sharp (resize, WebP/AVIF conversion) |
| Background jobs | ✅ Cron jobs (cleanup, analytics) |
| Connection pooling | ✅ Prisma default pool |
| Static file serving | ✅ Nginx direct serve (bypass Node.js) |
| Gzip/Brotli | ✅ Nginx level |
| CDN (R2) | ✅ Music tracks, images served from R2 |

#### Điểm yếu & Nâng cấp

| # | Severity | Issue | Fix |
|---|---|---|---|
| P1 | **HIGH** | Social feed query không có cursor-based pagination hiệu quả. `getFeed()` có thể scan toàn bộ bảng `SocialPost` khi user scroll sâu. | Implement cursor-based pagination (keyset) với index trên `(visibility, createdAt, id)` |
| P2 | **HIGH** | AI chat RAG search không có cache cho repeated queries. Mỗi lần hỏi cùng câu → vector search lại. | Thêm Redis cache cho vector search results với TTL 1h |
| P3 | **MEDIUM** | File upload không có chunked upload. Files > 100MB sẽ timeout hoặc OOM. | Implement tus.io protocol hoặc chunked upload với resumability |
| P4 | **MEDIUM** | Socket.IO room join không batch — mỗi user khi connect, backend query tất cả thread memberships rồi join từng room 1. Với user có 1000+ threads → N+1 query + N+1 socket join. | Batch join: `Promise.all(threadIds.map(id => socket.join(`thread:${id}`)))` |
| P5 | **MEDIUM** | Prisma queries có potential N+1. VD: `getCourses()` có thể trigger separate query cho mỗi course's instructor. | Dùng `include` với nested relations trong single query |
| P6 | **MEDIUM** | Không có database query monitoring (slow query log). Không biết query nào chậm. | Thêm `log: ['query', 'info', 'warn', 'error']` vào Prisma config, export sang Prometheus/DataDog |
| P7 | **MEDIUM** | AI chat history không có pagination. Khi user có 1000+ messages → response quá lớn. | Implement cursor pagination cho `/ai/chat/history/:sessionId` |
| P8 | **LOW** | `sharp` image optimization chạy synchronous trong Express request handler. Large images có thể block event loop. | Chạy `sharp` trong worker thread hoặc queue |
| P9 | **LOW** | Không có response compression ở backend (chỉ có nginx gzip). JSON responses từ backend lớn (VD: course curriculum) không được compress. | Thêm `compression` middleware vào Express (đã có import nhưng chưa thấy `app.use(compression())`) |

---

### 2.4 Frontend Quality

#### Điểm mạnh

| Feature | Trạng thái |
|---|---|
| State management | ✅ Zustand với persist |
| Server state | ✅ TanStack React Query |
| Type safety | ✅ Full TypeScript |
| Form handling | ✅ React Hook Form + Zod |
| Animation | ✅ Framer Motion |
| Error boundaries | ✅ Next.js error.tsx convention |
| SEO | ✅ Next.js App Router + metadata API |

#### Điểm yếu & Nâng cấp

| # | Severity | Issue | Fix |
|---|---|---|---|
| F1 | **HIGH** | Nhiều pages không có `error.tsx`. VD: `/courses/[slug]/page.tsx`, `/hub/page.tsx`, `/messages/page.tsx` — nếu có lỗi sẽ crash toàn bộ app. | Thêm `error.tsx` cho mọi route có dynamic data |
| F2 | **HIGH** | Social feed không có pagination (hoặc infinite scroll không có proper end-of-list handling). User scroll vô hạn → potential memory leak. | Implement proper cursor pagination với `@tanstack/react-query` infinite queries |
| F3 | **HIGH** | Component `MusicAudioController` truy cập `new Audio()` — nếu chạy SSR sẽ crash. Cần đảm bảo `typeof window !== 'undefined'` check. | Verify tất cả Audio/WebAudio code trong `useEffect` |
| F4 | **MEDIUM** | Nhiều API calls không có timeout configuration. Axios default 0 (no timeout) → hanging requests. | Thêm `axios.defaults.timeout = 15000` global config |
| F5 | **MEDIUM** | Không có loading skeleton cho major pages (courses, hub, messages). Chỉ có spinner → poor UX. | Thêm `@tanstack/react-query` skeleton loaders cho tất cả async pages |
| F6 | **MEDIUM** | Missing `alt` text trên nhiều `<img>` tags. A11y violation. | Audit toàn bộ image components, thêm descriptive alt |
| F7 | **MEDIUM** | File uploads không có progress bar. User upload 50MB → không biết bao lâu. | Implement XHR with `onuploadprogress` |
| F8 | **MEDIUM** | Modal/drawer components không có focus trap. Keyboard navigation không work đúng cho accessibility. | Thêm `@dnd-kit` focus management hoặc `focus-trap-react` |
| F9 | **MEDIUM** | Không có service worker / offline support. Khi mất mạng, app crash hoặc show blank. | Thêm Next.js offline support với `@ducanh2912/next-pwa` |
| F10 | **LOW** | Không có React.memo/useMemo cho heavy components (VD: PostCard, CourseCard list rendering 50+ items). | Wrap list items trong `React.memo`, dùng `useMemo` cho derived data |
| F11 | **LOW** | Toast messages (react-hot-toast/sonner) không có queue management. Rapid actions → stacked toasts → z-index overflow. | Limit max toasts visible, auto-dismiss with queue |
| F12 | **LOW** | Không có favicon SVG, Open Graph images cho social sharing. Share link lên Facebook/Messenger → no preview image. | Thêm `/public/favicon.ico`, `/public/og-image.png` (1200x630) |
| F13 | **LOW** | VNPay payment flow — khi redirect từ VNPay về, page reload không restore cart state. User có thể thấy empty cart dù order đã được tạo. | Lưu `pendingOrderId` vào sessionStorage trước redirect |

---

### 2.5 Infrastructure & DevOps

#### Điểm mạnh

| Feature | Trạng thái |
|---|---|
| Docker Compose orchestration | ✅ 5 services (postgres, redis, backend, frontend, nginx) |
| Health checks | ✅ Tất cả containers có healthcheck |
| Persistent volumes | ✅ Bind mount cho postgres, redis, uploads |
| CI/CD GitHub Actions | ✅ 3 workflows (CI, GHCR deploy, VPS deploy) |
| Let's Encrypt SSL | ✅ Auto-renewal via certbot |
| Nginx hardening | ✅ HSTS, TLS 1.2+, secure ciphers |
| Uptime monitoring | ✅ Sentry + cron monitor script |

#### Điểm yếu & Nâng cấp

| # | Severity | Issue | Fix |
|---|---|---|---|
| I1 | **HIGH** | Không có backup strategy thực sự. Chỉ có cron script chưa verify backup thành công. Database backup chưa rõ schedule và retention. | Setup automated daily DB backup → R2/GCS, weekly full backup, 30-day retention, monthly restore test |
| I2 | **HIGH** | Không có disaster recovery plan. Nếu VPS chết → mất everything. | Multi-region backup, Infrastructure as Code (Terraform/Pulumi), DNS failover |
| I3 | **HIGH** | GHCR workflow fail thường xuyên do container naming conflict. CI/CD không reliable. | Fix container naming collision trong GHCR workflow, thêm `docker compose down` trước `up` |
| I4 | **MEDIUM** | Không có log aggregation. Logs chỉ trong `docker logs` và `/var/log/nginx/`. Khó debug production issues. | Ship logs → Loki/ELK/DataDog hoặc CloudWatch |
| I5 | **MEDIUM** | Không có metrics/Prometheus endpoint. Không biết request latency, error rate, DB query time. | Thêm `/metrics` endpoint với `prom-client`, dashboard Grafana |
| I6 | **MEDIUM** | VPS chỉ có 4GB RAM, 4 vCPU. Backend + Frontend + DB + Redis trên cùng machine. Không có vertical scaling plan. | Monitor memory pressure, consider separating DB to dedicated instance |
| I7 | **MEDIUM** | `nginx.http.conf` là HTTP-only fallback không có WebSocket headers. Nếu SSL cert hết hạn → WebSocket hoàn toàn break. | Merge WebSocket headers vào `nginx.http.conf` |
| I8 | **MEDIUM** | Docker build không có multi-stage optimization. Image size lớn. | Dùng multi-stage Docker builds để giảm image size |
| I9 | **LOW** | Không có environment-specific configs (staging vs production). `.env` dùng chung có thể gây configuration drift. | Thêm `.env.staging`, CI/CD env vars riêng |
| I10 | **LOW** | Không có canary deployment. Deploy thẳng vào production → risk cao. | Thêm canary deployment: 5% traffic → new version → 100% |

---

### 2.6 Payment & Commerce

#### Điểm mạnh

| Feature | Trạng thái |
|---|---|
| VNPay integration | ✅ Full SDK |
| IPN verification | ✅ HMAC SHA512 |
| Idempotency | ✅ Idempotency key per order |
| Order state machine | ✅ Pending → Paid/Failed/Expired |
| Refund support | ✅ Admin refund endpoint |

#### Điểm yếu & Nâng cấp

| # | Severity | Issue | Fix |
|---|---|---|---|
| Pay1 | **HIGH** | VNPay đang sandbox. Production credentials chưa có. | Setup VNPay production account, test với amount nhỏ |
| Pay2 | **HIGH** | Không có webhook retry cho IPN failures. Nếu IPN fail lần đầu → order stuck ở pending. | Implement IPN retry queue với exponential backoff |
| Pay3 | **MEDIUM** | Không có payment email confirmation. User thanh toán xong → không có email receipt. | Thêm Resend email sau khi IPN xác nhận thành công |
| Pay4 | **MEDIUM** | Order expiry không có cron job cleanup. Pending orders older than 15 min không auto-cancel → stale data. | Thêm cron job cancel expired pending orders |
| Pay5 | **MEDIUM** | Không có discount code validation ở order creation. Discount code applied ở frontend nhưng không verify ở backend order creation. | Move discount validation vào backend order creation flow |
| Pay6 | **LOW** | VNPay return URL không verify payment status — chỉ redirect. Malicious user có thể bypass payment và access course nếu có race condition. | Return URL phải verify order status từ DB trước khi grant enrollment |

---

### 2.7 AI / Chatbot

#### Điểm mạnh

| Feature | Trạng thái |
|---|---|
| Multi-provider | ✅ OpenRouter, Groq, OpenAI, Hugging Face |
| RAG pipeline | ✅ pgvector + semantic search |
| Streaming SSE | ✅ Server-sent events for responses |
| Feedback system | ✅ Thumbs up/down + comment |

#### Điểm yếu & Nâng cấp

| # | Severity | Issue | Fix |
|---|---|---|---|
| AI1 | **HIGH** | RAG knowledge base không có periodic re-index. Documents thay đổi → search results stale. | Thêm cron job re-index knowledge base daily/weekly |
| AI2 | **HIGH** | Streaming SSE không có rate limiting per user. User spam requests → cost explode. | Thêm per-user rate limit cho AI chat (VD: 30 req/min) |
| AI3 | **MEDIUM** | Không có token counting/billing per user. AI cost không được track. | Thêm `AiUsage` table: userId, tokens, model, cost, date |
| AI4 | **MEDIUM** | AI chat sessions không có title/summary. Khó distinguish sessions. | Auto-generate session title từ first message |
| AI5 | **MEDIUM** | RAG search không có reranking. Raw similarity score không optimal cho UX. | Thêm cross-encoder reranking sau vector search |

---

## 3. BẢNG TỔNG HỢP — PRIORITY MATRIX

### Critical (Fix trong tuần này)

| ID | Category | Issue |
|---|---|---|
| I3 | CI/CD | GHCR workflow container naming conflict → deploy fail |
| S3 | Payment | VNPay sandbox → production switch risk |
| D1 | Database | No migration history — `db push` only |
| F1 | Frontend | Missing error.tsx on major routes |
| P2 | Performance | AI RAG no query cache — repeated queries hit vector DB |

### High (Fix trong 2-4 tuần)

| ID | Category | Issue |
|---|---|---|
| S1 | Security | Cookie `secure` flag tied to `NODE_ENV` |
| S4 | Security | JWT token not revocable (no blacklist) |
| P1 | Performance | Social feed no cursor pagination |
| D2 | Database | Missing indexes on FK columns |
| I1 | Infra | No verified backup strategy |
| Pay2 | Payment | No IPN retry queue |
| AI2 | AI | No rate limiting on AI chat |

### Medium (Fix trong 1-2 tháng)

| ID | Category | Issue |
|---|---|---|
| S2 | Security | No 2FA for admin accounts |
| S5 | Security | No per-user API rate limiting |
| P4 | Performance | Socket.IO N+1 room joins |
| P5 | Performance | Prisma N+1 queries |
| P6 | Performance | No slow query monitoring |
| F4 | Frontend | No axios global timeout |
| F5 | Frontend | No loading skeletons |
| D4 | Database | No read replicas |
| I4 | Infra | No log aggregation |
| I5 | Infra | No Prometheus metrics |
| I7 | Infra | HTTP fallback config missing WebSocket headers |
| Pay3 | Payment | No payment email receipt |
| Pay4 | Payment | No order expiry cleanup cron |

### Low (Fix trong 3-6 tháng)

| ID | Category | Issue |
|---|---|---|
| S6 | Security | No audit logging |
| S8 | Security | Socket.IO CORS too permissive |
| S9 | Security | No brute-force protection on non-auth endpoints |
| D6 | Database | Json fields without schema validation |
| P7 | Performance | AI chat history no pagination |
| P8 | Performance | Sharp in main thread |
| P9 | Performance | Backend missing compression middleware |
| F7 | Frontend | No upload progress bar |
| F8 | Frontend | No focus trap in modals |
| F9 | Frontend | No offline/PWA support |
| F10 | Frontend | No React.memo on list items |
| I9 | Infra | No staging environment |
| I10 | Infra | No canary deployment |
| Pay6 | Payment | Return URL verification gap |

---

## 4. KẾ HOẠCH NÂNG CẤP THEO GIAI ĐOẠN

### Giai đoạn 1 — Stabilize & Secure (Tuần 1-2)

**Mục tiêu: Fix critical production issues**

```
1. Fix GHCR workflow container conflict
   → Thêm docker compose down trước khi docker compose up
   → File: .github/workflows/deploy-ghcr.yml

2. VNPay production safety
   → Startup check: throw fatal if VNPAY_SANDBOX=1 && NODE_ENV=production
   → File: src/services/payment/vnpay.service.ts

3. Add error.tsx cho tất cả routes có dynamic data
   → Pages: /courses/[slug], /hub, /messages, /tech-trends/[id], /blog/[slug]
   → File: frontend/src/app/*/error.tsx

4. Fix Prisma migration workflow
   → Chuyển từ db push → prisma migrate
   → Tạo migration file đầu tiên từ current schema
   → File: prisma/migrations/

5. Add database indexes
   → SocialPost: (visibility, createdAt, id)
   → CourseOrder: (userId, status)
   → Enrollment: (userId, courseId)
   → MessageThread: (userA_id, updatedAt), (userB_id, updatedAt)
   → File: prisma/schema.prisma
```

### Giai đoạn 2 — Performance (Tuần 3-4)

**Mục tiêu: Tăng tốc độ load, giảm DB pressure**

```
1. Cursor pagination cho social feed
   → File: src/routes/social.routes.ts, frontend/src/components/social/Feed.tsx

2. AI RAG Redis cache
   → File: src/services/ai.service.ts

3. Prisma N+1 query fixes
   → Audit all list endpoints, add proper include/select

4. Add Prometheus metrics endpoint
   → File: src/routes/metrics.routes.ts

5. Fix axios global timeout
   → File: frontend/src/lib/api.ts
```

### Giai đoạn 3 — Payments & Commerce (Tuần 5-6)

**Mục tiêu: Production-ready payment system**

```
1. VNPay production credentials + test
2. IPN retry queue (BullMQ hoặc simple Redis queue)
3. Payment email receipt
4. Order expiry cron job
5. Discount code backend validation
```

### Giai đoạn 4 — Security Hardening (Tuần 7-8)

**Mục tiêu: Enterprise-grade security**

```
1. TOTP 2FA cho admin
   → Thêm User model: totpSecret, isTotpEnabled
   → Backend: /api/v1/auth/2fa/setup, /api/v1/auth/2fa/verify
   → Frontend: 2FA setup flow

2. Redis-backed JWT token blacklist
   → Key: `blacklist:token:${jti}`, TTL = token remaining life

3. Per-user API rate limiting
   → Redis sliding window: 100 req/min per user

4. Audit log table + service
   → Bảng: AuditLog (userId, action, resource, metadata, ip, createdAt)
```

### Giai đoạn 5 — Infrastructure (Tuần 9-10)

**Mục tiêu: Production-grade infra**

```
1. Automated backup strategy
   → Daily pg_dump → R2
   → Weekly full backup
   → Monthly restore test

2. Log aggregation (Loki/Grafana)

3. Staging environment

4. HTTP fallback nginx config (merge WebSocket headers)

5. Next.js PWA/offline support
```

### Giai đoạn 6 — Polish (Tuần 11-12)

**Mục tiêu: UX & reliability improvements**

```
1. Loading skeletons cho tất cả async pages
2. Upload progress bar
3. Focus trap trong modals
4. Favicon + Open Graph images
5. Social feed infinite scroll optimization
6. AI chat history pagination
7. AI usage tracking (token billing)
```

---

## 5. CHECKLIST TRƯỚC KHI DEPLOY

### Pre-deployment checklist

- [ ] VNPay sandbox off (`VNPAY_SANDBOX=0`) — verified in production env
- [ ] `npm run build` passes (backend TypeScript)
- [ ] `cd frontend && npm run build` passes (frontend)
- [ ] `docker compose -f docker-compose.yml config` passes
- [ ] Database migration applied (not db push)
- [ ] Indexes created (no missing FK indexes)
- [ ] Nginx config tested (`nginx -t`)
- [ ] SSL certificate valid (not expired)
- [ ] Backup chạy thành công lần gần nhất
- [ ] Error tracking (Sentry) verify sample events
- [ ] Health check endpoint returns 200
- [ ] Log rotation configured (`/var/log/nginx/*.log`)
- [ ] VPS disk space > 20% free
- [ ] Redis memory < 80% used
- [ ] Rate limits tested (auth endpoints)
- [ ] Error boundary added to new routes

---

## 6. QUICK WINS — NHỮNG THỨ CÓ THỂ FIX TRONG 1 GIỜ

```
1. Thêm error.tsx vào /courses/[slug] — 10 phút
2. Thêm global axios timeout 15000ms — 5 phút
3. Fix VNPay sandbox check → throw if production — 15 phút
4. Fix GHCR container naming conflict — 20 phút
5. Add missing alt="" to images in PostCard — 10 phút
```

---

## 7. THỨ TỰ ƯU TIÊN ĐỀ XUẤT

```
Week 1:  GHCR fix + VNPay sandbox guard + error.tsx pages + DB migration setup
Week 2:  Social feed cursor pagination + AI RAG cache + Prisma N+1 fixes
Week 3:  Prometheus metrics + axios timeout + per-user rate limiting
Week 4:  VNPay production credentials + IPN retry + email receipt
Week 5:  TOTP 2FA + JWT blacklist
Week 6+: Infrastructure (backup, logs, staging)
```

---

*Document này là snapshot đánh giá tại thời điểm 2026-06-22. Nên được cập nhật sau mỗi major release.*
