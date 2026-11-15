// Nháp cho bài thi cuối khoá 11.6: mọi output nhắc trong câu hỏi đều lấy từ lần chạy THẬT của tệp này (và PvCauHoi.java).

// Q: default sort in JavaScript compares strings
console.log('sort():', JSON.stringify([10, 9, 1, 2].sort()), ' sort((a,b)=>a-b):', JSON.stringify([10, 9, 1, 2].sort((a, b) => a - b)));

// Q: shifting a negative number
console.log('-8 >> 1 =', -8 >> 1, '  -8 >>> 1 =', -8 >>> 1);

// Q: TypeScript numbers are exact up to 2^53
console.log('2^53 === 2^53 + 1 ?', 2 ** 53 === 2 ** 53 + 1, '  0.1 + 0.2 === 0.3 ?', 0.1 + 0.2 === 0.3);

// Q: sliding window, LC 3, "jump left" without max()
function longestOk(s: string): number {
  const last = new Map<string, number>();
  let left = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const p = last.get(s[r]);
    if (p !== undefined) left = Math.max(left, p + 1);
    last.set(s[r], r);
    best = Math.max(best, r - left + 1);
  }
  return best;
}
function longestNoMax(s: string): number {
  const last = new Map<string, number>();
  let left = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const p = last.get(s[r]);
    if (p !== undefined) left = p + 1;              // BUG: can move left backwards
    last.set(s[r], r);
    best = Math.max(best, r - left + 1);
  }
  return best;
}
for (const s of ['abcabcbb', 'abba', 'tmmzuxt']) console.log(`LC3 "${s}": correct=${longestOk(s)} withoutMax=${longestNoMax(s)}`);

// Q: job scheduling, ">=" instead of ">" in the upper-bound search
function jobs(start: number[], end: number[], profit: number[], strict: boolean): number {
  const n = start.length;
  const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => end[a] - end[b]);
  const ends = idx.map((i) => end[i]);
  const dp = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const job = idx[i - 1];
    let lo = 0, hi = i - 1;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (strict ? ends[mid] > start[job] : ends[mid] >= start[job]) hi = mid; else lo = mid + 1;
    }
    dp[i] = Math.max(dp[i - 1], profit[job] + dp[lo]);
  }
  return dp[n];
}
console.log('jobs 1-2,2-3,3-4 (profit 1 each): with > :', jobs([1, 2, 3], [2, 3, 4], [1, 1, 1], true), ' with >= :', jobs([1, 2, 3], [2, 3, 4], [1, 1, 1], false));

// Q: Boyer-Moore without the verification pass
function vote(a: number[]): number { let c = 0, k = 0; for (const x of a) { if (k === 0) c = x; k += x === c ? 1 : -1; } return c; }
console.log('vote([1,1,2,2,3]) =', vote([1, 1, 2, 2, 3]), ' vote([3,3,4]) =', vote([3, 3, 4]));

// Q: memo check with a falsy value
let calls = 0;
const memo: number[] = [];
function waysBad(n: number): number {                 // ways to reach n with steps of 2 only (odd n ⇒ 0)
  calls++;
  if (n === 0) return 1;
  if (n < 0) return 0;
  if (memo[n]) return memo[n];                         // BUG: a stored 0 looks "not computed"
  return (memo[n] = waysBad(n - 2) + waysBad(n - 4));
}
waysBad(31);
const badCalls = calls;
calls = 0;
const memo2 = new Map<number, number>();
function waysGood(n: number): number {
  calls++;
  if (n === 0) return 1;
  if (n < 0) return 0;
  const m = memo2.get(n);
  if (m !== undefined) return m;
  const v = waysGood(n - 2) + waysGood(n - 4);
  memo2.set(n, v);
  return v;
}
waysGood(31);
console.log(`steps {2,4}, n=31: calls with if (memo[n]) = ${badCalls}, with !== undefined = ${calls}`);

// Q: Two Sum with the two lines swapped (insert first, then check)
function twoSumSwapped(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    seen.set(nums[i], i);                              // BUG: inserted before the lookup
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j, i];
  }
  return [];
}
console.log('swapped twoSum([3,3], 6) =', JSON.stringify(twoSumSwapped([3, 3], 6)), '  swapped twoSum([3], 6) =', JSON.stringify(twoSumSwapped([3], 6)));
