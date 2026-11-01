/**
 * tst-11-3 — Testing · Chapter 11 · Lesson 11.3 "Testing the frontend and the full flow" (01/11/2026). Slug: tst-11-3-frontend.
 * Output = chạy thật (s11/_ma.mjs, 113-*): MyBookings 8 test xanh; URL sai '/cancellation' ⇒ 24 test web xanh, hành trình E2E đỏ;
 * test "chỉ kiểm mock" xanh khi dòng không đổi; strict mode với nút Cancel; quả bom giờ 07:00; test cũ chập chờn vì QA-912 (900 mã, 25 test);
 * 608.400 mã + annotation ⇒ 25 mã cho 25 test; thực hành riêng tư Binh/An.
 */
import { lamDeck, js, vt, two, box, steps, c, flow, tbl } from './_tst-chung.mjs';

export const deck = { key: 'tst-11-3', code: 'TST 11.3', title: 'Testing the frontend and the full flow', sub: 'one screen, one journey, one flaky surprise' };

const WEB = `async function cancel(booking) {
  setBusyId(booking.id);
  setNotice(null);
  try {
    const res = await client.cancelBooking(booking.id);
    if (res.status === 200) {
      replace(res.data);          // the server's row
      setNotice({ ok: true, text: 'Cancelled …' });
    } else {
      const code = res.data.error.code;
      setNotice({ ok: false, text: CANCEL_MESSAGES[code] … });
    }
  } catch { setNotice({ … 'Cannot reach the server …' }); }
  finally { setBusyId(null); }
}`;
const T_WEB = `$ npx vitest run --config vitest.web.config.js web/MyBookings.test.jsx
   ✓ MyBookings screen (US-11) (8)
     ✓ one row per booking; a cancelled one has no Cancel button (AC1) 112ms
     ✓ Cancel → the row says CANCELLED, the button is gone, and the user is told (AC2) 50ms
     ✓ while cancelling: “Cancelling…”, every Cancel disabled, one request for a double click 25ms
     ✓ 422 TOO_LATE_TO_CANCEL → an alert, and the booking stays as it was (AC2) 22ms
     ✓ 409 ALREADY_CANCELLED → the row shows what the server knows (AC4) 18ms
     ✓ no network → “Cannot reach the server” 16ms
     ✓ an empty list says so 3ms
     ✓ a failed load offers Try again, and it works 12ms
      Tests  8 passed (8)`;
const STUB_WEB = `planted in web/api.js:  '/cancel')  →  '/cancellation')
 ✓ web/AdminBookings.test.jsx (4 tests) 142ms
 ✓ web/MyBookings.test.jsx (8 tests) 263ms
 ✓ web/BookingForm.test.jsx (12 tests) 1050ms
      Tests  24 passed (24)`;
const STUB_E2E = `planted in web/api.js:  '/cancel')  →  '/cancellation')
  ✘  3 [chromium] › e2e/huy-phong.spec.js:11:1 › cancel a booking from My bookings, …
    Expected: "Cancelled NZ-429 on 2026-11-04, 13:00–15:00."
    Error: element(s) not found
  1 failed`;
const MOCK = `it('calls cancelBooking when Cancel is clicked', async () => {
  const user = userEvent.setup();
  const client = { listMine: …, cancelBooking: vi.fn(…) };
  render(<MyBookings client={client} />);
  await user.click(
    await screen.findByRole('button', { name: /Cancel/ }));
  expect(client.cancelBooking).toHaveBeenCalledWith(1);
});`;
const T_MOCK = `planted in web/MyBookings.jsx:          replace(res.data);  →
 ✓ demo11/ui/kiem-mock.test.jsx (1 test) 107ms
     × Cancel → the row says CANCELLED, the button is gone, and the user is told (AC2) 41ms
Expected element to have text content:
  CANCELLED
Received:
  BE-2012026-11-1608:00–10:0020CONFIRMEDCancel
      Tests  1 failed | 8 passed (9)`;
