#!/usr/bin/env bash
# Bài 9.4 — tự làm một CA nội bộ + chứng chỉ máy chủ cho lab (KHÔNG dùng cho production: ở đó dùng CA của công ty / Let's Encrypt / Atlas).
#   bash tao-chung-chi.sh     ⇒ ca.pem (công khai, phát cho client), may-chu.pem (khoá + chứng chỉ máy chủ, GIỮ KÍN)
set -euo pipefail
cd "$(dirname "$0")"
openssl req -x509 -newkey rsa:2048 -nodes -days 30 -subj "/CN=CT Shop Lab CA" -keyout ca.key -out ca.pem 2>/dev/null
openssl req -newkey rsa:2048 -nodes -subj "/CN=mgo-tls" -keyout may-chu.key -out may-chu.csr 2>/dev/null
printf 'subjectAltName=DNS:localhost,DNS:mgo-tls,IP:127.0.0.1\n' > san.ext
openssl x509 -req -in may-chu.csr -CA ca.pem -CAkey ca.key -CAcreateserial -days 30 -extfile san.ext -out may-chu.crt 2>/dev/null
cat may-chu.key may-chu.crt > may-chu.pem
chmod 644 may-chu.pem ca.pem        # lab: container chạy mongod bằng user khác cần đọc được; production: chỉ user mongodb đọc (600)
rm -f may-chu.csr san.ext ca.srl
openssl x509 -in may-chu.crt -noout -subject -issuer -ext subjectAltName
