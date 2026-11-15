// @thoi-gian
// Count the words that start with a prefix: scan every word vs a trie with counts vs binary search on a sorted array.
class TNode { next: (TNode | undefined)[] = new Array(26); count = 0; }

let seed = 2026;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };   // same generator as Java
function makeWords(n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    let w = '';
    const len = 3 + rnd(8);
    for (let k = 0; k < len; k++) w += String.fromCharCode(97 + rnd(6));                 // letters a..f: many shared prefixes
    out.push(w);
  }
  return out;
}

// #region dem
function buildTrie(words: string[]): TNode {
  const root = new TNode();
  for (const w of words) {
    let node = root;
    for (let i = 0; i < w.length; i++) {
      const c = w.charCodeAt(i) - 97;
      node = node.next[c] ??= new TNode();
      node.count++;                              // one more word passes through this prefix
    }
  }
  return root;
}
function countTrie(root: TNode, p: string): number {
  let node: TNode | undefined = root;
  for (let i = 0; i < p.length && node; i++) node = node.next[p.charCodeAt(i) - 97];
  return node ? node.count : 0;                  // O(len(p)), whatever the number of words
}
// #endregion
function countScan(words: string[], p: string): number {
  let c = 0;
  for (const w of words) if (w.startsWith(p)) c++;   // O(n) per query
  return c;
}
function lowerBound(a: string[], x: string): number { let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >>> 1; if (a[m] < x) lo = m + 1; else hi = m; } return lo; }
function countSorted(sorted: string[], p: string): number {
  return lowerBound(sorted, p + '{') - lowerBound(sorted, p);   // '{' sorts right after 'z': the end of the prefix range
}
function best(f: () => number, lap = 3): [number, number] {
  let ms = Infinity, r = 0;
  for (let k = 0; k < lap; k++) { const t = performance.now(); r = f(); ms = Math.min(ms, performance.now() - t); }
  return [ms, r];
}
const Q = 2_000;
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('words', 9)} | ${pad('scan', 11)} | ${pad('trie', 9)} | ${pad('sorted+bsearch', 15)} | ${pad('trie nodes', 10)} | same answers`);
for (const n of [10_000, 100_000, 1_000_000]) {
  seed = 2026;
  const words = makeWords(n);
  const queries = Array.from({ length: Q }, () => { const w = words[rnd(n)]; return w.slice(0, 1 + rnd(4)); });
  const root = buildTrie(words);
  let nodes = 0; const stack = [root]; while (stack.length) { const x = stack.pop()!; nodes++; for (const c of x.next) if (c) stack.push(c); }
  const sorted = [...words].sort();
  const [ts, a] = n <= 100_000 ? best(() => { let s = 0; for (const q of queries) s += countScan(words, q); return s; }, n === 100_000 ? 1 : 3) : [NaN, NaN];
  const [tt, b] = best(() => { let s = 0; for (const q of queries) s += countTrie(root, q); return s; });
  const [tb, c] = best(() => { let s = 0; for (const q of queries) s += countSorted(sorted, q); return s; });
  const ok = (Number.isNaN(a) || a === b) && b === c;
  console.log(`${pad(n.toLocaleString('en-US'), 9)} | ${pad(Number.isNaN(ts) ? 'skipped' : ts.toFixed(1) + ' ms', 11)} | ${pad(tt.toFixed(2) + ' ms', 9)} | ${pad(tb.toFixed(2) + ' ms', 15)} | ${pad(nodes.toLocaleString('en-US'), 10)} | ${ok}`);
}
console.log(`${Q.toLocaleString('en-US')} prefix queries per row · node ${process.version} · ${process.arch}`);
