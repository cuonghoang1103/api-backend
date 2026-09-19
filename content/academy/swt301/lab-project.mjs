/**
 * SWT301 · Lab 2.5 — Project + Tool: find defects and write the report.
 *
 * Bài Lab cuối Chương 2, bắc cầu sang Chương 3 (static testing) và Lab 1.
 * Sinh viên chọn MỘT project thật + MỘT công cụ, tìm 3 defect mỗi người,
 * sửa và viết báo cáo theo form giảng viên giao trên lớp.
 *
 * Project mẫu đi kèm: Library Management System (Spring Boot 3.4 + React 18),
 * kho công khai cuonghoang1103/Library-Management-System — trang giới thiệu ở
 * /projects/library-management-system.
 *
 * Mọi con số trong bài (112 test, 60 → 0 error, coverage 57%, JaCoCo 0.8.11
 * không đọc được class file major version 69, ByteBuddy 1.15.10 chỉ hỗ trợ tới
 * Java 24) đều lấy từ một lần chạy thật `mvn test` trên chính kho đó, không phải
 * số minh hoạ.
 *
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SWT301.mjs --apply
 */
import { bi } from './_slides.mjs';

const GH = 'https://github.com/cuonghoang1103/Library-Management-System';
const DUAN = '/projects/library-management-system';

const q = (question, options, correctIndex, explanation) => ({
  question, options, correctIndex, points: 1,
  ...(explanation ? { explanation } : {}),
});

/* ═══════════════════════════════════════════════════════════════════════════
   Lesson 1 — Đề bài & yêu cầu nộp
   ═══════════════════════════════════════════════════════════════════════════ */
const L1 = {
  title: 'Lab 2.5.1 — The assignment: one project, one tool, three defects|||Lab 2.5.1 — Đề bài: một project, một công cụ, ba defect',
  slug: 'swt301-lab25-de-bai',
  type: 'DOCUMENT',
  description: 'Đề bài Lab cuối Chương 2: chọn project thật + công cụ kiểm thử, mỗi sinh viên tìm 3 defect, sửa và viết báo cáo theo form giảng viên. Giải thích từng mục của form, tiêu chí chấm và những lỗi làm mất điểm.',
  content: [
    bi(`<span class="eyebrow">Lab 2.5 · Lesson 1 · End of Chapter 2 · Bridge to Chapter 3</span>
<h2>The assignment in one sentence</h2>
<p class="lead">Take a <strong>real software project</strong>, point a <strong>testing tool</strong> at it, find <strong>three genuine defects</strong> per student, fix them, and write a <strong>professional report</strong>.</p>
<p class="y-chinh">🎯 The tool finds candidates. <strong>You</strong> decide which ones are real defects, how severe they are, and why. That judgement is what is being marked.</p>
<h3>The three pieces</h3>
<div class="lz-flow"><span>1 · PROJECT — the software you put under the microscope</span><span>2 · TOOL — the thing that searches for defects</span><span>3 · REPORT — the deliverable that gets a grade</span></div>
<h3>The report form, item by item</h3>
<div class="table-wrap"><table>
<thead><tr><th>Section</th><th>What goes in it</th></tr></thead>
<tbody>
<tr><td><strong>Title</strong></td><td>Project name, course code, class, lecturer, team name, member list with student IDs and roles.</td></tr>
<tr><td><strong>I. Introduction — Project</strong></td><td>What the software does, its architecture, tech stack, main modules, and <em>why it is worth testing</em>.</td></tr>
<tr><td><strong>II. Introduction — Tool</strong></td><td>What the tool is, what class of testing it performs (static or dynamic), how it was installed and run, what it can and cannot find.</td></tr>
<tr><td><strong>III. Find defect</strong></td><td>One sub-section per student. Each student logs <strong>3 defects</strong>, and each defect carries the four items below.</td></tr>
</tbody>
</table></div>
<h4>The four items required for every single defect</h4>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Item</th><th>Evidence you must attach</th></tr></thead>
<tbody>
<tr><td>1</td><td>Defect name + location</td><td>A screenshot of the <strong>tool reporting it</strong>, and a screenshot of the <strong>offending line of code</strong>.</td></tr>
<tr><td>2</td><td>Which tool found it</td><td>Name and version of the tool, plus the exact command or screen.</td></tr>
<tr><td>3</td><td>Level</td><td>Severity (and Priority, if your lecturer wants both) with a written justification.</td></tr>
<tr><td>4</td><td>Fix</td><td>The corrected code and a screenshot <strong>proving the defect is gone</strong> after re-running the tool.</td></tr>
</tbody>
</table></div>
<div class="callout co-tieu-de"><strong>Add these even though the form does not list them.</strong> A report that only contains the four items above looks thin. A professional one also carries: a table of contents, a work-assignment table (who did what), the test environment (OS, JDK, database, tool versions), steps to reproduce, expected vs actual result, a conclusion with lessons learned, and references.</div>
<div class="pitfall co-tieu-de"><strong>Ask your lecturer one question.</strong> "Level" is ambiguous — it can mean <strong>Severity</strong> (how badly it breaks the software) or <strong>Priority</strong> (how urgently it must be fixed). They are different and a defect can be high in one and low in the other. Safest answer: report both columns.</div>
<h3>Where this sits in the syllabus</h3>
<p>You have finished Chapter 1 and Chapter 2, so this lab must be written in the vocabulary you already own:</p>
<ul>
<li><strong>LO-1.1.2</strong> — distinguish <strong>error</strong>, <strong>defect</strong> and <strong>failure</strong>, and name the root cause (K2).</li>
<li><strong>LO-1.3.1</strong> — apply the <strong>seven testing principles</strong> to justify your approach (K2).</li>
<li><strong>LO-2.2.1</strong> — state which <strong>test level</strong> each defect belongs to: component, integration, system or acceptance (K2).</li>
<li><strong>LO-3.1.2</strong> — <em>preview of Chapter 3</em>: explain why finding a defect <strong>without executing the code</strong> is cheaper (K2).</li>
</ul>
<p class="ghi-chu">This lab is deliberately placed at the end of Chapter 2: it is the practical bridge into Chapter 3 (static testing) and Lab 1 (code review &amp; static analysis).</p>`,

`<span class="eyebrow">Lab 2.5 · Bài 1 · Cuối Chương 2 · Bắc cầu sang Chương 3</span>
<h2>Đề bài gói trong một câu</h2>
<p class="lead">Lấy một <strong>project phần mềm có thật</strong>, chĩa một <strong>công cụ kiểm thử</strong> vào nó, mỗi sinh viên tìm <strong>ba defect thật</strong>, sửa chúng, rồi viết một <strong>bản báo cáo chuyên nghiệp</strong>.</p>
<p class="y-chinh">🎯 Công cụ chỉ đưa ra ứng viên. <strong>Bạn</strong> mới là người quyết định cái nào thật sự là defect, nó nghiêm trọng đến đâu, và vì sao. Chính phần phán đoán đó được chấm điểm.</p>
<h3>Ba mảnh ghép</h3>
<div class="lz-flow"><span>1 · PROJECT — phần mềm đem ra soi</span><span>2 · TOOL — thứ đi tìm defect</span><span>3 · REPORT — sản phẩm được chấm</span></div>
<h3>Form báo cáo, đọc từng mục</h3>
<div class="table-wrap"><table>
<thead><tr><th>Mục</th><th>Nội dung cần có</th></tr></thead>
<tbody>
<tr><td><strong>Title</strong></td><td>Tên project, mã môn, lớp, giảng viên, tên nhóm, danh sách thành viên kèm MSSV và vai trò.</td></tr>
<tr><td><strong>I. Introduction — Project</strong></td><td>Phần mềm làm gì, kiến trúc, công nghệ, các module chính, và <em>vì sao nó đáng đem ra kiểm thử</em>.</td></tr>
<tr><td><strong>II. Introduction — Tool</strong></td><td>Công cụ là gì, thuộc loại kiểm thử nào (tĩnh hay động), cài và chạy ra sao, tìm được gì và <em>không</em> tìm được gì.</td></tr>
<tr><td><strong>III. Find defect</strong></td><td>Mỗi sinh viên một mục con. Mỗi người ghi <strong>3 defect</strong>, mỗi defect có đủ bốn mục dưới đây.</td></tr>
</tbody>
</table></div>
<h4>Bốn mục bắt buộc cho từng defect</h4>
<div class="table-wrap"><table>
<thead><tr><th>#</th><th>Mục</th><th>Bằng chứng phải đính kèm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Tên defect + vị trí</td><td>Ảnh <strong>công cụ báo lỗi</strong>, và ảnh <strong>dòng code bị lỗi</strong>.</td></tr>
<tr><td>2</td><td>Công cụ nào tìm ra</td><td>Tên và phiên bản công cụ, kèm đúng lệnh hoặc màn hình đã dùng.</td></tr>
<tr><td>3</td><td>Level</td><td>Severity (và Priority, nếu cô yêu cầu cả hai) kèm lập luận bằng chữ.</td></tr>
<tr><td>4</td><td>Fix</td><td>Code đã sửa và ảnh <strong>chứng minh defect đã biến mất</strong> sau khi quét lại.</td></tr>
</tbody>
</table></div>
<div class="callout co-tieu-de"><strong>Bổ sung những mục form không ghi.</strong> Báo cáo chỉ có đúng bốn mục trên trông rất mỏng. Bản chuyên nghiệp còn có: mục lục, bảng phân công (ai làm gì), môi trường kiểm thử (hệ điều hành, JDK, cơ sở dữ liệu, phiên bản công cụ), các bước tái hiện lỗi, kết quả mong đợi và kết quả thực tế, phần kết luận kèm bài học rút ra, và tài liệu tham khảo.</div>
<div class="pitfall co-tieu-de"><strong>Có một câu nên hỏi lại giảng viên.</strong> Chữ "Level" nước đôi — nó có thể là <strong>Severity</strong> (mức hỏng nặng đến đâu) hoặc <strong>Priority</strong> (mức gấp phải sửa). Hai thứ khác nhau, và một defect có thể cao ở cái này nhưng thấp ở cái kia. An toàn nhất: ghi cả hai cột.</div>
<h3>Bài này nằm ở đâu trong môn học</h3>
<p>Bạn vừa học xong Chương 1 và Chương 2, nên bài Lab này phải viết bằng đúng vốn từ bạn đã có:</p>
<ul>
<li><strong>LO-1.1.2</strong> — phân biệt <strong>error</strong>, <strong>defect</strong> và <strong>failure</strong>, chỉ ra nguyên nhân gốc (K2).</li>
<li><strong>LO-1.3.1</strong> — vận dụng <strong>7 nguyên tắc kiểm thử</strong> để biện minh cho cách làm của mình (K2).</li>
<li><strong>LO-2.2.1</strong> — nói rõ mỗi defect thuộc <strong>cấp kiểm thử</strong> nào: component, integration, system hay acceptance (K2).</li>
<li><strong>LO-3.1.2</strong> — <em>xem trước Chương 3</em>: giải thích vì sao tìm ra defect <strong>mà không cần chạy chương trình</strong> thì rẻ hơn (K2).</li>
</ul>
<p class="ghi-chu">Bài Lab này được đặt ở cuối Chương 2 có chủ đích: nó là cây cầu thực hành dẫn sang Chương 3 (kiểm thử tĩnh) và Lab 1 (review code &amp; phân tích tĩnh).</p>`),
  ].join('\n'),
};

