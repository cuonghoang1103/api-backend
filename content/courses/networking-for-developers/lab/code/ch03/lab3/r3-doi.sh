# Lab 3 · R3 — bước 3 trên ns1: SAU khi chờ hết TTL cũ (120 s), mới đổi IP sang máy biên Singapore .11
date +%T
sed -i -e 's/^api        10  IN A    203.0.113.10/api        10  IN A    203.0.113.11/' -e 's/2026110103 3600/2026110104 3600/' /dnsz/src/labflow.test.zone
bash /lab/k/moi-truong/dns/ky.sh labflow.test && rndc reload labflow.test
