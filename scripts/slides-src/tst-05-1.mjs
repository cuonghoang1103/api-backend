/**
 * tst-05-1 — Testing · Chapter 5 · Lesson 5.1 "Supertest: requests without a running server" (01/11/2026). Slug: tst-5-1-supertest.
 * Output = chạy thật: demo5/supertest (4 xanh), server thật + curl, bỏ trường status ⇒ test chỉ-kiểm-status vẫn xanh.
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-05-1', code: 'TST 5.1', title: 'Supertest', sub: 'HTTP tests without a running server' };

const APP = `export function createApp({ repo, auth }) {
  const app = express();
  app.use(express.json());
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.post('/api/bookings', requireUser, async (req, res) => {
    const parsed = BookingInput.safeParse(req.body);
    if (!parsed.success) return fail(res, 400, 'VALIDATION', { details });
    const booking = await bookLab(repo, { ...parsed.data, role: req.user.role, userId: req.user.id });
    res.status(201).location('/api/bookings/' + booking.id).json(toPublic(booking));
  });
  …
  return app;          // no app.listen() here
}`;
const MAIN = `$ JWT_SECRET=dev-only PORT=3999 node src/api/main.js & sleep 1; curl -s -i http://localhost:3999/api/health
LabFlow Lite API on http://localhost:3999
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8

{"status":"ok"}`;
const TEST = `it('201 + Location, and the Location really serves the booking', async () => {
  const { app, bearer } = makeApi();
  const auth = await bearer('an');
  const res = await request(app).post('/api/bookings').set('Authorization', auth).send(body());
  expect(res.status).toBe(201);
  expect(res.headers.location).toBe('/api/bookings/1');
  expect(res.body).toEqual({ id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00',
    end: '10:00', seats: 20, status: 'CONFIRMED', minutes: 120 });
  const again = await request(app).get(res.headers.location).set('Authorization', auth);
  expect(again.body).toEqual(res.body);
});`;
const OUT = ` ✓ demo5/supertest.test.js (4 tests) 77ms
   ✓ POST /api/bookings — through real HTTP, without starting the server (4)
     ✓ GET /api/health answers 200 JSON 15ms
     ✓ 201 + Location, and the Location really serves the booking 33ms
     ✓ a business-rule violation is 422 with the rule code 5ms
     ✓ the same slot twice is 409 OVERLAP 24ms`;
const BO = `planted in src/api/server.js:  status: b.status,   →  (removed)

 ✓ demo5/chi-status.test.js (1 test) 35ms
   ✓ creating a booking works (status only) 35ms
 ❯ demo5/supertest.test.js (4 tests | 1 failed) 72ms
     × 201 + Location, and the Location really serves the booking 28ms`;

export const slides = lamDeck({ chuong: 'Chapter 5 — Testing HTTP APIs', bai: '5.1' }, [
  { cover: true, t: 'Supertest: requests<br>without a running server', sub: 'Chapter 5 · Lesson 5.1 — the LabFlow Lite API, tested from the outside' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The LabFlow Lite HTTP API: four routes, one error format</li>
    <li>Separating the app from ${c('listen()')} — the trick that makes API tests fast</li>
    <li>Supertest: status, headers and body in one chain</li>
    <li>Why a status-only test is not enough — measured</li>
    <li>A fresh app per test: no shared data, no port</li></ul>` },
  { t: 'Build the app, do not start it', body: js(APP, { sm: true, hl: [9, 12] }) + two(box('createApp', 'Returns an Express app with its dependencies passed in (lesson 3.4). Tests build a fresh one per test.', 'lam'), box('main.js', `Only the real entry point calls ${c('app.listen(port)')}. Tests never import it.`, 'lam')) },
  { t: 'The real server, for comparison', body: vt(MAIN, { title: 'terminal', fs: 15 }) + two(box('Supertest does the same request for you', `${c('request(app)')} binds the app to a random port for one request: no port to choose, no server to start and stop, nothing left running.`, 'xanh'), box('Notice X-Powered-By', 'Express announces itself by default — production apps usually turn it off (app.disable("x-powered-by")). Harmless for tests.', 'lam')) },
  { t: 'Status, headers, body — and follow the Location', body: js(TEST, { sm: true, hl: [5, 6, 7] }) + box('Read it as a client', '201 Created must tell the client where the new resource lives. The test follows that Location exactly as a browser or app would.', 'lam') },
  { t: 'Four API tests, all green', body: zm(vt(OUT, { title: 'terminal — npx vitest run demo5/supertest.test.js', sm: false }), 1.12) +
    box('Real rules, fake storage, real HTTP', 'Routing, JSON parsing, the error middleware and bookLab all run. Only storage is the in-memory repository — the PostgreSQL adapter of Chapter 4 plugs into the same port.', 'lam') +
    flow([{ t: 'request(app)', s: 'Supertest', mau: '#336791' }, { t: 'Express', s: 'routing, JSON', mau: '#e08a1e' }, { t: 'bookLab', s: 'real rules', mau: '#2f7d4f' }, { t: 'memory repo', s: 'fake storage', mau: '#7a3d12' }], { h: 110, fs: 19 }) },
  { t: 'A status-only test, measured', body: vt(BO, { title: 'terminal — the response loses its status field', fs: 15 }) +
    two(box('Green and blind', `${c('expect(res.status).toBe(201)')} alone stays green when the body breaks. Clients read bodies.`, 'do2'), box('Assert the whole contract', 'Status, the headers that matter (Location, Content-Type) and the body. Lesson 5.4 checks every body against the API description.', 'xanh')) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'A 31-seat student booking: 201, status PENDING, and GET via Location returns the same body',
      'A second student books the next slot: id 2, Location /api/bookings/2',
    ]) + box('Done when', `${c('demo5/th51.test.js')}: 2 passed.`, 'xanh') + box('Hint', `${c('makeApi()')} gives a fresh app, repo and token helper per test — no shared state.`, 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Export the app; only ${c('main.js')} calls ${c('listen')}</li>
    <li>${c('request(app)')} sends real HTTP through Express on a temporary port</li>
    <li>Assert status, important headers and the body</li>
    <li>A status-only test misses broken bodies</li>
    <li>Build a fresh app per test with ${c('makeApi()')}</li></ul>` },
]);
