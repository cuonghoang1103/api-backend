# Ch3 · 3.3 — trên ns1: HẠ TTL của api từ 120 xuống 10 giây (IP chưa đổi) — bước 1 của "hạ TTL trước khi chuyển máy chủ"
date +%T
sed -i -e 's/^api       120  IN A/api        10  IN A/' -e 's/2026110101 3600/2026110102 3600/' /dnsz/src/labflow.test.zone
grep -E '^api' /dnsz/src/labflow.test.zone
bash /lab/k/moi-truong/dns/ky.sh labflow.test && rndc reload labflow.test
