/**
 * auth-05-5 — Authentication · Chapter 5 · Lesson 5.5 "The refresh race…" (03/11/2026).
 * Slug bài: auth-5-5-cuoc-dua-refresh. Output = s05/_ma.mjs. Slide titles match giang/auth-05-5.mjs.
 */
import { lamDeck, js, sh, two, box, cards, steps, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s05/_ma.mjs';

export const deck = { key: 'auth-05-5', code: 'AUTH 5.5', title: 'The refresh race, and the false positive that kills the feature', sub: 'Two tabs, one cookie; a short grace window keeps it from logging users out' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const L = CODE.layer.split('\n');
const GRACE = L.slice(L.findIndex((l) => l.includes('if (rec.usedAt)')), L.findIndex((l) => l.includes('const next = await issue'))).join('\n').replace(/ +\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 5 — Refresh, rotation and revocation', bai: '5.5' }, [
  { cover: true, t: 'The refresh race, and the false<br>positive that kills the feature', sub: 'Chapter 5 · Lesson 5.5 — an ordinary browser, not a clever attacker' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>How two tabs of one browser create a legitimate refresh race</li>
    <li>Why naive rotation turns that race into a false theft alarm</li>
    <li>A short grace window that returns the first request’s new token to the second</li>
    <li>Keep the window short and shared, or it becomes a theft hole</li></ul>` },
  { t: 'Two tabs, one cookie', giua: true, body: cards([
      ['Two cashiers', 'one till drawer; both grab the same coupon at once'],
      ['A naive rule', '“a coupon used twice is fraud” would accuse an honest customer'],
      ['A moment’s grace', 'the same coupon in the next few seconds is the same sale'],
    ], 3) + box('The tabs are the cashiers', 'A cookie is shared across a browser’s tabs; both can POST /refresh with the same refresh cookie before either sees the other’s new one.', 'lam') +
      box('Not an attacker', 'The danger of reuse detection is that the thing which trips it most is an ordinary browser — two open tabs — not a clever adversary.', 'do2') +
      box('The coupon is the cookie', 'The question is only whether the system treats the second presentation as the same sale or a second one.', 'lam') },
  { t: 'Naive rotation flags the second as theft', giua: true, body: steps([
      'Tab A rotates first and marks the token <b>used</b>',
      'Tab B arrives a moment later with the same, now-used token',
      'Naive rotation has one rule for a used token — reuse',
      'So it revokes the family — and the real user is logged out',
    ]) + box('A legitimate action, punished', 'Nothing was stolen; two tabs just refreshed at once — yet the family is revoked and the user re-authenticates.', 'do2') +
      box('Why it happens', 'An expired access token in two open tabs means two 401s, so two /refresh calls with one cookie.', 'lam') },
  { t: 'A detection that logs out real users is worse than none', giua: true, body: two(
      box('Support fills up', 'with “it keeps logging me out”, and the race is common.', 'do2'),
      box('So teams turn it off', 'and lose the real protection entirely.', 'do2')) +
      box('A false positive removes the feature', 'Correctness of a security control includes not punishing honest users.', 'xanh') +
      box('The irony', 'A reuse detector that logs real users out is deleted; the carefully-built protection is gone, and a stolen token now works for 30 days.', 'lam') },
  { t: 'The grace window', body: js(GRACE, { sm: true, hl: [3] }) +
      box('Remember the child for a few seconds', 'When a token is rotated, cache its new child; a second use of the same token within the window returns that child instead of flagging reuse.', 'xanh') +
      box('The race gets one answer', 'Both tabs end up with the same new token, so both stay signed in — and a genuine replay, seconds later, is still theft.', 'lam') },
  { t: 'Within grace vs after grace', body: `<table class="t"><tr><th>Second request, same token…</th><th>Grace 10 s</th><th>Grace 0 (naive)</th></tr>
    <tr><td>50 ms after the first (a race)</td><td>gets the first’s new token</td><td>${c('REUSE_DETECTED')}</td></tr>
    <tr><td>11 s after the first (a replay)</td><td>${c('REUSE_DETECTED')}</td><td>${c('REUSE_DETECTED')}</td></tr>
    <tr><td>both tabs stay signed in?</td><td><b>yes</b></td><td>no</td></tr></table>` +
      box('The window does not weaken detection', 'A replay 11 s later is still theft — a genuine browser race is over in milliseconds, not seconds.', 'lam') },
  { t: 'The grace window must not be a hole', giua: true, body: two(
      box('Keep it short', 'seconds, not minutes — or it becomes a window where a stolen, already-rotated token still works.', 'do2'),
      box('Keep it shared', 'across servers, not per process — or a load balancer splits the two tabs onto machines that do not share it.', 'do2')) +
      box('Short and shared', 'A real race needs only seconds; Redis holds the shared cache once you run more than one process (Ch 11).', 'xanh') },
  { t: 'Measured', body: sh(body('55-race'), { title: 'node demo5/race.mjs', sm: true }) +
      box('The only difference is the window', 'Grace 10 s: both tabs get the same token, stay signed in; ~150,000 rotations/s. Grace 0: the second tab gets REUSE_DETECTED and the user is logged out.', 'xanh') },
  { t: 'Trap: a grace window that is too long or per-process', giua: true, body: box('Minutes of grace', 'is a theft window: a stolen, already-rotated token now falls inside it and still works.', 'do2') +
      box('A per-process cache behind a load balancer', 'still splits the race onto two servers, so the race flags theft again.', 'do2') +
      box('The rule', 'short (seconds) and shared (Redis, Chapter 11).', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Two tabs of one browser share a cookie and can refresh at the same moment — a legitimate race</li>
    <li>Naive rotation flags the second request as reuse and revokes the family: a false theft alarm</li>
    <li>A control that logs real users out gets turned off, so the false positive removes the protection</li>
    <li>A short grace window returns the first request’s new token to the second; after it, reuse is still theft</li>
    <li>Next — Lab 5: build the refresh layer</li></ul>` },
]);
