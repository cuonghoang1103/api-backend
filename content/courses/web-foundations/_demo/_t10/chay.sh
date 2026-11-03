#!/bin/bash
# chay: tay — Chương 10: chạy lại mọi demo (Node 22.23, git, Chromium qua Playwright). Cổng 3460 phải trống.
# bash content/courses/web-foundations/_demo/_t10/chay.sh
set -u
cd "$(dirname "$0")"
NODE="$HOME/.nvm/versions/node/v22.23.3/bin/node"
export PATH="$(dirname "$NODE"):$PATH"
bash 10-1/chay.sh
bash 10-2/chay.sh && "$NODE" 10-2/chay.mjs
bash 10-3/chay.sh
bash 10-4/chay.sh
"$NODE" 10-5/chay.mjs
