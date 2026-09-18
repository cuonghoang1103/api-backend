/**
 * _pptx-text.mjs — trích CHỮ từng slide .pptx theo ĐÚNG thứ tự trình chiếu và
 * ĐÚNG tập slide mà LibreOffice xuất ra ảnh (bỏ slide ẩn show="0"), để số slide
 * trong text khớp 1-1 với số thứ tự ảnh .webp đã render.
 *
 *   node scripts/_pptx-text.mjs --src "<thư mục pptx>" --out <đích> --prefix prf
 *
 * ⚠️ KHÔNG đọc theo tên file slideN.xml: thứ tự trình chiếu nằm ở
 * ppt/presentation.xml <p:sldIdLst> → r:id → ppt/_rels/presentation.xml.rels.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const SRC = val('--src'), OUT = val('--out') || '/tmp/pptx-text', PREFIX = val('--prefix') || 'd';
const START = Number(val('--start') || 0);
if (!SRC) { console.error('cần --src'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => /\.pptx$/i.test(f)).sort();
for (const [i, f] of files.entries()) {
  const key = `${PREFIX}${i + START}`;
  const tmp = fs.mkdtempSync('/tmp/pptxtext-');
  execFileSync('unzip', ['-o', '-q', path.join(SRC, f), 'ppt/presentation.xml', 'ppt/_rels/presentation.xml.rels', 'ppt/slides/*.xml', '-d', tmp], { stdio: 'pipe' });

  // r:id -> slideN.xml
  const rels = fs.readFileSync(path.join(tmp, 'ppt/_rels/presentation.xml.rels'), 'utf8');
  const relMap = new Map();
  for (const m of rels.matchAll(/Id="([^"]+)"[^>]*Target="([^"]*slides\/[^"]+)"/g)) relMap.set(m[1], path.basename(m[2]));
  // thứ tự trình chiếu
  const pres = fs.readFileSync(path.join(tmp, 'ppt/presentation.xml'), 'utf8');
  const order = [...pres.matchAll(/<p:sldId[^>]*r:id="([^"]+)"/g)].map((m) => relMap.get(m[1])).filter(Boolean);

  let n = 0, hidden = 0;
  let out = '';
  for (const fname of order) {
    const p = path.join(tmp, 'ppt/slides', fname);
    if (!fs.existsSync(p)) continue;
    const xml = fs.readFileSync(p, 'utf8');
    // LibreOffice KHÔNG xuất slide ẩn ra PDF ⇒ bỏ để số khớp ảnh
    if (/<p:sld\b[^>]*\bshow="0"/.test(xml)) { hidden++; continue; }
    n++;
    const paras = xml.split('</a:p>').map((pp) => {
      const ts = [...pp.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map((m) => m[1]);
      return ts.join('').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
    }).filter(Boolean);
    out += `\n### slide ${n}\n` + (paras.length ? paras.map((x) => '- ' + x).join('\n') : '(không có chữ — slide ảnh/sơ đồ)') + '\n';
  }
  const head = `# ${f}  (deck ${key}, ${n} slide hiện${hidden ? `, ${hidden} slide ẩn đã bỏ` : ''})\n`;
  fs.writeFileSync(path.join(OUT, key + '.txt'), head + out);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`  ✓ ${key}.txt ← ${f} (${n} slide${hidden ? `, bỏ ${hidden} ẩn` : ''})`);
}
