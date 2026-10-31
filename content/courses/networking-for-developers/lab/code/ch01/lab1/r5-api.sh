# Lab 1 · R5 — trên máy api: request mà nginx chuyển tiếp tới (kết nối THỨ HAI của cùng một lần gọi)
tshark -r /tmp/r5.pcap -Y http.request -T fields -E header=y -e ip.src -e tcp.srcport -e ip.dst -e tcp.dstport -e http.request.uri -e http.x_forwarded_for 2>/dev/null
tshark -r /tmp/r5.pcap -Y http.request -O http 2>/dev/null | grep -E '^    (GET|Host|X-Forwarded-For|Connection)'
