# Ch2 · 2.3 — bên trong router nhà: luật NAT, hai phía của cùng một kết nối, và bảng conntrack
iptables -t nat -S POSTROUTING
tcpdump -n -t -q -r /tmp/lan.pcap 'tcp[tcpflags] == tcp-syn'
tcpdump -n -t -q -r /tmp/wan.pcap 'tcp[tcpflags] == tcp-syn'
conntrack -L -p tcp --dport 80
