# Ch4 · 4.4 — các trạng thái của một kết nối TCP; đếm nhanh bằng ss -s
# giữ 2 kết nối mở (orchestrator mở sẵn bằng bash /dev/tcp) + vài kết nối vừa đóng
ss -tan '( dport = :80 or sport = :80 )'
echo ---
ss -s
