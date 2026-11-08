/**
 * node-16-4 — Node.js · Chapter 16 · Lesson 16.4 "Scaling out: 3.4× for CPU work, 1.07× for I/O" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, MỘT tập node-16-4.
 * Nguồn: nodejs-16-4-cluster-mo-rong. Output THẬT: that/c16/cluster (node:cluster, 1/2/4/8/10 worker, /cpu băm 20 lần, /io chờ 30 ms, autocannon -c 50 -d 5 cùng máy,
 *   trung vị 5 lần; máy 10 nhân, load 23,3 lúc bắt đầu) · that/c16/prod-process (grep mã nguồn website: Dockerfile CMD, 0 file dùng cluster, container_name cố định,
 *   40 cron.schedule, cờ _started, hàng đợi trong RAM _jobs/_processing).
 * Khác web: /cpu 11.812 ⇒ 40.278 ở 8 worker (3,4×, web cũng 3,4× nhưng đỉnh ở 4) rồi 10 worker tụt 36.299 · /io 1.450 ⇒ 1.547 (+6,7 %, web +5,7 %) ·
 *   cron.service.ts nay 40 lời gọi cron.schedule (web ghi 11 — đã sửa ở nguồn).
 */
import { lamDeck, two, box, cards, flow, bang, J, TT, thanh, dong, steps } from './_c9-chung.mjs';

