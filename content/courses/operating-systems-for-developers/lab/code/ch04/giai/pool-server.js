// giai/pool-server.js — LỜI GIẢI bài tự viết 4.3: /hash đốt ~50 ms CPU. Bản "inline" làm ngay trên luồng chính (chặn
// mọi request khác); bản "pool" gửi việc cho một POOL CỐ ĐỊNH N worker_threads tạo sẵn MỘT lần (không tạo worker mỗi
// request — tạo một worker tốn hàng chục ms và vài MB), có hàng chờ khi mọi worker đều bận.
//   node pool-server.js inline | pool N        → nghe :8080 ; /hash nặng, /fast nhẹ
const http = require('node:http');
const { Worker } = require('node:worker_threads');
const [mode, N] = [process.argv[2], Number(process.argv[3] ?? 4)];
const WORK = `require('node:worker_threads').parentPort.on('message', (id) => {
  const end = performance.now() + 50; let x = 0; while (performance.now() < end) x++;
  require('node:worker_threads').parentPort.postMessage(id);
});`;

const idle = [], waiting = [], pending = new Map();
let seq = 0;
if (mode === 'pool') for (let i = 0; i < N; i++) {
  const w = new Worker(WORK, { eval: true });
  w.on('message', (id) => { pending.get(id)(); pending.delete(id); next(w); });
  idle.push(w);
}
function next(w) { const job = waiting.shift(); if (job) run(w, job); else idle.push(w); }
function run(w, done) { const id = seq++; pending.set(id, done); w.postMessage(id); }
const submit = () => new Promise((ok) => { const w = idle.pop(); if (w) run(w, ok); else waiting.push(ok); });

http.createServer(async (req, res) => {
  if (req.url === '/hash') {
    if (mode === 'pool') await submit();
    else { const end = performance.now() + 50; let x = 0; while (performance.now() < end) x++; }
    return res.end('hashed\n');
  }
  res.end('fast\n');
}).listen(8080, () => console.log(`${mode}${mode === 'pool' ? ' x' + N : ''} listening on :8080`));
