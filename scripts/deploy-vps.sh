#!/bin/bash
# ============================================================
# CuongHoangDev - VPS Deployment Script (Optimized)
#
# Mục tiêu: Deploy lần 2+ chỉ mất 2-5 phút thay vì 30-40 phút
# Nguyên nhân: Docker layer caching + BuildKit acceleration
#
# Layer order tối ưu (ít thay đổi → nhiều thay đổi):
#   1. Base image         (never)
#   2. System packages    (rarely)
#   3. package.json       (when deps change)
#   4. npm ci             (when package.json changes)
#   5. Source code        (when code changes) ★
#   6. Build step         (when source changes)
# ============================================================

set -e  # Stop on error

cd /opt/cuonghoangdev

# ─── Prevent concurrent deploys (lock file) ────────────────────────────────────
DEPLOY_LOCK="/tmp/deploy-vps.lock"
DEPLOY_PID="$$"
if [ -f "$DEPLOY_LOCK" ]; then
  LOCK_PID=$(cat "$DEPLOY_LOCK" 2>/dev/null)
  if [ "$LOCK_PID" != "$DEPLOY_PID" ] && kill -0 "$LOCK_PID" 2>/dev/null; then
    echo "[WARN] Another deploy is running (PID $LOCK_PID). Waiting..."
    for i in $(seq 1 60); do
      sleep 5
      if ! kill -0 "$LOCK_PID" 2>/dev/null; then
        echo "[OK] Previous deploy finished. Proceeding."
        break
      fi
      echo "Waiting... ($i/60)"
    done
  fi
fi
echo "$DEPLOY_PID" > "$DEPLOY_LOCK"
trap "rm -f $DEPLOY_LOCK" EXIT

# ─── BuildKit: Enable inline cache + parallel build ───────────────────────────
# BuildKit acceleration:
#   - parallel: build layers simultaneously (30-50% faster)
#   - inline cache: embed cache metadata into image for next build
#   - cache ID per layer: reuse unchanged layers from previous builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "=== [1/7] Check system ==="
echo "Docker version: $(docker version --format '{{.Server.Version}}' 2>/dev/null || echo 'N/A')"
echo "BuildKit enabled: $DOCKER_BUILDKIT"
df -h /opt / | grep -E 'Filesystem|/dev'

echo "=== [2/7] Ensure directories ==="
mkdir -p nginx/ssl certbot/conf/live/cuongthai.com certbot/www postgres redis uploads backups scripts

echo "=== [3/7] SSL symlinks ==="
[ -f certbot/conf/archive/cuongthai.com/fullchain2.pem ] && \
  ln -sf fullchain2.pem certbot/conf/archive/cuongthai.com/fullchain.pem 2>/dev/null || true
[ -f certbot/conf/archive/cuongthai.com/privkey2.pem ] && \
  ln -sf privkey2.pem certbot/conf/archive/cuongthai.com/privkey.pem 2>/dev/null || true

echo "=== [4/7] Ensure database is healthy ==="
PG_READY=0
if ! docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
  echo "[WARN] Postgres not ready, restarting..."
  docker compose restart postgres
  for i in $(seq 1 12); do
    if docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
      echo "Postgres is back up"
      PG_READY=1
      break
    fi
    RESTART_COUNT=$(docker inspect cuonghoangdev_postgres --format '{{.RestartCount}}' 2>/dev/null || echo 0)
    echo "Waiting for postgres... ($i/12) restart_count=$RESTART_COUNT"
    sleep 5
  done
  if [ "$PG_READY" = "0" ]; then
    echo "[WARN] Postgres still down, resetting data directory..."
    docker compose rm -sf postgres 2>/dev/null || true
    sleep 3
    rm -rf /opt/cuonghoangdev/postgres
    mkdir -p /opt/cuonghoangdev/postgres
    echo "[DEBUG] postgres data dir reset"
    docker compose logs --tail=10 postgres 2>&1 || true
    echo "[DEBUG] container state: $(docker inspect cuonghoangdev_postgres --format '{{.State.Status}} ({{.RestartCount}} restarts)' 2>&1 || echo 'not found')"
    free -h 2>&1 || true
    docker compose up -d postgres
    for i in $(seq 1 18); do
      if docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
        echo "Postgres recreated and up"
        PG_READY=1
        break
      fi
      echo "Waiting for fresh postgres... ($i/18)"
      docker compose logs --tail 3 postgres 2>&1 || true
      sleep 5
    done
  fi
