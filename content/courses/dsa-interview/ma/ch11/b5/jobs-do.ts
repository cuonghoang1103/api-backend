// @thoi-gian
// LC 1235: cùng một DP, hai cách tìm "việc cuối cùng còn hợp": quét lùi tuyến tính (O(n²) cả bài) vs tìm nhị phân
// (O(n log n)). Việc ngẫu nhiên tất định, DÀI (tới nửa trục thời gian) nên chồng nhau nhiều ⇒ quét lùi đi rất xa.
// Đo lần nhanh nhất trong vài lượt. LeetCode: n ≤ 5·10⁴.
function makeJobs(n: number): [number[], number[], number[]] {
  let seed = 7;
  const rnd = (m: number) => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return Math.floor((seed / 4294967296) * m); };
  const s: number[] = [], e: number[] = [], p: number[] = [];
  for (let i = 0; i < n; i++) { const a = 1 + rnd(1_000_000_000); s.push(a); e.push(a + 1 + rnd(500_000_000)); p.push(1 + rnd(10_000)); }
  return [s, e, p];
}
function solve(start: number[], end: number[], profit: number[], binary: boolean): number {
  const n = start.length;
  const idx = Array.from({ length: n }, (_, i) => i).sort((a, b) => end[a] - end[b]);
  const ends = idx.map((i) => end[i]);
  const dp = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const job = idx[i - 1];
    let j: number;
    if (binary) {
      let lo = 0, hi = i - 1;
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (ends[mid] > start[job]) hi = mid; else lo = mid + 1; }
      j = lo;
    } else {
      j = i - 1;
      while (j > 0 && ends[j - 1] > start[job]) j--;   // scan backwards: O(i) in the worst case
    }
    dp[i] = Math.max(dp[i - 1], profit[job] + dp[j]);
  }
  return dp[n];
}
function best(f: () => number, reps: number): [number, number] {
  let b = Infinity, v = 0;
  for (let r = 0; r < reps; r++) { const t = performance.now(); v = f(); b = Math.min(b, performance.now() - t); }
  return [b, v];
}
console.log(`node ${process.version} ${process.arch}`);
for (const n of [1_000, 10_000, 50_000, 200_000, 1_000_000]) {
  const [s, e, p] = makeJobs(n);
  const [tb, vb] = best(() => solve(s, e, p, true), 3);
  let lin = 'skipped';
  if (n <= 50_000) {
    const [tl, vl] = best(() => solve(s, e, p, false), n <= 10_000 ? 3 : 1);
    lin = `${tl.toFixed(1)} ms${vl === vb ? '' : ' MISMATCH'}`;
  }
  console.log(`n=${n.toLocaleString('en-US')}  linear scan: ${lin}   binary search: ${tb.toFixed(1)} ms   answer=${vb}`);
}
