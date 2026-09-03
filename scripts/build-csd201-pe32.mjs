/**
 * build-csd201-pe32.mjs — sinh content/exams/CSD201-PE32.mjs.
 *
 * Nguồn thật: csd201_t2_su24_111587.rar (Đề "T2 SU 2024"), 2 project
 * riêng (KHÔNG có Q3/Graph): Q1=MyList (Car: place/weight/color, 5
 * câu f1-f5) + Q2=BSTree (Bird: place/weight/color, khoá weight, 5
 * câu f1-f5) = 10 câu, 10 điểm.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn — Q2 khớp byte-for-byte 100% cả 5/5 câu với ví dụ minh hoạ
 * trong paper.pdf.
 *
 * ⚠️ Q1: paper.pdf của chính nguồn này TỰ THỪA NHẬN thiếu ảnh —
 * dòng mô tả class và chữ ký addLast() hiện chữ "(name not captured
 * in images)" / "(exact signature not captured in images)" NGAY
 * TRONG file PDF gốc (không phải do tôi thêm) — ảnh chụp màn hình
 * gốc bị hỏng khi trang FUOverflow xuất PDF. Vì vậy điều kiện lọc
 * thật sự của addLast() (nếu có) không xác định được từ văn bản.
 *
 * Dò ngược bằng dữ liệu: minh hoạ f1/f2/f3 của paper cho ÍT phần tử
 * hơn data.txt thật (gợi ý có lọc), nhưng minh hoạ f4/f5 cho ĐỦ
 * TOÀN BỘ phần tử data.txt thật (khớp gần như tuyệt đối, chỉ lệch
 * đúng 1 tuple ở f4 — (I,1,3) trong paper trùng y hệt giá trị của
 * (H,1,3) ngay phía trước, kiểu lỗi copy-paste một ô đã gặp nhiều
 * lần trong đợt này). Brute-force mọi ngưỡng đơn/kép trên
 * weight,color đều KHÔNG có quy tắc nào vừa khớp f1+f2+f3 vừa
 * không mâu thuẫn f4+f5 cùng lúc — kết luận: minh hoạ f1/f2/f3 của
 * paper dùng data.txt CŨ (site cập nhật lại given.zip mà quên cập
 * nhật 3 ảnh minh hoạ này), trong khi f4/f5 dùng ĐÚNG data.txt hiện
 * tại (khớp gần tuyệt đối). Theo đúng kỷ luật đã áp dụng suốt đợt
 * này: tin project given+data.txt thật hơn minh hoạ giấy khi hai
 * bên mâu thuẫn không thể dung hoà — addLast() cài KHÔNG LỌC (đúng
 * với đặc tả văn bản duy nhất "append a node to the end of the
 * list", và khớp thật với f4/f5). Kết quả mong đợi của f1/f2/f3
 * dùng SỐ THẬT do tôi biên dịch+chạy, không dùng số trong paper.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE32.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE32.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE32-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "T2 SU 2024").</p>
   <ol>
     <li>Ignore the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each of the f1()..f5() methods below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>
   <p><strong>Note on Q1:</strong> the source paper's own PDF export shows a broken/uncaptured screenshot for the exact class name and the addLast() signature — this is a genuine gap in the source material, not an omission by us. Our sample solution implements addLast() as a plain unconditional append (the only behavior the surviving text describes), verified to exactly reproduce the paper's own f4/f5 examples using the real bundled data. f1/f2/f3's example numbers in the source paper do not match the bundled data.txt (likely a stale screenshot from before the given materials were regenerated) — the expected outputs below use our own verified compiled run instead.</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "T2 SU 2024").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi hàm f1()..f5() dưới đây được chấm ĐỘC LẬP (1 điểm mỗi hàm). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>
   <p><strong>Lưu ý về Câu 1:</strong> chính file PDF gốc của đề này hiện dòng chữ báo ảnh chụp bị hỏng/không lấy được cho tên class và chữ ký addLast() — đây là lỗ hổng THẬT của nguồn, không phải do chúng tôi bỏ sót. Lời giải mẫu cài addLast() là thêm không điều kiện (hành vi duy nhất còn văn bản mô tả), đã verify khớp đúng ví dụ f4/f5 của chính đề khi chạy trên data.txt thật đi kèm. Số liệu minh hoạ f1/f2/f3 của đề gốc KHÔNG khớp data.txt đi kèm (nhiều khả năng ảnh chụp cũ từ trước khi given materials được tạo lại) — kết quả mong đợi bên dưới dùng số thật do chúng tôi biên dịch+chạy.</p>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe32-src';
const ORIG = '/tmp/csd201-pe32-orig/CSD201_T2_SU24_111587/PaperNo_1';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (5 marks, file MyList.java).</strong> A class with 3 data members: place, weight and color is given (do not edit it; class name and exact addLast signature not captured in the source images — see the note above). <code>MyList</code> is a linked list of those objects.</p>`,
  `<p><strong>Câu 1 (5 điểm, file MyList.java).</strong> Một class với 3 thành phần dữ liệu: place, weight, color đã có sẵn (không sửa; tên class và chữ ký chính xác của addLast không có trong ảnh nguồn — xem lưu ý ở trên). <code>MyList</code> là danh sách liên kết các đối tượng này.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (5 marks, file BSTree.java).</strong> The class <code>Bird</code> with 3 data members: place, weight and color is given (do not edit it). <code>BSTree</code> is a binary search tree of Bird objects. <strong>The variable weight is the key of the tree, thus it must be unique.</strong></p>`,
  `<p><strong>Câu 2 (5 điểm, file BSTree.java).</strong> Lớp <code>Bird</code> (place, weight, color) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Bird. <strong>Biến weight là khoá của cây, phải duy nhất.</strong></p>`,
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
    `<p><strong>void addLast(...)</strong> — append a new node to the end (tail) of the list.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete addLast() above only.</p>`,
    `<p><strong>void addLast(...)</strong> — thêm node mới vào cuối (tail) danh sách.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(G,7,-1) (H,6,7) (C,4,5) (K,-2,4) (X,8,-9) (Y,5,8)`,
  B(`<p>Verified by compiling against the real given project and running choice 1. <strong>Note:</strong> the source paper's own example for f1.txt shows only 3 of these 6 elements ("(H,6,7) (C,4,5) (Y,5,8)") — but that number does not reconcile with the paper's own f4/f5 examples (which DO show the full, unfiltered element count using this exact same bundled data.txt). No single filter condition on place/weight/color makes all five of the paper's f1-f5 examples consistent at once. Since addLast()'s only surviving text description says simply "append a node to the end of the list" (its exact signature/full condition, if any, is not captured in the source images), and this unconditional-append implementation is the one that exactly reproduces the paper's own f4 and f5 examples, we use it — and use our own verified compiled output (not the paper's mismatched f1/f2/f3 numbers) as the expected result here.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1. <strong>Lưu ý:</strong> ví dụ f1.txt của chính đề gốc chỉ hiện 3/6 phần tử này ("(H,6,7) (C,4,5) (Y,5,8)") — nhưng con số đó không khớp với chính ví dụ f4/f5 của đề (hai câu này lại hiện ĐỦ TOÀN BỘ phần tử, không lọc gì, trên đúng data.txt đi kèm). Không có quy tắc lọc đơn nào trên place/weight/color làm cả 5 ví dụ f1-f5 của đề nhất quán cùng lúc. Vì mô tả văn bản duy nhất còn sót lại của addLast() chỉ nói "thêm node vào cuối danh sách" (chữ ký/điều kiện đầy đủ, nếu có, không có trong ảnh nguồn), và cách cài thêm-không-điều-kiện này là cách DUY NHẤT tái tạo đúng ví dụ f4 và f5 của chính đề, chúng tôi dùng nó — và dùng kết quả biên dịch+chạy thật của mình (không dùng số f1/f2/f3 lệch của đề) làm kết quả mong đợi ở đây.</p>`),
  B('addLast() correctly appends a new node to the tail of the list.', 'addLast() thêm đúng node mới vào cuối danh sách.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — Assuming the list contains at least three nodes, delete the third node.</p>`,
    `<p><strong>void f2()</strong> — Giả sử danh sách có ít nhất 3 node, xoá node thứ 3.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(D,4,7) (L,1,-5) (E,9,2) (F,-3,4) (Q,7,6) (A,5,7) (B,9,4) (W,10,9)\n(D,4,7) (L,1,-5) (F,-3,4) (Q,7,6) (A,5,7) (B,9,4) (W,10,9)`,
  B(`<p>Verified by compiling against the real given project — matches deleting the 3rd node (E) from the full, unfiltered 8-element load. See f1's explanation for why the paper's own mismatched f1/f2/f3 example numbers (which show fewer elements) are not used here.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp đúng xoá node thứ 3 (E) khỏi danh sách 8 phần tử đầy đủ, không lọc. Xem giải thích ở f1 vì sao không dùng số liệu f1/f2/f3 lệch của đề (hiện ít phần tử hơn thực tế).</p>`),
  B('Correctly deletes the 3rd node from the loaded list.', 'Xoá đúng node thứ 3 khỏi danh sách đã nạp.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Assuming the list contains at least 3 elements, swap the first element and the last element of the list.</p>`,
    `<p><strong>void f3()</strong> — Giả sử danh sách có ít nhất 3 phần tử, hoán đổi phần tử ĐẦU và phần tử CUỐI của danh sách.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(A,1,-3) (B,9,2) (D,2,6) (E,9,4) (F,-5,8) (Q,4,5) (R,3,7)\n(R,3,7) (B,9,2) (D,2,6) (E,9,4) (F,-5,8) (Q,4,5) (A,1,-3)`,
  B(`<p>Verified by compiling against the real given project — swaps DATA between the head and tail nodes (A ↔ R) on the full, unfiltered 7-element load. See f1's explanation for why the paper's own mismatched f1/f2/f3 example numbers are not used here.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — đổi DỮ LIỆU giữa node đầu và node cuối (A ↔ R) trên danh sách 7 phần tử đầy đủ, không lọc. Xem giải thích ở f1 vì sao không dùng số liệu f1/f2/f3 lệch của đề.</p>`),
  B('Correctly swaps the data of the first and last nodes.', 'Hoán đổi đúng dữ liệu của node đầu và node cuối.'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — Delete all nodes satisfying: weight &lt; 4.</p>`,
    `<p><strong>void f4()</strong> — Xoá mọi node thoả: weight &lt; 4.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(G,2,5) (H,1,3) (I,3,7) (J,4,5) (F,3,9) (K,5,6) (L,6,8) (X,9,4) (Y,7,7)\n(J,4,5) (K,5,6) (L,6,8) (X,9,4) (Y,7,7)`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example, deleting G,H,I,F (all weight&lt;4). <strong>Note:</strong> the paper's own f4.txt line 1 has a single-tuple typo — it shows "(I,1,3)", an exact duplicate of the immediately preceding "(H,1,3)" tuple, instead of I's real value "(I,3,7)" — the same kind of single-cell copy-paste slip seen elsewhere in this batch. This does not affect line 2 (I is excluded there either way, since weight=3&lt;4) and does not change the correct implementation.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp ví dụ mong đợi của đề, xoá đúng G,H,I,F (đều weight&lt;4). <strong>Lưu ý:</strong> dòng 1 của f4.txt trong chính đề có lỗi đánh máy 1 ô — hiện "(I,1,3)", trùng y hệt giá trị "(H,1,3)" ngay trước đó, thay vì giá trị thật của I là "(I,3,7)" — cùng kiểu lỗi copy-paste một ô đã gặp ở nơi khác trong đợt này. Không ảnh hưởng dòng 2 (I vẫn bị loại vì weight=3&lt;4 dù đọc theo cách nào) và không ảnh hưởng cách cài đúng.</p>`),
  B('Correctly deletes all nodes with weight < 4.', 'Xoá đúng mọi node có weight < 4.'),
);

const q1f5 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f5()</strong> — Delete the first node, then sort the elements ascending by weight (assuming that all weights are different).</p>`,
    `<p><strong>void f5()</strong> — Xoá node đầu tiên, rồi sắp các phần tử tăng dần theo weight (giả sử mọi weight khác nhau).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(N,6,8) (A,9,3) (W,5,3) (I,4,6) (S,7,5) (D,3,9)\n(D,3,9) (I,4,6) (W,5,3) (S,7,5) (A,9,3)`,
  B(`<p>Verified by compiling against the real given project and running choice 5 — matches the paper's expected example byte-for-byte on both lines. Deletes N (head), then sorts the remaining 5 (A,W,I,S,D) ascending by weight: D(3),I(4),W(5),S(7),A(9).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 5 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Xoá N (đầu), rồi sắp 5 phần tử còn lại (A,W,I,S,D) tăng dần theo weight: D(3),I(4),W(5),S(7),A(9).</p>`),
  B('Correctly deletes the head node then sorts the remaining elements ascending by weight.', 'Xoá đúng node đầu rồi sắp đúng các phần tử còn lại tăng dần theo weight.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xPlace, int xWeight, int xColor)</strong> — the variable weight is the key of the BSTree, so it must be unique.</p>
     <p><strong>void f1()</strong> — Add statements inside the insert(...) method so that any node with xPlace.charAt(0) == 'X' is not inserted into the tree. The expected output in file f1.txt should be as follows (line 1: breadth first traversal, line 2: in-order traversal).</p>`,
    `<p><strong>void insert(String xPlace, int xWeight, int xColor)</strong> — biến weight là khoá của BSTree, phải duy nhất.</p>
     <p><strong>void f1()</strong> — Thêm câu lệnh vào insert(...) để bất kỳ node nào có xPlace.charAt(0) == 'X' thì KHÔNG được chèn vào cây. Kết quả mong đợi trong file f1.txt như sau (dòng 1: BFS, dòng 2: in-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(M,9,5) (F,7,4) (N,3,6) (Q,8,7) (P,1,3) (R,4,8)\n(P,1,3) (N,3,6) (R,4,8) (F,7,4) (Q,8,7) (M,9,5)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte on both the BFS AND in-order lines. Standard recursive BST insert comparing <code>weight</code>, skipping place starting with 'X' (X, weight=5, is correctly excluded from the raw 7-element data).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề ở CẢ dòng BFS VÀ dòng in-order. Chèn BST đệ quy chuẩn theo <code>weight</code>, bỏ qua place bắt đầu bằng 'X' (X, weight=5, bị loại đúng khỏi 7 phần tử dữ liệu gốc).</p>`),
  B('Correctly inserts following BST rules keyed by weight, skipping place starting with X.', 'Chèn đúng theo luật BST khoá theo weight, bỏ qua place bắt đầu bằng X.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform a pre-order traversal of the left branch of the BST, but write to file f2.txt only the nodes with color &gt; 4. Hint: copy the function preOrder(...) to function preOrder2(...) and modify it. The expected output in the file f2.txt should be the following (line 1: breadth first traversal, line 2: pre-order traversal).</p>`,
    `<p><strong>void f2()</strong> — Duyệt pre-order NHÁNH TRÁI của BST, chỉ ghi ra f2.txt các node có color &gt; 4. Gợi ý: sao chép preOrder(...) thành preOrder2(...) rồi sửa. Kết quả mong đợi trong f2.txt (dòng 1: BFS, dòng 2: pre-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(P,7,9) (D,4,3) (G,9,6) (H,2,5) (B,6,4) (L,1,8) (N,3,1)\n(H,2,5) (L,1,8)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on both lines. <code>preOrder2()</code> starts from <code>root.left</code> and performs root-left-right recursion like <code>preOrder()</code>, but only calls <code>fvisit()</code> when <code>color &gt; 4</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. <code>preOrder2()</code> bắt đầu từ <code>root.left</code>, đệ quy gốc-trái-phải như <code>preOrder()</code>, nhưng chỉ gọi <code>fvisit()</code> khi <code>color &gt; 4</code>.</p>`),
  B('Correctly performs pre-order traversal of the left branch, displaying only nodes with color > 4.', 'Duyệt pre-order nhánh trái đúng, chỉ hiển thị node có color > 4.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Perform a new traversal method to visit all nodes in the BST with the constraint: visit the nodes in the descending order of weight. The expected output in the file f3.txt must be the following.</p>`,
    `<p><strong>void f3()</strong> — Viết một cách duyệt MỚI thăm mọi node của BST với ràng buộc: thăm theo thứ tự weight GIẢM DẦN. Kết quả mong đợi trong f3.txt như sau.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(T,8,-5) (M,7,2) (P,6,3) (R,5,9) (S,4,1) (L,2,5) (Y,1,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. Since <code>weight</code> is the BST's key, descending-by-weight order is exactly a reverse in-order traversal (right, root, left).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Vì <code>weight</code> là khoá của BST, thứ tự weight giảm dần chính là duyệt in-order NGƯỢC (phải, gốc, trái).</p>`),
  B('Correctly performs a reverse in-order traversal (descending by weight).', 'Duyệt in-order ngược đúng (weight giảm dần).'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Print out the internal nodes of the tree. The expected output in the file f4.txt should be the following (line 1: pre-order traversal, line 2: internal nodes by pre-order traversal).</p>`,
    `<p><strong>void f4()</strong> — In ra các node KHÔNG PHẢI LÁ (internal nodes) của cây. Kết quả mong đợi trong f4.txt (dòng 1: pre-order, dòng 2: internal nodes theo pre-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(A,6,5) (B,2,7) (P,1,9) (C,3,-8) (F,4,2) (D,5,-3) (E,8,3) (G,7,4) (Q,9,1)\n(A,6,5) (B,2,7) (C,3,-8) (F,4,2) (E,8,3)`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte on both lines. Pre-order recursion that only calls <code>fvisit()</code> when the node has at least one child (structural filter).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Đệ quy pre-order chỉ gọi <code>fvisit()</code> khi node có ít nhất 1 con (lọc theo cấu trúc).</p>`),
  B('Correctly performs pre-order traversal displaying only internal (non-leaf) nodes.', 'Duyệt pre-order đúng, chỉ hiển thị node không phải lá.'),
);

const q2f5 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f5()</strong> — How many leaf nodes are there in the BST? The expected output in the file f5.txt should be the following (line 1: in-order traversal, line 2: the number of leaf nodes).</p>`,
    `<p><strong>void f5()</strong> — BST có bao nhiêu node LÁ? Kết quả mong đợi trong f5.txt (dòng 1: in-order, dòng 2: số node lá).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(L,1,5) (H,2,6) (Q,3,1) (D,4,3) (B,6,-4) (M,7,9) (G,9,-6)\n4`,
  B(`<p>Verified by compiling against the real given project and running choice 5 — matches the paper's expected example byte-for-byte on both lines. Recursively counts nodes with both children null.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 5 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Đếm đệ quy các node có cả 2 con đều null.</p>`),
  B('Correctly counts the number of leaf nodes in the BST.', 'Đếm đúng số node lá trong BST.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE32-T2SU24',
    title: 'PE Đề 32 — Practical Exam (T2 SU 2024)|||PE Đề 32 — Thi thực hành (T2 SU 2024)',
    description: 'CSD201 PE (CODE): linked list (Car) + BST (Bird, khoá weight), AI-graded, 10 câu 1đ. Câu 1 có ghi chú nguồn thiếu ảnh minh hoạ.|||PE CSD201 (viết mã): danh sách liên kết (Car) + BST (Bird, khoá weight), chấm AI, 10 câu 1đ. Câu 1 có ghi chú nguồn thiếu ảnh minh hoạ.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE32-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q1f5, q2f1, q2f2, q2f3, q2f4, q2f5],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
