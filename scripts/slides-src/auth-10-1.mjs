/** auth-10-1 — Chapter 10 · 10.1 "Credential stuffing" (04/11/2026). Slug auth-10-1-nhoi-tin-vat. Output = s10/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { CODE, OUT } from '../../content/courses/authentication/s10/_ma.mjs';
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const S = CODE.stuffing.split('\n');
const DECIDE = clip(S.slice(S.findIndex((l) => l.includes('export function decide')), S.length).join('\n').replace(/ {2,}\/\/.*$/gm, ''), 60);
const RUN = clip(OUT['101-stuffing'].split('\n').slice(2, 11).join('\n'), 62);
export const deck = { key: 'auth-10-1', code: 'AUTH 10.1', title: 'Credential stuffing, the attack happening right now', sub: 'Defend the spread, never lock the account' };
export const slides = lamDeck({ chuong: 'Chapter 10 — The attacks, in order of frequency', bai: '10.1' }, [
  { cover: true, t: 'Credential stuffing, the attack<br>that is happening right now', sub: 'Chapter 10 · Lesson 10.1 — replayed breached passwords, and defending without a self-inflicted DoS' },
  { t: 'What you will take away', to: true, giua: true, body: `<ul>
    <li><b>Chapter 10</b>: the attacks, ordered by how OFTEN they happen</li>
    <li>Stuffing: replaying leaked email/password pairs, betting on reuse</li>
    <li>Account lockout is a self-inflicted denial-of-service</li>
    <li>Defend the IP and the spread; challenge the human, never lock the account</li>
    <li>The best defences are earlier: breached-password block (Ch2), passkeys (Ch7)</li></ul>` },
  { t: 'What it is, and why it works', giua: true, body: two(
      box('A breach elsewhere leaks millions of pairs', 'attackers replay them against YOUR login — millions a day, automated.', 'do2'),
      box('The bet is password reuse', 'the same password on a breached forum and on LabFlow. The leak came from a place you do not control.', 'lam')) +
      box('No exploit, no cleverness', 'this is the highest-volume attack on any login — your endpoint is receiving it today.', 'xanh') },
  { t: 'The wrong fix: account lockout', giua: true, body: box('"Lock the account after 5 wrong tries"', 'feels right, and is a trap.', 'do2') +
      box('The attacker locks every real user on purpose', 'fail their account five times and it is locked — no password needed. You built them a denial-of-service.', 'do2') +
      box('Lockout trades one attack for another', 'credential stuffing for account-lockout DoS, which is often worse.', 'lam') },
  { t: 'Defend the shape: decide()', body: js(DECIDE, { sm: true }) +
      box('Block the IP/spread, challenge the breached and the suspicious', 'and NEVER block a single account — its "attacker" might be its real owner mistyping.', 'xanh') },
  { t: 'The measured run', body: sh(RUN, { title: 'node demo10/stuffing-run.mjs — 10k spray + real users', sm: true }) +
      box('decide(): 0 attacker logins, 0 real users locked', 'account lockout lets a breached reuse in AND locks two real users out. decide() blocks the spray and the mistyping user gets in.', 'lam') },
  { t: 'Challenge, do not block, the human', giua: true, body: two(
      box('A suspicious account gets a CHALLENGE', 'a CAPTCHA or a proof-of-work — a human solves it and continues, a bot usually cannot, and a human solver farm is slow and costs money.', 'xanh'),
      box('The hard block is for the flood', 'a solved challenge clears the soft signals but NOT a true flood (ipFails ≥ 100) — solver farms pass CAPTCHAs, so it is checked first.', 'lam')) +
      box('The human is never locked out of their own account', 'and the attacker\'s economics get worse with every challenge — that is the whole trade: defend the attack, keep the real user.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Credential stuffing is the highest-volume attack: replayed breached passwords</li>
    <li>Account lockout is a self-inflicted DoS — the attacker locks real users on purpose</li>
    <li>Defend the IP and the spread; challenge the human; never lock a single account</li>
    <li>A solved challenge clears soft signals, not a true flood</li>
    <li>Next — 10.2: phishing that relays your real login</li></ul>` },
]);
