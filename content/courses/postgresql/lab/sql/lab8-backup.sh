#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# CT Shop · Lab 8 — a backup script that cannot lie
# Lab 8 — script sao lưu không biết nói dối
# cuongthai.com/courses/postgresql · PostgreSQL 17
#
#   bash lab8-backup.sh                         # defaults below
#   CONTAINER=pglab8-primary DB=ctshop DIR=./backups/daily KEEP=3 bash lab8-backup.sh
# Exit code 0 ⇒ a NEW, CHECKED backup exists.  Anything else ⇒ nothing was deleted, and cron/your monitor must alert.
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail          # -e stop at the first failing command · -u unset variable = error · pipefail: a pipe fails if ANY part fails

CONTAINER=${CONTAINER:-pglab8-primary}
DB=${DB:-ctshop}
DIR=${DIR:-./backups/daily}
KEEP=${KEEP:-3}            # how many checked backups to keep (a real server: 7–14, plus copies OFF this machine)

mkdir -p "$DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="$DIR/ctshop-$STAMP.sql.gz"
TMP="$DIR/.ctshop-$STAMP.sql.gz.part"          # work under a temporary name: a half-written file never looks like a backup
trap 'rm -f "$TMP"' EXIT                         # whatever happens, no .part file is left behind

fail() { echo "❌ BACKUP FAILED: $*" >&2; echo "   the $(ls "$DIR"/ctshop-*.sql.gz 2>/dev/null | wc -l | tr -d ' ') older backups were NOT touched" >&2; exit 1; }

# 1) dump — with pipefail, a failing pg_dump fails the whole line (without it, only gzip's exit code counts)
docker exec "$CONTAINER" pg_dump -U postgres -d "$DB" | gzip > "$TMP" \
  || fail "pg_dump | gzip returned an error"

# 2) the file is a valid, complete gzip stream
gzip -t "$TMP" || fail "the gzip file is corrupt"

# 3) pg_dump finished: a plain dump ends with this line — a dump cut short does not
gzip -dc "$TMP" | tail -n 10 | grep -q 'PostgreSQL database dump complete' \
  || fail "the dump is incomplete (no 'dump complete' line)"

# 4) only a checked file gets its real name
mv "$TMP" "$OUT"

# 5) rotation LAST — only after a new good backup exists
ls -1t "$DIR"/ctshop-*.sql.gz | tail -n +$((KEEP + 1)) | xargs rm -f --

echo "✅ $OUT  $(du -h "$OUT" | cut -f1)  ·  checked backups kept: $(ls "$DIR"/ctshop-*.sql.gz | wc -l | tr -d ' ')"
