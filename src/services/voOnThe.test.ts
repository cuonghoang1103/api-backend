/** Vở · thẻ ôn — phần THUẦN (chuẩn hoá đầu ra AI, đầu vào ảnh, tên tệp PDF). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { _chiDeKiemThu as T } from './voOnThe.service.js';
import { _chiDeKiemThu as C } from './voChiaSe.service.js';

test('chuanHoaRutThe: bỏ rỗng, bỏ trùng (không phân biệt hoa thường), bỏ gạch đầu dòng, cắt trần', () => {
  const kq = T.chuanHoaRutThe({
    yChinh: ['- Kiểm thử tìm lỗi', 'kiểm thử  tìm lỗi', '', { noiDung: 'Debug sửa lỗi' }, ...Array(20).fill('x').map((x, i) => x + i)],
    cauHoi: [{ hoi: 'Vì sao cần test?', dap: 'Giảm rủi ro' }, { hoi: 'Thiếu đáp án' }, 'rác'],
    the: [{ truoc: 'Defect là gì?', sau: 'Lỗi trong mã' }, { front: 'Failure', back: 'Hệ thống chạy sai' },
      { truoc: 'defect là gì?', sau: 'trùng' }, { truoc: 'a'.repeat(900), sau: 'b' }],
  });
  assert.equal(kq.yChinh[0], 'Kiểm thử tìm lỗi');
  assert.equal(kq.yChinh[1], 'Debug sửa lỗi');
  assert.equal(kq.yChinh.length, 8);
  assert.deepEqual(kq.cauHoi, [{ hoi: 'Vì sao cần test?', dap: 'Giảm rủi ro' }]);
  assert.equal(kq.the.length, 3);
  assert.equal(kq.the[1].truoc, 'Failure');
  assert.equal(kq.the[2].truoc.length, 500);
});

test('chuanHoaRutThe: null / sai kiểu ⇒ rỗng; tachJson bóc được khối trong ```', () => {
  assert.deepEqual(T.chuanHoaRutThe(null), { yChinh: [], cauHoi: [], the: [] });
  assert.deepEqual(T.chuanHoaRutThe({ yChinh: 'x', the: {} }), { yChinh: [], cauHoi: [], the: [] });
  const o = T.tachJson('```json\n{"yChinh":["A"],"the":[]}\n```');
  assert.deepEqual(o, { yChinh: ['A'], the: [] });
  assert.equal(T.tachJson('không có json'), null);
});

test('docAnh: rỗng ⇒ null (được phép khi có goiY); base64 lạ ⇒ lỗi mã', () => {
  assert.equal(T.docAnh(''), null);
  assert.equal(T.docAnh('data:image/jpeg;base64,/9j/AAAA')?.mediaType, 'image/jpeg');
  assert.throws(() => T.docAnh('@@@'), (e: { code?: string }) => e.code === 'ANH_HONG');
  assert.throws(() => T.docAnh('AAAA'), (e: { code?: string }) => e.code === 'ANH_HONG');
});

test('mức chấm ⇒ chất lượng SM-2; tên tệp PDF an toàn', () => {
  assert.deepEqual(T.MUC_Q, { lai: 1, kho: 3, tot: 4, de: 5 });
  assert.equal(C.tenTepAnToan('SWT301 · Đề cương "Fall"/26'), 'SWT301-De-cuong-Fall-26.pdf');
  assert.equal(C.tenTepAnToan(''), 'vo.pdf');
  assert.ok(C.TOKEN_RE.test('abcdefghijklmnopqrstuvwxyz012345'));
  assert.ok(!C.TOKEN_RE.test('../../etc'));
});
