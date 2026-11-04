# Ch4 · 4.5 — keep-alive: hai yêu cầu, curl dùng lại kết nối cũ cho yêu cầu thứ hai
curl -s -o /dev/null -v http://10.10.2.10/ http://10.10.2.10/ 2>&1 | grep -iE 'connected to|re-us|reusing|^> GET'
