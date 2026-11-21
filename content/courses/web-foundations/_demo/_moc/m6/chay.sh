#!/bin/bash
# chay: tay — Mốc 6: máy chủ m6/server.mjs (Node 22) + curl. Cổng 3471 phải trống.
# bash content/courses/web-foundations/_demo/_moc/m6/chay.sh  ⇒ _moc/out/m6.out.txt
set -u
cd "$(dirname "$0")"
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
node server.mjs > /dev/null 2>&1 &
SPID=$!
sleep 1
B=http://localhost:3471
run() { echo "\$ $*"; eval "$@" | tr -d '\r' | grep -viE '^(date|connection|keep-alive|transfer-encoding):'; echo; echo; }
{
  run "curl -s '$B/api/recipes?q=pho'"
  run "curl -s -i $B/api/recipes/99"
  run "curl -s -i -X POST $B/api/recipes -H 'Content-Type: application/json' -d '{\"name\":\"X\",\"minutes\":-5}'"
  run "curl -s -i -X POST $B/api/recipes -H 'Content-Type: application/json' -d '{\"name\":\"Goi cuon\",\"minutes\":25}'"
  run "curl -s -X PATCH $B/api/recipes/3 -H 'Content-Type: application/json' -d '{\"minutes\":20}'"
  run "curl -s -i -X DELETE $B/api/recipes/3"
  run "curl -s -X PATCH $B/api/recipes/1 -H 'Content-Type: application/json' -d '{\"id\":42,\"minutes\":80}'"
  run "curl -s -i -X PUT $B/api/recipes/1"
} > ../out/m6.out.txt
kill $SPID
