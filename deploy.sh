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

    # Ensure VPS deploy dir exists
    ssh -i "$VPS_SSH_KEY" \
        -o StrictHostKeyChecking=accept-new \
        "${VPS_USER}@${VPS_IP}" \
        "mkdir -p ${VPS_DEPLOY_DIR}"

    # ── Step 1: rsync code ─────────────────────────────────────────
    info "Syncing code to VPS via rsync..."
    rsync -azP \
        --delete \
        --delete-excluded \
        --exclude='.git/' \
        --exclude='node_modules/' \
        --exclude='dist/' \
        --exclude='frontend/.next/' \
        --exclude='frontend/node_modules/' \
        --exclude='.env' \
        --exclude='.env.*' \
        --exclude='*.env' \
        --exclude='uploads/' \
        --exclude='/data/' \
        --exclude='*.log' \
        --exclude='.DS_Store' \
        --exclude='coverage/' \
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
for dir in "${DATA_DIR}/postgres" "${DATA_DIR}/redis" "${DATA_DIR}/uploads"; do
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
if echo "$SEED_OUT" | grep -qi "error"; then
 warn "Seed reported errors — see /tmp/seed.log"
 echo "$SEED_OUT" > /tmp/seed.log
else
 ok "Seed complete"
 echo "$SEED_OUT" | tail -5 | sed 's/^/ /'
fi

# ── Step 3.6: My Language content seed (EN roadmap + JA kana) ────
# Separate idempotent seed (find-before-create everywhere; upsert
# language by code) so /language always has real content on prod.
# Safe to re-run on every deploy — skips anything already present.
info "Running My Language content seed (English + Japanese)..."
LANG_SEED_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.my-language.ts" 2>&1) || true
if echo "$LANG_SEED_OUT" | grep -qiE "error|cannot find|exception"; then
 warn "My Language seed reported errors — see /tmp/seed-lang.log"
 echo "$LANG_SEED_OUT" > /tmp/seed-lang.log
else
 ok "My Language seed complete"
 echo "$LANG_SEED_OUT" | tail -11 | sed 's/^/ /'
fi

# ── Step 3.7: Japanese extended kana seed (dakuten/yōon/special) ─
info "Running Japanese extended kana seed..."
KANA_SEED_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.ja-kana.ts" 2>&1) || true
if echo "$KANA_SEED_OUT" | grep -qiE "error|cannot find|exception|not found"; then
 warn "JA kana seed reported errors — see /tmp/seed-ja-kana.log"
 echo "$KANA_SEED_OUT" > /tmp/seed-ja-kana.log
else
 ok "JA kana seed complete"
 echo "$KANA_SEED_OUT" | tail -4 | sed 's/^/ /'
fi

# ── Step 3.8: English extra seed (alphabet/IPA + grammar A1→C1) ──
info "Running English extra seed (alphabet + grammar)..."
EN_EXTRA_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.en-extra.ts" 2>&1) || true
if echo "$EN_EXTRA_OUT" | grep -qiE "error|cannot find|exception|not found"; then
 warn "EN extra seed reported errors — see /tmp/seed-en-extra.log"
 echo "$EN_EXTRA_OUT" > /tmp/seed-en-extra.log
else
 ok "EN extra seed complete"
 echo "$EN_EXTRA_OUT" | tail -4 | sed 's/^/ /'
fi

# ── Step 3.9: Japanese extra seed (vocab/grammar/conv/reading/qna) ─
info "Running Japanese extra seed..."
JA_EXTRA_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.ja-extra.ts" 2>&1) || true
if echo "$JA_EXTRA_OUT" | grep -qiE "error|cannot find|exception|not found"; then
 warn "JA extra seed reported errors — see /tmp/seed-ja-extra.log"
 echo "$JA_EXTRA_OUT" > /tmp/seed-ja-extra.log
else
 ok "JA extra seed complete"
 echo "$JA_EXTRA_OUT" | tail -9 | sed 's/^/ /'
fi

# ── Step 3.10: Chinese seed (language + full HSK1-3 content) ─────
info "Running Chinese (zh) seed..."
ZH_SEED_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.zh.ts" 2>&1) || true
if echo "$ZH_SEED_OUT" | grep -qiE "error|cannot find|exception"; then
 warn "ZH seed reported errors — see /tmp/seed-zh.log"
 echo "$ZH_SEED_OUT" > /tmp/seed-zh.log
else
 ok "ZH seed complete"
 echo "$ZH_SEED_OUT" | tail -12 | sed 's/^/ /'
fi

# ── Step 3.11: Interview Simulator starter bank (idempotent) ────
# Find-before-create questions + upsert taxonomy by slug; safe to re-run.
# All seeded rubrics are rubricReviewed=false (flagged for human review).
info "Running Interview Simulator seed (starter question bank)..."
INTERVIEW_SEED_OUT=$($DC exec -T backend sh -c \
 "npx tsx prisma/seed.interview.ts" 2>&1) || true
if echo "$INTERVIEW_SEED_OUT" | grep -qiE "error|cannot find|exception"; then
 warn "Interview seed reported errors — see /tmp/seed-interview.log"
 echo "$INTERVIEW_SEED_OUT" > /tmp/seed-interview.log
else
 ok "Interview seed complete"
 echo "$INTERVIEW_SEED_OUT" | tail -3 | sed 's/^/ /'
fi

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

info "Checking frontend..."
for i in $(seq 1 6); do
    if docker exec cuonghoangdev_frontend \
           sh -c "wget -qO- http://localhost:3000/ >/dev/null 2>&1"; then
        ok "Frontend healthy"
        break
    fi
    [ "$i" -lt 6 ] && sleep 5
done

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
    messages/threads \
    messages/unread-count \
    profile \
    social/posts \
    feed/posts \
    social/notifications \
    friends \
    notes \
    music/tracks \
    courses \
    hub/folders \
    snippets \
    video-categories \
    announcements \
    my-language \
    finance/wallets \
    interview/tracks \
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

# ── Step 5: Reload nginx ───────────────────────────────────────────
info "Reloading nginx config..."
$DC exec -T nginx nginx -s reload 2>/dev/null && ok "Nginx reloaded" || true

# ── Step 6: Docker cleanup (free SSD space) ───────────────────────
# Every deploy builds a fresh repo-backend/repo-frontend image; the
# previous tag is left behind. `docker image prune -f` only removes
# *dangling* (untagged) images, so those accumulated until the disk
# hit 94% and a frontend image export failed with "no space left on
# device". Use `-af` to drop every image not referenced by a running
# container — the live containers' images are protected, so this is
# safe and reclaims the bulk of the space (~10GB observed).
#
# Build cache: `--keep-storage=4g` retains the most-recently-used 4GB
# of BuildKit cache (the npm ci / apt layers) instead of wiping it all.
# A bare `prune -f` deletes EVERYTHING once the build finishes (all
# layers count as "unused" then), which made every deploy a full cold
# build — re-downloading sharp's prebuilt binaries from GitHub (flaky
# from this VPS: two timeouts on 2026-07-06) and re-running npm ci.
info "Pruning Docker build cache + unused images..."
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
