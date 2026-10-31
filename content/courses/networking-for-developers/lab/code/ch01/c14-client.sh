# Ch1 · 1.5 — máy client: phía khách của cùng các kết nối
ss -tanp '( dport = :80 )'
sysctl net.ipv4.ip_local_port_range
for i in 1 2 3; do curl -s http://10.10.2.10/api/hello; done
