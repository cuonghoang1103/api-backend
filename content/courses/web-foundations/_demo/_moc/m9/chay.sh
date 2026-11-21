#!/bin/bash
# chay: tay — Mốc 9: tsc của repo (--strict) + Node 22.23 --experimental-strip-types ⇒ _moc/out/m9.out.txt
set -u
cd "$(dirname "$0")"
GOC=$(cd ../../../../../.. && pwd)
TSC="$GOC/node_modules/.bin/tsc"
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
OPT="--noEmit --strict --target es2022 --module nodenext --allowImportingTsExtensions --lib es2022"
{
  echo "\$ npx tsc $OPT types.ts api.ts"
  $TSC $OPT types.ts api.ts && echo "(no errors)"
  echo
  echo "\$ node --experimental-strip-types api.ts"
  node --no-warnings --experimental-strip-types api.ts
  echo
  echo "\$ npx tsc $OPT sai.ts"
  $TSC $OPT sai.ts | sed 's/^sai\.ts/sai.ts/'
} > ../out/m9.out.txt 2>&1
