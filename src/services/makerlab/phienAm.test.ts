/**
 * Phiên âm sai chỉ lộ ra khi NGHE — không có gì đỏ, không có ngoại lệ nào.
 * Người dùng đã báo hai đợt: "file → phi lê" (12/08) và "Node.js, Spring
 * Boot, cuongthai.com đọc sai" (19/08).
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { phienAmSangViet } from './phienAm.js';

test('tên có DẤU CHẤM không bị vỡ ra', () => {
  const r = phienAmSangViet('Dự án này dùng Node.js và Next.js.');
  assert.match(r, /nốt-dây-ét/);
  assert.match(r, /nét-dây-ét/);
  assert.doesNotMatch(r, /Node/i);
});

test('TÊN MIỀN đọc kèm chữ "chấm"', () => {
  const r = phienAmSangViet('Bạn vào cuongthai.com nhé.');
  assert.match(r, /cuongthai chấm com/);
});

test('tên HAI CHỮ giữ nguyên là một khối', () => {
  assert.match(phienAmSangViet('Tôi học Spring Boot.'), /sờ-pring bút/);
  assert.match(phienAmSangViet('Dùng machine learning nhé'), /mơ-sin lơn-ning/);
});

test('tên riêng một chữ trong web', () => {
  assert.match(phienAmSangViet('Mở trang Language lên'), /lang-guịch/);
  assert.match(phienAmSangViet('Học Java trước đã'), /gia-va/);
});

test('KHÔNG đụng vào câu tiếng Việt thuần', () => {
  const cau = 'Hôm nay trời đẹp, mình đi chơi nhé.';
  assert.equal(phienAmSangViet(cau), cau);
});

test('KHÔNG xé câu VIẾT HOA nhấn mạnh', () => {
  // Bẫy cũ đã có phép kiểm: "CHÚNG TA PHẢI LÀM NGAY" từng bị đánh vần ra.
  const r = phienAmSangViet('CHÚNG TA PHẢI LÀM NGAY BÂY GIỜ');
  assert.match(r, /CHÚNG TA PHẢI LÀM NGAY/);
});

test('câu THẬT của model, trộn Việt và thuật ngữ', () => {
  const r = phienAmSangViet(
    'Spring Boot là framework Java giúp xây dựng ứng dụng web nhanh chóng.',
  );
  assert.match(r, /sờ-pring bút/);
  assert.match(r, /gia-va/);
  assert.match(r, /phờ-rêm-goéc/);       // framework, có sẵn trong từ điển
  assert.match(r, /là .* giúp xây dựng ứng dụng/);  // phần tiếng Việt còn nguyên
});
