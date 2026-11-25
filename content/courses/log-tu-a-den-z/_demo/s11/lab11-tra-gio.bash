# Lab 11 — trả đồng hồ thật cho router, lab7, android (bật lại NTP). Chạy sau lab11.bash.
sudo timedatectl set-ntp true; sleep 8; date
@android sudo timedatectl set-ntp true; sleep 8; date
@wrt /etc/init.d/sysntpd start; sleep 8; date
