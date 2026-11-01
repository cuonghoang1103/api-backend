# Ch3 · 3.4 — (chạy NỀN trên laptop) mỗi giây hỏi 198.19.1.1 "anh là ai" ⇒ /tmp/any.txt
for i in $(seq 1 10); do printf '%s  ' "$(date +%T)"; dig @198.19.1.1 id.server CH TXT +short +time=1 +tries=1 | head -1; sleep 1; done > /tmp/any.txt
