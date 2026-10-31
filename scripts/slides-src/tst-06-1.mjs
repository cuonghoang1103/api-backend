/**
 * tst-06-1 — Testing · Chapter 6 · Lesson 6.1 "Testing Library: query by what users see" (01/11/2026). Slug: tst-6-1-testing-library.
 * Output = chạy thật: demo6/truy-van (3 xanh), demo6/don-dep bỏ cleanup ⇒ "Found multiple elements"; jsdom 1.60s vs happy-dom 1.17s (16 test web/);
 * happy-dom gửi preflight OPTIONS khi gọi khác origin có Authorization ⇒ MSW onUnhandledFrame 'error' chặn.
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-06-1', code: 'TST 6.1', title: 'Testing Library', sub: 'query by what users see' };

const FIELD = `function Field({ name, label, error, ...input }) {
  const id = 'booking-' + name;
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? id + '-error' : undefined} {...input} />
      {error && <span id={id + '-error'}>{error}</span>}
    </p>
  );
}`;
const T1 = `render(<BookingForm onSubmit={async () => {}} />);
expect(screen.getByRole('form', { name: 'Book a lab' })).toBeInTheDocument();
expect(screen.getByRole('textbox', { name: 'Lab' })).toHaveValue('BE-201');
expect(screen.getByRole('spinbutton', { name: 'Seats' })).toHaveValue(null);
expect(screen.getByRole('button', { name: 'Book' })).toBeEnabled();`;
const OUT = ` ✓ demo6/truy-van.test.jsx (3 tests) 123ms
   ✓ find elements the way a user does (3)
     ✓ by role and accessible name 97ms
     ✓ by label, for inputs without a simple role 7ms
     ✓ getBy throws, queryBy returns null 18ms`;
const DD = `planted in web/test-setup.js:  afterEach(cleanup);  →

   ✓ first test renders the form 93ms
   × second test renders the form again 14ms
TestingLibraryElementError: Found multiple elements
  with the role "button" and name "Book"`;
const SETUP = `import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(cleanup);`;
const HAPPY = `$ npx vitest run --config vitest.web.config.js \\
    --environment happy-dom demo6/api-gia.test.jsx -t 403
[MSW] Error: intercepted a request without a matching
  request handler:  • OPTIONS http://api.test/api/admin/bookings
   × 403 → not an admin 37ms`;

export const slides = lamDeck({ chuong: 'Chapter 6 — Testing React components', bai: '6.1' }, [
  { cover: true, t: 'Testing Library:<br>query by what users see', sub: 'Chapter 6 · Lesson 6.1 — the LabFlow booking form, found the way a person finds it' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Render a React component in a fake DOM and query it</li>
    <li>The query priority: role and label first, test id last</li>
    <li>getBy, queryBy, findBy — which one when</li>
    <li>Cleanup between tests — a measured failure without it</li>
    <li>jsdom or happy-dom: speed measured, one real difference</li></ul>` },
  { t: 'The screen under test: every input has a label', body: js(FIELD, { sm: true, hl: [5, 6, 7, 8] }) + two(box('A label is a contract', `${c('htmlFor')} links the label to the input. Screen readers read it, clicks on it focus the input — and Testing Library finds the input by it.`, 'lam'), box('Errors are described', `${c('aria-invalid')} and ${c('aria-describedby')} tell assistive technology what is wrong. Lesson 6.2 asserts both.`, 'lam')) },
  { t: 'Queries in priority order', body: zm(`<table class="t"><tr><th>#</th><th>Query</th><th>Finds by</th><th>Use for</th></tr>
    <tr><td>1</td><td>${c('getByRole')}</td><td>role + accessible name</td><td>almost everything</td></tr>
    <tr><td>2</td><td>${c('getByLabelText')}</td><td>the label of a form field</td><td>inputs (date, time…)</td></tr>
    <tr><td>3</td><td>${c('getByPlaceholderText')}, ${c('getByText')}</td><td>visible text</td><td>messages, non-interactive text</td></tr>
    <tr><td>4</td><td>${c('getByDisplayValue')}, ${c('getByAltText')}, ${c('getByTitle')}</td><td>other visible hints</td><td>rare cases</td></tr>
    <tr><td>5</td><td>${c('getByTestId')}</td><td>${c('data-testid')}</td><td>last resort — users never see it</td></tr></table>`, 1.0) +
    box('Not on the list: querySelector', `${c("container.querySelector('input[name=seats]')")} still passes when the label is broken — Lab 6 plants exactly that bug.`, 'do2') },
  { t: 'Find by role and accessible name', body: js(T1, { sm: true, hl: [2, 3, 4, 5] }) + two(box('Roles you will meet', `${c('textbox')} text input · ${c('spinbutton')} number input · ${c('button')} · ${c('form')} (needs a name) · ${c('table')}, ${c('row')} · ${c('alert')}, ${c('status')}`, 'lam'), box('Date and time inputs', `HTML gives date and time inputs no ARIA role, so use ${c("getByLabelText('Date')")} — still the user's view.`, 'lam')) },
  { t: 'getBy, queryBy, findBy', body: zm(`<table class="t"><tr><th></th><th>0 matches</th><th>1 match</th><th>2+ matches</th><th>Waits?</th></tr>
    <tr><td>${c('getBy…')}</td><td>throws</td><td>element</td><td>throws</td><td>no</td></tr>
    <tr><td>${c('queryBy…')}</td><td>${c('null')}</td><td>element</td><td>throws</td><td>no</td></tr>
    <tr><td>${c('findBy…')}</td><td>rejects after 1 s</td><td>element</td><td>rejects</td><td>yes (async)</td></tr>
    <tr><td>${c('getAllBy…')}</td><td>throws</td><td>array</td><td>array</td><td>no</td></tr></table>`, 1.05) +
    vt(OUT, { title: 'terminal — npx vitest run --config vitest.web.config.js demo6/truy-van.test.jsx', fs: 15 }) },
  { t: 'Cleanup between tests, measured', body: vt(DD, { title: 'terminal — the same two tests, with cleanup removed', fs: 16 }) +
    two(box('Why it happened', `Testing Library unmounts after each test only if it can see a global ${c('afterEach')}. Vitest has no globals by default, so the first form stayed on the page.`, 'do2'), `<div>${js(SETUP, { hl: [5] })}<p style="font-size:20px;margin:8px 0 0">${c('web/test-setup.js')} — loaded by ${c('setupFiles')}, once for every web test file.</p></div>`) },
  { t: 'jsdom or happy-dom? Measured', body: zm(`<table class="t"><tr><th>Same 16 tests in web/</th><th>jsdom 30.1</th><th>happy-dom 21.0</th></tr>
    <tr><td>Duration (3 runs)</td><td>1.60–1.64 s</td><td>1.17–1.25 s</td></tr>
    <tr><td>MSW + another origin + Authorization</td><td>works</td><td>sends a CORS preflight (OPTIONS) first</td></tr></table>`, 1.05) +
    vt(HAPPY, { title: 'terminal', fs: 14 }) + box('This course uses jsdom', 'It is what the Next.js testing guide configures, and its fetch does not add a CORS preflight. With happy-dom, call the same origin or answer OPTIONS in MSW.', 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'A stub client that never answers: the screen shows “Loading bookings…” and no table',
      'A stub client with one booking: the five column headers are Lab, Date, Time, Seats, Status',
    ]) + box('Done when', `${c('demo6/th61.test.jsx')}: 2 passed.`, 'xanh') + box('Hint', `${c("within(table).getAllByRole('columnheader')")} returns the header cells in order.`, 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Query the way users find things: role and label first</li>
    <li>${c('getBy')} for “must be there”, ${c('queryBy')} for “must not”, ${c('findBy')} for “will appear”</li>
    <li>Register ${c('afterEach(cleanup)')} once in a setup file</li>
    <li>jsdom here; happy-dom is faster but adds a CORS preflight</li>
    <li>A test id is a last resort — users never see it</li></ul>` },
]);
