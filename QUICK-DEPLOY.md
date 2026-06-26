# Quick Deploy — VPS 160.187.1.208

Quy trình copy-paste 1 lần, không cần SSH thủ công, không cần nhớ IP/path.

## TL;DR

```bash
cd /Users/admin/Downloads/api-backend
git add -A && git commit -m "..." && git push origin main
bash scripts/deploy-vps.sh          # local helper, tự rsync + SSH + chạy
```

> File `scripts/deploy-vps.sh` ở local làm 2 việc: rsync code lên VPS, rồi SSH vào VPS chạy `scripts/deploy-vps.sh` (cùng tên nhưng là bản trên VPS).

---

## 1. Setup lần đầu (đã làm rồi, kiểm tra lại)

### Local
- SSH key: `~/.ssh/id_rsa` phải tồn tại, public key đã add vào VPS.
- Repo path: `/Users/admin/Downloads/api-backend`
- Git remote: `git@github.com:cuonghoang1103/api-backend.git`

### VPS
- IP: `160.187.1.208` (user `root`)
- Project code: `/home/deployer/repo/` (rsync từ local vào đây, KHÔNG phải git pull)
- Production env: `/opt/cuonghoangdev/.env` (DATABASE_URL, JWT, GEMINI_API_KEY, …)
- Containers chạy: `cuonghoangdev_{backend,frontend,nginx,postgres,redis}`

### Test kết nối
```bash
ssh -i ~/.ssh/id_rsa -o BatchMode=yes root@160.187.1.208 "echo ok && hostname"
```
Không hỏi passphrase → OK.

---

## 2. Deploy 1 phát — chạy lệnh nào?

### Cách A: Tự động hoàn toàn (khuyến nghị)

Từ local:
```bash
cd /Users/admin/Downloads/api-backend
git add -A
git commit -m "<type>(<scope>): <mô tả ngắn>"
git push origin main
bash scripts/deploy-vps.sh
```

Script local sẽ tự:
1. `rsync` code từ `/Users/admin/Downloads/api-backend/` → VPS `/home/deployer/repo/` (exclude `node_modules`, `.git`, `.next`, `.env*`, …)
2. SSH vào VPS, `cd /home/deployer/repo && bash scripts/deploy-vps.sh`
3. Script trên VPS sẽ:
   - Source `/opt/cuonghoangdev/.env` (robust, skip dòng malformed)
   - `docker compose -p repo up -d --build --remove-orphans`
   - Health check backend + frontend (tối đa 180s)
   - `npx prisma db push --accept-data-loss` (chỉ thêm, không xoá)
   - Report tóm tắt

**Tổng thời gian**: ~30–60s nếu chỉ đổi code (BuildKit cache), ~3–5 phút nếu đổi dependencies.

### Cách B: Thủ công từng bước (khi cần debug)

```bash
# Bước 1: rsync code
rsync -avz \
  -e "ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no" \
  --exclude "node_modules" --exclude ".git" --exclude ".next" \
  --exclude "*.log" --exclude ".env" --exclude ".env.local" \
  --exclude ".env.production" --exclude "coverage" --exclude "dist" \
  ./ root@160.187.1.208:/home/deployer/repo/

# Bước 2: SSH vào VPS và chạy deploy
ssh -i ~/.ssh/id_rsa root@160.187.1.208 "cd /home/deployer/repo && bash scripts/deploy-vps.sh"

# Bước 3: Verify
ssh -i ~/.ssh/id_rsa root@160.187.1.208 "cd /home/deployer/repo && docker compose -p repo ps"
curl -sI https://cuongthai.com
```

---

## 3. Verify sau deploy

```bash
# Containers
docker compose -p repo ps
# → tất cả STATUS = "Up ... (healthy)", trừ nginx lúc đầu có thể "starting"

# Backend health (từ trong container)
docker exec cuonghoangdev_backend curl -sf http://localhost:3001/health
# → {"status":"ok","database":"connected","environment":"production"}

# Production site
curl -sI https://cuongthai.com           # → 200
curl -s -o /dev/null -w '%{http_code}\n' https://cuongthai.com/music   # → 200
curl -s -o /dev/null -w '%{http_code}\n' https://cuongthai.com/api/v1/profile/session  # → 200
```

---

## 4. Các lỗi hay gặp & cách fix (kinh nghiệm thực tế)

