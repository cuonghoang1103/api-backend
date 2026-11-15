// @java: SortBienThe.java
// Sorting as a tool, three variants: LC 179 Largest Number · LC 274 H-Index · LC 75 Sort Colors.

// #region largest
function largestNumber(nums: number[]): string {
  const s = nums.map(String);
  s.sort((a, b) => (b + a > a + b ? 1 : b + a < a + b ? -1 : 0)); // a goes first if "ab" beats "ba"
  if (s[0] === '0') return '0';                                     // all zeros: "000" -> "0"
  return s.join('');
}
// #endregion

// #region hindex
function hIndexSort(citations: number[]): number {
  const c = [...citations].sort((a, b) => b - a);   // most cited first
  let h = 0;
  while (h < c.length && c[h] >= h + 1) h++;        // paper h+1 has at least h+1 citations
  return h;
}
function hIndexCount(citations: number[]): number {
  const n = citations.length;
  const papers = new Array(n + 1).fill(0);          // papers[c] = how many papers have c citations (c capped at n)
  for (const c of citations) papers[Math.min(c, n)]++;
  let atLeast = 0;
  for (let h = n; h >= 0; h--) {
    atLeast += papers[h];                           // papers with >= h citations
    if (atLeast >= h) return h;
  }
  return 0;
}
// #endregion

// #region colors
function sortColors(nums: number[]): void {
  const cnt = [0, 0, 0];
  for (const x of nums) cnt[x]++;                   // counting sort: only 3 possible values
  let i = 0;
  for (let v = 0; v < 3; v++) for (let t = 0; t < cnt[v]; t++) nums[i++] = v;
}
// #endregion

console.log('largestNumber([3,30,34,5,9]) =', largestNumber([3, 30, 34, 5, 9]));
console.log('largestNumber([10,2]) =', largestNumber([10, 2]));
console.log('largestNumber([0,0]) =', largestNumber([0, 0]));
for (const c of [[3, 0, 6, 1, 5], [1, 3, 1], [100], [0]]) {
  console.log(`hIndex(${JSON.stringify(c)}) = ${hIndexSort(c)} (sort) / ${hIndexCount(c)} (count)`);
}
const colors = [2, 0, 2, 1, 1, 0];
sortColors(colors);
console.log('sortColors([2,0,2,1,1,0]) ->', JSON.stringify(colors));
