/**
 * tst-06-2 — Testing · Chapter 6 · Lesson 6.2 "User events, forms and async UI" (01/11/2026). Slug: tst-6-2-tuong-tac.
 * Output = chạy thật: demo6/tuong-tac (3 xanh), demo6/th62 (2 xanh: nút bận + lỗi 400 cạnh trường).
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-06-2', code: 'TST 6.2', title: 'User events', sub: 'forms and async UI' };

const SEND = `it('sends exactly what the user typed', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn().mockResolvedValue({ status: 201, data: { lab: 'BE-201', status: 'CONFIRMED' } });
  render(<BookingForm onSubmit={onSubmit} />);
  await fill(user);
  await user.click(screen.getByRole('button', { name: 'Book' }));
  expect(onSubmit).toHaveBeenCalledWith({ lab: 'BE-201', date: '2026-11-16',
    start: '08:00', end: '10:00', seats: 20 });
  expect(await screen.findByRole('status')).toHaveTextContent('Booked. See you in BE-201.');
});`;
const ERR = `await fill(user, { lab: 'be201', seats: '0' });
await user.click(screen.getByRole('button', { name: 'Book' }));
expect(screen.getByRole('textbox', { name: 'Lab' }))
  .toHaveAccessibleDescription('A lab code looks like BE-201.');
expect(screen.getByRole('spinbutton', { name: 'Seats' })).toBeInvalid();
expect(onSubmit).not.toHaveBeenCalled();`;
const OUT = ` ✓ demo6/tuong-tac.test.jsx (3 tests) 381ms
   ✓ typing, clicking, waiting (3)
     ✓ sends exactly what the user typed 194ms
     ✓ shows its own errors and does not call the API 111ms
     ✓ pressing Enter submits too 74ms`;
const BUSY = `const answer = deferred();                       // resolve it later
const onSubmit = vi.fn(() => answer.promise);
render(<BookingForm onSubmit={onSubmit} />);
await fillBooking(user);
await user.click(screen.getByRole('button', { name: 'Book' }));
const button = screen.getByRole('button', { name: 'Booking…' });
expect(button).toBeDisabled();
await user.click(button);
expect(onSubmit).toHaveBeenCalledTimes(1);
answer.resolve({ status: 201, data: { lab: 'BE-201', status: 'CONFIRMED' } });
expect(await screen.findByRole('button', { name: 'Book' })).toBeEnabled();`;
const TH = ` ✓ demo6/th62.test.jsx (2 tests) 324ms
   ✓ practice 6.2 (2)
     ✓ while waiting: "Booking…", disabled, and a second click sends nothing 229ms
     ✓ a 400 from the server is shown next to its field 94ms`;

export const slides = lamDeck({ chuong: 'Chapter 6 — Testing React components', bai: '6.2' }, [
  { cover: true, t: 'User events, forms<br>and async UI', sub: 'Chapter 6 · Lesson 6.2 — type, click, wait, and check what the user sees' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>${c('user-event')}: typing and clicking like a person</li>
    <li>Assert what was sent and what the screen says</li>
    <li>Validation messages tied to their fields</li>
    <li>Waiting with ${c('findBy')}: the screen changes later</li>
    <li>A screen that is busy: hold the promise and look</li></ul>` },
  { t: 'user-event, not fireEvent', body: zm(`<table class="t"><tr><th></th><th>${c('fireEvent.change')}</th><th>${c('user.type')}</th></tr>
    <tr><td>Events fired</td><td>one change event</td><td>focus, keydown, input, keyup… per character</td></tr>
    <tr><td>Focus</td><td>stays where it was</td><td>moves to the element, like a real click</td></tr>
    <tr><td>Enter in a field</td><td>you dispatch submit yourself</td><td>${c("'{Enter}'")} submits the form</td></tr>
    <tr><td>Async?</td><td>sync</td><td>${c('await')} every call</td></tr></table>`, 1.05) +
    box('Setup once per test', `${c('const user = userEvent.setup()')} before ${c('render')}, then ${c('await user.type(...)')} and ${c('await user.click(...)')}.`, 'lam') },
  { t: 'Type, click, then check both sides', body: js(SEND, { sm: true, hl: [5, 6, 7, 9] }) + box('Two questions', `Did the component send exactly the right data (${c('toHaveBeenCalledWith')})? And did the user see the result (${c('findByRole')} — it appears after the promise resolves)?`, 'lam') },
  { t: 'Errors the user can find', body: js(ERR, { sm: true, hl: [3, 4, 5, 6] }) + two(box('toHaveAccessibleDescription', `Checks the message is linked to the field through ${c('aria-describedby')} — what a screen reader reads after the label.`, 'xanh'), box('toBeInvalid', `${c('aria-invalid="true"')} — and the API was never called for input the browser already knows is wrong.`, 'xanh')) },
  { t: 'Three interaction tests, all green', body: zm(vt(OUT, { title: 'terminal — npx vitest run --config vitest.web.config.js demo6/tuong-tac.test.jsx', fs: 16 }), 1.05) +
    two(box('findBy = waitFor + getBy', `${c('findByRole')} retries every 50 ms for up to 1 s. Use ${c('waitFor')} only for assertions that are not a query.`, 'lam'), box('Always await it', `Without ${c('await')}, ${c('findBy')} returns a promise, the test ends early, and the assertion never runs.`, 'do2')) },
  { t: 'Hold the promise: test the busy state', body: js(BUSY, { sm: true, hl: [1, 2, 7, 9] }) + box('Why a deferred promise', 'A mock that resolves at once skips the busy state entirely. Holding the answer lets the test look at “Booking…” and click again.', 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'While waiting: the button reads “Booking…”, is disabled, and a second click sends nothing',
      'A 400 from the server with a detail for date is shown as the description of the Date field',
    ]) + vt(TH, { title: 'terminal — the solution', fs: 14 }) },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>${c('userEvent.setup()')}, then ${c('await')} every interaction</li>
    <li>Assert the data sent and the text users see</li>
    <li>Errors belong to their field: description + invalid</li>
    <li>${c('await screen.findBy…')} for anything that appears later</li>
    <li>Hold a promise to test loading and double clicks</li></ul>` },
]);
