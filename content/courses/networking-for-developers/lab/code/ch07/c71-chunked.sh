# Ch7 · 7.1 — khi máy chủ chưa biết độ dài: Transfer-Encoding: chunked, mỗi khúc có dòng kích thước (hex) đứng trước
printf 'GET / HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n' | nc -q2 10.10.2.20 4100
