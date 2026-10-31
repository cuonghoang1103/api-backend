# Ch1 · 1.3 — tải lại /big sau khi máy web đã tắt offload — máy client
@ tcpdump -i eth0 -n -U -w /tmp/b2.pcap 'tcp port 80' >/dev/null 2>&1 & TP=$!; sleep 2
curl -s -o /dev/null -w '%{size_download} bytes of body\n' http://10.10.2.10/big
@ sleep 1; kill -INT $TP; wait $TP 2>/dev/null
tshark -r /tmp/b2.pcap -Y 'tcp.srcport == 80 and tcp.len > 0' -T fields -e frame.number -e frame.len -e tcp.len 2>/dev/null
tshark -r /tmp/b2.pcap 2>/dev/null
