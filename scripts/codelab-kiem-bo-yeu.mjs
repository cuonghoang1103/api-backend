#!/usr/bin/env node
/**
 * codelab-kiem-bo-yeu.mjs — kiểm "BỘ TEST YẾU PHẢI TRƯỢT" cho đề Code Lab chấm bằng 'js' (bổ sung cho
 * codelab-kiem-cham-trinh-duyet.mjs, không thay nó).
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * Lý do: với đề kiểm thử (SWT301…) "lời giải đạt 100% + khởi đầu trượt ≥ 1" chưa đủ — còn phải chứng minh
 * máy chấm KHÔNG cho qua một câu trả lời yếu/sai điển hình (bộ test chỉ có happy path, bộ UTCID thiếu
 * MC/DC, kết quả mong đợi chép từ mã…). Tác giả khai trong nguồn đề:
 *
 *   boYeu: [{ ten: 'chỉ happy path', tep: { 'tests.js': '…' }, phaiTruot?: ['Kills mutant M3', …] }]
 *
 * `tep` ghi ĐÈ lên lời giải (tệp không khai giữ nguyên lời giải). Mỗi biến thể phải trượt ≥ 1 kiểm; nếu có
 * `phaiTruot` thì mỗi chuỗi trong đó phải khớp (chứa trong moTa EN) một kiểm bị trượt.
 * Chạy bằng máy chấm Node (scripts/codelab-cham-js.mjs — cùng HARNESS với máy chấm trình duyệt).
 *
 *   node scripts/codelab-kiem-bo-yeu.mjs --track swt301-practice [--chi <module-slug>] [--chi-tiet]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chamKiemJs } from './codelab-cham-js.mjs';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const lay = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const TRACK = lay('--track');
const CHI = lay('--chi');
const CHI_TIET = args.includes('--chi-tiet');
if (!TRACK) { console.error('cần --track <slug>'); process.exit(2); }
const NGUON = path.join(GOC, 'content/codelab', TRACK, 'nguon');
const L = (v) => (v && typeof v === 'object' ? v.en ?? v.vi : v);

let soBien = 0, hong = 0;
for (const f of fs.readdirSync(NGUON).filter((x) => x.endsWith('.mjs') && !x.startsWith('_')).sort()) {
  const m = (await import(pathToFileURL(path.join(NGUON, f)).href)).default;
  if (CHI && m.slug !== CHI) continue;
  for (const de of m.de) {
    if (!de.boYeu?.length) continue;
    const tj = de.tests;
    if (!tj || !['js', 'console'].includes(tj.loai)) continue;
    const giai = Object.fromEntries(Object.entries(de.loiGiai || {}).map(([k, v]) => [k, String(v)]));
    for (const b of de.boYeu) {
      soBien++;
      const files = { ...giai, ...b.tep };
      const kq = tj.kiem.map((k) => ({ k, r: chamKiemJs(tj, k, files) }));
      const truot = kq.filter((x) => !x.r.dat);
      const thieu = (b.phaiTruot || []).filter((s) => !truot.some((x) => String(L(x.k.moTa)).includes(s)));
      const ok = truot.length > 0 && !thieu.length;
      if (!ok) hong++;
      const tieu = L(de.tieuDe);
      console.log(`${ok ? '✓' : '✗'} [${m.slug}] "${String(tieu).slice(0, 60)}" · bộ yếu "${b.ten}" — trượt ${truot.length}/${kq.length}${thieu.length ? ` · KHÔNG trượt như mong đợi: ${thieu.join(' | ')}` : ''}`);
      if (CHI_TIET || !ok) for (const x of truot.slice(0, CHI_TIET ? 99 : 4)) console.log(`      ✗ ${String(L(x.k.moTa)).slice(0, 90)} — ${String(x.r.thay).slice(0, 120)}`);
    }
  }
}
console.log(hong ? `\n✗ ${hong}/${soBien} bộ yếu LỌT máy chấm` : `\n✓ ${soBien} bộ yếu đều bị máy chấm bắt`);
process.exit(hong ? 1 : 0);
