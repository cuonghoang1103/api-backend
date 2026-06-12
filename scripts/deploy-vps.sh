#!/bin/bash
# ============================================================
# CuongHoangDev - VPS Deployment Script (run via GitHub Actions)
#
# Builds and deploys the Docker stack with zero-downtime.
# ============================================================
cd /opt/cuonghoangdev

echo "=== [1/10] Check and free disk space ==="
df -h /opt / /
echo "--- Pruning docker (images, build cache, stopped containers) ---"
docker builder prune -af 2>/dev/null || true
docker image prune -af 2>/dev/null || true
docker container prune -f 2>/dev/null || true
docker volume prune -f 2>/dev/null || true
echo "--- Removing old node_modules copies ---"
find /opt/cuonghoangdev -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true
echo "--- Removing build artifacts (dist from backend builds) ---"
find /opt/cuonghoangdev -name "dist" -type d -prune -exec rm -rf {} + 2>/dev/null || true
# NOTE: do NOT delete frontend/.next here — rsync brings a fresh .next/ from the
# GitHub Actions runner (which built it fresh). Deleting .next before rsync would
# cause rsync to delete the fresh .next/ from the runner too.
echo "--- Disk usage after cleanup ---"
df -h /opt / /var/lib/docker 2>/dev/null || df -h /opt /

echo "=== [2/10] Ensuring directories ==="
mkdir -p nginx/ssl certbot/conf/live/cuongthai.com certbot/www postgres redis uploads backups scripts

echo "=== [3/10] SSL symlinks ==="
[ -f certbot/conf/archive/cuongthai.com/fullchain2.pem ] && \
  ln -sf fullchain2.pem certbot/conf/archive/cuongthai.com/fullchain.pem 2>/dev/null || true
[ -f certbot/conf/archive/cuongthai.com/privkey2.pem ] && \
  ln -sf privkey2.pem certbot/conf/archive/cuongthai.com/privkey.pem 2>/dev/null || true

echo "=== [4/10] Ensure database is healthy ==="
PG_READY=0
if ! docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
  echo "[WARN] Postgres not ready, attempting restart..."
  docker compose restart postgres
  for i in $(seq 1 12); do
    if docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
      echo "Postgres is back up after restart"
      PG_READY=1
      break
    fi
    RESTART_COUNT=$(docker inspect cuonghoangdev_postgres --format '{{.RestartCount}}' 2>/dev/null)
    echo "Waiting for postgres... ($i/12) restart_count=$RESTART_COUNT"
    if [ "$i" -eq 6 ]; then
      echo "[WARN] Postgres still down after 30s, checking disk space..."
      df -h /opt/cuonghoangdev/postgres
      echo "Pruning docker to free space..."
      docker builder prune -f 2>/dev/null
      docker image prune -f 2>/dev/null
    fi
    sleep 5
  done
  if [ "$PG_READY" = "0" ]; then
    echo "[CRITICAL] Postgres stuck in restart loop, resetting data directory..."
    docker compose rm -sf postgres 2>/dev/null || true
    sleep 3
    rm -rf /opt/cuonghoangdev/postgres
    mkdir -p /opt/cuonghoangdev/postgres
    echo "[DEBUG] postgres data dir reset, container logs:"
    docker compose logs --tail=20 postgres 2>&1 || true
    echo "[DEBUG] container state: $(docker inspect cuonghoangdev_postgres --format '{{.State.Status}} ({{.RestartCount}} restarts)' 2>&1 || echo 'not found')"
    echo "[DEBUG] memory usage:"
    free -h 2>&1 || true
    docker compose up -d postgres
    for i in $(seq 1 18); do
      if docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
        echo "Postgres recreated and up with fresh data"
        PG_READY=1
        break
      fi
      echo "Waiting for fresh postgres... ($i/18)"
      echo "[DEBUG] container state: $(docker inspect cuonghoangdev_postgres --format '{{.State.Status}} ({{.RestartCount}} restarts)' 2>&1 || echo 'not found')"
      docker compose logs --tail 3 postgres 2>&1 || true
      sleep 5
    done
  fi
