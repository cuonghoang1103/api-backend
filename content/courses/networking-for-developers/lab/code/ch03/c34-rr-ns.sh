# Ch3 · 3.4 — trên ns1: app.labflow.test có HAI bản ghi A (DNS round robin) — nhưng máy .12 đã tắt mà chưa ai gỡ bản ghi
printf 'app        30  IN A    203.0.113.10\napp        30  IN A    203.0.113.12\n' >> /dnsz/src/labflow.test.zone
sed -i 's/2026110101 3600/2026110106 3600/' /dnsz/src/labflow.test.zone
bash /lab/k/moi-truong/dns/ky.sh labflow.test && rndc reload labflow.test
