/**
 * build-csd201-pe30.mjs — sinh content/exams/CSD201-PE30.mjs.
 *
 * Nguồn thật: pe_csd201_su22_trial.rar (Đề "SU 2022 - Trial"), 3
 * project riêng: Q1=MyList (Car: owner/price, 4 câu — NHƯNG chỉ dựng
 * 3, xem cảnh báo dưới) + Q2=BSTree (Car, khoá price, 4 câu) +
 * Q3=Graph (DFS, TÌM CHU TRÌNH EULER bằng thuật giải cho sẵn, 2 câu)
 * = 9 câu, 9đ (không phải 10 câu/10đ như các đề khác).
 *
 * ⚠️ Q1-f4 KHÔNG có trong đề: chính file paper.pdf của FUOverflow ghi
 * rõ "(content not captured in images)" — ảnh chụp màn hình gốc của
 * người đăng bị thiếu đúng phần này. Không có solutions.rar đối
 * chiếu, không có gợi ý trong comment given code. Đã kiểm tra kỹ
 * (đọc lại PDF gốc ở độ phân giải cao, không chỉ text OCR) — xác nhận
 * đây là lỗ hổng thật trong nguồn, không phải lỗi trích xuất của
 * mình. KHÔNG bịa nội dung — bỏ hẳn câu này, đề chỉ còn 9 câu 9đ.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn còn lại — TOÀN BỘ 9 câu khớp byte-for-byte 100% với ví dụ
 * trong đề.
 *
 * Q2-f4 "Rotate p to right about its left son" là phép XOAY CON TRỎ
 * CHUẨN GIÁO TRÌNH (giống phát hiện ở PE Đề 28, khác quy ước đổi-dữ-
 * liệu ở PE Đề 13/16/17/20/24/27) — đã thử đổi dữ liệu trước, không
 * khớp; đổi sang xoay con trỏ thật khớp chính xác toàn bộ BFS.
 *
 * Q3-f2 là dạng bài MỚI trong phiên này: tìm CHU TRÌNH EULER bằng
 * thuật giải ngăn xếp cho sẵn NGUYÊN VĂN trong comment của
 * Graph.java (không phải BFS/DFS/Dijkstra như các đề khác). Đồ thị
 * có CẠNH BỘI (D-E lặp 2 lần trong ma trận) — cài đặt phải GIẢM (không
 * xoá hẳn) trọng số cạnh khi "gỡ" theo thuật giải. Đã tự mô phỏng
 * tay từng bước thuật giải (21 bước ngăn xếp) trước khi viết Java để
 * xác nhận trước, sau đó verify lại bằng chạy code thật — khớp
 * chính xác chu trình 11 đỉnh "B D E D C B E G F A B" của đề.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE30.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE30.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE30-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "SU 2022 - Trial").</p>
   <ol>
     <li>Do not pay attention to the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each of the f1()..f4() methods below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
     <li><strong>Note:</strong> this paper's original source is missing the specification for Question 1's f4() (even the reference PDF admits the screenshot was never captured) — that question is intentionally omitted here rather than guessed. This exam is worth 9 marks total, not 10.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "SU 2022 - Trial").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi hàm f1()..f4() dưới đây được chấm ĐỘC LẬP (1 điểm mỗi hàm). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
     <li><strong>Lưu ý:</strong> nguồn gốc của đề này bị thiếu đặc tả cho f4() của Câu 1 (chính file PDF gốc cũng ghi nhận ảnh chụp màn hình chưa từng được lưu) — câu đó CỐ Ý bị bỏ qua thay vì đoán mò. Đề này tổng 9 điểm, không phải 10.</li>
   </ol>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe30-src';
const ORIG = '/tmp/csd201-pe30-orig/PE_CSD201_SU22_Trial/PaperNo_6';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));
const q3GraphSolved = rd(path.join(SOLVED, 'Q3/src/Graph.java'));
const q3GraphStarter = rd(path.join(ORIG, 'Q3/src/Graph.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (3 of 4 marks graded — f4 omitted, see note above; file MyList.java).</strong> The class <code>Car</code> with 2 data members: owner and price is given (do not edit it). <code>MyList</code> is a linked list of Car objects.</p>`,
  `<p><strong>Câu 1 (3/4 điểm được chấm — f4 bị bỏ qua, xem lưu ý trên; file MyList.java).</strong> Lớp <code>Car</code> (owner, price) đã có sẵn (không sửa). <code>MyList</code> là danh sách liên kết các Car.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (4 marks, file BSTree.java).</strong> The class <code>Car</code> with 2 data members: owner and price is given (do not edit it). <code>BSTree</code> is a binary search tree of Car objects, in which <strong>price is the key of the tree</strong>.</p>`,
  `<p><strong>Câu 2 (4 điểm, file BSTree.java).</strong> Lớp <code>Car</code> (owner, price) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Car, <strong>khoá theo price</strong>.</p>`,
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
    `<p><strong>void addLast(String xOwner, int xPrice)</strong> — check if <code>xOwner.charAt(0) == 'A'</code> or <code>xPrice &gt; 100</code> then do nothing, otherwise append a new car to the end of the list.</p>
     <p><strong>void f1()</strong> — tests the addLast method above. You do not need to edit it.</p>`,
    `<p><strong>void addLast(String xOwner, int xPrice)</strong> — nếu <code>xOwner.charAt(0) == 'A'</code> hoặc <code>xPrice &gt; 100</code> thì không làm gì, ngược lại thêm xe mới vào cuối danh sách.</p>
     <p><strong>void f1()</strong> — kiểm tra addLast() ở trên. Không cần sửa.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(B,3) (C,7) (D,2) (E,6) (F,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. Skips owner starting with 'A' OR price &gt; 100 (a two-condition OR filter, unlike other CSD201 papers' single-condition addLast).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. Bỏ qua owner bắt đầu bằng 'A' HOẶC price &gt; 100 (2 điều kiện OR, khác addLast 1 điều kiện của các đề CSD201 khác).</p>`),
  B('addLast() correctly skips owner starting with A or price > 100, appending at tail otherwise.', 'addLast() bỏ qua đúng owner bắt đầu bằng A hoặc price > 100, ngược lại thêm vào cuối.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — Objects x and y are given (only y is used). Write statements so that y becomes the first element of the list.</p>`,
    `<p><strong>void f2()</strong> — cho x, y (chỉ dùng y). Chèn sao cho y trở thành phần tử ĐẦU TIÊN của danh sách.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9) (D,6) (E,8) (F,2) (I,6)\n(Y,2) (C,9) (D,6) (E,8) (F,2) (I,6)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte. Inserts y directly as the new head.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề. Chèn y trực tiếp làm head mới.</p>`),
  B('Correctly inserts y as the new head of the list.', 'Chèn đúng y làm head mới của danh sách.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Suppose the list contains at least 3 elements. Delete the second node having price=5.</p>`,
    `<p><strong>void f3()</strong> — Giả sử danh sách có ít nhất 3 phần tử. Xoá node THỨ 2 có price=5.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9) (D,5) (E,3) (F,5) (I,6)\n(C,9) (D,5) (E,3) (I,6)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte. D (1st with price=5) is kept; F (2nd with price=5) is removed.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề. D (thứ 1 có price=5) được giữ; F (thứ 2 có price=5) bị xoá.</p>`),
  B('Correctly finds and removes the 2nd node with price=5.', 'Tìm và xoá đúng node thứ 2 có price=5.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xOwner, int xPrice)</strong> — check if <code>xOwner.charAt(0) == 'B'</code> or <code>xPrice &gt; 100</code> then do nothing, otherwise insert a new car into the tree.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete insert() above only.</p>`,
    `<p><strong>void insert(String xOwner, int xPrice)</strong> — nếu <code>xOwner.charAt(0) == 'B'</code> hoặc <code>xPrice &gt; 100</code> thì không làm gì, ngược lại chèn xe mới vào cây.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện insert() ở trên.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(A,5) (C,2) (E,4) (G,3) (D,6) (F,7)\n(C,2) (G,3) (E,4) (A,5) (D,6) (F,7)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte on both the pre-order AND the given, unmodified inOrder line. Standard recursive BST insert comparing <code>price</code>, skipping owner starting with 'B' OR price &gt; 100; a duplicate price (from "X", price=6, colliding with "D") and an over-100 entry ("Y", price=105) are both naturally excluded.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề ở CẢ dòng pre-order VÀ dòng inOrder given không sửa. Chèn BST đệ quy chuẩn theo <code>price</code>, bỏ qua owner bắt đầu bằng 'B' HOẶC price &gt; 100; price trùng (từ "X", price=6, trùng "D") và mục vượt 100 ("Y", price=105) đều tự động bị loại.</p>`),
  B('Correctly inserts following BST rules keyed by price, skipping owner B, over-100 prices, and duplicate prices.', 'Chèn đúng theo luật BST khoá theo price, bỏ qua owner B, price vượt 100, và price trùng.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform a pre-order traversal from the root, but display to f2.txt only nodes having price in the interval [3,5]. Hint: copy the function preOrder(...) to preOrder2(...) and modify it.</p>`,
    `<p><strong>void f2()</strong> — Duyệt pre-order từ root nhưng chỉ hiển thị ra f2.txt các node có price trong khoảng [3,5]. Gợi ý: sao chép preOrder(...) thành preOrder2(...) rồi sửa.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,6) (D,2) (F,4) (H,3) (I,5) (E,8) (G,7)\n(F,4) (H,3) (I,5)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. <code>preOrder2()</code> performs the same root-left-right recursion as <code>preOrder()</code> but only calls <code>fvisit()</code> when <code>3 &lt;= price &lt;= 5</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. <code>preOrder2()</code> đệ quy gốc-trái-phải giống <code>preOrder()</code> nhưng chỉ gọi <code>fvisit()</code> khi <code>3 &lt;= price &lt;= 5</code>.</p>`),
  B('Correctly performs pre-order traversal displaying only nodes with price in [3,5].', 'Duyệt pre-order đúng, chỉ hiển thị node có price trong [3,5].'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Perform a breadth-first traversal from the root and delete by copying the first node having BOTH 2 sons AND price &lt; 7.</p>`,
    `<p><strong>void f3()</strong> — Duyệt BFS từ root, xoá bằng kỹ thuật xoá-bằng-copy node ĐẦU TIÊN có CẢ 2 con VÀ price &lt; 7.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8) (D,6) (E,9) (F,2) (G,7) (H,1) (I,3) (J,5) (K,4)\n(C,8) (J,5) (E,9) (F,2) (G,7) (H,1) (I,3) (K,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. In BFS order, C has 2 children but price=8 (not &lt;7); D is the first node with both 2 children AND price=6&lt;7 — deleted via standard delete-by-copying (in-order predecessor = J, found by walking right from D's left child F as far as possible).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Theo thứ tự BFS, C có 2 con nhưng price=8 (không &lt;7); D là node đầu tiên có cả 2 con VÀ price=6&lt;7 — bị xoá bằng kỹ thuật xoá-bằng-copy chuẩn (phần tử liền trước = J, tìm bằng cách đi phải từ con trái F của D xa nhất có thể).</p>`),
  B('Correctly identifies the first BFS node with both 2 children and price<7, deleting it by copying.', 'Xác định đúng node BFS đầu tiên có cả 2 con và price<7, xoá đúng bằng kỹ thuật xoá-bằng-copy.'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Perform a breadth-first traversal from the root and find the first node p having a left son AND price &lt; 7. Rotate p to the right about its left son.</p>`,
    `<p><strong>void f4()</strong> — Duyệt BFS từ root, tìm node p ĐẦU TIÊN có con TRÁI VÀ price &lt; 7. Xoay p sang PHẢI quanh con trái của nó.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8) (D,6) (E,9) (F,2) (G,7) (H,1) (I,3) (J,5) (K,4)\n(C,8) (F,2) (E,9) (H,1) (D,6) (I,3) (G,7) (J,5) (K,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 4. p=D (first node with a left son F, price=6&lt;7). <strong>This paper's "rotate ... about its left son" verifiably means a real, standard pointer-based right rotation</strong> (matching the same finding on another CSD201 paper this session, and unlike the shape-preserving data-swap convention seen on several other papers): D's left child F becomes the new subtree root, D becomes F's right child, and F's original right child (I) moves under D as its new left child. A shape-preserving data-swap was tried first and did NOT match the paper's illustrated result; the real rotation reproduces it exactly across all 9 nodes and every BFS level.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4. p=D (node đầu tiên có con trái F, price=6&lt;7). <strong>"rotate ... about its left son" của đề này verify là phép xoay con trỏ THẬT, chuẩn giáo trình</strong> (giống phát hiện ở 1 đề CSD201 khác trong phiên này, khác quy ước đổi-dữ-liệu-giữ-hình-dạng ở vài đề khác): con trái F của D thành gốc cây con mới, D thành con phải của F, con phải cũ (I) của F chuyển xuống làm con trái mới của D. Đã thử đổi dữ liệu giữ hình dạng trước, KHÔNG khớp kết quả minh hoạ của đề; phép xoay thật tái tạo đúng chính xác cả 9 node, mọi tầng BFS.</p>`),
  B('Correctly identifies the first BFS node with a left son and price<7, performing a real pointer-based right rotation.', 'Xác định đúng node BFS đầu tiên có con trái và price<7, thực hiện đúng phép xoay phải con trỏ thật.'),
);

const q3f1 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f1()</strong> — Perform a depth-first traversal (to f1.txt) from vertex i=1 (vertex B), but display only the first 5 vertices. Hint: copy depth(...) to depth2(...) and modify it.</p>`,
    `<p><strong>void f1()</strong> — Duyệt DFS (ra f1.txt) từ đỉnh i=1 (đỉnh B), chỉ hiển thị 5 đỉnh ĐẦU. Gợi ý: sao chép depth(...) thành depth2(...) rồi sửa.</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `B G A E F I C H D\nB G A E F`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. DFS from B reaches B,G,A,E,F,I first (one connected component), then the outer wrapper continues from the unvisited C,H,D; the first 5 vertices of the full order are B,G,A,E,F.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. DFS từ B tới B,G,A,E,F,I trước (1 thành phần liên thông), rồi hàm bọc ngoài tiếp tục từ C,H,D chưa thăm; 5 đỉnh đầu của thứ tự đầy đủ là B,G,A,E,F.</p>`),
  B('Correctly reproduces the DFS-from-B order and prints the first 5 vertices.', 'Tái tạo đúng thứ tự DFS từ B, in đúng 5 đỉnh đầu.'),
);

const q3f2 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f2()</strong> — Supposed the given graph has an Euler's cycle. Apply the pseudocode given in Graph.java (a stack-based algorithm) to find the Euler cycle starting from vertex 1 (B). <strong>Note:</strong> this graph has a multi-edge (D-E appears twice in the weighted matrix) — removing edge (r,Y) means decrementing the remaining edge count by 1, not deleting it entirely, since another parallel edge may still exist.</p>`,
    `<p><strong>void f2()</strong> — Giả sử đồ thị cho có chu trình Euler. Áp dụng thuật giải cho sẵn trong Graph.java (dùng ngăn xếp) để tìm chu trình Euler bắt đầu từ đỉnh 1 (B). <strong>Lưu ý:</strong> đồ thị này có CẠNH BỘI (D-E xuất hiện 2 lần trong ma trận trọng số) — "gỡ cạnh (r,Y)" nghĩa là GIẢM số cạnh còn lại đi 1, không xoá hẳn, vì có thể còn cạnh song song khác.</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `B D E D C B E G F A B`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. Implemented exactly per the given pseudocode (stack S, result array E, always pick the first-by-alphabet adjacent unremoved edge, pop to E when the top is isolated). Independently hand-traced all 21 stack operations before writing Java to confirm the 11-vertex cycle "B D E D C B E G F A B" — note D and E each appear twice, reflecting the double edge between them.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. Cài đặt đúng theo thuật giải cho sẵn (ngăn xếp S, mảng kết quả E, luôn chọn đỉnh kề đầu tiên theo bảng chữ cái chưa gỡ hết cạnh, pop vào E khi đỉnh trên đỉnh ngăn xếp cô lập). Đã tự mô phỏng tay cả 21 bước ngăn xếp trước khi viết Java để xác nhận trước chu trình 11 đỉnh "B D E D C B E G F A B" — lưu ý D và E xuất hiện 2 lần mỗi đỉnh, phản ánh cạnh đôi giữa chúng.</p>`),
  B('Correctly implements the given Euler-cycle stack algorithm, correctly handling the multi-edge between D and E.', 'Cài đúng thuật giải chu trình Euler bằng ngăn xếp cho sẵn, xử lý đúng cạnh bội giữa D và E.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE30-SU22Trial',
    title: 'PE Đề 30 — Practical Exam (SU 2022 - Trial)|||PE Đề 30 — Thi thực hành (SU 2022 - Trial)',
    description: 'CSD201 PE (CODE): linked list + BST (real rotation) + Graph (DFS, Euler cycle via stack), AI-graded, 9 câu 1đ (f4 Câu 1 thiếu nguồn, đã bỏ).|||PE CSD201 (viết mã): danh sách liên kết + BST (xoay cây thật) + Đồ thị (DFS, chu trình Euler bằng ngăn xếp), chấm AI, 9 câu 1đ (f4 Câu 1 thiếu nguồn, đã bỏ).',
    durationMinutes: 90,
    totalPoints: 9,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE30-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q2f1, q2f2, q2f3, q2f4, q3f1, q3f2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
