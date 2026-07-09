#!/bin/bash
# ============================================================
# CuongHoangDev - Database Backup Script
# Run manually or via cron
# ============================================================

set -e

BACKUP_DIR="/opt/cuonghoangdev/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DATE}_backup.sql.gz"
KEEP_DAYS=30

# Create backup dir if not exists
mkdir -p "${BACKUP_DIR}"

# Check if database exists
if ! docker exec cuonghoangdev_postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -qw cuonghoangdev_db; then
    echo "ERROR: Database cuonghoangdev_db does not exist. Skipping backup."
    exit 1
fi

# Perform backup
echo "[$(date)] Starting database backup..."
docker exec cuonghoangdev_postgres pg_dump -U postgres cuonghoangdev_db | gzip > "${BACKUP_FILE}"

# Check if backup file is valid
if [ -f "${BACKUP_FILE}" ] && [ -s "${BACKUP_FILE}" ]; then
    SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo "[$(date)] Backup completed: ${BACKUP_FILE} (${SIZE})"

    # ── Off-site copy to a PRIVATE R2 bucket (P0-6) ──────────────────
    # Reads R2_BACKUP_* from the VPS env file and injects them into a
    # one-shot `docker exec` (the always-on backend never carries the
    # backup-write creds — least privilege, no container recreate). The
    # uploader is placed under /app so its ESM `import @aws-sdk/client-s3`
    # resolves against /app/node_modules. No-op unless R2_BACKUP_BUCKET
    # is set; a failure here does NOT fail the local backup.
    ENV_FILE="/opt/cuonghoangdev/.env"
    _getenv() { grep -E "^$1=" "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2-; }
    BK_BUCKET="$(_getenv R2_BACKUP_BUCKET)"
    if [ -n "${BK_BUCKET}" ]; then
        BK_AK="$(_getenv R2_BACKUP_ACCESS_KEY_ID)"
        BK_SK="$(_getenv R2_BACKUP_SECRET_ACCESS_KEY)"
        ( docker cp "${BACKUP_FILE}" cuonghoangdev_backend:/tmp/dbbackup.sql.gz \
            && docker cp /opt/cuonghoangdev/scripts/backup-r2-upload.mjs cuonghoangdev_backend:/app/backup-r2-upload.mjs \
            && docker exec \
                 -e R2_BACKUP_BUCKET="${BK_BUCKET}" \
                 -e R2_BACKUP_ACCESS_KEY_ID="${BK_AK}" \
                 -e R2_BACKUP_SECRET_ACCESS_KEY="${BK_SK}" \
                 cuonghoangdev_backend node /app/backup-r2-upload.mjs /tmp/dbbackup.sql.gz "db/${DATE}_backup.sql.gz" ) \
            || echo "[$(date)] WARN: off-site R2 upload failed (local backup kept)"
        docker exec cuonghoangdev_backend sh -c 'rm -f /tmp/dbbackup.sql.gz /app/backup-r2-upload.mjs' 2>/dev/null || true
    fi

    # Remove old backups (keep last 30 days)
    find "${BACKUP_DIR}" -name "*.sql.gz" -type f -mtime +${KEEP_DAYS} -delete
    echo "[$(date)] Cleaned up backups older than ${KEEP_DAYS} days"
else
    echo "[$(date)] ERROR: Backup file is empty or missing!"
    exit 1
fi
