// node kiem-tst.mjs <deck.mjs> : đo TRÀN (scrollWidth/scrollHeight) và TRỐNG (nội dung < 70% chiều cao vùng thân) từng slide.
import { createRequire } from 'node:module'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const req = createRequire('/Users/admin/Downloads/api-backend/package.json');
const { chromium } = req('playwright');
const deckPath = process.argv[2];
const { deck, slides } = await import(pathToFileURL(path.resolve(deckPath)).href);
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const html = (b) => `<!doctype html><meta charset="utf-8"><body style="margin:0;width:1280px;height:720px;overflow:hidden">${b}</body>`;
const measure = () => page.evaluate(() => {
  const out = { tran: [], fill: null, cover: !!document.querySelector('.pg.bia') };
  for (const el of document.querySelectorAll('.pg pre, .pg table, .pg .term, .pg .vs, .pg .card, .pg .o, .pg .nd, .pg .hai > *, .pg .vsd > *, .pg .ba > *, .pg .hai, .pg .vsd, .pg .ba')) {
    if (el.tagName !== 'PRE' && el.scrollWidth > el.clientWidth + 2) out.tran.push(`${el.className || el.tagName} ngang ${el.scrollWidth}>${el.clientWidth}`);
    if (el.scrollHeight > el.clientHeight + 2) out.tran.push(`${el.className || el.tagName} dọc ${el.scrollHeight}>${el.clientHeight}`);
  }
  for (const pre of document.querySelectorAll('.pg pre')) {
    const pr = pre.getBoundingClientRect(); const cs = getComputedStyle(pre); const lim = pr.right - parseFloat(cs.paddingRight) * (pr.width / pre.offsetWidth) + 1;
    const rg = document.createRange(); let worst = 0;
    for (const ln of (pre.querySelectorAll('.ln, .pl').length ? pre.querySelectorAll('.ln, .pl') : [pre])) { rg.selectNodeContents(ln); const r = rg.getBoundingClientRect(); if (r.width && r.right > lim) worst = Math.max(worst, Math.round(r.right - lim)); }
    if (worst) out.tran.push(`chữ mã tràn ${worst}px (${pre.className})`);
  }
  const nd = document.querySelector('.pg .nd');
  if (nd) { const r = nd.getBoundingClientRect(); let t = 1e9, b = -1e9;
    for (const c of (nd.querySelector('.tst-fit') ? [nd.querySelector('.tst-fit')] : nd.children)) { if (c.tagName === 'STYLE') continue; const q = c.getBoundingClientRect(); if (q.height === 0) continue; t = Math.min(t, q.top); b = Math.max(b, q.bottom); }
    const cs = getComputedStyle(nd); const inner = r.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    out.fill = b > t ? (b - t) / inner : 0; }
  return out;
});
// tự kiểm bộ kiểm
await page.setContent(html(slides[1].body.replace('<div class="nd', '<div class="nd" style="width:300px"><pre class="vs">' + 'x'.repeat(400) + '</pre><div class="nd')));
const self = await measure(); if (!self.tran.length) { console.error('BỘ KIỂM HỎNG: không bắt được tràn giả'); process.exit(2); }
let bad = 0;
for (const [i, s] of slides.entries()) {
  await page.setContent(html(s.body), { waitUntil: 'load' });
  const m = await measure();
  const loi = [...m.tran];
  if (!m.cover && m.fill !== null && m.fill < 0.70) loi.push(`TRỐNG: nội dung ${(m.fill * 100).toFixed(0)}% chiều cao`);
  if (loi.length) { bad++; console.log(`✗ ${deck.key} #${i + 1}: ${loi.join(' | ')}`); }
}
console.log(`${bad ? '✗' : '✓'} ${deck.key}: ${slides.length} slide, ${bad} slide có vấn đề`);
await browser.close(); process.exit(bad ? 1 : 0);