### ❌ `DATABASE_URL` not set / Prisma "You must provide a nonempty URL"
**Nguyên nhân**: `docker-compose.yml` có `DATABASE_URL: "${DATABASE_URL}"` trong `environment:` block. Khi host shell không có biến này, nó ghi đè giá trị từ `env_file: /opt/cuonghoangdev/.env`.

**Fix**: `scripts/deploy-vps.sh` đã tự source `/opt/cuonghoangdev/.env` trước khi gọi compose. Nếu vẫn lỗi:
```bash
ssh -i ~/.ssh/id_rsa root@160.187.1.208
set +e
while IFS='=' read -r key value; do
  [ -z "$key" ] && continue
  case "$key" in '#'*) continue ;; esac
  if [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
    eval "export ${key}=${value}"
  fi
done < /opt/cuonghoangdev/.env
set -e
echo "DATABASE_URL=$DATABASE_URL"   # phải in ra URL
```

### ❌ `service "postgres" is not running` / `no such service: postgres`
**Nguyên nhân**: `docker compose` (không có `-p`) lấy project name = tên thư mục hiện tại. Nếu chạy từ `/home/deployer/repo` mà không `-p`, project name = `repo`. Containers/volumes cũ có label `com.docker.compose.project=repo` (do lần deploy trước dùng `-p repo`), nên `compose exec` không tìm thấy.

**Fix**: Luôn dùng `docker compose -p repo` (alias `$DC` trong script). Nếu cần đổi project name, sửa `COMPOSE_PROJECT=` ở đầu `scripts/deploy-vps.sh` rồi re-deploy.

### ❌ `error: a network with name cuonghoangdev_network exists but was not created for project "repo"`
**Vô hại** — chỉ là warning. Network cũ thuộc project khác. Nếu muốn sạch:
```bash
docker network rm cuonghoangdev_network 2>/dev/null || true
```

### ❌ `container name "/cuonghoangdev_postgres" is already in use`
**Nguyên nhân**: 2 compose project cùng trỏ vào container name trùng. Đã fix bằng `-p repo` xuyên suốt.

**Fix nhanh nếu vẫn kẹt**:
```bash
ssh -i ~/.ssh/id_rsa root@160.187.1.208 "
  docker ps -aq --filter 'name=cuonghoangdev' | xargs -r docker stop
  docker ps -aq --filter 'name=cuonghoangdev' | xargs -r docker rm -f
  cd /home/deployer/repo && docker compose -p repo up -d --build
"
```

### ❌ `Backend failed to become healthy within 180s`
1. Check logs: `docker logs --tail=50 cuonghoangdev_backend`
2. Lỗi phổ biến: `Error validating datasource db: You must provide a nonempty URL` → xem mục DATABASE_URL ở trên.
3. Lỗi Prisma FK constraint: `insert or update on table "X" violates foreign key constraint` → dữ liệu cũ không tương thích schema mới. Fix:
   ```sql
   -- Vào postgres: docker exec -it cuonghoangdev_postgres psql -U postgres -d cuonghoangdev_db
   DELETE FROM chat_messages WHERE session_id NOT IN (SELECT id FROM chat_sessions);
   ```
4. Rollback image cũ nếu cần kíp:
   ```bash
   ssh -i ~/.ssh/id_rsa root@160.187.1.208 "
     cd /home/deployer/repo
     git checkout HEAD~1 -- .   # nếu /home/deployer/repo là git
     # hoặc rsync lại code cũ từ commit trước
     docker compose -p repo up -d --build
   "
   ```

### ❌ Build image cũ vẫn dùng code cũ
BuildKit cache images dựa trên file. Sau khi rsync, **phải chạy `--build`** (không chỉ `up`). Script đã làm đúng.

Nếu cần build sạch từ đầu (cache miss hoàn toàn):
```bash
ssh -i ~/.ssh/id_rsa root@160.187.1.208 "
  cd /home/deployer/repo
  docker compose -p repo build --no-cache
  docker compose -p repo up -d
"
```

### ❌ `AIzaSy...: command not found` khi source .env
**Nguyên nhân**: Trong `/opt/cuonghoangdev/.env` có dòng bị malformed (thiếu `=`, ví dụ dòng chứa Google API key). `source` mặc định fail cả script.

