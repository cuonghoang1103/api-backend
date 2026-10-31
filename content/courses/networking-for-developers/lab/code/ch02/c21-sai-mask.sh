# Ch2 · 2.1 — mặt nạ gõ sai: client2 cấu hình như một máy văn phòng (địa chỉ + mặt nạ + cổng mặc định)
@ ip addr flush dev eth0; ip addr add 10.10.1.11/24 dev eth0; ip route replace default via 10.10.1.254
ip -br -4 addr show eth0
ip route
ping -c 1 -W 1 10.10.2.10
# gõ nhầm /16 thay vì /24
@ ip addr flush dev eth0; ip addr add 10.10.1.11/16 dev eth0; ip route replace default via 10.10.1.254; ip neigh flush all
ip -br -4 addr show eth0
ip route
ip route get 10.10.2.10
@ tcpdump -i eth0 -Q out -n -U -w /tmp/m.pcap 'arp or icmp' >/dev/null 2>&1 & TP=$!; sleep 2
ping -c 4 10.10.2.10
@ sleep 1; kill -INT $TP; wait $TP 2>/dev/null
tcpdump -n -r /tmp/m.pcap
ip neigh show 10.10.2.10
# sửa lại /24
@ ip addr flush dev eth0; ip addr add 10.10.1.11/24 dev eth0; ip route replace default via 10.10.1.254; ip neigh flush all
ip route get 10.10.2.10
ping -c 1 -W 1 10.10.2.10
@ ip route replace default via 10.10.1.1; ip route add 10.10.2.0/24 via 10.10.1.254
