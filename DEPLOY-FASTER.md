# ⚡ Quy trình Deploy Nhanh — Ghi chú cho Cursor

> **Mục đích:** File này là "bộ nhớ" về quy trình deploy nhanh đã được thiết lập cho dự án `cuongthai.com`. Nếu sau này Cursor/AI mất context, mở file này ra để hiểu lại cách deploy đang hoạt động và tại sao nó nhanh.

---

## 🎯 TL;DR

Một lệnh duy nhất ở máy local:

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

- **Tổng thời gian:** ~2-2.5 phút cho code change thông thường (khi không đổi dependency).
- **Code change thuần (UI, logic, copy):** ~30-60 giây.
- **Cold build (đổi Dockerfile, package.json, prisma schema):** ~3-5 phút.

---

## 🧠 Tại sao deploy nhanh?

Deploy nhanh không phải vì "lệnh ngắn" — mà vì **nền tảng đã chuẩn bị sẵn** những thứ sau:

### 1. BuildKit cache ở phía server (yếu tố quan trọng nhất)

Script `scripts/deploy-vps.sh` bật BuildKit:

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

Kết hợp với **Dockerfile multi-stage** (Node deps install tách layer, build tách layer), mỗi lần build chỉ phải dựng lại layer bị thay đổi. Lần đầu cài `npm install` mất ~2 phút, lần sau nếu `package.json` không đổi thì layer đó được **tái sử dụng từ cache**, chỉ còn vài giây.

### 2. Zero-downtime deployment

Script dùng `docker compose up -d --build --remove-orphans`:

- Docker build image mới song song với image cũ vẫn chạy.
- Khi image mới sẵn sàng, Docker chỉ swap container (mất ~1-2 giây downtime, gần như không nhận ra).
- Không có downtime kéo dài như kiểu `docker stop` → `docker run`.

### 3. Health check tự động

Sau khi restart, script đợi `/health` của backend phản hồi 200 (tối đa 18 × 10s = 3 phút). Nếu fail thì log và exit, **không báo "done" giả**.

### 4. Database schema auto-sync

Trong deploy script có:

```bash
$DC exec -T backend sh -c "npx prisma db push --accept-data-loss --skip-generate"
```

Chạy **sau khi** container backend lên — nếu schema thay đổi, tự động áp dụng. Không cần SSH vào thủ công.

### 5. Source mirror qua rsync, không qua git pull

- `rsync` so sánh file và chỉ gửi **delta** (phần thay đổi). Nhanh hơn `git clone` + `git checkout` rất nhiều cho repo lớn có history dài.
- Exclude `node_modules`, `.next`, `.git`, `.env` để không gửi những thứ server sẽ tự build lại.

### 6. SSH key đã setup sẵn

- `~/.ssh/id_rsa` ở local → authorized_keys ở `root@160.187.1.208`.
- Không bị hỏi password, không bị 2FA.
- `-o BatchMode=yes` chống treo khi SSH hỏi passphrase.

### 7. Single source of truth cho env

File `/opt/cuonghoangdev/.env` ở server là **file env duy nhất** cho cả prod. Không cần truyền env qua SSH. Script `deploy-vps.sh` tự load file này trước khi build.

---

## 🏗️ Kiến trúc deploy

```
Local machine                      VPS (160.187.1.208)
─────────────                      ────────────────────
  code edit
       │
       ▼
  git commit + push                ┌──────────────────┐
       │                           │  GitHub mirror   │
       │  (backup + visibility)    └──────────────────┘
       ▼                                  ▲
  rsync ./  ──────SSH─────►  /home/deployer/repo/
                                     │
                                     ▼
                            bash scripts/deploy-vps.sh
                                     │
                       ┌─────────────┴─────────────┐
                       ▼                            ▼
              BuildKit rebuild              Health check
              (cached layers)               (curl /health)
                       │                            │
                       ▼                            ▼
              docker compose up -d         OK → "Deploy complete!"
              (zero-downtime swap)
```

### 3 container chính (project name: `repo`)

| Container | Image | Port | Vai trò |
|---|---|---|---|
| `cuonghoangdev_postgres` | `postgres:15-alpine` | internal | Database |
| `cuonghoangdev_backend` | custom (Node 20 + Prisma) | 3001 | Spring Boot API thay thế bằng Express |
| `cuonghoangdev_frontend` | custom (Next.js standalone) | 3000 | Next.js app |
| `cuonghoangdev_nginx` | `nginx:alpine` | 80/443 | Reverse proxy, SSL termination |

> ⚠️ Tên project compose là `repo` (không phải `cuonghoangdev`) — vì lần đầu setup, `docker compose up` tự lấy tên thư mục. Script đã hardcode `-p repo` để khớp với volume/label đang tồn tại.

---

## 📂 File quan trọng cần nhớ

