/**
 * build-csd201-pe40.mjs — sinh content/exams/CSD201-PE40.mjs.
 *
 * Nguồn thật: Đề 40 (CSD201_PE_SP24_187937, "Paper No 1", 2 project NetBeans:
 * Q1=MyList<Laptop> danh sách liên kết đơn, Q2=BSTree<Cat>). KHÔNG có
 * solutions.rar — toàn bộ 10 method (5+5) tự viết từ đầu dựa trên paper.pdf,
 * mỗi method VERIFY THẬT bằng javac+java, đối chiếu byte-for-byte với
 * "Expected output" in trong đề. CẢ 10/10 method khớp CHÍNH XÁC — không có
 * sai lệch nào với ví dụ trong đề (khác PE29, nơi có 2 chỗ lệch phải ghi chú).
 * Riêng Q1.f5: trang PDF gốc bị cắt mất phần "Expected output" (in kèm chữ
 * "(content cut in image, see below for Q2)" ngay trong bản scan) — không có
 * ví dụ để đối chiếu, nhưng thao tác "xoá node đầu, sort tăng dần theo weight"
 * không mơ hồ nên tự tính expectedOutput từ data.txt, verify bằng chạy thật.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE40.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE40.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE40-Given.zip';
const SRC = '/tmp/csd201-pe40-final';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper).</p>
   <ol>
     <li>Software: NetBeans IDE 8.x, Java JDK 1.8. Download the given materials above — it contains 2 separate NetBeans projects: Q1 (MyList) and Q2 (BSTree).</li>
     <li>Each project's file (MyList.java / BSTree.java) has several methods to complete — only edit inside the marked "Student's code" sections. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into each code box — it is graded by AI against the rubric. You can build &amp; run the real given projects on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật).</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Tải given materials ở trên — gồm 2 project NetBeans riêng: Q1 (MyList) và Q2 (BSTree).</li>
     <li>Mỗi file (MyList.java / BSTree.java) có vài method cần hoàn thiện — chỉ sửa trong phần đánh dấu "Student's code". Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

// ---------------------------------------------------------------------------
// Q1: MyList<Laptop> — 5 method
// ---------------------------------------------------------------------------
const myListGiven = fs.readFileSync(path.join(SRC, 'MyList.given.java'), 'utf8');
const myListSolved = fs.readFileSync(path.join(SRC, 'MyList.solved.java'), 'utf8');

const scenarioQ1En = `<p><strong>Scenario:</strong> Complete a Java singly-linked-list program of Laptop objects (producer, weight, price). Each of the 5 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ1Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java quản lý danh sách liên kết đơn các đối tượng Laptop (producer, weight, price). Mỗi trong 5 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ1En + `<p><strong>Câu 1: addLast() – 1 mark</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: <code>addLast(String xProducer, int xWeight, int xPrice)</code></li><li>Note: <code>xWeight</code> and <code>xPrice</code> must be bigger than 0 — otherwise the laptop is not added.</li></ul>`,
    scenarioQ1Vi + `<p><strong>Câu 1: addLast() – 1 điểm</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: <code>addLast(String xProducer, int xWeight, int xPrice)</code></li><li>Lưu ý: <code>xWeight</code> và <code>xPrice</code> phải LỚN HƠN 0 — ngược lại không thêm laptop.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(H,6,7) (C,4,5) (Y,5,8)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly. Reject the laptop (do nothing) when <code>xWeight &lt;= 0</code> or <code>xPrice &lt;= 0</code>; otherwise append a new node after <code>tail</code> (or set <code>head=tail=node</code> if the list was empty).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề. Từ chối (không làm gì) khi <code>xWeight &lt;= 0</code> hoặc <code>xPrice &lt;= 0</code>; ngược lại nối node mới sau <code>tail</code> (hoặc gán <code>head=tail=node</code> nếu danh sách rỗng).</p>`,
  ),
  rubric: [
    { id: 'validate', criterion: B('Correctly rejects the laptop when weight <= 0 or price <= 0.', 'Từ chối đúng khi weight <= 0 hoặc price <= 0.'), weight: 1, maxScore: 0.4 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list, handling both empty and non-empty list cases.', 'Nối đúng node mới vào cuối danh sách, xử lý đúng cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Insert v and w at specific positions</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: this function has 2 given Laptop objects v, w. Assume the list contains at least 3 elements. Write statements to insert v and w into the list so that w becomes the 2nd node and v becomes the 3rd node.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Chèn v và w vào vị trí cụ thể</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: hàm này có sẵn 2 đối tượng Laptop v, w. Giả sử danh sách có ít nhất 3 phần tử. Viết lệnh chèn v và w vào danh sách sao cho w trở thành node thứ 2 và v trở thành node thứ 3.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(D,4,7) (E,9,2) (Q,7,6)
(D,4,7) (W,1,7) (V,8,9) (E,9,2) (Q,7,6)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly. Splice <code>w</code> in right after <code>head</code> (making it the 2nd node), then splice <code>v</code> in right after <code>w</code> (making it the 3rd node).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề. Nối <code>w</code> vào ngay sau <code>head</code> (thành node thứ 2), rồi nối <code>v</code> vào ngay sau <code>w</code> (thành node thứ 3).</p>`,
  ),
  rubric: [
    { id: 'w_pos2', criterion: B('Correctly inserts w as the 2nd node (right after head).', 'Chèn đúng w thành node thứ 2 (ngay sau head).'), weight: 1, maxScore: 0.5 },
    { id: 'v_pos3', criterion: B('Correctly inserts v as the 3rd node (right after w).', 'Chèn đúng v thành node thứ 3 (ngay sau w).'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Remove the heaviest laptop</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: remove the node holding the heaviest Laptop (maximum weight). If more than one node satisfies the requirement, delete the LAST of them.</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Xoá laptop nặng nhất</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: xoá node giữ Laptop nặng nhất (weight lớn nhất). Nếu có nhiều hơn 1 node thoả điều kiện, xoá node CUỐI CÙNG trong số đó.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(B,9,2) (D,2,6) (E,9,4) (Q,4,5) (R,3,7)
(B,9,2) (D,2,6) (Q,4,5) (R,3,7)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 (f3) — output matches the paper's expected example exactly (B and E are tied at max weight=9; E, the LAST of the tied nodes, is removed). Scan once keeping the max-weight node found so far using <code>&gt;=</code> (not <code>&gt;</code>) so ties keep updating to the later occurrence, then unlink that node from the list (handling head/tail specially).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 (f3) — output khớp chính xác ví dụ trong đề (B và E cùng weight=9 lớn nhất; E, node CUỐI trong số đó, bị xoá). Duyệt 1 lượt giữ node weight lớn nhất tìm được bằng so sánh <code>&gt;=</code> (không phải <code>&gt;</code>) để khi bằng nhau vẫn cập nhật sang lần gặp sau, rồi unlink node đó khỏi danh sách (xử lý riêng trường hợp là head/tail).</p>`,
  ),
  rubric: [
    { id: 'find_last_max', criterion: B('Correctly finds the LAST node with maximum weight when ties occur.', 'Tìm đúng node CUỐI có weight lớn nhất khi có nhiều node bằng nhau.'), weight: 1, maxScore: 0.5 },
    { id: 'unlink', criterion: B('Correctly removes that node from the list, including the cases where it is the head or the tail.', 'Xoá đúng node đó khỏi danh sách, kể cả trường hợp nó là head hoặc tail.'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Count laptops</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: how many Laptops are there in the list? Write the count to the output file (after the traversal already written by the given code).</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Đếm số laptop</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: có bao nhiêu Laptop trong danh sách? Ghi số đếm ra file output (sau dòng duyệt danh sách đã có sẵn trong khung code).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(H,1,3) (I,3,7) (J,4,5) (K,5,6) (L,6,8)
5`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 (f4) — output matches the paper's expected example exactly. Walk the list from <code>head</code> counting nodes, then write the count as a line.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 (f4) — output khớp chính xác ví dụ trong đề. Duyệt danh sách từ <code>head</code> đếm số node, rồi ghi số đếm ra 1 dòng.</p>`,
  ),
  rubric: [
    { id: 'count', criterion: B('Correctly counts the number of nodes in the list and writes it to the file.', 'Đếm đúng số node trong danh sách và ghi ra file.'), weight: 1, maxScore: 1 },
  ],
};

const q1_5 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 5: f5() – 1 mark: Remove the first node, then sort ascending by weight</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f5()</code>, right after the marked comment</li><li>Task: remove the first node, then sort the remaining elements ascending by weight.</li></ul>`,
    `<p><strong>Câu 5: f5() – 1 điểm: Xoá node đầu, sort tăng dần theo weight</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f5()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: xoá node đầu tiên, rồi sắp xếp các phần tử còn lại tăng dần theo weight.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(N,6,1) (A,9,3) (S,7,5) (D,3,9)
(D,3,9) (S,7,5) (A,9,3)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 5 (f5) — computed directly from data.txt and the addLast validation rule (N, A, S, D pass the weight&gt;0/price&gt;0 filter; W and I are rejected). <b>Note:</b> the source PDF page is itself missing this method's worked example (the scan literally reads "(content cut in image, see below for Q2)" at this spot) — there is no official example to reproduce, but the task itself ("remove first node, then sort ascending by weight") is unambiguous, so the output above is derived and verified by actually running the completed program rather than copied from the paper.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 5 (f5) — tự tính trực tiếp từ data.txt và luật kiểm của addLast (N, A, S, D qua được điều kiện weight&gt;0/price&gt;0; W và I bị loại). <b>Lưu ý:</b> chính trang PDF nguồn bị thiếu ví dụ minh hoạ cho câu này (bản scan ghi rõ "(content cut in image, see below for Q2)" ngay tại chỗ đó) — không có ví dụ gốc để đối chiếu, nhưng bản thân yêu cầu ("xoá node đầu, sort tăng dần theo weight") không mơ hồ, nên output trên được tự suy ra và verify bằng cách chạy thật chương trình đã hoàn thiện, không phải chép từ đề.</p>`,
  ),
  rubric: [
    { id: 'remove_first', criterion: B('Correctly removes the first node of the list.', 'Xoá đúng node đầu tiên của danh sách.'), weight: 1, maxScore: 0.4 },
    { id: 'sort_ascending', criterion: B('Correctly sorts the remaining nodes ascending by weight (any correct sorting algorithm).', 'Sắp xếp đúng các node còn lại tăng dần theo weight (bất kỳ thuật toán sắp xếp đúng nào).'), weight: 1, maxScore: 0.6 },
  ],
};

// ---------------------------------------------------------------------------
// Q2: BSTree<Cat> — 5 method
// ---------------------------------------------------------------------------
const bsTreeGiven = fs.readFileSync(path.join(SRC, 'BSTree.given.java'), 'utf8');
const bsTreeSolved = fs.readFileSync(path.join(SRC, 'BSTree.solved.java'), 'utf8');

const scenarioQ2En = `<p><strong>Scenario:</strong> Complete a Java Binary Search Tree program of Cat objects (place, weight, color). <b>weight is the key of the tree and must be unique</b>. Each of the 5 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ2Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java cây nhị phân tìm kiếm (BST) các đối tượng Cat (place, weight, color). <b>weight là khoá của cây và phải DUY NHẤT</b>. Mỗi trong 5 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q2_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ2En + `<p><strong>Câu 1: insert() – 1 mark</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: <code>insert(String xPlace, int xWeight, int xColor)</code></li><li>Task: add statements so that any node with <code>xPlace.charAt(0) == 'F'</code> is NOT inserted to the tree; otherwise insert a new Cat object (weight is the key, must be unique) into the tree.</li></ul>`,
    scenarioQ2Vi + `<p><strong>Câu 1: insert() – 1 điểm</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: <code>insert(String xPlace, int xWeight, int xColor)</code></li><li>Nhiệm vụ: thêm lệnh để bất kỳ node nào có <code>xPlace.charAt(0) == 'F'</code> KHÔNG được chèn vào cây; ngược lại chèn 1 đối tượng Cat mới (weight là khoá, phải duy nhất) vào cây.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(X,5,2) (N,3,6) (M,9,5) (P,1,3) (R,4,8) (Q,8,7)
(P,1,3) (N,3,6) (R,4,8) (X,5,2) (Q,8,7) (M,9,5)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly (node F is correctly excluded; the remaining 6 nodes form the expected tree by breadth-first and in-order traversal). Standard BST insert comparing by <code>weight</code>; skip when <code>place</code> starts with 'F'; reject when the tree already has a node with the same weight.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề (node F bị loại đúng; 6 node còn lại tạo đúng cây theo cả 2 kiểu duyệt breadth-first và in-order). Chèn BST chuẩn so sánh theo <code>weight</code>; bỏ qua khi <code>place</code> bắt đầu bằng 'F'; từ chối khi cây đã có node cùng weight.</p>`,
  ),
  rubric: [
    { id: 'skip_f', criterion: B("Correctly skips insertion when place starts with 'F'.", "Bỏ qua đúng khi place bắt đầu bằng 'F'."), weight: 1, maxScore: 0.3 },
    { id: 'bst_order', criterion: B('Correctly inserts respecting BST ordering by weight.', 'Chèn đúng thứ tự BST theo weight.'), weight: 1, maxScore: 0.4 },
    { id: 'unique_weight', criterion: B('Correctly rejects insertion when the weight already exists elsewhere in the tree.', 'Từ chối đúng khi weight đã tồn tại ở nơi khác trong cây.'), weight: 1, maxScore: 0.3 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Pre-order of the right branch, filtered by color</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: perform pre-order traversal for the right branch of the BST, but display only the nodes with <code>color &lt; 8</code>. Hint: copy the given <code>preOrder(...)</code> to a new function (e.g. <code>preOrder2(...)</code>) and modify it.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Pre-order nhánh phải, lọc theo color</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt pre-order nhánh PHẢI của BST, nhưng chỉ hiện node có <code>color &lt; 8</code>. Gợi ý: copy <code>preOrder(...)</code> có sẵn thành hàm mới (ví dụ <code>preOrder2(...)</code>) rồi sửa hàm mới đó.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(P,7,9) (D,4,3) (G,9,6) (H,2,5) (B,6,4) (X,8,9) (L,1,8) (N,3,1)
(G,9,6)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly. The right branch (root.right, node G) has pre-order G, X; G has color=6&lt;8 (included), X has color=9 (excluded) — leaving just <code>(G,9,6)</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề. Nhánh phải (root.right, node G) có pre-order là G, X; G có color=6&lt;8 (được hiện), X có color=9 (bị loại) — chỉ còn <code>(G,9,6)</code>.</p>`,
  ),
  rubric: [
    { id: 'right_branch', criterion: B('Correctly starts the traversal from root.right (the right branch only), not the whole tree.', 'Bắt đầu duyệt đúng từ root.right (chỉ nhánh phải), không phải toàn cây.'), weight: 1, maxScore: 0.4 },
    { id: 'preorder_filter', criterion: B('Correctly performs pre-order traversal and only writes nodes with color < 8.', 'Duyệt đúng pre-order và chỉ ghi ra node có color < 8.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: New traversal in descending order of weight</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: implement a new traversal method that visits all nodes in the BST in descending order of weight.</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Duyệt mới theo weight giảm dần</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: cài đặt 1 phương thức duyệt mới, thăm tất cả node trong BST theo thứ tự weight GIẢM DẦN.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(T,8,-5) (M,7,2) (P,6,3) (R,5,9) (S,4,1) (L,2,5) (Y,1,6)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 (f3) — output matches the paper's expected example exactly. Since weight is the BST key, a "reverse in-order" traversal (visit right subtree, then the node, then left subtree — the mirror image of the given <code>inOrder(...)</code>) visits nodes in descending order of weight.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 (f3) — output khớp chính xác ví dụ trong đề. Vì weight là khoá BST, duyệt "in-order ngược" (thăm cây con phải, rồi node, rồi cây con trái — ảnh gương của <code>inOrder(...)</code> có sẵn) sẽ cho đúng thứ tự weight giảm dần.</p>`,
  ),
  rubric: [
    { id: 'new_function', criterion: B('Implements a genuinely new traversal function (not just reusing an existing one unmodified).', 'Cài đặt đúng 1 hàm duyệt mới (không chỉ tái dùng nguyên xi hàm có sẵn).'), weight: 1, maxScore: 0.3 },
    { id: 'descending_order', criterion: B('Correctly visits every node exactly once, in descending order of weight (right, node, left).', 'Thăm đúng mọi node đúng 1 lần, theo thứ tự weight giảm dần (phải, node, trái).'), weight: 1, maxScore: 0.7 },
  ],
};

const q2_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Print the leaf nodes</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: print out the leaf nodes of the tree (nodes with no children), in pre-order, after the pre-order traversal already written by the given code.</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: In các leaf node</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: in ra các leaf node của cây (node không có con), theo pre-order, sau dòng duyệt pre-order đã có sẵn trong khung code.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(A,6,5) (B,2,7) (P,1,9) (C,3,-8) (D,5,-3) (E,8,3) (G,7,4) (Q,9,1)
(P,1,9) (D,5,-3) (G,7,4) (Q,9,1)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 (f4) — output matches the paper's expected example exactly. Recursively visit the tree pre-order (root, left, right), writing a node only when both <code>left</code> and <code>right</code> are null.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 (f4) — output khớp chính xác ví dụ trong đề. Duyệt đệ quy pre-order (gốc, trái, phải), chỉ ghi ra node khi cả <code>left</code> và <code>right</code> đều null.</p>`,
  ),
  rubric: [
    { id: 'preorder_walk', criterion: B('Correctly walks the tree in pre-order (root, left, right) when checking each node.', 'Duyệt đúng cây theo pre-order (gốc, trái, phải) khi kiểm mỗi node.'), weight: 1, maxScore: 0.4 },
    { id: 'leaf_check', criterion: B('Only writes nodes that have both left and right null (true leaves).', 'Chỉ ghi ra node có cả left và right đều null (leaf thật sự).'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_5 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 5: f5() – 1 mark: Count internal nodes</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f5()</code>, right after the marked comment</li><li>Task: how many internal nodes (nodes with at least one child) are there in the BST? Write the count after the in-order traversal already written by the given code.</li></ul>`,
    `<p><strong>Câu 5: f5() – 1 điểm: Đếm internal node</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f5()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: có bao nhiêu internal node (node có ít nhất 1 con) trong BST? Ghi số đếm sau dòng duyệt in-order đã có sẵn trong khung code.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(L,1,5) (H,2,6) (Q,3,1) (D,4,3) (B,6,-4) (M,7,9) (X,8,7) (G,9,-6)
4`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 5 (f5) — output matches the paper's expected example exactly (4 internal nodes: M, D, G, H; 4 leaves: B, X, L, Q). Recursively count nodes where <code>left != null || right != null</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 5 (f5) — output khớp chính xác ví dụ trong đề (4 internal node: M, D, G, H; 4 leaf: B, X, L, Q). Đếm đệ quy các node có <code>left != null || right != null</code>.</p>`,
  ),
  rubric: [
    { id: 'internal_count', criterion: B('Correctly counts every node that has at least one child, over the whole tree.', 'Đếm đúng mọi node có ít nhất 1 con, trên toàn cây.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE40',
    title: 'PE Đề 40 — Practical Exam (SP2024)|||PE Đề 40 — Thi thực hành (SP2024)',
    description: 'CSD201 PE (CODE): complete singly-linked-list + BST methods across 2 given NetBeans projects, AI-graded.|||PE CSD201 (viết mã): hoàn thiện method danh sách liên kết đơn + BST trên 2 project NetBeans given, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE40-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q1_4, q1_5, q2_1, q2_2, q2_3, q2_4, q2_5],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
