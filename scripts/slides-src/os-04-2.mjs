/**
 * os-04-2 — khoá "Operating Systems for Developers", bài 4.2 "Java: five ways to run work in parallel" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c42-java.out.txt qua grab(). Giảng: giang/os-04-2.mjs.
 */
import { lamDeck, sql, box, vsd } from './_pg-chung.mjs';
import { META, grab, sweep, term, two, speedChart, hbars, BL, GR, RD, OR, PU, GY } from './os-04-chung.mjs';

export const deck = { key: 'os-04-2', code: 'OS 4.2', title: 'Java: five ways to run work in parallel', sub: 'Operating Systems · Chapter 4' };

const F = 'c42-java';
const g = (p, n = 1) => grab(F, p, n);
const pool = sweep(F, './sweep.sh "java Primes.java pool'), stream = sweep(F, './sweep.sh "java Primes.java stream');
const five = g('for m in threads pool cf stream virtual').split('\n').slice(1)
  .map((l) => l.match(/^(\w+)\s+x4.*?(\d+) ms$/)).filter(Boolean).map((m) => ({ mode: m[1], ms: +m[2] }));
const one = +g('taskset -c 0 java Primes.java threads 1').match(/warm\s+(\d+) ms/)[1];
const fetchRow = (p) => { const m = g(p).match(/peak platform threads=(\d+)\s+(\d+) ms/); return { th: +m[1], ms: +m[2] }; };
const F_ = {
  seq: fetchRow('java Fetch.java seq'), p10: fetchRow('java Fetch.java pool 100 10'), p100: fetchRow('java Fetch.java pool 100 100'),
  vt: fetchRow('java Fetch.java virtual'), as: fetchRow('java Fetch.java async'), vt1: fetchRow('taskset -c 0 java Fetch.java virtual'),
};
const COL = { threads: OR, pool: BL, cf: PU, stream: GR, virtual: RD };

