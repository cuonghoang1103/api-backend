/** Web Foundations · deck bài 5.2 — Promise. Output thật: _demo/5-2 (Chromium). */
import { deckWf, js, con, box, two, tbl, steps } from './_wf-bai.mjs';

export const deck = { key: 'wf-5-2', code: 'WF 5.2', title: 'Promises', sub: 'Web Foundations · Chapter 5' };

export const slides = deckWf({ chuong: 'Chapter 5 — Asynchronous JavaScript', bai: '5.2' }, [
  { cover: true, t: 'Promises', sub: 'A placeholder for a value that is not ready yet' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Create a promise and use <b>then, catch, finally</b></li>
    <li><b>Chain</b> steps without breaking the chain</li>
    <li>Handle errors <b>in one place</b></li>
    <li>Run work <b>in parallel</b>: all, allSettled, race, any</li>
    <li>Wrap an old <b>callback API</b></li></ul>` },

  { t: 'Three states', giua: true, body: `${js('5-2/tao-promise.js', null, { gon: true })}
    ${two(con('5-2/tao-promise'), steps(['<b>pending</b> — working', '<b>fulfilled</b> — resolve(value)', '<b>rejected</b> — reject(error)']))}` },

  { t: 'Chaining', giua: true, body: `${js('5-2/chuoi.js', null, { gon: true })}
    ${two(con('5-2/chuoi'), box('Forgot return', 'C received <b>undefined</b> before B finished. Inside <code class="i">then</code>, always return the promise you start.', 'bad'))}` },

  { t: 'Errors flow to catch', giua: true, body: `${js('5-2/loi.js', null, { gon: true })}
    ${two(con('5-2/loi'), box('One catch at the end', 'An error at any step skips to it. What catch returns continues the chain. No catch ⇒ unhandled rejection (and in Node.js, a crash).', 'info'))}` },

  { t: 'Combining promises', giua: true, body: `${con('5-2/ket-hop', null, { title: 'started together; timings rounded to 50 ms' })}
    ${tbl(['Method', 'Waits for', 'Rejects'], [['all', 'all to fulfil', 'at the first failure'], ['allSettled', 'all to settle', 'never'], ['race', 'the first to settle', 'if that one fails'], ['any', 'the first success', 'only if all fail']])}` },

  { t: 'Wrapping a callback API', giua: true, body: `${js('5-2/boc-callback.js', null, { gon: true, chi: [2, 9] })}
    ${two(con('5-2/boc-callback'), box('Once wrapped', 'You can chain it, combine it with <code class="i">Promise.all</code>, and <code class="i">await</code> it. Node.js: <code class="i">util.promisify</code>.', 'ok'))}` },

  { t: 'Where promises meet the event loop', to: true, giua: true, body: tbl(['Layer', 'What happens'], [
      ['your code', 'then() only registers a callback'],
      ['microtask queue', 'promise callbacks — before any timer'],
      ['task queue', 'the work that eventually settles the promise'],
    ]) + box('Never synchronous', 'Even <code class="i">Promise.resolve(5).then(…)</code> runs after the current code. That is what makes the order predictable.', 'info') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>pending → settles once</li>
    <li>Return inside then</li>
    <li>Always a catch</li>
    <li>Parallel = slowest, not sum</li></ul>`,
    box('Practice (30 min)', 'A dashboard loader from fake requests: a chain, a recovered failure, three in parallel, a timeout.<br><br><b>Done when</b>: the parallel step takes ~300 ms (not 600) and reports <code class="i">fulfilled, fulfilled, rejected</code>.', 'ok')) },
]);
