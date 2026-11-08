/**
 * node-02-3 — Node.js · Chapter 2 · Lesson 2.3 "nextTick, microtasks and starving the loop" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s02-runtime.mjs › nodejs-2-3-microtask. Mã + output THẬT Node 22.23.3 (src/khung/node/that/c2).
 * Bổ sung so với bài web: việc thêm vào GIỮA lúc xả vẫn chạy trước pha kế (chạy thật), bỏ đói có giới hạn 2 giây đo thật cả nextTick lẫn Promise,
 * cách lịch sự setImmediate đo thật (timer đúng 10 ms) + cái giá số vòng, bài tập đoán thứ tự.
 */
import { lamDeck, two, box, kw, vsd, bang, steps, cards, ma, ra, js, term, runJs, cot } from './_node-chung.mjs';
import { readFileSync } from 'node:fs';

export const deck = { key: 'node-02-3', code: 'NODE 2.3', title: 'nextTick, microtasks and starving the loop', sub: 'Node.js — from zero to production' };
const so = (ten, re) => Number(readFileSync(new URL(`file:///Users/admin/Documents/video-bai-giang/src/khung/node/that/${ten}.out.txt`, import.meta.url), 'utf8').match(re)[1]);
const nTick = so('c2/starve', /after (\d+) turns/), nImm = so('c2/yield-immediate', /after (\d+) turns/);
const tTick = so('c2/starve', /timer \(asked 10 ms\) ran after (\d+)/), tImm = so('c2/yield-immediate', /timer \(asked 10 ms\) ran after (\d+)/);
const fmt = (n) => n.toLocaleString('en-US');

