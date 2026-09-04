/**
 * build-csd201-pe36.mjs — sinh content/exams/CSD201-PE36.mjs.
 *
 * Nguồn thật: csd201_sp24_b3w_t5_413424.rar (Đề "SP 2024 B3W T5"), 2
 * project (KHÔNG có Q3/Graph): Q1=MyList (Laptop: producer/weight/
 * price, weight>3 VÀ price>3, 5 câu) + Q2=BSTree (Cat: place/weight/
 * color, khoá weight, convention CHUẨN, 5 câu) = 10 câu, 10 điểm.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn — TOÀN BỘ 10/10 câu khớp byte-for-byte, TRỪ 1 ngoại lệ nhỏ ở
 * Q1-f5 (xem dưới).
 *
 * ⚠️ Q1-f5: minh hoạ "trước" của đề thiếu đúng 1 phần tử (I,4,6) so
 * với data.txt+addLast() thật (I thoả weight=4>3 VÀ price=6>3, phải
 * được thêm). NHƯNG minh hoạ "sau" (sau xoá 2 node đầu + sắp tăng
 * dần theo weight) của CHÍNH ĐỀ lại CÓ I và khớp tuyệt đối với code
 * đã biên dịch — nghĩa là chỉ dòng "trước" bị thiếu 1 ô khi soạn
 * minh hoạ, còn thuật toán thật (đã verify qua dòng "sau") là đúng.
 * Dùng số liệu thật đã biên dịch cho cả 2 dòng.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE36.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE36.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE36-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "SP 2024 B3W T5").</p>
   <ol>
     <li>Ignore the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each question below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "SP 2024 B3W T5").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi câu dưới đây được chấm ĐỘC LẬP (1 điểm mỗi câu). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe36-src';
const ORIG = '/tmp/csd201-pe36-orig/CSD201_SP24_B3W_T5_413424/PaperNo_1';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (5 marks, file MyList.java).</strong> The class <code>Laptop</code> with 3 data members: producer, weight and price is given (do not edit it). <code>MyList</code> is a linked list of Laptop objects.</p>`,
  `<p><strong>Câu 1 (5 điểm, file MyList.java).</strong> Lớp <code>Laptop</code> (producer, weight, price) đã có sẵn (không sửa). <code>MyList</code> là danh sách liên kết các Laptop.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (5 marks, file BSTree.java).</strong> The class <code>Cat</code> with 3 data members: place, weight and color is given (do not edit it). <code>BSTree</code> is a binary search tree of Cat objects. <strong>The variable weight is the key of the BSTree, thus it must be unique.</strong></p>`,
  `<p><strong>Câu 2 (5 điểm, file BSTree.java).</strong> Lớp <code>Cat</code> (place, weight, color) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Cat. <strong>Biến weight là khoá của cây, phải duy nhất.</strong></p>`,
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
    `<p><strong>void addLast(String xProducer, int xWeight, int xPrice)</strong> — Note: xWeight&gt;3 AND xPrice&gt;3.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete addLast() above only.</p>`,
    `<p><strong>void addLast(String xProducer, int xWeight, int xPrice)</strong> — Lưu ý: xWeight&gt;3 VÀ xPrice&gt;3.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(H,6,7) (C,4,5) (X,8,9) (Y,5,8)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. G (price=-1) and K (weight=2) are correctly excluded.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. G (price=-1) và K (weight=2) bị loại đúng.</p>`),
  B('addLast() correctly requires both weight>3 AND price>3.', 'addLast() áp đúng cả weight>3 VÀ price>3.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — Two Laptop objects v, w are given. Assume the list contains at least 2 elements. Write statements to insert v and w into the list so that v is the FIRST and w is the LAST node.</p>`,
    `<p><strong>void f2()</strong> — Có sẵn 2 đối tượng Laptop v, w. Giả sử danh sách có ít nhất 2 phần tử. Chèn v và w sao cho v thành node ĐẦU và w thành node CUỐI.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(D,4,7) (L,10,5) (E,9,7) (Q,7,6)\n(V,8,9) (D,4,7) (L,10,5) (E,9,7) (Q,7,6) (W,6,7)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte on both lines.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng.</p>`),
  B('Correctly inserts v at head and w at tail.', 'Chèn đúng v ở đầu và w ở cuối.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Delete the node that holds the heaviest Laptop (maximum weight). If more than one node satisfies the requirement, delete the FIRST of them.</p>`,
    `<p><strong>void f3()</strong> — Xoá node có Laptop NẶNG NHẤT (weight lớn nhất). Nếu có nhiều node thoả, xoá node ĐẦU TIÊN trong số đó.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(A,4,4) (D,10,6) (E,9,4) (F,5,8) (Q,10,5) (R,5,7)\n(A,4,4) (E,9,4) (F,5,8) (Q,10,5) (R,5,7)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte. Weights: A(4),D(10),E(9),F(5),Q(10),R(5) — max=10, tied between D and Q, so the FIRST (D) is deleted.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề. Weight: A(4),D(10),E(9),F(5),Q(10),R(5) — max=10, trùng giữa D và Q, xoá node ĐẦU (D).</p>`),
  B('Correctly finds the heaviest weight and deletes the first tied node.', 'Tìm đúng weight lớn nhất và xoá đúng node đầu khi có nhiều node trùng.'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — How many Laptops does the list contain?</p>`,
    `<p><strong>void f4()</strong> — Danh sách có bao nhiêu Laptop?</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(J,4,5) (K,5,6) (L,6,8)\n3`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte. Only J,K,L satisfy weight&gt;3 AND price&gt;3 (G,H,I,F all fail).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề. Chỉ J,K,L thoả weight&gt;3 VÀ price&gt;3 (G,H,I,F đều không đạt).</p>`),
  B('Correctly counts the number of Laptops in the list.', 'Đếm đúng số Laptop trong danh sách.'),
);

const q1f5 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f5()</strong> — Delete the first TWO nodes, then sort the elements ascending by weight (assuming there is no duplicated value for weight).</p>`,
    `<p><strong>void f5()</strong> — Xoá HAI node đầu tiên, rồi sắp các phần tử tăng dần theo weight (giả sử weight không trùng nhau).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(N,6,10) (A,9,13) (W,5,8) (I,4,6) (S,7,5) (D,8,9)\n(I,4,6) (W,5,8) (S,7,5) (D,8,9)`,
  B(`<p>Verified by compiling against the real given project and running choice 5 — line 2 matches the paper's expected example byte-for-byte. <strong>Note:</strong> the paper's own line 1 example omits I (weight=4, price=6) — but I clearly satisfies addLast()'s own weight&gt;3 AND price&gt;3 rule (already verified correct in f1-f4), and the paper's OWN line 2 (after deleting the first 2 and sorting) DOES include I, exactly matching this compiled output. This confirms line 1 in the paper is simply missing one tuple when the example was authored — a documentation slip, not an algorithm difference. Deletes N,A (first two), then sorts remaining W,I,S,D ascending by weight: I(4),W(5),S(7),D(8).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 5 — dòng 2 khớp byte-for-byte với ví dụ trong đề. <strong>Lưu ý:</strong> dòng 1 của chính đề thiếu I (weight=4, price=6) — nhưng I rõ ràng thoả luật weight&gt;3 VÀ price&gt;3 của addLast() (đã verify đúng ở f1-f4), và dòng 2 của CHÍNH ĐỀ (sau khi xoá 2 đầu + sắp) lại CÓ I, khớp đúng kết quả biên dịch này. Xác nhận dòng 1 của đề chỉ thiếu 1 ô khi soạn ví dụ — lỗi soạn đề, không phải khác biệt thuật toán. Xoá N,A (2 đầu), rồi sắp W,I,S,D còn lại tăng dần theo weight: I(4),W(5),S(7),D(8).</p>`),
  B('Correctly deletes the first 2 nodes then sorts the remaining elements ascending by weight.', 'Xoá đúng 2 node đầu rồi sắp đúng các phần tử còn lại tăng dần theo weight.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xPlace, int xWeight, int xColor)</strong>.</p>
     <p><strong>void f1()</strong> — Add statements in the insert(...) method so that any node with xPlace.charAt(0) == 'N' is not inserted to the tree. Output (line 1: breadth first traversal, line 2: in-order traversal).</p>`,
    `<p><strong>void insert(String xPlace, int xWeight, int xColor)</strong>.</p>
     <p><strong>void f1()</strong> — Thêm câu lệnh vào insert(...) để bất kỳ node nào có xPlace.charAt(0) == 'N' thì KHÔNG được chèn vào cây. Kết quả (dòng 1: BFS, dòng 2: in-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(X,5,2) (P,1,3) (M,9,5) (R,4,8) (F,7,4) (Q,8,7)\n(P,1,3) (R,4,8) (X,5,2) (F,7,4) (Q,8,7) (M,9,5)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte on both the BFS AND in-order lines. Standard recursive BST insert comparing <code>weight</code>, skipping place starting with 'N'.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề ở CẢ dòng BFS VÀ dòng in-order. Chèn BST đệ quy chuẩn theo <code>weight</code>, bỏ qua place bắt đầu bằng 'N'.</p>`),
  B('Correctly inserts following standard BST rules keyed by weight, skipping place starting with N.', 'Chèn đúng theo luật BST chuẩn khoá theo weight, bỏ qua place bắt đầu bằng N.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform a pre-order traversal for the LEFT BRANCH of the BST, but write to f2.txt only the nodes with color!=4. Hint: copy the preOrder(...) function to function preOrder2(...) and modify it. Output (line 1: breadth first traversal for whole tree, line 2: pre-order traversal for f2 requirement).</p>`,
    `<p><strong>void f2()</strong> — Duyệt pre-order NHÁNH TRÁI của BST, chỉ ghi ra f2.txt các node có color!=4. Gợi ý: sao chép preOrder(...) thành preOrder2(...) rồi sửa. Kết quả (dòng 1: BFS toàn cây, dòng 2: pre-order theo yêu cầu f2).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(P,7,9) (D,4,3) (G,9,6) (H,2,5) (B,6,4) (X,8,9) (L,1,8)\n(D,4,3) (H,2,5) (L,1,8)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on both lines. <code>preOrder2()</code> starts from <code>root.left</code>, root-left-right recursion, only calling <code>fvisit()</code> when <code>color != 4</code> (B, color=4, is correctly excluded).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. <code>preOrder2()</code> bắt đầu từ <code>root.left</code>, đệ quy gốc-trái-phải, chỉ gọi <code>fvisit()</code> khi <code>color != 4</code> (B, color=4, bị loại đúng).</p>`),
  B('Correctly performs pre-order traversal of the left branch, displaying only nodes with color != 4.', 'Duyệt pre-order nhánh trái đúng, chỉ hiển thị node có color != 4.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Perform a new traversal method to visit all nodes in the BST under the constraint: visit the nodes in descending order of weight.</p>`,
    `<p><strong>void f3()</strong> — Viết một cách duyệt MỚI thăm mọi node của BST với ràng buộc: thăm theo thứ tự weight GIẢM DẦN.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(T,8,-5) (M,7,2) (P,6,3) (R,5,9) (S,4,1) (L,2,5) (Y,1,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. Reverse in-order traversal (right, root, left) since weight is the BST's key under the standard convention.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Duyệt in-order NGƯỢC (phải, gốc, trái) vì weight là khoá của BST theo convention chuẩn.</p>`),
  B('Correctly performs a reverse in-order traversal (descending by weight).', 'Duyệt in-order ngược đúng (weight giảm dần).'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Print out leaf nodes with color&lt;7 of the tree. Output (line 1: pre-order traversal for whole tree, line 2: leaf nodes for f4 (by pre-order traversal)).</p>`,
    `<p><strong>void f4()</strong> — In ra các node LÁ có color&lt;7 của cây. Kết quả (dòng 1: pre-order toàn cây, dòng 2: node lá theo yêu cầu f4 theo pre-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(A,6,5) (B,2,7) (P,1,9) (C,3,-8) (F,4,2) (D,5,-3) (E,8,3) (G,7,4) (Q,9,1)\n(D,5,-3) (G,7,4) (Q,9,1)`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte on both lines. Pre-order recursion that only calls <code>fvisit()</code> when the node is a leaf AND <code>color &lt; 7</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Đệ quy pre-order chỉ gọi <code>fvisit()</code> khi node là lá VÀ <code>color &lt; 7</code>.</p>`),
  B('Correctly performs pre-order traversal displaying only leaf nodes with color < 7.', 'Duyệt pre-order đúng, chỉ hiển thị node lá có color < 7.'),
);

const q2f5 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f5()</strong> — How many internal nodes are there in the BST? Output (line 1: in-order traversal, line 2: the amount of internal nodes).</p>`,
    `<p><strong>void f5()</strong> — BST có bao nhiêu node KHÔNG PHẢI LÁ (internal nodes)? Kết quả (dòng 1: in-order, dòng 2: số internal node).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(L,1,5) (H,2,6) (Q,3,1) (D,4,3) (B,6,-4) (M,7,9) (X,8,7) (G,9,-6)\n4`,
  B(`<p>Verified by compiling against the real given project and running choice 5 — matches the paper's expected example byte-for-byte on both lines. Recursively counts nodes with at least one child.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 5 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Đếm đệ quy các node có ít nhất 1 con.</p>`),
  B('Correctly counts the number of internal (non-leaf) nodes in the BST.', 'Đếm đúng số node không phải lá (internal) trong BST.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE36-SP24B3WT5',
    title: 'PE Đề 36 — Practical Exam (SP 2024, B3W T5)|||PE Đề 36 — Thi thực hành (SP 2024, B3W T5)',
    description: 'CSD201 PE (CODE): linked list (Laptop, weight>3 & price>3) + BST (Cat, khoá weight, convention chuẩn), AI-graded, 10 câu 1đ — verify khớp byte-for-byte, có 1 ghi chú lỗi minh hoạ nhỏ ở Q1-f5.|||PE CSD201 (viết mã): danh sách liên kết (Laptop, weight>3 & price>3) + BST (Cat, khoá weight, convention chuẩn), chấm AI, 10 câu 1đ — verify khớp byte-for-byte, có 1 ghi chú lỗi minh hoạ nhỏ ở Q1-f5.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE36-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q1f5, q2f1, q2f2, q2f3, q2f4, q2f5],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
