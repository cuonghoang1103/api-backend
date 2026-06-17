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
HEALTH_URL="http://localhost:3001/api/v1/system/health"
MAX_RETRIES=18
RETRIES_INTERVAL=10
COMPOSE_PROJECT="cuonghoangdev"
# Use -p flag to force the compose project name. The containers on
# this VPS carry the `com.docker.compose.project=cuonghoangdev` label,
# so we have to pass -p cuonghoangdev to make `docker compose ps`,
# `exec`, etc. find them. Without this, the script silently treats
# the cluster as empty and fails to talk to postgres / backend.
DC="docker compose -p ${COMPOSE_PROJECT}"

# ─── Helpers (must be defined before first use) ────────────
info()  { echo "[$(date '+%H:%M:%S')] [INFO]  $1"; }
ok()    { echo "[$(date '+%H:%M:%S')] [✅ OK]  $1"; }
warn()  { echo "[$(date '+%H:%M:%S')] [WARN]  $1"; }
fail()  { echo "[$(date '+%H:%M:%S')] [❌ FAIL] $1"; }

# ─── Source production env ─────────────────────────────────
# The compose file references ${DATABASE_URL}, ${JWT_SECRET}, etc. via
# `environment:` blocks, which take precedence over `env_file:` entries
# when the host shell variable is empty. Source the production env file
# so those variables are populated for this deploy.
if [ -f /opt/cuonghoangdev/.env ]; then
    # Some lines in /opt/cuonghoangdev/.env are malformed (e.g. a bare
    # API key with no `=` prefix). `source` aborts on those, so we wrap
    # it in a subshell that ignores non-zero exit codes and only exports
    # the variables that are well-formed `KEY=VALUE` pairs.
    set +e
    while IFS='=' read -r key value; do
        # Skip blanks, comments, and lines without `=`
        [ -z "$key" ] && continue
        case "$key" in '#'*) continue ;; esac
        # Only export well-formed names (letters/digits/underscore)
        if [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
            # Strip optional surrounding quotes from value
            eval "export ${key}=${value}"
        fi
    done < /opt/cuonghoangdev/.env
    set -e
    info "Loaded env from /opt/cuonghoangdev/.env"
else
    warn "Production env file /opt/cuonghoangdev/.env not found!"
fi

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
# Only check if a running postgres container exists from a prior deploy.
# On a fresh host (or after `down`), we'll let `up` start it.
if docker ps --format '{{.Names}}' | grep -q '^cuonghoangdev_postgres$'; then
    if ! $DC exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
        warn "Postgres not ready, restarting..."
        $DC restart postgres
        for i in $(seq 1 12); do
            if $DC exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
                ok "Postgres is back up"
                break
            fi
            echo "    Waiting for postgres... ($i/12)"
            sleep 5
        done
    fi

    # Ensure database exists
    PG_DB="cuonghoangdev_db"
    $DC exec -T postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${PG_DB}'" | grep -q 1 || \
        $DC exec -T postgres psql -U postgres -c "CREATE DATABASE ${PG_DB}" 2>/dev/null || true
    ok "Database ready"
else
    info "No running postgres container yet; will be started by \`up\`"
fi

# ─── Step 2: Atomic build & restart (zero-downtime) ───────
# Generate Prisma client first so the TypeScript compile inside
# the Docker builder stage sees the latest schema (added tables
# like message_threads, messages, etc. — see prisma/schema.prisma).
info "Regenerating Prisma client..."
$DC run --rm backend sh -c "npx prisma generate" 2>&1 | tail -3 || warn "prisma generate failed (continuing — build may still succeed if types were already generated)"

info "Building and deploying containers (zero-downtime)..."
$DC up -d --build --remove-orphans
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
    $DC logs --tail=20 backend
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
$DC restart nginx
sleep 5

# ─── Step 4: Database schema sync ─────────────────────────
info "Syncing database schema..."
PRISMA_OUTPUT=$($DC exec -T backend sh -c "npx prisma db push --accept-data-loss --skip-generate" 2>&1) || true
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
    SEED_OUT=$($DC exec -T backend node /app/scripts/seed-cuong03dx.cjs 2>&1) || true
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
$DC ps --format "table {{.Name}}\t{{.Status}}"
echo ""
ok "Deploy complete!"
info "Frontend: https://cuongthai.com"
info "Backend:  https://cuongthai.com/api/v1"

# ─── Ping search engines ──────────────────────────────────
# After a successful deploy, hint Google/Bing that the sitemap
# has been refreshed. The script is best-effort — the legacy
# endpoints are deprecated as of 2024, so it's an INFO line in
# the deploy log most of the time, but it doesn't hurt to try
# (and if either engine brings the legacy endpoint back, we
# pick it up for free).
if [ -f "$REPO_DIR/scripts/ping-search-engines.sh" ]; then
    info "Pinging search engines..."
    "$REPO_DIR/scripts/ping-search-engines.sh" || \
        warn "Search engine ping failed (non-critical)"
else
    info "ping-search-engines.sh not found, skipping"
fi
