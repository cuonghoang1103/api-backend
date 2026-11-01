#!/bin/bash
# ops/dev-stack.sh — chạy cả bộ của Chương 12 trên MỘT máy để học: API A :4200, API B :4201, worker, proxy kiểm sức khoẻ :8180.
#   bash ops/dev-stack.sh start [ENV=… ENV=…]     (cần PostgreSQL ở DATABASE_URL đã migrate + seed, Redis ở LABFLOW_REDIS)
#   bash ops/dev-stack.sh stop
# Log: tmp/a.log, tmp/b.log, tmp/worker.log, tmp/proxy.log · PID: tmp/*.pid (dừng đúng tiến trình của mình, không giết theo cổng)
cd "$(dirname "$0")/.." || exit 1
mkdir -p tmp
stop() { for n in a b worker proxy; do [ -f tmp/$n.pid ] && kill "$(cat tmp/$n.pid)" 2>/dev/null; rm -f tmp/$n.pid; done; }
if [ "$1" = stop ]; then stop; echo "đã dừng"; exit 0; fi
[ "$1" = start ] || { echo "dùng: bash ops/dev-stack.sh start|stop [ENV=…]"; exit 1; }
shift; stop; sleep 0.5
: "${DATABASE_URL:?đặt DATABASE_URL=postgres://… trước}"
export LABFLOW_STORE=pg LABFLOW_REDIS="${LABFLOW_REDIS:-redis://localhost:6390}" LABFLOW_CACHE_MODE="${LABFLOW_CACHE_MODE:-singleflight}"
run() { local n=$1; shift; env "$@" > "tmp/$n.log" 2>&1 & echo $! > "tmp/$n.pid"; }
run a      "$@" PORT=4200 LABFLOW_INSTANCE=A node src/server.js
run b      "$@" PORT=4201 LABFLOW_INSTANCE=B node src/server.js
run worker "$@" WORKER_NAME=w1 PG_APP_NAME=labflow-worker node src/worker.js
run proxy  node perf/proxy-health.mjs 8180 4200 4201
sleep 2.5
tail -n 1 tmp/a.log tmp/b.log tmp/worker.log tmp/proxy.log
