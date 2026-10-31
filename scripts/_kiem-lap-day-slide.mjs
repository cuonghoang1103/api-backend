/**
 * _kiem-lap-day-slide.mjs — kiểm TỰ ĐỘNG hai lỗi trình bày mà `_kiem-tran-slide.mjs` (chỉ đo tràn dọc cả slide) không thấy,
 * cho deck khuôn PostgreSQL (`.pg` / `.nd` của _pg-chung.mjs và các khuôn dựng trên nó, vd _nfd-chung.mjs):
 *   1. TRÀN NGANG: một khối mã / terminal / bảng / hình trong vùng nội dung có scrollWidth > clientWidth (chữ bị cắt ở mép
 *      phải — .term/.vs đặt overflow:hidden nên trình render cắt im lặng), hoặc mép phải của nó vượt mép vùng nội dung.
 *   2. TRỐNG: phần nội dung thật (từ mép trên phần tử đầu tới mép dưới phần tử cuối) chiếm < NGUONG (mặc định 70 %) chiều cao
 *      vùng .nd ⇒ "nửa dưới trống" — luật khuôn PG: lấp đều khung ({ to: true } / { giua: true } / thêm hình).
 *
 *   node scripts/_kiem-lap-day-slide.mjs --deck scripts/slides-src/nfd-01-3.mjs [--nguong 0.7]
 *   node scripts/_kiem-lap-day-slide.mjs --decks 'scripts/slides-src/nfd-*.mjs'      # nhiều deck, tổng kết cuối
 * Bìa (cover) bỏ qua. Thoát 1 nếu có slide lỗi, 2 nếu bộ đo tự kiểm hỏng.
 * ⚠️ Không sửa `_render-slides.mjs`: chỉ đọc khối CSS của nó (như _kiem-tran-slide.mjs) để đo cùng một bộ style.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const NGUONG = Number(val('--nguong') ?? 0.7);
let decks = [];
if (val('--deck')) decks.push(val('--deck'));
if (val('--decks')) {
  const pat = val('--decks'); const dir = path.dirname(pat); const re = new RegExp('^' + path.basename(pat).replace(/[.]/g, '\\.').replace(/\*/g, '.*') + '$');
  decks.push(...fs.readdirSync(dir).filter((f) => re.test(f)).sort().map((f) => path.join(dir, f)));
}
if (!decks.length) { console.error('cần --deck <file.mjs> hoặc --decks "<thư mục>/<mẫu*.mjs>"'); process.exit(1); }

const W = 1280, H = 720;
const src = fs.readFileSync('scripts/_render-slides.mjs', 'utf8');
const mCss = src.match(/\nconst CSS = `([\s\S]*?)\n`;/);
if (!mCss) { console.error('❌ không tách được khối CSS của _render-slides.mjs — sửa script này.'); process.exit(3); }
const CSS = mCss[1].replace(/\$\{W\}/g, W).replace(/\$\{H\}/g, H);
const html = (body) => `<!doctype html><meta charset="utf-8"><style>${CSS}</style><div class="slide"><div class="bd">${body}</div></div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });

const do1 = async (body) => {
  await page.setContent(html(body), { waitUntil: 'load' });
  return page.evaluate(() => {
    const nd = document.querySelector('.pg .nd');
    if (!nd) return { boQua: true };
    const r = nd.getBoundingClientRect();
    const st = getComputedStyle(nd);
    const inner = { top: r.top + parseFloat(st.paddingTop), bottom: r.bottom - parseFloat(st.paddingBottom), left: r.left + parseFloat(st.paddingLeft), right: r.right - parseFloat(st.paddingRight) };
    const tran = [];
    for (const el of nd.querySelectorAll('pre, .term, .vs, table, svg, .o, .card, .hai, .ba, .vsd, .steps, img')) {
      const er = el.getBoundingClientRect();
      const over = el.scrollWidth - el.clientWidth;
      const vuotPhai = er.right - inner.right;
      if ((el.tagName === 'PRE' && over > 2) || vuotPhai > 3) {
        const txt = (el.innerText || el.tagName).trim().split('\n').find((l) => l.length > 0) || el.tagName;
        tran.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} +${Math.round(Math.max(over, vuotPhai))}px «${txt.slice(0, 60)}»`);
      }
    }
    const kids = [...nd.children].filter((k) => k.getBoundingClientRect().height > 0);
    let top = Infinity, bottom = -Infinity;
    for (const k of kids) { const kr = k.getBoundingClientRect(); top = Math.min(top, kr.top); bottom = Math.max(bottom, kr.bottom); }
    const cao = inner.bottom - inner.top;
    const lap = kids.length ? (bottom - top) / cao : 0;
    const tranDoc = nd.scrollHeight - nd.clientHeight;
    return { tran, lap, tranDoc };
  });
};

// ── tự kiểm bộ kiểm: một slide trống và một slide có dòng mã quá dài PHẢI bị bắt ──
const khung = (inner) => `<style>.pg{position:fixed;inset:0;display:flex;flex-direction:column}.pg .nd{flex:1;padding:22px 84px 10px;overflow:hidden}.pg .term pre,.pg pre{white-space:pre;overflow:hidden;margin:0}</style><div class="pg"><h2>t</h2><div class="nd">${inner}</div><div style="height:58px"></div></div>`;
const g1 = await do1(khung('<p>một dòng</p>'));
const g2 = await do1(khung(`<div class="term"><pre>${'x'.repeat(400)}</pre></div>` + '<p>a</p>'.repeat(14)));
if (!(g1.lap < 0.3) || !(g2.tran.length > 0)) {
  console.error(`❌ BỘ ĐO HỎNG: slide trống lấp=${g1.lap?.toFixed(2)} (phải < 0.3), slide mã dài tràn=${g2.tran?.length} (phải > 0).`);
  await browser.close(); process.exit(2);
}
console.log(`✓ bộ đo còn hiệu lực (slide giả: trống lấp ${Math.round(g1.lap * 100)} %, mã dài tràn ${g2.tran[0]})\n`);

let tong = 0, loi = 0;
for (const d of decks) {
  const { deck, slides } = await import(pathToFileURL(path.resolve(d)).href);
  const xau = [];
  for (const [i, s] of slides.entries()) {
    if (/class="pg bia"/.test(s.body || '')) continue;
    tong++;
    const r = await do1(s.body || '');
    if (r.boQua) continue;
    const vande = [];
    if (r.tran.length) vande.push('TRÀN NGANG ' + r.tran.join(' · '));
    if (r.tranDoc > 2) vande.push(`TRÀN DỌC +${r.tranDoc}px`);
    if (r.lap < NGUONG) vande.push(`TRỐNG: nội dung chỉ chiếm ${Math.round(r.lap * 100)} % chiều cao`);
    if (vande.length) xau.push(`   ${String(i + 1).padStart(3, '0')}  ${vande.join(' | ')}`);
  }
  loi += xau.length;
  console.log(`${xau.length ? '✗' : '✓'} ${deck.key} (${slides.length} slide)${xau.length ? `: ${xau.length} slide lỗi` : ''}`);
  for (const x of xau) console.log(x);
}
await browser.close();
console.log(`\n${loi ? '✗' : '✓'} ${tong} slide nội dung · ${loi} slide lỗi (ngưỡng lấp ${Math.round(NGUONG * 100)} %)`);
process.exit(loi ? 1 : 0);
