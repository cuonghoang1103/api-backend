// Catastrophic backtracking: nested quantifiers + input that ALMOST matches
const evil = /^(a+)+$/;
for (const n of [16, 18, 20, 22, 24]) {
  const input = 'a'.repeat(n) + '!';
  const t0 = performance.now();
  evil.test(input);
  const ms = (performance.now() - t0).toFixed(1);
  console.log(`n = ${n}  ${ms} ms`);
}

const safe = /^a+$/;
const big = 'a'.repeat(100000) + '!';
const t1 = performance.now();
safe.test(big);
console.log(`safe /^a+$/, 100000 chars: ${(performance.now() - t1).toFixed(1)} ms`);