/* ═══════════════════════════════════════════════════════════════════════════
   Lesson 2 — Project mẫu + link tải
   ═══════════════════════════════════════════════════════════════════════════ */
const L2 = {
  title: 'Lab 2.5.2 — The sample project: Library Management System|||Lab 2.5.2 — Project mẫu: Library Management System',
  slug: 'swt301-lab25-project-mau',
  type: 'DOCUMENT',
  description: 'Project mẫu để làm Lab: hệ thống quản lý thư viện Spring Boot 3.4 + React 18 + PostgreSQL, 10 service, 112 test JUnit sẵn có. Link tải source trên GitHub, cách chạy, cảnh báo JDK 21, và bảng chia module cho nhóm để defect không trùng nhau.',
  content: [
    bi(`<span class="eyebrow">Lab 2.5 · Lesson 2 · The project under test</span>
<h2>A real system, not a toy</h2>
<p class="lead">You may use your own project. If you do not have one ready, use this: a full-stack <strong>Library Management System</strong> with a genuine business domain, a real database and a test suite already in place.</p>
<div class="callout"><span class="badge">Full source</span>
 The complete project lives on GitHub:
 <a href="${GH}" target="_blank" rel="noopener"><b>cuonghoang1103/Library-Management-System</b></a> —
 backend, frontend, database migrations, <code>docker-compose.yml</code> and the existing JUnit suite.
 Clone it with <code>git clone ${GH}.git</code>, or download the ZIP from the green
 <b>Code</b> button. Background and design notes:
 <a href="${DUAN}"><b>Library Management System</b></a> on this site.</div>
<h3>What is inside</h3>
<div class="table-wrap"><table>
<thead><tr><th>Layer</th><th>Technology</th><th>Why it matters for this lab</th></tr></thead>
<tbody>
<tr><td>Backend</td><td>Java 21, Spring Boot 3.4, Spring Data JPA, Spring Security</td><td>Where nearly every defect you will report lives.</td></tr>
<tr><td>Database</td><td>PostgreSQL 16 + Flyway migrations</td><td>Constraints and migrations are a classic defect source.</td></tr>
<tr><td>Frontend</td><td>React 18, Vite, TailwindCSS — 13 pages</td><td>Useful if you want UI or accessibility defects.</td></tr>
<tr><td>Tests</td><td>JUnit 5, Mockito, MockMvc — <strong>112 tests</strong>, JaCoCo coverage</td><td>Lets you prove a fix did not break anything else.</td></tr>
<tr><td>Packaging</td><td>Docker Compose</td><td>One command brings the whole system up.</td></tr>
</tbody>
</table></div>
<h3>The business domain</h3>
<p>Ten services: authentication, books, physical copies, loans, fees, users, reservations, reviews, notifications and audit logging. Two roles: <strong>MEMBER</strong> (borrows) and <strong>LIBRARIAN</strong> (administers).</p>
<p class="y-chinh">🎯 Why this domain is good for finding defects: its rules are <strong>countable</strong> — how many books may be borrowed at once, how many days until due, how much the fine is per overdue day. Rules with numbers in them are exactly where boundary defects hide, and exactly what Chapter 4 will teach you to attack.</p>
<h3>Running it</h3>
<pre><code># 1 · get the source
git clone ${GH}.git
cd Library-Management-System

# 2 · the whole system (PostgreSQL + API + web)
docker compose up --build
#    frontend → http://localhost:3000
#    API      → http://localhost:8080

# 3 · just the test suite
cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 21)   # macOS
mvn test</code></pre>
<div class="pitfall co-tieu-de"><strong>You must run on JDK 21.</strong> The project declares <code>&lt;java.version&gt;21&lt;/java.version&gt;</code>. If Maven runs on a newer JDK the suite collapses: ByteBuddy 1.15.10 (which Mockito uses) officially supports only up to Java 24 and refuses anything newer, and JaCoCo cannot read the bytecode either. Symptom: dozens of <code>MockitoException: Could not modify all classes</code>. Check with <code>mvn -version</code> — it prints the JDK Maven itself uses, which is <em>not</em> always the one <code>java -version</code> reports.</div>
<h3>Splitting the work so defects do not collide</h3>
<p>If the whole team tests one project, two students will report the same defect. Assign a module to each member up front:</p>
<div class="table-wrap"><table>
<thead><tr><th>Member</th><th>Module</th><th>Where to look</th></tr></thead>
<tbody>
<tr><td>Team leader</td><td>Loan + Fee</td><td>Overdue calculation, fine amounts, borrowing limits, renewals</td></tr>
<tr><td>Member A</td><td>Book + Copy</td><td>Copy status transitions, full-text search</td></tr>
<tr><td>Member B</td><td>Auth + User</td><td>JWT handling, role-based access control</td></tr>
<tr><td>Member C</td><td>Reservation + Review</td><td>Reservation queue, rating validation</td></tr>
</tbody>
</table></div>
<p class="meo">🧠 The leader should complete their own module first, to the full standard, and circulate it as the worked example the rest of the team copies the <em>shape</em> of — not the content.</p>`,

`<span class="eyebrow">Lab 2.5 · Bài 2 · Project đem ra kiểm thử</span>
<h2>Một hệ thống thật, không phải bài tập đồ chơi</h2>
<p class="lead">Bạn có thể dùng project của riêng mình. Nếu chưa có, dùng cái này: <strong>Hệ thống quản lý thư viện</strong> full-stack, nghiệp vụ thật, cơ sở dữ liệu thật, và đã có sẵn bộ test.</p>
<div class="callout"><span class="badge">Source đầy đủ</span>
 Toàn bộ project nằm trên GitHub:
 <a href="${GH}" target="_blank" rel="noopener"><b>cuonghoang1103/Library-Management-System</b></a> —
 backend, frontend, migration cơ sở dữ liệu, <code>docker-compose.yml</code> và bộ JUnit sẵn có.
 Tải bằng <code>git clone ${GH}.git</code>, hoặc bấm nút <b>Code</b> màu xanh để tải ZIP.
 Phần giới thiệu và ý đồ thiết kế:
 <a href="${DUAN}"><b>Library Management System</b></a> trên chính trang này.</div>
<h3>Bên trong có gì</h3>
<div class="table-wrap"><table>
<thead><tr><th>Tầng</th><th>Công nghệ</th><th>Vì sao quan trọng với bài Lab</th></tr></thead>
<tbody>
<tr><td>Backend</td><td>Java 21, Spring Boot 3.4, Spring Data JPA, Spring Security</td><td>Gần như mọi defect bạn sẽ báo đều nằm ở đây.</td></tr>
<tr><td>Cơ sở dữ liệu</td><td>PostgreSQL 16 + migration Flyway</td><td>Ràng buộc và migration là nguồn defect kinh điển.</td></tr>
<tr><td>Frontend</td><td>React 18, Vite, TailwindCSS — 13 trang</td><td>Dùng khi bạn muốn tìm defect giao diện hoặc khả năng truy cập.</td></tr>
<tr><td>Test</td><td>JUnit 5, Mockito, MockMvc — <strong>112 test</strong>, đo coverage bằng JaCoCo</td><td>Giúp bạn chứng minh bản sửa không làm hỏng thứ khác.</td></tr>
<tr><td>Đóng gói</td><td>Docker Compose</td><td>Một lệnh dựng cả hệ thống.</td></tr>
</tbody>
</table></div>
<h3>Nghiệp vụ</h3>
<p>Mười service: xác thực, đầu sách, bản sao vật lý, phiếu mượn, phí phạt, người dùng, đặt trước, đánh giá, thông báo và nhật ký kiểm toán. Hai vai trò: <strong>MEMBER</strong> (mượn sách) và <strong>LIBRARIAN</strong> (quản trị).</p>
<p class="y-chinh">🎯 Vì sao nghiệp vụ này dễ ra defect: quy tắc của nó <strong>đếm được</strong> — mượn tối đa mấy cuốn, hạn trả bao nhiêu ngày, quá hạn phạt bao nhiêu một ngày. Quy tắc có con số chính là nơi defect biên ẩn nấp, và cũng đúng là thứ Chương 4 sắp dạy bạn cách tấn công.</p>
<h3>Cách chạy</h3>
<pre><code># 1 · lấy source
git clone ${GH}.git
cd Library-Management-System

# 2 · dựng cả hệ thống (PostgreSQL + API + web)
docker compose up --build
#    giao diện → http://localhost:3000
#    API       → http://localhost:8080

# 3 · chỉ chạy bộ test
cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 21)   # macOS
mvn test</code></pre>
<div class="pitfall co-tieu-de"><strong>Bắt buộc chạy bằng JDK 21.</strong> Project khai <code>&lt;java.version&gt;21&lt;/java.version&gt;</code>. Nếu Maven chạy trên JDK mới hơn, bộ test sập hàng loạt: ByteBuddy 1.15.10 (thứ Mockito dùng) chỉ hỗ trợ chính thức tới Java 24 và từ chối bản mới hơn, còn JaCoCo cũng không đọc nổi bytecode. Triệu chứng: hàng chục lỗi <code>MockitoException: Could not modify all classes</code>. Kiểm tra bằng <code>mvn -version</code> — nó in ra JDK mà chính Maven dùng, <em>không</em> phải lúc nào cũng trùng với cái <code>java -version</code> báo.</div>
<h3>Chia việc để defect không trùng nhau</h3>
<p>Nếu cả nhóm cùng soi một project, kiểu gì cũng có hai bạn báo trùng defect. Hãy chia module ngay từ đầu:</p>
<div class="table-wrap"><table>
<thead><tr><th>Thành viên</th><th>Module</th><th>Chỗ nên soi</th></tr></thead>
<tbody>
<tr><td>Nhóm trưởng</td><td>Loan + Fee</td><td>Tính quá hạn, số tiền phạt, giới hạn mượn, gia hạn</td></tr>
<tr><td>Thành viên A</td><td>Book + Copy</td><td>Chuyển trạng thái bản sao, tìm kiếm toàn văn</td></tr>
<tr><td>Thành viên B</td><td>Auth + User</td><td>Xử lý JWT, phân quyền theo vai trò</td></tr>
<tr><td>Thành viên C</td><td>Reservation + Review</td><td>Hàng chờ đặt trước, kiểm tra hợp lệ của đánh giá</td></tr>
</tbody>
</table></div>
<p class="meo">🧠 Nhóm trưởng nên làm xong module của mình trước, làm thật chuẩn, rồi đưa cho cả nhóm làm mẫu — để các bạn bắt chước <em>hình dạng</em> của bài, không phải chép nội dung.</p>`),
  ].join('\n'),
};

