#!/bin/bash
# ============================================================
# Registry Deploy Script - Pull new image from GHCR and
# restart the running containers WITHOUT touching the
# docker-compose.yml stack.
# ============================================================
#
# Why this script (and not `docker compose up`):
#   • The existing `docker-compose.yml` on the VPS has
#     `build:` sections that point at the local source tree.
#     If we ran `docker compose up -d`, it would REBUILD the
#     images locally from source — exactly what we're trying
#     to avoid.
#   • Instead, we pull the pre-built image from GHCR into
#     the local Docker daemon, then `docker stop` + `docker rm`
#     the running containers and `docker run` them with the
#     SAME env, volumes, and network as the compose-managed
#     ones. From the OS perspective, nothing changes — only
#     the image content did.
#
# Required env vars (set by the CI workflow before invoking):
#   IMAGE_TAG  - the tag to pull (e.g. short SHA, "latest", or
#                a custom tag for rollback)
#   GHCR_OWNER - the GitHub org/user that owns the package
#                (e.g. "cuonghoang1103")
#
# The script is idempotent: running it twice with the same
# tag is a no-op for the image content (but does restart the
# containers, which is fine).
# ============================================================

set -euo pipefail

# ─── Config ────────────────────────────────────────────────
GHCR_REGISTRY="ghcr.io"
GHCR_OWNER="${GHCR_OWNER:?GHCR_OWNER is required}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
BACKEND_IMAGE="${GHCR_REGISTRY}/${GHCR_OWNER}/api-backend-backend:${IMAGE_TAG}"
FRONTEND_IMAGE="${GHCR_REGISTRY}/${GHCR_OWNER}/api-backend-frontend:${IMAGE_TAG}"

BACKEND_CONTAINER="cuonghoangdev_backend"
FRONTEND_CONTAINER="cuonghoangdev_frontend"
UPLOADS_VOLUME="cuonghoangdev_uploads_data"
BACKEND_NETWORK="cuonghoangdev_backend"

# Compose's default volume name uses the project dir name as
# prefix. Verify the actual name on the running containers:
ACTUAL_UPLOADS_VOLUME=$(docker inspect "$BACKEND_CONTAINER" \
  --format '{{ range .Mounts }}{{ .Name }} {{end}}' 2>/dev/null \
  | tr ' ' '\n' | grep uploads || echo "cuonghoangdev_uploads_data")

echo "=== Registry Deploy ==="
echo "  Backend image:  ${BACKEND_IMAGE}"
echo "  Frontend image: ${FRONTEND_IMAGE}"
echo "  Uploads volume: ${ACTUAL_UPLOADS_VOLUME}"

# ─── Pre-flight: login to GHCR if token is provided ──────
# When invoked from CI, GHCR_TOKEN_FILE points to a file
# containing the GitHub Actions job token (scope:
# read:packages). We use it for a one-time `docker login`
# so the subsequent `docker pull` can authenticate.
# When invoked manually without a token, the user is
# expected to have run `docker login ghcr.io` themselves.
GHCR_TOKEN_FILE="${GHCR_TOKEN_FILE:-/root/.ghcr_token}"
if [ -f "$GHCR_TOKEN_FILE" ]; then
  echo "--- Logging in to GHCR (token: ${GHCR_TOKEN_FILE}) ---"
  cat "$GHCR_TOKEN_FILE" | docker login "$GHCR_REGISTRY" -u "$GHCR_OWNER" --password-stdin 2>&1 | tail -3 || {
    echo "  ✗ GHCR login failed. Aborting."
    exit 1
  }
else
  echo "  (No GHCR token file. Assuming 'docker login ghcr.io' is already done.)"
fi

# ─── Step 1: pull new images ──────────────────────────────
echo ""
echo "--- Pulling backend image ---"
docker pull "$BACKEND_IMAGE" 2>&1 | tail -3 || {
  echo "  ✗ Backend pull failed. Aborting."
  exit 1
}

echo ""
echo "--- Pulling frontend image ---"
docker pull "$FRONTEND_IMAGE" 2>&1 | tail -3 || {
  echo "  ✗ Frontend pull failed. Aborting."
  exit 1
}

