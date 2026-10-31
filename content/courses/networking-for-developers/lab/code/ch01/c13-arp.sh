# Ch1 · 1.4 Ethernet & ARP — máy client
ip -br link show eth0
ip neigh show
ip neigh flush all
ip neigh show
@ tcpdump -i eth0 -e -n -U -w /tmp/a.pcap 'arp or icmp' >/dev/null 2>&1 & TP=$!; sleep 2
ping -c 1 10.10.1.11
ping -c 1 10.10.2.10
@ sleep 1; kill -INT $TP; wait $TP 2>/dev/null
tcpdump -e -n -r /tmp/a.pcap
ip neigh show
ip route get 10.10.1.11
ip route get 10.10.2.10
