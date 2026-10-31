# Ch1 · 1.4 — cùng MỘT request, nhìn ở phía LAN (máy client). Máy web bắt gói cùng lúc (xem c13-hop-web).
@ tcpdump -i eth0 -n -U -w /tmp/h.pcap 'tcp port 80' >/dev/null 2>&1 & TP=$!; sleep 2
curl -s -o /dev/null http://10.10.2.10/api/hello
@ sleep 1; kill -INT $TP; wait $TP 2>/dev/null
tshark -r /tmp/h.pcap -Y http.request -T fields -E header=y -e eth.src -e eth.dst -e ip.src -e ip.dst -e ip.ttl -e ip.checksum -e tcp.srcport -e tcp.dstport 2>/dev/null
tshark -r /tmp/h.pcap -Y http.request -x 2>/dev/null
