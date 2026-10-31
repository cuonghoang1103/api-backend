/**
 * tst-06-3 — Testing · Chapter 6 · Lesson 6.3 "Components that fetch data" (01/11/2026). Slug: tst-6-3-api-gia.
 * Output = chạy thật: demo6/api-gia (5 xanh, MSW 3), demo6/url-tuong-doi (URL tương đối ⇒ "Failed to parse URL"), demo6/th63 (2 xanh).
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-06-3', code: 'TST 6.3', title: 'Components that fetch', sub: 'MSW and the four states' };

const CLIENT = `export function createClient({ token, baseUrl = '',
  fetch: send = (...args) => globalThis.fetch(...args) }) {
  async function call(method, path, body) { … send(baseUrl + path, …) … }
  return {
    createBooking: (input) => call('POST', '/api/bookings', input),
    getBooking: (id) => call('GET', '/api/bookings/' + id),
    listAll: () => call('GET', '/api/admin/bookings'),
  };
}`;
const STATES = `if (state.phase === 'loading') return <p role="status">Loading bookings…</p>;
if (state.phase === 'forbidden') return <p role="alert">Only admins can see all bookings.</p>;
if (state.phase === 'failed') return (
  <div role="alert"><p>Could not load the bookings.</p>
    <button type="button" onClick={load}>Try again</button></div>);
if (state.bookings.length === 0) return <p>No bookings yet.</p>;
return <table aria-label="All bookings">…</table>;`;
const MSW = `const API = 'http://api.test';
const list = (status, body) =>
  http.get(API + '/api/admin/bookings', () => HttpResponse.json(body, { status }));
const server = setupServer(list(200, [ROW]));
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());

it('403 → not an admin', async () => {
  server.use(list(403, { error: { code: 'FORBIDDEN' } }));
  render(<AdminBookings client={createClient({ token: 't', baseUrl: API })} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Only admins can see all bookings.');
});`;
const OUT = ` ✓ demo6/api-gia.test.jsx (5 tests) 187ms
   ✓ a screen that fetches: four states (5)
     ✓ loading first, then the table 126ms
     ✓ empty 10ms
     ✓ 403 → not an admin 9ms
     ✓ 500, then Try again works 30ms
     ✓ network down 7ms`;
const URL = `   ✓ Node’s fetch refuses a relative URL 2ms
   × RED ON PURPOSE — the screen only says “could not load” 1015ms
TestingLibraryElementError: Unable to find role="table"
  <div role="alert"> <p>Could not load the bookings.</p> …`;

export const slides = lamDeck({ chuong: 'Chapter 6 — Testing React components', bai: '6.3' }, [
  { cover: true, t: 'Components<br>that fetch data', sub: 'Chapter 6 · Lesson 6.3 — a fake API on the network, and every state a user can see' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A small API client with ${c('fetch')} and the base URL as parameters</li>
    <li>One screen, four states: loading, error, empty, data</li>
    <li>MSW answers at the network: the real client runs</li>
    <li>Retry after a failure, and a network that is down</li>
    <li>A relative URL that works in the browser and fails in Node</li></ul>` },
  { t: 'The client: fetch and base URL are parameters', body: js(CLIENT, { sm: true, hl: [1, 2] }) + two(box('Two ways to fake it', `Pass a stub client (Chapter 3) for small tests, or keep the real client and let MSW answer the HTTP request — more of the real code runs.`, 'lam'), box('Same idea as Chapter 2', 'The clock was a parameter; here the network and the server address are.', 'lam')) },
  { t: 'One screen, four states', body: js(STATES, { hl: [1, 2, 3, 6] }) + flow([{ t: 'loading', s: 'role=status', mau: '#336791' }, { t: 'forbidden / failed', s: 'role=alert', mau: '#b23b2e' }, { t: 'empty', s: 'No bookings yet.', mau: '#7a3d12' }, { t: 'table', s: 'All bookings', mau: '#2f7d4f' }], { h: 100, fs: 18 }) +
    box('Roles carry meaning', `${c('status')} is read politely when it changes; ${c('alert')} interrupts. Tests find each state by the role a screen reader would announce.`, 'lam') },
  { t: 'MSW answers the real request', body: js(MSW, { sm: true, hl: [5, 9, 10] }) + box('onUnhandledFrame: "error"', 'The MSW 3 option from lesson 3.2: any request without a handler fails the test instead of reaching the real network.', 'lam') },
  { t: 'Five tests, all green', body: zm(vt(OUT, { title: 'terminal — npx vitest run --config vitest.web.config.js demo6/api-gia.test.jsx', fs: 16 }), 1.05) +
    two(box('Retry', `${c('{ once: true }')} on a handler: the first request gets 500, the click on “Try again” gets the default 200.`, 'lam'), box('Network down', `${c('HttpResponse.error()')} makes ${c('fetch')} reject — the same thing a lost Wi-Fi does.`, 'lam')) },
  { t: 'A relative URL, measured', body: vt(URL, { title: 'terminal — demo6/url-tuong-doi.test.jsx', fs: 14 }) +
    two(box('What happened', `In a browser ${c("fetch('/api/…')")} uses the page’s address. In a test, ${c('fetch')} is Node’s, and it throws “Failed to parse URL from /api/admin/bookings”. The screen honestly shows its error state.`, 'do2'), box('Fix', `Give the client an absolute ${c('baseUrl')} in tests (${c('http://api.test')}); keep ${c("''")} in the browser.`, 'xanh')) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'The booking form with the REAL client: a 409 from MSW shows “This slot is already taken. Choose another time.”',
      'The network is down: the form shows “Cannot reach the server. Check your connection.”',
    ]) + box('Done when', `${c('demo6/th63.test.jsx')}: 2 passed.`, 'xanh') + box('Hint', `${c('render(<BookingForm onSubmit={client.createBooking} />)')} — the form does not know there is HTTP behind it.`, 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Make fetch and the base URL parameters of the client</li>
    <li>Test every state users can see, not only the happy table</li>
    <li>MSW + the real client: more real code under test</li>
    <li>Unhandled requests must fail the test</li>
    <li>Absolute URLs in tests; Node’s fetch has no page address</li></ul>` },
]);
