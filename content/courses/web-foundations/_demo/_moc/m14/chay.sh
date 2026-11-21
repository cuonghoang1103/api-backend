#!/bin/bash
# chay: tay — Mốc 14: config fail-fast + smoke test chạy với máy chủ m6 (cổng 3471 phải trống) ⇒ _moc/out/m14.out.txt
set -u
cd "$(dirname "$0")"
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
node ../m6/server.mjs > /dev/null 2>&1 &
SPID=$!
sleep 1
FAKE="demo-$(printf 'x%.0s' {1..12})"
{
  echo "\$ node config.mjs"; env -u DATABASE_URL -u SESSION_SECRET node config.mjs; echo "exit code: $?"; echo
  echo "\$ DATABASE_URL=file:./prod.db SESSION_SECRET=<short> NODE_ENV=production node config.mjs"
  DATABASE_URL=file:./prod.db SESSION_SECRET=$FAKE NODE_ENV=production node config.mjs; echo "exit code: $?"; echo
  echo "\$ DATABASE_URL=file:./dev.db SESSION_SECRET=<anything> node config.mjs"
  DATABASE_URL=file:./dev.db SESSION_SECRET=$FAKE node config.mjs; echo "exit code: $?"; echo
  echo "\$ node smoke.mjs http://localhost:3471"; node smoke.mjs http://localhost:3471; echo "exit code: $?"
} > ../out/m14.out.txt 2>&1
kill $SPID
