#!/bin/bash
# chay: tay — Bài 8.5: chạy Prisma 5.22 (CLI của repo) trên SQLite trong thư mục TẠM; client sinh ra ở thư mục tạm, không đụng
# node_modules/.prisma của repo. bash content/courses/web-foundations/_demo/_t8/prisma/chay-prisma.sh
set -eu
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../../../../.." && pwd)"
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
cp "$HERE/schema.prisma" "$HERE/demo.mjs" "$HERE/check.ts" "$TMP/"
ln -s "$ROOT/node_modules" "$TMP/node_modules"
cd "$TMP"
{
  echo '$ npx prisma db push'
  "$ROOT/node_modules/.bin/prisma" db push --schema schema.prisma 2>&1 | perl -pe 's/\e\[[0-9;]*[A-Za-z]//g' | grep -vE '^\s*$|Prisma schema loaded|Datasource|update available|npm i|─|│|┌|└|Running generate\.\.\. -' | sed "s#$TMP#<project>#g"
} > "$HERE/../out/prisma-push.out.txt"
node demo.mjs > "$HERE/../out/prisma.out.txt" 2>&1
{
  echo '$ npx tsc --noEmit --strict check.ts'
  "$ROOT/node_modules/.bin/tsc" --noEmit --strict --target es2022 --module commonjs --moduleResolution node --skipLibCheck check.ts 2>&1 | sed "s#$TMP/##g"
} > "$HERE/../out/prisma-types.out.txt" || true
echo ok
