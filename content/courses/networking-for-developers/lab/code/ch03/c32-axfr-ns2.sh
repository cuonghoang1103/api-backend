# Ch3 · 3.2 — trên ns2: ns2 được phép chép (bỏ chữ ký DNSSEC cho gọn) và đang giữ cùng serial với ns1
dig @203.0.113.53 labflow.test AXFR +nodnssec | grep -v -E 'RRSIG|NSEC|DNSKEY|^;|^$' | head -8
dig +short @127.0.0.1 labflow.test SOA
