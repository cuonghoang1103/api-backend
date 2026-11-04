# Ch6 · 6.1 — TLS bảo đảm gì: openssl nói chuyện TLS với máy chủ và in giao thức, bộ mã, ALPN và kết quả kiểm chứng chỉ
echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -alpn h2,http/1.1 -CAfile /tmp/root.crt 2>/dev/null | grep -iE "Protocol *:|Cipher *:|ALPN|Verify return code|subject=|issuer="
