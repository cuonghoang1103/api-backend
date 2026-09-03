/**
 * build-csd201-pe4.mjs — sinh content/exams/CSD201-PE4.mjs.
 *
 * Nguồn thật: material_1/2/3.zip (Đề "SP26-PE-6") — 3 project riêng
 * (Q1=MyList Cape, Q2=BSTree Cape keyed by color, Q3=Graph DFS+degree,
 * Dijkstra 4-dòng). LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi
 * project, chạy đủ f1-f4 (Q1/Q2) hoặc f1-f2 (Q3). Q1-f1/f2 và Q3 (cả 2
 * câu) khớp BYTE-FOR-BYTE với ví dụ minh hoạ. Q1-f4 minh hoạ trong đề tự
 * MÂU THUẪN với chính đặc tả chữ của nó (không phải thứ tự tăng dần thật
 * sự) — đã verify bằng self-consistency: chạy với data.txt thật, code
 * cho ra kết quả ĐÚNG tăng dần theo type, khớp đặc tả chữ, không theo
 * minh hoạ sai. Q2 dùng chung bộ dữ liệu insert gốc với CSD201-PE2's
 * Q2 (chỉ khác luật skip 'A'/'B') — minh hoạ f1/f3/f4 của đề này không
 * khớp data.txt thật đi kèm (như CSD201-PE2), nhưng f2 (lọc type>5) tự
 * nhất quán đúng đặc tả. 3 given.materials gộp thành 1 zip upload R2.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE4.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE4.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE4-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "SP26 - PE - 6").</p>
   <ol>
     <li>Software: Java JDK 1.8, NetBeans 8.x to 17. Download the given materials above (Q1/, Q2/, Q3/ subfolders).</li>
     <li>Only 3 files may be edited: MyList.java (Q1), BSTree.java (Q2), Graph.java (Q3) — only ADD statements/functions in part (2), never edit given statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "SP26 - PE - 6").</p>
   <ol>
     <li>Phần mềm: Java JDK 1.8, NetBeans 8.x đến 17. Tải given materials ở trên (có thư mục con Q1/, Q2/, Q3/).</li>
     <li>Chỉ được sửa 3 file: MyList.java (Câu 1), BSTree.java (Câu 2), Graph.java (Câu 3) — chỉ THÊM statement/hàm ở phần (2), không sửa statement đã cho.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const SOLVED1 = '/tmp/csd201-pe4-src/m1/src';
const SOLVED2 = '/tmp/csd201-pe4-src/m2/src';
const SOLVED3 = '/tmp/csd201-pe4-src/m3/src';
const ORIG1 = '/tmp/csd201-pe4-orig/m1/src';
const ORIG2 = '/tmp/csd201-pe4-orig/m2/src';
const ORIG3 = '/tmp/csd201-pe4-orig/m3/src';
const rd = (p) => fs.readFileSync(p, 'utf8');

const myListSolved = rd(path.join(SOLVED1, 'MyList.java'));
const myListStarter = rd(path.join(ORIG1, 'MyList.java'));
const bstreeSolved = rd(path.join(SOLVED2, 'BSTree.java'));
const bstreeStarter = rd(path.join(ORIG2, 'BSTree.java'));
const graphSolved = rd(path.join(SOLVED3, 'Graph.java'));
const graphStarter = rd(path.join(ORIG3, 'Graph.java'));

const q1 = {
  kind: 'CODE', points: 4, language: 'java',
  prompt: B(
    `<p><strong>Question 1 (4 marks) — file MyList.java.</strong> The <code>Cape</code> class (tailor, color, type) is provided. <code>MyList</code> is a singly linked list of Cape objects (head/tail).</p>
     <ul>
       <li><code>addLast(xTailor, xColor, xType)</code> — if <code>xTailor.charAt(0)=='A'</code> do nothing; otherwise append at the end. Expected f1.txt: <code>(B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)</code></li>
       <li><code>f2()</code> — 3 given Cape objects x, y, z. Insert them so x, y, z end up at positions 1, 2, 4 (head is position 0), applied sequentially (x at pos 1, then y at pos 2 of the resulting list, then z at pos 4 of that result).</li>
       <li><code>f3()</code> — swap the <code>type</code> value of the tail element and the element just before the tail.</li>
       <li><code>f4()</code> — find the first node p having tailor="K". Sort the 5 elements just before p ascending by type, leaving p and other nodes untouched.</li>
     </ul>`,
    `<p><strong>Câu 1 (4 điểm) — file MyList.java.</strong> Lớp <code>Cape</code> (tailor, color, type) đã có sẵn. <code>MyList</code> là danh sách liên kết đơn các Cape (head/tail).</p>
     <ul>
       <li><code>addLast(xTailor, xColor, xType)</code> — nếu <code>xTailor.charAt(0)=='A'</code> thì không làm gì; ngược lại thêm vào cuối. f1.txt mong đợi: như trên.</li>
       <li><code>f2()</code> — cho 3 đối tượng Cape x, y, z. Chèn sao cho x, y, z ở vị trí 1, 2, 4 (head là vị trí 0), chèn tuần tự (x tại vị trí 1, rồi y tại vị trí 2 của danh sách vừa chèn x, rồi z tại vị trí 4 của kết quả đó).</li>
       <li><code>f3()</code> — hoán đổi giá trị <code>type</code> của phần tử tail và phần tử ngay trước tail.</li>
       <li><code>f4()</code> — tìm node p đầu tiên có tailor="K". Sắp xếp 5 phần tử ngay TRƯỚC p tăng dần theo type, giữ nguyên p và các node khác.</li>
     </ul>`
  ),
  starterCode: myListStarter,
  sampleSolution: myListSolved,
  expectedOutput: `f1.txt: (B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)
f2/f3/f4: verified against the bundled data.txt (see explanation) — f4's illustrative example in the paper is internally inconsistent with its own "ascending" rule; the implementation was self-checked to produce a genuinely ascending-by-type result.`,
  explanation: B(
    `<p>Verified by compiling against the real given project (javac + java Main, all 4 choices) and running against the bundled data.txt. <code>f1</code> matches the paper's example byte-for-byte. <code>f2</code>'s sequential-insert logic (x@1, y@2, z@4) was confirmed correct by tracing the resulting list order. <code>f4</code>: the paper's own illustrative "after" example is NOT actually sorted ascending by type (a self-contradiction in the source paper) — the implementation here was verified independently: running it against the bundled data.txt produces a segment that IS correctly ascending by type (2,7,8,9,12), confirming the code matches the written specification rather than the flawed illustration.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật (javac + java Main, cả 4 lựa chọn) và chạy với data.txt đi kèm. <code>f1</code> khớp byte-for-byte với ví dụ trong đề. Logic chèn tuần tự của <code>f2</code> (x@1, y@2, z@4) đã xác nhận đúng qua vết tay thứ tự danh sách kết quả. <code>f4</code>: ví dụ minh hoạ "sau" của chính đề KHÔNG thực sự sắp tăng dần theo type (đề tự mâu thuẫn) — đã tự kiểm độc lập: chạy với data.txt thật cho ra đoạn ĐÚNG tăng dần theo type (2,7,8,9,12), xác nhận mã khớp đặc tả chữ chứ không theo minh hoạ sai.</p>`
  ),
  rubric: [
    { id: 'addlast', criterion: B('addLast() correctly skips tailor starting with A and appends at tail otherwise.', 'addLast() bỏ qua đúng tailor bắt đầu bằng A, ngược lại thêm vào cuối.'), weight: 1, maxScore: 1 },
    { id: 'f2_insert', criterion: B('f2 inserts x,y,z at positions 1,2,4 sequentially, matching the expected list.', 'f2 chèn x,y,z tại vị trí 1,2,4 tuần tự, khớp danh sách mong đợi.'), weight: 1, maxScore: 1 },
    { id: 'f3_swap', criterion: B('f3 correctly swaps the type field of the tail and the node just before it.', 'f3 hoán đổi đúng field type của tail và node ngay trước nó.'), weight: 1, maxScore: 1 },
    { id: 'f4_sort', criterion: B('f4 correctly sorts exactly the 5 elements just before the first tailor="K" node, ascending by type.', 'f4 sắp xếp đúng đúng 5 phần tử ngay trước node tailor="K" đầu tiên, tăng dần theo type.'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'CODE', points: 4, language: 'java',
  prompt: B(
    `<p><strong>Question 2 (4 marks) — file BSTree.java.</strong> <code>BSTree</code> is a binary search tree of Cape objects keyed by <strong>color</strong> (must be unique).</p>
     <ul>
       <li><code>insert(xTailor, xColor, xType)</code> — if <code>xTailor.charAt(0)=='B'</code> do nothing; otherwise insert, keyed by color.</li>
       <li><code>f2()</code> — pre-order traversal but display only nodes with <code>type &gt; 5</code>. Hint: copy preOrder(...) to preOrder2(...) and modify.</li>
       <li><code>f3()</code> — let p be the 6th node in IN-ORDER traversal. Delete p using the "delete by copying" technique. If p has a father fa (at the time of deletion), display fa's info as the 2nd line of f3.txt (between the before/after breadth-first dumps).</li>
       <li><code>f4()</code> — perform breadth-first traversal and find the 5th node p (in BFS order) having a non-empty right child. Rotate p to the LEFT.</li>
     </ul>`,
    `<p><strong>Câu 2 (4 điểm) — file BSTree.java.</strong> <code>BSTree</code> là cây nhị phân tìm kiếm các Cape, khoá theo <strong>color</strong> (phải duy nhất).</p>
     <ul>
       <li><code>insert(xTailor, xColor, xType)</code> — nếu <code>xTailor.charAt(0)=='B'</code> thì không làm gì; ngược lại chèn, khoá theo color.</li>
       <li><code>f2()</code> — duyệt pre-order nhưng chỉ hiển thị node có <code>type &gt; 5</code>. Gợi ý: sao chép preOrder(...) thành preOrder2(...) rồi sửa.</li>
       <li><code>f3()</code> — gọi p là node thứ 6 theo duyệt IN-ORDER. Xoá p bằng kỹ thuật "xoá bằng copy". Nếu p có cha fa (tại thời điểm xoá), hiển thị info của fa ở dòng 2 của f3.txt (giữa 2 lần dump breadth-first trước/sau).</li>
       <li><code>f4()</code> — duyệt breadth-first, tìm node THỨ 5 (theo thứ tự BFS) có con phải khác rỗng. Xoay p sang TRÁI.</li>
     </ul>`
  ),
  starterCode: bstreeStarter,
  sampleSolution: bstreeSolved,
  expectedOutput: `f2.txt: nodes with type>5 in pre-order (self-consistency verified against bundled data.txt).
f1/f3/f4: algorithm-verified against the bundled data.txt (illustrative examples in the paper use different sample data, per the pattern seen throughout this course's PE papers).`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running all 4 choices against the bundled data.txt. <code>f2</code>'s filtered output is self-consistent: every displayed node has type&gt;5 and every excluded node has type&lt;=5, confirming preOrder2 is correct. <code>f3</code>/<code>f4</code> were run against the bundled data and produce structurally sound results (a valid node removed via delete-by-copying with its father correctly reported; a valid single rotation swapping one parent/child pair's BFS position) — the paper's own illustrative numbers for f1/f3/f4 do not derive from this bundled data.txt (a recurring characteristic of this course's auto-generated PE papers, also seen in CSD201-PE2), so exact byte-for-byte illustrative matching was not expected or required there.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy cả 4 lựa chọn với data.txt đi kèm. Output đã lọc của <code>f2</code> tự nhất quán: mọi node hiển thị đều type&gt;5 và mọi node loại đều type&lt;=5, xác nhận preOrder2 đúng. <code>f3</code>/<code>f4</code> chạy với dữ liệu đi kèm cho kết quả hợp lý về cấu trúc (xoá đúng 1 node bằng kỹ thuật xoá-bằng-copy với cha được báo đúng; 1 phép xoay hợp lệ hoán đổi đúng 1 cặp vị trí BFS cha/con) — số liệu minh hoạ của chính đề cho f1/f3/f4 không xuất phát từ data.txt đi kèm (đặc điểm lặp lại của các đề PE tự sinh môn này, cũng gặp ở CSD201-PE2), nên không cần/không kỳ vọng khớp byte-for-byte với minh hoạ ở những câu đó.</p>`
  ),
  rubric: [
    { id: 'insert', criterion: B('insert() correctly builds a BST keyed by color, skipping tailor starting with B.', 'insert() dựng đúng BST khoá theo color, bỏ qua tailor bắt đầu bằng B.'), weight: 1, maxScore: 1 },
    { id: 'f2_filter', criterion: B('preOrder2 correctly filters to only type>5 nodes while preserving pre-order sequencing.', 'preOrder2 lọc đúng chỉ node type>5, giữ đúng thứ tự pre-order.'), weight: 1, maxScore: 1 },
    { id: 'f3_delete', criterion: B('f3 correctly finds the 6th in-order node, reports its father if any, and deletes it via delete-by-copying.', 'f3 tìm đúng node thứ 6 in-order, báo đúng cha nếu có, và xoá bằng kỹ thuật xoá-bằng-copy.'), weight: 1, maxScore: 1 },
    { id: 'f4_rotate', criterion: B('f4 correctly locates the 5th BFS-order node with a right child and performs a correct left rotation.', 'f4 tìm đúng node thứ 5 theo BFS có con phải và xoay trái đúng.'), weight: 1, maxScore: 1 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(
    `<p><strong>Question 3 (2 marks) — file Graph.java.</strong></p>
     <ul>
       <li><code>f1()</code> — perform depth-first traversal (already called via <code>depth(2,f)</code>) from vertex i=2 (C), but ALSO display 5 vertices with their degrees, from the 2nd to the 6th vertex of that DFS order. Hint: copy depth(...) to depth2(...) and modify; compute d[i]=degree of vertex i, use the already-provided <code>fvisitDeg(...)</code>. Expected f1.txt: full DFS <code>C A B D G E H I F</code>, then <code>A(3) B(3) D(3) G(1) E(2)</code>.</li>
       <li><code>f2()</code> — apply Dijkstra's shortest path algorithm (weighted matrix, value 99 = infinity). Line 1: shortest path from vertex 1 (B) to vertex 5 (F). Line 2: labels of the last 5 vertices selected into the set S up to and including reaching F (Dijkstra stops once F is finalized). Line 3: the shortest-distance label of each of those same 5 vertices (parallel to line 2, i.e. when vertex v is selected into S, its label = shortest distance from the start vertex to it). Line 4: the shortest path from vertex 2 (C) to vertex 6 (G), followed by the shortest distance. Expected f2.txt: <code>B C E D F</code> / <code>A I E D F</code> / <code>3 4 5 9 14</code> / <code>C E D G 17</code>.</li>
     </ul>`,
    `<p><strong>Câu 3 (2 điểm) — file Graph.java.</strong></p>
     <ul>
       <li><code>f1()</code> — duyệt sâu (đã gọi sẵn qua <code>depth(2,f)</code>) từ đỉnh i=2 (C), NHƯNG cũng hiển thị 5 đỉnh kèm bậc, từ đỉnh thứ 2 đến thứ 6 của thứ tự DFS đó. Gợi ý: sao chép depth(...) thành depth2(...) rồi sửa; tính d[i]=bậc đỉnh i, dùng <code>fvisitDeg(...)</code> đã có sẵn. f1.txt mong đợi: như trên.</li>
       <li><code>f2()</code> — áp dụng Dijkstra (ma trận trọng số, giá trị 99 = vô cực). Dòng 1: đường đi ngắn nhất từ đỉnh 1 (B) tới đỉnh 5 (F). Dòng 2: nhãn 5 đỉnh CUỐI được chọn vào tập S tính tới khi chạm F (Dijkstra dừng khi F được chốt). Dòng 3: nhãn khoảng-cách-ngắn-nhất của đúng 5 đỉnh đó (song song với dòng 2, tức khi đỉnh v được chọn vào S, nhãn của nó = khoảng cách ngắn nhất từ đỉnh xuất phát tới nó). Dòng 4: đường đi ngắn nhất từ đỉnh 2 (C) tới đỉnh 6 (G), kèm khoảng cách ngắn nhất. f2.txt mong đợi: như trên.</li>
     </ul>`
  ),
  starterCode: graphStarter,
  sampleSolution: graphSolved,
  expectedOutput: `f1.txt: C A B D G E H I F / A(3) B(3) D(3) G(1) E(2)
f2.txt: B C E D F / A I E D F / 3 4 5 9 14 / C E D G 17`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running both choices against the bundled data.txt — output matches the paper's expected example byte-for-byte for BOTH f1 and f2. As with the other CSD201 PE papers, Dijkstra must stop as soon as the target is finalized into S for the "last N selected" reporting to match exactly; confirmed via independent Python computation before writing the Java implementation. Note the paper's own written description of lines 3/4 is imprecise (it says line 3 has "vertices in shortest path (2)" and line 4 has "the shortest distance", but the actual expected output shows line 3 = distances of the line-2 vertices and line 4 = path(2)+distance combined) — the CONCRETE example output was trusted as the authoritative format, consistent with how other inconsistencies in these papers were resolved tonight.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy cả 2 lựa chọn với data.txt đi kèm — output khớp byte-for-byte với ví dụ trong đề cho CẢ f1 và f2. Như các đề PE CSD201 khác, Dijkstra phải dừng ngay khi đỉnh đích được chốt vào S thì "N đỉnh cuối" mới khớp chính xác; đã xác nhận bằng tính toán Python độc lập trước khi viết Java. Lưu ý mô tả bằng chữ của chính đề cho dòng 3/4 không chính xác (nói dòng 3 có "đỉnh trong đường đi ngắn nhất (2)" và dòng 4 có "khoảng cách ngắn nhất", nhưng output mong đợi thật cho thấy dòng 3 = khoảng cách của các đỉnh dòng 2 và dòng 4 = đường đi(2)+khoảng cách gộp lại) — tin theo VÍ DỤ CỤ THỂ làm chuẩn định dạng, nhất quán với cách xử lý các mâu thuẫn khác trong các đề này tối nay.</p>`
  ),
  rubric: [
    { id: 'f1_degree', criterion: B('Correctly computes deg[i] and displays vertices 2-6 of the DFS order with their degree via fvisitDeg.', 'Tính đúng deg[i] và hiển thị đỉnh 2-6 của thứ tự DFS kèm bậc qua fvisitDeg.'), weight: 1, maxScore: 1 },
    { id: 'f2_dijkstra', criterion: B('Correct Dijkstra: shortest path B→F, correct last-5-selected labels+distances (stopping at target), and correct shortest path C→G with distance.', 'Dijkstra đúng: đường đi ngắn nhất B→F, đúng nhãn+khoảng cách 5 đỉnh cuối vào S (dừng khi tới đích), và đúng đường đi ngắn nhất C→G kèm khoảng cách.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE4-SP26PE6',
    title: 'PE Đề 4 — Practical Exam (SP26 - PE - 6)|||PE Đề 4 — Thi thực hành (SP26 - PE - 6)',
    description: 'CSD201 PE (CODE): singly linked list + BST (rotation, delete-by-copying) + Graph (DFS+degree, Dijkstra), AI-graded.|||PE CSD201 (viết mã): danh sách liên kết đơn + BST (xoay cây, xoá-bằng-copy) + Đồ thị (DFS+bậc, Dijkstra), chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE4-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
