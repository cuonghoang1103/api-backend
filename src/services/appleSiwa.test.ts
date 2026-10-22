/**
 * Sign in with Apple — phần không cần CSDL: `npx tsx --test src/services/appleSiwa.test.ts`
 * (đổi mã + thu hồi với CSDL thật và Apple giả: src/routes/work.appStoreReview.db.test.ts)
 */
import assert from 'node:assert/strict';
import { createPublicKey, createVerify, generateKeyPairSync } from 'node:crypto';
import { afterEach, describe, it } from 'node:test';

import { cauHinhSiwa, clientIdsHopLe, luuTokenApple, providerCho, taoClientSecret } from './appleSiwa.service.js';

const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
const PEM = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

describe('Sign in with Apple — client_secret + cấu hình', () => {
  afterEach(() => {
    for (const k of ['APPLE_SIWA_TEAM_ID', 'APPLE_SIWA_KEY_ID', 'APPLE_SIWA_PRIVATE_KEY', 'APPLE_SIWA_CLIENT_IDS']) delete process.env[k];
  });

  it('client_secret là JWT ES256 đúng chuẩn Apple (kid, iss, sub, aud, exp ≤ 6 tháng) và chữ ký kiểm được', () => {
    const jwt = taoClientSecret('com.cuongthai.ctwork', { teamId: 'TEAM123456', keyId: 'KEY1234567', privateKey: PEM }, 1_800_000_000);
    const [h, p, s] = jwt.split('.');
    const dau = JSON.parse(Buffer.from(h!, 'base64url').toString());
    const than = JSON.parse(Buffer.from(p!, 'base64url').toString());
    assert.deepEqual(dau, { alg: 'ES256', kid: 'KEY1234567' });
    assert.deepEqual(than, { iss: 'TEAM123456', iat: 1_800_000_000, exp: 1_800_000_300, aud: 'https://appleid.apple.com', sub: 'com.cuongthai.ctwork' });
    const sig = Buffer.from(s!, 'base64url');
    assert.equal(sig.length, 64, 'JOSE ES256 = R‖S 64 byte, không phải DER');
    const ok = createVerify('SHA256').update(`${h}.${p}`).verify({ key: createPublicKey(PEM), dsaEncoding: 'ieee-p1363' }, sig);
    assert.equal(ok, true);
  });

  it('khoá .p8 viết một dòng với \\n vẫn đọc được', () => {
    process.env.APPLE_SIWA_TEAM_ID = 'T'; process.env.APPLE_SIWA_KEY_ID = 'K';
    process.env.APPLE_SIWA_PRIVATE_KEY = PEM.trim().replace(/\n/g, '\\n');
    const cfg = cauHinhSiwa();
    assert.ok(cfg);
    assert.doesNotThrow(() => taoClientSecret('com.cuongthai.app', cfg!));
  });

  it('thiếu env ⇒ null (bỏ qua, không ném); luuTokenApple trả skipped và KHÔNG gọi mạng', async () => {
    assert.equal(cauHinhSiwa(), null);
    const goc = globalThis.fetch;
    let goi = 0;
    globalThis.fetch = (async () => { goi += 1; throw new Error('không được gọi'); }) as typeof fetch;
    try {
      assert.equal(await luuTokenApple(1, 'com.cuongthai.ctwork', 'sub', 'code'), 'skipped:no-config');
      assert.equal(await luuTokenApple(1, 'com.cuongthai.ctwork', 'sub', null), 'skipped:no-code');
      assert.match(await luuTokenApple(1, 'com.evil.app', 'sub', 'code'), /^skipped:client-id/);
      assert.equal(goi, 0);
    } finally {
      globalThis.fetch = goc;
    }
  });

  it('client id mặc định = hai app có Sign in with Apple; provider ≤ 24 ký tự', () => {
    assert.deepEqual(clientIdsHopLe(), ['com.cuongthai.ctwork', 'com.cuongthai.app']);
    assert.equal(providerCho('com.cuongthai.ctwork'), 'siwa:ctwork');
    assert.equal(providerCho('com.cuongthai.app'), 'siwa:app');
    assert.ok(providerCho('com.example.a-very-long-bundle-name-here').length <= 24);
  });
});
