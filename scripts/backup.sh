#!/bin/bash
# ============================================================
# CuongHoangDev - Database Backup Script
# ============================================================

BACKUP_DIR="/opt/cuonghoangdev/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[Backup] Starting database backup..."
docker exec cuonghoangdev_postgres pg_dump -U postgres cuonghoangdev_db | gzip > "$BACKUP_FILE"

# Keep only last 30 backups
cd "$BACKUP_DIR"
ls -1t backup_*.sql.gz | tail -n +31 | xargs -r rm -f

echo "[Backup] Done: $BACKUP_FILE"
echo "[Backup] Total backups: $(ls -1 backup_*.sql.gz | wc -l)"
echo "[Backup] Total size: $(du -sh "$BACKUP_DIR" | cut -f1)"
