/**
 * Thu hồi phiên theo roleVersion — luật thuần.
 *   npx tsx --test src/services/phienDangNhap.test.ts
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loiPhienThuHoi, phienConHieuLuc } from './phienDangNhap.js';

test('khớp phiên bản (number / bigint / chuỗi số) ⇒ còn hiệu lực', () => {
  assert.equal(phienConHieuLuc(3, 3), true);
  assert.equal(phienConHieuLuc(3, 3n), true);
  assert.equal(phienConHieuLuc('3', 3n), true);
  assert.equal(phienConHieuLuc(0, 0n), true);
});

test('lệch / thiếu claim / rác ⇒ đã thu hồi', () => {
  assert.equal(phienConHieuLuc(2, 3n), false, 'token cũ sau khi đổi mật khẩu');
  assert.equal(phienConHieuLuc(4, 3n), false, 'token "từ tương lai" cũng không nhận');
  assert.equal(phienConHieuLuc(undefined, 0n), false, 'token cổ không có claim');
  assert.equal(phienConHieuLuc(null, 0n), false);
  assert.equal(phienConHieuLuc('', 0n), false);
  assert.equal(phienConHieuLuc('abc', 0n), false);
  assert.equal(phienConHieuLuc(NaN, 0n), false);
});

test('lỗi thu hồi là 401 SESSION_REVOKED', () => {
  const e = loiPhienThuHoi();
  assert.equal(e.statusCode, 401);
  assert.equal(e.code, 'SESSION_REVOKED');
});
