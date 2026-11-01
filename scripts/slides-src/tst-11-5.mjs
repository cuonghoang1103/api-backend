/**
 * tst-11-5 — Testing · Chapter 11 · Lesson 11.5 "Final project: US-11, graded out of 100" (01/11/2026). Slug: tst-11-5-du-an-cuoi-khoa.
 * Output = chạy thật (s11/_ma.mjs): máy chấm scripts/cham-cuoi-khoa.mjs trên bản yếu capstone/yeu = 42/100 (115-cham-yeu),
 * trên bản tham khảo = 100/100 (115-cham-ref); 12 bug của capstone/mutants.mjs; ma trận tầng 111-ma-tran; mutation 99,08% (112-mutation).
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-11-5', code: 'TST 11.5', title: 'Final project: US-11, graded out of 100', sub: 'from 42/100 to 100/100' };

const YEU = `$ node scripts/cham-cuoi-khoa.mjs --from capstone/yeu
  5/5   A. green on the correct code: unit + API      (UI, DB, E2E: 5/5 too)
      ✘ SURVIVED           #1 admins are refused inside the last hour too (AC6)
      ✘ SURVIVED           #2 a lecturer can cancel anyone's booking (AC3)
      ✔ killed by unit + API #3 start read as UTC: cancelling stays open 7 hours too long (Lite-3)
      ✘ SURVIVED           #4 … #11 (8 more survivors)
      ✔ killed by E2E        #12 the screen calls a URL the API does not have
  6/36  B. bugs your tests catch — 2/12
  0/6   C. coverage thresholds (npm run test:cov)
  8/8   C. mutation score ≥ break (npm run test:mutation)
  0/10  D. traceability of US-11 and Lite-3 — Lite-3: High risk, tested only at the Unit layer; …
  4/10  E. test plan — missing: Entry criteria, Exit criteria, Traceability, Definition of done · …
  4/10  F. CI pipeline
Total: 42/100 — not yet: read the lines with fewer points`;

const REF = `$ node scripts/cham-cuoi-khoa.mjs
  5/5   A. green on the correct code: unit + API      (UI, DB, E2E: 5/5 too)
      ✔ killed by unit + API #1 … #5, #9, #10   (7 bugs)
      ✔ killed by DB         #6 PostgreSQL still blocks a cancelled slot (AC5)
      ✔ killed by DB         #7 dates come back from PostgreSQL as JS Dates (AC1)
      ✔ killed by DB         #8 the cancel UPDATE is not atomic: both win (AC4)
      ✔ killed by UI         #11 other rows stay clickable during a cancel
      ✔ killed by E2E        #12 the screen calls a URL the API does not have
 36/36  B. bugs your tests catch — 12/12
  6/6   C. coverage thresholds (npm run test:cov)
  8/8   C. mutation score ≥ break (npm run test:mutation)
 10/10  D. traceability of US-11 and Lite-3 — all 7 traced
 10/10  E. test plan
 10/10  F. CI pipeline
Total: 100/100 — excellent`;

const WEAK_API = `it('cancel works', async () => {
  …
  expect(res.status).toBe(200);
  expect(res.body.status).toBe('CANCELLED');
});`;
const WEAK_WEB = `await user.click(await screen.findByRole('button',
  { name: /Cancel/ }));
expect(client.cancelBooking).toHaveBeenCalledWith(1);`;

export const slides = lamDeck({ chuong: 'Chapter 11 — Capstone: a fully tested booking app', bai: '11.5' }, [
  { cover: true, t: 'Final project:<br>US-11, graded out of 100', sub: 'Chapter 11 · Lesson 11.5 — plan it, test it at every layer, ship it behind one check, and tell the story' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Deliver a <b>test plan, tests at five layers and a pipeline</b> for one real feature</li>
    <li>Run one <b>grader</b> that checks all of it against 12 planted bugs</li>
    <li>Read a weak score line by line and know <b>which test to write next</b></li>
    <li>Tell the project with <b>STAR</b> and numbers you can reproduce in front of an interviewer</li></ul>` },
  { t: 'The brief: US-11 My bookings', body: flow([{ t: 'Plan', s: 'risks, budget, RTM' }, { t: 'Rule + API', s: 'Unit, API', mau: '#2f7d4f' }, { t: 'PostgreSQL', s: 'DB layer', mau: '#2f7d4f' }, { t: 'Screen + journey', s: 'UI, E2E', mau: '#2f7d4f' }, { t: 'CI', s: 'ci-ok', mau: '#b85a2b' }], { h: 160, fs: 21 }) +
    zm(`<table class="t"><tr><th>AC</th><th>Risk</th><th>What a student must see</th></tr>
    <tr><td>AC1</td><td>High</td><td>only my own bookings, by date and start, cancelled ones too</td></tr>
    <tr><td>AC2</td><td>High</td><td>cancel until 60 minutes before; at 59: TOO_LATE_TO_CANCEL</td></tr>
    <tr><td>AC3</td><td>High</td><td>someone else’s booking looks missing (404)</td></tr>
    <tr><td>AC4</td><td>Medium</td><td>twice, even at the same moment: one success, ALREADY_CANCELLED</td></tr>
    <tr><td>AC5</td><td>High</td><td>a cancelled slot can be booked again</td></tr>
    <tr><td>AC6</td><td>Low</td><td>an admin may cancel any booking, at any time</td></tr></table>`, 0.98) },
  { t: 'What you hand in, and how it is graded', body: two(zm(`<table class="t"><tr><th>Deliverable</th><th>Layer</th></tr>
    <tr><td>${c('src/rules/cancel.test.js')}</td><td>Unit</td></tr>
    <tr><td>${c('src/booking/myBookings.test.js')}</td><td>Unit</td></tr>
    <tr><td>${c('src/api/myBookings.test.js')}</td><td>API</td></tr>
    <tr><td>${c('test/integration/myBookings.int.test.js')}</td><td>DB</td></tr>
    <tr><td>${c('web/MyBookings.test.jsx')}</td><td>UI</td></tr>
    <tr><td>${c('e2e/huy-phong.spec.js')}</td><td>E2E</td></tr>
    <tr><td>${c('test-plan/TEST-PLAN.md')}</td><td>plan</td></tr>
    <tr><td>${c('.github/workflows/test.yml')}</td><td>CI</td></tr></table>`, 0.92),
      box('One command', `${c('node scripts/cham-cuoi-khoa.mjs')}<br>Needs Docker (or ${c('TEST_DATABASE_URL')}), Chromium and ${c('actionlint')}. About 1–1.5 minutes: every layer, 12 bugs, coverage and Stryker.`, 'lam') +
      box('Fair by design', `Your tests run against <b>code you did not write</b>, then against 12 bugs planted one at a time. Every file is put back in ${c('finally')}.`, 'xanh'), 'r64') },
  { t: 'The rubric: 100 points, pass 70', to: true, body: zm(`<table class="t"><tr><th></th><th>What the grader checks</th><th>Points</th></tr>
    <tr><td>A</td><td>your tests are green on the correct code — Unit + API, UI, DB, E2E</td><td>4 × 5</td></tr>
    <tr><td>B</td><td>each of the 12 planted bugs turns at least one of your tests red</td><td>12 × 3</td></tr>
    <tr><td>C</td><td>coverage thresholds 97/91/96/97 · Stryker score ≥ 95%</td><td>6 + 8</td></tr>
    <tr><td>D</td><td>US-11 AC1–AC6 and Lite-3 traced to your passing tests</td><td>10</td></tr>
    <tr><td>E</td><td>the plan has 7 sections and names every High-risk id</td><td>10</td></tr>
    <tr><td>F</td><td>actionlint, the Lab 9 rules, mutation and report required by ci-ok</td><td>10</td></tr></table>`, 1.08) +
    box('Bands', `70 = pass · 85 = excellent. Bugs caught are the biggest share (36): green alone earns only 20.`, 'lam') },
  { t: 'Twelve planted bugs', body: zm(`<table class="t"><tr><th>#</th><th>Planted in</th><th>What a user would notice</th></tr>
    <tr><td>1</td><td>rule</td><td>an admin cannot cancel inside the last hour</td></tr>
    <tr><td>2</td><td>rule</td><td>a lecturer cancels anyone’s booking</td></tr>
    <tr><td>3</td><td>rule</td><td>cancelling stays open 7 hours too long</td></tr>
    <tr><td>4</td><td>memory repo</td><td>a cancelled slot stays blocked</td></tr>
    <tr><td>5</td><td>service</td><td>two cancels at once both “succeed”</td></tr>
    <tr><td>6</td><td>schema</td><td>PostgreSQL blocks a cancelled slot</td></tr>
    <tr><td>7</td><td>pgRepo</td><td>dates come back as JS Dates</td></tr>
    <tr><td>8</td><td>pgRepo</td><td>the cancel UPDATE is not atomic</td></tr>
    <tr><td>9</td><td>API</td><td>My bookings shows everyone’s bookings</td></tr>
    <tr><td>10</td><td>API</td><td>too late answered 409, not 422</td></tr>
    <tr><td>11</td><td>screen</td><td>other rows clickable during a cancel</td></tr>
    <tr><td>12</td><td>client</td><td>the screen calls a URL the API lacks</td></tr></table>`, 0.86) },
  { t: 'The first attempt: all green, 42/100', body: vt(YEU, { title: 'terminal — the grader on capstone/yeu (real run)', fs: 13 }) },
  { t: 'Why green earned so little', body: two(js(WEAK_API, { sm: true }) + box('Status-only asserts', `${c('200')} and ${c('CANCELLED')} are true even when the list leaks other students’ bookings (#9) or 409 replaces 422 (#10).`, 'do2'),
      js(WEAK_WEB, { sm: true }) + box('Testing the mock', `The test proves the click called the stub. It never looks at the screen, so #11 lives.`, 'do2')) +
    two(box('No tags, no PostgreSQL truth', `Names like “should work” trace nothing (D 0/10). One DB test checks only ${c("lab: 'BE-201'")}: #6–#8 live.`, 'do2'),
      box('A plan and a pipeline from before', `Scope, Risks, Approach — no entry/exit criteria, no ids (E 4/10). The Chapter 9 ${c('test.yml')} has no mutation or report job (F 4/10).`, 'do2')) },
  { t: 'The reference: 100/100', body: vt(REF, { title: 'terminal — the grader on the reference solution (real run)', fs: 13.5 }) +
    box('No single layer was enough', `Unit + API caught 7 of the 12, the DB tests 3 that nothing else saw, UI 1, E2E 1 — the layer matrix of lesson 11.1, now as points.`, 'xanh') },
  { t: 'Telling it with STAR', body: two(box('Weak CV line', `“Wrote unit and E2E tests for a booking app with Vitest and Playwright. Achieved high coverage.”`, 'do2') +
      box('Strong CV line', `“Planned and tested a cancel feature at five layers. Of 12 planted bugs no single layer caught more than 6; PostgreSQL-only tests caught 3 the others missed. Mutation score 99.08% on 433 mutants; one required check, ci-ok.”`, 'xanh'),
      box('STAR, with your own numbers', steps([`<b>S</b> — LabFlow Lite: students book labs; cancel is due`, `<b>T</b> — ship it safely: 6 ACs, Lite-3 in VN time`, `<b>A</b> — risk plan, 5 layers, traceability gate, ci-ok`, `<b>R</b> — 12/12 bugs caught; LF-301 found; a flaky test traced to a hash collision`]), 'lam')) },
  { t: 'Before you hand it in', to: true, giua: true, body: `<ul>
    <li>${c('node scripts/cham-cuoi-khoa.mjs')}: at least <b>70</b>, aim for 85+</li>
    <li>Every AC test name carries its id: ${c('(AC2)')}, ${c('(Lite-3, AC2)')}</li>
    <li>No real clock in unit tests; E2E dates relative to today; no fixed lab code</li>
    <li>Every number on your CV can be re-run from the repository</li>
    <li>Never claim “100% coverage” as the achievement — say what the tests <b>caught</b></li></ul>` },
]);
