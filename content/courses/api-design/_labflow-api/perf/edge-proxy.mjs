// perf/edge-proxy.mjs — bài 10.1: một "CDN" đứng trước LabFlow, cắt request như Cloudflare:
// origin không trả header trong EDGE_TIMEOUT_MS (mặc định 100 s; thật: Cloudflare 125 s, nginx proxy_read_timeout 60 s) ⇒ 524.
//   node perf/edge-proxy.mjs [cổng=8090] [origin=4000]
import http from 'node:http';

const [port = 8090, origin = 4000] = process.argv.slice(2).map(Number);
const TIMEOUT = Number(process.env.EDGE_TIMEOUT_MS ?? 100_000);
http.createServer((req, res) => {
  const t0 = Date.now();
  const up = http.request({ port: origin, path: req.url, method: req.method, headers: req.headers }, (r) => {
    clearTimeout(timer);
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });
  const timer = setTimeout(() => {                             // hết kiên nhẫn: trả 524 cho client, bỏ kết nối tới origin
    console.log(`524 ${req.method} ${req.url} sau ${((Date.now() - t0) / 1000).toFixed(1)} s`);
    res.writeHead(524, { 'content-type': 'text/plain' }).end('error code: 524 (A timeout occurred)\n');
    up.destroy();
  }, TIMEOUT);
  up.on('error', () => {});
  req.pipe(up);
}).listen(port, () => console.log(`edge-proxy :${port} → :${origin}, timeout ${TIMEOUT / 1000} s`));
