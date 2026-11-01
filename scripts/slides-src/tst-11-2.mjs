/**
 * tst-11-2 — Testing · Chapter 11 · Lesson 11.2 "Testing the backend end to end" (01/11/2026). Slug: tst-11-2-backend.
 * Output = chạy thật (s11/_ma.mjs): bảng quyết định cancelDecision (112-rule), Stryker 97,73% ở Hà Nội vs 100% ở UTC (112-stryker-vn/utc),
 * service + API (112-service, 112-api), bốn bug chỉ PostgreSQL thấy — unit 298 passed, tích hợp đỏ (112-pg-*), mutation 99,08% (112-mutation).
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow, tbl, sql } from './_tst-chung.mjs';

export const deck = { key: 'tst-11-2', code: 'TST 11.2', title: 'Testing the backend end to end', sub: 'rule, service, PostgreSQL, API' };

const RULE = `export function cancelDecision(booking, user, now) {
  const isAdmin = user.role === 'ADMIN';
  if (!booking || (booking.userId !== user.id && !isAdmin))
    return { ok: false, code: 'NOT_FOUND' };
  if (booking.status === 'CANCELLED')
    return { ok: false, code: 'ALREADY_CANCELLED' };
  if (!isAdmin && !canCancel(startsAtVN(booking.date, booking.start), now))
    return { ok: false, code: 'TOO_LATE_TO_CANCEL' };
  return { ok: true };
}`;
const TABLE = `it.each([
  ['the owner, exactly 60 minutes before (Lite-3, AC2)', booking, an, '08:00', { ok: true }],
  ['the owner, 59 minutes before (Lite-3, AC2)', booking, an, '08:01', { ok: false, code: 'TOO_LATE_TO_CANCEL' }],
  ['a lecturer who does not own it (AC3)', booking, thay, '07:00', { ok: false, code: 'NOT_FOUND' }],
  ['an admin, 30 minutes before — admins are not bound by Lite-3 (AC6)', booking, boss, '08:30', { ok: true }],
  …   // 13 rows: who asks × status × time left
])('%s', (_, b, user, clock, expected) => {
  expect(cancelDecision(b, user, at(clock))).toEqual(expected);
});`;
const RULE_OUT = `$ npx vitest run src/rules/cancel.test.js
 ✓ src/rules/cancel.test.js (18 tests) 7ms
   ✓ cancelDecision — who may cancel, and until when (US-11) (13)
     ✓ the owner, 59 minutes before (Lite-3, AC2) 0ms
     ✓ an admin, 30 minutes before — admins are not bound by Lite-3 (AC6) 0ms
      Tests  18 passed (18)`;
const VN = `$ TZ=Asia/Ho_Chi_Minh npx stryker run --mutate src/rules/cancel.js
[Survived] StringLiteral
src/rules/cancel.js:12:40
-     return new Date(date + 'T' + start + ':00+07:00');
+     return new Date(date + 'T' + start + "");
All files  |  97.73 |   97.73 |       43 |         0 |          1 | …`;
const UTC = `$ npx stryker run --mutate src/rules/cancel.js
All files  | 100.00 |  100.00 |       44 |         0 |          0 | …`;
const FIX = `// stryker.config.mjs — lesson 11.2
process.env.TZ ??= 'UTC';`;
const SVC = `const decision = cancelDecision(await repo.findById(id), user, now);
if (!decision.ok) return decision;
const booking = await repo.cancel(id);   // one atomic step
return booking ? { ok: true, booking }
               : { ok: false, code: 'ALREADY_CANCELLED' };`;
const SVC_OUT = `$ npx vitest run src/booking/myBookings.test.js
     ✓ two cancels at the same moment: exactly one wins (AC4) 23ms
      Tests  7 passed (7)
$ npx vitest run src/api/myBookings.test.js
     ✓ Lite-3: at 07:01 (59 minutes before) → 422 TOO_LATE_TO_CANCEL (AC2) 22ms
     ✓ thay (LECTURER) cancelling an’s booking → 404 (AC3) 23ms
     ✓ id 2147483648 → 404, never 500 15ms
      Tests  18 passed (18)`;
const NGAY = `planted in src/booking/pgRepo.js:  to_char(date, 'YYYY-MM-DD') AS date  →  date
     × listByUser: my rows only, in the API shape, by date and start (AC1) 38ms
     × two cancels at the same moment: one wins, one ALREADY_CANCELLED (AC4) 34ms
-     "date": "2026-11-16",
+     "date": 2026-11-15T17:00:00.000Z,
-   "ALREADY_CANCELLED",
-   "ok",
+   "TOO_LATE_TO_CANCEL",
+   "TOO_LATE_TO_CANCEL",`;
const UPD = `UPDATE bookings SET status = 'CANCELLED'
 WHERE id = $1 AND status <> 'CANCELLED'
RETURNING …`;
const RACE = `     × two cancels at the same moment: one wins, one ALREADY_CANCELLED (AC4) 40ms
-   "ALREADY_CANCELLED",
+   "ok",`;
const WHERE = `CONSTRAINT no_overlap EXCLUDE USING gist (
  lab WITH =,
  tsrange(date + start_time, date + end_time, '[)') WITH &&
) WHERE (status <> 'CANCELLED')`;
const WHERE_OUT = `     × a cancelled slot can be booked again — the exclusion constraint ignores CANCELLED rows (AC5) 47ms
Caused by: error: conflicting key value violates exclusion constraint "no_overlap"
      Tests  1 failed | 7 passed (8)`;
const MUT = `$ npm run test:mutation
04:48:34 (11164) INFO Instrumenter Instrumented 10 source file(s) with 433 mutant(s)
All files     |  99.08 |   99.08 |      427 |         2 |          4 | …
 cancel.js    | 100.00 |  100.00 |       44 |         0 |          0 |
$ npm run test:cov
All files          |   98.32 |     93.3 |   97.47 |   98.93 |`;

export const slides = lamDeck({ chuong: 'Chapter 11 — Capstone: a fully tested booking app', bai: '11.2' }, [
  { cover: true, t: 'Testing the backend end to end', sub: 'Chapter 11 · Lesson 11.2 — US-11 from a pure rule to a real PostgreSQL, and what each layer saw' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Turn a rule with several conditions into a <b>decision table</b> of tests</li>
    <li>Read a mutation score as a fact about <b>where</b> the tests ran — time zone included</li>
    <li>Test a service and an HTTP API on an in-memory repository, <b>against the contract</b></li>
    <li>Find the bugs that <b>only the real PostgreSQL</b> can show: types, constraints, races, limits</li>
    <li>Keep the mutation score ≥ the 98.99% of Chapter 10 while adding code</li></ul>` },
  { t: 'US-11 on the backend: four small pieces', body: flow([{ t: 'Rule', s: 'cancelDecision — pure' }, { t: 'Service', s: 'cancelMyBooking', mau: '#2f7d4f' }, { t: 'Repository', s: 'memory | PostgreSQL', mau: '#b85a2b' }, { t: 'HTTP API', s: 'GET · POST …/cancel', mau: '#8e44ad' }], { h: 150, fs: 21 }) +
    js(RULE, { sm: true, hl: [7] }) + (box('Why this shape', `The rule decides; the service only fetches and saves; the API only maps codes to statuses: ${c('NOT_FOUND → 404')}, ${c('ALREADY_CANCELLED → 409')}, ${c('TOO_LATE_TO_CANCEL → 422')}. Each piece is tested where it is cheapest.`, 'lam')) },
  { t: 'A decision table becomes it.each', body: js(TABLE, { sm: true, hl: [3, 5] }) + vt(RULE_OUT, { fs: 13 }) + (box('Same as SWT301 4.4', `Each column of the decision table — who asks × status × minutes left — becomes one row. 60 and 59 minutes are the boundary; the admin row is the exception.`, 'xanh')) },
  { t: 'Same tests, same code: 97.73% in Ha Noi, 100% in UTC', body: vt(VN, { title: 'laptop in Viet Nam', fs: 14 }) + vt(UTC, { title: 'same command in UTC (CI, servers)', fs: 14 }) +
    two(js(FIX, { sm: true }), box('Not an equivalent mutant', `Without the offset the string is read in the machine’s zone. In Ha Noi that <b>is</b> +07:00 — no test can see it. On a UTC server cancelling stays open 7 hours too long. Mutation runs in UTC; the nightly unit run uses Viet Nam time.`, 'do2')) },
  { t: 'Service and API: fast, on the in-memory repository', body: js(SVC, { sm: true, hl: [3] }) + vt(SVC_OUT, { fs: 13 }) +
    box('What these layers prove', `The rule is wired correctly; the race between two cancels has one winner; every status code and body is checked with ${c('contractErrors()')} against ${c('openapi.json')}; an id like ${c('2147483648')} answers 404.`, 'xanh') },
  { t: 'Four bugs only PostgreSQL can show', body: zm(tbl(['Bug planted', 'Unit + API suite', 'DB integration'], [
      [`${c("to_char(date, 'YYYY-MM-DD') AS date")} → ${c('date')}`, '298 passed', '<b>4 failed</b>'],
      [`constraint without ${c("WHERE (status <> 'CANCELLED')")}`, 'does not touch SQL', '<b>1 failed</b> — 23P01'],
      [`${c("UPDATE … WHERE id = $1")} without the status check`, 'does not touch SQL', '<b>1 failed</b> — both “ok”'],
      [`no ${c('id > MAX_ID')} check`, '298 passed', '<b>1 failed</b> — 500, not 404'],
    ]), 1.05) + box('Why', `The in-memory repository stores strings, has no constraint, no driver and no 4-byte integers. It is fast <b>because</b> it is not PostgreSQL — so it cannot fail like PostgreSQL.`, 'do2') },
  { t: 'Dates: a JS Date at local midnight — and every cancel is “too late”', body: vt(NGAY, { title: 'DB integration, with the planted bug', fs: 14 }) +
    two(box('What happened', `node-postgres turns a ${c('date')} column into a JS ${c('Date')} at <b>local</b> midnight: 16 November in Ha Noi is ${c('2026-11-15T17:00:00.000Z')}. ${c('startsAtVN()')} cannot read it, so the rule answers TOO_LATE for everyone.`, 'do2'),
      box('The fix', `Format in SQL, where the value is still what was stored: ${c("to_char(date, 'YYYY-MM-DD')")}, ${c("to_char(start_time, 'HH24:MI')")}.`, 'xanh')) },
  { t: 'One statement, not two: the atomic cancel and the partial constraint', body: two(sql(UPD, { sm: true, hl: [2] }), sql(WHERE, { sm: true, hl: [4] }), 'r46') + vt(RACE, { title: 'planted: the UPDATE without the status check', fs: 13 }) + vt(WHERE_OUT, { title: 'planted: the constraint without WHERE', fs: 13 }) +
    box('Check-then-act belongs in the database', `“Is it still active? Then cancel it” in two steps lets two requests both win. Put the condition in the ${c('UPDATE')}; let the constraint ignore cancelled rows — and test both on the real engine with two warm connections.`, '') },
  { t: 'The whole backend, measured', to: true, body: vt(MUT, { title: 'mutation + coverage on the full unit suite', fs: 14 }) +
    two(box('Mutation', `<b>99.08%</b> of 433 mutants — above the <b>98.99%</b> of Chapter 10. ${c('cancel.js')} 44/44. The 4 survivors are the old ones (code.js, days.js ×2, recurring.js).`, 'xanh'),
      box('Coverage', `98.32 / 93.3 / 97.47 / 98.93 — over the new minimum 97 / 91 / 96 / 97 (lesson 11.4).`, 'lam')) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Write ${c('demo11/th112/huy-hai-lan.int.test.js')}: on PostgreSQL, cancel the same booking twice`,
      `Expect ${c('409 ALREADY_CANCELLED')} and ${c("contractErrors('post', '/api/bookings/{id}/cancel', res)")} → ${c('[]')}`,
      `Plant ${c('ALREADY_CANCELLED: 409 → 400')} with ${c('scripts/thu-loi.mjs')} and watch it go red`,
    ]) + box('Measured', `Green: ${c('Tests  1 passed (1)')}. Planted: ${c('expected [ 400, …] to deeply equal [ 409, …]')}.`, 'lam') +
    box('Done when', 'Your test is green on PostgreSQL, red with the planted 400, and you can say which layer would miss it.', 'xanh') },
]);
