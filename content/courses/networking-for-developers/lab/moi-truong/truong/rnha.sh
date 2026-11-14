#!/bin/bash
# rnha.sh — router Wi-Fi ở nhà/ký túc xá (14.3/14.6): WAN 100.64.0.2 (nhà mạng cấp — CGNAT), LAN 192.168.1.1, NAT lần thứ nhất.
ip route replace default via 100.64.0.1
iptables -t nat -A POSTROUTING -o wan -j MASQUERADE
echo 'nameserver 198.18.0.53' > /etc/resolv.conf
exec sleep infinity
