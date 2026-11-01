#!/bin/bash
# ops/backup.sh — bài 12.7: sao lưu CSDL LabFlow bằng pg_dump (định dạng custom, nén) rồi THỬ KHÔI PHỤC vào một CSDL tạm.
# Sao lưu chưa khôi phục thử thì chưa phải sao lưu. Dùng: DATABASE_URL=postgres://… bash ops/backup.sh [thư mục]
set -euo pipefail
DIR="${1:-backups}"; mkdir -p "$DIR"
FILE="$DIR/labflow-$(date -u +%Y%m%dT%H%M%SZ).dump"
t0=$(date +%s)
pg_dump --format=custom --no-owner --dbname="$DATABASE_URL" --file="$FILE"
echo "dump: $FILE ($(du -h "$FILE" | cut -f1), $(( $(date +%s) - t0 )) s)"
# Khôi phục thử vào CSDL tạm cùng máy chủ, so số dòng từng bảng với bản gốc
BASE_URL="${DATABASE_URL%/*}"; TMP="labflow_restore_check"
psql "$BASE_URL/postgres" -qc "DROP DATABASE IF EXISTS $TMP" -c "CREATE DATABASE $TMP"
t1=$(date +%s)
pg_restore --no-owner --dbname="$BASE_URL/$TMP" "$FILE"
echo "restore: $(( $(date +%s) - t1 )) s"
Q="SELECT string_agg(t || '=' || n, ' ') FROM (SELECT 'users' t, count(*) n FROM users UNION ALL SELECT 'bookings', count(*) FROM bookings
   UNION ALL SELECT 'outbox', count(*) FROM outbox UNION ALL SELECT 'migrations', count(*) FROM schema_migrations) x"
A=$(psql "$DATABASE_URL" -Atc "$Q"); B=$(psql "$BASE_URL/$TMP" -Atc "$Q")
echo "gốc:       $A"; echo "khôi phục: $B"
[ "$A" = "$B" ] && echo "KHỚP — bản sao lưu dùng được" || { echo "LỆCH — bản sao lưu KHÔNG dùng được"; exit 1; }
psql "$BASE_URL/postgres" -qc "DROP DATABASE $TMP"
