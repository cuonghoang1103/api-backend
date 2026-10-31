/**
 * tst-03-2 — Testing · Chapter 3 · Lesson 3.2 "Mocking modules and HTTP" (01/11/2026). Slug: tst-3-2-mock-module.
 * Output = chạy thật: vi.mock + vi.hoisted, lỗi hoisting, MSW 3 (onUnhandledFrame; tên cũ onUnhandledRequest bị bỏ qua ⇒ ENOTFOUND).
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-03-2', code: 'TST 3.2', title: 'Mocking modules and HTTP', sub: 'vi.mock, vi.hoisted, MSW' };

const REMINDER = `import { createHttpMailer } from '../lib/mailer.js';

// built at import time from environment variables
const mailer = createHttpMailer({ baseUrl: process.env.MAIL_API_URL,
                                  apiKey: process.env.MAIL_API_KEY });

export async function sendReminder(booking) {
  return mailer.send({ to: booking.email,
    subject: 'Reminder: ' + booking.lab + ' at ' + booking.start + ' tomorrow' });
}`;
const VIMOCK = `import { sendReminder } from '../src/notify/reminder.js';

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('../src/lib/mailer.js', () => ({
  createHttpMailer: () => ({ send }),
}));

it('sends a reminder through the (mocked) mailer module', async () => {
  send.mockResolvedValue('msg-7');
  expect(await sendReminder({ email: 'an@fpt.edu.vn', lab: 'BE-201', start: '08:00' })).toBe('msg-7');
});`;
const SAI = ` FAIL  demo3/vi-mock-sai.test.js [ demo3/vi-mock-sai.test.js ]
ReferenceError: Cannot access 'send' before initialization
 ❯ createHttpMailer demo3/vi-mock-sai.test.js:6:30
      4| const send = vi.fn();                    // a normal variable…
      5| vi.mock('../src/lib/mailer.js', () => ({
      6|   createHttpMailer: () => ({ send }),    // …used inside the hoisted f…`;
const MSW = `import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';

const server = setupServer(
  http.post(API + '/v1/messages', async ({ request }) => {
    sent.push({ auth: request.headers.get('authorization'), body: await request.json() });
    return HttpResponse.json({ id: 'msg-42' }, { status: 202 });
  }),
);
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`;
const MSW_OUT = ` ✓ demo3/msw.test.js (3 tests) 48ms
   ✓ createHttpMailer (real fetch, fake network) (3)
     ✓ posts JSON with the API key and returns the message id 33ms
     ✓ 429 from the provider becomes RATE_LIMITED 5ms
     ✓ 500 becomes MAIL_FAILED and keeps the status as the cause 6ms`;
const CU = `[MSW] Warning: intercepted a request without a matching request handler:
  • POST https://mail.provider.example/api/v1/messages
…
Caused by: Error: getaddrinfo ENOTFOUND mail.provider.example`;
const MOI = `[MSW] Error: intercepted a request without a matching request handler:
  • POST https://mail.provider.example/api/v1/messages
…
Caused by: InternalError: [MSW] Cannot bypass a request when using
the "error" strategy for the "onUnhandledFrame" option.`;

export const slides = lamDeck({ chuong: 'Chapter 3 — Test doubles without lying to yourself', bai: '3.2' }, [
  { cover: true, t: 'Mocking modules and HTTP', sub: 'Chapter 3 · Lesson 3.2 — vi.mock when you must, MSW at the network edge' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Replacing a whole module with ${c('vi.mock')} — and why it is hoisted</li>
    <li>${c('vi.hoisted')}: the fix for “Cannot access … before initialization”</li>
    <li>MSW: real ${c('fetch')}, fake network</li>
    <li>A renamed option that silently sent a test to the real internet</li>
    <li>“Don’t mock what you don’t own”</li></ul>` },
  { t: 'Code that builds its own dependency', body: js(REMINDER, { hl: [4] }) + box('Why it is hard to test', `There is no parameter to pass a fake mailer in. The only way in is to replace the imported module itself.`, 'do2') },
  { t: 'vi.mock replaces a module', body: js(VIMOCK, { sm: true, hl: [3, 4] }) + two(box('Hoisted', `Vitest moves every ${c('vi.mock')} to the top of the file, above the imports, so the module is replaced before ${c('reminder.js')} loads it.`, 'lam'), box('vi.hoisted', `Whatever the factory uses must also exist that early: create it with ${c('vi.hoisted')}.`, 'xanh')) },
  { t: 'The hoisting trap', body: vt(SAI, { title: 'terminal — a normal const used inside the factory', fs: 15 }) +
    box('What happened', `The factory ran before line 4, while ${c('send')} was still in its “temporal dead zone”. Same idea as calling a ${c('let')} variable before its line.`, 'do2') +
    box('Fix', `${c('const { send } = vi.hoisted(() => ({ send: vi.fn() }));')}`, 'xanh') },
  { t: 'MSW: mock the network, not your code', body: flow([{ t: 'mailer.send()', s: 'our adapter', mau: '#336791' }, { t: 'fetch()', s: 'real, unchanged', mau: '#2f7d4f' }, { t: 'MSW', s: 'intercepts the request', mau: '#e08a1e' }, { t: 'handler', s: '202 · 429 · 500', mau: '#c0392b' }], { h: 120, fs: 20 }) +
    js(MSW, { sm: true, hl: [10] }) },
  { t: 'Three answers from a fake provider', body: zm(vt(MSW_OUT, { title: 'terminal — npx vitest run demo3/msw.test.js', sm: false }), 1.08) +
    box('What is really tested', `URL, method, JSON body, the ${c('Authorization')} header, and how we turn 429/500 into ${c('RATE_LIMITED')}/${c('MAIL_FAILED')} — everything except the provider itself.`, 'xanh') },
  { t: 'A renamed option sent the test to the internet', body: vt(CU, { title: 'listen({ onUnhandledRequest: \'error\' }) — the MSW 2 name', fs: 15 }) + vt(MOI, { title: 'listen({ onUnhandledFrame: \'error\' }) — the MSW 3 name', fs: 15 }) +
    box('Measured in this course', 'With the old name, MSW 3 only warned and let the request through: DNS lookup of the real host (ENOTFOUND). With the new name the request is refused. Check option names against the version you installed.', 'do2') },
  { t: 'Don’t mock what you don’t own', body: zm(`<table class="t"><tr><th>Do</th><th>Avoid</th></tr>
    <tr><td>Wrap the provider in <b>your</b> adapter (${c('createHttpMailer')})</td><td>${c("vi.mock('nodemailer')")} or a vendor SDK’s internals</td></tr>
    <tr><td>Test the adapter against the HTTP contract with MSW</td><td>Copying the vendor’s behaviour into a mock you invent</td></tr>
    <tr><td>Give callers a fake of <b>your</b> interface (${c('createFakeMailer')})</td><td>Mocking ${c('fetch')} by hand in every test</td></tr></table>`, 1.1) +
    box('Why', 'A mock of someone else’s library encodes your guess of how it works. When the library changes — like the MSW option above — your tests keep passing and production breaks.', 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `400 from the provider becomes ${c('MAIL_FAILED')} with “HTTP 400” as the cause`,
      'The JSON body contains exactly { to, subject }',
      `Run the typo demo with both option names and compare`,
    ]) + box('Done when', `${c('demo3/th32.test.js')}: 2 passed.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>${c('vi.mock')} replaces a module; it is hoisted, so use ${c('vi.hoisted')} for what it needs</li>
    <li>Needing ${c('vi.mock')} is a design smell (lesson 3.4)</li>
    <li>MSW keeps ${c('fetch')} real and fakes the network</li>
    <li>Fail on unhandled requests — with the option name of <i>your</i> version</li>
    <li>Mock your own adapters, not other people’s libraries</li></ul>` },
]);
