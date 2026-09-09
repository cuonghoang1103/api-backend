/**
 * Hình dạng của `/courses/semester/:id?gon=1`.
 *
 * Sinh ra từ một lỗi suýt ship 10/09/2026: bản gọn đầu tiên trả
 * `"price": "0"` — CHUỖI, vì `price` là `Decimal` của Prisma. App iOS khai
 * `let price: Double`, nên `JSONDecoder` sẽ ném lỗi và màn Học viện TRẮNG
 * TRƠN. Soi tên trường thì thấy đủ; chỉ soi KIỂU trong JSON thật mới lộ.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { dongGoiMonGon } from './course.routes.js';

/** Bảy trường `struct Course` của iOS khai KHÔNG optional. Thiếu một cái là
 *  giải mã hỏng, và hỏng câm. */
const BAT_BUOC = ['id', 'title', 'slug', 'price', 'isFree', 'level', 'totalStudents'] as const;

const monThat = {
  id: 5, slug: 'coa', title: 'Computer Organization', courseCode: 'CEA201',
  thumbnailUrl: null, shortDescription: null, description: null, totalLessons: 12,
  // Prisma trả về đối tượng Decimal; qua JSON nó thành chuỗi. Dùng chuỗi cho
  // đúng thứ tệ nhất có thể tới.
  price: '0' as unknown,
  isFree: true, level: 'BEGINNER',
  _count: { enrollments: 6 },
};

test('price ra SỐ, không phải chuỗi — iOS khai Double', () => {
  const ra = dongGoiMonGon(monThat);
  assert.equal(typeof ra.price, 'number', 'chuỗi ở đây là màn Học viện iOS trắng trơn');
  assert.equal(ra.price, 0);
  // Và phải sống được với Decimal thật (đối tượng có toString).
  const decimalGia = { toString: () => '49.5', valueOf: () => '49.5' };
  assert.equal(dongGoiMonGon({ ...monThat, price: decimalGia }).price, 49.5);
});

test('đủ 7 trường iOS bắt buộc, và không lọt `_count` ra ngoài', () => {
  const ra = dongGoiMonGon(monThat) as Record<string, unknown>;
  for (const k of BAT_BUOC) {
    assert.ok(k in ra, `thiếu "${k}" ⇒ JSONDecoder của iOS ném lỗi`);
    assert.notEqual(ra[k], undefined, `"${k}" là undefined ⇒ vắng mặt trong JSON`);
  }
  assert.equal(ra.totalStudents, 6, 'đếm từ _count như đường cũ');
  assert.ok(!('_count' in ra), '_count là chi tiết nội bộ, đừng gửi ra');
});

test('KHÔNG kèm `sections` — đó là toàn bộ lý do đường này tồn tại', () => {
  assert.ok(!('sections' in dongGoiMonGon(monThat)));
});
