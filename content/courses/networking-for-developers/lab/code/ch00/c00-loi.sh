# Mục 0 · sáu thông báo lỗi trông na ná nhau nhưng chỉ tới những tầng khác nhau — máy client
curl -sS http://labflow.invalid/
curl -sS http://10.10.2.20:4999/
curl -sS --max-time 3 http://10.10.9.9/
nc -v -w 1 10.10.2.20 4999
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' http://10.10.2.10/hong/
curl -sS -o /dev/null -w 'HTTP %{http_code} after %{time_total}s\n' http://10.10.2.10/cham/api/slow
