/**
 * build-csd201-pe10.mjs — sinh content/exams/CSD201-PE10.mjs.
 *
 * Nguồn thật: pe_csd201_de01_897649.zip (Đề "De01") — MỘT project (Q1),
 * "Course Registration": SllStudent (danh sách liên kết đơn, thứ tự
 * chèn) + BstStudent (BST khoá theo id), cả 2 lớp cùng nằm trong file
 * CourseRegistration.java. 4 câu f1-f4, 2.5đ mỗi câu. LỜI GIẢI ĐÃ
 * VERIFY THẬT: javac + java Main, cả 4 lựa chọn với data.txt đi kèm
 * (9 sinh viên).
 *
 * f2/f3/f4 khớp BYTE-FOR-BYTE với minh hoạ trong đề (đếm chưa đóng
 * phí=3, tìm id=7 ra đúng, danh sách đã đóng phí giảm dần theo id
 * khớp cả 6 phần tử). f1's minh hoạ trong đề dùng tập con 5/9 sinh
 * viên VÀ thêm một khối "BST (Inorder)" mà hàm f1() thật (đã cho sẵn
 * trong CourseRegistration.java, KHÔNG được sửa) không hề in ra — nó
 * chỉ gọi sList.printInsertionOrder(f), không đụng gì tới BST. Verify
 * bằng cách chạy chọn 1 thật: f1.txt chỉ có 1 dòng thứ tự chèn (đủ 9
 * sinh viên) — tin theo mã given thật hơn minh hoạ trong PDF, đúng
 * pattern đã gặp nhiều lần trong các đề CSD201 khác.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE10.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE10.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE10-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "De01").</p>
   <ol>
     <li>Software: NetBeans IDE 8.x, Java JDK 1.8. Download the given materials above.</li>
     <li>Do not add new import statement(s) to the given files.</li>
     <li>Do not use accented Vietnamese when writing comments in your programs.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "De01").</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Tải given materials ở trên.</li>
     <li>Không thêm import mới vào các file đã cho.</li>
     <li>Không dùng tiếng Việt có dấu khi viết chú thích trong chương trình.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const SCENARIO = B(
  `<p><strong>Scenario:</strong> The provided files contain statements for implementing a program that manages a Course Registration process.</p>
   <p><strong>Class Structure:</strong> <code>Student</code> (id, name, fee) · <code>SllNode</code> — a Student and a next pointer · <code>BstNode</code> — a Student and left/right pointers for the BST · <code>SllStudent</code> — a singly linked list that manages students in insertion order · <code>BstStudent</code> — a binary search tree that manages students, with id as the key · <code>CourseRegistration</code> — the main class, holding an SllStudent (insertion-order list) and a BstStudent (BST by ID).</p>`,
  `<p><strong>Bối cảnh:</strong> Các file given chứa các thành phần để hoàn thiện chương trình quản lý Đăng ký môn học (Course Registration).</p>
   <p><strong>Cấu trúc lớp:</strong> <code>Student</code> (id, name, fee) · <code>SllNode</code> — Student và con trỏ next · <code>BstNode</code> — Student và con trỏ left/right cho BST · <code>SllStudent</code> — danh sách liên kết đơn quản lý sinh viên theo thứ tự chèn · <code>BstStudent</code> — cây BST quản lý sinh viên, khoá theo id · <code>CourseRegistration</code> — lớp chính, chứa 1 SllStudent (danh sách theo thứ tự chèn) và 1 BstStudent (BST theo ID).</p>`,
);

const SOLVED = '/tmp/csd201-pe10-src/src/CourseRegistration.java';
const ORIG = '/tmp/csd201-pe10-orig/PE_CSD201_De01_897649/PaperNo_1/Q1/src/CourseRegistration.java';
const rd = (p) => fs.readFileSync(p, 'utf8');

const solved = rd(SOLVED);
const starter = rd(ORIG);

const q1 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f1(): (2.5 marks) – Load data</strong></p>
     <p>To fulfill requirement f1(), students need to:</p>
     <ol><li>Implement the <code>addStudent()</code> function in the <code>SllStudent</code> class to add students in insertion order.</li>
     <li>Implement the <code>insertStudent()</code> helper (used by <code>insert()</code>) in the <code>BstStudent</code> class to insert students into the BST by id.</li>
     <li>Implement <code>printInsertionOrder()</code> in <code>SllStudent</code> so f1.txt shows every student in the order they were added.</li></ol>`,
    `<p><strong>f1(): (2.5 điểm) – Nạp dữ liệu</strong></p>
     <p>Để hoàn thành f1(), cần:</p>
     <ol><li>Cài <code>addStudent()</code> trong lớp <code>SllStudent</code> để thêm sinh viên theo thứ tự chèn.</li>
     <li>Cài hàm hỗ trợ <code>insertStudent()</code> (được <code>insert()</code> gọi) trong lớp <code>BstStudent</code> để chèn sinh viên vào BST theo id.</li>
     <li>Cài <code>printInsertionOrder()</code> trong <code>SllStudent</code> để f1.txt in đủ sinh viên theo đúng thứ tự đã thêm.</li></ol>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `(9,V,true) (15,M,true) (5,B,false) (12,N,true) (7,A,true) (3,T,true) (18,H,false) (11,P,true) (2,D,false)`,
  explanation: B(
    `<p>Verified by compiling against the real given project (Student.java/SllNode.java/BstNode.java/Main.java/Lib.java unchanged) and running choice 1. <code>addStudent()</code> appends to <code>tail</code> (or sets both <code>head</code>/<code>tail</code> when empty); <code>printInsertionOrder()</code> walks <code>head</code> to the end printing each student. <strong>Note:</strong> the paper's own illustrative example for f1 shows a smaller 5-student subset plus an extra "BST (Inorder)" section — but the given <code>f1()</code> method (which cannot be edited) only calls <code>sList.printInsertionOrder(f)</code>, never touching the BST. Running the real given code against the real 9-student data.txt confirms f1.txt contains exactly the insertion-order line above; the given code was trusted over the paper's simplified illustration, consistent with the same pattern seen across other CSD201 PE papers this session.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật (Student.java/SllNode.java/BstNode.java/Main.java/Lib.java giữ nguyên) và chạy lựa chọn 1. <code>addStudent()</code> nối vào <code>tail</code> (hoặc gán cả <code>head</code>/<code>tail</code> nếu rỗng); <code>printInsertionOrder()</code> duyệt từ <code>head</code> tới hết, in từng sinh viên. <strong>Lưu ý:</strong> minh hoạ của chính đề cho f1 chỉ dùng tập con 5 sinh viên và thêm một khối "BST (Inorder)" — nhưng hàm <code>f1()</code> given (không được sửa) chỉ gọi <code>sList.printInsertionOrder(f)</code>, không đụng gì tới BST. Chạy mã given thật với data.txt thật (9 sinh viên) xác nhận f1.txt đúng là dòng thứ tự chèn ở trên; tin theo mã given thật hơn minh hoạ đơn giản hoá của đề, đúng pattern đã gặp ở các đề CSD201 khác trong phiên này.</p>`
  ),
  rubric: [
    { id: 'addstudent', criterion: B('addStudent() correctly appends to the tail, preserving insertion order.', 'addStudent() nối đúng vào tail, giữ đúng thứ tự chèn.'), weight: 1, maxScore: 1 },
    { id: 'insertstudent', criterion: B('insertStudent() correctly performs BST insert keyed by student id.', 'insertStudent() chèn đúng BST khoá theo id sinh viên.'), weight: 1, maxScore: 1 },
    { id: 'printorder', criterion: B('printInsertionOrder() correctly prints every student in insertion order.', 'printInsertionOrder() in đúng toàn bộ sinh viên theo thứ tự chèn.'), weight: 1, maxScore: 0.5 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f2(): (2.5 marks) – Count students who have not paid fees</strong></p>
     <p>To fulfill requirement f2(), students need to:</p>
     <ul><li>Count the students in the BST who have not paid fees (<code>fee == false</code>).</li><li>Implement the counting logic inside the <code>BstStudent.count()</code> method.</li></ul>`,
    `<p><strong>f2(): (2.5 điểm) – Đếm sinh viên chưa đóng phí</strong></p>
     <p>Để hoàn thành f2(), cần:</p>
     <ul><li>Đếm sinh viên trong BST có <code>fee == false</code>.</li><li>Cài logic đếm trong method <code>BstStudent.count()</code>.</li></ul>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `3`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 — output matches the paper's expected example byte-for-byte (3 unpaid students among the 9 in data.txt: ids 5, 18, 2). Recursive traversal visiting every node, incrementing when <code>!info.isFee()</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 — output khớp byte-for-byte với ví dụ trong đề (3 sinh viên chưa đóng phí trong số 9 sinh viên của data.txt: id 5, 18, 2). Duyệt đệ quy toàn bộ node, tăng đếm khi <code>!info.isFee()</code>.</p>`
  ),
  rubric: [
    { id: 'count_unpaid', criterion: B('Correctly counts all BST nodes with fee == false, visiting the whole tree.', 'Đếm đúng mọi node BST có fee == false, duyệt toàn bộ cây.'), weight: 1, maxScore: 2.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f3(): (2.5 marks) – Search by ID</strong></p>
     <p>To fulfill requirement f3(), students need to:</p>
     <ul><li>Implement the <code>searchById()</code> function inside the <code>BstStudent</code> structure.</li><li>Search for a student in the BST by their ID and display the result.</li></ul>
     <p>(The test case looks up ID=7, which is found, and another ID that does not exist, which is not found)</p>`,
    `<p><strong>f3(): (2.5 điểm) – Tìm theo ID</strong></p>
     <p>Để hoàn thành f3(), cần:</p>
     <ul><li>Cài <code>searchById()</code> trong <code>BstStudent</code>.</li><li>Tìm sinh viên trong BST theo ID và hiển thị kết quả.</li></ul>
     <p>(Test case tra ID=7 (có), và một ID không tồn tại (không có))</p>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `ID=7 → Found: (7,A,true)\nID not present → Not found`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 twice (id=7 and a non-existent id) — output matches the paper's expected example byte-for-byte both times. Standard recursive BST search comparing against <code>id</code>; <code>search(id)</code> simply delegates to <code>searchById(root, id)</code>.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 hai lần (id=7 và một id không tồn tại) — output khớp byte-for-byte với ví dụ trong đề cả 2 lần. Tìm kiếm BST đệ quy chuẩn so sánh với <code>id</code>; <code>search(id)</code> chỉ gọi lại <code>searchById(root, id)</code>.</p>`
  ),
  rubric: [
    { id: 'found', criterion: B('Correctly finds and reports an existing student by id.', 'Tìm và báo đúng sinh viên tồn tại theo id.'), weight: 1, maxScore: 1.5 },
    { id: 'not_found', criterion: B('Correctly reports a non-existent id as not found.', 'Báo đúng id không tồn tại là not found.'), weight: 1, maxScore: 1 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f4(): (2.5 marks) – Print students who have paid fees in descending order by ID</strong></p>
     <p>To fulfill requirement f4(), students need to:</p>
     <ul><li>Implement the <code>printPaidDesc()</code> function inside the <code>BstStudent</code> structure.</li><li>Print every student who has paid fees (<code>fee == true</code>) in descending order by ID.</li></ul>`,
    `<p><strong>f4(): (2.5 điểm) – In sinh viên đã đóng phí, giảm dần theo ID</strong></p>
     <p>Để hoàn thành f4(), cần:</p>
     <ul><li>Cài <code>printPaidDesc()</code> trong <code>BstStudent</code>.</li><li>In mọi sinh viên có <code>fee == true</code>, giảm dần theo ID.</li></ul>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `(15,M,true) (12,N,true) (11,P,true) (9,V,true) (7,A,true) (3,T,true)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 — output matches the paper's expected example byte-for-byte. Reverse in-order traversal (right, node, left): visit <code>right</code> first (largest ids first), print the node only if <code>fee == true</code>, then visit <code>left</code> — yields paid students in strictly descending id order.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 — output khớp byte-for-byte với ví dụ trong đề. Duyệt in-order đảo ngược (phải, gốc, trái): thăm <code>right</code> trước (id lớn trước), chỉ in nếu <code>fee == true</code>, rồi thăm <code>left</code> — cho ra đúng sinh viên đã đóng phí giảm dần theo id.</p>`
  ),
  rubric: [
    { id: 'desc_order', criterion: B('Correctly visits nodes in descending id order (reverse in-order).', 'Duyệt đúng thứ tự id giảm dần (in-order đảo ngược).'), weight: 1, maxScore: 1.5 },
    { id: 'paid_filter', criterion: B('Only prints students with fee == true.', 'Chỉ in sinh viên có fee == true.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE10-De01',
    title: 'PE Đề 10 — Practical Exam (De01)|||PE Đề 10 — Thi thực hành (De01)',
    description: 'CSD201 PE (CODE): singly linked list (insertion order) + BST (course registration by student ID), AI-graded.|||PE CSD201 (viết mã): danh sách liên kết đơn (thứ tự chèn) + BST (đăng ký môn học theo ID sinh viên), chấm AI.',
    durationMinutes: 60,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE10-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
