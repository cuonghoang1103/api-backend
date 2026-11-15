// @java: MuaBanCoPhieu.java
// LC 121 · Best Time to Buy and Sell Stock — the worked example of the 6-step framework.
// #region brute
function maxProfitBrute(prices: number[]): number {
  let best = 0;
  for (let i = 0; i < prices.length; i++)          // buy day
    for (let j = i + 1; j < prices.length; j++)    // sell day, strictly later
      best = Math.max(best, prices[j] - prices[i]);
  return best;
}
// #endregion
// #region tot
function maxProfit(prices: number[]): number {
  let minSoFar = Infinity;   // cheapest buy price among days before today
  let best = 0;              // never negative: we may choose not to trade
  for (const p of prices) {
    best = Math.max(best, p - minSoFar);   // sell today?
    minSoFar = Math.min(minSoFar, p);      // or remember today as a cheaper buy
  }
  return best;
}
// #endregion
// #region test
const tests: [number[], number][] = [
  [[7, 1, 5, 3, 6, 4], 5],   // the example: buy at 1, sell at 6
  [[7, 6, 4, 3, 1], 0],      // only falling: do not trade
  [[5], 0],                  // one day
  [[], 0],                   // no days
  [[2, 4, 1, 3], 2],         // the minimum (1) comes AFTER the best pair (2 -> 4)
  [[3, 3, 3], 0],            // flat
];
for (const [p, want] of tests) {
  const got = maxProfit(p), brute = maxProfitBrute(p);
  console.log(`${JSON.stringify(p)} -> ${got} (brute ${brute}) ${got === want && brute === want ? 'OK' : 'FAIL want ' + want}`);
}
// #endregion