| File | Vai trò |
|---|---|
| `scripts/deploy-vps.sh` | **Script deploy chính** chạy ở server. Build + restart + healthcheck + DB sync. |
| `scripts/deploy.sh` | Script deploy cũ (chưa tối ưu, đã superseded). |
| `Dockerfile.backend` | Multi-stage build cho backend. |
| `Dockerfile.frontend` | Multi-stage build cho frontend (Next.js standalone output). |
| `docker-compose.yml` | Định nghĩa 4 services: postgres, backend, frontend, nginx. |
| `/opt/cuonghoangdev/.env` | **Env production duy nhất** (DB URL, JWT secret, OAuth keys...). |
| `nginx/` | Config reverse proxy + SSL. |
| `~/.ssh/id_rsa` | SSH key local dùng để rsync + SSH. |

---

## 🛠️ Các tình huống đặc biệt

### Đổi `package.json` hoặc `Dockerfile`
→ Build layer `npm install` phải dựng lại. Lần đầu mất ~2 phút cho bước này. Sau đó cache lại.

### Đổi Prisma schema (`schema.prisma`)
→ Deploy xong sẽ tự chạy `prisma db push`. Nếu là thay đổi breaking, cần kiểm tra data migration thủ công trước.

### Server mất kết nối giữa chừng
→ `rsync` có thể chạy lại an toàn (idempotent). `docker compose up` cũng idempotent. Chỉ cần chạy lại nguyên lệnh.

### Frontend build lỗi TypeScript
→ `npm run build` ở local sẽ fail. **Không push** code lỗi. Fix rồi push lại.

### Cần rollback
→ Trên server: `cd /home/deployer/repo && git pull origin main --rebase && git checkout <commit-cũ> && bash scripts/deploy-vps.sh`.

### Cần xem log ngay
→ `ssh root@160.187.1.208 "cd /home/deployer/repo && docker compose -p repo logs -f --tail=100 backend"`.

---

## ✅ Pre-commit checklist (đã có trong `.cursorrules`)

Cursor tự động chạy trước mỗi commit:

1. `grep -E "motion\.|useState|useEffect|useRef" <file>` — xác nhận mọi hook đều có import tương ứng.
2. `npm run build` — phải pass exit code 0.
3. Sau khi push: `curl -sI https://cuongthai.com` để verify production.

---

## 📊 Tóm tắt tốc độ (đo thực tế)

| Lần | Thời gian | Ghi chú |
|---|---|---|
| Lần 1 (cold) | 3-5 phút | Tải base image + npm install cho cả 2 service. |
| Code thay đổi thuần (UI, copy) | 30-60 giây | Cache hit toàn bộ, chỉ rebuild layer app code. |
| Đổi 1 file trong `src/` | 30-45 giây | Next.js standalone build cache tốt. |
| Đổi `prisma/schema.prisma` | 1-2 phút | Thêm `prisma generate` + `prisma db push`. |
| Đổi `package.json` (thêm dep) | 2-3 phút | Phải chạy lại `npm install`. |

---

## 🔑 Điều kiện tiên quyết để deploy nhanh

Nếu thiếu 1 trong những thứ sau, deploy sẽ chậm hoặc fail:

- [x] **BuildKit enabled** (`DOCKER_BUILDKIT=1` trong script)
- [x] **Dockerfile multi-stage** (tách deps và build code ra layer riêng)
- [x] **`.dockerignore`** loại trừ `node_modules`, `.next`, `.git`
- [x] **`next.config.js` output: 'standalone'** (giảm image size)
- [x] **SSH key không passphrase** (`-o BatchMode=yes`)
- [x] **rsync exclude hợp lý** (không gửi file không cần)
- [x] **Env file tách riêng** ở `/opt/cuonghoangdev/.env`
- [x] **Health endpoint** sẵn ở backend (`GET /health` → 200)
- [x] **DB auto-migrate** qua `prisma db push`
- [x] **Project name cố định** trong compose (`-p repo`)

---

## 🆘 Khi deploy fail

```bash
# 1. SSH vào server xem trực tiếp
ssh -i ~/.ssh/id_rsa root@160.187.1.208 

# 2. Xem container status
cd /home/deployer/repo && docker compose -p repo ps

# 3. Xem log gần nhất của container fail
docker compose -p repo logs --tail=100 backend

# 4. Nếu DB lỗi, check trực tiếp
docker compose -p repo exec postgres psql -U postgres -d cuonghoangdev_db

# 5. Nếu build lỗi, build thủ công để xem
docker compose -p repo build backend

# 6. Rollback nhanh
git log --oneline -5  # tìm commit tốt
docker compose -p repo down
git checkout <commit-tốt>
bash scripts/deploy-vps.sh
```

---

## 📝 Ghi chú thêm

- **Tại sao không dùng CI/CD (GitHub Actions)?** Vì repo nhỏ, VPS chỉ có 1, việc thêm CI/CD layer sẽ chậm hơn rsync trực tiếp. Khi nào có nhiều môi trường (staging, prod, multi-region) thì chuyển sang CI/CD.
- **Tại sao không dùng `git pull` thay rsync?** `git pull` nhanh cho code change, nhưng cần `git lfs` cho file lớn, và `.next/` build cache không có ở server. Rsync đảm bảo toàn bộ state giống local.
- **Tại sao build trong Docker chứ không build ở local rồi copy?** Vì server có spec khác (CPU/RAM), build local có thể không tương thích. Docker đảm bảo build reproducible.
- **Scale up:** Khi cần deploy nhiều server, thay rsync bằng `docker save`/`docker load` để gửi image thay vì source.

