/**
 * Chương 4 — Tìm kiếm nhị phân. Mọi mã/output trong chương đọc từ ./ma/ch04 (chạy thật: _chay.mjs).
 * Cả chương dùng MỘT khuôn: firstTrue(lo, hi, ok) trên đoạn nửa mở [lo, hi).
 */
import b1 from './ch04/b1-co-ban.mjs';
import b2 from './ch04/b2-xoay.mjs';
import b3 from './ch04/b3-khong-gian-dap-an.mjs';
import b4 from './ch04/b4-luyen.mjs';
import b5 from './ch04/b5-quiz.mjs';

export default {
  title: 'Chapter 4 — Binary search|||Chương 4 — Tìm kiếm nhị phân',
  description: 'Một khuôn nhị phân bất biến dùng xuyên chương: lower/upper bound, mảng xoay, tìm đỉnh, ma trận, tìm trên không gian đáp án — kèm bảng vết lo/mid/hi, đo thật, git bisect thật và bộ luyện 8 đề.',
  lessons: [
    b1, // 4.1 — khuôn firstTrue, lower/upper bound, tràn số, git bisect
    b2, // 4.2 — mảng xoay, tìm đỉnh, ma trận
    b3, // 4.3 — tìm trên không gian đáp án
    b4, // 4.4 — bộ luyện 8 đề
    b5, // 4.5 — quiz (bài mới)
  ],
};
