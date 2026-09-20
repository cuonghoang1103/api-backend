/**
 * _kiem-tran-slide.mjs — ĐO xem slide nào TRÀN khỏi khung 1280×720 trước khi render.
 *
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/nwc204-ch05.mjs
 *
 * Vì sao có file này: `_render-slides.mjs` đặt `body{overflow:hidden}`, nên nội
 * dung thừa bị CẮT ÂM THẦM — lệnh render vẫn exit 0, ảnh vẫn ra, chỉ là mất chữ
 * ở đáy. Đợt NWC204 ch1–4 (20/09/2026) phải mở từng ảnh bằng mắt mới bắt được 6
 * slide tràn. File này làm việc đó bằng số, trong ~4 giây.
 *
 * ⚠️ KHÔNG sửa `_render-slides.mjs` — nó dùng chung cho MAE101/SWR302/SWT301/
 * Web Foundations. File này chỉ ĐỌC khối CSS của nó ra (regex) để đo đúng cùng
 * một bộ style; nếu khối CSS đổi tên biến thì script này DỪNG và báo, chứ không
 * âm thầm đo bằng style rỗng.
 *
 * ⚠️ Đây là bộ kiểm, nên nó phải tự chứng minh là còn hiệu lực: nó tự dựng một
 * slide giả cao 3000px và YÊU CẦU mình bắt được. Bắt hụt là thoát 2.
 * (Bài học [[feedback_verify_the_checker_before_the_content]].)
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const DECK_PATH = val('--deck');
if (!DECK_PATH) { console.error('cần --deck <file.mjs>'); process.exit(1); }

const W = 1280, H = 720;
const src = fs.readFileSync('scripts/_render-slides.mjs', 'utf8');
const mCss = src.match(/\nconst CSS = `([\s\S]*?)\n`;/);
if (!mCss) { console.error('❌ không tách được khối CSS của _render-slides.mjs — file dựng đã đổi, sửa lại script này.'); process.exit(3); }
const CSS = mCss[1].replace(/\$\{W\}/g, W).replace(/\$\{H\}/g, H);

const { deck, slides } = await import(pathToFileURL(path.resolve(DECK_PATH)).href);

const page_html = (s, i, total) => `<!doctype html><meta charset="utf-8"><style>${CSS}</style>
<div class="slide ${s.kind === 'cover' ? 'cover' : ''}">
  <div class="bar"></div>
  ${s.kind === 'cover' ? '' : `<div class="hd"><span>${deck.code} · ${deck.title}</span><span>${i + 1} / ${total}</span></div>`}
  <h1>${s.t}</h1>
  ${s.sub ? `<p class="sub">${s.sub}</p>` : ''}
  <div class="bd">${s.body || ''}</div>
  ${s.kind === 'cover' ? '' : `<div class="ft"><span>${deck.sub || ''}</span><span>cuongthai.com</span></div>`}
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });

/** Trả về [caoThat, rongThat] của khối .slide. */
const do1 = async (html) => {
  await page.setContent(html, { waitUntil: 'load' });
  return page.evaluate(() => {
    const sl = document.querySelector('.slide');
    // ⚠️ ĐO Ở ĐÂY, không đo ở .bd: .bd là flex item nên `min-height:auto` khiến
    // nó TỰ CAO BẰNG nội dung ⇒ bd.scrollHeight === bd.clientHeight kể cả khi
    // tràn, và phép đo im lặng trả 0. Phần thừa lòi ra ở chính .slide.
    return {
      thua: Math.max(0, sl.scrollHeight - sl.clientHeight),
      rongThua: Math.max(0, sl.scrollWidth - sl.clientWidth),
    };
  });
};

// ── tự kiểm bộ kiểm trước khi tin nó ──
const gia = await do1(`<!doctype html><meta charset="utf-8"><style>${CSS}</style>
<div class="slide"><div class="bar"></div><div class="hd"><span>x</span><span>1/1</span></div>
<h1>slide giả để thử bộ đo</h1><div class="bd">${'<p>dòng thừa</p>'.repeat(60)}</div>
<div class="ft"><span>x</span><span>x</span></div></div>`);
if (gia.thua < 100) {
  console.error(`❌ BỘ ĐO HỎNG: slide giả nhồi 60 dòng mà chỉ báo thừa ${gia.thua}px. Không tin kết quả bên dưới.`);
  await browser.close(); process.exit(2);
}
console.log(`✓ bộ đo còn hiệu lực (slide giả: thừa ${gia.thua}px)\n`);

let xau = 0;
for (const [i, s] of slides.entries()) {
  const r = await do1(page_html(s, i, slides.length));
  const co = r.thua > 2 || r.rongThua > 2;
  if (co) xau++;
  const nhan = r.thua > 2 ? `TRÀN DỌC +${r.thua}px` : r.rongThua > 2 ? `TRÀN NGANG +${r.rongThua}px` : 'ok';
  console.log(`${co ? '❌' : '  '} ${String(i + 1).padStart(3, '0')}  ${nhan.padEnd(18)} ${s.t}`);
}
await browser.close();
console.log(`\n${xau === 0 ? '✓ không slide nào tràn' : `❌ ${xau}/${slides.length} slide TRÀN — sửa rồi đo lại, đừng render vội`}`);
process.exit(xau === 0 ? 0 : 1);
