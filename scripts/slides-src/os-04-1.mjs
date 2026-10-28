/**
 * os-04-1 — khoá "Operating Systems for Developers", bài 4.1 "C: fork, pthreads and a work queue" (29/10/2026).
 * Khuôn _pg-chung.mjs. Mọi số trên slide đọc THẲNG từ lab/out/c41-c.out.txt (chạy thật trong ảnh os-lab) qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-04-1.mjs.
 */
import { lamDeck, sql, box, cards, vsd, tbl } from './_pg-chung.mjs';
import { META, grab, sweep, term, big, two, speedChart, hbars, T, R, BL, GR, RD, OR, GY, PU } from './os-04-chung.mjs';

export const deck = { key: 'os-04-1', code: 'OS 4.1', title: 'C: fork, pthreads and a work queue', sub: 'Operating Systems · Chapter 4' };

const F = 'c41-c';
const g = (p, n = 1) => grab(F, p, n);
const busy = (p) => g(p).split('\n').map((l) => l.match(/(thread|child) (\d+) (?:busy|finished after)\s+(\d+) ms/)).filter(Boolean).map((m) => ({ i: +m[2], ms: +m[3] }));
const block = sweep(F, './sweep.sh "./primes block'), queue = sweep(F, './sweep.sh "./primes queue'), fork = sweep(F, './sweep.sh "./primes fork');
const last = (s) => s[s.length - 1];

/* Thanh "thời gian bận" của 4 luồng/tiến trình: thấy ngay ai xong sớm, ai kéo dài cả việc. */
const busyBars = (rows, color, label, W = 520) => {
  const max = Math.max(...rows.map((r) => r.ms));
  let s = `<svg viewBox="0 0 ${W} 230" width="${W}" height="230" font-family="Arial">` + T(4, 20, label, 17, { w: 800, f: color });
  rows.forEach((r, k) => {
    const y = 36 + k * 46, w = (r.ms / max) * (W - 190);
    s += T(84, y + 26, `#${r.i}`, 18, { a: 'end', w: 700, m: 1 });
    s += R(94, y + 6, w, 30, color + '33', color, { rx: 4 });
    s += T(102 + w, y + 28, `${r.ms} ms`, 17, { w: 800, f: color });
  });
  return s + '</svg>';
};

/* Ba cách chia việc */
const ways = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">`;
  const box3 = [[10, '1 · fork + wait', 'processes, results through a pipe', BL], [380, '2 · threads, fixed blocks', '1/T of the numbers each', OR], [750, '3 · threads + a work queue', 'take the next 10 000 when free', GR]];
  box3.forEach(([x, t, sub, c], i) => {
    s += R(x, 6, 350, 288, c + '10', c, { rx: 12 });
    s += T(x + 175, 38, t, 22, { a: 'middle', w: 800, f: c }) + T(x + 175, 64, sub, 16, { a: 'middle', f: '#555' });
    for (let k = 0; k < 4; k++) {
      const y = 84 + k * 50;
      if (i < 2) {
        const w = [130, 190, 235, 270][k];
        s += R(x + 22, y, w, 36, c + '33', c, { rx: 5 });
        s += T(x + 32, y + 24, i === 0 ? `child ${k}` : `thread ${k}`, 16, { w: 700, f: c });
      } else {
        s += T(x + 22, y + 24, `T${k}`, 16, { w: 700, f: c });
        for (let j = 0; j < 7; j++) s += R(x + 52 + j * 40, y, 34, 36, c + (j % 2 ? '22' : '44'), c, { rx: 4, sw: 1.5 });
      }
    }
    if (i < 2) s += T(x + 175, 286, 'the last block holds the biggest numbers', 15, { a: 'middle', f: RD, w: 700 });
    else s += T(x + 175, 286, 'everyone stops at about the same time', 15, { a: 'middle', f: GR, w: 700 });
  });
  return s + '</svg>';
};

const mb = (p) => busy(p);
/* strace: in đúng dòng thật, chỉ cắt đuôi dài và xuống dòng chuỗi cờ cho vừa khung */
const straceFork = () => { const L = g('strace -f -e trace=clone,clone3,wait4').split('\n'); return ['$ strace -f -e trace=clone,clone3,wait4 ./primes fork 2 1000', L[1].replace(/strace: Process \d+ attached/, ''), L[3], L[4]].join('\n'); };
const straceThread = () => {
  const L = g('strace -f -e trace=clone,clone3 ./primes queue').split('\n');
  const flags = L[2].match(/flags=([A-Z_|]+)/)[1].split('|');
  const rows = []; let cur = '  flags=';
  for (const f of flags) { if ((cur + f).length > 74) { rows.push(cur + '|'); cur = '        '; } cur += (cur.endsWith('=') || cur.trim() === '' ? '' : '|') + f; }
  rows.push(cur);
  return ['$ strace -f -e trace=clone,clone3 ./primes queue 2 1000', 'clone3({flags=CLONE_VM|…}, 88) = -1 ENOSYS (Function not implemented)', 'clone(child_stack=0x…,', ...rows].join('\n');
};

