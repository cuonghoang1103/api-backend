# Ch11 · 11.1 — tcpdump: bắt một curl tới web:80, ghi .pcap, rồi đọc lại (bắt tay + GET + 200 + đóng).
tcpdump -i eth0 -w /tmp/cap.pcap -n "tcp port 80 and host 10.10.2.10" >/dev/null 2>&1 &
sleep 1
curl -s -o /dev/null http://10.10.2.10/
sleep 1
kill %1 2>/dev/null; sleep 1
tcpdump -r /tmp/cap.pcap -n -c 8 2>/dev/null
