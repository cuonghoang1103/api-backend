/**
 * build-csd201-pe8.mjs — sinh content/exams/CSD201-PE8.mjs.
 *
 * Nguồn thật: given.rar (Đề "FA25 - B10W") — MỘT project (Q1),
 * "Task Management System": CompletionQueue.java (Queue/singly linked
 * list, FIFO) + TaskBST.java (BST keyed by priority). 4 hàm f1-f4,
 * 2.5 điểm mỗi hàm (khuôn giống PE1/PE5: 1 project, 4 câu riêng).
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java q1.Q1, cả 4 lựa chọn, khớp
 * BYTE-FOR-BYTE với ví dụ minh hoạ trong đề (data.txt đi kèm khớp
 * minh hoạ — đã tự tính tay BST bằng Python trước khi viết Java để
 * xác nhận trình tự insert/pre-order/remove).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE8.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE8.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE8-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "FA25 - B10W").</p>
   <ol>
     <li>Software: NetBeans IDE 13, Java JDK 8 or above. Download the given materials above.</li>
     <li>Your job is to <strong>complete the method bodies only</strong>. Do not alter method signatures or add new import statements.</li>
     <li>Avoid using accented Vietnamese when writing comments in your programs.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "FA25 - B10W").</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 13, Java JDK 8 trở lên. Tải given materials ở trên.</li>
     <li>Chỉ được <strong>hoàn thiện phần thân method</strong>. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Không dùng tiếng Việt có dấu khi viết chú thích trong chương trình.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const SCENARIO = B(
  `<p><strong>Scenario:</strong> You will complete a Java program that simulates a Task Management System. This system uses a Binary Search Tree and a Queue to manage a set of given tasks.</p>
   <p><strong>Class Structure:</strong> <code>Task</code> (taskId, description, priority) · <code>TreeNode</code> — holds a Task, a left pointer and a right pointer for the BST · <code>QueueNode</code> — holds a Task and a next pointer for the Queue · <code>TaskBST</code> — a Binary Search Tree that stores the given tasks in normal BST order based on <strong>priority</strong> · <code>CompletionQueue</code> — a Queue structure (implemented as a linked list) used to manage tasks in FIFO order.</p>`,
  `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java mô phỏng Hệ thống Quản lý Task. Hệ thống dùng Cây nhị phân tìm kiếm (BST) và Hàng đợi (Queue) để quản lý các task.</p>
   <p><strong>Cấu trúc lớp:</strong> <code>Task</code> (taskId, description, priority) · <code>TreeNode</code> — chứa Task, con trỏ trái/phải cho BST · <code>QueueNode</code> — chứa Task và con trỏ next cho Queue · <code>TaskBST</code> — cây BST lưu task theo thứ tự BST chuẩn dựa trên <strong>priority</strong> · <code>CompletionQueue</code> — cấu trúc Queue (cài bằng danh sách liên kết) quản lý task theo thứ tự FIFO.</p>`,
);

const SOLVED = '/tmp/csd201-pe8-src/src/q1';
const ORIG = '/tmp/csd201-pe8-orig/CSD201_PE_FA25_B10W_112502/PaperNo_1/Q1/src/q1';
const rd = (p) => fs.readFileSync(p, 'utf8');

const queueSolved = rd(path.join(SOLVED, 'CompletionQueue.java'));
const queueStarter = rd(path.join(ORIG, 'CompletionQueue.java'));
const bstSolved = rd(path.join(SOLVED, 'TaskBST.java'));
const bstStarter = rd(path.join(ORIG, 'TaskBST.java'));

const q1 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>1. f1() – 2.5 marks: Implement Basic Queue Operations</strong></p>
     <ul><li><strong>File:</strong> CompletionQueue.java</li><li><strong>Methods to Complete:</strong> <code>enqueue(Task task)</code>, <code>isEmpty()</code></li>
     <li><strong>Task:</strong> Implement two basic operations for a queue. <code>isEmpty()</code> must return true when the queue is empty, and <code>enqueue()</code> must add a new Task to the back (rear) of the queue.</li></ul>`,
    `<p><strong>1. f1() – 2.5 điểm: Hai phép toán cơ bản của Queue</strong></p>
     <ul><li><strong>File:</strong> CompletionQueue.java</li><li><strong>Method cần hoàn thiện:</strong> <code>enqueue(Task task)</code>, <code>isEmpty()</code></li>
     <li><strong>Nhiệm vụ:</strong> Cài đặt 2 phép toán cơ bản của queue. <code>isEmpty()</code> trả về true khi queue rỗng, <code>enqueue()</code> thêm task mới vào cuối (rear) queue.</li></ul>`
  ),
  starterCode: queueStarter,
  sampleSolution: queueSolved,
  expectedOutput: `>>> Testing f1: CompletionQueue isEmpty() and enqueue()\nIs queue empty initially? Yes\nEnqueuing two tasks...\nIs queue empty now? No\n\nFinal Queue State:\n--- Completion Queue ---\n(C01, Completed_A, P:99)\n(C02, Completed_B, P:100)`,
  explanation: B(
    `<p>Verified by compiling against the real given project (Task.java/Assignment.java/Q1.java/Lib.java unchanged) and running choice 1 — output matches the paper's expected example byte-for-byte. <code>isEmpty()</code> returns <code>front == null</code>; <code>enqueue()</code> appends a new node after <code>rear</code> (or sets both <code>front</code>/<code>rear</code> when the queue was empty).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật (Task.java/Assignment.java/Q1.java/Lib.java giữ nguyên) và chạy lựa chọn 1 — output khớp byte-for-byte với ví dụ trong đề. <code>isEmpty()</code> trả về <code>front == null</code>; <code>enqueue()</code> nối node mới sau <code>rear</code> (hoặc gán cả <code>front</code>/<code>rear</code> nếu queue đang rỗng).</p>`
  ),
  rubric: [
    { id: 'isempty', criterion: B('isEmpty() correctly reflects whether the queue has any elements.', 'isEmpty() phản ánh đúng queue có phần tử hay không.'), weight: 1, maxScore: 1 },
    { id: 'enqueue', criterion: B('enqueue() correctly appends to the rear, handling both empty and non-empty starting states.', 'enqueue() nối đúng vào rear, xử lý đúng cả trường hợp queue rỗng và không rỗng.'), weight: 1, maxScore: 1.5 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>2. f2() – 2.5 marks: Insert a Task into the Binary Search Tree</strong></p>
     <ul><li><strong>File:</strong> TaskBST.java</li><li><strong>Method to Complete:</strong> <code>insert(Task task)</code></li>
     <li><strong>Task:</strong> Write the logic to insert a new Task object into the Binary Search Tree. The tree must be ordered based on the <strong>priority</strong> of the task. If a task with the same priority already exists, the new task can be ignored. The output is printed in in-order traversal.</li></ul>`,
    `<p><strong>2. f2() – 2.5 điểm: Chèn Task vào cây BST</strong></p>
     <ul><li><strong>File:</strong> TaskBST.java</li><li><strong>Method cần hoàn thiện:</strong> <code>insert(Task task)</code></li>
     <li><strong>Nhiệm vụ:</strong> Chèn Task mới vào cây BST, sắp theo <strong>priority</strong>. Nếu priority đã tồn tại thì bỏ qua task mới. Output in theo duyệt in-order.</li></ul>`
  ),
  starterCode: bstStarter,
  sampleSolution: bstSolved,
  expectedOutput: `>>> Testing f2: Inserting tasks into BST...\n\n--- Final State ---\n--- Task BST ---\n(T05, Write_Documentation, P:4)\n(T02, Update_UI, P:5)\n(T04, Test_New_Feature, P:7)\n(T03, Fix_Login_Bug, P:8)\n(T06, Refactor_Database, P:9)\n(T01, Deploy_Server, P:10)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 — output matches the paper's expected example byte-for-byte. Standard recursive BST insert comparing <code>task.priority</code>; a duplicate priority (equal, neither branch taken) is silently ignored, matching the spec.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 — output khớp byte-for-byte với ví dụ trong đề. Chèn BST đệ quy chuẩn, so sánh <code>task.priority</code>; priority trùng (bằng nhau, không rẽ nhánh nào) tự động bị bỏ qua, đúng đặc tả.</p>`
  ),
  rubric: [
    { id: 'bst_order', criterion: B('Correctly inserts following BST ordering rules by priority.', 'Chèn đúng theo luật thứ tự BST theo priority.'), weight: 1, maxScore: 2 },
    { id: 'dup_ignore', criterion: B('Ignores insertion of a task whose priority already exists in the tree.', 'Bỏ qua khi chèn task có priority đã tồn tại trong cây.'), weight: 1, maxScore: 0.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>3. f3() – 2.5 marks: Pre-Order Traversal of the BST</strong></p>
     <ul><li><strong>File:</strong> TaskBST.java</li><li><strong>Method to Complete:</strong> <code>preOrderTraversal()</code></li>
     <li><strong>Task:</strong> Implement a method that traverses the BST in pre-order. This method should take no parameters and must return a <code>java.util.List</code> containing all the tasks from the tree. A private recursive helper method is a good approach for this task.</li></ul>`,
    `<p><strong>3. f3() – 2.5 điểm: Duyệt Pre-Order cây BST</strong></p>
     <ul><li><strong>File:</strong> TaskBST.java</li><li><strong>Method cần hoàn thiện:</strong> <code>preOrderTraversal()</code></li>
     <li><strong>Nhiệm vụ:</strong> Duyệt BST theo pre-order. Method không nhận tham số, trả về <code>java.util.List</code> chứa toàn bộ task trong cây. Nên dùng 1 hàm đệ quy hỗ trợ private.</li></ul>`
  ),
  starterCode: bstStarter,
  sampleSolution: bstSolved,
  expectedOutput: `>>> Testing f3: Traversing the BST pre-order...\n\n--- Final State ---\n--- Task BST ---\n(T03, Fix_Login_Bug, P:8)\n(T05, Write_Documentation, P:4)\n(T02, Update_UI, P:5)\n(T04, Test_New_Feature, P:7)\n(T01, Deploy_Server, P:10)\n(T06, Refactor_Database, P:9)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 — output matches the paper's expected example byte-for-byte. A private recursive helper visits <code>node</code> then <code>node.left</code> then <code>node.right</code> (root-left-right), matching the standard pre-order definition.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 — output khớp byte-for-byte với ví dụ trong đề. Hàm đệ quy hỗ trợ private thăm <code>node</code> rồi <code>node.left</code> rồi <code>node.right</code> (gốc-trái-phải), đúng định nghĩa pre-order chuẩn.</p>`
  ),
  rubric: [
    { id: 'preorder', criterion: B('Correctly implements pre-order (root, left, right) traversal returning all tasks.', 'Cài đúng duyệt pre-order (gốc, trái, phải) trả về toàn bộ task.'), weight: 1, maxScore: 2.5 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>4. f4() – 2.5 marks: Remove a Task from the BST</strong></p>
     <ul><li><strong>File:</strong> TaskBST.java</li><li><strong>Method to Complete:</strong> <code>remove(int priority)</code></li>
     <li><strong>Task:</strong> Write the logic to remove a task from the BST based on its priority. You must correctly handle all three deletion cases: a node with no children, one child, or two children. You may use as many helper functions as you want.</li></ul>`,
    `<p><strong>4. f4() – 2.5 điểm: Xoá Task khỏi cây BST</strong></p>
     <ul><li><strong>File:</strong> TaskBST.java</li><li><strong>Method cần hoàn thiện:</strong> <code>remove(int priority)</code></li>
     <li><strong>Nhiệm vụ:</strong> Xoá task khỏi BST theo priority. Phải xử lý đúng cả 3 trường hợp: node không con, 1 con, 2 con. Được dùng bao nhiêu hàm hỗ trợ tuỳ ý.</li></ul>`
  ),
  starterCode: bstStarter,
  sampleSolution: bstSolved,
  expectedOutput: `--- Initial State ---\n--- Task BST ---\n(T05, Write_Documentation, P:4)\n(T02, Update_UI, P:5)\n(T04, Test_New_Feature, P:7)\n(T03, Fix_Login_Bug, P:8)\n(T06, Refactor_Database, P:9)\n(T01, Deploy_Server, P:10)\n\n>>> Testing f4: Removing task with priority 4...\n\n--- Final State ---\n--- Task BST ---\n(T02, Update_UI, P:5)\n(T04, Test_New_Feature, P:7)\n(T03, Fix_Login_Bug, P:8)\n(T06, Refactor_Database, P:9)\n(T01, Deploy_Server, P:10)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 — output matches the paper's expected example byte-for-byte. Standard recursive BST delete: 0-child returns null, 1-child returns the surviving child, 2-children deletes by copying the in-order predecessor's data into the node then recursively deleting the predecessor. Independently hand-traced the resulting tree shape in Python before writing Java to confirm the expected in-order dump.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 — output khớp byte-for-byte với ví dụ trong đề. Xoá BST đệ quy chuẩn: 0 con trả về null, 1 con trả về con còn lại, 2 con dùng kỹ thuật xoá-bằng-copy (chép dữ liệu của phần tử liền trước theo in-order vào node rồi đệ quy xoá phần tử đó). Đã tự tính tay hình dạng cây bằng Python trước khi viết Java để xác nhận kết quả in-order mong đợi.</p>`
  ),
  rubric: [
    { id: 'zero_one_child', criterion: B('Correctly handles removal of a node with zero or one child.', 'Xử lý đúng xoá node 0 hoặc 1 con.'), weight: 1, maxScore: 1.5 },
    { id: 'two_children', criterion: B('Correctly handles removal of a node with two children (predecessor or successor copy technique), preserving valid BST order.', 'Xử lý đúng xoá node 2 con (kỹ thuật copy phần tử liền trước/sau), giữ đúng thứ tự BST.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE8-FA25B10W',
    title: 'PE Đề 8 — Practical Exam (FA25 - B10W)|||PE Đề 8 — Thi thực hành (FA25 - B10W)',
    description: 'CSD201 PE (CODE): BST (insert/pre-order/remove keyed by priority) + Queue (FIFO task completion), AI-graded.|||PE CSD201 (viết mã): BST (chèn/duyệt pre-order/xoá theo priority) + Queue (hoàn thành task FIFO), chấm AI.',
    durationMinutes: 60,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE8-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
