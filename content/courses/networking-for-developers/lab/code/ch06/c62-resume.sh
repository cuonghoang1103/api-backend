# Ch6 · 6.2 — tái dùng phiên (session resumption): bắt tay đầy đủ MỘT lần, các lần sau rẻ hơn
echo "== lần 1 (bắt tay đầy đủ) — lưu vé phiên =="
{ sleep 1; echo Q; } | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -tls1_3 -CAfile /tmp/root.crt -sess_out /tmp/sess.pem 2>/dev/null | grep -iE "New,|Reused"
echo "== lần 2 (nối lại bằng vé đã lưu) — Reused =="
echo Q | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -tls1_3 -CAfile /tmp/root.crt -sess_in /tmp/sess.pem 2>/dev/null | grep -iE "New,|Reused"
