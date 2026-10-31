/**
 * tst-lab-7 — Testing · Chapter 7 · Lab 7 "End-to-end journeys: kill 8 mutants" (01/11/2026). Slug bài: tst-7-5-lab-e2e.
 * Output = chạy thật: bộ yếu 3 test xanh → 2/8; lời giải 7 test (+2 setup) → 8/8; máy chấm ~1,5 phút (mỗi đột biến build + server + trình duyệt).
 */
import { lamDeck, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-lab-7', code: 'TST Lab 7', title: 'Lab 7 — End-to-end', sub: 'kill 8 mutants in the app, the login and the server' };

const WEAK = `✘ SURVIVED  #1 admins get the booking form, not the list
✘ SURVIVED  #2 Sign out does not end the session
✘ SURVIVED  #3 a reload signs the user out
✘ SURVIVED  #4 any password is accepted
✔ killed    #5 requests carry the wrong token
✘ SURVIVED  #6 a failed sign-in is not announced
✔ killed    #7 the username is sent as the password
✘ SURVIVED  #8 the admin account lost its role

2/8 mutants killed`;
const WEAKRUN = `  ✓  4 [chromium] › e2e/weak7.spec.js › the app loads (208ms)
  ✓  3 [chromium] › e2e/weak7.spec.js › the admin can sign in (836ms)
  ✓  5 [chromium] › e2e/weak7.spec.js › a student can book (937ms)
  5 passed (3.9s)`;
const STRONG = `✔ killed    #1 admins get the booking form, not the list
✔ killed    #2 Sign out does not end the session
✔ killed    #3 a reload signs the user out
✔ killed    #4 any password is accepted
✔ killed    #5 requests carry the wrong token
✔ killed    #6 a failed sign-in is not announced
✔ killed    #7 the username is sent as the password
✔ killed    #8 the admin account lost its role

8/8 mutants killed`;

export const slides = lamDeck({ chuong: 'Chapter 7 — End-to-end tests with Playwright', bai: 'Lab 7' }, [
  { cover: true, t: 'Lab 7 — End-to-end journeys:<br>kill 8 mutants', sub: 'Chapter 7 lab · 90 minutes · graded by a script, not by opinion' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Write ${c('e2e/dang-nhap.spec.js')} and ${c('e2e/dat-phong.spec.js')} with Playwright`,
      'Sign-in, sign-out, roles and booking journeys — with a saved session where it helps',
      `Run ${c('node scripts/dot-bien-7.mjs')}: 8 bugs in the React app, the login form and the server`,
      'A good suite turns red for every one — 8/8 “killed”',
    ]) + box('New this time', 'Each mutant rebuilds the app, starts the server and a browser: the grader takes about a minute and a half. Bugs live in wiring — sessions, roles, tokens — that no unit test touches.', 'lam') },
  { t: 'The 8 planted bugs', body: zm(`<table class="t" style="font-size:17px"><tr><th>#</th><th>File</th><th>Planted bug</th><th>What a user would notice</th></tr>
    <tr><td>1</td><td>App.jsx</td><td>${c("role === 'LECTURER'")} chooses the admin screen</td><td>the admin gets a booking form</td></tr>
    <tr><td>2</td><td>App.jsx</td><td>Sign out keeps localStorage</td><td>after a reload you are signed in again</td></tr>
    <tr><td>3</td><td>App.jsx</td><td>the session is never read back</td><td>every reload signs you out</td></tr>
    <tr><td>4</td><td>e2e/server.js</td><td>any password accepted</td><td>anyone can sign in as anyone</td></tr>
    <tr><td>5</td><td>App.jsx</td><td>the user id sent as the token</td><td>every booking fails</td></tr>
    <tr><td>6</td><td>LoginForm.jsx</td><td>error without ${c('role="alert"')}</td><td>screen readers stay silent</td></tr>
    <tr><td>7</td><td>LoginForm.jsx</td><td>username sent as the password</td><td>nobody can sign in</td></tr>
    <tr><td>8</td><td>e2e/server.js</td><td>boss is no longer ADMIN</td><td>the admin account gets the booking form</td></tr></table>`, 1.02) },
  { t: 'A typical first attempt: 2 of 8', body: vt(WEAKRUN, { title: 'npm run test:e2e — 3 tests, all green', fs: 15 }) +
    two(vt(WEAK, { title: 'node scripts/dot-bien-7.mjs', fs: 12 }), box('Why so little was caught', `The title, a ${c('waitForTimeout')} and ${c("textContent('body')")}, a URL that always contains localhost. Nothing reloads, signs out, checks roles or tries a wrong password.`, 'do2'), 'r64') },
  { t: 'The reference solution: 8 of 8', body: two(`<div>${vt(STRONG, { title: '7 tests in e2e/ (+2 setup)', fs: 12 })}${vt('  9 passed (3.9s)', { title: 'npm run test:e2e', fs: 15 })}</div>`, box('What made the difference', `<ul style="font-size:19px"><li>a wrong password → ${c("getByRole('alert')")}</li><li>reload, sign out, reload</li><li>admin sees the list, not the form</li><li>the booking appears in the admin list</li><li>web-first assertions only</li></ul>`, 'xanh'), 'r64') },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr>
    <tr><td>Mutants killed</td><td>4 (0.5 each)</td><td>${c('node scripts/dot-bien-7.mjs')}</td></tr>
    <tr><td>Journeys, not details: sign-in/out, roles, booking, cross-user</td><td>2</td><td>read the tests</td></tr>
    <tr><td>Web-first assertions; no ${c('waitForTimeout')}, no ${c('isVisible()')} in expect</td><td>2</td><td>read the tests</td></tr>
    <tr><td>Own data per test (${c('freshLab')}); passes with ${c('--repeat-each=3')}</td><td>1</td><td>run it</td></tr>
    <tr><td>Saved session where login is not the subject</td><td>1</td><td>read the tests</td></tr></table>`, 1.05) },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      'Try a wrong password and expect an alert — and the sign-in heading still there',
      'Reload after signing in; sign out; reload again',
      'Sign in as boss and expect the “All bookings” heading and no Book button',
      'Book as an, then open a second context as boss and find the row',
      `Run with ${c('--repeat-each=3')} before calling it done`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('npm run test:e2e')} green, also with ${c('--repeat-each=3')}</li>
    <li>${c('node scripts/dot-bien-7.mjs')} prints <b>8/8 mutants killed</b></li>
    <li>${c('npm run test:unit')} and ${c('npm run test:web')} still green</li>
    <li>${c('git status')}: no ${c('playwright/.auth')}, ${c('dist-web')} or ${c('test-results')}</li>
    <li>Commit: ${c('test: LabFlow Lite journeys end to end (Lab 7, 8/8)')}</li></ul>` },
]);
