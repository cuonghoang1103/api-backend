/**
 * build-csd201-pe3.mjs — sinh content/exams/CSD201-PE3.mjs.
 *
 * Nguồn thật: material_0/1/2.zip (Đề "SP26-B5-Paper 4") — 3 project riêng
 * (Q1=MyList Drum, Q2=BSTree Tiger keyed by sound, Q3=Graph BFS+Dijkstra).
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, chạy đủ f1-f4
 * (Q1/Q2) hoặc f1-f2 (Q3) — TẤT CẢ 11 method khớp BYTE-FOR-BYTE với ví dụ
 * minh hoạ trong paper.pdf khi chạy với data.txt thật đi kèm (khác Đề 2,
 * đề này minh hoạ khớp hoàn toàn với dữ liệu thật). 3 given.materials gộp
 * thành 1 zip (Q1/Q2/Q3 subfolder) upload lên R2, verify GET 200.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE3.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE3.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE3-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "SP26 - Block 5 - Paper 4").</p>
   <ol>
     <li>Software: Java JDK 1.8, NetBeans 8.x to 17. Download the given materials above (contains Q1/, Q2/, Q3/ subfolders).</li>
     <li>Only 3 files may be edited: MyList.java (Q1), BSTree.java (Q2), Graph.java (Q3). You may only ADD statements/functions in part (2) — never edit given statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "SP26 - Block 5 - Paper 4").</p>
   <ol>
     <li>Phần mềm: Java JDK 1.8, NetBeans 8.x đến 17. Tải given materials ở trên (có thư mục con Q1/, Q2/, Q3/).</li>
     <li>Chỉ được sửa 3 file: MyList.java (Câu 1), BSTree.java (Câu 2), Graph.java (Câu 3). Chỉ được THÊM statement/hàm ở phần (2) — không bao giờ sửa statement đã cho sẵn.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const SOLVED0 = '/tmp/csd201-pe3-src/m0/src';
const SOLVED1 = '/tmp/csd201-pe3-src/m1/src';
const SOLVED2 = '/tmp/csd201-pe3-src/m2/src';
const ORIG0 = '/tmp/csd201-pe3-orig/m0/src';
const ORIG1 = '/tmp/csd201-pe3-orig/m1/src';
const ORIG2 = '/tmp/csd201-pe3-orig/m2/src';
const rd = (p) => fs.readFileSync(p, 'utf8');

const myListSolved = rd(path.join(SOLVED0, 'MyList.java'));
const myListStarter = rd(path.join(ORIG0, 'MyList.java'));
const bstreeSolved = rd(path.join(SOLVED1, 'BSTree.java'));
const bstreeStarter = rd(path.join(ORIG1, 'BSTree.java'));
const graphSolved = rd(path.join(SOLVED2, 'Graph.java'));
const graphStarter = rd(path.join(ORIG2, 'Graph.java'));

const q1 = {
  kind: 'CODE', points: 4, language: 'java',
  prompt: B(
    `<p><strong>Question 1 (4 marks) — file MyList.java.</strong> The <code>Drum</code> class (tower, sound, type) is provided. <code>MyList</code> is a singly linked list of Drum objects (head/tail).</p>
     <ul>
       <li><code>addLast(xTower, xSound, xType)</code> — if <code>xTower.charAt(0)=='B'</code> do nothing; otherwise append a new node to the end. Expected f1.txt: <code>(A,9,8) (C,6,5) (D,2,4) (E,7,9) (F,4,7)</code></li>
       <li><code>f2()</code> — 2 given Drum objects x, y. Insert them so x is the 3rd node and y is the 5th node (1-indexed, applied sequentially: insert x at position 2 first, then y at position 4 of the resulting list). Expected f2.txt (before/after): <code>(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9)</code> / <code>(C,9,8) (D,6,3) (X,1,2) (E,8,5) (Y,3,4) (F,5,4) (I,4,9)</code></li>
       <li><code>f3()</code> — let p be the FIRST node having the maximum sound value AND it is not the tail. Delete the node right after p.</li>
       <li><code>f4()</code> — assuming at least 4 elements, sort the LAST 4 elements in descending order by sound, leaving earlier nodes untouched.</li>
     </ul>`,
    `<p><strong>Câu 1 (4 điểm) — file MyList.java.</strong> Lớp <code>Drum</code> (tower, sound, type) đã có sẵn. <code>MyList</code> là danh sách liên kết đơn các Drum (head/tail).</p>
     <ul>
       <li><code>addLast(xTower, xSound, xType)</code> — nếu <code>xTower.charAt(0)=='B'</code> thì không làm gì; ngược lại thêm node mới vào cuối. f1.txt mong đợi: như trên.</li>
       <li><code>f2()</code> — cho 2 đối tượng Drum x, y. Chèn sao cho x là node thứ 3 và y là node thứ 5 (đánh số từ 1, chèn tuần tự: chèn x tại vị trí 2 trước, rồi y tại vị trí 4 của danh sách vừa chèn x). f2.txt mong đợi (trước/sau): như trên.</li>
       <li><code>f3()</code> — gọi p là node ĐẦU TIÊN có giá trị sound lớn nhất VÀ không phải tail. Xoá node ngay SAU p.</li>
       <li><code>f4()</code> — giả sử có ít nhất 4 phần tử, sắp xếp 4 phần tử CUỐI giảm dần theo sound, giữ nguyên các node phía trước.</li>
     </ul>`
  ),
  starterCode: myListStarter,
  sampleSolution: myListSolved,
  expectedOutput: `f1.txt: (A,9,8) (C,6,5) (D,2,4) (E,7,9) (F,4,7)
f2.txt: (C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) / (C,9,8) (D,6,3) (X,1,2) (E,8,5) (Y,3,4) (F,5,4) (I,4,9)
f3.txt: (C,8,6) (D,3,5) (E,9,2) (F,5,8) (G,9,7) (H,6,8) (I,7,3) / (C,8,6) (D,3,5) (E,9,2) (G,9,7) (H,6,8) (I,7,3)
f4.txt: (C,1,2) (D,10,3) (E,2,15) (F,5,6) (I,6,14) (J,11,7) (K,7,9) / (C,1,2) (D,10,3) (E,2,15) (J,11,7) (K,7,9) (I,6,14) (F,5,6)`,
  explanation: B(
    `<p>Verified by compiling against the real given project (javac + java Main, all 4 choices) and running against the bundled data.txt — ALL 4 outputs match the paper's example byte-for-byte. <code>f3</code>: max sound=9, first such node not-tail is E; the node after it (F) is removed. <code>f4</code>: last 4 elements (F,I,J,K with sounds 5,6,11,7) sorted descending by sound gives J(11),K(7),I(6),F(5).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật (javac + java Main, cả 4 lựa chọn) và chạy với data.txt đi kèm — CẢ 4 output đều khớp byte-for-byte với ví dụ trong đề. <code>f3</code>: sound lớn nhất=9, node đầu tiên như vậy không phải tail là E; node sau nó (F) bị xoá. <code>f4</code>: 4 phần tử cuối (F,I,J,K sound 5,6,11,7) sắp giảm dần theo sound cho J(11),K(7),I(6),F(5).</p>`
  ),
  rubric: [
    { id: 'addlast', criterion: B('addLast() correctly skips tower starting with B and appends at tail otherwise.', 'addLast() bỏ qua đúng tower bắt đầu bằng B, ngược lại thêm vào cuối.'), weight: 1, maxScore: 1 },
    { id: 'f2_insert', criterion: B('f2 inserts x,y at positions 3 and 5 (1-indexed) sequentially, matching the expected list.', 'f2 chèn x,y tại vị trí 3 và 5 (đánh số từ 1) tuần tự, khớp danh sách mong đợi.'), weight: 1, maxScore: 1 },
    { id: 'f3_delete', criterion: B('f3 finds the first non-tail max-sound node and deletes the node right after it.', 'f3 tìm đúng node đầu tiên không phải tail có sound lớn nhất và xoá node ngay sau.'), weight: 1, maxScore: 1 },
    { id: 'f4_sort', criterion: B('f4 sorts exactly the last 4 elements descending by sound, leaving earlier nodes unchanged.', 'f4 sắp xếp đúng 4 phần tử cuối giảm dần theo sound, giữ nguyên node phía trước.'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'CODE', points: 4, language: 'java',
  prompt: B(
    `<p><strong>Question 2 (4 marks) — file BSTree.java.</strong> <code>BSTree</code> is a binary search tree of Tiger objects (forest, rate, sound) keyed by <strong>sound</strong> (must be unique).</p>
     <ul>
       <li><code>insert(xForest, xRate, xSound)</code> — if <code>xForest.charAt(0)=='A'</code> do nothing; otherwise insert, keyed by sound.</li>
       <li><code>f2()</code> — pre-order traversal but display only nodes with <code>rate &lt; 6</code>. Hint: copy preOrder(...) to preOrder2(...) and modify.</li>
       <li><code>f3()</code> — let p be the 4th node in pre-order traversal. Delete p using the "delete by copying" technique.</li>
       <li><code>f4()</code> — let p be the 4th node in pre-order traversal. If p has a right child, rotate p to the LEFT about its right child.</li>
     </ul>`,
    `<p><strong>Câu 2 (4 điểm) — file BSTree.java.</strong> <code>BSTree</code> là cây nhị phân tìm kiếm các Tiger (forest, rate, sound), khoá theo <strong>sound</strong> (phải duy nhất).</p>
     <ul>
       <li><code>insert(xForest, xRate, xSound)</code> — nếu <code>xForest.charAt(0)=='A'</code> thì không làm gì; ngược lại chèn, khoá theo sound.</li>
       <li><code>f2()</code> — duyệt pre-order nhưng chỉ hiển thị node có <code>rate &lt; 6</code>. Gợi ý: sao chép preOrder(...) thành preOrder2(...) rồi sửa.</li>
       <li><code>f3()</code> — gọi p là node thứ 4 theo duyệt pre-order. Xoá p bằng kỹ thuật "xoá bằng copy".</li>
       <li><code>f4()</code> — gọi p là node thứ 4 theo duyệt pre-order. Nếu p có con phải, xoay p sang TRÁI quanh con phải đó.</li>
     </ul>`
  ),
  starterCode: bstreeStarter,
  sampleSolution: bstreeSolved,
  expectedOutput: `f1.txt (breadth-first / in-order): (B,9,4) (C,4,3) (D,8,6) (E,2,5) (F,6,7) / (C,4,3) (B,9,4) (E,2,5) (D,8,6) (F,6,7)
f2.txt: (C,3,6) (D,7,2) (F,4,5) (H,6,3) (I,5,4) (E,2,8) (G,8,7) / (C,3,6) (F,4,5) (I,5,4) (E,2,8)
f3.txt: (C,5,2) (D,2,1) (E,6,5) (F,1,3) (H,3,4) (G,4,6) / (C,5,2) (D,2,1) (E,6,5) (H,3,4) (G,4,6)
f4.txt: (C,5,2) (D,2,1) (E,6,5) (F,1,3) (H,3,4) (G,4,6) / (C,5,2) (D,2,1) (E,6,5) (H,3,4) (F,1,3) (G,4,6)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running all 4 choices against the bundled data.txt — ALL FOUR outputs match the paper's example byte-for-byte (f1, f2, f3, f4). This confirms insert() is correctly keyed by sound, preOrder2's rate&lt;6 filter, the 4th-preorder-node delete-by-copying, and the 4th-preorder-node left-rotation are all exactly correct.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy cả 4 lựa chọn với data.txt đi kèm — CẢ BỐN output đều khớp byte-for-byte với ví dụ trong đề (f1, f2, f3, f4). Xác nhận insert() khoá đúng theo sound, bộ lọc rate&lt;6 của preOrder2, xoá-bằng-copy node thứ 4 pre-order, và xoay trái node thứ 4 pre-order đều chính xác.</p>`
  ),
  rubric: [
    { id: 'insert', criterion: B('insert() correctly builds a BST keyed by sound, skipping forest starting with A.', 'insert() dựng đúng BST khoá theo sound, bỏ qua forest bắt đầu bằng A.'), weight: 1, maxScore: 1 },
    { id: 'f2_filter', criterion: B('preOrder2 correctly filters to only rate<6 nodes while preserving pre-order sequencing.', 'preOrder2 lọc đúng chỉ node rate<6, giữ đúng thứ tự pre-order.'), weight: 1, maxScore: 1 },
    { id: 'f3_delete', criterion: B('f3 correctly finds the 4th pre-order node and deletes it via delete-by-copying.', 'f3 tìm đúng node thứ 4 pre-order và xoá bằng kỹ thuật xoá-bằng-copy.'), weight: 1, maxScore: 1 },
    { id: 'f4_rotate', criterion: B('f4 correctly locates the 4th pre-order node and performs a correct left rotation when it has a right child.', 'f4 tìm đúng node thứ 4 pre-order và xoay trái đúng khi có con phải.'), weight: 1, maxScore: 1 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(
    `<p><strong>Question 3 (2 marks) — file Graph.java.</strong></p>
     <ul>
       <li><code>f1()</code> — perform breadth-first traversal (already called via <code>breadth(1,f)</code>) from vertex i=1 (B), but ALSO display 5 vertices from the 3rd to the 7th of that BFS order only (plain labels, no degree). Hint: copy breadth(...) to breadth2(...) and modify. Expected f1.txt: full BFS <code>B A E C D H G I F</code>, then <code>E C D H G</code>.</li>
       <li><code>f2()</code> — apply Dijkstra's shortest path algorithm (weighted matrix, value 99 = infinity). Line 1: shortest path from vertex 0 (A) to vertex 6 (G). Line 2: the last 4 vertices selected into the set S up to and including reaching G (stop Dijkstra once G is finalized), each shown as <code>label|distance</code>. Line 3: shortest path from vertex 1 (B) to vertex 5 (F). Expected f2.txt: <code>A B C E D G</code> / <code>E|15 D|19 F|24 G|29</code> / <code>B C E D F</code>.</li>
     </ul>`,
    `<p><strong>Câu 3 (2 điểm) — file Graph.java.</strong></p>
     <ul>
       <li><code>f1()</code> — duyệt rộng (đã gọi sẵn qua <code>breadth(1,f)</code>) từ đỉnh i=1 (B), NHƯNG cũng hiển thị 5 đỉnh từ thứ 3 đến thứ 7 của thứ tự BFS đó (nhãn thường, không có bậc). Gợi ý: sao chép breadth(...) thành breadth2(...) rồi sửa. f1.txt mong đợi: như trên.</li>
       <li><code>f2()</code> — áp dụng Dijkstra (ma trận trọng số, giá trị 99 = vô cực). Dòng 1: đường đi ngắn nhất từ đỉnh 0 (A) tới đỉnh 6 (G). Dòng 2: 4 đỉnh CUỐI được chọn vào tập S tính tới khi chạm G (Dijkstra dừng khi G được chốt), mỗi đỉnh hiển thị dạng <code>nhãn|khoảngcách</code>. Dòng 3: đường đi ngắn nhất từ đỉnh 1 (B) tới đỉnh 5 (F). f2.txt mong đợi: như trên.</li>
     </ul>`
  ),
  starterCode: graphStarter,
  sampleSolution: graphSolved,
  expectedOutput: `f1.txt: B A E C D H G I F / E C D H G
f2.txt: A B C E D G / E|15 D|19 F|24 G|29 / B C E D F`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running both choices against the bundled data.txt — output matches the paper's expected example byte-for-byte for BOTH f1 and f2. Confirmed via independent Python computation before writing Java: Dijkstra must stop as soon as the target (G) is finalized into S (not run to completion over all vertices) for the "last 4 selected" list to match exactly.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy cả 2 lựa chọn với data.txt đi kèm — output khớp byte-for-byte với ví dụ trong đề cho CẢ f1 và f2. Đã xác nhận bằng tính toán Python độc lập trước khi viết Java: Dijkstra phải dừng ngay khi đỉnh đích (G) được chốt vào S (không chạy hết toàn bộ đỉnh) thì danh sách "4 đỉnh cuối" mới khớp chính xác.</p>`
  ),
  rubric: [
    { id: 'f1_bfs', criterion: B('Correctly displays vertices 3-7 of the BFS order from vertex B via breadth2.', 'Hiển thị đúng đỉnh 3-7 của thứ tự BFS từ đỉnh B qua breadth2.'), weight: 1, maxScore: 1 },
    { id: 'f2_dijkstra', criterion: B('Correct Dijkstra: shortest path A→G, correct last-4-selected-into-S with label|distance format (stopping at target), and correct shortest path B→F.', 'Dijkstra đúng: đường đi ngắn nhất A→G, đúng 4 đỉnh cuối vào S dạng nhãn|khoảngcách (dừng khi tới đích), và đúng đường đi ngắn nhất B→F.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE3-SP26B5P4',
    title: 'PE Đề 3 — Practical Exam (SP26 - Block 5 - Paper 4)|||PE Đề 3 — Thi thực hành (SP26 - Block 5 - Paper 4)',
    description: 'CSD201 PE (CODE): singly linked list + BST (rotation, delete-by-copying) + Graph (BFS, Dijkstra), AI-graded.|||PE CSD201 (viết mã): danh sách liên kết đơn + BST (xoay cây, xoá-bằng-copy) + Đồ thị (BFS, Dijkstra), chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE3-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