/* ═══════════════════════════════════════════════════════════════════════════
   Lesson 3 — Công cụ
   ═══════════════════════════════════════════════════════════════════════════ */
const L3 = {
  title: 'Lab 2.5.3 — The tools: SonarQube, the command line and JaCoCo|||Lab 2.5.3 — Bộ công cụ: SonarQube, dòng lệnh và JaCoCo',
  slug: 'swt301-lab25-cong-cu',
  type: 'DOCUMENT',
  description: 'Static testing và dynamic testing khác nhau ra sao, tool nào thuộc loại nào. Dựng SonarQube bằng Docker, quét project, đọc thang Blocker→Info, phân biệt Bug / Vulnerability / Code Smell. Chạy JUnit qua CMD và đo coverage bằng JaCoCo.',
  content: [
    bi(`<span class="eyebrow">Lab 2.5 · Lesson 3 · Tool support for testing</span>
<h2>Two families of testing, two families of tool</h2>
<div class="table-wrap"><table>
<thead><tr><th></th><th>STATIC testing</th><th>DYNAMIC testing</th></tr></thead>
<tbody>
<tr><td>Is the program executed?</td><td><strong>No</strong></td><td><strong>Yes</strong></td></tr>
<tr><td>Method</td><td>Read and analyse the source</td><td>Run it and compare actual with expected</td></tr>
<tr><td>Tools</td><td><strong>SonarQube</strong>, SonarLint, PMD, SpotBugs, code review</td><td><strong>JUnit</strong> via the command line, Postman, Selenium</td></tr>
<tr><td>Finds</td><td><strong>Defects</strong> sitting in the code</td><td><strong>Failures</strong> visible at run time</td></tr>
<tr><td>Cost of the fix</td><td>Lower — found before execution</td><td>Higher — found later in the lifecycle</td></tr>
</tbody>
</table></div>
<p class="y-chinh">🎯 The assignment leans towards <strong>static</strong> testing, because the form demands "the line of the defect" — and only a tool that reads code can point at a line.</p>
<h3>SonarQube in sixty seconds</h3>
<div class="lz-flow"><span>Your code</span><span>SonarQube checks it against ~600 rules</span><span>A list of issues, each with a file, a line and a severity</span></div>
<pre><code># 1 · start the server (Docker)
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community
#    open http://localhost:9000  ·  first login admin / admin

# 2 · create a project in the web UI, copy the token it gives you

# 3 · scan (from the backend/ folder)
mvn clean verify sonar:sonar \\
  -Dsonar.projectKey=library-management \\
  -Dsonar.host.url=http://localhost:9000 \\
  -Dsonar.token=YOUR_TOKEN</code></pre>
<h3>Reading what it gives back</h3>
<div class="table-wrap"><table>
<thead><tr><th>SonarQube shows</th><th>Form item it satisfies</th></tr></thead>
<tbody>
<tr><td>Issue title and description</td><td>1 · Defect name</td></tr>
<tr><td>The issue page itself</td><td>1 · Screenshot of the tool reporting it</td></tr>
<tr><td>File + line number, highlighted</td><td>1 · Screenshot of the offending line</td></tr>
<tr><td>SonarQube, with its version</td><td>2 · Which tool found it</td></tr>
<tr><td>Blocker · Critical · Major · Minor · Info</td><td>3 · Level</td></tr>
<tr><td>Re-scan: the issue disappears</td><td>4 · Proof of the fix</td></tr>
</tbody>
</table></div>
<div class="pitfall co-tieu-de"><strong>Not every issue is a defect.</strong> SonarQube sorts findings into three kinds, and they are not equal. 🐛 <strong>Bug</strong> — the code behaves incorrectly: this is what the assignment wants. 🔒 <strong>Vulnerability</strong> — a security hole: also excellent material. 💨 <strong>Code Smell</strong> — ugly but correct code. Submit three code smells such as "this method is too long" and the first question you will be asked is "so what does it compute wrongly?" — and you will have no answer. Take Bugs and Vulnerabilities.</div>
<h3>The command line as a dynamic tool</h3>
<pre><code>cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
mvn test                    # runs all 112 tests
mvn test -Dtest=LoanServiceTest   # one class, when you are hunting
</code></pre>
<p>Failures land in <code>target/surefire-reports/</code>. Read the <code>.txt</code> file for the stack trace — the first <code>Caused by:</code> line is almost always where the real problem is.</p>
<h3>JaCoCo — how much of the code did the tests actually touch?</h3>
<p><code>mvn test</code> writes an HTML report to <code>target/site/jacoco/index.html</code>. On the untouched project it reads <strong>57%</strong> overall, while the project's own test plan sets a target of 70% — a gap worth reporting in its own right.</p>
<p class="meo">🧠 Coverage is evidence, not a goal. 100% coverage with assertions that check nothing proves nothing. Use it to show <em>which parts were never exercised</em>, because untested code is where defects survive.</p>
<div class="callout co-tieu-de"><strong>The sentence your lecturer wants to hear.</strong> A tool searches for patterns; it does not know your requirements. If the specification says the VIP discount is 20% and the code gives 15%, that is perfectly legal code and <em>no</em> static analyser will flag it. Catching that needs a human holding the specification. This is precisely why the report is written by people and not by the tool.</div>`,

`<span class="eyebrow">Lab 2.5 · Bài 3 · Công cụ hỗ trợ kiểm thử</span>
<h2>Hai họ kiểm thử, hai họ công cụ</h2>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Kiểm thử TĨNH</th><th>Kiểm thử ĐỘNG</th></tr></thead>
<tbody>
<tr><td>Có chạy chương trình không?</td><td><strong>Không</strong></td><td><strong>Có</strong></td></tr>
<tr><td>Cách làm</td><td>Đọc và phân tích mã nguồn</td><td>Chạy lên rồi so kết quả thực tế với mong đợi</td></tr>
<tr><td>Công cụ</td><td><strong>SonarQube</strong>, SonarLint, PMD, SpotBugs, review code</td><td><strong>JUnit</strong> qua dòng lệnh, Postman, Selenium</td></tr>
<tr><td>Tìm ra</td><td><strong>Defect</strong> đang nằm trong code</td><td><strong>Failure</strong> lộ ra lúc chạy</td></tr>
<tr><td>Chi phí sửa</td><td>Thấp hơn — phát hiện trước khi chạy</td><td>Cao hơn — phát hiện muộn hơn trong vòng đời</td></tr>
</tbody>
</table></div>
<p class="y-chinh">🎯 Đề bài nghiêng hẳn về kiểm thử <strong>tĩnh</strong>, vì form đòi "dòng của bug lỗi" — mà chỉ công cụ đọc code mới chỉ được vào đúng dòng.</p>
<h3>SonarQube trong sáu mươi giây</h3>
<div class="lz-flow"><span>Code của bạn</span><span>SonarQube đối chiếu với ~600 quy tắc</span><span>Danh sách issue, mỗi cái có file, số dòng và mức độ</span></div>
<pre><code># 1 · dựng server (Docker)
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community
#    mở http://localhost:9000  ·  đăng nhập lần đầu admin / admin

# 2 · tạo project trên giao diện web, copy token nó cấp

# 3 · quét (đứng trong thư mục backend/)
mvn clean verify sonar:sonar \\
  -Dsonar.projectKey=library-management \\
  -Dsonar.host.url=http://localhost:9000 \\
  -Dsonar.token=TOKEN_CUA_BAN</code></pre>
<h3>Đọc kết quả nó trả về</h3>
<div class="table-wrap"><table>
<thead><tr><th>SonarQube hiển thị</th><th>Đáp ứng mục nào của form</th></tr></thead>
<tbody>
<tr><td>Tiêu đề và mô tả issue</td><td>1 · Tên defect</td></tr>
<tr><td>Chính trang issue đó</td><td>1 · Ảnh công cụ báo lỗi</td></tr>
<tr><td>File + số dòng, được tô sáng</td><td>1 · Ảnh dòng code lỗi</td></tr>
<tr><td>SonarQube, kèm phiên bản</td><td>2 · Công cụ nào tìm ra</td></tr>
<tr><td>Blocker · Critical · Major · Minor · Info</td><td>3 · Level</td></tr>
<tr><td>Quét lại: issue biến mất</td><td>4 · Bằng chứng đã sửa</td></tr>
</tbody>
</table></div>
<div class="pitfall co-tieu-de"><strong>Không phải issue nào cũng là defect.</strong> SonarQube chia kết quả làm ba loại, và chúng không ngang nhau. 🐛 <strong>Bug</strong> — code chạy sai: đây mới là thứ đề bài cần. 🔒 <strong>Vulnerability</strong> — lỗ hổng bảo mật: cũng rất đáng giá. 💨 <strong>Code Smell</strong> — code xấu nhưng vẫn đúng. Nộp ba code smell kiểu "hàm này dài quá" thì câu đầu tiên bạn bị hỏi sẽ là "thế nó tính sai chỗ nào?" — và bạn sẽ không trả lời được. Hãy lấy Bug và Vulnerability.</div>
<h3>Dòng lệnh với vai trò công cụ động</h3>
<pre><code>cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
mvn test                          # chạy cả 112 test
mvn test -Dtest=LoanServiceTest   # một class, khi đang truy lỗi
</code></pre>
<p>Kết quả lỗi nằm trong <code>target/surefire-reports/</code>. Mở file <code>.txt</code> để đọc stack trace — dòng <code>Caused by:</code> đầu tiên gần như luôn là nơi vấn đề thật sự nằm.</p>
<h3>JaCoCo — test thực sự chạm tới bao nhiêu phần code?</h3>
<p><code>mvn test</code> xuất báo cáo HTML ra <code>target/site/jacoco/index.html</code>. Trên project chưa sửa gì, con số là <strong>57%</strong>, trong khi test plan của chính project đặt mục tiêu 70% — bản thân khoảng chênh đó đã là một điều đáng báo cáo.</p>
<p class="meo">🧠 Coverage là bằng chứng, không phải mục tiêu. Phủ 100% mà assertion không kiểm gì thì chẳng chứng minh được gì. Hãy dùng nó để chỉ ra <em>phần nào chưa bao giờ được chạy tới</em>, vì code không được test chính là nơi defect sống sót.</p>
<div class="callout co-tieu-de"><strong>Câu mà giảng viên muốn nghe.</strong> Công cụ đi tìm theo mẫu; nó không biết yêu cầu của bạn. Nếu đặc tả nói giảm giá VIP là 20% mà code cho 15%, đó vẫn là code hợp lệ và <em>không</em> công cụ phân tích tĩnh nào báo được. Bắt được lỗi đó cần một con người cầm bản đặc tả trong tay. Đây đúng là lý do báo cáo do người viết chứ không phải do công cụ viết.</div>`),
  ].join('\n'),
};

