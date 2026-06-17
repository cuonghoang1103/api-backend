# 📘 TỔNG DỰ ÁN — CuongHoangDev (api-backend)

> **Cập nhật:** 17/06/2026
> **Production:** https://cuongthai.com | API: https://api.cuongthai.com
> **Tác giả:** Hoàng Nghĩa Cường (admin@cuongthai.com)
> **VPS:** 160.187.1.208 (Ubuntu 24.04, 4GB RAM, 4 vCPU) — DigitalOcean
> **Tổng số commits:** ~511 commits (tính đến 17/06/2026)

---

## 📑 MỤC LỤC

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Lịch sử khởi tạo & phát triển](#2-lịch-sử-khởi-tạo--phát-triển)
3. [Kiến trúc tổng thể](#3-kiến-trúc-tổng-thể)
4. [Cấu trúc thư mục chi tiết](#4-cấu-trúc-thư-mục-chi-tiết)
5. [Backend (Node.js/Express/TypeScript)](#5-backend-nodejsexpresstypescript)
6. [Frontend (Next.js 14)](#6-frontend-nextjs-14)
7. [Database (PostgreSQL + Prisma)](#7-database-postgresql--prisma)
8. [Infrastructure (Docker + Nginx)](#8-infrastructure-docker--nginx)
9. [CI/CD Pipeline](#9-cicd-pipeline)
10. [Sơ đồ luồng người dùng](#10-sơ-đồ-luồng-người-dùng)
11. [Sơ đồ luồng hệ thống](#11-sơ-đồ-luồng-hệ-thống)
12. [Bảo mật & xác thực](#12-bảo-mật--xác-thực)
13. [AI Chatbot & RAG](#13-aichatbot--rag)
14. [Tích hợp thanh toán](#14-tích-hợp-thanh-toán)
15. [Các tính năng chính đã xây](#15-các-tính-năng-chính-đã-xây)
16. [Lỗi đã gặp & cách fix](#16-lỗi-đã-gặp--cách-fix)
17. [Bài học kinh nghiệm](#17-bài-học-kinh-nghiệm)
18. [Đánh giá hiện trạng](#18-đánh-giá-hiện-trạng)
19. [Hướng phát triển tiếp](#19-hướng-phát-triển-tiếp)
20. [Cách tự học lại từ đầu](#20-cách-tự-học-lại-từ-đầu)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Mô tả

`cuonghoangdev/api-backend` là một **full-stack web application** đa chức năng phục vụ cho portfolio cá nhân của Hoàng Nghĩa Cường, đồng thời là **production-grade project** trình diễn các kỹ thuật phát triển web hiện đại.

### 1.2 Các con số "khủng"

| Chỉ số | Giá trị |
|---|---|
| Tổng số commits | ~511 |
| Prisma models | **74 models** |
| Backend routes | **30 route files** (`src/routes/`) |
| Backend services | **18 service files** (`src/services/`) |
| Frontend pages | **30+ pages** (`src/app/`) |
| Admin pages | **20+ pages** |
| Frontend components | **60+ components** (`src/components/`) |
| Zustand stores | **12 stores** |
| Migration files | **7 migrations** |
| CI/CD workflows | **11 workflows** |
| Helper scripts | **20 scripts** (`scripts/`) |
| Tổng dòng code backend (`src/`) | ~15.000+ dòng TypeScript |
| Tổng dòng code frontend | ~20.000+ dòng TypeScript/TSX |
| Tổng dòng Prisma schema | **1.789 dòng** |
| Tổng dòng docker-compose | ~270 dòng |

### 1.3 Domain & chức năng chính

| Tên miền | Mục đích |
|---|---|
| `cuongthai.com` | Frontend (Next.js 14 App Router) |
| `www.cuongthai.com` | Alias cho cuongthai.com |
| `api.cuongthai.com` | Backend API (Express, port 3001) |
| `160.187.1.208` | VPS IP (DigitalOcean, Ubuntu 24.04) |

### 1.4 Tính năng tổng hợp

1. **Auth đa phương thức:** Email/password + Google OAuth + GitHub OAuth + Email OTP + Forgot/Reset password
2. **Portfolio:** Blog cá nhân, Projects showcase, Skills matrix
3. **Học trực tuyến (Academy):** Khóa học, Enrollments, Bài học, Bài tập, Certificate
4. **E-Commerce (Shop):** Sản phẩm, Giỏ hàng, Đơn hàng, Discount code
5. **Music Player:** Playlist, Track, YouTube integration, 3 UI modes (Cyber/Cinematic/Premium), Mini player, History
6. **AI Chatbot:** Groq/OpenAI/OpenRouter, RAG knowledge base, streaming, multi-provider fallback, circuit breaker
7. **Direct Messaging:** Real-time chat với Socket.IO, reactions, nicknames, attachments, typing indicator
8. **Thanh toán:** VNPay integration, course orders, payment transactions, refund flow, idempotency
9. **Social Network:** Posts, comments, likes, polls, saves, shares
10. **Dev Hub:** GitHub repos list, GitHub stats, Tech trends/insights (CMS)
11. **Cyber Tools:** Task manager, profile, inventory (game-like elements)
12. **Messages Direct:** User-to-user real-time chat
13. **Admin Panel:** 20+ trang quản trị (CMS đầy đủ)
14. **Search & SEO:** robots.txt, sitemap.xml, JSON-LD, Google Indexing API auto-ping
15. **Observability:** Sentry error tracking, monitor.sh cron, UptimeRobot
16. **Backups:** Auto DB backup cron 2AM, restore scripts
17. **Tech Trends:** Full CMS cho bài viết Tech Trends/Insights
18. **SEO Tools:** Admin UI cho Google Indexing API thủ công

---

## 2. LỊCH SỬ KHỞI TẠO & PHÁT TRIỂN

### 2.1 Giai đoạn khởi tạo (commit đầu tiên)

```bash
7ae284b feat: init optimized nodejs backend with pgvector infrastructure for VPS
```

**Commit đầu tiên** đã có sẵn:
- Backend Node.js + Express + TypeScript
- pgvector infrastructure (chưa dùng nhiều, nhưng đã setup)
- Tối ưu cho VPS deployment

### 2.2 Các giai đoạn phát triển chính (tổng hợp 511 commits)

**Phase 1 — Setup & Docker (commits đầu):**
- Dockerfile.backend: alpine → debian-slim (Prisma libssl compatibility)
- docker-compose multi-service: postgres, redis, backend, frontend, nginx
- Bind mounts cho postgres/redis/uploads (data persistence)
- Zero-downtime deploy strategy
- SSL fallback (Let's Encrypt)

**Phase 2 — Backend core:**
- Models: User, Role, Auth flows
- JWT access + refresh token
- Email OTP verification
- Google/GitHub OAuth
- Prisma migrations

**Phase 3 — Frontend Next.js:**
- App Router setup
- Auth flow: login, register, verify-email, forgot-password
- Zustand stores với persist + ssrSafeStorage (cho SSR)

**Phase 4 — Tính năng chính:**
- Blog + Comments + Tags
- Projects + Skills
- Academy (Course, Lesson, Enrollment, Certificate)
- Shop (Product, Order, Discount)
- Music player (YouTube integration + Upload tracks)
- AI Chat (Groq integration)

**Phase 5 — Messaging:**
- Socket.IO integration
- Threads, Messages, Reactions, Nicknames
- Real-time typing indicator
- Read receipts

**Phase 6 — Payments:**
- VNPay integration
- Course orders
- Idempotency keys
- Refund flow

**Phase 7 — Polish & Production:**
- Sentry error tracking (frontend + backend)
- SEO: robots, sitemap, JSON-LD, OG meta, Google Indexing API
- Security headers, CSP, HSTS
- Rate limiting (3 tiers)
- Trust proxy fix (Cloudflare → Nginx → Express)

**Phase 8 — Recent additions (cuối 2026):**
- Music 3 UI modes: Cyber/Cinematic/Premium
- AI RAG knowledge base + Admin UI
- Dev Hub (GitHub repos, Tech trends)
- Direct messaging iOS-style UI
- Tech Trends CMS
- Auto Google Indexing on deploy
- AI Chat multi-provider (Groq/OpenAI/OpenRouter với circuit breaker)

### 2.3 Tổng số file & cấu trúc commit history

```
511 commits
├── Backend core: ~150 commits
├── Frontend: ~180 commits  
├── DevOps / CI/CD: ~60 commits
├── Bug fixes: ~80 commits
├── Documentation: ~40 commits
└── Refactor / cleanup: ~30 commits
```

---

## 3. KIẾN TRÚC TỔNG THỂ

### 3.1 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | **Next.js 14** (App Router, RSC), TypeScript, TailwindCSS, Framer Motion, Zustand, React Query (optional), i18n (vi/en) |
| Backend | **Node.js 22**, **Express 4**, **TypeScript 5.6**, Prisma ORM, Zod validation |
| Database | **PostgreSQL 16** (postgis/postgis:16-3.4 image) |
| Cache | **Redis 7** (ioredis) |
| AI | **Groq** (primary), **OpenAI**, **OpenRouter**, **Transformers.js** (local embeddings) |
| Storage | **Local VPS SSD** (bind mount `/opt/cuonghoangdev/uploads`) |
| Reverse Proxy | **Nginx 1.27** (SSL termination, static file serving, SSE/WebSocket proxy) |
| Container | **Docker Compose** (5 services) |
| CI/CD | **GitHub Actions** (self-hosted runner on ubuntu-24.04) |
| Monitoring | **Sentry**, **monitor.sh cron** (5min interval), **UptimeRobot** |
| Payment | **VNPay** |
| Email | **Resend** (transactional), Gmail SMTP (fallback) |
| CAPTCHA | **Cloudflare Turnstile** |
| Error tracking | **Sentry** (frontend + backend) |
| i18n | next-intl (vi/en) |

### 3.2 System Architecture Diagram

```
                          ┌──────────────────────┐
                          │   Cloudflare (DNS)   │
                          │   cuongthai.com      │
                          │   api.cuongthai.com  │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │  VPS 160.187.1.208   │
                          │  Ubuntu 24.04 4GB    │
                          │                      │
                          │  ┌────────────────┐  │
                          │  │ Nginx 1.27     │  │
                          │  │ (port 80/443)  │  │
                          │  │ - SSL term     │  │
                          │  │ - Static files │  │
                          │  │ - Rate limit   │  │
                          │  │ - Reverse proxy│  │
                          │  └───┬────────┬───┘  │
                          │      │        │      │
                          │  /   │        │ /api │
                          │      │        │      │
                          │  ┌───▼────┐ ┌─▼──────────────┐
                          │  │ NextJS │ │ Express        │
                          │  │ 14     │ │ Node.js 22     │
                          │  │:3000   │ │ :3001          │
                          │  └───┬────┘ └─┬──────────────┘
                          │      │        │
                          │      │        │ ┌─────────────┐
                          │      │        ├▶│ PostgreSQL  │
                          │      │        │ │ :5432       │
                          │      │        │ └─────────────┘
                          │      │        │ ┌─────────────┐
                          │      │        ├▶│ Redis :6379 │
                          │      │        │ └─────────────┘
                          │      │        │ ┌─────────────┐
                          │      │        ├▶│ Socket.IO   │
                          │      │        │ │ (same :3001)│
                          │      │        │ └─────────────┘
                          │      │        │ ┌─────────────┐
                          │      │        └▶│ AI Providers│
                          │      │          │ (external)  │
                          │      │          └─────────────┘
                          └──────┼──────────────────────────
                                 │
                       Bind mounts (host SSD):
                       /opt/cuonghoangdev/
                         ├── postgres/
                         ├── redis/
                         └── uploads/
                             ├── images/
                             ├── audio/
                             ├── video/
                             └── documents/
```

### 3.3 Service Ports (internal Docker network)

| Service | Internal Port | External Port | Protocol |
|---|---|---|---|
| nginx | 80, 443 | 80, 443 | HTTP/HTTPS |
| frontend | 3000 | (internal only) | HTTP |
| backend | 3001 | 3001 (VPS only) | HTTP + Socket.IO |
| postgres | 5432 | 5432 (VPS only) | PostgreSQL |
| redis | 6379 | 6379 (VPS only) | Redis |

---

## 4. CẤU TRÚC THƯ MỤC CHI TIẾT

```
/Users/admin/Downloads/api-backend/  (repo root)
│
├── .github/workflows/                # 11 CI/CD workflows
│   ├── backend-vps.yml              # Deploy backend + frontend (main flow)
│   ├── sync-frontend.yml            # Sync frontend riêng
│   ├── restart-containers.yml       # Restart all containers
│   ├── vps-force-restart.yml        # Force restart từ xa
│   ├── vps-fix-secrets.yml          # Auto-fix secrets
│   ├── vps-check-ai.yml             # Check AI provider status
│   ├── vps-debug.yml                # Generic debug
│   ├── vps-debug-nginx.yml          # Debug nginx
│   ├── vps-fix-nginx.yml            # Fix nginx container order
│   ├── vps-restart-nginx.yml        # Restart nginx only
│   └── vps-dump-env.yml             # Dump VPS env
│
├── docs/                             # 2 docs
│   ├── GOOGLE-SEARCH-CONSOLE-SETUP.md
│   └── UPTIMEROBOT-SETUP.md
│
├── frontend/                         # Next.js 14 App
│   ├── src/
│   │   ├── app/                     # 30+ pages
│   │   │   ├── (auth)/              # Auth group: login, register
│   │   │   ├── academy/             # Academy public pages
│   │   │   ├── admin/               # 20+ admin pages
│   │   │   │   ├── ai-analytics
│   │   │   │   ├── ai-knowledge     # RAG knowledge base admin
│   │   │   │   ├── course-categories
│   │   │   │   ├── course-orders    # Course orders management
│   │   │   │   ├── courses          # Courses CMS
│   │   │   │   ├── discounts
│   │   │   │   ├── embed-jobs       # RAG embed job queue
│   │   │   │   ├── lessons
│   │   │   │   ├── messages         # Admin view of all messages
│   │   │   │   ├── music            # Music admin
│   │   │   │   ├── orders           # Shop orders
│   │   │   │   ├── posts            # Blog CMS
│   │   │   │   ├── projects         # Projects CMS
│   │   │   │   ├── repos            # GitHub repos CMS
│   │   │   │   ├── seo              # Google Indexing API UI
│   │   │   │   ├── shop             # Shop products CMS
│   │   │   │   ├── skills           # Skills CMS
│   │   │   │   ├── stats            # Dashboard stats
│   │   │   │   ├── tech-trends      # Tech Trends CMS
│   │   │   │   └── users            # User management
│   │   │   ├── api/                 # Next.js API routes
│   │   │   │   ├── v1/[[...path]]   # Catch-all proxy to backend
│   │   │   │   ├── auth/            # NextAuth handlers
│   │   │   │   ├── chat/            # Chat proxy
│   │   │   │   ├── index-url        # Google Indexing API
│   │   │   │   ├── music/
│   │   │   │   └── revalidate
│   │   │   ├── blog/
│   │   │   ├── cart/                # Shopping cart
│   │   │   ├── certificates/
│   │   │   ├── chat/                # AI Chat UI
│   │   │   ├── checkout/            # Payment checkout
│   │   │   ├── courses/
│   │   │   ├── dashboard/
│   │   │   ├── dev-hub/             # GitHub repos browse
│   │   │   ├── forgot-password/
│   │   │   ├── games/               # Cyber tools
│   │   │   ├── messages/            # Direct messaging
│   │   │   ├── music/               # Music player pages
│   │   │   ├── my-courses/          # Enrolled courses
│   │   │   ├── my-orders/           # Order history
│   │   │   ├── oauth-callback/
│   │   │   ├── offline/
│   │   │   ├── payment/
│   │   │   ├── profile/
│   │   │   ├── projects/
│   │   │   ├── repos/
│   │   │   ├── reset-password/
│   │   │   ├── shop/
│   │   │   ├── social/              # Social network
│   │   │   ├── tech-trends/         # Public tech trends
│   │   │   ├── uploads/
│   │   │   ├── verify-email/
│   │   │   ├── verify-otp/
│   │   │   ├── error.tsx
│   │   │   ├── global-error.tsx
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── robots.ts            # /robots.txt
│   │   │   └── sitemap.ts           # /sitemap.xml
│   │   ├── components/             # 60+ components
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   ├── LoginRequired.tsx
│   │   │   ├── OtpInput.tsx
│   │   │   ├── TurnstileWidget.tsx
│   │   │   ├── academy/             # Academy components
│   │   │   ├── admin/               # Admin components
│   │   │   ├── auth/                # Auth components
│   │   │   ├── blog/
│   │   │   ├── chat/                # AI chat UI
│   │   │   ├── course/
│   │   │   ├── cyber/               # Cyber game UI
│   │   │   ├── dev-hub/             # GitHub repos UI
│   │   │   ├── games/
│   │   │   ├── home/
│   │   │   ├── layout/              # Header, Footer, Nav
│   │   │   ├── messaging/           # 8 components: bubbles, input, list, etc.
│   │   │   ├── music/               # 24 components: player, playlist, visualizer
│   │   │   ├── projects/
│   │   │   ├── providers/           # React Query, Theme, etc.
│   │   │   ├── repos/
│   │   │   ├── shop/
│   │   │   ├── social/
│   │   │   └── ui/                  # Generic UI components
│   │   ├── store/                  # 12 Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── cartStore.ts
│   │   │   ├── chatStore.ts
│   │   │   ├── discountStore.ts
│   │   │   ├── messagingStore.ts
│   │   │   ├── musicStore.ts
│   │   │   ├── orderStore.ts
│   │   │   ├── playlistStore.ts
│   │   │   ├── productStore.ts
│   │   │   ├── projectStore.ts
│   │   │   ├── socialStore.ts
│   │   │   └── ssrSafeStorage.ts   # Custom storage SSR-safe cho persist
│   │   ├── hooks/
│   │   ├── lib/                     # server-api.ts (catch-all proxy client)
│   │   ├── config/
│   │   ├── context/
│   │   ├── data/
│   │   ├── types/
│   │   ├── styles/
│   │   ├── i18n.ts
│   │   ├── middleware.ts            # Next.js middleware
│   │   └── instrumentation.ts       # Sentry init
│   ├── messages/
│   │   ├── en.json
│   │   └── vi.json                  # i18n
│   ├── public/
│   ├── sentry.client.config.ts
│   ├── sentry.edge.config.ts
│   ├── sentry.server.config.ts
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── Dockerfile
│
├── nginx/
│   ├── nginx.conf                   # Full Nginx config (387 dòng)
│   └── nginx.http.conf              # HTTP-only fallback (khi SSL fail)
│
├── prisma/
│   ├── schema.prisma                # 1789 dòng, 74 models
│   ├── seed.ts                      # Seed roles + admin
│   ├── seed-repos.ts                # Seed GitHub repos
│   └── migrations/                  # 7 migrations
│       ├── 20260616_add_course_order_payment
│       ├── 20260616_course_order_coupon
│       ├── 20260616_course_order_idempotency
│       ├── 20260616_course_order_refund
│       ├── 20260616_dashboard_models
│       ├── 20260616_github_repo_hub
│       └── 20260617_tech_trend_articles
│
├── scripts/                         # 20 helper scripts
│   ├── backup-cron.sh               # Auto backup 2AM
│   ├── backup-db.sh
│   ├── backup.sh
│   ├── copy-secrets.sh
│   ├── deploy-vps.sh                # Main deploy script (chạy trên VPS)
│   ├── deploy.sh                    # Old deploy
│   ├── fix-uploads-perms.sh         # Fix upload volume permissions
│   ├── mass-index-urls.sh           # Mass Google Indexing
│   ├── migrate-database.sh
│   ├── monitor.sh                   # 5-min health check
│   ├── ping-search-engines.sh
│   ├── pre-warm-node-modules.sh     # Cache npm packages
│   ├── restore-db.sh
│   ├── restore.sh
│   ├── seed-admin.cjs
│   ├── setup-server.sh              # Initial VPS setup
│   ├── test-rag.sh
│   ├── update-pg-password.py
│   ├── upload-knowledge.py          # Upload RAG docs (Python, broken)
│   └── upload-knowledge.sh          # Upload RAG docs (Bash, working)
│
├── src/                             # BACKEND
│   ├── config/
│   │   ├── database.ts              # Prisma client singleton
│   │   ├── env.ts                   # Zod-validated env config (271 dòng)
│   │   └── redis.ts                 # Redis client singleton
│   ├── middleware/
│   │   ├── auth.ts                  # JWT verification, role check
│   │   ├── captcha.ts               # Cloudflare Turnstile
│   │   ├── errorHandler.ts          # Global error handler
│   │   ├── validate.ts              # Zod validator middleware
│   │   └── vnpayIpnGuard.ts         # VNPay IPN security
│   ├── routes/                      # 30 route files
│   │   ├── academy.routes.ts        # Course/Enrollment/Certificate
│   │   ├── admin.routes.ts          # Admin operations
│   │   ├── ai.routes.ts             # AI Chat + RAG
│   │   ├── auth.routes.ts           # Login/Register/OTP
│   │   ├── blog.routes.ts
│   │   ├── certificate.routes.ts
│   │   ├── contact.routes.ts
│   │   ├── course.routes.ts
│   │   ├── cyber.routes.ts          # Game-like
│   │   ├── dashboard.routes.ts
│   │   ├── devPost.routes.ts        # Dev posts (blog-like)
│   │   ├── embedJobs.routes.ts      # RAG embed queue
│   │   ├── github.routes.ts         # GitHub API
│   │   ├── messages.routes.ts       # Direct messaging REST
│   │   ├── music-admin.routes.ts
│   │   ├── music-history.routes.ts
│   │   ├── music.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── payment.types.ts
│   │   ├── profile.routes.ts
│   │   ├── project.routes.ts
│   │   ├── quota.routes.ts          # API quota tracking
│   │   ├── shop.routes.ts
│   │   ├── skill.routes.ts
│   │   ├── social.routes.ts         # Social network
│   │   ├── system.routes.ts         # Health/system info
│   │   ├── techTrends.routes.ts     # Tech Trends CMS
│   │   └── upload.routes.ts         # File uploads
│   ├── services/                    # 18 service files
│   │   ├── ai.service.ts            # AI Chat logic, RAG, streaming
│   │   ├── aiProviders.ts           # Multi-provider + circuit breaker
│   │   ├── auth.service.ts          # JWT, password hashing
│   │   ├── captcha.service.ts       # Turnstile verify
│   │   ├── cron.service.ts          # Scheduled jobs
│   │   ├── cyber.service.ts
│   │   ├── email.service.ts         # Resend + SMTP
│   │   ├── embedQueue.service.ts    # RAG embed queue
│   │   ├── ffmpeg.service.ts        # Audio/video processing
│   │   ├── github.service.ts        # GitHub API client
│   │   ├── messages.service.ts
│   │   ├── music.service.ts
│   │   ├── otp.service.ts           # Email OTP
│   │   ├── quota.service.ts         # API quota tracking
│   │   ├── sentry.service.ts        # Sentry init
│   │   ├── social.service.ts
│   │   ├── upload.service.ts
│   │   └── payment/
│   │       └── vnpay.service.ts
│   ├── socket/
│   │   └── messaging.socket.ts      # Socket.IO setup
│   ├── types/
│   │   └── index.ts                 # Shared TS types
│   ├── utils/
│   │   ├── cidr.ts                  # IP CIDR utilities
│   │   └── dashboard.ts
│   └── index.ts                     # Express app entry point
│
├── uploads/                         # Dev only uploads (gitignored)
│
├── vps-deploy/
│   ├── .env.example                 # Template cho VPS .env
│   └── README.md
│
├── data/                            # Dev data
│
├── .cursorrules                     # AI agent rules (SSR, hydration, etc.)
├── .dockerignore
├── .env                             # Local dev env (gitignored)
├── .env.example                     # Template
├── .env.bak-pre-rotation            # Backup before rotation
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── Dockerfile                       # (Old/unused?)
├── Dockerfile.backend               # Backend build (112 dòng)
├── docker-compose.yml               # 5 services (270 dòng)
├── package.json                     # Backend deps
├── package-lock.json
├── tsconfig.json
│
├── AUTH_SETUP_GUIDE.md              # 18KB - Auth docs
├── BACKUP-VPS-CREDENTIALS.txt       # 9KB - Backup creds (gitignored ideally)
├── DEPLOY-FASTER.md                 # 762 dòng - Deploy guide
├── DEPLOY-OPTIMIZATION.md
├── Error_Sum.md                     # Error summaries
├── LOI_DA_FIX.md                    # Recent bugs fix
├── NODE_VPS_GO_LIVE_CHECKLIST.md
├── PAYMENT_FLOWS.md                 # 29KB - Payment flows
├── PAYWALL_PLAN.md                  # 23KB - Paywall design
├── PRISMA_MIGRATION_GUIDE.md
├── PROJECT_STATUS.md                # 17KB - Project status
├── QUICK-DEPLOY.md
├── README.md                        # 8.6KB
├── SECURITY_PLAN.md                 # 19KB - Security
├── SENTRY_SETUP.md
├── Tien_do_du_an.md                 # 45KB - Tiến độ (detailed)
├── fix_update.md                    # 23KB - Update notes
└── loi_thuong_gap.md                # 16KB - Common errors
```

---

## 5. BACKEND (Node.js/Express/TypeScript)

### 5.1 Entry point — `src/index.ts` (583 dòng)

**Luồng khởi động:**

```
1. Import dotenv → load .env
2. initSentry() — Sentry phải init ĐẦU TIÊN trước mọi thứ
3. BigInt.prototype.toJSON — fix serialize BigInt
4. Dynamic import config/env, config/database, middleware
5. Dynamic import 28 route files
6. Express app setup:
   - trust proxy (Cloudflare + Nginx chain)
   - helmet (security headers)
   - CORS allow-list
   - JSON parsers (10MB limit)
   - cookie-parser
   - compression (gzip level 6)
   - morgan logging
   - static /uploads (dev only)
7. Rate limiters:
   - generalLimiter (500/15min)
   - authLimiter (10/min prod, 100/min dev)
   - uploadLimiter (20/min)
8. Mount 28 routes under /api/v1/*
9. initSocketServer(server) — Socket.IO
10. Health endpoints: /health, /health/live, /health/ready
11. Sentry error handler
12. Global error handler
13. Graceful shutdown (SIGTERM/SIGINT, uncaughtException, unhandledRejection)
14. startServer():
    - connectDatabase() (Prisma)
    - Verify Prisma pool
    - Auto-sync document_chunks table (RAG)
    - Start cron jobs
    - server.listen(port)
```

### 5.2 Config — `src/config/env.ts` (271 dòng)

**Đặc điểm:**
- **Zod validation** tại startup
- Trong production: **throw error nếu thiếu** required env (fail fast)
- Trong development: log warning + continue

**Các biến quan trọng:**

```typescript
// Server
PORT, NODE_ENV

// Database
DATABASE_URL  // postgresql://...

// Auth
JWT_SECRET            // ≥32 chars
JWT_REFRESH_SECRET    // ≥32 chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

// Required secrets
SIGNED_URL_SECRET     // ≥32 chars
COOKIE_SECRET         // ≥32 chars

// AI providers
GROQ_API_KEY          // optional (priority 1)
GROQ_CHAT_MODEL=llama-3.1-8b-instant
OPENROUTER_API_KEY    // optional (priority 2)
OPENROUTER_CHAT_MODEL
OPENAI_API_KEY        // optional (priority 3)
OPENAI_CHAT_MODEL=gpt-4o-mini
GEMINI_API_KEY

// Email
RESEND_API_KEY
RESEND_FROM_EMAIL

// Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_IMAGES=10485760
MAX_FILE_SIZE_AUDIO=104857100
MAX_FILE_SIZE_VIDEO=524288000

// CORS
FRONTEND_URL
ALLOWED_ORIGINS

// Cloudflare Turnstile
TURNSTILE_SECRET_KEY
CAPTCHA_REQUIRED

// Sentry
SENTRY_DSN
SENTRY_TRACES_SAMPLE_RATE=0.1
```

### 5.3 Middleware (5 files)

| File | Chức năng |
|---|---|
| `auth.ts` | Verify JWT (access + refresh), role-based access, get current user |
| `captcha.ts` | Cloudflare Turnstile verify + role-based bypass |
| `errorHandler.ts` | Global error handler, custom AppError class, 404 handler |
| `validate.ts` | Zod schema validator middleware |
| `vnpayIpnGuard.ts` | Verify VNPay IPN signature (chống giả mạo IPN) |

### 5.4 Routes (30 files)

**Tổ chức theo prefix `/api/v1/`:**

```
/api/v1/auth          → auth.routes.ts (login, register, OTP, OAuth)
/api/v1/profile       → profile.routes.ts
/api/v1/blog          → blog.routes.ts
/api/v1/courses       → course.routes.ts
/api/v1/payments      → payment.routes.ts (VNPay)
/api/v1/academy       → academy.routes.ts (enrollments, certificates)
/api/v1/shop          → shop.routes.ts
/api/v1/music         → music.routes.ts
/api/v1/music/admin   → music-admin.routes.ts
/api/v1/music/history → music-history.routes.ts
/api/v1/ai            → ai.routes.ts (chat + RAG admin)
/api/v1/admin         → admin.routes.ts
/api/v1/admin/embed-jobs → embedJobs.routes.ts
/api/v1/admin/tech-trends → techTrendsAdminRouter
/api/v1/admin         → adminMessagesRouter (mounted twice)
/api/v1/skills        → skill.routes.ts
/api/v1/projects      → project.routes.ts
/api/v1/certificates  → certificate.routes.ts
/api/v1/contact       → contact.routes.ts
/api/v1/files         → upload.routes.ts (uploadLimiter)
/api/v1/dev-posts     → devPost.routes.ts
/api/v1/tech-trends   → techTrendsPublicRouter
/api/v1/system        → system.routes.ts (health, info)
/api/v1/social        → social.routes.ts
/api/v1/repos         → github.routes.ts
/api/v1/dashboard     → dashboard.routes.ts
/api/v1/cyber         → cyber.routes.ts (game-like)
/api/v1/quota         → quota.routes.ts
/api/v1/messages      → messages.routes.ts (REST)
```

### 5.5 Services (18 files)

| Service | Chức năng chính |
|---|---|
| `auth.service.ts` | JWT sign/verify, password hash (bcrypt), refresh token rotation |
| `ai.service.ts` | AI Chat, RAG (document_chunks), SSE streaming, prompt engineering |
| `aiProviders.ts` | Multi-provider (Groq/OpenAI/OpenRouter) + circuit breaker (502 dòng) |
| `messages.service.ts` | Thread/Message CRUD, reactions, nicknames |
| `payment/vnpay.service.ts` | VNPay integration, IPN verify |
| `upload.service.ts` | Multer setup, file validation, virus scan (optional) |
| `ffmpeg.service.ts` | Audio/video processing (metadata, thumbnails) |
| `github.service.ts` | GitHub API client (rate limit handling, caching) |
| `email.service.ts` | Resend (transactional) + SMTP fallback |
| `otp.service.ts` | Email OTP generation, hashing, TTL |
| `captcha.service.ts` | Cloudflare Turnstile verify |
| `sentry.service.ts` | Sentry init, capture, flush |
| `cron.service.ts` | Scheduled jobs (cleanup, refresh tokens, etc.) |
| `cyber.service.ts` | Game-like logic (XP, levels, inventory) |
| `social.service.ts` | Posts, comments, likes, polls |
| `music.service.ts` | Tracks, playlists, YouTube metadata |
| `quota.service.ts` | API quota tracking (per-user) |
| `embedQueue.service.ts` | RAG embed job queue |

### 5.6 Socket.IO — `src/socket/messaging.socket.ts`

**Setup:**
- Mount trên cùng HTTP server (port 3001) với Express
- Reuse CORS + trust proxy + cookie config
- JWT auth từ `auth_token` cookie
- Namespace: `/` (default)

**Events:**

**Client → Server:**
- `thread:join` — Join thread room
- `thread:leave` — Leave thread room
- `message:send` — Send message (real-time)
- `message:typing` — Typing indicator
- `message:read` — Mark as read
- `reaction:add/remove` — React to message
- `nickname:set` — Set thread nickname

**Server → Client:**
- `message:new` — New message broadcast
- `message:typing` — User typing
- `message:read` — Read receipt
- `reaction:update` — Reaction updated
- `presence:update` — User online/offline

---

## 6. FRONTEND (Next.js 14)

### 6.1 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.6
- **Styling:** TailwindCSS 3
- **Animation:** Framer Motion
- **State:** Zustand (12 stores) + React Query (optional)
- **i18n:** next-intl (vi/en)
- **Icons:** lucide-react
- **Auth cookies:** httpOnly + Secure
- **Error tracking:** Sentry (client/edge/server)
- **CAPTCHA:** Cloudflare Turnstile widget

### 6.2 Routing Structure

```
/                          → Homepage (hero, projects preview, etc.)
/login, /register          → Auth (in (auth) group)
/forgot-password, /reset-password
/verify-email, /verify-otp
/oauth-callback

/blog                      → Blog list
/blog/[slug]               → Blog detail
/comments/[postId]         → Comments

/projects                  → Projects portfolio
/projects/[id]             → Project detail

/skills                    → Skills matrix

/courses                   → Course catalog
/courses/[id]              → Course detail
/my-courses                → Enrolled courses
/courses/[id]/lessons/[lessonId]
/academy                   → Academy public
/academy/[slug]
/certificates              → My certificates

/shop                      → Shop catalog
/shop/[id]                 → Product detail
/cart                      → Shopping cart
/checkout                  → Checkout
/payment/[orderId]         → Payment status
/my-orders                 → Order history

/music                     → Music player
/music/[playlistId]        → Playlist view

/messages                  → Direct messaging (Socket.IO)
/messages/[threadId]       → Thread view

/chat                      → AI Chat UI
/chat/[sessionId]

/dev-hub                   → GitHub repos browse
/dev-hub/[repoName]
/repos                     → GitHub repos list
/repos/[id]
/tech-trends               → Public tech trends
/tech-trends/[slug]

/social                    → Social network
/social/[postId]

/games                     → Cyber tools
/dashboard                 → User dashboard

/profile                   → User profile
/profile/[username]

/uploads                   → User uploads list

/admin                     → Admin panel (20+ sub-pages)

/api/v1/[[...path]]        → Catch-all proxy to backend
/api/v1/files             → File upload
/api/v1/music             → Music
/api/v1/orders            → Orders
/api/v1/profile           → Profile
/api/v1/social            → Social
/api/auth/...             → NextAuth handlers
/api/chat                 → Chat proxy
/api/index-url            → Google Indexing API
/api/revalidate           → On-demand ISR

/offline                   → PWA offline page

/robots.txt                → robots.ts
/sitemap.xml               → sitemap.ts
```

### 6.3 Zustand Stores (12 stores)

| Store | Quản lý |
|---|---|
| `authStore.ts` | User, token, role, isAuthenticated, isLoading |
| `cartStore.ts` | Cart items, quantities, totals |
| `chatStore.ts` | AI chat sessions, messages |
| `discountStore.ts` | Discount codes |
| `messagingStore.ts` | Threads, current thread, unread count |
| `musicStore.ts` | Current track, queue, player state |
| `orderStore.ts` | Orders list |
| `playlistStore.ts` | Playlists CRUD |
| `productStore.ts` | Products list, filters |
| `projectStore.ts` | Projects portfolio |
| `socialStore.ts` | Posts, comments, likes |
| `ssrSafeStorage.ts` | Custom storage cho SSR (fix hydration) |

### 6.4 i18n (vi/en)

- Folder: `frontend/messages/`
- File: `vi.json`, `en.json`
- Switcher: `<LanguageSwitcher />`
- Default: Vietnamese (theo audience của Hoàng Nghĩa Cường)

### 6.5 Catch-all Proxy Pattern — `src/app/api/v1/[[...path]]/route.ts`

**Vấn đề:** Cross-origin cookie không được browser gửi theo mặc định.
**Giải pháp:** Catch-all proxy trong Next.js API route.

**Flow:**
```
Browser (cuongthai.com/admin/ai-knowledge)
  ↓ fetch('/api/v1/ai/admin/documents', { credentials: 'include' })
Next.js API route (/api/v1/[[...path]]/route.ts)
  ↓ Đọc cookie `backend_token` server-side
  ↓ Forward đến http://backend:3001/api/v1/ai/admin/documents
  ↓ Header: Authorization: Bearer <token>
Backend xử lý → trả về JSON
```

**Lợi ích:**
- Cookie httpOnly không lộ ra JavaScript
- Không cần CORS `credentials: 'include'` phức tạp
- Áp dụng cho tất cả admin pages

### 6.6 SSR Safety Pattern

Quy tắc quan trọng trong `.cursorrules`:

```typescript
// ❌ SAI: localStorage trực tiếp trong body → hydration mismatch
const [token, setToken] = useState(localStorage.getItem('token'));

// ✅ ĐÚNG: SSR-friendly với useEffect + mounted check
const [mounted, setMounted] = useState(false);
const [token, setToken] = useState<string | null>(null);

useEffect(() => {
  setMounted(true);
  setToken(localStorage.getItem('token'));
}, []);

// Trong render:
if (!mounted) return <Skeleton />;
```

**Custom storage:**
```typescript
// src/store/ssrSafeStorage.ts
// Tự check typeof window trước khi access localStorage
// Tránh hydration mismatch khi server render
```

---

## 7. DATABASE (PostgreSQL + Prisma)

### 7.1 Tổng quan Schema — `prisma/schema.prisma`

- **1.789 dòng**
- **74 models**
- **7 migrations** (2026-06-16 và 2026-06-17)
- **PostgreSQL provider** (chưa dùng pgvector thực tế, dùng JSONB)

### 7.2 Phân nhóm models (74 models)

#### 1. Users & Auth (5 models)
```
Role, User, UserRole, PasswordResetToken, EmailVerificationToken
```

#### 2. Cyber Game (3 models)
```
CyberProfile, CyberTask, CyberInventory
```
- Game-like elements: XP, levels, tasks, inventory

#### 3. Blog (7 models)
```
FileAttachment, Category, Post, Tag, PostTag, Comment
```
- Multi-category, multi-tag
- Comments có thể nested

#### 4. Portfolio (3 models)
```
Skill, Project, ProjectSkill
```

#### 5. Academy / E-Learning (10 models)
```
CourseCategory, Semester, Course, CourseSection, Lesson, LessonDetail,
CourseDocument, Enrollment, LessonProgress, Assignment, AssignmentSubmission,
Certificate, CourseReview, CourseTag
```
- Đầy đủ: course → section → lesson → progress → certificate
- Có assignment + submission
- Course review + tag

#### 6. Shop / E-Commerce (5 models)
```
ProductCategory, Product, ShopOrder, ShopOrderItem, DiscountCode
```

#### 7. Music (5 models)
```
MusicTrack, MusicPlaylist, MusicPlaylistTrack, MusicHistory
```

#### 8. Dev Posts (3 models)
```
DevPost, PostComment
```
- Blog riêng cho dev (technical posts)

#### 9. AI Chat (6 models)
```
ChatSession, ChatMessage, ChatFeedback, ChatAnalytics, AiConfig, AiPrompt
```

#### 10. RAG Knowledge Base (1 model)
```
DocumentChunk
  - id, content, metadata, chunk_index, document_id, document_type
  - embedding (JSONB array 384/768 dims)
```

#### 11. Social Network (10 models)
```
SocialPost, SocialMedia, SocialLike, SocialComment, SocialCommentLike,
SocialSave, SocialShare, SocialPoll, SocialPollOption, SocialPollVote
```

#### 12. Contact (1 model)
```
ContactSubmission
```

#### 13. Direct Messaging (6 models)
```
MessageThread, Message, ThreadNickname, MessageReaction,
MessageAttachment, MessageRead
```

#### 14. Payments (2 models)
```
CourseOrder, PaymentTransaction
```
- Idempotency, refund

#### 15. GitHub Hub (2 models)
```
GithubRepo, GithubRepoTag
```

#### 16. Dashboard (3 models)
```
DashboardState, DashboardTask, DashboardCelebration
```
- Personal dashboard cho user

#### 17. Tech Trends (1 model)
```
TechTrendArticle
```
- CMS cho tech articles

### 7.3 Migrations

| Date | Migration | Purpose |
|---|---|---|
| 2026-06-16 | `add_course_order_payment` | Course orders + payment |
| 2026-06-16 | `course_order_coupon` | Discount for courses |
| 2026-06-16 | `course_order_idempotency` | Idempotency keys |
| 2026-06-16 | `course_order_refund` | Refund flow |
| 2026-06-16 | `dashboard_models` | Dashboard tables |
| 2026-06-16 | `github_repo_hub` | GitHub repos tables |
| 2026-06-17 | `tech_trend_articles` | Tech Trends CMS |

### 7.4 Auto-sync Table (RAG)

Trong `src/index.ts` startServer(), có auto-sync:

```typescript
await prisma.$executeRawUnsafe(`
  CREATE TABLE IF NOT EXISTS document_chunks (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    chunk_index INTEGER NOT NULL,
    document_id VARCHAR(100) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ALTER TABLE document_chunks ADD COLUMN IF NOT EXISTS embedding JSONB;
`);
```

→ Cho phép thêm table mới mà không cần Prisma migration (idempotent).

---

## 8. INFRASTRUCTURE (Docker + Nginx)

### 8.1 Docker Compose — `docker-compose.yml` (270 dòng)

**5 services:**

| Service | Image | Memory limit | Health check |
|---|---|---|---|
| `postgres` | postgis/postgis:16-3.4 | 2GB | `pg_isready` |
| `redis` | redis:7-alpine | 512MB | `redis-cli ping` |
| `backend` | (built from Dockerfile.backend) | 1GB | `curl /health` |
| `frontend` | (built from frontend/Dockerfile) | 1.5GB | `wget /` |
| `nginx` | nginx:1.27-alpine | 256MB | `wget https://localhost` |

**Bind mounts (host SSD):**
- `postgres_data` → `/opt/cuonghoangdev/postgres`
- `redis_data` → `/opt/cuonghoangdev/redis`
- `uploads_data` → `/opt/cuonghoangdev/uploads`

**Network:** Custom bridge `cuonghoangdev_network` (alias cho internal DNS)

**Important: `env_file: /opt/cuonghoangdev/.env`** → Inject tất cả env từ file này (override `environment:` block).

### 8.2 Backend Dockerfile — `Dockerfile.backend` (112 dòng)

**2 stages:**
- **Stage 1 (builder):** `node:22-slim` + build tools + `npm ci` + `prisma generate` + `tsc`
- **Stage 2 (runner):** `node:22-slim` + curl + tini + non-root user (uid 1001)

**Đặc điểm:**
- Multi-stage build (image nhỏ)
- Offline fallback: copy từ `/app-host-cache` nếu npm offline
- Healthcheck: `curl http://localhost:3001/health`
- `NODE_OPTIONS=--max-old-space-size=1536` (1.5GB heap)
- `fix-uploads-perms.sh` entrypoint (fix macOS uid permission issue)

### 8.3 Frontend Dockerfile — `frontend/Dockerfile`

**3 stages:**
- Stage 1 (deps): `node:22-alpine` + `npm install` với offline fallback
- Stage 2 (builder): `node:22-alpine` + `npm run build` (Next.js standalone)
- Stage 3 (runner): `node:22-alpine` + Next.js standalone server

**Build args:**
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_YOUTUBE_API_KEY`
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- OAuth client IDs/secrets
- `NEXT_PUBLIC_SENTRY_DSN` (inlined vào bundle)

### 8.4 Nginx Config — `nginx/nginx.conf` (387 dòng)

**Responsibilities:**

1. **SSL termination** (Let's Encrypt)
2. **HTTP → HTTPS redirect** (301)
3. **Static file serving** `/uploads/*` (bypass Node.js)
4. **Reverse proxy** to frontend + backend
5. **Gzip compression** (level 6)
6. **Rate limiting** zones (api, auth, general)
7. **Cache headers**:
   - `_next/static/*` → 1 year immutable
   - HTML → no-cache
   - Images → 1 year
   - Videos → 1 day
   - Documents → 30 days
8. **SSE streaming** (no buffering)
9. **WebSocket** (Socket.IO support)
10. **Security headers**: HSTS, X-Frame-Options, X-Content-Type-Options
11. **Course document protection**: `/uploads/lesson-documents/` → 403 (must go through backend enrollment check)

### 8.5 Upstream blocks

```nginx
upstream frontend {
    server frontend:3000;  # Docker DNS
    keepalive 32;
}

upstream backend {
    server backend:3001;
    keepalive 32;
}
```

→ Container names được resolve bởi Docker DNS trong network `cuonghoangdev_network`.

---

## 9. CI/CD PIPELINE

### 9.1 GitHub Secrets (12 secrets)

| Secret | Mục đích |
|---|---|
| `VPS_HOST` | VPS IP |
| `VPS_USER` | SSH user |
| `VPS_SSH_PRIVATE_KEY` | SSH key (base64) |
| `DATABASE_URL` | PostgreSQL URL |
| `POSTGRES_PASSWORD` | DB password |
| `JWT_SECRET` | JWT signing |
| `JWT_REFRESH_SECRET` | Refresh token |
| `COOKIE_SECRET` | Cookie signing |
| `SIGNED_URL_SECRET` | Signed URLs |
| `YOUTUBE_API_KEY` | YouTube Data API |
| `GROQ_API_KEY` | AI chat (primary) |
| `OPENROUTER_API_KEY` | AI chat (fallback) |
| `OPENAI_API_KEY` | AI chat (fallback) |
| `GEMINI_API_KEY` | Embeddings (legacy) |
| `SENTRY_DSN` | Error tracking |

### 9.2 Workflows (11 workflows)

#### Main flow: `backend-vps.yml`

**Trigger:**
- Push to `main` matching paths: `src/**`, `prisma/**`, `package*.json`, `Dockerfile.backend`, `docker-compose.yml`, `frontend/**`, `nginx/**`, `.github/workflows/backend-vps.yml`, `scripts/**`, `.dockerignore`
- Manual: `workflow_dispatch`

**Steps (13 steps):**

```
1. Checkout repo
2. Setup Node.js 22
3. Setup SSH key (decode base64, ssh-keyscan)
4. Verify SSH connection
5. Build backend TypeScript
   - npm ci
   - prisma generate
   - tsc compile
   - Verify compiled routes (grep checks)
6. Build Next.js frontend
   - cd frontend
   - npm ci
   - NEXT_PUBLIC_BUILD_ID=$(date +%s) npm run build
7. Sync project to VPS (rsync)
8. Deploy frontend artifacts (tar.gz → VPS)
9. Create .env on VPS if missing
10. Update .env on VPS with secrets
    - Inject GROQ_API_KEY, OPENAI_API_KEY, OPENROUTER_API_KEY
    - Inject JWT_SECRET, JWT_REFRESH_SECRET, COOKIE_SECRET, SIGNED_URL_SECRET
    - Auto-generate SIGNED_URL_SECRET/COOKIE_SECRET if missing
11. Upload swap setup script
12. Upload deploy script
13. Deploy backend (dist injected into container)
    - tar.gz dist → VPS
    - docker cp dist/ → backend container
    - docker restart backend
    - Wait for /health
    - Verify admin/projects route
14. Sync .next/ into frontend container
    - docker cp .next → frontend container
    - docker restart frontend
15. Setup cron jobs on VPS
    - Backup at 2AM daily
    - Monitor every 5min
```

**Output:** Production deployed, tất cả containers healthy.

#### Other workflows:

| Workflow | Trigger | Mục đích |
|---|---|---|
| `vps-force-restart.yml` | Manual | Force restart all containers |
| `vps-fix-secrets.yml` | Manual | Auto-fix missing secrets |
| `vps-check-ai.yml` | Manual | Check AI provider status |
| `vps-debug.yml` | Manual | Generic debug |
| `vps-debug-nginx.yml` | Manual | Debug nginx config |
| `vps-fix-nginx.yml` | Manual | Fix nginx container order (restart in correct order) |
| `vps-restart-nginx.yml` | Manual | Restart nginx only |
| `vps-dump-env.yml` | Manual | Dump all VPS env vars |
| `sync-frontend.yml` | Manual | Sync frontend only |
| `restart-containers.yml` | Manual | Restart all containers |

### 9.3 Deploy Strategy

**Zero-downtime approach:**
1. Build code on CI (TypeScript → JS)
2. Rsync to VPS
3. Copy fresh `dist/` vào RUNNING container (không restart trước)
4. `docker restart backend` → 5-10s downtime
5. Health check loop (12 × 5s)
6. Same cho frontend

**Caveat:** Vẫn có downtime ngắn (~10s). Để 100% zero-downtime cần blue-green hoặc load balancer.

---

## 10. SƠ ĐỒ LUỒNG NGƯỜI DÙNG

### 10.1 User Journey: First-time visitor

```
Visit https://cuongthai.com
  ↓
Trang chủ (homepage)
  ├── Hero section + intro
  ├── Featured projects
  ├── Skills matrix
  └── Call-to-action: "Liên hệ", "Xem dự án"
  ↓
Có thể:
  ├── Đăng ký / Đăng nhập → xem được nhiều tính năng hơn
  ├── Xem Projects, Blog, Tech Trends, Repos (public)
  ├── Chat AI (public)
  ├── Nghe nhạc (public)
  ├── Mua sản phẩm (cần login)
  └── Gửi contact form
```

### 10.2 User Journey: Đăng ký / Login

```
/register
  ↓
Nhập email + password + Turnstile CAPTCHA
  ↓
POST /api/v1/auth/register
  ↓ Backend
  - Validate input (Zod)
  - Hash password (bcrypt)
  - Create user
  - Generate OTP
  - Send OTP via email (Resend)
  ↓
Response: "Đăng ký thành công, check email"
  ↓
Redirect → /verify-otp
  ↓
Nhập 6-digit OTP
  ↓
POST /api/v1/auth/verify-otp
  ↓ Backend
  - Verify OTP (hash compare, TTL check)
  - Mark email_verified = true
  - Issue JWT access + refresh tokens
  - Set httpOnly cookies: backend_token, refresh_token
  ↓
Redirect → /
  ↓
User đã authenticated → có thể:
  - Sử dụng mọi tính năng
  - Chat AI (với RAG context cá nhân)
  - Nhắn tin với user khác
  - Mua hàng
```

### 10.3 User Journey: Chat AI

```
/chat
  ↓
User gõ: "CuongHoangDev là ai?"
  ↓
Frontend: fetch('/api/v1/ai/chat', { message: "..." })
  ↓ Next.js catch-all proxy
Backend: POST /api/v1/ai/chat
  ↓
1. Verify JWT (from cookie)
2. Check rate limit (quota.service)
3. Retrieve RAG context (cosine similarity search trên document_chunks)
  - Query top 5 chunks relevant
4. Build prompt:
  - System: "Bạn là trợ lý AI của CuongHoangDev..."
  - Context: "Dưới đây là thông tin liên quan: ...chunks..."
  - User: "CuongHoangDev là ai?"
5. Call AI provider (Groq → OpenRouter → OpenAI fallback)
  - Streaming response (SSE)
  ↓
Return chunks as SSE: data: {type:"chunk", text:"..."}
  ↓
Frontend nhận stream → render real-time
```

### 10.4 User Journey: Mua khóa học

```
/courses → chọn course
  ↓
Click "Đăng ký" → /courses/[id]/enroll
  ↓
POST /api/v1/academy/enrollments
  ↓ Backend
  - Check user đã enroll chưa
  - Check course có free không
  - Nếu free → enroll luôn
  - Nếu paid → tạo CourseOrder (status=PENDING) + PaymentTransaction
  ↓
Redirect → /checkout/[orderId]
  ↓
User chọn payment method:
  ├── VNPay
  └── ...
  ↓
POST /api/v1/payments/create
  ↓ Backend
  - Call VNPay API → nhận payment URL
  - Return URL
  ↓
Redirect → VNPay gateway
  ↓
User thanh toán trên VNPay
  ↓
VNPay IPN → POST /api/v1/payments/vnpay-ipn
  ↓ Backend
  - Verify signature (vnpayIpnGuard)
  - Update CourseOrder → PAID
  - Create Enrollment
  - Issue Certificate (nếu eligible)
  ↓
User redirect về /payment/success
  ↓
User vào /my-courses → thấy khóa học active
```

### 10.5 User Journey: Direct Messaging

```
User A ở /profile/[username-B]
  ↓
Click "Nhắn tin"
  ↓
Frontend: messagingStore.openThread(userId_B)
  ↓
POST /api/v1/messages/threads (create or get)
  ↓ Backend
  - Check existing thread (giữa A và B)
  - Nếu chưa có → create MessageThread
  - Return thread
  ↓
Socket.IO: A join room `thread:{threadId}`
  ↓
A gõ message → emit 'message:send'
  ↓ Backend
  - Persist Message
  - Broadcast 'message:new' to room
  ↓
B nhận được (real-time qua Socket.IO)
  ↓
B gõ reply → tương tự
```

---

## 11. SƠ ĐỒ LUỒNG HỆ THỐNG

### 11.1 Request Flow (chi tiết)

```
User browser (cuongthai.com)
  ↓ HTTPS
Cloudflare DNS → IP VPS
  ↓
Nginx (port 443, SSL termination)
  ↓
  ├── Static files (/uploads/*, /_next/static/*) → serve directly
  │
  ├── HTML/SSR pages → proxy to frontend:3000 (Next.js)
  │     │
  │     └── Next.js:
  │         ├── RSC (React Server Components) → fetch from backend
  │         │     ↓ (using INTERNAL_BACKEND_URL = http://backend:3001)
  │         │   Backend API
  │         │
  │         └── Client components → fetch /api/v1/... (relative)
  │             ↓
  │             Next.js catch-all proxy /api/v1/[[...path]]/route.ts
  │             ↓ Đọc httpOnly cookie `backend_token`
  │             ↓ Forward to backend:3001/api/v1/...
  │               with header: Authorization: Bearer <token>
  │
  └── API calls (/api/v1/*) → proxy to backend:3001 (Express)
        │
        ├── Auth (rate-limited 10/min)
        ├── Upload (rate-limited 20/min)
        ├── SSE streaming (no buffering)
        ├── Socket.IO WebSocket (24h timeout)
        │
        └── Express routes (30+):
            ├── Validate (Zod middleware)
            ├── Auth check (JWT middleware)
            ├── Business logic (services)
            ├── Database (Prisma)
            ├── Cache (Redis)
            └── Response (JSON / SSE)
```

### 11.2 Database Schema Diagram (high-level)

```
User ──┬── UserRole ── Role
       ├── EmailVerificationToken
       ├── PasswordResetToken
       └── MessageThread (via participants)
            └── Message ──┬── MessageReaction
                          └── MessageAttachment

User ── Course ── CourseSection ── Lesson ── LessonDetail
   │              │                │            │
   │              ├── CourseTag    ├── LessonProgress
   │              └── CourseReview │            │
   │                                └── Assignment ── AssignmentSubmission
   └── Enrollment                                │
        └── Certificate                          └── CourseDocument

User ── ShopOrder ── ShopOrderItem ── Product ── ProductCategory
   │                                              └── DiscountCode
   └── CourseOrder ── PaymentTransaction (VNPay)

User ── MusicPlaylist ── MusicPlaylistTrack ── MusicTrack
   │
   └── MusicHistory

User ── ChatSession ── ChatMessage
   │      └── ChatFeedback
   │      └── ChatAnalytics
   └── DocumentChunk (RAG KB - shared)

User ── SocialPost ──┬── SocialLike
                    ├── SocialComment ── SocialCommentLike
                    ├── SocialSave
                    ├── SocialShare
                    └── SocialPoll ── SocialPollOption ── SocialPollVote

GithubRepo ── GithubRepoTag
TechTrendArticle
DashboardState ── DashboardTask ── DashboardCelebration

ContactSubmission
CyberProfile ── CyberTask ── CyberInventory
FileAttachment
Category ── Post ── PostTag ── Tag
       └── PostComment

Skill ── ProjectSkill ── Project
```

### 11.3 AI Chat Streaming Flow (chi tiết)

```
Frontend (chat/page.tsx)
  ↓ POST /api/v1/ai/chat
Next.js proxy (api/v1/[[...path]]/route.ts)
  ↓ Đọc cookie, forward
Backend (routes/ai.routes.ts)
  ↓ POST /chat handler
ai.service.ts → chatWithRAG()
  ↓
  1. Quota check (Redis)
  2. Create ChatSession (DB) if needed
  3. RAG retrieval:
     a. generateQueryEmbedding(text)
        - Lazy load @xenova/transformers (ONNX model)
        - Compute 384-dim embedding (local, no API)
     b. Cosine similarity search in document_chunks
     c. Top 5 relevant chunks
  4. Build prompt:
     - System: base + RAG context
     - History: last N messages
     - User: latest message
  5. aiProviders.chatWithFallback()
     ↓
     For each provider (Groq → OpenRouter → OpenAI):
       a. Check circuit breaker (skip if OPENED)
       b. Call OpenAI-compatible API with streaming
       c. Yield each token → SSE
       d. On error → trip circuit, try next provider
     ↓
     Return AsyncIterable<string>
  6. Set SSE headers
  7. Stream chunks to client
  8. Persist ChatMessage (DB) on done
  9. Update quota usage (Redis)
  10. ChatAnalytics update
```

---

## 12. BẢO MẬT & XÁC THỰC

### 12.1 Authentication Stack

| Layer | Mechanism |
|---|---|
| Password | bcrypt (cost factor 10) |
| Session | JWT access (24h) + refresh (7d) |
| Storage | httpOnly + Secure cookies (`backend_token`, `refresh_token`) |
| OAuth | Google + GitHub (NextAuth or custom) |
| Verification | Email OTP (6 digits, 10 min TTL, hashed) |
| CAPTCHA | Cloudflare Turnstile (skip for admin emails) |
| Lockout | 5 failed logins → 15 min lockout |
| Tracking | lastLoginAt, lastLoginIp, lastLoginUserAgent |

### 12.2 Authorization

- **Role-based:** `Role` table → UserRole mapping
- **Roles:** `admin`, `user` (default), possibly `moderator`
- **Admin check:** `ADMIN_EMAILS` env → check against user.email
- **Per-resource:** Owner check (e.g., chỉ edit own posts)

### 12.3 Security Headers (helmet + Nginx)

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: (Next.js handles)
```

### 12.4 Rate Limiting

| Endpoint | Limit | Window |
|---|---|---|
| General `/api/*` | 500 req | 15 min |
| Auth (login/register/OTP/etc) | 10 req (prod) | 1 min |
| Auth (dev/local) | 100 req | 1 min |
| Upload `/api/v1/files` | 20 req | 1 min |
| Nginx `auth` zone | 5 req | 1 min |
| Nginx `api` zone | 30 req | 1 sec |
| Nginx `general` zone | 60 req | 1 sec |

### 12.5 Trust Proxy Fix (quan trọng)

**Stack:** Cloudflare edge → Nginx → Express

**Problem:**
- Default `trust proxy = false` → `req.ip` = Nginx IP → all users share same IP
- Hoặc `trust proxy = 1` → trust only Nginx, but not Cloudflare
- Rate limit collapses all users into 1 bucket

**Solution:**
```typescript
app.set('trust proxy', (ip, hop) => {
  if (hop <= 1) return true;  // Trust 1 hop (Nginx) or fewer
  return false;
});
```

### 12.6 VNPay IPN Security

- Verify signature từ VNPay (`vnp_SecureHash`)
- Check `vnp_TmnCode` matches
- Check `vnp_Amount` matches order
- Idempotency: check `PaymentTransaction.vnp_TxnRef` unique

### 12.7 Course Document Protection

`/uploads/lesson-documents/` → trả 403 (phải qua backend enrollment check):

```nginx
location ^~ /uploads/lesson-documents/ {
    return 403;
}
```

`^~` modifier critical — match prefix trước regex khác.

---

## 13. AI CHATBOT & RAG

### 13.1 AI Providers (3 providers + circuit breaker)

**Priority order:**
1. **Groq** (`gsk_...`) — fastest, free tier
2. **OpenRouter** (`sk-or-v1-...`) — multi-model fallback
3. **OpenAI** (`sk-proj-...`) — paid, highest quality

**Default model:** `llama-3.1-8b-instant`

**Circuit breaker:**
- 2 consecutive failures → OPEN circuit
- Cooldown: AUTH 5min, RATE_LIMIT 60s, SERVER_ERROR 60s, TIMEOUT 30s
- Half-open after cooldown

**Retry logic:**
- 3 retries per provider
- Exponential backoff: 1s, 2s, 4s
- Skip retry for AUTH errors

### 13.2 RAG (Retrieval-Augmented Generation)

**Knowledge base:** `document_chunks` table
- 7 documents currently uploaded
- 17 chunks total
- Embedding dim: 384 (Xenova/all-MiniLM-L6-v2, local ONNX)

**Flow:**
```
User question
  ↓
1. Compute embedding (local, ONNX)
2. Cosine similarity search vs all chunks
3. Top 5 relevant chunks (threshold 0.7)
4. Build prompt with context
5. Call AI provider
6. Return answer with chunk citations
```

**Documents uploaded:**
| ID | Type | Chunks |
|---|---|---|
| bio-overview-2026 | personal_bio | 2 |
| contact-info-2026 | contact | 2 |
| skills-tech-2026 | skills | 2 |
| projects-portfolio-2026 | projects | 3 |
| pricing-services-2026 | pricing | 3 |
| education-fpt-2026 | education | 2 |
| faq-how-can-i-help-2026 | faq | 3 |

**Admin UI:** `/admin/ai-knowledge` — upload, view, delete chunks

**Embed Jobs:** `/admin/embed-jobs` — background queue for large uploads

### 13.3 Document Chunking

**Algorithm:**
- Split text by sentences
- Group sentences into chunks of ~1000 chars
- Overlap: 200 chars between chunks
- Each chunk: `content`, `chunk_index`, `document_id`, `document_type`, `embedding` (JSONB)

**Bug fix:** Infinite loop in chunkText() when `overlap >= chunkSize` → validate + safety check.

---

## 14. TÍCH HỢP THANH TOÁN

### 14.1 VNPay Integration

**Flow:**
```
User checkout
  ↓
POST /api/v1/payments/create
  ↓ Backend
  - Create CourseOrder (status=PENDING)
  - Create PaymentTransaction (idempotency key)
  - Call VNPay API → payment URL
  - Return URL
  ↓
User redirect → VNPay
  ↓
User thanh toán
  ↓
VNPay IPN → POST /api/v1/payments/vnpay-ipn
  ↓ Backend (vnpayIpnGuard)
  - Verify HMAC SHA512 signature
  - Verify tmnCode
  - Verify amount
  - Idempotency check (transaction_ref)
  - Update CourseOrder → PAID
  - Create Enrollment
  - Issue Certificate
  ↓
User redirect → /payment/success
```

### 14.2 Tables

**CourseOrder:**
- id, userId, courseId, status (PENDING/PAID/REFUNDED/CANCELLED)
- amount, currency, discountId, couponCode
- createdAt, paidAt, refundedAt

**PaymentTransaction:**
- id, orderId, provider (VNPAY)
- transactionRef (unique), amount
- requestPayload (JSONB), responsePayload (JSONB)
- ipnPayload (JSONB), signature, status
- createdAt, completedAt

### 14.3 Refund Flow

1. Admin trigger refund
2. Backend gọi VNPay refund API
3. Update CourseOrder.status = REFUNDED
4. Update PaymentTransaction
5. Revoke Enrollment + Certificate (nếu đã issue)

---

## 15. CÁC TÍNH NĂNG CHÍNH ĐÃ XÂY

### 15.1 Music Player (đặc biệt phức tạp)

**3 UI modes:**
- **Cyber** — terminal aesthetic, green-on-black, particle rain, audio visualizer
- **Cinematic** — movie-style, gradient backgrounds, blur effects
- **Premium** — clean modern, glassmorphism

**Features:**
- YouTube integration (search, playback via YouTube IFrame API)
- Upload tracks (custom files → S3-like storage trên local)
- Playlist CRUD
- Mini player (persistent bottom bar)
- Full player (modal)
- Global player (across pages)
- Music history tracking
- Waveform visualizer
- 24 components trong `frontend/src/components/music/`

### 15.2 Messaging (Socket.IO)

- Real-time chat
- Threads (1-1 conversation)
- Reactions (emoji)
- Nicknames (per-thread custom names)
- Typing indicator
- Read receipts
- Attachments (upload)
- Message history (REST API)
- Admin can view all threads

### 15.3 RAG Knowledge Base

- Local embedding model (no API cost)
- Cosine similarity search
- Admin UI to manage
- Document types: personal_bio, contact, skills, projects, pricing, education, faq, blog, service, policy, custom
- Background embed jobs

### 15.4 SEO

- `robots.ts` → /robots.txt
- `sitemap.ts` → /sitemap.xml
- JSON-LD structured data
- OG meta tags
- Google Indexing API auto-ping on every deploy
- SEO admin UI for manual URL indexing

### 15.5 Email

- Resend (transactional, modern)
- Gmail SMTP fallback
- Templates: OTP, password reset, contact confirmation

### 15.6 Dev Hub

- GitHub repos list (synced from GitHub API)
- Tech Trends articles (CMS)
- Repo tags
- Stats display

---

## 16. LỖI ĐÃ GẶP & CÁCH FIX

### 16.1 Hydration Mismatch (lỗi phổ biến nhất)

**Triệu chứng:** "Application error: a client-side exception has occurred"

**Root cause:** `localStorage.getItem()` trực tiếp trong component body → server render khác client render.

**Fix:**
```typescript
const [mounted, setMounted] = useState(false);
const [value, setValue] = useState(null);

useEffect(() => {
  setMounted(true);
  setValue(localStorage.getItem('key'));
}, []);

if (!mounted) return <Skeleton />;
```

→ Quy tắc cứng trong `.cursorrules`.

### 16.2 Missing Imports (sau khi copy code)

**Triệu chứng:** `motion.div` không có import → React error.

**Fix:** Pre-commit checklist:
```bash
grep -E "motion\.|useState|useEffect" file.tsx
# → verify imports có đầy đủ
```

### 16.3 Backend crash do thiếu env (recent)

**Triệu chứng:** Backend không start vì `SIGNED_URL_SECRET` không có.

**Fix:** Workflow `backend-vps.yml` auto-generate nếu missing:
```bash
if grep -q "^SIGNED_URL_SECRET=" .env; then
  # Keep existing
else
  SIGNED_URL_RAND=$(openssl rand -hex 32)
  echo "SIGNED_URL_SECRET=${SIGNED_URL_RAND}" >> .env
fi
```

### 16.4 Infinite Loop trong chunkText() (RAG)

**Triệu chứng:** Upload RAG document >500 chars → 502 OOM.

**Root cause:** Khi `overlap >= chunkSize`, `start` pointer không tăng → infinite loop → OOM.

**Fix:**
```typescript
function chunkText(text, chunkSize, overlap) {
  if (overlap < 0 || overlap >= chunkSize) {
    throw new AppError('Invalid chunk params', 400);
  }
  // ... chunking logic with safety check
  if (nextStart <= start) start = end;  // force advance
}
```

### 16.5 Nginx không resolve upstream (recent)

**Triệu chứng:** Sau khi restart nginx, error `host not found in upstream "frontend:3000"`.

**Root cause:** Nginx khởi động trước khi frontend container ready.

**Fix:** Restart theo thứ tự:
```bash
docker compose up -d postgres redis
sleep 15
docker compose up -d backend
sleep 10
docker compose up -d frontend
sleep 10
docker compose up -d nginx  # LAST!
```

### 16.6 Cross-origin Cookie (admin page 401)

**Triệu chứng:** Admin page hiển thị "0 chunks" dù DB có data.

**Root cause:** Frontend fetch trực tiếp `https://api.cuongthai.com/...` (cross-origin) → cookie httpOnly KHÔNG gửi.

**Fix:** Catch-all proxy `frontend/src/app/api/v1/[[...path]]/route.ts` đọc cookie server-side và forward.

### 16.7 Default V8 Heap 512MB quá nhỏ

**Triệu chứng:** OOM crash khi xử lý RAG lớn.

**Fix:**
```dockerfile
ENV NODE_OPTIONS=--max-old-space-size=1536
```

### 16.8 Docker build fail do npm registry

**Triệu chứng:** VPS firewall block npm registry → `npm ci` fail.

**Fix:** Offline fallback với host cache:
```dockerfile
COPY --chown=root:root host-cache /app-host-cache
RUN npm ci --prefer-offline || \
    (cp -r /app-host-cache/node_modules ./node_modules)
```

### 16.9 Permission denied trên bind mount

**Triệu chứng:** Container không ghi được vào `/app/uploads` (macOS dev).

**Root cause:** Bind mount có uid 501 (macOS user), container chạy uid 1001.

**Fix:** `fix-uploads-perms.sh` chạy as root trước khi drop privileges:
```bash
#!/bin/bash
chown -R 1001:0 /app/uploads || true
exec node dist/index.js
```

### 16.10 BigInt serialization

**Triệu chứng:** `JSON.stringify` crash với BigInt fields.

**Fix:**
```typescript
(BigInt.prototype as any).toJSON = function() {
  return Number(this);
};
```

### 16.11 PostgreSQL initial setup fail

**Triệu chứng:** `prisma db push` fail vì data dirs không tồn tại.

**Fix:** Workflow tạo `/opt/cuonghoangdev/{postgres,redis,uploads}` trước khi `docker compose up`.

### 16.12 Prisma Client outdated trong container

**Triệu chứng:** Backend 500 do `prisma.threadNickname = undefined` mặc dù schema đã update.

**Root cause:** Container không có models mới (build image cũ).

**Fix:** `docker cp` fresh `dist/` + `.prisma/` vào container, sau đó restart.

### 16.13 musicStore listener leak

**Triệu chứng:** Music player state bị stale sau navigation.

**Fix:** Cleanup listeners trong useEffect return.

### 16.14 Chat input mất tích

**Triệu chứng:** Trang messages mở nhưng không có input.

**Root cause:** `currentThreadId` check null → render empty state.

**Fix:**
```tsx
{currentThreadId && currentThread ? <ThreadHeader /> : <Empty />}
```

### 16.15 Session secret rotation

**Triệu chứng:** Khi rotate `JWT_SECRET`, tất cả sessions bị invalidate (expected) nhưng user bị loop login.

**Fix:** Backup `JWT_SECRET` cũ và hỗ trợ rotation period.

### 16.16 GROQ rate limit

**Triệu chứng:** 429 từ Groq khi traffic cao.

**Fix:** Multi-provider fallback (OpenRouter, OpenAI) + circuit breaker.

### 16.17 AI Streaming buffer

**Triệu chứng:** AI response bị buffer, không streaming.

**Fix:** Nginx SSE config:
```nginx
proxy_buffering off;
proxy_cache off;
chunked_transfer_encoding on;
add_header X-Accel-Buffering no;
```

### 16.18 Contact Form Spam

**Triệu chứng:** Bot spam contact form.

**Fix:** Cloudflare Turnstile CAPTCHA + rate limit.

### 16.19 Lesson Documents leak

**Triệu chứng:** User chưa enroll có thể direct access `/uploads/lesson-documents/...`.

**Fix:** Nginx block:
```nginx
location ^~ /uploads/lesson-documents/ {
    return 403;
}
```

User phải qua `/api/v1/courses/documents/:id/download` (kiểm tra enrollment trước).

### 16.20 Cookie CORS trên dev

**Triệu chứng:** Localhost:3000 không gửi cookie đến localhost:3001.

**Fix:** CORS `credentials: true` + `origin: http://localhost:3000` (specific, not *).

---

## 17. BÀI HỌC KINH NGHIỆM

### 17.1 SSR/Hydration

1. **Luôn wrap `localStorage`/`window` trong `useEffect`** + `mounted` check
2. **Custom storage cho Zustand persist** (ssrSafeStorage) tránh hydration warning
3. **Skeleton loading** cho UI phụ thuộc browser state
4. **Test trên browser thật**, không chỉ SSR build pass

### 17.2 Backend

1. **Validate env tại startup** (Zod) — fail fast thay vì silent fallback
2. **BigInt JSON serialization** — patch prototype
3. **Multi-provider với circuit breaker** — Groq down vẫn serve user
4. **Heap limit bump cho RAG/AI** — 512MB quá nhỏ, 1.5GB vừa đủ
5. **Auto-sync table** cho RAG (idempotent) — không cần migration mỗi lần

### 17.3 DevOps

1. **Build trên CI**, không phải VPS → reproducible
2. **Pre-warm node_modules** cho offline fallback
3. **docker cp thay vì docker build** trên VPS → nhanh, ít disk I/O
4. **Restart containers theo thứ tự dependency** — nginx LAST
5. **Bind mount với uid alignment** — fix-uploads-perms.sh entrypoint
6. **GitHub Secrets cho credentials**, không commit

### 17.4 Security

1. **Trust proxy chain** cẩn thận — `hop <= 1` cho Cloudflare + Nginx
2. **VNPay IPN signature verify** — chống giả mạo
3. **Lesson documents qua API** — không serve trực tiếp từ Nginx
4. **Catch-all proxy cho cross-origin cookie** — chuẩn pattern
5. **CAPTCHA + rate limit** — chống brute force
6. **HSTS preload** — bảo vệ lâu dài

### 17.5 Performance

1. **Static files serve từ Nginx** — bypass Node.js
2. **Cache headers** cho hashed assets (1 year immutable)
3. **HTML no-cache** — tránh chunk load error sau deploy
4. **Internal Docker network** cho SSR fetches (latency 50ms thay vì 4s)
5. **Cosine similarity** với JSONB embedding (chưa dùng pgvector thật)

### 17.6 Code Quality

1. **Quy tắc cứng trong `.cursorrules`** cho AI agent → giảm 80% lỗi
2. **Pre-commit checklist** — grep imports, npm run build
3. **Document tỉ mỉ trong code comments** — giúp maintain sau này
4. **Migration files đặt tên theo timestamp** — dễ track

---

## 18. ĐÁNH GIÁ HIỆN TRẠNG

### 18.1 Điểm mạnh ⭐

| Tiêu chí | Đánh giá |
|---|---|
| Tính năng phong phú | ⭐⭐⭐⭐⭐ 9.5/10 — Đủ tính năng cho 1 portfolio cá nhân + e-commerce + LMS |
| Production-ready | ⭐⭐⭐⭐⭐ 9/10 — Đã deploy ổn định, có backup, monitoring |
| Bảo mật | ⭐⭐⭐⭐ 8.5/10 — Auth, OAuth, CAPTCHA, rate limit, security headers |
| Code quality | ⭐⭐⭐⭐ 8/10 — TypeScript strict, comments tốt, một số chỗ cần refactor |
| Documentation | ⭐⭐⭐⭐⭐ 9.5/10 — Nhiều file .md, comment chi tiết trong code |
| DevOps | ⭐⭐⭐⭐⭐ 9/10 — CI/CD tự động, offline fallback, health checks |
| Testing | ⭐⭐ 5/10 — Playwright smoke test, chưa có unit test suite đầy đủ |
| Scalability | ⭐⭐⭐ 7/10 — VPS 4GB đủ cho traffic nhỏ, cần optimize cho lớn |
| UX/UI | ⭐⭐⭐⭐ 8/10 — Dark mode, animations, mobile-responsive |

### 18.2 Điểm yếu cần cải thiện ⚠️

1. **Thiếu unit test suite** — chỉ có Playwright smoke test
2. **Chưa có E2E test** cho payment flow (VNPay)
3. **Chưa dùng pgvector thật** — đang dùng JSONB cho embedding (slower cho dataset lớn)
4. **Chưa có CDN** — serve trực tiếp từ VPS (Cloudflare có free tier)
5. **Monitoring chỉ có Sentry + monitor.sh** — chưa có APM (Application Performance Monitoring)
6. **Chưa có CI test** — chỉ deploy khi pass thì chưa enforce
7. **Một số commit xấu** trong quá trình phát triển (đã revert)
8. **Thiếu i18n cho admin pages** — admin hiện chỉ tiếng Việt
9. **Music UI 3 modes** rất heavy (nhiều component) — chưa test thoroughly trên mobile
10. **Free tier AI providers** có rate limit — cần upgrade plan nếu traffic tăng

### 18.3 Tổng kết

Đây là một dự án **production-grade, full-stack, đa chức năng** với:
- ~511 commits trong vài tháng phát triển
- 30+ routes, 18 services, 74 Prisma models
- 30+ frontend pages, 60+ components, 12 Zustand stores
- CI/CD tự động, monitoring, backup
- Bảo mật chuẩn production

**Mức độ hoàn thiện:** ~85% (thiếu test + một số optimization).

---

## 19. HƯỚNG PHÁT TRIỂN TIẾP

### 19.1 Ngắn hạn (1-2 tuần)

1. **Thêm unit test suite** (Jest + Vitest)
   - Service layer tests
   - Utility function tests
   - Component tests (React Testing Library)

2. **E2E test cho critical flows**
   - Auth (login/register/OTP)
   - Payment (VNPay mock)
   - AI chat (mock provider)
   - Music playback
   - Messaging

3. **Setup CI test gate**
   - GitHub Actions: run tests on PR
   - Block merge nếu fail

4. **Refactor code smells**
   - Tách nhỏ các component > 500 dòng
   - Tách magic numbers thành constants
   - Extract common utilities

5. **Optimize Docker image size**
   - Multi-stage build tốt hơn
   - Alpine base cho backend (nếu Prisma compatible)

### 19.2 Trung hạn (1-2 tháng)

1. **Bật pgvector thật** (thay JSONB)
   - Native vector type → faster similarity search
   - IVFFlat hoặc HNSW index
   - Cosine similarity trong SQL

2. **Function calling cho AI**
   - AI có thể query DB trực tiếp (projects, courses, users)
   - Real-time data thay vì chỉ RAG

3. **Admin dashboard analytics**
   - Chart.js hoặc Recharts
   - Real-time metrics: users, revenue, AI usage

4. **PWA improvements**
   - Push notifications
   - Offline mode tốt hơn
   - Install prompt

5. **Mobile app** (React Native hoặc Expo)
   - Reuse types/API
   - Native feel cho messaging

6. **Multi-language i18n đầy đủ**
   - Admin pages
   - Email templates
   - Error messages

### 19.3 Dài hạn (3-6 tháng)

1. **Microservices architecture**
   - Tách AI service riêng
   - Tách Messaging service riêng
   - API Gateway

2. **Kubernetes deployment**
   - Auto-scaling
   - Rolling updates
   - Multi-region

3. **Real-time collaboration**
   - Google Docs-style cho blog editor
   - Live cursors
   - Comments thread real-time

4. **Marketplace cho freelancers**
   - Nhiều users đăng project
   - Bidding system
   - Escrow payment

5. **AI features nâng cao**
   - Voice input/output
   - Image generation (DALL-E)
   - Code generation/explanation

6. **Analytics platform**
   - User behavior tracking
   - A/B testing framework
   - Conversion funnels

### 19.4 Tối ưu hóa kỹ thuật

1. **Database**
   - Read replicas
   - Connection pooling (PgBouncer)
   - Query optimization (EXPLAIN ANALYZE)
   - Materialized views cho dashboard

2. **Cache layer**
   - Redis cluster
   - Cache warming strategies
   - Cache invalidation patterns

3. **Search**
   - ElasticSearch hoặc Meilisearch thay full-text search
   - Faceted search
   - Auto-complete

4. **CDN**
   - Cloudflare free tier (đã có)
   - Cloudflare Images cho user uploads
   - Cloudflare Stream cho video

5. **Observability**
   - OpenTelemetry
   - Distributed tracing
   - Metrics dashboard (Grafana)

---

## 20. CÁCH TỰ HỌC LẠI TỪ ĐẦU

### 20.1 Nếu bạn mới bắt đầu từ con số 0

**Bước 1: Hiểu concept cơ bản (1-2 tuần)**

Đọc:
- `README.md` — Tổng quan dự án
- `PROJECT_STATUS.md` — Trạng thái tại 1 thời điểm
- `QUICK-DEPLOY.md` — Deploy nhanh
- `DEPLOY-FASTER.md` — Hướng dẫn deploy đầy đủ

**Bước 2: Setup local (1 ngày)**

```bash
# Clone repo
git clone <repo>
cd api-backend

# Setup
npm install
cp .env.example .env
# Edit .env với credentials local

# Start database
docker run -d --name pg -e POSTGRES_PASSWORD=123456 -p 5432:5432 postgis/postgis:16-3.4

# Init DB
npm run db:generate
npm run db:push
npm run db:seed

# Run backend
npm run dev

# Run frontend (terminal khác)
cd frontend
npm install
npm run dev
```

**Bước 3: Đọc code theo thứ tự (1 tuần)**

Backend đọc theo thứ tự:
1. `src/config/env.ts` — Env validation
2. `src/config/database.ts` — Prisma setup
3. `src/index.ts` — Express setup
4. `src/middleware/auth.ts` — JWT auth
5. `src/routes/auth.routes.ts` — Login/register
6. `src/services/auth.service.ts` — Business logic
7. `src/routes/blog.routes.ts` — CRUD example
8. `src/services/ai.service.ts` — AI + RAG
9. `src/socket/messaging.socket.ts` — WebSocket

Frontend đọc theo thứ tự:
1. `frontend/src/middleware.ts` — Route protection
2. `frontend/src/store/authStore.ts` — Auth state
3. `frontend/src/store/ssrSafeStorage.ts` — SSR-safe storage
4. `frontend/src/app/api/v1/[[...path]]/route.ts` — Catch-all proxy
5. `frontend/src/app/(auth)/login/page.tsx` — Login flow
6. `frontend/src/lib/server-api.ts` — Server-side fetch
7. `frontend/src/components/messaging/MessageInput.tsx` — Socket.IO example
8. `frontend/src/app/chat/page.tsx` — AI chat UI

**Bước 4: Làm theo tutorial (2 tuần)**

Tạo 1 feature mới từ đầu, ví dụ:
- "Books management" — CRUD đơn giản
  - Thêm model vào schema.prisma
  - Tạo routes/services
  - Tạo admin page
  - Test trên local
  - Deploy lên VPS

**Bước 5: Đọc tài liệu tham khảo**

- Next.js App Router: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- Express: https://expressjs.com
- Socket.IO: https://socket.io/docs
- Docker Compose: https://docs.docker.com/compose

### 20.2 Cheat sheet — File quan trọng cần đọc

**Backend (đọc theo thứ tự):**
```
1. src/config/env.ts            ← Env validation (271 dòng)
2. src/index.ts                 ← Express setup (583 dòng)
3. src/middleware/auth.ts       ← JWT auth
4. src/services/auth.service.ts ← Business logic
5. src/routes/auth.routes.ts    ← HTTP routes
6. src/services/ai.service.ts   ← AI + RAG
7. src/services/aiProviders.ts  ← Multi-provider + circuit breaker
8. src/socket/messaging.socket.ts ← WebSocket
9. prisma/schema.prisma         ← Database schema (1789 dòng)
```

**Frontend (đọc theo thứ tự):**
```
1. frontend/src/middleware.ts   ← Route protection
2. frontend/src/store/ssrSafeStorage.ts ← SSR-safe
3. frontend/src/store/authStore.ts ← Auth state
4. frontend/src/lib/server-api.ts ← API client
5. frontend/src/app/api/v1/[[...path]]/route.ts ← Catch-all proxy
6. frontend/src/app/(auth)/login/page.tsx ← Login UI
7. frontend/src/app/chat/page.tsx ← AI chat UI
8. frontend/src/components/messaging/MessageInput.tsx ← Socket.IO
```

**DevOps:**
```
1. Dockerfile.backend            ← Backend build
2. frontend/Dockerfile           ← Frontend build
3. docker-compose.yml            ← 5 services
4. nginx/nginx.conf              ← Reverse proxy (387 dòng)
5. .github/workflows/backend-vps.yml ← CI/CD (249 dòng)
6. scripts/deploy-vps.sh         ← Deploy script
7. scripts/monitor.sh            ← Health monitoring
```

### 20.3 Nếu bạn muốn contribute

1. **Fork repo** → tạo branch mới
2. **Đọc `.cursorrules`** trước khi code
3. **Chạy pre-commit checklist:**
   ```bash
   grep -E "motion\.|useState" <your-file>.tsx
   # Verify all imports có
   npm run build
   ```
4. **Test thoroughly** trên local
5. **PR với description** rõ ràng

### 20.4 Nếu gặp lỗi

1. **Check `loi_thuong_gap.md`** — Common errors
2. **Check `Error_Sum.md`** — Error summaries
3. **Search trong git log** — `git log --all --oneline | grep "fix"`
4. **Xem Sentry dashboard** — Nếu đã setup
5. **Xem GitHub Actions logs** — Nếu deploy fail
6. **SSH vào VPS** — `ssh root@160.187.1.208` → check container logs

---

## 📎 PHỤ LỤC

### A. URLs quan trọng

| URL | Mô tả |
|---|---|
| https://cuongthai.com | Frontend production |
| https://api.cuongthai.com | Backend API production |
| https://api.cuongthai.com/health | Health check |
| https://api.cuongthai.com/api/v1/system/health | System health |
| https://cuongthai.com/admin | Admin panel |
| https://cuongthai.com/admin/ai-knowledge | RAG KB admin |
| https://cuongthai.com/chat | AI Chat |
| https://cuongthai.com/messages | Direct messaging |
| https://cuongthai.com/music | Music player |

### B. Tài khoản admin mặc định

```
Email: cuongthaihnhe176322@gmail.com
Role: admin
```

### C. Environment variables cheat sheet

```bash
# Required
DATABASE_URL=postgresql://...
JWT_SECRET=<32+ chars>
JWT_REFRESH_SECRET=<32+ chars>
SIGNED_URL_SECRET=<32+ chars>
COOKIE_SECRET=<32+ chars>

# Recommended
FRONTEND_URL=https://cuongthai.com
ALLOWED_ORIGINS=https://cuongthai.com,https://www.cuongthai.com
ADMIN_EMAILS=cuongthaihnhe176322@gmail.com
RESEND_API_KEY=re_...

# AI (at least 1)
GROQ_API_KEY=gsk_...
OPENROUTER_API_KEY=sk-or-v1-...
OPENAI_API_KEY=sk-proj-...

# Optional
YOUTUBE_API_KEY=AIza...
SENTRY_DSN=https://...
TURNSTILE_SECRET_KEY=0x...
```

### D. Useful commands

```bash
# Local dev
npm run dev          # Backend with tsx watch
npm run dev:debug    # With inspector
npm run db:studio    # Prisma Studio GUI
npm run db:seed      # Re-seed data
npm run db:push      # Apply schema

# Build
npm run build        # tsc compile
npm start            # Run dist/

# Docker
docker compose up -d --build
docker compose logs -f backend
docker compose restart backend
docker exec -it cuonghoangdev_backend sh

# Production
ssh root@160.187.1.208
cd /opt/cuonghoangdev
docker compose ps
docker compose logs backend --tail 100
docker restart cuonghoangdev_backend
```

### E. Liên hệ & Support

- **Email:** cuongthaihnhe176322@gmail.com
- **GitHub:** https://github.com/cuonghoang1103
- **Production:** https://cuongthai.com

---

## 📝 LỊCH SỬ CẬP NHẬT

| Ngày | Nội dung |
|---|---|
| 17/06/2026 | Tạo file tổng hợp đầu tiên |
| | Thêm 3 API keys (Groq/OpenAI/OpenRouter) |
| | Fix backend crash do missing secrets |
| | Fix nginx container order |

---

## 📚 PHẦN BỔ SUNG (17/06/2026 — update lần 2)

---

## 21. CHI TIẾT VỀ AI / RAG (Deep Dive)

### 21.1 Kiến trúc AI Service — Multi-layer

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AI SERVICE ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────┘

Layer 1: HTTP Routes (src/routes/ai.routes.ts — 665 dòng)
├── POST   /api/v1/ai/chat              → SSE streaming
├── POST   /api/v1/ai/chat/sync         → Non-streaming fallback
├── GET    /api/v1/ai/chat/sessions     → List user's sessions
├── POST   /api/v1/ai/chat/sessions     → Create new session
├── GET    /api/v1/ai/chat/history/:id  → Get messages
├── DELETE /api/v1/ai/chat/sessions/:id → Delete session
├── POST   /api/v1/ai/feedback          → Submit feedback (1-5 stars)
├── GET    /api/v1/ai/feedback/stats    → Feedback analytics
├── GET    /api/v1/ai/analytics/overview → AI usage metrics
├── GET    /api/v1/ai/admin/config      → Admin: AI config
├── PUT    /api/v1/ai/admin/config/:key → Admin: Update config
├── GET    /api/v1/ai/admin/stats       → Admin: Stats dashboard
├── POST   /api/v1/ai/admin/documents/upload-files → Bulk .md/.txt
├── POST   /api/v1/ai/admin/documents/backfill-embeddings → Recompute
├── POST   /api/v1/ai/admin/documents   → Index 1 document
├── GET    /api/v1/ai/admin/documents   → List chunks (paginated)
├── DELETE /api/v1/ai/admin/documents/:id → Delete 1 doc
└── DELETE /api/v1/ai/admin/knowledge/clear-all → NUCLEAR option

Layer 2: Services
├── ai.service.ts       (846 dòng) → Main logic
│   ├── createSession, getSessions, deleteSession
│   ├── saveUserMessage, saveAssistantMessage
│   ├── getRAGContext     → semantic + keyword search
│   ├── sendChat          → non-streaming
│   ├── streamChat        → AsyncGenerator (SSE)
│   ├── indexDocument     → chunk + embed + store
│   ├── backfillMissingEmbeddings → for old chunks
│   ├── chunkText         → smart chunking algorithm
│   ├── clearAllChunks, getAllChunks
│   └── submitFeedback, getFeedbackStats
│
└── aiProviders.ts      (601 dòng) → Multi-provider + circuit breaker
    ├── PROVIDERS array (groq, openrouter, openai)
    ├── getClient (lazy init OpenAI client)
    ├── getModel, getAvailableProviders (filter by apiKey)
    ├── CircuitBreaker state (FAILURE_THRESHOLD=2)
    ├── COOLDOWN_MS (AUTH=5min, RATE_LIMIT=60s, etc)
    ├── classifyError
    ├── tripCircuit, closeCircuit, isCircuitOpen
    ├── isRetryable (retry 429/5xx, skip 401/403/404)
    ├── callProvider (3 retries with exp backoff: 1s, 2s, 4s)
    └── chatWithFallback (main entry point)

Layer 3: Database (Prisma — 74 models total)
├── ChatSession     → id, userId, title, updatedAt
├── ChatMessage     → id, sessionId, role (user/assistant), content
├── ChatFeedback    → id, messageId, userId, rating (1-5), feedbackType
├── ChatAnalytics   → tracking metrics
├── AiConfig        → key-value config (dynamic AI config)
├── AiPrompt        → prompt templates
└── DocumentChunk   → id, content, metadata, chunk_index, document_id,
                     document_type, embedding (JSONB)

Layer 4: External APIs
├── Groq:        https://api.groq.com/openai/v1     (priority 1)
├── OpenRouter:  https://openrouter.ai/api/v1      (priority 2)
└── OpenAI:      https://api.openai.com/v1         (priority 3)
```

### 21.2 RAG Pipeline (Retrieval-Augmented Generation)

**Mục đích:** Cho AI biết thông tin cá nhân của Hoàng Nghĩa Cường (bio, skills, projects, pricing, FAQ, ...) mà model LLM không được train sẵn.

**4 bước chính:**

```
┌──────────────────────────────────────────────────────────────────┐
│ Step 1: DOCUMENT INGESTION (Upload phase)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Admin upload (POST /admin/documents) hoặc bulk upload files    │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────┐                                        │
│  │   aiService         │                                        │
│  │  .indexDocument()   │                                        │
│  └──────────┬──────────┘                                        │
│             │                                                    │
│             ├──► chunkText(content, 1000, 200)                   │
│             │   ├── Tìm ranh giới câu (\n\n, \n, . ! ? ; ,)   │
│             │   ├── Overlap 200 chars giữa các chunks           │
│             │   └── Safety: throw nếu overlap >= chunkSize     │
│             │                                                    │
│             ├──► computeEmbeddings(chunks)                       │
│             │   ├── Lazy load @xenova/transformers              │
│             │   ├── Model: all-MiniLM-L6-v2 (384 dims)         │
│             │   └── Local ONNX, không cần API                   │
│             │                                                    │
│             └──► prisma.documentChunk.create() x N               │
│                 ├── content: text                               │
│                 ├── documentId, documentType, chunkIndex        │
│                 └── embedding: number[] (JSONB)                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Step 2: USER ASKS QUESTION (Query phase)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  POST /api/v1/ai/chat { message: "CuongHoangDev là ai?" }       │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────┐           │
│  │  getRAGContext(documentType, topK=5, userMessage) │           │
│  └──────────────────────┬───────────────────────────┘           │
│                         │                                       │
│                         ├──► Fetch candidate chunks (topK * 4)  │
│                         │                                        │
│                         ├──► Check: có chunk nào có embedding?  │
│                         │    │                                    │
│                         │    ├── YES → Semantic search path     │
│                         │    │   ├── Compute query embedding    │
│                         │    │   ├── Cosine similarity          │
│                         │    │   ├── Sort by score              │
│                         │    │   ├── Filter (score > 0.1)       │
│                         │    │   └── Top 5 chunks               │
│                         │    │                                    │
│                         │    └── NO → Keyword fallback          │
│                         │        ├── Split message into words   │
│                         │        ├── Score = count matches      │
│                         │        └── Top 5 chunks               │
│                         │                                        │
│                         └──► Return RAG context string          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Step 3: BUILD PROMPT (Augmentation phase)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  buildSystemPrompt(ragContext):                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ "Bạn là CuongMini — trợ lý AI thông minh của              │ │
│  │  CuongHoangDev Portfolio.                                   │ │
│  │  Khi được hỏi bạn là ai, hãy trả lời:                    │ │
│  │  'Tôi là CuongMini, trợ lý AI của CuongHoangDev.'        │ │
│  │                                                             │ │
│  │  Hãy trả lời bằng tiếng Việt, thân thiện và chính xác.   │ │
│  │                                                             │ │
│  │  ## Nguyên tắc trả lời:                                   │ │
│  │  - Trả lời ngắn gọn, có ví dụ code khi cần               │ │
│  │  - Nếu không biết, hãy nói thẳng                          │ │
│  │  - Ưu tiên thông tin từ ngữ cảnh hệ thống                │ │
│  │                                                             │ │
│  │  ## Ngữ cảnh từ hệ thống:                                │ │
│  │  [personal_bio:bio-overview-2026]                          │ │
│  │  Tôi là Hoàng Nghĩa Cường, sinh viên FPT University...   │ │
│  │                                                             │ │
│  │  [skills:skills-tech-2026]                                │ │
│  │  - Frontend: Next.js, React, TypeScript, TailwindCSS...   │ │
│  │  - Backend: Node.js, Express, Prisma, PostgreSQL...       │ │
│  │  ..."                                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Step 4: GENERATE ANSWER (Inference phase)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  streamChat(context) — AsyncGenerator<string, void>             │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Multi-Provider + Circuit Breaker                │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                         │                                       │
│      ┌──────────────────┼──────────────────┐                    │
│      │                  │                  │                    │
│      ▼                  ▼                  ▼                    │
│   ┌────────┐         ┌────────┐         ┌────────┐             │
│   │  Groq  │         │OpenRtr │         │ OpenAI │             │
│   │ (prio  │         │ (prio  │         │ (prio  │             │
│   │   1)   │         │   2)   │         │   3)   │             │
│   └───┬────┘         └───┬────┘         └───┬────┘             │
│       │ streaming        │ non-stream       │ non-stream        │
│       ▼                  ▼                  ▼                    │
│   ┌────────────────────────────────────────────────────┐       │
│   │  Retry logic: 3 lần với exponential backoff        │       │
│   │  (1s, 2s, 4s)                                       │       │
│   │  Skip retry cho: 401/403/404                         │       │
│   └──────────────────────┬─────────────────────────────┘       │
│                          │                                     │
│                          ▼                                     │
│   ┌────────────────────────────────────────────────────┐       │
│   │  Circuit Breaker:                                   │       │
│   │  - 2 consecutive fails → OPEN circuit               │       │
│   │  - Cooldown: AUTH=5min, RATE=60s, SERVER=60s        │       │
│   │  - Half-open: thử lại sau cooldown                   │       │
│   │  - Success → CLOSE circuit                          │       │
│   └──────────────────────┬─────────────────────────────┘       │
│                          │                                     │
│                          ▼                                     │
│   ┌────────────────────────────────────────────────────┐       │
│   │  Stream SSE chunks to client:                       │       │
│   │  data: {"type":"connected"}                          │       │
│   │  data: {"type":"chunk","text":"Xin"}                 │       │
│   │  data: {"type":"chunk","text":" chào"}               │       │
│   │  data: {"type":"chunk","text":"! Tôi"}               │       │
│   │  data: {"type":"done","text":"","tokens":45}        │       │
│   └────────────────────────────────────────────────────┘       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 21.3 Document Chunking Algorithm — `chunkText()`

**Mục đích:** Chia văn bản dài thành chunks ~1000 chars, overlap 200 chars, cắt tại ranh giới câu/đoạn.

**Algorithm:**
```typescript
function chunkText(text, chunkSize=1000, overlap=200):
  Validate: 0 <= overlap < chunkSize  // throw nếu sai
  chunks = []
  start = 0
  
  while start < text.length:
    end = start + chunkSize
    
    if end >= text.length:
      end = text.length
    else:
      // Tìm điểm cắt tốt nhất (sentence/paragraph boundary)
      minCut = start + chunkSize / 2
      candidates = [
        text.lastIndexOf('\n\n', end),  // paragraph break
        text.lastIndexOf('\n', end),    // line break
        text.lastIndexOf('. ', end),    // sentence end
        text.lastIndexOf('! ', end),
        text.lastIndexOf('? ', end),
        text.lastIndexOf('; ', end),    // clause break
        text.lastIndexOf(', ', end),    // phrase break
      ].filter(pos => pos > minCut)
      
      if candidates.length > 0:
        end = candidates[0] + 1  // Include separator
    
    chunk = text.slice(start, end).trim()
    if chunk.length > 10:
      chunks.push(chunk)
    
    // Slide forward with overlap
    nextStart = end - overlap
    if nextStart <= start:
      // Safety: force advance nếu window không di chuyển
      start = end
    else:
      start = nextStart
  
  return chunks
```

**Bug đã fix (lỗi nghiêm trọng):**
- Trước fix: Khi `overlap >= chunkSize` → `nextStart = end - overlap` → `nextStart <= start` → infinite loop → OOM crash
- Sau fix: Validate `0 <= overlap < chunkSize` ở đầu hàm + safety check `if (nextStart <= start) start = end`

### 21.4 Cosine Similarity — `cosineSimilarity()`

```typescript
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// Score range: -1 (opposite) → 0 (unrelated) → 1 (identical)
// Threshold: score > 0.1 = có liên quan
```

### 21.5 Embedding Generation — `computeEmbeddings()`

**Model:** `Xenova/all-MiniLM-L6-v2` (qua `@xenova/transformers`)
- **Dimensions:** 384
- **Size:** ~80MB
- **Speed:** ~50-200ms per embedding (CPU)
- **Cost:** FREE (local ONNX, no API)

**Process:**
```
1. Lazy load model (lần đầu ~5s, cached sau đó)
2. Tokenize text
3. Forward pass qua model
4. Mean pooling
5. Normalize → unit vector
6. Return number[384]
```

### 21.6 SSE (Server-Sent Events) Implementation

**Headers required (set BEFORE flushHeaders):**
```
Content-Type: text/event-stream
Cache-Control: no-cache, no-transform
Connection: keep-alive
X-Accel-Buffering: no  ← Critical cho Nginx
Access-Control-Allow-Origin: *
```

**SSE Format:**
```
data: {"type":"connected","sessionId":"..."}\n\n
data: {"type":"chunk","text":"Xin","done":false}\n\n
data: {"type":"chunk","text":" chào","done":false}\n\n
data: {"type":"done","text":"","done":true,"tokens":45}\n\n
```

**Keepalive:** Gửi `: keepalive\n\n` mỗi 25s để giữ connection (Nginx default timeout = 60s).

**Timeout:** Force close sau 3 phút (180s).

**Safety:**
- Max 10000 tokens (hard limit)
- Max 50000 chars accumulated text
- Drain handling: `await res.once('drain')` nếu buffer đầy

### 21.7 Circuit Breaker — `aiProviders.ts`

**State machine:**
```
CLOSED  ──(2 fails)──►  OPEN  ──(cooldown expired)──►  HALF_OPEN
   ▲                        │                              │
   │                        └────(try)──────────────────────┤
   │                                                       │
   └──────────────(success)─────────────────────────────────┘
```

**Cooldown duration theo error type:**
| Error type | Cooldown | Lý do |
|---|---|---|
| AUTH (401/403) | 5 phút | Admin cần fix key |
| RATE_LIMIT (429) | 60s | Groq reset quota nhanh |
| SERVER_ERROR (5xx) | 60s | Server thường recover nhanh |
| TIMEOUT | 30s | Network thường recover nhanh |
| UNKNOWN | 45s | Default |

**Implementation:**
```typescript
interface CircuitState {
  consecutiveFailures: number;
  cooldownUntil: number | null;
  lastError: string | null;
  lastErrorCode: 'AUTH' | 'RATE_LIMIT' | ...;
  openedAt: number | null;
}

const FAILURE_THRESHOLD = 2;
// 1 critical error (AUTH/RATE) → trip immediately
// 2 consecutive fails → trip
```

### 21.8 AI Knowledge Base — 7 Documents hiện tại

| Document ID | Type | Chunks | Content |
|---|---|---|---|
| `bio-overview-2026` | personal_bio | 2 | Bio, sở thích, tính cách |
| `contact-info-2026` | contact | 2 | Email, Zalo, Facebook, GitHub |
| `skills-tech-2026` | skills | 2 | Frontend, Backend, Database, DevOps |
| `projects-portfolio-2026` | projects | 3 | 3 dự án chính |
| `pricing-services-2026` | pricing | 3 | Bảng giá freelance |
| `education-fpt-2026` | education | 2 | FPT University, GPA |
| `faq-how-can-i-help-2026` | faq | 3 | Câu hỏi thường gặp |
| **TOTAL** | | **17** | |

**Upload script:** `scripts/upload-knowledge.sh` (idempotent).

### 21.9 Admin UI — `/admin/ai-knowledge`

**Features:**
- Stats dashboard (tổng chunks, số docs, types, chars)
- Search + filter theo documentType
- Upload modal với 10 loại preset
- Xoá từng document (1 → xoá hết chunks của nó)
- Dark mode

**10 document types:**
```
personal_bio, contact, skills, projects, pricing, education,
faq, blog, service, policy, custom
```

### 21.10 AI/RAG Improvement Roadmap

**Ngắn hạn:**
- [ ] Bật pgvector thật (native vector type) thay JSONB → faster similarity search cho >1000 chunks
- [ ] HNSW index cho approximate nearest neighbor (10x faster)
- [ ] Auto re-rank với cross-encoder
- [ ] Citation trong response (chunk N: "...")
- [ ] Conversation memory (chat_history) cho follow-up questions

**Trung hạn:**
- [ ] Function calling (AI query DB trực tiếp)
- [ ] Multi-modal (image input)
- [ ] Voice input/output
- [ ] Agent workflow (AI tự plan + execute)
- [ ] Per-user RAG (multi-tenant knowledge base)

**Dài hạn:**
- [ ] Fine-tuned model trên data cá nhân
- [ ] Real-time learning từ user feedback
- [ ] Hybrid search (semantic + BM25 keyword)
- [ ] Knowledge graph (entities + relationships)

---

## 22. SCHEMA DIAGRAM (Database ER)

### 22.1 ER Diagram — High Level

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATABASE ER DIAGRAM                                │
│                  PostgreSQL + Prisma + 74 Models                            │
└─────────────────────────────────────────────────────────────────────────────┘

   ┌──────────┐         ┌──────────────┐         ┌──────────┐
   │   Role   │ N────M  │    User      │  1────N  │  Session │
   │ (admin,  │         │ (id, email,  │          │ (auth)   │
   │  user)   │         │  username,   │          └──────────┘
   └──────────┘         │  password,   │
                        │  roles[])    │
                        └──┬───┬───┬───┘
                           │   │   │
       ┌───────────────────┘   │   └────────────────────────┐
       │                       │                            │
       ▼                       ▼                            ▼
   ┌──────────┐         ┌──────────────┐         ┌──────────────────┐
   │  Blog    │         │  Portfolio   │         │   Academy/Shop   │
   │──────────│         │──────────────│         │──────────────────│
   │ Category │         │  Project     │         │ Course ─┐        │
   │ Post     │         │  Skill       │         │   ├─Section     │
   │ Tag      │         │  ProjectSkill│         │   │  └─Lesson    │
   │ Comment  │         └──────────────┘         │   ├─Document    │
   │ FileAtt. │                                 │   ├─Assignment  │
   └──────────┘                                 │   ├─Enrollment  │
                                                │   └─Certificate │
                                                │ Product ─┐      │
                                                │   └─ShopOrder  │
                                                │ DiscountCode    │
                                                └──────────────────┘

   ┌──────────────────────────────────────────────────────────────┐
   │                    USER-CENTRIC MODELS                       │
   ├──────────────────────────────────────────────────────────────┤
   │                                                              │
   │  User ─┬─ MusicPlaylist ── MusicPlaylistTrack ── MusicTrack  │
   │        ├─ MusicHistory                                     │
   │        ├─ ChatSession ── ChatMessage ── ChatFeedback       │
   │        │                                            ChatAnal│
   │        ├─ MessageThread ── Message ─┬─ MessageReaction     │
   │        │                            ├─ MessageAttachment   │
   │        │                            └─ MessageRead         │
   │        ├─ SocialPost ─┬─ SocialLike                        │
   │        │              ├─ SocialComment ── SocialCommentLike│
   │        │              ├─ SocialSave                        │
   │        │              ├─ SocialShare                       │
   │        │              └─ SocialPoll ── PollOption ── Vote  │
   │        ├─ CourseOrder ── PaymentTransaction                │
   │        ├─ CyberProfile ── CyberTask ── CyberInventory      │
   │        ├─ DashboardState ── DashboardTask                   │
   │        └─ ContactSubmission                                │
   │                                                              │
   └──────────────────────────────────────────────────────────────┘

   ┌──────────────────────────────────────────────────────────────┐
   │                  SHARED/SYSTEM MODELS                        │
   ├──────────────────────────────────────────────────────────────┤
   │  DocumentChunk      (RAG KB — shared across all users)      │
   │  AiConfig           (key-value config)                      │
   │  AiPrompt           (prompt templates)                      │
   │  GithubRepo ── GithubRepoTag                                 │
   │  TechTrendArticle                                            │
   │  DevPost ── PostComment                                      │
   └──────────────────────────────────────────────────────────────┘
```

### 22.2 Core Schema (chi tiết các bảng quan trọng)

```sql
-- ════════════════════════════════════════════════════════════════
-- USERS & AUTH
-- ════════════════════════════════════════════════════════════════

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL  -- 'admin', 'user'
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255),  -- bcrypt hash
  full_name VARCHAR(100),
  avatar_url VARCHAR(500),
  display_name VARCHAR(100),
  social_links JSONB,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,
  failed_login_count INT DEFAULT 0,
  lockout_until TIMESTAMPTZ,
  last_login_at, last_login_ip, last_login_user_agent,
  role_version BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- ════════════════════════════════════════════════════════════════
-- ACADEMY (Course/Lesson/Enrollment)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE,
  description TEXT,
  price DECIMAL(10,2),
  thumbnail_url VARCHAR(500),
  instructor_id INT REFERENCES users(id),
  category_id INT,
  published BOOLEAN DEFAULT FALSE
);

CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  course_id INT REFERENCES courses(id),
  status VARCHAR(20),  -- 'ACTIVE', 'EXPIRED', 'CANCELLED'
  enrolled_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  user_id INT,
  course_id INT,
  issued_at TIMESTAMPTZ,
  certificate_url VARCHAR(500)
);

-- ════════════════════════════════════════════════════════════════
-- MESSAGING (Direct chat)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE message_threads (
  id SERIAL PRIMARY KEY,
  participant1_id INT REFERENCES users(id),
  participant2_id INT REFERENCES users(id),
  last_message_at TIMESTAMPTZ,
  UNIQUE(participant1_id, participant2_id)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  thread_id INT REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id INT REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════
-- PAYMENTS (Course orders)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE course_orders (
  id SERIAL PRIMARY KEY,
  user_id INT,
  course_id INT,
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'VND',
  status VARCHAR(20),  -- 'PENDING', 'PAID', 'REFUNDED', 'CANCELLED'
  discount_id INT,
  coupon_code VARCHAR(50),
  created_at, paid_at, refunded_at
);

CREATE TABLE payment_transactions (
  id SERIAL PRIMARY KEY,
  order_id INT,
  provider VARCHAR(20),  -- 'VNPAY'
  transaction_ref VARCHAR(100) UNIQUE,  -- vnp_TxnRef
  amount DECIMAL(10,2),
  request_payload JSONB,
  response_payload JSONB,
  ipn_payload JSONB,
  signature VARCHAR(500),
  status VARCHAR(20),
  created_at, completed_at
);

-- ════════════════════════════════════════════════════════════════
-- RAG (Knowledge Base)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE document_chunks (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  chunk_index INT NOT NULL,
  document_id VARCHAR(100) NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  embedding JSONB,  -- 384-dim vector (currently JSONB, not pgvector)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_document_chunks_type ON document_chunks(document_type);
CREATE INDEX idx_document_chunks_doc_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_embedding_present
  ON document_chunks ((embedding IS NOT NULL))
  WHERE embedding IS NOT NULL;
```

### 22.3 Sơ đồ trực quan (ASCII art đầy đủ)

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    CUONGHOANGDEV DATABASE (74 MODELS)                  ║
╚══════════════════════════════════════════════════════════════════════════╝

┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Auth Core   │  │    Blog      │  │  Portfolio   │  │   Skills     │
├─────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤
│ Role        │  │ FileAttach.  │  │  Project     │  │  Skill       │
│ User        │◄─┤ Category     │  │  ProjectSkill├──┤              │
│ UserRole    │  │ Post         │  └──────────────┘  └──────────────┘
│ PwdReset    │  │ Tag          │
│ EmailVerif  │  │ PostTag      │  ┌──────────────┐  ┌──────────────┐
└─────────────┘  │ Comment      │  │   Academy    │  │    Shop      │
                 └──────────────┘  ├──────────────┤  ├──────────────┤
                                 │ CourseCategory│  │ProductCategory│
┌─────────────┐  ┌──────────────┐│ Semester     │  │ Product      │
│  Cyber      │  │   Music      ││ Course       │  │ ShopOrder    │
├─────────────┤  ├──────────────┤│  ├ Section   │  │ ShopOrderItem│
│ CyberProfile│  │MusicTrack    ││  │  └ Lesson │  │ DiscountCode │
│ CyberTask   │  │MusicPlaylist ││  │     └ Detail│ └──────────────┘
│ CyberInvent.│  │MusicPlaylistT││  ├ Document  │
└─────────────┘  │MusicHistory  ││  ├ Enrollment│
                 └──────────────┘│  ├ LessonProg│
                                 │  ├ Assignment│
┌─────────────┐  ┌──────────────┐│  │  └ Submission
│    AI       │  │ Direct Msg   ││  ├ Certificate
├─────────────┤  ├──────────────┤│  ├ Review    │
│ ChatSession │  │MessageThread ││  └ Tag       │
│ ChatMessage │  │ Message      │└──────────────┘
│ ChatFeedbk  │  │ThreadNickname│
│ ChatAnalyt. │  │MessageReact. │  ┌──────────────┐
│ AiConfig    │  │MessageAttach.│  │   Social     │
│ AiPrompt    │  │ MessageRead  │  ├──────────────┤
│DocumentChunk│  └──────────────┘  │ SocialPost   │
└─────────────┘                    │ SocialMedia  │
                                  │ SocialLike   │
┌─────────────┐  ┌──────────────┐  │ SocialComment│
│  Payments   │  │   Other      │  │SocialCommLike│
├─────────────┤  ├──────────────┤  │ SocialSave   │
│ CourseOrder │  │ DevPost      │  │ SocialShare  │
│ PaymentTx   │  │ PostComment  │  │ SocialPoll   │
└─────────────┘  │ GithubRepo   │  │SocialPollOpt │
                │ GithubRepoTag│  │SocialPollVote│
                │DashboardState│  └──────────────┘
                │DashboardTask │
                │DashCelebrate │  ┌──────────────┐
                │TechTrendArt. │  │Contact       │
                │ContactSubmit.│  └──────────────┘
                └──────────────┘
```

---

## 23. MAINTENANCE & UPDATE GUIDE (Quan trọng!)

### 23.1 Bản đồ file — Khi cần sửa gì, vào đâu?

#### A. SỬA / THÊM TÍNH NĂNG BACKEND

| Tính năng cần sửa | File chính cần mở | File phụ thuộc | Lưu ý |
|---|---|---|---|
| **Auth (login/register/OTP)** | `src/routes/auth.routes.ts` (382 dòng) | `src/services/auth.service.ts` (882 dòng), `src/services/otp.service.ts`, `src/services/email.service.ts`, `src/middleware/auth.ts` (245 dòng) | Đọc cả 5 file để hiểu flow |
| **Blog (post/comment)** | `src/routes/blog.routes.ts` (396 dòng) | `prisma/schema.prisma` (models Post, Category, Tag, Comment, FileAttachment) | |
| **Projects/Skills portfolio** | `src/routes/project.routes.ts` (113 dòng), `src/routes/skill.routes.ts` (34 dòng) | `prisma/schema.prisma` | |
| **Courses/Academy** | `src/routes/course.routes.ts` (1662 dòng ⚠️ lớn nhất) | `src/routes/academy.routes.ts`, `src/routes/certificate.routes.ts`, `prisma/schema.prisma` | File course.routes.ts rất lớn — nên tách nhỏ |
| **Shop (products/orders)** | `src/routes/shop.routes.ts` (567 dòng) | `prisma/schema.prisma` | |
| **Music Player** | `src/routes/music.routes.ts` (1196 dòng ⚠️ lớn thứ 2) | `src/services/music.service.ts` (748 dòng), `src/services/ffmpeg.service.ts` (267 dòng) | Tương tác với YouTube API |
| **AI Chat + RAG** | `src/routes/ai.routes.ts` (665 dòng) | `src/services/ai.service.ts` (846 dòng), `src/services/aiProviders.ts` (601 dòng) | Xem section 21 ở trên |
| **VNPay Payment** | `src/routes/payment.routes.ts` (1069 dòng) | `src/middleware/vnpayIpnGuard.ts` (90 dòng), `src/services/payment/vnpay.service.ts` | Test trên sandbox trước |
| **Messaging (Socket.IO)** | `src/socket/messaging.socket.ts` (276 dòng) | `src/routes/messages.routes.ts` (284 dòng), `src/services/messages.service.ts` (901 dòng) | |
| **GitHub Repos / Tech Trends** | `src/routes/github.routes.ts` (315 dòng), `src/routes/techTrends.routes.ts` (492 dòng) | `src/services/github.service.ts` (825 dòng) | |
| **Dashboard** | `src/routes/dashboard.routes.ts` (794 dòng) | `prisma/schema.prisma` (DashboardState, DashboardTask, DashboardCelebration) | |
| **Social Network** | `src/routes/social.routes.ts` (675 dòng) | `src/services/social.service.ts` (908 dòng) | |
| **Uploads (files)** | `src/routes/upload.routes.ts` (241 dòng) | `src/services/upload.service.ts` (254 dòng) | Multer config |
| **Cyber Game** | `src/routes/cyber.routes.ts` (162 dòng) | `src/services/cyber.service.ts` (328 dòng) | |

#### B. SỬA / THÊM TÍNH NĂNG FRONTEND

| Tính năng cần sửa | File chính cần mở | File phụ thuộc |
|---|---|---|
| **Trang Login/Register** | `frontend/src/app/(auth)/login/page.tsx`, `frontend/src/app/(auth)/register/page.tsx` | `frontend/src/store/authStore.ts`, `frontend/src/middleware.ts` |
| **Trang chủ (Homepage)** | `frontend/src/app/page.tsx` | `frontend/src/components/home/*` |
| **Blog list/detail** | `frontend/src/app/blog/page.tsx`, `frontend/src/app/blog/[slug]/page.tsx` | `frontend/src/components/blog/*` (BlogCard, BlogPostDetailModal, ...) |
| **Projects/Skills** | `frontend/src/app/projects/page.tsx`, `frontend/src/app/skills/page.tsx` | `frontend/src/components/projects/*` |
| **Courses public** | `frontend/src/app/courses/page.tsx`, `frontend/src/app/courses/[id]/page.tsx` | `frontend/src/components/course/CourseCard.tsx` |
| **My Courses (enrolled)** | `frontend/src/app/my-courses/page.tsx` | |
| **Music Player** | `frontend/src/app/music/page.tsx`, `frontend/src/app/music/[playlistId]/page.tsx` | `frontend/src/components/music/*` (24 components), `frontend/src/store/musicStore.ts`, `playlistStore.ts` |
| **AI Chat** | `frontend/src/app/chat/page.tsx`, `frontend/src/app/chat/[sessionId]/page.tsx` | `frontend/src/store/chatStore.ts`, `frontend/src/app/api/chat/route.ts` |
| **Direct Messaging** | `frontend/src/app/messages/page.tsx`, `frontend/src/app/messages/[threadId]/page.tsx` | `frontend/src/components/messaging/*` (8 components: MessageBubble, MessageInput, ThreadList, ...), `frontend/src/store/messagingStore.ts`, `frontend/src/app/api/v1/[[...path]]/route.ts` |
| **Shop (products)** | `frontend/src/app/shop/page.tsx`, `frontend/src/app/shop/[id]/page.tsx` | `frontend/src/components/shop/*` (CartDrawer, ProductCard, ProductFilter, ...), `frontend/src/store/cartStore.ts` |
| **Cart / Checkout** | `frontend/src/app/cart/page.tsx`, `frontend/src/app/checkout/page.tsx` | `frontend/src/store/cartStore.ts`, `frontend/src/store/orderStore.ts` |
| **Payment status** | `frontend/src/app/payment/[orderId]/page.tsx`, `frontend/src/app/my-orders/page.tsx` | |
| **Admin Blog CMS** | `frontend/src/app/admin/posts/page.tsx` | |
| **Admin Projects** | `frontend/src/app/admin/projects/page.tsx` | |
| **Admin Courses** | `frontend/src/app/admin/courses/page.tsx`, `frontend/src/app/admin/lessons/page.tsx`, `frontend/src/app/admin/course-categories/page.tsx`, `frontend/src/app/admin/course-orders/page.tsx` | `frontend/src/components/admin/RichTextEditor.tsx`, `LessonDocumentsManager.tsx` |
| **Admin Music** | `frontend/src/app/admin/music/page.tsx` | |
| **Admin Shop** | `frontend/src/app/admin/shop/page.tsx`, `frontend/src/app/admin/orders/page.tsx`, `frontend/src/app/admin/discounts/page.tsx` | |
| **Admin AI Knowledge** | `frontend/src/app/admin/ai-knowledge/page.tsx` | Xem section 21 |
| **Admin Tech Trends CMS** | `frontend/src/app/admin/tech-trends/page.tsx` | |
| **Admin Users** | `frontend/src/app/admin/users/page.tsx` | |
| **Admin SEO (Indexing)** | `frontend/src/app/admin/seo/page.tsx` | `frontend/src/app/api/index-url/route.ts` |
| **Admin Stats/Dashboard** | `frontend/src/app/admin/stats/page.tsx`, `frontend/src/app/dashboard/page.tsx` | |
| **Admin Layout (nav)** | `frontend/src/app/admin/layout.tsx` | Thêm/sửa nav items |

#### C. SỬA DATABASE SCHEMA

| Khi cần thêm/sửa | File cần mở | Quy trình |
|---|---|---|
| Thêm model mới | `prisma/schema.prisma` (1789 dòng) | 1. Edit schema  2. `npm run db:generate`  3. `npx prisma migrate dev --name <name>`  4. Test local  5. Commit + push (CI auto-applies) |
| Thêm field vào model | `prisma/schema.prisma` | Same as above |
| Xoá model/field | `prisma/schema.prisma` | Same — cẩn thận data migration |
| Seed data | `prisma/seed.ts`, `prisma/seed-repos.ts` | `npm run db:seed` |
| Auto-sync table (RAG) | `src/index.ts` (function startServer, dòng ~510) | Thêm SQL idempotent |

#### D. SỬA INFRASTRUCTURE / DEPLOY

| Khi cần sửa | File cần mở |
|---|---|
| Docker services (thêm/sửa container) | `docker-compose.yml` (270 dòng) |
| Backend build (deps, stages, env) | `Dockerfile.backend` (112 dòng) |
| Frontend build (Next.js standalone) | `frontend/Dockerfile` |
| Nginx config (routes, cache, SSL) | `nginx/nginx.conf` (387 dòng) |
| HTTP-only fallback | `nginx/nginx.http.conf` |
| CI/CD workflow chính | `.github/workflows/backend-vps.yml` (249 dòng) |
| Force restart containers | `.github/workflows/vps-force-restart.yml` |
| Fix secrets (.env trên VPS) | `.github/workflows/vps-fix-secrets.yml` |
| Restart nginx | `.github/workflows/vps-restart-nginx.yml` |
| Fix nginx container order | `.github/workflows/vps-fix-nginx.yml` |

#### E. SỬA BẢO MẬT / AUTHENTICATION

| Khi cần sửa | File cần mở |
|---|---|
| JWT sign/verify | `src/services/auth.service.ts` (dòng ~1-200) |
| Login flow | `src/routes/auth.routes.ts` (dòng 1-100) |
| Middleware auth check | `src/middleware/auth.ts` (245 dòng) |
| CAPTCHA | `src/middleware/captcha.ts` (206 dòng), `src/services/captcha.service.ts` (95 dòng) |
| Email OTP | `src/services/otp.service.ts` (143 dòng) |
| Email sending | `src/services/email.service.ts` (406 dòng) |
| Rate limit | `src/index.ts` (dòng ~230-330) |
| Trust proxy (Cloudflare + Nginx) | `src/index.ts` (dòng 112-121) |
| CORS | `src/index.ts` (dòng 132-184) |

### 23.2 Workflow khi sửa tính năng (step-by-step)

**Quy trình chuẩn:**

```
1. TẠO BRANCH MỚI (không sửa trực tiếp main)
   git checkout -b fix/issue-description
   git checkout -b feat/new-feature

2. EDIT CODE
   - Sửa file backend: src/routes/X.routes.ts, src/services/X.service.ts
   - Sửa file frontend: frontend/src/app/X/page.tsx, frontend/src/components/X/X.tsx
   - Nếu thay đổi schema: prisma/schema.prisma

3. CHẠY BUILD CHECK (trước khi commit)
   npm run build                      # Backend: tsc compile
   cd frontend && npm run build        # Frontend: Next.js build

4. CHECK IMPORTS (theo .cursorrules)
   grep -E "motion\.|useState|useEffect" <file>.tsx
   → Verify all imports có trong file

5. COMMIT + PUSH
   git add .
   git commit -m "feat: description"
   git push origin <branch>

6. TẠO PR → MERGE vào main

7. CI TỰ ĐỘNG DEPLOY
   - Push vào main → trigger .github/workflows/backend-vps.yml
   - Workflow tự động: build → rsync → docker cp → restart
   - Verify: gh run view <id> --log

8. KIỂM TRA PRODUCTION
   curl -sI https://cuongthai.com
   curl -s https://api.cuongthai.com/api/v1/system/health

9. NẾU LỖI → REVERT
   git revert HEAD
   git push origin main
   → CI auto-deploy bản cũ
```

### 23.3 Workflow khi thêm tính năng mới (full feature)

**Ví dụ: Thêm "Comments cho Courses"**

```
Step 1: Database (Prisma)
   prisma/schema.prisma → thêm model CourseComment
   npm run db:generate
   npx prisma migrate dev --name add_course_comments
   Test local

Step 2: Backend Service
   src/services/course.service.ts → thêm function
   - createComment(courseId, userId, content)
   - getComments(courseId, page)
   - deleteComment(commentId, userId)
   - updateComment(commentId, userId, content)

Step 3: Backend Routes
   src/routes/course.routes.ts → thêm endpoints
   POST /api/v1/courses/:id/comments
   GET /api/v1/courses/:id/comments?page=1
   DELETE /api/v1/courses/comments/:commentId
   PATCH /api/v1/courses/comments/:commentId

Step 4: Backend test (manual)
   curl -X POST localhost:3001/api/v1/courses/1/comments \
     -H "Cookie: backend_token=..." \
     -d '{"content":"Great course!"}'

Step 5: Frontend Component
   frontend/src/components/course/CommentSection.tsx (NEW)
   - List comments
   - Add comment form
   - Edit/Delete buttons

Step 6: Frontend Page integration
   frontend/src/app/courses/[id]/page.tsx
   → import CommentSection
   → render dưới LessonList

Step 7: Admin page (optional)
   frontend/src/app/admin/course-comments/page.tsx (NEW)
   - List all comments
   - Moderate (delete inappropriate)

Step 8: Build + Test + Push
   npm run build
   cd frontend && npm run build
   git add . && git commit && git push

Step 9: CI auto-deploy
```

### 23.4 Workflow khi update dependencies

```
Step 1: Check outdated packages
   npm outdated
   cd frontend && npm outdated

Step 2: Update specific package
   npm install <package>@latest
   npm install --save-dev <package>@latest

Step 3: Test local
   npm run dev
   npm run build
   Test các tính năng chính

Step 4: Check breaking changes
   Đọc CHANGELOG của package
   Update code nếu cần

Step 5: Commit + Push
```

### 23.5 Workflow khi rotate secrets

```
Các secrets cần rotate định kỳ (3-6 tháng):
- JWT_SECRET
- JWT_REFRESH_SECRET
- COOKIE_SECRET
- SIGNED_URL_SECRET
- POSTGRES_PASSWORD
- AI provider keys (nếu nghi compromise)

Quy trình:
1. Generate new secret
   openssl rand -hex 32

2. Update GitHub Secrets
   gh secret set JWT_SECRET --body "new_secret_value"

3. Trigger deploy workflow (sẽ auto-inject vào VPS .env)
   gh workflow run backend-vps.yml

4. Verify VPS .env có new secret
   gh workflow run vps-dump-env.yml

5. Sau khi verified, xoá secret cũ khỏi backup
```

### 23.6 Workflow khi debug production issue

```
Bước 1: Xác định triệu chứng
   - 500 error? Check container logs
   - 502? Nginx không reach backend
   - 504? Backend timeout
   - Hydration error? Frontend issue

Bước 2: SSH vào VPS
   ssh root@160.187.1.208

Bước 3: Check containers
   docker ps -a
   docker logs cuonghoangdev_backend --tail 100

Bước 4: Check specific service
   docker exec cuonghoangdev_backend curl http://localhost:3001/health
   docker exec cuonghoangdev_nginx cat /etc/nginx/nginx.conf | head -50

Bước 5: Check Sentry (nếu có)
   - Login sentry.io
   - Filter by environment=production
   - Xem stack trace + frequency

Bước 6: Check monitor.log
   tail -100 /var/log/cuonghoangdev-monitor.log

Bước 7: Nếu cần rollback
   - Revert commit gần nhất
   - Push → CI auto-deploy bản cũ
   - Hoặc manual: docker restart cuonghoangdev_backend
```

### 23.7 File nào KHÔNG ĐƯỢC sửa tùy tiện

| File | Lý do |
|---|---|
| `Dockerfile.backend` | Đã tối ưu qua nhiều lần fix. Sửa sai → build fail hoặc permission issues |
| `nginx/nginx.conf` | 387 dòng config rất tinh tế (SSL, SSE, rate limit, security headers). Sửa sai → 502 |
| `docker-compose.yml` | Service dependencies + healthchecks phức tạp. Sửa sai → containers không start đúng thứ tự |
| `prisma/schema.prisma` | 1789 dòng, 74 models. Thay đổi ảnh hưởng TOÀN BỘ codebase |
| `.github/workflows/backend-vps.yml` | 249 dòng CI/CD. Sửa sai → deploy fail |
| `src/config/env.ts` | Zod validation. Sửa sai → app không start |
| `.cursorrules` | Quy tắc cho AI agent. Sửa sai → AI generate code sai pattern |

### 23.8 File cần backup trước khi sửa lớn

```bash
# Trước khi sửa lớn, backup:
cp src/routes/ai.routes.ts src/routes/ai.routes.ts.bak
cp prisma/schema.prisma prisma/schema.prisma.bak
cp docker-compose.yml docker-compose.yml.bak

# Backup database trước khi migrate
ssh vps "/opt/cuonghoangdev/scripts/backup-db.sh"
```

---

## 24. CÂU HỎI PHỎNG VẤN (Từ dự án thực tế)

> **Note:** Bộ câu hỏi này được tạo dựa trên những gì đã thực sự làm trong dự án. Bạn có thể trả lời dựa trên kinh nghiệm thực tế của mình.

### 24.1 Kiến trúc & Tổng quan (30 câu)

**Cơ bản:**

**Q1: Dự án này dùng những công nghệ gì? Kể tên các layer chính.**
- Frontend: Next.js 14 App Router, TypeScript, TailwindCSS, Zustand
- Backend: Node.js 22, Express 4, TypeScript, Prisma ORM
- Database: PostgreSQL 16 (postgis image)
- Cache: Redis 7
- AI: Groq/OpenAI/OpenRouter
- Container: Docker Compose
- CI/CD: GitHub Actions

**Q2: Tại sao chọn Next.js 14 App Router thay vì Pages Router?**
- Server Components mặc định → giảm JS bundle
- Streaming SSR
- Better code organization với layouts
- Modern best practices

**Q3: Tại sao tách frontend và backend thành 2 services riêng?**
- Independent scaling
- Có thể deploy riêng
- CORS separation (internal vs public)

**Q4: VPS nào đang host? Tại sao không dùng serverless (Vercel/Lambda)?**
- DigitalOcean Ubuntu 24.04, 4GB RAM
- Serverless tốn tiền khi traffic ổn định + vendor lock-in
- VPS rẻ hơn khi traffic predictable

**Q5: Tại sao dùng Docker Compose thay vì Kubernetes?**
- Single VPS → Compose đủ dùng
- Kubernetes quá phức tạp cho 1 server
- Có thể migrate sau nếu scale

**Q6: Dự án có bao nhiêu Prisma models?**
- 74 models (file schema.prisma 1789 dòng)

**Q7: Có bao nhiêu API routes?**
- 30+ route files, 100+ endpoints

**Q8: Có bao nhiêu frontend pages?**
- 30+ pages (20+ admin + 10+ public)

**Q9: Có bao nhiêu Zustand stores?**
- 12 stores

**Q10: File lớn nhất trong dự án là gì? Bao nhiêu dòng?**
- prisma/schema.prisma (1789 dòng)
- src/routes/course.routes.ts (1662 dòng)
- src/routes/music.routes.ts (1196 dòng)

**Trung bình:**

**Q11: Giải thích kiến trúc Cloudflare → Nginx → Express. Tại sao cần trust proxy?**
- Cloudflare edge IP thật của user, Nginx là reverse proxy, Express là app server
- Default `req.ip` = connection IP = Nginx internal IP
- Nếu `trust proxy = false`, mọi user share 1 IP → rate limit sai
- Solution: `app.set('trust proxy', (ip, hop) => hop <= 1)` — trust 1 hop

**Q12: Tại sao dùng Nginx riêng thay vì để Node.js handle static files?**
- Nginx serve static files nhanh hơn (sendfile, AIO)
- Bypass Node.js event loop
- Cache headers tốt hơn
- Reduce memory usage của Node process

**Q13: Tại sao dùng PostgreSQL có postgis extension thay vì MySQL?**
- JSONB support tốt hơn
- pgvector có sẵn (cho future RAG)
- Transactional integrity tốt hơn
- Mature, ACID compliant

**Q14: Tại sao dùng Redis riêng? Dùng in-memory cache trong Node không được sao?**
- Multi-process sharing (khi scale)
- Persistence (AOF)
- Rich data structures (Sorted Set cho leaderboard, etc.)
- Pub/sub cho real-time

**Q15: PostgreSQL bind mount vs Docker volume — chọn cái nào?**
- Bind mount (/opt/cuonghoangdev/postgres) → easy backup (rsync folder)
- Volume → abstracted, portable, nhưng backup khó hơn
- Chọn bind mount vì cần backup manual hàng ngày

**Q16: Hệ thống có những loại authentication nào?**
- Email/password (bcrypt)
- Email OTP (6-digit, TTL 10min)
- Google OAuth
- GitHub OAuth
- Cookie httpOnly + JWT

**Q17: JWT vs Session-based auth — chọn cái nào? Tại sao?**
- JWT: stateless, scale tốt, không cần DB lookup
- Session: dễ revoke, server-side state
- Chọn JWT cho SPA + httpOnly cookie (best of both worlds)

**Q18: Refresh token rotation là gì? Có dùng không?**
- Mỗi lần refresh, cấp refresh token mới + invalidate cái cũ
- Phát hiện token reuse → force logout
- Đang dùng pattern này trong auth.service.ts

**Q19: Tại sao dùng httpOnly cookie thay vì localStorage cho JWT?**
- httpOnly → JavaScript không đọc được → chống XSS
- Secure flag → chỉ gửi qua HTTPS
- SameSite → chống CSRF

**Q20: Cookie domain là gì? Tại sao cần set đúng?**
- Cookie chỉ được gửi cho domain đã set
- Set domain=.cuongthai.com → gửi cho cả api.cuongthai.com
- Frontend và backend cùng parent domain → cookie shared

**Nâng cao:**

**Q21: Giải thích chi tiết cách Cloudflare + Nginx + Express hoạt động với header X-Forwarded-For.**
- User IP gốc: 1.2.3.4
- Cloudflare thêm: X-Forwarded-For: 1.2.3.4
- Nginx thêm: X-Forwarded-For: 1.2.3.4, <cloudflare-ip>
- Express đọc: req.ip = 1.2.3.4 (with trust proxy)
- Cloudflare thêm CF-Connecting-IP (ưu tiên hơn XFF)

**Q22: Tại sao cần `app.set('trust proxy', (ip, hop) => hop <= 1)` thay vì `true`?**
- `true` → trust ALL hops → user có thể fake IP qua header
- Function → chỉ trust 1 hop gần nhất (Nginx) → an toàn

**Q23: So sánh next-intl, react-i18next, next-translate — chọn cái nào? Tại sao?**
- next-intl: native Next.js support, ICU format, middleware integration
- Đã chọn next-intl

**Q24: Microservices vs Monolith — khi nào nên tách?**
- Hiện tại: Monolith (đủ dùng)
- Khi AI service bị quá tải → tách AI service riêng
- Khi Messaging real-time cần scale độc lập → tách

**Q25: Sentry hoạt động thế nào? Tại sao cần init ở index.ts đầu tiên?**
- Capture exception + context + breadcrumbs
- Init ở đầu để capture được error trong quá trình import
- async hooks + stack trace

**Q26: Nếu traffic tăng 100x, hệ thống sẽ bottleneck ở đâu? Cách giải quyết?**
- Database connections → connection pooling (PgBouncer)
- AI API rate limit → upgrade plan hoặc self-host model
- Static assets → CDN (Cloudflare)
- Backend CPU → horizontal scaling (multiple containers)

**Q27: Tại sao không dùng GraphQL thay vì REST?**
- GraphQL overkill cho app này
- REST đơn giản, cache tốt, OpenAPI dễ generate
- N+1 problem với GraphQL phức tạp hơn

**Q28: WebSocket vs SSE vs Long polling — khi nào dùng gì?**
- WebSocket: bidirectional (Socket.IO cho messaging)
- SSE: server → client only (AI chat streaming)
- Long polling: fallback cũ

**Q29: Tại sao JWT_SECRET phải ≥32 chars?**
- HMAC-SHA256 cần key đủ dài để chống brute force
- <32 chars = insecure

**Q30: Tại sao cần tách JWT_SECRET và JWT_REFRESH_SECRET?**
- Compromise 1 → không ảnh hưởng cái kia
- Different rotation schedules

### 24.2 Authentication & Security (30 câu)

**Q31: Làm sao hash password? Tại sao không dùng MD5/SHA1?**
- bcrypt với cost 10
- MD5/SHA1 quá nhanh → dễ brute force
- bcrypt slow + salt tự động

**Q32: JWT structure là gì? Có 3 phần nào?**
- Header.Payload.Signature
- Header: alg, typ
- Payload: claims (sub, exp, iat, role)
- Signature: HMAC(header.payload, secret)

**Q33: Cookie httpOnly là gì? Khác Secure flag?**
- httpOnly: JS không đọc được (XSS protection)
- Secure: chỉ gửi qua HTTPS
- SameSite: chống CSRF

**Q34: OAuth flow là gì? Authorization Code vs Implicit?**
- Authorization Code: server-side, an toàn
- Implicit: client-side (deprecated)
- Dùng Authorization Code with PKCE

**Q35: CAPTCHA là gì? Tại sao dùng Turnstile thay vì reCAPTCHA?**
- reCAPTCHA Google (cũ, nặng)
- Turnstile: lightweight, free, privacy-friendly

**Q36: Rate limiting là gì? Tại sao cần?**
- Chống brute force, DDoS, abuse
- 3 tiers: general, auth, upload

**Q37: CORS là gì? Tại sao cần preflight?**
- Cross-Origin Resource Sharing
- Preflight (OPTIONS) check trước khi gửi request

**Q38: CSRF attack là gì? Cách phòng chống?**
- Cross-Site Request Forgery
- SameSite cookie + CSRF token + Origin header check

**Q39: XSS attack là gì? Cách phòng chống?**
- Cross-Site Scripting
- httpOnly cookie + Content-Security-Policy + escape output

**Q40: Helmet là gì? Có những header nào?**
- Security headers middleware
- HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

**Q41: JWT_SECRET rotation strategy như thế nào?**
- Có 2 secret cùng lúc (current + previous)
- Verify với current; nếu fail thì verify với previous
- Sau grace period → xoá previous

**Q42: Brute force protection chi tiết?**
- 5 failed logins → lockout 15 min
- Lưu `failedLoginCount`, `lockoutUntil` trong DB
- Reset counter on success

**Q43: OAuth state parameter là gì? Tại sao quan trọng?**
- CSRF protection cho OAuth flow
- Random string set khi redirect, verify khi callback

**Q44: Session fixation attack là gì? Cách phòng?**
- Attacker set session ID cho victim
- Regenerate session ID sau khi login

**Q45: Replay attack là gì? Cách phòng?**
- Attacker capture và replay valid request
- Nonce + timestamp trong signature

**Q46: VNPay IPN signature verification như thế nào?**
- HMAC SHA512 với secret key
- Compare sorted params + signature

**Q47: Idempotency key trong payment là gì?**
- Unique key cho mỗi request
- Nếu VNPay retry → không tạo duplicate order

**Q48: Account lockout vs rate limiting — khác nhau?**
- Account lockout: per-account (5 fails → 15 min)
- Rate limiting: per-IP (10 req/min)

**Q49: Refresh token rotation — cụ thể như thế nào?**
- User → /refresh với refresh_token
- Backend verify → issue new access + new refresh
- Invalidate old refresh
- Nếu old refresh bị reuse → compromise → logout all

**Q50: Logout flow như thế nào?**
- Client gọi /logout
- Backend add JWT to blacklist (Redis, TTL = remaining exp)
- Clear httpOnly cookies

**Q51: Email verification flow?**
- Generate 6-digit OTP, hash, lưu DB (TTL 10min)
- Send qua email
- User nhập → verify hash + TTL

**Q52: Forgot password flow?**
- User nhập email
- Backend generate reset token (random, hash, TTL 1h)
- Send link qua email
- User click link → form nhập new password
- Backend verify token → update password

**Q53: Tại sao store password hash, không phải password?**
- Nếu DB leak → attacker không có plain password
- bcrypt là one-way → không reverse được

**Q54: Timing attack là gì? Cách phòng?**
- Attacker đo response time để đoán đúng/sai
- Constant-time comparison cho secret comparison

**Q55: SQL injection là gì? Cách phòng?**
- Inject SQL qua user input
- Parameterized queries (Prisma ORM giúp)

**Q56: HTTPS là gì? Tại sao cần?**
- TLS encrypt giữa client-server
- Let's Encrypt free cert

**Q57: HSTS preload là gì?**
- Browser tự động upgrade HTTP → HTTPS
- Strict-Transport-Security header

**Q58: CSP là gì? Có dùng không?**
- Content-Security-Policy
- Đang disable trong backend (Next.js handle)
- Limit script sources

**Q59: CORS credentials mode là gì?**
- `Access-Control-Allow-Credentials: true`
- Cho phép gửi cookie cross-origin

**Q60: Tại sao backend `credentials: true` mà frontend `credentials: 'include'`?**
- Backend: cho phép nhận cookie
- Frontend: gửi cookie theo request

### 24.3 Database & Prisma (20 câu)

**Q61: Prisma là gì? So với raw SQL?**
- ORM: TypeScript types, migrations, query builder
- Raw SQL: nhanh hơn cho query phức tạp

**Q62: Migration là gì? Cách generate?**
- Schema changes → SQL files versioned
- `npx prisma migrate dev --name <name>`

**Q63: JSONB vs JSON trong PostgreSQL?**
- JSONB: binary, indexed, faster query
- JSON: text, slower
- Đang dùng JSONB cho embedding, social_links

**Q64: Index là gì? Khi nào cần?**
- Tăng tốc WHERE, ORDER BY, JOIN
- Đã có indexes cho document_chunks (type, doc_id, embedding_present)

**Q65: Foreign key constraint là gì?**
- Đảm bảo referential integrity
- ON DELETE CASCADE cho messages, chat_messages

**Q66: N+1 query problem là gì? Cách tránh?**
- 1 query lấy list + N query lấy detail
- Prisma `include` để eager load

**Q67: Connection pooling là gì? Tại sao cần?**
- Pool of DB connections để reuse
- Prisma tự manage qua DATABASE_URL params

**Q68: `prisma generate` làm gì?**
- Generate TypeScript client từ schema
- Output vào `node_modules/.prisma/client`

**Q69: `prisma db push` vs `prisma migrate dev`?**
- db push: apply schema trực tiếp, không tạo migration file (dev only)
- migrate dev: tạo migration file (production)

**Q70: PostgreSQL transaction là gì? ACID?**
- Atomic, Consistent, Isolated, Durable
- Prisma `$transaction([])` hoặc `$transaction(async tx => ...)`

**Q71: Composite unique constraint?**
- UNIQUE(col1, col2) → combination phải unique
- VD: enrollment (userId, courseId) → 1 user enroll 1 course 1 lần

**Q72: Lazy loading vs Eager loading trong Prisma?**
- Lazy: default, fetch related khi access
- Eager: `include` → fetch related ngay
- Trade-off: N+1 vs memory

**Q73: `@@map` và `@map` trong Prisma?**
- `@@map("table_name")`: rename table
- `@map("column_name")`: rename column

**Q74: Soft delete là gì? Đã dùng chưa?**
- Set `deletedAt` thay vì DELETE row
- Chưa dùng. Có thể thêm cho User, Post

**Q75: Audit fields (createdAt, updatedAt)?**
- Auto-set timestamps
- Prisma `@default(now())`, `@updatedAt`

**Q76: Database seeding là gì?**
- Insert initial data
- `npm run db:seed`

**Q77: Composite index? Khi nào dùng?**
- Index trên nhiều columns
- VD: `(documentId, documentType)` → faster delete by both

**Q78: Partial index là gì?**
- Index với WHERE clause
- VD: chỉ index rows có `embedding IS NOT NULL`

**Q79: Foreign key ON DELETE actions?**
- CASCADE: xoá dependent rows
- SET NULL: set NULL
- RESTRICT: prevent delete if dependents

**Q80: BigInt serialization issue — đã fix như thế nào?**
- Prisma trả BigInt cho role_version
- Patch `BigInt.prototype.toJSON = function() { return Number(this); }`
- Number(BigInt) safe up to 2^53-1

### 24.4 Frontend & React/Next.js (20 câu)

**Q81: Server Component vs Client Component?**
- Server: render ở server, no JS shipped
- Client: render ở browser, có state/effects

**Q82: `useEffect` là gì? Khi nào dùng?**
- Side effects: data fetching, subscriptions, DOM manipulation
- Deps array: chạy lại khi deps thay đổi

**Q83: `useState` vs `useRef`?**
- useState: trigger re-render khi change
- useRef: không re-render, lưu mutable value

**Q84: `useCallback` vs `useMemo`?**
- useCallback: memoize function reference
- useMemo: memoize computed value

**Q85: Hydration mismatch là gì? Cách tránh?**
- Server render khác client render
- localStorage/window trong body → mismatch
- Fix: `useEffect` + `mounted` check

**Q86: Next.js middleware là gì?**
- Chạy trước request đến page
- Dùng cho auth check, i18n routing

**Q87: `'use client'` directive là gì?**
- Đánh dấu component là Client Component
- Default trong App Router là Server Component

**Q88: Next.js Image component là gì?**
- Auto optimization (resize, format)
- Lazy load + blur placeholder

**Q89: CSS Modules vs TailwindCSS?**
- CSS Modules: scoped CSS files
- Tailwind: utility classes, faster dev

**Q90: Zustand vs Redux?**
- Zustand: lightweight, simple API
- Redux: boilerplate nhiều hơn

**Q91: Giải thích ssrSafeStorage pattern.**
- Custom storage cho Zustand persist
- Check `typeof window !== 'undefined'` trước khi access localStorage
- Tránh hydration warning

**Q92: Catch-all proxy pattern trong Next.js?**
- `[[...path]]/route.ts` match mọi sub-path
- Forward request đến backend
- Dùng cho cross-origin cookie

**Q93: Tại sao không gọi trực tiếp backend từ client component?**
- Cross-origin cookie không gửi
- CORS phức tạp
- Lộ token ra JS

**Q94: Server Actions là gì? Dùng không?**
- Next.js 14: gọi server function từ form
- Chưa dùng trong dự án này

**Q95: ISR (Incremental Static Regeneration)?**
- Static + revalidate sau X giây
- Có thể dùng cho blog pages

**Q96: Streaming SSR?**
- Render progressive, gửi UI khi ready
- `loading.tsx` với Suspense

**Q97: Parallel routes là gì?**
- Multiple pages render đồng thời
- `@modal` slot pattern

**Q98: Route handlers (`route.ts`)?**
- Thay thế API routes trong App Router
- `GET`, `POST`, `PUT`, `DELETE` exports

**Q99: Suspense boundaries?**
- `<Suspense fallback={<Skeleton />}>` quanh async component

**Q100: Layouts trong Next.js?**
- `layout.tsx` wrap pages, persistent UI
- Admin layout có sidebar

### 24.5 DevOps & Deployment (20 câu)

**Q101: Docker là gì? Container vs VM?**
- Container: shared OS kernel, lightweight
- VM: hypervisor, full OS, heavier

**Q102: Dockerfile là gì?**
- Recipe để build image
- FROM, RUN, COPY, CMD, ENTRYPOINT

**Q103: Multi-stage build là gì?**
- Stage 1: build (deps + compiler)
- Stage 2: runtime (minimal)
- Final image nhỏ hơn

**Q104: docker-compose là gì?**
- Multiple services orchestration
- YAML config

**Q105: GitHub Actions là gì?**
- CI/CD platform của GitHub
- YAML workflow

**Q106: Nginx là gì? Làm gì?**
- Web server + reverse proxy
- SSL termination, rate limiting, caching

**Q107: SSL/TLS là gì?**
- Encrypt HTTP traffic
- Let's Encrypt free cert

**Q108: Let's Encrypt ACME challenge?**
- Verify domain ownership
- HTTP-01: file trong /.well-known/
- DNS-01: TXT record

**Q109: `docker compose up -d --build` làm gì?**
- Build image + start containers detached

**Q110: `docker compose restart` vs `docker compose up -d`?**
- restart: restart existing containers
- up: tạo mới nếu chưa có

**Q111: CI/CD pipeline của dự án có những bước nào?**
- Checkout → Setup Node → Setup SSH → Build backend → Build frontend → Rsync → Deploy → Restart → Verify

**Q112: `rsync` vs `scp` — khác nhau?**
- rsync: incremental sync, faster
- scp: copy nguyên file

**Q113: Tại sao build trên CI thay vì trên VPS?**
- Reproducible
- VPS không cần build tools (image nhỏ hơn)
- Faster deploy (chỉ rsync artifacts)

**Q114: `docker cp` để làm gì?**
- Copy file vào container runtime
- Faster hơn rebuild image

**Q115: Tại sao `healthcheck` trong docker-compose quan trọng?**
- Docker restart nếu container fail
- Depend_on condition healthy → start in order

**Q116: Stop grace period là gì?**
- Time container để cleanup trước khi SIGKILL
- Default 10s, set 30s cho nginx để drain connections

**Q117: `depends_on` với `condition: service_healthy`?**
- Đợi service healthy trước khi start
- Tránh race condition

**Q118: Tại sao cần `tini` trong Dockerfile.backend?**
- PID 1 init, forward signals, reap zombies
- `docker stop` → SIGTERM → graceful shutdown

**Q119: Non-root user trong Docker — tại sao?**
- Security: nếu container escape → không có root privileges
- uid 1001 (nodejs)

**Q120: Bind mount vs Docker volume?**
- Bind mount: host path, easier backup
- Volume: managed by Docker

### 24.6 AI / RAG Specific (20 câu)

**Q121: RAG là gì? Tại sao cần?**
- Retrieval-Augmented Generation
- Bổ sung context từ knowledge base cho LLM
- LLM không được train trên data cá nhân

**Q122: Embedding là gì?**
- Vector representation của text
- Capture semantic meaning
- 384 dims (MiniLM-L6-v2)

**Q123: Cosine similarity là gì?**
- Đo góc giữa 2 vectors
- Score -1 → 1 (cùng chiều → 1)

**Q124: Chunking là gì? Tại sao cần?**
- Chia document lớn thành chunks nhỏ
- Embedding model giới hạn input length
- Better precision

**Q125: Streaming response là gì? SSE?**
- Server-Sent Events
- Real-time token-by-token

**Q126: Prompt engineering là gì?**
- Craft prompt để LLM trả lời tốt hơn
- System prompt, few-shot examples

**Q127: Token là gì?**
- Đơn vị LLM đọc
- ~4 chars = 1 token
- Max tokens: input + output

**Q128: Temperature là gì?**
- Randomness: 0 (deterministic) → 2 (chaotic)
- Default 0.7

**Q129: AI provider là gì? Multi-provider?**
- Groq, OpenAI, OpenRouter, Anthropic, ...
- Multi-provider = fallback khi 1 down

**Q130: LLM là gì?**
- Large Language Model
- llama-3.1-8b-instant, gpt-4o-mini

**Q131: Giải thích chunking algorithm trong dự án.**
- chunkSize=1000, overlap=200
- Cut tại paragraph/sentence boundaries
- Safety: throw nếu overlap >= chunkSize

**Q132: Tại sao overlap quan trọng?**
- Tránh mất context ở ranh giới chunks
- 20% overlap = balance giữa context và redundancy

**Q133: Semantic search vs Keyword search — khác nhau?**
- Semantic: dùng embedding, hiểu meaning
- Keyword: count word matches
- Hybrid: tốt nhất

**Q134: Top-K retrieval là gì?**
- Lấy K chunks có score cao nhất
- topK=5 hiện tại

**Q135: Threshold trong RAG là gì?**
- Filter chunks có score < threshold
- 0.1 hiện tại

**Q136: Tại sao Groq nhanh?**
- LPU (Language Processing Unit) custom hardware
- Inference cực nhanh (sub-second)

**Q137: Groq rate limit?**
- llama-3.1-8b-instant: 30 RPM, 14,400 RPD, 500K TPD
- Reset rolling window (mỗi phút), 00:00 UTC cho ngày

**Q138: Circuit breaker pattern?**
- 2 consecutive fails → OPEN circuit
- Skip provider trong cooldown
- Auto half-open để thử lại

**Q139: Retry với exponential backoff?**
- 1s, 2s, 4s delay
- Tránh hammer server đang recover

**Q140: Function calling là gì?**
- LLM gọi external functions
- Query DB, call API, ...
- Mở rộng RAG: real-time data

### 24.7 Performance & Scaling (20 câu)

**Q141: Compression (gzip) là gì?**
- Nén HTTP response
- Giảm bandwidth, tăng tốc độ

**Q142: Static file caching?**
- Cache-Control header
- `_next/static/*` → 1 year immutable

**Q143: Browser cache vs Server cache?**
- Browser: client-side, per-user
- Server: shared, per-server

**Q144: Redis cache use cases?**
- Session storage
- Rate limiting counters
- API response cache

**Q145: CDN là gì?**
- Content Delivery Network
- Cloudflare, CloudFront

**Q146: Lazy loading?**
- Load resource khi cần
- Images: `loading="lazy"`
- Components: `dynamic import`

**Q147: Tree shaking?**
- Loại bỏ unused code

**Q148: Code splitting?**
- Tách bundle thành chunks nhỏ

**Q149: Minification?**
- Loại bỏ whitespace, shorten variable names
- Vite, Terser

**Q150: Image optimization?**
- WebP format
- Resize, compress
- Next.js Image

**Q151: Database query optimization?**
- Index đúng cột
- `EXPLAIN ANALYZE` để xem plan
- Tránh SELECT *
- Pagination thay vì limit cao

**Q152: N+1 query — ví dụ trong dự án?**
- Lấy list courses + mỗi course lấy instructor → 1 + N queries
- Fix: Prisma `include: { instructor: true }`

**Q153: Connection pool tuning?**
- `connection_limit` trong DATABASE_URL
- Backend 1 instance: 10-20 connections OK

**Q154: Cold start latency?**
- Next.js SSR lần đầu
- Backend TypeScript startup
- Use keep-alive

**Q155: TTFB (Time to First Byte)?**
- Thời gian từ request đến byte đầu tiên
- Internal Docker network giảm từ 4s → 50ms

**Q156: SSR vs CSR performance?**
- SSR: faster FCP, slower TTI
- CSR: slower FCP, faster TTI (for SPAs)

**Q157: Prefetching Next.js?**
- `<Link>` auto prefetch in viewport
- `router.prefetch()` manual

**Q158: Streaming SSR?**
- `loading.tsx` với Suspense
- Progressive rendering

**Q159: Bundle size — cách giảm?**
- Lazy load heavy libs (chart, editor)
- Replace lodash → lodash-es
- Moment → date-fns
- Tree shaking

**Q160: Image lazy loading?**
- `loading="lazy"`
- `decoding="async"`
- Blur placeholder

### 24.8 Real-world Scenarios & Troubleshooting (20 câu)

**Q161: User báo "AI chat không hoạt động" — debug như thế nào?**
1. Hỏi user: "Bạn gặp lỗi ở trang nào? Cho tôi xem console.error."
2. `curl -X POST https://api.cuongthai.com/api/v1/ai/chat`
3. Check backend logs: `docker logs cuonghoangdev_backend --tail 50`
4. Nếu backend 500 → check circuit breaker, AI provider, env
5. Debug SSE: check Nginx buffering config

**Q162: Deploy bị fail — workflow fail ở step nào?**
- Build? → check TypeScript errors (`npm run build` local)
- Rsync? → check SSH key
- Docker cp? → check permissions
- OOM khi sync .next? → tăng RAM VPS hoặc optimize build

**Q163: Database chậm đột ngột — debug như thế nào?**
1. `EXPLAIN ANALYZE` query chậm
2. Check `pg_stat_activity` (active queries)
3. Check lock contention
4. Check connection pool (exhausted?)
5. Check disk I/O (`iostat`)

**Q164: User báo "Không login được" — possible causes?**
- Wrong password (lockout)
- JWT_SECRET rotated
- Cookie không set (CORS)
- Email not verified

**Q165: Memory leak — detect và fix?**
- Detect: `docker stats` (memory tăng dần), Node.js heap snapshot
- Common causes: event listeners không cleanup, circular references, cache không expire
- Fix: cleanup intervals/timeouts, remove listeners, use WeakMap

**Q166: High traffic spike — response strategy?**
- Auto-scaling: VPS không tự scale → manual
- CDN giảm load: Cloudflare static assets
- Rate limit emergency: tăng ngưỡng, block abusive IPs
- Database throttling: connection pool limit, queue requests
- Graceful degradation: tắt features không essential

**Q167: Security incident — response plan?**
- API key leaked: rotate ngay, check usage logs
- Database compromised: rotate POSTGRES_PASSWORD, restore backup, audit logs
- DDoS: Cloudflare protection, rate limit
- XSS: audit affected components, patch
- Phishing: user education, 2FA

**Q168: Multi-region deployment — design?**
- Database replication: Primary + read replicas
- CDN với edge caching
- Session affinity: sticky sessions hoặc stateless JWT
- Data consistency: eventual consistency cho cross-region
- Latency optimization: GeoDNS, multi-region deployment

**Q169: Nếu có 10 triệu users, scale hệ thống như thế nào?**
- Vertical: bigger server
- Horizontal: multiple backend instances + load balancer
- Database: read replicas + connection pooling + caching
- CDN cho static assets
- Microservices tách theo traffic
- Async processing cho heavy tasks (queue)

**Q170: Database 100GB, query chậm — optimize?**
- Indexes (EXPLAIN ANALYZE)
- Partition tables (by date, by user)
- Archive old data
- Materialized views cho aggregates
- Read replicas
- Caching layer (Redis)

### 24.9 Coding & Best Practices (20 câu)

**Q171: SOLID principles?**
- Single Responsibility: 1 class 1 reason to change
- Open/Closed: open for extension, closed for modification
- Liskov Substitution: subtypes substitutable
- Interface Segregation: many specific interfaces > 1 general
- Dependency Inversion: depend on abstractions

**Q172: DRY vs WET?**
- DRY: Don't Repeat Yourself (extract common code)
- WET: Write Everything Twice (sometimes OK cho readability)
- Balance: 3 repetitions → extract

**Q173: YAGNI principle?**
- You Aren't Gonna Need It
- Don't build features until needed

**Q174: KISS principle?**
- Keep It Simple, Stupid
- Simple solution > clever solution

**Q175: Code review checklist?**
- Correctness
- Performance
- Security
- Readability
- Tests
- Documentation

**Q176: Error handling strategies?**
- Try-catch ở boundaries
- Custom error classes (AppError)
- Global error handler middleware
- Log + Sentry
- User-friendly error messages

**Q177: Logging best practices?**
- Structured logs (JSON)
- Include request_id
- Log levels: debug, info, warn, error
- Don't log sensitive data (passwords, tokens)

**Q178: Testing pyramid?**
- Unit tests (base, nhiều, fast)
- Integration tests (middle)
- E2E tests (top, ít, slow)

**Q179: API versioning?**
- URL versioning: `/api/v1/`, `/api/v2/`
- Header versioning: `Accept: application/vnd.api+json; version=2`
- Đang dùng URL versioning

**Q180: Documentation?**
- README.md (overview)
- Code comments (why, not what)
- API docs (OpenAPI/Swagger)
- Architecture docs
- Runbooks (operational)

### 24.10 Misc Tech Questions (20 câu)

**Q181: TypeScript: `any` vs `unknown`?**
- `any`: opt-out type checking, dangerous
- `unknown`: type-safe alternative, must check before use

**Q182: TypeScript: `interface` vs `type`?**
- interface: declaration merging, extends
- type: unions, intersections, more flexible
- Both work, choose by use case

**Q183: ESM vs CommonJS?**
- ESM: ES6 modules, static imports, tree-shaking friendly
- CommonJS: require/module.exports, dynamic, Node.js traditional
- Dự án dùng ESM (`"type": "module"` trong package.json)

**Q184: Node.js event loop?**
- Phases: timers → pending callbacks → idle → poll → check → close callbacks
- Microtasks queue (Promises) between phases
- setImmediate() vs setTimeout()

**Q185: async/await vs Promises?**
- async/await: syntactic sugar, easier to read
- Promise.all: parallel execution
- Promise.allSettled: doesn't reject on first fail

**Q186: HTTP/2 vs HTTP/1.1?**
- HTTP/2: binary, multiplexed, header compression, server push
- HTTP/1.1: text, 1 connection per request (or 6)
- HTTP/2 faster, nhưng HTTPS only

**Q187: WebSocket protocol?**
- Full-duplex over single TCP connection
- Upgrade from HTTP
- Used by Socket.IO for messaging

**Q188: Idempotency keys?**
- Unique key for each request
- Nếu retry → same result, no duplicate
- VNPay payment dùng `vnp_TxnRef`

**Q189: Optimistic vs Pessimistic locking?**
- Optimistic: version field, retry on conflict
- Pessimistic: SELECT FOR UPDATE, block others
- Optimistic better cho low contention

**Q190: ACID vs BASE?**
- ACID: Atomic, Consistent, Isolated, Durable (relational DB)
- BASE: Basically Available, Soft state, Eventually consistent (NoSQL)

**Q191: CAP theorem?**
- Consistency, Availability, Partition tolerance — pick 2
- Distributed systems phải sacrifice 1 trong 2 (CA, CP, AP)

**Q192: Blue-green deployment?**
- 2 environments (blue/green)
- Switch traffic khi deploy xong
- Zero-downtime, easy rollback

**Q193: Canary deployment?**
- Deploy cho 5% users trước
- Monitor metrics
- Roll out dần nếu OK

**Q194: Feature flags?**
- Toggle features on/off without deploy
- LaunchDarkly, Unleash, custom
- A/B testing, gradual rollout

**Q195: Database migrations strategy?**
- Forward-only (no down migrations in prod)
- Backward-compatible (add column nullable, then backfill)
- Multi-step for destructive changes

**Q196: Backup strategy 3-2-1?**
- 3 copies
- 2 different media types
- 1 offsite

**Q197: RPO vs RTO?**
- RPO: Recovery Point Objective (how much data loss OK)
- RTO: Recovery Time Objective (how fast to recover)

**Q198: Chaos engineering?**
- Netflix Chaos Monkey
- Random failures to test resilience
- Game days

**Q199: Postmortem culture?**
- Blameless
- Focus on systemic issues, not individuals
- Action items

**Q200: Serverless trade-offs?**
- Pros: no ops, auto-scale, pay per use
- Cons: cold start, vendor lock-in, execution time limits

---

### 24.11 Sample Detailed Answers (5 câu khó nhất)

**Q21: Chi tiết Cloudflare + Nginx + Express trust proxy — trả lời đầy đủ**

```
Khi user gửi request:

1. User IP: 1.2.3.4 gửi HTTPS request đến cuongthai.com
   ↓
2. Cloudflare edge nhận request, terminate TLS
   - Thêm header: CF-Connecting-IP: 1.2.3.4
   - Thêm header: X-Forwarded-For: 1.2.3.4
   - Proxy request đến VPS (160.187.1.208:443)
   - Connection IP giờ là Cloudflare IP (172.64.x.x hoặc 104.x.x.x)
   ↓
3. Nginx (cuonghoangdev_nginx container) nhận request
   - Terminate SSL (Let's Encrypt cert)
   - Thêm header: X-Forwarded-For: 1.2.3.4, <Cloudflare IP>
   - X-Real-IP: 1.2.3.4
   - Proxy đến Express backend (localhost:3001 hoặc backend:3001 trong Docker network)
   - Connection IP ở layer này là Nginx container IP (172.18.0.x)
   ↓
4. Express (cuonghoangdev_backend container) nhận request
   - Mặc định req.ip = connection IP = 172.18.0.x → SAI
   - Với `app.set('trust proxy', (ip, hop) => hop <= 1)`:
     - Express trust 1 hop gần nhất (Nginx)
     - Đọc X-Forwarded-For → lấy "1.2.3.4, <Cloudflare IP>" → split → take last trusted = <Cloudflare IP>
     - hop = 0 (đầu tiên trong chain) → trust → req.ip = <Cloudflare IP>
   - Tốt hơn: đọc CF-Connecting-IP first trong auth limiter (Cloudflare set, user không fake được)

Vấn đề nếu sai:
- Nếu trust proxy = false: req.ip = 172.18.0.x → tất cả users share 1 IP
  → Rate limit collapse → "Too many requests" cho cả site
  → Mọi user bị block khi 1 user spam
- Nếu trust proxy = true (không function): trust ALL hops
  → Attacker có thể fake IP qua X-Forwarded-For header
  → Bypass rate limit

Best practice: trust proxy = (ip, hop) => hop <= N, với N = số proxy layers trung gian
```

**Q131: Chunking algorithm chi tiết — trả lời**

```
Algorithm: chunkText(text, chunkSize=1000, overlap=200)

INPUT: 
  - text: văn bản dài
  - chunkSize: kích thước mỗi chunk (1000 chars)
  - overlap: phần overlap giữa 2 chunks liên tiếp (200 chars)

OUTPUT: array of chunks

STEPS:
1. Validate: 0 ≤ overlap < chunkSize (throw nếu sai)
   → Tránh infinite loop (lỗi OOM đã fix)

2. chunks = []
   start = 0

3. while start < text.length:
   a. end = start + chunkSize
   
   b. if end >= text.length:
        end = text.length  // last chunk
      else:
        // Tìm điểm cắt tốt nhất trong khoảng [start + chunkSize/2, end]
        minCut = start + chunkSize/2
        candidates = [
          text.lastIndexOf('\n\n', end),  // paragraph break (ưu tiên 1)
          text.lastIndexOf('\n', end),    // line break (ưu tiên 2)
          text.lastIndexOf('. ', end),    // sentence end
          text.lastIndexOf('! ', end),
          text.lastIndexOf('? ', end),
          text.lastIndexOf('; ', end),    // clause break
          text.lastIndexOf(', ', end),    // phrase break
        ].filter(pos => pos > minCut)
        
        if candidates.length > 0:
          end = candidates[0] + 1  // Include separator
   
   c. chunk = text.slice(start, end).trim()
      if chunk.length > 10:
        chunks.push(chunk)
   
   d. // Slide forward with overlap
      nextStart = end - overlap
      if nextStart <= start:
        start = end  // Safety: force advance
      else:
        start = nextStart

4. return chunks

TẠI SAO:
- Cut tại paragraph/sentence boundaries: giữ ngữ cảnh không bị cắt giữa câu
- Overlap 200 chars: giúp AI có context overlap giữa 2 chunks → không mất thông tin ở ranh giới
- 20% overlap là balance giữa context và redundancy
- Safety check `nextStart <= start`: tránh infinite loop khi overlap >= chunkSize

BUG ĐÃ GẶP:
- Trước fix: nếu overlap >= chunkSize, nextStart <= start → loop vô tận → OOM
- Sau fix: validate 0 ≤ overlap < chunkSize + safety check force advance
```

**Q138: Circuit breaker pattern chi tiết — trả lời**

```
STATE MACHINE:
   CLOSED ──(2 fails)──► OPEN ──(cooldown expired)──► HALF_OPEN
      ▲                       │                            │
      │                       └────(try)──────────────────┘
      │                                                    │
      └─────────────────(success)──────────────────────────┘

STATE:
- CLOSED: normal, mọi request được gọi
- OPEN: skip tất cả requests, chờ cooldown expire
- HALF_OPEN: cho phép 1 request test, nếu success → CLOSED, fail → OPEN

CONFIG:
const FAILURE_THRESHOLD = 2;
const COOLDOWN_MS = {
  AUTH: 5 * 60 * 1000,        // 5 phút cho 401/403
  RATE_LIMIT: 60 * 1000,      // 60s cho 429
  SERVER_ERROR: 60 * 1000,    // 60s cho 5xx
  TIMEOUT: 30 * 1000,         // 30s cho timeout
  UNKNOWN: 45 * 1000,         // 45s mặc định
};

TRIP RULES:
- 2 consecutive fails → trip
- 1 critical error (AUTH/RATE_LIMIT) → trip immediately

FLOW:
1. Request đến provider
2. Check isCircuitOpen(name)
   - Nếu OPEN → skip, log "skipped (circuit open)"
3. Call provider with retry (3 attempts, exp backoff 1s/2s/4s)
4. Nếu success → closeCircuit(name) → reset counter
5. Nếu fail → tripCircuit(name, errMsg) → tăng counter, classify error

LỢI ÍCH:
- Latency thấp hơn khi provider down (không phải đợi retry 7s)
- Tự động "quay lại" provider yêu thích khi recover
- Admin không cần manually disable provider
```

**Q159: Bundle size optimization — trả lời**

```
1. LAZY LOADING:
   - next/dynamic cho heavy components:
     const Chart = dynamic(() => import('recharts'), { ssr: false })
   - loading.tsx cho routes
   - Suspense boundaries

2. TREE SHAKING:
   - import { X } from 'lodash-es' thay vì import _ from 'lodash'
   - Side-effect-free modules
   - Webpack tự loại unused exports

3. REPLACE HEAVY LIBS:
   - moment → date-fns (giảm ~70%, 200KB → 30KB)
   - axios → fetch native (giảm ~30%)
   - chart.js → recharts hoặc visx
   - lodash → lodash-es

4. IMAGE OPTIMIZATION:
   - Next.js Image component
   - Format: WebP, AVIF
   - Lazy loading: loading="lazy"
   - Responsive sizes

5. CSS:
   - TailwindCSS tree-shake unused classes
   - PurgeCSS
   - Critical CSS inline

6. BUNDLE ANALYZER:
   - @next/bundle-analyzer visualize
   - Identify biggest chunks
   - Code split strategically

7. CODE SPLITTING:
   - Route-based (Next.js tự làm)
   - Vendor split (React, libs riêng)
   - Dynamic import cho optional features

8. MINIFICATION:
   - Terser (default Next.js)
   - esbuild (faster)
   - SWC (Next.js default)

9. COMPRESSION:
   - Gzip (Nginx level)
   - Brotli (better compression)
   - Static asset compression

10. CDN:
    - Cloudflare (free tier)
    - Serve static assets từ edge

TRADE-OFFS:
- Aggressive optimization = more config complexity
- Lazy loading = initial loading state
- Tree shaking = strict ESM syntax
```

**Q161: Debug AI chat không hoạt động — step-by-step**

```
TRIỆU CHỨNG:
- User: "AI chat không phản hồi"
- Console có thể có error hoặc không

DEBUG STEPS:

1. HỎI USER (quan trọng nhất):
   "Bạn gặp lỗi ở trang nào? Cho tôi xem console.error."
   - URL cụ thể (/chat hoặc /chat/[id])?
   - Browser console có error?
   - Network tab có request failed?
   - Có text "Loading..." mãi không xong?

2. TEST API TRỰC TIẾP:
   curl -X POST https://api.cuongthai.com/api/v1/ai/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "test"}'
   
   → Nếu response streaming → backend OK
   → Nếu 502 → nginx không reach backend
   → Nếu 401 → chưa login
   → Nếu 500 → backend error

3. CHECK BACKEND LOGS:
   ssh vps "docker logs cuonghoangdev_backend --tail 100"
   
   Tìm:
   - "GROQ_API_KEY not configured" → missing env
   - "All AI providers failed" → tất cả provider down
   - "circuit open" → circuit breaker đang skip
   - Stack trace khác

4. CHECK ENV TRÊN VPS:
   ssh vps "grep GROQ /opt/cuonghoangdev/.env"
   
   → Nếu rỗng → GROQ_API_KEY chưa được inject
   → Fix: gh secret set GROQ_API_KEY + gh workflow run backend-vps.yml

5. CHECK CIRCUIT BREAKER STATE:
   (Cần thêm endpoint /api/v1/ai/admin/circuit-status hoặc check logs)

6. CHECK AI PROVIDER STATUS:
   curl https://api.groq.com/openai/v1/models \
     -H "Authorization: Bearer gsk_..."
   → Nếu 401 → key invalid
   → Nếu 200 → Groq OK

7. CHECK NGINX BUFFERING (SSE):
   curl -X POST https://cuongthai.com/api/v1/ai/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "test"}' -v
   
   → Nếu response không streaming → Nginx buffer
   → Check nginx.conf: proxy_buffering off, X-Accel-Buffering no

8. CHECK QUOTA:
   - User có thể đã hit quota
   - Check Redis: quota counter

9. RESTART NẾU CẦN:
   ssh vps "docker restart cuonghoangdev_backend"
   
   → Sau ~10s, test lại

10. NẾU VẪN KHÔNG ĐƯỢC:
    - Rollback commit gần nhất
    - Hoặc thêm AI provider mới (rotate key)
```

---

> **Tổng cộng: 200 câu hỏi trải đều 10 categories.** Bạn có thể yêu cầu thêm câu hỏi cho category cụ thể nếu cần!

---

## 📝 LỊCH SỬ CẬP NHẬT (updated)

| Ngày | Nội dung |
|---|---|
| 17/06/2026 (lần 1) | Tạo file tổng hợp đầu tiên (2499 dòng) |
| 17/06/2026 (lần 2) | **Bổ sung phần 21**: AI/RAG deep dive với 21 sub-sections + 4 ASCII diagrams |
| | **Bổ sung phần 22**: Schema diagram ER + ASCII art cho 74 models |
| | **Bổ sung phần 23**: Maintenance & Update Guide — bản đồ file khi cần sửa gì |
| | **Bổ sung phần 24**: 200 câu hỏi phỏng vấn + 5 sample detailed answers |
| | Thêm 3 API keys (Groq/OpenAI/OpenRouter) |
| | Fix backend crash do missing secrets |
| | Fix nginx container order |

---

> **Ghi chú cuối (cập nhật lần 2):**
> File này hiện có **24 phần chính** với hơn **5.000 dòng** nội dung. Bao gồm:
> - 20 phần tổng quan (phần 1-20)
> - 4 phần bổ sung deep-dive (phần 21-24)
> - 200 câu hỏi phỏng vấn có sample answers
> - Bản đồ file để biết khi nào cần sửa vào đâu
> - ASCII diagrams cho AI/RAG, database ER
>
> **Cách sử dụng file này hiệu quả:**
> 1. Đọc phần 1-20 để hiểu tổng quan
> 2. Phần 21-22 để hiểu sâu AI/RAG + database
> 3. **Phần 23 LÀ QUAN TRỌNG NHẤT** cho việc maintain — bookmark khi cần sửa code
> 4. Phần 24 để ôn phỏng vấn (có 200 câu chia 10 categories)
>
> Nếu muốn thêm câu hỏi phỏng vấn cho category cụ thể (đến 500-700 câu), bạn có thể yêu cầu tôi bổ sung tiếp!
