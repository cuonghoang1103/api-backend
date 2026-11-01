# Ch3 · 3.5 — trên ns1: ký lại cho đúng (serial tăng tiếp)
sed -i 's/2026110107 3600/2026110108 3600/' /dnsz/src/labflow.test.zone
bash /lab/k/moi-truong/dns/ky.sh labflow.test && rndc reload labflow.test
