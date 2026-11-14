/**
 * Kiểm mọi đề thi thử CT Language (`content/ctlanguage/de-thi/*.json`): đủ số câu theo chuẩn từng cấp, mỗi câu đúng
 * MỘT đáp án hợp lệ, đủ giải thích, giọng nghe có thật, id = tên tệp.
 *
 *   npx tsx scripts/ctlanguage-kiem-de-thi.mts            # mọi đề
 *   npx tsx scripts/ctlanguage-kiem-de-thi.mts hsk1-de-1  # một đề
 */
import fs from 'node:fs';
import path from 'node:path';
import { kiemDe, tatCaCau, type DeThi } from '../src/services/ctlanguage/thiThuan.js';

const thuMuc = path.join(process.cwd(), 'content', 'ctlanguage', 'de-thi');
const chi = process.argv.slice(2);
const tep = fs.readdirSync(thuMuc).filter((f) => f.endsWith('.json') && (!chi.length || chi.includes(f.replace(/\.json$/, '')))).sort();
let hong = 0;
let tongCau = 0;
for (const f of tep) {
  let de: DeThi;
  try { de = JSON.parse(fs.readFileSync(path.join(thuMuc, f), 'utf8')); }
  catch (e) { console.error(`✗ ${f}: JSON hỏng — ${(e as Error).message}`); hong++; continue; }
  const loi = kiemDe(de);
  if (de.id !== f.replace(/\.json$/, '')) loi.push(`id "${de.id}" khác tên tệp`);
  const n = tatCaCau(de).length;
  tongCau += n;
  if (loi.length) { hong++; console.error(`✗ ${f} (${n} câu) — ${loi.length} lỗi:`); for (const l of loi.slice(0, 40)) console.error(`    ${l}`); }
  else console.log(`✓ ${f} — ${de.cap} · ${n} câu · ${de.phan.map((p) => `${p.ten} ${p.nhom.reduce((a, g) => a + g.cau.length, 0)}`).join(' · ')}`);
}
console.log(`\n${tep.length} đề · ${tongCau} câu · ${hong ? `${hong} đề LỖI` : 'tất cả hợp lệ'}`);
if (!tep.length || hong) process.exit(1);
