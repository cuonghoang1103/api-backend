/** auth-12-4 — Chapter 12 · 12.4 "Reviewing code" (04/11/2026). Slug auth-12-4-soat-kho-ma. Output = s12/_ma.mjs. */
import { lamDeck, sh, two, box, cards } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s12/_ma.mjs';
const GREP = `grep -rn "=== *'ADMIN'"     # scattered authz (Ch9)
grep -rn "localStorage"      # token in JS-readable storage (Ch3/10)
grep -rniE "md5|sha1"        # weak password hashing (Ch2)
gitleaks detect              # a committed secret (Ch1/11)`;
export const deck = { key: 'auth-12-4', code: 'AUTH 12.4', title: 'Reviewing a codebase you did not write', sub: 'Highest risk first; grep the anti-patterns' };
export const slides = lamDeck({ chuong: 'Chapter 12 — Diagnosis', bai: '12.4' }, [
  { cover: true, t: 'Reviewing a codebase<br>you did not write', sub: 'Chapter 12 · Lesson 12.4 — a short list, checked in order, finds the real risk fast' },
  { t: 'Start at the gate, not the feature', giua: true, body: box('Do not read top to bottom', 'find the authorization gate first (Ch9): is there ONE, is it deny-by-default, does every write route go through it?', 'xanh') +
      box('Scattered role checks hide the real bugs', 'a system with if (role === \'ADMIN\') sprinkled through controllers is where the breaches live.', 'do2') +
      box('Broken Access Control is OWASP #1', 'it is the first thing a review should confirm — and you can see the structure in minutes.', 'lam') },
  { t: 'Follow one token end to end', giua: true, body: cards([
      ['Signed how', 'which algorithm, is alg:none reachable? (Ch4)'],
      ['Stored where', 'a __Host- HttpOnly cookie, or localStorage? (Ch3/10)'],
      ['Verified how', 'signature AND claims — or neither? (Ch8)'],
    ], 1) + box('A gap anywhere on that path is a bypass', 'trace the token, not the feature.', 'lam') },
  { t: 'Grep the anti-patterns', body: sh(GREP, { title: 'a few greps find most trouble', sm: true }) +
      box('The whole course has a grep signature', 'scattered authz, a token in localStorage, weak password hashing, a committed secret — each anti-pattern is one search.', 'xanh') +
      box('Minutes, not hours', 'a handful of greps surface most of the trouble before you have read a single handler end to end.', 'lam') },
  { t: 'The parts everyone forgets', giua: true, body: cards([
      ['The recovery path', 'usually weaker than login — one-time atomic tokens, reset as strong as login? (Ch6/10)'],
      ['The config', 'cookie flags, CORS, token lifetime, secrets from env — code can be perfect, the deployment insecure (Ch11)'],
      ['The data', '"code cannot produce X" ≠ X does not exist — ask the data with a query'],
    ], 1) },
  { t: 'The capstone as a review', body: sh(OUT['cuoi-yeu'].split('\n').slice(1, 9).join('\n'), { title: 'the weak build, read as a review', sm: true }) +
      box('Each ✗ is a chapter it skipped', 'a ✓ for the basics, a ✗ for each hardening — the scorecard names every gap by its chapter.', 'lam') },
  { t: 'Verify the checker, write it down', giua: true, body: two(
      box('Verify the checker', 'a passing test proves nothing if the test is wrong — the smoke-test that never ran, the lint that was disabled. Confirm the control runs and fails when it should.', 'do2'),
      box('Write findings as risk + chapter + fix', '"logs the reset token (11.4), leaks a secret, drop the field" gets fixed; "the logging looks sketchy" does not.', 'xanh')) +
      box('Spend the budget on risk, not style', 'a clean-reading handler with no authorization gate is far more dangerous than a messy one that is correctly guarded.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Review from highest risk down: the one gate, a token end to end, recovery, config, the data</li>
    <li>Grep the anti-patterns — scattered authz, localStorage, weak hashing, committed secrets</li>
    <li>The recovery path and config carry half the risk</li>
    <li>Ask the data, verify the checker, write risk + chapter + fix</li>
    <li>Next — 12.5: what to build first</li></ul>` },
]);
