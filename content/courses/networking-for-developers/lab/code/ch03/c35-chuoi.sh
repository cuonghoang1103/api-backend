# Ch3 · 3.5 — chuỗi tin cậy DNSSEC của labflow.test, đọc từ dưới lên: chữ ký (RRSIG) ⇐ khoá (DNSKEY) ⇐ DS ở vùng cha ⇐ … ⇐ mỏ neo gốc
dig +dnssec +noall +answer labflow.test A
dig +noall +answer labflow.test DNSKEY @203.0.113.53 | awk '{ print $1, $4, $5, $6, $7, substr($8, 1, 16) "…" }'
dig +noall +answer labflow.test DS @192.0.2.20
dig +noall +answer labflow.test DNSKEY @203.0.113.53 | dnssec-dsfromkey -a SHA-256 -f - labflow.test
dig +noall +answer test DS @192.0.2.10
cat /dnsz/anchor.conf
dig labflow.test | grep -E '^;; flags'
delv -a /dnsz/anchor.conf labflow.test A 2>&1 | head -2
delv -a /dnsz/anchor.conf static.labflow.test A 2>&1
