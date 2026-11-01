# Ch3 · 3.5 — máy chủ tên chết (dead.test): mỗi câu hỏi một tên mới, mỗi câu chờ tối đa 20 s — client chịu bao lâu, nhận được gì?
for n in 1 2 3 4 5 6 7; do s=$(date +%s.%N); r=$(dig +tries=1 +time=20 x$n.dead.test | grep -o 'status: [A-Z]*' || echo 'no answer (timed out)'); printf 'query %d  %-22s after %5.1f s\n' $n "$r" "$(awk "BEGIN { print $(date +%s.%N) - $s }")"; done
