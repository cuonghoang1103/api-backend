#!/bin/bash
# chay: tay — Bài 10.4: rút gọn một lỗi thành ví dụ tái hiện tối thiểu, đọc tài liệu, đọc mã nguồn thư viện (ms 2.0.0
# trong node_modules của repo — CHỈ ĐỌC). Node 22.23. Ghi ../out/*.out.txt.
set -u
cd "$(dirname "$0")"
NODE="$HOME/.nvm/versions/node/v22.23.3/bin/node"
ROOT="$(cd ../../../../../.. && pwd)"
OUT=../out
{ echo '$ node big-app.mjs'; "$NODE" big-app.mjs; echo; echo '$ node big-app.mjs study'; "$NODE" big-app.mjs study; } > $OUT/big-app.out.txt
{ echo '$ node repro-1.mjs'; "$NODE" repro-1.mjs; echo '$ node repro-2.mjs'; "$NODE" repro-2.mjs; } > $OUT/repro.out.txt
{ echo '$ node docs.mjs'; "$NODE" docs.mjs; } > $OUT/docs.out.txt
{ echo '$ node env-info.mjs'; "$NODE" env-info.mjs | sed -E 's/^(OS +).*/\1<your OS, version, arch>/'; } > $OUT/env-info.out.txt
{
  echo "\$ node -e \"const ms = require('ms'); console.log(ms('2 days'), ms('1.5h'), ms(90000), ms('two days'))\""
  (cd "$ROOT" && "$NODE" -e "const ms = require('ms'); console.log(ms('2 days'), ms('1.5h'), ms(90000), ms('two days'))")
  echo
  echo '$ grep -n "function parse" -A 8 node_modules/ms/index.js     (how does it read "1.5h"?)'
  (cd "$ROOT" && grep -n "function parse" -A 8 node_modules/ms/index.js)
} > $OUT/read-source.out.txt
