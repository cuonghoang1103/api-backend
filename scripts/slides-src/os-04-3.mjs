/**
 * os-04-3 — khoá "Operating Systems for Developers", bài 4.3 "Node: worker_threads, cluster, Promise.all" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c43-node.out.txt qua grab(). Giảng: giang/os-04-3.mjs.
 */
import { lamDeck, sql, box } from './_pg-chung.mjs';
import { META, grab, sweep, term, two, speedChart, hbars, BL, GR, RD, OR, PU } from './os-04-chung.mjs';

export const deck = { key: 'os-04-3', code: 'OS 4.3', title: 'Node: worker_threads, cluster and Promise.all', sub: 'Operating Systems · Chapter 4' };

const F = 'c43-node';
const g = (p, n = 1) => grab(F, p, n);
const sw = sweep(F, './sweep.sh "node primes.js');
const main = +g('node primes.js 0').match(/(\d+) ms/)[1];
const fe = (p) => +g(p).match(/(\d+) ms\s*$/m)[1];
const wrapHit = (t) => t.replace(/  p50 /g, '\n  p50 ').replace(/  max /g, '\n  max ');
const hits = wrapHit(g('node hit.js http://localhost:8080/ 400 32', 1));
const parseHit = (s) => { const m = s.match(/(\d+) req\/s\s+p50 (\d+) ms\s+p99 (\d+) ms\s+max (\d+) ms \(sent at \+(\d+) ms\)\s+distinct replies: (\d+)/); return { rps: +m[1], p50: +m[2], p99: +m[3], max: +m[4], at: +m[5], n: +m[6] }; };
const [h1, h0, h4, h8] = (() => {   // bốn lần hit 400/32 theo thứ tự trong output: 1 worker, không cluster, 4, 8 worker
  const L = grab(F, 'node -v', 99).split('\n').filter((l) => l.startsWith('400 req, 32 concurrent'));
  if (L.length !== 4) throw new Error('os-04-3: cần đúng 4 dòng hit 400/32');
  return L.map(parseHit);
})();
const allHits = [h1, h4, h8];
const recvQ = +grab(F, 'node hit.js http://localhost:8080/ 400 32 > /tmp/h.txt').match(/LISTEN\s+(\d+)/)[1];
const fastInline = +g("node hit.js http://localhost:8080/hash 80 20 > /dev/null").match(/runs: ([\d.]+) s/)[1];
const fastPool = +grab(F, 'cat /tmp/p.log', 99).split('\n').filter((l) => l.startsWith('GET /fast'))[1].match(/runs: ([\d.]+) s/)[1];

const poolRps = +grab(F, 'cat /tmp/p.log', 99).split('\n').filter((l) => l.startsWith('80 req'))[0].match(/(\d+) req\/s/)[1];

