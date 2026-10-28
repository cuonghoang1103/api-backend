// loganalyzer.js — dự án cuối chương: phân tích access log SONG SONG (bản Node, worker_threads).
//   node loganalyzer.js FILE W
// Cùng thuật toán với LogAnalyzer.java: W khúc byte căn theo dòng → mỗi worker một kết quả riêng → luồng chính gộp.
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const fs = require('node:fs');
const MAXMS = 10000;

function scan(file, start, end) {                       // MAP: các dòng BẮT ĐẦU trong [start, end)
  const p = { lines: 0, status: {}, paths: {} };
  const fd = fs.openSync(file, 'r'), buf = Buffer.alloc(4 << 20), one = Buffer.alloc(1);
  let pos = start;
  if (start > 0) {                                      // bỏ phần dòng dở dang: nó thuộc khúc trước
    let q = start - 1;
    while (fs.readSync(fd, one, 0, 1, q) === 1 && one[0] !== 10) q++;
    pos = q + 1;
  }
  let carry = '', filePos = pos;
  outer: for (;;) {
    const n = fs.readSync(fd, buf, 0, buf.length, filePos);
    if (n <= 0) break;
    filePos += n;
    const chunk = carry + buf.toString('latin1', 0, n);
    let from = 0, nl;
    while ((nl = chunk.indexOf('\n', from)) >= 0) {
      if (pos >= end) break outer;
      add(p, chunk.slice(from, nl));
      pos += nl - from + 1;
      from = nl + 1;
    }
    carry = chunk.slice(from);
  }
  fs.closeSync(fd);
  return p;
}
function add(p, l) {
  const q1 = l.indexOf('"'), sp1 = l.indexOf(' ', q1), sp2 = l.indexOf(' ', sp1 + 1), q2 = l.indexOf('"', sp2);
  const path = l.slice(sp1 + 1, sp2);
  const a = q2 + 2, b = l.indexOf(' ', a), c = l.indexOf(' ', b + 1);
  const st = l.slice(a, b), bytes = Number(l.slice(b + 1, c));
  const ms = Math.min(MAXMS - 1, Math.round(Number(l.slice(c + 1)) * 1000));
  p.lines++;
  p.status[st] = (p.status[st] || 0) + 1;
  const s = p.paths[path] || (p.paths[path] = { count: 0, bytes: 0, hist: new Int32Array(MAXMS) });
  s.count++; s.bytes += bytes; s.hist[ms]++;
}
function merge(all, o) {                                // REDUCE
  all.lines += o.lines;
  for (const k in o.status) all.status[k] = (all.status[k] || 0) + o.status[k];
  for (const k in o.paths) {
    const s = all.paths[k] || (all.paths[k] = { count: 0, bytes: 0, hist: new Int32Array(MAXMS) });
    s.count += o.paths[k].count; s.bytes += o.paths[k].bytes;
    for (let i = 0; i < MAXMS; i++) s.hist[i] += o.paths[k].hist[i];
  }
}
const p95 = (h, n) => { const need = Math.ceil(n * 0.95); let seen = 0; for (let i = 0; i < h.length; i++) if ((seen += h[i]) >= need) return i; return h.length - 1; };

if (!isMainThread) {
  parentPort.postMessage(scan(workerData.file, workerData.start, workerData.end));
} else {
  const [file, W] = [process.argv[2], Number(process.argv[3])];
  const t0 = performance.now(), size = fs.statSync(file).size;
  const all = { lines: 0, status: {}, paths: {} };
  let left = W;
  for (let i = 0; i < W; i++) {
    const w = new Worker(__filename, { workerData: { file, start: Math.floor(size * i / W), end: Math.floor(size * (i + 1) / W) } });
    w.on('message', (part) => {
      merge(all, part);
      if (--left > 0) return;
      const ms = performance.now() - t0;
      const st = Object.keys(all.status).sort().map((k) => `${k}=${all.status[k]}`).join(', ');
      console.log(`node  W=${W}  lines=${all.lines.toLocaleString('en')}  status {${st}}`);
      Object.entries(all.paths).sort((x, y) => y[1].count - x[1].count).slice(0, 5).forEach(([k, s]) =>
        console.log(`  ${k.padEnd(26)} ${s.count.toLocaleString('en').padStart(9)} req  p95 ${String(p95(s.hist, s.count)).padStart(5)} ms  ${(s.bytes / 1e6).toFixed(1).padStart(7)} MB`));
      console.log(`node  W=${W}  ${ms.toFixed(0).padStart(6)} ms`);
    });
  }
}
