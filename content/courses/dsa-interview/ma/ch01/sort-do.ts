// @thoi-gian
// Measure: sorting numbers (comparator on number[] vs typed array) and top-k frequent (sort the counts vs bucket by count).
let seed = 7;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; }; // Park–Miller, same numbers as SortDo.java
function ms(f: () => unknown, lap = 5): number {
  let best = Infinity;
  for (let k = 0; k < lap; k++) { const t = performance.now(); f(); best = Math.min(best, performance.now() - t); }
  return best;
}
function topKSort(nums: number[], k: number): number[] {
  const count = new Map<number, number>();
  for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map((e) => e[0]);
}
function topKBucket(nums: number[], k: number): number[] {
  const count = new Map<number, number>();
  for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
  const bucket: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [v, c] of count) bucket[c].push(v);
  const out: number[] = [];
  for (let f = nums.length; f >= 1 && out.length < k; f--) for (const v of bucket[f]) { out.push(v); if (out.length === k) break; }
  return out;
}
const pad = (s: string | number, w: number) => String(s).padStart(w);
console.log(`${pad('n', 10)} | ${pad('sort(a-b)', 10)} | ${pad('Int32Array', 10)} | ${pad('topK sort', 10)} | ${pad('topK bucket', 11)}`);
for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
  seed = 7;
  const a = Array.from({ length: n }, () => rnd(n));          // values 0..n-1: about 63% distinct
  const t1 = ms(() => [...a].sort((x, y) => x - y));
  const t2 = ms(() => Int32Array.from(a).sort());             // typed arrays sort NUMERICALLY by default
  const t3 = ms(() => topKSort(a, 10));
  const t4 = ms(() => topKBucket(a, 10));
  if (JSON.stringify([...topKSort(a, 10)].sort()) !== JSON.stringify([...topKBucket(a, 10)].sort())) console.log('(ties ordered differently)');
  console.log(`${pad(n.toLocaleString('en-US'), 10)} | ${pad(t1.toFixed(2) + ' ms', 10)} | ${pad(t2.toFixed(2) + ' ms', 10)} | ${pad(t3.toFixed(2) + ' ms', 10)} | ${pad(t4.toFixed(2) + ' ms', 11)}`);
}
console.log(`node ${process.version} · ${process.arch}`);
