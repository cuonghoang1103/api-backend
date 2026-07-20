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
echo "[replace] ${#files[@]} module(s)"
ssh root@cuongthai.com 'rm -rf /tmp/authored-in && mkdir -p /tmp/authored-in'
scp -q "${files[@]}" root@cuongthai.com:/tmp/authored-in/
ssh root@cuongthai.com '
  docker exec cuonghoangdev_backend sh -c "rm -rf /tmp/authored && mkdir -p /tmp/authored"
  for f in /tmp/authored-in/*.json; do docker cp "$f" cuonghoangdev_backend:/tmp/authored/ >/dev/null; done
  docker exec cuonghoangdev_backend node scripts/codelab-seed-authored.mjs --dir /tmp/authored --apply --replace'
echo "[replace] done"
