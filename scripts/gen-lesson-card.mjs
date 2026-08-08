/**
 * gen-lesson-card.mjs — dựng thẻ bài học (kiểu "99 Ngày Java") bằng HTML/CSS
 * rồi chụp thành PNG, để đăng blog / feed / mạng xã hội.
 * ─────────────────────────────────────────────────────────────────────────────
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-11.mjs
 *   node scripts/gen-lesson-card.mjs --file ... --out ./thu-muc-khac/the.png
 *   node scripts/gen-lesson-card.mjs --file ... --no-verify   # bỏ bước chạy Java
 *
 * Mỗi bài học là MỘT file dữ liệu trong content/lesson-cards/ — thêm ngày mới
 * không phải sửa file này.
 *
 * VÌ SAO KHÔNG DÙNG MÔ HÌNH SINH ẢNH (quyết định 08/08/2026)
 * Tấm thẻ này là một BỐ CỤC, không phải bức tranh: thẻ bo góc, chip màu, khối
 * code, dấu tick — toàn bộ là CSS. Thứ mô hình sinh ảnh KHÔNG làm được là in
 * đúng từng ký tự của `an.diemTB = 9.0;` và giữ dấu tiếng Việt ở cỡ chữ nhỏ;
 * mà ảnh thì không sửa được, chỉ vẽ lại rồi cầu may. Ở đây code được dán từ
 * file .java ĐÃ BIÊN DỊCH VÀ CHẠY, nên không có đường nào sai.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const FILE = val('--file');
const SKIP_VERIFY = args.includes('--no-verify');
if (!FILE) {
  console.error('cần --file ./content/lesson-cards/<slug>.mjs');
  process.exit(1);
}
const card = (await import(pathToFileURL(path.resolve(FILE)).href)).default;
const slug = path.basename(FILE, '.mjs');
const OUT = val('--out') || path.join(ROOT, '.cards', `${slug}.png`);

/* ── Bước 1: CHẠY THẬT code trước khi in ──────────────────────────────────
   Nếu output khác `proof.lines` thì DỪNG. Đây là thứ khiến thẻ không thể nói
   dối về hành vi của Java — và là lý do cả dây chuyền này tồn tại. */
