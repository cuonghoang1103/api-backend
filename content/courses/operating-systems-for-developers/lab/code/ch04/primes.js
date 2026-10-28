// primes.js — đếm số nguyên tố bằng worker_threads. Hàng đợi việc = MỘT số nguyên trong SharedArrayBuffer:
// mỗi worker Atomics.add(…, 1) để lấy khúc 10 000 số kế tiếp — không có khoá, không có tin nhắn cho từng khúc.
//   node primes.js T N        T = 0: chạy ngay trên luồng chính (mốc, và để thấy event loop bị chặn)
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const CHUNK = 10_000;

function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
  return true;
}
function countRange(lo, hi) { let c = 0; for (let n = lo; n < hi; n++) if (isPrime(n)) c++; return c; }

if (!isMainThread) {                       // ---- trong worker ----
  const { shared, n } = workerData;
  const next = new Int32Array(shared);
  let found = 0, chunks = 0, i;
  while ((i = Atomics.add(next, 0, 1)) * CHUNK < n) {
    found += countRange(i * CHUNK, Math.min((i + 1) * CHUNK, n));
    chunks++;
  }
  parentPort.postMessage({ found, chunks });
} else {                                   // ---- luồng chính ----
  const t = Number(process.argv[2]), n = Number(process.argv[3]);
  const t0 = performance.now();
  if (t === 0) {
    console.log(`main x0  N=${n} primes=${countRange(0, n)}  ${(performance.now() - t0).toFixed(0)} ms`);
  } else {
    const shared = new SharedArrayBuffer(4);
    let left = t, total = 0;
    const ticks = setInterval(() => {}, 1000);   // luồng chính vẫn rảnh: event loop chạy tiếp trong lúc worker làm
    for (let k = 0; k < t; k++) {
      new Worker(__filename, { workerData: { shared, n } }).on('message', ({ found }) => {
        total += found;
        if (--left === 0) {
          clearInterval(ticks);
          console.log(`workers x${t}  N=${n} primes=${total}  ${(performance.now() - t0).toFixed(0)} ms`);
        }
      });
    }
  }
}
