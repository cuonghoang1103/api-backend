/**
 * tst-lab-3 — Testing · Chapter 3 · Lab 3 "Test the e-mail flow with honest doubles — kill 8 mutants" (01/11/2026).
 * Slug bài: tst-3-5-lab-test-double. Output = chạy thật: bộ yếu 3 test xanh → 0/8; lời giải 11 test (73 cả dự án) → 8/8.
 */
import { lamDeck, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-lab-3', code: 'TST Lab 3', title: 'Lab 3 — honest doubles', sub: 'kill 8 mutants in the e-mail flow' };

const WEAK_RUN = ` ✓ src/weak3.test.js (3 tests) 61ms
   ✓ bookAndNotify sends a mail 14ms
   ✓ bookAndNotify returns the booking 13ms
   ✓ the mailer returns the message id 29ms`;
const WEAK = `✘ SURVIVED  #1 confirmation goes to the approver
✘ SURVIVED  #2 e-mail subject without the date
✘ SURVIVED  #3 approver mail without the seat count
✘ SURVIVED  #4 a failed e-mail fails the booking request
✘ SURVIVED  #5 a failed e-mail is not logged
✘ SURVIVED  #6 rate limit not recognised
✘ SURVIVED  #7 API key sent without "Bearer "
✘ SURVIVED  #8 4xx answers treated as success

0/8 mutants killed`;
const STRONG = `✔ killed    #1 confirmation goes to the approver
✔ killed    #2 e-mail subject without the date
✔ killed    #3 approver mail without the seat count
✔ killed    #4 a failed e-mail fails the booking request
✔ killed    #5 a failed e-mail is not logged
✔ killed    #6 rate limit not recognised
✔ killed    #7 API key sent without "Bearer "
✔ killed    #8 4xx answers treated as success

8/8 mutants killed`;
const FULL = ` Test Files  9 passed (9)
      Tests  73 passed (73)`;

export const slides = lamDeck({ chuong: 'Chapter 3 — Test doubles without lying to yourself', bai: 'Lab 3' }, [
  { cover: true, t: 'Lab 3 — honest doubles:<br>kill 8 mutants', sub: 'Chapter 3 lab · 75 minutes · graded by a script, not by opinion' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Test ${c('notify.js')} (${c('buildMail')}, ${c('bookAndNotify')}) and ${c('mailer.js')} (${c('createHttpMailer')})`,
      'Real business rules; fakes for storage and e-mail; MSW for HTTP; no vi.mock',
      `Run ${c('node scripts/dot-bien-3.mjs')}: 8 bugs, planted one at a time`,
      'A good suite turns red for every one — 8/8 “killed”',
    ]) + box('New this time', 'The bugs are in the glue: who gets which e-mail, what happens when the provider fails, and how the HTTP contract is spoken.', 'lam') },
  { t: 'The 8 planted bugs', body: zm(`<table class="t" style="font-size:17px"><tr><th>#</th><th>File</th><th>Original</th><th>Planted bug</th></tr>
    <tr><td>1</td><td>notify.js</td><td>${c('return { to: studentEmail,')}</td><td>${c('return { to: APPROVER,')}</td></tr>
    <tr><td>2</td><td>notify.js</td><td>${c("booking.lab + ' on ' + booking.date + ' at '")}</td><td>${c("booking.lab + ' at '")}</td></tr>
    <tr><td>3</td><td>notify.js</td><td>${c("booking.seats + ' seats, ' + ")}</td><td>(removed)</td></tr>
    <tr><td>4</td><td>notify.js</td><td>${c('return { ...booking, notified: false };')}</td><td>${c('throw err;')}</td></tr>
    <tr><td>5</td><td>notify.js</td><td>${c("log.warn('mail failed")}</td><td>${c("void ('mail failed")}</td></tr>
    <tr><td>6</td><td>mailer.js</td><td>${c('res.status === 429')}</td><td>${c('res.status === 503')}</td></tr>
    <tr><td>7</td><td>mailer.js</td><td>${c("'Bearer ' + apiKey")}</td><td>${c('apiKey')}</td></tr>
    <tr><td>8</td><td>mailer.js</td><td>${c('if (!res.ok)')}</td><td>${c('if (res.status >= 500)')}</td></tr></table>`, 1.05) },
  { t: 'A typical first attempt: 0 of 8', body: vt(WEAK_RUN, { title: 'terminal — 3 tests, all green', fs: 16 }) +
    two(vt(WEAK, { title: 'node scripts/dot-bien-3.mjs', fs: 13 }), box('Why nothing was caught', `${c('toHaveBeenCalled()')} without arguments, a mailer that never fails, and only the 200 answer from the provider. Every test is about “something happened”, none about <b>what</b>.`, 'do2'), 'r64') },
  { t: 'The reference solution: 8 of 8', body: two(`<div>${vt(STRONG, { title: '11 tests: notify.test.js + mailer.test.js', fs: 13 })}${vt(FULL, { title: 'npx vitest run src/ — whole project', fs: 15 })}</div>`, box('What made the difference', `<ul style="font-size:19px"><li>exact mail (to + subject) for CONFIRMED and PENDING</li><li>a stub mailer that throws: booking kept, ${c('notified: false')}, warning text</li><li>MSW: Bearer header, JSON body, 429, 400, 503</li><li>a rejected booking sends no mail</li></ul>`, 'xanh'), 'r64') },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr>
    <tr><td>Mutants killed</td><td>4 (0.5 each)</td><td>${c('node scripts/dot-bien-3.mjs')}</td></tr>
    <tr><td>Right double for each job: fakes for repo/mailer, stub for failures, MSW for HTTP; no ${c('vi.mock')} of own modules</td><td>2</td><td>read the tests</td></tr>
    <tr><td>Outcomes asserted (outbox, stored rows, result); interactions only for the log warning and the HTTP request</td><td>2</td><td>read the tests</td></tr>
    <tr><td>No real network: unhandled requests fail (${c("onUnhandledFrame: 'error'")})</td><td>1</td><td>config of the MSW server</td></tr>
    <tr><td>Names, structure, under 1 s, no ${c('.only')}/${c('.skip')}</td><td>1</td><td>report tree</td></tr></table>`, 1.02) +
    box('Pass mark', '7/10. A suite that kills 8 mutants with mocks of its own modules loses the two “right double” points.', 'xanh') },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      'Write the e-mail rules as sentences: who receives what, with which subject',
      `For ${c('buildMail')} use a two-row table and compare the whole object`,
      'Make the mailer fail with a stub; check the result, the stored row and the warning text',
      'In MSW, record the request (header + JSON) and answer 429, 400 and 503 in separate tests',
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('npx vitest run src/')} green, no ${c('.only')} / ${c('.skip')}, no real network</li>
    <li>${c('node scripts/dot-bien-3.mjs')} prints <b>8/8 mutants killed</b></li>
    <li>Labs 1 and 2 still print 8/8</li>
    <li>${c('git diff src/')} shows only test files</li>
    <li>Commit: ${c('test: e-mail flow with fakes and MSW (Lab 3, 8/8)')}</li></ul>` },
]);
