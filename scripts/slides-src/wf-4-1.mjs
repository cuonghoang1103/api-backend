/** Web Foundations · deck bài 4.1 — Biến và kiểu dữ liệu. Output thật: _demo/4-1 (Chromium). */
import { deckWf, js, con, box, two, tbl, vsd, steps } from './_wf-bai.mjs';

export const deck = { key: 'wf-4-1', code: 'WF 4.1', title: 'Variables and types', sub: 'Web Foundations · Chapter 4' };

export const slides = deckWf({ chuong: 'Chapter 4 — JavaScript', bai: '4.1' }, [
  { cover: true, t: 'Variables and types', sub: 'Naming values, knowing what kind they are, and predicting what happens when they mix' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Store values with the right <b>keyword</b></li>
    <li>Name every JavaScript <b>type</b></li>
    <li>Predict <b>coercion</b>: why "5" + 1 is 51</li>
    <li>Compare safely with <b>===</b></li>
    <li>Explain <b>references</b>: why changing one variable can change another</li></ul>
    ${box('Try it now', 'F12 → Console. Type any line and press Enter.', 'info')}` },

  { t: 'let, const and the end of var', giua: true, body: two(js('4-1/bien.js', null, { gon: true, chi: [2, 16] }), `${con('4-1/bien')}
    ${tbl(['Keyword', 'Reassign', 'Use'], [['const', 'no', 'default'], ['let', 'yes', 'must change'], ['var', 'yes', 'never']])}`, 'r64') },

  { t: 'The types', giua: true, body: two(con('4-1/kieu', null, { title: 'value, then typeof' }), `${box('Primitives', 'number, string, boolean, undefined, null, bigint, symbol', 'info')}
    ${box('Objects', 'objects, arrays, dates, functions', 'info')}
    ${box('The famous lie', '<code class="i">typeof null</code> says object: a bug from 1995 that can never be fixed.', 'bad')}`) },

  { t: 'Numbers have surprises', giua: true, body: `${two(js('4-1/so.js', null, { gon: true, chi: [1, 11] }), con('4-1/so'), 'r64')}
    ${box('Money', 'Calculate in whole units (dong, cents). Format only for display.', 'ok')}` },

  { t: 'Strings', giua: true, body: two(js('4-1/chuoi.js', null, { gon: true, chi: [1, 11] }), `${con('4-1/chuoi')}
    ${box('Immutable', 'Methods return a <b>new</b> string. <code class="i">word[0] = \'b\'</code> does nothing.', 'bad')}`, 'r64') },

  { t: 'Type coercion', giua: true, body: two(js('4-1/ep-kieu.js', null, { chi: [2, 11] }), `${con(null, '51\n4\n10\n33\n123\n2\n1\nNaN\n(empty string)\nNaN')}
    ${box('Rule', '<code class="i">+</code> joins if either side is a string. <code class="i">- * /</code> always try numbers.', 'info')}`) },

  { t: '== and truthiness', giua: true, body: `${two(con(null, `0 == ''  true    0 === ''  false
1 == '1' true    1 === '1' false
null == undefined true   === false
false == '0' true  === false`, { title: 'always ===' }), con('4-1/dung-sai'))}
    ${vsd('<ul><li><code class="i">if (items)</code> on an empty array</li><li><code class="i">if (count)</code> when 0 is valid</li></ul>', '<ul><li><code class="i">if (items.length)</code></li><li><code class="i">count !== undefined</code></li></ul>', '✗ Trap', '✓ Instead')}` },

  { t: 'Values and references', giua: true, body: two(js('4-1/tham-chieu.js', null, { gon: true }), `${con('4-1/tham-chieu')}
    ${box('Two names, one house', '<code class="i">user2 = user1</code> copies the <b>address</b>. <code class="i">===</code> on objects compares addresses, not content.', 'info')}`) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li><code class="i">const</code> first, never <code class="i">var</code></li>
    <li>Floating point: whole units for money</li>
    <li>Convert input with <code class="i">Number</code></li>
    <li>Always <code class="i">===</code></li>
    <li>Objects are shared</li></ul>`,
    box('Practice (25 min)', 'A price calculator reading strings like a form.<br><br><b>Done when</b>: it prints exactly <code class="i">Total: $59.97</code>, bad input gives a clear message, and the original cart is unchanged.', 'ok')) },
]);
