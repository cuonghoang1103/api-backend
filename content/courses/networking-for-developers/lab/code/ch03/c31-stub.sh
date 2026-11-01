# Ch3 · 3.1 — phía STUB trên laptop: /etc/hosts đi TRƯỚC DNS (nsswitch.conf). getent/curl/Node dns.lookup hỏi qua getaddrinfo; dig/dns.resolve hỏi thẳng DNS
grep '^hosts' /etc/nsswitch.conf
echo '203.0.113.11 labflow.test   # added for testing, forgot to remove' >> /etc/hosts
getent ahosts labflow.test | head -1
dig +short labflow.test
curl -s http://labflow.test/
node -e "const d=require('dns'); d.lookup('labflow.test',(e,a)=>console.log('dns.lookup  ', a)); d.resolve4('labflow.test',(e,a)=>console.log('dns.resolve4', a))"
@ grep -v 'forgot to remove' /etc/hosts > /tmp/h; cat /tmp/h > /etc/hosts
