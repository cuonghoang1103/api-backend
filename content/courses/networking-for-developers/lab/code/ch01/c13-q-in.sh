# Ch1 · 1.4 — gói ARP thứ hai là gì? chỉ bắt chiều VÀO (-Q in) — máy client
ip neigh flush all
@ tcpdump -i eth0 -e -n -U -Q in -w /tmp/q.pcap arp >/dev/null 2>&1 & TP=$!; sleep 2
ping -c 1 10.10.1.11 > /dev/null
@ sleep 1; kill -INT $TP; wait $TP 2>/dev/null
tcpdump -e -n -r /tmp/q.pcap
