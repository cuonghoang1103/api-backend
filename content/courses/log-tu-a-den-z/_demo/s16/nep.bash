# 16.5 — nếp kiểm log hằng ngày: báo cáo buổi sáng chạy thật trên may16, timer systemd, so với lần trước (cong-cu/may.bash len; BASH_ENV=cong-cu/env.bash)
may 'cp /lab/nep/bao-cao-sang.sh /usr/local/sbin/; cp /lab/nep/bao-cao-sang.service /lab/nep/bao-cao-sang.timer /etc/systemd/system/; printf "location /api/thanh-toan { return 502; }\n" > /etc/nginx/default.d-loi.conf; sed -i "s|^\tlocation / {|\tinclude /etc/nginx/default.d-loi.conf;\n\tlocation / {|" /etc/nginx/sites-enabled/default; nginx -t 2>&1 | tail -1; systemctl reload nginx'
may 'printf "[Unit]\nDescription=Hàng đợi gửi email của shop\n[Service]\nExecStart=/bin/sh -c \"echo không kết nối được SMTP 10.0.0.25:587 >&2; exit 1\"\n" > /etc/systemd/system/shop-mail.service; systemctl daemon-reload; systemctl start shop-mail; systemctl is-failed shop-mail'
may 'bash /lab/nep/gay-su-kien.sh 3 2 && bao-cao-sang.sh "1 hour ago" > /dev/null && echo "lần chạy đầu: đã lưu số đếm"'
may 'sleep 60; bash /lab/nep/gay-su-kien.sh 9 6; bao-cao-sang.sh "1 hour ago"'
may 'systemctl enable --now bao-cao-sang.timer 2>&1 | tail -1; systemctl list-timers bao-cao-sang.timer --no-pager | head -2'
may 'systemctl start bao-cao-sang.service; journalctl -q -u bao-cao-sang.service -o cat --no-pager | head -4'
