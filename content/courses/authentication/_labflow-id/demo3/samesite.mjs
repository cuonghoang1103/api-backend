// demo3/samesite.mjs — lesson 3.2: which cookies real Chromium attaches when ANOTHER site (127.0.0.1:4801) triggers a request
// to LabFlow ID's site (localhost:4802). Four cookies, one per SameSite value; four ways a page can cause a request.
import http from 'node:http';
import { chromium } from 'playwright';

const seen = [];
const bank = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/login') {
    res.setHeader('Set-Cookie', ['strict=1; SameSite=Strict', 'lax=1; SameSite=Lax', 'none=1; SameSite=None; Secure', 'unset=1']);
    return res.end('logged in');
  }
  const names = (req.headers.cookie ?? '').split('; ').filter(Boolean).map((c) => c.split('=')[0]);
  seen.push({ via: url.searchParams.get('via'), method: req.method, site: req.headers['sec-fetch-site'], names });
  res.setHeader('content-type', 'text/html');
  res.end('ok');
}).listen(4802);
const T = 'http://localhost:4802/hit?via=';
const PAGES = {
  link: `<a id="go" href="${T}link">open</a>`,
  form: `<form id="f" method="POST" action="${T}form-post"><input name="email" value="evil@attacker.example"></form><script>f.submit()</script>`,
  img: `<img src="${T}img">`,
  fetch: `<script>fetch('${T}fetch-post', { method: 'POST', mode: 'no-cors', credentials: 'include', body: 'x' })</script>`,
};
const evil = http.createServer((req, res) => { res.setHeader('content-type', 'text/html'); res.end(PAGES[req.url.slice(1)] ?? ''); }).listen(4801, '127.0.0.1');

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto('http://localhost:4802/login');
const run = async (label) => {
  for (const p of ['link', 'form', 'img', 'fetch']) {
    await page.goto(`http://127.0.0.1:4801/${p}`);
    if (p === 'link') await page.click('#go');
    await page.waitForTimeout(400);
  }
  console.log(label);
  for (const s of seen.splice(0)) console.log(`  ${(s.via + ' ' + s.method).padEnd(16)} Sec-Fetch-Site: ${String(s.site).padEnd(11)} cookies sent: ${s.names.join(', ') || '(none)'}`);
};
console.log(`Chromium ${browser.version()} · site localhost:4802, attacker 127.0.0.1:4801`);
await run('cookies set seconds ago:');
await page.waitForTimeout(125e3);
await run('125 s later:');
await browser.close(); bank.close(); evil.close();
