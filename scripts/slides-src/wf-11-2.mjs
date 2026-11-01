/** Web Foundations · deck bài 11.2 — this. */
import { deckWf, js, con, anh, box, two, steps, tbl, vsd, OUT } from './_wf-bai.mjs';

const [AM, ...AREST] = OUT['11-2/arrow'].split('\n');
const OUT_ARROW = AREST.join('\n');   // hai dòng của clock (chạy sau, trong setTimeout)
const OUT_ARROW_M = AM;                // dòng của shop.title() (in ngay)

export const deck = { key: 'wf-11-2', code: 'WF 11.2', title: 'this', sub: 'Web Foundations · Chapter 11' };

export const slides = deckWf({ chuong: 'Chapter 11 — Advanced JavaScript', bai: '11.2' }, [
  { cover: true, t: 'this', sub: 'Four rules decide what this means — and one function type that ignores all of them' },

  { t: 'After this lesson you can…', to: true, body: `<ul>
    <li>Predict <code class="i">this</code> for any call using <b>four rules</b></li>
    <li>Explain why <code class="i">const f = obj.method; f()</code> crashes</li>
    <li>Fix a lost <code class="i">this</code> with an arrow wrapper or <code class="i">bind</code></li>
    <li>Choose between a <b>normal function</b> and an <b>arrow</b> on purpose</li>
    <li>Read <code class="i">this</code> in DOM event handlers</li></ul>
    ${box('The one sentence to remember', '<code class="i">this</code> is decided by <b>how a function is called</b>, not where it is written. (Arrows are the exception: they have no <code class="i">this</code> of their own.)', 'info')}` },

  { t: 'The four rules, in priority order', body: two(js('11-2/four-rules.mjs'), `${con('11-2/four-rules')}
    ${tbl(['#', 'Call looks like', 'this is'], [['1', 'new F()', 'the new object'], ['2', 'f.call(x) / bind(x)', 'x'], ['3', 'obj.f()', 'obj (left of the dot)'], ['4', 'f()', 'undefined (strict)']])}`, 'r64') },

  { t: 'Losing this: pull a method out of its object', body: `${js('11-2/lost-this.mjs')}${con('11-2/lost-this')}
    ${box('Why', '<code class="i">greet()</code> has nothing before the dot ⇒ rule 4 ⇒ <code class="i">this</code> is <code class="i">undefined</code> ⇒ reading <code class="i">.name</code> throws. The function did not change — only the <b>call</b> changed.', 'bad')}` },

  { t: 'Same bug, old-style script: silent', body: `${js('11-2/lost-this-sloppy.js')}
    ${two(con('11-2/lost-this-sloppy'), box('Sloppy mode', 'Without strict mode, rule 4 gives <code class="i">window</code>; <code class="i">window.name</code> is an empty string ⇒ no crash, just a wrong greeting.', 'bad'))}
    ${box('Good news', 'ES modules, classes, Vite, React and Next.js are <b>always strict</b> — you get the loud error instead of the silent one. A loud bug is a cheap bug.', 'ok')}` },

  { t: 'Callbacks detach methods too', body: `${js('11-2/callbacks.mjs', null, { chi: [1, 19] })}
    ${con('11-2/callbacks')}` },

  { t: 'call, apply, bind', body: two(js('11-2/call-apply-bind.mjs'), `${con('11-2/call-apply-bind')}
    ${tbl(['Method', 'Runs now?', 'Arguments'], [['call', 'yes', 'one by one'], ['apply', 'yes', 'as an array'], ['bind', 'no — returns a function', 'pre-filled, optional']])}
    ${box('', 'A bound function keeps its <code class="i">this</code> even when called as another object’s method.', 'info')}`, 'r64') },

  { t: 'Arrow functions have no this of their own', body: `${js('11-2/arrow.mjs', null, { chi: [1, 18] })}
    ${two(con(null, OUT_ARROW), box('', 'The <b>arrow</b> borrows the method’s <code class="i">this</code>; the normal function gets its own.', 'ok'))}` },

  { t: 'The opposite trap: an arrow as a method', body: `${js('11-2/arrow.mjs', null, { chi: [20, 25] })}
    ${two(con(null, OUT_ARROW_M), box('Why', 'An arrow looks <b>outward</b> to where it is written: the module top level, where <code class="i">this</code> is <code class="i">undefined</code>. The object literal does not create a <code class="i">this</code>.', 'bad'))}
    ${box('Rule', 'Methods: <code class="i">title() { … }</code>. Callbacks inside methods: arrows.', 'ok')}
    ${box('Same reason in the DOM demo', 'A module’s top level has <code class="i">this === undefined</code>, so an arrow handler written there sees <code class="i">undefined</code> too (next slide).', 'info')}` },

  { t: 'this in DOM event handlers', body: `${two(anh('11-2/dom-this.png', { w: 540 }), `${con('11-2/dom-this')}
    ${box('', 'Prefer <code class="i">e.currentTarget</code>: works in both kinds of handler.', 'ok')}`)}
    ${js('11-2/dom-this.html', null, { chi: [13, 20] })}` },

  { t: 'Choosing: normal function or arrow?', to: true, body: `${vsd(`<ul><li>Object and class <b>methods</b></li><li>Event handlers that use <code class="i">this</code> as the element</li><li>Constructors (arrows cannot be used with <code class="i">new</code>)</li></ul>`,
    `<ul><li><b>Callbacks</b> inside methods: <code class="i">map</code>, <code class="i">setTimeout</code>, <code class="i">then</code></li><li>Small helpers that never touch <code class="i">this</code></li><li>React components and handlers (no <code class="i">this</code> at all)</li></ul>`, 'Use a normal function / method', 'Use an arrow')}
    ${box('Debugging recipe', 'Seeing <code class="i">Cannot read properties of undefined</code> inside a method? Look at the <b>call site</b>: is there an object before the dot?', 'info')}` },

  { t: 'Summary & practice', to: true, body: two(`<ul>
    <li><b>new</b> ⇒ new object · <b>call/bind</b> ⇒ given · <b>obj.f()</b> ⇒ obj · <b>f()</b> ⇒ undefined</li>
    <li>Detaching a method loses <code class="i">this</code></li>
    <li>Arrows borrow <code class="i">this</code> from outside</li>
    <li><code class="i">e.currentTarget</code> beats <code class="i">this</code> in handlers</li>
    <li>Strict mode turns silent bugs into loud ones</li></ul>`,
    box('Practice (15 min)', 'A <code class="i">Stopwatch</code> class has <code class="i">start()</code> using <code class="i">setInterval(function () { this.seconds++ })</code>. Make it count, then pass <code class="i">sw.reset</code> to a button handler and make that work too.<br><br><b>Done when</b>: after 3 ticks <code class="i">seconds</code> is 3 and clicking reset sets it to 0 — no errors in the console.', 'ok')) },
]);