export const slides = lamDeck({ ...META, bai: '4.1' }, [
  { cover: true, t: 'Your first parallel program in C', sub: 'fork + wait, pthreads and a work queue —<br>speedup measured core by core' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>One CPU-bound job — <b>counting primes</b> — written three ways in C</li>
<li><code class="i">fork</code> + <code class="i">wait</code> with a pipe, <code class="i">pthread_create</code> with fixed blocks, and a <b>work queue</b></li>
<li>Why “same amount of numbers” is <b>not</b> “same amount of work”</li>
<li>Speedup measured on 1, 2, 4, 6, 8 and 10 cores with <code class="i">taskset</code></li>
<li>You write a Mandelbrot renderer yourself — and see static vs dynamic split</li>
</ul>` },

  { t: 'The job: count the primes below 20 million', giua: true, body: two(
    sql(`static int is_prime(long n) {
    if (n < 2) return 0;
    if (n % 2 == 0) return n == 2;
    for (long d = 3; d * d <= n; d += 2)
        if (n % d == 0) return 0;
    return 1;
}
static long count_range(long lo, long hi) {
    long c = 0;
    for (long n = lo; n < hi; n++)
        c += is_prime(n);
    return c;
}`, { lang: 'c', sm: true }),
    `${term(g('./primes seq'))}
${box('Pure CPU, and uneven', 'Testing a big number takes up to √n divisions, so numbers near 20 million cost far more than numbers near 1 million. Keep that in mind — it decides which split wins.', 'lam')}`, 'r46') },

  { t: 'Three ways to split the same job', giua: true, body: ways() },

  { t: 'Way 1 — fork + wait: four processes', giua: true, body: two(
    sql(`int fd[2]; pipe(fd);
for (int i = 0; i < t; i++) {
  if (fork() == 0) {             /* child */
    long lo = N*i/t, hi = N*(i+1)/t;
    long r[2] = { count_range(lo, hi), ms };
    write(fd[1], r, sizeof r);
    _exit(0);
  }
}
close(fd[1]);
while (read(fd[0], r, sizeof r) == sizeof r)
  total += r[0];
while (wait(NULL) > 0) ;         /* no zombies */`, { lang: 'c', sm: true }),
    `${busyBars(mb('./primes fork 4'), BL, 'when each child finished')}
${box('Separate memory', 'A child cannot just write into a variable of the parent — each has its own copy after fork. The result travels back through a pipe.', 'lam')}`, 'r46') },

  { t: 'Way 2 — fixed blocks: the slowest thread decides', giua: true, body: two(
    `${busyBars(mb('./primes block 4'), OR, 'busy time of each thread')}`,
    `${term(g('./primes block 4').split('\n').slice(-1)[0])}
<ul style="font-size:22px">
<li>Each thread gets <b>5 000 000</b> numbers — equal count</li>
<li>Thread 3 gets the <b>largest</b> numbers: the most work</li>
<li>Wall time = the <b>slowest</b> thread; the others sit idle</li>
</ul>`, 'r46') },

  { t: 'Way 3 — a work queue: whoever is free takes more', giua: true, body: two(
    sql(`#define CHUNK 10000
static long next_chunk, nchunks;
static pthread_mutex_t qlock;

static long take_chunk(void) { /* -1: done */
  pthread_mutex_lock(&qlock);
  long c = next_chunk < nchunks
         ? next_chunk++ : -1;
  pthread_mutex_unlock(&qlock);
  return c;
}
/* worker: while ((c = take_chunk()) >= 0)
     found += count_range(c*CHUNK, ...); */`, { lang: 'c', sm: true }),
    `${busyBars(mb('./primes queue 4'), GR, 'busy time of each thread')}
${box('2 000 small jobs', 'A lock taken 2 000 times in half a second costs nothing measurable. The threads finish together because nobody is stuck with the expensive end.', 'xanh')}`, 'r46') },

  { t: 'fork and pthread_create are both clone()', giua: true, body: `
${term(straceFork())}
${term(straceThread())}
${box('Only the flags differ', 'fork = clone with SIGCHLD: a new process with a copy of memory. A thread = CLONE_VM | CLONE_FILES | CLONE_THREAD …: same memory, same files, same PID. (clone3 returns ENOSYS under Docker’s seccomp profile, so glibc falls back to clone.)', 'lam')}` },

  { t: 'Speedup, core by core', giua: true, body: two(
    speedChart([
      { name: 'work queue', color: GR, pts: queue },
      { name: 'fixed blocks', color: OR, pts: block, dy: 18 },
      { name: 'fork', color: BL, pts: fork, label: false },
    ], { w: 620, h: 430 }),
    `<table class="t" style="font-size:20px">
<tr><th>cores</th><th>block</th><th>queue</th><th>fork</th></tr>
${queue.map((q, i) => `<tr><td>${q.k}</td><td>${block[i].ms} ms</td><td><b>${q.ms} ms</b></td><td>${fork[i].ms} ms</td></tr>`).join('')}
</table>
<p class="nho" style="margin:0">best of 3 runs each, taskset -c 0..k-1</p>`, 'r64') },

  { t: 'Why not 10× on 10 cores?', to: true, giua: true, body: `
<ul>
<li><b>Imbalance</b>: fixed blocks reach only ${last(block).s}× — the slowest block decides (queue: ${last(queue).s}×)</li>
<li><b>Unequal cores</b>: this Mac is an M1 Max with <b>8 performance + 2 efficiency</b> cores — the 9th and 10th are slower</li>
<li><b>Neighbours</b>: the machine is shared; other work steals cycles (that is why we keep the best of 3)</li>
<li><b>Serial parts</b>: starting threads, joining, adding up — Amdahl’s law, lesson 4.5</li>
</ul>` },

  { t: 'Processes or threads?', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th></th><th>fork (processes)</th><th>pthreads (threads)</th></tr>
<tr><td>Memory</td><td>a copy each (copy-on-write)</td><td>shared — one heap</td></tr>
<tr><td>Results back</td><td>pipe, file, shared memory</td><td>just write a variable (carefully)</td></tr>
<tr><td>One worker crashes</td><td>only that child dies</td><td>the whole process dies</td></tr>
<tr><td>Races</td><td>rare — nothing shared by default</td><td>everywhere shared data is written</td></tr>
<tr><td>Who uses it</td><td>nginx workers, PostgreSQL backends, Node cluster</td><td>JVM, Tomcat, Go runtime, libuv pool</td></tr>
</table>
${box('Speed is not the difference here', `fork used the same fixed blocks as way 2 and got the same curve (${last(fork).s}× vs ${last(block).s}× on 10 cores); the queue got ${last(queue).s}× because of the split, not because of threads. Choose processes or threads by isolation and by how results come back.`, 'xanh')}` },

  { t: 'Write it yourself: a Mandelbrot strip', giua: true, body: two(
    term(g('./mandel static 4 ascii').split('\n').slice(3, 23).join('\n')),
    `${busyBars(mb('./mandel static 4'), RD, 'static rows: busy time', 420)}
${busyBars(mb('./mandel dynamic 4'), GR, 'dynamic rows: busy time', 420)}`, 'r64') },

  { t: 'Mandelbrot: the split decides everything', to: true, giua: true, body: `
<ul>
<li>Rows through the black body run all <b>2 000</b> iterations per pixel; edge rows escape at once</li>
<li>Static split: threads 1 and 2 got the body — <b>${g('./mandel static 4 ascii').match(/static\s+T=4.*?(\d+) ms/)[1]} ms</b>, while 0 and 3 idled after ~90 ms</li>
<li>Dynamic split (<code class="i">atomic_fetch_add</code> on a row counter): <b>${g('./mandel dynamic 4').match(/(\d+) ms\s*$/m)[1]} ms</b>, all four busy to the end</li>
<li>Same checksum both ways — the split changed the time, not the answer</li>
</ul>` },

  { t: 'Cheat sheet — parallel C', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:40%">You want to…</th><th>Use</th></tr>
<tr><td>Run work in a separate process</td><td><code class="i">fork()</code> · <code class="i">_exit()</code> · <code class="i">wait()</code> / <code class="i">waitpid()</code></td></tr>
<tr><td>Send a result back from a child</td><td><code class="i">pipe()</code> + <code class="i">write</code>/<code class="i">read</code></td></tr>
<tr><td>Start / finish a thread</td><td><code class="i">pthread_create</code> · <code class="i">pthread_join</code> · compile with <code class="i">-pthread</code></td></tr>
<tr><td>Share a work queue</td><td>a counter under <code class="i">pthread_mutex_lock</code>, or <code class="i">atomic_fetch_add</code></td></tr>
<tr><td>Measure on k cores</td><td><code class="i">taskset -c 0-$((k-1)) ./prog</code>, best of 3</td></tr>
</table>
${box('Rule of thumb', 'Split into many small pieces and let free workers pull the next one. Equal-sized blocks are only fair when every item costs the same.', 'xanh')}` },
]);
