// @java: LeoCauThang.java
// LC 70 Climbing Stairs, written four times: recursion → memo (top-down) → table (bottom-up) → two variables.
let calls = 0;

// #region de-quy
// ways(n) = number of ways to climb n steps taking 1 or 2 at a time.
function climbNaive(n: number): number {
  calls++;
  if (n <= 1) return 1;                               // 0 or 1 step left: exactly one way
  return climbNaive(n - 1) + climbNaive(n - 2);       // last move was 1 step, or 2 steps
}
// #endregion

// #region nho
function climbMemo(n: number, memo = new Map<number, number>()): number {
  calls++;
  if (n <= 1) return 1;
  const known = memo.get(n);
  if (known !== undefined) return known;              // solved before: read the notebook, no recursion
  const ways = climbMemo(n - 1, memo) + climbMemo(n - 2, memo);
  memo.set(n, ways);                                  // write it down BEFORE returning
  return ways;
}
// #endregion

// #region bang
function climbTable(n: number): number {
  if (n <= 1) return 1;
  const dp = new Array<number>(n + 1).fill(0);        // dp[i] = ways to reach step i; n + 1 cells (0..n)
  dp[0] = 1;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];   // small to large: both are ready
  return dp[n];
}
// #endregion

// #region hai-bien
function climbTwoVars(n: number): number {
  let prev2 = 1, prev1 = 1;                           // ways(i - 2), ways(i - 1) when i = 2
  for (let i = 2; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;                                    // slide the window of two cells one step right
    prev1 = cur;
  }
  return prev1;
}
// #endregion

const ns = Array.from({ length: 10 }, (_, i) => i + 1);
console.log(`n        = ${JSON.stringify(ns)}`);
console.log(`naive    = ${JSON.stringify(ns.map((n) => climbNaive(n)))}`);
console.log(`memo     = ${JSON.stringify(ns.map((n) => climbMemo(n)))}`);
console.log(`table    = ${JSON.stringify(ns.map(climbTable))}`);
console.log(`two vars = ${JSON.stringify(ns.map(climbTwoVars))}`);
for (const n of [10, 30]) {
  calls = 0; climbNaive(n); const a = calls;
  calls = 0; climbMemo(n); const b = calls;
  console.log(`n=${n}: naive calls = ${a}, memo calls = ${b}`);
}
console.log(`ways(45) = ${climbTwoVars(45)}   (LeetCode's limit is n <= 45)`);
