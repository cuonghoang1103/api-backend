#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# CT Shop · Lab 8 — the NAIVE backup script (the one found on many real servers). DO NOT USE IT.
# Lab 8 — script sao lưu NGÂY THƠ (kiểu thấy trên rất nhiều máy chủ thật). ĐỪNG DÙNG.
# Run it in Lab 8 to watch it report success while it destroys your good backups.
#   bash lab8-backup-naive.sh
# ═══════════════════════════════════════════════════════════════════════════
DIR=./backups/daily
KEEP=3
mkdir -p $DIR
docker exec pglab8-primary pg_dump -U postgres -d ctshop | gzip > $DIR/ctshop-$(date +%Y%m%d-%H%M%S).sql.gz
ls -1t $DIR/ctshop-*.sql.gz | tail -n +$((KEEP + 1)) | xargs rm -f      # keep the 3 newest
echo "✅ backup OK: $(ls -1t $DIR | head -1)"
