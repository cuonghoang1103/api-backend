// hit.js — máy bắn tải tí hon: N request tới URL, tối đa C cùng lúc; in thông lượng, p50/p99/max và số câu trả lời KHÁC
// nhau (máy chủ cluster.js trả "pid …" ⇒ đó là số worker đã phục vụ).
//   node hit.js URL N C
const [url, N, C] = [process.argv[2], Number(process.argv[3]), Number(process.argv[4])];
const lat = [], pids = new Set();
let worst = { ms: 0, at: 0 };
let next = 0;
async function lane() {
  while (next < N) {
    next++;
    const t = performance.now();
    pids.add((await (await fetch(url)).text()).trim());
    const d = performance.now() - t;
    lat.push(d);
    if (d > worst.ms) worst = { ms: d, at: t - t0 };
  }
}
let t0;
(async () => {
  t0 = performance.now();
  await Promise.all(Array.from({ length: C }, lane));
  const ms = performance.now() - t0;
  lat.sort((a, b) => a - b);
  const p = (q) => lat[Math.min(lat.length - 1, Math.floor(q * lat.length))].toFixed(0);
  console.log(`${N} req, ${C} concurrent: ${(N / ms * 1000).toFixed(0)} req/s  p50 ${p(0.5)} ms  p99 ${p(0.99)} ms  max ${worst.ms.toFixed(0)} ms (sent at +${worst.at.toFixed(0)} ms)  distinct replies: ${pids.size}  ${ms.toFixed(0)} ms`);
})();