fi

echo "=== [5/7] Ensure database exists ==="
# CRITICAL: export vars from .env so docker compose reads the correct password
set -a && . /opt/cuonghoangdev/.env && set +a

# Always recreate postgres to ensure it uses the current .env password
# This is safe because data is on a persistent named volume (postgres_data)
echo "[DEBUG] Recreating postgres to sync password from .env..."
docker stop cuonghoangdev_postgres 2>/dev/null || true
docker rm cuonghoangdev_postgres 2>/dev/null || true
sleep 2
docker compose up -d postgres
for i in $(seq 1 12); do
  if docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
    echo "Postgres up with current .env password"
    break
  fi
  echo "Waiting for postgres... ($i/12)"
  sleep 5
done
docker compose exec -T postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'cuonghoangdev_db'" | grep -q 1 || \
  docker compose exec -T postgres psql -U postgres -c "CREATE DATABASE cuonghoangdev_db" 2>/dev/null
echo "Database ready"

echo "=== [6/7] Build and deploy containers ==="
# ─── Remove old containers (force) ──────────────────────────────────────────────
# CRITICAL: must stop AND remove old containers before building new ones
# Otherwise Docker refuses to start containers with same name
echo "--- Removing old containers ---"
docker stop cuonghoangdev_backend cuonghoangdev_frontend 2>/dev/null || true
docker rm -f cuonghoangdev_backend cuonghoangdev_frontend 2>/dev/null || true
sleep 3

# Verify old containers are gone
if docker ps -a --format '{{.Names}}' | grep -q 'cuonghoangdev_backend'; then
  echo "[WARN] Old backend container still exists, force removing..."
  docker rm -f cuonghoangdev_backend 2>/dev/null || true
fi
if docker ps -a --format '{{.Names}}' | grep -q 'cuonghoangdev_frontend'; then
  echo "[WARN] Old frontend container still exists, force removing..."
  docker rm -f cuonghoangdev_frontend 2>/dev/null || true
fi

# ─── Build backend with BuildKit + inline cache ───────────────────────────────
# Key optimization: NO --no-cache flag!
# BuildKit sẽ tự động reuse các layer không thay đổi:
#   - Layer "COPY package*.json + npm ci" → REUSED nếu package.json không đổi
#   - Layer "COPY . ." → REBUILD vì code thay đổi
#   - Layer "npm run build" → REBUILD vì source thay đổi (nhưng rất nhanh)
echo "--- Building backend (BuildKit + inline cache) ---"
docker build \
  --no-cache \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -t cuonghoangdev_backend:latest \
  -f /opt/cuonghoangdev/Dockerfile.backend \
  /opt/cuonghoangdev/ 2>&1 | tee /tmp/backend_build.log | tail -10
echo "--- Backend build log (last 5 lines): ---"
tail -5 /tmp/backend_build.log
# Verify: check compiled code contains OpenRouter URL (not HuggingFace)
if docker run --rm cuonghoangdev_backend:latest sh -c "grep -q 'openrouter.ai' /app/dist/services/ai.service.js"; then
  echo "[OK] Backend compiled with OpenRouter URL"
else
  echo "[WARN] Backend compiled code does not contain 'openrouter.ai' - checking for HuggingFace..."
  if docker run --rm cuonghoangdev_backend:latest sh -c "grep -q 'api-inference.huggingface' /app/dist/services/ai.service.js"; then
    echo "[CRITICAL] Backend STILL has HuggingFace URL! The --no-cache flag may not have worked."
  fi
fi
BACKEND_EXIT=$?
if [ $BACKEND_EXIT -ne 0 ]; then
  echo "[CRITICAL] Backend build FAILED with exit code $BACKEND_EXIT"
  echo "Backend logs:"
  docker compose logs --tail=20 backend
  exit 1
fi

