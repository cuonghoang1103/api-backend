#!/bin/bash
# Khoá TypeScript — chạy THẬT một lệnh trong dự án LabFlow TS, trong MÔI TRƯỜNG SẠCH (env -i), in output đúng như _ma.mjs cần:
#   "$ <lệnh>" · output (đường dẫn tuyệt đối của dự án → "…/<tên thư mục>") · "[exit N]"
# Dùng:  bash scripts/ts/chay.sh <thư-mục-dự-án> <lệnh…>  > <scratch>/out/<khoá-OUT>.txt
# Node chuẩn của khoá: 22.23.3 (đổi bằng TS_NODE_BIN). HOME = thư mục tạm (TS_HOME, mặc định <dự án>/../.home) — không lộ cấu hình máy.
set -u
DU_AN=$(cd "$1" && pwd -P); shift
NODE_BIN=${TS_NODE_BIN:-$HOME/.nvm/versions/node/v22.23.3/bin}
H=${TS_HOME:-$(dirname "$DU_AN")/.home}; mkdir -p "$H"
TEN=$(basename "$DU_AN")
echo "\$ $*"
( cd "$DU_AN" && env -i PATH="$NODE_BIN:/usr/bin:/bin" HOME="$H" LANG=en_US.UTF-8 TZ="${TZ:-UTC}" NO_COLOR=1 bash -c "$*" ) 2>&1 \
  | perl -pe "s#(file://)?(/private)?\Q${DU_AN#/private}\E#\${1}…/$TEN#g"
echo "[exit ${PIPESTATUS[0]}]"
