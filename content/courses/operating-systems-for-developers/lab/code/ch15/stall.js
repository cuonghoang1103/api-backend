// stall.js — máy chủ trả lời trong ~1 ms, NHƯNG cứ mỗi giây "đứng hình" 200 ms (giả một lần dọn rác dài / một việc
// đồng bộ nặng chặn event loop). Dùng để thấy coordinated omission (bài 15.6).   node stall.js [cổng] [ms đứng] [chu kỳ ms]
const http = require('node:http');
const port = +(process.argv[2] || 8090), stallMs = +(process.argv[3] || 200), every = +(process.argv[4] || 1000);
setInterval(() => { const t = Date.now(); while (Date.now() - t < stallMs); }, every);   // chặn event loop
http.createServer((req, res) => res.end('ok\n')).listen(port, () => console.log(`stall.js on :${port}: ${stallMs} ms stall every ${every} ms`));
