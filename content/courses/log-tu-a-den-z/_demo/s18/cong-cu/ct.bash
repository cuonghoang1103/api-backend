#!/bin/bash
# ct.bash [xoa] — môi trường demo Chương 18: lgz-c18-loki (grafana/loki:3.7.10, KHÔNG mạng, 1 GB) + lgz-c03 (ảnh lgz-win-mau:1 = PowerShell 7 + jq + python3,
#   2 GB) dùng CHUNG netns của Loki ⇒ gọi Loki ở 127.0.0.1:3100 mà không tạo mạng docker nào. Chạy lệnh bằng _demo/s03/cong-cu/chay-mau.py (tên container lgz-c03).
#   Gắn chỉ đọc: /lab/su-co18 = bộ dữ liệu (~/.rtq-lgz/c18/sinh/su-co18, sinh bởi tao-su-co.py), /lab/s18 = _demo/s18. /lab/ra = tmpfs ghi tạm.
docker rm -f lgz-c03 lgz-c18-loki >/dev/null 2>&1
[ "$1" = xoa ] && { echo "đã xoá lgz-c03, lgz-c18-loki"; exit 0; }
D="$(cd "$(dirname "$0")/.." && pwd)"
docker run -d --name lgz-c18-loki --label lgz=1 --network none --memory 1g --memory-swap 1g --cpus 2 \
  -v "$D/mau/loki.yaml":/etc/loki/cfg.yaml:ro --tmpfs /loki:size=512m,uid=10001,gid=10001 grafana/loki:3.7.10 -config.file=/etc/loki/cfg.yaml >/dev/null
docker run -d --name lgz-c03 --label lgz=1 --network container:lgz-c18-loki --memory 2g --memory-swap 2g --cpus 2 -e TZ=UTC -e NO_COLOR=1 \
  -v ~/.rtq-lgz/c18/sinh/su-co18:/lab/su-co18:ro -v "$D":/lab/s18:ro --tmpfs /lab/ra:size=256m lgz-win-mau:1 sleep infinity >/dev/null
for i in $(seq 60); do docker exec lgz-c03 python3 -c "import urllib.request as u; print(u.urlopen('http://127.0.0.1:3100/ready').read().decode())" 2>/dev/null | grep -q ready && { echo "lgz-c18-loki + lgz-c03 sẵn sàng"; exit 0; }; sleep 2; done
echo "Loki chưa sẵn sàng sau 120 s"; docker logs --tail 20 lgz-c18-loki; exit 1
