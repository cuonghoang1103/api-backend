#!/bin/bash
# chay.sh <máy> <chNN/kich-ban.sh> [tên-output]  — chạy một kịch bản bằng `phien` (in "$ lệnh" + output thật) và ghi
# lab/out/<tên>.out.txt. Bài học cắt output từ file đó bằng run() của _ui.mjs — KHÔNG chép tay.
#   <máy> = client | client2 | router | web | api   (container của compose.yml, phải đang chạy)
#         = internet                                (container net-lab rời, mạng Docker mặc định ⇒ ra Internet thật)
#         = nfi-<máy>  (laptop phone homegw mobile isp dc rogue server ns — "Internet trong một hộp" của Chương 2, internet.yml)
set -e
cd "$(dirname "$0")"
may="$1"; kb="$2"; ten="${3:-$(basename "$kb" .sh)}"
dir="$(dirname "$kb")"; f="$(basename "$kb")"
if [ "$may" = internet ]; then
  docker run --rm --label netlab=1 --hostname netlab --cap-add NET_ADMIN --cap-add NET_RAW \
    -v "$PWD":/lab/k:ro -w "/lab/k/code/$dir" net-lab bash -c "phien $f 2>&1" > "out/$ten.out.txt"
else
  c="nfd-$may"; case "$may" in nfi-*) c="$may" ;; esac
  docker exec -w "/lab/k/code/$dir" "$c" bash -c "phien $f 2>&1" > "out/$ten.out.txt"
fi
echo "✓ out/$ten.out.txt ($(wc -l < "out/$ten.out.txt") dòng)"
