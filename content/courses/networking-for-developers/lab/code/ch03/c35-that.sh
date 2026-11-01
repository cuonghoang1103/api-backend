# Ch3 · 3.5 — Internet THẬT: tên miền có ký (cloudflare.com), tên miền CỐ Ý ký hỏng (dnssec-failed.org), cuongthai.com (chưa bật DNSSEC), DoH/DoT tới 1.1.1.1
dig +dnssec cloudflare.com A @1.1.1.1 | grep -E '^;; flags|RRSIG'
dig +short DS cloudflare.com
dig dnssec-failed.org @1.1.1.1 | grep -E 'status|EDE'
dig +cd +short dnssec-failed.org @1.1.1.1
dig +short DS cuongthai.com
dig cuongthai.com @1.1.1.1 | grep -E '^;; flags'
dig +short +tls cuongthai.com @1.1.1.1
dig +short +https cuongthai.com @1.1.1.1
curl -s -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=cuongthai.com&type=A'
