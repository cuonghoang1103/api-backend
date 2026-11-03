/**
 * auth-07-2 — Authentication · Chapter 7 · Lesson 7.2 "TOTP from the inside, in thirty lines" (04/11/2026).
 * Slug bài: auth-7-2-totp. Output = s07/_ma.mjs.
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s07/_ma.mjs';

const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const T = CODE.totp.split('\n');
const HOTP = T.slice(T.findIndex((l) => l.includes('HOTP (RFC 4226)')), T.findIndex((l) => l.includes('TOTP (RFC 6238)'))).join('\n').replace(/^\s*\n/gm, '').trim();
export const deck = { key: 'auth-07-2', code: 'AUTH 7.2', title: 'TOTP from the inside, in thirty lines', sub: 'HMAC + dynamic truncation + the clock as the counter' };

export const slides = lamDeck({ chuong: 'Chapter 7 — The second factor, and passkeys', bai: '7.2' }, [
  { cover: true, t: 'TOTP from the inside,<br>in thirty lines', sub: 'Chapter 7 · Lesson 7.2 — HMAC, dynamic truncation, the clock; checked against the RFC' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The six digits are HMAC(secret, the current 30-second window), truncated — no network call</li>
    <li>HOTP: HMAC + dynamic truncation (RFC 4226)</li>
    <li>TOTP: HOTP where the counter is time ÷ 30 (RFC 6238)</li>
    <li>Prove your code against the RFC test vectors and otplib</li>
    <li>Verify with a ±1 skew window, in constant time</li></ul>` },
  { t: 'Two clocks, one secret', giua: true, body: cards([
      ['Shared once', 'At enrollment the server and the app agree on one random secret, then never talk again.'],
      ['Computed, not sent', 'Both compute HMAC(secret, time ÷ 30); the code is a function of the secret and the wall clock.'],
      ['The proof', 'Matching codes prove the person holds the secret — nothing is stored or sent but the code they type.'],
    ], 3) + box('That is why it works offline', 'The phone needs no signal — only the shared secret and roughly the right time.', 'lam') },
  { t: 'HOTP: HMAC then dynamic truncation', body: js(HOTP, { sm: true }) +
      two(box('Why truncate at all', 'HMAC gives 20 bytes; a human needs six digits. Truncation turns the hash into a short code.', 'lam'),
          box('Why "dynamic"', 'the offset is chosen BY the hash, so the code does not depend on any fixed slice of the HMAC.', 'xanh')) +
      box('The recipe', 'low 4 bits of the last byte → a 4-byte offset; read 31 bits there; modulo 10^digits (RFC 4226).', 'lam') },
  { t: 'TOTP: the counter is the clock', giua: true, body: two(
      box('One substitution', 'TOTP is HOTP with counter = floor((time − t0) / step). Every 30 seconds the counter ticks and the code changes.', 'xanh'),
      box('Nothing else differs', 'same HMAC, same dynamic truncation, same modulo. TOTP is HOTP plus a clock.', 'lam')) +
      box('base32 secret', 'The otpauth:// URI / QR carries the secret as base32 — unambiguous to scan. The bytes are what HMAC uses (7.3).', 'lam') },
  { t: 'Checked against the RFC, not trusted', body: sh(body('71-totp-rfc').split('\n').slice(0, 9).join('\n'), { title: 'node demo7/totp-rfc.mjs', sm: true }) +
      box('All six vectors', 'secret "12345678901234567890", t=59 → 94287082, … — our totp() reproduces all six and matches otplib digit-for-digit. A primitive you cannot test is one you do not understand.', 'xanh') },
  { t: 'The skew window', body: sh(body('71-totp-rfc').split('\n').slice(-5).join('\n'), { title: 'clock skew: ±1 step accepted', sm: true }) +
      two(box('Why accept more than now', 'phone clocks drift and typing takes a few seconds — the exact current step alone locks real users out.', 'lam'),
          box('±1 step (~±30s)', 'one step each way covers real drift while keeping the code effectively one-time; three steps away is rejected.', 'xanh')) },
  { t: 'Compare in constant time', giua: true, body: two(
      box('Six digits is small', 'the time taken to compare must not leak how many leading digits were right — do not help a guesser (lesson 1.3).', 'xanh'),
      box('safeEqual, same length', 'verifyTotp compares the given code to the expected one in constant time, after a length check.', 'lam')) +
      box('SHA-1 is fine here', 'the famous "SHA-1 is broken" is about collisions; HMAC-SHA1 does not rely on collision resistance, and RFC 6238 and every authenticator app default to it — interoperability wins.', 'lam') },
  { t: 'Trap: TOTP is phishable, and a wider window is worse', giua: true, body: box('A code is valid for its whole window', 'so a fake site that relays it within ~30s authenticates as the user. TOTP cannot fix this.', 'do2') +
      box('Widening the skew window', 'to "be forgiving" only lengthens the replay window an attacker enjoys. Keep ±1, rate-limit verify, never log the code.', 'do2') +
      box('Only origin binding closes it', 'a passkey signs over the origin (7.4).', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>TOTP = HOTP with the clock as the counter: HMAC, dynamic truncation, modulo 10^digits</li>
    <li>The app and server share one secret and never talk again; the code proves the secret is held</li>
    <li>Prove your implementation against the RFC 6238 vectors — do not trust "looks right"</li>
    <li>Verify with a ±1 skew window, in constant time; do not widen it</li>
    <li>Next — 7.3: enrolling it, and the recovery you will actually need</li></ul>` },
]);
