// @java: NdCooldown.java
// LC 309 Best Time to Buy and Sell Stock with Cooldown — a DP whose state is "which situation am I in today".

// #region giai
function maxProfit(prices: number[]): number {
  let hold = -Infinity;   // best profit at the end of the day while HOLDING a share
  let sold = -Infinity;   // best profit if we SOLD today (tomorrow is a forced cooldown)
  let rest = 0;           // best profit while holding nothing and free to buy tomorrow
  for (const p of prices) {
    const h = Math.max(hold, rest - p);   // keep holding, or buy today (only from "rest", never right after selling)
    const s = hold + p;                   // sell today: we must have held at the end of yesterday
    const r = Math.max(rest, sold);       // do nothing: yesterday we rested, or yesterday's sale cooled down
    hold = h; sold = s; rest = r;         // all three from YESTERDAY's values, then switch together
  }
  return Math.max(sold, rest);
}
// #endregion

// #region sai
// Forgetting the cooldown: only two situations, hold / free. Looks right, answers a different problem.
function maxProfitNoCooldown(prices: number[]): number {
  let hold = -Infinity, free = 0;
  for (const p of prices) {
    const h = Math.max(hold, free - p);   // BUG: buys the day right after a sale
    const f = Math.max(free, hold + p);
    hold = h; free = f;
  }
  return free;
}
// #endregion

// Brute force over every sequence of actions (n small).
function brute(prices: number[], day = 0, holding = false, cooling = false): number {
  if (day === prices.length) return 0;
  let best = brute(prices, day + 1, holding, false);                                  // do nothing
  if (holding) best = Math.max(best, prices[day] + brute(prices, day + 1, false, true)); // sell
  else if (!cooling) best = Math.max(best, -prices[day] + brute(prices, day + 1, true, false)); // buy
  return best;
}

for (const p of [[1, 2, 3, 0, 2], [1], [5, 4, 3, 2, 1], [2, 1, 4, 5, 2, 9, 7]]) {
  console.log(`${JSON.stringify(p)}: with cooldown ${maxProfit(p)}, forgetting it ${maxProfitNoCooldown(p)}`);
}
let seed = 309, bad = 0;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
for (let t = 0; t < 2000; t++) {
  const p = Array.from({ length: 1 + rnd(9) }, () => rnd(8));
  if (maxProfit(p) !== brute(p)) bad++;
}
console.log(`random self-test vs brute force: 2000 cases, ${bad} mismatches`);
