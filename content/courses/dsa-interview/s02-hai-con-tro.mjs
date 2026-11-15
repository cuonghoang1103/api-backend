/**
 * Chương 2 — Hai con trỏ và cửa sổ trượt. Mọi mã/output trong chương đọc từ ./ma/ch02 (chạy thật: _chay.mjs).
 * GIỮ NGUYÊN title chương và slug bài đầu (dsa-2-1-hai-con-tro) — bộ seed neo chương bằng chúng.
 */
import b1 from './ch02/b1-hai-con-tro.mjs';
import b2 from './ch02/b2-cua-so.mjs';
import b3 from './ch02/b3-nhanh-cham.mjs';
import b4 from './ch02/b4-luyen.mjs';
import b5 from './ch02/b5-quiz.mjs';

export default {
  title: 'Chapter 2 — Two pointers and sliding window|||Chương 2 — Hai con trỏ và cửa sổ trượt',
  description: 'Một lượt thay cho hai vòng lồng: hai con trỏ đối đầu và cùng chiều, cửa sổ trượt cố định và co giãn (kèm rate limiter thật của repo), con trỏ nhanh chậm của Floyd — bộ luyện 8 đề có lời giải và quiz 10 câu.',
  lessons: [b1, b2, b3, b4, b5],
};
