# 7.5 — Bảng tiến trình nhân in lúc OOM toàn máy (đơn vị: trang 4 KiB): ba tiến trình chiếm RAM nhiều nhất lúc đó
journalctl -k -b --since "$(cat /tmp/moc-oom)" --no-pager -o cat | sed 's/^\[ *//' | awk '$1 ~ /^[0-9]+\]$/ {print $5, $NF}' | sort -n | tail -n 3
