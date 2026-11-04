# Ch9 · 9.3 — mở rộng kết nối SỐNG LÂU: trần file descriptor; mỗi kết nối mở = 1 socket; lịch nối lại có lùi dần + nhiễu.
ulimit -n
for i in 1 2 3 4 5; do curl -N -s --max-time 4 http://10.10.2.20:5100/sse >/dev/null & done; sleep 1
ss -tan state established | grep -c ':5100'
wait
node /lab/k/code/ch09/backoff.mjs