export const slides = lamDeck({ chuong: 'Chapter 2 — Inside the Node.js Runtime', bai: '2.3' }, [
  { cover: true, t: 'nextTick, microtasks<br>and starving the loop', sub: 'Two queues that cut in line, and how they can freeze a server.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>priority order</b>: sync → nextTick → microtasks → next phase</li>
<li>What "drained <b>completely</b>" means, proven by running code</li>
<li>How one recursive nextTick <b>freezes</b> a whole server (measured)</li>
<li><code class="i">nextTick</code>, <code class="i">queueMicrotask</code>, <code class="i">await</code>, <code class="i">setImmediate</code>: which one to use</li>
</ul>` },

  { t: 'The priority order', to: true, giua: true, body: `${steps([
    '<b>Synchronous code</b>: always runs to the end',
    '<b>nextTick queue</b>: drained COMPLETELY',
    '<b>Microtask queue</b> (Promise, await, queueMicrotask): also drained COMPLETELY',
    '<b>Next phase of the loop</b>: timers, poll, check…',
  ])}
${box('The key word: completely', 'Node does not run "a few" and move on. It empties the queue, <b>including jobs added while it is emptying it</b>.', 'do2')}
${kw('microtask', 'a small job that runs right after the current code, before the loop moves on')}` },

  { t: 'Drained completely: prove it', giua: true, body: js(ma('c2/drain-all'), { sm: true }) + two(term(ra('c2/drain-all'), { hl: [2, 4, 5] }),
    box('Read it', 'Job 2 was added <b>during</b> the nextTick drain, job 4 during the microtask drain, job 5 by a microtask. All of them still ran <b>before</b> the 0 ms timer.', 'lam')) },

  { t: 'One million nextTicks before a 0 ms timer', to: true, giua: true, body: `${runJs(ma('c2/million-tick'), ra('c2/million-tick'), { hl: [10], hlOut: [2, 3] })}
${box('What happened', 'The loop never reached the timers phase until the queue was empty. Here it ended after a million turns, so the timer still ran, just late.', 'lam')}` },

  { t: 'Now let it spin: the server freezes', giua: true, body: `${runJs(ma('c2/starve'), ra('c2/starve'), { hl: [10], hlOut: [2, 3] })}
${box('No error, no crash', 'A timer asked for 10 ms waited <b>2 seconds</b>; the file was read long ago, but its callback waited too. Remove the 2 s limit and they wait <b>forever</b> while the CPU burns at 100%.', 'do2')}` },

  { t: 'A promise loop freezes it the same way', to: true, giua: true, body: `${runJs(ma('c2/starve-promise'), ra('c2/starve-promise'), { hl: [8], hlOut: [2], sm: false })}
${box('Same rule', 'A <code class="i">.then()</code> that re-queues itself never lets the microtask queue become empty. The loop cannot move on.', 'do2')}` },

  { t: 'The polite way: setImmediate', giua: true, body: `${two(js(ma('c2/yield-immediate', 7, 13), { hl: [4] }), cot(term(ra('c2/yield-immediate'), { hl: [1, 2] }), box('Same test as before', 'Same 10 ms timer, same readFile. Only the re-queue changed: <b>setImmediate</b> instead of nextTick.', 'lam')), 'r64')}
${bang(['Same 2 s loop, re-queued with', 'Timer asked 10 ms ran after', 'Turns done in 2 s'], [
    ['<code class="i">process.nextTick</code>', `<b style="color:#b0281a">${tTick} ms</b>`, fmt(nTick)],
    ['<code class="i">setImmediate</code>', `<b style="color:#15803d">${tImm} ms</b>`, fmt(nImm)],
  ], { co: 21, hl: [1] })}` },

  { t: 'Which one should you use?', giua: true, body: bang(['Tool', 'Queue', 'Use it when'], [
    ['<code class="i">process.nextTick</code>', 'nextTick (Node only, highest)', 'Rarely. Mostly library authors who must never call a callback synchronously.'],
    ['<code class="i">queueMicrotask</code>', 'microtask (standard)', 'You truly need to defer a little. Prefer it over nextTick.'],
    ['<code class="i">Promise</code> / <code class="i">await</code>', 'microtask', '<b>99% of the time.</b> Your normal async code.'],
    ['<code class="i">setImmediate</code>', 'check phase', 'You want to <b>give the loop a turn</b> so waiting I/O runs first. Chopping heavy work (2.5).'],
  ], { co: 21, hl: [2] }) + box('Same queue', 'queueMicrotask and Promise callbacks share one queue, so they keep their order between them.', 'lam') },

  { t: 'Trap: "use nextTick so it runs sooner"', to: true, giua: true, body: vsd(`${js(`function work() {
  doSlice();
  if (more) process.nextTick(work);
}
// runs BEFORE waiting I/O:
// the requests you serve starve`, { sm: false })}`, `${js(`function work() {
  doSlice();
  if (more) setImmediate(work);
}
// waits its turn:
// I/O and timers run in between`, { sm: false })}`) + box('Rule', 'Running "sooner than the loop" means running before the I/O that is waiting: you starve the very requests you are trying to serve. Reach for <code class="i">setImmediate</code>.', 'xanh') + two(box('Measured in this lesson', `Re-queue with nextTick: a 10 ms timer ran after <b>${tTick} ms</b>. With setImmediate: after <b>${tImm} ms</b>.`, 'lam'), `<div>${kw('starve', 'to make other work wait forever because one job never lets go')}</div>`) },

  { t: 'In real life', to: true, giua: true, body: `
<ul>
<li>You will write <code class="i">await</code> thousands of times</li>
<li>You will almost never write <code class="i">process.nextTick</code></li>
<li>Knowing it helps you <b>read library code</b>…</li>
<li>…and explain why a callback ran "later than you thought"</li>
</ul>
${cards([['await', 'Your daily tool. Microtask queue.'], ['setImmediate', 'Yield to the loop so I/O and timers run.'], ['process.nextTick', 'Library internals. Read it, rarely write it.']])}
${box('Simulation', 'Step through both queues yourself: <b>cuongthai.com/simulation?scenario=nodejs-microtask</b>', 'lam')}` },

  { t: 'Exercise: predict the output', to: true, giua: true, body: two(js(ma('c2/ex-micro'), { sm: false }), `<div data-k="dapan">${term(ra('c2/ex-micro'), { title: 'real output' })}</div>`, 'r64') + box('Hint', 'Sync first. Then empty nextTick, then microtasks, then nextTick again if a microtask added one. setImmediate waits for the check phase.', '') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>A nextTick adds another nextTick while the queue is draining. When does the new one run?</li>
<li>Why can a self-requeuing <code class="i">process.nextTick</code> freeze a server with no error?</li>
<li>You want to split a long loop so requests can still be served. nextTick or setImmediate?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. In the same drain, before any microtask or phase. &nbsp; 2. The queue never empties, so the loop never reaches timers or poll. &nbsp; 3. setImmediate.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Order: <b>sync → nextTick → microtasks → next phase</b></li>
<li>Both queues drain <b>completely</b>, even jobs added meanwhile</li>
<li>A queue that never empties = a frozen server, no error</li>
<li>Use <b>await</b>; to yield, <b>setImmediate</b>; nextTick almost never</li>
</ul>
${box('Next', 'Lesson 2.4 — Blocking the event loop, measured.', 'lam')}` },
]);
