# Ch7 · 7.4 — CORS: trình duyệt gửi preflight OPTIONS trước; máy chủ trả các header Access-Control-Allow-* rồi mới gọi thật
echo "== preflight: OPTIONS kèm Origin + Access-Control-Request-Method =="
curl -sk -X OPTIONS -D - -o /dev/null \
  -H "Origin: https://app.labflow.test" -H "Access-Control-Request-Method: POST" \
  https://10.10.2.10:8443/cors 2>/dev/null | grep -iE "^HTTP|access-control-allow"
echo "== HSTS trên mọi câu trả lời =="
curl -sk -D - -o /dev/null https://10.10.2.10:8443/ 2>/dev/null | grep -i strict-transport-security
