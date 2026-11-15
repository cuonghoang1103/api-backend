// @java: TlSprint.java
// A toy version of the sprint planner (src/services/work/ai.service.ts › planSprint): no database, made-up backlog.
// Greedy in rank order ("fits? take it") vs a 0/1 knapsack that only maximises points.
type Issue = { key: string; points: number };
const backlog: Issue[] = [                      // already sorted by rank: index 0 = most important
  { key: 'CTW-1', points: 8 }, { key: 'CTW-2', points: 13 }, { key: 'CTW-3', points: 5 },
  { key: 'CTW-4', points: 3 }, { key: 'CTW-5', points: 2 }, { key: 'CTW-6', points: 1 },
];
const target = 20;

// #region greedy
function planGreedy(items: Issue[], cap: number): Issue[] {
  const picked: Issue[] = [];
  let total = 0;
  for (const it of items) {                     // rank order = the product owner's priority
    if (total + it.points > cap) continue;      // same rule as planSprint: too big for what is left -> skip
    picked.push(it);
    total += it.points;
  }
  return picked;
}
// #endregion

// #region knapsack
function planKnapsack(items: Issue[], cap: number): Issue[] {
  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(cap + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let w = 0; w <= cap; w++) {
      dp[i][w] = dp[i - 1][w];                                            // skip item i-1
      const p = items[i - 1].points;
      if (p <= w) dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - p] + p);    // take it
    }
  const picked: Issue[] = [];
  for (let i = n, w = cap; i > 0; i--)                                    // walk back to recover the set
    if (dp[i][w] !== dp[i - 1][w]) { picked.unshift(items[i - 1]); w -= items[i - 1].points; }
  return picked;
}
// #endregion

const show = (s: Issue[]) => `${s.map((x) => `${x.key}(${x.points})`).join(' ')} = ${s.reduce((a, x) => a + x.points, 0)} pts`;
console.log(`target ${target} points`);
console.log(`greedy by rank : ${show(planGreedy(backlog, target))}`);
console.log(`knapsack (max) : ${show(planKnapsack(backlog, target))}`);
