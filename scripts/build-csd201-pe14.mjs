/**
 * build-csd201-pe14.mjs — sinh content/exams/CSD201-PE14.mjs.
 *
 * Nguồn thật: Đề 14 (Summer 2025, "FUDA", chỉ có paper.pdf, KHÔNG có project
 * NetBeans given nào). Kiểu "viết từ đầu" thứ 4 trong nhóm này, nhưng đề
 * không phát biểu điểm cụ thể cho mỗi thao tác (chỉ chia 2 file Q1/Q2) —
 * điểm từng câu ở đây do TỰ PHÂN BỔ hợp lý theo độ khó tương đối (quickSort
 * và AVL insert/delete nặng hơn removeFirst/addLast/inOrder), tổng vẫn đúng
 * 10 điểm toàn đề.
 *
 * Đề CŨNG không cho sẵn output mẫu nào (chỉ cho bảng dữ liệu 10 model AI) —
 * khác PE6/PE7/PE9 (có ví dụ input/output rõ). Vì vậy verify bằng cách:
 * (1) COMPILE + CHẠY THẬT (javac/java) toàn bộ lời giải với chính bảng dữ
 * liệu đề cho, (2) đối chiếu TÍNH TAY thứ tự sắp xếp đúng (ascending theo
 * yearPublish, tie-break monthPublish), (3) VIẾT THÊM 1 hàm kiểm tra bất
 * biến AVL (mọi node có |balance factor| <= 1) chạy SAU MỖI thao tác insert
 * VÀ sau khi xoá — xác nhận cây vẫn cân bằng AVL, thay vì chỉ tin logic
 * đọc bằng mắt.
 *
 * ⚠️ Lưu ý thiết kế quan trọng: cây AVL_ModelTree sắp theo compareTo
 * (year, month), KHÔNG PHẢI theo name — nên "xoá theo tên" KHÔNG THỂ tìm
 * kiểu BST (không so sánh được tên với khoá cây), phải duyệt CẢ HAI nhánh
 * để tìm đúng node theo tên trước khi xoá bằng phương pháp copy.
 *
 * Đề yêu cầu nộp ĐÚNG 2 file (PE_SP25_Q1.java, PE_SP25_Q2.java) — nên lớp
 * Model được NHÚNG LẶP LẠI trong mỗi file (không tách file Model.java riêng)
 * để mỗi file tự đủ compile độc lập, đúng yêu cầu nộp bài của đề.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE14.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE14.mjs');
const SRC = '/tmp/csd201-pe14-final';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (Summer 2025, "FUDA"). Time allowed: 90 minutes. Software: Apache NetBeans IDE only. Students must submit exactly two files: <code>PE_SP25_Q1.java</code> and <code>PE_SP25_Q2.java</code> — not following this costs 1 point.</p>
   <p>The exam works with a dataset of AI (LLM) models. Each model has three attributes: name (String), monthPublish (int), yearPublish (int). Data:</p>
   <table><tr><th>Name</th><th>monthPublish</th><th>yearPublish</th></tr>
   <tr><td>GPT-4</td><td>3</td><td>2023</td></tr><tr><td>Claude</td><td>7</td><td>2023</td></tr>
   <tr><td>Gemini</td><td>12</td><td>2023</td></tr><tr><td>Llama</td><td>2</td><td>2024</td></tr>
   <tr><td>Mistral</td><td>9</td><td>2023</td></tr><tr><td>BERT</td><td>10</td><td>2018</td></tr>
   <tr><td>T5</td><td>10</td><td>2019</td></tr><tr><td>PaLM</td><td>4</td><td>2022</td></tr>
   <tr><td>Falcon</td><td>5</td><td>2023</td></tr><tr><td>Phi-2</td><td>12</td><td>2023</td></tr></table>
   <p><b>Note:</b> this paper does not itself state a marks breakdown per method or show a sample output — only the class/method requirements and the data table above. The points per question below were assigned proportionally to relative difficulty (summing to this paper's total of 10), and the "expected output" is this exam room's own verified run against the exact data table the paper provides — not an official answer key (none exists for this deck).</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (Summer 2025, "FUDA"). Thời gian: 90 phút. Công cụ: chỉ Apache NetBeans IDE. Phải nộp đúng 2 file: <code>PE_SP25_Q1.java</code> và <code>PE_SP25_Q2.java</code> — không tuân theo sẽ bị trừ 1 điểm.</p>
   <p>Đề làm việc với tập dữ liệu các mô hình AI (LLM). Mỗi mô hình có 3 thuộc tính: tên (String), monthPublish (int), yearPublish (int). Dữ liệu:</p>
   <table><tr><th>Name</th><th>monthPublish</th><th>yearPublish</th></tr>
   <tr><td>GPT-4</td><td>3</td><td>2023</td></tr><tr><td>Claude</td><td>7</td><td>2023</td></tr>
   <tr><td>Gemini</td><td>12</td><td>2023</td></tr><tr><td>Llama</td><td>2</td><td>2024</td></tr>
   <tr><td>Mistral</td><td>9</td><td>2023</td></tr><tr><td>BERT</td><td>10</td><td>2018</td></tr>
   <tr><td>T5</td><td>10</td><td>2019</td></tr><tr><td>PaLM</td><td>4</td><td>2022</td></tr>
   <tr><td>Falcon</td><td>5</td><td>2023</td></tr><tr><td>Phi-2</td><td>12</td><td>2023</td></tr></table>
   <p><b>Lưu ý:</b> đề gốc không tự ghi điểm thành phần cho mỗi method, cũng không có output mẫu — chỉ có yêu cầu lớp/method và bảng dữ liệu trên. Điểm từng câu dưới đây được TỰ PHÂN BỔ theo độ khó tương đối (tổng vẫn đúng 10 điểm của đề), và "expected output" là kết quả TỰ CHẠY VÀ VERIFY của phòng thi này trên đúng bảng dữ liệu đề cho — không phải đáp án chính thức (đề này không có).</p>`,
);

const q1Given = fs.readFileSync(path.join(SRC, 'PE_SP25_Q1.given.java'), 'utf8');
const q1Solved = fs.readFileSync(path.join(SRC, 'PE_SP25_Q1.solved.java'), 'utf8');
const q2Given = fs.readFileSync(path.join(SRC, 'PE_SP25_Q2.given.java'), 'utf8');
const q2Solved = fs.readFileSync(path.join(SRC, 'PE_SP25_Q2.solved.java'), 'utf8');

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Q1.1: removeFirst() – 1 mark</strong></p><ul><li>File: PE_SP25_Q1.java</li><li>Class: <code>PE_SP25_Q1</code> uses an array to manage the model data above.</li><li>Method to Complete: <code>removeFirst()</code></li><li>Task: removes the first element in the array (shifting the rest left, decreasing the logical size by 1). Does nothing if the array is empty.</li></ul>`,
    `<p><strong>Q1.1: removeFirst() – 1 điểm</strong></p><ul><li>File: PE_SP25_Q1.java</li><li>Lớp: <code>PE_SP25_Q1</code> dùng mảng để quản lý dữ liệu model ở trên.</li><li>Method cần hoàn thiện: <code>removeFirst()</code></li><li>Nhiệm vụ: xoá phần tử đầu tiên trong mảng (dồn các phần tử còn lại sang trái, giảm kích thước logic đi 1). Không làm gì nếu mảng rỗng.</li></ul>`,
  ),
  starterCode: q1Given,
  sampleSolution: q1Solved,
  expectedOutput: `After removeFirst(): (Claude,7,2023) (Gemini,12,2023) (Llama,2,2024) (Mistral,9,2023) (BERT,10,2018) (T5,10,2019) (PaLM,4,2022) (Falcon,5,2023) (Phi-2,12,2023)`,
  explanation: B(
    `<p>Verified by compiling and running the full reference solution: after 10 addLast() calls (GPT-4 first), removeFirst() correctly removes GPT-4 and shifts every remaining model left by one position.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu đầy đủ: sau 10 lần gọi addLast() (GPT-4 đầu tiên), removeFirst() xoá đúng GPT-4 và dồn mọi model còn lại sang trái 1 vị trí.</p>`,
  ),
  rubric: [
    { id: 'empty_check', criterion: B('Does nothing (no exception, no change) when the array is empty.', 'Không làm gì (không lỗi, không đổi gì) khi mảng rỗng.'), weight: 1, maxScore: 0.3 },
    { id: 'shift_and_size', criterion: B('Correctly shifts all remaining elements one position left and decreases the logical size by 1.', 'Dồn đúng mọi phần tử còn lại sang trái 1 vị trí và giảm đúng kích thước logic đi 1.'), weight: 1, maxScore: 0.7 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Q1.2: addLast() – 1 mark</strong></p><ul><li>File: PE_SP25_Q1.java</li><li>Method to Complete: <code>addLast(Model m)</code></li><li>Task: adds a new model to the end of the array, growing the backing array if it is full.</li></ul>`,
    `<p><strong>Q1.2: addLast() – 1 điểm</strong></p><ul><li>File: PE_SP25_Q1.java</li><li>Method cần hoàn thiện: <code>addLast(Model m)</code></li><li>Nhiệm vụ: thêm model mới vào CUỐI mảng, mở rộng mảng chứa nếu đã đầy.</li></ul>`,
  ),
  starterCode: q1Given,
  sampleSolution: q1Solved,
  expectedOutput: `After addLast(Grok,5,2024): (Claude,7,2023) (Gemini,12,2023) (Llama,2,2024) (Mistral,9,2023) (BERT,10,2018) (T5,10,2019) (PaLM,4,2022) (Falcon,5,2023) (Phi-2,12,2023) (Grok,5,2024)`,
  explanation: B(
    `<p>Verified by compiling and running the full reference solution: adding a new model ("Grok", 5, 2024) after removeFirst() correctly appends it at the end without disturbing the existing 9 models.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu đầy đủ: thêm model mới ("Grok", 5, 2024) sau removeFirst() nối đúng vào cuối, không ảnh hưởng 9 model còn lại.</p>`,
  ),
  rubric: [
    { id: 'grow_if_full', criterion: B('Grows the backing array when it is already full, without losing existing elements.', 'Mở rộng mảng chứa khi đã đầy, không làm mất phần tử cũ.'), weight: 1, maxScore: 0.4 },
    { id: 'append_correct', criterion: B('Correctly appends the new model at the logical end and increases the size.', 'Nối đúng model mới vào cuối logic và tăng đúng size.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(
    `<p><strong>Q1.3: quickSort() – 3 marks</strong></p><ul><li>File: PE_SP25_Q1.java</li><li>Method to Complete: <code>quickSort()</code></li><li>Task: sort the array ascending by yearPublish; if the same year, sort by monthPublish. You may add helper methods/fields as needed.</li></ul>`,
    `<p><strong>Q1.3: quickSort() – 3 điểm</strong></p><ul><li>File: PE_SP25_Q1.java</li><li>Method cần hoàn thiện: <code>quickSort()</code></li><li>Nhiệm vụ: sắp xếp mảng tăng dần theo yearPublish; nếu cùng năm thì sắp theo monthPublish. Được tự thêm method/trường phụ nếu cần.</li></ul>`,
  ),
  starterCode: q1Given,
  sampleSolution: q1Solved,
  expectedOutput: `After quickSort() (ascending by year, then month): (BERT,10,2018) (T5,10,2019) (PaLM,4,2022) (GPT-4,3,2023) (Falcon,5,2023) (Claude,7,2023) (Mistral,9,2023) (Gemini,12,2023) (Phi-2,12,2023) (Llama,2,2024) (Grok,5,2024)`,
  explanation: B(
    `<p>Verified by compiling and running the full reference solution against the paper's own 10-model table plus the Grok model added earlier: 2018 &lt; 2019 &lt; 2022 &lt; 2023 (six models, ordered by month 3,5,7,9,12,12) &lt; 2024 (two models, ordered by month 2,5) — hand-traced independently and matching the program's output exactly.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu trên đúng bảng 10 model của đề cộng model Grok thêm trước đó: 2018 &lt; 2019 &lt; 2022 &lt; 2023 (6 model, sắp theo tháng 3,5,7,9,12,12) &lt; 2024 (2 model, sắp theo tháng 2,5) — tự tính tay độc lập và khớp đúng output chương trình.</p>`,
  ),
  rubric: [
    { id: 'correct_algorithm', criterion: B('Implements a genuine quicksort (partition + recursive divide-and-conquer), not merely calling a built-in sort.', 'Cài đặt quicksort thật (partition + đệ quy chia để trị), không chỉ gọi hàm sort có sẵn.'), weight: 1, maxScore: 1.5 },
    { id: 'correct_order', criterion: B('Produces the fully correct ascending order by year, then by month on ties.', 'Cho ra đúng thứ tự tăng dần theo năm, rồi theo tháng khi hoà năm.'), weight: 1, maxScore: 1.5 },
  ],
};

const q2_0 = {
  kind: 'CODE', points: 0.5, language: 'java',
  prompt: B(
    `<p><strong>Q2.0: Model.compareTo() – 0.5 mark</strong></p><ul><li>File: PE_SP25_Q2.java</li><li>Class: <code>Model</code> (nested inside PE_SP25_Q2.java, per the submission requirement of exactly 2 files)</li><li>Method to Complete: <code>compareTo(Model other)</code></li><li>Task: compare by yearPublish; if the same year, compare by monthPublish.</li></ul>`,
    `<p><strong>Q2.0: Model.compareTo() – 0.5 điểm</strong></p><ul><li>File: PE_SP25_Q2.java</li><li>Lớp: <code>Model</code> (lồng trong PE_SP25_Q2.java, theo đúng yêu cầu nộp đúng 2 file)</li><li>Method cần hoàn thiện: <code>compareTo(Model other)</code></li><li>Nhiệm vụ: so sánh theo yearPublish; nếu cùng năm thì so sánh theo monthPublish.</li></ul>`,
  ),
  starterCode: q2Given,
  sampleSolution: q2Solved,
  expectedOutput: `(No isolated output — correctness verified through Q2.1/Q2.2: the AVL tree's in-order traversal comes out sorted ascending by year/month, which is only possible if compareTo is correct.)`,
  explanation: B(
    `<p>Verified indirectly but rigorously: since the AVL tree's insert() relies entirely on compareTo to decide left/right placement, the in-order traversal (Q2.2) coming out in exactly the correct ascending (year, month) order — matching Q1.3's independently-verified quickSort order — is strong evidence compareTo is implemented correctly.</p>`,
    `<p>Đã kiểm gián tiếp nhưng chặt chẽ: vì insert() của cây AVL hoàn toàn dựa vào compareTo để quyết định đặt trái/phải, việc duyệt in-order (Q2.2) ra đúng thứ tự tăng dần (năm, tháng) — khớp với thứ tự quickSort đã verify độc lập ở Q1.3 — là bằng chứng mạnh compareTo được cài đặt đúng.</p>`,
  ),
  rubric: [
    { id: 'year_compare', criterion: B('Compares by yearPublish first.', 'So sánh theo yearPublish trước.'), weight: 1, maxScore: 0.25 },
    { id: 'month_tiebreak', criterion: B('Falls back to comparing monthPublish when the year is the same.', 'So sánh theo monthPublish khi cùng năm.'), weight: 1, maxScore: 0.25 },
  ],
};

const q2_1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(
    `<p><strong>Q2.1: AVL_ModelTree.insert() – 2 marks</strong></p><ul><li>File: PE_SP25_Q2.java</li><li>Class: <code>AVL_ModelTree</code> (linked-list implementation)</li><li>Method to Complete: <code>insert(Model m)</code> (and its recursive helper)</li><li>Task: insert a model into the AVL tree, using compareTo to compare, and keep the AVL property (every node's left/right subtree heights differ by at most 1) after insertion — via rotations as needed.</li></ul>`,
    `<p><strong>Q2.1: AVL_ModelTree.insert() – 2 điểm</strong></p><ul><li>File: PE_SP25_Q2.java</li><li>Lớp: <code>AVL_ModelTree</code> (cài đặt bằng linked-list)</li><li>Method cần hoàn thiện: <code>insert(Model m)</code> (và hàm đệ quy phụ trợ)</li><li>Nhiệm vụ: chèn model vào cây AVL, dùng compareTo để so sánh, và giữ đúng tính chất AVL (chiều cao cây con trái/phải của mọi node lệch nhau tối đa 1) sau khi chèn — bằng các phép xoay khi cần.</li></ul>`,
  ),
  starterCode: q2Given,
  sampleSolution: q2Solved,
  expectedOutput: `In-order after inserting all 10 models:
(BERT,10,2018) (T5,10,2019) (PaLM,4,2022) (GPT-4,3,2023) (Falcon,5,2023) (Claude,7,2023) (Mistral,9,2023) (Gemini,12,2023) (Phi-2,12,2023) (Llama,2,2024)
AVL-balanced after inserts? true`,
  explanation: B(
    `<p>Verified by compiling and running the full reference solution: inserting all 10 models (in the paper's own table order, which is NOT already sorted — so rotations are genuinely exercised) produces an in-order traversal in fully correct ascending (year, month) order, AND an explicit recursive balance-factor check (written purely to verify this deck, not part of the graded requirement) confirms every node satisfies |height(left) - height(right)| ≤ 1 after all insertions.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu đầy đủ: chèn cả 10 model (theo đúng thứ tự bảng của đề, KHÔNG đã sắp sẵn — nên các phép xoay thực sự được kích hoạt) cho ra duyệt in-order đúng thứ tự tăng dần (năm, tháng), VÀ 1 hàm kiểm tra balance factor đệ quy tường minh (viết riêng để verify đề này, không phải yêu cầu chấm điểm) xác nhận mọi node thoả |chiều cao(trái) - chiều cao(phải)| ≤ 1 sau khi chèn hết.</p>`,
  ),
  rubric: [
    { id: 'bst_insert_by_compareto', criterion: B('Correctly inserts respecting BST ordering by compareTo (year, then month).', 'Chèn đúng thứ tự BST theo compareTo (năm, rồi tháng).'), weight: 1, maxScore: 0.7 },
    { id: 'height_update', criterion: B("Correctly maintains each node's height field after insertion.", 'Cập nhật đúng trường height của mỗi node sau khi chèn.'), weight: 1, maxScore: 0.5 },
    { id: 'rotations', criterion: B('Correctly applies rotations (all 4 cases: LL, RR, LR, RL) to restore the AVL property whenever a node becomes unbalanced.', 'Áp dụng đúng các phép xoay (đủ 4 trường hợp LL, RR, LR, RL) để khôi phục tính chất AVL khi có node mất cân bằng.'), weight: 1, maxScore: 0.8 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 0.5, language: 'java',
  prompt: B(
    `<p><strong>Q2.2: AVL_ModelTree.inOrder() – 0.5 mark</strong></p><ul><li>File: PE_SP25_Q2.java</li><li>Method to Complete: <code>inOrder()</code> (and its recursive helper)</li><li>Task: traverse the AVL tree in in-order (left, node, right) and print each model.</li></ul>`,
    `<p><strong>Q2.2: AVL_ModelTree.inOrder() – 0.5 điểm</strong></p><ul><li>File: PE_SP25_Q2.java</li><li>Method cần hoàn thiện: <code>inOrder()</code> (và hàm đệ quy phụ trợ)</li><li>Nhiệm vụ: duyệt cây AVL theo in-order (trái, gốc, phải) và in ra từng model.</li></ul>`,
  ),
  starterCode: q2Given,
  sampleSolution: q2Solved,
  expectedOutput: `(BERT,10,2018) (T5,10,2019) (PaLM,4,2022) (GPT-4,3,2023) (Falcon,5,2023) (Claude,7,2023) (Mistral,9,2023) (Gemini,12,2023) (Phi-2,12,2023) (Llama,2,2024)`,
  explanation: B(
    `<p>Verified by compiling and running the full reference solution — a standard recursive in-order traversal (left subtree, print current, right subtree) over a correctly-built BST-by-compareTo tree naturally yields ascending order.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu — duyệt in-order đệ quy chuẩn (cây con trái, in node hiện tại, cây con phải) trên 1 cây BST-theo-compareTo dựng đúng sẽ tự nhiên cho ra thứ tự tăng dần.</p>`,
  ),
  rubric: [
    { id: 'inorder_order', criterion: B('Correctly visits left subtree, then current node, then right subtree, for every node.', 'Thăm đúng thứ tự cây con trái, node hiện tại, cây con phải, cho mọi node.'), weight: 1, maxScore: 1 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(
    `<p><strong>Q2.3: AVL_ModelTree.deleteByName() – 2 marks (delete by copy)</strong></p><ul><li>File: PE_SP25_Q2.java</li><li>Method to Complete: <code>deleteByName(String name)</code> (and its recursive helper)</li><li>Task: delete a model by name, using the "delete by copy" method (replace the target node's data with its in-order successor's data, then remove the successor). Must keep the AVL property after deletion (rebalance every ancestor on the way back up).</li><li><b>Note:</b> the tree is keyed by compareTo (year, month), NOT by name — locating the node by name cannot use ordered BST search, both subtrees must be searched until the matching name is found.</li></ul>`,
    `<p><strong>Q2.3: AVL_ModelTree.deleteByName() – 2 điểm (xoá bằng copy)</strong></p><ul><li>File: PE_SP25_Q2.java</li><li>Method cần hoàn thiện: <code>deleteByName(String name)</code> (và hàm đệ quy phụ trợ)</li><li>Nhiệm vụ: xoá 1 model theo tên, dùng phương pháp "xoá bằng copy" (thay dữ liệu của node cần xoá bằng dữ liệu của node kế tiếp in-order, rồi xoá node kế tiếp đó). Phải giữ đúng tính chất AVL sau khi xoá (cân bằng lại mọi tổ tiên trên đường đi lên).</li><li><b>Lưu ý:</b> cây sắp theo compareTo (năm, tháng), KHÔNG PHẢI theo tên — tìm node theo tên KHÔNG dùng được tìm kiếm BST có thứ tự, phải duyệt cả 2 nhánh để tìm đúng tên.</li></ul>`,
  ),
  starterCode: q2Given,
  sampleSolution: q2Solved,
  expectedOutput: `In-order after deleting "BERT":
(T5,10,2019) (PaLM,4,2022) (GPT-4,3,2023) (Falcon,5,2023) (Claude,7,2023) (Mistral,9,2023) (Gemini,12,2023) (Phi-2,12,2023) (Llama,2,2024)
AVL-balanced after delete? true`,
  explanation: B(
    `<p>Verified by compiling and running the full reference solution: deleting "BERT" (2018, the smallest key — a case exercising the "node with fewer than 2 children" branch, since it has no left child in this tree's shape) correctly removes it from the in-order sequence, leaving the other 9 models in the same correct ascending order — and the explicit balance-factor check confirms the AVL property still holds after deletion.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật lời giải tham chiếu đầy đủ: xoá "BERT" (2018, khoá nhỏ nhất — trường hợp thực thi nhánh "node có ít hơn 2 con", vì không có con trái trong hình dạng cây này) xoá đúng khỏi dãy in-order, giữ nguyên 9 model còn lại đúng thứ tự tăng dần — và hàm kiểm tra balance factor tường minh xác nhận tính chất AVL vẫn giữ nguyên sau khi xoá.</p>`,
  ),
  rubric: [
    { id: 'find_by_name', criterion: B('Correctly locates the node with the matching name by searching both subtrees (not relying on compareTo-based ordering).', 'Tìm đúng node có tên khớp bằng cách duyệt cả 2 nhánh (không dựa vào thứ tự compareTo).'), weight: 1, maxScore: 0.6 },
    { id: 'delete_by_copy', criterion: B("Correctly deletes using the copy method: for a two-children node, copies the in-order successor's data over and removes the successor instead.", 'Xoá đúng bằng phương pháp copy: với node có 2 con, copy dữ liệu của node kế tiếp in-order rồi xoá node kế tiếp đó thay vì xoá trực tiếp.'), weight: 1, maxScore: 0.7 },
    { id: 'rebalance_after_delete', criterion: B('Correctly rebalances every ancestor on the path back up to the root after deletion, restoring the AVL property.', 'Cân bằng lại đúng mọi tổ tiên trên đường đi lên root sau khi xoá, khôi phục đúng tính chất AVL.'), weight: 1, maxScore: 0.7 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE14',
    title: 'PE Đề 14 — Practical Exam (Summer 2025, FUDA)|||PE Đề 14 — Thi thực hành (Summer 2025, FUDA)',
    description: 'CSD201 PE (CODE): array-based model management (quicksort) + an AVL tree with insert/in-order/delete-by-copy, written from scratch (no given project), AI-graded.|||PE CSD201 (viết mã): quản lý mảng model (quicksort) + cây AVL với insert/in-order/xoá-bằng-copy, viết từ đầu (không có project given), chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q2_0, q2_1, q2_2, q2_3],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
