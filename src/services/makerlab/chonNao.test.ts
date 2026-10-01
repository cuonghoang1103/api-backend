import { test } from 'node:test';
import assert from 'node:assert/strict';

import { phanLoaiCau } from './chonNao.js';

// Câu thật kiểu người dùng hay hỏi robot (log 01/10/2026) + câu mẫu từng loại.
const CA: Array<[string, boolean, 'ngan' | 'vua' | 'dai']> = [
  // chuyện phiếm / hỏi nhanh → máy nhà, ngắn
  ['Mấy giờ rồi?', false, 'ngan'],
  ['Ngày mai là thứ mấy?', false, 'ngan'],
  ['Chào bạn', false, 'ngan'],
  ['Bạn còn ở đấy không?', false, 'ngan'],
  ['Cảm ơn nhé', false, 'ngan'],
  ['Pin còn bao nhiêu?', false, 'ngan'],
  // câu khó → cổng, đủ ý
  ['Vì sao bầu trời có màu xanh?', true, 'dai'],
  ['Giải thích cho tôi Docker hoạt động thế nào', true, 'dai'],
  ['So sánh React với Vue giúp tôi', true, 'dai'],
  ['Làm sao để học tiếng Anh nhanh hơn?', true, 'dai'],
  ['Có nên mua pin 3S cho robot không?', true, 'dai'],
  ['Hướng dẫn tôi cài PostgreSQL', true, 'dai'],
  // hỏi định nghĩa ngắn → cổng, vừa
  ['Docker là gì?', true, 'vua'],
  ['Nguyễn Du là ai?', true, 'vua'],
  // người dùng tự đòi độ dài
  ['Kể chi tiết về lịch sử Hà Nội đi', true, 'dai'],
  ['Tại sao trời mưa, nói ngắn thôi', true, 'ngan'],
  ['Tóm tắt giúp tôi bài vừa rồi', false, 'ngan'],
  // không dấu hiệu: đoán theo độ dài
  ['Ngày mai tôi có những môn học gì?', false, 'vua'],
  ['Hôm nay tôi đi học về thấy hơi mệt mà bài tập thì còn nhiều quá không biết bắt đầu từ đâu cho hợp lý nữa', true, 'vua'],
];

for (const [cau, kho, doDai] of CA) {
  test(`phanLoaiCau: ${cau}`, () => {
    const r = phanLoaiCau(cau);
    assert.equal(r.kho, kho, `kho (${r.lyDo})`);
    assert.equal(r.doDai, doDai, `doDai (${r.lyDo})`);
  });
}

// Bỏ dấu xong dễ bắt nhầm: "má" thành "ma", "khác" trong câu thường…
test('phanLoaiCau: không bắt nhầm chữ thường gặp', () => {
  assert.equal(phanLoaiCau('Má tôi nấu cơm rồi').kho, false);
  assert.equal(phanLoaiCau('Lát nữa đi chơi không?').kho, false);
  assert.equal(phanLoaiCau('').doDai, 'ngan');
});
