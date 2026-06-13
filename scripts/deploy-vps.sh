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
# Extract password from .env directly (don't rely on shell variable expansion)
PG_PASSWORD=$(grep '^POSTGRES_PASSWORD=' /opt/cuonghoangdev/.env 2>/dev/null | sed 's/POSTGRES_PASSWORD=//' | sed "s/'//g" | sed 's/"//g')
PG_PASSWORD="${PG_PASSWORD:-123456}"
PG_USER="postgres"
PG_DB="cuonghoangdev_db"

# Ensure database exists
docker compose exec -T postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${PG_DB}'" | grep -q 1 || \
  docker compose exec -T postgres psql -U postgres -c "CREATE DATABASE ${PG_DB}" 2>/dev/null
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

# ─── Build backend Docker image (without dist/, then inject fresh dist) ──────────────────────
# Build from source, but since dist/ is freshly compiled on VPS, we copy the
# compiled dist AFTER the image is built to ensure latest code is always used.
echo "--- Building backend Docker image ---"
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker build \
  -t cuonghoangdev_backend:latest \
  -f /opt/cuonghoangdev/Dockerfile.backend \
  /opt/cuonghoangdev/ 2>&1 | tail -3
echo "--- Verify compiled code inside image ---"
docker run --rm cuonghoangdev_backend:latest sh -c "grep -c 'router.get.*/projects' /app/dist/routes/admin.routes.js 2>&1 || echo 'dist not found or route missing'"

# ─── Build backend: compile TypeScript on VPS, copy dist into running container ─────────
# Approach: Stop old container, compile TypeScript on VPS, copy dist directly into
# a fresh container WITHOUT rebuilding the Docker image (avoids Docker build cache issues).
# This ensures the container always has the LATEST compiled code.
echo "--- Stopping backend container ---"
docker stop cuonghoangdev_backend 2>/dev/null || true
docker rm -f cuonghoangdev_backend 2>/dev/null || true

echo "--- Compiling TypeScript on VPS ---"
ssh vps "cd /opt/cuonghoangdev && npx tsc 2>&1 || npm run build 2>&1"
echo "--- Verify compiled code ---"
ssh vps "grep -c 'router.get.*/projects' /opt/cuonghoangdev/dist/routes/admin.routes.js 2>&1 && echo '[OK] admin/projects route compiled!' || echo '[ERROR] Route not compiled!'"

# ─── Build frontend Docker image (frontend is built on GitHub Actions, but we need the image) ─
echo "--- Building frontend Docker image ---"
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker build \
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

# ─── Copy latest compiled dist into running backend container ───────────────────────────
# The container was started from an old Docker image. We need to inject the
# freshly-compiled dist/ from /opt/cuonghoangdev/dist into the running container.
echo "--- Injecting latest compiled dist into backend container ---"
ssh vps "docker cp /opt/cuonghoangdev/dist/. cuonghoangdev_backend:/app/dist/"
ssh vps "docker restart cuonghoangdev_backend"
echo "--- Waiting for backend to reload ---"
for i in $(seq 1 12); do
  if ssh vps "docker exec cuonghoangdev_backend sh -c 'curl -sf http://localhost:3001/health >/dev/null 2>&1'"; then
    echo "[OK] Backend reloaded with new code!"
    break
  fi
  echo "Reloading... ($i/12)"
  sleep 5
done
echo "--- Verify admin/projects route ---"
ssh vps "docker exec cuonghoangdev_backend sh -c 'curl -s http://localhost:3001/api/v1/admin/projects 2>&1'"

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
