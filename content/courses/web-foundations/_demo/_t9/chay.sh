#!/bin/bash
# chay: tay — Chương 9: TypeScript 5.9 (tsc của repo) + Node 22.23 (--experimental-strip-types). Ghi out/*.out.txt.
# bash content/courses/web-foundations/_demo/_t9/chay.sh
set -u
cd "$(dirname "$0")"
ROOT="$(cd ../../../../.. && pwd)"
TSC="$ROOT/node_modules/.bin/tsc"
NODE="$HOME/.nvm/versions/node/v22.23.3/bin/node"
mkdir -p out
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
# tsc trên MỘT tệp, bỏ qua tsconfig của repo; lib có DOM để dùng document
check() {  # check <tệp> [cờ thêm…]
  local f="$1"; shift
  echo "\$ npx tsc --noEmit --strict $(basename "$f")"
  "$TSC" --noEmit --strict --target es2022 --lib es2022,dom --module esnext --moduleResolution bundler --types node --skipLibCheck "$@" "$f" 2>&1 | sed "s#^$(dirname "$f")/##"
  echo "(exit code ${PIPESTATUS[0]})"
}
run() {  # run <tệp> — chạy bằng Node 22 (JS hoặc TS đã bóc kiểu)
  echo "\$ node $( [[ "$1" == *.ts ]] && echo '--experimental-strip-types ')$(basename "$1")"
  "$NODE" --no-warnings $( [[ "$1" == *.ts ]] && echo --experimental-strip-types ) "$1" 2>&1 | sed -E "s#file://[^ ]*/##; s#$(pwd)/##g" | grep -vE '^\s+at |^Node\.js v' | sed '/^$/N;/^\n$/D'
}
dts() {  # dts <tệp> — in kiểu mà TypeScript SUY RA (khai báo .d.ts)
  echo "\$ npx tsc --declaration --emitDeclarationOnly $(basename "$1")   (the types TypeScript inferred)"
  "$TSC" --declaration --emitDeclarationOnly --strict --target es2022 --lib es2022,dom --module esnext --moduleResolution bundler --types node --skipLibCheck --outDir "$TMP/d" "$1" >/dev/null 2>&1
  cat "$TMP/d/$(basename "${1%.ts}").d.ts"; rm -rf "$TMP/d"
}

# ── 9.1 ──
run 9-1/cart.js > out/cart-js.out.txt
check 9-1/cart.ts > out/cart-ts.out.txt
check 9-1/mistakes.ts > out/mistakes.out.txt
{
  echo "\$ npx tsc runtime.ts --outDir dist && cat dist/runtime.js   (what actually runs)"
  "$TSC" --strict --target es2022 --module esnext --types node --skipLibCheck --outDir "$TMP/dist" 9-1/runtime.ts >/dev/null 2>&1
  cat "$TMP/dist/runtime.js"
  echo
  run 9-1/runtime.ts
} > out/runtime.out.txt

# ── 9.2 ──
dts 9-2/infer.ts > out/infer.out.txt
check 9-2/basics.ts > out/basics.out.txt
{ check 9-2/any-unknown.ts; echo; run 9-2/any-run.ts; } > out/any-unknown.out.txt

# ── 9.3 ──
check 9-3/shapes.ts > out/shapes.out.txt
{ check 9-3/api-types.ts; echo; dts 9-3/api-types.ts; } > out/api-types.out.txt
{ check 9-3/kinds.ts; echo; run 9-3/kinds.ts; } > out/kinds.out.txt

# ── 9.4 ──
check 9-4/functions.ts > out/functions.out.txt
{ dts 9-4/generics.ts; echo; run 9-4/generics.ts; } > out/generics.out.txt
check 9-4/generics-errors.ts > out/generics-errors.out.txt

# ── 9.5 ──
{
  echo "\$ npx tsc --noEmit legacy.ts            (default settings: strict is off)"
  "$TSC" --noEmit --target es2022 --types node --skipLibCheck 9-5/legacy.ts 2>&1 | sed "s#^9-5/##"
  echo "(exit code ${PIPESTATUS[0]})"
  echo
  echo "\$ npx tsc --noEmit --strict legacy.ts"
  "$TSC" --noEmit --strict --target es2022 --types node --skipLibCheck 9-5/legacy.ts 2>&1 | sed "s#^9-5/##"
  echo "(exit code ${PIPESTATUS[0]})"
} > out/strict.out.txt
{
  echo '$ cat tsconfig.json'; cat 9-5/shop/tsconfig.json; echo
  echo '$ npx tsc -p .        (type-check and compile src/ → dist/)'
  "$TSC" -p 9-5/shop --outDir "$TMP/shop-dist" 2>&1; echo "(exit code $?)"
  echo '$ ls dist'; ls "$TMP/shop-dist"; echo
  echo '$ node dist/index.js'
  (cd "$TMP/shop-dist" && env -u DATABASE_URL "$NODE" index.js 2>&1 | grep -E '^Error|^Server' )
  echo '$ DATABASE_URL=postgres://localhost/shop PORT=8080 node dist/index.js'
  (cd "$TMP/shop-dist" && DATABASE_URL=postgres://localhost/shop PORT=8080 "$NODE" index.js 2>&1)
} > out/project.out.txt
{
  cp -R 9-5/shop "$TMP/shop2"
  sed -i '' 's/"types": \["node"\]/"types": []/' "$TMP/shop2/tsconfig.json"
  echo '$ npx tsc -p . --noEmit      (the same project with "types": [] — as if @types/node were not installed)'
  "$TSC" -p "$TMP/shop2" --noEmit 2>&1 | sed "s#^$TMP/shop2/##; s#^.*/shop2/##"
} > out/types-node.out.txt
{
  echo '$ node --experimental-strip-types enum.ts'
  run 9-5/enum.ts | sed -n '/^enum.ts:/,$p' | grep -vE "^  code:|^}$"
  echo
  echo '$ npx tsx enum.ts'
  "$ROOT/node_modules/.bin/tsx" 9-5/enum.ts 2>&1
} > out/enum.out.txt
{
  echo '$ npx tsx validate.ts'
  "$ROOT/node_modules/.bin/tsx" 9-5/validate.ts 2>&1
} > out/validate.out.txt
echo ok