const E2E = `const lab = freshLab(testInfo);
const date = daysFromNow(3);          // Viet Nam time
await book(page, { lab, date, start: '13:00', end: '15:00' });
await page.getByRole('link', { name: 'My bookings' }).click();
const row = page.getByRole('row', { name: new RegExp(lab) });
await row.getByRole('button', { name: 'Cancel ' + lab + … }).click();
await expect(row).toContainText('CANCELLED');
await page.reload();                  // what the server stored
await book(page, { lab, date, start: '13:00', end: '15:00' });`;
const T_E2E = `$ npx playwright test e2e/huy-phong.spec.js --project=chromium
  ✓  3 [chromium] › e2e/huy-phong.spec.js:11:1 › cancel a booking from My bookings, …
  3 passed (3.1s)`;
const STRICT = `  ✘  3 [chromium] › demo11/pw/nut-chung.spec.js:8:1 › cancel "the" booking (453ms)
    Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Cancel' }) …
        1) <button type="button" aria-label="Cancel DS-246 on 2026-11-06 at 08:00">Cancel</button> …
        2) <button type="button" aria-label="Cancel DS-246 on 2026-11-06 at 10:00">Cancel</button> …`;
const BOMB = `  ✘  3 [chromium] › demo11/pw/qua-gio.spec.js:8:1 › cancel a booking for today at 07:00 (5.3s)
    Expected substring: "Cancelled"
    Error: element(s) not found`;
const FLAKY = `$ npx playwright test e2e/ --project=firefox
  ✘   9 [firefox] › e2e/dat-phong.spec.js:31:1 › a booking by an shows up in the admin list (1.6s)
    Error: strict mode violation: getByRole('row', { name: /QA-912/ }) resolved to 2 elements:
        1) <tr>…</tr> aka getByRole('row', { name: 'QA-912 2026-11-16 08:00–10:00' })
        2) <tr>…</tr> aka getByRole('row', { name: 'QA-912 2026-11-20 13:00–15:00' })
  1 failed
  9 passed (6.8s)
$ node scripts/va-cham-lab.mjs reports/e2e-all.json
24 lab codes used by 25 tests
⚠️  QA-912 is used by 2 tests:
    [firefox] a booking by an shows up in the admin list
    [firefox] as student an › 31 seats waits for approval (BR-06)`;
const FIX = `const SPACE = 26 * 26 * 900;       // 608,400 codes, was 900
export function freshLab(testInfo) {
  const key = [testInfo.testId,
    testInfo.repeatEachIndex, testInfo.retry].join('/');
  const n = parseInt(createHash('sha256').update(key)
    .digest('hex').slice(0, 12), 16) % SPACE;
  …  // two letters + '-' + 100…999
  testInfo.annotations.push(
    { type: 'lab', description: lab });
  return lab;
}`;
const T_FIX = `$ … npx playwright test e2e/ --reporter=json …
$ node scripts/va-cham-lab.mjs reports/e2e-all.json
playwright exit 0
25 lab codes used by 25 tests
✔ no two tests share a lab code`;

