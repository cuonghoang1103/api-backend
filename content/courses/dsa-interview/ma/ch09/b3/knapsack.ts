// @java: HcKnapsack.java
// 0/1 knapsack (table, then one row with j going DOWN) + LC 416 Partition Equal Subset Sum + the "j going up" bug.

// #region bang
// w[k] = weight (cost) of item k, v[k] = value; W = capacity. Each item is used AT MOST once.
function knapsack(w: number[], v: number[], W: number): number {
  const n = w.length;
  // dp[i][c] = best value using only the first i items with capacity c
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let c = 0; c <= W; c++) {
      dp[i][c] = dp[i - 1][c];                                             // skip item i-1
      if (w[i - 1] <= c) dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - w[i - 1]] + v[i - 1]); // take it (row i-1!)
    }
  }
  return dp[n][W];
}
// #endregion

// #region mot-hang
function knapsack1D(w: number[], v: number[], W: number): number {
  const dp = new Array(W + 1).fill(0);
  for (let k = 0; k < w.length; k++) {
    for (let c = W; c >= w[k]; c--) {          // DOWN: dp[c - w[k]] is still the value from the previous item
      dp[c] = Math.max(dp[c], dp[c - w[k]] + v[k]);
    }
  }
  return dp[W];
}
// #endregion

// #region sai
function knapsack1DWrong(w: number[], v: number[], W: number): number {
  const dp = new Array(W + 1).fill(0);
  for (let k = 0; k < w.length; k++) {
    for (let c = w[k]; c <= W; c++) {          // UP: dp[c - w[k]] may already contain item k ⇒ item reused
      dp[c] = Math.max(dp[c], dp[c - w[k]] + v[k]);
    }
  }
  return dp[W];
}
// #endregion

// #region lc416
function canPartition(nums: number[]): boolean {
  const sum = nums.reduce((s, x) => s + x, 0);
  if (sum % 2 === 1) return false;             // odd total: two equal halves impossible
  const target = sum / 2;
  const can = new Array(target + 1).fill(false);
  can[0] = true;                               // the empty subset makes 0
  for (const x of nums) {
    for (let s = target; s >= x; s--) {        // DOWN again: each number used once
      if (can[s - x]) can[s] = true;
    }
  }
  return can[target];
}
function canPartitionWrong(nums: number[]): boolean {   // same, but s goes UP
  const sum = nums.reduce((s, x) => s + x, 0);
  if (sum % 2 === 1) return false;
  const target = sum / 2;
  const can = new Array(target + 1).fill(false);
  can[0] = true;
  for (const x of nums) for (let s = x; s <= target; s++) if (can[s - x]) can[s] = true;
  return can[target];
}
// #endregion

// #region ty-le
// The tempting shortcut: take items by value per unit of weight, best first, while they fit.
function greedyByRatio(w: number[], v: number[], W: number): number {
  const order = w.map((_, k) => k).sort((x, y) => v[y] / w[y] - v[x] / w[x]);
  let cap = W, got = 0;
  for (const k of order) if (w[k] <= cap) { cap -= w[k]; got += v[k]; }
  return got;
}
// #endregion

const w = [1, 3, 4, 5], v = [1, 4, 5, 7];
console.log(`items w = ${JSON.stringify(w)}, v = ${JSON.stringify(v)}, W = 7`);
console.log(`table = ${knapsack(w, v, 7)}   one row (down) = ${knapsack1D(w, v, 7)}   one row (UP, wrong) = ${knapsack1DWrong(w, v, 7)}`);
console.log(`greedy by value/weight = ${greedyByRatio(w, v, 7)}`);
console.log(`single item w = [3], v = [4], W = 7:  correct = ${knapsack1D([3], [4], 7)}   UP = ${knapsack1DWrong([3], [4], 7)}`);
for (const nums of [[1, 5, 11, 5], [1, 2, 3, 5], [1, 2, 5], [2, 2], [100]]) {
  console.log(`canPartition(${JSON.stringify(nums)}) = ${canPartition(nums)}   UP version says ${canPartitionWrong(nums)}`);
}