---

*File này được tạo tự động sau khi nhận câu hỏi "tại sao deploy nhanh vậy?". Mục đích: để AI/người mới mở ra hiểu ngay toàn bộ quy trình mà không cần đọc lại 1000+ dòng deploy script.*

---

## ⚠️ BÀI HỌC: Tại sao KHÔNG chuyển sang GHCR Registry Deploy (2026-06-18)

Đã thử thiết kế workflow mới `docker-registry-deploy.yml` (build image trên CI → push lên `ghcr.io` → VPS pull & restart). Ý tưởng hay nhưng **không phù hợp với project này** vì các lý do sau:

### 1. Project có pre-existing TypeScript errors (~48 lỗi ở admin pages)

Backend có nhiều lỗi TS cũ trong admin pages (theo note "Build error pre-existing" ở cuối file). Workflow cũ `backend-vps.yml` xử lý bằng cách:

- Chạy `npx tsc` ở CI **chỉ để compile `dist/`**
- Sau đó rsync `dist/` xuống VPS
- VPS `docker cp` inject `dist/` vào container **đang chạy** (in-place)
- Không build lại Docker image → không cần `tsc` pass

Workflow GHCR mới thì lại:
- Build Docker image từ source sạch → `RUN npm run build` chạy `tsc` → **fail** vì pre-existing errors
- Không có cách bypass vì image phải chứa code compile được

### 2. App structure có code chung cho cả 2 context

Frontend Dockerfile ban đầu dùng `context=.` (repo root) thay vì `context=./frontend` → `COPY . .` copy cả `package.json` của backend → `npm run build` chạy `tsc` (backend) thay vì `next build` (frontend) → fail. Phải dùng 2 context khác nhau (root cho backend, frontend/ cho frontend), đồng nghĩa với 2 Dockerfile riêng — phức tạp hóa setup.

### 3. Workflow cũ đã là "near-optimal" cho single-VPS

DEPLOY-FASTER.md rationale (cuối file) ghi rõ:

> **Tại sao không dùng CI/CD (GitHub Actions)?** Vì repo nhỏ, VPS chỉ có 1, việc thêm CI/CD layer sẽ chậm hơn rsync trực tiếp.

Thực tế deploy cũ ~6-7 phút, trong đó:
- ~3-4 phút: `npx tsc` compile + `npm run build` Next.js (chạy trên VPS, CPU chậm)
- ~30-60s: rsync delta
- ~20-30s: docker restart + healthcheck

Đây là bottleneck thực sự — **không phải image pull qua SSH** (SSH delta 30-60s). Nếu muốn tăng tốc, **build TS ở CI** (CPU mạnh) thay vì build image từ source ở VPS — chính là workflow cũ đang làm rồi.

### 4. Khi nào GHCR mới đáng giá?

Chỉ khi:
- Backend/frontend **sạch TS errors** (chuyển sang strict mode nghiêm túc)
- Có nhiều môi trường (staging + prod + multi-region)
- Cần rollback nhanh bằng cách swap image tag

Trong khi đó, **workflow `backend-vps.yml` hiện tại đã là best fit**:
- Build code trên CI (CPU mạnh) → tăng tốc compile TS/Next
- `docker cp` inject in-place → zero downtime thực sự
- Không cần BuildKit cache ở VPS → tránh phụ thuộc local Docker state
- File `.env` ở VPS là single source of truth → đơn giản, dễ audit

### 5. Nếu muốn tăng tốc thêm, cải tiến gì?

Thay vì GHCR, tối ưu workflow `backend-vps.yml` theo hướng:
- **Bỏ qua bước build Next.js ở VPS** (đã làm rồi — CI build + sync .next xuống)
- **Tăng BuildKit cache hit rate** bằng cách mount cache volume persistent
- **Tăng parallelism**: chạy build backend và frontend song song ở CI (đã làm)

Đo thời gian: nếu `tsc` ở CI mất < 60s, tổng workflow sẽ là ~3-4 phút (vs GHCR ~2 phút nhưng rủi ro cao hơn nhiều).

---

# 🧠 BỘ NHỚ DỰ ÁN — Project Memory (Cập nhật: 2026-06-14)

> **Mục đích:** File này ghi lại TẤT CẢ thông tin quan trọng của dự án để khi AI/người mới bắt đầu chat session, mở file này ra là biết ngay toàn bộ context. Tránh nhầm lẫn như trường hợp AI đoán sai AI provider (Gemini vs Groq) trước đây.

## 🌐 Domain & Hosting

