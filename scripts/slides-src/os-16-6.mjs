/**
 * os-16-6 — khoá "Operating Systems for Developers", bài 16.6 "Interview track (1/2)" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out (các chương trước) qua grab().
 * Giảng: content/courses/operating-systems-for-developers/giang/os-16-6.mjs.
 */
import { lamDeck, sh, box, cards, steps, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-16-6', code: 'OS 16.6', title: 'Interview track (1/2): processes to memory', sub: 'Operating Systems · Chapter 16 — Exams & interviews' };

const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.4">`);
const qa = (q, a) => box(q, a, 'lam');

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 16 — Exams & interviews', bai: '16.6',
}, [
  { cover: true, t: 'Interview track (1/2):<br>processes to memory', sub: 'Twenty classic questions — answered with a mechanism, a measured number and a trade-off' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A <b>four-beat</b> structure that fits any OS question in two minutes</li>
<li>20 questions: processes, the kernel boundary, threads, scheduling, locks, memory</li>
<li>Model answers built on <b>your own measurements</b></li>
<li>The <b>follow-up</b> a good interviewer asks next</li>
</ul>` },

  { t: 'Four beats, two minutes', giua: true, to: true, body: steps([
    '<b>Define</b> in one plain sentence',
    '<b>Mechanism</b>: what the kernel actually does',
    '<b>Number</b>: one measurement, with its unit',
    '<b>Trade-off</b> for a real system — then stop',
  ]) + box('', 'Say it out loud before you open the model answer.', 'lam') },

  { t: 'Q3 — "My container exits with 137. Why?"', giua: true, body: term(grab('c14-oom', 'docker run --name os-oom', 3), 18) +
    qa('Model answer', '137 = 128 + SIGKILL. Usually the OOM killer: the cgroup hit memory.max. Check OOMKilled, docker events, dmesg.') },

  { t: 'Q1–Q2 — process vs thread, and what fork costs', giua: true, body: term(grab('c12-fork', 'gcc -O2 spawncost.c'), 19) +
    qa('Model answer', 'A process owns resources; a thread shares them. fork copies page tables (copy-on-write), so it costs more: 302.6 µs with exec vs 56.9 µs for a thread.') },

  { t: 'Q4–Q5 — zombies, orphans and PID 1', giua: true, to: true, body: cards([
    ['Zombie', 'exited, not yet waited for; holds a PID'], ['Orphan', 'parent died; re-parented to init, which reaps it'],
    ['PID 1', 'no default signal actions; must reap'], ['Fix', 'handle SIGTERM, or run with --init (tini)'],
  ], 2) + box('Follow-up', 'Why does <code class="i">CMD npm start</code> make it worse? — sh is PID 1 and does not forward SIGTERM.', '') },

  { t: 'Q6–Q7 — the kernel boundary and context switches', giua: true, body: term(grab('c33-cs', 'taskset -c 0 ./pingpong 200000', 2), 16) +
    qa('Model answer', 'A syscall ≈ 176 ns vs 2 ns for a call; a switch ≈ 1 µs on one core, 23 µs per round trip across cores. It matters at 10⁵ per second.') },

  { t: 'Q8–Q11 — scheduling, load, event loops, pool size', giua: true, to: true, body: cards([
    ['Q8 nice', 'only under contention: 0.99 s vs 3.01 s on one core'], ['Q9 load 8 / 4 cores', 'counts D state too — check %wa'],
    ['Q10 Node', 'epoll + small pool; a 1.5 s CPU job made /fast take 1.39 s'], ['Q11 pool size', 'CPU: ≈ cores · waiting: Little’s law, then cap the queue'],
  ], 2) },

  { t: 'Q12 — show me a race condition', giua: true, body: term(grab('c51-race', './race 2 1000000'), 20) +
    qa('Model answer', 'counter++ is load–add–store: 44 % of updates lost. In a backend: two requests book one seat — fix with a unique constraint or SELECT … FOR UPDATE.') },

  { t: 'Q13–Q15 — locks and deadlock, code and PostgreSQL', giua: true, to: true, body: cards([
    ['Mutex', 'one owner, sleeps (futex)'], ['Spinlock', 'busy-waits; tiny sections'], ['Semaphore', 'counter of permits, no owner'],
    ['Deadlock', 'four Coffman conditions'], ['Prevent', 'one lock order + timeouts'], ['PostgreSQL', 'detects, aborts one: 40P01 — retry'],
  ], 3) },

  { t: 'Q16–Q18 — virtual memory, page faults, malloc', giua: true, body: term(grab('c73-fault', '/usr/bin/time -v ./touch 256 nohuge'), 15) +
    qa('Model answer', 'Pages appear on first touch: 65,539 faults for 256 MiB, all minor. malloc usually makes no syscall; large requests use mmap; overcommit pays later.') },

  { t: 'Q19–Q20 — "free is near zero" and the OOM killer', giua: true, to: true, body: cards([
    ['free vs available', 'idle RAM is page cache; "available" is the real number'], ['oom_score', 'mostly memory use, biased by oom_score_adj'],
    ['protect a DB', 'oom_score_adj −1000, its own limit'], ['in a cgroup', 'only processes of the cgroup over memory.max'],
  ], 2) },

  { t: 'Pitfall: answering the question you memorised', giua: true, to: true, body: vsd(
    '"What happens when you call malloc?" ⇒ a five-minute lecture on virtual memory.',
    '"Usually no system call" first — then brk/mmap, then lazy pages. Answer the noun asked, then widen.') },

  { t: 'Practice: five questions, recorded', giua: true, to: true, body: `
<ol>
<li>Pick five questions at random; answer aloud in four beats</li>
<li>Record; keep each under two minutes</li>
<li>Compare with the model answers: mechanism? number? trade-off?</li>
<li>Rerun every number you missed in the lab</li>
</ol>` + box('Done when', 'five answers with a mechanism, a number and a trade-off; three follow-ups answered cold.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Define · mechanism · number · trade-off — then stop</li>
<li>137 = SIGKILL, usually the OOM killer; zombies hold PIDs</li>
<li>Syscall 176 ns, switch ~1 µs, thread 57 µs, fork+exec 303 µs</li>
<li>Races lose updates; one lock order prevents deadlock</li>
<li>Pages arrive on first touch; "available", not "free"</li>
</ul>` },
]);
