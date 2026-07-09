#!/bin/bash
D=$(date +%Y%m%d_%H%M%S)
F="/opt/cuonghoangdev/backups/${D}_backup.sql.gz"
if docker exec cuonghoangdev_postgres psql -U postgres -lqt | cut -d"|" -f1 | grep -qw cuonghoangdev_db 2>/dev/null; then
  docker exec cuonghoangdev_postgres pg_dump -U postgres cuonghoangdev_db | gzip > "$F"
  echo "[$(date)] Backup: $F ($(du -h "$F" 2>/dev/null | cut -f1 || echo 'unknown'))"
  # ── Off-site copy to a PRIVATE R2 bucket (P0-6) ──────────────────
  # Reads R2_BACKUP_* from the VPS env file and injects them into a
  # one-shot `docker exec` (the always-on backend never carries the
  # backup-write creds — least privilege, no container recreate). The
  # uploader is placed under /app so its ESM `import @aws-sdk/client-s3`
  # resolves against /app/node_modules. No-op unless R2_BACKUP_BUCKET is
  # set; a failure here does NOT fail the local backup.
  if [ -s "$F" ]; then
    ENV_FILE="/opt/cuonghoangdev/.env"
    _getenv() { grep -E "^$1=" "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2-; }
    BK_BUCKET="$(_getenv R2_BACKUP_BUCKET)"
    if [ -n "$BK_BUCKET" ]; then
      BK_AK="$(_getenv R2_BACKUP_ACCESS_KEY_ID)"
      BK_SK="$(_getenv R2_BACKUP_SECRET_ACCESS_KEY)"
      ( docker cp "$F" cuonghoangdev_backend:/tmp/dbbackup.sql.gz \
          && docker cp /opt/cuonghoangdev/scripts/backup-r2-upload.mjs cuonghoangdev_backend:/app/backup-r2-upload.mjs \
          && docker exec \
               -e R2_BACKUP_BUCKET="$BK_BUCKET" \
               -e R2_BACKUP_ACCESS_KEY_ID="$BK_AK" \
               -e R2_BACKUP_SECRET_ACCESS_KEY="$BK_SK" \
               cuonghoangdev_backend node /app/backup-r2-upload.mjs /tmp/dbbackup.sql.gz "db/${D}_backup.sql.gz" ) \
        || echo "[$(date)] WARN: off-site R2 upload failed"
      docker exec cuonghoangdev_backend sh -c 'rm -f /tmp/dbbackup.sql.gz /app/backup-r2-upload.mjs' 2>/dev/null || true
    fi
  fi
  find /opt/cuonghoangdev/backups -name "*.sql.gz" -type f -mtime +30 -delete
else
  echo "[$(date)] Database not found, skipping backup"
fi
