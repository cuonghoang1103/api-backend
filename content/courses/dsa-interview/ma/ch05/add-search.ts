// @java: AddSearch.java
// LC 211 · Design Add and Search Words Data Structure — a trie where '.' matches any one letter (DFS branches there).

class TrieNode { children = new Map<string, TrieNode>(); isEnd = false; }

// #region tu-dien
class WordDictionary {
  root = new TrieNode();
  steps = 0;                                   // nodes visited by the last search (to show the cost of '.')

  addWord(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    this.steps = 0;
    const dfs = (node: TrieNode, i: number): boolean => {
      this.steps++;
      if (i === word.length) return node.isEnd;
      const ch = word[i];
      if (ch === '.') {                          // wildcard: try EVERY child
        for (const child of node.children.values()) if (dfs(child, i + 1)) return true;
        return false;
      }
      const child = node.children.get(ch);       // normal letter: one path, like search()
      return child !== undefined && dfs(child, i + 1);
    };
    return dfs(this.root, 0);
  }
}
// #endregion

const d = new WordDictionary();
for (const w of ['bad', 'dad', 'mad', 'bed']) d.addWord(w);
for (const q of ['pad', 'bad', '.ad', 'b..', '...', '....', 'm.d', '.e.']) {
  const r = d.search(q);
  console.log(`search("${q}") = ${r}   (visited ${d.steps} nodes)`);
}
