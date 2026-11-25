#!/bin/sh
# tcr.sh "<lời commit>" — test && commit || revert (Kent Beck, 2018). Chạy ở gốc repo legacy-express, Node 14 (nvm use).
if npx jest --silent >/tmp/tcr.log 2>&1; then
  git commit -qam "$1" && echo "XANH ⇒ commit: $(git log --oneline -1)"
else
  git checkout -- lib routes && echo "ĐỎ ⇒ revert: $(grep -E '^Tests:' /tmp/tcr.log)"
fi
