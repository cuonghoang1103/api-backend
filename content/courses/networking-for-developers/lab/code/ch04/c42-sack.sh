# Ch4 · 4.2 — đọc một phiên có mất gói: tshark đánh dấu đâu là truyền lại, ACK trùng, và báo nhận chọn lọc (SACK)
tshark -r /tmp/c42loss.pcap -Y 'tcp.analysis.retransmission || tcp.analysis.duplicate_ack || tcp.analysis.lost_segment' -n 2>/dev/null | head -10
