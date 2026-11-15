// @java: GoiY.java
// LC 1268 · Search Suggestions System — after each typed letter, up to 3 products (alphabetical) with that prefix.

// #region goi-y
class TrieNode {
  children = new Map<string, TrieNode>();
  top: string[] = [];                         // the first 3 words (alphabetically) that pass through this node
}

function suggestedProducts(products: string[], searchWord: string): string[][] {
  const root = new TrieNode();
  for (const p of [...products].sort()) {     // insert in sorted order => each node's first 3 ARE the best 3
    let node = root;
    for (const ch of p) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
      if (node.top.length < 3) node.top.push(p);
    }
  }
  const res: string[][] = [];
  let node: TrieNode | undefined = root;
  for (const ch of searchWord) {
    node = node?.children.get(ch);            // once we fall off, every later prefix has no match
    res.push(node ? node.top : []);
  }
  return res;
}
// #endregion

console.log(JSON.stringify(suggestedProducts(['mobile', 'mouse', 'moneypot', 'monitor', 'mousepad'], 'mouse')));
console.log(JSON.stringify(suggestedProducts(['havana'], 'havana')));
console.log(JSON.stringify(suggestedProducts(['bags', 'baggage', 'banner', 'box', 'cloths'], 'bags')));
console.log(JSON.stringify(suggestedProducts(['java', 'javascript', 'json'], 'jx')));
