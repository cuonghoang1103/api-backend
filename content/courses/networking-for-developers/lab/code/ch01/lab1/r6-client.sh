# Lab 1 · R6 — trên máy client: gọi đường /hong/ qua nginx
curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://10.10.2.10/hong/
