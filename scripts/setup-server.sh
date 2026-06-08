#!/bin/bash
# ============================================================
# CuongHoangDev - VPS Setup Script
# Run this on a fresh VPS to prepare for deployment.
# ============================================================

set -e

echo "============================================"
echo " CuongHoangDev VPS Setup"
echo "============================================"

# ─── Color output ───────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ─── Check root ─────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
  warn "Not running as root. Some operations may fail."
fi

# ─── Create directories on host SSD ──────────────────
log "Creating data directories on SSD..."
mkdir -p /opt/cuonghoangdev/{postgres,redis,uploads,uploads/images,uploads/audio,uploads/video,uploads/documents}
chmod -R 755 /opt/cuonghoangdev

# ─── Create SSL directory ───────────────────────────
mkdir -p /opt/certbot/conf /opt/certbot/www
chmod -R 755 /opt/certbot

# ─── Check Docker ────────────────────────────────────
if ! command -v docker &> /dev/null; then
  error "Docker is not installed. Please install Docker first."
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
  error "Docker Compose is not installed."
fi

log "Docker version: $(docker --version)"
if docker compose version &> /dev/null; then
  log "Using 'docker compose' (plugin)"
  COMPOSE_CMD="docker compose"
else
  log "Using 'docker-compose' (standalone)"
  COMPOSE_CMD="docker-compose"
fi

# ─── Create .env file ────────────────────────────────
if [ ! -f .env ]; then
  warn ".env not found. Copy .env.example to .env and configure."
  cp .env.example .env
fi

# ─── Pull latest code ────────────────────────────────
log "Pulling latest code..."
if [ -d .git ]; then
  git pull origin main
else
  warn "Not a git repository. Skipping git pull."
fi

# ─── Build and start containers ─────────────────────
log "Building Docker images..."
$COMPOSE_CMD build

log "Starting services..."
$COMPOSE_CMD up -d postgres redis

# Wait for PostgreSQL to be ready
log "Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
  if docker exec cuonghoangdev_postgres pg_isready -U postgres &> /dev/null; then
    log "PostgreSQL is ready!"
    break
  fi
  echo -n "."
  sleep 2
done

# ─── Run Prisma migrations ───────────────────────────
log "Running Prisma migrations..."
$COMPOSE_CMD run --rm backend npx prisma migrate deploy

log "Generating Prisma Client..."
$COMPOSE_CMD run --rm backend npx prisma generate

# ─── Seed data ───────────────────────────────────────
log "Seeding database..."
$COMPOSE_CMD run --rm backend npm run db:seed || warn "Seed script not found or failed. Skipping."

# ─── Start all services ─────────────────────────────
log "Starting all services..."
$COMPOSE_CMD up -d

# ─── SSL Certificate (Let's Encrypt) ─────────────────
log "Requesting SSL certificate..."
docker run --rm \
  -v /opt/certbot/conf:/etc/letsencrypt \
  -v /opt/certbot/www:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d cuonghoangdev.com \
  -d www.cuonghoangdev.com \
  -d api.cuonghoangdev.com \
  --email cuonghoang1103@gmail.com \
  --agree-tos \
  --no-eff-email \
  --keep-until-expiring \
  || warn "SSL certificate request failed. Will retry later."

# ─── Setup SSL directory for Nginx ──────────────────
mkdir -p nginx/ssl
if [ -d /opt/certbot/conf/live/cuonghoangdev.com ]; then
  log "SSL certificates obtained successfully!"
else
  warn "SSL certificates not found. Set up HTTP first, then run SSL setup."
fi

# ─── Setup cron for SSL renewal ─────────────────────
log "Setting up SSL auto-renewal cron..."
(crontab -l 2>/dev/null | grep -v certbot; echo "0 3 * * * docker run --rm -v /opt/certbot/conf:/etc/letsencrypt -v /opt/certbot/www:/var/www/certbot -p 80:80 certbot/certbot renew --webroot -w /var/www/certbot --deploy-hook 'docker exec cuonghoangdev_nginx nginx -s reload' >> /var/log/certbot-renew.log 2>&1") | crontab -

# ─── Setup cron for database backup ─────────────────
log "Setting up daily database backup..."
mkdir -p /opt/cuonghoangdev/backups
(crontab -l 2>/dev/null | grep -v pg_dump; echo "0 2 * * * docker exec cuonghoangdev_postgres pg_dump -U postgres cuonghoangdev_db | gzip > /opt/cuonghoangdev/backups/\$(date +\%Y\%m\%d_\%H\%M\%S)_backup.sql.gz") | crontab -

# ─── Final status ───────────────────────────────────
log ""
log "============================================"
log " Setup complete!"
log "============================================"
log ""
log "Services:"
log "  - Frontend: http://localhost:3000"
log "  - Backend API: http://localhost:3001"
log "  - PostgreSQL: localhost:5432"
log "  - Redis: localhost:6379"
log "  - Nginx: http://localhost:80"
log ""
log "Data directories:"
log "  - /opt/cuonghoangdev/postgres"
log "  - /opt/cuonghoangdev/redis"
log "  - /opt/cuonghoangdev/uploads"
log "  - /opt/cuonghoangdev/backups"
log ""
log "Useful commands:"
log "  $COMPOSE_CMD ps         - View container status"
log "  $COMPOSE_CMD logs -f    - View logs"
log "  $COMPOSE_CMD restart    - Restart services"
log "  $COMPOSE_CMD down       - Stop services"
log ""
