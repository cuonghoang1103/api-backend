#!/usr/bin/env bash
# Ship every authored payload that has not been shipped yet to prod and seed it.
# Shipped files are moved to authored/shipped/ so re-runs only carry new work.
set -euo pipefail
SP="$(cd "$(dirname "$0")" && pwd)"
SRC="$SP/authored"
SENT="$SP/authored/shipped"
mkdir -p "$SENT"

shopt -s nullglob
files=("$SRC"/*.json)
if [ ${#files[@]} -eq 0 ]; then echo "[ship] nothing new"; exit 0; fi
echo "[ship] ${#files[@]} payload(s)"

ssh root@cuongthai.com 'rm -rf /tmp/authored-in && mkdir -p /tmp/authored-in'
scp -q "${files[@]}" root@cuongthai.com:/tmp/authored-in/
ssh root@cuongthai.com '
  docker exec cuonghoangdev_backend sh -c "rm -rf /tmp/authored && mkdir -p /tmp/authored"
  for f in /tmp/authored-in/*.json; do docker cp "$f" cuonghoangdev_backend:/tmp/authored/ >/dev/null; done
  docker exec cuonghoangdev_backend node scripts/codelab-seed-authored.mjs --dir /tmp/authored --apply
' | tee "$SP/last-ship.log"

# Only archive payloads the seeder actually accepted (a rejected module keeps its
# file in authored/ so it can be fixed and re-shipped).
for f in "${files[@]}"; do
  base=$(basename "$f" .json)
  mod=${base#*__}
  if grep -q "/$mod (" "$SP/last-ship.log" && ! grep -q "✗ $base" "$SP/last-ship.log"; then
    mv "$f" "$SENT/"
  else
    echo "[ship] KEPT (rejected or not seen): $base"
  fi
done
echo "[ship] done"
