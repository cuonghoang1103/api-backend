#!/bin/bash
# bench-short.sh <cổng> <nhãn> — bài 11.3: 50 kết nối, 10 s vào GET /f-code-k20 (tạo link f-code-k20 trước), in một dòng tóm tắt
npx autocannon -c 50 -d 10 -j "http://localhost:$1/f-code-k20" 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const r=JSON.parse(s);console.log(process.argv[1].padEnd(26), Math.round(r.requests.average)+' chuyển hướng/s', '· p50', r.latency.p50+' ms', '· p99', r.latency.p99+' ms', '· tổng', r.requests.total, '· lỗi', r.errors)})" "$2"
