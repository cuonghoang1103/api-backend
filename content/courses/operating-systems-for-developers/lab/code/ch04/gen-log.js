// gen-log.js — tạo một access log kiểu nginx (hạt giống cố định ⇒ lần nào cũng ra đúng file đó).
//   node gen-log.js FILE LINES
// Mỗi dòng: ip - - [thời gian] "METHOD path HTTP/1.1" status bytes request_time
//   10.0.3.17 - - [29/Oct/2026:10:00:01 +0700] "GET /api/v1/feed HTTP/1.1" 200 5123 0.042
const fs = require('node:fs');
const [file, LINES] = [process.argv[2], Number(process.argv[3])];
let seed = 42;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const paths = [ // [path, trọng số, độ trễ trung vị ms]
  ['/api/v1/feed', 30, 40], ['/api/v1/auth/refresh', 14, 8], ['/api/v1/messages/threads', 12, 25],
  ['/api/v1/courses', 10, 30], ['/api/v1/notes', 8, 20], ['/api/v1/gifs/search', 6, 180],
  ['/api/v1/work/projects', 6, 60], ['/api/v1/ai/chat', 3, 2400], ['/api/v1/exam/submit', 3, 120],
  ['/static/app.js', 5, 2], ['/healthz', 2, 1], ['/api/v1/cv/parse', 1, 3800],
];
const totalW = paths.reduce((s, p) => s + p[1], 0);
function pick() { let r = rnd() * totalW; for (const p of paths) if ((r -= p[1]) < 0) return p; return paths[0]; }
function status() { const r = rnd(); return r < 0.86 ? 200 : r < 0.93 ? 304 : r < 0.97 ? 404 : r < 0.985 ? 500 : r < 0.995 ? 502 : 503; }
const fd = fs.openSync(file, 'w');
let buf = [], t = Date.UTC(2026, 9, 29, 3, 0, 0);
for (let i = 0; i < LINES; i++) {
  const [p, , med] = pick();
  const lat = med * Math.exp((rnd() + rnd() + rnd() - 1.5) * 1.2);          // lệch phải: thỉnh thoảng rất chậm
  t += Math.floor(rnd() * 40);
  const d = new Date(t + 7 * 3600e3).toISOString();                        // giờ VN
  const ts = `${d.slice(8, 10)}/Oct/2026:${d.slice(11, 19)} +0700`;
  const st = status();
  buf.push(`10.0.${Math.floor(rnd() * 8)}.${Math.floor(rnd() * 250)} - - [${ts}] "${p.startsWith('/api/v1/exam') ? 'POST' : 'GET'} ${p} HTTP/1.1" ${st} ${st === 304 ? 0 : Math.floor(200 + rnd() * 20000)} ${(lat / 1000).toFixed(3)}`);
  if (buf.length === 50000) { fs.writeSync(fd, buf.join('\n') + '\n'); buf = []; }
}
if (buf.length) fs.writeSync(fd, buf.join('\n') + '\n');
fs.closeSync(fd);
console.log(`${file}: ${LINES.toLocaleString('en')} lines, ${(fs.statSync(file).size / 1e6).toFixed(1)} MB`);
