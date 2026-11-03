/** Web Foundations · deck bài 4.3 — Hàm. Output thật: _demo/4-3 (Chromium). */
import { deckWf, js, con, box, two, tbl, vsd } from './_wf-bai.mjs';

export const deck = { key: 'wf-4-3', code: 'WF 4.3', title: 'Functions', sub: 'Web Foundations · Chapter 4' };

export const slides = deckWf({ chuong: 'Chapter 4 — JavaScript', bai: '4.3' }, [
  { cover: true, t: 'Functions', sub: 'Naming a piece of work, using it again — and passing it around as a value' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Write functions in all <b>three styles</b></li>
    <li>Return values <b>reliably</b></li>
    <li>Use <b>default and rest</b> parameters</li>
    <li>Predict which variables a function can <b>see</b></li>
    <li>Pass functions as <b>values</b> (callbacks)</li>
    <li>Write <b>pure</b> functions</li></ul>` },

  { t: 'Three ways to write a function', giua: true, body: two(js('4-3/ba-kieu.js', null, { gon: true, chi: [3, 17] }), `${con('4-3/ba-kieu')}
    ${tbl(['Style', 'Hoisted?'], [['function add() {}', 'yes'], ['const f = function () {}', 'no'], ['const f = () => …', 'no']])}`, 'r64') },

  { t: 'return, and the ways it goes missing', giua: true, body: two(js('4-3/tra-ve.js', null, { gon: true, chi: [1, 10] }), `${con('4-3/tra-ve')}
    ${box('All silent', 'Braces without return · printing instead of returning · <code class="i">{ }</code> instead of <code class="i">({ })</code> · a line break after return', 'bad')}`, 'r64') },

  { t: 'Parameters', giua: true, body: two(js('4-3/tham-so.js', null, { gon: true, chi: [1, 14] }), `${con('4-3/tham-so')}
    ${box('Shared object', '<code class="i">addTax(cart)</code> changed the caller’s cart. Return a new object instead.', 'bad')}`, 'r64') },

  { t: 'Scope', giua: true, body: two(js('4-3/pham-vi.js', null, { gon: true, chi: [1, 12] }), `${con('4-3/pham-vi')}
    ${box('Rule', 'Looks <b>outward</b>, layer by layer, never inward. Keep variables in the smallest scope.', 'ok')}`) },

  { t: 'Functions are values', giua: true, body: two(js('4-3/gia-tri-ham.js', null, { gon: true, chi: [2, 14] }), `${con('4-3/gia-tri-ham')}
    ${vsd('<code class="i">addEventListener(\'click\', save())</code>', '<code class="i">addEventListener(\'click\', save)</code>', '✗ Calls it now', '✓ Passes it')}`, 'r64') },

  { t: 'Pure functions', giua: true, body: `${two(js('4-3/thuan-khiet.js', null, { gon: true, chi: [2, 11] }), con('4-3/thuan-khiet'), 'r64')}
    ${box('Pure', 'Same input ⇒ same output, nothing changed outside. Easy to test; exactly what React expects. Keep side effects at the edges.', 'ok')}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Return, do not print</li>
    <li>Defaults replace undefined</li>
    <li>Scope looks outward</li>
    <li>Pass <code class="i">fn</code>, not <code class="i">fn()</code></li>
    <li>Prefer pure functions</li></ul>`,
    box('Practice (25 min)', 'Shop helpers: <code class="i">cartTotal</code>, <code class="i">formatVnd</code>, <code class="i">applyDiscount</code>, <code class="i">report(cart, format)</code>.<br><br><b>Done when</b>: <code class="i">150.000 ₫</code> is printed, the discounted total is 135000, and the original cart is unchanged.', 'ok')) },
]);
