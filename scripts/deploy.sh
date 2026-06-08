# ============================================================
# Deploy Script — CuongHoangDev VPS Production
# ============================================================
# Chạy trên VPS Ubuntu sau khi đã pull code từ GitHub
#
# Usage:
#   chmod +x scripts/deploy.sh
#   ./scripts/deploy.sh
#
# Yêu cầu trước khi chạy:
#   1. Docker & Docker Compose đã cài đặt
#   2. /mnt/data/* directories đã tạo và có quyền ghi
#   3. File .env.production đã đặt cùng thư mục với docker-compose.prod.yml
#   4. Pull code từ GitHub về (git pull)
# ============================================================

set -e  # Exit immediately if a command fails
set -u  # Treat unset variables as an error
set -o pipefail  # Pipeline fails if any command fails

# ─── Color output ────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
log_success() { echo -e "${GREEN}[OK]${NC}   $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*"; }

# ─── Banner ──────────────────────────────────────────────────
echo ""
echo "========================================"
echo "  CuongHoangDev VPS Deploy Script"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"
echo ""

# ─── Variables ───────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
DB_CONTAINER="cuonghoangdev_postgres"
REDIS_CONTAINER="cuonghoangdev_redis"
API_CONTAINER="cuonghoangdev_api"

# ─── Step 0: Verify prerequisites ─────────────────────────────
log_info "Step 0: Verifying prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker not found. Please install Docker first."
    exit 1
fi
log_success "Docker found: $(docker --version)"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    log_error "docker-compose not found. Please install Docker Compose."
    exit 1
fi
log_success "Docker Compose found: $(docker-compose --version)"

# Check environment file
if [ ! -f "$PROJECT_ROOT/$ENV_FILE" ]; then
    log_warn "Environment file not found: $ENV_FILE"
    log_warn "Creating $ENV_FILE from template..."
    if [ -f "$PROJECT_ROOT/.env.example" ]; then
        cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/$ENV_FILE"
        log_warn "Please edit $ENV_FILE and fill in all secrets before running deploy."
        exit 1
    else
        log_error ".env.example not found. Cannot create $ENV_FILE."
        exit 1
    fi
fi
log_success "Environment file found: $ENV_FILE"

# Check data directories
log_info "Creating data directories on host..."
for dir in /mnt/data/postgres /mnt/data/redis /mnt/data/uploads; do
    if [ ! -d "$dir" ]; then
        sudo mkdir -p "$dir"
        sudo chown -R 1001:1001 "$dir" 2>/dev/null || true
        log_success "Created: $dir"
    else
        log_success "Exists: $dir"
    fi
done

echo ""

# ─── Step 1: Pull latest code ────────────────────────────────
log_info "Step 1: Pulling latest code from GitHub..."

cd "$PROJECT_ROOT"

if [ -d ".git" ]; then
    # Fetch latest tags and branches
    git fetch --all --tags

    # Get current branch name
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
    log_info "Current branch: $CURRENT_BRANCH"

    # Stash any local changes
    if ! git diff --quiet || ! git diff --cached --quiet; then
        log_warn "Local changes detected. Stashing..."
        git stash push -m "Auto-stash before deploy $(date '+%Y-%m-%d %H:%M:%S')"
    fi

    # Pull latest
    log_info "Pulling from origin/$CURRENT_BRANCH..."
    git pull origin "$CURRENT_BRANCH"

    log_success "Code updated to: $(git log -1 --oneline)"
else
    log_error "Not a git repository. Please clone the repository first."
    exit 1
fi

echo ""

# ─── Step 2: Stop existing containers ────────────────────────
log_info "Step 2: Stopping existing containers..."

cd "$PROJECT_ROOT"

# Stop and remove old containers (but keep volumes — data is precious!)
docker-compose -f "$COMPOSE_FILE" down --remove-orphans 2>/dev/null || true

log_success "Old containers stopped."
echo ""

# ─── Step 3: Build and start containers ───────────────────────
log_info "Step 3: Building and starting containers..."

# Build without cache (--no-cache) to ensure fresh build
# Or use cache for faster rebuilds (remove --no-cache if preferred)
docker-compose -f "$COMPOSE_FILE" build --no-cache

# Start all services in detached mode
docker-compose -f "$COMPOSE_FILE" up -d

log_success "Containers started."
echo ""

# ─── Step 4: Wait for Postgres to be ready ───────────────────
log_info "Step 4: Waiting for Postgres to be ready..."

