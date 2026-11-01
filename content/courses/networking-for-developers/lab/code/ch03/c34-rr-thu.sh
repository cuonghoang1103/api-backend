# Ch3 · 3.4 — vì sao curl chỉ mất 0,2 s: thử địa chỉ chết TRƯỚC (--resolve ép thứ tự), bấm giờ từng lần thử (--trace-time)
curl -sv --trace-time -o /dev/null --resolve app.labflow.test:80:203.0.113.12,203.0.113.10 http://app.labflow.test/ 2>&1 | grep -E 'Trying|Established'
curl -sv --trace-time -o /dev/null --happy-eyeballs-timeout-ms 1000 --resolve app.labflow.test:80:203.0.113.12,203.0.113.10 http://app.labflow.test/ 2>&1 | grep -E 'Trying|Established'
node thu-dia-chi.mjs
