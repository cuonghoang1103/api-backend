// perf/proxy-rr.mjs — bài 8.3: load balancer tối giản: chia lần lượt (round-robin) cho các instance phía sau
// node perf/proxy-rr.mjs 8080 4001 4002
import http from 'node:http';

const [port, ...ups] = process.argv.slice(2).map(Number);
const agent = new http.Agent({ keepAlive: true });
let i = 0;
http.createServer((req, res) => {
  const up = ups[i++ % ups.length];
  const p = http.request({ host: '127.0.0.1', port: up, path: req.url, method: req.method, agent,
    headers: { ...req.headers, 'x-forwarded-for': req.socket.remoteAddress } }, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });
  p.on('error', () => { res.writeHead(502, { 'content-type': 'application/problem+json' }); res.end(JSON.stringify({ status: 502, title: 'Bad Gateway', detail: `instance :${up} không trả lời` })); });
  req.pipe(p);
}).listen(port, () => console.log(`round-robin :${port} → ${ups.map((u) => `:${u}`).join(', ')}`));
