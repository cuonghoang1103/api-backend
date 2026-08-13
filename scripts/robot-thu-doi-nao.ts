/**
 * Lệnh "đổi não" bằng giọng nói có bắt đúng không.
 *
 * Phần khó không phải bắt được lệnh — mà là KHÔNG bắt nhầm câu nói thường.
 * "cái model mới này nói cũng được đấy" là người ta đang KỂ, không phải ra
 * lệnh; bắt nhầm câu đó là robot lặng lẽ đổi não giữa cuộc trò chuyện.
 *
 * Chạy: npx tsx scripts/robot-thu-doi-nao.ts
 */
import { khopDoiNao } from '../src/services/makerlab/nao.js';

const THU: Array<[string, string | null]> = [
  // ── Phải BẮT ──
  ['đổi về model cũ đi', 'cong'],
  ['chuyển sang não cũ cho tao', 'cong'],
  ['quay lại cái cũ đi mày', 'cong'],
  ['dùng não trên mạng đi', 'cong'],
  ['chuyển về cổng', 'cong'],
  ['đổi sang model mới', 'may-nha'],
  ['chuyển qua não ở nhà đi', 'may-nha'],
  ['dùng cái mới xem sao', 'may-nha'],
  ['xài não máy nhà đi', 'may-nha'],

  // ── TUYỆT ĐỐI không được bắt ──
  ['cái model mới này nói cũng được đấy', null],
  ['mày thấy não của mày thế nào', null],
  ['kể tao nghe chuyện cũ đi', null],
  ['hôm nay tao mệt quá', null],
  ['bật cho tao bài nhạc cũ đi', null],
  ['model cũ với model mới khác nhau chỗ nào', null],
  ['tao thích cái cũ hơn', null],
];

let sai = 0;
for (const [cau, mong] of THU) {
  const ra = khopDoiNao(cau);
  const ok = ra === mong;
  if (!ok) sai++;
  console.log(
    `${ok ? '  ✅' : '  ❌'} ${JSON.stringify(cau).padEnd(46)} → ${String(ra)}` +
      (ok ? '' : `   (mong: ${String(mong)})`),
  );
}
console.log(sai === 0 ? `\n${THU.length}/${THU.length} ĐÚNG HẾT` : `\n${sai}/${THU.length} SAI`);
process.exit(sai === 0 ? 0 : 1);
