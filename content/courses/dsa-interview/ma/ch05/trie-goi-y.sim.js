// A trie of package-like words. Typing a prefix = walking down; suggestions = the words in the subtree below.
const graph = new GraphTracer('Trie (node label = prefix; weight 1 = a word ends here)', true);
const log = new LogTracer('autocomplete');
const words = ['jar', 'java', 'jest', 'json', 'jsx', 'nest', 'next', 'node', 'npm'];
const root = { id: '·', kids: {}, end: false };
for (const w of words) {
  let n = root, p = '';
  for (const ch of w) { p += ch; if (!n.kids[ch]) n.kids[ch] = { id: p, kids: {}, end: false }; n = n.kids[ch]; }
  n.end = true;
}
let col = 0, maxD = 0;
function lay(n, d) {
  if (d > maxD) maxD = d;
  const ks = Object.keys(n.kids).sort();
  if (!ks.length) { n.x = col++; n.d = d; return; }
  for (const k of ks) lay(n.kids[k], d + 1);
  n.x = ks.reduce(function (s, k) { return s + n.kids[k].x; }, 0) / ks.length; n.d = d;
}
lay(root, 0);
function place(n, p) {
  graph.addNode(n.id, n.end ? 1 : null, 0.04 + 0.92 * n.x / Math.max(1, col - 1), 0.08 + 0.84 * n.d / Math.max(1, maxD));
  if (p) graph.addEdge(p.id, n.id);
  for (const k of Object.keys(n.kids).sort()) place(n.kids[k], n);
}
place(root, null);
log.println(words.length + ' words share prefixes: j-, js-, n-, ne-. Each letter you type moves ONE step down.');
Tracer.delay();
function suggest(prefix, k) {
  let n = root, prev = null;
  graph.select(root.id);
  for (const ch of prefix) {
    if (!n.kids[ch]) { log.println('"' + prefix + '": no node for "' + ch + '" -> no suggestions'); Tracer.delay(); graph.deselect(root.id); return []; }
    prev = n; n = n.kids[ch];
    graph.visit(n.id, prev.id);
    log.println('typed "' + n.id + '" -> step down');
    Tracer.delay();
  }
  const out = [];
  (function dfs(x) {
    if (out.length === k) return;
    if (x.end) { out.push(x.id); log.println('   suggestion ' + out.length + ': ' + x.id); Tracer.delay(); }
    for (const c of Object.keys(x.kids).sort()) { if (out.length === k) return; graph.select(x.kids[c].id, x.id); dfs(x.kids[c]); }
  })(n);
  log.println('"' + prefix + '" -> [' + out.join(', ') + ']');
  Tracer.delay();
  return out;
}
suggest('js', 3);
suggest('ne', 3);
suggest('jx', 3);
