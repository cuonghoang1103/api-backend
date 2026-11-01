# Ch3 · 3.2 — trên ns1: tăng serial (quy ước YYYYMMDDnn), ký lại, nạp lại ⇒ ns1 gửi NOTIFY, ns2 thấy serial lớn hơn và chép
sed -i 's/2026110101 3600 600 1209600 300/2026110102 3600 600 1209600 300/' /dnsz/src/labflow.test.zone
grep -E 'IN SOA' /dnsz/src/labflow.test.zone
bash /lab/k/moi-truong/dns/ky.sh labflow.test && rndc reload labflow.test
