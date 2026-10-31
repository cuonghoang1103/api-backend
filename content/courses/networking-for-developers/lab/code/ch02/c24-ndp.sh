# Ch2 · 2.4 — IPv6 không có ARP: Neighbor Discovery (ICMPv6) tìm MAC của hàng xóm
@ ip -6 neigh flush all
@ tcpdump -i eth0 -Q out -n -U -w /tmp/n.pcap 'icmp6' >/dev/null 2>&1 & TP=$!; sleep 2
ping -6 -c 1 2001:db8:a:50::11
@ sleep 1; kill -INT $TP; wait $TP 2>/dev/null
@ tcpdump -i eth0 -Q in -n -U -c 1 -w /tmp/n2.pcap 'icmp6 and ip6[40] == 136' >/dev/null 2>&1 & TP=$!; sleep 1
@ ip -6 neigh flush all; ping -6 -c 1 2001:db8:a:50::11 >/dev/null; sleep 1; kill -INT $TP 2>/dev/null; wait $TP 2>/dev/null
tcpdump -n -t -r /tmp/n.pcap
tcpdump -n -t -r /tmp/n2.pcap
ip -6 neigh show 2001:db8:a:50::11
