#!/bin/bash
# chay: tay — Bài 10.2: lỗi thật của Node 22.23 (stack qua 3 tệp, 6 loại lỗi, promise bị từ chối) + git bisect. Ghi ../out/*.out.txt.
set -u
cd "$(dirname "$0")"
NODE="$HOME/.nvm/versions/node/v22.23.3/bin/node"
OUT=../out
here="$(pwd)"
clean() { sed -E "s#file://$here/##g; s#$here/##g; s#node:internal/[^)]*#node:internal/…#g"; }
{ echo '$ node shop/index.mjs'; "$NODE" shop/index.mjs 2>&1 | clean; echo "(exit code ${PIPESTATUS[0]})"; } > $OUT/stack.out.txt
{ echo '$ node errors.mjs'; "$NODE" errors.mjs 2>&1 | clean; } > $OUT/errors.out.txt
{ echo '$ node async-error.mjs'; "$NODE" async-error.mjs 2>&1 | clean; echo "(exit code ${PIPESTATUS[0]})"; } > $OUT/async-error.out.txt
bash bisect.sh > $OUT/bisect.out.txt 2>&1
