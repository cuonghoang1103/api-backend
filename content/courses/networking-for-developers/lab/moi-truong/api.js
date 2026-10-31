// API tí hon của lab: trả lại cho bạn thấy KẾT NỐI mà nó nhận được (bộ 5: IP/cổng nguồn, IP/cổng đích, TCP).
const http = require('node:http');
http.createServer((req, res) => {
  if (req.url.startsWith('/api/slow')) { setTimeout(() => { res.end('slow\n'); }, 3000); return; }   // cho bài 504
  const s = req.socket;
  const body = JSON.stringify({
    service: 'labflow-api', path: req.url,
    seenFrom: `${s.remoteAddress}:${s.remotePort}`, seenOn: `${s.localAddress}:${s.localPort}`,
    forwardedFor: req.headers['x-forwarded-for'] || null,
  });
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(body + '\n');
}).listen(3000, '0.0.0.0', () => console.log('api listening on 0.0.0.0:3000'));
