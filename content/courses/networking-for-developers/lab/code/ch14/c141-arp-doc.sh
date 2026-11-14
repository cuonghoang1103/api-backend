# 14.1 · nft-ke đọc thứ nó nghe được (chỉ gói ĐI VÀO card của nó)
cat /tmp/arp.log
tshark -r /tmp/nghe.pcap -Y "http.request" -T fields -e ip.src -e http.host -e urlencoded-form.key -e urlencoded-form.value 2>/dev/null
tshark -r /tmp/nghe.pcap -Y "tls.handshake.type == 1" -T fields -e ip.src -e tls.handshake.extensions_server_name 2>/dev/null
