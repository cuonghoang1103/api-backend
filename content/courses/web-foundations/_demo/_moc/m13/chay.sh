#!/bin/bash
# chay: tay — Mốc 13: node --test (Node 22.23) ⇒ _moc/out/m13.out.txt (bỏ dòng thời gian chạy)
set -u
cd "$(dirname "$0")"
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
{ echo "\$ node --test"; node --test --test-reporter=spec logic.test.mjs 2>&1 | sed -E 's/ \([0-9.]+ms\)//; /^ℹ duration_ms/d'; } > ../out/m13.out.txt
