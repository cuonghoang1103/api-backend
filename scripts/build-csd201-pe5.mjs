/**
 * build-csd201-pe5.mjs — sinh content/exams/CSD201-PE5.mjs.
 *
 * Nguồn thật: csd201_pe_sp26_627261.zip — MỘT project duy nhất (Q1),
 * "OceanView Resort Management System": RoomList.java (Singly Linked
 * List of Room) + CustomerBST.java (BST of Customer keyed by id).
 * 4 hàm f1-f4, 2.5 điểm mỗi hàm — theo đúng khuôn CSD201-PE1 (1 project,
 * 4 câu CODE riêng, mỗi câu 2.5đ). LỜI GIẢI ĐÃ VERIFY THẬT: javac + java
 * Main, cả 4 lựa chọn, khớp BYTE-FOR-BYTE với ví dụ minh hoạ trong đề
 * (đề này data.txt đi kèm KHỚP với minh hoạ, không như PE2-PE4).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE5.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE5.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE5-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "CSD201_PE_SP26").</p>
   <ol>
     <li>Software: NetBeans IDE 13, Java JDK 8. Download the given materials above.</li>
     <li>Your job is to <strong>complete the method bodies only</strong>. Do not change method signatures or add new import statements.</li>
     <li>Do not use accented Vietnamese when writing comments in your programs.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "CSD201_PE_SP26").</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 13, Java JDK 8. Tải given materials ở trên.</li>
     <li>Chỉ được <strong>hoàn thiện phần thân method</strong>. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Không dùng tiếng Việt có dấu khi viết chú thích trong chương trình.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const SCENARIO = B(
  `<p><strong>Scenario:</strong> You will build a Java program that manages an OceanView Resort Management System. The system relies on a Singly Linked List to manage the list of rooms in the resort and a Binary Search Tree (BST) to manage customer information, ordered by customerID.</p>
   <p><strong>Class Structure:</strong> <code>Room</code> (roomID, type, price) · <code>RoomList</code> — a Singly Linked List used to store and manage the resort's rooms · <code>Customer</code> (id, name) · <code>CustomerBST</code> — a Binary Search Tree structure used to store customers, sorted alphabetically by customerID.</p>`,
  `<p><strong>Bối cảnh:</strong> Xây dựng chương trình Java quản lý Hệ thống Quản lý Khu Nghỉ dưỡng OceanView. Hệ thống dùng Danh sách liên kết đơn quản lý danh sách phòng của khu nghỉ dưỡng, và Cây nhị phân tìm kiếm (BST) quản lý thông tin khách hàng, sắp theo customerID.</p>
   <p><strong>Cấu trúc lớp:</strong> <code>Room</code> (roomID, type, price) · <code>RoomList</code> — Danh sách liên kết đơn lưu và quản lý các phòng · <code>Customer</code> (id, name) · <code>CustomerBST</code> — Cây BST lưu khách hàng, sắp theo bảng chữ cái theo customerID.</p>`,
);

const SOLVED = '/tmp/csd201-pe5-src/src';
const ORIG = '/tmp/csd201-pe5-orig/CSD201_PE_SP26_627261/PaperNo_1/Q1/src';
const rd = (p) => fs.readFileSync(p, 'utf8');

const roomListSolved = rd(path.join(SOLVED, 'RoomList.java'));
const roomListStarter = rd(path.join(ORIG, 'RoomList.java'));
const bstSolved = rd(path.join(SOLVED, 'CustomerBST.java'));
const bstStarter = rd(path.join(ORIG, 'CustomerBST.java'));

const q1 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>1. f1() – 2.5 marks: Count Rooms in the Resort</strong></p>
     <ul><li><strong>File:</strong> RoomList.java</li><li><strong>Method to Complete:</strong> <code>count()</code></li>
     <li><strong>Task:</strong> Implement the count() method so that it traverses the singly linked list and returns the total number of rooms currently in the resort. It should return 0 if the list is empty.</li></ul>`,
    `<p><strong>1. f1() – 2.5 điểm: Đếm số phòng trong khu nghỉ dưỡng</strong></p>
     <ul><li><strong>File:</strong> RoomList.java</li><li><strong>Method cần hoàn thiện:</strong> <code>count()</code></li>
     <li><strong>Nhiệm vụ:</strong> Hoàn thiện count() để duyệt danh sách liên kết đơn, trả về tổng số phòng hiện có. Trả về 0 nếu danh sách rỗng.</li></ul>`
  ),
  starterCode: roomListStarter,
  sampleSolution: roomListSolved,
  expectedOutput: `Current Rooms:\n(R01,Deluxe,120)(R02,Standard,80)(R03,Suite,200)(R04,Deluxe,150)(R05,Standard,90)(R06,Suite,220)\nTotal rooms: 6`,
  explanation: B(
    `<p>Verified by compiling against the real given project (Main.java/Assignment.java/Lib.java unchanged) and running choice 1 — output matches the paper's expected example byte-for-byte. Traverse the singly linked list from <code>head</code> counting nodes until <code>null</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật (Main.java/Assignment.java/Lib.java giữ nguyên) và chạy lựa chọn 1 — output khớp byte-for-byte với ví dụ trong đề. Duyệt danh sách liên kết đơn từ <code>head</code>, đếm node tới khi gặp <code>null</code>.</p>`
  ),
  rubric: [
    { id: 'traverse', criterion: B('Correctly traverses the whole singly linked list without skipping or double-counting nodes.', 'Duyệt đúng toàn bộ danh sách liên kết đơn, không bỏ sót hay đếm trùng.'), weight: 1, maxScore: 2 },
    { id: 'empty', criterion: B('Returns 0 for an empty list.', 'Trả về 0 khi danh sách rỗng.'), weight: 1, maxScore: 0.5 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>2. f2() – 2.5 marks: List rooms with the price greater than comparePrice</strong></p>
     <ul><li><strong>File:</strong> RoomList.java</li><li><strong>Method to Complete:</strong> <code>printGreater(int comparePrice)</code></li>
     <li><strong>Task:</strong> Go through the room list and collect every room whose price is strictly greater than the value read from the input file, returned as a new RoomList.</li>
     <ul><li>If there is no such value, "Empty" will be printed.</li><li>The rooms must appear in the same order as in the original list.</li><li>The original list structure must not be changed.</li></ul></ul>`,
    `<p><strong>2. f2() – 2.5 điểm: Liệt kê phòng có giá lớn hơn comparePrice</strong></p>
     <ul><li><strong>File:</strong> RoomList.java</li><li><strong>Method cần hoàn thiện:</strong> <code>printGreater(int comparePrice)</code></li>
     <li><strong>Nhiệm vụ:</strong> Duyệt danh sách phòng, gom mọi phòng có giá LỚN HƠN giá trị đọc từ file input vào một RoomList mới.</li>
     <ul><li>Không có phòng nào thoả thì in "Empty".</li><li>Các phòng phải giữ đúng thứ tự như trong danh sách gốc.</li><li>Không được thay đổi cấu trúc danh sách gốc.</li></ul></ul>`
  ),
  starterCode: roomListStarter,
  sampleSolution: roomListSolved,
  expectedOutput: `Current Rooms:\n(R01,Deluxe,120)(R02,Standard,80)(R03,Suite,200)(R04,Deluxe,150)(R05,Standard,90)(R06,Suite,220)\nListing rooms with price greater than 120:\n(R03,Suite,200)(R04,Deluxe,150)(R06,Suite,220)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 — output matches the paper's expected example byte-for-byte. Traverse the original list once (without mutating it), appending each room whose <code>price &gt; comparePrice</code> to a fresh <code>RoomList</code> in encounter order; an empty result list naturally prints "Empty" via the given <code>ftraverse()</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 — output khớp byte-for-byte với ví dụ trong đề. Duyệt 1 lượt danh sách gốc (không sửa nó), thêm mỗi phòng có <code>price &gt; comparePrice</code> vào một <code>RoomList</code> mới theo đúng thứ tự gặp; danh sách kết quả rỗng tự in "Empty" qua <code>ftraverse()</code> đã cho sẵn.</p>`
  ),
  rubric: [
    { id: 'filter', criterion: B('Correctly filters rooms with price strictly greater than comparePrice, preserving original order.', 'Lọc đúng phòng có giá lớn hơn comparePrice, giữ đúng thứ tự gốc.'), weight: 1, maxScore: 1.5 },
    { id: 'no_mutate_empty', criterion: B('Does not mutate the original list; empty-result case naturally handled.', 'Không sửa danh sách gốc; trường hợp không có kết quả được xử lý tự nhiên.'), weight: 1, maxScore: 1 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>3. f3() – 2.5 marks: Insert customer into the Binary Search Tree (BST)</strong></p>
     <ul><li><strong>File:</strong> CustomerBST.java</li><li><strong>Method to Complete:</strong> <code>insert(Customer c)</code></li>
     <li><strong>Task:</strong> Implement the logic to insert a new Customer object into the Binary Search Tree. The tree has to be ordered alphabetically according to the customer's id.</li>
     <ul><li>Place the customer at the correct position following BST rules.</li><li>If a customer with the same id already exists in the tree, that customer is ignored.</li></ul></ul>`,
    `<p><strong>3. f3() – 2.5 điểm: Chèn khách hàng vào cây BST</strong></p>
     <ul><li><strong>File:</strong> CustomerBST.java</li><li><strong>Method cần hoàn thiện:</strong> <code>insert(Customer c)</code></li>
     <li><strong>Nhiệm vụ:</strong> Chèn khách hàng mới vào cây nhị phân tìm kiếm, sắp theo bảng chữ cái theo id.</li>
     <ul><li>Đặt khách hàng đúng vị trí theo luật BST.</li><li>Nếu id đã tồn tại trong cây thì bỏ qua khách hàng mới.</li></ul></ul>`
  ),
  starterCode: bstStarter,
  sampleSolution: bstSolved,
  expectedOutput: `Current Customers (Alphabetically Ordered by ID):\n(C01,John)(C02,Linda)(C03,Anna)(C04,Sophia)(C05,Mike)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 — output matches the paper's expected example byte-for-byte. Standard recursive BST insert comparing <code>c.id.compareTo(node.data.id)</code>; a duplicate id (cmp == 0) is silently ignored by not recursing further, matching the spec.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 — output khớp byte-for-byte với ví dụ trong đề. Chèn BST đệ quy chuẩn, so sánh <code>c.id.compareTo(node.data.id)</code>; id trùng (cmp == 0) tự động bị bỏ qua vì không đệ quy tiếp, đúng đặc tả.</p>`
  ),
  rubric: [
    { id: 'bst_order', criterion: B('Correctly inserts following BST ordering rules by customer id.', 'Chèn đúng theo luật thứ tự BST theo id khách hàng.'), weight: 1, maxScore: 2 },
    { id: 'dup_ignore', criterion: B('Ignores insertion of a customer whose id already exists in the tree.', 'Bỏ qua khi chèn khách hàng có id đã tồn tại trong cây.'), weight: 1, maxScore: 0.5 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>4. f4() – 2.5 marks: Count Customers with ID Greater Than a Given Value</strong></p>
     <ul><li><strong>File:</strong> CustomerBST.java</li><li><strong>Method to Complete:</strong> <code>countGreater(String id)</code></li>
     <li><strong>Task:</strong> Count how many customers in the BST have an id strictly greater than the given value. Return 0 if no customer satisfies the condition.</li></ul>`,
    `<p><strong>4. f4() – 2.5 điểm: Đếm khách hàng có ID lớn hơn giá trị cho trước</strong></p>
     <ul><li><strong>File:</strong> CustomerBST.java</li><li><strong>Method cần hoàn thiện:</strong> <code>countGreater(String id)</code></li>
     <li><strong>Nhiệm vụ:</strong> Đếm số khách hàng trong BST có id LỚN HƠN giá trị cho trước. Trả về 0 nếu không có khách hàng nào thoả.</li></ul>`
  ),
  starterCode: bstStarter,
  sampleSolution: bstSolved,
  expectedOutput: `Current Customers:\n(C01,John)(C02,Linda)(C03,Anna)(C04,Sophia)(C05,Mike)\nCounting customers with ID > C03:\nResult: 2`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 — output matches the paper's expected example byte-for-byte. Recursively visits every node (not just a BST-pruned subtree, since matches can be on either side of any node relative to string comparison) and counts each whose <code>id.compareTo(given) &gt; 0</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 — output khớp byte-for-byte với ví dụ trong đề. Duyệt đệ quy TOÀN BỘ node (không cắt tỉa theo BST vì so sánh chuỗi có thể thoả ở cả hai nhánh bất kỳ), đếm mỗi node có <code>id.compareTo(given) &gt; 0</code>.</p>`
  ),
  rubric: [
    { id: 'count_correct', criterion: B('Correctly counts all nodes with id strictly greater than the given id, visiting the whole tree.', 'Đếm đúng mọi node có id lớn hơn id cho trước, duyệt toàn bộ cây.'), weight: 1, maxScore: 2 },
    { id: 'zero_case', criterion: B('Returns 0 when no customer satisfies the condition.', 'Trả về 0 khi không có khách hàng nào thoả.'), weight: 1, maxScore: 0.5 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE5-SP26-627261',
    title: 'PE Đề 5 — Practical Exam (SP26)|||PE Đề 5 — Thi thực hành (SP26)',
    description: 'CSD201 PE (CODE): singly linked list (room list) + BST (customer directory), AI-graded.|||PE CSD201 (viết mã): danh sách liên kết đơn (danh sách phòng) + BST (danh bạ khách hàng), chấm AI.',
    durationMinutes: 60,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE5-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
