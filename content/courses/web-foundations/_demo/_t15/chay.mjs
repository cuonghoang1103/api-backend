// chay: tay — Chương 15: những phép đo cần máy chủ chậm, CDP (bộ nhớ) hoặc múi giờ giả lập.
// node content/courses/web-foundations/_demo/_t15/chay.mjs   ⇒ ghi _t15/out/*.out.txt
//   15.1 chan/   : CSS/JS chặn lần vẽ đầu — máy chủ tạm cố tình trả /slow.css, /slow.js chậm 1 s; đo first-contentful-paint
//   15.4 bo-nho/ : gắn/gỡ widget 30 lần, ép gom rác (HeapProfiler.collectGarbage) rồi đọc heap + bộ đếm DOM (Memory.getDOMCounters)
//   15.5 ngay/   : cùng một script chạy ở hai múi giờ (Asia/Ho_Chi_Minh, America/New_York), đồng hồ cố định bằng page.clock
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(HERE, '../../../../../package.json'));
const { chromium } = require('playwright');
const ghi = (ten, s) => fs.writeFileSync(path.join(HERE, 'out', ten + '.out.txt'), s.replace(/\n+$/, '') + '\n');
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));

// ── máy chủ tạm: tệp tĩnh trong _t15 + ba đường cố tình chậm ─────────────────
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };
const srv = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  const ms = Number(u.searchParams.get('ms') || 0);
  if (u.pathname === '/fast.css') { res.writeHead(200, { 'content-type': 'text/css' }); return res.end('h1 { color: #4f46e5; }'); }
  if (u.pathname === '/slow.css') { await ngu(ms); res.writeHead(200, { 'content-type': 'text/css' }); return res.end('h1 { color: #4f46e5; }'); }
  if (u.pathname === '/chain.css') { await ngu(500); res.writeHead(200, { 'content-type': 'text/css' }); return res.end('@import url("/slow.css?ms=1000");\nh1 { font-size: 40px; }'); }
  if (u.pathname === '/slow.js') { await ngu(ms); res.writeHead(200, { 'content-type': 'text/javascript' }); return res.end('window.loaded = true;'); }
  const f = path.join(HERE, path.normalize(decodeURIComponent(u.pathname)).replace(/^([/\\])+/, ''));
  if (!f.startsWith(HERE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('Not Found'); }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const GOC = `http://127.0.0.1:${srv.address().port}`;
const trinh = await chromium.launch();

// ── 15.1: thứ gì chặn lần vẽ đầu? ───────────────────────────────────────────
{
  const trang = [
    ['a-fast-css', 'fast stylesheet'],
    ['b-slow-css', 'stylesheet that takes 1 s'],
    ['c-print-css', 'same slow stylesheet, media="print"'],
    ['d-import-chain', 'chain.css (0.5 s) that @imports slow.css (1 s)'],
    ['e-sync-script', '<script src> that takes 1 s, in <head>'],
    ['f-defer-script', 'same script with defer'],
  ];
  const dong = [];
  for (const [ten, moTa] of trang) {
    const ketQua = [];
    for (let lan = 0; lan < 3; lan++) {                       // 3 lần, lấy trung vị
      const page = await trinh.newPage();
      await page.goto(`${GOC}/chan/${ten}.html`, { waitUntil: 'load' });
      await page.waitForTimeout(200);
      ketQua.push(await page.evaluate(() => {
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        const nav = performance.getEntriesByType('navigation')[0];
        return [fcp ? fcp.startTime : NaN, nav.domContentLoadedEventStart];
      }));
      await page.close();
    }
    const trungVi = (i) => ketQua.map((k) => k[i]).sort((x, y) => x - y)[1];
    const tron = (x) => String(Math.round(x / 10) * 10).padStart(5);   // làm tròn 10 ms: số đo đổi chút ít mỗi lần
    dong.push(`${ten.padEnd(16)} first paint ≈${tron(trungVi(0))} ms   DOMContentLoaded ≈${tron(trungVi(1))} ms   ${moTa}`);
  }
  ghi('15-1-chan-ve', dong.join('\n'));
}

// ── 15.4: bộ nhớ ─────────────────────────────────────────────────────────────
async function doBoNho(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('HeapProfiler.enable');
  return async () => {
    await cdp.send('HeapProfiler.collectGarbage');
    await cdp.send('HeapProfiler.collectGarbage');
    const { usedSize } = await cdp.send('Runtime.getHeapUsage');
    const dem = await cdp.send('Memory.getDOMCounters');
    return { mb: usedSize / 1048576, nodes: dem.nodes, listeners: dem.jsEventListeners };
  };
}
{
  const page = await trinh.newPage();
  await page.goto(`${GOC}/bo-nho/cycle.html`, { waitUntil: 'load' });
  const do_ = await doBoNho(page);
  const r0 = await do_();
  await page.evaluate(() => makeAndKeep(20));
  const r1 = await do_();
  await page.evaluate(() => dropAll());
  const r2 = await do_();
  ghi('15-4-vong', [
    `start                                   heap ${r0.mb.toFixed(1)} MB`,
    `20 pairs a <-> b (each ~2 MB), kept     heap ${r1.mb.toFixed(1)} MB`,
    `keep = [] (cycles unreachable), GC     heap ${r2.mb.toFixed(1)} MB`,
  ].join('\n'));
  await page.close();
}
{
  const ten = await (async () => {
    const p = await trinh.newPage();
    await p.goto(`${GOC}/bo-nho/widgets.html`, { waitUntil: 'load' });
    const k = await p.evaluate(() => Object.keys(SCENARIOS));
    await p.close();
    return k;
  })();
  const dong = [];
  for (const kichBan of ten) {
    const page = await trinh.newPage();                       // mỗi kịch bản một trang sạch
    await page.goto(`${GOC}/bo-nho/widgets.html`, { waitUntil: 'load' });
    const do_ = await doBoNho(page);
    const r0 = await do_();
    await page.evaluate((k) => runScenario(k, 30), kichBan);
    const r1 = await do_();
    const tang = r1.mb - r0.mb;
    dong.push(`${kichBan.padEnd(34)} heap +${tang.toFixed(1).padStart(5)} MB   DOM nodes ${String(r0.nodes).padStart(5)} → ${String(r1.nodes).padStart(5)}   listeners ${r0.listeners} → ${r1.listeners}`);
    await page.close();
  }
  ghi('15-4-gan-go-30-lan', ['30 × mount + unmount, then garbage collection:', ...dong].join('\n'));
}

// 15.4 — bài lab: 50 toast hiện rồi đóng (bằng hàm close trả về), đo như người học đo bằng DevTools
{
  const page = await trinh.newPage();
  await page.goto(`${GOC}/bo-nho/lab-toasts.html`, { waitUntil: 'load' });
  const do_ = await doBoNho(page);
  const r0 = await do_();
  await page.evaluate(() => { for (let i = 0; i < 50; i++) showToast('Saved #' + i)(); });
  const r1 = await do_();
  const conLai = await page.evaluate(() => document.querySelectorAll('.toast').length);
  ghi('15-4-lab-toasts', [
    `toasts on screen after closing 50: ${conLai}`,
    `JS heap:            ${r0.mb.toFixed(1)} MB → ${r1.mb.toFixed(1)} MB`,
    `event listeners:    ${r0.listeners} → ${r1.listeners}`,
    `DOM nodes:          ${r0.nodes} → ${r1.nodes}`,
  ].join('\n'));
  await page.close();
}

// ── 15.5: ngày giờ ở hai múi giờ, đồng hồ cố định ───────────────────────────
{
  const tep = fs.readdirSync(path.join(HERE, 'ngay')).filter((f) => f.endsWith('.js')).sort();
  for (const zone of ['Asia/Ho_Chi_Minh', 'America/New_York']) {
    const ctx = await trinh.newContext({ timezoneId: zone, locale: 'en-US' });
    for (const f of tep) {
      const page = await ctx.newPage();
      await page.clock.setFixedTime(new Date('2026-12-05T10:00:00+07:00'));   // "hôm nay" = 05/12/2026 10:00 giờ VN
      const dong = [];
      page.on('console', (m) => dong.push(m.text()));
      page.on('pageerror', (e) => dong.push('Uncaught ' + e.name + ': ' + e.message));
      await page.goto(`${GOC}/bo-nho/cycle.html`.replace('bo-nho/cycle.html', 'ngay/trong.html'));
      await page.addScriptTag({ url: `${GOC}/ngay/${f}` });
      await page.waitForTimeout(100);
      const nhan = zone === 'Asia/Ho_Chi_Minh' ? 'vn' : 'ny';
      ghi(`15-5-${f.replace(/\.js$/, '')}-${nhan}`, `[computer time zone: ${zone}]\n` + dong.join('\n'));
      await page.close();
    }
    await ctx.close();
  }
}

await trinh.close();
srv.close();
console.log('xong — xem _t15/out/');
