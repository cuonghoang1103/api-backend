#!/bin/bash
# Lab 3 · Sự cố B (chạy trên nfi-ns) — ĐỪNG ĐỌC trước khi chẩn đoán xong.
# "Đổi khoá DNSSEC định kỳ": sinh KSK mới, cất KSK cũ đi, ký lại vùng — nhưng KHÔNG ai gửi DS mới cho nhà đăng ký.
mkdir -p /dnsz/keys/cu
for k in $(grep -l 'key-signing key' /dnsz/keys/Klabflow.test.+013+*.key); do mv "$k" "${k%.key}.private" /dnsz/keys/cu/; done
dnssec-keygen -q -K /dnsz/keys -a ECDSAP256SHA256 -n ZONE -f KSK labflow.test >/dev/null
awk '/IN SOA/ { for (i = 1; i <= NF; i++) if ($i ~ /^20[0-9]+$/) $i = $i + 1 } { print }' /dnsz/src/labflow.test.zone > /tmp/z && cat /tmp/z > /dnsz/src/labflow.test.zone
bash /lab/k/moi-truong/dns/ky.sh labflow.test && rndc reload labflow.test >/dev/null
