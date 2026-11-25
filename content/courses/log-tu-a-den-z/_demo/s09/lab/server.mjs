// server.mjs — máy chủ Lab 9 (Node 22, không thư viện ngoài). Chạy: node server.mjs  (cwd có public/ và logs/)
//   41901 shop.lgz.test  : trang + app.min.js(+map) + bộ thu lỗi /rum + bộ thu báo cáo CSP /csp
//   41902 api.lgz.test   : API (CORS cho shop), /api/report đi qua "cổng" có timeout 2 s tới dịch vụ báo cáo
//   41904 dịch vụ báo cáo: chậm 5 s (để cổng trả 504)
//   41903 https tự ký    : cho bài 9.4 (lỗi chứng chỉ trong NetLog)
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { SourceMap } from 'node:module';

fs.mkdirSync('logs', { recursive: true });
const ghi = (tep, s) => fs.appendFileSync(`logs/${tep}`, s + '\n');
const SHOP = 'http://shop.lgz.test:41901';
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));

function accessLog(tep, req, res, t0) {          // giống "combined" của nginx + rt + rid
  res.on('finish', () => {
    const t = new Date().toISOString();
    ghi(tep, `${req.socket.remoteAddress.replace('::ffff:', '')} - - [${t}] "${req.method} ${req.url} HTTP/${req.httpVersion}" ` +
      `${res.statusCode} ${res.getHeader('content-length') ?? '-'} "${req.headers.referer ?? '-'}" "${(req.headers['user-agent'] ?? '-').slice(0, 40)}" ` +
      `rt=${((performance.now() - t0) / 1000).toFixed(3)} rid=${res.getHeader('x-request-id')}`);
  });
}
const docThan = (req) => new Promise((ok) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => ok(b)); });

// ---------- source map: đổi vị trí trong app.min.js về tệp gốc
let SM = null;
const sm = () => (SM ??= new SourceMap(JSON.parse(fs.readFileSync('public/app.min.js.map', 'utf8'))));
function giaiMa(stack) {
  return stack.split('\n').map((d) => d.replace(/\(?(https?:\/\/[^\s)]+\/app\.min\.js):(\d+):(\d+)\)?/, (m, u, l, c) => {
    const e = sm().findEntry(+l - 1, +c - 1);
    return e?.originalSource ? `(${e.originalSource.replace(/^.*\/src\//, 'src/')}:${e.originalLine + 1}:${e.originalColumn + 1})` : m;
  })).join('\n');
}

// ---------- 41901: trang + bộ thu
const TYPE = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.map': 'application/json' };
http.createServer(async (req, res) => {
  const t0 = performance.now();
  res.setHeader('X-Request-Id', crypto.randomBytes(8).toString('hex'));
  accessLog('web.log', req, res, t0);
  const url = new URL(req.url, SHOP);
  if (req.method === 'POST' && url.pathname === '/rum') {          // 9.5: lỗi từ người dùng thật
    const raw = await docThan(req);
    if (raw.length > 8192) { res.statusCode = 413; return res.end(); }
    try {
      const b = JSON.parse(raw);
      ghi('rum.log', JSON.stringify({ nhan: new Date().toISOString(), ip: req.socket.remoteAddress.replace('::ffff:', ''),
        loai: b.loai, tin: b.tin, vitri: b.tep ? giaiMa(`(${b.tep}:${b.dong}:${b.cot})`) : null, stackGoc: giaiMa(b.stack || '').split('\n').slice(0, 4),
        trang: b.trang, phienBan: b.phienBan, ua: b.ua }));
      res.statusCode = 204;
    } catch { res.statusCode = 400; }
    return res.end();
  }
  if (req.method === 'POST' && url.pathname === '/csp') {          // 9.5: báo cáo vi phạm CSP (report-uri)
    ghi('csp.log', JSON.stringify({ nhan: new Date().toISOString(), ...JSON.parse(await docThan(req)) }));
    res.statusCode = 204; return res.end();
  }
  const tep = url.pathname === '/' ? '/index.html' : url.pathname;
  const p = 'public' + tep.replace(/\.\./g, '');
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.statusCode = 404; return res.end('not found'); }
  res.setHeader('Content-Type', TYPE[p.slice(p.lastIndexOf('.'))] ?? 'application/octet-stream');
  if (tep === '/index.html') res.setHeader('Content-Security-Policy', "script-src 'self' 'nonce-lab9'; report-uri /csp");
  res.end(fs.readFileSync(p));
}).listen(41901, '127.0.0.1');

