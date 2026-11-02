/** Web Foundations · deck bài 5.3 — async/await. Output thật: _demo/5-3 (Chromium). */
import { deckWf, js, con, box, two, tbl, steps } from './_wf-bai.mjs';

export const deck = { key: 'wf-5-3', code: 'WF 5.3', title: 'async and await', sub: 'Web Foundations · Chapter 5' };

export const slides = deckWf({ chuong: 'Chapter 5 — Asynchronous JavaScript', bai: '5.3' }, [
  { cover: true, t: 'async and await', sub: 'Asynchronous code that reads like a recipe — still promises underneath' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Write <b>async</b> functions and use <b>await</b></li>
    <li>Handle errors with <b>try/catch/finally</b></li>
    <li>Spot a <b>missing await</b> from its symptom</li>
    <li>Choose <b>sequential or parallel</b></li>
    <li>Loop over async work <b>correctly</b></li></ul>` },

  { t: 'The same code, two ways', giua: true, body: `${js('5-3/viet-lai.js', null, { gon: true, chi: [5, 18] })}
    ${two(con('5-3/viet-lai'), box('Always a promise', 'Calling an async function returns a promise <b>immediately</b>; the body runs in the background.', 'info'))}` },

  { t: 'What await does', to: true, giua: true, body: `${steps([
      'Reach <code class="i">await</code>: this function is <b>suspended</b>',
      'The page keeps running: clicks, repaints, other code',
      'The promise settles: the rest is queued as a microtask',
      'Resume with the value — or <b>throw</b> the error here',
    ])}${box('Not a sleep', '<code class="i">await</code> pauses only its own function, never the page.', 'ok')}` },

  { t: 'try, catch and finally', giua: true, body: two(js('5-3/try-catch.js', null, { gon: true, chi: [4, 14] }), `${con('5-3/try-catch')}
    ${box('finally', 'Runs either way: hide the spinner there.', 'ok')}`, 'r64') },

  { t: 'Forgetting await', giua: true, body: two(js('5-3/quen-await.js', null, { gon: true }), `${con('5-3/quen-await')}
    ${box('Symptom', '<b>[object Promise]</b> on the page, or a check that always passes. No error is thrown.', 'bad')}`, 'r64') },

  { t: 'Sequential or parallel?', giua: true, body: `${js('5-3/tuan-tu-song-song.js', null, { gon: true, chi: [4, 16] })}
    ${two(con('5-3/tuan-tu-song-song'), box('Independent? Start together', '<code class="i">await Promise.all([A(), B()])</code> takes as long as the slowest.', 'ok'))}` },

  { t: 'await in loops', giua: true, body: `${js('5-3/vong-lap-await.js', null, { gon: true, chi: [3, 11] })}
    ${two(con('5-3/vong-lap-await'), tbl(['Want', 'Write'], [['one at a time', 'for...of + await'], ['all at once', 'await Promise.all(items.map(…))'], ['never', 'forEach(async …)']]))}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>async returns a promise</li>
    <li>await pauses one function</li>
    <li>try/catch around await</li>
    <li>[object Promise] = missing await</li>
    <li>Parallel when independent</li></ul>`,
    box('Practice (30 min)', 'Rewrite the dashboard loader with await, then make notifications load in parallel.<br><br><b>Done when</b>: ~600 ms becomes ~400 ms, a failing notification gives an empty list, and only the forEach version prints “done” too early.', 'ok')) },
]);
