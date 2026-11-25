// app.js — API thử của Lab 15: log JSON một dòng mỗi request ra stdout (Docker bắt). Chỉ dùng trong lab.
const http = require('node:http');
const crypto = require('node:crypto');
let loi = process.env.FAIL_PAY === '1';
const log = (o) => process.stdout.write(JSON.stringify({ time: new Date().toISOString(), svc: 'shop-api', ...o }) + '\n');
http.createServer((req, res) => {
  const t0 = process.hrtime.bigint(), rid = crypto.randomUUID().slice(0, 8);
  const xong = (status, extra = {}) => {
    res.writeHead(status, { 'content-type': 'application/json', 'x-request-id': rid }).end(JSON.stringify({ status }));
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    log({ level: status >= 500 ? 'error' : 'info', msg: 'request', rid, method: req.method, path: req.url, status, ms: +ms.toFixed(1), ...extra });
  };
  if (req.url === '/healthz') return xong(200);
  if (req.url === '/admin/fail-on') { loi = true; return xong(200); }
  if (req.url === '/admin/fail-off') { loi = false; return xong(200); }
  if (req.url.startsWith('/api/pay')) return loi ? xong(502, { err: 'ECONNREFUSED payment-gw:9000' }) : xong(200);
  if (req.url.startsWith('/api/orders')) return setTimeout(() => xong(200), 20 + Math.floor(Math.random() * 30));
  xong(404);
}).listen(+process.env.PORT || 3000, () => log({ level: "info", msg: "started", port: +process.env.PORT || 3000 }));
