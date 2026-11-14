# 14.5 · nft-gw: bộ điều khiển trường thấy gì từ điện thoại khi laptop KHÔNG NAT
tshark -r /tmp/nat.pcap -T fields -e ip.src -e ip.dst -e tcp.dstport 2>/dev/null | sort | uniq -c
