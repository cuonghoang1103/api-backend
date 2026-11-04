#!/bin/bash
# Chạy lại output Chương 10 (cân bằng tải & proxy): 3 backend trên nfd-api (3001-3003), nginx LB L7 trên nfd-web (lb.conf),
# socat L4 trên nfd-web (:9090). Từ lab/:  bash code/dung-output-ch10.sh
set -e
cd "$(dirname "$0")/.."
C="docker compose -f moi-truong/compose.yml -p nfd"
$C up -d >/dev/null 2>&1; sleep 3
docker exec nfd-router tc qdisc del dev eth0 root 2>/dev/null || true

start_be() {   # dựng 3 backend (hoặc dựng lại sau khi health test giết be2)
  docker exec nfd-api pkill -f backend.mjs 2>/dev/null || true; sleep 1
  docker exec -d nfd-api node /lab/k/code/ch10/backend.mjs be1 3001
  docker exec -d nfd-api node /lab/k/code/ch10/backend.mjs be2 3002
  docker exec -d nfd-api node /lab/k/code/ch10/backend.mjs be3 3003
  sleep 1.5
}
start_be
# nginx LB L7 + socat L4 (:9090 → một backend be1)
docker exec nfd-web bash -c '[ -f /tmp/lb.pid ] && nginx -c /lab/k/code/ch10/lb.conf -s stop 2>/dev/null; sleep 1; nginx -c /lab/k/code/ch10/lb.conf'
docker exec nfd-web pkill -f 'socat TCP-LISTEN:9090' 2>/dev/null || true
docker exec -d nfd-web socat TCP-LISTEN:9090,fork,reuseaddr TCP:10.10.2.20:3001
sleep 1

# 10.1 round robin + L4/L7
./chay.sh client ch10/c101-rr.sh
./chay.sh client ch10/c101-l4l7.sh
# 10.2 consistent hash (cần đủ 3 backend) rồi health: chạy before, GIẾT be2 trên nfd-api, chạy after
./chay.sh client ch10/c102-hash.sh
./chay.sh client ch10/c102-health.sh c102-health-before
docker exec nfd-api pkill -f 'backend.mjs be2' 2>/dev/null || true; sleep 2
./chay.sh client ch10/c102-health.sh c102-health-after
start_be   # dựng lại be2 cho các lần chạy sau
# 10.3 tunnel (socat trên chính client)
./chay.sh client ch10/c103-tunnel.sh
# 10.4 mã lỗi cổng
./chay.sh client ch10/c104-codes.sh

docker exec nfd-web bash -c 'nginx -c /lab/k/code/ch10/lb.conf -s stop 2>/dev/null' || true
docker exec nfd-web pkill -f 'socat TCP-LISTEN:9090' 2>/dev/null || true
docker exec nfd-api pkill -f backend.mjs 2>/dev/null || true
echo "== Chương 10 xong =="