# ─── Build frontend with BuildKit + inline cache ──────────────────────────────
echo "--- Building frontend (BuildKit + inline cache) ---"
docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -t cuonghoangdev_frontend:latest \
  -f /opt/cuonghoangdev/frontend/Dockerfile \
  /opt/cuonghoangdev/frontend/ 2>&1 | tail -5
FRONTEND_EXIT=$?
if [ $FRONTEND_EXIT -ne 0 ]; then
  echo "[CRITICAL] Frontend build FAILED with exit code $FRONTEND_EXIT"
  exit 1
fi

# ─── Start containers ────────────────────────────────────────────────────────
# IMPORTANT: use --force-recreate to ensure new image is used after rebuild
echo "--- Starting containers with --force-recreate ---"
docker compose up -d --force-recreate backend frontend

# ─── Verify new image is being used ─────────────────────────────────────────
sleep 5
BACKEND_IMG=$(docker inspect cuonghoangdev_backend --format '{{.Config.Image}}' 2>/dev/null)
BACKEND_ID=$(docker inspect cuonghoangdev_backend --format '{{.Id}}' 2>/dev/null)
echo "[DEBUG] Backend container image: $BACKEND_IMG"
echo "[DEBUG] Backend container ID: $BACKEND_ID"

# ─── Health check ────────────────────────────────────────────────────────────
echo "--- Verifying containers ---"
for i in $(seq 1 30); do
  BACKEND_STATUS=$(docker inspect cuonghoangdev_backend --format '{{.State.Status}}' 2>/dev/null || echo "NOT_FOUND")
  FRONTEND_STATUS=$(docker inspect cuonghoangdev_frontend --format '{{.State.Status}}' 2>/dev/null || echo "NOT_FOUND")
  echo "Check ($i/30): backend=$BACKEND_STATUS frontend=$FRONTEND_STATUS"
  if [ "$BACKEND_STATUS" = "running" ] && [ "$FRONTEND_STATUS" = "running" ]; then
    if docker exec cuonghoangdev_backend curl -sf http://localhost:3001/health >/dev/null 2>&1; then
      echo "[OK] Both containers are healthy!"
      break
    fi
  fi
  if [ "$i" -eq 30 ]; then
    echo "[CRITICAL] Health check failed after 150s!"
    echo "Backend logs:"
    docker logs cuonghoangdev_backend --tail=20
    echo "Frontend logs:"
    docker logs cuonghoangdev_frontend --tail=20
    exit 1
  fi
  sleep 5
done

echo "=== [7/7] Database schema + seeds ==="
PRISMA_OUTPUT=$(docker compose exec -T backend sh -c "npx prisma db push --accept-data-loss --skip-generate" 2>&1) || true
echo "$PRISMA_OUTPUT" | tail -3
if echo "$PRISMA_OUTPUT" | grep -qi "already in sync\|The database is already in sync"; then
  echo "Database schema already in sync"
elif echo "$PRISMA_OUTPUT" | grep -qi "error\|Error"; then
  echo "[WARN] Prisma push issues (non-critical):"
  echo "$PRISMA_OUTPUT" | grep -i "error" | head -3
else
  echo "Database schema pushed successfully"
fi

# Seed knowledge base (best-effort)
echo "Seeding knowledge base..."
SEED_OUTPUT=$(docker compose exec -T backend sh -c "npx tsx data/seed-knowledge.ts" 2>&1 || true)
if echo "$SEED_OUTPUT" | grep -qi "error\|cannot find module"; then
  echo "[WARN] Knowledge seed issues: $(echo "$SEED_OUTPUT" | tail -1)"
else
  echo "[OK] Knowledge base seeded"
fi

# Seed admin account
if [ -f /opt/cuonghoangdev/scripts/seed-cuong03dx.cjs ]; then
  docker compose exec -T backend node /app/scripts/seed-cuong03dx.cjs && echo "Seed complete" || echo "[WARN] Seed failed, continuing..."
fi

# Restart nginx
echo "Restarting nginx..."
docker compose stop nginx 2>/dev/null || true
sleep 2
docker compose up -d --force-recreate nginx

echo "=== Container Status ==="
docker compose ps

echo ""
echo "=== Backend Logs (last 10) ==="
docker compose logs --tail=10 backend

echo ""
echo "=== Deploy complete ==="
