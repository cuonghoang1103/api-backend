# Ch4 · 4.1 — đọc lại bản bắt gói của MỘT lần `curl http://10.10.2.10/`: bắt tay, dữ liệu, rồi đóng
# router thêm 25 ms vào chiều hồi đáp (netem trên cổng LAN) ⇒ thấy được khoảng nghỉ một vòng
tcpdump -nr /tmp/c41.pcap -tt 'tcp' 2>/dev/null
