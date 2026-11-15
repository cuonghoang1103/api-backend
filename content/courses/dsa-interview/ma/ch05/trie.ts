// @java: Trie.java
// LC 208 · Implement Trie (Prefix Tree) — insert / search / startsWith, plus autocomplete (k words under a prefix).

// #region nut
class TrieNode {
  children = new Map<string, TrieNode>();   // char -> child (an array of 26 also works for 'a'..'z')
  isEnd = false;                            // does a word END exactly here?
}
// #endregion

// #region trie
class Trie {
  root = new TrieNode();
  nodes = 1;                                 // only to show how prefixes are shared

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      let next = node.children.get(ch);
      if (!next) { next = new TrieNode(); node.children.set(ch, next); this.nodes++; }
      node = next;
    }
    node.isEnd = true;                       // mark the end: "app" inside "apple" is not a word until inserted
  }

  private walk(s: string): TrieNode | null { // follow s from the root; null = fell off the tree
    let node: TrieNode | undefined = this.root;
    for (const ch of s) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  search(word: string): boolean { const n = this.walk(word); return n !== null && n.isEnd; }
  startsWith(prefix: string): boolean { return this.walk(prefix) !== null; }
  // #endregion

  // #region goi-y
  // Autocomplete: the first k words (alphabetical) that start with prefix.
  suggest(prefix: string, k: number): string[] {
    const out: string[] = [];
    const start = this.walk(prefix);
    if (!start) return out;
    const dfs = (node: TrieNode, path: string): void => {
      if (out.length === k) return;          // stop as soon as we have k
      if (node.isEnd) out.push(path);        // pre-order: a word comes before its extensions
      for (const ch of [...node.children.keys()].sort()) {
        dfs(node.children.get(ch)!, path + ch);
        if (out.length === k) return;
      }
    };
    dfs(start, prefix);
    return out;
  }
  // #endregion
}

const t = new Trie();
const log: string[] = [];
t.insert('apple');
log.push(`search("apple") = ${t.search('apple')}`, `search("app") = ${t.search('app')}`, `startsWith("app") = ${t.startsWith('app')}`);
t.insert('app');
log.push(`after insert("app"): search("app") = ${t.search('app')}`);
console.log(log.join('\n'));

const words = ['car', 'card', 'care', 'careful', 'cart', 'cat', 'dog', 'dot'];
const t2 = new Trie();
for (const w of words) t2.insert(w);
const letters = words.reduce((s, w) => s + w.length, 0);
console.log(`${words.length} words, ${letters} letters, ${t2.nodes} trie nodes (root included)`);
for (const p of ['car', 'ca', 'do', 'x']) console.log(`suggest("${p}", 3) = ${JSON.stringify(t2.suggest(p, 3))}`);
