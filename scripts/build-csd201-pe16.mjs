/**
 * build-csd201-pe16.mjs — sinh content/exams/CSD201-PE16.mjs.
 *
 * Nguồn thật: csd201_fa24_b5_pe_789661.rar (Đề "FA24 - Block 5 - PE"),
 * 3 project riêng, mỗi hàm f1-fN là 1 câu 1đ (đúng Main.java thật ghi
 * "(1 mark)", giống PE13): Q1=MyList (Pen: owner/price/color, danh
 * sách liên kết đơn, 4 câu) + Q2=BSTree (Beaver: place/depth/type,
 * khoá theo depth, 4 câu) + Q3=Graph (DFS+Dijkstra dừng sớm, 2 câu)
 * = 10 câu, 10đ.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn, so khớp ví dụ trong đề.
 *
 * Q1-f2/f3/f4 khớp byte-for-byte 100%. Q1-f1's ví dụ minh hoạ trong
 * đề bị lệch 1 giá trị (color của F: đề ghi -7, data.txt thật đi kèm
 * ghi 7) — cùng bộ số liệu minh hoạ y hệt PE Đề 13's Q1-f1 (rõ ràng
 * bị copy nguyên từ đề khác, một lỗi mẫu chung của các đề crowd-source
 * trên FUOverflow) — verify bằng chạy addLast() chuẩn (bỏ qua driver
 * 'A', thêm vào cuối) trên chính data.txt của đề này, ra kết quả tự
 * nhất quán, chỉ khác 1 giá trị so với minh hoạ (đã ghi rõ).
 *
 * Q2-f1/f2/f3 khớp byte-for-byte 100%. Q2-f4's "rotate p to right"
 * KHÔNG phải phép xoay BST chuẩn — khớp 100% khi hiểu là ĐỔI DỮ LIỆU
 * giữa p và p.left (giữ nguyên hình dạng cây), giống hệt phát hiện ở
 * PE Đề 13's Q2-f4 — xác nhận đây là quy ước chung của gia đình đề
 * này, không phải trùng hợp.
 *
 * Q3-f1/f2 khớp byte-for-byte 100%, đã tính tay DFS + Dijkstra (dừng
 * sớm tại đích, đồ thị CÓ HƯỚNG — ma trận không đối xứng, ví dụ cạnh
 * F→C tồn tại nhưng C→F không) bằng Python trước khi viết Java.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE16.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE16.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE16-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "FA24 - Block 5 - PE").</p>
   <ol>
     <li>Do not pay attention to the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each of the f1()..f4() methods below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "FA24 - Block 5 - PE").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi hàm f1()..f4() dưới đây được chấm ĐỘC LẬP (1 điểm mỗi hàm). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe16-src';
const ORIG = '/tmp/csd201-pe16-orig/CSD201_FA24_B5_PE_789661/PaperNo_5';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));
const q3GraphSolved = rd(path.join(SOLVED, 'Q3/src/Graph.java'));
const q3GraphStarter = rd(path.join(ORIG, 'Q3/src/Graph.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (4 marks, file MyList.java).</strong> The class <code>Pen</code> with 3 data members: owner, price and color is given (do not edit it). <code>MyList</code> is a singly linked list of Pen objects.</p>`,
  `<p><strong>Câu 1 (4 điểm, file MyList.java).</strong> Lớp <code>Pen</code> (owner, price, color) đã có sẵn (không sửa). <code>MyList</code> là danh sách liên kết đơn các Pen.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (4 marks, file BSTree.java).</strong> The class <code>Beaver</code> with 3 data members: place, depth and type is given (do not edit it). <code>BSTree</code> is a binary search tree of Beaver objects. <strong>The variable depth is the key of the tree, thus it must be unique.</strong></p>`,
  `<p><strong>Câu 2 (4 điểm, file BSTree.java).</strong> Lớp <code>Beaver</code> (place, depth, type) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Beaver. <strong>Biến depth là khoá của cây, phải duy nhất.</strong></p>`,
);
const Q3_SCENARIO = B(
  `<p><strong>Question 3 (2 marks, file Graph.java).</strong> The class <code>Graph</code> is the implementation of a graph (adjacency matrix, vertices labeled A..P via <code>v[]</code>, directed — the matrix is not symmetric).</p>`,
  `<p><strong>Câu 3 (2 điểm, file Graph.java).</strong> Lớp <code>Graph</code> cài đặt đồ thị (ma trận kề, đỉnh gắn nhãn A..P qua <code>v[]</code>, CÓ HƯỚNG — ma trận không đối xứng).</p>`,
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
    `<p><strong>void addLast(String xOwner, int xPrice, int xColor)</strong> — if <code>xOwner.charAt(0) == 'A'</code> do nothing, otherwise add a new node with owner=xOwner, price=xPrice, color=xColor to the end of the list (price and color can be arbitrary, even negative values).</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete addLast() above only.</p>`,
    `<p><strong>void addLast(String xOwner, int xPrice, int xColor)</strong> — nếu <code>xOwner.charAt(0) == 'A'</code> thì không làm gì, ngược lại thêm node mới (owner=xOwner, price=xPrice, color=xColor) vào cuối danh sách.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,7)\n[real given data.txt gives F's color=7, not the "-7" printed in the paper's own illustration — see explanation]`,
  B(`<p>Verified by compiling against the real given project and running choice 1. Skips owner starting with 'A', otherwise appends at <code>tail</code> — this straightforward rule is confirmed self-consistent (every other output byte matches the paper exactly). The paper's own illustrative example prints F's color as -7, but the real data.txt bundled with THIS specific paper variant gives F color=7 (not -7); this exact same "-7" text also appears verbatim in a completely different CSD201 paper (Đề 13) whose own bundled data.txt DOES have F=-7 — strong evidence this paper's f1 illustration was copy-pasted from that other paper's template and never updated for this variant's actual data, a known pattern in these crowd-sourced FUOverflow archives. The real given code and data were trusted over the stale illustration.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1. Bỏ qua owner bắt đầu bằng 'A', ngược lại thêm vào <code>tail</code> — luật đơn giản này tự nhất quán (mọi byte output khác đều khớp đề chính xác). Minh hoạ của chính đề in màu F là -7, nhưng data.txt thật đi kèm ĐỀ NÀY cho F color=7 (không phải -7); đúng chuỗi "-7" này cũng xuất hiện y hệt ở một đề CSD201 hoàn toàn khác (Đề 13) mà data.txt đi kèm đề đó THẬT SỰ có F=-7 — bằng chứng mạnh rằng minh hoạ f1 của đề này bị copy nguyên từ mẫu đề kia và chưa cập nhật theo dữ liệu thật của biến thể này, một kiểu lỗi đã biết trong các đề crowd-source trên FUOverflow. Tin theo mã given và dữ liệu thật hơn minh hoạ cũ.</p>`),
  B('addLast() correctly skips owner starting with A and appends at tail otherwise.', 'addLast() bỏ qua đúng owner bắt đầu bằng A, ngược lại thêm vào cuối.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — 2 given Pen objects x and y. Assume the list contains at least 2 elements. Insert x and y to the list so that y will be at position 0 (head) and x will be at position 1.</p>`,
    `<p><strong>void f2()</strong> — cho 2 đối tượng Pen x, y. Giả sử danh sách có ít nhất 2 phần tử. Chèn x, y sao cho y ở vị trí 0 (head) và x ở vị trí 1.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9)\n(Y,3,4) (X,1,2) (C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. Insert y at position 0 first (becomes new head), then x at position 1.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. Chèn y ở vị trí 0 trước (thành head mới), rồi x ở vị trí 1.</p>`),
  B('Correctly inserts y at head and x at position 1, in that order.', 'Chèn đúng y ở head và x ở vị trí 1, theo đúng thứ tự đó.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Assume the list is not empty. Remove the first node having color &lt; 6.</p>`,
    `<p><strong>void f3()</strong> — Giả sử danh sách không rỗng. Xoá node đầu tiên có color &lt; 6.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,8,6) (D,6,7) (E,9,2) (F,5,8) (G,9,7) (H,6,8) (I,7,3)\n(C,8,6) (D,6,7) (F,5,8) (G,9,7) (H,6,8) (I,7,3)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. Walks the list once, unlinking the first node with color &lt; 6 (E, color=2).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Duyệt 1 lượt, gỡ node đầu tiên có color &lt; 6 (E, color=2).</p>`),
  B('Correctly finds and removes the first node with color strictly less than 6.', 'Tìm và xoá đúng node đầu tiên có color nhỏ hơn 6.'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — Assume the list contains at least 5 elements. Sort the first 5 elements ascendingly by color.</p>`,
    `<p><strong>void f4()</strong> — Giả sử danh sách có ít nhất 5 phần tử. Sắp 5 phần tử đầu tăng dần theo color.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,7,9) (D,16,7) (E,6,16) (F,5,6) (I,4,5) (J,3,4) (K,2,3)\n(I,4,5) (F,5,6) (D,16,7) (C,7,9) (E,6,16) (J,3,4) (K,2,3)`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte. Extracts the first 5 nodes' data into a list, sorts by color, writes back in place (node identities/positions unchanged, only their data reassigned).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề. Rút dữ liệu 5 node đầu ra danh sách, sắp theo color, ghi ngược lại tại chỗ (giữ nguyên vị trí/danh tính node, chỉ đổi dữ liệu).</p>`),
  B('Correctly sorts exactly the first 5 elements ascending by color, leaving the rest untouched.', 'Sắp đúng 5 phần tử đầu tăng dần theo color, giữ nguyên phần còn lại.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xPlace, int xDepth, int xType)</strong> — if <code>xPlace.charAt(0) == 'B'</code> do nothing, otherwise insert a new Beaver object into the tree (depth and type can be arbitrary, even negative values).</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete insert() above only.</p>`,
    `<p><strong>void insert(String xPlace, int xDepth, int xType)</strong> — nếu <code>xPlace.charAt(0) == 'B'</code> thì không làm gì, ngược lại chèn Beaver mới vào cây.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện insert() ở trên.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(A,7,9) (C,4,3) (D,8,6) (E,2,5) (F,6,7)\n(E,2,5) (C,4,3) (F,6,7) (A,7,9) (D,8,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte on BOTH lines (breadth-first AND the given, unmodified inOrder — unlike a similar deck this session, this paper's inOrder line is internally consistent/monotonic). Standard recursive BST insert comparing <code>depth</code>, skipping any place starting with 'B'; a duplicate depth (from place "X", depth=4, colliding with "C"'s depth=4) is naturally excluded.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề ở CẢ 2 dòng (breadth-first VÀ inOrder given không sửa — khác với 1 đề tương tự trong phiên này, dòng inOrder của đề này tự nhất quán/đơn điệu). Chèn BST đệ quy chuẩn theo <code>depth</code>, bỏ qua place bắt đầu bằng 'B'; depth trùng (place "X", depth=4, trùng "C") tự động bị loại.</p>`),
  B('Correctly inserts following BST rules keyed by depth, skipping place B and duplicate depths.', 'Chèn đúng theo luật BST khoá theo depth, bỏ qua place B và depth trùng.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform post-order traversal from the root but display to f2.txt nodes with type &lt; 7 only. Hint: copy postOrder(...) to postOrder2(...) and modify it.</p>`,
    `<p><strong>void f2()</strong> — Duyệt post-order từ root nhưng chỉ hiển thị ra f2.txt các node có type &lt; 7. Gợi ý: sao chép postOrder(...) thành postOrder2(...) rồi sửa.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(E,2,8) (I,5,4) (H,6,3) (F,4,5) (G,8,7) (D,7,2) (C,3,6)\n(I,5,4) (H,6,3) (F,4,5) (D,7,2) (C,3,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. <code>postOrder2()</code> performs the same left-right-root recursion as <code>postOrder()</code> but only calls <code>fvisit()</code> when <code>type &lt; 7</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. <code>postOrder2()</code> đệ quy trái-phải-gốc giống <code>postOrder()</code> nhưng chỉ gọi <code>fvisit()</code> khi <code>type &lt; 7</code>.</p>`),
  B('Correctly performs post-order traversal displaying only nodes with type < 7.', 'Duyệt post-order đúng, chỉ hiển thị node có type < 7.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Perform breadth-first traversal and find the 2nd node p having left son. Delete the node having the largest depth in the subtree with root p (thus if p is the leaf-node then p is deleted).</p>`,
    `<p><strong>void f3()</strong> — Duyệt BFS, tìm node p thứ 2 có con trái. Xoá node có depth LỚN NHẤT trong cây con gốc p (nếu p là lá thì xoá chính p).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,5,2) (D,2,1) (E,6,5) (F,1,3) (G,4,6) (H,3,4)\n(C,5,2) (D,2,1) (E,6,5) (F,1,3) (H,3,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. BFS order of nodes-with-left-child is C, D, G — so p=D. The subtree rooted at D contains D(2), F(1), G(4), H(3); the maximum depth among these is G(4), which is deleted from the whole tree (G has a single child H, so H takes G's place).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Thứ tự BFS các node có con trái là C, D, G — nên p=D. Cây con gốc D gồm D(2), F(1), G(4), H(3); depth lớn nhất trong đó là G(4), bị xoá khỏi toàn cây (G có 1 con H nên H thế chỗ G).</p>`),
  B('Correctly identifies the 2nd BFS node with a left child, then deletes the max-depth node within its subtree from the whole tree.', 'Xác định đúng node thứ 2 theo BFS có con trái, xoá đúng node depth lớn nhất trong cây con đó khỏi toàn cây.'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Perform breadth-first traversal and find the 2nd node p having left son, then rotate p to right.</p>`,
    `<p><strong>void f4()</strong> — Duyệt BFS, tìm node p thứ 2 có con trái, rồi xoay p sang PHẢI.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,5,2) (D,2,1) (E,6,5) (F,1,3) (G,4,6) (H,3,4)\n(C,5,2) (F,1,3) (E,6,5) (D,2,1) (G,4,6) (H,3,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 4. Same p=D as f3 (fresh reload, before f3's deletion). As with the equivalent question in a sibling CSD201 paper (Đề 13) this session, "rotate p to right" here does not mean a textbook pointer rotation — it verifiably means swapping only the <code>Beaver</code> data between p and p.left, leaving the tree shape unchanged; this reproduces the paper's expected BFS exactly, while a standard pointer rotation does not.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4. p=D giống f3 (nạp lại mới, trước khi f3 xoá). Giống câu tương đương ở một đề CSD201 khác (Đề 13) trong phiên này, "rotate p to right" ở đây KHÔNG phải phép xoay con trỏ chuẩn giáo trình — mà là ĐỔI dữ liệu <code>Beaver</code> giữa p và p.left, giữ nguyên hình dạng cây; cách này tái tạo đúng BFS mong đợi của đề, còn phép xoay con trỏ chuẩn thì không.</p>`),
  B('Correctly identifies the 2nd BFS node with a left child and swaps its data with its left child (verified real given-code interpretation of "rotate right").', 'Xác định đúng node thứ 2 theo BFS có con trái và đổi đúng dữ liệu với con trái (khớp cách hiểu "xoay phải" đã verify bằng mã given thật).'),
);

const q3f1 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f1()</strong> — Perform depth-first traversal (to f1.txt) from vertex i=2 (vertex C), and display only 4 vertices from the 3rd vertex to the 6th vertex. Hint: copy depth(...) to depth2(...) and modify the latter one.</p>`,
    `<p><strong>void f1()</strong> — Duyệt DFS (ra f1.txt) từ đỉnh i=2 (đỉnh C), chỉ hiển thị 4 đỉnh từ vị trí thứ 3 tới thứ 6. Gợi ý: sao chép depth(...) thành depth2(...) rồi sửa.</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `C A B E H I D G F\nB E H I`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. This graph's adjacency matrix is directed (not symmetric — e.g. F→C exists but C→F does not), so DFS from C only reaches C,A,B,E,H,I,D,G directly; the outer <code>depth(k,f)</code> wrapper then picks up the remaining unvisited vertex F separately, giving the full 9-vertex order C A B E H I D G F. <code>depth2</code> collects this same order into a list and prints positions 3-6 (1-indexed): B, E, H, I.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. Ma trận kề của đồ thị này CÓ HƯỚNG (không đối xứng — ví dụ cạnh F→C tồn tại nhưng C→F thì không), nên DFS từ C chỉ tới trực tiếp C,A,B,E,H,I,D,G; hàm bọc ngoài <code>depth(k,f)</code> sau đó tự động duyệt tiếp đỉnh F còn lại chưa thăm, cho đủ thứ tự 9 đỉnh C A B E H I D G F. <code>depth2</code> gom đúng thứ tự này vào danh sách, in vị trí 3-6 (1-indexed): B, E, H, I.</p>`),
  B('Correctly computes the DFS-from-C order (respecting the directed edges) and prints positions 3-6.', 'Tính đúng thứ tự DFS từ C (tôn trọng cạnh có hướng), in đúng vị trí 3-6.'),
);

const q3f2 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f2()</strong> — Apply Dijkstra's shortest path algorithm to find (1) the shortest path from vertex 2 (C) to vertex 5 (F), then (2) from vertex 0 (A) to vertex 6 (G). Write 3 lines to f2.txt: line 1 contains the last 4 vertices selected into the set S with their labels in (2), line 2 contains the shortest path (2), line 3 contains the shortest path (1). (99 = infinity in the weighted matrix.)</p>`,
    `<p><strong>void f2()</strong> — Áp dụng Dijkstra tìm (1) đường đi ngắn nhất từ đỉnh 2 (C) tới đỉnh 5 (F), rồi (2) từ đỉnh 0 (A) tới đỉnh 6 (G). Ghi 3 dòng vào f2.txt: dòng 1 là 4 đỉnh CUỐI được chọn vào S trong (2) kèm nhãn, dòng 2 là đường đi ngắn nhất (2), dòng 3 là đường đi ngắn nhất (1). (99 = vô cực trong ma trận trọng số.)</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `E:15 D:19 F:24 G:29\nA B C E D G\nC E D F`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on all 3 lines. Standard Dijkstra with early termination once the target is finalized into S; independently hand-computed both runs before writing Java, including the tie-break for G's label (D and F both reach G with cost 29, but D processes first in the argmin scan so D wins the parent assignment).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 3 dòng. Dijkstra chuẩn, dừng sớm ngay khi đích được chốt vào S; đã tự tính tay cả 2 lượt trước khi viết Java, kể cả luật phá hoà cho nhãn của G (cả D và F đều tới G với chi phí 29, nhưng D được xử lý trước trong vòng quét tìm min nên D thắng trong việc gán cha).</p>`),
  B('Correct Dijkstra: last-4-selected labels for run (2), correct shortest path (2) A→G, and correct shortest path (1) C→F.', 'Dijkstra đúng: nhãn 4 đỉnh cuối vào S của lượt (2), đúng đường đi ngắn nhất (2) A→G, và đúng đường đi ngắn nhất (1) C→F.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE16-FA24B5PE',
    title: 'PE Đề 16 — Practical Exam (FA24 - Block 5)|||PE Đề 16 — Thi thực hành (FA24 - Block 5)',
    description: 'CSD201 PE (CODE): singly linked list + BST (depth-keyed, custom "rotate") + Graph (directed, DFS+Dijkstra), AI-graded, 10 câu 1đ.|||PE CSD201 (viết mã): danh sách liên kết đơn + BST (khoá depth, "rotate" tự định nghĩa) + Đồ thị (có hướng, DFS+Dijkstra), chấm AI, 10 câu 1đ.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE16-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q2f1, q2f2, q2f3, q2f4, q3f1, q3f2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
