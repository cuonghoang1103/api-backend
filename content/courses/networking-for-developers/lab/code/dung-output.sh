#!/bin/bash
# Chạy lại TOÀN BỘ output của Mục 0 + Chương 1 theo đúng thứ tự (vài kịch bản cần nhiều máy). Từ thư mục lab/:
#   bash code/dung-output.sh
set -e
cd "$(dirname "$0")/.."
# Phép ĐO mạng thật (thời gian, tốc độ) có số được TRÍCH trong lời bài — chạy lại sẽ ra số khác và làm lời bài sai.
# Mặc định GIỮ output đo đã trích; muốn đo lại thì DO_LAI=1 bash code/dung-output.sh rồi SỬA lời bài theo số mới.
giu_do() { if [ "${DO_LAI:-0}" = 1 ] || [ ! -s "out/$(basename "$2" .sh).out.txt" ]; then ./chay.sh "$@"; else echo "· giữ out/$(basename "$2" .sh).out.txt (phép đo đã trích — DO_LAI=1 để đo lại)"; fi; }
C="docker compose -f moi-truong/compose.yml -p nfd"
$C down >/dev/null 2>&1 || true
$C up -d >/dev/null 2>&1; sleep 3
giu_do internet ch00/c00-internet.sh
./chay.sh client ch00/c00-lab.sh
./chay.sh client ch00/c00-loi.sh
giu_do client ch00/c00-url-lab.sh
python3 chay-host.py code/ch00/c00-host.sh c00-host
docker exec -d nfd-web iperf3 -s -1 >/dev/null; sleep 1
docker exec nfd-web pkill iperf3 || true; docker exec -d nfd-web iperf3 -s >/dev/null; sleep 1
giu_do client ch01/c10-bit-byte.sh
docker exec nfd-web pkill iperf3 || true
./chay.sh client ch01/c11-tang.sh
./chay.sh client ch01/c12-goi.sh
./chay.sh client ch01/c12-big-on.sh
./chay.sh web ch01/c12-tso-web.sh
./chay.sh client ch01/c12-big-off.sh
./chay.sh client ch01/c13-arp.sh
./chay.sh client ch01/c13-q-in.sh
# 1.4: cùng một request bắt ở HAI phía router (client và web) ⇒ MAC đổi, IP giữ nguyên, TTL −1
docker exec -d nfd-web sh -c "tcpdump -i eth0 -n -U -w /tmp/h.pcap 'tcp port 80' >/dev/null 2>&1"; sleep 1
./chay.sh client ch01/c13-hop-client.sh
docker exec nfd-web pkill -INT tcpdump; sleep 1
./chay.sh web ch01/c13-hop-web.sh
# bảng MAC của switch ảo: container rời trong không gian mạng của máy ảo Docker (--net host), chỉ đọc
BR="br-$(docker network inspect nfd-lan -f '{{.Id}}' | cut -c1-12)"
docker run --rm --label netlab=1 --net host -e BR="$BR" -v "$PWD":/lab/k:ro -w /lab/k/code/ch01 net-lab bash -c "phien c13-switch.sh 2>&1" > out/c13-switch.out.txt; echo "✓ out/c13-switch.out.txt"
# 1.5: client giữ 2 kết nối, client2 giữ 1 (bash /dev/tcp mở socket rồi ngủ)
docker exec -d nfd-client bash -c 'exec 3<>/dev/tcp/10.10.2.10/80; sleep 20'
docker exec -d nfd-client bash -c 'exec 3<>/dev/tcp/10.10.2.10/80; sleep 20'
docker exec -d nfd-client2 bash -c 'exec 3<>/dev/tcp/10.10.2.10/80; sleep 20'
sleep 1
./chay.sh web ch01/c14-web.sh
./chay.sh client ch01/c14-client.sh
./chay.sh api ch01/c14-bind-api.sh
docker exec -d nfd-api node -e "require('net').createServer(s=>s.end('hi from 127.0.0.1:4000\n')).listen(4000,'127.0.0.1')"
docker exec -d nfd-api node -e "require('net').createServer(s=>s.end('hi from 0.0.0.0:4001\n')).listen(4001,'0.0.0.0')"
sleep 1
./chay.sh client ch01/c14-bind-client.sh
# Lab chương 1 (lời giải): R5 bắt ở máy api trong lúc client gọi; R6 lần lượt api → client → api(sửa) → client; R1 bản đồ
docker exec -d nfd-api sh -c "tcpdump -i eth0 -n -U -w /tmp/r5.pcap 'tcp port 3000' >/dev/null 2>&1"; sleep 1.5
./chay.sh client ch01/lab1/r5-client.sh lab1-r5-client; sleep 0.5; docker exec nfd-api pkill -INT tcpdump; sleep 1
./chay.sh api ch01/lab1/r5-api.sh lab1-r5-api
./chay.sh api ch01/lab1/r6-api.sh lab1-r6-api; ./chay.sh client ch01/lab1/r6-client.sh lab1-r6-client
./chay.sh api ch01/lab1/r6-api-fix.sh lab1-r6-api-fix; ./chay.sh client ch01/lab1/r6-client-fix.sh lab1-r6-client-fix
docker exec nfd-api pkill -f 'listen.4999' || true
./chay.sh router ch01/lab1/r1-map.sh lab1-r1-router
# 1.4 phần "cache ARP cũ" để CUỐI: nó cố ý làm hỏng client2
./chay.sh client ch01/c13-stale-1.sh
./chay.sh client2 ch01/c13-stale-doi.sh
./chay.sh client ch01/c13-stale-2.sh
./chay.sh client2 ch01/c13-stale-garp.sh
./chay.sh client ch01/c13-stale-3.sh
./chay.sh client2 ch01/c13-stale-doi2.sh
sleep 50   # quá base_reachable_time (30 s, ngẫu nhiên 15–45 s): mục ARP của client chuyển sang STALE
giu_do client ch01/c13-stale-cho.sh
$C down >/dev/null 2>&1
echo "xong — docker ps -a --filter label=netlab=1 phải rỗng:"; docker ps -aq --filter label=netlab=1 | wc -l
