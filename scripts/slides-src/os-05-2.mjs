/**
 * os-05-2 — khoá "Operating Systems for Developers", bài 5.2 "Mutexes, spinlocks and condition variables" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c52-mutex.out.txt (chạy thật trong ảnh os-lab) qua grab();
 * biểu đồ cột cũng lấy số từ chính output đó. Nhúng vào bài bằng giang/os-05-2.mjs.
 */
import { lamDeck, sql, sh, two as two0, box, cards, vsd, flow } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-05-2', code: 'OS 5.2', title: 'Mutexes, spinlocks and condition variables', sub: 'Operating Systems · Chapter 5' };

const g = (pre, n = 1) => grab('c52-mutex', pre, n);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const big = (t, o = {}) => sh(t, { ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e';

/* Biểu đồ ns/increment với 4 luồng — số đọc từ output thật */
const bars = () => {
  const rows = g('for m in none mutex spin atomic local; do ./lockcost $m 4 ').split('\n').slice(1)
    .map((l) => { const m = l.match(/^(\w+)\s.*?(correct|WRONG)\s+([\d.]+) ms\s+([\d.]+) ns/); return m && { mode: m[1], ok: m[2] === 'correct', ms: +m[3], ns: +m[4] }; })
    .filter(Boolean);
  if (rows.length !== 5) throw new Error('os-05-2: không đọc được 5 dòng lockcost 4 luồng');
  const max = Math.max(...rows.map((r) => r.ns)), X = 150, Wd = 760;
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">`;
  rows.forEach((r, i) => {
    const y = 14 + i * 62, w = Math.max(4, (r.ns / max) * Wd), c = !r.ok ? RD : r.mode === 'local' ? GR : r.mode === 'spin' ? OR : BL;
    s += T(X - 14, y + 34, r.mode, 22, { a: 'end', w: 700, m: 1 });
    s += `<rect x="${X}" y="${y + 8}" width="${w}" height="40" rx="6" fill="${c}"/>`;
    s += T(X + w + 12, y + 35, `${r.ns} ns/increment${r.ok ? '' : ' — WRONG answer'}`, 20, { f: c, w: 700 });
  });
  return s + T(X, 326, '4 threads × 2,500,000 increments each — bars from the real run', 17, { f: '#777' }) + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 5 — Synchronization', bai: '5.2',
}, [
  { cover: true, t: 'Mutexes, spinlocks<br>and condition variables', sub: 'Fixing the race — and measuring<br>what each fix costs' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Five ways to protect <code class="i">counter++</code>, timed side by side</li>
<li>Why <b>contention</b>, not the lock, is the expensive part</li>
<li><b>futex</b>: a mutex that only calls the kernel when it must</li>
<li>Why a <b>spinlock</b> burns a minute of CPU when threads outnumber cores</li>
<li><b>Condition variables</b> and producer–consumer — and why you wait in a <code class="i">while</code></li>
</ul>` },

  { t: 'One job, five ways to protect it', giua: true, body: two(
    sql(`// mutex: sleep if someone holds it
pthread_mutex_lock(&mu);
counter++;
pthread_mutex_unlock(&mu);

// spin: same, but loop on the core
pthread_spin_lock(&sp); /* ... */

// atomic: one indivisible instruction
atomic_fetch_add(&acounter, 1);

// local: count privately, lock ONCE
mine++;  /* ...then: */  counter += mine;`, { lang: 'c' }),
    `<ul style="font-size:22px">
<li><b>none</b> — the race from 5.1</li>
<li><b>mutex</b> — <code class="i">pthread_mutex_lock</code></li>
<li><b>spin</b> — <code class="i">pthread_spin_lock</code>, busy-waits</li>
<li><b>atomic</b> — hardware add (lesson 5.3)</li>
<li><b>local</b> — don’t share until the end</li>
</ul>`) },

  { t: 'Alone, a mutex costs about 11 ns', giua: true, body: `
${big(g('for m in none mutex spin atomic local; do ./lockcost $m 1 '))}
${box('One thread = no contention', 'This is the bare price of each mechanism: a lock/unlock pair is a couple of atomic instructions — tiny next to real work like a DB query (milliseconds).', 'lam')}` },

  { t: 'With four threads, the locked counter gets slower', giua: true, body: `
${big(g('for m in none mutex spin atomic local; do ./lockcost $m 4 '))}
${box('Read it', '<b>none</b> is fast and WRONG. <b>mutex</b> with 4 threads is slower than 1 thread alone. <b>local</b> is correct and as fast as the broken version.', 'do2')}` },

  { t: 'Sharing is the expensive part, not the lock', giua: true, body: `
${bars()}
<p style="margin:0;font-size:21px">Every locked or atomic increment moves the same <b>cache line</b> between cores. Give each thread its own data and merge once.</p>` },

  { t: 'futex: the kernel is called only under contention', giua: true, body: `
${big(g('strace -f -c -e trace=futex ./lockcost mutex 1 '))}
${big(g('strace -f -c -e trace=futex ./lockcost mutex 4 '))}
<ul style="font-size:22px">
<li>1 thread, 1,000,000 lock/unlock pairs → <b>1</b> futex call (that one is <code class="i">pthread_join</code>)</li>
<li>4 threads, 10,000,000 pairs → a few thousand calls: <b>under 0.1%</b> entered the kernel</li>
</ul>` },

  { t: 'How a futex mutex works', giua: true, body: `
${flow([
    { t: 'T1: lock()', s: 'CAS 0 → 1 in user space' },
    { t: 'T2: lock()', s: 'CAS fails ⇒ futex(WAIT)', mau: '#c0392b' },
    { t: 'T1: unlock()', s: 'sleeper? ⇒ futex(WAKE)', mau: '#e08a1e' },
    { t: 'T2 wakes', s: 'CAS succeeds, enters', mau: '#2f7d4f' },
  ], { fs: 22, h: 170 })}
${cards([
    ['Fast path', 'Uncontended lock and unlock are atomic instructions — no mode switch (Chapter 1: a syscall ≈ 100× a call).'],
    ['Slow path', 'Only a thread that finds the lock taken asks the kernel to put it to sleep on that address.'],
    ['Everywhere', 'pthread mutex, Java synchronized/ReentrantLock and Go sync.Mutex all sit on futex on Linux.'],
  ])}` },

  { t: '32 threads on 10 cores: the spinlock collapses', giua: true, body: `
${big(g('/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./lockcost mutex 32'))}
${big(g('/usr/bin/time -f "%e s wall, %U s user + %S s kernel CPU" ./lockcost spin 32'))}
${box('Why', 'With more threads than cores the lock holder is often <b>descheduled</b>. Spinners burn their whole time slice waiting for a thread that is not even running — 66.7 s of CPU. Mutex waiters sleep (that is the kernel CPU) and let the holder run.', 'do2')}` },

  { t: '“Spinlocks are faster: no syscall”', giua: true, body: vsd(
    `<ul style="font-size:22px"><li>Swap the mutex for a spinlock “to avoid syscalls”</li><li>Run it with a thread pool bigger than the core count</li><li>CPU at 100%, throughput down</li></ul>`,
    `<ul style="font-size:22px"><li>Spin only for a few instructions <b>and</b> one core per waiter — true inside the kernel, rarely in apps</li><li>In user space use a <b>mutex</b>: glibc and the JVM already spin briefly, then sleep</li></ul>`,
    '✗ The myth', '✓ The rule') },

  { t: 'Java: synchronized and ReentrantLock', giua: true, body: two(
    big(g('java Locks.java')),
    `${cards([
      ['synchronized', 'Built in, simple, released automatically when the block exits.'],
      ['ReentrantLock', 'Adds tryLock with timeout, interruptible waits, optional fairness, several conditions. Unlock in <code class="i">finally</code>.'],
    ], 1)}
<p style="margin:0;font-size:19px">Both exact; the 5× gap is this JVM and this benchmark — measure your own load.</p>`) },

  { t: 'Condition variable: sleep until there is work', giua: true, body: two(
    sql(`pthread_mutex_lock(&mu);
while (count == 0)                  // re-check!
    pthread_cond_wait(&not_empty, &mu);
item = buf[head]; count--;          // take
pthread_cond_signal(&not_full);
pthread_mutex_unlock(&mu);`, { lang: 'c' }),
    `<ul style="font-size:22px">
<li><code class="i">cond_wait</code> <b>releases the mutex and sleeps</b> in one atomic step</li>
<li>On wake-up it re-acquires the mutex before returning</li>
<li>Producer–consumer: 2 producers, 4 consumers, a 4-slot ring buffer</li>
<li>The same pattern runs every job queue: <code class="i">ArrayBlockingQueue</code>, Tomcat’s pool, libuv’s pool</li>
</ul>`) },

  { t: 'Wait with while, never with if', giua: true, body: `
${big(g('./pc while'))}
${big(g('./pc if', 2))}
${box('Why if fails', 'One broadcast wakes all sleeping consumers; the first takes the item, the others wake to an <b>empty</b> buffer. POSIX also allows spurious wakeups. Real code with <code>if</code> would read an empty slot and hand out garbage.', 'do2')}` },

  { t: 'Cheat sheet — choosing a lock', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:40%">Situation</th><th>Use</th></tr>
<tr><td>Short critical section in an app</td><td><b>mutex</b> / <code class="i">synchronized</code></td></tr>
<tr><td>Need timeout, tryLock, fairness</td><td><code class="i">ReentrantLock</code></td></tr>
<tr><td>Hot counter / metrics</td><td>per-thread data, merge once (or atomics, 5.3)</td></tr>
<tr><td>Wait until a state changes</td><td>condition variable, in a <b>while</b> loop</td></tr>
<tr><td>Kernel code, a few instructions</td><td>spinlock (not in your app)</td></tr>
<tr><td>Check if a lock calls the kernel</td><td><code class="i">strace -f -c -e trace=futex ./prog</code></td></tr>
</table>
${box('Next', 'Lesson 5.3 — semaphores, read-write locks, atomics/CAS and memory visibility.', 'lam')}` },
]);
