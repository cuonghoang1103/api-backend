/** Web Foundations · deck bài 5.1 — Event loop. Output thật: _demo/5-1 (Chromium, đếm khung hình bằng requestAnimationFrame). */
import { deckWf, js, con, box, two, tbl, steps } from './_wf-bai.mjs';

export const deck = { key: 'wf-5-1', code: 'WF 5.1', title: 'The event loop', sub: 'Web Foundations · Chapter 5' };

export const slides = deckWf({ chuong: 'Chapter 5 — Asynchronous JavaScript', bai: '5.1' }, [
  { cover: true, t: 'The event loop', sub: 'How JavaScript does one thing at a time — and still never waits' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Explain <b>single-threaded</b></li>
    <li>Predict the order of <b>sync code, promises, timers</b></li>
    <li>Explain why a <b>0 ms timer</b> is not instant</li>
    <li>Recognise code that <b>freezes</b> a page</li>
    <li>Keep a page <b>responsive</b> during heavy work</li></ul>` },

  { t: 'One thread, one call stack', to: true, giua: true, body: tbl(['Part', 'Does'], [
      ['Call stack', 'runs your functions, one at a time, to completion'],
      ['Web APIs (browser)', 'timers, fetch, events — the waiting happens here'],
      ['Microtask queue', 'promise callbacks, await continuations'],
      ['Task queue', 'timers, clicks, network events'],
      ['Event loop', 'when the stack is empty: all microtasks, then one task'],
    ]) + box('How a page waits without freezing', 'It does not wait. The browser does the waiting on its own threads, and queues your callback when the job is done. Your code keeps running.', 'info') },

  { t: 'Predict the order', giua: true, body: two(js('5-1/thu-tu.js', null, { gon: true }), `${con('5-1/thu-tu')}
    ${box('Rule', 'Sync code → <b>all</b> microtasks → <b>one</b> task. A promise callback beats a 0 ms timer.', 'ok')}`, 'r73') },

  { t: 'The loop, step by step', to: true, giua: true, body: steps([
      'Run the current task <b>to completion</b>',
      'Drain <b>every</b> microtask (new ones too)',
      'Maybe <b>repaint</b> the screen',
      'Take the <b>next</b> task, and repeat',
    ]) + two(box('Microtasks', '<code class="i">.then</code> callbacks, code after <code class="i">await</code>, <code class="i">queueMicrotask</code>', 'info'), box('Tasks', '<code class="i">setTimeout</code>, clicks, network events, <code class="i">postMessage</code>', 'info')) },

  { t: 'A timer cannot interrupt', giua: true, body: `${js('5-1/chan.js', null, { gon: true })}
    ${two(con('5-1/chan'), box('A minimum, not a promise', 'Clicks, timers and network callbacks all wait while your code runs.', 'bad'))}` },

  { t: 'Measured: a frozen page', giua: true, body: `${con('5-1/dong-bang', null, { title: 'frames painted in one second (requestAnimationFrame)' })}
    ${two(box('Calm', 'The test machine paints at 120 Hz: 121 frames.', 'ok'), box('Blocked for 800 ms', 'Only 27 frames: nothing moves, clicks wait.', 'bad'))}
    ${box('Rule of thumb', 'Anything over about <b>50 ms</b> on the main thread is a delay users notice. Lesson 14.4 measures it as Total Blocking Time.', 'info')}` },

  { t: 'Keeping the page responsive', giua: true, body: two(js('5-1/chia-nho.js', null, { gon: true, chi: [2, 13] }), `${con('5-1/chia-nho')}
    ${tbl(['Situation', 'Do'], [['waiting for a server', 'await (already async)'], ['long loop', 'chunks + yield'], ['heavy maths', 'Web Worker']])}`, 'r64') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>One stack, run to completion</li>
    <li>Microtasks before tasks</li>
    <li>Timers give a minimum delay</li>
    <li>Long sync work freezes the page</li></ul>`,
    box('Practice (25 min)', 'Predict a mixed script, then unfreeze a “Calculate” button by chunking.<br><br><b>Done when</b>: your prediction is <code class="i">A F C E B D</code> and the counter keeps moving in the chunked version.', 'ok')) },
]);
