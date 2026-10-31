# Ch1 · 1.2 các tầng — máy client
curl -sv http://10.10.2.10/api/hello 2>&1
ip route get 10.10.2.10
@ tcpdump -i eth0 -n -U -w /tmp/t.pcap 'tcp port 80' >/dev/null 2>&1 & TP=$!; sleep 2
curl -s -o /dev/null http://10.10.2.10/api/hello
@ sleep 1; kill -INT $TP; wait $TP 2>/dev/null
tshark -r /tmp/t.pcap 2>/dev/null
tshark -r /tmp/t.pcap -Y http.request -V 2>/dev/null | grep -E '^[A-Z]'
