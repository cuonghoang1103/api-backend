#!/bin/bash
# Chạy lại output Chương 11 (công cụ & chẩn đoán): tcpdump/tshark trên client, curl -w/ping/mtr/iperf3, bảng kiểm theo tầng
# (+ một điểm cuối TLS tự ký trên web:8443 cho openssl). Từ lab/:  bash code/dung-output-ch11.sh
set -e
cd "$(dirname "$0")/.."
C="docker compose -f moi-truong/compose.yml -p nfd"
$C up -d >/dev/null 2>&1; sleep 3
docker exec nfd-router tc qdisc del dev eth0 root 2>/dev/null || true

# điểm cuối TLS tự ký trên web:8443 (cho tầng TLS của bảng kiểm) + iperf3 server trên api
docker exec nfd-web bash -c 'openssl req -x509 -newkey rsa:2048 -keyout /tmp/c11.key -out /tmp/c11.pem -days 2 -nodes -subj "/CN=labflow.test" 2>/dev/null; [ -f /tmp/tls.pid ] && nginx -c /lab/k/code/ch11/tls.conf -s stop 2>/dev/null; sleep 1; nginx -c /lab/k/code/ch11/tls.conf'
docker exec nfd-api pkill -x iperf3 2>/dev/null || true; sleep 0.5
docker exec -d nfd-api iperf3 -s
sleep 1

# 11.1 tcpdump (ghi /tmp/cap.pcap trên client) — 11.2 tshark đọc CHÍNH .pcap đó
./chay.sh client ch11/c111-tcpdump.sh
./chay.sh client ch11/c112-tshark.sh
# 11.3 đo đường (thêm 20ms trễ ở router để ping/mtr có số đo thật, rồi gỡ)
docker exec nfd-router tc qdisc add dev eth0 root netem delay 20ms 2>/dev/null || true
./chay.sh client ch11/c113-path.sh
docker exec nfd-router tc qdisc del dev eth0 root 2>/dev/null || true
# 11.4 bảng kiểm theo tầng
./chay.sh client ch11/c114-checklist.sh

docker exec nfd-web bash -c 'nginx -c /lab/k/code/ch11/tls.conf -s stop 2>/dev/null' || true
docker exec nfd-api pkill -x iperf3 2>/dev/null || true
echo "== Chương 11 xong =="
