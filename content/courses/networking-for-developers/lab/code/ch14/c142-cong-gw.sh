# 14.2 · nft-gw: chặn theo IP (máy VPN), chỉ mở TCP 80/443/587/993, chặn mọi UDP
iptables -A CHAN -d 198.18.0.20 -j DROP
iptables -A CHAN -p tcp -m multiport ! --dports 80,443,587,993 -j DROP
iptables -A CHAN -p udp -j DROP
