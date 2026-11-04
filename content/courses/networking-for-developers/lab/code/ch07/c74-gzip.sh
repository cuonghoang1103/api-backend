# Ch7 · 7.4 — nén: client khai Accept-Encoding, máy chủ trả Content-Encoding: gzip và thân nhỏ hơn hẳn
echo "== không nén =="
curl -sk -o /dev/null -w "   dài thân: %{size_download} byte\n" https://10.10.2.10:8443/api/
echo "== có nén (--compressed gửi Accept-Encoding) =="
curl -sk --compressed -D - -o /dev/null https://10.10.2.10:8443/api/ 2>/dev/null | grep -iE "content-encoding|content-length"
