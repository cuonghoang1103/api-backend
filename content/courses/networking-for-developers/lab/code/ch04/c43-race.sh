# Ch4 · 4.3 — reno và cubic trên cùng một đường có mất gói: cubic lấp lại băng thông nhanh hơn
# (chạy trong máy phụ có quyền đặt thuật toán; đường qua router: 20 Mbit, trễ 80 ms, mất 0.3%)
ip route add 10.10.2.0/24 via 10.10.1.254 2>/dev/null
sysctl -w net.ipv4.tcp_congestion_control=reno >/dev/null; echo "== $(sysctl -n net.ipv4.tcp_congestion_control) =="
iperf3 -c 10.10.2.10 -t 10 2>&1 | grep -E 'sender|receiver'
sysctl -w net.ipv4.tcp_congestion_control=cubic >/dev/null; echo "== $(sysctl -n net.ipv4.tcp_congestion_control) =="
iperf3 -c 10.10.2.10 -t 10 2>&1 | grep -E 'sender|receiver'
