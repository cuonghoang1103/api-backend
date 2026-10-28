/**
 * os-04-4 — khoá "Operating Systems for Developers", bài 4.4 "Python: the GIL, threads, processes, asyncio" (29/10/2026).
 * Khuôn _pg-chung.mjs. Số đọc THẲNG từ lab/out/c44-python.out.txt qua grab(). Giảng: giang/os-04-4.mjs.
 */
import { lamDeck, sql, box, vsd } from './_pg-chung.mjs';
import { META, grab, sweep, term, two, speedChart, hbars, BL, GR, RD, OR, PU } from './os-04-chung.mjs';

export const deck = { key: 'os-04-4', code: 'OS 4.4', title: 'Python: the GIL, threads, processes and asyncio', sub: 'Operating Systems · Chapter 4' };

const F = 'c44-python';
const g = (p, n = 1) => grab(F, p, n);
const th = sweep(F, './sweep.sh "python3 primes.py threads'), pr = sweep(F, './sweep.sh "python3 primes.py procs');
const msOf = (p) => +g(p).match(/(\d+) ms\s*$/m)[1];
const seq = msOf('python3 primes.py seq');
const fetchMs = (p) => { const m = g(p).match(/peak=(\d+) in flight\s+(\d+) ms/); return { peak: +m[1], ms: +m[2] }; };
const fs = { seq: fetchMs('python3 fetch.py seq'), t10: fetchMs('python3 fetch.py threads 100 10'), t100: fetchMs('python3 fetch.py threads 100 100'),
  a100: fetchMs('python3 fetch.py asyncio 100'), a1000: fetchMs('python3 fetch.py asyncio 1000') };
const race = grab(F, 'python3 race.py inline', 4);
const lost = [...race.matchAll(/^split .*lost ([\d,]+)/gm)].map((m) => +m[1].replace(/,/g, ''));
const psL = g('python3 primes.py threads 4 2000000 &').split('\n').map((l) => l.match(/^\s+\d+\s+(\d+)\s+([\d.]+) Thread/)).filter(Boolean);
const topCpu = g('python3 primes.py threads 4 2000000 &').match(/S\s+([\d.]+)\s+[\d.]+\s+[\d:.]+ python3/)[1];

