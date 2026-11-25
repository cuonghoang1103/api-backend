#!/usr/bin/env bash
# Kho web (25/11/2026): thân các khoá giả đã thay bằng chỗ giữ chỗ (…GIA-VI-DU, ghp_GIAxxx…VIDU) để qua chốt gitleaks; chạy lại lab thì điền khoá giả ĐÚNG định dạng (ghp_ + 36 ký tự, sk_live_ + ≥10, AKIA + 16) — output đã ghi là của lượt chạy gốc.
# pha-lab16.sh — CÀI SẴN 7 lỗi vận hành log lên may16 (đúng kiểu hay gặp khi tiếp quản máy chủ của người khác). Chỉ chạy trên máy lab.
set -e
# (1)(2) ứng dụng ghi log ra tệp ai cũng đọc được, có mật khẩu + token trong đó, và KHÔNG có logrotate
mkdir -p /var/log/shop; umask 022
for i in $(seq 1 3000); do echo "{\"time\":\"2026-11-23T08:00:00Z\",\"level\":\"info\",\"msg\":\"request completed\",\"url\":\"/api/san-pham/$i\",\"status\":200}"; done > /var/log/shop/app.log
echo '{"time":"2026-11-23T08:01:12Z","level":"debug","msg":"đăng nhập","body":{"email":"an@example.com","password":"MatKhau-GIA-123"}}' >> /var/log/shop/app.log
echo '{"time":"2026-11-23T08:01:13Z","level":"error","msg":"Stripe lỗi","key":"sk_live_xxxx…GIA-VI-DU"}' >> /var/log/shop/app.log
# (3) nginx ghi nguyên query string — có ?token=
python3 -c 'import urllib.request as u; [u.urlopen("http://127.0.0.1/reset?token=GIA-reset-9c1e77").read() for _ in range(2)]' 2>/dev/null || true
# (4) journald chỉ giữ trên RAM: khởi động lại là mất sạch
mkdir -p /etc/systemd/journald.conf.d; printf '[Journal]\nStorage=volatile\n' > /etc/systemd/journald.conf.d/50-tam.conf; systemctl restart systemd-journald
# (5) lập trình viên "dev" được cho vào nhóm adm "cho tiện xem log"
usermod -aG adm dev
# (6) một "sao lưu log" hằng ngày để ở /tmp, ai cũng đọc được
tar -czf /tmp/sao-luu-log.tar.gz -C /var/log shop auth.log 2>/dev/null; chmod 644 /tmp/sao-luu-log.tar.gz
# (7) không có gì đẩy log ra khỏi máy và không ai được báo khi auth.log bị xoá: mô phỏng bằng việc KHÔNG có cấu hình forward
rm -f /etc/rsyslog.d/90-gui-di.conf
echo "đã cài 7 lỗi"
