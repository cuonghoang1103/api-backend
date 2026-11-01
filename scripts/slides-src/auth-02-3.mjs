/**
 * auth-02-3 — Authentication · Chapter 2 · Lesson 2.3 "The login flow, with every branch equal" (01/11/2026).
 * Slug bài: auth-2-3-luong-dang-nhap. Output = s02/_ma.mjs (LabFlow ID v0.2 trên :4800, bản ngây thơ :4802, PostgreSQL 17.11, env -i).
 */
import { lamDeck, js, sh, two, box, cards, steps, c, vsd } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s02/_ma.mjs';

export const deck = { key: 'auth-02-3', code: 'AUTH 2.3', title: 'The login flow, with every branch equal', sub: 'Same answer, same work, same bytes' };
const body = (k) => OUT[k].split('\n').slice(1).join('\n');
const SI = CODE.signin.split('\n');
const SIGNIN = SI.slice(SI.findIndex((l) => l.startsWith('const DUMMY')), SI.length).join('\n').replace(/ *\/\/.*$/gm, '').replace(/\/\*\*.*\*\/\n/g, '').trim();
const LOG = OUT['23-log'].split('\n').slice(1).map((l) => {
  const j = JSON.parse(l);
  return `{"path":"${j.path}","status":${j.status},"ms":${j.ms},…,"body":${JSON.stringify(j.body)}}`;
}).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 2 — Passwords', bai: '2.3' }, [
  { cover: true, t: 'The login flow,<br>with every branch equal', sub: 'Chapter 2 · Lesson 2.3 — same answer, same work, same bytes' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why “same error message” is not enough — <b>the clock</b> answers too</li>
    <li>A dummy hash that makes “no such email” cost one real verify</li>
    <li>Same password, two keyboards: <b>NFC</b> normalisation</li>
    <li>Limits on input, and a log line even for rejected requests</li>
    <li>A <b>pepper</b>: what it buys, what it costs</li></ul>` },
  { t: 'A receptionist who checks too fast', body: cards([
      ['The question', '“Is Mr. Bình staying here?” — a good hotel says <b>“I can’t tell you”</b> to everyone'],
      ['The tell', 'but it answers in 1 second when there is no Bình and 10 seconds when it looked him up'],
      ['Your sign-in', 'same 401 body for both cases — and a 2 ms vs 86 ms reply'],
    ], 3) + box('Why it matters', 'A list of which emails have accounts is the first step of credential stuffing (Chapter 10) and phishing that names the right service.', 'lam') },
  { t: 'The tutorial version: one message, early return', body: js(`app.post('/sign-in', async (req, res) => {
  const user = await users.findByEmail(String(req.body.email).toLowerCase());
  if (!user) return res.status(401).json({ error: 'Email or password is incorrect' }); // no hash
  const { ok } = await verifyPassword(user.passwordHash, req.body.password);
  if (!ok) return res.status(401).json({ error: 'Email or password is incorrect' });`, { sm: true, hl: [3] }) +
      two(sh(body('23-naive'), { title: 'node demo2/timing-signin.mjs 4802 (×2)', sm: true }),
      box('37× and 39×', 'Same status, same JSON. “No such email” returns before any hashing (2.2 ms); a real account pays argon2id (86 ms). Node.js 8.1 measured 27.4× with its own parameters — same leak.', 'do2'), 'r64') +
      cards([
        ['60 requests per case', 'alternating, over HTTP, medians — two runs, both ~38×'],
        ['What the attacker learns', 'nobody@ … has no account; an@ … does'],
        ['Cost of the attack', 'one request per email — no password needed'],
      ], 3) },
  { t: 'LabFlow ID v0.2: a dummy hash for the missing user', body: js(SIGNIN, { sm: true, hl: [1, 8, 9] }) +
      two(sh(body('23-v02'), { title: 'node demo2/timing-signin.mjs 4800 (×2)', sm: true }),
      box('Every branch does the same work', '“No user” verifies against <b>DUMMY</b> — hashed at startup with today’s PARAMS — so both cases cost one real argon2id verify: <b>1.0×</b>.', 'xanh'), 'r64') },
  { t: 'Branches that still differ — and why that is fine', body: `<table class="t"><tr><th>Branch</th><th>Extra work</th><th>Leaks?</th></tr>
    <tr><td>success + old hash ⇒ rehash</td><td>one more hash</td><td>no — the attacker already has the password</td></tr>
    <tr><td>password longer than 128</td><td>none (rejected first)</td><td>no — the length is the attacker’s own input</td></tr>
    <tr><td>row hashed with cheaper params (bcrypt-10, m=19 MiB)</td><td>less</td><td><b>yes</b>: “this account has not signed in since…” ⇒ lesson 2.5 wraps every row now</td></tr>
    <tr><td>account disabled / must change password</td><td>decide <b>after</b> verify</td><td>only to whoever knows the password</td></tr></table>` +
    box('Rule', 'Decide anything account-specific only <b>after</b> the password verified. Before that, every path costs one verify and returns one answer.', 'lam') },
  { t: 'Same password, two Vietnamese keyboards', body: sh(body('23-unicode'), { title: 'node demo2/unicode.mjs' }) +
      two(box('Dựng sẵn vs tổ hợp', 'Unikey/EVKey can type “ì” as one code point (U+00EC) or as “i” + U+0300. Same picture, <b>25 vs 27 bytes</b>, different hash.', 'do2'),
        box('NIST SP 800-63B-4', 'Verifiers <b>SHOULD apply NFC</b> before hashing — not NFKC. ' + c("password.normalize('NFC')") + ' on sign-up and on sign-in.', 'xanh')) },
  { t: 'Input limits: what a long password really costs', body: two(sh(body('23-long'), { title: 'node demo2/long-password.mjs' }),
      `<div>${box('argon2 pre-hashes', '10,000,000 chars cost 121 ms vs 85 ms for 16 — hashing is not the danger here. (PBKDF2-style hashes are different: Django 2013.)', 'lam')}${box('The real limit is the body', `${c("express.json({ limit: '8kb' })")} — a 20 kB sign-in gets <b>413</b>, before any JSON parsing. Policy: ≤ 128 chars.`, 'xanh')}</div>`, 'r46') },
  { t: 'v0.2 in action — and the log line of a 413', body: sh(body('23-signin'), { title: 'bash demo2/sign-in-tries.sh' }) +
      sh(LOG, { title: 'server log (pino) — fields cut with …', sm: true }) +
      box('requestLog BEFORE express.json()', 'The body parser throws 413 before later middleware runs. Mounted first, the logger still writes a line (body null). Passwords stay [redacted] (lesson 1.5).', 'lam') },
  { t: 'A pepper: a key the database never sees', body: js(`const PEPPER = Buffer.from(process.env.PASSWORD_PEPPER, 'base64url'); // 32 bytes, NOT in the DB
const peppered = (pw) => createHmac('sha256', PEPPER).update(pw.normalize('NFC')).digest('base64');
const row = await argon2.hash(peppered('123456'), PARAMS);                // what users.password_hash holds`, { sm: true, hl: [2] }) +
      sh(body('23-pepper'), { title: 'node demo2/pepper.mjs', sm: true }) + two(
      box('Buys', 'A leaked <b>table alone</b> (SQL injection, a backup) is useless: 0 of 20 guesses match, not even 123456.', 'xanh'),
      box('Costs', 'Lose the key ⇒ <b>nobody</b> can sign in. Leak it with the table ⇒ no gain. Rotating it needs every user to sign in again.', 'do2')) },
  { t: 'Pepper or not? LabFlow ID’s decision', body: vsd(`<ul><li>NIST says SHOULD, in a hardware-protected area</li><li>OWASP: defence in depth, never alone</li><li>Real value when DB and app servers are separated</li></ul>`,
      `<ul><li>v0.2: <b>no pepper</b> — one VPS runs both DB and app, so they leak together</li><li>Chapter 11 adds key management (kid, rotation, KMS) first</li><li>Then a pepper is one line: ${c('hmac(key, pw)')} before argon2</li></ul>`, 'For', 'Our call, and why') +
      box('Not a substitute', 'A pepper never replaces a slow hash: the day the key leaks you are back to argon2id alone.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>One message is not enough: early return = <b>37–39×</b> timing gap; dummy hash ⇒ <b>1.0×</b></li>
    <li>Decide account-specific things only after the verify</li>
    <li>${c("normalize('NFC')")} both sides; trim + lower-case the email</li>
    <li>Body limit 8 kB, logger before the parser, no stack traces</li>
    <li>Pepper = defence in depth, needs key management (Ch 11)</li>
    <li>Next — 2.4: which passwords to refuse in the first place</li></ul>` },
]);
