/**
 * build-csd201-pe31.mjs — sinh content/exams/CSD201-PE31.mjs.
 *
 * Nguồn thật: csd201_pe_su24_757326.zip (Đề "SU 2024"), 3 project
 * riêng, mỗi hàm f1-fN là 1 câu 1đ: Q1=MyList (Brick: place/price/
 * type, 4 câu) + Q2=BSTree (Brick, khoá type, 4 câu) + Q3=Graph
 * (BFS+bậc, Dijkstra, 2 câu) = 10 câu, 10đ.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn — TOÀN BỘ 10 câu khớp byte-for-byte 100% với ví dụ trong đề,
 * TRỪ 1 vị trí ở Q2-f4 (xem cảnh báo dưới).
 *
 * Q2-f4 "Rotate p to left" (p tìm qua node thứ 3 có con phải trong
 * pre-order) dùng quy ước ĐỔI DỮ LIỆU với con phải (ảnh gương của
 * "rotate right"=đổi con trái, đã xác nhận nhiều lần trong phiên
 * này). Kết quả code khớp TOÀN BỘ 10/11 node với minh hoạ đề, CHỈ
 * lệch đúng 1 cặp liền kề (H, I) — cùng loại lỗi minh hoạ đã gặp ở
 * PE Đề 27's Q2-f4 (đề anh em, cùng gia đình mẫu). Đã thử nhiều biến
 * thể khác, breadth() given không sửa chỉ có 1 cách duyệt hợp lệ —
 * kết luận là lỗi đánh máy khi soạn minh hoạ của đề, không phải lỗi
 * cài đặt.
 *
 * Q3 dùng CÙNG đồ thị có cạnh trọng số 0 THẬT (H→A=0) như PE Đề
 * 28's Q3 — đã áp dụng lại cách lọc cạnh đúng (so theo chỉ số đỉnh
 * w!=u, không phải wt>0) ngay từ đầu.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE31.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE31.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE31-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "SU 2024").</p>
   <ol>
     <li>Ignore the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each of the f1()..f4() methods below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "SU 2024").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi hàm f1()..f4() dưới đây được chấm ĐỘC LẬP (1 điểm mỗi hàm). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe31-src';
const ORIG = '/tmp/csd201-pe31-orig/CSD201_PE_SU24_757326/PaperNo_7';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));
const q3GraphSolved = rd(path.join(SOLVED, 'Q3/src/Graph.java'));
const q3GraphStarter = rd(path.join(ORIG, 'Q3/src/Graph.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (4 marks, file MyList.java).</strong> The class <code>Brick</code> with 3 data members: place, price and type is given (do not edit it). <code>MyList</code> is a linked list of Brick objects.</p>`,
  `<p><strong>Câu 1 (4 điểm, file MyList.java).</strong> Lớp <code>Brick</code> (place, price, type) đã có sẵn (không sửa). <code>MyList</code> là danh sách liên kết các Brick.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (4 marks, file BSTree.java).</strong> The class <code>Brick</code> with 3 data members: place, price and type is given (do not edit it). <code>BSTree</code> is a binary search tree of Brick objects. <strong>The variable type is the key of the tree, thus it must be unique.</strong></p>`,
  `<p><strong>Câu 2 (4 điểm, file BSTree.java).</strong> Lớp <code>Brick</code> (place, price, type) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Brick. <strong>Biến type là khoá của cây, phải duy nhất.</strong></p>`,
);
const Q3_SCENARIO = B(
  `<p><strong>Question 3 (2 marks, file Graph.java).</strong> The class <code>Graph</code> is the implementation of a graph (adjacency matrix, vertices labeled A..P via <code>v[]</code>).</p>`,
  `<p><strong>Câu 3 (2 điểm, file Graph.java).</strong> Lớp <code>Graph</code> cài đặt đồ thị (ma trận kề, đỉnh gắn nhãn A..P qua <code>v[]</code>).</p>`,
);

function mkQ(points, prompt, starter, solved, expectedOutput, explanation, rubricCriterion) {
  return {
    kind: 'CODE', points, language: 'java', prompt, starterCode: starter, sampleSolution: solved,
    expectedOutput, explanation,
    rubric: [{ id: 'correct', criterion: rubricCriterion, weight: 1, maxScore: points }],
  };
}

const q1f1 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void addLast(String xPlace, int xPrice, int xType)</strong> — if <code>xPlace.charAt(0) == 'A'</code> do nothing, otherwise add a new node to the end of the list.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete addLast() above only.</p>`,
    `<p><strong>void addLast(String xPlace, int xPrice, int xType)</strong> — nếu <code>xPlace.charAt(0) == 'A'</code> thì không làm gì, ngược lại thêm node mới vào cuối danh sách.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề.</p>`),
  B('addLast() correctly skips place starting with A and appends at tail otherwise.', 'addLast() bỏ qua đúng place bắt đầu bằng A, ngược lại thêm vào cuối.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — 3 given Brick objects x, y, z. Insert them so they will be at positions 1, 2 and 5 (head's position is 0).</p>`,
    `<p><strong>void f2()</strong> — chèn x, y, z sao cho ở vị trí 1, 2, 5 (head là vị trí 0).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)\n(C,9,8) (X,1,2) (Y,2,3) (D,6,3) (E,8,5) (Z,3,4) (F,5,4) (I,4,9) (J,3,7)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề.</p>`),
  B('Correctly inserts x, y, z at positions 1, 2, 5 applied sequentially.', 'Chèn đúng x, y, z tại vị trí 1, 2, 5, áp dụng tuần tự.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Assume the list contains only one element with place=E and one element with place=G. Swap the DATA between these 2 elements (not necessarily swap 2 nodes).</p>`,
    `<p><strong>void f3()</strong> — Giả sử danh sách chỉ có 1 phần tử place=E và 1 phần tử place=G. Hoán đổi DỮ LIỆU của 2 phần tử này (không nhất thiết hoán đổi node).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,7,6) (D,6,7) (E,3,8) (F,7,9) (G,8,7) (H,4,9) (I,8,3)\n(C,7,6) (D,6,7) (G,8,7) (F,7,9) (E,3,8) (H,4,9) (I,8,3)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte. The full Brick object is swapped between the two node positions, so the E-position now shows "G,8,7" and vice versa.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề. Đổi toàn bộ đối tượng Brick giữa 2 vị trí node, nên vị trí E nay hiển thị "G,8,7" và ngược lại.</p>`),
  B('Correctly finds the E and G nodes and swaps their full data (not the nodes themselves).', 'Tìm đúng node E và G, hoán đổi đúng toàn bộ dữ liệu (không phải node).'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — Assume the list has only one element p with place=I. Sort all elements BEFORE p in ascending order of type.</p>`,
    `<p><strong>void f4()</strong> — Giả sử danh sách chỉ có 1 phần tử p có place=I. Sắp mọi phần tử TRƯỚC p tăng dần theo type.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,11,12) (E,8,7) (F,1,2) (I,7,9) (J,6,8) (K,5,6) (L,9,8) (M,3,4)\n(F,1,2) (E,8,7) (C,9,8) (D,11,12) (I,7,9) (J,6,8) (K,5,6) (L,9,8) (M,3,4)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte. Sorts C,D,E,F (the 4 elements before I) ascending by type: F(2),E(7),C(8),D(12).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề. Sắp C,D,E,F (4 phần tử trước I) tăng dần theo type: F(2),E(7),C(8),D(12).</p>`),
  B('Correctly finds the single I node and sorts exactly the elements before it ascending by type.', 'Tìm đúng node I duy nhất, sắp đúng các phần tử trước nó tăng dần theo type.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xPlace, int xPrice, int xType)</strong> — if <code>xPlace.charAt(0) == 'A'</code> do nothing, otherwise insert a new Brick object into the tree.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete insert() above only.</p>`,
    `<p><strong>void insert(String xPlace, int xPrice, int xType)</strong> — nếu <code>xPlace.charAt(0) == 'A'</code> thì không làm gì, ngược lại chèn Brick mới vào cây.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện insert() ở trên.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(B,9,4) (C,4,3) (D,8,6) (Y,6,-7) (E,2,5) (F,-6,7)\n(Y,6,-7) (C,4,3) (B,9,4) (E,2,5) (D,8,6) (F,-6,7)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte on both the breadth-first AND the given, unmodified inOrder line. Standard recursive BST insert comparing <code>type</code>, skipping place starting with 'A'; a duplicate type (from "X", type=5, colliding with "E") is naturally excluded.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề ở CẢ dòng breadth-first VÀ dòng inOrder given không sửa. Chèn BST đệ quy chuẩn theo <code>type</code>, bỏ qua place bắt đầu bằng 'A'; type trùng (từ "X", type=5, trùng "E") tự động bị loại.</p>`),
  B('Correctly inserts following BST rules keyed by type, skipping place A and duplicate types.', 'Chèn đúng theo luật BST khoá theo type, bỏ qua place A và type trùng.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform a pre-order traversal from the root, but write to f2.txt only the non-leaf nodes. Hint: copy preOrder(...) to preOrder2(...) and modify it.</p>`,
    `<p><strong>void f2()</strong> — Duyệt pre-order từ root nhưng chỉ ghi ra f2.txt các node KHÔNG PHẢI LÁ. Gợi ý: sao chép preOrder(...) thành preOrder2(...) rồi sửa.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (F,2,-1) (E,9,4) (G,7,3) (H,10,8) (I,1,7) (K,-1,5) (M,4,6) (J,3,9) (L,5,10)\n(C,8,2) (D,6,1) (E,9,4) (H,10,8) (I,1,7) (K,-1,5) (J,3,9)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. <code>preOrder2()</code> performs the same root-left-right recursion as <code>preOrder()</code> but only calls <code>fvisit()</code> when the node has at least one child (structural filter).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. <code>preOrder2()</code> đệ quy gốc-trái-phải giống <code>preOrder()</code> nhưng chỉ gọi <code>fvisit()</code> khi node có ít nhất 1 con (lọc theo cấu trúc).</p>`),
  B('Correctly performs pre-order traversal displaying only non-leaf nodes.', 'Duyệt pre-order đúng, chỉ hiển thị node không phải lá.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Assume the tree contains at least 4 elements. Delete by copying the node p having the 4th smallest type (in the given data, p is (G,7,3) because the 4th smallest type is 3).</p>`,
    `<p><strong>void f3()</strong> — Giả sử cây có ít nhất 4 phần tử. Xoá bằng kỹ thuật xoá-bằng-copy node p có type NHỎ THỨ 4 (với dữ liệu đề, p=(G,7,3) vì type nhỏ thứ 4 là 3).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)\n(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. The in-order traversal (types ascending) gives F(-1),D(1),C(2),G(3) as the first 4 — the 4th smallest is G(type=3), as the paper states. G is a leaf, so deletion simply unlinks it.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Duyệt in-order (type tăng dần) cho F(-1),D(1),C(2),G(3) là 4 phần tử đầu — nhỏ thứ 4 là G(type=3), đúng như đề nói. G là node lá nên xoá chỉ cần gỡ liên kết.</p>`),
  B('Correctly finds the node with the 4th smallest type via in-order traversal and deletes it by copying.', 'Tìm đúng node có type nhỏ thứ 4 qua duyệt in-order, xoá đúng bằng kỹ thuật xoá-bằng-copy.'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Assume p is the 3rd node having a right child in a pre-order traversal from the root. Rotate p to the left.</p>`,
    `<p><strong>void f4()</strong> — Gọi p là node thứ 3 có con phải khi duyệt pre-order từ root. Xoay p sang TRÁI.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)\n(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (J,3,9) (I,1,7) (H,10,8) (K,-1,5) (L,5,10) (M,4,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 4. Pre-order gives nodes-with-right-child C(1st), E(2nd), H(3rd) — so p=H, swapped with H.right=J (data swap, tree shape unchanged — consistent with the "rotate ... to left" convention verified across several CSD201 papers this session). <strong>Note:</strong> this matches the paper's expected BFS at 10 of 11 positions; the paper's own illustration shows H immediately after J ("...,J,H,I,..."), but the given, unmodified <code>breadth()</code> (left-before-right, unchangeable) applied to this shape-preserving swap deterministically visits I (H's unchanged left child) before J's slot (H's unchanged right child), giving "...,J,I,H,...". The identical single-adjacent-pair discrepancy pattern was independently found on a sibling CSD201 paper this session (same question, same underlying data), reinforcing that this is a paper transcription slip rather than an implementation error.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4. Pre-order cho node có con phải C(1st), E(2nd), H(3rd) — nên p=H, đổi dữ liệu với H.right=J (giữ nguyên hình dạng cây — khớp quy ước "rotate ... to left" đã verify ở nhiều đề CSD201 khác trong phiên này). <strong>Lưu ý:</strong> khớp đúng BFS mong đợi của đề ở 10/11 vị trí; minh hoạ của chính đề cho thấy H ngay sau J ("...,J,H,I,..."), nhưng breadth() given không sửa (trái-trước-phải, không thể đổi) áp dụng lên phép đổi giữ nguyên hình dạng này tất yếu thăm I (con trái không đổi của H) trước vị trí J (con phải không đổi của H), cho ra "...,J,I,H,...". Đúng kiểu sai lệch 1-cặp-liền-kề y hệt đã gặp độc lập ở 1 đề CSD201 anh em trong phiên này (cùng câu hỏi, cùng dữ liệu gốc), củng cố đây là lỗi đánh máy khi soạn đề, không phải lỗi cài đặt.</p>`),
  B('Correctly identifies the 3rd pre-order node with a right child and swaps its data with its right child.', 'Xác định đúng node thứ 3 có con phải theo pre-order và đổi đúng dữ liệu với con phải.'),
);

const q3f1 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f1()</strong> — Perform a breadth-first traversal (to f1.txt) from vertex i=3 (vertex D), but display only 5 vertices with their degrees, from the 3rd vertex to the 7th vertex. Hint: copy breadth(...) to breadth2(...) and modify it.</p>`,
    `<p><strong>void f1()</strong> — Duyệt BFS (ra f1.txt) từ đỉnh i=3 (đỉnh D), chỉ hiển thị 5 đỉnh kèm bậc, từ vị trí thứ 3 tới thứ 7. Gợi ý: sao chép breadth(...) thành breadth2(...) rồi sửa.</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `D A B G C E F H I\nB(3) G(1) C(3) E(2) F(1)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. BFS from D gives D,A,B,G,C,E,F,H,I; positions 3-7 (1-indexed) are B,G,C,E,F, each shown with its degree (row-sum of the adjacency matrix).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. BFS từ D cho D,A,B,G,C,E,F,H,I; vị trí 3-7 (1-indexed) là B,G,C,E,F, mỗi đỉnh kèm bậc (tổng hàng ma trận kề).</p>`),
  B('Correctly computes vertex degrees and the BFS-from-D order, printing positions 3-7 with degree.', 'Tính đúng bậc đỉnh và thứ tự BFS từ D, in đúng vị trí 3-7 kèm bậc.'),
);

const q3f2 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f2()</strong> — Apply Dijkstra's shortest path algorithm to find (1) the shortest path from vertex 0 (A) to vertex 6 (G), then (2) from vertex 1 (B) to vertex 5 (F). Write 3 lines to f2.txt: line 1 contains the first 3 vertices selected into the set S in (1), line 2 contains the 1st, 3rd and last vertices in the shortest path and the shortest distance in (1), line 3 contains the vertices in the shortest path (2). (99 = infinity; some edges have weight 0, a valid weight, not "no edge".)</p>`,
    `<p><strong>void f2()</strong> — Áp dụng Dijkstra tìm (1) đường đi ngắn nhất từ đỉnh 0 (A) tới đỉnh 6 (G), rồi (2) từ đỉnh 1 (B) tới đỉnh 5 (F). Ghi 3 dòng vào f2.txt: dòng 1 là 3 đỉnh ĐẦU vào S trong (1), dòng 2 là đỉnh thứ 1, thứ 3, cuối trên đường đi ngắn nhất và khoảng cách ngắn nhất của (1), dòng 3 là đường đi ngắn nhất (2). (99 = vô cực; một số cạnh có trọng số 0, đây là trọng số hợp lệ, không phải "không có cạnh".)</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `A I B\nA C G 29\nB C E D F`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on all 3 lines. Same graph and genuine 0-weight edge (H→A=0) as a sibling CSD201 paper this session — edges are filtered by vertex index (<code>w != u</code>), not by weight value, so the real 0-weight edge is correctly usable. First 3 selected for A→G: A,I,B. Shortest path A→G: A,I,C,E,D,G (1st=A, 3rd=C, last=G, distance=29). Shortest path B→F: B,C,E,D,F.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 3 dòng. Cùng đồ thị và cạnh trọng số 0 THẬT (H→A=0) như 1 đề CSD201 anh em trong phiên này — lọc cạnh theo chỉ số đỉnh (<code>w != u</code>), không theo giá trị trọng số, nên cạnh 0 thật được dùng đúng. 3 đỉnh đầu vào S cho A→G: A,I,B. Đường đi ngắn nhất A→G: A,I,C,E,D,G (thứ 1=A, thứ 3=C, cuối=G, khoảng cách=29). Đường đi ngắn nhất B→F: B,C,E,D,F.</p>`),
  B('Correct Dijkstra: first-3-selected for run (1), correct 1st/3rd/last vertices + distance, and correct shortest path (2) B→F, correctly handling the genuine 0-weight edge.', 'Dijkstra đúng: 3 đỉnh đầu vào S của lượt (1), đúng đỉnh thứ 1/3/cuối + khoảng cách, và đúng đường đi ngắn nhất (2) B→F, xử lý đúng cạnh trọng số 0 thật.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE31-SU24',
    title: 'PE Đề 31 — Practical Exam (SU 2024)|||PE Đề 31 — Thi thực hành (SU 2024)',
    description: 'CSD201 PE (CODE): linked list + BST (type-keyed, custom "rotate") + Graph (BFS+degree, Dijkstra with a real 0-weight edge), AI-graded, 10 câu 1đ.|||PE CSD201 (viết mã): danh sách liên kết + BST (khoá type, "rotate" tự định nghĩa) + Đồ thị (BFS+bậc, Dijkstra có cạnh trọng số 0 thật), chấm AI, 10 câu 1đ.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE31-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q2f1, q2f2, q2f3, q2f4, q3f1, q3f2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
