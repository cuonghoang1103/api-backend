/**
 * build-csd201-pe29.mjs — sinh content/exams/CSD201-PE29.mjs.
 *
 * Nguồn thật: Đề 29 (CSD201_FA24_PE_785660, "Đề số 7", 3 project NetBeans
 * riêng: Q1=MyList (danh sách liên kết đơn), Q2=BSTree, Q3=Graph). Given +
 * solutions.rar đã giải nén vào /tmp/csd201-pe29-final (MyList/BSTree/Graph
 * .given.java + .solved.java). Lời giải đã VERIFY THẬT bằng javac+java, đối
 * chiếu byte-for-byte với "Expected output" in trong paper.pdf — TRỪ 2 chỗ
 * đã xác nhận sai lệch với chính ví dụ in trong đề (ghi rõ trong explanation
 * từng câu, xem thêm ghi chú cuối file):
 *   - Q1.f4 (sort 6 phần tử sau node D theo màu tăng dần): 2 thuật toán sắp
 *     xếp độc lập (selection sort + insertion sort) đều cho kết quả GIỐNG
 *     NHAU và THỰC SỰ tăng dần, khác ví dụ in trong đề (đề in ngược thứ tự
 *     I/L ở 1 cặp — không tăng dần đúng nghĩa). Dùng kết quả đã verify.
 *   - Q2.f3 (xoá node thứ 6 theo BFS "bằng cách copy"): lời giải solutions.rar
 *     có bug (không tìm ra fa, không xoá được gì). Đã viết lại theo thuật
 *     toán chuẩn (successor-copy), fa khớp đề (E,9,4), số node sau khi xoá
 *     đúng (giảm 1), nhưng thứ tự breadth-first sau khi xoá lệch với ví dụ
 *     in trong đề ở vài node cuối — không dò ra được quy ước cụ thể của bản
 *     gốc dù đã thử nhiều biến thể thuật toán, dùng bản chuẩn SGK đã verify.
 * Ngoài ra Q2.f1 (insert): solutions.rar THIẾU kiểm tra "color phải duy nhất"
 * (đề ghi rõ "color is the key of the tree, thus it must be unique") — đã vá,
 * verify khớp 100% với ví dụ trong đề sau khi vá.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE29.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE29.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE29-Given.zip';
const SRC = '/tmp/csd201-pe29-final';

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
// Q1: MyList (danh sách liên kết đơn) — 4 method: addLast, f2-insert, f3-swap, f4-sort
// ---------------------------------------------------------------------------
const myListGiven = fs.readFileSync(path.join(SRC, 'MyList.given.java'), 'utf8');
const myListSolved = fs.readFileSync(path.join(SRC, 'MyList.solved.java'), 'utf8');

const scenarioQ1En = `<p><strong>Scenario:</strong> Complete a Java singly-linked-list program of Cala objects (owner, horn, color). Each of the 4 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ1Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java quản lý danh sách liên kết đơn các đối tượng Cala (owner, horn, color). Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ1En + `<p><strong>Câu 1: addLast() – 1 mark</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: <code>addLast(String xOwner, int xHorn, int xColor)</code></li><li>Task: check if <code>xOwner.charAt(0)=='A'</code> then do nothing, otherwise add a new node with owner=xOwner, horn=xHorn, color=xColor to the END of the list.</li></ul>`,
    scenarioQ1Vi + `<p><strong>Câu 1: addLast() – 1 điểm</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: <code>addLast(String xOwner, int xHorn, int xColor)</code></li><li>Nhiệm vụ: nếu <code>xOwner.charAt(0)=='A'</code> thì không làm gì, ngược lại thêm node mới owner=xOwner, horn=xHorn, color=xColor vào CUỐI danh sách.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly. Skip nodes whose owner starts with 'A'; otherwise append a new node after <code>tail</code> (or set <code>head=tail=node</code> if the list was empty).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề. Bỏ qua node có owner bắt đầu bằng 'A'; ngược lại nối node mới sau <code>tail</code> (hoặc gán <code>head=tail=node</code> nếu danh sách rỗng).</p>`,
  ),
  rubric: [
    { id: 'skip_a', criterion: B("Correctly skips insertion when owner starts with 'A'.", "Bỏ qua đúng khi owner bắt đầu bằng 'A'."), weight: 1, maxScore: 0.3 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list, handling both empty and non-empty list cases.', 'Nối đúng node mới vào cuối danh sách, xử lý đúng cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 0.7 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Insert 3 nodes at specific positions</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: there are 3 given Cala objects x, y, z. Assume the list contains at least 3 elements. Write statements to insert x, y and z into the list so that x, y, z will be at positions 1, 4 and 6 (the head's position is 0).</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Chèn 3 node vào vị trí cụ thể</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: có 3 đối tượng Cala x, y, z. Giả sử danh sách có ít nhất 3 phần tử. Viết lệnh chèn x, y, z vào danh sách sao cho x, y, z nằm ở vị trí 1, 4, 6 (vị trí head là 0).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)
(C,9,8) (X,1,2) (D,6,3) (E,8,5) (Y,2,3) (F,5,4) (Z,3,4) (I,4,9) (J,3,7)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly (both the unmodified list on line 1, and the list with x/y/z inserted at positions 1, 4, 6 on line 2). Each insertion walks from <code>head</code> counting nodes, then splices the new node in after the node currently at the target position minus one.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề (cả dòng danh sách gốc và dòng đã chèn x/y/z ở vị trí 1, 4, 6). Mỗi lần chèn duyệt từ <code>head</code> đếm node, rồi nối node mới vào sau node đang ở vị trí đích trừ 1.</p>`,
  ),
  rubric: [
    { id: 'pos1', criterion: B('Correctly inserts x at position 1.', 'Chèn đúng x vào vị trí 1.'), weight: 1, maxScore: 0.35 },
    { id: 'pos4', criterion: B('Correctly inserts y at position 4 (counting the already-inserted x).', 'Chèn đúng y vào vị trí 4 (tính cả x vừa chèn).'), weight: 1, maxScore: 0.35 },
    { id: 'pos6', criterion: B('Correctly inserts z at position 6 (counting x and y already inserted).', 'Chèn đúng z vào vị trí 6 (tính cả x, y vừa chèn).'), weight: 1, maxScore: 0.3 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Swap tail with the first max-color node</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: suppose p is the first node having maximum color in the list. Swap the contents of <code>tail</code> and p (thus if p=tail then do nothing).</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Hoán đổi tail với node màu lớn nhất đầu tiên</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử p là node ĐẦU TIÊN có color lớn nhất trong danh sách. Hoán đổi nội dung của <code>tail</code> và p (nếu p=tail thì không làm gì).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,7,6) (D,6,7) (E,3,8) (F,7,9) (G,8,7) (H,4,9) (I,8,3)
(C,7,6) (D,6,7) (E,3,8) (I,8,3) (G,8,7) (H,4,9) (F,7,9)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 (f3) — output matches the paper's expected example exactly. Scan the list once for the first node with the maximum color (first occurrence wins on ties), then swap only the <code>info</code> fields (Cala objects) of that node and <code>tail</code> — not the node objects themselves.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 (f3) — output khớp chính xác ví dụ trong đề. Duyệt 1 lượt tìm node ĐẦU TIÊN có color lớn nhất (gặp trước thắng khi bằng nhau), rồi chỉ hoán đổi trường <code>info</code> (đối tượng Cala) của node đó với <code>tail</code> — không hoán đổi bản thân node.</p>`,
  ),
  rubric: [
    { id: 'find_max', criterion: B('Correctly finds the FIRST node with maximum color when scanning left to right.', 'Tìm đúng node ĐẦU TIÊN có color lớn nhất khi duyệt từ trái qua phải.'), weight: 1, maxScore: 0.5 },
    { id: 'swap_or_noop', criterion: B('Swaps the info (content) of that node and tail, or does nothing when the max node already is tail.', 'Hoán đổi đúng info (nội dung) của node đó với tail, hoặc không làm gì khi node max chính là tail.'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Sort 6 nodes after a marker node</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: suppose there is only one node p having owner="D", and there are at least 6 nodes after p. Sort the 6 nodes immediately after p ascendingly by color (any node beyond those 6 is left untouched).</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Sắp xếp 6 node sau 1 node mốc</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử chỉ có duy nhất 1 node p có owner="D", và có ít nhất 6 node sau p. Sắp xếp 6 node ngay sau p theo color tăng dần (node nào ngoài 6 node đó thì giữ nguyên).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,8) (D,11,12) (E,8,7) (F,1,2) (I,7,9) (J,6,8) (K,5,6) (L,9,8) (M,3,4)
(C,9,8) (D,11,12) (F,1,2) (K,5,6) (E,8,7) (J,6,8) (L,9,8) (I,7,9) (M,3,4)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 (f4). Find node D, collect exactly the 6 nodes right after it into an array, selection-sort that array ascending by color swapping <code>info</code> fields only (node identities/links stay put), then write out the full list — the 7th node after D (here M) and everything before D is untouched.</p>
     <p><b>Note on the paper's printed example:</b> the paper shows the two tied color-8 nodes (J and L) with node I (color 9) appearing between them, which is not a fully ascending order. Two independent correctly-implemented sorts (selection sort and insertion sort) both verified via actual compilation agree on the fully-ascending result shown above (…F,K,E,J,L,I,M — colors 2,6,7,8,8,9,4-untouched), which is used here as the graded reference instead of reproducing the paper's apparent transcription slip.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 (f4). Tìm node D, gom đúng 6 node ngay sau nó vào 1 mảng, selection sort mảng đó tăng dần theo color (chỉ hoán đổi trường <code>info</code>, giữ nguyên node/liên kết), rồi ghi lại toàn bộ danh sách — node thứ 7 sau D (ở đây là M) và mọi thứ trước D giữ nguyên.</p>
     <p><b>Lưu ý về ví dụ in trong đề gốc:</b> đề in 2 node cùng color=8 (J và L) với node I (color=9) nằm CHEN GIỮA chúng, tức không thực sự tăng dần liên tục. Hai thuật toán sắp xếp độc lập (selection sort và insertion sort), cả hai đều đã verify bằng compile+chạy thật, đồng thuận cho kết quả tăng dần đúng nghĩa như trên (…F,K,E,J,L,I,M — color 2,6,7,8,8,9, M giữ nguyên) — dùng kết quả này làm chuẩn chấm thay vì lặp lại chỗ có vẻ là lỗi in ấn của đề gốc.</p>`,
  ),
  rubric: [
    { id: 'find_marker', criterion: B('Correctly finds the unique node with owner "D" and identifies exactly the 6 nodes immediately after it.', 'Tìm đúng node duy nhất owner="D" và xác định đúng 6 node ngay sau nó.'), weight: 1, maxScore: 0.3 },
    { id: 'sort_ascending', criterion: B('Correctly sorts those 6 nodes ascending by color (any correct sorting algorithm), leaving the 7th+ node and everything before the marker untouched.', 'Sắp xếp đúng 6 node đó tăng dần theo color (bất kỳ thuật toán sắp xếp đúng nào), giữ nguyên node thứ 7 trở đi và mọi thứ trước node mốc.'), weight: 1, maxScore: 0.7 },
  ],
};

// ---------------------------------------------------------------------------
// Q2: BSTree — 4 method: insert, f2 (partial breadth), f3 (delete by copy), f4 (rotate)
// ---------------------------------------------------------------------------
const bsTreeGiven = fs.readFileSync(path.join(SRC, 'BSTree.given.java'), 'utf8');
const bsTreeSolved = fs.readFileSync(path.join(SRC, 'BSTree.solved.java'), 'utf8');

const scenarioQ2En = `<p><strong>Scenario:</strong> Complete a Java Binary Search Tree program of Cala objects (owner, horn, color). <b>color is the key of the tree and must be unique</b> — a value that duplicates an existing node's color must be rejected. Each of the 4 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ2Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java cây nhị phân tìm kiếm (BST) các đối tượng Cala (owner, horn, color). <b>color là khoá của cây và phải DUY NHẤT</b> — giá trị trùng color với node đã có phải bị từ chối. Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q2_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ2En + `<p><strong>Câu 1: insert() – 1 mark</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: <code>insert(String xOwner, int xHorn, int xColor)</code></li><li>Task: check if <code>xOwner.charAt(0)=='A'</code> then do nothing, otherwise insert a new Cala object with owner=xOwner, horn=xHorn, color=xColor into the tree (horn and color can be arbitrary, even negative values). Remember: color must be unique in the tree.</li></ul>`,
    scenarioQ2Vi + `<p><strong>Câu 1: insert() – 1 điểm</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: <code>insert(String xOwner, int xHorn, int xColor)</code></li><li>Nhiệm vụ: nếu <code>xOwner.charAt(0)=='A'</code> thì không làm gì, ngược lại chèn 1 đối tượng Cala mới owner=xOwner, horn=xHorn, color=xColor vào cây (horn và color có thể tuỳ ý, kể cả âm). Nhớ: color phải duy nhất trong cây.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(B,9,4) (C,4,3) (D,8,6) (Y,6,-7) (E,2,5) (F,-6,7)
(Y,6,-7) (C,4,3) (B,9,4) (E,2,5) (D,8,6) (F,-6,7)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly (6 nodes: B,C,D,E,F,Y). Standard BST insert comparing by <code>color</code>; skip when owner starts with 'A'; <b>reject (return immediately) when the tree already contains a node with the same color</b> — the source data has both node E and node X with color=5, and per the paper's explicit "color must be unique" rule, X (inserted after E) must be rejected, leaving it out of the tree entirely.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề (6 node: B,C,D,E,F,Y). Chèn BST chuẩn so sánh theo <code>color</code>; bỏ qua khi owner bắt đầu bằng 'A'; <b>từ chối (return ngay) khi cây đã có node cùng color</b> — dữ liệu nguồn có cả node E và node X cùng color=5, và theo đúng luật "color phải duy nhất" đề nêu rõ, X (chèn sau E) phải bị từ chối, không xuất hiện trong cây.</p>`,
  ),
  rubric: [
    { id: 'skip_a', criterion: B("Correctly skips insertion when owner starts with 'A'.", "Bỏ qua đúng khi owner bắt đầu bằng 'A'."), weight: 1, maxScore: 0.2 },
    { id: 'bst_order', criterion: B('Correctly inserts respecting BST ordering by color.', 'Chèn đúng thứ tự BST theo color.'), weight: 1, maxScore: 0.4 },
    { id: 'unique_color', criterion: B('Correctly rejects insertion when the color already exists elsewhere in the tree (color is the unique key).', 'Từ chối đúng khi color đã tồn tại ở nơi khác trong cây (color là khoá duy nhất).'), weight: 1, maxScore: 0.4 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Breadth-first display of nodes with non-empty left child</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: perform a breadth-first traversal from the root but display to the file only nodes with a non-empty left child. Hint: copy the given <code>breadth(...)</code> function to a new function (e.g. <code>breadth2(...)</code>) and modify the latter one.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Duyệt rộng, chỉ hiện node có left-child</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt theo chiều rộng (breadth-first) từ root nhưng chỉ ghi ra file những node có left-child KHÔNG rỗng. Gợi ý: copy hàm <code>breadth(...)</code> có sẵn thành hàm mới (ví dụ <code>breadth2(...)</code>) rồi sửa hàm mới đó.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)
(C,8,2) (D,6,1) (E,9,4) (H,10,8) (I,1,7)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly. Same queue-based level-order traversal as the given <code>breadth(...)</code>, but only calls <code>fvisit</code> for a dequeued node when <code>node.left != null</code> (still enqueues both children as usual so the traversal order over the whole tree is unaffected).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề. Vẫn duyệt theo mức bằng hàng đợi giống <code>breadth(...)</code> có sẵn, nhưng chỉ gọi <code>fvisit</code> cho node vừa lấy ra khi <code>node.left != null</code> (vẫn enqueue cả 2 con như bình thường nên thứ tự duyệt toàn cây không đổi).</p>`,
  ),
  rubric: [
    { id: 'traverse', criterion: B('Correctly performs breadth-first (level-order) traversal over the whole tree using a queue, same shape as the given breadth(...).', 'Duyệt đúng theo chiều rộng (level-order) trên toàn cây bằng hàng đợi, cùng khuôn với breadth(...) có sẵn.'), weight: 1, maxScore: 0.4 },
    { id: 'filter_left', criterion: B('Only writes a node to the file when it has a non-empty left child.', 'Chỉ ghi node ra file khi node đó có left-child không rỗng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Delete the 6th breadth-first node by copying</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: suppose p is the 6th node when performing the breadth-first traversal of the tree, and fa is p's father. Delete p by copying (use the in-order successor of p, copy its content into p, then remove the successor node from its original spot). The output file must contain 3 lines: line 1 (breadth-first order before) and line 3 (breadth-first order after) are already given/written by the surrounding code; you write line 2 using <code>f.writeBytes(fa.info + "\\r\\n")</code>.</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Xoá node thứ 6 (BFS) bằng cách copy</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử p là node thứ 6 khi duyệt theo chiều rộng, fa là cha của p. Xoá p bằng cách copy (dùng node kế tiếp theo thứ tự in-order của p, copy nội dung nó vào p, rồi gỡ node kế tiếp đó khỏi vị trí gốc). File output phải có 3 dòng: dòng 1 (BFS trước) và dòng 3 (BFS sau) đã có sẵn trong khung code; bạn ghi dòng 2 bằng <code>f.writeBytes(fa.info + "\\r\\n")</code>.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)
(E,9,4)
(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (J,3,9) (I,1,7) (L,5,10) (K,-1,5) (M,4,6)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 (f3). p (the 6th BFS node) is H; fa (H's father) is E — line 2 <code>(E,9,4)</code> matches the paper exactly, confirming p/fa are correctly identified. Standard "delete by copying" via in-order successor: find the leftmost node of p's right subtree (here J, since J has no left child), copy its info into p (p's tree position/links are otherwise untouched), then unlink the successor from its original spot (replace it with its own right child, here L, at its parent).</p>
     <p><b>Note on the paper's printed example:</b> the paper's line 3 shows a different final ordering of the I/J/K/L/M nodes than this (textbook-standard) successor-copy implementation produces, even though both agree exactly on p, fa, and the total node count after deletion (10). Several equivalent deletion conventions (successor-copy, predecessor-copy, and variants of each) were tried and none reproduced the paper's exact child ordering — the standard, verified-by-execution algorithm is used here as the graded reference.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 (f3). p (node thứ 6 theo BFS) là H; fa (cha của H) là E — dòng 2 <code>(E,9,4)</code> khớp chính xác với đề, xác nhận p/fa xác định đúng. "Xoá bằng copy" chuẩn qua node kế tiếp in-order: tìm node trái nhất trong cây con phải của p (ở đây là J, vì J không có con trái), copy info của nó vào p (vị trí/liên kết của p trong cây giữ nguyên), rồi gỡ node kế tiếp đó khỏi vị trí gốc (thay bằng con phải của chính nó, ở đây là L, tại cha của nó).</p>
     <p><b>Lưu ý về ví dụ in trong đề gốc:</b> dòng 3 của đề in thứ tự cuối cùng của các node I/J/K/L/M khác với cách cài đặt chuẩn SGK (xoá bằng copy qua successor) này, dù cả hai đều khớp chính xác p, fa, và tổng số node sau khi xoá (10). Đã thử nhiều biến thể tương đương (successor-copy, predecessor-copy và các biến thể) nhưng không dò ra được đúng quy ước thứ tự con của bản gốc — dùng thuật toán chuẩn đã verify bằng thực thi làm chuẩn chấm.</p>`,
  ),
  rubric: [
    { id: 'find_p_fa', criterion: B("Correctly identifies p (the 6th breadth-first node) and its father fa, writing fa's info on line 2 exactly as the paper's example shows.", 'Xác định đúng p (node thứ 6 theo BFS) và cha fa, ghi đúng info của fa ở dòng 2 khớp ví dụ trong đề.'), weight: 1, maxScore: 0.4 },
    { id: 'delete_by_copy', criterion: B('Correctly deletes p using a valid "delete by copying" technique (successor or predecessor copy), leaving a tree with exactly one fewer node and no structural corruption (still a valid BST by color).', 'Xoá đúng p bằng kỹ thuật "xoá bằng copy" hợp lệ (successor hoặc predecessor), cây còn lại đúng ít hơn 1 node và không hỏng cấu trúc (vẫn là BST hợp lệ theo color).'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Rotate left at the 3rd node having a right child (pre-order)</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: suppose p is the 3rd node having a right-child when performing the pre-order traversal of the tree from the root. Rotate p to the left.</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Xoay trái tại node thứ 3 có right-child (pre-order)</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử p là node thứ 3 có right-child khi duyệt pre-order từ root. Xoay trái tại p.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)
(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (J,3,9) (H,10,8) (L,5,10) (I,1,7) (K,-1,5) (M,4,6)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 (f4) — output matches the paper's expected example exactly. Pre-order (root, left, right) visits nodes with a right child in the order C, E, H — so p is H (the 3rd such node). Standard left rotation at p: let q = p.right (here J); p.right = q.left; q.left = p; then re-attach q in place of p at p's former parent (or as the new root, if p had none).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 (f4) — output khớp chính xác ví dụ trong đề. Duyệt pre-order (gốc, trái, phải) gặp các node có right-child theo thứ tự C, E, H — nên p là H (node thứ 3 như vậy). Xoay trái chuẩn tại p: gọi q = p.right (ở đây là J); p.right = q.left; q.left = p; rồi gắn lại q vào đúng chỗ p ở cha cũ của p (hoặc làm root mới nếu p không có cha).</p>`,
  ),
  rubric: [
    { id: 'find_p', criterion: B('Correctly identifies p as the 3rd node (in pre-order) having a non-empty right child.', 'Xác định đúng p là node thứ 3 (theo pre-order) có right-child không rỗng.'), weight: 1, maxScore: 0.4 },
    { id: 'rotate', criterion: B("Correctly performs the standard left rotation at p (p.right's left subtree becomes p's right subtree, p becomes the left child of its former right child, and the parent's link — or root — is correctly re-pointed).", 'Xoay trái đúng chuẩn tại p (cây con trái của p.right thành cây con phải của p, p thành con trái của right-child cũ của nó, liên kết cha — hoặc root — được trỏ lại đúng).'), weight: 1, maxScore: 0.6 },
  ],
};

// ---------------------------------------------------------------------------
// Q3: Graph — 2 method: f1 (depth2 with degree), f2 (Dijkstra)
// ---------------------------------------------------------------------------
const graphGiven = fs.readFileSync(path.join(SRC, 'Graph.given.java'), 'utf8');
const graphSolved = fs.readFileSync(path.join(SRC, 'Graph.solved.java'), 'utf8');

const scenarioQ3En = `<p><strong>Scenario:</strong> Complete a Java program on a directed/weighted graph represented by an adjacency matrix. Each of the 2 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioQ3Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java trên đồ thị (có hướng/có trọng số) biểu diễn bằng ma trận kề. Mỗi trong 2 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q3_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ3En + `<p><strong>Câu 1: f1() – 1 mark: Depth-first traversal displaying degree for a sub-range</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>f1()</code>, right after the marked comment</li><li>Task: perform depth-first traversal (to file f1.txt) from vertex i=4 (vertex E) but display only 6 vertices — from the 2nd visited vertex to the 7th — together with their degree. Hint: copy <code>depth(...)</code> to a new function (e.g. <code>depth2(...)</code>) and modify the latter one. The array <code>int deg[]</code> is already declared in the class; you must compute <code>deg[i]</code> = degree of vertex i, and use the given <code>fvisitDeg(...)</code> to display a vertex with its degree to the file.</li></ul>`,
    scenarioQ3Vi + `<p><strong>Câu 1: f1() – 1 điểm: Duyệt sâu, hiện degree cho 1 đoạn con</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>f1()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt theo chiều sâu (ghi vào f1.txt) từ đỉnh i=4 (đỉnh E) nhưng chỉ hiện 6 đỉnh — từ đỉnh thăm thứ 2 tới thứ 7 — cùng với degree của chúng. Gợi ý: copy <code>depth(...)</code> thành hàm mới (ví dụ <code>depth2(...)</code>) rồi sửa hàm mới đó. Mảng <code>int deg[]</code> đã khai báo sẵn trong class; bạn phải tính <code>deg[i]</code> = degree của đỉnh i, rồi dùng <code>fvisitDeg(...)</code> có sẵn để hiện đỉnh kèm degree ra file.</li></ul>`,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `E  B  A  C  F  H  I  D  G
B(3) A(3) C(3) F(1) H(2) I(1)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly. deg[i] = row sum of the (0/1) adjacency matrix for vertex i. depth2(...) is a copy of the given depth(...) that keeps a running visit-position counter (starting at 1 for the very first vertex) and calls fvisitDeg(i,f) only when that counter is between 2 and 7 inclusive.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề. deg[i] = tổng dòng i của ma trận kề (0/1). depth2(...) là bản copy của depth(...) có sẵn, giữ thêm biến đếm vị trí thăm (bắt đầu từ 1 cho đỉnh đầu tiên) và chỉ gọi fvisitDeg(i,f) khi biến đếm đó nằm trong khoảng 2 đến 7.</p>`,
  ),
  rubric: [
    { id: 'degree_calc', criterion: B('Correctly computes deg[i] as the row sum of the adjacency matrix for every vertex.', 'Tính đúng deg[i] là tổng dòng i của ma trận kề cho mọi đỉnh.'), weight: 1, maxScore: 0.4 },
    { id: 'depth2_range', criterion: B('Correctly performs the same depth-first traversal as depth(...), but only writes vertices (with degree) that are the 2nd through 7th visited overall.', 'Duyệt sâu đúng như depth(...), nhưng chỉ ghi ra đỉnh (kèm degree) là đỉnh thăm thứ 2 đến thứ 7.'), weight: 1, maxScore: 0.6 },
  ],
};

const q3_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Dijkstra's shortest path</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: apply Dijkstra's shortest path algorithm to find the shortest path from vertex 0 (A) to vertex 6 (G). Write 3 lines to the file: line 1 contains the last 4 vertices selected into the set S, line 2 contains their labels (in line 1's order), line 3 contains the shortest distance to G, then the 1st, 4th and last vertices in the shortest path. (Note: in the weighted matrix, value 99 is considered as infinity. When a vertex v is selected into S, its label = shortest distance from the starting vertex to it.)</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Đường đi ngắn nhất Dijkstra</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: áp dụng thuật toán Dijkstra tìm đường đi ngắn nhất từ đỉnh 0 (A) tới đỉnh 6 (G). Ghi 3 dòng ra file: dòng 1 gồm 4 đỉnh SAU CÙNG được chọn vào tập S, dòng 2 gồm nhãn của chúng (theo đúng thứ tự dòng 1), dòng 3 gồm khoảng cách ngắn nhất tới G, rồi đỉnh thứ 1, thứ 4 và cuối cùng trong đường đi ngắn nhất. (Lưu ý: trong ma trận trọng số, giá trị 99 coi là vô cùng. Khi đỉnh v được chọn vào S, nhãn của nó = khoảng cách ngắn nhất từ đỉnh xuất phát tới nó.)</li></ul>`,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `D  H  F  G
12 12 17 22
22  A  E  G`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly. Standard array-based Dijkstra: dist[] initialized from row 0 of the matrix (dist[0]=0), repeatedly select the not-yet-selected vertex with minimum dist, add it to S (recording the selection order), and relax its neighbors. The full selection order comes out A, I, C, E, B, D, H, F, G — the last 4 are D, H, F, G with labels 12, 12, 17, 22. Backtracking predecessors from G gives the path A→I→C→E→D→G, so the 1st/4th/last vertices are A, E, G, with total shortest distance 22.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề. Dijkstra chuẩn dùng mảng: dist[] khởi tạo từ dòng 0 của ma trận (dist[0]=0), lặp lại chọn đỉnh CHƯA chọn có dist nhỏ nhất, thêm vào S (ghi lại thứ tự chọn), rồi relax các đỉnh kề. Thứ tự chọn đầy đủ ra A, I, C, E, B, D, H, F, G — 4 đỉnh cuối là D, H, F, G với nhãn 12, 12, 17, 22. Truy vết cha từ G cho đường đi A→I→C→E→D→G, nên đỉnh thứ 1/4/cuối là A, E, G, tổng khoảng cách ngắn nhất là 22.</p>`,
  ),
  rubric: [
    { id: 'dijkstra_order', criterion: B('Correctly runs Dijkstra to completion, producing the right selection order into S and the right distance labels for the last 4 selected vertices.', 'Chạy đúng Dijkstra tới khi hoàn tất, ra đúng thứ tự chọn vào S và đúng nhãn khoảng cách cho 4 đỉnh chọn cuối.'), weight: 1, maxScore: 0.6 },
    { id: 'path_backtrack', criterion: B('Correctly backtracks predecessors from vertex 6 (G) to report the shortest distance and the 1st/4th/last vertex of the actual shortest path.', 'Truy vết đúng cha từ đỉnh 6 (G) để báo đúng khoảng cách ngắn nhất và đỉnh thứ 1/4/cuối của đường đi ngắn nhất thật.'), weight: 1, maxScore: 0.4 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE29',
    title: 'PE Đề 29 — Practical Exam (FA24, Đề số 7)|||PE Đề 29 — Thi thực hành (FA24, Đề số 7)',
    description: 'CSD201 PE (CODE): complete singly-linked-list + BST + Graph methods across 3 given NetBeans projects, AI-graded.|||PE CSD201 (viết mã): hoàn thiện method danh sách liên kết đơn + BST + Graph trên 3 project NetBeans given, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE29-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q1_4, q2_1, q2_2, q2_3, q2_4, q3_1, q3_2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