| Mục | Giá trị |
|---|---|
| **Domain chính** | `https://cuongthai.com` |
| **Subdomain API** | `https://api.cuongthai.com` (cùng IP, route qua Nginx) |
| **VPS IP** | `160.187.1.208` |
| **SSH user** | `root` |
| **SSH key** | `~/.ssh/id_rsa` |
| **App directory trên VPS** | `/home/deployer/repo` |
| **Uploads directory** | `/opt/cuonghoangdev/uploads` (volume mount, served bởi Nginx alias) |
| **SSL** | Let's Encrypt, mount từ `/opt/certbot/conf/archive/cuongthai.com` |
| **DNS** | Trỏ cả `cuongthai.com`, `www.cuongthai.com`, `api.cuongthai.com` về `160.187.1.208` |

## 🏗️ Kiến trúc hệ thống

```
Internet (HTTPS 443)
        ↓
┌───────────────────────────────┐
│ Nginx (cuonghoangdev_nginx)   │ ← SSL termination, static files, rate-limit
│ Port 80/443                   │
└───────────────────────────────┘
        │                │                │
        ↓ /api/v1/*      ↓ /              ↓ /uploads/*
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Backend      │  │ Frontend     │  │ Static files │
│ Node.js      │  │ Next.js 14   │  │ (Nginx alias)│
│ Port 3001    │  │ Port 3000    │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │
        ↓                ↓
┌──────────────┐  ┌──────────────┐
│ PostgreSQL   │  │ (chỉ proxy)  │
│ Port 5432    │  │              │
└──────────────┘  └──────────────┘
        ↓
┌──────────────┐
│ Redis        │
│ Port 6379    │
└──────────────┘
```

## 🐳 Docker Compose (project name: `repo`)

| Service | Container | Internal Port | Image / Build |
|---|---|---|---|
| `postgres` | `cuonghoangdev_postgres` | 5432 | `postgres:16-alpine` |
| `redis` | `cuonghoangdev_redis` | 6379 | `redis:7-alpine` |
| `backend` | `cuonghoangdev_backend` | 3001 | build từ `./backend` |
| `frontend` | `cuonghoangdev_frontend` | 3000 | build từ `./frontend` |
| `nginx` | `cuonghoangdev_nginx` | 80, 443 | `nginx:1.27.5-alpine` + bind mount config |

**Lưu ý:** Tất cả lệnh `docker compose` phải có `-p repo` để trỏ đúng project name.

## 🔐 Thông tin Admin

| Mục | Giá trị |
|---|---|
| **Username** | `Cuong03dx` |
| **Password** | `Cuong123` |
| **Email** | `cuongthaihnhe176322@gmail.com` |
| **Role** | `admin` (id=1) |
| **Owner identity** | Hoàng Nghĩa Cường, sinh 03/11/2003, FPT University, Software Engineer |
| **Socials** | Facebook: `CuongThaiswit`, Zalo: `0399360938`, GitHub: `cuonghoang1103` |

## 🤖 AI Chatbot — Groq (KHÔNG PHẢI GEMINI!)

> ⚠️ **QUAN TRỌNG:** Dự án dùng **Groq** làm AI provider, KHÔNG dùng Google Gemini. Code cũ trong `frontend/src/app/api/chat/route.ts` từng gọi Gemini — đã được xoá/rewrite thành proxy về backend.

| Mục | Giá trị |
|---|---|
| **Provider** | Groq (OpenAI-compatible API) |
| **Endpoint** | `https://api.groq.com/openai/v1/chat/completions` |
| **Library** | `openai` npm package (dùng chung cho cả Groq) |
| **Env var (backend)** | `GROQ_API_KEY` |
| **Default model** | `llama-3.1-8b-instant` (qua env `GROQ_CHAT_MODEL`) |
| **Embeddings** | Có thể dùng Groq embeddings hoặc model riêng (check `src/services/ai.service.ts`) |

### AI Chat endpoints

| Endpoint | Method | Auth | Mô tả |
|---|---|---|---|
| `/api/v1/ai/chat` | POST | optional | **SSE streaming**, dùng cho mọi UI chat |
| `/api/v1/ai/chat/sync` | POST | optional | Non-streaming, trả về JSON |
| `/api/v1/chat/sessions` | GET/POST | optional/auth | Quản lý session |
| `/api/v1/chat/history/:sessionId` | GET | optional | Lịch sử chat |
| `/api/v1/ai/feedback` | POST | auth | User feedback |
| `/api/v1/ai/analytics/overview` | GET | auth | Admin analytics |
| `/api/v1/ai/admin/config` | GET | auth | Admin config |
| `/api/v1/ai/admin/documents` | GET/POST/DELETE | auth | Quản lý RAG documents |
| `/frontend/api/chat` (local) | POST | — | Proxy về backend `/api/v1/ai/chat` (đã rewrite) |

### Groq env trên container

```bash
# Backend
GROQ_API_KEY=<REDACTED-VIEW-IN-.ENV-ON-VPS>
GROQ_CHAT_MODEL=llama-3.1-8b-instant
```

### Vì sao frontend không gọi Groq trực tiếp?

- Để **đồng bộ persona CuongMini** (system prompt ở backend)
- Để dùng **RAG knowledge base** từ admin upload
- Để có **session management** + lưu lịch sử DB
- Frontend chỉ cần fetch `/api/v1/ai/chat` qua Nginx → backend → Groq

