# Ch1 · 1.5 — máy api: một server nghe 127.0.0.1:4000, một server nghe 0.0.0.0:4001, rồi thử nghe trùng cổng
@ node -e "require('net').createServer(s=>s.end('hi from 127.0.0.1:4000\n')).listen(4000,'127.0.0.1')" & sleep 0.5
@ node -e "require('net').createServer(s=>s.end('hi from 0.0.0.0:4001\n')).listen(4001,'0.0.0.0')" & sleep 0.8
ss -tlnp
nc -w 1 127.0.0.1 4000
nc -w 1 10.10.2.20 4000
nc -w 1 10.10.2.20 4001
node -e "require('net').createServer().listen(4001,'0.0.0.0').on('error',e=>console.log(e.code, e.message))"
