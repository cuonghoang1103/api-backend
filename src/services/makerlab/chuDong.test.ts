import test from 'node:test';
import assert from 'node:assert/strict';
import { caiDatChuDongMacDinh, chuanChuDong, gioVn, laBaoThuc, trongYenTinh } from './chuDong.js';
import { dsCongCu } from './congCu.js';

test('giờ yên tĩnh vắt qua nửa đêm', () => {
  const cd = caiDatChuDongMacDinh(); // 23:30–06:30
  assert.equal(trongYenTinh(cd, 23 * 60 + 45), true);
  assert.equal(trongYenTinh(cd, 3 * 60), true);
  assert.equal(trongYenTinh(cd, 6 * 60 + 30), false);
  assert.equal(trongYenTinh(cd, 20 * 60), false);
  assert.equal(trongYenTinh({ ...cd, yenTinhTu: '13:00', yenTinhDen: '14:00' }, 13 * 60 + 30), true);
});

test('chuẩn hoá cài đặt: giờ sai giữ mặc định, null = tắt, "7:05" ⇒ "07:05"', () => {
  const c = chuanChuDong({ banTin: '7:05', onTu: null, hoiHan: '25:00', bat: 'x' });
  assert.equal(c.banTin, '07:05');
  assert.equal(c.onTu, null);
  assert.equal(c.hoiHan, '21:30');
  assert.equal(c.bat, true);
});

test('giờ Việt Nam từ UTC', () => {
  const g = gioVn(new Date('2026-11-15T23:30:00Z'));
  assert.equal(g.hhmm, '06:30');
  assert.equal(g.ngay, '2026-11-16');
});

test('nhận ra kế hoạch báo thức', () => {
  assert.equal(laBaoThuc('Báo thức'), true);
  assert.equal(laBaoThuc('bao thuc 6h'), true);
  assert.equal(laBaoThuc('Học tiếng Nhật'), false);
});

test('công cụ chủ động có mặt cho mọi robot', () => {
  const ten = dsCongCu(false).map((t) => t.name);
  for (const t of ['dat_bao_thuc', 'hen_gio', 'ghi_nho', 'ban_tin', 'cai_dat_chu_dong', 'bat_dau_hoc']) assert.ok(ten.includes(t), t);
});
