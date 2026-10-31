#!/bin/bash
# Khoá Testing — chạy THẬT một lệnh trong dự án LabFlow Lite và in output đúng như _ma.mjs cần:
#   "$ <lệnh>" · output (đường dẫn tuyệt đối của dự án → "…/<tên thư mục>") · "[exit N]"
# Dùng:  bash scripts/tst/chay.sh <thư-mục-dự-án> <lệnh…>  > <scratch>/out/<khoá-OUT>.txt
# Node 22 LTS (khoá chuẩn hoá trên 22.23.3): đặt TST_NODE_BIN=~/.nvm/versions/node/v22.23.3/bin nếu máy có nhiều bản.
# Vitest tắt watch khi thấy biến môi trường của agent (AI_AGENT, CLAUDECODE) — chụp watch mode thì unset chúng.
set -u
DU_AN=$(cd "$1" && pwd -P); shift
[ -n "${TST_NODE_BIN:-}" ] && export PATH="$TST_NODE_BIN:$PATH"
TEN=$(basename "$DU_AN")
echo "\$ $*"
( cd "$DU_AN" && bash -c "$*" ) 2>&1 | perl -pe "s#(file://)?(/private)?\Q${DU_AN#/private}\E#\${1}…/$TEN#g"
echo "[exit ${PIPESTATUS[0]}]"
