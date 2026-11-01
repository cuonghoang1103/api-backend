// test/security.test.mjs — Lab 6: mỗi lỗ hổng đã vá có MỘT test giữ nó đóng
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';

let server, base, an, bin, lan;
const call = (path, { method = 'GET', token, body, headers = {} } = {}) => fetch(base + path, { method,
  headers: { ...(token && { Authorization: `Bearer ${token}` }), ...(body && { 'Content-Type': 'application/json' }), ...headers },
  body: body && JSON.stringify(body) });
const login = async (email, password) => (await (await call('/v2/auth/login', { method: 'POST', body: { email, password } })).json()).accessToken;
before(async () => {
  await new Promise((ok) => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); });
  an = await login('an@student.labflow.example', 'an-lab-2026');
  bin = await login('binh@student.labflow.example', 'binh-lab-2026');
  lan = await login('lan@labflow.example', 'lan-lab-2026');
});
after(() => server.close());

test('API1: một sinh viên không đọc được biên nhận của người khác (404)', async () => {
  const r = await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_1',
    period: { start: '2027-04-01T08:00:00+07:00', end: '2027-04-01T10:00:00+07:00' } } });
  const { id } = await r.json();
  assert.equal((await call(`/v2/bookings/${id}/receipt`, { token: an })).status, 200);
  assert.equal((await call(`/v2/bookings/${id}/receipt`, { token: bin })).status, 404);
});

test('API2: token alg "none" và token bị sửa đều bị từ chối', async () => {
  const [h, p, s] = an.split('.');
  const body = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(p, 'base64url')), sub: 'usr_3', role: 'LAB_MANAGER' })).toString('base64url');
  const none = `${Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url')}.${body}.`;
  assert.equal((await call('/v2/me', { token: none })).status, 401);
  assert.equal((await call('/v2/me', { token: `${h}.${body}.${s}` })).status, 401);
});

test('API3: PATCH /v2/me không đổi được vai trò', async () => {
  assert.equal((await call('/v2/me', { method: 'PATCH', token: an, body: { role: 'LAB_MANAGER' } })).status, 400);
  assert.equal((await (await call('/v2/me', { token: an })).json()).role, 'STUDENT');
});

test('API7: không tải URL nội bộ', async () => {
  for (const url of ['http://127.0.0.1:4000/health', 'https://169.254.169.254/latest/meta-data/', 'https://localhost/x']) {
    assert.equal((await call('/v2/devices/dev_1/manual', { method: 'POST', token: lan, body: { url } })).status, 422, url);
  }
});

test('API8: CORS chỉ cho origin đã duyệt, không bao giờ "*"', async () => {
  const evil = await call('/v2/labs', { headers: { Origin: 'https://evil.example' } });
  assert.equal(evil.headers.get('access-control-allow-origin'), null);
  const ok = await call('/v2/labs', { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(ok.headers.get('access-control-allow-origin'), 'http://localhost:5173');
});
