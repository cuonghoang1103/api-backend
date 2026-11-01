/**
 * auth-03-3 — Authentication · Chapter 3 · Lesson 3.3 "New session on every privilege change" (01/11/2026).
 * Slug bài: auth-3-3-tai-sinh-phien. Output = s03/_ma.mjs (session fixation thật trong Chromium 156; v0.3 + PostgreSQL 17.11).
 */
import { lamDeck, js, sh, two, box, cards, steps, flow, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s03/_ma.mjs';

export const deck = { key: 'auth-03-3', code: 'AUTH 3.3', title: 'New session on every privilege change', sub: 'Session fixation, regeneration, re-authentication' };
const body = (k) => OUT[k].split('\n').slice(1).join('\n');
const FX = OUT['33-fixation'].split('\n').slice(1);
const L = CODE.layer.split('\n');
const START = L.slice(L.findIndex((l) => l.includes('async function start')), L.findIndex((l) => l.includes('/** Middleware'))).join('\n').replace(/ *\/\/.*$/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 3 — Sessions and cookies', bai: '3.3' }, [
  { cover: true, t: 'New session on every<br>privilege change', sub: 'Chapter 3 · Lesson 3.3 — session fixation, regeneration, re-authentication' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Session fixation</b>: the attacker lends you a session and waits</li>
    <li>The attack run for real in Chromium — and the one-line fix</li>
    <li>Every “privilege change” that needs a new session</li>
    <li>Re-authentication before risky actions (change password)</li>
    <li>The re-auth traps that make the check worthless</li></ul>` },
  { t: 'A hotel key card, reprogrammed at check-in', body: cards([
      ['The trick', 'someone hands you a key card they <b>already copied</b>, saying it is yours'],
      ['If the desk just activates it', 'their copy now opens your room too'],
      ['What hotels do', 'program a <b>new</b> card at check-in — any card that existed before stops working'],
    ], 3) + flow([
      { t: 'attacker', s: 'gets session id S', mau: '#c62828' },
      { t: 'plants S', s: 'in An’s browser', mau: '#c62828' },
      { t: 'An signs in', s: 'server upgrades S?' },
      { t: 'attacker uses S', s: '= An', mau: '#c62828' },
    ], { h: 150 }) + box('The name', '<b>Session fixation</b>: the attacker <i>fixes</i> your session id in advance. No password, no XSS on the target, no cracking — just a server that keeps the old id at sign-in.', 'do2') },
  { t: 'The naive server: sign-in upgrades the same session', body: js(CODE.fixNaive.split('\n').slice(22, 28).join('\n').replace(/\s*\/\/ ←.*$/m, '  // ← the bug'), { sm: true, hl: [4] }) +
      sh(FX.slice(0, 3).join('\n'), { title: 'node demo3/fixation.mjs — part 1 (naive server :4802)' }) +
      box('He never needed the password', 'The attacker’s anonymous sid became An’s signed-in session the moment she signed in.', 'do2') },
  { t: 'v0.3: start() always issues a new session', body: js(`async function start(req, res, userId) {
  const old = readCookie(req.headers.cookie);
  if (old) await store.delete(tokenDigest(old));   // the planted / previous session dies
  const token = newToken('lfid_ses');               // a brand-new 256-bit id
  const t = now();
  await store.insert({ digest: tokenDigest(token), userId, createdAt: t,
    expiresAt: t + absoluteMs, lastSeenAt: t, authAt: t, ip: req.ip ?? null, … });
  setCookie(res, token);
}`, { hl: [3, 4] }) +
      box('Two lines that matter', 'Destroy whatever session the request carried; mint a new token. The planted id is now worthless.', 'xanh') },
  { t: 'The same attack against v0.3', body: sh(FX.slice(3).map((l) => (l.length > 100 ? l.slice(0, 99) + '…' : l)).join('\n'), { title: 'node demo3/fixation.mjs — part 2 (LabFlow ID v0.3 :4800)' }) +
      two(box('Fixed', 'An signed in ⇒ new cookie; Bình’s planted id ⇒ 401. Her tab shows An.', 'xanh'),
        box('Note the second line', 'Before signing in, An’s tab was signed in <b>as Bình</b> — “login CSRF”: a victim types data into the attacker’s account. Lesson 3.4 blocks the forged sign-in.', 'do2')) +
      cards([
        ['Planted id', c('lfid_ses_…') + ' (Bình’s valid session)'],
        ['After An signs in', 'deleted by ' + c('start()') + ' ⇒ 401'],
        ['An’s new cookie', 'minted at sign-in, never seen by Bình'],
      ], 3) },
  { t: 'How a session gets planted', body: cards([
      ['Cookie tossing', 'a sibling subdomain sets a cookie for the parent domain — <b>closed</b> by ' + c('__Host-') + ' (3.2)'],
      ['Session id in the URL', c('?sid=…') + ' accepted from a link — never accept ids from URLs'],
      ['An XSS elsewhere', 'or a shared lab PC — regeneration is the fix that works whatever the route'],
    ], 3) + box('Defence in depth', 'Prevent planting where you can (__Host-), and make planting useless anyway (new session at sign-in).', 'lam') },
  { t: 'Every privilege change gets a new session', body: `<table class="t"><tr><th>Event</th><th>New session here</th><th>Other sessions</th></tr>
    <tr><td>sign-in</td><td>yes</td><td>keep</td></tr>
    <tr><td>password changed</td><td>yes</td><td><b>end all</b></td></tr>
    <tr><td>role changed (STUDENT → LAB_MANAGER)</td><td>yes</td><td>end all, or re-check role per request</td></tr>
    <tr><td>second factor added / removed (Ch 7)</td><td>yes</td><td>end all</td></tr>
    <tr><td>sign-out</td><td>— (delete)</td><td>keep</td></tr></table>` +
    box('OWASP', '“The session ID must be renewed or regenerated by the web application after any privilege level change” — and the previous one destroyed.', 'lam') },
  { t: 'Re-authenticate before risky actions', body: sh(body('33-password'), { title: 'bash demo3/change-password.sh  (Cô Lan, two devices)' }) +
      cards([
        ['Prove it again', 'a stolen cookie is not enough to change the password: <b>REAUTH_FAILED</b>'],
        ['End the others', 'signedOutSessions: 2 — the phone and the old laptop cookie are dead'],
        ['Continue here', 'a fresh cookie for this device: Cô Lan keeps working'],
      ], 3) },
  { t: 'Trap: “re-auth” that checks nothing', body: two(steps([
      'A “Confirm password” box checked only in the browser',
      'A re-auth flag stored in the session forever',
      'Changing the email without re-auth — then “forgot password” to the new email',
    ]), box('Do', 'Verify on the server, store ' + c('auth_at') + ' and require it to be recent (e.g. ≤ 5 min) for: password, email, MFA, deleting the account.', 'xanh')) +
      box('Why email belongs on the list', 'Change the email, then “forgot password” sends the reset link to the attacker: one unchecked endpoint and the account is gone (Chapter 6).', 'do2') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Fixation: a planted session upgraded in place ⇒ the attacker is signed in as you</li>
    <li>Fix: ${c('start()')} destroys the old session and mints a new token — measured: 401</li>
    <li>New session at <b>every</b> privilege change; end all others on password change</li>
    <li>Re-authenticate on the server before risky actions</li>
    <li>Next — 3.4: CSRF, and three defences ranked</li></ul>` },
]);
