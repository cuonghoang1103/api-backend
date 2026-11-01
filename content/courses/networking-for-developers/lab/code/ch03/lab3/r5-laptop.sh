# Lab 3 · R5 (sự cố B) — laptop: triệu chứng, +cd, rồi so DS ở vùng cha với DS tính từ DNSKEY đang công bố
dig labflow.test | grep -E 'status|EDE'
dig +cd +short labflow.test
dig +noall +answer labflow.test DS @192.0.2.20
dig +noall +answer labflow.test DNSKEY @203.0.113.53 | dnssec-dsfromkey -a SHA-256 -f - labflow.test
./kiem-dns.sh | grep -E 'DNSSEC|FAIL'
