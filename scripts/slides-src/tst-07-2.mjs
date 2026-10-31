/**
 * tst-07-2 — Testing · Chapter 7 · Lesson 7.2 "Testing real user flows" (01/11/2026). Slug: tst-7-2-luong.
 * Output = chạy thật: e2e/auth.setup.js (storageState an/boss), npm run test:e2e 9 xanh 3,1 s;
 * đo 6 lượt đặt, 1 worker: đăng nhập qua form mỗi test ~250 ms/test (3,7 s) so với dùng lại phiên ~290 ms/test (4,0 s).
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-07-2', code: 'TST 7.2', title: 'Real user flows', sub: 'sign in once, book end to end' };

const SETUP = `// e2e/auth.setup.js — runs once, before the browser tests
for (const user of ['an', 'boss']) {
  setup('sign in as ' + user, async ({ page }) => {
    await signIn(page, user);
    await expect(page.getByText('Signed in as ' + user)).toBeVisible();
    await page.context().storageState({ path: 'playwright/.auth/' + user + '.json' });
  });
}`;
const PROJ = `projects: [
  { name: 'setup', testMatch: /auth\\.setup\\.js/ },
  { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
]
// in a spec file:
test.use({ storageState: 'playwright/.auth/an.json' });   // starts already signed in`;
const TWO = `test('a booking by an shows up in the admin list', async ({ browser }, testInfo) => {
  const lab = freshLab(testInfo);
  const student = await browser.newContext({ storageState: 'playwright/.auth/an.json' });
  const admin = await browser.newContext({ storageState: 'playwright/.auth/boss.json' });
  const studentPage = await student.newPage();
  await studentPage.goto('/');
  await book(studentPage, { lab, date: '2026-11-20', start: '13:00', end: '15:00' });
  await expect(studentPage.getByRole('status')).toBeVisible();
  const adminPage = await admin.newPage();
  await adminPage.goto('/');
  const row = adminPage.getByRole('row', { name: new RegExp(lab) });
  await expect(row).toContainText('13:00–15:00');
});`;
const OUT = `  ✓  6 [chromium] › a wrong password is refused with an alert (408ms)
  ✓  3 [chromium] › an admin sees the list, not the form (359ms)
  ✓  5 [chromium] › a session survives a reload; signing out ends it (446ms)
  ✓  4 [chromium] › as student an › 31 seats waits for approval (523ms)
  ✓  7 [chromium] › as student an › books a lab and sees it confirmed (478ms)
  ✓  8 [chromium] › as student an › the same slot twice is refused (406ms)
  ✓  9 [chromium] › a booking by an shows up in the admin list (475ms)
  9 passed (3.1s)`;

export const slides = lamDeck({ chuong: 'Chapter 7 — End-to-end tests with Playwright', bai: '7.2' }, [
  { cover: true, t: 'Testing real<br>user flows', sub: 'Chapter 7 · Lesson 7.2 — sign in once, then follow a booking from a student to the admin' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Sign in once and reuse the session in every test (storageState)</li>
    <li>Order work with a setup project and dependencies</li>
    <li>Test a journey across two users in two browser contexts</li>
    <li>Choose which journeys deserve an end-to-end test</li>
    <li>Read a measurement honestly — including when a trick does not save time</li></ul>` },
  { t: 'Sign in once, save the session', body: js(SETUP, { sm: true, hl: [4, 6] }) + two(box('storageState', 'A JSON file with the cookies and localStorage of the page. LabFlow keeps its session in localStorage, so the file holds the token.', 'lam'), box('Keep it out of git', `${c('playwright/.auth/')} is in ${c('.gitignore')}: a session file is a password for as long as the token lives.`, 'do2')) },
  { t: 'Projects: setup first, then the tests', body: js(PROJ, { sm: true, hl: [2, 3, 6] }) + flow([{ t: 'setup', s: 'sign in as an, boss', mau: '#336791' }, { t: 'storage files', s: 'playwright/.auth/*.json', mau: '#7a3d12' }, { t: 'chromium tests', s: 'start signed in', mau: '#2f7d4f' }], { h: 100, fs: 19 }) +
    two(box('dependencies', 'Playwright runs the setup project first and starts the dependent projects only if it passed — a broken login fails once, clearly, instead of in every test.', 'lam'), box('Tests that are about login', `${c('e2e/dang-nhap.spec.js')} does not use a saved session: signing in is what it tests.`, 'xanh')) },
  { t: 'One journey, two users', body: js(TWO, { sm: true, hl: [3, 4, 7, 11, 12] }) + box('Two contexts = two people', 'Each context has its own storage, so the student and the admin are signed in at the same time — the journey crosses from one to the other like it does in real life.', 'lam') },
  { t: 'The suite: nine tests, three seconds', body: zm(vt(OUT, { title: 'terminal — npm run test:e2e', fs: 15 }), 1.05) +
    box('What it covers', 'Sign-in errors, session after reload, sign-out, roles, booking, approval, a taken slot, and the cross-user journey. Every rule detail was already unit-tested; these check the pieces are wired together.', 'xanh') },
  { t: 'Does reusing the session save time? Measured', body: zm(`<table class="t"><tr><th>6 bookings, 1 worker</th><th>per test</th><th>total</th></tr>
    <tr><td>Sign in through the form in every test</td><td>247–314 ms</td><td>3.7 s</td></tr>
    <tr><td>Reuse the saved session</td><td>289–324 ms</td><td>4.0 s</td></tr></table>`, 1.05) +
    two(box('Not here', 'LabFlow’s demo login is a memory lookup, so signing in costs almost nothing. The measurement says so; do not claim otherwise.', 'do2'), box('Why still use it', 'Real logins hash passwords, call SSO, ask for 2FA. And a test about booking should not fail because the login page changed.', 'xanh')) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'Lecturer thay (no saved session) books 40 seats: confirmed at once — lecturers never need approval',
      'In a second context, admin boss sees that row with status CONFIRMED',
    ]) + box('Done when', `${c('demo7/th72.spec.js')}: 1 passed (plus setup).`, 'xanh') + box('Hint', `${c('await browser.newContext()')} without storageState is a fresh, signed-out visitor; sign thay in with ${c('signIn(page, "thay")')}.`, 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A setup project signs in once and saves storageState</li>
    <li>${c('test.use({ storageState })')} starts a test signed in</li>
    <li>Two browser contexts are two independent users</li>
    <li>Test journeys end to end; leave rule details to unit tests</li>
    <li>Measure before claiming a speed-up</li></ul>` },
]);
