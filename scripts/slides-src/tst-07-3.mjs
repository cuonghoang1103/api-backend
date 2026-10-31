/**
 * tst-07-3 — Testing · Chapter 7 · Lesson 7.3 "Making e2e tests stable" (01/11/2026). Slug: tst-7-3-on-dinh.
 * Output = chạy thật: cùng một khung SH-301 — 2 worker cả hai xanh (đặt trùng lọt qua race của repo bộ nhớ), 1 worker một đỏ,
 * --repeat-each=3 4 đỏ; freshLab ⇒ 10/10 xanh; trace.zip + error-context.md; retry ⇒ "1 flaky".
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-07-3', code: 'TST 7.3', title: 'Stable e2e tests', sub: 'data, waits, traces and retries' };

const CHUNG = `// two tests, written months apart, both use the "obvious" data
test('booking from the home page', async ({ page }) => {
  await page.goto('/');
  await book(page, { lab: 'SH-301' });                     // 16 Nov, 08:00–10:00
  await expect(page.getByRole('status')).toHaveText('Booked. See you in SH-301.');
});
test('booking shows the confirmation', async ({ page }) => {
  await page.goto('/');
  await book(page, { lab: 'SH-301' });
  await expect(page.getByRole('status')).toContainText('SH-301');
});`;
const FRESH = `export function freshLab(testInfo) {
  const key = [testInfo.testId, testInfo.repeatEachIndex, testInfo.retry].join('/');
  const n = parseInt(createHash('sha256').update(key).digest('hex').slice(0, 8), 16) % 900;
  return 'QA-' + String(100 + n);
}`;
const TRACE = `  ✘  3 [chromium] › RED ON PURPOSE — expects the wrong message, leaves a trace behind (2.3s)
    Expected: "Booked. See you in TR-701."
    Received: "Sent. A lecturer must approve this booking."
    attachment #2: trace (application/zip) ───────────────
    test-results/demo7-trace-…-chromium/trace.zip
        npx playwright show-trace test-results/demo7-trace-…-chromium/trace.zip

# error-context.md, written next to it:
- status: Sent. A lecturer must approve this booking.`;
const RETRY = `  ✘  3 [chromium] › a slow first attempt, then a normal retry (5.2s)
  ✓  4 [chromium] › a slow first attempt, then a normal retry (retry #1) (372ms)
    Expected: "Booked. See you in RT-700."
    Error: element(s) not found
  1 flaky
  2 passed (8.0s)`;

export const slides = lamDeck({ chuong: 'Chapter 7 — End-to-end tests with Playwright', bai: '7.3' }, [
  { cover: true, t: 'Making e2e tests<br>stable', sub: 'Chapter 7 · Lesson 7.3 — the same test, sometimes red: why, and how to stop it' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Spot tests that share data — and give every test its own</li>
    <li>Wait for the app, never for the clock</li>
    <li>Debug a red run with a trace and the error context</li>
    <li>Use retries to report flakiness, not to hide it</li>
    <li>Reproduce a flaky test with workers and repeat-each</li></ul>` },
  { t: 'Two tests, the same slot', body: js(CHUNG, { sm: true, hl: [4, 9] }) + box('Nothing wrong — alone', 'Each test passes when it runs by itself. Together they fight over one slot in one shared server.', 'do2') },
  { t: 'Same code, three results. Measured', body: zm(`<table class="t"><tr><th>Command</th><th>Result</th><th>Why</th></tr>
    <tr><td>${c('--workers=2')}</td><td>2 passed</td><td>both checks ran before either insert: a double booking slipped through</td></tr>
    <tr><td>${c('--workers=1')}</td><td>1 failed</td><td>the second test gets 409 “already taken”</td></tr>
    <tr><td>${c('--workers=2 --repeat-each=3')}</td><td>4 failed</td><td>the slot is taken after the first round</td></tr></table>`, 1.02) +
    two(box('The green run found a real bug', 'The in-memory repository still has the check-then-insert race of Chapter 2. Lesson 4.1 fixed it in PostgreSQL with an EXCLUDE constraint; the e2e server does not use it.', 'lam'), box('Flaky = depends on order', 'Whether the suite is red depends on scheduling, not on the code. That is the definition of a flaky test.', 'do2')) },
  { t: 'Every test gets its own data', body: js(FRESH, { sm: true, hl: [2, 4] }) + vt('  12 passed (4.3s)    ← th73: the same two tests with freshLab, --workers=4 --repeat-each=5', { title: 'terminal', fs: 15 }) +
    box('Why hash the test id', 'Workers run in separate processes and share no counter. A hash of the test id, the repeat and the retry is the same inside a test and different between tests. Real projects use a database per worker or unique users instead.', 'lam') },
  { t: 'Wait for the app, not the clock', body: zm(`<table class="t"><tr><th>Instead of</th><th>Use</th></tr>
    <tr><td>${c('waitForTimeout(1000)')}</td><td>${c("await expect(locator).toHaveText('…')")}</td></tr>
    <tr><td>${c('expect(await locator.isVisible()).toBe(true)')}</td><td>${c('await expect(locator).toBeVisible()')}</td></tr>
    <tr><td>${c("expect(await locator.count()).toBe(3)")}</td><td>${c('await expect(locator).toHaveCount(3)')}</td></tr>
    <tr><td>polling the API in a loop</td><td>${c('await expect.poll(() => fetchStatus()).toBe(…)')}</td></tr></table>`, 1.05) +
    box('Rule', 'If a line waits, it should be an assertion that retries — then it waits exactly as long as needed and fails with a clear message.', 'xanh') },
  { t: 'A red run leaves evidence', body: vt(TRACE, { title: 'terminal — demo7/trace.spec.js (trace: "on")', fs: 13 }) +
    two(box('trace.zip', `${c('npx playwright show-trace …')} replays every action with a DOM snapshot, network and console. CI keeps it with ${c("trace: 'on-first-retry'")}.`, 'lam'), box('error-context.md', 'The accessibility snapshot of the page when it failed: here it already says the booking waits for approval — 31 seats.', 'xanh')) },
  { t: 'Retries: report flakiness, do not hide it', body: vt(RETRY, { title: 'terminal — demo7/thu-lai.spec.js --retries=2 (slowness simulated on the first attempt)', fs: 14 }) +
    two(box('Config', `${c('retries: process.env.CI ? 2 : 0')} — none locally, so you see every failure; two in CI, so one hiccup does not block a merge.`, 'lam'), box('“1 flaky” is a to-do', 'A passed-on-retry test is still broken. Track it, find the cause (data, waits, order), fix it — Chapter 8.', 'do2')) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Rewrite the two SH-301 tests with ${c('freshLab(testInfo)')}`,
      `Run them with ${c('--workers=4 --repeat-each=5')}: 10 of 10 must pass`,
    ]) + box('Done when', `${c('demo7/th73.spec.js')}: 12 passed (10 + 2 setup).`, 'xanh') + box('Then try to break it', `Change ${c('freshLab')} to return a constant and run the same command: the repeats collide again. That is the bug you just removed.`, 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Shared data makes results depend on order — give each test its own</li>
    <li>Reproduce with ${c('--workers')} and ${c('--repeat-each')}</li>
    <li>Wait with retrying assertions, never with sleeps</li>
    <li>Read trace.zip and error-context.md before guessing</li>
    <li>Retries only in CI, and every flaky test gets fixed</li></ul>` },
]);
