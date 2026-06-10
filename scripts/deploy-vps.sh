#!/bin/bash
# deploy.sh — runs on VPS after code is synced via rsync
set -e

cd /opt/cuonghoangdev

# Args
DB_PASS="${1:-123456}"

mkdir -p nginx/ssl certbot/conf/live/cuongthai.com certbot/www postgres redis uploads backups scripts

# SSL symlinks
[ -f certbot/conf/archive/cuongthai.com/fullchain2.pem ] && ln -sf fullchain2.pem certbot/conf/archive/cuongthai.com/fullchain.pem 2>/dev/null || true
[ -f certbot/conf/archive/cuongthai.com/privkey2.pem ] && ln -sf privkey2.pem certbot/conf/archive/cuongthai.com/privkey.pem 2>/dev/null || true

# Stop all containers
docker stop cuonghoangdev_nginx cuonghoangdev_frontend cuonghoangdev_backend cuonghoangdev_postgres cuonghoangdev_redis 2>/dev/null || true
docker rm -f cuonghoangdev_nginx cuonghoangdev_frontend cuonghoangdev_backend cuonghoangdev_postgres cuonghoangdev_redis 2>/dev/null || true

# Regenerate .env from .env.example
rm -f .env
cp .env.example .env 2>/dev/null || true

# Fix DATABASE_URL: localhost:5433 -> postgres:5432 (Docker DNS)
sed -i 's|localhost:5433|postgres:5432|g' .env
sed -i '/^DATABASE_URL=/d' .env
printf 'DATABASE_URL=postgresql://postgres:%s@postgres:5432/cuonghoangdev_db?schema=public\n' "$DB_PASS" >> .env
echo "DB_PASS=${DB_PASS}"

# Run docker compose — stop old backend, force recreate with new image
# Keep postgres/redis/frontend/nginx running (don't restart them unnecessarily)
export POSTGRES_PASSWORD="$DB_PASS"
docker compose -f docker-compose.yml build --pull --no-cache backend
docker compose -f docker-compose.yml stop backend
docker compose -f docker-compose.yml rm -f backend
docker compose -f docker-compose.yml up -d backend

# Wait for backend
for i in $(seq 1 36); do
  if docker exec cuonghoangdev_backend curl -sf http://localhost:3001/health 2>/dev/null | grep -q 'ok'; then
    echo "[OK] backend"
    break
  fi
  echo "Waiting for backend... ($i/36)"
  sleep 5
done

# DEBUG: Check actual DATABASE_URL inside container
docker exec cuonghoangdev_backend sh -c 'echo "Container DATABASE_URL: ${DATABASE_URL}"' || true
docker exec cuonghoangdev_backend sh -c 'git -C /app rev-parse HEAD 2>/dev/null || echo "No git"' || true
docker exec cuonghoangdev_backend sh -c 'cat /app/package.json | grep version' || true

# Test database directly from backend container using psql
docker exec cuonghoangdev_backend node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
p.\$connect().then(() => { console.log('Direct Prisma connect: OK'); p.\$disconnect(); }).catch(e => console.error('Direct Prisma connect: FAIL', e.message));
" || true

# Wait for nginx
for i in $(seq 1 24); do
  if docker exec cuonghoangdev_nginx wget -qO- http://localhost/ >/dev/null 2>&1; then
    echo "[OK] nginx"
    break
  fi
  echo "Waiting for nginx... ($i/24)"
  sleep 5
done

echo "=== Container Status ==="
docker compose -f docker-compose.yml ps
echo "=== Backend Logs ==="
docker compose -f docker-compose.yml logs --tail=30 backend
