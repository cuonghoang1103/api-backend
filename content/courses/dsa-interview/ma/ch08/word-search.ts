// @java: WordSearch.java
// LC 79 · Word Search — DFS on a grid; "visited" is marked IN the board and restored on the way back.

// #region exist
function exist(board: string[][], word: string): boolean {
  const m = board.length, n = board[0].length;
  // Cheap pruning before any search: the board must contain enough of every letter.
  const have = new Map<string, number>();
  for (const row of board) for (const ch of row) have.set(ch, (have.get(ch) ?? 0) + 1);
  const need = new Map<string, number>();
  for (const ch of word) need.set(ch, (need.get(ch) ?? 0) + 1);
  for (const [ch, k] of need) if ((have.get(ch) ?? 0) < k) return false;
  // Start from the rarer end: fewer starting cells, the dead ends show up sooner.
  if ((have.get(word[0]) ?? 0) > (have.get(word[word.length - 1]) ?? 0)) word = [...word].reverse().join('');

  function dfs(r: number, c: number, k: number): boolean {
    if (k === word.length) return true;                                       // matched every letter
    if (r < 0 || c < 0 || r === m || c === n || board[r][c] !== word[k]) return false;
    const saved = board[r][c];
    board[r][c] = '#';                                                        // choose: mark as used on this path
    const ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
    board[r][c] = saved;                                                      // unchoose: restore, ALWAYS
    return ok;
  }
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (dfs(r, c, 0)) return true;
  return false;
}
// #endregion

const grid = () => [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']];
for (const w of ['ABCCED', 'SEE', 'ABCB', 'ASADFBCCEESE', 'Z']) {
  const b = grid();
  console.log('exist("' + w + '") = ' + exist(b, w) + '   board restored: ' + (JSON.stringify(b) === JSON.stringify(grid())));
}
