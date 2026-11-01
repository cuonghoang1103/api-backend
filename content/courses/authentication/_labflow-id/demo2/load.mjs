// demo2/load.mjs — lesson 2.2: what one argon2id setting does when MANY people sign in at the same moment.
//   node demo2/load.mjs <concurrent logins> <parallelism p>      (UV_THREADPOOL_SIZE = threads that hash at once)
import argon2 from 'argon2';

const N = Number(process.argv[2] ?? 40), p = Number(process.argv[3] ?? 1);
const P = { type: argon2.argon2id, memoryCost: 65536, timeCost: 2, parallelism: p };
const stored = await argon2.hash('an-lab-2026', P);
const base = process.memoryUsage().rss;
let peak = base;
const sampler = setInterval(() => { peak = Math.max(peak, process.memoryUsage().rss); }, 5);

const t0 = performance.now();
const lat = await Promise.all(Array.from({ length: N }, async () => {
  await argon2.verify(stored, 'an-lab-2026');
  return performance.now() - t0;                 // how long THIS user waited, from the moment everyone pressed "Sign in"
}));
clearInterval(sampler);
lat.sort((a, b) => a - b);
const f = (x) => x.toFixed(0).padStart(5) + ' ms';
console.log(`${N} logins · p=${p} · threads=${process.env.UV_THREADPOOL_SIZE ?? 4} | p50 ${f(lat[N >> 1])} | p95 ${f(lat[Math.floor(N * 0.95)])} | last ${f(lat[N - 1])} | RSS +${((peak - base) / 2 ** 20).toFixed(0)} MiB`);
