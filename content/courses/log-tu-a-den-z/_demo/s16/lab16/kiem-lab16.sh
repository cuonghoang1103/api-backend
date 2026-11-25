#!/usr/bin/env bash
# kiem-lab16.sh — tự kiểm 8 điều của chính sách log trên may16; in ✓/✗ và gợi ý. Chạy bằng root.
d=0; t=0
kq() { t=$((t+1)); if [ "$1" = 0 ]; then d=$((d+1)); echo "✓ $2"; else echo "✗ $2 — $3"; fi; }
m=$(stat -c %a /var/log/shop/app.log 2>/dev/null); [ "${m: -1}" = 0 ] ; kq $? "app.log không cho 'người khác' đọc (quyền $m)" "chmod 0640 + chown root:adm, và 'create 0640 root adm' trong logrotate"
grep -rqsE 'password"\s*:\s*"[^[]|sk_live_|token=[^[&" ]{6,}' /var/log/shop /var/log/nginx; [ $? != 0 ]; kq $? "không còn bí mật dạng rõ trong /var/log/shop và /var/log/nginx" "che ở nguồn (redact, log_format), rồi XỬ LÝ dữ liệu đã lọt"
grep -rqs '/var/log/shop' /etc/logrotate.d; kq $? "có luật logrotate cho /var/log/shop" "thêm /etc/logrotate.d/shop (daily, rotate, compress, create)"
logrotate -d /etc/logrotate.conf >/dev/null 2>&1; kq $? "logrotate -d chạy không lỗi" "đọc lỗi của logrotate -d"
nginx -t -q 2>/dev/null; kq $? "nginx -t hợp lệ (sửa log_format không làm hỏng web)" "nginx -t để xem dòng lỗi"
python3 -c 'import urllib.request as u; u.urlopen("http://127.0.0.1/kiem?token=KIEMTRA16xyz", timeout=2)' 2>/dev/null; sleep 1; ! grep -q KIEMTRA16xyz /var/log/nginx/access.log; kq $? "request mới có ?token= KHÔNG lọt vào access.log (thử thật)" "log_format che bằng map (bài 16.3)"
[ "$(systemd-analyze cat-config systemd/journald.conf | grep -E '^Storage=' | tail -1)" != "Storage=volatile" ]; kq $? "journald lưu xuống đĩa (không volatile)" "xoá drop-in Storage=volatile, đặt Storage=persistent + SystemMaxUse"
! id -nG dev | grep -qw adm; kq $? "dev không thuộc nhóm adm" "gpasswd -d dev adm; cho xem log qua kho trung tâm (Grafana viewer) thay vì vào máy"
[ ! -e /tmp/sao-luu-log.tar.gz ] || [ "$(stat -c %a /tmp/sao-luu-log.tar.gz)" = 600 ]; kq $? "không có bản sao log ai cũng đọc được trong /tmp" "xoá, hoặc để nơi 0700 + băm SHA256"
[ -s /etc/rsyslog.d/90-gui-di.conf ]; kq $? "auth/syslog được đẩy ra khỏi máy (rsyslog forward)" "thêm *.* @@may-log:6514 (TLS ở bài 15.1) — log trên chính máy không phải bằng chứng"
echo "== $d/$t đạt"
