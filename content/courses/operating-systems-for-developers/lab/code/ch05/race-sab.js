// race-sab.js — 4 worker_threads cùng tăng MỘT ô trong SharedArrayBuffer.
//   node race-sab.js plain     a[0]++            (nạp – cộng – ghi, có thể mất)
//   node race-sab.js atomics   Atomics.add(a,0,1) (một thao tác nguyên tử)
const { Worker, isMainThread, workerData } = require('node:worker_threads');
const N = 4, ITERS = 1_000_000;

if (isMainThread) {
  const mode = process.argv[2] || 'plain';
  const sab = new SharedArrayBuffer(4);              // 4 byte DÙNG CHUNG giữa các luồng
  const a = new Int32Array(sab);
  const t0 = process.hrtime.bigint();
  let done = 0;
  for (let i = 0; i < N; i++) {
    new Worker(__filename, { workerData: { sab, mode } }).on('exit', () => {
      if (++done < N) return;
      const ms = Number(process.hrtime.bigint() - t0) / 1e6;
      console.log(`${mode}: expected=${N * ITERS} got=${a[0]} lost=${N * ITERS - a[0]} (${ms.toFixed(0)} ms)`);
    });
  }
} else {
  const a = new Int32Array(workerData.sab);
  if (workerData.mode === 'atomics') for (let i = 0; i < ITERS; i++) Atomics.add(a, 0, 1);
  else for (let i = 0; i < ITERS; i++) a[0]++;
}
