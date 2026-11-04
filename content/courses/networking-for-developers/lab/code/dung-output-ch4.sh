#!/bin/bash
# Chạy lại TOÀN BỘ output Chương 4 (TCP) trên lab cơ bản compose.yml (project nfd). Từ thư mục lab/:
#   bash code/dung-output-ch4.sh        (DO_LAI=1 để đo lại các phép đo thời gian/tốc độ đã trích)
set -e
cd "$(dirname "$0")/.."
giu_do() { if [ "${DO_LAI:-0}" = 1 ] || [ ! -s "out/$(basename "$2" .sh).out.txt" ]; then ./chay.sh "$@"; else echo "· giữ out/$(basename "$2" .sh).out.txt"; fi; }
C="docker compose -f moi-truong/compose.yml -p nfd"
R="docker exec nfd-router"
netem() { $R tc qdisc del dev eth0 root 2>/dev/null || true; if [ -n "$1" ]; then $R tc qdisc add dev eth0 root netem $1; fi; return 0; }
$C up -d >/dev/null 2>&1; sleep 3
docker exec nfd-web pkill iperf3 2>/dev/null || true; docker exec -d nfd-web iperf3 -s >/dev/null 2>&1; sleep 1

# 4.1 bắt tay + đóng: bắt gói MỘT curl ở client (trễ 25 ms để thấy RTT)
netem "delay 25ms"
docker exec -d nfd-client sh -c "tcpdump -i eth0 -n -U -w /tmp/c41.pcap 'tcp and host 10.10.2.10' >/dev/null 2>&1"; sleep 2
docker exec nfd-client curl -so /dev/null http://10.10.2.10/; sleep 1
docker exec nfd-client pkill -INT tcpdump; sleep 2
./chay.sh client ch04/c41-tay.sh
giu_do client ch04/c41-rtt.sh
netem ""
# cổng đóng ⇒ RST: bắt gói trong lúc gọi cổng 4999 (trống) của api
docker exec -d nfd-client sh -c "tcpdump -i eth0 -n -U -w /tmp/c41rst.pcap 'tcp and host 10.10.2.20 and port 4999' >/dev/null 2>&1"; sleep 2
./chay.sh client ch04/c41-reset.sh
sleep 1; docker exec nfd-client pkill -INT tcpdump; sleep 2
./chay.sh client ch04/c41-resetpcap.sh
# SYN vào hố đen: router DROP mọi gói tới 10.10.2.99 ⇒ SYN truyền lại theo hàm mũ rồi hết giờ (exit 28)
$R iptables -A FORWARD -d 10.10.2.99 -j DROP 2>/dev/null || true
docker exec -d nfd-client sh -c "tcpdump -i eth0 -n -U -w /tmp/c41syn.pcap 'tcp and host 10.10.2.99' >/dev/null 2>&1"; sleep 2
giu_do client ch04/c41-syn.sh
docker exec nfd-client pkill -INT tcpdump; sleep 2
$R iptables -D FORWARD -d 10.10.2.99 -j DROP 2>/dev/null || true
./chay.sh client ch04/c41-synpcap.sh

# 4.2 độ tin cậy
netem "delay 25ms"
docker exec -d nfd-client sh -c "tcpdump -i eth0 -n -U -w /tmp/c42.pcap 'tcp and host 10.10.2.10' >/dev/null 2>&1"; sleep 2
docker exec nfd-client curl -so /dev/null http://10.10.2.10/big; sleep 1
docker exec nfd-client pkill -INT tcpdump; sleep 2
./chay.sh client ch04/c42-seq.sh
netem "delay 25ms loss 3%"
giu_do client ch04/c42-loss.sh
# bắt một phiên iperf có mất gói để lọc truyền lại/SACK
docker exec -d nfd-client sh -c "tcpdump -i eth0 -n -U -w /tmp/c42loss.pcap 'tcp and host 10.10.2.10 and port 5201' >/dev/null 2>&1"; sleep 2
docker exec nfd-client iperf3 -c 10.10.2.10 -t 3 >/dev/null 2>&1 || true; sleep 1
docker exec nfd-client pkill -INT tcpdump; sleep 2
./chay.sh client ch04/c42-sack.sh

# 4.3 tắc nghẽn
netem "rate 20mbit delay 40ms"
giu_do client ch04/c43-win.sh
netem ""
./chay.sh client ch04/c43-cc.sh
# reno vs cubic: máy phụ có quyền trên nhánh LAN, đường qua router bị bóp
netem "rate 20mbit delay 80ms loss 1.5%"
if [ "${DO_LAI:-0}" = 1 ] || [ ! -s out/c43-race.out.txt ]; then
  docker run --rm --privileged --network nfd-lan --label netlab=1 -v "$PWD":/lab/k:ro -w /lab/k/code/ch04 net-lab bash -c "phien c43-race.sh 2>&1" > out/c43-race.out.txt
  echo "✓ out/c43-race.out.txt ($(wc -l < out/c43-race.out.txt) dòng)"
else echo "· giữ out/c43-race.out.txt"; fi
netem ""

# 4.4 trạng thái
docker exec -d nfd-client bash -c 'exec 3<>/dev/tcp/10.10.2.10/80; sleep 25' ; docker exec -d nfd-client bash -c 'exec 3<>/dev/tcp/10.10.2.10/80; sleep 25'; sleep 1
docker exec nfd-client bash -c 'for i in 1 2 3; do curl -so /dev/null http://10.10.2.10/; done'   # tạo vài TIME-WAIT
./chay.sh client ch04/c44-states.sh
giu_do client ch04/c44-timewait.sh
./chay.sh client ch04/c44-exhaust.sh
./chay.sh web ch04/c44-backlog.sh

# 4.5 keep-alive / pool / Nagle
netem "delay 25ms"
./chay.sh client ch04/c45-ka.sh
./chay.sh client ch04/c45-node.sh
netem "delay 25ms"
docker exec -d nfd-web node /lab/k/code/ch04/nagle-srv.mjs; sleep 1
./chay.sh client ch04/c45-nodelay.sh
docker exec nfd-web pkill -f nagle-srv 2>/dev/null || true
./chay.sh client ch04/c45-keepalive-opt.sh

docker exec nfd-web pkill iperf3 2>/dev/null || true
echo "== Chương 4 xong =="
