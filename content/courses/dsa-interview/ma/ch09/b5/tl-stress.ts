// @java: TlStress.java
// Stress test: let the computer hunt for a counterexample to a greedy idea.
// Random small coin systems {1, a, b}; compare greedy with the exact DP on every amount up to 2b.
let seed = 20261115;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };

function greedyCoins(coins: number[], amount: number): number {
  let count = 0;
  for (let k = coins.length - 1; k >= 0; k--) { count += Math.floor(amount / coins[k]); amount %= coins[k]; }
  return count;
}
function dpCoins(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount];
}

// #region stress
let trials = 0, failed = 0;
let first: string | null = null;
for (let t = 0; t < 500; t++) {
  const a = 2 + rnd(9);                 // 2..10
  const b = a + 1 + rnd(10);            // a+1..a+10
  const coins = [1, a, b];
  trials++;
  for (let amount = 1; amount <= 2 * b; amount++) {
    const g = greedyCoins(coins, amount), d = dpCoins(coins, amount);
    if (g !== d) {
      failed++;
      if (first === null) first = `trial ${trials}: coins ${JSON.stringify(coins)}, amount ${amount}: greedy ${g}, DP ${d}`;
      break;                            // one counterexample per coin system is enough
    }
  }
}
console.log(`first counterexample -> ${first}`);
console.log(`${trials} random systems {1,a,b}: greedy fails on ${failed}, correct on ${trials - failed}`);
// #endregion
