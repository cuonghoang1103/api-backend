/**
 * auth-07-3 — Authentication · Chapter 7 · Lesson 7.3 "Enrolling a factor, and the recovery you will actually need" (04/11/2026).
 * Slug bài: auth-7-3-dang-ky-va-khoi-phuc. Output = s07/_ma.mjs.
 */
import { lamDeck, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s07/_ma.mjs';

const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
export const deck = { key: 'auth-07-3', code: 'AUTH 7.3', title: 'Enrolling a factor, and the recovery you will actually need', sub: 'Confirm before you trust; recovery codes shown once, stored hashed, single-use' };

export const slides = lamDeck({ chuong: 'Chapter 7 — The second factor, and passkeys', bai: '7.3' }, [
  { cover: true, t: 'Enrolling a factor, and the<br>recovery you will actually need', sub: 'Chapter 7 · Lesson 7.3 — confirm before you trust, and a way back in' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Store the TOTP secret UNCONFIRMED; require one real code before enabling it</li>
    <li>The QR is just an otpauth:// URI — secret, issuer, label, digits, period</li>
    <li>Issue recovery codes once, stored as SHA-256 digests, single-use</li>
    <li>The step-up accepts a code OR a recovery code</li>
    <li>Every recovery path is a new front door — keep it offline (Chapter 6)</li></ul>` },
  { t: 'Confirm before you trust', giua: true, body: two(
      box('Store unconfirmed, show the QR', 'then require one correct code before marking the factor on.', 'xanh'),
      box('Skip it, and…', 'a user who mis-scans or whose clock is wrong is locked out on their very next login — with no working factor to recover with.', 'do2')) +
      box('The otpauth:// URI', 'the QR the app scans carries the secret, issuer, label, digits and period — LabFlow ID builds it in one line.', 'lam') },
  { t: 'Enroll, measured over HTTP', body: sh(body('73-totp-enroll').split('\n').slice(0, 6).join('\n'), { title: 'bash demo7/totp-enroll.sh', sm: true }) +
      box('begin → confirm', 'begin returns a secret + otpauth URI; confirm with the current code returns { enabled: true } and ten recovery codes, returned ONCE.', 'xanh') },
  { t: 'Recovery codes: the way back', giua: true, body: cards([
      ['Shown once', 'ten high-entropy codes displayed at enrollment and never again'],
      ['Stored hashed', 'only SHA-256 digests kept — a dump is hashes, not working codes (1.3)'],
      ['Single-use', 'each works exactly once; a spent code helps no one'],
    ], 3) + box('Unambiguous alphabet', 'no l/o/0/1, grouped xxxx-xxxx — because humans copy these onto paper and mistype them. Generated with randomInt (1.2).', 'lam') },
  { t: 'Single-use, measured', body: sh(body('72-recovery').split('\n').slice(-7).join('\n'), { title: 'node demo7/recovery.mjs', sm: true }) +
      box('Consume once, then gone', 'consume → ok, remaining 9; the same code again → ok=false. A spent code is as useless to an attacker as to the user.', 'xanh') +
      box('Stored as digests', 'the server kept only SHA-256 digests — a database dump is a list of hashes, not of working recovery codes (1.3).', 'lam') },
  { t: 'The step-up accepts either', body: sh(body('73-totp-enroll').split('\n').slice(-6).join('\n'), { title: '/mfa/totp/verify' }) +
      cards([['A fresh code', 'the normal path returns { ok: true, via: totp } after a 6-digit code verifies.'],
        ['Phone lost', 'a recovery code returns { via: recovery, remaining: 9 }; reusing it returns BAD_CODE (single-use).'],
        ['One endpoint, two ways in', 'the same /mfa/totp/verify takes a code OR a recovery code — a lost phone is a detour, not a dead end.']], 3) },
  { t: 'Recovery is the new weakest link', giua: true, body: box('A "reset my 2FA" email/SMS link', 'undoes the whole factor — it moves the trust back to the email account, the weak channel the factor was meant to backstop.', 'do2') +
      box('Recovery codes are good', 'precisely because the user holds them offline, outside any channel an attacker can redirect.', 'xanh') +
      box('The strongest recovery', 'is a second enrolled authenticator — encourage two from the start, so losing one is an inconvenience, not a lockout.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Store the secret unconfirmed, confirm with one real code, only then enable the factor</li>
    <li>The QR is an otpauth:// URI; the app computes codes from the secret inside it</li>
    <li>Issue recovery codes once, store them as digests, single-use</li>
    <li>A "reset 2FA" email/SMS link re-weakens everything; offline codes and a second authenticator do not</li>
    <li>Next — 7.4: passkeys, and the one line that kills phishing</li></ul>` },
]);
