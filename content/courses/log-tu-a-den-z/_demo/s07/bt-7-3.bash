# Lời giải 🧪 bài 7.3 — chạy thật 25/11/2026 trong container systemd lgz-c07 (Ubuntu 24.04, systemd 255; podman, --network none, 2 GB). Giờ máy = UTC, không có tzdata.
sudo usermod -aG systemd-journal hv
# Câu 1 — 3 dòng cuối của ssh.service ở bốn định dạng
sudo systemctl start ssh
sleep 2
sudo systemctl restart ssh
journalctl -u ssh -n 3 --no-pager -o short
TZ='<+07>-7' journalctl -u ssh -n 3 --no-pager -o short-iso
TZ='<+07>-7' journalctl -u ssh -n 3 --no-pager -o short-iso --utc
journalctl -u ssh -n 3 --no-pager -o short-monotonic
cat /proc/uptime
# Câu 2 — mọi unit đã ghi log, mọi mức đang dùng, unit nào ở mức 0..2
journalctl -F _SYSTEMD_UNIT | sort
journalctl -F PRIORITY | sort | tr '\n' ' '; echo
journalctl -p 0..2 -F _SYSTEMD_UNIT
logger -p user.crit -t kiem-dia 'disk /data 97% full'
journalctl -F PRIORITY | sort | tr '\n' ' '; echo
journalctl -p 0..2 -F _SYSTEMD_UNIT
journalctl -p 0..2 -o json | jq -r '._SYSTEMD_UNIT // ("(không unit) " + .SYSLOG_IDENTIFIER)' | sort | uniq -c
journalctl -p crit --no-pager
# Câu 3 — đếm bản ghi theo _TRANSPORT trong lần khởi động này
journalctl -b -o json | jq -r '._TRANSPORT // "?"' | sort | uniq -c | sort -rn
journalctl -k --no-pager | head -n 3
# Câu 4 — một thông điệp có byte không phải UTF-8, tìm bằng jq không lỗi
printf 'login that bai tu 198.51.100.9 user=\xc3\x28dmin\n' | systemd-cat -t q4-blob
journalctl -t q4-blob --no-pager
journalctl -t q4-blob -o json | jq -r '.MESSAGE | test("login")'
journalctl -t q4-blob -o json | jq -r '.MESSAGE | if type == "array" then implode else . end | select(test("login"))'
journalctl -b -o json | jq -r 'select(.MESSAGE | type == "array") | .SYSLOG_IDENTIFIER' | sort | uniq -c
# Câu 5 — chép thư mục journal rồi đọc bằng -D
sudo cp -a /var/log/journal /tmp/copy && sudo chown -R hv /tmp/copy && find /tmp/copy -type f | sed 's|.*/||'
journalctl -D /tmp/copy --list-boots
journalctl --list-boots
journalctl -D /tmp/copy -q | wc -l; journalctl -q | wc -l
journalctl -D /tmp/copy -n 1 --no-pager; journalctl -n 1 --no-pager
