/**
 * os-04-7 — khoá "Operating Systems for Developers", bài 4.7 "Pipelines, map-reduce, cancellation and timeouts" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c47-pipe.out.txt qua grab(). Giảng: giang/os-04-7.mjs.
 */
import { lamDeck, sql, box, vsd, flow } from './_pg-chung.mjs';
import { META, grab, term, two, hbars, BL, GR, RD, OR, PU, GY } from './os-04-chung.mjs';

export const deck = { key: 'os-04-7', code: 'OS 4.7', title: 'Pipelines, map-reduce, cancellation and timeouts', sub: 'Operating Systems · Chapter 4' };

const F = 'c47-pipe';
const g = (p, n = 1) => grab(F, p, n);
const pipe = (p) => { const m = g(p).match(/max queue depth=([\d,]+)\s+max heap=(\d+) MB\s+(\d+) ms/); return { depth: m[1], heap: +m[2], ms: +m[3] }; };
const b1 = pipe('java -Xmx256m Pipeline.java bounded 1000000'), u1 = pipe('java -Xmx256m Pipeline.java unbounded 1000000'), b2 = pipe('java -Xmx256m Pipeline.java bounded 2000000');
const u2 = g('for i in 1 2 3; do java -Xmx256m Pipeline.java unbounded 2000000');
const mr = (p) => +g(p).match(/(\d+) ms\s*$/m)[1];

