/**
 * Chương 1 — Mảng và băm. Mọi mã/output trong chương đọc từ ./ma/ch01 (chạy thật: _chay.mjs).
 * Thứ tự hiển thị: 1.1 hash map → 1.2 tổng tiền tố → 1.3 sắp xếp → 1.4 bit (★ slug dsa-1-5-bit) → 1.5 bộ luyện
 * (slug khung dsa-1-4-luyen) → 1.6 kiểm tra (★ dsa-1-6-quiz). GIỮ NGUYÊN title chương + bài đầu.
 */
import b1 from './ch01/b1-hash-map.mjs';
import b2 from './ch01/b2-prefix-sum.mjs';
import b3 from './ch01/b3-sap-xep.mjs';
import b5 from './ch01/b5-bit.mjs';
import b4 from './ch01/b4-luyen.mjs';
import b6 from './ch01/b6-quiz.mjs';

export default {
  title: 'Chapter 1 — Arrays and hashing|||Chương 1 — Mảng và băm',
  description: 'Map/Set giải một nửa đề dễ: đổi bộ nhớ lấy thời gian, tổng tiền tố và hiệu mảng, sắp xếp làm công cụ, mẹo bit — bộ luyện 8 đề có lời giải và bài kiểm tra 10 câu.',
  lessons: [b1, b2, b3, b5, b4, b6],
};
