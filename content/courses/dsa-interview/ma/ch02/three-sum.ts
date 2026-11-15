// @java: ThreeSum.java
// LC 15 · 3Sum — sort + fix one number + two pointers on the rest; skip duplicates at all three positions.

// #region dung
function threeSum(nums: number[]): number[][] {
  const a = [...nums].sort((x, y) => x - y);   // numeric comparator: default sort compares STRINGS
  const res: number[][] = [];
  for (let i = 0; i < a.length - 2; i++) {
    if (a[i] > 0) break;                        // smallest of the three is positive: no zero sum left
    if (i > 0 && a[i] === a[i - 1]) continue;   // same first number as last round: same triples
    let l = i + 1, r = a.length - 1;
    while (l < r) {
      const sum = a[i] + a[l] + a[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        res.push([a[i], a[l], a[r]]);
        l++; r--;
        while (l < r && a[l] === a[l - 1]) l++; // skip equal second numbers
        while (l < r && a[r] === a[r + 1]) r--; // skip equal third numbers
      }
    }
  }
  return res;
}
// #endregion

// #region sai
function threeSumNoDedup(nums: number[]): number[][] {
  const a = [...nums].sort((x, y) => x - y);
  const res: number[][] = [];
  for (let i = 0; i < a.length - 2; i++) {
    let l = i + 1, r = a.length - 1;
    while (l < r) {
      const sum = a[i] + a[l] + a[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else { res.push([a[i], a[l], a[r]]); l++; r--; }
    }
  }
  return res;
}
// #endregion

for (const nums of [[-1, 0, 1, 2, -1, -4], [0, 0, 0, 0], [0, 1, 1], [-2, 0, 0, 2, 2]]) {
  console.log(`threeSum(${JSON.stringify(nums)}) = ${JSON.stringify(threeSum(nums))}`);
  console.log(`   without dedup  = ${JSON.stringify(threeSumNoDedup(nums))}`);
}
