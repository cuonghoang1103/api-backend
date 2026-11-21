#!/bin/bash
# chay: tay — Mốc 8: Node 22.23 node:sqlite, tệp CSDL trong thư mục tạm ⇒ _moc/out/m8.out.txt
set -u
cd "$(dirname "$0")"
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
T=$(mktemp -d)
{ echo "\$ node db.mjs recipes.db"; node --no-warnings db.mjs "$T/recipes.db"; } > ../out/m8.out.txt 2>&1
rm -rf "$T"
