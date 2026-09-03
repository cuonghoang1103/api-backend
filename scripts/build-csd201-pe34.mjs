/**
 * build-csd201-pe34.mjs — sinh content/exams/CSD201-PE34.mjs.
 *
 * Nguồn thật: csd201_t1_su24_111582.rar (Đề "T1 SU 2024"), 2 project
 * (KHÔNG có Q3/Graph): Q1=MyList (Phone: id/weight/price, id duy
 * nhất, weight>0, price>0, 5 câu) + Q2=BSTree (Dog: place/weight/
 * color, khoá weight, convention CHUẨN, 5 câu) = 10 câu, 10 điểm.
 * Given materials là project TRỐNG THẬT — tự cài từ đầu.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn — TOÀN BỘ 10/10 câu khớp byte-for-byte 100% với ví dụ trong
 * đề, KHÔNG có discrepancy nào (hiếm trong đợt này — đa số đề trước
 * có ít nhất 1 điểm cần ghi chú).
 *
 * Q1's addLast() lọc theo ĐÚNG 3 ràng buộc lớp đã công bố trong văn
 * bản đề ("id must be unique, weight>0, and price>0") — dò ngược dữ
 * liệu (data.txt CHỨA id trùng lặp cố ý trong mọi block f1-f5, cùng
 * vài weight/price âm) xác nhận khớp cả 5/5 câu.
 *
 * Q2's insert() dùng convention CHUẨN (nhỏ→trái, lớn→phải) — khác
 * với đề khác trong đợt này (PE33) dùng mirrored; xác nhận qua f4:
 * "right-most node" = Q (weight=9, đúng là lớn nhất trong dữ liệu).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE34.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE34.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE34-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "T1 SU 2024").</p>
   <ol>
     <li>Ignore the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each of the f1()..f5() methods below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "T1 SU 2024").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi hàm f1()..f5() dưới đây được chấm ĐỘC LẬP (1 điểm mỗi hàm). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe34-src';
const ORIG = '/tmp/csd201-pe34-orig/CSD201_T1_SU24_111582/PaperNo_1';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (5 marks, file MyList.java).</strong> The class <code>Phone</code> with 3 data members: id, weight and price is given (do not edit it). <strong>In this class, id must be unique (there is no duplicated id in the list), weight&gt;0, and price&gt;0.</strong> <code>MyList</code> is a linked list of Phone objects.</p>`,
  `<p><strong>Câu 1 (5 điểm, file MyList.java).</strong> Lớp <code>Phone</code> (id, weight, price) đã có sẵn (không sửa). <strong>id phải duy nhất (không trùng trong danh sách), weight&gt;0, và price&gt;0.</strong> <code>MyList</code> là danh sách liên kết các Phone.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (5 marks, file BSTree.java).</strong> The class <code>Dog</code> with 3 data members: place, weight and color is given (do not edit it). <code>BSTree</code> is a binary search tree of Dog objects. <strong>The variable weight is the key of the BSTree; in this test these values (weight) must be unique.</strong></p>`,
  `<p><strong>Câu 2 (5 điểm, file BSTree.java).</strong> Lớp <code>Dog</code> (place, weight, color) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Dog. <strong>Biến weight là khoá của cây; trong đề này weight phải duy nhất.</strong></p>`,
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
    `<p><strong>void addLast(String xId, int xWeight, int xPrice)</strong>.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete only the addLast(...) method above.</p>`,
    `<p><strong>void addLast(String xId, int xWeight, int xPrice)</strong>.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(H,6,7) (C,4,5) (Y,5,8)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. addLast() must enforce all 3 class invariants: reject weight&lt;=0, reject price&lt;=0, and reject a duplicate id. The raw data has a repeated id "H" and includes entries with negative weight/price — G is rejected (price=-1), the 2nd "H" is rejected (duplicate id), K is rejected (weight=-2), leaving H,C,Y.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. addLast() phải áp cả 3 ràng buộc lớp: loại weight&lt;=0, loại price&lt;=0, loại id trùng. Dữ liệu gốc có id "H" lặp lại và vài entry weight/price âm — G bị loại (price=-1), H thứ 2 bị loại (id trùng), K bị loại (weight=-2), còn lại H,C,Y.</p>`),
  B('addLast() correctly enforces id-uniqueness, weight>0 and price>0 before appending.', 'addLast() áp đúng cả 3 ràng buộc id duy nhất, weight>0, price>0 trước khi thêm.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — A Phone object v is given (already wrapped in a Node named v). Assume the list contains at least 3 elements. Write statements to insert v into the list so that v will be the 3rd node after insertion.</p>`,
    `<p><strong>void f2()</strong> — Có sẵn 1 Node v chứa Phone. Giả sử danh sách có ít nhất 3 phần tử. Chèn v sao cho v trở thành node thứ 3 sau khi chèn.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(D,4,7) (E,9,2) (Q,7,6)\n(D,4,7) (E,9,2) (New,8,9) (Q,7,6)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte on both lines. The raw data again has a duplicate id ("D") and a negative-price entry ("L"), both correctly filtered by the already-verified addLast(); v is inserted at 0-indexed position 2, landing as the 3rd node.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Dữ liệu gốc lại có id trùng ("D") và 1 entry price âm ("L"), cả hai bị addLast() đã verify lọc đúng; v được chèn ở vị trí 2 (0-indexed), thành node thứ 3.</p>`),
  B('Correctly inserts v so it becomes the 3rd node.', 'Chèn đúng v để trở thành node thứ 3.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Delete the node holding the heaviest Phone (maximum weight). If there is more than one node satisfying the requirement, delete the FIRST of them.</p>`,
    `<p><strong>void f3()</strong> — Xoá node có Phone NẶNG NHẤT (weight lớn nhất). Nếu có nhiều hơn 1 node thoả, xoá node ĐẦU TIÊN trong số đó.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(B,9,2) (D,12,6) (E,9,4) (R,12,7)\n(B,9,2) (E,9,4) (R,12,7)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte. Weights: B(9),D(12),E(9),R(12) — max=12, tied between D and R, so the FIRST one (D) is deleted.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề. Weight: B(9),D(12),E(9),R(12) — max=12, trùng giữa D và R, nên xoá node ĐẦU (D).</p>`),
  B('Correctly finds the heaviest weight and deletes the first tied node.', 'Tìm đúng weight lớn nhất và xoá đúng node đầu khi có nhiều node trùng.'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — How many Phones in the list satisfy price&gt;5? Use a helper function countSomeThing() and write the count with f.writeBytes(k+"").</p>`,
    `<p><strong>void f4()</strong> — Có bao nhiêu Phone trong danh sách thoả price&gt;5? Dùng hàm phụ countSomeThing() rồi ghi số đếm bằng f.writeBytes(k+"").</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(H,1,3) (I,3,7) (J,4,5) (K,5,6)\n2`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte. Prices: H(3),I(7),J(5),K(6) — price&gt;5 holds for I(7) and K(6), count=2.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề. Price: H(3),I(7),J(5),K(6) — price&gt;5 đúng với I(7) và K(6), đếm=2.</p>`),
  B('Correctly counts Phones with price > 5.', 'Đếm đúng số Phone có price > 5.'),
);

const q1f5 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f5()</strong> — Delete the first node, then sort the elements descending by weight (assuming that all weights are different).</p>`,
    `<p><strong>void f5()</strong> — Xoá node đầu tiên, rồi sắp các phần tử GIẢM DẦN theo weight (giả sử mọi weight khác nhau).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(N,6,1) (A,9,3) (W,5,2) (S,7,5) (C,1,1)\n(A,9,3) (S,7,5) (W,5,2) (C,1,1)`,
  B(`<p>Verified by compiling against the real given project and running choice 5 — matches the paper's expected example byte-for-byte on both lines. Deletes N (head), then sorts the remaining 4 (A,W,S,C) descending by weight: A(9),S(7),W(5),C(1).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 5 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Xoá N (đầu), rồi sắp 4 phần tử còn lại (A,W,S,C) giảm dần theo weight: A(9),S(7),W(5),C(1).</p>`),
  B('Correctly deletes the head node then sorts the remaining elements descending by weight.', 'Xoá đúng node đầu rồi sắp đúng các phần tử còn lại giảm dần theo weight.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xPlace, int xWeight, int xColor)</strong>.</p>
     <p><strong>void f1()</strong> — Add statements in the insert(...) method so that any node with xPlace.charAt(0) == 'F' is not inserted into the tree. Output (line 1: breadth first traversal, line 2: in-order traversal).</p>`,
    `<p><strong>void insert(String xPlace, int xWeight, int xColor)</strong>.</p>
     <p><strong>void f1()</strong> — Thêm câu lệnh vào insert(...) để bất kỳ node nào có xPlace.charAt(0) == 'F' thì KHÔNG được chèn vào cây. Kết quả (dòng 1: BFS, dòng 2: in-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(X,5,2) (N,3,6) (M,9,5) (P,1,3) (R,4,8) (Q,8,7) (L,7,6)\n(P,1,3) (N,3,6) (R,4,8) (X,5,2) (L,7,6) (Q,8,7) (M,9,5)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte on both the BFS AND in-order lines. Standard recursive BST insert comparing <code>weight</code>, skipping place starting with 'F' (F, weight=7, is correctly excluded from the raw 8-element data).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề ở CẢ dòng BFS VÀ dòng in-order. Chèn BST đệ quy chuẩn theo <code>weight</code>, bỏ qua place bắt đầu bằng 'F' (F, weight=7, bị loại đúng khỏi 8 phần tử dữ liệu gốc).</p>`),
  B('Correctly inserts following standard BST rules keyed by weight, skipping place starting with F.', 'Chèn đúng theo luật BST chuẩn khoá theo weight, bỏ qua place bắt đầu bằng F.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform a pre-order traversal for the WHOLE BST, but display only nodes with color&lt;8 to file f2.txt. Hint: copy the function preOrder(...) to function preOrder2(...) and modify it. Output (line 1: breadth first traversal, line 2: pre-order traversal).</p>`,
    `<p><strong>void f2()</strong> — Duyệt pre-order cho TOÀN BỘ BST, chỉ hiển thị node có color&lt;8 ra f2.txt. Gợi ý: sao chép preOrder(...) thành preOrder2(...) rồi sửa. Kết quả (dòng 1: BFS, dòng 2: pre-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(P,7,9) (D,4,3) (G,9,6) (L,1,8) (B,6,4) (X,8,9)\n(D,4,3) (B,6,4) (G,9,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on both lines. <code>preOrder2()</code> is a full root-left-right pre-order over the WHOLE tree, only calling <code>fvisit()</code> when <code>color &lt; 8</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. <code>preOrder2()</code> là pre-order gốc-trái-phải ĐẦY ĐỦ trên TOÀN cây, chỉ gọi <code>fvisit()</code> khi <code>color &lt; 8</code>.</p>`),
  B('Correctly performs a full pre-order traversal of the whole tree, displaying only nodes with color < 8.', 'Duyệt pre-order đầy đủ toàn cây đúng, chỉ hiển thị node có color < 8.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Perform a new traversal method to visit all nodes in the BST with the constraint: visit the nodes in the descending order of weight.</p>`,
    `<p><strong>void f3()</strong> — Viết một cách duyệt MỚI thăm mọi node của BST với ràng buộc: thăm theo thứ tự weight GIẢM DẦN.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(T,8,-5) (M,7,2) (P,6,3) (R,5,9) (S,4,1) (L,2,5)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. Since <code>weight</code> is the BST's key under the standard convention, descending-by-weight order is exactly a reverse in-order traversal (right, root, left).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Vì <code>weight</code> là khoá của BST theo convention chuẩn, thứ tự weight giảm dần chính là duyệt in-order NGƯỢC (phải, gốc, trái).</p>`),
  B('Correctly performs a reverse in-order traversal (descending by weight).', 'Duyệt in-order ngược đúng (weight giảm dần).'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Find the right most node of the tree. Output (line 1: pre-order traversal, line 2: the right most node).</p>`,
    `<p><strong>void f4()</strong> — Tìm node ngoài cùng bên phải của cây. Kết quả (dòng 1: pre-order, dòng 2: node ngoài cùng bên phải).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(A,6,5) (B,2,7) (C,3,-8) (D,5,-3) (E,8,3) (G,7,4) (Q,9,1)\n(Q,9,1)`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte on both lines. Under the standard convention (confirmed correct via f1/f2's exact matches), the right-most node is the one with the largest weight — Q (weight=9), the actual maximum in this data.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Dưới convention chuẩn (đã xác nhận đúng qua f1/f2 khớp tuyệt đối), node ngoài cùng bên phải là node có weight lớn nhất — Q (weight=9), đúng là giá trị lớn nhất trong dữ liệu.</p>`),
  B('Correctly finds the structurally right-most node (largest weight under the standard convention).', 'Tìm đúng node ngoài cùng bên phải theo cấu trúc (weight lớn nhất theo convention chuẩn).'),
);

const q2f5 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f5()</strong> — How many leaf nodes are there in the BST? Output (line 1: in-order traversal, line 2: the amount of leaf nodes).</p>`,
    `<p><strong>void f5()</strong> — BST có bao nhiêu node LÁ? Kết quả (dòng 1: in-order, dòng 2: số node lá).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(H,2,6) (Q,3,1) (D,4,3) (B,6,-4) (M,7,9) (X,8,7) (G,9,-6)\n3`,
  B(`<p>Verified by compiling against the real given project and running choice 5 — matches the paper's expected example byte-for-byte on both lines. Recursively counts nodes with both children null.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 5 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Đếm đệ quy các node có cả 2 con đều null.</p>`),
  B('Correctly counts the number of leaf nodes in the BST.', 'Đếm đúng số node lá trong BST.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE34-T1SU24',
    title: 'PE Đề 34 — Practical Exam (T1 SU 2024)|||PE Đề 34 — Thi thực hành (T1 SU 2024)',
    description: 'CSD201 PE (CODE): linked list (Phone, id duy nhất+weight>0+price>0) + BST (Dog, khoá weight, convention chuẩn), AI-graded, 10 câu 1đ — verify khớp byte-for-byte cả 10/10 câu, không lỗi minh hoạ.|||PE CSD201 (viết mã): danh sách liên kết (Phone, id duy nhất+weight>0+price>0) + BST (Dog, khoá weight, convention chuẩn), chấm AI, 10 câu 1đ — verify khớp byte-for-byte cả 10/10 câu, không lỗi minh hoạ.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE34-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q1f5, q2f1, q2f2, q2f3, q2f4, q2f5],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
