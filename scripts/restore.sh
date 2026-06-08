#!/bin/bash
# ============================================================
# CuongHoangDev - Database Restore Script
# Usage: ./restore.sh backup_20260608_120000.sql.gz
# ============================================================

if [ -z "$1" ]; then
  echo "Usage: $0 <backup_file>"
  echo "Available backups:"
  ls -1 /opt/cuonghoangdev/backups/backup_*.sql.gz
  exit 1
fi

BACKUP_FILE="$1"
BACKUP_DIR="/opt/cuonghoangdev/backups"

if [ ! -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
  echo "Error: Backup file not found: ${BACKUP_DIR}/${BACKUP_FILE}"
  exit 1
fi

echo "[Restore] Stopping backend..."
docker stop cuonghoangdev_backend || true

echo "[Restore] Dropping and recreating database..."
docker exec -i cuonghoangdev_postgres psql -U postgres -c "DROP DATABASE IF EXISTS cuonghoangdev_db;" 2>/dev/null || true
docker exec -i cuonghoangdev_postgres psql -U postgres -c "CREATE DATABASE cuonghoangdev_db;" 2>/dev/null || true

echo "[Restore] Restoring data from ${BACKUP_FILE}..."
gunzip -c "${BACKUP_DIR}/${BACKUP_FILE}" | docker exec -i cuonghoangdev_postgres psql -U postgres cuonghoangdev_db

echo "[Restore] Restarting services..."
docker start cuonghoangdev_backend

echo "[Restore] Done! Make sure to run prisma migrations after restore."