**Fix tạm thời**: `scripts/deploy-vps.sh` đã dùng parser robust bỏ qua dòng lỗi. **Fix vĩnh viễn**: mở `/opt/cuonghoangdev/.env` trên VPS, thêm `=` cho dòng bị malformed (thường là `GEMINI_API_KEY=<your-api-key>`):
```bash
ssh -i ~/.ssh/id_rsa root@160.187.1.208 "nano /opt/cuonghoangdev/.env"
```

### ❌ Container exit ngay khi start (no error message)
Thường do `start_period` quá ngắn, hoặc `depends_on` chưa ready. Check:
```bash
docker inspect cuonghoangdev_backend --format '{{.State.Status}} | {{.State.Error}}'
docker logs cuonghoangdev_backend
```

---

## 5. Local helper: `scripts/deploy-vps.sh`

File local hiện **chỉ chứa** script cho **VPS** (cùng tên, copy giữa local ↔ VPS qua rsync). Nếu muốn 1 script local gọi tất cả, tạo thêm `scripts/quick-deploy.sh`:

```bash
#!/bin/bash
# scripts/quick-deploy.sh — chạy từ local, tự rsync + SSH + deploy
set -euo pipefail

VPS_HOST="160.187.1.208"
VPS_USER="root"
VPS_PATH="/home/deployer/repo"

echo "=== Step 1: rsync code to VPS ==="
rsync -avz \
  -e "ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no" \
  --exclude "node_modules" --exclude ".git" --exclude ".next" \
  --exclude "dist" --exclude "*.log" \
  --exclude ".env" --exclude ".env.local" --exclude ".env.production" \
  --exclude "coverage" \
  ./ "${VPS_USER}@${VPS_HOST}:${VPS_PATH}/"

echo "=== Step 2: run deploy on VPS ==="
ssh -i ~/.ssh/id_rsa "${VPS_USER}@${VPS_HOST}" "cd ${VPS_PATH} && bash scripts/deploy-vps.sh"

echo "=== Step 3: verify ==="
ssh -i ~/.ssh/id_rsa "${VPS_USER}@${VPS_HOST}" "cd ${VPS_PATH} && docker compose -p repo ps"

echo ""
echo "✅ Deploy complete!"
echo "  Frontend: https://cuongthai.com"
echo "  Backend:  https://cuongthai.com/api/v1"
```

Sau đó chỉ cần:
```bash
git add -A && git commit -m "..." && git push origin main
bash scripts/quick-deploy.sh
```

---

## 6. Rollback nhanh

```bash
# Rollback về commit trước (giữ code mới, chỉ build lại image cũ)
git log --oneline -5                          # xem hash commit muốn rollback
git reset --hard <commit-hash-cũ>             # local về commit cũ
rsync -avz -e "ssh -i ~/.ssh/id_rsa" \
  --exclude "node_modules" --exclude ".git" --exclude ".next" \
  --exclude "dist" --exclude "*.log" --exclude ".env*" --exclude "coverage" \
  ./ root@160.187.1.208:/home/deployer/repo/
ssh -i ~/.ssh/id_rsa root@160.187.1.208 "cd /home/deployer/repo && docker compose -p repo up -d --build"
```

Sau khi rollback xong, revert lại: `git reset --hard origin/main` rồi re-deploy.

---

## 7. Checklist trước khi deploy

- [ ] `npm run build` pass ở local (không có TS error)
- [ ] Đã test trên trình duyệt local nếu thay đổi UI
- [ ] Commit message rõ ràng (`<type>(<scope>): <mô tả>`)
- [ ] Push lên `main` xong
- [ ] `/opt/cuonghoangdev/.env` trên VPS còn đầy đủ keys (không ai xoá nhầm)

---

## 8. SSH config tiện (optional)

Thêm vào `~/.ssh/config` để khỏi nhớ IP:

```
Host vps
  HostName 160.187.1.208
  User root
  IdentityFile ~/.ssh/id_rsa
  StrictHostKeyChecking no
```

Rồi mọi lệnh `ssh vps "..."` thay cho `ssh -i ~/.ssh/id_rsa root@160.187.1.208 "..."`.

---

## Tóm tắt 1 dòng

```bash
git add -A && git commit -m "fix: ..." && git push origin main && bash scripts/deploy-vps.sh
```
