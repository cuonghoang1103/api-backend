// slow.js — "API chậm" dùng chung cho mọi bài I/O của chương: GET /?ms=100 trả lời sau 100 ms (như một lời gọi CSDL
// hay API bên ngoài). GET /stats trả {served, peak} — peak = số request ĐANG chờ cùng lúc cao nhất — rồi đặt lại.
const http = require('node:http');
let inflight = 0, peak = 0, served = 0;
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/stats') {
    res.end(JSON.stringify({ served, peak }) + '\n');
    served = 0; peak = 0;
    return;
  }
  const ms = Number(u.searchParams.get('ms') ?? 100);
  inflight++; peak = Math.max(peak, inflight);
  setTimeout(() => { inflight--; served++; res.end('ok\n'); }, ms);
}).listen(9000, () => console.log('slow API on :9000 — every request waits ?ms= (default 100 ms)'));