# ─── Step 2: snapshot container config ────────────────────
# Capture env + network from the currently-running containers
# so the new ones start with identical config.
echo ""
echo "--- Capturing env from running containers ---"
BACKEND_ENV_FILE="/tmp/backend.env"
docker inspect "$BACKEND_CONTAINER" \
  --format '{{range .Config.Env}}{{println .}}{{end}}' > "$BACKEND_ENV_FILE"
echo "  Backend env vars: $(wc -l < "$BACKEND_ENV_FILE")"

FRONTEND_ENV_FILE="/tmp/frontend.env"
docker inspect "$FRONTEND_CONTAINER" \
  --format '{{range .Config.Env}}{{println .}}{{end}}' > "$FRONTEND_ENV_FILE"
echo "  Frontend env vars: $(wc -l < "$FRONTEND_ENV_FILE")"

# Also snapshot the frontend's port mapping (3000 internal,
# but we keep 3000 internal-only since nginx proxies it).
FRONTEND_PORT_BINDING=$(docker inspect "$FRONTEND_CONTAINER" \
  --format '{{json .HostConfig.PortBindings}}' 2>/dev/null || echo "null")

# ─── Step 3: stop & remove old containers ─────────────────
echo ""
echo "--- Stopping old containers ---"
docker stop "$BACKEND_CONTAINER" 2>&1 | tail -1 || true
docker stop "$FRONTEND_CONTAINER" 2>&1 | tail -1 || true

echo "--- Removing old containers (keeping volumes & network) ---"
docker rm -f "$BACKEND_CONTAINER" 2>&1 | tail -1 || true
docker rm -f "$FRONTEND_CONTAINER" 2>&1 | tail -1 || true

# Give Docker a moment to release the network namespace.
sleep 2

# ─── Step 4: run prisma db push on the new backend image ──
# We do this BEFORE the backend starts serving traffic. This
# is the equivalent of `prisma migrate deploy` but matches
# the project's choice of `db push` for schema sync.
# Running it as a one-off container that mounts the same
# DATABASE_URL ensures the schema is up-to-date before the
# backend container accepts connections.
echo ""
echo "--- Running prisma db push via new backend image ---"
docker run --rm \
  --network "$BACKEND_NETWORK" \
  --env-file "$BACKEND_ENV_FILE" \
  "$BACKEND_IMAGE" \
  sh -c "npx prisma db push --accept-data-loss --skip-generate 2>&1" | tail -10 || {
    echo "  ✗ prisma db push failed. Rolling back..."
    # Best-effort rollback: don't proceed if migration failed,
    # the operator can re-run with a previous IMAGE_TAG.
    exit 1
  }

# ─── Step 5: start new backend ─────────────────────────────
echo ""
echo "--- Starting new backend container ---"
docker run -d \
  --name "$BACKEND_CONTAINER" \
  --restart unless-stopped \
  --network "$BACKEND_NETWORK" \
  --env-file "$BACKEND_ENV_FILE" \
  -v "${ACTUAL_UPLOADS_VOLUME}:/app/uploads" \
  --dns 8.8.8.8 --dns 8.8.4.4 \
  --memory 1g \
  --health-cmd "curl -sf http://localhost:3001/health || exit 1" \
  --health-interval 15s \
  --health-timeout 5s \
  --health-retries 3 \
  --health-start-period 30s \
  --label "com.docker.compose.project=cuonghoangdev" \
  --label "com.docker.compose.service=backend" \
  "$BACKEND_IMAGE"

# ─── Step 6: start new frontend ───────────────────────────
echo ""
echo "--- Starting new frontend container ---"
docker run -d \
  --name "$FRONTEND_CONTAINER" \
  --restart unless-stopped \
  --network "$BACKEND_NETWORK" \
  --env-file "$FRONTEND_ENV_FILE" \
  --memory 1.5g \
  --health-cmd "wget -qO- http://localhost:3000/ || exit 1" \
  --health-interval 30s \
  --health-timeout 10s \
  --health-retries 3 \
  --health-start-period 15s \
  --label "com.docker.compose.project=cuonghoangdev" \
  --label "com.docker.compose.service=frontend" \
  "$FRONTEND_IMAGE"

# ─── Step 7: cleanup temp env files ───────────────────────
rm -f "$BACKEND_ENV_FILE" "$FRONTEND_ENV_FILE"

echo ""
echo "=== Deploy complete ==="
echo "  Run 'docker ps' to see the new containers."
echo "  Run 'docker logs ${BACKEND_CONTAINER} --tail 50' to verify."
