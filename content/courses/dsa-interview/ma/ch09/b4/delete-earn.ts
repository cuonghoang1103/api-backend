// @java: NdDeleteEarn.java
// LC 740 Delete and Earn — House Robber in disguise, plus "which values did we take?" (rebuilding the choice).

// #region giai
function deleteAndEarn(nums: number[]): number {
  const maxV = Math.max(...nums);
  const points = new Array<number>(maxV + 1).fill(0);  // points[v] = v × (how many times v appears)
  for (const x of nums) points[x] += x;
  let prev2 = 0, prev1 = 0;                            // best using values ≤ v−2, best using values ≤ v−1
  for (let v = 1; v <= maxV; v++) {
    const cur = Math.max(prev1, prev2 + points[v]);    // skip v  |  take every copy of v (so v−1 is gone)
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
// #endregion

// #region chon
function pickedValues(nums: number[]): number[] {
  const maxV = Math.max(...nums);
  const points = new Array<number>(maxV + 1).fill(0);
  for (const x of nums) points[x] += x;
  const dp = new Array<number>(maxV + 1).fill(0);      // keep the whole table: we walk back through it
  for (let v = 1; v <= maxV; v++) dp[v] = Math.max(dp[v - 1], (v >= 2 ? dp[v - 2] : 0) + points[v]);
  const picked: number[] = [];
  for (let v = maxV; v >= 1;) {
    if (dp[v] === dp[v - 1]) v--;                      // skipping v was as good: v not taken
    else { picked.push(v); v -= 2; }                   // v was taken ⇒ v−1 is forbidden, continue at v−2
  }
  return picked.reverse();
}
// #endregion

// Brute force: try every set of distinct values with no two consecutive.
function brute(nums: number[]): number {
  const vals = [...new Set(nums)].sort((a, b) => a - b);
  let best = 0;
  for (let mask = 0; mask < 1 << vals.length; mask++) {
    let ok = true, sum = 0;
    for (let i = 0; i < vals.length && ok; i++) if (mask & (1 << i)) {
      for (let j = 0; j < i; j++) if (mask & (1 << j) && vals[i] - vals[j] === 1) ok = false;
      sum += vals[i] * nums.filter((x) => x === vals[i]).length;
    }
    if (ok) best = Math.max(best, sum);
  }
  return best;
}

for (const nums of [[3, 4, 2], [2, 2, 3, 3, 3, 4], [1, 1, 1, 2, 4, 5, 5, 5, 6], [7]]) {
  console.log(`${JSON.stringify(nums)} -> ${deleteAndEarn(nums)}  take ${JSON.stringify(pickedValues(nums))}`);
}
let seed = 740, bad = 0;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
for (let t = 0; t < 2000; t++) {
  const nums = Array.from({ length: 1 + rnd(9) }, () => 1 + rnd(9));
  if (deleteAndEarn(nums) !== brute(nums)) bad++;
}
console.log(`random self-test vs brute force: 2000 cases, ${bad} mismatches`);
