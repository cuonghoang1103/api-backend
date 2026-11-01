# Ch3 · 3.5 — trên resolver: nó ghi nhớ 203.0.113.99 không trả lời (rto = thời gian chờ đã tăng tới, ttl = còn nhớ bao lâu)
unbound-control dump_infra | grep 203.0.113.99
unbound-control get_option infra-host-ttl
