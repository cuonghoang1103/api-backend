// @thoi-gian
// Union-find, worst case for the naive version: unions (0,1), (1,2), … build one long chain 0 → 1 → … → n−1,
// then n queries find(0). Counted: total pointer hops (deterministic) and time.
function run(n: number, compress: boolean, bySize: boolean): [number, number] {
  const parent = Array.from({ length: n }, (_, i) => i), size = new Array<number>(n).fill(1);
  let hops = 0;
  const find = (x: number): number => {
    let r = x;
    while (parent[r] !== r) { r = parent[r]; hops++; }
    if (compress) while (parent[x] !== r) { const nx = parent[x]; parent[x] = r; x = nx; }
    return r;
  };
  const t = performance.now();
  for (let i = 0; i + 1 < n; i++) {
    let a = find(i), b = find(i + 1);
    if (a === b) continue;
    if (bySize && size[a] > size[b]) [a, b] = [b, a];
    parent[a] = b;                                    // naive: always hang the first root under the second
    size[b] += size[a];
  }
  for (let q = 0; q < n; q++) find(0);
  return [performance.now() - t, hops];
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
const cell = (r: [number, number] | null) => (r ? `${r[0].toFixed(1)} ms / ${r[1].toLocaleString('en-US')}` : 'skipped');
console.log(`${pad('n', 9)} | ${pad('naive', 24)} | ${pad('size only', 22)} | ${pad('compression only', 22)} | ${pad('both', 22)}`);
for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
  const naive = n <= 10_000 ? run(n, false, false) : null;
  console.log(`${pad(n.toLocaleString('en-US'), 9)} | ${pad(cell(naive), 24)} | ${pad(cell(run(n, false, true)), 22)} | ${pad(cell(run(n, true, false)), 22)} | ${pad(cell(run(n, true, true)), 22)}`);
}
console.log('cells: time / pointer hops');
console.log(`node ${process.version} · ${process.arch}`);
