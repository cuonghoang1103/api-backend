# Ch6 · 6.3 — chuỗi tin cậy: máy chủ gửi lá + trung gian; lá do trung gian ký, trung gian do gốc ký
echo "== máy chủ gửi mấy chứng chỉ (nên là 2: lá + trung gian) =="
echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -showcerts 2>/dev/null | grep -cE "BEGIN CERTIFICATE"
echo "== ai ký cho ai (s = chủ thể, i = nơi cấp) — đọc từ trên xuống: lá ← trung gian ← gốc =="
echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -showcerts 2>/dev/null | grep -E " [si]:" | head -4
echo "== client kiểm chuỗi tới gốc tin cậy: Verify return code 0 = đáng tin =="
echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -CAfile /tmp/root.crt 2>/dev/null | grep -i "Verify return code"
