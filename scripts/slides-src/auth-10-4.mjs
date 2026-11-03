/** auth-10-4 — Chapter 10 · 10.4 "The human layer" (04/11/2026). Slug auth-10-4-tang-con-nguoi. Output = s10/_ma.mjs. */
import { lamDeck, sh, two, box, cards } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s10/_ma.mjs';
const clip = (s, n = 62) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const FATIGUE = clip(OUT['104-fatigue'].split('\n').slice(2, 5).join('\n'), 64);
export const deck = { key: 'auth-10-4', code: 'AUTH 10.4', title: 'Attacking the human layer: fatigue, the help desk, the carrier', sub: 'Number matching, out-of-band resets, no SMS' };
export const slides = lamDeck({ chuong: 'Chapter 10 — The attacks, in order of frequency', bai: '10.4' }, [
  { cover: true, t: 'Attacking the human layer:<br>fatigue, the help desk, the carrier', sub: 'Chapter 10 · Lesson 10.4 — when the crypto is fine, the attacker goes through the people' },
  { t: 'Three human channels', giua: true, body: cards([
      ['MFA fatigue', 'spam "Approve?" until a tired victim taps yes'],
      ['The help desk', 'talk support into a factor reset without any factor'],
      ['The carrier', 'SIM-swap the number to receive the SMS codes'],
    ], 1) + box('Each turns a person, not a protocol, into the bypass', 'and targets the weakest path IN, not the strong front door.', 'lam') },
  { t: 'MFA fatigue (push bombing)', giua: true, body: box('The attacker already has the password (10.1)', 'a push-approval second factor sends "Approve this login?" to the victim\'s phone; they fire it over and over, at 3am.', 'do2') +
      box('Eventually a tired, confused victim taps Approve', 'just to make it stop — one tap and the attacker is in.', 'do2') +
      box('More prompts is not the fix', 'rate-limiting helps but one well-timed prompt still gets a tap; the fix changes what "approve" means.', 'lam') },
  { t: 'The fix: number matching', body: sh(FATIGUE, { title: 'node demo10/mfa-fatigue.mjs', sm: true }) +
      box('Type a number shown only on the ATTACKER\'s screen', 'which the victim never sees — so tapping Approve is no longer enough; they would have to enter a number they do not have.', 'xanh') +
      box('Measured: tap-to-approve lets them in', 'on a single tired tap; number matching lets them in only on a 1-in-100 guess — before rate-limiting and showing WHERE the login is from.', 'lam') },
  { t: 'The help desk', giua: true, body: box('"I lost my phone, reset my MFA"', 'a reset on a convincing phone call is a factor reset without any factor.', 'do2') +
      box('Harden the reset to match the login', 'verify out of band — a video call, a manager approval — never "they knew the last four digits".', 'xanh') +
      box('A weak recovery IS the real authentication', 'however strong the front door.', 'lam') },
  { t: 'The carrier: SIM swap', giua: true, body: two(
      box('SMS is portable at the carrier', 'the attacker calls the phone company and ports the number to a SIM they control; now the codes arrive on their phone.', 'do2'),
      box('SMS is also relayable + interceptable', 'phishing (10.2) and SS7 interception. It beats nothing-but-a-password, but TOTP and passkeys are a different tier.', 'lam')) +
      box('Treat SMS as a fallback, not the plan', 'an SMS second factor is only as strong as a call-centre employee at a phone company — prefer TOTP and passkeys.', 'xanh') },
  { t: 'The pattern', giua: true, body: box('Every human attack takes the WEAKEST path in', 'not the strongest — a hardened login with a soft help desk, an SMS fallback, or a tap-to-approve push is only as strong as those.', 'do2') +
      box('The recovery flow is part of your authentication', 'not an afterthought — a weak reset IS the real authentication, however strong the front door.', 'lam') +
      box('Audit every path IN', 'recovery, help desk, fallback factors — size each to match the login, because the attacker finds and uses the weakest.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>MFA fatigue spams approvals — fix with number matching, not more prompts</li>
    <li>The help desk resets factors without factors unless verified out of band</li>
    <li>SMS is SIM-swappable, relayable, interceptable — a fallback, never the plan</li>
    <li>Every human attack takes the weakest path in — audit recovery and fallbacks</li>
    <li>Next — 10.5: pre-hijacking and the races nobody tests</li></ul>` },
]);
