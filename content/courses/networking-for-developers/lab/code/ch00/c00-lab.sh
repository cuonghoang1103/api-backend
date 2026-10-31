# Mục 0 · bài 0.1 — chạy trong máy client của lab (docker exec nfd-client …)
dig -v
curl --version | head -1
tcpdump --version | head -1
tshark --version 2>/dev/null | head -1
openssl version
ip -br addr show eth0
ip route
curl -s http://10.10.2.10/
curl -s http://10.10.2.10/api/hello
@ tcpdump -i eth0 -n -U -w /tmp/dau.pcap 'tcp port 80' >/dev/null 2>&1 & TP=$!; sleep 2
curl -s -o /dev/null -w 'HTTP %{http_code}, %{size_download} bytes\n' http://10.10.2.10/
@ sleep 1; kill -INT $TP; wait $TP 2>/dev/null
tcpdump -n -r /tmp/dau.pcap
