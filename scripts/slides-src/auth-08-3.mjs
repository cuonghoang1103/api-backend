/** auth-08-3 — Chapter 8 · 8.3 "state, nonce and redirect_uri" (04/11/2026). Slug auth-8-3-state-nonce-redirect. */
import { lamDeck, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s08/_ma.mjs';
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
export const deck = { key: 'auth-08-3', code: 'AUTH 8.3', title: 'state, nonce and redirect_uri: three parameters, three attacks', sub: 'CSRF, ID-token replay, code theft — one defence each' };
export const slides = lamDeck({ chuong: 'Chapter 8 — OAuth 2.1 and OpenID Connect', bai: '8.3' }, [
  { cover: true, t: 'state, nonce and redirect_uri:<br>three parameters, three attacks', sub: 'Chapter 8 · Lesson 8.3 — each one is a defence, not bookkeeping' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>state ⟂ CSRF on the callback — the client checks it</li>
    <li>nonce ⟂ ID-token replay — the client checks it via the token</li>
    <li>redirect_uri ⟂ code theft — the provider matches it exactly</li>
    <li>Where each check lives: two on the client, one on the provider</li>
    <li>Why an invalid redirect_uri must NOT be redirected to</li></ul>` },
  { t: 'The three, at a glance', giua: true, body: `<table class="t"><tr><th>Param</th><th>Attack it stops</th><th>Checked by</th></tr>
    <tr><td><b>state</b></td><td>CSRF — a login into the attacker’s account</td><td>the client</td></tr>
    <tr><td><b>nonce</b></td><td>ID-token replay from another session</td><td>client (via the token)</td></tr>
    <tr><td><b>redirect_uri</b></td><td>code theft via open redirect</td><td>provider (exact match)</td></tr></table>` +
      box('Drop any one', 'and a specific, named attack opens — these are not form-filling.', 'do2') + box('Two sides, three checks', 'the client owns state and nonce; the provider owns redirect_uri. A secure login needs both sides doing their part.', 'lam') },
  { t: 'state — CSRF on the callback', giua: true, body: box('The client makes a random state', 'remembers it, and checks the callback echoes the SAME one.', 'xanh') +
      box('Without it', 'an attacker starts a login with THEIR account and tricks your browser into completing it — logging you into the attacker’s account, where what you save is theirs to read.', 'do2') +
      box('The provider only echoes it', 'it is the client that stores and compares — demo8’s /callback rejects an unknown state.', 'lam') },
  { t: 'nonce — ID-token replay', giua: true, body: two(
      box('Client → authorize request', 'puts a random nonce in; the provider copies it verbatim into the ID token.', 'xanh'),
      box('Client → on the token', 'checks the token’s nonce is the one it sent — an old token carries the wrong one.', 'lam')) +
      box('Measured', 'demo8: verifying the id_token with a different nonce ⇒ { error: "bad_nonce" } — perfectly signed, just not from this login.', 'lam') + box('state vs nonce', 'state guards the request/callback; nonce lives INSIDE the ID token, so it also defeats a token replayed much later.', 'lam') },
  { t: 'redirect_uri — code theft', body: sh(body('81-oidc-flow').split('\n').slice(-7).join('\n'), { title: 'demo8 — the three defences', sm: true }) +
      box('Exact match, never a prefix', 'the provider sends the code only to a registered redirect_uri. A prefix match lets …evil.com receive it. demo8: off-list ⇒ HTTP 400, and NO redirect.', 'do2') },
  { t: 'Trap: redirecting an error', giua: true, body: box('When redirect_uri is invalid', 'respond 400 — do NOT redirect to it to report the error.', 'do2') +
      box('Otherwise', 'you built the very open redirect you were trying to prevent — an attacker steers both the code and the user.', 'do2') +
      box('demo8', 'returns 400 invalid_redirect_uri and stays put.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>state defends the callback against CSRF — the client issues and re-checks it</li>
    <li>nonce lives in the ID token and defeats replay — the client checks it</li>
    <li>redirect_uri is matched exactly by the provider — never a prefix</li>
    <li>An invalid redirect_uri returns 400 and is never redirected to</li>
    <li>Next — 8.4: the ID token and its seven checks</li></ul>` },
]);
