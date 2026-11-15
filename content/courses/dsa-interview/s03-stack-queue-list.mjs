/**
 * Chương 3 — Stack, queue và danh sách liên kết. Mọi mã/output trong chương đọc từ ./ma/ch03 (chạy thật: _chay.mjs).
 * Chuỗi slug trong lessons = bài khung chưa soạn (dsa-interview.mjs › ghep). GIỮ NGUYÊN title chương.
 */
import b1 from './ch03/b1-stack.mjs';
import b2 from './ch03/b2-queue.mjs';
import b3 from './ch03/b3-linked-list.mjs';
import b4 from './ch03/b4-luyen.mjs';
import b5 from './ch03/b5-quiz.mjs';

export default {
  title: 'Chapter 3 — Stacks, queues and linked lists|||Chương 3 — Stack, queue và danh sách liên kết',
  description: 'Stack và monotonic stack, queue/deque và hàng đợi đơn điệu, danh sách liên kết và LRU cache — mã TS + Java chạy thật, đo Array.shift() và O(n²) vs O(n), bộ luyện 8 đề có lời giải.',
  lessons: [b1, b2, b3, b4, b5],
};
