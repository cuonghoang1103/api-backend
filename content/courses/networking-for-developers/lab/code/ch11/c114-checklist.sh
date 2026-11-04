# Ch11 · 11.4 — bảng kiểm theo TẦNG, mỗi tầng một lệnh: DNS → routing → port → TLS → HTTP → app.
echo "== DNS (name -> IP; use dig for public names) =="
getent hosts router
echo "== Routing (which gateway) =="
ip route get 10.10.2.10 | head -1
echo "== Port (open or refused) =="
nc -zv 10.10.2.10 80 2>&1; nc -zv -w1 10.10.2.10 81 2>&1
echo "== TLS (certificate + validity) =="
openssl s_client -connect 10.10.2.10:8443 -servername labflow.test </dev/null 2>/dev/null | openssl x509 -noout -subject -dates 2>/dev/null
echo "== HTTP (status line) =="
curl -sI http://10.10.2.10/ | head -1
echo "== App (does the API answer JSON?) =="
curl -s http://10.10.2.20:3000/api/health
