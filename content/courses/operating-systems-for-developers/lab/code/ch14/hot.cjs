// hot.js — một máy chủ HTTP có một hàm "nóng" ăn CPU (Chương 14, bài 14.3; .cjs vì package.json gốc của repo là "type": "module"): để soi bằng sample/top/lsof trên Mac.
const http = require('http');
function hot() { let s = 0; for (let i = 0; i < 1e7; i++) s += Math.sqrt(i); return s; }
http.createServer((req, res) => res.end('ok\n')).listen(3141, () => console.log(`pid ${process.pid} listening on :3141`));
setInterval(hot, 20);