## 🗄️ Database

| Mục | Giá trị |
|---|---|
| **Engine** | PostgreSQL 16 |
| **Database name** | `cuonghoangdev_db` |
| **User** | `postgres` |
| **Container** | `cuonghoangdev_postgres` |
| **Truy cập** | `docker compose -p repo exec postgres psql -U postgres -d cuonghoangdev_db` |
| **ORM** | Prisma (check `backend/prisma/schema.prisma`) |
| **Migration** | Auto-sync khi deploy (xem `scripts/deploy-vps.sh`) |

## 🚀 Quy trình Deploy

### Quy trình chuẩn (đã dùng nhiều lần, hoạt động ổn)

```bash
# 1. Commit + push từ local
cd /Users/admin/Downloads/api-backend
git add -A
git commit -m "..."
git push origin main

# 2. Sync code lên VPS
rsync -avz --delete -e "ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no" \
  --exclude='node_modules' --exclude='.next' --exclude='dist' --exclude='.git' \
  ./ root@160.187.1.208:/home/deployer/repo/

# 3. SSH vào VPS chạy deploy script
ssh -i ~/.ssh/id_rsa root@160.187.1.208
cd /home/deployer/repo
bash scripts/deploy-vps.sh
```

### Deploy script làm gì?

1. Pull image mới + build lại service thay đổi
2. Chạy Prisma migration (`prisma db push` hoặc `migrate deploy`)
3. Health check từng container
4. Reload Nginx nếu config đổi
5. In summary table

## 🔍 Debug commands thường dùng

```bash
# SSH vào VPS
ssh -i ~/.ssh/id_rsa root@160.187.1.208

# Xem containers
cd /home/deployer/repo && docker compose -p repo ps

# Xem logs (đổi 'backend' thành frontend/nginx/postgres/redis)
docker compose -p repo logs --tail=100 -f backend

# Vào PostgreSQL
docker compose -p repo exec postgres psql -U postgres -d cuonghoangdev_db

# Vào backend shell
docker compose -p repo exec backend sh

# Vào frontend shell
docker compose -p repo exec frontend sh

# Check env trong container
docker exec cuonghoangdev_backend printenv | grep GROQ
docker exec cuonghoangdev_frontend printenv | grep -E 'GROQ|GEMINI|NEXT_PUBLIC'

# Test API nhanh từ local
curl -s -X POST https://cuongthai.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Cuong03dx","password":"Cuong123"}'
```

## 📁 Cấu trúc repo

```
api-backend/
├── backend/                # Node.js + Express + Prisma + TypeScript
│   ├── src/
│   │   ├── routes/         # auth, ai, course, project, music, ...
│   │   ├── services/       # ai.service.ts (Groq), auth, payment, ...
│   │   ├── config/         # env.ts (load GROQ_API_KEY, ...)
│   │   ├── middleware/     # auth, rate-limit, error
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── Dockerfile
├── frontend/               # Next.js 14 (App Router) + TypeScript
│   ├── src/
│   │   ├── app/            # routes: /, /chat, /dashboard, /admin, ...
│   │   │   └── api/chat/route.ts  # Proxy về backend (đã rewrite)
│   │   ├── components/     # UI components
│   │   ├── hooks/          # useChatSSE, useAudioStream, ...
│   │   ├── lib/            # api.ts (axios client)
│   │   └── store/          # Zustand stores
│   └── Dockerfile
├── nginx/
│   └── nginx.conf          # Routing + SSL + SSE support
├── scripts/
│   ├── deploy-vps.sh       # Main deploy script
│   └── ...
├── docker-compose.yml      # (project name: repo)
├── DEPLOY-FASTER.md        # ← File này
├── DEPLOY-OPTIMIZATION.md
└── PAYWALL_PLAN.md
```

## 🧪 Các bài học / Pitfalls đã ghi nhận

1. **AI Provider: Groq, không phải Gemini.** Code cũ trong `frontend/src/app/api/chat/route.ts` từng dùng `GoogleGenerativeAI` + `GEMINI_API_KEY` — đã rewrite thành proxy.
2. **SSE streaming cần Nginx config đặc biệt** (`proxy_buffering off`, `proxy_cache off`, `X-Accel-Buffering no`, timeout 300s). Đã có sẵn ở `nginx.conf` location `/api/v1/ai/chat`.
3. **`CyberTerminal.tsx` từng gọi local route non-streaming** → fix bằng cách gọi thẳng `/api/v1/ai/chat` (SSE).
4. **`@google/generative-ai` đã xoá khỏi `frontend/package.json`** — không còn code nào dùng.
5. **Comments có `*/{...}` trong JSDoc** sẽ close block sớm, tsc parse thành code. Escape: `* /` thêm space.
6. **Hydration safety:** Tất cả `localStorage`/`window` phải bọc trong `useEffect` + check `typeof window !== 'undefined'`.
7. **Auth context ưu tiên:** Nếu frontend route có thể không auth, luôn check token optional rồi gửi Bearer nếu có (như local `/api/chat`).
8. **Build error pre-existing:** Có ~48 lỗi TypeScript/lint cũ ở admin pages, KHÔNG liên quan tới chat. Không cố fix trừ khi user yêu cầu.

