#!/bin/bash
# Khoá Authentication — bật/tắt một máy chủ demo chạy NỀN trong môi trường sạch (env -i), theo dõi bằng PID của chính nó.
#   bash scripts/auth/nen.sh start <tên> <thư-mục-dự-án> <lệnh…>   # log: $AUTH_RUN/<tên>.log, PID: $AUTH_RUN/<tên>.pid
#   bash scripts/auth/nen.sh stop  <tên>
#   bash scripts/auth/nen.sh log   <tên>
# AUTH_RUN mặc định = /tmp/auth-run-$USER. Biến GIẢ cho máy chủ: AUTH_ENV="K=V …". Chỉ tắt đúng PID do lệnh start ghi lại
# (không pkill theo tên — có thể là tiến trình của phiên khác). Cổng của khoá: 48xx.
set -u
RUN=${AUTH_RUN:-/tmp/auth-run-$USER}; mkdir -p "$RUN"
NODE_BIN=${AUTH_NODE_BIN:-$HOME/.nvm/versions/node/v22.23.3/bin}
cmd=$1; ten=$2; shift 2
case "$cmd" in
  start)
    DU_AN=$(cd "$1" && pwd -P); shift
    if [ -f "$RUN/$ten.pid" ] && kill -0 "$(cat "$RUN/$ten.pid")" 2>/dev/null; then echo "đang chạy: $ten (PID $(cat "$RUN/$ten.pid"))"; exit 1; fi
    H=${AUTH_HOME:-$(mktemp -d)}
    ( cd "$DU_AN" && exec env -i PATH="$NODE_BIN:/usr/bin:/bin:/usr/sbin:/sbin" HOME="$H" LANG=en_US.UTF-8 TERM=dumb NO_COLOR=1 \
        TZ="${AUTH_TZ:-Asia/Ho_Chi_Minh}" ${AUTH_ENV:-} bash --noprofile --norc -c "exec $*" ) > "$RUN/$ten.log" 2>&1 &
    echo $! > "$RUN/$ten.pid"
    for _ in $(seq 1 50); do sleep 0.1; grep -q "http://\|listening\|ready" "$RUN/$ten.log" 2>/dev/null && break; done
    echo "▶ $ten PID $(cat "$RUN/$ten.pid") — $(head -1 "$RUN/$ten.log")" ;;
  stop)
    if [ -f "$RUN/$ten.pid" ]; then kill "$(cat "$RUN/$ten.pid")" 2>/dev/null && echo "■ $ten đã tắt"; rm -f "$RUN/$ten.pid"; else echo "không có $ten"; fi ;;
  log) cat "$RUN/$ten.log" ;;
esac
