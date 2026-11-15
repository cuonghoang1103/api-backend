// @java: NpmVong.java
// A REAL cycle in this repository's dependency graph. Snapshot of package-lock.json (15/11/2026):
//   prosemirror-state@1.4.4 depends on prosemirror-view ^1.27.0, and prosemirror-view@1.41.9 depends on prosemirror-state ^1.0.0.
// Kahn's algorithm cannot order the two; the DFS three-colour walk names the loop.
const DEPS: [string, string[]][] = [
  ['@tiptap/pm', ['prosemirror-model', 'prosemirror-state', 'prosemirror-transform', 'prosemirror-view']],
  ['prosemirror-state', ['prosemirror-model', 'prosemirror-transform', 'prosemirror-view']],
  ['prosemirror-view', ['prosemirror-model', 'prosemirror-state', 'prosemirror-transform']],
  ['prosemirror-transform', ['prosemirror-model']],
  ['prosemirror-model', ['orderedmap']],
  ['orderedmap', []],
];
const names = DEPS.map(([p]) => p);
const deps = new Map(DEPS);

// "install order" = dependencies first ⇒ arrow dependency → dependent; count unmet dependencies per package.
const unmet = new Map(names.map((p) => [p, deps.get(p)!.length]));
const q = names.filter((p) => unmet.get(p) === 0);
for (let h = 0; h < q.length; h++)
  for (const p of names) if (deps.get(p)!.includes(q[h])) { unmet.set(p, unmet.get(p)! - 1); if (unmet.get(p) === 0) q.push(p); }
console.log('Kahn order (deps first):', JSON.stringify(q));
console.log('left with unmet deps   :', JSON.stringify(names.filter((p) => !q.includes(p))));

const color = new Map<string, number>(names.map((p) => [p, 0]));
const path: string[] = [];
let cycle: string[] = [];
const visit = (u: string): void => {
  color.set(u, 1); path.push(u);
  for (const v of deps.get(u)!) {
    if (cycle.length) return;
    if (color.get(v) === 1) { cycle = [...path.slice(path.indexOf(v)), v]; return; }
    if (color.get(v) === 0) visit(v);
  }
  color.set(u, 2); path.pop();
};
visit('@tiptap/pm');
console.log('cycle found by DFS     :', cycle.join(' -> '));