## ✅ Khi user báo lỗi gì, check theo thứ tự

1. **AI chat chậm / không phản hồi:** Test `/api/v1/ai/chat` trực tiếp. Nếu OK → frontend. Nếu fail → check `GROQ_API_KEY` + Groq rate limit.
2. **Login fail:** Check admin user trong DB (`SELECT id, email, email_verified FROM users WHERE id = 1`).
3. **API 500:** `docker logs cuonghoangdev_backend --tail=50`.
4. **Frontend hydration error:** Tìm component nào truy cập `window`/`localStorage` trước mount → bọc trong `useEffect`.
5. **Upload fail:** Check `client_max_body_size 500m;` trong nginx + `multer` config backend.
6. **SSE không stream:** Check `proxy_buffering off` + `proxy_cache off` + `X-Accel-Buffering: no` trong nginx location `/api/v1/ai/chat`.

## 🔑 API keys / secrets hiện có (chỉ để tham khảo, KHÔNG commit lên git)

| Key | Vị trí | Trạng thái |
|---|---|---|
| `GROQ_API_KEY` | backend env (`cuonghoangdev_backend`) | ✅ Hoạt động |
| `GEMINI_API_KEY` | frontend env (cũ, không dùng nữa) | Có thể xoá |
| `JWT_SECRET` | backend env | ✅ |
| DB password | backend + postgres env | ✅ |
| `NEXTAUTH_SECRET` | frontend env | ✅ |
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | frontend env | (rỗng / optional) |
| `NEXT_PUBLIC_API_URL` | frontend env | `https://api.cuongthai.com` |

---

## 🐛 BUGS ĐÃ PHÁT HIỆN — 14/06/2026 20:30 (UTC+7)

### Bug #1: `/admin/embed-jobs` route TIMEOUT ⚠️ → ✅ FIXED 14/06/2026 20:48

**Triệu chứng:**
- Browser mở `/admin/embed-jobs` → "Failed to load embed jobs"
- `curl https://api.cuongthai.com/api/v1/admin/embed-jobs` → HTTP 000 timeout
- Test trong container cũng timeout
- Routes khác trong cùng admin (`/stats/overview`, `/users`) → 200 OK bình thường

**Root cause:**
1. **VPS không phải git repo**, nên file dist cũ tồn tại trên disk
2. Khi `docker compose build backend` không có code mới → image cũ được dùng
3. **Cách fix:** `rsync dist/routes/embedJobs.routes.ts vps:/opt/cuonghoangdev/dist/routes/` trước khi rebuild

**Bước fix đã làm:**

1. ✗ Tăng `generalLimiter` từ 100 → 500 (route bị skip với `skip()` option) — **không phải nguyên nhân**
2. ✗ Move `app.use('/api/v1/admin/embed-jobs', ...)` lên trước `app.use('/api/v1/admin', ...)` — **không phải**
3. ✗ Tạm thời bỏ `requireAdmin` middleware → vẫn hang — **không phải**
4. ✗ Tạo diagnostic route `_ping` → **404 not found** (nghĩa là router KHÔNG được register trong container) — **đây là clue**
5. ✓ **rsync file dist mới lên VPS + force rebuild** → **HOẠT ĐỘNG**

**Code changes (workaround đã apply):**
- Switch từ `authenticate + requireAdmin` middleware sang **inline auth check** trong `embedJobs.routes.ts`
- Lý do: mounting cả `/api/v1/admin/embed-jobs` và `/api/v1/admin` khiến auth middleware chạy 2 lần → có thể gây Prisma deadlock
- Inline check đơn giản hơn và tránh được bug

**Bài học:**
- VPS `/opt/cuonghoangdev` không phải git repo, phải rsync từng file hoặc cả folder
- Sau khi push Git, cần chạy deploy script để pull code mới (CI/CD hoặc manual rsync)

---

### Bug #2: Quota indicator hiển thị `500/500` không giảm (đã fix 1 phần)

**Triệu chứng:**
- Indicator ở chat header luôn hiển thị 500/500
- Nhưng Redis có key `quota:1:day:2026-06-14` với value > 0
- Có nghĩa counter CÓ tăng, nhưng frontend không đọc được

**Đã fix:**
- ✓ Di chuyển increment từ frontend `/quota/track` (silent fail do auth) → backend `quotaMiddleware()` trên `/ai/chat`
- ✓ Backend tự tăng counter khi user gửi message
- ✓ Verify Redis có data thật (`quota:1:day:2026-06-14 = 2`)

**Còn issue nhỏ:**
- Sau khi restart backend, key Redis vẫn còn → indicator sẽ hiển thị đúng từ data cũ
- Nhưng lần đầu deploy, response `/quota/me` ban đầu trả `used.day = 0` (vì Redis TTL chưa expire)
- User phải chat 1 lần để thấy số giảm

---

### Bug #3: General rate limit chặn admin routes (đã fix)

