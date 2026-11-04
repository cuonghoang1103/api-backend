# Ch9 · 9.1 — Server-Sent Events: MỘT kết nối, nhiều sự kiện máy chủ đẩy. Header trước, rồi dòng sự kiện (cắt sau ~7s).
curl -s -D - -o /dev/null --max-time 1 http://10.10.2.20:5100/sse | grep -iE "HTTP/|content-type|cache-control|x-accel|connection"
curl -N -s --max-time 7 http://10.10.2.20:5100/sse
