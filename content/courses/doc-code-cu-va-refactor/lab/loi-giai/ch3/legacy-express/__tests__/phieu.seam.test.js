// Seam ở mức module: jest.mock thay lib/kho bằng bản giả — không sửa một dòng code cũ nào.
jest.mock('../lib/kho');
const kho = require('../lib/kho');
const khoThat = jest.requireActual('../lib/kho');
const request = require('supertest');
const app = require('../app');

test('đọc dữ liệu lỗi ⇒ 500 và chữ thô', async () => {
  kho.doc.mockImplementation((ten, cb) => cb(new Error('EACCES')));
  const res = await request(app).get('/api/phieu/1/phi');
  expect([res.status, res.type, res.text]).toEqual([500, 'text/html', 'loi doc du lieu']);
});

const PHIEU_MO_COI = { id: 9, sach: 'X', docGia: 77, hanTra: '2026-11-01T09:00:00+07:00', ngayTra: null };

test('độc giả đã bị xoá — bản giả THAY HẲN kho: Express in stack trace', async () => {
  kho.doc.mockImplementation((ten, cb) => cb(null, ten === 'phieu' ? [PHIEU_MO_COI] : []));
  const res = await request(app).get('/api/phieu/9/phi');
  expect(res.status).toBe(500);
  expect(res.text).toContain('TypeError: Cannot read property &#39;ten&#39; of undefined');
});

test('độc giả đã bị xoá — kho THẬT, chỉ thêm dữ liệu: hành vi như máy chủ thật', async () => {
  kho.doc.mockImplementation((ten, cb) =>
    khoThat.doc(ten, (err, ds) => cb(err, ten === 'phieu' ? ds.concat([PHIEU_MO_COI]) : ds)));
  const res = await request(app).get('/api/phieu/9/phi');
  // try/catch quanh cb trong lib/kho.js bắt TypeError của route rồi gọi cb LẦN HAI với lỗi đó
  expect([res.status, res.text]).toEqual([500, 'loi doc du lieu']);
});
