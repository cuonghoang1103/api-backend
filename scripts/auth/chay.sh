#!/bin/bash
# Khoá Authentication — chạy THẬT một lệnh trong dự án LabFlow ID, trong MÔI TRƯỜNG SẠCH (env -i), và in output đúng như
# _ma.mjs cần:  "$ <lệnh>" · output (đường dẫn tuyệt đối của dự án → "…/<tên thư mục>", HOME tạm → "~") · "[exit N]".
#
#   bash scripts/auth/chay.sh <thư-mục-dự-án> <lệnh…>  > <scratch>/outN/<khoá-OUT>.txt
#
# VÌ SAO env -i: 01/11/2026 một agent khác làm lộ 2 token THẬT vì demo thừa hưởng biến môi trường của shell.
# Ở đây tiến trình con CHỈ thấy: PATH (Node 22 + hệ thống), HOME (thư mục tạm), LANG, TZ, NO_COLOR và các biến GIẢ
# truyền qua AUTH_ENV="K=V K2=V2" (bí mật demo — luôn là giá trị giả, có chữ "fake"/"demo").
#   AUTH_NODE_BIN  thư mục bin của Node (mặc định ~/.nvm/versions/node/v22.23.3/bin)
#   AUTH_HOME      HOME tạm (mặc định mktemp -d; dùng lại để npm cache ấm)
#   AUTH_TZ        múi giờ (mặc định Asia/Ho_Chi_Minh)
# Sau khi chụp: node scripts/auth/quet-bi-mat.mjs <thư-mục-out> (so với .env thật, không in giá trị).
set -u
DU_AN=$(cd "$1" && pwd -P); shift
NODE_BIN=${AUTH_NODE_BIN:-$HOME/.nvm/versions/node/v22.23.3/bin}
H=${AUTH_HOME:-$(mktemp -d)}
TEN=$(basename "$DU_AN")
echo "\$ $*"
( cd "$DU_AN" && env -i PATH="$NODE_BIN:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin" HOME="$H" LANG=en_US.UTF-8 \
    TERM=dumb NO_COLOR=1 FORCE_COLOR=0 TZ="${AUTH_TZ:-Asia/Ho_Chi_Minh}" ${AUTH_ENV:-} bash --noprofile --norc -c "$*" ) 2>&1 \
  | perl -pe "s#(file://)?(/private)?\Q${DU_AN#/private}\E#\${1}…/$TEN#g; s#(/private)?\Q${H#/private}\E#~#g"
echo "[exit ${PIPESTATUS[0]}]"
