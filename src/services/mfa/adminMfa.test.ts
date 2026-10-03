/**
 * Luật step-up: `mfaAt` hết hạn sau TTL, phải ≥ lần bật MFA gần nhất, và
 * enforce chỉ chặn admin chưa bật.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mfaAtConHieuLuc, quyetDinhMfaAdmin, cauHinhMfa } from './adminMfa.js';

const NOW = 1_800_000_000;

test('mfaAt còn hạn trong TTL, hết hạn đúng ở mốc TTL', () => {
  assert.equal(mfaAtConHieuLuc(NOW - 60, { nowSec: NOW, ttlHours: 12 }), true);
  assert.equal(mfaAtConHieuLuc(NOW - 12 * 3600 + 1, { nowSec: NOW, ttlHours: 12 }), true);
  assert.equal(mfaAtConHieuLuc(NOW - 12 * 3600, { nowSec: NOW, ttlHours: 12 }), false);
  assert.equal(mfaAtConHieuLuc(NOW - 2 * 3600, { nowSec: NOW, ttlHours: 1 }), false);
});

test('mfaAt thiếu / không phải số / ở tương lai xa ⇒ không hợp lệ', () => {
  for (const x of [undefined, null, 0, -5, 'abc', NaN, Infinity, String(NOW)]) {
    assert.equal(mfaAtConHieuLuc(x, { nowSec: NOW, ttlHours: 12 }), false, String(x));
  }
  assert.equal(mfaAtConHieuLuc(NOW + 30, { nowSec: NOW, ttlHours: 12 }), true, 'lệch đồng hồ nhỏ');
  assert.equal(mfaAtConHieuLuc(NOW + 3600, { nowSec: NOW, ttlHours: 12 }), false);
});

test('mfaAt cũ hơn lần BẬT MFA gần nhất ⇒ hết hiệu lực (tắt-bật lại)', () => {
  const enabledAt = new Date((NOW - 100) * 1000);
  assert.equal(mfaAtConHieuLuc(NOW - 100, { nowSec: NOW, ttlHours: 12, enabledAt }), true);
  assert.equal(mfaAtConHieuLuc(NOW - 101, { nowSec: NOW, ttlHours: 12, enabledAt }), false);
});

test('quyết định: chưa bật MFA ⇒ cho qua (opt-in), enforce ⇒ MFA_SETUP_REQUIRED', () => {
  const tat = { mfaEnabled: false, mfaEnabledAt: null };
  assert.equal(quyetDinhMfaAdmin(tat, {}, { nowSec: NOW, cauHinh: { ttlHours: 12, enforce: false } }), null);
  assert.equal(quyetDinhMfaAdmin(tat, {}, { nowSec: NOW, cauHinh: { ttlHours: 12, enforce: true } }), 'MFA_SETUP_REQUIRED');
  // enforce không làm khó người có mfaAt nhưng chưa bật — vẫn là SETUP_REQUIRED.
  assert.equal(quyetDinhMfaAdmin(tat, { mfaAt: NOW }, { nowSec: NOW, cauHinh: { ttlHours: 12, enforce: true } }), 'MFA_SETUP_REQUIRED');
});

test('quyết định: đã bật ⇒ cần mfaAt hợp lệ', () => {
  const bat = { mfaEnabled: true, mfaEnabledAt: new Date((NOW - 3600) * 1000) };
  const ch = { ttlHours: 12, enforce: false };
  assert.equal(quyetDinhMfaAdmin(bat, undefined, { nowSec: NOW, cauHinh: ch }), 'MFA_REQUIRED');
  assert.equal(quyetDinhMfaAdmin(bat, {}, { nowSec: NOW, cauHinh: ch }), 'MFA_REQUIRED');
  assert.equal(quyetDinhMfaAdmin(bat, { mfaAt: NOW - 60 }, { nowSec: NOW, cauHinh: ch }), null);
  assert.equal(quyetDinhMfaAdmin(bat, { mfaAt: NOW - 13 * 3600 }, { nowSec: NOW, cauHinh: ch }), 'MFA_REQUIRED');
  assert.equal(quyetDinhMfaAdmin(bat, { mfaAt: NOW - 7200 }, { nowSec: NOW, cauHinh: ch }), 'MFA_REQUIRED', 'trước lần bật');
});

test('cấu hình từ env: TTL mặc định 12, enforce chỉ khi true/1', () => {
  const cu = { t: process.env.ADMIN_MFA_TTL_HOURS, e: process.env.ADMIN_MFA_ENFORCE };
  try {
    delete process.env.ADMIN_MFA_TTL_HOURS; delete process.env.ADMIN_MFA_ENFORCE;
    assert.deepEqual(cauHinhMfa(), { ttlHours: 12, enforce: false });
    process.env.ADMIN_MFA_TTL_HOURS = '2'; process.env.ADMIN_MFA_ENFORCE = 'true';
    assert.deepEqual(cauHinhMfa(), { ttlHours: 2, enforce: true });
    process.env.ADMIN_MFA_TTL_HOURS = 'abc'; process.env.ADMIN_MFA_ENFORCE = 'no';
    assert.deepEqual(cauHinhMfa(), { ttlHours: 12, enforce: false });
  } finally {
    if (cu.t === undefined) delete process.env.ADMIN_MFA_TTL_HOURS; else process.env.ADMIN_MFA_TTL_HOURS = cu.t;
    if (cu.e === undefined) delete process.env.ADMIN_MFA_ENFORCE; else process.env.ADMIN_MFA_ENFORCE = cu.e;
  }
});
