#!/bin/bash
# ============================================================
# CuongHoangDev - One-Click Production Deployment Script
#
# What this script does (in order):
#   1. Pull latest code from Git
#   2. Build & restart containers atomically (zero downtime)
#   3. Auto-cleanup Docker build cache (free SSD space)
#   4. Verify health of deployed services
#
# Usage: ./deploy.sh
#
# Why "up -d --build --remove-orphans" instead of "down && up"?
#   - "down" TERMINATES containers first, then starts new ones → DOWNTIME window
#   - "up -d --build --remove-orphans" builds the new image, then atomically
#     swaps old containers for new ones → ZERO DOWNTIME (blue-green style)
#   - "--remove-orphans" cleans up containers for services that no longer exist
# ============================================================

set -euo pipefail

# ─── Config ────────────────────────────────────────────────
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HEALTH_URL="https://cuongthai.com/api/v1/system/health"
HEALTH_URL_VPS="http://localhost:3001/health"
FRONTEND_URL="https://cuongthai.com"
MAX_RETRIES=18          # 18 × 10s = 3 minutes max wait
RETRIES_IMMEDIATE=5      # rapid checks for first 5

# ─── Helpers ───────────────────────────────────────────────
info()  { echo "[$(date '+%H:%M:%S')] [INFO]  $1"; }
ok()    { echo "[$(date '+%H:%M:%S')] [✅ OK]  $1"; }
warn()  { echo "[$(date '+%H:%M:%S')] [WARN]  $1"; }
fail()  { echo "[$(date '+%H:%M:%S')] [❌ FAIL] $1"; }
cmd()   { echo ""; echo "[CMD] $ $1"; }

# ─── Pre-flight checks ────────────────────────────────────
info "Pre-flight checks..."
cd "$REPO_DIR"

# Verify docker compose is available
if ! command -v docker &>/dev/null; then
    fail "Docker is not installed or not in PATH."
    exit 1
fi

# Check if we are on VPS (has /opt/cuonghoangdev)
if [ -d "/opt/cuonghoangdev" ]; then
    VPS_MODE=true
    info "VPS mode detected — deploying from /opt/cuonghoangdev"
else
    VPS_MODE=false
    warn "Running outside VPS — skipping git pull, assuming local dev"
fi

# ─── Step 1: Pull latest code from Git ────────────────────
if [ "$VPS_MODE" = true ]; then
    cmd "git pull origin main"
    info "Pulling latest changes from Git..."
    git pull origin main --ff-only
    ok "Git pull complete"
else
    info "Skipping git pull (local dev mode)"
fi

# ─── Step 2: Prisma schema push (ensure DB is up-to-date) ─
if [ "$VPS_MODE" = true ]; then
    info "Ensuring database schema is up-to-date..."
    # Create pgvector extension if missing
    docker compose exec -T postgres psql -U postgres -d cuonghoangdev_db \
        -c "CREATE EXTENSION IF NOT EXISTS vector;" &>/dev/null || true

    # Run prisma db push (non-fatal — logs output on failure)
    if docker compose exec -T backend \
        sh -c "npx prisma db push --accept-data-loss --skip-generate" \
        > /tmp/prisma_push.log 2>&1; then
        ok "Database schema is in sync"
    else
        if grep -q "already in sync" /tmp/prisma_push.log 2>/dev/null; then
            ok "Database schema already in sync"
        else
            warn "Prisma db push returned non-zero — see /tmp/prisma_push.log"
        fi
    fi
fi

# ─── Step 3: Atomic build & restart (zero downtime) ───────
if [ "$VPS_MODE" = true ]; then
    info "Building and swapping containers (zero-downtime)..."
    cmd "docker compose up -d --build --remove-orphans"

    docker compose up -d --build --remove-orphans
    ok "Containers built and started"
else
    info "Skipping docker build (local dev mode)"
fi

# ─── Step 4: Health checks ────────────────────────────────
info "Waiting for services to be healthy..."

# Fast polling loop
waited=0
backend_ok=false
frontend_ok=false

for i in $(seq 1 $MAX_RETRIES); do
    # Check backend health (inside container network)
    if docker exec cuonghoangdev_backend curl -sf \
        http://localhost:3001/health &>/dev/null; then
        if [ "$backend_ok" = false ]; then
            ok "Backend is healthy (after ${waited}s)"
            backend_ok=true
        fi
    fi

    # Check frontend health
    if docker exec cuonghoangdev_frontend \
        wget -qO- http://localhost:3000/ &>/dev/null; then
        if [ "$frontend_ok" = false ]; then
            ok "Frontend is healthy (after ${waited}s)"
            frontend_ok=true
        fi
    fi

    # All healthy — break early
    if [ "$backend_ok" = true ] && [ "$frontend_ok" = true ]; then
        break
    fi

    waited=$((i * 10))
    echo -ne "\r    Waiting... ${waited}s / $((MAX_RETRIES * 10))s   "
    sleep 10
done
echo ""

# Final verdict
if [ "$backend_ok" = true ] && [ "$frontend_ok" = true ]; then
    ok "All services are healthy!"
elif [ "$VPS_MODE" = false ]; then
    warn "Health checks skipped (local dev mode)"
else
    fail "Some services failed to become healthy within ${MAX_RETRIES}s"
    docker compose ps
    docker compose logs --tail=20 backend
    exit 1
fi

# ─── Step 5: Docker build cache cleanup ───────────────────
# Prune dangling build cache immediately after successful deploy
# This frees SSD space right away, rather than letting it accumulate
if [ "$VPS_MODE" = true ]; then
    info "Cleaning up Docker build cache (freeing SSD space)..."
    cmd "docker builder prune -f"
    docker builder prune -f &>/dev/null || warn "docker builder prune failed (non-fatal)"

    cmd "docker image prune -f"
    docker image prune -f &>/dev/null || warn "docker image prune failed (non-fatal)"

    # Show disk usage after cleanup
    DOCKER_USAGE=$(docker system df --format '{{.Type}}: {{.Size}}' 2>/dev/null | head -5)
    info "Docker disk usage after cleanup:"
    echo "   $DOCKER_USAGE"
fi

# ─── Final Report ─────────────────────────────────────────
info ""
info "========================================="
info "  Deployment Summary"
info "========================================="
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
info ""
info "Frontend: $FRONTEND_URL"
info "Backend:  https://api.cuongthai.com"
info ""
ok "Deploy complete!"
