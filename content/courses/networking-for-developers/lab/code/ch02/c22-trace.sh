# Ch2 · 2.2 — traceroute từ laptop tới cổng LabFlow; bắt gói để thấy TTL tăng dần và ai trả lời
traceroute -n 203.0.113.10
@ tcpdump -i eth0 -n -U -w /tmp/t.pcap 'udp or icmp' >/dev/null 2>&1 & TP=$!; sleep 2
traceroute -n -q 1 -N 1 203.0.113.10
@ sleep 1; kill -INT $TP; wait $TP 2>/dev/null
tshark -r /tmp/t.pcap -T fields -E occurrence=f -e ip.src -e ip.dst -e ip.ttl -e _ws.col.Info