export const deck = { key: 'node-16-4', code: 'NODE 16.4', title: 'Scaling out: 3.4× for CPU work, 1.07× for I/O', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const R = (route, w) => num(dong('c16/cluster', new RegExp(`^/${route}\\s+${w}\\s`)), new RegExp(`^/${route}\\s+${w}\\s+([\\d,]+)`));
const W = [1, 2, 4, 8, 10];
const CPU = W.map((w) => R('cpu', w)), IO = W.map((w) => R('io', w));
const f = (n) => n.toLocaleString('en-US');
const best = Math.max(...CPU), bestW = W[CPU.indexOf(best)];

export const slides = lamDeck({ chuong: 'Chapter 16 — Performance', bai: '16.4' }, [
  { cover: true, t: 'Scaling out: 3.4× for CPU work,<br>1.07× for I/O', sub: 'Node runs your JavaScript on one thread. On a ten-core machine the standard fix is cluster. Whether it helps depends entirely on what your route does.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Two routes, five worker counts: what cluster really multiplies</li>
<li>The second surprise: past a point, more workers make it worse</li>
<li>A five-step test for "is cluster my answer?"</li>
<li>What breaks the moment you fork — and the silent one</li>
<li>cluster, PM2, or more containers — and what this website runs</li>
</ul>` + box('Why it matters to you', 'Adding workers is the most common "scaling" change, and for most web APIs it does almost nothing. Knowing why saves you from the bugs it brings for free.', 'lam') },

  { t: 'How cluster works', to: true, giua: true, body: J(`import cluster from 'node:cluster';
import os from 'node:os';

if (cluster.isPrimary) {
  const n = Number(process.env.WORKERS ?? os.cpus().length - 1);
  for (let i = 0; i < n; i++) cluster.fork();          // N separate processes
  cluster.on('exit', () => cluster.fork());            // YOU write the restart logic
} else {
  app.listen(3000);                                    // all workers share port 3000
}`, { sm: false, hl: [6, 7, 9] }) +
    flow([{ t: 'primary', s: 'accepts connections', mau: LAM }, { t: 'worker 1 … N', s: 'round-robin', mau: NODE }, { t: 'one V8 each', s: 'own heap, own JIT, own GC', mau: CAM }], { h: 120 }) },

  { t: 'Two routes, five configurations', to: true, giua: true, body: two(box('/cpu', 'hashes a string twenty times with sha256 — real computation, like password checks or image work.', 'cam'), box('/io', 'awaits 30 ms — the shape of a database query or an external API call.', 'lam')) +
    TT('c16/cluster', 1, 14, 'node cluster.mjs · 1–10 workers · autocannon -c 50 -d 5 on the same machine · median of 5 · real', { hl: [7, 8, 10, 14], n: 104, sm: true }) },

  { t: 'Same change, two completely different stories', to: true, giua: true, body: two(
    thanh(W.map((w, i) => [`${w} worker${w > 1 ? 's' : ''}`, CPU[i], w === bestW ? NODE : w === 10 ? DO : CAM, f(CPU[i])]), { w: 520, x0: 150, wMax: 220, h0: 48, chu: 20, ghi: '/cpu req/s · real' }),
    thanh(W.map((w, i) => [`${w} worker${w > 1 ? 's' : ''}`, IO[i], LAM, f(IO[i])]), { w: 520, x0: 150, wMax: 220, h0: 48, chu: 20, ghi: '/io req/s · each chart has its own scale · real' })) +
    two(box(`/cpu: ${f(CPU[0])} → ${f(best)}`, `${(best / CPU[0]).toFixed(1)}× with ${bestW} workers. The work was the CPU, so more CPUs did more work.`, 'xanh'),
      box(`/io: ${f(IO[0])} → ${f(IO[4])}`, `+${((IO[4] / IO[0] - 1) * 100).toFixed(1)}% with 10 workers — noise. Waiting was never the thin part.`, 'do2')) },

  { t: 'Proof the workers were used', to: true, giua: true, body: TT('c16/cluster', 3, 8, 'the last column: distinct process ids among 40 sample requests · real', { hl: [6], n: 104, sm: false }) +
    cards([['10 workers, 10 pids', 'Round-robin spread the requests across every process. Load distribution was correct.'], ['It just did not matter for /io', 'A single process already overlaps thousands of waits on the event loop (chapter 2). Ten loops wait no faster.'], ['The web lesson measured the same', '/io 1,253 → 1,325 (+5.7%) on its machine; here +6.7%.']], 3) },

  { t: 'The second surprise: more workers made it worse', to: true, giua: true, body: bang(['workers', '/cpu req/s', 'change'], W.map((w, i) => [String(w), f(CPU[i]), i === 0 ? '—' : `${CPU[i] > CPU[i - 1] ? '+' : ''}${((CPU[i] / CPU[i - 1] - 1) * 100).toFixed(1)}%`]), { co: 22, hl: [3, 4] }) +
    cards([['The client burns CPU too', 'autocannon runs on the same box. In production that is nginx, the log collector, the monitoring agent.'], ['Context switching', 'More busy processes than free cores: the OS rotates them, and every switch costs.'], ['Each worker is its own V8', 'Its own heap, JIT and GC. Ten workers, ten times the baseline memory.']], 3) },

  { t: 'Where the peak sits depends on the machine', to: true, giua: true, body: two(box(`Here: peak at ${bestW}`, `${f(best)} req/s, then ${f(CPU[4])} at 10 — on a 10-core machine already at load 23 from other work.`, 'cam'), box('The web lesson: peak at 4', '29,542 req/s, then 25,112 at 10 — a different machine, a different background load.', 'lam')) +
    box('The practical rule', 'Start at cores − 1, then measure DOWN as well as up. Copying os.cpus().length from a tutorial is how you end up on the falling side of the curve.', 'xanh') +
    box('Never decide from one run', 'Every number here is the median of 5 runs of 5 seconds after a 2-second warm-up. A single run on a busy laptop can move the peak by two workers.', 'do2') },

  { t: 'Is cluster your answer? Five steps', to: true, giua: true, body: steps([
    '<b>Take a CPU profile under load</b> (16.1) — read the (idle) line',
    '<b>idle HIGH (&gt;60%)</b> — you are I/O-bound. Cluster does nothing. Fix the database or the external API (16.2)',
    '<b>idle LOW (&lt;30%)</b> — you are CPU-bound. Cluster helps almost linearly up to the real peak',
    '<b>One function eats the CPU</b> — move just that to worker_threads (chapter 2), cheaper than multiplying the whole process',
    '<b>Measure at 2, 4, 6, 8 workers</b> — pick the REAL peak, not the core count',
  ]) + box('16.1 already told us', 'That route had 0.9% idle: CPU-bound — a cluster candidate. The route in 16.2 spent 97% in the database: not one.', 'lam') },

  { t: 'What breaks when you fork', to: true, giua: true, body: bang(['in one process', 'with N workers', 'fix'], [
    ['in-memory cache', 'N different copies, users see stale data by worker', 'Redis (chapter 12)'],
    ['rate limit counted in RAM', '100 per minute becomes 100 × N', 'count in Redis'],
    ['Socket.IO emit', 'never reaches a client on another worker', 'Redis adapter (chapter 11)'],
    ['cron and periodic jobs', 'run N times instead of once', 'Redis lock or its own process'],
    ['counters, globals, /metrics', 'one value per worker', 'aggregate, or one scrape per process'],
  ], { co: 21, hl: [3] }) + box('Every one of these is correct in one process', 'and wrong in two. Nothing in the code changed; the number of copies did.', 'cam') + box('Chapter 11 met one of them', 'Socket.IO across processes needs the Redis adapter, or an emit misses the clients on the other worker.', 'lam') },

  { t: 'A real trap: the silent one', to: true, giua: true, body: J(`let _started = false;
export function startCron() {
  if (_started) return;          // guards against double-scheduling IN THIS PROCESS
  _started = true;
  cron.schedule('0 2 * * *', sendNightlyInvoices);
}`, { sm: false, hl: [1, 3] }) +
    flow([{ t: 'WORKERS=1', s: '1 invoice per customer', mau: NODE }, { t: 'WORKERS=4 "for speed"', s: 'same code', mau: CAM }, { t: '4 invoices', s: 'no error, no log', mau: DO }], { h: 120 }) +
    box('It causes incidents because it is silent', 'An in-process flag prevents a second start within one process and does nothing at all across four. Use a Redis lock (chapter 12) or run jobs in their own process.', 'do2') },

  { t: 'cluster, PM2, or more containers?', to: true, giua: true, body: bang(['', 'who supervises', 'the catch'], [
    ['cluster (in code)', 'your primary process', 'a single point of failure; you write restarts yourself'],
    ['PM2', 'PM2', 'restarts and reloads built in — but duplicates what Docker already does'],
    ['N containers', 'Docker / Kubernetes', 'the healthiest: restarts, health checks, rolling deploys, limits per unit'],
  ], { co: 22, hl: [3] }) + box('For a containerised deployment', 'One process per container, scale by running more containers. The container stays the unit of everything — restart, health check, rollout, memory limit.', 'xanh') +
    box('And whichever you pick', 'the table on the previous slides applies: shared state must leave the process first.', 'cam') },

  { t: 'What this website runs', to: true, giua: true, body: TT('c16/prod-process', 3, 16, 'grep in the website source · real', { hl: [2, 4, 6, 9, 11, 13, 14], n: 104, sm: false }) +
    box('One process, one container — the right choice', 'It is I/O-bound (16.2: 97% in the database), and forking would multiply 40 cron schedules guarded by a per-process flag, plus an in-memory job queue.', 'xanh') },

  { t: 'So how does this website scale?', to: true, giua: true, body: cards([
    ['Not by workers', 'Measured: +6.7% for I/O-shaped work. Not worth 40 duplicated cron jobs.'],
    ['By doing less work', 'Chapter 12 cache: the query that never happens. Chapter 13 queue: work out of the request.'],
    ['By sizing correctly', '16.2: the pool, not the process count, decides the database queue.'],
  ], 3) + flow([{ t: 'profile', s: 'is it CPU?', mau: TIM }, { t: 'no: fix I/O', s: 'queries, cache, queue', mau: LAM }, { t: 'yes: cluster', s: 'or worker_threads', mau: NODE }, { t: 'measure the peak', s: 'not os.cpus()', mau: CAM }], { h: 120 }) +
    box('Before a second process ever appears', 'move the cron lock and the job queue into Redis. Then scaling out is a configuration change, not an incident.', 'lam') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your API runs on an 8-core VPS. A profile under load shows 72% (idle). A teammate adds cluster with os.cpus().length workers and reports "no change". (1) Why? (2) What should the team do instead? (3) Name two things that may now be broken without any error.', '') +
    box('Hint', 'Slides 5, 9 and 10.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) 72% idle means I/O-bound: the process was mostly waiting, and more processes wait no faster (here +6.7%). (2) Find what it waits on — query count, pool size (16.2), cache (ch. 12), queue (ch. 13). (3) Any of: cron jobs now run 8 times, in-memory caches disagree, RAM rate limits become 8×, Socket.IO emits miss clients, per-process metrics.', 'xanh')}</div>` },

  { t: 'Lesson 16.4 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['/cpu, 1 → best', `${f(CPU[0])} → ${f(best)} (${(best / CPU[0]).toFixed(1)}×, at ${bestW} workers)`, 'cluster multiplies CPU work'],
    ['/cpu, 10 workers', `${f(CPU[4])} — below the peak`, 'measure down as well as up'],
    ['/io, 1 → 10', `${f(IO[0])} → ${f(IO[4])} (+${((IO[4] / IO[0] - 1) * 100).toFixed(1)}%)`, 'waiting does not scale with cores'],
    ['forking', 'cache, limits, sockets, cron, metrics', 'move shared state out first'],
    ['this website', '1 process · 0 cluster · 40 cron', 'correct for an I/O-bound app'],
  ], { co: 22 }) + box('Next: 16.5 — memory leaks, and the kill with no message', 'Three leaks and a control, a heap snapshot, and what an OOM looks like.', 'lam') },
]);
