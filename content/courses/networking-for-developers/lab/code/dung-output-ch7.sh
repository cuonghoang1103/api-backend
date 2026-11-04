#!/bin/bash
# Chạy lại TOÀN BỘ output Chương 7 (HTTP/1.1→3) trên lab cơ bản + nginx TLS h2/h3 + 2 proxy + máy chủ chunked. Từ lab/:
#   bash code/dung-output-ch7.sh
set -e
cd "$(dirname "$0")/.."
C="docker compose -f moi-truong/compose.yml -p nfd"
$C up -d >/dev/null 2>&1; sleep 3
docker exec nfd-router tc qdisc del dev eth0 root 2>/dev/null || true

# chứng chỉ + tệp tĩnh (cho ETag) + nginx h2/h3 trên web:8443
docker exec nfd-web bash -c 'openssl req -x509 -newkey rsa:2048 -keyout /tmp/c.key -out /tmp/c.pem -days 2 -nodes -subj "/CN=labflow.test" 2>/dev/null; mkdir -p /tmp/www; printf "LabFlow static page for caching demo\n" > /tmp/www/index.txt'
docker exec nfd-web bash -c '[ -f /tmp/nx.pid ] && nginx -c /lab/k/code/ch07/h7.conf -s stop 2>/dev/null; sleep 1; nginx -c /lab/k/code/ch07/h7.conf'; sleep 1.5
# máy chủ chunked trên api:4100 + 2 proxy (api:8091, web:8090) cho chuỗi X-Forwarded-For
docker exec -d nfd-api node /lab/k/code/ch07/chunk-srv.mjs; sleep 1
docker exec -d nfd-api nginx -c /lab/k/code/ch07/proxy-api.conf; sleep 0.5
docker exec -d nfd-web nginx -c /lab/k/code/ch07/proxy-web.conf; sleep 1

# 7.1 HTTP/1.1
./chay.sh client ch07/c71-raw.sh
./chay.sh client ch07/c71-keepalive.sh
./chay.sh client ch07/c71-chunked.sh

# 7.2 HTTP/2 — bắt một phiên h2 ba yêu cầu để thấy ghép kênh (giải mã bằng khoá phiên)
./chay.sh client ch07/c72-alpn.sh
docker exec -d nfd-client sh -c "tcpdump -i eth0 -n -U -w /tmp/c72.pcap 'tcp port 8443' >/dev/null 2>&1"; sleep 2
docker exec nfd-client bash -c 'SSLKEYLOGFILE=/tmp/c72keys.log curl -sk --http2 -o /dev/null https://10.10.2.10:8443/ https://10.10.2.10:8443/ https://10.10.2.10:8443/'; sleep 1
docker exec nfd-client pkill -INT tcpdump; sleep 2
./chay.sh client ch07/c72-mux.sh

# 7.3 HTTP/3
./chay.sh web ch07/c73-server.sh
./chay.sh internet ch07/c73-altsvc.sh

# 7.4 header
./chay.sh client ch07/c74-cache.sh
./chay.sh client ch07/c74-gzip.sh
./chay.sh client ch07/c74-cors.sh

# 7.5 proxy / X-Forwarded-For
./chay.sh client ch07/c75-xff.sh
./chay.sh client ch07/c75-chain.sh

docker exec nfd-web bash -c 'nginx -c /tmp/h7.conf -s stop 2>/dev/null' || true
docker exec nfd-web bash -c 'nginx -c /lab/k/code/ch07/proxy-web.conf -s stop 2>/dev/null' || true
docker exec nfd-api bash -c 'nginx -c /lab/k/code/ch07/proxy-api.conf -s stop 2>/dev/null' || true
docker exec nfd-api pkill -f chunk-srv 2>/dev/null || true
echo "== Chương 7 xong =="
