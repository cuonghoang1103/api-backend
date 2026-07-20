#!/usr/bin/env bash
# Overwrite (REPLACE) a module's exercises on prod: deletes the module's existing
# exercises and recreates from the payload. Use for rewriting old/substandard modules.
# Append (ship-exercises.sh) skips duplicate titles and would leave old rows behind.
#   bash ship-replace.sh docs/codelab-authoring/authored/sql__<slug>.json [more...]
# PURE DATA: no LLM, no restart, safe while VPS jobs run.
set -euo pipefail
files=("$@")
[ ${#files[@]} -eq 0 ] && { echo "usage: ship-replace.sh <payload.json> ..."; exit 1; }
for f in "${files[@]}"; do [ -f "$f" ] || { echo "missing: $f"; exit 1; }; done

# Guard: --replace DELETES every exercise in the module and recreates only what
# the payload holds. Shipping a 2-exercise payload over a 10-exercise module
# destroys the other 8 silently — that has already happened once (sql
# data-modification-and-transactions, 2026-07-20). Refuse to shrink a module
# unless the caller says so explicitly with SHRINK_OK=1.
for f in "${files[@]}"; do
  base=$(basename "$f" .json); slug=${base#*__}
  have=$(ssh root@cuongthai.com "docker exec cuonghoangdev_postgres psql -U postgres -d cuonghoangdev_db -t -A -c \"select count(e.id) from code_modules m left join code_exercises e on e.module_id=m.id where m.slug='$slug' group by m.id limit 1\"" 2>/dev/null | tr -d '[:space:]')
  want=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$f','utf8')).exercises.length)")
  if [ -n "$have" ] && [ "$want" -lt "$have" ] && [ "${SHRINK_OK:-0}" != "1" ]; then
    echo "REFUSING $slug: prod has $have exercise(s), payload has only $want — replacing would delete $((have - want))."
    echo "  If that is genuinely intended: SHRINK_OK=1 bash ship-replace.sh $f"
    exit 1
  fi
done

echo "[replace] ${#files[@]} module(s)"
ssh root@cuongthai.com 'rm -rf /tmp/authored-in && mkdir -p /tmp/authored-in'
scp -q "${files[@]}" root@cuongthai.com:/tmp/authored-in/
ssh root@cuongthai.com '
  docker exec cuonghoangdev_backend sh -c "rm -rf /tmp/authored && mkdir -p /tmp/authored"
  for f in /tmp/authored-in/*.json; do docker cp "$f" cuonghoangdev_backend:/tmp/authored/ >/dev/null; done
  docker exec cuonghoangdev_backend node scripts/codelab-seed-authored.mjs --dir /tmp/authored --apply --replace'
echo "[replace] done"
