#!/usr/bin/env bash
# Ship ONLY the named payload file(s) in append mode. Unlike ship-exercises.sh (which globs
# the whole authored/ dir), this is safe when two sessions share the working tree — it will
# not sweep up another session's in-progress authored/*.json. PURE DATA: no LLM, no restart.
#   bash ship-one.sh docs/codelab-authoring/authored/sql__<slug>.json [more...]
set -euo pipefail
files=("$@")
[ ${#files[@]} -eq 0 ] && { echo "usage: ship-one.sh <payload.json> ..."; exit 1; }
for f in "${files[@]}"; do [ -f "$f" ] || { echo "missing: $f"; exit 1; }; done
echo "[ship-one] ${#files[@]} file(s)"
ssh root@cuongthai.com 'rm -rf /tmp/authored-in && mkdir -p /tmp/authored-in'
scp -q "${files[@]}" root@cuongthai.com:/tmp/authored-in/
ssh root@cuongthai.com '
  docker exec cuonghoangdev_backend sh -c "rm -rf /tmp/authored && mkdir -p /tmp/authored"
  for f in /tmp/authored-in/*.json; do docker cp "$f" cuonghoangdev_backend:/tmp/authored/ >/dev/null; done
  docker exec cuonghoangdev_backend node scripts/codelab-seed-authored.mjs --dir /tmp/authored --apply'
echo "[ship-one] done"
