// Trace of a trie (LC 208): one row per operation; for every letter, did we FOLLOW an existing node, CREATE one, or FALL OFF?
export function vetTrie(ops) {
  const root = { kids: new Map(), end: false };
  let nodes = 1;
  const rows = [];
  for (const [op, word] of ops) {
    let node = root;
    const steps = [];
    let fell = false;
    for (const ch of word) {
      if (node.kids.has(ch)) { steps.push([ch, 'follow']); node = node.kids.get(ch); continue; }
      if (op === 'insert') { const n = { kids: new Map(), end: false }; node.kids.set(ch, n); nodes++; steps.push([ch, 'new']); node = n; continue; }
      steps.push([ch, 'miss']); fell = true; break;
    }
    let result;
    if (op === 'insert') { node.end = true; result = 'isEnd = true'; }
    else if (op === 'search') result = !fell && node.end ? 'true' : 'false';
    else result = !fell ? 'true' : 'false';
    rows.push({ op, word, steps, nodes, result, endHere: !fell && node.end });
  }
  return rows;
}
