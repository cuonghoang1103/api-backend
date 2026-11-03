// Loads slow.html and fast.html in Chromium with a throttled network and CPU, and reads Core Web Vitals
// from the browser's own PerformanceObserver entries. Median of 3 runs each.
//   node measure.mjs   (serves this folder on a local port)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  const f = path.join(process.cwd(), decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0);
const base = `http://localhost:${server.address().port}`;

async function measure(browser, page) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 823 } });   // a phone-sized window
  const tab = await ctx.newPage();
  const cdp = await ctx.newCDPSession(tab);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0;
  tab.on('response', async (r) => { try { bytes += (await r.body()).length; } catch {} });
  await tab.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  await tab.goto(`${base}/${page}`, { waitUntil: 'load' });
  await tab.waitForTimeout(1500);                                      // let the banner arrive
  const r = await tab.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }));
  await ctx.close();
  return { ...r, kb: bytes / 1024 };
}

const browser = await chromium.launch();
for (const page of ['slow.html', 'fast.html', 'best.html']) {
  const runs = [];
  for (let i = 0; i < 3; i++) runs.push(await measure(browser, page));
  const med = (k) => runs.map((r) => r[k]).sort((a, b) => a - b)[1];
  console.log(page.padEnd(10), 'LCP', (med('lcp') / 1000).toFixed(2) + ' s', '| CLS', med('cls').toFixed(3), '| downloaded', Math.round(med('kb')) + ' KB');
}
await browser.close();
server.close();
