#!/bin/bash
# chay: tay — chụp output thật cho Chương 6: máy chủ _t6/server.mjs (Node 22) + curl 8.7. Cổng 3456 phải trống.
# bash content/courses/web-foundations/_demo/_t6/chay.sh
set -u
cd "$(dirname "$0")"
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
mkdir -p out
LOG=$(mktemp)
node server.mjs > "$LOG" 2>&1 &
SPID=$!
sleep 1
B=http://localhost:3456
AUTH_USER='Authorization: Bearer user-token'   # a normal (non-admin) user's demo token
# in -i headers, drop the lines that change on every run or add nothing for a beginner
gon() { tr -d '\r' | grep -viE '^(date|connection|keep-alive|transfer-encoding):'; }
run() { echo "\$ $*"; eval "$@" | gon; echo; }

{
  echo "\$ curl -v $B/api/products/1"
  curl -s -v $B/api/products/1 2>&1 | tr -d '\r' | grep -E '^(> |< |\{)' ; echo
} > out/http-v.out.txt

node raw.mjs > out/raw.out.txt

{
  run "curl -s $B/api/products?limit=2"
  run "curl -s -X POST $B/api/products -H 'Content-Type: application/json' -d '{\"name\":\"Ruler\",\"price\":8000}'"
  run "curl -s -X POST $B/api/products -H 'Content-Type: application/json' -d '{\"name\":\"Ruler\",\"price\":8000}'"
  run "curl -s -X PATCH $B/api/products/2 -H 'Content-Type: application/json' -d '{\"price\":299000}'"
  run "curl -s -X PUT $B/api/products/2 -H 'Content-Type: application/json' -d '{\"name\":\"Desk lamp\",\"price\":299000}'"
  run "curl -s -X PUT $B/api/products/2 -H 'Content-Type: application/json' -d '{\"name\":\"Desk lamp\",\"price\":299000}'"
  run "curl -s -i -X DELETE $B/api/products/7"
  run "curl -s -i -X DELETE $B/api/products/7"
  run "curl -s -i -X POST $B/api/products/1"
  run "curl -s -I $B/api/products/1"
} > out/methods.out.txt

ETAG=$(curl -s -i $B/api/products/1 | tr -d '\r' | awk -F': ' 'tolower($1)=="etag"{print $2}')
code() { printf '%s  %s\n' "$(eval "curl -s -o /dev/null -w '%{http_code}' $1")" "$2"; }
{
  code "$B/api/products/1" "GET an existing product"
  code "-X POST $B/api/products -H 'Content-Type: application/json' -d '{\"name\":\"Glue\",\"price\":12000}'" "POST a valid new product"
  code "-X DELETE $B/api/products/8" "DELETE it"
  code "$B/old-products" "GET an old address that moved"
  code "$B/api/products/1 -H 'If-None-Match: $ETAG'" "GET again, sending the ETag we already have"
  code "-X POST $B/api/products -H 'Content-Type: application/json' -d '{oops'" "POST broken JSON"
  code "$B/api/admin/stats" "GET admin stats, not logged in"
  code "$B/api/admin/stats -H \"\$AUTH_USER\"" "GET admin stats as a normal user"
  code "$B/api/products/999" "GET a product that does not exist"
  code "-X POST $B/api/products/1" "POST to a single product"
  code "-X POST $B/api/products -d 'name=Glue'" "POST a form instead of JSON"
  code "-X POST $B/api/products -H 'Content-Type: application/json' -d '{\"name\":\"\",\"price\":-5}'" "POST JSON with invalid values"
  for i in 1 2 3; do curl -s -o /dev/null $B/api/limited; done
  code "$B/api/limited" "a 4th request within a minute"
  code "$B/api/crash" "the server has a bug"
} > out/status-codes.out.txt

{
  run "curl -s -i $B/api/products/999"
  run "curl -s -i -X POST $B/api/products -H 'Content-Type: application/json' -d '{\"name\":\"\",\"price\":-5}'"
  run "curl -s -i $B/old-products"
  run "curl -s -i $B/api/admin/stats"
} > out/status-bodies.out.txt

{
  run "curl -s -i $B/api/products/1"
  run "curl -s -i $B/api/products/1 -H 'If-None-Match: $ETAG'"
  run "curl -s -i '$B/api/products?limit=3' -H 'Accept: text/csv'"
  run "curl -s -i -X POST $B/api/products -H 'Content-Type: application/json' -d '{\"name\":\"Tape\",\"price\":15000}'"
  run "curl -s -i -X POST $B/api/products -d '{\"name\":\"Tape\",\"price\":15000}'"
} > out/headers.out.txt

{
  run "curl -s '$B/api/products?category=office'"
  run "curl -s '$B/api/products?category=office&sort=-price'"
  run "curl -s '$B/api/products?page=2&limit=2'"
  run "curl -s '$B/api/products?q=desk%20lamp'"
  run "curl -sS '$B/api/products?q=desk lamp' 2>&1"
  run "curl -s $B/api/products/abc"
  run "curl -s '$B/api/products?limit=abc'"
  run "curl -s '$B/api/products?limit=1000' | grep -o '\"limit\":[0-9]*'"
} > out/query.out.txt

sleep 0.3
kill "$SPID"; wait "$SPID" 2>/dev/null
{ echo '$ node server.mjs   (its own log while the commands above ran — first 12 lines)'; head -13 "$LOG"; } > out/server-log.out.txt
rm -f "$LOG"
echo ok
