/** auth-08-1 — Chapter 8 · 8.1 "What OAuth is for" (04/11/2026). Slug auth-8-1-oauth-la-gi. Output = s08/_ma.mjs. */
import { lamDeck, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s08/_ma.mjs';
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
export const deck = { key: 'auth-08-1', code: 'AUTH 8.1', title: 'What OAuth is for, and the three things it is confused with', sub: 'Delegated access, not login — OIDC adds the identity' };
export const slides = lamDeck({ chuong: 'Chapter 8 — OAuth 2.1 and OpenID Connect', bai: '8.1' }, [
  { cover: true, t: 'What OAuth is for, and the<br>three things it is confused with', sub: 'Chapter 8 · Lesson 8.1 — delegation, OIDC, and the dead implicit flow' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Chapter 8</b>: LabFlow ID becomes an OIDC provider; LabFlow API is its client</li>
    <li>OAuth delegates scoped, revocable access — it is authorization, not identity</li>
    <li>OIDC adds an ID token on top; "sign in with…" is OIDC</li>
    <li>The four roles: owner, client, authorization server, resource server</li>
    <li>Discovery advertises the endpoints; implicit is dead — code + PKCE for all</li></ul>` },
  { t: 'A valet key', giua: true, body: cards([
      ['Starts the car, opens the door', 'but not the trunk or the glovebox — one job, nothing more'],
      ['You can take it back', 'scoped and revocable; the holder never becomes you'],
      ['OAuth is that key for your data', 'an app does SOME things, with a token, without your password'],
    ], 3) + box('So', 'the app never learns your credential; it holds a token that says "allowed to do X, until revoked".', 'lam') },
  { t: 'The three things OAuth is NOT', giua: true, body: `<table class="t"><tr><th>Confused with</th><th>What it actually is</th></tr>
    <tr><td>"login" / authentication</td><td>OpenID Connect (an ID token) — raw OAuth never says WHO</td></tr>
    <tr><td>a session</td><td>Chapter 3 — what your own app keeps after login</td></tr>
    <tr><td>an API key</td><td>a client credential (machine-to-machine), not a user delegation</td></tr>
    <tr><td>"implicit flow"</td><td>dead (OAuth 2.1) — tokens in the URL leaked</td></tr></table>` +
      box('The one that bites', 'reading the user’s identity out of an access token is building on sand — that token is for the API and may be opaque.', 'do2') },
  { t: 'OIDC = OAuth + identity', giua: true, body: two(
      box('Same flow, one addition', 'OpenID Connect is a thin layer: the same authorization-code flow, plus an ID TOKEN — a signed JWT saying who logged in.', 'xanh'),
      box('Two tokens, two jobs', 'the access token calls APIs; the ID token tells the client who the user is (8.4).', 'lam')) +
      box('"Sign in with…" is OIDC', 'not bare OAuth — if you only have an access token, you have no trustworthy identity.', 'lam') },
  { t: 'The four roles, in LabFlow', giua: true, body: cards([
      ['Resource owner', 'the user — An, who authorizes access to her data'],
      ['Client', 'LabFlow API, the app wanting access; never sees the password'],
      ['Authorization server', 'LabFlow ID — authenticates An, issues tokens (the "provider")'],
      ['Resource server', 'the API holding the data, which accepts the access token'],
    ], 2) + box('Keep them straight', 'every OAuth flow reads clearly once you can name which component is the owner, the client, the server and the resource server.', 'lam') },
  { t: 'Discovery: one document', body: sh(body('81-oidc-flow').split('\n').slice(0, 4).join('\n'), { title: 'node demo8/oidc-flow.mjs', sm: true }) +
      box('Read once, learn everything', 'a client reads /.well-known/openid-configuration for every endpoint and algorithm. LabFlow ID advertises code_challenge_methods ["S256"] — PKCE required, no "plain".', 'xanh') + box('No hardcoded endpoints', 'the client never guesses URLs; it reads them from this one document, so the provider can move an endpoint without breaking clients.', 'lam') },
  { t: 'Trap: "implicit is simpler for a SPA"', giua: true, body: box('The implicit flow returned tokens in the URL fragment', 'where they landed in browser history, server logs and the Referer header.', 'do2') +
      box('OAuth 2.1 removes it entirely', 'every client — single-page apps included — uses the authorization code flow with PKCE (8.2).', 'xanh') +
      box('If a tutorial says "use implicit"', 'it is describing a web that no longer exists.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>OAuth delegates scoped, revocable access — authorization, not identity</li>
    <li>Not a session, not an API key, not login; login is OIDC + an ID token</li>
    <li>Four roles: owner, client, authorization server, resource server</li>
    <li>Discovery advertises the endpoints; LabFlow ID offers S256 only</li>
    <li>Next — 8.2: the authorization code flow with PKCE, step by step</li></ul>` },
]);
