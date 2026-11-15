// @java: TlCoin.java
// Greedy change-making vs the exact DP answer. When is "take the biggest coin" right?

// #region greedy
// Greedy: always take the largest coin that still fits. coins sorted ascending.
function greedyCoins(coins: number[], amount: number): number {
  let count = 0;
  for (let k = coins.length - 1; k >= 0; k--) {
    count += Math.floor(amount / coins[k]); // take as many of this coin as fit
    amount %= coins[k];
  }
  return amount === 0 ? count : -1;
}
// #endregion

// #region dp
// Exact answer (lesson 9.2): dp[a] = fewest coins for amount a. Fills the table for 0..amount.
function dpTable(coins: number[], amount: number): number[] {
  const INF = amount + 1;                        // a safe "impossible" value: never overflows
  const dp = new Array(amount + 1).fill(INF);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins) if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
  return dp;
}
// #endregion

// #region kiem
// Compare greedy with DP for EVERY amount 1..N. Returns the amounts where greedy is worse.
function mismatches(coins: number[], N: number): number[] {
  const dp = dpTable(coins, N);
  const bad: number[] = [];
  for (let a = 1; a <= N; a++) if (greedyCoins(coins, a) !== dp[a]) bad.push(a);
  return bad;
}
// #endregion

const odd = [1, 3, 4];
console.log(`coins ${JSON.stringify(odd)}, amount 6: greedy = ${greedyCoins(odd, 6)} coins (4+1+1), DP = ${dpTable(odd, 6)[6]} coins (3+3)`);
const vnd = [1, 2, 5, 10, 20, 50, 100, 200, 500];
const N = 10000;
const b1 = mismatches(vnd, N);
console.log(`VND-like ${JSON.stringify(vnd)}: amounts 1..${N} where greedy is worse = ${b1.length}`);
const b2 = mismatches(odd, N);
console.log(`[1,3,4]: amounts 1..${N} where greedy is worse = ${b2.length}, first ten = ${JSON.stringify(b2.slice(0, 10))}`);
const b3 = mismatches([1, 5, 10, 25], N);
console.log(`US coins [1,5,10,25]: mismatches = ${b3.length}; without the nickel [1,10,25]: first = ${JSON.stringify(mismatches([1, 10, 25], N).slice(0, 3))}`);
