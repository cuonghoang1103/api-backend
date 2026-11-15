// @java: L7CopyRandom.java
// LC 138 · Copy List with Random Pointer — map old node -> new node, two passes.
class RNode {
  next: RNode | null = null;
  random: RNode | null = null;
  constructor(public val: number) {}
}

// #region giai
function copyRandomList(head: RNode | null): RNode | null {
  const clone = new Map<RNode, RNode>();
  for (let p = head; p; p = p.next) clone.set(p, new RNode(p.val));   // pass 1: make every copy
  for (let p = head; p; p = p.next) {                                 // pass 2: wire the copies to COPIES
    const c = clone.get(p)!;
    c.next = p.next ? clone.get(p.next)! : null;
    c.random = p.random ? clone.get(p.random)! : null;
  }
  return head ? clone.get(head)! : null;
}
// #endregion

function buildR(spec: [number, number | null][]): RNode | null {    // [val, index of random]
  const ns = spec.map(([v]) => new RNode(v));
  ns.forEach((n, i) => { n.next = ns[i + 1] ?? null; const r = spec[i][1]; n.random = r === null ? null : ns[r]; });
  return ns[0] ?? null;
}
function describe(h: RNode | null): string {
  const idx = new Map<RNode, number>();
  let i = 0;
  for (let p = h; p; p = p.next) idx.set(p, i++);
  const out: string[] = [];
  for (let p = h; p; p = p.next) out.push(`[${p.val},${p.random ? idx.get(p.random) : 'null'}]`);
  return out.join(' ');
}
const orig = buildR([[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]);
const cp = copyRandomList(orig);
let shared = false;
for (let a = orig, b = cp; a && b; a = a.next, b = b.next) if (a === b || (a.random && a.random === b.random)) shared = true;
console.log('original:', describe(orig));
console.log('copy:    ', describe(cp));
console.log('copy shares any node with the original:', shared);
