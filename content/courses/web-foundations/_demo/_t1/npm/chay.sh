#!/bin/bash
# chay: tay — Bài 1.5: Node 22.23 + npm 10.9 THẬT trong thư mục tạm, cài từ registry npmjs.org (cần mạng) với cấu hình npm
# CÔ LẬP (npmrc rỗng, cache tạm — không đọc ~/.npmrc). Phiên bản ghim: dayjs@1.11.13, nodemon@3.1.4. Ghi out/*.out.txt.
set -u
cd "$(dirname "$0")"
HERE="$(pwd)"; OUT="$HERE/out"
ROOT="$(cd ../../../../../.. && pwd)"
NODEDIR="$HOME/.nvm/versions/node/v22.23.3/bin"
export PATH="$NODEDIR:/usr/bin:/bin"
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
: > "$T/npmrc"
export npm_config_userconfig="$T/npmrc" npm_config_cache="$T/cache" npm_config_update_notifier=false npm_config_fund=false
clean() { sed -E -e "s#/private$T/#/Users/lan/#g" -e "s#$T/#/Users/lan/#g" -e 's/in [0-9.]+m?s$/in …s/' -e 's/\(([0-9.]+)ms\)/(…ms)/' -e 's/duration_ms:? [0-9.]+/duration_ms …/' \
  -e 's#/Users/lan/cache/_logs/[^ ]*-debug-0.log#~/.npm/_logs/<time>-debug-0.log#' | grep -vE '^    at .*node:internal.*[^{]$' | cat -s; }
sh_() { echo "\$ $1"; eval "$1" 2>&1 | clean; }
mkdir "$T/shop" && cd "$T/shop"

{
sh_ "node -v"
sh_ "npm -v"
sh_ "node -e \"console.log(2 + 3, typeof window, typeof process)\""
cp "$HERE/index.js" .
} > "$OUT/node.out.txt"

{
sh_ "npm init -y"
} > "$OUT/init.out.txt"

{
sh_ "node index.js Lan"
echo
sh_ "npm install dayjs@1.11.13"
sh_ "node index.js Lan"
sh_ "ls node_modules"
sh_ "grep -A 3 '\"dependencies\"' package.json"
} > "$OUT/install.out.txt"

{
sh_ "npm install --save-dev nodemon@3.1.4"
sh_ "grep -A 5 '\"dependencies\"' package.json"
sh_ "ls node_modules | wc -l"
sh_ "du -sh node_modules"
sh_ "npm ls"
} > "$OUT/devdeps.out.txt"

{
sh_ "node -p \"const l = require('./package-lock.json').packages['node_modules/dayjs']; JSON.stringify({ version: l.version, resolved: l.resolved, integrity: l.integrity.slice(0, 20) + '…' }, null, 2)\""
echo
echo '# what does "^1.11.13" allow? (semver, the library npm itself uses)'
NODE_PATH="$ROOT/node_modules" sh_ "node -e \"const s = require('semver'); for (const v of ['1.11.13', '1.11.23', '1.12.0', '2.0.0', '1.11.12']) console.log(v.padEnd(8), '^1.11.13 →', s.satisfies(v, '^1.11.13'), '  ~1.11.13 →', s.satisfies(v, '~1.11.13'))\""
} > "$OUT/lock.out.txt"
# (semver is resolved from the repo's node_modules: NODE_PATH is set only for that one command)
sed -i '' 's#^\$ node -e "const s = require#$ node -e "const s = require#' "$OUT/lock.out.txt"

{
node -e "
const p = require('./package.json');
p.scripts = { start: 'node index.js', dev: 'nodemon index.js', test: 'node --test' };
require('fs').writeFileSync('package.json', JSON.stringify(p, null, 2) + '\n');"
cp "$HERE/index.test.js" .
sh_ "grep -A 4 '\"scripts\"' package.json"
sh_ "npm run"
sh_ "npm start -- Minh"
sh_ "npm test"
sh_ "npm run strat"
} > "$OUT/scripts.out.txt"

{
sh_ "rm -rf node_modules"
sh_ "node index.js"
sh_ "npm ci"
sh_ "node index.js"
} > "$OUT/ci.out.txt"
