#!/bin/bash
D=$(date +%Y%m%d_%H%M%S)
F="/opt/cuonghoangdev/backups/${D}_backup.sql.gz"
if docker exec cuonghoangdev_postgres psql -U postgres -lqt | cut -d"|" -f1 | grep -qw cuonghoangdev_db 2>/dev/null; then
  docker exec cuonghoangdev_postgres pg_dump -U postgres cuonghoangdev_db | gzip > "$F"
  echo "[$(date)] Backup: $F ($(du -h "$F" 2>/dev/null | cut -f1 || echo 'unknown'))"
  find /opt/cuonghoangdev/backups -name "*.sql.gz" -type f -mtime +30 -delete
else
  echo "[$(date)] Database not found, skipping backup"
fi
