// @java: BienThe91.java
// Same recipe, different skin: LC 746 Min Cost Climbing Stairs and LC 1137 N-th Tribonacci Number.

// #region lc746
// cost[i] = price of stepping ON stair i. Start at stair 0 or 1 for free; the top is just past the last stair.
function minCostClimbingStairs(cost: number[]): number {
  const n = cost.length;
  let prev2 = 0, prev1 = 0;                     // best(i - 2), best(i - 1): cheapest way to STAND at i (not paid yet)
  for (let i = 2; i <= n; i++) {                // i = n is "the top"
    const cur = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
// #endregion

// #region lc1137
function tribonacci(n: number): number {
  let a = 0, b = 1, c = 1;                      // T(i), T(i + 1), T(i + 2) for i = 0
  for (let i = 0; i < n; i++) [a, b, c] = [b, c, a + b + c];
  return a;
}
// #endregion

console.log(`minCost([10,15,20]) = ${minCostClimbingStairs([10, 15, 20])}`);
console.log(`minCost([1,100,1,1,1,100,1,1,100,1]) = ${minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1])}`);
console.log(`minCost([5,7]) = ${minCostClimbingStairs([5, 7])}`);
console.log(`tribonacci(0..10) = ${JSON.stringify(Array.from({ length: 11 }, (_, i) => tribonacci(i)))}`);
console.log(`tribonacci(25) = ${tribonacci(25)}  tribonacci(37) = ${tribonacci(37)}`);
