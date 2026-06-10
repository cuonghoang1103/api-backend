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

    # Remove old backups (keep last 30 days)
    find "${BACKUP_DIR}" -name "*.sql.gz" -type f -mtime +${KEEP_DAYS} -delete
    echo "[$(date)] Cleaned up backups older than ${KEEP_DAYS} days"
else
    echo "[$(date)] ERROR: Backup file is empty or missing!"
    exit 1
fi
