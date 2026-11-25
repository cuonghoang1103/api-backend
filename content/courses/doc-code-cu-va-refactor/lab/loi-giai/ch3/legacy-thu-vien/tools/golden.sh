#!/bin/bash
# tools/golden.sh <thư mục ra> — golden master qua HTTP cho ứng dụng ĐANG CHẠY:
# nạp lại dump (ngày tương đối) → đăng nhập → chụp 3 trang → thay ngày tuyệt đối bằng <NGAY>
set -euo pipefail
B=${B:-http://localhost:18080/thuvien}
NAP=${NAP:-docker compose exec -T db mysql --default-character-set=utf8mb4 -uroot -p123456 thuvien}
ra=$1; mkdir -p "$ra"; cj=$(mktemp)
# dump gốc không có DROP PROCEDURE ⇒ nạp lần 2 lỗi 1304; thêm dòng xoá trước
{ echo "DROP PROCEDURE IF EXISTS sp_overdue_report;"; cat db/thuvien.sql; } | $NAP 2>/dev/null
curl -s -c "$cj" -b "$cj" -o /dev/null -d "username=thuthu&password=123456" "$B/login"
for trang in books readers "report?days=1"; do
  ten=$(echo "$trang" | tr '?=' '__')
  curl -s -b "$cj" "$B/$trang" | sed -E 's#[0-9]{2}/[0-9]{2}/[0-9]{4}#<NGAY>#g' > "$ra/$ten.html"
done
rm -f "$cj"; wc -l "$ra"/*.html
