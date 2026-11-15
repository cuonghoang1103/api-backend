/** 7.5 — Bộ luyện 7: 8 đề đồ thị có lời giải từng bước. Mã/output đọc từ ../ma/ch07 (chạy thật). */
import { maHai, ketQua, bangVet, lc, nguon, gap, baiNay, moPhong } from '../_chung.mjs';
import { vetKruskal } from '../ma/ch07/luyen.vet.mjs';

const D = {
  l1: lc(733, 'flood-fill', 'Flood Fill', 'Easy'),
  l2: lc(695, 'max-area-of-island', 'Max Area of Island', 'Medium'),
  l3: lc(542, '01-matrix', '01 Matrix', 'Medium'),
  l4: lc(802, 'find-eventual-safe-states', 'Find Eventual Safe States', 'Medium'),
  l5: lc(990, 'satisfiability-of-equality-equations', 'Satisfiability of Equality Equations', 'Medium'),
  l6: lc(1584, 'min-cost-to-connect-all-points', 'Min Cost to Connect All Points', 'Medium'),
  l7: lc(1514, 'path-with-maximum-probability', 'Path with Maximum Probability', 'Medium'),
  l8: lc(778, 'swim-in-rising-water', 'Swim in Rising Water', 'Hard'),
};

const vk = vetKruskal([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]);
const BANG_KRUSKAL = bangVet(['edge (cost)', 'find(i) ≠ find(j)?', 'decision', 'total', 'edges used'],
  vk.map((h) => [
    `<code>${h.i}–${h.j}</code> (${h.w})`,
    h.nhan ? 'yes — different groups' : 'no — same group',
    h.nhan ? '<strong>take</strong>' : 'skip (cycle)',
    String(h.cost),
    `${h.used} / 4`,
  ]));

