# Ch3 · 3.4 — GeoDNS: static.labflow.test là CNAME sang DNS của CDN; CDN trả IP tuỳ resolver nào hỏi
dig +short static.labflow.test
dig @198.19.1.1 +short static.labflow.test
curl -s http://static.labflow.test/
