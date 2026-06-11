#!/bin/bash
# deploy-vps.sh — Backend + Frontend deploy (nginx config reload)
cd /opt/cuonghoangdev

echo "=== [1/6] Ensuring directories ==="
mkdir -p nginx/ssl certbot/conf/live/cuongthai.com certbot/www postgres redis uploads backups scripts

echo "=== [2/6] SSL symlinks ==="
[ -f certbot/conf/archive/cuongthai.com/fullchain2.pem ] && \
  ln -sf fullchain2.pem certbot/conf/archive/cuongthai.com/fullchain.pem 2>/dev/null || true
[ -f certbot/conf/archive/cuongthai.com/privkey2.pem ] && \
  ln -sf privkey2.pem certbot/conf/archive/cuongthai.com/privkey.pem 2>/dev/null || true

echo "=== [3/6] Building backend image ==="
docker compose -f docker-compose.yml build --pull --no-cache backend

echo "=== [3.5/6] Push Prisma schema to database ==="
# The schema push may fail if:
# 1. Already in sync (exit 0) — fine
# 2. "already in sync" message but exit 1 — not an error
# 3. pgvector extension missing — create it first
set +e
docker compose -f docker-compose.yml exec -T postgres psql -U postgres -d cuonghoangdev_db -c "CREATE EXTENSION IF NOT EXISTS vector;" > /tmp/pgvector.log 2>&1
PGVECTOR_EXIT=$?
if [ $PGVECTOR_EXIT -eq 0 ]; then
  echo "pgvector extension: OK"
else
  echo "pgvector setup output:"
  cat /tmp/pgvector.log
fi

docker compose -f docker-compose.yml exec -T backend sh -c "npx prisma db push --accept-data-loss --skip-generate" > /tmp/prisma_push.log 2>&1
PRISMA_EXIT=$?
set -e
if grep -q "already in sync\|The database is already in sync" /tmp/prisma_push.log 2>/dev/null; then
  echo "Database schema already in sync"
elif [ $PRISMA_EXIT -eq 0 ]; then
  echo "Database schema pushed successfully"
else
  echo "Prisma push output (non-fatal):"
  cat /tmp/prisma_push.log
  echo "[WARN] Prisma push returned $PRISMA_EXIT — continuing"
fi

echo "=== [4/6] Starting frontend (if not running) ==="
if ! docker ps --format '{{.Names}}' | grep -q '^cuonghoangdev_frontend$'; then
  docker compose -f docker-compose.yml up -d --no-recreate frontend || true
fi

echo "=== [5/6] Restarting backend ==="
# Use docker compose up --force-recreate to avoid race condition with rm
docker compose -f docker-compose.yml up -d --force-recreate backend

echo "=== [6/6] Health checks ==="
# Wait for backend
for i in $(seq 1 36); do
  if docker exec cuonghoangdev_backend curl -sf http://localhost:3001/health 2>/dev/null | grep -q 'ok'; then
    echo "[OK] backend"
    break
  fi
  if [ $i -eq 36 ]; then
    echo "[FAIL] backend health check failed after 180s"
    docker compose -f docker-compose.yml logs --tail=30 backend
    exit 1
  fi
  echo "Waiting for backend... ($i/36)"
  sleep 5
done

# Always restart nginx to ensure latest config is loaded
echo "Restarting nginx..."
docker compose -f docker-compose.yml stop nginx || true
sleep 2
docker compose -f docker-compose.yml up -d nginx

# Wait for nginx (best-effort)
for i in $(seq 1 12); do
  if docker exec cuonghoangdev_nginx wget -qO- http://localhost/ >/dev/null 2>&1; then
    echo "[OK] nginx"
    break
  fi
  if [ $i -eq 12 ]; then
    echo "[WARN] nginx health check timed out — may still be starting"
  else
    echo "Waiting for nginx... ($i/12)"
    sleep 5
  fi
done

echo ""
echo "=== Container Status ==="
docker compose -f docker-compose.yml ps

echo ""
echo "=== Backend Logs (last 20) ==="
docker compose -f docker-compose.yml logs --tail=20 backend

echo ""
echo "=== Deploy complete ==="
