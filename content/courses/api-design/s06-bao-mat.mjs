/**
 * API Design — Chương 6: Bảo mật cho API (soạn chi tiết 01/11/2026).
 * Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, Zod 4.6.7, curl 8.7.1, jq 1.7.1, Chromium qua Playwright — đăng nhập scrypt + JWT HS256 tự dựng (sửa payload, alg none, hết hạn, dò mật khẩu),
 * BOLA biên nhận + ma trận phân quyền, bộ kiểm OWASP API Top 10 (2023) chế độ có lỗ hổng/đã vá, SSRF, CORS trong trình duyệt thật.
 * Mã cuối chương = lời giải Lab 6 (bài 6.5). Slide: api-06-1 … api-06-4 + api-lab-6; giảng EN/VI ở ./giang/.
 * Tệp được sinh một lần bằng script ngoài repo — từ nay SỬA THẲNG tệp này, giữ luật thoát ký tự (_HOP-DONG.md mục 3).
 * GIỮ slug cũ api-6-1-xac-thuc, api-6-2-phan-quyen, api-6-3-owasp-api, api-6-4-cors và title chương.
 */

import G061 from './giang/api-06-1.mjs';
import G062 from './giang/api-06-2.mjs';
import G063 from './giang/api-06-3.mjs';
import G064 from './giang/api-06-4.mjs';
import GL6 from './giang/api-lab-6.mjs';