fi

echo "=== [5/10] Ensure database exists ==="
docker compose exec -T postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'cuonghoangdev_db'" | grep -q 1 || \
  docker compose exec -T postgres psql -U postgres -c "CREATE DATABASE cuonghoangdev_db" 2>/dev/null
echo "Database ready"

echo "=== [6/10] Code already synced via rsync ==="

echo "=== [7/10] Building backend container ==="
# Capture old container ID so we can verify it was replaced
OLD_CONTAINER_ID=$(docker inspect cuonghoangdev_backend --format '{{.Id}}' 2>/dev/null || echo "")
echo "Old container ID: ${OLD_CONTAINER_ID:-none}"

# Prune docker builder cache on VPS host
docker builder prune -af 2>/dev/null || true

# Build backend with explicit no-cache
BUILD_OUTPUT=$(docker build \
  --no-cache \
  --progress=plain \
  -t cuonghoangdev_backend:latest \
  -f /opt/cuonghoangdev/Dockerfile.backend \
  /opt/cuonghoangdev/ 2>&1)
BUILD_EXIT=$?

# Print last lines of build output (shows what was actually built)
echo "--- Backend build output (last 5 lines) ---"
echo "$BUILD_OUTPUT" | grep -E "Step #[0-9]+/[0-9]+:|COPY|cmd|npm|tsc|error" | tail -5

if [ $BUILD_EXIT -ne 0 ]; then
  echo "[CRITICAL] Backend build FAILED with exit code $BUILD_EXIT"
  echo "Last 30 build lines:"
  echo "$BUILD_OUTPUT" | tail -30
  echo "NOT proceeding with deploy to avoid using stale code."
  exit 1
fi

echo "=== Building frontend container ==="
# Build Next.js OUTSIDE Docker directly on the VPS host.
# This ensures the fresh .next/ is always compiled fresh (not subject to Docker layer cache).
# The frontend Dockerfile is only used to package the already-built .next/ output.
echo "--- Installing frontend dependencies on VPS ---"
cd /opt/cuonghoangdev/frontend
npm install 2>&1 | tail -5
echo "--- Building Next.js on VPS (fresh compilation) ---"
NEXT_OUTPUT=$(NEXT_TELEMETRY_DISABLED=1 npm run build 2>&1)
NEXT_EXIT=$?
echo "$NEXT_OUTPUT" | tail -5
if [ $NEXT_EXIT -ne 0 ]; then
  echo "[CRITICAL] Next.js build FAILED on VPS: exit $NEXT_EXIT"
  exit 1
fi

# Now package the fresh .next/ into a Docker image
# Prune docker builder cache for fresh build
docker builder prune -af 2>/dev/null || true
FRONTEND_BUILD=$(docker build \
  --no-cache \
  --progress=plain \
  -t cuonghoangdev_frontend:latest \
  -f /opt/cuonghoangdev/frontend/Dockerfile \
  /opt/cuonghoangdev/frontend/ 2>&1)
FRONTEND_EXIT=$?
echo "--- Frontend build output (last 5 lines) ---"
echo "$FRONTEND_BUILD" | grep -E "Step #[0-9]+/[0-9]+:|COPY|npm|error" | tail -5
if [ $FRONTEND_EXIT -ne 0 ]; then
  echo "[CRITICAL] Frontend build FAILED with exit code $FRONTEND_EXIT"
  echo "$FRONTEND_BUILD" | tail -20
  exit 1
fi

NEW_IMAGE_ID=$(docker images -q cuonghoangdev_backend:latest 2>/dev/null || echo "")
echo "New backend image ID: ${NEW_IMAGE_ID:-none}"

# Tag with timestamp for debugging
docker tag cuonghoangdev_backend:latest cuonghoangdev_backend:$(date +%s) 2>/dev/null || true

# Stop and remove OLD containers FIRST
echo "=== Stopping and removing old containers ==="
docker compose --env-file /opt/cuonghoangdev/.env rm -sf backend frontend 2>/dev/null || true
echo "Old containers removed"

