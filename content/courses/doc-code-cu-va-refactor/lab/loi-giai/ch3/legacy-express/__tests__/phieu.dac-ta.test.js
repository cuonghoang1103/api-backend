// Characterization test cho API phiếu — ghi lại hành vi HIỆN TẠI.
const request = require('supertest');
const app = require('../app');

beforeEach(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2026-11-24T10:00:00+07:00'));   // "hôm nay" cố định (bài 3.3)
});
afterEach(() => jest.useRealTimers());

test('phiếu không tồn tại', async () => {
  const res = await request(app).get('/api/phieu/999/phi');
  expect([res.status, res.body]).toEqual([404, { loi: 'khong tim thay phieu' }]);
});

test('phiếu đã trả', async () => {
  const res = await request(app).get('/api/phieu/5/phi');
  expect(res.body).toEqual({ phieu: 5, phi: 0, ghiChu: 'da tra' });
});

test('SV trễ 9 ngày 1 giờ', async () => {
  const res = await request(app).get('/api/phieu/1/phi');
  // Node làm tròn LÊN số ngày (Math.ceil) ⇒ 10 ngày × 2000. Java cắt bỏ phần lẻ ⇒ 18000. Hai bên lệch nhau!
  expect(res.body).toEqual({ phieu: 1, docGia: 'Nguyễn Văn An', hanTra: '15/11/2026', phi: 20000 });
});

test('id không phải số', async () => {
  const res = await request(app).get('/api/phieu/abc/phi');
  expect([res.status, res.body]).toEqual([404, { loi: 'khong tim thay phieu' }]);
});
