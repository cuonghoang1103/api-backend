#!/bin/bash
# homegw — router Wi-Fi ở nhà: lan0 (192.168.50.1) ↔ wan0 (198.51.100.2, địa chỉ ISP cấp). NAT (masquerade) IPv4 ra wan0.
# IPv6: không NAT — chỉ chuyển tiếp; tuyến mặc định v6 qua ISP.
ip route replace default via 198.51.100.1
ip -6 route replace default via 2001:db8:a:1::1
iptables -t nat -A POSTROUTING -o wan0 -j MASQUERADE
exec sleep infinity
