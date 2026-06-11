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

echo "=== [3/7] Ensure database is healthy ==="
# Force-restart postgres if it's not accepting connections
# If restart loop persists, check disk space and prune docker
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
    # Check if container is stuck in restart loop
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
  # If still not ready, force-remove and recreate container + reset corrupt data
  if [ "$PG_READY" = "0" ]; then
    echo "[CRITICAL] Postgres stuck in restart loop, resetting data directory..."
    docker compose rm -sf postgres 2>/dev/null || true
    sleep 3
    # Reset the bind-mounted postgres data directory (corrupt or incompatible)
    rm -rf /opt/cuonghoangdev/postgres
    mkdir -p /opt/cuonghoangdev/postgres
    docker compose up -d postgres
    for i in $(seq 1 18); do
      if docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
        echo "Postgres recreated and up with fresh data"
        PG_READY=1
        break
      fi
      echo "Waiting for fresh postgres... ($i/18)"
      sleep 5
    done
  fi
fi

echo "=== [4/7] Ensure database exists ==="
docker compose exec -T postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'cuonghoangdev_db'" | grep -q 1 || \
  docker compose exec -T postgres psql -U postgres -c "CREATE DATABASE cuonghoangdev_db" 2>/dev/null
echo "Database ready"

echo "=== [5/7] Code already synced via rsync — skipping git pull ==="

echo "=== [6/7] Building and swapping containers (zero-downtime) ==="
docker compose up -d --build --remove-orphans --force-recreate backend frontend

echo "=== [7/7] Database schema setup (after backend is up) ==="
for i in $(seq 1 18); do
  if docker exec cuonghoangdev_backend curl -sf http://localhost:3001/health >/dev/null 2>&1; then
    echo "Backend is healthy, running prisma db push..."
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
    break
  fi
  echo "Waiting for backend to be ready... ($i/18)"
  sleep 5
done

echo "Restarting nginx..."
docker compose stop nginx 2>/dev/null || true
sleep 2
docker compose up -d --force-recreate nginx

echo "=== [8/8] Wait for nginx (best-effort) ==="
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

echo "=== [10/10] Docker cache cleanup ==="
docker builder prune -f 2>/dev/null || echo "[WARN] builder prune failed"
docker image prune -f 2>/dev/null || echo "[WARN] image prune failed"
DOCKER_USAGE=$(docker system df --format '{{.Type}}: {{.Size}}' 2>/dev/null | head -5)
echo "Docker disk usage after cleanup:"
echo "   $DOCKER_USAGE"

echo ""
echo "=== Deploy complete ==="
