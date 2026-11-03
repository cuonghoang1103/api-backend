#!/bin/bash
# chay: tay — chụp output thật cho Chương 7 (bài 7.1, 7.2): máy chủ _t7/app.mjs (Node 22) + curl 8.7. Cổng 3457 phải trống.
# bash content/courses/web-foundations/_demo/_t7/chay.sh
set -u
cd "$(dirname "$0")"
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
mkdir -p out
LOG=$(mktemp)
JAR=$(mktemp)
JAR2=$(mktemp)
node app.mjs > "$LOG" 2>&1 &
SPID=$!
sleep 1
B=http://localhost:3457
gon() { tr -d '\r' | grep -viE '^(date|connection|keep-alive|transfer-encoding|content-length):'; }
run() { echo "\$ $*"; eval "$@" | gon; echo; }
JSON="-H 'Content-Type: application/json'"

# 7.1 — HTTP forgets you; Basic auth is just base64
{
  run "curl -s -i -X POST $B/login $JSON -d '{\"email\":\"an@example.com\",\"password\":\"correct horse battery\"}'"
  run "curl -s -i $B/api/me"
} > out/forgets.out.txt
{
  CREDS='an@example.com:secret123'
  echo "\$ CREDS='$CREDS'"
  echo "\$ curl -s -v -u \"\$CREDS\" $B/ -o /dev/null 2>&1 | grep -i '^> authorization'"
  curl -s -v -u "$CREDS" http://localhost:3457/ -o /dev/null 2>&1 | tr -d '\r' | grep -i '^> authorization'
  echo
  echo "\$ echo 'YW5AZXhhbXBsZS5jb206c2VjcmV0MTIz' | base64 --decode"
  echo 'YW5AZXhhbXBsZS5jb206c2VjcmV0MTIz' | base64 --decode; echo
} > out/basic.out.txt

# 7.2 — a session cookie, step by step
{
  run "curl -s -i -X POST $B/login $JSON -d '{\"email\":\"an@example.com\",\"password\":\"wrong\"}'"
  run "curl -s -i -X POST $B/login $JSON -d '{\"email\":\"nobody@example.com\",\"password\":\"x\"}'"
  run "curl -s -i -c cookies.txt -X POST $B/login $JSON -d '{\"email\":\"an@example.com\",\"password\":\"correct horse battery\"}' | sed -E 's/sid=[A-Za-z0-9_-]{20,}/sid=(43 random characters)/'"
  run "curl -s -b cookies.txt $B/api/me"
  run "curl -s -i -b cookies.txt $B/api/admin/users"
} > out/session.out.txt
# reuse the real jar for later steps
curl -s -c "$JAR" -X POST $B/login -H 'Content-Type: application/json' -d '{"email":"an@example.com","password":"correct horse battery"}' > /dev/null
cp "$JAR" "$JAR2"
curl -s -c "$JAR2" -X POST $B/login -H 'Content-Type: application/json' -d '{"email":"lan@example.com","password":"staple 42 river"}' > /dev/null
curl -s -b "$JAR2" $B/api/admin/users > out/admin-raw.tmp
{ echo "\$ curl -s -b admin-cookies.txt $B/api/admin/users"; cat out/admin-raw.tmp; echo; } > out/admin.out.txt
rm -f out/admin-raw.tmp
{
  echo "\$ curl -s -b cookies.txt $B/api/me"; curl -s -b "$JAR" $B/api/me; echo; echo
  echo "\$ curl -s -b cookies.txt -c cookies.txt -X POST $B/logout -i"; curl -s -i -b "$JAR" -X POST $B/logout | gon; echo
  echo "# the old cookie value, sent again by hand after logout:"
  echo "\$ curl -s -i $B/api/me -H 'Cookie: sid=(the old value)'"
  curl -s -i $B/api/me -H "Cookie: sid=$(awk '$6=="sid"{print $7}' "$JAR")" | gon; echo
} > out/logout.out.txt
{
  echo '$ cat cookies.txt   (curl'"'"'s cookie jar — what a browser keeps for this site)'
  grep -v '^# ' "$JAR" | grep -v '^$' | sed -E 's/sid\t[A-Za-z0-9_-]{20,}/sid\t(43 random characters)/'
} > out/jar.out.txt

sleep 0.3
kill "$SPID"; wait "$SPID" 2>/dev/null
{ echo '$ node app.mjs   (its log for the session steps — note which requests carried a cookie)'; sed -E 's/sid=[A-Za-z0-9_-]{20,}/sid=…/g' "$LOG" | head -16; } > out/app-log.out.txt
rm -f "$LOG" "$JAR" "$JAR2" cookies.txt
echo ok
