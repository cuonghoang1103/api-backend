# Ch2 · 2.4 — "localhost" có HAI địa chỉ: ::1 và 127.0.0.1 (bẫy kinh điển của Node.js ≥ 17)
getent ahosts localhost
@ node -e "require('http').createServer((q,s)=>s.end('dev server on 127.0.0.1:5000\n')).listen(5000,'127.0.0.1')" & sleep 1
ss -tln 'sport = :5000'
node -e "require('dns').lookup('localhost', {all: true}, (e, a) => console.log(a))"
curl -s http://localhost:5000/
node -e "fetch('http://localhost:5000/').then(r=>r.text()).then(t=>process.stdout.write('node 22 fetch: '+t))"
node --no-network-family-autoselection -e "fetch('http://localhost:5000/').then(r=>r.text()).then(console.log).catch(e=>console.log('node without autoselect:', e.cause?.code, e.cause?.address + ':' + e.cause?.port))"
@ kill %1
