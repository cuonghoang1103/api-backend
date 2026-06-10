#!/bin/bash
BACKUP_DIR="/opt/cuonghoangdev/backups"
if [ -z "$1" ]; then
  echo "Usage: $0 <backup_filename>"
  ls "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "No backups found"
  exit 1
fi
F="$BACKUP_DIR/$1"
if [ ! -f "$F" ]; then echo "Not found: $F"; exit 1; fi
echo "WARNING: This will overwrite the current database!"
read -p "Continue? (yes/no): " C
[ "$C" != "yes" ] && exit 0
echo "Restoring from $F..."
docker exec -i cuonghoangdev_postgres psql -U postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname='cuonghoangdev_db' AND pid <> pg_backend_pid();" 2>/dev/null || true
docker exec -i cuonghoangdev_postgres psql -U postgres -c "DROP DATABASE IF EXISTS cuonghoangdev_db; CREATE DATABASE cuonghoangdev_db;"
gunzip -c "$F" | docker exec -i cuonghoangdev_postgres psql -U postgres cuonghoangdev_db
echo "Restored successfully!"
