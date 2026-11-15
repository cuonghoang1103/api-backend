// Pitfall: search() that forgets isEnd answers "is this a PREFIX?" instead of "is this a WORD?".
class TrieNode { children = new Map<string, TrieNode>(); isEnd = false; }
const root = new TrieNode();
function insert(word: string): void {
  let node = root;
  for (const ch of word) {
    if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
    node = node.children.get(ch)!;
  }
  node.isEnd = true;
}
function walk(s: string): TrieNode | null {
  let node: TrieNode | undefined = root;
  for (const ch of s) { node = node.children.get(ch); if (!node) return null; }
  return node;
}

// #region sai
function searchWrong(word: string): boolean {
  return walk(word) !== null;                 // BUG: true for every prefix of every word
}
// #endregion

// #region dung
function search(word: string): boolean {
  const node = walk(word);
  return node !== null && node.isEnd;         // the path exists AND a word ends here
}
// #endregion

insert('apple');
insert('application');
for (const q of ['apple', 'app', 'appl', 'application', 'apply']) {
  console.log(`"${q}": wrong = ${searchWrong(q)}, right = ${search(q)}`);
}
