/**
 * auth-06-4 — Authentication · Chapter 6 · Lesson 6.4 "Account enumeration, and the leak no wording change can close" (04/11/2026).
 * Slug bài: auth-6-4-do-tai-khoan. Output = s06/_ma.mjs (LabFlow ID v0.6 + PostgreSQL 17.11, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s06/_ma.mjs';

export const deck = { key: 'auth-06-4', code: 'AUTH 6.4', title: 'Account enumeration, and the leak no wording change can close', sub: 'The timing oracle a generic message cannot hide' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const L = CODE.layer.split('\n');
const REQ = L.slice(L.findIndex((l) => l.includes('async function requestPasswordReset')), L.findIndex((l) => l.includes('return { issueToken'))).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 6 — The account lifecycle', bai: '6.4' }, [
  { cover: true, t: 'Account enumeration, and the leak<br>no wording change can close', sub: 'Chapter 6 · Lesson 6.4 — the course’s deliberate hole #2, measured and closed' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Enumeration is learning which emails have an account — a list you never meant to publish</li>
    <li>Four leak channels: message, status, <b>time</b>, side effect</li>
    <li>A generic message closes one of them; the clock it cannot touch</li>
    <li>Measure a timing leak with a median over many requests</li>
    <li>Close it two ways: same work in both branches, or off the response path</li></ul>` },
  { t: 'The two doorbells', giua: true, body: cards([
      ['Two identical doorbells', 'Both answer with the same words: "who is it?" — nothing in the message differs.'],
      ['One answers a second slower', 'Because someone is home and has to walk to the door — a delay the empty house does not have.'],
      ['The delay is the leak', 'The words match; the clock does not. An attacker who times both learns which house is occupied.'],
    ], 3) + box('The part everyone misses', 'Even a perfectly uniform message can leak through timing. Fixing the words is the easy half; the clock is the half almost nobody measures — this lesson builds the leak, measures it, and closes it.', 'lam') },
  { t: 'The four channels', giua: true, body: `<table class="t"><tr><th>Channel</th><th>Example</th><th>Close it by</th></tr>
    <tr><td>the message</td><td>"no such user" vs "wrong password"</td><td>one generic response</td></tr>
    <tr><td>the status</td><td>404 for missing vs 401 for wrong password</td><td>same status for both</td></tr>
    <tr><td>the <b>time</b></td><td>a real account triggers insert/email/argon2</td><td>same work, or off the path</td></tr>
    <tr><td>side effects</td><td>a real account gets an email, a fake one does not</td><td>send nothing a non-account sees</td></tr></table>` +
      box('A uniform message closes only one of the four', 'The status, the clock and the side effects each answer "does this account exist?" on their own. Enumeration is closed only when all four are silent.', 'lam') },
  { t: 'The wording leak is the easy half', giua: true, body: two(
      box('Already fixed in LabFlow ID', '/forgot-password always says "if an account exists, a link is on its way"; sign-up always returns 202 (6.1). The message channel is closed.', 'xanh'),
      box('Same for the status code', 'Never 404 for a missing account and 200 for a found one — a differing status is the same oracle in a different field.', 'lam')) +
      box('But the clock is wide open', 'A real account triggers a token insert and an email that a fake one skips. Await that work before replying and the identical message now sits on top of a stopwatch.', 'do2') },
  { t: 'The foil: /forgot-password-naive', body: js(REQ, { sm: true }) +
      box('sync = AWAIT the work', 'The naive endpoint awaits the insert + send ⇒ a real account is measurably slower. The fix fires it off the response path.', 'do2') },
  { t: 'Measured: the leak and the fix', body: sh(body('64-enum'), { title: 'node demo6/enum-timing.mjs', sm: true }) +
      box('~0.9 ms, consistent', 'The naive endpoint: real ≈ 2× fake, stable across 200 requests. The fix brings it into the noise.', 'lam') },
  { t: 'The other door: sign-up', giua: true, body: two(
      box('Taken vs free email', 'Measured at /sign-up: both take ~190 ms, a ratio of ~1x — the taken email and the free one answer in the same time.', 'xanh'),
      box('Why', 'The password is hashed with argon2 in BOTH branches (6.1), so that ~190 ms dominates both and creating a row is a rounding error beside it.', 'lam')) +
      box('Two valid fixes, one per door', 'Sign-up: the expensive step (argon2) is unavoidable in both branches, so you make it symmetric. Forgot-password: the expensive step only makes sense for a real account, so you move it off the response path.', 'lam') },
  { t: 'Trap: "we fixed the message"', giua: true, body: box('Not closed', 'The naive numbers come from a perfectly uniform message — the leak is entirely in the timing.', 'do2') +
      box('Any account-specific work before replying', 'an email, a token insert, an argon2 on the real path only — is a timing oracle wearing a generic message.', 'do2') +
      box('Consistency beats magnitude', '0.9 ms sounds unexploitable; averaged over thousands of requests it is a stable, readable signal.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Four channels: message, status, time, side effect — a uniform message closes only one</li>
    <li>A real account that triggers insert/email/argon2 a fake one skips is a timing oracle</li>
    <li>Measured: the naive endpoint leaks ~0.9 ms consistently; the fix brings it into the noise</li>
    <li>Close it by same work in both branches (sign-up) or off the response path (forgot-password)</li>
    <li>Next — 6.5: changing the address, and ending the account</li></ul>` },
]);
