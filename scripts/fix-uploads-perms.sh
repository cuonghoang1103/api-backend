#!/bin/sh
# ============================================================
# fix-uploads-perms.sh — runs as root before dropping to nodejs
# ============================================================
# Docker named volumes created on a macOS host inherit a
# 501:staff ownership that is meaningless inside the container.
# When the backend (running as uid 1001) tries to write a
# user upload, it hits EACCES. We detect the mismatch and
# chown the volume before exec'ing the main process.

set -eu

UPLOAD_DIR="${UPLOAD_DIR:-/app/uploads}"
TARGET_UID="${FIX_UPLOADS_UID:-1001}"

if [ -d "$UPLOAD_DIR" ]; then
  # If any subdirectory is owned by uid 501 (macOS host default) instead of
  # our nodejs user (uid 1001), the Docker named volume was populated on
  # macOS and needs fixing. We scan ALL subdirectories dynamically so any
  # category created at runtime (e.g. playlist-covers, thumbnails, etc.)
  # is automatically covered — no need to hardcode a list.
  NEEDS_FIX=0
  if [ -d "$UPLOAD_DIR" ]; then
    for sub in "$UPLOAD_DIR"/*/; do
      if [ -d "$sub" ]; then
        CUR_UID=$(stat -c '%u' "$sub" 2>/dev/null || echo "")
        if [ "$CUR_UID" != "$TARGET_UID" ] && [ "$CUR_UID" != "0" ]; then
          NEEDS_FIX=1
          break
        fi
      fi
    done
    # Also check the root upload dir itself
    CUR_UID=$(stat -c '%u' "$UPLOAD_DIR" 2>/dev/null || echo "")
    if [ "$NEEDS_FIX" = "0" ] && [ "$CUR_UID" != "$TARGET_UID" ] && [ "$CUR_UID" != "0" ]; then
      NEEDS_FIX=1
    fi
  fi

  if [ "$NEEDS_FIX" = "1" ]; then
    echo "[fix-uploads-perms] Adjusting $UPLOAD_DIR ownership to $TARGET_UID:0"
    chown -R "$TARGET_UID:0" "$UPLOAD_DIR" && \
      chmod -R g+rwX "$UPLOAD_DIR" || {
        echo "[fix-uploads-perms] chown failed (possible read-only mount or NFS share)"
        echo "[fix-uploads-perms] Applying chmod -R 777 as fallback..."
        chmod -R 777 "$UPLOAD_DIR" || true
      }
  fi
fi

# Hand off to whatever was passed as CMD (the node process).
exec "$@"
