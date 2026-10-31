/**
 * api-06-4 — API Design · Chapter 6 · Lesson 6.4 "CORS, CSRF and browsers" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s06-bao-mat.mjs › api-6-4-cors. Output = chạy thật curl + Chromium (Playwright) + log server.
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 6 — Security for APIs', bai: '6.4' };

export const deck = { key: 'api-06-4', code: 'API 6.4', title: 'CORS, CSRF and browsers', sub: 'A browser rule the server opts into — measured in Chromium' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'CORS, CSRF<br>and browsers', sub: 'The red “blocked by CORS policy” line —<br>what it protects, and what it does not.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Origins, same-origin policy, simple requests and <b>preflight</b></li>
<li>A CORS allow-list with <code class="i">Vary</code> and <code class="i">Expose-Headers</code></li>
<li>Measured in <b>Chromium</b>: what was blocked, what still reached the server</li>
<li>The reflect-with-credentials mistake, and CSRF</li>
<li>Why curl never shows a CORS error</li>
</ul>` },

  { t: 'Origins and the same-origin policy', to: true, giua: true, body: two(`
<ul>
<li><b>Origin</b> = scheme + host + port: <code class="i">:5173</code>, <code class="i">:5174</code> and <code class="i">:4000</code> are three origins</li>
<li>A page may <b>send</b> requests anywhere, but by default may not <b>read</b> responses from another origin</li>
<li><b>CORS</b> (WHATWG Fetch standard): the server tells the browser which origins may read</li>
</ul>`, box('Simple requests', 'GET, form-like POST, no custom headers: <b>sent</b>; the browser decides afterwards whether the page may read.', 'lam') +
  box('Preflight', 'JSON body, <code class="i">Authorization</code>, PATCH, DELETE: an <code class="i">OPTIONS</code> request first. No permission ⇒ the real request is never sent.', 'xanh'), 'r46') },

  { t: 'Build it: an allow-list, never “*”', body: two(sql(`// cors.js (condensed)
export function cors(req, res, next) {
  const origin = req.get('Origin');
  res.vary('Origin');
  if (!origin) return next();
  const ok = ALLOWED.includes(origin);   // the allow-list
  if (ok) res.set('Access-Control-Allow-Origin', origin)
    .set('Access-Control-Expose-Headers', EXPOSE);
  const preflight = req.method === 'OPTIONS'
    && req.get('Access-Control-Request-Method');
  if (!preflight) return next();
  if (ok) res.set('Access-Control-Allow-Methods', '…')
    .set('Access-Control-Allow-Headers', ALLOW_HEADERS)
    .set('Access-Control-Max-Age', '600');
  res.status(204).end();
}`, { lang: 'javascript', sm: true, hl: [4, 6, 7] }) + box('Expose-Headers', 'Without it browser code cannot read Location, ETag, RateLimit, Deprecation — the headers of Chapters 1–5.', 'lam'), http(`$ curl -si -X OPTIONS …/v2/auth/login -H 'Origin: http://localhost:5173' -H 'Access-Control-Request-Method: POST' … | grep …
HTTP/1.1 204 No Content
Vary: Origin
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Expose-Headers: Location, ETag, Link, Retry-After, RateLimit, …
Access-Control-Allow-Methods: GET, HEAD, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type, Idempotency-Key, If-Match, …
Access-Control-Max-Age: 600

$ … same preflight from http://localhost:5174 …
HTTP/1.1 204 No Content
Vary: Origin

$ curl -si …/v2/labs -H 'Origin: http://localhost:5174' | grep …
HTTP/1.1 200 OK
Vary: Origin`, { sm: true, wrap: 'any' })) },

  { t: 'A real browser: Chromium via Playwright', body: two(http(`$ node web/browser.mjs
page http://localhost:5173
  GET /v2/labs: 200
  POST /v2/auth/login: 200, token received
page http://localhost:5174
  GET /v2/labs: TypeError: Failed to fetch
  POST /v2/auth/login: TypeError: Failed to fetch
  console: Access to fetch at 'http://localhost:4000/v2/labs' from origin
    'http://localhost:5174' has been blocked by CORS policy: No 'Access-Control-Allow-Origi…
  console: Access to fetch at 'http://localhost:4000/v2/auth/login' from origin
    'http://localhost:5174' has been blocked by CORS policy: Response to preflight re…`, { sm: true, wrap: 'any', title: 'terminal (long console lines wrapped)' }), http(`# LABFLOW_LOG=1 — every request that REACHED the server
GET /v2/labs origin=http://localhost:5173
OPTIONS /v2/auth/login origin=http://localhost:5173
POST /v2/auth/login origin=http://localhost:5173
GET /v2/labs origin=http://localhost:5174
OPTIONS /v2/auth/login origin=http://localhost:5174`, { sm: true, title: 'server log' }) + box('Read the log', 'The stranger’s <b>GET reached the server</b> and was answered; the browser only hid it. The JSON POST stopped at the preflight.', 'do2') + box('So', 'CORS protects <b>users’ browsers</b>, not your server. curl and attackers ignore it — auth (6.1, 6.2) protects the server.', 'xanh'), 'r46') },

  { t: 'The dangerous mistake, and CSRF', to: true, body: two(http(`# reflect any origin + credentials (LABFLOW_VULN=1)
$ curl -si …/v2/labs -H 'Origin: https://evil.example' | grep -E '^(HTTP|Access-Control-Allow)'
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true`, { wrap: 'any' }) + box('Every website now reads your users’ data', 'Browsers refuse <code class="i">*</code> with credentials for exactly this reason; reflecting the origin bypasses the guard.', 'do2'), `
<p style="margin-top:0"><b>CSRF</b>: a stranger’s page makes the browser send a request that carries the user’s <b>cookies automatically</b> — a form that POSTs “cancel booking”.</p>
<ul>
<li>LabFlow sends the token in <code class="i">Authorization</code>: browsers never add it on their own ⇒ classic CSRF arrives without credentials</li>
<li>Cookie sessions (6.1)? <code class="i">SameSite=Lax/Strict</code>, <code class="i">HttpOnly</code>, <code class="i">Secure</code>, anti-CSRF token</li>
</ul>`, 'r46') },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ “Fixing” CORS for a curl error', 'curl does not do CORS. If curl fails, the problem is elsewhere.'],
    ['✗ Origin as authentication', 'Any non-browser client can send any Origin. It is a browser signal, not an identity.'],
    ['✗ <code class="i">Access-Control-Allow-Origin: *</code> on an authenticated API', 'Plus credentials it is refused; reflected, it leaks. ✓ An explicit allow-list.'],
  ]) },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“What does CORS protect against?”', 'Other sites’ scripts reading your users’ data in the browser. Not requests to your server.'],
    ['“What is a preflight?”', 'An OPTIONS request the browser sends before non-simple requests to ask for permission.'],
    ['“CORS vs CSRF?”', 'CSRF abuses automatically sent cookies; bearer tokens, SameSite cookies and anti-CSRF tokens prevent it.'],
  ]) + box('At work', 'A front-end teammate reports “CORS error”: read the server log first — did the request arrive, and what did the preflight answer?', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>CORS = a browser rule the server opts into: <b>allow-list</b>, never <code class="i">*</code>, <code class="i">Vary: Origin</code></li>
<li>Expose the headers clients need</li>
<li>Measured in Chromium: the stranger’s <b>GET reached the server</b>; the JSON POST stopped at the preflight</li>
<li>Reflecting origins with credentials hands data to every site</li>
<li>Bearer tokens avoid classic CSRF; cookie apps need SameSite + tokens</li>
</ul>
${box('Next', 'Lab 6 — security review: find it, prove it, close it.', 'xanh')}` },
]);
