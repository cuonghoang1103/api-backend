// @java: Sudoku.java
// LC 37 · Sudoku Solver — bitmasks for rows / columns / boxes, and the "most constrained cell first" pruning (MRV).

// #region solve
function solveSudoku(board: string[][], mrv: boolean): number {
  const row = new Array<number>(9).fill(0), col = new Array<number>(9).fill(0), box = new Array<number>(9).fill(0);
  const empty: number[] = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === '.') { empty.push(r * 9 + c); continue; }
      const bit = 1 << Number(board[r][c]);
      row[r] |= bit; col[c] |= bit; box[Math.floor(r / 3) * 3 + Math.floor(c / 3)] |= bit;
    }
  const ALL = 0b1111111110;                          // bits 1..9
  let nodes = 0;
  function bt(k: number): boolean {
    nodes++;
    if (k === empty.length) return true;
    if (mrv) {                                       // bring the cell with the FEWEST candidates to position k
      let best = k, bestCnt = 10;
      for (let j = k; j < empty.length; j++) {
        const r = Math.floor(empty[j] / 9), c = empty[j] % 9;
        const free = ALL & ~(row[r] | col[c] | box[Math.floor(r / 3) * 3 + Math.floor(c / 3)]);
        let cnt = 0; for (let x = free; x; x &= x - 1) cnt++;
        if (cnt < bestCnt) { bestCnt = cnt; best = j; if (cnt <= 1) break; }
      }
      [empty[k], empty[best]] = [empty[best], empty[k]];
    }
    const r = Math.floor(empty[k] / 9), c = empty[k] % 9, b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    for (let d = 1; d <= 9; d++) {
      const bit = 1 << d;
      if ((row[r] | col[c] | box[b]) & bit) continue;  // prune: d already in this row / column / box
      row[r] |= bit; col[c] |= bit; box[b] |= bit; board[r][c] = String(d);
      if (bt(k + 1)) return true;
      row[r] &= ~bit; col[c] &= ~bit; box[b] &= ~bit; board[r][c] = '.';
    }
    return false;                                    // no digit fits here: the choice ABOVE was wrong
  }
  bt(0);
  return nodes;
}
// #endregion

const PUZZLES: [string, string][] = [
  ['LeetCode example', '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'],
  ['hard (Inkala 2012)', '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..'],
];
for (const [name, p] of PUZZLES) {
  const make = () => Array.from({ length: 9 }, (_, r) => p.slice(r * 9, r * 9 + 9).split(''));
  const a = make(), b = make();
  const plain = solveSudoku(a, false);
  const smart = solveSudoku(b, true);
  console.log(name + ': ' + (p.match(/\./g) ?? []).length + ' empty cells | nodes plain = ' + plain + ' | nodes MRV = ' + smart + ' | same answer: ' + (a.join() === b.join()));
  if (name.startsWith('hard')) for (const row of b) console.log('  ' + row.join(''));
}
