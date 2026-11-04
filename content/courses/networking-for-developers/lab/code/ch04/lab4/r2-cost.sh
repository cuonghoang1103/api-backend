# Lab 4 · R2 — chi phí một kết nối mới so với dùng lại, trên đường trễ 25 ms
echo "== một kết nối mỗi yêu cầu (không keep-alive) =="
for i in 1 2 3; do curl -so /dev/null -w "  req$i  connect=%{time_connect}s  ttfb=%{time_starttransfer}s\n" -H 'Connection: close' http://10.10.2.10/; done
echo "== dùng lại một kết nối (keep-alive) =="
curl -so /dev/null -w "  conn#%{num_connects}  ttfb=%{time_starttransfer}s\n" http://10.10.2.10/ http://10.10.2.10/ http://10.10.2.10/
