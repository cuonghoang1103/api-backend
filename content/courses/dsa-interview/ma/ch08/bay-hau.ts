// Trap: the unchoose step undoes two of the three Sets. Count solutions with and without the bug.

// #region sai
function countBuggy(n: number): number {
  const cols = new Set<number>(), diag = new Set<number>(), anti = new Set<number>();
  let count = 0;
  function bt(r: number): void {
    if (r === n) { count++; return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue;
      cols.add(c); diag.add(r - c); anti.add(r + c);
      bt(r + 1);
      cols.delete(c); diag.delete(r - c);   // BUG: anti.delete(r + c) is missing
    }
  }
  bt(0);
  return count;
}
// #endregion

function countRight(n: number): number {
  const cols = new Set<number>(), diag = new Set<number>(), anti = new Set<number>();
  let count = 0;
  const bt = (r: number): void => {
    if (r === n) { count++; return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue;
      cols.add(c); diag.add(r - c); anti.add(r + c);
      bt(r + 1);
      cols.delete(c); diag.delete(r - c); anti.delete(r + c);
    }
  };
  bt(0);
  return count;
}
for (let n = 4; n <= 8; n++) console.log('n = ' + n + ': correct ' + countRight(n) + ' | one Set not undone ' + countBuggy(n));
