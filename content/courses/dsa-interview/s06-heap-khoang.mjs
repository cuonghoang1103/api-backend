/**
 * Chương 6 — Heap và khoảng. Mọi mã/output trong chương đọc từ ./ma/ch06 (chạy thật: _chay.mjs).
 * GIỮ NGUYÊN title chương (bộ seed neo chương bằng nó) và bài đầu dsa-6-1-heap.
 */
import b1 from './ch06/b1-heap.mjs';
import b2 from './ch06/b2-trung-vi.mjs';
import b3 from './ch06/b3-khoang.mjs';
import b4 from './ch06/b4-luyen.mjs';
import b5 from './ch06/b5-quiz.mjs';

export default {
  title: 'Chapter 6 — Heaps and intervals|||Chương 6 — Heap và khoảng',
  description: 'Heap 25 dòng tự viết cho JS và PriorityQueue của Java (bẫy comparator tràn số), top-k đo thật sort vs heap vs quickselect, gộp k danh sách, hai heap trung vị động, bài toán khoảng (nửa mở/đóng, tham lam theo điểm cuối, số phòng họp bằng heap và đường quét), bộ luyện 8 đề.',
  lessons: [b1, b2, b3, b4, b5],
};
