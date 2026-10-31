# Lab 1 · R6 — trên máy api: dựng dịch vụ cho đường /hong/ của nginx (cổng 4999), lần đầu gắn NHẦM 127.0.0.1
@ node -e "require('http').createServer((q,s)=>s.end('lab1 fixed\n')).listen(4999,'127.0.0.1')" & SV=$!; sleep 0.8
ss -tlnp 'sport = :4999'
