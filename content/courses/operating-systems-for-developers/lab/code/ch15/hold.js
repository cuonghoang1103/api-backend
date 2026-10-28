// hold.js — máy chủ TCP giữ MỌI kết nối mở (như một máy chủ WebSocket/SSE), đếm số kết nối đang giữ và lỗi accept (bài 15.7).
//   node hold.js CỔNG          (in kết quả sau 6 giây)
const net = require('node:net');
let open = 0, peak = 0, errors = {};
const srv = net.createServer((s) => { open++; peak = Math.max(peak, open); s.on('close', () => open--); s.on('error', () => {}); });
srv.on('error', (e) => { errors[e.code] = (errors[e.code] || 0) + 1; });
srv.listen(+process.argv[2], () => console.log(`hold.js pid ${process.pid}: ulimit -n says ${require('node:child_process').execSync('ulimit -n', { shell: '/bin/bash' }).toString().trim()}`));
setTimeout(() => { console.log(`held at peak: ${peak} connections, server errors: ${JSON.stringify(errors)}`); process.exit(0); }, 6000);
