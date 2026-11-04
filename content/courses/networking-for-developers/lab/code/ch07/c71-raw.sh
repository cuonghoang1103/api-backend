# Ch7 · 7.1 — HTTP/1.1 là văn bản: tự gõ một yêu cầu bằng tay rồi đọc nguyên văn câu trả lời (dòng trạng thái + header + thân)
printf 'GET / HTTP/1.1\r\nHost: labflow.test\r\nConnection: close\r\n\r\n' | nc -q1 10.10.2.10 80
