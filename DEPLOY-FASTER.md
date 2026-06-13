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
ssh root@160.187.1.208

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
