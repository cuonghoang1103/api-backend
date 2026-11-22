import { Worker } from 'node:worker_threads';

// yearlyReport = a CPU-heavy job of YOUR topic (here: a yearly care report)
import { yearlyReport } from './m02-lib.mjs';

async function measure(label, job) {
  let ticks = 0;
  const timer = setInterval(() => ticks++, 10); // what other requests would feel
  const t0 = performance.now();
  await job();
  clearInterval(timer);
  console.log(label.padEnd(18), Math.round(performance.now() - t0), 'ms, loop ticks during the job:', ticks);
}

const N = 400_000_000;
await measure('inline (blocks)', async () => yearlyReport(N));
await measure('worker thread', () => new Promise((ok, fail) => {
  const w = new Worker(new URL('./m02-worker.mjs', import.meta.url), { workerData: N });
  w.once('message', ok); w.once('error', fail);
}));
