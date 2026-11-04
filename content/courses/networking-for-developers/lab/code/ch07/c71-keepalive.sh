# Ch7 · 7.1 — keep-alive: HTTP/1.1 mặc định giữ kết nối; hai yêu cầu dùng CHUNG một kết nối TCP
curl -s -o /dev/null -v http://10.10.2.10/ http://10.10.2.10/ 2>&1 | grep -iE 'Connected to|Re-us|reusing|^> GET|^< HTTP'
