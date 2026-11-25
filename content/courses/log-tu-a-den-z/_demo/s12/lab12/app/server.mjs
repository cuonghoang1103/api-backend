// API thử Lab 12 — log JSON một dòng mỗi request (kiểu pino: time, level, rid, route, status, ms).
// Mỗi câu SQL mang chú thích /* rid=…,route=… */ (kiểu sqlcommenter) để log PostgreSQL nối ngược về request.
import http from 'node:http';
import crypto from 'node:crypto';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 4, application_name: 'shop-api' });
const log = (o) => process.stdout.write(JSON.stringify({ time: new Date().toISOString(), level: 'info', svc: 'shop-api', ...o }) + '\n');
const q = (ctx, sql, params) => pool.query(`/* rid=${ctx.rid},route=${ctx.route} */ ${sql}`, params);

const routes = [
  ['GET /api/orders', /^\/api\/orders$/, (ctx, m, url) =>
    q(ctx, 'SELECT id, total, status, created_at FROM orders WHERE customer_email = $1 ORDER BY created_at DESC LIMIT 20',
      [url.searchParams.get('email')])],
  ['GET /api/orders/:id', /^\/api\/orders\/(\d+)$/, (ctx, m) =>
    q(ctx, 'SELECT id, customer_email, total, status FROM orders WHERE id = $1', [m[1]])],
  ['GET /api/stats/today', /^\/api\/stats\/today$/, (ctx) =>
    q(ctx, "SELECT count(*) AS n, sum(total) AS revenue FROM orders WHERE created_at >= timestamptz '2026-11-23 00:00+07'")],
];

http.createServer(async (req, res) => {
  const t0 = process.hrtime.bigint();
  const url = new URL(req.url, 'http://x');
  const rid = req.headers['x-request-id'] ?? crypto.randomUUID().slice(0, 8);
  const r = routes.find(([, re]) => re.test(url.pathname));
  let status = 404, body = { error: 'not found' };
  if (r) {
    const ctx = { rid, route: r[0].split(' ')[1] };
    try { const kq = await r[2](ctx, url.pathname.match(r[1]), url); status = 200; body = kq.rows; }
    catch (e) { status = 500; body = { error: 'internal' }; log({ level: 'error', rid, msg: e.message, code: e.code }); }
  }
  res.writeHead(status, { 'content-type': 'application/json', 'x-request-id': rid }).end(JSON.stringify(body));
  log({ rid, method: req.method, route: r ? r[0].split(' ')[1] : url.pathname, status, ms: Number((process.hrtime.bigint() - t0) / 1000n) / 1000 });
}).listen(Number(process.env.PORT), () => log({ msg: 'listening', port: Number(process.env.PORT) }));
