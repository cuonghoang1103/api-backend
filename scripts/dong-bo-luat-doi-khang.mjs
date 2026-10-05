#!/usr/bin/env node
/**
 * Chép luật đối kháng (nguồn duy nhất: src/services/doiKhang/luat/) sang frontend.
 *
 *   node scripts/dong-bo-luat-doi-khang.mjs          # chép
 *   node scripts/dong-bo-luat-doi-khang.mjs --kiem   # chỉ kiểm, lệch thì thoát mã 1
 *
 * Chép mọi *.ts trừ *.test.ts và _PROMPT*. Mỗi bản chép có dòng đầu cảnh báo — đừng sửa tay.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');
const NGUON = join(GOC, 'src/services/doiKhang/luat');
const DICH = join(GOC, 'frontend/src/lib/doiKhang/luat');
const DAU =
  '// ⛔ BẢN CHÉP — sửa ở src/services/doiKhang/luat/ rồi chạy scripts/dong-bo-luat-doi-khang.mjs\n';
const kiem = process.argv.includes('--kiem');

const chon = (f) => f.endsWith('.ts') && !f.endsWith('.test.ts') && !f.startsWith('_PROMPT');
const tep = readdirSync(NGUON).filter(chon).sort();
// Bỏ đuôi `.js` của import tương đối: backend (ESM NodeNext) BẮT BUỘC có, còn webpack của Next 14
// không tự đổi `./x.js` → `./x.ts` ⇒ "Module not found: Can't resolve './coVua.js'" (tsc vẫn xanh).
const boDuoiJs = (src) => src.replace(/(from\s+['"]\.{1,2}\/[^'"]+?)\.js(['"])/g, '$1$2');
const mong = new Map(tep.map((f) => [f, DAU + boDuoiJs(readFileSync(join(NGUON, f), 'utf8'))]));

const lech = [];
const coSan = existsSync(DICH) ? readdirSync(DICH).filter((f) => f.endsWith('.ts')) : [];
for (const [f, noiDung] of mong) {
  const p = join(DICH, f);
  if (!existsSync(p) || readFileSync(p, 'utf8') !== noiDung) lech.push(f);
}
// Tệp thừa ở đích (đã xoá ở nguồn) — chỉ tính tệp mang dòng cảnh báo của mình.
const thua = coSan.filter((f) => !mong.has(f) && readFileSync(join(DICH, f), 'utf8').startsWith(DAU));

if (kiem) {
  if (lech.length || thua.length) {
    console.error('✗ Bản chép luật đối kháng LỆCH nguồn:');
    for (const f of lech) console.error('  khác/thiếu: ' + f);
    for (const f of thua) console.error('  thừa:      ' + f);
    console.error('→ chạy: node scripts/dong-bo-luat-doi-khang.mjs');
    process.exit(1);
  }
  console.log(`✓ Bản chép luật đối kháng khớp nguồn (${mong.size} tệp).`);
  process.exit(0);
}

mkdirSync(DICH, { recursive: true });
for (const f of lech) writeFileSync(join(DICH, f), mong.get(f));
for (const f of thua) unlinkSync(join(DICH, f));
console.log(`✓ Đã chép ${lech.length} tệp, xoá ${thua.length} tệp thừa → frontend/src/lib/doiKhang/luat/ (${mong.size} tệp).`);
