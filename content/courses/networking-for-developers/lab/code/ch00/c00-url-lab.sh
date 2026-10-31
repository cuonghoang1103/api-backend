# Mục 0 · bài 0.2 — cùng phép đo curl -w nhưng trong phòng lab (không DNS, không TLS, đường ngắn) — máy client
for i in 1 2 3; do curl -s -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\n' http://10.10.2.10/api/hello; done
ping -c 3 10.10.2.10
