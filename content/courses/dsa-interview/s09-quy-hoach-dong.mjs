/**
 * Chương 9 — Quy hoạch động (kèm ★ tham lam). Mọi mã/output trong chương đọc từ ./ma/ch09 (chạy thật: _chay.mjs).
 * Thứ tự hiển thị: 9.1 nhập môn · 9.2 một chiều · 9.3 hai chiều · 9.4 nhận diện · 9.5 tham lam (★) · 9.6 bộ luyện (★) · 9.7 quiz (★).
 * Mã của bài K nằm ở ma/ch09/bK/ (chạy riêng: _chay.mjs --chi ch09/bK/).
 */
import b1 from './ch09/b1-nhap-mon.mjs';
import b2 from './ch09/b2-mot-chieu.mjs';
import b3 from './ch09/b3-hai-chieu.mjs';
import b4 from './ch09/b4-nhan-dien.mjs';
import b5 from './ch09/b5-greedy.mjs';
import b6 from './ch09/b6-luyen.mjs';
import b7 from './ch09/b7-quiz.mjs';

export default {
  title: 'Chapter 9 — Dynamic programming|||Chương 9 — Quy hoạch động',
  description: 'Từ đệ quy sang nhớ, bảng và hai biến (đo thật 2ⁿ vs n); DP một chiều và hai chiều; khuôn 4 câu hỏi trạng thái · chuyển · cơ sở · thứ tự nói trước khi code; tham lam và khi nào nó sai — kèm bảng DP tô màu, mô phỏng, bộ luyện 8 đề và quiz.',
  lessons: [b1, b2, b3, b4, b5, b6, b7],
};
