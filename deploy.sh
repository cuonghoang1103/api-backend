#!/bin/bash
# ============================================================
# CuongHoangDev — One-Click Deploy Script
#
# Dual-mode: runs correctly from BOTH your local Mac AND the VPS.
#
#   LOCAL MODE  (run from /Users/admin/Downloads/api-backend)
#     1. rsync code → VPS /home/deployer/repo  (skips node_modules, .next, etc.)
#     2. SSH into VPS and run this same script (VPS detects it's on VPS)
#
#   VPS MODE  (auto-detected when /opt/cuonghoangdev exists)
#     1. Source /opt/cuonghoangdev/.env
#     2. docker compose up -d --build --remove-orphans  (zero-downtime)
#     3. Prisma db push (schema sync)
#     4. Health checks (backend + frontend)
#     5. Docker cache cleanup (free SSD space)
#
# Usage (local):
#   bash deploy.sh             # full deploy (rsync + build)
#   bash deploy.sh --no-build  # rsync only, skip docker build (quick config push)
#
# Usage (VPS, manual):
#   cd /home/deployer/repo && bash deploy.sh
# ============================================================

set -euo pipefail

# ─── Config ────────────────────────────────────────────────────────────
VPS_IP="160.187.1.208"
VPS_USER="root"
VPS_SSH_KEY="${HOME}/.ssh/id_rsa"
VPS_DEPLOY_DIR="/home/deployer/repo"
VPS_ENV_FILE="/opt/cuonghoangdev/.env"
# Project name must match the label on the LIVE running containers.
# The live stack runs under project "cuonghoangdev" (its env lives at
# /opt/cuonghoangdev/.env and the health check below targets
# cuonghoangdev_frontend). The code dir is /home/deployer/repo/, so if
# we omit -p (or pass -p repo) Compose builds/starts a *separate* "repo"
# project and never replaces the live frontend — deploys appear to
# succeed but the site keeps serving the stale image. Pin the project to
# "cuonghoangdev" so build/restart act on the containers actually serving.
COMPOSE_PROJECT="cuonghoangdev"
HEALTH_URL="http://localhost:3001/api/v1/system/health"
MAX_HEALTH_RETRIES=18    # 18 × 10s = 3 minutes
HEALTH_INTERVAL=10

# ─── Flags ─────────────────────────────────────────────────────────────
NO_BUILD=false
for arg in "$@"; do
    case "$arg" in
        --no-build) NO_BUILD=true ;;
    esac
done

# ─── Helpers ───────────────────────────────────────────────────────────
info()  { echo "[$(date '+%H:%M:%S')] [INFO]  $*"; }
ok()    { echo "[$(date '+%H:%M:%S')] [✅ OK]  $*"; }
warn()  { echo "[$(date '+%H:%M:%S')] [WARN]  $*"; }
fail()  { echo "[$(date '+%H:%M:%S')] [❌ FAIL] $*"; }

# ─── Mode detection ────────────────────────────────────────────────────
# VPS has /opt/cuonghoangdev; the local Mac doesn't.
if [ -d "/opt/cuonghoangdev" ]; then
    MODE="vps"
else
    MODE="local"
fi

# ══════════════════════════════════════════════════════════════════════
#  LOCAL MODE — rsync + SSH
# ══════════════════════════════════════════════════════════════════════
if [ "$MODE" = "local" ]; then
    REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    echo ""
    echo "============================================="
    echo "  CuongHoangDev — Local → VPS Deploy"
    echo "  Target: ${VPS_USER}@${VPS_IP}:${VPS_DEPLOY_DIR}"
    echo "  $(date '+%Y-%m-%d %H:%M:%S')"
    echo "============================================="
    echo ""

    # ── Pre-flight: verify SSH access ──────────────────────────────
    info "Checking SSH connection to VPS..."
    if ! ssh -i "$VPS_SSH_KEY" \
              -o BatchMode=yes \
              -o ConnectTimeout=10 \
              -o StrictHostKeyChecking=accept-new \
              "${VPS_USER}@${VPS_IP}" "echo ok" &>/dev/null; then
        fail "Cannot reach ${VPS_USER}@${VPS_IP} with key ${VPS_SSH_KEY}"
        fail "Fix: ssh-copy-id -i ${VPS_SSH_KEY}.pub ${VPS_USER}@${VPS_IP}"
        exit 1
    fi
    ok "SSH connection OK"

    # ── Pre-flight: giáo trình ↔ sổ kịch bản /simulation ───────────
    # Chạy TRƯỚC rsync, ở đây là nơi DUY NHẤT có đủ cả hai phía: ảnh backend
    # không copy `frontend/` nên trong container không đối chiếu được.
    #
    # Bắt loại lỗi mà tsc và `next build` đều không thấy, vì chúng là lỗi DỮ
    # LIỆU: id kịch bản sai chính tả, tuỳ chọn không tồn tại, nhánh sai giá
    # trị, slug khoá lệch CSDL. Tất cả đều hỏng ÂM THẦM trên prod — kịch bản
    # rơi về mặc định, bài học minh hoạ sai nội dung, nút quay lại 404.
    if [ -f "${REPO_DIR}/scripts/sim-check.mjs" ] && command -v node &>/dev/null; then
        info "Checking simulation ↔ curriculum links..."
        if node "${REPO_DIR}/scripts/sim-check.mjs" --quiet; then
            ok "Simulation links OK"
        else
            fail "sim-check thất bại — sửa xong hãy deploy (chạy 'node scripts/sim-check.mjs' để xem đầy đủ)"
            exit 1
        fi
    fi

    # ── Pre-flight: đề thi trong content/exams ────────────────────
    # Cũng chạy TRƯỚC rsync, cùng lý do với sim-check: đây là lỗi DỮ LIỆU mà
    # tsc và `next build` không thấy. Bộ kiểm chạy THẬT từng đáp án mẫu và so
    # với expectedOutput — một đề mà chính đáp án mẫu không khớp thì học viên
    # không bao giờ đúng được, và AI cũng chấm sai theo.
    if [ -f "${REPO_DIR}/scripts/exam-check.mjs" ] && command -v node &>/dev/null; then
        info "Checking exam papers (đáp án mẫu phải chạy đúng)..."
        if node "${REPO_DIR}/scripts/exam-check.mjs" >/tmp/exam-check.log 2>&1; then
            ok "Exam papers OK"
        else
            tail -30 /tmp/exam-check.log
            fail "exam-check thất bại — sửa xong hãy deploy (chạy 'node scripts/exam-check.mjs' để xem đầy đủ)"
            exit 1
        fi
    fi

    # ── Pre-flight: số liệu mã nguồn cho trang /about ─────────────
    # PHẢI chạy TRƯỚC rsync. Trang /about khoe số commit / số trang / số bảng
    # dữ liệu, mà container KHÔNG tự đếm được: `.dockerignore` loại `.git` và
    # rsync bên dưới cũng `--exclude='.git/'`. Sinh ở đây thì mỗi lần deploy số
    # tự tươi lại, không ai phải nhớ sửa.
    # Hỏng thì CẢNH BÁO chứ không chặn: trang about tự ẩn ô nào thiếu số, không
    # đáng để một phép đếm làm hỏng cả lần deploy.
    if [ -f "${REPO_DIR}/scripts/gen-codebase-stats.mjs" ] && command -v node &>/dev/null; then
        info "Generating codebase stats for /about..."
        if node "${REPO_DIR}/scripts/gen-codebase-stats.mjs"; then
            ok "codebaseStats.json refreshed"
        else
            warn "gen-codebase-stats thất bại — /about sẽ dùng số liệu của lần deploy trước"
        fi
    fi

    # Ensure VPS deploy dir exists
    ssh -i "$VPS_SSH_KEY" \
        -o StrictHostKeyChecking=accept-new \
        "${VPS_USER}@${VPS_IP}" \
        "mkdir -p ${VPS_DEPLOY_DIR}"

    # ── Step 1: rsync code ─────────────────────────────────────────
    info "Syncing code to VPS via rsync..."
    # NOTE: top-level `data/` is NOT excluded. It used to be, grouped with
    # uploads/ as runtime state, but it now holds tracked SOURCE — the vendored
    # kanji stroke data the Hán tự module reads at runtime. Excluding it (with
    # --delete-excluded, no less) meant the folder never reached the VPS, the
    # Docker build had nothing to COPY, and the feature 500'd on prod while
    # working perfectly on this machine.
    #
    # `frontend/.next*` (có dấu sao), KHÔNG phải `frontend/.next/`: next.config.js
    # cho đổi thư mục build qua NEXT_DIST_DIR và các phiên làm việc song song vẫn
    # dùng nó (`.next-verify`, `.next-dev-isolated` — xem .claude/launch.json).
    # Luật cũ chỉ khớp đúng `.next/`, nên 05/08/2026 rsync đã đẩy 245 MB thư mục
    # dev `.next-dev-isolated` lên VPS rồi từ đó vào cả build context của Docker.
    # Không làm hỏng gì (prod luôn build vào `.next`) nhưng phình image và ăn
    # đĩa — mà VPS này đã một lần đầy đĩa làm chết Postgres.
    #
    # ⚠️ KHÔNG chèn dòng `#` vào giữa các dòng nối bằng `\` bên dưới: dấu `\`
    # nối các dòng thành MỘT lệnh, nên `#` sẽ biến mọi tham số phía sau thành
    # chú thích — kể cả `--exclude='.env'`, tức là bí mật bị đẩy lên VPS.
    #
    # `secrets.h`: khoá WiFi/API của firmware con robot
    # (firmware/mini-me-robot/src/secrets.h). Nó KHÔNG khớp mẫu `.env*` nên
    # suốt thời gian qua vẫn được đẩy lên VPS — bí mật nằm trên server mà
    # không ai cần tới nó ở đó (firmware nạp qua USB/OTA từ máy local, VPS
    # không build firmware). Thêm ở đây thì `--delete-excluded` cũng tự XOÁ
    # bản đã lỡ đẩy lên trong lần deploy kế tiếp.
    #
    # `desktop/release/` + `desktop/out/`: đầu ra của electron-builder — mỗi
    # nền tảng một installer ~100-300MB. VPS không chạy app desktop và không
    # build nó; đẩy lên chỉ tốn băng thông mỗi lần deploy và ăn đĩa (đúng cái
    # đã một lần làm đầy đĩa và giết Postgres). `node_modules/` và `dist/`
    # phía trên không có dấu `/` đầu nên rsync đã khớp ở MỌI độ sâu —
    # `desktop/node_modules` và `desktop/dist` được loại sẵn, không cần thêm.
    rsync -azP \
        --delete \
        --delete-excluded \
        --exclude='.git/' \
        --exclude='node_modules/' \
        --exclude='dist/' \
        --exclude='frontend/.next*' \
        --exclude='frontend/node_modules/' \
        --exclude='.env' \
        --exclude='.env.*' \
        --exclude='*.env' \
        --exclude='secrets.h' \
        --exclude='uploads/' \
        --exclude='*.log' \
        --exclude='.DS_Store' \
        --exclude='coverage/' \
        --exclude='desktop/release/' \
        --exclude='desktop/out/' \
        -e "ssh -i ${VPS_SSH_KEY} -o StrictHostKeyChecking=accept-new" \
        "${REPO_DIR}/" \
        "${VPS_USER}@${VPS_IP}:${VPS_DEPLOY_DIR}/"
    ok "Code synced → ${VPS_DEPLOY_DIR}"

    if [ "$NO_BUILD" = true ]; then
        ok "--no-build: skipping docker build. Config is updated on VPS."
        exit 0
    fi

    # ── Step 2: SSH into VPS and trigger VPS-mode deploy ───────────
    info "SSHing into VPS to build and restart containers..."
    echo ""
    # -T: no pseudo-TTY (deploy script is non-interactive; -tt causes
    # PTY teardown to propagate a spurious exit code 1 even when the
    # remote command succeeds).
    ssh -i "$VPS_SSH_KEY" \
        -o StrictHostKeyChecking=accept-new \
        -T \
        "${VPS_USER}@${VPS_IP}" \
        "cd ${VPS_DEPLOY_DIR} && bash deploy.sh"

    echo ""
    ok "Deploy complete. Live at https://cuongthai.com"
    exit 0
