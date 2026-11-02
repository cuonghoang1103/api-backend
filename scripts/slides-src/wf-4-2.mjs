/** Web Foundations · deck bài 4.2 — Điều kiện và vòng lặp. Output thật: _demo/4-2 (Chromium). */
import { deckWf, js, con, box, two, tbl, vsd } from './_wf-bai.mjs';

export const deck = { key: 'wf-4-2', code: 'WF 4.2', title: 'Conditions and loops', sub: 'Web Foundations · Chapter 4' };

export const slides = deckWf({ chuong: 'Chapter 4 — JavaScript', bai: '4.2' }, [
  { cover: true, t: 'Conditions and loops', sub: 'Making decisions and repeating work: all a computer really does' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Branch with <b>if</b> and put conditions in the right order</li>
    <li>Use <b>&amp;&amp;, ||, ??, ?.</b> correctly</li>
    <li>Choose the right <b>loop</b></li>
    <li>Tell <b>for...of</b> from <b>for...in</b></li>
    <li><b>Trace</b> a loop by hand to find a bug</li></ul>` },

  { t: 'Order of branches', giua: true, body: two(js('4-2/xep-loai.js', null, { gon: true, chi: [2, 11] }), `${con('4-2/xep-loai', null, { title: 'score · wrong · right' })}
    ${box('Rule', 'The first true branch wins. Put the <b>strictest</b> condition first.', 'ok')}`) },

  { t: 'Logic operators return values', giua: true, body: two(js('4-2/logic.js', null, { gon: true, chi: [8, 16] }), `${con('4-2/logic')}
    ${box('The key difference', '<code class="i">||</code> loses 0 and empty text. <code class="i">??</code> replaces only null and undefined.', 'bad')}`, 'r73') },

  { t: 'switch, and when not to use it', giua: true, body: two(js('4-2/switch.js', null, { gon: true, chi: [1, 15] }), `${con('4-2/switch')}
    ${box('Forgot break?', 'It <b>falls through</b> to the next case. A lookup object cannot.', 'bad')}
    ${js(null, `const prices = { coffee: 30, tea: 20 };`, { gon: false })}`) },

  { t: 'Loops', giua: true, body: two(js('4-2/vong-lap.js', null, { gon: true }), tbl(['You need', 'Use'], [
      ['each value', 'for...of'],
      ['the index', 'classic for'],
      ['a new list', 'map, filter'],
      ['until something happens', 'while'],
      ['stop early', 'break (not forEach)'],
      ['skip one round', 'continue'],
    ]), 'r64') },

  { t: 'for...in is not for arrays', giua: true, body: two(js('4-2/for-in-bay.js', null, { gon: true, chi: [1, 5] }), `${con('4-2/for-in-bay')}
    ${box('Memory aid', '<b>of</b> = values · <b>in</b> = keys', 'ok')}`, 'r64') },

  { t: 'Off by one, and tracing', giua: true, body: two(js('4-2/lech-mot.js', null, { gon: true }), `${con('4-2/lech-mot')}
    ${box('Trace', 'Use a tiny input and write every variable after each round. The first differing row is the bug.', 'ok')}`, 'r64') },

  { t: 'Summary & practice', to: true, giua: true, body: `${two(`<ul>
    <li>First true branch wins</li>
    <li><code class="i">??</code> for defaults</li>
    <li><code class="i">for...of</code> for values</li>
    <li><code class="i">i &lt; list.length</code></li></ul>`,
    box('Practice (25 min)', 'Trace a loop on paper, then write <code class="i">grade</code> and <code class="i">countVowels</code>.<br><br><b>Done when</b>: your table matches <code class="i">15 9</code>, and <code class="i">countVowels(\'Web Foundations\')</code> is 6.', 'ok'))}
    ${con('4-2/fizzbuzz', null, { title: 'FizzBuzz: check 15 first' })}` },
]);
