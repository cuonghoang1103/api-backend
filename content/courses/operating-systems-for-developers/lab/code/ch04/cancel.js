// cancel.js — hạn chờ và huỷ trong Node.
//   node cancel.js fetch     fetch với AbortSignal.timeout(300) tới API trả lời sau 2 s
//   node cancel.js race      Promise.race với một hẹn giờ: ĐƯỢC báo timeout, nhưng việc gốc VẪN chạy tới cùng
//   node cancel.js worker    việc CPU trong worker_threads: worker.terminate() sau 300 ms
const { Worker } = require('node:worker_threads');
const t0 = performance.now();
const at = () => `[${String((performance.now() - t0).toFixed(0)).padStart(4)} ms]`;
const mode = process.argv[2];

if (mode === 'fetch') {
  fetch('http://localhost:9000/?ms=2000', { signal: AbortSignal.timeout(300) })
    .then(() => console.log(at(), 'answered'))
    .catch((e) => console.log(at(), e.name + ':', e.message));
} else if (mode === 'race') {
  const work = new Promise((ok) => setTimeout(() => { console.log(at(), 'the "cancelled" work finished anyway — and wrote its result'); ok(); }, 2000));
  const timeout = new Promise((_, no) => setTimeout(() => no(new Error('timeout after 300 ms')), 300));
  Promise.race([work, timeout]).catch((e) => console.log(at(), 'race says:', e.message));
} else {
  const w = new Worker('let x = 0; for (;;) x++;', { eval: true });   // vòng lặp vô tận: không bao giờ tự nhìn cờ nào
  w.on('online', () => setTimeout(() => w.terminate(), 300));
  w.on('exit', (code) => console.log(at(), 'worker exited, code', code));
}
