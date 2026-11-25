#!/bin/bash
# ct.bash [xoa] — container lgz-c03 cho demo Chương 5: như s04/cong-cu/ct.bash + /lab/sm = 13 tệp Sysmon công khai (~/.rtq-lgz/c05/evtx, tải bằng _demo/s05/mau/tai-mau-ch5.ps1.txt),
#   _demo/s05/bin ở /usr/local/lgz5 (evtx-obj + mô-đun WinEventMau tự nạp qua PSModulePath).
#   /lab/mau  = bộ 17 tệp của Ch3 (~/.rtq-lgz/c03/evtx) · /lab/tc = bộ mẫu tấn công/cấu hình của Ch4 (~/.rtq-lgz/c04/evtx = 40 tệp, tải + kiểm SHA256 bằng _demo/s04/mau/tai-mau-ch4.ps1.txt)
#   /lab/sm = 11 tệp Sysmon Ch5 (~/.rtq-lgz/c05/evtx), /lab/s04 = _demo/s04/mau (bảng GUID audit policy). KHÔNG mạng, 2 GB RAM, 2 CPU.
[ "$1" = xoa ] && { docker rm -f lgz-c03 >/dev/null 2>&1; echo "đã xoá lgz-c03"; exit 0; }
docker rm -f lgz-c03 >/dev/null 2>&1
B="$(cd "$(dirname "$0")/../../s03" && pwd)/bin"
docker run -d --name lgz-c03 --label lgz=1 --network none --memory 2g --memory-swap 2g --cpus 2 -e TZ=UTC \
  -v ~/.rtq-lgz/c03/evtx:/lab/mau:ro -v ~/.rtq-lgz/c04/evtx:/lab/tc:ro -v ~/.rtq-lgz/c05/evtx:/lab/sm:ro -v "$(cd "$(dirname "$0")/../../s04" && pwd)/mau":/lab/s04:ro -v "$(cd "$(dirname "$0")/.." && pwd)/mau":/lab/s05:ro -v "$B":/usr/local/lgz:ro -v "$(cd "$(dirname "$0")/.." && pwd)/bin":/usr/local/lgz5:ro \
  -e PSModulePath=/usr/local/lgz5 -e NO_COLOR=1 -e PATH=/usr/local/lgz:/usr/local/lgz5:/opt/microsoft/powershell/7:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin --tmpfs /lab/ra:size=512m lgz-win-mau:1 sleep infinity >/dev/null && echo "lgz-c03 chạy"
