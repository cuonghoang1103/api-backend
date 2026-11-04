# Ch10 · 10.1 — nginx L7 cân bằng tải round-robin trước 3 backend: mỗi yêu cầu đi một backend khác nhau, xoay vòng.
for i in 1 2 3 4 5 6; do curl -s http://10.10.2.10:8080/ | grep -o '"backend":"[^"]*"'; done
