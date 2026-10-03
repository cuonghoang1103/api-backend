/**
 * TOTP phải khớp TỪNG CHỮ SỐ với bộ vector chính thức RFC 6238 phụ lục B
 * (SHA1, secret ASCII "12345678901234567890", 8 chữ số). Lệch một bit ở cắt
 * động hay thứ tự byte của bộ đếm là mọi app xác thực đều "sai mã".
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { base32Decode, base32Encode, hotp, kiemTotp, otpauthUri, sinhKhoaTotp, TOTP_BUOC_GIAY } from './totp.js';

const KHOA_RFC = Buffer.from('12345678901234567890', 'ascii');
const VECTOR: [number, string][] = [
  [59, '94287082'],
  [1111111109, '07081804'],
  [1111111111, '14050471'],
  [1234567890, '89005924'],
  [2000000000, '69279037'],
  [20000000000, '65353130'],
];

test('khớp vector RFC 6238 phụ lục B (SHA1, 8 số)', () => {
  for (const [t, mong] of VECTOR) {
    assert.equal(hotp(KHOA_RFC, Math.floor(t / TOTP_BUOC_GIAY), 8), mong, `T=${t}`);
  }
});

test('6 số = 6 chữ số cuối của vector (cách app xác thực hiển thị)', () => {
  assert.equal(hotp(KHOA_RFC, Math.floor(59 / 30), 6), '287082');
});

test('base32 đi-về nguyên vẹn, chịu chữ thường/dấu cách/đệm', () => {
  for (let i = 0; i < 20; i++) {
    const k = sinhKhoaTotp();
    const s = base32Encode(k);
    assert.match(s, /^[A-Z2-7]+$/);
    assert.deepEqual(base32Decode(s), k);
    assert.deepEqual(base32Decode(s.toLowerCase().replace(/(.{4})/g, '$1 ') + '=='), k);
  }
  // "12345678901234567890" theo base32 chuẩn
  assert.equal(base32Encode(KHOA_RFC), 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
  assert.throws(() => base32Decode('ABC1'));
});

test('cửa sổ ±1 bước: chấp nhận bước trước/sau, từ chối ±2', () => {
  const k = sinhKhoaTotp();
  const now = 1_700_000_000_000;
  const buoc = Math.floor(now / 1000 / 30);
  assert.equal(kiemTotp(k, hotp(k, buoc), { nowMs: now }), buoc);
  assert.equal(kiemTotp(k, hotp(k, buoc - 1), { nowMs: now }), buoc - 1);
  assert.equal(kiemTotp(k, hotp(k, buoc + 1), { nowMs: now }), buoc + 1);
  // ±2 chỉ khớp nếu tình cờ trùng mã — xác suất 1e-6, coi như không.
  const xa = hotp(k, buoc - 2);
  if (![buoc - 1, buoc, buoc + 1].some((b) => hotp(k, b) === xa)) {
    assert.equal(kiemTotp(k, xa, { nowMs: now }), null);
  }
});

test('chống dùng lại: bước ≤ lastUsedStep bị bỏ qua', () => {
  const k = sinhKhoaTotp();
  const now = 1_700_000_000_000;
  const buoc = Math.floor(now / 1000 / 30);
  const ma = hotp(k, buoc);
  assert.equal(kiemTotp(k, ma, { nowMs: now, lastUsedStep: buoc - 1 }), buoc);
  assert.equal(kiemTotp(k, ma, { nowMs: now, lastUsedStep: buoc }), null, 'cùng mã lần 2');
  // Mã CŨ hơn (bước trước) cũng không dùng được sau khi bước hiện tại đã dùng.
  assert.equal(kiemTotp(k, hotp(k, buoc - 1), { nowMs: now, lastUsedStep: buoc }), null);
  // Mã bước SAU vẫn dùng được (đồng hồ người dùng chạy nhanh).
  assert.equal(kiemTotp(k, hotp(k, buoc + 1), { nowMs: now, lastUsedStep: buoc }), buoc + 1);
});

test('định dạng sai thì null, không ném', () => {
  const k = sinhKhoaTotp();
  for (const x of ['', '12345', '1234567', 'abcdef', '12 34 5x', undefined as unknown as string]) {
    assert.equal(kiemTotp(k, x), null);
  }
  // Có dấu cách giữa (người dùng chép "123 456") vẫn nhận.
  const now = Date.now();
  const ma = hotp(k, Math.floor(now / 1000 / 30));
  assert.notEqual(kiemTotp(k, `${ma.slice(0, 3)} ${ma.slice(3)}`, { nowMs: now }), null);
});

test('otpauth URI đúng khuôn Key Uri Format', () => {
  const u = otpauthUri('CuongThai', 'admin@x.vn', 'JBSWY3DPEHPK3PXP');
  assert.ok(u.startsWith('otpauth://totp/CuongThai:admin%40x.vn?'));
  const q = new URL(u).searchParams;
  assert.equal(q.get('secret'), 'JBSWY3DPEHPK3PXP');
  assert.equal(q.get('issuer'), 'CuongThai');
  assert.equal(q.get('digits'), '6');
  assert.equal(q.get('period'), '30');
  assert.equal(q.get('algorithm'), 'SHA1');
});
