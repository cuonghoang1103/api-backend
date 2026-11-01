# Lab 3 · R4 (sự cố A) — laptop: so ủy quyền ở vùng cha với NS của chính vùng, rồi chạy bộ kiểm
dig +noall +authority +additional labflow.test NS @192.0.2.20 +norecurse
dig +short NS labflow.test @203.0.113.53
dig +time=2 +tries=1 labflow.test SOA @203.0.113.55 | grep -E 'timed out|no servers'
./kiem-dns.sh
