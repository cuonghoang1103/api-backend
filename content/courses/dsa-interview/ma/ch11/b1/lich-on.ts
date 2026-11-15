// @java: PvLichOn.java
// Lịch ôn cách quãng 1 · 3 · 7 · 14 ngày (bài 0.9) cho MỘT đề, kèm luật "ôn hỏng ⇒ về lại mốc 1 ngày".
// Đầu vào: ngày giải được lần đầu + kết quả từng lần ôn (true = tự giải lại được trong 10 phút, không nhìn).
// Chạy với đề và kết quả của chính bạn: sửa mảng `deCuaToi` ở cuối tệp.

// #region lich
const KHOANG = [1, 3, 7, 14];                        // days after the previous successful review

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function schedule(firstSolved: string, results: boolean[]): string[] {
  const lines: string[] = [];
  let step = 0;                                       // which interval we are on
  let day = firstSolved;
  for (const ok of results) {
    day = addDays(day, KHOANG[step]);
    lines.push(`${day}  review after ${KHOANG[step]}d: ${ok ? 'pass' : 'FAIL -> back to 1d'}`);
    step = ok ? step + 1 : 0;                         // fail resets the ladder
    if (step === KHOANG.length) { lines.push('graduated: move it to the monthly list'); break; }
  }
  if (step < KHOANG.length) lines.push(`next review: ${addDays(day, KHOANG[step])}`);
  return lines;
}
// #endregion

const deCuaToi: [string, string, boolean[]][] = [
  ['LC 15 3Sum', '2026-11-21', [true, true, true, true]],
  ['LC 33 Search in Rotated Sorted Array', '2026-12-01', [true, false, true, true, true, true]],
  ['LC 146 LRU Cache', '2026-11-27', [true, true]],
];
for (const [ten, ngay, kq] of deCuaToi) {
  console.log(`${ten} (first solved ${ngay})`);
  for (const l of schedule(ngay, kq)) console.log('  ' + l);
}
