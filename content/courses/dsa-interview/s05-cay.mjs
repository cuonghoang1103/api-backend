/**
 * Chương 5 — Cây. Mọi mã/output trong chương đọc từ ./ma/ch05 (chạy thật: _chay.mjs).
 * Thứ tự hiển thị: 5.1 duyệt · 5.2 đệ quy · 5.3 BST · 5.4 trie (★ bài mới, slug dsa-5-5-trie) · 5.5 bộ luyện · 5.6 quiz (★).
 */
import b1 from './ch05/b1-duyet.mjs';
import b2 from './ch05/b2-de-quy.mjs';
import b3 from './ch05/b3-bst.mjs';
import b5 from './ch05/b5-trie.mjs';
import b4 from './ch05/b4-luyen.mjs';
import b6 from './ch05/b6-quiz.mjs';

export default {
  title: 'Chapter 5 — Trees|||Chương 5 — Cây',
  description: 'Duyệt DFS/BFS, khuôn đệ quy "trả gì cho cha", cây nhị phân tìm kiếm, trie cho ô gợi ý tìm kiếm — kèm đo độ sâu đệ quy làm sập Node/Java thật, bộ luyện 8 đề và quiz.',
  lessons: [b1, b2, b3, b5, b4, b6],
};
