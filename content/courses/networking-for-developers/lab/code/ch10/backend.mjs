// Ch10 lab — một backend tí hon cho demo cân bằng tải. Chạy nhiều bản với ID + PORT khác nhau; nginx/ socat đứng trước.
// Trả JSON khai TÊN backend đã phục vụ (để thấy LB chia request đi đâu) + IP nó THẤY (client thật hay proxy).
// Đường: /health (200 ok), /slow (3s — cho 504), /break (500 — cho 502/retry), còn lại trả thông tin backend.
import http from 'node:http';

const ID = process.env.BE_ID || process.argv[2] || 'be?';
const PORT = Number(process.env.BE_PORT || process.argv[3] || 3001);

http.createServer((req, res) => {
  if (req.url === '/health') { res.writeHead(200, { 'content-type': 'text/plain' }); res.end('ok\n'); return; }
  if (req.url.startsWith('/slow')) { setTimeout(() => { res.writeHead(200); res.end(`${ID} slow\n`); }, 3000); return; }
  if (req.url.startsWith('/break')) { res.writeHead(500); res.end(`${ID} error\n`); return; }
  const s = req.socket;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    backend: ID,
    path: req.url,
    seenFrom: s.remoteAddress,                              // ai gõ cửa backend: client thật (L4) hay proxy (L7)
    forwardedFor: req.headers['x-forwarded-for'] || null,   // L7 proxy điền; L4 thì null
  }) + '\n');
}).listen(PORT, '0.0.0.0', () => console.log(`${ID} on :${PORT}`));