MAX_WAIT=60
COUNTER=0

while [ $COUNTER -lt $MAX_WAIT ]; do
    if docker exec "$DB_CONTAINER" pg_isready -U postgres -d cuonghoangdev_db &>/dev/null; then
        log_success "Postgres is ready!"
        break
    fi
    COUNTER=$((COUNTER + 5))
    log_info "Waiting for Postgres... ($COUNTER/$MAX_WAIT seconds)"
    sleep 5
done

if [ $COUNTER -ge $MAX_WAIT ]; then
    log_error "Postgres did not become ready in ${MAX_WAIT}s."
    log_error "Check logs: docker-compose -f $COMPOSE_FILE logs postgres-db"
    exit 1
fi

echo ""

# ─── Step 5: Enable pgvector extension ───────────────────────
log_info "Step 5: Enabling pgvector extension..."

docker exec -i "$DB_CONTAINER" psql -U postgres -d cuonghoangdev_db -c \
    "CREATE EXTENSION IF NOT EXISTS vector;" 2>/dev/null && \
    log_success "pgvector extension enabled." || \
    log_warn "pgvector extension may already exist or failed (non-critical)."

# Verify pgvector
docker exec -i "$DB_CONTAINER" psql -U postgres -d cuonghoangdev_db -c \
    "SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';" 2>/dev/null | tee /tmp/pgvector_check.txt

if grep -q "vector" /tmp/pgvector_check.txt 2>/dev/null; then
    log_success "pgvector verified: $(grep vector /tmp/pgvector_check.txt)"
else
    log_warn "Could not verify pgvector. Check manually."
fi

echo ""

# ─── Step 6: Run Prisma migrations ────────────────────────────
log_info "Step 6: Running Prisma migrations..."

# Wait a bit more to ensure API container is fully up
sleep 5

# Try to run migrations inside the API container
if docker exec "$API_CONTAINER" npx prisma migrate deploy &>/dev/null; then
    log_success "Prisma migrations applied."
else
    log_warn "Migration failed or already applied. Checking status..."
    docker exec "$API_CONTAINER" npx prisma migrate status 2>/dev/null || true
fi

# Generate Prisma Client (always safe to run)
docker exec "$API_CONTAINER" npx prisma generate &>/dev/null && \
    log_success "Prisma Client generated." || \
    log_warn "Prisma generate had warnings (non-critical)."

echo ""

# ─── Step 7: Health check ────────────────────────────────────
log_info "Step 7: Running health checks..."

MAX_HEALTH_WAIT=30
HEALTH_COUNTER=0

while [ $HEALTH_COUNTER -lt $MAX_HEALTH_WAIT ]; do
    HTTP_STATUS=$(docker exec "$API_CONTAINER" wget --no-verbose --tries=1 --spider http://localhost:3001/health/live 2>/dev/null && echo "200" || echo "000")

    if [ "$HTTP_STATUS" = "200" ]; then
        log_success "API is healthy!"
        break
    fi

    HEALTH_COUNTER=$((HEALTH_COUNTER + 3))
    log_info "Waiting for API... ($HEALTH_COUNTER/$MAX_HEALTH_WAIT seconds)"
    sleep 3
done

if [ $HEALTH_COUNTER -ge $MAX_HEALTH_WAIT ]; then
    log_error "API health check failed after ${MAX_HEALTH_WAIT}s."
    log_error "Check logs: docker-compose -f $COMPOSE_FILE logs api-backend"
    exit 1
fi

echo ""

# ─── Step 8: Show status ─────────────────────────────────────
log_info "Step 8: Container status..."

docker ps --filter "name=cuonghoangdev" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""

# ─── Final ────────────────────────────────────────────────────
log_success "========================================"
log_success "  Deploy complete!"
log_success "  $(date '+%Y-%m-%d %H:%M:%S')"
log_success "========================================"
echo ""
log_info "Useful commands:"
echo "  View logs:       docker-compose -f $COMPOSE_FILE logs -f"
echo "  Restart API:     docker-compose -f $COMPOSE_FILE restart api-backend"
echo "  Check health:    curl http://localhost:3001/health"
echo "  Database shell:  docker exec -it $DB_CONTAINER psql -U postgres -d cuonghoangdev_db"
echo "  Redis CLI:       docker exec -it $REDIS_CONTAINER redis-cli"
echo ""

exit 0
