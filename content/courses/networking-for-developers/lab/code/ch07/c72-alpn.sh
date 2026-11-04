# Ch7 · 7.2 — chọn HTTP/2 bằng ALPN trong cú bắt tay TLS (không tốn thêm vòng); curl báo "using HTTP/2"
curl -sk --http2 -o /dev/null -v https://10.10.2.10:8443/ 2>&1 | grep -iE 'ALPN|using HTTP|h2|SSL connection' | head -5
