#!/bin/bash
# isp.sh — nhà mạng (14.3/14.6): phía Internet 198.18.0.40, phía khách 100.64.0.1 trong dải CGNAT 100.64.0.0/10 (RFC 6598).
# Mọi router nhà của khách nhận WAN 100.64.x.x rồi bị NAT LẦN NỮA ra MỘT IP công cộng chung ⇒ không ai từ Internet gọi vào nhà được.
iptables -t nat -A POSTROUTING -s 100.64.0.0/10 -o net0 -j MASQUERADE
echo 'nameserver 198.18.0.53' > /etc/resolv.conf
exec sleep infinity
