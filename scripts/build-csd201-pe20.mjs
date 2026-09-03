/**
 * build-csd201-pe20.mjs — sinh content/exams/CSD201-PE20.mjs.
 *
 * Nguồn thật: csd201_pe_sp25_904213.zip (Đề "SP 2025"), 3 project
 * riêng, mỗi hàm f1-fN là 1 câu 1đ (Main.java thật ghi "(1 mark)",
 * cùng khuôn PE Đề 13/16/17): Q1=MyList (Camel: desert/step/type, 4
 * câu) + Q2=BSTree (Camel, khoá step, 4 câu) + Q3=Graph (BFS+bậc,
 * Dijkstra, 2 câu) = 10 câu, 10đ.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn — TOÀN BỘ 10 câu khớp byte-for-byte 100% với ví dụ trong đề,
 * không có discrepancy nào.
 *
 * Q2-f4 "rotate p to right" LẦN THỨ TƯ xác nhận cùng quy ước: ĐỔI DỮ
 * LIỆU giữa p và p.left (giữ nguyên hình dạng cây) — lần này p được
 * tìm qua duyệt POST-ORDER (không phải BFS như 3 đề trước), càng
 * chứng tỏ quy ước áp dụng cho MỌI cách tìm p, không phụ thuộc thuật
 * duyệt.
 *
 * Q3 dùng đồ thị + ma trận trọng số Y HỆT PE Đề 13's Q3 (đã tính tay
 * Dijkstra từ trước) — nhưng định dạng output khác (nhãn khoảng cách
 * gắn vào vị trí thứ 3,4 của ĐƯỜNG ĐI thay vì 5 đỉnh cuối vào S; dòng
 * cuối chỉ 1 số khoảng cách, không phải đường đi) — đã đọc đúng theo
 * chữ của đề này.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE20.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE20.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE20-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "SP 2025").</p>
   <ol>
     <li>Pay no attention to the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each of the f1()..f4() methods below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "SP 2025").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi hàm f1()..f4() dưới đây được chấm ĐỘC LẬP (1 điểm mỗi hàm). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe20-src';
const ORIG = '/tmp/csd201-pe20-orig/CSD201_PE_SP25_904213/PaperNo_4';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));
const q3GraphSolved = rd(path.join(SOLVED, 'Q3/src/Graph.java'));
const q3GraphStarter = rd(path.join(ORIG, 'Q3/src/Graph.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (4 marks, file MyList.java).</strong> The class <code>Camel</code> with 3 data members: desert, step and type is given (do not edit it). <code>MyList</code> is a linked list of Camel objects.</p>`,
  `<p><strong>Câu 1 (4 điểm, file MyList.java).</strong> Lớp <code>Camel</code> (desert, step, type) đã có sẵn (không sửa). <code>MyList</code> là danh sách liên kết các Camel.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (4 marks, file BSTree.java).</strong> The class <code>Camel</code> with 3 data members: desert, step and type is given (do not edit it). <code>BSTree</code> is a binary search tree of Camel objects. <strong>The variable step is the key of the tree, thus it must be unique.</strong></p>`,
  `<p><strong>Câu 2 (4 điểm, file BSTree.java).</strong> Lớp <code>Camel</code> (desert, step, type) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Camel. <strong>Biến step là khoá của cây, phải duy nhất.</strong></p>`,
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
    `<p><strong>void addLast(String xDesert, int xStep, int xType)</strong> — if <code>xDesert.charAt(0) == 'B'</code> do nothing, otherwise add a new node with desert=xDesert, step=xStep, type=xType to the end of the list (step and type can be arbitrary, even negative values).</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete addLast() above only.</p>`,
    `<p><strong>void addLast(String xDesert, int xStep, int xType)</strong> — nếu <code>xDesert.charAt(0) == 'B'</code> thì không làm gì, ngược lại thêm node mới vào cuối danh sách.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(A,9,8) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. Skips desert starting with 'B', otherwise appends at <code>tail</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. Bỏ qua desert bắt đầu bằng 'B', ngược lại thêm vào <code>tail</code>.</p>`),
  B('addLast() correctly skips desert starting with B and appends at tail otherwise.', 'addLast() bỏ qua đúng desert bắt đầu bằng B, ngược lại thêm vào cuối.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — 3 given Camel objects x, y, z. Write statements to insert x, y, z into the list so that x, y, z are at positions 2, 4 and 5 (the head's position is 0).</p>`,
    `<p><strong>void f2()</strong> — cho 3 đối tượng Camel x, y, z. Chèn sao cho x, y, z ở vị trí 2, 4, 5 (head là vị trí 0).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)\n(C,9,8) (D,6,3) (X,1,2) (E,8,5) (Y,2,3) (Z,3,4) (F,5,4) (I,4,9) (J,3,7)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. Inserts x at position 2, then y at position 4 of the resulting list, then z at position 5 of that result — each insertion applied sequentially against the list's CURRENT state.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. Chèn x tại vị trí 2, rồi y tại vị trí 4 của danh sách kết quả, rồi z tại vị trí 5 của kết quả đó — mỗi lần chèn áp dụng tuần tự lên trạng thái HIỆN TẠI của danh sách.</p>`),
  B('Correctly inserts x, y, z at positions 2, 4, 5 applied sequentially.', 'Chèn đúng x, y, z tại vị trí 2, 4, 5, áp dụng tuần tự.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Suppose p is the first node with maximum step in the list. Find the second node q having <code>q.info.step &lt; p.info.step</code>. Swap the contents of p and q (i.e. swap the entire Camel object, including desert).</p>`,
    `<p><strong>void f3()</strong> — Gọi p là node đầu tiên có step lớn nhất trong danh sách. Tìm node q thứ 2 có <code>q.info.step &lt; p.info.step</code>. Hoán đổi TOÀN BỘ nội dung (cả desert) của p và q.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,7,6) (D,6,7) (E,3,8) (F,7,9) (G,8,7) (H,4,9) (I,8,3) (J,5,4)\n(C,7,6) (G,8,7) (E,3,8) (F,7,9) (D,6,7) (H,4,9) (I,8,3) (J,5,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. p = G (first node with max step=8, ahead of I which also has step=8). Scanning for nodes with step &lt; 8, the 2nd one encountered is D (after C, the 1st). Swapping the FULL Camel object (not just numeric fields) between the G-node and D-node positions makes the position formerly holding "D" now print as "(G,8,7)" and vice versa, matching the paper exactly.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. p = G (node đầu tiên có step lớn nhất=8, trước I cũng step=8). Quét node có step &lt; 8, gặp thứ 2 là D (sau C là thứ 1). Hoán đổi TOÀN BỘ đối tượng Camel (không chỉ trường số) giữa vị trí node G và D khiến vị trí từng là "D" nay in ra "(G,8,7)" và ngược lại, khớp đúng đề.</p>`),
  B('Correctly identifies p (first max-step) and q (2nd node with smaller step), swapping their full contents.', 'Xác định đúng p (max step đầu tiên) và q (node thứ 2 có step nhỏ hơn), hoán đổi đúng toàn bộ nội dung.'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — Find the element p having desert = "F". Reverse all elements after p.</p>`,
    `<p><strong>void f4()</strong> — Tìm phần tử p có desert = "F". Đảo ngược mọi phần tử SAU p.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,11,12) (E,8,7) (F,1,2) (I,7,9) (J,6,8) (K,5,6) (L,9,8) (M,3,4)\n(C,9,8) (D,11,12) (E,8,7) (F,1,2) (M,3,4) (L,9,8) (K,5,6) (J,6,8) (I,7,9)`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte. Finds the node with desert "F", collects and reverses every node after it (I,J,K,L,M → M,L,K,J,I), relinking with tail updated.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề. Tìm node desert "F", gom và đảo ngược mọi node sau nó (I,J,K,L,M → M,L,K,J,I), nối lại và cập nhật tail.</p>`),
  B('Correctly finds the F node and reverses exactly the elements after it.', 'Tìm đúng node F, đảo ngược đúng các phần tử sau nó.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xDesert, int xStep, int xType)</strong> — if <code>xDesert.charAt(0) == 'B'</code> do nothing, otherwise insert a new Camel object into the tree.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete insert() above only.</p>`,
    `<p><strong>void insert(String xDesert, int xStep, int xType)</strong> — nếu <code>xDesert.charAt(0) == 'B'</code> thì không làm gì, ngược lại chèn Camel mới vào cây.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện insert() ở trên.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(A,7,9) (C,4,3) (D,8,6) (E,2,5) (Y,6,-7) (F,-6,7)\n(F,-6,7) (E,2,5) (C,4,3) (Y,6,-7) (A,7,9) (D,8,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte on BOTH the breadth-first AND the given, unmodified inOrder line. Standard recursive BST insert comparing <code>step</code>, skipping any desert starting with 'B'; a duplicate step (from "X", step=4, colliding with "C") is naturally excluded.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề ở CẢ dòng breadth-first VÀ dòng inOrder given không sửa. Chèn BST đệ quy chuẩn theo <code>step</code>, bỏ qua desert bắt đầu bằng 'B'; step trùng (từ "X", step=4, trùng "C") tự động bị loại.</p>`),
  B('Correctly inserts following BST rules keyed by step, skipping desert B and duplicate steps.', 'Chèn đúng theo luật BST khoá theo step, bỏ qua desert B và step trùng.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform pre-order traversal from the root but write to f2.txt only the nodes with type &gt; 4. Hint: copy preOrder(...) to preOrder2(...) and modify it.</p>`,
    `<p><strong>void f2()</strong> — Duyệt pre-order từ root nhưng chỉ ghi ra f2.txt các node có type &gt; 4. Gợi ý: sao chép preOrder(...) thành preOrder2(...) rồi sửa.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (F,2,-1) (I,1,7) (K,-1,5) (J,3,9) (L,5,10) (M,4,6) (G,7,3) (E,9,4) (H,10,8)\n(I,1,7) (K,-1,5) (J,3,9) (L,5,10) (M,4,6) (H,10,8)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. <code>preOrder2()</code> performs the same root-left-right recursion as <code>preOrder()</code> but only calls <code>fvisit()</code> when <code>type &gt; 4</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. <code>preOrder2()</code> đệ quy gốc-trái-phải giống <code>preOrder()</code> nhưng chỉ gọi <code>fvisit()</code> khi <code>type &gt; 4</code>.</p>`),
  B('Correctly performs pre-order traversal displaying only nodes with type > 4.', 'Duyệt pre-order đúng, chỉ hiển thị node có type > 4.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Suppose p is the 3rd node when performing the pre-order traversal of the tree. Count the number of nodes in the sub-tree with root p; suppose this number is k, then set <code>p.info.type = k</code>.</p>`,
    `<p><strong>void f3()</strong> — Gọi p là node thứ 3 khi duyệt pre-order. Đếm số node trong cây con gốc p, gọi số đó là k, gán <code>p.info.type = k</code>.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)\n(C,8,2) (D,6,1) (E,9,4) (F,2,6) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. Pre-order gives C(1st), D(2nd), F(3rd) — so p=F. F's subtree contains F, I, K, J, L, M = 6 nodes, so <code>F.info.type</code> is set to 6.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Pre-order cho C(1st), D(2nd), F(3rd) — nên p=F. Cây con của F gồm F, I, K, J, L, M = 6 node, nên <code>F.info.type</code> được gán 6.</p>`),
  B('Correctly identifies the 3rd pre-order node and sets its type to its subtree node count.', 'Xác định đúng node thứ 3 theo pre-order, gán đúng type bằng số node cây con của nó.'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Suppose p is the 2nd node having left-child when performing the post-order traversal of the tree from the root. Rotate p to right.</p>`,
    `<p><strong>void f4()</strong> — Gọi p là node thứ 2 có con trái khi duyệt POST-ORDER từ root. Xoay p sang PHẢI.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)\n(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (M,4,6) (L,5,10)`,
  B(`<p>Verified by compiling against the real given project and running choice 4. Post-order visits (K,I,M,L,J,F,G,D,H,E,C); of these, nodes with a left child are I(1st), L(2nd, left=M), F(3rd), D(4th), C(5th) — so p=L. As with the equivalent question on three other CSD201 papers this session, "rotate p to right" means swapping only the <code>Camel</code> data between p and p.left (here L and its leaf child M), leaving the tree shape unchanged — this reproduces the paper's expected BFS exactly, confirming the rule holds regardless of how p was located (BFS in other papers, post-order here).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4. Post-order thăm (K,I,M,L,J,F,G,D,H,E,C); trong đó node có con trái là I(1st), L(2nd, trái=M), F(3rd), D(4th), C(5th) — nên p=L. Giống câu tương đương ở 3 đề CSD201 khác trong phiên này, "rotate p to right" nghĩa là ĐỔI dữ liệu <code>Camel</code> giữa p và p.left (ở đây là L và con lá M), giữ nguyên hình dạng cây — cách này tái tạo đúng BFS mong đợi của đề, xác nhận quy ước áp dụng bất kể cách tìm p (BFS ở các đề khác, post-order ở đây).</p>`),
  B('Correctly identifies the 2nd post-order node with a left child and swaps its data with its left child.', 'Xác định đúng node thứ 2 có con trái theo post-order và đổi đúng dữ liệu với con trái.'),
);

const q3f1 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f1()</strong> — Perform breadth-first traversal (to f1.txt) from vertex i=5 (vertex F), and display only 6 vertices with their degrees from the 2nd vertex to the 7th vertex. Hint: copy breadth(...) to breadth2(...) and modify the latter one.</p>`,
    `<p><strong>void f1()</strong> — Duyệt BFS (ra f1.txt) từ đỉnh i=5 (đỉnh F), chỉ hiển thị 6 đỉnh kèm bậc, từ vị trí thứ 2 tới thứ 7. Gợi ý: sao chép breadth(...) thành breadth2(...) rồi sửa.</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `F C A H B D E I G\nC(3) A(3) H(2) B(3) D(3) E(2)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. This graph is mostly symmetric but not entirely (e.g. C→H exists, H→C does not), so degree is computed as OUT-degree (row sum): H's out-degree is 2 (E, I only), not 3. BFS from F gives F,C,A,H,B,D,E,I,G; positions 2-7 (1-indexed) are C,A,H,B,D,E, each shown with its row-sum degree.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. Đồ thị này phần lớn đối xứng nhưng không hoàn toàn (VD C→H có, H→C không có), nên bậc tính theo bậc RA (tổng hàng): bậc ra của H là 2 (chỉ E, I), không phải 3. BFS từ F cho F,C,A,H,B,D,E,I,G; vị trí 2-7 (1-indexed) là C,A,H,B,D,E, mỗi đỉnh kèm bậc theo tổng hàng.</p>`),
  B('Correctly computes out-degree (row-sum) and the BFS-from-F order, printing positions 2-7 with degree.', 'Tính đúng bậc ra (tổng hàng) và thứ tự BFS từ F, in đúng vị trí 2-7 kèm bậc.'),
);

const q3f2 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f2()</strong> — Apply Dijkstra's shortest path algorithm to find the shortest path from vertex 0 (A) to vertex 6 (G). Write 3 lines to f2.txt: line 1 contains the vertices in the shortest path in which the 3rd and 4th vertices have labels (their shortest distance). Line 2 contains the first 6 vertices selected into the set S. Line 3 contains the shortest distance (to G). (99 = infinity in the weighted matrix.)</p>`,
    `<p><strong>void f2()</strong> — Áp dụng Dijkstra tìm đường đi ngắn nhất từ đỉnh 0 (A) tới đỉnh 6 (G). Ghi 3 dòng vào f2.txt: dòng 1 là các đỉnh trên đường đi, trong đó đỉnh thứ 3 và thứ 4 có nhãn (khoảng cách ngắn nhất). Dòng 2 là 6 đỉnh ĐẦU được chọn vào tập S. Dòng 3 là khoảng cách ngắn nhất (tới G). (99 = vô cực trong ma trận trọng số.)</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `A I C(5) E(8) D G\nA I C E B D\n22`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on all 3 lines. Uses the same graph and weighted matrix as a similar question on another CSD201 paper this session (independently hand-verified earlier), but this paper's f2 wants a different output shape: distance labels on the 3rd/4th vertex of the PATH itself (not on the last-N-selected list), the first 6 selected into S, and just the final shortest distance alone on line 3 — read directly from this paper's own wording, not assumed from the other one.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 3 dòng. Dùng cùng đồ thị và ma trận trọng số như 1 câu tương tự ở đề CSD201 khác trong phiên này (đã tự verify tay từ trước), nhưng f2 của đề này muốn định dạng output khác: nhãn khoảng cách gắn vào đỉnh thứ 3/4 của chính ĐƯỜNG ĐI (không phải danh sách N đỉnh cuối vào S), 6 đỉnh đầu vào S, và chỉ 1 số khoảng cách cuối cùng ở dòng 3 — đọc đúng theo chữ của đề này, không giả định theo đề kia.</p>`),
  B('Correct Dijkstra: correct path A→G with 3rd/4th vertices labeled, first-6-selected list, and correct final distance.', 'Dijkstra đúng: đúng đường đi A→G với đỉnh thứ 3/4 có nhãn, đúng danh sách 6 đỉnh đầu vào S, và đúng khoảng cách cuối.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE20-SP25',
    title: 'PE Đề 20 — Practical Exam (SP 2025)|||PE Đề 20 — Thi thực hành (SP 2025)',
    description: 'CSD201 PE (CODE): linked list + BST (step-keyed, custom "rotate") + Graph (BFS+degree, Dijkstra), AI-graded, 10 câu 1đ.|||PE CSD201 (viết mã): danh sách liên kết + BST (khoá step, "rotate" tự định nghĩa) + Đồ thị (BFS+bậc, Dijkstra), chấm AI, 10 câu 1đ.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE20-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q2f1, q2f2, q2f3, q2f4, q3f1, q3f2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
