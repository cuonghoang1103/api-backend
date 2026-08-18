/**
 * Kiểm bộ tách từ khoá — chỗ dễ hỏng nhất của trợ lý.
 *
 * Sai ở đây thì trợ lý im lặng trả "không tìm thấy ghi chú nào" cho những câu
 * hỏi hoàn toàn hợp lệ, và không có lỗi nào để lần ra.
 *
 *   npx tsx --test src/services/noteAssistant.test.ts
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { tachTuKhoa } from './noteAssistant.service.js';

test('bỏ hư từ, giữ từ mang nghĩa', () => {
  const t = tachTuKhoa('tuần trước tôi có ghi gì về Prisma không');
  assert.deepEqual(t, ['prisma']);
});

test('bỏ dấu để "duong" tìm ra "đường"', () => {
  assert.ok(tachTuKhoa('ghi chú về Đường ống dữ liệu').includes('duong'));
});

test('câu hỏi TOÀN hư từ vẫn trả về từ, không trả mảng rỗng', () => {
  // Mảng rỗng sẽ thành mệnh đề OR rỗng ⇒ khớp MỌI ghi chú, tệ hơn hẳn.
  const t = tachTuKhoa('hôm nay có gì không');
  assert.ok(t.length > 0, 'không được rỗng');
});

test('giữ số — "PRO192" và "2026" là từ khoá thật', () => {
  const t = tachTuKhoa('điểm PRO192 kỳ 2026 thế nào');
  assert.ok(t.includes('pro192'));
  assert.ok(t.includes('2026'));
});

test('cắt trần 8 từ để câu dài không dựng truy vấn khổng lồ', () => {
  const t = tachTuKhoa('alpha beta gamma delta epsilon zeta eta theta iota kappa lambda');
  assert.equal(t.length, 8);
});

test('bỏ ký tự một chữ cái — nhiễu chứ không phải từ khoá', () => {
  assert.ok(!tachTuKhoa('a b prisma').includes('a'));
});

test('gộp hai tầng: ghi chú được CẢ HAI chọn phải nổi lên trên', async () => {
  const { gopHaiTang } = await import('./noteAssistant.service.js');
  const ra = gopHaiTang(
    [{ noteId: 2, title: 'B', content: 'b', diem: 0.50 },
     { noteId: 1, title: 'A', content: 'a', diem: 0.45 }],
    [{ id: 1, title: 'A', chu: 'a-cu', diem: 10 }],
  );
  assert.equal(ra[0]!.id, 1, 'A được cả hai tầng chọn nên phải đứng đầu');
  assert.ok(ra[0]!.diem > ra[1]!.diem);
});

test('gộp hai tầng: bỏ kết quả dưới ngưỡng nhiễu', async () => {
  const { gopHaiTang } = await import('./noteAssistant.service.js');
  const ra = gopHaiTang([{ noteId: 9, title: 'nhiễu', content: 'x', diem: 0.30 }], []);
  assert.equal(ra.length, 0, '0,30 là mức của thứ KHÔNG liên quan — phải loại');
});

test('gộp hai tầng: máy nhúng tắt (null) vẫn trả kết quả từ khoá', async () => {
  const { gopHaiTang } = await import('./noteAssistant.service.js');
  const ra = gopHaiTang(null, [{ id: 5, title: 'X', chu: 'x', diem: 4 }]);
  assert.equal(ra.length, 1);
  assert.equal(ra[0]!.id, 5);
});

test('gộp hai tầng: giữ đoạn trích của tầng NGHĨA, không phải cả bài', async () => {
  const { gopHaiTang } = await import('./noteAssistant.service.js');
  const ra = gopHaiTang(
    [{ noteId: 1, title: 'A', content: 'mẩu-gần-câu-hỏi', diem: 0.6 }],
    [{ id: 1, title: 'A', chu: 'cả-bài-dài', diem: 3 }],
  );
  assert.equal(ra[0]!.chu, 'mẩu-gần-câu-hỏi');
});