export default {
  title: 'Chapter 6 — Security for APIs|||Chương 6 — Bảo mật cho API',
  description: 'Xác thực thật (scrypt, JWT HS256 tự dựng và bị tấn công, API key, giới hạn đăng nhập, so session/JWT/OAuth), BOLA và ma trận phân quyền, OWASP API Top 10 (2023) thành bộ kiểm tự động kèm chống SSRF và giới hạn luồng nghiệp vụ, CORS/CSRF đo bằng trình duyệt thật; lab soát bảo mật có rubric, quiz 10 câu.',
  lessons: [
    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — Authentication: sessions, JWT, API keys, OAuth — built and attacked|||6.1 — Xác thực: session, JWT, API key, OAuth — tự dựng rồi tự tấn công',
      slug: 'api-6-1-xac-thuc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mật khẩu băm scrypt, đăng nhập cấp JWT 15 phút, tấn công bằng sửa payload, alg none, hết hạn, dò mật khẩu; API key cho script; production không có token giả.',
      content: `${G061}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Authentication options: sessions, JWT, API keys, OAuth</h2>
<p class="lead">Since Chapter 1 LabFlow has trusted a fake header — <code>Bearer tok_an</code> — and anybody who knew the string was An. This lesson replaces it with real authentication: passwords stored as scrypt hashes, a login that issues a signed JWT for 15 minutes, API keys for scripts, and a clear answer to the interview question “sessions or JWT?”. Then we attack our own tokens.</p>

<div class="callout ok">
<p><strong>After Chapter 6 you can:</strong></p>
<ul>
  <li>add real authentication: hashed passwords, short-lived JWTs, API keys;</li>
  <li>find and fix object-level authorisation bugs (BOLA) and prove the fix;</li>
  <li>check an API against the OWASP API Security Top 10 automatically;</li>
  <li>configure CORS correctly and explain CSRF.</li>
</ul>
<p><strong>Why it matters:</strong> Most API breaches are design mistakes, not clever hacks — this chapter attacks LabFlow first, then closes every hole it finds.</p>
</div>

<h3>Four ways to say who you are</h3>
<table>
  <thead><tr><th>Option</th><th>What the client holds</th><th>Server state</th><th>Good for</th><th>Watch out</th></tr></thead>
  <tbody>
    <tr><td>Session + cookie</td><td>random session id in a cookie</td><td>session store</td><td>web apps on one site; instant logout</td><td>CSRF (6.4), shared store when scaling</td></tr>
    <tr><td>JWT access token</td><td>signed token with claims (<code>sub</code>, <code>role</code>, <code>exp</code>)</td><td>none per request</td><td>APIs, mobile apps, several services</td><td>cannot be revoked before <code>exp</code> ⇒ keep it short</td></tr>
    <tr><td>API key</td><td>long random secret</td><td>hashed keys</td><td>scripts, server-to-server</td><td>no expiry by default; rotate, scope</td></tr>
    <tr><td>OAuth 2.0 / OIDC</td><td>tokens issued by an identity provider</td><td>at the provider</td><td>“Log in with Google/FPT”, third-party apps</td><td>complex — use a library and Authorization Code + PKCE</td></tr>
  </tbody>
</table>
<p>LabFlow keeps it simple and standard: <strong>JWT access tokens</strong> (RFC 7519) for people, <strong>API keys</strong> for scripts. OAuth 2.0 (RFC 6749) with PKCE (RFC 7636) is how you would add “Log in with your university account” later: the app never sees the password, the identity provider issues the tokens.</p>

<h3>Passwords: never stored, only hashed</h3>
<pre><code class="language-javascript">// passwords.js — bài 6.1: băm mật khẩu bằng scrypt (có sẵn trong node:crypto, chậm có chủ đích, có salt)
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return &#96;scrypt$\${salt.toString('hex')}$\${hash.toString('hex')}&#96;;
}

export function verifyPassword(password, stored) {
  const [, saltHex, hashHex] = stored.split('$');
  const hash = scryptSync(password, Buffer.from(saltHex, 'hex'), 32);
  return timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));       // so trong thời gian không đổi
}</code></pre>
<p><code>scrypt</code> is built into Node, deliberately slow and memory-hungry, and salted — two users with the same password get different hashes. <code>timingSafeEqual</code> compares in constant time. (bcrypt and Argon2 are equally good choices; plain SHA-256 is not — it is fast, which is what a password guesser wants.)</p>

<h3>Login and the JWT</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">POST /auth/login</span><span class="lz-t">email + password</span><span class="lz-d">limit 5 per 900 s per (IP, email)</span></div>
  <div class="lz-step"><span class="lz-k">verify</span><span class="lz-t">scrypt + timingSafeEqual</span><span class="lz-d">one error for every failure</span></div>
  <div class="lz-step"><span class="lz-k">sign</span><span class="lz-t">HS256 JWT, 15 min</span><span class="lz-d">iss · sub · role · iat · exp</span></div>
  <div class="lz-step"><span class="lz-k">every request</span><span class="lz-t">Authorization: Bearer …</span><span class="lz-d">verify alg, signature, iss, exp ⇒ else 401</span></div>
</div>
<pre><code class="language-javascript">// auth.js (rút gọn) — HS256 = HMAC-SHA256 với một bí mật CHỈ server biết
export function signJwt(user) {
  const iat = Math.floor(now() / 1000);
  const head = b64u({ alg: 'HS256', typ: 'JWT' });
  const body = b64u({ iss: 'labflow', sub: user.id, role: user.role, iat, exp: iat + ACCESS_TTL_SEC });
  return &#96;\${head}.\${body}.\${sign(&#96;\${head}.\${body}&#96;)}&#96;;
}
export function verifyJwt(token) {
  const [head, body, sig] = token.split('.');
  // … đọc header và payload …
  if (h.alg !== 'HS256' || !sig) throw new HttpError(401, 'INVALID_TOKEN');   // thuật toán do SERVER quyết định
  // … so chữ ký bằng timingSafeEqual, kiểm iss …
  if (!(p.exp * 1000 &gt; now())) throw new HttpError(401, 'TOKEN_EXPIRED');
  return p;
}</code></pre>
<pre><code class="language-javascript">// routes/auth.js — bài 6.1: đăng nhập bằng email + mật khẩu ⇒ JWT 15 phút
import { Router } from 'express';
import { z } from 'zod';
import { users } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { validate } from '../validate.js';
import { signJwt, ACCESS_TTL_SEC } from '../auth.js';
import { verifyPassword, hashPassword } from '../passwords.js';
import { rateLimit } from '../rateLimit.js';
import { VULN } from '../vuln.js';

const Login = z.strictObject({ email: z.string().trim().toLowerCase().max(200), password: z.string().min(1).max(200) });
// Dò mật khẩu: tối đa 5 lần mỗi 15 phút cho MỘT cặp (IP, email)
const loginLimit = rateLimit({ name: 'login', capacity: 5, windowSec: 900,
  key: (req) =&gt; &#96;\${req.ip}|\${String(req.body?.email ?? '').toLowerCase()}&#96; });
const DUMMY = hashPassword('không-ai-có-mật-khẩu-này');            // để email lạ cũng tốn đúng một lần scrypt

export const authRouter = Router();
authRouter.route('/login')
  .post(...(VULN ? [] : [loginLimit]), validate('body', Login), (req, res) =&gt; {
    const { email, password } = req.valid.body;
    const user = users.find((u) =&gt; u.email === email);
    const ok = verifyPassword(password, user?.passwordHash ?? DUMMY) &amp;&amp; user;
    if (!ok) throw new HttpError(401, 'INVALID_CREDENTIALS');     // CÙNG một câu cho email sai và mật khẩu sai
    res.set('Cache-Control', 'no-store')
      .json({ accessToken: signJwt(user), tokenType: 'Bearer', expiresIn: ACCESS_TTL_SEC });
  })
  .all(onlyAllow('POST'));</code></pre>
<p>(<code>VULN</code> is the Lab 6 switch that re-opens holes on purpose; ignore it until then.)</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"an@student.labflow.example","password":"an-lab-2026"}' | tee an.json | jq -c '{tokenType, expiresIn, accessToken: (.accessToken[0:24] + "…")}'</code></pre>
<div class="out">{"tokenType":"Bearer","expiresIn":900,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5…"}</div>
<pre><code class="language-bash">jq -r .accessToken an.json &gt; an.jwt; cut -d. -f2 an.jwt | node -e "process.stdin.on('data', (d) =&gt; console.log(Buffer.from(String(d).trim(), 'base64url').toString()))"</code></pre>
<div class="out">{"iss":"labflow","sub":"usr_1","role":"STUDENT","iat":1793480884,"exp":1793481784}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me -H "Authorization: Bearer $(cat an.jwt)" | jq -c .</code></pre>
<div class="out">{"id":"usr_1","name":"Nguyễn Văn An","role":"STUDENT","email":"an@student.labflow.example"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  -H 'Accept-Language: en' \\
  --json '{"email":"an@student.labflow.example","password":"wrong"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":401,"code":"INVALID_CREDENTIALS","detail":"The email or password is incorrect"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  -H 'Accept-Language: en' \\
  --json '{"email":"nobody@labflow.example","password":"wrong"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":401,"code":"INVALID_CREDENTIALS","detail":"The email or password is incorrect"}</div>
<p>Read the payload: <code>sub</code>, <code>role</code>, <code>iat</code>, <code>exp</code> — <strong>anyone can read a JWT</strong>. It is signed, not encrypted: never put secrets in it. A wrong password and an unknown email get the same answer, so the login cannot be used to test which emails exist (and the unknown email still costs one scrypt, so timing does not tell either).</p>

<h3>Attack our own tokens</h3>
<p><code>forge.mjs</code> plays the attacker: change the payload to Lan and keep the old signature, or switch the header to <code>"alg": "none"</code> and drop the signature — a classic flaw in libraries that let the token choose its algorithm (RFC 8725 lists it).</p>
<pre><code class="language-bash">node forge.mjs role an.jwt | cut -d. -f2 | node -e "process.stdin.on('data', (d) =&gt; console.log(Buffer.from(String(d).trim(), 'base64url').toString()))"</code></pre>
<div class="out">{"iss":"labflow","sub":"usr_3","role":"LAB_MANAGER","iat":1793480884,"exp":1793481784}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/admin/deprecations \\
  -H "Authorization: Bearer $(node forge.mjs role an.jwt)" \\
  -H 'Accept-Language: en' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":401,"code":"INVALID_TOKEN","detail":"The token was modified, has a wrong signature or algorithm; log in again"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/admin/deprecations \\
  -H "Authorization: Bearer $(node forge.mjs none an.jwt)" \\
  -H 'Accept-Language: en' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":401,"code":"INVALID_TOKEN"}</div>
<p>Both 401: the signature covers header and payload, and the server, not the token, decides the algorithm. Then a password guesser:</p>
<pre><code class="language-bash">for p in a1 b2 c3 d4 e5 f6; do curl -s -o /dev/null -w '%{http_code} ' -X POST http://localhost:4000/v2/auth/login --json "{\\"email\\":\\"lan@labflow.example\\",\\"password\\":\\"$p\\"}"; done; echo</code></pre>
<div class="out">401 401 401 401 401 429 </div>
<pre><code class="language-bash">curl -s -D - -o /dev/null -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | grep -E '^(HTTP|Retry-After)'</code></pre>
<div class="out">HTTP/1.1 429 Too Many Requests
Retry-After: 180</div>
<p>The login limiter from 5.3 (5 attempts per 15 minutes per IP and email) stops the guessing — and also blocks Lan herself for a few minutes. That is the trade-off: a lockout per (IP, email) limits guessing without letting a stranger lock everyone out from one place.</p>

<h3>Expiry, API keys and production</h3>
<p>The server is restarted with its clock 16 minutes later (<code>LABFLOW_NOW</code>); An’s token from before:</p>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  -H 'Accept-Language: en' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":401,"code":"TOKEN_EXPIRED","detail":"Your session has expired; log in again"}</div>
<p>Short-lived tokens limit the damage of a stolen token; a real app gets a new one with a refresh token or by logging in again. Scripts use API keys instead, shown <strong>once</strong> and stored only as a SHA-256 hash:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | jq -r .accessToken &gt; lan.jwt</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/me/api-keys \\
  -H "Authorization: Bearer $(cat lan.jwt)" | tee lan.key.json | jq -c '{prefix, createdAt, key: (.key[0:12] + "…")}'</code></pre>
<div class="out">{"prefix":"lf_live_fbJE","createdAt":"2026-10-31T21:08:06.093Z","key":"lf_live_fbJE…"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me \\
  -H "Authorization: Bearer $(jq -r .key lan.key.json)" | jq -c '{id, role}'</code></pre>
<div class="out">{"id":"usr_3","role":"LAB_MANAGER"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me/api-keys \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -c .</code></pre>
<div class="out">{"data":[{"prefix":"lf_live_fbJE","createdAt":"2026-10-31T21:08:06.093Z"}]}</div>
<p>And production refuses unsafe defaults: no secret ⇒ the server does not start; the Chapter 1–5 demo tokens are gone.</p>
<pre><code class="language-bash">NODE_ENV=production node src/server.js 2&gt;&amp;1 | grep -m1 '^Error'</code></pre>
<div class="out">Error: LABFLOW_JWT_SECRET is required in production</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":401,"code":"UNAUTHENTICATED"}</div>

<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-5-1-passwords-sessions" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SDN302 — lesson 5.1: passwords, bcrypt, sessions and Passport</span><span class="lc-sub">If you took SDN302 on Academy, the foundations are the same. Same: hash passwords with a slow salted function, never store them, sessions versus stateless tokens. Different: SDN302 uses bcrypt and Passport; here everything is built from node:crypto so you see each step. This lesson adds: a JWT signed and verified by hand, attacks on it (forged payload, alg none, expiry), login rate limiting and API keys. Not taken SDN302? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SDN302 LESSON →</span>
</a>

<div class="pitfall"><p><strong>Trap — JWT in localStorage “because everyone does it”.</strong> Any script injected into the page can read it. For browser apps on your own site an HttpOnly cookie session is often safer; for mobile apps and APIs, short-lived bearer tokens are fine.</p></div>
<div class="pitfall"><p><strong>Trap — long-lived JWTs.</strong> A token valid for 30 days cannot be taken back. Keep access tokens short (LabFlow: 15 minutes).</p></div>

<h3>In interviews and at work</h3>
<p><strong>“Sessions or JWT?”</strong> Sessions: server-side state, instant revocation, cookies — great for one web app. JWT: stateless verification, good for APIs and many services, but short expiry and no instant logout. API keys for machines; OAuth/OIDC when another system owns the identity.</p>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc7519.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 7519 — JSON Web Token (May 2015) — read 1 Nov 2026</span><span class="lc-sub">§4.1.4 exp: “the expiration time on or after which the JWT MUST NOT be accepted for processing”.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc8725.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: RFC 8725 — JWT Best Current Practices (Feb 2020) — read 1 Nov 2026</span><span class="lc-sub">§3.1: libraries must use only the algorithms the caller allows; §3.2: “none” only when the JWT is protected by other means.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
  <li>Add login, JWT and API keys; reproduce the outputs, including both forged tokens.</li>
  <li>Add <code>POST /v2/auth/logout</code> that puts the token’s <code>jti</code> on a deny-list until its <code>exp</code>. What does this cost compared with a stateless JWT?</li>
  <li>Add <code>DELETE /v2/me/api-keys/:prefix</code> and show that a revoked key gets 401 immediately.</li>
</ol>
<p><strong>Done when:</strong> no fake token works in production, a forged or expired JWT gets 401, and guessing passwords ends in 429.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Authentication</span><span class="v">Proving who you are (this lesson); authorisation — what you may do — is 6.2.</span></div>
  <div class="kv"><span class="k">Password hash</span><span class="v">Slow, salted one-way function of the password (scrypt, bcrypt, Argon2).</span></div>
  <div class="kv"><span class="k">JWT</span><span class="v">Base64url header.payload.signature; readable by anyone, unforgeable without the key.</span></div>
  <div class="kv"><span class="k">Claim</span><span class="v">A field in the payload: <code>sub</code>, <code>role</code>, <code>iat</code>, <code>exp</code>, <code>iss</code>.</span></div>
  <div class="kv"><span class="k">API key</span><span class="v">Long random secret for scripts; stored hashed, shown once.</span></div>
  <div class="kv"><span class="k">OAuth 2.0 + PKCE</span><span class="v">Delegated login through an identity provider; the app never sees the password.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Passwords stored as salted scrypt hashes, compared in constant time.</li>
  <li>Login ⇒ HS256 JWT for 15 minutes; same error for wrong email and wrong password.</li>
  <li>Measured: forged payload ⇒ 401, alg none ⇒ 401, expired ⇒ 401, sixth guess ⇒ 429.</li>
  <li>API keys for scripts: shown once, stored as a hash.</li>
  <li>Production starts only with a secret; demo tokens are gone.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-2-jwt-access-refresh" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 8.2 — JWT, refresh tokens and rotation</span><span class="lc-sub">The Node.js course builds this into a real API and measures it. Same: an HS256 access token valid for 15 minutes (900 seconds), forged and alg-none tokens refused. There you add: the token taken apart by hand, decode vs verify, issuer/audience pinned, and refresh tokens with rotation stored as SHA-256 in PostgreSQL. This lesson adds what that one does not: a hand-built HS256 with node:crypto, API keys shown once, and a production server that refuses to start without its secret.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-4-cookie-csrf-thu-hoi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 8.4 — Cookies, CSRF, revocation and rate limiting</span><span class="lc-sub">The Node.js course builds this into a real API and measures it. Same: a login limit: the 6th wrong guess in a row gets 429 with Retry-After. There you add: the limit keyed on IP + email (another email from the same IP still gets in), counting before verifying (the right password is 429 too), and trust proxy run with a spoofed X-Forwarded-For (true lets 8 out of 8 through). This lesson adds what that one does not: the price of the limit for the real user (Retry-After 180: she waits three minutes too) inside a whole authentication design.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-1-4-bam-mac-chu-ky" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper in the Authentication course — lesson 1.4: hash, MAC, signature</span><span class="lc-sub">Same: HS256 is HMAC-SHA256 with a secret only the server knows. That lesson adds: what each of hash, MAC and signature proves, a real length-extension forgery against sha256(secret + message), why a shared HMAC key lets every verifier mint tokens (Ed25519 instead), and AES-CTR flipping admin:false to true while GCM refuses.</span></span>
  <span class="lc-cta">OPEN AUTHENTICATION LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-1-1-tin-vat-mang-theo" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper in the Authentication course — lesson 1.1: whoever holds it, is you</span><span class="lc-sub">Same: a JWT, an API key and a session are bearer credentials, so a short lifetime (15 minutes here) limits a stolen one. That lesson measures it on LabFlow ID: a copied token works from another machine and browser, a reset token in the URL lands in the access log, and which Referrer-Policy leaks it to a third party in Chromium 156.</span></span>
  <span class="lc-cta">OPEN AUTHENTICATION LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-2-3-luong-dang-nhap" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper in the Authentication course — lesson 2.3: the login flow, with every branch equal</span><span class="lc-sub">Same: passwords are hashed, never stored, and one login endpoint answers. Deeper: that lesson measures what the login route itself leaks — the same 401 body for both failures still differs 37–39× in time until a dummy hash closes it (1.0×) — and adds Unicode NFC, input limits (413 before parsing) and an honest look at peppers. It also tunes the hash by measurement (lesson 2.2), where scryptSync at Node’s defaults would not pass.</span></span>
  <span class="lc-cta">OPEN AUTHENTICATION LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-2-truong-alg" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper in the Authentication course — lesson 4.2: the token tells the server how to check it</span><span class="lc-sub">Same: HS256 is HMAC-SHA256 with the server’s secret, built by hand, as a bearer token. Deeper: that chapter dissects a JWT byte by byte, runs the alg:none and HS/RS confusion forgeries against a real verifier (both return ALG_MISMATCH), and moves to public-key (EdDSA) signing with a JWKS so other services verify without ever holding the secret.</span></span>
  <span class="lc-cta">OPEN AUTHENTICATION LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Các cách xác thực: session, JWT, API key, OAuth</h2>
<p class="lead">Từ Chương 1, LabFlow tin một header giả — <code>Bearer tok_an</code> — và ai biết chuỗi đó thì là An. Bài này thay nó bằng xác thực thật: mật khẩu lưu dạng băm scrypt, đăng nhập cấp một JWT có chữ ký sống 15 phút, API key cho script, và một câu trả lời rõ ràng cho câu phỏng vấn “session hay JWT?”. Rồi ta tự tấn công chính token của mình.</p>

<div class="callout ok">
<p><strong>Học xong Chương 6 bạn làm được:</strong></p>
<ul>
  <li>thêm xác thực thật: mật khẩu băm, JWT sống ngắn, API key;</li>
  <li>tìm và vá lỗi phân quyền theo đối tượng (BOLA) và chứng minh bản vá;</li>
  <li>kiểm một API theo OWASP API Security Top 10 một cách tự động;</li>
  <li>cấu hình CORS đúng và giải thích CSRF.</li>
</ul>
<p><strong>Vì sao đáng học:</strong> Phần lớn vụ lộ dữ liệu qua API là lỗi thiết kế, không phải tấn công tinh vi — chương này tấn công LabFlow trước, rồi đóng mọi lỗ nó tìm ra.</p>
</div>

<h3>Bốn cách nói “tôi là ai”</h3>
<table>
  <thead><tr><th>Cách</th><th>Client giữ gì</th><th>Trạng thái ở server</th><th>Hợp với</th><th>Cẩn thận</th></tr></thead>
  <tbody>
    <tr><td>Session + cookie</td><td>mã phiên ngẫu nhiên trong cookie</td><td>kho phiên</td><td>web app trên một site; đăng xuất tức thì</td><td>CSRF (6.4), kho dùng chung khi mở rộng</td></tr>
    <tr><td>JWT access token</td><td>token có chữ ký mang claim (<code>sub</code>, <code>role</code>, <code>exp</code>)</td><td>không cần mỗi request</td><td>API, app di động, nhiều dịch vụ</td><td>không thu hồi được trước <code>exp</code> ⇒ để ngắn</td></tr>
    <tr><td>API key</td><td>chuỗi bí mật ngẫu nhiên dài</td><td>khoá đã băm</td><td>script, máy gọi máy</td><td>mặc định không hết hạn; xoay vòng, giới hạn quyền</td></tr>
    <tr><td>OAuth 2.0 / OIDC</td><td>token do nhà cung cấp danh tính cấp</td><td>ở nhà cung cấp</td><td>“Đăng nhập bằng Google/FPT”, app bên thứ ba</td><td>phức tạp — dùng thư viện, Authorization Code + PKCE</td></tr>
  </tbody>
</table>
<p>LabFlow chọn đơn giản và chuẩn: <strong>JWT access token</strong> (RFC 7519) cho người, <strong>API key</strong> cho script. OAuth 2.0 (RFC 6749) với PKCE (RFC 7636) là cách bạn thêm “Đăng nhập bằng tài khoản trường” sau này: app không bao giờ thấy mật khẩu, nhà cung cấp danh tính cấp token.</p>

<h3>Mật khẩu: không bao giờ lưu, chỉ băm</h3>
<pre><code class="language-javascript">// passwords.js — bài 6.1: băm mật khẩu bằng scrypt (có sẵn trong node:crypto, chậm có chủ đích, có salt)
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return &#96;scrypt$\${salt.toString('hex')}$\${hash.toString('hex')}&#96;;
}

export function verifyPassword(password, stored) {
  const [, saltHex, hashHex] = stored.split('$');
  const hash = scryptSync(password, Buffer.from(saltHex, 'hex'), 32);
  return timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));       // so trong thời gian không đổi
}</code></pre>
<p><code>scrypt</code> có sẵn trong Node, chậm và tốn bộ nhớ có chủ đích, và có salt — hai người cùng mật khẩu nhận hai bản băm khác nhau. <code>timingSafeEqual</code> so sánh trong thời gian không đổi. (bcrypt và Argon2 cũng tốt như vậy; SHA-256 trần thì không — nó nhanh, đúng thứ kẻ dò mật khẩu muốn.)</p>

<h3>Đăng nhập và JWT</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">POST /auth/login</span><span class="lz-t">email + mật khẩu</span><span class="lz-d">giới hạn 5 lần / 900 giây theo (IP, email)</span></div>
  <div class="lz-step"><span class="lz-k">kiểm</span><span class="lz-t">scrypt + timingSafeEqual</span><span class="lz-d">một lỗi chung cho mọi trường hợp sai</span></div>
  <div class="lz-step"><span class="lz-k">ký</span><span class="lz-t">JWT HS256, 15 phút</span><span class="lz-d">iss · sub · role · iat · exp</span></div>
  <div class="lz-step"><span class="lz-k">mỗi request</span><span class="lz-t">Authorization: Bearer …</span><span class="lz-d">kiểm alg, chữ ký, iss, exp ⇒ sai thì 401</span></div>
</div>
<pre><code class="language-javascript">// auth.js (rút gọn) — HS256 = HMAC-SHA256 với một bí mật CHỈ server biết
export function signJwt(user) {
  const iat = Math.floor(now() / 1000);
  const head = b64u({ alg: 'HS256', typ: 'JWT' });
  const body = b64u({ iss: 'labflow', sub: user.id, role: user.role, iat, exp: iat + ACCESS_TTL_SEC });
  return &#96;\${head}.\${body}.\${sign(&#96;\${head}.\${body}&#96;)}&#96;;
}
export function verifyJwt(token) {
  const [head, body, sig] = token.split('.');
  // … đọc header và payload …
  if (h.alg !== 'HS256' || !sig) throw new HttpError(401, 'INVALID_TOKEN');   // thuật toán do SERVER quyết định
  // … so chữ ký bằng timingSafeEqual, kiểm iss …
  if (!(p.exp * 1000 &gt; now())) throw new HttpError(401, 'TOKEN_EXPIRED');
  return p;
}</code></pre>
<pre><code class="language-javascript">// routes/auth.js — bài 6.1: đăng nhập bằng email + mật khẩu ⇒ JWT 15 phút
import { Router } from 'express';
import { z } from 'zod';
import { users } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { validate } from '../validate.js';
import { signJwt, ACCESS_TTL_SEC } from '../auth.js';
import { verifyPassword, hashPassword } from '../passwords.js';
import { rateLimit } from '../rateLimit.js';
import { VULN } from '../vuln.js';

const Login = z.strictObject({ email: z.string().trim().toLowerCase().max(200), password: z.string().min(1).max(200) });
// Dò mật khẩu: tối đa 5 lần mỗi 15 phút cho MỘT cặp (IP, email)
const loginLimit = rateLimit({ name: 'login', capacity: 5, windowSec: 900,
  key: (req) =&gt; &#96;\${req.ip}|\${String(req.body?.email ?? '').toLowerCase()}&#96; });
const DUMMY = hashPassword('không-ai-có-mật-khẩu-này');            // để email lạ cũng tốn đúng một lần scrypt

export const authRouter = Router();
authRouter.route('/login')
  .post(...(VULN ? [] : [loginLimit]), validate('body', Login), (req, res) =&gt; {
    const { email, password } = req.valid.body;
    const user = users.find((u) =&gt; u.email === email);
    const ok = verifyPassword(password, user?.passwordHash ?? DUMMY) &amp;&amp; user;
    if (!ok) throw new HttpError(401, 'INVALID_CREDENTIALS');     // CÙNG một câu cho email sai và mật khẩu sai
    res.set('Cache-Control', 'no-store')
      .json({ accessToken: signJwt(user), tokenType: 'Bearer', expiresIn: ACCESS_TTL_SEC });
  })
  .all(onlyAllow('POST'));</code></pre>
<p>(<code>VULN</code> là công tắc của Lab 6 để cố ý mở lại lỗ hổng; tạm bỏ qua tới lúc đó.)</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"an@student.labflow.example","password":"an-lab-2026"}' | tee an.json | jq -c '{tokenType, expiresIn, accessToken: (.accessToken[0:24] + "…")}'</code></pre>
<div class="out">{"tokenType":"Bearer","expiresIn":900,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5…"}</div>
<pre><code class="language-bash">jq -r .accessToken an.json &gt; an.jwt; cut -d. -f2 an.jwt | node -e "process.stdin.on('data', (d) =&gt; console.log(Buffer.from(String(d).trim(), 'base64url').toString()))"</code></pre>
<div class="out">{"iss":"labflow","sub":"usr_1","role":"STUDENT","iat":1793480884,"exp":1793481784}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me -H "Authorization: Bearer $(cat an.jwt)" | jq -c .</code></pre>
<div class="out">{"id":"usr_1","name":"Nguyễn Văn An","role":"STUDENT","email":"an@student.labflow.example"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  -H 'Accept-Language: en' \\
  --json '{"email":"an@student.labflow.example","password":"wrong"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":401,"code":"INVALID_CREDENTIALS","detail":"The email or password is incorrect"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  -H 'Accept-Language: en' \\
  --json '{"email":"nobody@labflow.example","password":"wrong"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":401,"code":"INVALID_CREDENTIALS","detail":"The email or password is incorrect"}</div>
<p>Đọc payload: <code>sub</code>, <code>role</code>, <code>iat</code>, <code>exp</code> — <strong>ai cũng đọc được JWT</strong>. Nó được ký chứ không được mã hoá: không bao giờ đặt bí mật vào đó. Sai mật khẩu và email không tồn tại nhận cùng một câu trả lời, để không ai dùng màn đăng nhập dò xem email nào có thật (email lạ vẫn tốn một lần scrypt, nên thời gian trả lời cũng không lộ).</p>

<h3>Tấn công chính token của mình</h3>
<p><code>forge.mjs</code> đóng vai kẻ tấn công: sửa payload thành cô Lan mà giữ chữ ký cũ, hoặc đổi header thành <code>"alg": "none"</code> và bỏ chữ ký — lỗi kinh điển của những thư viện để token tự chọn thuật toán (RFC 8725 có liệt kê).</p>
<pre><code class="language-bash">node forge.mjs role an.jwt | cut -d. -f2 | node -e "process.stdin.on('data', (d) =&gt; console.log(Buffer.from(String(d).trim(), 'base64url').toString()))"</code></pre>
<div class="out">{"iss":"labflow","sub":"usr_3","role":"LAB_MANAGER","iat":1793480884,"exp":1793481784}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/admin/deprecations \\
  -H "Authorization: Bearer $(node forge.mjs role an.jwt)" \\
  -H 'Accept-Language: en' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":401,"code":"INVALID_TOKEN","detail":"The token was modified, has a wrong signature or algorithm; log in again"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/admin/deprecations \\
  -H "Authorization: Bearer $(node forge.mjs none an.jwt)" \\
  -H 'Accept-Language: en' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":401,"code":"INVALID_TOKEN"}</div>
<p>Cả hai đều 401: chữ ký bao cả header lẫn payload, và server chứ không phải token quyết định thuật toán. Rồi một kẻ dò mật khẩu:</p>
<pre><code class="language-bash">for p in a1 b2 c3 d4 e5 f6; do curl -s -o /dev/null -w '%{http_code} ' -X POST http://localhost:4000/v2/auth/login --json "{\\"email\\":\\"lan@labflow.example\\",\\"password\\":\\"$p\\"}"; done; echo</code></pre>
<div class="out">401 401 401 401 401 429 </div>
<pre><code class="language-bash">curl -s -D - -o /dev/null -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | grep -E '^(HTTP|Retry-After)'</code></pre>
<div class="out">HTTP/1.1 429 Too Many Requests
Retry-After: 180</div>
<p>Bộ giới hạn đăng nhập theo kiểu bài 5.3 (5 lần mỗi 15 phút cho mỗi cặp IP và email) chặn việc dò — và cũng chặn chính cô Lan vài phút. Đó là sự đánh đổi: khoá theo (IP, email) hạn chế dò mà không để người lạ từ một chỗ khoá được tất cả mọi người.</p>

<h3>Hết hạn, API key và production</h3>
<p>Server được khởi động lại với đồng hồ chạy trước 16 phút (<code>LABFLOW_NOW</code>); token của An từ trước đó:</p>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  -H 'Accept-Language: en' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":401,"code":"TOKEN_EXPIRED","detail":"Your session has expired; log in again"}</div>
<p>Token sống ngắn giới hạn thiệt hại khi bị đánh cắp; app thật lấy token mới bằng refresh token hoặc đăng nhập lại. Script thì dùng API key, chỉ hiện <strong>một lần</strong> và chỉ lưu dạng băm SHA-256:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | jq -r .accessToken &gt; lan.jwt</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/me/api-keys \\
  -H "Authorization: Bearer $(cat lan.jwt)" | tee lan.key.json | jq -c '{prefix, createdAt, key: (.key[0:12] + "…")}'</code></pre>
<div class="out">{"prefix":"lf_live_fbJE","createdAt":"2026-10-31T21:08:06.093Z","key":"lf_live_fbJE…"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me \\
  -H "Authorization: Bearer $(jq -r .key lan.key.json)" | jq -c '{id, role}'</code></pre>
<div class="out">{"id":"usr_3","role":"LAB_MANAGER"}</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me/api-keys \\
  -H "Authorization: Bearer $(cat lan.jwt)" | jq -c .</code></pre>
<div class="out">{"data":[{"prefix":"lf_live_fbJE","createdAt":"2026-10-31T21:08:06.093Z"}]}</div>
<p>Và production từ chối mặc định không an toàn: thiếu bí mật ⇒ server không khởi động; token giả của Chương 1–5 biến mất.</p>
<pre><code class="language-bash">NODE_ENV=production node src/server.js 2&gt;&amp;1 | grep -m1 '^Error'</code></pre>
<div class="out">Error: LABFLOW_JWT_SECRET is required in production</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me \\
  -H 'Authorization: Bearer tok_lan' | jq -c '{status, code}'</code></pre>
<div class="out">{"status":401,"code":"UNAUTHENTICATED"}</div>

<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-5-1-passwords-sessions" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp ở SDN302 — bài 5.1: mật khẩu, bcrypt, session và Passport</span><span class="lc-sub">Nếu bạn đã học SDN302 ở Academy, nền tảng là một. Giống: băm mật khẩu bằng hàm chậm có salt, không bao giờ lưu mật khẩu, session so với token không trạng thái. Khác: SDN302 dùng bcrypt và Passport; ở đây mọi thứ dựng từ node:crypto để thấy từng bước. Bài này thêm: JWT ký và kiểm bằng tay, tấn công nó (sửa payload, alg none, hết hạn), giới hạn đăng nhập và API key. Chưa học SDN302? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SDN302 →</span>
</a>

<div class="pitfall"><p><strong>Bẫy — để JWT trong localStorage “vì ai cũng làm thế”.</strong> Bất kỳ script nào bị chèn vào trang đều đọc được. Với web app trên chính site của mình, session bằng cookie HttpOnly thường an toàn hơn; với app di động và API, bearer token sống ngắn là ổn.</p></div>
<div class="pitfall"><p><strong>Bẫy — JWT sống lâu.</strong> Token có hạn 30 ngày thì không lấy lại được. Giữ access token thật ngắn (LabFlow: 15 phút).</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“Session hay JWT?”</strong> Session: trạng thái ở server, thu hồi tức thì, dùng cookie — rất hợp với một web app. JWT: kiểm không cần trạng thái, hợp với API và nhiều dịch vụ, nhưng phải hết hạn ngắn và không đăng xuất tức thì được. API key cho máy; OAuth/OIDC khi danh tính thuộc về một hệ thống khác.</p>

<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc7519.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 7519 — JSON Web Token (5/2015) — đọc ngày 1/11/2026</span><span class="lc-sub">§4.1.4 exp: “thời điểm hết hạn mà từ đó trở đi JWT KHÔNG ĐƯỢC chấp nhận để xử lý”.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<a class="link-card" href="https://www.rfc-editor.org/rfc/rfc8725.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: RFC 8725 — JWT Best Current Practices (2/2020) — đọc ngày 1/11/2026</span><span class="lc-sub">§3.1: thư viện chỉ được dùng thuật toán bên gọi cho phép; §3.2: “none” chỉ khi JWT được bảo vệ bằng cách khác.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm đăng nhập, JWT và API key; chạy lại các output, gồm cả hai token giả.</li>
  <li>Thêm <code>POST /v2/auth/logout</code> đưa <code>jti</code> của token vào danh sách cấm tới khi hết <code>exp</code>. So với JWT không trạng thái, việc này tốn gì?</li>
  <li>Thêm <code>DELETE /v2/me/api-keys/:prefix</code> và chứng minh khoá đã thu hồi nhận 401 ngay lập tức.</li>
</ol>
<p><strong>Xong khi:</strong> không token giả nào chạy ở production, JWT bị sửa hay hết hạn nhận 401, và dò mật khẩu kết thúc bằng 429.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Authentication (xác thực)</span><span class="v">Chứng minh bạn là ai (bài này); phân quyền — bạn được làm gì — là bài 6.2.</span></div>
  <div class="kv"><span class="k">Password hash (băm mật khẩu)</span><span class="v">Hàm một chiều chậm, có salt (scrypt, bcrypt, Argon2).</span></div>
  <div class="kv"><span class="k">JWT</span><span class="v">header.payload.chữ_ký dạng base64url; ai cũng đọc được, không có khoá thì không giả được.</span></div>
  <div class="kv"><span class="k">Claim</span><span class="v">Một trường trong payload: <code>sub</code>, <code>role</code>, <code>iat</code>, <code>exp</code>, <code>iss</code>.</span></div>
  <div class="kv"><span class="k">API key</span><span class="v">Chuỗi bí mật ngẫu nhiên dài cho script; lưu dạng băm, hiện một lần.</span></div>
  <div class="kv"><span class="k">OAuth 2.0 + PKCE</span><span class="v">Đăng nhập uỷ quyền qua nhà cung cấp danh tính; app không bao giờ thấy mật khẩu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mật khẩu lưu dạng băm scrypt có salt, so trong thời gian không đổi.</li>
  <li>Đăng nhập ⇒ JWT HS256 sống 15 phút; cùng một lỗi cho email sai và mật khẩu sai.</li>
  <li>Đo được: sửa payload ⇒ 401, alg none ⇒ 401, hết hạn ⇒ 401, lần dò thứ sáu ⇒ 429.</li>
  <li>API key cho script: hiện một lần, lưu dạng băm.</li>
  <li>Production chỉ khởi động khi có bí mật; token giả đã biến mất.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-2-jwt-access-refresh" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 8.2 — JWT, refresh token và xoay vòng</span><span class="lc-sub">Khoá Node.js dựng đúng phần này vào một API thật và đo nó. Giống: access token HS256 sống 15 phút (900 giây), token giả và token alg none bị từ chối. Ở đó học thêm: mổ token bằng tay, decode và verify, chốt issuer/audience, và refresh token xoay vòng lưu dạng SHA-256 trong PostgreSQL. Bài này có thứ bài kia không có: tự dựng HS256 bằng node:crypto, API key chỉ hiện một lần, và server production không chịu khởi động khi thiếu bí mật.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-4-cookie-csrf-thu-hoi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 8.4 — Cookie, CSRF, thu hồi phiên và chặn dò mật khẩu</span><span class="lc-sub">Khoá Node.js dựng đúng phần này vào một API thật và đo nó. Giống: giới hạn đăng nhập: lần đoán sai thứ 6 liên tiếp nhận 429 kèm Retry-After. Ở đó học thêm: giới hạn theo IP + email (email khác cùng IP vẫn vào được), đếm trước khi kiểm (mật khẩu đúng cũng 429), và trust proxy chạy với X-Forwarded-For giả (true để lọt 8 trên 8). Bài này có thứ bài kia không có: cái giá của giới hạn với người dùng thật (Retry-After 180: chính chủ cũng phải chờ ba phút) trong cả một thiết kế xác thực.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-1-4-bam-mac-chu-ky" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn ở khoá Authentication — bài 1.4: băm, MAC, chữ ký</span><span class="lc-sub">Giống: HS256 là HMAC-SHA256 với bí mật chỉ server biết. Bài đó thêm: băm, MAC và chữ ký mỗi thứ chứng minh điều gì, một cú giả length extension thật với sha256(secret + thông điệp), vì sao khoá HMAC dùng chung cho mọi bên kiểm cũng phát được token (thay bằng Ed25519), và AES-CTR lật admin:false thành true còn GCM từ chối.</span></span>
  <span class="lc-cta">MỞ BÀI AUTHENTICATION →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-1-1-tin-vat-mang-theo" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn ở khoá Authentication — bài 1.1: ai cầm nó, người đó LÀ bạn</span><span class="lc-sub">Giống: JWT, API key và phiên đều là tín vật bearer, nên tuổi thọ ngắn (ở đây 15 phút) giới hạn thiệt hại khi bị cắp. Bài đó đo trên LabFlow ID: token bị chép chạy được từ máy và trình duyệt khác, token đặt lại nằm trong URL rơi vào access log, và Referrer-Policy nào làm nó rò sang bên thứ ba trong Chromium 156.</span></span>
  <span class="lc-cta">MỞ BÀI AUTHENTICATION →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-2-3-luong-dang-nhap" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn ở khoá Authentication — bài 2.3: luồng đăng nhập, với mọi nhánh bằng nhau</span><span class="lc-sub">Giống: mật khẩu chỉ băm, không bao giờ lưu, và một endpoint đăng nhập trả lời. Sâu hơn: bài đó đo chính route đăng nhập rò gì — cùng một nội dung 401 cho cả hai kiểu thất bại mà thời gian vẫn chênh 37–39× cho tới khi băm giả bịt lại (1,0×) — rồi thêm chuẩn hoá Unicode NFC, giới hạn đầu vào (413 trước khi đọc) và cái nhìn thẳng thắn về pepper. Bài 2.2 còn chỉnh hàm băm bằng phép đo, chỗ mà scryptSync với mặc định của Node không qua được.</span></span>
  <span class="lc-cta">MỞ BÀI AUTHENTICATION →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-4-2-truong-alg" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn ở khoá Authentication — bài 4.2: cái token tự nói cho máy chủ cách kiểm nó</span><span class="lc-sub">Giống: HS256 là HMAC-SHA256 với bí mật của máy chủ, dựng bằng tay, làm một bearer token. Sâu hơn: chương đó mổ một JWT từng byte, chạy cú giả mạo alg:none và nhầm lẫn HS/RS trước một bộ xác minh thật (đều trả ALG_MISMATCH), rồi chuyển sang ký bằng khoá công khai (EdDSA) với một JWKS để dịch vụ khác xác minh mà không bao giờ phải giữ bí mật.</span></span>
  <span class="lc-cta">MỞ BÀI AUTHENTICATION →</span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-7-1-auth-basics" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 7.1 — authentication vs authorization</span><span class="lc-sub">HTTP forgets you, Base64 is not encryption, 401 then 403 on a real app</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-7-1-auth-basics" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 7.1 — xác thực và phân quyền</span><span class="lc-sub">HTTP quên bạn, Base64 không phải mã hoá, 401 rồi 403 trên app thật</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — Authorisation and object-level access (BOLA): exploit, fix, matrix|||6.2 — Phân quyền và truy cập theo đối tượng (BOLA): khai thác, vá, ma trận',
      slug: 'api-6-2-phan-quyen',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Endpoint biên nhận viết nhanh lộ tên và email người khác; vá bằng một bảng chính sách và 404; ma trận mọi người dùng × mọi lượt đặt từ 8 ô sai còn 0.',
      content: `${G062}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Authorisation and object-level access (BOLA)</h2>
<p class="lead">6.1 answered <em>who</em> is calling. This lesson answers <em>what they may touch</em> — and the most common API vulnerability of all lives exactly here. OWASP puts it first in the API Security Top 10 (2023): <strong>Broken Object Level Authorization</strong>. The request is authenticated, the endpoint is allowed, but the <em>record</em> belongs to someone else. We add a feature with this bug, exploit it, fix it in one place, and write a test that tries every user against every record.</p>

<h3>Three levels of “may I?”</h3>
<ul>
  <li><strong>Function level</strong> — may a student call <code>PATCH /devices/:id</code> at all? (<code>requireRole</code>, since Chapter 1; OWASP API5)</li>
  <li><strong>Object level</strong> — may Bin read <em>this</em> booking, <code>bk_1</code>? (OWASP API1, this lesson)</li>
  <li><strong>Property level</strong> — may An change <em>this field</em>, <code>role</code>? (OWASP API3; strict schemas and views of Chapter 2, revisited in 6.3)</li>
</ul>
<p>Object level is the easy one to forget, because every test you write with your own account passes.</p>

<h3>The new feature, written the quick way</h3>
<p>Students want a receipt to show at the lab door: <code>GET /v2/bookings/:id/receipt</code>, with the lab, the time — and the student’s name and email. The quick version checks the login (the router has <code>requireAuth</code>) and loads the booking by id. That is all. With the lab switch <code>LABFLOW_VULN=1</code> LabFlow behaves exactly like that:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"binh@student.labflow.example","password":"binh-lab-2026"}' | jq -r .accessToken &gt; bin.jwt</code></pre>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/bookings/bk_1/receipt \\
  -H "Authorization: Bearer $(cat bin.jwt)"</code></pre>
<div class="out">{
  "bookingId": "bk_1",
  "lab": {
    "code": "AL-201",
    "name": "Phòng Lab Mạng máy tính"
  },
  "student": {
    "name": "Nguyễn Văn An",
    "email": "an@student.labflow.example"
  },
  "period": {
    "start": "2026-11-02T00:00:00.000Z",
    "end": "2026-11-02T02:00:00.000Z"
  },
  "status": "PENDING"
}</div>
<p>Bin, logged in correctly, reads An’s receipt — her name and email included — by changing one number in the URL. LabFlow ids are sequential (<code>bk_1</code>, <code>bk_2</code>…), so a loop reads everyone’s. Random ids would make guessing harder but fix nothing: ids leak through links, logs and screenshots. The only fix is a check on every object access.</p>

<h3>The fix: one policy, asked everywhere</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">requireAuth</span><span class="lz-t">who is calling?</span><span class="lz-d">no token ⇒ 401</span></div>
  <div class="lz-step"><span class="lz-k">load the record</span><span class="lz-t">by id from the URL</span><span class="lz-d">missing ⇒ 404</span></div>
  <div class="lz-step"><span class="lz-k">authorize()</span><span class="lz-t">POLICIES[action](user, record)</span><span class="lz-d">no rule ⇒ deny</span></div>
  <div class="lz-step"><span class="lz-k">not allowed</span><span class="lz-t">404, like a missing record</span><span class="lz-d">the id reveals nothing</span></div>
</div>
<pre><code class="language-javascript">// policy.js — bài 6.2: MỘT chỗ trả lời "người này có được làm việc này với BẢN GHI này không?"
import { HttpError } from './http.js';
import { VULN } from './vuln.js';

const isManager = (u) =&gt; u.role === 'LAB_MANAGER';
export const POLICIES = {
  'booking:read': (u, b) =&gt; isManager(u) || b.userId === u.id,
  'booking:cancel': (u, b) =&gt; isManager(u) || b.userId === u.id,
  'device:write': (u) =&gt; isManager(u),
  'issue:resolve': (u) =&gt; isManager(u),
};
export const can = (user, action, resource) =&gt; Boolean(POLICIES[action]?.(user, resource));

// Không được ⇒ 404 như thể bản ghi không tồn tại: không lộ cả việc "có lượt đặt bk_2"
export function authorize(req, action, resource, notFound) {
  if (VULN &amp;&amp; action === 'booking:read') return;                  // Lab 6: lỗ BOLA được bật lại để bộ kiểm thấy ĐỎ
  if (!can(req.user, action, resource)) throw notFound;
}</code></pre>
<pre><code class="language-javascript">// routes/bookings.js — biên nhận: tìm bản ghi, rồi HỎI CHÍNH SÁCH trước khi trả bất cứ thứ gì
bookingsRouter.route('/:id/receipt')
  .get((req, res) =&gt; {
    const notFound = new HttpError(404, 'BOOKING_NOT_FOUND', { id: req.params.id });
    const b = bookings.find((x) =&gt; x.id === req.params.id);
    if (!b) throw notFound;
    authorize(req, 'booking:read', b, notFound);                   // không có quyền ⇒ cũng 404
    // … dựng biên nhận …
  })</code></pre>
<p>Two decisions. The rules live in <strong>one table</strong> (<code>POLICIES</code>), not in twenty <code>if</code>s spread over the handlers — when the rule changes, it changes once. And a forbidden record answers <strong>404</strong>, exactly like a missing one, so Bin cannot even learn that <code>bk_1</code> exists. LabFlow’s older <code>GET /bookings/:id</code> keeps its 403 from Chapter 1: changing a status code is a breaking change (lesson 4.1). New endpoints start with 404.</p>

<h3>Prove it for everyone: the authorisation matrix</h3>
<p>One manual test with Bin is not enough. <code>authz-matrix.mjs</code> logs in as every user, requests every booking’s receipt, and compares each answer with the policy (owner or manager ⇒ 200, otherwise 404):</p>
<pre><code class="language-javascript">// authz-matrix.mjs — bài 6.2: thử MỌI người dùng × MỌI lượt đặt trên một endpoint, so với chính sách mong đợi
const BASE = 'http://localhost:4000/v2';
const PEOPLE = [['usr_1', 'an@student.labflow.example', 'an-lab-2026', 'STUDENT'],
  ['usr_2', 'binh@student.labflow.example', 'binh-lab-2026', 'STUDENT'],
  ['usr_3', 'lan@labflow.example', 'lan-lab-2026', 'LAB_MANAGER']];
const login = async (email, password) =&gt;
  (await (await fetch(&#96;\${BASE}/auth/login&#96;, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }) })).json()).accessToken;

const owners = {};                                    // ai sở hữu lượt đặt nào — hỏi bằng tài khoản quản lý
const lan = await login(PEOPLE[2][1], PEOPLE[2][2]);
for (const b of (await (await fetch(&#96;\${BASE}/bookings?limit=100&#96;, { headers: { Authorization: &#96;Bearer \${lan}&#96; } })).json()).data) owners[b.id] = b.userId;
const ids = Object.keys(owners).sort((a, b) =&gt; a.localeCompare(b, 'en', { numeric: true }));

let violations = 0;
for (const [id, email, password, role] of PEOPLE) {
  const token = await login(email, password);
  const cells = [];
  for (const bk of ids) {
    const status = (await fetch(&#96;\${BASE}/bookings/\${bk}/receipt&#96;, { headers: { Authorization: &#96;Bearer \${token}&#96; } })).status;
    const expected = role === 'LAB_MANAGER' || owners[bk] === id ? 200 : 404;
    if (status !== expected) violations++;
    cells.push(&#96;\${bk.slice(3)}:\${status}\${status === expected ? '' : '✗'}&#96;);
  }
  console.log(&#96;\${id} \${role.padEnd(11)} \${cells.join(' ')}&#96;);
}
console.log(violations ? &#96;✗ \${violations} ô sai chính sách&#96; : '✓ 0 ô sai chính sách');</code></pre>
<p>Against the quick version:</p>
<pre><code class="language-bash">node authz-matrix.mjs</code></pre>
<div class="out">usr_1 STUDENT     1:200 2:200✗ 3:200 4:200✗ 5:200 6:200✗ 7:200 8:200✗
usr_2 STUDENT     1:200✗ 2:200 3:200✗ 4:200 5:200✗ 6:200 7:200✗ 8:200
usr_3 LAB_MANAGER 1:200 2:200 3:200 4:200 5:200 6:200 7:200 8:200
✗ 8 ô sai chính sách</div>
<p>Eight cells wrong — every student can read the other student’s bookings. After the fix:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"binh@student.labflow.example","password":"binh-lab-2026"}' | jq -r .accessToken &gt; bin.jwt</code></pre>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/bookings/bk_1/receipt \\
  -H "Authorization: Bearer $(cat bin.jwt)"</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/booking-not-found",
  "title": "Không tìm thấy lượt đặt",
  "status": 404,
  "detail": "Không có lượt đặt bk_1",
  "instance": "/v2/bookings/bk_1/receipt",
  "code": "BOOKING_NOT_FOUND"
}</div>
<pre><code class="language-bash">node authz-matrix.mjs</code></pre>
<div class="out">usr_1 STUDENT     1:200 2:404 3:200 4:404 5:200 6:404 7:200 8:404
usr_2 STUDENT     1:404 2:200 3:404 4:200 5:404 6:200 7:404 8:200
usr_3 LAB_MANAGER 1:200 2:200 3:200 4:200 5:200 6:200 7:200 8:200
✓ 0 ô sai chính sách</div>
<p>Zero wrong cells. Run the matrix in CI for every endpoint that returns one person’s data; it is the test that catches the next BOLA before an attacker does.</p>

<div class="pitfall"><p><strong>Trap — trusting ids from the client.</strong> <code>?userId=usr_2</code>, <code>/users/usr_2/bookings</code>, an <code>ownerId</code> in the body: anything the client sends is a claim, not a fact. The owner comes from the token (<code>req.user</code>), never from the request.</p></div>
<div class="pitfall"><p><strong>Trap — checking in the list but not in the item.</strong> LabFlow’s list already filtered “only mine” (3.3); the receipt endpoint forgot. Every path to an object needs the check.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“What is BOLA and how do you prevent it?”</strong> An authenticated user accesses another user’s object by changing its id. Prevent it with an object-level check on every access, centralised in a policy function, deny-by-default, 404 for objects the caller may not see, and tests that try every role against every object.</p>


<a class="link-card" href="https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: OWASP API Security Top 10 (2023) — API1 Broken Object Level Authorization — read 1 Nov 2026</span><span class="lc-sub">Attackers change an object’s id in the request; prevent it with a policy-based check in every function that uses client input to reach a record, plus tests for the authorisation mechanism.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add the receipt endpoint the quick way, exploit it, then fix it with <code>authorize()</code>; reproduce both matrices.</li>
  <li>Extend the matrix to <code>POST /v2/bookings/:id/cancel</code> using the <code>booking:cancel</code> policy.</li>
  <li>Write the rule “a lab manager may read receipts only for labs in their building” as a policy. What does the record need to carry?</li>
</ol>
<p><strong>Done when:</strong> every object access goes through the policy, and the matrix shows zero wrong cells.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Authorisation</span><span class="v">Deciding what an authenticated caller may do.</span></div>
  <div class="kv"><span class="k">BOLA (API1)</span><span class="v">Broken Object Level Authorization: access to another user’s record by its id.</span></div>
  <div class="kv"><span class="k">BFLA (API5)</span><span class="v">Broken Function Level Authorization: calling an operation your role must not use.</span></div>
  <div class="kv"><span class="k">Policy</span><span class="v">One function or table that answers “may this user do this to this record?”.</span></div>
  <div class="kv"><span class="k">Deny by default</span><span class="v">No rule ⇒ no access.</span></div>
  <div class="kv"><span class="k">Authorisation matrix</span><span class="v">A test of every role against every object, compared with the expected policy.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Measured: with the quick receipt, Bin read An’s name and email; the matrix found 8 wrong cells.</li>
  <li>Fix: one <code>POLICIES</code> table, <code>authorize()</code> on every object access, 404 for hidden records.</li>
  <li>After the fix: 0 wrong cells.</li>
  <li>The owner comes from the token, never from the request; random ids do not replace checks.</li>
  <li>Old endpoints keep their status codes (4.1); new ones use 404.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-3-requireauth-phan-quyen" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 8.3 — requireAuth, roles, and deleting AUTHOR_ID = 1</span><span class="lc-sub">The Node.js course builds this into a real API and measures it. Same: a logged-in user reading another person's record by changing the id, closed by one rule and a 404. There you add: requireAuth with six machine-readable refusals run on a real server, the user lookup it costs (0.026 → 0.664 ms), middleware order run for real (a route silently public), and the quick service vs canTouch with the same script. This lesson adds what that one does not: a policy table with deny-by-default and a matrix that logs in as everyone and asks for everything (8 wrong cells → 0).</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-0-2-ba-bai-toan" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper in the Authentication course — lesson 0.2: three problems hiding in the word “login”</span><span class="lc-sub">Same: a signed-in user changes an id and reads someone else’s record; the fix lives in the lookup and answers 404. That lesson adds: identification, authentication and authorization as three separate gates on LabFlow ID — a claimed X-User-Id accepted as anyone, an IDOR scan of usr_1…usr_4, and the 401/403/404 matrix for four callers.</span></span>
  <span class="lc-cta">OPEN AUTHENTICATION LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Phân quyền và truy cập theo đối tượng (BOLA)</h2>
<p class="lead">Bài 6.1 trả lời <em>ai</em> đang gọi. Bài này trả lời <em>người đó được đụng vào cái gì</em> — và lỗ hổng API phổ biến nhất nằm đúng ở đây. OWASP xếp nó đầu bảng API Security Top 10 (2023): <strong>Broken Object Level Authorization</strong> (phân quyền theo đối tượng bị hỏng). Request đã xác thực, endpoint được phép gọi, nhưng <em>bản ghi</em> thuộc về người khác. Ta thêm một tính năng mang lỗi này, khai thác nó, sửa ở một chỗ, và viết một test thử mọi người dùng với mọi bản ghi.</p>

<h3>Ba tầng “tôi có được không?”</h3>
<ul>
  <li><strong>Tầng chức năng</strong> — sinh viên có được gọi <code>PATCH /devices/:id</code> không? (<code>requireRole</code>, từ Chương 1; OWASP API5)</li>
  <li><strong>Tầng đối tượng</strong> — Bin có được đọc <em>lượt đặt này</em>, <code>bk_1</code>, không? (OWASP API1, bài này)</li>
  <li><strong>Tầng thuộc tính</strong> — An có được đổi <em>trường này</em>, <code>role</code>, không? (OWASP API3; lược đồ strict và view của Chương 2, quay lại ở 6.3)</li>
</ul>
<p>Tầng đối tượng là thứ dễ quên nhất, vì mọi test bạn viết bằng chính tài khoản của mình đều qua.</p>

<h3>Tính năng mới, viết kiểu nhanh</h3>
<p>Sinh viên muốn có biên nhận để đưa ở cửa phòng lab: <code>GET /v2/bookings/:id/receipt</code>, có phòng, giờ — và tên cùng email của sinh viên. Bản viết nhanh kiểm đăng nhập (router có <code>requireAuth</code>) rồi tìm lượt đặt theo id. Hết. Với công tắc của lab <code>LABFLOW_VULN=1</code>, LabFlow hành xử y như vậy:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"binh@student.labflow.example","password":"binh-lab-2026"}' | jq -r .accessToken &gt; bin.jwt</code></pre>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/bookings/bk_1/receipt \\
  -H "Authorization: Bearer $(cat bin.jwt)"</code></pre>
<div class="out">{
  "bookingId": "bk_1",
  "lab": {
    "code": "AL-201",
    "name": "Phòng Lab Mạng máy tính"
  },
  "student": {
    "name": "Nguyễn Văn An",
    "email": "an@student.labflow.example"
  },
  "period": {
    "start": "2026-11-02T00:00:00.000Z",
    "end": "2026-11-02T02:00:00.000Z"
  },
  "status": "PENDING"
}</div>
<p>Bin, đăng nhập đàng hoàng, đọc được biên nhận của An — kèm tên và email — chỉ bằng cách đổi một con số trên URL. Id của LabFlow là số tăng dần (<code>bk_1</code>, <code>bk_2</code>…), nên một vòng lặp là đọc được của mọi người. Id ngẫu nhiên làm việc đoán khó hơn nhưng không sửa được gì: id rò ra qua link, log và ảnh chụp màn hình. Cách sửa duy nhất là kiểm ở mọi lần truy cập đối tượng.</p>

<h3>Sửa: một chính sách, hỏi ở mọi nơi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">requireAuth</span><span class="lz-t">ai đang gọi?</span><span class="lz-d">không có token ⇒ 401</span></div>
  <div class="lz-step"><span class="lz-k">tải bản ghi</span><span class="lz-t">theo id trong URL</span><span class="lz-d">không có ⇒ 404</span></div>
  <div class="lz-step"><span class="lz-k">authorize()</span><span class="lz-t">POLICIES[action](user, record)</span><span class="lz-d">không có luật ⇒ từ chối</span></div>
  <div class="lz-step"><span class="lz-k">không được phép</span><span class="lz-t">404, như bản ghi không tồn tại</span><span class="lz-d">id không để lộ gì</span></div>
</div>
<pre><code class="language-javascript">// policy.js — bài 6.2: MỘT chỗ trả lời "người này có được làm việc này với BẢN GHI này không?"
import { HttpError } from './http.js';
import { VULN } from './vuln.js';

const isManager = (u) =&gt; u.role === 'LAB_MANAGER';
export const POLICIES = {
  'booking:read': (u, b) =&gt; isManager(u) || b.userId === u.id,
  'booking:cancel': (u, b) =&gt; isManager(u) || b.userId === u.id,
  'device:write': (u) =&gt; isManager(u),
  'issue:resolve': (u) =&gt; isManager(u),
};
export const can = (user, action, resource) =&gt; Boolean(POLICIES[action]?.(user, resource));

// Không được ⇒ 404 như thể bản ghi không tồn tại: không lộ cả việc "có lượt đặt bk_2"
export function authorize(req, action, resource, notFound) {
  if (VULN &amp;&amp; action === 'booking:read') return;                  // Lab 6: lỗ BOLA được bật lại để bộ kiểm thấy ĐỎ
  if (!can(req.user, action, resource)) throw notFound;
}</code></pre>
<pre><code class="language-javascript">// routes/bookings.js — biên nhận: tìm bản ghi, rồi HỎI CHÍNH SÁCH trước khi trả bất cứ thứ gì
bookingsRouter.route('/:id/receipt')
  .get((req, res) =&gt; {
    const notFound = new HttpError(404, 'BOOKING_NOT_FOUND', { id: req.params.id });
    const b = bookings.find((x) =&gt; x.id === req.params.id);
    if (!b) throw notFound;
    authorize(req, 'booking:read', b, notFound);                   // không có quyền ⇒ cũng 404
    // … dựng biên nhận …
  })</code></pre>
<p>Hai quyết định. Luật nằm ở <strong>một bảng</strong> (<code>POLICIES</code>), không rải thành hai mươi câu <code>if</code> khắp các handler — luật đổi thì đổi một chỗ. Và bản ghi bị cấm trả <strong>404</strong>, y như bản ghi không tồn tại, để Bin thậm chí không biết được là có <code>bk_1</code>. <code>GET /bookings/:id</code> cũ của LabFlow vẫn giữ 403 của Chương 1: đổi mã trạng thái là thay đổi phá vỡ (bài 4.1). Endpoint mới thì bắt đầu bằng 404.</p>

<h3>Chứng minh cho mọi người: ma trận phân quyền</h3>
<p>Một test tay với Bin là chưa đủ. <code>authz-matrix.mjs</code> đăng nhập bằng từng người dùng, xin biên nhận của từng lượt đặt, rồi so mỗi câu trả lời với chính sách (chủ hoặc quản lý ⇒ 200, ngược lại 404):</p>
<pre><code class="language-javascript">// authz-matrix.mjs — bài 6.2: thử MỌI người dùng × MỌI lượt đặt trên một endpoint, so với chính sách mong đợi
const BASE = 'http://localhost:4000/v2';
const PEOPLE = [['usr_1', 'an@student.labflow.example', 'an-lab-2026', 'STUDENT'],
  ['usr_2', 'binh@student.labflow.example', 'binh-lab-2026', 'STUDENT'],
  ['usr_3', 'lan@labflow.example', 'lan-lab-2026', 'LAB_MANAGER']];
const login = async (email, password) =&gt;
  (await (await fetch(&#96;\${BASE}/auth/login&#96;, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }) })).json()).accessToken;

const owners = {};                                    // ai sở hữu lượt đặt nào — hỏi bằng tài khoản quản lý
const lan = await login(PEOPLE[2][1], PEOPLE[2][2]);
for (const b of (await (await fetch(&#96;\${BASE}/bookings?limit=100&#96;, { headers: { Authorization: &#96;Bearer \${lan}&#96; } })).json()).data) owners[b.id] = b.userId;
const ids = Object.keys(owners).sort((a, b) =&gt; a.localeCompare(b, 'en', { numeric: true }));

let violations = 0;
for (const [id, email, password, role] of PEOPLE) {
  const token = await login(email, password);
  const cells = [];
  for (const bk of ids) {
    const status = (await fetch(&#96;\${BASE}/bookings/\${bk}/receipt&#96;, { headers: { Authorization: &#96;Bearer \${token}&#96; } })).status;
    const expected = role === 'LAB_MANAGER' || owners[bk] === id ? 200 : 404;
    if (status !== expected) violations++;
    cells.push(&#96;\${bk.slice(3)}:\${status}\${status === expected ? '' : '✗'}&#96;);
  }
  console.log(&#96;\${id} \${role.padEnd(11)} \${cells.join(' ')}&#96;);
}
console.log(violations ? &#96;✗ \${violations} ô sai chính sách&#96; : '✓ 0 ô sai chính sách');</code></pre>
<p>Chạy với bản viết nhanh:</p>
<pre><code class="language-bash">node authz-matrix.mjs</code></pre>
<div class="out">usr_1 STUDENT     1:200 2:200✗ 3:200 4:200✗ 5:200 6:200✗ 7:200 8:200✗
usr_2 STUDENT     1:200✗ 2:200 3:200✗ 4:200 5:200✗ 6:200 7:200✗ 8:200
usr_3 LAB_MANAGER 1:200 2:200 3:200 4:200 5:200 6:200 7:200 8:200
✗ 8 ô sai chính sách</div>
<p>Tám ô sai — sinh viên nào cũng đọc được lượt đặt của sinh viên kia. Sau khi sửa:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"binh@student.labflow.example","password":"binh-lab-2026"}' | jq -r .accessToken &gt; bin.jwt</code></pre>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/bookings/bk_1/receipt \\
  -H "Authorization: Bearer $(cat bin.jwt)"</code></pre>
<div class="out">{
  "type": "https://labflow.example/problems/booking-not-found",
  "title": "Không tìm thấy lượt đặt",
  "status": 404,
  "detail": "Không có lượt đặt bk_1",
  "instance": "/v2/bookings/bk_1/receipt",
  "code": "BOOKING_NOT_FOUND"
}</div>
<pre><code class="language-bash">node authz-matrix.mjs</code></pre>
<div class="out">usr_1 STUDENT     1:200 2:404 3:200 4:404 5:200 6:404 7:200 8:404
usr_2 STUDENT     1:404 2:200 3:404 4:200 5:404 6:200 7:404 8:200
usr_3 LAB_MANAGER 1:200 2:200 3:200 4:200 5:200 6:200 7:200 8:200
✓ 0 ô sai chính sách</div>
<p>Không ô nào sai. Hãy chạy ma trận trong CI cho mọi endpoint trả về dữ liệu của một người; đó là test bắt được BOLA tiếp theo trước kẻ tấn công.</p>

<div class="pitfall"><p><strong>Bẫy — tin id do client gửi.</strong> <code>?userId=usr_2</code>, <code>/users/usr_2/bookings</code>, <code>ownerId</code> trong body: mọi thứ client gửi là một lời khẳng định, không phải sự thật. Chủ sở hữu lấy từ token (<code>req.user</code>), không bao giờ từ request.</p></div>
<div class="pitfall"><p><strong>Bẫy — kiểm ở danh sách mà quên ở từng phần tử.</strong> Danh sách của LabFlow đã lọc “chỉ của tôi” (3.3); endpoint biên nhận thì quên. Mọi đường dẫn tới một đối tượng đều cần phép kiểm.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“BOLA là gì và chống thế nào?”</strong> Người dùng đã xác thực truy cập đối tượng của người khác bằng cách đổi id. Chống bằng phép kiểm theo đối tượng ở mọi lần truy cập, tập trung trong một hàm chính sách, mặc định từ chối, 404 cho đối tượng người gọi không được thấy, và test thử mọi vai trò với mọi đối tượng.</p>


<a class="link-card" href="https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: OWASP API Security Top 10 (2023) — API1 Broken Object Level Authorization — đọc ngày 1/11/2026</span><span class="lc-sub">Kẻ tấn công đổi id đối tượng trong request; chặn bằng kiểm theo chính sách ở mọi hàm dùng đầu vào của client để tới một bản ghi, cộng test cho cơ chế phân quyền.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm endpoint biên nhận kiểu nhanh, khai thác nó, rồi sửa bằng <code>authorize()</code>; chạy lại cả hai ma trận.</li>
  <li>Mở rộng ma trận cho <code>POST /v2/bookings/:id/cancel</code> với chính sách <code>booking:cancel</code>.</li>
  <li>Viết luật “quản lý chỉ đọc được biên nhận của các phòng trong toà nhà mình” thành một chính sách. Bản ghi cần mang thêm gì?</li>
</ol>
<p><strong>Xong khi:</strong> mọi lần truy cập đối tượng đều đi qua chính sách, và ma trận không có ô nào sai.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Authorisation (phân quyền)</span><span class="v">Quyết định người gọi đã xác thực được làm gì.</span></div>
  <div class="kv"><span class="k">BOLA (API1)</span><span class="v">Phân quyền theo đối tượng bị hỏng: truy cập bản ghi của người khác bằng id.</span></div>
  <div class="kv"><span class="k">BFLA (API5)</span><span class="v">Phân quyền theo chức năng bị hỏng: gọi thao tác mà vai trò của bạn không được dùng.</span></div>
  <div class="kv"><span class="k">Policy (chính sách)</span><span class="v">Một hàm hay bảng trả lời “người này có được làm việc này với bản ghi này không?”.</span></div>
  <div class="kv"><span class="k">Deny by default</span><span class="v">Mặc định từ chối: không có luật ⇒ không có quyền.</span></div>
  <div class="kv"><span class="k">Authorisation matrix</span><span class="v">Test mọi vai trò với mọi đối tượng, so với chính sách mong đợi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đo được: với biên nhận viết nhanh, Bin đọc được tên và email của An; ma trận tìm ra 8 ô sai.</li>
  <li>Sửa: một bảng <code>POLICIES</code>, <code>authorize()</code> ở mọi lần truy cập đối tượng, 404 cho bản ghi bị ẩn.</li>
  <li>Sau khi sửa: 0 ô sai.</li>
  <li>Chủ sở hữu lấy từ token, không bao giờ từ request; id ngẫu nhiên không thay được phép kiểm.</li>
  <li>Endpoint cũ giữ mã trạng thái (4.1); endpoint mới dùng 404.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-3-requireauth-phan-quyen" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 8.3 — requireAuth, phân quyền, và xoá bỏ AUTHOR_ID = 1</span><span class="lc-sub">Khoá Node.js dựng đúng phần này vào một API thật và đo nó. Giống: một người đã đăng nhập đọc bản ghi của người khác chỉ bằng cách đổi id, đóng bằng một quy tắc và mã 404. Ở đó học thêm: requireAuth với sáu lần từ chối có mã riêng chạy trên server thật, cái giá của lần tra user (0,026 → 0,664 ms), thứ tự middleware chạy thật (một route công khai nhầm), và bản viết vội so với canTouch bằng cùng một kịch bản. Bài này có thứ bài kia không có: một bảng chính sách mặc định từ chối và một ma trận đăng nhập từng người, hỏi từng bản ghi (8 ô sai → 0).</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-0-2-ba-bai-toan" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn ở khoá Authentication — bài 0.2: ba bài toán trốn trong chữ “đăng nhập”</span><span class="lc-sub">Giống: người đã đăng nhập đổi id là đọc được bản ghi của người khác; cách sửa nằm trong phép tra và trả 404. Bài đó thêm: định danh, xác thực, phân quyền là ba cổng riêng trên LabFlow ID — header X-User-Id tự khai được nhận như ai cũng được, quét IDOR usr_1…usr_4, và ma trận 401/403/404 cho bốn người gọi.</span></span>
  <span class="lc-cta">MỞ BÀI AUTHENTICATION →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — OWASP API Security Top 10 (2023) on LabFlow, as an automatic audit|||6.3 — OWASP API Security Top 10 (2023) trên LabFlow, thành bộ kiểm tự động',
      slug: 'api-6-3-owasp-api',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mười rủi ro ánh xạ lên LabFlow, thêm giới hạn 3 lượt đặt còn hiệu lực (API6) và safeFetch chống SSRF (API7); audit.mjs: 9 FAIL ở chế độ có lỗ hổng, PASS hết khi đã vá.',
      content: `${G063}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>OWASP API Security Top 10</h2>
<p class="lead">OWASP’s <strong>API Security Top 10</strong> (2023 edition, the current one when checked on 1 November 2026) is the list security reviewers, pentesters and interviewers use. Learning ten names is easy; knowing what each looks like in <em>your</em> API is the skill. This lesson maps all ten onto LabFlow, adds the two defences LabFlow still lacked — a business-flow limit and an SSRF guard — and turns the list into an automatic audit that runs real requests.</p>

<h3>The ten, on LabFlow</h3>
<table>
  <thead><tr><th>Risk</th><th>What it looks like</th><th>LabFlow’s defence</th></tr></thead>
  <tbody>
    <tr><td>API1 Broken Object Level Authorization</td><td>Bin reads An’s receipt by id</td><td>policy + 404 (6.2)</td></tr>
    <tr><td>API2 Broken Authentication</td><td>forged/alg-none tokens, password guessing</td><td>signed JWT, fixed algorithm, expiry, login limit (6.1)</td></tr>
    <tr><td>API3 Broken Object Property Level Authorization</td><td>sending <code>role</code>; reading <code>passwordHash</code></td><td>strict schemas in, views out (2.2, 2.3)</td></tr>
    <tr><td>API4 Unrestricted Resource Consumption</td><td><code>limit=1000000</code>, huge bodies, floods</td><td>max 100 (3.1), 10 KB body (2.2), rate limits (5.3)</td></tr>
    <tr><td>API5 Broken Function Level Authorization</td><td>a student calls a manager-only operation</td><td><code>requireRole</code> (1.x) and policies</td></tr>
    <tr><td>API6 Unrestricted Access to Sensitive Business Flows</td><td>a bot books every lab slot</td><td>max 3 active bookings per student (new)</td></tr>
    <tr><td>API7 Server Side Request Forgery</td><td>server fetches a URL the client chose</td><td><code>safeFetch</code>: https only, no private addresses (new)</td></tr>
    <tr><td>API8 Security Misconfiguration</td><td>stack traces, <code>X-Powered-By</code>, CORS <code>*</code></td><td>problem+json without details (2.1), header off, CORS allow-list (6.4)</td></tr>
    <tr><td>API9 Improper Inventory Management</td><td>forgotten old versions still running</td><td>versions + Deprecation/Sunset + usage report (4.2, 4.3)</td></tr>
    <tr><td>API10 Unsafe Consumption of APIs</td><td>trusting data from a third-party API</td><td>LabFlow calls none yet; validate external data like user input</td></tr>
  </tbody>
</table>
<p>Most of the list was already handled by earlier chapters — that is the point: security is mostly good API design applied consistently.</p>

<h3>API6: a business flow that needs a limit</h3>
<p>Rate limits (5.3) count requests per minute. They do not stop a student — or a script — from slowly booking every Monday slot of the semester. The business rule is about state, not speed:</p>
<pre><code class="language-javascript">// routes/bookings.js — một sinh viên giữ tối đa 3 lượt đặt còn hiệu lực
export const MAX_ACTIVE = 3;
    if (req.user.role === 'STUDENT') {
      const active = bookings.filter((b) =&gt; b.userId === req.user.id &amp;&amp; b.status !== 'CANCELLED' &amp;&amp; Date.parse(b.endAt) &gt; now()).length;
      if (active &gt;= MAX_ACTIVE) throw new HttpError(422, 'TOO_MANY_ACTIVE_BOOKINGS', { max: MAX_ACTIVE });
    }</code></pre>

<h3>API7: SSRF</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">URL from the client</span><span class="lz-t">https://…</span><span class="lz-d">other schemes ⇒ 422</span></div>
  <div class="lz-step"><span class="lz-k">resolve DNS</span><span class="lz-t">every address</span><span class="lz-d">names, 127.1, [::1], decimal IPs</span></div>
  <div class="lz-step"><span class="lz-k">private?</span><span class="lz-t">loopback, 10/8, 169.254/16…</span><span class="lz-d">any one ⇒ 422 URL_NOT_ALLOWED</span></div>
  <div class="lz-step"><span class="lz-k">fetch</span><span class="lz-t">redirect: error, 3 s timeout</span><span class="lz-d">never follow a redirect inside</span></div>
</div>
<p>Managers can attach a device manual by URL, and the server fetches it once to check it. That makes the <em>server</em> a client that goes wherever the URL says — including <code>http://127.0.0.1</code>, the internal network, or <code>169.254.169.254</code>, where cloud providers serve instance credentials. With the guard switched off:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | jq -r .accessToken &gt; lan.jwt</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/devices/dev_1/manual \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H 'Accept-Language: en' \\
  --json '{"url":"http://127.0.0.1:4000/health"}' | jq -c .</code></pre>
<div class="out">{"id":"dev_1","manualUrl":"http://127.0.0.1:4000/health","probe":{"status":200,"contentType":"application/json; charset=utf-8","bytes":20}}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/devices/dev_1/manual \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H 'Accept-Language: en' \\
  --json '{"url":"https://169.254.169.254/latest/meta-data/"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":500,"code":"INTERNAL","detail":"Something went wrong on our side, try again later"}</div>
<p>The server happily fetched its own internal endpoint and reported the result. (The metadata request ended in a timeout and a 500 here, on a laptop; on a cloud VM it would have returned credentials.) With <code>safeFetch</code>:</p>
<pre><code class="language-javascript">// safeFetch.js — bài 6.3 (OWASP API7 SSRF): server chỉ tải URL công khai, qua HTTPS, không bao giờ vào mạng nội bộ
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { HttpError } from './http.js';
import { VULN } from './vuln.js';

// loopback, mạng riêng, link-local (169.254.x.x — nơi cloud để metadata), CGNAT, "this network", IPv6 nội bộ
const PRIVATE = [/^127\\./, /^10\\./, /^192\\.168\\./, /^172\\.(1[6-9]|2\\d|3[01])\\./, /^169\\.254\\./, /^100\\.(6[4-9]|[7-9]\\d|1[01]\\d|12[0-7])\\./, /^0\\./,
  /^::1$/, /^f[cd]/i, /^fe80:/i, /^::ffff:(127|10|192\\.168|169\\.254)\\./i];
const isPrivate = (ip) =&gt; PRIVATE.some((r) =&gt; r.test(ip));

export async function safeFetch(raw) {
  let url;
  try { url = new URL(raw); } catch { throw new HttpError(422, 'URL_NOT_ALLOWED', { reason: 'not a URL' }); }
  if (!VULN) {
    if (url.protocol !== 'https:') throw new HttpError(422, 'URL_NOT_ALLOWED', { reason: 'https only' });
    const host = url.hostname.replace(/^\\[|\\]$/g, '');
    const addrs = isIP(host) ? [host] : (await lookup(host, { all: true })).map((a) =&gt; a.address);
    if (addrs.some(isPrivate)) throw new HttpError(422, 'URL_NOT_ALLOWED', { reason: 'private address' });
  }
  const res = await fetch(url, { redirect: VULN ? 'follow' : 'error', signal: AbortSignal.timeout(3000) });   // chuyển hướng có thể dẫn vào trong
  return { status: res.status, contentType: res.headers.get('content-type'), bytes: (await res.arrayBuffer()).byteLength };
}</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | jq -r .accessToken &gt; lan.jwt</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/devices/dev_1/manual \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H 'Accept-Language: en' \\
  --json '{"url":"http://127.0.0.1:4000/health"}' | jq -c .</code></pre>
<div class="out">{"type":"https://labflow.example/problems/url-not-allowed","title":"URL not allowed","status":422,"detail":"This URL cannot be fetched (https only)","instance":"/v2/devices/dev_1/manual","code":"URL_NOT_ALLOWED"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/devices/dev_1/manual \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H 'Accept-Language: en' \\
  --json '{"url":"https://169.254.169.254/latest/meta-data/"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":422,"code":"URL_NOT_ALLOWED","detail":"This URL cannot be fetched (private address)"}</div>
<p>Only https; the host name is <strong>resolved first</strong> and every address checked, so <code>evil.example</code> pointing at 127.0.0.1 is caught too; redirects are refused because a redirect could lead inside after the check.</p>

<h3>The audit: the Top 10 as a script</h3>
<p><code>audit.mjs</code> runs one or two real requests per risk and prints PASS or FAIL:</p>
<pre><code class="language-javascript">// audit.mjs (excerpt — the full file is in Lab 6)
const checks = [
  ['API1 BOLA', 'Bin reads An’s receipt', async () =&gt; {
    const bin = await login('binh@student.labflow.example', 'binh-lab-2026');
    const r = await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_1', period: day(1) } });
    const id = (await r.json()).id;
    return (await call(&#96;/v2/bookings/\${id}/receipt&#96;, { token: bin })).status === 404; }],
  ['API3 Property level', 'PATCH /v2/me {"role":"LAB_MANAGER"}', async () =&gt; {
    const s = (await call('/v2/me', { method: 'PATCH', token: an, body: { role: 'LAB_MANAGER' } })).status;
    const me = await (await call('/v2/me', { token: an })).json();
    return s === 400 &amp;&amp; me.role === 'STUDENT'; }],
  ['API7 SSRF', 'manual URL http://127.0.0.1:4000/health', async () =&gt;
    (await call('/v2/devices/dev_1/manual', { method: 'POST', token: lan, body: { url: 'http://127.0.0.1:4000/health' } })).status === 422],
  // … API2 ×2, API3 passwordHash, API4, API5, API6, API7 metadata, API8, API9 …
];
let fails = 0;
for (const [risk, what, test] of checks) {
  let ok;
  try { ok = await test(); } catch (e) { ok = false; }
  if (!ok) fails++;
  console.log(&#96;\${ok ? 'PASS' : 'FAIL'}  \${risk.padEnd(22)} \${what}&#96;);
}</code></pre>
<p>Against LabFlow with the lab’s holes switched on (<code>LABFLOW_VULN=1</code>):</p>
<pre><code class="language-bash">node audit.mjs</code></pre>
<div class="out">FAIL  API1 BOLA              Bin reads An’s receipt
FAIL  API2 Broken auth       token with alg "none"
FAIL  API2 Broken auth       6 wrong passwords ⇒ 429
FAIL  API3 Property level    PATCH /v2/me {"role":"LAB_MANAGER"}
PASS  API3 Property level    GET /v2/me hides passwordHash
PASS  API4 Resources         limit=1000 ⇒ 400, 20 KB body ⇒ 413
FAIL  API5 Function level    student PATCHes a device
FAIL  API6 Business flows    student holds a 4th active booking
FAIL  API7 SSRF              manual URL http://127.0.0.1:4000/health
FAIL  API7 SSRF              manual URL https://169.254.169.254/…
FAIL  API8 Misconfiguration  no X-Powered-By, CORS refuses evil origin
PASS  API9 Inventory         old unversioned path announces its end
—     API10 Unsafe consumption  LabFlow calls no third-party API yet — nothing to test
✗ 9 kiểm thất bại</div>
<p>Look at API5 and API6: they were not switched off — they failed because API3 let An make herself a manager first, and a manager may patch devices and has no booking cap. One hole opens the next. With the fixes:</p>
<pre><code class="language-bash">node audit.mjs</code></pre>
<div class="out">PASS  API1 BOLA              Bin reads An’s receipt
PASS  API2 Broken auth       token with alg "none"
PASS  API2 Broken auth       6 wrong passwords ⇒ 429
PASS  API3 Property level    PATCH /v2/me {"role":"LAB_MANAGER"}
PASS  API3 Property level    GET /v2/me hides passwordHash
PASS  API4 Resources         limit=1000 ⇒ 400, 20 KB body ⇒ 413
PASS  API5 Function level    student PATCHes a device
PASS  API6 Business flows    student holds a 4th active booking
PASS  API7 SSRF              manual URL http://127.0.0.1:4000/health
PASS  API7 SSRF              manual URL https://169.254.169.254/…
PASS  API8 Misconfiguration  no X-Powered-By, CORS refuses evil origin
PASS  API9 Inventory         old unversioned path announces its end
—     API10 Unsafe consumption  LabFlow calls no third-party API yet — nothing to test
✓ mọi kiểm đạt</div>

<div class="pitfall"><p><strong>Trap — security as a checklist at the end.</strong> Half of the items above (API3, 4, 5, 8, 9) were fixed by ordinary design decisions in Chapters 1–5. Retro-fitting them is much harder.</p></div>
<div class="pitfall"><p><strong>Trap — blocking “localhost” by string.</strong> <code>127.1</code>, <code>[::1]</code>, decimal IPs and DNS names all reach the same place. Resolve, then check the addresses.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“Name the OWASP API Top 10 and give examples.”</strong> BOLA, broken authentication, broken object property level authorization, unrestricted resource consumption, BFLA, sensitive business flows, SSRF, misconfiguration, inventory management, unsafe consumption — each with one example from an API you built, and its fix.</p>

<a class="link-card" href="https://api-security.owasp.org/editions/2023/en/0x11-t10" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: OWASP API Security Top 10 — 2023 edition — read 1 Nov 2026</span><span class="lc-sub">The ten risks of the 2023 edition — the list this lesson maps onto LabFlow and turns into audit.mjs.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
  <li>Add the business-flow limit and <code>safeFetch</code>; run <code>audit.mjs</code> against both modes.</li>
  <li>Add one more check per risk to the audit (e.g. API8: a 500 never contains a stack trace).</li>
  <li>Try to bypass <code>safeFetch</code> with <code>https://127.1/</code> and <code>https://localhost/</code>. Explain the result.</li>
</ol>
<p><strong>Done when:</strong> the audit passes every check, and you can explain each FAIL of the vulnerable run.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OWASP</span><span class="v">Open Worldwide Application Security Project; publishes the Top 10 lists.</span></div>
  <div class="kv"><span class="k">BOPLA (API3)</span><span class="v">Reading or writing properties of an object you should not (mass assignment, data exposure).</span></div>
  <div class="kv"><span class="k">Business flow abuse (API6)</span><span class="v">Using a legitimate feature at a scale that hurts the business.</span></div>
  <div class="kv"><span class="k">SSRF (API7)</span><span class="v">Making the server send requests to addresses the attacker chooses.</span></div>
  <div class="kv"><span class="k">Metadata endpoint</span><span class="v">169.254.169.254 on cloud VMs: serves instance details and credentials.</span></div>
  <div class="kv"><span class="k">Security audit</span><span class="v">A systematic check of known risks, ideally automated.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The 2023 Top 10 mapped onto LabFlow: half the items were already handled by Chapters 1–5, two more by 6.1–6.2.</li>
  <li>New: max 3 active bookings per student (API6) and <code>safeFetch</code> against SSRF (API7).</li>
  <li>Measured: vulnerable mode 9 FAIL — including two caused by one role escalation; fixed mode all PASS.</li>
  <li>Resolve host names before checking addresses; refuse redirects.</li>
  <li>Keep the audit in your test suite.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-3-dau-vao-doc-hai" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 9.3 — Input is the enemy: ReDoS, prototype pollution, body limits, SSRF</span><span class="lc-sub">The Node.js course runs this on a real Express server and measures it. Same: SSRF: the server fetches a URL for the user and reaches what the attacker cannot; the fix is https only, check the resolved IP, never follow a redirect blindly. There you add: internal secrets read through a preview route, an allow-list that a single 302 walks around, re-checking every hop with redirect: 'manual', and new URL() normalising 127.1 / 2130706433 / 0x7f.0.0.1 — plus ReDoS, prototype pollution and body limits measured. This lesson adds what that one does not: a complete safeFetch on LabFlow (DNS resolution, private ranges refused, 3 s timeout) and the whole OWASP API Top 10 as an automatic audit.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>OWASP API Security Top 10</h2>
<p class="lead"><strong>API Security Top 10</strong> của OWASP (bản 2023, bản hiện hành khi kiểm ngày 1/11/2026) là danh sách mà người soát bảo mật, pentester và người phỏng vấn đều dùng. Học thuộc mười cái tên thì dễ; biết mỗi cái trông thế nào trong API <em>của bạn</em> mới là kỹ năng. Bài này đặt cả mười lên LabFlow, thêm hai lớp phòng thủ LabFlow còn thiếu — giới hạn luồng nghiệp vụ và chốt chống SSRF — và biến danh sách thành một bộ kiểm tự động gửi request thật.</p>

<h3>Mười mục, trên LabFlow</h3>
<table>
  <thead><tr><th>Rủi ro</th><th>Trông thế nào</th><th>LabFlow phòng thủ ra sao</th></tr></thead>
  <tbody>
    <tr><td>API1 Broken Object Level Authorization</td><td>Bin đọc biên nhận của An theo id</td><td>chính sách + 404 (6.2)</td></tr>
    <tr><td>API2 Broken Authentication</td><td>token giả/alg none, dò mật khẩu</td><td>JWT có chữ ký, thuật toán cố định, hết hạn, giới hạn đăng nhập (6.1)</td></tr>
    <tr><td>API3 Broken Object Property Level Authorization</td><td>gửi <code>role</code>; đọc được <code>passwordHash</code></td><td>lược đồ strict ở mép vào, view ở mép ra (2.2, 2.3)</td></tr>
    <tr><td>API4 Unrestricted Resource Consumption</td><td><code>limit=1000000</code>, body khổng lồ, dội request</td><td>tối đa 100 (3.1), body 10 KB (2.2), giới hạn tần suất (5.3)</td></tr>
    <tr><td>API5 Broken Function Level Authorization</td><td>sinh viên gọi thao tác chỉ dành cho quản lý</td><td><code>requireRole</code> (1.x) và chính sách</td></tr>
    <tr><td>API6 Unrestricted Access to Sensitive Business Flows</td><td>bot đặt hết mọi ca phòng lab</td><td>tối đa 3 lượt đặt còn hiệu lực mỗi sinh viên (mới)</td></tr>
    <tr><td>API7 Server Side Request Forgery</td><td>server tải một URL do client chọn</td><td><code>safeFetch</code>: chỉ https, không địa chỉ nội bộ (mới)</td></tr>
    <tr><td>API8 Security Misconfiguration</td><td>lộ stack trace, <code>X-Powered-By</code>, CORS <code>*</code></td><td>problem+json không lộ chi tiết (2.1), tắt header, CORS danh sách cho phép (6.4)</td></tr>
    <tr><td>API9 Improper Inventory Management</td><td>phiên bản cũ bị quên vẫn chạy</td><td>phiên bản + Deprecation/Sunset + báo cáo mức dùng (4.2, 4.3)</td></tr>
    <tr><td>API10 Unsafe Consumption of APIs</td><td>tin dữ liệu từ API bên thứ ba</td><td>LabFlow chưa gọi API nào; kiểm dữ liệu ngoài như dữ liệu người dùng</td></tr>
  </tbody>
</table>
<p>Phần lớn danh sách đã được các chương trước xử lý — đó chính là điểm mấu chốt: bảo mật phần lớn là thiết kế API tốt được áp dụng nhất quán.</p>

<h3>API6: một luồng nghiệp vụ cần giới hạn</h3>
<p>Giới hạn tần suất (5.3) đếm request mỗi phút. Nó không ngăn được một sinh viên — hay một script — chậm rãi đặt hết mọi ca thứ Hai của cả học kỳ. Luật nghiệp vụ nói về trạng thái, không về tốc độ:</p>
<pre><code class="language-javascript">// routes/bookings.js — một sinh viên giữ tối đa 3 lượt đặt còn hiệu lực
export const MAX_ACTIVE = 3;
    if (req.user.role === 'STUDENT') {
      const active = bookings.filter((b) =&gt; b.userId === req.user.id &amp;&amp; b.status !== 'CANCELLED' &amp;&amp; Date.parse(b.endAt) &gt; now()).length;
      if (active &gt;= MAX_ACTIVE) throw new HttpError(422, 'TOO_MANY_ACTIVE_BOOKINGS', { max: MAX_ACTIVE });
    }</code></pre>

<h3>API7: SSRF</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">URL từ client</span><span class="lz-t">https://…</span><span class="lz-d">scheme khác ⇒ 422</span></div>
  <div class="lz-step"><span class="lz-k">phân giải DNS</span><span class="lz-t">mọi địa chỉ</span><span class="lz-d">tên miền, 127.1, [::1], IP dạng thập phân</span></div>
  <div class="lz-step"><span class="lz-k">nội bộ?</span><span class="lz-t">loopback, 10/8, 169.254/16…</span><span class="lz-d">chỉ cần một ⇒ 422 URL_NOT_ALLOWED</span></div>
  <div class="lz-step"><span class="lz-k">tải</span><span class="lz-t">redirect: error, giới hạn 3 giây</span><span class="lz-d">không đi theo chuyển hướng vào trong</span></div>
</div>
<p>Quản lý có thể đính kèm link sách hướng dẫn của thiết bị, và server tải thử một lần để kiểm. Việc đó biến <em>server</em> thành một client đi tới bất cứ đâu URL chỉ — kể cả <code>http://127.0.0.1</code>, mạng nội bộ, hay <code>169.254.169.254</code>, nơi các nhà cung cấp cloud trả thông tin đăng nhập của máy ảo. Khi tắt chốt:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | jq -r .accessToken &gt; lan.jwt</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/devices/dev_1/manual \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H 'Accept-Language: en' \\
  --json '{"url":"http://127.0.0.1:4000/health"}' | jq -c .</code></pre>
<div class="out">{"id":"dev_1","manualUrl":"http://127.0.0.1:4000/health","probe":{"status":200,"contentType":"application/json; charset=utf-8","bytes":20}}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/devices/dev_1/manual \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H 'Accept-Language: en' \\
  --json '{"url":"https://169.254.169.254/latest/meta-data/"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":500,"code":"INTERNAL","detail":"Something went wrong on our side, try again later"}</div>
<p>Server vui vẻ tải endpoint nội bộ của chính nó và báo kết quả. (Request tới metadata hết giờ và thành 500 ở đây, trên laptop; trên máy ảo cloud nó đã trả về thông tin đăng nhập.) Có <code>safeFetch</code>:</p>
<pre><code class="language-javascript">// safeFetch.js — bài 6.3 (OWASP API7 SSRF): server chỉ tải URL công khai, qua HTTPS, không bao giờ vào mạng nội bộ
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { HttpError } from './http.js';
import { VULN } from './vuln.js';

// loopback, mạng riêng, link-local (169.254.x.x — nơi cloud để metadata), CGNAT, "this network", IPv6 nội bộ
const PRIVATE = [/^127\\./, /^10\\./, /^192\\.168\\./, /^172\\.(1[6-9]|2\\d|3[01])\\./, /^169\\.254\\./, /^100\\.(6[4-9]|[7-9]\\d|1[01]\\d|12[0-7])\\./, /^0\\./,
  /^::1$/, /^f[cd]/i, /^fe80:/i, /^::ffff:(127|10|192\\.168|169\\.254)\\./i];
const isPrivate = (ip) =&gt; PRIVATE.some((r) =&gt; r.test(ip));

export async function safeFetch(raw) {
  let url;
  try { url = new URL(raw); } catch { throw new HttpError(422, 'URL_NOT_ALLOWED', { reason: 'not a URL' }); }
  if (!VULN) {
    if (url.protocol !== 'https:') throw new HttpError(422, 'URL_NOT_ALLOWED', { reason: 'https only' });
    const host = url.hostname.replace(/^\\[|\\]$/g, '');
    const addrs = isIP(host) ? [host] : (await lookup(host, { all: true })).map((a) =&gt; a.address);
    if (addrs.some(isPrivate)) throw new HttpError(422, 'URL_NOT_ALLOWED', { reason: 'private address' });
  }
  const res = await fetch(url, { redirect: VULN ? 'follow' : 'error', signal: AbortSignal.timeout(3000) });   // chuyển hướng có thể dẫn vào trong
  return { status: res.status, contentType: res.headers.get('content-type'), bytes: (await res.arrayBuffer()).byteLength };
}</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"lan@labflow.example","password":"lan-lab-2026"}' | jq -r .accessToken &gt; lan.jwt</code></pre>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/devices/dev_1/manual \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H 'Accept-Language: en' \\
  --json '{"url":"http://127.0.0.1:4000/health"}' | jq -c .</code></pre>
<div class="out">{"type":"https://labflow.example/problems/url-not-allowed","title":"URL not allowed","status":422,"detail":"This URL cannot be fetched (https only)","instance":"/v2/devices/dev_1/manual","code":"URL_NOT_ALLOWED"}</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/devices/dev_1/manual \\
  -H "Authorization: Bearer $(cat lan.jwt)" \\
  -H 'Accept-Language: en' \\
  --json '{"url":"https://169.254.169.254/latest/meta-data/"}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":422,"code":"URL_NOT_ALLOWED","detail":"This URL cannot be fetched (private address)"}</div>
<p>Chỉ https; tên miền được <strong>phân giải trước</strong> rồi kiểm mọi địa chỉ, nên <code>evil.example</code> trỏ về 127.0.0.1 cũng bị bắt; chuyển hướng bị từ chối vì một lần chuyển hướng có thể dẫn vào trong sau khi đã kiểm.</p>

<h3>Bộ kiểm: Top 10 thành một script</h3>
<p><code>audit.mjs</code> gửi một hai request thật cho mỗi rủi ro và in PASS hoặc FAIL:</p>
<pre><code class="language-javascript">// audit.mjs (trích — tệp đầy đủ ở Lab 6)
const checks = [
  ['API1 BOLA', 'Bin reads An’s receipt', async () =&gt; {
    const bin = await login('binh@student.labflow.example', 'binh-lab-2026');
    const r = await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_1', period: day(1) } });
    const id = (await r.json()).id;
    return (await call(&#96;/v2/bookings/\${id}/receipt&#96;, { token: bin })).status === 404; }],
  ['API3 Property level', 'PATCH /v2/me {"role":"LAB_MANAGER"}', async () =&gt; {
    const s = (await call('/v2/me', { method: 'PATCH', token: an, body: { role: 'LAB_MANAGER' } })).status;
    const me = await (await call('/v2/me', { token: an })).json();
    return s === 400 &amp;&amp; me.role === 'STUDENT'; }],
  ['API7 SSRF', 'manual URL http://127.0.0.1:4000/health', async () =&gt;
    (await call('/v2/devices/dev_1/manual', { method: 'POST', token: lan, body: { url: 'http://127.0.0.1:4000/health' } })).status === 422],
  // … API2 ×2, API3 passwordHash, API4, API5, API6, API7 metadata, API8, API9 …
];
let fails = 0;
for (const [risk, what, test] of checks) {
  let ok;
  try { ok = await test(); } catch (e) { ok = false; }
  if (!ok) fails++;
  console.log(&#96;\${ok ? 'PASS' : 'FAIL'}  \${risk.padEnd(22)} \${what}&#96;);
}</code></pre>
<p>Chạy với LabFlow đang bật các lỗ hổng của lab (<code>LABFLOW_VULN=1</code>):</p>
<pre><code class="language-bash">node audit.mjs</code></pre>
<div class="out">FAIL  API1 BOLA              Bin reads An’s receipt
FAIL  API2 Broken auth       token with alg "none"
FAIL  API2 Broken auth       6 wrong passwords ⇒ 429
FAIL  API3 Property level    PATCH /v2/me {"role":"LAB_MANAGER"}
PASS  API3 Property level    GET /v2/me hides passwordHash
PASS  API4 Resources         limit=1000 ⇒ 400, 20 KB body ⇒ 413
FAIL  API5 Function level    student PATCHes a device
FAIL  API6 Business flows    student holds a 4th active booking
FAIL  API7 SSRF              manual URL http://127.0.0.1:4000/health
FAIL  API7 SSRF              manual URL https://169.254.169.254/…
FAIL  API8 Misconfiguration  no X-Powered-By, CORS refuses evil origin
PASS  API9 Inventory         old unversioned path announces its end
—     API10 Unsafe consumption  LabFlow calls no third-party API yet — nothing to test
✗ 9 kiểm thất bại</div>
<p>Để ý API5 và API6: chúng không bị tắt — chúng hỏng vì API3 cho An tự biến mình thành quản lý trước, mà quản lý thì được sửa thiết bị và không bị giới hạn lượt đặt. Một lỗ mở ra lỗ tiếp theo. Khi đã vá:</p>
<pre><code class="language-bash">node audit.mjs</code></pre>
<div class="out">PASS  API1 BOLA              Bin reads An’s receipt
PASS  API2 Broken auth       token with alg "none"
PASS  API2 Broken auth       6 wrong passwords ⇒ 429
PASS  API3 Property level    PATCH /v2/me {"role":"LAB_MANAGER"}
PASS  API3 Property level    GET /v2/me hides passwordHash
PASS  API4 Resources         limit=1000 ⇒ 400, 20 KB body ⇒ 413
PASS  API5 Function level    student PATCHes a device
PASS  API6 Business flows    student holds a 4th active booking
PASS  API7 SSRF              manual URL http://127.0.0.1:4000/health
PASS  API7 SSRF              manual URL https://169.254.169.254/…
PASS  API8 Misconfiguration  no X-Powered-By, CORS refuses evil origin
PASS  API9 Inventory         old unversioned path announces its end
—     API10 Unsafe consumption  LabFlow calls no third-party API yet — nothing to test
✓ mọi kiểm đạt</div>

<div class="pitfall"><p><strong>Bẫy — coi bảo mật là bảng kiểm làm ở cuối.</strong> Một nửa các mục trên (API3, 4, 5, 8, 9) đã được sửa bằng những quyết định thiết kế bình thường ở Chương 1–5. Vá sau thì khó hơn nhiều.</p></div>
<div class="pitfall"><p><strong>Bẫy — chặn “localhost” bằng so chuỗi.</strong> <code>127.1</code>, <code>[::1]</code>, IP dạng số thập phân và tên miền đều tới cùng một chỗ. Hãy phân giải, rồi kiểm địa chỉ.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“Kể tên OWASP API Top 10 và cho ví dụ.”</strong> BOLA, xác thực hỏng, phân quyền thuộc tính hỏng, tiêu thụ tài nguyên không giới hạn, BFLA, luồng nghiệp vụ nhạy cảm, SSRF, cấu hình sai, quản lý danh mục API, dùng API bên ngoài không an toàn — mỗi mục kèm một ví dụ từ API bạn đã làm, và cách sửa.</p>

<a class="link-card" href="https://api-security.owasp.org/editions/2023/en/0x11-t10" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: OWASP API Security Top 10 — bản 2023 — đọc ngày 1/11/2026</span><span class="lc-sub">Mười rủi ro của bản 2023 — danh sách bài này đặt lên LabFlow và biến thành audit.mjs.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm giới hạn luồng nghiệp vụ và <code>safeFetch</code>; chạy <code>audit.mjs</code> ở cả hai chế độ.</li>
  <li>Thêm một phép kiểm nữa cho mỗi rủi ro (ví dụ API8: lỗi 500 không bao giờ chứa stack trace).</li>
  <li>Thử vượt <code>safeFetch</code> bằng <code>https://127.1/</code> và <code>https://localhost/</code>. Giải thích kết quả.</li>
</ol>
<p><strong>Xong khi:</strong> bộ kiểm qua mọi phép kiểm, và bạn giải thích được từng FAIL của lần chạy có lỗ hổng.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OWASP</span><span class="v">Open Worldwide Application Security Project; nơi công bố các danh sách Top 10.</span></div>
  <div class="kv"><span class="k">BOPLA (API3)</span><span class="v">Đọc hay ghi thuộc tính của đối tượng mà lẽ ra không được (mass assignment, lộ dữ liệu).</span></div>
  <div class="kv"><span class="k">Lạm dụng luồng nghiệp vụ (API6)</span><span class="v">Dùng một tính năng hợp lệ ở quy mô gây hại cho nghiệp vụ.</span></div>
  <div class="kv"><span class="k">SSRF (API7)</span><span class="v">Khiến server gửi request tới địa chỉ do kẻ tấn công chọn.</span></div>
  <div class="kv"><span class="k">Metadata endpoint</span><span class="v">169.254.169.254 trên máy ảo cloud: trả thông tin máy và khoá truy cập.</span></div>
  <div class="kv"><span class="k">Security audit (soát bảo mật)</span><span class="v">Kiểm có hệ thống các rủi ro đã biết, tốt nhất là tự động.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Top 10 bản 2023 đặt lên LabFlow: một nửa đã được Chương 1–5 xử lý, thêm hai mục nhờ 6.1–6.2.</li>
  <li>Mới: tối đa 3 lượt đặt còn hiệu lực mỗi sinh viên (API6) và <code>safeFetch</code> chống SSRF (API7).</li>
  <li>Đo được: chế độ có lỗ hổng 9 FAIL — có hai cái do một lần tự nâng vai trò gây ra; chế độ đã vá PASS hết.</li>
  <li>Phân giải tên miền trước khi kiểm địa chỉ; từ chối chuyển hướng.</li>
  <li>Giữ bộ kiểm trong bộ test của bạn.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-3-dau-vao-doc-hai" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 9.3 — Đầu vào là kẻ thù: ReDoS, ô nhiễm nguyên mẫu, giới hạn thân request, SSRF</span><span class="lc-sub">Khoá Node.js chạy đúng phần này trên một server Express thật và đo nó. Giống: SSRF: server đi lấy một URL giùm người dùng và với tới chỗ kẻ tấn công không với tới được; cách chặn là chỉ https, kiểm IP sau khi phân giải, không đi theo chuyển hướng mù quáng. Ở đó học thêm: bí mật nội bộ bị đọc qua route xem trước, một danh sách trắng bị cú 302 đi vòng, kiểm lại từng chặng bằng redirect: 'manual', và new URL() chuẩn hoá 127.1 / 2130706433 / 0x7f.0.0.1 — cùng ReDoS, ô nhiễm nguyên mẫu và giới hạn thân request đo thật. Bài này có thứ bài kia không có: một safeFetch đầy đủ trên LabFlow (phân giải DNS, chặn dải nội bộ, timeout 3 s) và cả OWASP API Top 10 thành bộ kiểm tự động.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — CORS, CSRF and browsers: measured in a real Chromium|||6.4 — CORS, CSRF và trình duyệt: đo trong Chromium thật',
      slug: 'api-6-4-cors',
      type: 'LESSON',
      isFreePreview: true,
      description: 'CORS theo danh sách cho phép, preflight, header được lộ, Vary: Origin; Playwright chứng minh GET của trang lạ vẫn tới server; lỗi phản chiếu origin; vì sao bearer token tránh CSRF.',
      content: `${G064}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>CORS, CSRF and browsers</h2>
<p class="lead">LabFlow’s web app will live at one address and call the API at another. Browsers block that by default, and every web developer meets the red “blocked by CORS policy” line in the console. This lesson explains what CORS really is — a rule of the <strong>browser</strong> that the server opts into, not a wall around the server — proves it with a real Chromium, and then looks at its cousin CSRF, which LabFlow avoids by design.</p>

<h3>Origins and the same-origin policy</h3>
<div class="lz-map">
  <div class="lz-stage">a page on another origin calls POST /v2/auth/login with JSON</div>
  <div class="lz-node"><span class="lz-badge">1</span><div class="lz-nbody"><div class="lz-ntitle">Browser sees a non-simple request</div><div class="lz-nsub">application/json is not a safelisted Content-Type</div></div></div>
  <div class="lz-node"><span class="lz-badge">2</span><div class="lz-nbody"><div class="lz-ntitle">Preflight: OPTIONS + Access-Control-Request-Method</div><div class="lz-nsub">the real request waits</div></div></div>
  <div class="lz-node"><span class="lz-badge">3</span><div class="lz-nbody"><div class="lz-ntitle">Server checks its allow-list</div><div class="lz-nsub">allowed ⇒ Allow-Origin, Allow-Methods, Allow-Headers, Max-Age</div></div></div>
  <div class="lz-node"><span class="lz-badge">4</span><div class="lz-nbody"><div class="lz-ntitle">Browser sends the real request — or not at all</div><div class="lz-nsub">no permission ⇒ “blocked by CORS policy”, nothing sent</div></div></div>
</div>
<p>An <strong>origin</strong> is scheme + host + port: <code>http://localhost:5173</code> and <code>http://localhost:5174</code> are different origins, and so is the API at <code>http://localhost:4000</code>. A page’s JavaScript may <em>send</em> requests anywhere, but by default it may not <em>read</em> the response from another origin. CORS (Cross-Origin Resource Sharing, defined in the WHATWG Fetch standard) is how a server tells the browser: “this origin may read my responses”.</p>
<ul>
  <li><strong>Simple requests</strong> (GET, or a POST of a form-like type, without custom headers) are <em>sent</em>; the browser only decides afterwards whether the page may read the answer.</li>
  <li>Anything else — <code>Content-Type: application/json</code>, an <code>Authorization</code> header, PATCH, DELETE — first gets a <strong>preflight</strong>: an <code>OPTIONS</code> request asking permission. No permission ⇒ the real request is never sent.</li>
</ul>

<h3>Build it: an allow-list, never “*”</h3>
<pre><code class="language-javascript">// cors.js — bài 6.4: cho đúng những trang web của mình gọi API từ trình duyệt
import { VULN } from './vuln.js';

const ALLOWED = (process.env.LABFLOW_CORS_ORIGINS ?? 'http://localhost:5173').split(',').map((s) =&gt; s.trim());
const ALLOW_HEADERS = 'Authorization, Content-Type, Idempotency-Key, If-Match, If-None-Match, LabFlow-Client, Accept-Language';
const EXPOSE = 'Location, ETag, Link, Retry-After, RateLimit, RateLimit-Policy, Deprecation, Sunset, Idempotent-Replayed, LabFlow-Version';

export function cors(req, res, next) {
  const origin = req.get('Origin');
  res.vary('Origin');                                               // câu trả lời khác nhau theo Origin ⇒ báo cho cache
  if (!origin) return next();                                       // không phải trình duyệt gọi chéo nguồn
  const ok = VULN || ALLOWED.includes(origin);
  if (ok) {
    res.set('Access-Control-Allow-Origin', origin);                 // phản chiếu ĐÚNG origin đã duyệt, không bao giờ "*"
    res.set('Access-Control-Expose-Headers', EXPOSE);
    if (VULN) res.set('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS' &amp;&amp; req.get('Access-Control-Request-Method')) {   // preflight
    if (ok) res.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE')
      .set('Access-Control-Allow-Headers', ALLOW_HEADERS).set('Access-Control-Max-Age', '600');
    return res.status(204).end();
  }
  next();
}</code></pre>
<p><code>Access-Control-Expose-Headers</code> matters for this course: without it, browser code cannot read <code>Location</code>, <code>ETag</code>, <code>RateLimit</code> or <code>Deprecation</code> — the headers Chapters 1–5 rely on. <code>Vary: Origin</code> stops a cache from serving one origin’s answer to another.</p>
<pre><code class="language-bash">curl -si -X OPTIONS http://localhost:4000/v2/auth/login \\
  -H 'Origin: http://localhost:5173' \\
  -H 'Access-Control-Request-Method: POST' \\
  -H 'Access-Control-Request-Headers: content-type' | grep -E '^(HTTP|Access-Control|Vary)'</code></pre>
<div class="out">HTTP/1.1 204 No Content
Vary: Origin
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Expose-Headers: Location, ETag, Link, Retry-After, RateLimit, RateLimit-Policy, Deprecation, Sunset, Idempotent-Replayed, LabFlow-Version
Access-Control-Allow-Methods: GET, HEAD, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type, Idempotency-Key, If-Match, If-None-Match, LabFlow-Client, Accept-Language
Access-Control-Max-Age: 600</div>
<pre><code class="language-bash">curl -si -X OPTIONS http://localhost:4000/v2/auth/login \\
  -H 'Origin: http://localhost:5174' \\
  -H 'Access-Control-Request-Method: POST' \\
  -H 'Access-Control-Request-Headers: content-type' | grep -E '^(HTTP|Access-Control|Vary)'</code></pre>
<div class="out">HTTP/1.1 204 No Content
Vary: Origin</div>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/labs \\
  -H 'Origin: http://localhost:5174' | grep -E '^(HTTP|Access-Control|Vary)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Vary: Origin</div>
<p>The allowed origin gets a full preflight answer; the unknown one gets a 204 without any permission header — and the plain GET from the unknown origin still gets 200, just without <code>Access-Control-Allow-Origin</code>.</p>

<h3>A real browser</h3>
<p>The same page is served on <code>:5173</code> (LabFlow’s web app) and <code>:5174</code> (a stranger’s site). It does a GET of the lab list and a JSON POST to the login. Chromium runs it through Playwright, and the server logs every request that reaches it (<code>LABFLOW_LOG=1</code>):</p>
<pre><code class="language-html">&lt;!doctype html&gt;&lt;meta charset="utf-8"&gt;&lt;title&gt;…&lt;/title&gt;
&lt;script type="module"&gt;
// Trang web gọi LabFlow từ một ORIGIN khác (cổng khác = origin khác)
const out = [];
async function t(name, f) { try { out.push(&#96;\${name}: \${await f()}&#96;); } catch (e) { out.push(&#96;\${name}: \${e.name}: \${e.message}&#96;); } }
await t('GET /v2/labs', async () =&gt; (await fetch('http://localhost:4000/v2/labs')).status);
await t('POST /v2/auth/login', async () =&gt; {
  const r = await fetch('http://localhost:4000/v2/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'an@student.labflow.example', password: 'an-lab-2026' }) });
  return &#96;\${r.status}, token \${(await r.json()).accessToken ? 'received' : 'missing'}&#96;;
});
window.__out = out; document.title = 'done';
&lt;/script&gt;</code></pre>
<pre><code class="language-bash">node web/browser.mjs</code></pre>
<div class="out">page http://localhost:5173
  GET /v2/labs: 200
  POST /v2/auth/login: 200, token received
page http://localhost:5174
  GET /v2/labs: TypeError: Failed to fetch
  POST /v2/auth/login: TypeError: Failed to fetch
  console: Access to fetch at 'http://localhost:4000/v2/labs' from origin 'http://localhost:5174' has been blocked by CORS policy: No 'Access-Control-Allow-Origi…
  console: Failed to load resource: net::ERR_FAILED
  console: Access to fetch at 'http://localhost:4000/v2/auth/login' from origin 'http://localhost:5174' has been blocked by CORS policy: Response to preflight re…
  console: Failed to load resource: net::ERR_FAILED</div>
<pre><code class="language-bash">grep -v "chạy ở" srv.log</code></pre>
<div class="out">GET /v2/labs origin=http://localhost:5173
OPTIONS /v2/auth/login origin=http://localhost:5173
POST /v2/auth/login origin=http://localhost:5173
GET /v2/labs origin=http://localhost:5174
OPTIONS /v2/auth/login origin=http://localhost:5174</div>
<p>Read the server log carefully. From <code>:5174</code> the <strong>GET arrived and was answered</strong> — the browser only refused to show the response to the page. The JSON POST was stopped at the preflight and never reached the login handler. So: CORS protects <em>users’ browsers</em> from pages reading data they should not; it does <strong>not</strong> protect your server from requests. curl, Postman and attackers’ scripts ignore it entirely. Authentication and authorisation (6.1, 6.2) protect the server.</p>

<h3>The dangerous mistake</h3>
<p>The quickest way to make the red line go away is to reflect whatever origin comes in and allow credentials:</p>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/labs \\
  -H 'Origin: https://evil.example' | grep -E '^(HTTP|Access-Control-Allow)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true</div>
<p>Now <em>any</em> website a logged-in user visits can call LabFlow with the user’s cookies and read the answers. (Browsers refuse <code>*</code> together with credentials precisely to prevent this; reflecting the origin bypasses that guard.)</p>

<h3>CSRF, and why LabFlow is not exposed</h3>
<p><strong>CSRF</strong> (cross-site request forgery): a stranger’s page makes the browser send a request that carries the user’s cookies automatically — a form that POSTs “cancel booking” while the user is logged in. It works only when authentication rides on cookies. LabFlow sends tokens in the <code>Authorization</code> header, which the browser never adds by itself, so a forged request arrives without credentials. If you choose cookie sessions (6.1), use <code>SameSite=Lax</code> or <code>Strict</code>, <code>HttpOnly</code>, <code>Secure</code>, and an anti-CSRF token for state-changing requests.</p>

<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-5-2-jwt-cors" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SDN302 — lesson 5.2: JWT, HTTPS, CORS</span><span class="lc-sub">If you took SDN302 on Academy, you enabled CORS so your React app could call the API. Same: the server lists which origins may call it. Different: SDN302 shows the cors() package; here you build it and watch a real browser. This lesson adds: preflight in detail, exposed headers, Vary: Origin, proof that CORS does not stop requests reaching the server, the reflect-origin mistake, and CSRF. Not taken SDN302? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SDN302 LESSON →</span>
</a>

<div class="pitfall"><p><strong>Trap — “fixing” CORS on the server for a curl problem.</strong> If curl fails, CORS is not the reason; curl does not do CORS.</p></div>
<div class="pitfall"><p><strong>Trap — trusting the Origin header as authentication.</strong> Any non-browser client can send any Origin. It is a browser signal, not an identity.</p></div>

<h3>In interviews and at work</h3>
<p><strong>“What does CORS protect against?”</strong> It lets a server relax the browser’s same-origin policy for chosen origins; it protects users’ data from being read by other sites’ scripts, not the server from requests. <strong>“CORS vs CSRF?”</strong> CSRF abuses automatically attached credentials (cookies); bearer tokens in headers, SameSite cookies and anti-CSRF tokens prevent it.</p>

<a class="link-card" href="https://fetch.spec.whatwg.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: WHATWG Fetch Standard (updated 19 Oct 2026) — read 1 Nov 2026</span><span class="lc-sub">Only GET, HEAD and POST are CORS-safelisted methods; Content-Type is safelisted only for form-urlencoded, multipart/form-data and text/plain — so a JSON POST needs a preflight.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Add <code>cors.js</code>; reproduce the curl and browser runs.</li>
  <li>Remove <code>Access-Control-Expose-Headers</code> and show in the browser that <code>ETag</code> can no longer be read by the page.</li>
  <li>Write a 10-line HTML form on <code>:5174</code> that POSTs to LabFlow. What arrives at the server, and why does it not cancel anything?</li>
</ol>
<p><strong>Done when:</strong> only listed origins can read responses, exposed headers are readable, and you can explain why the evil GET still reached the server.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Origin</span><span class="v">Scheme + host + port of a page or server.</span></div>
  <div class="kv"><span class="k">Same-origin policy</span><span class="v">Browser rule: scripts may not read responses from other origins by default.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">Headers by which a server lets chosen origins read its responses.</span></div>
  <div class="kv"><span class="k">Preflight</span><span class="v">An OPTIONS request the browser sends first for non-simple requests.</span></div>
  <div class="kv"><span class="k">CSRF</span><span class="v">A forged request that rides on the user’s automatically sent cookies.</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">Cookie attribute limiting when the browser attaches it to cross-site requests.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>CORS is a browser rule the server opts into: an allow-list, never <code>*</code>, plus <code>Vary: Origin</code>.</li>
  <li>Expose the headers your clients need (Location, ETag, RateLimit…).</li>
  <li>Measured in Chromium: the stranger’s GET reached the server; the JSON POST stopped at the preflight.</li>
  <li>Reflecting any origin with credentials hands your users’ data to every website.</li>
  <li>Bearer tokens in headers make LabFlow immune to classic CSRF; cookie apps need SameSite and tokens.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-4-cookie-csrf-thu-hoi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 8.4 — Cookies, CSRF, revocation and rate limiting</span><span class="lc-sub">The Node.js course builds this into a real API and measures it. Same: what a browser sends on its own and what it lets a page read; Bearer tokens have no CSRF surface. There you add: the cookie side: HttpOnly vs localStorage in a real browser, a SameSite matrix in Chromium 149, double submit, and logging out everywhere with tokenVersion. This lesson adds what that one does not: the CORS side in Chromium: a stranger's GET still reaches the server, a JSON POST stops at the preflight, and the reflect-with-credentials mistake.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-1-header-csp-cors" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 9.1 — The perimeter: security headers, CSP and CORS</span><span class="lc-sub">The Node.js course runs this on a real Express server and measures it. Same: CORS only decides who may READ a response — a stranger's request still reaches the server; and an allow-list with Vary: Origin, never reflect-with-credentials. There you add: the headers the cors package really sends for four configurations (the rejected origin still gets 204 to its preflight), a POST that moves money on a server with no CORS at all, a shared cache that serves the wrong origin without Vary, and helmet's 12 headers. This lesson adds what that one does not: the same rules measured in a real Chromium: a stranger's GET reached the server, a JSON POST stopped at the preflight, plus CSRF.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-3-4-csrf" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper in the Authentication course — lesson 3.4: CSRF, and the three defences ranked</span><span class="lc-sub">Same: what a browser sends by itself and what it lets a page read. Deeper: five cookie/defence configurations attacked from another site in Chromium 156 — a no-cors fetch still changed the email (CORS hides responses, not writes), Lax ⇒ 401, Fetch Metadata or a synchronizer token ⇒ 403 — and why same-site subdomains are rejected too.</span></span>
  <span class="lc-cta">OPEN AUTHENTICATION LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>CORS, CSRF và trình duyệt</h2>
<p class="lead">Web app của LabFlow sẽ nằm ở một địa chỉ và gọi API ở một địa chỉ khác. Trình duyệt mặc định chặn việc đó, và lập trình viên web nào cũng từng gặp dòng đỏ “blocked by CORS policy” trong console. Bài này giải thích CORS thật ra là gì — một luật của <strong>trình duyệt</strong> mà server chọn tham gia, không phải bức tường quanh server — chứng minh bằng Chromium thật, rồi xem người anh em CSRF, thứ LabFlow tránh được nhờ thiết kế.</p>

<h3>Origin và chính sách cùng nguồn</h3>
<div class="lz-map">
  <div class="lz-stage">một trang ở origin khác gọi POST /v2/auth/login bằng JSON</div>
  <div class="lz-node"><span class="lz-badge">1</span><div class="lz-nbody"><div class="lz-ntitle">Trình duyệt thấy request không đơn giản</div><div class="lz-nsub">application/json không nằm trong danh sách Content-Type an toàn</div></div></div>
  <div class="lz-node"><span class="lz-badge">2</span><div class="lz-nbody"><div class="lz-ntitle">Preflight: OPTIONS + Access-Control-Request-Method</div><div class="lz-nsub">request thật phải chờ</div></div></div>
  <div class="lz-node"><span class="lz-badge">3</span><div class="lz-nbody"><div class="lz-ntitle">Server kiểm danh sách cho phép</div><div class="lz-nsub">được ⇒ Allow-Origin, Allow-Methods, Allow-Headers, Max-Age</div></div></div>
  <div class="lz-node"><span class="lz-badge">4</span><div class="lz-nbody"><div class="lz-ntitle">Trình duyệt gửi request thật — hoặc không gửi</div><div class="lz-nsub">không có quyền ⇒ “blocked by CORS policy”, không gửi gì</div></div></div>
</div>
<p><strong>Origin</strong> (nguồn) là scheme + host + port: <code>http://localhost:5173</code> và <code>http://localhost:5174</code> là hai origin khác nhau, API ở <code>http://localhost:4000</code> cũng vậy. JavaScript của một trang được <em>gửi</em> request đi bất cứ đâu, nhưng mặc định không được <em>đọc</em> response từ origin khác. CORS (Cross-Origin Resource Sharing, định nghĩa trong chuẩn Fetch của WHATWG) là cách server nói với trình duyệt: “origin này được đọc response của tôi”.</p>
<ul>
  <li><strong>Simple request</strong> (GET, hoặc POST kiểu form, không có header riêng) thì vẫn được <em>gửi đi</em>; trình duyệt chỉ quyết định sau đó trang có được đọc câu trả lời không.</li>
  <li>Mọi thứ khác — <code>Content-Type: application/json</code>, header <code>Authorization</code>, PATCH, DELETE — trước hết phải qua <strong>preflight</strong>: một request <code>OPTIONS</code> xin phép. Không được phép ⇒ request thật không bao giờ được gửi.</li>
</ul>

<h3>Dựng: danh sách cho phép, không bao giờ “*”</h3>
<pre><code class="language-javascript">// cors.js — bài 6.4: cho đúng những trang web của mình gọi API từ trình duyệt
import { VULN } from './vuln.js';

const ALLOWED = (process.env.LABFLOW_CORS_ORIGINS ?? 'http://localhost:5173').split(',').map((s) =&gt; s.trim());
const ALLOW_HEADERS = 'Authorization, Content-Type, Idempotency-Key, If-Match, If-None-Match, LabFlow-Client, Accept-Language';
const EXPOSE = 'Location, ETag, Link, Retry-After, RateLimit, RateLimit-Policy, Deprecation, Sunset, Idempotent-Replayed, LabFlow-Version';

export function cors(req, res, next) {
  const origin = req.get('Origin');
  res.vary('Origin');                                               // câu trả lời khác nhau theo Origin ⇒ báo cho cache
  if (!origin) return next();                                       // không phải trình duyệt gọi chéo nguồn
  const ok = VULN || ALLOWED.includes(origin);
  if (ok) {
    res.set('Access-Control-Allow-Origin', origin);                 // phản chiếu ĐÚNG origin đã duyệt, không bao giờ "*"
    res.set('Access-Control-Expose-Headers', EXPOSE);
    if (VULN) res.set('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS' &amp;&amp; req.get('Access-Control-Request-Method')) {   // preflight
    if (ok) res.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE')
      .set('Access-Control-Allow-Headers', ALLOW_HEADERS).set('Access-Control-Max-Age', '600');
    return res.status(204).end();
  }
  next();
}</code></pre>
<p><code>Access-Control-Expose-Headers</code> quan trọng với khoá học này: thiếu nó, code trong trình duyệt không đọc được <code>Location</code>, <code>ETag</code>, <code>RateLimit</code> hay <code>Deprecation</code> — những header mà Chương 1–5 dựa vào. <code>Vary: Origin</code> ngăn cache trả câu trả lời của origin này cho origin khác.</p>
<pre><code class="language-bash">curl -si -X OPTIONS http://localhost:4000/v2/auth/login \\
  -H 'Origin: http://localhost:5173' \\
  -H 'Access-Control-Request-Method: POST' \\
  -H 'Access-Control-Request-Headers: content-type' | grep -E '^(HTTP|Access-Control|Vary)'</code></pre>
<div class="out">HTTP/1.1 204 No Content
Vary: Origin
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Expose-Headers: Location, ETag, Link, Retry-After, RateLimit, RateLimit-Policy, Deprecation, Sunset, Idempotent-Replayed, LabFlow-Version
Access-Control-Allow-Methods: GET, HEAD, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type, Idempotency-Key, If-Match, If-None-Match, LabFlow-Client, Accept-Language
Access-Control-Max-Age: 600</div>
<pre><code class="language-bash">curl -si -X OPTIONS http://localhost:4000/v2/auth/login \\
  -H 'Origin: http://localhost:5174' \\
  -H 'Access-Control-Request-Method: POST' \\
  -H 'Access-Control-Request-Headers: content-type' | grep -E '^(HTTP|Access-Control|Vary)'</code></pre>
<div class="out">HTTP/1.1 204 No Content
Vary: Origin</div>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/labs \\
  -H 'Origin: http://localhost:5174' | grep -E '^(HTTP|Access-Control|Vary)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Vary: Origin</div>
<p>Origin được phép nhận câu trả lời preflight đầy đủ; origin lạ nhận 204 mà không có header cho phép nào — còn GET thường từ origin lạ vẫn nhận 200, chỉ là không có <code>Access-Control-Allow-Origin</code>.</p>

<h3>Một trình duyệt thật</h3>
<p>Cùng một trang được phục vụ ở <code>:5173</code> (web app của LabFlow) và <code>:5174</code> (site của người lạ). Nó GET danh sách phòng và POST JSON tới màn đăng nhập. Chromium chạy nó qua Playwright, còn server ghi lại mọi request tới được nó (<code>LABFLOW_LOG=1</code>):</p>
<pre><code class="language-html">&lt;!doctype html&gt;&lt;meta charset="utf-8"&gt;&lt;title&gt;…&lt;/title&gt;
&lt;script type="module"&gt;
// Trang web gọi LabFlow từ một ORIGIN khác (cổng khác = origin khác)
const out = [];
async function t(name, f) { try { out.push(&#96;\${name}: \${await f()}&#96;); } catch (e) { out.push(&#96;\${name}: \${e.name}: \${e.message}&#96;); } }
await t('GET /v2/labs', async () =&gt; (await fetch('http://localhost:4000/v2/labs')).status);
await t('POST /v2/auth/login', async () =&gt; {
  const r = await fetch('http://localhost:4000/v2/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'an@student.labflow.example', password: 'an-lab-2026' }) });
  return &#96;\${r.status}, token \${(await r.json()).accessToken ? 'received' : 'missing'}&#96;;
});
window.__out = out; document.title = 'done';
&lt;/script&gt;</code></pre>
<pre><code class="language-bash">node web/browser.mjs</code></pre>
<div class="out">page http://localhost:5173
  GET /v2/labs: 200
  POST /v2/auth/login: 200, token received
page http://localhost:5174
  GET /v2/labs: TypeError: Failed to fetch
  POST /v2/auth/login: TypeError: Failed to fetch
  console: Access to fetch at 'http://localhost:4000/v2/labs' from origin 'http://localhost:5174' has been blocked by CORS policy: No 'Access-Control-Allow-Origi…
  console: Failed to load resource: net::ERR_FAILED
  console: Access to fetch at 'http://localhost:4000/v2/auth/login' from origin 'http://localhost:5174' has been blocked by CORS policy: Response to preflight re…
  console: Failed to load resource: net::ERR_FAILED</div>
<pre><code class="language-bash">grep -v "chạy ở" srv.log</code></pre>
<div class="out">GET /v2/labs origin=http://localhost:5173
OPTIONS /v2/auth/login origin=http://localhost:5173
POST /v2/auth/login origin=http://localhost:5173
GET /v2/labs origin=http://localhost:5174
OPTIONS /v2/auth/login origin=http://localhost:5174</div>
<p>Đọc kỹ log của server. Từ <code>:5174</code>, <strong>GET đã tới nơi và được trả lời</strong> — trình duyệt chỉ từ chối cho trang xem response. POST JSON bị chặn ở preflight và không bao giờ tới handler đăng nhập. Vậy: CORS bảo vệ <em>trình duyệt của người dùng</em> khỏi những trang đọc dữ liệu chúng không được đọc; nó <strong>không</strong> bảo vệ server khỏi request. curl, Postman và script của kẻ tấn công bỏ qua nó hoàn toàn. Thứ bảo vệ server là xác thực và phân quyền (6.1, 6.2).</p>

<h3>Lỗi nguy hiểm</h3>
<p>Cách nhanh nhất để dòng đỏ biến mất là phản chiếu mọi origin gửi tới và cho phép credentials:</p>
<pre><code class="language-bash">curl -si http://localhost:4000/v2/labs \\
  -H 'Origin: https://evil.example' | grep -E '^(HTTP|Access-Control-Allow)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true</div>
<p>Giờ <em>bất kỳ</em> website nào mà người dùng đang đăng nhập ghé vào cũng gọi được LabFlow kèm cookie của họ và đọc được câu trả lời. (Trình duyệt từ chối <code>*</code> đi kèm credentials chính là để ngăn điều này; phản chiếu origin thì vượt qua chốt đó.)</p>

<h3>CSRF, và vì sao LabFlow không bị</h3>
<p><strong>CSRF</strong> (giả mạo request liên trang): trang của người lạ khiến trình duyệt gửi một request tự động kèm cookie của người dùng — một form POST “huỷ lượt đặt” trong lúc người dùng đang đăng nhập. Nó chỉ hiệu quả khi xác thực dựa vào cookie. LabFlow gửi token trong header <code>Authorization</code>, thứ trình duyệt không bao giờ tự thêm, nên request giả mạo tới nơi mà không có thông tin đăng nhập. Nếu bạn chọn session bằng cookie (6.1), hãy dùng <code>SameSite=Lax</code> hoặc <code>Strict</code>, <code>HttpOnly</code>, <code>Secure</code>, và token chống CSRF cho request làm đổi trạng thái.</p>

<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-5-2-jwt-cors" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp ở SDN302 — bài 5.2: JWT, HTTPS, CORS</span><span class="lc-sub">Nếu bạn đã học SDN302 ở Academy, bạn đã bật CORS để app React gọi được API. Giống: server liệt kê những origin được gọi nó. Khác: SDN302 dùng gói cors(); ở đây bạn tự dựng và xem một trình duyệt thật. Bài này thêm: preflight chi tiết, header được lộ ra, Vary: Origin, bằng chứng CORS không ngăn request tới server, lỗi phản chiếu origin, và CSRF. Chưa học SDN302? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI SDN302 →</span>
</a>

<div class="pitfall"><p><strong>Bẫy — “sửa” CORS ở server cho một lỗi của curl.</strong> curl hỏng thì không phải do CORS; curl không làm CORS.</p></div>
<div class="pitfall"><p><strong>Bẫy — coi header Origin là xác thực.</strong> Client nào ngoài trình duyệt cũng gửi được Origin tuỳ ý. Nó là tín hiệu của trình duyệt, không phải danh tính.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<p><strong>“CORS chống lại cái gì?”</strong> Nó cho server nới chính sách cùng nguồn của trình duyệt với những origin được chọn; nó bảo vệ dữ liệu người dùng khỏi bị script của site khác đọc, không bảo vệ server khỏi request. <strong>“CORS khác CSRF thế nào?”</strong> CSRF lợi dụng thông tin đăng nhập được gửi tự động (cookie); bearer token trong header, cookie SameSite và token chống CSRF ngăn được nó.</p>

<a class="link-card" href="https://fetch.spec.whatwg.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: WHATWG Fetch Standard (cập nhật 19/10/2026) — đọc ngày 1/11/2026</span><span class="lc-sub">Chỉ GET, HEAD và POST là phương thức an toàn cho CORS; Content-Type chỉ an toàn với form-urlencoded, multipart/form-data và text/plain — nên POST JSON cần preflight.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm <code>cors.js</code>; chạy lại các lần thử bằng curl và trình duyệt.</li>
  <li>Bỏ <code>Access-Control-Expose-Headers</code> và chỉ ra trong trình duyệt rằng trang không đọc được <code>ETag</code> nữa.</li>
  <li>Viết một form HTML 10 dòng trên <code>:5174</code> POST tới LabFlow. Cái gì tới được server, và vì sao nó không huỷ được gì?</li>
</ol>
<p><strong>Xong khi:</strong> chỉ origin trong danh sách đọc được response, header được lộ ra đọc được, và bạn giải thích được vì sao GET của trang lạ vẫn tới server.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Origin (nguồn)</span><span class="v">Scheme + host + port của một trang hay một server.</span></div>
  <div class="kv"><span class="k">Same-origin policy</span><span class="v">Luật của trình duyệt: mặc định script không được đọc response từ origin khác.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">Bộ header để server cho các origin được chọn đọc response của mình.</span></div>
  <div class="kv"><span class="k">Preflight</span><span class="v">Request OPTIONS trình duyệt gửi trước với request không đơn giản.</span></div>
  <div class="kv"><span class="k">CSRF</span><span class="v">Request giả mạo dựa vào cookie được trình duyệt tự gửi.</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">Thuộc tính cookie giới hạn khi nào trình duyệt gắn nó vào request liên trang.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>CORS là luật của trình duyệt mà server chọn tham gia: danh sách cho phép, không bao giờ <code>*</code>, kèm <code>Vary: Origin</code>.</li>
  <li>Lộ ra những header client cần (Location, ETag, RateLimit…).</li>
  <li>Đo trong Chromium: GET của người lạ tới được server; POST JSON dừng ở preflight.</li>
  <li>Phản chiếu mọi origin kèm credentials là trao dữ liệu người dùng cho mọi website.</li>
  <li>Bearer token trong header giúp LabFlow miễn nhiễm CSRF kinh điển; app dùng cookie cần SameSite và token.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-8-4-cookie-csrf-thu-hoi" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 8.4 — Cookie, CSRF, thu hồi phiên và chặn dò mật khẩu</span><span class="lc-sub">Khoá Node.js dựng đúng phần này vào một API thật và đo nó. Giống: trình duyệt tự gửi gì và cho trang đọc gì; token Bearer không có bề mặt CSRF. Ở đó học thêm: phía cookie: HttpOnly so với localStorage trong trình duyệt thật, ma trận SameSite trong Chromium 149, double submit, và đăng xuất mọi nơi bằng tokenVersion. Bài này có thứ bài kia không có: phía CORS trong Chromium: GET của người lạ vẫn tới server, POST JSON dừng ở preflight, và lỗi phản chiếu kèm credentials.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-9-1-header-csp-cors" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 9.1 — Đường biên: header bảo mật, CSP và CORS</span><span class="lc-sub">Khoá Node.js chạy đúng phần này trên một server Express thật và đo nó. Giống: CORS chỉ quyết định ai được ĐỌC phản hồi — request của người lạ vẫn tới server; và danh sách trắng kèm Vary: Origin, không bao giờ phản chiếu kèm credentials. Ở đó học thêm: header mà gói cors thật sự gửi cho bốn cấu hình (origin bị từ chối vẫn nhận 204 ở preflight), một POST chuyển tiền trên server không cấu hình CORS gì cả, một cache dùng chung trả nhầm origin khi thiếu Vary, và 12 header của helmet. Bài này có thứ bài kia không có: cùng các luật đó đo trong Chromium thật: GET của người lạ tới được server, POST JSON dừng ở preflight, cộng thêm CSRF.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-3-4-csrf" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn ở khoá Authentication — bài 3.4: CSRF, và ba lớp phòng xếp theo thứ tự</span><span class="lc-sub">Giống: trình duyệt tự gửi gì và cho trang đọc gì. Sâu hơn: năm cấu hình cookie/lớp phòng bị tấn công từ site khác trong Chromium 156 — fetch no-cors vẫn đổi được email (CORS giấu phản hồi, không chặn việc ghi), Lax ⇒ 401, Fetch Metadata hay token đồng bộ ⇒ 403 — và vì sao subdomain cùng site cũng bị từ chối.</span></span>
  <span class="lc-cta">MỞ BÀI AUTHENTICATION →</span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-7-5-https-cors" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 7.5 — HTTPS and CORS from zero</span><span class="lc-sub">A TLS handshake in curl, and proof that a CORS-blocked request still reaches the server</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-7-5-https-cors" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 7.5 — HTTPS và CORS từ số 0</span><span class="lc-sub">Bắt tay TLS trong curl, và bằng chứng request bị CORS chặn vẫn tới máy chủ</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 6.5 Lab (bài MỚI) ─────────────────────────── */
    {
      title: '6.5 — Lab 6: security review — find it, prove it, close it (with rubric)|||6.5 — Lab 6: soát bảo mật — tìm ra, chứng minh, vá lại (có thang chấm)',
      slug: 'api-6-5-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lab chương: bản dựng có công tắc mở lỗ hổng, tìm bằng bộ kiểm, khai thác bằng curl, vá và viết test bảo mật xanh/đỏ; thang chấm 10 điểm, lời giải và transcript thật.',
      content: `${GL6}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lab</span>
<h2>Lab 6 — Security review: find it, prove it, close it</h2>
<p class="lead">The faculty asks for a security review of LabFlow before the new semester. You get the build with the lab switch <code>LABFLOW_VULN=1</code>, which re-opens the holes this chapter closed. Your job is the job of a real reviewer: find each hole with the audit, prove it with an exploit, close it, and leave a test behind so it stays closed.</p>

<h3>What is switched on</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">find and exploit</span><span class="lz-d">audit.mjs + one curl per FAIL</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">fix</span><span class="lz-d">policy, tokens, schema, safeFetch, CORS</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">prove</span><span class="lz-d">tests green fixed, red with LABFLOW_VULN=1</span></div>
  <div class="lz-step"><span class="lz-k">score</span><span class="lz-t">rubric</span><span class="lz-d">10 points, pass at 7</span></div>
</div>
<a class="link-card" href="https://api-security.owasp.org/editions/2023/en/0x11-t10" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: OWASP API Security Top 10 — 2023 edition — read 1 Nov 2026</span><span class="lc-sub">The risks this security review checks, in the 2023 edition.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<ul>
  <li>The receipt endpoint skips the object-level check (API1).</li>
  <li>The JWT verifier accepts <code>"alg": "none"</code> and ignores expiry (API2); the login has no rate limit (API2).</li>
  <li><code>PATCH /v2/me</code> copies the whole body into the user record (API3).</li>
  <li><code>safeFetch</code> fetches any URL and follows redirects (API7).</li>
  <li>CORS reflects any origin and allows credentials (API8).</li>
</ul>
<p>Budget: exploit 30 min · fix 60 min · prove 20 min.</p>

<h3>The audit script you start from</h3>
<p>This is the whole <code>audit.mjs</code> from lesson 6.3: one or two real requests per risk of the OWASP API Top 10 (2023). Copy it next to the project; LabFlow must run on port 4000.</p>
<pre><code class="language-javascript">// audit.mjs — bài 6.3: tự kiểm LabFlow theo OWASP API Security Top 10 (bản 2023) bằng request THẬT
const BASE = 'http://localhost:4000';
const j = (o) =&gt; JSON.stringify(o);
const call = (path, { method = 'GET', token, body, headers = {} } = {}) =&gt; fetch(BASE + path, { method,
  headers: { ...(token &amp;&amp; { Authorization: &#96;Bearer \${token}&#96; }), ...(body !== undefined &amp;&amp; { 'Content-Type': 'application/json' }), ...headers },
  body: body === undefined ? undefined : (typeof body === 'string' ? body : j(body)) });
const login = async (email, password) =&gt; (await (await call('/v2/auth/login', { method: 'POST', body: { email, password } })).json()).accessToken;
const an = await login('an@student.labflow.example', 'an-lab-2026');
const lan = await login('lan@labflow.example', 'lan-lab-2026');
const b64u = (o) =&gt; Buffer.from(j(o)).toString('base64url');
const day = (d) =&gt; ({ start: &#96;2027-03-0\${d}T08:00:00+07:00&#96;, end: &#96;2027-03-0\${d}T10:00:00+07:00&#96; });

const checks = [
  ['API1 BOLA', 'Bin reads An’s receipt', async () =&gt; {
    const bin = await login('binh@student.labflow.example', 'binh-lab-2026');
    const r = await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_1', period: day(1) } });
    const id = (await r.json()).id;
    return (await call(&#96;/v2/bookings/\${id}/receipt&#96;, { token: bin })).status === 404; }],
  ['API2 Broken auth', 'token with alg "none"', async () =&gt; {
    const p = JSON.parse(Buffer.from(an.split('.')[1], 'base64url'));
    const forged = &#96;\${b64u({ alg: 'none', typ: 'JWT' })}.\${b64u({ ...p, sub: 'usr_3', role: 'LAB_MANAGER' })}.&#96;;
    return (await call('/v2/admin/deprecations', { token: forged })).status === 401; }],
  ['API2 Broken auth', '6 wrong passwords ⇒ 429', async () =&gt; {
    let last;
    for (let i = 0; i &lt; 6; i++) last = (await call('/v2/auth/login', { method: 'POST', body: { email: 'binh@student.labflow.example', password: &#96;x\${i}&#96; } })).status;
    return last === 429; }],
  ['API3 Property level', 'PATCH /v2/me {"role":"LAB_MANAGER"}', async () =&gt; {
    const s = (await call('/v2/me', { method: 'PATCH', token: an, body: { role: 'LAB_MANAGER' } })).status;
    const me = await (await call('/v2/me', { token: an })).json();
    return s === 400 &amp;&amp; me.role === 'STUDENT'; }],
  ['API3 Property level', 'GET /v2/me hides passwordHash', async () =&gt; !('passwordHash' in await (await call('/v2/me', { token: an })).json())],
  ['API4 Resources', 'limit=1000 ⇒ 400, 20 KB body ⇒ 413', async () =&gt;
    (await call('/v2/bookings?limit=1000', { token: an })).status === 400
    &amp;&amp; (await call('/v2/bookings', { method: 'POST', token: an, body: j({ purpose: 'x'.repeat(20000) }) })).status === 413],
  ['API5 Function level', 'student PATCHes a device', async () =&gt;
    (await call('/v2/devices/dev_1', { method: 'PATCH', token: an, body: { note: 'x' }, headers: { 'Content-Type': 'application/merge-patch+json' } })).status === 403],
  ['API6 Business flows', 'student holds a 4th active booking', async () =&gt; {
    let last;
    for (const d of [2, 3, 4]) last = (await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_2', period: day(d) } })).status;
    return last === 422; }],
  ['API7 SSRF', 'manual URL http://127.0.0.1:4000/health', async () =&gt;
    (await call('/v2/devices/dev_1/manual', { method: 'POST', token: lan, body: { url: 'http://127.0.0.1:4000/health' } })).status === 422],
  ['API7 SSRF', 'manual URL https://169.254.169.254/…', async () =&gt;
    (await call('/v2/devices/dev_1/manual', { method: 'POST', token: lan, body: { url: 'https://169.254.169.254/latest/meta-data/' } })).status === 422],
  ['API8 Misconfiguration', 'no X-Powered-By, CORS refuses evil origin', async () =&gt; {
    const r = await call('/health', { headers: { Origin: 'https://evil.example' } });
    return !r.headers.has('x-powered-by') &amp;&amp; !r.headers.has('access-control-allow-origin'); }],
  ['API9 Inventory', 'old unversioned path announces its end', async () =&gt; (await call('/labs')).headers.has('deprecation')],
];
let fails = 0;
for (const [risk, what, test] of checks) {
  let ok;
  try { ok = await test(); } catch (e) { ok = false; }
  if (!ok) fails++;
  console.log(&#96;\${ok ? 'PASS' : 'FAIL'}  \${risk.padEnd(22)} \${what}&#96;);
}
console.log('—     API10 Unsafe consumption  LabFlow calls no third-party API yet — nothing to test');
console.log(fails ? &#96;✗ \${fails} kiểm thất bại&#96; : '✓ mọi kiểm đạt');</code></pre>

<h3>Part A — find and exploit (<code>FINDINGS.md</code>)</h3>
<ol>
  <li>Run <code>node audit.mjs</code> against the vulnerable build and list every FAIL.</li>
  <li>For each one, one curl command that exploits it and its real output.</li>
  <li>Explain why API5 and API6 fail although nothing was switched off for them.</li>
  <li>Rate each finding: impact (who is hurt, what leaks) and how easy it is to exploit.</li>
</ol>

<h3>Part B — fix: rules</h3>
<ol>
  <li>Every object access through <code>authorize()</code>; forbidden records answer 404.</li>
  <li>The verifier accepts only HS256 with a valid signature, <code>iss</code> and <code>exp</code>; login limited per (IP, email).</li>
  <li><code>PATCH /v2/me</code> with a strict schema of the editable fields only.</li>
  <li><code>safeFetch</code>: https only, resolve and refuse private addresses, no redirects.</li>
  <li>CORS from an allow-list; never reflect, never <code>*</code> with credentials.</li>
  <li><code>test/security.test.mjs</code>: one <code>node:test</code> per finding, green on the fixed build and red with <code>LABFLOW_VULN=1</code>.</li>
</ol>

<h3>Part C — prove it (<code>TRANSCRIPT.md</code>)</h3>
<ol>
  <li>The audit against the vulnerable build; two exploits in full.</li>
  <li>After the fixes: the authorisation matrix, the audit, <code>npm test</code> — and <code>npm test</code> again with the switch on, red.</li>
</ol>

<h3>Rubric — 10 points</h3>
<table>
  <thead><tr><th>Points</th><th>Criterion</th><th>Checked by</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Every FAIL found and exploited with real output; the API5/API6 chain explained</td><td>FINDINGS.md</td></tr>
    <tr><td>2</td><td>BOLA closed with one policy and 404; matrix 0 wrong cells</td><td>step 2 · code</td></tr>
    <tr><td>2</td><td>Tokens: fixed algorithm, signature, expiry; login limit</td><td>audit · tests</td></tr>
    <tr><td>1</td><td>Mass assignment closed by a strict schema</td><td>audit · tests</td></tr>
    <tr><td>1</td><td>SSRF and CORS closed</td><td>audit · tests</td></tr>
    <tr><td>1</td><td>Security tests green when fixed, red when vulnerable</td><td>step 2</td></tr>
    <tr><td>1</td><td>Transcript complete and unedited</td><td>the file</td></tr>
  </tbody>
</table>
<p><strong>Pass: 7/10.</strong> Hand in <code>FINDINGS.md</code>, the changed files, the test file and <code>TRANSCRIPT.md</code> in one commit.</p>

<h3>Stretch goals</h3>
<ul>
  <li>Add a refresh token with rotation: a reused refresh token logs the user out everywhere.</li>
  <li>Run the audit and the security tests in CI on every push.</li>
</ul>

<h3>Reference solution — read after you have tried</h3>
<p>The fixed code is the code of lessons 6.1–6.4: <code>verifyJwt</code> with the algorithm fixed by the server, the login limiter, <code>MePatch</code> as a strict schema, <code>authorize()</code> on the receipt, <code>safeFetch</code> with resolution and no redirects, <code>cors.js</code> with an allow-list. The tests:</p>
<pre><code class="language-javascript">// test/security.test.mjs — Lab 6: mỗi lỗ hổng đã vá có MỘT test giữ nó đóng
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';

let server, base, an, bin, lan;
const call = (path, { method = 'GET', token, body, headers = {} } = {}) =&gt; fetch(base + path, { method,
  headers: { ...(token &amp;&amp; { Authorization: &#96;Bearer \${token}&#96; }), ...(body &amp;&amp; { 'Content-Type': 'application/json' }), ...headers },
  body: body &amp;&amp; JSON.stringify(body) });
const login = async (email, password) =&gt; (await (await call('/v2/auth/login', { method: 'POST', body: { email, password } })).json()).accessToken;
before(async () =&gt; {
  await new Promise((ok) =&gt; { server = app.listen(0, () =&gt; { base = &#96;http://localhost:\${server.address().port}&#96;; ok(); }); });
  an = await login('an@student.labflow.example', 'an-lab-2026');
  bin = await login('binh@student.labflow.example', 'binh-lab-2026');
  lan = await login('lan@labflow.example', 'lan-lab-2026');
});
after(() =&gt; server.close());

test('API1: một sinh viên không đọc được biên nhận của người khác (404)', async () =&gt; {
  const r = await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_1',
    period: { start: '2027-04-01T08:00:00+07:00', end: '2027-04-01T10:00:00+07:00' } } });
  const { id } = await r.json();
  assert.equal((await call(&#96;/v2/bookings/\${id}/receipt&#96;, { token: an })).status, 200);
  assert.equal((await call(&#96;/v2/bookings/\${id}/receipt&#96;, { token: bin })).status, 404);
});

test('API2: token alg "none" và token bị sửa đều bị từ chối', async () =&gt; {
  const [h, p, s] = an.split('.');
  const body = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(p, 'base64url')), sub: 'usr_3', role: 'LAB_MANAGER' })).toString('base64url');
  const none = &#96;\${Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url')}.\${body}.&#96;;
  assert.equal((await call('/v2/me', { token: none })).status, 401);
  assert.equal((await call('/v2/me', { token: &#96;\${h}.\${body}.\${s}&#96; })).status, 401);
});

test('API3: PATCH /v2/me không đổi được vai trò', async () =&gt; {
  assert.equal((await call('/v2/me', { method: 'PATCH', token: an, body: { role: 'LAB_MANAGER' } })).status, 400);
  assert.equal((await (await call('/v2/me', { token: an })).json()).role, 'STUDENT');
});

test('API7: không tải URL nội bộ', async () =&gt; {
  for (const url of ['http://127.0.0.1:4000/health', 'https://169.254.169.254/latest/meta-data/', 'https://localhost/x']) {
    assert.equal((await call('/v2/devices/dev_1/manual', { method: 'POST', token: lan, body: { url } })).status, 422, url);
  }
});

test('API8: CORS chỉ cho origin đã duyệt, không bao giờ "*"', async () =&gt; {
  const evil = await call('/v2/labs', { headers: { Origin: 'https://evil.example' } });
  assert.equal(evil.headers.get('access-control-allow-origin'), null);
  const ok = await call('/v2/labs', { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(ok.headers.get('access-control-allow-origin'), 'http://localhost:5173');
});</code></pre>

<h3>Reference transcript (real run)</h3>
<pre><code class="language-bash">node audit.mjs | tail -4</code></pre>
<div class="out">FAIL  API8 Misconfiguration  no X-Powered-By, CORS refuses evil origin
PASS  API9 Inventory         old unversioned path announces its end
—     API10 Unsafe consumption  LabFlow calls no third-party API yet — nothing to test
✗ 9 kiểm thất bại</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"an@student.labflow.example","password":"an-lab-2026"}' | jq -r .accessToken &gt; an.jwt</code></pre>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v2/me \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  --json '{"role":"LAB_MANAGER"}' | jq -c .</code></pre>
<div class="out">{"id":"usr_1","name":"Nguyễn Văn An","role":"LAB_MANAGER","email":"an@student.labflow.example"}</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v2/devices/dev_1 \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"status":"MAINTENANCE","note":"An đã ở đây"}' | jq -c '{id, status, note}'</code></pre>
<div class="out">{"id":"dev_1","status":"MAINTENANCE","note":"An đã ở đây"}</div>
<p>The second exploit is the chain behind the API5/API6 failures: An made herself a manager through <code>PATCH /v2/me</code>, then used a manager-only operation.</p>
<pre><code class="language-bash">node authz-matrix.mjs | tail -1</code></pre>
<div class="out">✓ 0 ô sai chính sách</div>
<pre><code class="language-bash">node audit.mjs | tail -2</code></pre>
<div class="out">—     API10 Unsafe consumption  LabFlow calls no third-party API yet — nothing to test
✓ mọi kiểm đạt</div>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E '^(ℹ tests|ℹ pass|ℹ fail)'</code></pre>
<div class="out">ℹ tests 10
ℹ pass 10
ℹ fail 0</div>
<pre><code class="language-bash">LABFLOW_VULN=1 npm test 2&gt;&amp;1 | grep -E '^(✖ API|ℹ pass|ℹ fail)' | sort -u</code></pre>
<div class="out">✖ API1: một sinh viên không đọc được biên nhận của người khác (404) (143.106875ms)
✖ API2: token alg "none" và token bị sửa đều bị từ chối (1.777333ms)
✖ API3: PATCH /v2/me không đổi được vai trò (1.707583ms)
✖ API7: không tải URL nội bộ (5.454833ms)
✖ API8: CORS chỉ cho origin đã duyệt, không bao giờ "*" (1.809583ms)
ℹ fail 5
ℹ pass 5</div>
<p>One detail from writing this transcript: the matrix runs <em>before</em> the audit. The audit deliberately triggers Bin’s login limit; run the other way round, Bin cannot log in for the matrix and every one of his cells fails — a rate limit doing its job.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Lab</span>
<h2>Lab 6 — Soát bảo mật: tìm ra, chứng minh, vá lại</h2>
<p class="lead">Khoa yêu cầu soát bảo mật LabFlow trước học kỳ mới. Bạn nhận bản dựng có công tắc của lab <code>LABFLOW_VULN=1</code>, công tắc mở lại những lỗ hổng mà chương này đã vá. Việc của bạn là việc của một người soát thật: tìm từng lỗ bằng bộ kiểm, chứng minh bằng một lần khai thác, vá lại, và để lại một test để nó mãi đóng.</p>

<h3>Những gì đang bị bật</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A</span><span class="lz-t">tìm và khai thác</span><span class="lz-d">audit.mjs + mỗi FAIL một lệnh curl</span></div>
  <div class="lz-step"><span class="lz-k">B</span><span class="lz-t">vá</span><span class="lz-d">chính sách, token, schema, safeFetch, CORS</span></div>
  <div class="lz-step"><span class="lz-k">C</span><span class="lz-t">chứng minh</span><span class="lz-d">test xanh khi vá, đỏ với LABFLOW_VULN=1</span></div>
  <div class="lz-step"><span class="lz-k">chấm</span><span class="lz-t">thang điểm</span><span class="lz-d">10 điểm, đạt từ 7</span></div>
</div>
<a class="link-card" href="https://api-security.owasp.org/editions/2023/en/0x11-t10" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: OWASP API Security Top 10 — bản 2023 — đọc ngày 1/11/2026</span><span class="lc-sub">Các rủi ro mà buổi review bảo mật này kiểm, theo bản 2023.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<ul>
  <li>Endpoint biên nhận bỏ qua phép kiểm theo đối tượng (API1).</li>
  <li>Bộ kiểm JWT nhận <code>"alg": "none"</code> và bỏ qua hạn dùng (API2); đăng nhập không bị giới hạn (API2).</li>
  <li><code>PATCH /v2/me</code> chép nguyên body vào bản ghi người dùng (API3).</li>
  <li><code>safeFetch</code> tải mọi URL và đi theo chuyển hướng (API7).</li>
  <li>CORS phản chiếu mọi origin và cho phép credentials (API8).</li>
</ul>
<p>Thời gian: khai thác 30 phút · vá 60 phút · chứng minh 20 phút.</p>

<h3>Script kiểm bạn bắt đầu từ đó</h3>
<p>Đây là trọn <code>audit.mjs</code> của bài 6.3: mỗi rủi ro của OWASP API Top 10 (2023) một hai request thật. Chép nó cạnh dự án; LabFlow phải chạy ở cổng 4000.</p>
<pre><code class="language-javascript">// audit.mjs — bài 6.3: tự kiểm LabFlow theo OWASP API Security Top 10 (bản 2023) bằng request THẬT
const BASE = 'http://localhost:4000';
const j = (o) =&gt; JSON.stringify(o);
const call = (path, { method = 'GET', token, body, headers = {} } = {}) =&gt; fetch(BASE + path, { method,
  headers: { ...(token &amp;&amp; { Authorization: &#96;Bearer \${token}&#96; }), ...(body !== undefined &amp;&amp; { 'Content-Type': 'application/json' }), ...headers },
  body: body === undefined ? undefined : (typeof body === 'string' ? body : j(body)) });
const login = async (email, password) =&gt; (await (await call('/v2/auth/login', { method: 'POST', body: { email, password } })).json()).accessToken;
const an = await login('an@student.labflow.example', 'an-lab-2026');
const lan = await login('lan@labflow.example', 'lan-lab-2026');
const b64u = (o) =&gt; Buffer.from(j(o)).toString('base64url');
const day = (d) =&gt; ({ start: &#96;2027-03-0\${d}T08:00:00+07:00&#96;, end: &#96;2027-03-0\${d}T10:00:00+07:00&#96; });

const checks = [
  ['API1 BOLA', 'Bin reads An’s receipt', async () =&gt; {
    const bin = await login('binh@student.labflow.example', 'binh-lab-2026');
    const r = await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_1', period: day(1) } });
    const id = (await r.json()).id;
    return (await call(&#96;/v2/bookings/\${id}/receipt&#96;, { token: bin })).status === 404; }],
  ['API2 Broken auth', 'token with alg "none"', async () =&gt; {
    const p = JSON.parse(Buffer.from(an.split('.')[1], 'base64url'));
    const forged = &#96;\${b64u({ alg: 'none', typ: 'JWT' })}.\${b64u({ ...p, sub: 'usr_3', role: 'LAB_MANAGER' })}.&#96;;
    return (await call('/v2/admin/deprecations', { token: forged })).status === 401; }],
  ['API2 Broken auth', '6 wrong passwords ⇒ 429', async () =&gt; {
    let last;
    for (let i = 0; i &lt; 6; i++) last = (await call('/v2/auth/login', { method: 'POST', body: { email: 'binh@student.labflow.example', password: &#96;x\${i}&#96; } })).status;
    return last === 429; }],
  ['API3 Property level', 'PATCH /v2/me {"role":"LAB_MANAGER"}', async () =&gt; {
    const s = (await call('/v2/me', { method: 'PATCH', token: an, body: { role: 'LAB_MANAGER' } })).status;
    const me = await (await call('/v2/me', { token: an })).json();
    return s === 400 &amp;&amp; me.role === 'STUDENT'; }],
  ['API3 Property level', 'GET /v2/me hides passwordHash', async () =&gt; !('passwordHash' in await (await call('/v2/me', { token: an })).json())],
  ['API4 Resources', 'limit=1000 ⇒ 400, 20 KB body ⇒ 413', async () =&gt;
    (await call('/v2/bookings?limit=1000', { token: an })).status === 400
    &amp;&amp; (await call('/v2/bookings', { method: 'POST', token: an, body: j({ purpose: 'x'.repeat(20000) }) })).status === 413],
  ['API5 Function level', 'student PATCHes a device', async () =&gt;
    (await call('/v2/devices/dev_1', { method: 'PATCH', token: an, body: { note: 'x' }, headers: { 'Content-Type': 'application/merge-patch+json' } })).status === 403],
  ['API6 Business flows', 'student holds a 4th active booking', async () =&gt; {
    let last;
    for (const d of [2, 3, 4]) last = (await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_2', period: day(d) } })).status;
    return last === 422; }],
  ['API7 SSRF', 'manual URL http://127.0.0.1:4000/health', async () =&gt;
    (await call('/v2/devices/dev_1/manual', { method: 'POST', token: lan, body: { url: 'http://127.0.0.1:4000/health' } })).status === 422],
  ['API7 SSRF', 'manual URL https://169.254.169.254/…', async () =&gt;
    (await call('/v2/devices/dev_1/manual', { method: 'POST', token: lan, body: { url: 'https://169.254.169.254/latest/meta-data/' } })).status === 422],
  ['API8 Misconfiguration', 'no X-Powered-By, CORS refuses evil origin', async () =&gt; {
    const r = await call('/health', { headers: { Origin: 'https://evil.example' } });
    return !r.headers.has('x-powered-by') &amp;&amp; !r.headers.has('access-control-allow-origin'); }],
  ['API9 Inventory', 'old unversioned path announces its end', async () =&gt; (await call('/labs')).headers.has('deprecation')],
];
let fails = 0;
for (const [risk, what, test] of checks) {
  let ok;
  try { ok = await test(); } catch (e) { ok = false; }
  if (!ok) fails++;
  console.log(&#96;\${ok ? 'PASS' : 'FAIL'}  \${risk.padEnd(22)} \${what}&#96;);
}
console.log('—     API10 Unsafe consumption  LabFlow calls no third-party API yet — nothing to test');
console.log(fails ? &#96;✗ \${fails} kiểm thất bại&#96; : '✓ mọi kiểm đạt');</code></pre>

<h3>Phần A — tìm và khai thác (<code>FINDINGS.md</code>)</h3>
<ol>
  <li>Chạy <code>node audit.mjs</code> với bản dựng có lỗ hổng và liệt kê mọi FAIL.</li>
  <li>Mỗi FAIL một lệnh curl khai thác nó, kèm output thật.</li>
  <li>Giải thích vì sao API5 và API6 hỏng dù không có gì bị tắt cho chúng.</li>
  <li>Đánh giá từng phát hiện: tác động (ai bị hại, cái gì bị lộ) và mức dễ khai thác.</li>
</ol>

<h3>Phần B — vá: các luật</h3>
<ol>
  <li>Mọi lần truy cập đối tượng đi qua <code>authorize()</code>; bản ghi bị cấm trả 404.</li>
  <li>Bộ kiểm token chỉ nhận HS256 có chữ ký hợp lệ, <code>iss</code> và <code>exp</code>; đăng nhập bị giới hạn theo (IP, email).</li>
  <li><code>PATCH /v2/me</code> có lược đồ strict chỉ gồm các trường được sửa.</li>
  <li><code>safeFetch</code>: chỉ https, phân giải rồi từ chối địa chỉ nội bộ, không chuyển hướng.</li>
  <li>CORS theo danh sách cho phép; không phản chiếu, không bao giờ <code>*</code> kèm credentials.</li>
  <li><code>test/security.test.mjs</code>: mỗi phát hiện một test <code>node:test</code>, xanh ở bản đã vá và đỏ khi <code>LABFLOW_VULN=1</code>.</li>
</ol>

<h3>Phần C — chứng minh (<code>TRANSCRIPT.md</code>)</h3>
<ol>
  <li>Bộ kiểm chạy trên bản có lỗ hổng; hai lần khai thác đầy đủ.</li>
  <li>Sau khi vá: ma trận phân quyền, bộ kiểm, <code>npm test</code> — và <code>npm test</code> lần nữa khi bật công tắc, màu đỏ.</li>
</ol>

<h3>Thang chấm — 10 điểm</h3>
<table>
  <thead><tr><th>Điểm</th><th>Tiêu chí</th><th>Kiểm bằng</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Tìm ra và khai thác mọi FAIL với output thật; giải thích chuỗi API5/API6</td><td>FINDINGS.md</td></tr>
    <tr><td>2</td><td>BOLA được vá bằng một chính sách và 404; ma trận 0 ô sai</td><td>bước 2 · code</td></tr>
    <tr><td>2</td><td>Token: thuật toán cố định, chữ ký, hạn dùng; giới hạn đăng nhập</td><td>bộ kiểm · test</td></tr>
    <tr><td>1</td><td>Mass assignment được vá bằng lược đồ strict</td><td>bộ kiểm · test</td></tr>
    <tr><td>1</td><td>SSRF và CORS được vá</td><td>bộ kiểm · test</td></tr>
    <tr><td>1</td><td>Test bảo mật xanh khi đã vá, đỏ khi có lỗ hổng</td><td>bước 2</td></tr>
    <tr><td>1</td><td>Transcript đầy đủ, không chỉnh sửa</td><td>tệp nộp</td></tr>
  </tbody>
</table>
<p><strong>Đạt: 7/10.</strong> Nộp <code>FINDINGS.md</code>, các tệp đã sửa, tệp test và <code>TRANSCRIPT.md</code> trong một commit.</p>

<h3>Mục tiêu nâng cao</h3>
<ul>
  <li>Thêm refresh token có xoay vòng: một refresh token bị dùng lại sẽ đăng xuất người dùng ở mọi nơi.</li>
  <li>Chạy bộ kiểm và test bảo mật trong CI mỗi lần push.</li>
</ul>

<h3>Lời giải tham khảo — đọc sau khi đã tự làm</h3>
<p>Code đã vá chính là code của bài 6.1–6.4: <code>verifyJwt</code> với thuật toán do server cố định, bộ giới hạn đăng nhập, <code>MePatch</code> là lược đồ strict, <code>authorize()</code> trên biên nhận, <code>safeFetch</code> có phân giải và không chuyển hướng, <code>cors.js</code> có danh sách cho phép. Các test:</p>
<pre><code class="language-javascript">// test/security.test.mjs — Lab 6: mỗi lỗ hổng đã vá có MỘT test giữ nó đóng
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';

let server, base, an, bin, lan;
const call = (path, { method = 'GET', token, body, headers = {} } = {}) =&gt; fetch(base + path, { method,
  headers: { ...(token &amp;&amp; { Authorization: &#96;Bearer \${token}&#96; }), ...(body &amp;&amp; { 'Content-Type': 'application/json' }), ...headers },
  body: body &amp;&amp; JSON.stringify(body) });
const login = async (email, password) =&gt; (await (await call('/v2/auth/login', { method: 'POST', body: { email, password } })).json()).accessToken;
before(async () =&gt; {
  await new Promise((ok) =&gt; { server = app.listen(0, () =&gt; { base = &#96;http://localhost:\${server.address().port}&#96;; ok(); }); });
  an = await login('an@student.labflow.example', 'an-lab-2026');
  bin = await login('binh@student.labflow.example', 'binh-lab-2026');
  lan = await login('lan@labflow.example', 'lan-lab-2026');
});
after(() =&gt; server.close());

test('API1: một sinh viên không đọc được biên nhận của người khác (404)', async () =&gt; {
  const r = await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_1',
    period: { start: '2027-04-01T08:00:00+07:00', end: '2027-04-01T10:00:00+07:00' } } });
  const { id } = await r.json();
  assert.equal((await call(&#96;/v2/bookings/\${id}/receipt&#96;, { token: an })).status, 200);
  assert.equal((await call(&#96;/v2/bookings/\${id}/receipt&#96;, { token: bin })).status, 404);
});

test('API2: token alg "none" và token bị sửa đều bị từ chối', async () =&gt; {
  const [h, p, s] = an.split('.');
  const body = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(p, 'base64url')), sub: 'usr_3', role: 'LAB_MANAGER' })).toString('base64url');
  const none = &#96;\${Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url')}.\${body}.&#96;;
  assert.equal((await call('/v2/me', { token: none })).status, 401);
  assert.equal((await call('/v2/me', { token: &#96;\${h}.\${body}.\${s}&#96; })).status, 401);
});

test('API3: PATCH /v2/me không đổi được vai trò', async () =&gt; {
  assert.equal((await call('/v2/me', { method: 'PATCH', token: an, body: { role: 'LAB_MANAGER' } })).status, 400);
  assert.equal((await (await call('/v2/me', { token: an })).json()).role, 'STUDENT');
});

test('API7: không tải URL nội bộ', async () =&gt; {
  for (const url of ['http://127.0.0.1:4000/health', 'https://169.254.169.254/latest/meta-data/', 'https://localhost/x']) {
    assert.equal((await call('/v2/devices/dev_1/manual', { method: 'POST', token: lan, body: { url } })).status, 422, url);
  }
});

test('API8: CORS chỉ cho origin đã duyệt, không bao giờ "*"', async () =&gt; {
  const evil = await call('/v2/labs', { headers: { Origin: 'https://evil.example' } });
  assert.equal(evil.headers.get('access-control-allow-origin'), null);
  const ok = await call('/v2/labs', { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(ok.headers.get('access-control-allow-origin'), 'http://localhost:5173');
});</code></pre>

<h3>Transcript tham khảo (chạy thật)</h3>
<pre><code class="language-bash">node audit.mjs | tail -4</code></pre>
<div class="out">FAIL  API8 Misconfiguration  no X-Powered-By, CORS refuses evil origin
PASS  API9 Inventory         old unversioned path announces its end
—     API10 Unsafe consumption  LabFlow calls no third-party API yet — nothing to test
✗ 9 kiểm thất bại</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"an@student.labflow.example","password":"an-lab-2026"}' | jq -r .accessToken &gt; an.jwt</code></pre>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v2/me \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  --json '{"role":"LAB_MANAGER"}' | jq -c .</code></pre>
<div class="out">{"id":"usr_1","name":"Nguyễn Văn An","role":"LAB_MANAGER","email":"an@student.labflow.example"}</div>
<pre><code class="language-bash">curl -s \\
  -X PATCH http://localhost:4000/v2/devices/dev_1 \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  -H 'Content-Type: application/merge-patch+json' \\
  -d '{"status":"MAINTENANCE","note":"An đã ở đây"}' | jq -c '{id, status, note}'</code></pre>
<div class="out">{"id":"dev_1","status":"MAINTENANCE","note":"An đã ở đây"}</div>
<p>Lần khai thác thứ hai chính là chuỗi đằng sau các FAIL của API5/API6: An tự biến mình thành quản lý qua <code>PATCH /v2/me</code>, rồi dùng một thao tác chỉ quản lý mới được làm.</p>
<pre><code class="language-bash">node authz-matrix.mjs | tail -1</code></pre>
<div class="out">✓ 0 ô sai chính sách</div>
<pre><code class="language-bash">node audit.mjs | tail -2</code></pre>
<div class="out">—     API10 Unsafe consumption  LabFlow calls no third-party API yet — nothing to test
✓ mọi kiểm đạt</div>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E '^(ℹ tests|ℹ pass|ℹ fail)'</code></pre>
<div class="out">ℹ tests 10
ℹ pass 10
ℹ fail 0</div>
<pre><code class="language-bash">LABFLOW_VULN=1 npm test 2&gt;&amp;1 | grep -E '^(✖ API|ℹ pass|ℹ fail)' | sort -u</code></pre>
<div class="out">✖ API1: một sinh viên không đọc được biên nhận của người khác (404) (143.106875ms)
✖ API2: token alg "none" và token bị sửa đều bị từ chối (1.777333ms)
✖ API3: PATCH /v2/me không đổi được vai trò (1.707583ms)
✖ API7: không tải URL nội bộ (5.454833ms)
✖ API8: CORS chỉ cho origin đã duyệt, không bao giờ "*" (1.809583ms)
ℹ fail 5
ℹ pass 5</div>
<p>Một chi tiết khi viết transcript này: ma trận chạy <em>trước</em> bộ kiểm. Bộ kiểm cố ý kích hoạt giới hạn đăng nhập của Bin; chạy ngược thứ tự thì Bin không đăng nhập được cho ma trận và mọi ô của bạn ấy đều hỏng — một bộ giới hạn đang làm đúng việc của nó.</p>
</div>
`,
    },
    /* ─────────────────────────── 6.6 Quiz (bài MỚI) ─────────────────────────── */
    {
      title: '6.6 — Chapter 6 check: security for APIs|||6.6 — Kiểm tra Chương 6: bảo mật cho API',
      slug: 'api-6-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về JWT, token giả, dò người dùng, giới hạn đăng nhập, BOLA, 404 hay 403, chuỗi lỗ hổng, SSRF, CORS và CSRF; mỗi câu có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Check</span>
<h2>Chapter 6 check: security for APIs</h2>
<p class="lead">Ten situations from LabFlow’s login, tokens, receipts, audit and browser tests. Each explanation says why the right answer is right and why the most tempting wrong answer is wrong. Aim for 7/10.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can compare sessions, JWT, API keys and OAuth and choose one for a given client.</li>
  <li>I can explain why a forged payload, alg none and an expired token are refused.</li>
  <li>I can find and fix a BOLA and prove the fix with an authorisation matrix.</li>
  <li>I can name the OWASP API Top 10 (2023) with one LabFlow example each.</li>
  <li>I can explain what CORS does and does not protect, and why bearer tokens avoid CSRF.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Kiểm tra Chương 6: bảo mật cho API</h2>
<p class="lead">Mười tình huống từ đăng nhập, token, biên nhận, bộ kiểm và các lần thử trình duyệt của LabFlow. Mỗi phần giải thích nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Nhắm 7/10.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi so sánh được session, JWT, API key và OAuth và chọn được một cách cho từng loại client.</li>
  <li>Tôi giải thích được vì sao payload bị sửa, alg none và token hết hạn đều bị từ chối.</li>
  <li>Tôi tìm và vá được một lỗi BOLA, rồi chứng minh bằng ma trận phân quyền.</li>
  <li>Tôi kể được OWASP API Top 10 (2023), mỗi mục một ví dụ trên LabFlow.</li>
  <li>Tôi giải thích được CORS bảo vệ gì và không bảo vệ gì, và vì sao bearer token tránh được CSRF.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "An’s JWT payload is {\"iss\":\"labflow\",\"sub\":\"usr_1\",\"role\":\"STUDENT\",…}. What is true?|||Payload JWT của An là {\"iss\":\"labflow\",\"sub\":\"usr_1\",\"role\":\"STUDENT\",…}. Điều nào đúng?",
            options: [
              "Anyone can read it; it is signed, not encrypted — never put secrets in it|||Ai cũng đọc được; nó được ký chứ không mã hoá — không bao giờ đặt bí mật vào đó",
              "Only the server can read it because it is encrypted with HS256|||Chỉ server đọc được vì nó được mã hoá bằng HS256",
              "The client can change role safely because the server re-reads the database|||Client đổi role được an toàn vì server đọc lại cơ sở dữ liệu",
              "It must contain the password hash to be verified|||Nó phải chứa bản băm mật khẩu để được kiểm",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: The payload decoded with base64url in lesson 6.1. HS256 is a signature (HMAC), not encryption; changing any byte breaks it.|||VI: Payload được giải bằng base64url ở bài 6.1. HS256 là chữ ký (HMAC), không phải mã hoá; đổi bất kỳ byte nào là chữ ký hỏng.",
          },
          {
            question: "forge.mjs changed sub and role to Lan but kept the original signature. LabFlow answered …|||forge.mjs đổi sub và role thành cô Lan nhưng giữ chữ ký cũ. LabFlow trả …",
            options: [
              "200 with Lan’s data|||200 với dữ liệu của cô Lan",
              "403 FORBIDDEN|||403 FORBIDDEN",
              "401 INVALID_TOKEN|||401 INVALID_TOKEN",
              "401 TOKEN_EXPIRED|||401 TOKEN_EXPIRED",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: The signature covers header and payload; the recomputed HMAC no longer matches. Not 403 — the caller is not authenticated at all.|||VI: Chữ ký bao cả header và payload; HMAC tính lại không còn khớp. Không phải 403 — người gọi hoàn toàn chưa được xác thực.",
          },
          {
            question: "Why does LabFlow answer a wrong password and an unknown email with the same INVALID_CREDENTIALS?|||Vì sao LabFlow trả cùng INVALID_CREDENTIALS cho sai mật khẩu và email không tồn tại?",
            options: [
              "So the login cannot be used to find out which emails have accounts|||Để không ai dùng màn đăng nhập dò xem email nào có tài khoản",
              "Because the server cannot tell them apart|||Vì server không phân biệt được hai trường hợp",
              "To save one database query|||Để tiết kiệm một câu truy vấn",
              "Because RFC 7519 requires it|||Vì RFC 7519 bắt buộc như vậy",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Different messages leak which emails exist (user enumeration); the unknown email also costs one scrypt so timing does not leak it either.|||VI: Thông báo khác nhau làm lộ email nào tồn tại (dò người dùng); email lạ cũng tốn một lần scrypt nên thời gian trả lời không lộ.",
          },
          {
            question: "Lan typed 5 wrong passwords, then her correct one, and got 429. What does that show?|||Cô Lan gõ sai 5 lần, rồi gõ đúng, và nhận 429. Điều đó cho thấy gì?",
            options: [
              "The limiter counts attempts per (IP, email) and blocks for a while, correct or not|||Bộ giới hạn đếm lần thử theo (IP, email) và chặn một lúc, đúng hay sai đều vậy",
              "Her password was changed by the attacker|||Mật khẩu của cô đã bị kẻ tấn công đổi",
              "The server is overloaded|||Server đang quá tải",
              "JWTs cannot be issued twice|||JWT không cấp được hai lần",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Retry-After 180 — the bucket refills slowly. Keying on (IP, email) limits guessing without letting one attacker lock out everybody.|||VI: Retry-After 180 — xô được rót lại chậm. Khoá theo (IP, email) hạn chế dò mà không để một kẻ tấn công khoá được tất cả mọi người.",
          },
          {
            question: "With the quick receipt endpoint, Bin read bk_1 (An’s) by changing the id. Which OWASP risk is that?|||Với endpoint biên nhận viết nhanh, Bin đọc được bk_1 (của An) bằng cách đổi id. Đó là rủi ro OWASP nào?",
            options: [
              "API5 Broken Function Level Authorization|||API5 Broken Function Level Authorization",
              "API1 Broken Object Level Authorization|||API1 Broken Object Level Authorization",
              "API2 Broken Authentication|||API2 Broken Authentication",
              "API9 Improper Inventory Management|||API9 Improper Inventory Management",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Bin was authenticated and allowed to call the endpoint (function level OK); the RECORD belonged to someone else — object level.|||VI: Bin đã xác thực và được gọi endpoint (tầng chức năng ổn); BẢN GHI thuộc về người khác — tầng đối tượng.",
          },
          {
            question: "Why does the fixed receipt answer 404, not 403, for someone else’s booking?|||Vì sao biên nhận đã vá trả 404 chứ không phải 403 cho lượt đặt của người khác?",
            options: [
              "404 is required by HTTP for every forbidden resource|||HTTP bắt buộc 404 cho mọi tài nguyên bị cấm",
              "403 would be cached by browsers|||403 sẽ bị trình duyệt cache",
              "So the caller cannot even learn that the booking exists|||Để người gọi không biết được cả việc lượt đặt đó tồn tại",
              "Because the booking is deleted for that user|||Vì lượt đặt bị xoá với người đó",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: 403 confirms existence; 404 hides it. LabFlow’s older GET /bookings/:id keeps 403 because changing a status code is a breaking change (4.1).|||VI: 403 xác nhận là có; 404 giấu đi. GET /bookings/:id cũ của LabFlow giữ 403 vì đổi mã trạng thái là thay đổi phá vỡ (4.1).",
          },
          {
            question: "In the vulnerable audit, API5 and API6 also failed although nothing was switched off for them. Why?|||Trong lần kiểm có lỗ hổng, API5 và API6 cũng hỏng dù không có gì bị tắt cho chúng. Vì sao?",
            options: [
              "The audit script has bugs in those checks|||Script kiểm có lỗi ở hai phép kiểm đó",
              "API3 let An make herself a manager, and managers may patch devices and have no booking cap|||API3 cho An tự thành quản lý, mà quản lý thì được sửa thiết bị và không bị giới hạn lượt đặt",
              "Rate limits were exceeded|||Đã vượt giới hạn tần suất",
              "Those risks cannot be fixed in Express|||Những rủi ro đó không vá được trong Express",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: PATCH /v2/me copied role from the body (mass assignment); one hole opened the next — exactly what the exploit transcript of Lab 6 shows.|||VI: PATCH /v2/me chép role từ body (mass assignment); một lỗ mở ra lỗ tiếp theo — đúng như transcript khai thác của Lab 6.",
          },
          {
            question: "Which manual URL does safeFetch let the server download?|||safeFetch cho server tải URL sách hướng dẫn nào?",
            options: [
              "http://127.0.0.1:4000/health|||http://127.0.0.1:4000/health",
              "https://169.254.169.254/latest/meta-data/|||https://169.254.169.254/latest/meta-data/",
              "https://localhost/manual.pdf|||https://localhost/manual.pdf",
              "A public https URL whose host resolves only to public addresses|||Một URL https công khai mà tên miền chỉ phân giải ra địa chỉ công khai",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: http is refused; 169.254.x.x is link-local (cloud metadata); localhost resolves to loopback. The check runs on resolved addresses and redirects are refused (6.3).|||VI: http bị từ chối; 169.254.x.x là link-local (metadata của cloud); localhost phân giải ra loopback. Phép kiểm chạy trên địa chỉ đã phân giải và chuyển hướng bị từ chối (6.3).",
          },
          {
            question: "A page on http://localhost:5174 (not allowed) did GET /v2/labs. What happened?|||Một trang ở http://localhost:5174 (không được phép) GET /v2/labs. Chuyện gì đã xảy ra?",
            options: [
              "The request never left the browser|||Request không bao giờ rời trình duyệt",
              "The server received and answered it; the browser hid the response from the page|||Server nhận và trả lời; trình duyệt giấu response khỏi trang",
              "The server answered 403|||Server trả 403",
              "The server blocked the IP address|||Server chặn địa chỉ IP",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: The server log showed “GET /v2/labs origin=http://localhost:5174”. CORS protects users’ data in the browser, not the server; only the JSON POST stopped at the preflight.|||VI: Log server có “GET /v2/labs origin=http://localhost:5174”. CORS bảo vệ dữ liệu người dùng trong trình duyệt, không bảo vệ server; chỉ POST JSON dừng ở preflight.",
          },
          {
            question: "Why is LabFlow not exposed to classic CSRF?|||Vì sao LabFlow không bị CSRF kinh điển?",
            options: [
              "Because CORS blocks all cross-site requests|||Vì CORS chặn mọi request liên trang",
              "Because it uses HTTPS|||Vì nó dùng HTTPS",
              "Because the token travels in the Authorization header, which browsers never attach automatically|||Vì token đi trong header Authorization, thứ trình duyệt không bao giờ tự gắn",
              "Because every endpoint is a GET|||Vì mọi endpoint đều là GET",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: CSRF rides on automatically sent cookies. Simple cross-site requests are still sent (see the previous question), so CORS is not the reason; with cookie sessions you need SameSite and anti-CSRF tokens.|||VI: CSRF dựa vào cookie được gửi tự động. Request liên trang đơn giản vẫn được gửi (xem câu trước), nên CORS không phải lý do; dùng session cookie thì cần SameSite và token chống CSRF.",
          },
        ],
      },
    },
  ],
};
