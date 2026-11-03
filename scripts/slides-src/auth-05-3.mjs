/**
 * auth-05-3 — Authentication · Chapter 5 · Lesson 5.3 "Five events that must end a session" (03/11/2026).
 * Slug bài: auth-5-3-nam-su-kien. Output = s05/_ma.mjs. Slide titles match giang/auth-05-3.mjs.
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s05/_ma.mjs';

export const deck = { key: 'auth-05-3', code: 'AUTH 5.3', title: 'Five events that must end a session', sub: 'Each revokes the refresh family on the server — not just a cookie' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const SV = CODE.server05.split('\n');
const clipLines = (s, n = 90) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + ' …' : l)).join('\n');
const PW = clipLines(SV.filter((l, i, a) => { const s = a.findIndex((x) => x.includes('lesson 3.3 + 5.3: change the password')); const e = a.findIndex((x) => x.includes('lesson 5.3: sign-out ends')); return i >= s && i < e; }).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim());
const SO = clipLines(SV.filter((l, i, a) => { const s = a.findIndex((x) => x.includes('lesson 5.3: sign-out ends')); const e = a.findIndex((x) => x.startsWith('app.use((err')); return i >= s && i < e; }).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim());

export const slides = lamDeck({ chuong: 'Chapter 5 — Refresh, rotation and revocation', bai: '5.3' }, [
  { cover: true, t: 'Five events that must<br>end a session', sub: 'Chapter 5 · Lesson 5.3 — logging in is one path; logging out is five' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The five events that must end a session, and the scope of each</li>
    <li>Revoke one family, or all of a user’s families, on the right event</li>
    <li>Why ending a session is server-side revocation, not clearing a cookie</li>
    <li>Why an already-issued access token keeps working for up to 15 minutes</li></ul>` },
  { t: 'Ending a session is not clearing a cookie', giua: true, body: two(
      box('Clear the cookie', 'Like tearing up your own copy of a key card — the lock still opens for any other copy.', 'do2'),
      box('End the session', 'Tell the <b>lock</b> to forget the card entirely — the only thing that stops a thief who copied it.', 'xanh')) +
      sh(body('53-five-events').split('\n').slice(0, 5).join('\n'), { title: 'node demo5/five-events.mjs', sm: true }) },
  { t: 'Event 1 — sign out (this device)', body: js(SO, { sm: true }) +
      box('One family', 'Sign-out revokes just this device’s family and clears the cookie; other devices are untouched. The next refresh from this device returns ' + c('REVOKED') + '.', 'lam') },
  { t: 'Event 2 — sign out everywhere / password change', body: js(PW, { sm: true }) +
      box('All families', 'A password change revokes <b>every</b> family then starts one fresh — a leaked password cannot leave a session alive. Sign-out-everywhere revokes all without a new one.', 'xanh') },
  { t: 'Event 3 — theft detected', giua: true, body: box('A reused refresh token (5.2)', 'revokes the family on its own. The user did not ask to be logged out, but a copy of their token did something impossible.', 'do2') +
      box('The automatic one', 'This is the one event the system triggers by itself — no click, no password change, just a replay.', 'lam') +
      box('What the user sees', 'Suddenly signed out of that login on every device — the system protecting them from a copy it caught.', 'xanh') },
  { t: 'Event 4 — expiry', giua: true, body: box('The family has an absolute end', '30 days. After it, the refresh token is ' + c('EXPIRED') + ' whatever else is true — the one event that needs no action.', 'xanh') +
      box('Nothing lives forever', 'Even an untouched session dies on schedule; expiry is passive, so its code is EXPIRED, not REVOKED.', 'lam') +
      box('In LabFlow ID', 'The family\u2019s expires_at is set at sign-in to now + 30 days; every rotated token keeps the same end.', 'xanh') },
  { t: 'Event 5 — admin / device-page revoke', giua: true, body: box('From the devices page (5.4)', 'the user or an admin revokes one family by id. A lost phone is cut off without touching the laptop.', 'lam') +
      box('Scoped to the owner', 'The revoke takes the user id from the session, so you cannot revoke someone else’s device by guessing an id (IDOR, Mục 0).', 'xanh') +
      box('Why users want it', 'Reuse detection catches a thief who uses a token; the devices page catches one who just holds it, by letting the user notice and cut it (5.4).', 'lam') },
  { t: 'The access-token window', giua: true, body: box('Every event ends the refresh token', 'so no new access token is minted.', 'xanh') +
      box('But the old access token is stateless (4.3)', 'nothing is looked up when it is used, so it works until it expires — up to <b>15 minutes</b>.', 'do2') +
      box('The price of skipping a lookup', 'Shorten the access token to shrink the window; for an instant kill switch, check a denylist per request or keep a session (Ch 3).', 'lam') },
  { t: 'Trap: logging out the cookie, not the token', giua: true, body: box('A sign-out that only clears the cookie', 'tells this browser to forget, but leaves the refresh token valid on the server.', 'do2') +
      box('Who can still refresh', 'A synced device, a browser extension, or a logged proxy that kept a copy — indefinitely.', 'do2') +
      box('Always revoke the family', 'Clearing the cookie is a courtesy to the honest browser, not a security control.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Five events end a session: sign-out, sign-out-everywhere/password change, theft, expiry, devices-page revoke</li>
    <li>Each revokes the refresh family on the server; clearing the cookie alone does not end the session</li>
    <li>A password change revokes <b>all</b> families — a leaked password cannot leave a session alive</li>
    <li>Expiry needs no action; the old access token lingers ≤ 15 min (4.3)</li>
    <li>Next — 5.4: the devices page</li></ul>` },
]);
