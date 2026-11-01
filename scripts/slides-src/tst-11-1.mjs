/**
 * tst-11-1 — Testing · Chapter 11 · Lesson 11.1 "Planning the test strategy" (01/11/2026). Slug: tst-11-1-ke-hoach.
 * Output = chạy thật (s11/_ma.mjs): ma trận 12 bug × 5 tầng (111-ma-tran), ngân sách kim tự tháp (111-ngan-sach), ma trận truy vết
 * lần đầu (111-rtm-lan-1: nhãn ở describe ⇒ 16 test API "chứng minh" AC6) và lần cuối (111-rtm), LF-301 (111-lf-301), thực hành Lite-2.
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow, tbl } from './_tst-chung.mjs';

export const deck = { key: 'tst-11-1', code: 'TST 11.1', title: 'Planning the test strategy', sub: 'risks, layers, budget, traceability' };

const MATRAN = `| # | Bug | Unit | API | UI | DB | E2E |
| 1 | admins are refused inside the last hour too (AC6) | 🔴 | 🔴 | · | · | · |
| 3 | start read as UTC: cancelling stays open 7 hours too long (Lite-3) | 🔴 | 🔴 | · | · | · |
| 4 | a cancelled slot stays blocked (AC5) | 🔴 | 🔴 | · | · | 🔴 |
| 5 | two cancels at the same moment both succeed (AC4) | 🔴 | · | · | 🔴 | · |
| 6 | PostgreSQL still blocks a cancelled slot (AC5) | · | · | · | 🔴 | · |
| 7 | dates come back from PostgreSQL as JS Dates (AC1) | · | · | · | 🔴 | · |
| 9 | My bookings shows everyone’s bookings (AC1) | · | 🔴 | · | · | · |
| 11 | other rows stay clickable during a cancel | · | · | 🔴 | · | · |
| 12 | the screen calls a URL the API does not have | · | · | · | · | 🔴 |
| | **caught** | 5/12 | 6/12 | 1/12 | 4/12 | 2/12 |`;
const BUDGET = `$ node scripts/ngan-sach.mjs 3
| Layer | Tests | Median of 3 runs | Per test |
| Unit + API (src/) | 299 | 1.6 s | 5 ms |
| UI components (web/) | 24 | 2.3 s | 95 ms |
| DB integration | 19 | 1.5 s | 80 ms |
| E2E, Chromium | 8 | 4.2 s | 521 ms |
| E2E, 5 browsers/devices | 40 | 24.1 s | 602 ms |
| Mutation (Stryker, src/rules) | 433 mutants | 28.7 s | 66 ms |`;
const RTM1 = `$ node scripts/rtm.mjs
| Requirement | Risk | Unit | API | DB | UI | E2E | |
| BR-06 | High | 7 | · | · | · | · | ❌ |
| Lite-1 | Low | · | · | · | · | · | ❌ |
| US-11 AC2 | High | 6 | 16 | · | · | · | ✅ |
| US-11 AC5 | High | 6 | 16 | 3 | · | · | ✅ |
| US-11 AC6 | Low | · | 16 | · | · | · | ✅ |
**Gaps:**
- BR-06: High risk, tested only at the Unit layer
- Lite-1: no passing test
- Lite-2: no passing test`;
const TAG = `// ✗ a range on the describe: every test inside "proves" AC2…AC6
describe('POST /api/bookings/:id/cancel (US-11 AC2–AC6)', () => { … });
// ✓ the story on the describe, the criterion on the test
describe('POST /api/bookings/:id/cancel (US-11)', () => {
  it('409 ALREADY_CANCELLED the second time (AC4)', …);
});`;
const RTM = `$ node scripts/rtm.mjs --run
350 tests read, 350 passed.
| Requirement | Risk | Unit | API | DB | UI | E2E | |
| BR-04 | High | 11 | 1 | 7 | · | 1 | ✅ |
| BR-05 | Medium | 12 | · | · | · | · | ✅ |
| BR-06 | High | 7 | 1 | · | · | 1 | ✅ |
| Lite-3 | High | 7 | 2 | · | · | · | ✅ |
| US-11 AC1 | High | 2 | 1 | 2 | 1 | 1 | ✅ |
| US-11 AC2 | High | 5 | 3 | 1 | 2 | 1 | ✅ |
| US-11 AC5 | High | 1 | 1 | 1 | · | 1 | ✅ |
| US-11 AC6 | Low | 2 | 2 | · | · | · | ✅ |
Every in-scope requirement is traced to a passing test.`;
const LF = `$ npx vitest run demo11/ke-hoach/lf-301.test.js
   × BR-05 at the API: a booking 30 days ahead is refused with 422 42ms
AssertionError: expected 201 to be 422 // Object.is equality
      Tests  1 failed (1)`;
const LF_TEST = `it('BR-05 at the API: a booking 30 days ahead is refused with 422', async () => {
  const api = makeApi({ now: () => new Date('2026-11-01T09:00:00+07:00') });
  const res = await request(api.app).post('/api/bookings')
    .set('Authorization', await api.bearer('an')).send(body({ date: '2026-12-01' }));
  expect(res.status).toBe(422);
});`;


// Markdown tables printed by the scripts → slide tables (same cells, nothing reworded).
const md = (text) => text.split('\n').filter((l) => l.startsWith('|')).map((l) => l.slice(1, -1).split('|').map((x) => x.trim().replace(/\*\*/g, '')));
const mdTbl = (text, opts) => { const [head, ...rows] = md(text); return tbl(head, rows, opts); };

