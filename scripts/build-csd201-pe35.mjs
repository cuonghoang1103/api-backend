/**
 * build-csd201-pe35.mjs — sinh content/exams/CSD201-PE35.mjs.
 *
 * Nguồn thật: paperno_1.rar (Đề "PE SP 2024 Đề số 1"), 2 project
 * (KHÔNG có Q3/Graph): Q1=MyList (Bike: place/weight/color, weight
 * phải >0, 5 câu) + Q2=BSTree (thực chất class Bird dù paper gọi
 * "Cat" — khoá weight, convention CHUẨN) = 9 câu, 9 điểm (Q2-f5 BỎ
 * do thiếu nguồn — xem dưới).
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn — TOÀN BỘ 9/9 câu còn lại khớp byte-for-byte 100% với ví dụ
 * trong đề.
 *
 * ⚠️ Q2-f5 BỊ BỎ HẲN: paper.pdf tự ghi "(content not fully captured
 * in images)" cho toàn bộ mô tả câu này — không có văn bản yêu cầu
 * nào sót lại để biết thao tác cần làm. solution.rar (bài giải của
 * 1 học viên khác) cũng để TRỐNG thân hàm f5() giữa 2 marker comment
 * — không giúp được. Theo đúng kỷ luật đã áp dụng ở Đề 30 (bỏ câu
 * thiếu nguồn thay vì bịa): loadData(17) vẫn tồn tại (còn 1 block
 * data.txt dành cho câu này) nhưng không dùng được vì không biết
 * thao tác — bỏ hẳn câu, đề còn 9 câu/9 điểm.
 *
 * ⚠️ Tên class: paper.pdf gọi là "Cat" nhưng file .java thật trong
 * given.zip là Bird.java (paper.pdf lại 1 lần nữa không khớp code
 * thật — không ảnh hưởng hành vi, chỉ là tên hiển thị trong văn bản
 * mô tả câu hỏi, đã ghi đúng "Bird" trong exam room).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE35.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE35.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE35-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "PE SP 2024, Đề số 1").</p>
   <ol>
     <li>Ignore the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each of the f1()..f4()/f5() methods below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>
   <p><strong>Note:</strong> this exam is worth 9 marks, not 10. The source paper's own PDF export admits it lost the description for Q2's f5() ("content not fully captured in images"), and the leaked partial solution for this paper also leaves that method's body empty — there is no surviving requirement text to reconstruct it from, so it is omitted here rather than guessed.</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "PE SP 2024, Đề số 1").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi hàm f1()..f4()/f5() dưới đây được chấm ĐỘC LẬP (1 điểm mỗi hàm). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>
   <p><strong>Lưu ý:</strong> đề này chỉ 9 điểm, không phải 10. File PDF gốc của đề tự thừa nhận mất mô tả câu f5() của Q2 ("content not fully captured in images"), và bài giải rò rỉ của đề này cũng để trống thân hàm đó — không còn văn bản yêu cầu nào để dựng lại, nên bỏ hẳn câu này thay vì đoán.</p>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe35-src';
const ORIG = '/tmp/csd201-pe35-orig/PaperNo_1';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (5 marks, file MyList.java).</strong> The class <code>Bike</code> with 3 data members: place, weight and color is given (do not edit it). <strong>Note that the value of weight must be bigger than 0.</strong> <code>MyList</code> is a linked list of Bike objects.</p>`,
  `<p><strong>Câu 1 (5 điểm, file MyList.java).</strong> Lớp <code>Bike</code> (place, weight, color) đã có sẵn (không sửa). <strong>weight phải LỚN HƠN 0.</strong> <code>MyList</code> là danh sách liên kết các Bike.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (4 marks, file BSTree.java).</strong> The class <code>Bird</code> with 3 data members: place, weight and color is given (do not edit it). <code>BSTree</code> is a binary search tree of Bird objects. <strong>The variable weight is the key of the BSTree, so it must be unique.</strong></p>`,
  `<p><strong>Câu 2 (4 điểm, file BSTree.java).</strong> Lớp <code>Bird</code> (place, weight, color) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Bird. <strong>Biến weight là khoá của cây, phải duy nhất.</strong></p>`,
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
    `<p><strong>void addLast(String xPlace, int xWeight, int xColor)</strong> — note that the value of xWeight must be bigger than 0.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete only the addLast(...) method above.</p>`,
    `<p><strong>void addLast(String xPlace, int xWeight, int xColor)</strong> — lưu ý xWeight phải lớn hơn 0.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(G,7,-1) (H,6,7) (C,4,5) (X,8,-9) (Y,5,8)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. K (weight=-2) is correctly excluded; note negative color is allowed (only weight is constrained).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. K (weight=-2) bị loại đúng; lưu ý color âm vẫn được phép (chỉ weight bị ràng buộc).</p>`),
  B('addLast() correctly rejects weight <= 0 and appends otherwise.', 'addLast() loại đúng weight <= 0, ngược lại thêm vào cuối.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — Assuming the list contains at least three nodes, delete the FIRST THREE nodes.</p>`,
    `<p><strong>void f2()</strong> — Giả sử danh sách có ít nhất 3 node, xoá BA node ĐẦU TIÊN.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(D,4,7) (L,1,-5) (E,9,2) (Q,7,6)\n(Q,7,6)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte. F (weight=-3) is already excluded by addLast(); the remaining 4-element list has its first 3 nodes removed, leaving Q.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề. F (weight=-3) đã bị addLast() loại từ trước; danh sách 4 phần tử còn lại bị xoá đúng 3 node đầu, còn lại Q.</p>`),
  B('Correctly deletes exactly the first 3 nodes.', 'Xoá đúng chính xác 3 node đầu.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Assuming the list contains at least 3 elements, move the THIRD element to the end of the list.</p>`,
    `<p><strong>void f3()</strong> — Giả sử danh sách có ít nhất 3 phần tử, chuyển phần tử THỨ 3 xuống CUỐI danh sách.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(A,1,-3) (B,9,2) (D,2,6) (E,9,4) (Q,4,5) (R,3,7)\n(A,1,-3) (B,9,2) (E,9,4) (Q,4,5) (R,3,7) (D,2,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. The 3rd element (D) is unlinked and re-appended at the tail.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Phần tử thứ 3 (D) được gỡ khỏi vị trí cũ và nối lại vào cuối.</p>`),
  B('Correctly moves the 3rd element to the end of the list.', 'Chuyển đúng phần tử thứ 3 xuống cuối danh sách.'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — How many Bikes in the list satisfy the condition: color &gt; 0?</p>`,
    `<p><strong>void f4()</strong> — Có bao nhiêu Bike trong danh sách thoả color &gt; 0?</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(G,2,-2) (H,1,3) (I,3,7) (J,4,5) (K,5,6) (L,6,8)\n5`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte. Colors: G(-2),H(3),I(7),J(5),K(6),L(8) — color&gt;0 holds for 5 of the 6 (all except G).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề. Color: G(-2),H(3),I(7),J(5),K(6),L(8) — color&gt;0 đúng với 5/6 (trừ G).</p>`),
  B('Correctly counts Bikes with color > 0.', 'Đếm đúng số Bike có color > 0.'),
);

const q1f5 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f5()</strong> — Delete the first element, then sort the elements in descending order of weight.</p>`,
    `<p><strong>void f5()</strong> — Xoá phần tử đầu tiên, rồi sắp các phần tử GIẢM DẦN theo weight.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(N,6,1) (A,9,3) (I,4,-2) (S,7,5) (D,3,9)\n(A,9,3) (S,7,5) (I,4,-2) (D,3,9)`,
  B(`<p>Verified by compiling against the real given project and running choice 5 — matches the paper's expected example byte-for-byte on both lines. Deletes N (head), then sorts the remaining 4 (A,I,S,D) descending by weight: A(9),S(7),I(4),D(3).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 5 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Xoá N (đầu), rồi sắp 4 phần tử còn lại (A,I,S,D) giảm dần theo weight: A(9),S(7),I(4),D(3).</p>`),
  B('Correctly deletes the head node then sorts the remaining elements descending by weight.', 'Xoá đúng node đầu rồi sắp đúng các phần tử còn lại giảm dần theo weight.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xPlace, int xWeight, int xColor)</strong>.</p>
     <p><strong>void f1()</strong> — Add statements to the insert(...) method so that any node whose xPlace.charAt(0) == 'X' is not inserted into the tree. Output (line 1: breadth first traversal, line 2: in-order traversal).</p>`,
    `<p><strong>void insert(String xPlace, int xWeight, int xColor)</strong>.</p>
     <p><strong>void f1()</strong> — Thêm câu lệnh vào insert(...) để bất kỳ node nào có xPlace.charAt(0) == 'X' thì KHÔNG được chèn vào cây. Kết quả (dòng 1: BFS, dòng 2: in-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(M,9,5) (F,7,4) (N,3,6) (Q,8,7) (P,1,3) (R,4,8)\n(P,1,3) (N,3,6) (R,4,8) (F,7,4) (Q,8,7) (M,9,5)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte on both the BFS AND in-order lines. Standard recursive BST insert comparing <code>weight</code>, skipping place starting with 'X' (X, weight=5, is correctly excluded).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề ở CẢ dòng BFS VÀ dòng in-order. Chèn BST đệ quy chuẩn theo <code>weight</code>, bỏ qua place bắt đầu bằng 'X' (X, weight=5, bị loại đúng).</p>`),
  B('Correctly inserts following standard BST rules keyed by weight, skipping place starting with X.', 'Chèn đúng theo luật BST chuẩn khoá theo weight, bỏ qua place bắt đầu bằng X.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform a pre-order traversal of the LEFT branch of the BST, but write only nodes with color&gt;4 to file f2.txt. Hint: copy the preOrder(...) function into a new function preOrder2(...) and modify it. Output (line 1: breadth first traversal, line 2: pre-order traversal).</p>`,
    `<p><strong>void f2()</strong> — Duyệt pre-order NHÁNH TRÁI của BST, chỉ ghi node có color&gt;4 ra f2.txt. Gợi ý: sao chép preOrder(...) thành preOrder2(...) rồi sửa. Kết quả (dòng 1: BFS, dòng 2: pre-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(P,7,9) (D,4,3) (G,9,6) (H,2,5) (B,6,4) (L,1,8) (N,3,1)\n(H,2,5) (L,1,8)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on both lines. <code>preOrder2()</code> starts from <code>root.left</code> and performs root-left-right recursion, only calling <code>fvisit()</code> when <code>color &gt; 4</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. <code>preOrder2()</code> bắt đầu từ <code>root.left</code>, đệ quy gốc-trái-phải, chỉ gọi <code>fvisit()</code> khi <code>color &gt; 4</code>.</p>`),
  B('Correctly performs pre-order traversal of the left branch, displaying only nodes with color > 4.', 'Duyệt pre-order nhánh trái đúng, chỉ hiển thị node có color > 4.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Implement a new traversal to visit all nodes in the BST with the constraint: visit the nodes in the descending order of weight.</p>`,
    `<p><strong>void f3()</strong> — Viết một cách duyệt MỚI thăm mọi node của BST với ràng buộc: thăm theo thứ tự weight GIẢM DẦN.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(T,8,-5) (M,7,2) (P,6,3) (R,5,9) (S,4,1) (L,2,5) (Y,1,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. Since <code>weight</code> is the BST's key under the standard convention, descending-by-weight order is exactly a reverse in-order traversal (right, root, left).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Vì <code>weight</code> là khoá của BST theo convention chuẩn, thứ tự weight giảm dần chính là duyệt in-order NGƯỢC (phải, gốc, trái).</p>`),
  B('Correctly performs a reverse in-order traversal (descending by weight).', 'Duyệt in-order ngược đúng (weight giảm dần).'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Print out the internal nodes of the tree. Output (line 1: pre-order traversal, line 2: internal nodes by pre-order traversal).</p>`,
    `<p><strong>void f4()</strong> — In ra các node KHÔNG PHẢI LÁ (internal nodes) của cây. Kết quả (dòng 1: pre-order, dòng 2: internal nodes theo pre-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(A,6,5) (B,2,7) (P,1,9) (C,3,-8) (F,4,2) (D,5,-3) (E,8,3) (G,7,4) (Q,9,1)\n(A,6,5) (B,2,7) (C,3,-8) (F,4,2) (E,8,3)`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte on both lines. Pre-order recursion that only calls <code>fvisit()</code> when the node has at least one child (structural filter).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Đệ quy pre-order chỉ gọi <code>fvisit()</code> khi node có ít nhất 1 con (lọc theo cấu trúc).</p>`),
  B('Correctly performs pre-order traversal displaying only internal (non-leaf) nodes.', 'Duyệt pre-order đúng, chỉ hiển thị node không phải lá.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE35-SP24D1',
    title: 'PE Đề 35 — Practical Exam (SP 2024, Đề số 1)|||PE Đề 35 — Thi thực hành (SP 2024, Đề số 1)',
    description: 'CSD201 PE (CODE): linked list (Bike, weight>0) + BST (Bird, khoá weight), AI-graded, 9 câu 1đ (Q2-f5 bỏ do nguồn thiếu mô tả).|||PE CSD201 (viết mã): danh sách liên kết (Bike, weight>0) + BST (Bird, khoá weight), chấm AI, 9 câu 1đ (Q2-f5 bỏ do nguồn thiếu mô tả).',
    durationMinutes: 90,
    totalPoints: 9,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE35-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q1f5, q2f1, q2f2, q2f3, q2f4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