// ---------- 41904: dịch vụ báo cáo chậm
http.createServer(async (req, res) => { await ngu(5000); res.end('{"ok":true}'); }).listen(41904, '127.0.0.1');

// ---------- 41902: API
const CORS = { 'Access-Control-Allow-Origin': SHOP, 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Expose-Headers': 'X-Request-Id', 'Access-Control-Allow-Credentials': 'true' };
function hetHan(auth) {                         // JWT giả của lab: chỉ đọc exp, không kiểm chữ ký
  try { return JSON.parse(Buffer.from(auth.split(' ')[1].split('.')[1], 'base64url')).exp * 1000 < Date.now(); } catch { return true; }
}
const json = (res, code, obj, cors = true) => {
  if (cors) for (const [k, v] of Object.entries(CORS)) res.setHeader(k, v);
  res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj));
};
http.createServer(async (req, res) => {
  const t0 = performance.now(); const rid = crypto.randomBytes(8).toString('hex');
  res.setHeader('X-Request-Id', rid);
  accessLog('api.log', req, res, t0);
  const url = new URL(req.url, 'http://api.lgz.test:41902');
  if (req.method === 'OPTIONS') { for (const [k, v] of Object.entries(CORS)) res.setHeader(k, v); res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); res.statusCode = 204; return res.end(); }
  switch (url.pathname) {
    case '/api/products': return json(res, 200, [{ id: 1, ten: 'Bàn phím', gia: 590000 }, { id: 2, ten: 'Chuột', gia: 250000 }, { id: 3, ten: 'Tai nghe', gia: 890000 }]);
    case '/api/login': {
      const b = JSON.parse(await docThan(req) || '{}');
      const tok = ['eyJhbGciOiJIUzI1NiJ9', Buffer.from(JSON.stringify({ sub: b.email, exp: Math.floor(Date.now() / 1000) + 900 })).toString('base64url'), 'GIA_TOKEN·VIDU_chu_ky'].join('.');
      res.setHeader('Set-Cookie', 'sid=s3ss10n_GIA_TOKEN·VIDU_8f2a; HttpOnly; SameSite=Lax; Path=/');
      return json(res, 200, { token: tok });
    }
    case '/api/me':
      if (hetHan(req.headers.authorization ?? '')) {
        res.setHeader('WWW-Authenticate', 'Bearer error="invalid_token", error_description="The access token expired"');
        ghi('app.log', JSON.stringify({ level: 40, time: Date.now(), reqId: rid, msg: 'token hết hạn', path: url.pathname }));
        return json(res, 401, { error: 'invalid_token' });
      }
      return json(res, 200, { email: 'sv.lab9@example.com' });
    case '/api/orders':                          // lỗi trong xử lý: nhánh lỗi quên gắn header CORS
      ghi('app.log', JSON.stringify({ level: 50, time: Date.now(), reqId: rid, msg: 'TypeError: Cannot read properties of undefined (reading \'userId\')', path: url.pathname }));
      return json(res, 500, { error: 'internal' }, false);
    case '/api/report': {                        // "cổng" gọi dịch vụ báo cáo, chờ tối đa 2 s
      const r = await new Promise((ok) => {
        const q = http.get('http://127.0.0.1:41904/', { timeout: 2000 }, (u) => ok(u.statusCode));
        q.on('timeout', () => { q.destroy(); ok('timeout'); }); q.on('error', () => ok('error'));
      });
      if (r === 'timeout') {
        ghi('app.log', JSON.stringify({ level: 50, time: Date.now(), reqId: rid, msg: 'upstream timed out (2000 ms) calling report-svc 127.0.0.1:41904', path: url.pathname }));
        return json(res, 504, { error: 'gateway_timeout' });
      }
      return json(res, 200, { ok: true });
    }
    case '/api/slow': await ngu(800); return json(res, 200, { ok: true });
    case '/api/search': return json(res, 200, { q: url.searchParams.get('q'), ketQua: [] });
    default: return json(res, 404, { error: 'not_found' });
  }
}).listen(41902, '127.0.0.1');

// ---------- 41903: https tự ký (chỉ dùng ở 9.4)
if (fs.existsSync('tls/key.pem')) https.createServer({ key: fs.readFileSync('tls/key.pem'), cert: fs.readFileSync('tls/cert.pem') }, (q, s) => s.end('ok')).listen(41903, '127.0.0.1');
console.log('Lab 9 chạy: 41901 shop, 41902 api, 41903 https tự ký, 41904 report-svc');
