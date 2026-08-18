/**
 * Phiên âm sai chỉ lộ ra khi NGHE — không có gì đỏ, không có ngoại lệ nào.
 * Người dùng đã báo hai đợt: "file → phi lê" (12/08) và "Node.js, Spring
 * Boot, cuongthai.com đọc sai" (19/08).
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { readFileSync } from 'node:fs';

import { phienAmSangViet, tuKhoaCongNghe } from './phienAm.js';

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

test('từ tiếng Anh thường gặp (đợt bổ sung 19/08) được phiên âm', () => {
  const mau: Array<[string, string]> = [
    ['Bấm nút Submit ở cuối form', 'submit'],
    ['Vào phần Dashboard xem Report', 'report'],
    ['Cái component này render chậm', 'component'],
    ['Anh gửi invoice cho customer chưa', 'invoice'],
    ['Cắm charger vào rồi bật bluetooth lên', 'bluetooth'],
    ['Kéo file lên webhook rồi chạy migration', 'migration'],
  ];
  for (const [cau, tu] of mau) {
    const ra = phienAmSangViet(cau);
    assert.ok(!new RegExp(`\\b${tu}\\b`, 'i').test(ra), `"${tu}" vẫn còn nguyên trong: ${ra}`);
  }
});

test('TU_DIEN không có khoá nào bị ghi đè', () => {
  // Object literal trong JS gộp khoá trùng KHÔNG báo lỗi — nên đếm dòng nguồn
  // rồi so với số mục thực tế; lệch nghĩa là có khoá bị đè.
  const src = readFileSync(new URL('./phienAm.ts', import.meta.url), 'utf8');
  const batDau = src.indexOf('const TU_DIEN');
  const than = src.slice(batDau, src.indexOf('\n};', batDau));
  const dong = [...than.matchAll(/(?:^|[,{]\s*)\n?\s*'?([a-z0-9.+#-]+)'?:\s*'/gm)].length;
  assert.equal(dong, tuKhoaCongNghe().length, 'có khoá trùng trong TU_DIEN');
});
