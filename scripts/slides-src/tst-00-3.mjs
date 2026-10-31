/**
 * tst-00-3 — Testing · Section 0 · Lesson 0.1 "About this course: what you will build" (31/10/2026).
 * Nguồn: content/courses/testing/s00-intro.mjs › tst-0-3-gioi-thieu-du-an (bài MỚI chèn vào Mục 0).
 * Phiên bản công cụ = đo thật (npm view / --version) 31/10/2026.
 */
import { lamDeck, js, two, box, steps, cards, c, flow, zm, vsd } from './_tst-chung.mjs';

export const deck = { key: 'tst-00-3', code: 'TST 0.1', title: 'About this course', sub: 'What you will build' };

const TREE = `labflow-lite/
├─ package.json, vitest.config.js
├─ src/rules/time.js, booking.js   ← Ch 1-2  pure rules
├─ src/app.js, src/routes/         ← Ch 5    Express 5 API
├─ src/db/                         ← Ch 4    PostgreSQL
├─ web/                            ← Ch 6    React screens
├─ e2e/                            ← Ch 7    Playwright
├─ scripts/dot-bien.mjs            ← Lab 1   mutation check
└─ .github/workflows/test.yml      ← Ch 9    CI`;

export const slides = lamDeck({ chuong: 'Section 0 — Introduction', bai: '0.1' }, [
  { cover: true, t: 'About this course:<br>what you will build', sub: 'One real project, tested from the first expect() to CI' },
  { t: 'After this course you can…', to: true, body: `<ul>
    <li>Write clear unit tests with Vitest — and know <b>which values</b> to test</li>
    <li>Test async code, time and errors without flaky results</li>
    <li>Replace a dependency with a fake <b>only</b> when it helps</li>
    <li>Run integration tests against a real PostgreSQL in Docker</li>
    <li>Test an Express API from the outside with Supertest</li>
    <li>Test React screens and full user flows with Playwright</li>
    <li>Read coverage honestly, kill flaky tests, run everything in CI</li></ul>` },
  { t: 'The project: LabFlow Lite', body: flow([
      { t: 'Browser', s: 'React screens', mau: '#2f7d4f' },
      { t: 'Express 5 API', s: 'POST /bookings …', mau: '#336791' },
      { t: 'Rules', s: 'pure functions', mau: '#e08a1e' },
      { t: 'PostgreSQL', s: 'bookings, labs', mau: '#7a3d12' },
    ], { h: 150, fs: 24 }) + `<table class="t"><tr><th>Test kind</th><th>Touches</th><th>Chapters</th></tr>
    <tr><td><b>Unit</b></td><td>Rules only — milliseconds</td><td>1, 2, 3</td></tr>
    <tr><td><b>Integration</b></td><td>Rules + PostgreSQL</td><td>4</td></tr>
    <tr><td><b>API</b></td><td>Express + rules + database, from outside</td><td>5</td></tr>
    <tr><td><b>Component / E2E</b></td><td>React screens · the whole app in a browser</td><td>6, 7</td></tr></table>` },
  { t: 'The business rules you will test', body: `<table class="t"><tr><th>Rule</th><th>What it says</th><th>Where it comes from</th></tr>
    <tr><td>BR-04</td><td>Bookings sit on a 30-minute grid, inside 07:00–21:00</td><td>LabFlow Demo (SWT301 Lab 2)</td></tr>
    <tr><td>BR-05</td><td>At most 14 days ahead — exactly 14 is still valid</td><td>LabFlow Demo</td></tr>
    <tr><td>BR-06</td><td>More than 30 seats needs approval</td><td>LabFlow Demo</td></tr>
    <tr><td>Lite-1</td><td>A booking lasts at most 4 hours</td><td>simplified for this course</td></tr>
    <tr><td>Lite-2</td><td>Lecturers and admins never need approval</td><td>simplified for this course</td></tr>
    <tr><td>later</td><td>No two bookings overlap in one lab · lock after 5 failed logins · cancel ≥ 1 h before</td><td>Ch 2, 4, 5</td></tr></table>` +
    box('Honest label', 'Rules marked <b>Lite</b> are simplifications for teaching. BR-04/05/06 match the LabFlow Demo used in SWT301 Lab 2.', 'lam') },
  { t: 'Why LabFlow Lite, not the Notes API?', body: vsd(
      `<ul style="font-size:21px"><li>Mostly create / read / update / delete</li><li>Few business rules → few interesting values to test</li><li>Great for learning Express (the Node.js course)</li></ul>`,
      `<ul style="font-size:21px"><li>Rule-heavy: grids, windows, limits, roles</li><li>Perfect for boundary values and decision tables</li><li>Same rules as SWT301 Lab 2 and your graduation project</li><li>Small enough to keep in your head</li></ul>`,
      'Notes API', '✓ LabFlow Lite') + box('Know the Notes API already?', 'Every technique transfers unchanged — the test does not care which API it calls.', 'xanh') },
  { t: 'How the project grows, chapter by chapter', body: zm(`<pre class="vs">${TREE.replace(/</g, '&lt;')}</pre>`, 1.05) },
  { t: 'Roadmap (1/2): foundations and the backend', body: `<table class="t"><tr><th>Part</th><th>You learn</th><th>You build</th></tr>
    <tr><td>0 · Start</td><td>What tests are, the pyramid, Vitest setup</td><td>first green test</td></tr>
    <tr><td>1 · First unit tests</td><td>AAA, matchers, naming, boundaries, decision tables</td><td>rules suite + Lab 1 (8 mutants)</td></tr>
    <tr><td>2 · Async, time, errors</td><td>await, fake timers, dates, randomness</td><td>cancellation + lock rules</td></tr>
    <tr><td>3 · Test doubles</td><td>stub, mock, spy, fake — and when not to</td><td>e-mail notifier faked</td></tr>
    <tr><td>4 · Real database</td><td>PostgreSQL in Docker, isolation, data factories</td><td>no-overlap rule in SQL</td></tr>
    <tr><td>5 · HTTP APIs</td><td>Supertest, auth 401/403, validation, contracts</td><td>full booking API suite</td></tr></table>` },
  { t: 'Roadmap (2/2): the UI, quality and the team', body: `<table class="t"><tr><th>Part</th><th>You learn</th><th>You build</th></tr>
    <tr><td>6 · React components</td><td>Testing Library, user events, fetching screens</td><td>booking form tests</td></tr>
    <tr><td>7 · End-to-end</td><td>Playwright, stable locators, traces</td><td>“book a lab” journey</td></tr>
    <tr><td>8 · Coverage &amp; flaky tests</td><td>what coverage hides, mutation testing, speed</td><td>coverage report + fixes</td></tr>
    <tr><td>9 · CI</td><td>GitHub Actions, required checks, sharding</td><td>green badge on every PR</td></tr>
    <tr><td>10 · TDD &amp; teams</td><td>red-green-refactor, legacy code, reviews, interviews</td><td>one feature test-first</td></tr>
    <tr><td>11 · Capstone</td><td>test strategy for a whole app</td><td>LabFlow Lite, fully tested</td></tr></table>` },
  { t: 'Before you start: a 2-minute self-check', body: two(box('You need', `<ul style="font-size:20px"><li>JavaScript: functions, arrow functions, arrays (${c('map')}, ${c('every')}), objects</li><li>${c('import')} / ${c('export')}, ${c('try')}/${c('catch')}</li><li>A terminal: ${c('cd')}, ${c('mkdir')}, ${c('npm install')}</li><li>Node.js 22 (lesson 0.3 installs it)</li></ul>`, 'xanh'),
      box('You do NOT need yet', `<ul style="font-size:20px"><li>TypeScript — optional, shown in 0.3</li><li>React — Chapter 6 starts from zero</li><li>Docker, SQL — Chapter 4 teaches what it uses</li><li>Any testing experience</li></ul>`, 'lam')) },
  { t: 'Tools and versions used in every output', body: `<table class="t"><tr><th>Tool</th><th>Version</th><th>Role</th></tr>
    <tr><td>Node.js</td><td>22.23.3</td><td>runs everything; ${c('node:test')} built in</td></tr>
    <tr><td>Vitest</td><td>5.0.5</td><td>main test runner (needs Node ≥ 22.12)</td></tr>
    <tr><td>fast-check</td><td>4.10.2</td><td>property-based tests (Ch 1)</td></tr>
    <tr><td>Express / Supertest</td><td>5.3.0 / 7.3.1</td><td>the API and its tests</td></tr>
    <tr><td>PostgreSQL · Playwright</td><td>checked in Ch 4 · Ch 7</td><td>real database · real browser</td></tr></table>` +
    box('Real outputs only', 'Every terminal output in this course was produced by running the code — measured on 31/10/2026. Your times (ms) will differ; the shape will not.', 'lam') },
  { t: 'Where you will use this', to: true, body: cards([
      ['🎓 SWT301', 'Lab 2 unit tests, Report 5.1 boundaries, the PE’s test design questions.'],
      ['🧪 LabFlow', 'The same BR-04/05/06 — tested before your SWP391 / SEP490 defence.'],
      ['🟩 SDN302 &amp; Node', 'Any Express project: the API tests of Chapter 5 drop straight in.'],
      ['💼 Internship', '“Show me how you test” — your LabFlow Lite repo is the answer.'],
    ], 2) },
  { t: 'How every lesson is built', to: true, body: steps([
      '<b>📑 Slides</b> in English, each with Vietnamese notes underneath',
      '<b>📖 Written lesson</b> — every example with its real output',
      '<b>🧪 Practice</b> with a “done when” you can check yourself',
      '<b>🗂 Key terms</b> (Vietnamese meaning) and <b>📌 summary</b>',
      '<b>Chapter lab</b> with a rubric · <b>chapter quiz</b>: 10 questions with explanations',
    ]) },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>One project — LabFlow Lite — tested from unit to CI</li>
    <li>Its rules come from LabFlow (BR-04/05/06), so SWT301 and your graduation project benefit</li>
    <li>12 parts: foundations → backend → UI → quality → team → capstone</li>
    <li>You need basic JavaScript and a terminal — nothing else</li>
    <li>All outputs are real: Node 22, Vitest 5</li></ul>` },
]);
