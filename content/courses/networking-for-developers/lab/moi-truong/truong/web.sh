#!/bin/bash
# web.sh — "Internet" của lab (198.18.0.10, thêm .20 = vpn.test): nginx HTTP/HTTPS cho mọi tên của lab, trò chơi UDP 27015 (echo),
# cổng TCP 22 và 993 (máy chủ SSH đáp lời chào), "VPN" UDP 51820 trên .20. Tạo CA của lab vào volume /ca (máy khách tin bằng --cacert).
ip route replace default via 198.18.0.1
ip addr add 198.18.0.20/24 dev net0
ip addr add 198.18.0.53/24 dev net0
# "DNS công cộng" kiểu 1.1.1.1 của lab (198.18.0.53): trả lời ĐÚNG mọi tên, kể cả tên trường chặn — để thấy chặn bằng DNS là đổi DNS là qua
dnsmasq --listen-address=198.18.0.53 --bind-interfaces --no-resolv --no-hosts --filter-AAAA --address=/test/198.18.0.10 --address=/vpn.test/198.18.0.20
if [ ! -s /ca/ca.pem ]; then
  openssl req -x509 -newkey rsa:2048 -nodes -days 30 -subj "/CN=Lab Root CA" -keyout /ca/ca.key -out /ca/ca.pem 2>/dev/null
fi
openssl req -newkey rsa:2048 -nodes -subj "/CN=news.test" -keyout /tmp/web.key -out /tmp/web.csr 2>/dev/null
printf "subjectAltName=DNS:news.test,DNS:social.test,DNS:game.test,DNS:phim.test,DNS:vpn.test,DNS:captive.apple.com,DNS:www.msftconnecttest.com\n" > /tmp/san
openssl x509 -req -in /tmp/web.csr -CA /ca/ca.pem -CAkey /ca/ca.key -CAcreateserial -days 30 -extfile /tmp/san -out /tmp/web.pem 2>/dev/null
mkdir -p /srv/www
printf '<HTML><HEAD><TITLE>Success</TITLE></HEAD><BODY>Success</BODY></HTML>' > /srv/www/hotspot-detect.html
printf 'Microsoft Connect Test' > /srv/www/connecttest.txt
head -c 50000000 /dev/urandom > /srv/www/big.bin   # tệp 50 MB cho phép đo hai máy cùng MAC
cat > /etc/nginx/sites-enabled/default <<'NG'
server {
  listen 80 default_server; listen 443 ssl default_server;
  ssl_certificate /tmp/web.pem; ssl_certificate_key /tmp/web.key;
  root /srv/www;
  location = / { default_type text/plain; return 200 "Internet OK: $host (ban den tu $remote_addr)\n"; }
  location = /connecttest.txt { default_type text/plain; }
  location / { default_type text/html; try_files $uri /hotspot-detect.html; }
}
NG
nginx
python3 /lab/k/moi-truong/truong/udp-tra-loi.py 198.18.0.10 27015 'game-server: pong' &
python3 /lab/k/moi-truong/truong/udp-tra-loi.py 198.18.0.20 51820 'vpn: handshake ok' &
socat TCP4-LISTEN:22,bind=198.18.0.10,fork,reuseaddr EXEC:'echo SSH-2.0-OpenSSH_lab' &
socat TCP4-LISTEN:993,bind=198.18.0.10,fork,reuseaddr EXEC:'echo SSH-2.0-OpenSSH_lab (port 993)' &
exec sleep infinity
