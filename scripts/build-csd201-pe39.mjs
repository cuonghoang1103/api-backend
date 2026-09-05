/**
 * build-csd201-pe39.mjs — sinh content/exams/CSD201-PE39.mjs.
 *
 * Nguồn thật: Đề 39 (paperno_1.rar, "PaperNo_1", PESP 2024 Đề số 1, 3
 * project NetBeans: Q1=MyList<Bottle> 4 method, Q2=BSTree<Bottle> 4 method,
 * Q3=Graph 2 method). KHÔNG có solutions.rar — toàn bộ 10 method tự viết,
 * verify byte-for-byte bằng javac+java thật.
 *
 * CẢ 10/10 method khớp CHÍNH XÁC với "Expected output" in trong đề.
 *
 * ⛔⛔ Phát hiện quan trọng ở Q1.f3: đề bài VIẾT "remove the first node
 * having MAXIMUM COLOR" nhưng ví dụ số liệu in trong đề CHỈ khớp nếu thực
 * hiện theo VOLUME lớn nhất, không phải color — đã verify bằng cách tính
 * tay + chạy code cả 2 cách, chỉ "theo volume" mới cho đúng kết quả in
 * trong đề (nút bị xoá+chèn lại là G, có volume=8 lớn nhất — trùng với I
 * nhưng G đứng trước — chứ không phải F/H, hai node có color=9 lớn nhất
 * thật). Đây gần như chắc chắn là lỗi đánh máy trong đề gốc (color↔volume
 * bị đổi chỗ khi soạn đề) — đã cài đặt theo hành vi ĐÃ VERIFY (volume),
 * ghi chú rõ trong explanation.
 *
 * Dữ liệu ma trận trọng số Q3.f2 GIỐNG cấu trúc đồ thị các đề CSD201 khác
 * nhưng vài ô KHÁC (H→A=0 thay vì 1, I→C=99 thay vì 3) — đã xác nhận đây
 * KHÔNG phải bẫy data.txt cũ/build (chỉ có 1 bản data.txt duy nhất trong
 * given, không có bản build/classes/ nào khác) — chỉ đơn giản là đề này
 * dùng biến thể dữ liệu khác đề PE29, verify riêng bằng tay + chạy thật.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE39.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE39.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE39-Given.zip';
const SRC = '/tmp/csd201-pe39-final';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper).</p>
   <ol>
     <li>Software: NetBeans IDE 8.x, Java JDK 1.8. Download the given materials above — it contains 3 separate NetBeans projects: Q1 (MyList), Q2 (BSTree), Q3 (Graph).</li>
     <li>Each project's file (MyList.java / BSTree.java / Graph.java) has several methods to complete — only edit inside the marked "Student's code" sections. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into each code box — it is graded by AI against the rubric. You can build &amp; run the real given projects on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật).</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Tải given materials ở trên — gồm 3 project NetBeans riêng: Q1 (MyList), Q2 (BSTree), Q3 (Graph).</li>
     <li>Mỗi file (MyList.java / BSTree.java / Graph.java) có vài method cần hoàn thiện — chỉ sửa trong phần đánh dấu "Student's code". Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

// ---------------------------------------------------------------------------
// Q1: MyList<Bottle> — 4 method
// ---------------------------------------------------------------------------
const myListGiven = fs.readFileSync(path.join(SRC, 'MyList.given.java'), 'utf8');
const myListSolved = fs.readFileSync(path.join(SRC, 'MyList.solved.java'), 'utf8');

const scenarioQ1En = `<p><strong>Scenario:</strong> Complete a Java singly-linked-list program of Bottle objects (maker, volume, color). Each of the 4 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ1Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java quản lý danh sách liên kết đơn các đối tượng Bottle (maker, volume, color). Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ1En + `<p><strong>Câu 1: addLast() – 1 mark</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: <code>addLast(String xMaker, int xVolume, int xColor)</code></li><li>Task: if <code>xMaker.charAt(0) == 'B'</code>, do nothing; otherwise add a new node with maker=xMaker, volume=xVolume, color=xColor to the end of the list.</li></ul>`,
    scenarioQ1Vi + `<p><strong>Câu 1: addLast() – 1 điểm</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: <code>addLast(String xMaker, int xVolume, int xColor)</code></li><li>Nhiệm vụ: nếu <code>xMaker.charAt(0) == 'B'</code> thì không làm gì; ngược lại thêm node mới maker=xMaker, volume=xVolume, color=xColor vào CUỐI danh sách.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(A,9,8) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly (node B is correctly excluded). Skip when <code>xMaker.charAt(0) == 'B'</code>; otherwise append after <code>tail</code> (or set <code>head=tail=node</code> if empty).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề (node B bị loại đúng). Bỏ qua khi <code>xMaker.charAt(0) == 'B'</code>; ngược lại nối node mới sau <code>tail</code> (hoặc gán <code>head=tail=node</code> nếu rỗng).</p>`,
  ),
  rubric: [
    { id: 'skip_b', criterion: B("Correctly skips insertion when maker starts with 'B'.", "Bỏ qua đúng khi maker bắt đầu bằng 'B'."), weight: 1, maxScore: 0.4 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list, handling both empty and non-empty list cases.', 'Nối đúng node mới vào cuối danh sách, xử lý đúng cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Insert x, y, z at positions 0, 2, 3</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: there are 3 given Bottle objects x, y, z. Assume the list contains at least 3 elements. Insert x, y, z into the list so that x, y, z will be at positions 0, 2 and 3 (the head's position is 0).</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Chèn x, y, z vào vị trí 0, 2, 3</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: có 3 đối tượng Bottle x, y, z. Giả sử danh sách có ít nhất 3 phần tử. Chèn x, y, z vào danh sách sao cho x, y, z nằm ở vị trí 0, 2, 3 (vị trí head là 0).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)
(X,1,2) (C,9,8) (Y,2,3) (Z,3,4) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly. Insert x at position 0 (new head) first, then y at position 2, then z at position 3 (each insertion using a 0-indexed "insert at position" helper on the list as it stands after the previous insertion).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề. Chèn x vào vị trí 0 (head mới) trước, rồi y vào vị trí 2, rồi z vào vị trí 3 (mỗi lần chèn dùng 1 hàm phụ "chèn vào vị trí" 0-based trên danh sách ở trạng thái sau lần chèn trước).</p>`,
  ),
  rubric: [
    { id: 'x_pos0', criterion: B('Correctly inserts x as the new head (position 0).', 'Chèn đúng x thành head mới (vị trí 0).'), weight: 1, maxScore: 0.35 },
    { id: 'y_pos2', criterion: B('Correctly inserts y at position 2 (counting x already inserted).', 'Chèn đúng y vào vị trí 2 (đã tính cả x vừa chèn).'), weight: 1, maxScore: 0.3 },
    { id: 'z_pos3', criterion: B('Correctly inserts z at position 3 (counting x and y already inserted).', 'Chèn đúng z vào vị trí 3 (đã tính cả x, y vừa chèn).'), weight: 1, maxScore: 0.35 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Remove the max node and re-insert at position 2</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: assume the list contains at least 3 elements. Remove the first node having the maximum volume, then insert it at position 2 (the head's position is 0).</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Xoá node lớn nhất, chèn lại vào vị trí 2</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử danh sách có ít nhất 3 phần tử. Xoá node ĐẦU TIÊN có volume LỚN NHẤT, rồi chèn nó vào vị trí 2 (vị trí head là 0).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,7,6) (D,6,7) (E,3,8) (F,7,9) (G,8,7) (H,4,9) (I,8,3)
(C,7,6) (D,6,7) (G,8,7) (E,3,8) (F,7,9) (H,4,9) (I,8,3)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 (f3) — output matches the paper's expected example exactly. <b>Note:</b> the paper's own wording says "the first node having maximum <em>color</em>", but that description does not reproduce the printed example — the maximum color (9) belongs to F and H, and moving either of them does not match the shown result. The example is only reproduced by finding the first node with maximum <em>volume</em> instead (volume=8, tied between G and I, first is G) — G is removed and re-inserted at position 2, exactly matching the paper's output. This looks like a color/volume mix-up in how the original paper was worded; the verified, output-matching behavior (by volume) is implemented here.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 (f3) — output khớp chính xác ví dụ trong đề. <b>Lưu ý:</b> đề bài viết "node đầu tiên có <em>color</em> lớn nhất", nhưng mô tả đó không tái tạo được ví dụ in trong đề — color lớn nhất (9) thuộc về F và H, di chuyển một trong hai không khớp kết quả in ra. Ví dụ chỉ khớp khi tìm node đầu tiên có <em>volume</em> lớn nhất (volume=8, hoà giữa G và I, G đứng trước) — G bị xoá và chèn lại vào vị trí 2, khớp chính xác output của đề. Nhiều khả năng đề gốc bị nhầm lẫn color/volume khi soạn — hành vi đã verify khớp output (theo volume) được cài đặt ở đây.</p>`,
  ),
  rubric: [
    { id: 'find_first_max', criterion: B('Correctly finds the FIRST node with maximum volume (matching the verified worked example) and removes it.', 'Tìm đúng node ĐẦU TIÊN có volume lớn nhất (khớp ví dụ đã verify) và xoá nó.'), weight: 1, maxScore: 0.5 },
    { id: 'reinsert_pos2', criterion: B('Correctly re-inserts the removed node at position 2 of the remaining list.', 'Chèn lại đúng node vừa xoá vào vị trí 2 của danh sách còn lại.'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Change p's volume, sort everything before it</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: assume the list contains at least 6 elements and p is the 6th element in the list (1-indexed). Change the volume of p to 99, then sort all elements BEFORE p ascending by volume.</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Đổi volume của p, sort phần trước nó</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử danh sách có ít nhất 6 phần tử và p là phần tử thứ 6 (đếm từ 1). Đổi volume của p thành 99, rồi sắp xếp mọi phần tử TRƯỚC p tăng dần theo volume.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,8) (D,11,12) (E,8,7) (F,1,2) (I,7,9) (J,6,8) (K,5,6) (L,9,8) (M,3,4)
(F,1,2) (I,7,9) (E,8,7) (C,9,8) (D,11,12) (J,99,8) (K,5,6) (L,9,8) (M,3,4)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 (f4) — output matches the paper's expected example exactly. p (6th, 1-indexed) is J; its volume becomes 99. The 5 nodes before it (C,D,E,F,I) are sorted ascending by volume (F=1, I=7, E=8, C=9, D=11), while J and everything after (K,L,M) stay in place.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 (f4) — output khớp chính xác ví dụ trong đề. p (thứ 6, đếm từ 1) là J; volume của nó thành 99. 5 node trước nó (C,D,E,F,I) được sắp tăng dần theo volume (F=1, I=7, E=8, C=9, D=11), còn J và mọi thứ sau (K,L,M) giữ nguyên vị trí.</p>`,
  ),
  rubric: [
    { id: 'change_p', criterion: B("Correctly identifies p (the 6th element) and sets its volume to 99.", 'Xác định đúng p (phần tử thứ 6) và đặt volume của nó thành 99.'), weight: 1, maxScore: 0.4 },
    { id: 'sort_before', criterion: B('Correctly sorts only the elements strictly before p ascending by volume, leaving p and everything after untouched.', 'Sắp xếp đúng CHỈ các phần tử trước p tăng dần theo volume, giữ nguyên p và mọi thứ sau.'), weight: 1, maxScore: 0.6 },
  ],
};

// ---------------------------------------------------------------------------
// Q2: BSTree<Bottle> — 4 method
// ---------------------------------------------------------------------------
const bsTreeGiven = fs.readFileSync(path.join(SRC, 'BSTree.given.java'), 'utf8');
const bsTreeSolved = fs.readFileSync(path.join(SRC, 'BSTree.solved.java'), 'utf8');

const scenarioQ2En = `<p><strong>Scenario:</strong> Complete a Java Binary Search Tree program of Bottle objects (maker, volume, color). <b>volume is the key of the tree and must be unique</b>. Each of the 4 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ2Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java cây nhị phân tìm kiếm (BST) các đối tượng Bottle (maker, volume, color). <b>volume là khoá của cây và phải DUY NHẤT</b>. Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q2_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ2En + `<p><strong>Câu 1: insert() – 1 mark</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: <code>insert(String xMaker, int xVolume, int xColor)</code></li><li>Task: if <code>xMaker.charAt(0) == 'B'</code>, do nothing; otherwise insert a new Bottle object (volume is the key, must be unique) into the tree.</li></ul>`,
    scenarioQ2Vi + `<p><strong>Câu 1: insert() – 1 điểm</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: <code>insert(String xMaker, int xVolume, int xColor)</code></li><li>Nhiệm vụ: nếu <code>xMaker.charAt(0) == 'B'</code> thì không làm gì; ngược lại chèn 1 đối tượng Bottle mới (volume là khoá, phải duy nhất) vào cây.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(A,7,9) (C,4,3) (D,8,6) (E,2,5) (Y,6,-7) (F,-6,7)
(F,-6,7) (E,2,5) (C,4,3) (Y,6,-7) (A,7,9) (D,8,6)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly (node B is excluded; node X, volume=4 duplicating node C's volume, is also excluded by the uniqueness check).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề (node B bị loại; node X, volume=4 trùng volume của node C, cũng bị loại nhờ kiểm tra duy nhất).</p>`,
  ),
  rubric: [
    { id: 'skip_b', criterion: B("Correctly skips insertion when maker starts with 'B'.", "Bỏ qua đúng khi maker bắt đầu bằng 'B'."), weight: 1, maxScore: 0.3 },
    { id: 'bst_order', criterion: B('Correctly inserts respecting BST ordering by volume.', 'Chèn đúng thứ tự BST theo volume.'), weight: 1, maxScore: 0.4 },
    { id: 'unique_volume', criterion: B('Correctly rejects insertion when the volume already exists elsewhere in the tree.', 'Từ chối đúng khi volume đã tồn tại ở nơi khác trong cây.'), weight: 1, maxScore: 0.3 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Pre-order traversal filtered by color</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: perform a pre-order traversal from the root but display to file f2.txt only the nodes with <code>color &lt; 7</code>. Hint: copy the given <code>preOrder(...)</code> to a new function (e.g. <code>preOrder2(...)</code>) and modify it.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Pre-order lọc theo color</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt pre-order từ root nhưng chỉ hiện ra file f2.txt các node có <code>color &lt; 7</code>. Gợi ý: copy <code>preOrder(...)</code> có sẵn thành hàm mới (ví dụ <code>preOrder2(...)</code>) rồi sửa hàm mới đó.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (F,2,-1) (I,1,7) (K,-1,5) (J,3,9) (L,5,10) (M,4,6) (G,7,3) (E,9,4) (H,10,8)
(C,8,2) (D,6,1) (F,2,-1) (K,-1,5) (M,4,6) (G,7,3) (E,9,4)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly. Standard pre-order (root, left, right) over the whole tree, only writing a node when <code>color &lt; 7</code> (I with color=7 is correctly excluded, since 7 is not &lt; 7).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề. Pre-order chuẩn (gốc, trái, phải) trên toàn cây, chỉ ghi ra node khi <code>color &lt; 7</code> (I có color=7 bị loại đúng, vì 7 không &lt; 7).</p>`,
  ),
  rubric: [
    { id: 'preorder_whole_tree', criterion: B('Correctly performs pre-order traversal (root, left, right) over the whole tree.', 'Duyệt đúng pre-order (gốc, trái, phải) trên toàn cây.'), weight: 1, maxScore: 0.4 },
    { id: 'filter_color', criterion: B('Only writes nodes with color < 7.', 'Chỉ ghi ra node có color < 7.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Delete the 5th post-order node by copying</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: suppose p is the 5th node in the post-order traversal from the root. Delete node p by copying (standard in-order successor copy).</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Xoá node thứ 5 (post-order) bằng cách copy</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử p là node thứ 5 khi duyệt post-order từ root. Xoá node p bằng cách copy (thuật toán successor-copy chuẩn).</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(K,-1,5) (I,1,7) (M,4,6) (L,5,10) (J,3,9) (F,2,-1) (G,7,3) (D,6,1) (H,10,8) (E,9,4) (C,8,2)
(K,-1,5) (I,1,7) (L,5,10) (M,4,6) (F,2,-1) (G,7,3) (D,6,1) (H,10,8) (E,9,4) (C,8,2)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 (f3) — output matches the paper's expected example exactly. p (5th in post-order K,I,M,L,J,...) is J; J has a right child L only (no left child), so J is unlinked directly and replaced by L (a simple single-child splice — no successor search needed since J.left is null).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 (f3) — output khớp chính xác ví dụ trong đề. p (thứ 5 theo post-order K,I,M,L,J,...) là J; J chỉ có con phải L (không có con trái), nên J được gỡ trực tiếp và thay bằng L (chỉ là nối 1-con đơn giản — không cần tìm successor vì J.left null).</p>`,
  ),
  rubric: [
    { id: 'find_p', criterion: B('Correctly identifies p as the 5th node in post-order traversal.', 'Xác định đúng p là node thứ 5 theo post-order.'), weight: 1, maxScore: 0.4 },
    { id: 'delete_by_copy', criterion: B('Correctly deletes p using a valid "delete by copying" technique, leaving a tree with exactly one fewer node and no structural corruption.', 'Xoá đúng p bằng kỹ thuật "xoá bằng copy" hợp lệ, cây còn lại đúng ít hơn 1 node và không hỏng cấu trúc.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Count the sub-tree of the 3rd two-children node</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: suppose p is the 3rd node having 2 children in the pre-order traversal from the root. Calculate the number of nodes in the sub-tree with root p. If this number is k, then change <code>p.info.color</code> to 100+k.</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Đếm cây con của node có 2 con thứ 3</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử p là node thứ 3 có ĐỦ 2 con khi duyệt pre-order từ root. Tính số node trong cây con gốc p. Nếu số đó là k, đổi <code>p.info.color</code> thành 100+k.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (F,2,-1) (I,1,7) (K,-1,5) (J,3,9) (L,5,10) (M,4,6) (G,7,3) (E,9,4) (H,10,8)
(C,8,2) (D,6,1) (F,2,106) (I,1,7) (K,-1,5) (J,3,9) (L,5,10) (M,4,6) (G,7,3) (E,9,4) (H,10,8)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 (f4) — output matches the paper's expected example exactly. Scanning pre-order for nodes with both children non-null gives C, D, F as the first three (F is the 3rd); F's subtree contains F, I, K, J, L, M — 6 nodes — so <code>k=6</code> and F's color becomes 106.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 (f4) — output khớp chính xác ví dụ trong đề. Duyệt pre-order tìm node có đủ 2 con cho ra C, D, F là 3 node đầu tiên (F là thứ 3); cây con của F gồm F, I, K, J, L, M — 6 node — nên <code>k=6</code> và color của F thành 106.</p>`,
  ),
  rubric: [
    { id: 'find_p', criterion: B('Correctly identifies p as the 3rd node (in pre-order) having exactly 2 children.', 'Xác định đúng p là node thứ 3 (theo pre-order) có đủ 2 con.'), weight: 1, maxScore: 0.4 },
    { id: 'count_and_set', criterion: B("Correctly counts the total nodes in p's subtree and sets p.info.color to 100 plus that count.", 'Đếm đúng tổng số node trong cây con của p và đặt p.info.color bằng 100 cộng số đó.'), weight: 1, maxScore: 0.6 },
  ],
};

// ---------------------------------------------------------------------------
// Q3: Graph — 2 method
// ---------------------------------------------------------------------------
const graphGiven = fs.readFileSync(path.join(SRC, 'Graph.given.java'), 'utf8');
const graphSolved = fs.readFileSync(path.join(SRC, 'Graph.solved.java'), 'utf8');

const scenarioQ3En = `<p><strong>Scenario:</strong> Complete a Java program on a directed/weighted graph represented by an adjacency matrix. Each of the 2 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ3Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java trên đồ thị (có hướng/có trọng số) biểu diễn bằng ma trận kề. Mỗi trong 2 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q3_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ3En + `<p><strong>Câu 1: f1() – 1 mark: Breadth-first traversal displaying a vertex range</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>f1()</code>, right after the marked comment</li><li>Task: perform breadth-first traversal (to file f1.txt) from vertex i=3 (vertex D) but display only 5 vertices — from the 4th visited vertex to the 8th. Hint: copy <code>breadth(...)</code> to a new function (e.g. <code>breadth2(...)</code>) and modify it.</li></ul>`,
    scenarioQ3Vi + `<p><strong>Câu 1: f1() – 1 điểm: Duyệt rộng, hiện 1 đoạn đỉnh</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>f1()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt theo chiều rộng (ghi vào f1.txt) từ đỉnh i=3 (đỉnh D) nhưng chỉ hiện 5 đỉnh — từ đỉnh thăm thứ 4 tới thứ 8. Gợi ý: copy <code>breadth(...)</code> thành hàm mới (ví dụ <code>breadth2(...)</code>) rồi sửa hàm mới đó.</li></ul>`,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `D A G B C E H I F
B C E H I`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly. This is a directed graph, so vertex F (only reachable via an edge INTO C, not out of it) is unreached by the main BFS from D and only appears at the end via the given fallback loop that restarts BFS from any still-unvisited vertex. <code>breadth2(...)</code> is a copy of <code>breadth(...)</code> keeping a running visit-position counter, writing a vertex only when that counter is between 4 and 8 inclusive.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề. Đây là đồ thị CÓ HƯỚNG, nên đỉnh F (chỉ có cạnh ĐI VÀO từ C, không có cạnh đi ra) không được BFS chính từ D chạm tới, chỉ xuất hiện ở cuối nhờ vòng lặp dự phòng có sẵn khởi động lại BFS từ đỉnh còn chưa thăm. <code>breadth2(...)</code> là bản copy của <code>breadth(...)</code>, giữ biến đếm vị trí thăm, chỉ ghi ra đỉnh khi biến đếm đó nằm trong khoảng 4 đến 8.</p>`,
  ),
  rubric: [
    { id: 'breadth_copy', criterion: B('Correctly performs the same breadth-first traversal (including the disconnected-component fallback) as the given breadth(...).', 'Duyệt đúng theo chiều rộng (kể cả phần dự phòng cho thành phần không liên thông) giống breadth(...) có sẵn.'), weight: 1, maxScore: 0.4 },
    { id: 'range_filter', criterion: B('Only writes vertices that are the 4th through 8th visited overall.', 'Chỉ ghi ra đỉnh là đỉnh thăm thứ 4 đến thứ 8.'), weight: 1, maxScore: 0.6 },
  ],
};

const q3_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Two Dijkstra shortest-path runs</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: (1) apply Dijkstra to find the shortest PATH from vertex 1 (B) to vertex 5 (F), writing every vertex of that path on line 1. (2) Apply Dijkstra from vertex 0 (A) to vertex 6 (G): write the last 3 vertices selected into the set S on line 2, then write every vertex of the actual shortest path to G together with its label (shortest distance from A) on line 3. (Note: in the weighted matrix, value 99 is considered as infinity.)</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: 2 lượt Dijkstra tìm đường ngắn nhất</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: (1) áp dụng Dijkstra tìm ĐƯỜNG ĐI ngắn nhất từ đỉnh 1 (B) tới đỉnh 5 (F), ghi mọi đỉnh trên đường đi đó ra dòng 1. (2) Áp dụng Dijkstra từ đỉnh 0 (A) tới đỉnh 6 (G): ghi 3 đỉnh SAU CÙNG được chọn vào tập S ra dòng 2, rồi ghi mọi đỉnh trên đường đi ngắn nhất thật tới G cùng nhãn của nó (khoảng cách ngắn nhất từ A) ra dòng 3. (Lưu ý: trong ma trận trọng số, giá trị 99 coi là vô cùng.)</li></ul>`,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `B C E D F
D F G
A|0 B|10 C|12 E|15 D|19 G|29`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly. Part 1: the shortest path from B to F is B→C→E→D→F (distance 14). Part 2: Dijkstra's full selection order from A is A,I,B,C,H,E,D,F,G — the last 3 are D, F, G; the shortest path to G is A→B→C→E→D→G with distances 0,10,12,15,19,29.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề. Phần 1: đường ngắn nhất từ B tới F là B→C→E→D→F (khoảng cách 14). Phần 2: thứ tự chọn đầy đủ của Dijkstra từ A là A,I,B,C,H,E,D,F,G — 3 đỉnh cuối là D, F, G; đường ngắn nhất tới G là A→B→C→E→D→G với khoảng cách 0,10,12,15,19,29.</p>`,
  ),
  rubric: [
    { id: 'path_b_to_f', criterion: B('Correctly runs Dijkstra from B to F and reports the actual vertex sequence of the shortest path.', 'Chạy đúng Dijkstra từ B tới F và báo đúng dãy đỉnh của đường đi ngắn nhất.'), weight: 1, maxScore: 0.35 },
    { id: 'last3_selected', criterion: B('Correctly runs Dijkstra from A to G and reports the last 3 vertices selected into S.', 'Chạy đúng Dijkstra từ A tới G và báo đúng 3 đỉnh cuối được chọn vào S.'), weight: 1, maxScore: 0.35 },
    { id: 'path_a_to_g', criterion: B('Correctly reports the actual shortest path from A to G together with each vertex\'s distance label.', 'Báo đúng đường đi ngắn nhất thật từ A tới G kèm nhãn khoảng cách từng đỉnh.'), weight: 1, maxScore: 0.3 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE39',
    title: 'PE Đề 39 — Practical Exam (SP2024, Đề số 1)|||PE Đề 39 — Thi thực hành (SP2024, Đề số 1)',
    description: 'CSD201 PE (CODE): complete singly-linked-list + BST + Graph methods across 3 given NetBeans projects, AI-graded.|||PE CSD201 (viết mã): hoàn thiện method danh sách liên kết đơn + BST + Graph trên 3 project NetBeans given, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE39-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q1_4, q2_1, q2_2, q2_3, q2_4, q3_1, q3_2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
