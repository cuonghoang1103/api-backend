/**
 * auth-04-3 — Authentication · Chapter 4 · Lesson 4.3 "Seven claims, and the attack for each you skip" (03/11/2026).
 * Slug bài: auth-4-3-cac-claim. Output = s04/_ma.mjs. RFC 7519 §4.1 + RFC 8725 §3.8–3.9.
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s04/_ma.mjs';

export const deck = { key: 'auth-04-3', code: 'AUTH 4.3', title: 'Seven claims, and the attack for each you skip', sub: 'iss sub aud exp nbf iat jti — signature first, then these' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const V = CODE.verify.split('\n');
const CLAIMS = V.slice(V.findIndex((l) => l.includes('3) CLAIMS')) + 1, V.findIndex((l) => l.includes('return payload'))).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 4 — Tokens: JWT from the inside', bai: '4.3' }, [
  { cover: true, t: 'Seven claims, and the<br>attack for each you skip', sub: 'Chapter 4 · Lesson 4.3 — iss, sub, aud, exp, nbf, iat, jti — a valid signature is not enough' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Name the seven registered claims and what each one defends</li>
    <li>See the specific attack each skipped claim allows</li>
    <li>Enforce the <b>exp</b> boundary with the right clock-skew rule, and the <b>nbf</b> mirror</li>
    <li>Why revoking a JWT is harder than revoking a session</li>
    <li>Why access tokens are kept short — 15 minutes</li></ul>` },
  { t: 'A signed letter that forgot to say who it is to', giua: true, body: cards([
      ['The signature', 'proves the sender wrote it — nothing more'],
      ['The envelope', 'from (iss), about (sub), to (aud), valid between (nbf…exp)'],
      ['No envelope', 'you honour a letter for the wrong desk, or last year’s letter today'],
    ], 3) + box('Claims are the envelope', 'A signed token with no claims checked is a signed letter with no envelope — genuine, and still dangerous.', 'lam') +
      box('Signature vs claims', 'The signature is cryptography; the claims are policy. A perfect signature on the wrong token is still the wrong token.', 'xanh') },
  { t: 'The seven, in LabFlow ID', body: `<table class="t"><tr><th>Claim</th><th>Means</th><th>Skip it and…</th><th>Code</th></tr>
    <tr><td>${c('iss')}</td><td>who minted it</td><td>a token from another issuer is accepted</td><td>${c('BAD_ISS')}</td></tr>
    <tr><td>${c('sub')}</td><td>who it is about</td><td>a token names no user</td><td>${c('NO_SUB')}</td></tr>
    <tr><td>${c('aud')}</td><td>who it is for</td><td>a chat token is spent at the API</td><td>${c('BAD_AUD')}</td></tr>
    <tr><td>${c('exp')}</td><td>when it dies</td><td>a stolen token never expires</td><td>${c('EXPIRED')}</td></tr>
    <tr><td>${c('nbf')}</td><td>when it starts</td><td>a pre-dated token works early</td><td>${c('NOT_YET')}</td></tr>
    <tr><td>${c('iat')}</td><td>when minted</td><td>no reasoning about age</td><td>${c('NO_IAT')}</td></tr>
    <tr><td>${c('jti')}</td><td>its unique id</td><td>nothing can be revoked</td><td>${c('NO_JTI')}</td></tr></table>` },
  { t: 'Skip one, and here is the attack', body: sh(body('43-claims'), { title: 'node demo4/claims.mjs', sm: true }) +
      box('Each omission has its own rejection', 'Every token is validly signed — only the claim check can stop it. An aud array that <b>includes</b> labflow-api is accepted; audiences may be a list.', 'xanh') },
  { t: 'The claim checks, in code', giua: true, body: js(CLAIMS, { sm: true }) +
      box('One line per claim', 'One <b>JwtError</b> code per failure, after the signature. The code stays on the server (1.5); the client sees a plain 401.', 'lam') },
  { t: 'exp is a boundary', body: sh(body('43-exp').split('\n').slice(0, 5).join('\n'), { title: 'node demo4/exp-skew.mjs — strict', sm: true }) +
      box('exp == now is expired', 'RFC 7519: the token MUST NOT be accepted <b>on or after</b> exp. At skew 0, equal to now is already expired — the same boundary as Chapter 3 timeouts.', 'xanh') +
      box('The opposite mistake', 'Skip exp entirely and a stolen token never dies — the first row of the claims demo on the previous slide.', 'do2') },
  { t: 'Clock skew is a real tolerance', body: sh(body('43-exp').split('\n').slice(5).join('\n'), { title: 'node demo4/exp-skew.mjs — skew 60', sm: true }) +
      box('A few minutes, at most', 'Two machines never agree to the second. RFC 7519 allows “some small leeway.” 30 s past exp passes at skew 60; 61 s does not.', 'lam') },
  { t: 'nbf and the window', giua: true, body: two(
      box('nbf (not before)', 'The mirror of exp: not valid before this time. At skew 60, 55 s early is let through, 90 s early is not.', 'lam'),
      box('nbf …… exp', 'Together they bound the window the token is alive. Pick the smallest skew your clocks allow.', 'lam')) +
      box('Why free to check', 'nbf costs nothing to enforce and closes pre-dated tokens; set it to iat for an access token.', 'xanh') +
      box('In LabFlow ID', 'An access token sets ' + c('nbf = iat') + ' and ' + c('exp = iat + 900') + ', so its window is exactly its 15 minutes.', 'lam') },
  { t: 'Revoking a JWT is hard', body: sh(body('43-revoke'), { title: 'node demo4/revoke.mjs', sm: true }) +
      box('A denylist is only local', 'A session ends with one DELETE; a JWT cannot be un-issued. A jti denylist revokes only where it is shared, and only until exp. A second service keeps trusting it.', 'do2') },
  { t: 'Why access tokens are short', giua: true, body: cards([
      ['Cannot revoke instantly', 'so a stolen access token is dangerous only until it expires'],
      ['15 minutes', 'caps the blast radius; the denylist only remembers a jti until exp, so it stays small'],
      ['The real control', 'the refresh token (Chapter 5), which you CAN revoke'],
    ], 3) + box('The trade-off, named', 'A session pays one lookup per request and gets instant revocation; a JWT skips the lookup and gives it up. Decide it on purpose.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A valid signature is not enough; check iss, sub, aud, exp, nbf, iat, jti — each with its own error</li>
    <li>Skipping <b>aud</b>/<b>iss</b> crosses services or issuers; skipping <b>exp</b> makes a stolen token immortal</li>
    <li><b>exp</b> is a boundary (exp == now is expired at skew 0) with a small skew; <b>nbf</b> mirrors it</li>
    <li>A JWT can’t be un-issued; a <b>jti</b> denylist revokes only where shared, until exp</li>
    <li>Next — 4.4: keys, kid, JWKS and rotation</li></ul>` },
]);