export const slides = lamDeck({ ...META, bai: '4.4' }, [
  { cover: true, t: 'Python: one lock for the whole interpreter', sub: 'The GIL — and what threads, processes and asyncio<br>each really buy you, measured' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Is there a <b>GIL</b> in your Python? One line tells you — and the free-threaded build</li>
<li>The prime count with <code class="i">threading</code> vs <code class="i">multiprocessing</code>, on 1–10 cores</li>
<li>100 and 1 000 slow calls: threads <b>do</b> help here — and asyncio</li>
<li>Proof that the GIL is <b>not</b> a lock for your data</li>
<li>You write one asyncio program that does both I/O and CPU work properly</li>
</ul>` },

  { t: 'Is there a GIL in this Python?', giua: true, body: `
${term(g('python3 gil.py'))}
${box('What the GIL is', 'The Global Interpreter Lock: only the thread holding it may run Python bytecode. Threads still exist as real kernel threads — they take turns. The lock is released while a thread waits for I/O or sleeps.', 'lam')}
${box('Free-threaded Python (PEP 703)', 'CPython 3.13+ can be built without the GIL ("python3.14t"). Ubuntu 26.04 in our lab ships only the normal build — no nogil / 3.14t package in apt — so every number in this lesson is with the GIL. Try the t-build yourself and compare.', '')}` },

  { t: 'CPU work: threads give nothing, processes give cores', giua: true, body: two(
    speedChart([{ name: 'multiprocessing (Pool)', color: GR, pts: pr }, { name: 'threading', color: RD, pts: th, dy: -8 }], { w: 620, h: 430 }),
    `<table class="t" style="font-size:20px">
<tr><th>cores</th><th>threads</th><th>processes</th></tr>
${pr.map((p) => { const t = th.find((x) => x.k === p.k); return `<tr><td>${p.k}</td><td>${t ? t.ms + ' ms' : '—'}</td><td><b>${p.ms} ms</b></td></tr>`; }).join('')}
</table>
${box('', `Primes below 2 000 000: ${seq} ms in one thread. Threads on 4 cores: still ~${th[th.length - 1].ms} ms.`, 'do2')}`, 'r64') },

  { t: 'You can watch the threads take turns', giua: true, body: `
${term(g('python3 primes.py threads 4 2000000 &'))}
<ul style="font-size:22px">
<li>Four real kernel threads (LWP ${psL[0][1]}–${psL[psL.length - 1][1]}), each at <b>${Math.min(...psL.map((m) => +m[2]))}–${Math.max(...psL.map((m) => +m[2]))}%</b> of a core</li>
<li>top: the whole process at <b>${topCpu}%</b> — one core’s worth: whoever holds the GIL runs, the others wait</li>
<li>Same ps/top skills as Chapter 2 — the GIL is visible from outside</li>
</ul>` },

  { t: 'multiprocessing: real cores, real costs', to: true, giua: true, body: `
<ul>
<li><code class="i">Pool(T).map(count_range, chunks)</code> — T separate <b>processes</b>, each with its own interpreter and GIL</li>
<li>Arguments and results are <b>pickled</b> and sent through pipes</li>
<li>${pr[pr.length - 1].s}× on 10 cores here — start-up and transfer eat the rest</li>
<li>Each worker is a whole Python process: memory × T</li>
</ul>
${box('When it pays', 'Big CPU chunks, small inputs and outputs. When the data is big, ship file offsets, not data — lesson 4.7 measures that.', 'xanh')}` },

  { t: 'I/O work: here threads DO help', giua: true, body: two(
    sql(`def call(_=None):
    # blocks — but releases the GIL
    with urllib.request.urlopen(URL) as r:
        return r.read().decode()

with ThreadPoolExecutor(t) as ex:
    r = list(ex.map(call, range(n)))

async def acall():      # asyncio: no threads
    rd, wr = await asyncio.open_connection(
        'localhost', 9000)
    wr.write(b'GET /?ms=100 HTTP/1.1 ...')
    return await rd.read()`, { lang: 'python', sm: true }),
    hbars([
      { label: 'sequential', v: fs.seq.ms, color: RD },
      { label: '10 threads', v: fs.t10.ms, color: OR },
      { label: '100 threads', v: fs.t100.ms, color: BL },
      { label: 'asyncio 100', v: fs.a100.ms, color: GR },
      { label: 'asyncio 1000', v: fs.a1000.ms, color: PU },
    ], { w: 520, lw: 150, rowH: 58, fs: 18 }), 'r46') },

  { t: 'Why the GIL does not hurt waiting', to: true, giua: true, body: `
<ul>
<li>A thread blocked in <code class="i">recv()</code> has <b>released</b> the GIL — others run</li>
<li>100 threads: ${fs.t100.ms} ms, server peak ${fs.t100.peak}; 10 threads: ${fs.t10.ms} ms (Little’s law again)</li>
<li>asyncio: one thread, an event loop over epoll — ${fs.a100.ms} ms for 100, <b>${fs.a1000.ms} ms for 1 000</b></li>
<li>The GIL only serialises <b>running Python code</b>, not waiting</li>
</ul>` },

  { t: 'The GIL is not a lock for your data', giua: true, body: two(
    term(race.replace(/  got /g, '\n        got ')),
    `${sql(`def deposit():
    v = get_balance()        # read
    set_balance(v + 1)       # write — another thread
                             # may run in between`, { lang: 'python', sm: true })}
${box('Lost updates under the GIL', `balance += 1 survived here, but read → call a function → write lost ${(Math.min(...lost) / 1e6).toFixed(1)}–${(Math.max(...lost) / 1e6).toFixed(1)} million of 4 million updates. The interpreter may switch threads between Python operations. Use a Lock — Chapter 5 applies to Python too.`, 'do2')}`, 'r46') },

  { t: 'Write it yourself: asyncio for I/O, processes for CPU', giua: true, body: two(
    sql(`sem = asyncio.Semaphore(10)
async def get(sem):
    async with sem:   # max 10 in flight
        ...

loop = asyncio.get_running_loop()
with ProcessPoolExecutor(4) as pool:
    parts = await asyncio.gather(*(
        loop.run_in_executor(
            pool, count_primes, rng)
        for rng in ranges))  # CPU: 4 procs`, { lang: 'python', sm: true }),
    `${term(g('python3 giai/hybrid.py').replace(/, server peak/, ',\n     server peak').replace(/ in 4 processes/, '\n     in 4 processes').replace(/; heartbeat/, ';\n     heartbeat').replace(/ times, longest/, ' times,\n     longest'))}
${box('Both rules at once', 'The server saw exactly 10 in flight. While 4 processes counted primes, a 100 ms heartbeat on the event loop kept ticking — the loop was never blocked.', 'xanh')}`, 'r46') },

  { t: 'Cheat sheet — parallel Python (with the GIL)', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:34%">Job</th><th>Use</th><th>Not</th></tr>
<tr><td>CPU work</td><td><code class="i">multiprocessing.Pool</code>, <code class="i">ProcessPoolExecutor</code>, or NumPy/C code that releases the GIL</td><td>threads</td></tr>
<tr><td>Blocking I/O, few hundred</td><td><code class="i">ThreadPoolExecutor</code></td><td>processes</td></tr>
<tr><td>Thousands of waits</td><td><code class="i">asyncio</code> + a <code class="i">Semaphore</code></td><td>a thread each</td></tr>
<tr><td>CPU step inside asyncio</td><td><code class="i">loop.run_in_executor(process_pool, …)</code></td><td>calling it directly</td></tr>
<tr><td>Shared counters</td><td><code class="i">threading.Lock</code></td><td>“the GIL protects it”</td></tr>
</table>` },
]);
