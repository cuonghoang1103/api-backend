import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { dungLatest, sha256File } from '../../phatHanh.mjs';
import { canKiemLai, soSanhPhienBan, MOT_NGAY } from '../capNhat';

test('latest.json: đúng trường, tên gói theo phiên bản', () => {
  const j = dungLatest({ phienBan: '0.2.0', sha256: 'a'.repeat(64), kichThuoc: 1234, ngay: new Date('2026-10-17T00:00:00Z') });
  assert.deepEqual(j, { version: '0.2.0', sha256: 'a'.repeat(64), size: 1234, file: 'cuongmini-0.2.0.tgz', date: '2026-10-17T00:00:00.000Z', node: '>=20' });
  assert.equal(dungLatest({ phienBan: '0.2.0', sha256: 'a'.repeat(64), kichThuoc: 1, tenFile: 'cuongmini-latest.tgz' }).file, 'cuongmini-latest.tgz');
  assert.throws(() => dungLatest({ phienBan: '0.2.0', sha256: 'a'.repeat(64), kichThuoc: 1, tenFile: '../x.tgz' }), /Tên file/);
  assert.throws(() => dungLatest({ phienBan: 'v1', sha256: 'a'.repeat(64), kichThuoc: 1 }), /Phiên bản/);
  assert.throws(() => dungLatest({ phienBan: '1.0.0', sha256: 'xyz', kichThuoc: 1 }), /sha256/);
  assert.throws(() => dungLatest({ phienBan: '1.0.0', sha256: 'a'.repeat(64), kichThuoc: 0 }), /Kích thước/);
});

test('sha256 của file', () => {
  const d = mkdtempSync(path.join(tmpdir(), 'cm-sha-'));
  try {
    writeFileSync(path.join(d, 'x'), 'abc');
    assert.equal(sha256File(path.join(d, 'x')), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  } finally { rmSync(d, { recursive: true, force: true }); }
});

test('so phiên bản + nhịp kiểm cập nhật 1 lần/ngày', () => {
  assert.ok(soSanhPhienBan('0.2.0', '0.1.9') > 0);
  assert.ok(soSanhPhienBan('0.10.0', '0.9.0') > 0);
  assert.equal(soSanhPhienBan('v1.0.0', '1.0.0'), 0);
  assert.ok(soSanhPhienBan('1.0.0', '1.0.1') < 0);
  const nay = 1_000_000_000_000;
  assert.equal(canKiemLai(null, nay), true);
  assert.equal(canKiemLai(nay - 1000, nay), false);
  assert.equal(canKiemLai(nay - MOT_NGAY, nay), true);
  assert.equal(canKiemLai(nay + 5000, nay), true, 'đồng hồ lùi ⇒ kiểm lại');
});
