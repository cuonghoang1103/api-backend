# Lab 3 · R3 — (chạy NỀN trên laptop) mỗi 5 giây: giờ, TTL còn lại, IP của api ⇒ /tmp/r3.txt
for i in $(seq 1 34); do printf '%s  ' "$(date +%T)"; dig +noall +answer api.labflow.test | awk '{ printf "TTL %-4s %s\n", $2, $5 }'; sleep 5; done > /tmp/r3.txt
