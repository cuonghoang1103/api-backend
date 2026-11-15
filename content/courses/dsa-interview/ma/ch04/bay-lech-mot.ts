// @java: BayLechMot.java
// Four "almost right" binary searches. Each differs from the template in ONE character or one line.
// A loop cap turns "hangs forever" into a printable result.
const CAP = 100;
type Kq = string;

// #region dung
function lowerBound(a: number[], x: number): Kq {          // the template
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid] >= x) hi = mid; else lo = mid + 1;
  }
  return String(lo);
}
// #endregion

// #region sai
function bugLoEqMid(a: number[], x: number): Kq {          // bug 1: "lo = mid" (forgot + 1)
  let lo = 0, hi = a.length, loops = 0;
  while (lo < hi) {
    if (++loops > CAP) return `STUCK (lo=${lo}, hi=${hi})`;
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid] >= x) hi = mid; else lo = mid;
  }
  return String(lo);
}
function bugLessOrEqual(a: number[], x: number): Kq {      // bug 2: "while (lo <= hi)" with "hi = mid"
  let lo = 0, hi = a.length, loops = 0;
  while (lo <= hi) {
    if (++loops > CAP) return `STUCK (lo=${lo}, hi=${hi})`;
    const mid = lo + Math.floor((hi - lo) / 2);
    if (mid >= a.length) return `READS a[${mid}] OUTSIDE the array`; // JS gives undefined, Java throws
    if (a[mid] >= x) hi = mid; else lo = mid + 1;
  }
  return String(lo);
}
function bugHiLast(a: number[], x: number): Kq {           // bug 3: "hi = a.length - 1"
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid] >= x) hi = mid; else lo = mid + 1;
  }
  return String(lo);
}
function bugRoundUp(a: number[], x: number): Kq {          // bug 4: mid rounded UP with "hi = mid"
  let lo = 0, hi = a.length, loops = 0;
  while (lo < hi) {
    if (++loops > CAP) return `STUCK (lo=${lo}, hi=${hi})`;
    const mid = lo + Math.ceil((hi - lo) / 2);
    if (mid >= a.length) return `READS a[${mid}] OUTSIDE the array`;
    if (a[mid] >= x) hi = mid; else lo = mid + 1;
  }
  return String(lo);
}
// #endregion

const a = [1, 3, 5, 6];
console.log(`a = ${JSON.stringify(a)}   (correct lower bounds: x=5 -> 2, x=7 -> 4, x=0 -> 0)`);
for (const x of [5, 7, 0]) {
  console.log(`x=${x}: template=${lowerBound(a, x)} | lo=mid: ${bugLoEqMid(a, x)} | lo<=hi: ${bugLessOrEqual(a, x)} | hi=n-1: ${bugHiLast(a, x)} | mid rounds up: ${bugRoundUp(a, x)}`);
}
