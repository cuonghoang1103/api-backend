#!/bin/bash
# chay: tay — Mốc 7: m7/server.mjs (Node 22) + curl với hai "trình duyệt" (hai tệp cookie). Cổng 3472 phải trống.
# bash content/courses/web-foundations/_demo/_moc/m7/chay.sh  ⇒ _moc/out/m7.out.txt
set -u
cd "$(dirname "$0")"
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
node server.mjs > /dev/null 2>&1 &
SPID=$!
sleep 1
B=http://localhost:3472
T=$(mktemp -d)
AN="-b $T/an.txt -c $T/an.txt"
BINH="-b $T/binh.txt -c $T/binh.txt"
J="-H 'Content-Type: application/json'"
run() { echo "\$ $*" | sed "s#$T/##g"; eval "$@" | tr -d '\r' | grep -viE '^(date|connection|keep-alive|transfer-encoding|content-type):'; echo; echo; }
{
  run "curl -s -i -X POST $B/api/recipes $J -d '{\"name\":\"Bun cha\"}'"
  run "curl -s -X POST $B/api/register $J -d '{\"email\":\"an@example.com\",\"password\":\"short\"}'"
  run "curl -s -X POST $B/api/register $J -d '{\"email\":\"an@example.com\",\"password\":\"correct-horse-1\"}'"
  run "curl -s -X POST $B/api/register $J -d '{\"email\":\"binh@example.com\",\"password\":\"battery-staple-2\"}'"
  run "curl -s -i -X POST $B/api/login $J -d '{\"email\":\"an@example.com\",\"password\":\"wrong-pass\"}'"
  run "curl -s -i $AN -X POST $B/api/login $J -d '{\"email\":\"an@example.com\",\"password\":\"correct-horse-1\"}' | sed -E 's/sid=[0-9a-f]+/sid=<random>/'"
  run "curl -s $AN $B/api/me"
  run "curl -s $AN -X POST $B/api/recipes $J -d '{\"name\":\"Bun cha\",\"ownerId\":999}'"
  run "curl -s $BINH -X POST $B/api/login $J -d '{\"email\":\"binh@example.com\",\"password\":\"battery-staple-2\"}'"
  run "curl -s -i $BINH -X DELETE $B/api/recipes/2"
  run "curl -s -i $AN -X DELETE $B/api/recipes/2"
  run "curl -s -i $AN -X POST $B/api/logout"
  run "curl -s $AN $B/api/me"
} > ../out/m7.out.txt
kill $SPID; rm -rf "$T"