export const slides = lamDeck({ chuong: 'Chapter 11 — Capstone: a fully tested booking app', bai: '11.3' }, [
  { cover: true, t: 'Testing the frontend<br>and the full flow', sub: 'Chapter 11 · Lesson 11.3 — the My bookings screen, its component tests, and one browser journey' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Test a screen with <b>four states</b> and a button per row, by roles and names</li>
    <li>Say what a <b>stub client</b> cannot see — and prove it with a planted bug</li>
    <li>Spot a component test that only checks its own <b>mock</b></li>
    <li>Write <b>one</b> Playwright journey that checks the server, not the screen's memory</li>
    <li>Find a flaky test caused by <b>shared test data</b>, and fix it for good</li></ul>` },
  { t: 'One screen, four states, a button per row', body: two(js(WEB, { sm: true, hl: [7, 11, 13] }),
      box('The server decides', `Who may cancel and until when is the rule of 11.2. The screen only shows the answer: ${c('200')} → the server's row, ${c('422')} → "Too late…", ${c('409')} → mark it CANCELLED, a thrown error → "Cannot reach the server".`, 'lam') +
      box('Accessible names', `Each Cancel button is named after its booking: ${c('Cancel BE-201 on 2026-11-16 at 08:00')}. Tests and screen readers find the same thing.`, 'xanh'), 'r64') },
  { t: 'Component tests: what the user sees', body: vt(T_WEB, { title: 'terminal — Testing Library · jsdom', fs: 13 }) +
    two(box('Stub client', `${c('listMine')} and ${c('cancelBooking')} are ${c('vi.fn')} answers: no server, no network, 1.14 s for 8 tests.`, 'lam'),
      box('Waiting on purpose', `${c('deferred()')} keeps the request open, so the test can see "Cancelling…" and check that a double click sent one request.`, 'xanh')) },
  { t: 'The stub blind spot: 24 green, the user stuck', body: vt(STUB_WEB, { title: 'component tests — the URL is wrong', fs: 14 }) + vt(STUB_E2E, { title: 'the browser journey — same bug', fs: 14 }) +
    box('Why only the journey sees it', `The stub never builds a URL. In the real app Express answers ${c('/cancellation')} with its own 404 HTML page, ${c('res.json()')} throws, and the screen shows <b>“Cannot reach the server. Check your connection.”</b> — the row stays CONFIRMED.`, 'do2') },
  { t: 'A test that only checks the mock', body: two(js(MOCK, { sm: true, hl: [7] }),
      box('What it proves', `That a function was called with 1 — not that the user sees anything change. Remove the line that updates the row and watch.`, 'do2'), 'r64') +
    vt(T_MOCK, { title: 'the screen never updates the row — who notices?', fs: 16 }) },
  { t: 'One end-to-end journey', body: flow([{ t: 'Book', s: 'a fresh lab' }, { t: 'My bookings', s: 'by its link' }, { t: 'Cancel', s: 'the row’s button', mau: '#c0392b' }, { t: 'Reload', s: 'server truth', mau: '#b85a2b' }, { t: 'Book again', s: 'slot is free', mau: '#2f7d4f' }], { h: 130, fs: 20 }) +
    js(E2E, { sm: true, hl: [2, 6, 8] }) + vt(T_E2E, { title: 'Playwright 1.64 · Chromium', fs: 13 }) },
  { t: 'Two traps: “the” Cancel button and the clock', body: vt(STRICT, { title: 'two bookings, one name', fs: 12 }) +
    vt(BOMB, { title: 'a booking for today at 07:00 — run in the daytime', fs: 13 }) +
    two(box('Fix 1', `Find the row first, then its button — or use the full accessible name.`, 'xanh'),
      box('Fix 2', `Dates relative to <b>today in Viet Nam</b>, a few days ahead. A fixed time of day passes early in the morning and fails later.`, 'xanh')) },
  { t: 'An old test turns flaky', body: vt(FLAKY, { title: 'Firefox — after renaming “31 seats waits for approval” to add (BR-06)', fs: 12 }) +
    box('The birthday problem', `freshLab hashes the testId into 900 codes. A new name is a new testId. With 25 tests: 1 − e<sup>−25·24/(2·900)</sup> ≈ <b>28%</b> that two share a code. It hit.`, '') },
  { t: 'The fix: 608,400 codes and a report that tells', body: two(js(FIX, { hl: [1, 8] }),
      box('Two changes', `Two letters × 900 numbers. And every test writes the code it used into the report as an annotation, so ${c('va-cham-lab.mjs')} can list duplicates instead of you guessing.`, 'xanh'), 'r64') +
      vt(T_FIX, { title: '5 browsers and devices, after the fix', fs: 17 }) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `As An, book a fresh lab four days from today; as Binh, sign in and open <b>My bookings</b>`,
      `Wait until the list has loaded (no ${c('status')}), then expect An's row to have count <b>0</b>`,
      `Plant ${c('repo.list()')} in place of ${c('listMyBookings(repo, req.user.id)')} and run it again`,
    ]) + tbl(['Run', 'Result'], [['the real code', '3 passed (2.6s)'], ['planted bug: everyone’s bookings', 'Expected: 0 · Received: 1 — 1 failed']]) +
    box('Done when', 'Green on the real code, red with the planted bug — privacy checked at the layer the user sees.', 'xanh') },
]);
