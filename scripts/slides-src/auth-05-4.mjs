/**
 * auth-05-4 — Authentication · Chapter 5 · Lesson 5.4 "The device list: revocation the user can see" (03/11/2026).
 * Slug bài: auth-5-4-danh-sach-thiet-bi. Output = s05/_ma.mjs. Slide titles match giang/auth-05-4.mjs.
 */
import { lamDeck, js, sh, two, box, cards, steps, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s05/_ma.mjs';

export const deck = { key: 'auth-05-4', code: 'AUTH 5.4', title: 'The device list: revocation the user can see', sub: 'Group refresh families, show “is this you?”, revoke one device' };
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const P = CODE.pgStore.split('\n');
const LISTFAM = P.slice(P.findIndex((l) => l.includes('async listFamilies')), P.findIndex((l) => l.includes('return r.rows.map')) + 2).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();
const SV = CODE.server05.split('\n');
const DEV = SV.filter((l, i, a) => { const s = a.findIndex((x) => x.includes('lesson 5.4: the devices page')); const e = a.findIndex((x) => x.includes('lesson 4.x compatibility')); return i >= s && i < e; }).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 5 — Refresh, rotation and revocation', bai: '5.4' }, [
  { cover: true, t: 'The device list: revocation<br>the user can see', sub: 'Chapter 5 · Lesson 5.4 — a “your devices” page from data you already store' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Turn the refresh table into a devices list — one row per family</li>
    <li>Show the “is this you?” fields: when, where, on what</li>
    <li>Revoke one device while the others keep working</li>
    <li>Scope the revoke to the signed-in user, so no one revokes another account’s device</li></ul>` },
  { t: 'One family, one device', giua: true, body: two(
      box('A family rotates many times', 'r0 → r1 → r2 … but every rotation stays inside the family (5.2).', 'lam'),
      box('So a family is one login', 'on one phone or laptop, however many times it refreshed.', 'xanh')) +
      box('Group by family', 'Each group of refresh rows is one device row — no new table, just a GROUP BY.', 'lam') +
      box('Why not one row per token', 'A busy login rotates dozens of times a day; listing tokens would show dozens of entries for one phone.', 'xanh') },
  { t: 'The query that makes the page', body: js(LISTFAM, { sm: true }) +
      box('A plain aggregate', 'One SELECT, GROUP BY family_id, keeping the first row’s ip and user_agent and the times. Live families only, newest first — no devices table.', 'lam') },
  { t: 'Is this you?', body: `<table class="t"><tr><th>The row shows…</th><th>From column</th><th>So the user can…</th></tr>
    <tr><td>when this login started</td><td>${c('created_at')}</td><td>spot a login they do not remember</td></tr>
    <tr><td>roughly where from</td><td>${c('ip')}</td><td>notice a country they never visited</td></tr>
    <tr><td>on what device/browser</td><td>${c('user_agent')}</td><td>tell the phone from the lab PC</td></tr>
    <tr><td>which one to cut</td><td>${c('family_id')}</td><td>revoke exactly that device</td></tr></table>` +
      box('From data you already store', 'Every column was recorded at sign-in (5.1); the page just presents it.', 'lam') },
  { t: 'Three devices, listed', body: sh(body('54-devices').split('\n').slice(0, 5).join('\n'), { title: 'bash demo5/devices.sh — GET /me/devices', sm: true }) +
      box('Three families, three rows', 'An signs in on a laptop, a phone and a lab PC; each row carries the user agent and IP its login came from.', 'xanh') +
      box('Rotation is invisible here', 'Each login refreshed many times, but the GROUP BY collapses it to one row — you see devices, not tokens.', 'lam') },
  { t: 'Revoke one device', body: js(DEV, { sm: true }) +
      sh(body('54-devices').split('\n').slice(6).join('\n'), { title: '… revoke the phone', sm: true }) },
  { t: 'Scoped to the owner', giua: true, body: box('The revoke takes the user id from the session', 'and the family id from the request — and only revokes a family that belongs to that user.', 'lam') +
      box('revokeFamilyForUser(userId, familyId)', 'A guessed id that is not yours revokes nothing (' + c('{"revoked":0}') + ').', 'xanh') +
      box('Same lesson, new object', 'This is the ownership check of BOLA/IDOR (Muc 0) applied to a device id: the session names the owner, not the request.', 'lam') },
  { t: 'Why users want it', giua: true, body: two(
      box('Reuse detection (5.2)', 'catches a thief who <b>uses</b> a token in a way that collides with the real user.', 'lam'),
      box('A device list', 'catches one who just <b>holds</b> it — the user sees a strange login and taps revoke.', 'xanh')) +
      box('One tap, not a ticket', 'It turns the thought I think I was hacked into an action the user takes in seconds, not a support ticket.', 'lam') +
      box('Complementary, not a replacement', 'Detection is automatic but narrow; the device list is manual but broad. Ship both.', 'xanh') },
  { t: 'Trap: IDOR on the device id', giua: true, body: box('If the revoke used only the request’s family id', 'anyone could revoke anyone’s device by guessing an id — the BOLA/IDOR bug from Mục 0, now on a family id.', 'do2') +
      box('The fix', 'Take the user id from the authenticated session, never from the request; only revoke families that belong to that user.', 'xanh') +
      box('Test it', 'Guess a family id that is not yours and confirm the server revokes nothing — a one-line test that catches the whole class of bug.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A device list is the refresh table grouped by family: one row per login on one device</li>
    <li>Each row shows created-at, IP and user agent — the “is this you?” context</li>
    <li>Revoking a device revokes one family; the other devices keep working</li>
    <li>Scope the revoke to the signed-in user, or it is an IDOR on a device id</li>
    <li>Next — 5.5: the refresh race</li></ul>` },
]);
