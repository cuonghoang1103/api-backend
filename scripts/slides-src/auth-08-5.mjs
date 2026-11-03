/** auth-08-5 — Chapter 8 · 8.5 "Being a client for real" (04/11/2026). Slug auth-8-5-lam-client-that. */
import { lamDeck, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s08/_ma.mjs';
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
export const deck = { key: 'auth-08-5', code: 'AUTH 8.5', title: 'Being a client for real: linking, unlinking and the day Google is down', sub: 'Link on the sub, keep a way in, start your own session' };
export const slides = lamDeck({ chuong: 'Chapter 8 — OAuth 2.1 and OpenID Connect', bai: '8.5' }, [
  { cover: true, t: 'Being a client for real: linking,<br>unlinking and the day Google is down', sub: 'Chapter 8 · Lesson 8.5 — the lifecycle, not the cryptography' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Link a provider identity on the stable sub, not the email</li>
    <li>The account-takeover trap in "link by email"</li>
    <li>Keep a non-provider way in; refuse to unlink the last one</li>
    <li>Fail gracefully when the provider is down</li>
    <li>After verifying, start your OWN session — the token is a moment, not the state</li></ul>` },
  { t: 'Link on the sub, not the email', giua: true, body: box('Map on the provider’s stable sub', 'a per-provider id that does not change — demo8’s verified result gives sub: usr_1, the join key.', 'xanh') +
      box('The email-linking takeover', 'if the provider does not verify email (or lets it change), an attacker registers YOUR address there and is handed your local account.', 'do2') +
      box('If you must link by email', 'require email_verified: true AND re-confirm on any later change — an unverified federated email is a claim (Chapter 6).', 'lam') },
  { t: 'Measured: a verified identity to link on', body: sh(body('81-oidc-flow').split('\n').slice(4, 8).join('\n'), { title: 'demo8 — the verified result', sm: true }) +
      box('sub is the join key', 'the client finishes holding a verified identity; the next step in a real app is to start its own session.', 'lam') + box('Why not the email', 'the sub is stable and provider-local; an email can be unverified or change, which is exactly the takeover this lesson warns about.', 'do2') },
  { t: 'Keep a way in that is not the provider', giua: true, body: two(
      box('Single-homed identity', 'if "Sign in with X" is the only way in, X’s outage — or X closing the account — locks the user out of YOUR product.', 'do2'),
      box('So offer another', 'a local credential or a second provider; identity must not be single-homed.', 'xanh')) +
      box('Unlink guard', 'let users unlink a provider, but refuse to remove the LAST way in — require a local password (or another provider) first.', 'lam') },
  { t: 'The provider is down; tokens are not sessions', giua: true, body: cards([
      ['Fail gracefully', 'a clear "try another method", not a stack trace; never fall back to a weaker check'],
      ['Start your own session', 'after the ID token verifies, begin a Chapter-3 session; do not re-call the provider per request'],
      ['Scope narrowly', 'request openid email, not every scope — over-asking scares users and widens a leak'],
    ], 3) + box('Log out is local first', 'signing out of your app ends YOUR session; it usually should not sign the user out of the provider everywhere.', 'lam') },
  { t: 'Trap: treating the ID token as a session', giua: true, body: box('The ID token is a one-time identity statement', 'not a session token — do not store it as the session cookie.', 'do2') +
      box('Verify once, then run your session', 'the federated login is a moment; your Chapter-3 session is the state that follows.', 'xanh') +
      box('Log out is local first', 'signing out of your app ends your session; it usually should not sign the user out of the provider everywhere.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Link on the stable sub, never on an unverified email</li>
    <li>If you must use email, require email_verified and re-confirm on change</li>
    <li>Keep a non-provider way in; refuse to unlink the last one</li>
    <li>Fail gracefully on an outage; never fall back to a weaker check</li>
    <li>After verifying, start your own session — next, Lab 8</li></ul>` },
]);
