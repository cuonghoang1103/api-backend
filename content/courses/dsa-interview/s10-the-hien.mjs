/**
 * Chương 10 — Thể hiện trong buổi phỏng vấn (chương KỸ NĂNG). Mọi mã/output đọc từ ./ma/ch10 (chạy thật: _chay.mjs).
 * Thứ tự hiển thị: 10.1 nói · 10.2 code sạch · 10.3 tự test · 10.4 bài test online (OA) · 10.5 quiz (★ bài mới).
 */
import b1 from './ch10/b1-noi.mjs';
import b2 from './ch10/b2-code-sach.mjs';
import b3 from './ch10/b3-test.mjs';
import b4 from './ch10/b4-online.mjs';
import b5 from './ch10/b5-quiz.mjs';

export default {
  title: 'Chapter 10 — Performing in the interview|||Chương 10 — Thể hiện trong buổi phỏng vấn',
  description: 'Nói lời giải bằng tiếng Anh/tiếng Việt theo từng pha (kể cả khi bí và cách xin gợi ý), code sạch dưới áp lực, tự test bằng chạy tay + kiểm thử đối chiếu, và làm bài OA HackerRank/Codility — đọc stdin Node/Java có số đo thật.',
  lessons: [b1, b2, b3, b4, b5],
};
