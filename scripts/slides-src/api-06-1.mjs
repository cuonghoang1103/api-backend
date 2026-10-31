/**
 * api-06-1 — API Design · Chapter 6 · Lesson 6.1 "Authentication options" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s06-bao-mat.mjs › api-6-1-xac-thuc. Output = chạy thật LabFlow Ch6 (đăng nhập scrypt + JWT HS256).
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 6 — Security for APIs', bai: '6.1' };

export const deck = { key: 'api-06-1', code: 'API 6.1', title: 'Authentication options', sub: 'Sessions, JWT, API keys, OAuth — built and attacked' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Authentication options:<br>sessions, JWT, API keys, OAuth', sub: 'Goodbye “Bearer tok_an”.<br>Real logins — then we attack our own tokens.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Sessions, JWT, API keys, OAuth 2.0 — what each one is for</li>
<li>Passwords hashed with <b>scrypt</b>, login that gives one error for everything</li>
<li>A hand-built <b>HS256 JWT</b>, 15 minutes, and our own forgeries refused</li>
<li>Login limit, API keys shown once, production without demo tokens</li>
<li>Interview answers: sessions or JWT, storing passwords, what is inside a token</li>
</ul>` },

  { t: 'Four ways to say who you are', to: true, giua: true, body: `
<table class="t" style="font-size:19px">
<tr><th>Option</th><th>Client holds</th><th>Server state</th><th>Good for</th><th>Watch out</th></tr>
<tr><td>Session + cookie</td><td>random session id</td><td>session store</td><td>one web app; instant logout</td><td>CSRF (6.4); shared store</td></tr>
<tr><td>JWT access token</td><td>signed claims: sub, role, exp</td><td>none per request</td><td>APIs, mobile, many services</td><td>no revocation ⇒ keep it short</td></tr>
<tr><td>API key</td><td>long random secret</td><td>hashed keys</td><td>scripts, server-to-server</td><td>rotate, scope</td></tr>
<tr><td>OAuth 2.0 / OIDC</td><td>tokens from an identity provider</td><td>at the provider</td><td>“Log in with your university”</td><td>use a library, Code + PKCE</td></tr>
</table>
${box('LabFlow', '<b>JWT</b> (RFC 7519) for people, <b>API keys</b> for scripts. OAuth 2.0 (RFC 6749) + PKCE (RFC 7636) later, for university login: the app never sees the password.', 'xanh')}` },

  { t: 'Passwords: never stored, only hashed', to: true, body: two(sql(`// passwords.js
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return \`scrypt$\${salt.toString('hex')}$\${hash.toString('hex')}\`;
}

export function verifyPassword(password, stored) {
  const [, saltHex, hashHex] = stored.split('$');
  const hash = scryptSync(password, Buffer.from(saltHex, 'hex'), 32);
  return timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));
}`, { lang: 'javascript', sm: true, hl: [5, 6, 13] }), `
<ul>
<li><b>scrypt</b>: built into Node, slow and memory-hungry on purpose</li>
<li><b>salt</b>: same password ⇒ different hash</li>
<li><b>timingSafeEqual</b>: comparison time reveals nothing</li>
<li>bcrypt, Argon2: equally good · plain SHA-256: <b>no</b> — fast is what guessers want</li>
</ul>`, 'r64') },

  { t: 'Login ⇒ a JWT for 15 minutes', body: two(sql(`export function signJwt(user) {
  const iat = Math.floor(now() / 1000);
  const head = b64u({ alg: 'HS256', typ: 'JWT' });
  const body = b64u({ iss: 'labflow', sub: user.id,
    role: user.role, iat, exp: iat + ACCESS_TTL_SEC });
  return \`\${head}.\${body}.\${sign(\`\${head}.\${body}\`)}\`;
}
export function verifyJwt(token) {
  const [head, body, sig] = token.split('.');
  // … parse header and payload …
  if (h.alg !== 'HS256' || !sig)          // the SERVER decides
    throw new HttpError(401, 'INVALID_TOKEN');
  // … timingSafeEqual on the signature, check iss …
  if (!(p.exp * 1000 > now()))
    throw new HttpError(401, 'TOKEN_EXPIRED');
  return p;
}`, { lang: 'javascript', sm: true, hl: [11, 15] }), http(`$ curl -s -X POST …/v2/auth/login --json '{"email":"an@…","password":"an-lab-2026"}' | jq -c …
{"tokenType":"Bearer","expiresIn":900,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5…"}

$ cut -d. -f2 an.jwt | node -e "…decode…"
{"iss":"labflow","sub":"usr_1","role":"STUDENT","iat":1793480866,"exp":1793481766}

$ curl -s …/v2/auth/login --json '{"email":"an@…","password":"wrong"}' | jq -c …
{"status":401,"code":"INVALID_CREDENTIALS"}
$ curl -s …/v2/auth/login --json '{"email":"nobody@…","password":"wrong"}' | jq -c …
{"status":401,"code":"INVALID_CREDENTIALS"}`, { sm: true, wrap: 'any' }) + box('Readable by anyone', 'Signed, <b>not encrypted</b>: no secrets inside. One error for unknown email and wrong password ⇒ no user enumeration.', 'lam'), 'r46') },

  { t: 'Attack our own tokens', body: two(http(`# forge.mjs role: payload says usr_3 / LAB_MANAGER, old signature kept
# forge.mjs none: header {"alg":"none"}, signature dropped
$ node forge.mjs role an.jwt | cut -d. -f2 | node -e "…decode…"
{"iss":"labflow","sub":"usr_3","role":"LAB_MANAGER","iat":1793480866,"exp":1793481766}

$ curl -s …/v2/admin/deprecations -H "Authorization: Bearer $(node forge.mjs role an.jwt)" … | jq -c '{status, code, detail}'
{"status":401,"code":"INVALID_TOKEN","detail":"The token was modified, has a wrong signature or algorithm; log in again"}

$ curl -s …/v2/admin/deprecations -H "Authorization: Bearer $(node forge.mjs none an.jwt)" … | jq -c '{status, code}'
{"status":401,"code":"INVALID_TOKEN"}`, { sm: true, wrap: 'any' }), http(`# password guessing
$ for p in a1 b2 c3 d4 e5 f6; do curl … --json "{…lan@labflow.example…$p}"; done
401 401 401 401 401 429

$ curl -s -D - -o /dev/null -X POST …/v2/auth/login --json '{…"lan-lab-2026"}' | grep -E '^(HTTP|Retry-After)'
HTTP/1.1 429 Too Many Requests
Retry-After: 180`, { sm: true, wrap: 'any' }) + box('Why 401 twice', 'The signature covers header <b>and</b> payload; the algorithm is fixed by the server (RFC 8725 lists alg none).', 'xanh') + box('The trade-off', 'Limit per (IP, email): guessing stops — and Lan waits 3 minutes too.', 'lam')) },

  { t: 'Expiry, API keys, production', body: two(http(`# server restarted with its clock 16 minutes later
$ curl -s …/v2/me -H "Authorization: Bearer $(cat an.jwt)" … | jq -c '{status, code, detail}'
{"status":401,"code":"TOKEN_EXPIRED","detail":"Your session has expired; log in again"}

# production without a secret
$ NODE_ENV=production node src/server.js 2>&1 | grep -m1 '^Error'
Error: LABFLOW_JWT_SECRET is required in production
# production with a secret: the demo tokens are gone
$ curl -s …/v2/me -H 'Authorization: Bearer tok_lan' | jq -c '{status, code}'
{"status":401,"code":"UNAUTHENTICATED"}`, { sm: true, wrap: 'any' }), http(`$ curl -s -X POST …/v2/me/api-keys -H "Authorization: Bearer $(cat lan.jwt)" | … | jq -c '{prefix, createdAt, key: (…)}'
{"prefix":"lf_live_fbJE","createdAt":"2026-10-31T21:08:06.093Z","key":"lf_live_fbJE…"}

$ curl -s …/v2/me -H "Authorization: Bearer $(jq -r .key lan.key.json)" | jq -c '{id, role}'
{"id":"usr_3","role":"LAB_MANAGER"}

$ curl -s …/v2/me/api-keys -H "Authorization: Bearer $(cat lan.jwt)" | jq -c .
{"data":[{"prefix":"lf_live_fbJE","createdAt":"2026-10-31T21:08:06.093Z"}]}`, { sm: true, wrap: 'any' }) + box('API keys', 'Shown <b>once</b>; stored as SHA-256 + a prefix to recognise them.', 'xanh'), 'r46') },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ JWT in localStorage “because everyone does”', 'Any injected script can read it. ✓ Browser apps on your own site: HttpOnly cookie session; APIs and mobile: short bearer tokens.'],
    ['✗ Tokens valid for 30 days', 'A stolen one cannot be taken back. ✓ 15-minute access tokens; refresh or log in again.'],
    ['✗ Letting the token choose its algorithm', 'alg none, or an RSA key used as an HMAC secret. ✓ The server fixes the algorithm.'],
  ]) },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“Sessions or JWT?”', 'Sessions: server state, instant revocation, cookies — one web app. JWT: stateless checks for APIs and many services, short expiry, no instant logout.'],
    ['“How do you store passwords?”', 'Slow salted hash (scrypt, bcrypt, Argon2), constant-time compare, never encrypted, never logged.'],
    ['“What is in a JWT?”', 'header.payload.signature in base64url; claims like sub, role, exp; readable by anyone, unforgeable without the key.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Passwords: salted <b>scrypt</b>, constant-time compare</li>
<li>Login ⇒ <b>HS256 JWT, 15 min</b>; one error for unknown email and wrong password</li>
<li>Measured: forged ⇒ 401 · alg none ⇒ 401 · expired ⇒ 401 · 6th guess ⇒ <b>429</b></li>
<li>API keys for scripts: shown once, stored hashed</li>
<li>Production needs a secret; demo tokens gone</li>
</ul>
${box('Next', 'Lesson 6.2 — who may touch which record: BOLA.', 'xanh')}` },
]);
