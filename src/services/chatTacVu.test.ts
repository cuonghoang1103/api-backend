import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dungLoiNhac, kiemDauVao, loiDeDoc, tinhLanToi } from './chatTacVu.js';

// 2026-11-10 08:00 giờ VN = 01:00Z (thứ Ba)
const LUC = new Date('2026-11-10T01:00:00Z');

test('tinhLanToi hằng ngày: giờ chưa tới ⇒ hôm nay; đã qua ⇒ mai (theo giờ VN)', () => {
  assert.equal(tinhLanToi('ngay', 9 * 60, null, LUC).toISOString(), '2026-11-10T02:00:00.000Z'); // 09:00 VN hôm nay
  assert.equal(tinhLanToi('ngay', 7 * 60 + 30, null, LUC).toISOString(), '2026-11-11T00:30:00.000Z'); // 07:30 VN mai
  assert.equal(tinhLanToi('ngay', 8 * 60, null, LUC).toISOString(), '2026-11-11T01:00:00.000Z'); // đúng phút ⇒ lần sau
});

test('tinhLanToi qua nửa đêm VN (UTC vẫn hôm trước)', () => {
  const khuya = new Date('2026-11-10T17:30:00Z'); // 00:30 VN ngày 11
  assert.equal(tinhLanToi('ngay', 7 * 60, null, khuya).toISOString(), '2026-11-11T00:00:00.000Z');
});

test('tinhLanToi hằng tuần', () => {
  // Chủ nhật (0) 20:00 VN tới gần nhất sau Thứ Ba 08:00 ⇒ 2026-11-15 13:00Z
  assert.equal(tinhLanToi('tuan', 20 * 60, 0, LUC).toISOString(), '2026-11-15T13:00:00.000Z');
  // Thứ Ba (2) 07:00 VN đã qua hôm nay ⇒ tuần sau
  assert.equal(tinhLanToi('tuan', 7 * 60, 2, LUC).toISOString(), '2026-11-17T00:00:00.000Z');
  // Thứ Ba 09:00 VN chưa tới ⇒ hôm nay
  assert.equal(tinhLanToi('tuan', 9 * 60, 2, LUC).toISOString(), '2026-11-10T02:00:00.000Z');
});

test('kiemDauVao: chặn mẫu chưa chạy được, thiếu chủ đề, giờ sai; đặt tên mặc định', () => {
  assert.throws(() => kiemDauVao({ mau: 'hop-thu', lich: 'ngay', gio: 60 }), /chưa chạy được/);
  assert.throws(() => kiemDauVao({ mau: 'theo-doi', lich: 'ngay', gio: 60 }), /chủ đề/);
  assert.throws(() => kiemDauVao({ mau: 'tom-tat-ngay', lich: 'ngay', gio: 1440 }), /Giờ/);
  assert.throws(() => kiemDauVao({ mau: 'tom-tat-ngay', lich: 'tuan', gio: 60 }), /thứ/);
  assert.throws(() => kiemDauVao({ mau: 'tu-dat', lich: 'ngay', gio: 60, loiNhac: '   ' }), /Viết nội dung/);
  const v = kiemDauVao({ mau: 'theo-doi', lich: 'ngay', gio: 480, chuDe: 'Next.js 16' });
  assert.equal(v.ten, 'Theo dõi: Next.js 16');
  assert.match(v.loiNhac, /Next\.js 16/);
  assert.equal(v.thu, null);
});

test('dungLoiNhac tu-dat cắt 2000 ký tự', () => {
  assert.equal(dungLoiNhac('tu-dat', null, 'x'.repeat(5000)).length, 2000);
});

test('loiDeDoc: lỗi cổng ⇒ câu dễ đọc; lỗi hạn mức giữ nguyên', () => {
  assert.equal(loiDeDoc('All AI providers failed: 401 Missing Authentication header'), 'CuongMini đang bận — sẽ thử lại ở lần chạy tới');
  assert.match(loiDeDoc('Quá thời gian chạy (150 giây)'), /quá lâu/);
  assert.equal(loiDeDoc('Bạn đã dùng hết hạn mức chat trong 5 giờ'), 'Bạn đã dùng hết hạn mức chat trong 5 giờ');
});
