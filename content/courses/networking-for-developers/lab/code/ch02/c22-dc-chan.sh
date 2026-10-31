# Ch2 · 2.2 — router dc được cấu hình KHÔNG gửi "Time exceeded" (nhiều router thật làm vậy, hoặc giới hạn tốc độ ICMP)
iptables -A OUTPUT -p icmp --icmp-type time-exceeded -j DROP
iptables -S OUTPUT
