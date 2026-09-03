/**
 * build-csd201-pe11.mjs — sinh content/exams/CSD201-PE11.mjs.
 *
 * Nguồn thật: pe_csd201_de02_568365.rar (Đề "SU25 - De02") — MỘT
 * project (Q1), "Computer Store": ActionLogStack.java (stack LIFO,
 * cài bằng linked list) + OrderBST.java (BST khoá theo orderID, so
 * sánh chuỗi). Trọng số KHÔNG đều: f1=3đ, f2=2đ, f3=2đ, f4=3đ (khác
 * PE1/PE5/PE8 vốn 2.5 đều — lấy đúng theo đề thật).
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main, cả 4 lựa chọn với
 * data.txt đi kèm — khớp BYTE-FOR-BYTE 100% với ví dụ minh hoạ trong
 * đề (đề này data.txt đi kèm KHỚP hoàn toàn với minh hoạ, không lệch
 * như PE2/PE4). Đã tự dựng tay cây BST bằng thứ tự chèn thật
 * (Order6,Order2,Order4,Order1,Order3,Order0,Order9) trước khi viết
 * Java để xác nhận in-order/findMin/remove khớp minh hoạ.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE11.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE11.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE11-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "SU25 - De02").</p>
   <ol>
     <li>Software: NetBeans IDE 13, Java JDK 1.8. Download the given materials above.</li>
     <li>Do not add new import statement(s) to the given files.</li>
     <li>Do not use accented Vietnamese characters when writing comments in programs.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "SU25 - De02").</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 13, Java JDK 1.8. Tải given materials ở trên.</li>
     <li>Không thêm import mới vào các file đã cho.</li>
     <li>Không dùng tiếng Việt có dấu khi viết chú thích trong chương trình.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const SCENARIO = B(
  `<p><strong>Scenario:</strong> The provided files already contain the statements needed to implement a program that manages a Computer Store.</p>
   <p><strong>Class Structure:</strong> <code>Order</code> (orderID, customerName, totalPrice) · <code>TreeNode</code> — an Order plus left/right pointers · <code>OrderBST</code> — a Binary Search Tree used to store, search and sort order data alphabetically (ascending order, inOrder traversal) · <code>StoreAction</code> (actionID, actionType) · <code>ActionNode</code> — a StoreAction plus a next pointer · <code>ActionLogStack</code> — a stack (implemented as a linked list) whose nodes manage all items in LIFO (Last In – First Out) order · <code>ComputerStore</code> — the main class, holding an ActionLogStack (working history) and an OrderBST (order information).</p>`,
  `<p><strong>Bối cảnh:</strong> Các file given đã có sẵn các thành phần để hoàn thiện chương trình quản lý Cửa hàng Máy tính (Computer Store).</p>
   <p><strong>Cấu trúc lớp:</strong> <code>Order</code> (orderID, customerName, totalPrice) · <code>TreeNode</code> — Order và con trỏ left/right · <code>OrderBST</code> — cây BST lưu/tìm/sắp dữ liệu order theo bảng chữ cái (tăng dần, duyệt inOrder) · <code>StoreAction</code> (actionID, actionType) · <code>ActionNode</code> — StoreAction và con trỏ next · <code>ActionLogStack</code> — stack (cài bằng danh sách liên kết) quản lý mọi mục theo LIFO (vào sau ra trước) · <code>ComputerStore</code> — lớp chính, chứa 1 ActionLogStack (lịch sử thao tác) và 1 OrderBST (thông tin đơn hàng).</p>`,
);

const SOLVED = '/tmp/csd201-pe11-src/src';
const ORIG = '/tmp/csd201-pe11-orig/PE_CSD201_De02_568365/PaperNo_1/Q1/src';
const rd = (p) => fs.readFileSync(p, 'utf8');

const stackSolved = rd(path.join(SOLVED, 'ActionLogStack.java'));
const stackStarter = rd(path.join(ORIG, 'ActionLogStack.java'));
const bstSolved = rd(path.join(SOLVED, 'OrderBST.java'));
const bstStarter = rd(path.join(ORIG, 'OrderBST.java'));

const q1 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f1(): 3 marks – Load data</strong></p>
     <p>To complete f1(), students need to implement two specific tasks:</p>
     <ol><li>Implement the method <code>push()</code> in <code>ActionLogStack</code>. <code>push()</code> follows the principle of Stacks.</li>
     <li>Implement the method <code>insert()</code> in <code>OrderBST</code>. <code>insert()</code> follows these rules: orders are inserted based on their orderID (alphabetical comparison); if an order is added with an existing ID, overwrite it with the new order.</li></ol>`,
    `<p><strong>f1(): 3 điểm – Nạp dữ liệu</strong></p>
     <p>Để hoàn thành f1(), cần 2 việc:</p>
     <ol><li>Cài <code>push()</code> trong <code>ActionLogStack</code>, theo đúng nguyên tắc Stack.</li>
     <li>Cài <code>insert()</code> trong <code>OrderBST</code>: chèn theo orderID (so sánh chuỗi); nếu orderID đã tồn tại thì ghi đè bằng order mới.</li></ol>`
  ),
  starterCode: stackStarter + '\n\n// ==================== OrderBST.java ====================\n\n' + bstStarter,
  sampleSolution: stackSolved + '\n\n// ==================== OrderBST.java ====================\n\n' + bstSolved,
  expectedOutput: `Action Log Stack: (Action7,Modified) (Action6,Placed) (Action5,Returned) (Action4,Canceled) (Action3,Shipped) (Action2,Updated) (Action1,Placed)\nOrder BST: (Order0,F,2500.0) (Order1,D,3000.0) (Order2,B,200.0) (Order3,E,150.0) (Order4,C,500.0) (Order6,A,1000.0) (Order9,G,800.0)`,
  explanation: B(
    `<p>Verified by compiling against the real given project (Order.java/TreeNode.java/StoreAction.java/ActionNode.java/ComputerStore.java/Main.java/Lib.java unchanged) and running choice 1 — output matches the paper's expected example byte-for-byte. <code>push()</code> pushes to the front (<code>top = new ActionNode(sa, top)</code>) so the last-loaded action (Action7) ends up on top. <code>insert()</code> is standard recursive BST insert comparing <code>order.getID()</code>; an equal-ID match overwrites <code>root.info</code> instead of recursing, per the overwrite rule. Independently hand-traced the resulting BST shape (insertion order Order6,Order2,Order4,Order1,Order3,Order0,Order9) before writing Java, confirming in-order = Order0..Order9 ascending.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật (Order.java/TreeNode.java/StoreAction.java/ActionNode.java/ComputerStore.java/Main.java/Lib.java giữ nguyên) và chạy lựa chọn 1 — output khớp byte-for-byte với ví dụ trong đề. <code>push()</code> chèn vào đầu (<code>top = new ActionNode(sa, top)</code>) nên action nạp cuối cùng (Action7) lên đỉnh. <code>insert()</code> là BST đệ quy chuẩn so sánh <code>order.getID()</code>; trùng ID thì ghi đè <code>root.info</code> thay vì đệ quy tiếp, đúng luật overwrite. Đã tự dựng tay hình dạng cây BST (thứ tự chèn Order6,Order2,Order4,Order1,Order3,Order0,Order9) trước khi viết Java, xác nhận in-order = Order0..Order9 tăng dần.</p>`
  ),
  rubric: [
    { id: 'push', criterion: B('push() correctly pushes to the top following LIFO order.', 'push() chèn đúng vào đỉnh theo LIFO.'), weight: 1, maxScore: 1.5 },
    { id: 'insert', criterion: B('insert() correctly inserts by alphabetical orderID and overwrites on a duplicate ID.', 'insert() chèn đúng theo orderID bảng chữ cái và ghi đè khi trùng ID.'), weight: 1, maxScore: 1.5 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f2(): 2 marks – Search Order by ID</strong></p>
     <p>To complete f2(), students need to implement the <code>search()</code> method in <code>OrderBST</code>. This method will:</p>
     <ul><li>Return the Order object if found.</li><li>Return null if not found.</li></ul>`,
    `<p><strong>f2(): 2 điểm – Tìm Order theo ID</strong></p>
     <p>Cần cài <code>search()</code> trong <code>OrderBST</code>:</p>
     <ul><li>Trả về Order nếu tìm thấy.</li><li>Trả về null nếu không.</li></ul>`
  ),
  starterCode: bstStarter,
  sampleSolution: bstSolved,
  expectedOutput: `Case found (searching Order4): Found Order: (Order4,C,500.0)\nCase not found (searching Order7): Order not found in BST`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 with both a found ID (Order4) and a not-found ID (Order7) — output matches the paper's expected example byte-for-byte in both cases. Standard recursive BST search comparing <code>id.compareTo(root.info.getID())</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 với cả ID tìm thấy (Order4) và ID không tồn tại (Order7) — output khớp byte-for-byte với ví dụ trong đề ở cả 2 trường hợp. Tìm kiếm BST đệ quy chuẩn so sánh <code>id.compareTo(root.info.getID())</code>.</p>`
  ),
  rubric: [
    { id: 'found', criterion: B('Correctly finds and returns an existing order by id.', 'Tìm và trả đúng order tồn tại theo id.'), weight: 1, maxScore: 1 },
    { id: 'not_found', criterion: B('Correctly returns null for a non-existent id.', 'Trả về null đúng khi id không tồn tại.'), weight: 1, maxScore: 1 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f3(): 2 marks – Find Minimum Order ID</strong></p>
     <p>To complete f3(), students need to implement the <code>findMin()</code> method in <code>OrderBST</code>. This method will print out the Order with the lowest "alphabetical" orderID, which is the first order in the inOrder traversal.</p>`,
    `<p><strong>f3(): 2 điểm – Tìm Order ID nhỏ nhất</strong></p>
     <p>Cần cài <code>findMin()</code> trong <code>OrderBST</code>: in ra Order có orderID nhỏ nhất theo bảng chữ cái, chính là order đầu tiên khi duyệt inOrder.</p>`
  ),
  starterCode: bstStarter,
  sampleSolution: bstSolved,
  expectedOutput: `Lowest Alphabetical Order ID in BST: (Order0,F,2500.0)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 — output matches the paper's expected example byte-for-byte. Walks left from <code>root</code> until <code>left == null</code>, returning that leftmost node's Order.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 — output khớp byte-for-byte với ví dụ trong đề. Đi trái từ <code>root</code> tới khi <code>left == null</code>, trả về Order của node ngoài cùng bên trái đó.</p>`
  ),
  rubric: [
    { id: 'findmin', criterion: B('Correctly finds the leftmost (alphabetically smallest) node in the BST.', 'Tìm đúng node ngoài cùng bên trái (nhỏ nhất theo bảng chữ cái) trong BST.'), weight: 1, maxScore: 2 },
  ],
};

const q4 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f4(): 3 marks – Pop Action and Remove Order</strong></p>
     <p>To complete f4(), students need to be able to perform the following methods:</p>
     <ul><li>The <code>pop()</code> method in <code>ActionLogStack</code> is used to pop the top action in ActionLogStack, then use the actionID from the popped StoreAction to identify the order to remove (via the actionID field).</li>
     <li>The <code>remove()</code> method in <code>OrderBST</code> will remove the Order in orderTree with the given orderID.</li>
     <li>The <code>remove()</code> method in <code>ActionLogStack</code> will remove the Action in the stack with the given actionID.</li></ul>
     <p>Example: popped Action7 (Modified); attempting to remove Order ID Order3 from BST; attempting to remove Action ID Action4 from Stack.</p>`,
    `<p><strong>f4(): 3 điểm – Pop Action và Xoá Order</strong></p>
     <p>Cần thực hiện:</p>
     <ul><li><code>pop()</code> trong <code>ActionLogStack</code>: pop action ở đỉnh.</li>
     <li><code>remove()</code> trong <code>OrderBST</code>: xoá Order theo orderID cho trước.</li>
     <li><code>remove()</code> trong <code>ActionLogStack</code>: xoá Action theo actionID cho trước (có thể ở giữa stack, không chỉ đỉnh).</li></ul>
     <p>Ví dụ: pop được Action7 (Modified); xoá Order3 khỏi BST; xoá Action4 khỏi Stack.</p>`
  ),
  starterCode: stackStarter + '\n\n// ==================== OrderBST.java ====================\n\n' + bstStarter,
  sampleSolution: stackSolved + '\n\n// ==================== OrderBST.java ====================\n\n' + bstSolved,
  expectedOutput: `Before:\nAction Log Stack: (Action7,Modified) (Action6,Placed) (Action5,Returned) (Action4,Canceled) (Action3,Shipped) (Action2,Updated) (Action1,Placed)\nOrder BST: (Order0,F,2500.0) (Order1,D,3000.0) (Order2,B,200.0) (Order3,E,150.0) (Order4,C,500.0) (Order6,A,1000.0) (Order9,G,800.0)\nAfter:\nAction Log Stack: (Action6,Placed) (Action5,Returned) (Action3,Shipped) (Action2,Updated) (Action1,Placed)\nOrder BST: (Order0,F,2500.0) (Order1,D,3000.0) (Order2,B,200.0) (Order4,C,500.0) (Order6,A,1000.0) (Order9,G,800.0)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 — output matches the paper's expected example byte-for-byte. <code>pop()</code> removes and returns the top node. <code>OrderBST.remove()</code> is standard recursive BST delete (0/1/2-children, delete-by-copying the in-order predecessor for the 2-children case) — here Order3 is a leaf, so it's simply unlinked. <code>ActionLogStack.remove(id)</code> walks the linked list tracking a <code>prev</code> pointer to unlink a match anywhere in the stack (not just the top), needed here since Action4 sits in the middle after Action7 was already popped.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 — output khớp byte-for-byte với ví dụ trong đề. <code>pop()</code> xoá và trả về node đỉnh. <code>OrderBST.remove()</code> là xoá BST đệ quy chuẩn (0/1/2 con, 2 con dùng kỹ thuật xoá-bằng-copy phần tử liền trước theo in-order) — ở đây Order3 là node lá nên chỉ cần gỡ liên kết. <code>ActionLogStack.remove(id)</code> duyệt danh sách liên kết giữ con trỏ <code>prev</code> để gỡ đúng phần tử khớp ở BẤT KỲ đâu trong stack (không chỉ đỉnh), cần thiết vì Action4 nằm giữa stack sau khi Action7 đã bị pop.</p>`
  ),
  rubric: [
    { id: 'pop', criterion: B('pop() correctly removes and returns the top action.', 'pop() xoá và trả đúng action ở đỉnh.'), weight: 1, maxScore: 1 },
    { id: 'bst_remove', criterion: B('OrderBST.remove() correctly removes the order by id, handling all 3 deletion cases.', 'OrderBST.remove() xoá đúng order theo id, xử lý đủ 3 trường hợp xoá.'), weight: 1, maxScore: 1 },
    { id: 'stack_remove', criterion: B('ActionLogStack.remove() correctly removes a match anywhere in the stack, not just the top.', 'ActionLogStack.remove() xoá đúng phần tử khớp ở bất kỳ đâu trong stack, không chỉ đỉnh.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE11-SU25De02',
    title: 'PE Đề 11 — Practical Exam (SU25 - De02)|||PE Đề 11 — Thi thực hành (SU25 - De02)',
    description: 'CSD201 PE (CODE): stack (LIFO action log) + BST (order registry by ID), AI-graded.|||PE CSD201 (viết mã): stack (nhật ký thao tác LIFO) + BST (danh mục đơn hàng theo ID), chấm AI.',
    durationMinutes: 60,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE11-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
