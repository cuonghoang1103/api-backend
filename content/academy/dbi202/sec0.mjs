/**
 * DBI202 · Mục 0 — giới thiệu môn (DBI_Introduction).
 * Bài 📑 học theo từng slide: dbi1 (DBI_Introduction.pptx, slide 1–5).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/DBI202/gen/gen.mjs từ gen/src/** và gen/sql/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node DBI202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 0.A — 📑 Slide by slide · Course introduction (DBI_Introduction, slides 1–5) ───────── */
const L_dbi1_1 = {
  title: '0.A — 📑 Slide by slide · Course introduction (DBI_Introduction, slides 1–5)|||0.A — 📑 Học theo từng slide · Giới thiệu môn học (DBI_Introduction, slide 1–5)',
  slug: 'dbi202-slide-dbi1-1',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Giảng 5 slide mở đầu của DBI202: tên môn, 7 mục tiêu (khớp 7 CLO của syllabus), mục lục 8 chương của trường đối chiếu với 8 chương trên web (số chương khác nhau), giáo trình Ullman và cách tính điểm — kèm ví dụ tính điểm cho thấy vì sao FE dưới 4 là trượt dù trung bình trên 5.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.A · DBI_Introduction, slides 1–5</span>
<h2>The first five slides of DBI202 — what the course is and how it is graded</h2>
<p class="lead">This is the deck your lecturer shows in session 1. It is short, but two slides matter for the whole semester: slide 3, whose chapter numbers are <strong>not</strong> the chapter numbers of this website, and slide 5, whose completion rule makes some students fail with an average above 5.</p>
<div class="callout"><strong>Read this first.</strong> On this site every chapter starts with a lesson "📑 Slide by slide" that walks through the school's deck slide by slide. Because the school orders the chapters differently, the lesson title always says which school chapter it covers — for example lesson 3.A says "slides of the school's Chapter 4".</div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.A · DBI_Introduction, slide 1–5</span>
<h2>Năm slide đầu tiên của DBI202 — môn học là gì và chấm điểm ra sao</h2>
<p class="lead">Đây là bộ slide thầy/cô chiếu ở buổi 1. Nó ngắn, nhưng có hai slide quan trọng cho cả học kỳ: slide 3, vì số chương trong đó <strong>không</strong> trùng với số chương trên trang web này, và slide 5, vì điều kiện hoàn thành (completion criteria) ở đó làm không ít bạn trượt dù điểm trung bình trên 5.</p>
<div class="callout"><strong>Đọc trước.</strong> Trên trang này, mỗi chương mở đầu bằng một bài "📑 Học theo từng slide" đi qua bộ slide của trường từng trang một. Vì trường xếp chương theo thứ tự khác, tiêu đề bài luôn ghi rõ nó giảng chương nào của trường — ví dụ bài 3.A ghi "slide Chapter 4 của trường".</div>`),
    walkHead('dbi1', 1, 5),
    walk('dbi1', [
      [1, 'Course: Introduction to Database System (DBI202)',
        `<p class="y-chinh">🎯 DBI202 — Introduction to Database Systems: how to design, build and query a relational database, practised on Microsoft SQL Server.</p>
<p>The course code reads <strong>DB</strong> (database) <strong>I</strong> (introduction) 202. It has 3 credits and 60 sessions. Almost every later course that stores data — PRJ301 (Java web), SWP391 (project), SWD392 — assumes you can design tables and write SQL fluently, so treat it as a foundation, not a box to tick.</p>
<p><strong>Never heard these words?</strong> A <em>database</em> is an organised store of related data kept for a long time — every student's marks at FPTU, every account of a bank. A <em>DBMS</em> (database management system) is the software that keeps it safe and answers questions about it — here Microsoft SQL Server. <em>SQL</em> is the language you use to talk to it: <code>SELECT FullName FROM Student WHERE Class = 'SE1901'</code> means "give me the names of the students of class SE1901".</p>
<p class="meo">🧠 <strong>Remember:</strong> 60% of the grade (assignment 20% + labs 10% + PE 30%) is writing SQL on a computer — practise with your hands from week 1.</p>`,
        `<p class="y-chinh">🎯 DBI202 — Nhập môn các hệ cơ sở dữ liệu: cách thiết kế, dựng và truy vấn một cơ sở dữ liệu (CSDL) quan hệ, thực hành trên Microsoft SQL Server.</p>
<p>Mã môn đọc là <strong>DB</strong> (database — cơ sở dữ liệu) <strong>I</strong> (introduction — nhập môn) 202. Môn có 3 tín chỉ, 60 buổi. Hầu hết các môn sau có lưu dữ liệu — PRJ301 (web Java), SWP391 (đồ án), SWD392 — đều coi như bạn đã thiết kế bảng và viết SQL thành thạo, nên hãy coi đây là môn nền, không phải môn "qua cho xong".</p>
<p><strong>Chưa từng nghe các từ này?</strong> <em>Cơ sở dữ liệu (database — CSDL)</em> là một kho dữ liệu có liên quan với nhau, được sắp xếp và giữ lâu dài — điểm của mọi sinh viên FPTU, mọi tài khoản của một ngân hàng. <em>Hệ quản trị CSDL (DBMS — database management system)</em> là phần mềm giữ kho đó an toàn và trả lời các câu hỏi về nó — ở môn này là Microsoft SQL Server. <em>SQL</em> là ngôn ngữ để nói chuyện với nó: <code>SELECT FullName FROM Student WHERE Class = 'SE1901'</code> nghĩa là "cho tôi tên các sinh viên lớp SE1901".</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> 60% điểm (assignment 20% + lab 10% + PE 30%) là ngồi máy viết SQL — tập bằng tay ngay từ tuần 1.</p>`],
      [2, 'Course objectives',
        `<p class="y-chinh">🎯 Seven objectives — they are exactly the seven CLOs (course learning outcomes) of the syllabus, and each one is tested somewhere.</p>
<table>
<thead><tr><th>CLO</th><th>Objective on the slide</th><th>Where on this site</th><th>Tested in</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>Database concepts and DBMS software</td><td>Chapter 1</td><td>FE, PT</td></tr>
<tr><td>CLO2</td><td>Relational model and algebraic query language</td><td>Chapter 2</td><td>FE, PT</td></tr>
<tr><td>CLO3</td><td>Normalization (FD, keys, 1NF → BCNF)</td><td>Chapter 4</td><td>FE, PT</td></tr>
<tr><td>CLO4</td><td>Model requirements with ER diagrams, derive the schema</td><td>Chapter 3</td><td>Assignment, PE question 1, FE</td></tr>
<tr><td>CLO5</td><td>SQL: DDL and DML</td><td>Chapters 5–6</td><td>PE, labs, FE</td></tr>
<tr><td>CLO6</td><td>Views, cursors, stored procedures, functions, triggers</td><td>Chapter 7</td><td>PE, labs</td></tr>
<tr><td>CLO7</td><td>Indexes and query optimization</td><td>Chapter 8</td><td>FE, labs</td></tr>
</tbody>
</table>
<p>The slide writes "PL/SQL", which is Oracle's name; in this course the language is <strong>T-SQL</strong> (Transact-SQL), SQL Server's version.</p>`,
        `<p class="y-chinh">🎯 Bảy mục tiêu — chính là bảy CLO (course learning outcome — chuẩn đầu ra môn học) trong syllabus, và mục tiêu nào cũng được kiểm ở đâu đó.</p>
<table>
<thead><tr><th>CLO</th><th>Mục tiêu trên slide</th><th>Học ở đâu trên web</th><th>Bị kiểm ở</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>Khái niệm CSDL và phần mềm hệ quản trị CSDL (DBMS)</td><td>Chương 1</td><td>FE, PT</td></tr>
<tr><td>CLO2</td><td>Mô hình quan hệ và ngôn ngữ truy vấn đại số</td><td>Chương 2</td><td>FE, PT</td></tr>
<tr><td>CLO3</td><td>Chuẩn hoá (phụ thuộc hàm, khoá, 1NF → BCNF)</td><td>Chương 4</td><td>FE, PT</td></tr>
<tr><td>CLO4</td><td>Mô hình hoá yêu cầu bằng sơ đồ ER, suy ra lược đồ</td><td>Chương 3</td><td>Assignment, câu 1 đề PE, FE</td></tr>
<tr><td>CLO5</td><td>SQL: DDL (định nghĩa dữ liệu) và DML (thao tác dữ liệu)</td><td>Chương 5–6</td><td>PE, lab, FE</td></tr>
<tr><td>CLO6</td><td>View, cursor, stored procedure, function, trigger</td><td>Chương 7</td><td>PE, lab</td></tr>
<tr><td>CLO7</td><td>Chỉ mục (index) và tối ưu truy vấn</td><td>Chương 8</td><td>FE, lab</td></tr>
</tbody>
</table>
<p>Slide ghi "PL/SQL" — đó là tên của Oracle; trong môn này ngôn ngữ là <strong>T-SQL</strong> (Transact-SQL), phiên bản SQL của SQL Server.</p>`],
      [3, 'Contents',
        `<p class="y-chinh">🎯 The school's eight chapters — the numbering differs from this website, so keep this table open all semester.</p>
<table>
<thead><tr><th>School chapter (slide 3)</th><th>Deck</th><th>Chapter on this site</th></tr></thead>
<tbody>
<tr><td>1. The Worlds of Database Systems</td><td>Chapter 1</td><td>Chapter 1 — Databases &amp; DBMS</td></tr>
<tr><td>2. The Relational Model of Data</td><td>Chapter 2</td><td>Chapter 2 — Relational model &amp; algebra</td></tr>
<tr><td>3. Design Theory for Relational Databases</td><td>Chapter 3</td><td><strong>Chapter 4</strong> — FD &amp; normalization</td></tr>
<tr><td>4. High-Level Database Models</td><td>Chapter 4</td><td><strong>Chapter 3</strong> — ER modelling</td></tr>
<tr><td>5. Self study (algebra on bags)</td><td>Chapter 5</td><td>Chapter 2 (after the Chapter 2 slides)</td></tr>
<tr><td>6. The Database Language (SQL)</td><td>Chapter 6</td><td>Chapter 5 (slides 1–21) + Chapter 6 (slides 22–82)</td></tr>
<tr><td>7. Practical Issues of database application</td><td>Chapter 7</td><td><strong>Chapter 8</strong> — indexing, transactions, views</td></tr>
<tr><td>8. Constraints and T-SQL Programming</td><td>Chapter 8</td><td><strong>Chapter 7</strong> — triggers, procedures, cursors</td></tr>
</tbody>
</table>
<p>Why the swap? This site teaches ER modelling (how to <em>find</em> the tables) before normalization (how to <em>check</em> them), and T-SQL programming before tuning — the order most textbooks and jobs use. The content is the same; only the numbers move.</p>
<div class="pitfall">When your lecturer says "Chapter 3", open <strong>Chapter 4</strong> here. Every slide lesson repeats its school chapter in its title to avoid this mix-up.</div>`,
        `<p class="y-chinh">🎯 Tám chương của trường — số chương khác với trang web này, nên hãy giữ bảng này cả học kỳ.</p>
<table>
<thead><tr><th>Chương của trường (slide 3)</th><th>Bộ slide</th><th>Chương trên web này</th></tr></thead>
<tbody>
<tr><td>1. The Worlds of Database Systems — thế giới các hệ CSDL</td><td>Chapter 1</td><td>Chương 1 — CSDL &amp; DBMS</td></tr>
<tr><td>2. The Relational Model of Data — mô hình dữ liệu quan hệ</td><td>Chapter 2</td><td>Chương 2 — Mô hình &amp; đại số quan hệ</td></tr>
<tr><td>3. Design Theory — lý thuyết thiết kế CSDL quan hệ</td><td>Chapter 3</td><td><strong>Chương 4</strong> — phụ thuộc hàm &amp; chuẩn hoá</td></tr>
<tr><td>4. High-Level Database Models — mô hình CSDL mức cao</td><td>Chapter 4</td><td><strong>Chương 3</strong> — mô hình ER</td></tr>
<tr><td>5. Self study — tự học (đại số trên bag)</td><td>Chapter 5</td><td>Chương 2 (sau phần slide Chapter 2)</td></tr>
<tr><td>6. The Database Language SQL — ngôn ngữ SQL</td><td>Chapter 6</td><td>Chương 5 (slide 1–21) + Chương 6 (slide 22–82)</td></tr>
<tr><td>7. Practical Issues — vấn đề thực tế của ứng dụng CSDL</td><td>Chapter 7</td><td><strong>Chương 8</strong> — chỉ mục, giao dịch, view</td></tr>
<tr><td>8. Constraints and T-SQL Programming — ràng buộc và lập trình T-SQL</td><td>Chapter 8</td><td><strong>Chương 7</strong> — trigger, procedure, cursor</td></tr>
</tbody>
</table>
<p>Vì sao đổi chỗ? Trang này dạy mô hình ER (cách <em>tìm ra</em> các bảng) trước chuẩn hoá (cách <em>kiểm</em> các bảng), và lập trình T-SQL trước tối ưu — thứ tự mà phần lớn sách và công việc thực tế dùng. Nội dung giống hệt; chỉ số chương thay đổi.</p>
<div class="pitfall">Khi thầy/cô nói "Chapter 3", hãy mở <strong>Chương 4</strong> ở đây. Mỗi bài theo slide đều ghi lại chương của trường ngay trong tiêu đề để bạn khỏi nhầm.</div>`],
      [4, 'Materials',
        `<p class="y-chinh">🎯 One textbook — Ullman &amp; Widom, <em>A First Course in Database Systems</em>, 3rd edition — plus slides, labs and the assignment on LMS.</p>
<p>The slides follow the book closely: most examples (Movies, Stars, Studios, the E/R diagrams of Chapter 4) are copied from it. When a slide is too short, the matching book section explains it in full — every slide lesson here ends with a "📚 Read it in the book" box giving the exact section.</p>
<p>The syllabus also lists two reference books: Ramakrishnan &amp; Gehrke, <em>Database Management Systems</em>, and Chopra, <em>DBMS: A Practical Approach</em>. Labs (5) and the assignment are downloaded from LMS (the FPT learning system).</p>
<p class="meo">🧠 <strong>Remember:</strong> slide = what is tested; book = why it is true. Read the book section when a slide feels like a list of words.</p>`,
        `<p class="y-chinh">🎯 Một giáo trình — Ullman &amp; Widom, <em>A First Course in Database Systems</em>, bản 3 — cộng slide, bài lab và assignment trên LMS.</p>
<p>Slide bám rất sát sách: phần lớn ví dụ (Movies, Stars, Studios, các sơ đồ E/R của Chapter 4) được lấy từ sách. Khi slide quá vắn tắt, mục tương ứng trong sách giải thích đầy đủ — cuối mỗi bài theo slide ở đây có ô "📚 Đọc thêm trong sách" ghi đúng mục cần đọc.</p>
<p>Syllabus còn liệt kê hai sách tham khảo: Ramakrishnan &amp; Gehrke, <em>Database Management Systems</em>, và Chopra, <em>DBMS: A Practical Approach</em>. 5 bài lab và assignment tải về từ LMS (hệ thống học tập của FPT).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> slide = thứ sẽ bị kiểm; sách = vì sao nó đúng. Thấy slide chỉ là một danh sách chữ thì mở mục sách tương ứng.</p>`],
      [5, 'Assessment',
        `<p class="y-chinh">🎯 Five graded parts; you pass only if every on-going part is above 0, the final exam (FE) is at least 4 <strong>and</strong> the weighted total is at least 5.</p>
<table>
<thead><tr><th>Part</th><th>Weight</th><th>Condition</th></tr></thead>
<tbody>
<tr><td>Progress tests (at least 2)</td><td>10%</td><td>&gt; 0</td></tr>
<tr><td>Labs (5)</td><td>10%</td><td>&gt; 0</td></tr>
<tr><td>Assignment (1)</td><td>20%</td><td>&gt; 0</td></tr>
<tr><td>Practical exam — PE (1)</td><td>30%</td><td>&gt; 0</td></tr>
<tr><td>Final exam — FE (60 minutes)</td><td>30%</td><td>≥ 4</td></tr>
<tr><td>Final result</td><td>100%</td><td>≥ 5</td></tr>
</tbody>
</table>
<p class="nhan">Worked example — why an average of 5.75 can still fail</p>
<table>
<thead><tr><th>Part</th><th>Score</th><th>× weight</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Progress tests</td><td>7</td><td>0.1</td><td>0.70</td></tr>
<tr><td>Labs</td><td>8</td><td>0.1</td><td>0.80</td></tr>
<tr><td>Assignment</td><td>7</td><td>0.2</td><td>1.40</td></tr>
<tr><td>PE</td><td>6</td><td>0.3</td><td>1.80</td></tr>
<tr><td>FE</td><td>3.5</td><td>0.3</td><td>1.05</td></tr>
<tr><td>Total</td><td></td><td></td><td><strong>5.75 — but FE 3.5 &lt; 4 ⇒ FAIL</strong></td></tr>
</tbody>
</table>
<div class="pitfall">Two silent killers: a 0 in any single on-going part (missing one lab or a progress test) fails the course by itself, and the FE threshold of 4 cannot be compensated by the other parts. See lesson 0.2 for the syllabus details.</div>`,
        `<p class="y-chinh">🎯 Năm phần có điểm; bạn chỉ qua môn khi mọi phần quá trình đều trên 0, bài thi cuối kỳ (FE) từ 4 trở lên <strong>và</strong> tổng có trọng số từ 5 trở lên.</p>
<table>
<thead><tr><th>Phần</th><th>Trọng số</th><th>Điều kiện</th></tr></thead>
<tbody>
<tr><td>Progress test — kiểm tra tiến độ (ít nhất 2)</td><td>10%</td><td>&gt; 0</td></tr>
<tr><td>Lab (5 bài)</td><td>10%</td><td>&gt; 0</td></tr>
<tr><td>Assignment — bài tập lớn (1)</td><td>20%</td><td>&gt; 0</td></tr>
<tr><td>Practical exam — PE, thi thực hành (1)</td><td>30%</td><td>&gt; 0</td></tr>
<tr><td>Final exam — FE, thi cuối kỳ (60 phút)</td><td>30%</td><td>≥ 4</td></tr>
<tr><td>Tổng kết</td><td>100%</td><td>≥ 5</td></tr>
</tbody>
</table>
<p class="nhan">Ví dụ tính — vì sao trung bình 5,75 vẫn trượt</p>
<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>× trọng số</th><th>Quy ra</th></tr></thead>
<tbody>
<tr><td>Progress test</td><td>7</td><td>0,1</td><td>0,70</td></tr>
<tr><td>Lab</td><td>8</td><td>0,1</td><td>0,80</td></tr>
<tr><td>Assignment</td><td>7</td><td>0,2</td><td>1,40</td></tr>
<tr><td>PE</td><td>6</td><td>0,3</td><td>1,80</td></tr>
<tr><td>FE</td><td>3,5</td><td>0,3</td><td>1,05</td></tr>
<tr><td>Tổng</td><td></td><td></td><td><strong>5,75 — nhưng FE 3,5 &lt; 4 ⇒ TRƯỢT</strong></td></tr>
</tbody>
</table>
<div class="pitfall">Hai "sát thủ thầm lặng": một điểm 0 ở bất kỳ phần quá trình nào (bỏ một bài lab hay một progress test) tự nó đánh trượt môn, và ngưỡng FE 4 điểm không thể bù bằng các phần khác. Chi tiết theo syllabus ở bài 0.2.</div>`],
    ]),
    bi(`<h3>✅ Check yourself in 30 seconds</h3>
<ol>
<li>Your lecturer starts "Chapter 4 — High-Level Database Models". Which chapter of this site do you open?</li>
<li>On-going parts give 4.7 points in total. What is the minimum FE score to pass?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) Chapter 3 — ER modelling (lesson 3.A walks through that deck). (2) 4: the total needs only (5 − 4.7) / 0.3 = 1, but the FE threshold is 4, and 4.7 + 4 × 0.3 = 5.9 ≥ 5.</p>
<p><strong>Next:</strong> lessons 0.1–0.3 below (course map, passing rules, installing SQL Server and SSMS), then Chapter 1.</p>`,
    `<h3>✅ Tự kiểm tra trong 30 giây</h3>