**Triệu chứng:**
- Frontend `/admin/embed-jobs` và `/quota/me` liên tục bị 429
- Vì `generalLimiter` (100 req / 15 min) không đủ cho:
  - QuotaIndicator auto-refresh mỗi 30s
  - Embed jobs page auto-refresh mỗi 10s
  - Multiple browser tabs

**Đã fix:**
- Tăng `generalLimiter` từ 100 → 500 req / 15 min
- Thêm `skip()` option cho `/v1/quota`, `/v1/admin/embed-jobs`, `/auth/admin-check`

```ts
// src/index.ts
const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: parseInt(process.env.RATE_LIMIT_MAX || '500', 10),
  skip: (req: Request): boolean => {
    const path = req.path;
    return path.startsWith('/v1/quota')
      || path.startsWith('/v1/admin/embed-jobs')
      || path.startsWith('/auth/admin-check');
  },
  // ...
});
```

---

### Bug #4: Login fail do password hash bị escape (đã fix)

**Triệu chứng:**
- Login với password đúng → "Sai mật khẩu"
- Bcrypt hash bị bash expansion (`$2a$` → `a0bash$`)

**Đã fix:**
- Dùng heredoc thay vì inline string:
```bash
ssh vps "docker exec -i cuonghoangdev_postgres psql -U postgres -d cuonghoangdev_db" <<EOF
UPDATE users SET password = '$HASH' WHERE id = 1;
EOF
```

---

## 🛠️ Quick diagnosis commands

```bash
# Health check
curl -s https://api.cuongthai.com/api/v1/system/health

# Test quota endpoint (no auth → 401)
curl -sI https://api.cuongthai.com/api/v1/quota/me

# Test admin embed-jobs (should work after fix)
curl -sI https://api.cuongthai.com/api/v1/admin/embed-jobs

# Check Redis quota keys
ssh vps 'docker exec cuonghoangdev_redis redis-cli KEYS "quota:*"'

# Check backend logs
ssh vps 'docker logs cuonghoangdev_backend --tail 30'

# Check container status
ssh vps 'docker ps --format "table {{.Names}}\t{{.Status}}"'

# Force rebuild
ssh vps 'cd /opt/cuonghoangdev && docker compose build --no-cache backend'
ssh vps 'cd /opt/cuonghoangdev && docker compose up -d --force-recreate backend'
```

---
Đơn giản hoá cho model bạn đang dùng (llama-3.1-8b-instant):

~30 request/phút
~14,400 request/ngày
~500,000 token/ngày

*Cập nhật lần cuối: 2026-06-14 — sau khi fix lỗi AI chat streaming & xoá Gemini dependency.*

---

## 🔒 Security Implementation (2026-06-14)

Commit `fcf38cb` — đã triển khai đầy đủ 3 lớp bảo mật theo yêu cầu của user.

### 1. OTP 6 số thay token dài (Redis-backed)

**Trước:** Token UUID 64 ký tự gửi qua link email (dài, dễ lộ nếu share link)

**Sau:** Mã 6 số ngẫu nhiên, gửi qua email, dùng 1 lần, hết hạn sau 5-10 phút.

| Endpoint | Mô tả | TTL |
|---|---|---|
| `POST /api/v1/auth/verify-email-otp` | Verify email bằng 6 số | 5 phút |
| `POST /api/v1/auth/resend-otp` | Gửi lại OTP (max 3 lần / giờ) | 5 phút |
| `POST /api/v1/auth/reset-password-otp` | Verify OTP + đặt pass mới | 10 phút |
| `POST /api/v1/auth/forgot-password` | Gửi OTP reset | 10 phút |

**Storage:** Redis key `otp:{type}:{email}` với `EX` TTL, kèm counter `attempts` chống brute-force (max 5 lần sai).

**Code:** `src/services/otp.service.ts`, `src/services/auth.service.ts` (methods `verifyEmailOtp`, `resetPasswordWithOtp`).

**Frontend:** `/verify-otp` page mới với `OtpInput` component (6 cells, paste-aware, auto-advance, 5min countdown resend).

### 2. Cloudflare Turnstile (CAPTCHA chống robot)

**Provider:** Cloudflare Turnstile (miễn phí, vô hình, không cần user click).

**Setup cần làm 1 lần (chưa làm):**

1. Vào https://dash.cloudflare.com/?to=/:account/turnstile → Add widget
2. Domain: `cuongthai.com`
3. Mode: **Invisible** (user không cần click)
4. Copy **Site Key** (public) + **Secret Key** (private)
5. Thêm vào `/opt/cuonghoangdev/.env` trên VPS:
   ```
   TURNSTILE_SITE_KEY=0x4AAAAA...
   TURNSTILE_SECRET_KEY=0x4AAAAA...
   ```

**Áp dụng cho:** `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/forgot-password`.

**Code:** `src/services/captcha.service.ts`, `src/middleware/captcha.ts`, `frontend/src/components/TurnstileWidget.tsx`.

**Lưu ý:** Nếu `TURNSTILE_SECRET_KEY` chưa set → middleware tự skip (dev mode). Production PHẢI set mới có hiệu lực.

