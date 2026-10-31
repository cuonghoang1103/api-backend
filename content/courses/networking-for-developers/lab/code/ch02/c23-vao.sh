# Ch2 · 2.3 — từ máy chủ ngoài Internet: có gọi NGƯỢC vào laptop được không?
nc -vz -w 3 192.168.50.10 8080
traceroute -n -q 1 -m 3 192.168.50.10
nc -vz -w 3 198.51.100.2 8080
