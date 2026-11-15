// Sprint planning two ways on a made-up backlog (already sorted by rank = the product owner's priority).
// (1) the rule used by src/services/work/ai.service.ts › planSprint: walk in rank order, skip an issue if it overflows
// (2) 0/1 knapsack: the subset of issues whose points fill the target as much as possible, ignoring rank.
const backlog = [
  { key: 'CT-1', pts: 8, title: 'Fix login timeout' },
  { key: 'CT-2', pts: 8, title: 'Payment receipt email' },
  { key: 'CT-3', pts: 5, title: 'Export grades to Excel' },
  { key: 'CT-4', pts: 3, title: 'Dark mode for reports' },
  { key: 'CT-5', pts: 2, title: 'Typo in footer' },
  { key: 'CT-6', pts: 13, title: 'New dashboard' },
  { key: 'CT-7', pts: 7, title: 'Profile badges' },
];
const target = 20;

// #region tham-lam
let total = 0;
const greedy: string[] = [];
for (const it of backlog) {
  if (total + it.pts > target) continue;      // same test as planSprint
  greedy.push(it.key);
  total += it.pts;
}
// #endregion
console.log(`target = ${target} points`);
console.log(`rank order, skip if it overflows: ${greedy.join(' + ')} = ${total} points`);

// #region cai-tui
// can[s] = index list of one subset reaching exactly s points (null = impossible); items used once ⇒ s goes DOWN.
const can: (number[] | null)[] = new Array(target + 1).fill(null);
can[0] = [];
backlog.forEach((it, k) => {
  for (let s = target; s >= it.pts; s--) if (!can[s] && can[s - it.pts]) can[s] = [...can[s - it.pts]!, k];
});
let s = target;
while (!can[s]) s--;
// #endregion
console.log(`knapsack (fill as much as possible): ${can[s]!.map((k) => backlog[k].key).join(' + ')} = ${s} points`);
const bo = backlog.slice(0, 3).filter((_, k) => !can[s]!.includes(k)).map((x) => x.key);
console.log(`top-3 by rank left out by the knapsack plan: ${bo.length ? bo.join(', ') : 'none'}`);
