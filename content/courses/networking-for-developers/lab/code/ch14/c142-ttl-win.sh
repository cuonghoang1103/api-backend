# 14.2 · laptop Windows bật "Mobile Hotspot" (card hs 192.168.137.1, NAT ra card sv)
ip -br addr show hs; ip -br addr show sv
iptables -t nat -S POSTROUTING | grep 192.168.137
curl -s -m 3 http://news.test/
