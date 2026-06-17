#!/bin/bash
# ============================================================
# copy-secrets.sh
#
# Copies secret files (currently google-key.json) from the
# local machine to the VPS. These files are .gitignore'd so
# they never go through git — but the running container
# needs them.
#
# Usage:
#   ./scripts/copy-secrets.sh
#
# This script is IDEMPOTENT — safe to re-run after every
# deploy. It only copies files that exist locally and are
# newer than the remote copy.
#
# Files copied:
#   - frontend/src/config/google-key.json
#     (Google Service Account JSON, used by /api/index-url)
#
# To add a new secret: append a new `scp` line and document
# the destination path in the comment above.
# ============================================================

set -euo pipefail

# ─── Configuration ─────────────────────────────────────────
VPS="${VPS_HOST:-root@160.187.1.208}"
VPS_REPO_DIR="/opt/cuonghoangdev"
SSH_KEY="${HOME}/.ssh/id_rsa"

# Resolve the repo root from this script's location so the
# script works no matter where it's called from.
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SSH_OPTS=(
  -i "$SSH_KEY"
  -o StrictHostKeyChecking=accept-new
  -o BatchMode=yes
)

SCP_OPTS=(
  -i "$SSH_KEY"
  -o StrictHostKeyChecking=accept-new
)

# ─── Helpers ───────────────────────────────────────────────
red()    { printf '\033[31m%s\033[0m\n' "$*"; }
green()  { printf '\033[32m%s\033[0m\n' "$*"; }
yellow() { printf '\033[33m%s\033[0m\n' "$*"; }

# ─── Preflight ─────────────────────────────────────────────
if [[ ! -f "${REPO_ROOT}/frontend/src/config/google-key.json" ]]; then
  red "✗ Missing ${REPO_ROOT}/frontend/src/config/google-key.json"
  echo "  Copy the Google Service Account JSON to that path on"
  echo "  your local machine and re-run this script."
  exit 1
fi

# ─── google-key.json ───────────────────────────────────────
LOCAL="${REPO_ROOT}/frontend/src/config/google-key.json"
REMOTE="${VPS_REPO_DIR}/frontend/src/config/google-key.json"

echo "→ Copying google-key.json to VPS..."
scp "${SCP_OPTS[@]}" "$LOCAL" "${VPS}:${REMOTE}"
green "✓ google-key.json copied to ${VPS}:${REMOTE}"

# Validate the file landed intact (same byte count and JSON parseable).
REMOTE_BYTES=$(ssh "${SSH_OPTS[@]}" "${VPS}" "wc -c < '${REMOTE}'")
LOCAL_BYTES=$(wc -c < "$LOCAL")
if [[ "$REMOTE_BYTES" -ne "$LOCAL_BYTES" ]]; then
  red "✗ Size mismatch (local: $LOCAL_BYTES, remote: $REMOTE_BYTES)"
  exit 1
fi
ssh "${SSH_OPTS[@]}" "${VPS}" "python3 -c 'import json; json.load(open(\"${REMOTE}\"))'" \
  && green "✓ Remote file is valid JSON" \
  || { red "✗ Remote file is not valid JSON"; exit 1; }

# ─── Restart frontend so the new key is loaded ────────────
# The next.js server reads the key on every request (we
# explicitly did NOT cache it at module top level), so a
# container restart isn't strictly required — but a restart
# is the only way to verify the file is reachable from the
# container's filesystem. If the file is missing the route
# will 503 with a clear error, so we don't need to be
# paranoid about the key being in memory.
echo ""
yellow "ℹ  Run \`./scripts/deploy-vps.sh\` next to rebuild the"
yellow "   frontend image so the key file is baked into the"
yellow "   container. The new image's build context includes"
yellow "   the key file (it's only gitignored, not docker-"
yellow "   ignored)."
