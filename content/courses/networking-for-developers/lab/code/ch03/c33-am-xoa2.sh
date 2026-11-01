# Ch3 · 3.3 — trên máy nhà mạng: vẫn NXDOMAIN — vùng có DNSSEC nên resolver tự suy ra "không có" từ bản ghi NSEC đã nhớ (RFC 8198) ⇒ xoá cả vùng
unbound-control get_option aggressive-nsec
unbound-control flush_zone labflow.test
