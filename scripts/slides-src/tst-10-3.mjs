/**
 * tst-10-3 — Testing · Chapter 10 · Lesson 10.3 "Reviewing tests in pull requests" (01/11/2026). Slug: tst-10-3-review.
 * Output = chạy thật (s10/_ma.mjs): PR #57 xanh trong CI với "(retry x3)"; thu-loi "if (false)" ⇒ test mock vẫn xanh; snapshot đỏ với bug
 * giao chỗ cho người cuối, -u ⇒ "1 updated" xanh, diff .snap đổi an ⇔ chi; bỏ retry đỏ 10/30, có retry 0/30; spy waitlists.set đỏ khi
 * refactor vô hại; so-sanh.mjs 2/5 vs 5/5; bản review 0/30 khi xáo; thực hành th103 (1003 ms, toBeTruthy) vs bản review.
 */
import { lamDeck, sql, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-10-3', code: 'TST 10.3', title: 'Reviewing tests in pull requests', sub: 'green CI is where the review starts' };

const diff = (src, o = {}) => sql(src, { lang: 'diff', sm: true, ...o });

const PR = `$ git diff --stat main...pr/57-waitlist-tests
 demo10/review/__snapshots__/pr57.test.js.snap | 37 ++++++++++++++++++++++
 demo10/review/pr57.test.js                    | 45 +++++++++++++++++++++++++++
 2 files changed, 82 insertions(+)
$ npx vitest run demo10/review/pr57.test.js
 ✓ demo10/review/pr57.test.js (4 tests) 43ms
   ✓ waitlist (4)
     ✓ should send mail 1ms
     ✓ should work 19ms
     ✓ should return correct value 4ms (retry x3)
     ✓ should handle edge case 18ms
      Tests  4 passed (4)`;
const MOCK_CODE = `it('should send mail', async () => {
  const mailer = { send: vi.fn().mockResolvedValue('msg-1') };
  await mailer.send({ to: 'an@labflow.example',
    subject: 'A seat is free' });
  expect(mailer.send).toHaveBeenCalled();
});`;
const MOCK = `planted in src/booking/waitlistService.js:  if (offer) {  →  if (false) {
 ✓ demo10/review/pr57.test.js (4 tests | 3 skipped) 2ms
   ✓ waitlist (4)
     ✓ should send mail 1ms
      Tests  1 passed | 3 skipped (4)`;
const SNAP_U = `$ node scripts/thu-loi.mjs src/rules/waitlist.js … pr57.test.js -u
planted in src/rules/waitlist.js:  const [first, ...rest] = queue;
                               →  const [first, ...rest] = [...queue].reverse();
     ✓ should work 20ms
  Snapshots  1 updated
      Tests  4 passed (4)`;
const SNAP_DIFF = `$ git diff -- demo10/review/__snapshots__
@@ -16,19 +16,19 @@ exports[\`waitlist > should work 1\`] = \`
-      "to": "an@labflow.example",
+      "to": "chi@labflow.example",
-    "offeredTo": "an@labflow.example",
+    "offeredTo": "chi@labflow.example",
-          "userId": "chi@labflow.example",
+          "userId": "an@labflow.example",`;
const TEN = ` FAIL  demo10/review/pr57.test.js > waitlist > should work
 FAIL  demo10/review/pr57-sau-review.test.js > cancelBooking and the waitlist
       > offers the freed slot by e-mail to the student who has waited longest
-   "offeredTo": "an@labflow.example",
+   "offeredTo": "chi@labflow.example",`;
const IMPL = `planted in src/booking/waitlistService.js:
    waitlists.set(key, queue);  →  if (offer) waitlists.set(key, queue);
 ✓ demo10/review/pr57-sau-review.test.js (3 tests) 39ms
     × should handle edge case 18ms
AssertionError: expected "set" to be called 1 times, but got 0 times`;
const RAND = `it('should return correct value', { retry: 3 }, () => {
  const student = () => 'student' + Math.floor(Math.random() * 10)
    + '@labflow.example';
  …  // three students join; two of them are often the same
});`;
const LAP = `$ sed "s/{ retry: 3 }, //" demo10/review/pr57.test.js > …/khong-retry.test.js
$ node scripts/lap-lai.mjs 30 …/khong-retry.test.js -t "should return correct value"
red in 10/30 runs (22.6 s)
$ node scripts/lap-lai.mjs 30 demo10/review/pr57.test.js -t "should return correct value"
red in 0/30 runs (17.8 s)
$ for i in 1 2 3 4 5 6; do npx vitest run … | grep "should return"; done
     ✓ should return correct value 1ms
     ✓ should return correct value 4ms (retry x1)
     ✓ should return correct value 1ms
     ✓ should return correct value 1ms
     ✓ should return correct value 1ms
     ✓ should return correct value 1ms`;
const SO_SANH = `$ node demo10/review/so-sanh.mjs
bug      nobody is e-mailed                               submitted: red   ✔   reviewed: red   ✔
bug      the slot goes to the last in line                submitted: red   ✔   reviewed: red   ✔
bug      a fourth student can wait                        submitted: green ✘   reviewed: red   ✔
harmless bookings also store where they came from         submitted: red   ✘   reviewed: green ✔
harmless the waitlist Map is written only when it changed submitted: red   ✘   reviewed: green ✔
right answers — submitted: 2/5, reviewed: 5/5
$ node scripts/lap-lai.mjs 30 demo10/review/pr57-sau-review.test.js --sequence.shuffle
red in 0/30 runs (18.3 s)`;
const SAU = `it('offers the freed slot by e-mail to the student who has waited longest', async () => {
  const waitlists = new Map([[KEY, line('an', 'chi')]]);
  const { result, outbox, booking } = await cancelWith(waitlists);

  expect(result).toEqual({ cancelled: booking.id, offeredTo: 'an@labflow.example' });
  expect(outbox).toEqual([{ to: 'an@labflow.example', subject: 'A seat is free: …' }]);
  expect(waitlists.get(KEY)).toEqual(line('chi'));
});`;

export const slides = lamDeck({ chuong: 'Chapter 10 — TDD and testing in real teams', bai: '10.3' }, [
  { cover: true, t: 'Reviewing tests in<br>pull requests', sub: 'Chapter 10 · Lesson 10.3 — green CI is where the review starts, not where it ends' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Review a test pull request in a <b>fixed order</b></li>
    <li>Prove a weak test with a <b>planted bug</b> or a <b>planted refactor</b></li>
    <li>Recognise <b>six test smells</b>, each measured on LabFlow Lite</li>
    <li>Read a <b>.snap diff</b> like code — never a blind <b>-u</b></li>
    <li>Write comments that are <b>labelled, specific and kind</b></li></ul>` },
  { t: 'Pull request #57: four tests, CI green', body: vt(PR, { title: 'terminal — the pull request and its CI run', fs: 17, hl: [10] }) +
    two(box('Looks fine', 'Small diff, four tests, all green. Most reviewers stop here and press Approve.', 'xanh'),
      box('One odd detail', `${c('(retry x3)')} after the third test — the only visible trace of a problem measured on slide 8.`, 'do2')) },
  { t: 'How to review a test pull request', body: flow([{ t: 'Read the names', s: 'they are the spec' }, { t: 'Run it', s: 'retry? slow? snapshot?' }, { t: 'Plant a bug', s: 'thu-loi.mjs ⇒ red?', mau: '#c0392b' }, { t: 'Plant a refactor', s: 'invisible ⇒ green?', mau: '#2f7d4f' }, { t: 'Comment', s: 'label + evidence', mau: '#b85a2b' }], { h: 170, fs: 19 }) +
    two(box('Plant a bug', `${c('node scripts/thu-loi.mjs <file> "<exact text>" "<bug>" <tests>')} — a test that stays green cannot fail.`, 'do2'),
      box('Plant a refactor', `Same tool, a change users cannot see — a test that turns red will break for nothing.`, 'xanh')) +
    box('Google Engineering Practices — what to look for in tests', '“Will the tests actually fail when the code is broken? If the code changes beneath them, will they start producing false positives?” Steps 3 and 4 answer exactly these two questions, with a fact you can paste into a comment.', 'lam') },
  { t: 'Smell 1 — the test checks its own mock', body: js(MOCK_CODE, { hl: [3, 4, 5], fs: 18 }) +
    vt(MOCK, { title: 'terminal — the bug “nobody is e-mailed” planted, this test only', fs: 15.5 }) +
    two(box('Never runs the product', `The test calls the mock and checks the mock was called. ${c('cancelBooking')} never runs — lesson 3.3 in its purest form.`, 'do2'),
      box('issue (blocking)', `Cannot fail: with ${c('if (false)')} planted it is still green. Call cancelBooking with the fake mailer and check the outbox.`, 'lam')) },
  { t: 'Smell 2 — a snapshot that approves anything', body: vt(SNAP_U, { title: 'terminal — a real bug planted, then -u', fs: 15 }) +
      diff(SNAP_DIFF) +
    two(box('Green for a bug', `The slot now goes to the LAST student. ${c('-u')} made it the approved behaviour; only these three lines in the .snap file show it.`, 'do2'),
      box('Red for nothing', `Store one more field on the booking (${c("source: 'web'")}): the 30-line snapshot breaks, although the test is about the waitlist.`, 'do2')) },
  { t: 'Smells 3 and 5 — vague names, implementation checks', body: vt(TEN, { title: 'terminal — the same planted bug: submitted, then reviewed', fs: 14.5 }) +
    vt(IMPL, { title: 'terminal — a refactor users cannot see', fs: 14.5 }) +
    two(box('suggestion', `Name the rule, not “should work” — the red line becomes a bug report (lesson 1.3).`, 'lam'),
      box('question', `Why spy on ${c('waitlists.set')}? Check ${c('waitlists.get(KEY) ?? []')}, what a caller sees (lesson 3.3).`, 'lam')) },
  { t: 'Smells 4 and 6 — random data, hidden by retry', body: two(js(RAND, { sm: true, hl: [1, 2] }),
      box('72% chance of three different ids', `10 × 9 × 8 / 1000 = 0.72. Otherwise ${c('ALREADY_WAITING')}, the queue becomes undefined, the test throws.`, 'do2'), 'r64') +
    vt(LAP, { title: 'terminal — the same test, 30 runs without and with { retry: 3 }', fs: 12.5 }) +
    box('Lesson 8.3: retry turned a real double booking from 17/50 red into 0/50', 'From a green tick you cannot tell a test bug from a product bug. Flaky ⇒ issue, owner, quarantine (lesson 9.3) — not retry.', 'xanh') },
  { t: 'After review: right 5 times out of 5', body: js(SAU, { sm: true, fs: 15 }) +
    vt(SO_SANH, { title: 'terminal — five planted changes against both files', fs: 14.5, hl: [4, 5, 6, 7] }) },
  { t: 'The review checklist', body: zm(`<table class="t"><tr><th>Ask of every test</th><th>Measured in</th></tr>
    <tr><td>Name states a rule users recognise</td><td>1.3</td></tr>
    <tr><td>Exact assertion — no lone toBeTruthy / toBeDefined</td><td>1.2, 8.1</td></tr>
    <tr><td>Runs the real code, not its own mock</td><td>3.3</td></tr>
    <tr><td>Red under a planted bug · green under a planted refactor</td><td>Labs 1–9, 8.2, 3.3</td></tr>
    <tr><td>Small snapshot, diff read like code, never a blind -u</td><td>1.2</td></tr>
    <tr><td>No real clock, Math.random or network; own data; any order</td><td>2.2, 2.4, 4.4, 8.3</td></tr>
    <tr><td>No retry for flakiness · no .only · no real waiting</td><td>8.3, 9.3, 9.1, 8.4</td></tr></table>`, 1.08) +
    box('Tone', `Label each comment (issue, suggestion, question, nit — Conventional Comments), state the evidence, talk about the code, never the person. Block only on what you measured.`, 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Review ${c('demo10/review/th103-truoc.test.js')}: find at least three smells, write a labelled comment for each`,
      `Rewrite it with a fixed clock, the 10:29 / 10:30 boundary and ${c('toEqual')}`,
      `Plant ${c('now < offer.expiresAt ?')} → ${c('false ?')} with ${c('scripts/thu-loi.mjs')} and run both files`,
    ]) + box('Measured', `Submitted: green in 1003 ms, also with the bug (${c('toBeTruthy')} passes ${c('{ ok: false }')}). Reviewed: 2 tests, red under the bug, ~1 ms each.`, 'lam') +
    box('Done when', 'Your test is red under the planted bug, runs in milliseconds, and every comment says what you measured.', 'xanh') },
]);
