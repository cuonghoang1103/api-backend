/** Web Foundations · deck bài 13.3 — Testing Library: kiểm như người dùng. */
import { deckWf, js, html, term, box, two, steps, tbl, vsd, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-13-3', code: 'WF 13.3', title: 'Testing UI like a user', sub: 'Web Foundations · Chapter 13' };

const WQ = OUT['_t13/out/wrong-query'].split('\n');
const WQ_HEAD = WQ.slice(WQ.findIndex((l) => l.startsWith('TestingLibraryElementError')), WQ.findIndex((l) => l.includes('Name "Email":')) + 1).join('\n');
const WQ_BTN = WQ.slice(WQ.findIndex((l) => l.trim() === 'button:'), WQ.findIndex((l) => l.trim() === 'status:')).join('\n');

export const slides = deckWf({ chuong: 'Chapter 13 — Testing', bai: '13.3' }, [
  { cover: true, t: 'Testing UI like a user', sub: 'Testing Library: find elements by what people see, type and click like a person, and wait for what appears' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Run DOM tests in <b>jsdom</b>, a fake browser inside Node</li>
    <li>Find elements by <b>role</b> and <b>label</b>, not by class</li>
    <li>Type and click with <b>user-event</b></li>
    <li>Choose <b>get / query / find</b> correctly</li>
    <li>Read Testing Library’s "accessible roles" error</li></ul>
    ${box('Why', 'Tests that use what the user sees survive refactors — and they quietly force your HTML to be accessible.', 'info')}` },

  { t: 'The component: a plain-DOM sign-up form', giua: true, body: two(js('_t13/src/signup.js', null, { chi: [3, 17] }), steps(['Button disabled until email has @ and password ≥ 8', 'Submit ⇒ status "Creating…" then "Welcome, …!"', 'Server error ⇒ <code class="i">role="alert"</code>, button enabled again']), 'r64') },

  { t: 'Test setup: jsdom, screen, user-event', giua: true, body: `${js('_t13/test/signup.test.js', null, { chi: [1, 13], gon: false })}
    ${steps(['First line: this file runs in <b>jsdom</b>', '<code class="i">screen</code> = queries on the whole document', '<code class="i">jest-dom</code> adds <code class="i">toBeDisabled</code>, <code class="i">toBeInTheDocument</code>…', '<code class="i">afterEach</code> empties the page between tests'])}` },

  { t: 'Test 1: type like a user', giua: true, body: `${js('_t13/test/signup.test.js', null, { chi: [15, 26] })}
    ${box('No class names anywhere', 'The button is found by its role and visible name; inputs by their label — exactly how a person (or a screen reader) finds them.', 'ok')}` },

  { t: 'Async UI and failures', giua: true, body: `${js('_t13/test/signup.test.js', null, { chi: [28, 48] })}` },

  { t: 'Four tests, real jsdom', giua: true, body: `${term('_t13/out/signup', null, { title: 'npx vitest run --reporter=verbose test/signup.test.js' })}
    ${box('Note the times', '10–148 ms per test: slower than a unit test (a DOM is built), far faster than a real browser.', 'info')}` },

  { t: 'Queries: best first', to: true, giua: true, body: tbl(['Query', 'Finds by', 'Use'], [
      ['getByRole("button", { name })', 'role + accessible name', 'first choice, almost always'],
      ['getByLabelText("Email")', 'the &lt;label&gt; text', 'form fields'],
      ['getByText("Welcome…")', 'visible text', 'messages, paragraphs'],
      ['getByTestId("x")', 'data-testid attribute', 'last resort'],
      ['querySelector(".btn")', 'CSS class', 'avoid in tests'],
    ]) + box('Why role first', 'A screen-reader user finds a button by its role and name. If your test cannot, neither can they — the test doubles as an accessibility check.', 'info') },

  { t: 'get · query · find', to: true, giua: true, body: tbl(['Prefix', 'Not found', 'Waits?', 'Use for'], [
      ['getBy…', 'throws', 'no', 'it must be there now'],
      ['queryBy…', 'returns null', 'no', 'asserting it is NOT there'],
      ['findBy…', 'rejects (after ~1 s)', 'yes, returns a Promise', 'it will appear soon (await)'],
    ]) + box('Rule', 'Absence ⇒ <code class="i">queryBy</code> + <code class="i">toBeNull()</code>. Something async ⇒ <code class="i">await findBy</code>.', 'ok') },

  { t: 'When a query fails: read the roles', body: two(term(null, WQ_HEAD, { title: 'TestingLibraryElementError (start)' }), `${term(null, WQ_BTN, { title: '… the button it did find' })}
    ${box('The fix is in the message', 'The real name is "Sign up", not "Register". And the password field is not listed: password inputs have no role ⇒ use getByLabelText.', 'ok')}`) },

  { t: 'Implementation details vs behaviour', to: true, giua: true, body: vsd('<ul><li><code class="i">container.querySelector(".btn-primary")</code></li><li>checking internal variables</li><li><code class="i">button.click()</code> without typing first</li></ul>', '<ul><li><code class="i">getByRole("button", { name: "Sign up" })</code></li><li>checking what is on screen</li><li><code class="i">await user.type(…)</code> then <code class="i">user.click</code></li></ul>', 'Breaks on refactor', 'Survives refactor') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>jsdom = a browser inside Node</li>
    <li>Find by role / label, like a user</li>
    <li>user-event types and clicks for real</li>
    <li>get now · query absent · find later</li></ul>`,
    box('Practice (25 min)', 'Build <code class="i">createCounter()</code> (a +1 button, a −1 button, a status line; −1 disabled at 0) and test it with Testing Library only.<br><br><b>Done when</b>: no class or id is used in the tests, −1 starts disabled, three clicks show "Count: 3", and renaming a CSS class does not break any test.', 'ok')) },
]);