export const slides = lamDeck({ ...META, bai: '4.3' }, [
  { cover: true, t: 'Node: beyond<br>one JavaScript thread', sub: 'worker_threads for CPU, cluster for more cores,<br>Promise.all for waiting — measured' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The prime count on the main thread vs <b>worker_threads</b> with a lock-free queue</li>
<li>100 slow calls: <code class="i">await</code> in a loop vs <code class="i">Promise.all</code> vs a limit of 10</li>
<li><b>cluster</b>: 1, 4 and 8 processes serving one port</li>
<li>Why an overloaded event loop is <b>unfair</b> to newcomers</li>
<li>You build a fixed <b>worker pool</b> that keeps <code class="i">/fast</code> fast</li>
</ul>` },

  { t: 'worker_threads: the queue is one integer', giua: true, body: two(
    sql(`// in each worker
const next = new Int32Array(shared);   // SharedArrayBuffer(4)
let i;
while ((i = Atomics.add(next, 0, 1)) * CHUNK < n) {
  found += countRange(i * CHUNK,
                      Math.min((i + 1) * CHUNK, n));
}
parentPort.postMessage({ found, chunks });

// in the main thread
new Worker(__filename, { workerData: { shared, n } })
  .on('message', ({ found }) => { total += found; ... });`, { lang: 'javascript', sm: true }),
    `${box('Lock-free work queue', 'Atomics.add returns the old value and adds 1 in one indivisible step, so every worker gets a different chunk number — no mutex, no message per chunk.', 'lam')}
${box('Memory is NOT shared by default', 'Each worker is a separate V8 isolate with its own heap. Only a SharedArrayBuffer is shared; everything else is copied through postMessage.', '')}`, 'r64') },

  { t: 'Speedup: the event loop stays free', giua: true, body: two(
    speedChart([{ name: 'worker_threads', color: GR, pts: sw }], { w: 620, h: 430 }),
    `${term(g('node primes.js 0'))}
<table class="t" style="font-size:20px">
<tr><th>workers = cores</th><th>ms</th><th>speedup</th></tr>
${sw.map((p) => `<tr><td>${p.k}</td><td>${p.ms}</td><td>${p.s}×</td></tr>`).join('')}
</table>`, 'r64') },

  { t: 'Waiting: one JavaScript thread, 1 000 calls', giua: true, body: two(
    sql(`// seq: one at a time
for (let i = 0; i < n; i++)
  r.push(await call());

// all: fire everything, await together
await Promise.all(
  Array.from({ length: n }, call));

// limit: C "lanes" pull the next index
async function lane() {
  while (next < n) {
    const i = next++; out[i] = await call();
  }
}
await Promise.all(
  Array.from({ length: c }, lane));`, { lang: 'javascript', sm: true }),
    hbars([
      { label: 'await in a loop', v: fe('node fetch.js seq'), color: RD },
      { label: 'limit 10', v: fe('node fetch.js limit'), color: OR },
      { label: 'Promise.all 100', v: fe('node fetch.js all 100'), color: GR },
      { label: 'Promise.all 1000', v: fe('node fetch.js all 1000'), color: BL },
    ], { w: 560, lw: 180, rowH: 62, fs: 18 }), 'r46') },

  { t: 'Why Promise.all needs no threads', to: true, giua: true, body: `
<ul>
<li>Each <code class="i">fetch</code> is a <b>socket</b> registered with epoll; the JS thread is free while it waits</li>
<li>1 000 calls × 100 ms finished in <b>${fe('node fetch.js all 1000')} ms</b> — the server saw <b>1 000</b> in flight at once</li>
<li><code class="i">limit 10</code> = Little’s law: 10 ÷ 0.1 s = 100 calls/s ⇒ ~1.1 s</li>
<li>No limit at all is how you knock over the API behind you — 1 000 at once is a <b>choice</b>, not a default</li>
</ul>` },

  { t: 'cluster: several processes, one port', giua: true, body: two(
    sql(`if (cluster.isPrimary) {
  for (let i = 0; i < W; i++) cluster.fork();
} else {
  http.createServer((req, res) => {
    // 20 ms of pure CPU per request
    const end = performance.now() + 20;
    while (performance.now() < end) x++;
    res.end(\`pid \${process.pid}\\n\`);
  }).listen(8080);  // each worker "listens"
}`, { lang: 'javascript', sm: true }),
    term(g("ps -o pid,ppid,rss,nlwp,args")), 'r46') },

  { t: 'cluster: throughput grows with processes', giua: true, body: `
<table class="t" style="font-size:23px">
<tr><th>workers</th><th>req/s</th><th>p50</th><th>p99</th><th>max (sent at)</th><th>distinct pids</th></tr>
${allHits.map((h, i) => `<tr><td>${[1, 4, 8][i]}</td><td><b>${h.rps}</b></td><td>${h.p50} ms</td><td>${h.p99} ms</td><td>${h.max} ms (+${h.at} ms)</td><td>${h.n}</td></tr>`).join('')}
</table>
${box('Read it', `Each request is 20 ms of CPU, so one process can do at most 50 req/s — measured ${allHits[0].rps}. Four processes: ${allHits[1].rps}; eight: ${allHits[2].rps}. The primary hands connections round-robin to workers; each worker is a full Node process (~49 MB RSS, 7 threads).`, 'lam')}` },

  { t: 'An overloaded event loop is not fair', giua: true, body: two(
    `${term(hits)}
${term(grab(F, 'node hit.js http://localhost:8080/ 400 32 > /tmp/h.txt').replace(/ & sleep 2; /, ' &\n$ sleep 2; ').replace(/; wait \$!; cat \/tmp\/h.txt/, '').replace(/\n400 req.*$/s, ''))}`,
    `<ul style="font-size:21px">
<li>1 cluster worker: median ${h1.p50} ms, slowest <b>${(h1.max / 1000).toFixed(1)} s</b> — sent ${h1.at} ms after the start, on a new connection</li>
<li>Plain process, same load: same ${h0.rps} req/s, max <b>${(h0.max / 1000).toFixed(1)} s</b>; Recv-Q ${recvQ} — nobody stuck in the accept queue</li>
<li>cluster’s primary accepts at once and hands the connection over as a message; the saturated worker takes it in late</li>
</ul>`, 'r64') },

  { t: 'Write it yourself: a fixed worker pool', giua: true, body: two(
    sql(`const idle = [], waiting = [];
for (let i = 0; i < N; i++)
  idle.push(new Worker(WORK, { eval: true }));

const submit = () => new Promise((ok) => {
  const w = idle.pop();
  if (w) run(w, ok); else waiting.push(ok); // all busy: queue
});
// when a worker answers: resolve, then take the next job
function next(w) {
  const job = waiting.shift();
  if (job) run(w, job); else idle.push(w);
}`, { lang: 'javascript', sm: true }),
    hbars([
      { label: '/fast, /hash inline', v: Math.round(fastInline * 1000), color: RD },
      { label: '/fast, /hash in pool', v: +(fastPool * 1000).toFixed(1), color: GR },
    ], { w: 560, lw: 200, rowH: 70, fs: 18, unit: 'ms' }), 'r64') },

  { t: 'The pool keeps the event loop answering', to: true, giua: true, body: `
<ul>
<li>80 hash requests (50 ms CPU each), 20 at a time, plus one <code class="i">GET /fast</code></li>
<li>Hash on the main thread: <code class="i">/fast</code> waited <b>${fastInline.toFixed(2)} s</b></li>
<li>Hash in a pool of 4 workers: <code class="i">/fast</code> answered in <b>${(fastPool * 1000).toFixed(1)} ms</b></li>
<li>Throughput of /hash is capped by the pool: 4 ÷ 50 ms = 80/s — measured ${poolRps} req/s</li>
<li>Workers are created <b>once</b>: a new Worker per request costs tens of ms and MBs</li>
</ul>` },

  { t: 'Cheat sheet — parallel Node', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:36%">Job</th><th>Use</th></tr>
<tr><td>Many waits (HTTP, DB)</td><td><code class="i">Promise.all</code> — with a limit (lanes, a semaphore, p-limit)</td></tr>
<tr><td>CPU work inside a request</td><td>a fixed pool of <code class="i">worker_threads</code>, created at startup</td></tr>
<tr><td>Share numbers between workers</td><td><code class="i">SharedArrayBuffer</code> + <code class="i">Atomics</code></td></tr>
<tr><td>Use every core for HTTP</td><td><code class="i">cluster</code> or several containers behind a proxy — size from <code class="i">os.availableParallelism()</code></td></tr>
<tr><td>Never</td><td>a synchronous CPU loop on the main thread of a server</td></tr>
</table>` },
]);
