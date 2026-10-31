# Lab 1 · R6 — trên máy api: sửa — gắn 0.0.0.0
@ pkill -f 'listen.4999' ; sleep 0.3
@ node -e "require('http').createServer((q,s)=>s.end('lab1 fixed\n')).listen(4999,'0.0.0.0')" > /dev/null 2>&1 & sleep 0.8
ss -tlnp 'sport = :4999'
