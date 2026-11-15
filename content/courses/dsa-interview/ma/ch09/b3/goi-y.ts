// "Did you mean …?" — a self-contained copy of the logic in src/services/work/jql.ts (levenshtein + suggest),
// next to plain Levenshtein, to see where the transposition rule and the short-word threshold matter.

// #region osa
// Levenshtein + "swap two neighbours = 1 edit" (optimal string alignment, as in jql.ts).
function osa(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}
// #endregion
function lev(a: string, b: string): number {   // plain Levenshtein, two rows
  let p = Array.from({ length: b.length + 1 }, (_, j) => j), c = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    c[0] = i;
    for (let j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    [p, c] = [c, p];
  }
  return p[b.length];
}
// #region suggest
function suggest(input: string, candidates: string[]): string | undefined {
  const q = input.trim().toLowerCase();
  const prefix = candidates.filter((c) => c.toLowerCase().startsWith(q));
  if (prefix.length) return prefix.sort((x, y) => x.length - y.length)[0];   // typing in progress wins
  let best: string | undefined, bestD = Infinity;
  for (const c of candidates) {
    const d = osa(q, c.toLowerCase());
    const limit = Math.min(q.length, c.length) <= 3 ? 1 : 2;                 // short words: only 1 edit allowed
    if (d <= limit && d < bestD) { best = c; bestD = d; }
  }
  return best;
}
// #endregion

for (const [a, b] of [['Bgu', 'Bug'], ['stauts', 'status'], ['asignee', 'assignee'], ['tip', 'type']]) {
  console.log(`"${a}" vs "${b}": Levenshtein = ${lev(a, b)}, with swaps (jql.ts) = ${osa(a, b)}`);
}
const fields = ['assignee', 'status', 'priority', 'reporter', 'sprint', 'labels', 'type', 'project'];
for (const typed of ['asignee', 'stauts', 'In Prog', 'prio', 'tpye', 'tip', 'xyzzy']) {
  console.log(`typed "${typed}" -> ${suggest(typed, typed === 'In Prog' ? ['To Do', 'In Progress', 'Done'] : fields) ?? '(no suggestion)'}`);
}
// The attacker's view: a login form that "helpfully" suggests among ALL accounts.
const allAccounts = ['admin', 'cuonghoang', 'giangvien01', 'thuquy'];
console.log(`login "cuonghoag" (unsafe: candidates = every account) -> Did you mean ${suggest('cuonghoag', allAccounts)}?`);
console.log(`login "giangvien0" (unsafe) -> Did you mean ${suggest('giangvien0', allAccounts)}?`);
