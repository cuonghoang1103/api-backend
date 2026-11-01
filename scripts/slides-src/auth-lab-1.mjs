/**
 * auth-lab-1 — Authentication · Chapter 1 · Lab 1 "Build LabFlow ID's toolkit of primitives" (01/11/2026).
 * Slug bài: auth-1-7-lab-bo-cong-cu. Output = s01/_ma.mjs (máy chấm scripts/cham-lab-1.mjs chạy thật).
 */
import { lamDeck, js, vt, two, box, steps, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s01/_ma.mjs';

export const deck = { key: 'auth-lab-1', code: 'AUTH Lab 1', title: 'Build LabFlow ID’s toolkit of primitives', sub: 'Six functions, nine checks, ten points' };

const yeu = OUT['lab-yeu'].split('\n').filter((l) => !l.startsWith('    ↳') && !l.startsWith('!')).slice(1).join('\n');
// verifyValue as it is in src/crypto/signed.js, end-of-line comments removed to fit the column
const SG = CODE.signed.split('\n');
const VERIFY = SG.slice(SG.findIndex((l) => l.startsWith('export function verifyValue')), SG.length).join('\n').replace(/ *\/\/.*$/gm, '').trim();
const ref = OUT['lab-tham-khao'].split('\n').slice(1).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 1 — Credentials and primitives', bai: 'Lab 1' }, [
  { cover: true, t: 'Build LabFlow ID’s<br>toolkit of primitives', sub: 'Chapter 1 · Lab 1 — six functions every later chapter imports' },
  { t: 'Mission', body: cards([
      [c('newToken(prefix)'), '256 random bits from the CSPRNG, <b>lfid_ses_</b> + 43 chars; bad prefix ⇒ TypeError'],
      [c('tokenDigest(token)'), 'SHA-256 hex — what the database stores (lesson 1.3)'],
      [c('safeEqual(a, b)'), 'equal strings only, never throws, <b>flat time</b>'],
      [c('signValue / verifyValue'), '<b>value.exp.kid.sig</b> — tamper, expiry, key rotation ⇒ null'],
      [c('redact(obj, allow)'), '<b>allow-list</b>, deep, input untouched (lesson 1.5)'],
      ['Graded by behaviour', `${c('node scripts/cham-lab-1.mjs lab1/my')} — 9 checks, 10 points, <b>pass = 7</b>`],
    ], 3) },
  { t: 'Start from the empty starter', body: js(`// lab1/my/index.js  (cp -r lab1/starter lab1/my)
import { randomBytes, createHash, createHmac, timingSafeEqual } from 'node:crypto';
export function newToken(prefix, bytes = 32) { throw new Error('TODO newToken'); }
export function tokenDigest(token) { … }      export function safeEqual(a, b) { … }
export function signValue(value, opts) { … }  export function verifyValue(signed, opts) { … }
export function redact(value, allow) { … }`) +
      vt(OUT['lab-bat-dau'], { title: 'terminal' }) + box('Keep the six names', 'The grader imports them. Write your own scratch calls first — the grader is a safety net, not your test suite.', 'lam') },
  { t: 'Nine checks, and what a failure means for a user', body: `<table class="t"><tr><th>Check</th><th>Pts</th><th>If it fails…</th></tr>
    <tr><td>T1 token format · T2 CSPRNG</td><td>1 + 1.5</td><td>short, predictable tokens (lesson 1.2)</td></tr>
    <tr><td>T3 digest</td><td>0.5</td><td>the table stores the token itself</td></tr>
    <tr><td>T4 safeEqual correct · T5 flat time</td><td>1.5 + 1</td><td>${c('undefined === undefined')} lets a request through; the click of 1.3</td></tr>
    <tr><td>T6 tamper · T7 expiry boundary</td><td>1.5 + 1</td><td>STUDENT → LAB_MANAGER; “15 minutes” + 1 second</td></tr>
    <tr><td>T8 kid, rotation, malformed</td><td>1</td><td>rotating a leaked key breaks everyone; garbage crashes the route</td></tr>
    <tr><td>T9 redact allow-list</td><td>1</td><td>${c('x-session')}, ${c('otp')}, ${c('matKhau')} land in the log</td></tr></table>` },
  { t: 'A first attempt that “works”: 2 / 10', body: vt(yeu, { title: 'node scripts/cham-lab-1.mjs lab1/yeu' }) +
      box('Every happy-path call was right', `Math.random tokens, ${c('a === b')} (6.73× slower when the difference is at the end of 1,024 chars), ${c('now > exp')}, no kid, a deny-list. Each ✗ is a real bug.`, 'do2') },
  { t: 'Reference: LabFlow ID’s src/crypto — 10 / 10', body: js(VERIFY, { sm: true, hl: [8, 9] }) + vt(ref, { title: 'node scripts/cham-lab-1.mjs src/crypto' }) },
  { t: 'Rubric: the grader is the rubric', to: true, giua: true, body: steps([
      '<b>10 points</b> from 9 behaviour checks — pass at <b>7</b>',
      'Run it <b>twice</b>: T5 measures time, one noisy run is not a pass',
      'Read the source too: no ' + c('Math.random') + ', no secrets in ' + c('console.log'),
      'Be able to say what a <b>user</b> suffers for each check you fail',
    ]) + box('Why behaviour, not code review', 'Two correct toolkits can look completely different (double HMAC vs an XOR loop both pass T5). The grader only asks what an attacker or a user would see.', 'lam') },
  { t: 'Hints, from light to strong', body: steps([
      'Every function has a lesson — re-run that lesson’s demo when a check fails',
      `${c('safeEqual')}: type check, HMAC both sides with a per-process key, ${c('timingSafeEqual')}`,
      `${c('verifyValue')}: exactly 4 parts · ${c('Object.hasOwn(keys, kid)')} · signature before expiry · ${c('now ≥ exp')} ⇒ null`,
      `${c('redact')}: recursive walk — arrays map, objects ${c('Object.fromEntries')}, primitives as they are`,
    ]) + box('Trap inside the grader', 'The first T5 timed ' + c('safeEqual') + ' without using the result — the JIT deleted the work and ' + c('===') + ' “passed” at 1.0×. Count every result.', 'do2') },
  { t: 'Checklist before you submit', to: true, giua: true, body: `<ul>
    <li>${c('node scripts/cham-lab-1.mjs lab1/my')} ≥ 7, <b>twice in a row</b></li>
    <li>No ${c('Math.random')}, no secrets logged</li>
    <li>You can explain T5 and T8 in your own words</li>
    <li>Optional: point ${c('src/server.js')} at your toolkit; ${c('npm test')} + the guess attack still behave</li>
    <li>Next: Chapter 1 quiz, then Chapter 2 — passwords</li></ul>` },
]);
