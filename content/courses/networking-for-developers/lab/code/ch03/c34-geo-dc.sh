# Ch3 · 3.4 — từ một máy khác trong DC (ns2; DNS công cộng gần nhất = pop2 Singapore): cùng tên, câu trả lời khác
dig @198.19.1.1 +short static.labflow.test
curl -s --resolve static.labflow.test:80:$(dig @198.19.1.1 +short labflow.cdn.test) http://static.labflow.test/
