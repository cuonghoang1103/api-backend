#!/bin/bash
# ct.bash [xoa] — container lgz-c03 cho demo Chương 3–5: ảnh lgz-win-mau:1, KHÔNG mạng, 2 GB RAM, bộ mẫu ~/.rtq-lgz/c03/evtx gắn chỉ đọc ở /lab/mau.
[ "$1" = xoa ] && { docker rm -f lgz-c03 >/dev/null 2>&1; echo "đã xoá lgz-c03"; exit 0; }
docker rm -f lgz-c03 >/dev/null 2>&1
docker run -d --name lgz-c03 --label lgz=1 --network none --memory 2g --memory-swap 2g --cpus 2 -e TZ=UTC \
  -v ~/.rtq-lgz/c03/evtx:/lab/mau:ro -v "$(cd "$(dirname "$0")/.." && pwd)/bin":/usr/local/lgz:ro -e PATH=/usr/local/lgz:/opt/microsoft/powershell/7:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin --tmpfs /lab/ra:size=512m lgz-win-mau:1 sleep infinity >/dev/null && echo "lgz-c03 chạy"