if (card.verify && !SKIP_VERIFY) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-card-'));
  const file = path.join(dir, `${card.verify.className}.java`);
  fs.writeFileSync(file, card.verify.source);
  try {
    execFileSync('javac', [file], { cwd: dir, stdio: 'pipe' });
    const out = execFileSync('java', ['-cp', dir, card.verify.className], { encoding: 'utf8' })
      .trim().split('\n').map((l) => l.trimEnd());
    const want = card.proof.lines.map((l) => l.trimEnd());
    const same = out.length === want.length && out.every((l, i) => l === want[i]);
    if (!same) {
      console.error('✗ output THẬT khác với `proof.lines` trên thẻ — sửa file dữ liệu rồi chạy lại:');
      console.error('  thật muốn in :', JSON.stringify(want, null, 2));
      console.error('  chương trình :', JSON.stringify(out, null, 2));
      process.exit(1);
    }
    console.log(`✓ đã biên dịch & chạy ${card.verify.className}.java — output khớp đúng thẻ`);
  } catch (e) {
    console.error('✗ không biên dịch/chạy được đoạn kiểm chứng:', e.stderr?.toString() || e.message);
    process.exit(1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/* ── Logo: nhúng thành data URI ───────────────────────────────────────────
   Playwright dựng trang bằng setContent() nên KHÔNG có URL gốc — mọi đường
   dẫn tương đối sẽ 404 im lặng và logo biến mất mà không báo gì. */
const LOGO_PATH = path.join(ROOT, 'frontend/public/favicon.png');
const logo = fs.existsSync(LOGO_PATH)
  ? `data:image/png;base64,${fs.readFileSync(LOGO_PATH).toString('base64')}`
  : null;
if (!logo) console.warn(`  ⚠ không thấy ${path.relative(ROOT, LOGO_PATH)} — thẻ sẽ không có logo`);

/* ── Tô màu cú pháp ───────────────────────────────────────────────────────
   MỘT lượt quét duy nhất, phát ra HTML đã escape theo từng token.
   ⚠ Bản đầu viết bằng chuỗi `.replace()` nối nhau và HỎNG THẬT: lượt tô từ
   khoá chạy SAU lượt tô chuỗi nên bắt trúng chữ `class` nằm trong
   `<span class="str">` mà chính nó vừa sinh, đẻ ra rác
   `an.ten = class="str">"An";` ngay trên thẻ. Bài học: đừng để một lượt regex
   quét lại phần HTML do lượt trước tạo ra. */
const TOKEN = new RegExp([
  /(\/\/[^\n]*)/,                                   // 1 comment — phải đứng ĐẦU
  /("(?:[^"\\]|\\.)*")/,                            // 2 chuỗi
  /\b(public|private|protected|class|void|new|this|static|return|if|else|for|while|final|extends|implements|import|package|null|true|false|int|double|boolean|String|char|long|float)\b/, // 3 từ khoá
  /\b(\d+\.?\d*)\b/,                                // 4 số
].map((r) => r.source).join('|'), 'g');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function highlight(code) {
  const CLS = { 1: 'cm', 2: 'str', 3: 'kw', 4: 'num' };
  let out = '', last = 0, m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(code)) !== null) {
    out += esc(code.slice(last, m.index));
    const g = [1, 2, 3, 4].find((i) => m[i] !== undefined);
    out += `<span class="${CLS[g]}">${esc(m[g])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(code.slice(last));
}

/** Chỉ hỗ trợ `**đậm**` và `` `mã` `` trong ghi chú — cố ý không hơn. */
const rich = (t) => esc(t)
  .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
  .replace(/`([^`]+)`/g, '<code>$1</code>');

const MARK = { ok: ['✓', 'ok'], no: ['✗', 'no'], dot: ['•', 'dot'], next: ['→', 'next'] };

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap&subset=vietnamese,latin" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --paper:#faf6ec; --ink:#2b2b33; --card:#fffdf7; --muted:#6b6b78;
    --blue:#cfe3f7; --yellow:#fdeec4; --pink:#fbd6e1; --green:#d5edd7;
    --coral:#e2594a;
  }
  body{
    width:1080px; background:var(--paper); color:var(--ink);
    font-family:"Quicksand","Nunito",system-ui,sans-serif;
    background-image:
      linear-gradient(rgba(43,43,51,.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(43,43,51,.055) 1px, transparent 1px);
    background-size:26px 26px;
    padding:34px 30px 26px;
  }
  .head{position:relative;text-align:center;padding:4px 0 22px;min-height:132px}
  .brand{
    position:absolute;left:4px;top:0;display:flex;align-items:center;gap:10px;
    border:2.5px solid var(--ink);border-radius:16px;padding:8px 14px 8px 10px;
    background:var(--card);box-shadow:3px 3px 0 rgba(43,43,51,.16)}
  .brand img{width:44px;height:44px;display:block}
  .brand .txt{font-family:"Baloo 2",sans-serif;font-weight:800;font-size:18px;
    line-height:1.06;text-align:left;letter-spacing:.01em}
  .spark{position:absolute;right:12px;top:4px;font-size:30px}
  h1{font-family:"Baloo 2",sans-serif;font-weight:800;font-size:47px;line-height:1.16;
    letter-spacing:-.01em;padding:0 190px}
  h1 span{color:var(--coral)}
  .sub{display:inline-block;margin-top:13px;font-weight:700;font-size:20px;
    background:var(--yellow);border:2.5px solid var(--ink);border-radius:999px;padding:9px 24px;
    box-shadow:3px 3px 0 rgba(43,43,51,.16)}

  .sec{background:var(--card);border:2.5px solid var(--ink);border-radius:20px;
    padding:20px 22px 19px;margin-bottom:19px;box-shadow:4px 4px 0 rgba(43,43,51,.14)}
  .pill{display:inline-block;font-family:"Baloo 2",sans-serif;font-weight:700;font-size:22px;
    border:2.5px solid var(--ink);border-radius:999px;padding:6px 18px;margin-bottom:15px}
  .pill.blue{background:var(--blue)} .pill.yellow{background:var(--yellow)}
  .pill.pink{background:var(--pink)} .pill.green{background:var(--green)}

  /* Tắt ligature: JetBrains Mono mặc định gộp dấu bằng đôi thành một ký tự
     giống "≡", dấu khác thành "≠". Đẹp với dân chuyên, nhưng đây là thẻ cho
     NGƯỜI MỚI — họ gõ đúng thứ nhìn thấy, mà "≡" không có trên bàn phím.
     (Khối CSS này nằm trong template literal ⇒ TUYỆT ĐỐI không dùng dấu
     backtick trong chú thích, nó sẽ đóng chuỗi và làm hỏng cả file.) */
  pre, .proof code{font-variant-ligatures:none;font-feature-settings:"liga" 0,"calt" 0}
  pre{background:#2f3241;border-radius:13px;padding:18px 20px;overflow:hidden;
    font-family:"JetBrains Mono",Menlo,monospace;font-size:19px;line-height:1.62;
    color:#e9e9f2;white-space:pre-wrap;word-break:break-word}
  pre .kw{color:#c4a7ff} pre .str{color:#9be8a8} pre .num{color:#ffc47a}
  pre .cm{color:#8c92ad;font-style:italic}

  ul{list-style:none;margin-top:14px;display:flex;flex-direction:column;gap:9px}
  li{display:flex;gap:10px;font-size:19.5px;line-height:1.45;font-weight:600}
  li .g{flex:0 0 auto;font-weight:800;font-size:20px;line-height:1.4}
  li .g.ok{color:#2f9e51} li .g.no{color:#d94a4a}
  li .g.dot{color:var(--muted)} li .g.next{color:#c2761f}
  li b{font-weight:800}
  li code{font-family:"JetBrains Mono",monospace;font-size:17.5px;
    background:rgba(43,43,51,.075);border-radius:6px;padding:1px 6px}

  .proof{background:#1f2230;border:2.5px solid var(--ink);border-radius:18px;
    padding:15px 20px 16px;margin-bottom:19px;box-shadow:4px 4px 0 rgba(43,43,51,.14)}
  .proof .lbl{display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;
    color:#7ee2a0;margin-bottom:9px}
  .proof code{display:block;font-family:"JetBrains Mono",monospace;font-size:16.5px;
    line-height:1.68;color:#cfd3e6;white-space:pre-wrap}

  .foot{display:flex;align-items:center;gap:13px;padding-top:6px;color:var(--muted);
    font-weight:700;font-size:17px;justify-content:center}
  .foot .rule{flex:1;border-top:2.5px dashed rgba(43,43,51,.3)}
  .foot img{width:26px;height:26px;display:block;margin-bottom:-5px}
  .foot .site{color:var(--ink);font-weight:800}
</style></head><body>
  <div class="head">
    <div class="brand">
      ${logo ? `<img src="${logo}" alt="">` : ''}
      <div class="txt">${esc(card.series).replace(' ', '<br>')}</div>
    </div>
    <div class="spark">✨</div>
    <h1>${esc(card.titleLead)} <span>${esc(card.titleAccent)}</span></h1>
    <div class="sub">${esc(card.subtitle)}</div>
  </div>

  ${card.sections.map((s) => `
  <div class="sec">
    <div class="pill ${s.tone}">${esc(s.title)}</div>
    ${s.code ? `<pre>${highlight(s.code)}</pre>` : ''}
    ${s.notes?.length ? `<ul>${s.notes.map((n) => {
      const [glyph, cls] = MARK[n.mark] || MARK.dot;
      return `<li><span class="g ${cls}">${glyph}</span><span>${rich(n.text)}</span></li>`;
    }).join('')}</ul>` : ''}
  </div>`).join('')}

  ${card.proof ? `<div class="proof">
    <div class="lbl">✅ ${esc(card.proof.label)}</div>
    <code>${esc(card.proof.lines.join('\n'))}</code>
  </div>` : ''}

  <div class="foot">
    <span class="rule"></span>
    ${esc(card.series)} · Ngày ${card.day}/${card.total} ·
    ${logo ? `<img src="${logo}" alt="">` : ''}
    <span class="site">${esc(card.site || 'cuongthai.com')}</span>
    <span class="rule"></span>
  </div>
</body></html>`;

/* ── Bước 2: chụp ─────────────────────────────────────────────────────────── */
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1080, height: 1400 }, deviceScaleFactor: 2 });
await pg.setContent(html, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);

/* Kiểm BỘ KIỂM trước khi tin kết quả: font web chưa về thì thẻ vẫn chụp được
   nhưng sai hoàn toàn diện mạo — phải phát hiện, không để lọt im lặng. */
const fonts = await pg.evaluate(() => ({
  baloo: document.fonts.check('700 40px "Baloo 2"'),
  quicksand: document.fonts.check('600 20px "Quicksand"'),
  mono: document.fonts.check('400 19px "JetBrains Mono"'),
}));
if (!fonts.baloo || !fonts.quicksand || !fonts.mono) {
  console.error('✗ font web chưa tải được:', fonts, '— thẻ sẽ sai diện mạo, dừng lại.');
  await browser.close();
  process.exit(1);
}

/* Logo có thật sự vẽ ra không — data URI hỏng thì <img> vẫn tồn tại nhưng
   naturalWidth = 0, và thẻ ra thiếu logo mà không ai biết. */
const logoOk = await pg.evaluate(() =>
  [...document.querySelectorAll('.brand img, .foot img')].every((i) => i.naturalWidth > 0));
if (logo && !logoOk) {
  console.error('✗ logo không render được (naturalWidth = 0) — dừng lại.');
  await browser.close();
  process.exit(1);
}

/* Dấu tiếng Việt: nếu font rớt glyph có dấu thì trình duyệt thay bằng font dự
   phòng và bề rộng hai chuỗi lệch bất thường. */
const viOk = await pg.evaluate(() => {
  const probe = (t) => {
    const c = document.createElement('canvas').getContext('2d');
    c.font = '700 40px "Baloo 2"';
    return c.measureText(t).width;
  };
  return probe('Khuôn đúc') > probe('Khuon duc') * 0.95;
});

await pg.screenshot({ path: OUT, fullPage: true, type: 'png' });
const h = await pg.evaluate(() => document.body.scrollHeight);
await browser.close();

console.log(`✓ font web đủ 3 · logo vẽ được: ${logoOk} · dấu tiếng Việt đúng: ${viOk}`);
console.log(`✓ ${path.relative(ROOT, OUT)} — 1080×${h} @2x · ${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);
