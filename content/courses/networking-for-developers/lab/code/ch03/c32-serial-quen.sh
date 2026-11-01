# Ch3 · 3.2 — trên ns1: đổi api sang máy biên Singapore (.11) — nhưng QUÊN tăng serial
grep -E 'IN SOA|^api' /dnsz/src/labflow.test.zone
sed -i 's/^api       120  IN A    203.0.113.10/api       120  IN A    203.0.113.11/' /dnsz/src/labflow.test.zone
grep -E 'IN SOA|^api' /dnsz/src/labflow.test.zone
bash /lab/k/moi-truong/dns/ky.sh labflow.test && rndc reload labflow.test
