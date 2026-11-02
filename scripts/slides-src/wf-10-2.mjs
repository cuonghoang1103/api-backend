/** Web Foundations · deck bài 10.2 — Đọc lỗi & gỡ lỗi. Output thật: _demo/_t10/10-2 (Node 22.23, Chromium + CDP, git bisect). */
import { deckWf, js, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const dong = (k, a, b) => OUT[k].split('\n').slice(a, b).join('\n');

export const deck = { key: 'wf-10-2', code: 'WF 10.2', title: 'Reading errors and debugging', sub: 'Web Foundations · Chapter 10' };

export const slides = deckWf({ chuong: 'Chapter 10 — Thinking, debugging, Git', bai: '10.2' }, [
  { cover: true, t: 'Reading errors and debugging', sub: 'An error message is a clue, not an attack' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Read <b>file:line:column</b> and the message</li>
    <li>Follow a <b>stack trace</b></li>
    <li>Recognise <b>six error names</b></li>
    <li>Pause on a <b>breakpoint</b> and read values</li>
    <li>Find the bad commit with <b>git bisect</b></li></ul>` },

  { t: 'A stack trace, read bottom up', giua: true, body: term(null, dong('_t10/out/stack', 0, 10), { title: 'node shop/index.mjs' }) + box("reading 'city'", 'the thing BEFORE .city is undefined → address', 'info') },

  { t: 'Six error names', giua: true, body: term('_t10/out/errors', null, { title: 'node errors.mjs' }) + tbl(['Name', 'Look at'], [['ReferenceError', 'spelling, scope, import'], ['TypeError', 'the thing before the dot'], ['SyntaxError (JSON)', 'the text you parse'], ['RangeError', 'the argument / a recursion']]) },

  { t: 'Async errors arrive later', giua: true, body: term(null, dong('_t10/out/async-error', 0, 9) + '\n' + dong('_t10/out/async-error', 12, 15), { title: 'nobody awaited it' }) + two(box('Always', 'await or .catch()', 'ok'), box('Keep context', 'new Error(msg, { cause })', 'info')) },

  { t: 'Errors in the browser', giua: true, body: term('_t10/out/page-console', null, { title: 'Chromium console after one click' }) + box('5500015000', 'the wrong total threw no error at all', 'bad') },

  { t: 'A real breakpoint', giua: true, body: term('_t10/out/breakpoint', null, { title: 'Sources → line 7 → click' }) + steps(['Reproduce', 'Hypothesis: shipping is a string', 'Test with a breakpoint', 'Fix at the boundary + add a test']) },

  { t: 'Find when it broke: git bisect', giua: true, body: term(null, dong('_t10/out/bisect', 14, 21) + '\n' + dong('_t10/out/bisect', -4, undefined), { title: 'git bisect run node test.js' }) + box('7 commits, 2 runs', '1 000 commits ≈ 10 runs', 'ok') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Read the whole message + line</li>
    <li>Stack: innermost first</li>
    <li>Values reveal silent bugs</li>
    <li>Hypothesis → test → fix</li></ul>`,
    box('Practice (40 min)', 'Fix three broken programs; write the hypothesis BEFORE each fix.<br><br><b>Done when</b>: no uncaught errors and Total: 70000 VND.', 'ok')) },
]);
