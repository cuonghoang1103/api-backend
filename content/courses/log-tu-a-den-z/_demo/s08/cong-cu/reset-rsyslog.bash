# Đưa lab7 + máy chủ log về trạng thái trước Bài 8.2 (để chạy lại rsyslog.bash). LƯU Ý: phải khởi động lại rsyslogd bên nhận
# sau khi xoá tệp — rsyslog giữ fd của tệp dynaFile đã mở, xoá tệp mà không HUP thì dòng mới ghi vào tệp "ma" đã xoá.
V=~/vbg-dp/scratchpad/lgz/vm/ssh.cfg
docker exec lgz-logsrv bash -c 'kill $(cat /run/rsyslogd.pid) 2>/dev/null; sleep 2; rm -rf /var/log/remote/* /var/spool/rsyslog/*; rsyslogd -i /run/rsyslogd.pid'
ssh -F $V lab7 'sudo systemctl stop rsyslog syslog.socket; sudo bash -c "rm -rf /var/spool/rsyslog/* /var/log/shop; rm -f /etc/rsyslog.d/90-gui-di.conf /etc/rsyslog.d/20-gui-di.conf /etc/rsyslog.d/30-shop.conf"; sudo sed -i "\|/etc/rsyslog-tls|d" /etc/apparmor.d/local/usr.sbin.rsyslogd; sudo apparmor_parser -r /etc/apparmor.d/usr.sbin.rsyslogd; sudo systemctl start rsyslog'
