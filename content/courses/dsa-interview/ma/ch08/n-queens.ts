// @java: NQueens.java
// LC 51 / 52 · N-Queens — one queen per row; three Sets answer "is this square attacked?" in O(1).

// #region queens
function solveNQueens(n: number): string[][] {
  const res: string[][] = [];
  const queenCol: number[] = [];               // queenCol[r] = column of the queen in row r
  const cols = new Set<number>();              // columns already taken
  const diag = new Set<number>();              // "\" diagonals: r - c is constant along one
  const anti = new Set<number>();              // "/" diagonals: r + c is constant along one
  function bt(r: number): void {
    if (r === n) {                             // every row has a queen: one full board
      res.push(queenCol.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue;   // PRUNE: attacked, do not go down
      cols.add(c); diag.add(r - c); anti.add(r + c); queenCol.push(c);  // choose
      bt(r + 1);
      cols.delete(c); diag.delete(r - c); anti.delete(r + c); queenCol.pop(); // unchoose all four
    }
  }
  bt(0);
  return res;
}
// #endregion

const four = solveNQueens(4);
console.log('n = 4: ' + four.length + ' solutions');
for (const b of four) console.log('  ' + b.join(' '));
const counts: number[] = [];
for (let n = 1; n <= 9; n++) counts.push(solveNQueens(n).length);
console.log('solutions for n = 1..9: ' + JSON.stringify(counts));
