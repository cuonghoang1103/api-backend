// chay: tay — Chương 7 trong Chromium thật (Playwright): HttpOnly vs document.cookie/localStorage (7.2), CSRF với
// SameSite=Lax vs None (7.2), CORS: request vẫn tới máy chủ, preflight, credentials (7.5). Cổng 3457 phải trống.
// node content/courses/web-foundations/_demo/_t7/chay.mjs
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(HERE, '../../../../../package.json'));
const { chromium } = require('playwright');
const anCong = (s) => s.replace(/127\.0\.0\.1:\d+/g, '127.0.0.1:<port>').replace(/localhost:(?!3457\b)\d+/g, 'localhost:<port>');   // cổng ngẫu nhiên ⇒ output ổn định
const ghi = (ten, s) => fs.writeFileSync(path.join(HERE, 'out', ten + '.out.txt'), anCong(s).replace(/\n+$/, '') + '\n');
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));
const anSid = (s) => s.replace(/sid=[A-Za-z0-9_-]{20,}/g, 'sid=…');

async function chayApp(sameSite) {
  const con = spawn(process.execPath, [path.join(HERE, 'app.mjs')], { stdio: ['ignore', 'pipe', 'inherit'], env: { ...process.env, COOKIE_SAMESITE: sameSite } });
  const log = [];
  con.stdout.on('data', (d) => log.push(...String(d).trim().split('\n')));
  await ngu(700);
  return { con, log };
}
function nghe(handler) {
  const s = http.createServer(handler);
  return new Promise((r) => s.listen(0, '127.0.0.1', () => r(s)));
}
const A = 'http://localhost:3457';

