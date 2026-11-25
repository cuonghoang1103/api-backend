# Lab 7 — cách "tua tới đêm": tắt NTP rồi đặt giờ 03:11:40 (chỉ trong máy ảo); chính việc đổi giờ cũng được ghi lại
journalctl -t systemd-timedated --no-pager -q | tail -n 3
