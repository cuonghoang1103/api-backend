/**
 * build-csd201-pe41.mjs — sinh content/exams/CSD201-PE41.mjs.
 *
 * Nguồn thật: Đề 41 (CSD201_PE_FA23_NT_670164, "Paper No 1", 2 project
 * NetBeans: Q1=MyList<Lion> danh sách liên kết đơn, Q2=BSTree<Lion>). CÓ
 * kèm Solutions/ (Q1+Q2). Toàn bộ 10 method (5+5) VERIFY THẬT bằng javac+java,
 * đối chiếu byte-for-byte với "Expected output" in trong paper.pdf.
 *
 * CẢ 10/10 method khớp CHÍNH XÁC — kể cả Q2.f5 ("delete node bằng cách copy",
 * dạng câu từng lệch ở đề PE29) lần này khớp hoàn toàn với thuật toán chuẩn
 * successor-copy, không có sai lệch nào cần ghi chú.
 *
 * Riêng Q2.f3: trang PDF bị OCR hỏng, chữ đề bài hiện "(question text not
 * captured in images)" — không có mô tả bài toán bằng lời. Suy ra từ chính
 * code trong Solutions/Q2/BSTree.java (chỉ 4 dòng: đi theo p.right tới cùng
 * rồi in ra) = "in ra node có weight lớn nhất trong cây" — verify khớp với
 * "Expected output" (dòng đơn "(N,8,-1)") vẫn in đầy đủ trong PDF dù thiếu
 * phần lời dẫn.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE41.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE41.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE41-Given.zip';
const SRC = '/tmp/csd201-pe41-final';

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
// Q1: MyList<Lion> — 5 method
// ---------------------------------------------------------------------------
const myListGiven = fs.readFileSync(path.join(SRC, 'MyList.given.java'), 'utf8');
const myListSolved = fs.readFileSync(path.join(SRC, 'MyList.solved.java'), 'utf8');

const scenarioQ1En = `<p><strong>Scenario:</strong> Complete a Java singly-linked-list program of Lion objects (place, weight, color). Each of the 5 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ1Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java quản lý danh sách liên kết đơn các đối tượng Lion (place, weight, color). Mỗi trong 5 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ1En + `<p><strong>Câu 1: addLast() – 1 mark</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: <code>addLast(String xPlace, int xWeight, int xColor)</code></li><li>Task: if <code>xWeight == 6</code>, do nothing; otherwise, add a new node with place=xPlace, weight=xWeight, color=xColor to the end of the list.</li></ul>`,
    scenarioQ1Vi + `<p><strong>Câu 1: addLast() – 1 điểm</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: <code>addLast(String xPlace, int xWeight, int xColor)</code></li><li>Nhiệm vụ: nếu <code>xWeight == 6</code> thì không làm gì; ngược lại thêm node mới place=xPlace, weight=xWeight, color=xColor vào CUỐI danh sách.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(E,5,-2) (C,3,5) (K,-1,4) (X,2,-3) (Y,7,8)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly (node D, weight=6, is correctly excluded). Skip the node when <code>xWeight == 6</code>; otherwise append after <code>tail</code> (or set <code>head=tail=node</code> if the list was empty).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề (node D, weight=6, bị loại đúng). Bỏ qua node khi <code>xWeight == 6</code>; ngược lại nối node mới sau <code>tail</code> (hoặc gán <code>head=tail=node</code> nếu danh sách rỗng).</p>`,
  ),
  rubric: [
    { id: 'skip_weight6', criterion: B('Correctly skips insertion when weight == 6.', 'Bỏ qua đúng khi weight == 6.'), weight: 1, maxScore: 0.4 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list, handling both empty and non-empty list cases.', 'Nối đúng node mới vào cuối danh sách, xử lý đúng cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Insert two new nodes at specific positions</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: insert the two new nodes (B,7,2) and (A,4,1) into the list so that B becomes the 2nd node and A becomes the 3rd node.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Chèn 2 node mới vào vị trí cụ thể</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: chèn 2 node mới (B,7,2) và (A,4,1) vào danh sách sao cho B trở thành node thứ 2 và A trở thành node thứ 3.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,5,8) (D,2,-4) (E,1,3) (F,-2,4) (G,4,5)
(C,5,8) (B,7,2) (A,4,1) (D,2,-4) (E,1,3) (F,-2,4) (G,4,5)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — the final list (line 2) matches the paper's expected example exactly. Splice <code>b</code> in right after <code>head</code> (making it the 2nd node), then splice <code>a</code> in right after <code>b</code> (making it the 3rd node). (The paper's scanned page only shows the final line — line 1, the plain unmodified traversal, is derived directly from data.txt and the addLast rule, not shown separately in the source.)</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — dòng cuối (dòng 2) khớp chính xác ví dụ trong đề. Nối <code>b</code> vào ngay sau <code>head</code> (thành node thứ 2), rồi nối <code>a</code> vào ngay sau <code>b</code> (thành node thứ 3). (Trang scan của đề chỉ in dòng cuối cùng — dòng 1, tức danh sách gốc chưa sửa, được tự suy ra từ data.txt và luật addLast, không thấy in riêng trong nguồn.)</p>`,
  ),
  rubric: [
    { id: 'b_pos2', criterion: B('Correctly inserts B as the 2nd node (right after head).', 'Chèn đúng B thành node thứ 2 (ngay sau head).'), weight: 1, maxScore: 0.5 },
    { id: 'a_pos3', criterion: B('Correctly inserts A as the 3rd node (right after B).', 'Chèn đúng A thành node thứ 3 (ngay sau B).'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Delete the 4th element</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: assume the list contains at least 4 elements. Delete the fourth element of the original list.</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Xoá phần tử thứ 4</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử danh sách có ít nhất 4 phần tử. Xoá phần tử thứ 4 của danh sách gốc.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(X,4,5) (A,1,3) (B,5,8) (C,3,1) (D,-5,9) (E,7,2)
(X,4,5) (A,1,3) (B,5,8) (D,-5,9) (E,7,2)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 (f3) — output matches the paper's expected example exactly (the 4th node, C, is removed). Walk 3 nodes forward from <code>head</code> to reach the 3rd node, then unlink its <code>next</code> (the 4th node), re-pointing <code>tail</code> if the removed node was the tail.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 (f3) — output khớp chính xác ví dụ trong đề (node thứ 4, C, bị xoá). Duyệt 3 bước từ <code>head</code> tới node thứ 3, rồi unlink <code>next</code> của nó (node thứ 4), trỏ lại <code>tail</code> nếu node bị xoá chính là tail.</p>`,
  ),
  rubric: [
    { id: 'find_4th', criterion: B('Correctly identifies the 4th node of the original list.', 'Xác định đúng node thứ 4 của danh sách gốc.'), weight: 1, maxScore: 0.5 },
    { id: 'unlink', criterion: B('Correctly removes that node from the list, re-pointing tail if needed.', 'Xoá đúng node đó khỏi danh sách, trỏ lại tail nếu cần.'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Count lions</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: how many Lions are there in the list? Write the count to the output file (after the traversal already written by the given code).</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Đếm số Lion</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: có bao nhiêu Lion trong danh sách? Ghi số đếm ra file output (sau dòng duyệt danh sách đã có sẵn trong khung code).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(B,3,-4) (C,2,1) (L,4,7) (I,8,5) (J,-2,8) (W,1,9)
6`,
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
    `<p><strong>Câu 5: f5() – 1 mark: Sort descending by color</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f5()</code>, right after the marked comment</li><li>Task: sort the elements in descending order by color.</li></ul>`,
    `<p><strong>Câu 5: f5() – 1 điểm: Sort giảm dần theo color</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f5()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: sắp xếp các phần tử theo color GIẢM DẦN.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(M,5,3) (N,9,1) (P,4,-2) (Q,1,4) (R,7,9) (T,2,8)
(R,7,9) (T,2,8) (Q,1,4) (M,5,3) (N,9,1) (P,4,-2)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 5 (f5) — output matches the paper's expected example exactly. Selection sort keeping the maximum-color node found so far, swapping <code>info</code> fields only (node identities/links stay put).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 5 (f5) — output khớp chính xác ví dụ trong đề. Selection sort giữ node color lớn nhất tìm được, chỉ hoán đổi trường <code>info</code> (giữ nguyên node/liên kết).</p>`,
  ),
  rubric: [
    { id: 'sort_descending', criterion: B('Correctly sorts all nodes descending by color (any correct sorting algorithm).', 'Sắp xếp đúng mọi node giảm dần theo color (bất kỳ thuật toán sắp xếp đúng nào).'), weight: 1, maxScore: 1 },
  ],
};

// ---------------------------------------------------------------------------
// Q2: BSTree<Lion> — 5 method
// ---------------------------------------------------------------------------
const bsTreeGiven = fs.readFileSync(path.join(SRC, 'BSTree.given.java'), 'utf8');
const bsTreeSolved = fs.readFileSync(path.join(SRC, 'BSTree.solved.java'), 'utf8');

const scenarioQ2En = `<p><strong>Scenario:</strong> Complete a Java Binary Search Tree program of Lion objects (place, weight, color). <b>weight is the key of the tree and must be unique</b>. Each of the 5 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ2Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java cây nhị phân tìm kiếm (BST) các đối tượng Lion (place, weight, color). <b>weight là khoá của cây và phải DUY NHẤT</b>. Mỗi trong 5 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q2_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ2En + `<p><strong>Câu 1: insert() – 1 mark</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: add statements at the top of <code>insert(String xPlace, int xWeight, int xColor)</code> so that any node with <code>xPlace.charAt(0) == 'B'</code> is not inserted into the tree (the rest of insert — standard BST insert keyed by weight, rejecting duplicate weights — is already given).</li></ul>`,
    scenarioQ2Vi + `<p><strong>Câu 1: insert() – 1 điểm</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: thêm lệnh ở ĐẦU <code>insert(String xPlace, int xWeight, int xColor)</code> sao cho bất kỳ node nào có <code>xPlace.charAt(0) == 'B'</code> KHÔNG được chèn vào cây (phần còn lại của insert — chèn BST chuẩn theo weight, từ chối weight trùng — đã có sẵn).</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(A,6,2) (C,3,4) (D,9,-2) (E,1,3) (F,4,7) (G,8,-1)
(E,1,3) (C,3,4) (F,4,7) (A,6,2) (G,8,-1) (D,9,-2)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly. Node B is correctly excluded (place starts with 'B'); node XX is also correctly excluded, since its weight (6) duplicates node A's weight, and the already-given part of insert() rejects duplicate weights.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề. Node B bị loại đúng (place bắt đầu bằng 'B'); node XX cũng bị loại đúng, vì weight của nó (6) trùng weight của node A, và phần đã có sẵn của insert() từ chối weight trùng.</p>`,
  ),
  rubric: [
    { id: 'skip_b', criterion: B("Correctly skips insertion when place starts with 'B', leaving the rest of insert() untouched.", "Bỏ qua đúng khi place bắt đầu bằng 'B', giữ nguyên phần còn lại của insert()."), weight: 1, maxScore: 1 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Pre-order traversal filtered by color</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: perform a pre-order traversal from the root, but write only the nodes with <code>color &gt; 3</code> to file f2.txt. Hint: copy the given <code>preOrder(...)</code> to a new function (e.g. <code>preOrder2(...)</code>) and modify it.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Pre-order lọc theo color</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt pre-order từ root, nhưng chỉ ghi ra node có <code>color &gt; 3</code>. Gợi ý: copy <code>preOrder(...)</code> có sẵn thành hàm mới (ví dụ <code>preOrder2(...)</code>) rồi sửa hàm mới đó.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(N,5,-2) (C,3,9) (Q,8,5) (G,1,4) (T,7,6) (K,9,1) (Y,2,7)
(C,3,9) (G,1,4) (Y,2,7) (Q,8,5) (T,7,6)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly. Standard pre-order (root, left, right) over the whole tree, only writing a node when <code>color &gt; 3</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề. Pre-order chuẩn (gốc, trái, phải) trên toàn cây, chỉ ghi ra node khi <code>color &gt; 3</code>.</p>`,
  ),
  rubric: [
    { id: 'preorder_whole_tree', criterion: B('Correctly performs pre-order traversal (root, left, right) over the whole tree.', 'Duyệt đúng pre-order (gốc, trái, phải) trên toàn cây.'), weight: 1, maxScore: 0.4 },
    { id: 'filter_color', criterion: B('Only writes nodes with color > 3.', 'Chỉ ghi ra node có color > 3.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Find the node with maximum weight</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: since weight is the BST key, the node with the maximum weight is the rightmost node in the tree. Write only that single node to file f3.txt.</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Tìm node có weight lớn nhất</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: vì weight là khoá BST, node có weight lớn nhất chính là node NGOÀI CÙNG BÊN PHẢI của cây. Chỉ ghi ra đúng 1 node đó vào file f3.txt.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(N,8,-1)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 (f3) — output matches the paper's expected example exactly. <b>Note:</b> this question's task text is missing from the source scan (it reads "question text not captured in images" at this spot) — the task was recovered from the reference solution's own code (walk <code>p = p.right</code> until null, then write that single node), which is exactly "find the max-weight node", and the worked output block itself is intact and used as-is.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 (f3) — output khớp chính xác ví dụ trong đề. <b>Lưu ý:</b> phần lời dẫn của câu này bị thiếu trong bản scan nguồn (ghi "question text not captured in images" đúng chỗ đó) — nhiệm vụ được suy ra từ chính code lời giải mẫu (đi theo <code>p = p.right</code> tới khi null, rồi ghi ra đúng node đó), chính là "tìm node có weight lớn nhất", còn khối ví dụ output vẫn nguyên vẹn và được dùng trực tiếp.</p>`,
  ),
  rubric: [
    { id: 'find_rightmost', criterion: B('Correctly walks to the rightmost node of the tree (following .right until null) and writes only that node.', 'Đi đúng tới node ngoài cùng bên phải của cây (theo .right tới khi null) và chỉ ghi ra đúng node đó.'), weight: 1, maxScore: 1 },
  ],
};

const q2_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Print internal nodes</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: print all internal nodes of the tree (nodes with at least one child), in pre-order, after the pre-order traversal already written by the given code.</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: In các internal node</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: in ra tất cả internal node của cây (node có ít nhất 1 con), theo pre-order, sau dòng duyệt pre-order đã có sẵn trong khung code.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(W,6,2) (Q,1,4) (K,5,2) (L,4,8) (M,3,9) (N,9,5) (A,7,-3)
(W,6,2) (Q,1,4) (K,5,2) (L,4,8) (N,9,5)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 (f4) — output matches the paper's expected example exactly (M and A are the only leaves, correctly excluded). Recursively visit the tree pre-order (root, left, right), writing a node only when <code>left != null || right != null</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 (f4) — output khớp chính xác ví dụ trong đề (M và A là 2 leaf duy nhất, bị loại đúng). Duyệt đệ quy pre-order (gốc, trái, phải), chỉ ghi ra node khi <code>left != null || right != null</code>.</p>`,
  ),
  rubric: [
    { id: 'preorder_walk', criterion: B('Correctly walks the tree in pre-order (root, left, right) when checking each node.', 'Duyệt đúng cây theo pre-order (gốc, trái, phải) khi kiểm mỗi node.'), weight: 1, maxScore: 0.4 },
    { id: 'internal_check', criterion: B('Only writes nodes that have at least one non-null child.', 'Chỉ ghi ra node có ít nhất 1 con khác null.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_5 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 5: f5() – 1 mark: Delete the 2nd pre-order node by copying</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f5()</code>, right after the marked comment</li><li>Task: suppose p is the 2nd node obtained when performing the pre-order traversal of the tree. Delete node p by copying (find p's in-order successor — the leftmost node of p's right subtree — copy its content into p, then remove the successor from its original spot).</li></ul>`,
    `<p><strong>Câu 5: f5() – 1 điểm: Xoá node thứ 2 (pre-order) bằng cách copy</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f5()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử p là node thứ 2 khi duyệt pre-order cây. Xoá node p bằng cách copy (tìm node kế tiếp theo in-order của p — node trái nhất trong cây con phải của p — copy nội dung nó vào p, rồi gỡ node kế tiếp đó khỏi vị trí gốc).</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(K,7,9) (D,4,3) (H,2,6) (L,1,5) (Q,3,1) (C,6,-4) (G,9,-6) (M,8,7)
(K,7,9) (C,6,-4) (H,2,6) (L,1,5) (Q,3,1) (G,9,-6) (M,8,7)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 5 (f5) — output matches the paper's expected example exactly (unlike a similar-sounding question in another paper, this one reproduces the printed example precisely). p (the 2nd pre-order node) is D; D's in-order successor is C (the leftmost — and only — node of D's right subtree); C's content is copied into D's tree position, and since C had no children, D's right link becomes null after removing C.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 5 (f5) — output khớp chính xác ví dụ trong đề (khác với 1 câu tương tự ở đề khác, câu này khớp đúng hoàn toàn ví dụ in trong đề). p (node thứ 2 pre-order) là D; node kế tiếp in-order của D là C (node trái nhất — và duy nhất — trong cây con phải của D); nội dung C được copy vào đúng vị trí cây của D, và vì C không có con nào nên liên kết phải của D trở thành null sau khi gỡ C.</p>`,
  ),
  rubric: [
    { id: 'find_p', criterion: B('Correctly identifies p as the 2nd node in pre-order traversal.', 'Xác định đúng p là node thứ 2 theo pre-order.'), weight: 1, maxScore: 0.3 },
    { id: 'delete_by_copy', criterion: B('Correctly deletes p using a valid "delete by copying" technique (successor or predecessor copy), leaving a tree with exactly one fewer node and no structural corruption.', 'Xoá đúng p bằng kỹ thuật "xoá bằng copy" hợp lệ (successor hoặc predecessor), cây còn lại đúng ít hơn 1 node và không hỏng cấu trúc.'), weight: 1, maxScore: 0.7 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE41',
    title: 'PE Đề 41 — Practical Exam (FA2023)|||PE Đề 41 — Thi thực hành (FA2023)',
    description: 'CSD201 PE (CODE): complete singly-linked-list + BST methods across 2 given NetBeans projects, AI-graded.|||PE CSD201 (viết mã): hoàn thiện method danh sách liên kết đơn + BST trên 2 project NetBeans given, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE41-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q1_4, q1_5, q2_1, q2_2, q2_3, q2_4, q2_5],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
