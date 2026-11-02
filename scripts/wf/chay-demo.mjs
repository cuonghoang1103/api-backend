#!/usr/bin/env node
/**
 * chay-demo.mjs — chạy mọi ví dụ của khoá Web Foundations trong CHROMIUM THẬT (Playwright) và ghi output.
 *
 *   node scripts/wf/chay-demo.mjs            # mọi thư mục trong content/courses/web-foundations/_demo/
 *   node scripts/wf/chay-demo.mjs 11-1 12-2  # chỉ vài bài
 *
 * Với mỗi tệp trong _demo/<bài>/:
 *   *.js   ⇒ script CỔ ĐIỂN (không strict trừ khi tự ghi 'use strict') — như <script src>
 *   *.mjs  ⇒ <script type="module"> (luôn strict, this ở cấp cao nhất = undefined)
 *   *.html ⇒ mở trang qua máy chủ http tạm (127.0.0.1, cổng ngẫu nhiên); <meta name="chup" content="800x450">
 *            ⇒ chụp ảnh khung nhìn ra <tên>.png; <meta name="cho" content="1500"> ⇒ chờ thêm N ms trước khi chốt;
 *            <meta name="mo-phong" content="colorScheme=dark,reducedMotion=reduce"> ⇒ giả lập media (prefers-color-scheme…).
 *            <meta name="cho-xong"> ⇒ chờ tới khi trang đặt window.__xong = true rồi mới chốt output + chụp ảnh.
 * Ghi <tên>.out.txt = các dòng console (mỗi lời gọi một dòng) + "Uncaught <Tên>: <thông điệp>" cho lỗi chưa bắt.
 * Tệp có dòng đầu chứa "chay: tay" ⇒ bỏ qua (output do công cụ khác chụp — Vitest, Vite…, ghi tay *.out.txt).
 *
 * Định dạng console bắt chước bản xem trước của DevTools: chuỗi in thẳng; trong object/mảng chuỗi có nháy đơn;
 * mảng [1, 2], object {a: 1}, Map(2) {'a' => 1}, Set(1) {1}, hàm ƒ ten(), lỗi "TypeError: …".
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(GOC, 'package.json'));
const { chromium } = require('playwright');
const DEMO = path.join(GOC, 'content/courses/web-foundations/_demo');
const chi = process.argv.slice(2);

const FORMAT = `(() => {
  const fmt = (v, d = 0, top = false) => {
    if (typeof v === 'string') return top ? v : "'" + v + "'";
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint') return Object.is(v, -0) ? '-0' : String(v) + (typeof v === 'bigint' ? 'n' : '');
    if (typeof v === 'symbol') return v.toString();
    if (typeof v === 'function') return (/^class\\b/.test(Function.prototype.toString.call(v)) ? 'class ' : 'ƒ ') + (v.name || '') + (/^class\\b/.test(Function.prototype.toString.call(v)) ? '' : '()');
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (d > 3) return Array.isArray(v) ? '[…]' : '{…}';
    if (v instanceof RegExp) return String(v);
    if (v instanceof Date) return v.toISOString();
    if (v instanceof Map) return 'Map(' + v.size + ') {' + [...v].map(([k, x]) => fmt(k, d + 1) + ' => ' + fmt(x, d + 1)).join(', ') + '}';
    if (v instanceof Set) return 'Set(' + v.size + ') {' + [...v].map((x) => fmt(x, d + 1)).join(', ') + '}';
    if (Array.isArray(v)) return '[' + v.map((x) => fmt(x, d + 1)).join(', ') + ']';
    if (typeof Element !== 'undefined' && v instanceof Element) return '<' + v.tagName.toLowerCase() + (v.id ? '#' + v.id : '') + (v.className && typeof v.className === 'string' ? '.' + v.className.trim().split(/\\s+/).join('.') : '') + '>';
    const ten = v.constructor && v.constructor !== Object && v.constructor.name ? v.constructor.name + ' ' : '';
    const ks = Object.keys(v);
    return ten + '{' + ks.map((k) => (/^[A-Za-z_$][\\w$]*$/.test(k) ? k : "'" + k + "'") + ': ' + fmt(v[k], d + 1)).join(', ') + '}';
  };
  const lines = (window.__dong = []);
  for (const m of ['log', 'info', 'warn', 'error', 'debug', 'table']) {
    const goc = console[m].bind(console);
    console[m] = (...a) => { lines.push(a.map((x) => fmt(x, 0, true)).join(' ')); goc(...a); };
  }
  window.addEventListener('error', (e) => { lines.push('Uncaught ' + (e.error ? e.error.name + ': ' + e.error.message : e.message)); });
  window.addEventListener('unhandledrejection', (e) => { const r = e.reason; lines.push('Uncaught (in promise) ' + (r instanceof Error ? r.name + ': ' + r.message : String(r))); });
})();`;

// máy chủ tĩnh cho _demo/
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webm': 'video/webm', '.vtt': 'text/vtt' };
const srv = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/__trong') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end('<!doctype html><meta charset="utf-8"><title>demo</title>'); }
  const f = path.join(DEMO, path.normalize(decodeURIComponent(u.pathname)).replace(/^([/\\])+/, ''));
  if (!f.startsWith(DEMO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('Not Found'); }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const GOC_URL = `http://127.0.0.1:${srv.address().port}`;

const browser = await chromium.launch();
let n = 0;
const dirs = fs.readdirSync(DEMO).filter((d) => fs.statSync(path.join(DEMO, d)).isDirectory() && !d.startsWith('_') && (!chi.length || chi.includes(d))).sort();
for (const d of dirs) {
  for (const f of fs.readdirSync(path.join(DEMO, d)).sort()) {
    const p = path.join(DEMO, d, f);
    const ext = path.extname(f);
    if (!['.js', '.mjs', '.html'].includes(ext)) continue;
    const src = fs.readFileSync(p, 'utf8');
    if (/chay:\s*tay/.test(src.split('\n')[0])) continue;
    const page = await browser.newPage({ viewport: { width: 1000, height: 600 } });
    await page.addInitScript(FORMAT);
    let chup = null, cho = 300;
    if (ext === '.html') {
      const m = /<meta name="chup" content="(\d+)x(\d+)"/.exec(src); if (m) { chup = [+m[1], +m[2]]; await page.setViewportSize({ width: chup[0], height: chup[1] }); }
      const w = /<meta name="cho" content="(\d+)"/.exec(src); if (w) cho = +w[1];
      // <meta name="mo-phong" content="colorScheme=dark,reducedMotion=reduce"> ⇒ page.emulateMedia(...)
      const mp = /<meta name="mo-phong" content="([^"]+)"/.exec(src);
      if (mp) await page.emulateMedia(Object.fromEntries(mp[1].split(',').map((kv) => kv.trim().split('='))));
      await page.goto(`${GOC_URL}/${d}/${f}`, { waitUntil: 'load' });
    } else {
      await page.goto(`${GOC_URL}/__trong`, { waitUntil: 'load' });
      await page.addScriptTag(ext === '.mjs' ? { url: `${GOC_URL}/${d}/${f}`, type: 'module' } : { url: `${GOC_URL}/${d}/${f}` }).catch(() => {});
    }
    await page.waitForTimeout(cho);
    if (ext === '.html' && /<meta name="cho-xong"/.test(src)) await page.waitForFunction(() => window.__xong === true, null, { timeout: 15000 });
    const lines = await page.evaluate(() => window.__dong);
    const out = p.replace(/\.(m?js|html)$/, '.out.txt');
    fs.writeFileSync(out, lines.join('\n') + '\n');
    if (chup) await page.screenshot({ path: p.replace(/\.html$/, '.png') });
    await page.close();
    n++;
    console.log(`✓ ${d}/${f}  (${lines.length} dòng${chup ? ', ảnh ' + chup.join('×') : ''})`);
  }
}
await browser.close();
srv.close();
console.log(`chạy ${n} demo trong Chromium ${browser.version ? '' : ''}xong.`);
