#!/bin/bash
# chay: tay — Bài 10.1: kế hoạch → bản đơn giản → ca biên → kiểm thử (Node 22.23, node --test). Ghi ../out/*.out.txt.
set -u
cd "$(dirname "$0")"
NODE="$HOME/.nvm/versions/node/v22.23.3/bin/node"
OUT=../out
{ echo '$ node reverse.mjs'; "$NODE" reverse.mjs; } > $OUT/reverse.out.txt
{ echo '$ node top-words.mjs --trace'; "$NODE" top-words.mjs --trace; } > $OUT/trace.out.txt
clean() { sed -E 's/\(([0-9.]+)ms\)/(…ms)/; s/duration_ms [0-9.]+/duration_ms …/; s#file://[^ ]*/##; s#'"$(pwd)"'/##g'; }
{ echo '$ IMPL=./top-words-v1.mjs node --test top-words.test.mjs     (the first version)'
  IMPL=./top-words-v1.mjs "$NODE" --test --test-reporter=spec top-words.test.mjs 2>&1 | clean | grep -vE '^\s+at |^\s*$|node:internal' ; echo "(exit code ${PIPESTATUS[0]})"; } > $OUT/tests-v1.out.txt
{ echo '$ node --test top-words.test.mjs     (after fixing one case at a time)'
  "$NODE" --test --test-reporter=spec top-words.test.mjs 2>&1 | clean ; echo "(exit code ${PIPESTATUS[0]})"; } > $OUT/tests-final.out.txt
