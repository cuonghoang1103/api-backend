/**
 * os-16-1 — khoá "Operating Systems for Developers", bài 16.1 "Review sheet (1/2)" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out (các chương trước) qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-16-1.mjs.
 */
import { lamDeck, sh, box, cards, steps, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-16-1', code: 'OS 16.1', title: 'Review sheet (1/2): processes to memory', sub: 'Operating Systems · Chapter 16 — Exams & interviews' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 16 — Exams & interviews', bai: '16.1',
}, [
  { cover: true, t: 'Review sheet (1/2):<br>processes to memory', sub: 'Five topics, one page each — the idea, the number you measured, the exam trap' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Processes · threads and scheduling · synchronization · deadlock · memory</li>
<li>For each: <b>one-sentence definitions</b> you can recite</li>
<li><b>Your own measurements</b>, re-read from the lab output</li>
<li>The <b>OSG202 exam traps</b> and the interview angle</li>
<li>Where to go back when a line feels unfamiliar</li>
</ul>` },

  { t: 'How to use the sheet: cover, say, check', giua: true, to: true, body: steps([
    'Read a topic, <b>cover the right-hand columns</b>',
    'Say the one-sentence definition <b>out loud</b>',
    'Quote <b>one measured number</b> with its unit',
    'Check, mark misses, open the lesson link',
  ]) + box('', 'Textbook words for OSG202, measured numbers for interviews — keep both.', 'lam') },

  { t: 'Processes: creating work has a price', giua: true, body: term(grab('c12-fork', 'gcc -O2 spawncost.c'), 20) +
    cards([['fork + exec + wait', '302.6 µs — a new program'], ['posix_spawn', '266.1 µs — no page-table copy'], ['pthread_create', '56.9 µs — shares the address space']], 3) },

  { t: 'Exit codes are 128 + the signal number', giua: true, to: true, body: bang(['Exit code', 'Signal', 'Typical cause'], [
    ['130', 'SIGINT (2)', 'Ctrl-C'], ['137', 'SIGKILL (9)', 'OOM killer, docker stop after the grace period'],
    ['139', 'SIGSEGV (11)', 'bad pointer, stack overflow'], ['143', 'SIGTERM (15)', 'polite stop not handled'],
  ], 24) + box('', 'Zombie = exited, not reaped (<code class="i">Z</code>); orphan = parent died, init adopts it.', 'lam') },

  { t: 'Scheduling: every policy trades something', giua: true, body: bang(['Policy', 'Picks', 'Good at', 'Bad at'], [
    ['FCFS', 'arrival order', 'simple, fair order', 'convoy effect'],
    ['SJF / SRTF', 'shortest (remaining) job', 'lowest average waiting', 'needs burst lengths, starvation'],
    ['Round robin', 'next in queue, time slices', 'response time', 'switch overhead if quantum tiny'],
    ['Priority', 'highest priority', 'urgent work first', 'starvation without aging'],
    ['CFS / EEVDF', 'least virtual runtime', 'fairness by weight (nice)', 'not real-time'],
  ], 20) },

  { t: 'A context switch costs about a microsecond', giua: true, body: term(grab('c33-cs', 'taskset -c 0 ./pingpong 200000', 2), 17) +
    box('', 'One core: ~1 µs per switch. Two cores: 23 µs per round trip — wake-ups cross cores. Cheap once, expensive by the million.', 'lam') },

  { t: 'Synchronization: counter++ is three instructions', giua: true, body: term(grab('c51-race', './race 1 1000000', 3, { max: 6 }), 18) +
    box('', 'Load, add, store — two threads interleave and one update vanishes. Fix: mutex, atomic, or do not share.', 'do2') },

  { t: 'Deadlock needs all four conditions — break one', giua: true, body: cards([
    ['Mutual exclusion', 'one holder at a time'], ['Hold and wait', 'keep one, ask for another'],
    ['No preemption', 'nobody can take it away'], ['Circular wait', 'A waits for B waits for A'],
  ], 2) + box('', 'Prevent (lock order) · avoid (Banker) · detect and recover (PostgreSQL aborts one). Unsafe ≠ deadlocked.', 'lam') },

  { t: 'Memory: one page fault per 4 KiB touched', giua: true, body: term(grab('c73-fault', '/usr/bin/time -v ./touch 256 nohuge'), 15) +
    box('', '256 MiB / 4 KiB = 65,536 pages ⇒ 65,539 faults, nearly all minor (no disk). Demand paging is not free.', 'lam') },

  { t: 'Exit 137: the OOM killer’s signature', giua: true, body: term(grab('c14-oom', 'docker run --name os-oom', 3), 18) +
    box('', 'memory.max reached ⇒ reclaim fails ⇒ SIGKILL ⇒ 137 and OOMKilled true.', 'do2') },

  { t: 'Exam traps worth one mark each', to: true, giua: true, body: `
<ul>
<li><code class="i">fork(); fork(); fork();</code> ⇒ 8 processes in total, 7 new</li>
<li>SJF optimal for <b>average waiting</b> — only if all jobs are known</li>
<li>Binary semaphore ≈ mutex, but has <b>no owner</b></li>
<li>Banker is <b>avoidance</b>, not prevention; unsafe ≠ deadlocked</li>
<li>FIFO can get worse with more frames (Belady); LRU/OPT cannot</li>
</ul>` },

  { t: 'Pitfall: a definition without a number', giua: true, to: true, body: vsd(
    '"Context switches are expensive." "fork is slow." "Page faults hurt."',
    '"About 1 µs per switch on one core, 23 µs across cores in my lab — it matters at 10⁵ per second, not at 100."') },

  { t: 'Practice: one page you can recite', giua: true, to: true, body: `
<ol>
<li>Write the definitions of all five topics from memory</li>
<li>One measured number per topic, with its command</li>
<li>Rerun <code class="i">./spawncost</code> and <code class="i">./race 2 1000000</code></li>
<li>Re-read the lesson behind every miss</li>
</ol>` + box('Done when', 'five topics aloud in under five minutes, each with one measured number.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Processes: fork+exec 302.6 µs, threads 56.9 µs; exit = 128 + N</li>
<li>Scheduling trades waiting, response and fairness; a switch ≈ 1 µs</li>
<li>counter++ lost 44 % with two threads — lock, atomic, or don’t share</li>
<li>Deadlock: four conditions; lock order breaks circular wait</li>
<li>Memory: 65,539 faults for 256 MiB; 137 = OOM killer</li>
</ul>` },
]);
