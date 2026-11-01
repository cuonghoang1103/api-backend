# Lab 3 · R5 — laptop, ngay sau khi vùng cha đã sửa: resolver vẫn giữ DS cũ trong cache (TTL 3600)
dig labflow.test | grep -E 'status|EDE'
dig +noall +answer labflow.test DS @192.0.2.20