export default {
  title: '7.5 — Practice set 7: eight graph problems|||7.5 — Bộ luyện 7: tám đề đồ thị',
  slug: 'dsa-7-5-luyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám đề từ dễ tới khó trộn cả chương — tô loang, diện tích đảo lớn nhất, BFS nhiều nguồn trên ma trận 0/1, trạng thái an toàn (Kahn ngược), phương trình bằng nhau (union-find), cây khung nhỏ nhất Kruskal, đường xác suất lớn nhất và bơi trong nước dâng (Dijkstra biến thể) — mỗi đề có gợi ý gập và lời giải TS + Java chạy thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Practice set 7: eight graph problems</h2>
<p class="lead">Eight problems, easy to hard, mixing every tool of the chapter on purpose — in a real interview nobody says "this is multi-source BFS" or "use union-find". For each one: read the problem, say out loud what a node is, what an edge is, and which tool you will use <em>before</em> opening any hint; set a timer; talk as if someone were listening. Open the hints only after five stuck minutes, the solution only after you have submitted something.</p>
<table>
<thead><tr><th>#</th><th>Problem</th><th>Pattern</th><th>Target time</th></tr></thead>
<tbody>
<tr><td>1</td><td>${D.l1}</td><td>grid DFS from one cell</td><td>15′</td></tr>
<tr><td>2</td><td>${D.l2}</td><td>components that return their size</td><td>25′</td></tr>
<tr><td>3</td><td>${D.l3}</td><td>multi-source BFS</td><td>25′</td></tr>
<tr><td>4</td><td>${D.l4}</td><td>Kahn on the reversed graph</td><td>25′</td></tr>
<tr><td>5</td><td>${D.l5}</td><td>union-find, two passes</td><td>25′</td></tr>
<tr><td>6</td><td>${D.l6}</td><td>minimum spanning tree (Kruskal)</td><td>25′</td></tr>
<tr><td>7</td><td>${D.l7}</td><td>Dijkstra with products</td><td>25′</td></tr>
<tr><td>8</td><td>${D.l8}</td><td>Dijkstra with max (minimax path)</td><td>40′</td></tr>
</tbody></table>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Node? Edge?</span><span class="lz-d">say both before anything else</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Weighted? Directed?</span><span class="lz-d">BFS / Dijkstra / Bellman-Ford</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Order? Groups?</span><span class="lz-d">topological sort / union-find</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Code, out loud</span><span class="lz-d">timer running</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Test + log</span><span class="lz-d">edge cases, then submit; write signal → tool → mistake</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Bộ luyện 7: tám đề đồ thị</h2>
<p class="lead">Tám đề, từ dễ tới khó, cố ý trộn mọi công cụ của chương — khi phỏng vấn thật, không ai bảo bạn "đây là BFS nhiều nguồn" hay "dùng union-find đi". Với mỗi đề: đọc đề, nói to đỉnh là gì, cạnh là gì, và sẽ dùng công cụ nào <em>trước khi</em> mở bất kỳ gợi ý nào; bấm giờ; nói như đang có người nghe. Chỉ mở gợi ý sau năm phút bí, chỉ mở lời giải sau khi đã nộp một bản nào đó.</p>
<table>
<thead><tr><th>#</th><th>Đề</th><th>Mẫu</th><th>Thời gian mục tiêu</th></tr></thead>
<tbody>
<tr><td>1</td><td>${D.l1}</td><td>DFS trên lưới từ một ô</td><td>15′</td></tr>
<tr><td>2</td><td>${D.l2}</td><td>thành phần liên thông trả về kích thước</td><td>25′</td></tr>
<tr><td>3</td><td>${D.l3}</td><td>BFS nhiều nguồn</td><td>25′</td></tr>
<tr><td>4</td><td>${D.l4}</td><td>Kahn trên đồ thị đảo chiều</td><td>25′</td></tr>
<tr><td>5</td><td>${D.l5}</td><td>union-find, hai lượt</td><td>25′</td></tr>
<tr><td>6</td><td>${D.l6}</td><td>cây khung nhỏ nhất (Kruskal)</td><td>25′</td></tr>
<tr><td>7</td><td>${D.l7}</td><td>Dijkstra với phép nhân</td><td>25′</td></tr>
<tr><td>8</td><td>${D.l8}</td><td>Dijkstra với max (đường minimax)</td><td>40′</td></tr>
</tbody></table>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đỉnh? Cạnh?</span><span class="lz-d">nói cả hai trước mọi thứ</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Trọng số? Có hướng?</span><span class="lz-d">BFS / Dijkstra / Bellman-Ford</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thứ tự? Nhóm?</span><span class="lz-d">sắp xếp tô-pô / union-find</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Code, nói to</span><span class="lz-d">đồng hồ đang chạy</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Test + ghi sổ</span><span class="lz-d">ca biên, rồi nộp; ghi dấu hiệu → công cụ → lỗi đã mắc</span></div>
</div>
<p>Khung 6 bước ở <a href="${baiNay('dsa-0-2-khung')}">bài 0.2</a>; ôn lại công cụ nào thì về <a href="${baiNay('dsa-7-1-bieu-dien')}">7.1 biểu diễn</a>, <a href="${baiNay('dsa-7-2-bfs-dfs')}">7.2 BFS/DFS</a>, <a href="${baiNay('dsa-7-3-topo')}">7.3 tô-pô</a>, <a href="${baiNay('dsa-7-4-dijkstra')}">7.4 Dijkstra/union-find</a>.</p>
</div>

<div class="ml-en">
<h3>1. ${D.l1}</h3>
<p><strong>Problem.</strong> An image is a grid of colour numbers. Starting from pixel <code>(sr, sc)</code>, repaint it and every pixel connected to it (4 directions) that has the <em>same original colour</em> with a new colour — the paint-bucket tool. <code>[[1,1,1],[1,1,0],[1,0,1]]</code>, start (1, 1), colour 2 → <code>[[2,2,2],[2,2,0],[2,0,1]]</code> (the bottom-right 1 is not connected).</p>
<p><strong>Recognising the pattern.</strong> Node = pixel, edge = same-colour neighbours. One connected component from one start: a single traversal.</p>
${gap('💡 Hint 1', '<p>Remember the original colour before you change anything. What does "visited" mean if you repaint as you go?</p>')}
${gap('💡 Hint 2', '<p>A repainted pixel no longer has the original colour, so it is automatically "visited" — unless the new colour equals the old one.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Save <code>old = image[sr][sc]</code>. If <code>old === color</code>, return immediately: nothing changes, and continuing would loop forever because a repainted pixel still looks unvisited. Otherwise run an iterative DFS: repaint a pixel when you push it, push neighbours that still have <code>old</code>. <strong>Complexity:</strong> O(R·C) time, O(R·C) stack in the worst case (a fully same-coloured image). <strong>Edge cases tried:</strong> new colour equal to the old one (second test, unchanged), a start pixel whose colour matches nobody around it (third test).</p>')}
</div>
<div class="ml-vi">
<h3>1. ${D.l1}</h3>
<p><strong>Đề.</strong> Một tấm ảnh là lưới các số màu. Bắt đầu từ điểm ảnh <code>(sr, sc)</code>, tô lại nó và mọi điểm ảnh nối với nó (4 hướng) có <em>cùng màu ban đầu</em> bằng một màu mới — công cụ thùng sơn. <code>[[1,1,1],[1,1,0],[1,0,1]]</code>, bắt đầu (1, 1), màu 2 → <code>[[2,2,2],[2,2,0],[2,0,1]]</code> (số 1 ở góc dưới-phải không nối vào).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Đỉnh = điểm ảnh, cạnh = hai điểm kề cùng màu. Một thành phần liên thông từ một điểm xuất phát: một lượt duyệt.</p>
${gap('💡 Gợi ý 1', '<p>Nhớ màu ban đầu trước khi đổi bất cứ thứ gì. Nếu vừa đi vừa tô, thì "đã thăm" nghĩa là gì?</p>')}
${gap('💡 Gợi ý 2', '<p>Điểm đã tô không còn màu cũ, nên nó tự động là "đã thăm" — trừ khi màu mới bằng màu cũ.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Lưu <code>old = image[sr][sc]</code>. Nếu <code>old === color</code> thì trả về ngay: không có gì thay đổi, và nếu chạy tiếp sẽ lặp mãi vì điểm đã tô trông vẫn như chưa thăm. Ngược lại chạy DFS lặp: tô một điểm lúc đẩy nó vào, đẩy các láng giềng còn màu <code>old</code>. <strong>Độ phức tạp:</strong> O(R·C) thời gian, stack O(R·C) trong trường hợp xấu nhất (ảnh một màu). <strong>Ca biên đã thử:</strong> màu mới bằng màu cũ (test thứ hai, giữ nguyên), điểm xuất phát không cùng màu với ai xung quanh (test thứ ba).</p>')}
</div>
${maHai('ch07/l1-flood-fill.ts', 'ch07/L1FloodFill.java', { vung: 'giai' })}
${ketQua('ch07/l1-flood-fill.ts')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap — "new colour equals old colour".</strong></p><p>Remove the <code>if (old === color) return image</code> line and the second test never terminates: every pixel is re-pushed forever, because the "visited" test is "still has the old colour" and repainting does not change it. This is the most common wrong submission on LC 733 — and in an image editor it is a frozen tab.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "màu mới bằng màu cũ".</strong></p><p>Bỏ dòng <code>if (old === color) return image</code> là test thứ hai không bao giờ kết thúc: mọi điểm bị đẩy lại mãi, vì phép kiểm "đã thăm" là "còn màu cũ" mà tô lại không làm đổi màu. Đây là kiểu nộp sai hay gặp nhất ở LC 733 — và trong một phần mềm vẽ, nó là một tab bị treo.</p></div>
</div>

<div class="ml-en">
<h3>2. ${D.l2}</h3>
<p><strong>Problem.</strong> A 0/1 grid; an island is a 4-connected group of 1s. Return the area (number of cells) of the largest island, or 0 if there is none.</p>
<p><strong>Recognising the pattern.</strong> Number of Islands (lesson 7.2) counted components; this one measures them. Same scan, same sinking traversal, but the traversal counts the cells it sinks.</p>
${gap('💡 Hint 1', '<p>What does the traversal started from the first cell of an island visit, exactly?</p>')}
${gap('💡 Hint 2', '<p>Increment a counter each time you pop a cell; compare with the best after each island.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Scan; at each unsunk 1, run a stack DFS that sinks cells when they are pushed and counts each popped cell; keep the maximum. <strong>Complexity:</strong> O(R·C). <strong>Edge cases tried:</strong> two islands of equal size (first test: 4 and 4), an L-shaped island joined through the middle (second test: 4, plus a lone cell of 1), no land at all (third test: 0 — make sure <code>best</code> starts at 0, not at −∞).</p>')}
</div>
<div class="ml-vi">
<h3>2. ${D.l2}</h3>
<p><strong>Đề.</strong> Một lưới 0/1; một hòn đảo là một nhóm số 1 nối nhau theo 4 hướng. Trả về diện tích (số ô) của hòn đảo lớn nhất, hoặc 0 nếu không có đảo nào.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Number of Islands (bài 7.2) đếm thành phần liên thông; đề này đo kích thước chúng. Cùng lượt quét, cùng lượt duyệt nhấn chìm, chỉ khác là lượt duyệt đếm số ô nó nhấn chìm.</p>
${gap('💡 Gợi ý 1', '<p>Lượt duyệt bắt đầu từ ô đầu tiên của một đảo thăm chính xác những ô nào?</p>')}
${gap('💡 Gợi ý 2', '<p>Tăng một biến đếm mỗi lần lấy một ô ra; so với giá trị tốt nhất sau mỗi đảo.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Quét; gặp số 1 chưa chìm thì chạy DFS bằng stack, nhấn chìm ô lúc đẩy vào và đếm mỗi ô lấy ra; giữ giá trị lớn nhất. <strong>Độ phức tạp:</strong> O(R·C). <strong>Ca biên đã thử:</strong> hai đảo bằng nhau (test đầu: 4 và 4), một đảo hình chữ L nối qua ô giữa (test hai: 4, cộng một ô lẻ diện tích 1), không có đất (test ba: 0 — nhớ cho <code>best</code> bắt đầu từ 0, không phải −∞).</p>')}
</div>
${maHai('ch07/l2-max-area.ts', 'ch07/L2MaxArea.java', { vung: 'giai' })}
${ketQua('ch07/l2-max-area.ts')}

<div class="ml-en">
<h3>3. ${D.l3}</h3>
<p><strong>Problem.</strong> A 0/1 matrix. For every cell, return its distance (4-direction steps) to the nearest 0. <code>[[0,0,0],[0,1,0],[1,1,1]]</code> → <code>[[0,0,0],[0,1,0],[1,2,1]]</code>.</p>
<p><strong>Recognising the pattern.</strong> "Distance to the nearest of many sources" for every cell = multi-source BFS (Rotting Oranges, lesson 7.2). Running a BFS from every 1 would be O((R·C)²).</p>
${gap('💡 Hint 1', '<p>Flip the question: instead of each 1 searching for a 0, let all the 0s spread outwards at the same time.</p>')}
${gap('💡 Hint 2', '<p>Put every 0 in the queue with distance 0; −1 means "not reached yet", which doubles as the visited mark.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Initialise <code>dist</code> to −1, set 0 and enqueue every 0-cell. BFS: the first time a cell is reached, its distance is final (BFS order = distance order), so set <code>dist = dist[parent] + 1</code> and enqueue. <strong>Complexity:</strong> O(R·C) time and space. <strong>Edge cases tried:</strong> a single 1 surrounded by 0s (distance 1), a row where the only 0 is at the far end (<code>[4,3,2,1,0]</code>).</p>')}
</div>
<div class="ml-vi">
<h3>3. ${D.l3}</h3>
<p><strong>Đề.</strong> Một ma trận 0/1. Với mỗi ô, trả về khoảng cách (số bước 4 hướng) tới số 0 gần nhất. <code>[[0,0,0],[0,1,0],[1,1,1]]</code> → <code>[[0,0,0],[0,1,0],[1,2,1]]</code>.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Khoảng cách tới nguồn gần nhất trong nhiều nguồn" cho mọi ô = BFS nhiều nguồn (Rotting Oranges, bài 7.2). Chạy một BFS từ mỗi ô 1 sẽ là O((R·C)²).</p>
${gap('💡 Gợi ý 1', '<p>Lật câu hỏi lại: thay vì mỗi ô 1 đi tìm số 0, hãy cho mọi số 0 cùng loang ra một lúc.</p>')}
${gap('💡 Gợi ý 2', '<p>Đưa mọi ô 0 vào hàng đợi với khoảng cách 0; −1 nghĩa là "chưa tới", đồng thời làm luôn dấu đã thăm.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Khởi tạo <code>dist</code> bằng −1, đặt 0 và đưa vào hàng mọi ô 0. BFS: lần đầu một ô được chạm tới, khoảng cách của nó là cuối cùng (thứ tự BFS = thứ tự khoảng cách), nên đặt <code>dist = dist[cha] + 1</code> và đưa vào hàng. <strong>Độ phức tạp:</strong> O(R·C) thời gian và bộ nhớ. <strong>Ca biên đã thử:</strong> một ô 1 bị bao quanh bởi các ô 0 (khoảng cách 1), một hàng mà số 0 duy nhất nằm ở tận cuối (<code>[4,3,2,1,0]</code>).</p>')}
</div>
${maHai('ch07/l3-01-matrix.ts', 'ch07/L3Matrix01.java', { vung: 'giai' })}
${ketQua('ch07/l3-01-matrix.ts')}

<div class="ml-en">
<h3>4. ${D.l4}</h3>
<p><strong>Problem.</strong> A directed graph given as an adjacency list. A node is <em>terminal</em> if it has no outgoing edge, and <em>safe</em> if every path starting from it ends at a terminal node. Return all safe nodes in increasing order. In <code>[[1,2],[2,3],[5],[0],[5],[],[]]</code>, nodes 0, 1, 3 can loop forever (0 → 1 → 3 → 0), the answer is <code>[2, 4, 5, 6]</code>.</p>
<p><strong>Recognising the pattern.</strong> "Every path ends" = "no path reaches a cycle". Two tools: three-colour DFS (a node is unsafe if its DFS ever meets a GRAY node), or Kahn on the <strong>reversed</strong> graph, starting from the terminal nodes.</p>
${gap('💡 Hint 1', '<p>Terminal nodes are safe. Which other nodes are obviously safe once you know some safe nodes?</p>')}
${gap('💡 Hint 2', '<p>A node is safe when ALL its outgoing edges lead to safe nodes — that is "out-degree reaches 0" if you delete edges into safe nodes. Walk the edges backwards.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Reverse every edge and count each node’s out-degree in the original graph. Queue the terminal nodes (out-degree 0). Pop v, mark it safe, and for every u with an edge u → v, decrement u’s remaining out-degree; when it hits 0, all of u’s exits are safe, so u is safe too. Nodes never reached lie on or lead into a cycle. Scanning 0..n−1 at the end gives the sorted order for free. <strong>Complexity:</strong> O(V + E). <strong>Edge cases tried:</strong> a self-loop <code>[[0]]</code> (not safe, empty answer), a node with an edge into a cycle (second test: only 4 is safe).</p>')}
</div>
<div class="ml-vi">
<h3>4. ${D.l4}</h3>
<p><strong>Đề.</strong> Một đồ thị có hướng cho dưới dạng danh sách kề. Một đỉnh là <em>đỉnh cuối</em> (terminal) nếu không có cạnh ra, và là <em>an toàn</em> nếu mọi đường đi bắt đầu từ nó đều kết thúc ở một đỉnh cuối. Trả về mọi đỉnh an toàn theo thứ tự tăng dần. Trong <code>[[1,2],[2,3],[5],[0],[5],[],[]]</code>, các đỉnh 0, 1, 3 có thể đi vòng mãi (0 → 1 → 3 → 0), đáp án là <code>[2, 4, 5, 6]</code>.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Mọi đường đều dừng" = "không đường nào chạm tới chu trình". Hai công cụ: DFS ba màu (một đỉnh không an toàn nếu DFS từ nó gặp đỉnh XÁM), hoặc Kahn trên đồ thị <strong>đảo chiều</strong>, bắt đầu từ các đỉnh cuối.</p>
${gap('💡 Gợi ý 1', '<p>Đỉnh cuối thì an toàn. Biết vài đỉnh an toàn rồi, đỉnh nào khác hiển nhiên cũng an toàn?</p>')}
${gap('💡 Gợi ý 2', '<p>Một đỉnh an toàn khi MỌI cạnh ra của nó dẫn tới đỉnh an toàn — tức "bậc ra về 0" nếu bạn xoá các cạnh đi vào đỉnh an toàn. Đi các cạnh theo chiều ngược.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Đảo chiều mọi cạnh và đếm bậc ra của mỗi đỉnh trong đồ thị gốc. Đưa các đỉnh cuối (bậc ra 0) vào hàng. Lấy v ra, đánh dấu an toàn, và với mọi u có cạnh u → v, giảm bậc ra còn lại của u; khi nó về 0, mọi lối ra của u đều an toàn nên u cũng an toàn. Những đỉnh không bao giờ được chạm tới thì nằm trên hoặc dẫn vào một chu trình. Quét 0..n−1 ở cuối cho luôn thứ tự tăng dần. <strong>Độ phức tạp:</strong> O(V + E). <strong>Ca biên đã thử:</strong> một khuyên <code>[[0]]</code> (không an toàn, đáp án rỗng), một đỉnh có cạnh đi vào chu trình (test hai: chỉ 4 an toàn).</p>')}
</div>
${maHai('ch07/l4-safe-states.ts', 'ch07/L4SafeStates.java', { vung: 'giai' })}
${ketQua('ch07/l4-safe-states.ts')}

<div class="ml-en">
<h3>5. ${D.l5}</h3>
<p><strong>Problem.</strong> Equations between one-letter variables, each <code>"a==b"</code> or <code>"a!=b"</code>. Can integers be assigned so that all hold? <code>["a==b","b!=a"]</code> → false; <code>["a!=c","a==b","b==c"]</code> → false (a = b = c contradicts a ≠ c).</p>
<p><strong>Recognising the pattern.</strong> Equality is transitive: "==" builds groups, "!=" asks "are these two in the same group?". Groups formed by pairs = union-find.</p>
${gap('💡 Hint 1', '<p>Why can you not process the equations in the given order? Look at the third example.</p>')}
${gap('💡 Hint 2', '<p>Two passes: first union every "==", then check every "!=".</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> A "!=" can only be judged after <em>all</em> equalities are known — in the third example "a!=c" comes first, when a and c still look unrelated. So pass 1 unions both letters of every "==" (26 letters ⇒ an array of 26); pass 2 returns false if any "!=" has both letters under the same root. <strong>Complexity:</strong> O(n·α(26)) ≈ O(n). <strong>Edge cases tried:</strong> "a!=a" (false immediately — the same root), "c==c" (harmless), unrelated letters "x!=z" (true).</p>')}
</div>
<div class="ml-vi">
<h3>5. ${D.l5}</h3>
<p><strong>Đề.</strong> Các phương trình giữa các biến một chữ cái, mỗi cái là <code>"a==b"</code> hoặc <code>"a!=b"</code>. Có gán được số nguyên để mọi phương trình đều đúng không? <code>["a==b","b!=a"]</code> → false; <code>["a!=c","a==b","b==c"]</code> → false (a = b = c mâu thuẫn với a ≠ c).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Phép bằng có tính bắc cầu: "==" dựng nhóm, "!=" hỏi "hai biến này có cùng nhóm không?". Nhóm dựng từ các cặp = union-find.</p>
${gap('💡 Gợi ý 1', '<p>Vì sao không xử lý các phương trình theo đúng thứ tự cho sẵn được? Nhìn ví dụ thứ ba.</p>')}
${gap('💡 Gợi ý 2', '<p>Hai lượt: lượt đầu hợp mọi "==", lượt sau kiểm mọi "!=".</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Một "!=" chỉ phán xử được khi đã biết <em>mọi</em> phép bằng — ở ví dụ thứ ba "a!=c" đứng đầu, lúc a và c trông vẫn không liên quan. Nên lượt 1 hợp hai chữ của mọi "==" (26 chữ ⇒ mảng 26 ô); lượt 2 trả false nếu có "!=" nào mà hai chữ cùng một gốc. <strong>Độ phức tạp:</strong> O(n·α(26)) ≈ O(n). <strong>Ca biên đã thử:</strong> "a!=a" (false ngay — cùng gốc), "c==c" (vô hại), hai chữ không liên quan "x!=z" (true).</p>')}
</div>
${maHai('ch07/l5-equations.ts', 'ch07/L5Equations.java', { vung: 'giai' })}
${ketQua('ch07/l5-equations.ts')}

<div class="ml-en">
<h3>6. ${D.l6}</h3>
<p><strong>Problem.</strong> Points on a plane; connecting two points costs their Manhattan distance <code>|x1 − x2| + |y1 − y2|</code>. Return the minimum total cost to connect all points (any two points must be joined by some path). Points <code>[[0,0],[2,2],[3,10],[5,2],[7,0]]</code> → 20.</p>
<p><strong>Recognising the pattern.</strong> "Connect everything as cheaply as possible" = a <strong>minimum spanning tree</strong> (MST): n − 1 edges, no cycle, minimum total weight. Kruskal: sort all edges by cost and take an edge whenever it joins two different groups — exactly union-find’s <code>union</code> returning true.</p>
${gap('💡 Hint 1', '<p>Every pair of points is a possible edge. How many edges is that for n points, and is sorting them affordable for n ≤ 1000?</p>')}
${gap('💡 Hint 2', '<p>Take the cheapest edge that does not close a cycle, repeatedly. Union-find tells you in O(α) whether it would.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Build all n(n − 1)/2 edges (≈ 5·10⁵ for n = 1000), sort them, run union-find; add the cost of every accepted edge and stop after n − 1 accepted edges. Why the greedy is right (the "cut property"): the cheapest edge leaving any group of points can always be part of some MST. <strong>Complexity:</strong> O(n² log n) time, O(n²) memory for the edge list. For dense graphs like this one, <em>Prim’s algorithm</em> with an array is O(n²) and needs no edge list — say it as the follow-up. <strong>Edge cases tried:</strong> a single point (cost 0, no edges), three points with negative coordinates (18).</p>')}
</div>
<div class="ml-vi">
<h3>6. ${D.l6}</h3>
<p><strong>Đề.</strong> Các điểm trên mặt phẳng; nối hai điểm tốn khoảng cách Manhattan <code>|x1 − x2| + |y1 − y2|</code>. Trả về tổng chi phí nhỏ nhất để nối mọi điểm (hai điểm bất kỳ phải có đường đi giữa chúng). Các điểm <code>[[0,0],[2,2],[3,10],[5,2],[7,0]]</code> → 20.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Nối tất cả rẻ nhất có thể" = <strong>cây khung nhỏ nhất</strong> (minimum spanning tree — MST): n − 1 cạnh, không chu trình, tổng trọng số nhỏ nhất. Kruskal: sắp mọi cạnh theo chi phí và nhận một cạnh mỗi khi nó nối hai nhóm khác nhau — chính là lúc <code>union</code> của union-find trả về true.</p>
${gap('💡 Gợi ý 1', '<p>Mọi cặp điểm đều là một cạnh có thể. Với n điểm thì có bao nhiêu cạnh, và sắp xếp chúng có kham nổi khi n ≤ 1000 không?</p>')}
${gap('💡 Gợi ý 2', '<p>Lặp lại việc lấy cạnh rẻ nhất không khép chu trình. Union-find cho biết trong O(α) liệu nó có khép không.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Dựng cả n(n − 1)/2 cạnh (≈ 5·10⁵ với n = 1000), sắp xếp, chạy union-find; cộng chi phí mọi cạnh được nhận và dừng sau n − 1 cạnh. Vì sao tham lam đúng ("tính chất lát cắt" — cut property): cạnh rẻ nhất đi ra khỏi bất kỳ nhóm điểm nào luôn có thể nằm trong một MST nào đó. <strong>Độ phức tạp:</strong> O(n² log n) thời gian, O(n²) bộ nhớ cho danh sách cạnh. Với đồ thị dày như thế này, <em>thuật toán Prim</em> dùng mảng là O(n²) và không cần danh sách cạnh — nói nó ra như câu nối tiếp. <strong>Ca biên đã thử:</strong> một điểm duy nhất (chi phí 0, không cạnh nào), ba điểm có toạ độ âm (18).</p>')}
</div>
${maHai('ch07/l6-connect-points.ts', 'ch07/L6ConnectPoints.java', { vung: 'giai' })}
${ketQua('ch07/l6-connect-points.ts')}
<div class="ml-en">
<p>Kruskal on the first test, edge by edge in increasing cost (ties broken by point index). Three edges of cost 7 are skipped because their ends are already in one group; the expensive edge 1–2 (cost 9) is still needed because point 2, far up at (3, 10), is alone.</p>
</div>
<div class="ml-vi">
<p>Kruskal trên test đầu tiên, từng cạnh theo chi phí tăng dần (bằng nhau thì xét theo chỉ số điểm). Ba cạnh chi phí 7 bị bỏ vì hai đầu đã cùng một nhóm; cạnh đắt 1–2 (chi phí 9) vẫn cần vì điểm 2 ở tít trên (3, 10) còn đứng một mình.</p>
</div>
${BANG_KRUSKAL}
<div class="ml-en">
${moPhong('ch07/kruskal.sim.js', 'en', 'Kruskal: cheapest edge first, union-find vetoes cycles', 'The five points drawn at their coordinates; accepted edges appear one by one, rejected ones are reported in the log.')}
</div>
<div class="ml-vi">
${moPhong('ch07/kruskal.sim.js', 'vi', 'Kruskal: cạnh rẻ nhất trước, union-find chặn chu trình', 'Năm điểm vẽ đúng toạ độ; các cạnh được nhận lần lượt hiện lên, cạnh bị bỏ được báo trong nhật ký.')}
</div>

<div class="ml-en">
<h3>7. ${D.l7}</h3>
<p><strong>Problem.</strong> An undirected graph whose edges have a success probability in [0, 1]. Find the path from <code>start</code> to <code>end</code> with the highest product of probabilities, or 0 if none. Edges 0–1 (0.5), 1–2 (0.5), 0–2 (0.2): going 0 → 1 → 2 gives 0.25, better than the direct 0.2.</p>
<p><strong>Recognising the pattern.</strong> "Best path" on weighted edges ⇒ Dijkstra-shaped. The twist is the combination rule (multiply) and the direction (maximise). Dijkstra still works because multiplying by a number ≤ 1 never makes a path better — the same monotonicity that made "max" work in LC 1631.</p>
${gap('💡 Hint 1', '<p>Which node can you be sure about first? (The start, with probability 1.) Which one next?</p>')}
${gap('💡 Hint 2', '<p>Use a max-heap on probability. In TypeScript, reuse the min-heap with the key negated.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> <code>best[start] = 1</code>, everything else 0. Pop the highest probability; skip it if stale (<code>p &lt; best[u]</code>); return as soon as <code>end</code> is popped; relax <code>p · w &gt; best[v]</code>. Do not take logarithms to turn it into a sum unless asked — it works (−log p is a non-negative weight) but adds floating-point noise and nothing else. <strong>Complexity:</strong> O(E log V). <strong>Edge cases tried:</strong> the direct edge better than the detour (0.3 &gt; 0.25), <code>end</code> unreachable (0). Output is printed with 5 decimals because LeetCode accepts answers within 10⁻⁵ and Java and TypeScript print doubles differently (<code>0.0</code> vs <code>0</code>).</p>')}
</div>
<div class="ml-vi">
<h3>7. ${D.l7}</h3>
<p><strong>Đề.</strong> Một đồ thị vô hướng mà mỗi cạnh có xác suất thành công trong [0, 1]. Tìm đường từ <code>start</code> tới <code>end</code> có tích xác suất lớn nhất, hoặc 0 nếu không có. Các cạnh 0–1 (0,5), 1–2 (0,5), 0–2 (0,2): đi 0 → 1 → 2 được 0,25, tốt hơn đi thẳng 0,2.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Đường tốt nhất" trên cạnh có trọng số ⇒ dáng Dijkstra. Điểm xoay là luật kết hợp (nhân) và chiều tối ưu (lớn nhất). Dijkstra vẫn đúng vì nhân với một số ≤ 1 không bao giờ làm đường tốt lên — đúng tính đơn điệu đã giúp "max" chạy được ở LC 1631.</p>
${gap('💡 Gợi ý 1', '<p>Đỉnh nào chắc chắn được trước tiên? (Điểm xuất phát, xác suất 1.) Rồi đỉnh nào kế tiếp?</p>')}
${gap('💡 Gợi ý 2', '<p>Dùng max-heap theo xác suất. Trong TypeScript, dùng lại min-heap với khoá đổi dấu.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> <code>best[start] = 1</code>, còn lại 0. Lấy ra xác suất cao nhất; bỏ qua nếu đã cũ (<code>p &lt; best[u]</code>); trả về ngay khi lấy ra <code>end</code>; nới lỏng khi <code>p · w &gt; best[v]</code>. Đừng lấy logarit để biến thành tổng trừ khi được hỏi — nó đúng (−log p là trọng số không âm) nhưng chỉ thêm nhiễu số thực mà không được gì. <strong>Độ phức tạp:</strong> O(E log V). <strong>Ca biên đã thử:</strong> cạnh thẳng tốt hơn đường vòng (0,3 &gt; 0,25), <code>end</code> không tới được (0). Output in 5 chữ số thập phân vì LeetCode chấp nhận sai số 10⁻⁵ và Java với TypeScript in số thực khác nhau (<code>0.0</code> so với <code>0</code>).</p>')}
</div>
${maHai('ch07/l7-max-probability.ts', 'ch07/L7MaxProbability.java', { vung: 'giai' })}
${ketQua('ch07/l7-max-probability.ts')}

<div class="ml-en">
<h3>8. ${D.l8}</h3>
<p><strong>Problem.</strong> An n × n grid of distinct elevations. At time t the water level is t, and you can swim between 4-adjacent cells if both have elevation ≤ t. Starting at the top-left at time 0, what is the least time at which you can reach the bottom-right? <code>[[0,2],[1,3]]</code> → 3 (the target itself has elevation 3).</p>
<p><strong>Recognising the pattern.</strong> The time a route needs is the <strong>highest elevation on it</strong>; minimise that over all routes — a <em>minimax path</em>. Three valid tools, and naming them is what makes this a strong interview answer: (1) Dijkstra with <code>max</code> instead of <code>+</code>; (2) binary search on t (lesson 4.3) + a BFS that only walks cells ≤ t; (3) union-find: add cells in increasing elevation and stop when the two corners join.</p>
${gap('💡 Hint 1', '<p>For a fixed t, can you check "is the target reachable?" quickly? What does that suggest?</p>')}
${gap('💡 Hint 2', '<p>Or grow the best-known time outward from the start like Dijkstra: the time to reach a neighbour is max(time here, its elevation).</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Dijkstra on cells with key = the time needed to reach the cell. Start with <code>grid[0][0]</code> (you may have to wait for the start cell itself). Pop the smallest time; when the target is popped, that time is optimal; relax neighbours with <code>max(t, grid[nr][nc])</code>. <strong>Complexity:</strong> O(n² log n). The binary search version is O(n² log n²) too, and simpler if Dijkstra variants make you nervous. <strong>Edge cases tried:</strong> the spiral grid where the only route winds around (16), a start cell higher than everything (third test: 3 — the answer can never be below <code>grid[0][0]</code>).</p>')}
</div>
<div class="ml-vi">
<h3>8. ${D.l8}</h3>
<p><strong>Đề.</strong> Lưới n × n các độ cao khác nhau. Ở thời điểm t mực nước là t, và bạn bơi được giữa hai ô kề 4 hướng nếu cả hai có độ cao ≤ t. Xuất phát ở góc trên-trái lúc 0, thời điểm sớm nhất tới được góc dưới-phải là bao nhiêu? <code>[[0,2],[1,3]]</code> → 3 (chính ô đích có độ cao 3).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Thời gian một lộ trình cần là <strong>độ cao lớn nhất trên lộ trình đó</strong>; hãy làm nó nhỏ nhất trên mọi lộ trình — một <em>đường minimax</em>. Có ba công cụ đều đúng, và gọi tên được cả ba là thứ làm câu trả lời phỏng vấn nổi bật: (1) Dijkstra với <code>max</code> thay cho <code>+</code>; (2) tìm nhị phân trên t (bài 4.3) + một BFS chỉ đi qua ô ≤ t; (3) union-find: thêm các ô theo độ cao tăng dần và dừng khi hai góc nối với nhau.</p>
${gap('💡 Gợi ý 1', '<p>Với một t cố định, có kiểm nhanh "tới được đích không?" được không? Điều đó gợi ý gì?</p>')}
${gap('💡 Gợi ý 2', '<p>Hoặc lan thời gian tốt nhất đã biết từ điểm xuất phát ra như Dijkstra: thời gian tới một láng giềng là max(thời gian ở đây, độ cao của nó).</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Dijkstra trên các ô với khoá = thời gian cần để tới ô đó. Bắt đầu bằng <code>grid[0][0]</code> (có thể phải chờ ngay ở ô xuất phát). Lấy thời gian nhỏ nhất ra; khi lấy ra ô đích, thời gian đó là tối ưu; nới lỏng láng giềng bằng <code>max(t, grid[nr][nc])</code>. <strong>Độ phức tạp:</strong> O(n² log n). Bản tìm nhị phân cũng O(n² log n²), và đơn giản hơn nếu các biến thể Dijkstra làm bạn lo. <strong>Ca biên đã thử:</strong> lưới xoắn ốc mà lối duy nhất phải vòng quanh (16), ô xuất phát cao hơn mọi ô khác (test ba: 3 — đáp án không bao giờ nhỏ hơn <code>grid[0][0]</code>).</p>')}
</div>
${maHai('ch07/l8-swim.ts', 'ch07/L8Swim.java', { vung: 'giai' })}
${ketQua('ch07/l8-swim.ts')}

<div class="ml-en">
<h3>🧪 Practice (a full session, ~3 hours)</h3>
<div class="callout ok"><ol>
<li>Do the eight problems in order with a timer, out loud, without hints first. Submit each on LeetCode.</li>
<li>For each, write one notebook line: <em>node = …, edge = …, tool = …, my mistake = …</em>.</li>
<li>Re-solve number 8 with a second tool (binary search + BFS or union-find) and compare the code length.</li>
<li>Two days later, redo the ones that took longer than their target time.</li>
</ol>
<p><strong>Done when:</strong> eight accepted submissions, eight notebook lines, and LC 778 solved two ways.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">terminal / safe node</span><span class="v">No outgoing edge / every path from it ends at a terminal node.</span></div>
  <div class="kv"><span class="k">reversed graph</span><span class="v">The same edges pointing the other way; turns "where can I go" into "who can reach me".</span></div>
  <div class="kv"><span class="k">minimum spanning tree (MST)</span><span class="v">n − 1 edges connecting all nodes with the smallest total weight.</span></div>
  <div class="kv"><span class="k">Kruskal / Prim</span><span class="v">MST by sorted edges + union-find / by growing one tree with a heap or array.</span></div>
  <div class="kv"><span class="k">minimax path</span><span class="v">A path whose cost is its largest edge (or cell); minimised by Dijkstra with max.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Grid problems: one traversal per component; return a value from it when you need sizes.</li>
<li>"Distance to the nearest of many" ⇒ multi-source BFS from all sources.</li>
<li>"Every path ends" ⇒ Kahn on the reversed graph from the terminal nodes.</li>
<li>Equalities and groups ⇒ union-find; check the inequalities after all unions.</li>
<li>Connect everything cheaply ⇒ MST (Kruskal = sort + union-find).</li>
<li>Dijkstra works for any combination that never improves a path when extended: sum of non-negatives, max, product of probabilities.</li>
</ul>
${nguon('📗', 'NeetCode — Graphs', 'The standard order of graph interview problems with video solutions', 'https://neetcode.io/roadmap')}
${nguon('🎞️', 'VisuAlgo — Union-Find Disjoint Sets', 'Watch union by rank and path compression on your own operations', 'https://visualgo.net/en/ufds')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (trọn một buổi, ~3 giờ)</h3>
<div class="callout ok"><ol>
<li>Làm tám đề theo thứ tự, bấm giờ, nói to, chưa mở gợi ý. Nộp từng đề trên LeetCode.</li>
<li>Mỗi đề ghi một dòng vào sổ: <em>đỉnh = …, cạnh = …, công cụ = …, lỗi của tôi = …</em>.</li>
<li>Giải lại đề số 8 bằng công cụ thứ hai (tìm nhị phân + BFS hoặc union-find) và so độ dài code.</li>
<li>Hai ngày sau, làm lại những đề vượt quá thời gian mục tiêu.</li>
</ol>
<p><strong>Đạt khi:</strong> tám lượt nộp Accepted, tám dòng trong sổ, và LC 778 giải được bằng hai cách.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">terminal / safe node (đỉnh cuối / đỉnh an toàn)</span><span class="v">Không có cạnh ra / mọi đường đi từ nó đều kết thúc ở một đỉnh cuối.</span></div>
  <div class="kv"><span class="k">reversed graph (đồ thị đảo chiều)</span><span class="v">Cùng các cạnh nhưng chỉ chiều ngược lại; biến "tôi đi được tới đâu" thành "ai tới được tôi".</span></div>
  <div class="kv"><span class="k">minimum spanning tree — MST (cây khung nhỏ nhất)</span><span class="v">n − 1 cạnh nối mọi đỉnh với tổng trọng số nhỏ nhất.</span></div>
  <div class="kv"><span class="k">Kruskal / Prim</span><span class="v">MST bằng cạnh đã sắp + union-find / bằng cách nuôi lớn một cây với heap hoặc mảng.</span></div>
  <div class="kv"><span class="k">minimax path (đường minimax)</span><span class="v">Đường có chi phí là cạnh (hoặc ô) lớn nhất của nó; tối thiểu hoá bằng Dijkstra với max.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Đề lưới: mỗi thành phần liên thông một lượt duyệt; cần kích thước thì cho lượt duyệt trả về giá trị.</li>
<li>"Khoảng cách tới nguồn gần nhất trong nhiều nguồn" ⇒ BFS nhiều nguồn từ mọi nguồn.</li>
<li>"Mọi đường đều dừng" ⇒ Kahn trên đồ thị đảo chiều, bắt đầu từ các đỉnh cuối.</li>
<li>Phép bằng và nhóm ⇒ union-find; kiểm các phép khác sau khi đã hợp xong.</li>
<li>Nối tất cả cho rẻ ⇒ MST (Kruskal = sắp xếp + union-find).</li>
<li>Dijkstra đúng với mọi luật kết hợp không bao giờ làm đường tốt lên khi kéo dài: tổng các số không âm, max, tích xác suất.</li>
</ul>
${nguon('📗', 'NeetCode — Graphs', 'Thứ tự chuẩn các đề đồ thị khi phỏng vấn, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('🎞️', 'VisuAlgo — Union-Find Disjoint Sets', 'Xem hợp theo hạng và nén đường trên chính các thao tác bạn nhập (tiếng Anh)', 'https://visualgo.net/en/ufds')}
</div>
`,
};