/* ═══════════════════════════════════════════════════════════════════════════
   Lesson 4 — Tìm và phân tích defect
   ═══════════════════════════════════════════════════════════════════════════ */
const L4 = {
  title: 'Lab 2.5.4 — Finding and analysing a defect, end to end|||Lab 2.5.4 — Tìm và phân tích một defect, trọn vòng',
  slug: 'swt301-lab25-phan-tich-defect',
  type: 'DOCUMENT',
  description: 'Error/defect/failure áp vào ví dụ thật, chọn severity có lập luận, gán cấp kiểm thử, và một defect có thật trong project mẫu đi trọn vòng từ triệu chứng tới bản sửa đã kiểm chứng.',
  content: [
    bi(`<span class="eyebrow">Lab 2.5 · Lesson 4 · From symptom to root cause</span>
<h2>Three words you must not mix up</h2>
<pre><code>A developer forgets to guard against a negative number  →  ERROR    (a human mistake)
The line lacks  if (quantity &lt; 0)                       →  DEFECT   (in the CODE)
Entering -5 produces a negative fine                     →  FAILURE  (at RUN TIME)</code></pre>
<p class="y-chinh">🎯 A defect can sit in the code forever and never become a failure, if nothing ever executes that branch. That is the whole argument for static testing: it catches the defect <em>before</em> it gets the chance to become a failure.</p>
<h3>Choosing a severity you can defend</h3>
<div class="table-wrap"><table>
<thead><tr><th>Level</th><th>Use it when…</th><th>Example in this project</th></tr></thead>
<tbody>
<tr><td><strong>Blocker</strong></td><td>The system cannot be used, or data is corrupted</td><td>Two members borrow the same physical copy</td></tr>
<tr><td><strong>Critical</strong></td><td>A major function is wrong, or security is bypassed</td><td>A MEMBER can read another member's loans</td></tr>
<tr><td><strong>Major</strong></td><td>A function is wrong but there is a workaround</td><td>The overdue fine is off by one day</td></tr>
<tr><td><strong>Minor</strong></td><td>Small, visible, low impact</td><td>A date is formatted inconsistently</td></tr>
<tr><td><strong>Info</strong></td><td>Worth noting, not wrong</td><td>A misleading comment</td></tr>
</tbody>
</table></div>
<p class="ghi-chu"><strong>Severity ≠ Priority.</strong> A typo in the company name on the home page is <em>Minor</em> severity but may be <em>High</em> priority because everyone sees it. A crash in a feature nobody uses is <em>Blocker</em> severity and <em>Low</em> priority.</p>
<h3>Name the test level for every defect</h3>
<div class="table-wrap"><table>
<thead><tr><th>Level</th><th>What is being tested</th><th>How you would hit it here</th></tr></thead>
<tbody>
<tr><td>Component (unit)</td><td>One class or method in isolation</td><td><code>LoanServiceTest</code>, <code>FeeServiceTest</code></td></tr>
<tr><td>Integration</td><td>Parts working together</td><td><code>LoanControllerIntegrationTest</code> — controller + service + database</td></tr>
<tr><td>System</td><td>The whole application</td><td>Clicking through the React UI against the running API</td></tr>
<tr><td>Acceptance</td><td>Does it meet the user's need</td><td>"A librarian can process a return in under 30 seconds"</td></tr>
</tbody>
</table></div>
<h3>A real defect, followed all the way through</h3>
<p>This one was found in the sample project by running <code>mvn test</code>. Every number below came from the actual run.</p>
<div class="callout"><strong>BUG-01 · <code>DataLoader</code> seeds demo users in the test profile</strong>
<div class="table-wrap"><table>
<tbody>
<tr><td><strong>Symptom</strong></td><td>31 integration tests fail with <code>ConstraintViolationException: Unique index or primary key violation … USERS(USERNAME) VALUES ('librarian')</code></td></tr>
<tr><td><strong>Tool</strong></td><td>Command line — <code>mvn test</code> (Maven 3.9.11, JUnit 5.11.3)</td></tr>
<tr><td><strong>Test level</strong></td><td>Integration testing</td></tr>
<tr><td><strong>Location</strong></td><td><code>backend/src/main/java/com/library/config/DataLoader.java</code>, line 10</td></tr>
<tr><td><strong>Expected</strong></td><td>112 tests pass</td></tr>
<tr><td><strong>Actual</strong></td><td>31 errors</td></tr>
<tr><td><strong>Root cause</strong></td><td><code>DataLoader</code> is a <code>CommandLineRunner</code>: it runs at every application start and <em>commits</em> the users <code>librarian</code> and <code>member</code>. It is not restricted by profile, so it also runs during tests. Each test class then calls <code>deleteAll()</code> followed by <code>save()</code> inside one transaction — and Hibernate always flushes <strong>INSERTs before DELETEs</strong>. The new <code>librarian</code> is inserted before the old one is removed, so the unique constraint fires.</td></tr>
<tr><td><strong>Severity</strong></td><td><strong>Major</strong> — end users are unaffected, but the entire integration test layer is disabled, which hides every other defect at that level.</td></tr>
<tr><td><strong>Fix</strong></td><td>Annotate the class <code>@Profile("!test")</code> so demo seeding never runs under test.</td></tr>
<tr><td><strong>Verification</strong></td><td>Re-ran <code>mvn test</code>: <strong>112 tests, 0 failures, 0 errors</strong>.</td></tr>
</tbody>
</table></div></div>
<p class="y-chinh">🎯 Look at how little the tool contributed: one line — "<code>mvn test</code> reported an error". Everything else — reading the stack trace, knowing Hibernate's flush order, judging the severity, choosing the fix — is human work. That is the part being graded.</p>
<div class="meo">🧠 <strong>Where to hunt in this project.</strong> Three leads that are already visible: three tests carry <code>@Disabled("Security config issue")</code> in <code>LoanControllerIntegrationTest</code> — somebody switched them off instead of fixing what they found; the README and <code>TEST_PLAN.md</code> claim Spring Boot 3.2.0 and Java 17 while <code>pom.xml</code> says 3.4.0 and Java 21; and coverage sits at 57% against a stated target of 70%.</div>`,

`<span class="eyebrow">Lab 2.5 · Bài 4 · Từ triệu chứng tới nguyên nhân gốc</span>
<h2>Ba chữ không được nhầm</h2>
<pre><code>Lập trình viên quên chặn số âm                →  ERROR    (sai sót của CON NGƯỜI)
Dòng code thiếu  if (soLuong &lt; 0)             →  DEFECT   (nằm trong CODE)
Nhập -5 thì ra tiền phạt âm                   →  FAILURE  (lúc CHẠY)</code></pre>
<p class="y-chinh">🎯 Một defect có thể nằm im trong code mãi mãi mà không bao giờ thành failure, nếu không có gì chạy vào nhánh đó. Đó chính là toàn bộ lý lẽ của kiểm thử tĩnh: nó bắt defect <em>trước khi</em> defect kịp có cơ hội thành failure.</p>
<h3>Chọn severity sao cho bảo vệ được</h3>
<div class="table-wrap"><table>
<thead><tr><th>Mức</th><th>Dùng khi…</th><th>Ví dụ trong project này</th></tr></thead>
<tbody>
<tr><td><strong>Blocker</strong></td><td>Hệ thống không dùng được, hoặc dữ liệu hỏng</td><td>Hai thành viên cùng mượn được một bản sao vật lý</td></tr>
<tr><td><strong>Critical</strong></td><td>Chức năng lớn sai, hoặc bảo mật bị vượt qua</td><td>MEMBER xem được phiếu mượn của người khác</td></tr>
<tr><td><strong>Major</strong></td><td>Chức năng sai nhưng còn đường vòng</td><td>Tiền phạt quá hạn lệch một ngày</td></tr>
<tr><td><strong>Minor</strong></td><td>Nhỏ, nhìn thấy được, ảnh hưởng thấp</td><td>Định dạng ngày không nhất quán</td></tr>
<tr><td><strong>Info</strong></td><td>Đáng ghi nhận, chưa phải sai</td><td>Comment gây hiểu nhầm</td></tr>
</tbody>
</table></div>
<p class="ghi-chu"><strong>Severity ≠ Priority.</strong> Gõ sai tên công ty ở trang chủ là severity <em>Minor</em> nhưng priority có thể <em>High</em> vì ai cũng nhìn thấy. Một chỗ sập trong chức năng không ai dùng thì severity <em>Blocker</em> mà priority <em>Low</em>.</p>
<h3>Mỗi defect phải gọi tên cấp kiểm thử</h3>
<div class="table-wrap"><table>
<thead><tr><th>Cấp</th><th>Kiểm thứ gì</th><th>Ở project này thì chạm vào đâu</th></tr></thead>
<tbody>
<tr><td>Component (unit)</td><td>Một class hoặc method, tách riêng</td><td><code>LoanServiceTest</code>, <code>FeeServiceTest</code></td></tr>
<tr><td>Integration</td><td>Các phần ghép với nhau</td><td><code>LoanControllerIntegrationTest</code> — controller + service + cơ sở dữ liệu</td></tr>
<tr><td>System</td><td>Toàn bộ ứng dụng</td><td>Bấm qua giao diện React nối với API đang chạy</td></tr>
<tr><td>Acceptance</td><td>Có đáp ứng nhu cầu người dùng không</td><td>"Thủ thư nhận trả sách xong trong dưới 30 giây"</td></tr>
</tbody>
</table></div>
<h3>Một defect có thật, đi trọn vòng</h3>
<p>Defect này tìm được trong project mẫu bằng cách chạy <code>mvn test</code>. Mọi con số dưới đây lấy từ lần chạy thật.</p>
<div class="callout"><strong>BUG-01 · <code>DataLoader</code> ghi dữ liệu demo ngay cả ở profile test</strong>
<div class="table-wrap"><table>
<tbody>
<tr><td><strong>Triệu chứng</strong></td><td>31 integration test lỗi với <code>ConstraintViolationException: Unique index or primary key violation … USERS(USERNAME) VALUES ('librarian')</code></td></tr>
<tr><td><strong>Công cụ</strong></td><td>Dòng lệnh — <code>mvn test</code> (Maven 3.9.11, JUnit 5.11.3)</td></tr>
<tr><td><strong>Cấp kiểm thử</strong></td><td>Integration testing</td></tr>
<tr><td><strong>Vị trí</strong></td><td><code>backend/src/main/java/com/library/config/DataLoader.java</code>, dòng 10</td></tr>
<tr><td><strong>Mong đợi</strong></td><td>112 test chạy xanh</td></tr>
<tr><td><strong>Thực tế</strong></td><td>31 lỗi</td></tr>
<tr><td><strong>Nguyên nhân gốc</strong></td><td><code>DataLoader</code> là một <code>CommandLineRunner</code>: nó chạy mỗi lần khởi động ứng dụng và <em>commit</em> hai user <code>librarian</code> và <code>member</code>. Nó không bị giới hạn theo profile nên chạy cả khi test. Sau đó mỗi test class gọi <code>deleteAll()</code> rồi <code>save()</code> trong cùng một transaction — mà Hibernate luôn flush <strong>INSERT trước DELETE</strong>. User <code>librarian</code> mới bị chèn trước khi user cũ kịp bị xoá, nên ràng buộc unique nổ.</td></tr>
<tr><td><strong>Severity</strong></td><td><strong>Major</strong> — người dùng cuối không bị ảnh hưởng, nhưng toàn bộ tầng integration test bị vô hiệu hoá, che mất mọi defect khác ở cấp đó.</td></tr>
<tr><td><strong>Cách sửa</strong></td><td>Gắn <code>@Profile("!test")</code> lên class để dữ liệu demo không bao giờ được ghi khi chạy test.</td></tr>
<tr><td><strong>Kiểm chứng</strong></td><td>Chạy lại <code>mvn test</code>: <strong>112 test, 0 failure, 0 error</strong>.</td></tr>
</tbody>
</table></div></div>
<p class="y-chinh">🎯 Hãy để ý công cụ đóng góp ít đến mức nào: đúng một dòng — "<code>mvn test</code> báo lỗi". Tất cả phần còn lại — đọc stack trace, biết thứ tự flush của Hibernate, cân nhắc mức severity, chọn cách sửa — đều là việc của con người. Đó mới là phần được chấm.</p>
<div class="meo">🧠 <strong>Nên đào ở đâu trong project này.</strong> Ba manh mối đã lộ sẵn: ba test mang <code>@Disabled("Security config issue")</code> trong <code>LoanControllerIntegrationTest</code> — ai đó đã tắt chúng đi thay vì sửa thứ họ tìm ra; README và <code>TEST_PLAN.md</code> ghi Spring Boot 3.2.0 và Java 17 trong khi <code>pom.xml</code> nói 3.4.0 và Java 21; và coverage đang ở 57% so với mục tiêu 70% do chính project đặt ra.</div>`),
  ].join('\n'),
};

