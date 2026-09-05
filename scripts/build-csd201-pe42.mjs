/**
 * build-csd201-pe42.mjs — sinh content/exams/CSD201-PE42.mjs.
 *
 * Nguồn thật: Đề 42 (paperno.rar, "PaperNo", FA2023-HB, 2 project NetBeans:
 * Q1=MyList<Worker> 6 method, Q2=BSTree<Worker> 4 method). ⚠️ Archive tải về
 * KHÔNG PHẢI given trắng — Q1/MyList.java đã có sẵn lời giải cho f1-f5 (chỉ
 * f6 để trống), và Q2/BSTree.java đã có sẵn lời giải cho insert()+f1+f2 (chỉ
 * f3+f4 để trống) — tức archive này thực ra là board MỘT PHIÊN BẢN ĐÃ GIẢI
 * MỘT PHẦN, không phải given thuần. Đã TỰ DỰNG LẠI bản given trắng đúng
 * chuẩn (blank hết các method có lời giải sẵn, xoá 2 helper method KHÔNG có
 * trong given gốc — insertPos/deleteNodeAtPosition — vì đó là code người
 * giải trước thêm vào, không phải scaffolding gốc) trước khi đóng gói zip
 * cho học viên.
 *
 * Toàn bộ 10 method VERIFY THẬT bằng javac+java, đối chiếu byte-for-byte với
 * "Expected output" in trong paper.pdf. 9/10 khớp CHÍNH XÁC. Riêng Q2.f4:
 * cột "D" (node p, 7th post-order) khớp đúng (ability 1→5, verify bằng công
 * thức height chuẩn — số node trên đường dài nhất, lá=1, null=0), nhưng ví
 * dụ in trong đề CÒN đổi luôn ability của node I (9→3) dù đề chỉ yêu cầu đổi
 * ability của p — không dò ra được cơ chế/lý do, đã ghi rõ trong explanation,
 * dùng kết quả đã verify (chỉ đổi p) làm chuẩn chấm.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE42.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE42.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE42-Given.zip';
const SRC = '/tmp/csd201-pe42-work';

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
// Q1: MyList<Worker> — 6 method
// ---------------------------------------------------------------------------
const myListGiven = fs.readFileSync(path.join(SRC, 'MyList.given.java'), 'utf8');
const myListSolved = fs.readFileSync(path.join(SRC, 'MyList.solved.java'), 'utf8');

const scenarioQ1En = `<p><strong>Scenario:</strong> Complete a Java singly-linked-list program of Worker objects (name, salary, ability). Each of the 6 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ1Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java quản lý danh sách liên kết đơn các đối tượng Worker (name, salary, ability). Mỗi trong 6 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ1En + `<p><strong>Câu 1: addLast() – 1 mark</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: <code>addLast(String xName, int xSalary, int xAbility)</code></li><li>Task: if <code>xName.charAt(0) == 'A'</code>, do nothing; otherwise add a new node with name=xName, salary=xSalary, ability=xAbility to the end of the list.</li></ul>`,
    scenarioQ1Vi + `<p><strong>Câu 1: addLast() – 1 điểm</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: <code>addLast(String xName, int xSalary, int xAbility)</code></li><li>Nhiệm vụ: nếu <code>xName.charAt(0) == 'A'</code> thì không làm gì; ngược lại thêm node mới name=xName, salary=xSalary, ability=xAbility vào CUỐI danh sách.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly (node A is correctly excluded). Skip when <code>xName.charAt(0) == 'A'</code>; otherwise append after <code>tail</code> (or set <code>head=tail=node</code> if the list was empty).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề (node A bị loại đúng). Bỏ qua khi <code>xName.charAt(0) == 'A'</code>; ngược lại nối node mới sau <code>tail</code> (hoặc gán <code>head=tail=node</code> nếu danh sách rỗng).</p>`,
  ),
  rubric: [
    { id: 'skip_a', criterion: B("Correctly skips insertion when name starts with 'A'.", "Bỏ qua đúng khi name bắt đầu bằng 'A'."), weight: 1, maxScore: 0.4 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list, handling both empty and non-empty list cases.', 'Nối đúng node mới vào cuối danh sách, xử lý đúng cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Insert x and y at specific positions</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: there are 2 given Worker objects x, y. Assume the list contains at least 5 elements. Insert x and y into the list so that x becomes the 1st node and y becomes the 5th node.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Chèn x và y vào vị trí cụ thể</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: có sẵn 2 đối tượng Worker x, y. Giả sử danh sách có ít nhất 5 phần tử. Chèn x và y vào danh sách sao cho x trở thành node thứ 1 và y trở thành node thứ 5.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9)
(X,1,2) (C,9,8) (D,6,3) (E,8,5) (Y,3,4) (F,5,4) (I,4,9)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly. Using a helper that inserts a node at a given 1-indexed position: insert x at position 1 (new head) first, then insert y at position 5 (counting x already inserted).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề. Dùng 1 hàm phụ chèn node vào vị trí 1-based cho trước: chèn x vào vị trí 1 (thành head mới) trước, rồi chèn y vào vị trí 5 (đã tính cả x vừa chèn).</p>`,
  ),
  rubric: [
    { id: 'x_pos1', criterion: B('Correctly inserts x as the new 1st node (new head).', 'Chèn đúng x thành node thứ 1 mới (head mới).'), weight: 1, maxScore: 0.5 },
    { id: 'y_pos5', criterion: B('Correctly inserts y as the 5th node (counting x already inserted).', 'Chèn đúng y thành node thứ 5 (đã tính cả x vừa chèn).'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Change ability of the first high-salary worker</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: find the first node having salary &gt; 8, then change its ability to 100.</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Đổi ability của worker lương cao đầu tiên</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: tìm node ĐẦU TIÊN có salary &gt; 8, rồi đổi ability của nó thành 100.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,8,6) (D,3,5) (E,9,2) (F,5,8) (G,9,7) (H,6,8) (I,7,3)
(C,8,6) (D,3,5) (E,9,100) (F,5,8) (G,9,7) (H,6,8) (I,7,3)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 (f3) — output matches the paper's expected example exactly (node E, the first with salary=9&gt;8, is changed; note node C's salary=8 does not qualify since 8 is not &gt; 8). Scan from head, and on the first match set <code>ability=100</code> and stop.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 (f3) — output khớp chính xác ví dụ trong đề (node E, đầu tiên có salary=9&gt;8, được đổi; lưu ý node C salary=8 KHÔNG đủ điều kiện vì 8 không &gt; 8). Duyệt từ head, gặp node đầu tiên thoả thì đổi <code>ability=100</code> rồi dừng.</p>`,
  ),
  rubric: [
    { id: 'find_first', criterion: B('Correctly finds only the FIRST node with salary > 8 (stops after the first match, does not change any other node).', 'Tìm đúng CHỈ node ĐẦU TIÊN có salary > 8 (dừng ngay sau lần khớp đầu, không đổi node khác).'), weight: 1, maxScore: 1 },
  ],
};

const q1_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Sort descending by salary</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: sort all elements descending by salary.</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Sort giảm dần theo salary</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: sắp xếp tất cả phần tử GIẢM DẦN theo salary.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,1,2) (D,10,3) (E,2,15) (F,11,6) (I,6,14) (J,12,15) (K,7,9)
(J,12,15) (F,11,6) (D,10,3) (K,7,9) (I,6,14) (E,2,15) (C,1,2)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 (f4) — output matches the paper's expected example exactly. Bubble/selection-style pairwise swap: for every pair (i, j) with j after i, swap their <code>info</code> if <code>i.info.salary &lt; j.info.salary</code>, leaving a fully descending order.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 (f4) — output khớp chính xác ví dụ trong đề. Đổi chỗ từng cặp (i,j) với j sau i: hoán đổi <code>info</code> nếu <code>i.info.salary &lt; j.info.salary</code>, cho ra thứ tự giảm dần hoàn toàn.</p>`,
  ),
  rubric: [
    { id: 'sort_descending', criterion: B('Correctly sorts all nodes descending by salary (any correct sorting algorithm).', 'Sắp xếp đúng mọi node giảm dần theo salary (bất kỳ thuật toán sắp xếp đúng nào).'), weight: 1, maxScore: 1 },
  ],
};

const q1_5 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 5: f5() – 1 mark: Sort descending, then delete the 1st and 3rd elements</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f5()</code>, right after the marked comment</li><li>Task: sort the linked list in descending order of salary, then delete the 1st and 3rd elements (of the sorted list).</li></ul>`,
    `<p><strong>Câu 5: f5() – 1 điểm: Sort giảm dần, xoá phần tử 1 và 3</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f5()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: sắp xếp danh sách GIẢM DẦN theo salary, rồi xoá phần tử thứ 1 và thứ 3 (của danh sách đã sắp).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,1,2) (D,10,3) (E,2,15) (F,11,6) (I,6,14) (J,12,15) (K,7,9)
(F,11,6) (K,7,9) (I,6,14) (E,2,15) (C,1,2)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 5 (f5) — output matches the paper's expected example exactly. Sort descending by salary first (J, F, D, K, I, E, C), then delete position 0 (J) and position 1 of the now-shorter list (D, which was originally the 3rd of the sorted 7) — careful: after removing the 1st element, "the 3rd element" of the ORIGINAL sorted list is now at index 1, so the two deletions must be done as <code>deleteAtPosition(0)</code> then <code>deleteAtPosition(1)</code> in sequence (not two deletions computed against the original list).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 5 (f5) — output khớp chính xác ví dụ trong đề. Sort giảm dần theo salary trước (J, F, D, K, I, E, C), rồi xoá vị trí 0 (J) và vị trí 1 của danh sách đã ngắn hơn (D, vốn là phần tử thứ 3 của danh sách 7 phần tử ban đầu) — lưu ý: sau khi xoá phần tử thứ 1, "phần tử thứ 3" của danh sách GỐC giờ nằm ở chỉ số 1, nên phải xoá tuần tự <code>deleteAtPosition(0)</code> rồi <code>deleteAtPosition(1)</code> (không phải tính cả 2 vị trí xoá theo danh sách gốc).</p>`,
  ),
  rubric: [
    { id: 'sort_descending', criterion: B('Correctly sorts all nodes descending by salary before deleting.', 'Sắp xếp đúng giảm dần theo salary trước khi xoá.'), weight: 1, maxScore: 0.4 },
    { id: 'delete_1st_3rd', criterion: B('Correctly removes the 1st and 3rd elements of the sorted list (accounting for the index shift after the first deletion).', 'Xoá đúng phần tử thứ 1 và thứ 3 của danh sách đã sắp (tính đúng độ lệch chỉ số sau lần xoá đầu).'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_6 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 6: f6() – 1 mark: Find and delete the worker with a given salary</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f6()</code>, right after the marked comment</li><li>Task: a local variable <code>deleteSalary</code> is already given (its value is 11). Find and delete the node whose salary equals <code>deleteSalary</code>.</li></ul>`,
    `<p><strong>Câu 6: f6() – 1 điểm: Tìm và xoá worker theo salary</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f6()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: biến cục bộ <code>deleteSalary</code> đã có sẵn (giá trị 11). Tìm và xoá node có salary bằng <code>deleteSalary</code>.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,1,2) (D,10,3) (E,2,15) (F,11,6) (I,6,14) (J,12,15) (K,7,9)
(C,1,2) (D,10,3) (E,2,15) (I,6,14) (J,12,15) (K,7,9)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 6 (f6) — output matches the paper's expected example exactly (node F, salary=11, is removed). Scan from head for a node with <code>salary == deleteSalary</code>, unlink it (handling the head-node case and re-pointing <code>tail</code> if needed).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 6 (f6) — output khớp chính xác ví dụ trong đề (node F, salary=11, bị xoá). Duyệt từ head tìm node có <code>salary == deleteSalary</code>, unlink nó (xử lý cả trường hợp là head, trỏ lại tail nếu cần).</p>`,
  ),
  rubric: [
    { id: 'find_and_delete', criterion: B('Correctly finds the node with the matching salary and removes it, handling both head and non-head cases.', 'Tìm đúng node có salary khớp và xoá nó, xử lý đúng cả trường hợp là head và không phải head.'), weight: 1, maxScore: 1 },
  ],
};

// ---------------------------------------------------------------------------
// Q2: BSTree<Worker> — 4 method
// ---------------------------------------------------------------------------
const bsTreeGiven = fs.readFileSync(path.join(SRC, 'BSTree.given.java'), 'utf8');
const bsTreeSolved = fs.readFileSync(path.join(SRC, 'BSTree.solved.java'), 'utf8');

const scenarioQ2En = `<p><strong>Scenario:</strong> Complete a Java Binary Search Tree program of Worker objects (name, salary, ability). <b>salary is the key of the tree and must be unique</b> (already enforced by the given part of insert()). Each of the 4 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ2Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java cây nhị phân tìm kiếm (BST) các đối tượng Worker (name, salary, ability). <b>salary là khoá của cây và phải DUY NHẤT</b> (phần đã có sẵn của insert() đã tự lo việc này). Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q2_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ2En + `<p><strong>Câu 1: insert() – 1 mark</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: add statements at the top of <code>insert(String xName, int xSalary, int xAbility)</code> so that any node with <code>xName.charAt(0) == 'B'</code> is not inserted into the tree (the rest of insert — standard BST insert keyed by salary, rejecting duplicate salaries — is already given).</li></ul>`,
    scenarioQ2Vi + `<p><strong>Câu 1: insert() – 1 điểm</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: thêm lệnh ở ĐẦU <code>insert(String xName, int xSalary, int xAbility)</code> sao cho bất kỳ node nào có <code>xName.charAt(0) == 'B'</code> KHÔNG được chèn vào cây (phần còn lại của insert — chèn BST chuẩn theo salary, từ chối salary trùng — đã có sẵn).</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(A,7,9) (C,4,3) (D,8,6) (E,2,5) (Y,6,-7) (F,-6,7)
(F,-6,7) (E,2,5) (C,4,3) (Y,6,-7) (A,7,9) (D,8,6)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly (node B is correctly excluded; node X, salary=4 duplicating node C's salary, is also correctly excluded by the already-given uniqueness check).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề (node B bị loại đúng; node X, salary=4 trùng salary của node C, cũng bị loại đúng nhờ phần kiểm tra duy nhất đã có sẵn).</p>`,
  ),
  rubric: [
    { id: 'skip_b', criterion: B("Correctly skips insertion when name starts with 'B', leaving the rest of insert() untouched.", "Bỏ qua đúng khi name bắt đầu bằng 'B', giữ nguyên phần còn lại của insert()."), weight: 1, maxScore: 1 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Breadth-first traversal filtered by ability</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: perform breadth-first traversal from the root but write to file f2.txt only the nodes with <code>ability &lt; 6</code>. Hint: copy the given <code>breadth(...)</code> to a new function (e.g. <code>breadth2(...)</code>, already declared) and modify it — then call it here.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Duyệt rộng lọc theo ability</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt breadth-first từ root nhưng chỉ ghi ra file f2.txt các node có <code>ability &lt; 6</code>. Gợi ý: copy <code>breadth(...)</code> có sẵn thành hàm mới (ví dụ <code>breadth2(...)</code>, đã khai báo sẵn) rồi sửa hàm mới đó — gọi nó ở đây.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,3) (G,7,8) (H,1,7) (I,3,9) (J,5,5) (K,4,6)
(C,8,2) (D,6,1) (E,9,4) (F,2,3) (J,5,5)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly. <code>breadth2(...)</code> (already declared in the given file, just needs to be called here) is the given <code>breadth(...)</code> modified to only write a dequeued node when <code>node.info.ability &lt; 6</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề. <code>breadth2(...)</code> (đã khai báo sẵn trong file given, chỉ cần gọi ở đây) là bản sửa của <code>breadth(...)</code> có sẵn, chỉ ghi ra node vừa lấy khi <code>node.info.ability &lt; 6</code>.</p>`,
  ),
  rubric: [
    { id: 'call_breadth2', criterion: B('Correctly calls the given breadth2(...) helper on the tree.', 'Gọi đúng hàm breadth2(...) có sẵn trên cây.'), weight: 1, maxScore: 1 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Delete the father of the 7th post-order node, by copying</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: suppose p is the 7th node when performing the post-order traversal of the tree, and fa is the father of p. Delete node fa by copying — if fa has two children, replace fa by the RIGHTMOST node in fa's LEFT subtree (i.e. its in-order predecessor); otherwise splice in fa's only child.</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Xoá cha của node thứ 7 (post-order), bằng cách copy</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử p là node thứ 7 khi duyệt post-order cây, fa là cha của p. Xoá node fa bằng cách copy — nếu fa có 2 con, thay fa bằng node NGOÀI CÙNG BÊN PHẢI trong cây con TRÁI của fa (tức node kế tiếp theo in-order phía trước); ngược lại thay fa bằng con duy nhất của nó.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(H,1,7) (K,4,6) (J,5,5) (I,3,9) (F,2,3) (G,7,8) (D,6,1) (E,9,4) (C,8,2)
(H,1,7) (K,4,6) (J,5,5) (I,3,9) (F,2,3) (D,6,1) (E,9,4) (G,7,8)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 (f3) — output matches the paper's expected example exactly. p (7th in post-order H,K,J,I,F,G,D,E,C) is D; fa (D's father) is C. C has two children (D and E), so C is replaced by the rightmost node of C's left subtree (D's subtree) — that is G — and G is unlinked from its original spot (G was a leaf, so D's right link becomes null).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 (f3) — output khớp chính xác ví dụ trong đề. p (thứ 7 trong post-order H,K,J,I,F,G,D,E,C) là D; fa (cha của D) là C. C có 2 con (D và E), nên C được thay bằng node ngoài cùng bên phải của cây con trái của C (cây con của D) — đó là G — và G được gỡ khỏi vị trí gốc (G là lá, nên liên kết phải của D thành null).</p>`,
  ),
  rubric: [
    { id: 'find_p_fa', criterion: B('Correctly identifies p (7th post-order node) and its father fa.', 'Xác định đúng p (node thứ 7 post-order) và cha fa của nó.'), weight: 1, maxScore: 0.4 },
    { id: 'delete_by_copy', criterion: B("Correctly deletes fa using the specified convention (replace by the rightmost node of the left subtree when fa has two children; splice in the only child otherwise), leaving a tree with exactly one fewer node.", 'Xoá đúng fa theo đúng quy ước đề bài (thay bằng node ngoài cùng bên phải cây con trái khi fa có 2 con; thay bằng con duy nhất nếu chỉ có 1 con), cây còn lại đúng ít hơn 1 node.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Set the ability of the 7th post-order node to its subtree height</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: suppose p is the 7th node when performing the post-order traversal of the tree. Calculate the height of the sub-tree rooted at p (counting the number of nodes on the longest root-to-leaf path — a single leaf has height 1), and set <code>p.info.ability</code> to that height.</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Đặt ability của node thứ 7 (post-order) bằng chiều cao cây con của nó</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử p là node thứ 7 khi duyệt post-order cây. Tính chiều cao cây con gốc p (đếm số node trên đường dài nhất từ gốc tới lá — 1 lá đơn có chiều cao 1), rồi đặt <code>p.info.ability</code> bằng chiều cao đó.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(H,1,7) (K,4,6) (J,5,5) (I,3,9) (F,2,3) (G,7,8) (D,6,1) (E,9,4) (C,8,2)
(H,1,7) (K,4,6) (J,5,5) (I,3,9) (F,2,3) (G,7,8) (D,6,5) (E,9,4) (C,8,2)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 (f4). p (7th in post-order) is D. D's subtree: D → left F (→ left H [leaf], right I → right J → left K [leaf]), right G [leaf]. Using the node-count height convention (leaf=1, null=0): height(H)=height(K)=1, height(J)=2, height(I)=3, height(F)=4, height(G)=1, height(D)=1+max(4,1)=5 — matching the paper's D ability change (1→5) exactly.</p>
     <p><b>Note on the paper's printed example:</b> the paper's line 2 also shows node I's ability changing (9→3), even though the task only asks to set <code>p.info.ability</code> for p=D. No implementation of "compute D's height" that only touches D was found to reproduce this extra change on I — it may be a side effect specific to the original reference implementation's own height() helper. The verified, spec-faithful output (only D's ability changes) is used as the graded reference.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 (f4). p (thứ 7 post-order) là D. Cây con của D: D → trái F (→ trái H [lá], phải I → phải J → trái K [lá]), phải G [lá]. Dùng quy ước chiều cao đếm-số-node (lá=1, null=0): height(H)=height(K)=1, height(J)=2, height(I)=3, height(F)=4, height(G)=1, height(D)=1+max(4,1)=5 — khớp đúng với thay đổi ability của D trong đề (1→5).</p>
     <p><b>Lưu ý về ví dụ in trong đề gốc:</b> dòng 2 của đề còn hiện ability của node I đổi (9→3), dù đề chỉ yêu cầu đặt <code>p.info.ability</code> cho p=D. Không tìm ra cách cài đặt "tính chiều cao của D" nào chỉ đụng tới D mà lại tái tạo được thay đổi thừa này ở I — có thể là tác dụng phụ riêng của cách cài đặt height() trong bản gốc. Output đã verify, đúng theo đề bài (chỉ đổi ability của D) được dùng làm chuẩn chấm.</p>`,
  ),
  rubric: [
    { id: 'find_p', criterion: B('Correctly identifies p as the 7th node in post-order traversal.', 'Xác định đúng p là node thứ 7 theo post-order.'), weight: 1, maxScore: 0.3 },
    { id: 'height_and_set', criterion: B("Correctly computes the height of p's subtree (any consistent convention) and sets p.info.ability to that value.", 'Tính đúng chiều cao cây con của p (bất kỳ quy ước nhất quán nào) và đặt p.info.ability bằng giá trị đó.'), weight: 1, maxScore: 0.7 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE42',
    title: 'PE Đề 42 — Practical Exam (FA2023)|||PE Đề 42 — Thi thực hành (FA2023)',
    description: 'CSD201 PE (CODE): complete singly-linked-list + BST methods across 2 given NetBeans projects, AI-graded.|||PE CSD201 (viết mã): hoàn thiện method danh sách liên kết đơn + BST trên 2 project NetBeans given, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE42-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q1_4, q1_5, q1_6, q2_1, q2_2, q2_3, q2_4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
