#!/bin/bash
# deploy-vps.sh — Backend + Frontend deploy (nginx config reload)
set -e

cd /opt/cuonghoangdev

echo "=== [1/7] Ensuring directories ==="
mkdir -p nginx/ssl certbot/conf/live/cuongthai.com certbot/www postgres redis uploads backups scripts

echo "=== [2/7] SSL symlinks ==="
[ -f certbot/conf/archive/cuongthai.com/fullchain2.pem ] && \
  ln -sf fullchain2.pem certbot/conf/archive/cuongthai.com/fullchain.pem 2>/dev/null || true
[ -f certbot/conf/archive/cuongthai.com/privkey2.pem ] && \
  ln -sf privkey2.pem certbot/conf/archive/cuongthai.com/privkey.pem 2>/dev/null || true

echo "=== [3/7] Building backend image ==="
docker compose -f docker-compose.yml build --pull --no-cache backend

echo "=== [4/7] Starting frontend (if not running) ==="
if ! docker ps --format '{{.Names}}' | grep -q '^cuonghoangdev_frontend$'; then
  docker compose -f docker-compose.yml up -d --no-recreate frontend || true
fi

echo "=== [5/7] Restarting backend ==="
docker compose -f docker-compose.yml stop backend
docker compose -f docker-compose.yml rm -f backend
docker compose -f docker-compose.yml up -d backend

echo "=== [6/7] Reloading nginx ==="
docker compose -f docker-compose.yml stop nginx
docker compose -f docker-compose.yml rm -f nginx
docker compose -f docker-compose.yml up -d nginx

echo "=== [7/7] Health checks ==="
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

# Wait for nginx
for i in $(seq 1 24); do
  if docker exec cuonghoangdev_nginx wget -qO- http://localhost/ >/dev/null 2>&1; then
    echo "[OK] nginx"
    break
  fi
  if [ $i -eq 24 ]; then
    echo "[FAIL] nginx health check failed after 120s"
    docker logs cuonghoangdev_nginx --tail=20
    exit 1
  fi
  echo "Waiting for nginx... ($i/24)"
  sleep 5
done

echo ""
echo "=== Container Status ==="
docker compose -f docker-compose.yml ps

echo ""
echo "=== Backend Logs (last 20) ==="
docker compose -f docker-compose.yml logs --tail=20 backend

echo ""
echo "=== Deploy complete ==="
