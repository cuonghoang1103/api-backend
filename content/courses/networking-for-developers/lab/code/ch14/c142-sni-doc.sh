# 14.2 · nft-gw: tường lửa đọc thấy gì trong ClientHello (bắt trên card sv0), và bộ đếm của luật
tshark -r /tmp/sni.pcap -Y "tls.handshake.type == 1" -T fields -e ip.src -e ip.dst -e tls.handshake.extensions_server_name 2>/dev/null
iptables -L CHAN -v -n | grep -E "pkts|STRING"
