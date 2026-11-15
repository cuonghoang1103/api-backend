/**
 * Chương 7 — Đồ thị. Mọi mã/output trong chương đọc từ ./ma/ch07 (chạy thật: _chay.mjs).
 * Thứ tự hiển thị: 7.1 biểu diễn · 7.2 BFS/DFS · 7.3 tô-pô · 7.4 Dijkstra + union-find · ★7.5 bộ luyện · ★7.6 quiz.
 * GIỮ NGUYÊN title chương và slug bài đầu (dsa-7-1-bieu-dien).
 */
import b1 from './ch07/b1-bieu-dien.mjs';
import b2 from './ch07/b2-bfs-dfs.mjs';
import b3 from './ch07/b3-topo.mjs';
import b4 from './ch07/b4-dijkstra.mjs';
import b5 from './ch07/b5-luyen.mjs';
import b6 from './ch07/b6-quiz.mjs';

export default {
  title: 'Chapter 7 — Graphs|||Chương 7 — Đồ thị',
  description: 'Biểu diễn đồ thị, BFS/DFS (đếm đảo, BFS nhiều nguồn, word ladder), sắp xếp tô-pô trên môn tiên quyết thật của FPTU, Dijkstra, Bellman-Ford có giới hạn và union-find — mã TS + Java chạy thật, đo ma trận vs danh sách kề, độ sâu DFS đệ quy, Dijkstra mảng vs heap, union-find ngây thơ vs tối ưu, bộ luyện 8 đề và quiz.',
  lessons: [b1, b2, b3, b4, b5, b6],
};
