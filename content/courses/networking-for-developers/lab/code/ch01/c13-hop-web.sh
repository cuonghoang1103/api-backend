# Ch1 · 1.4 — cùng request đó, nhìn ở phía DMZ (máy web nhận) — sau khi đã đi qua router
tshark -r /tmp/h.pcap -Y 'http.request and ip.src == 10.10.1.10' -T fields -E header=y -e eth.src -e eth.dst -e ip.src -e ip.dst -e ip.ttl -e ip.checksum -e tcp.srcport -e tcp.dstport 2>/dev/null
tshark -r /tmp/h.pcap -Y 'http.request and ip.src == 10.10.1.10' -x 2>/dev/null
