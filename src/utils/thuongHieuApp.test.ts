import { test } from 'node:test';
import assert from 'node:assert/strict';
import { doiThuongHieu, doiThuongHieuJson, TEN_CTC } from './thuongHieuApp.js';

test('đổi tên thương hiệu trong câu', () => {
  assert.equal(doiThuongHieu('Bạn có phải sinh viên FPT University không?'), `Bạn có phải sinh viên ${TEN_CTC} không?`);
  assert.equal(doiThuongHieu('Theo giáo trình của Đại học FPT'), `Theo giáo trình của ${TEN_CTC}`);
  assert.equal(doiThuongHieu('Đề thật FPTU kỳ SU26'), `Đề thật ${TEN_CTC} kỳ SU26`);
  assert.equal(doiThuongHieu('Sinh viên FPT học kỳ 5 (FPTU).'), `Sinh viên ${TEN_CTC} học kỳ 5 (${TEN_CTC}).`);
});

test('giữ nguyên mã, đường dẫn, định danh', () => {
  assert.equal(doiThuongHieu('FPTU_Hola3'), 'FPTU_Hola3');
  assert.equal(doiThuongHieu('https://flm.fpt.edu.vn/gui/role/guest/ListCurriculum'), 'https://flm.fpt.edu.vn/gui/role/guest/ListCurriculum');
  assert.equal(doiThuongHieu('Xem flm.fpt.edu.vn để biết thêm'), 'Xem flm.fpt.edu.vn để biết thêm');
  assert.equal(doiThuongHieu('PRF192 — Lập trình C'), 'PRF192 — Lập trình C');
  assert.equal(doiThuongHieu('FPTSoftware'), 'FPTSoftware');
  // Tên CÔNG TY giữ nguyên — đổi là bịa sự thật.
  assert.equal(doiThuongHieu('Thực tập ở FPT Software, FPT.AI'), 'Thực tập ở FPT Software, FPT.AI');
  assert.equal(doiThuongHieu('Công ty lớn (Naver/LINE, FPT)'), 'Công ty lớn (Naver/LINE, FPT)');
});

test('duyệt JSON, bỏ qua khoá định danh', () => {
  const b = doiThuongHieuJson({
    success: true,
    data: [{ name: 'Kỳ 3', code: 'FPTU_Hola3', description: 'Lộ trình FPTU', imageUrl: 'exam/FPT/a.png',
             slug: 'fpt-intro', nested: { note: ['Sinh viên FPT'] } }],
  });
  assert.equal(b.data[0].description, `Lộ trình ${TEN_CTC}`);
  assert.equal(b.data[0].code, 'FPTU_Hola3');
  assert.equal(b.data[0].imageUrl, 'exam/FPT/a.png');
  assert.equal(b.data[0].slug, 'fpt-intro');
  assert.deepEqual(b.data[0].nested.note, [`Sinh viên ${TEN_CTC}`]);
});
