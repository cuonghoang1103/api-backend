#!/usr/bin/env bash
# sua-lab16.sh — LỜI GIẢI Lab 16 (đừng mở trước khi tự làm). Thứ tự: chặn lọt thêm → xử lý cái đã lọt → quyền → giữ/xoay → đẩy ra ngoài.
set -e
# (3) nginx: log_format che token/code/password trong query (bài 16.3) — sửa nguồn trước để không lọt thêm
cat > /etc/nginx/conf.d/log-che.conf <<'NG'
map $args $args_che { default $args; "~^(?<a>.*?)(?<k>token|password|code)=[^&]*(?<b>.*)$" "${a}${k}=[CHE]${b}"; }
log_format che '$remote_addr - $remote_user [$time_local] "$request_method $uri${is_args}$args_che $server_protocol" $status $body_bytes_sent "$http_referer" "$http_user_agent"';
access_log /var/log/nginx/access.log che;
NG
# access_log cũ trong nginx.conf đứng TRƯỚC include conf.d ⇒ tắt nó, để dòng access_log mới (sau log_format) thay thế
sed -i 's|^\(\s*\)access_log /var/log/nginx/access.log;|\1# access_log: xem conf.d/log-che.conf|' /etc/nginx/nginx.conf
nginx -t -q || { echo "nginx -t HỎNG — dừng"; exit 1; }; systemctl reload nginx
# (2) dữ liệu ĐÃ lọt: che tại chỗ (sau khi đã thu hồi key/đổi mật khẩu thật!) — trên MỌI bản sao
sed -i -E 's/("password":")[^"]+/\1[ĐÃ CHE]/; s/sk_live_[A-Za-z0-9]+/[ĐÃ CHE]/' /var/log/shop/app.log
sed -i -E 's/(token|code)=[^&" ]+/\1=[CHE]/g' /var/log/nginx/access.log
rm -f /tmp/sao-luu-log.tar.gz                                   # (6) bản sao ai cũng đọc — xoá (bản sao lưu thật để nơi 0700)
# (1) quyền + (2b) logrotate tạo tệp mới đúng quyền
chown root:adm /var/log/shop/app.log; chmod 0640 /var/log/shop/app.log
printf '/var/log/shop/*.log {\n  daily\n  rotate 30\n  maxsize 100M\n  compress\n  delaycompress\n  missingok\n  notifempty\n  create 0640 root adm\n}\n' > /etc/logrotate.d/shop
# (4) journald xuống đĩa, có trần
rm -f /etc/systemd/journald.conf.d/50-tam.conf; printf '[Journal]\nStorage=persistent\nSystemMaxUse=1G\nMaxRetentionSec=3month\n' > /etc/systemd/journald.conf.d/60-chinh-sach.conf; systemctl restart systemd-journald; journalctl --flush
# (5) bớt quyền
gpasswd -d dev adm >/dev/null
# (7) đẩy ra máy log trung tâm (TCP, có hàng đợi đĩa khi mất mạng; TLS như bài 15.1)
cat > /etc/rsyslog.d/90-gui-di.conf <<'RS'
*.* action(type="omfwd" target="may-log.lab" port="6514" protocol="tcp"
           queue.type="LinkedList" queue.filename="gui-di" queue.saveOnShutdown="on" action.resumeRetryCount="-1")
RS
rsyslogd -N1 2>&1 | tail -1; systemctl restart rsyslog
echo "đã sửa"
