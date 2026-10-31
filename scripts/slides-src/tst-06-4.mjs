/**
 * tst-06-4 — Testing · Chapter 6 · Lesson 6.4 "Testing in Next.js" (01/11/2026). Slug: tst-6-4-nextjs.
 * Output = chạy thật: demo6/route (3 xanh, môi trường node), demo6/server-component (2 xanh + 1 CỐ Ý ĐỎ: "is an async Client Component"), demo6/th64 (3 xanh).
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-06-4', code: 'TST 6.4', title: 'Testing in Next.js', sub: 'client, server and route handlers' };

const ROUTE = `export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lab = searchParams.get('lab');
  const date = searchParams.get('date');
  if (!lab || !date) return Response.json({ error: { code: 'VALIDATION' } }, { status: 400 });
  try {
    return Response.json({ lab, date, free: freeSlots(await listBookings({ lab, date })) });
  } catch {
    return Response.json({ error: { code: 'UPSTREAM_DOWN' } }, { status: 502 });
  }
}`;
const RTEST = `// @vitest-environment node
it('free slots of BE-201 on one day', async () => {
  vi.stubEnv('LABFLOW_API_URL', API);
  const res = await GET(new Request('http://localhost/api/slots?lab=BE-201&date=2026-11-16'));
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ lab: 'BE-201', date: '2026-11-16',
    free: ['09:00', '09:30', '20:30'] });
});`;
const ROUT = ` ✓ demo6/route.test.js (3 tests) 34ms
   ✓ route handler: a function from Request to Response (3)
     ✓ free slots of BE-201 on one day 25ms
     ✓ 400 without a date 1ms
     ✓ 502 when the LabFlow API is down 4ms`;
const PAGE = `export default async function BookingPage({ params }) {
  const { id } = await params;                    // Next.js 15+: a Promise
  const booking = await getBooking(id);
  if (!booking) return <p>Booking not found.</p>;
  return (<article><h1>Booking #{booking.id}</h1> … </article>);
}

// the test: await it like a function, render what it returned
render(await BookingPage({ params: Promise.resolve({ id: '1' }) }));
expect(screen.getByRole('heading', { name: 'Booking #1' })).toBeInTheDocument();`;
const SOUT = `     ✓ await the component like a function, then render what it returned 96ms
     ✓ a missing booking 5ms
     × RED ON PURPOSE — rendered as a normal component 1006ms
<BookingPage> is an async Client Component. Only Server Components
can be async at the moment.`;

export const slides = lamDeck({ chuong: 'Chapter 6 — Testing React components', bai: '6.4' }, [
  { cover: true, t: 'Testing in Next.js:<br>client, server, route', sub: 'Chapter 6 · Lesson 6.4 — what a unit test can reach, and what to leave for Playwright' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Client components: exactly what lessons 6.1–6.3 did</li>
    <li>Route handlers: a function from Request to Response</li>
    <li>Async Server Components: await, then render — and the limit</li>
    <li>Pure logic out of components, tested as units</li>
    <li>What only an end-to-end test can check (Chapter 7)</li></ul>` },
  { t: 'Three kinds of code in a Next.js app', body: zm(`<table class="t"><tr><th>Code</th><th>Runs</th><th>Test it with</th></tr>
    <tr><td>${c("'use client'")} component (BookingForm)</td><td>browser</td><td>Testing Library + jsdom (6.1–6.3)</td></tr>
    <tr><td>Route handler (${c('app/api/slots/route.js')})</td><td>server</td><td>call ${c('GET(new Request(…))')} in Node</td></tr>
    <tr><td>Sync Server Component</td><td>server</td><td>${c('render(<Page />)')} works</td></tr>
    <tr><td>Async Server Component</td><td>server</td><td>${c('render(await Page(props))')} — top level only</td></tr>
    <tr><td>Routing, middleware, streaming, cookies</td><td>Next.js itself</td><td>Playwright (Chapter 7)</td></tr></table>`, 1.02) +
    box('From the Next.js testing guide', 'Vitest does not support async Server Components; unit-test synchronous Server and Client Components and use end-to-end tests for async ones.', 'lam') },
  { t: 'A route handler is a function', body: js(ROUTE, { sm: true, hl: [1, 5, 7, 9] }) + box('Logic lives elsewhere', `${c('freeSlots')} is a pure function in ${c('lib/slots.js')} and ${c('listBookings')} calls the API. The handler only reads the request and maps errors.`, 'lam') },
  { t: 'Call it with a real Request', body: js(RTEST, { sm: true, hl: [1, 4] }) + vt(ROUT, { title: 'terminal — npx vitest run --config vitest.web.config.js demo6/route.test.js', fs: 14 }) },
  { t: 'Async Server Components: await, then render', body: js(PAGE, { sm: true, hl: [1, 2, 9] }) + vt(SOUT, { title: 'terminal — demo6/server-component.test.jsx', fs: 13 }) },
  { t: 'Where the limit is', body: two(box('Works', `<ul style="font-size:20px"><li>${c('await Page(props)')} then ${c('render')} the returned markup</li><li>MSW fakes the API the page calls</li><li>404 → “Booking not found.”</li></ul>`, 'xanh'), box('Does not', `<ul style="font-size:20px"><li>${c('render(<Page />)')} of an async component: React treats it as a client component</li><li>an async component <em>inside</em> the returned tree — same error (measured)</li><li>${c('notFound()')}, redirects, layouts, real routing</li></ul>`, 'do2'), 'r64') +
    box('Rule of thumb', 'Keep server components thin: data in lib/, logic in pure functions, both unit-tested. Test the assembled page through the browser in Chapter 7.', 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'freeSlots: an empty day has 28 slots from 07:00 to 20:30',
      'Around a booking 08:00–10:00: 07:30 and 10:00 are free, 08:00 and 09:30 are not',
      'The route answers 400 without a lab',
    ]) + box('Done when', `${c('demo6/th64.test.js')}: 3 passed — in the node environment.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Client components: Testing Library, as before</li>
    <li>Route handlers: build a Request, check the Response</li>
    <li>Async Server Components: ${c('render(await Page(props))')}, top level only</li>
    <li>Move logic into pure functions; keep pages thin</li>
    <li>Routing and the assembled page: Playwright, Chapter 7</li></ul>` },
]);
