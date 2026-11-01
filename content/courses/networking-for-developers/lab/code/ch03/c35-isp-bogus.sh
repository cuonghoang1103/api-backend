# Ch3 · 3.5 — trên resolver nhà mạng: bao lâu nó nhớ một câu trả lời hỏng, và xoá riêng các câu "bogus"
unbound-control get_option val-bogus-ttl
unbound-control flush_bogus
