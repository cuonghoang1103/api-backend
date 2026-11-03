/**
 * auth-05-1 — Authentication · Chapter 5 · Lesson 5.1 "Two tokens, because one cannot do both jobs" (03/11/2026).
 * Slug bài: auth-5-1-hai-token. Output = s05/_ma.mjs (LabFlow ID v0.5 + PostgreSQL 17.11, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s05/_ma.mjs';

export const deck = { key: 'auth-05-1', code: 'AUTH 5.1', title: 'Two tokens, because one cannot do both jobs', sub: 'A short access token + a long, revocable refresh token' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const L = CODE.layer.split('\n');
const ISSUE = L.slice(L.findIndex((l) => l.includes('async function issue')), L.findIndex((l) => l.includes('/** Rotate a presented'))).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 5 — Refresh, rotation and revocation', bai: '5.1' }, [
  { cover: true, t: 'Two tokens, because one<br>cannot do both jobs', sub: 'Chapter 5 · Lesson 5.1 — a short access token, and a long revocable refresh token' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Chapter 5</b>: refresh tokens — a login that lasts days without the password</li>
    <li>Two tokens, two shapes: a stateless JWT and an opaque refresh token</li>
    <li>Why one token cannot be both short-and-safe and long-and-convenient</li>
    <li>Sign-in hands out both; <b>/refresh</b> exchanges the refresh token for a new access token</li>
    <li>Stored as a digest, in an HttpOnly cookie</li></ul>` },
  { t: 'A day pass and a membership card', giua: true, body: cards([
      ['Day pass', 'opens every door today, useless tomorrow — lose it, lose a day (access token)'],
      ['Membership card', 'lives in a drawer, never swipes a door, prints new day passes — cancellable (refresh token)'],
      ['The split', 'the long-lived card is the one worth protecting; the day pass is cheap'],
    ], 3) + box('So', 'A short access token for every request; a long, revocable refresh token used only to get new ones.', 'lam') },
  { t: 'Two tokens, two shapes', body: `<table class="t"><tr><th></th><th>Access token</th><th>Refresh token</th></tr>
    <tr><td>Form</td><td>a JWT (Chapter 4)</td><td>opaque secret ${c('lfid_rt_…')}</td></tr>
    <tr><td>Lifetime</td><td>15 minutes</td><td>30 days (rotated each use)</td></tr>
    <tr><td>Verified by</td><td>signature, no DB</td><td>a row keyed by digest</td></tr>
    <tr><td>Revocable?</td><td>no (only expiry)</td><td><b>yes, instantly</b></td></tr>
    <tr><td>Sent on</td><td>every request</td><td>only /refresh</td></tr>
    <tr><td>Stored</td><td>in memory</td><td>HttpOnly cookie</td></tr></table>` },
  { t: 'Why not one token for both jobs', giua: true, body: two(
      box('Long life on the JWT', 'A stolen one is valid for 30 days and cannot be revoked (4.3).', 'do2'),
      box('Short life on the refresh', 'The user re-enters their password every 15 minutes.', 'do2')) +
      box('So you need both', 'One token cannot be both un-revocable-and-short and long-and-safe. Split them, and each is simple: access short + stateless, refresh long + revocable.', 'xanh') +
      box('Measured', 'access token 376 chars · 15 min · stateless (no DB). refresh token opaque ' + c('lfid_rt_…') + ' · 30 days · one row, revocable, rotated each use.', 'lam') },
  { t: 'Where each token lives', giua: true, body: cards([
      ['Access → memory', 'a variable, sent as Authorization: Bearer; a later script can’t read it'],
      ['Refresh → HttpOnly cookie', 'scoped to /refresh; no script reads it; sent by the browser itself'],
      ['Each where its attack is cheapest', 'XSS can’t read the refresh; CSRF reaches only /refresh'],
    ], 3) + box('The refresh token is the long one', 'So it must be the hardest to steal — never localStorage, never a readable cookie.', 'lam') },
  { t: 'Sign-in hands out both', body: js(ISSUE, { sm: true }) +
      sh(body('51-sign-in').split('\n').slice(1, 5).join('\n'), { title: 'POST /sign-in', sm: true }) +
      box('A family', 'One login on one device; every refresh token minted from it shares a familyId (5.2, 5.4). The token goes to the client; the row keeps the digest.', 'xanh') },
  { t: 'The refresh exchange', body: sh(body('51-sign-in').split('\n').slice(6).join('\n'), { title: 'POST /refresh — rotates the token', sm: true }) +
      box('No password, no prompt', 'When the access token expires, the client POSTs the cookie; LabFlow ID rotates the refresh token (old spent, new set) and returns a fresh 15-min access token.', 'lam') },
  { t: 'Stored as a digest, never the token', giua: true, body: sh(body('51-two-tokens').split('\n').slice(5, 10).join('\n'), { title: 'node demo5/two-tokens.mjs', sm: true }) +
      box('Like a session id (1.3)', 'The refresh token is random, so the database keeps only its SHA-256. A leaked refresh_tokens table is a list of digests, not of working tokens.', 'xanh') +
      box('What the client holds', 'The access token in memory; the refresh token only inside the HttpOnly cookie — never a readable copy of either.', 'lam') },
  { t: 'Trap: a refresh token in a readable place', giua: true, body: box('The whole point of the split', 'is that the long-lived token is the hard one to steal.', 'lam') +
      box('localStorage or a readable cookie', 'An XSS now steals a <b>30-day</b> token — strictly worse than the 15-minute access token the design was protecting.', 'do2') +
      box('Where it belongs', 'An HttpOnly cookie scoped to the refresh route, and nowhere else.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Two tokens: a short stateless access token for every request, a long revocable refresh token for /refresh</li>
    <li>One token cannot be both short-and-unrevocable-safe and long-and-convenient</li>
    <li>The refresh token is random, stored as a SHA-256 digest, in families keyed to a login/device</li>
    <li>Sign-in returns the access token in the body, the refresh token in an HttpOnly cookie; /refresh rotates it</li>
    <li>Next — 5.2: rotation, and the reuse that gives a thief away</li></ul>` },
]);
