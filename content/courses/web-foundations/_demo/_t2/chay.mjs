// chay: tay — đo bằng Playwright những thứ không log được từ trong trang: cây trợ năng (ARIA snapshot), phím Tab thật,
// form gửi tới máy chủ thật. Chạy: node content/courses/web-foundations/_demo/_t2/chay.mjs
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEMO = path.resolve(HERE, '..');
const require = createRequire(path.resolve(HERE, '../../../../../package.json'));
const { chromium } = require('playwright');
const OUT = path.join(HERE, 'out');
const ghi = (ten, s) => fs.writeFileSync(path.join(OUT, ten + '.out.txt'), s.replace(/\n+$/, '') + '\n');

// Máy chủ: phục vụ tệp demo + ghi lại mọi request form nhận được
const nhat = [];
const srv = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/search' || u.pathname === '/signup') {
    let body = '';
    req.on('data', (d) => (body += d));
    req.on('end', () => {
      nhat.push(`${req.method} ${req.url}` + (body ? `\ncontent-type: ${req.headers['content-type']}\nbody: ${body}` : ''));
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end('<p>received</p>');
    });
    return;
  }
  const f = path.join(DEMO, decodeURIComponent(u.pathname));
  if (!f.startsWith(DEMO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': f.endsWith('.svg') ? 'image/svg+xml' : 'text/html; charset=utf-8' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const GOC = `http://127.0.0.1:${srv.address().port}`;

const trinh = await chromium.launch();
const mo = async (rel) => { const p = await trinh.newPage({ viewport: { width: 1000, height: 600 } }); await p.goto(`${GOC}/${rel}`); return p; };

// 2.2 — ảnh tới chậm 1 giây: phần chữ bên dưới có nhảy không
{
  const p = await trinh.newPage({ viewport: { width: 1000, height: 600 } });
  await p.route('**/*.svg*', async (r) => { await new Promise((x) => setTimeout(x, 1000)); await r.continue(); });
  await p.goto(`${GOC}/2-2/cho-giu-cho.html`, { waitUntil: 'commit' });
  await p.waitForSelector('#under-b');
  const do1 = () => p.evaluate(() => ['a', 'b'].map((x) => Math.round(document.getElementById('under-' + x).getBoundingClientRect().top)));
  const [a0, b0] = await do1();
  await p.waitForLoadState('load');
  const [a1, b1] = await do1();
  ghi('anh-giu-cho', `while the images download: text A at y=${a0}, text B at y=${b0}\nafter they arrive:        text A at y=${a1}, text B at y=${b1}\nlayout shift:             text A jumped ${a1 - a0}px, text B jumped ${b1 - b0}px`);
  await p.close();
}

// 2.3 — cùng giao diện, hai cây trợ năng
for (const [rel, ten] of [['2-3/div-soup.html', 'aria-div-soup'], ['2-3/semantic.html', 'aria-semantic']]) {
  const p = await mo(rel);
  ghi(ten, await p.locator('body').ariaSnapshot());
  await p.close();
}

// 2.3 — đi bằng bàn phím: Tab tới đâu, Enter có bấm được không
for (const [rel, ten] of [['2-3/div-soup.html', 'tab-div-soup'], ['2-3/semantic.html', 'tab-semantic']]) {
  const p = await mo(rel);
  const canhBao = [];
  p.on('dialog', async (d) => { canhBao.push(d.message()); await d.dismiss(); });
  const dong = [];
  for (let i = 1; i <= 5; i++) {
    await p.keyboard.press('Tab');
    const t = await p.evaluate(() => { const e = document.activeElement; return e === document.body ? null : e.tagName.toLowerCase() + ' "' + e.textContent.trim() + '"'; });
    if (!t) break;
    dong.push(`Tab ${i}: ${t}`);
  }
  if (!dong.length) dong.push('Tab 1: nothing — no element on this page can receive focus');
  const nut = await p.locator(rel.includes('semantic') ? 'button' : '.btn');
  await nut.focus().catch(() => {});
  await p.keyboard.press('Enter');
  await p.waitForTimeout(100);
  dong.push(`Enter on the Like control: ${canhBao.length ? 'alert "' + canhBao[0] + '"' : 'nothing happened'}`);
  ghi(ten, dong.join('\n'));
  await p.close();
}

// 2.4 — form thật, máy chủ thật
{
  const p = await mo('2-4/gui-form.html');
  await p.click('#tim');
  await p.waitForLoadState();
  await p.goto(`${GOC}/2-4/gui-form.html`);
  await p.click('#dk');
  await p.waitForLoadState();
  ghi('form-may-chu', nhat.join('\n\n'));
  await p.close();
}

// 2.5 — bảng trong cây trợ năng + thứ tự Tab
{
  const p = await mo('2-5/bang.html');
  ghi('aria-bang', await p.locator('table').ariaSnapshot());
  await p.close();
  const q = await mo('2-5/tab-thu-tu.html');
  const dong = [];
  for (let i = 1; i <= 6; i++) {
    await q.keyboard.press('Tab');
    const t = await q.evaluate(() => { const e = document.activeElement; return e === document.body ? null : e.id; });
    if (!t) break;
    dong.push(`Tab ${i} → ${t}`);
  }
  ghi('tab-thu-tu', dong.join('\n'));
  await q.close();
}
await trinh.close();
srv.close();
console.log('xong');
