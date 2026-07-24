/**
 * DBI202 — Database Systems (Các hệ cơ sở dữ liệu). Kỳ 3.
 * Bám syllabus FPTU (sylID 12039, 7 CLO) + giáo trình Ullman/Widom "First Course in
 * Database Systems". Tiên quyết: None. Công cụ: Microsoft SQL Server.
 * Song ngữ EN/VN (.ml-en/.ml-vi). SQL <pre>+.tok-*+.out; sơ đồ ERD lz-*.
 * Luyện: CodeLab SQL track (#module-406..413,721,720) + SQL Server.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/DBI202.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'DBI202',
    slug: 'introduction-to-databases',
    title: 'Database Systems',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'How real applications store and query data: the relational model, ER design, normalization, SQL from SELECT to stored procedures, and indexing. Learn to design a clean schema and write fast queries on SQL Server.|||Cách ứng dụng thật lưu và truy vấn dữ liệu: mô hình quan hệ, thiết kế ER, chuẩn hóa, SQL từ SELECT tới stored procedure, và đánh chỉ mục. Học thiết kế lược đồ sạch và viết truy vấn nhanh trên SQL Server.',
    description: 'Môn nền tảng về cơ sở dữ liệu: khái niệm hệ quản trị CSDL (DBMS), mô hình quan hệ và đại số quan hệ, mô hình thực thể-liên kết (ER), lý thuyết thiết kế và chuẩn hóa (phụ thuộc hàm, các dạng chuẩn 1NF-BCNF), ngôn ngữ SQL (DDL + DML), lập trình PL/SQL (View, Cursor, Stored Procedure, Function, Trigger), và đánh chỉ mục + tối ưu truy vấn. Thực hành trên Microsoft SQL Server. Tiên quyết: không.',
    whatYouLearn: 'Khái niệm CSDL & DBMS; mô hình quan hệ & đại số quan hệ; thiết kế ER và chuyển sang lược đồ quan hệ; phụ thuộc hàm & chuẩn hóa (1NF/2NF/3NF/BCNF); SQL DDL (CREATE/ALTER, khóa, ràng buộc); SQL truy vấn (SELECT/JOIN/GROUP BY/subquery); PL/SQL (View, Cursor, Stored Procedure, Function, Trigger); chỉ mục & tối ưu truy vấn; và giao dịch (ACID).',
    requirements: 'Tiên quyết: không có. Cần cài Microsoft SQL Server + SQL Server Management Studio (SSMS). Không yêu cầu biết lập trình trước, nhưng tư duy logic sẽ giúp ích.',
    documentsNote: 'Giáo trình: Ullman & Widom — A First Course in Database Systems (Pearson 2008); Ramakrishnan — Database Management Systems; Chopra — DBMS: A Practical Approach. Kèm slide FU, labs & assignment. Công cụ: Microsoft SQL Server + SSMS. Luyện tập: track Code Lab SQL. Kèm file syllabus gốc DBI202.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, điều kiện qua môn, chuẩn đầu ra, và cài đặt SQL Server.',
      lessons: [
        {
          title: '0.1 — About DBI202 & the course map|||0.1 — Giới thiệu DBI202 & bản đồ môn học',
          slug: 'dbi202-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Vì sao cơ sở dữ liệu ở khắp nơi, và toàn cảnh lộ trình môn học.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About DBI202 — Database Systems</h2>
<p class="lead">Every app you use — a bank, a shop, a social network — stores its data in a database. DBI202 teaches you to <strong>design</strong> that storage so it stays consistent, and to <strong>query</strong> it so answers come back fast. It is one of the most directly employable skills in the whole degree.</p>
<p>You will move from raw concepts to a working, well-designed database on <strong>Microsoft SQL Server</strong>, writing SQL by hand the whole way.</p>
<h3>Course map</h3>
<div class="lz-map">
  <div class="lz-stage">Concepts &amp; modelling</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Databases &amp; DBMS</div><div class="lz-nsub">Why databases · what a DBMS does</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Relational Model &amp; Algebra</div><div class="lz-nsub">Tables · keys · algebraic queries</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">ER Modelling</div><div class="lz-nsub">Entities · relationships · diagrams</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Normalization</div><div class="lz-nsub">FDs · 1NF → BCNF</div></div></div>
  <div class="lz-stage">SQL — the language</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">SQL DDL</div><div class="lz-nsub">CREATE · keys · constraints</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">SQL Queries</div><div class="lz-nsub">SELECT · JOIN · GROUP BY · subqueries</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">PL/SQL programmability</div><div class="lz-nsub">Views · procedures · functions · triggers</div></div></div>
  <div class="lz-stage">Performance</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Indexing &amp; optimization</div><div class="lz-nsub">Make queries fast · transactions</div></div></div>
</div>
<div class="callout ok">Databases are learned by querying. Every chapter here links to hands-on SQL exercises — run every query yourself and watch the rows come back.</div>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-406" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">SQL practice track</span><span class="lc-sub">From basic queries to advanced techniques — run real SQL.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu DBI202 — Các hệ cơ sở dữ liệu</h2>
<p class="lead">Mọi ứng dụng bạn dùng — ngân hàng, cửa hàng, mạng xã hội — đều lưu dữ liệu trong một cơ sở dữ liệu. DBI202 dạy bạn <strong>thiết kế</strong> kho lưu đó để nó nhất quán, và <strong>truy vấn</strong> nó để câu trả lời trở về nhanh. Đây là một trong những kỹ năng dễ xin việc nhất cả ngành.</p>
<p>Bạn sẽ đi từ khái niệm thô tới một cơ sở dữ liệu chạy được, thiết kế tốt trên <strong>Microsoft SQL Server</strong>, tự tay viết SQL suốt chặng.</p>
<h3>Bản đồ môn học</h3>
<div class="lz-map">
  <div class="lz-stage">Khái niệm &amp; mô hình hóa</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Cơ sở dữ liệu &amp; DBMS</div><div class="lz-nsub">Vì sao CSDL · DBMS làm gì</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Mô hình quan hệ &amp; Đại số</div><div class="lz-nsub">Bảng · khóa · truy vấn đại số</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Mô hình ER</div><div class="lz-nsub">Thực thể · liên kết · sơ đồ</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Chuẩn hóa</div><div class="lz-nsub">Phụ thuộc hàm · 1NF → BCNF</div></div></div>
  <div class="lz-stage">SQL — ngôn ngữ</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">SQL DDL</div><div class="lz-nsub">CREATE · khóa · ràng buộc</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Truy vấn SQL</div><div class="lz-nsub">SELECT · JOIN · GROUP BY · subquery</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Lập trình PL/SQL</div><div class="lz-nsub">View · procedure · function · trigger</div></div></div>
  <div class="lz-stage">Hiệu năng</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Chỉ mục &amp; tối ưu</div><div class="lz-nsub">Truy vấn nhanh · giao dịch</div></div></div>
</div>
<div class="callout ok">Cơ sở dữ liệu học bằng cách truy vấn. Mỗi chương ở đây link tới bài tập SQL thực hành — tự chạy mọi truy vấn và xem các dòng trở về.</div>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-406" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Track luyện SQL</span><span class="lc-sub">Từ truy vấn cơ bản tới kỹ thuật nâng cao — chạy SQL thật.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'dbi202-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, điểm sàn và các cột điểm (có thi thực hành SQL).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">From the official DBI202 syllabus. There is a theory exam and a practical exam where you write SQL on a computer, so both understanding and hands-on skill are graded.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + TE + PE + self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of slots</span></div>
</div>
<div class="callout warn">The <strong>Practical Exam</strong> asks you to write working SQL against a schema under time. Memorising syntax is not enough — you must query fluently. The labs and the SQL practice track are your rehearsal.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Từ syllabus chính thức DBI202. Có thi lý thuyết và thi thực hành nơi bạn viết SQL trên máy, nên cả hiểu biết lẫn kỹ năng tay đều được chấm.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lớp + TE + PE + tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% slot</span></div>
</div>
<div class="callout warn"><strong>Thi thực hành</strong> yêu cầu bạn viết SQL chạy được trên một lược đồ, có giới hạn thời gian. Thuộc cú pháp là chưa đủ — phải truy vấn thành thạo. Các lab và track luyện SQL là buổi diễn tập của bạn.</div>
</div>
`,
        },
        {
          title: '0.3 — Set up SQL Server & SSMS|||0.3 — Cài SQL Server & SSMS',
          slug: 'dbi202-cai-dat',
          type: 'VIDEO',
          description: 'Cài Microsoft SQL Server + SSMS để chạy SQL đúng môi trường môn học.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Set up your database environment</h2>
<p class="lead">DBI202 uses <strong>Microsoft SQL Server</strong>. Install the free Developer or Express edition plus <strong>SQL Server Management Studio (SSMS)</strong> to write and run queries.</p>
<div class="lz-flow">
  <div class="lz-step">Install SQL Server (Developer/Express)</div>
  <div class="lz-step">Install SSMS</div>
  <div class="lz-step">Connect to your local server</div>
  <div class="lz-step">Create a database &amp; run a query</div>
</div>
<a class="link-card exphub" href="/exp-hub/dbi202-cai-dat-sql-server?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Install SQL Server &amp; SSMS</span><span class="lc-sub">Step-by-step with official download links — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Cài môi trường cơ sở dữ liệu</h2>
<p class="lead">DBI202 dùng <strong>Microsoft SQL Server</strong>. Cài bản Developer hoặc Express miễn phí cộng <strong>SQL Server Management Studio (SSMS)</strong> để viết và chạy truy vấn.</p>
<div class="lz-flow">
  <div class="lz-step">Cài SQL Server (Developer/Express)</div>
  <div class="lz-step">Cài SSMS</div>
  <div class="lz-step">Kết nối tới server cục bộ</div>
  <div class="lz-step">Tạo database &amp; chạy một truy vấn</div>
</div>
<a class="link-card exphub" href="/exp-hub/dbi202-cai-dat-sql-server?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài SQL Server &amp; SSMS</span><span class="lc-sub">Từng bước kèm link tải chính chủ — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — CSDL & DBMS ══════════════════ */
    {
      title: 'Chapter 1 — Databases & DBMS|||Chương 1 — Cơ sở dữ liệu & DBMS',
      description: 'Vì sao dùng CSDL thay vì tệp, và hệ quản trị CSDL (DBMS) làm những gì.',
      lessons: [
        {
          title: '1.1 — Why databases & what a DBMS does|||1.1 — Vì sao CSDL & DBMS làm gì',
          slug: 'dbi202-csdl-dbms',
          type: 'VIDEO',
          description: 'Vấn đề của lưu trữ bằng tệp; vai trò DBMS: nhất quán, đồng thời, bảo mật, phục hồi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Why databases &amp; what a DBMS does</h2>
<p class="lead">You could store data in plain files — until two users edit at once, a field format drifts, or a crash corrupts half a record. A <strong>Database Management System (DBMS)</strong> solves all of this: it is software that stores, protects and serves data reliably.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Consistency</b> — rules (constraints) keep data valid; no negative ages, no orphaned orders.</div>
  <div class="lz-layer"><b>Concurrency</b> — many users read/write safely at the same time via transactions.</div>
  <div class="lz-layer"><b>Security</b> — users and permissions control who sees what.</div>
  <div class="lz-layer"><b>Recovery</b> — logs and backups survive crashes without losing committed data.</div>
  <div class="lz-layer"><b>Querying</b> — ask questions declaratively in SQL; the DBMS figures out how.</div>
</div>
<div class="note-ct">SQL Server, MySQL, PostgreSQL and Oracle are all relational DBMSs. This course uses SQL Server, but the concepts transfer to all of them.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Vì sao CSDL &amp; DBMS làm gì</h2>
<p class="lead">Bạn có thể lưu dữ liệu trong tệp thường — cho tới khi hai người sửa cùng lúc, một định dạng trường lệch đi, hoặc một sự cố làm hỏng nửa bản ghi. Một <strong>Hệ quản trị CSDL (DBMS)</strong> giải quyết tất cả: nó là phần mềm lưu, bảo vệ và phục vụ dữ liệu một cách đáng tin.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Nhất quán</b> — luật (ràng buộc) giữ dữ liệu hợp lệ; không tuổi âm, không đơn hàng mồ côi.</div>
  <div class="lz-layer"><b>Đồng thời</b> — nhiều người đọc/ghi an toàn cùng lúc qua giao dịch.</div>
  <div class="lz-layer"><b>Bảo mật</b> — người dùng và quyền kiểm soát ai thấy gì.</div>
  <div class="lz-layer"><b>Phục hồi</b> — log và backup sống sót sự cố mà không mất dữ liệu đã commit.</div>
  <div class="lz-layer"><b>Truy vấn</b> — hỏi một cách khai báo bằng SQL; DBMS tự tính cách làm.</div>
</div>
<div class="note-ct">SQL Server, MySQL, PostgreSQL và Oracle đều là DBMS quan hệ. Môn này dùng SQL Server, nhưng khái niệm chuyển được sang tất cả.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — MÔ HÌNH QUAN HỆ ══════════════════ */
    {
      title: 'Chapter 2 — Relational Model & Algebra|||Chương 2 — Mô hình quan hệ & Đại số',
      description: 'Bảng, hàng, khóa; và đại số quan hệ — nền toán học của SQL.',
      lessons: [
        {
          title: '2.1 — Tables, keys & the relational model|||2.1 — Bảng, khóa & mô hình quan hệ',
          slug: 'dbi202-mo-hinh-quan-he',
          type: 'VIDEO',
          description: 'Quan hệ = bảng; hàng = bản ghi; khóa chính, khóa ngoại và toàn vẹn tham chiếu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>The relational model — everything is a table</h2>
<p class="lead">The relational model represents all data as <strong>tables</strong> (relations). Each row is a record, each column an attribute. Relationships between tables are made with <strong>keys</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Primary key</b> — a column (or set) that uniquely identifies each row. No duplicates, never null.</div>
  <div class="lz-layer"><b>Foreign key</b> — a column that references another table's primary key, linking the two.</div>
  <div class="lz-layer"><b>Referential integrity</b> — a foreign key must point to a row that exists; the DBMS enforces it.</div>
</div>
<div class="diagram">Student(<b>id</b>, name, classId) ── classId → ── Class(<b>id</b>, name)</div>
<div class="note-ct">Here <span class="badge">Student.classId</span> is a foreign key to <span class="badge">Class.id</span>. You cannot enrol a student in a class that does not exist — that is referential integrity at work.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Mô hình quan hệ — mọi thứ là một bảng</h2>
<p class="lead">Mô hình quan hệ biểu diễn mọi dữ liệu dưới dạng <strong>bảng</strong> (quan hệ). Mỗi hàng là một bản ghi, mỗi cột một thuộc tính. Liên kết giữa các bảng được tạo bằng <strong>khóa</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Khóa chính</b> — một cột (hoặc tập cột) định danh duy nhất mỗi hàng. Không trùng, không bao giờ null.</div>
  <div class="lz-layer"><b>Khóa ngoại</b> — một cột tham chiếu khóa chính của bảng khác, nối hai bảng.</div>
  <div class="lz-layer"><b>Toàn vẹn tham chiếu</b> — khóa ngoại phải trỏ tới một hàng tồn tại; DBMS đảm bảo điều này.</div>
</div>
<div class="diagram">Student(<b>id</b>, name, classId) ── classId → ── Class(<b>id</b>, name)</div>
<div class="note-ct">Ở đây <span class="badge">Student.classId</span> là khóa ngoại tới <span class="badge">Class.id</span>. Bạn không thể ghi danh sinh viên vào lớp không tồn tại — đó là toàn vẹn tham chiếu vào việc.</div>
</div>
`,
        },
        {
          title: '2.2 — Relational algebra|||2.2 — Đại số quan hệ',
          slug: 'dbi202-dai-so-quan-he',
          type: 'VIDEO',
          description: 'Các phép toán σ (chọn), π (chiếu), ⋈ (nối), ∪∩− — nền lý thuyết của mọi truy vấn SQL.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Relational algebra — the theory behind SQL</h2>
<p class="lead">Relational algebra is a small set of operations that take tables in and give a table out. Every SQL query is, underneath, a combination of these. Learn them and SQL stops being magic.</p>
<table>
  <thead><tr><th>Op</th><th>Name</th><th>Does</th></tr></thead>
  <tbody>
    <tr><td>σ (sigma)</td><td>Selection</td><td>keep rows matching a condition (SQL WHERE)</td></tr>
    <tr><td>π (pi)</td><td>Projection</td><td>keep only some columns (SQL SELECT list)</td></tr>
    <tr><td>⋈</td><td>Join</td><td>combine rows from two tables on a match</td></tr>
    <tr><td>∪ ∩ −</td><td>Set ops</td><td>union, intersection, difference</td></tr>
    <tr><td>ρ (rho)</td><td>Rename</td><td>rename a relation/attribute</td></tr>
  </tbody>
</table>
<div class="out">σ<sub>age&gt;20</sub>(Student) = all students older than 20 · π<sub>name</sub>(Student) = just the names.</div>
<div class="note-ct">The exam often asks you to write a query in relational algebra AND in SQL. They map almost one-to-one — σ is WHERE, π is the SELECT list, ⋈ is JOIN.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Đại số quan hệ — lý thuyết đằng sau SQL</h2>
<p class="lead">Đại số quan hệ là một tập nhỏ các phép toán nhận bảng vào và trả bảng ra. Mọi truy vấn SQL, ở bên dưới, là một tổ hợp của chúng. Học chúng và SQL thôi còn là phép màu.</p>
<table>
  <thead><tr><th>Phép</th><th>Tên</th><th>Làm</th></tr></thead>
  <tbody>
    <tr><td>σ (sigma)</td><td>Chọn</td><td>giữ hàng thỏa điều kiện (SQL WHERE)</td></tr>
    <tr><td>π (pi)</td><td>Chiếu</td><td>giữ một số cột (danh sách SQL SELECT)</td></tr>
    <tr><td>⋈</td><td>Nối</td><td>ghép hàng từ hai bảng theo một điều kiện khớp</td></tr>
    <tr><td>∪ ∩ −</td><td>Phép tập</td><td>hợp, giao, hiệu</td></tr>
    <tr><td>ρ (rho)</td><td>Đổi tên</td><td>đổi tên quan hệ/thuộc tính</td></tr>
  </tbody>
</table>
<div class="out">σ<sub>age&gt;20</sub>(Student) = mọi sinh viên trên 20 tuổi · π<sub>name</sub>(Student) = chỉ các tên.</div>
<div class="note-ct">Đề thi hay yêu cầu viết một truy vấn bằng đại số quan hệ VÀ bằng SQL. Chúng ánh xạ gần như một-một — σ là WHERE, π là danh sách SELECT, ⋈ là JOIN.</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Relational model & algebra|||Quiz 1 — Mô hình & đại số quan hệ',
          slug: 'dbi202-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra bảng, khóa và đại số quan hệ.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'A primary key must be…|||Khóa chính phải…', options: ['nullable and repeatable|||cho phép null và lặp', 'unique and never null|||duy nhất và không bao giờ null', 'a number|||là một số', 'the first column|||là cột đầu tiên'], correctIndex: 1, points: 1 },
              { question: 'A foreign key enforces…|||Khóa ngoại đảm bảo…', options: ['sorting|||sắp xếp', 'referential integrity (it must point to an existing row)|||toàn vẹn tham chiếu (phải trỏ tới hàng tồn tại)', 'encryption|||mã hóa', 'indexing|||đánh chỉ mục'], correctIndex: 1, points: 1 },
              { question: 'The relational-algebra selection σ corresponds to SQL…|||Phép chọn σ trong đại số quan hệ tương ứng SQL…', options: ['SELECT list|||danh sách SELECT', 'WHERE', 'ORDER BY', 'JOIN'], correctIndex: 1, points: 1 },
              { question: 'Projection π corresponds to…|||Phép chiếu π tương ứng…', options: ['choosing rows|||chọn hàng', 'choosing columns (the SELECT list)|||chọn cột (danh sách SELECT)', 'grouping|||gom nhóm', 'deleting|||xóa'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — MÔ HÌNH ER ══════════════════ */
    {
      title: 'Chapter 3 — ER Modelling|||Chương 3 — Mô hình thực thể-liên kết (ER)',
      description: 'Thiết kế khái niệm: thực thể, thuộc tính, liên kết, bản số — và chuyển ER sang bảng.',
      lessons: [
        {
          title: '3.1 — Entities, relationships & diagrams|||3.1 — Thực thể, liên kết & sơ đồ',
          slug: 'dbi202-er-model',
          type: 'VIDEO',
          description: 'Vẽ ER: thực thể (hình chữ nhật), thuộc tính, liên kết, bản số 1-1/1-N/N-N; rồi ánh xạ sang bảng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>ER modelling — design before you build</h2>
<p class="lead">Before writing a single table, you model the real world as an <strong>Entity-Relationship (ER) diagram</strong>: the things (entities), their properties (attributes) and how they connect (relationships). It is the blueprint the whole database follows.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Entity</b> — a thing you store data about: Student, Course, Order. (rectangle)</div>
  <div class="lz-layer"><b>Attribute</b> — a property of an entity: name, price, date. (oval)</div>
  <div class="lz-layer"><b>Relationship</b> — how entities connect: a Student <em>enrols in</em> a Course. (diamond)</div>
  <div class="lz-layer"><b>Cardinality</b> — how many: one-to-one (1:1), one-to-many (1:N), many-to-many (N:M).</div>
</div>
<div class="diagram">[Student] ──&lt;enrols&gt;── [Course]   (N:M → needs a junction table Enrollment)</div>
<div class="pitfall"><b>Key rule:</b> a many-to-many relationship cannot be stored directly. You resolve it into a <strong>junction table</strong> holding the two foreign keys — e.g. Enrollment(studentId, courseId).</div>
<a class="link-card exphub" href="/exp-hub/dbi202-cai-dat-sql-server?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems" target="_blank" rel="noopener">
  <span class="lc-ico">✏️</span>
  <span class="lc-body"><span class="lc-title">Draw ER diagrams (tools in the setup guide)</span><span class="lc-sub">draw.io / SSMS database diagrams.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Mô hình ER — thiết kế trước khi xây</h2>
<p class="lead">Trước khi viết một bảng nào, bạn mô hình thế giới thực thành một <strong>sơ đồ thực thể-liên kết (ER)</strong>: các sự vật (thực thể), tính chất của chúng (thuộc tính) và cách chúng nối (liên kết). Đó là bản thiết kế cả cơ sở dữ liệu tuân theo.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Thực thể</b> — một sự vật bạn lưu dữ liệu về: Student, Course, Order. (hình chữ nhật)</div>
  <div class="lz-layer"><b>Thuộc tính</b> — một tính chất của thực thể: tên, giá, ngày. (hình ô-van)</div>
  <div class="lz-layer"><b>Liên kết</b> — cách các thực thể nối: một Student <em>ghi danh</em> một Course. (hình thoi)</div>
  <div class="lz-layer"><b>Bản số</b> — bao nhiêu: một-một (1:1), một-nhiều (1:N), nhiều-nhiều (N:M).</div>
</div>
<div class="diagram">[Student] ──&lt;ghi danh&gt;── [Course]   (N:M → cần bảng trung gian Enrollment)</div>
<div class="pitfall"><b>Luật then chốt:</b> liên kết nhiều-nhiều không thể lưu trực tiếp. Bạn giải nó thành một <strong>bảng trung gian</strong> giữ hai khóa ngoại — vd Enrollment(studentId, courseId).</div>
<a class="link-card exphub" href="/exp-hub/dbi202-cai-dat-sql-server?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems" target="_blank" rel="noopener">
  <span class="lc-ico">✏️</span>
  <span class="lc-body"><span class="lc-title">Vẽ sơ đồ ER (công cụ trong guide cài đặt)</span><span class="lc-sub">draw.io / SSMS database diagrams.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — CHUẨN HÓA ══════════════════ */
    {
      title: 'Chapter 4 — Functional Dependencies & Normalization|||Chương 4 — Phụ thuộc hàm & Chuẩn hóa',
      description: 'Phụ thuộc hàm và các dạng chuẩn 1NF → BCNF — loại bỏ dư thừa và bất thường dữ liệu.',
      lessons: [
        {
          title: '4.1 — Functional dependencies & 1NF–BCNF|||4.1 — Phụ thuộc hàm & 1NF–BCNF',
          slug: 'dbi202-chuan-hoa',
          type: 'VIDEO',
          description: 'FD (A→B); vì sao dư thừa gây bất thường; và các dạng chuẩn 1NF/2NF/3NF/BCNF.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Normalization — designing tables without redundancy</h2>
<p class="lead">Store the same fact in two places and they will eventually disagree. Normalization is the systematic process of splitting tables so each fact lives in exactly one place, guided by <strong>functional dependencies</strong>.</p>
<p>A functional dependency <span class="badge">A → B</span> means "A determines B": given a studentId, there is exactly one student name. Anomalies arise when a table mixes independent facts.</p>
<table>
  <thead><tr><th>Form</th><th>Requires</th></tr></thead>
  <tbody>
    <tr><td><b>1NF</b></td><td>atomic values, no repeating groups</td></tr>
    <tr><td><b>2NF</b></td><td>1NF + no partial dependency on part of a composite key</td></tr>
    <tr><td><b>3NF</b></td><td>2NF + no transitive dependency (non-key → non-key)</td></tr>
    <tr><td><b>BCNF</b></td><td>stricter 3NF: every determinant is a candidate key</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>The three anomalies</b> a bad design causes: <b>update</b> (change a fact in one row, others go stale), <b>insert</b> (cannot add a course with no student), <b>delete</b> (removing the last student deletes the course too). Normalization removes all three.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Chuẩn hóa — thiết kế bảng không dư thừa</h2>
<p class="lead">Lưu cùng một sự thật ở hai nơi và cuối cùng chúng sẽ mâu thuẫn. Chuẩn hóa là quá trình có hệ thống tách bảng để mỗi sự thật sống ở đúng một chỗ, dẫn dắt bởi <strong>phụ thuộc hàm</strong>.</p>
<p>Phụ thuộc hàm <span class="badge">A → B</span> nghĩa là "A xác định B": cho một studentId, có đúng một tên sinh viên. Bất thường nảy sinh khi một bảng trộn các sự thật độc lập.</p>
<table>
  <thead><tr><th>Dạng</th><th>Yêu cầu</th></tr></thead>
  <tbody>
    <tr><td><b>1NF</b></td><td>giá trị nguyên tử, không nhóm lặp</td></tr>
    <tr><td><b>2NF</b></td><td>1NF + không phụ thuộc bộ phận vào một phần khóa kép</td></tr>
    <tr><td><b>3NF</b></td><td>2NF + không phụ thuộc bắc cầu (không-khóa → không-khóa)</td></tr>
    <tr><td><b>BCNF</b></td><td>3NF chặt hơn: mọi vế trái là một khóa dự tuyển</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Ba bất thường</b> mà thiết kế tệ gây ra: <b>cập nhật</b> (đổi một sự thật ở một hàng, hàng khác lỗi thời), <b>chèn</b> (không thể thêm khóa học chưa có sinh viên), <b>xóa</b> (xóa sinh viên cuối cùng xóa luôn khóa học). Chuẩn hóa loại bỏ cả ba.</div>
</div>
`,
        },
        {
          title: 'Quiz 2 — ER & Normalization|||Quiz 2 — ER & Chuẩn hóa',
          slug: 'dbi202-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra mô hình ER và chuẩn hóa.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'A many-to-many relationship is stored using…|||Liên kết nhiều-nhiều được lưu bằng…', options: ['one table|||một bảng', 'a junction table with two foreign keys|||một bảng trung gian với hai khóa ngoại', 'a primary key only|||chỉ một khóa chính', 'no table|||không bảng nào'], correctIndex: 1, points: 1 },
              { question: 'A functional dependency A → B means…|||Phụ thuộc hàm A → B nghĩa là…', options: ['B determines A|||B xác định A', 'A determines B (one A gives one B)|||A xác định B (một A cho một B)', 'they are unrelated|||chúng không liên quan', 'A and B are keys|||A và B là khóa'], correctIndex: 1, points: 1 },
              { question: '3NF removes…|||3NF loại bỏ…', options: ['all keys|||mọi khóa', 'transitive dependencies (non-key → non-key)|||phụ thuộc bắc cầu (không-khóa → không-khóa)', 'foreign keys|||khóa ngoại', 'indexes|||chỉ mục'], correctIndex: 1, points: 1 },
              { question: 'Normalization exists mainly to prevent…|||Chuẩn hóa tồn tại chủ yếu để ngăn…', options: ['fast queries|||truy vấn nhanh', 'update/insert/delete anomalies from redundancy|||bất thường cập nhật/chèn/xóa do dư thừa', 'using SQL|||dùng SQL', 'small tables|||bảng nhỏ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — SQL DDL ══════════════════ */
    {
      title: 'Chapter 5 — SQL DDL: defining data|||Chương 5 — SQL DDL: định nghĩa dữ liệu',
      description: 'CREATE TABLE, kiểu dữ liệu, khóa chính/ngoại và ràng buộc — dựng lược đồ bằng SQL.',
      lessons: [
        {
          title: '5.1 — CREATE TABLE, keys & constraints|||5.1 — CREATE TABLE, khóa & ràng buộc',
          slug: 'dbi202-sql-ddl',
          type: 'VIDEO',
          description: 'Định nghĩa bảng với kiểu dữ liệu, PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, CHECK.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>SQL DDL — turning your design into tables</h2>
<p class="lead">Data Definition Language (DDL) creates the schema. This is where your ER diagram and normalization become real tables, with the constraints that enforce your rules.</p>
<pre><span class="tok-keyword">CREATE TABLE</span> Student (
    id       <span class="tok-type">INT</span> <span class="tok-keyword">PRIMARY KEY</span>,
    name     <span class="tok-type">NVARCHAR</span>(100) <span class="tok-keyword">NOT NULL</span>,
    email    <span class="tok-type">VARCHAR</span>(100) <span class="tok-keyword">UNIQUE</span>,
    age      <span class="tok-type">INT</span> <span class="tok-keyword">CHECK</span> (age &gt;= 16),
    classId  <span class="tok-type">INT</span> <span class="tok-keyword">FOREIGN KEY REFERENCES</span> Class(id)
);</pre>
<table>
  <thead><tr><th>Constraint</th><th>Enforces</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">PRIMARY KEY</span></td><td>unique + not null identifier</td></tr>
    <tr><td><span class="badge">FOREIGN KEY</span></td><td>reference to another table</td></tr>
    <tr><td><span class="badge">NOT NULL</span></td><td>value required</td></tr>
    <tr><td><span class="badge">UNIQUE</span></td><td>no duplicates</td></tr>
    <tr><td><span class="badge">CHECK</span></td><td>a custom rule (age ≥ 16)</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-412" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Practise: Schema Design & DDL</span><span class="lc-sub">CREATE tables with keys and constraints.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>SQL DDL — biến thiết kế thành bảng</h2>
<p class="lead">Ngôn ngữ định nghĩa dữ liệu (DDL) tạo lược đồ. Đây là nơi sơ đồ ER và chuẩn hóa của bạn thành bảng thật, với các ràng buộc thực thi luật của bạn.</p>
<pre><span class="tok-keyword">CREATE TABLE</span> Student (
    id       <span class="tok-type">INT</span> <span class="tok-keyword">PRIMARY KEY</span>,
    name     <span class="tok-type">NVARCHAR</span>(100) <span class="tok-keyword">NOT NULL</span>,
    email    <span class="tok-type">VARCHAR</span>(100) <span class="tok-keyword">UNIQUE</span>,
    age      <span class="tok-type">INT</span> <span class="tok-keyword">CHECK</span> (age &gt;= 16),
    classId  <span class="tok-type">INT</span> <span class="tok-keyword">FOREIGN KEY REFERENCES</span> Class(id)
);</pre>
<table>
  <thead><tr><th>Ràng buộc</th><th>Thực thi</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">PRIMARY KEY</span></td><td>định danh duy nhất + không null</td></tr>
    <tr><td><span class="badge">FOREIGN KEY</span></td><td>tham chiếu tới bảng khác</td></tr>
    <tr><td><span class="badge">NOT NULL</span></td><td>bắt buộc có giá trị</td></tr>
    <tr><td><span class="badge">UNIQUE</span></td><td>không trùng</td></tr>
    <tr><td><span class="badge">CHECK</span></td><td>một luật tùy chỉnh (age ≥ 16)</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-412" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Luyện: Schema Design & DDL</span><span class="lc-sub">CREATE bảng với khóa và ràng buộc.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — TRUY VẤN SQL ══════════════════ */
    {
      title: 'Chapter 6 — SQL Queries|||Chương 6 — Truy vấn SQL',
      description: 'SELECT/WHERE/ORDER BY, JOIN nhiều bảng, GROUP BY & hàm tổng hợp, và truy vấn con.',
      lessons: [
        {
          title: '6.1 — SELECT, WHERE, JOIN|||6.1 — SELECT, WHERE, JOIN',
          slug: 'dbi202-select-join',
          type: 'VIDEO',
          description: 'Truy vấn cơ bản, lọc, và nối nhiều bảng — kỹ năng dùng nhiều nhất trong thi thực hành.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Querying — SELECT, WHERE, JOIN</h2>
<p class="lead">This is the heart of daily database work. <span class="badge">SELECT</span> chooses columns, <span class="badge">WHERE</span> filters rows, <span class="badge">JOIN</span> combines tables on a matching key.</p>
<pre><span class="tok-keyword">SELECT</span> s.name, c.name <span class="tok-keyword">AS</span> className
<span class="tok-keyword">FROM</span> Student s
<span class="tok-keyword">JOIN</span> Class c <span class="tok-keyword">ON</span> s.classId = c.id
<span class="tok-keyword">WHERE</span> s.age &gt;= 18
<span class="tok-keyword">ORDER BY</span> s.name;</pre>
<div class="out">Returns each adult student with the name of their class — data pulled from two tables, matched on <span class="badge">classId = id</span>.</div>
<table>
  <thead><tr><th>JOIN type</th><th>Returns</th></tr></thead>
  <tbody>
    <tr><td>INNER JOIN</td><td>only rows that match in both</td></tr>
    <tr><td>LEFT JOIN</td><td>all left rows + matches (nulls if none)</td></tr>
    <tr><td>RIGHT JOIN</td><td>all right rows + matches</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-409" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Practise: Joins & multi-table queries</span><span class="lc-sub">The single most-tested SQL skill.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Truy vấn — SELECT, WHERE, JOIN</h2>
<p class="lead">Đây là trái tim của công việc CSDL hằng ngày. <span class="badge">SELECT</span> chọn cột, <span class="badge">WHERE</span> lọc hàng, <span class="badge">JOIN</span> ghép bảng theo khóa khớp.</p>
<pre><span class="tok-keyword">SELECT</span> s.name, c.name <span class="tok-keyword">AS</span> className
<span class="tok-keyword">FROM</span> Student s
<span class="tok-keyword">JOIN</span> Class c <span class="tok-keyword">ON</span> s.classId = c.id
<span class="tok-keyword">WHERE</span> s.age &gt;= 18
<span class="tok-keyword">ORDER BY</span> s.name;</pre>
<div class="out">Trả về mỗi sinh viên đủ tuổi kèm tên lớp — dữ liệu lấy từ hai bảng, khớp theo <span class="badge">classId = id</span>.</div>
<table>
  <thead><tr><th>Kiểu JOIN</th><th>Trả về</th></tr></thead>
  <tbody>
    <tr><td>INNER JOIN</td><td>chỉ các hàng khớp ở cả hai</td></tr>
    <tr><td>LEFT JOIN</td><td>mọi hàng trái + khớp (null nếu không có)</td></tr>
    <tr><td>RIGHT JOIN</td><td>mọi hàng phải + khớp</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-409" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Luyện: Joins & truy vấn nhiều bảng</span><span class="lc-sub">Kỹ năng SQL được kiểm nhiều nhất.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '6.2 — GROUP BY, aggregates & subqueries|||6.2 — GROUP BY, hàm tổng hợp & truy vấn con',
          slug: 'dbi202-group-by-subquery',
          type: 'VIDEO',
          description: 'COUNT/SUM/AVG với GROUP BY & HAVING; và truy vấn con lồng nhau.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Aggregation &amp; subqueries — asking harder questions</h2>
<p class="lead">To answer "how many students per class?" you group rows and count. To answer "which classes are above average?" you nest one query inside another.</p>
<pre><span class="tok-keyword">SELECT</span> classId, <span class="tok-function">COUNT</span>(*) <span class="tok-keyword">AS</span> total
<span class="tok-keyword">FROM</span> Student
<span class="tok-keyword">GROUP BY</span> classId
<span class="tok-keyword">HAVING</span> <span class="tok-function">COUNT</span>(*) &gt; 30;</pre>
<div class="out">Groups students by class, counts each group, and keeps only classes with more than 30. <b>WHERE</b> filters rows before grouping; <b>HAVING</b> filters groups after.</div>
<pre><span class="tok-comment">-- subquery: students older than the average</span>
<span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> Student
<span class="tok-keyword">WHERE</span> age &gt; (<span class="tok-keyword">SELECT</span> <span class="tok-function">AVG</span>(age) <span class="tok-keyword">FROM</span> Student);</pre>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-408" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Practise: Aggregation & subqueries</span><span class="lc-sub">GROUP BY, HAVING and nested queries.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Tổng hợp &amp; truy vấn con — hỏi câu khó hơn</h2>
<p class="lead">Để trả lời "bao nhiêu sinh viên mỗi lớp?" bạn gom hàng và đếm. Để trả lời "lớp nào trên trung bình?" bạn lồng một truy vấn trong truy vấn khác.</p>
<pre><span class="tok-keyword">SELECT</span> classId, <span class="tok-function">COUNT</span>(*) <span class="tok-keyword">AS</span> total
<span class="tok-keyword">FROM</span> Student
<span class="tok-keyword">GROUP BY</span> classId
<span class="tok-keyword">HAVING</span> <span class="tok-function">COUNT</span>(*) &gt; 30;</pre>
<div class="out">Gom sinh viên theo lớp, đếm mỗi nhóm, và chỉ giữ lớp có hơn 30. <b>WHERE</b> lọc hàng trước khi gom; <b>HAVING</b> lọc nhóm sau khi gom.</div>
<pre><span class="tok-comment">-- truy vấn con: sinh viên lớn hơn tuổi trung bình</span>
<span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> Student
<span class="tok-keyword">WHERE</span> age &gt; (<span class="tok-keyword">SELECT</span> <span class="tok-function">AVG</span>(age) <span class="tok-keyword">FROM</span> Student);</pre>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-408" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Luyện: Tổng hợp & truy vấn con</span><span class="lc-sub">GROUP BY, HAVING và truy vấn lồng.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 3 — SQL DDL & Queries|||Quiz 3 — SQL DDL & Truy vấn',
          slug: 'dbi202-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra DDL, JOIN và tổng hợp.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'An INNER JOIN returns…|||INNER JOIN trả về…', options: ['all rows from both tables|||mọi hàng từ cả hai bảng', 'only rows that match in both tables|||chỉ hàng khớp ở cả hai bảng', 'all left rows|||mọi hàng trái', 'no rows|||không hàng nào'], correctIndex: 1, points: 1 },
              { question: 'WHERE filters rows … grouping; HAVING filters groups … grouping.|||WHERE lọc hàng … gom nhóm; HAVING lọc nhóm … gom nhóm.', options: ['after / before|||sau / trước', 'before / after|||trước / sau', 'both before|||cả hai trước', 'both after|||cả hai sau'], correctIndex: 1, points: 1 },
              { question: 'The CHECK constraint is used to…|||Ràng buộc CHECK dùng để…', options: ['create a foreign key|||tạo khóa ngoại', 'enforce a custom rule on a value|||thực thi luật tùy chỉnh trên giá trị', 'sort the table|||sắp bảng', 'index a column|||đánh chỉ mục cột'], correctIndex: 1, points: 1 },
              { question: 'To count students per class you use…|||Để đếm sinh viên mỗi lớp bạn dùng…', options: ['ORDER BY', 'GROUP BY classId with COUNT(*)|||GROUP BY classId với COUNT(*)', 'DISTINCT only|||chỉ DISTINCT', 'a foreign key|||một khóa ngoại'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — PL/SQL ══════════════════ */
    {
      title: 'Chapter 7 — Programmability: Views, Procedures, Triggers|||Chương 7 — Lập trình: View, Procedure, Trigger',
      description: 'View, Stored Procedure, Function, Cursor và Trigger — logic sống bên trong CSDL.',
      lessons: [
        {
          title: '7.1 — Views, stored procedures, functions & triggers|||7.1 — View, stored procedure, function & trigger',
          slug: 'dbi202-plsql',
          type: 'VIDEO',
          description: 'Đóng gói truy vấn bằng View; logic tái dùng bằng Procedure/Function; phản ứng tự động bằng Trigger.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Programmability — logic inside the database</h2>
<p class="lead">A database is more than tables. You can store <em>logic</em> in it: reusable queries, procedures and automatic reactions. This is CLO6 and a big part of the practical exam.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>View</b> — a saved query you use like a table. Simplifies complex joins and hides columns.</div>
  <div class="lz-layer"><b>Stored Procedure</b> — a named block of SQL with parameters; call it to run a task (e.g. enrol a student).</div>
  <div class="lz-layer"><b>Function</b> — like a procedure but returns a value; usable inside queries.</div>
  <div class="lz-layer"><b>Cursor</b> — steps through query rows one at a time (use sparingly — set-based SQL is faster).</div>
  <div class="lz-layer"><b>Trigger</b> — code that fires automatically on INSERT/UPDATE/DELETE; enforces rules or logs changes.</div>
</div>
<pre><span class="tok-keyword">CREATE VIEW</span> AdultStudents <span class="tok-keyword">AS</span>
  <span class="tok-keyword">SELECT</span> id, name <span class="tok-keyword">FROM</span> Student <span class="tok-keyword">WHERE</span> age &gt;= 18;</pre>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-721" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Practise: Stored procedures & programmable objects</span><span class="lc-sub">Procedures, functions and triggers.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Lập trình — logic bên trong CSDL</h2>
<p class="lead">Một CSDL không chỉ là bảng. Bạn có thể lưu <em>logic</em> trong nó: truy vấn tái dùng, thủ tục và phản ứng tự động. Đây là CLO6 và một phần lớn của thi thực hành.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>View</b> — một truy vấn được lưu, dùng như một bảng. Đơn giản hóa join phức tạp và giấu cột.</div>
  <div class="lz-layer"><b>Stored Procedure</b> — một khối SQL có tên với tham số; gọi để chạy một tác vụ (vd ghi danh sinh viên).</div>
  <div class="lz-layer"><b>Function</b> — như procedure nhưng trả về một giá trị; dùng được trong truy vấn.</div>
  <div class="lz-layer"><b>Cursor</b> — duyệt từng hàng kết quả (dùng dè sẻn — SQL theo tập nhanh hơn).</div>
  <div class="lz-layer"><b>Trigger</b> — code tự chạy khi INSERT/UPDATE/DELETE; thực thi luật hoặc ghi log thay đổi.</div>
</div>
<pre><span class="tok-keyword">CREATE VIEW</span> AdultStudents <span class="tok-keyword">AS</span>
  <span class="tok-keyword">SELECT</span> id, name <span class="tok-keyword">FROM</span> Student <span class="tok-keyword">WHERE</span> age &gt;= 18;</pre>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-721" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Luyện: Stored procedures & đối tượng lập trình</span><span class="lc-sub">Procedure, function và trigger.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — CHỈ MỤC & TỐI ƯU ══════════════════ */
    {
      title: 'Chapter 8 — Indexing & Optimization|||Chương 8 — Chỉ mục & Tối ưu',
      description: 'Chỉ mục làm truy vấn nhanh thế nào, cái giá của chúng, và giao dịch ACID.',
      lessons: [
        {
          title: '8.1 — Indexes & query performance|||8.1 — Chỉ mục & hiệu năng truy vấn',
          slug: 'dbi202-chi-muc',
          type: 'VIDEO',
          description: 'Chỉ mục = "mục lục" của bảng: tìm O(log n) thay vì quét O(n); nhưng làm ghi chậm hơn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Indexing — making queries fast</h2>
<p class="lead">Without an index, finding a row means scanning the whole table — O(n). An <strong>index</strong> is like a book's index: a sorted structure (usually a B-tree) that lets the DBMS jump to matching rows in O(log n).</p>
<pre><span class="tok-keyword">CREATE INDEX</span> idx_student_email <span class="tok-keyword">ON</span> Student(email);</pre>
<div class="pitfall"><b>The trade-off:</b> indexes speed up reads but slow down writes (every INSERT/UPDATE must also update the index) and use disk. Index the columns you filter/join on often — not every column.</div>
<h3>Transactions & ACID</h3>
<p>A <strong>transaction</strong> groups statements so they all succeed or all roll back — the foundation of reliable databases. It guarantees <span class="badge">ACID</span>: Atomicity, Consistency, Isolation, Durability.</p>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-720" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Practise: Indexing strategies</span><span class="lc-sub">Indexing & advanced schema design.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Chỉ mục — làm truy vấn nhanh</h2>
<p class="lead">Không có chỉ mục, tìm một hàng là quét cả bảng — O(n). Một <strong>chỉ mục (index)</strong> giống mục lục của sách: một cấu trúc đã sắp (thường là B-tree) cho phép DBMS nhảy tới hàng khớp trong O(log n).</p>
<pre><span class="tok-keyword">CREATE INDEX</span> idx_student_email <span class="tok-keyword">ON</span> Student(email);</pre>
<div class="pitfall"><b>Đánh đổi:</b> chỉ mục tăng tốc đọc nhưng làm chậm ghi (mỗi INSERT/UPDATE phải cập nhật cả chỉ mục) và tốn đĩa. Đánh chỉ mục các cột bạn lọc/join thường xuyên — không phải mọi cột.</div>
<h3>Giao dịch &amp; ACID</h3>
<p>Một <strong>giao dịch (transaction)</strong> gom các câu lệnh để tất cả thành công hoặc tất cả hoàn tác — nền tảng của CSDL đáng tin. Nó đảm bảo <span class="badge">ACID</span>: Nguyên tử, Nhất quán, Cô lập, Bền vững.</p>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-720" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Luyện: Chiến lược đánh chỉ mục</span><span class="lc-sub">Chỉ mục & thiết kế lược đồ nâng cao.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 4 — Programmability, Indexing & ACID|||Quiz 4 — Lập trình, Chỉ mục & ACID',
          slug: 'dbi202-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra View/Procedure/Trigger, chỉ mục và giao dịch.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A View is…|||View là…', options: ['a physical copy of data|||một bản sao vật lý của dữ liệu', 'a saved query used like a table|||một truy vấn được lưu, dùng như bảng', 'an index|||một chỉ mục', 'a backup|||một bản backup'], correctIndex: 1, points: 1 },
              { question: 'A Trigger runs…|||Trigger chạy…', options: ['only when you call it|||chỉ khi bạn gọi', 'automatically on INSERT/UPDATE/DELETE|||tự động khi INSERT/UPDATE/DELETE', 'once a day|||một lần mỗi ngày', 'never|||không bao giờ'], correctIndex: 1, points: 1 },
              { question: 'An index speeds up reads but…|||Chỉ mục tăng tốc đọc nhưng…', options: ['also speeds up writes|||cũng tăng tốc ghi', 'slows down writes and uses disk|||làm chậm ghi và tốn đĩa', 'deletes data|||xóa dữ liệu', 'has no downside|||không có nhược điểm'], correctIndex: 1, points: 1 },
              { question: 'ACID guarantees that a transaction is…|||ACID đảm bảo một giao dịch là…', options: ['fast|||nhanh', 'all-or-nothing and reliable (Atomic, Consistent, Isolated, Durable)|||được-ăn-cả-ngã-về-không và đáng tin (Nguyên tử, Nhất quán, Cô lập, Bền vững)', 'indexed|||được đánh chỉ mục', 'read-only|||chỉ đọc'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* END-SECTIONS-MARKER */
  ],
};