const trinh = await chromium.launch();
try {
  // ── 7.2a: HttpOnly — what a script on the page can read ──
  {
    const { con } = await chayApp('Lax');
    const ctx = await trinh.newContext();
    const page = await ctx.newPage();
    await page.goto(A + '/api/me');
    const out = await page.evaluate(async () => {
      const r = [];
      const login = await fetch('/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'an@example.com', password: 'correct horse battery' }) });
      r.push('login → ' + login.status);
      document.cookie = 'theme=dark; Path=/';                         // an ordinary cookie set by JS
      localStorage.setItem('token', 'eyJhbGciOi…(a JWT kept in localStorage)');
      r.push('fetch /api/me → ' + (await (await fetch('/api/me')).text()) + '   ← the browser attached the HttpOnly cookie');
      // what an injected (XSS) script could steal:
      r.push('document.cookie → "' + document.cookie + '"   ← sid is not visible');
      r.push('localStorage.token → "' + localStorage.getItem('token') + '"');
      return r.join('\n');
    });
    const cookies = (await ctx.cookies()).map((c) => `${c.name}  httpOnly=${c.httpOnly}  sameSite=${c.sameSite}  path=${c.path}`);
    ghi('httponly', out + '\n\nThe browser\'s cookie store for localhost:\n' + cookies.join('\n'));
    await ctx.close();
    con.kill();
    await ngu(300);
  }

  // ── 7.2b: CSRF — a page on another site posts a form to our app ──
  const evil = await nghe((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><title>Win a prize!</title><h1>Congratulations!</h1>
<form id="f" method="post" action="${A}/api/transfer"><input name="to" value="attacker"><input name="amount" value="5000000"></form>
<script>document.getElementById('f').submit()</script>`);
  });
  const E = `http://127.0.0.1:${evil.address().port}`;
  const csrf = [];
  for (const sameSite of ['Lax', 'None']) {
    const { con, log } = await chayApp(sameSite);
    const ctx = await trinh.newContext();
    const page = await ctx.newPage();
    await page.goto(A + '/api/me');
    await page.evaluate(() => fetch('/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'an@example.com', password: 'correct horse battery' }) }));
    log.length = 0;
    await page.goto(E + '/');                                          // the user opens a link in an email
    await page.waitForURL(/transfer/, { timeout: 5000 });
    csrf.push(`--- session cookie with SameSite=${sameSite}${sameSite === 'None' ? '; Secure' : ''} ---`,
      `An is logged in at ${A}, then opens ${E}/ (a different site).`,
      'The page auto-submits <form method="post" action="' + A + '/api/transfer">.',
      'Server log:', ...log.map((l) => '  ' + anSid(l)),
      'Response shown to An: ' + (await page.textContent('body')), '');
    await ctx.close();
    con.kill();
    await ngu(300);
  }
  ghi('csrf', csrf.join('\n'));
  evil.close();

  // ── 7.5: CORS ──
  const apiLog = [];
  let pageOrigin = '';
  const api = await nghe((req, res) => {
    apiLog.push(`${req.method} ${req.url}${req.headers.origin ? `  (Origin: ${req.headers.origin})` : ''}${req.headers.cookie ? '  cookie: ' + req.headers.cookie : ''}`);
    const allow = { 'Access-Control-Allow-Origin': pageOrigin };
    if (req.url === '/nocors') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end('{"secret":"salary list"}'); }
    if (req.url === '/cors') { res.writeHead(200, { 'Content-Type': 'application/json', ...allow }); return res.end('{"products":3}'); }
    if (req.url === '/star') { res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); return res.end('{"ok":true}'); }
    if (req.url === '/creds') {
      res.writeHead(200, { 'Content-Type': 'application/json', ...allow, 'Access-Control-Allow-Credentials': 'true', 'Set-Cookie': 'pref=1; SameSite=None; Secure; Path=/' });
      return res.end('{"ok":true}');
    }
    if (req.url === '/no-preflight') {
      if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }     // answers OPTIONS but allows nothing
      res.writeHead(200, allow); return res.end('{"updated":true}');
    }
    if (req.url === '/products/2') {
      if (req.method === 'OPTIONS') {
        res.writeHead(204, { ...allow, 'Access-Control-Allow-Methods': 'GET, PUT, DELETE', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' });
        return res.end();
      }
      res.writeHead(200, { 'Content-Type': 'application/json', ...allow }); return res.end('{"updated":true}');
    }
    res.writeHead(404); res.end();
  });
  const API = `http://localhost:${api.address().port}`;
  const site = await nghe((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<!doctype html><title>shop front-end</title>'); });
  pageOrigin = `http://127.0.0.1:${site.address().port}`;
  const ctx = await trinh.newContext();
  const page = await ctx.newPage();
  const consoleErr = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErr.push(m.text()); });
  await page.goto(pageOrigin + '/');
  const cors = [];
  const buoc = async (nhan, fn, arg) => {
    apiLog.length = 0;
    consoleErr.length = 0;
    const kq = await page.evaluate(fn, arg);
    await ngu(200);
    cors.push(`> ${nhan}`, `  JavaScript got: ${kq}`, ...apiLog.map((l) => '  server saw: ' + l), ...consoleErr.map((e) => '  console: ' + e.replace(pageOrigin, '<page origin>').replace(API, '<api>')), '');
  };
  const goi = async ({ url, init }) => {
    try { const r = await fetch(url, init); return `status ${r.status}, body ${await r.text()}`; } catch (e) { return `${e.name}: ${e.message}`; }
  };
  await buoc("fetch(api + '/nocors')   — the API sends no CORS header", goi, { url: API + '/nocors' });
  await buoc("fetch(api + '/cors')     — Access-Control-Allow-Origin: <page origin>", goi, { url: API + '/cors' });
  await buoc("fetch(api + '/no-preflight', { method: 'PUT', JSON body }) — OPTIONS answered without permission", goi, { url: API + '/no-preflight', init: { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: '{"price":7000}' } });
  await buoc("fetch(api + '/products/2', { method: 'PUT', JSON body }) — preflight allowed", goi, { url: API + '/products/2', init: { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: '{"price":7000}' } });
  await buoc("fetch(api + '/star', { credentials: 'include' }) — Allow-Origin: *", goi, { url: API + '/star', init: { credentials: 'include' } });
  await buoc("fetch(api + '/creds', { credentials: 'include' }) — exact origin + Allow-Credentials: true", goi, { url: API + '/creds', init: { credentials: 'include' } });
  ghi('cors', `page origin: ${pageOrigin.replace(/:\d+$/, ':<port>')}   api: ${API.replace(/:\d+$/, ':<port>')}  (different host and port ⇒ different origins)\n\n` + cors.join('\n'));
  await ctx.close();
  api.close();
  site.close();
} finally {
  await trinh.close();
}
console.log('ok');
