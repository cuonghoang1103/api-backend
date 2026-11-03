#!/bin/bash
# chay: tay — chụp output thật cho bài 0.2: máy chủ Node cục bộ + curl, DNS, curl -v tới example.com.
# bash content/courses/web-foundations/_demo/_t0/chay-web.sh   (cần Node 22, curl, dig; cổng 3000 trống)
set -u
cd "$(dirname "$0")"
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
mkdir -p out
LOG=$(mktemp)
(cd web && exec node server.mjs) > "$LOG" 2>&1 &
SPID=$!
sleep 1
{
  echo '$ curl -i http://localhost:3000/'; curl -s -i http://localhost:3000/ | tr -d '\r'; echo; echo
  echo '$ curl -i http://localhost:3000/about'; curl -s -i http://localhost:3000/about | tr -d '\r'; echo
} > out/curl-local.out.txt
sleep 0.3
kill "$SPID"; wait "$SPID" 2>/dev/null
{ echo '$ node server.mjs'; cat "$LOG"; } > out/server-log.out.txt
rm -f "$LOG"
{
  echo '$ dig +short example.com'; dig +short +time=3 +tries=1 example.com
} > out/dns.out.txt
{
  echo '$ curl -v https://example.com/ -o /dev/null'
  curl -s -v https://example.com/ -o /dev/null 2>&1 | tr -d '\r' | grep -E '^(\* (Host|  Trying|Connected|SSL connection)|> |< )' | grep -viE '^< (cf-|report-to|nel|alt-svc|server-timing|age|accept-ranges|etag|vary)'
} > out/curl-v.out.txt
echo ok
