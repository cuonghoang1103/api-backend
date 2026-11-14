# 14.5 · nft-gw: điện thoại giờ tới với TTL 64 — nhưng đồng hồ TCP (timestamp) vẫn là của một máy khác
tshark -r /tmp/ttl5.pcap -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0" -T fields -e ip.src -e ip.ttl -e tcp.options.timestamp.tsval 2>/dev/null
iptables -t mangle -L PREROUTING -v -n | awk '/TTL/ {print $1, $3, $(NF-2), $(NF-1), $NF}'
