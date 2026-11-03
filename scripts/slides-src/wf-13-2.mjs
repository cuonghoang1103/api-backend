/** Web Foundations · deck bài 13.2 — Unit test đầu tiên với Vitest. */
import { deckWf, js, bash, term, box, two, steps, tbl, vsd, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-13-2', code: 'WF 13.2', title: 'Your first unit tests', sub: 'Web Foundations · Chapter 13' };

const M = OUT['_t13/out/matchers'].split('\n');
const MATCH_SUM = M.filter((l) => /❯ demo|×|Tests /.test(l)).join('\n');
const DIFF_OBJ = M.slice(M.findIndex((l) => l.startsWith('AssertionError: expected { id: 1 }')), M.findIndex((l) => l.includes('Compared values')) + 1).join('\n');
const DIFF_NUM = M.slice(M.findIndex((l) => l.startsWith('AssertionError: expected 0.3')), M.findIndex((l) => l.startsWith('+ 0.30000000000000004')) + 1).join('\n');

export const slides = deckWf({ chuong: 'Chapter 13 — Testing', bai: '13.2' }, [
  { cover: true, t: 'Your first unit tests', sub: 'Vitest from zero: install, describe / it / expect, the matchers you need, tables of cases, and reading failures' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Install <b>Vitest</b> and run tests once or in watch mode</li>
    <li>Write a test in three steps: <b>Arrange · Act · Assert</b></li>
    <li>Pick the right matcher: <code class="i">toBe</code>, <code class="i">toEqual</code>, <code class="i">toThrow</code>, <code class="i">toBeCloseTo</code></li>
    <li>Turn a table of cases into one <b>it.each</b></li>
    <li>Name tests so a red report reads like a requirement</li></ul>` },

  { t: 'Setting up: two commands', giua: true, body: `${bash(null, `npm init -y
npm install --save-dev vitest      # Vitest 5.0.5 in this chapter, Node 22
# package.json  →  "scripts": { "test": "vitest" }
npm test                  # watch mode: re-runs on every save
npx vitest run            # one run, then exit (CI uses this)`)}
    ${box('Where tests live', 'Next to the code (<code class="i">cart.test.js</code>) or in a <code class="i">test/</code> folder. Vitest finds every <code class="i">*.test.js</code> by itself.', 'info')}` },

  { t: 'Anatomy: describe, it, expect', giua: true, body: two(js('_t13/test/cart.test.js', null, { chi: [1, 19] }), steps(['<code class="i">describe</code> groups tests about one thing', '<code class="i">it</code> = one behaviour, named as a sentence', '<b>Arrange</b> the input', '<b>Act</b>: call the code once', '<b>Assert</b> with <code class="i">expect(x).toBe(y)</code>']), 'r73') },

  { t: 'A table of cases: it.each', giua: true, body: `${js('_t13/test/cart.test.js', null, { chi: [21, 30] })}
    ${box('Why a table', 'Four boundaries, one test body. Adding a case is adding a row — and the report prints each row with its values.', 'ok')}` },

  { t: 'Errors are behaviour too', giua: true, body: `${js('_t13/test/cart.test.js', null, { chi: [32, 40] })}
    ${box('Wrap the call', '<code class="i">expect(() =&gt; applyCoupon(…)).toThrow(RangeError)</code> — pass a FUNCTION. Calling it directly throws before <code class="i">expect</code> can catch it.', 'bad')}` },

  { t: 'The verbose report', body: term('_t13/out/cart', null, { title: 'npx vitest run --reporter=verbose test/cart.test.js' }) },

  { t: 'toBe vs toEqual, and 0.1 + 0.2', giua: true, body: two(js('_t13/demo/matchers.test.js'), term(null, MATCH_SUM, { title: 'vitest run demo/matchers.test.js' }), 'r73') },

  { t: 'Reading the two failures', body: two(term(null, DIFF_OBJ, { title: 'toBe on objects' }), term(null, DIFF_NUM, { title: 'toBe on decimals' })) + box('Rules', '<code class="i">toBe</code> = same value / same object (<code class="i">Object.is</code>). <code class="i">toEqual</code> = same contents. Decimals ⇒ <code class="i">toBeCloseTo</code>, or store money as integers.', 'info') },

  { t: 'Matchers you will use 95% of the time', to: true, giua: true, body: tbl(['Matcher', 'Use for'], [
      ['toBe(x)', 'numbers, strings, booleans, same reference'],
      ['toEqual(obj)', 'objects and arrays by contents'],
      ['toBeCloseTo(n)', 'decimals'],
      ['toThrow(Type | "text")', 'errors (wrap the call in a function)'],
      ['toContain(x) · toHaveLength(n)', 'arrays and strings'],
      ['toBeNull() · toBeUndefined() · toBeTruthy()', 'empty values'],
      ['resolves / rejects', 'promises (lesson 13.4)'],
    ]) },

  { t: 'Good test names', to: true, giua: true, body: vsd('<ul><li><code class="i">it("works")</code></li><li><code class="i">it("test 2")</code></li><li><code class="i">it("shipping")</code></li></ul>', '<ul><li><code class="i">it("is 0 for an empty cart")</code></li><li><code class="i">it("free shipping applies AFTER the coupon")</code></li><li><code class="i">it("rejects a coupon of 51")</code></li></ul>', 'Says nothing when red', 'Reads like a requirement') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li><code class="i">npm test</code> watches; <code class="i">vitest run</code> runs once</li>
    <li>Arrange · Act · Assert, one behaviour per test</li>
    <li><code class="i">toEqual</code> for objects, <code class="i">toBeCloseTo</code> for decimals</li>
    <li><code class="i">it.each</code> for tables of cases</li></ul>`,
    box('Practice (20 min)', 'Write <code class="i">grade(score)</code> (0–10 ⇒ "A" ≥ 8.5, "B" ≥ 7, "C" ≥ 5.5, "D" ≥ 4, else "F"; outside 0–10 ⇒ RangeError) and test it with one <code class="i">it.each</code> table.<br><br><b>Done when</b>: every boundary (8.5, 8.4, 7, 6.9 …) is a row, both errors are tested, and breaking one comparison makes exactly the right row red.', 'ok')) },
]);
