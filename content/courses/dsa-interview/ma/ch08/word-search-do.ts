// @thoi-gian
// The LeetCode test that makes Word Search time out: a board full of 'A', a word of A's ending in 'B'.
// Every path of A's looks promising until the very last letter. Count DFS calls with and without the
// "count the letters first / start from the rarer end" pruning.
let calls = 0;
function search(board: string[][], word: string): boolean {
  const m = board.length, n = board[0].length;
  const dfs = (r: number, c: number, k: number): boolean => {
    calls++;
    if (k === word.length) return true;
    if (r < 0 || c < 0 || r === m || c === n || board[r][c] !== word[k]) return false;
    const s = board[r][c]; board[r][c] = '#';
    const ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
    board[r][c] = s;
    return ok;
  };
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (dfs(r, c, 0)) return true;
  return false;
}
function pruned(board: string[][], word: string): boolean {
  const cnt = new Map<string, number>();
  for (const row of board) for (const ch of row) cnt.set(ch, (cnt.get(ch) ?? 0) + 1);
  const need = new Map<string, number>();
  for (const ch of word) need.set(ch, (need.get(ch) ?? 0) + 1);
  for (const [ch, k] of need) if ((cnt.get(ch) ?? 0) < k) return false;
  if ((cnt.get(word[0]) ?? 0) > (cnt.get(word[word.length - 1]) ?? 0)) word = [...word].reverse().join('');
  return search(board, word);
}
function run(label: string, f: () => boolean): void {
  let best = Infinity, ans = false, c = 0;
  for (let k = 0; k < 3; k++) { calls = 0; const t = performance.now(); ans = f(); best = Math.min(best, performance.now() - t); c = calls; }
  console.log(`${label.padEnd(44)} | ${String(ans).padEnd(5)} | ${c.toLocaleString('en-US').padStart(12)} calls | ${best.toFixed(1).padStart(8)} ms`);
}
for (const len of [10, 13, 15]) {
  const allA = () => Array.from({ length: 6 }, () => new Array<string>(6).fill('A'));
  const word = 'A'.repeat(len - 1) + 'B';
  run(`6x6 all 'A', word A*${len - 1}+B, plain`, () => search(allA(), word));
  run(`6x6 all 'A', word A*${len - 1}+B, rarer end first`, () => search(allA(), [...word].reverse().join('')));
  run(`6x6 all 'A', word A*${len - 1}+B, count letters`, () => pruned(allA(), word));
}
console.log(`node ${process.version} · ${process.arch}`);
