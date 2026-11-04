# Ch4 · 4.1 — không ai nghe ở cổng đó ⇒ nhận RST (reset), KHÁC với không có đường về (treo)
# api nghe 3000; thử cổng 4999 (trống) ⇒ kernel của api trả RST ngay ⇒ "Connection refused"
curl -s --max-time 3 http://10.10.2.20:4999/ ; echo "exit=$?"
# đọc lại gói: SYN đi ra, R (reset) quay về — không bao giờ có ESTAB nên KHÔNG có TIME-WAIT
ss -tan '( dport = :4999 )'
