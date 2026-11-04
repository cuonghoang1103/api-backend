#!/bin/bash
# Chạy lại output Chương 13 (capstone): edge nginx có-thể-tinh-chỉnh (ch13/stack.conf) trước API — đo mỗi chặng, tối ưu
# (nén + cache) đo trước/sau, rồi làm hỏng có chủ đích (504/502/refused). Từ lab/:  bash code/dung-output-ch13.sh
set -e
cd "$(dirname "$0")/.."
C="docker compose -f moi-truong/compose.yml -p nfd"
$C up -d >/dev/null 2>&1; sleep 3
docker exec nfd-router tc qdisc del dev eth0 root 2>/dev/null || true

# tệp tĩnh lớn (nén tốt) + edge nginx
docker exec nfd-web bash -c 'mkdir -p /tmp/www; for i in $(seq 1 600); do echo "<p>LabFlow capstone line $i — the quick brown fox jumps over the lazy dog, repeatedly, to compress well.</p>"; done > /tmp/www/big.html; rm -rf /tmp/ccache'
docker exec nfd-web bash -c '[ -f /tmp/stack.pid ] && nginx -c /lab/k/code/ch13/stack.conf -s stop 2>/dev/null; sleep 1; nginx -c /lab/k/code/ch13/stack.conf'
sleep 1

# 13.1 stack chạy
./chay.sh client ch13/c131-stack.sh
# 13.2 đo mỗi chặng — thêm 20ms ở router để con số có nghĩa, rồi gỡ
docker exec nfd-router tc qdisc add dev eth0 root netem delay 20ms 2>/dev/null || true
./chay.sh client ch13/c132-measure.sh
docker exec nfd-router tc qdisc del dev eth0 root 2>/dev/null || true
# 13.3 tối ưu trước/sau — khởi động lại edge để cache SẠCH và nginx tự tạo thư mục cache (đúng quyền ghi)
docker exec nfd-web bash -c 'nginx -c /lab/k/code/ch13/stack.conf -s stop 2>/dev/null; sleep 1; rm -rf /tmp/ccache; nginx -c /lab/k/code/ch13/stack.conf'; sleep 1
./chay.sh client ch13/c133-toiuu.sh
# 13.4 làm hỏng + chẩn đoán
./chay.sh client ch13/c134-break.sh

docker exec nfd-web bash -c 'nginx -c /lab/k/code/ch13/stack.conf -s stop 2>/dev/null' || true
echo "== Chương 13 xong =="
