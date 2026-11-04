# Ch8 · 8.3 — proxy NUỐT header: origin (:8081) trả Cache-Control đúng; biên hỏng (:8082) dán no-store đè lên (proxy_hide_header + add_header).
curl -s -D - -o /dev/null http://10.10.2.10:8081/img/logo.txt | grep -i cache-control
curl -s -D - -o /dev/null http://10.10.2.10:8082/img/logo.txt | grep -i cache-control
