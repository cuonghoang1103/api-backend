# Ch7 · 7.3 — HTTP/3 chạy trên QUIC/UDP: cùng nginx vừa nghe TCP 8443 (h1/h2) vừa nghe UDP 8443 (h3)
ss -ulnp 2>/dev/null | grep 8443
ss -tlnp 2>/dev/null | grep 8443
echo "--- câu trả lời h2 mời nâng lên h3 bằng Alt-Svc ---"
curl -sk --http2 -o /dev/null -D - https://10.10.2.10:8443/ 2>/dev/null | grep -i alt-svc
