// @java: McCoinChange.java
// LC 322 Coin Change: the fewest coins that add up to amount (or -1).

// #region coin
function coinChange(coins: number[], amount: number): number {
  const INF = amount + 1;                         // more coins than any real answer can use
  const dp = new Array<number>(amount + 1).fill(INF);   // dp[a] = fewest coins that make a
  dp[0] = 0;                                      // base: 0 coins make amount 0
  for (let a = 1; a <= amount; a++) {             // order: small amounts first
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;   // last coin = c
    }
  }
  return dp[amount] === INF ? -1 : dp[amount];
}
// #endregion

const cases: Array<[number[], number]> = [[[1, 2, 5], 11], [[2], 3], [[1], 0], [[1, 3, 4], 6], [[2, 5, 10, 1], 27], [[186, 419, 83, 408], 6249], [[7], 28], [[5, 10], 3]];
for (const [coins, amount] of cases) {
  console.log(`coinChange(${JSON.stringify(coins)}, ${amount}) = ${coinChange(coins, amount)}`);
}
