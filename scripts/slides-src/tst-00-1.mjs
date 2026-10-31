/**
 * tst-00-1 — Testing · Section 0 · Lesson 0.2 "The test pyramid (and the trophy)" (31/10/2026). Slug bài: tst-0-1-kim-tu-thap.
 * Số đo: chạy thật 4 lần test/do-toc-do.test.js (200 lần checkSlot vs 200 request Supertest→Express 5) trên Node 22.23.3 + Vitest 5.0.5.
 * Nguồn: martinfowler.com/bliki/TestPyramid.html (Cohn 2009), kentcdodds.com (trophy 06/02/2018).
 */
import { lamDeck, js, vt, two, box, steps, c, zm, pyr, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-00-1', code: 'TST 0.2', title: 'The test pyramid', sub: 'and the trophy' };

const UNIT = `import { it, expect } from 'vitest';
import { checkSlot } from '../src/rules/booking.js';

it('unit: 06:30 is before opening time', () => {
  expect(checkSlot('06:30', '08:00'))
    .toEqual({ ok: false, code: 'OUTSIDE_HOURS' });
});`;
const API = `import request from 'supertest';
import { buildApp } from '../src/app.js';

it('api: POST /bookings at 06:30 → 400', async () => {
  const res = await request(buildApp()).post('/bookings')
    .send({ lab: 'BE-201', seats: 20, role: 'STUDENT',
            start: '06:30', end: '08:00' });
  expect(res.status).toBe(400);
  expect(res.body).toEqual({ error: 'OUTSIDE_HOURS' });
});`;
const DO = `$ npx vitest run test/do-toc-do.test.js

 ✓ test/do-toc-do.test.js (2 tests) 152ms
   ✓ 200 unit checks 3ms
   ✓ 200 HTTP requests through Express 149ms

 Test Files  1 passed (1)
      Tests  2 passed (2)`;

/** Ốc quế kem: kim tự tháp lộn ngược + "kem" thủ công ở trên. */
const cone = () => `<svg viewBox="0 0 520 380" width="520" height="380" font-family="Arial">
  <ellipse cx="260" cy="70" rx="200" ry="60" fill="#f6d6e2" stroke="#c76b8f" stroke-width="3"/>
  <text x="260" y="66" text-anchor="middle" font-size="22" font-weight="800" fill="#8a2d52">manual testing</text>
  <text x="260" y="92" text-anchor="middle" font-size="16" fill="#8a2d52">click through everything, every release</text>
  <polygon points="80,130 440,130 380,210 140,210" fill="#c0392b"/><text x="260" y="177" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">E2E: many, slow, flaky</text>
  <polygon points="140,214 380,214 330,290 190,290" fill="#e08a1e"/><text x="260" y="258" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">integration: some</text>
  <polygon points="190,294 330,294 260,372" fill="#336791"/><text x="260" y="330" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">unit: few</text>
</svg>`;

/** Chiếc cúp: static đế, unit, integration (to nhất), e2e trên. */
const trophy = () => `<svg viewBox="0 0 520 400" width="520" height="400" font-family="Arial">
  <rect x="215" y="10" width="90" height="56" rx="10" fill="#c0392b"/><text x="260" y="44" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">E2E</text>
  <path d="M110,72 L410,72 L380,210 L140,210 Z" fill="#e08a1e"/><text x="260" y="140" text-anchor="middle" font-size="25" font-weight="800" fill="#fff">Integration</text>
  <text x="260" y="166" text-anchor="middle" font-size="15" fill="#fff">the biggest part</text>
  <rect x="190" y="216" width="140" height="70" rx="8" fill="#336791"/><text x="260" y="257" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">Unit</text>
  <rect x="120" y="292" width="280" height="56" rx="8" fill="#5b6b7a"/><text x="260" y="321" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">Static</text>
  <text x="260" y="340" text-anchor="middle" font-size="14" fill="#fff">ESLint, TypeScript</text>
  <text x="260" y="385" text-anchor="middle" font-size="15" fill="#666">Kent C. Dodds, 2018 — “return on investment”</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Section 0 — Introduction', bai: '0.2' }, [
  { cover: true, t: 'The test pyramid<br>(and the trophy)', sub: 'Unit · integration · end-to-end — measured on LabFlow Lite' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The same rule tested at two levels — and the speed difference, <b>measured</b></li>
    <li>What each level buys: speed, confidence, cost of a failure</li>
    <li>The test pyramid (Mike Cohn) and its anti-pattern, the ice-cream cone</li>
    <li>The testing trophy (Kent C. Dodds) — and why the two agree more than they fight</li>
    <li>Where LabFlow Lite’s tests will live, level by level</li></ul>` },
  { t: 'One rule, two levels: the same 06:30 booking', body: two(js(UNIT, { sm: true }), js(API, { sm: true })) + flow([{ t: 'HTTP request', s: 'Supertest', mau: '#2f7d4f' }, { t: 'express.json()', s: 'parse body', mau: '#336791' }, { t: 'POST /bookings', s: 'route', mau: '#336791' }, { t: 'checkSlot()', s: 'the rule', mau: '#e08a1e' }, { t: '400 + JSON', s: 'response', mau: '#c0392b' }], { h: 120, fs: 19 }) +
    box('Same question, different distance', `Left: call ${c('checkSlot')} directly. Right: send an HTTP request through Express, JSON parsing, routing and error handling — and check the response.`, 'lam') },
  { t: 'Measured: 200 checks each, on this laptop', body: two(vt(DO, { title: 'terminal — Node 22.23.3 · Vitest 5.0.5', sm: false }), `<div>${box('Per check', `unit ≈ <b>0.015 ms</b><br>HTTP ≈ <b>0.75–1 ms</b><br>(4 runs: 149–207 ms per 200)`, 'xanh')}${box('So what?', 'At this rate 2,000 unit checks need about 30 ms and 2,000 HTTP checks about 2 s. A real browser is slower again — Chapter 7 measures it.', 'lam')}</div>`, 'r64') },
  { t: 'What each level buys — and costs', body: `<table class="t"><tr><th></th><th>Unit</th><th>Integration / API</th><th>End-to-end</th></tr>
    <tr><td><b>Speed</b></td><td>microseconds–ms</td><td>ms–seconds</td><td>seconds per test</td></tr>
    <tr><td><b>Confidence</b></td><td>this function is right</td><td>the parts fit together</td><td>a user can do the job</td></tr>
    <tr><td><b>When red, you know</b></td><td>the exact line</td><td>which join or query</td><td>“something on this page”</td></tr>
    <tr><td><b>Breaks for unrelated reasons</b></td><td>rarely</td><td>sometimes (data, ports)</td><td>often (timing, layout)</td></tr>
    <tr><td><b>Cost to write &amp; keep</b></td><td>low</td><td>medium</td><td>high</td></tr></table>` +
    box('The trade-off in one line', 'Higher up = closer to the truth the user lives, but slower, flakier and harder to diagnose.', 'lam') },
  { t: 'The test pyramid: many fast tests at the bottom', body: two(pyr([
      { t: 'E2E', mau: '#c0392b' },
      { t: 'Integration', s: 'API · database', mau: '#e08a1e' },
      { t: 'Unit', s: 'rules, pure functions', mau: '#336791' },
    ], { w: 560, h: 380 }), `<div style="font-size:22px"><p>Mike Cohn popularised it in <i>Succeeding with Agile</i> (2009).</p><p style="margin-top:10px">Width = <b>how many</b> tests. Lots of cheap unit tests, fewer integration tests, a handful of end-to-end journeys.</p><p style="margin-top:10px">It is a rule about <b>proportion</b>, not about skipping any level.</p></div>`, 'r64') },
  { t: 'The anti-pattern: the ice-cream cone', body: two(cone(), `<div style="font-size:21px"><p>Upside down: mostly UI tests and manual clicking, very few unit tests.</p><p style="margin-top:10px">Symptoms: the suite takes 40 minutes, fails “randomly”, nobody knows which line broke, people re-run until green — and finally switch tests off.</p><p style="margin-top:10px"><b>Fix:</b> push each check <b>down</b> to the lowest level that can catch it.</p></div>`, 'r46') },
  { t: 'The testing trophy (2018)', body: two(trophy(), `<div style="font-size:21px"><p>Kent C. Dodds, for JavaScript apps: <b>static</b> checks at the base, then unit, a <b>big</b> integration layer, a little E2E.</p><p style="margin-top:10px">His argument: integration tests give the best <b>return on investment</b> — close to how users use the app, still fast enough.</p><p style="margin-top:10px">“Write tests. Not too many. Mostly integration.” — Guillermo Rauch (2016), the line Dodds built on.</p></div>`, 'r46') },
  { t: 'Pyramid vs trophy: they agree more than they fight', body: two(box('Both say', `<ul style="font-size:20px"><li>Few end-to-end tests — they are slow and fragile</li><li>Fast feedback matters</li><li>Test behaviour users care about, not private details</li><li>Push each check to the cheapest level that catches it</li></ul>`, 'xanh'),
      box('They differ on', `<ul style="font-size:20px"><li>How big the middle should be</li><li>What “unit” means: one function, or one behaviour with its real helpers?</li><li>Static checks (types, lint) as a layer of their own</li></ul>`, 'lam')) +
    box('Pick by your code, not by fashion', 'Rule-heavy backend (LabFlow rules) → more unit tests. Glue code (routes, React screens) → more integration tests.', '') },
  { t: 'LabFlow Lite: where each test lives', body: `<table class="t"><tr><th>What to check</th><th>Level</th><th>Why there</th></tr>
    <tr><td>30-minute grid, 14 days, 30 seats</td><td><b>Unit</b> (Ch 1)</td><td>pure rules, many boundary values</td></tr>
    <tr><td>Cancel ≥ 1 h before, lock after 5 fails</td><td><b>Unit</b> + fake clock (Ch 2)</td><td>time must be controlled</td></tr>
    <tr><td>No two bookings overlap in one lab</td><td><b>Integration</b> (Ch 4)</td><td>only a real database proves it</td></tr>
    <tr><td>401 vs 403, validation, JSON shape</td><td><b>API</b> (Ch 5)</td><td>HTTP is the contract</td></tr>
    <tr><td>Booking form shows errors</td><td><b>Component</b> (Ch 6)</td><td>what the user sees</td></tr>
    <tr><td>Log in → book → see it listed</td><td><b>E2E</b> (Ch 7)</td><td>one journey, end to end</td></tr></table>` },
  { t: 'Rules of thumb you can use tomorrow', to: true, body: steps([
      'Test a <b>rule</b> with unit tests — every boundary, every row of the decision table',
      'Test a <b>join</b> (code ↔ database, client ↔ API) with an integration test',
      'Test a <b>journey</b> users pay for with one E2E test — not every button',
      'When an E2E test fails, add the <b>lower-level test</b> that would have caught it',
      'A slow, flaky test is a bug in the suite: fix it or move it down',
    ]) },
  { t: 'Practice: place 8 tests on the pyramid', body: `<table class="t"><tr><th>#</th><th>Test</th><th>Your level?</th></tr>
    <tr><td>1</td><td>${c("formatTime(450)")} returns ${c("'07:30'")}</td><td></td></tr>
    <tr><td>2</td><td>Two students cannot book BE-201 at the same time</td><td></td></tr>
    <tr><td>3</td><td>${c('GET /bookings')} without a token answers 401</td><td></td></tr>
    <tr><td>4</td><td>Booking 14 days ahead is accepted</td><td></td></tr>
    <tr><td>5</td><td>The form shows “outside opening hours” under the time field</td><td></td></tr>
    <tr><td>6</td><td>A lecturer logs in, books a lab, sees it on “My bookings”</td><td></td></tr>
    <tr><td>7</td><td>A 31-seat student booking is stored as PENDING in PostgreSQL</td><td></td></tr>
    <tr><td>8</td><td>The page title is exactly “LabFlow Lite”</td><td></td></tr></table>` },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Same rule, two levels: unit ≈ 0.015 ms, HTTP ≈ 1 ms per check (measured)</li>
    <li>Higher levels: more realistic, slower, flakier, harder to diagnose</li>
    <li>Pyramid = proportion: many unit, some integration, few E2E</li>
    <li>Ice-cream cone = mostly UI + manual → slow, flaky, abandoned</li>
    <li>Trophy = bigger integration layer + static checks; same spirit</li>
    <li>Rule → unit · join → integration · journey → E2E</li></ul>` },
]);
