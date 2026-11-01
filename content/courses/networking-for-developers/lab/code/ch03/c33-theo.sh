# Ch3 · 3.3 — (chạy NỀN trên laptop) hỏi api.labflow.test qua resolver mỗi 15 giây, ghi giờ + TTL còn lại + IP ⇒ /tmp/theo.txt
for i in $(seq 1 13); do printf '%s  ' "$(date +%T)"; dig +noall +answer api.labflow.test | awk '{ printf "TTL %-4s %s\n", $2, $5 }'; sleep 15; done > /tmp/theo.txt
