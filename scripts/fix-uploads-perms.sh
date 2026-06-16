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
  # If a directory is owned by someone other than the target
  # uid (or by root without a usable group), chown it. We don't
  # touch files we just created ourselves (owner already correct).
  NEEDS_FIX=0
  for sub in images audio video documents; do
    if [ -d "$UPLOAD_DIR/$sub" ]; then
      CUR_UID=$(stat -c '%u' "$UPLOAD_DIR/$sub" 2>/dev/null || echo "")
      if [ "$CUR_UID" != "$TARGET_UID" ] && [ "$CUR_UID" != "0" ]; then
        NEEDS_FIX=1
        break
      fi
    fi
  done

  if [ "$NEEDS_FIX" = "1" ]; then
    echo "[fix-uploads-perms] Adjusting $UPLOAD_DIR ownership to $TARGET_UID:0"
    chown -R "$TARGET_UID:0" "$UPLOAD_DIR" 2>/dev/null || \
      echo "[fix-uploads-perms] chown failed (read-only mount?)"
    chmod -R g+rwX "$UPLOAD_DIR" 2>/dev/null || true
  fi
fi

# Hand off to whatever was passed as CMD (the node process).
exec "$@"
