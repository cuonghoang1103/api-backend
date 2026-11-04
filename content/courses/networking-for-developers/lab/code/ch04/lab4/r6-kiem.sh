# Lab 4 · R6 — bộ kiểm sức khoẻ TCP: điểm danh socket, đếm TIME-WAIT, đọc hàng đợi accept của nginx
echo "[1] census:   $(ss -s | sed -n 2p)"
echo "[2] tới :80 — ESTAB=$(ss -tan '( dport = :80 )' | grep -c ESTAB)  TIME-WAIT=$(ss -tan '( dport = :80 )' | grep -c TIME-WAIT)"
tw=$(ss -tan '( dport = :80 )' | grep -c TIME-WAIT); [ "$tw" -gt 10000 ] && echo "   FAIL: TIME-WAIT quá nhiều ($tw) — nghi thiếu keep-alive" || echo "   OK"
echo "[3] cổng tạm còn trống: $(cat /proc/sys/net/ipv4/ip_local_port_range)"
