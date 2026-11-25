# 18.2 — Thu thập & bảo toàn: băm mọi tệp, kiểm toàn vẹn, phát hiện bản sao bị sửa; chuẩn hoá thời gian; đo lệch đồng hồ router; nạp vào Loki
cd su-co18 && find . -type f -print0 | sort -z | xargs -0 sha256sum > /lab/ra/SHA256SUMS && wc -l < /lab/ra/SHA256SUMS && grep -E 'auth\.log\.1|security\.jsonl' /lab/ra/SHA256SUMS
@ps (Get-FileHash -Algorithm SHA256 su-co18/vps01/var/log/auth.log.1).Hash.ToLower()
cd su-co18 && sha256sum -c --quiet /lab/ra/SHA256SUMS && echo "toàn vẹn: mọi tệp khớp"
cp -r su-co18 /lab/ra/ban-sao && sed -i 's/198\.51\.100\.77/198.51.100.78/' /lab/ra/ban-sao/vps01/var/log/nginx/access.log && cd /lab/ra/ban-sao && sha256sum -c --quiet /lab/ra/SHA256SUMS; echo "mã thoát: $?"
# Tám cách ghi giờ của CÙNG một đêm — đưa hết về UTC
cd su-co18 && grep -m1 'NOT in sudoers' vps01/var/log/auth.log.1 | cut -c1-32 && date -u -d "$(grep -m1 'NOT in sudoers' vps01/var/log/auth.log.1 | cut -d' ' -f1)" +%FT%TZ
cd su-co18 && grep -m1 'cache.php' vps01/var/log/nginx/access.log | grep -oE '\[[^]]+\]' && date -u -d '21 Nov 2026 23:06:02 +0700' +%FT%TZ
cd su-co18 && cut -c1-19 vps01/var/log/nginx/error.log && date -u -d "$(cut -c1-19 vps01/var/log/nginx/error.log | tr / -) +0700" +%FT%TZ
cd su-co18 && grep -m1 'NOT in sudoers' vps01/journal/vps01-journal.json | jq -r '.__REALTIME_TIMESTAMP | tonumber / 1e6 | floor | todate'
cd su-co18 && grep -m1 'level\\":40' vps01/var/lib/docker/containers/*/*-json.log | jq -r '.time, (.log | fromjson | .time), (.log | fromjson | .time / 1000 | floor | todate)'
cd su-co18 && grep -m1 'COPY' vps01/postgresql/log/postgresql-Sat.csv | cut -d, -f1
cd su-co18 && grep -m1 'DPT=445' rt01/logread.txt | cut -c1-24
cd su-co18 && grep -m1 '"Id":4740' pc-dev01/security.jsonl | jq -r .TimeCreated
python3 s18/mau/lech-dong-ho.py su-co18
# Nạp vào Loki (chuẩn hoá giờ khi nạp, router đã cộng 97 s) rồi hỏi bằng LogQL
python3 s18/mau/nap-loki.py su-co18 97
python3 s18/mau/logql.py 'sum by (nguon) (count_over_time({vu="su-co18"} |= "10.8.0.1" [1m]))' 2026-11-21T15:50:00Z 2026-11-21T16:05:00Z
python3 s18/mau/logql.py '{vu="su-co18"} |~ "(?i)b0a903430d8b" != "connecting to shim" != "shim disconnected"' 2026-11-21T15:00:00Z 2026-11-21T17:00:00Z 8
python3 s18/mau/logql.py 'sum by (may) (count_over_time({vu="su-co18"} |~ "203\\.0\\.113\\.5[0-2]|198\\.51\\.100\\.77" [1h]))' 2026-11-21T14:00:00Z 2026-11-22T00:00:00Z 30 3600
