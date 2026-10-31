# Ch2 · 2.5 — người dùng: không phải "trang chậm" mà là "tên miền không tồn tại nữa"
dig +tries=1 labflow.test
curl -sS -m 3 http://labflow.test/; echo "curl exit code $?"
curl -sS -m 3 http://203.0.113.10/; echo "curl exit code $?"
traceroute -n -q 1 -N 1 -m 4 203.0.113.10
