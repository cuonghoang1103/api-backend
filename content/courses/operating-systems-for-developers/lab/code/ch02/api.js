// api.js — API tí hon của bài 2.2/2.5: /health, và /check kiểm email bằng một regex "ngây thơ" (lồng lượng từ ⇒ ReDoS).
// Một input xấu làm regex quay lui theo cấp số nhân ⇒ luồng JS duy nhất kẹt 100% CPU ⇒ cả API ngừng trả lời.
const http = require('http');
// Regex kiểm email kiểu cũ chép trên mạng — phần đuôi ([a-zA-Z0-9]{2,4})+$ lồng lượng từ ⇒ quay lui theo cấp số nhân
const EMAIL = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;   // ❌
const PORT = Number(process.env.PORT || 3000);
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/health') return res.end('ok\n');
  if (u.pathname === '/check') {
    const t = Date.now();
    const ok = EMAIL.test(u.searchParams.get('email') || '');
    return res.end(`${ok} ${Date.now() - t}ms\n`);
  }
  if (u.pathname.startsWith('/api/v1/admin')) { res.statusCode = 401; return res.end('{"error":"unauthorized"}\n'); }
  res.statusCode = 404; res.end('not found\n');
}).listen(PORT, () => console.log(`api listening on :${PORT} pid=${process.pid}`));
