/**
 * tst-07-1 — Testing · Chapter 7 · Lesson 7.1 "Playwright: your first browser test" (01/11/2026). Slug: tst-7-1-playwright.
 * Output = chạy thật: @playwright/test 1.64.1, vite 8.3.5; demo7/dau-tien (3 xanh), strict (getByLabel('Lab') khớp 2 phần tử),
 * cho-tu-dong (API trễ 1,5 s: toHaveText xanh 2,2 s; isVisible() và waitForTimeout(1000) đỏ).
 */
import { lamDeck, js, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-07-1', code: 'TST 7.1', title: 'Playwright', sub: 'your first browser test' };

const CFG = `export default defineConfig({
  testDir: '.',
  testMatch: ['e2e/**/*.spec.js', 'demo7/**/*.spec.js'],
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: 'http://localhost:4173', trace: 'on-first-retry' },
  webServer: {
    command: 'npm run build:web && node e2e/server.js',
    url: 'http://localhost:4173/api/health',
  },
  projects: [ /* setup, chromium … — lesson 7.2 and 7.4 */ ],
});`;
const FIRST = `test('a student signs in and books a lab', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('an');
  await page.getByLabel('Password').fill('labflow-demo');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Signed in as an (STUDENT)')).toBeVisible();

  await page.getByLabel('Date').fill('2026-11-16');
  await page.getByLabel('Start').fill('08:00');
  await page.getByLabel('End').fill('10:00');
  await page.getByLabel('Seats').fill('20');
  await page.getByRole('button', { name: 'Book' }).click();
  await expect(page.getByRole('status')).toHaveText('Booked. See you in BE-201.');
});`;
const OUT1 = `Running 5 tests using 3 workers
  ✓  2 [setup] › e2e/auth.setup.js › sign in as an (281ms)
  ✓  1 [setup] › e2e/auth.setup.js › sign in as boss (281ms)
  ✓  3 [chromium] › the sign-in page shows its form (142ms)
  ✓  5 [chromium] › a wrong password is refused (261ms)
  ✓  4 [chromium] › a student signs in and books a lab (353ms)
  5 passed (2.5s)`;
const STRICT = `  ✘  3 [chromium] › RED ON PURPOSE — getByLabel matches part of a name by default
  Error: locator.fill: Error: strict mode violation: getByLabel('Lab') resolved to 2 elements:
      1) <form novalidate="" aria-label="Book a lab">…</form>
      2) <input name="lab" value="BE-201" id="booking-lab"/>
  ✓  4 [chromium] › exact: true matches the whole label (264ms)`;
const WAIT = `// the API answers 1.5 s late (page.route)
await expect(page.getByRole('status')).toHaveText('Booked. See you in DM-701.');   // ✓ 2.2s

expect(await page.getByRole('status').isVisible()).toBe(true);                      // ✘ Received: false

await page.waitForTimeout(1000);
expect(await page.getByRole('status').isVisible()).toBe(true);                      // ✘ Received: false`;

export const slides = lamDeck({ chuong: 'Chapter 7 — End-to-end tests with Playwright', bai: '7.1' }, [
  { cover: true, t: 'Playwright:<br>your first browser test', sub: 'Chapter 7 · Lesson 7.1 — the whole LabFlow Lite app, driven like a user would' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Start the real app and a real browser from one command</li>
    <li>Write a test that signs in and books a lab, end to end</li>
    <li>Find elements with the same queries as Chapter 6 — and know strict mode</li>
    <li>Wait the right way: web-first assertions, never a fixed sleep</li>
    <li>Know when an end-to-end test is worth its cost</li></ul>` },
  { t: 'What an end-to-end test drives', body: flow([{ t: 'Playwright test', s: 'e2e/*.spec.js', mau: '#336791' }, { t: 'Real browser', s: 'Chromium, Firefox, WebKit', mau: '#e08a1e' }, { t: 'Built React app', s: 'dist-web (Vite)', mau: '#2f7d4f' }, { t: 'e2e server', s: 'API + login', mau: '#7a3d12' }], { h: 120, fs: 19 }) +
    two(box('Every layer at once', 'Chapters 1–6 tested one layer each. Here the browser clicks the built page, the page calls the real API, the API runs the real rules. A bug anywhere in between shows up.', 'lam'), box('The price', 'Slower (a browser per test), more moving parts, harder to read when red. That is why the pyramid keeps e2e tests few and focused on journeys.', 'do2')) +
    box('New in LabFlow Lite', `${c('web/app/')} (sign-in page + App), ${c('e2e/server.js')} (Chapter 5 API + a demo login + the built page), ${c('vite.config.js')}, ${c('playwright.config.js')}. Demo accounts: an, binh (students), thay (lecturer), boss (admin) — password labflow-demo.`, 'lam') },
  { t: 'One config starts everything', body: js(CFG, { sm: true, hl: [7, 8, 9] }) + box('webServer', `Playwright runs ${c('npm run build:web && node e2e/server.js')}, waits until ${c('/api/health')} answers, runs the tests, then stops the server. One command: ${c('npm run test:e2e')}.`, 'lam') },
  { t: 'The first journey: sign in, then book', body: js(FIRST, { sm: true, hl: [3, 4, 5, 12, 13] }) + box('Same queries as Chapter 6', `${c('getByRole')}, ${c('getByLabel')}, ${c('getByText')} — role and label first. ${c('page.goto("/")')} uses ${c('baseURL')} from the config.`, 'lam') },
  { t: 'Green, in a real Chromium', body: zm(vt(OUT1, { title: 'terminal — npx playwright test demo7/dau-tien.spec.js --project=chromium', fs: 16 }), 1.05) +
    two(box('Workers', 'Tests run in parallel, each in a fresh browser context: own cookies, own localStorage. The two setup tests come from lesson 7.2.', 'lam'), box('Fast enough', 'About 0.3 s per journey here — a real browser, a real server, but a tiny app on one machine.', 'xanh')) },
  { t: 'Strict mode: one locator, one element', body: vt(STRICT, { title: 'terminal — demo7/strict.spec.js', fs: 13 }) +
    two(box('Why two?', `${c("getByLabel('Lab')")} matches part of a name, case-insensitively: the form is named “Book a <b>lab</b>”. Playwright refuses to guess which one you meant.`, 'do2'), box('Fix', `${c("getByLabel('Lab', { exact: true })")} — or a role: ${c("getByRole('textbox', { name: 'Lab', exact: true })")}.`, 'xanh')) },
  { t: 'Auto-wait: let the assertion retry', body: zm(js(WAIT, { sm: true, hl: [2, 4, 7] }), 1.12) + two(box('Web-first assertions', `${c('await expect(locator).toHaveText(…)')} retries for up to 5 s. Actions like ${c('click')} and ${c('fill')} also wait until the element is ready.`, 'xanh'), box('One-shot checks', `${c('isVisible()')}, ${c('textContent()')} inside a plain ${c('expect')} answer once. A fixed sleep is either too short (red) or too long (slow).`, 'do2')) +
    box('Measured here', `With the API 1.5 s late: ${c('toHaveText')} passed after 2.2 s; ${c('isVisible()')} failed at once; a 1 s sleep failed after 1.4 s. A 2 s sleep would pass — until the server is slower one day.`, 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'The page title is “LabFlow Lite” and the Password field has type="password"',
      'Lecturer thay signs in: the header says “Signed in as thay (LECTURER)” and the booking form is shown',
    ]) + box('Done when', `${c('demo7/th71.spec.js')}: 2 passed (plus the 2 setup tests).`, 'xanh') + box('Recorder', `${c('npx playwright codegen http://localhost:4173')} opens a browser and writes code as you click — a fast start; then rename and clean up the locators.`, 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>One config builds the app, starts the server and the browser</li>
    <li>Query by role and label; use ${c('exact: true')} when names overlap</li>
    <li>${c('await expect(locator)…')} waits; ${c('isVisible()')} does not</li>
    <li>Never ${c('waitForTimeout')} to wait for the app</li>
    <li>Few e2e tests, each for a whole journey</li></ul>` },
]);
