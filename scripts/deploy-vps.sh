#!/bin/bash
# deploy-vps.sh — Clean backend + nginx config deploy
# Nginx config is mounted read-only, so we restart nginx when config changes
set -e

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

echo "=== [4/6] Restarting backend ==="
docker compose -f docker-compose.yml stop backend
docker compose -f docker-compose.yml rm -f backend
docker compose -f docker-compose.yml up -d backend

echo "=== [5/6] Reloading nginx ==="
# nginx.conf is mounted :ro from host, so rsync already updated the file on host
# We need to restart nginx container to pick up the new config
docker compose -f docker-compose.yml stop nginx
docker compose -f docker-compose.yml rm -f nginx
docker compose -f docker-compose.yml up -d nginx

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

# Wait for nginx
for i in $(seq 1 12); do
  if docker exec cuonghoangdev_nginx wget -qO- http://localhost/ >/dev/null 2>&1; then
    echo "[OK] nginx"
    break
  fi
  if [ $i -eq 12 ]; then
    echo "[WARN] nginx health check timed out"
  fi
  echo "Waiting for nginx... ($i/12)"
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
