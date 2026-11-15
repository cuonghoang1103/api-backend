// @java: WordSearch2.java
// LC 212 · Word Search II — a trie of the WORDS + backtracking on the grid, pruning branches that match no prefix.

// #region giai
class TrieNode { next = new Map<string, TrieNode>(); word: string | null = null; }

function findWords(board: string[][], words: string[]): { found: string[]; calls: number } {
  const root = new TrieNode();
  for (const w of words) {
    let n = root;
    for (const ch of w) { if (!n.next.has(ch)) n.next.set(ch, new TrieNode()); n = n.next.get(ch)!; }
    n.word = w;                                       // store the whole word at its end node
  }
  const R = board.length, C = board[0].length;
  const found: string[] = [];
  let calls = 0;
  const dfs = (r: number, c: number, parent: TrieNode): void => {
    const ch = board[r][c];
    const node = parent.next.get(ch);
    if (!node) return;                                // PRUNE: no word continues with this letter
    calls++;
    if (node.word !== null) { found.push(node.word); node.word = null; }   // report once
    board[r][c] = '#';                                // choose: mark the cell as used on this path
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && board[nr][nc] !== '#') dfs(nr, nc, node);
    }
    board[r][c] = ch;                                 // un-choose
    if (node.next.size === 0 && node.word === null) parent.next.delete(ch);   // prune finished leaves
  };
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) dfs(r, c, root);
  return { found: found.sort(), calls };
}
// #endregion

const b1 = [['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']];
let r = findWords(b1, ['oath', 'pea', 'eat', 'rain']);
console.log(`findWords(board 4x4, ["oath","pea","eat","rain"]) = ${JSON.stringify(r.found)}   dfs calls = ${r.calls}`);
r = findWords([['a', 'b'], ['c', 'd']], ['abcb']);
console.log(`findWords([[a,b],[c,d]], ["abcb"]) = ${JSON.stringify(r.found)}   dfs calls = ${r.calls}`);
r = findWords([['a', 'a']], ['aaa', 'a', 'aa']);
console.log(`findWords([[a,a]], ["aaa","a","aa"]) = ${JSON.stringify(r.found)}   dfs calls = ${r.calls}`);
