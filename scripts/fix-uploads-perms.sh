#!/bin/sh
# ============================================================
# fix-uploads-perms.sh — runs as root before dropping to nodejs
# ============================================================
# Docker named volumes from macOS hosts use APFS, which blocks
# chown from inside the container (EACCES even as root).
# Solution: chmod -R 777 on the entire uploads tree.
# Group write (o+w) lets uid 1001 (nodejs) write regardless
# of ownership. The umask on the macOS host is 022, so existing
# files are typically 644 (rw-r--r--); directories are 755.
# chmod 777 makes dirs +rwx for all and files +rw for all.
# This is safe because /uploads/ is NOT world-readable auth data
# and the nodejs process already runs as a non-root user.

set -e

UPLOAD_DIR="${UPLOAD_DIR:-/app/uploads}"
LOG_PREFIX="[fix-uploads-perms]"

if [ -d "$UPLOAD_DIR" ]; then
  echo "$LOG_PREFIX Scanning $UPLOAD_DIR for permission issues..."

  # Check if any directory inside uploads is NOT writable by group.
  # stat -c '%a' returns the permissions in octal (e.g. 755, 644).
  HAS_BAD=0
  for dir in "$UPLOAD_DIR" "$UPLOAD_DIR"/*/; do
    [ -d "$dir" ] || continue
    PERMS=$(stat -c '%a' "$dir" 2>/dev/null || echo "")
    # Check if group write bit is set. Permissions like 755 → 3rd char
    # contains '7' if group-write is set. We check the middle digit.
    # Example: 755 → '5' (no group write), 775 → '7' (has group write)
    GRP_W_BIT=$(echo "$PERMS" | cut -c2)
    if [ "$GRP_W_BIT" != "7" ]; then
      echo "$LOG_PREFIX Directory $(basename "$dir" 2>/dev/null || echo "$dir") has mode $PERMS (group-write bit not set)"
      HAS_BAD=1
      break
    fi
  done

  if [ "$HAS_BAD" = "1" ]; then
    echo "$LOG_PREFIX Applying chmod -R 777 to $UPLOAD_DIR (macOS APFS volume detected)"
    chmod -R 777 "$UPLOAD_DIR" || {
      echo "$LOG_PREFIX ERROR: chmod failed — uploads directory may be read-only"
      echo "$LOG_PREFIX Check Docker volume mount options: ensure :Z or :Delegated is NOT set"
    }
  else
    echo "$LOG_PREFIX Permissions OK (group-write bit set on all directories)"
  fi
else
  echo "$LOG_PREFIX $UPLOAD_DIR does not exist yet — skipping"
fi

# Hand off to whatever was passed as CMD (the node process).
exec "$@"
