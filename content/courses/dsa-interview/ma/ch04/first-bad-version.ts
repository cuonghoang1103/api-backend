// @java: FirstBadVersion.java
// LC 278 · First Bad Version — the purest F...F T...T row: versions 1..n, isBadVersion(v) flips once.
let bad = 4, calls = 0;
const isBadVersion = (v: number) => { calls++; return v >= bad; };

// #region lc278
function firstBadVersion(n: number): number {
  let lo = 1, hi = n;                          // n is known to be bad, so the answer is in [1, n]
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (isBadVersion(mid)) hi = mid;           // mid bad: first bad is mid or earlier
    else lo = mid + 1;                         // mid good: first bad is later
  }
  return lo;
}
// #endregion

for (const [n, b] of [[6, 4], [1, 1], [10, 1], [10, 10], [2147483647, 2147483647], [2147483647, 1702766719]]) {
  bad = b; calls = 0;
  console.log(`n=${n} firstBad=${b} -> ${firstBadVersion(n)} (${calls} calls to isBadVersion)`);
}
