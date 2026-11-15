// @thoi-gian
// How expensive is differential testing? Time T random tests (fixed solution vs brute force), for small arrays
// (n <= 6, what doi-chieu.ts uses) and for bigger ones (n <= 100). Best of 3 runs.
function maxWindow(nums: number[], k: number): number {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let s = 1; s <= nums.length - k; s++) { sum += nums[s + k - 1] - nums[s - 1]; best = Math.max(best, sum); }
  return best;
}
function maxWindowBrute(nums: number[], k: number): number {
  let best = -Infinity;
  for (let s = 0; s + k <= nums.length; s++) {
    let sum = 0;
    for (let i = s; i < s + k; i++) sum += nums[i];
    best = Math.max(best, sum);
  }
  return best;
}
const M = 2147483647;
function runTests(tests: number, maxN: number): number {
  let bad = 0;
  for (let seed = 1; seed <= tests; seed++) {
    let x = seed;
    const rnd = () => (x = (x * 48271) % M);
    const n = 1 + (rnd() % maxN);
    const nums = Array.from({ length: n }, () => (rnd() % 11) - 5);
    const k = 1 + (rnd() % n);
    if (maxWindow(nums, k) !== maxWindowBrute(nums, k)) bad++;
  }
  return bad;
}
function ms(f: () => unknown, lap = 3): number {
  let best = Infinity;
  for (let i = 0; i < lap; i++) { const t = performance.now(); f(); best = Math.min(best, performance.now() - t); }
  return best;
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('tests', 10)} | ${pad('n <= 6', 12)} | ${pad('n <= 100', 12)}`);
for (const t of [1_000, 10_000, 100_000, 1_000_000]) {
  const a = ms(() => runTests(t, 6)).toFixed(1) + ' ms';
  const b = t <= 100_000 ? ms(() => runTests(t, 100)).toFixed(1) + ' ms' : 'skipped';
  console.log(`${pad(t.toLocaleString('en-US'), 10)} | ${pad(a, 12)} | ${pad(b, 12)}`);
}
console.log(`failures found by the fixed version: ${runTests(100_000, 6)} of 100,000`);
console.log(`node ${process.version} · ${process.arch}`);
