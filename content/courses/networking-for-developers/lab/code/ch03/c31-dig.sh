# Ch3 · 3.1 — laptop hỏi một tên: stub (dig) ⇒ resolver nhà mạng 198.51.100.1. Đọc từng phần câu trả lời; hỏi lần hai (đã có trong cache)
cat /etc/resolv.conf
dig www.labflow.test
dig www.labflow.test | grep -E 'Query time|^www|^labflow'
