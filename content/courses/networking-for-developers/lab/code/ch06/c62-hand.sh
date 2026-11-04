# Ch6 · 6.2 — bắt tay TLS 1.3 từng bước: ClientHello → ServerHello → chứng chỉ → Finished; 1 vòng khứ hồi là xong
echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -tls1_3 -alpn h2 -CAfile /tmp/root.crt 2>/dev/null | grep -iE "^CONNECTED|Protocol|Cipher|ALPN|Verify return|New, TLS|Server certificate|subject=|issuer=|Start Time|TLS session ticket" | head -12
