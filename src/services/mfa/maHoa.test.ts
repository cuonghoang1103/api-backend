/**
 * Secret TOTP mã hoá khi lưu (AES-256-GCM, gắn userId) + mã khôi phục băm.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { bamMaKhoiPhuc, chuanHoaMaKhoiPhuc, giaiMaSecret, maHoaSecret, sinhMaKhoiPhuc } from './maHoa.js';

const SECRET = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';

function voiEnv(k: string, v: string | undefined, fn: () => void) {
  const cu = process.env[k];
  if (v === undefined) delete process.env[k]; else process.env[k] = v;
  try { fn(); } finally { if (cu === undefined) delete process.env[k]; else process.env[k] = cu; }
}

test('mã hoá → giải mã đi-về; mỗi lần một IV khác nhau', () => {
  voiEnv('MFA_ENCRYPTION_KEY', Buffer.alloc(32, 7).toString('base64'), () => {
    const a = maHoaSecret(SECRET, 42);
    const b = maHoaSecret(SECRET, 42);
    assert.notEqual(a, b);
    assert.ok(a.startsWith('m1.'));
    assert.ok(!a.includes(SECRET));
    assert.equal(giaiMaSecret(a, 42), SECRET);
    assert.equal(giaiMaSecret(b, 42), SECRET);
  });
});

test('chép sang user khác / sửa 1 ký tự / đổi khoá ⇒ giải mã ném lỗi', () => {
  let tok = '';
  voiEnv('MFA_ENCRYPTION_KEY', Buffer.alloc(32, 7).toString('base64'), () => {
    tok = maHoaSecret(SECRET, 42);
    assert.throws(() => giaiMaSecret(tok, 43));
    const sua = tok.slice(0, -2) + (tok.at(-2) === 'A' ? 'B' : 'A') + tok.at(-1);
    assert.throws(() => giaiMaSecret(sua, 42));
  });
  voiEnv('MFA_ENCRYPTION_KEY', Buffer.alloc(32, 8).toString('hex'), () => {
    assert.throws(() => giaiMaSecret(tok, 42));
  });
});

test('thiếu MFA_ENCRYPTION_KEY ⇒ dẫn xuất từ JWT_SECRET, ổn định giữa các lần gọi', () => {
  voiEnv('MFA_ENCRYPTION_KEY', undefined, () => {
    voiEnv('JWT_SECRET', 'x'.repeat(40), () => {
      const t = maHoaSecret(SECRET, 1);
      assert.equal(giaiMaSecret(t, 1), SECRET);
    });
  });
});

test('khoá sai độ dài bị từ chối rõ ràng', () => {
  voiEnv('MFA_ENCRYPTION_KEY', 'ngan-qua', () => {
    assert.throws(() => maHoaSecret(SECRET, 1), /32 byte/);
  });
});

test('mã khôi phục: 10 mã, khác nhau, khuôn xxxxx-xxxxx', () => {
  const ds = sinhMaKhoiPhuc();
  assert.equal(ds.length, 10);
  assert.equal(new Set(ds).size, 10);
  for (const m of ds) assert.match(m, /^[a-z2-7]{5}-[a-z2-7]{5}$/);
});

test('băm mã khôi phục: tất định, chịu hoa/thường + gạch + cách; không lộ mã', () => {
  voiEnv('MFA_ENCRYPTION_KEY', Buffer.alloc(32, 9).toString('base64'), () => {
    const [m] = sinhMaKhoiPhuc(1);
    const h = bamMaKhoiPhuc(m!);
    assert.equal(bamMaKhoiPhuc(m!.toUpperCase()), h);
    assert.equal(bamMaKhoiPhuc(` ${chuanHoaMaKhoiPhuc(m!)} `), h);
    assert.ok(!h.includes(chuanHoaMaKhoiPhuc(m!)));
    // Đổi tiêu (khoá) ⇒ băm khác ⇒ bản dump CSDL không tự dò được.
    voiEnv('MFA_ENCRYPTION_KEY', Buffer.alloc(32, 10).toString('base64'), () => {
      assert.notEqual(bamMaKhoiPhuc(m!), h);
    });
  });
});
