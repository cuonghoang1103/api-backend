#!/bin/bash
# Dựng một "nhà cấp chứng chỉ" (CA) tí hon cho lab TLS: gốc → trung gian → lá (labflow.test), cùng vài chứng chỉ HỎNG.
set -e; cd /tmp; rm -rf ca; mkdir ca; cd ca
mk() { openssl genrsa -out "$1.key" 2048 2>/dev/null; }
# CA gốc (tự ký)
mk root
openssl req -x509 -new -key root.key -sha256 -days 3650 -out root.crt -subj "/CN=LabFlow Root CA/O=LabFlow" \
  -addext "basicConstraints=critical,CA:TRUE" 2>/dev/null
# CA trung gian (gốc ký)
mk inter
openssl req -new -key inter.key -out inter.csr -subj "/CN=LabFlow Intermediate CA/O=LabFlow" 2>/dev/null
openssl x509 -req -in inter.csr -CA root.crt -CAkey root.key -CAcreateserial -days 1825 -sha256 -out inter.crt \
  -extfile <(printf 'basicConstraints=critical,CA:TRUE,pathlen:0\nkeyUsage=critical,keyCertSign,cRLSign') 2>/dev/null
# Lá labflow.test (trung gian ký) — chứng chỉ ĐÚNG
mk leaf
openssl req -new -key leaf.key -out leaf.csr -subj "/CN=labflow.test/O=LabFlow" 2>/dev/null
SANLEAF='subjectAltName=DNS:labflow.test,DNS:www.labflow.test\nkeyUsage=critical,digitalSignature\nextendedKeyUsage=serverAuth'
openssl x509 -req -in leaf.csr -CA inter.crt -CAkey inter.key -CAcreateserial -days 90 -sha256 -out leaf.crt \
  -extfile <(printf "$SANLEAF") 2>/dev/null
cat leaf.crt inter.crt > fullchain.crt
# HẾT HẠN: lá đã quá hạn (not_after trong quá khứ)
openssl x509 -req -in leaf.csr -CA inter.crt -CAkey inter.key -CAserial inter.srl -sha256 -out expired.crt \
  -not_before 20240101000000Z -not_after 20240201000000Z -extfile <(printf "$SANLEAF") 2>/dev/null
cat expired.crt inter.crt > expired-chain.crt
# SAI TÊN: chứng chỉ cho other.test, nhưng ta sẽ truy cập labflow.test
mk wrong; openssl req -new -key wrong.key -out wrong.csr -subj "/CN=other.test/O=LabFlow" 2>/dev/null
openssl x509 -req -in wrong.csr -CA inter.crt -CAkey inter.key -CAserial inter.srl -sha256 -out wrong.crt -days 90 \
  -extfile <(printf 'subjectAltName=DNS:other.test\nextendedKeyUsage=serverAuth') 2>/dev/null
cat wrong.crt inter.crt > wrong-chain.crt
# TỰ KÝ (không có CA nào)
openssl req -x509 -new -key leaf.key -sha256 -days 90 -out selfsigned.crt -subj "/CN=labflow.test/O=LabFlow" \
  -addext "$(printf 'subjectAltName=DNS:labflow.test')" 2>/dev/null
# CHƯA HIỆU LỰC: chứng chỉ bắt đầu trong tương lai (giống máy khách bị sai giờ tụt về quá khứ)
openssl x509 -req -in leaf.csr -CA inter.crt -CAkey inter.key -CAserial inter.srl -sha256 -out notyet.crt \
  -not_before 20400101000000Z -not_after 20400401000000Z -extfile <(printf "$SANLEAF") 2>/dev/null
cat notyet.crt inter.crt > notyet-chain.crt
# bó root+trung gian để client dựng được chuỗi khi máy chủ quên gửi trung gian
cat root.crt inter.crt > bundle.crt
echo "✓ CA + chứng chỉ dựng xong trong /tmp/ca:"; ls /tmp/ca/*.crt
