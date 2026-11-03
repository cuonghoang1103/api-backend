/**
 * auth-04-1 — Authentication · Chapter 4 · Lesson 4.1 "Decode one by hand" (03/11/2026).
 * Slug bài: auth-4-1-giai-ma-bang-tay. Output = s04/_ma.mjs (LabFlow ID v0.4 + jose 6.1.0, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s04/_ma.mjs';

export const deck = { key: 'auth-04-1', code: 'AUTH 4.1', title: 'Decode one by hand', sub: 'A JWT is header.payload.signature — base64url, not encryption' };
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));

export const slides = lamDeck({ chuong: 'Chapter 4 — Tokens: JWT from the inside', bai: '4.1' }, [
  { cover: true, t: 'Decode one<br>by hand', sub: 'Chapter 4 · Lesson 4.1 — a JWT is three base64url strings, and decoding is not verifying' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Chapter 4</b>: the stateless token — a signed JSON object the client carries, no DB lookup</li>
    <li>Split a JWT into <b>header . payload . signature</b> and read the first two with no key</li>
    <li>Why base64url is <b>not encryption</b> — the payload is public</li>
    <li>Build one by hand; edit the payload and watch the signature break</li>
    <li>Where LabFlow ID v0.4 issues a real access token — and who it is for</li></ul>` },
  { t: 'A tamper-evident parcel, not a locked box', body: cards([
      ['The label', 'sender, recipient, contents — printed in the open, anyone reads it (the claims)'],
      ['The wax seal', 'does not hide the contents; it reveals if someone opened and resealed it (the signature)'],
      ['vs a session', 'a cloakroom ticket the counter looks up — the JWT is the sealed parcel the bearer carries'],
    ], 3) + box('So a JWT proves…', '<b>integrity</b> (it was not changed), <b>not secrecy</b>. Reading it proves nothing until the seal is checked.', 'lam') },
  { t: 'Three parts, two of them plain text', body: sh(body('41-decode'), { title: 'node demo4/decode.mjs', sm: true }) +
      box('No key, nothing verified', 'The header names <b>alg</b> and <b>kid</b>; the payload lists the claims; the signature is 64 raw bytes (Ed25519). The signing input is <b>header.payload</b>.', 'xanh') },
  { t: 'base64url is not encryption', giua: true, body: two(
      box('base64 / base64url', 'URL-safe base64: <b>-_</b> for <b>+/</b>, no padding. Needs <b>no key</b>. Carries bytes; hides nothing. This is the header and payload.', 'lam'),
      box('a signature', 'HMAC or public-key. Protects <b>integrity</b>: any change is noticed. Needs a key. This is the third part.', 'xanh')) +
      box('A JWT (JWS) hides nothing', 'Encryption is a separate standard, <b>JWE</b>, that most APIs do not use. So a JWT proves integrity, not secrecy — <b>never put a secret in the payload.</b>', 'do2') },
  { t: 'Edit the payload, break the seal', body: sh(body('41-tamper'), { title: 'node demo4/tamper.mjs' }) +
      box('“The payload says admin”', 'A claim is not a fact until the signature over it checks out. Rewriting role keeps the old signature ⇒ <b>BAD_SIGNATURE</b>. Decoding is free; only verifying means anything.', 'do2') },
  { t: 'Building one by hand', giua: true, body: js(CODE.sign.replace(/ *\/\/.*$/gm, '').trim(), { sm: true }) +
      box('Six lines', 'base64url the header, base64url the payload, join with a dot, sign that string, append the signature. Signing is the mirror of decoding.', 'lam') +
      box('The header it writes', c('{"alg":"EdDSA","typ":"JWT","kid":"ed-2026-11"}') + ' — the verifier reads <b>kid</b> to pick the key, then takes the algorithm from that key, never from this header (4.2).', 'xanh') },
  { t: 'LabFlow ID issues a real one', body: sh(body('41-issue'), { title: 'bash demo4/issue.sh', sm: true }) +
      box('Session here, token there', 'POST /token: An’s session proves who she is to LabFlow ID; the access token carries that, signed, to <b>LabFlow API</b> — aud labflow-api, 900 s (15 min, the platform number).', 'xanh') },
  { t: 'Session proves it here, token proves it there', giua: true, body: two(
      box('Session (Chapter 3)', 'A row on the server behind a cookie. Stateful: one lookup per request, revoke with one DELETE.', 'lam'),
      box('Access token (Chapter 4)', 'A signed JSON object. Stateless: any trusting service checks it with our public key — no DB, no session.', 'lam')) +
      box('LabFlow ID does both', 'Keeps the session for itself; mints JWTs for <b>other</b> services. Chapter 8 turns it into an OpenID Connect provider for LabFlow API.', 'xanh') },
  { t: 'Trap: a JWT hides nothing', giua: true, body: box('The payload is public', 'Because it is base64url, anyone — the user, a proxy, an attacker — can read every claim. Never put a password, a card number or a private note in a JWT.', 'do2') +
      box('And it is frozen', 'The claims cannot change until the token expires. A role baked into a 15-minute token stays true for 15 minutes, whatever the database now says — which is why access tokens are short (4.3).', 'lam') +
      box('So where does trust come from?', 'Only the signature (4.2) and the claims checked against it (4.3) — never the raw text of the payload you can read.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A JWT is <b>header.payload.signature</b>, each base64url; the first two are plain JSON</li>
    <li>Decoding needs no key — base64url is transport, not secrecy</li>
    <li>The signature covers <b>header.payload</b>; editing the payload ⇒ <b>BAD_SIGNATURE</b></li>
    <li>LabFlow ID v0.4 mints a 15-minute access token for LabFlow API via <b>POST /token</b></li>
    <li>Next — 4.2: the one header field attackers love, <b>alg</b></li></ul>` },
]);
