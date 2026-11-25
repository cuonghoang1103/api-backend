# 7.2 — Bộ lọc journalctl trên máy ảo lab7 (ba lần khởi động trước: mất điện, thử volatile, khởi động lại sạch)
journalctl --list-boots
journalctl -b -1 -n 6 --no-pager
journalctl -b -3 -n 3 --no-pager
systemctl status shop-worker --no-pager
journalctl -b -u shop-worker --no-pager | head -n 14
journalctl -b -u shop-worker -p err --no-pager
journalctl -b -p err --no-pager | head -n 8
journalctl -b -p warning..warning -n 3 --no-pager
journalctl -u shop-api --since '10 min ago' -n 3 --no-pager
journalctl -t sudo -n 2 --no-pager
journalctl _SYSTEMD_UNIT=shop-api.service PRIORITY=3 -n 2 --no-pager
journalctl _SYSTEMD_UNIT=shop-api.service _SYSTEMD_UNIT=shop-worker.service -b -p err -n 3 --no-pager
journalctl -b _SYSTEMD_UNIT=shop-worker.service + _SYSTEMD_UNIT=shop-api.service PRIORITY=3 --no-pager | head -n 5
journalctl -b _SYSTEMD_UNIT=shop-worker.service -n 2 --no-pager
journalctl -b -u shop-worker -n 1 -o verbose --output-fields=UNIT,_SYSTEMD_UNIT,_PID,MESSAGE
journalctl -b -u shop-worker -g FileNotFoundError -n 1 -o json | jq -c '{PRIORITY, _TRANSPORT, MESSAGE}'
journalctl -b -q -g 'database timeout' | wc -l
journalctl -b -q -g 'DATABASE TIMEOUT' | wc -l
journalctl -b -q -g 'Database Timeout' --case-sensitive=false | wc -l
journalctl -b -u shop-api -g 'order 10[0-4][0-9] failed' -n 3 --no-pager
timeout 7 journalctl -f -u shop-api
journalctl -r -u shop-api -n 3 --no-pager
journalctl -xeu shop-worker --no-pager | tail -n 14
journalctl _PID=1 -b -n 3 --no-pager
