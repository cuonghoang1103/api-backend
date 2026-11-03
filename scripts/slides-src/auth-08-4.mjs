/** auth-08-4 — Chapter 8 · 8.4 "ID token vs access token, and the seven checks" (04/11/2026). Slug auth-8-4-id-token. */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s08/_ma.mjs';
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const V = CODE.verify.split('\n');
const CHECKS = clip(V.slice(V.findIndex((l) => l.includes('export function verifyIdToken')), V.findIndex((l) => l.includes('return { ok: true'))+1).join('\n').trim(), 56);
export const deck = { key: 'auth-08-4', code: 'AUTH 8.4', title: 'ID token vs access token, and the seven checks', sub: 'Who, for the client — verified before it is believed' };
export const slides = lamDeck({ chuong: 'Chapter 8 — OAuth 2.1 and OpenID Connect', bai: '8.4' }, [
  { cover: true, t: 'ID token vs access token,<br>and the seven checks', sub: 'Chapter 8 · Lesson 8.4 — two tokens, two jobs; do not confuse them' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The ID token says WHO (audience = the client); the access token is a pass for the API</li>
    <li>Never authenticate a user by reading an access token</li>
    <li>The seven checks a client runs on an ID token</li>
    <li>The signature and the audience are the two that must never be skipped</li>
    <li>Verify the signature by kid against the JWKS (4.2, 4.4)</li></ul>` },
  { t: 'A boarding pass vs an ID card', giua: true, body: cards([
      ['ID token = an ID card', 'says who you are, to the client, once — read its claims'],
      ['Access token = a boarding pass', 'gets you through the API gate; the gate does not care who you are'],
      ['Confuse them', 'and "who is this" is decided by a token that was never about identity'],
    ], 3) + box('So', 'the ID token’s audience is the client; the access token’s is the API, and the client treats it as opaque.', 'lam') },
  { t: 'Two tokens, two jobs', giua: true, body: `<table class="t"><tr><th></th><th>ID token</th><th>Access token</th></tr>
    <tr><td>Answers</td><td>who logged in</td><td>what the bearer may do</td></tr>
    <tr><td>aud</td><td>the CLIENT id</td><td>the API</td></tr>
    <tr><td>Consumed by</td><td>the client</td><td>the API (opaque to the client)</td></tr>
    <tr><td>Used to</td><td>start a session</td><td>call the API as Bearer</td></tr></table>` +
      box('The classic bug', 'decoding the access token to decide who the user is couples your login to a token that was never meant for you.', 'do2') },
  { t: 'The seven checks', body: js(CHECKS, { sm: true }) +
      two(box('A signature is not enough', 'you must check WHAT it says and WHO it was for.', 'xanh'), box('The order', 'decode → signature → iss → aud → exp → iat → nonce; stop at the first failure.', 'lam')) +
      box('aud may be a string or an array', 'that must CONTAIN your client id — normalise before you check membership.', 'lam') },
  { t: 'Measured', body: sh(body('81-oidc-flow').split('\n').filter((l)=>l.includes('verified')||l.includes('aud:')||l.includes('nonce:')).join('\n'), { title: 'demo8 — valid, then bad_aud, bad_nonce', sm: true }) +
      two(box('bad_aud', 'the same token with expectedAudience "other-app" ⇒ bad_aud — another client\u2019s token is refused here.', 'xanh'), box('bad_nonce', 'with a different nonce ⇒ bad_nonce — an old token from another login is refused.', 'lam')) +
      box('Otherwise identical', 'both tokens are validly signed and unexpired; only the expected aud / nonce differs — the signature is not the whole story.', 'lam') },
  { t: 'Trap: skipping signature or audience', giua: true, body: box('Skip the signature (check 2)', 'and anyone can mint an ID token claiming any user — the "yeu" client accepts a forgery.', 'do2') +
      box('Skip the audience (check 4)', 'and a token minted for ANOTHER client is accepted here — app A’s token logs the user into app B.', 'do2') +
      box('Verify by kid, from the key', 'never from the token header — alg:none and HS/RS confusion live exactly here (4.2).', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>ID token = who, for the client (aud = client); access token = a pass for the API (opaque)</li>
    <li>Never authenticate a user by reading an access token</li>
    <li>Run all seven checks: decode, signature, iss, aud, exp, iat, nonce</li>
    <li>The signature and the audience are the two whose omission is a full bypass</li>
    <li>Next — 8.5: being a client for real</li></ul>` },
]);
