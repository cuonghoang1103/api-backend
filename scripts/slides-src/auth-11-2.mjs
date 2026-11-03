/** auth-11-2 — Chapter 11 · 11.2 "Key rotation" (04/11/2026). Slug auth-11-2-xoay-khoa. Output = s11/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { CODE, OUT } from '../../content/courses/authentication/s11/_ma.mjs';
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const ROT = clip(CODE.rotation.split('\n').filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('*')).join('\n').replace(/\n{2,}/g, '\n').trim(), 62);
const OUTR = clip(OUT['112-rotate'].split('\n').slice(2, 9).join('\n'), 64);
export const deck = { key: 'auth-11-2', code: 'AUTH 11.2', title: 'Rotating a key without logging everyone out', sub: 'An overlap: two keys live, new signs, old verifies' };
export const slides = lamDeck({ chuong: 'Chapter 11 — Running it', bai: '11.2' }, [
  { cover: true, t: 'Rotating a key without<br>logging everyone out', sub: 'Chapter 11 · Lesson 11.2 — the overlap, kid, and the three phases' },
  { t: 'Keys must rotate', giua: true, body: two(
      box('On a schedule, and on a leak', 'every signing key is rotated regularly, and immediately if it is ever suspected of leaking.', 'lam'),
      box('The naive way logs everyone out', 'swap the key and restart ⇒ every token signed with the old key is instantly invalid, so every user is logged out at once.', 'do2')) +
      box('The art: rotate with no mass logout and no gap', 'and it comes down to one idea — an overlap window where both keys are live at the same time.', 'xanh') },
  { t: 'The trick: an overlap', giua: true, body: box('For a window, BOTH keys are live', 'the new key signs new tokens; the old key still VERIFIES the tokens already in the wild, so none of them break.', 'xanh') +
      box('Retire the old key only after its tokens expire', 'until then it stays in the ring, verify-only. Two keys live, one signs, both verify.', 'lam') +
      box('No mass logout, no gap', 'every token keeps working until it would have expired anyway — the rotation is invisible to users.', 'lam') },
  { t: 'kid makes it possible', giua: true, body: box('Every token carries a kid in its header (Chapter 4)', 'the key id. The verifier reads it and picks the matching key from the keyring, instead of trying keys blindly.', 'lam') +
      box('Two keys in the ring', 'a token says which one signed it, so the old and the new can be verified side by side — no guessing, no ambiguity.', 'xanh') +
      box('Without kid, two live keys is a mess', 'you would have to try each key and see which verifies — kid is what makes a clean overlap possible at all.', 'lam') },
  { t: 'The rotation, three phases', body: js(ROT, { sm: true }) +
      box('Introduce → activate → retire', 'introduce (publish in JWKS, still sign old) BEFORE activate (sign new), so JWKS clients learn the key first and never reject an unknown kid.', 'xanh') },
  { t: 'The measured rotation', body: sh(OUTR, { title: 'node demo11/rotate.mjs', sm: true }) +
      box('Nobody logged out', 'the in-the-wild k1 token verifies through introduce and activate, and stops only after retire — by which time its own expiry had passed.', 'lam') },
  { t: 'How long is the overlap', giua: true, body: two(
      box('At least the token lifetime', 'for 15-minute access tokens (Chapter 5), 15 minutes — retire sooner and you invalidate tokens that were still valid.', 'xanh'),
      box('On a leak, rotate NOW', 'activate the new key at once, and consider revoking the old key\'s tokens (a short overlap) — a stolen key is worse than a few logouts.', 'do2')) +
      box('Routine is gentle, a leak is urgent', 'the same three phases, but a leak collapses the overlap to minimise exposure; retiring too late is only harmless extra caution.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Rotate with an overlap: new key signs, old key still verifies until its tokens expire</li>
    <li>kid lets a token say which key signed it — old and new verify side by side</li>
    <li>Introduce (JWKS) before activate (sign), so clients learn the key first</li>
    <li>Size the overlap to the token lifetime; on a leak, rotate now</li>
    <li>Next — 11.3: rate limiting that survives real traffic</li></ul>` },
]);
