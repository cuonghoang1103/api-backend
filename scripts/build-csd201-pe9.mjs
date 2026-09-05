/**
 * build-csd201-pe9.mjs — sinh content/exams/CSD201-PE9.mjs.
 *
 * Nguồn thật: Đề 9 (Fall 2025, mã "CT", chỉ có paper.pdf, KHÔNG có project
 * NetBeans given nào). KHÁC HẲN các đề PE khác trong chiến dịch: đây là
 * dạng thi kiểu competitive-programming — mỗi câu là 1 chương trình Java
 * ĐỘC LẬP đọc input từ 1 file cố định tên và ghi output ra 1 file cố định
 * tên khác (quy ước NetBeans working-directory I/O quen thuộc của CSD201,
 * giống mọi đề PE khác, chỉ khác là chương trình viết từ đầu chứ không
 * điền vào method có sẵn).
 *
 * Đề tự nó đã hoàn chỉnh: MỖI câu có ĐÚNG 2 bộ input/output mẫu cụ thể
 * trong chính paper.pdf — không cần suy đoán gì. Toàn bộ 3 lời giải
 * (ReverseTraversing, Dijkstra, HappyVertices) đã viết tay, COMPILE + CHẠY
 * THẬT (javac/java) với CẢ HAI bộ input mẫu của từng câu — khớp 100% cả
 * 6 lượt test (2 câu × 3 câu).
 *
 * Không có given.zip (đề gốc không phát mã nguồn) — mỗi câu CODE có khung
 * tự thiết kế (I/O boilerplate đọc/ghi file giữ nguyên, chỉ phần thuật toán
 * cốt lõi để trống) theo đúng quy ước "//You should write here...", cả 6
 * file given/solved đã verify compile ĐỘC LẬP trước khi ghép vào đề.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE9.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE9.mjs');
const SRC = '/tmp/csd201-pe9-final';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (Fall 2025, "CT"). Do not add new import statement(s) to given files. Software tools: NetBeans IDE 13, Java JDK 1.8.</p>
   <p>Each question below is an independent Java program: read input from the fixed-name input file, write output to the fixed-name output file (standard NetBeans working-directory file I/O, exactly like the other CSD201 PE decks in this exam room).</p>
   <p><b>Note:</b> the sample input/output shown per question is only to help you test your own code — the real grading testcases use different data, so do not hardcode the specific results shown below.</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (Fall 2025, "CT"). Không thêm import mới vào file cho sẵn. Công cụ: NetBeans IDE 13, Java JDK 1.8.</p>
   <p>Mỗi câu dưới đây là 1 chương trình Java độc lập: đọc input từ file tên cố định, ghi output ra file tên cố định khác (I/O file working-directory chuẩn của NetBeans, giống hệt các đề CSD201 PE khác trong phòng thi này).</p>
   <p><b>Lưu ý:</b> input/output mẫu ở mỗi câu chỉ để bạn tự test — bộ test chấm điểm thật dùng dữ liệu khác, đừng hardcode kết quả mẫu dưới đây.</p>`,
);

const rtGiven = fs.readFileSync(path.join(SRC, 'ReverseTraversing.given.java'), 'utf8');
const rtSolved = fs.readFileSync(path.join(SRC, 'ReverseTraversing.solved.java'), 'utf8');
const dijGiven = fs.readFileSync(path.join(SRC, 'Dijkstra.given.java'), 'utf8');
const dijSolved = fs.readFileSync(path.join(SRC, 'Dijkstra.solved.java'), 'utf8');
const hvGiven = fs.readFileSync(path.join(SRC, 'HappyVertices.given.java'), 'utf8');
const hvSolved = fs.readFileSync(path.join(SRC, 'HappyVertices.solved.java'), 'utf8');

const q1 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(
    `<p><strong>Question 1: (3 marks) – Reverse Traversing a BST</strong></p>
     <p>Write a program to build a <b>BST (Binary Search Tree)</b> by inserting N (1 ≤ N ≤ 100) integer values into the BST one by one. Note that the nodes have <b>no duplicate</b> values.</p>
     <p>Your task is to <b>reverse traverse</b> the BST and list the nodes whose values are <b>greater than or equal to V</b>. The reverse traversing algorithm: Step 1 — right-child traversing; Step 2 — process current node; Step 3 — left-child traversing.</p>
     <p><b>Input</b> (<code>reverseTraversing_input.txt</code>): line 1 — a positive integer N; line 2 — N integers to insert one by one, space-separated; line 3 — a positive integer V (guaranteed to have results when traversing the tree).</p>
     <p><b>Output</b> (<code>reverseTraversing_output.txt</code>): one line listing the reverse traversal of the BST restricted to node values ≥ V, comma-separated, no spaces.</p>
     <p><b>Sample 1:</b> N=7, values = 7 9 4 1 12 6 10, V=7 → output <code>12,10,9,7</code>.</p>
     <p><b>Sample 2:</b> N=10, values = 78 21 36 18 30 91 74 55 98 100, V=90 → output <code>100,98,91</code>.</p>`,
    `<p><strong>Câu 1: (3 điểm) – Duyệt ngược BST</strong></p>
     <p>Viết chương trình dựng 1 <b>BST (cây nhị phân tìm kiếm)</b> bằng cách chèn lần lượt N (1 ≤ N ≤ 100) số nguyên vào cây. Các node <b>không có giá trị trùng nhau</b>.</p>
     <p>Nhiệm vụ: <b>duyệt ngược</b> BST và liệt kê các node có giá trị <b>lớn hơn hoặc bằng V</b>. Thuật toán duyệt ngược: Bước 1 — duyệt cây con phải; Bước 2 — xử lý node hiện tại; Bước 3 — duyệt cây con trái.</p>
     <p><b>Input</b> (<code>reverseTraversing_input.txt</code>): dòng 1 — số nguyên dương N; dòng 2 — N số nguyên chèn lần lượt, cách nhau khoảng trắng; dòng 3 — số nguyên dương V (đảm bảo có kết quả khi duyệt).</p>
     <p><b>Output</b> (<code>reverseTraversing_output.txt</code>): 1 dòng liệt kê kết quả duyệt ngược BST giới hạn ở node có giá trị ≥ V, cách nhau dấu phẩy, không khoảng trắng.</p>
     <p><b>Mẫu 1:</b> N=7, giá trị = 7 9 4 1 12 6 10, V=7 → output <code>12,10,9,7</code>.</p>
     <p><b>Mẫu 2:</b> N=10, giá trị = 78 21 36 18 30 91 74 55 98 100, V=90 → output <code>100,98,91</code>.</p>`,
  ),
  starterCode: rtGiven,
  sampleSolution: rtSolved,
  expectedOutput: `Sample 1 (N=7, values=7 9 4 1 12 6 10, V=7): 12,10,9,7
Sample 2 (N=10, values=78 21 36 18 30 91 74 55 98 100, V=90): 100,98,91`,
  explanation: B(
    `<p>Verified by compiling and running with BOTH of this paper's own sample inputs — output matches exactly for both. Standard BST insert (no duplicates, per the guarantee), then a recursive reverse traversal (right subtree, then current node if value ≥ V, then left subtree) naturally visits nodes from largest to smallest, so no separate sort is needed.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy với CẢ HAI input mẫu của đề — output khớp chính xác cả 2. BST insert chuẩn (không trùng, theo đảm bảo của đề), rồi duyệt ngược đệ quy (cây con phải, rồi node hiện tại nếu giá trị ≥ V, rồi cây con trái) tự nhiên thăm node từ lớn tới nhỏ, không cần sort riêng.</p>`,
  ),
  rubric: [
    { id: 'bst_insert', criterion: B('Correctly builds the BST by inserting all N values one by one, respecting BST ordering.', 'Dựng đúng BST bằng cách chèn lần lượt N giá trị, đúng thứ tự BST.'), weight: 1, maxScore: 1 },
    { id: 'reverse_traverse_order', criterion: B('Correctly implements the reverse traversal order: right subtree, then current node, then left subtree.', 'Cài đúng thứ tự duyệt ngược: cây con phải, rồi node hiện tại, rồi cây con trái.'), weight: 1, maxScore: 1 },
    { id: 'filter_and_format', criterion: B('Only includes node values >= V, and formats the output as a comma-separated list with no spaces.', 'Chỉ lấy node có giá trị >= V, và định dạng output đúng dạng danh sách cách nhau dấu phẩy không khoảng trắng.'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'CODE', points: 4, language: 'java',
  prompt: B(
    `<p><strong>Question 2: (4 marks) – Shortest Path (Dijkstra)</strong></p>
     <p>Write a program to build an <b>undirected graph</b> from a given edge list. Your task is to find the shortest path from <code>startVertex</code> to <code>endVertex</code>.</p>
     <p><b>Input</b> (<code>dijkstra_input.txt</code>): line 1 — 4 positive integers N, M, s, e (N: 1 ≤ N ≤ 20 vertices; M: N-1 ≤ M ≤ 190 edges; s: start vertex; e: end vertex, s ≠ e); next M lines — 3 positive integers u, v, d (edge between u and v with weight d, 0 ≤ d ≤ 10⁹).</p>
     <p><b>Output</b> (<code>dijkstra_output.txt</code>): line 1 — the shortest distance; line 2 — the list of vertices of the shortest path from s to e, comma-separated.</p>
     <p><b>Sample 1:</b> N=8,M=16,s=0,e=7, edges (0,1,5)(0,2,3)(0,5,11)(1,2,5)(1,6,7)(1,7,11)(2,3,11)(2,4,1)(2,5,7)(3,4,11)(3,6,11)(4,5,1)(4,6,5)(4,7,7)(5,7,42)(6,7,42) → distance <code>11</code>, path <code>0,2,4,7</code>.</p>
     <p><b>Sample 2:</b> N=6,M=7,s=1,e=4, edges (0,1,7)(0,2,5)(0,5,1)(2,3,2)(2,4,3)(3,4,7)(3,5,9) → distance <code>15</code>, path <code>1,0,2,4</code>.</p>`,
    `<p><strong>Câu 2: (4 điểm) – Đường đi ngắn nhất (Dijkstra)</strong></p>
     <p>Viết chương trình dựng 1 <b>đồ thị vô hướng</b> từ danh sách cạnh cho trước. Nhiệm vụ: tìm đường đi ngắn nhất từ <code>startVertex</code> tới <code>endVertex</code>.</p>
     <p><b>Input</b> (<code>dijkstra_input.txt</code>): dòng 1 — 4 số nguyên dương N, M, s, e (N: 1 ≤ N ≤ 20 đỉnh; M: N-1 ≤ M ≤ 190 cạnh; s: đỉnh bắt đầu; e: đỉnh kết thúc, s ≠ e); M dòng tiếp — 3 số nguyên dương u, v, d (cạnh nối u và v trọng số d, 0 ≤ d ≤ 10⁹).</p>
     <p><b>Output</b> (<code>dijkstra_output.txt</code>): dòng 1 — khoảng cách ngắn nhất; dòng 2 — danh sách đỉnh của đường đi ngắn nhất từ s tới e, cách nhau dấu phẩy.</p>
     <p><b>Mẫu 1:</b> N=8,M=16,s=0,e=7, cạnh (0,1,5)(0,2,3)(0,5,11)(1,2,5)(1,6,7)(1,7,11)(2,3,11)(2,4,1)(2,5,7)(3,4,11)(3,6,11)(4,5,1)(4,6,5)(4,7,7)(5,7,42)(6,7,42) → khoảng cách <code>11</code>, đường đi <code>0,2,4,7</code>.</p>
     <p><b>Mẫu 2:</b> N=6,M=7,s=1,e=4, cạnh (0,1,7)(0,2,5)(0,5,1)(2,3,2)(2,4,3)(3,4,7)(3,5,9) → khoảng cách <code>15</code>, đường đi <code>1,0,2,4</code>.</p>`,
  ),
  starterCode: dijGiven,
  sampleSolution: dijSolved,
  expectedOutput: `Sample 1 (N=8,M=16,s=0,e=7): distance 11, path 0,2,4,7
Sample 2 (N=6,M=7,s=1,e=4): distance 15, path 1,0,2,4`,
  explanation: B(
    `<p>Verified by compiling and running with BOTH of this paper's own sample inputs — distance and path match exactly for both. Standard array-based Dijkstra on the undirected weighted adjacency matrix (each edge set both w[u][v] and w[v][u]), tracking a predecessor array to reconstruct the actual path by backtracking from e to s.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy với CẢ HAI input mẫu của đề — khoảng cách và đường đi khớp chính xác cả 2. Dijkstra mảng chuẩn trên ma trận kề vô hướng có trọng số (mỗi cạnh gán cả w[u][v] và w[v][u]), theo dõi mảng predecessor để dựng lại đường đi thật bằng cách lần ngược từ e về s.</p>`,
  ),
  rubric: [
    { id: 'undirected_build', criterion: B('Correctly builds the weighted adjacency structure as UNDIRECTED (each edge sets the weight in both directions).', 'Dựng đúng ma trận kề có trọng số VÔ HƯỚNG (mỗi cạnh gán trọng số cả 2 chiều).'), weight: 1, maxScore: 1 },
    { id: 'dijkstra_correct', criterion: B("Correctly runs Dijkstra's algorithm and computes the correct shortest distance from s to e.", 'Chạy đúng thuật toán Dijkstra và tính đúng khoảng cách ngắn nhất từ s tới e.'), weight: 1, maxScore: 1.5 },
    { id: 'path_reconstruction', criterion: B('Correctly reconstructs and outputs the actual vertex sequence of the shortest path, from s to e in order.', 'Dựng lại và xuất đúng dãy đỉnh thật của đường đi ngắn nhất, theo đúng thứ tự từ s tới e.'), weight: 1, maxScore: 1.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(
    `<p><strong>Question 3: (3 marks) – Happy Vertices</strong></p>
     <p>Write a program to build an <b>undirected graph</b> from a given edge list. A <b>happy vertex</b> is a vertex with positive degree — an endpoint of at least one edge. Your task is to show all happy vertices of the given graph in ascending order.</p>
     <p><b>Input</b> (<code>happyVertices_input.txt</code>): line 1 — 2 positive integers N, M (N: 1 ≤ N ≤ 20 vertices; M: N-1 ≤ M ≤ 190 edges); next M lines — 2 positive integers u, v (edge between u and v).</p>
     <p><b>Output</b> (<code>happyVertices_output.txt</code>): one line listing the happy vertices in ascending order, comma-separated. If the graph has no happy vertex, output the message <code>All of the vertices are isolated vertices.</code></p>
     <p><b>Sample 1:</b> N=9,M=9, edges (0,1)(0,2)(0,5)(1,7)(2,3)(2,4)(3,4)(4,5)(4,7) → output <code>0,1,2,3,4,5,7</code> (vertices 6 and 8 are isolated).</p>
     <p><b>Sample 2:</b> N=6,M=7, edges (0,1)(0,2)(0,5)(2,3)(2,4)(3,4)(4,5) → output <code>0,1,2,3,4,5</code>.</p>`,
    `<p><strong>Câu 3: (3 điểm) – Đỉnh hạnh phúc</strong></p>
     <p>Viết chương trình dựng 1 <b>đồ thị vô hướng</b> từ danh sách cạnh cho trước. 1 <b>đỉnh hạnh phúc</b> là đỉnh có bậc dương — là đầu mút của ít nhất 1 cạnh. Nhiệm vụ: liệt kê mọi đỉnh hạnh phúc của đồ thị theo thứ tự tăng dần.</p>
     <p><b>Input</b> (<code>happyVertices_input.txt</code>): dòng 1 — 2 số nguyên dương N, M (N: 1 ≤ N ≤ 20 đỉnh; M: N-1 ≤ M ≤ 190 cạnh); M dòng tiếp — 2 số nguyên dương u, v (cạnh nối u và v).</p>
     <p><b>Output</b> (<code>happyVertices_output.txt</code>): 1 dòng liệt kê đỉnh hạnh phúc tăng dần, cách nhau dấu phẩy. Nếu đồ thị không có đỉnh hạnh phúc nào, xuất thông điệp <code>All of the vertices are isolated vertices.</code></p>
     <p><b>Mẫu 1:</b> N=9,M=9, cạnh (0,1)(0,2)(0,5)(1,7)(2,3)(2,4)(3,4)(4,5)(4,7) → output <code>0,1,2,3,4,5,7</code> (đỉnh 6 và 8 bị cô lập).</p>
     <p><b>Mẫu 2:</b> N=6,M=7, cạnh (0,1)(0,2)(0,5)(2,3)(2,4)(3,4)(4,5) → output <code>0,1,2,3,4,5</code>.</p>`,
  ),
  starterCode: hvGiven,
  sampleSolution: hvSolved,
  expectedOutput: `Sample 1 (N=9,M=9): 0,1,2,3,4,5,7
Sample 2 (N=6,M=7): 0,1,2,3,4,5`,
  explanation: B(
    `<p>Verified by compiling and running with BOTH of this paper's own sample inputs — output matches exactly for both. Each edge (u,v) increments the degree of both u and v; a vertex is happy iff its final degree is positive, collected in ascending order (0..N-1) since the loop scans indices in that order already.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy với CẢ HAI input mẫu của đề — output khớp chính xác cả 2. Mỗi cạnh (u,v) tăng bậc của cả u và v; 1 đỉnh hạnh phúc khi bậc cuối cùng dương, thu thập theo thứ tự tăng dần (0..N-1) vì vòng lặp đã quét chỉ số theo đúng thứ tự đó.</p>`,
  ),
  rubric: [
    { id: 'degree_count', criterion: B('Correctly computes the degree of every vertex from the undirected edge list.', 'Tính đúng bậc của mọi đỉnh từ danh sách cạnh vô hướng.'), weight: 1, maxScore: 1.2 },
    { id: 'ascending_filter', criterion: B('Correctly collects only vertices with positive degree, in ascending order.', 'Thu thập đúng chỉ các đỉnh có bậc dương, theo thứ tự tăng dần.'), weight: 1, maxScore: 1.2 },
    { id: 'isolated_message', criterion: B('Outputs the exact fallback message when there is no happy vertex at all.', 'Xuất đúng thông điệp dự phòng khi không có đỉnh hạnh phúc nào.'), weight: 1, maxScore: 0.6 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE9',
    title: 'PE Đề 9 — Practical Exam (Fall 2025, "CT")|||PE Đề 9 — Thi thực hành (Fall 2025, "CT")',
    description: 'CSD201 PE (CODE): 3 independent file-I/O algorithm programs — BST reverse traversal, Dijkstra shortest path, happy-vertex detection, written from scratch (no given project), AI-graded.|||PE CSD201 (viết mã): 3 chương trình thuật toán độc lập dùng file I/O — duyệt ngược BST, đường đi ngắn nhất Dijkstra, tìm đỉnh hạnh phúc, viết từ đầu (không có project given), chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