<ol>
<li>Thầy/cô bắt đầu "Chapter 4 — High-Level Database Models". Bạn mở chương nào trên trang này?</li>
<li>Các phần quá trình cộng lại được 4,7 điểm. FE tối thiểu bao nhiêu để qua môn?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) Chương 3 — mô hình ER (bài 3.A giảng bộ slide đó). (2) 4: xét tổng thì chỉ cần (5 − 4,7) / 0,3 = 1, nhưng ngưỡng FE là 4, và 4,7 + 4 × 0,3 = 5,9 ≥ 5.</p>
<p><strong>Học tiếp:</strong> các bài 0.1–0.3 ngay bên dưới (bản đồ môn học, điều kiện qua môn, cài SQL Server và SSMS — SQL Server Management Studio), rồi sang Chương 1.</p>`),
    books([
      ['ullman', 'Preface and Ch.1 The Worlds of Database Systems — the chapter plan of the whole book', 'Lời nói đầu và Chương 1 The Worlds of Database Systems — bố cục cả cuốn sách'],
    ]),
  ].join('\n'),
};

/* ───────── Start here (1/2) — what a database is, why it matters, and how to study this course ───────── */
const L_x_bat_dau_tai_day = {
  title: 'Start here (1/2) — what a database is, why it matters, and how to study this course|||Bắt đầu tại đây (1/2) — Database là gì, vì sao phải học, và học khoá này thế nào',
  slug: 'dbi202-bat-dau-tai-day',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài định hướng trước khi vào slide: dữ liệu khác thông tin thế nào, vì sao Excel không đủ, DBMS là gì, lịch sử ngắn từ Codd 1970 tới SQL Server/PostgreSQL/MySQL hôm nay, ai đang dùng CSDL quanh bạn, vì sao trường dạy SQL Server nhưng đi làm hay gặp PostgreSQL, sự cố GitLab xoá nhầm CSDL production 2017, lộ trình học DBI202 và cách học không nản.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Start here 1/2</span>
<h2>Before the slides: what is a database, and why does an entire course exist about it?</h2>
<p class="lead">You are told "you don't know anything about databases yet" — that is completely normal at this point, and it is exactly who this page is written for. Read this once, slowly, before opening lesson 0.1 (slide by slide). Nothing here is examined directly, but every later lesson assumes you already have these pictures in your head.</p>
<div class="callout"><p><strong>What "chưa biết gì" really means here.</strong> You already use databases every day without seeing them: your Facebook feed, your FPT attendance app, your bank's mobile app, Shopee's product list. A database is simply the thing behind the screen that remembers all of that between the times you close the app and open it again. This course teaches you how that "thing" is actually built.</p></div>`,
    `<span class="eyebrow">Mục 0 · Bắt đầu tại đây 1/2</span>
<h2>Trước khi vào slide: database là gì, và vì sao phải học hẳn một môn về nó?</h2>
<p class="lead">Bạn tự nhận "chưa biết gì về database" — điều đó hoàn toàn bình thường ở thời điểm này, và trang này viết ra đúng cho người như vậy. Đọc một lượt, chậm rãi, trước khi mở bài 0.1 (học theo từng slide). Không có gì ở đây thi trực tiếp, nhưng mọi bài sau đều giả định bạn đã hình dung được những điều này.</p>
<div class="callout"><p><strong>"Chưa biết gì" thật ra nghĩa là gì.</strong> Bạn đã dùng CSDL mỗi ngày mà không thấy nó: news feed Facebook, app điểm danh của FPT, app ngân hàng trên điện thoại, danh sách sản phẩm trên Shopee. Database chỉ đơn giản là thứ đứng sau màn hình, nhớ giúp tất cả những điều đó giữa lúc bạn tắt app và lúc bạn mở lại. Môn này dạy bạn "thứ đó" thật ra được xây dựng như thế nào.</p></div>`),
    bi(`<h2>1. Data vs. information — and why a notebook stops working</h2>
<p><strong>Data</strong> is raw facts with no meaning attached yet: the number <code>85000</code>, the text <code>SE190001</code>. <strong>Information</strong> is data that has been organised and given context so a person can act on it: "student SE190001 owes 85,000 VND in library fines." A database's whole job is to store data in a shape that a program can turn back into information on demand — fast, correctly, and for many people at once.</p>
<p class="nhan">From notebook → to Excel → to a database</p>
<table>
<thead><tr><th>Tool</th><th>What breaks when the class/company grows</th></tr></thead>
<tbody>
<tr><td>A paper notebook (attendance, grades)</td><td>One physical copy — cannot be searched, cannot be used by two people at once, one coffee spill and it is gone</td></tr>
<tr><td>A single Excel file</td><td>"Two people editing at the same time" quietly overwrites one person's changes with the other's, with no warning</td></tr>
<tr><td>Excel, still</td><td>Nothing stops you from typing a student ID that does not exist, or a negative age — Excel does not know the RULES of your data</td></tr>
<tr><td>Excel, still</td><td>The same student's name gets typed three different ways in three different sheets — nobody notices until a report is wrong</td></tr>
<tr><td>A database (DBMS)</td><td>Many people connect and write "at the same time" safely (transactions, lesson 6); rules are enforced by the schema itself (constraints, lesson 3.C); one fact is stored once and referenced everywhere (normalization, Chapter 4)</td></tr>
</tbody>
</table>
<p>Two words you will meet constantly from here on: a <strong>DBMS</strong> (Database Management System) is the software — SQL Server, PostgreSQL, Oracle, MySQL — that stores, protects and serves the data; the <strong>database</strong> is the actual collection of data it is managing. You install a DBMS once; you can create many databases inside it (you will do exactly this in lesson 0.3).</p>`,
    `<h2>1. Dữ liệu khác thông tin — và vì sao cuốn sổ tay bó tay</h2>
<p><strong>Dữ liệu (data)</strong> là sự kiện thô, chưa mang ý nghĩa gì: con số <code>85000</code>, chữ <code>SE190001</code>. <strong>Thông tin (information)</strong> là dữ liệu đã được tổ chức và đặt vào ngữ cảnh để con người dùng được: "sinh viên SE190001 còn nợ thư viện 85.000đ tiền phạt." Việc của database là lưu dữ liệu theo một hình dạng mà chương trình có thể biến ngược lại thành thông tin bất cứ lúc nào — nhanh, đúng, và cho nhiều người cùng lúc.</p>
<p class="nhan">Từ sổ tay → Excel → database</p>
<table>
<thead><tr><th>Công cụ</th><th>Vỡ ở đâu khi lớp/công ty lớn lên</th></tr></thead>
<tbody>
<tr><td>Sổ tay giấy (điểm danh, bảng điểm)</td><td>Chỉ có một bản vật lý — không tìm kiếm được, không dùng cùng lúc được, đổ cà phê là mất hết</td></tr>
<tr><td>Một file Excel</td><td>"Hai người sửa cùng lúc" âm thầm ghi đè thay đổi của người này lên người kia, không hề báo</td></tr>
<tr><td>Excel, vẫn vậy</td><td>Không gì ngăn bạn gõ một mã sinh viên không tồn tại, hay một tuổi âm — Excel không biết LUẬT của dữ liệu bạn</td></tr>
<tr><td>Excel, vẫn vậy</td><td>Cùng một tên sinh viên bị gõ ba kiểu khác nhau ở ba sheet khác nhau — không ai để ý cho tới khi báo cáo sai</td></tr>
<tr><td>Database (DBMS)</td><td>Nhiều người kết nối và ghi "cùng lúc" một cách an toàn (giao dịch — transaction, bài Ch6); luật được chính lược đồ ép buộc (ràng buộc — constraint, bài 3.C); một sự kiện chỉ lưu một lần rồi được tham chiếu khắp nơi (chuẩn hoá — normalization, Chương 4)</td></tr>
</tbody>
</table>
<p>Hai chữ bạn sẽ gặp liên tục từ đây: <strong>DBMS</strong> (Database Management System — hệ quản trị CSDL) là phần mềm — SQL Server, PostgreSQL, Oracle, MySQL — lưu, bảo vệ và phục vụ dữ liệu; <strong>database</strong> (CSDL) là chính tập dữ liệu mà nó đang quản lý. Bạn cài DBMS một lần; bên trong nó bạn tạo được nhiều database (bạn sẽ làm đúng việc này ở bài 0.3).</p>`),
    bi(`<h2>2. A short, dated history — so names stop being random letters</h2>
<table>
<thead><tr><th>Year</th><th>What happened</th></tr></thead>
<tbody>
<tr><td>1970</td><td>Edgar F. Codd (IBM researcher) publishes "A Relational Model of Data for Large Shared Data Banks" — the paper that invents the relational model (tables, keys) this entire course is built on</td></tr>
<tr><td>Mid-1970s</td><td>IBM builds System R to test Codd's ideas; a query language called SEQUEL is designed for it — later renamed SQL for trademark reasons</td></tr>
<tr><td>1979</td><td>Oracle (then Relational Software Inc.) ships the first commercially available SQL database</td></tr>
<tr><td>1989</td><td>The Postgres project starts at UC Berkeley (Michael Stonebraker's team) — the ancestor of today's PostgreSQL; it later adds SQL support and is renamed PostgreSQL in 1996</td></tr>
<tr><td>1989</td><td>Sybase, Microsoft and Ashton-Tate release the first version of what becomes Microsoft SQL Server</td></tr>
<tr><td>1995</td><td>MySQL 1.0 is released — built for speed and simplicity, and becomes the default choice for early web apps (WordPress, early Facebook)</td></tr>
<tr><td>2000s–now</td><td>NoSQL databases (MongoDB, Redis…) appear for special cases the relational model handles less well (huge unstructured data, extreme write speed) — but the relational model, and SQL, are still the default choice for most business systems, including the one you will build for your capstone</td></tr>
</tbody>
</table>
<p class="meo">🧠 One sentence to remember the whole table: <strong>the idea (1970) is far older than any specific product</strong> — Oracle, SQL Server, PostgreSQL and MySQL are four different implementations competing to run Codd's same idea well.</p>`,
    `<h2>2. Lịch sử ngắn, có mốc năm hẳn hoi — để tên không còn là mấy chữ vô nghĩa</h2>
<table>
<thead><tr><th>Năm</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td>1970</td><td>Edgar F. Codd (nhà nghiên cứu của IBM) công bố bài báo "A Relational Model of Data for Large Shared Data Banks" — bài báo phát minh ra mô hình quan hệ (bảng, khoá) mà cả môn học này xây trên đó</td></tr>
<tr><td>Giữa thập niên 1970</td><td>IBM dựng System R để thử ý tưởng của Codd; một ngôn ngữ truy vấn tên SEQUEL được thiết kế cho nó — sau đổi tên thành SQL vì lý do thương hiệu</td></tr>
<tr><td>1979</td><td>Oracle (khi đó tên Relational Software Inc.) tung ra CSDL SQL thương mại đầu tiên</td></tr>
<tr><td>1989</td><td>Dự án Postgres bắt đầu ở UC Berkeley (nhóm của Michael Stonebraker) — tổ tiên của PostgreSQL hôm nay; sau này nó thêm hỗ trợ SQL và đổi tên thành PostgreSQL năm 1996</td></tr>
<tr><td>1989</td><td>Sybase, Microsoft và Ashton-Tate phát hành phiên bản đầu tiên của thứ sau này thành Microsoft SQL Server</td></tr>
<tr><td>1995</td><td>MySQL 1.0 ra mắt — xây cho tốc độ và đơn giản, trở thành lựa chọn mặc định cho web thời kỳ đầu (WordPress, Facebook thuở sơ khai)</td></tr>
<tr><td>2000s–nay</td><td>Các CSDL NoSQL (MongoDB, Redis…) xuất hiện cho những việc mô hình quan hệ làm kém hơn (dữ liệu phi cấu trúc khổng lồ, tốc độ ghi cực nhanh) — nhưng mô hình quan hệ và SQL vẫn là lựa chọn mặc định cho phần lớn hệ thống nghiệp vụ, kể cả hệ thống bạn sẽ xây cho đồ án tốt nghiệp</td></tr>
</tbody>
</table>
<p class="meo">🧠 Một câu nhớ cả bảng: <strong>ý tưởng (1970) già hơn bất kỳ sản phẩm cụ thể nào rất nhiều</strong> — Oracle, SQL Server, PostgreSQL và MySQL là bốn cách triển khai khác nhau, cùng cạnh tranh để chạy tốt đúng ý tưởng của Codd.</p>`),
    bi(`<h2>3. Who is actually running on a database, right now, near you</h2>
<table>
<thead><tr><th>Who</th><th>What the database is quietly doing</th></tr></thead>
<tbody>
<tr><td>A bank (Vietcombank, ACB…)</td><td>Every transfer is one transaction: money must leave your account AND arrive in the other one, together or not at all (ACID, lesson 6.B) — this is the single most-cited real reason the relational model still wins for money</td></tr>
<tr><td>Shopee / Tiki</td><td>Product catalog, stock count, your order history, reviews — all rows in tables, joined together every time you open the app</td></tr>
<tr><td>FPTU's own systems</td><td>FAP (attendance, grades, schedule) is a database application; so is the app you are reading this on — its own content, quiz answers, your progress, are rows in a PostgreSQL database</td></tr>
<tr><td>Any login form you have used</td><td>username/password pairs, sessions — stored, checked and expired via database queries every single time you log in</td></tr>
</tbody>
</table>
<p>Notice the pattern: whenever an app needs to <em>remember something between visits, for many users, safely</em>, there is a database behind it. That is nearly every app that matters.</p>`,
    `<h2>3. Ai đang chạy trên database, ngay lúc này, ngay cạnh bạn</h2>
<table>
<thead><tr><th>Ai</th><th>Database đang âm thầm làm gì</th></tr></thead>
<tbody>
<tr><td>Ngân hàng (Vietcombank, ACB…)</td><td>Mỗi lệnh chuyển tiền là một giao dịch (transaction): tiền phải rời khỏi tài khoản bạn VÀ tới tài khoản kia, cùng lúc hoặc không xảy ra gì cả (ACID, bài 6.B) — đây là lý do thực tế được nhắc tới nhiều nhất khiến mô hình quan hệ vẫn thắng cho tiền bạc</td></tr>
<tr><td>Shopee / Tiki</td><td>Danh mục sản phẩm, số lượng tồn kho, lịch sử đơn hàng của bạn, đánh giá — tất cả là các dòng trong bảng, được nối (join) lại mỗi lần bạn mở app</td></tr>
<tr><td>Hệ thống của chính FPTU</td><td>FAP (điểm danh, điểm số, lịch học) là một ứng dụng database; kể cả trang bạn đang đọc bài này cũng vậy — nội dung, đáp án quiz, tiến độ học của bạn đều là các dòng trong một CSDL PostgreSQL</td></tr>
<tr><td>Bất kỳ form đăng nhập nào bạn từng dùng</td><td>Cặp username/password, phiên đăng nhập — được lưu, kiểm tra và hết hạn qua các câu truy vấn database mỗi lần bạn đăng nhập</td></tr>
</tbody>
</table>
<p>Nhận ra quy luật chưa: hễ một app cần <em>nhớ điều gì đó qua nhiều lần ghé thăm, cho nhiều người dùng, một cách an toàn</em>, phía sau nó là một database. Gần như mọi app quan trọng đều vậy.</p>`),
    bi(`<h2>4. SQL Server vs. PostgreSQL vs. MySQL — why the mismatch between school and work is real</h2>
<p>You already noticed it yourself: connecting to SQL Server through SSMS felt hard, and PostgreSQL typed in a terminal or VS Code felt easier. That feeling is not wrong — it comes from a real difference in how the three products are built and sold.</p>
<table>
<thead><tr><th></th><th>SQL Server</th><th>PostgreSQL</th><th>MySQL</th></tr></thead>
<tbody>
<tr><td>Licence</td><td>Commercial (Microsoft) — Express edition is free with limits</td><td>Fully open-source (no licence cost, ever)</td><td>Open-source, owned by Oracle (has a paid enterprise edition too)</td></tr>
<tr><td>Where FPTU teaches it</td><td>DBI202's whole syllabus (T-SQL, SSMS)</td><td>Not the school's main tool, but you will meet it in your own /courses/postgresql track</td><td>Rare in FPTU's curriculum</td></tr>
<tr><td>Where the industry uses it</td><td>Common in Windows/.NET shops, some banks</td><td>Very common for new projects — Prisma-based Node/TypeScript projects (like this website's own backend), Django, most modern startups</td><td>Very common in PHP/WordPress-era stacks, still huge for web</td></tr>
<tr><td>Tooling to connect</td><td>SSMS (a big Windows desktop app) — many steps: instance name, authentication mode, TCP/IP, firewall (lesson 0.2 walks all of it)</td><td><code>psql</code> in a terminal, or a VS Code extension — a handful of commands, works the same on Mac/Linux/Windows</td><td>MySQL Workbench, or a terminal client — similar simplicity to PostgreSQL</td></tr>
<tr><td>String identifiers</td><td>Double quotes <code>"..."</code> mean a COLUMN/TABLE NAME</td><td>Same: double quotes mean a COLUMN/TABLE NAME</td><td>The backtick character (&#96;...&#96;) means a NAME; double quotes can mean a string (non-standard)</td></tr>
<tr><td>Auto-increment key</td><td><code>IDENTITY(1,1)</code></td><td><code>GENERATED ... AS IDENTITY</code> (or the older <code>SERIAL</code>)</td><td><code>AUTO_INCREMENT</code></td></tr>
<tr><td>"Top N rows"</td><td><code>SELECT TOP 5 ...</code></td><td><code>SELECT ... LIMIT 5</code></td><td><code>SELECT ... LIMIT 5</code></td></tr>
</tbody>
</table>
<p>So why does the syllabus stay on SQL Server if the industry (and this website's own capstone project) leans PostgreSQL? Two honest reasons: (1) the exam is written for SQL Server-specific syntax and SSMS-style tooling, and (2) every idea you learn — tables, keys, joins, normalization, transactions — is <strong>the same idea</strong> in both products; only the exact keyword differs, the way "lorry" and "truck" are the same object in British vs. American English. This is exactly why this course adds a 🐘 PostgreSQL box wherever the syntax differs: you learn the idea once, in T-SQL for the exam, and the PostgreSQL spelling right next to it for your project.</p>`,
    `<h2>4. SQL Server, PostgreSQL, MySQL — vì sao "trường dạy một kiểu, đi làm một kiểu" là có thật</h2>
<p>Bạn đã tự nhận ra rồi: kết nối SQL Server qua SSMS thấy khó, còn PostgreSQL gõ trong terminal hay VS Code thấy dễ hơn. Cảm giác đó không sai — nó đến từ khác biệt thật trong cách ba sản phẩm này được xây và bán.</p>
<table>
<thead><tr><th></th><th>SQL Server</th><th>PostgreSQL</th><th>MySQL</th></tr></thead>
<tbody>
<tr><td>Giấy phép</td><td>Thương mại (Microsoft) — bản Express miễn phí nhưng có giới hạn</td><td>Mã nguồn mở hoàn toàn (không bao giờ tốn phí)</td><td>Mã nguồn mở, thuộc Oracle (cũng có bản doanh nghiệp trả phí)</td></tr>
<tr><td>Nơi FPTU dạy</td><td>Cả syllabus DBI202 (T-SQL, SSMS)</td><td>Không phải công cụ chính của trường, nhưng bạn sẽ gặp ở khoá /courses/postgresql riêng</td><td>Hiếm gặp trong chương trình FPTU</td></tr>
<tr><td>Nơi đi làm dùng</td><td>Phổ biến ở các công ty Windows/.NET, một số ngân hàng</td><td>Rất phổ biến cho dự án mới — các dự án Node/TypeScript dùng Prisma (như chính backend của trang web này), Django, phần lớn startup hiện đại</td><td>Rất phổ biến ở các hệ PHP/WordPress, vẫn rất lớn cho web</td></tr>
<tr><td>Công cụ kết nối</td><td>SSMS (app desktop Windows khá nặng) — nhiều bước: tên instance, kiểu xác thực, TCP/IP, tường lửa (bài 0.2 đi hết từng bước)</td><td><code>psql</code> trong terminal, hoặc extension VS Code — vài lệnh là xong, chạy giống nhau trên Mac/Linux/Windows</td><td>MySQL Workbench, hoặc client dòng lệnh — đơn giản gần giống PostgreSQL</td></tr>
<tr><td>Nháy kép cho tên</td><td><code>"..."</code> nghĩa là TÊN CỘT/BẢNG</td><td>Giống hệt: nháy kép nghĩa là TÊN CỘT/BẢNG</td><td>Dấu backtick (&#96;...&#96;) mới là TÊN; nháy kép có thể hiểu là chuỗi (không chuẩn)</td></tr>
<tr><td>Cột tự tăng</td><td><code>IDENTITY(1,1)</code></td><td><code>GENERATED ... AS IDENTITY</code> (hoặc kiểu cũ <code>SERIAL</code>)</td><td><code>AUTO_INCREMENT</code></td></tr>
<tr><td>Lấy N dòng đầu</td><td><code>SELECT TOP 5 ...</code></td><td><code>SELECT ... LIMIT 5</code></td><td><code>SELECT ... LIMIT 5</code></td></tr>
</tbody>
</table>
<p>Vậy vì sao syllabus vẫn giữ SQL Server trong khi đi làm (và cả đồ án của chính trang web này) nghiêng về PostgreSQL? Hai lý do thật: (1) đề thi viết theo đúng cú pháp SQL Server và công cụ kiểu SSMS, và (2) mọi ý tưởng bạn học — bảng, khoá, join, chuẩn hoá, giao dịch — là <strong>cùng một ý tưởng</strong> ở cả hai sản phẩm; chỉ khác đúng từ khoá, giống như "lorry" và "truck" là cùng một thứ trong tiếng Anh Anh và tiếng Anh Mỹ. Đây chính là lý do khoá này thêm ô 🐘 PostgreSQL ở mọi chỗ cú pháp khác nhau: bạn học ý tưởng một lần, viết T-SQL cho kỳ thi, và cách viết PostgreSQL nằm ngay cạnh cho đồ án của bạn.</p>`),
    bi(`<h2>5. A real incident: what happens when "delete the wrong database" meets "no working backup"</h2>
<div class="callout"><strong>GitLab.com, 31 January 2017 (public post-mortem — GitLab published the whole story themselves).</strong> An engineer investigating replication problems between two PostgreSQL servers ran a directory-removal command meant for the broken replica — but on the terminal connected to the <em>live production</em> database instead. Around 300 GB of production data started disappearing in real time. The team then discovered, one by one, that every one of their five backup/replication methods had been silently failing for a while — so the only usable copy was a manual snapshot taken about six hours earlier. GitLab.com stayed down for about a day while they restored from it, and around six hours of real user data (issues, comments, some repositories, some accounts) was permanently gone.</div>
<p class="pitfall">The lesson is not "GitLab engineers are careless" — it is the opposite: this happened to a team of professionals, at a company whose whole product is about engineering discipline. Two habits from this course exist precisely because of incidents like this: (1) <strong>always know which database/server you are connected to before you run anything destructive</strong> — SSMS shows it in the title bar and the object explorer, get used to checking it; (2) a backup that has never been test-restored is not a backup, it is a guess. You will not build backup systems in DBI202, but every <code>DELETE</code>/<code>UPDATE</code> you write from lesson 0.3 onward should be typed with this story in the back of your mind — always run the matching <code>SELECT ... WHERE ...</code> first to see exactly which rows you are about to touch.</p>`,
    `<h2>5. Một sự cố thật: "xoá nhầm CSDL" gặp "không có bản sao lưu dùng được" thì ra sao</h2>
<div class="callout"><strong>GitLab.com, 31/01/2017 (báo cáo hậu sự cố công khai — chính GitLab tự công bố toàn bộ câu chuyện).</strong> Một kỹ sư đang tìm hiểu sự cố đồng bộ (replication) giữa hai máy chủ PostgreSQL đã chạy lệnh xoá thư mục dữ liệu — vốn định chạy trên máy phụ đang hỏng — nhưng lại chạy trên cửa sổ terminal đang nối vào CSDL <em>production đang sống</em>. Khoảng 300 GB dữ liệu production bắt đầu biến mất ngay trước mắt. Đội ngũ sau đó lần lượt phát hiện cả năm phương án sao lưu/đồng bộ của họ đều đã âm thầm hỏng từ trước — nên bản duy nhất còn dùng được là một bản chụp (snapshot) thủ công lấy khoảng sáu tiếng trước đó. GitLab.com ngừng hoạt động khoảng một ngày trong lúc phục hồi từ bản đó, và khoảng sáu giờ dữ liệu người dùng thật (issue, bình luận, một số repository, một số tài khoản) đã mất vĩnh viễn.</div>
<p class="pitfall">Bài học ở đây không phải "kỹ sư GitLab bất cẩn" — mà ngược lại: chuyện này xảy ra với một đội ngũ chuyên nghiệp, ở một công ty mà sản phẩm chính là kỷ luật kỹ thuật. Hai thói quen của khoá này tồn tại chính vì những sự cố kiểu này: (1) <strong>luôn biết mình đang nối vào database/server nào trước khi chạy bất cứ lệnh phá huỷ nào</strong> — SSMS hiện nó ngay trên thanh tiêu đề và Object Explorer, hãy tập thói quen nhìn trước khi bấm; (2) một bản sao lưu chưa từng được thử phục hồi thì không phải bản sao lưu, chỉ là một lời đoán. DBI202 không dạy bạn dựng hệ thống sao lưu, nhưng mọi câu <code>DELETE</code>/<code>UPDATE</code> bạn viết từ bài 0.3 trở đi nên được gõ với câu chuyện này ở trong đầu — luôn chạy <code>SELECT ... WHERE ...</code> tương ứng trước để thấy đúng những dòng mình sắp đụng vào.</p>`),
    bi(`<h2>6. How this course is organised, and how to study it without burning out</h2>
<table>
<thead><tr><th>Layer</th><th>What it is</th><th>Where</th></tr></thead>
<tbody>
<tr><td>1. 📑 Slide by slide</td><td>Every single slide of the official school deck, explained in plain language with everyday examples, real SQL that actually runs, and step-by-step tables for anything theoretical (functional dependency closures, algebra, ERDs)</td><td>at the top of every chapter</td></tr>
<tr><td>2. 🧪 Practice + 🗂 Glossary + 📌 Summary</td><td>5–8 exam-style exercises per chapter with full worked solutions, a bilingual term list, and a short recap</td><td>end of every chapter</td></tr>
<tr><td>3. ⭐ Deep dives (this page and lesson 3.4 "ERD Workshop")</td><td>Extra pages that exist only on this website — connection troubleshooting, a hands-on first session, a 10-case ERD workshop with a Q&amp;A bank</td><td>Section 0 and Chapter 3</td></tr>
</tbody>
</table>
<p class="nhan">A study order that does not fight the syllabus</p>
<ol>
<li>Read this page and lesson 0.2 (installing/connecting) once, calmly — you do not need to remember every error message, just know this table of pages exists so you can come back to it.</li>
<li>Do lesson 0.3 (first hands-on session) with SSMS/psql actually open, typing every command yourself. This is the single highest-value hour in the whole course — everything after it assumes you can create a table and run <code>SELECT</code>.</li>
<li>Go through each chapter's 📑 slide-by-slide lesson in order; do not skip slides that "look like just a title" — a one-line note there is often exactly what the FE distractor tests.</li>
<li>Finish each chapter with its 🧪 practice page before moving on — the PE (85-minute practical exam) is graded almost entirely on exercises shaped exactly like those.</li>
</ol>
<div class="pitfall">The single biggest reason students find DBI202 "boring, then suddenly impossible" is skipping Chapter 3 (E/R modelling) because "it's just drawing boxes." Every teacher's PE question 1 is an ERD-to-tables problem, and later chapters (SQL joins, normalization) constantly refer back to entities and relationships you were supposed to already recognise. Take the ERD workshop (lesson 3.4) seriously — it is listed as the single most-asked-about topic in class.</div>`,
    `<h2>6. Khoá này tổ chức thế nào, và học sao cho không nản</h2>
<table>
<thead><tr><th>Tầng</th><th>Là gì</th><th>Ở đâu</th></tr></thead>
<tbody>
<tr><td>1. 📑 Học theo từng slide</td><td>Từng slide một của bộ slide chính thức của trường, giảng bằng lời dễ hiểu kèm ví dụ đời thường, câu SQL chạy thật, và bảng làm từng bước cho mọi phần lý thuyết (bao đóng phụ thuộc hàm, đại số, ERD)</td><td>đầu mỗi chương</td></tr>
<tr><td>2. 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt</td><td>5–8 bài tập kiểu đề thi mỗi chương, có lời giải đầy đủ, bảng thuật ngữ song ngữ, tóm tắt ngắn</td><td>cuối mỗi chương</td></tr>
<tr><td>3. ⭐ Bài chuyên sâu (trang này và bài 3.4 "Xưởng ERD")</td><td>Các trang chỉ có trên trang web này — cài đặt/kết nối, buổi thực hành đầu tiên cầm tay chỉ việc, xưởng ERD 10 đề kèm ngân hàng câu hỏi vấn đáp</td><td>Mục 0 và Chương 3</td></tr>
</tbody>
</table>
<p class="nhan">Một thứ tự học không "đánh nhau" với chương trình trường</p>
<ol>
<li>Đọc trang này và bài 0.2 (cài đặt/kết nối) một lượt, thong thả — không cần nhớ hết mọi thông báo lỗi, chỉ cần biết có bảng này để quay lại tra khi cần.</li>
<li>Làm bài 0.3 (buổi thực hành đầu tiên) với SSMS/psql thật sự mở sẵn, tự gõ từng lệnh. Đây là giờ học có giá trị cao nhất trong cả môn — mọi bài sau đều giả định bạn đã tạo được bảng và chạy được <code>SELECT</code>.</li>
<li>Đi hết bài 📑 học theo từng slide của từng chương theo đúng thứ tự; đừng bỏ qua slide "nhìn như chỉ có tiêu đề" — một dòng ghi chú ở đó thường lại chính là chỗ FE gài bẫy.</li>
<li>Kết mỗi chương bằng trang 🧪 thực hành trước khi sang chương khác — đề PE (thi thực hành 85 phút) chấm gần như hoàn toàn theo đúng dạng bài tập đó.</li>
</ol>
<div class="pitfall">Lý do lớn nhất khiến sinh viên thấy DBI202 "buồn ngủ, rồi đột nhiên không hiểu gì" là bỏ qua Chương 3 (mô hình E/R) vì nghĩ "chỉ là vẽ mấy cái hộp." Câu 1 đề PE của mọi giảng viên đều là bài ERD chuyển sang bảng, và các chương sau (join SQL, chuẩn hoá) liên tục nhắc lại thực thể/liên kết mà lẽ ra bạn đã nhận ra từ trước. Học nghiêm túc xưởng ERD (bài 3.4) — đây là chủ đề được hỏi lại nhiều nhất trên lớp theo đúng lời bạn kể.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>data</strong></td><td>dữ liệu</td><td>Raw, unorganised facts such as a number or a name.</td></tr>
<tr><td><strong>information</strong></td><td>thông tin</td><td>Data that has been organised and given context so people can use it.</td></tr>
<tr><td><strong>database (CSDL)</strong></td><td>cơ sở dữ liệu</td><td>An organised, shared collection of data managed by a DBMS.</td></tr>
<tr><td><strong>DBMS</strong></td><td>hệ quản trị cơ sở dữ liệu</td><td>The software (SQL Server, PostgreSQL, MySQL, Oracle) that stores, protects and serves a database.</td></tr>
<tr><td><strong>relational model</strong></td><td>mô hình quan hệ</td><td>Codd's 1970 idea of storing data as tables (relations) made of rows and columns.</td></tr>
<tr><td><strong>SQL</strong></td><td>ngôn ngữ truy vấn có cấu trúc</td><td>Structured Query Language — the language used to create, read, update and delete data in a relational database.</td></tr>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>A group of database operations that must all succeed together or all fail together.</td></tr>
<tr><td><strong>ACID</strong></td><td>bốn tính chất của giao dịch</td><td>Atomicity, Consistency, Isolation, Durability — the four guarantees a transaction gives you.</td></tr>
<tr><td><strong>backup</strong></td><td>bản sao lưu</td><td>A copy of the database kept so it can be restored after data loss — only proven if it has actually been restored once.</td></tr>
<tr><td><strong>constraint</strong></td><td>ràng buộc</td><td>A rule the DBMS enforces automatically, such as "score must be between 0 and 10".</td></tr>
<tr><td><strong>normalization</strong></td><td>chuẩn hoá</td><td>The process of organising tables so each fact is stored exactly once (Chapter 4).</td></tr>
<tr><td><strong>ERD</strong></td><td>sơ đồ thực thể – liên kết</td><td>Entity-Relationship Diagram — the picture used to design a database before writing any table (Chapter 3).</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>data</strong></td><td>dữ liệu</td><td>Sự kiện thô, chưa được tổ chức, như một con số hay một cái tên.</td></tr>
<tr><td><strong>information</strong></td><td>thông tin</td><td>Dữ liệu đã được tổ chức và đặt vào ngữ cảnh để con người dùng được.</td></tr>
<tr><td><strong>database (CSDL)</strong></td><td>cơ sở dữ liệu</td><td>Một tập dữ liệu có tổ chức, dùng chung, được một DBMS quản lý.</td></tr>
<tr><td><strong>DBMS</strong></td><td>hệ quản trị cơ sở dữ liệu</td><td>Phần mềm (SQL Server, PostgreSQL, MySQL, Oracle) lưu trữ, bảo vệ và phục vụ một CSDL.</td></tr>
<tr><td><strong>relational model</strong></td><td>mô hình quan hệ</td><td>Ý tưởng năm 1970 của Codd: lưu dữ liệu dưới dạng bảng (quan hệ) gồm dòng và cột.</td></tr>
<tr><td><strong>SQL</strong></td><td>ngôn ngữ truy vấn có cấu trúc</td><td>Ngôn ngữ dùng để tạo, đọc, sửa, xoá dữ liệu trong một CSDL quan hệ.</td></tr>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>Một nhóm thao tác CSDL phải cùng thành công hoặc cùng thất bại.</td></tr>
<tr><td><strong>ACID</strong></td><td>bốn tính chất của giao dịch</td><td>Atomicity (nguyên tử), Consistency (nhất quán), Isolation (cô lập), Durability (bền vững) — bốn điều một giao dịch đảm bảo.</td></tr>
<tr><td><strong>backup</strong></td><td>bản sao lưu</td><td>Một bản sao của CSDL giữ lại để phục hồi sau khi mất dữ liệu — chỉ đáng tin nếu đã từng được phục hồi thử.</td></tr>
<tr><td><strong>constraint</strong></td><td>ràng buộc</td><td>Một luật DBMS tự ép buộc, ví dụ "điểm phải từ 0 đến 10".</td></tr>
<tr><td><strong>normalization</strong></td><td>chuẩn hoá</td><td>Quá trình tổ chức bảng sao cho mỗi sự kiện chỉ lưu đúng một lần (Chương 4).</td></tr>
<tr><td><strong>ERD</strong></td><td>sơ đồ thực thể – liên kết</td><td>Sơ đồ dùng để thiết kế CSDL trước khi viết bất kỳ bảng nào (Chương 3).</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── Start here (2/2) — installing and connecting to SQL Server and PostgreSQL on Windows and Mac ───────── */
const L_x_cai_dat_ket_noi = {
  title: 'Start here (2/2) — installing and connecting to SQL Server and PostgreSQL on Windows and Mac|||Bắt đầu tại đây (2/2) — Cài đặt và kết nối SQL Server, PostgreSQL trên Windows và Mac, sửa mọi lỗi kết nối',
  slug: 'dbi202-cai-dat-ket-noi',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Từng bước cài SQL Server 2022 + SSMS trên Windows (tên server, Windows/SQL Authentication, mixed mode, TCP/IP, tường lửa, chứng chỉ), cách chạy SQL Server trên Mac bằng Docker, cài PostgreSQL trên cả hai hệ điều hành, bảng hơn 10 lỗi kết nối hay gặp kèm nguyên nhân và cách sửa.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Start here 2/2</span>
<h2>Install once, connect correctly, and stop guessing at error messages</h2>
<p class="lead">This page is a reference, not a race — you do not need to memorise it. Skim it once so you know it exists, install what lesson 0.3 needs, and come back to the error table below the moment SSMS or psql shows you red text.</p>
<div class="callout"><p><strong>What you actually need for this course.</strong> Windows: SQL Server 2022 (Express or Developer edition, both free) + SSMS, plus PostgreSQL for the 🐘 boxes. Mac: SQL Server does not run natively on macOS at all — you run it inside Docker instead (fully explained below) — plus PostgreSQL, which installs natively and easily. Either way, by the end of this page you should be able to run <code>SELECT @@VERSION;</code> in SSMS and <code>SELECT version();</code> in psql and see real text come back.</p></div>`,
    `<span class="eyebrow">Mục 0 · Bắt đầu tại đây 2/2</span>
<h2>Cài một lần, kết nối đúng, và ngừng đoán mò thông báo lỗi</h2>
<p class="lead">Trang này là tài liệu tra cứu, không phải cuộc đua — bạn không cần thuộc lòng nó. Lướt một lượt để biết nó tồn tại, cài đúng thứ bài 0.3 cần, rồi quay lại bảng lỗi bên dưới đúng lúc SSMS hoặc psql hiện chữ đỏ.</p>
<div class="callout"><p><strong>Bạn thật sự cần gì cho môn này.</strong> Windows: SQL Server 2022 (bản Express hoặc Developer, cả hai đều miễn phí) + SSMS, cộng PostgreSQL cho các ô 🐘. Mac: SQL Server hoàn toàn không chạy trực tiếp trên macOS — bạn chạy nó bên trong Docker thay thế (giải thích đầy đủ bên dưới) — cộng PostgreSQL, cài trực tiếp rất dễ. Dù đi đường nào, hết trang này bạn phải chạy được <code>SELECT @@VERSION;</code> trong SSMS và <code>SELECT version();</code> trong psql, và thấy chữ thật hiện ra.</p></div>`),
    bi(`<h2>1. Windows — installing SQL Server 2022 + SSMS, step by step</h2>
<p class="nhan">Step 1 — download and run the installer</p>
<p>Go to Microsoft's SQL Server downloads page and get <strong>SQL Server 2022 Developer edition</strong> (free, full features, for learning/dev only — never use it for a real production system) or <strong>Express edition</strong> (also free, smaller, fine for this course). Run the installer, choose <strong>"Basic"</strong> installation type for the simplest path, accept the licence, and let it install — this takes several minutes and needs about 6 GB free disk space.</p>
<p class="nhan">Step 2 — install SSMS (SQL Server Management Studio) separately</p>
<p>SSMS is <strong>not</strong> bundled with the SQL Server installer any more — the installer's summary screen has a button "Install SSMS" that opens a browser to the separate download. Download and run it; this is a normal Windows desktop app install, next-next-finish, another few minutes.</p>
<p class="nhan">Step 3 — the service that has to be running</p>
<p>SQL Server runs as a Windows <strong>service</strong> called "SQL Server (MSSQLSERVER)" (or "SQL Server (SQLEXPRESS)" for a named instance). Open <code>services.msc</code> (Win+R, type it, Enter) and confirm it says "Running" — if it says "Stopped", right-click → Start. The installer starts it automatically and sets it to auto-start on boot, so this is mainly a step for when it has been stopped for some other reason.</p>
<p class="nhan">Step 4 — what to type as "Server name" when SSMS opens</p>
<table>
<thead><tr><th>You installed as</th><th>Server name to type</th></tr></thead>
<tbody>
<tr><td>Default instance (the "Basic" install usually creates this)</td><td><code>localhost</code> or <code>.</code> or your computer name</td></tr>
<tr><td>A named instance called SQLEXPRESS</td><td><code>localhost\\SQLEXPRESS</code> or <code>.\\SQLEXPRESS</code></td></tr>
<tr><td>LocalDB (a lightweight, per-user mode sometimes installed with Visual Studio)</td><td><code>(localdb)\\MSSQLLocalDB</code></td></tr>
<tr><td>Connecting from another machine on the network</td><td><code>&lt;COMPUTER-NAME&gt;\\SQLEXPRESS</code> (find the name in <code>services.msc</code> → right-click the service → Properties, or in System settings)</td></tr>
</tbody>
</table>
<p class="pitfall">The single most common first-connection mistake: typing just <code>SQLEXPRESS</code> instead of <code>localhost\\SQLEXPRESS</code>. SSMS needs the <em>server</em> name before the backslash and the <em>instance</em> name after it — leaving out "localhost" (or the machine name) makes SSMS look for a server literally named "SQLEXPRESS", which does not exist.</p>
<p class="nhan">Step 5 — authentication: Windows Authentication vs. SQL Server Authentication</p>
<table>
<thead><tr><th>Mode</th><th>What it means</th><th>When you need it</th></tr></thead>
<tbody>
<tr><td>Windows Authentication (default)</td><td>Your Windows login IS your database login — no password typed in SSMS</td><td>Works immediately after a Basic install, on your own machine, logged in as the account that installed SQL Server</td></tr>
<tr><td>SQL Server Authentication</td><td>A separate username/password pair, stored inside SQL Server itself (e.g. the built-in <code>sa</code> account)</td><td>Needed to connect from another machine/tool, or when a course/exam explicitly gives you a username and password (this is what the exam's <code>sa</code> / <code>Dbi202!Pass</code>-style credentials use)</td></tr>
</tbody>
</table>
<p>SQL Server Authentication is <strong>disabled by default</strong> ("Windows Authentication mode" only) — if a course or a tool needs <code>sa</code>, you must switch to <strong>"Mixed Mode"</strong> yourself: in SSMS, right-click the server in Object Explorer → Properties → <strong>Security</strong> page → select "SQL Server and Windows Authentication mode" → OK → then <strong>restart the SQL Server service</strong> (mixed mode only takes effect after a restart). Then right-click Security → Logins → sa → Properties: set a password and, on the "Status" page, make sure "Login" is <strong>Enabled</strong>.</p>
<p class="nhan">Step 6 — enabling TCP/IP (needed for anything that is not SSMS itself, e.g. this course's <code>mssql</code> Node driver, or connecting from another machine)</p>
<p>Open <strong>SQL Server Configuration Manager</strong> (search for it in the Start menu) → "SQL Server Network Configuration" → "Protocols for MSSQLSERVER" (or your instance name) → right-click <strong>TCP/IP</strong> → Enable → OK → then restart the SQL Server service again. By default it listens on port <strong>1433</strong>; if Windows Firewall is on, add an inbound rule allowing TCP 1433 (Windows Defender Firewall → Advanced settings → Inbound Rules → New Rule → Port → TCP → 1433).</p>`,
    `<h2>1. Windows — cài SQL Server 2022 + SSMS, từng bước</h2>
<p class="nhan">Bước 1 — tải và chạy trình cài đặt</p>
<p>Vào trang tải SQL Server của Microsoft, lấy <strong>SQL Server 2022 bản Developer</strong> (miễn phí, đủ tính năng, chỉ dùng để học/phát triển — đừng bao giờ dùng cho hệ thống thật) hoặc <strong>bản Express</strong> (cũng miễn phí, nhẹ hơn, đủ cho môn này). Chạy trình cài, chọn kiểu cài <strong>"Basic"</strong> cho đường đơn giản nhất, đồng ý giấy phép, để nó cài — mất vài phút và cần khoảng 6 GB ổ trống.</p>
<p class="nhan">Bước 2 — cài SSMS (SQL Server Management Studio) riêng</p>
<p>SSMS <strong>không</strong> còn đi kèm trong trình cài SQL Server nữa — màn hình tổng kết của trình cài có nút "Install SSMS" mở trình duyệt tới đường tải riêng. Tải về và chạy; đây là cài app desktop Windows bình thường, next-next-finish, thêm vài phút.</p>
<p class="nhan">Bước 3 — dịch vụ phải đang chạy</p>
<p>SQL Server chạy dưới dạng một <strong>dịch vụ (service)</strong> Windows tên "SQL Server (MSSQLSERVER)" (hoặc "SQL Server (SQLEXPRESS)" nếu cài instance có tên). Mở <code>services.msc</code> (Win+R, gõ, Enter) và kiểm nó ghi "Running" — nếu ghi "Stopped", bấm chuột phải → Start. Trình cài tự khởi động nó và đặt tự chạy khi mở máy, nên bước này chủ yếu cần khi nó bị dừng vì lý do khác.</p>
<p class="nhan">Bước 4 — gõ gì vào ô "Server name" khi mở SSMS</p>
<table>
<thead><tr><th>Bạn cài kiểu</th><th>Gõ vào Server name</th></tr></thead>
<tbody>
<tr><td>Instance mặc định (cài "Basic" thường ra kiểu này)</td><td><code>localhost</code> hoặc <code>.</code> hoặc tên máy</td></tr>
<tr><td>Instance có tên SQLEXPRESS</td><td><code>localhost\\SQLEXPRESS</code> hoặc <code>.\\SQLEXPRESS</code></td></tr>
<tr><td>LocalDB (chế độ nhẹ, theo từng user, đôi khi đi kèm Visual Studio)</td><td><code>(localdb)\\MSSQLLocalDB</code></td></tr>
<tr><td>Kết nối từ máy khác trong mạng</td><td><code>&lt;TÊN-MÁY&gt;\\SQLEXPRESS</code> (tìm tên trong <code>services.msc</code> → chuột phải dịch vụ → Properties, hoặc trong System settings)</td></tr>
</tbody>
</table>
<p class="pitfall">Lỗi kết nối đầu tiên hay gặp nhất: gõ mỗi <code>SQLEXPRESS</code> thay vì <code>localhost\\SQLEXPRESS</code>. SSMS cần tên <em>server</em> trước dấu gạch chéo ngược và tên <em>instance</em> sau nó — bỏ "localhost" (hay tên máy) làm SSMS đi tìm một server tên đúng là "SQLEXPRESS", thứ không tồn tại.</p>
<p class="nhan">Bước 5 — xác thực: Windows Authentication và SQL Server Authentication</p>
<table>
<thead><tr><th>Kiểu</th><th>Nghĩa là gì</th><th>Khi nào cần</th></tr></thead>
<tbody>
<tr><td>Windows Authentication (mặc định)</td><td>Tài khoản Windows của bạn CHÍNH LÀ tài khoản database — không gõ mật khẩu trong SSMS</td><td>Chạy được ngay sau khi cài Basic, trên máy của chính bạn, đăng nhập bằng tài khoản đã cài SQL Server</td></tr>
<tr><td>SQL Server Authentication</td><td>Một cặp username/mật khẩu riêng, lưu ngay trong SQL Server (ví dụ tài khoản có sẵn <code>sa</code>)</td><td>Cần khi kết nối từ máy/công cụ khác, hoặc khi môn học/đề thi đưa thẳng cho bạn một username và mật khẩu (đúng kiểu <code>sa</code> / <code>Dbi202!Pass</code> dùng trong bài thực hành ở đây)</td></tr>
</tbody>
</table>
<p>SQL Server Authentication <strong>bị tắt mặc định</strong> (chỉ có "Windows Authentication mode") — nếu môn học/công cụ cần <code>sa</code>, bạn phải tự chuyển sang <strong>"Mixed Mode"</strong>: trong SSMS, chuột phải vào server ở Object Explorer → Properties → trang <strong>Security</strong> → chọn "SQL Server and Windows Authentication mode" → OK → rồi <strong>khởi động lại dịch vụ SQL Server</strong> (mixed mode chỉ có hiệu lực sau khi khởi động lại). Sau đó chuột phải Security → Logins → sa → Properties: đặt mật khẩu, và ở trang "Status" đảm bảo "Login" đang <strong>Enabled</strong>.</p>
<p class="nhan">Bước 6 — bật TCP/IP (cần cho mọi thứ không phải chính SSMS, ví dụ driver <code>mssql</code> của Node dùng trong môn này, hay kết nối từ máy khác)</p>
<p>Mở <strong>SQL Server Configuration Manager</strong> (tìm trong Start menu) → "SQL Server Network Configuration" → "Protocols for MSSQLSERVER" (hoặc tên instance của bạn) → chuột phải <strong>TCP/IP</strong> → Enable → OK → rồi khởi động lại dịch vụ SQL Server lần nữa. Mặc định nó nghe ở cổng <strong>1433</strong>; nếu Windows Firewall đang bật, thêm luật inbound cho TCP 1433 (Windows Defender Firewall → Advanced settings → Inbound Rules → New Rule → Port → TCP → 1433).</p>`),
    bi(`<h2>2. Certificates, and the one setting that fixes most "can't connect" errors</h2>
<p>Since SQL Server 2022, new connections default to requiring an encrypted channel with a <strong>trusted</strong> certificate. A freshly installed SQL Server uses a self-signed certificate, which your client does not trust yet — so a connection can fail purely on that, even though the username/password and server name are all correct.</p>
<p>In SSMS's "Connect to Server" dialog: click <strong>"Options >>"</strong>, go to the <strong>"Connection Properties"</strong> tab, and either tick <strong>"Trust server certificate"</strong> (fine for local development) or leave it unticked and instead properly install the certificate (not needed for this course). Any tool built on the same driver family (including the <code>mssql</code> Node.js package this website's generator uses) needs the equivalent option, usually named <code>trustServerCertificate</code> or <code>encrypt: false</code> for a purely local, no-real-network connection.</p>`,
    `<h2>2. Chứng chỉ, và một tuỳ chọn sửa được phần lớn lỗi "không kết nối được"</h2>
<p>Từ SQL Server 2022, kết nối mới mặc định yêu cầu kênh mã hoá với chứng chỉ <strong>đáng tin (trusted)</strong>. Một SQL Server mới cài dùng chứng chỉ tự ký (self-signed), mà client của bạn chưa tin — nên kết nối có thể hỏng chỉ vì điều này, dù username/mật khẩu và tên server đều đúng.</p>
<p>Trong hộp thoại "Connect to Server" của SSMS: bấm <strong>"Options >>"</strong>, vào tab <strong>"Connection Properties"</strong>, và hoặc tick <strong>"Trust server certificate"</strong> (đủ dùng cho phát triển cục bộ) hoặc để trống và cài đúng chứng chỉ thật (không cần cho môn này). Mọi công cụ dựng trên cùng họ driver (kể cả gói <code>mssql</code> của Node.js mà generator trang này dùng) cần tuỳ chọn tương đương, thường tên <code>trustServerCertificate</code> hoặc <code>encrypt: false</code> cho kết nối cục bộ thuần, không qua mạng thật.</p>`),
    bi(`<h2>3. Ten-plus connection errors you will actually see — message, cause, fix</h2>
<table>
<thead><tr><th>Error (as SSMS/driver shows it)</th><th>What it really means</th><th>How to fix it</th></tr></thead>
<tbody>
<tr><td>"A network-related or instance-specific error... (provider: Named Pipes Provider, error: 40 — Could not open a connection to SQL Server)"</td><td>The SQL Server service is not running, or the server name is wrong</td><td>Check <code>services.msc</code>; check the exact server\\instance name (step 4 above)</td></tr>
<tr><td>"...(provider: SQL Network Interfaces, error: 26 — Error Locating Server/Instance Specified)"</td><td>SSMS could not even find that instance name on that machine</td><td>Typo in the instance name, or the instance really was not installed — reopen the installer to check what got installed</td></tr>
<tr><td>Login failed for user 'sa'. (Microsoft SQL Server, Error: 18456) — sub-code "State: 8"</td><td>Wrong password for that login</td><td>Retype the password; remember <code>sa</code>'s password was set during Mixed Mode setup, not your Windows password</td></tr>
<tr><td>Login failed for user 'sa'. Error: 18456, State: 1</td><td>Generic failure, real cause hidden for security — usually SQL Server Authentication is not enabled at all (still Windows-only mode)</td><td>Enable Mixed Mode (step 5) and restart the service</td></tr>
<tr><td>Login failed... State: 5</td><td>The account exists but is disabled, or doesn't exist under that exact name</td><td>Logins → sa → Properties → Status → set Enabled; check spelling (it's <code>sa</code>, not <code>SA</code>-with-space or <code>admin</code>)</td></tr>
<tr><td>"...(provider: TCP Provider, error: 0 — No connection could be made because the target machine actively refused it)"</td><td>Something IS listening for network connections, or nothing is — most often TCP/IP is still disabled</td><td>Enable TCP/IP in SQL Server Configuration Manager (step 6), restart the service</td></tr>
<tr><td>"A connection was successfully established... however an error occurred during the login process. (provider: SSL Provider, error: 0 — The certificate chain was issued by an authority that is not trusted.)"</td><td>The self-signed certificate problem from section 2</td><td>Tick "Trust server certificate" in Options → Connection Properties</td></tr>
<tr><td>"Cannot open database "X" requested by the login. The login failed."</td><td>You connected to the SERVER fine, but that specific database does not exist (or the login has no access to it)</td><td>Check the exact database name spelling in Object Explorer; create it if it genuinely does not exist yet (lesson 0.3)</td></tr>
<tr><td>"Invalid object name 'SinhVien'." (Msg 208)</td><td>Connected fine, but the table does not exist — often you are in the wrong database (e.g. still in <code>master</code>)</td><td>Check the database dropdown at the top of the query window; <code>USE &lt;db&gt;;</code> first, or re-run your CREATE TABLE</td></tr>
<tr><td>"String or binary data would be truncated" (older SQL Server) or a specific column name with it (2019+)</td><td>An INSERT/UPDATE value is longer than the column's declared size, e.g. inserting 60 characters into <code>VARCHAR(50)</code></td><td>Widen the column, or shorten the value — the newer, more helpful message names the exact column</td></tr>
<tr><td>Query takes forever / SSMS just spins with "(query executing)"</td><td>Usually a missing <code>WHERE</code>, on a big table, or a lock held by another open transaction you forgot to COMMIT</td><td>Cancel the query (red square); check no other query window has an uncommitted <code>BEGIN TRAN</code> open</td></tr>
</tbody>
</table>`,
    `<h2>3. Hơn 10 lỗi kết nối bạn sẽ thật sự gặp — thông báo, nguyên nhân, cách sửa</h2>
<table>
<thead><tr><th>Lỗi (SSMS/driver hiện đúng như vậy)</th><th>Thật ra nghĩa là gì</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>"A network-related or instance-specific error... (provider: Named Pipes Provider, error: 40 — Could not open a connection to SQL Server)"</td><td>Dịch vụ SQL Server chưa chạy, hoặc tên server sai</td><td>Kiểm <code>services.msc</code>; kiểm đúng tên server\\instance (bước 4 ở trên)</td></tr>
<tr><td>"...(provider: SQL Network Interfaces, error: 26 — Error Locating Server/Instance Specified)"</td><td>SSMS không tìm thấy đúng tên instance đó trên máy này</td><td>Gõ sai tên instance, hoặc thật sự chưa cài — mở lại trình cài để kiểm đã cài gì</td></tr>
<tr><td>Login failed for user 'sa'. (Microsoft SQL Server, Error: 18456) — kèm "State: 8"</td><td>Sai mật khẩu cho login đó</td><td>Gõ lại mật khẩu; nhớ mật khẩu của <code>sa</code> là mật khẩu đặt lúc bật Mixed Mode, không phải mật khẩu Windows</td></tr>
<tr><td>Login failed for user 'sa'. Error: 18456, State: 1</td><td>Lỗi chung chung, nguyên nhân thật bị giấu vì lý do bảo mật — thường là SQL Server Authentication chưa bật (vẫn chỉ Windows-only)</td><td>Bật Mixed Mode (bước 5) rồi khởi động lại dịch vụ</td></tr>
<tr><td>Login failed... State: 5</td><td>Tài khoản có tồn tại nhưng đang bị vô hiệu hoá, hoặc không tồn tại đúng tên đó</td><td>Logins → sa → Properties → Status → đặt Enabled; kiểm chính tả (là <code>sa</code>, không phải <code>SA</code> có khoảng trắng hay <code>admin</code>)</td></tr>
<tr><td>"...(provider: TCP Provider, error: 0 — No connection could be made because the target machine actively refused it)"</td><td>Không có gì đang nghe kết nối mạng ở đó — thường nhất là TCP/IP vẫn đang tắt</td><td>Bật TCP/IP trong SQL Server Configuration Manager (bước 6), khởi động lại dịch vụ</td></tr>
<tr><td>"A connection was successfully established... however an error occurred during the login process. (provider: SSL Provider, error: 0 — The certificate chain was issued by an authority that is not trusted.)"</td><td>Vấn đề chứng chỉ tự ký ở mục 2</td><td>Tick "Trust server certificate" trong Options → Connection Properties</td></tr>
<tr><td>"Cannot open database "X" requested by the login. The login failed."</td><td>Đã nối tới SERVER thành công, nhưng đúng database đó không tồn tại (hoặc login không có quyền vào)</td><td>Kiểm đúng chính tả tên database ở Object Explorer; tạo mới nếu thật sự chưa có (bài 0.3)</td></tr>
<tr><td>"Invalid object name 'SinhVien'." (Msg 208)</td><td>Nối thành công, nhưng bảng không tồn tại — thường vì đang ở sai database (vd vẫn còn ở <code>master</code>)</td><td>Kiểm ô chọn database ở đầu cửa sổ query; <code>USE &lt;db&gt;;</code> trước, hoặc chạy lại CREATE TABLE</td></tr>
<tr><td>"String or binary data would be truncated" (SQL Server cũ hơn) hoặc kèm tên cột cụ thể (2019 trở lên)</td><td>Giá trị INSERT/UPDATE dài hơn kích thước đã khai của cột, ví dụ chèn 60 ký tự vào <code>VARCHAR(50)</code></td><td>Mở rộng cột, hoặc rút ngắn giá trị — thông báo mới hơn, dễ hiểu hơn, ghi thẳng tên cột</td></tr>
<tr><td>Query chạy mãi / SSMS cứ quay "(query executing)"</td><td>Thường vì thiếu <code>WHERE</code> trên bảng lớn, hoặc bị khoá bởi giao dịch khác đang mở mà quên COMMIT</td><td>Huỷ query (ô vuông đỏ); kiểm không cửa sổ query nào khác còn <code>BEGIN TRAN</code> chưa đóng</td></tr>
</tbody>
</table>`),
    bi(`<h2>4. Mac — SQL Server does not run natively; here is what actually works</h2>
<p>macOS is not a supported host OS for SQL Server at all — Microsoft only ships SQL Server for Windows and Linux. On a Mac, you run it <strong>inside Docker</strong>, which packages a small Linux system with SQL Server pre-installed and runs it in an isolated container. This is exactly how this course's own practice database is set up (the ports you already have running — SQL Server on <code>localhost:14330</code>, PostgreSQL on <code>localhost:54330</code> — are Docker containers).</p>
<p class="nhan">Which image, on which chip</p>
<table>
<thead><tr><th>Your Mac</th><th>What to run</th></tr></thead>
<tbody>
<tr><td>Apple Silicon (M1/M2/M3/M4 — arm64)</td><td>Microsoft's official <code>mssql/server</code> image is Linux/x86_64 only and needs Rosetta emulation; in practice, Azure SQL Edge (<code>mcr.microsoft.com/azure-sql-edge</code>) is the image people actually use on Apple Silicon — it speaks the same T-SQL wire protocol and is what this course's own SQL Server container runs on</td></tr>
<tr><td>Intel Mac (x86_64)</td><td>The official <code>mcr.microsoft.com/mssql/server:2022-latest</code> image runs natively, no emulation needed</td></tr>
</tbody>
</table>
<p>Either way, the pattern is the same: install Docker Desktop, then run one <code>docker run</code> command that publishes a port (e.g. <code>-p 14330:1433</code>) and sets an <code>SA_PASSWORD</code>/<code>MSSQL_SA_PASSWORD</code> environment variable, and connect SSMS-equivalent tools to <code>localhost:&lt;that port&gt;</code>. SSMS itself is Windows-only and has no Mac version — on Mac you connect to that same SQL Server with the <strong>"SQL Server (mssql)" extension for VS Code</strong> instead: install VS Code, install the extension from the Extensions panel, then "MS SQL: Connect" and give it server/port/user/password exactly like SSMS's dialog asks for.</p>
<p class="pitfall">Azure Data Studio, which used to be the other cross-platform SQL Server client, is being retired by Microsoft — check its current status before installing it; the VS Code "SQL Server (mssql)" extension is the safer default to reach for today.</p>`,
    `<h2>4. Mac — SQL Server không chạy trực tiếp; đây là cách thật sự dùng được</h2>
<p>macOS hoàn toàn không phải hệ điều hành SQL Server hỗ trợ — Microsoft chỉ phát hành SQL Server cho Windows và Linux. Trên Mac, bạn chạy nó <strong>bên trong Docker</strong>, thứ đóng gói một hệ Linux nhỏ đã cài sẵn SQL Server rồi chạy trong một container cô lập. Đây đúng là cách CSDL luyện tập của môn này được dựng (hai cổng bạn đang chạy sẵn — SQL Server ở <code>localhost:14330</code>, PostgreSQL ở <code>localhost:54330</code> — là các container Docker).</p>
<p class="nhan">Dùng image nào, trên chip nào</p>
<table>
<thead><tr><th>Mac của bạn</th><th>Chạy gì</th></tr></thead>
<tbody>
<tr><td>Apple Silicon (M1/M2/M3/M4 — arm64)</td><td>Image chính thức <code>mssql/server</code> của Microsoft chỉ có bản Linux/x86_64 và cần giả lập Rosetta; trên thực tế Azure SQL Edge (<code>mcr.microsoft.com/azure-sql-edge</code>) mới là image người ta thật sự dùng trên Apple Silicon — nó nói cùng giao thức T-SQL và chính là thứ container SQL Server của môn này đang chạy</td></tr>
<tr><td>Mac Intel (x86_64)</td><td>Image chính thức <code>mcr.microsoft.com/mssql/server:2022-latest</code> chạy trực tiếp, không cần giả lập</td></tr>
</tbody>
</table>
<p>Dù đi đường nào, cách làm giống nhau: cài Docker Desktop, rồi chạy một lệnh <code>docker run</code> mở một cổng (ví dụ <code>-p 14330:1433</code>) và đặt biến môi trường <code>SA_PASSWORD</code>/<code>MSSQL_SA_PASSWORD</code>, rồi nối công cụ tương đương SSMS vào <code>localhost:&lt;cổng đó&gt;</code>. Bản thân SSMS chỉ có cho Windows, không có bản Mac — trên Mac bạn nối vào đúng SQL Server đó bằng <strong>extension "SQL Server (mssql)" của VS Code</strong>: cài VS Code, cài extension từ bảng Extensions, rồi "MS SQL: Connect" và điền server/cổng/user/mật khẩu y hệt hộp thoại SSMS hỏi.</p>
<p class="pitfall">Azure Data Studio, từng là client SQL Server đa nền tảng khác, đang được Microsoft khai tử — kiểm tình trạng hiện tại trước khi cài nó; extension "SQL Server (mssql)" của VS Code là lựa chọn mặc định an toàn hơn để dùng hôm nay.</p>`),
    bi(`<h2>5. PostgreSQL — installing and connecting on both operating systems</h2>
<table>
<thead><tr><th>OS</th><th>How to install</th><th>First connection</th></tr></thead>
<tbody>
<tr><td>Windows</td><td>Download the installer from postgresql.org (EDB's graphical installer bundles the server, pgAdmin and command-line tools) — next-next-finish, it asks you to set a password for the <code>postgres</code> superuser during install, remember it</td><td>Open "SQL Shell (psql)" from the Start menu, press Enter through Server/Database/Port/Username defaults, type the password you set</td></tr>
<tr><td>Mac</td><td>Two easy options: Homebrew (<code>brew install postgresql@16</code>, then <code>brew services start postgresql@16</code>), or Postgres.app (a menu-bar app, drag-and-drop install, click Start)</td><td><code>psql postgres</code> in Terminal — on Mac, the default setup usually needs no password for your own Mac user</td></tr>
<tr><td>Either, via Docker</td><td><code>docker run -p 54330:5432 -e POSTGRES_PASSWORD=... postgres:16</code> (exactly how this course's own PostgreSQL is set up)</td><td>Any client pointed at <code>localhost:54330</code></td></tr>
</tbody>
</table>
<p class="nhan">The handful of <code>psql</code> commands you actually need</p>
<table>
<thead><tr><th>Command</th><th>What it does</th></tr></thead>
<tbody>
<tr><td><code>\\l</code></td><td>list all databases</td></tr>
<tr><td><code>\\c dbname</code></td><td>connect to (switch into) a database — the closest thing to SSMS's database dropdown</td></tr>
<tr><td><code>\\dt</code></td><td>list tables in the current database</td></tr>
<tr><td><code>\\d tablename</code></td><td>describe one table: columns, types, keys — like expanding a table in Object Explorer</td></tr>
<tr><td><code>\\q</code></td><td>quit psql</td></tr>
</tbody>
</table>
<p>For a graphical tool instead of the terminal: <strong>pgAdmin</strong> (installed alongside PostgreSQL on Windows, downloadable separately on Mac) is the closest equivalent to SSMS; <strong>DBeaver</strong> (free, cross-platform) is a popular alternative that also happens to connect to SQL Server, so it is one tool for both engines if you would rather not juggle SSMS and psql. VS Code also has a PostgreSQL extension, matching the mssql one from section 4.</p>`,
    `<h2>5. PostgreSQL — cài và kết nối trên cả hai hệ điều hành</h2>
<table>
<thead><tr><th>Hệ điều hành</th><th>Cài thế nào</th><th>Kết nối lần đầu</th></tr></thead>
<tbody>
<tr><td>Windows</td><td>Tải trình cài từ postgresql.org (trình cài đồ hoạ của EDB gộp sẵn server, pgAdmin và công cụ dòng lệnh) — next-next-finish, nó hỏi đặt mật khẩu cho superuser <code>postgres</code> ngay lúc cài, nhớ lấy nó</td><td>Mở "SQL Shell (psql)" từ Start menu, Enter qua các giá trị mặc định Server/Database/Port/Username, gõ mật khẩu vừa đặt</td></tr>
<tr><td>Mac</td><td>Hai cách dễ: Homebrew (<code>brew install postgresql@16</code>, rồi <code>brew services start postgresql@16</code>), hoặc Postgres.app (app thanh menu, cài kiểu kéo-thả, bấm Start)</td><td><code>psql postgres</code> trong Terminal — trên Mac, cài mặc định thường không cần mật khẩu cho chính user Mac của bạn</td></tr>
<tr><td>Cả hai, qua Docker</td><td><code>docker run -p 54330:5432 -e POSTGRES_PASSWORD=... postgres:16</code> (đúng cách PostgreSQL của môn này được dựng)</td><td>Bất kỳ client nào trỏ vào <code>localhost:54330</code></td></tr>
</tbody>
</table>
<p class="nhan">Vài lệnh <code>psql</code> bạn thật sự cần</p>
<table>
<thead><tr><th>Lệnh</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td><code>\\l</code></td><td>liệt kê mọi database</td></tr>
<tr><td><code>\\c dbname</code></td><td>nối vào (chuyển sang) một database — gần giống ô chọn database của SSMS</td></tr>
<tr><td><code>\\dt</code></td><td>liệt kê bảng trong database hiện tại</td></tr>
<tr><td><code>\\d tablename</code></td><td>mô tả một bảng: cột, kiểu, khoá — giống mở rộng một bảng trong Object Explorer</td></tr>
<tr><td><code>\\q</code></td><td>thoát psql</td></tr>
</tbody>
</table>
<p>Muốn công cụ đồ hoạ thay vì terminal: <strong>pgAdmin</strong> (cài kèm PostgreSQL trên Windows, tải riêng trên Mac) gần giống SSMS nhất; <strong>DBeaver</strong> (miễn phí, đa nền tảng) là lựa chọn phổ biến khác, và nó nối được cả SQL Server, nên là một công cụ cho cả hai engine nếu bạn không muốn dùng lẫn lộn SSMS và psql. VS Code cũng có extension PostgreSQL, tương tự extension mssql ở mục 4.</p>`),
    bi(`<h2>6. "Reaching the server" side by side — why PostgreSQL felt easier</h2>
<table>
<thead><tr><th></th><th>SQL Server (Windows/SSMS)</th><th>PostgreSQL (psql/terminal)</th></tr></thead>
<tbody>
<tr><td>Client is</td><td>A large, separate desktop app you install after the server</td><td>A small command bundled with the server install</td></tr>
<tr><td>Steps to first query</td><td>Install server → install SSMS separately → pick auth mode → maybe enable TCP/IP → maybe trust a certificate → connect</td><td>Install → open a terminal/shell → type the password once</td></tr>
<tr><td>What "server name" looks like</td><td><code>localhost\\SQLEXPRESS</code> (two-part, easy to get wrong)</td><td><code>localhost</code> (one part; the "instance" idea doesn't really exist)</td></tr>
<tr><td>Same tool works on Mac?</td><td>No — SSMS is Windows-only; Mac needs Docker + a different client</td><td>Yes — <code>psql</code>/pgAdmin/Postgres.app all run natively on Mac</td></tr>
</tbody>
</table>
<p>None of this means PostgreSQL is "more powerful" or SQL Server is "worse" — the exam and much of the industry outside web startups still runs on SQL Server, and you need both. It only means PostgreSQL's tooling has fewer moving parts to configure before your first <code>SELECT</code>, which is exactly why this course leans on it for your own hands-on exploration while SSMS stays the tool for exam-format practice.</p>`,
    `<h2>6. "Vào được máy chủ" đặt cạnh nhau — vì sao PostgreSQL thấy dễ hơn</h2>
<table>
<thead><tr><th></th><th>SQL Server (Windows/SSMS)</th><th>PostgreSQL (psql/terminal)</th></tr></thead>
<tbody>
<tr><td>Client là</td><td>Một app desktop riêng, lớn, cài sau server</td><td>Một lệnh nhỏ đi kèm luôn khi cài server</td></tr>
<tr><td>Các bước tới câu query đầu tiên</td><td>Cài server → cài SSMS riêng → chọn kiểu xác thực → có thể phải bật TCP/IP → có thể phải tin chứng chỉ → kết nối</td><td>Cài → mở terminal/shell → gõ mật khẩu một lần</td></tr>
<tr><td>"Tên server" trông thế nào</td><td><code>localhost\\SQLEXPRESS</code> (hai phần, dễ gõ sai)</td><td><code>localhost</code> (một phần; khái niệm "instance" gần như không tồn tại)</td></tr>
<tr><td>Cùng công cụ chạy được trên Mac?</td><td>Không — SSMS chỉ có Windows; Mac phải dùng Docker + client khác</td><td>Có — <code>psql</code>/pgAdmin/Postgres.app đều chạy trực tiếp trên Mac</td></tr>
</tbody>
</table>
<p>Điều này không có nghĩa PostgreSQL "mạnh hơn" hay SQL Server "kém hơn" — đề thi và phần lớn ngành ngoài giới startup web vẫn chạy SQL Server, và bạn cần cả hai. Nó chỉ có nghĩa công cụ của PostgreSQL có ít bước cấu hình hơn trước câu <code>SELECT</code> đầu tiên, và đó chính xác là lý do khoá này dựa vào nó cho phần bạn tự khám phá, trong khi SSMS vẫn là công cụ luyện đúng định dạng thi.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>instance</strong></td><td>thực thể cài đặt (instance)</td><td>One installed, independently running copy of SQL Server on a machine; a machine can host several, each with its own name.</td></tr>
<tr><td><strong>SSMS</strong></td><td>SQL Server Management Studio</td><td>Microsoft's free graphical client for SQL Server — Windows only.</td></tr>
<tr><td><strong>mixed mode</strong></td><td>chế độ xác thực hỗn hợp</td><td>The setting that allows SQL Server Authentication (username/password) alongside Windows Authentication; off by default.</td></tr>
<tr><td><strong>TCP/IP protocol (SQL Server)</strong></td><td>giao thức mạng TCP/IP</td><td>The network channel SQL Server must have enabled to accept connections from anything other than SSMS on the same machine.</td></tr>
<tr><td><strong>self-signed certificate</strong></td><td>chứng chỉ tự ký</td><td>A certificate SQL Server generates itself at install time; clients don't trust it automatically, causing SSL connection errors unless you tell them to.</td></tr>
<tr><td><strong>container (Docker)</strong></td><td>container</td><td>An isolated, lightweight environment that packages an app (like SQL Server) with everything it needs to run, independent of the host OS.</td></tr>
<tr><td><strong>psql</strong></td><td>psql</td><td>PostgreSQL's official command-line client, installed together with the server.</td></tr>
<tr><td><strong>pgAdmin</strong></td><td>pgAdmin</td><td>PostgreSQL's official graphical client — the closest equivalent to SSMS.</td></tr>
<tr><td><strong>superuser (postgres)</strong></td><td>tài khoản superuser</td><td>PostgreSQL's built-in most-privileged account, similar in role to SQL Server's <code>sa</code>.</td></tr>
<tr><td><strong>port</strong></td><td>cổng</td><td>The network number a service listens on — SQL Server defaults to 1433, PostgreSQL to 5432 (this course's Docker setup maps them to 14330/54330 instead).</td></tr>
<tr><td><strong>connection string</strong></td><td>chuỗi kết nối</td><td>The single line of text (server, port, database, user, password, options) a program uses to reach a database — what SSMS's dialog and psql's prompts are really filling in for you.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>instance</strong></td><td>thực thể cài đặt (instance)</td><td>Một bản cài SQL Server chạy độc lập trên máy; một máy có thể chứa nhiều instance, mỗi cái một tên riêng.</td></tr>
<tr><td><strong>SSMS</strong></td><td>SQL Server Management Studio</td><td>Công cụ đồ hoạ miễn phí của Microsoft để dùng SQL Server — chỉ có bản Windows.</td></tr>
<tr><td><strong>mixed mode</strong></td><td>chế độ xác thực hỗn hợp</td><td>Chế độ cho phép SQL Server Authentication (username/mật khẩu) cùng với Windows Authentication; mặc định đang tắt.</td></tr>
<tr><td><strong>TCP/IP protocol (SQL Server)</strong></td><td>giao thức mạng TCP/IP</td><td>Kênh mạng SQL Server phải bật mới nhận được kết nối từ bất cứ thứ gì khác ngoài SSMS trên cùng máy.</td></tr>
<tr><td><strong>self-signed certificate</strong></td><td>chứng chỉ tự ký</td><td>Chứng chỉ SQL Server tự tạo lúc cài; client không tự tin nó, gây lỗi kết nối SSL trừ khi bạn bảo nó bỏ qua.</td></tr>
<tr><td><strong>container (Docker)</strong></td><td>container</td><td>Môi trường cô lập, nhẹ, đóng gói một ứng dụng (như SQL Server) cùng mọi thứ nó cần để chạy, không phụ thuộc hệ điều hành máy chủ thật.</td></tr>
<tr><td><strong>psql</strong></td><td>psql</td><td>Client dòng lệnh chính thức của PostgreSQL, cài kèm luôn với server.</td></tr>
<tr><td><strong>pgAdmin</strong></td><td>pgAdmin</td><td>Công cụ đồ hoạ chính thức của PostgreSQL — gần giống SSMS nhất.</td></tr>
<tr><td><strong>superuser (postgres)</strong></td><td>tài khoản superuser</td><td>Tài khoản có quyền cao nhất có sẵn của PostgreSQL, vai trò tương tự <code>sa</code> của SQL Server.</td></tr>
<tr><td><strong>port</strong></td><td>cổng</td><td>Số hiệu mạng một dịch vụ lắng nghe — SQL Server mặc định 1433, PostgreSQL mặc định 5432 (Docker của môn này ánh xạ sang 14330/54330).</td></tr>
<tr><td><strong>connection string</strong></td><td>chuỗi kết nối</td><td>Một dòng chữ (server, cổng, database, user, mật khẩu, tuỳ chọn) một chương trình dùng để nối vào database — chính là thứ hộp thoại SSMS và các câu hỏi của psql đang điền giúp bạn.</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── 0.3 — First hands-on session: create, insert, view, update, delete (SQL Server next to PostgreSQL) ───────── */
const L_x_buoi_dau_tien = {
  title: '0.3 — First hands-on session: create, insert, view, update, delete (SQL Server next to PostgreSQL)|||0.3 — Buổi thực hành đầu tiên: tạo database, bảng, thêm–sửa–xoá–xem dữ liệu (SQL Server song song PostgreSQL)',
  slug: 'dbi202-buoi-dau-tien',
  type: 'VIDEO',
  isFreePreview: true,
  description: "Tự tay dựng một CSDL nhỏ \"quản lý lớp học\" từ đầu — CREATE DATABASE, CREATE TABLE (giải từng dòng, kiểu dữ liệu, khoá chính, khoá ngoại), INSERT, SELECT, UPDATE, DELETE, các lỗi hay gặp (quên WHERE, nháy đơn/nháy kép, N'' cho tiếng Việt) — mỗi bước chạy thật trên SQL Server và PostgreSQL đặt cạnh nhau, kết bằng 5 bài tự làm có đáp án.",
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.3 · Hands-on</span>
<h2>Open SSMS (or psql). Really open it. Let's build a tiny database together</h2>
<p class="lead">This is the most important hour of the whole course — everything from Chapter 1 onward assumes you can already do what is on this page. Type every statement yourself as you read; do not just read the results. We will build <strong>QuanLyLop</strong> ("class management"): two tables, <code>Lop</code> (class) and <code>SinhVien</code> (student), just complex enough to need a real key and a real foreign key.</p>
<div class="callout"><p><strong>Why you won't see a literal <code>CREATE DATABASE QuanLyLop;</code> run on this page.</strong> This website's practice sandbox already gives every code example its own private, disposable database automatically, so a <code>CREATE DATABASE</code> statement here would just create an extra, unused database inside that sandbox — confusing rather than useful. The syntax box in step 1 is exactly what you type in SSMS/psql on your own machine; from step 2 onward, everything really does run, live, against a real database, and the tables/rows you see below are the actual output.</p></div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.3 · Thực hành</span>
<h2>Mở SSMS (hoặc psql) lên. Mở thật sự. Cùng dựng một CSDL nhỏ</h2>
<p class="lead">Đây là giờ học quan trọng nhất cả môn — mọi thứ từ Chương 1 trở đi đều giả định bạn đã làm được những gì trên trang này. Tự gõ từng câu lệnh khi đọc; đừng chỉ đọc kết quả. Chúng ta sẽ dựng <strong>QuanLyLop</strong>: hai bảng, <code>Lop</code> và <code>SinhVien</code>, vừa đủ phức tạp để cần một khoá thật và một khoá ngoại thật.</p>
<div class="callout"><p><strong>Vì sao trang này không có một câu <code>CREATE DATABASE QuanLyLop;</code> chạy thật.</strong> Môi trường luyện tập của trang web này đã tự cho mỗi ví dụ mã nguồn một database riêng, dùng xong bỏ — nên một câu <code>CREATE DATABASE</code> ở đây chỉ tạo thêm một database thừa, không dùng vào việc gì, gây rối hơn là có ích. Khối cú pháp ở bước 1 chính xác là thứ bạn gõ trong SSMS/psql trên máy của mình; từ bước 2 trở đi, mọi thứ đều chạy thật, trực tiếp trên một database thật, và các bảng/dòng bạn thấy dưới đây là kết quả thật.</p></div>`),
    bi(`<h2>Step 1 — CREATE DATABASE (syntax — run this on your own machine, not here)</h2>
<p>The very first thing you do in a fresh SQL Server or PostgreSQL is create somewhere to put your tables — a <strong>database</strong> is that container.</p>
<pre><code class="language-sql">-- SQL Server, in SSMS
CREATE DATABASE QuanLyLop;
GO
-- from now on, tell SSMS which database to use: the dropdown at the top of the
-- query window, or:
USE QuanLyLop;
GO</code></pre>
<div class="callout">🐘 <strong>On PostgreSQL</strong>
<pre><code class="language-sql">-- in psql, connected to any existing database (e.g. "postgres")
CREATE DATABASE quanlylop;
-- PostgreSQL cannot "USE" a database mid-session — you switch by
-- reconnecting to it:
\\c quanlylop</code></pre>
That <code>\\c</code> reconnect is the one real structural difference: SQL Server lets one connection jump between databases with <code>USE</code>; PostgreSQL always opens a new connection into the specific database you want. <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">Học tiếp PostgreSQL — bài khoá chính</a>.
</div>
<p class="meo">🧠 Database names in T-SQL are conventionally PascalCase (<code>QuanLyLop</code>); PostgreSQL names are conventionally all lower-case (<code>quanlylop</code>) — PostgreSQL folds unquoted identifiers to lower-case automatically, so mixed-case names silently become confusing later. This course follows that convention throughout: T-SQL examples use PascalCase, PostgreSQL examples use lower_snake_case.</p>`,
    `<h2>Bước 1 — CREATE DATABASE (cú pháp — gõ trên máy của bạn, không chạy ở đây)</h2>
<p>Việc đầu tiên bạn làm trên một SQL Server hay PostgreSQL mới là tạo chỗ để đặt bảng — <strong>database</strong> chính là cái "chỗ" đó.</p>
<pre><code class="language-sql">-- SQL Server, trong SSMS
CREATE DATABASE QuanLyLop;
GO
-- từ giờ, báo cho SSMS biết dùng database nào: ô chọn ở đầu cửa sổ query,
-- hoặc:
USE QuanLyLop;
GO</code></pre>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>
<pre><code class="language-sql">-- trong psql, đang nối vào database bất kỳ có sẵn (vd "postgres")
CREATE DATABASE quanlylop;
-- PostgreSQL không "USE" được một database giữa phiên — bạn chuyển bằng
-- cách nối lại:
\\c quanlylop</code></pre>
Cái <code>\\c</code> nối lại đó là khác biệt cấu trúc thật sự duy nhất: T-SQL cho một kết nối nhảy qua lại giữa các database bằng <code>USE</code>; PostgreSQL luôn mở một kết nối mới vào đúng database bạn muốn. <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">Học tiếp PostgreSQL — bài khoá chính</a>.
</div>
<p class="meo">🧠 Tên database trong T-SQL theo quy ước PascalCase (<code>QuanLyLop</code>); tên trong PostgreSQL theo quy ước chữ thường (<code>quanlylop</code>) — PostgreSQL tự hạ chữ thường mọi tên không có nháy kép, nên tên viết hoa-thường lẫn lộn sẽ âm thầm gây rối sau này. Khoá này giữ đúng quy ước đó xuyên suốt: ví dụ T-SQL viết PascalCase, ví dụ PostgreSQL viết lower_snake_case.</p>`),
    bi(`<h2>Step 2 — CREATE TABLE: two tables, a primary key, a foreign key, a CHECK</h2>
<p>Now the real content of this course starts: describing the <em>shape</em> of your data with a schema, before any data exists. Read every line — this exact pattern (a parent table, a child table referencing it) is the single most common shape on the PE.</p>
<pre><code class="language-sql">CREATE TABLE Lop (                        -- table for "classes"
  maLop   VARCHAR(10)  NOT NULL,          -- class code, max 10 chars
  tenLop  NVARCHAR(50) NOT NULL,          -- Vietnamese name needs NVARCHAR
  CONSTRAINT pk_lop PRIMARY KEY (maLop)   -- maLop identifies a row uniquely
);

CREATE TABLE SinhVien (                                         -- table for students
  maSV     VARCHAR(10)   NOT NULL,                               -- student code
  hoTen    NVARCHAR(50)  NOT NULL,                                -- full name
  ngaySinh DATE          NULL,                                    -- optional
  diemTB   DECIMAL(4,2)  NULL,                                    -- e.g. 8.50
  maLop    VARCHAR(10)   NOT NULL,                                -- foreign key column
  CONSTRAINT pk_sinhvien PRIMARY KEY (maSV),
  CONSTRAINT fk_sinhvien_lop FOREIGN KEY (maLop) REFERENCES Lop(maLop),  -- maLop must exist in Lop
  CONSTRAINT ck_sinhvien_diem CHECK (diemTB IS NULL OR (diemTB &gt;= 0 AND diemTB &lt;= 10))  -- score must be 0 to 10
);</code></pre>
<p class="nhan">Line by line</p>
<table>
<thead><tr><th>Piece</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>maLop VARCHAR(10) NOT NULL</code></td><td>a column named maLop, holding up to 10 ordinary characters, and it may never be empty (NULL)</td></tr>
<tr><td><code>tenLop NVARCHAR(50)</code></td><td>NVARCHAR, not VARCHAR — this column will hold Vietnamese text, which needs Unicode storage (more in step 3's pitfall)</td></tr>
<tr><td><code>CONSTRAINT pk_lop PRIMARY KEY (maLop)</code></td><td>maLop is this table's primary key: it must be unique across every row, and it is what other tables point back to</td></tr>
<tr><td><code>CONSTRAINT fk_sinhvien_lop FOREIGN KEY (maLop) REFERENCES Lop(maLop)</code></td><td>every value written into SinhVien.maLop must already exist as a Lop.maLop — you cannot enrol a student into a class that doesn't exist</td></tr>
<tr><td><code>CONSTRAINT ck_sinhvien_diem CHECK (...)</code></td><td>a rule the database enforces on every INSERT/UPDATE, no application code required: the average score must stay between 0 and 10</td></tr>
</tbody>
</table>
<p>The last query proves the tables are real by asking the database's own catalog about them — this is the SQL-native version of expanding "Tables" in SSMS's Object Explorer.</p>
<table>
<thead><tr><th>tenBang</th><th>soCot</th></tr></thead>
<tbody>
<tr><td>Lop</td><td>2</td></tr>
<tr><td>SinhVien</td><td>5</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> — same shape, three renames: <code>NVARCHAR</code>→<code>TEXT</code> (PostgreSQL's <code>text</code> is UTF-8 already, no Unicode-specific type needed), <code>DECIMAL</code>→<code>NUMERIC</code> (same thing, different customary spelling), and the catalog query becomes <code>pg_tables</code> instead of <code>sys.tables</code>.
<pre><code class="language-sql">CREATE TABLE lop (                        -- table for classes
  malop   VARCHAR(10) NOT NULL,           -- class code
  tenlop  TEXT        NOT NULL,           -- PostgreSQL text is UTF-8 by default, no NVARCHAR needed
  CONSTRAINT pk_lop PRIMARY KEY (malop)
);

CREATE TABLE sinhvien (                                          -- table for students
  masv     VARCHAR(10)   NOT NULL,
  hoten    TEXT          NOT NULL,
  ngaysinh DATE          NULL,
  diemtb   NUMERIC(4,2)  NULL,                                    -- NUMERIC, not DECIMAL by convention
  malop    VARCHAR(10)   NOT NULL,
  CONSTRAINT pk_sinhvien PRIMARY KEY (masv),
  CONSTRAINT fk_sinhvien_lop FOREIGN KEY (malop) REFERENCES lop(malop),
  CONSTRAINT ck_sinhvien_diem CHECK (diemtb IS NULL OR (diemtb &gt;= 0 AND diemtb &lt;= 10))
);</code></pre>
<table>
<thead><tr><th>tenbang</th></tr></thead>
<tbody>
<tr><td>lop</td></tr>
<tr><td>sinhvien</td></tr>
</tbody>
</table>
<a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">Học tiếp PostgreSQL — ràng buộc &amp; ALTER</a>.
</div>`,
    `<h2>Bước 2 — CREATE TABLE: hai bảng, một khoá chính, một khoá ngoại, một CHECK</h2>
<p>Đến nội dung thật sự của môn học: mô tả <em>hình dạng</em> dữ liệu bằng một lược đồ, trước khi có bất kỳ dữ liệu nào. Đọc từng dòng — đúng hình dạng này (bảng cha, bảng con tham chiếu tới nó) là hình dạng gặp nhiều nhất trong đề PE.</p>
<pre><code class="language-sql">CREATE TABLE Lop (                        -- bảng lưu "lớp học"
  maLop   VARCHAR(10)  NOT NULL,          -- mã lớp, tối đa 10 ký tự
  tenLop  NVARCHAR(50) NOT NULL,          -- tên lớp có tiếng Việt phải dùng NVARCHAR
  CONSTRAINT pk_lop PRIMARY KEY (maLop)   -- maLop định danh duy nhất một dòng
);

CREATE TABLE SinhVien (                                         -- bảng "sinh viên"
  maSV     VARCHAR(10)   NOT NULL,                               -- mã sinh viên
  hoTen    NVARCHAR(50)  NOT NULL,                                -- họ tên
  ngaySinh DATE          NULL,                                    -- có thể để trống
  diemTB   DECIMAL(4,2)  NULL,                                    -- ví dụ 8.50
  maLop    VARCHAR(10)   NOT NULL,                                -- cột khoá ngoại
  CONSTRAINT pk_sinhvien PRIMARY KEY (maSV),
  CONSTRAINT fk_sinhvien_lop FOREIGN KEY (maLop) REFERENCES Lop(maLop),  -- maLop phải có sẵn trong bảng Lop
  CONSTRAINT ck_sinhvien_diem CHECK (diemTB IS NULL OR (diemTB &gt;= 0 AND diemTB &lt;= 10))  -- điểm phải từ 0 đến 10
);</code></pre>
<p class="nhan">Đọc từng dòng</p>
<table>
<thead><tr><th>Phần</th><th>Ý nghĩa</th></tr></thead>
<tbody>
<tr><td><code>maLop VARCHAR(10) NOT NULL</code></td><td>một cột tên maLop, chứa tối đa 10 ký tự thường, và không bao giờ được để trống (NULL)</td></tr>
<tr><td><code>tenLop NVARCHAR(50)</code></td><td>NVARCHAR, không phải VARCHAR — cột này chứa chữ tiếng Việt, cần kiểu lưu Unicode (nói kỹ hơn ở bẫy bước 3)</td></tr>
<tr><td><code>CONSTRAINT pk_lop PRIMARY KEY (maLop)</code></td><td>maLop là khoá chính của bảng này: phải khác nhau giữa mọi dòng, và là thứ bảng khác trỏ ngược về</td></tr>
<tr><td><code>CONSTRAINT fk_sinhvien_lop FOREIGN KEY (maLop) REFERENCES Lop(maLop)</code></td><td>mọi giá trị ghi vào SinhVien.maLop phải đã tồn tại sẵn dưới dạng Lop.maLop — bạn không xếp được một sinh viên vào lớp chưa tồn tại</td></tr>
<tr><td><code>CONSTRAINT ck_sinhvien_diem CHECK (...)</code></td><td>một luật database tự ép buộc trên mọi INSERT/UPDATE, không cần code ứng dụng nào: điểm trung bình phải nằm từ 0 đến 10</td></tr>
</tbody>
</table>
<p>Câu truy vấn cuối chứng minh bảng có thật bằng cách hỏi chính bộ danh mục (catalog) của database — đây là bản SQL của việc mở rộng "Tables" trong Object Explorer của SSMS.</p>
<table>
<thead><tr><th>tenBang</th><th>soCot</th></tr></thead>
<tbody>
<tr><td>Lop</td><td>2</td></tr>
<tr><td>SinhVien</td><td>5</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> — cùng hình dạng, đổi ba chỗ: <code>NVARCHAR</code>→<code>TEXT</code> (kiểu <code>text</code> của PostgreSQL đã là UTF-8 sẵn, không cần kiểu riêng cho Unicode), <code>DECIMAL</code>→<code>NUMERIC</code> (cùng một thứ, chỉ khác cách viết quen dùng), và câu hỏi catalog đổi thành <code>pg_tables</code> thay vì <code>sys.tables</code>.
<pre><code class="language-sql">CREATE TABLE lop (                        -- bảng "lớp học"
  malop   VARCHAR(10) NOT NULL,           -- mã lớp
  tenlop  TEXT        NOT NULL,           -- PostgreSQL: text là UTF-8 sẵn, không cần NVARCHAR
  CONSTRAINT pk_lop PRIMARY KEY (malop)
);

CREATE TABLE sinhvien (                                          -- bảng "sinh viên"
  masv     VARCHAR(10)   NOT NULL,
  hoten    TEXT          NOT NULL,
  ngaysinh DATE          NULL,
  diemtb   NUMERIC(4,2)  NULL,                                    -- PostgreSQL quen viết NUMERIC (DECIMAL vẫn hiểu, chỉ là bí danh)
  malop    VARCHAR(10)   NOT NULL,
  CONSTRAINT pk_sinhvien PRIMARY KEY (masv),
  CONSTRAINT fk_sinhvien_lop FOREIGN KEY (malop) REFERENCES lop(malop),
  CONSTRAINT ck_sinhvien_diem CHECK (diemtb IS NULL OR (diemtb &gt;= 0 AND diemtb &lt;= 10))
);</code></pre>
<table>
<thead><tr><th>tenbang</th></tr></thead>
<tbody>
<tr><td>lop</td></tr>
<tr><td>sinhvien</td></tr>
</tbody>
</table>
<a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">Học tiếp PostgreSQL — ràng buộc &amp; ALTER</a>.
</div>`),
    bi(`<h2>Step 3 — INSERT: add data, and the N'' trap</h2>
<pre><code class="language-sql">INSERT INTO Lop (maLop, tenLop) VALUES               -- one INSERT, several rows
  ('SE1801', N'Kỹ thuật phần mềm 1801'),              -- N'' keeps the Vietnamese diacritics
  ('SE1802', N'Kỹ thuật phần mềm 1802');

INSERT INTO SinhVien (maSV, hoTen, ngaySinh, diemTB, maLop) VALUES
  ('SV001', N'Nguyễn Văn Cường', '2004-03-12', 8.50, 'SE1801'),
  ('SV002', N'Trần Thị Hoa',     '2004-07-25', 7.20, 'SE1801'),
  ('SV003', N'Lê Văn Bình',      '2004-01-30', 6.80, 'SE1802'),
  ('SV004', N'Phạm Thị Mai',     '2004-11-02', 9.10, 'SE1802'),
  ('SV005', N'Hoàng Văn Đức',    '2004-05-18', NULL, 'SE1801');   -- NULL: no score yet</code></pre>
<p>Every value list lines up with the column list: <code>('SE1801', N'Kỹ thuật phần mềm 1801')</code> means maLop='SE1801', tenLop=N'...'. The last row's <code>NULL</code> for diemTB is allowed because that column has no <code>NOT NULL</code> — the CHECK constraint from step 2 explicitly allows NULL through (<code>diemTB IS NULL OR ...</code>).</p>
<div class="out">(2 rows affected)<br>
(5 rows affected)</div>
<table>
<thead><tr><th>maSV</th><th>hoTen</th><th>diemTB</th><th>maLop</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>Nguyễn Văn Cường</td><td>8.50</td><td>SE1801</td></tr>
<tr><td>SV002</td><td>Trần Thị Hoa</td><td>7.20</td><td>SE1801</td></tr>
<tr><td>SV003</td><td>Lê Văn Bình</td><td>6.80</td><td>SE1802</td></tr>
<tr><td>SV004</td><td>Phạm Thị Mai</td><td>9.10</td><td>SE1802</td></tr>
<tr><td>SV005</td><td>Hoàng Văn Đức</td><td><em>NULL</em></td><td>SE1801</td></tr>
</tbody>
</table>
<div class="pitfall">Look closely at every Vietnamese string above: it is written <code>N'Nguyễn Văn Cường'</code>, with a capital <strong>N</strong> right before the quote — never plain <code>'Nguyễn Văn Cường'</code>. This is not decoration. Run the experiment below to see exactly what happens if you forget it.</div>
<pre><code class="language-sql">CREATE TABLE ThuNghiem (id INT IDENTITY PRIMARY KEY, ten NVARCHAR(50));  -- test table, column ten is NVARCHAR

INSERT INTO ThuNghiem (ten) VALUES ('Nguyễn Văn Cường');    -- WITHOUT N — the trap
INSERT INTO ThuNghiem (ten) VALUES (N'Nguyễn Văn Cường');   -- WITH N — correct

SELECT id, ten FROM ThuNghiem ORDER BY id;                  -- compare row 1 vs row 2</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>ten</th></tr></thead>
<tbody>
<tr><td>1</td><td>Nguy?n Van Cu?ng</td></tr>
<tr><td>2</td><td>Nguyễn Văn Cường</td></tr>
</tbody>
</table>
<p>Row 1 was inserted <strong>without</strong> the N prefix, row 2 <strong>with</strong> it — same source text, same column, same table. Row 1's diacritics are gone, silently, with no error. This single missing letter is one of the most common ways PE submissions lose marks: the query logic is entirely correct, but the grader's expected Vietnamese text no longer matches what got stored.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> — PostgreSQL has no equivalent trap: a plain <code>text</code> column is UTF-8 by default, so a plain <code>'Nguyễn Văn Cường'</code> (no prefix) is already correct.
<pre><code class="language-sql">CREATE TABLE thunghiem (id SERIAL PRIMARY KEY, ten TEXT);  -- test table, column ten is text

INSERT INTO thunghiem (ten) VALUES ('Nguyễn Văn Cường');   -- plain '' — no N needed, no trap

SELECT id, ten FROM thunghiem ORDER BY id;</code></pre>
<div class="out">INSERT 0 1</div>
<table>
<thead><tr><th>id</th><th>ten</th></tr></thead>
<tbody>
<tr><td>1</td><td>Nguyễn Văn Cường</td></tr>
</tbody>
</table>
<a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">Học tiếp PostgreSQL — kiểu chuỗi văn bản</a>.
</div>`,
    `<h2>Bước 3 — INSERT: thêm dữ liệu, và cái bẫy N''</h2>
<pre><code class="language-sql">INSERT INTO Lop (maLop, tenLop) VALUES               -- một câu INSERT, nhiều dòng
  ('SE1801', N'Kỹ thuật phần mềm 1801'),              -- N'' giữ đúng dấu tiếng Việt
  ('SE1802', N'Kỹ thuật phần mềm 1802');

INSERT INTO SinhVien (maSV, hoTen, ngaySinh, diemTB, maLop) VALUES
  ('SV001', N'Nguyễn Văn Cường', '2004-03-12', 8.50, 'SE1801'),
  ('SV002', N'Trần Thị Hoa',     '2004-07-25', 7.20, 'SE1801'),
  ('SV003', N'Lê Văn Bình',      '2004-01-30', 6.80, 'SE1802'),
  ('SV004', N'Phạm Thị Mai',     '2004-11-02', 9.10, 'SE1802'),
  ('SV005', N'Hoàng Văn Đức',    '2004-05-18', NULL, 'SE1801');   -- NULL: chưa có điểm</code></pre>
<p>Mỗi danh sách giá trị khớp thứ tự với danh sách cột: <code>('SE1801', N'Kỹ thuật phần mềm 1801')</code> nghĩa là maLop='SE1801', tenLop=N'...'. <code>NULL</code> ở dòng cuối cho diemTB được chấp nhận vì cột đó không có <code>NOT NULL</code> — ràng buộc CHECK ở bước 2 cho phép NULL đi qua (<code>diemTB IS NULL OR ...</code>).</p>
<div class="out">(2 rows affected)<br>
(5 rows affected)</div>
<table>
<thead><tr><th>maSV</th><th>hoTen</th><th>diemTB</th><th>maLop</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>Nguyễn Văn Cường</td><td>8.50</td><td>SE1801</td></tr>
<tr><td>SV002</td><td>Trần Thị Hoa</td><td>7.20</td><td>SE1801</td></tr>
<tr><td>SV003</td><td>Lê Văn Bình</td><td>6.80</td><td>SE1802</td></tr>
<tr><td>SV004</td><td>Phạm Thị Mai</td><td>9.10</td><td>SE1802</td></tr>
<tr><td>SV005</td><td>Hoàng Văn Đức</td><td><em>NULL</em></td><td>SE1801</td></tr>
</tbody>
</table>
<div class="pitfall">Nhìn kỹ từng chuỗi tiếng Việt ở trên: nó viết là <code>N'Nguyễn Văn Cường'</code>, có chữ <strong>N</strong> hoa ngay trước dấu nháy — không bao giờ viết trần <code>'Nguyễn Văn Cường'</code>. Đây không phải trang trí. Chạy thí nghiệm dưới đây để thấy đúng chuyện gì xảy ra nếu quên nó.</div>
<pre><code class="language-sql">CREATE TABLE ThuNghiem (id INT IDENTITY PRIMARY KEY, ten NVARCHAR(50));  -- bảng thử nghiệm, cột ten là NVARCHAR

INSERT INTO ThuNghiem (ten) VALUES ('Nguyễn Văn Cường');    -- KHÔNG có N — cái bẫy
INSERT INTO ThuNghiem (ten) VALUES (N'Nguyễn Văn Cường');   -- CÓ N — đúng

SELECT id, ten FROM ThuNghiem ORDER BY id;                  -- so sánh dòng 1 với dòng 2</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>ten</th></tr></thead>
<tbody>
<tr><td>1</td><td>Nguy?n Van Cu?ng</td></tr>
<tr><td>2</td><td>Nguyễn Văn Cường</td></tr>
</tbody>
</table>
<p>Dòng 1 được chèn <strong>không có</strong> tiền tố N, dòng 2 <strong>có</strong> — cùng chữ nguồn, cùng cột, cùng bảng. Dấu tiếng Việt của dòng 1 biến mất, âm thầm, không báo lỗi nào. Một chữ N thiếu này là một trong những cách phổ biến nhất khiến bài PE mất điểm: logic câu lệnh hoàn toàn đúng, nhưng chữ tiếng Việt lưu vào không còn khớp với đáp án của người chấm nữa.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> — PostgreSQL không có bẫy tương đương: một cột <code>text</code> trần đã là UTF-8 mặc định, nên <code>'Nguyễn Văn Cường'</code> trần (không tiền tố) đã đúng sẵn.
<pre><code class="language-sql">CREATE TABLE thunghiem (id SERIAL PRIMARY KEY, ten TEXT);  -- bảng thử nghiệm, cột ten là text

INSERT INTO thunghiem (ten) VALUES ('Nguyễn Văn Cường');   -- chỉ '' — không cần N, không có bẫy

SELECT id, ten FROM thunghiem ORDER BY id;</code></pre>
<div class="out">INSERT 0 1</div>
<table>
<thead><tr><th>id</th><th>ten</th></tr></thead>
<tbody>
<tr><td>1</td><td>Nguyễn Văn Cường</td></tr>
</tbody>
</table>
<a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">Học tiếp PostgreSQL — kiểu chuỗi văn bản</a>.
</div>`),
    bi(`<h2>Step 4 — SELECT: look at data four ways</h2>
<p>From here on we work on a QuanLyLop that is already fully loaded with the 5 students and 2 classes from step 3.</p>
<p class="nhan">Every column, every row</p>
<pre><code class="language-sql">SELECT * FROM SinhVien;                                          -- every column, every row</code></pre>
<p class="nhan">Only the columns you need</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien;                               -- only the columns you need</code></pre>
<p class="nhan">Filter with WHERE</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien WHERE diemTB &gt;= 7;             -- filter rows</code></pre>
<p class="nhan">Sort with ORDER BY — and where NULL lands</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien ORDER BY diemTB DESC;          -- highest score first; NULL sorts last</code></pre>
<table>
<thead><tr><th>maSV</th><th>hoTen</th><th>ngaySinh</th><th>diemTB</th><th>maLop</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>Nguyễn Văn Cường</td><td>2004-03-12</td><td>8.50</td><td>SE1801</td></tr>
<tr><td>SV002</td><td>Trần Thị Hoa</td><td>2004-07-25</td><td>7.20</td><td>SE1801</td></tr>
<tr><td>SV003</td><td>Lê Văn Bình</td><td>2004-01-30</td><td>6.80</td><td>SE1802</td></tr>
<tr><td>SV004</td><td>Phạm Thị Mai</td><td>2004-11-02</td><td>9.10</td><td>SE1802</td></tr>
<tr><td>SV005</td><td>Hoàng Văn Đức</td><td>2004-05-18</td><td><em>NULL</em></td><td>SE1801</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoTen</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Lê Văn Bình</td><td>6.80</td></tr>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
<tr><td>Hoàng Văn Đức</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoTen</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoTen</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Lê Văn Bình</td><td>6.80</td></tr>
<tr><td>Hoàng Văn Đức</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Notice Hoàng Văn Đức (no score yet, NULL) sorts to the very bottom of a <code>DESC</code> (highest-first) order in SQL Server — NULL behaves as the lowest possible value.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> — the query text is identical for the first three, but plain <code>ORDER BY diemtb DESC</code> would put the NULL row <em>first</em> by default (PostgreSQL treats NULL as the largest value unless told otherwise) — so to get the same "NULL last" behaviour you must say so explicitly with <code>NULLS LAST</code>:
<pre><code class="language-sql">SELECT hoten, diemtb FROM sinhvien ORDER BY diemtb DESC NULLS LAST;  -- PostgreSQL default sorts NULL first on DESC — say so explicitly</code></pre>
<table>
<thead><tr><th>masv</th><th>hoten</th><th>ngaysinh</th><th>diemtb</th><th>malop</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>Nguyễn Văn Cường</td><td>2004-03-12</td><td>8.50</td><td>SE1801</td></tr>
<tr><td>SV002</td><td>Trần Thị Hoa</td><td>2004-07-25</td><td>7.20</td><td>SE1801</td></tr>
<tr><td>SV003</td><td>Lê Văn Bình</td><td>2004-01-30</td><td>6.80</td><td>SE1802</td></tr>
<tr><td>SV004</td><td>Phạm Thị Mai</td><td>2004-11-02</td><td>9.10</td><td>SE1802</td></tr>
<tr><td>SV005</td><td>Hoàng Văn Đức</td><td>2004-05-18</td><td><em>NULL</em></td><td>SE1801</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoten</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Lê Văn Bình</td><td>6.80</td></tr>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
<tr><td>Hoàng Văn Đức</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoten</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoten</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Lê Văn Bình</td><td>6.80</td></tr>
<tr><td>Hoàng Văn Đức</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">Học tiếp PostgreSQL — ORDER BY, LIMIT, DISTINCT</a>.
</div>`,
    `<h2>Bước 4 — SELECT: xem dữ liệu bốn kiểu</h2>
<p>Từ đây, ta làm việc trên một QuanLyLop đã có sẵn đủ 5 sinh viên và 2 lớp từ bước 3.</p>
<p class="nhan">Mọi cột, mọi dòng</p>
<pre><code class="language-sql">SELECT * FROM SinhVien;                                          -- mọi cột, mọi dòng</code></pre>
<p class="nhan">Chỉ lấy cột cần</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien;                               -- chỉ lấy cột cần</code></pre>
<p class="nhan">Lọc bằng WHERE</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien WHERE diemTB &gt;= 7;             -- lọc dòng</code></pre>
<p class="nhan">Sắp xếp bằng ORDER BY — và NULL rơi vào đâu</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien ORDER BY diemTB DESC;          -- điểm cao trước; NULL xếp cuối</code></pre>
<table>
<thead><tr><th>maSV</th><th>hoTen</th><th>ngaySinh</th><th>diemTB</th><th>maLop</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>Nguyễn Văn Cường</td><td>2004-03-12</td><td>8.50</td><td>SE1801</td></tr>
<tr><td>SV002</td><td>Trần Thị Hoa</td><td>2004-07-25</td><td>7.20</td><td>SE1801</td></tr>
<tr><td>SV003</td><td>Lê Văn Bình</td><td>2004-01-30</td><td>6.80</td><td>SE1802</td></tr>
<tr><td>SV004</td><td>Phạm Thị Mai</td><td>2004-11-02</td><td>9.10</td><td>SE1802</td></tr>
<tr><td>SV005</td><td>Hoàng Văn Đức</td><td>2004-05-18</td><td><em>NULL</em></td><td>SE1801</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoTen</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Lê Văn Bình</td><td>6.80</td></tr>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
<tr><td>Hoàng Văn Đức</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoTen</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoTen</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Lê Văn Bình</td><td>6.80</td></tr>
<tr><td>Hoàng Văn Đức</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Để ý Hoàng Văn Đức (chưa có điểm, NULL) rơi xuống tận đáy của thứ tự <code>DESC</code> (điểm cao trước) trên SQL Server — NULL được xử lý như giá trị thấp nhất có thể.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> — câu truy vấn giống hệt cho ba câu đầu, nhưng <code>ORDER BY diemtb DESC</code> trần sẽ đưa dòng NULL lên <em>đầu</em> mặc định (PostgreSQL coi NULL là giá trị lớn nhất trừ khi bảo khác đi) — nên muốn đúng hành vi "NULL cuối" phải nói rõ bằng <code>NULLS LAST</code>:
<pre><code class="language-sql">SELECT hoten, diemtb FROM sinhvien ORDER BY diemtb DESC NULLS LAST;  -- PostgreSQL mặc định xếp NULL lên đầu khi DESC — phải ghi rõ NULLS LAST</code></pre>
<table>
<thead><tr><th>masv</th><th>hoten</th><th>ngaysinh</th><th>diemtb</th><th>malop</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>Nguyễn Văn Cường</td><td>2004-03-12</td><td>8.50</td><td>SE1801</td></tr>
<tr><td>SV002</td><td>Trần Thị Hoa</td><td>2004-07-25</td><td>7.20</td><td>SE1801</td></tr>
<tr><td>SV003</td><td>Lê Văn Bình</td><td>2004-01-30</td><td>6.80</td><td>SE1802</td></tr>
<tr><td>SV004</td><td>Phạm Thị Mai</td><td>2004-11-02</td><td>9.10</td><td>SE1802</td></tr>
<tr><td>SV005</td><td>Hoàng Văn Đức</td><td>2004-05-18</td><td><em>NULL</em></td><td>SE1801</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoten</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Lê Văn Bình</td><td>6.80</td></tr>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
<tr><td>Hoàng Văn Đức</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoten</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>hoten</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>Phạm Thị Mai</td><td>9.10</td></tr>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
<tr><td>Trần Thị Hoa</td><td>7.20</td></tr>
<tr><td>Lê Văn Bình</td><td>6.80</td></tr>
<tr><td>Hoàng Văn Đức</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<a href="/courses/postgresql/learn?lessonSlug=postgresql-4-3-order-limit-distinct">Học tiếp PostgreSQL — ORDER BY, LIMIT, DISTINCT</a>.
</div>`),
    bi(`<h2>Step 5 — UPDATE: change existing rows</h2>
<pre><code class="language-sql">SELECT maSV, diemTB FROM SinhVien WHERE maSV = 'SV005';   -- before

UPDATE SinhVien SET diemTB = 6.50 WHERE maSV = 'SV005';   -- one row, matched by primary key

SELECT maSV, diemTB FROM SinhVien WHERE maSV = 'SV005';   -- after</code></pre>
<table>
<thead><tr><th>maSV</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>SV005</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>maSV</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>SV005</td><td>6.50</td></tr>
</tbody>
</table>
<p><code>UPDATE SinhVien SET diemTB = 6.50 WHERE maSV = 'SV005';</code> reads as: in table SinhVien, set column diemTB to 6.50, but only on the row(s) where maSV equals 'SV005'. The two SELECTs before and after prove exactly one value changed, on exactly one row.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> — identical statement, lower-case names:
<pre><code class="language-sql">SELECT masv, diemtb FROM sinhvien WHERE masv = 'SV005';

UPDATE sinhvien SET diemtb = 6.50 WHERE masv = 'SV005';

SELECT masv, diemtb FROM sinhvien WHERE masv = 'SV005';</code></pre>
<table>
<thead><tr><th>masv</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>SV005</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out">UPDATE 1</div>
<table>
<thead><tr><th>masv</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>SV005</td><td>6.50</td></tr>
</tbody>
</table>
</div>`,
    `<h2>Bước 5 — UPDATE: sửa dòng đã có</h2>
<pre><code class="language-sql">SELECT maSV, diemTB FROM SinhVien WHERE maSV = 'SV005';   -- trước khi sửa

UPDATE SinhVien SET diemTB = 6.50 WHERE maSV = 'SV005';   -- một dòng, khớp theo khoá chính

SELECT maSV, diemTB FROM SinhVien WHERE maSV = 'SV005';   -- sau khi sửa</code></pre>
<table>
<thead><tr><th>maSV</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>SV005</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>maSV</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>SV005</td><td>6.50</td></tr>
</tbody>
</table>
<p><code>UPDATE SinhVien SET diemTB = 6.50 WHERE maSV = 'SV005';</code> đọc là: trong bảng SinhVien, đặt cột diemTB thành 6.50, nhưng chỉ ở (những) dòng maSV bằng 'SV005'. Hai câu SELECT trước và sau chứng minh đúng một giá trị đổi, trên đúng một dòng.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> — câu lệnh giống hệt, chỉ đổi tên chữ thường:
<pre><code class="language-sql">SELECT masv, diemtb FROM sinhvien WHERE masv = 'SV005';

UPDATE sinhvien SET diemtb = 6.50 WHERE masv = 'SV005';

SELECT masv, diemtb FROM sinhvien WHERE masv = 'SV005';</code></pre>
<table>
<thead><tr><th>masv</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>SV005</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out">UPDATE 1</div>
<table>
<thead><tr><th>masv</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>SV005</td><td>6.50</td></tr>
</tbody>
</table>
</div>`),
    bi(`<h2>Step 6 — DELETE: remove rows</h2>
<pre><code class="language-sql">SELECT COUNT(*) AS soLuong FROM SinhVien;                 -- before

DELETE FROM SinhVien WHERE maSV = 'SV005';                -- one row, matched by primary key

SELECT COUNT(*) AS soLuong FROM SinhVien;                 -- after</code></pre>
<table>
<thead><tr><th>soLuong</th></tr></thead>
<tbody>
<tr><td>5</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>soLuong</th></tr></thead>
<tbody>
<tr><td>4</td></tr>
</tbody>
</table>
<p><code>DELETE FROM SinhVien WHERE maSV = 'SV005';</code> removes only the matching row(s); the count query before/after proves it dropped from 5 to 4. <code>DELETE</code> never needs a column list — it removes whole rows, not values.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong>
<pre><code class="language-sql">SELECT COUNT(*) AS soluong FROM sinhvien;

DELETE FROM sinhvien WHERE masv = 'SV005';

SELECT COUNT(*) AS soluong FROM sinhvien;</code></pre>
<table>
<thead><tr><th>soluong</th></tr></thead>
<tbody>
<tr><td>5</td></tr>
</tbody>
</table>
<div class="out">DELETE 1</div>
<table>
<thead><tr><th>soluong</th></tr></thead>
<tbody>
<tr><td>4</td></tr>
</tbody>
</table>
<a href="/courses/postgresql/learn?lessonSlug=postgresql-4-4-update-delete">Học tiếp PostgreSQL — UPDATE, DELETE</a>.
</div>`,
    `<h2>Bước 6 — DELETE: xoá dòng</h2>
<pre><code class="language-sql">SELECT COUNT(*) AS soLuong FROM SinhVien;                 -- trước khi xoá

DELETE FROM SinhVien WHERE maSV = 'SV005';                -- một dòng, khớp theo khoá chính

SELECT COUNT(*) AS soLuong FROM SinhVien;                 -- sau khi xoá</code></pre>
<table>
<thead><tr><th>soLuong</th></tr></thead>
<tbody>
<tr><td>5</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>soLuong</th></tr></thead>
<tbody>
<tr><td>4</td></tr>
</tbody>
</table>
<p><code>DELETE FROM SinhVien WHERE maSV = 'SV005';</code> chỉ xoá (những) dòng khớp; câu đếm trước/sau chứng minh số dòng giảm từ 5 xuống 4. <code>DELETE</code> không bao giờ cần danh sách cột — nó xoá cả dòng, không phải giá trị.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong>
<pre><code class="language-sql">SELECT COUNT(*) AS soluong FROM sinhvien;

DELETE FROM sinhvien WHERE masv = 'SV005';

SELECT COUNT(*) AS soluong FROM sinhvien;</code></pre>
<table>
<thead><tr><th>soluong</th></tr></thead>
<tbody>
<tr><td>5</td></tr>
</tbody>
</table>
<div class="out">DELETE 1</div>
<table>
<thead><tr><th>soluong</th></tr></thead>
<tbody>
<tr><td>4</td></tr>
</tbody>
</table>
<a href="/courses/postgresql/learn?lessonSlug=postgresql-4-4-update-delete">Học tiếp PostgreSQL — UPDATE, DELETE</a>.
</div>`),
    bi(`<h2>Common mistake 1 — forgetting WHERE</h2>
<p><code>WHERE</code> is not required by the syntax — <code>UPDATE</code>/<code>DELETE</code> without one is perfectly legal, and does exactly what it says: every row.</p>
<pre><code class="language-sql">SELECT maSV, diemTB FROM SinhVien ORDER BY maSV;          -- before: 5 different scores

UPDATE SinhVien SET diemTB = 0;                           -- forgot WHERE — every row matches

SELECT maSV, diemTB FROM SinhVien ORDER BY maSV;          -- after: every student now has 0</code></pre>
<table>
<thead><tr><th>maSV</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>8.50</td></tr>
<tr><td>SV002</td><td>7.20</td></tr>
<tr><td>SV003</td><td>6.80</td></tr>
<tr><td>SV004</td><td>9.10</td></tr>
<tr><td>SV005</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out">(5 rows affected)</div>
<table>
<thead><tr><th>maSV</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>0.00</td></tr>
<tr><td>SV002</td><td>0.00</td></tr>
<tr><td>SV003</td><td>0.00</td></tr>
<tr><td>SV004</td><td>0.00</td></tr>
<tr><td>SV005</td><td>0.00</td></tr>
</tbody>
</table>
<div class="pitfall">Before this run, five students had five different scores. <code>UPDATE SinhVien SET diemTB = 0;</code> has no <code>WHERE</code>, so it matched all of them — every score is now 0, permanently, the moment that statement committed. This is precisely the shape of mistake behind the GitLab incident from lesson 0.1: a destructive statement that is syntactically perfect and executes instantly. Build the habit now: write and run the matching <code>SELECT ... WHERE ...</code> first, read the rows it returns, and only then change <code>SELECT ... FROM</code> into <code>UPDATE ... SET ...</code>/<code>DELETE FROM ...</code> on the exact same <code>WHERE</code>.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> — the trap is identical, same missing keyword, same result:
<pre><code class="language-sql">SELECT masv, diemtb FROM sinhvien ORDER BY masv;

UPDATE sinhvien SET diemtb = 0;

SELECT masv, diemtb FROM sinhvien ORDER BY masv;</code></pre>
<table>
<thead><tr><th>masv</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>8.50</td></tr>
<tr><td>SV002</td><td>7.20</td></tr>
<tr><td>SV003</td><td>6.80</td></tr>
<tr><td>SV004</td><td>9.10</td></tr>
<tr><td>SV005</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out">UPDATE 5</div>
<table>
<thead><tr><th>masv</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>0.00</td></tr>
<tr><td>SV002</td><td>0.00</td></tr>
<tr><td>SV003</td><td>0.00</td></tr>
<tr><td>SV004</td><td>0.00</td></tr>
<tr><td>SV005</td><td>0.00</td></tr>
</tbody>
</table>
</div>`,
    `<h2>Lỗi hay gặp 1 — quên WHERE</h2>
<p><code>WHERE</code> không bắt buộc theo cú pháp — <code>UPDATE</code>/<code>DELETE</code> không có nó vẫn hợp lệ hoàn toàn, và làm đúng như nó nói: mọi dòng.</p>
<pre><code class="language-sql">SELECT maSV, diemTB FROM SinhVien ORDER BY maSV;          -- trước: 5 điểm khác nhau

UPDATE SinhVien SET diemTB = 0;                           -- quên WHERE — mọi dòng đều khớp

SELECT maSV, diemTB FROM SinhVien ORDER BY maSV;          -- sau: mọi sinh viên đều còn 0</code></pre>
<table>
<thead><tr><th>maSV</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>8.50</td></tr>
<tr><td>SV002</td><td>7.20</td></tr>
<tr><td>SV003</td><td>6.80</td></tr>
<tr><td>SV004</td><td>9.10</td></tr>
<tr><td>SV005</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out">(5 rows affected)</div>
<table>
<thead><tr><th>maSV</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>0.00</td></tr>
<tr><td>SV002</td><td>0.00</td></tr>
<tr><td>SV003</td><td>0.00</td></tr>
<tr><td>SV004</td><td>0.00</td></tr>
<tr><td>SV005</td><td>0.00</td></tr>
</tbody>
</table>
<div class="pitfall">Trước khi chạy, năm sinh viên có năm điểm khác nhau. <code>UPDATE SinhVien SET diemTB = 0;</code> không có <code>WHERE</code>, nên khớp với tất cả — mọi điểm giờ đều là 0, vĩnh viễn, ngay lúc câu lệnh đó chạy xong. Đây đúng là hình dạng lỗi đứng sau sự cố GitLab ở bài 0.1: một câu lệnh phá huỷ đúng cú pháp hoàn hảo và chạy tức thì. Xây thói quen từ bây giờ: viết và chạy <code>SELECT ... WHERE ...</code> tương ứng trước, đọc các dòng nó trả về, rồi mới đổi <code>SELECT ... FROM</code> thành <code>UPDATE ... SET ...</code>/<code>DELETE FROM ...</code> trên đúng <code>WHERE</code> đó.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> — bẫy giống hệt, thiếu đúng từ khoá đó, kết quả giống hệt:
<pre><code class="language-sql">SELECT masv, diemtb FROM sinhvien ORDER BY masv;

UPDATE sinhvien SET diemtb = 0;

SELECT masv, diemtb FROM sinhvien ORDER BY masv;</code></pre>
<table>
<thead><tr><th>masv</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>8.50</td></tr>
<tr><td>SV002</td><td>7.20</td></tr>
<tr><td>SV003</td><td>6.80</td></tr>
<tr><td>SV004</td><td>9.10</td></tr>
<tr><td>SV005</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out">UPDATE 5</div>
<table>
<thead><tr><th>masv</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>SV001</td><td>0.00</td></tr>
<tr><td>SV002</td><td>0.00</td></tr>
<tr><td>SV003</td><td>0.00</td></tr>
<tr><td>SV004</td><td>0.00</td></tr>
<tr><td>SV005</td><td>0.00</td></tr>
</tbody>
</table>
</div>`),
    bi(`<h2>Common mistake 2 — single quotes vs. double quotes</h2>
<p>In both SQL Server and PostgreSQL, single and double quotes mean <strong>different things</strong> — mixing them up produces a real error, not a wrong result, so at least it does not fail silently like the N'' trap.</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien WHERE hoTen = "Nguyễn Văn Cường";  -- double quotes: SQL Server reads this as a COLUMN NAME, not text</code></pre>
<div class="out"><b>Msg 207, Level 16, State 1<br>
Invalid column name 'Nguyễn Văn Cường'.</b></div>
<p>SQL Server parsed <code>"Nguyễn Văn Cường"</code> as an attempted <em>column name</em>, not text — there is no column with that name, hence "Invalid column name".</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien WHERE hoTen = 'Nguyễn Văn Cường';  -- single quotes: this is text</code></pre>
<table>
<thead><tr><th>hoTen</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> — same rule, and PostgreSQL is stricter about it than SQL Server in general: double quotes <em>always</em> mean an identifier, with no fallback interpretation, ever.
<pre><code class="language-sql">SELECT hoten, diemtb FROM sinhvien WHERE hoten = "Nguyễn Văn Cường";  -- PostgreSQL: double quotes ALWAYS mean an identifier</code></pre>
<div class="out"><b>ERROR:  column "Nguyễn Văn Cường" does not exist</b></div>
<pre><code class="language-sql">SELECT hoten, diemtb FROM sinhvien WHERE hoten = 'Nguyễn Văn Cường';</code></pre>
<table>
<thead><tr><th>hoten</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
</tbody>
</table>
</div>
<p class="meo">🧠 One rule for both engines: <strong>single quotes hold data, double quotes name things</strong>. If your string has an apostrophe inside it (e.g. <code>O'Brien</code>), double the quote: <code>'O''Brien'</code>.</p>`,
    `<h2>Lỗi hay gặp 2 — nháy đơn và nháy kép</h2>
<p>Ở cả SQL Server lẫn PostgreSQL, nháy đơn và nháy kép mang <strong>nghĩa khác nhau</strong> — gõ lẫn sinh ra lỗi thật, không phải kết quả sai, nên ít ra nó không âm thầm hỏng như bẫy N''.</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien WHERE hoTen = "Nguyễn Văn Cường";  -- nháy kép: SQL Server hiểu đây là TÊN CỘT, không phải chuỗi</code></pre>
<div class="out"><b>Msg 207, Level 16, State 1<br>
Invalid column name 'Nguyễn Văn Cường'.</b></div>
<p>SQL Server hiểu <code>"Nguyễn Văn Cường"</code> là một <em>tên cột</em> đang thử dùng, không phải chuỗi — không có cột nào tên vậy, nên báo "Invalid column name".</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien WHERE hoTen = 'Nguyễn Văn Cường';  -- nháy đơn: đây mới là chuỗi</code></pre>
<table>
<thead><tr><th>hoTen</th><th>diemTB</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> — cùng luật, và PostgreSQL nói chung nghiêm hơn SQL Server ở điểm này: nháy kép <em>luôn luôn</em> nghĩa là tên định danh, không có cách hiểu dự phòng nào khác, không bao giờ.
<pre><code class="language-sql">SELECT hoten, diemtb FROM sinhvien WHERE hoten = "Nguyễn Văn Cường";  -- PostgreSQL: nháy kép LUÔN LUÔN là tên định danh</code></pre>
<div class="out"><b>ERROR:  column "Nguyễn Văn Cường" does not exist</b></div>
<pre><code class="language-sql">SELECT hoten, diemtb FROM sinhvien WHERE hoten = 'Nguyễn Văn Cường';</code></pre>
<table>
<thead><tr><th>hoten</th><th>diemtb</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn Cường</td><td>8.50</td></tr>
</tbody>
</table>
</div>
<p class="meo">🧠 Một luật cho cả hai engine: <strong>nháy đơn chứa dữ liệu, nháy kép đặt tên</strong>. Nếu chuỗi của bạn có dấu nháy đơn bên trong (vd <code>O'Brien</code>), viết đúp dấu nháy: <code>'O''Brien'</code>.</p>`),
    bi(`<h2>🧪 Five exercises — do them yourself before reading the answer</h2>
<p>Same QuanLyLop schema (Lop, SinhVien) as above. Write the statement on paper or in SSMS/psql first; then check against the answer.</p>

<h3>Exercise 1 — add a class and a student in it</h3>
<p>Task: insert a new class <code>('SE1803', 'Kỹ thuật phần mềm 1803')</code>, then a new student <code>('SV006', 'Đỗ Thị Lan', '2004-09-09', 8.00, 'SE1803')</code>.</p>
<p class="dap-an">✅ Answer</p>
<pre><code class="language-sql">INSERT INTO Lop (maLop, tenLop) VALUES ('SE1803', N'Kỹ thuật phần mềm 1803');
INSERT INTO SinhVien (maSV, hoTen, ngaySinh, diemTB, maLop)
  VALUES ('SV006', N'Đỗ Thị Lan', '2004-09-09', 8.00, 'SE1803');</code></pre>
<p class="pitfall">The class row must be inserted <strong>first</strong> — the foreign key on SinhVien.maLop requires SE1803 to already exist in Lop, otherwise you get a foreign-key violation error.</p>

<h3>Exercise 2 — find every student without a score yet</h3>
<p>Task: list hoTen for every student whose diemTB has never been set.</p>
<p class="dap-an">✅ Answer</p>
<pre><code class="language-sql">SELECT hoTen FROM SinhVien WHERE diemTB IS NULL;</code></pre>
<p class="pitfall"><code>WHERE diemTB = NULL</code> is a classic trap: it is always neither true nor false (NULL "equals" nothing, not even another NULL), so it silently returns zero rows. NULL is only ever tested with <code>IS NULL</code> / <code>IS NOT NULL</code>.</p>

<h3>Exercise 3 — every student in class SE1801, best score first</h3>
<p class="dap-an">✅ Answer</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien WHERE maLop = 'SE1801' ORDER BY diemTB DESC;</code></pre>

<h3>Exercise 4 — give every student in SE1802 half a point of bonus, capped at 10</h3>
<p class="dap-an">✅ Answer</p>
<pre><code class="language-sql">UPDATE SinhVien
SET diemTB = CASE WHEN diemTB + 0.5 &gt; 10 THEN 10 ELSE diemTB + 0.5 END
WHERE maLop = 'SE1802';</code></pre>
<p class="pitfall">Writing plain <code>SET diemTB = diemTB + 0.5</code> without the cap would risk violating the <code>ck_sinhvien_diem</code> CHECK constraint (diemTB &lt;= 10) for anyone already close to 10 — the whole UPDATE would fail with a constraint-violation error, changing zero rows, not just skip that one student.</p>

<h3>Exercise 5 — delete a class safely</h3>
<p>Task: try to delete class SE1801 while it still has students in it. What happens, and how do you actually remove it (in this exact schema, with no <code>ON DELETE CASCADE</code>)?</p>
<p class="dap-an">✅ Answer</p>
<pre><code class="language-sql">DELETE FROM Lop WHERE maLop = 'SE1801';
-- fails: "The DELETE statement conflicted with the REFERENCE constraint
-- fk_sinhvien_lop" — SinhVien rows still point at it.
-- You must remove/reassign the children first:
DELETE FROM SinhVien WHERE maLop = 'SE1801';
DELETE FROM Lop WHERE maLop = 'SE1801';</code></pre>
<p class="meo">🧠 A foreign key protects data in <strong>both</strong> directions: it stops you creating an orphan child (exercise 1) and stops you deleting a parent that still has children. Chapter 5 (<code>ON DELETE CASCADE</code>/<code>SET NULL</code>) shows how to change this default behaviour on purpose.</p>`,
    `<h2>🧪 Năm bài tự làm — tự làm trước khi đọc đáp án</h2>
<p>Cùng lược đồ QuanLyLop (Lop, SinhVien) như trên. Viết câu lệnh ra giấy hoặc SSMS/psql trước; rồi đối chiếu đáp án.</p>

<h3>Bài 1 — thêm một lớp và một sinh viên trong lớp đó</h3>
<p>Đề: thêm lớp mới <code>('SE1803', 'Kỹ thuật phần mềm 1803')</code>, rồi thêm sinh viên mới <code>('SV006', 'Đỗ Thị Lan', '2004-09-09', 8.00, 'SE1803')</code>.</p>
<p class="dap-an">✅ Đáp án</p>
<pre><code class="language-sql">INSERT INTO Lop (maLop, tenLop) VALUES ('SE1803', N'Kỹ thuật phần mềm 1803');
INSERT INTO SinhVien (maSV, hoTen, ngaySinh, diemTB, maLop)
  VALUES ('SV006', N'Đỗ Thị Lan', '2004-09-09', 8.00, 'SE1803');</code></pre>
<p class="pitfall">Dòng lớp phải thêm <strong>trước</strong> — khoá ngoại trên SinhVien.maLop yêu cầu SE1803 phải đã tồn tại trong Lop, nếu không sẽ báo lỗi vi phạm khoá ngoại.</p>

<h3>Bài 2 — tìm mọi sinh viên chưa có điểm</h3>
<p>Đề: liệt kê hoTen của mọi sinh viên chưa từng được đặt diemTB.</p>
<p class="dap-an">✅ Đáp án</p>
<pre><code class="language-sql">SELECT hoTen FROM SinhVien WHERE diemTB IS NULL;</code></pre>
<p class="pitfall"><code>WHERE diemTB = NULL</code> là bẫy kinh điển: nó không bao giờ đúng cũng không bao giờ sai (NULL không "bằng" gì cả, kể cả một NULL khác), nên âm thầm trả về 0 dòng. NULL chỉ kiểm được bằng <code>IS NULL</code> / <code>IS NOT NULL</code>.</p>

<h3>Bài 3 — mọi sinh viên lớp SE1801, điểm cao nhất trước</h3>
<p class="dap-an">✅ Đáp án</p>
<pre><code class="language-sql">SELECT hoTen, diemTB FROM SinhVien WHERE maLop = 'SE1801' ORDER BY diemTB DESC;</code></pre>

<h3>Bài 4 — cộng 0,5 điểm thưởng cho mọi sinh viên lớp SE1802, chặn trần ở 10</h3>
<p class="dap-an">✅ Đáp án</p>
<pre><code class="language-sql">UPDATE SinhVien
SET diemTB = CASE WHEN diemTB + 0.5 &gt; 10 THEN 10 ELSE diemTB + 0.5 END
WHERE maLop = 'SE1802';</code></pre>
<p class="pitfall">Viết trần <code>SET diemTB = diemTB + 0.5</code> không chặn trần sẽ có nguy cơ vi phạm ràng buộc CHECK <code>ck_sinhvien_diem</code> (diemTB &lt;= 10) cho ai đã gần 10 — cả câu UPDATE sẽ lỗi vì vi phạm ràng buộc, đổi 0 dòng, chứ không phải chỉ bỏ qua đúng người đó.</p>

<h3>Bài 5 — xoá một lớp an toàn</h3>
<p>Đề: thử xoá lớp SE1801 khi nó còn sinh viên. Chuyện gì xảy ra, và làm sao xoá được thật (đúng lược đồ này, không có <code>ON DELETE CASCADE</code>)?</p>
<p class="dap-an">✅ Đáp án</p>
<pre><code class="language-sql">DELETE FROM Lop WHERE maLop = 'SE1801';
-- lỗi: "The DELETE statement conflicted with the REFERENCE constraint
-- fk_sinhvien_lop" — các dòng SinhVien vẫn đang trỏ vào nó.
-- Phải xoá/chuyển các dòng con trước:
DELETE FROM SinhVien WHERE maLop = 'SE1801';
DELETE FROM Lop WHERE maLop = 'SE1801';</code></pre>
<p class="meo">🧠 Khoá ngoại bảo vệ dữ liệu theo <strong>cả hai chiều</strong>: nó chặn bạn tạo một dòng con mồ côi (bài 1) và chặn bạn xoá một dòng cha còn con. Chương 5 (<code>ON DELETE CASCADE</code>/<code>SET NULL</code>) cho thấy cách đổi hành vi mặc định này một cách cố ý.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>schema</strong></td><td>lược đồ</td><td>The structure of a database — its tables, columns, types and constraints — described before any data exists.</td></tr>
<tr><td><strong>primary key</strong></td><td>khoá chính</td><td>The column (or columns) that uniquely identifies every row of a table.</td></tr>
<tr><td><strong>foreign key</strong></td><td>khoá ngoại</td><td>A column whose values must already exist as a primary key value in another (or the same) table — the mechanism that links tables together.</td></tr>
<tr><td><strong>CHECK constraint</strong></td><td>ràng buộc CHECK</td><td>A rule the database enforces on every write, e.g. "score between 0 and 10", with no application code needed.</td></tr>
<tr><td><strong>NOT NULL</strong></td><td>không được rỗng</td><td>A column-level rule saying this column can never be left empty.</td></tr>
<tr><td><strong>NULL</strong></td><td>giá trị rỗng/chưa biết</td><td>The special marker meaning "no value", "unknown" or "not applicable" — never equal to anything, including another NULL.</td></tr>
<tr><td><strong>NVARCHAR</strong></td><td>chuỗi Unicode có độ dài thay đổi</td><td>SQL Server's Unicode text type — required for Vietnamese diacritics to store correctly; the N'' literal prefix must match it.</td></tr>
<tr><td><strong>INSERT</strong></td><td>thêm dòng</td><td>The statement that adds new row(s) to a table.</td></tr>
<tr><td><strong>UPDATE</strong></td><td>sửa dòng</td><td>The statement that changes existing values in row(s) that match a WHERE condition (or every row, with no WHERE).</td></tr>
<tr><td><strong>DELETE</strong></td><td>xoá dòng</td><td>The statement that removes whole row(s) matching a WHERE condition (or every row, with no WHERE).</td></tr>
<tr><td><strong>WHERE clause</strong></td><td>mệnh đề WHERE</td><td>The condition that filters which rows a SELECT/UPDATE/DELETE actually touches.</td></tr>
<tr><td><strong>orphan row</strong></td><td>dòng mồ côi</td><td>A child row whose foreign key points at a parent that no longer exists — foreign keys exist specifically to prevent this.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>schema</strong></td><td>lược đồ</td><td>Cấu trúc của một database — bảng, cột, kiểu, ràng buộc — mô tả trước khi có bất kỳ dữ liệu nào.</td></tr>
<tr><td><strong>primary key</strong></td><td>khoá chính</td><td>Cột (hoặc các cột) định danh duy nhất mọi dòng của một bảng.</td></tr>
<tr><td><strong>foreign key</strong></td><td>khoá ngoại</td><td>Một cột mà giá trị của nó phải đã tồn tại như một giá trị khoá chính ở bảng khác (hoặc chính bảng đó) — cơ chế nối các bảng lại với nhau.</td></tr>
<tr><td><strong>CHECK constraint</strong></td><td>ràng buộc CHECK</td><td>Một luật database tự ép buộc trên mọi lần ghi, vd "điểm từ 0 đến 10", không cần code ứng dụng.</td></tr>
<tr><td><strong>NOT NULL</strong></td><td>không được rỗng</td><td>Luật ở mức cột: cột này không bao giờ được để trống.</td></tr>
<tr><td><strong>NULL</strong></td><td>giá trị rỗng/chưa biết</td><td>Dấu hiệu đặc biệt nghĩa là "không có giá trị", "chưa biết" hay "không áp dụng" — không bao giờ bằng bất cứ gì, kể cả một NULL khác.</td></tr>
<tr><td><strong>NVARCHAR</strong></td><td>chuỗi Unicode có độ dài thay đổi</td><td>Kiểu chuỗi Unicode của SQL Server — bắt buộc để dấu tiếng Việt lưu đúng; tiền tố N'' của chuỗi phải khớp với nó.</td></tr>
<tr><td><strong>INSERT</strong></td><td>thêm dòng</td><td>Câu lệnh thêm (các) dòng mới vào một bảng.</td></tr>
<tr><td><strong>UPDATE</strong></td><td>sửa dòng</td><td>Câu lệnh đổi giá trị đã có ở (các) dòng khớp điều kiện WHERE (hoặc mọi dòng, nếu không có WHERE).</td></tr>
<tr><td><strong>DELETE</strong></td><td>xoá dòng</td><td>Câu lệnh xoá hẳn (các) dòng khớp điều kiện WHERE (hoặc mọi dòng, nếu không có WHERE).</td></tr>
<tr><td><strong>WHERE clause</strong></td><td>mệnh đề WHERE</td><td>Điều kiện lọc ra đúng dòng nào một câu SELECT/UPDATE/DELETE thật sự đụng tới.</td></tr>
<tr><td><strong>orphan row</strong></td><td>dòng mồ côi</td><td>Một dòng con mà khoá ngoại trỏ vào một dòng cha không còn tồn tại — khoá ngoại sinh ra chính là để ngăn điều này.</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

export default {
  slides: [L_dbi1_1],
  extrasStart: [L_x_bat_dau_tai_day, L_x_cai_dat_ket_noi, L_x_buoi_dau_tien],
};
