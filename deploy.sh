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
# Project name must match the label on existing containers.
# Compose derives this from the working directory when no -p flag is
# used. Since the code lives at /home/deployer/repo/, the project is
# "repo" — not "cuonghoangdev". Using a mismatched -p causes Compose
# to try to create duplicate containers (conflict on container_name).
COMPOSE_PROJECT="repo"
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

# ── Step 2: Atomic build & restart (zero-downtime) ────────────────
# `up -d --build` builds the new image, then atomically swaps the
# running container — no downtime window unlike `down && up`.
# `--force-recreate` ensures containers with the same name but a
# stale image get torn down before the new one is created
# (otherwise Compose refuses to bind a duplicate container_name).
# `--remove-orphans` cleans up containers for removed services.
info "Building images and restarting containers (zero-downtime)..."
$DC up -d --build --force-recreate --remove-orphans
ok "Containers built and swapped"

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
# Build cache is pruned with `-f` (NOT `-af`) on purpose: keeping the
# active BuildKit cache is what makes subsequent deploys ~30-60s
# instead of a 3-5min cold build.
info "Pruning Docker build cache + unused images..."
docker builder prune -f &>/dev/null && ok "Build cache pruned" || true
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
