// @java: DoiChieu.java
// Differential testing: run the fast solution and a trusted brute force on thousands of small random inputs,
// stop at the first disagreement. Generator = Park–Miller (x = x·48271 mod 2^31−1): every intermediate value
// stays below 2^53, so TypeScript and Java produce the SAME inputs from the same seed.

function maxWindowBuggy(nums: number[], k: number): number {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let s = 1; s < nums.length - k; s++) { sum += nums[s + k - 1] - nums[s - 1]; best = Math.max(best, sum); }
  return best;
}
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

// #region harness
const M = 2147483647;                                   // 2^31 − 1, a prime
function makeRandom(seed: number): () => number {
  let x = seed;                                         // seed in 1 .. M−1 (0 would stay 0 forever)
  return () => (x = (x * 48271) % M);                   // < 2^31 · 48271 < 2^53: exact in a JS number
}
function makeCase(seed: number): { nums: number[]; k: number } {
  const rnd = makeRandom(seed);
  const n = 1 + (rnd() % 6);                            // SMALL n: a failure is easy to trace by hand
  const nums = Array.from({ length: n }, () => (rnd() % 11) - 5);  // small values in −5..5: ties, zeros, negatives
  const k = 1 + (rnd() % n);                            // respects the contract 1 <= k <= n
  return { nums, k };
}
function check(name: string, fast: (a: number[], k: number) => number, tests: number): void {
  let failures = 0;
  let first = '';
  for (let seed = 1; seed <= tests; seed++) {
    const { nums, k } = makeCase(seed);
    const got = fast(nums, k), want = maxWindowBrute(nums, k);
    if (got !== want) {
      failures++;
      if (!first) first = `seed ${seed}: nums=${JSON.stringify(nums)} k=${k} fast=${got} brute=${want}`;
    }
  }
  console.log(`${name}: ${failures} of ${tests} random tests disagree with brute force`);
  if (first) console.log(`  first failure -> ${first}`);
}
// #endregion

check('buggy', maxWindowBuggy, 2000);
check('fixed', maxWindow, 2000);

// #region shrink
// Shrinking: among ALL failing inputs, report the smallest (shortest array, then smallest k).
let smallest: { nums: number[]; k: number; seed: number } | null = null;
for (let seed = 1; seed <= 2000; seed++) {
  const c = makeCase(seed);
  if (maxWindowBuggy(c.nums, c.k) === maxWindowBrute(c.nums, c.k)) continue;
  if (!smallest || c.nums.length < smallest.nums.length || (c.nums.length === smallest.nums.length && c.k < smallest.k)) {
    smallest = { ...c, seed };
  }
}
// #endregion
if (smallest) {
  console.log(`smallest failing input: seed ${smallest.seed}: nums=${JSON.stringify(smallest.nums)} k=${smallest.k}` +
    ` buggy=${maxWindowBuggy(smallest.nums, smallest.k)} brute=${maxWindowBrute(smallest.nums, smallest.k)}`);
}
