# Ch5 · 5.3 — khi UDP 443 bị chặn (mạng công ty/trường), trình duyệt LÙI về TCP; dịch vụ vẫn chạy, chỉ mất QUIC
echo "== UDP 8443 mở: máy chủ nghe QUIC =="
ss -uln | grep 8443 && echo "   -> client CÓ THỂ thử HTTP/3"
echo "== chặn UDP 8443 (giả lập tường lửa công ty) =="
iptables -A INPUT -p udp --dport 8443 -j DROP
ss -uln | grep 8443 >/dev/null && echo "   (socket vẫn mở, nhưng gói QUIC tới sẽ bị DROP)"
echo "== TCP/HTTP2 vẫn trả 200 — đây là đường lùi của trình duyệt =="
curl -sk --http2 -o /dev/null -w "   HTTP/%{http_version}  mã %{http_code}\n" https://localhost:8443/
iptables -D INPUT -p udp --dport 8443 -j DROP
