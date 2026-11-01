# Ch3 · 3.5 — laptop: resolver kiểm DNSSEC từ chối câu trả lời (SERVFAIL + lý do EDE); +cd (checking disabled) cho thấy dữ liệu vẫn còn
dig labflow.test | grep -E 'status|EDE'
dig +cd +short labflow.test
dig +dnssec +noall +answer labflow.test A @203.0.113.53 | awk '$4 == "RRSIG" { print "RRSIG valid from", $10, "until", $9 }'
date -u +%Y%m%d%H%M%S
