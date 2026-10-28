// loop-server.js — một tiến trình Node, MỘT luồng chạy JS. /fast trả ngay; /io?ms= chờ kiểu I/O (setTimeout, không chiếm luồng);
// /cpu?ms= bận CPU đồng bộ (vòng lặp) — chính là thứ chặn event loop của mọi yêu cầu khác.
const http = require('http');
// Đo độ trễ của chính event loop: hẹn chạy mỗi 10 ms; chạy muộn bao nhiêu = luồng JS đã bận bấy nhiêu.
let last = performance.now(), maxLag = 0;
setInterval(() => { const t = performance.now(); maxLag = Math.max(maxLag, t - last - 10); last = t; }, 10);

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  const ms = Number(u.searchParams.get('ms') || 0);
  if (u.pathname === '/io') return setTimeout(() => res.end('io done\n'), ms);
  if (u.pathname === '/cpu') { const end = Date.now() + ms; while (Date.now() < end); return res.end('cpu done\n'); }
  if (u.pathname === '/lag') { res.end(`worst event-loop delay since last check: ${maxLag.toFixed(0)} ms\n`); maxLag = 0; return; }
  res.end('fast\n');
}).listen(8080, () => console.log('listening on 8080, pid', process.pid));
