# Ch5 · 5.2 — phía máy chủ QUIC là THẬT trong lab: nginx có module HTTP/3, nghe UDP, quảng cáo Alt-Svc
nginx -V 2>&1 | tr ' ' '\n' | grep -i http_v3
echo "--- nginx HTTP/3 đang nghe trên UDP 8443 (QUIC) và TCP 8443 (TLS) ---"
ss -ulnp 2>/dev/null | grep 8443
ss -tlnp 2>/dev/null | grep 8443
echo "--- câu trả lời qua TCP/HTTP2 kèm Alt-Svc mời nâng lên h3 ---"
curl -sk --http2 -o /dev/null -w "giao thức dùng: HTTP/%{http_version}\n" -D - https://localhost:8443/ | grep -iE "alt-svc"
