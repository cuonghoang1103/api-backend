// @thoi-gian
// How big can n be? Time to generate ALL subsets (2^n · n) and ALL permutations (n! · n), measured.
// "store" = build the full answer list (what LeetCode asks); "walk" = visit every node, keep only a counter.
function subsetsStore(n: number): number {
  const res: number[][] = [];
  const path: number[] = [];
  const bt = (s: number): void => {
    res.push([...path]);
    for (let i = s; i < n; i++) { path.push(i); bt(i + 1); path.pop(); }
  };
  bt(0);
  return res.length;
}
function subsetsWalk(n: number): number {
  let cnt = 0;
  const bt = (s: number): void => { cnt++; for (let i = s; i < n; i++) bt(i + 1); };
  bt(0);
  return cnt;
}
function permStore(n: number): number {
  const res: number[][] = [];
  const path: number[] = [];
  const used = new Array<boolean>(n).fill(false);
  const bt = (): void => {
    if (path.length === n) { res.push([...path]); return; }
    for (let i = 0; i < n; i++) if (!used[i]) { used[i] = true; path.push(i); bt(); path.pop(); used[i] = false; }
  };
  bt();
  return res.length;
}
function permWalk(n: number): number {
  let cnt = 0;
  const used = new Array<boolean>(n).fill(false);
  const bt = (d: number): void => {
    if (d === n) { cnt++; return; }
    for (let i = 0; i < n; i++) if (!used[i]) { used[i] = true; bt(d + 1); used[i] = false; }
  };
  bt(0);
  return cnt;
}
function best(f: () => number, lap: number): [number, number] {
  let t = Infinity, r = 0;
  for (let k = 0; k < lap; k++) { const a = performance.now(); r = f(); t = Math.min(t, performance.now() - a); }
  return [r, t];
}
const row = (what: string, n: number, [cnt, ms]: [number, number]) =>
  console.log(`${what.padEnd(20)} n = ${String(n).padStart(2)} | ${cnt.toLocaleString('en-US').padStart(13)} answers | ${ms.toFixed(1).padStart(8)} ms`);
for (const n of [10, 14, 16, 18, 20]) row('subsets, store', n, best(() => subsetsStore(n), n >= 18 ? 2 : 3));
for (const n of [20, 22, 24, 26]) row('subsets, walk', n, best(() => subsetsWalk(n), 2));
for (const n of [6, 7, 8, 9, 10]) row('permutations, store', n, best(() => permStore(n), n >= 9 ? 2 : 3));
for (const n of [9, 10, 11, 12]) row('permutations, walk', n, best(() => permWalk(n), n >= 12 ? 1 : 2));
console.log(`node ${process.version} · ${process.arch}`);
