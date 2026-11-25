# 7.4 — Giới hạn tốc độ của journald: mặc định 10000 dòng/30 s mỗi dịch vụ (nhân thêm theo dung lượng trống), và đặt riêng cho một unit
cat ~/spam.py
sudo systemd-run --unit=lu-mac-dinh --wait -q python3 ~/spam.py
journalctl -u lu-mac-dinh --no-pager -q | wc -l
journalctl -u lu-mac-dinh --no-pager -q | tail -n 3
sudo systemd-run --unit=lu-1000 -p LogRateLimitIntervalSec=30s -p LogRateLimitBurst=1000 --wait -q python3 ~/spam.py
journalctl -u lu-1000 --no-pager -q | wc -l
journalctl -u lu-1000 --no-pager -q | tail -n 3
