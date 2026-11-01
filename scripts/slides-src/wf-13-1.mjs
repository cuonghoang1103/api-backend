/** Web Foundations · deck bài 13.1 — Kiểm thử để làm gì. */
import { deckWf, js, term, box, two, steps, tbl, vsd, flow, OUT } from './_wf-bai.mjs';

const RED = OUT['_t13/out/cart-buggy'].split('\n');
const CART_RED = RED.filter((l) => /❯ demo|×|Test Files|Tests /.test(l)).join('\n');
const CART_RED_DIFF = RED.slice(RED.findIndex((l) => l.startsWith(' FAIL')), RED.findIndex((l) => l.includes('7| });'))).join('\n');

export const deck = { key: 'wf-13-1', code: 'WF 13.1', title: 'Why tests exist', sub: 'Web Foundations · Chapter 13' };

export const slides = deckWf({ chuong: 'Chapter 13 — Testing', bai: '13.1' }, [
  { cover: true, t: 'Why tests exist', sub: 'A test is a sentence you write once and the computer checks forever — measured on a real shopping cart' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Say what an <b>automated test</b> is, in one sentence</li>
    <li>Explain what it buys you: <b>regressions caught</b>, safe refactors, living docs</li>
    <li>Place a test on the <b>pyramid</b>: unit, integration, end-to-end</li>
    <li>Choose <b>what</b> to test — and what not to</li>
    <li>Read a red test report without panic</li></ul>
    ${box('Why', 'Every course after this one — Node.js, React, Next.js — expects you to run and write tests. Interviews ask about them too.', 'info')}` },

  { t: 'Testing by hand does not scale', giua: true, body: `${flow([
      { t: 'change code', s: 'a "small" refactor' },
      { t: 'click around', s: 'the 3 pages you remember', mau: '#b85a2b' },
      { t: 'looks fine', s: 'ship it', mau: '#2f7d4f' },
      { t: 'bug in prod', s: 'a page you did not click', mau: '#c0392b' },
    ])}
    ${box('The real problem', 'You only re-check what you <b>remember</b>. A test re-checks <b>everything it ever checked</b>, every time, in milliseconds.', 'bad')}` },

  { t: 'A shopping cart with rules', body: two(js('_t13/src/cart.js'), steps(['Price × quantity, summed', 'Shipping 30 000đ, <b>free from 500 000đ</b>', 'Coupon 1–50%, else RangeError', 'Free shipping is decided <b>after</b> the coupon']), 'r73') },

  { t: 'Thirteen tests in 88 ms', body: `${term('_t13/out/cart', null, { title: 'npx vitest run --reporter=verbose test/cart.test.js' })}` },

  { t: 'A "small refactor" breaks a rule', giua: true, body: `${js('_t13/src/cart-buggy.js', null, { chi: [5, 7] })}
    ${term(null, CART_RED, { title: 'npx vitest run demo/cart-buggy.test.js' })}
    ${box('Regression caught', '<code class="i">&gt;</code> instead of <code class="i">&gt;=</code>: customers at exactly 500 000đ would pay shipping. The boundary test fails before the code is merged.', 'ok')}` },

  { t: 'The test pyramid (measured here)', giua: true, body: tbl(['Level', 'What it checks', 'Speed measured in this chapter', 'How many'], [
      ['Unit', 'one function, no browser, no network', '13 tests in 88 ms (~0–1 ms each)', 'many'],
      ['Integration / component', 'a piece of UI in a fake DOM (jsdom)', '4 tests, 10–148 ms each', 'some'],
      ['End-to-end', 'real browser, real clicks', '250–440 ms for ONE tiny check', 'few'],
    ]) + box('Shape', 'Lots of fast unit tests at the bottom, a few slow end-to-end tests on top for the most important journeys.', 'info') },

  { t: 'What a good test gives you', to: true, giua: true, body: steps([
      '<b>Regression net</b>: old behaviour cannot break silently.',
      '<b>Courage to refactor</b>: change the inside, the tests say if the outside still works.',
      '<b>Living documentation</b>: "free shipping applies AFTER the coupon" is written as a test.',
      '<b>Faster debugging</b>: a red test points at the rule that broke.',
    ]) + box('What it does NOT give you', 'Proof that there are no bugs. Tests only check the cases someone thought of — which is why boundaries and past bugs matter most.', 'bad') },

  { t: 'What to test — and what not to', to: true, giua: true, body: vsd('<ul><li>Business rules (prices, permissions)</li><li>Boundaries: 0, empty, exactly the limit</li><li>Error paths (bad input, server 500)</li><li>Bugs you fixed (so they never return)</li></ul>', '<ul><li>The framework itself (React works)</li><li>Private helpers one by one</li><li>Exact CSS pixels</li><li>Trivial getters</li></ul>', '✓ Test', '✗ Usually skip') },

  { t: 'Reading a red report', giua: true, body: `${term(null, CART_RED_DIFF, { title: 'the important lines' })}
    ${steps(['<b>FAIL</b> line: file › test name — which rule broke', '<b>Expected / Received</b>: what the test wanted vs what the code gave', '<b>❯ file:line</b>: the exact assertion'])}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>A test = code that checks code, automatically</li>
    <li>It catches regressions you would not re-click</li>
    <li>Pyramid: many unit, few end-to-end</li>
    <li>Test rules and boundaries, not frameworks</li></ul>`,
    box('Practice (15 min)', 'List 8 test cases (input ⇒ expected) for <code class="i">total(items, coupon)</code> on paper, including three boundaries and two errors. Then find the one rule that the existing 13 tests do not cover.<br><br><b>Done when</b>: every rule of the cart has at least one case, and you can name the uncovered rule.', 'ok')) },
]);
