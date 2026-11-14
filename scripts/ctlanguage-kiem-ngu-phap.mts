/**
 * Kiểm thư viện ngữ pháp CT Language (`content/ctlanguage/ngu-phap/<nn>/*.json`): trường bắt buộc, 3–5 ví dụ có cách
 * đọc (ja: kana khớp câu gốc · zh: pinyin có dấu thanh), quiz 3 câu đáp án nằm trong lựa chọn, id `soSanh` tồn tại.
 *
 *   npx tsx scripts/ctlanguage-kiem-ngu-phap.mts            # cả thư viện (có kiểm chéo soSanh)
 *   npx tsx scripts/ctlanguage-kiem-ngu-phap.mts ja/n5-1    # chỉ một tệp (KHÔNG kiểm chéo soSanh, KHÔNG kiểm phân bố đáp án)
 * Cả thư viện còn kiểm PHÂN BỐ vị trí đáp án theo cấp (mỗi vị trí ≥ 15% với câu 4 lựa chọn) — soạn xong chạy
 * `npx tsx scripts/ctlanguage-xao-quiz-ngu-phap.mts` để xáo bằng máy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { CAP_NGU_PHAP, NN_NGU_PHAP, kiemPhanBoDapAn, kiemTatCa, kiemTep, type DiemDaNap, type TepNguPhap } from '../src/services/ctlanguage/nguPhapThuan.js';

const goc = path.join(process.cwd(), 'content', 'ctlanguage', 'ngu-phap');
const chi = process.argv.slice(2).map((x) => x.replace(/\.json$/, ''));
let hong = 0;
const tatCa: DiemDaNap[] = [];
const dem: Record<string, number> = {};
for (const nn of NN_NGU_PHAP) {
  let tep: string[] = [];
  try { tep = fs.readdirSync(path.join(goc, nn)).filter((f) => f.endsWith('.json')).sort((a, b) => a.localeCompare(b, 'en', { numeric: true })); } catch { /* chưa có */ }
  for (const f of tep) {
    const ten = `${nn}/${f.replace(/\.json$/, '')}`;
    if (chi.length && !chi.includes(ten)) continue;
    let t: TepNguPhap;
    try { t = JSON.parse(fs.readFileSync(path.join(goc, nn, f), 'utf8')); }
    catch (e) { console.error(`✗ ${ten}: JSON hỏng — ${(e as Error).message}`); hong++; continue; }
    const loi = kiemTep(t);
    if (t.nn !== nn) loi.push(`nn "${t.nn}" khác thư mục "${nn}"`);
    if (loi.length) { hong++; console.error(`✗ ${ten} — ${loi.length} lỗi:`); for (const l of loi.slice(0, 60)) console.error(`    ${l}`); }
    else console.log(`✓ ${ten} — ${t.cap} · ${t.diem.length} điểm`);
    for (const d of t.diem ?? []) { tatCa.push({ ...d, nn, cap: t.cap }); dem[`${nn} ${t.cap}`] = (dem[`${nn} ${t.cap}`] ?? 0) + 1; }
  }
}
if (!chi.length) {
  const cheo = kiemTatCa(tatCa);
  if (cheo.length) { hong++; console.error(`✗ kiểm chéo — ${cheo.length} lỗi:`); for (const l of cheo.slice(0, 80)) console.error(`    ${l}`); }
  // Phân bố vị trí đáp án theo cấp (câu 4 lựa chọn): không vị trí nào < 15% — xem docs/so-loi.md 15/11/2026.
  const pb = kiemPhanBoDapAn(tatCa);
  console.log('\nVị trí đáp án (câu 4 lựa chọn) — % ở lựa chọn 1 / 2 / 3 / 4:');
  for (const [cap, d] of Object.entries(pb.bang)) { const t = d.reduce((x, y) => x + y, 0); console.log(`  ${cap.padEnd(8)} ${d.map((n) => `${Math.round((n / t) * 100)}%`.padStart(4)).join(' ')}  (${t} câu)`); }
  if (pb.loi.length) { hong++; console.error(`✗ phân bố đáp án — ${pb.loi.length} lỗi:`); for (const l of pb.loi) console.error(`    ${l}`); }
}
console.log(`\n${tatCa.length} điểm ngữ pháp · ${NN_NGU_PHAP.map((nn) => CAP_NGU_PHAP[nn].map((c) => `${c} ${dem[`${nn} ${c}`] ?? 0}`).join(' · ')).join(' | ')} · ${hong ? `${hong} chỗ LỖI` : 'tất cả hợp lệ'}`);
if (!tatCa.length || hong) process.exit(1);