/* ═══════════════════════════════════════════════════════════════════════════
   Lesson 5 — Viết báo cáo
   ═══════════════════════════════════════════════════════════════════════════ */
const L5 = {
  title: 'Lab 2.5.5 — Writing the report professionally|||Lab 2.5.5 — Viết báo cáo cho chuyên nghiệp',
  slug: 'swt301-lab25-viet-bao-cao',
  type: 'DOCUMENT',
  description: 'Bố cục đầy đủ của bản báo cáo, mẫu điền sẵn cho từng defect, quy tắc chụp ảnh minh chứng, bảng phân công nhóm, những lỗi làm mất điểm và checklist trước khi nộp.',
  content: [
    bi(`<span class="eyebrow">Lab 2.5 · Lesson 5 · The deliverable</span>
<h2>The full structure</h2>
<pre><code>COVER          Project · SWT301 · class · lecturer · team · members (ID, role)
TABLE OF CONTENTS
WORK ASSIGNMENT      who did which module, which defects, who wrote what

I.  INTRODUCTION — PROJECT
    1.1  Purpose and scope        1.2  Architecture and tech stack
    1.3  Main modules             1.4  Why this project is worth testing

II. INTRODUCTION — TOOL
    2.1  What the tool is         2.2  Static or dynamic, and why
    2.3  Installation and setup   2.4  How to run it
    2.5  What it can and cannot find

III. TEST ENVIRONMENT
     OS · JDK · database · Maven · tool versions

IV. FIND DEFECT
    4.1  Student A — 3 defects    4.2  Student B — 3 defects   …

V.  CONCLUSION
    5.1  Summary table of all defects by severity
    5.2  Lessons learned          5.3  What we would do next

REFERENCES</code></pre>
<h3>The template for one defect — copy this block</h3>
<div class="callout"><strong>BUG-xx · &lt;short name saying what is wrong&gt;</strong>
<div class="table-wrap"><table>
<tbody>
<tr><td><strong>Found by</strong></td><td>Tool name and version, exact command or screen</td></tr>
<tr><td><strong>Test level</strong></td><td>Component / Integration / System / Acceptance</td></tr>
<tr><td><strong>Location</strong></td><td><code>path/to/File.java</code>, line N</td></tr>
<tr><td><strong>Steps to reproduce</strong></td><td>1 · … 2 · … 3 · …</td></tr>
<tr><td><strong>Expected result</strong></td><td>What should happen</td></tr>
<tr><td><strong>Actual result</strong></td><td>What happens instead</td></tr>
<tr><td><strong>Evidence</strong></td><td>Figure 1 — tool reporting it · Figure 2 — the offending line</td></tr>
<tr><td><strong>Root cause</strong></td><td>Why the code is wrong — the reasoning, not a restatement</td></tr>
<tr><td><strong>Severity / Priority</strong></td><td>Level + one sentence justifying it</td></tr>
<tr><td><strong>Fix</strong></td><td>The corrected code</td></tr>
<tr><td><strong>Verification</strong></td><td>Figure 3 — re-scan, issue gone · tests still pass</td></tr>
<tr><td><strong>Status</strong></td><td>Fixed / Open / Won't fix</td></tr>
</tbody>
</table></div></div>
<h3>Screenshot rules</h3>
<ul>
<li>Number every figure and caption it: <em>Figure 4 — SonarQube reporting BUG-02 at LoanService.java:87</em>.</li>
<li>Crop to what matters, but leave enough that the reader can see it is the real tool.</li>
<li>Show the line number in the editor gutter. A screenshot of code with no line numbers proves nothing.</li>
<li>The "after" screenshot must be visibly the <strong>same screen</strong> as the "before" — same tool, same view, issue now absent.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>What loses marks.</strong> Submitting code smells as bugs. Copying the tool's description as your own analysis. "Severity: Critical" with no reason given. A fix that suppresses the warning (<code>// NOSONAR</code>, deleting the test) instead of correcting the behaviour. Two students reporting the same defect. No test run after the fix, so nothing proves the fix did not break something else.</div>
<h3>Before you submit</h3>
<ul>
<li>☐ Every member has exactly 3 defects, none duplicated across members</li>
<li>☐ Every defect has all four required items plus the extra fields</li>
<li>☐ Every figure is numbered, captioned and referenced in the text</li>
<li>☐ <code>mvn test</code> passes after all fixes, and the output is included</li>
<li>☐ Error / defect / failure used correctly throughout</li>
<li>☐ Each defect names its test level</li>
<li>☐ Work-assignment table filled in and signed off by the team</li>
<li>☐ The repository is clean — no build output, no stray files committed</li>
</ul>
<p class="meo">🧠 Write the conclusion last, and make it say something. "We found 12 defects, 9 of which were invisible to the tool and required reading the specification" is a real finding. "We learned a lot about testing" is not.</p>`,

`<span class="eyebrow">Lab 2.5 · Bài 5 · Sản phẩm nộp</span>
<h2>Bố cục đầy đủ</h2>
<pre><code>TRANG BÌA      Project · SWT301 · lớp · giảng viên · nhóm · thành viên (MSSV, vai trò)
MỤC LỤC
BẢNG PHÂN CÔNG      ai làm module nào, tìm defect nào, ai viết phần nào

I.  INTRODUCTION — PROJECT
    1.1  Mục đích và phạm vi      1.2  Kiến trúc và công nghệ
    1.3  Các module chính         1.4  Vì sao project này đáng kiểm thử

II. INTRODUCTION — TOOL
    2.1  Công cụ là gì            2.2  Tĩnh hay động, và vì sao
    2.3  Cài đặt và thiết lập     2.4  Cách chạy
    2.5  Tìm được gì và không tìm được gì

III. MÔI TRƯỜNG KIỂM THỬ
     Hệ điều hành · JDK · cơ sở dữ liệu · Maven · phiên bản công cụ

IV. FIND DEFECT
    4.1  Sinh viên A — 3 defect   4.2  Sinh viên B — 3 defect   …

V.  KẾT LUẬN
    5.1  Bảng tổng hợp defect theo severity
    5.2  Bài học rút ra           5.3  Nếu làm tiếp thì làm gì

TÀI LIỆU THAM KHẢO</code></pre>
<h3>Mẫu cho một defect — chép nguyên khối này</h3>
<div class="callout"><strong>BUG-xx · &lt;tên ngắn nói rõ sai cái gì&gt;</strong>
<div class="table-wrap"><table>
<tbody>
<tr><td><strong>Tìm ra bởi</strong></td><td>Tên và phiên bản công cụ, đúng lệnh hoặc màn hình đã dùng</td></tr>
<tr><td><strong>Cấp kiểm thử</strong></td><td>Component / Integration / System / Acceptance</td></tr>
<tr><td><strong>Vị trí</strong></td><td><code>duong/dan/File.java</code>, dòng N</td></tr>
<tr><td><strong>Các bước tái hiện</strong></td><td>1 · … 2 · … 3 · …</td></tr>
<tr><td><strong>Kết quả mong đợi</strong></td><td>Lẽ ra phải xảy ra gì</td></tr>
<tr><td><strong>Kết quả thực tế</strong></td><td>Thực tế xảy ra gì</td></tr>
<tr><td><strong>Minh chứng</strong></td><td>Hình 1 — công cụ báo lỗi · Hình 2 — dòng code lỗi</td></tr>
<tr><td><strong>Nguyên nhân gốc</strong></td><td>Vì sao code sai — phần lập luận, không phải chép lại mô tả</td></tr>
<tr><td><strong>Severity / Priority</strong></td><td>Mức + một câu giải thích vì sao chọn mức đó</td></tr>
<tr><td><strong>Cách sửa</strong></td><td>Code đã sửa</td></tr>
<tr><td><strong>Kiểm chứng</strong></td><td>Hình 3 — quét lại, issue đã biến mất · test vẫn xanh</td></tr>
<tr><td><strong>Trạng thái</strong></td><td>Đã sửa / Còn mở / Không sửa</td></tr>
</tbody>
</table></div></div>
<h3>Quy tắc chụp ảnh minh chứng</h3>
<ul>
<li>Đánh số và chú thích mọi hình: <em>Hình 4 — SonarQube báo BUG-02 tại LoanService.java:87</em>.</li>
<li>Cắt gọn vào phần cần thiết, nhưng chừa đủ để người đọc thấy đây là công cụ thật.</li>
<li>Phải thấy số dòng ở lề trình soạn thảo. Ảnh code không có số dòng thì không chứng minh được gì.</li>
<li>Ảnh "sau khi sửa" phải nhìn ra ngay là <strong>cùng một màn hình</strong> với ảnh "trước khi sửa" — cùng công cụ, cùng khung nhìn, chỉ khác là issue đã biến mất.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Những thứ làm mất điểm.</strong> Nộp code smell mà gọi là bug. Chép mô tả của công cụ rồi coi đó là phần phân tích của mình. Ghi "Severity: Critical" mà không nêu lý do. Sửa bằng cách bịt cảnh báo (<code>// NOSONAR</code>, xoá test) thay vì sửa hành vi sai. Hai bạn trong nhóm báo trùng một defect. Sửa xong không chạy lại test, nên không có gì chứng minh bản sửa không làm hỏng chỗ khác.</div>
<h3>Trước khi nộp</h3>
<ul>
<li>☐ Mỗi thành viên có đúng 3 defect, không ai trùng ai</li>
<li>☐ Mỗi defect có đủ bốn mục bắt buộc cộng các trường bổ sung</li>
<li>☐ Mọi hình đều được đánh số, chú thích và được nhắc tới trong phần chữ</li>
<li>☐ <code>mvn test</code> chạy xanh sau khi sửa hết, và có kèm ảnh kết quả</li>
<li>☐ Dùng đúng ba chữ error / defect / failure xuyên suốt</li>
<li>☐ Mỗi defect đều gọi tên cấp kiểm thử của nó</li>
<li>☐ Bảng phân công đã điền và cả nhóm đã xác nhận</li>
<li>☐ Kho mã sạch — không commit thư mục build, không có file rác</li>
</ul>
<p class="meo">🧠 Viết phần kết luận sau cùng, và phải nói được điều gì đó. "Chúng tôi tìm được 12 defect, trong đó 9 cái công cụ không thấy mà phải đọc đặc tả mới ra" là một phát hiện thật. "Chúng em học được nhiều điều về kiểm thử" thì không.</p>`),
  ].join('\n'),
};

