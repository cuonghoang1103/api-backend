// @thoi-gian
// N-Queens: how many nodes does pruning save? Same answers, three levels of checking.
//  A. no pruning   : put a queen anywhere in each row, check the whole board only at the leaf  (n^n leaves)
//  B. columns only : never reuse a column (a permutation), check diagonals only at the leaf     (n! leaves)
//  C. 3 Sets       : reject an attacked square BEFORE going down                              (this lesson)
//  D. bitmask      : the same tree as C, the three Sets packed into three ints (cheaper per node)
let nodes = 0;
function leafOk(q: number[]): boolean {
  for (let i = 0; i < q.length; i++)
    for (let j = i + 1; j < q.length; j++)
      if (q[i] === q[j] || Math.abs(q[i] - q[j]) === j - i) return false;
  return true;
}
function A(n: number): number {
  const q: number[] = []; let sol = 0;
  const bt = (r: number): void => {
    nodes++;
    if (r === n) { if (leafOk(q)) sol++; return; }
    for (let c = 0; c < n; c++) { q.push(c); bt(r + 1); q.pop(); }
  };
  bt(0); return sol;
}
function B(n: number): number {
  const q: number[] = []; const used = new Array<boolean>(n).fill(false); let sol = 0;
  const bt = (r: number): void => {
    nodes++;
    if (r === n) { if (leafOk(q)) sol++; return; }
    for (let c = 0; c < n; c++) if (!used[c]) { used[c] = true; q.push(c); bt(r + 1); q.pop(); used[c] = false; }
  };
  bt(0); return sol;
}
function C(n: number): number {
  const cols = new Set<number>(), diag = new Set<number>(), anti = new Set<number>(); let sol = 0;
  const bt = (r: number): void => {
    nodes++;
    if (r === n) { sol++; return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue;
      cols.add(c); diag.add(r - c); anti.add(r + c);
      bt(r + 1);
      cols.delete(c); diag.delete(r - c); anti.delete(r + c);
    }
  };
  bt(0); return sol;
}
function D(n: number): number {
  const full = (1 << n) - 1; let sol = 0;
  const bt = (cols: number, d1: number, d2: number): void => {
    nodes++;
    if (cols === full) { sol++; return; }
    let free = full & ~(cols | d1 | d2);            // squares of this row that nobody attacks
    while (free) {
      const bit = free & -free;                     // lowest free square
      free -= bit;
      bt(cols | bit, ((d1 | bit) << 1) & full, (d2 | bit) >> 1);
    }
  };
  bt(0, 0, 0); return sol;
}
// exact node counts of the full trees (BigInt: 14^14 is beyond 2^53)
const sumPow = (n: number) => { let s = 0n, p = 1n; for (let k = 0; k <= n; k++) { s += p; p *= BigInt(n); } return s; };
const sumFall = (n: number) => { let s = 0n, p = 1n; for (let k = 0; k <= n; k++) { s += p; p *= BigInt(n - k); } return s; };
function measure(f: (n: number) => number, n: number, lap: number): [number, number, number] {
  let best = Infinity, sol = 0, cnt = 0;
  for (let k = 0; k < lap; k++) { nodes = 0; const t = performance.now(); sol = f(n); best = Math.min(best, performance.now() - t); cnt = nodes; }
  return [sol, cnt, best];
}
const f = (x: number | bigint) => x.toLocaleString('en-US');
console.log(' n | sol    | A nodes (no pruning)             | B nodes (columns only)        | C nodes (3 Sets) |    C time |  D (bitmask)');
for (let n = 4; n <= 14; n++) {
  const a = n <= 7 ? measure(A, n, 1) : null;
  const b = n <= 10 ? measure(B, n, 1) : null;
  const c = n <= 13 ? measure(C, n, n >= 12 ? 1 : 3) : null;
  const d = measure(D, n, 3);
  const aTxt = a ? f(a[1]) + ' ' + a[2].toFixed(0) + ' ms' : f(sumPow(n)) + ' (formula)';
  const bTxt = b ? f(b[1]) + ' ' + b[2].toFixed(0) + ' ms' : f(sumFall(n)) + ' (formula)';
  console.log(`${String(n).padStart(2)} | ${String(d[0]).padEnd(6)} | ${aTxt.padEnd(32)} | ${bTxt.padEnd(29)} | ${(c ? f(c[1]) : f(d[1]) + '*').padStart(16)} | ${(c ? c[2].toFixed(1) + ' ms' : '-').padStart(9)} | ${(d[2].toFixed(1) + ' ms').padStart(12)}`);
}
console.log('* n = 14: C not run; node count taken from D (same tree).');
console.log(`node ${process.version} · ${process.arch}`);
