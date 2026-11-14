#!/bin/bash
# vps.sh — dựng máy chủ thuê "vps.example" (198.18.0.30) SAU KHI systemd đã lên (docker exec … bash vps.sh). Giống một VPS Ubuntu mới:
# ssh.socket bật sẵn (systemd giữ cổng 22), ảnh cloud để lại 50-cloud-init.conf "PasswordAuthentication yes", chủ máy thêm 01-no-password.
# sslh ở 443 còn nhận OpenVPN-TCP (14.4: VPN "trông như" một kết nối tới cổng 443) ⇒ 127.0.0.1:1194.
# Thêm: redis chỉ nghe 127.0.0.1 (một "CSDL" không bao giờ mở ra Internet — cho ssh -L), sslh ở 443 (SSH + HTTPS chung một cửa; tên
# ssh.vps.example trong TLS ⇒ chuyển vào sshd — cho phần "nếu 443 bị soi gói"), nginx 127.0.0.1:8443 làm "trang web của VPS".
set -e
echo 'nameserver 198.18.0.53' > /etc/resolv.conf
id sv >/dev/null 2>&1 || useradd -m -s /bin/bash sv
id tunnel >/dev/null 2>&1 || useradd -m -s /bin/bash tunnel
echo 'sv:123456' | chpasswd   # mật khẩu yếu CỐ Ý — để thấy vì sao phải tắt đăng nhập bằng mật khẩu
echo 'PasswordAuthentication yes' > /etc/ssh/sshd_config.d/50-cloud-init.conf
printf 'PasswordAuthentication no\nKbdInteractiveAuthentication no\nPermitRootLogin prohibit-password\n' > /etc/ssh/sshd_config.d/01-no-password.conf
# CSDL chỉ cho máy nội bộ
redis-server --bind 127.0.0.1 --port 6379 --daemonize yes --protected-mode yes --save '' >/dev/null
for i in 1 2 3 4 5; do redis-cli ping >/dev/null 2>&1 && break; sleep 0.5; done
redis-cli set diem:SE12345 "8.5 (du lieu tren VPS, chi nghe 127.0.0.1)" >/dev/null
# chứng chỉ cho vps.example + ssh.vps.example (CA của lab ở /ca, do nft-web tạo)
for i in $(seq 1 20); do [ -s /ca/ca.key ] && break; sleep 0.5; done
openssl req -newkey rsa:2048 -nodes -subj "/CN=vps.example" -keyout /etc/ssl/vps.key -out /tmp/vps.csr 2>/dev/null
printf "subjectAltName=DNS:vps.example,DNS:ssh.vps.example\n" > /tmp/vps.san
openssl x509 -req -in /tmp/vps.csr -CA /ca/ca.pem -CAkey /ca/ca.key -CAcreateserial -days 30 -extfile /tmp/vps.san -out /etc/ssl/vps.pem 2>/dev/null
cat > /etc/nginx/sites-enabled/default <<'NG'
server { listen 127.0.0.1:8443 ssl; ssl_certificate /etc/ssl/vps.pem; ssl_certificate_key /etc/ssl/vps.key;
  location / { default_type text/plain; return 200 "web cua VPS qua cong 443 (sslh -> nginx)\n"; } }
NG
nginx
# TLS ở 2443 mở ra thành SSH thường (SSH bọc trong TLS) — sslh chuyển tên ssh.vps.example vào đây
setsid socat OPENSSL-LISTEN:2443,bind=127.0.0.1,cert=/etc/ssl/vps.pem,key=/etc/ssl/vps.key,verify=0,fork,reuseaddr TCP:127.0.0.1:22 >/dev/null 2>&1 < /dev/null &
cat > /etc/sslh-lab.cfg <<'CFG'
foreground: false;
pidfile: "/run/sslh-lab.pid";
listen: ( { host: "0.0.0.0"; port: "443"; } );
protocols: (
  { name: "ssh"; host: "127.0.0.1"; port: "22"; },
  { name: "openvpn"; host: "127.0.0.1"; port: "1194"; },
  { name: "tls"; host: "127.0.0.1"; port: "2443"; sni_hostnames: [ "ssh.vps.example" ]; },
  { name: "tls"; host: "127.0.0.1"; port: "8443"; }
);
CFG
sslh -F /etc/sslh-lab.cfg 2>/dev/null
echo "vps.sh xong"
