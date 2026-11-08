/**
 * Bổ sung nét viết KanjiVG (CC BY-SA 3.0, kanjivg.tagaini.net) vào public/kanjivg/strokes.json cho MỌI chữ Hán
 * mà các bài khoá Dekiru dùng tới (09/11/2026 — Bài 16+ đưa chữ N3/N2 mới vào; thiếu nét thì thẻ chữ Hán và ô
 * tập viết trống). Tải đúng tệp SVG của chữ từ kho KanjiVG trên GitHub, lấy các `path d` theo thứ tự nét.
 *
 *   node --experimental-strip-types --no-warnings scripts/kanjivg-bo-sung.mts          # thêm chữ còn thiếu
 *   node --experimental-strip-types --no-warnings scripts/kanjivg-bo-sung.mts --kiem   # chỉ đếm, không tải
 *
 * Chữ KanjiVG không có (bộ thủ rời như 丬, 牜…) ⇒ bỏ qua, in tên ra. Định dạng giữ như cũ: { 字: ["M…", …] }.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEP = join(ROOT, 'public/kanjivg/strokes.json');
const BAI = join(ROOT, 'src/app/language/[code]/dekiru/bai');
const NGUON = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji';

const net = JSON.parse(readFileSync(TEP, 'utf8')) as Record<string, string[]>;
const dung = new Set<string>();
for (const f of readdirSync(BAI).filter((x) => x.endsWith('.ts') && x !== 'kanjiIndex.ts' && x !== 'onTheData.ts')) {
  for (const ch of readFileSync(join(BAI, f), 'utf8').match(/[一-鿿]/g) ?? []) dung.add(ch);
}
const thieu = [...dung].filter((c) => !net[c]).sort();
console.log(`khoá dùng ${dung.size} chữ · có nét ${dung.size - thieu.length} · thiếu ${thieu.length}`);
if (process.argv.includes('--kiem')) process.exit(0);

let them = 0;
const khongCo: string[] = [];
for (const c of thieu) {
  const ma = c.codePointAt(0)!.toString(16).padStart(5, '0');
  const r = await fetch(`${NGUON}/${ma}.svg`);
  if (!r.ok) { khongCo.push(c); continue; }
  const svg = await r.text();
  // Nét = <path id="kvg:0xxxx-sN" … d="…">; sắp theo N (thứ tự viết).
  const ds = [...svg.matchAll(/<path[^>]*id="kvg:[0-9a-f]+-s(\d+)"[^>]*\sd="([^"]+)"/g)]
    .sort((a, b) => Number(a[1]) - Number(b[1])).map((m) => m[2]);
  if (!ds.length) { khongCo.push(c); continue; }
  net[c] = ds;
  them++;
}
// Ghi theo thứ tự mã chữ để diff gọn.
const ra = Object.fromEntries(Object.entries(net).sort(([a], [b]) => a.codePointAt(0)! - b.codePointAt(0)!));
writeFileSync(TEP, JSON.stringify(ra));
console.log(`✓ thêm ${them} chữ${khongCo.length ? ` · KanjiVG không có: ${khongCo.join('')}` : ''}`);
