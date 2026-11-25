#!/bin/bash
# ct.bash [xoa] — container lgz-c03 cho demo Chương 14 (chạy bằng _demo/s03/cong-cu/chay-mau.py): ảnh lgz-win-mau:1 (PowerShell 7 + evtx + jq + python3),
#   KHÔNG mạng, 2 GB RAM, 2 CPU. Gắn chỉ đọc: /lab/vu14 + /lab/lab14 = hai bộ log sinh bởi _demo/s14/tao-vu.py (~/.rtq-lgz/c14/sinh),
#   /lab/tc = 40 EVTX mẫu công khai của Ch4 (~/.rtq-lgz/c04/evtx), /lab/mau = 17 tệp Ch3, /lab/sigma = 6 quy tắc SigmaHQ (~/.rtq-lgz/c14/sigma), /lab/s14 = _demo/s14.
[ "$1" = xoa ] && { docker rm -f lgz-c03 >/dev/null 2>&1; echo "đã xoá lgz-c03"; exit 0; }
docker rm -f lgz-c03 >/dev/null 2>&1
D="$(cd "$(dirname "$0")/.." && pwd)"; B="$(cd "$D/../s03" && pwd)/bin"
docker run -d --name lgz-c03 --label lgz=1 --network none --memory 2g --memory-swap 2g --cpus 2 -e TZ=UTC -e NO_COLOR=1 \
  -v ~/.rtq-lgz/c14/sinh/vu14:/lab/vu14:ro -v ~/.rtq-lgz/c14/sinh/lab14:/lab/lab14:ro -v ~/.rtq-lgz/c04/evtx:/lab/tc:ro -v ~/.rtq-lgz/c03/evtx:/lab/mau:ro \
  -v ~/.rtq-lgz/c14/sigma:/lab/sigma:ro -v "$D":/lab/s14:ro -v "$B":/usr/local/lgz:ro --tmpfs /lab/ra:size=256m \
  -e PATH=/usr/local/lgz:/opt/microsoft/powershell/7:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin lgz-win-mau:1 sleep infinity >/dev/null && echo "lgz-c03 chạy"
