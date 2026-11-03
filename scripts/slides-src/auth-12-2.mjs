/** auth-12-2 — Chapter 12 · 12.2 "Eight shapes" (04/11/2026). Slug auth-12-2-tam-hinh-dang. Output = s12/_ma.mjs. */
import { lamDeck, sh, two, box, cards } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s12/_ma.mjs';
export const deck = { key: 'auth-12-2', code: 'AUTH 12.2', title: 'Eight shapes of failure, and what each one means', sub: 'Read who + when; the shape names the chapter' };
export const slides = lamDeck({ chuong: 'Chapter 12 — Diagnosis', bai: '12.2' }, [
  { cover: true, t: 'Eight shapes of failure,<br>and what each one means', sub: 'Chapter 12 · Lesson 12.2 — the pattern of who and when points at the cause' },
  { t: 'Read the shape, not the message', giua: true, body: box('A single "401" is almost contentless', 'the same message whether the token expired, the key rotated, the audience is wrong, or the instances disagree.', 'do2') +
      box('The PATTERN disambiguates it', 'who is affected (everyone / new logins / one user) and when (immediately / after 15 min / only in the browser / under load).', 'xanh') +
      box('Eight shapes recur', 'each names the chapter to open before you read a stack trace.', 'lam') },
  { t: 'The first four shapes', giua: true, body: cards([
      ['Everyone logged out at once', 'a bad key/secret rotation with no overlap (11.2)'],
      ['Only NEW logins fail', 'the active signing key is broken or missing'],
      ['Works, then 401 after ~15 min', 'access token expired + broken refresh (Ch5)'],
      ['Works in Postman, fails in browser', 'a cookie problem — SameSite, Secure, CORS (Ch3)'],
    ], 1) },
  { t: 'The last four shapes', giua: true, body: cards([
      ['One specific user cannot log in', 'that account — rehash, unverified, wrong password (Ch2/6)'],
      ['Intermittent 401 on the same token', 'instances disagree — unshared keys/store (Ch11)'],
      ['Login ok, every API call 401', 'token not forwarded or wrong audience (Ch8)'],
      ['5xx on login under load', 'a dependency down/saturated — DB, Redis, a secret (Ch11)'],
    ], 1) },
  { t: 'The measured shapes', body: sh(OUT['122-shapes'].split('\n').slice(2, 9).join('\n'), { title: 'node demo12/shapes.mjs', sm: true }) +
      box('Who + when picks the shape', 'the intersection is almost always a single shape, and the shape is the diagnosis.', 'lam') },
  { t: 'The two that fool people', giua: true, body: two(
      box('"Works, then 401 after 15 min"', 'looks like a flaky login, but the exact 15-minute clock is the access-token lifetime — the refresh is broken, not the login (Ch5).', 'do2'),
      box('"Login ok, every API 401"', 'looks like a login bug, but the login succeeded — the token is not forwarded, or its audience is wrong for the API (Ch8).', 'do2')) +
      box('Both mean: look PAST the login', 'the shape tells you where NOT to waste time — the login pipeline itself is innocent in both cases.', 'xanh') },
  { t: 'Read who and when', giua: true, body: box('WHO: everyone / only new logins / one user', 'everyone is a system-wide change (a rotation, a config); only new logins is the signing path; one user is that account.', 'xanh') +
      box('WHEN: immediately / after 15 min / only in the browser / under load', 'a rotation, the access-token clock + refresh, a cookie rule the browser enforces, or a saturated dependency.', 'lam') +
      box('Collect a few data points first', 'the intersection of who and when is almost always a single shape — see it before diving into one stack trace.', 'do2') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Read the shape first — who is affected and when</li>
    <li>Each shape names a chapter: rotation, signing key, refresh, cookies, the account, instances, audience, a dependency</li>
    <li>The exact-15-minute and "login ok, API 401" shapes both mean "look past the login"</li>
    <li>A single "401" is contentless; the pattern disambiguates it</li>
    <li>Next — 12.3: the toolbox</li></ul>` },
]);
