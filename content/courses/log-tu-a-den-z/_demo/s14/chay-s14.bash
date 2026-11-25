#!/bin/bash
# chay-s14.bash [tệp.bash…] — sinh lại hai bộ log (tao-vu.py, tất định), dựng lại container lgz-c03 (bind mount phải gắn lại sau khi sinh), chạy các tệp lệnh của Chương 14.
set -e; cd "$(dirname "$0")"
rm -rf ~/.rtq-lgz/c14/sinh; mkdir -p ~/.rtq-lgz/c14/sinh; python3 tao-vu.py ~/.rtq-lgz/c14/sinh
bash cong-cu/ct.bash
for f in ${@:-*.bash}; do [ "$f" = chay-s14.bash ] && continue; python3 ../s03/cong-cu/chay-mau.py "$f"; done
