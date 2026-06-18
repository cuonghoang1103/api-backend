#!/bin/bash
# ============================================================
# Docker Cleanup Script
# Mục đích: Giải phóng disk space bằng cách xóa Docker build cache,
# dangling images, stopped containers và unused volumes.
# An toàn: KHÔNG xóa running containers, KHÔNG xóa images đang dùng.
# ============================================================

set -e

LOG_FILE="/var/log/docker-cleanup.log"
THRESHOLD=80  # Disk usage % threshold để cleanup

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Ensure log file exists & writable
touch "$LOG_FILE" 2>/dev/null || {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: cannot write to $LOG_FILE" >&2
  exit 1
}

# 1. Check disk usage
USAGE=$(df / --output=pcent 2>/dev/null | tail -1 | tr -dc '0-9')
log "=== Cleanup start ==="
log "Current disk usage: ${USAGE}%"

# Always log to syslog so we have a record
if [ "$USAGE" -lt "$THRESHOLD" ]; then
  log "Disk usage < ${THRESHOLD}%, light cleanup only"
  LIGHT_CLEANUP=1
else
  log "Disk usage >= ${THRESHOLD}%, full cleanup"
  LIGHT_CLEANUP=0
fi

# 2. Always remove dangling images (safe, no active container uses them)
DANGLING=$(docker images -f "dangling=true" -q 2>/dev/null | wc -l)
if [ "$DANGLING" -gt 0 ]; then
  log "Removing $DANGLING dangling images..."
  docker image prune -f 2>&1 | tee -a "$LOG_FILE" || true
else
  log "No dangling images"
fi

# 3. If heavy cleanup: prune build cache, old images, stopped containers, unused volumes
if [ "$LIGHT_CLEANUP" -eq 0 ]; then
  log "Pruning Docker build cache (older than 7 days)..."
  docker builder prune -f --filter "until=168h" 2>&1 | tee -a "$LOG_FILE" || true

  log "Pruning stopped containers..."
  docker container prune -f 2>&1 | tee -a "$LOG_FILE" || true

  log "Pruning unused networks..."
  docker network prune -f 2>&1 | tee -a "$LOG_FILE" || true

  # Volumes: only prune anonymous volumes (named volumes in compose giữ nguyên)
  log "Pruning anonymous volumes (giữ named volumes)..."
  docker volume prune -f 2>&1 | tee -a "$LOG_FILE" || true
fi

# 4. Report after cleanup
NEW_USAGE=$(df / --output=pcent 2>/dev/null | tail -1 | tr -dc '0-9')
FREED=$((USAGE - NEW_USAGE))
log "After cleanup: ${NEW_USAGE}% (freed ${FREED}%)"

# 5. Alert if still critical
if [ "$NEW_USAGE" -ge 90 ]; then
  log "WARNING: Disk vẫn ở mức critical (>=90%). Cần can thiệp thủ công."
  # Có thể gọi notification API ở đây
fi

log "=== Cleanup end ==="
