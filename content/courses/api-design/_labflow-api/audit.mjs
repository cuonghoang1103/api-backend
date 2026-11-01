// audit.mjs — bài 6.3: tự kiểm LabFlow theo OWASP API Security Top 10 (bản 2023) bằng request THẬT
const BASE = 'http://localhost:4000';
const j = (o) => JSON.stringify(o);
const call = (path, { method = 'GET', token, body, headers = {} } = {}) => fetch(BASE + path, { method,
  headers: { ...(token && { Authorization: `Bearer ${token}` }), ...(body !== undefined && { 'Content-Type': 'application/json' }), ...headers },
  body: body === undefined ? undefined : (typeof body === 'string' ? body : j(body)) });
const login = async (email, password) => (await (await call('/v2/auth/login', { method: 'POST', body: { email, password } })).json()).accessToken;
const an = await login('an@student.labflow.example', 'an-lab-2026');
const lan = await login('lan@labflow.example', 'lan-lab-2026');
const b64u = (o) => Buffer.from(j(o)).toString('base64url');
const day = (d) => ({ start: `2027-03-0${d}T08:00:00+07:00`, end: `2027-03-0${d}T10:00:00+07:00` });

const checks = [
  ['API1 BOLA', 'Bin reads An’s receipt', async () => {
    const bin = await login('binh@student.labflow.example', 'binh-lab-2026');
    const r = await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_1', period: day(1) } });
    const id = (await r.json()).id;
    return (await call(`/v2/bookings/${id}/receipt`, { token: bin })).status === 404; }],
  ['API2 Broken auth', 'token with alg "none"', async () => {
    const p = JSON.parse(Buffer.from(an.split('.')[1], 'base64url'));
    const forged = `${b64u({ alg: 'none', typ: 'JWT' })}.${b64u({ ...p, sub: 'usr_3', role: 'LAB_MANAGER' })}.`;
    return (await call('/v2/admin/deprecations', { token: forged })).status === 401; }],
  ['API2 Broken auth', '6 wrong passwords ⇒ 429', async () => {
    let last;
    for (let i = 0; i < 6; i++) last = (await call('/v2/auth/login', { method: 'POST', body: { email: 'binh@student.labflow.example', password: `x${i}` } })).status;
    return last === 429; }],
  ['API3 Property level', 'PATCH /v2/me {"role":"LAB_MANAGER"}', async () => {
    const s = (await call('/v2/me', { method: 'PATCH', token: an, body: { role: 'LAB_MANAGER' } })).status;
    const me = await (await call('/v2/me', { token: an })).json();
    return s === 400 && me.role === 'STUDENT'; }],
  ['API3 Property level', 'GET /v2/me hides passwordHash', async () => !('passwordHash' in await (await call('/v2/me', { token: an })).json())],
  ['API4 Resources', 'limit=1000 ⇒ 400, 20 KB body ⇒ 413', async () =>
    (await call('/v2/bookings?limit=1000', { token: an })).status === 400
    && (await call('/v2/bookings', { method: 'POST', token: an, body: j({ purpose: 'x'.repeat(20000) }) })).status === 413],
  ['API5 Function level', 'student PATCHes a device', async () =>
    (await call('/v2/devices/dev_1', { method: 'PATCH', token: an, body: { note: 'x' }, headers: { 'Content-Type': 'application/merge-patch+json' } })).status === 403],
  ['API6 Business flows', 'student holds a 4th active booking', async () => {
    let last;
    for (const d of [2, 3, 4]) last = (await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_2', period: day(d) } })).status;
    return last === 422; }],
  ['API7 SSRF', 'manual URL http://127.0.0.1:4000/health', async () =>
    (await call('/v2/devices/dev_1/manual', { method: 'POST', token: lan, body: { url: 'http://127.0.0.1:4000/health' } })).status === 422],
  ['API7 SSRF', 'manual URL https://169.254.169.254/…', async () =>
    (await call('/v2/devices/dev_1/manual', { method: 'POST', token: lan, body: { url: 'https://169.254.169.254/latest/meta-data/' } })).status === 422],
  ['API8 Misconfiguration', 'no X-Powered-By, CORS refuses evil origin', async () => {
    const r = await call('/health', { headers: { Origin: 'https://evil.example' } });
    return !r.headers.has('x-powered-by') && !r.headers.has('access-control-allow-origin'); }],
  ['API9 Inventory', 'old unversioned path announces its end', async () => (await call('/labs')).headers.has('deprecation')],
];
let fails = 0;
for (const [risk, what, test] of checks) {
  let ok;
  try { ok = await test(); } catch (e) { ok = false; }
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${risk.padEnd(22)} ${what}`);
}
console.log('—     API10 Unsafe consumption  LabFlow calls no third-party API yet — nothing to test');
console.log(fails ? `✗ ${fails} kiểm thất bại` : '✓ mọi kiểm đạt');
