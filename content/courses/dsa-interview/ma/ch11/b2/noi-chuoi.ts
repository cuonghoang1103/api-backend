// @thoi-gian
// Cùng phép đo như PvNoiChuoi.java, trên Node: += chuỗi trong V8 KHÔNG chép lại cả chuỗi (V8 dựng "rope" —
// cây nối chuỗi — rồi làm phẳng một lần), nên bẫy O(n^2) của Java không xảy ra ở đây. Bẫy là của NGÔN NGỮ, không của thuật toán.
function keepPlus(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; i++) out += s[i];
  return out;
}
function keepJoin(s: string): string {
  const out: string[] = [];
  for (let i = 0; i < s.length; i++) out.push(s[i]);
  return out.join('');
}
function best(f: () => string, reps: number): number {
  let b = Infinity;
  for (let r = 0; r < reps; r++) {
    const t = performance.now();
    const x = f();
    if (x.length < 0) console.log('never');
    b = Math.min(b, performance.now() - t);
  }
  return b;
}
console.log(`node ${process.version} ${process.arch}`);
for (const n of [10_000, 50_000, 100_000, 200_000]) {
  const s = '(a)'.repeat(Math.floor(n / 3) + 1).slice(0, n);
  console.log(`n=${n.toLocaleString('en-US')}  string += : ${best(() => keepPlus(s), 5).toFixed(2)} ms   array.join: ${best(() => keepJoin(s), 5).toFixed(2)} ms`);
}
