// @thoi-gian
// Measure: brute force O(n^2) vs hash map O(n) on the WORST case (the only pair is the last two numbers).
function twoSumBrute(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) return [i, j];
  return [];
}
function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j, i];
    seen.set(nums[i], i);
  }
  return [];
}
function ms(f: () => unknown, lap = 3): number {
  let best = Infinity;
  for (let k = 0; k < lap; k++) {
    const t = performance.now();
    f();
    best = Math.min(best, performance.now() - t);
  }
  return best;
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('n', 10)} | ${pad('brute O(n^2)', 14)} | ${pad('hash O(n)', 11)}`);
for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
  const nums = Array.from({ length: n }, (_, i) => i);
  const target = (n - 2) + (n - 1);           // only nums[n-2] + nums[n-1] works
  const b = n <= 100_000 ? ms(() => twoSumBrute(nums, target), n === 100_000 ? 1 : 3).toFixed(1) + ' ms' : 'skipped';
  const h = ms(() => twoSum(nums, target)).toFixed(2) + ' ms';
  console.log(`${pad(n.toLocaleString('en-US'), 10)} | ${pad(b, 14)} | ${pad(h, 11)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
