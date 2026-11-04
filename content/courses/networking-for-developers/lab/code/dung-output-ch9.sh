#!/bin/bash
# Chạy lại output Chương 9 (kết nối thời gian thực) trên lab cơ bản + máy chủ SSE/polling (:5100) + WebSocket thô (:5200).
# STUN (9.4) cần Internet thật ⇒ chạy trên máy "internet" (net-lab rời). Từ lab/:
#   bash code/dung-output-ch9.sh
set -e
cd "$(dirname "$0")/.."
C="docker compose -f moi-truong/compose.yml -p nfd"
$C up -d >/dev/null 2>&1; sleep 3
docker exec nfd-router tc qdisc del dev eth0 root 2>/dev/null || true

# máy chủ thời gian thực trên api:5100 (poll/longpoll/sse) + WebSocket thô trên api:5200
docker exec nfd-api pkill -f 'rt-srv\|ws-srv' 2>/dev/null || true; sleep 0.5
docker exec -d nfd-api node /lab/k/code/ch09/rt-srv.mjs
docker exec -d nfd-api node /lab/k/code/ch09/ws-srv.mjs
sleep 1.5

# 9.1 polling / long-polling / SSE
./chay.sh client ch09/c91-poll.sh
./chay.sh client ch09/c91-sse.sh
# 9.2 WebSocket
./chay.sh client ch09/c92-ws.sh
# 9.3 mở rộng
./chay.sh client ch09/c93-scale.sh
# 9.4 STUN (Internet thật) — UDP ra Internet đôi khi bị rớt; thử lại vài lần, giữ output cũ nếu vẫn hỏng
for a in 1 2 3 4 5; do
  ./chay.sh internet ch09/c94-stun.sh >/dev/null 2>&1 || true
  grep -q "XOR-MAPPED-ADDRESS" out/c94-stun.out.txt && { echo "✓ out/c94-stun.out.txt (STUN lần $a)"; break; }
  echo "· STUN timeout lần $a, thử lại"; sleep 2
done
grep -q "XOR-MAPPED-ADDRESS" out/c94-stun.out.txt || echo "⚠ STUN vẫn hỏng — mạng chặn UDP; giữ bản cũ / ghi CHAY-O-MAY"

docker exec nfd-api pkill -f 'rt-srv\|ws-srv' 2>/dev/null || true
echo "== Chương 9 xong =="
