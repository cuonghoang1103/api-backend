/** 8.3 — Cắt nhánh: N-Queens, Word Search, Sudoku, xếp lịch thi. Mọi mã/output đọc từ ../ma/ch08 (chạy thật). */
import { ma, maHai, ketQua, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { banCo } from './_rieng.mjs';
import { vetNQueens } from '../ma/ch08/n-queens.vet.mjs';

const N = 4;
const vq = vetNQueens(N);
const LY = { col: 'column', diag: 'diag r−c', anti: 'diag r+c', dat: '⇒ place, go down' };
const BANG_HAU = bangVet(['call', 'row r', 'board when the call starts', 'columns tried in row r', 'outcome'],
  vq.map((h, k) => [
    `#${k + 1}`,
    String(h.r),
    banCo(N, h.hau, Object.fromEntries(h.thu.map((t) => [`${h.r},${t.c}`, t.ly === 'dat' ? 't' : 'x']))),
    h.r === N ? '—' : h.thu.map((t) => `c${t.c}: ${LY[t.ly]}`).join('<br>'),
    h.ketCuc === 'loi-giai' ? '<strong>solution ✅</strong>' : h.ketCuc === 'cut' ? 'dead end ⇒ back' : 'on the solution path',
  ]));

const DE = [
  [lc(51, 'n-queens', 'N-Queens', 'Hard'), 'One queen per row; three Sets (column, r − c, r + c) reject attacked squares.', 'Mỗi hàng một hậu; ba Set (cột, r − c, r + c) loại ô bị tấn công.'],
  [lc(52, 'n-queens-ii', 'N-Queens II', 'Hard'), 'Same tree, count instead of build — a good place to try the bitmask version.', 'Cùng cây, đếm thay vì dựng — chỗ tốt để thử bản bitmask.'],
  [lc(79, 'word-search', 'Word Search', 'Medium'), 'Grid DFS, mark the cell in the board, restore it on the way back; count letters first.', 'DFS trên lưới, đánh dấu ngay trên bảng, trả lại khi quay về; đếm chữ trước.'],
  [lc(37, 'sudoku-solver', 'Sudoku Solver', 'Hard'), 'Bitmasks for rows/columns/boxes; fill the most constrained cell first.', 'Bitmask cho hàng/cột/khối; điền ô bị ràng buộc nhiều nhất trước.'],
  [lc(1219, 'path-with-maximum-gold', 'Path with Maximum Gold', 'Medium'), 'Word Search shape, but keep the best total instead of stopping.', 'Cùng hình dạng Word Search, nhưng giữ tổng tốt nhất thay vì dừng.'],
  [lc(473, 'matchsticks-to-square', 'Matchsticks to Square', 'Medium'), 'Four buckets; longest first, skip equal buckets, stop after an empty bucket fails.', 'Bốn xô; que dài trước, bỏ xô bằng nhau, dừng khi một xô rỗng thất bại.'],
  [lc(698, 'partition-to-k-equal-sum-subsets', 'Partition to K Equal Sum Subsets', 'Medium'), 'Matchsticks with k buckets: the same three prunings.', 'Matchsticks với k xô: đúng ba nhát cắt đó.'],
  [lc(980, 'unique-paths-iii', 'Unique Paths III', 'Hard'), 'Walk every empty cell exactly once: count cells left, prune when you reach the end too early.', 'Đi qua mỗi ô trống đúng một lần: đếm ô còn lại, cắt khi tới đích quá sớm.'],
  [lc(212, 'word-search-ii', 'Word Search II', 'Hard'), 'Many words at once: walk a trie while walking the grid (Chapter 5 trie).', 'Nhiều từ cùng lúc: đi trên trie trong lúc đi trên lưới (trie ở Chương 5).'],
];

export default {
  title: '8.3 — Pruning: N-Queens, Word Search, Sudoku and exam timetables|||8.3 — Cắt nhánh: N-Queens, Word Search, Sudoku và xếp lịch thi',
  slug: 'dsa-8-3-cat-nhanh',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Biết sớm là hỏng thì đừng đi tiếp: N-Queens bằng ba Set (đo số nút từ 19 triệu xuống 2.057 ở n = 8, tới n = 14), Word Search đánh dấu tại chỗ + đếm chữ trước, Sudoku bitmask + ô ít lựa chọn nhất, xếp lịch thi không trùng — và vì sao một hàm so mật khẩu trả lời sớm lại cho kẻ xấu cắt nhánh.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Pruning: N-Queens, Word Search, Sudoku and exam timetables</h2>
<p class="lead">Lessons 8.1 and 8.2 enumerated <em>every</em> answer, so the tree could not be smaller than the output. This lesson is about problems where the answers are few but the tree of possibilities is astronomically large — place 8 queens, find one word in a grid, fill a Sudoku, schedule exams. The whole game is <strong>pruning</strong>: noticing as early as possible that a partial solution can never be completed, and not walking anything below it. We will measure what that buys: for 8 queens, from 19 million nodes to 2,057.</p>

<h3>The everyday picture: solving a Sudoku with a pencil</h3>
<p>Nobody solves a newspaper Sudoku by filling all 81 cells with random digits and checking at the end. You write a 5 in a cell and immediately look along its row: there is already a 5 there, so you erase it <em>now</em>, before writing anything else. That is the difference between checking at the leaf and checking at every step. The earlier the contradiction is found, the more of the tree is never visited. Good players also pick the cell with the fewest possibilities first — a square where only one digit fits cannot be wrong — which is the second kind of pruning: <strong>choose the most constrained decision first</strong>.</p>
<p>In standard terms these are <strong>constraint satisfaction problems</strong> (CSP): variables (rows, cells, exams), domains (columns, digits, time slots) and constraints (no two queens attack, no repeated digit, no student with two exams at once). Backtracking assigns variables one by one; pruning is a <strong>feasibility check</strong> after each assignment.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Cắt nhánh: N-Queens, Word Search, Sudoku và xếp lịch thi</h2>
<p class="lead">Bài 8.1 và 8.2 liệt kê <em>mọi</em> đáp án, nên cái cây không thể nhỏ hơn output. Bài này nói về những đề mà đáp án thì ít nhưng cây khả năng thì lớn khủng khiếp — đặt 8 quân hậu, tìm một từ trong lưới chữ, điền một ô Sudoku, xếp lịch thi. Cả cuộc chơi nằm ở <strong>cắt nhánh</strong> (pruning): nhận ra càng sớm càng tốt rằng một lời giải bộ phận không bao giờ hoàn tất được, và không đi bất cứ thứ gì bên dưới nó. Ta sẽ đo xem điều đó mua được gì: với 8 quân hậu, từ 19 triệu nút xuống còn 2.057.</p>

<h3>Hình dung đời thường: giải Sudoku bằng bút chì</h3>
<p>Không ai giải ô Sudoku trên báo bằng cách điền bừa đủ 81 ô rồi mới kiểm ở cuối. Bạn viết số 5 vào một ô và lập tức nhìn dọc hàng của nó: hàng đó đã có số 5, nên bạn tẩy đi <em>ngay</em>, trước khi viết thêm gì. Đó là khác biệt giữa kiểm ở lá và kiểm ở mỗi bước. Mâu thuẫn được phát hiện càng sớm, phần cây không bao giờ phải đi càng lớn. Người giải giỏi còn chọn ô có ít khả năng nhất trước — một ô chỉ vừa đúng một chữ số thì không thể sai — đó là kiểu cắt nhánh thứ hai: <strong>ra quyết định bị ràng buộc nhiều nhất trước</strong>.</p>
<p>Gọi cho chuẩn, đây là các <strong>bài toán thoả ràng buộc</strong> (constraint satisfaction problem — CSP): biến (hàng, ô, môn thi), miền giá trị (cột, chữ số, ca thi) và ràng buộc (không hai hậu nào ăn nhau, không lặp chữ số, không sinh viên nào thi hai môn cùng lúc). Quay lui gán từng biến một; cắt nhánh là một <strong>phép kiểm khả thi</strong> (feasibility check) sau mỗi lần gán.</p>
${csd('csd201-slide-cs6-2', 'vi', 'CS.6 Quay lui: N-Queens, Sudoku, tìm từ trong lưới, cắt nhánh', '<p>Phần slide 13–23 của CS.6 đã vẽ N-Queens, Sudoku và tìm từ trong lưới bằng Java, và so sánh quay lui với quy hoạch động. Ôn nhanh một câu: kiểm ràng buộc ngay khi đặt, sai thì quay lui luôn. <strong>Ở đây đi sâu thêm:</strong> đếm thật số nút của bốn mức cắt nhánh (n = 4…14, kèm thời gian Node và Java), bảng vết N-Queens từng cột bị loại vì lý do gì, đếm chữ trước Word Search trên đúng ca làm quá giờ, Sudoku chọn ô ít lựa chọn nhất, và góc kẻ xấu: rò rỉ thời gian biến vét cạn thành cắt nhánh.</p>')}
</div>

<div class="ml-en">
<h3>Signals</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"place / fill / assign so that no two … conflict"</span><span class="v">A CSP: assign one variable per level, check the constraint against what is already placed.</span></div>
  <div class="kv"><span class="k">"does a path / word / arrangement exist?"</span><span class="v">Return <code>true</code> at the first success and stop the whole search; prune with every cheap necessary condition (letter counts, sums, remaining cells).</span></div>
  <div class="kv"><span class="k">a grid and "each cell at most once per path"</span><span class="v">DFS with a visited mark that is set on the way down and <em>cleared</em> on the way back (unlike BFS/flood fill, where visited stays).</span></div>
  <div class="kv"><span class="k">n ≤ 9 … 15, a board, a Hard label</span><span class="v">Exponential search with strong pruning is the intended solution; your job is to make each node O(1) and to cut early.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"đặt / điền / xếp sao cho không có hai … xung đột"</span><span class="v">Một CSP: mỗi tầng gán một biến, kiểm ràng buộc với những gì đã đặt.</span></div>
  <div class="kv"><span class="k">"có tồn tại đường / từ / cách sắp nào không?"</span><span class="v">Trả <code>true</code> ở lần thành công đầu tiên và dừng cả cuộc tìm; cắt nhánh bằng mọi điều kiện cần rẻ tiền (số lần mỗi chữ, tổng, số ô còn lại).</span></div>
  <div class="kv"><span class="k">một lưới và "mỗi ô dùng tối đa một lần trên một đường"</span><span class="v">DFS với dấu "đã thăm" được đặt lúc đi xuống và <em>gỡ</em> lúc quay về (khác BFS/loang màu, nơi dấu đã thăm giữ nguyên).</span></div>
  <div class="kv"><span class="k">n ≤ 9 … 15, một bàn cờ, nhãn Hard</span><span class="v">Tìm kiếm hàm mũ có cắt nhánh mạnh chính là lời giải người ra đề muốn; việc của bạn là làm mỗi nút O(1) và cắt thật sớm.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: N-Queens</h3>
<p><strong>Problem (in our words).</strong> Place n queens on an n×n chessboard so that no two attack each other — no shared row, column or diagonal. Return every such board. For n = 4 there are 2.</p>
<p><strong>Step 1 — brute force.</strong> Choose any n of the n² squares and check: C(64, 8) ≈ 4.4 billion boards for n = 8. A first observation removes most of it: two queens in one row attack, so there is <em>exactly one queen per row</em>. Now a board is "which column in each row": nⁿ choices, 16.7 million leaves for n = 8, each checked at the end. Still the "check at the leaf" mistake.</p>
<p><strong>Step 2 — check while placing.</strong> Go row by row; in row r, try each column c, and <em>before going down</em> ask: is (r, c) attacked by a queen already placed? The question must be O(1), not a scan of the board. The trick is to name each line by a number that is the same for every square on it: a column by <code>c</code>; a top-left-to-bottom-right diagonal by <code>r − c</code> (moving down-right adds 1 to both); a top-right-to-bottom-left diagonal by <code>r + c</code> (moving down-left adds 1 to r and subtracts 1 from c). Keep three Sets of the numbers already used.</p>
<p><strong>Step 3 — the four questions.</strong> Path: the queen column per row so far. Choices at level r: columns 0…n − 1 that are not attacked. Record: when r = n. Undo: remove c, r − c, r + c from the three Sets — all four pieces of state, in reverse.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: N-Queens</h3>
<p><strong>Đề (diễn đạt lại).</strong> Đặt n quân hậu lên bàn cờ n×n sao cho không hai quân nào ăn nhau — không chung hàng, cột hay đường chéo. Trả về mọi bàn cờ như vậy. Với n = 4 có 2 cách.</p>
<p><strong>Bước 1 — vét cạn.</strong> Chọn n ô bất kỳ trong n² ô rồi kiểm: C(64, 8) ≈ 4,4 tỉ bàn cờ với n = 8. Một nhận xét đầu tiên bỏ được phần lớn: hai hậu cùng hàng thì ăn nhau, nên <em>mỗi hàng đúng một hậu</em>. Giờ một bàn cờ là "mỗi hàng đặt ở cột nào": nⁿ cách, 16,7 triệu lá với n = 8, mỗi lá kiểm ở cuối. Vẫn là lỗi "kiểm ở lá".</p>
<p><strong>Bước 2 — kiểm ngay lúc đặt.</strong> Đi từng hàng; ở hàng r thử từng cột c, và <em>trước khi đi xuống</em> hỏi: ô (r, c) có bị hậu nào đã đặt tấn công không? Câu hỏi phải là O(1), không phải quét bàn cờ. Mẹo là đặt tên mỗi đường bằng một con số giống nhau cho mọi ô trên đường đó: cột thì là <code>c</code>; đường chéo từ trên-trái xuống dưới-phải là <code>r − c</code> (đi xuống-phải thì cả hai cùng cộng 1); đường chéo từ trên-phải xuống dưới-trái là <code>r + c</code> (đi xuống-trái thì r cộng 1, c trừ 1). Giữ ba Set các con số đã dùng.</p>
<p><strong>Bước 3 — bốn câu hỏi.</strong> Đường đi: cột của hậu ở mỗi hàng tới giờ. Lựa chọn ở tầng r: các cột 0…n − 1 không bị tấn công. Ghi: khi r = n. Hoàn tác: gỡ c, r − c, r + c khỏi ba Set — đủ cả bốn mảnh trạng thái, theo thứ tự ngược.</p>
</div>
${maHai('ch08/n-queens.ts', 'ch08/NQueens.java', { vung: 'queens' })}
${ketQua('ch08/n-queens.ts')}
${ketQua('ch08/NQueens.java')}
<div class="ml-en">
<p>Java detail: <code>r − c</code> ranges from −(n − 1) to n − 1, and an array index cannot be negative, so the Java version shifts it by <code>n − 1</code>; both diagonal arrays have 2n − 1 slots. Forgetting the shift is an <code>ArrayIndexOutOfBoundsException</code> on the first anti-diagonal you touch. The solution counts 1, 0, 0, 2, 10, 4, 40, 92, 352 are worth recognising: n = 2 and 3 have no solution, and 92 for the 8×8 board is the classic number.</p>
</div>
<div class="ml-vi">
<p>Chi tiết Java: <code>r − c</code> chạy từ −(n − 1) tới n − 1, mà chỉ số mảng không được âm, nên bản Java dịch nó thêm <code>n − 1</code>; cả hai mảng đường chéo có 2n − 1 ô. Quên phép dịch là ăn ngay <code>ArrayIndexOutOfBoundsException</code> ở đường chéo đầu tiên bạn đụng vào. Dãy số lời giải 1, 0, 0, 2, 10, 4, 40, 92, 352 đáng nhận ra: n = 2 và 3 không có lời giải, còn 92 cho bàn 8×8 là con số kinh điển.</p>
</div>

<div class="ml-en">
<h3>Watch it prune: n = 4 until the first solution</h3>
<p>One row per call <code>bt(r)</code>. The small board shows the queens already placed (green) when the call starts; in row r, red squares were rejected and orange squares were accepted (the call went down from there). The fourth column says why each column was rejected. Produced by running the algorithm.</p>
</div>
<div class="ml-vi">
<h3>Xem nó cắt nhánh: n = 4 tới lời giải đầu tiên</h3>
<p>Mỗi hàng là một lời gọi <code>bt(r)</code>. Bàn cờ nhỏ hiện các hậu đã đặt (xanh lá) khi lời gọi bắt đầu; ở hàng r, ô đỏ là ô bị loại, ô cam là ô được nhận (lời gọi đã đi xuống từ đó). Cột thứ tư cho biết vì sao từng cột bị loại. Sinh ra bằng cách chạy thuật toán thật.</p>
</div>
${BANG_HAU}
<div class="ml-en">
<p>Follow the first branch, queen at (0,0). Call #2 (row 1) rejects column 0 (same column) and column 1 (diagonal r − c = 0), accepts column 2. Call #3 (row 2) finds <em>all four</em> columns attacked: a dead end after two queens, so nothing below row 2 is ever generated. Back in call #2, column 3 is tried; call #4 places row 2 at column 1, and call #5 (row 3) is dead again. Call #2 has no columns left, so the whole "queen at (0,0)" subtree is finished — on 4×4, a queen in the corner has no solution. Then (0,1) leads straight down to the solution in calls #6–#9. Nine calls to reach the first solution; the complete pruned search for n = 4 visits 17 nodes (the table below), against 341 for the unpruned tree.</p>
${moPhong('ch08/n-queens.sim.js', 'en', 'N-Queens on a 5×5 board: try, prune, place, backtrack', 'The tried square is highlighted and the log names the line that attacks it. Change N to 6 or 8 and watch the dead ends.')}
</div>
<div class="ml-vi">
<p>Đi theo nhánh đầu tiên, hậu ở (0,0). Lời gọi #2 (hàng 1) loại cột 0 (cùng cột) và cột 1 (đường chéo r − c = 0), nhận cột 2. Lời gọi #3 (hàng 2) thấy <em>cả bốn</em> cột đều bị tấn công: ngõ cụt sau hai quân hậu, nên không có gì bên dưới hàng 2 từng được sinh ra. Quay về lời gọi #2, thử cột 3; lời gọi #4 đặt hàng 2 ở cột 1, và lời gọi #5 (hàng 3) lại cụt. Lời gọi #2 hết cột, nên cả cây con "hậu ở (0,0)" xong — trên bàn 4×4, hậu ở góc không có lời giải nào. Rồi (0,1) đi thẳng xuống lời giải ở các lời gọi #6–#9. Chín lời gọi để tới lời giải đầu tiên; cả cuộc tìm có cắt nhánh với n = 4 đi qua 17 nút (bảng bên dưới), so với 341 nút của cây không cắt nhánh.</p>
${moPhong('ch08/n-queens.sim.js', 'vi', 'N-Queens trên bàn 5×5: thử, cắt, đặt, quay lui', 'Ô đang thử được tô sáng và ô log nói đường nào đang tấn công nó. Đổi N thành 6 hoặc 8 rồi xem các ngõ cụt.')}
</div>

<div class="ml-en">
<h3>How many nodes does pruning save? Measured, n = 4 … 15</h3>
<p>The same answers, four levels of checking. <strong>A</strong>: one queen per row, check the whole board only at the leaf (nⁿ leaves). <strong>B</strong>: never reuse a column (permutations), check diagonals at the leaf (n! leaves). <strong>C</strong>: the three Sets, reject before going down. <strong>D</strong>: the same tree as C with the three Sets packed into three integers. Where a tree was too big to walk, its exact size is computed and marked "formula".</p>
</div>
<div class="ml-vi">
<h3>Cắt nhánh tiết kiệm bao nhiêu nút? Đo thật, n = 4 … 15</h3>
<p>Cùng đáp án, bốn mức kiểm. <strong>A</strong>: mỗi hàng một hậu, chỉ kiểm cả bàn ở lá (nⁿ lá). <strong>B</strong>: không bao giờ dùng lại cột (hoán vị), kiểm đường chéo ở lá (n! lá). <strong>C</strong>: ba Set, loại trước khi đi xuống. <strong>D</strong>: cùng cây với C nhưng ba Set được nén vào ba số nguyên. Cây nào quá lớn không đi nổi thì kích thước chính xác được tính bằng công thức và đánh dấu "formula".</p>
</div>
${ma('ch08/hau-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch08/hau-do.ts')}
${ketQua('ch08/HauDo.java')}
<div class="ml-en">
<p>Read it from left to right, which is the order of ideas:</p>
<ul>
<li><strong>A → B (one queen per column too): 19.2 million → 110 thousand nodes at n = 8</strong>, a factor of 175. One structural observation, before any clever data structure.</li>
<li><strong>B → C (check diagonals while placing): 110 thousand → 2,057</strong>, another factor of 53. At n = 12 the gap is 1.3 billion vs 856 thousand. This is what "prune early" means in numbers: most partial boards die after 2–4 queens, and their subtrees are never generated.</li>
<li><strong>C → D (same tree, cheaper node): the node count is identical</strong> (the Java run checks it), yet TypeScript goes from 2.2 s to 48 ms at n = 13, and Java from 290 ms to 29 ms. Sets hash numbers; bitmasks are one machine instruction. Pruning decides how many nodes; the data structure decides what each node costs.</li>
<li><strong>Pruning does not remove the exponential.</strong> C still grows about 5–6× per step of n. LeetCode's N-Queens limits n to 9 for exactly this reason; Java with bitmasks reaches n = 15 (171 million nodes) in about a second.</li>
</ul>
</div>
<div class="ml-vi">
<p>Đọc từ trái sang phải, đúng thứ tự của các ý tưởng:</p>
<ul>
<li><strong>A → B (mỗi cột cũng chỉ một hậu): 19,2 triệu → 110 nghìn nút ở n = 8</strong>, gấp 175 lần. Chỉ một nhận xét về cấu trúc, chưa cần cấu trúc dữ liệu khéo léo nào.</li>
<li><strong>B → C (kiểm đường chéo ngay lúc đặt): 110 nghìn → 2.057</strong>, thêm 53 lần nữa. Ở n = 12 khoảng cách là 1,3 tỉ so với 856 nghìn. "Cắt nhánh sớm" bằng con số là vậy: phần lớn bàn cờ dang dở chết sau 2–4 quân hậu, và cây con của chúng không bao giờ được sinh ra.</li>
<li><strong>C → D (cùng cây, nút rẻ hơn): số nút y hệt nhau</strong> (lần chạy Java tự kiểm điều này), vậy mà TypeScript từ 2,2 giây xuống 48 ms ở n = 13, Java từ 290 ms xuống 29 ms. Set phải băm số; bitmask chỉ là một lệnh máy. Cắt nhánh quyết định có bao nhiêu nút; cấu trúc dữ liệu quyết định mỗi nút tốn bao nhiêu.</li>
<li><strong>Cắt nhánh không xoá được hàm mũ.</strong> C vẫn tăng khoảng 5–6 lần mỗi nấc n. LeetCode giới hạn N-Queens ở n ≤ 9 chính vì vậy; Java với bitmask tới được n = 15 (171 triệu nút) trong khoảng một giây.</li>
</ul>
</div>

<div class="ml-en">
<h3>Variant 1 — Word Search: a visited mark that must be cleared</h3>
<p><strong>Problem (in our words).</strong> A grid of letters and a word; can the word be spelled by moving up/down/left/right through adjacent cells, never reusing a cell within one spelling? It is lesson 8.1's All Paths on a grid, with a constraint at every step (the next letter must match) and a goal of "exists", not "list all".</p>
<p>Two decisions matter. <strong>The visited mark lives in the board itself</strong>: overwrite the cell with <code>'#'</code> on the way down, write the letter back on the way up. No extra array, and the restore is the "unchoose" — miss it and the next starting cell sees a corrupted board. <strong>Prune before searching</strong>: if the board does not contain enough of some letter, answer false without a single DFS call; and if the last letter of the word is rarer on the board than the first, search the reversed word, so fewer cells can start a path and dead ends appear sooner.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — Word Search: dấu "đã thăm" bắt buộc phải gỡ</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một lưới chữ cái và một từ; có ghép được từ đó bằng cách đi lên/xuống/trái/phải qua các ô kề nhau, không dùng lại ô nào trong một lần ghép không? Đó là All Paths của bài 8.1 trên một lưới, có ràng buộc ở mỗi bước (chữ kế tiếp phải khớp) và mục tiêu là "có tồn tại", không phải "liệt kê hết".</p>
<p>Hai quyết định quan trọng. <strong>Dấu đã thăm nằm ngay trong bảng</strong>: ghi đè ô bằng <code>'#'</code> lúc đi xuống, ghi lại chữ cái lúc quay lên. Không cần mảng phụ, và bước trả lại chính là "bỏ chọn" — thiếu nó thì ô xuất phát kế tiếp thấy một bảng đã bị phá. <strong>Cắt nhánh trước khi tìm</strong>: nếu bảng không có đủ số lần của một chữ nào đó, trả false mà không gọi DFS lần nào; và nếu chữ cuối của từ hiếm trên bảng hơn chữ đầu, hãy tìm từ đảo ngược, để ít ô bắt đầu được hơn và ngõ cụt hiện ra sớm hơn.</p>
</div>
${maHai('ch08/word-search.ts', 'ch08/WordSearch.java', { vung: 'exist' })}
${ketQua('ch08/word-search.ts')}
<div class="ml-en">
<p>"board restored: true" after every call is the test that the unchoose is complete — worth printing in your own practice, because a missing restore only shows up when one board is searched twice. Now the shape of input that makes plain Word Search slow: a board of all <code>A</code> and a word of <code>A</code>s ending in <code>B</code>. Every path of A's looks promising until the last letter.</p>
</div>
<div class="ml-vi">
<p>"board restored: true" sau mỗi lần gọi là phép kiểm cho thấy bước bỏ chọn đã đủ — nên in ra khi bạn tự luyện, vì thiếu bước trả lại chỉ lộ ra khi cùng một bảng được tìm hai lần. Giờ là hình dạng đầu vào làm Word Search bản thường chậm: một bảng toàn <code>A</code> và một từ gồm các chữ <code>A</code> kết thúc bằng <code>B</code>. Mọi đường toàn A đều trông đầy hứa hẹn cho tới chữ cuối cùng.</p>
</div>
${ma('ch08/word-search-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch08/word-search-do.ts')}
<div class="ml-en">
<p>The plain search makes 9 million calls for a 15-letter word on a 6×6 board — and every one is wasted, because there is no <code>B</code> at all. Searching from the rare end costs 36 calls (each start fails on its first letter); counting letters costs zero calls. The count check is O(m·n + L) and can only say "impossible", never give a wrong yes — a <strong>necessary condition</strong>, the cheapest kind of pruning. The general complexity of Word Search stays O(m·n·3^L): every start, then at most 3 new directions per step (the 4th is where you came from).</p>
</div>
<div class="ml-vi">
<p>Bản thường gọi 9 triệu lần cho một từ 15 chữ trên bảng 6×6 — và lần nào cũng phí, vì trên bảng không hề có chữ <code>B</code>. Tìm từ đầu hiếm tốn 36 lần gọi (mỗi ô xuất phát hỏng ngay ở chữ đầu); đếm chữ trước tốn không lần gọi nào. Phép đếm tốn O(m·n + L) và chỉ có thể nói "không thể", không bao giờ nói "có" sai — một <strong>điều kiện cần</strong> (necessary condition), kiểu cắt nhánh rẻ nhất. Độ phức tạp tổng quát của Word Search vẫn là O(m·n·3^L): mọi ô xuất phát, rồi mỗi bước tối đa 3 hướng mới (hướng thứ 4 là nơi vừa đi tới).</p>
</div>

<div class="ml-en">
<h3>Variant 2 — Sudoku Solver: bitmasks and the most constrained cell first</h3>
<p>Fill the empty cells so that every row, column and 3×3 box contains 1–9 once. Variables = empty cells, domain = digits, constraints = three groups per cell. Two prunings stacked: (1) a digit is tried only if it is absent from the row, column and box — three bitmasks make that one OR and one AND; (2) <strong>MRV</strong> (minimum remaining values): at each level, fill the empty cell with the fewest legal digits first. A cell with one candidate costs no branching at all; a cell with zero candidates proves the current board is already dead.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — Sudoku Solver: bitmask và ô ít lựa chọn nhất trước</h3>
<p>Điền các ô trống sao cho mỗi hàng, cột và khối 3×3 chứa 1–9 đúng một lần. Biến = ô trống, miền = chữ số, ràng buộc = ba nhóm cho mỗi ô. Hai lớp cắt nhánh chồng lên nhau: (1) một chữ số chỉ được thử nếu nó vắng mặt ở hàng, cột và khối — ba bitmask biến việc đó thành một phép OR và một phép AND; (2) <strong>MRV</strong> (minimum remaining values — ít giá trị còn lại nhất): ở mỗi tầng, điền ô trống có ít chữ số hợp lệ nhất trước. Ô chỉ còn một ứng viên thì không phân nhánh gì cả; ô còn không ứng viên nào chứng minh bàn cờ hiện tại đã chết.</p>
</div>
${maHai('ch08/sudoku.ts', 'ch08/Sudoku.java', { vung: 'solve' })}
${ketQua('ch08/sudoku.ts')}
<div class="ml-en">
<p>On LeetCode's example, MRV needs 52 nodes for 51 empty cells: it almost never guesses. Taking cells in reading order needs 4,209. On a puzzle built to be hard for humans (Arto Inkala's 2012 puzzle), 49,559 nodes become 13,418 — still a big win, though here the puzzle forces real guessing. Both orders find the same, unique solution. The cost of MRV is scanning the remaining empty cells at every level (O(81) with bit counts), which is tiny next to the branches it saves.</p>
</div>
<div class="ml-vi">
<p>Với ví dụ của LeetCode, MRV cần 52 nút cho 51 ô trống: gần như không bao giờ phải đoán. Đi các ô theo thứ tự đọc cần 4.209. Với một đề được dựng để khó cho người (đề năm 2012 của Arto Inkala), 49.559 nút còn 13.418 — vẫn thắng lớn, dù ở đây đề buộc phải đoán thật. Cả hai thứ tự đều ra cùng một lời giải duy nhất. Cái giá của MRV là quét các ô trống còn lại ở mỗi tầng (O(81) với phép đếm bit), quá nhỏ so với số nhánh nó tiết kiệm.</p>
</div>

<div class="ml-en">
<h3>Real life: an exam timetable without clashes</h3>
<p>The final-exam week has six exams and three slots. Two exams that share a student cannot be in the same slot. That is <strong>graph colouring</strong>: exams are nodes, "shares a student" is an edge, slots are colours. The backtracking is N-Queens again with a different constraint: assign exams one by one, skip a slot that a neighbour already uses, undo on a dead end.</p>
</div>
<div class="ml-vi">
<h3>Đời thật: xếp lịch thi không trùng</h3>
<p>Tuần thi cuối kỳ có sáu môn và ba ca. Hai môn có chung ít nhất một sinh viên thì không được cùng ca. Đó là <strong>tô màu đồ thị</strong> (graph colouring): môn thi là đỉnh, "có chung sinh viên" là cạnh, ca thi là màu. Lời giải quay lui lại là N-Queens với một ràng buộc khác: gán từng môn một, bỏ qua ca mà một môn kề đã dùng, hoàn tác khi gặp ngõ cụt.</p>
</div>
${maHai('ch08/lich-thi.ts', 'ch08/LichThi.java', { vung: 'xep' })}
${ketQua('ch08/lich-thi.ts')}
<div class="ml-en">
<p>Two slots are impossible: SWT301, FER202 and SWR302 all share students with each other (a triangle), and a triangle needs three colours. With three slots, the replay below shows one real backtrack: LAB211 is first put in slot 2, then MAS291 — which clashes with SWT301 (slot 1), SWR302 (slot 3) and LAB211 — has nowhere to go, so LAB211 moves to slot 3 and MAS291 takes slot 2. Real university timetabling uses the same model with thousands of exams and soft constraints (no student with two exams on one day); it is solved by constraint solvers and heuristics built on exactly this search plus much stronger pruning.</p>
${moPhong('ch08/lich-thi.sim.js', 'en', 'Exam timetable as graph colouring', 'Each exam gets a slot number; watch MAS291 force LAB211 to move. Add an edge or remove a slot and run again.')}
</div>
<div class="ml-vi">
<p>Hai ca là không thể: SWT301, FER202 và SWR302 đôi một có chung sinh viên (một tam giác), mà tam giác cần ba màu. Với ba ca, phần chạy lại bên dưới cho thấy một lần quay lui thật: LAB211 được xếp vào ca 2 trước, rồi MAS291 — xung đột với SWT301 (ca 1), SWR302 (ca 3) và LAB211 — không còn chỗ, nên LAB211 dời sang ca 3 và MAS291 lấy ca 2. Phòng khảo thí thật dùng đúng mô hình này với hàng nghìn môn và các ràng buộc mềm (không sinh viên nào thi hai môn trong một ngày); họ giải bằng các bộ giải ràng buộc và heuristic xây trên đúng cuộc tìm kiếm này cộng những nhát cắt mạnh hơn nhiều. Dữ liệu xung đột trong ví dụ là giả lập theo đúng hình dạng một kỳ thật.</p>
${moPhong('ch08/lich-thi.sim.js', 'vi', 'Lịch thi = tô màu đồ thị', 'Mỗi môn nhận một số ca; xem MAS291 buộc LAB211 phải dời. Thêm một cạnh hoặc bớt một ca rồi chạy lại.')}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: a checker that answers early lets the attacker prune</h3>
<p>Lesson 8.1 said brute force is backtracking <em>without</em> pruning, because a wrong code only says "wrong". Now suppose the server compares the guess with the secret character by character and returns as soon as one differs — what <code>===</code> on strings, or a hand-written loop, naturally does. A guess with a correct first digit takes slightly longer to reject. Measured over many requests, that time difference is a signal: "your prefix is right". And a prefix signal is exactly what pruning needs. The program below models the leak as a number (how many characters were compared) and lets a backtracking attacker fix one digit at a time:</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: hàm kiểm trả lời sớm cho kẻ tấn công cắt nhánh</h3>
<p>Bài 8.1 nói vét cạn là quay lui <em>không</em> cắt nhánh, vì mã sai chỉ báo "sai". Giờ giả sử máy chủ so mã đoán với mã thật từng ký tự một và trả về ngay khi gặp ký tự khác — đúng điều <code>===</code> trên chuỗi, hoặc một vòng lặp tự viết, tự nhiên làm. Một lần đoán đúng chữ số đầu sẽ bị từ chối chậm hơn một chút. Đo qua rất nhiều request, chênh lệch thời gian đó thành một tín hiệu: "tiền tố của mày đúng rồi". Và tín hiệu về tiền tố chính là thứ cắt nhánh cần. Chương trình dưới đây mô hình hoá chỗ rò rỉ thành một con số (đã so bao nhiêu ký tự) và cho một kẻ tấn công quay lui cố định từng chữ số một:</p>
</div>
${maHai('ch08/ro-ri.ts', 'ch08/RoRi.java', { vung: 'ro-ri' })}
${ketQua('ch08/ro-ri.ts')}
<div class="ml-en">
<p>One million tries become at most 60 (10 digits × 6 positions): the tree went from 10⁶ leaves to a single path with 10 options per level. Real timing attacks are noisy and need many measurements per guess, but they have been demonstrated against real systems, and the cost of the defence is one function call. This site does it in several places: <code>verifyOtp</code> in <code>src/services/otp.service.ts</code> compares with <code>constantTimeEqual</code> (its comment says why: "to prevent timing attacks"); <code>src/routes/internal.routes.ts</code> compares the internal API key with <code>crypto.timingSafeEqual</code> and explains in its header that <code>===</code> leaks the length and the time to match each character; <code>safeEqual</code> in <code>src/utils/crypto.ts</code> wraps the same call. Rule for your own code: <strong>compare secrets (tokens, signatures, codes) in constant time</strong>, and combine it with the attempt limit of lesson 8.1 — the limit caps how many measurements an attacker gets.</p>
</div>
<div class="ml-vi">
<p>Một triệu lần thử còn tối đa 60 (10 chữ số × 6 vị trí): cái cây từ 10⁶ lá thành một đường duy nhất với 10 lựa chọn mỗi tầng. Tấn công thời gian (timing attack) ngoài đời nhiễu và cần đo nhiều lần cho mỗi lần đoán, nhưng đã được chứng minh trên hệ thống thật, còn cái giá để phòng chỉ là một lời gọi hàm. Trang này làm điều đó ở nhiều chỗ: <code>verifyOtp</code> trong <code>src/services/otp.service.ts</code> so bằng <code>constantTimeEqual</code> (chú thích ghi rõ lý do: "to prevent timing attacks"); <code>src/routes/internal.routes.ts</code> so khoá API nội bộ bằng <code>crypto.timingSafeEqual</code> và giải thích ngay đầu tệp rằng so bằng <code>===</code> để lộ độ dài và thời gian khớp từng ký tự; <code>safeEqual</code> trong <code>src/utils/crypto.ts</code> bọc đúng lời gọi đó. Quy tắc cho code của bạn: <strong>so bí mật (token, chữ ký, mã) trong thời gian hằng số</strong> (constant time), và kết hợp với giới hạn số lần thử của bài 8.1 — giới hạn đó chặn số lần đo kẻ tấn công có được.</p>
</div>

<div class="ml-en">
<h3>Traps that fail real candidates</h3>
<div class="pitfall co-tieu-de"><p><strong>Word Search: marking visited but not unmarking.</strong></p><p>With a separate <code>visited</code> array that is never cleared, a cell used by a failed path is forbidden for every later path — the search answers false for words that exist. The visited set of a backtracking DFS means "on my current path", so it is cleared on the way back. (In BFS or flood fill it means "ever reached" and stays — confusing the two is the bug.)</p></div>
<div class="pitfall co-tieu-de"><p><strong>N-Queens: undoing two Sets out of three.</strong></p><p>Every piece added in the choose step must be removed in the unchoose step. With four pieces of state (three Sets and the path) it is easy to drop one; the symptom is fewer solutions than expected, with no error anywhere. Run below: forgetting only <code>anti.delete</code> turns 92 solutions into 0. Write the undo line by copying the choose line and changing each verb.</p></div>
</div>
<div class="ml-vi">
<h3>Những cái bẫy làm trượt ứng viên thật</h3>
<div class="pitfall co-tieu-de"><p><strong>Word Search: đánh dấu đã thăm mà không gỡ.</strong></p><p>Với một mảng <code>visited</code> riêng không bao giờ được xoá, một ô đã bị một đường thất bại dùng qua sẽ bị cấm với mọi đường sau đó — cuộc tìm trả false cho những từ có thật. Tập đã thăm của DFS quay lui nghĩa là "đang nằm trên đường đi của tôi", nên phải gỡ khi quay về. (Trong BFS hay loang màu nó nghĩa là "đã từng tới" và giữ nguyên — nhầm hai nghĩa đó chính là lỗi.)</p></div>
<div class="pitfall co-tieu-de"><p><strong>N-Queens: hoàn tác hai Set trong ba.</strong></p><p>Mọi mảnh thêm vào ở bước chọn phải được gỡ ở bước bỏ chọn. Với bốn mảnh trạng thái (ba Set và đường đi), rất dễ sót một; triệu chứng là ít lời giải hơn mong đợi, không có lỗi nào được báo. Chạy thật bên dưới: chỉ quên <code>anti.delete</code> là 92 lời giải thành 0. Hãy viết dòng hoàn tác bằng cách chép dòng chọn rồi đổi từng động từ.</p></div>
</div>
${ma('ch08/bay-hau.ts', { vung: 'sai', nhan: 'TypeScript — wrong' })}
${ketQua('ch08/bay-hau.ts')}

<div class="ml-en">
<h3>🎤 Saying it out loud: N-Queens</h3>
${hoiThoai([
  ['I', 'Place n queens on an n by n board so that none attack each other. Return all boards.'],
  ['C', 'Attack means same row, column or either diagonal? And n is small — up to 9?'],
  ['N', 'Confirm the rules and the limit; n ≤ 9 tells you exponential search is intended.'],
  ['I', 'Yes, and n is at most 9.'],
  ['C', 'Two queens in a row attack, so there is exactly one queen per row. I will backtrack row by row: at row r, try each column, and only go down if the square is not attacked. To make that O(1), I keep three sets: used columns, used values of r minus c, which is constant along one diagonal, and r plus c for the other diagonal. When the row index reaches n, I build the board.'],
  ['N', 'The structural observation, then the O(1) check with the reason r − c and r + c work.'],
  ['I', 'What is the complexity?'],
  ['C', 'The tree is bounded by n! because columns are never reused, so O(n!) in the worst case, times n to build each board; in practice the diagonal check prunes most branches after a few rows. Space is O(n) for the sets and recursion.'],
  ['C', '(after coding) For n = 4 I get the two boards, .Q.. ...Q Q... ..Q. and its mirror. n = 1 gives one board, n = 2 and 3 give none.'],
  ['I', 'Could it be faster?'],
  ['C', 'The same tree with three bitmasks instead of sets: the free squares of a row are one expression, and I take the lowest set bit each time. Same number of nodes, much cheaper per node — I measured about ten times faster in Java.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: N-Queens</h3>
${hoiThoai([
  ['I', 'Đặt n quân hậu trên bàn n nhân n sao cho không quân nào ăn quân nào. Trả về mọi bàn cờ.'],
  ['C', 'Ăn nhau nghĩa là cùng hàng, cột hoặc một trong hai đường chéo ạ? Và n nhỏ — tối đa 9? <em>("Attack means same row, column or either diagonal?")</em>'],
  ['N', 'Xác nhận luật và giới hạn; n ≤ 9 nói với bạn rằng tìm kiếm hàm mũ là điều người ra đề muốn.'],
  ['I', 'Đúng, n tối đa 9.'],
  ['C', 'Hai hậu cùng hàng thì ăn nhau, nên mỗi hàng đúng một hậu. Em quay lui theo từng hàng: ở hàng r thử từng cột, chỉ đi xuống khi ô đó không bị tấn công. Để kiểm trong O(1), em giữ ba set: cột đã dùng, giá trị r trừ c đã dùng — hằng số dọc một đường chéo — và r cộng c cho đường chéo kia. Khi chỉ số hàng tới n thì em dựng bàn cờ. <em>("r minus c is constant along one diagonal, r plus c along the other.")</em>'],
  ['N', 'Nhận xét cấu trúc trước, rồi phép kiểm O(1) kèm lý do r − c và r + c dùng được.'],
  ['I', 'Độ phức tạp?'],
  ['C', 'Cây bị chặn bởi n! vì cột không bao giờ dùng lại, nên xấu nhất O(n!), nhân n để dựng mỗi bàn cờ; thực tế phép kiểm đường chéo cắt phần lớn nhánh sau vài hàng. Bộ nhớ O(n) cho các set và đệ quy.'],
  ['C', '(code xong) Với n = 4 em được hai bàn cờ, .Q.. ...Q Q... ..Q. và bản đối xứng của nó. n = 1 cho một bàn, n = 2 và 3 không có.'],
  ['I', 'Có nhanh hơn được không?'],
  ['C', 'Cùng cái cây đó nhưng dùng ba bitmask thay cho set: các ô trống của một hàng là một biểu thức, và mỗi lần em lấy bit thấp nhất. Số nút y hệt, mỗi nút rẻ hơn nhiều — em đo được nhanh khoảng mười lần trên Java. <em>("Same number of nodes, much cheaper per node.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Checking constraints only at the leaf ⇒ correct, but the tree is the unpruned one (A or B in the table).</li>
<li>An O(n) scan of the board per check instead of O(1) Sets or bitmasks.</li>
<li>Java: a negative index for <code>r − c</code>; shift by <code>n − 1</code>.</li>
<li>Visited never cleared in a backtracking DFS (or cleared in a BFS, where it must stay).</li>
<li>Continuing the search after the first success when the question was "does it exist?" — return <code>true</code> all the way up.</li>
<li>Claiming pruning changes the worst-case complexity; it changes the measured node count, not the bound.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Chỉ kiểm ràng buộc ở lá ⇒ đúng, nhưng cây là cây không cắt nhánh (A hoặc B trong bảng).</li>
<li>Mỗi lần kiểm quét bàn cờ O(n) thay vì Set hoặc bitmask O(1).</li>
<li>Java: chỉ số âm cho <code>r − c</code>; phải dịch thêm <code>n − 1</code>.</li>
<li>Dấu đã thăm không bao giờ được gỡ trong DFS quay lui (hoặc bị gỡ trong BFS, nơi nó phải giữ nguyên).</li>
<li>Tiếp tục tìm sau lần thành công đầu tiên khi câu hỏi chỉ là "có tồn tại không?" — hãy trả <code>true</code> ngược lên tận gốc.</li>
<li>Nói rằng cắt nhánh đổi độ phức tạp xấu nhất; nó đổi số nút đo được, không đổi cận trên.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>LC 1219 và LC 473 có lời giải từng bước ở bài 8.4. LC 212 dùng trie — xem lại Chương 5 trước khi làm.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write N-Queens with three Sets from memory; print the solution counts for n = 1…8 and compare with 1, 0, 0, 2, 10, 4, 40, 92.</li>
<li>Add a node counter. Then move the attack check to the leaf (check the full board only when r = n) and compare the counter for n = 8 with the table (2,057 vs about 110,000 if you keep "one per column").</li>
<li>In Word Search, remove the line that restores the cell and find a board + word where the answer becomes wrong.</li>
<li>Submit LC 51, LC 79 and LC 37.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, your own node counts for n = 8 with and without the early check, and one sentence explaining why <code>r − c</code> identifies a diagonal.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pruning</span><span class="v">Not exploring a subtree that provably contains no answer.</span></div>
  <div class="kv"><span class="k">constraint satisfaction problem (CSP)</span><span class="v">Variables, domains and constraints; solved by assign-check-undo.</span></div>
  <div class="kv"><span class="k">feasibility check</span><span class="v">The O(1) test after each assignment: can this partial solution still be completed?</span></div>
  <div class="kv"><span class="k">necessary condition</span><span class="v">A cheap test that can only answer "impossible" (letter counts in Word Search).</span></div>
  <div class="kv"><span class="k">MRV (minimum remaining values)</span><span class="v">Fill the variable with the fewest legal values first.</span></div>
  <div class="kv"><span class="k">graph colouring</span><span class="v">Give each node a colour so that neighbours differ: exam slots, register allocation.</span></div>
  <div class="kv"><span class="k">timing attack / constant-time comparison</span><span class="v">Learning a secret from how long a check takes / comparing so that time does not depend on the data.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Check while placing, not at the leaf; the earlier a dead end is found, the bigger the subtree saved.</li>
<li>N-Queens: one queen per row, three Sets (column, r − c, r + c); measured 19 million → 2,057 nodes at n = 8.</li>
<li>Pruning sets the node count; the data structure sets the cost per node (Sets vs bitmasks, 10–45× measured).</li>
<li>Word Search: mark in place and restore; count letters and start from the rarer end before searching.</li>
<li>Sudoku: bitmasks + most constrained cell first (52 nodes instead of 4,209 on LeetCode's example).</li>
<li>Any early answer from a secret check is a pruning signal for an attacker: compare secrets in constant time, limit attempts.</li>
</ul>
${nguon('📘', 'Eight queens puzzle — Wikipedia', 'History, the 92 solutions, the counts for every n and the classic algorithms', 'https://en.wikipedia.org/wiki/Eight_queens_puzzle')}
${nguon('🧩', 'Peter Norvig — Solving Every Sudoku Puzzle', 'Constraint propagation plus search: the fewest-candidates-first idea taken further', 'https://norvig.com/sudoku.html')}
${nguon('📙', 'Node.js crypto — timingSafeEqual', 'The official API for comparing secrets in constant time', 'https://nodejs.org/api/crypto.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết N-Queens bằng ba Set không nhìn bài; in số lời giải với n = 1…8 và so với 1, 0, 0, 2, 10, 4, 40, 92.</li>
<li>Thêm bộ đếm nút. Rồi dời phép kiểm tấn công xuống lá (chỉ kiểm cả bàn khi r = n) và so bộ đếm ở n = 8 với bảng (2.057 so với khoảng 110.000 nếu bạn giữ "mỗi cột một hậu").</li>
<li>Trong Word Search, xoá dòng trả lại ô và tìm một bảng + một từ làm đáp án sai.</li>
<li>Nộp LC 51, LC 79 và LC 37.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, có số nút tự đo ở n = 8 khi có và không có phép kiểm sớm, và một câu giải thích vì sao <code>r − c</code> định danh được một đường chéo.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pruning (cắt nhánh)</span><span class="v">Không đi vào một cây con mà chắc chắn không chứa đáp án nào.</span></div>
  <div class="kv"><span class="k">constraint satisfaction problem — CSP (bài toán thoả ràng buộc)</span><span class="v">Biến, miền giá trị và ràng buộc; giải bằng gán – kiểm – hoàn tác.</span></div>
  <div class="kv"><span class="k">feasibility check (phép kiểm khả thi)</span><span class="v">Phép thử O(1) sau mỗi lần gán: lời giải dang dở này còn hoàn tất được không?</span></div>
  <div class="kv"><span class="k">necessary condition (điều kiện cần)</span><span class="v">Phép thử rẻ chỉ có thể trả lời "không thể" (đếm chữ trong Word Search).</span></div>
  <div class="kv"><span class="k">MRV — minimum remaining values (ít giá trị còn lại nhất)</span><span class="v">Điền biến có ít giá trị hợp lệ nhất trước.</span></div>
  <div class="kv"><span class="k">graph colouring (tô màu đồ thị)</span><span class="v">Gán màu cho mỗi đỉnh sao cho hai đỉnh kề khác màu: ca thi, cấp phát thanh ghi.</span></div>
  <div class="kv"><span class="k">timing attack / constant-time comparison (tấn công thời gian / so sánh thời gian hằng số)</span><span class="v">Đoán bí mật từ việc một phép kiểm mất bao lâu / so sao cho thời gian không phụ thuộc dữ liệu.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểm ngay lúc đặt, không đợi tới lá; ngõ cụt phát hiện càng sớm, cây con tiết kiệm càng lớn.</li>
<li>N-Queens: mỗi hàng một hậu, ba Set (cột, r − c, r + c); đo thật 19 triệu → 2.057 nút ở n = 8.</li>
<li>Cắt nhánh quyết định số nút; cấu trúc dữ liệu quyết định giá mỗi nút (Set so với bitmask, đo được 10–45 lần).</li>
<li>Word Search: đánh dấu tại chỗ rồi trả lại; đếm chữ và tìm từ đầu hiếm trước khi tìm.</li>
<li>Sudoku: bitmask + ô bị ràng buộc nhiều nhất trước (52 nút thay vì 4.209 với ví dụ LeetCode).</li>
<li>Bất kỳ câu trả lời sớm nào từ phép kiểm bí mật đều là tín hiệu cắt nhánh cho kẻ tấn công: so bí mật trong thời gian hằng số, giới hạn số lần thử.</li>
</ul>
${lienKet({ bai: 'dsa-8-4-luyen', title: '8.4 — Bộ luyện 8: tám đề quay lui', sub: 'Từ XOR mọi tập con tới Expression Add Operators (Hard), mỗi đề gợi ý hai tầng và lời giải chạy thật', cta: 'Luyện ngay' })}
${nguon('📘', 'Eight queens puzzle — Wikipedia', 'Lịch sử, 92 lời giải, số lời giải với mọi n và các thuật toán kinh điển (tiếng Anh)', 'https://en.wikipedia.org/wiki/Eight_queens_puzzle')}
${nguon('🧩', 'Peter Norvig — Solving Every Sudoku Puzzle', 'Lan truyền ràng buộc cộng tìm kiếm: ý tưởng "ít ứng viên nhất trước" đi xa hơn', 'https://norvig.com/sudoku.html')}
${nguon('📙', 'Node.js crypto — timingSafeEqual', 'API chính thức để so bí mật trong thời gian hằng số', 'https://nodejs.org/api/crypto.html')}
<p>Câu hỏi ôn: <a href="${baiNay('dsa-8-5-quiz')}">bài 8.5 — Quiz Chương 8</a>.</p>
</div>
`,
};
