/**
 * _pptx-to-slides.mjs — chuyển slide .pptx/.ppt của trường thành ảnh webp.
 *   node scripts/_pptx-to-slides.mjs --src "<thư mục chứa pptx>" --out /tmp/<mã>-slides --map deck.json
 * Quy trình: soffice --convert-to pdf  →  pdftoppm -png  →  sharp webp.
 * Ra: <out>/<deckKey>/NNN.webp  (đúng chuẩn upload-academy-slides.mjs)
 * deckKey lấy từ --keys "file1=prf0,file2=prf1" hoặc tự sinh theo thứ tự tên file.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const SRC = val('--src'); const OUT = val('--out') || '/tmp/slides';
const PREFIX = val('--prefix') || 'd';           // tiền tố deck key
const DPI = Number(val('--dpi') || 150);
const START = Number(val('--start') || 0);   // deck đầu tiên đánh số từ đây
if (!SRC) { console.error('cần --src <thư mục pptx>'); process.exit(1); }
const SOFFICE = '/Applications/LibreOffice.app/Contents/MacOS/soffice';

const files = fs.readdirSync(SRC).filter((f) => /\.pptx?$/i.test(f)).sort();
if (!files.length) { console.error('không có .pptx trong ' + SRC); process.exit(1); }
const tmp = fs.mkdtempSync('/tmp/pptx2slide-');
const map = {};

for (const [i, f] of files.entries()) {
  const key = `${PREFIX}${i + START}`;
  const outDir = path.join(OUT, key);
  fs.mkdirSync(outDir, { recursive: true });
  // 1) pptx -> pdf
  execFileSync(SOFFICE, ['--headless', '--convert-to', 'pdf', '--outdir', tmp, path.join(SRC, f)], { stdio: 'pipe' });
  const pdf = path.join(tmp, f.replace(/\.pptx?$/i, '.pdf'));
  if (!fs.existsSync(pdf)) { console.log(`  ✗ ${f}: không tạo được pdf`); continue; }
  // 2) pdf -> png
  const stem = path.join(tmp, key);
  execFileSync('pdftoppm', ['-r', String(DPI), '-png', pdf, stem], { stdio: 'pipe' });
  const pngs = fs.readdirSync(tmp).filter((x) => x.startsWith(key + '-') && x.endsWith('.png')).sort();
  // 3) png -> webp (đánh số 001…)
  let n = 0;
  for (const p of pngs) {
    n++;
    await sharp(path.join(tmp, p)).resize(1280, null, { withoutEnlargement: false })
      .webp({ quality: 90 }).toFile(path.join(outDir, String(n).padStart(3, '0') + '.webp'));
    fs.unlinkSync(path.join(tmp, p));
  }
  const meta = await sharp(path.join(outDir, '001.webp')).metadata();
  map[key] = { file: f, total: n, w: meta.width, h: meta.height };
  console.log(`  ✓ ${key} ← ${f} : ${n} slide (${meta.width}x${meta.height})`);
}
fs.rmSync(tmp, { recursive: true, force: true });
const mapFile = val('--map');
if (mapFile) fs.writeFileSync(mapFile, JSON.stringify(map, null, 1));
console.log('TỔNG:', Object.values(map).reduce((s, d) => s + d.total, 0), 'slide →', OUT);
