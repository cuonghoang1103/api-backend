/**
 * Xáo thứ tự lựa chọn quiz của thư viện ngữ pháp CT Language bằng MÁY (hạt giống cố định theo id + số câu) — người / agent
 * soạn luôn dồn đáp án về lựa chọn đầu (docs/so-loi.md 15/11/2026). Idempotent: chạy lại không đổi gì.
 *
 *   npx tsx scripts/ctlanguage-xao-quiz-ngu-phap.mts                 # mọi tệp
 *   npx tsx scripts/ctlanguage-xao-quiz-ngu-phap.mts ja/n2-1 zh/hsk5-1   # chỉ các tệp nêu tên
 *   npx tsx scripts/ctlanguage-xao-quiz-ngu-phap.mts --thu           # chỉ báo sẽ đổi gì, không ghi
 *
 * ⚠ Câu hỏi / lời giải thích KHÔNG được nhắc vị trí lựa chọn ("phương án A", "cả hai câu trên", "đáp án đầu") —
 * script DỪNG nếu gặp, sửa lời rồi chạy lại.
 */
import fs from 'node:fs';
import path from 'node:path';
import { NN_NGU_PHAP, xaoQuizDiem, type TepNguPhap } from '../src/services/ctlanguage/nguPhapThuan.js';

const goc = path.join(process.cwd(), 'content', 'ctlanguage', 'ngu-phap');
const thamSo = process.argv.slice(2);
const thu = thamSo.includes('--thu');
const chi = thamSo.filter((x) => !x.startsWith('--')).map((x) => x.replace(/\.json$/, ''));
/** Lời nhắc tới VỊ TRÍ lựa chọn — xáo xong là sai nghĩa. */
const NHAC_VI_TRI = /(hai|ba|bốn) (câu|lựa chọn|phương án|đáp án) (đầu|cuối|sau|trên|dưới|còn lại đầu)|(câu|phương án|đáp án) (đầu tiên|cuối cùng|thứ (nhất|hai|ba|tư|[1-4])|[1-4A-D])(?![a-zA-Zà-ỹÀ-Ỹ0-9])|lựa chọn (đầu tiên|cuối cùng|thứ (nhất|hai|ba|tư|[1-4])|[1-4])(?![0-9])|cả (hai|ba|bốn) (câu|phương án|lựa chọn|đáp án) (trên|đều)|all of the above|none of the above|以上都|上記の/;

let doi = 0, tep = 0, cam = 0;
for (const nn of NN_NGU_PHAP) {
  let ds: string[] = [];
  try { ds = fs.readdirSync(path.join(goc, nn)).filter((f) => f.endsWith('.json')).sort((a, b) => a.localeCompare(b, 'en', { numeric: true })); } catch { /* chưa có */ }
  for (const f of ds) {
    const ten = `${nn}/${f.replace(/\.json$/, '')}`;
    if (chi.length && !chi.includes(ten)) continue;
    const duong = path.join(goc, nn, f);
    const t = JSON.parse(fs.readFileSync(duong, 'utf8')) as TepNguPhap;
    let doiTep = 0;
    t.diem = t.diem.map((d) => {
      for (const q of d.quiz ?? []) {
        const chu = `${q.gt} ${q.lc.join(' ')}`;
        const m = NHAC_VI_TRI.exec(chu);
        if (m) { cam++; console.error(`✗ ${ten} ${d.id}: lời nhắc vị trí lựa chọn "${m[0]}" — ${q.h.slice(0, 50)}`); }
      }
      const moi = xaoQuizDiem(d);
      if (JSON.stringify(moi.quiz) !== JSON.stringify(d.quiz)) doiTep++;
      return moi;
    });
    tep++;
    if (!doiTep) continue;
    doi += doiTep;
    console.log(`${thu ? '(thử) ' : ''}${ten}: xáo ${doiTep}/${t.diem.length} điểm`);
    if (!thu && !cam) fs.writeFileSync(duong, `${JSON.stringify(t, null, 2)}\n`);
  }
}
if (cam) { console.error(`\n${cam} câu nhắc vị trí lựa chọn — KHÔNG ghi gì. Sửa lời rồi chạy lại.`); process.exit(1); }
console.log(`\n${tep} tệp · ${doi} điểm ${thu ? 'sẽ ' : 'đã '}đổi thứ tự lựa chọn`);
