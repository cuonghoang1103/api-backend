// @java: ValidSudoku.java
// LC 36 Valid Sudoku, written for a reader: named constants, one helper per idea, return as soon as the answer is known.

// #region sach
const SIZE = 9;
const BOX = 3;
const EMPTY = '.';

function isValidSudoku(board: string[][]): boolean {
  const seen = new Set<string>();
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const digit = board[row][col];
      if (digit === EMPTY) continue;
      const keys = [`r${row}:${digit}`, `c${col}:${digit}`, `b${boxIndex(row, col)}:${digit}`];
      if (keys.some((k) => seen.has(k))) return false;   // early return: the first clash decides
      keys.forEach((k) => seen.add(k));
    }
  }
  return true;
}

function boxIndex(row: number, col: number): number {
  return Math.floor(row / BOX) * BOX + Math.floor(col / BOX);
}
// #endregion

const ok = [
  '53..7....', '6..195...', '.98....6.', '8...6...3', '4..8.3..1',
  '7...2...6', '.6....28.', '...419..5', '....8..79',
].map((r) => r.split(''));
const sameBox = ok.map((r) => [...r]);
sameBox[0][2] = '9';            // a second 9 in the top-left box only (row 2 has a 9 at column 1)
const sameCol = ok.map((r) => [...r]);
sameCol[8][0] = '5';            // a second 5 in column 0
console.log('valid board  ->', isValidSudoku(ok));
console.log('clash in box ->', isValidSudoku(sameBox));
console.log('clash in col ->', isValidSudoku(sameCol));
console.log('boxIndex(4, 7) =', boxIndex(4, 7));
