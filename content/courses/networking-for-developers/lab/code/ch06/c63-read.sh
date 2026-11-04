# Ch6 · 6.3 — đọc một chứng chỉ lá: chủ thể, nơi cấp, tên hợp lệ (SAN), hạn dùng
echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test 2>/dev/null | openssl x509 -noout -subject -issuer -dates -ext subjectAltName 2>/dev/null
