#!/bin/bash
# chay-s18.bash [tệp.bash…] — sinh lại bộ su-co18 (tao-su-co.py, tất định), dựng lgz-c18-loki + lgz-c03 (không mạng), chạy các tệp lệnh của Chương 18, rồi xoá container.
# Thứ tự quan trọng: thu-thap.bash nạp Loki — chạy trước các tệp khác nếu chạy riêng.
set -e; cd "$(dirname "$0")"
rm -rf ~/.rtq-lgz/c18/sinh; mkdir -p ~/.rtq-lgz/c18/sinh; python3 tao-su-co.py ~/.rtq-lgz/c18/sinh
bash cong-cu/ct.bash
for f in ${@:-de-bai.bash thu-thap.bash dieu-tra.bash dong-thoi-gian.bash tu-dung.bash}; do python3 ../s03/cong-cu/chay-mau.py "$f"; done
bash cong-cu/ct.bash xoa