fi

# ══════════════════════════════════════════════════════════════════════
#  VPS MODE — Docker build + restart
# ══════════════════════════════════════════════════════════════════════

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DC="docker compose -p ${COMPOSE_PROJECT}"

echo ""
echo "============================================="
echo "  CuongHoangDev — VPS Build & Restart"
echo "  Dir: ${REPO_DIR}"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================="
echo ""

# ── Source production env ──────────────────────────────────────────
# Needed so compose sees DATABASE_URL, JWT_SECRET, etc. that are set
# via `environment:` blocks (which override env_file when the host
# shell variable is already set). We parse carefully to skip malformed
# lines that would cause `source` to abort.
if [ -f "$VPS_ENV_FILE" ]; then
    set +e
    while IFS='=' read -r key value; do
        [ -z "$key" ] && continue
        case "$key" in '#'*) continue ;; esac
        if [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
            # Strip surrounding double or single quotes (common in .env files)
            value="${value%\"}" ; value="${value#\"}"
            value="${value%\'}" ; value="${value#\'}"
            export "${key}=${value}"
        fi
    done < "$VPS_ENV_FILE"
    set -e
    ok "Loaded env from ${VPS_ENV_FILE}"
else
    fail "Missing ${VPS_ENV_FILE} — cannot deploy without production secrets."
    exit 1
fi

cd "$REPO_DIR"

# ── Pre-flight ─────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
    fail "Docker is not installed."
    exit 1
fi

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
info "BuildKit enabled (parallel layer builds + cache)"

# ── Step 1: Ensure persistent data directories exist ──────────────
DATA_DIR="${DATA_DIR:-/opt/cuonghoangdev}"
for dir in "${DATA_DIR}/postgres" "${DATA_DIR}/redis" "${DATA_DIR}/uploads" "${DATA_DIR}/tts-models"; do
    [ -d "$dir" ] || { mkdir -p "$dir"; ok "Created $dir"; }
done

# ── Step 2a: Build images ONE AT A TIME (OOM guard) ───────────────
# The VPS has 6GB RAM shared with the live stack. When the build cache
# is cold (it is pruned at the end of every deploy), building backend
# and frontend in parallel peaks above available RAM and the kernel
# kills `next build` (exit 137, seen 2026-07-06). Building sequentially
# keeps the peak to one image at a time; with a warm cache each build
# is a fast no-op, so normal deploys lose no time.
info "Building backend image..."
$DC build backend
ok "Backend image built"
info "Building frontend image..."
$DC build frontend
ok "Frontend image built"
# ── Image thứ ba: TTS. CHỈ dựng lại khi services/tts/ thật sự đổi ──
#
# ⚠️ Chú thích cũ ở đây nói "lớp pip install được cache nên lần deploy
# sau gần như không tốn giây nào". Đúng lý thuyết, SAI thực tế — và nó
# nằm ngay cạnh dòng lệnh nên không ai kiểm lại.
#
# Cuối chính file này có `docker builder prune --keep-storage=4g`. Lớp
# pip của TTS (torch CPU + gradio + librosa) nặng hơn 2GB, mà 4GB là
# trần dùng chung cho cả ba image — nên nó bị dọn sau MỖI lần deploy và
# lần sau luôn phải cài lại từ đầu. Đo ngày 12/08/2026: ~10 phút mỗi
# deploy, năm lần liên tiếp, cho một dịch vụ không đổi một dòng nào.
#
# Nghịch lý hơn nữa: từ 12/08 robot đọc bằng máy để bàn ở nhà qua đường
# hầm SSH ngược, nên container TTS trên VPS chỉ còn là đường lui cuối.
# Ta đang trả 10 phút mỗi lần cho thứ hiếm khi chạy tới.
#
# HAI điều kiện, không phải một:
#   - băm khớp  → nội dung không đổi
#   - image còn → chưa bị `docker image prune -af` cuối file dọn mất
# Chỉ xét băm thì lúc ai xoá image bằng tay sẽ hỏng; chỉ xét image thì
# sửa app.py xong sẽ không được dựng lại — im lặng và rất khó tìm.
#
# In ra dòng "bỏ qua" chứ KHÔNG im lặng: một tối ưu âm thầm trông y hệt
# một bước bị hỏng, và người đọc log tháng sau sẽ ngồi đoán tại sao sửa
# app.py mà không thấy gì đổi.
# Băm MỌI file .py trong services/tts/, không chỉ app.py. Bản cũ chỉ băm
# `Dockerfile + app.py`, nên sửa `f5_giong.py` xong deploy vẫn in "BỎ QUA"
# và chạy ảnh cũ — cộng với việc Dockerfile hồi đó chỉ `COPY app.py`, đó là
# đúng hai lớp im lặng chồng lên nhau (sự cố TTS 15/08/2026).
# `sort` để thứ tự file không phụ thuộc vào thứ tự `find` trả về, nếu không
# băm sẽ đổi lung tung giữa các máy và deploy nào cũng dựng lại 10 phút.
TTS_HASH=$( { cat services/tts/Dockerfile 2>/dev/null; \
              find services/tts -maxdepth 1 -name '*.py' -type f -print0 2>/dev/null \
                | sort -z | xargs -0 cat 2>/dev/null; } | sha256sum | cut -c1-16)
# Đặt dấu băm trong DATA_DIR (/opt/cuonghoangdev), KHÔNG đặt trong repo:
# repo bị rsync ghi đè mỗi lần deploy, còn DATA_DIR thì rsync không đụng
# tới — chính chỗ `.env` production đang sống.
TTS_STAMP="${DATA_DIR}/.tts-image-hash"
TTS_IMG_CO=$(docker image inspect "${COMPOSE_PROJECT}-tts" >/dev/null 2>&1 && echo yes || echo no)

if [ "$TTS_IMG_CO" = "yes" ] && [ -f "$TTS_STAMP" ] && [ "$(cat "$TTS_STAMP")" = "$TTS_HASH" ]; then
  ok "TTS image: BỎ QUA (services/tts/ không đổi, băm $TTS_HASH) — tiết kiệm ~10 phút"
else
  if [ "$TTS_IMG_CO" = "no" ]; then
    info "Building TTS image (chưa có image)..."
  else
    info "Building TTS image (services/tts/ đã đổi)..."
  fi
  $DC build tts
  echo "$TTS_HASH" > "$TTS_STAMP"
  ok "TTS image built (băm $TTS_HASH)"
fi

# ── Step 2b: Atomic restart (zero-downtime) ───────────────────────
# `up -d` atomically swaps the running containers to the images
# built in Step 2a — no downtime window unlike `down && up`.
# Do NOT pass `--build` here: compose bake treats it as a fresh
# parallel build of BOTH images (observed 2026-07-07 — it re-ran
# `next build` alongside the backend export and the kernel OOM-killed
# it, exit 137), defeating the sequential OOM guard above.
# `--force-recreate` ensures containers with the same name but a
# stale image get torn down before the new one is created
# (otherwise Compose refuses to bind a duplicate container_name).
# `--remove-orphans` cleans up containers for removed services.
info "Restarting containers (zero-downtime)..."
$DC up -d --force-recreate --remove-orphans
ok "Containers swapped to freshly built images"

# ── Step 3: Database schema sync (migration deploy) ──────────────
# We use `migrate deploy` (not `db push`) so that:
# 1. Raw SQL in our migration files (e.g. generated tsvector
# columns, GIN indexes, triggers) is applied — `db push`
# only knows about schema.prisma and silently skips them.
# 2. Every applied migration is recorded in
# `_prisma_migrations`, so subsequent deploys are idempotent
# and we can audit which DBs are on which version.
# 3. The `--accept-data-loss` flag from `db push` is gone —
# we never want to silently drop columns on a live DB.
info "Waiting 10s for backend to initialise before Prisma migrate..."
sleep 10

PRISMA_OUT=$($DC exec -T backend sh -c \
 "npx prisma migrate deploy" 2>&1) || true
if echo "$PRISMA_OUT" | grep -qi "already in sync\|no pending migrations"; then
 ok "Database schema already in sync"
elif echo "$PRISMA_OUT" | grep -qi "error"; then
 warn "Prisma migrate had errors — see /tmp/prisma.log"
 echo "$PRISMA_OUT" > /tmp/prisma.log
 else
 ok "Database schema migrated"
 # Print the tail of the migrate output so we can see which
 # migrations were applied this run.
 echo "$PRISMA_OUT" | tail -5 | sed 's/^/ /'
 fi

# ── Bộ dò lỗi seed dùng chung ───────────────────────────────────
#
# Trước đây mỗi khối seed tự dò bằng `grep -qiE "error|cannot find|
# exception|invalid"`. Bộ dò đó khớp chữ "error" Ở BẤT KỲ ĐÂU trong
# output — kể cả khi nó nằm trong chính NỘI DUNG đang được seed. Giáo
# trình Node.js có hai bài tên là "5.4 — Centralised error handling" và
# "9.4 — … what your errors give away", nên MỌI lần deploy đều bật cảnh
# báo dù seed chạy đúng hoàn toàn (`sections +0 · lessons +0 ~112. Done.`).
#
# Cảnh báo kêu mãi mà không có thật thì người deploy sẽ quen tay bỏ qua —
# và đó chính là lúc một lỗi seed THẬT lọt lưới.
#
# Bộ dò mới chỉ khớp DẤU HIỆU LỖI THẬT mà các script này thực sự in ra,
# đã đối chiếu với output thật trên prod:
#   ✗ / ✘                    — cách các seeder tự báo lỗi kiểm tra
#   <Tên>Error:              — TypeError:, ReferenceError:, Prisma…Error:
#   Cannot find module       — Node ESM (ERR_MODULE_NOT_FOUND)
#   Invalid `prisma.         — lỗi truy vấn Prisma
#   ^cần --file              — thiếu tham số bắt buộc
#
# Kiểm chứng trước khi dùng (đúng bài học "kiểm bộ kiểm trước khi kiểm
# nội dung"): 0 khớp trên 136 dòng output thật của seed chạy đúng, và bắt
# đủ 4 loại lỗi thật dựng lại được trên prod.
#
# Tín hiệu CHÍNH vẫn là MÃ THOÁT — các seeder đều `process.exit(1)` khi
# hỏng. Bộ dò văn bản chỉ là lưới thứ hai cho trường hợp script in lỗi mà
# vẫn thoát 0.
SEED_ERR_RE='(^|[[:space:]])(✗|✘)|^[[:space:]]*[A-Za-z]*Error:|Cannot find module|Invalid `prisma\.|^cần --file'

# Log seed nằm trong repo trên VPS thay vì /tmp: thông báo cũ trỏ tới
# /tmp/seed-*.log nhưng file đó thường KHÔNG tồn tại khi cần đọc (container
# bị dựng lại sau seed là mất, và /tmp trên máy deploy cũng có thể bị dọn).
# Nói sai đường dẫn còn tệ hơn không nói.
SEED_LOG_DIR="$REPO_DIR/.deploy-logs"
mkdir -p "$SEED_LOG_DIR"

# report_seed <nhãn> <tên-log> <output> [mã-thoát]
# Gom một chỗ phần "in kết quả + ghi log" mà 11 khối seed đang chép tay.
report_seed() {
  local label="$1" slug="$2" out="$3" rc="${4:-0}"
  local logfile="$SEED_LOG_DIR/$slug.log"
  printf '%s\n' "$out" > "$logfile"
  if [ "$rc" != "0" ] || printf '%s\n' "$out" | grep -qE "$SEED_ERR_RE"; then
    warn "$label reported errors (rc=$rc) — xem $logfile"
    # Ưu tiên in ĐÚNG dòng lỗi. Không có dòng nào khớp (chỉ rc khác 0) thì
    # mới in phần đuôi output để có ngữ cảnh.
    if printf '%s\n' "$out" | grep -qE "$SEED_ERR_RE"; then
      printf '%s\n' "$out" | grep -E "$SEED_ERR_RE" | head -5 | sed 's/^/ /'
    else
      printf '%s\n' "$out" | tail -4 | sed 's/^/ /'
    fi
    return 1
  fi
  ok "$label complete"
  printf '%s\n' "$out" | tail -4 | sed 's/^/ /'
  return 0
}

# ── Step 3.5: Idempotent seed (Content Creator demo data) ───────
# `prisma migrate deploy` does NOT auto-run the seed script.
# We invoke it explicitly here so the /creator/* pages always
# have demo data to render on a fresh production DB.
# The seed is fully idempotent (delete-then-recreate for the
# demo project, upsert-by-title for ideas) so this is safe to
# re-run on every deploy.
info "Running idempotent seed (Content Creator demo data)..."
SEED_OUT=$($DC exec -T backend sh -c \
 "npx prisma db seed" 2>&1) || true
report_seed "Seed" "seed" "$SEED_OUT" "${SEED_OUT_RC:-0}" || true

# ── Step 3.6: My Language content seed (EN roadmap + JA kana) ────
# Separate idempotent seed (find-before-create everywhere; upsert
# language by code) so /language always has real content on prod.
# Safe to re-run on every deploy — skips anything already present.
info "Running My Language content seed (English + Japanese)..."
LANG_SEED_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.my-language.ts" 2>&1) || true
report_seed "My Language seed" "seed-lang" "$LANG_SEED_OUT" "${LANG_SEED_OUT_RC:-0}" || true

# ── Step 3.7: Japanese extended kana seed (dakuten/yōon/special) ─
info "Running Japanese extended kana seed..."
KANA_SEED_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.ja-kana.ts" 2>&1) || true
report_seed "JA kana seed" "seed-ja-kana" "$KANA_SEED_OUT" "${KANA_SEED_OUT_RC:-0}" || true

# ── Step 3.8: English extra seed (alphabet/IPA + grammar A1→C1) ──
info "Running English extra seed (alphabet + grammar)..."
EN_EXTRA_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.en-extra.ts" 2>&1) || true
report_seed "EN extra seed" "seed-en-extra" "$EN_EXTRA_OUT" "${EN_EXTRA_OUT_RC:-0}" || true

# ── Step 3.9: Japanese extra seed (vocab/grammar/conv/reading/qna) ─
info "Running Japanese extra seed..."
JA_EXTRA_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.ja-extra.ts" 2>&1) || true
report_seed "JA extra seed" "seed-ja-extra" "$JA_EXTRA_OUT" "${JA_EXTRA_OUT_RC:-0}" || true

# ── Step 3.9b: JPD113 grammar seed (My Language, level='JPD113') ──
# content/grammar/jpd113-grammar.mjs → lang_grammar_points, idempotent
# (matches by languageId+level+title, update-in-place). Mirrors the
# JPD113 vocab/hanzi seeding already done for /language/ja/vocab & /hanzi.
info "Running JPD113 grammar seed..."
JPD113_GRAMMAR_OUT=$($DC exec -T backend sh -c \
 "node scripts/seed-jpd113-grammar.mjs --apply" 2>&1) || true
report_seed "JPD113 grammar seed" "seed-jpd113-grammar" "$JPD113_GRAMMAR_OUT" "${JPD113_GRAMMAR_OUT_RC:-0}" || true

# ── Step 3.10: Chinese seed (language + full HSK1-3 content) ─────
info "Running Chinese (zh) seed..."
ZH_SEED_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.zh.ts" 2>&1) || true
report_seed "ZH seed" "seed-zh" "$ZH_SEED_OUT" "${ZH_SEED_OUT_RC:-0}" || true

# ── Step 3.10b: My Language EN reading + listening (idempotent) ──
# content/my-language/en-reading.mjs + en-listening.mjs → lang_reading_articles
# + lang_listening_items (find-before-create theo languageId+title). Audio bài
# nghe đã dựng + upload R2 từ máy dev (scripts/en-listening-audio.mjs); bước này
# chỉ ghi row và KIỂM audio đã 200 trên CDN. Bổ sung 3 kỹ năng Đọc/Nghe/Viết cho
# người mất gốc — xem [[project_100_ngay_english_foundations]].
info "Running My Language EN reading + listening seed..."
ML_EN_OUT=$($DC exec -T backend sh -c '
  node scripts/my-language-en-seed.mjs --apply 2>&1
  echo "__SEED_RC__=$?"
') || true
ML_EN_RC="$(printf '%s\n' "$ML_EN_OUT" | sed -n 's/^__SEED_RC__=//p' | tail -1)"
ML_EN_OUT="$(printf '%s\n' "$ML_EN_OUT" | grep -v '^__SEED_RC__=')"
report_seed "My Language EN read/listen" "seed-ml-en" "$ML_EN_OUT" "${ML_EN_RC:-0}" || true

# ── Step 3.11: Interview Simulator starter bank (idempotent) ────
# Find-before-create questions + upsert taxonomy by slug; safe to re-run.
# All seeded rubrics are rubricReviewed=false (flagged for human review).
info "Running Interview Simulator seed (starter question bank)..."
INTERVIEW_SEED_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.interview.ts" 2>&1) || true
report_seed "Interview seed" "seed-interview" "$INTERVIEW_SEED_OUT" "${INTERVIEW_SEED_OUT_RC:-0}" || true

# ── Step 3.11b: Maker Lab — hardware project + BOM (idempotent) ─
# Project upserted by slug; BOM reconciled by name so re-running never
# duplicates a part and never resets the `acquired` checkbox ticked
# while shopping. Persona is create-only — a redeploy must not wipe
# the personality you tuned in the UI.
info "Running Maker Lab seed (mini-me-robot BOM)..."
MAKERLAB_SEED_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.maker-lab.ts" 2>&1) || true
report_seed "Maker Lab seed" "seed-maker-lab" "$MAKERLAB_SEED_OUT" "${MAKERLAB_SEED_OUT_RC:-0}" || true

# ── Step 3.12: Academy FPTU course content seed (idempotent) ────
# One .mjs spec per subject under content/academy/. The seeder is
# idempotent (semester by code, course by courseCode, section by
# title, lesson by slug — update-in-place, preserves lesson ids so
# per-user LessonProgress survives). Safe to re-run every deploy.
info "Running Academy FPTU course seed..."
ACADEMY_SEED_OUT=$($DC exec -T backend sh -c '
  rc=0
  for f in content/academy/*.mjs; do
    [ -e "$f" ] || { echo "no academy content files"; break; }
    echo "── $f"
    node scripts/academy-seed-course.mjs --file "$f" --apply 2>&1 || rc=1
  done
  echo "__SEED_RC__=$rc"
') || true
ACADEMY_SEED_OUT_RC="$(printf '%s\n' "$ACADEMY_SEED_OUT" | sed -n 's/^__SEED_RC__=//p' | tail -1)"
ACADEMY_SEED_OUT="$(printf '%s\n' "$ACADEMY_SEED_OUT" | grep -v '^__SEED_RC__=')"
report_seed "Academy seed" "seed-academy" "$ACADEMY_SEED_OUT" "${ACADEMY_SEED_OUT_RC:-0}" || true

# ── Step 3.12b: CuongThai general course content seed (idempotent) ──
# One .mjs spec per course under content/courses/ (our own curriculum,
# academyType=GENERAL — NOT the FPTU catalogue). Sub-files live in
# content/courses/<slug>/ and are imported by the top-level spec, so the
# glob deliberately matches only depth 1. Same idempotency guarantees as
# the Academy seeder above: lesson ids are preserved, progress survives.
info "Running CuongThai course seed..."
# Gom mã thoát của TỪNG file: vòng lặp `for` chỉ trả về mã của lệnh cuối,
# nên một file hỏng ở giữa mà file cuối chạy đúng thì cả khối vẫn báo 0.
COURSES_SEED_OUT=$($DC exec -T backend sh -c '
  rc=0
  for f in content/courses/*.mjs; do
    [ -e "$f" ] || { echo "no course content files"; break; }
    echo "── $f"
    node scripts/course-seed.mjs --file "$f" --apply 2>&1 || rc=1
  done
  echo "__SEED_RC__=$rc"
') || true
COURSES_SEED_OUT_RC="$(printf '%s\n' "$COURSES_SEED_OUT" | sed -n 's/^__SEED_RC__=//p' | tail -1)"
COURSES_SEED_OUT="$(printf '%s\n' "$COURSES_SEED_OUT" | grep -v '^__SEED_RC__=')"
report_seed "CuongThai course seed" "seed-courses" "$COURSES_SEED_OUT" "${COURSES_SEED_OUT_RC:-0}" || true

# ── Step 3.12c: curated YouTube video track per lesson (idempotent) ──
# One map file per course under content/course-videos/ → patches ONLY the
# video columns of lesson_details (the VN / EN / YT switcher on the learn
# page). Must run AFTER 3.12b: it matches lessons by slug, so the lessons
# have to exist first. Link rot is checked separately, by hand:
#   node scripts/verify-youtube-videos.mjs --all
info "Running course video-track seed..."
CVIDEO_SEED_OUT=$($DC exec -T backend sh -c '
  rc=0
  for f in content/course-videos/*.mjs; do
    [ -e "$f" ] || { echo "no course-video map files"; break; }
    echo "── $f"
    node scripts/course-video-seed.mjs --file "$f" --apply 2>&1 || rc=1
  done
  echo "__SEED_RC__=$rc"
') || true
CVIDEO_SEED_RC="$(printf '%s\n' "$CVIDEO_SEED_OUT" | sed -n 's/^__SEED_RC__=//p' | tail -1)"
CVIDEO_SEED_OUT="$(printf '%s\n' "$CVIDEO_SEED_OUT" | grep -v '^__SEED_RC__=')"
report_seed "Course video-track seed" "seed-course-videos" "$CVIDEO_SEED_OUT" "${CVIDEO_SEED_RC:-0}" || true

# ── Step 3.13: Exp Hub setup guides (per-subject, idempotent) ───
# One .mjs per subject under content/exphub/ → upsert SnippetCategory +
# Snippet (guide) by slug. Academy courses link "Cài đặt" cards to
# /exp-hub/<slug>. Safe to re-run every deploy.
info "Running Exp Hub guide seed..."
EXPHUB_SEED_OUT=$($DC exec -T backend sh -c '
  for f in content/exphub/*.mjs; do
    [ -e "$f" ] || { echo "no exphub content files"; break; }
    echo "-- $f"
    node scripts/exphub-seed-guide.mjs --file "$f" --apply 2>&1
  done
') || true
report_seed "Exp Hub seed" "seed-exphub" "$EXPHUB_SEED_OUT" "${EXPHUB_SEED_OUT_RC:-0}" || true

# ── Step 3.14: Exam Room content seed (idempotent) ─────────────
# One .mjs per subject under content/exams/ → upsert Exam + questions
# keyed by (course, kind, code). Real FE/PE papers. Safe to re-run.
info "Running Exam Room seed..."
EXAM_SEED_OUT=$($DC exec -T backend sh -c '
  for f in content/exams/*.mjs; do
    [ -e "$f" ] || { echo "no exam content files"; break; }
    echo "-- $f"
    node scripts/academy-seed-exam.mjs --file "$f" --apply 2>&1
  done
') || true
report_seed "Exam seed" "seed-exam" "$EXAM_SEED_OUT" "${EXAM_SEED_OUT_RC:-0}" || true

# ── Step 3.14b: Reapply exam chapter map (idempotent, KHÔNG AI) ─
# Step 3.14 ở trên XOÁ+TẠO LẠI toàn bộ ExamQuestion mỗi lần chạy (id đổi,
# ExamQuestion.sectionId mất) cho MỌI đề có content/exams/*.mjs — tức MỌI
# deploy. exam-classify-chapters.mjs (AI, chạy tay/hiếm) ghi vào bản đồ BỀN
# ExamChapterMap (khoá theo nội dung câu, không theo id) — bước này khôi
# phục sectionId từ bản đồ đó trong vài giây, không tốn AI, an toàn chạy
# lặp. Thiếu bước này thì "học phần liên quan" của CuongMini im lặng trống
# rỗng sau MỌI deploy dù đã tốn AI phân loại trước đó (đã dính thật
# 04/09/2026 — phải chạy tay để cứu, giờ tự động luôn ở đây).
info "Reapplying exam chapter map (khôi phục sectionId sau khi re-seed)..."
REAPPLY_SEED_OUT=$($DC exec -T backend sh -c '
  node scripts/exam-reapply-chapters.mjs --all --apply 2>&1
') || true
report_seed "Exam chapter reapply" "seed-exam-reapply" "$REAPPLY_SEED_OUT" "${REAPPLY_SEED_OUT_RC:-0}" || true

# ── Step 3.14c: Reapply exam question comments (idempotent, KHÔNG AI) ─
# CÙNG lý do với 3.14b, cho bình luận CuongMini: mỗi dòng exam_question_comments
# tự mang theo (examId, promptHash) lúc đăng (xem examComment.service.ts) —
# bước này nối lại questionId đúng câu MỚI sau khi Step 3.14 xoá+tạo lại,
# để bình luận "sống mãi mãi" thay vì CASCADE mất theo câu cũ.
info "Reapplying exam question comments (khôi phục sau khi re-seed)..."
REAPPLY_COMMENTS_OUT=$($DC exec -T backend sh -c '
  node scripts/exam-reapply-comments.mjs --apply 2>&1
') || true
report_seed "Exam comment reapply" "seed-exam-reapply-comments" "$REAPPLY_COMMENTS_OUT" "${REAPPLY_COMMENTS_OUT_RC:-0}" || true

# ── Step 3.14d: Merge duplicate CuongMini root comments (idempotent) ──
# examComment.service.ts::postAiAnswerComment() tự gộp câu trả lời trùng câu
# hỏi thành reply của 1 gốc lúc đăng, nhưng race hiếm (2 request gần như
# đồng thời) vẫn có thể lọt 2 bản gốc cho cùng 1 câu hỏi — chạy lưới đỡ này
# mỗi deploy để dọn nốt (xem chú thích trong script, KHÔNG đụng bản có reply
# riêng của người dùng).
info "Merging duplicate CuongMini root comments (gộp bình luận AI trùng câu hỏi)..."
MERGE_COMMENTS_OUT=$($DC exec -T backend sh -c '
  node scripts/exam-merge-dup-ai-comments.mjs --apply 2>&1
') || true
report_seed "Exam comment dedup" "seed-exam-merge-comments" "$MERGE_COMMENTS_OUT" "${MERGE_COMMENTS_OUT_RC:-0}" || true

# ── Step 3.15: Deep Dive guides (idempotent) ───────────────────
# One .mjs spec per guide under content/deepdives/ (prose in a sibling .md)
# → upsert TechTrendArticle keyed by slug, category 'DeepDive'. These are the
# long-form tutorials the home page's Deep Dives strip links to, so a card
# whose `article:` slug never got seeded is a dead link on the front page —
# which is exactly why this runs on every deploy rather than by hand.
# The seeder renders bodyHtml with the backend's OWN renderer from dist/,
# preserves viewCount and the original publishedAt, and exits non-zero if a
# referenced image is missing from frontend/public.
info "Running Deep Dive seed..."
DEEPDIVE_SEED_OUT=$($DC exec -T backend sh -c '
  rc=0
  for f in content/deepdives/*.mjs; do
    [ -e "$f" ] || { echo "no deepdive content files"; break; }
    echo "── $f"
    node scripts/deepdive-seed.mjs --file "$f" --apply 2>&1 || rc=1
  done
  echo "__SEED_RC__=$rc"
') || true
DEEPDIVE_SEED_OUT_RC="$(printf '%s\n' "$DEEPDIVE_SEED_OUT" | sed -n 's/^__SEED_RC__=//p' | tail -1)"
DEEPDIVE_SEED_OUT="$(printf '%s\n' "$DEEPDIVE_SEED_OUT" | grep -v '^__SEED_RC__=')"
report_seed "Deep Dive seed" "seed-deepdives" "$DEEPDIVE_SEED_OUT" "${DEEPDIVE_SEED_OUT_RC:-0}" || true

# ── Step 3.16: Project case-study seed (idempotent) ────────────
# One .mjs spec per case-study under content/projects/ (prose in a sibling
# .md) → upsert Project + its milestones/features/resources/listItems, keyed
# by slug. Same reason as Deep Dive above: the public /projects page links to
# these by slug, so a case-study edited in content/ but never re-seeded is a
# stale page in production even though the repo has the new prose.
# The seeder renders bodyHtml with the backend's OWN renderer from dist/,
# preserves viewCount/likeCount and any thumbnailUrl/images set via the admin
# UI, and exits non-zero if a referenced local image is missing.
info "Running Project case-study seed..."
PROJECT_SEED_OUT=$($DC exec -T backend sh -c '
  rc=0
  for f in content/projects/*.mjs; do
    [ -e "$f" ] || { echo "no project content files"; break; }
    echo "── $f"
    node scripts/project-seed.mjs --file "$f" --apply 2>&1 || rc=1
  done
  echo "__SEED_RC__=$rc"
') || true
PROJECT_SEED_OUT_RC="$(printf '%s\n' "$PROJECT_SEED_OUT" | sed -n 's/^__SEED_RC__=//p' | tail -1)"
PROJECT_SEED_OUT="$(printf '%s\n' "$PROJECT_SEED_OUT" | grep -v '^__SEED_RC__=')"
report_seed "Project seed" "seed-projects" "$PROJECT_SEED_OUT" "${PROJECT_SEED_OUT_RC:-0}" || true

# ── Step 3.16c: "100 Ngày Java" feed series (idempotent) ───────
# One .mjs per day under content/feed-series/100-ngay-java/ → upsert the
# SocialPost + its card image, keyed by the day hashtag (#100NgayJava-DayNNN).
#
# WHY THIS STEP HAS TO EXIST: deploy.sh ships CODE, not DATA. Seeding the
# series only on a laptop leaves production without the posts even though the
# repo has them — which is exactly what happened on 2026-08-08.
#
# --skip-card because the card renderer needs Playwright, which the backend
# image does not carry. Cards are rendered + uploaded to R2 from the dev
# machine; this step only writes the rows and VERIFIES the image already
# answers 200 on the CDN, failing loudly if it does not.
info "Running 100 Ngay Java feed-series seed..."
JAVA_SERIES_OUT=$($DC exec -T backend sh -c '
  rc=0
  for f in content/feed-series/100-ngay-java/*.mjs; do
    [ -e "$f" ] || { echo "no java series files"; break; }
    echo "── $f"
    node scripts/java-series-seed.mjs --file "$f" --apply --skip-card 2>&1 || rc=1
  done
  echo "__SEED_RC__=$rc"
') || true
JAVA_SERIES_OUT_RC="$(printf '%s\n' "$JAVA_SERIES_OUT" | sed -n 's/^__SEED_RC__=//p' | tail -1)"
JAVA_SERIES_OUT="$(printf '%s\n' "$JAVA_SERIES_OUT" | grep -v '^__SEED_RC__=')"
report_seed "Java series seed" "seed-java-series" "$JAVA_SERIES_OUT" "${JAVA_SERIES_OUT_RC:-0}" || true

# ── Step 3.16d: "100 Ngày Database" feed series (idempotent) ───────
# Song sinh Step 3.16c: một .mjs mỗi ngày dưới content/feed-series/100-ngay-database/
# → upsert SocialPost + ảnh thẻ, khoá theo hashtag ngày (#100NgayDatabase-DayNNN).
# --skip-card: ảnh thẻ được dựng + upload R2 từ máy dev (backend image không có
# Playwright); bước này chỉ ghi row và KIỂM ảnh đã trả 200 trên CDN.
# Xem java-series-seed / [[feedback_deploy_ships_code_not_data]].
info "Running 100 Ngay Database feed-series seed..."
DB_SERIES_OUT=$($DC exec -T backend sh -c '
  rc=0
  for f in content/feed-series/100-ngay-database/*.mjs; do
    [ -e "$f" ] || { echo "no database series files"; break; }
    echo "── $f"
    node scripts/database-series-seed.mjs --file "$f" --apply --skip-card 2>&1 || rc=1
  done
  echo "__SEED_RC__=$rc"
') || true
DB_SERIES_OUT_RC="$(printf '%s\n' "$DB_SERIES_OUT" | sed -n 's/^__SEED_RC__=//p' | tail -1)"
DB_SERIES_OUT="$(printf '%s\n' "$DB_SERIES_OUT" | grep -v '^__SEED_RC__=')"
report_seed "Database series seed" "seed-database-series" "$DB_SERIES_OUT" "${DB_SERIES_OUT_RC:-0}" || true

# ── Step 3.16e: "100 Ngày Tiếng Anh" feed series (idempotent) ───────
# Song sinh Step 3.16d: một .mjs mỗi ngày dưới content/feed-series/100-ngay-tieng-anh/
# → upsert SocialPost + ảnh thẻ, khoá theo hashtag ngày (#100NgayTiengAnh-DayNNN).
# --skip-card: ảnh thẻ dựng + upload R2 từ máy dev (backend image không có
# Playwright); bước này chỉ ghi row và KIỂM ảnh đã 200 trên CDN. English series
# KHÔNG có Code Lab → mỗi ngày trỏ luyện tập sang My Language (day.practice.links).
info "Running 100 Ngay Tieng Anh feed-series seed..."
EN_SERIES_OUT=$($DC exec -T backend sh -c '
  rc=0
  for f in content/feed-series/100-ngay-tieng-anh/*.mjs; do
    [ -e "$f" ] || { echo "no english series files"; break; }
    echo "── $f"
    node scripts/english-series-seed.mjs --file "$f" --apply --skip-card 2>&1 || rc=1
  done
  echo "__SEED_RC__=$rc"
') || true
EN_SERIES_RC="$(printf '%s\n' "$EN_SERIES_OUT" | sed -n 's/^__SEED_RC__=//p' | tail -1)"
EN_SERIES_OUT="$(printf '%s\n' "$EN_SERIES_OUT" | grep -v '^__SEED_RC__=')"
report_seed "English series seed" "seed-english-series" "$EN_SERIES_OUT" "${EN_SERIES_RC:-0}" || true

# ── Step 3.16b: retire two superseded case-studies (one-shot, idempotent) ──
# `cuongthaicom` duplicated `cuonghoang-dev-portal` (same site, 18KB stub vs
# the 105KB case-study), and `esp32aivoice` was an editor test row that still
# carried "test desc after save" as its public description. Both were removed
# on the owner's request (08/08/2026).
#
# Left in place rather than run once by hand because prod is only reachable
# from here: the first deploy deletes the rows, every later deploy prints
# "không có trong DB, bỏ qua" and exits 0. Safe to delete this block once the
# rows are confirmed gone on production.
info "Retiring superseded project case-studies..."
PROJECT_DEL_OUT=$($DC exec -T backend sh -c '
  node scripts/project-delete.mjs --slug cuongthaicom --slug esp32aivoice --apply 2>&1
  echo "__SEED_RC__=$?"
') || true
PROJECT_DEL_RC="$(printf '%s\n' "$PROJECT_DEL_OUT" | sed -n 's/^__SEED_RC__=//p' | tail -1)"
PROJECT_DEL_OUT="$(printf '%s\n' "$PROJECT_DEL_OUT" | grep -v '^__SEED_RC__=')"
report_seed "Project retire" "retire-projects" "$PROJECT_DEL_OUT" "${PROJECT_DEL_RC:-0}" || true

# ── Step 3.17: GitHub Repo Hub — kho repo tuyển chọn (idempotent) ──
# content/repos/curated.mjs (slug + tag + review do người viết) ghép với
# content/repos/meta.json (số sao / ngôn ngữ / mô tả do máy fetch) → upsert
# `github_repos` theo `url`.
# Ba thứ seeder KHÔNG đụng vào, để một lần deploy không xoá công sức chỉnh
# tay trong /admin/repos: review đã có nội dung khác file, metadata của repo
# đã tồn tại (nút "Sync all" mới là nguồn chân lý cho số sao), và tag admin
# tự gắn thêm. Xem đầu scripts/repos-seed.mjs.
#
# CỐ Ý KHÔNG truyền --refresh-meta ở đây. Seeder tự lấp các cột đang TRỐNG
# (fork / issue / ngày commit cuối — vừa thêm vào schema nên rỗng ở mọi dòng
# cũ), nhưng không ghi đè cột đã có số. Thêm cờ vào đây thì mỗi lần deploy,
# ảnh chụp trong file sẽ đè lên số sao mà "Sync all" vừa làm mới — càng
# deploy dữ liệu càng cũ đi. Muốn ép theo file thì chạy tay:
#   docker compose -p cuonghoangdev exec backend node scripts/repos-seed.mjs --apply --refresh-meta
info "Running GitHub Repo Hub seed..."
REPOS_SEED_OUT=$($DC exec -T backend sh -c '
  if [ ! -f content/repos/curated.mjs ]; then
    echo "no repo content files"
  else
    node scripts/repos-seed.mjs --apply 2>&1
  fi
  echo "__SEED_RC__=$?"
') || true
REPOS_SEED_OUT_RC="$(printf '%s\n' "$REPOS_SEED_OUT" | sed -n 's/^__SEED_RC__=//p' | tail -1)"
REPOS_SEED_OUT="$(printf '%s\n' "$REPOS_SEED_OUT" | grep -v '^__SEED_RC__=')"
report_seed "Repo Hub seed" "seed-repos" "$REPOS_SEED_OUT" "${REPOS_SEED_OUT_RC:-0}" || true

# ── Step 4: Health checks ─────────────────────────────────────────
info "Waiting for backend to be healthy..."
backend_ok=false
for i in $(seq 1 $MAX_HEALTH_RETRIES); do
    if docker exec cuonghoangdev_backend \
           sh -c "curl -sf ${HEALTH_URL} >/dev/null 2>&1"; then
        ok "Backend healthy (after $((i * HEALTH_INTERVAL))s)"
        backend_ok=true
        break
    fi
    echo -ne "\r    Waiting... $((i * HEALTH_INTERVAL))s / $((MAX_HEALTH_RETRIES * HEALTH_INTERVAL))s  "
    sleep "$HEALTH_INTERVAL"
done
echo ""

if [ "$backend_ok" = false ]; then
    fail "Backend did not become healthy within $((MAX_HEALTH_RETRIES * HEALTH_INTERVAL))s"
    $DC logs --tail=30 backend
    exit 1
fi

# ⚠️ 30/7/2026: chốt kiểm này TRƯỚC ĐÂY DÙNG `wget` — mà image frontend KHÔNG
#    cài wget (Dockerfile ghi rõ: healthcheck của compose dùng module http của
#    node nên cố tình bỏ `apt-get install wget`). Nghĩa là lệnh luôn thất bại,
#    vòng lặp quay đủ 6 lần rồi âm thầm đi tiếp: mỗi lần deploy mất không ~25
#    giây và KHÔNG hề kiểm được frontend sống hay chết. Đổi sang `node -e`.
info "Checking frontend..."
frontend_ok=false
for i in $(seq 1 6); do
    if docker exec cuonghoangdev_frontend node -e '
const http = require("http")
const req = http.get({ host: "127.0.0.1", port: 3000, path: "/" }, (res) => {
    process.exit(res.statusCode >= 200 && res.statusCode < 500 ? 0 : 1)
})
req.on("error", () => process.exit(1))
req.setTimeout(10000, () => { req.destroy(); process.exit(1) })
' >/dev/null 2>&1; then
        ok "Frontend healthy"
        frontend_ok=true
        break
    fi
    [ "$i" -lt 6 ] && sleep 5
done
# Phải là `if`, KHÔNG dùng `[ … ] && fail …`: script chạy `set -e`, mà một dây
# `&&` có vế trái sai thì trả về mã khác 0 ⇒ deploy tự chết ĐÚNG LÚC frontend
# khoẻ mạnh.
if [ "$frontend_ok" = false ]; then
    fail "Frontend không phản hồi sau 6 lần thử — xem 'docker logs cuonghoangdev_frontend'"
fi

# ── Step 4b: Route smoke-test — catch stale/partial builds ────────
# Incident 2026-07-02: the backend image shipped a stale dist/index.js
# that never mounted /api/v1/gifs, so the route 404'd in prod while the
# container still reported "healthy" (health check only hits one route).
# GIF picker died silently and only surfaced via user reports.
#
# Guard: assert core routes across every major module are actually
# MOUNTED. Hit them UNAUTHENTICATED over the internal port — a mounted
# route returns 401 ("needs auth") or 200 (public); a missing route
# (stale/partial build) returns 404. Any 404 here fails the deploy loudly
# instead of shipping a broken build.
#
# IMPORTANT: only list GET routes that return NON-404 on a bare, param-less,
# unauthenticated request (verified 2026-07-02). Do NOT add POST-only or
# param-required routes (e.g. /stickers, /auth/login) — they 404 on bare GET
# and would fail every deploy. When you add a new feature module, add one of
# its GET routes here so a future partial build can't drop it silently.
info "Smoke-testing core API routes are mounted..."
smoke_failed=false
for route in \
    gifs \
    voice-mini/voices \
    messages/threads \
    messages/unread-count \
    messages/ice-servers \
    profile \
    social/posts \
    feed/posts \
    social/notifications \
    friends \
    notes \
    notes-shares \
    ai/chat/folders \
    notes-databases \
    music/tracks \
    courses \
    hub/folders \
    snippets \
    video-categories \
    announcements \
    my-language \
    finance/wallets \
    interview/tracks \
    pro/status \
    cv/profile \
    tech-trends/articles \
    voice \
    games \
    landing/promos \
    landing/stats \
    code-lab/groups \
    roadmaps \
    exams \
    maker-lab/projects \
    maker-lab/meta \
    doc-tools/presets \
    repos \
    projects \
    about/stats \
    cv/public \
    users/me/preferences \
    profile/deletion-request \
    admin/deletion-requests \
    admin/content/academy-refs \
    admin/content/script-templates \
    social/series/100-ngay-java \
    social/series/100-ngay-database \
    social/series/100-ngay-tieng-anh \
    agent/tools \
    cyber/profile; do
    code=$(docker exec cuonghoangdev_backend \
        sh -c "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/api/v1/${route}" 2>/dev/null)
    if [ "$code" = "404" ]; then
        fail "Route /api/v1/${route} → 404 (NOT mounted — stale/partial build)"
        smoke_failed=true
    else
        ok "Route /api/v1/${route} mounted (HTTP ${code})"
    fi
done
if [ "$smoke_failed" = true ]; then
    fail "Smoke-test FAILED: a core route is missing → the running image is a stale build. Re-run a FULL 'bash deploy.sh' (never --no-build after code changes)."
    exit 1
fi

# ── Step 4c: Sân chơi 3D /playground — kiểm tài sản tĩnh ──────────
# Sân chơi KHÔNG phải route API mà là ~37MB file tĩnh trong
# `frontend/public/playground/`, Dockerfile copy nguyên thư mục `public/`
# vào image. Nghĩa là nó hỏng theo một kiểu mà vòng kiểm route ở trên
# không thấy: build được, container "healthy", API đủ route, nhưng
# `public/playground/` rỗng hoặc là bản dựng cũ → khách vào /playground
# gặp 404 hoặc một thế giới kẹt vĩnh viễn ở màn hình tải.
#
# Kiểm hai thứ, vì mỗi thứ bắt một kiểu hỏng khác nhau:
#   - index.html  → thư mục có được copy vào image không
#   - gói JS chính → bản dựng có khớp với index.html không. Tên file có
#     mã băm, nên index.html của bản dựng MỚI mà trỏ vào gói JS của bản
#     dựng CŨ thì file đó không tồn tại ⇒ 404 ⇒ trang trắng.
#
# ⚠️ Image frontend KHÔNG có `wget` lẫn `curl` (Dockerfile cố ý không cài — xem
#    chú thích trong đó). Mọi phép kiểm HTTP bên trong container này PHẢI dùng
#    `node -e` với module http có sẵn. Dùng wget/curl là lệnh luôn thất bại và
#    bộ kiểm sẽ báo hỏng trong khi thực tế không hỏng.
info "Kiểm sân chơi 3D /playground..."
pg_out=$(docker exec cuonghoangdev_frontend node -e '
const http = require("http")
// Bám theo chuyển hướng: Next.js đặt trailingSlash=false nên "/playground/"
// trả 308 về "/playground". Bộ kiểm mà coi 308 là hỏng thì deploy nào cũng
// false-fail — đã dẫm đúng bẫy này lúc viết.
const get = (path, hops = 0) => new Promise((resolve) => {
    const req = http.get({ host: "127.0.0.1", port: 3000, path }, (res) => {
        if(res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && hops < 3)
        {
            res.resume()
            const next = res.headers.location.replace(/^https?:\/\/[^/]+/, "")
            resolve(get(next, hops + 1))
            return
        }
        let body = ""
        res.on("data", (chunk) => { if(body.length < 200000) body += chunk })
        res.on("end", () => resolve({ status: res.statusCode, body }))
    })
    req.on("error", (err) => resolve({ status: 0, body: "", error: err.code }))
    req.setTimeout(15000, () => { req.destroy(); resolve({ status: 0, body: "", error: "TIMEOUT" }) })
})
;(async () => {
    const index = await get("/playground/")
    if(index.status !== 200)
    {
        console.log("FAIL index " + (index.error || index.status))
        process.exit(1)
    }
    const match = index.body.match(/assets\/index-[A-Za-z0-9_-]+\.js/)
    if(!match)
    {
        console.log("FAIL nobundle")
        process.exit(1)
    }
    const bundle = await get("/playground/" + match[0])
    if(bundle.status !== 200)
    {
        console.log("FAIL bundle " + match[0] + " " + (bundle.error || bundle.status))
        process.exit(1)
    }
    console.log("OK " + match[0])
})()
' 2>&1) && pg_ok=true || pg_ok=false

if [ "$pg_ok" = true ]; then
    ok "Sân chơi 3D phục vụ được, gói JS khớp bản dựng (${pg_out#OK })"
else
    fail "Sân chơi 3D hỏng: ${pg_out}"
    fail "  • FAIL index …  → thư mục public/playground không có trong image"
    fail "  • FAIL nobundle → index.html của sân chơi dựng hỏng"
    fail "  • FAIL bundle … → index.html trỏ vào gói JS không tồn tại (tên file"
    fail "                    có mã băm ⇒ đây là bản dựng cũ/dở dang)"
    fail "Sửa: cd playground-3d && npm run build, rsync dist/ sang"
    fail "     frontend/public/playground/, rồi chạy lại FULL 'bash deploy.sh'."
    exit 1
fi

# ── Step 5: Reload nginx ───────────────────────────────────────────
info "Reloading nginx config..."
# `nginx -t` TRƯỚC, và bắt lỗi thật.
#
# Dòng cũ là `nginx -s reload 2>/dev/null && ok || true`: config sai thì reload
# hỏng, `|| true` nuốt mất, deploy vẫn báo xanh — còn nginx im lặng chạy tiếp
# CONFIG CŨ. Nghĩa là mọi thay đổi nginx đều có thể "deploy thành công" mà
# không hề được áp dụng, và không ai biết cho tới khi đi tìm một triệu chứng
# hoàn toàn khác.
#
# `nginx -t` không đụng vào tiến trình đang chạy, nên phép kiểm này an toàn.
if $DC exec -T nginx nginx -t >/dev/null 2>&1; then
    $DC exec -T nginx nginx -s reload 2>/dev/null && ok "Nginx reloaded" || \
        warn "nginx -t xanh nhưng reload hỏng — kiểm 'docker logs cuonghoangdev_nginx'"
else
    fail "nginx.conf SAI cú pháp — KHÔNG reload. nginx vẫn chạy config cũ:"
    $DC exec -T nginx nginx -t 2>&1 | sed 's/^/      /'
    fail "Sửa nginx/nginx.conf rồi chạy lại deploy."
    exit 1
fi

# ── Step 6: Docker cleanup (free SSD space) ───────────────────────
# Every deploy builds a fresh repo-backend/repo-frontend image; the
# previous tag is left behind. `docker image prune -f` only removes
# *dangling* (untagged) images, so those accumulated until the disk
# hit 94% and a frontend image export failed with "no space left on
# device". Use `-af` to drop every image not referenced by a running
# container — the live containers' images are protected, so this is
# safe and reclaims the bulk of the space (~10GB observed).
#
# Build cache: `--keep-storage=8g` retains the most-recently-used 8GB of
# BuildKit cache. Bumped from 4GB after the 2026-07-14 disk upgrade (40->50GB):
# 4GB only held one image's layers so the OTHER image (usually frontend) still
# rebuilt cold every deploy. 8GB holds BOTH backend and frontend npm/apt layers
# warm for near-instant no-code redeploys, while ~12GB tipped disk back to 82%
# (images ~15.5GB + cache): 8GB is the balance that keeps warm builds AND disk
# headroom (~72%).
info "Pruning Docker build cache + unused images..."
# 8g → 4g (11/08/2026): stack cũ có hai image, giờ có BA — thêm
# `tts` (~2GB) cộng volume model (~300MB). Với mức giữ 8GB thì đĩa
# chạm 86% ngay sau lần build đầu tiên của image mới, mà con VPS này
# từng chết Postgres vì đầy đĩa. Giữ 4GB vẫn đủ ấm cho lớp npm/apt —
# thứ chiếm phần lớn thời gian build — chỉ lớp ngoài cùng phải làm lại.
docker builder prune -f --keep-storage=4g &>/dev/null && ok "Build cache pruned (kept ≤4GB hot layers)" || true
docker image prune -af &>/dev/null && ok "Unused images removed" || true
df -h / | awk 'NR==2 {print "[disk] / now " $5 " used, " $4 " free"}' || true

# ── Final report ──────────────────────────────────────────────────
echo ""
echo "============================================="
echo "  Deployment Summary  —  $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================="
$DC ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""
ok "Deploy complete!"
info "  Frontend:  https://cuongthai.com"
info "  Backend:   https://cuongthai.com/api/v1"
echo ""
