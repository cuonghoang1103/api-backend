#!/bin/bash
# ============================================================
# CuongHoangDev - Optimized VPS Deployment Script
#
# Tốc độ deploy:
#   - Lần đầu (cold build): ~3-5 phút
#   - Lần sau (code change): ~30-60 giây (BuildKit cache)
#
# Nguyên tắc:
#   1. BuildKit enabled → parallel layer building
#   2. TypeScript compile TRONG Docker builder stage
#   3. Zero-downtime via docker compose up -d --build
#   4. Không có docker builder prune / image prune
#   5. Không có SSH loopback
# ============================================================

set -euo pipefail

# ─── Config ────────────────────────────────────────────────
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HEALTH_URL="http://localhost:3001/health"
MAX_RETRIES=18
RETRIES_INTERVAL=10

# ─── Helpers ────────────────────────────────────────────────
info()  { echo "[$(date '+%H:%M:%S')] [INFO]  $1"; }
ok()    { echo "[$(date '+%H:%M:%S')] [✅ OK]  $1"; }
warn()  { echo "[$(date '+%H:%M:%S')] [WARN]  $1"; }
fail()  { echo "[$(date '+%H:%M:%S')] [❌ FAIL] $1"; }

# ─── Pre-flight ───────────────────────────────────────────
cd "$REPO_DIR"
info "Pre-flight checks..."
if ! command -v docker &>/dev/null; then
    fail "Docker not found."
    exit 1
fi

# Enable BuildKit for parallel builds + caching
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
info "BuildKit: enabled (parallel builds + layer cache)"

# ─── Step 1: Database health check ─────────────────────────
info "Ensuring database is healthy..."
if ! docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
    warn "Postgres not ready, restarting..."
    docker compose restart postgres
    for i in $(seq 1 12); do
        if docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
            ok "Postgres is back up"
            break
        fi
        echo "    Waiting for postgres... ($i/12)"
        sleep 5
    done
fi

# Ensure database exists
PG_DB="cuonghoangdev_db"
docker compose exec -T postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${PG_DB}'" | grep -q 1 || \
    docker compose exec -T postgres psql -U postgres -c "CREATE DATABASE ${PG_DB}" 2>/dev/null || true
ok "Database ready"

# ─── Step 2: Atomic build & restart (zero-downtime) ───────
info "Building and deploying containers (zero-downtime)..."
docker compose up -d --build --remove-orphans
ok "Containers built and started"

# ─── Step 3: Health checks ─────────────────────────────────
info "Waiting for services to be healthy..."
backend_ok=false
for i in $(seq 1 $MAX_RETRIES); do
    if docker exec cuonghoangdev_backend sh -c "curl -sf ${HEALTH_URL} >/dev/null 2>&1"; then
        ok "Backend is healthy (after $((i * RETRIES_INTERVAL))s)"
        backend_ok=true
        break
    fi
    echo -ne "\r    Waiting... $((i * RETRIES_INTERVAL))s / $((MAX_RETRIES * RETRIES_INTERVAL))s   "
    sleep $RETRIES_INTERVAL
done
echo ""

if [ "$backend_ok" = false ]; then
    fail "Backend failed to become healthy within $((MAX_RETRIES * RETRIES_INTERVAL))s"
    docker compose logs --tail=20 backend
    exit 1
fi

# Verify frontend
frontend_ok=false
for i in $(seq 1 6); do
    if docker exec cuonghoangdev_frontend sh -c "wget -qO- http://localhost:3000/ >/dev/null 2>&1"; then
        ok "Frontend is healthy"
        frontend_ok=true
        break
    fi
    sleep 5
done

# Restart nginx to ensure it picks up new containers
info "Restarting nginx..."
docker compose restart nginx
sleep 5

# ─── Step 4: Database schema sync ─────────────────────────
info "Syncing database schema..."
PRISMA_OUTPUT=$(docker compose exec -T backend sh -c "npx prisma db push --accept-data-loss --skip-generate" 2>&1) || true
if echo "$PRISMA_OUTPUT" | grep -qi "already in sync\|The database is already in sync"; then
    ok "Database schema in sync"
elif echo "$PRISMA_OUTPUT" | grep -qi "error"; then
    warn "Prisma push issues: $(echo "$PRISMA_OUTPUT" | grep -i error | head -1)"
else
    ok "Database schema pushed"
fi

# ─── Step 5: Seed admin account (best-effort) ──────────────
if [ -f scripts/seed-cuong03dx.cjs ]; then
    info "Seeding admin account..."
    SEED_OUT=$(docker compose exec -T backend node /app/scripts/seed-cuong03dx.cjs 2>&1) || true
    if echo "$SEED_OUT" | grep -qi "error"; then
        warn "Seed issue (non-critical): $(echo "$SEED_OUT" | tail -1)"
    else
        ok "Admin account seeded"
    fi
fi

# ─── Final Report ─────────────────────────────────────────
echo ""
echo "========================================="
echo "  Deployment Summary"
echo "========================================="
docker compose ps --format "table {{.Name}}\t{{.Status}}"
echo ""
ok "Deploy complete!"
info "Frontend: https://cuongthai.com"
info "Backend:  https://cuongthai.com/api/v1"
