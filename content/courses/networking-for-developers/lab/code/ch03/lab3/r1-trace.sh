# Lab 3 · R1 — bản đồ ủy quyền: ai giữ phần nào của tên, TTL ở mỗi cấp, vùng nào có ký
dig +trace +nodnssec www.labflow.test | grep -v -E '^;; global|^; <<>>|^$'
dig +trace +nodnssec static.labflow.test | grep -E 'IN\s+(NS|A|CNAME)\s|Received' | tail -6
delv -a /dnsz/anchor.conf static.labflow.test 2>&1 | grep '^;'
