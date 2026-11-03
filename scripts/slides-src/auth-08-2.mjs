/** auth-08-2 — Chapter 8 · 8.2 "The authorization code flow with PKCE" (04/11/2026). Slug auth-8-2-luong-code-pkce. */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s08/_ma.mjs';
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const P = CODE.provider.split('\n');
const TOKEN = P.slice(P.findIndex((l) => l.includes('async token(')), P.findIndex((l) => l.includes('if (s256(p.code_verifier'))+1).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();
export const deck = { key: 'auth-08-2', code: 'AUTH 8.2', title: 'The authorization code flow with PKCE, step by step', sub: 'Authorize → code → back-channel token swap, bound by PKCE' };
export const slides = lamDeck({ chuong: 'Chapter 8 — OAuth 2.1 and OpenID Connect', bai: '8.2' }, [
  { cover: true, t: 'The authorization code flow<br>with PKCE, step by step', sub: 'Chapter 8 · Lesson 8.2 — the one flow OAuth 2.1 keeps' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The three moves: authorize → code in the browser → back-channel token swap</li>
    <li>PKCE: a one-time verifier the client keeps; only its hash goes up front</li>
    <li>The stolen-code attack PKCE closes</li>
    <li>Why the code is short-lived (60s) and single-use</li>
    <li>Tokens never travel in the browser; the code does, and is useless alone</li></ul>` },
  { t: 'Three moves', giua: true, body: cards([
      ['Begin', 'client makes a random verifier, hashes it to a challenge (S256), sends only the challenge + state + nonce'],
      ['Authorize', 'the signed-in user approves at the provider; a one-time code 302s back to the client'],
      ['Token', 'client swaps code + verifier back-channel for an access token and an ID token'],
    ], 3) + box('PKCE in one line', 'the verifier the client kept proves, at the end, that the same client started the flow.', 'xanh') },
  { t: 'Begin: verifier and challenge', giua: true, body: two(
      box('code_verifier', 'a random secret that NEVER leaves the client.', 'xanh'),
      box('code_challenge', 'its SHA-256 (S256), sent in the authorize URL in its place.', 'lam')) +
      box('Also sent', 'state (CSRF) and nonce (replay) — lesson 8.3.', 'lam') + box('The verifier is held back', 'only its hash (the challenge) goes up front; the secret itself is revealed only in the back-channel token step, to the provider alone.', 'lam') },
  { t: 'Authorize: the provider mints the code', giua: true, body: box('The user is already signed in here', 'a Chapter 3 session — and THAT session, not anything the client sent, is whose identity the tokens carry.', 'lam') +
      box('The code is bound', 'to this client, this exact redirect_uri, and this challenge; it lives 60 seconds and works once.', 'xanh') +
      box('It comes back in the URL', 'redirect_uri?code=…&state=… — fine, because the code is useless without the verifier.', 'lam') },
  { t: 'Token: swap code + verifier', body: js(TOKEN, { sm: true }) +
      box('Everything re-checked', 'same client, same redirect_uri, not expired, single-use — and s256(verifier) must equal the stored challenge.', 'xanh') + box('Then, and only then', 'the provider issues the access token and the signed ID token; a single failed check returns invalid_grant instead.', 'lam') },
  { t: 'Measured: the full login', body: sh(body('81-oidc-flow').split('\n').slice(4, 8).join('\n'), { title: 'demo8/oidc-flow.mjs — step 2', sm: true }) +
      box('End to end', 'authorize → code (state echoed unchanged) → token → id_token verified { ok, sub: usr_1, email }.', 'lam') + box('No browser needed', 'the user is a cookie jar already signed in to the provider; the script follows the 302s a real browser would, so the whole flow is reproducible and measured.', 'lam') },
  { t: 'PKCE closes the stolen-code attack', giua: true, body: box('Without PKCE', 'a code intercepted in the browser (a malicious app, a logged URL) could be redeemed by whoever holds it.', 'do2') +
      box('With PKCE', 'redeeming needs the verifier the attacker never saw. demo8: code + WRONG verifier → invalid_grant.', 'xanh') +
      box('And single-use', 'the code is deleted on redemption; a replay, even with the right verifier, is already gone.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Begin with a verifier + challenge; send only the challenge</li>
    <li>The provider’s session decides whose identity the tokens carry</li>
    <li>A 60-second, single-use code comes back in the browser; tokens never do</li>
    <li>Swap code + verifier back-channel; the provider checks the hash</li>
    <li>Next — 8.3: state, nonce and redirect_uri</li></ul>` },
]);
