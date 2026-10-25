/**
 * _pg-do-toa-do.mjs — ĐO TOẠ ĐỘ thật của các khối trên từng slide deck pg-* (để video chú thích ToDanh/khoanh TRÚNG dòng,
 * không đo bằng mắt). Dựng y hệt trang của `_render-slides.mjs` (body thô, viewport 1280×720), rồi lấy getBoundingClientRect.
 *
 *   node scripts/slides-src/_pg-do-toa-do.mjs scripts/slides-src/pg-00-1.mjs [--out <tệp.json>] [--slide 7]
 *
 * Toạ độ in ra ĐÃ NHÂN 1,5 = toạ độ khung 1920×1080 mà <Slide> (src/khung/TrinhChieu.tsx) dùng cho children.
 * Mỗi slide: h2 · li · .o (hộp) · .card · .kw · tr (bảng) · .ln (dòng SQL) · .pl (dòng psql) · .steps>div · svg text/rect.
 * Ghi JSON: { "<n>": [{ k: 'li', i, t: 'chữ (≤60)', x, y, w, h }] } — kèm bảng chữ gọn ra stdout.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const deckPath = args.find((a) => a.endsWith('.mjs'));
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
if (!deckPath) { console.error('cần đường dẫn deck .mjs'); process.exit(1); }
const { deck, slides } = await import(pathToFileURL(path.resolve(deckPath)).href);
const chi = val('--slide') ? Number(val('--slide')) : 0;
const K = 1.5;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const kq = {};
for (const [i, s] of slides.entries()) {
  if (chi && chi !== i + 1) continue;
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box;margin:0;padding:0}body{width:1280px;height:720px;overflow:hidden}</style>${s.body}`, { waitUntil: 'load' });
  await page.waitForTimeout(60);
  const ds = await page.evaluate(() => {
    const out = [];
    const sel = [['h2', '.pg h2'], ['h1', '.pg h1'], ['li', '.pg .nd li'], ['o', '.pg .nd .o'], ['card', '.pg .nd .card'], ['kw', '.pg .nd .kw'],
      ['tr', '.pg .nd tr'], ['ln', '.pg .vs .ln'], ['pl', '.pg .term .pl'], ['step', '.pg .nd .steps>div'], ['p', '.pg .nd > p, .pg .nd .hai > p'],
      ['phu', '.pg .phu'], ['svgtext', '.pg svg text'], ['svgrect', '.pg svg rect'], ['term', '.pg .term'], ['vs', '.pg pre.vs'], ['tbl', '.pg .nd table'], ['vsd', '.pg .nd .vsd>div']];
    // phần tử tự dựng gắn data-k="tên" ⇒ đo với k = tên (đếm i theo tên)
    const dem = {};
    document.querySelectorAll('[data-k]').forEach((el) => {
      const k = el.getAttribute('data-k'); const r = el.getBoundingClientRect(); const idx = (dem[k] = (dem[k] ?? -1) + 1);
      out.push({ k, i: idx, t: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60), x: r.x, y: r.y, w: r.width, h: r.height });
    });
    for (const [k, q] of sel) {
      document.querySelectorAll(q).forEach((el, idx) => {
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        const d = { k, i: idx, t: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60), x: r.x, y: r.y, w: r.width, h: r.height };
        if (['li', 'p', 'step', 'o', 'card', 'h2'].includes(k)) {
          // từng dòng chữ thật: gộp các mảnh rect cùng hàng
          const rg = document.createRange(); rg.selectNodeContents(el);
          const hang = [];
          for (const q of rg.getClientRects()) {
            if (q.width < 2 || q.height < 2) continue;
            const h = hang.find((z) => Math.abs(z.y + z.h / 2 - (q.y + q.height / 2)) < q.height * 0.45);
            if (h) { const x2 = Math.max(h.x + h.w, q.x + q.width); h.x = Math.min(h.x, q.x); h.w = x2 - h.x; h.y = Math.min(h.y, q.y); h.h = Math.max(h.h, q.height); }
            else hang.push({ x: q.x, y: q.y, w: q.width, h: q.height });
          }
          d.dong = hang.sort((a, b) => a.y - b.y).map((z) => [z.x, z.y, z.w, z.h]);
        }
        out.push(d);
      });
    }
    return out;
  });
  kq[i + 1] = ds.map((d) => ({ ...d, x: Math.round(d.x * K), y: Math.round(d.y * K), w: Math.round(d.w * K), h: Math.round(d.h * K), ...(d.dong ? { dong: d.dong.map((z) => z.map((v) => Math.round(v * K))) } : {}) }));
}
await browser.close();
const out = val('--out') || `/Users/admin/Documents/video-bai-giang/src/khung/pg/toado/${deck.key}.json`;
if (!chi) { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, JSON.stringify(kq)); }
for (const [n, ds] of Object.entries(kq)) {
  console.log(`── slide ${n}`);
  for (const d of ds) if (!['svgrect'].includes(d.k)) console.log(`  ${d.k}#${d.i}\t${d.x},${d.y} ${d.w}×${d.h}\t${d.t}${d.dong ? `\n      dòng: ${d.dong.map((z) => z.join(',')).join(' | ')}` : ''}`);
}
console.error(chi ? '(--slide: chỉ in, không ghi JSON)' : `✓ ${out}`);