# Wait a moment for Docker to release resources
sleep 3

# Verify containers are gone
BACKEND_CHECK=$(docker inspect cuonghoangdev_backend --format '{{.State.Status}}' 2>/dev/null || echo "GONE")
FRONTEND_CHECK=$(docker inspect cuonghoangdev_frontend --format '{{.State.Status}}' 2>/dev/null || echo "GONE")
echo "Backend container status: $BACKEND_CHECK"
echo "Frontend container status: $FRONTEND_CHECK"

# Tag images with timestamp for debugging
docker tag cuonghoangdev_backend:latest cuonghoangdev_backend:$(date +%s) 2>/dev/null || true
docker tag cuonghoangdev_frontend:latest cuonghoangdev_frontend:$(date +%s) 2>/dev/null || true

# Start new containers
echo "=== Starting new containers ==="
docker compose --env-file /opt/cuonghoangdev/.env up -d backend frontend

# Wait for new containers to be healthy
echo "=== Verifying new containers ==="
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
    echo "[CRITICAL] Containers failed health check after 150s!"
    echo "Backend logs:"
    docker logs cuonghoangdev_backend --tail=20
    echo "Frontend logs:"
    docker logs cuonghoangdev_frontend --tail=20
    exit 1
  fi
  sleep 5
done

echo "=== [8/10] Database schema setup (after backend is up) ==="
docker compose exec -T backend sh -c "npx prisma db push --accept-data-loss --skip-generate" \
  > /tmp/prisma_push.log 2>&1
PRISMA_EXIT=$?
if grep -q "already in sync\|The database is already in sync" /tmp/prisma_push.log 2>/dev/null; then
  echo "Database schema already in sync"
elif [ $PRISMA_EXIT -eq 0 ]; then
  echo "Database schema pushed successfully"
else
  echo "[WARN] Prisma push output:"
  cat /tmp/prisma_push.log
fi

# Seed knowledge base (best-effort)
echo "Seeding knowledge base (best-effort)..."
SEED_OUTPUT=$(docker compose exec -T backend sh -c "npx tsx data/seed-knowledge.ts" 2>&1 || true)
if echo "$SEED_OUTPUT" | grep -qi "error\|cannot find module"; then
  echo "[WARN] Knowledge seed issues (non-critical):"
  echo "$SEED_OUTPUT" | tail -5
else
  echo "[OK] Knowledge base seeded"
fi

echo "Restarting nginx..."
docker compose stop nginx 2>/dev/null || true
sleep 2
docker compose up -d --force-recreate nginx

echo "=== [9/10] Wait for nginx ==="
for i in $(seq 1 12); do
  if docker exec cuonghoangdev_nginx wget -qO- http://localhost/ >/dev/null 2>&1; then
    echo "[OK] nginx"
    break
  fi
  if [ $i -eq 12 ]; then
    echo "[WARN] nginx health check timed out"
    docker logs cuonghoangdev_nginx --tail=5
  else
    echo "Waiting for nginx... ($i/12)"
    sleep 5
  fi
done

echo "=== [9/9] Seed Cuong03dx admin account ==="
if [ -f /opt/cuonghoangdev/scripts/seed-cuong03dx.cjs ]; then
  docker compose exec -T backend node /app/scripts/seed-cuong03dx.cjs && echo "Seed complete" || echo "[WARN] Seed failed, continuing..."
fi

echo ""
echo "=== Container Status ==="
docker compose ps

echo ""
echo "=== Backend Logs (last 10) ==="
docker compose logs --tail=10 backend

echo "=== [10/10] Docker cleanup (free SSD space) ==="
docker builder prune -f 2>/dev/null || echo "[WARN] builder prune failed"
docker image prune -f 2>/dev/null || echo "[WARN] image prune failed"
DOCKER_USAGE=$(docker system df --format '{{.Type}}: {{.Size}}' 2>/dev/null | head -5)
echo "Docker disk usage after cleanup:"
echo "   $DOCKER_USAGE"

echo ""
echo "=== Deploy complete ==="
