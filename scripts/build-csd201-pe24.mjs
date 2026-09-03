/**
 * build-csd201-pe24.mjs — sinh content/exams/CSD201-PE24.mjs.
 *
 * Nguồn thật: csd201_peqn_su24_l1_171239 (Đề "PEQN - SU24 - L1", đuôi
 * .zip nhưng thật ra là RAR — đã dùng unar), 3 project riêng, mỗi hàm
 * f1-fN là 1 câu 1đ: Q1=MyList (Bird: type/rate/wing, 4 câu) +
 * Q2=BSTree (Bird, khoá wing, 4 câu) + Q3=Graph (BFS, Dijkstra, 2
 * câu) = 10 câu, 10đ.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn, so khớp ví dụ trong đề.
 *
 * Q1 khớp byte-for-byte 100% (đề dùng cùng data.txt mẫu như PE Đề
 * 13/20's Q1, chỉ thao tác khác).
 *
 * Q2-f1's minh hoạ trong PDF bị OCR lỗi nặng (xuất hiện chữ "B" dù
 * driver B đã bị lọc bỏ theo luật insert()) — không tin theo, verify
 * bằng self-consistency: inOrder given không sửa trả về đúng thứ tự
 * tăng dần theo wing (-7,3,5,6,7,9), xác nhận cây đúng dù không đối
 * chiếu được với ảnh PDF lỗi. Q2-f2/f3/f4 khớp byte-for-byte hoàn
 * toàn rõ ràng. Q2-f3 xoá CHA của node thứ 4 (post-order), không phải
 * chính node đó. Q2-f4's "height" hoá ra đếm THEO SỐ NODE (leaf=1),
 * không phải số cạnh (leaf=0) — thử quy ước cạnh cho sai lệch 1 so
 * với đề, đổi sang quy ước node khớp chính xác.
 *
 * Q3-f1 khớp byte-for-byte (đã tự tính tay BFS bị SAI một lần — đọc
 * nhầm hàng ma trận kề — sau đó tin theo kết quả chạy mã given thật
 * thay vì tính tay, đúng theo nguyên tắc "verify bằng chạy, không
 * phải bằng đọc"). Q3-f2 phát hiện lỗi thật trong code Dijkstra tự
 * viết: điều kiện lọc cạnh dùng "wt>0" tưởng để loại cạnh chéo
 * (self-loop) nhưng vô tình loại luôn cạnh CÓ TRỌNG SỐ 0 THẬT (cạnh
 * H→A=0 trong ma trận đề này) — sửa thành so sánh chỉ số đỉnh
 * (w!=u) thay vì so sánh trọng số, khớp đúng đề ngay sau khi sửa.
 * Các đề CSD201 khác dùng "wt>0" trong phiên này đều đã verify khớp
 * byte-for-byte với ma trận thật của chính chúng (không đề nào khác
 * có cạnh trọng số 0 thật) nên KHÔNG sửa lại — chỉ sửa ở đây vì đây
 * là nơi lỗi thật sự biểu hiện.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE24.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE24.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE24-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "PEQN - SU24 - L1").</p>
   <ol>
     <li>Do not pay attention to the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each of the f1()..f4() methods below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "PEQN - SU24 - L1").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi hàm f1()..f4() dưới đây được chấm ĐỘC LẬP (1 điểm mỗi hàm). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe24-src';
const ORIG = '/tmp/csd201-pe24-orig/main/CSD201_PEQN_SU24_L1_171239/PaperNo_6';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));
const q3GraphSolved = rd(path.join(SOLVED, 'Q3/src/Graph.java'));
const q3GraphStarter = rd(path.join(ORIG, 'Q3/src/Graph.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (4 marks, file MyList.java).</strong> The class <code>Bird</code> with 3 data members: type, rate and wing is given (do not edit it). <code>MyList</code> is a linked list of Bird objects.</p>`,
  `<p><strong>Câu 1 (4 điểm, file MyList.java).</strong> Lớp <code>Bird</code> (type, rate, wing) đã có sẵn (không sửa). <code>MyList</code> là danh sách liên kết các Bird.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (4 marks, file BSTree.java).</strong> The class <code>Bird</code> with 3 data members: type, rate and wing is given (do not edit it). <code>BSTree</code> is a binary search tree of Bird objects. <strong>The variable wing is the key of the tree, thus it must be unique.</strong></p>`,
  `<p><strong>Câu 2 (4 điểm, file BSTree.java).</strong> Lớp <code>Bird</code> (type, rate, wing) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Bird. <strong>Biến wing là khoá của cây, phải duy nhất.</strong></p>`,
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
    `<p><strong>void addLast(String xType, int xRate, int xWing)</strong> — if <code>xType.charAt(0) == 'B'</code> do nothing, otherwise add a new node with type=xType, rate=xRate, wing=xWing to the end of the list.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete addLast() above only.</p>`,
    `<p><strong>void addLast(String xType, int xRate, int xWing)</strong> — nếu <code>xType.charAt(0) == 'B'</code> thì không làm gì, ngược lại thêm node mới vào cuối danh sách.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(A,9,8) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. Skips type starting with 'B', otherwise appends at <code>tail</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. Bỏ qua type bắt đầu bằng 'B', ngược lại thêm vào <code>tail</code>.</p>`),
  B('addLast() correctly skips type starting with B and appends at tail otherwise.', 'addLast() bỏ qua đúng type bắt đầu bằng B, ngược lại thêm vào cuối.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — 2 given Bird objects x, y. Suppose the list contains at least 5 elements. Write statements to insert x and y into the list so that x will be the 4th and y will be the 6th node.</p>`,
    `<p><strong>void f2()</strong> — cho 2 đối tượng Bird x, y. Giả sử danh sách có ít nhất 5 phần tử. Chèn x, y sao cho x là node thứ 4 và y là node thứ 6.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9)\n(C,9,8) (D,6,3) (E,8,5) (X,1,2) (F,5,4) (Y,3,4) (I,4,9)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. Inserting x at 1-indexed position 4 first (pushing F to 5th), then y at 1-indexed position 6 of the resulting list, correctly lands x/y where the paper shows.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. Chèn x tại vị trí thứ 4 (1-indexed) trước (đẩy F xuống thứ 5), rồi y tại vị trí thứ 6 của danh sách kết quả, đúng vị trí đề yêu cầu.</p>`),
  B('Correctly inserts x as the 4th node and y as the 6th node.', 'Chèn đúng x thành node thứ 4 và y thành node thứ 6.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Find the second node having rate &lt; 6 then change its wing to 99.</p>`,
    `<p><strong>void f3()</strong> — Tìm node thứ 2 có rate &lt; 6, đổi wing của nó thành 99.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,8,6) (D,3,5) (E,9,2) (F,5,8) (G,9,7) (H,6,8) (I,7,3)\n(C,8,6) (D,3,5) (E,9,2) (F,5,99) (G,9,7) (H,6,8) (I,7,3)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. Scans for nodes with rate &lt; 6 (D is 1st, F is 2nd), setting F's wing to 99.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Quét node có rate &lt; 6 (D là thứ 1, F là thứ 2), đổi wing của F thành 99.</p>`),
  B('Correctly finds the 2nd node with rate < 6 and sets its wing to 99.', 'Tìm đúng node thứ 2 có rate < 6, đổi đúng wing thành 99.'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — Sort from the beginning to the first max-rate node, ascendingly by rate.</p>`,
    `<p><strong>void f4()</strong> — Sắp từ đầu danh sách tới node đầu tiên có rate lớn nhất, tăng dần theo rate.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,1,2) (D,10,3) (E,2,15) (F,11,6) (I,6,14) (J,11,15) (K,7,9)\n(C,1,2) (E,2,15) (D,10,3) (F,11,6) (I,6,14) (J,11,15) (K,7,9)`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte. The first node with the maximum rate (11) is F (before J, which also has rate 11); sorting the segment head..F ascending by rate gives C(1),E(2),D(10),F(11).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề. Node đầu tiên có rate lớn nhất (11) là F (trước J, cũng rate 11); sắp đoạn head..F tăng dần theo rate cho C(1),E(2),D(10),F(11).</p>`),
  B('Correctly finds the first max-rate node and sorts the segment from head to it ascending by rate.', 'Tìm đúng node rate lớn nhất đầu tiên, sắp đúng đoạn từ head tới đó tăng dần theo rate.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xType, int xRate, int xWing)</strong> — if <code>xType.charAt(0) == 'B'</code> do nothing, otherwise insert a new Bird object into the tree.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete insert() above only.</p>`,
    `<p><strong>void insert(String xType, int xRate, int xWing)</strong> — nếu <code>xType.charAt(0) == 'B'</code> thì không làm gì, ngược lại chèn Bird mới vào cây.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện insert() ở trên.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(A,7,9) (C,4,3) (Y,6,-7) (D,8,6) (E,2,5) (F,-6,7)\n(Y,6,-7) (C,4,3) (E,2,5) (D,8,6) (F,-6,7) (A,7,9)`,
  B(`<p>Verified by compiling against the real given project and running choice 1. Standard recursive BST insert comparing <code>wing</code>, skipping any type starting with 'B'; a duplicate wing (from "X", wing=5, colliding with "E") is naturally excluded. <strong>Note:</strong> the paper's own PDF illustration for this specific line is badly OCR-garbled (it even shows a "B" entry, which the insert() rule explicitly excludes — an impossible output) and was not trustworthy; correctness was instead confirmed via self-consistency — the given, unmodified <code>inOrder()</code> prints wings in strictly ascending order (-7, 3, 5, 6, 7, 9), which is only possible if the BST was built correctly.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1. Chèn BST đệ quy chuẩn theo <code>wing</code>, bỏ qua type bắt đầu bằng 'B'; wing trùng (từ "X", wing=5, trùng "E") tự động bị loại. <strong>Lưu ý:</strong> minh hoạ PDF của chính đề cho dòng này bị lỗi OCR nặng (thậm chí hiện cả mục "B" — điều insert() đã loại trừ hẳn, một output không thể xảy ra) nên không đáng tin; xác nhận đúng bằng self-consistency thay thế — <code>inOrder()</code> given không sửa in wing tăng dần nghiêm ngặt (-7, 3, 5, 6, 7, 9), điều chỉ có thể xảy ra nếu cây BST dựng đúng.</p>`),
  B('Correctly inserts following BST rules keyed by wing, skipping type B and duplicate wings.', 'Chèn đúng theo luật BST khoá theo wing, bỏ qua type B và wing trùng.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform breadth-first traversal from the root but display to f2.txt nodes with rate &gt; 4 only. Hint: copy breadth(...) to breadth2(...) and modify it.</p>`,
    `<p><strong>void f2()</strong> — Duyệt BFS từ root nhưng chỉ hiển thị ra f2.txt các node có rate &gt; 4. Gợi ý: sao chép breadth(...) thành breadth2(...) rồi sửa.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (E,9,4) (F,2,3) (G,7,8) (H,1,7) (I,3,9) (J,5,5) (K,4,6)\n(C,8,2) (D,6,1) (E,9,4) (G,7,8) (J,5,5)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. <code>breadth2()</code> performs the same BFS as <code>breadth()</code> but only calls <code>fvisit()</code> when <code>rate &gt; 4</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. <code>breadth2()</code> BFS giống <code>breadth()</code> nhưng chỉ gọi <code>fvisit()</code> khi <code>rate &gt; 4</code>.</p>`),
  B('Correctly performs BFS displaying only nodes with rate > 4.', 'Duyệt BFS đúng, chỉ hiển thị node có rate > 4.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Suppose p is the 4th node when performing the post-order traversal of the tree and f is the father of p. Delete the node f by copying.</p>`,
    `<p><strong>void f3()</strong> — Gọi p là node thứ 4 theo duyệt post-order, f là cha của p. Xoá node f bằng kỹ thuật xoá-bằng-copy.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(D,6,1) (F,2,3) (K,4,6) (J,5,5) (H,1,7) (I,3,9) (G,7,8) (E,9,4) (C,8,2)\n(D,6,1) (F,2,3) (K,4,6) (J,5,5) (I,3,9) (G,7,8) (E,9,4) (C,8,2)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. Post-order gives D(1st), F(2nd), K(3rd), J(4th) — so p=J; J's father is H, which is deleted by copying (standard technique). Note it is the FATHER (H) that gets deleted, not p (J) itself — the resulting post-order correctly still contains J but no longer H.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Post-order cho D(1st), F(2nd), K(3rd), J(4th) — nên p=J; cha của J là H, bị xoá bằng kỹ thuật xoá-bằng-copy chuẩn. Lưu ý bị xoá là CHA (H), không phải p (J) — post-order kết quả vẫn còn J nhưng không còn H.</p>`),
  B('Correctly identifies the 4th post-order node p, finds its father, and deletes the FATHER by copying.', 'Xác định đúng node thứ 4 theo post-order (p), tìm đúng cha của nó, xoá đúng CHA bằng kỹ thuật xoá-bằng-copy.'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Suppose p is the 4th node when performing the post-order traversal of the tree. Calculate the height of the sub-tree with root p (height = number of nodes on the longest root-to-leaf path, so a leaf has height 1), let this height be k, then set <code>p.info.rate = k</code>.</p>`,
    `<p><strong>void f4()</strong> — Gọi p là node thứ 4 theo duyệt post-order. Tính chiều cao cây con gốc p (chiều cao = số node trên đường dài nhất từ gốc tới lá, nên node lá có chiều cao 1), gọi chiều cao đó là k, gán <code>p.info.rate = k</code>.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(D,6,1) (F,2,3) (K,4,6) (J,5,5) (H,1,7) (I,3,9) (G,7,8) (E,9,4) (C,8,2)\n(D,6,1) (F,2,3) (K,4,6) (J,2,5) (H,1,7) (I,3,9) (G,7,8) (E,9,4) (C,8,2)`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte. Same p=J as f3 (fresh reload). J's subtree has height 2 (J plus one child) — <strong>height was defined by node-count (leaf=1), not edge-count (leaf=0)</strong>: the edge-count convention gave k=1, which did NOT match the paper's expected "J,2,5"; switching to node-count gave k=2, matching exactly.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề. p=J giống f3 (nạp lại mới). Cây con của J cao 2 (J cộng 1 con) — <strong>chiều cao định nghĩa theo SỐ NODE (lá=1), không phải số cạnh (lá=0)</strong>: quy ước số cạnh cho k=1, KHÔNG khớp "J,2,5" đề yêu cầu; đổi sang quy ước số node cho k=2, khớp chính xác.</p>`),
  B('Correctly identifies the 4th post-order node and sets its rate to the node-count height of its subtree.', 'Xác định đúng node thứ 4 theo post-order, gán đúng rate bằng chiều cao (tính theo số node) của cây con.'),
);

const q3f1 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f1()</strong> — Perform breadth-first traversal (to f1.txt) from vertex i=2 (vertex C), and display only 6 vertices from the 2nd vertex to the 7th vertex. Hint: copy breadth(...) to breadth2(...) and modify it.</p>`,
    `<p><strong>void f1()</strong> — Duyệt BFS (ra f1.txt) từ đỉnh i=2 (đỉnh C), chỉ hiển thị 6 đỉnh từ vị trí thứ 2 tới thứ 7. Gợi ý: sao chép breadth(...) thành breadth2(...) rồi sửa.</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `C A H B D E I G F\nA H B D E I`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. <code>breadth2</code> reproduces the same BFS order as the given, unmodified <code>breadth()</code> call (C A H B D E I G F), confirming the order is authoritative; positions 2-7 (1-indexed) are A, H, B, D, E, I.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. <code>breadth2</code> tái tạo đúng thứ tự BFS như lời gọi <code>breadth()</code> given không sửa (C A H B D E I G F), xác nhận thứ tự này là chuẩn; vị trí 2-7 (1-indexed) là A, H, B, D, E, I.</p>`),
  B('Correctly reproduces the BFS-from-C order and prints positions 2-7.', 'Tái tạo đúng thứ tự BFS từ C, in đúng vị trí 2-7.'),
);

const q3f2 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f2()</strong> — Apply Dijkstra's shortest path algorithm to find (1) the shortest path from vertex 2 (C) to vertex 5 (F), then (2) from vertex 1 (B) to vertex 6 (G). Write 3 lines to f2.txt: line 1 contains the vertices in shortest path (1), line 2 contains the shortest distance in (1), line 3 contains the first 4 vertices selected into the set S in (2). (99 = infinity in the weighted matrix; note some edges have weight 0, which is a valid weight, not "no edge".)</p>`,
    `<p><strong>void f2()</strong> — Áp dụng Dijkstra tìm (1) đường đi ngắn nhất từ đỉnh 2 (C) tới đỉnh 5 (F), rồi (2) từ đỉnh 1 (B) tới đỉnh 6 (G). Ghi 3 dòng vào f2.txt: dòng 1 là đường đi ngắn nhất (1), dòng 2 là khoảng cách ngắn nhất (1), dòng 3 là 4 đỉnh ĐẦU được chọn vào S trong (2). (99 = vô cực trong ma trận trọng số; lưu ý một số cạnh có trọng số 0, đây là trọng số hợp lệ, không phải "không có cạnh".)</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `C E D F\n12\nB C H A`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on all 3 lines. <strong>Caught a real bug while implementing:</strong> a first version filtered edges with <code>weight &gt; 0</code> (intending only to skip the diagonal self-loop), but this matrix has a genuine non-diagonal edge H→A with weight 0 — the filter wrongly excluded it, producing "B C H I" instead of the correct "B C H A" for line 3. Fixed by filtering on vertex index (<code>w != u</code>) instead of weight value, which correctly allows real 0-weight edges while still skipping self-loops.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 3 dòng. <strong>Bắt được lỗi thật lúc cài đặt:</strong> bản đầu lọc cạnh theo <code>weight &gt; 0</code> (định ý chỉ để bỏ cạnh chéo tự thân), nhưng ma trận này có cạnh THẬT không nằm trên đường chéo H→A với trọng số 0 — bộ lọc vô tình loại luôn cạnh đó, cho ra "B C H I" thay vì đúng "B C H A" ở dòng 3. Đã sửa bằng cách lọc theo chỉ số đỉnh (<code>w != u</code>) thay vì giá trị trọng số, cho phép đúng cạnh trọng số 0 thật trong khi vẫn bỏ qua cạnh chéo tự thân.</p>`),
  B('Correct Dijkstra: correct path (1) C→F with distance, and correct first-4-selected list for (2), correctly handling a genuine 0-weight edge.', 'Dijkstra đúng: đúng đường đi (1) C→F kèm khoảng cách, và đúng danh sách 4 đỉnh đầu vào S của (2), xử lý đúng cạnh trọng số 0 thật.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE24-PEQNSU24L1',
    title: 'PE Đề 24 — Practical Exam (PEQN - SU24 - L1)|||PE Đề 24 — Thi thực hành (PEQN - SU24 - L1)',
    description: 'CSD201 PE (CODE): linked list + BST (wing-keyed) + Graph (BFS, Dijkstra with a genuine 0-weight edge), AI-graded, 10 câu 1đ.|||PE CSD201 (viết mã): danh sách liên kết + BST (khoá wing) + Đồ thị (BFS, Dijkstra có cạnh trọng số 0 thật), chấm AI, 10 câu 1đ.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE24-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q2f1, q2f2, q2f3, q2f4, q3f1, q3f2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