export const slides = lamDeck({ ...META, bai: '4.7' }, [
  { cover: true, t: 'Pipelines, map-reduce,<br>cancellation and timeouts', sub: 'The patterns that turn “parallel” into a program<br>you can run in production' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Producer–consumer</b> with a bounded queue — and what an unbounded one does to memory</li>
<li><b>Map-reduce on one machine</b>: why <i>where the data travels</i> decides the speed</li>
<li><b>Cancellation</b>: why “cancel” only asks politely in Java, Node and Python</li>
<li><b>Timeouts</b> that really stop work vs timeouts that only stop waiting</li>
<li>You build a three-stage pipeline with a deadline</li>
</ul>` },

  { t: 'A pipeline: stages connected by queues', giua: true, body: `
${flow([{ t: 'reader', s: '1 thread, fast', mau: BL }, { t: 'queue', s: 'bounded: 1 024', mau: OR }, { t: 'parsers', s: 'K threads, slower', mau: GR }, { t: 'result', s: 'errors counted', mau: PU }], { h: 140 })}
${sql(`BlockingQueue<String> q = bounded ? new ArrayBlockingQueue<>(1024)
                                    : new LinkedBlockingQueue<>();      // no limit
producer: for (...) q.put(line);         // bounded: BLOCKS when full
consumer: for (String s; (s = q.take()) != END; ) process(s);`, { lang: 'java', sm: true })}` },

  { t: 'Bounded vs unbounded: same speed, not same RAM', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th>-Xmx256m, 2 consumers</th><th>max queue depth</th><th>max heap</th><th>time</th></tr>
<tr><td>bounded, 1 M lines</td><td>${b1.depth}</td><td>${b1.heap} MB</td><td>${b1.ms} ms</td></tr>
<tr><td>unbounded, 1 M lines</td><td class="do">${u1.depth}</td><td class="do">${u1.heap} MB</td><td>${u1.ms} ms</td></tr>
<tr><td>bounded, 2 M lines</td><td>${b2.depth}</td><td>${b2.heap} MB</td><td>${b2.ms} ms</td></tr>
</table>
${box('An unbounded queue does not make anything faster', 'The consumers set the pace either way. Without a bound, the difference between producer and consumer speed just piles up in RAM.', 'do2')}` },

  { t: 'Unbounded, 2 M lines: a coin flip', giua: true, body: `
${term(u2)}
${box('Backpressure', 'A full bounded queue makes put() wait: the producer slows to the consumers’ speed. That is backpressure — the same idea as a full socket buffer in lesson 10.8.', 'xanh')}` },

  { t: 'Map-reduce on one machine', giua: true, body: two(
    sql(`def count_range(arg):   # MAP: my slice
    path, start, end = arg
    with open(path, 'rb') as f:
        if start:             # skip half line
            f.seek(start - 1); f.readline()
        c = Counter()
        while f.tell() < end:
            c.update(f.readline().split())
        return c

parts = pool.map(count_range,
                 ranges(path, t))
total = Counter()
for p in parts: total.update(p)  # REDUCE`, { lang: 'python', sm: true }),
    hbars([
      { label: 'one process', v: mr('python3 mr.py one /data/words.txt'), color: GY },
      { label: 'ship lines ×4', v: mr('python3 mr.py lines /data/words.txt 4'), color: OR },
      { label: 'ship offsets ×4', v: mr('python3 mr.py ranges /data/words.txt 4'), color: GR },
      { label: 'ship offsets ×8', v: mr('python3 mr.py ranges /data/words.txt 8'), color: BL },
    ], { w: 520, lw: 160, rowH: 60, fs: 18 }), 'r46') },

  { t: 'Granularity: one line per message is a disaster', giua: true, body: `
${term(g('python3 mr.py one /data/small.txt', 3))}
${box('Where the data travels decides the speed', `100 000 lines: ${mr('python3 mr.py one /data/small.txt')} ms in one process, ${mr('python3 mr.py lines1 /data/small.txt')} ms when every line is pickled to a worker separately. Send big chunks — or better, send only offsets and let each worker read its own slice of the file.`, 'do2')}` },

  { t: 'Cancellation in Java is a polite request', giua: true, body: two(
    term(`${g('java Cancel.java sleep')}\n${g('java Cancel.java spin')}`.replace(/, isCancelled=true/g, '').replace(/500 ms after cancel the task did ([\d,]+) more iterations/g, '0.5 s later: +$1 loops')),
    `${term(g('java Cancel.java check').replace(/, isCancelled=true/g, '').replace(/500 ms after cancel the task did ([\d,]+) more iterations/g, '0.5 s later: +$1 loops'))}
<ul style="font-size:20px">
<li><code class="i">cancel(true)</code> only sets the <b>interrupt flag</b></li>
<li><code class="i">sleep</code>, <code class="i">wait</code>, <code class="i">take</code> notice it and throw</li>
<li>A CPU loop that never looks keeps a core busy — forever</li>
</ul>`, 'r46') },

  { t: 'Node and Python: same rule, different tools', giua: true, body: `
${term(`${g('node cancel.js fetch')}\n${g('node cancel.js race')}\n${g('node cancel.js worker')}`)}
${term(`${g('python3 cancel.py asyncio')}\n${g('python3 cancel.py thread')}\n${g('python3 cancel.py process')}`)}` },

  { t: 'A timeout that stops waiting vs one that stops work', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th></th><th>Stops the work</th><th>Only stops waiting</th></tr>
<tr><td>Java</td><td><code class="i">HttpRequest.timeout</code>, interrupt + a loop that checks it</td><td><code class="i">get(timeout)</code> without cancel; cancel on a loop that never checks</td></tr>
<tr><td>Node</td><td><code class="i">AbortSignal.timeout()</code> on fetch, <code class="i">worker.terminate()</code></td><td><code class="i">Promise.race</code> with a timer</td></tr>
<tr><td>Python</td><td><code class="i">asyncio.timeout()</code>, <code class="i">process.terminate()</code></td><td><code class="i">future.result(timeout)</code> on a thread</td></tr>
</table>
${box('Rule', 'Every wait gets a deadline, and every deadline must reach the code that does the work. Otherwise a “timed out” request keeps using a thread, a connection and a database slot.', 'xanh')}` },

  { t: 'Write it yourself: three stages and a deadline', giua: true, body: `
${flow([{ t: 'reader', s: '1 thread', mau: BL }, { t: 'parse ×3', s: 'bounded queues', mau: GR }, { t: 'count', s: 'per status', mau: PU }], { h: 110, fs: 20 })}
${two(sql(`// clean end: K poison pills down the pipe
for (int i = 0; i < k; i++) lines.put(END);
// one deadline for the whole job
try { agg.get(deadline, MILLISECONDS); }
catch (TimeoutException e) { /* partial */ }
ex.shutdownNow();  // interrupts take()/put()`, { lang: 'java', sm: true }),
    term(`${g('java giai/Pipeline3.java /data/access.log 3 10000').replace(/ \{.*?\};/, ';').replace(/: (\d)/, ':\n  $1').replace('; all threads', ';\n  all threads')}\n${g('java giai/Pipeline3.java /data/access.log 3 50').replace(/ \{.*?\};/, ';').replace(/ after /, '\n  after ').replace(/: (\d)/, ':\n  $1').replace('; all threads', ';\n  all threads')}`), 'r46')}` },

  { t: 'Cheat sheet — pipelines and cancellation', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:36%">You want to…</th><th>Use</th></tr>
<tr><td>Connect stages safely</td><td>a <b>bounded</b> queue: <code class="i">ArrayBlockingQueue</code>, <code class="i">queue.Queue(maxsize)</code>, a Node stream with highWaterMark</td></tr>
<tr><td>Shut a pipeline down cleanly</td><td>poison pills (one per consumer), then join</td></tr>
<tr><td>Map-reduce on one box</td><td>send offsets, not data; per-worker partial results; merge at the end</td></tr>
<tr><td>Cancel</td><td>Java interrupt + check · Node <code class="i">AbortSignal</code> · Python <code class="i">asyncio</code> cancel / terminate a process</td></tr>
<tr><td>Bound the whole job</td><td>a deadline + <code class="i">shutdownNow()</code> / abort, and report partial results honestly</td></tr>
</table>` },
]);
