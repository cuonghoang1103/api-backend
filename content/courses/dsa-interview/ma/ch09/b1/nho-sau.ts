// Top-down memo is still recursion: its depth is n. Bottom-up has no depth at all.
const MOD = 1_000_000_007;
// #region sau
function climbMemo(n: number, memo: number[]): number {
  if (n <= 1) return 1;
  if (memo[n] !== undefined) return memo[n];
  return (memo[n] = (climbMemo(n - 1, memo) + climbMemo(n - 2, memo)) % MOD);
}
function climbTable(n: number): number {
  let p2 = 1, p1 = 1;
  for (let i = 2; i <= n; i++) [p2, p1] = [p1, (p1 + p2) % MOD];
  return p1;
}
for (const n of [1_000, 100_000, 1_000_000]) {
  let top: string;
  try { top = String(climbMemo(n, [])); } catch (e) { top = (e as Error).constructor.name + ': ' + (e as Error).message; }
  console.log(`n = ${n.toLocaleString('en-US')}:  memo -> ${top}  |  table -> ${climbTable(n)}`);
}
// #endregion
