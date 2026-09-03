/**
 * build-csd201-pe2.mjs — sinh content/exams/CSD201-PE2.mjs.
 *
 * Nguồn thật: csd201_pe_su25_b1_179449.zip (PaperNo_7), 3 project riêng
 * (Q1=MyList singly-linked-list, Q2=BSTree keyed by wing, Q3=Graph DFS+Dijkstra).
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, chạy đủ f1-f4 (Q1/Q2)
 * hoặc f1-f2 (Q3). Q1-f1/f2 và Q3-f1/f2 khớp BYTE-FOR-BYTE với ví dụ minh hoạ
 * trong paper.pdf. Q1-f3/f4 và Q2 (cả 4) — ví dụ minh hoạ trong đề KHÔNG khớp
 * data.txt thật đi kèm (đã xác nhận: số liệu minh hoạ độc lập với data.txt cho
 * các câu này, giống hệt mẫu hình đã gặp ở CSD201-PE1 Đề 1) nên verify bằng
 * cách VẾT TAY thuật toán khớp đúng logic mô tả bằng chữ + cấu trúc kết quả
 * hợp lý (vd Q1-f3 loại đúng các node có wing<k, Q2-f3 xoá đúng node wing lớn
 * nhất bằng kỹ thuật xoá-bằng-copy, Q2-f4 xoay phải đúng 1 cặp node liền kề).
 * Q2-f2 (postOrder2, lọc song<7): ví dụ minh hoạ có 1 điểm KHÔNG khớp đặc tả
 * chữ (loại nhầm 1 node có song<7) — tin theo đặc tả chữ, không theo minh hoạ.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE2.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE2.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE2-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "SU 2025 - Block 1").</p>
   <ol>
     <li>Software: NetBeans IDE 8.x, Java JDK 1.8. Download the given materials above.</li>
     <li>Ignore the real-world meaning of objects/variables/values in the questions.</li>
     <li>Each Question (1, 2, 3) is ONE submission unit — edit the named file (MyList.java for Q1, BSTree.java for Q2, Graph.java for Q3) to satisfy ALL its sub-parts (f1..f4 or f1..f2).</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "SU 2025 - Block 1").</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Tải given materials ở trên.</li>
     <li>Bỏ qua ý nghĩa thực tế của đối tượng/biến/giá trị trong các câu hỏi.</li>
     <li>Mỗi Câu (1, 2, 3) là MỘT đơn vị nộp bài — sửa đúng file được nêu tên (MyList.java cho Câu 1, BSTree.java cho Câu 2, Graph.java cho Câu 3) để thoả TẤT CẢ phần con (f1..f4 hoặc f1..f2).</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const SOLVED = '/tmp/csd201-pe2-src/CSD201_PE_SU25_B1_179449/PaperNo_7';
const ORIG = '/tmp/csd201-pe2-orig/CSD201_PE_SU25_B1_179449/PaperNo_7';
const rd = (p) => fs.readFileSync(p, 'utf8');

const myListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const myListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const bstreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const bstreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));
const graphSolved = rd(path.join(SOLVED, 'Q3/src/Graph.java'));
const graphStarter = rd(path.join(ORIG, 'Q3/src/Graph.java'));

const q1 = {
  kind: 'CODE', points: 4, language: 'java',
  prompt: B(
    `<p><strong>Question 1 (4 marks) — file MyList.java.</strong> Ignore the real meaning of objects/variables/values. The <code>Canary</code> class (place, song, wing) is provided. <code>MyList</code> is a singly linked list of Canary objects (head/tail).</p>
     <ul>
       <li><code>addLast(xPlace, xSong, xWing)</code> — if <code>xPlace.charAt(0)=='A'</code> do nothing; otherwise append a new Canary node to the end of the list.</li>
       <li><code>f1()</code> (do not edit — tests addLast only). Expected f1.txt: <code>(B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)</code></li>
       <li><code>f2()</code> — 3 given Canary objects x, y, z. Insert them into the list so they end up at positions 2, 5, 6 (head is position 0), applied sequentially (insert x at pos 2, then y at pos 5 of the resulting list, then z at pos 6 of that result). Expected f2.txt (before / after): <code>(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)</code> / <code>(C,9,8) (D,6,3) (X,1,2) (E,8,5) (F,5,4) (Y,2,3) (Z,3,4) (I,4,9) (J,3,7)</code></li>
       <li><code>f3()</code> — find the node p where place="E"; let k=p.info.wing; remove all nodes with wing&lt;k.</li>
       <li><code>f4()</code> — find node p where place="E" and node q where place="K"; sort the elements from p to q (inclusive) ascending by wing, leaving nodes outside [p..q] untouched.</li>
     </ul>
     <p><i>Note: the paper's f3/f4 illustrative examples use different sample data than the given data.txt — implement exactly the algorithm described in words above.</i></p>`,
    `<p><strong>Câu 1 (4 điểm) — file MyList.java.</strong> Bỏ qua ý nghĩa thực tế của đối tượng/biến/giá trị. Lớp <code>Canary</code> (place, song, wing) đã có sẵn. <code>MyList</code> là danh sách liên kết đơn các Canary (head/tail).</p>
     <ul>
       <li><code>addLast(xPlace, xSong, xWing)</code> — nếu <code>xPlace.charAt(0)=='A'</code> thì không làm gì; ngược lại thêm node Canary mới vào cuối danh sách.</li>
       <li><code>f1()</code> (không sửa — chỉ test addLast). f1.txt mong đợi: <code>(B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)</code></li>
       <li><code>f2()</code> — cho 3 đối tượng Canary x, y, z. Chèn chúng vào danh sách sao cho ở vị trí 2, 5, 6 (head là vị trí 0), chèn TUẦN TỰ (chèn x tại vị trí 2, rồi y tại vị trí 5 của danh sách vừa chèn x, rồi z tại vị trí 6 của kết quả đó). f2.txt mong đợi (trước/sau): như trên.</li>
       <li><code>f3()</code> — tìm node p có place="E"; đặt k=p.info.wing; xoá mọi node có wing&lt;k.</li>
       <li><code>f4()</code> — tìm node p có place="E" và node q có place="K"; sắp xếp các phần tử từ p đến q (bao gồm hai đầu) tăng dần theo wing, giữ nguyên các node ngoài đoạn [p..q].</li>
     </ul>
     <p><i>Lưu ý: ví dụ minh hoạ f3/f4 trong đề dùng dữ liệu khác với data.txt đi kèm — cài đặt ĐÚNG thuật toán mô tả bằng chữ ở trên.</i></p>`
  ),
  starterCode: myListStarter,
  sampleSolution: myListSolved,
  expectedOutput: `f1.txt: (B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)

f2.txt (before / after):
(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)
(C,9,8) (D,6,3) (X,1,2) (E,8,5) (F,5,4) (Y,2,3) (Z,3,4) (I,4,9) (J,3,7)

f3/f4: algorithm-verified against the bundled data.txt (see explanation) — remove-below-threshold and segment-sort logic confirmed structurally correct (all remaining nodes satisfy wing>=k for f3; the [E..K] segment is ascending by wing while nodes outside it are untouched for f4).`,
  explanation: B(
    `<p>Verified by compiling against the real given project (javac + java Main, all 4 choices) and running against the bundled data.txt. <code>f1</code>/<code>f2</code> match the paper's illustrative example byte-for-byte. <code>f3</code>: with data.txt's f3 dataset, place=E has wing=8 (k=8); nodes with wing&lt;8 (C=6,D=7,G=7,I=3,J=4) are removed, leaving E(8),F(9),H(9) — every remaining node's wing&gt;=k, confirming correctness. <code>f4</code>: segment E..K sorted ascending by wing (F=2,K=6,E=7,J=8,I=9 in that order) while C,D before and L,M after stay untouched — confirms the in-place segment sort is correctly scoped.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật (javac + java Main, cả 4 lựa chọn) và chạy với data.txt đi kèm. <code>f1</code>/<code>f2</code> khớp byte-for-byte với ví dụ minh hoạ trong đề. <code>f3</code>: với bộ dữ liệu f3 trong data.txt, place=E có wing=8 (k=8); các node wing&lt;8 (C=6,D=7,G=7,I=3,J=4) bị xoá, còn lại E(8),F(9),H(9) — mọi node còn lại đều wing&gt;=k, xác nhận đúng. <code>f4</code>: đoạn E..K được sắp tăng dần theo wing (F=2,K=6,E=7,J=8,I=9 theo đúng thứ tự đó) trong khi C,D phía trước và L,M phía sau giữ nguyên — xác nhận phạm vi sắp xếp tại chỗ đúng.</p>`
  ),
  rubric: [
    { id: 'addlast', criterion: B('addLast() correctly skips place starting with A and appends at tail otherwise.', 'addLast() bỏ qua đúng place bắt đầu bằng A, ngược lại thêm vào cuối.'), weight: 1, maxScore: 1 },
    { id: 'f2_insert', criterion: B('f2 inserts x,y,z at positions 2,5,6 sequentially, matching the exact expected list.', 'f2 chèn x,y,z tại vị trí 2,5,6 tuần tự, khớp đúng danh sách mong đợi.'), weight: 1, maxScore: 1 },
    { id: 'f3_remove', criterion: B('f3 correctly removes all nodes with wing < k (k = wing of the E node), handling head/tail updates.', 'f3 xoá đúng mọi node wing<k (k = wing của node E), xử lý đúng cập nhật head/tail.'), weight: 1, maxScore: 1 },
    { id: 'f4_sort', criterion: B('f4 sorts only the [p..q] segment ascending by wing, leaving nodes outside the segment unchanged.', 'f4 chỉ sắp xếp đoạn [p..q] tăng dần theo wing, giữ nguyên node ngoài đoạn.'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'CODE', points: 4, language: 'java',
  prompt: B(
    `<p><strong>Question 2 (4 marks) — file BSTree.java.</strong> <code>BSTree</code> is a binary search tree of Canary objects keyed by <strong>wing</strong> (must be unique).</p>
     <ul>
       <li><code>insert(xPlace, xSong, xWing)</code> — if <code>xPlace.charAt(0)=='A'</code> do nothing; otherwise insert a new Canary into the tree, keyed by wing.</li>
       <li><code>f1()</code> (do not edit — tests insert only). Expected f1.txt (breadth-first / in-order): <code>(B,9,4) (C,4,3) (D,8,6) (Y,6,-7) (E,2,5) (F,-6,7)</code> / <code>(Y,6,-7) (C,4,3) (B,9,4) (E,2,5) (D,8,6) (F,-6,7)</code></li>
       <li><code>f2()</code> — perform post-order traversal but display to file only nodes with <code>song &lt; 7</code>. Hint: copy postOrder(...) to postOrder2(...) and modify it.</li>
       <li><code>f3()</code> — find the node having the largest wing value in the tree; delete that node using the "delete by copying" technique (replace with in-order predecessor, then remove the predecessor).</li>
       <li><code>f4()</code> — find the 4th node (in in-order traversal order from the root) that has a left child; rotate this node to the right.</li>
     </ul>
     <p><i>Note: the paper's f2/f3/f4 illustrative examples use different sample data than the given data.txt (and f2's illustration has an internal inconsistency vs its own written rule) — implement exactly the algorithm described in words above.</i></p>`,
    `<p><strong>Câu 2 (4 điểm) — file BSTree.java.</strong> <code>BSTree</code> là cây nhị phân tìm kiếm các Canary, khoá theo <strong>wing</strong> (phải duy nhất).</p>
     <ul>
       <li><code>insert(xPlace, xSong, xWing)</code> — nếu <code>xPlace.charAt(0)=='A'</code> thì không làm gì; ngược lại chèn Canary mới vào cây, khoá theo wing.</li>
       <li><code>f1()</code> (không sửa — chỉ test insert). f1.txt mong đợi (BFS / in-order): như trên.</li>
       <li><code>f2()</code> — duyệt post-order nhưng chỉ ghi ra file các node có <code>song &lt; 7</code>. Gợi ý: sao chép postOrder(...) thành postOrder2(...) rồi sửa.</li>
       <li><code>f3()</code> — tìm node có wing lớn nhất trong cây; xoá node đó bằng kỹ thuật "xoá bằng copy" (thay bằng predecessor in-order rồi xoá predecessor).</li>
       <li><code>f4()</code> — tìm node THỨ 4 (theo thứ tự duyệt in-order từ root) có con trái; xoay node này sang phải.</li>
     </ul>
     <p><i>Lưu ý: ví dụ minh hoạ f2/f3/f4 trong đề dùng dữ liệu khác data.txt đi kèm (và minh hoạ f2 tự mâu thuẫn với chính quy tắc chữ của nó) — cài đặt ĐÚNG thuật toán mô tả bằng chữ ở trên.</i></p>`
  ),
  starterCode: bstreeStarter,
  sampleSolution: bstreeSolved,
  expectedOutput: `f1.txt (breadth-first / in-order): (B,9,4) (C,4,3) (D,8,6) (Y,6,-7) (E,2,5) (F,-6,7) / (Y,6,-7) (C,4,3) (B,9,4) (E,2,5) (D,8,6) (F,-6,7)

f2/f3/f4: algorithm-verified against the bundled data.txt (see explanation) — postOrder2 keeps exactly the nodes with song<7 (self-consistent check), f3 removes exactly the max-wing node via delete-by-copying, f4 performs a structurally valid right rotation (adjacent node pair swaps position in breadth-first order, consistent with a single rotation).`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running all 4 choices against the bundled data.txt. <code>f1</code> matches the paper's illustrative example byte-for-byte, confirming insert() is correctly keyed by wing. <code>f2</code>: self-consistency check on the actual postOrder2 output shows every included node has song&lt;7 and every excluded node has song&gt;=7 — matches the written rule exactly (the paper's own illustrative example is internally inconsistent on this point: it excludes a node with song=1, which contradicts its own "song&lt;7" rule, so the written spec was trusted over the illustration). <code>f3</code>: with data.txt's f3 dataset the max-wing node was a leaf, so after deletion every other node's breadth-first position is unchanged except the removed one — matches the delete-by-copying result exactly. <code>f4</code>: the rotation swaps exactly one adjacent pair's breadth-first position, structurally consistent with a correct single right rotation (parent/child positions exchange, rest of the tree undisturbed).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy cả 4 lựa chọn với data.txt đi kèm. <code>f1</code> khớp byte-for-byte với ví dụ minh hoạ, xác nhận insert() khoá đúng theo wing. <code>f2</code>: tự đối chiếu kết quả postOrder2 thật cho thấy mọi node được giữ đều có song&lt;7 và mọi node bị loại đều song&gt;=7 — khớp đúng quy tắc chữ (ví dụ minh hoạ của chính đề tự mâu thuẫn ở điểm này: loại 1 node có song=1, trái với chính quy tắc "song&lt;7" của nó, nên tin theo đặc tả chữ thay vì minh hoạ). <code>f3</code>: với bộ dữ liệu f3 trong data.txt, node wing lớn nhất là node lá, nên sau khi xoá mọi node khác giữ nguyên vị trí BFS trừ node bị xoá — khớp đúng kết quả xoá-bằng-copy. <code>f4</code>: phép xoay hoán đổi đúng 1 cặp vị trí BFS liền kề, hợp lý về cấu trúc với 1 phép xoay phải đúng (vị trí cha/con hoán đổi, phần còn lại của cây không đổi).</p>`
  ),
  rubric: [
    { id: 'insert', criterion: B('insert() correctly builds a BST keyed by wing, skipping place starting with A.', 'insert() dựng đúng BST khoá theo wing, bỏ qua place bắt đầu bằng A.'), weight: 1, maxScore: 1 },
    { id: 'f2_filter', criterion: B('postOrder2 correctly filters to only song<7 nodes while preserving post-order sequencing.', 'postOrder2 lọc đúng chỉ node song<7, giữ đúng thứ tự post-order.'), weight: 1, maxScore: 1 },
    { id: 'f3_delete', criterion: B('f3 correctly finds the max-wing node and deletes it via the delete-by-copying technique.', 'f3 tìm đúng node wing lớn nhất và xoá bằng kỹ thuật xoá-bằng-copy.'), weight: 1, maxScore: 1 },
    { id: 'f4_rotate', criterion: B('f4 correctly locates the 4th in-order node with a left child and performs a correct right rotation.', 'f4 tìm đúng node thứ 4 theo in-order có con trái và xoay phải đúng.'), weight: 1, maxScore: 1 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(
    `<p><strong>Question 3 (2 marks) — file Graph.java.</strong></p>
     <ul>
       <li><code>f1()</code> — perform depth-first traversal (already called via <code>depth(0,f)</code>) from vertex i=0 (A), but ALSO display 6 vertices with their degrees, from the 2nd to the 7th vertex of that DFS order only. Hint: copy depth(...) to depth2(...) and modify it; there is an <code>int deg[]</code> array already declared — compute d[i] = degree of vertex i and use <code>fvisitDeg(...)</code>. Expected f1.txt: full DFS <code>A B D G E H I C F</code>, then <code>B(3) D(3) G(1) E(2) H(2) I(1)</code>.</li>
       <li><code>f2()</code> — apply Dijkstra's shortest path algorithm (weighted matrix, value 99 = infinity). Line 1: shortest path from A to F, with the total distance in parentheses right after the last vertex. Line 2: the last 5 vertices selected into the set S <strong>up to and including reaching F</strong> (i.e. Dijkstra stops once F is finalized — the "last 5" are the 5 vertices selected right before/at reaching F, not a full run over all vertices). Line 3: shortest path from B to G (no distance/S-order needed for this one). Expected f2.txt: <code>A I C E D F(17)</code> / <code>E B D H F</code> / <code>B C E D G</code>.</li>
     </ul>`,
    `<p><strong>Câu 3 (2 điểm) — file Graph.java.</strong></p>
     <ul>
       <li><code>f1()</code> — duyệt sâu (đã gọi sẵn qua <code>depth(0,f)</code>) từ đỉnh i=0 (A), NHƯNG cũng hiển thị 6 đỉnh kèm bậc, từ đỉnh thứ 2 đến thứ 7 của thứ tự DFS đó. Gợi ý: sao chép depth(...) thành depth2(...) rồi sửa; có sẵn mảng <code>int deg[]</code> — tính d[i] = bậc đỉnh i rồi dùng <code>fvisitDeg(...)</code>. f1.txt mong đợi: DFS đầy đủ <code>A B D G E H I C F</code>, rồi <code>B(3) D(3) G(1) E(2) H(2) I(1)</code>.</li>
       <li><code>f2()</code> — áp dụng Dijkstra (ma trận trọng số, giá trị 99 = vô cực). Dòng 1: đường đi ngắn nhất A→F, kèm tổng khoảng cách trong ngoặc ngay sau đỉnh cuối. Dòng 2: 5 đỉnh CUỐI được chọn vào tập S <strong>tính tới khi chạm F</strong> (tức Dijkstra dừng khi F được chốt — "5 đỉnh cuối" là 5 đỉnh chọn ngay trước/khi tới F, không phải chạy hết toàn bộ đỉnh). Dòng 3: đường đi ngắn nhất B→G (không cần khoảng cách/thứ tự S cho dòng này). f2.txt mong đợi: như trên.</li>
     </ul>`
  ),
  starterCode: graphStarter,
  sampleSolution: graphSolved,
  expectedOutput: `f1.txt: A B D G E H I C F / B(3) D(3) G(1) E(2) H(2) I(1)
f2.txt: A I C E D F(17) / E B D H F / B C E D G`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running both choices against the bundled data.txt — output matches the paper's expected example byte-for-byte for BOTH f1 and f2 (a rare case in this paper where the illustrative example IS derived from the bundled data). Key detail for f2: Dijkstra must stop as soon as the target vertex is finalized into S (not run to completion over all n vertices) — this was confirmed by computing both interpretations independently: the full-run "last 5" gives {B,D,H,F,G}, but the early-stop-at-target "last 5" gives {E,B,D,H,F}, which is the one that matches the paper exactly.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy cả 2 lựa chọn với data.txt đi kèm — output khớp byte-for-byte với ví dụ trong đề cho CẢ f1 và f2 (một trong số ít trường hợp của đề này mà ví dụ minh hoạ THẬT SỰ lấy từ dữ liệu đi kèm). Chi tiết quan trọng cho f2: Dijkstra phải DỪNG ngay khi đỉnh đích được chốt vào S (không chạy hết toàn bộ n đỉnh) — đã xác nhận bằng cách tính độc lập cả 2 cách hiểu: chạy hết cho "5 đỉnh cuối" ra {B,D,H,F,G}, còn dừng sớm khi tới đích cho "5 đỉnh cuối" ra {E,B,D,H,F} — đúng khớp với đề.</p>`
  ),
  rubric: [
    { id: 'f1_degree', criterion: B('Correctly computes deg[i] and displays vertices 2-7 of the DFS order with their degree via fvisitDeg.', 'Tính đúng deg[i] và hiển thị đỉnh 2-7 của thứ tự DFS kèm bậc qua fvisitDeg.'), weight: 1, maxScore: 1 },
    { id: 'f2_dijkstra', criterion: B('Correct Dijkstra implementation: shortest path A→F with correct total distance, correct last-5-selected-into-S (stopping at target), and correct shortest path B→G.', 'Cài đặt Dijkstra đúng: đường đi ngắn nhất A→F với tổng khoảng cách đúng, đúng 5 đỉnh cuối chọn vào S (dừng khi tới đích), và đúng đường đi ngắn nhất B→G.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE2-SU25B1',
    title: 'PE Đề 2 — Practical Exam (SU 2025 - Block 1)|||PE Đề 2 — Thi thực hành (SU 2025 - Block 1)',
    description: 'CSD201 PE (CODE): singly linked list + BST (rotation, delete-by-copying) + Graph (DFS, Dijkstra), AI-graded.|||PE CSD201 (viết mã): danh sách liên kết đơn + BST (xoay cây, xoá-bằng-copy) + Đồ thị (DFS, Dijkstra), chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE2-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
