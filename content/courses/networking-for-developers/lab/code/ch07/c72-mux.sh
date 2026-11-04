# Ch7 · 7.2 — ghép kênh: BA yêu cầu trên MỘT kết nối, mỗi cái một luồng (stream id 1, 3, 5) — giải mã bằng khoá phiên
tshark -r /tmp/c72.pcap -o tls.keylog_file:/tmp/c72keys.log -Y 'http2.type==1' -T fields -e http2.streamid -e http2.headers.method -e http2.headers.path -e http2.headers.status 2>/dev/null | head -8
