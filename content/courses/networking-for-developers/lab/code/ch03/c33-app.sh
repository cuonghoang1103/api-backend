# Ch3 · 3.3 — cache trong ỨNG DỤNG: Java nhớ câu trả lời 30 s, Node hỏi lại mỗi lần — đếm câu hỏi thật bằng tcpdump
@ rm -f /tmp/a.pcap; (tcpdump -i eth0 -n -U -w /tmp/a.pcap 'udp port 53' >/dev/null 2>&1 &) ; sleep 2
java Hoi.java api.labflow.test 2>&1 | grep -v Picked
@ sleep 1; pkill -INT tcpdump; sleep 1
tshark -r /tmp/a.pcap -Y 'dns.flags.response==0' 2>/dev/null | wc -l
@ rm -f /tmp/b.pcap; (tcpdump -i eth0 -n -U -w /tmp/b.pcap 'udp port 53' >/dev/null 2>&1 &) ; sleep 2
node hoi.mjs api.labflow.test
@ sleep 1; pkill -INT tcpdump; sleep 1
tshark -r /tmp/b.pcap -Y 'dns.flags.response==0' 2>/dev/null | wc -l
