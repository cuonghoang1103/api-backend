#!/bin/bash
# Chạy lại TOÀN BỘ output Chương 5 (UDP và QUIC) trên lab cơ bản compose.yml (project nfd). Từ thư mục lab/:
#   bash code/dung-output-ch5.sh     (DO_LAI=1 để đo lại các phép đo đã trích)
set -e
cd "$(dirname "$0")/.."
giu_do() { if [ "${DO_LAI:-0}" = 1 ] || [ ! -s "out/$(basename "$2" .sh).out.txt" ]; then ./chay.sh "$@"; else echo "· giữ out/$(basename "$2" .sh).out.txt"; fi; }
C="docker compose -f moi-truong/compose.yml -p nfd"
R="docker exec nfd-router"
netem() { $R tc qdisc del dev eth0 root 2>/dev/null || true; if [ -n "$1" ]; then $R tc qdisc add dev eth0 root netem $1; fi; return 0; }
$C up -d >/dev/null 2>&1; sleep 3
netem ""

# máy chủ UDP echo trên web
docker exec nfd-web pkill -f udp-srv 2>/dev/null || true
docker exec -d nfd-web node /lab/k/code/ch05/udp-srv.mjs; sleep 1

# 5.1 UDP
docker exec -d nfd-client sh -c "tcpdump -i eth0 -n -U -w /tmp/c51.pcap 'udp port 9999' >/dev/null 2>&1"; sleep 2
./chay.sh client ch05/c51-echo.sh
sleep 1; docker exec nfd-client pkill -INT tcpdump; sleep 2
./chay.sh client ch05/c51-wire.sh
# mất gói ở CHIỀU client→server: đặt netem trên cổng ra của chính client; khởi động lại máy chủ để bộ đếm về 0
docker exec nfd-web pkill -f udp-srv 2>/dev/null || true; docker exec -d nfd-web node /lab/k/code/ch05/udp-srv.mjs; sleep 1
docker exec nfd-client tc qdisc add dev eth0 root netem loss 30% 2>/dev/null || true
giu_do client ch05/c51-loss.sh
docker exec nfd-client tc qdisc del dev eth0 root 2>/dev/null || true
# giữ 1 TCP mở; c51-noconn chạy trên WEB (nơi máy chủ UDP 9999 nghe)
docker exec -d nfd-client bash -c 'exec 3<>/dev/tcp/10.10.2.10/80; sleep 20'; sleep 1
./chay.sh web ch05/c51-noconn.sh

# 5.2 QUIC — phía máy chủ thật + khám phá Alt-Svc trên Internet thật
# dựng nginx HTTP/3 trên web (cổng 8443), chứng chỉ tự ký
docker exec nfd-web bash -c 'openssl req -x509 -newkey rsa:2048 -keyout /tmp/k.pem -out /tmp/c.pem -days 2 -nodes -subj "/CN=labflow.test" 2>/dev/null'
docker exec nfd-web nginx -c /lab/k/code/ch05/h3.conf 2>/dev/null || true; sleep 1
./chay.sh web ch05/c52-server.sh
giu_do internet ch05/c52-altsvc.sh

# 5.3 UDP ngoài đời — chặn UDP 8443, dịch vụ lùi về TCP
./chay.sh web ch05/c53-block.sh

# dọn
docker exec nfd-web bash -c 'nginx -c /lab/k/code/ch05/h3.conf -s stop 2>/dev/null' || true
docker exec nfd-web pkill -f udp-srv 2>/dev/null || true
echo "== Chương 5 xong =="
