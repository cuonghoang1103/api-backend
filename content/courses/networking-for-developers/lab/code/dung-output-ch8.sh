#!/bin/bash
# Chạy lại output Chương 8 (CDN & cache) trên lab cơ bản + "CDN thu nhỏ" (edge/origin nginx). Từ lab/:
#   bash code/dung-output-ch8.sh
set -e
cd "$(dirname "$0")/.."
C="docker compose -f moi-truong/compose.yml -p nfd"
$C up -d >/dev/null 2>&1; sleep 3
docker exec nfd-router tc qdisc del dev eth0 root 2>/dev/null || true
# nội dung gốc + nginx biên/origin
docker exec nfd-web bash -c 'mkdir -p /tmp/www/img; printf "LabFlow logo bytes v1\n" > /tmp/www/img/logo.txt; printf "LabFlow home v1\n" > /tmp/www/index.html; rm -rf /tmp/cache'
docker exec nfd-web bash -c '[ -f /tmp/nx.pid ] && nginx -c /lab/k/code/ch08/cdn.conf -s stop 2>/dev/null; sleep 1; nginx -c /lab/k/code/ch08/cdn.conf'; sleep 1.5

# 8.1 CDN hit/miss + hết hạn
./chay.sh client ch08/c81-hitmiss.sh
giu_do() { if [ "${DO_LAI:-0}" = 1 ] || [ ! -s "out/$(basename "$2" .sh).out.txt" ]; then ./chay.sh "$@"; else echo "· giữ out/$(basename "$2" .sh).out.txt"; fi; }
giu_do client ch08/c81-expire.sh
# 8.2 khoá cache
./chay.sh client ch08/c82-key.sh
# 8.3 proxy nuốt header
./chay.sh client ch08/c83-nuot.sh
# 8.4 giới hạn biên
./chay.sh client ch08/c84-limit.sh

docker exec nfd-web bash -c 'nginx -c /lab/k/code/ch08/cdn.conf -s stop 2>/dev/null' || true
echo "== Chương 8 xong =="