/* ═══════════════════════════════════════════════════════════════════════════
   Quiz
   ═══════════════════════════════════════════════════════════════════════════ */
const QUIZ = {
  title: 'Quiz Lab 2.5 — Project, tool and defect report|||Quiz Lab 2.5 — Project, công cụ và báo cáo defect',
  slug: 'swt301-lab25-quiz',
  type: 'QUIZ',
  description: '10 câu kiểm tra Lab 2.5: error/defect/failure, tĩnh và động, phân loại issue của SonarQube, severity và priority, cấp kiểm thử, và yêu cầu của bản báo cáo.',
  quiz: {
    timeLimitSeconds: 600,
    questions: [
      q('A developer forgets a null check. The missing check itself is a…|||Lập trình viên quên kiểm tra null. Bản thân chỗ thiếu kiểm tra đó là một…',
        ['error', 'defect', 'failure', 'root cause'], 1,
        'The human mistake is the error; the missing check sitting in the code is the defect; the NullPointerException seen at run time is the failure.|||Sai sót của con người là error; chỗ thiếu kiểm tra nằm trong code là defect; NullPointerException nhìn thấy lúc chạy là failure.'),
      q('Which tool finds defects WITHOUT executing the program?|||Công cụ nào tìm defect mà KHÔNG chạy chương trình?',
        ['JUnit', 'Postman', 'SonarQube', 'Selenium'], 2,
        'SonarQube reads and analyses the source, which is static testing. JUnit, Postman and Selenium all run the software, so they are dynamic testing.|||SonarQube đọc và phân tích mã nguồn, đó là kiểm thử tĩnh. JUnit, Postman và Selenium đều chạy phần mềm nên là kiểm thử động.'),
      q('SonarQube reports "this method is 120 lines long". For the assignment this is…|||SonarQube báo "hàm này dài 120 dòng". Với đề bài này, đó là…',
        ['a Bug worth reporting|||một Bug đáng báo cáo', 'a Code Smell — weak material for a defect report|||một Code Smell — chất liệu yếu cho báo cáo defect', 'a Vulnerability|||một Vulnerability', 'a failure|||một failure'], 1,
        'A long method is a Code Smell: the code is ugly but still computes the right answer. The assignment asks for defects, so take Bugs and Vulnerabilities, which describe behaviour that is actually wrong.|||Hàm dài là Code Smell: code xấu nhưng vẫn tính ra kết quả đúng. Đề bài hỏi defect, nên hãy lấy Bug và Vulnerability, những thứ mô tả hành vi thật sự sai.'),
      q('A typo in the company name on the home page is best classified as…|||Gõ sai tên công ty ở trang chủ được xếp đúng nhất là…',
        ['Blocker severity, Low priority|||severity Blocker, priority Low', 'Minor severity, possibly High priority|||severity Minor, priority có thể High', 'Critical severity, Critical priority|||severity Critical, priority Critical', 'not a defect at all|||không phải defect'], 1,
        'Severity measures how badly the software breaks — a typo breaks nothing, so Minor. Priority measures how urgently it must be fixed — everyone sees the home page, so it can still be High. The two are independent.|||Severity đo mức hỏng nặng đến đâu — gõ sai chữ không làm hỏng gì, nên Minor. Priority đo mức gấp phải sửa — ai cũng nhìn thấy trang chủ, nên vẫn có thể High. Hai thứ độc lập với nhau.'),
      q('Testing LoanController together with its service and the database is which level?|||Kiểm thử LoanController cùng với service và cơ sở dữ liệu là cấp nào?',
        ['Component testing', 'Integration testing', 'System testing', 'Acceptance testing'], 1,
        'Several parts are exercised together but not the whole application through its real user interface, which is the definition of integration testing. Component testing would isolate one class with mocks.|||Nhiều thành phần chạy cùng nhau nhưng chưa phải toàn bộ ứng dụng qua giao diện người dùng thật — đó là định nghĩa của integration testing. Component testing sẽ tách riêng một class và dùng mock.'),
      q('The specification says the VIP discount is 20%; the code applies 15%. A static analyser will…|||Đặc tả nói giảm giá VIP 20%; code áp dụng 15%. Công cụ phân tích tĩnh sẽ…',
        ['flag it as a Bug|||báo đó là Bug', 'flag it as a Code Smell|||báo đó là Code Smell', 'not flag it — the code is legal and the tool does not know the requirement|||không báo gì — code hợp lệ và công cụ không biết yêu cầu', 'flag it as a Vulnerability|||báo đó là Vulnerability'], 2,
        'A tool matches code against rules and patterns. 15% is a perfectly valid number; only a human holding the specification can see that it contradicts the requirement. This is exactly why the report is written by people.|||Công cụ đối chiếu code với luật và mẫu. 15% là con số hoàn toàn hợp lệ; chỉ người cầm bản đặc tả mới thấy nó trái với yêu cầu. Đây đúng là lý do báo cáo do người viết.'),
      q('Which "fix" would lose marks?|||Cách "sửa" nào sẽ bị trừ điểm?',
        ['Correcting the condition and re-running the tests|||Sửa lại điều kiện rồi chạy lại test', 'Adding // NOSONAR so the warning disappears|||Thêm // NOSONAR cho cảnh báo biến mất', 'Extracting the logic into a method with a guard clause|||Tách logic ra hàm riêng có câu lệnh chặn', 'Adding the missing null check|||Thêm phần kiểm tra null còn thiếu'], 1,
        'Suppressing a warning makes the tool quiet without changing the behaviour, so the defect is still there. Deleting or disabling a failing test is the same mistake.|||Bịt cảnh báo chỉ làm công cụ im lặng chứ không đổi hành vi, nên defect vẫn còn nguyên. Xoá hoặc tắt một test đang đỏ cũng là sai lầm tương tự.'),
      q('Why must you run the test suite again AFTER fixing a defect?|||Vì sao sau khi sửa defect vẫn phải chạy lại bộ test?',
        ['To increase code coverage|||Để tăng coverage', 'To prove the fix works and did not break anything else|||Để chứng minh bản sửa có tác dụng và không làm hỏng chỗ khác', 'Because the tool requires it|||Vì công cụ bắt buộc', 'To generate a new report file|||Để sinh ra file báo cáo mới'], 1,
        'The re-run is the evidence for item 4 of the form. It shows both that the defect is gone and that the change did not introduce a regression elsewhere.|||Lần chạy lại chính là bằng chứng cho mục 4 của form. Nó cho thấy vừa hết defect, vừa không phát sinh lỗi hồi quy ở chỗ khác.'),
      q('Tests carrying @Disabled("Security config issue") should be treated as…|||Những test mang @Disabled("Security config issue") nên được coi là…',
        ['fixed, since nothing fails any more|||đã sửa, vì không còn gì đỏ nữa', 'a strong lead — a defect somebody hid instead of fixing|||một manh mối mạnh — có defect bị giấu đi thay vì được sửa', 'irrelevant to testing|||không liên quan tới kiểm thử', 'a Code Smell only|||chỉ là Code Smell'], 1,
        'A disabled test means a known problem was switched off rather than resolved. The principle "testing shows the presence of defects, not their absence" applies directly: a green suite that skips the hard cases proves nothing.|||Test bị tắt nghĩa là một vấn đề đã biết bị gạt đi chứ chưa được giải quyết. Nguyên tắc "kiểm thử cho thấy sự hiện diện của defect, không chứng minh sự vắng mặt" áp thẳng vào đây: bộ test xanh nhờ bỏ qua các ca khó thì không chứng minh được gì.'),
      q('Which item is NOT one of the four required for every defect in the form?|||Mục nào KHÔNG thuộc bốn mục bắt buộc cho mỗi defect trong form?',
        ['A screenshot of the tool reporting it|||Ảnh công cụ báo lỗi', 'Which tool found it|||Công cụ nào tìm ra', 'The level of the defect|||Mức độ của defect', 'The total cost of fixing it|||Tổng chi phí để sửa'], 3,
        'The form asks for the defect name with evidence images, the tool that found it, the level, and the fix with proof. Cost estimation belongs to test management in Chapter 7, not to this lab.|||Form yêu cầu tên defect kèm ảnh minh chứng, công cụ tìm ra, mức độ, và bản sửa kèm bằng chứng. Ước lượng chi phí thuộc phần quản lý kiểm thử ở Chương 7, không phải bài Lab này.'),
    ],
  },
};

export default {
  title: 'Lab 2.5 — Project + Tool: find defects and write the report|||Lab 2.5 — Project + Tool: tìm defect và viết báo cáo',
  description: 'Bài Lab cuối Chương 2, bắc cầu sang kiểm thử tĩnh: chọn một project thật và một công cụ, mỗi sinh viên tìm 3 defect, sửa và viết báo cáo theo form của giảng viên. Kèm project mẫu Library Management System (Spring Boot 3.4 + React 18, 112 test JUnit) có link tải trên GitHub, hướng dẫn dựng SonarQube bằng Docker, một defect có thật đi trọn vòng từ triệu chứng tới bản sửa đã kiểm chứng, và mẫu báo cáo đầy đủ kèm checklist nộp bài.',
  lessons: [L1, L2, L3, L4, L5, QUIZ],
};
