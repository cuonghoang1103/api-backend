// browser-redirect.mjs — bài 11.2: 301 hay 302? Đo trong Chromium thật xem server đếm được bao nhiêu lượt bấm
// node interview/shortener/browser-redirect.mjs http://localhost:4120   (shortener chạy với REDIRECT=301 hoặc 302)
import http from 'node:http';
import { chromium } from 'playwright';

const SHORT = process.argv[2] ?? 'http://localhost:4120';
let landing = 0;                                                    // trang đích thật: đếm số lần trình duyệt tới nơi
const target = http.createServer((req, res) => { landing++; res.setHeader('content-type', 'text/html'); res.end('<h1>CLB F-Code</h1>'); });
await new Promise((r) => target.listen(4121, r));

const alias = 'k20-' + Date.now().toString(36);
const created = await fetch(`${SHORT}/v1/links`, { method: 'POST', headers: { authorization: 'Bearer tok_an', 'content-type': 'application/json' },
  body: JSON.stringify({ url: 'http://127.0.0.1:4121/landing', alias }) }).then((r) => r.json());
const clicks = async () => (await fetch(`${SHORT}/v1/links/${alias}`, { headers: { authorization: 'Bearer tok_an' } }).then((r) => r.json())).clicks;

const browser = await chromium.launch();
for (const who of ['bạn A', 'bạn B']) {                             // hai người = hai hồ sơ trình duyệt riêng
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const codes = [];
  page.on('response', (r) => { if (r.url().startsWith(SHORT)) codes.push(r.status()); });
  for (let i = 0; i < 5; i++) { await page.goto(`${SHORT}/${alias}`); await page.goto('about:blank'); }
  console.log(`${who}: bấm 5 lần · trình duyệt nhận ${codes.join(' ') || '(không request nào tới server)'} · server đếm ${await clicks()} · tới trang đích ${landing}`);
  await ctx.close();
}
await browser.close();
target.close();
