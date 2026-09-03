/**
 * build-csd201-pe1.mjs — sinh content/exams/CSD201-PE1.mjs.
 *
 * Nguồn thật: material_0.zip (NetBeans project, Fruit/ShipmentCLL/FruitBST/
 * Assignment/Main/Lib.java + data.txt). 4 method cần hoàn thiện:
 * ShipmentCLL.countFruits()/removeById(), FruitBST.insert()/countInRange().
 * Lời giải đã VERIFY THẬT: javac + java Main, chạy cả 4 lựa chọn (f1-f4),
 * output khớp BYTE-FOR-BYTE với "Expected example output" in trong paper.pdf.
 * given.materials đã upload nguyên xi lên R2 (không sửa gì), verify GET 200.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE1.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE1.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE1-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper).</p>
   <ol>
     <li>Software: NetBeans IDE 13, Java JDK 8. Download the given materials above.</li>
     <li>Your task is to <strong>complete the method bodies only</strong>. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật).</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 13, Java JDK 8. Tải given materials ở trên.</li>
     <li>Chỉ được <strong>hoàn thiện phần thân method</strong>. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const scenarioEn = `<p><strong>Scenario:</strong> You will complete a Java program that manages a fruit import-export store. The system uses a Circularly Linked List (CLL) to manage today's shipment list and a Binary Search Tree (BST) to store all fruit products in the warehouse, sorted by fruitId.</p>
<p><strong>Class Structure:</strong> <code>Fruit</code> (fruitId, name, quantity, price) · <code>ShipmentCLL</code> — circular linked list for today's shipment · <code>FruitBST</code> — binary search tree of all warehouse fruits sorted by fruitId.</p>`;
const scenarioVi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java quản lý cửa hàng xuất nhập khẩu trái cây. Hệ thống dùng Danh sách liên kết vòng (CLL) quản lý lô hàng hôm nay, và Cây nhị phân tìm kiếm (BST) lưu toàn bộ trái cây trong kho, sắp theo fruitId.</p>
<p><strong>Cấu trúc lớp:</strong> <code>Fruit</code> (fruitId, name, quantity, price) · <code>ShipmentCLL</code> — danh sách liên kết vòng cho lô hàng hôm nay · <code>FruitBST</code> — cây BST toàn bộ trái cây trong kho sắp theo fruitId.</p>`;

const SRC = '/tmp/csd201-pe1-src/src';
const sampleShipmentCLL = fs.readFileSync(path.join(SRC, 'ShipmentCLL.java'), 'utf8');
const sampleFruitBST = fs.readFileSync(path.join(SRC, 'FruitBST.java'), 'utf8');

const starterShipmentCLL = sampleShipmentCLL
  .replace(/    public int countFruits\(\) \{[\s\S]*?\n    \}/, `    public int countFruits() {
        int count = 0;
        // ---------- Student's code starts from here ----------
        // Students are welcomed to use any helper function(s)

        // -----------------------------------------------------
        return count;
    }`)
  .replace(/    public void removeById\(String id\) \{[\s\S]*?\n    \}/, `    public void removeById(String id) {
        // ---------- Student's code starts from here ----------
        // Students are welcomed to use any helper function(s)
        return;
        // -----------------------------------------------------
    }`);

const starterFruitBST = sampleFruitBST
  .replace(/    public void insert\(Fruit fruit\) \{[\s\S]*?private Node insertRec[\s\S]*?\n    \}\n\n    public int countInRange/, `    public void insert(Fruit fruit) {
        // ---------- Student's code starts from here ----------
        // Students are welcomed to use any helper function(s)
        return;
        // -----------------------------------------------------
    }

    public int countInRange`)
  .replace(/    public int countInRange\(String minId, String maxId\) \{[\s\S]*$/, `    public int countInRange(String minId, String maxId) {
        int count = 0;
        // ---------- Student's code starts from here ----------
        // Students are welcomed to use any helper function(s)

        // -----------------------------------------------------
        return count;
    }
}`);

const q1 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    scenarioEn + `<p><strong>Câu 1: f1() – 2.5 marks: Count Fruits in Shipment</strong></p><ul><li>File: ShipmentCLL.java</li><li>Method to Complete: <code>countFruits()</code></li><li>Task: Walk through the circular linked list and return the number of fruits currently in today's shipment list. If the shipment list is empty, return 0.</li></ul>`,
    scenarioVi + `<p><strong>Câu 1: f1() – 2.5 điểm: Đếm số trái cây trong lô hàng</strong></p><ul><li>File: ShipmentCLL.java</li><li>Method cần hoàn thiện: <code>countFruits()</code></li><li>Nhiệm vụ: Duyệt danh sách liên kết vòng, trả về số trái cây trong lô hàng hôm nay. Nếu lô hàng rỗng, trả về 0.</li></ul>`
  ),
  starterCode: starterShipmentCLL,
  sampleSolution: sampleShipmentCLL,
  expectedOutput: `Current Shipment:
(F03,Apple,200,1.2)(F02,Banana,150,0.8)(F04,Mango,100,2.5)(F05,Orange,180,1.5)(F01,Grape,120,3.0)(F99,DragonFruit,50,4.5)
Counted fruits: 6`,
  explanation: B(
    `<p>Verified by compiling against the real given project (Main.java/Lib.java unchanged) and running choice 1 — output matches the paper's expected example byte-for-byte. Traverse the circular list once starting at <code>head</code>, counting nodes until returning to <code>head</code> (do-while, since a circular list has no null terminator); return 0 immediately if <code>head == null</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật (Main.java/Lib.java giữ nguyên) và chạy lựa chọn 1 — output khớp byte-for-byte với ví dụ trong đề. Duyệt 1 vòng danh sách liên kết vòng từ <code>head</code>, đếm node tới khi quay lại <code>head</code> (dùng do-while vì danh sách vòng không có điểm kết thúc null); trả về 0 ngay nếu <code>head == null</code>.</p>`
  ),
  rubric: [
    { id: 'traverse', criterion: B('Traverses the circular list correctly using a do-while (or equivalent) loop terminating back at head.', 'Duyệt đúng danh sách liên kết vòng bằng do-while (hoặc tương đương) dừng khi quay lại head.'), weight: 1, maxScore: 1.5 },
    { id: 'empty', criterion: B('Returns 0 correctly when the shipment list is empty.', 'Trả về 0 đúng khi lô hàng rỗng.'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 2.5 marks: Remove a Fruit from Shipment by ID</strong></p><ul><li>File: ShipmentCLL.java</li><li>Method to Complete: <code>removeById(String id)</code></li><li>Task: Remove the node whose fruitId equals the given id from the Circular Linked List. Handle all possible cases.</li></ul>`,
    `<p><strong>Câu 2: f2() – 2.5 điểm: Xoá 1 trái cây khỏi lô hàng theo ID</strong></p><ul><li>File: ShipmentCLL.java</li><li>Method cần hoàn thiện: <code>removeById(String id)</code></li><li>Nhiệm vụ: Xoá node có fruitId khớp id đã cho khỏi danh sách liên kết vòng. Xử lý mọi trường hợp có thể.</li></ul>`
  ),
  starterCode: starterShipmentCLL,
  sampleSolution: sampleShipmentCLL,
  expectedOutput: `Current Shipment:
(F03,Apple,200,1.2)(F02,Banana,150,0.8)(F04,Mango,100,2.5)(F05,Orange,180,1.5)(F01,Grape,120,3.0)(F99,DragonFruit,50,4.5)
Shipment after removing F02:
(F03,Apple,200,1.2)(F04,Mango,100,2.5)(F05,Orange,180,1.5)(F01,Grape,120,3.0)(F99,DragonFruit,50,4.5)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 — output matches the paper's expected example byte-for-byte. Three cases handled: (1) removing the <code>head</code> node when it's the only node (list becomes empty), (2) removing <code>head</code> when other nodes exist (must find the LAST node first to re-point its <code>next</code> to the new head), (3) removing a non-head node (standard prev/curr unlink). If no node matches the id, the list is left unchanged.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 — output khớp byte-for-byte với ví dụ trong đề. Xử lý 3 trường hợp: (1) xoá node <code>head</code> khi đó là node duy nhất (danh sách thành rỗng), (2) xoá <code>head</code> khi còn node khác (phải tìm node CUỐI trước để trỏ lại <code>next</code> sang head mới), (3) xoá node không phải head (unlink prev/curr chuẩn). Nếu không có node nào khớp id, giữ nguyên danh sách.</p>`
  ),
  rubric: [
    { id: 'find', criterion: B('Correctly locates the node with the matching fruitId while traversing the circular list.', 'Tìm đúng node có fruitId khớp khi duyệt danh sách vòng.'), weight: 1, maxScore: 0.8 },
    { id: 'unlink_mid', criterion: B('Correctly unlinks a non-head node (prev.next = curr.next).', 'Unlink đúng node không phải head (prev.next = curr.next).'), weight: 1, maxScore: 0.7 },
    { id: 'unlink_head', criterion: B('Correctly handles removing the head node, including re-pointing the last node and the single-node-becomes-empty case.', 'Xử lý đúng khi xoá node head, kể cả trỏ lại node cuối và trường hợp còn 1 node thành rỗng.'), weight: 1, maxScore: 1 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 2.5 marks: Insert Fruit into Warehouse (Binary Search Tree)</strong></p><ul><li>File: FruitBST.java</li><li>Method to Complete: <code>insert(Fruit fruit)</code></li><li>Task: Implement the logic to insert a new Fruit object into the Binary Search Tree. The tree is ordered alphabetically by the fruitId.<ul><li>Insert the fruit into the correct position according to BST rules.</li><li>If the fruitId already exists in the tree, that fruit is ignored.</li></ul></li></ul>`,
    `<p><strong>Câu 3: f3() – 2.5 điểm: Chèn trái cây vào kho (Cây nhị phân tìm kiếm)</strong></p><ul><li>File: FruitBST.java</li><li>Method cần hoàn thiện: <code>insert(Fruit fruit)</code></li><li>Nhiệm vụ: Chèn 1 Fruit mới vào cây BST, sắp theo bảng chữ cái của fruitId.<ul><li>Chèn đúng vị trí theo quy tắc BST.</li><li>Nếu fruitId đã tồn tại trong cây, bỏ qua trái cây đó.</li></ul></li></ul>`
  ),
  starterCode: starterFruitBST,
  sampleSolution: sampleFruitBST,
  expectedOutput: `Current Fruits (Alphabetically Ordered by ID):
(F01,Grape,120,3.0)(F02,Banana,150,0.8)(F03,Apple,200,1.2)(F04,Mango,100,2.5)(F05,Orange,180,1.5)(F99,DragonFruit,50,4.5)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 — the in-order traversal (already provided in <code>ftraverse()</code>) output matches the paper's expected example byte-for-byte, confirming the BST ordering by fruitId string comparison is correct. Standard recursive BST insert: <code>fruitId.compareTo(node.info.fruitId)</code> decides left/right; on equal id (duplicate), the existing node is returned unchanged (fruit ignored).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 — kết quả duyệt in-order (đã có sẵn trong <code>ftraverse()</code>) khớp byte-for-byte với ví dụ trong đề, xác nhận thứ tự BST theo so sánh chuỗi fruitId đúng. Chèn BST đệ quy chuẩn: <code>fruitId.compareTo(node.info.fruitId)</code> quyết định trái/phải; nếu id trùng (trùng lặp), trả về node cũ không đổi (bỏ qua trái cây mới).</p>`
  ),
  rubric: [
    { id: 'bst_order', criterion: B('Inserts respecting BST ordering by fruitId (string comparison), correct left/right recursion.', 'Chèn đúng thứ tự BST theo fruitId (so sánh chuỗi), đệ quy trái/phải đúng.'), weight: 1, maxScore: 1.5 },
    { id: 'dup', criterion: B('Ignores insertion when the fruitId already exists in the tree.', 'Bỏ qua khi fruitId đã tồn tại trong cây.'), weight: 1, maxScore: 1 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 2.5 marks: Count Fruits in ID Range</strong></p><ul><li>File: FruitBST.java</li><li>Method to Complete: <code>countInRange(String minId, String maxId)</code></li><li>Task: Count the fruits in the BST whose id lies between minId and maxId (inclusive).<ul><li>If no fruit satisfies the condition, return 0</li></ul></li></ul>`,
    `<p><strong>Câu 4: f4() – 2.5 điểm: Đếm trái cây trong khoảng ID</strong></p><ul><li>File: FruitBST.java</li><li>Method cần hoàn thiện: <code>countInRange(String minId, String maxId)</code></li><li>Nhiệm vụ: Đếm số trái cây trong BST có id nằm giữa minId và maxId (bao gồm hai đầu).<ul><li>Nếu không có trái cây nào thoả điều kiện, trả về 0</li></ul></li></ul>`
  ),
  starterCode: starterFruitBST,
  sampleSolution: sampleFruitBST,
  expectedOutput: `Current Fruits:
(F01,Grape,120,3.0)(F02,Banana,150,0.8)(F03,Apple,200,1.2)(F04,Mango,100,2.5)(F05,Orange,180,1.5)(F99,DragonFruit,50,4.5)
Counting fruits with fruitId in range [F03,F08]:
Result: 3`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 — Result: 3 matches the paper's expected example exactly (F03 Apple, F04 Mango, F05 Orange fall in [F03,F08]; F01, F02 fall below F03; F99 falls above F08). Recursive full-tree scan (not a pruned BST range search) using <code>String.compareTo()</code> for the inclusive bounds check — safe and correct for this tree size, and matches the "walk the whole tree" style already used by the given <code>ftraverse()</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 — Result: 3 khớp chính xác ví dụ trong đề (F03 Apple, F04 Mango, F05 Orange nằm trong [F03,F08]; F01, F02 nhỏ hơn F03; F99 lớn hơn F08). Quét đệ quy toàn cây (không phải tìm phạm vi có cắt tỉa BST) dùng <code>String.compareTo()</code> để kiểm biên bao gồm hai đầu — an toàn và đúng với kích thước cây này, khớp phong cách "duyệt cả cây" đã có sẵn trong <code>ftraverse()</code>.</p>`
  ),
  rubric: [
    { id: 'range_check', criterion: B('Correctly checks fruitId is within [minId, maxId] inclusive using String comparison.', 'Kiểm đúng fruitId nằm trong [minId, maxId] bao gồm hai đầu, dùng so sánh chuỗi.'), weight: 1, maxScore: 1.5 },
    { id: 'full_scan', criterion: B('Scans the whole tree (or a correct range-pruned traversal) so no in-range fruit is missed.', 'Quét đủ cả cây (hoặc duyệt có cắt tỉa đúng) để không bỏ sót trái cây nào trong khoảng.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE1-SP26P1',
    title: 'PE Đề 1 — Practical Exam (SP26 - Paper 1)|||PE Đề 1 — Thi thực hành (SP26 - Paper 1)',
    description: 'CSD201 PE (CODE): complete circular linked list + BST methods for a fruit warehouse system, AI-graded.|||PE CSD201 (viết mã): hoàn thiện method danh sách liên kết vòng + BST cho hệ thống kho trái cây, chấm AI.',
    durationMinutes: 60,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE1-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
