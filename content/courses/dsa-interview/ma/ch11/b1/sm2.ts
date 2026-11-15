// So lịch cố định 1·3·7·14 với SM-2 — đúng công thức của src/services/srs/sm2.ts trong repo này (scheduleSm2:
// quality 0–5, ease sàn 1,3, khoảng 1 → 6 → round(khoảng × ease); quality < 3 ⇒ về 1 ngày). Chép công thức để tệp
// chạy độc lập (bộ chạy của khoá không import mã ngoài).

// #region sm2
function scheduleSm2(state: { ease: number; reps: number; interval: number }, quality: number) {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  let { ease, reps, interval } = state;
  if (q < 3) {
    reps = 0;
    interval = 1;
  } else {
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 6;
    else interval = Math.round(interval * ease);
    reps += 1;
  }
  ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  return { ease, reps, interval };
}
// #endregion

function run(label: string, qualities: number[]): void {
  let s = { ease: 2.5, reps: 0, interval: 0 };
  let day = 0;
  const marks: string[] = [];
  for (const q of qualities) {
    s = scheduleSm2(s, q);
    day += s.interval;
    marks.push(`+${s.interval}d (q=${q}, ease ${s.ease.toFixed(2)})`);
  }
  console.log(`${label.padEnd(34)} ${marks.join(' -> ')}  | last review on day ${day}`);
}
run('always easy (q=5)', [5, 5, 5, 5]);
run('always fine (q=4)', [4, 4, 4, 4]);
run('always hard but correct (q=3)', [3, 3, 3, 3]);
run('fine, then FAILED once (q=2), fine', [4, 4, 2, 4, 4]);
const fixed = [1, 3, 7, 14];
console.log(`${'fixed ladder (lesson 0.9)'.padEnd(34)} ${fixed.map((d) => '+' + d + 'd').join(' -> ')}  | last review on day ${fixed.reduce((a, b) => a + b, 0)}`);
