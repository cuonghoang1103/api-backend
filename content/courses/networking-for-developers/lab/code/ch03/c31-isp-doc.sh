# Ch3 · 3.1 — đọc lại các gói DNS resolver nhà mạng đã gửi/nhận khi laptop hỏi www.labflow.test hai lần (dnsgoi.sh = tshark gọn một dòng/gói)
@ sleep 1; pkill -INT tcpdump; sleep 1
./dnsgoi.sh /tmp/r.pcap
