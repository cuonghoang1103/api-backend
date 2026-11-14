# 14.2 · nft-gw (luật TTL đặt ở mangle PREROUTING — tới FORWARD thì nhân đã trừ TTL đi 1): hai gói SYN vừa đi qua card sv0 — CÙNG địa chỉ nguồn, khác TTL; và lớp 2 chỉ thấy MỘT MAC
tshark -r /tmp/ttl.pcap -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0" -T fields -e eth.src -e ip.src -e ip.ttl -e tcp.options.timestamp.tsval 2>/dev/null
ip neigh show dev sv0 | grep -v FAILED
iptables -t mangle -A PREROUTING -i sv0 -m ttl --ttl-eq 63 -j DROP
iptables -t mangle -A PREROUTING -i sv0 -m ttl --ttl-eq 127 -j DROP
