/**
 * ============================================================
 * NGỮ CẢNH CHO AI HỎI-ĐÁP BÀI GIẢNG — BỘ KIỂM
 * ============================================================
 *
 * Bài giảng ở Code Lab dài tới 272 khối (module 847), vượt xa trần nhét vào
 * prompt. Nên có một phép CẮT. Phép cắt sai thì không có lỗi nào ném ra: AI vẫn
 * trả lời trôi chảy, chỉ là trả lời về phần khác — và người học tin nó.
 *
 * Điểm cốt: cắt QUANH mục đang hỏi, không cắt từ đầu bài. Cắt từ đầu là luôn
 * mất phần cuối, mà phần cuối mới là phần khó nên mới bị hỏi.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { chuCuaBaiGiang } from '../codeLab.lesson.service.js';

test('bóc đủ loại khối, giữ nguyên thứ tự', () => {
  const ra = chuCuaBaiGiang([
    { type: 'heading', text: 'Tầng model' },
    { type: 'prose', html: '<p>Model là <strong>JavaBean</strong>.</p>' },
    { type: 'code', language: 'java', code: 'public class Doctor {}' },
    { type: 'mermaid', code: 'flowchart LR\n A-->B' },
  ]);
  assert.match(ra, /## Tầng model/);
  assert.match(ra, /Model là JavaBean\./);      // thẻ HTML bị bóc, chữ giữ nguyên
  assert.match(ra, /```java\npublic class Doctor/);
  assert.match(ra, /```mermaid/);
  assert.ok(ra.indexOf('## Tầng model') < ra.indexOf('public class Doctor'));
});

test('không phải mảng thì trả chuỗi rỗng, không ném', () => {
  assert.equal(chuCuaBaiGiang(null), '');
  assert.equal(chuCuaBaiGiang('chuỗi'), '');
  assert.equal(chuCuaBaiGiang([]), '');
});

test('bài dài: cắt QUANH mục đang hỏi, không cắt từ đầu', () => {
  // 40k ký tự đệm rồi mới tới mục cần hỏi — vượt trần 26k, nên cắt từ đầu là
  // chắc chắn mất nó.
  const khoi = [
    { type: 'prose', html: '<p>' + 'đệm '.repeat(9_000) + '</p>' },
    { type: 'heading', text: 'Bẫy Scanner nextInt và nextLine' },
    { type: 'prose', html: '<p>Đọc trọn dòng rồi parse.</p>' },
  ];
  const cat = chuCuaBaiGiang(khoi, 'Bẫy Scanner nextInt và nextLine');
  assert.match(cat, /Bẫy Scanner nextInt/);
  assert.match(cat, /Đọc trọn dòng rồi parse/);

  // Không nói đang hỏi mục nào thì đành cắt từ đầu — và mục cuối rơi mất. Đây
  // chính là lý do giao diện gửi kèm tên mục.
  const catMu = chuCuaBaiGiang(khoi);
  assert.doesNotMatch(catMu, /Đọc trọn dòng rồi parse/);
});

test('bài ngắn thì giữ nguyên, không cắt', () => {
  const ra = chuCuaBaiGiang([{ type: 'prose', html: '<p>ngắn thôi</p>' }], 'không có mục này');
  assert.equal(ra.trim(), 'ngắn thôi');
});