export const slides = lamDeck({ ...META, bai: '4.2' }, [
  { cover: true, t: 'Java: five ways to run work in parallel', sub: 'Thread, ExecutorService, CompletableFuture,<br>parallelStream and virtual threads — measured' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The same prime count written with <b>five</b> Java APIs — and timed on 4 cores</li>
<li>Speedup curves of a thread pool and of <code class="i">parallelStream</code></li>
<li>100 calls to a slow API: sequential, pool of 10, pool of 100, virtual threads, async</li>
<li>Which API to pick for <b>CPU work</b> and which for <b>waiting</b></li>
<li>You write a virtual-thread client that never sends more than <b>20</b> calls at once</li>
</ul>` },

  { t: 'The five APIs, side by side', giua: true, body: sql(`// 1. raw Thread: one fixed block each, then join
th[i] = new Thread(() -> found[id] = countRange(lo, hi));

// 2. ExecutorService: one Callable per 10 000 numbers
fs.add(ex.submit(() -> countRange(a, b)));
for (Future<Long> f : fs) sum += f.get();

// 3. CompletableFuture on the same pool
cfs.add(CompletableFuture.supplyAsync(() -> countRange(a, b), ex));

// 4. parallelStream: one line, the common ForkJoinPool
LongStream.range(0, n).parallel().filter(Primes::isPrime).count();

// 5. virtual threads: the same submit() on a new executor
ExecutorService ex = Executors.newVirtualThreadPerTaskExecutor();`, { lang: 'java', sm: true }) },

  { t: 'Same job on 4 cores: the split matters again', giua: true, body: `
${hbars(five.map((r) => ({ label: r.mode, v: r.ms, color: COL[r.mode], mono: true, note: `${(one / r.ms).toFixed(2)}×` })), { lw: 200, rowH: 58, fs: 21 })}
${box('Read it', `1 core: ${one} ms. Raw threads with one block each are the slowest (${five[0].ms} ms) — the same imbalance as lesson 4.1. Every API that cuts the job into many small tasks lands within a few percent of each other.`, 'lam')}` },

  { t: 'Speedup: a thread pool and parallelStream', giua: true, body: two(
    speedChart([{ name: 'ExecutorService (2 000 tasks)', color: BL, pts: pool, dy: -8 }, { name: 'parallelStream', color: GR, pts: stream, dy: 18 }], { w: 620, h: 430 }),
    `<table class="t" style="font-size:20px">
<tr><th>cores</th><th>pool</th><th>stream</th></tr>
${pool.map((p, i) => `<tr><td>${p.k}</td><td>${p.ms} ms</td><td>${stream[i].ms} ms</td></tr>`).join('')}
</table>
${box('', 'parallelStream sized itself from the CPUs it was allowed — taskset lowers availableProcessors() and the common pool follows.', 'lam')}`, 'r64') },

  { t: 'Virtual threads do not make CPU work faster', to: true, giua: true, body: `
<ul>
<li>Virtual threads run on <b>carrier</b> threads — one per core by default</li>
<li>CPU-bound: ${five.find((r) => r.mode === 'virtual').ms} ms vs a 4-thread pool ${five.find((r) => r.mode === 'pool').ms} ms — the same <b>4 cores</b> do the work</li>
<li>They shine when tasks <b>wait</b>: a waiting virtual thread unmounts and frees its carrier</li>
</ul>
${box('Rule', 'CPU work: a pool sized to the cores (or parallelStream). Waiting work: virtual threads or async. That is the next slide.', 'xanh')}` },

  { t: 'The I/O job: 100 calls to a slow API', giua: true, body: two(
    sql(`// slow.js: each GET waits 100 ms (like a DB)
setTimeout(() => res.end('ok\\n'), ms);

// Fetch.java
static String call() {
  return http.send(req, ofString()).body();
}
// seq     : call() 100 times in a row
// pool T  : newFixedThreadPool(T)
// virtual : newVirtualThreadPerTaskExecutor()
// async   : http.sendAsync(...) + join`, { lang: 'java', sm: true }),
    hbars([
      { label: 'sequential', v: F_.seq.ms, color: RD },
      { label: 'pool of 10', v: F_.p10.ms, color: OR },
      { label: 'pool of 100', v: F_.p100.ms, color: BL },
      { label: 'virtual', v: F_.vt.ms, color: GR },
      { label: 'async', v: F_.as.ms, color: PU },
    ], { w: 520, lw: 150, rowH: 56, fs: 18 }), 'r46') },

  { t: 'Waiting needs no CPU — only something to wait in', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th>100 calls × 100 ms</th><th>time</th><th>peak platform threads</th><th>why</th></tr>
<tr><td>sequential</td><td>${F_.seq.ms} ms</td><td>${F_.seq.th}</td><td>100 waits in a row</td></tr>
<tr><td>pool of 10</td><td>${F_.p10.ms} ms</td><td>${F_.p10.th}</td><td>10 waits at a time ⇒ 10 rounds</td></tr>
<tr><td>pool of 100</td><td>${F_.p100.ms} ms</td><td>${F_.p100.th}</td><td>one kernel thread per wait</td></tr>
<tr><td>virtual threads</td><td>${F_.vt.ms} ms</td><td>${F_.vt.th}</td><td>100 waits on a few carriers</td></tr>
<tr><td>virtual, <b>1 core</b></td><td>${F_.vt1.ms} ms</td><td>${F_.vt1.th}</td><td>waiting does not need cores</td></tr>
</table>
${box('Little’s law again', 'Pool of 10 × 100 ms ⇒ at most 100 calls/s ⇒ 100 calls take ~1 s. Measured: ' + F_.p10.ms + ' ms. Lesson 3.5 derived it; here you wrote the client.', 'lam')}` },

  { t: 'async: no thread waits — callbacks run elsewhere', giua: true, body: two(
    sql(`var fs = new ArrayList<CompletableFuture<String>>();
for (int i = 0; i < n; i++)
  fs.add(http.sendAsync(req, ofString())
             .thenApply(HttpResponse::body));
for (var f : fs) f.join();`, { lang: 'java', sm: true }),
    `${term(g('java Fetch.java async').replace('  peak', '\n        peak'))}
<ul style="font-size:21px">
<li>HttpClient waits on its own selector — <b>epoll</b> underneath (Chapter 10)</li>
<li>Callbacks run on the client’s executor (a cached pool by default) — hence ${F_.as.th} platform threads</li>
<li>Code becomes a chain of callbacks; virtual threads keep plain blocking code</li>
</ul>`, 'r64') },

  { t: 'Which Java API for which job?', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:32%">Job</th><th>Use</th><th>Avoid</th></tr>
<tr><td>CPU work, split into pieces</td><td><code class="i">newFixedThreadPool(cores)</code>, ForkJoinPool, <code class="i">parallelStream</code></td><td>one raw Thread per block (imbalance)</td></tr>
<tr><td>Many blocking calls (JDBC, HTTP)</td><td>virtual threads (Java 21+)</td><td>a fixed pool smaller than the concurrency you need</td></tr>
<tr><td>Combine results of async calls</td><td><code class="i">CompletableFuture</code> (thenCombine, allOf)</td><td><code class="i">get()</code> right after every submit</td></tr>
<tr><td>Limit concurrency to a resource</td><td><code class="i">Semaphore</code> around the call</td><td>“virtual threads are free, so no limit”</td></tr>
</table>` },

  { t: 'Write it yourself: virtual threads with a limit of 20', giua: true, body: two(
    sql(`var permits = new Semaphore(limit);
try (var ex = Executors
         .newVirtualThreadPerTaskExecutor()) {
  for (int i = 0; i < n; i++)
    fs.add(ex.submit(() -> {
      permits.acquire();   // wait
      try {
        return http.send(req, ofString()).body();
      } finally {
        permits.release();   // always
      }
    }));
}`, { lang: 'java', sm: true }),
    `${term(g('java giai/Limited.java').replace(' server', '\nserver'))}
${box('The server agrees', 'peak 20 calls in flight, 300 calls in ~1.7 s = 300 ÷ 20 × 100 ms + overhead. Virtual threads made waiting cheap; the semaphore protects the API (or the DB pool) behind it.', 'xanh')}`, 'r64') },

  { t: 'Cheat sheet — Java concurrency', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:38%">You want to…</th><th>Write</th></tr>
<tr><td>Run tasks on N threads</td><td><code class="i">Executors.newFixedThreadPool(N)</code> · <code class="i">submit</code> · <code class="i">Future.get</code></td></tr>
<tr><td>One virtual thread per task</td><td><code class="i">Executors.newVirtualThreadPerTaskExecutor()</code></td></tr>
<tr><td>Chain / combine async results</td><td><code class="i">supplyAsync</code> · <code class="i">thenApply</code> · <code class="i">allOf</code> · <code class="i">join</code></td></tr>
<tr><td>Data-parallel one-liner</td><td><code class="i">.parallel()</code> on a stream (common ForkJoinPool)</td></tr>
<tr><td>Cap concurrent calls</td><td><code class="i">Semaphore.acquire / release</code> in <code class="i">finally</code></td></tr>
<tr><td>Close the pool</td><td>try-with-resources, or <code class="i">shutdown()</code></td></tr>
</table>` },
]);
