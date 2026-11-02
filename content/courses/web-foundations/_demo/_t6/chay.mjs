// chay: tay — Chương 6 trong Chromium thật (Playwright): prefetch gọi GET-xoá, form method="put" thành GET,
// fetch thấy gì với từng mã trạng thái, trình duyệt tự gửi If-None-Match (304 mà JS thấy 200), form GET → query string.
// Cổng 3456 phải trống. node content/courses/web-foundations/_demo/_t6/chay.mjs
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(HERE, '../../../../../package.json'));
const { chromium } = require('playwright');
const ghi = (ten, s) => fs.writeFileSync(path.join(HERE, 'out', ten + '.out.txt'), s.replace(/\n+$/, '') + '\n');
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));

// ── máy chủ API của chương (tiến trình con, PID tự quản) ──
const con = spawn(process.execPath, [path.join(HERE, 'server.mjs')], { stdio: ['ignore', 'pipe', 'inherit'] });
let logApi = '';
con.stdout.on('data', (d) => (logApi += d));
await ngu(800);
const B = 'http://localhost:3456';

// ── máy chủ "thiết kế sai" cho bài 6.2: GET /notes/:id/delete xoá thật ──
let notes = ['Buy milk', 'Call Lan', 'Pay rent'];
const logXau = [];
const xau = http.createServer((req, res) => {
  logXau.push(`${req.method} ${req.url}`);
  const m = req.url.match(/^\/notes\/(\d+)\/delete$/);
  if (m) {
    notes = notes.filter((_, i) => i !== Number(m[1]));
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('deleted');
  }
  if (req.url.startsWith('/save')) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html><title>Notes</title>
<link rel="prefetch" href="/notes/1/delete">
<ul>${notes.map((n, i) => `<li>${n} <a href="/notes/${i}/delete">Delete</a></li>`).join('')}</ul>
<form method="put" action="/save"><input name="price" value="7000"><button>Save</button></form>`);
});
await new Promise((r) => xau.listen(0, '127.0.0.1', r));
const X = `http://127.0.0.1:${xau.address().port}`;

const trinh = await chromium.launch();
try {
  // 6.2a — không ai bấm, vẫn có GET xoá
  const p1 = await trinh.newPage();
  await p1.goto(X + '/');
  await ngu(1500);
  ghi('prefetch', [
    'Page opened. Nobody clicked anything. Waited 1.5 s.',
    'Requests the server received:',
    ...logXau.map((l) => '  ' + l),
    `Notes left on the server: ${JSON.stringify(notes)}`,
  ].join('\n'));

  // 6.2b — form method="put" bị trình duyệt đổi thành GET
  logXau.length = 0;
  await p1.click('button');
  await p1.waitForLoadState('load');
  ghi('form-put', [
    '<form method="put" action="/save"> … <button>Save</button>  — clicked Save',
    'What the server received:',
    ...logXau.map((l) => '  ' + l),
    'Address bar now: ' + p1.url().replace(X, ''),
  ].join('\n'));
  await p1.close();

  // 6.3 — fetch thấy gì với từng mã
  const p2 = await trinh.newPage();
  await p2.goto(B + '/api/products/1');
  const bang = await p2.evaluate(async () => {
    const rows = [];
    const thu = async (nhan, url, init) => {
      try {
        const res = await fetch(url, init);
        rows.push(`${nhan.padEnd(28)} status ${res.status}  ok ${String(res.ok).padEnd(5)}  redirected ${String(res.redirected).padEnd(5)}  url ${new URL(res.url).pathname}`);
      } catch (e) {
        rows.push(`${nhan.padEnd(28)} threw ${e.name}: ${e.message}`);
      }
    };
    await thu('GET /api/products/1', '/api/products/1');
    await thu('GET /old-products (301)', '/old-products');
    await thu('GET /api/products/999', '/api/products/999');
    await thu('GET /api/admin/stats', '/api/admin/stats');
    await thu('POST invalid product', '/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"name":""}' });
    await thu('GET /api/crash', '/api/crash');
    await thu('GET a port nobody listens on', 'http://localhost:3999/');
    return rows.join('\n');
  });
  ghi('fetch-status', bang);

  // 6.4 — trình duyệt tự gửi If-None-Match; mạng 304, JS thấy 200
  const cdp = await p2.context().newCDPSession(p2);
  await cdp.send('Network.enable');
  const mang = [];
  const ynm = new Map();
  const tho = new Map();
  cdp.on('Network.requestWillBeSentExtraInfo', (e) => ynm.set(e.requestId, e.headers['If-None-Match'] || e.headers['if-none-match']));
  cdp.on('Network.responseReceivedExtraInfo', (e) => tho.set(e.requestId, e.statusCode));
  cdp.on('Network.responseReceived', (e) => { if (e.response.url.endsWith('/api/products/2')) mang.push(e); });
  const js = await p2.evaluate(async () => {
    const a = await fetch('/api/products/2');
    const b = await fetch('/api/products/2');
    return [`1st fetch: JS sees status ${a.status}, ETag ${a.headers.get('ETag')}`, `2nd fetch: JS sees status ${b.status}, body ${await b.text()}`];
  });
  await ngu(300);
  ghi('etag-browser', [
    ...js,
    'On the network (Chrome DevTools Protocol):',
    ...mang.map((e, i) => `  request ${i + 1}: sent If-None-Match ${ynm.get(e.requestId) ?? '(none)'} → server answered ${tho.get(e.requestId)}, JS was given ${e.response.status}`),
  ].join('\n'));
  await p2.close();

  // 6.5 — form GET đặt các ô vào query string
  const p3 = await trinh.newPage();
  await p3.setContent(`<form action="${B}/api/products" method="get">
  <input name="q" value="desk lamp"> <input name="category" value="home"> <button>Search</button></form>`);
  await p3.click('button');
  await p3.waitForLoadState('load');
  ghi('form-get', [
    '<form action="/api/products" method="get"> with q = "desk lamp", category = "home" — clicked Search',
    'Address bar: ' + p3.url().replace(B, ''),
    'Page shows: ' + (await p3.textContent('body')),
  ].join('\n'));
  await p3.close();
} finally {
  await trinh.close();
  xau.close();
  con.kill();
}
ghi('server-log-browser', '$ node server.mjs   (log during the browser run)\n' + logApi.trim());
console.log('ok');
