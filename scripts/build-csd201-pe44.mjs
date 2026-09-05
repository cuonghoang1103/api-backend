/**
 * build-csd201-pe44.mjs — sinh content/exams/CSD201-PE44.mjs.
 *
 * Nguồn thật: Đề 44 (csd201_su23_pe_1_119933.rar, "PaperNo_6", SU2023, 3
 * project NetBeans: Q1=MyList<Apartment> 4 method, Q2=BSTree<Bird> 4 method,
 * Q3=Graph 2 method). ⚠️ Không có paper.pdf riêng — nhưng KHÁC hẳn PE43: đây
 * là bản GIVEN TRẮNG THẬT (đúng chuẩn, chưa ai giải), và mỗi method blank có
 * SẴN 1 ví dụ minh hoạ đầy đủ (input + output) ngay trong javadoc — đủ để
 * lập trình chính xác mà không cần đề giấy riêng.
 *
 * Toàn bộ 10 method đã được lập trình, COMPILE + CHẠY THẬT (javac/java) và
 * đối chiếu byte-for-byte với đúng ví dụ in trong javadoc của given code —
 * khớp 100% cả 10/10, không có sai lệch nào. Một số hành vi phải suy ra từ
 * chính ví dụ (không nói thẳng trong lời văn), đã xác nhận bằng cách tính
 * tay rồi chạy thật:
 *  - Q2.insert: BST theo khoá price, database khoá phải DUY NHẤT (ví dụ cho
 *    thấy 1 node bị âm thầm loại vì trùng khoá với node đã có, dù owner của
 *    nó không bắt đầu bằng 'B').
 *  - Q2.f3: "insert Bird('V', 100-k, 2k), k=chiều cao cây" — ví dụ xác nhận
 *    quy ước height() đếm SỐ NÚT trên đường dài nhất từ root (root tính là 1),
 *    không phải số cạnh.
 *
 * Đã dựng given.zip từ CHÍNH bản given gốc (không cần tái tạo blank như
 * PE43, vì đây vốn đã là bản trắng thật) — chỉ dọn build/dist/nbproject/
 * .class + vài file f*.txt output sót lại của người soạn đề.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE44.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE44.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE44-Given.zip';
const SRC = '/tmp/csd201-pe44-final';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (this deck's given project has no separate written paper — every method's requirement and a full worked example are given directly as comments inside the given source code).</p>
   <ol>
     <li>Software: NetBeans IDE 8.x, Java JDK 1.8. Download the given materials above — it contains 3 separate NetBeans projects: Q1 (MyList), Q2 (BSTree), Q3 (Graph).</li>
     <li>Each project's file (MyList.java / BSTree.java / Graph.java) has several methods to complete — only edit inside the marked "Start your code here" / "End your code here" sections. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into each code box — it is graded by AI against the rubric. You can build &amp; run the real given projects on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (project given của đề này không có đề giấy riêng — yêu cầu và ví dụ minh hoạ đầy đủ của mỗi method nằm ngay trong comment của mã nguồn given).</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Tải given materials ở trên — gồm 3 project NetBeans riêng: Q1 (MyList), Q2 (BSTree), Q3 (Graph).</li>
     <li>Mỗi file (MyList.java / BSTree.java / Graph.java) có vài method cần hoàn thiện — chỉ sửa trong phần đánh dấu "Start your code here" / "End your code here". Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const noSeparatePaperNote = B(
  `<p><b>Note:</b> this deck has no separate written exam paper — the task description and worked example below are copied directly from the given source code's own javadoc comments, and have been confirmed by compiling and running the given project (all output below matches exactly).</p>`,
  `<p><b>Lưu ý:</b> đề này không có đề giấy riêng — mô tả yêu cầu và ví dụ minh hoạ dưới đây lấy trực tiếp từ chính comment javadoc trong mã given, đã xác nhận bằng cách biên dịch và chạy thật project given (mọi output dưới đây khớp chính xác).</p>`,
);

// ---------------------------------------------------------------------------
// Q1: MyList<Apartment> — 4 method
// ---------------------------------------------------------------------------
const myListGiven = fs.readFileSync(path.join(SRC, 'MyList.given.java'), 'utf8');
const myListSolved = fs.readFileSync(path.join(SRC, 'MyList.solved.java'), 'utf8');

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Scenario:</strong> Complete a Java singly-linked-list program of Apartment objects (district, price, area). Each of the 4 methods below is graded independently against its own worked example.</p>` + noSeparatePaperNote +
    `<p><strong>Câu 1: addLast() – 1 mark</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: <code>addLast(String xDistrict, int xPrice, int xArea)</code></li><li>Task: insert a new Node into the list's tail only if the Apartment's attributes 'price' and 'area' are BOTH positive (&gt;0).</li></ul>`,
    `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java quản lý danh sách liên kết đơn các đối tượng Apartment (district, price, area). Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ.</p>` + noSeparatePaperNote +
    `<p><strong>Câu 1: addLast() – 1 điểm</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: <code>addLast(String xDistrict, int xPrice, int xArea)</code></li><li>Nhiệm vụ: chèn 1 node mới vào CUỐI danh sách CHỈ KHI cả 'price' và 'area' của Apartment đều dương (&gt;0).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(Q1,9,8) (Q2,5,3) (Q4,6,5) (Q9,1,1) (TD,7,9) (TB,4,7) (TD,2,2) (Q3,3,9)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 1 (f1) — matches the javadoc's own worked example exactly. Every apartment in the sample data has both price and area positive, so all 8 are inserted in order.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 1 (f1) — khớp đúng ví dụ trong javadoc. Mọi Apartment trong dữ liệu mẫu đều có price và area dương nên cả 8 đều được chèn theo đúng thứ tự.</p>`,
  ),
  rubric: [
    { id: 'filter', criterion: B('Correctly skips insertion unless both price and area are positive.', 'Chỉ chèn khi cả price và area đều dương, bỏ qua các trường hợp khác.'), weight: 1, maxScore: 0.4 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list, handling both empty and non-empty list cases.', 'Nối đúng node mới vào cuối danh sách, xử lý đúng cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Rename districts and adjust price</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: update all nodes in the linked list whose district is "Q2" OR "Q9" — change the district to "TD", then increase the price by 1. Leave every other node untouched.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Đổi tên quận và tăng giá</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: với mọi node có district là "Q2" HOẶC "Q9" — đổi district thành "TD", rồi tăng price thêm 1. Giữ nguyên mọi node khác.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(Q1,9,8) (TD,7,3) (Q4,8,5) (TD,6,4) (TD,4,9)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 2 (f2) — matches the javadoc's own worked example exactly. (Q2,6,3)→(TD,7,3) and (Q9,5,4)→(TD,6,4); the other 3 nodes (already "Q1"/"Q4"/"TD") stay unchanged.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 2 (f2) — khớp đúng ví dụ trong javadoc. (Q2,6,3)→(TD,7,3) và (Q9,5,4)→(TD,6,4); 3 node còn lại (đã là "Q1"/"Q4"/"TD") giữ nguyên.</p>`,
  ),
  rubric: [
    { id: 'match_district', criterion: B('Correctly identifies nodes with district "Q2" or "Q9".', 'Xác định đúng các node có district "Q2" hoặc "Q9".'), weight: 1, maxScore: 0.4 },
    { id: 'rename_and_price', criterion: B('Correctly renames the district to "TD" and increases the price by 1 for those nodes only.', 'Đổi đúng district thành "TD" và tăng price thêm 1 CHỈ ở các node đó.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Keep only the first largest apartment</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: find the Apartment with the largest 'area' in the list. If there is a tie, take the FIRST one (scanning from head). Reduce the list down to that single node (remove every other node).</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Chỉ giữ lại căn hộ lớn nhất đầu tiên</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: tìm Apartment có 'area' lớn nhất trong danh sách. Nếu có nhiều căn bằng nhau, lấy căn ĐẦU TIÊN (duyệt từ head). Rút gọn danh sách chỉ còn lại đúng 1 node đó (xoá mọi node khác).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(Q1,9,18)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 3 (f3) — matches the javadoc's own worked example exactly. Max area = 18, tied between Q1 (1st) and Q9 (2nd) — only Q1 (the first) remains, and <code>ftraverse</code> (which prints the whole list) then prints just this single node, confirming the list itself was reduced to size 1.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 3 (f3) — khớp đúng ví dụ trong javadoc. Area lớn nhất = 18, hoà giữa Q1 (lần 1) và Q9 (lần 2) — chỉ Q1 (căn đầu tiên) còn lại, và <code>ftraverse</code> (in cả danh sách) chỉ in ra đúng 1 node này, xác nhận danh sách đã được rút gọn còn size 1.</p>`,
  ),
  rubric: [
    { id: 'find_first_max', criterion: B('Correctly finds the FIRST node (in list order) with the maximum area.', 'Tìm đúng node ĐẦU TIÊN (theo thứ tự danh sách) có area lớn nhất.'), weight: 1, maxScore: 0.5 },
    { id: 'reduce_to_one', criterion: B('Correctly reduces the list to contain only that single node (head=tail=that node, size=1).', 'Rút gọn đúng danh sách chỉ còn đúng node đó (head=tail=node đó, size=1).'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Sort descending by price</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: sort the entire linked list in DESCENDING order by the Apartment's 'price'.</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Sort giảm dần theo price</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: sắp xếp TOÀN BỘ danh sách liên kết GIẢM DẦN theo 'price' của Apartment.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(Q9,15,1) (Q1,9,18) (TD,7,9) (Q4,6,5) (Q2,5,3) (TB,4,7) (Q3,3,9) (TD,2,2)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 4 (f4) — matches the javadoc's own worked example exactly. Original prices 9,5,6,15,7,4,2,3 sorted descending: 15,9,7,6,5,4,3,2 → Q9,Q1,TD,Q4,Q2,TB,Q3,TD.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 4 (f4) — khớp đúng ví dụ trong javadoc. Price gốc 9,5,6,15,7,4,2,3 sắp giảm dần: 15,9,7,6,5,4,3,2 → Q9,Q1,TD,Q4,Q2,TB,Q3,TD.</p>`,
  ),
  rubric: [
    { id: 'sort_desc', criterion: B('Correctly sorts all nodes in descending order by price.', 'Sắp xếp đúng toàn bộ node giảm dần theo price.'), weight: 1, maxScore: 1 },
  ],
};

// ---------------------------------------------------------------------------
// Q2: BSTree<Bird> — 4 method
// ---------------------------------------------------------------------------
const bsTreeGiven = fs.readFileSync(path.join(SRC, 'BSTree.given.java'), 'utf8');
const bsTreeSolved = fs.readFileSync(path.join(SRC, 'BSTree.solved.java'), 'utf8');

const scenarioQ2 = B(
  `<p><strong>Scenario:</strong> Complete a Java Binary Search Tree program of Bird objects (owner, price, color). <b>price is the key of the tree.</b> Each of the 4 methods below is graded independently against its own worked example.</p>`,
  `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java cây nhị phân tìm kiếm (BST) các đối tượng Bird (owner, price, color). <b>price là khoá của cây.</b> Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ.</p>`,
) + noSeparatePaperNote;

const q2_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ2 + `<p><strong>Câu 1: insert() – 1 mark</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: <code>insert(String xOwner, int xPrice, int xColor)</code></li><li>Task: insert a new Node into the BST (price is the key) only if the Bird's owner does NOT start with 'B'. The tree's key must stay unique — if a Bird with the same price already exists anywhere in the tree, reject the insertion.</li></ul>`,
    scenarioQ2 + `<p><strong>Câu 1: insert() – 1 điểm</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: <code>insert(String xOwner, int xPrice, int xColor)</code></li><li>Nhiệm vụ: chèn 1 node mới vào BST (price là khoá) CHỈ KHI owner của Bird KHÔNG bắt đầu bằng 'B'. Khoá của cây phải duy nhất — nếu đã có Bird cùng price ở bất kỳ đâu trong cây, từ chối chèn.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(A,7,9) (C,4,3) (D,8,6) (E,2,5) (Y,6,-7) (F,-6,7)
(F,-6,7) (E,2,5) (C,4,3) (Y,6,-7) (A,7,9) (D,8,6)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 1 (f1) — matches the javadoc's own worked example exactly. B is skipped (owner starts with 'B'); X (price=4) is skipped too — it is a DUPLICATE KEY, since C already occupies price=4 — this is only visible by noticing the given worked example has just 6 output nodes although 8 birds were fed in (excluding B, 7 remain, so 1 more — X — must have been rejected for another reason: the duplicate key).</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 1 (f1) — khớp đúng ví dụ trong javadoc. B bị bỏ qua (owner bắt đầu bằng 'B'); X (price=4) cũng bị bỏ qua — vì TRÙNG KHOÁ với C đã có sẵn price=4 — điều này chỉ nhận ra được nhờ để ý ví dụ mẫu chỉ có 6 node dù đã cho vào 8 con chim (bỏ B còn 7, vậy phải có thêm 1 con nữa — X — bị loại vì lý do khác: trùng khoá).</p>`,
  ),
  rubric: [
    { id: 'skip_b', criterion: B("Correctly skips insertion when owner starts with 'B'.", "Bỏ qua đúng khi owner bắt đầu bằng 'B'."), weight: 1, maxScore: 0.3 },
    { id: 'bst_order', criterion: B('Correctly inserts respecting BST ordering by price.', 'Chèn đúng thứ tự BST theo price.'), weight: 1, maxScore: 0.4 },
    { id: 'unique_key', criterion: B('Correctly rejects insertion when the price already exists elsewhere in the tree.', 'Từ chối đúng khi price đã tồn tại ở nơi khác trong cây.'), weight: 1, maxScore: 0.3 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Breadth-first traversal filtered by color</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: perform a breadth-first traversal from the root, but write to file f2.txt only the nodes with <code>color &lt; 6</code>. Hint: this is similar to the given <code>breadth(...)</code> method — create a new method with a similar body that does BFS but only displays nodes with color less than 6.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Duyệt rộng lọc theo color</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt breadth-first từ root, nhưng chỉ ghi ra file f2.txt các node có <code>color &lt; 6</code>. Gợi ý: giống hàm <code>breadth(...)</code> có sẵn — tạo hàm mới có thân tương tự làm BFS nhưng chỉ hiện node có color nhỏ hơn 6.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,3) (G,7,8) (H,1,7) (I,3,9) (J,5,5) (K,4,6)
(C,8,2) (D,6,1) (E,9,4) (F,2,3) (J,5,5)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 2 (f2) — matches the javadoc's own worked example exactly. The tree is still traversed in full breadth-first order (queue-based), only the fvisit/write call is conditioned on color &lt; 6.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 2 (f2) — khớp đúng ví dụ trong javadoc. Cây vẫn được duyệt breadth-first đầy đủ (dùng hàng đợi), chỉ có lời gọi fvisit/ghi file là có điều kiện color &lt; 6.</p>`,
  ),
  rubric: [
    { id: 'breadth_copy', criterion: B('Correctly performs the same breadth-first traversal as the given breadth(...).', 'Duyệt đúng breadth-first giống breadth(...) có sẵn.'), weight: 1, maxScore: 0.4 },
    { id: 'filter_color', criterion: B('Only writes nodes with color < 6.', 'Chỉ ghi ra node có color < 6.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Insert a new Bird based on tree height</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: (1) implement a way to calculate the current tree's height k (the number of nodes on its longest root-to-leaf path, counting the root as 1). (2) insert a new Bird('V', 100-k, 2k) into the current tree.</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Chèn 1 Bird mới dựa theo chiều cao cây</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: (1) cài đặt cách tính chiều cao k của cây hiện tại (số nút trên đường dài nhất từ root tới lá, root tính là 1). (2) chèn 1 Bird mới ('V', 100-k, 2k) vào cây hiện tại.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(H,1,7) (K,4,6) (J,5,5) (I,3,9) (F,2,3) (G,7,8) (D,6,1) (E,9,4) (C,8,2)
(H,1,7) (K,4,6) (J,5,5) (I,3,9) (F,2,3) (G,7,8) (D,6,1) (V,94,12) (E,9,4) (C,8,2)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 3 (f3) — matches the javadoc's own worked example exactly. The tree's height (counting nodes, root=1) is 6 (longest path C→D→F→I→J→K), so the new node is Bird('V', 100-6=94, 2*6=12) — the postorder output confirms V was inserted as E's right child (price 94 &gt; 9), which is exactly where it ends up in the example.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 3 (f3) — khớp đúng ví dụ trong javadoc. Chiều cao cây (đếm nút, root=1) là 6 (đường dài nhất C→D→F→I→J→K), nên node mới là Bird('V', 100-6=94, 2*6=12) — output postorder xác nhận V được chèn làm con phải của E (price 94 &gt; 9), đúng vị trí nó nằm trong ví dụ.</p>`,
  ),
  rubric: [
    { id: 'height_calc', criterion: B('Correctly calculates the tree height as the number of nodes on the longest root-to-leaf path (root counted as 1).', 'Tính đúng chiều cao cây là số nút trên đường dài nhất từ root tới lá (root tính là 1).'), weight: 1, maxScore: 0.5 },
    { id: 'insert_v', criterion: B("Correctly inserts a new Bird with owner 'V', price=100-k, color=2k into the tree respecting BST ordering.", "Chèn đúng Bird mới owner='V', price=100-k, color=2k vào cây đúng thứ tự BST."), weight: 1, maxScore: 0.5 },
  ],
};

const q2_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Reset leaf color to 0</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: reset the Bird's 'color' attribute of ALL LEAF nodes (nodes with neither a left child nor a right child) to 0.</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Đặt lại color của node lá về 0</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: đặt lại thuộc tính 'color' của Bird ở MỌI NODE LÁ (không có con trái lẫn con phải) về 0.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(H,1,7) (K,4,6) (J,5,5) (I,3,9) (F,2,3) (G,7,8) (D,6,1) (E,9,4) (C,8,2)
(H,1,0) (K,4,0) (J,5,5) (I,3,9) (F,2,3) (G,7,0) (D,6,1) (E,9,0) (C,8,2)`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 4 (f4) — matches the javadoc's own worked example exactly. In this tree the leaf nodes are H, K, G, and E (none have any children) — their color is reset to 0, while every other node (which has at least one child) is left untouched.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 4 (f4) — khớp đúng ví dụ trong javadoc. Trong cây này, node lá là H, K, G, E (không node nào có con) — color của chúng được đặt về 0, mọi node khác (có ít nhất 1 con) giữ nguyên.</p>`,
  ),
  rubric: [
    { id: 'find_leaves', criterion: B('Correctly identifies leaf nodes (no left child and no right child).', 'Xác định đúng node lá (không có con trái và không có con phải).'), weight: 1, maxScore: 0.5 },
    { id: 'reset_color', criterion: B('Correctly resets color to 0 only for leaf nodes, leaving every other node untouched.', 'Đặt đúng color về 0 CHỈ ở node lá, giữ nguyên mọi node khác.'), weight: 1, maxScore: 0.5 },
  ],
};

// ---------------------------------------------------------------------------
// Q3: Graph — 2 method
// ---------------------------------------------------------------------------
const graphGiven = fs.readFileSync(path.join(SRC, 'Graph.given.java'), 'utf8');
const graphSolved = fs.readFileSync(path.join(SRC, 'Graph.solved.java'), 'utf8');

const scenarioQ3 = B(
  `<p><strong>Scenario:</strong> Complete a Java program on a directed graph represented by an adjacency matrix. Each of the 2 methods below is graded independently against its own worked example.</p>`,
  `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java trên đồ thị có hướng biểu diễn bằng ma trận kề. Mỗi trong 2 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ.</p>`,
) + noSeparatePaperNote;

const q3_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ3 + `<p><strong>Câu 1: f1() – 1 mark: Breadth-first traversal displaying a vertex range</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>f1()</code>, right after the marked comment</li><li>Task: perform breadth-first search starting from vertex C (index 2), but only display the vertex right after C, up to the next 5 vertices (i.e. the 2nd through 6th vertex visited). Hint: copy <code>breadth(...)</code> to a new method and modify it.</li></ul>`,
    scenarioQ3 + `<p><strong>Câu 1: f1() – 1 điểm: Duyệt rộng, hiện 1 đoạn đỉnh</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>f1()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt breadth-first từ đỉnh C (chỉ số 2), nhưng chỉ hiện đỉnh ngay sau C, cho tới 5 đỉnh tiếp theo (tức đỉnh thăm thứ 2 tới thứ 6). Gợi ý: copy <code>breadth(...)</code> thành hàm mới rồi sửa.</li></ul>`,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `C  A  F  B  D  H  E  G  I
A  F  B  D  H`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 1 (f1) — matches the javadoc's own worked example exactly (the given, unmodified breadth(2,f) call already prints the first line; the new code prints the filtered second line).</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 1 (f1) — khớp đúng ví dụ trong javadoc (lời gọi breadth(2,f) có sẵn không sửa đã in ra dòng 1; mã mới in ra dòng 2 đã lọc).</p>`,
  ),
  rubric: [
    { id: 'breadth_copy', criterion: B('Correctly performs the same breadth-first traversal as the given breadth(...).', 'Duyệt đúng breadth-first giống breadth(...) có sẵn.'), weight: 1, maxScore: 0.4 },
    { id: 'range_filter', criterion: B('Only writes vertices that are the 2nd through 6th visited overall.', 'Chỉ ghi ra đỉnh là đỉnh thăm thứ 2 đến thứ 6.'), weight: 1, maxScore: 0.6 },
  ],
};

const q3_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Depth-first traversal from a given vertex</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: perform depth-first search starting from the fifth vertex (vertex E, index 4). Hint: just call the given <code>depth(...)</code> method appropriately.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Duyệt sâu từ 1 đỉnh cho trước</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt depth-first từ đỉnh thứ 5 (đỉnh E, chỉ số 4). Gợi ý: chỉ cần gọi đúng hàm <code>depth(...)</code> có sẵn.</li></ul>`,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `E  B  A  C  F  H  I  G  D`,
  explanation: B(
    `<p>Verified by compiling the given project and running choice 2 (f2) — matches the javadoc's own worked example exactly. A single call <code>depth(4, f)</code> reaches all 9 vertices from E in one connected traversal.</p>`,
    `<p>Đã kiểm bằng cách biên dịch project given và chạy lựa chọn 2 (f2) — khớp đúng ví dụ trong javadoc. Chỉ 1 lời gọi <code>depth(4, f)</code> đã chạm tới cả 9 đỉnh từ E trong 1 lượt duyệt liên thông.</p>`,
  ),
  rubric: [
    { id: 'call_depth', criterion: B('Correctly calls depth() starting from vertex E (index 4).', 'Gọi đúng depth() bắt đầu từ đỉnh E (chỉ số 4).'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE44',
    title: 'PE Đề 44 — Practical Exam (SU2023, Đề số 1)|||PE Đề 44 — Thi thực hành (SU2023, Đề số 1)',
    description: 'CSD201 PE (CODE): complete singly-linked-list + BST + Graph methods across 3 given NetBeans projects, AI-graded.|||PE CSD201 (viết mã): hoàn thiện method danh sách liên kết đơn + BST + Graph trên 3 project NetBeans given, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE44-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q1_4, q2_1, q2_2, q2_3, q2_4, q3_1, q3_2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
