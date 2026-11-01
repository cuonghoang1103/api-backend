/**
 * auth-03-4 — Authentication · Chapter 3 · Lesson 3.4 "CSRF, and the three defences ranked" (01/11/2026).
 * Slug bài: auth-3-4-csrf. Output = s03/_ma.mjs (Chromium 156 thật, trang kẻ tấn công 127.0.0.1:4801; LabFlow ID v0.3).
 */
import { lamDeck, js, sh, two, box, cards, steps, flow, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s03/_ma.mjs';

export const deck = { key: 'auth-03-4', code: 'AUTH 3.4', title: 'CSRF, and the three defences ranked', sub: 'SameSite, Fetch Metadata, a synchronizer token' };
const body = (k) => OUT[k].split('\n').slice(1).join('\n');
const L = CODE.layer.split('\n');
const CSRF = L.slice(L.findIndex((l) => l.includes('function csrf(')), L.findIndex((l) => l.includes('return { start'))).join('\n').replace(/ +\/\/.*$/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 3 — Sessions and cookies', bai: '3.4' }, [
  { cover: true, t: 'CSRF, and the three<br>defences ranked', sub: 'Chapter 3 · Lesson 3.4 — SameSite, Fetch Metadata, a synchronizer token' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why the browser’s own helpfulness makes CSRF possible</li>
    <li>Five configurations attacked from another site, in real Chromium</li>
    <li>Why CORS is <b>not</b> a CSRF defence</li>
    <li>Three defences, ranked: SameSite → Fetch Metadata/Origin → token</li>
    <li>What LabFlow ID v0.3 runs, and the request it lets through on purpose</li></ul>` },
  { t: 'A signed form in someone else’s envelope', body: cards([
      ['The trick', 'a stranger mails your bank a transfer form — <b>with your signature stamp on it</b>, because your stamp travels with every letter from your house'],
      ['The bank', 'checks the stamp, not who wrote the letter'],
      ['On the web', 'the browser attaches the session cookie to <b>any</b> request to the site, whoever caused it'],
    ], 3) + flow([
      { t: 'An is signed in', s: 'cookie in the browser' },
      { t: 'opens evil page', s: '127.0.0.1:4801', mau: '#c62828' },
      { t: 'page sends POST', s: 'to /email', mau: '#c62828' },
      { t: 'browser adds cookie?', s: 'that is the question' },
    ], { h: 150 }) + box('Cross-Site Request Forgery', 'The attacker does not read anything and does not need your password. He only needs a page you open while signed in elsewhere — and a server that cannot tell who caused the request.', 'do2') },
  { t: 'Five configurations, one attacker page', body: sh(body('34-csrf'), { title: 'node demo3/csrf-matrix.mjs  (Chromium 156 · target localhost:4802)', sm: true }) +
      box('How to read it', 'The attacker never sees a response — he does not need to. “CHANGED” means An’s email is now his, and with it the password-reset link (Chapter 6).', 'lam') +
      cards([
        ['attacker form', 'an auto-submitting form-encoded POST: a top-level navigation'],
        ['attacker fetch', c("fetch(…, { mode: 'no-cors', credentials: 'include' })") + ' — a background request'],
        ['An’s own form', 'the real settings page, same origin — must keep working'],
      ], 3) },
  { t: 'Reading the matrix', body: `<table class="t"><tr><th>Configuration</th><th>Result</th><th>Why</th></tr>
    <tr><td>SameSite=None, no defence</td><td><b>form and fetch CHANGED</b></td><td>the browser sends the cookie on everything</td></tr>
    <tr><td>SameSite not set, no defence</td><td><b>form CHANGED</b>, fetch 401</td><td>the 2-minute top-level-POST exception (3.2)</td></tr>
    <tr><td>SameSite=Lax, no defence</td><td>401 / 401</td><td>no cookie on cross-site POST</td></tr>
    <tr><td>None + Fetch Metadata</td><td>403 / 403</td><td>the server reads ${c('Sec-Fetch-Site: cross-site')}</td></tr>
    <tr><td>None + synchronizer token</td><td>403 / 403</td><td>the attacker cannot know the token</td></tr></table>` +
    box('And An’s own form?', '200 in every row: a defence that also blocks the real user is not a defence, it is an outage.', 'xanh') },
  { t: 'CORS is not a CSRF defence', body: two(steps([
      'The attacker’s ' + c("fetch(…, { mode: 'no-cors' })") + ' gets an <b>opaque</b> response — CORS hides it',
      'But the request was <b>sent</b>, with the cookie, and the server <b>acted</b>',
      'Row 1: fetch ⇒ 200 CHANGED. CORS protects reading, not writing',
    ]), box('Simple requests skip the preflight', 'A form-encoded POST, a text/plain POST and GETs are “simple”: the browser sends them without asking the server first. Only non-simple requests (JSON content type, custom headers) are preflighted.', 'do2')) },
  { t: 'Layer 2: Fetch Metadata, with an Origin fallback', body: js(`function csrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const site = req.headers['sec-fetch-site'];        // sent by every modern browser
  if (site) return site === 'same-origin' || site === 'none'
    ? next() : res.status(403).json({ error: 'CROSS_SITE_REQUEST' });
  const origin = req.headers.origin;                 // fallback for older browsers
  if (origin && !origins.includes(origin)) return res.status(403).json(…);
  next();                                            // no browser metadata: not a CSRF vector
}`, { sm: true, hl: [3, 6] }) +
      sh(body('34-v03'), { title: 'bash demo3/csrf-v03.sh  (LabFlow ID v0.3)', sm: true }) },
  { t: 'Why same-site is rejected too', body: cards([
      [c('same-origin'), 'our own pages — allowed'],
      [c('same-site'), 'a sibling subdomain (<code>blog.labflow.example</code>) — <b>rejected</b>: SameSite does not separate them'],
      [c('cross-site'), 'any other site — rejected'],
      ['no Sec-Fetch-Site', 'an old browser still sends <b>Origin</b> on a cross-site POST ⇒ checked; no header at all = curl or a mobile app, not a CSRF vector'],
    ], 2) },
  { t: 'Layer 3: a synchronizer token', body: js(`const KEY = randomBytes(32);                                  // per process
const csrfToken = (sid) => createHmac('sha256', KEY).update(sid).digest('base64url');
// GET /settings renders: <input type="hidden" name="csrf" value="\${csrfToken(sid)}">
// POST /email:
if (!safeEqual(req.body.csrf ?? '', csrfToken(sid)))
  return res.status(403).send('bad csrf token');`, { hl: [2, 5] }) +
      cards([
        ['Bound to the session', 'HMAC(server key, session id) — another user’s token is useless'],
        ['Put in the page', 'a hidden form field; the attacker’s page cannot read your page (same-origin policy)'],
        ['Checked in constant time', c('safeEqual') + ' from lesson 1.3'],
      ], 3) },
  { t: 'Ranked: which defence, when', body: `<table class="t"><tr><th>#</th><th>Defence</th><th>Cost</th><th>Gaps</th></tr>
    <tr><td>1</td><td>${c('SameSite=Lax')} (or Strict)</td><td>one attribute</td><td>same-site subdomains, old browsers, unset = 2-min window</td></tr>
    <tr><td>2</td><td>Fetch Metadata + Origin check</td><td>~10 lines, no state</td><td>none in modern browsers; keep the Origin fallback</td></tr>
    <tr><td>3</td><td>synchronizer token</td><td>a token in every form</td><td>needs the page to render it; XSS reads it</td></tr></table>` +
    box('LabFlow ID v0.3', 'Layers 1 + 2 everywhere. Layer 3 when a form must work for browsers without Fetch Metadata. And XSS defeats all three (OWASP) — 3.2.', 'lam') },
  { t: 'It happened: ING Direct, 2008', body: cards([
      ['Who', 'William Zeller and Edward Felten (Princeton), “Cross-Site Request Forgeries: Exploitation and Prevention”'],
      ['What', 'a page could make a signed-in ING Direct customer open a new account and <b>transfer funds</b> into the attacker’s account'],
      ['Also', 'YouTube, MetaFilter and the New York Times had CSRF holes; all fixed after disclosure'],
    ], 3) + box('Still the pattern', 'No password, no XSS, no malware: a page the victim visited while signed in somewhere else.', 'do2') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>CSRF = another site causes a request; the browser adds the cookie</li>
    <li>Measured: None ⇒ CHANGED; unset ⇒ form CHANGED; Lax ⇒ 401; Fetch Metadata / token ⇒ 403</li>
    <li>CORS hides responses — the write still happens</li>
    <li>v0.3: SameSite=Lax + Sec-Fetch-Site/Origin; token where needed</li>
    <li>Next — 3.5: where should the session live?</li></ul>` },
]);
