// app.js — API thử nghiệm của Lab 10 (Node 22 + pino). Chạy: node app.js  (cổng 3000, sau nginx)
// Cố ý có: một endpoint chậm, một endpoint gọi dịch vụ đã tắt (ECONNREFUSED), một endpoint làm sập tiến trình.
const http = require('node:http');
const pino = require('pino');
const pinoHttp = require('pino-http');

const log = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: { service: 'shop-api' },                       // trường cố định trên MỌI dòng
  redact: ['req.headers.authorization', 'req.headers.cookie'], // không bao giờ ghi token/cookie
});
const httpLog = pinoHttp({
  logger: log,
  genReqId: (req) => req.headers['x-request-id'] || 'local-' + Date.now(), // nginx gửi $request_id sang
  customLogLevel: (req, res, err) => (err || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const json = (res, code, body) => { res.statusCode = code; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(body)); };
let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648; // tất định

async function route(req, res) {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/products') { await sleep(5 + Math.floor(rnd() * 30)); return json(res, 200, [{ id: 1, name: 'Ao thun' }]); }
  if (url.pathname === '/api/report') { await sleep(1200 + Math.floor(rnd() * 600)); return json(res, 200, { rows: 120 }); }
  if (url.pathname === '/api/export') { await sleep(6500); return json(res, 200, { ok: true }); }
  if (url.pathname === '/api/login' && req.method === 'POST') {
    let body = ''; for await (const c of req) body += c;
    const { user } = JSON.parse(body || '{}');          // KHÔNG đưa password vào log
    req.log.warn({ user }, 'login failed: bad credentials');
    return json(res, 401, { error: 'invalid credentials' });
  }
  const m = url.pathname.match(/^\/api\/orders\/(\d+)$/);
  if (m) {
    try {
      const r = await fetch('http://127.0.0.1:41999/stock/' + m[1]);  // dịch vụ kho — đã tắt trong lab
      return json(res, 200, await r.json());
    } catch (err) {
      req.log.error({ err, orderId: Number(m[1]) }, 'inventory call failed');
      return json(res, 500, { error: 'internal error' });
    }
  }
  if (url.pathname === '/api/crash') {
    Promise.reject(new Error('cache warmup failed: redis not ready')); // quên await/catch ⇒ sập cả tiến trình
    return json(res, 202, { started: true });
  }
  return json(res, 404, { error: 'not found' });
}

http.createServer((req, res) => { httpLog(req, res); route(req, res); }).listen(3000, () => log.info({ port: 3000 }, 'server started'));
