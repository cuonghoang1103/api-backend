/**
 * auth-lab-2 — Authentication · Chapter 2 · Lab 2 "LabFlow ID's password module" (01/11/2026).
 * Slug bài: auth-2-7-lab-luu-mat-khau. Output = s02/_ma.mjs (máy chấm scripts/cham-lab-2.mjs chạy thật trong env -i).
 */
import { lamDeck, js, vt, sh, two, box, steps, cards, c } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s02/_ma.mjs';

export const deck = { key: 'auth-lab-2', code: 'AUTH Lab 2', title: 'LabFlow ID’s password module', sub: 'Four functions, nine checks, ten points' };
const noWhy = (k) => OUT[k].split('\n').filter((l) => !l.startsWith('    ↳')).slice(1).join('\n');
const why = (k) => OUT[k].split('\n').filter((l) => l.startsWith('    ↳')).map((l) => l.trim()).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 2 — Passwords', bai: 'Lab 2' }, [
  { cover: true, t: 'LabFlow ID’s<br>password module', sub: 'Chapter 2 · Lab 2 — store, verify, upgrade and refuse passwords' },
  { t: 'Mission', body: cards([
      [c('hashPassword(pw)'), 'argon2id, <b>measured</b> parameters, a self-describing string (2.1, 2.2)'],
      [c('verifyPassword(stored, pw)'), '⇒ ' + c('{ ok, rehash }') + ' for argon2id, old params, bcrypt, wrapped MD5; never throws (2.5)'],
      [c('checkNewPassword(pw, ctx)'), 'NIST 800-63B-4: 15–128, blocklist, context words — <b>no symbol rules</b> (2.4)'],
      [c('signIn(store, email, pw)'), 'one answer, one verify on every path, NFC, upgrade on success (2.3)'],
      ['No database needed', 'the grader passes a fake store: ' + c('findByEmail') + ', ' + c('updateHash')],
      ['Graded by behaviour', c('node scripts/cham-lab-2.mjs lab2/my') + ' — 9 checks, 10 points, <b>pass = 7</b>'],
    ], 3) },
  { t: 'Setup', body: sh(`$ docker run -d --name labflow-id-pg -p 127.0.0.1:4832:5432 \\
    -e POSTGRES_USER=labflow -e POSTGRES_PASSWORD=labflow-demo-pw -e POSTGRES_DB=labflow_id postgres:17
$ export DATABASE_URL=postgres://labflow:labflow-demo-pw@127.0.0.1:4832/labflow_id
$ npm ci && npm run migrate && npm run seed
$ cp -r lab2/starter lab2/my`, { title: 'once, in your labflow-id folder' }) +
      vt(OUT['lab-bat-dau'].split('\n').filter((l) => !l.startsWith('    ↳')).slice(1, 4).join('\n') + '\n…\n' + OUT['lab-bat-dau'].split('\n').at(-1), { title: 'node scripts/cham-lab-2.mjs lab2/starter' }) +
      box('Only lab2/my/index.js', 'Keep the four exported names. Allowed: node:crypto (md5 for the legacy branch), argon2, bcrypt. The wordlist must exist for T8 — the setup of lesson 0.3 downloaded it.', 'lam') },
  { t: 'Nine checks, and what a failure means for a user', body: `<table class="t"><tr><th>Check</th><th>Pts</th><th>If it fails…</th></tr>
    <tr><td>T1 argon2id ≥ OWASP, salted · T2 stolen row resists</td><td>1 + 1.5</td><td>a dump turns into passwords in seconds</td></tr>
    <tr><td>T3 verify right/wrong, never throws, NFC</td><td>1</td><td>a 500 on bad input; “tổ hợp” typing locked out</td></tr>
    <tr><td>T4 old params, bcrypt, wrapped MD5 ⇒ rehash</td><td>1.5</td><td>legacy users cannot sign in, or never upgrade</td></tr>
    <tr><td>T5 upgrade only on success · T7 one answer</td><td>1 + 0.5</td><td>a wrong password rewrites rows; “no such account” leaks</td></tr>
    <tr><td>T6 same time for both failures (&lt; 1.5×)</td><td>1.5</td><td>the clock lists your users (2.3)</td></tr>
    <tr><td>T8 NIST policy · T9 no *Sync, no logged password</td><td>1 + 1</td><td>Password1! accepted, 123456 too; a frozen server</td></tr></table>` },
  { t: 'A first attempt that “works”: 3.5 / 10', body: vt(noWhy('lab-yeu'), { title: 'node scripts/cham-lab-2.mjs lab2/yeu', sm: true }) +
      box('Every happy-path call was right', 'argon2.hash() with defaults, verify without NFC, an early return, two messages, symbol rules. Each ✗ is a real bug.', 'do2') },
  { t: 'Why each check failed', body: sh(why('lab-yeu'), { title: 'the ↳ lines of the same run', sm: true }) +
      cards([
        ['T6 4,590.6×', 'no hash for unknown emails: 0.0 ms vs 35.2 ms'],
        ['T4', 'old params “fine” forever: ' + c('rehash: false') + ' always'],
        ['T8', 'the symbol rules never ask whether 123456 is common'],
      ], 3) },
  { t: 'Reference: LabFlow ID’s src/passwords — 10 / 10', body: vt(OUT['lab-tham-khao'].split('\n').slice(1).join('\n'), { title: 'node scripts/cham-lab-2.mjs src/passwords' }) +
      box('Read it after your attempt', c('hash.js') + ' (2.2, 2.5) · ' + c('policy.js') + ' (2.4) · ' + c('signin.js') + ' (2.3) · ' + c('pwned.js') + ' (HIBP, not graded offline)', 'lam') },
  { t: 'Hints, from light to strong', body: steps([
      'Every check has a lesson — rerun that lesson’s demo when it fails',
      `${c('verifyPassword')}: type guard first, then dispatch on the prefix; ${c('rehash = ok && needsRehash(stored)')}`,
      `${c('signIn')}: ${c('DUMMY')} hashed at startup with your PARAMS; ${c('user?.passwordHash ?? DUMMY')}`,
      `${c('checkNewPassword')}: NFC, ${c('[...pw].length')}, whole-password blocklist, letters-only context match`,
    ]) + box('Rubric = grader', '10 points from behaviour; pass at 7; run it twice (T2 and T6 measure time).', 'lam') },
  { t: 'Checklist before you submit', to: true, giua: true, body: `<ul>
    <li>${c('node scripts/cham-lab-2.mjs lab2/my')} ≥ 7, <b>twice in a row</b></li>
    <li>${c('npm test')} still passes; no ${c('hashSync')}, no password in a log</li>
    <li>Your PARAMS came from <b>your</b> ${c('demo2/tune.mjs')} run — write the two budgets in a comment</li>
    <li>You can say what a user suffers for each check of the first attempt</li>
    <li>Next: Chapter 2 quiz, then Chapter 3 — sessions and cookies</li></ul>` },
]);
