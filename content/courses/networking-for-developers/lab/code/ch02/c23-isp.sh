# Ch2 · 2.3 — NAT của nhà mạng (CGNAT) trên isp
iptables -t nat -S POSTROUTING
conntrack -L -s 100.64.0.10 -p tcp
