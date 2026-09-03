/**
 * build-csd201-pe15.mjs — sinh content/exams/CSD201-PE15.mjs.
 *
 * Nguồn thật: q1a.zip (Đề "HCM - BST - 01") — MỘT project (Q1A),
 * "Student and Scholarship Management System": StudentBST (BST khoá
 * theo ký tự thứ 4 của id) + ScholarshipList (danh sách liên kết đơn).
 * 4 câu 2.5đ mỗi câu.
 *
 * ⚠️ File given.zip tải về ĐÃ SẴN phần lớn method (insert/addLast/
 * findHighestGPA/countByGPA/updateStudentBalance) — CHỈ removeById()
 * còn để trống/sai (luôn xoá head bất kể id truyền vào, luôn trả về
 * null). Giữ nguyên các hàm đã có sẵn trong starterCode/sampleSolution
 * (trung thực với given materials thật tải về), chỉ sửa removeById()
 * thành cài đặt tổng quát đúng (tìm-và-gỡ theo id ở BẤT KỲ đâu trong
 * danh sách, không chỉ head — vì lời gọi thật trong f4() luôn tình cờ
 * xoá đúng head nên bản gốc "head=head.next" vẫn qua được test này,
 * nhưng không phải cài đặt removeById(id) tổng quát đúng theo yêu cầu
 * đề "remove a student from the scholarship list by ID").
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main, cả 4 lựa chọn với
 * data.txt đi kèm — khớp BYTE-FOR-BYTE 100% với ví dụ minh hoạ trong
 * đề (đề này data.txt đi kèm KHỚP hoàn toàn với minh hoạ).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE15.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE15.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE15-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "HCM - BST - 01").</p>
   <ol>
     <li>Software: NetBeans IDE 8.x, Java JDK 1.8. Download the given materials above.</li>
     <li>Do not add any new import statements to the provided files.</li>
     <li>Do not use Vietnamese with diacritics when writing comments in the program.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "HCM - BST - 01").</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Tải given materials ở trên.</li>
     <li>Không thêm import mới vào các file đã cho.</li>
     <li>Không dùng tiếng Việt có dấu khi viết chú thích trong chương trình.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const SCENARIO = B(
  `<p><strong>Scenario: Student and Scholarship Management System.</strong></p>
   <p><strong>Class Structure:</strong> <code>Student</code> (id, name, gpa, major, balance) · <code>TreeNode</code> — a Student plus left/right pointers for the BST · <code>ListNode</code> — a Student plus a next pointer · <code>StudentBST</code> — a binary search tree that manages all students in the system · <code>ScholarshipList</code> — a linked list that manages scholarship recipients · <code>StudentManager</code> — the main class, holding a StudentBST (all students) and a ScholarshipList (scholarship recipients). When a student belongs to the scholarship list, the scholarship amount is stored in the <code>balance</code> field of that Student object.</p>`,
  `<p><strong>Bối cảnh: Hệ thống quản lý Sinh viên và Học bổng.</strong></p>
   <p><strong>Cấu trúc lớp:</strong> <code>Student</code> (id, name, gpa, major, balance) · <code>TreeNode</code> — Student và con trỏ left/right cho BST · <code>ListNode</code> — Student và con trỏ next · <code>StudentBST</code> — cây BST quản lý toàn bộ sinh viên trong hệ thống · <code>ScholarshipList</code> — danh sách liên kết quản lý sinh viên nhận học bổng · <code>StudentManager</code> — lớp chính, chứa 1 StudentBST (toàn bộ sinh viên) và 1 ScholarshipList (sinh viên nhận học bổng). Khi 1 sinh viên thuộc danh sách học bổng, số tiền học bổng lưu ở field <code>balance</code> của Student đó.</p>`,
);

const SOLVED = '/tmp/csd201-pe15-src/src/StudentManager.java';
const ORIG = '/tmp/csd201-pe15-orig/Q1A/Q1A/src/StudentManager.java';
const rd = (p) => fs.readFileSync(p, 'utf8');
const solved = rd(SOLVED);
const starter = rd(ORIG);

const q1 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f1(): (2.5 points)</strong></p>
     <p>To finish the f1 requirement, students need to perform two specific tasks:</p>
     <ul><li>Implement the <code>insert()</code> function in the StudentBST structure - insert a new student into the BST (the tree is keyed by the 4th character of the student id, i.e. the digit).</li>
     <li>Implement the <code>addLast()</code> function in the ScholarshipList structure - add a student to the end of the scholarship list.</li></ul>
     <p>Note: the scholarship list is initialized with sample students from the data.txt file.</p>`,
    `<p><strong>f1(): (2.5 điểm)</strong></p>
     <p>Để hoàn thành f1, cần 2 việc:</p>
     <ul><li>Cài <code>insert()</code> trong StudentBST — chèn sinh viên mới vào BST (cây khoá theo ký tự thứ 4 của id, tức chữ số).</li>
     <li>Cài <code>addLast()</code> trong ScholarshipList — thêm sinh viên vào cuối danh sách học bổng.</li></ul>
     <p>Lưu ý: danh sách học bổng khởi tạo sẵn từ dữ liệu mẫu trong data.txt.</p>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `Student BST (Inorder Traversal):\n(S001,John,3.8,CS,100.0) (S002,Mary,3.5,Business,150.0) (S003,David,3.9,CS,200.0) (S004,Sarah,3.2,IT,120.0) (S005,Michael,3.7,Engineering,180.0)\n\nScholarship List:\n(S003,David,3.9,CS,500.0) (S001,John,3.8,CS,600.0) (S005,Michael,3.7,Engineering,450.0)`,
  explanation: B(
    `<p>Verified by compiling against the real given project (Student.java/TreeNode.java/ListNode.java/Main.java/Lib.java unchanged) and running choice 1 — output matches the paper's expected example byte-for-byte. <code>insert()</code> creates the Student and BST-inserts it keyed by <code>id.charAt(3)</code> (already provided via the given <code>insertHelper</code> recursive comparator); <code>addLast()</code> appends to the tail of the singly linked scholarship list.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật (Student.java/TreeNode.java/ListNode.java/Main.java/Lib.java giữ nguyên) và chạy lựa chọn 1 — output khớp byte-for-byte với ví dụ trong đề. <code>insert()</code> tạo Student rồi chèn vào BST khoá theo <code>id.charAt(3)</code> (dùng bộ so sánh đệ quy <code>insertHelper</code> đã cho sẵn); <code>addLast()</code> nối vào cuối danh sách liên kết đơn học bổng.</p>`
  ),
  rubric: [
    { id: 'insert', criterion: B('insert() correctly builds a BST keyed by the 4th character of the id.', 'insert() dựng đúng BST khoá theo ký tự thứ 4 của id.'), weight: 1, maxScore: 1.5 },
    { id: 'addlast', criterion: B('addLast() correctly appends to the end of the scholarship list.', 'addLast() nối đúng vào cuối danh sách học bổng.'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f2(): (2.5 points)</strong></p>
     <p>To complete the f2 requirement, students need to:</p>
     <ul><li>Implement the <code>findHighestGPA()</code> function in the StudentBST structure to find the student with the highest GPA.</li><li>Print this student's information.</li></ul>`,
    `<p><strong>f2(): (2.5 điểm)</strong></p>
     <p>Để hoàn thành f2, cần:</p>
     <ul><li>Cài <code>findHighestGPA()</code> trong StudentBST — tìm sinh viên có GPA cao nhất.</li><li>In thông tin sinh viên đó.</li></ul>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `Student BST (Inorder Traversal):\n(S001,John,3.8,CS,100.0) (S002,Mary,3.5,Business,150.0) (S003,David,3.9,CS,200.0) (S004,Sarah,3.2,IT,120.0) (S005,Michael,3.7,Engineering,180.0)\n\nScholarship List:\n(S003,David,3.9,CS,500.0) (S001,John,3.8,CS,600.0) (S005,Michael,3.7,Engineering,450.0)\n\nStudent with highest GPA: (S003,David,3.9,CS,200.0)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 — output matches the paper's expected example byte-for-byte. <code>findHighestGPA()</code> delegates to the given recursive <code>maxGPA()</code> helper, which visits every node and keeps the Student with the highest <code>gpa</code> (David, 3.9).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 — output khớp byte-for-byte với ví dụ trong đề. <code>findHighestGPA()</code> gọi hàm đệ quy hỗ trợ <code>maxGPA()</code> đã cho, duyệt toàn bộ node giữ lại Student có <code>gpa</code> cao nhất (David, 3.9).</p>`
  ),
  rubric: [
    { id: 'highest_gpa', criterion: B('Correctly finds and returns the student with the highest GPA across the whole tree.', 'Tìm và trả đúng sinh viên có GPA cao nhất trong toàn cây.'), weight: 1, maxScore: 2.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f3(): (2.5 points)</strong></p>
     <p>To complete f3, students need to:</p>
     <ul><li>Count and display the number of students whose GPA is greater than or equal to 3.5.</li><li>Implement the <code>countByGPA()</code> method in the StudentBST structure.</li></ul>
     <p>The expected output consists of only a single number (the count of students with GPA &gt;= 3.5).</p>`,
    `<p><strong>f3(): (2.5 điểm)</strong></p>
     <p>Để hoàn thành f3, cần:</p>
     <ul><li>Đếm và hiển thị số sinh viên có GPA &gt;= 3.5.</li><li>Cài <code>countByGPA()</code> trong StudentBST.</li></ul>
     <p>Output chỉ gồm 1 con số duy nhất (số sinh viên GPA &gt;= 3.5).</p>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `4`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 — output matches the paper's expected example byte-for-byte (4 students with gpa &gt;= 3.5 among the 5: John 3.8, Mary 3.5, David 3.9, Michael 3.7 qualify; Sarah 3.2 does not). Delegates to the given recursive <code>count(root, threshold)</code> helper.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 — output khớp byte-for-byte với ví dụ trong đề (4 sinh viên GPA &gt;= 3.5 trong 5 người: John 3.8, Mary 3.5, David 3.9, Michael 3.7 thoả; Sarah 3.2 không). Gọi hàm đệ quy hỗ trợ <code>count(root, threshold)</code> đã cho.</p>`
  ),
  rubric: [
    { id: 'count_gpa', criterion: B('Correctly counts all students in the tree with gpa >= 3.5.', 'Đếm đúng mọi sinh viên trong cây có gpa >= 3.5.'), weight: 1, maxScore: 2.5 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>f4(): (2.5 points)</strong></p>
     <p>To finish f4, students need to:</p>
     <ul><li>Implement the <code>removeById()</code> function in the ScholarshipList structure to remove a student from the scholarship list by ID.</li>
     <li>Implement the <code>updateStudentBalance()</code> function in the StudentBST structure to update the amount in the student's account.</li>
     <li>Process scholarships: remove students from the scholarship list and add the scholarship amount to the student's account in the BST.</li></ul>`,
    `<p><strong>f4(): (2.5 điểm)</strong></p>
     <p>Để hoàn thành f4, cần:</p>
     <ul><li>Cài <code>removeById()</code> trong ScholarshipList — xoá sinh viên khỏi danh sách học bổng theo ID.</li>
     <li>Cài <code>updateStudentBalance()</code> trong StudentBST — cập nhật số dư tài khoản sinh viên.</li>
     <li>Xử lý học bổng: xoá sinh viên khỏi danh sách học bổng và cộng số tiền học bổng vào tài khoản sinh viên trong BST.</li></ul>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `Before:\nStudent BST (Inorder Traversal):\n(S001,John,3.8,CS,100.0) (S002,Mary,3.5,Business,150.0) (S003,David,3.9,CS,200.0) (S004,Sarah,3.2,IT,120.0) (S005,Michael,3.7,Engineering,180.0)\nScholarship List:\n(S003,David,3.9,CS,500.0) (S001,John,3.8,CS,600.0) (S005,Michael,3.7,Engineering,450.0)\nAfter:\nStudent BST (Inorder Traversal):\n(S001,John,3.8,CS,700.0) (S002,Mary,3.5,Business,150.0) (S003,David,3.9,CS,700.0) (S004,Sarah,3.2,IT,120.0) (S005,Michael,3.7,Engineering,630.0)\nScholarship List:\nEmpty`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 — output matches the paper's expected example byte-for-byte. <strong>Note:</strong> the downloaded given.zip already ships a working <code>updateStudentBalance()</code>, and a <code>removeById()</code> stub that unconditionally does <code>head = head.next</code> and returns null regardless of the <code>id</code> argument — this happens to pass THIS specific example only because <code>f4()</code>'s loop always removes whichever student is currently at <code>head</code> (by construction, using that node's own id), so a naive "remove the head" coincidentally matches. It is not a correct general <code>removeById(id)</code> as the exam explicitly requires ("remove a student from the scholarship list by ID"), so it was replaced with a proper search-and-unlink implementation that finds the matching id anywhere in the list (head or interior), which produces the identical verified output here and is also correct for arbitrary grading test cases that may not always target the head.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 — output khớp byte-for-byte với ví dụ trong đề. <strong>Lưu ý:</strong> given.zip tải về đã có sẵn <code>updateStudentBalance()</code> hoạt động đúng, và một bản <code>removeById()</code> luôn làm <code>head = head.next</code> và trả về null bất kể tham số <code>id</code> — bản này chỉ QUA được đúng ví dụ này vì vòng lặp trong <code>f4()</code> luôn xoá đúng sinh viên đang ở <code>head</code> (dùng chính id của node đó), nên "xoá head" trùng hợp khớp. Đây KHÔNG phải cài đặt <code>removeById(id)</code> tổng quát đúng như đề yêu cầu ("xoá sinh viên khỏi danh sách học bổng theo ID"), nên đã thay bằng cài đặt tìm-và-gỡ đúng, tìm id khớp ở bất kỳ đâu trong danh sách (head hay giữa), cho ra đúng output đã verify ở đây và cũng đúng với các test chấm thật có thể không luôn nhắm vào head.</p>`
  ),
  rubric: [
    { id: 'remove_by_id', criterion: B('removeById() correctly finds and unlinks the matching id anywhere in the list, not only at the head.', 'removeById() tìm và gỡ đúng id khớp ở bất kỳ đâu trong danh sách, không chỉ ở head.'), weight: 1, maxScore: 1.5 },
    { id: 'update_balance', criterion: B('updateStudentBalance() correctly adds the scholarship amount to the matching student\'s balance in the BST.', 'updateStudentBalance() cộng đúng số tiền học bổng vào balance của sinh viên khớp trong BST.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE15-HCMBST01',
    title: 'PE Đề 15 — Practical Exam (HCM - BST - 01)|||PE Đề 15 — Thi thực hành (HCM - BST - 01)',
    description: 'CSD201 PE (CODE): BST (student registry, GPA queries) + linked list (scholarship processing), AI-graded.|||PE CSD201 (viết mã): BST (danh bạ sinh viên, truy vấn GPA) + danh sách liên kết (xử lý học bổng), chấm AI.',
    durationMinutes: 60,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE15-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
