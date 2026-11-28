/**
 * Hình minh hoạ bài học (09/11/2026) — đưa ảnh Fluent Emoji (MIT) mà bài học dùng lên R2.
 *
 * Bài học khai hình bằng TÊN (slug) trong khối `hinh` / `canh` / `slides` (`anh: 'dog'`). Trang web
 * vẽ ảnh từ `https://media.cuongthai.com/hoc/hinh/<slug>.webp` (CSP của web chỉ cho media.cuongthai.com).
 * Script này quét các tệp bài, tìm slug, tải bản 3D từ kho microsoft/fluentui-emoji (ghim commit trong
 * fluent-catalog.json), thu về WebP 256 px rồi đẩy lên R2 — ảnh nào đã có trên R2 thì bỏ qua.
 *
 *   npx tsx scripts/hinh/len-r2.mts                 # quét dekiru/bai + jp/bai + ielts/ngay + ielts/data.ts, đẩy ảnh thiếu
 *   npx tsx scripts/hinh/len-r2.mts --kiem          # chỉ kiểm slug lạ (không tải, không đẩy)
 *   npx tsx scripts/hinh/len-r2.mts --thu dog cat   # đẩy đúng mấy slug này
 *
 * Slug lạ (không có trong danh mục) ⇒ in ra và thoát mã 1 — bài viết sai tên hình thì biết ngay.
 */
import 'dotenv/config';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { headObject, putObject } from '../../src/config/r2.js';

const GOC = path.resolve(import.meta.dirname, '../..');
const CAT = JSON.parse(await readFile(path.join(import.meta.dirname, 'fluent-catalog.json'), 'utf8')) as {
  commit: string; hinh: Record<string, string>;
};
const THU_MUC = [
  'frontend/src/app/language/[code]/dekiru/bai',
  'frontend/src/app/language/[code]/jp/bai',
  'frontend/src/app/language/[code]/ielts/ngay', // IELTS (12/11/2026): vocab.anh, hinh, canh, sodo mindmap/compare
  'frontend/src/app/language/[code]/ielts', // IELTS Ngày 1 nằm trong data.ts (13/11/2026) — chỉ quét *.ts ngay cấp này
  'frontend/src/app/language/[code]/ielts/tap-2/ngay', // IELTS Tập 2 (12/11/2026): ngày t2dN
  'frontend/src/app/language/[code]/ielts/tap-2', // IELTS Tập 2: data.ts (Mở đầu) + tracuu.ts
  'frontend/src/app/language/[code]/ielts/tap-3/ngay', // IELTS Tập 3 (18/11/2026): ngày t3dN
  'frontend/src/app/language/[code]/ielts/tap-3', // IELTS Tập 3: data.ts (Mở đầu) + tracuu.ts
  'frontend/src/app/language/[code]/ielts/tap-4/ngay', // IELTS Tập 4 (18/11/2026): ngày t4dN
  'frontend/src/app/language/[code]/ielts/tap-4', // IELTS Tập 4: data.ts (Mở đầu) + tracuu.ts
  'frontend/src/app/language/[code]/ielts/tap-5/ngay', // IELTS Tập 5 (24/11/2026): ngày t5dN
  'frontend/src/app/language/[code]/ielts/tap-5', // IELTS Tập 5: data.ts (Mở đầu) + tracuu.ts
  'frontend/src/app/language/[code]/giao-tiep/ngay', // Tiếng Anh giao tiếp (24/11/2026): canh, hinh cử chỉ, vocab.anh
];
export const KHOA = (slug: string) => `hoc/hinh/${slug}.webp`;

/** Mọi slug trong khối hình: `anh: 'x'`, `anh: ['x', 'y']`, `"anh": "x"`, `"anh": ["x"]`. */
function timSlug(src: string): Set<string> {
  const ra = new Set<string>();
  // Trước `anh` không được là chữ cái (kể cả chữ Việt): "tranh:" từng bị bắt nhầm thành `anh:`.
  for (const m of src.matchAll(/(?<![\p{L}\p{N}_])["']?anh["']?\s*:\s*(\[[^\]]*\]|["'][^"']+["'])/gu)) {
    for (const s of m[1].matchAll(/["']([^"']+)["']/g)) if (!/^https?:/.test(s[1])) ra.add(s[1]);
  }
  return ra;
}

const args = process.argv.slice(2);
// 24/11/2026: một agent gõ `--help` ⇒ script coi là "đẩy thật" và đẩy ảnh lên bucket thật. Cờ lạ ⇒ in cách dùng rồi DỪNG.
const coLa = args.filter((a) => a.startsWith('-') && !['--kiem', '--thu'].includes(a));
if (coLa.length) {
  console.error(`Cờ lạ: ${coLa.join(' ')}\nDùng: --kiem (chỉ kiểm) · --thu <slug…> (đẩy đúng mấy slug) · không cờ = đẩy mọi ảnh thiếu lên R2 THẬT`);
  process.exit(2);
}
const chiKiem = args.includes('--kiem');
let slugs = new Set<string>();
if (args[0] === '--thu') slugs = new Set(args.slice(1));
else {
  for (const d of THU_MUC) {
    const dir = path.join(GOC, d);
    for (const f of (await readdir(dir).catch(() => [])).filter((x) => x.endsWith('.ts'))) {
      timSlug(await readFile(path.join(dir, f), 'utf8')).forEach((s) => slugs.add(s));
    }
  }
}
// 28/11/2026: ảnh `ai-*` do Antigravity (gói Google Ultra) vẽ — khai prompt trong scripts/hinh/ai/*.json, đẩy bằng ve-ai.mts.
const AI: Record<string, string> = {};
for (const f of (await readdir(path.join(import.meta.dirname, 'ai')).catch(() => [])).filter((x) => x.endsWith('.json'))) {
  Object.assign(AI, JSON.parse(await readFile(path.join(import.meta.dirname, 'ai', f), 'utf8')));
}
const laAi = [...slugs].filter((s) => s.startsWith('ai-') && !AI[s]);
if (laAi.length) { console.error('✗ Ảnh ai-* chưa khai prompt trong scripts/hinh/ai/*.json:', laAi.join(', ')); process.exit(1); }
for (const s of [...slugs]) if (s.startsWith('ai-')) slugs.delete(s); // ve-ai.mts lo phần này
const la = [...slugs].filter((s) => !CAT.hinh[s]);
console.log(`${slugs.size} hình được dùng · ${la.length} tên lạ`);
if (la.length) { console.error('✗ Tên hình không có trong danh mục:', la.join(', ')); process.exit(1); }
if (chiKiem) process.exit(0);

let moi = 0;
for (const s of [...slugs].sort()) {
  if (await headObject(KHOA(s))) continue;
  const url = `https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@${CAT.commit}/${encodeURI(CAT.hinh[s])}`;
  const r = await fetch(url);
  if (!r.ok) { console.error(`✗ ${s}: tải ${r.status}`); process.exitCode = 1; continue; }
  const webp = await sharp(Buffer.from(await r.arrayBuffer())).resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 88 }).toBuffer();
  await putObject(KHOA(s), webp, 'image/webp');
  moi++;
  console.log(`↑ ${s} (${(webp.length / 1024).toFixed(1)} KB)`);
}
console.log(`✓ xong — đẩy mới ${moi}, đã có ${slugs.size - moi}`);
