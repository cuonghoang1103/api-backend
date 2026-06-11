#!/bin/bash
# ============================================================
# CuongHoangDev - VPS Deployment Script (run via GitHub Actions)
#
# Why "up -d --build --remove-orphans" instead of "down && up"?
#   - "down" TERMINATES containers first, then starts new ones → DOWNTIME window
#   - "up -d --build --remove-orphans" builds the new image, then atomically
#     swaps old containers for new ones → ZERO DOWNTIME (blue-green style)
#   - "--remove-orphans" cleans up containers for services that no longer exist
#
# After containers are up, Docker build cache is pruned to free SSD space.
# ============================================================
cd /opt/cuonghoangdev

echo "=== [1/7] Ensuring directories ==="
mkdir -p nginx/ssl certbot/conf/live/cuongthai.com certbot/www postgres redis uploads backups scripts

echo "=== [2/7] SSL symlinks ==="
[ -f certbot/conf/archive/cuongthai.com/fullchain2.pem ] && \
  ln -sf fullchain2.pem certbot/conf/archive/cuongthai.com/fullchain.pem 2>/dev/null || true
[ -f certbot/conf/archive/cuongthai.com/privkey2.pem ] && \
  ln -sf privkey2.pem certbot/conf/archive/cuongthai.com/privkey.pem 2>/dev/null || true

echo "=== [3/7] Pull latest Git changes ==="
git -C /opt/cuonghoangdev pull origin main --ff-only

echo "=== [4/7] Database schema setup ==="
# Run prisma db push (non-fatal)
docker compose exec -T backend sh -c "npx prisma db push --accept-data-loss --skip-generate" \
  > /tmp/prisma_push.log 2>&1
if grep -q "already in sync\|The database is already in sync" /tmp/prisma_push.log 2>/dev/null; then
  echo "Database schema already in sync"
elif [ $? -eq 0 ]; then
  echo "Database schema pushed successfully"
else
  echo "[WARN] Prisma push output:"
  cat /tmp/prisma_push.log
fi

echo "=== [5/7] Building and swapping containers (zero-downtime) ==="
# up --force-recreate = stop old, remove, start new atomically
# Much faster than stop + rm + up, avoids race condition
docker compose up -d --build --remove-orphans --force-recreate backend

# Restart frontend if needed (no-recreate unless image changed)
if ! docker ps --format '{{.Names}}' | grep -q '^cuonghoangdev_frontend$'; then
  docker compose up -d frontend
fi

echo "=== [6/7] Health checks ==="
# Wait for backend
for i in $(seq 1 36); do
  if docker exec cuonghoangdev_backend curl -sf http://localhost:3001/health 2>/dev/null | grep -q 'ok'; then
    echo "[OK] backend"
    break
  fi
  if [ $i -eq 36 ]; then
    echo "[FAIL] backend health check failed after 180s"
    docker compose logs --tail=30 backend
    exit 1
  fi
  echo "Waiting for backend... ($i/36)"
  sleep 5
done

# Restart nginx (to pick up latest config)
echo "Restarting nginx..."
docker compose stop nginx 2>/dev/null || true
sleep 2
docker compose up -d nginx

# Wait for nginx (best-effort)
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

echo ""
echo "=== Container Status ==="
docker compose ps

echo ""
echo "=== Backend Logs (last 10) ==="
docker compose logs --tail=10 backend

echo "=== [7/7] Docker cache cleanup (free SSD space) ==="
docker builder prune -f 2>/dev/null || echo "[WARN] builder prune failed"
docker image prune -f 2>/dev/null || echo "[WARN] image prune failed"
DOCKER_USAGE=$(docker system df --format '{{.Type}}: {{.Size}}' 2>/dev/null | head -5)
echo "Docker disk usage after cleanup:"
echo "   $DOCKER_USAGE"

echo ""
echo "=== Deploy complete ==="
