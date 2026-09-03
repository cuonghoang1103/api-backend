/**
 * build-csd201-pe18.mjs — sinh content/exams/CSD201-PE18.mjs.
 *
 * Nguồn thật: csd201_pe_d2_896481.zip (Đề "D2") — MỘT project (Q1),
 * "House Moving Process": ItemList (danh sách liên kết đơn) + Truck
 * (stack, cài bằng danh sách liên kết, push vào head). 4 câu 2.5đ.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main, cả 4 lựa chọn với
 * data.txt đi kèm — khớp BYTE-FOR-BYTE 100% với ví dụ minh hoạ (chỉ
 * khác dấu cách sau dấu phẩy trong toString(), do PDF rút gọn khi in
 * — bản thân toString() given không sửa dùng ", " chứ không phải ",").
 *
 * Phát hiện: data.txt có 8 món hàng (thêm Money w=0, Gold l=0) nhưng
 * đề chỉ hiển thị 6 món trong f1 — vì Item class ghi rõ ràng buộc
 * "weight (must be > 0)... length (must be > 0)" → addLast()/push()
 * phải LỌC bỏ item vi phạm (weight<=0 hoặc length<=0), không chỉ đơn
 * thuần thêm vào cuối. Verify: lọc đúng 2 món (Money, Gold) khớp
 * chính xác 6 món còn lại trong ví dụ đề.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE18.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE18.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE18-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "D2").</p>
   <ol>
     <li>Software: NetBeans IDE 8.x, Java JDK 1.8. Download the given materials above.</li>
     <li>Do not add new import statement(s) to the given files.</li>
     <li>Do not use accented Vietnamese when writing comments in the program.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "D2").</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Tải given materials ở trên.</li>
     <li>Không thêm import mới vào các file đã cho.</li>
     <li>Không dùng tiếng Việt có dấu khi viết chú thích trong chương trình.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const SCENARIO = B(
  `<p><strong>Scenario: House moving process.</strong></p>
   <p><strong>Class Structure:</strong> <code>Item</code> (name, weight — must be &gt; 0, length — must be &gt; 0, fragile — 1 if fragile, 0 if not) · <code>Node</code> — an Item plus a next pointer · <code>ItemList</code> — a singly linked list managing regular furniture items in the house · <code>Truck</code> — a stack (implemented as a singly linked list) holding items loaded onto the truck; items are <code>pushed</code> to the head (FIFO in this test, per the paper's own class description) · <code>House</code> — the main class, holding an ItemList (house furniture) and a Truck (items loaded for transport).</p>`,
  `<p><strong>Bối cảnh: Quy trình chuyển nhà.</strong></p>
   <p><strong>Cấu trúc lớp:</strong> <code>Item</code> (name, weight — phải &gt; 0, length — phải &gt; 0, fragile — 1 nếu dễ vỡ, 0 nếu không) · <code>Node</code> — Item và con trỏ next · <code>ItemList</code> — danh sách liên kết đơn quản lý đồ đạc trong nhà · <code>Truck</code> — stack (cài bằng danh sách liên kết đơn) chứa đồ đã chất lên xe; đồ <code>push</code> vào head · <code>House</code> — lớp chính, chứa 1 ItemList (đồ trong nhà) và 1 Truck (đồ đã chất lên xe).</p>`,
);

const SOLVED = '/tmp/csd201-pe18-src/src/House.java';
const ORIG = '/tmp/csd201-pe18-orig/b/CSD201_PE_D2_896481/PaperNo_1/Q1/src/House.java';
const rd = (p) => fs.readFileSync(p, 'utf8');
const solved = rd(SOLVED);
const starter = rd(ORIG);

const q1 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>a. f1(): 2.5 marks – Load data</strong></p>
     <p>To complete f1(), students must:</p>
     <ol><li>Implement <code>addLast(String name, int weight, int length, int fragile)</code> in the ItemList class - list.</li>
     <li>Implement <code>push(String name, int weight, int length, int fragile)</code> in the Truck class - truck.</li></ol>
     <p>Remember the class invariant: an Item's weight and length must both be &gt; 0.</p>`,
    `<p><strong>a. f1(): 2.5 điểm – Nạp dữ liệu</strong></p>
     <p>Để hoàn thành f1(), cần:</p>
     <ol><li>Cài <code>addLast(String name, int weight, int length, int fragile)</code> trong ItemList - danh sách.</li>
     <li>Cài <code>push(String name, int weight, int length, int fragile)</code> trong Truck - xe.</li></ol>
     <p>Nhớ ràng buộc của lớp Item: weight và length đều phải &gt; 0.</p>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `ItemList Inventory: (Stove, 10, 2, 0) (Lamp, 5, 1, 1) (Table, 80, 3, 0) (Sofa, 50, 2, 0) (TV, 20, 1, 1) (Chair, 7, 1, 0)\nTruck Contents: (Pot, 10, 1, 1) (Bed, 100, 2, 0)`,
  explanation: B(
    `<p>Verified by compiling against the real given project (Item.java/Node.java/Main.java/Lib.java unchanged) and running choice 1 — output matches the paper's expected example byte-for-byte. The bundled data.txt actually lists 8 items, but 2 of them ("Money" with weight=0, "Gold" with length=0) violate the class's own documented invariant ("weight must be &gt; 0", "length must be &gt; 0"); <code>addLast()</code> and <code>push()</code> both skip such invalid items, matching the paper's list of exactly 6 items.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật (Item.java/Node.java/Main.java/Lib.java giữ nguyên) và chạy lựa chọn 1 — output khớp byte-for-byte với ví dụ trong đề. data.txt đi kèm thật ra liệt kê 8 món, nhưng 2 món ("Money" weight=0, "Gold" length=0) vi phạm ràng buộc của chính lớp Item ("weight phải &gt; 0", "length phải &gt; 0"); cả <code>addLast()</code> và <code>push()</code> đều bỏ qua các món vi phạm này, khớp đúng danh sách 6 món của đề.</p>`
  ),
  rubric: [
    { id: 'addlast', criterion: B('addLast() correctly appends valid items (weight>0 and length>0) to the end of the list, rejecting invalid ones.', 'addLast() thêm đúng các món hợp lệ (weight>0 và length>0) vào cuối danh sách, loại bỏ món không hợp lệ.'), weight: 1, maxScore: 1.5 },
    { id: 'push', criterion: B('push() correctly pushes valid items to the head of the truck stack.', 'push() chèn đúng món hợp lệ vào đầu stack xe.'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>b. f2(): 2.5 marks – Load the first fragile item onto the truck</strong></p>
     <p>To complete f2(), students must:</p>
     <ol><li>Implement <code>deleteFirstFragile()</code> to remove the first fragile item from the list.</li>
     <li>Then push this item into the truck.</li></ol>`,
    `<p><strong>b. f2(): 2.5 điểm – Chất món dễ vỡ đầu tiên lên xe</strong></p>
     <p>Để hoàn thành f2(), cần:</p>
     <ol><li>Cài <code>deleteFirstFragile()</code> — xoá món dễ vỡ đầu tiên khỏi danh sách.</li>
     <li>Chất món đó lên xe (push).</li></ol>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `ItemList Inventory: (Stove, 10, 2, 0) (Lamp, 5, 1, 1) (Table, 80, 3, 0) (Sofa, 50, 2, 0) (TV, 20, 1, 1) (Chair, 7, 1, 0)\nTruck Contents: (Pot, 10, 1, 1) (Bed, 100, 2, 0)\nItemList Inventory: (Stove, 10, 2, 0) (Table, 80, 3, 0) (Sofa, 50, 2, 0) (TV, 20, 1, 1) (Chair, 7, 1, 0)\nTruck Contents: (Lamp, 5, 1, 1) (Pot, 10, 1, 1) (Bed, 100, 2, 0)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 — output matches the paper's expected example byte-for-byte. <code>deleteFirstFragile()</code> walks the list unlinking the first node with <code>fragile == 1</code> (Lamp) and returns it; that removed node is then pushed onto the truck (landing at the head, ahead of Pot and Bed).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 — output khớp byte-for-byte với ví dụ trong đề. <code>deleteFirstFragile()</code> duyệt danh sách, gỡ node đầu tiên có <code>fragile == 1</code> (Lamp) và trả về; node đó được push lên xe (nằm ở đầu, trước Pot và Bed).</p>`
  ),
  rubric: [
    { id: 'delete_first_fragile', criterion: B('deleteFirstFragile() correctly removes and returns the first fragile item, unlinking it properly (including tail update).', 'deleteFirstFragile() xoá và trả đúng món dễ vỡ đầu tiên, gỡ liên kết đúng (kể cả cập nhật tail).'), weight: 1, maxScore: 1.5 },
    { id: 'push_removed', criterion: B('The removed item is correctly pushed onto the truck.', 'Món vừa xoá được push đúng lên xe.'), weight: 1, maxScore: 1 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>c. f3(): 2.5 marks – Load all fragile items onto the truck</strong></p>
     <p>To complete f3(), students must:</p>
     <ol><li>Remove all fragile items from the list.</li><li>Then push each removed item into the truck in the same order they were removed from the original list.</li></ol>`,
    `<p><strong>c. f3(): 2.5 điểm – Chất TẤT CẢ món dễ vỡ lên xe</strong></p>
     <p>Để hoàn thành f3(), cần:</p>
     <ol><li>Xoá hết món dễ vỡ khỏi danh sách.</li><li>Chất từng món vừa xoá lên xe, đúng thứ tự xoá khỏi danh sách gốc.</li></ol>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `ItemList Inventory: (Stove, 10, 2, 0) (Lamp, 5, 1, 1) (Table, 80, 3, 0) (Sofa, 50, 2, 0) (TV, 20, 1, 1) (Chair, 7, 1, 0)\nTruck Contents: (Pot, 10, 1, 1) (Bed, 100, 2, 0)\nItemList Inventory: (Stove, 10, 2, 0) (Table, 80, 3, 0) (Sofa, 50, 2, 0) (Chair, 7, 1, 0)\nTruck Contents: (TV, 20, 1, 1) (Lamp, 5, 1, 1) (Pot, 10, 1, 1) (Bed, 100, 2, 0)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 — output matches the paper's expected example byte-for-byte. Repeatedly calls <code>deleteFirstFragile()</code> until it returns null (removing Lamp, then TV, in that list order), pushing each onto the truck as it's removed — since <code>push()</code> always inserts at the head, the LAST item removed (TV) ends up first in the truck.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 — output khớp byte-for-byte với ví dụ trong đề. Gọi lặp <code>deleteFirstFragile()</code> tới khi trả về null (xoá Lamp rồi TV, đúng thứ tự trong danh sách), push từng món lên xe ngay khi xoá — vì <code>push()</code> luôn chèn vào đầu, món xoá SAU CÙNG (TV) lại nằm đầu xe.</p>`
  ),
  rubric: [
    { id: 'remove_all_fragile', criterion: B('Correctly removes ALL fragile items from the list, none left behind.', 'Xoá đúng TOÀN BỘ món dễ vỡ khỏi danh sách, không sót món nào.'), weight: 1, maxScore: 1.5 },
    { id: 'push_order', criterion: B('Pushes each removed item onto the truck in the exact order removed.', 'Push từng món lên xe đúng thứ tự đã xoá.'), weight: 1, maxScore: 1 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>d. f4(): 2.5 marks – Compute total weight of items on the truck</strong></p>
     <p>To complete f4(), students must:</p>
     <ol><li>Remove all fragile items from the list (as f3).</li><li>Push each removed item into the truck in the same order as they appeared in the original list (as f3).</li><li>Compute and return the total weight of all items in the truck.</li></ol>`,
    `<p><strong>d. f4(): 2.5 điểm – Tính tổng trọng lượng đồ trên xe</strong></p>
     <p>Để hoàn thành f4(), cần:</p>
     <ol><li>Xoá hết món dễ vỡ khỏi danh sách (như f3).</li><li>Chất từng món vừa xoá lên xe, đúng thứ tự (như f3).</li><li>Tính và trả về tổng trọng lượng toàn bộ đồ trên xe.</li></ol>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `ItemList Inventory: (Stove, 10, 2, 0) (Lamp, 5, 1, 1) (Table, 80, 3, 0) (Sofa, 50, 2, 0) (TV, 20, 1, 1) (Chair, 7, 1, 0)\nTruck Contents: (Pot, 10, 1, 1) (Bed, 100, 2, 0)\nItemList Inventory: (Stove, 10, 2, 0) (Table, 80, 3, 0) (Sofa, 50, 2, 0) (Chair, 7, 1, 0)\nTruck Contents: (TV, 20, 1, 1) (Lamp, 5, 1, 1) (Pot, 10, 1, 1) (Bed, 100, 2, 0)\nTotal weight: 135`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 — output matches the paper's expected example byte-for-byte. Same fragile-removal-and-push logic as f3, then sums <code>getWeight()</code> over every node in the truck: 20(TV)+5(Lamp)+10(Pot)+100(Bed) = 135.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 — output khớp byte-for-byte với ví dụ trong đề. Cùng logic xoá-và-push món dễ vỡ như f3, rồi cộng <code>getWeight()</code> của mọi node trên xe: 20(TV)+5(Lamp)+10(Pot)+100(Bed) = 135.</p>`
  ),
  rubric: [
    { id: 'remove_push_again', criterion: B('Correctly repeats the remove-all-fragile-and-push-to-truck logic.', 'Lặp đúng logic xoá hết món dễ vỡ và push lên xe.'), weight: 1, maxScore: 1.5 },
    { id: 'total_weight', criterion: B('Correctly sums the weight of every item now on the truck.', 'Cộng đúng trọng lượng mọi món hiện có trên xe.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE18-D2',
    title: 'PE Đề 18 — Practical Exam (D2)|||PE Đề 18 — Thi thực hành (D2)',
    description: 'CSD201 PE (CODE): singly linked list (item inventory) + stack (truck loading), AI-graded.|||PE CSD201 (viết mã): danh sách liên kết đơn (kho đồ) + stack (chất đồ lên xe), chấm AI.',
    durationMinutes: 60,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE18-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
