// Kiểm bước xác minh OAuth (18/10/2026) — token ký bằng khoá RSA tự tạo, bộ khoá công khai giả lập qua fetch.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSign, generateKeyPairSync } from 'node:crypto';

process.env.AUTH_SECRET = 'bi-mat-thu';
const { xacMinhOAuth, chuKyNoiBo } = await import('./xacMinhOAuth.js');

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' };
const goc = globalThis.fetch;
globalThis.fetch = (async () => new Response(JSON.stringify({ keys: [jwk] }), { status: 200 })) as typeof fetch;

function ky(than: Record<string, unknown>, kid = 'k1'): string {
  const b = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const dau = `${b({ alg: 'RS256', kid })}.${b(than)}`;
  const s = createSign('RSA-SHA256'); s.update(dau);
  return `${dau}.${s.sign(privateKey).toString('base64url')}`;
}
const exp = Math.floor(Date.now() / 1000) + 600;

test('không bằng chứng ⇒ từ chối (lỗ chiếm tài khoản cũ)', async () => {
  const r = await xacMinhOAuth({}, { email: 'admin@x.com', provider: 'google', providerId: '1' });
  assert.equal(r.ok, false);
});
test('chữ ký nội bộ đúng ⇒ cho qua; sai ⇒ từ chối', async () => {
  assert.equal((await xacMinhOAuth({ 'x-cuongthai-noi-bo': chuKyNoiBo()! }, { email: 'a@x.com' })).ok, true);
  assert.equal((await xacMinhOAuth({ 'x-cuongthai-noi-bo': 'sai' }, { email: 'a@x.com' })).ok, false);
});
test('Apple: token hợp lệ ⇒ qua; email khác / aud lạ / sub lệch / hết hạn ⇒ từ chối', async () => {
  const than = { iss: 'https://appleid.apple.com', aud: 'com.cuongthai.ctwork', sub: 'apl1', email: 'u@privaterelay.appleid.com', exp };
  const ok = await xacMinhOAuth({}, { email: 'U@privaterelay.appleid.com', provider: 'apple', providerId: 'apl1', identityToken: ky(than) });
  assert.equal(ok.ok, true);
  assert.equal((await xacMinhOAuth({}, { email: 'admin@x.com', provider: 'apple', providerId: 'apl1', identityToken: ky(than) })).ok, false);
  assert.equal((await xacMinhOAuth({}, { email: than.email, provider: 'apple', providerId: 'apl1', identityToken: ky({ ...than, aud: 'com.ke.gian' }) })).ok, false);
  assert.equal((await xacMinhOAuth({}, { email: than.email, provider: 'apple', providerId: 'khac', identityToken: ky(than) })).ok, false);
  assert.equal((await xacMinhOAuth({}, { email: than.email, provider: 'apple', providerId: 'apl1', identityToken: ky({ ...than, exp: 1000 }) })).ok, false);
});
test('Google: email chưa xác minh / chữ ký giả ⇒ từ chối; hợp lệ ⇒ qua', async () => {
  const than = { iss: 'https://accounts.google.com', aud: '650641212127-07fqeii3rqbpduj1ko39sc83bautslrs.apps.googleusercontent.com', sub: 'g1', email: 'g@gmail.com', email_verified: true, exp };
  assert.equal((await xacMinhOAuth({}, { email: 'g@gmail.com', provider: 'google', providerId: 'g1', idToken: ky(than) })).ok, true);
  assert.equal((await xacMinhOAuth({}, { email: 'g@gmail.com', provider: 'google', providerId: 'g1', idToken: ky({ ...than, email_verified: false }) })).ok, false);
  const gia = ky(than).split('.'); gia[2] = Buffer.from('rac').toString('base64url');
  assert.equal((await xacMinhOAuth({}, { email: 'g@gmail.com', provider: 'google', providerId: 'g1', idToken: gia.join('.') })).ok, false);
});
test.after(() => { globalThis.fetch = goc; });
