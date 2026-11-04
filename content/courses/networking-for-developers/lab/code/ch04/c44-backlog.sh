# Ch4 · 4.4 — máy chủ: hàng đợi lắng nghe. Recv-Q = số kết nối đã bắt tay xong đang chờ accept(); Send-Q = sức chứa (backlog)
ss -ltn
sysctl net.core.somaxconn net.ipv4.tcp_max_syn_backlog
