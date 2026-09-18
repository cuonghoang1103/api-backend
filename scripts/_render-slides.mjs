/**
 * _render-slides.mjs — render một bộ slide (dữ liệu .mjs) thành ảnh webp 1280x720.
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/mae101-ch1.mjs --out /tmp/mae101-slides
 * Ra: <out>/<deck.key>/001.webp, 002.webp, ...  (đúng chuẩn upload-academy-slides.mjs)
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const DECK_PATH = val('--deck'); const OUT = val('--out') || '/tmp/slides';
if (!DECK_PATH) { console.error('cần --deck <file.mjs>'); process.exit(1); }

const mod = await import(pathToFileURL(path.resolve(DECK_PATH)).href);
const { deck, slides } = mod;
const W = 1280, H = 720;
const katexCss = fs.readFileSync('node_modules/katex/dist/katex.min.css', 'utf8');
const katexJs = fs.readFileSync('node_modules/katex/dist/katex.min.js', 'utf8');
const fontsDir = pathToFileURL(path.resolve('node_modules/katex/dist/fonts')).href;

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;height:${H}px;font-family:-apple-system,"Segoe UI",Arial,"Arial Unicode MS",sans-serif;
  background:#fff;color:#11243d;overflow:hidden}
.slide{width:${W}px;height:${H}px;padding:44px 56px 40px;display:flex;flex-direction:column;position:relative;
  background:linear-gradient(180deg,#ffffff 0%,#f7fafd 100%)}
.bar{position:absolute;top:0;left:0;right:0;height:9px;background:linear-gradient(90deg,#1b5fa8,#37a3e0 55%,#7ad0c7)}
.hd{display:flex;justify-content:space-between;align-items:center;font-size:15px;color:#6b8199;
  letter-spacing:.4px;margin-bottom:14px;font-weight:600}
h1{font-size:40px;line-height:1.16;color:#0f2a4a;font-weight:800;letter-spacing:-.4px}
h1::after{content:"";display:block;width:92px;height:5px;border-radius:3px;background:#1b5fa8;margin-top:12px}
.bd{flex:1;display:flex;flex-direction:column;justify-content:center;gap:15px;font-size:25px;line-height:1.5;padding-top:6px}
.lead2{font-size:25px;color:#25405e}
.note{font-size:20px;color:#5d7288}
.nh{font-size:19px;font-weight:800;color:#1b5fa8;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px}
.texbig{text-align:center;font-size:34px;padding:16px 18px;background:#eef5fc;border:1.5px solid #cfe2f5;border-radius:12px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:22px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.grid2 .f{background:#f2f7fd;border:1.5px solid #d7e6f7;border-radius:10px;padding:13px 14px;text-align:center;font-size:23px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.card{background:#fff;border:2px solid #d7e6f7;border-radius:12px;padding:16px;text-align:center}
.card b{display:block;font-size:24px;color:#1b5fa8;margin-bottom:8px}
.card p{font-size:19px;color:#4a6076;line-height:1.4}
ol.big,ol.toc{padding-left:34px;display:flex;flex-direction:column;gap:11px;font-size:25px}
ol.toc li{color:#25405e}
ol.big li::marker,ol.toc li::marker{color:#1b5fa8;font-weight:800}
.box{border-left:6px solid #1b5fa8;background:#f2f7fd;padding:14px 18px;border-radius:0 10px 10px 0;font-size:23px}
.box.ok{border-color:#1f9d6b;background:#eefaf4}
.box.warn{border-color:#e0952a;background:#fdf6ea}
.steps{display:flex;flex-direction:column;gap:10px;font-size:23px}
.steps>div{display:flex;align-items:center;gap:12px}
.steps .n{flex:0 0 32px;height:32px;border-radius:50%;background:#1b5fa8;color:#fff;font-size:18px;font-weight:800;
  display:flex;align-items:center;justify-content:center}
table.t{width:100%;border-collapse:collapse;font-size:21px}
table.t th,table.t td{border:1.5px solid #cfe0f0;padding:9px 10px;text-align:center}
table.t th{background:#eef5fc;color:#1b5fa8;font-weight:700}
table.t td.hl{background:#fff5d6;font-weight:800}
table.t.big2 th{text-align:left;width:38%}
table.t.big2 td{text-align:left;font-size:23px}
.ft{position:absolute;left:56px;right:56px;bottom:14px;display:flex;justify-content:space-between;
  font-size:14px;color:#8aa0b6;border-top:1px solid #e3ecf4;padding-top:8px}
/* cover */
.cover{align-items:center;justify-content:center;text-align:center;
  background:linear-gradient(135deg,#0f2a4a 0%,#1b5fa8 60%,#2b86c5 100%);color:#fff}
.cover h1{font-size:60px;color:#fff}
.cover h1::after{margin:18px auto 0;background:#7ad0c7}
.cover .sub{font-size:28px;color:#cfe4f7;margin-top:20px}
.cover .cov-meta{font-size:19px;color:#a8c9e8;margin-top:34px;line-height:1.6}
`;

const page_html = (s, i) => `<!doctype html><meta charset="utf-8">
<style>@font-face{font-family:KaTeX_Main;src:local("KaTeX_Main")}${katexCss.replace(/url\(fonts\//g, `url(${fontsDir}/`)}${CSS}</style>
<div class="slide ${s.kind === 'cover' ? 'cover' : ''}">
  <div class="bar"></div>
  ${s.kind === 'cover' ? '' : `<div class="hd"><span>${deck.code} · ${deck.title}</span><span>${i + 1} / ${slides.length}</span></div>`}
  <h1>${s.t}</h1>
  ${s.sub ? `<p class="sub">${s.sub}</p>` : ''}
  <div class="bd">${s.body || ''}</div>
  ${s.kind === 'cover' ? '' : `<div class="ft"><span>MAE101 · Mathematics for Engineering</span><span>cuongthai.com</span></div>`}
</div>
<script>${katexJs}</script>
<script>
for (const el of document.querySelectorAll('.tex,.texbig')) {
  try { katex.render(el.textContent, el, { displayMode: el.classList.contains('texbig'), throwOnError: false }); }
  catch (e) { el.style.color = 'red'; }
}
</script>`;

const outDir = path.join(OUT, deck.key);
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
let n = 0;
for (const [i, s] of slides.entries()) {
  await page.setContent(page_html(s, i), { waitUntil: 'load' });
  await page.waitForTimeout(120);
  const png = await page.screenshot({ type: 'png' });
  const file = path.join(outDir, String(i + 1).padStart(3, '0') + '.webp');
  await sharp(png).resize(W, H).webp({ quality: 92 }).toFile(file);
  n++;
  process.stdout.write(`\r  render ${n}/${slides.length}`);
}
await browser.close();
console.log(`\n✓ ${n} slide → ${outDir}`);
