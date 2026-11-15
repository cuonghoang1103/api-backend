// @java: BitTapCon.java
// LC 78 · Subsets with a bitmask: bit i of mask = "is nums[i] in this subset?"

// #region subsets
function subsets(nums: number[]): number[][] {
  const n = nums.length;
  const out: number[][] = [];
  for (let mask = 0; mask < (1 << n); mask++) {     // 2^n masks: 0 .. 2^n - 1
    const cur: number[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) cur.push(nums[i]);        // test bit i
    }
    out.push(cur);
  }
  return out;
}
// #endregion

// #region tin-chi
// Five electives with these credits; how many ways to pick courses that total exactly 7 credits?
function countPicks(credits: number[], target: number): { ways: number; first: number[] } {
  const n = credits.length;
  let ways = 0;
  let first: number[] = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) if ((mask >> i) & 1) sum += credits[i];
    if (sum === target) {
      if (ways === 0) for (let i = 0; i < n; i++) if ((mask >> i) & 1) first.push(i);
      ways++;
    }
  }
  return { ways, first };
}
// #endregion

console.log(`subsets([1,2,3]) = ${JSON.stringify(subsets([1, 2, 3]))}`);
console.log(`subsets(n=20) count = ${1 << 20}`);
const r = countPicks([3, 3, 2, 4, 1], 7);
console.log(`credits [3,3,2,4,1], target 7 -> ${r.ways} ways, first one uses courses ${JSON.stringify(r.first)}`);
