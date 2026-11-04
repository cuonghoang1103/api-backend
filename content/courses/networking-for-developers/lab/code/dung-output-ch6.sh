#!/bin/bash
# Chạy lại TOÀN BỘ output Chương 6 (TLS/HTTPS) trên lab cơ bản (project nfd) + một nginx TLS swap chứng chỉ. Từ thư mục lab/:
#   bash code/dung-output-ch6.sh
set -e
cd "$(dirname "$0")/.."
C="docker compose -f moi-truong/compose.yml -p nfd"
$C up -d >/dev/null 2>&1; sleep 3
docker exec nfd-router tc qdisc del dev eth0 root 2>/dev/null || true

# dựng CA + chứng chỉ; đưa root + bundle sang client để kiểm chứng
docker exec nfd-web bash /lab/k/code/ch06/setup-ca.sh >/dev/null
docker cp nfd-web:/tmp/ca/root.crt /tmp/root.crt;   docker cp /tmp/root.crt   nfd-client:/tmp/root.crt
docker cp nfd-web:/tmp/ca/bundle.crt /tmp/bundle.crt; docker cp /tmp/bundle.crt nfd-client:/tmp/bundle.crt

tlsconf() {  # $1 = cert file (trong /tmp/ca)  $2 = key file
  docker exec nfd-web bash -c "cat > /tmp/s.conf <<CONF
pid /tmp/nx.pid;
worker_processes 1; events { worker_connections 64; }
http { access_log off; server { listen 8443 ssl; http2 on; ssl_certificate /tmp/ca/$1; ssl_certificate_key /tmp/ca/$2; ssl_protocols TLSv1.2 TLSv1.3; server_name labflow.test;
  location / { default_type text/plain; return 200 'LabFlow over HTTPS\n'; } } }
CONF"
}
tls_start() { tlsconf "$1" "$2"; docker exec nfd-web bash -c '[ -f /tmp/nx.pid ] && nginx -c /tmp/s.conf -s stop 2>/dev/null; sleep 1; nginx -c /tmp/s.conf'; sleep 1.5; }
tls_reload() { tlsconf "$1" "$2"; docker exec nfd-web nginx -c /tmp/s.conf -s reload 2>/dev/null; sleep 1.5; }
cap() {  # $1 tên pcap trên client, $2 lệnh chạy trên client (sinh lưu lượng)
  docker exec -d nfd-client sh -c "tcpdump -i eth0 -n -U -w /tmp/$1.pcap 'tcp port 8443' >/dev/null 2>&1"; sleep 2
  docker exec nfd-client bash -c "$2"; sleep 1
  docker exec nfd-client pkill -INT tcpdump; sleep 2
}

# 6.1 TLS là gì
tls_start fullchain.crt leaf.key
./chay.sh client ch06/c61-version.sh
cap c61 'echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test 2>/dev/null >/dev/null'
./chay.sh client ch06/c61-wire.sh

# 6.2 bắt tay TLS 1.3
./chay.sh client ch06/c62-hand.sh
cap c62 'SSLKEYLOGFILE=/tmp/keys.log curl -sk --http1.1 --resolve labflow.test:8443:10.10.2.10 -o /dev/null https://labflow.test:8443/'
./chay.sh client ch06/c62-sni.sh
./chay.sh client ch06/c62-decrypt.sh
./chay.sh client ch06/c62-resume.sh

# 6.3 chứng chỉ, chuỗi, CA
tls_reload fullchain.crt leaf.key
./chay.sh client ch06/c63-chain.sh
./chay.sh client ch06/c63-read.sh
tls_reload leaf.crt leaf.key          # chỉ gửi lá, thiếu trung gian
./chay.sh client ch06/c63-missing.sh

# 6.4 chẩn đoán lỗi TLS — mỗi chứng chỉ hỏng một kiểu
tls_reload expired-chain.crt leaf.key;  ./chay.sh client ch06/c64-loi.sh c64-expired
tls_reload wrong-chain.crt wrong.key;   ./chay.sh client ch06/c64-loi.sh c64-name
tls_reload selfsigned.crt leaf.key;     ./chay.sh client ch06/c64-loi.sh c64-selfsigned
tls_reload notyet-chain.crt leaf.key;   ./chay.sh client ch06/c64-loi.sh c64-notyet

docker exec nfd-web bash -c 'nginx -c /tmp/s.conf -s stop 2>/dev/null' || true
echo "== Chương 6 xong =="
