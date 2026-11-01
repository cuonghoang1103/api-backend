// collisions.mjs — bài 11.2: đo (không đoán) số mã trùng của ba cách sinh mã
// node interview/shortener/collisions.mjs [N=1000000]
import { toBase62, fromBase62, randomCode, hashCode } from './codes.mjs';

const N = Number(process.argv[2] ?? 1_000_000);
const fmt = (x) => x.toLocaleString('en-US', { maximumFractionDigits: 1 });

function trial(gen) {
  const seen = new Set();
  let dup = 0;
  const t0 = process.hrtime.bigint();
  for (let i = 0; i < N; i++) {
    const c = gen(i);
    if (seen.has(c)) dup++; else seen.add(c);
  }
  const ns = Number(process.hrtime.bigint() - t0) / N;
  return { dup, ns };
}

console.log(`N = ${fmt(N)} link`);
console.log('cách                     không gian        trùng (đo, 3 lần)   kỳ vọng ≈ N²/2S   ns/mã');
for (const len of [5, 6, 7]) {
  const S = 62 ** len;
  const runs = [trial(() => randomCode(len)), trial(() => randomCode(len)), trial(() => randomCode(len))];
  console.log(`ngẫu nhiên ${len} ký tự       ${fmt(S).padStart(16)}   ${runs.map((r) => r.dup).join(' / ').padEnd(18)}  ${fmt((N * N) / (2 * S)).padStart(14)}   ${Math.round(runs[0].ns)}`);
}
for (const len of [6, 7]) {
  const S = 62 ** len;
  const r = trial((i) => hashCode(`https://club.fpt.edu.vn/su-kien/${i}`, len));
  console.log(`băm sha256 cắt ${len} ký tự   ${fmt(S).padStart(16)}   ${String(r.dup).padEnd(18)}  ${fmt((N * N) / (2 * S)).padStart(14)}   ${Math.round(r.ns)}`);
}
const c = trial((i) => toBase62(1000 + i));
console.log(`base62 của bộ đếm          (vô hạn)           ${String(c.dup).padEnd(18)}  ${'0'.padStart(14)}   ${Math.round(c.ns)}`);

// Bộ đếm: mã ngắn dần dài ra, và ai cũng đoán được mã của người khác
console.log('\nbase62 của bộ đếm:');
for (const n of [1, 61, 62, 3_843, 3_844, 1_000_000, 62 ** 6 - 1, 62 ** 6]) console.log(`  id ${fmt(n).padStart(14)} → ${toBase62(n).padEnd(8)} (${toBase62(n).length} ký tự)`);
const mine = toBase62(1_000_000);
console.log(`  mã của tôi ${mine} ⇒ mã trước/sau: ${toBase62(fromBase62(mine) - 1)} ${toBase62(fromBase62(mine) + 1)} (đoán được)`);
console.log(`  cùng URL băm hai lần: ${hashCode('https://club.fpt.edu.vn/su-kien/1', 7)} = ${hashCode('https://club.fpt.edu.vn/su-kien/1', 7)}`);