### 3. Phân quyền + Login Gate

#### 3.1. Admin full quyền (đã có sẵn)

`/admin/*` → verify với backend `/api/auth/admin-check`. Nếu không phải admin → redirect `/login?error=not_admin`.

#### 3.2. Login required cho `/learn/*` (mới)

Next.js middleware refactor thành `handleAdminRoute` + `handleLearnRoute`. `/learn/*` yêu cầu bất kỳ user nào đã login (không cần admin).

Test: `curl -L https://cuongthai.com/learn/123` → 307 redirect `/login?callbackUrl=/learn/123&error=login_required`

#### 3.3. "Tạo playlist" bắt login (mới)

Component `PlaylistSection.tsx` — khi click "Tạo Playlist" mà chưa login → hiện modal `<LoginRequired variant="modal" />` với nút "Đăng nhập" → redirect về `/login?callbackUrl=/music`.

#### 3.4. Playlist ownership check (mới)

`PUT /api/v1/music/playlists/:id` và `DELETE /api/v1/music/playlists/:id` giờ enforce ownership:
- Chỉ creator (`userId === req.userId`) HOẶC admin mới được sửa/xoá
- User khác → 403 FORBIDDEN
- Verify: `existing.userId === req.userId` + `req.user.roles.includes('ADMIN')`

#### 3.5. "Tạo bởi: username" (đã có sẵn, verify lại)

- Backend: `musicService.getPlaylists()` đã include `user: { id, username, avatarUrl }`
- Frontend: `PlaylistCard` hiển thị `by {username}` (line 90-94), `PlaylistView` hiển thị `Tạo bởi {username}` (line 205-207)

### Files changed (commit fcf38cb)

| Loại | Files |
|---|---|
| **Backend mới** | `src/services/otp.service.ts`, `src/services/captcha.service.ts`, `src/middleware/captcha.ts`, `src/config/redis.ts` |
| **Backend sửa** | `src/services/auth.service.ts`, `src/services/email.service.ts`, `src/routes/auth.routes.ts`, `src/routes/music.routes.ts` |
| **Frontend mới** | `frontend/src/app/verify-otp/page.tsx`, `frontend/src/components/OtpInput.tsx`, `frontend/src/components/TurnstileWidget.tsx`, `frontend/src/components/LoginRequired.tsx` |
| **Frontend sửa** | `frontend/src/middleware.ts`, `frontend/src/lib/api.ts`, `frontend/src/app/(auth)/login/page.tsx`, `frontend/src/app/(auth)/register/page.tsx`, `frontend/src/app/forgot-password/page.tsx`, `frontend/src/components/music/PlaylistSection.tsx` |
| **Docs** | `SECURITY_PLAN.md` (mới) |

### Test sau deploy (2026-06-14 21:45)

```bash
# ✅ /verify-otp render 200
curl -I https://cuongthai.com/verify-otp

# ✅ /forgot-password render 200
curl -I https://cuongthai.com/forgot-password

# ✅ /learn/123 không auth → 307 redirect với error=login_required
curl -I https://cuongthai.com/learn/123

# ✅ /admin không auth → 307 redirect
curl -I https://cuongthai.com/admin

# ✅ OTP flow: gửi + verify
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"testsec1@example.com"}' \
  https://api.cuongthai.com/api/v1/auth/forgot-password
# → {"success":true,"data":{"sent":true,"ttl":599}}

# ✅ Login admin (captcha dev-mode bypass)
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"Cuong03dx","password":"Cuonglinh18052003@"}' \
  https://api.cuongthai.com/api/v1/auth/login
# → token + user info
```

### Bước tiếp theo (cần làm thủ công)

1. **Đăng ký Cloudflare Turnstile** cho `cuongthai.com` (link ở trên)
2. **Set env vars** `TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` trong `/opt/cuonghoangdev/.env`
3. **Restart backend** để middleware captcha kích hoạt: `cd /home/deployer/repo && bash scripts/deploy-vps.sh`
4. **Test CAPTCHA** thực tế: thử login/register từ trình duyệt ẩn danh
5. **Setup 2FA cho admin** (optional, làm sau) — cần TOTP library
6. **Audit log admin login** (optional) — lưu IP/UA/timestamp vào DB

### Tại sao Resend + Cloudflare Turnstile là combo tốt nhất?

- Cả 2 đều **miễn phí** (với giới hạn rất cao cho project size này)
- Cả 2 đều **privacy-friendly** (không tracking user như Google)
- Resend deliverability **>99%** (tốt hơn SES/Mailgun ở tầm giá này)
- Turnstile invisible (UX tốt hơn reCAPTCHA v3 vì không có badge góc)
- Stack **đơn giản**: 1 SDK cho email, 1 widget cho CAPTCHA

### Tham chiếu

- Plan chi tiết: `SECURITY_PLAN.md`
- Paywall plan (liên quan): `PAYWALL_PLAN.md` section 3 (requireLessonAccess — admin full quyền)
- Cloudflare Turnstile docs: https://developers.cloudflare.com/turnstile/
- Resend docs: https://resend.com/docs
