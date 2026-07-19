#!/usr/bin/env bash
# Ship authored module lessons to prod via codelab-lesson-write.mjs (stdin JSON array).
set -euo pipefail
SP="$(cd "$(dirname "$0")" && pwd)"
SRC="$SP/authored"
SENT="$SP/authored/shipped"
mkdir -p "$SENT"

shopt -s nullglob
files=("$SRC"/lesson__*.json)
if [ ${#files[@]} -eq 0 ]; then echo "[lessons] nothing new"; exit 0; fi
echo "[lessons] ${#files[@]} lesson(s)"

# Merge into the [{moduleId, blocks}] array the writer expects, rejecting thin/malformed ones.
BATCH="$SP/lesson-batch.json" node -e '
const fs=require("fs");
const ALLOWED=["heading","prose","code","mermaid","links","image"];
const out=[];
for (const f of process.argv.slice(1)) {
  const p=JSON.parse(fs.readFileSync(f,"utf8"));
  const b=p.blocks||[];
  const code=b.filter(x=>x.type==="code").length;
  const bad=[...new Set(b.filter(x=>!ALLOWED.includes(x.type)).map(x=>x.type))];
  if (!p.moduleId)    { console.error("SKIP (no moduleId): "+f); continue; }
  if (bad.length)     { console.error("SKIP (bad block types "+bad.join(",")+"): "+f); continue; }
  if (b.length<40 || code<12) { console.error("SKIP (thin: "+b.length+" blocks / "+code+" code): "+f); continue; }
  console.error("ok "+p.moduleSlug+" — "+b.length+" blocks, "+code+" code, "+Math.round(JSON.stringify(b).length/1000)+"k");
  out.push({moduleId:p.moduleId, blocks:b});
}
fs.writeFileSync(process.env.BATCH, JSON.stringify(out));
' "${files[@]}"

scp -q "$SP/lesson-batch.json" root@cuongthai.com:/tmp/lesson-batch.json
ssh root@cuongthai.com 'docker cp /tmp/lesson-batch.json cuonghoangdev_backend:/tmp/lesson-batch.json >/dev/null && docker exec cuonghoangdev_backend sh -c "cat /tmp/lesson-batch.json | node scripts/codelab-lesson-write.mjs"' | tee "$SP/last-lesson-ship.log"

for f in "${files[@]}"; do
  id=$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).moduleId)' "$f")
  if grep -q "ok  module $id " "$SP/last-lesson-ship.log"; then mv "$f" "$SENT/"; else echo "[lessons] KEPT: $(basename "$f")"; fi
done
echo "[lessons] done"
