/**
 * tst-07-4 — Testing · Chapter 7 · Lesson 7.4 "Browsers, devices and visual checks" (01/11/2026). Slug: tst-7-4-da-trinh-duyet.
 * Output = chạy thật: 5 project (Chromium, Firefox, WebKit, Pixel 7, iPhone 15) — 37 xanh 16,9 s; toHaveCSS 17px/20px theo bề rộng;
 * toHaveScreenshot: lần đầu ghi ảnh gốc (-darwin.png), đổi cam đậm hơn (#d35400) vẫn XANH (threshold 0.2), đổi xanh dương ⇒ 2423 pixel khác.
 * v2 (01/11): slide 8 — dau-tien.spec.js trên firefox+webkit KHÔNG xanh hết (đo 3/3: Firefox đỏ vì WebKit đặt BE-201 trước); bản v1 ghi sai "all green".
 * Ảnh: scripts/slides-src/tst-anh/tst-07-4/ (chụp thật từ test-results).
 */
import { readFileSync } from 'node:fs';
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-07-4', code: 'TST 7.4', title: 'Browsers and devices', sub: 'three engines, phones, pixels' };

const anh = (ten) => `<img src="data:image/png;base64,${readFileSync(new URL('./tst-anh/tst-07-4/' + ten, import.meta.url)).toString('base64')}" style="width:100%;height:228px;object-fit:contain;background:#fafafa;border:1.5px solid #bfbfbf;border-radius:6px;display:block">`;

const PROJ = `projects: [
  { name: 'setup', testMatch: /auth\\.setup\\.js/ },
  { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['setup'] },
  { name: 'webkit', use: { ...devices['Desktop Safari'] }, dependencies: ['setup'] },
  { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, dependencies: ['setup'] },
  { name: 'mobile-safari', use: { ...devices['iPhone 15'] }, dependencies: ['setup'] },
]`;
const CSS = `test('the header title size follows the screen width', async ({ page }, testInfo) => {
  await page.goto('/');
  const mobile = testInfo.project.name.startsWith('mobile');
  await expect(page.getByRole('heading', { name: 'LabFlow Lite' }))
    .toHaveCSS('font-size', mobile ? '17px' : '20px');
});`;
const SHOT = `test('the sign-in page looks as before', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page).toHaveScreenshot('sign-in.png');
});`;
const RUN1 = `Error: A snapshot doesn't exist at …/demo7/hinh-anh.spec.js-snapshots/sign-in-chromium-darwin.png, writing actual.
      — second run: 4 passed (3.1s)
sign-in-chromium-darwin.png   sign-in-mobile-safari-darwin.png`;

export const slides = lamDeck({ chuong: 'Chapter 7 — End-to-end tests with Playwright', bai: '7.4' }, [
  { cover: true, t: 'Browsers, devices<br>and visual checks', sub: 'Chapter 7 · Lesson 7.4 — the same journeys in three engines and two phones, and a test that looks' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Run the same tests in Chromium, Firefox and WebKit</li>
    <li>Emulate phones: viewport, touch, user agent</li>
    <li>Check layout rules that change with the screen size</li>
    <li>Catch visual changes with screenshot comparison</li>
    <li>Know the limits: thresholds and per-OS baselines</li></ul>` },
  { t: 'One test file, five projects', body: js(PROJ, { sm: true, hl: [4, 5, 6, 7] }) + two(box('Three engines', 'Chromium (Chrome, Edge), Firefox (Gecko), WebKit (Safari). Users on iPhones all run WebKit — Chrome-only testing misses them.', 'lam'), box('Devices', `${c("devices['Pixel 7']")} sets the viewport, the pixel ratio, touch and the user agent. It is emulation, not a real phone.`, 'lam')) },
  { t: 'All journeys, every browser', body: zm(vt('$ npm run test:e2e:all\nRunning 37 tests using 5 workers\n  37 passed (16.9s)', { title: 'terminal — 7 tests × 5 projects + 2 setup', fs: 18 }), 1.1) +
    two(box('npm run test:e2e', 'Chromium only — the quick check while you work, and what the Lab 7 grader runs.', 'lam'), box('npm run test:e2e:all', 'Before merging and in CI (Chapter 9). Five times the work, so keep the e2e suite small.', 'xanh')) },
  { t: 'A rule that depends on the screen', body: js(CSS, { sm: true, hl: [3, 5] }) + vt('  7 passed (4.1s)   ← chromium, firefox, webkit 20px · mobile-chrome, mobile-safari 17px', { title: 'terminal — npx playwright test demo7/th74.spec.js', fs: 14 }) +
    box('Why test it at all?', 'The CSS rule is one line, but a broken media query makes the header wrap on every phone. One assertion per project keeps it honest.', 'lam') },
  { t: 'Screenshot comparison', body: js(SHOT, { sm: true, hl: [4] }) + vt(RUN1, { title: 'terminal — the first run writes the baseline', fs: 13 }) +
    box('Baselines are per browser and per OS', `The file name ends in ${c('-chromium-darwin.png')}: fonts render differently on Linux CI. Generate CI baselines on Linux (Chapter 9), or keep visual tests out of CI.`, 'do2') },
  { t: 'What a pixel test sees — and misses', body: two(`<div>${anh('sign-in-expected.png')}<p style="font-size:18px;margin:6px 0 0">Baseline (Chromium, macOS)</p></div>`, `<div>${anh('sign-in-diff.png')}<p style="font-size:18px;margin:6px 0 0">Diff after the button turned blue: 2423 pixels</p></div>`) +
    two(box('Missed: #e06a1b → #d35400', 'A darker orange passed: the default threshold (0.2) treats close colours as equal.', 'do2'), box('Caught: orange → blue', '“2423 pixels … are different” — expected, actual and diff images saved.', 'xanh')) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Run ${c('demo7/dau-tien.spec.js')} in firefox and webkit: one test turns red. Read its ${c('error-context.md')} — why?`,
      'Assert the header title is 20px on desktops and 17px on the two phone projects',
    ]) + box('Done when', `${c('npx playwright test demo7/th74.spec.js')}: 7 passed — and you can name the real cause of the red test (hint: Firefox is innocent).`, 'xanh') + box('Update a baseline on purpose', `${c('npx playwright test --update-snapshots')} — only after you have looked at the diff and decided the change is wanted.`, 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Projects run one suite in many browsers and devices</li>
    <li>WebKit matters: every iPhone browser uses it</li>
    <li>Device emulation is fast, but not a real phone</li>
    <li>Screenshots catch visible changes, within a threshold</li>
    <li>Baselines are per browser and per OS — commit them deliberately</li></ul>` },
]);
