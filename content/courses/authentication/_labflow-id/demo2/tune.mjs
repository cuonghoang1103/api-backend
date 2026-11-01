// demo2/tune.mjs — lesson 2.2: choose argon2id parameters by MEASURING on the machine that will run them.
// Rule: two budgets — time per hash (one login = one hash) and RAM for hashing shared by the threads that hash at once
// (libuv's thread pool: UV_THREADPOOL_SIZE, default 4). Then the most memory, then the most passes, that fit both.
import argon2 from 'argon2';

const BUDGET_MS = Number(process.argv[2] ?? 100);
const RAM_MIB = Number(process.argv[3] ?? 256);
const THREADS = Number(process.env.UV_THREADPOOL_SIZE ?? 4);
const MAX_KIB = (RAM_MIB / THREADS) * 1024;          // memory one hash may use when every thread hashes at once
const MEMORY_KIB = [19456, 47104, 65536, 131072];      // 19 MiB (OWASP minimum) … 128 MiB
const PASSES = [1, 2, 3, 4];
const median = (xs) => xs.sort((a, b) => a - b)[xs.length >> 1];

async function timeOne(m, t) {
  const runs = [];
  for (let i = 0; i < 7; i++) {
    const t0 = performance.now();
    await argon2.hash('an-lab-2026', { type: argon2.argon2id, memoryCost: m, timeCost: t, parallelism: 1 });
    runs.push(performance.now() - t0);
  }
  return median(runs);
}

console.log(`budgets: ${BUDGET_MS} ms per hash, ${RAM_MIB} MiB for ${THREADS} hashing threads ⇒ ≤ ${MAX_KIB / 1024} MiB each`);
console.log(`argon2id p=1 · median of 7 · Node ${process.version} ${process.arch}`);
console.log('memory     t=1      t=2      t=3      t=4');
let best = null;
for (const m of MEMORY_KIB) {
  const cells = [];
  for (const t of PASSES) {
    const ms = await timeOne(m, t);
    const fits = ms <= BUDGET_MS && m <= MAX_KIB;
    cells.push(ms.toFixed(1).padStart(6) + (ms > BUDGET_MS ? '*' : m > MAX_KIB ? '#' : ' '));
    if (fits && (!best || m > best.m || (m === best.m && t > best.t))) best = { m, t, ms };
  }
  console.log(`${String(m / 1024).padStart(4)} MiB ${cells.join('  ')}`);
}
console.log('* = too slow   # = too much memory for the thread pool');
console.log(best ? `choose m=${best.m} (${best.m / 1024} MiB), t=${best.t}, p=1 → ${best.ms.toFixed(1)} ms` : 'nothing fits: raise the budget or buy CPU');
