/**
 * node-02-2 — Node.js · Chapter 2 · Lesson 2.2 "The event loop, phase by phase" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s02-runtime.mjs › nodejs-2-2-event-loop. Mã + output THẬT Node 22.23.3 (src/khung/node/that/c2).
 * Bổ sung so với bài web: đếm thật 300 lần setTimeout vs setImmediate, setTimeout 0 thật ra là 1 ms, ⭐ bẫy tệp .mjs đảo thứ tự nextTick/Promise.
 */
import { lamDeck, two, box, kw, vsd, bang, ma, ra, js, term, runJs } from './_node-chung.mjs';
import { readFileSync } from 'node:fs';

export const deck = { key: 'node-02-2', code: 'NODE 2.2', title: 'The event loop, phase by phase', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', TIM = '#0284c7', POLL = '#0f766e', CHECK = '#ea580c', XAM = '#94a3b8', TICK = '#db2777', MICRO = '#7c3aed';

/* Vòng 6 pha (SVG): trạm = vòng tròn đánh số (bảng/lời bên cạnh giải nghĩa) — tên ngắn ngoài vòng, không đè chữ giữa. */
const vong = (w = 520, h = 400) => {
  const cx = w / 2, cy = h / 2, rx = w / 2 - 92, ry = h / 2 - 54;   // rx chừa 92 px mỗi bên cho nhãn close/idle đứng NGOÀI vòng, cỡ SVG không đổi nên toạ độ phần tử quanh hình không lệch
  const P = [['timers', TIM], ['pending', XAM], ['idle', XAM], ['poll', POLL], ['check', CHECK], ['close', XAM]];
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#f0fdf4" stroke="#4ade80" stroke-width="9"/>`;
  s += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="26" font-weight="800" fill="#14532d">event loop</text><text x="${cx}" y="${cy + 24}" text-anchor="middle" font-size="19" fill="#555">one JS thread</text>`;
  P.forEach(([t, m], i) => { const a = (-115 + i * 60) * Math.PI / 180, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
    /* Trạm 3 (idle) và 6 (close) nằm ngay hai bên vòng: nhãn dời ra ngang ngoài vòng, các trạm còn lại nhãn trên/dưới. */
    const ben = i === 2 ? 1 : i === 5 ? -1 : 0, lx = x + ben * 30, ly = ben ? y + 7 : y < cy ? y - 30 : y + 42, neo = ben > 0 ? 'start' : ben < 0 ? 'end' : 'middle';
    s += `<circle data-k="pha" cx="${x}" cy="${y}" r="22" fill="${m}"/><text x="${x}" y="${y + 8}" text-anchor="middle" font-size="23" font-weight="800" fill="#fff">${i + 1}</text><text x="${lx}" y="${ly}" text-anchor="${neo}" font-size="20" font-weight="800" fill="${m}" stroke="#fff" stroke-width="6" paint-order="stroke">${t}</text>`; });
  return s + '</svg>';
};
/* Đếm thật từ tệp output. */
const dem = (ten, a) => readFileSync(new URL(`file:///Users/admin/Documents/video-bai-giang/src/khung/node/that/${ten}.out.txt`, import.meta.url), 'utf8').trim().split('\n').filter((l) => l.startsWith(a)).length;
const raceI = dem('c2/race', 'immediate'), raceT = dem('c2/race', 'timeout'), ioI = dem('c2/race-io', 'immediate'), ioT = dem('c2/race-io', 'timeout');

export const slides = lamDeck({ chuong: 'Chapter 2 — Inside the Node.js Runtime', bai: '2.2' }, [
  { cover: true, t: 'The event loop,<br>phase by phase', sub: 'Why lines do not print in the order you wrote them.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The event loop is a <b>loop</b>: what it does on each turn</li>
<li>The <b>six phases</b>, in their fixed order</li>
<li>Two queues that <b>cut in line</b>: nextTick and microtasks</li>
<li>Why <code class="i">setTimeout(0)</code> vs <code class="i">setImmediate</code> cannot be predicted</li>
<li>Why a timer is never exact, and how to get a safe order</li>
</ul>` },

  { t: 'Picture one clerk and six counters', giua: true, body: two(`
<ul>
<li>A post office with <b>one clerk</b> and six counters</li>
<li>The clerk walks them <b>in the same order</b>, again and again</li>
<li>Work at a counter? Do it, then move on</li>
<li>Nothing to do? <b>Wait</b> at the mail counter</li>
<li>No work left anywhere? Close the shop</li>
</ul>`, vong(520, 380)) + box('Mapping', 'Clerk = the single JS thread. Counters = phases. Closing the shop = the process exits.', 'xanh') },

  { t: 'What the event loop really is', giua: true, body: two(js(`// Simplified: Node does this for you
while (workIsLeft()) {
  runExpiredTimers();     // timers
  runPendingCallbacks();  // pending
  internalPrepare();      // idle / prepare
  pollForIO();            // poll: may wait here
  runSetImmediate();      // check
  runCloseCallbacks();    // close
}
// nothing left: the process exits`), `
${box('In one line', 'A <code class="i">while</code> loop that never stops: "Is anything done? Run its callback. If not, wait."', 'xanh')}
${box('Term', `${kw('callback', 'a function you hand over, to be called later')}`, 'lam')}
${box('When does it stop?', 'No timers, no sockets, no pending work: the process exits by itself.', '')}`, 'r64') },

  { t: 'The six phases, in order', giua: true, body: two(vong(450, 400), `<table class="t" style="font-size:20px"><tr><th style="width:150px">Phase</th><th>What runs here</th></tr>
<tr><td><b>1 timers</b></td><td>setTimeout, setInterval that are due</td></tr>
<tr><td>2 pending</td><td>some system callbacks deferred from last turn</td></tr>
<tr><td>3 idle/prepare</td><td>internal to Node, you never see it</td></tr>
<tr><td><b>4 poll</b></td><td>the heart: collect I/O events, run them, <b>wait here</b> when idle</td></tr>
<tr><td><b>5 check</b></td><td>setImmediate callbacks</td></tr>
<tr><td>6 close</td><td>clean-up, e.g. socket.on('close')</td></tr></table>`, 'r46') },

  { t: 'Two queues that cut in line', to: true, giua: true, body: `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
${box('process.nextTick queue', 'Runs first. Node\'s own queue.', 'do2')}
${box('Microtask queue', 'Promise.then, await, queueMicrotask.', 'lam')}
</div>
<ul>
<li>They are <b>not</b> phases</li>
<li>Between phases Node <b>empties both</b>: nextTick, then microtasks</li>
<li>That is why <code class="i">await</code> feels instant</li>
</ul>
${box('Order to remember', 'sync code → nextTick → microtasks → next phase', 'xanh')}` },

  { t: 'Prove the order yourself', giua: true, body: `${runJs(ma('c2/order'), ra('c2/order', 1, 6), { hlOut: [5, 6], sm: false })}` },

  { t: 'setTimeout(0) vs setImmediate: not predictable', to: true, giua: true, body: `${js(ma('c2/race'))}
${two(bang(['In the main script', 'Runs'], [['immediate first', raceI], ['timeout first', raceT]], { cap: '300 real runs, Node 22', hl: [1] }), box('Why', `<code class="i">setTimeout(fn, 0)</code> really means <b>1 ms</b>. If the loop reaches the timers phase before 1 ms has passed, the timer waits for the next turn. Startup speed decides.`, ''))}` },

  { t: 'Inside an I/O callback the order is fixed', to: true, giua: true, body: `${js(ma('c2/race-io'))}
${two(bang(['Inside readFile', 'Runs'], [['immediate first', ioI], ['timeout first', ioT]], { cap: '40 real runs, Node 22', hl: [0] }), box('Why', 'The callback runs in the <b>poll</b> phase. The very next phase is <b>check</b>. Timers must wait for the next turn.', 'xanh'))}` },

  { t: 'A timer means "not earlier than"', to: true, giua: true, body: `${runJs(ma('c2/late-timer'), ra('c2/late-timer'), { hl: [7], hlOut: [2], sm: false })}
${box('Rule', 'The JS thread was busy, so the callback had to wait. <b>setTimeout(fn, 100)</b> promises "no earlier than 100 ms", never "exactly".', 'do2')}` },

  { t: 'Never depend on timing. Say the order.', to: true, giua: true, body: vsd(`${js(`setTimeout(saveFile, 0);
setImmediate(sendEmail);
// which one first?
// fine on a laptop,
// breaks under load`, { sm: true })}`, `${js(ma('c2/in-order', 3, 8), { sm: true })}`) + `${term(ra('c2/in-order'))}
${box('Rule', 'If two things must happen in order, write it with <code class="i">await</code>. Do not hope the scheduler agrees.', 'xanh')}` },

  { t: 'Trap: an ES module flips nextTick and Promise', to: true, giua: true, body: two(`<div>${term(ra('c2/order', 1, 6), { title: 'order.js (CommonJS)', hl: [3, 4] })}</div>`, `<div>${term(ra('c2/order-esm'), { title: 'order-esm.mjs (ES module)', hl: [3, 4] })}</div>`) + box('Why', 'An ES module runs <b>inside a promise job</b>. Microtasks drain first, then nextTick. Same code, different file type, different order.', 'do2') + box('From Chapter 5', 'Our Express code uses <code class="i">.mjs</code>. One more reason never to depend on this order.', 'lam') },

  { t: 'Exercise: predict the output', to: true, giua: true, body: two(js(ma('c2/exercise')), `<div data-k="dapan">${term(ra('c2/exercise'), { title: 'real output' })}</div>`, 'r73') + box('Hint', 'Sync first. Then nextTick. Then microtasks. A nextTick added inside a microtask runs when the microtask queue is empty. Timers last.', '') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Which phase runs <code class="i">setImmediate</code>?</li>
<li>Which runs first: <code class="i">nextTick</code> or <code class="i">Promise.then</code> (in a <code class="i">.js</code> CommonJS file)?</li>
<li>What does <code class="i">setTimeout(fn, 100)</code> actually promise?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. check. &nbsp; 2. nextTick. &nbsp; 3. Not earlier than 100 ms.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Event loop = one thread walking <b>six phases</b>, forever</li>
<li>Waits in <b>poll</b>; exits when no work is left</li>
<li>Between phases: empty <b>nextTick</b>, then <b>microtasks</b></li>
<li>Timers: "not earlier than". Order by <b>await</b>, not by timing</li>
</ul>
${box('Next', 'Lesson 2.3 — nextTick, microtasks and starving the loop.', 'lam')}` },
]);
