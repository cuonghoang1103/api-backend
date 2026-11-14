# 14.4 · góc kẻ xấu — nft-vps: người giữ máy chủ VPN nhìn vào wg0 (gói đã được GIẢI MÃ) thấy gì
tshark -r /tmp/thay.pcap -Y "http.request" -T fields -e ip.src -e http.host -e http.request.uri -e urlencoded-form.value 2>/dev/null
tshark -r /tmp/thay.pcap -Y "tls.handshake.type == 1" -T fields -e ip.src -e tls.handshake.extensions_server_name 2>/dev/null
