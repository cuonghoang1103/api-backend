// chay: tay — Lesson 7.3: a JWT built and checked by hand with node:crypto, then the same with the jsonwebtoken library.
// The clock is fixed (NOW) so the output is the same on every run. Run from the repo root (needs jsonwebtoken):
// node content/courses/web-foundations/_demo/_t7/jwt-tay.mjs > content/courses/web-foundations/_demo/_t7/out/jwt-tay.out.txt
import crypto from 'node:crypto';
import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');

const SECRET = 'demo-secret-change-me-32-bytes-long!';     // in real apps: a long random value from an env variable
const NOW = 1793600000;                                     // a fixed "now" in seconds, for repeatable output

const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const sign = (data) => crypto.createHmac('sha256', SECRET).update(data).digest('base64url');

function makeToken(payload) {
  const head = b64url({ alg: 'HS256', typ: 'JWT' });
  const body = b64url(payload);
  return `${head}.${body}.${sign(`${head}.${body}`)}`;
}
function verifyToken(token, now = NOW) {
  const [head, body, sig] = token.split('.');
  const header = JSON.parse(Buffer.from(head, 'base64url'));
  if (header.alg !== 'HS256') return { ok: false, why: `alg "${header.alg}" refused` };
  const expected = sign(`${head}.${body}`);
  if (!sig || sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return { ok: false, why: 'bad signature' };
  }
  const payload = JSON.parse(Buffer.from(body, 'base64url'));
  if (payload.exp <= now) return { ok: false, why: 'expired' };
  return { ok: true, payload };
}

// 1. make a token
const payload = { sub: '1', name: 'An', role: 'user', iat: NOW, exp: NOW + 15 * 60 };
const token = makeToken(payload);
const [h, p, s] = token.split('.');
console.log('token  :', token);
console.log('length :', token.length, 'characters (a session id was 43)');
console.log('header :', h);
console.log('payload:', p);
console.log('sig    :', s);

// 2. anyone can READ it — no secret needed
console.log('\ndecoded payload, without the secret:', Buffer.from(p, 'base64url').toString());

// 3. checks
console.log('\nverify(original)          →', JSON.stringify(verifyToken(token)));
const forged = `${h}.${b64url({ ...payload, role: 'admin' })}.${s}`;        // change the role, keep the old signature
console.log('verify(role changed)      →', JSON.stringify(verifyToken(forged)));
const none = `${b64url({ alg: 'none', typ: 'JWT' })}.${b64url({ ...payload, role: 'admin' })}.`;
console.log('verify(alg: none)         →', JSON.stringify(verifyToken(none)));
console.log('verify(16 minutes later)  →', JSON.stringify(verifyToken(token, NOW + 16 * 60)));

// 4. the library does the same thing
const libToken = jwt.sign(payload, SECRET, { algorithm: 'HS256' });
console.log('\njsonwebtoken.sign gives the same string:', libToken === token);
console.log('jsonwebtoken.verify(original):', JSON.stringify(jwt.verify(token, SECRET, { algorithms: ['HS256'], clockTimestamp: NOW })));
try {
  jwt.verify(forged, SECRET, { algorithms: ['HS256'], clockTimestamp: NOW });
} catch (err) {
  console.log('jsonwebtoken.verify(role changed):', err.name + ':', err.message);
}

// 5. a stateless API: the token works until it expires, even after "logout"
const server = http.createServer((req, res) => {
  const auth = req.headers.authorization ?? '';
  const result = auth.startsWith('Bearer ') ? verifyToken(auth.slice(7)) : { ok: false, why: 'no token' };
  res.writeHead(result.ok ? 200 : 401, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(result.ok ? { hello: result.payload.name } : { error: result.why }));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const api = `http://127.0.0.1:${server.address().port}/api/me`;
const call = async (label, headers) => {
  const res = await fetch(api, { headers });
  console.log(label.padEnd(46), '→', res.status, await res.text());
};
console.log();
await call('GET /api/me (no Authorization header)', {});
await call('GET /api/me  Bearer <token>', { Authorization: `Bearer ${token}` });
await call('GET /api/me  Bearer <role changed>', { Authorization: `Bearer ${forged}` });
await call('after "Log out": a copied token, same request', { Authorization: `Bearer ${token}` });
server.close();
