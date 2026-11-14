#!/bin/bash
# dung-output-ch14.sh — chạy lại MỌI output Docker của bài 14.1–14.2 theo đúng thứ tự (≈1,5 phút) trên "Wi-Fi trường trong một hộp".
# Lệnh chạy trên CHÍNH máy Mac (c141-mac, c141-oui — code/ch14/chay-mac.sh, MAC thật bị che) KHÔNG chạy lại ở đây (GIỮ: máy khác ra số khác).
# Thứ tự là một câu chuyện: đăng ký MAC riêng → sang SSID khác bị chặn → tắt địa chỉ riêng → máy thứ hai cùng tài khoản → chép MAC →
# ARP giả mạo → (14.2) chặn DNS → chặn SNI → chặn IP/cổng/UDP → hotspot và TTL. Lab dựng mới từ đầu ⇒ số lease/IP lặp lại được.
set -e
cd "$(dirname "$0")/.."
M=moi-truong; X() { ./chay.sh "$@"; }
docker build -q -t net-lab-truong -f $M/Dockerfile.truong $M >/dev/null
docker compose -f $M/truong.yml -p nft down -v >/dev/null 2>&1 || true
docker compose -f $M/truong.yml -p nft up -d >/dev/null 2>&1; sleep 5
ipcua() { docker exec "$1" ip -4 -br addr show "$2" | awk '{print $3}' | cut -d/ -f1; }

# ── 14.1 ──
docker exec -d nft-gw bash -c 'timeout 25 tcpdump -U -c 4 -i dk0 -n -w /tmp/dora.pcap "udp port 67 or udp port 68"'; sleep 2
X nft-mac ch14/c141-dk.sh
for i in 1 2 3 4 5; do docker exec nft-gw test -s /tmp/dora.pcap && break; sleep 1; done; sleep 1
X nft-gw ch14/c141-dora.sh
X nft-mac ch14/c141-sv.sh
X nft-mac ch14/c141-tat.sh
X nft-win ch14/c141-win.sh
X nft-mac ch14/c141-mat.sh
X nft-gw ch14/c141-gw-sau.sh
X nft-ke ch14/c141-trung-ke.sh
X nft-win ch14/c141-trung-win.sh & X nft-ke ch14/c141-trung-tai-ke.sh &
docker run --rm --label netlab=1 --net host -v "$PWD":/lab/k:ro -w /lab/k/code/ch14 net-lab bash -c "phien c141-trung-fdb.sh 2>&1" > out/c141-trung-fdb.out.txt; echo "✓ out/c141-trung-fdb.out.txt"
wait
X nft-ke ch14/c141-arp-ke.sh
docker exec nft-win ip neigh flush dev sv; docker exec nft-win curl -s -m 3 -o /dev/null http://news.test/ || true
X nft-win ch14/c141-arp-truoc.sh
W=$(ipcua nft-win sv)
docker exec -d nft-ke bash -c 'timeout 14 tcpdump -U -Q in -i sv -n -w /tmp/nghe.pcap "tcp dst port 80 or tcp dst port 443"'
docker exec -d nft-ke bash -c "python3 /lab/k/moi-truong/truong/arp-gia.py sv 10.20.2.1 $W 12 > /tmp/arp.log 2>&1"; sleep 3
X nft-win ch14/c141-arp-nan.sh
sleep 11
X nft-ke ch14/c141-arp-doc.sh
docker exec nft-win ip neigh flush dev sv

# ── 14.2 ──
X nft-win ch14/c142-truoc.sh
X nft-gw ch14/c142-dns-gw.sh
X nft-win ch14/c142-dns.sh
X nft-gw ch14/c142-dns53-gw.sh
X nft-win ch14/c142-dns53.sh
X nft-gw ch14/c142-sni-gw.sh
docker exec -d nft-gw bash -c 'timeout 12 tcpdump -U -i sv0 -n -w /tmp/sni.pcap "tcp dst port 443"'; sleep 2
X nft-win ch14/c142-sni.sh
sleep 1
X nft-gw ch14/c142-sni-doc.sh
X nft-gw ch14/c142-cong-gw.sh
X nft-win ch14/c142-cong.sh
docker exec -d nft-gw bash -c 'timeout 20 tcpdump -U -c 2 -i sv0 -n -w /tmp/ttl.pcap "tcp[tcpflags] == tcp-syn and dst port 80"'; sleep 2
X nft-win ch14/c142-ttl-win.sh
X nft-phone ch14/c142-ttl-phone.sh
sleep 1
X nft-gw ch14/c142-ttl-gw.sh
X nft-phone ch14/c142-ttl-sau.sh c142-ttl-sau-phone
X nft-win ch14/c142-ttl-sau.sh c142-ttl-sau-win
X nft-gw ch14/c142-dem.sh
[ -n "${GIU_LAB:-}" ] || docker compose -f $M/truong.yml -p nft down -v >/dev/null 2>&1
echo "XONG ch14"
