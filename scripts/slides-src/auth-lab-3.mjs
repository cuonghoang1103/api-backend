/**
 * auth-lab-3 — Authentication · Chapter 3 · Lab 3 "LabFlow ID's session layer" (01/11/2026).
 * Slug bài: auth-3-7-lab-phien-cookie. Output = s03/_ma.mjs (máy chấm scripts/cham-lab-3.mjs: HTTP :4806 + Chromium 156, env -i).
 */
import { lamDeck, js, vt, sh, box, steps, cards, c } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s03/_ma.mjs';

export const deck = { key: 'auth-lab-3', code: 'AUTH Lab 3', title: 'LabFlow ID’s session layer', sub: 'Five methods, nine checks, one real browser' };
const noWhy = (k) => OUT[k].split('\n').filter((l) => !l.startsWith('    ↳')).slice(1).join('\n');
const why = (k) => OUT[k].split('\n').filter((l) => l.startsWith('    ↳')).map((l) => l.trim().replace(/^(.{110}).+$/, '$1…')).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 3 — Sessions and cookies', bai: 'Lab 3' }, [
  { cover: true, t: 'LabFlow ID’s<br>session layer', sub: 'Chapter 3 · Lab 3 — sessions, cookies and CSRF, graded by HTTP and a real browser' },
  { t: 'Mission', body: cards([
      [c('start(req, res, userId)'), 'new 256-bit session, ' + c('__Host-lfid_ses') + ', destroy any session the request carried (3.2, 3.3)'],
      [c('load(req, res, next)'), 'idle 30 min, absolute 12 h, last-seen touched once a minute (3.1)'],
      [c('end / endAll'), 'clear with the same attributes; sign out everywhere (3.1, 3.2)'],
      [c('csrf(req, res, next)'), 'unsafe methods from another site ⇒ 403 (3.4)'],
      ['Any store', 'the grader passes an in-memory store with the 5-method interface (3.5)'],
      ['Graded', c('node scripts/cham-lab-3.mjs lab3/my') + ' — 9 checks, 10 points, <b>pass = 7</b>'],
    ], 3) },
  { t: 'Setup: copy, then grade the empty starter', body: js(`// lab3/my/index.js  (cp -r lab3/starter lab3/my)
export function sessionLayer({ store, now = () => Date.now(), idleMs = 30 * 60e3,
  absoluteMs = 12 * 3600e3, touchEveryMs = 60e3, origins = ['http://localhost:4800'] }) {
  throw new Error('TODO sessionLayer');
  // return { start, load, end, endAll, csrf };
}`, { sm: true }) +
      vt(OUT['lab-bat-dau'].split('\n').filter((l) => !l.startsWith('    ↳')).slice(1, 4).join('\n') + '\n…\n' + OUT['lab-bat-dau'].split('\n').at(-1), { title: 'node scripts/cham-lab-3.mjs lab3/starter' }) +
      box('What the grader runs', 'Your layer inside an Express app on :4806 with a fake clock; an attacker page on 127.0.0.1:4807 in Chromium (Playwright, lesson 1.1 installed it).', 'lam') },
  { t: 'Nine checks, and what a failure means for a user', body: `<table class="t"><tr><th>Check</th><th>Pts</th><th>If it fails…</th></tr>
    <tr><td>T1 cookie attributes · T2 token + digest</td><td>1.5 + 1.5</td><td>a script or a subdomain gets the token; a leaked table is live sessions</td></tr>
    <tr><td>T3 fixation</td><td>1.5</td><td>a planted id becomes An’s session</td></tr>
    <tr><td>T4 idle · T5 absolute</td><td>1 + 1</td><td>a forgotten lab PC, a stolen cookie that never dies</td></tr>
    <tr><td>T6 throttled touch</td><td>0.5</td><td>a write per read</td></tr>
    <tr><td>T7 sign-out / everywhere</td><td>1</td><td>“sign out” that does not; a thief’s session survives</td></tr>
    <tr><td>T8 CSRF in Chromium · T9 source</td><td>1.5 + 0.5</td><td>another site changes An’s email</td></tr></table>` },
  { t: 'A first attempt that “works”: 2 / 10', body: vt(noWhy('lab-yeu'), { title: 'node scripts/cham-lab-3.mjs lab3/yeu', sm: true }) +
      box('Every happy-path call worked', 'An signs in, /me knows her, sign-out answers ok. Seven checks still fail.', 'do2') },
  { t: 'Why each check failed', body: sh(why('lab-yeu'), { title: 'the ↳ lines of the same run', sm: true }) +
      cards([
        ['T2 · T3', 'the token is the store key, and start() never deletes the session the browser already had'],
        ['T4 · T5 · T6', c('<= idleMs') + ' keeps a 30-min-idle session alive; no absolute limit; an UPDATE per request'],
        ['T7 · T8', c('__Host-lfid_ses=deleted') + ' clears nothing; ' + c('csrf') + ' just calls next() — Lax alone is not the defence'],
      ], 3) },
  { t: 'Reference: src/sessions — 10 / 10', body: vt(OUT['lab-tham-khao'].split('\n').slice(1).join('\n'), { title: 'node scripts/cham-lab-3.mjs src/sessions', sm: true }) +
      box('Read it after your attempt', c('layer.js') + ' (all five methods, ~90 lines) · ' + c('pg-store.js') + ' · ' + c('memory-store.js') + ' — the store is not graded, the behaviour is.', 'lam') },
  { t: 'Hints, from light to strong', body: steps([
      'Each check names its lesson — rerun that demo when it fails',
      c('start') + ': read the old cookie, ' + c('store.delete(tokenDigest(old))') + ', then ' + c("newToken('lfid_ses')"),
      c('load') + ': ' + c('now ≥ expiresAt') + ' or ' + c('now − lastSeenAt ≥ idleMs') + ' ⇒ delete + clear; touch only if ≥ touchEveryMs',
      c('csrf') + ': Sec-Fetch-Site first (same-origin/none pass), then Origin against ' + c('origins'),
    ]) + box('Clearing a cookie', 'Same name, ' + c('Path=/; HttpOnly; Secure; SameSite=Lax') + ', ' + c('Max-Age=0') + ' — anything else is a different cookie.', 'xanh') },
  { t: 'Checklist before you submit', to: true, giua: true, body: `<ul>
    <li>${c('node scripts/cham-lab-3.mjs lab3/my')} ≥ 7, twice in a row</li>
    <li>${c('npm test')} still green; no ${c('Math.random')}, no ${c('SameSite=None')}, no ${c('Domain=')}</li>
    <li>Optional: plug your layer into ${c('src/server.js')} and rerun ${c('demo3/fixation.mjs')} and ${c('demo3/csrf-v03.sh')}</li>
    <li>You can say what a user suffers for each check of the first attempt</li>
    <li>Next: Chapter 3 quiz, then Chapter 4 — JWT from the inside</li></ul>` },
]);
