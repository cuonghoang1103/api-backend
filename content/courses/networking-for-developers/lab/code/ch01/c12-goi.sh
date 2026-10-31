# Ch1 · 1.3 đóng gói — máy client (bắt GET /api/hello, đọc từng lớp header)
@ tcpdump -i eth0 -n -U -w /tmp/g.pcap 'tcp port 80' >/dev/null 2>&1 & TP=$!; sleep 2
curl -s -o /dev/null http://10.10.2.10/api/hello
@ sleep 1; kill -INT $TP; wait $TP 2>/dev/null
tshark -r /tmp/g.pcap -Y http.request -x 2>/dev/null
tshark -r /tmp/g.pcap -Y http.request -T fields -e frame.len -e eth.dst -e eth.src -e eth.type -e ip.hdr_len -e ip.len -e ip.ttl -e ip.proto -e tcp.hdr_len -e tcp.len 2>/dev/null
tshark -r /tmp/g.pcap -Y http.request -O ip,tcp 2>/dev/null | sed -n '/^Internet Protocol/,/^Hypertext/p' | grep -vE 'Checksum Status|\.\.\.\. |Timestamps$|\[|Conversation|Completeness|SEQ/ACK'
ip link show eth0
ping -c 1 -M do -s 1472 10.10.2.10
ping -c 1 -M do -s 1473 10.10.2.10
