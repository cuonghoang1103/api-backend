// cpuprofile.js — tóm tắt một tệp .cpuprofile (do node --cpu-prof ghi; mở được trong Chrome DevTools) thành bảng chữ:
// thời gian SELF (hàm đang chạy) và TOTAL (hàm + mọi thứ nó gọi) theo từng hàm JS (bài 15.4).
//   node cpuprofile.js prof/CPU.*.cpuprofile [số dòng]
const fs = require('node:fs');
const [file, topArg] = process.argv.slice(2);
const top = +(topArg || 6);
const p = JSON.parse(fs.readFileSync(file, 'utf8'));
const byId = new Map(p.nodes.map((n) => [n.id, n]));
const parent = new Map();
for (const n of p.nodes) for (const c of n.children || []) parent.set(c, n.id);
const name = (n) => { const f = n.callFrame; return (f.functionName || '(anonymous)') + (f.url ? ` ${f.url.replace(/^.*\//, '')}:${f.lineNumber + 1}` : ''); };
const self = new Map(), total = new Map();
let all = 0;
p.samples.forEach((id, i) => {
  const dt = p.timeDeltas[i] / 1000;                  // µs ⇒ ms
  all += dt;
  const n = byId.get(id);
  self.set(name(n), (self.get(name(n)) || 0) + dt);
  const seen = new Set();
  for (let x = id; x !== undefined; x = parent.get(x)) { const k = name(byId.get(x)); if (!seen.has(k)) { seen.add(k); total.set(k, (total.get(k) || 0) + dt); } }
});
const rows = (m) => [...m].filter(([k]) => !/^\((root|program)\)/.test(k)).sort((a, b) => b[1] - a[1]);
const pr = (title, m) => { console.log(`  ${title}`); for (const [k, v] of rows(m).slice(0, top)) console.log(`  ${k.padEnd(44)} ${v.toFixed(0).padStart(6)} ms ${(100 * v / all).toFixed(1).padStart(5)}%`); };
console.log(`${(all / 1000).toFixed(1)} s profiled, ${p.samples.length} samples (${(self.get('(idle)') || 0).toFixed(0)} ms idle)`);
pr('SELF', self);
// dòng nóng nhất: V8 ghi số lần lấy mẫu theo TỪNG DÒNG (positionTicks) — thấy được cả khi hàm nhỏ đã bị inline vào hàm gọi nó
const lines = new Map(), src = new Map();
for (const n of p.nodes) for (const t of n.positionTicks || []) {
  const k = `${n.callFrame.url.replace(/^.*\//, '')}:${t.line}`;
  lines.set(k, (lines.get(k) || 0) + t.ticks);
  if (n.callFrame.url.startsWith('file://')) src.set(k, [n.callFrame.url.slice(7), t.line]);
}
const ticks = [...lines.values()].reduce((a, b) => a + b, 0);
console.log('  HOT LINES (ticks per source line)');
for (const [k, v] of [...lines].sort((a, b) => b[1] - a[1]).slice(0, 3)) {
  let text = '';
  if (src.has(k)) { const [f, l] = src.get(k); try { text = fs.readFileSync(f, 'utf8').split('\n')[l - 1].trim().slice(0, 70); } catch {} }
  console.log(`  ${k.padEnd(14)} ${(100 * v / ticks).toFixed(1).padStart(5)}%  ${text}`);
}
