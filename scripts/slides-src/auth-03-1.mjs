/**
 * auth-03-1 — Authentication · Chapter 3 · Lesson 3.1 "One table, and what every column is for" (01/11/2026).
 * Slug bài: auth-3-1-bang-phien. Output = s03/_ma.mjs (LabFlow ID v0.3 + PostgreSQL 17.11, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, cards, steps, c, http } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s03/_ma.mjs';

export const deck = { key: 'auth-03-1', code: 'AUTH 3.1', title: 'One table, and what every column is for', sub: 'Server-side sessions, two timeouts, sign out everywhere' };
const body = (k) => OUT[k].split('\n').slice(1).join('\n');
const SQL = CODE.sql002.split('\n').slice(1).join('\n').replace(/ +--.*$/gm, '');
const L = CODE.layer.split('\n');
const LOAD = L.slice(L.findIndex((l) => l.includes('async function load')), L.findIndex((l) => l.includes('async function end'))).join('\n').replace(/ *\/\/.*$/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 3 — Sessions and cookies', bai: '3.1' }, [
  { cover: true, t: 'One table, and what<br>every column is for', sub: 'Chapter 3 · Lesson 3.1 — server-side sessions, two timeouts, sign out everywhere' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Chapter 3</b>: a session that lives on the server, behind a cookie JavaScript cannot read — Lab 3 builds ${c('src/sessions/')}</li>
    <li>The sessions table, and the question each column answers</li>
    <li><b>Idle</b> vs <b>absolute</b> timeout — and why you need both</li>
    <li>Why “update last_seen on every request” is a write per request</li>
    <li>Sign out everywhere, with one index</li></ul>` },
  { t: 'A cloakroom ticket', body: cards([
      ['The coat', 'stays behind the counter — like the session row on the server'],
      ['The ticket', 'a number that means nothing by itself — like the random token in the cookie'],
      ['Closing time', 'the cloakroom shuts at 19:00 whatever you do (absolute), and gives coats away after a long silence (idle)'],
    ], 3) + box('Why server-side', 'Lose the ticket? Void it at the counter — <b>revocation is one DELETE</b>. That is the property token designs (Chapter 4) give up.', 'lam') },
  { t: 'v0.3: the token arrives only in Set-Cookie', body: http(body('31-sign-in'), { title: 'bash demo3/sign-in.sh' }) +
      sh(body('31-row'), { title: 'node demo3/sessions-dump.mjs', sm: true }) +
      box('No token in the JSON body any more', 'v0.2 returned {"session": "lfid_ses_…"} for JavaScript to keep (hole 5). v0.3 returns only {"ok":true}; the browser keeps the cookie.', 'xanh') },
  { t: 'sql/002_sessions.sql — a column per question', body: js(SQL, { lang: 'sql', sm: true }) + `<table class="t"><tr><th>Column</th><th>Answers</th><th>Column</th><th>Answers</th></tr>
    <tr><td>${c('digest')}</td><td>which session? never the token (1.3)</td><td>${c('auth_at')}</td><td>password last proven (3.3)</td></tr>
    <tr><td>${c('expires_at')}</td><td>end, no matter what</td><td>${c('ip')}, ${c('user_agent')}</td><td>“is this you?” (Ch 5)</td></tr>
    <tr><td>${c('last_seen_at')}</td><td>idle too long?</td><td>index ${c('user_id')}</td><td>sign out everywhere</td></tr></table>` },
  { t: 'Two timeouts, one fake clock', body: sh(body('31-timeouts'), { title: 'node demo3/timeouts.mjs' }) +
      two(box('Idle (30 min)', 'Bình walked away: 31 min without a request ⇒ signed out. Protects a lab PC someone forgot to lock.', 'lam'),
        box('Absolute (12 h)', 'An was active all day and still signed out at 19:00. Caps the life of a stolen cookie. OWASP: 4–8 h for an office day; LabFlow’s day is 07:00–19:00.', 'lam')) },
  { t: 'The check, in load()', body: js(LOAD, { sm: true, hl: [7, 9] }) +
      box('Order matters', 'Expired ⇒ <b>delete the row</b> and <b>clear the cookie</b>; only a live session is touched — and only once a minute.', 'xanh') },
  { t: 'Touching last_seen: a write per request?', body: sh(body('31-touch'), { title: 'node demo3/touch-cost.mjs 4800 && … 4803' }) +
      cards([
        ['Port 4803', c('TOUCH_EVERY_MS=0') + ': <b>1,000 UPDATEs</b> for 1,000 reads; median 2.06 ms'],
        ['Port 4800', 'touch at most once a minute: <b>0 UPDATEs</b>; median 1.74 ms'],
        ['Cost of throttling', 'idle time is known to ±60 s — irrelevant next to 30 min'],
      ], 3) + box('Why writes matter', 'An UPDATE creates a new row version in PostgreSQL (MVCC) that VACUUM must clean, and WAL that replicas must replay. A read-heavy endpoint should stay a read.', 'lam') },
  { t: 'Sign out everywhere', body: sh(body('31-devices'), { title: 'bash demo3/devices.sh' }) +
      two(box('One statement', c('DELETE FROM sessions WHERE user_id = $1') + ' — the index on user_id keeps it fast for any number of users.', 'xanh'),
        box('Where it is used', 'password changed (3.3), account compromised, “log out of all devices” button, an admin disabling a user.', 'lam')) },
  { t: 'Trap: an expiry the server never checks', body: two(steps([
      'Cookie ' + c('Max-Age=43200') + ' only tells the <b>browser</b> when to forget',
      'A copied cookie (curl, another machine) ignores Max-Age completely',
      'So the server must compare ' + c('expires_at') + ' and ' + c('last_seen_at') + ' itself, on every request',
    ]), box('And the opposite trap', 'A server that checks expiry but never deletes the row keeps a table full of dead sessions — and “active sessions” numbers that lie. load() deletes on expiry.', 'do2')) },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Session = a row on the server + a random token in a cookie; revocation = one DELETE</li>
    <li>Store the <b>digest</b>; each column answers one production question</li>
    <li>Idle 30 min <b>and</b> absolute 12 h, checked by the server</li>
    <li>Touch last_seen at most once a minute: 1,000 → 0 writes</li>
    <li>Next — 3.2: every cookie attribute, in real Chromium</li></ul>` },
]);
