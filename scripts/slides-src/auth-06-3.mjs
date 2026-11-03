/**
 * auth-06-3 — Authentication · Chapter 6 · Lesson 6.3 "Password reset, the most attacked flow you own" (04/11/2026).
 * Slug bài: auth-6-3-dat-lai-mat-khau. Output = s06/_ma.mjs (LabFlow ID v0.6 + PostgreSQL 17.11, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s06/_ma.mjs';

export const deck = { key: 'auth-06-3', code: 'AUTH 6.3', title: 'Password reset, the most attacked flow you own', sub: 'One-time token, one fixed response, and end every session' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const S = CODE.server06.split('\n');
const RESET = S.slice(S.findIndex((l) => l.includes('lesson 6.3: consume a reset token')), S.findIndex((l) => l.includes("app.post('/sign-in'"))).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 6 — The account lifecycle', bai: '6.3' }, [
  { cover: true, t: 'Password reset,<br>the most attacked flow you own', sub: 'Chapter 6 · Lesson 6.3 — a second front door that must lock the attacker out' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A reset is a way around the password — a second front door</li>
    <li>/forgot-password gives one fixed response, whoever asks (6.4)</li>
    <li>The reset token is single-use, purpose-bound, hashed, 15-minute</li>
    <li>On reset: re-hash, then <b>end every session and refresh family</b></li>
    <li>The step people skip is the whole point: recovery must lock the attacker out</li></ul>` },
  { t: 'The spare key under the mat', giua: true, body: cards([
      ['Works forever', 'A copied key never stops opening the door — a reset link that never expires is the same risk.'],
      ['Never re-keyed', 'The lock "changed" but the spare still fits — a reset that does not revoke old sessions.'],
      ['The reset link is that key', 'So it gets a short life, a single use, and a re-key (revoke everything) on use.'],
    ], 3) + box('Why it is the most attacked flow you own', 'A reset is a way around the password: a flaw here hands over the account without needing the password at all. Treat it as the highest-stakes door in the product.', 'lam') },
  { t: 'Request: one response, whoever asks', giua: true, body: two(
      box('Real, active account', 'Issue a reset token and email the one-time link — the only branch that sends anything.', 'xanh'),
      box('Any other address', 'Do nothing and send nothing at all — no "no account" mail, which would itself be an oracle.', 'lam')) +
      box('Same body every time', '"If an account exists for that address, a reset link is on its way." A stranger probing the form learns nothing — the enumeration rule at its most important door (6.4).', 'lam') },
  { t: 'The token is 6.2 again, shorter', giua: true, body: two(
      box('Random, hashed, single-use, purpose-bound', 'Exactly the Lesson 6.2 primitive: a random secret, stored only as a SHA-256 digest, that works once and only as a reset.', 'xanh'),
      box('But 15 minutes, not 30', 'This is the link worth stealing, so it expires fastest of all — half the life of a verification link.', 'lam')) +
      box('A leaked table is still just digests', 'Because only the digest is stored, a dump of the token table is a list of hashes, not of working reset links (1.3).', 'lam') },
  { t: 'Reset: consume, re-hash, end everything', body: js(RESET, { sm: true }) +
      box('The last two lines', 'sessions.endAll + refresh.revokeAll — the step people skip, and the whole point.', 'xanh') },
  { t: 'Why reset MUST end every session', giua: true, body: box('The attack reset is meant to stop', 'An attacker phishes a password and signs in — they hold a live session and a refresh family.', 'do2') +
      box('The victim "recovers"', 'by resetting. If reset only changes the hash, the attacker’s session and token keep working.', 'do2') +
      box('revokeAll closes it', 'The victim locked the door with the burglar inside — unless reset revokes everything.', 'xanh') },
  { t: 'The measured proof', body: sh(body('63-reset'), { title: 'bash demo6/reset.sh', sm: true }) +
      box('Old cookie ⇒ REVOKED, link ⇒ USED', 'After the reset, An’s old refresh cookie returns REVOKED; the reset link used twice returns USED.', 'lam') },
  { t: 'Do not log them in from the link', giua: true, body: two(
      box('A reset proves mailbox access', 'not intent to sign in on this device — an auto-forward rule or a shared inbox is not the user at the keyboard.', 'lam'),
      box('Land them on the login page', 'to type the new password — one more step for a stranger’s takeover to fail on, and no mailbox-as-login-credential.', 'xanh')) +
      box('At work', '"Reset done, attacker still in" ⇒ you forgot revokeAll. Keep the link life in minutes, not days, and rate-limit the request endpoint per account and per IP against mail-bombing and enumeration by volume.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Reset is a second front door; a flaw gives the account away without the password</li>
    <li>/forgot-password gives one fixed response — never reveal whether the account exists</li>
    <li>The reset token is single-use, purpose-bound, hashed, short-lived (15 min)</li>
    <li>On reset, end every session and revoke every refresh family — or recovery is empty</li>
    <li>Next — 6.4: enumeration, and the leak no wording change can close</li></ul>` },
]);
