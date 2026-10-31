# Lab 2 · R4 — mở cổng 8443 của router nhà vào máy laptop :8080
iptables -t nat -A PREROUTING -i wan0 -p tcp --dport 8443 -j DNAT --to-destination 192.168.50.10:8080
iptables -t nat -S PREROUTING | grep 8443