export const slides = lamDeck({ chuong: 'Chapter 11 — Capstone: a fully tested booking app', bai: '11.1' }, [
  { cover: true, t: 'Planning the test strategy', sub: 'Chapter 11 · Lesson 11.1 — one release of LabFlow Lite, planned from its risks and measured layer by layer' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Start a test plan from <b>what changes</b> and <b>what could hurt</b>: scope and a risk table</li>
    <li>Choose the layer for each risk with <b>data</b>: which layer catches which bug</li>
    <li>Give the pyramid a <b>budget in seconds</b>, and keep to it</li>
    <li>Write entry and exit criteria and a definition of done a reviewer can check</li>
    <li>Generate a <b>traceability matrix</b> from real test reports — and read its gaps</li></ul>` },
  { t: 'The release: US-11 “My bookings”', body: two(box('US-11 — as a student, I see and cancel my bookings', `<b>AC1</b> only my bookings, by date and start, cancelled ones too<br><b>AC2</b> cancel until 60 minutes before the start; at 59: ${c('TOO_LATE_TO_CANCEL')}<br><b>AC3</b> someone else’s booking looks missing: 404<br><b>AC4</b> cancelling twice — even at the same moment — succeeds once<br><b>AC5</b> a cancelled slot can be booked again<br><b>AC6</b> an admin may cancel any booking, at any time`, 'lam'),
      box('Scope', `<b>In:</b> two endpoints, the PostgreSQL adapter, the exclusion constraint, the My bookings screen — and regression of booking (BR-04/05/06, Lite-1/2).<br><br><b>Out:</b> BR-02, BR-07…BR-10 — tested library code that no endpoint calls in 1.1. Five browsers run at night, not on every PR.`, 'xanh')) },
  { t: 'Risks first: likelihood × impact', body: zm(tbl(['#', 'Risk', 'L', 'I', 'Score', 'Tested where'], [
      ['R1', 'Lite-3 read in the server’s time zone', '3', '3', '<b>9</b>', 'Unit table, Stryker in UTC, nightly in VN time'],
      ['R2', 'a student sees or cancels someone else’s booking', '2', '3', '<b>6</b>', 'API per role, contract, E2E'],
      ['R3', 'PostgreSQL keeps a cancelled slot blocked', '3', '2', '<b>6</b>', 'DB integration'],
      ['R4', 'dates come back as JS Dates, contract broken', '3', '2', '<b>6</b>', 'DB + openapi.json check'],
      ['R5', 'the overlap query change breaks booking', '2', '3', '<b>6</b>', 'unit, DB, mutation, E2E'],
      ['R6', 'two cancels at the same moment both succeed', '2', '2', '4', 'DB race test'],
      ['R7', 'the screen calls the wrong URL', '1', '3', '3', 'one E2E journey'],
      ['R8', 'the user is not told, or clicks twice', '2', '1', '2', 'component tests'],
    ], { hl: [0, 1, 2, 3, 4] }), 0.92) + box('The rule', `Score ≥ 6 is <b>High</b>: it needs at least one test <b>above the Unit layer</b>. A risk row without a “where” column is decoration.`, '') },
  { t: 'Which layer catches which bug — measured', body: zm(mdTbl(MATRAN, { cap: 'node scripts/ma-tran-bat-loi.mjs — 12 planted bugs × 5 layers (9 of 12 rows shown)', hl: [9] }), 0.95) +
    two(box('No layer sees half', `The best layer caught <b>6 of 12</b>. Bugs 6 and 7: only DB. Bug 11: only UI. Bug 12: only E2E.`, 'do2'), box('So the pyramid is not a fashion', `Each layer is there because it sees something the others <b>cannot</b>. Its size is a question of cost.`, 'xanh')) },
  { t: 'The pyramid has a budget in seconds', body: mdTbl(BUDGET, { cap: '$ node scripts/ngan-sach.mjs 3 — each command run 3 times in a fresh process' }) +
    two(box('Budget', `Before a push (unit, UI, DB): <b>under 15 s</b> — today 5.4 s.<br>A pull request: <b>under 10 minutes</b>.<br>Slower than that: the <b>nightly</b> run.`, 'lam'),
      box('Measured with act', `PR pipeline on a laptop: <b>8 min 48 s</b> warm, <b>11 min</b> cold — installing Chromium alone took about <b>6½ minutes</b>.`, '')) },
  { t: 'Entry criteria, exit criteria, definition of done', body: two(box('Entry — before testing starts', `• the six ACs are agreed and written in ${c('requirements.json')}<br>• the branch builds; ${c('npm ci')} works from the lockfile<br>• Docker (or a PostgreSQL 17 URL) and Chromium available`, 'lam'),
      box('Exit — before it ships', `• ${c('ci-ok')} green: unit, UI, DB, E2E, mutation, report<br>• coverage ≥ 97 / 91 / 96 / 97 · mutation ≥ 95%<br>• every in-scope requirement traced; High ones above Unit<br>• no open High defect; Medium only with owner + date<br>• last nightly run green`, 'xanh')) +
    box('Definition of done (per story)', `Every AC has a passing test tagged with its id · reviewed with the 10.3 checklist · ${c('openapi.json')} documents every new status · no ${c('.only')} or skip added · the plan’s numbers updated.`, '') },
  { t: 'Traceability: ids in test names — tag the narrowest test', body: js(TAG, { sm: true, hl: [2, 4] }) + two(mdTbl(RTM1, { cap: 'node scripts/rtm.mjs — the first run (5 of 17 rows)', hl: [2, 3, 4] }), box('Gaps', `- BR-06: High risk, tested only at the Unit layer<br>- Lite-1: no passing test<br>- Lite-2: no passing test`, 'do2'), 'r64') +
    box('What the first run said', `AC6 (admin only) “proven” by <b>16</b> API tests — only two involve an admin. A matrix that over-claims is worse than none. And Lite-1, Lite-2 had tests, but no test said so.`, 'do2') },
  { t: 'The matrix that gates the merge', body: two(mdTbl(RTM, { cap: 'node scripts/rtm.mjs --run — 350 tests read, 350 passed (9 of 17 rows)' }),
      box('How it works', `<b>1.</b> Run the four suites with JSON reporters.<br><b>2.</b> File → layer: src/api API, test/integration DB, web UI, e2e E2E.<br><b>3.</b> Count <b>passing</b> tests per id.<br><b>4.</b> Gap ⇒ exit 1: in scope with no test, or High with Unit only.<br><br>Last line of the run: <i>Every in-scope requirement is traced to a passing test.</i>`, 'lam')) },
  { t: 'What the matrix found: LF-301', body: js(LF_TEST, { sm: true, hl: [5] }) + vt(LF, { title: 'demo11/ke-hoach/lf-301.test.js — BR-05 asked through the API', fs: 15 }) +
    two(box('Why it was invisible', `BR-05 had <b>12</b> unit tests (${c('isWithinBookingWindow')}, ${c('daysAheadVN')}). No endpoint calls them: ${c('POST /api/bookings')} accepts a booking 30 days ahead.`, 'do2'),
      box('The exit-criteria decision', `Severity <b>Medium</b> ⇒ may ship with an <b>owner and a date</b>: logged as LF-301, fixed in 1.2 with this test first.`, 'xanh')) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Lite-2 (“lecturers and admins never need approval”) is tested only at the Unit layer`,
      `Write ${c('src/api/rules.api.test.js')}: 40 seats as LECTURER, ADMIN → CONFIRMED (Lite-2); STUDENT → PENDING (BR-06)`,
      `Run the suite with a JSON report, then ${c('node scripts/rtm.mjs')} and read the Lite-2 row`,
    ]) + box('Measured', `Before: ${c('| Lite-2 | Medium | 2 | · | …')} · after: ${c('| Lite-2 | Medium | 2 | 2 | …')} and BR-06 gains its first API test.`, 'lam') +
    box('Done when', 'Three new tests pass, the Lite-2 row shows 2 in the API column, and you can say why an id belongs on the test, not the describe.', 'xanh') },
]);
