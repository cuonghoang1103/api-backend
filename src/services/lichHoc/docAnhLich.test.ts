/**
 * Bộ lọc kết quả đọc ảnh thời khoá biểu.
 *
 * Đây là lớp chắn giữa "model nói gì" và "lịch học của người dùng". Model
 * nhìn ảnh mờ, đọc nhầm cột, hoặc bịa cho đủ tuần — đều là chuyện có thật.
 * Mọi thứ lọt qua đây phải hợp lệ, và mọi thứ BỊ BỎ phải được nói ra.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { bocJson, locBuoi, KHUNG_SLOT } from './docAnhLich.js';

test('bóc được JSON kể cả khi model bọc ```json và thêm lời dẫn', () => {
  const raw = 'Đây là kết quả:\n```json\n{"buoi":[],"canhBao":["x"]}\n```';
  assert.deepEqual(bocJson(raw), { buoi: [], canhBao: ['x'] });
  // Không có JSON thì phải NÉM, đừng trả về rỗng — rỗng trông như "ảnh không
  // có buổi nào", mà thật ra là hỏng.
  assert.throws(() => bocJson('xin lỗi tôi không đọc được ảnh'));
});

test('điền giờ theo slot — người dùng không phải gõ, và không lệch được', () => {
  const { buoi } = locBuoi({ buoi: [{ thu: 3, slot: 1, monHoc: 'SWT301', phong: 'DE-412' }] });
  assert.equal(buoi.length, 1);
  assert.equal(buoi[0]!.batDau, KHUNG_SLOT[1]![0]);
  assert.equal(buoi[0]!.ketThuc, KHUNG_SLOT[1]![1]);
});

test('BỎ dòng hỏng, và NÓI RA từng dòng đã bỏ', () => {
  const { buoi, canhBao } = locBuoi({
    buoi: [
      { thu: 9, slot: 1, monHoc: 'A' },        // thứ 9 không tồn tại
      { thu: 2, slot: 8, monHoc: 'B' },        // slot không có khung giờ
      { thu: 2, slot: 1, monHoc: '   ' },      // không đọc được tên môn
      { thu: 4, slot: 2, monHoc: 'MAD101' },   // hợp lệ
    ],
    canhBao: [],
  });
  assert.equal(buoi.length, 1, 'chỉ một dòng hợp lệ được đi tiếp');
  assert.equal(buoi[0]!.monHoc, 'MAD101');
  assert.equal(canhBao.length, 3, 'ba dòng bị bỏ ⇒ ba lời cảnh báo, không được im lặng');
});

test('hai buổi chồng nhau cùng thứ+slot: giữ một, báo cái còn lại', () => {
  const { buoi, canhBao } = locBuoi({
    buoi: [
      { thu: 5, slot: 3, monHoc: 'PRO192' },
      { thu: 5, slot: 3, monHoc: 'OSG202' },
    ],
  });
  assert.equal(buoi.length, 1);
  assert.equal(buoi[0]!.monHoc, 'PRO192');
  assert.match(canhBao.join(' '), /chồng nhau/);
});

test('"null"/"N/A" model viết ra CHỮ phải thành trống thật', () => {
  const { buoi } = locBuoi({
    buoi: [{ thu: 2, slot: 1, monHoc: 'X', phong: 'N/A', giaoVien: 'null' }],
  });
  assert.equal(buoi[0]!.phong, null, '"N/A" mà lưu nguyên là hiện lên màn hình chữ N/A');
  assert.equal(buoi[0]!.giaoVien, null);
});

test('kết quả sắp theo thứ rồi tới slot — đúng thứ tự người dùng đọc bảng', () => {
  const { buoi } = locBuoi({
    buoi: [
      { thu: 6, slot: 1, monHoc: 'C' },
      { thu: 2, slot: 4, monHoc: 'A' },
      { thu: 2, slot: 2, monHoc: 'B' },
    ],
  });
  assert.deepEqual(buoi.map((b) => `${b.thu}-${b.slot}`), ['2-2', '2-4', '6-1']);
});

test('model trả về rác thì ra danh sách RỖNG, không ném, không bịa', () => {
  assert.deepEqual(locBuoi({}).buoi, []);
  assert.deepEqual(locBuoi({ buoi: 'không phải mảng' }).buoi, []);
  assert.deepEqual(locBuoi({ buoi: [null, 42, 'x'] }).buoi, []);
});
