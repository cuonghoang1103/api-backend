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
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The three-level architecture &amp; data independence.</b> ANSI-SPARC splits a DBMS into three layers: the <em>physical</em> level (how bytes sit on disk), the <em>logical</em> level (tables and relationships), and the <em>external</em> level (per-user views). This separation gives <b>data independence</b> — you can add an index or reorganise storage without rewriting a single query. That decoupling is the quiet reason applications survive decades of schema evolution. <em>Textbooks list DBMS benefits but rarely name the architecture that delivers them.</em></div>
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
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kiến trúc ba mức &amp; độc lập dữ liệu.</b> ANSI-SPARC chia DBMS thành ba tầng: mức <em>vật lý</em> (byte nằm trên đĩa thế nào), mức <em>logic</em> (bảng và liên kết), và mức <em>ngoài</em> (view riêng từng người dùng). Sự tách biệt này cho <b>độc lập dữ liệu</b> — bạn có thể thêm chỉ mục hay tổ chức lại lưu trữ mà không phải viết lại một truy vấn nào. Đó là lý do thầm lặng khiến ứng dụng sống sót qua hàng chục năm tiến hóa lược đồ. <em>Giáo trình liệt kê lợi ích DBMS nhưng hiếm khi gọi tên kiến trúc tạo ra chúng.</em></div>
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
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Super keys, candidate keys &amp; surrogate vs natural.</b> A <em>super key</em> is any column set that is unique; a <em>candidate key</em> is a minimal super key (remove any column and it stops being unique). A table can have several candidate keys — you pick one as the primary key. Real teams then debate <b>natural keys</b> (a meaningful column like email) versus <b>surrogate keys</b> (a meaningless auto-increment / IDENTITY id). Surrogates usually win because natural values change and break every foreign key that copied them. <em>The syllabus teaches PK/FK; the key hierarchy and this design choice are what interviews probe.</em></div>
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
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Siêu khóa, khóa dự tuyển &amp; khóa nhân tạo vs tự nhiên.</b> <em>Siêu khóa</em> là bất kỳ tập cột nào có tính duy nhất; <em>khóa dự tuyển</em> là siêu khóa tối tiểu (bỏ cột nào cũng mất tính duy nhất). Một bảng có thể có nhiều khóa dự tuyển — bạn chọn một làm khóa chính. Rồi các đội thật tranh luận giữa <b>khóa tự nhiên</b> (cột có ý nghĩa như email) và <b>khóa nhân tạo</b> (id tự tăng / IDENTITY vô nghĩa). Khóa nhân tạo thường thắng vì giá trị tự nhiên hay đổi và làm hỏng mọi khóa ngoại đã sao chép nó. <em>Giáo trình dạy PK/FK; còn phân cấp khóa và lựa chọn thiết kế này là thứ phỏng vấn hay hỏi.</em></div>
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
<h3>Worked example · a 3-step relational algebra query</h3>
<div class="out"><b>Query:</b> "Names of students older than 20 who are enrolled in course &#39;DBI202&#39;."<br>Tables: Student(StudentID, Name, Age), Enrollment(StudentID, CourseID).<br><b>Step 1 — join:</b> Student ⋈ Enrollment (match on StudentID) → one row per (student, course) pair, with Name/Age/CourseID together.<br><b>Step 2 — select:</b> σ<sub>Age&gt;20 ∧ CourseID=&#39;DBI202&#39;</sub>(Student ⋈ Enrollment) → keep only the rows matching both conditions.<br><b>Step 3 — project:</b> π<sub>Name</sub>( σ<sub>Age&gt;20 ∧ CourseID=&#39;DBI202&#39;</sub>(Student ⋈ Enrollment) ) → final answer: just the Name column.<br><b>In SQL:</b> <code>SELECT Name FROM Student JOIN Enrollment USING(StudentID) WHERE Age&gt;20 AND CourseID=&#39;DBI202&#39;;</code> — same three steps, same order (join, then filter, then pick columns) — this is exactly why relational algebra reads like a recipe for how the query planner executes your SQL.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Sets vs bags — why SQL keeps duplicates.</b> Pure relational algebra works on <em>sets</em>: no duplicate rows exist. But real SQL works on <em>bags</em> (multisets) — <span class="badge">SELECT age FROM Student</span> can return 20 three times. That is why <b>SELECT DISTINCT</b> exists and why <b>UNION</b> removes duplicates while <b>UNION ALL</b> does not. Keeping duplicates is a deliberate performance choice: de-duplicating every result would force a costly sort or hash. <em>The algebra you learn is set-based; the SQL you run is bag-based, and knowing the gap explains a whole class of surprising results.</em></div>
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
<h3>Ví dụ có lời giải · truy vấn đại số quan hệ 3 bước</h3>
<div class="out"><b>Truy vấn:</b> "Tên các sinh viên trên 20 tuổi đang học môn &#39;DBI202&#39;."<br>Bảng: Student(StudentID, Name, Age), Enrollment(StudentID, CourseID).<br><b>Bước 1 — nối:</b> Student ⋈ Enrollment (khớp theo StudentID) → mỗi hàng là một cặp (sinh viên, môn), có cả Name/Age/CourseID.<br><b>Bước 2 — chọn:</b> σ<sub>Age&gt;20 ∧ CourseID=&#39;DBI202&#39;</sub>(Student ⋈ Enrollment) → chỉ giữ hàng thỏa cả hai điều kiện.<br><b>Bước 3 — chiếu:</b> π<sub>Name</sub>( σ<sub>Age&gt;20 ∧ CourseID=&#39;DBI202&#39;</sub>(Student ⋈ Enrollment) ) → kết quả cuối: chỉ cột Name.<br><b>Bằng SQL:</b> <code>SELECT Name FROM Student JOIN Enrollment USING(StudentID) WHERE Age&gt;20 AND CourseID=&#39;DBI202&#39;;</code> — cùng ba bước, cùng thứ tự (nối, rồi lọc, rồi chọn cột) — đây chính là lý do đại số quan hệ đọc như công thức để bộ lập kế hoạch truy vấn thực thi câu SQL của bạn.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tập hợp vs túi — vì sao SQL giữ dòng trùng.</b> Đại số quan hệ thuần túy làm việc trên <em>tập hợp</em>: không có dòng trùng. Nhưng SQL thật làm việc trên <em>túi</em> (đa tập) — <span class="badge">SELECT age FROM Student</span> có thể trả về 20 ba lần. Đó là lý do có <b>SELECT DISTINCT</b> và vì sao <b>UNION</b> khử trùng còn <b>UNION ALL</b> thì không. Giữ dòng trùng là lựa chọn hiệu năng có chủ ý: khử trùng mọi kết quả sẽ buộc phải sắp xếp hoặc băm tốn kém. <em>Đại số bạn học dựa trên tập hợp; SQL bạn chạy dựa trên túi, và hiểu khoảng cách này giải thích cả một loạt kết quả gây bất ngờ.</em></div>
<div class="note-ct">Đề thi hay yêu cầu viết một truy vấn bằng đại số quan hệ VÀ bằng SQL. Chúng ánh xạ gần như một-một — σ là WHERE, π là danh sách SELECT, ⋈ là JOIN.</div>
</div>
`,
        },
        {
          title: '2.3 — Joins, outer joins & division in algebra|||2.3 — Phép nối, nối ngoài & phép chia trong đại số',
          slug: 'dbi202-dai-so-nang-cao',
          type: 'VIDEO',
          description: 'Các phép còn lại của đại số quan hệ — nối tự nhiên, nối theo điều kiện, nối ngoài, phép chia — có bảng kết quả từng bước.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The operators that answer real questions</h2>
<p class="lead">Selection and projection filter one table. The interesting questions — "which students take every course this lecturer teaches?" — need the operators that <em>combine</em> tables. Every SQL query you will ever write compiles down to these.</p>

<h3>The sample data used throughout</h3>
<div class="diagram">Student(sid, name)          Enrol(sid, cid)         Course(cid, title)
  1  An                       1  DB                    DB   Databases
  2  Binh                     1  OS                    OS   Operating Sys
  3  Chi                      2  DB                    NW   Networking</div>

<h3>Natural join ⋈ — match on every common attribute</h3>
<div class="out"><b>Student ⋈ Enrol</b> matches on <span class="badge">sid</span> (the only shared column):<br>
(1, An, DB) · (1, An, OS) · (2, Binh, DB)<br>
<b>Chi disappears</b> — she enrols in nothing, and a natural join keeps only rows that match on both sides. Three input rows on the left produced three output rows, but not the same three: An was duplicated and Chi was dropped.</div>

<h3>Theta join ⋈<sub>θ</sub> — match on any condition</h3>
<p>Written <span class="badge">R ⋈<sub>θ</sub> S = σ<sub>θ</sub>(R × S)</span>: form every pair, then keep those satisfying θ. Use it when the columns have different names or the test is not equality (<span class="badge">salary &gt; budget</span>, date ranges).</p>

<h3>Outer joins — keep the unmatched rows</h3>
<table><thead><tr><th>Operator</th><th>Keeps</th><th>Result on Student ⟕ Enrol</th></tr></thead><tbody>
<tr><td>Left outer ⟕</td><td>all of the left</td><td>the 3 matches <b>+ (3, Chi, NULL)</b></td></tr>
<tr><td>Right outer ⟖</td><td>all of the right</td><td>only the 3 matches (every enrolment has a student)</td></tr>
<tr><td>Full outer ⟗</td><td>both sides</td><td>the 3 matches + Chi</td></tr>
</tbody></table>
<p>Unmatched rows get NULL in the missing columns — which is exactly how you answer "who has <em>no</em> enrolments": left join, then keep rows where the right side is NULL.</p>

<h3>Division ÷ — the "for all" operator</h3>
<p>R ÷ S returns the values in R that are paired with <em>every</em> row of S. It is the only algebra operator that expresses universal quantification, and it has no direct SQL keyword.</p>
<div class="out"><b>Question:</b> which students take <em>all</em> courses in {DB, OS}?<br>
Enrol ÷ {DB, OS}: student 1 has {DB, OS} ⊇ {DB, OS} ✓ · student 2 has only {DB} ✗<br>
<b>Answer: student 1 (An).</b><br>
<b>In SQL you write it as a double negation:</b> "students for whom there does <em>not</em> exist a course in S that they have <em>not</em> taken" — <span class="badge">NOT EXISTS ( … NOT EXISTS … )</span>. Recognising the division pattern is what turns that intimidating query into a mechanical translation (lesson 6.4).</div>

<h3>Set operators — and their one rule</h3>
<p><span class="badge">∪</span>, <span class="badge">∩</span>, <span class="badge">−</span> require both relations to be <strong>union-compatible</strong>: same number of attributes, same domains, in the same order. Difference answers "which students enrol in DB but not OS?".</p>

<div class="pitfall"><b>A natural join on the "wrong" common column silently gives nonsense.</b> If both tables happen to have a column called <span class="badge">name</span>, the natural join matches on <em>name as well as</em> the key, and you lose rows without any error message. Professionals avoid <span class="badge">NATURAL JOIN</span> in SQL for exactly this reason and always name the condition explicitly.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The algebra is not academic decoration — it is the query optimiser's language.</b> SQL Server parses your query into a relational-algebra tree, then rewrites it with algebraic equivalences: push selections below joins (filter early, join less), reorder joins by estimated size, turn a subquery into a semi-join. That is why <span class="badge">WHERE</span> placement rarely changes performance — the optimiser has already normalised it. Understanding the algebra is understanding what the optimiser is allowed to do. <em>Beyond syllabus because the course presents the algebra as theory, while it is the actual intermediate representation inside every database engine.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Những phép toán trả lời câu hỏi thật</h2>
<p class="lead">Phép chọn và phép chiếu chỉ lọc một bảng. Các câu hỏi thú vị — "sinh viên nào học tất cả các môn mà giảng viên này dạy?" — cần những phép <em>kết hợp</em> nhiều bảng. Mọi truy vấn SQL bạn từng viết đều biên dịch xuống các phép này.</p>

<h3>Bộ dữ liệu mẫu dùng xuyên bài</h3>
<div class="diagram">Student(sid, name)          Enrol(sid, cid)         Course(cid, title)
  1  An                       1  DB                    DB   Databases
  2  Binh                     1  OS                    OS   Operating Sys
  3  Chi                      2  DB                    NW   Networking</div>

<h3>Nối tự nhiên ⋈ — khớp trên mọi thuộc tính chung</h3>
<div class="out"><b>Student ⋈ Enrol</b> khớp theo <span class="badge">sid</span> (cột chung duy nhất):<br>
(1, An, DB) · (1, An, OS) · (2, Binh, DB)<br>
<b>Chi biến mất</b> — cô ấy không đăng ký môn nào, mà nối tự nhiên chỉ giữ những dòng khớp được ở cả hai phía. Ba dòng đầu vào bên trái cho ra ba dòng kết quả, nhưng không phải cùng ba dòng đó: An bị nhân đôi còn Chi bị loại.</div>

<h3>Nối theo điều kiện ⋈<sub>θ</sub> — khớp theo điều kiện bất kỳ</h3>
<p>Viết là <span class="badge">R ⋈<sub>θ</sub> S = σ<sub>θ</sub>(R × S)</span>: ghép mọi cặp rồi giữ những cặp thoả θ. Dùng khi hai cột khác tên hoặc phép so sánh không phải là bằng (<span class="badge">salary &gt; budget</span>, khoảng ngày tháng).</p>

<h3>Nối ngoài — giữ lại cả những dòng không khớp</h3>
<table><thead><tr><th>Phép</th><th>Giữ lại</th><th>Kết quả trên Student ⟕ Enrol</th></tr></thead><tbody>
<tr><td>Nối ngoài trái ⟕</td><td>toàn bộ bên trái</td><td>3 dòng khớp <b>+ (3, Chi, NULL)</b></td></tr>
<tr><td>Nối ngoài phải ⟖</td><td>toàn bộ bên phải</td><td>chỉ 3 dòng khớp (mọi đăng ký đều có sinh viên)</td></tr>
<tr><td>Nối ngoài đầy đủ ⟗</td><td>cả hai phía</td><td>3 dòng khớp + Chi</td></tr>
</tbody></table>
<p>Dòng không khớp nhận NULL ở các cột thiếu — và đó đúng là cách trả lời "ai <em>không</em> đăng ký môn nào": nối ngoài trái rồi giữ những dòng có phía phải là NULL.</p>

<h3>Phép chia ÷ — phép toán "với mọi"</h3>
<p>R ÷ S trả về các giá trị trong R được ghép cặp với <em>mọi</em> dòng của S. Đây là phép duy nhất trong đại số diễn đạt lượng từ phổ quát, và nó không có từ khoá SQL tương ứng.</p>
<div class="out"><b>Câu hỏi:</b> sinh viên nào học <em>tất cả</em> các môn trong {DB, OS}?<br>
Enrol ÷ {DB, OS}: sinh viên 1 có {DB, OS} ⊇ {DB, OS} ✓ · sinh viên 2 chỉ có {DB} ✗<br>
<b>Đáp án: sinh viên 1 (An).</b><br>
<b>Trong SQL bạn viết nó bằng phủ định hai lần:</b> "những sinh viên mà <em>không</em> tồn tại môn nào trong S mà họ <em>chưa</em> học" — <span class="badge">NOT EXISTS ( … NOT EXISTS … )</span>. Nhận ra khuôn phép chia chính là thứ biến truy vấn đáng sợ đó thành một phép dịch máy móc (bài 6.4).</div>

<h3>Phép toán tập hợp — và quy tắc duy nhất của chúng</h3>
<p><span class="badge">∪</span>, <span class="badge">∩</span>, <span class="badge">−</span> đòi hỏi hai quan hệ phải <strong>khả hợp</strong>: cùng số thuộc tính, cùng miền giá trị, cùng thứ tự. Phép trừ trả lời "sinh viên nào học DB mà không học OS?".</p>

<div class="pitfall"><b>Nối tự nhiên trên cột chung "không mong muốn" âm thầm cho kết quả vô nghĩa.</b> Nếu cả hai bảng tình cờ cùng có cột tên <span class="badge">name</span>, phép nối tự nhiên sẽ khớp <em>cả theo name lẫn</em> khoá, và bạn mất dòng mà không có thông báo lỗi nào. Dân chuyên nghiệp tránh <span class="badge">NATURAL JOIN</span> trong SQL đúng vì lý do này và luôn ghi rõ điều kiện nối.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đại số quan hệ không phải trang trí hàn lâm — nó là ngôn ngữ của bộ tối ưu truy vấn.</b> SQL Server phân tích truy vấn của bạn thành một cây đại số quan hệ, rồi viết lại bằng các tương đương đại số: đẩy phép chọn xuống dưới phép nối (lọc sớm, nối ít đi), đổi thứ tự nối theo kích thước ước lượng, biến truy vấn con thành phép nửa nối. Đó là lý do vị trí của <span class="badge">WHERE</span> hiếm khi đổi hiệu năng — bộ tối ưu đã chuẩn hoá nó rồi. Hiểu đại số là hiểu bộ tối ưu được phép làm gì. <em>Ngoài giáo trình vì môn học trình bày đại số như lý thuyết, trong khi nó là biểu diễn trung gian có thật bên trong mọi bộ máy cơ sở dữ liệu.</em></div>
</div>
`,
        },
        {
          title: '2.4 — Constraints on relations|||2.4 — Ràng buộc trên quan hệ',
          slug: 'dbi202-rang-buoc-quan-he',
          type: 'VIDEO',
          description: 'Khoá, khoá ngoại, toàn vẹn tham chiếu và ràng buộc miền — diễn đạt bằng đại số và bằng SQL.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Constraints — the rules the data can never break</h2>
<p class="lead">A schema says what data <em>looks</em> like; constraints say what data is <em>allowed</em>. Enforcing them in the database rather than in application code is the difference between "we hope the data is clean" and "the data cannot be dirty".</p>

<h3>The four families</h3>
<table><thead><tr><th>Family</th><th>Meaning</th><th>SQL</th></tr></thead><tbody>
<tr><td><b>Key</b></td><td>no two rows share this value; it is not null</td><td>PRIMARY KEY / UNIQUE</td></tr>
<tr><td><b>Referential integrity</b></td><td>this value must exist in another relation</td><td>FOREIGN KEY … REFERENCES</td></tr>
<tr><td><b>Domain</b></td><td>the value must lie in an allowed set/range</td><td>CHECK, data type, NOT NULL</td></tr>
<tr><td><b>General / tuple</b></td><td>a rule across columns or rows</td><td>CHECK, trigger (lesson 7.4)</td></tr>
</tbody></table>

<h3>Keys: candidate, primary, super</h3>
<div class="out"><b>Student(sid, email, name, dob).</b><br>
<em>Superkey</em> — any set that determines the row uniquely: {sid}, {sid, name}, {email, dob}…<br>
<em>Candidate key</em> — a <b>minimal</b> superkey: {sid} and {email}. Removing any attribute would break uniqueness.<br>
<em>Primary key</em> — the candidate key you choose: <b>sid</b>. The other candidate keys become UNIQUE constraints.<br>
<b>Why sid and not email?</b> A primary key should be short, immutable and never null. Email is unique but people change it — and every foreign key referencing it would have to change too.</div>

<h3>Referential integrity, expressed in algebra</h3>
<div class="formula"><span class="lbl">FOREIGN KEY</span>π<sub>sid</sub>(Enrol) ⊆ π<sub>sid</sub>(Student)</div>
<p>Read it literally: every sid appearing in Enrol must also appear in Student. Equivalently <span class="badge">π<sub>sid</sub>(Enrol) − π<sub>sid</sub>(Student) = ∅</span> — and that difference is exactly the query an auditor runs to find orphaned rows in a database whose foreign keys were never declared.</p>

<h3>What happens when you delete a referenced row</h3>
<pre><span class="tok-keyword">FOREIGN KEY</span> (sid) <span class="tok-keyword">REFERENCES</span> Student(sid)
    <span class="tok-keyword">ON DELETE</span> NO ACTION    <span class="tok-comment">-- default: refuse the delete</span>
    <span class="tok-keyword">ON UPDATE</span> CASCADE      <span class="tok-comment">-- propagate a changed key</span></pre>
<table><thead><tr><th>Policy</th><th>Effect</th><th>Use when</th></tr></thead><tbody>
<tr><td>NO ACTION / RESTRICT</td><td>the delete fails</td><td>the child row must never be orphaned (invoices)</td></tr>
<tr><td>CASCADE</td><td>children are deleted too</td><td>children are meaningless alone (order lines)</td></tr>
<tr><td>SET NULL</td><td>the reference becomes NULL</td><td>the link is optional (employee → manager)</td></tr>
</tbody></table>
<div class="out"><b>Worked example.</b> Delete student 1 while Enrol holds (1, DB) and (1, OS).<br>
NO ACTION → the DBMS rejects the DELETE with a foreign-key error; you must remove the enrolments first.<br>
CASCADE → the two enrolment rows disappear with the student, in the same transaction.<br>
SET NULL → <b>fails here</b>, because Enrol.sid is part of that table's primary key and a key column cannot be null. This is the exact combination that trips people up in the lab.</div>

<div class="pitfall"><b>"We validate it in Java, so we do not need the constraint."</b> Application checks race each other under concurrency, are bypassed by scripts, imports and the next application, and cannot see rows another transaction is inserting. The database is the only place where a rule holds for <em>every</em> writer. Validate in the app for a friendly message; enforce in the database for correctness.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Constraints make queries faster, not just safer.</b> The optimiser reads them: a UNIQUE constraint tells it a join produces at most one match (so it can skip a sort and a duplicate check), a NOT NULL lets it drop a null test, a CHECK constraint lets it prune whole partitions. Declaring a foreign key can therefore <em>speed up</em> a query plan even though it adds a write-time check. <em>Beyond syllabus because the course frames constraints purely as data integrity, while they are also the optimiser's main source of truth about your data.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Ràng buộc — những luật mà dữ liệu không bao giờ được phá</h2>
<p class="lead">Lược đồ nói dữ liệu <em>trông</em> như thế nào; ràng buộc nói dữ liệu <em>được phép</em> như thế nào. Áp đặt chúng trong cơ sở dữ liệu thay vì trong mã ứng dụng là khác biệt giữa "chúng ta hy vọng dữ liệu sạch" và "dữ liệu không thể bẩn".</p>

<h3>Bốn họ ràng buộc</h3>
<table><thead><tr><th>Họ</th><th>Ý nghĩa</th><th>SQL</th></tr></thead><tbody>
<tr><td><b>Khoá</b></td><td>không hai dòng trùng giá trị này; và không null</td><td>PRIMARY KEY / UNIQUE</td></tr>
<tr><td><b>Toàn vẹn tham chiếu</b></td><td>giá trị này phải tồn tại ở quan hệ khác</td><td>FOREIGN KEY … REFERENCES</td></tr>
<tr><td><b>Miền giá trị</b></td><td>giá trị phải nằm trong tập/khoảng cho phép</td><td>CHECK, kiểu dữ liệu, NOT NULL</td></tr>
<tr><td><b>Tổng quát / theo bộ</b></td><td>luật vắt qua nhiều cột hoặc nhiều dòng</td><td>CHECK, trigger (bài 7.4)</td></tr>
</tbody></table>

<h3>Khoá: candidate, primary, super</h3>
<div class="out"><b>Student(sid, email, name, dob).</b><br>
<em>Siêu khoá</em> — tập bất kỳ xác định duy nhất một dòng: {sid}, {sid, name}, {email, dob}…<br>
<em>Khoá dự tuyển</em> — siêu khoá <b>tối tiểu</b>: {sid} và {email}. Bỏ bất kỳ thuộc tính nào là mất tính duy nhất.<br>
<em>Khoá chính</em> — khoá dự tuyển bạn chọn: <b>sid</b>. Các khoá dự tuyển còn lại trở thành ràng buộc UNIQUE.<br>
<b>Vì sao chọn sid mà không chọn email?</b> Khoá chính nên ngắn, bất biến và không bao giờ null. Email thì duy nhất nhưng người ta có đổi — và mọi khoá ngoại tham chiếu tới nó cũng sẽ phải đổi theo.</div>

<h3>Toàn vẹn tham chiếu, diễn đạt bằng đại số</h3>
<div class="formula"><span class="lbl">KHOÁ NGOẠI</span>π<sub>sid</sub>(Enrol) ⊆ π<sub>sid</sub>(Student)</div>
<p>Đọc đúng nghĩa đen: mọi sid xuất hiện trong Enrol đều phải có mặt trong Student. Tương đương <span class="badge">π<sub>sid</sub>(Enrol) − π<sub>sid</sub>(Student) = ∅</span> — và phép trừ đó chính là truy vấn mà người kiểm toán chạy để tìm các dòng mồ côi trong một cơ sở dữ liệu chưa từng khai báo khoá ngoại.</p>

<h3>Chuyện gì xảy ra khi xoá một dòng đang được tham chiếu</h3>
<pre><span class="tok-keyword">FOREIGN KEY</span> (sid) <span class="tok-keyword">REFERENCES</span> Student(sid)
    <span class="tok-keyword">ON DELETE</span> NO ACTION    <span class="tok-comment">-- mặc định: từ chối phép xoá</span>
    <span class="tok-keyword">ON UPDATE</span> CASCADE      <span class="tok-comment">-- lan truyền khi khoá đổi</span></pre>
<table><thead><tr><th>Chính sách</th><th>Hiệu ứng</th><th>Dùng khi</th></tr></thead><tbody>
<tr><td>NO ACTION / RESTRICT</td><td>phép xoá thất bại</td><td>dòng con không bao giờ được mồ côi (hoá đơn)</td></tr>
<tr><td>CASCADE</td><td>các dòng con bị xoá theo</td><td>dòng con vô nghĩa nếu đứng một mình (dòng chi tiết đơn hàng)</td></tr>
<tr><td>SET NULL</td><td>tham chiếu thành NULL</td><td>liên kết là tuỳ chọn (nhân viên → quản lý)</td></tr>
</tbody></table>
<div class="out"><b>Ví dụ có lời giải.</b> Xoá sinh viên 1 trong khi Enrol đang có (1, DB) và (1, OS).<br>
NO ACTION → DBMS từ chối lệnh DELETE với lỗi khoá ngoại; bạn phải xoá các đăng ký trước.<br>
CASCADE → hai dòng đăng ký biến mất cùng sinh viên, trong cùng một giao dịch.<br>
SET NULL → <b>thất bại ở đây</b>, vì Enrol.sid là một phần khoá chính của bảng đó, mà cột khoá thì không được null. Đây đúng là tổ hợp làm sinh viên vấp trong bài lab.</div>

<div class="pitfall"><b>"Bọn em kiểm ở Java rồi nên không cần ràng buộc."</b> Kiểm ở tầng ứng dụng thì tranh chấp nhau khi chạy đồng thời, bị bỏ qua bởi script, bởi các lần nhập dữ liệu và bởi ứng dụng kế tiếp, và không nhìn thấy dòng mà một giao dịch khác đang chèn. Cơ sở dữ liệu là nơi duy nhất một luật đúng với <em>mọi</em> người ghi. Hãy kiểm ở ứng dụng để có thông báo thân thiện; nhưng áp đặt ở cơ sở dữ liệu để đúng đắn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ràng buộc làm truy vấn nhanh hơn, chứ không chỉ an toàn hơn.</b> Bộ tối ưu đọc chúng: ràng buộc UNIQUE cho nó biết phép nối chỉ ra nhiều nhất một dòng khớp (nên bỏ được một bước sắp xếp và một bước khử trùng), NOT NULL cho phép bỏ phép kiểm null, còn ràng buộc CHECK cho phép cắt bỏ cả những phân vùng. Vì thế khai báo một khoá ngoại có thể <em>làm nhanh hơn</em> kế hoạch truy vấn dù nó thêm một phép kiểm lúc ghi. <em>Ngoài giáo trình vì môn học đóng khung ràng buộc thuần tuý là chuyện toàn vẹn dữ liệu, trong khi chúng còn là nguồn sự thật chính của bộ tối ưu về dữ liệu của bạn.</em></div>
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
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Weak entities &amp; the extended ER (ISA).</b> Some entities cannot be identified on their own — an <em>OrderLine</em> only makes sense inside an <em>Order</em>. That is a <b>weak entity</b>: it borrows part of its key from a stronger identifying owner (drawn with a double rectangle). The Enhanced ER model adds <b>specialization/generalization</b> — an <em>ISA</em> hierarchy where Employee splits into Manager and Engineer, much like a subclass. <em>Basic ER covers entities and relationships; weak entities and ISA are what you need to model real, layered domains.</em></div>
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
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thực thể yếu &amp; ER mở rộng (ISA).</b> Vài thực thể không thể tự định danh — một <em>OrderLine</em> (dòng đơn hàng) chỉ có nghĩa bên trong một <em>Order</em>. Đó là <b>thực thể yếu</b>: nó mượn một phần khóa từ một chủ định danh mạnh hơn (vẽ bằng hình chữ nhật kép). Mô hình ER nâng cao thêm <b>chuyên biệt hóa/tổng quát hóa</b> — một phân cấp <em>ISA</em> nơi Employee tách thành Manager và Engineer, giống như lớp con. <em>ER cơ bản dạy thực thể và liên kết; thực thể yếu và ISA mới là thứ cần để mô hình các miền thực có phân tầng.</em></div>
<a class="link-card exphub" href="/exp-hub/dbi202-cai-dat-sql-server?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems" target="_blank" rel="noopener">
  <span class="lc-ico">✏️</span>
  <span class="lc-body"><span class="lc-title">Vẽ sơ đồ ER (công cụ trong guide cài đặt)</span><span class="lc-sub">draw.io / SSMS database diagrams.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — Weak entities, n-ary & multivalued attributes|||3.2 — Thực thể yếu, liên kết n-ngôi & thuộc tính đa trị',
          slug: 'dbi202-er-nang-cao',
          type: 'VIDEO',
          description: 'Những cấu trúc ER mà bài 3.1 chưa nói: thực thể yếu, liên kết ba ngôi, thuộc tính đa trị/phức hợp, ràng buộc tham gia.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>The ER constructs that appear in every real exam question</h2>
<p class="lead">Lesson 3.1 covered entities, attributes and binary relationships. Assignments and the PE almost always add one of the four structures below — and each has exactly one correct translation into tables.</p>

<h3>1. Weak entity sets</h3>
<p>A <strong>weak entity</strong> has no key of its own; it is identified only in combination with an owner. Its own attributes form a <em>partial key</em> (discriminator), drawn with a dashed underline, and the identifying relationship is drawn with a double diamond.</p>
<div class="diagram">[Building] ══&lt;has&gt;══ [[Room]]
 bid (PK)              room_no (partial key)

→ Room(bid, room_no, area)   PK = (bid, room_no),  FK bid → Building</div>
<div class="out"><b>Why it must be weak.</b> "Room 101" is meaningless on its own — every building has one. The key must include the owner. Other classic weak entities: <em>OrderLine</em> inside an order, <em>Dependant</em> of an employee, <em>Episode</em> of a series.<br>
<b>Rule:</b> a weak entity always gets the owner's key added to its own primary key, and its foreign key is normally <span class="badge">ON DELETE CASCADE</span> — deleting the building deletes its rooms.</div>

<h3>2. Cardinality and participation</h3>
<table><thead><tr><th>Notation</th><th>Meaning</th><th>Translation</th></tr></thead><tbody>
<tr><td>1 : 1</td><td>each side matches at most one</td><td>FK on either side (put it on the side with total participation), UNIQUE</td></tr>
<tr><td>1 : N</td><td>one parent, many children</td><td><b>FK on the N side</b> — no extra table</td></tr>
<tr><td>M : N</td><td>many to many</td><td><b>a new table</b> with both keys as a composite PK</td></tr>
<tr><td>Total participation (double line)</td><td>every entity must take part</td><td>FK <span class="badge">NOT NULL</span></td></tr>
<tr><td>Partial participation</td><td>participation is optional</td><td>FK nullable</td></tr>
</tbody></table>

<h3>3. Ternary relationships — and when to avoid them</h3>
<div class="diagram">[Lecturer] ──┐
             ├──&lt;Teaches&gt;── [Semester]
[Course]  ───┘

→ Teaches(lid, cid, sem_id, room)   PK = (lid, cid, sem_id)</div>
<div class="out"><b>When a ternary relationship is genuinely needed:</b> when the fact only makes sense with all three together. "Lecturer L teaches course C in semester S" cannot be split into "L teaches C" plus "C runs in S" without losing information — that split would say L teaches C in <em>every</em> semester C runs.<br>
<b>When it is not:</b> if each pair is independent, use two binary relationships. Ask: "can I reconstruct the ternary table by joining the binary ones?" If yes, the ternary is redundant.</div>

<h3>4. Multivalued and composite attributes</h3>
<div class="out"><b>Multivalued</b> (a student has several phone numbers) → it cannot live in a column, because that would break 1NF (lesson 4.1). Create a table: <span class="badge">StudentPhone(sid, phone)</span> with PK (sid, phone).<br>
<b>Composite</b> (address = street + city + zip) → flatten into separate columns <span class="badge">street, city, zip</span>, or promote to its own table if it is reused and must be queried by parts.<br>
<b>Derived</b> (age from date of birth) → do <em>not</em> store it; compute it in a view or a query, otherwise it goes stale on every birthday.</div>

<div class="pitfall"><b>Storing "0912345678, 0987654321" in one <span class="badge">phone</span> column</b> is the most common assignment mistake. You then cannot search by one number, cannot index it, and every application must parse the string. It violates 1NF and the marker will spot it immediately.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The relationship that becomes an entity.</b> As soon as a relationship acquires its own attributes and its own identity — an <em>Enrolment</em> with a grade, a date and a status that other tables reference — model it as an entity in its own right ("associative entity"). The signal is when you want a foreign key pointing <em>at the relationship</em>. Domain-driven design calls the result a first-class concept; in practice it is what separates a schema that survives new requirements from one that must be rebuilt. <em>Beyond syllabus because the textbook keeps relationships and entities strictly apart, while the interesting modelling decisions live exactly on that boundary.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Những cấu trúc ER xuất hiện trong mọi đề thi thật</h2>
<p class="lead">Bài 3.1 đã nói về thực thể, thuộc tính và liên kết hai ngôi. Bài tập lớn và PE gần như luôn thêm một trong bốn cấu trúc dưới đây — và mỗi cấu trúc có đúng một cách chuyển sang bảng.</p>

<h3>1. Tập thực thể yếu</h3>
<p><strong>Thực thể yếu</strong> không có khoá riêng; nó chỉ được định danh khi kết hợp với thực thể chủ. Các thuộc tính của nó tạo thành <em>khoá bộ phận</em> (discriminator), vẽ bằng gạch chân nét đứt, còn liên kết định danh vẽ bằng hình thoi kép.</p>
<div class="diagram">[Building] ══&lt;has&gt;══ [[Room]]
 bid (PK)              room_no (khoá bộ phận)

→ Room(bid, room_no, area)   PK = (bid, room_no),  FK bid → Building</div>
<div class="out"><b>Vì sao nó buộc phải yếu.</b> "Phòng 101" đứng một mình thì vô nghĩa — toà nhà nào cũng có một phòng như vậy. Khoá bắt buộc phải kèm khoá của thực thể chủ. Các thực thể yếu kinh điển khác: <em>dòng chi tiết</em> trong đơn hàng, <em>người phụ thuộc</em> của nhân viên, <em>tập phim</em> của một bộ phim.<br>
<b>Quy tắc:</b> thực thể yếu luôn nhận thêm khoá của thực thể chủ vào khoá chính của mình, và khoá ngoại của nó thường là <span class="badge">ON DELETE CASCADE</span> — xoá toà nhà là xoá luôn các phòng.</div>

<h3>2. Bản số và ràng buộc tham gia</h3>
<table><thead><tr><th>Ký hiệu</th><th>Ý nghĩa</th><th>Cách chuyển</th></tr></thead><tbody>
<tr><td>1 : 1</td><td>mỗi bên khớp nhiều nhất một</td><td>đặt FK ở một bên (bên tham gia toàn bộ), kèm UNIQUE</td></tr>
<tr><td>1 : N</td><td>một cha, nhiều con</td><td><b>FK ở phía N</b> — không cần bảng phụ</td></tr>
<tr><td>M : N</td><td>nhiều-nhiều</td><td><b>một bảng mới</b> với khoá chính ghép từ hai khoá</td></tr>
<tr><td>Tham gia toàn bộ (nét đôi)</td><td>mọi thực thể đều phải tham gia</td><td>FK <span class="badge">NOT NULL</span></td></tr>
<tr><td>Tham gia bộ phận</td><td>tham gia là tuỳ chọn</td><td>FK cho phép null</td></tr>
</tbody></table>

<h3>3. Liên kết ba ngôi — và khi nào nên tránh</h3>
<div class="diagram">[Lecturer] ──┐
             ├──&lt;Teaches&gt;── [Semester]
[Course]  ───┘

→ Teaches(lid, cid, sem_id, room)   PK = (lid, cid, sem_id)</div>
<div class="out"><b>Khi nào thật sự cần liên kết ba ngôi:</b> khi sự việc chỉ có nghĩa khi đủ cả ba. "Giảng viên L dạy môn C trong kỳ S" không tách được thành "L dạy C" cộng "C mở trong S" mà không mất thông tin — cách tách đó nói rằng L dạy C trong <em>mọi</em> kỳ mà C được mở.<br>
<b>Khi nào không cần:</b> nếu từng cặp độc lập với nhau, hãy dùng hai liên kết hai ngôi. Hãy tự hỏi: "tôi có dựng lại được bảng ba ngôi bằng cách nối hai bảng hai ngôi không?" Nếu có thì liên kết ba ngôi là thừa.</div>

<h3>4. Thuộc tính đa trị và phức hợp</h3>
<div class="out"><b>Đa trị</b> (một sinh viên có vài số điện thoại) → không nhét vào một cột được, vì như vậy vi phạm 1NF (bài 4.1). Hãy tạo bảng: <span class="badge">StudentPhone(sid, phone)</span> với PK (sid, phone).<br>
<b>Phức hợp</b> (địa chỉ = số nhà + thành phố + mã bưu chính) → trải phẳng thành các cột <span class="badge">street, city, zip</span>, hoặc nâng thành bảng riêng nếu nó được dùng lại và cần truy vấn theo từng phần.<br>
<b>Dẫn xuất</b> (tuổi tính từ ngày sinh) → <em>đừng</em> lưu; hãy tính trong view hoặc trong truy vấn, nếu không nó sai ngay sau mỗi lần sinh nhật.</div>

<div class="pitfall"><b>Lưu "0912345678, 0987654321" vào một cột <span class="badge">phone</span></b> là lỗi phổ biến nhất trong bài tập lớn. Sau đó bạn không tìm được theo một số, không đánh chỉ mục được, và mọi ứng dụng đều phải tự cắt chuỗi. Nó vi phạm 1NF và người chấm nhận ra ngay lập tức.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Liên kết trở thành thực thể.</b> Ngay khi một liên kết có thuộc tính riêng và bản sắc riêng — một <em>Đăng ký học</em> có điểm, có ngày, có trạng thái mà bảng khác tham chiếu tới — hãy mô hình hoá nó thành một thực thể độc lập ("thực thể kết hợp"). Dấu hiệu là khi bạn muốn có một khoá ngoại trỏ <em>vào chính liên kết đó</em>. Thiết kế hướng miền gọi kết quả đó là một khái niệm hạng nhất; trong thực tế, đó là ranh giới giữa một lược đồ sống sót qua yêu cầu mới và một lược đồ phải làm lại từ đầu. <em>Ngoài giáo trình vì sách tách bạch nghiêm ngặt liên kết với thực thể, trong khi các quyết định mô hình hoá thú vị đều nằm đúng trên ranh giới đó.</em></div>
</div>
`,
        },
        {
          title: '3.3 — Subclasses (ISA) & three ways to store them|||3.3 — Lớp con (ISA) & ba cách lưu xuống bảng',
          slug: 'dbi202-er-subclass',
          type: 'VIDEO',
          description: 'Mô hình phân cấp ISA/EER và ba chiến lược chuyển sang quan hệ, kèm so sánh ưu nhược.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Inheritance in a model that has no inheritance</h2>
<p class="lead">Some entities are special cases of others: a Person is a Student or a Lecturer; a Product is a Book, a Disc or a Download. The ER model draws this as an <strong>ISA</strong> triangle. The relational model has no such concept, so the interesting part is choosing how to flatten it.</p>

<div class="diagram">          [Person]  pid, name, dob
              △ ISA
        ┌─────┴─────┐
   [Student]     [Lecturer]
    gpa, year      salary, dept</div>

<h3>Strategy 1 — one table per subclass (the "ER" way)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> Person  (pid <span class="tok-type">INT PRIMARY KEY</span>, name <span class="tok-type">NVARCHAR</span>(100), dob <span class="tok-type">DATE</span>);
<span class="tok-keyword">CREATE TABLE</span> Student (pid <span class="tok-type">INT PRIMARY KEY REFERENCES</span> Person(pid), gpa <span class="tok-type">DECIMAL</span>(3,2), year <span class="tok-type">INT</span>);
<span class="tok-keyword">CREATE TABLE</span> Lecturer(pid <span class="tok-type">INT PRIMARY KEY REFERENCES</span> Person(pid), salary <span class="tok-type">MONEY</span>, dept <span class="tok-type">NVARCHAR</span>(50));</pre>
<p>Shared attributes live once, in Person; each subclass table holds only its own. Reading a full student needs a join.</p>

<h3>Strategy 2 — one table per concrete class (the "OO" way)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> Student (pid, name, dob, gpa, year);      <span class="tok-comment">-- everything repeated</span>
<span class="tok-keyword">CREATE TABLE</span> Lecturer(pid, name, dob, salary, dept);</pre>
<p>No joins, but the common attributes are duplicated in the schema, and a query over "all people" needs a UNION. A person who is both a student and a lecturer is stored twice.</p>

<h3>Strategy 3 — one wide table (the "NULL" way)</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> Person (pid, name, dob, kind <span class="tok-type">CHAR</span>(1), gpa, year, salary, dept,
    <span class="tok-keyword">CONSTRAINT</span> ck_kind <span class="tok-keyword">CHECK</span> (
        (kind = <span class="tok-string">'S'</span> <span class="tok-keyword">AND</span> salary <span class="tok-keyword">IS NULL</span>) <span class="tok-keyword">OR</span> (kind = <span class="tok-string">'L'</span> <span class="tok-keyword">AND</span> gpa <span class="tok-keyword">IS NULL</span>)));</pre>
<p>One table, no joins, but every row carries the columns of every subclass, mostly null — and only a CHECK constraint stops nonsense combinations.</p>

<h3>Which one — the comparison you must be able to argue</h3>
<table><thead><tr><th></th><th>1 · per subclass</th><th>2 · per concrete class</th><th>3 · one wide table</th></tr></thead><tbody>
<tr><td>Query one subclass</td><td>join</td><td><b>fast</b></td><td><b>fast</b> (+ filter)</td></tr>
<tr><td>Query all persons</td><td><b>fast</b></td><td>UNION</td><td><b>fast</b></td></tr>
<tr><td>NULLs</td><td><b>none</b></td><td>none</td><td>many</td></tr>
<tr><td>Overlapping subclasses</td><td><b>natural</b></td><td>duplicated rows</td><td>awkward</td></tr>
<tr><td>Adding a subclass</td><td><b>a new table</b></td><td>a new table</td><td>ALTER the wide table</td></tr>
</tbody></table>
<div class="out"><b>How to choose in an exam answer.</b> Ask two questions: (1) Are subclasses <em>disjoint</em> or overlapping? (2) Are they <em>total</em> (every person is one of them) or partial?<br>
Disjoint + total + few extra attributes → strategy 3 (one table) is simplest.<br>
Overlapping, or many subclass-specific attributes → strategy 1 (per subclass) — the only one that models overlap without duplication.<br>
Subclasses queried separately and almost never together → strategy 2.</div>

<div class="pitfall"><b>Do not give the subclass its own new key.</b> <span class="badge">Student(student_id, pid, …)</span> creates two identities for the same person; nothing then stops two Student rows pointing at one Person. The subclass primary key must <em>be</em> the inherited key: <span class="badge">PRIMARY KEY (pid) REFERENCES Person(pid)</span> — that single line enforces the 1:1 nature of ISA.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Your ORM has already named these strategies.</b> JPA/Hibernate calls them <span class="badge">JOINED</span> (1), <span class="badge">TABLE_PER_CLASS</span> (2) and <span class="badge">SINGLE_TABLE</span> (3) — and defaults to SINGLE_TABLE precisely because it needs no joins. When you meet this again in PRJ301, the annotation is <span class="badge">@Inheritance(strategy = …)</span>, and the trade-off table above is exactly the one that decides it. <em>Beyond syllabus because DBI202 stops at "convert the ISA", while the same decision is a configuration line in every enterprise framework you will use.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Kế thừa trong một mô hình vốn không có kế thừa</h2>
<p class="lead">Có những thực thể là trường hợp riêng của thực thể khác: một Người là Sinh viên hoặc Giảng viên; một Sản phẩm là Sách, Đĩa hoặc bản Tải về. Mô hình ER vẽ điều này bằng tam giác <strong>ISA</strong>. Mô hình quan hệ không có khái niệm đó, nên phần thú vị là chọn cách trải phẳng nó.</p>

<div class="diagram">          [Person]  pid, name, dob
              △ ISA
        ┌─────┴─────┐
   [Student]     [Lecturer]
    gpa, year      salary, dept</div>

<h3>Chiến lược 1 — mỗi lớp con một bảng (kiểu "ER")</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> Person  (pid <span class="tok-type">INT PRIMARY KEY</span>, name <span class="tok-type">NVARCHAR</span>(100), dob <span class="tok-type">DATE</span>);
<span class="tok-keyword">CREATE TABLE</span> Student (pid <span class="tok-type">INT PRIMARY KEY REFERENCES</span> Person(pid), gpa <span class="tok-type">DECIMAL</span>(3,2), year <span class="tok-type">INT</span>);
<span class="tok-keyword">CREATE TABLE</span> Lecturer(pid <span class="tok-type">INT PRIMARY KEY REFERENCES</span> Person(pid), salary <span class="tok-type">MONEY</span>, dept <span class="tok-type">NVARCHAR</span>(50));</pre>
<p>Thuộc tính chung nằm đúng một chỗ, trong Person; mỗi bảng lớp con chỉ giữ phần riêng. Đọc đầy đủ một sinh viên thì phải nối bảng.</p>

<h3>Chiến lược 2 — mỗi lớp cụ thể một bảng (kiểu "hướng đối tượng")</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> Student (pid, name, dob, gpa, year);      <span class="tok-comment">-- lặp lại mọi thứ</span>
<span class="tok-keyword">CREATE TABLE</span> Lecturer(pid, name, dob, salary, dept);</pre>
<p>Không phải nối bảng, nhưng thuộc tính chung bị nhân bản trong lược đồ, và truy vấn "tất cả mọi người" phải dùng UNION. Người vừa là sinh viên vừa là giảng viên bị lưu hai lần.</p>

<h3>Chiến lược 3 — một bảng rộng (kiểu "nhiều NULL")</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> Person (pid, name, dob, kind <span class="tok-type">CHAR</span>(1), gpa, year, salary, dept,
    <span class="tok-keyword">CONSTRAINT</span> ck_kind <span class="tok-keyword">CHECK</span> (
        (kind = <span class="tok-string">'S'</span> <span class="tok-keyword">AND</span> salary <span class="tok-keyword">IS NULL</span>) <span class="tok-keyword">OR</span> (kind = <span class="tok-string">'L'</span> <span class="tok-keyword">AND</span> gpa <span class="tok-keyword">IS NULL</span>)));</pre>
<p>Một bảng, không phải nối, nhưng mỗi dòng mang theo cột của mọi lớp con, đa phần là null — và chỉ có ràng buộc CHECK ngăn được các tổ hợp vô nghĩa.</p>

<h3>Chọn cái nào — bảng so sánh bạn phải biện luận được</h3>
<table><thead><tr><th></th><th>1 · mỗi lớp con</th><th>2 · mỗi lớp cụ thể</th><th>3 · một bảng rộng</th></tr></thead><tbody>
<tr><td>Truy vấn một lớp con</td><td>phải nối</td><td><b>nhanh</b></td><td><b>nhanh</b> (+ lọc)</td></tr>
<tr><td>Truy vấn tất cả mọi người</td><td><b>nhanh</b></td><td>phải UNION</td><td><b>nhanh</b></td></tr>
<tr><td>Số ô NULL</td><td><b>không có</b></td><td>không có</td><td>rất nhiều</td></tr>
<tr><td>Lớp con chồng lấn</td><td><b>tự nhiên</b></td><td>lặp dòng</td><td>gượng ép</td></tr>
<tr><td>Thêm một lớp con</td><td><b>thêm bảng mới</b></td><td>thêm bảng mới</td><td>ALTER bảng rộng</td></tr>
</tbody></table>
<div class="out"><b>Cách chọn khi làm bài thi.</b> Hỏi hai câu: (1) Các lớp con <em>rời nhau</em> hay chồng lấn? (2) Chúng <em>phủ toàn bộ</em> (ai cũng thuộc một lớp con) hay chỉ một phần?<br>
Rời nhau + phủ toàn bộ + ít thuộc tính riêng → chiến lược 3 (một bảng) là đơn giản nhất.<br>
Có chồng lấn, hoặc nhiều thuộc tính riêng của lớp con → chiến lược 1 (mỗi lớp con một bảng) — cách duy nhất mô hình được sự chồng lấn mà không nhân bản.<br>
Các lớp con hầu như luôn được truy vấn riêng rẽ → chiến lược 2.</div>

<div class="pitfall"><b>Đừng cấp cho lớp con một khoá mới của riêng nó.</b> <span class="badge">Student(student_id, pid, …)</span> tạo ra hai bản sắc cho cùng một người; sau đó chẳng gì ngăn hai dòng Student cùng trỏ tới một Person. Khoá chính của lớp con phải <em>chính là</em> khoá kế thừa: <span class="badge">PRIMARY KEY (pid) REFERENCES Person(pid)</span> — chỉ một dòng đó áp đặt được bản chất 1:1 của ISA.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>ORM của bạn đã đặt tên sẵn cho ba chiến lược này.</b> JPA/Hibernate gọi chúng là <span class="badge">JOINED</span> (1), <span class="badge">TABLE_PER_CLASS</span> (2) và <span class="badge">SINGLE_TABLE</span> (3) — và mặc định là SINGLE_TABLE đúng vì nó không cần nối bảng. Khi gặp lại điều này ở PRJ301, chú thích sẽ là <span class="badge">@Inheritance(strategy = …)</span>, và bảng đánh đổi phía trên chính là thứ quyết định. <em>Ngoài giáo trình vì DBI202 dừng ở "chuyển ISA sang bảng", trong khi cùng quyết định đó là một dòng cấu hình trong mọi framework doanh nghiệp bạn sẽ dùng.</em></div>
</div>
`,
        },
        {
          title: '3.4 — ERD → relational schema: the seven rules|||3.4 — ERD → lược đồ quan hệ: bảy quy tắc',
          slug: 'dbi202-er-to-relation',
          type: 'VIDEO',
          description: 'Quy trình chuyển một ERD hoàn chỉnh thành các bảng — bảy quy tắc, áp dụng trọn vẹn trên một ví dụ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>From diagram to CREATE TABLE, mechanically</h2>
<p class="lead">This conversion is worth marks in the assignment, the PE and the final. It is completely mechanical: seven rules, applied in order. Learn them and you will never stare at a diagram again.</p>

<h3>The seven rules</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>R1 — strong entity.</b> One table. Simple attributes become columns; the key attribute becomes the PRIMARY KEY.</div>
  <div class="lz-layer"><b>R2 — weak entity.</b> One table containing its partial key <em>plus</em> the owner's key; PK = both; FK to the owner, usually ON DELETE CASCADE.</div>
  <div class="lz-layer"><b>R3 — 1:N relationship.</b> No new table. Put the "1" side's key as a foreign key <em>on the N side</em>. NOT NULL if participation is total.</div>
  <div class="lz-layer"><b>R4 — 1:1 relationship.</b> No new table. Put the FK on the side with total participation and add UNIQUE.</div>
  <div class="lz-layer"><b>R5 — M:N relationship.</b> A new table holding both keys; PK = the pair; any relationship attributes become columns of this table.</div>
  <div class="lz-layer"><b>R6 — n-ary relationship.</b> A new table with all n keys; PK = all of them (unless a cardinality constraint allows a smaller key).</div>
  <div class="lz-layer"><b>R7 — multivalued attribute.</b> A new table (owner key, value); PK = both.</div>
</div>

<h3>Worked example — a small library ERD, converted completely</h3>
<div class="diagram">[Member] mid, name, {phone}          [Book] bid, title
    │1                                   │1
    │ borrows (M:N, with borrow_date, due_date)
    └──────────────&lt;Borrow&gt;──────────────┘
[Branch] brid, addr ══&lt;holds&gt;══ [[Copy]] copy_no, status
[Member] ──1──&lt;manages&gt;──1── [Branch]</div>
<div class="out"><b>R1 — strong entities:</b><br>
<span class="badge">Member(mid PK, name)</span> · <span class="badge">Book(bid PK, title)</span> · <span class="badge">Branch(brid PK, addr)</span><br>
<b>R7 — the multivalued attribute {phone}:</b><br>
<span class="badge">MemberPhone(mid, phone)</span>, PK (mid, phone), FK mid → Member<br>
<b>R2 — the weak entity Copy</b> (a copy number only makes sense inside a branch):<br>
<span class="badge">Copy(brid, copy_no, status)</span>, PK (brid, copy_no), FK brid → Branch ON DELETE CASCADE<br>
<b>R5 — the M:N Borrow, with its own attributes:</b><br>
<span class="badge">Borrow(mid, bid, borrow_date, due_date)</span>, PK (mid, bid, borrow_date) — the date is needed in the key because the same member may borrow the same book more than once.<br>
<b>R4 — the 1:1 manages</b> (every branch has exactly one manager; not every member manages):<br>
put the FK on Branch, the side with total participation: <span class="badge">Branch(brid, addr, manager_mid UNIQUE NOT NULL)</span>.<br>
<b>Result: 6 tables.</b> Now check each one against 1NF–BCNF (Chapter 4) — a correct conversion is usually already in 3NF.</div>

<h3>Then write the DDL in dependency order</h3>
<pre><span class="tok-comment">-- parents first, children after: a FK cannot reference a table that does not exist yet</span>
<span class="tok-keyword">CREATE TABLE</span> Member (...);
<span class="tok-keyword">CREATE TABLE</span> Book   (...);
<span class="tok-keyword">CREATE TABLE</span> Branch (... manager_mid <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL UNIQUE REFERENCES</span> Member(mid));
<span class="tok-keyword">CREATE TABLE</span> Copy   (... <span class="tok-keyword">FOREIGN KEY</span>(brid) <span class="tok-keyword">REFERENCES</span> Branch(brid) <span class="tok-keyword">ON DELETE CASCADE</span>);
<span class="tok-keyword">CREATE TABLE</span> Borrow (...);</pre>
<p>When two tables reference each other, create them without the constraint and add it afterwards with <span class="badge">ALTER TABLE … ADD CONSTRAINT</span>.</p>

<div class="pitfall"><b>Creating a separate table for a 1:N relationship</b> is the most frequent conversion error. <span class="badge">Teaches(lid, cid)</span> for "one lecturer teaches many courses" adds a join to every query and lets a course have two lecturers — the very thing the cardinality forbids. A 1:N relationship is <em>always</em> just a foreign key.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Reverse engineering — the same rules read backwards.</b> Given an unfamiliar database, you can recover its ERD: a table whose entire primary key consists of two foreign keys is an M:N relationship; a table whose primary key is also a foreign key is a subclass or a 1:1; a nullable foreign key is partial participation. SSMS and draw.io automate the drawing, but the inference is exactly these seven rules run in reverse — and it is how you make sense of a legacy schema on your first day at a job. <em>Beyond syllabus because the course only converts forwards, while professional life mostly asks you to read someone else's tables.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Từ sơ đồ tới CREATE TABLE, một cách máy móc</h2>
<p class="lead">Phép chuyển này ăn điểm ở cả bài tập lớn, PE lẫn thi cuối kỳ. Nó hoàn toàn máy móc: bảy quy tắc, áp dụng theo thứ tự. Thuộc chúng rồi thì bạn sẽ không bao giờ phải ngồi nhìn sơ đồ mà bí nữa.</p>

<h3>Bảy quy tắc</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>R1 — thực thể mạnh.</b> Một bảng. Thuộc tính đơn thành cột; thuộc tính khoá thành PRIMARY KEY.</div>
  <div class="lz-layer"><b>R2 — thực thể yếu.</b> Một bảng chứa khoá bộ phận <em>cộng thêm</em> khoá của thực thể chủ; PK = cả hai; FK trỏ về chủ, thường kèm ON DELETE CASCADE.</div>
  <div class="lz-layer"><b>R3 — liên kết 1:N.</b> Không thêm bảng. Đặt khoá của phía "1" làm khoá ngoại <em>ở phía N</em>. NOT NULL nếu tham gia toàn bộ.</div>
  <div class="lz-layer"><b>R4 — liên kết 1:1.</b> Không thêm bảng. Đặt FK ở phía tham gia toàn bộ và thêm UNIQUE.</div>
  <div class="lz-layer"><b>R5 — liên kết M:N.</b> Một bảng mới chứa cả hai khoá; PK = cặp khoá đó; thuộc tính của liên kết trở thành cột của bảng này.</div>
  <div class="lz-layer"><b>R6 — liên kết n-ngôi.</b> Một bảng mới với đủ n khoá; PK = tất cả (trừ khi một ràng buộc bản số cho phép khoá nhỏ hơn).</div>
  <div class="lz-layer"><b>R7 — thuộc tính đa trị.</b> Một bảng mới (khoá chủ, giá trị); PK = cả hai.</div>
</div>

<h3>Ví dụ có lời giải — một ERD thư viện nhỏ, chuyển trọn vẹn</h3>
<div class="diagram">[Member] mid, name, {phone}          [Book] bid, title
    │1                                   │1
    │ borrows (M:N, có borrow_date, due_date)
    └──────────────&lt;Borrow&gt;──────────────┘
[Branch] brid, addr ══&lt;holds&gt;══ [[Copy]] copy_no, status
[Member] ──1──&lt;manages&gt;──1── [Branch]</div>
<div class="out"><b>R1 — các thực thể mạnh:</b><br>
<span class="badge">Member(mid PK, name)</span> · <span class="badge">Book(bid PK, title)</span> · <span class="badge">Branch(brid PK, addr)</span><br>
<b>R7 — thuộc tính đa trị {phone}:</b><br>
<span class="badge">MemberPhone(mid, phone)</span>, PK (mid, phone), FK mid → Member<br>
<b>R2 — thực thể yếu Copy</b> (số hiệu bản sao chỉ có nghĩa trong phạm vi một chi nhánh):<br>
<span class="badge">Copy(brid, copy_no, status)</span>, PK (brid, copy_no), FK brid → Branch ON DELETE CASCADE<br>
<b>R5 — liên kết M:N Borrow kèm thuộc tính riêng:</b><br>
<span class="badge">Borrow(mid, bid, borrow_date, due_date)</span>, PK (mid, bid, borrow_date) — phải đưa ngày vào khoá vì cùng một thành viên có thể mượn cùng một cuốn nhiều lần.<br>
<b>R4 — liên kết 1:1 manages</b> (mỗi chi nhánh có đúng một quản lý; không phải thành viên nào cũng quản lý):<br>
đặt FK ở Branch, phía tham gia toàn bộ: <span class="badge">Branch(brid, addr, manager_mid UNIQUE NOT NULL)</span>.<br>
<b>Kết quả: 6 bảng.</b> Giờ hãy soi từng bảng theo 1NF–BCNF (Chương 4) — một phép chuyển đúng thường đã đạt sẵn 3NF.</div>

<h3>Rồi viết DDL theo thứ tự phụ thuộc</h3>
<pre><span class="tok-comment">-- bảng cha trước, bảng con sau: FK không thể tham chiếu bảng chưa tồn tại</span>
<span class="tok-keyword">CREATE TABLE</span> Member (...);
<span class="tok-keyword">CREATE TABLE</span> Book   (...);
<span class="tok-keyword">CREATE TABLE</span> Branch (... manager_mid <span class="tok-type">INT</span> <span class="tok-keyword">NOT NULL UNIQUE REFERENCES</span> Member(mid));
<span class="tok-keyword">CREATE TABLE</span> Copy   (... <span class="tok-keyword">FOREIGN KEY</span>(brid) <span class="tok-keyword">REFERENCES</span> Branch(brid) <span class="tok-keyword">ON DELETE CASCADE</span>);
<span class="tok-keyword">CREATE TABLE</span> Borrow (...);</pre>
<p>Khi hai bảng tham chiếu lẫn nhau, hãy tạo chúng trước mà chưa có ràng buộc rồi thêm sau bằng <span class="badge">ALTER TABLE … ADD CONSTRAINT</span>.</p>

<div class="pitfall"><b>Tạo một bảng riêng cho liên kết 1:N</b> là lỗi chuyển đổi hay gặp nhất. <span class="badge">Teaches(lid, cid)</span> cho "một giảng viên dạy nhiều môn" làm mọi truy vấn phải nối thêm một bảng và còn cho phép một môn có hai giảng viên — đúng điều mà bản số cấm. Liên kết 1:N <em>luôn luôn</em> chỉ là một khoá ngoại.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kỹ thuật ngược — vẫn bảy quy tắc đó, đọc ngược lại.</b> Cho một cơ sở dữ liệu lạ, bạn khôi phục được ERD của nó: bảng có khoá chính gồm trọn hai khoá ngoại là một liên kết M:N; bảng có khoá chính đồng thời là khoá ngoại là lớp con hoặc quan hệ 1:1; khoá ngoại cho phép null là tham gia bộ phận. SSMS và draw.io vẽ hộ, nhưng phần suy luận đúng là bảy quy tắc này chạy ngược — và đó là cách bạn hiểu được một lược đồ cũ trong ngày đầu đi làm. <em>Ngoài giáo trình vì môn học chỉ chuyển xuôi, trong khi đời đi làm chủ yếu bắt bạn đọc bảng của người khác.</em></div>
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
<h3>Worked example · normalizing to 3NF, step by step</h3>
<div class="out"><b>Given</b> a 1NF table <code>Enrollment(StudentID, StudentName, StudentDept, DeptHead, CourseID, CourseName, Grade)</code>, primary key (StudentID, CourseID), with functional dependencies:<br>StudentID → StudentName, StudentDept, DeptHead<br>StudentDept → DeptHead <em>(this one is the trap)</em><br>CourseID → CourseName<br>StudentID, CourseID → Grade<br><br><b>Step 1 — check 2NF (no dependency on only PART of the key).</b> StudentID alone determines StudentName/StudentDept/DeptHead, and CourseID alone determines CourseName — both are <em>partial dependencies</em> (they only need half the composite key). 2NF is violated.<br><b>Fix:</b> split off everything that depends on just one half of the key:<br>&nbsp;&nbsp;Student(<u>StudentID</u>, StudentName, StudentDept, DeptHead)<br>&nbsp;&nbsp;Course(<u>CourseID</u>, CourseName)<br>&nbsp;&nbsp;Enrollment(<u>StudentID, CourseID</u>, Grade)<br>Now every non-key column depends on the WHOLE key of its own table — 2NF reached.<br><br><b>Step 2 — check 3NF (no transitive dependency: non-key → non-key).</b> Inside the new Student table, StudentDept → DeptHead: DeptHead depends on StudentDept, not directly on the key StudentID. That is transitive — 3NF is violated.<br><b>Fix:</b> split the transitively-dependent attribute into its own table:<br>&nbsp;&nbsp;Student(<u>StudentID</u>, StudentName, StudentDept)<br>&nbsp;&nbsp;Department(<u>StudentDept</u>, DeptHead)<br>&nbsp;&nbsp;Course(<u>CourseID</u>, CourseName)<br>&nbsp;&nbsp;Enrollment(<u>StudentID, CourseID</u>, Grade)<br><b>Result:</b> 4 tables, all in 3NF — and BCNF too, since every determinant (StudentID, StudentDept, CourseID, the pair (StudentID, CourseID)) is now a candidate key of its own table.</div>
<div class="pitfall"><b>The three anomalies</b> a bad design causes: <b>update</b> (change a fact in one row, others go stale), <b>insert</b> (cannot add a course with no student), <b>delete</b> (removing the last student deletes the course too). Normalization removes all three.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why we sometimes stop at 3NF, not BCNF.</b> BCNF is stricter, yet designers often stop at 3NF on purpose. The reason is <b>dependency preservation</b>: 3NF can always be reached with a lossless <em>and</em> dependency-preserving decomposition, but forcing BCNF sometimes means a functional dependency can no longer be checked within a single table. Beyond BCNF lie <b>4NF</b> (multivalued dependencies) and <b>5NF</b> (join dependencies) for even subtler redundancy. <em>Exams ask "what does 3NF remove"; engineering asks "is going further worth losing a constraint" — a trade-off, not a ladder.</em></div>
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
<h3>Ví dụ có lời giải · chuẩn hóa về 3NF, từng bước</h3>
<div class="out"><b>Đề bài:</b> bảng 1NF <code>Enrollment(StudentID, StudentName, StudentDept, DeptHead, CourseID, CourseName, Grade)</code>, khóa chính (StudentID, CourseID), với các phụ thuộc hàm:<br>StudentID → StudentName, StudentDept, DeptHead<br>StudentDept → DeptHead <em>(đây chính là cái bẫy)</em><br>CourseID → CourseName<br>StudentID, CourseID → Grade<br><br><b>Bước 1 — kiểm 2NF (không phụ thuộc vào CHỈ MỘT PHẦN khóa).</b> StudentID một mình đã xác định StudentName/StudentDept/DeptHead, và CourseID một mình xác định CourseName — cả hai đều là <em>phụ thuộc bộ phận</em> (chỉ cần nửa khóa kép). Vi phạm 2NF.<br><b>Sửa:</b> tách riêng mọi thứ chỉ phụ thuộc vào một nửa khóa:<br>&nbsp;&nbsp;Student(<u>StudentID</u>, StudentName, StudentDept, DeptHead)<br>&nbsp;&nbsp;Course(<u>CourseID</u>, CourseName)<br>&nbsp;&nbsp;Enrollment(<u>StudentID, CourseID</u>, Grade)<br>Giờ mọi cột không-khóa phụ thuộc vào TOÀN BỘ khóa của bảng riêng nó — đạt 2NF.<br><br><b>Bước 2 — kiểm 3NF (không phụ thuộc bắc cầu: không-khóa → không-khóa).</b> Trong bảng Student mới, StudentDept → DeptHead: DeptHead phụ thuộc vào StudentDept, không phải trực tiếp vào khóa StudentID. Đó là bắc cầu — vi phạm 3NF.<br><b>Sửa:</b> tách thuộc tính phụ thuộc bắc cầu ra bảng riêng:<br>&nbsp;&nbsp;Student(<u>StudentID</u>, StudentName, StudentDept)<br>&nbsp;&nbsp;Department(<u>StudentDept</u>, DeptHead)<br>&nbsp;&nbsp;Course(<u>CourseID</u>, CourseName)<br>&nbsp;&nbsp;Enrollment(<u>StudentID, CourseID</u>, Grade)<br><b>Kết quả:</b> 4 bảng, đều đạt 3NF — và cả BCNF, vì mọi vế trái xác định (StudentID, StudentDept, CourseID, cặp (StudentID, CourseID)) giờ đều là khóa dự tuyển của đúng bảng chứa nó.</div>
<div class="pitfall"><b>Ba bất thường</b> mà thiết kế tệ gây ra: <b>cập nhật</b> (đổi một sự thật ở một hàng, hàng khác lỗi thời), <b>chèn</b> (không thể thêm khóa học chưa có sinh viên), <b>xóa</b> (xóa sinh viên cuối cùng xóa luôn khóa học). Chuẩn hóa loại bỏ cả ba.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao đôi khi dừng ở 3NF, không lên BCNF.</b> BCNF chặt hơn, nhưng người thiết kế thường cố ý dừng ở 3NF. Lý do là <b>bảo toàn phụ thuộc</b>: luôn đạt được 3NF bằng một phân rã không mất mát <em>và</em> bảo toàn phụ thuộc, nhưng ép BCNF đôi khi khiến một phụ thuộc hàm không còn kiểm được trong một bảng duy nhất. Trên BCNF còn có <b>4NF</b> (phụ thuộc đa trị) và <b>5NF</b> (phụ thuộc nối) cho dư thừa tinh vi hơn. <em>Đề thi hỏi "3NF loại bỏ gì"; kỹ thuật thật hỏi "đi xa hơn có đáng mất một ràng buộc không" — một đánh đổi, không phải cái thang.</em></div>
</div>
`,
        },
        {
          title: '4.2 — Armstrong rules, closures & finding keys|||4.2 — Luật Armstrong, bao đóng & tìm khoá',
          slug: 'dbi202-bao-dong-tim-khoa',
          type: 'VIDEO',
          description: 'Ba luật suy diễn, thuật toán bao đóng thuộc tính, và cách tìm TẤT CẢ khoá dự tuyển của một lược đồ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>The algorithm behind every normalization question</h2>
<p class="lead">Before you can say "this is 2NF but not 3NF", you must know the keys — and keys are computed, not guessed. Two tools do it: Armstrong's inference rules, and the attribute-closure algorithm.</p>

<h3>Armstrong's axioms (the three you must quote)</h3>
<div class="formula"><span class="lbl">REFLEXIVITY</span>if Y ⊆ X then X → Y</div>
<div class="formula"><span class="lbl">AUGMENTATION</span>if X → Y then XZ → YZ</div>
<div class="formula"><span class="lbl">TRANSITIVITY</span>if X → Y and Y → Z then X → Z</div>
<p>Three derived rules save time: <b>union</b> (X→Y, X→Z ⟹ X→YZ), <b>decomposition</b> (X→YZ ⟹ X→Y and X→Z), <b>pseudo-transitivity</b> (X→Y, WY→Z ⟹ WX→Z).</p>

<h3>Attribute closure X⁺ — the workhorse</h3>
<pre>X⁺ := X
repeat until nothing changes:
    for each FD  A → B  in F:
        if A ⊆ X⁺ then X⁺ := X⁺ ∪ B</pre>
<div class="out"><b>R(A, B, C, D, E) with F = { A→B, B→C, CD→E }.</b><br>
<b>Compute A⁺:</b> start {A} → A→B applies → {A,B} → B→C applies → {A,B,C} → CD→E needs D, absent → stop. <b>A⁺ = {A,B,C}</b> — not all attributes, so A is not a key.<br>
<b>Compute (AD)⁺:</b> {A,D} → A→B → {A,B,D} → B→C → {A,B,C,D} → now CD ⊆ set → E added → <b>{A,B,C,D,E}</b> = R.<br>
So <b>AD is a superkey</b>. Is it minimal? A⁺ = {A,B,C} ≠ R and D⁺ = {D} ≠ R, so neither half alone works → <b>AD is a candidate key</b>.</div>

<h3>Finding <em>all</em> candidate keys — the systematic method</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Attributes that appear only on the LEFT of FDs (or in no FD at all) must be in every key.</span></div>
  <div class="lz-fitem"><b>2</b><span>Attributes that appear only on the RIGHT are in no key.</span></div>
  <div class="lz-fitem"><b>3</b><span>Compute the closure of the "must-have" set. If it is R, that is the only key.</span></div>
  <div class="lz-fitem"><b>4</b><span>Otherwise add the remaining attributes one at a time, and test each combination for minimality.</span></div>
</div>
<div class="out"><b>Same example.</b> Left-only: A and D (A appears left in A→B; D appears left in CD→E and never right). Right-only: E. Middle: B, C.<br>
Step 3: (AD)⁺ = R (computed above) → <b>AD is a key, and since A and D must be in every key, it is the only candidate key.</b><br>
<b>Prime attributes</b> = {A, D}; <b>non-prime</b> = {B, C, E}. You now have everything you need to test 2NF and 3NF.</div>

<h3>Using the closure to test an FD or two FD sets</h3>
<div class="out"><b>Is X → Y implied by F?</b> Compute X⁺ under F; the FD holds if and only if Y ⊆ X⁺. Example: does A → C hold above? A⁺ = {A,B,C} contains C → <b>yes</b>, by transitivity.<br>
<b>Are F and G equivalent?</b> Check that every FD of G is implied by F and vice versa, using closures. This is exactly how you verify that a decomposition preserved the dependencies (lesson 4.3).</div>

<div class="pitfall"><b>Do not stop the closure loop after one pass.</b> Adding an attribute can enable an FD that was previously blocked, so you must sweep the whole FD set again and again until a full pass adds nothing. Half the wrong answers in exams come from a single pass.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The minimal (canonical) cover.</b> Before decomposing, reduce F to a minimal cover: (1) split every right-hand side into single attributes; (2) remove redundant attributes from left-hand sides (test with closures); (3) remove FDs implied by the others. The result is the smallest equivalent FD set, and the 3NF synthesis algorithm applied to it produces the smallest dependency-preserving schema. <em>Beyond syllabus because the course normalises by inspection, while the synthesis algorithm is what turns normalization from an art into a procedure a computer could run.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Thuật toán đứng sau mọi câu hỏi chuẩn hoá</h2>
<p class="lead">Trước khi nói được "cái này đạt 2NF nhưng chưa 3NF", bạn phải biết khoá — mà khoá thì được tính ra chứ không phải đoán. Hai công cụ làm việc đó: các luật suy diễn Armstrong và thuật toán bao đóng thuộc tính.</p>

<h3>Hệ tiên đề Armstrong (ba luật phải nhớ)</h3>
<div class="formula"><span class="lbl">PHẢN XẠ</span>nếu Y ⊆ X thì X → Y</div>
<div class="formula"><span class="lbl">TĂNG TRƯỞNG</span>nếu X → Y thì XZ → YZ</div>
<div class="formula"><span class="lbl">BẮC CẦU</span>nếu X → Y và Y → Z thì X → Z</div>
<p>Ba luật dẫn xuất giúp tiết kiệm thời gian: <b>hợp</b> (X→Y, X→Z ⟹ X→YZ), <b>tách</b> (X→YZ ⟹ X→Y và X→Z), <b>giả bắc cầu</b> (X→Y, WY→Z ⟹ WX→Z).</p>

<h3>Bao đóng thuộc tính X⁺ — con ngựa kéo cày</h3>
<pre>X⁺ := X
lặp tới khi không đổi:
    với mỗi phụ thuộc hàm  A → B  trong F:
        nếu A ⊆ X⁺ thì X⁺ := X⁺ ∪ B</pre>
<div class="out"><b>R(A, B, C, D, E) với F = { A→B, B→C, CD→E }.</b><br>
<b>Tính A⁺:</b> khởi {A} → dùng được A→B → {A,B} → dùng được B→C → {A,B,C} → CD→E cần D mà không có → dừng. <b>A⁺ = {A,B,C}</b> — chưa đủ mọi thuộc tính, nên A không phải khoá.<br>
<b>Tính (AD)⁺:</b> {A,D} → A→B → {A,B,D} → B→C → {A,B,C,D} → giờ CD ⊆ tập → thêm E → <b>{A,B,C,D,E}</b> = R.<br>
Vậy <b>AD là siêu khoá</b>. Có tối tiểu không? A⁺ = {A,B,C} ≠ R và D⁺ = {D} ≠ R, tức không nửa nào đứng riêng đủ → <b>AD là khoá dự tuyển</b>.</div>

<h3>Tìm <em>tất cả</em> khoá dự tuyển — phương pháp có hệ thống</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Thuộc tính chỉ xuất hiện bên TRÁI của các phụ thuộc (hoặc không xuất hiện ở đâu) bắt buộc nằm trong mọi khoá.</span></div>
  <div class="lz-fitem"><b>2</b><span>Thuộc tính chỉ xuất hiện bên PHẢI thì không nằm trong khoá nào.</span></div>
  <div class="lz-fitem"><b>3</b><span>Tính bao đóng của tập "bắt buộc phải có". Nếu bằng R thì đó là khoá duy nhất.</span></div>
  <div class="lz-fitem"><b>4</b><span>Nếu chưa, thêm dần từng thuộc tính còn lại và kiểm tính tối tiểu của mỗi tổ hợp.</span></div>
</div>
<div class="out"><b>Vẫn ví dụ trên.</b> Chỉ bên trái: A và D (A xuất hiện bên trái ở A→B; D xuất hiện bên trái ở CD→E và không bao giờ bên phải). Chỉ bên phải: E. Ở giữa: B, C.<br>
Bước 3: (AD)⁺ = R (đã tính ở trên) → <b>AD là khoá, và vì A với D bắt buộc nằm trong mọi khoá nên đó là khoá dự tuyển duy nhất.</b><br>
<b>Thuộc tính khoá</b> = {A, D}; <b>không khoá</b> = {B, C, E}. Giờ bạn đã có đủ mọi thứ để kiểm 2NF và 3NF.</div>

<h3>Dùng bao đóng để kiểm một phụ thuộc hoặc hai tập phụ thuộc</h3>
<div class="out"><b>F có suy ra X → Y không?</b> Tính X⁺ theo F; phụ thuộc đó đúng khi và chỉ khi Y ⊆ X⁺. Ví dụ: A → C có đúng không? A⁺ = {A,B,C} chứa C → <b>có</b>, do bắc cầu.<br>
<b>F và G có tương đương không?</b> Kiểm mọi phụ thuộc của G đều được F suy ra và ngược lại, đều bằng bao đóng. Đây đúng là cách bạn xác minh một phép phân rã có bảo toàn phụ thuộc hay không (bài 4.3).</div>

<div class="pitfall"><b>Đừng dừng vòng lặp bao đóng sau một lượt.</b> Thêm được một thuộc tính có thể mở khoá cho một phụ thuộc trước đó chưa dùng được, nên phải quét lại toàn bộ tập phụ thuộc nhiều lần cho tới khi một lượt đầy đủ không thêm được gì. Một nửa số đáp án sai trong bài thi đến từ việc chỉ quét một lượt.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phủ tối tiểu (canonical cover).</b> Trước khi phân rã, hãy rút F về phủ tối tiểu: (1) tách mọi vế phải thành từng thuộc tính đơn; (2) bỏ thuộc tính dư ở vế trái (kiểm bằng bao đóng); (3) bỏ những phụ thuộc được các phụ thuộc còn lại suy ra. Kết quả là tập phụ thuộc tương đương nhỏ nhất, và thuật toán tổng hợp 3NF áp lên nó cho ra lược đồ bảo toàn phụ thuộc nhỏ nhất. <em>Ngoài giáo trình vì môn học chuẩn hoá bằng cách nhìn bằng mắt, trong khi thuật toán tổng hợp mới biến chuẩn hoá từ nghệ thuật thành một quy trình mà máy tính chạy được.</em></div>
</div>
`,
        },
        {
          title: '4.3 — Decomposition: lossless join & dependency preservation|||4.3 — Phân rã: nối không mất mát & bảo toàn phụ thuộc',
          slug: 'dbi202-phan-ra',
          type: 'VIDEO',
          description: 'Hai tiêu chuẩn của một phép phân rã tốt, cách kiểm từng cái, và vì sao BCNF đôi khi phải hy sinh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Splitting a table without breaking it</h2>
<p class="lead">Normalization means splitting relations. Any split removes redundancy — but a careless one destroys information. Two properties tell you whether a decomposition is safe, and you are expected to test both.</p>

<h3>Property 1 — lossless join (non-negotiable)</h3>
<div class="formula"><span class="lbl">TEST</span>R₁ ∩ R₂ → R₁ &nbsp;or&nbsp; R₁ ∩ R₂ → R₂</div>
<p>In words: the shared attributes must be a key of at least one of the two pieces. Then joining them back gives exactly the original rows — no more, no fewer.</p>
<div class="out"><b>Bad decomposition.</b> R(sid, course, lecturer) split into R₁(sid, course) and R₂(course, lecturer)… is fine only if <span class="badge">course → lecturer</span>. But split it into R₁(sid, course) and R₂(sid, lecturer) when a student takes two courses:<br>
R = {(1, DB, X), (1, OS, Y)} → R₁ = {(1,DB), (1,OS)}, R₂ = {(1,X), (1,Y)}<br>
Join on sid → {(1,DB,X), (1,DB,Y), (1,OS,X), (1,OS,Y)} — <b>4 rows from 2</b>. The two invented rows are <em>spurious tuples</em>: the join is lossy, information about which lecturer taught which course is gone forever.<br>
<b>Check with the rule:</b> R₁ ∩ R₂ = {sid}, and sid is not a key of either piece → the test fails, as expected.</div>

<h3>Property 2 — dependency preservation (desirable)</h3>
<p>A decomposition preserves dependencies if every FD of the original can be checked on a <em>single</em> piece, without a join. Otherwise the DBMS cannot enforce that rule cheaply — every insert would need a join to validate.</p>
<div class="out"><b>Test:</b> take the union of the FDs projected onto each fragment, and verify it is equivalent to F (use closures, lesson 4.2). If some FD of F cannot be derived, that dependency is lost.</div>

<h3>Worked example — the classic case where BCNF costs you a dependency</h3>
<div class="out"><b>R(student, subject, teacher)</b> with the rules:<br>
F₁: <span class="badge">(student, subject) → teacher</span> — a student studies a subject with exactly one teacher.<br>
F₂: <span class="badge">teacher → subject</span> — each teacher teaches only one subject.<br>
<b>Candidate keys:</b> (student, subject) and (student, teacher).<br>
<b>Is it BCNF?</b> F₂'s left-hand side <em>teacher</em> is not a superkey → <b>no</b>. It <em>is</em> in 3NF, because subject is a prime attribute (it belongs to a candidate key) — and 3NF allows that.<br>
<b>Force BCNF:</b> decompose into R₁(teacher, subject) and R₂(student, teacher).<br>
Lossless? R₁ ∩ R₂ = {teacher}, and teacher → subject makes teacher a key of R₁ ✓ <b>lossless</b>.<br>
Dependency preserving? F₂ lives in R₁ ✓, but <b>F₁ (student, subject) → teacher spans both tables</b> ✗ — it can no longer be enforced without a join. Nothing now stops inserting the same student twice with two teachers of the same subject.<br>
<b>Conclusion:</b> BCNF is not always reachable while preserving dependencies. Stopping at 3NF here is the correct engineering decision — and saying exactly that earns full marks.</div>

<h3>3NF versus BCNF — the summary</h3>
<table><thead><tr><th></th><th>3NF</th><th>BCNF</th></tr></thead><tbody>
<tr><td>Rule</td><td>every non-prime attribute depends on a key only</td><td><b>every</b> determinant is a superkey</td></tr>
<tr><td>Lossless decomposition</td><td>always possible</td><td>always possible</td></tr>
<tr><td>Dependency preserving</td><td><b>always possible</b></td><td><b>not always</b></td></tr>
<tr><td>Residual redundancy</td><td>a little</td><td>none</td></tr>
</tbody></table>

<div class="pitfall"><b>Never split a table just because it has "too many columns".</b> Decomposition is justified by a functional dependency, not by width. A 30-column table whose every column depends on the whole key is already in BCNF, and splitting it only adds joins.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Denormalization is a deliberate, documented reversal.</b> Data warehouses store a star schema — one wide, redundant fact table joined to small dimensions — because analytical queries scan millions of rows and every avoided join is a real saving. The rule is: normalise until it hurts, denormalise until it works, and write down which dependency you are now enforcing in application code instead. An undocumented denormalization is simply a bug waiting to produce inconsistent data. <em>Beyond syllabus because the course treats higher normal forms as strictly better, while production systems trade them away consciously.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Tách một bảng mà không làm hỏng nó</h2>
<p class="lead">Chuẩn hoá nghĩa là tách quan hệ. Phép tách nào cũng bớt dư thừa — nhưng tách ẩu thì phá huỷ thông tin. Hai tính chất cho biết một phép phân rã có an toàn không, và bạn được yêu cầu kiểm cả hai.</p>

<h3>Tính chất 1 — nối không mất mát (không được phép thoả hiệp)</h3>
<div class="formula"><span class="lbl">PHÉP KIỂM</span>R₁ ∩ R₂ → R₁ &nbsp;hoặc&nbsp; R₁ ∩ R₂ → R₂</div>
<p>Nói bằng lời: tập thuộc tính chung phải là khoá của ít nhất một trong hai mảnh. Khi đó nối chúng lại cho ra đúng các dòng ban đầu — không thừa, không thiếu.</p>
<div class="out"><b>Phân rã tồi.</b> R(sid, course, lecturer) tách thành R₁(sid, course) và R₂(course, lecturer)… chỉ ổn nếu <span class="badge">course → lecturer</span>. Nhưng nếu tách thành R₁(sid, course) và R₂(sid, lecturer) trong khi một sinh viên học hai môn:<br>
R = {(1, DB, X), (1, OS, Y)} → R₁ = {(1,DB), (1,OS)}, R₂ = {(1,X), (1,Y)}<br>
Nối theo sid → {(1,DB,X), (1,DB,Y), (1,OS,X), (1,OS,Y)} — <b>4 dòng từ 2 dòng</b>. Hai dòng bịa ra đó là <em>bộ giả</em>: phép nối bị mất mát, thông tin giảng viên nào dạy môn nào mất vĩnh viễn.<br>
<b>Kiểm bằng quy tắc:</b> R₁ ∩ R₂ = {sid}, mà sid không phải khoá của mảnh nào → phép kiểm thất bại, đúng như dự đoán.</div>

<h3>Tính chất 2 — bảo toàn phụ thuộc (nên có)</h3>
<p>Một phép phân rã bảo toàn phụ thuộc nếu mọi phụ thuộc hàm của quan hệ gốc đều kiểm được trên <em>một</em> mảnh, không cần nối bảng. Nếu không, DBMS không áp đặt được luật đó một cách rẻ — mỗi lần chèn đều phải nối bảng để kiểm.</p>
<div class="out"><b>Cách kiểm:</b> lấy hợp của các phụ thuộc chiếu lên từng mảnh, rồi xác minh nó tương đương F (dùng bao đóng, bài 4.2). Nếu có phụ thuộc nào của F không suy ra được thì phụ thuộc đó đã bị mất.</div>

<h3>Ví dụ có lời giải — ca kinh điển khi BCNF phải trả giá bằng một phụ thuộc</h3>
<div class="out"><b>R(student, subject, teacher)</b> với các luật:<br>
F₁: <span class="badge">(student, subject) → teacher</span> — một sinh viên học một môn với đúng một giáo viên.<br>
F₂: <span class="badge">teacher → subject</span> — mỗi giáo viên chỉ dạy một môn.<br>
<b>Khoá dự tuyển:</b> (student, subject) và (student, teacher).<br>
<b>Có đạt BCNF không?</b> Vế trái của F₂ là <em>teacher</em> không phải siêu khoá → <b>không</b>. Nhưng nó <em>đạt</em> 3NF, vì subject là thuộc tính khoá (nó nằm trong một khoá dự tuyển) — và 3NF cho phép điều đó.<br>
<b>Ép về BCNF:</b> phân rã thành R₁(teacher, subject) và R₂(student, teacher).<br>
Không mất mát? R₁ ∩ R₂ = {teacher}, mà teacher → subject làm teacher thành khoá của R₁ ✓ <b>không mất mát</b>.<br>
Bảo toàn phụ thuộc? F₂ nằm gọn trong R₁ ✓, nhưng <b>F₁ (student, subject) → teacher vắt qua cả hai bảng</b> ✗ — không còn áp đặt được nếu không nối bảng. Giờ chẳng gì ngăn việc chèn cùng một sinh viên hai lần với hai giáo viên cùng một môn.<br>
<b>Kết luận:</b> không phải lúc nào cũng đạt được BCNF mà vẫn bảo toàn phụ thuộc. Dừng ở 3NF trong trường hợp này là quyết định kỹ thuật đúng — và nói đúng câu đó là ăn trọn điểm.</div>

<h3>3NF với BCNF — bảng tổng kết</h3>
<table><thead><tr><th></th><th>3NF</th><th>BCNF</th></tr></thead><tbody>
<tr><td>Luật</td><td>mọi thuộc tính không khoá chỉ phụ thuộc vào khoá</td><td><b>mọi</b> vế trái đều phải là siêu khoá</td></tr>
<tr><td>Phân rã không mất mát</td><td>luôn làm được</td><td>luôn làm được</td></tr>
<tr><td>Bảo toàn phụ thuộc</td><td><b>luôn làm được</b></td><td><b>không phải lúc nào cũng được</b></td></tr>
<tr><td>Dư thừa còn sót</td><td>một chút</td><td>không còn</td></tr>
</tbody></table>

<div class="pitfall"><b>Đừng tách bảng chỉ vì nó "nhiều cột quá".</b> Phân rã được biện minh bằng một phụ thuộc hàm, không phải bằng độ rộng. Một bảng 30 cột mà mọi cột đều phụ thuộc vào trọn khoá thì đã đạt BCNF sẵn, tách ra chỉ thêm việc nối bảng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phi chuẩn hoá là phép đảo ngược có chủ đích và có ghi chép.</b> Kho dữ liệu lưu theo lược đồ hình sao — một bảng sự kiện rộng và dư thừa nối với các bảng chiều nhỏ — vì truy vấn phân tích quét hàng triệu dòng và mỗi phép nối tránh được là một khoản tiết kiệm thật. Quy tắc là: chuẩn hoá tới khi thấy đau, phi chuẩn hoá tới khi chạy được, và ghi lại rõ ràng phụ thuộc nào giờ đang được áp đặt bằng mã ứng dụng. Một phép phi chuẩn hoá không ghi chép chỉ đơn giản là một lỗi đang chờ sinh ra dữ liệu mâu thuẫn. <em>Ngoài giáo trình vì môn học coi dạng chuẩn cao hơn là luôn tốt hơn, còn hệ thống thật thì đánh đổi chúng một cách có ý thức.</em></div>
</div>
`,
        },
        {
          title: '4.4 — One table, normalized 1NF → BCNF step by step|||4.4 — Một bảng, chuẩn hoá 1NF → BCNF từng bước',
          slug: 'dbi202-chuan-hoa-vi-du',
          type: 'VIDEO',
          description: 'Bài tập chuẩn hoá đầy đủ trên một bảng đơn hàng thật — mỗi dạng chuẩn một lần tách, có kiểm lại.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>The full worked normalization — the exact shape of the exam question</h2>
<p class="lead">Lesson 4.1 defined the normal forms and 4.2 gave you the key-finding algorithm. Here they are applied end to end, on one badly designed table, with the check performed after every step.</p>

<h3>The starting table (0NF — it is not even 1NF)</h3>
<div class="diagram">Order(order_id, order_date, cust_id, cust_name, cust_city,
      products = "P1:2, P7:1", unit_price, total)</div>
<div class="out"><b>The anomalies this table produces:</b><br>
<em>Insertion</em> — a new customer cannot be recorded until they place an order.<br>
<em>Update</em> — a customer who moves city must be changed on every one of their order rows; miss one and the data contradicts itself.<br>
<em>Deletion</em> — deleting the customer's only order erases the customer entirely.<br>
All three come from one cause: <b>facts about different things are stored in the same row</b>.</div>

<h3>Step 1 → 1NF: atomic values, no repeating groups</h3>
<p>The <span class="badge">products</span> column holds a list. Split it into one row per product.</p>
<div class="out"><b>Order1NF(order_id, order_date, cust_id, cust_name, cust_city, product_id, qty, unit_price)</b><br>
<b>Key:</b> (order_id, product_id) — one line per product per order.<br>
<b>Also removed:</b> <span class="badge">total</span>, because it is a derived attribute (qty × unit_price summed) and storing it invites disagreement with the lines.</div>

<h3>Step 2 → 2NF: remove partial dependencies on part of the key</h3>
<div class="out"><b>List the FDs:</b><br>
order_id → order_date, cust_id, cust_name, cust_city &nbsp; <em>(depends on only PART of the key)</em><br>
product_id → unit_price &nbsp; <em>(also only part of the key)</em><br>
(order_id, product_id) → qty &nbsp; <em>(the whole key — correct)</em><br>
<b>Split into three:</b><br>
<span class="badge">Order(order_id PK, order_date, cust_id, cust_name, cust_city)</span><br>
<span class="badge">Product(product_id PK, unit_price)</span><br>
<span class="badge">OrderLine(order_id, product_id, qty)</span>, PK (order_id, product_id), two FKs<br>
<b>Check lossless:</b> Order ∩ OrderLine = {order_id}, which is the key of Order ✓ · Product ∩ OrderLine = {product_id}, the key of Product ✓.</div>

<h3>Step 3 → 3NF: remove transitive dependencies</h3>
<div class="out">In <b>Order</b>, <span class="badge">order_id → cust_id → cust_name, cust_city</span>: the customer's name depends on the key only <em>through</em> cust_id — a transitive dependency, and the reason the update anomaly survived 2NF.<br>
<b>Split:</b><br>
<span class="badge">Customer(cust_id PK, cust_name, cust_city)</span><br>
<span class="badge">Order(order_id PK, order_date, cust_id FK)</span><br>
<b>Now a customer's city is stored exactly once</b> — the update anomaly is gone, and a customer can exist with no orders (insertion anomaly gone) and survives the deletion of their last order (deletion anomaly gone).</div>

<h3>Step 4 → BCNF: check every determinant</h3>
<div class="out">Go through the four tables: Customer (cust_id is the key ✓), Order (order_id ✓), Product (product_id ✓), OrderLine (the only FD is from the full key ✓).<br>
<b>Every determinant is a superkey → the schema is in BCNF.</b> Four tables, zero redundancy, all three anomalies eliminated.<br>
<b>Sanity check by joining back:</b> Customer ⋈ Order ⋈ OrderLine ⋈ Product reproduces exactly the original 1NF table, so nothing was lost.</div>

<h3>The four-line answer template for the exam</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>List all FDs and compute the candidate keys (lesson 4.2).</span></div>
  <div class="lz-fitem"><b>2</b><span>Name the violation: "X → Y is a partial / transitive dependency, so it is not in 2NF / 3NF".</span></div>
  <div class="lz-fitem"><b>3</b><span>Decompose and state the key of each new relation.</span></div>
  <div class="lz-fitem"><b>4</b><span>Verify: lossless (shared attribute is a key) and dependency preserving.</span></div>
</div>

<div class="pitfall"><b>Do not jump straight to the final answer.</b> Markers award points for naming <em>which</em> dependency violates <em>which</em> normal form. A correct final schema with no justification typically loses half the marks — and you cannot defend it in the oral check.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Above BCNF: 4NF and multivalued dependencies.</b> A table Course(course, lecturer, textbook) where lecturers and textbooks are independent of each other still forces you to store every lecturer × textbook combination — no FD is violated, yet the redundancy is obvious. That is a <em>multivalued</em> dependency, removed by 4NF, which splits it into (course, lecturer) and (course, textbook). 5NF handles the rarer join dependencies. In practice, a schema in BCNF is nearly always in 4NF too — but knowing the boundary is what separates "I memorised three normal forms" from "I understand what normalization removes". <em>Beyond syllabus because DBI202 stops at BCNF.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Bài chuẩn hoá trọn vẹn — đúng hình dạng câu hỏi thi</h2>
<p class="lead">Bài 4.1 đã định nghĩa các dạng chuẩn và 4.2 đã cho thuật toán tìm khoá. Ở đây chúng được áp dụng đầu-cuối, trên một bảng thiết kế tồi, có kiểm lại sau mỗi bước.</p>

<h3>Bảng xuất phát (0NF — chưa đạt cả 1NF)</h3>
<div class="diagram">Order(order_id, order_date, cust_id, cust_name, cust_city,
      products = "P1:2, P7:1", unit_price, total)</div>
<div class="out"><b>Những bất thường bảng này gây ra:</b><br>
<em>Bất thường khi thêm</em> — không ghi được khách hàng mới cho tới khi họ đặt hàng.<br>
<em>Bất thường khi sửa</em> — khách chuyển thành phố thì phải sửa ở mọi dòng đơn hàng của họ; sót một dòng là dữ liệu tự mâu thuẫn.<br>
<em>Bất thường khi xoá</em> — xoá đơn hàng duy nhất của khách là xoá luôn cả khách.<br>
Cả ba đều từ một nguyên nhân: <b>các sự việc về những thứ khác nhau bị nhét chung một dòng</b>.</div>

<h3>Bước 1 → 1NF: giá trị nguyên tố, không nhóm lặp</h3>
<p>Cột <span class="badge">products</span> đang chứa một danh sách. Hãy tách thành mỗi sản phẩm một dòng.</p>
<div class="out"><b>Order1NF(order_id, order_date, cust_id, cust_name, cust_city, product_id, qty, unit_price)</b><br>
<b>Khoá:</b> (order_id, product_id) — mỗi đơn mỗi sản phẩm một dòng.<br>
<b>Cũng bỏ luôn:</b> <span class="badge">total</span>, vì đó là thuộc tính dẫn xuất (tổng của qty × unit_price) và lưu lại chỉ mời gọi mâu thuẫn với các dòng chi tiết.</div>

<h3>Bước 2 → 2NF: bỏ phụ thuộc bộ phận vào một phần của khoá</h3>
<div class="out"><b>Liệt kê các phụ thuộc hàm:</b><br>
order_id → order_date, cust_id, cust_name, cust_city &nbsp; <em>(chỉ phụ thuộc MỘT PHẦN khoá)</em><br>
product_id → unit_price &nbsp; <em>(cũng chỉ một phần khoá)</em><br>
(order_id, product_id) → qty &nbsp; <em>(trọn khoá — đúng)</em><br>
<b>Tách thành ba bảng:</b><br>
<span class="badge">Order(order_id PK, order_date, cust_id, cust_name, cust_city)</span><br>
<span class="badge">Product(product_id PK, unit_price)</span><br>
<span class="badge">OrderLine(order_id, product_id, qty)</span>, PK (order_id, product_id), hai khoá ngoại<br>
<b>Kiểm không mất mát:</b> Order ∩ OrderLine = {order_id} là khoá của Order ✓ · Product ∩ OrderLine = {product_id} là khoá của Product ✓.</div>

<h3>Bước 3 → 3NF: bỏ phụ thuộc bắc cầu</h3>
<div class="out">Trong <b>Order</b>, <span class="badge">order_id → cust_id → cust_name, cust_city</span>: tên khách chỉ phụ thuộc khoá <em>thông qua</em> cust_id — một phụ thuộc bắc cầu, và là lý do bất thường khi sửa vẫn sống sót qua 2NF.<br>
<b>Tách:</b><br>
<span class="badge">Customer(cust_id PK, cust_name, cust_city)</span><br>
<span class="badge">Order(order_id PK, order_date, cust_id FK)</span><br>
<b>Giờ thành phố của khách chỉ lưu đúng một lần</b> — hết bất thường khi sửa, khách có thể tồn tại mà chưa có đơn nào (hết bất thường khi thêm) và vẫn sống sót khi đơn cuối bị xoá (hết bất thường khi xoá).</div>

<h3>Bước 4 → BCNF: soi mọi vế trái</h3>
<div class="out">Rà bốn bảng: Customer (cust_id là khoá ✓), Order (order_id ✓), Product (product_id ✓), OrderLine (phụ thuộc duy nhất xuất phát từ trọn khoá ✓).<br>
<b>Mọi vế trái đều là siêu khoá → lược đồ đạt BCNF.</b> Bốn bảng, không dư thừa, cả ba bất thường bị loại bỏ.<br>
<b>Kiểm lại bằng cách nối ngược:</b> Customer ⋈ Order ⋈ OrderLine ⋈ Product tái tạo đúng bảng 1NF ban đầu, nên không mất gì cả.</div>

<h3>Khuôn trả lời bốn dòng cho bài thi</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Liệt kê mọi phụ thuộc hàm và tính khoá dự tuyển (bài 4.2).</span></div>
  <div class="lz-fitem"><b>2</b><span>Gọi tên vi phạm: "X → Y là phụ thuộc bộ phận / bắc cầu, nên chưa đạt 2NF / 3NF".</span></div>
  <div class="lz-fitem"><b>3</b><span>Phân rã và nêu khoá của từng quan hệ mới.</span></div>
  <div class="lz-fitem"><b>4</b><span>Xác minh: không mất mát (thuộc tính chung là khoá) và bảo toàn phụ thuộc.</span></div>
</div>

<div class="pitfall"><b>Đừng nhảy thẳng tới đáp án cuối.</b> Người chấm cho điểm ở chỗ bạn gọi tên được <em>phụ thuộc nào</em> vi phạm <em>dạng chuẩn nào</em>. Một lược đồ cuối đúng mà không có lập luận thường chỉ được nửa điểm — và bạn cũng không bảo vệ được nó khi bị hỏi miệng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trên BCNF: 4NF và phụ thuộc đa trị.</b> Bảng Course(course, lecturer, textbook) mà giảng viên và giáo trình độc lập với nhau vẫn buộc bạn lưu mọi tổ hợp giảng viên × giáo trình — không phụ thuộc hàm nào bị vi phạm, nhưng dư thừa thì rõ mồn một. Đó là <em>phụ thuộc đa trị</em>, được 4NF loại bỏ bằng cách tách thành (course, lecturer) và (course, textbook). 5NF xử lý các phụ thuộc nối hiếm gặp hơn. Trong thực tế, lược đồ đạt BCNF thì gần như luôn đạt cả 4NF — nhưng biết ranh giới đó mới là khác biệt giữa "em thuộc ba dạng chuẩn" và "em hiểu chuẩn hoá loại bỏ cái gì". <em>Ngoài giáo trình vì DBI202 dừng ở BCNF.</em></div>
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
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Referential actions — what happens when a parent is deleted.</b> A foreign key does more than reject bad data; you can tell it how to react. <span class="badge">ON DELETE CASCADE</span> deletes the child rows too; <span class="badge">ON DELETE SET NULL</span> orphans them safely; the default <span class="badge">NO ACTION</span> blocks the delete. The same applies to <span class="badge">ON UPDATE</span>. Choosing wrong is dangerous — an unintended CASCADE can wipe a chain of tables in one statement. <em>The syllabus declares foreign keys; production databases live or die by which referential action you attach to them.</em></div>
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
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hành động tham chiếu — chuyện gì xảy ra khi xóa hàng cha.</b> Khóa ngoại không chỉ từ chối dữ liệu sai; bạn có thể bảo nó phản ứng thế nào. <span class="badge">ON DELETE CASCADE</span> xóa luôn các hàng con; <span class="badge">ON DELETE SET NULL</span> để chúng mồ côi an toàn; mặc định <span class="badge">NO ACTION</span> chặn việc xóa. Tương tự với <span class="badge">ON UPDATE</span>. Chọn sai thì nguy hiểm — một CASCADE ngoài ý muốn có thể xóa sạch một chuỗi bảng trong một câu lệnh. <em>Giáo trình khai báo khóa ngoại; CSDL thật sống chết bởi hành động tham chiếu bạn gắn vào chúng.</em></div>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-412" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Luyện: Schema Design & DDL</span><span class="lc-sub">CREATE bảng với khóa và ràng buộc.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '5.2 — Data types & the choices that hurt later|||5.2 — Kiểu dữ liệu & những lựa chọn để lại hậu quả',
          slug: 'dbi202-kieu-du-lieu',
          type: 'VIDEO',
          description: 'Kiểu dữ liệu SQL Server: chuỗi/số/ngày, NULL, IDENTITY — chọn sao cho không phải sửa lược đồ sau này.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>The column type is a constraint you cannot undo cheaply</h2>
<p class="lead">Choosing <span class="badge">VARCHAR(50)</span> instead of <span class="badge">NVARCHAR(100)</span> takes one second and can cost a production migration two years later. Types are the first and cheapest layer of data integrity.</p>

<h3>Strings — the Vietnamese trap</h3>
<table><thead><tr><th>Type</th><th>Storage</th><th>Use for</th></tr></thead><tbody>
<tr><td><span class="badge">CHAR(n)</span></td><td>fixed n bytes, padded</td><td>codes of a known fixed length ('VN', 'M'/'F')</td></tr>
<tr><td><span class="badge">VARCHAR(n)</span></td><td>actual length + 2</td><td>ASCII text: email, code, url</td></tr>
<tr><td><span class="badge">NVARCHAR(n)</span></td><td>2 bytes per character</td><td><b>any text that may contain Vietnamese</b></td></tr>
<tr><td><span class="badge">VARCHAR(MAX)</span></td><td>up to 2 GB, stored off-row</td><td>long content only — it cannot be indexed normally</td></tr>
</tbody></table>
<div class="out"><b>Why this matters here.</b> In SQL Server, <span class="badge">VARCHAR</span> uses the database code page; store "Nguyễn Thị Hoà" in one and you get "Nguyên Thi Hoa" — silently, with no error. Always use <span class="badge">NVARCHAR</span> for names, addresses and descriptions, and write literals with the N prefix: <span class="badge">N'Hà Nội'</span> — without the N the literal is converted <em>before</em> it reaches the column and the accents are already gone.</div>

<h3>Numbers — never store money in a float</h3>
<div class="out"><b>The demonstration:</b> <span class="badge">SELECT CAST(0.1 AS FLOAT) + CAST(0.2 AS FLOAT)</span> gives 0.30000000000000004. Binary floating point cannot represent 0.1 exactly, so sums of prices drift and two systems disagree by cents.<br>
<b>Correct:</b> <span class="badge">DECIMAL(18,2)</span> — exact decimal arithmetic, 18 significant digits, 2 after the point. Use <span class="badge">FLOAT/REAL</span> only for measurements where approximation is inherent (temperature, coordinates, sensor readings).<br>
<b>Integers:</b> TINYINT 0–255 · SMALLINT ±32K · INT ±2.1 billion · BIGINT for anything that counts events or rows at scale.</div>

<h3>Dates — one type per meaning</h3>
<pre><span class="tok-type">DATE</span>              <span class="tok-comment">-- birth date, due date: no time component</span>
<span class="tok-type">DATETIME2</span>(0)      <span class="tok-comment">-- timestamps; more precise and wider range than DATETIME</span>
<span class="tok-type">TIME</span>              <span class="tok-comment">-- an opening hour, independent of any day</span>
<span class="tok-type">DATETIMEOFFSET</span>    <span class="tok-comment">-- an instant plus its time zone: use for global systems</span></pre>
<p>Never store a date in a <span class="badge">VARCHAR</span>: sorting becomes alphabetical ('10/01' &lt; '2/01'), date arithmetic is impossible, and the format silently depends on the client's locale.</p>

<h3>NULL — the third truth value</h3>
<div class="out"><b>NULL means "unknown", not "empty" and not "zero".</b> Consequences you will meet in Chapter 6:<br>
<span class="badge">NULL = NULL</span> is <em>not</em> true — it is unknown. Use <span class="badge">IS NULL</span>.<br>
<span class="badge">5 + NULL</span> = NULL; any arithmetic with an unknown is unknown.<br>
<span class="badge">COUNT(col)</span> skips NULLs while <span class="badge">COUNT(*)</span> counts rows — the classic source of "the two numbers do not match".<br>
<b>Design rule:</b> declare NOT NULL by default and allow NULL only when "unknown" is a genuine, meaningful state.</div>

<h3>Surrogate keys and IDENTITY</h3>
<pre>id <span class="tok-type">INT IDENTITY</span>(1,1) <span class="tok-keyword">PRIMARY KEY</span>          <span class="tok-comment">-- auto-increment, per table</span>
id <span class="tok-type">UNIQUEIDENTIFIER DEFAULT NEWID</span>()       <span class="tok-comment">-- GUID: unique across servers, but 16 bytes</span></pre>
<div class="out"><b>Natural key or surrogate?</b> A natural key (student code, ISBN) is meaningful and needs no extra column, but it changes when the business changes and it is wide, so every foreign key copies that width. A surrogate is meaningless, narrow, immutable — and requires an extra UNIQUE constraint on the natural key so you do not insert the same student twice.<br>
<b>Common practice:</b> surrogate primary key + UNIQUE on the natural key. You get both.</div>

<div class="pitfall"><b>IDENTITY values are consumed even by rolled-back transactions.</b> If an insert fails, that number is gone forever and your ids will have gaps. That is by design — gaps are not corruption. Never use "the maximum id" as a count, and never expose IDENTITY values as sequential public references (customers notice that invoice #431 followed #430 and infer your volume).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Types decide how many rows fit on a page.</b> SQL Server reads and writes 8 KB pages. A row of 100 bytes gives ~80 rows per page; padding the same row to 400 bytes with over-sized <span class="badge">CHAR</span> and <span class="badge">NVARCHAR(MAX)</span> columns gives ~20 — so a full table scan needs four times as many disk reads, and four times as much cache to hold the hot data. Choosing narrow types is a performance decision long before it is a tidiness decision. <em>Beyond syllabus because the course treats types as syntax, while their real effect is on the I/O count that determines query speed (lesson 8.1).</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Kiểu của cột là một ràng buộc không dễ rút lại</h2>
<p class="lead">Chọn <span class="badge">VARCHAR(50)</span> thay vì <span class="badge">NVARCHAR(100)</span> mất một giây và có thể khiến hai năm sau phải di trú dữ liệu trên môi trường thật. Kiểu dữ liệu là lớp toàn vẹn đầu tiên và rẻ nhất.</p>

<h3>Chuỗi — cái bẫy tiếng Việt</h3>
<table><thead><tr><th>Kiểu</th><th>Lưu trữ</th><th>Dùng cho</th></tr></thead><tbody>
<tr><td><span class="badge">CHAR(n)</span></td><td>cố định n byte, đệm thêm</td><td>mã có độ dài cố định đã biết ('VN', 'M'/'F')</td></tr>
<tr><td><span class="badge">VARCHAR(n)</span></td><td>độ dài thật + 2</td><td>văn bản ASCII: email, mã, url</td></tr>
<tr><td><span class="badge">NVARCHAR(n)</span></td><td>2 byte mỗi ký tự</td><td><b>mọi văn bản có thể chứa tiếng Việt</b></td></tr>
<tr><td><span class="badge">VARCHAR(MAX)</span></td><td>tới 2 GB, lưu ngoài dòng</td><td>chỉ cho nội dung dài — không đánh chỉ mục bình thường được</td></tr>
</tbody></table>
<div class="out"><b>Vì sao điều này quan trọng với chúng ta.</b> Trong SQL Server, <span class="badge">VARCHAR</span> dùng bảng mã của cơ sở dữ liệu; lưu "Nguyễn Thị Hoà" vào đó thì nhận lại "Nguyên Thi Hoa" — âm thầm, không báo lỗi. Luôn dùng <span class="badge">NVARCHAR</span> cho tên, địa chỉ, mô tả, và viết hằng chuỗi có tiền tố N: <span class="badge">N'Hà Nội'</span> — thiếu chữ N thì hằng đã bị chuyển đổi <em>trước khi</em> chạm tới cột và dấu đã mất từ trước.</div>

<h3>Số — đừng bao giờ lưu tiền bằng số thực dấu phẩy động</h3>
<div class="out"><b>Minh chứng:</b> <span class="badge">SELECT CAST(0.1 AS FLOAT) + CAST(0.2 AS FLOAT)</span> cho 0.30000000000000004. Số thực nhị phân không biểu diễn chính xác được 0,1, nên tổng các mức giá trôi dần và hai hệ thống lệch nhau vài xu.<br>
<b>Đúng:</b> <span class="badge">DECIMAL(18,2)</span> — số học thập phân chính xác, 18 chữ số, 2 chữ số sau dấu phẩy. Chỉ dùng <span class="badge">FLOAT/REAL</span> cho các đại lượng đo đạc vốn đã là xấp xỉ (nhiệt độ, toạ độ, số liệu cảm biến).<br>
<b>Số nguyên:</b> TINYINT 0–255 · SMALLINT ±32 nghìn · INT ±2,1 tỉ · BIGINT cho những thứ đếm sự kiện hoặc dòng ở quy mô lớn.</div>

<h3>Ngày giờ — mỗi ý nghĩa một kiểu</h3>
<pre><span class="tok-type">DATE</span>              <span class="tok-comment">-- ngày sinh, hạn trả: không có phần giờ</span>
<span class="tok-type">DATETIME2</span>(0)      <span class="tok-comment">-- mốc thời gian; chính xác hơn và dải rộng hơn DATETIME</span>
<span class="tok-type">TIME</span>              <span class="tok-comment">-- giờ mở cửa, độc lập với ngày nào</span>
<span class="tok-type">DATETIMEOFFSET</span>    <span class="tok-comment">-- một thời điểm kèm múi giờ: dùng cho hệ thống toàn cầu</span></pre>
<p>Đừng bao giờ lưu ngày vào <span class="badge">VARCHAR</span>: sắp xếp sẽ theo bảng chữ cái ('10/01' &lt; '2/01'), không tính toán ngày tháng được, và định dạng thì âm thầm phụ thuộc vào locale của máy khách.</p>

<h3>NULL — giá trị chân lý thứ ba</h3>
<div class="out"><b>NULL nghĩa là "không biết", không phải "rỗng" và cũng không phải "bằng 0".</b> Hệ quả bạn sẽ gặp ở Chương 6:<br>
<span class="badge">NULL = NULL</span> <em>không</em> đúng — nó là không xác định. Phải dùng <span class="badge">IS NULL</span>.<br>
<span class="badge">5 + NULL</span> = NULL; mọi phép tính với một ẩn số đều ra ẩn số.<br>
<span class="badge">COUNT(col)</span> bỏ qua NULL còn <span class="badge">COUNT(*)</span> đếm dòng — nguồn gốc kinh điển của chuyện "hai con số không khớp nhau".<br>
<b>Quy tắc thiết kế:</b> mặc định khai NOT NULL, chỉ cho phép NULL khi "không biết" thật sự là một trạng thái có nghĩa.</div>

<h3>Khoá thay thế và IDENTITY</h3>
<pre>id <span class="tok-type">INT IDENTITY</span>(1,1) <span class="tok-keyword">PRIMARY KEY</span>          <span class="tok-comment">-- tự tăng, theo từng bảng</span>
id <span class="tok-type">UNIQUEIDENTIFIER DEFAULT NEWID</span>()       <span class="tok-comment">-- GUID: duy nhất xuyên máy chủ, nhưng 16 byte</span></pre>
<div class="out"><b>Khoá tự nhiên hay khoá thay thế?</b> Khoá tự nhiên (mã sinh viên, ISBN) có ý nghĩa và không tốn thêm cột, nhưng nó đổi khi nghiệp vụ đổi và nó rộng, nên mọi khoá ngoại đều phải chép theo độ rộng đó. Khoá thay thế thì vô nghĩa, hẹp, bất biến — và đòi hỏi thêm một ràng buộc UNIQUE trên khoá tự nhiên để bạn không chèn trùng một sinh viên hai lần.<br>
<b>Thực hành phổ biến:</b> khoá chính thay thế + UNIQUE trên khoá tự nhiên. Được cả hai.</div>

<div class="pitfall"><b>Giá trị IDENTITY bị tiêu thụ ngay cả bởi giao dịch bị huỷ.</b> Nếu một lệnh chèn thất bại, con số đó mất vĩnh viễn và dãy id của bạn sẽ có lỗ hổng. Đó là thiết kế cố ý — lỗ hổng không phải hỏng dữ liệu. Đừng bao giờ lấy "id lớn nhất" làm số lượng, và đừng phơi giá trị IDENTITY ra ngoài dưới dạng mã công khai liên tiếp (khách hàng thấy hoá đơn #431 ngay sau #430 là đoán được doanh số của bạn).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kiểu dữ liệu quyết định mỗi trang chứa được bao nhiêu dòng.</b> SQL Server đọc và ghi theo trang 8 KB. Một dòng 100 byte cho ~80 dòng mỗi trang; nhồi đúng dòng đó lên 400 byte bằng các cột <span class="badge">CHAR</span> quá khổ và <span class="badge">NVARCHAR(MAX)</span> thì chỉ còn ~20 — nên quét toàn bảng cần gấp bốn lần số lần đọc đĩa, và gấp bốn lần bộ nhớ đệm để giữ dữ liệu nóng. Chọn kiểu hẹp là quyết định hiệu năng, từ rất lâu trước khi nó là chuyện gọn gàng. <em>Ngoài giáo trình vì môn học coi kiểu dữ liệu là cú pháp, trong khi tác dụng thật của chúng là lên số lần vào/ra vốn quyết định tốc độ truy vấn (bài 8.1).</em></div>
</div>
`,
        },
        {
          title: '5.3 — Constraints in SQL Server & ALTER TABLE|||5.3 — Ràng buộc trong SQL Server & ALTER TABLE',
          slug: 'dbi202-rang-buoc-sql',
          type: 'VIDEO',
          description: 'PK/FK/UNIQUE/CHECK/DEFAULT viết đúng cú pháp, quy ước đặt tên, và cách sửa lược đồ đã có dữ liệu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Writing the rules of lesson 2.4 in real SQL Server</h2>
<p class="lead">Lesson 2.4 explained <em>why</em> constraints exist. Here is the exact syntax the lab and the PE expect — including the naming convention that makes error messages readable.</p>

<h3>A complete table definition</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> Enrolment (
    enrol_id   <span class="tok-type">INT IDENTITY</span>(1,1),
    sid        <span class="tok-type">INT</span>            <span class="tok-keyword">NOT NULL</span>,
    cid        <span class="tok-type">CHAR</span>(6)       <span class="tok-keyword">NOT NULL</span>,
    grade      <span class="tok-type">DECIMAL</span>(4,2)  <span class="tok-keyword">NULL</span>,
    status     <span class="tok-type">VARCHAR</span>(10)   <span class="tok-keyword">NOT NULL CONSTRAINT</span> df_enrol_status <span class="tok-keyword">DEFAULT</span> <span class="tok-string">'ACTIVE'</span>,
    created_at <span class="tok-type">DATETIME2</span>(0)  <span class="tok-keyword">NOT NULL CONSTRAINT</span> df_enrol_created <span class="tok-keyword">DEFAULT SYSDATETIME</span>(),

    <span class="tok-keyword">CONSTRAINT</span> pk_enrol      <span class="tok-keyword">PRIMARY KEY</span> (enrol_id),
    <span class="tok-keyword">CONSTRAINT</span> uq_enrol      <span class="tok-keyword">UNIQUE</span> (sid, cid),
    <span class="tok-keyword">CONSTRAINT</span> fk_enrol_stu  <span class="tok-keyword">FOREIGN KEY</span> (sid) <span class="tok-keyword">REFERENCES</span> Student(sid) <span class="tok-keyword">ON DELETE CASCADE</span>,
    <span class="tok-keyword">CONSTRAINT</span> fk_enrol_crs  <span class="tok-keyword">FOREIGN KEY</span> (cid) <span class="tok-keyword">REFERENCES</span> Course(cid),
    <span class="tok-keyword">CONSTRAINT</span> ck_enrol_grade <span class="tok-keyword">CHECK</span> (grade <span class="tok-keyword">IS NULL OR</span> grade <span class="tok-keyword">BETWEEN</span> 0 <span class="tok-keyword">AND</span> 10),
    <span class="tok-keyword">CONSTRAINT</span> ck_enrol_status <span class="tok-keyword">CHECK</span> (status <span class="tok-keyword">IN</span> (<span class="tok-string">'ACTIVE'</span>, <span class="tok-string">'DROPPED'</span>, <span class="tok-string">'DONE'</span>))
);</pre>
<div class="out"><b>Read the design decisions in that block:</b><br>
<b>enrol_id</b> is a surrogate key, but <b>uq_enrol (sid, cid)</b> still enforces the real business rule — a student cannot enrol twice in one course. Without it the surrogate key would allow exactly that.<br>
<b>grade is nullable</b> because "not graded yet" is a genuine unknown; the CHECK therefore has to tolerate NULL explicitly.<br>
<b>ON DELETE CASCADE on the student</b> but not on the course: deleting a student removes their enrolments, while deleting a course that still has enrolments should fail.<br>
<b>Named constraints</b> mean the error says <span class="badge">ck_enrol_grade</span> instead of <span class="badge">CK__Enrolmen__grade__3B75D760</span> — and named constraints can be dropped by name later.</div>

<h3>Naming convention (use it in the lab; markers notice)</h3>
<table><thead><tr><th>Prefix</th><th>For</th><th>Example</th></tr></thead><tbody>
<tr><td>pk_</td><td>primary key</td><td>pk_enrol</td></tr>
<tr><td>fk_child_parent</td><td>foreign key</td><td>fk_enrol_stu</td></tr>
<tr><td>uq_</td><td>unique</td><td>uq_enrol</td></tr>
<tr><td>ck_</td><td>check</td><td>ck_enrol_grade</td></tr>
<tr><td>df_</td><td>default</td><td>df_enrol_status</td></tr>
</tbody></table>

<h3>Changing a table that already holds data</h3>
<pre><span class="tok-keyword">ALTER TABLE</span> Student <span class="tok-keyword">ADD</span> email <span class="tok-type">NVARCHAR</span>(100) <span class="tok-keyword">NULL</span>;               <span class="tok-comment">-- 1. add nullable</span>
<span class="tok-keyword">UPDATE</span> Student <span class="tok-keyword">SET</span> email = sid + <span class="tok-string">'@fpt.edu.vn'</span> <span class="tok-keyword">WHERE</span> email <span class="tok-keyword">IS NULL</span>;  <span class="tok-comment">-- 2. backfill</span>
<span class="tok-keyword">ALTER TABLE</span> Student <span class="tok-keyword">ALTER COLUMN</span> email <span class="tok-type">NVARCHAR</span>(100) <span class="tok-keyword">NOT NULL</span>;    <span class="tok-comment">-- 3. tighten</span>
<span class="tok-keyword">ALTER TABLE</span> Student <span class="tok-keyword">ADD CONSTRAINT</span> uq_student_email <span class="tok-keyword">UNIQUE</span> (email);  <span class="tok-comment">-- 4. constrain</span></pre>
<p>That three-step dance — add nullable, backfill, then tighten — is the only way to add a NOT NULL column to a non-empty table. Adding it directly fails, because existing rows would have no value.</p>
<div class="out"><b>Adding a constraint to dirty data:</b> <span class="badge">ALTER TABLE … ADD CONSTRAINT ck … CHECK (…)</span> validates every existing row and fails if any row breaks the rule. Find the offenders first with <span class="badge">SELECT * FROM T WHERE NOT (condition)</span>, fix them, then add the constraint. <span class="badge">WITH NOCHECK</span> skips validation of old rows — convenient, dangerous, and it leaves the constraint "untrusted" so the optimiser stops using it.</div>

<div class="pitfall"><b><span class="badge">DROP TABLE</span> fails while another table references it</b> — remove the child tables (or the foreign keys) first. Drop in reverse dependency order: children before parents, the mirror image of the creation order in lesson 3.4.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Schema changes belong in version control, not in SSMS.</b> Professional teams never edit a production schema by hand: every change is a numbered migration script (<span class="badge">V007__add_email.sql</span>), committed to git, applied in order by a tool (Flyway, Liquibase, EF Migrations, Prisma Migrate) that records which scripts have run. That gives every environment the same schema, makes the change reviewable, and gives you a rollback plan. <em>Beyond syllabus because the lab has you type DDL interactively, while the first thing a real job will ask is "where is the migration?".</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Viết các luật ở bài 2.4 bằng SQL Server thật</h2>
<p class="lead">Bài 2.4 giải thích <em>vì sao</em> có ràng buộc. Đây là cú pháp chính xác mà bài lab và PE mong đợi — kèm quy ước đặt tên giúp thông báo lỗi đọc được.</p>

<h3>Một định nghĩa bảng đầy đủ</h3>
<pre><span class="tok-keyword">CREATE TABLE</span> Enrolment (
    enrol_id   <span class="tok-type">INT IDENTITY</span>(1,1),
    sid        <span class="tok-type">INT</span>            <span class="tok-keyword">NOT NULL</span>,
    cid        <span class="tok-type">CHAR</span>(6)       <span class="tok-keyword">NOT NULL</span>,
    grade      <span class="tok-type">DECIMAL</span>(4,2)  <span class="tok-keyword">NULL</span>,
    status     <span class="tok-type">VARCHAR</span>(10)   <span class="tok-keyword">NOT NULL CONSTRAINT</span> df_enrol_status <span class="tok-keyword">DEFAULT</span> <span class="tok-string">'ACTIVE'</span>,
    created_at <span class="tok-type">DATETIME2</span>(0)  <span class="tok-keyword">NOT NULL CONSTRAINT</span> df_enrol_created <span class="tok-keyword">DEFAULT SYSDATETIME</span>(),

    <span class="tok-keyword">CONSTRAINT</span> pk_enrol      <span class="tok-keyword">PRIMARY KEY</span> (enrol_id),
    <span class="tok-keyword">CONSTRAINT</span> uq_enrol      <span class="tok-keyword">UNIQUE</span> (sid, cid),
    <span class="tok-keyword">CONSTRAINT</span> fk_enrol_stu  <span class="tok-keyword">FOREIGN KEY</span> (sid) <span class="tok-keyword">REFERENCES</span> Student(sid) <span class="tok-keyword">ON DELETE CASCADE</span>,
    <span class="tok-keyword">CONSTRAINT</span> fk_enrol_crs  <span class="tok-keyword">FOREIGN KEY</span> (cid) <span class="tok-keyword">REFERENCES</span> Course(cid),
    <span class="tok-keyword">CONSTRAINT</span> ck_enrol_grade <span class="tok-keyword">CHECK</span> (grade <span class="tok-keyword">IS NULL OR</span> grade <span class="tok-keyword">BETWEEN</span> 0 <span class="tok-keyword">AND</span> 10),
    <span class="tok-keyword">CONSTRAINT</span> ck_enrol_status <span class="tok-keyword">CHECK</span> (status <span class="tok-keyword">IN</span> (<span class="tok-string">'ACTIVE'</span>, <span class="tok-string">'DROPPED'</span>, <span class="tok-string">'DONE'</span>))
);</pre>
<div class="out"><b>Đọc các quyết định thiết kế trong khối đó:</b><br>
<b>enrol_id</b> là khoá thay thế, nhưng <b>uq_enrol (sid, cid)</b> mới là thứ áp đặt luật nghiệp vụ thật — một sinh viên không được đăng ký hai lần cùng một môn. Thiếu nó thì khoá thay thế cho phép đúng chuyện đó xảy ra.<br>
<b>grade cho phép null</b> vì "chưa chấm" là một ẩn số có thật; do đó ràng buộc CHECK phải chấp nhận NULL một cách tường minh.<br>
<b>ON DELETE CASCADE ở phía sinh viên</b> nhưng không ở phía môn học: xoá sinh viên thì xoá luôn các đăng ký, còn xoá một môn vẫn còn người đăng ký thì phải thất bại.<br>
<b>Ràng buộc có tên</b> giúp lỗi báo ra là <span class="badge">ck_enrol_grade</span> thay vì <span class="badge">CK__Enrolmen__grade__3B75D760</span> — và ràng buộc có tên thì sau này gỡ theo tên được.</div>

<h3>Quy ước đặt tên (dùng trong bài lab; người chấm để ý)</h3>
<table><thead><tr><th>Tiền tố</th><th>Cho</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>pk_</td><td>khoá chính</td><td>pk_enrol</td></tr>
<tr><td>fk_con_cha</td><td>khoá ngoại</td><td>fk_enrol_stu</td></tr>
<tr><td>uq_</td><td>duy nhất</td><td>uq_enrol</td></tr>
<tr><td>ck_</td><td>kiểm tra</td><td>ck_enrol_grade</td></tr>
<tr><td>df_</td><td>mặc định</td><td>df_enrol_status</td></tr>
</tbody></table>

<h3>Sửa một bảng đã có dữ liệu</h3>
<pre><span class="tok-keyword">ALTER TABLE</span> Student <span class="tok-keyword">ADD</span> email <span class="tok-type">NVARCHAR</span>(100) <span class="tok-keyword">NULL</span>;               <span class="tok-comment">-- 1. thêm cột cho phép null</span>
<span class="tok-keyword">UPDATE</span> Student <span class="tok-keyword">SET</span> email = sid + <span class="tok-string">'@fpt.edu.vn'</span> <span class="tok-keyword">WHERE</span> email <span class="tok-keyword">IS NULL</span>;  <span class="tok-comment">-- 2. lấp dữ liệu</span>
<span class="tok-keyword">ALTER TABLE</span> Student <span class="tok-keyword">ALTER COLUMN</span> email <span class="tok-type">NVARCHAR</span>(100) <span class="tok-keyword">NOT NULL</span>;    <span class="tok-comment">-- 3. siết lại</span>
<span class="tok-keyword">ALTER TABLE</span> Student <span class="tok-keyword">ADD CONSTRAINT</span> uq_student_email <span class="tok-keyword">UNIQUE</span> (email);  <span class="tok-comment">-- 4. ràng buộc</span></pre>
<p>Điệu nhảy ba bước đó — thêm cột null, lấp dữ liệu, rồi siết lại — là cách duy nhất để thêm một cột NOT NULL vào bảng đã có dữ liệu. Thêm thẳng sẽ thất bại, vì các dòng cũ không có giá trị nào.</p>
<div class="out"><b>Thêm ràng buộc vào dữ liệu bẩn:</b> <span class="badge">ALTER TABLE … ADD CONSTRAINT ck … CHECK (…)</span> kiểm mọi dòng hiện có và thất bại nếu có dòng nào phạm luật. Hãy tìm các dòng vi phạm trước bằng <span class="badge">SELECT * FROM T WHERE NOT (điều kiện)</span>, sửa chúng, rồi mới thêm ràng buộc. <span class="badge">WITH NOCHECK</span> bỏ qua việc kiểm dữ liệu cũ — tiện, nguy hiểm, và nó để lại một ràng buộc "không đáng tin" khiến bộ tối ưu thôi không dùng tới.</div>

<div class="pitfall"><b><span class="badge">DROP TABLE</span> thất bại khi còn bảng khác tham chiếu tới nó</b> — hãy xoá bảng con (hoặc các khoá ngoại) trước. Xoá theo thứ tự phụ thuộc ngược lại: con trước cha sau, đúng ảnh gương của thứ tự tạo bảng ở bài 3.4.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thay đổi lược đồ thuộc về hệ quản lý phiên bản, không phải SSMS.</b> Đội ngũ chuyên nghiệp không bao giờ sửa lược đồ trên môi trường thật bằng tay: mọi thay đổi là một script di trú có đánh số (<span class="badge">V007__add_email.sql</span>), commit vào git, được một công cụ (Flyway, Liquibase, EF Migrations, Prisma Migrate) chạy theo thứ tự và ghi lại script nào đã chạy. Nhờ đó mọi môi trường có cùng lược đồ, thay đổi được review, và bạn có phương án quay lui. <em>Ngoài giáo trình vì bài lab bắt bạn gõ DDL tương tác, còn câu hỏi đầu tiên của công việc thật sẽ là "script di trú đâu?".</em></div>
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
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>How the engine actually joins.</b> &#96;JOIN&#96; is what you ask for; the optimizer decides <em>how</em>. It picks among three physical algorithms: <b>nested-loop</b> (great when one side is tiny or indexed), <b>hash join</b> (best for large unsorted tables — build a hash on one side, probe with the other), and <b>merge join</b> (unbeatable when both inputs arrive sorted on the key). Run <span class="badge">SET SHOWPLAN_ALL ON</span> or read the execution plan to see which one fired. <em>The syllabus teaches JOIN syntax; the plan behind it is why the same query is instant on one schema and a minute on another.</em></div>
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
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Máy thực sự nối bảng thế nào.</b> &#96;JOIN&#96; là điều bạn yêu cầu; bộ tối ưu quyết định <em>cách làm</em>. Nó chọn giữa ba thuật toán vật lý: <b>nested-loop</b> (tuyệt khi một bên rất nhỏ hoặc có chỉ mục), <b>hash join</b> (tốt cho bảng lớn chưa sắp — dựng bảng băm một bên, dò bằng bên kia), và <b>merge join</b> (vô địch khi cả hai đầu vào tới đã sắp theo khóa). Chạy <span class="badge">SET SHOWPLAN_ALL ON</span> hoặc đọc execution plan để xem cái nào chạy. <em>Giáo trình dạy cú pháp JOIN; kế hoạch phía sau mới giải thích vì sao cùng một truy vấn tức thì trên lược đồ này mà mất một phút trên lược đồ khác.</em></div>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-409" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Luyện: Joins & truy vấn nhiều bảng</span><span class="lc-sub">Kỹ năng SQL được kiểm nhiều nhất.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '6.2 — Every join, with the result table|||6.2 — Toàn bộ các phép JOIN, kèm bảng kết quả',
          slug: 'dbi202-join-day-du',
          type: 'VIDEO',
          description: 'INNER/LEFT/RIGHT/FULL/CROSS/SELF join chạy trên cùng một bộ dữ liệu — nhìn thấy kết quả khác nhau ra sao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Six joins, one data set, six different answers</h2>
<p class="lead">Joins are where most PE marks are won and lost. The fastest way to master them is to run every kind on the same tiny tables and <em>look</em> at what comes back.</p>

<h3>The data</h3>
<div class="diagram">Employee                     Department
 eid  name   did              did  dname
  1   An      10               10  Sales
  2   Binh    20               20  IT
  3   Chi    NULL              30  HR      ← nobody works here</div>

<h3>INNER JOIN — only matching rows</h3>
<pre><span class="tok-keyword">SELECT</span> e.name, d.dname
<span class="tok-keyword">FROM</span> Employee e <span class="tok-keyword">INNER JOIN</span> Department d <span class="tok-keyword">ON</span> e.did = d.did;</pre>
<div class="out"><b>Result — 2 rows:</b> (An, Sales) · (Binh, IT).<br>
Chi has no department (NULL never matches anything) and HR has no employees. Both disappear.</div>

<h3>LEFT JOIN — every row of the left table</h3>
<pre><span class="tok-keyword">SELECT</span> e.name, d.dname
<span class="tok-keyword">FROM</span> Employee e <span class="tok-keyword">LEFT JOIN</span> Department d <span class="tok-keyword">ON</span> e.did = d.did;</pre>
<div class="out"><b>Result — 3 rows:</b> (An, Sales) · (Binh, IT) · <b>(Chi, NULL)</b>.<br>
This is how you answer "list all employees, with their department if they have one". The unmatched side is filled with NULL.</div>

<h3>The anti-join pattern — "who has nothing?"</h3>
<pre><span class="tok-keyword">SELECT</span> d.dname
<span class="tok-keyword">FROM</span> Department d <span class="tok-keyword">LEFT JOIN</span> Employee e <span class="tok-keyword">ON</span> d.did = e.did
<span class="tok-keyword">WHERE</span> e.eid <span class="tok-keyword">IS NULL</span>;      <span class="tok-comment">-- keep only the rows that did NOT match</span></pre>
<div class="out"><b>Result: HR.</b> This three-line idiom answers a whole family of exam questions: departments with no employees, customers with no orders, products never sold. Learn it as one unit — LEFT JOIN plus <span class="badge">WHERE right.key IS NULL</span>.</div>

<h3>RIGHT and FULL</h3>
<div class="out"><b>RIGHT JOIN</b> keeps every department: (An, Sales) · (Binh, IT) · <b>(NULL, HR)</b>. It is a LEFT JOIN with the tables swapped — most teams write only LEFT joins so the reading direction stays constant.<br>
<b>FULL OUTER JOIN</b> keeps both unmatched sides — 4 rows: the two matches, plus (Chi, NULL) and (NULL, HR). Used mainly for reconciling two data sources.</div>

<h3>CROSS JOIN and SELF JOIN</h3>
<div class="out"><b>CROSS JOIN</b> = every combination: 3 employees × 3 departments = <b>9 rows</b>. Deliberately useful for generating grids (every student × every subject to find missing enrolments); accidentally produced when you forget the ON condition — and that is what turns a query on two 10,000-row tables into 100 million rows.<br>
<b>SELF JOIN</b> joins a table to itself, always with aliases:<br>
<span class="badge">SELECT e.name AS staff, m.name AS manager FROM Employee e LEFT JOIN Employee m ON e.mgr_id = m.eid</span><br>
LEFT is required so the top manager, whose <span class="badge">mgr_id</span> is NULL, still appears.</div>

<h3>WHERE versus ON in an outer join — the classic trap</h3>
<div class="out"><b>These two are not the same:</b><br>
<span class="badge">LEFT JOIN Department d ON e.did = d.did AND d.dname = 'IT'</span> → the condition is part of the <em>match</em>; all 3 employees still appear, with dname filled only for Binh.<br>
<span class="badge">LEFT JOIN Department d ON e.did = d.did WHERE d.dname = 'IT'</span> → the WHERE runs <em>after</em> the join and discards rows where dname is NULL, so Chi and An vanish — the outer join has silently become an inner join.<br>
<b>Rule:</b> conditions on the <em>optional</em> table go in ON; conditions on the guaranteed table go in WHERE.</div>

<div class="pitfall"><b>Row counts after a join are not what beginners expect.</b> An inner join can return <em>more</em> rows than either table (one order matching three order lines gives three rows) or fewer (unmatched rows vanish). Before trusting an aggregate over a join, run the join alone and count — a duplicated join is the number-one cause of "my SUM is too big".</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The three physical join algorithms.</b> Your <span class="badge">JOIN</span> keyword says <em>what</em>, not <em>how</em>; the optimiser picks one of three: <b>nested loops</b> (for each row of the small table, look up the other via an index — best when one side is tiny), <b>merge join</b> (both inputs sorted, walk them together — best when indexes already provide the order), <b>hash join</b> (build a hash table of the smaller side, probe with the larger — best for big unsorted sets). Reading which one appeared in the execution plan (lesson 8.2) tells you immediately whether the missing index is the problem. <em>Beyond syllabus because SQL is declarative, yet performance work is entirely about the physical operator that was chosen.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Sáu phép nối, một bộ dữ liệu, sáu đáp án khác nhau</h2>
<p class="lead">Phép nối là nơi phần lớn điểm PE được ăn hoặc bị mất. Cách nắm nhanh nhất là chạy đủ mọi kiểu nối trên cùng vài bảng tí hon và <em>nhìn</em> kết quả trả về.</p>

<h3>Dữ liệu</h3>
<div class="diagram">Employee                     Department
 eid  name   did              did  dname
  1   An      10               10  Sales
  2   Binh    20               20  IT
  3   Chi    NULL              30  HR      ← không ai làm ở đây</div>

<h3>INNER JOIN — chỉ những dòng khớp</h3>
<pre><span class="tok-keyword">SELECT</span> e.name, d.dname
<span class="tok-keyword">FROM</span> Employee e <span class="tok-keyword">INNER JOIN</span> Department d <span class="tok-keyword">ON</span> e.did = d.did;</pre>
<div class="out"><b>Kết quả — 2 dòng:</b> (An, Sales) · (Binh, IT).<br>
Chi không thuộc phòng nào (NULL không bao giờ khớp với gì cả) và HR không có nhân viên. Cả hai biến mất.</div>

<h3>LEFT JOIN — giữ mọi dòng của bảng bên trái</h3>
<pre><span class="tok-keyword">SELECT</span> e.name, d.dname
<span class="tok-keyword">FROM</span> Employee e <span class="tok-keyword">LEFT JOIN</span> Department d <span class="tok-keyword">ON</span> e.did = d.did;</pre>
<div class="out"><b>Kết quả — 3 dòng:</b> (An, Sales) · (Binh, IT) · <b>(Chi, NULL)</b>.<br>
Đây là cách trả lời "liệt kê tất cả nhân viên, kèm phòng ban nếu có". Phía không khớp được lấp bằng NULL.</div>

<h3>Khuôn phản nối — "ai không có gì?"</h3>
<pre><span class="tok-keyword">SELECT</span> d.dname
<span class="tok-keyword">FROM</span> Department d <span class="tok-keyword">LEFT JOIN</span> Employee e <span class="tok-keyword">ON</span> d.did = e.did
<span class="tok-keyword">WHERE</span> e.eid <span class="tok-keyword">IS NULL</span>;      <span class="tok-comment">-- chỉ giữ những dòng KHÔNG khớp</span></pre>
<div class="out"><b>Kết quả: HR.</b> Thành ngữ ba dòng này trả lời cả một họ câu hỏi thi: phòng ban không có nhân viên, khách hàng chưa từng đặt hàng, sản phẩm chưa bán được cái nào. Hãy học nó như một khối — LEFT JOIN cộng <span class="badge">WHERE khoá_phải IS NULL</span>.</div>

<h3>RIGHT và FULL</h3>
<div class="out"><b>RIGHT JOIN</b> giữ mọi phòng ban: (An, Sales) · (Binh, IT) · <b>(NULL, HR)</b>. Nó là LEFT JOIN với hai bảng đổi chỗ — phần lớn đội ngũ chỉ viết LEFT để hướng đọc luôn nhất quán.<br>
<b>FULL OUTER JOIN</b> giữ cả hai phía không khớp — 4 dòng: hai dòng khớp, cộng (Chi, NULL) và (NULL, HR). Chủ yếu dùng để đối soát hai nguồn dữ liệu.</div>

<h3>CROSS JOIN và SELF JOIN</h3>
<div class="out"><b>CROSS JOIN</b> = mọi tổ hợp: 3 nhân viên × 3 phòng ban = <b>9 dòng</b>. Có chủ đích thì hữu ích để sinh lưới (mọi sinh viên × mọi môn để tìm chỗ chưa đăng ký); vô tình thì xảy ra khi bạn quên điều kiện ON — và đó là thứ biến một truy vấn trên hai bảng 10.000 dòng thành 100 triệu dòng.<br>
<b>SELF JOIN</b> nối một bảng với chính nó, luôn phải đặt bí danh:<br>
<span class="badge">SELECT e.name AS staff, m.name AS manager FROM Employee e LEFT JOIN Employee m ON e.mgr_id = m.eid</span><br>
Bắt buộc dùng LEFT để người quản lý cao nhất, vốn có <span class="badge">mgr_id</span> là NULL, vẫn hiện ra.</div>

<h3>WHERE với ON trong phép nối ngoài — cái bẫy kinh điển</h3>
<div class="out"><b>Hai câu này không giống nhau:</b><br>
<span class="badge">LEFT JOIN Department d ON e.did = d.did AND d.dname = 'IT'</span> → điều kiện là một phần của phép <em>khớp</em>; cả 3 nhân viên vẫn hiện, chỉ Binh có dname.<br>
<span class="badge">LEFT JOIN Department d ON e.did = d.did WHERE d.dname = 'IT'</span> → mệnh đề WHERE chạy <em>sau</em> phép nối và loại các dòng có dname là NULL, nên Chi và An biến mất — phép nối ngoài âm thầm trở thành nối trong.<br>
<b>Quy tắc:</b> điều kiện lên bảng <em>tuỳ chọn</em> thì đặt trong ON; điều kiện lên bảng chắc chắn có thì đặt trong WHERE.</div>

<div class="pitfall"><b>Số dòng sau khi nối không như người mới hình dung.</b> Phép nối trong có thể trả về <em>nhiều</em> dòng hơn cả hai bảng (một đơn hàng khớp ba dòng chi tiết thì ra ba dòng) hoặc ít hơn (dòng không khớp biến mất). Trước khi tin một hàm tổng hợp trên phép nối, hãy chạy riêng phép nối và đếm — nối bị nhân dòng là nguyên nhân số một của "SUM của em bị to quá".</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ba thuật toán nối vật lý.</b> Từ khoá <span class="badge">JOIN</span> của bạn nói <em>làm gì</em>, không nói <em>làm thế nào</em>; bộ tối ưu chọn một trong ba: <b>nested loops</b> (với mỗi dòng của bảng nhỏ, tra bảng kia qua chỉ mục — tốt nhất khi một phía rất bé), <b>merge join</b> (hai đầu vào đã sắp, đi song song — tốt nhất khi chỉ mục đã cho sẵn thứ tự), <b>hash join</b> (dựng bảng băm từ phía nhỏ hơn rồi dò bằng phía lớn — tốt nhất cho tập lớn chưa sắp). Đọc xem cái nào xuất hiện trong kế hoạch thực thi (bài 8.2) là biết ngay có phải thiếu chỉ mục hay không. <em>Ngoài giáo trình vì SQL là ngôn ngữ khai báo, nhưng công việc tối ưu hiệu năng lại hoàn toàn xoay quanh toán tử vật lý đã được chọn.</em></div>
</div>
`,
        },
        {
          title: '6.3 — GROUP BY, aggregates & subqueries|||6.3 — GROUP BY, hàm tổng hợp & truy vấn con',
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
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Window functions — aggregate without collapsing rows.</b> &#96;GROUP BY&#96; folds many rows into one; a <b>window function</b> computes an aggregate <em>alongside</em> each row, keeping them all. <span class="badge">AVG(age) OVER (PARTITION BY classId)</span> shows every student next to their class average, and <span class="badge">ROW_NUMBER() OVER (ORDER BY score DESC)</span> ranks them — things a plain GROUP BY cannot do. It replaces many awkward self-joins and correlated subqueries with one clean clause. <em>The syllabus stops at GROUP BY/HAVING; window functions are the tool professionals reach for daily and rarely appear in intro courses.</em></div>
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
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hàm cửa sổ — tổng hợp mà không gộp mất dòng.</b> &#96;GROUP BY&#96; gộp nhiều dòng thành một; một <b>hàm cửa sổ (window function)</b> tính tổng hợp <em>bên cạnh</em> mỗi dòng, giữ lại tất cả. <span class="badge">AVG(age) OVER (PARTITION BY classId)</span> hiện mỗi sinh viên cạnh trung bình lớp của họ, và <span class="badge">ROW_NUMBER() OVER (ORDER BY score DESC)</span> xếp hạng họ — điều GROUP BY thường không làm được. Nó thay nhiều self-join và truy vấn con tương quan vụng về bằng một mệnh đề gọn. <em>Giáo trình dừng ở GROUP BY/HAVING; hàm cửa sổ là công cụ dân chuyên dùng hằng ngày và hiếm xuất hiện ở khóa nhập môn.</em></div>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-408" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Luyện: Tổng hợp & truy vấn con</span><span class="lc-sub">GROUP BY, HAVING và truy vấn lồng.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '6.4 — Nested queries: IN, EXISTS, ANY, ALL & NULL logic|||6.4 — Truy vấn lồng: IN, EXISTS, ANY, ALL & lô-gic NULL',
          slug: 'dbi202-truy-van-long',
          type: 'VIDEO',
          description: 'Truy vấn con tương quan và không tương quan, khuôn "for all" bằng NOT EXISTS, và bẫy NOT IN với NULL.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Queries inside queries — and the NULL that ruins one of them</h2>
<p class="lead">A subquery answers a question the outer query then uses. There are two kinds, and telling them apart explains both the syntax and the performance.</p>

<h3>Non-correlated: the inner query runs once</h3>
<pre><span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> Student
<span class="tok-keyword">WHERE</span> sid <span class="tok-keyword">IN</span> (<span class="tok-keyword">SELECT</span> sid <span class="tok-keyword">FROM</span> Enrolment <span class="tok-keyword">WHERE</span> cid = <span class="tok-string">'DBI202'</span>);</pre>
<p>The inner SELECT does not mention the outer table, so the engine evaluates it once, keeps the result set, and filters with it.</p>

<h3>Correlated: the inner query runs per outer row</h3>
<pre><span class="tok-keyword">SELECT</span> s.name <span class="tok-keyword">FROM</span> Student s
<span class="tok-keyword">WHERE EXISTS</span> (<span class="tok-keyword">SELECT</span> 1 <span class="tok-keyword">FROM</span> Enrolment e
              <span class="tok-keyword">WHERE</span> e.sid = s.sid <span class="tok-keyword">AND</span> e.cid = <span class="tok-string">'DBI202'</span>);   <span class="tok-comment">-- ← s.sid ties them together</span></pre>
<p><span class="badge">EXISTS</span> stops at the first matching row — it asks "is there at least one?", never "how many?". That is why <span class="badge">SELECT 1</span> is idiomatic: the selected value is irrelevant.</p>

<h3>The NOT IN trap you will meet in the PE</h3>
<div class="out"><b>Employee(eid, name, mgr_id) with three rows whose mgr_id values are 1, 2 and NULL.</b><br>
<span class="badge">SELECT name FROM Employee WHERE eid NOT IN (SELECT mgr_id FROM Employee)</span> — "who is not a manager?"<br>
<b>Result: zero rows.</b> Why: <span class="badge">eid NOT IN (1, 2, NULL)</span> expands to <span class="badge">eid &lt;&gt; 1 AND eid &lt;&gt; 2 AND eid &lt;&gt; NULL</span>, and the last comparison is UNKNOWN — so the whole AND is never TRUE, for any row.<br>
<b>Two fixes:</b> add <span class="badge">WHERE mgr_id IS NOT NULL</span> to the subquery, or use <span class="badge">NOT EXISTS</span>, which handles NULL correctly because it tests row existence rather than value equality.<br>
<b>Habit worth forming:</b> prefer <span class="badge">NOT EXISTS</span> to <span class="badge">NOT IN</span> — always correct, and usually just as fast.</div>

<h3>ANY / ALL — comparison against a set</h3>
<div class="out"><span class="badge">salary &gt; ALL (SELECT salary FROM Employee WHERE did = 20)</span> → higher than <em>every</em> IT salary → equivalent to <span class="badge">&gt; (SELECT MAX(...))</span>.<br>
<span class="badge">salary &gt; ANY (…)</span> → higher than <em>at least one</em> → equivalent to <span class="badge">&gt; (SELECT MIN(...))</span>.<br>
<b>Empty-set behaviour, which is the exam question:</b> <span class="badge">&gt; ALL (empty set)</span> is TRUE (vacuously — there is nothing to fail against), while <span class="badge">&gt; ANY (empty set)</span> is FALSE.</div>

<h3>The "for all" pattern — division from lesson 2.3, in SQL</h3>
<pre><span class="tok-comment">-- Students who have enrolled in EVERY course of the IT department</span>
<span class="tok-keyword">SELECT</span> s.name <span class="tok-keyword">FROM</span> Student s
<span class="tok-keyword">WHERE NOT EXISTS</span> (
    <span class="tok-keyword">SELECT</span> 1 <span class="tok-keyword">FROM</span> Course c <span class="tok-keyword">WHERE</span> c.dept = <span class="tok-string">'IT'</span>
      <span class="tok-keyword">AND NOT EXISTS</span> (<span class="tok-keyword">SELECT</span> 1 <span class="tok-keyword">FROM</span> Enrolment e
                       <span class="tok-keyword">WHERE</span> e.sid = s.sid <span class="tok-keyword">AND</span> e.cid = c.cid));</pre>
<div class="out"><b>Read it aloud:</b> "there does not exist an IT course that this student has not taken". The double negation <em>is</em> the universal quantifier — SQL has no FOR ALL.<br>
<b>The counting alternative</b>, usually easier to write and to read:<br>
<span class="badge">GROUP BY s.sid HAVING COUNT(DISTINCT e.cid) = (SELECT COUNT(*) FROM Course WHERE dept='IT')</span><br>
Both are accepted; be able to produce at least one under exam pressure.</div>

<h3>Subqueries in other positions</h3>
<table><thead><tr><th>Position</th><th>Example</th><th>Must return</th></tr></thead><tbody>
<tr><td>WHERE</td><td>WHERE sid IN (…)</td><td>one column</td></tr>
<tr><td>SELECT (scalar)</td><td>(SELECT COUNT(*) FROM Enrolment e WHERE e.sid = s.sid) AS n</td><td><b>exactly one row, one column</b></td></tr>
<tr><td>FROM (derived table)</td><td>FROM (SELECT did, AVG(salary) a FROM Employee GROUP BY did) t</td><td>a table — <b>needs an alias</b></td></tr>
<tr><td>HAVING</td><td>HAVING AVG(salary) &gt; (SELECT AVG(salary) FROM Employee)</td><td>a scalar</td></tr>
</tbody></table>

<div class="pitfall"><b>A scalar subquery that returns two rows raises a run-time error</b> ("Subquery returned more than 1 value"), not a compile-time one — so it can pass your test and fail on the marker's data. If uniqueness is not guaranteed, wrap it in <span class="badge">MAX()</span> or add <span class="badge">TOP 1</span> with an explicit ORDER BY.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>CTEs make nested logic readable — and recursive.</b> <span class="badge">WITH ranked AS (SELECT …) SELECT * FROM ranked WHERE …</span> names a subquery instead of burying it, and several CTEs can chain. The recursive form walks hierarchies — an employee's whole management chain, a category tree, a bill of materials — with an anchor query UNION ALL a step that references the CTE itself. It is the one thing plain subqueries genuinely cannot do. <em>Beyond syllabus because DBI202 covers only inline subqueries, while CTEs are how the same logic is written in every professional codebase.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Truy vấn trong truy vấn — và giá trị NULL phá hỏng một trong số đó</h2>
<p class="lead">Truy vấn con trả lời một câu hỏi mà truy vấn ngoài dùng tới. Có hai loại, và phân biệt được chúng giải thích cả cú pháp lẫn hiệu năng.</p>

<h3>Không tương quan: truy vấn trong chạy một lần</h3>
<pre><span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> Student
<span class="tok-keyword">WHERE</span> sid <span class="tok-keyword">IN</span> (<span class="tok-keyword">SELECT</span> sid <span class="tok-keyword">FROM</span> Enrolment <span class="tok-keyword">WHERE</span> cid = <span class="tok-string">'DBI202'</span>);</pre>
<p>Truy vấn con không nhắc tới bảng ngoài, nên bộ máy tính nó một lần, giữ lại tập kết quả rồi lọc bằng tập đó.</p>

<h3>Tương quan: truy vấn trong chạy cho từng dòng ngoài</h3>
<pre><span class="tok-keyword">SELECT</span> s.name <span class="tok-keyword">FROM</span> Student s
<span class="tok-keyword">WHERE EXISTS</span> (<span class="tok-keyword">SELECT</span> 1 <span class="tok-keyword">FROM</span> Enrolment e
              <span class="tok-keyword">WHERE</span> e.sid = s.sid <span class="tok-keyword">AND</span> e.cid = <span class="tok-string">'DBI202'</span>);   <span class="tok-comment">-- ← s.sid buộc hai bên lại</span></pre>
<p><span class="badge">EXISTS</span> dừng ngay ở dòng khớp đầu tiên — nó hỏi "có ít nhất một không?", không bao giờ hỏi "có bao nhiêu?". Vì thế viết <span class="badge">SELECT 1</span> là thành ngữ chuẩn: giá trị được chọn không quan trọng.</p>

<h3>Cái bẫy NOT IN bạn sẽ gặp trong PE</h3>
<div class="out"><b>Employee(eid, name, mgr_id) với ba dòng có mgr_id lần lượt là 1, 2 và NULL.</b><br>
<span class="badge">SELECT name FROM Employee WHERE eid NOT IN (SELECT mgr_id FROM Employee)</span> — "ai không phải quản lý?"<br>
<b>Kết quả: không dòng nào.</b> Vì sao: <span class="badge">eid NOT IN (1, 2, NULL)</span> khai triển thành <span class="badge">eid &lt;&gt; 1 AND eid &lt;&gt; 2 AND eid &lt;&gt; NULL</span>, mà phép so sánh cuối là KHÔNG XÁC ĐỊNH — nên cả biểu thức AND không bao giờ TRUE, với mọi dòng.<br>
<b>Hai cách chữa:</b> thêm <span class="badge">WHERE mgr_id IS NOT NULL</span> vào truy vấn con, hoặc dùng <span class="badge">NOT EXISTS</span> vốn xử lý NULL đúng vì nó kiểm sự tồn tại của dòng chứ không so sánh giá trị.<br>
<b>Thói quen nên hình thành:</b> ưu tiên <span class="badge">NOT EXISTS</span> hơn <span class="badge">NOT IN</span> — luôn đúng, và thường nhanh ngang nhau.</div>

<h3>ANY / ALL — so sánh với một tập</h3>
<div class="out"><span class="badge">salary &gt; ALL (SELECT salary FROM Employee WHERE did = 20)</span> → cao hơn <em>mọi</em> mức lương ở phòng IT → tương đương <span class="badge">&gt; (SELECT MAX(...))</span>.<br>
<span class="badge">salary &gt; ANY (…)</span> → cao hơn <em>ít nhất một</em> → tương đương <span class="badge">&gt; (SELECT MIN(...))</span>.<br>
<b>Ứng xử với tập rỗng, và đây là câu hỏi thi:</b> <span class="badge">&gt; ALL (tập rỗng)</span> là TRUE (đúng một cách hình thức — chẳng có gì để sai), còn <span class="badge">&gt; ANY (tập rỗng)</span> là FALSE.</div>

<h3>Khuôn "với mọi" — phép chia ở bài 2.3, viết bằng SQL</h3>
<pre><span class="tok-comment">-- Sinh viên đã đăng ký MỌI môn của bộ môn IT</span>
<span class="tok-keyword">SELECT</span> s.name <span class="tok-keyword">FROM</span> Student s
<span class="tok-keyword">WHERE NOT EXISTS</span> (
    <span class="tok-keyword">SELECT</span> 1 <span class="tok-keyword">FROM</span> Course c <span class="tok-keyword">WHERE</span> c.dept = <span class="tok-string">'IT'</span>
      <span class="tok-keyword">AND NOT EXISTS</span> (<span class="tok-keyword">SELECT</span> 1 <span class="tok-keyword">FROM</span> Enrolment e
                       <span class="tok-keyword">WHERE</span> e.sid = s.sid <span class="tok-keyword">AND</span> e.cid = c.cid));</pre>
<div class="out"><b>Đọc thành lời:</b> "không tồn tại môn IT nào mà sinh viên này chưa học". Phép phủ định hai lần <em>chính là</em> lượng từ phổ quát — SQL không có FOR ALL.<br>
<b>Cách thay thế bằng đếm</b>, thường dễ viết và dễ đọc hơn:<br>
<span class="badge">GROUP BY s.sid HAVING COUNT(DISTINCT e.cid) = (SELECT COUNT(*) FROM Course WHERE dept='IT')</span><br>
Cả hai đều được chấp nhận; hãy chắc chắn viết được ít nhất một cách khi đang căng thẳng trong phòng thi.</div>

<h3>Truy vấn con ở các vị trí khác</h3>
<table><thead><tr><th>Vị trí</th><th>Ví dụ</th><th>Phải trả về</th></tr></thead><tbody>
<tr><td>WHERE</td><td>WHERE sid IN (…)</td><td>một cột</td></tr>
<tr><td>SELECT (vô hướng)</td><td>(SELECT COUNT(*) FROM Enrolment e WHERE e.sid = s.sid) AS n</td><td><b>đúng một dòng, một cột</b></td></tr>
<tr><td>FROM (bảng dẫn xuất)</td><td>FROM (SELECT did, AVG(salary) a FROM Employee GROUP BY did) t</td><td>một bảng — <b>bắt buộc có bí danh</b></td></tr>
<tr><td>HAVING</td><td>HAVING AVG(salary) &gt; (SELECT AVG(salary) FROM Employee)</td><td>một giá trị vô hướng</td></tr>
</tbody></table>

<div class="pitfall"><b>Truy vấn con vô hướng trả về hai dòng sẽ báo lỗi lúc CHẠY</b> ("Subquery returned more than 1 value"), chứ không phải lúc biên dịch — nên nó có thể qua được dữ liệu thử của bạn và chết trên dữ liệu của người chấm. Nếu không chắc chắn duy nhất, hãy bọc bằng <span class="badge">MAX()</span> hoặc thêm <span class="badge">TOP 1</span> kèm ORDER BY tường minh.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>CTE làm lô-gic lồng nhau dễ đọc — và cho phép đệ quy.</b> <span class="badge">WITH ranked AS (SELECT …) SELECT * FROM ranked WHERE …</span> đặt tên cho truy vấn con thay vì chôn nó vào giữa, và nhiều CTE nối tiếp được. Dạng đệ quy đi được theo cây phân cấp — toàn bộ chuỗi quản lý của một nhân viên, cây danh mục, bảng định mức vật tư — bằng một truy vấn neo UNION ALL với một bước tham chiếu chính CTE đó. Đây là thứ duy nhất mà truy vấn con thường thật sự không làm được. <em>Ngoài giáo trình vì DBI202 chỉ dạy truy vấn con nội tuyến, trong khi CTE mới là cách viết cùng lô-gic đó trong mọi mã nguồn chuyên nghiệp.</em></div>
</div>
`,
        },
        {
          title: '6.5 — INSERT, UPDATE, DELETE done safely|||6.5 — INSERT, UPDATE, DELETE làm cho an toàn',
          slug: 'dbi202-cap-nhat-du-lieu',
          type: 'VIDEO',
          description: 'Sửa dữ liệu đúng cách: INSERT nhiều dòng, UPDATE có JOIN, DELETE vs TRUNCATE, và thói quen chạy thử.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>The statements that change data — and cannot be un-run</h2>
<p class="lead">SELECT is forgiving; UPDATE and DELETE are not. This lesson covers the syntax and, just as importantly, the habits that stop a one-character mistake from clearing a table.</p>

<h3>INSERT — four forms</h3>
<pre><span class="tok-comment">-- 1. one row, named columns (always name them)</span>
<span class="tok-keyword">INSERT INTO</span> Student (sid, name, city) <span class="tok-keyword">VALUES</span> (1, N<span class="tok-string">'An'</span>, N<span class="tok-string">'Hà Nội'</span>);

<span class="tok-comment">-- 2. several rows in one statement — one transaction, far faster</span>
<span class="tok-keyword">INSERT INTO</span> Student (sid, name, city) <span class="tok-keyword">VALUES</span>
    (2, N<span class="tok-string">'Bình'</span>, N<span class="tok-string">'Huế'</span>), (3, N<span class="tok-string">'Chi'</span>, N<span class="tok-string">'Đà Nẵng'</span>);

<span class="tok-comment">-- 3. from a query — copy or archive</span>
<span class="tok-keyword">INSERT INTO</span> StudentArchive (sid, name)
<span class="tok-keyword">SELECT</span> sid, name <span class="tok-keyword">FROM</span> Student <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'GRADUATED'</span>;

<span class="tok-comment">-- 4. capture what was inserted (SQL Server specific)</span>
<span class="tok-keyword">INSERT INTO</span> Student (name) <span class="tok-keyword">OUTPUT</span> inserted.sid <span class="tok-keyword">VALUES</span> (N<span class="tok-string">'Dũng'</span>);</pre>
<p>Naming the columns is not style: without the list, adding a column to the table later breaks every unnamed INSERT in your codebase.</p>

<h3>UPDATE with data from another table</h3>
<pre><span class="tok-comment">-- SQL Server syntax: UPDATE the alias, then join</span>
<span class="tok-keyword">UPDATE</span> e
<span class="tok-keyword">SET</span> e.salary = e.salary * 1.1
<span class="tok-keyword">FROM</span> Employee e <span class="tok-keyword">JOIN</span> Department d <span class="tok-keyword">ON</span> e.did = d.did
<span class="tok-keyword">WHERE</span> d.dname = <span class="tok-string">'IT'</span>;</pre>
<div class="out"><b>The safety ritual — do this every time:</b><br>
<b>1.</b> Write it as a SELECT first: <span class="badge">SELECT e.* FROM Employee e JOIN … WHERE …</span> and look at the rows.<br>
<b>2.</b> Count them. Does the number match what you intended?<br>
<b>3.</b> Wrap in a transaction: <span class="badge">BEGIN TRAN; UPDATE …; SELECT …; -- verify, then COMMIT or ROLLBACK</span><br>
<b>4.</b> Only then commit.<br>
This is the single habit that separates people who have dropped production data from people who have not.</div>

<h3>DELETE, TRUNCATE and DROP — three different things</h3>
<table><thead><tr><th></th><th>DELETE</th><th>TRUNCATE</th><th>DROP</th></tr></thead><tbody>
<tr><td>Removes</td><td>chosen rows</td><td>all rows</td><td>the table itself</td></tr>
<tr><td>WHERE clause</td><td><b>yes</b></td><td>no</td><td>—</td></tr>
<tr><td>Speed on a big table</td><td>slow (row by row, logged)</td><td><b>instant</b> (deallocates pages)</td><td>instant</td></tr>
<tr><td>Fires triggers</td><td><b>yes</b></td><td>no</td><td>no</td></tr>
<tr><td>Resets IDENTITY</td><td>no</td><td><b>yes</b></td><td>—</td></tr>
<tr><td>Rollback-able</td><td>yes</td><td>yes (inside a transaction)</td><td>yes</td></tr>
<tr><td>Blocked by a foreign key</td><td>yes</td><td><b>yes — always</b></td><td>yes</td></tr>
</tbody></table>

<h3>Worked example — the mistake everyone makes once</h3>
<div class="out"><b>Intent:</b> delete the enrolments of student 5.<br>
<span class="badge">DELETE FROM Enrolment WHERE sid = 5;</span> → 3 rows deleted ✓<br>
<b>What happens if the WHERE is selected away and you run only</b> <span class="badge">DELETE FROM Enrolment</span> → <b>every row in the table is gone.</b> No confirmation, no undo, unless you were inside a transaction.<br>
<b>Two protections:</b> always type the WHERE clause <em>before</em> the DELETE line, and keep the whole statement inside <span class="badge">BEGIN TRAN</span> until you have seen the affected row count.</div>

<div class="pitfall"><b>SQL Server has no <span class="badge">LIMIT</span>.</b> Use <span class="badge">TOP (n)</span>, or <span class="badge">ORDER BY … OFFSET n ROWS FETCH NEXT m ROWS ONLY</span> for paging. Writing MySQL's <span class="badge">LIMIT 10</span> in the PE is an instant syntax error — and a surprisingly common one.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Soft delete: in real systems, rows are rarely removed.</b> Production schemas add <span class="badge">deleted_at DATETIME2 NULL</span> and an UPDATE replaces the DELETE, with every query filtering <span class="badge">WHERE deleted_at IS NULL</span> (usually through a view). You keep the audit trail, references never break, and "undo" becomes possible — at the price of a filter everywhere and a periodic purge job. Regulated domains (finance, health) mandate this pattern. <em>Beyond syllabus because the course teaches DELETE as final, while the professional default is that data is never physically destroyed.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Những câu lệnh làm thay đổi dữ liệu — và không thể chạy ngược lại</h2>
<p class="lead">SELECT thì bao dung; UPDATE và DELETE thì không. Bài này nói về cú pháp và, quan trọng không kém, những thói quen ngăn một lỗi sai một ký tự xoá sạch cả bảng.</p>

<h3>INSERT — bốn dạng</h3>
<pre><span class="tok-comment">-- 1. một dòng, có nêu tên cột (luôn luôn nêu tên)</span>
<span class="tok-keyword">INSERT INTO</span> Student (sid, name, city) <span class="tok-keyword">VALUES</span> (1, N<span class="tok-string">'An'</span>, N<span class="tok-string">'Hà Nội'</span>);

<span class="tok-comment">-- 2. nhiều dòng trong một lệnh — một giao dịch, nhanh hơn hẳn</span>
<span class="tok-keyword">INSERT INTO</span> Student (sid, name, city) <span class="tok-keyword">VALUES</span>
    (2, N<span class="tok-string">'Bình'</span>, N<span class="tok-string">'Huế'</span>), (3, N<span class="tok-string">'Chi'</span>, N<span class="tok-string">'Đà Nẵng'</span>);

<span class="tok-comment">-- 3. lấy từ một truy vấn — sao chép hoặc lưu trữ</span>
<span class="tok-keyword">INSERT INTO</span> StudentArchive (sid, name)
<span class="tok-keyword">SELECT</span> sid, name <span class="tok-keyword">FROM</span> Student <span class="tok-keyword">WHERE</span> status = <span class="tok-string">'GRADUATED'</span>;

<span class="tok-comment">-- 4. lấy lại thứ vừa chèn (riêng của SQL Server)</span>
<span class="tok-keyword">INSERT INTO</span> Student (name) <span class="tok-keyword">OUTPUT</span> inserted.sid <span class="tok-keyword">VALUES</span> (N<span class="tok-string">'Dũng'</span>);</pre>
<p>Nêu tên cột không phải chuyện phong cách: thiếu danh sách cột thì sau này chỉ cần thêm một cột vào bảng là mọi lệnh INSERT không nêu tên trong mã nguồn của bạn đều hỏng.</p>

<h3>UPDATE lấy dữ liệu từ bảng khác</h3>
<pre><span class="tok-comment">-- cú pháp SQL Server: UPDATE theo bí danh, rồi mới nối bảng</span>
<span class="tok-keyword">UPDATE</span> e
<span class="tok-keyword">SET</span> e.salary = e.salary * 1.1
<span class="tok-keyword">FROM</span> Employee e <span class="tok-keyword">JOIN</span> Department d <span class="tok-keyword">ON</span> e.did = d.did
<span class="tok-keyword">WHERE</span> d.dname = <span class="tok-string">'IT'</span>;</pre>
<div class="out"><b>Nghi thức an toàn — làm mỗi lần:</b><br>
<b>1.</b> Viết nó thành SELECT trước: <span class="badge">SELECT e.* FROM Employee e JOIN … WHERE …</span> và nhìn các dòng.<br>
<b>2.</b> Đếm chúng. Con số có khớp với ý định của bạn không?<br>
<b>3.</b> Bọc trong một giao dịch: <span class="badge">BEGIN TRAN; UPDATE …; SELECT …; -- kiểm rồi COMMIT hoặc ROLLBACK</span><br>
<b>4.</b> Chỉ khi đó mới commit.<br>
Đây đúng là thói quen phân biệt người đã từng xoá nhầm dữ liệu thật với người chưa bao giờ.</div>

<h3>DELETE, TRUNCATE và DROP — ba thứ khác nhau</h3>
<table><thead><tr><th></th><th>DELETE</th><th>TRUNCATE</th><th>DROP</th></tr></thead><tbody>
<tr><td>Xoá gì</td><td>các dòng được chọn</td><td>mọi dòng</td><td>chính cái bảng</td></tr>
<tr><td>Có mệnh đề WHERE</td><td><b>có</b></td><td>không</td><td>—</td></tr>
<tr><td>Tốc độ trên bảng lớn</td><td>chậm (từng dòng, ghi nhật ký)</td><td><b>tức thì</b> (giải phóng cả trang)</td><td>tức thì</td></tr>
<tr><td>Kích hoạt trigger</td><td><b>có</b></td><td>không</td><td>không</td></tr>
<tr><td>Đặt lại IDENTITY</td><td>không</td><td><b>có</b></td><td>—</td></tr>
<tr><td>Quay lui được</td><td>được</td><td>được (trong giao dịch)</td><td>được</td></tr>
<tr><td>Bị khoá ngoại chặn</td><td>có</td><td><b>có — luôn luôn</b></td><td>có</td></tr>
</tbody></table>

<h3>Ví dụ có lời giải — lỗi ai cũng mắc đúng một lần</h3>
<div class="out"><b>Ý định:</b> xoá các đăng ký của sinh viên 5.<br>
<span class="badge">DELETE FROM Enrolment WHERE sid = 5;</span> → xoá 3 dòng ✓<br>
<b>Chuyện gì xảy ra nếu bạn bôi đen thiếu mệnh đề WHERE và chỉ chạy</b> <span class="badge">DELETE FROM Enrolment</span> → <b>mọi dòng trong bảng biến mất.</b> Không hỏi lại, không hoàn tác, trừ khi bạn đang ở trong một giao dịch.<br>
<b>Hai lớp bảo vệ:</b> luôn gõ mệnh đề WHERE <em>trước</em> khi gõ dòng DELETE, và giữ cả câu lệnh trong <span class="badge">BEGIN TRAN</span> cho tới khi đã nhìn thấy số dòng bị ảnh hưởng.</div>

<div class="pitfall"><b>SQL Server không có <span class="badge">LIMIT</span>.</b> Hãy dùng <span class="badge">TOP (n)</span>, hoặc <span class="badge">ORDER BY … OFFSET n ROWS FETCH NEXT m ROWS ONLY</span> để phân trang. Viết <span class="badge">LIMIT 10</span> kiểu MySQL trong PE là lỗi cú pháp ngay lập tức — và là lỗi phổ biến đến bất ngờ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Xoá mềm: trong hệ thống thật, dòng dữ liệu hiếm khi bị xoá.</b> Lược đồ sản xuất thêm cột <span class="badge">deleted_at DATETIME2 NULL</span> và dùng UPDATE thay cho DELETE, mọi truy vấn đều lọc <span class="badge">WHERE deleted_at IS NULL</span> (thường qua một view). Bạn giữ được dấu vết kiểm toán, các tham chiếu không bao giờ gãy, và "hoàn tác" trở nên khả thi — đổi lại phải thêm bộ lọc ở khắp nơi và một tác vụ dọn dẹp định kỳ. Các lĩnh vực bị quản lý chặt (tài chính, y tế) bắt buộc dùng khuôn này. <em>Ngoài giáo trình vì môn học dạy DELETE là dứt điểm, còn mặc định chuyên nghiệp là dữ liệu không bao giờ bị huỷ vật lý.</em></div>
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
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The &#96;inserted&#96; / &#96;deleted&#96; magic tables.</b> Inside a trigger, SQL Server exposes two virtual tables: <span class="badge">inserted</span> (the new rows) and <span class="badge">deleted</span> (the old rows) — an UPDATE shows up in both. A trigger must be written <em>set-based</em> over these, not row-by-row, or it breaks on a multi-row statement. <b>INSTEAD OF</b> triggers go further: they replace the operation entirely, which is how you make an otherwise read-only <em>view</em> updatable. <em>The syllabus lists trigger as a concept; these pseudo-tables and INSTEAD OF are what make triggers actually work in practice.</em></div>
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
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hai bảng ảo &#96;inserted&#96; / &#96;deleted&#96;.</b> Bên trong một trigger, SQL Server cấp hai bảng ảo: <span class="badge">inserted</span> (các hàng mới) và <span class="badge">deleted</span> (các hàng cũ) — một UPDATE hiện ở cả hai. Trigger phải viết <em>theo tập</em> trên chúng, không phải từng hàng, nếu không sẽ hỏng với câu lệnh nhiều hàng. Trigger <b>INSTEAD OF</b> đi xa hơn: nó thay thế hẳn thao tác, đó là cách làm cho một <em>view</em> vốn chỉ đọc trở nên cập nhật được. <em>Giáo trình liệt kê trigger như một khái niệm; hai bảng ảo này và INSTEAD OF mới là thứ khiến trigger thật sự chạy được.</em></div>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-721" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Luyện: Stored procedures & đối tượng lập trình</span><span class="lc-sub">Procedure, function và trigger.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '7.2 — Views: virtual tables that hide complexity|||7.2 — View: bảng ảo che đi sự phức tạp',
          slug: 'dbi202-view',
          type: 'VIDEO',
          description: 'Tạo view, khi nào view cập nhật được, WITH CHECK OPTION, và view có chỉ mục (materialized).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>A view is a stored query that behaves like a table</h2>
<p class="lead">A view stores no data — it stores a SELECT. Every reference to it re-runs that SELECT. That gives you three things: a simpler name for a complicated join, a security boundary, and a stable interface while the tables underneath change.</p>

<pre><span class="tok-keyword">CREATE VIEW</span> v_StudentGrades <span class="tok-keyword">AS</span>
<span class="tok-keyword">SELECT</span> s.sid, s.name, c.cid, c.title, e.grade
<span class="tok-keyword">FROM</span> Student s
<span class="tok-keyword">JOIN</span> Enrolment e <span class="tok-keyword">ON</span> s.sid = e.sid
<span class="tok-keyword">JOIN</span> Course c <span class="tok-keyword">ON</span> c.cid = e.cid
<span class="tok-keyword">WHERE</span> e.status = <span class="tok-string">'ACTIVE'</span>;

<span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> v_StudentGrades <span class="tok-keyword">WHERE</span> grade &lt; 4;   <span class="tok-comment">-- use it like a table</span></pre>

<h3>The three reasons views exist</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. Simplification.</b> A three-table join written once, used by ten reports. Fix the join in one place.</div>
  <div class="lz-layer"><b>2. Security.</b> Grant SELECT on the view and revoke it on the table: users see <span class="badge">name, dept</span> but never <span class="badge">salary</span>. Row-level filtering works the same way — a view with <span class="badge">WHERE dept = USER_DEPT()</span>.</div>
  <div class="lz-layer"><b>3. Stability.</b> Splitting a table during refactoring breaks every query — unless the applications read a view, which you rewrite to hide the split.</div>
</div>

<h3>When can you UPDATE through a view?</h3>
<div class="out"><b>The view must be able to identify exactly one base row.</b> That means: it reads a single table, has no <span class="badge">DISTINCT</span>, no <span class="badge">GROUP BY</span> or aggregate, no <span class="badge">UNION</span>, and includes all NOT NULL columns without defaults if you want to insert.<br>
<b>So:</b> <span class="badge">CREATE VIEW v_ITStaff AS SELECT eid, name, salary FROM Employee WHERE did = 20</span> is updatable ✓<br>
<b>But</b> <span class="badge">v_StudentGrades</span> above joins three tables — SQL Server cannot know which one your UPDATE means, so it refuses (unless you write an INSTEAD OF trigger, lesson 7.4).</div>

<h3>WITH CHECK OPTION — closing the escape hatch</h3>
<div class="out"><b>Without it:</b> through <span class="badge">v_ITStaff</span> (which shows only did = 20) you run <span class="badge">UPDATE v_ITStaff SET did = 30 WHERE eid = 7</span>. The update succeeds — and the row immediately vanishes from the view. You have moved an employee out of a department you were not supposed to see.<br>
<b>With</b> <span class="badge">CREATE VIEW … WITH CHECK OPTION</span>, any INSERT or UPDATE whose result would fall outside the view's WHERE clause is rejected. Add it to every view used as a security boundary.</div>

<h3>Indexed (materialized) views</h3>
<table><thead><tr><th></th><th>Normal view</th><th>Indexed view</th></tr></thead><tbody>
<tr><td>Stores data</td><td>no</td><td><b>yes, on disk</b></td></tr>
<tr><td>Read cost</td><td>re-runs the query</td><td><b>a table read</b></td></tr>
<tr><td>Write cost</td><td>none</td><td>every base-table write updates it</td></tr>
<tr><td>Use for</td><td>almost everything</td><td>expensive aggregates read far more often than written</td></tr>
</tbody></table>
<p>In SQL Server: <span class="badge">CREATE VIEW … WITH SCHEMABINDING</span>, then create a unique clustered index on it. Other engines call the same idea a materialized view.</p>

<div class="pitfall"><b>Views do not make queries faster.</b> <span class="badge">SELECT * FROM v_Big WHERE sid = 5</span> runs the view's whole query and then filters — unless the optimiser can push the predicate down, which it usually can, but not through <span class="badge">DISTINCT</span>, <span class="badge">TOP</span> or window functions. Nesting views three deep is a reliable way to produce a query nobody can optimise.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Views are the seam that makes zero-downtime migrations possible.</b> To split <span class="badge">Customer</span> into <span class="badge">Customer</span> + <span class="badge">Address</span> without stopping the application: create the new tables, backfill, create a view named after the old table that joins them, point the old code at the view, migrate the code gradually, then drop the view. The database changed shape while every deployed version kept working. <em>Beyond syllabus because DBI202 presents views as convenience, while their strategic use is decoupling the schema's evolution from the application's release cycle.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>View là một truy vấn được lưu lại nhưng dùng như một cái bảng</h2>
<p class="lead">View không lưu dữ liệu — nó lưu một câu SELECT. Mỗi lần tham chiếu tới nó là chạy lại câu SELECT đó. Điều này cho bạn ba thứ: một cái tên gọn cho phép nối phức tạp, một ranh giới bảo mật, và một giao diện ổn định trong khi các bảng bên dưới thay đổi.</p>

<pre><span class="tok-keyword">CREATE VIEW</span> v_StudentGrades <span class="tok-keyword">AS</span>
<span class="tok-keyword">SELECT</span> s.sid, s.name, c.cid, c.title, e.grade
<span class="tok-keyword">FROM</span> Student s
<span class="tok-keyword">JOIN</span> Enrolment e <span class="tok-keyword">ON</span> s.sid = e.sid
<span class="tok-keyword">JOIN</span> Course c <span class="tok-keyword">ON</span> c.cid = e.cid
<span class="tok-keyword">WHERE</span> e.status = <span class="tok-string">'ACTIVE'</span>;

<span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> v_StudentGrades <span class="tok-keyword">WHERE</span> grade &lt; 4;   <span class="tok-comment">-- dùng như một cái bảng</span></pre>

<h3>Ba lý do view tồn tại</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. Đơn giản hoá.</b> Phép nối ba bảng viết một lần, dùng cho mười báo cáo. Sửa phép nối ở đúng một chỗ.</div>
  <div class="lz-layer"><b>2. Bảo mật.</b> Cấp quyền SELECT trên view và thu quyền trên bảng: người dùng thấy <span class="badge">name, dept</span> nhưng không bao giờ thấy <span class="badge">salary</span>. Lọc theo dòng cũng làm y hệt — một view có <span class="badge">WHERE dept = USER_DEPT()</span>.</div>
  <div class="lz-layer"><b>3. Ổn định.</b> Tách một bảng khi tái cấu trúc sẽ làm hỏng mọi truy vấn — trừ khi ứng dụng đọc qua view, và bạn viết lại view để giấu đi phép tách đó.</div>
</div>

<h3>Khi nào UPDATE được qua view?</h3>
<div class="out"><b>View phải xác định được đúng một dòng ở bảng gốc.</b> Nghĩa là: nó đọc từ một bảng duy nhất, không có <span class="badge">DISTINCT</span>, không <span class="badge">GROUP BY</span> hay hàm tổng hợp, không <span class="badge">UNION</span>, và phải chứa mọi cột NOT NULL không có giá trị mặc định nếu bạn muốn chèn.<br>
<b>Vậy nên:</b> <span class="badge">CREATE VIEW v_ITStaff AS SELECT eid, name, salary FROM Employee WHERE did = 20</span> là cập nhật được ✓<br>
<b>Nhưng</b> <span class="badge">v_StudentGrades</span> ở trên nối ba bảng — SQL Server không thể biết lệnh UPDATE của bạn nhắm vào bảng nào, nên nó từ chối (trừ khi bạn viết một trigger INSTEAD OF, bài 7.4).</div>

<h3>WITH CHECK OPTION — bịt lối thoát</h3>
<div class="out"><b>Không có nó:</b> qua <span class="badge">v_ITStaff</span> (vốn chỉ hiện did = 20) bạn chạy <span class="badge">UPDATE v_ITStaff SET did = 30 WHERE eid = 7</span>. Lệnh thành công — và dòng đó lập tức biến khỏi view. Bạn vừa chuyển một nhân viên sang phòng ban mà đáng lẽ bạn không được nhìn thấy.<br>
<b>Với</b> <span class="badge">CREATE VIEW … WITH CHECK OPTION</span>, mọi lệnh INSERT hay UPDATE mà kết quả rơi ra ngoài mệnh đề WHERE của view đều bị từ chối. Hãy thêm nó vào mọi view dùng làm ranh giới bảo mật.</div>

<h3>View có chỉ mục (materialized)</h3>
<table><thead><tr><th></th><th>View thường</th><th>View có chỉ mục</th></tr></thead><tbody>
<tr><td>Có lưu dữ liệu</td><td>không</td><td><b>có, trên đĩa</b></td></tr>
<tr><td>Chi phí đọc</td><td>chạy lại truy vấn</td><td><b>chỉ như đọc một bảng</b></td></tr>
<tr><td>Chi phí ghi</td><td>không có</td><td>mỗi lần ghi bảng gốc đều cập nhật nó</td></tr>
<tr><td>Dùng cho</td><td>hầu hết mọi trường hợp</td><td>các phép tổng hợp đắt, đọc nhiều hơn ghi rất nhiều</td></tr>
</tbody></table>
<p>Trong SQL Server: <span class="badge">CREATE VIEW … WITH SCHEMABINDING</span>, rồi tạo một chỉ mục gom cụm duy nhất trên nó. Các hệ khác gọi cùng ý tưởng đó là materialized view.</p>

<div class="pitfall"><b>View không làm truy vấn nhanh hơn.</b> <span class="badge">SELECT * FROM v_Big WHERE sid = 5</span> chạy toàn bộ truy vấn của view rồi mới lọc — trừ khi bộ tối ưu đẩy được điều kiện xuống dưới, việc nó thường làm được, nhưng không xuyên qua <span class="badge">DISTINCT</span>, <span class="badge">TOP</span> hay hàm cửa sổ. Lồng view ba tầng là cách chắc chắn tạo ra một truy vấn không ai tối ưu nổi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>View là đường nối giúp di trú không cần dừng hệ thống.</b> Muốn tách <span class="badge">Customer</span> thành <span class="badge">Customer</span> + <span class="badge">Address</span> mà không dừng ứng dụng: tạo bảng mới, lấp dữ liệu, tạo một view mang đúng tên bảng cũ để nối hai bảng lại, trỏ mã nguồn cũ vào view, chuyển dần mã nguồn, rồi mới bỏ view. Cơ sở dữ liệu đã đổi hình dạng trong khi mọi phiên bản đang chạy vẫn hoạt động. <em>Ngoài giáo trình vì DBI202 trình bày view như một tiện ích, còn công dụng chiến lược của nó là tách rời tiến hoá của lược đồ khỏi chu kỳ phát hành của ứng dụng.</em></div>
</div>
`,
        },
        {
          title: '7.3 — Stored procedures & functions|||7.3 — Thủ tục & hàm lưu trữ',
          slug: 'dbi202-proc-function',
          type: 'VIDEO',
          description: 'Tham số IN/OUT, TRY…CATCH, khác biệt procedure vs function, và vì sao chúng chống được SQL injection.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Code that lives in the database</h2>
<p class="lead">A stored procedure is a named, compiled block of T-SQL. It runs where the data is, so a loop of ten statements costs one network round trip instead of ten — and it can be granted to a user who has no rights on the underlying tables at all.</p>

<h3>A complete procedure with parameters and error handling</h3>
<pre><span class="tok-keyword">CREATE PROCEDURE</span> sp_EnrolStudent
    @sid <span class="tok-type">INT</span>,
    @cid <span class="tok-type">CHAR</span>(6),
    @result <span class="tok-type">NVARCHAR</span>(100) <span class="tok-keyword">OUTPUT</span>
<span class="tok-keyword">AS</span>
<span class="tok-keyword">BEGIN</span>
    <span class="tok-keyword">SET NOCOUNT ON</span>;                     <span class="tok-comment">-- do not send "n rows affected" messages</span>
    <span class="tok-keyword">BEGIN TRY</span>
        <span class="tok-keyword">IF NOT EXISTS</span> (<span class="tok-keyword">SELECT</span> 1 <span class="tok-keyword">FROM</span> Student <span class="tok-keyword">WHERE</span> sid = @sid)
        <span class="tok-keyword">BEGIN</span>
            <span class="tok-keyword">SET</span> @result = N<span class="tok-string">'Student not found'</span>;
            <span class="tok-keyword">RETURN</span> 1;                        <span class="tok-comment">-- return code: 0 = OK, non-zero = error</span>
        <span class="tok-keyword">END</span>

        <span class="tok-keyword">BEGIN TRANSACTION</span>;
            <span class="tok-keyword">INSERT INTO</span> Enrolment (sid, cid) <span class="tok-keyword">VALUES</span> (@sid, @cid);
            <span class="tok-keyword">UPDATE</span> Course <span class="tok-keyword">SET</span> seats = seats - 1 <span class="tok-keyword">WHERE</span> cid = @cid;
        <span class="tok-keyword">COMMIT TRANSACTION</span>;

        <span class="tok-keyword">SET</span> @result = N<span class="tok-string">'OK'</span>;
        <span class="tok-keyword">RETURN</span> 0;
    <span class="tok-keyword">END TRY</span>
    <span class="tok-keyword">BEGIN CATCH</span>
        <span class="tok-keyword">IF</span> @@TRANCOUNT &gt; 0 <span class="tok-keyword">ROLLBACK TRANSACTION</span>;
        <span class="tok-keyword">SET</span> @result = <span class="tok-keyword">ERROR_MESSAGE</span>();
        <span class="tok-keyword">RETURN</span> -1;
    <span class="tok-keyword">END CATCH</span>
<span class="tok-keyword">END</span>;</pre>
<pre><span class="tok-comment">-- calling it</span>
<span class="tok-keyword">DECLARE</span> @msg <span class="tok-type">NVARCHAR</span>(100), @rc <span class="tok-type">INT</span>;
<span class="tok-keyword">EXEC</span> @rc = sp_EnrolStudent @sid = 1, @cid = <span class="tok-string">'DBI202'</span>, @result = @msg <span class="tok-keyword">OUTPUT</span>;
<span class="tok-keyword">SELECT</span> @rc <span class="tok-keyword">AS</span> code, @msg <span class="tok-keyword">AS</span> message;</pre>
<div class="out"><b>Why both statements are inside one transaction:</b> if the seat count update fails after the insert succeeded, the enrolment would exist without a seat being deducted. The transaction makes them one atomic unit — either both happen or neither does (lesson 8.3).</div>

<h3>Procedure or function? The decision table</h3>
<table><thead><tr><th></th><th>Stored procedure</th><th>Function</th></tr></thead><tbody>
<tr><td>Called with</td><td><span class="badge">EXEC</span></td><td>inside a SELECT / WHERE</td></tr>
<tr><td>Returns</td><td>result sets, OUTPUT params, a return code</td><td><b>exactly one value or one table</b></td></tr>
<tr><td>Can modify data</td><td><b>yes</b></td><td><b>no</b> (side-effect free)</td></tr>
<tr><td>Transactions</td><td>yes</td><td>no</td><td></td></tr>
<tr><td>TRY…CATCH</td><td>yes</td><td>no</td></tr>
</tbody></table>
<pre><span class="tok-comment">-- scalar function: usable anywhere a value is</span>
<span class="tok-keyword">CREATE FUNCTION</span> fn_GPA(@sid <span class="tok-type">INT</span>) <span class="tok-keyword">RETURNS</span> <span class="tok-type">DECIMAL</span>(4,2) <span class="tok-keyword">AS</span>
<span class="tok-keyword">BEGIN</span>
    <span class="tok-keyword">RETURN</span> (<span class="tok-keyword">SELECT AVG</span>(grade) <span class="tok-keyword">FROM</span> Enrolment <span class="tok-keyword">WHERE</span> sid = @sid);
<span class="tok-keyword">END</span>;

<span class="tok-comment">-- inline table-valued function: a parameterised view</span>
<span class="tok-keyword">CREATE FUNCTION</span> fn_StudentsOf(@cid <span class="tok-type">CHAR</span>(6)) <span class="tok-keyword">RETURNS TABLE AS</span>
<span class="tok-keyword">RETURN</span> (<span class="tok-keyword">SELECT</span> s.* <span class="tok-keyword">FROM</span> Student s <span class="tok-keyword">JOIN</span> Enrolment e <span class="tok-keyword">ON</span> s.sid = e.sid <span class="tok-keyword">WHERE</span> e.cid = @cid);

<span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> fn_StudentsOf(<span class="tok-string">'DBI202'</span>);</pre>

<div class="pitfall"><b>A scalar function inside a WHERE clause runs once per row and blocks index use.</b> <span class="badge">WHERE fn_GPA(sid) &gt; 8</span> on a 100,000-row table executes the function 100,000 times and forces a full scan. Rewrite it as a join to an <em>inline table-valued</em> function, which the optimiser can expand into the outer query. This is the single most common cause of a "mysteriously slow" query in student projects.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Stored procedures were the original defence against SQL injection.</b> Parameters are typed values, never concatenated text, so <span class="badge">@name = "'; DROP TABLE Student;--"</span> is stored as a harmless string. But the protection comes from <em>parameterisation</em>, not from the procedure: build dynamic SQL with <span class="badge">EXEC('SELECT … ' + @name)</span> inside a procedure and the hole is right back. Modern applications get the same guarantee with prepared statements (<span class="badge">PreparedStatement</span> in PRJ301), which is why business logic mostly moved back into the application. <em>Beyond syllabus because the course teaches the syntax, while the security reasoning is what an interviewer asks about.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Mã lệnh sống ngay trong cơ sở dữ liệu</h2>
<p class="lead">Thủ tục lưu trữ là một khối T-SQL có tên và đã biên dịch. Nó chạy ngay tại chỗ dữ liệu nằm, nên một vòng mười câu lệnh chỉ tốn một lần đi lại qua mạng thay vì mười — và nó có thể được cấp cho một người dùng hoàn toàn không có quyền gì trên các bảng bên dưới.</p>

<h3>Một thủ tục đầy đủ có tham số và xử lý lỗi</h3>
<pre><span class="tok-keyword">CREATE PROCEDURE</span> sp_EnrolStudent
    @sid <span class="tok-type">INT</span>,
    @cid <span class="tok-type">CHAR</span>(6),
    @result <span class="tok-type">NVARCHAR</span>(100) <span class="tok-keyword">OUTPUT</span>
<span class="tok-keyword">AS</span>
<span class="tok-keyword">BEGIN</span>
    <span class="tok-keyword">SET NOCOUNT ON</span>;                     <span class="tok-comment">-- không gửi thông báo "n rows affected"</span>
    <span class="tok-keyword">BEGIN TRY</span>
        <span class="tok-keyword">IF NOT EXISTS</span> (<span class="tok-keyword">SELECT</span> 1 <span class="tok-keyword">FROM</span> Student <span class="tok-keyword">WHERE</span> sid = @sid)
        <span class="tok-keyword">BEGIN</span>
            <span class="tok-keyword">SET</span> @result = N<span class="tok-string">'Không tìm thấy sinh viên'</span>;
            <span class="tok-keyword">RETURN</span> 1;                        <span class="tok-comment">-- mã trả về: 0 = OK, khác 0 = lỗi</span>
        <span class="tok-keyword">END</span>

        <span class="tok-keyword">BEGIN TRANSACTION</span>;
            <span class="tok-keyword">INSERT INTO</span> Enrolment (sid, cid) <span class="tok-keyword">VALUES</span> (@sid, @cid);
            <span class="tok-keyword">UPDATE</span> Course <span class="tok-keyword">SET</span> seats = seats - 1 <span class="tok-keyword">WHERE</span> cid = @cid;
        <span class="tok-keyword">COMMIT TRANSACTION</span>;

        <span class="tok-keyword">SET</span> @result = N<span class="tok-string">'OK'</span>;
        <span class="tok-keyword">RETURN</span> 0;
    <span class="tok-keyword">END TRY</span>
    <span class="tok-keyword">BEGIN CATCH</span>
        <span class="tok-keyword">IF</span> @@TRANCOUNT &gt; 0 <span class="tok-keyword">ROLLBACK TRANSACTION</span>;
        <span class="tok-keyword">SET</span> @result = <span class="tok-keyword">ERROR_MESSAGE</span>();
        <span class="tok-keyword">RETURN</span> -1;
    <span class="tok-keyword">END CATCH</span>
<span class="tok-keyword">END</span>;</pre>
<pre><span class="tok-comment">-- cách gọi</span>
<span class="tok-keyword">DECLARE</span> @msg <span class="tok-type">NVARCHAR</span>(100), @rc <span class="tok-type">INT</span>;
<span class="tok-keyword">EXEC</span> @rc = sp_EnrolStudent @sid = 1, @cid = <span class="tok-string">'DBI202'</span>, @result = @msg <span class="tok-keyword">OUTPUT</span>;
<span class="tok-keyword">SELECT</span> @rc <span class="tok-keyword">AS</span> code, @msg <span class="tok-keyword">AS</span> message;</pre>
<div class="out"><b>Vì sao hai câu lệnh nằm trong cùng một giao dịch:</b> nếu lệnh trừ chỗ ngồi thất bại sau khi lệnh chèn đã thành công thì sẽ có một đăng ký mà không trừ chỗ nào. Giao dịch biến chúng thành một khối nguyên tử — hoặc cả hai xảy ra, hoặc không cái nào (bài 8.3).</div>

<h3>Thủ tục hay hàm? Bảng quyết định</h3>
<table><thead><tr><th></th><th>Thủ tục lưu trữ</th><th>Hàm</th></tr></thead><tbody>
<tr><td>Gọi bằng</td><td><span class="badge">EXEC</span></td><td>ngay trong SELECT / WHERE</td></tr>
<tr><td>Trả về</td><td>tập kết quả, tham số OUTPUT, mã trả về</td><td><b>đúng một giá trị hoặc một bảng</b></td></tr>
<tr><td>Sửa được dữ liệu</td><td><b>được</b></td><td><b>không</b> (không có tác dụng phụ)</td></tr>
<tr><td>Giao dịch</td><td>được</td><td>không</td></tr>
<tr><td>TRY…CATCH</td><td>được</td><td>không</td></tr>
</tbody></table>
<pre><span class="tok-comment">-- hàm vô hướng: dùng được ở bất cứ đâu cần một giá trị</span>
<span class="tok-keyword">CREATE FUNCTION</span> fn_GPA(@sid <span class="tok-type">INT</span>) <span class="tok-keyword">RETURNS</span> <span class="tok-type">DECIMAL</span>(4,2) <span class="tok-keyword">AS</span>
<span class="tok-keyword">BEGIN</span>
    <span class="tok-keyword">RETURN</span> (<span class="tok-keyword">SELECT AVG</span>(grade) <span class="tok-keyword">FROM</span> Enrolment <span class="tok-keyword">WHERE</span> sid = @sid);
<span class="tok-keyword">END</span>;

<span class="tok-comment">-- hàm trả bảng nội tuyến: một view có tham số</span>
<span class="tok-keyword">CREATE FUNCTION</span> fn_StudentsOf(@cid <span class="tok-type">CHAR</span>(6)) <span class="tok-keyword">RETURNS TABLE AS</span>
<span class="tok-keyword">RETURN</span> (<span class="tok-keyword">SELECT</span> s.* <span class="tok-keyword">FROM</span> Student s <span class="tok-keyword">JOIN</span> Enrolment e <span class="tok-keyword">ON</span> s.sid = e.sid <span class="tok-keyword">WHERE</span> e.cid = @cid);

<span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> fn_StudentsOf(<span class="tok-string">'DBI202'</span>);</pre>

<div class="pitfall"><b>Hàm vô hướng đặt trong mệnh đề WHERE chạy một lần cho mỗi dòng và chặn việc dùng chỉ mục.</b> <span class="badge">WHERE fn_GPA(sid) &gt; 8</span> trên bảng 100.000 dòng sẽ gọi hàm 100.000 lần và buộc quét toàn bảng. Hãy viết lại thành phép nối với một hàm <em>trả bảng nội tuyến</em>, thứ mà bộ tối ưu khai triển được vào truy vấn ngoài. Đây là nguyên nhân phổ biến nhất của truy vấn "tự dưng chậm" trong đồ án sinh viên.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thủ tục lưu trữ từng là tuyến phòng thủ đầu tiên chống SQL injection.</b> Tham số là giá trị có kiểu, không bao giờ là văn bản được nối chuỗi, nên <span class="badge">@name = "'; DROP TABLE Student;--"</span> chỉ được lưu như một chuỗi vô hại. Nhưng sự bảo vệ đến từ <em>việc tham số hoá</em>, không phải từ bản thân thủ tục: dựng SQL động bằng <span class="badge">EXEC('SELECT … ' + @name)</span> ngay trong thủ tục là lỗ hổng quay lại y nguyên. Ứng dụng hiện đại có cùng đảm bảo đó nhờ câu lệnh chuẩn bị sẵn (<span class="badge">PreparedStatement</span> ở PRJ301), và vì thế lô-gic nghiệp vụ phần lớn đã quay về tầng ứng dụng. <em>Ngoài giáo trình vì môn học dạy cú pháp, còn phần lập luận về an ninh mới là thứ người phỏng vấn hỏi.</em></div>
</div>
`,
        },
        {
          title: '7.4 — Triggers & cursors (and when not to use them)|||7.4 — Trigger & cursor (và khi nào đừng dùng)',
          slug: 'dbi202-trigger-cursor',
          type: 'VIDEO',
          description: 'AFTER/INSTEAD OF trigger với bảng inserted/deleted, cursor và tư duy theo tập hợp thay cho vòng lặp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Code that fires by itself — and code that loops</h2>
<p class="lead">A trigger is a procedure the DBMS runs automatically when data changes. A cursor is a loop over a result set. Both are powerful, both are overused, and both appear in the exam.</p>

<h3>The two magic tables</h3>
<p>Inside any trigger you get two virtual tables: <span class="badge">inserted</span> (the new version of the affected rows) and <span class="badge">deleted</span> (the old version). INSERT populates only <em>inserted</em>; DELETE only <em>deleted</em>; UPDATE populates <b>both</b> — an update is modelled as a delete plus an insert.</p>

<pre><span class="tok-keyword">CREATE TRIGGER</span> trg_Enrolment_Audit
<span class="tok-keyword">ON</span> Enrolment <span class="tok-keyword">AFTER UPDATE</span>
<span class="tok-keyword">AS</span>
<span class="tok-keyword">BEGIN</span>
    <span class="tok-keyword">SET NOCOUNT ON</span>;
    <span class="tok-keyword">INSERT INTO</span> GradeAudit (sid, cid, old_grade, new_grade, changed_at, changed_by)
    <span class="tok-keyword">SELECT</span> i.sid, i.cid, d.grade, i.grade, <span class="tok-keyword">SYSDATETIME</span>(), <span class="tok-keyword">SUSER_SNAME</span>()
    <span class="tok-keyword">FROM</span> inserted i <span class="tok-keyword">JOIN</span> deleted d <span class="tok-keyword">ON</span> i.sid = d.sid <span class="tok-keyword">AND</span> i.cid = d.cid
    <span class="tok-keyword">WHERE ISNULL</span>(i.grade, -1) &lt;&gt; <span class="tok-keyword">ISNULL</span>(d.grade, -1);   <span class="tok-comment">-- only real changes</span>
<span class="tok-keyword">END</span>;</pre>
<div class="out"><b>Trace it.</b> <span class="badge">UPDATE Enrolment SET grade = 8.5 WHERE sid = 1 AND cid = 'DBI202'</span> (old grade 6.0):<br>
<em>deleted</em> holds (1, DBI202, 6.0) · <em>inserted</em> holds (1, DBI202, 8.5) → the join produces one row → one audit record: 6.0 → 8.5, with the timestamp and the login. The user did nothing special; the history is captured automatically. That is the strongest argument for triggers: a rule no application can bypass.</div>

<h3>AFTER versus INSTEAD OF</h3>
<table><thead><tr><th></th><th>AFTER (FOR)</th><th>INSTEAD OF</th></tr></thead><tbody>
<tr><td>Runs</td><td>after the change, before commit</td><td><b>instead of</b> the change</td></tr>
<tr><td>Typical use</td><td>audit, denormalised totals, cascading rules</td><td>make a multi-table <b>view updatable</b> (lesson 7.2), validate before writing</td></tr>
<tr><td>To cancel</td><td><span class="badge">ROLLBACK</span> inside the trigger</td><td>simply do not write anything</td></tr>
</tbody></table>

<h3>The rule that catches everyone: triggers fire once per statement</h3>
<div class="out"><b>Wrong:</b> <span class="badge">DECLARE @sid INT; SELECT @sid = sid FROM inserted;</span> — with a ten-row UPDATE, <em>inserted</em> holds ten rows and the variable silently takes one arbitrary value; nine rows are ignored.<br>
<b>Right:</b> write set-based code — a single <span class="badge">INSERT … SELECT … FROM inserted</span>, as in the audit trigger above.<br>
This is the number-one trigger bug in student projects, and it only shows up once someone runs a bulk update.</div>

<h3>Cursors — and the set-based alternative</h3>
<pre><span class="tok-keyword">DECLARE</span> @sid <span class="tok-type">INT</span>, @gpa <span class="tok-type">DECIMAL</span>(4,2);
<span class="tok-keyword">DECLARE</span> c <span class="tok-keyword">CURSOR LOCAL FAST_FORWARD FOR SELECT</span> sid <span class="tok-keyword">FROM</span> Student;
<span class="tok-keyword">OPEN</span> c;
<span class="tok-keyword">FETCH NEXT FROM</span> c <span class="tok-keyword">INTO</span> @sid;
<span class="tok-keyword">WHILE</span> @@FETCH_STATUS = 0
<span class="tok-keyword">BEGIN</span>
    <span class="tok-keyword">SELECT</span> @gpa = <span class="tok-keyword">AVG</span>(grade) <span class="tok-keyword">FROM</span> Enrolment <span class="tok-keyword">WHERE</span> sid = @sid;
    <span class="tok-keyword">UPDATE</span> Student <span class="tok-keyword">SET</span> gpa = @gpa <span class="tok-keyword">WHERE</span> sid = @sid;
    <span class="tok-keyword">FETCH NEXT FROM</span> c <span class="tok-keyword">INTO</span> @sid;
<span class="tok-keyword">END</span>
<span class="tok-keyword">CLOSE</span> c; <span class="tok-keyword">DEALLOCATE</span> c;</pre>
<div class="out"><b>The same job, set-based:</b><br>
<span class="badge">UPDATE s SET s.gpa = x.avg_g FROM Student s JOIN (SELECT sid, AVG(grade) avg_g FROM Enrolment GROUP BY sid) x ON x.sid = s.sid;</span><br>
<b>One statement instead of 2n.</b> On 10,000 students the cursor issues 20,000 statements and typically takes minutes; the set-based UPDATE is one operation and takes well under a second. Always try to express the loop as a join first — reach for a cursor only when each row genuinely needs a different action (calling a procedure per row, sending a message, generating dynamic SQL).<br>
<b>If you must use one:</b> declare it <span class="badge">LOCAL FAST_FORWARD</span> (forward-only, read-only) and always CLOSE and DEALLOCATE, or the memory stays allocated for the whole session.</div>

<div class="pitfall"><b>Triggers are invisible.</b> A colleague's UPDATE mysteriously writes to three other tables and takes 400 ms — because a trigger nobody remembers is doing extra work inside the same transaction. Keep triggers small, document them, and never put slow work (loops, remote calls, e-mail) inside one: the user's transaction stays open the whole time.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Change Data Capture replaces hand-written audit triggers.</b> Instead of a trigger per table, SQL Server can read the transaction log itself and expose every insert/update/delete as a stream — with no extra work inside the user's transaction. The same log-reading idea powers Debezium and Kafka Connect, which turn a database into an event stream that feeds caches, search indexes and analytics in near real time. <em>Beyond syllabus because the course teaches the trigger, while modern architectures move that concern out of the write path entirely.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Mã tự động chạy — và mã chạy vòng lặp</h2>
<p class="lead">Trigger là một thủ tục mà DBMS tự chạy khi dữ liệu thay đổi. Cursor là một vòng lặp trên tập kết quả. Cả hai đều mạnh, cả hai đều bị lạm dụng, và cả hai đều có trong đề thi.</p>

<h3>Hai bảng ảo thần kỳ</h3>
<p>Bên trong mọi trigger bạn có hai bảng ảo: <span class="badge">inserted</span> (bản mới của các dòng bị tác động) và <span class="badge">deleted</span> (bản cũ). Lệnh INSERT chỉ lấp <em>inserted</em>; DELETE chỉ lấp <em>deleted</em>; UPDATE lấp <b>cả hai</b> — một phép cập nhật được mô hình hoá thành xoá cộng chèn.</p>

<pre><span class="tok-keyword">CREATE TRIGGER</span> trg_Enrolment_Audit
<span class="tok-keyword">ON</span> Enrolment <span class="tok-keyword">AFTER UPDATE</span>
<span class="tok-keyword">AS</span>
<span class="tok-keyword">BEGIN</span>
    <span class="tok-keyword">SET NOCOUNT ON</span>;
    <span class="tok-keyword">INSERT INTO</span> GradeAudit (sid, cid, old_grade, new_grade, changed_at, changed_by)
    <span class="tok-keyword">SELECT</span> i.sid, i.cid, d.grade, i.grade, <span class="tok-keyword">SYSDATETIME</span>(), <span class="tok-keyword">SUSER_SNAME</span>()
    <span class="tok-keyword">FROM</span> inserted i <span class="tok-keyword">JOIN</span> deleted d <span class="tok-keyword">ON</span> i.sid = d.sid <span class="tok-keyword">AND</span> i.cid = d.cid
    <span class="tok-keyword">WHERE ISNULL</span>(i.grade, -1) &lt;&gt; <span class="tok-keyword">ISNULL</span>(d.grade, -1);   <span class="tok-comment">-- chỉ ghi khi thật sự đổi</span>
<span class="tok-keyword">END</span>;</pre>
<div class="out"><b>Chạy tay.</b> <span class="badge">UPDATE Enrolment SET grade = 8.5 WHERE sid = 1 AND cid = 'DBI202'</span> (điểm cũ 6,0):<br>
<em>deleted</em> chứa (1, DBI202, 6.0) · <em>inserted</em> chứa (1, DBI202, 8.5) → phép nối cho một dòng → một bản ghi kiểm toán: 6,0 → 8,5, kèm mốc thời gian và tài khoản. Người dùng không phải làm gì đặc biệt; lịch sử được ghi lại tự động. Đó là lập luận mạnh nhất cho trigger: một luật mà không ứng dụng nào lách được.</div>

<h3>AFTER với INSTEAD OF</h3>
<table><thead><tr><th></th><th>AFTER (FOR)</th><th>INSTEAD OF</th></tr></thead><tbody>
<tr><td>Chạy khi nào</td><td>sau khi thay đổi, trước khi commit</td><td><b>thay cho</b> chính phép thay đổi</td></tr>
<tr><td>Dùng điển hình</td><td>kiểm toán, tổng phi chuẩn hoá, luật lan truyền</td><td>làm cho view nhiều bảng <b>cập nhật được</b> (bài 7.2), kiểm tra trước khi ghi</td></tr>
<tr><td>Muốn huỷ</td><td><span class="badge">ROLLBACK</span> ngay trong trigger</td><td>đơn giản là không ghi gì cả</td></tr>
</tbody></table>

<h3>Quy tắc bẫy tất cả mọi người: trigger chạy một lần cho mỗi CÂU LỆNH</h3>
<div class="out"><b>Sai:</b> <span class="badge">DECLARE @sid INT; SELECT @sid = sid FROM inserted;</span> — với lệnh UPDATE mười dòng, <em>inserted</em> chứa mười dòng và biến âm thầm nhận một giá trị bất kỳ; chín dòng còn lại bị bỏ qua.<br>
<b>Đúng:</b> viết mã theo tập hợp — một lệnh <span class="badge">INSERT … SELECT … FROM inserted</span> duy nhất, như trigger kiểm toán ở trên.<br>
Đây là lỗi trigger số một trong đồ án sinh viên, và nó chỉ lộ ra khi có ai đó chạy một lệnh cập nhật hàng loạt.</div>

<h3>Cursor — và cách làm theo tập hợp</h3>
<pre><span class="tok-keyword">DECLARE</span> @sid <span class="tok-type">INT</span>, @gpa <span class="tok-type">DECIMAL</span>(4,2);
<span class="tok-keyword">DECLARE</span> c <span class="tok-keyword">CURSOR LOCAL FAST_FORWARD FOR SELECT</span> sid <span class="tok-keyword">FROM</span> Student;
<span class="tok-keyword">OPEN</span> c;
<span class="tok-keyword">FETCH NEXT FROM</span> c <span class="tok-keyword">INTO</span> @sid;
<span class="tok-keyword">WHILE</span> @@FETCH_STATUS = 0
<span class="tok-keyword">BEGIN</span>
    <span class="tok-keyword">SELECT</span> @gpa = <span class="tok-keyword">AVG</span>(grade) <span class="tok-keyword">FROM</span> Enrolment <span class="tok-keyword">WHERE</span> sid = @sid;
    <span class="tok-keyword">UPDATE</span> Student <span class="tok-keyword">SET</span> gpa = @gpa <span class="tok-keyword">WHERE</span> sid = @sid;
    <span class="tok-keyword">FETCH NEXT FROM</span> c <span class="tok-keyword">INTO</span> @sid;
<span class="tok-keyword">END</span>
<span class="tok-keyword">CLOSE</span> c; <span class="tok-keyword">DEALLOCATE</span> c;</pre>
<div class="out"><b>Cùng công việc đó, viết theo tập hợp:</b><br>
<span class="badge">UPDATE s SET s.gpa = x.avg_g FROM Student s JOIN (SELECT sid, AVG(grade) avg_g FROM Enrolment GROUP BY sid) x ON x.sid = s.sid;</span><br>
<b>Một câu lệnh thay vì 2n câu.</b> Với 10.000 sinh viên, cursor phát ra 20.000 câu lệnh và thường mất vài phút; lệnh UPDATE theo tập hợp là một thao tác và mất chưa tới một giây. Luôn thử diễn đạt vòng lặp thành phép nối trước — chỉ dùng cursor khi mỗi dòng thật sự cần một hành động khác nhau (gọi một thủ tục cho từng dòng, gửi thông điệp, sinh SQL động).<br>
<b>Nếu buộc phải dùng:</b> khai báo <span class="badge">LOCAL FAST_FORWARD</span> (chỉ tiến, chỉ đọc) và luôn CLOSE rồi DEALLOCATE, nếu không bộ nhớ vẫn bị giữ suốt phiên làm việc.</div>

<div class="pitfall"><b>Trigger thì vô hình.</b> Lệnh UPDATE của đồng nghiệp tự dưng ghi vào ba bảng khác và mất 400 ms — vì một trigger mà không ai còn nhớ đang làm thêm việc trong cùng giao dịch đó. Hãy giữ trigger thật nhỏ, ghi tài liệu cho nó, và đừng bao giờ nhét việc chậm (vòng lặp, gọi dịch vụ từ xa, gửi email) vào trong: giao dịch của người dùng bị mở suốt thời gian đó.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Change Data Capture thay thế các trigger kiểm toán viết tay.</b> Thay vì mỗi bảng một trigger, SQL Server đọc thẳng nhật ký giao dịch và phơi mọi lệnh chèn/sửa/xoá thành một luồng — mà không thêm việc gì vào giao dịch của người dùng. Cùng ý tưởng đọc nhật ký đó là động cơ của Debezium và Kafka Connect, biến một cơ sở dữ liệu thành luồng sự kiện nuôi các cache, chỉ mục tìm kiếm và hệ phân tích gần như tức thời. <em>Ngoài giáo trình vì môn học dạy trigger, còn kiến trúc hiện đại thì đưa hẳn mối bận tâm đó ra khỏi đường ghi.</em></div>
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
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Isolation levels &amp; the read phenomena.</b> The "I" in ACID is a dial, not a switch. Loosen it and three anomalies appear: a <b>dirty read</b> (seeing another transaction's uncommitted change), a <b>non-repeatable read</b> (the same row changes value mid-transaction), and a <b>phantom</b> (new rows appear matching your WHERE). The four SQL levels — READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE — each forbid more of these at the cost of concurrency, and <b>snapshot / MVCC</b> avoids most locking by versioning rows. <em>The syllabus names ACID; choosing an isolation level is the real-world decision that trades correctness against throughput.</em></div>
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
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mức cô lập &amp; các hiện tượng đọc.</b> Chữ "I" trong ACID là một núm xoay, không phải công tắc. Nới lỏng nó và ba bất thường xuất hiện: <b>đọc bẩn</b> (thấy thay đổi chưa commit của giao dịch khác), <b>đọc không lặp lại</b> (cùng một hàng đổi giá trị giữa giao dịch), và <b>bóng ma (phantom)</b> (hàng mới xuất hiện khớp mệnh đề WHERE của bạn). Bốn mức SQL — READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE — mỗi mức cấm thêm các hiện tượng này với cái giá là tính đồng thời, và <b>snapshot / MVCC</b> tránh phần lớn khóa bằng cách tạo phiên bản cho hàng. <em>Giáo trình gọi tên ACID; chọn mức cô lập mới là quyết định thực tế đánh đổi tính đúng lấy thông lượng.</em></div>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-databases%2Flearn&reflabel=DBI202%20%E2%80%94%20Database%20Systems#module-720" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Luyện: Chiến lược đánh chỉ mục</span><span class="lc-sub">Chỉ mục & thiết kế lược đồ nâng cao.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '8.2 — Clustered vs nonclustered & reading a plan|||8.2 — Chỉ mục gom cụm vs không gom cụm & đọc kế hoạch',
          slug: 'dbi202-execution-plan',
          type: 'VIDEO',
          description: 'Hai loại chỉ mục, covering index, và cách đọc execution plan để biết truy vấn chậm ở đâu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Two kinds of index, and how to see which one was used</h2>
<p class="lead">Lesson 8.1 explained why an index turns O(n) into O(log n). Now the practical half: which index type to create, and how to prove from the execution plan that the database actually used it.</p>

<h3>Clustered — the table itself, kept in order</h3>
<div class="out">A clustered index <em>is</em> the table: the rows are physically stored in the index's leaf pages, sorted by its key. Therefore <b>only one per table</b>. In SQL Server, declaring a PRIMARY KEY creates it by default.<br>
<b>What it makes fast:</b> range scans on the key (<span class="badge">WHERE order_date BETWEEN … AND …</span>), because matching rows sit next to each other on the same pages, and lookups by key, because there is no second hop.<br>
<b>Choose the key carefully:</b> narrow (every nonclustered index carries a copy of it), increasing (so inserts append instead of splitting pages), and rarely updated. An <span class="badge">INT IDENTITY</span> satisfies all three — a <span class="badge">UNIQUEIDENTIFIER DEFAULT NEWID()</span> satisfies none, and fragments the table badly.</div>

<h3>Nonclustered — a separate sorted copy of some columns</h3>
<pre><span class="tok-keyword">CREATE INDEX</span> ix_Enrolment_cid <span class="tok-keyword">ON</span> Enrolment(cid);
<span class="tok-keyword">CREATE INDEX</span> ix_Enrolment_cid_grade <span class="tok-keyword">ON</span> Enrolment(cid) <span class="tok-keyword">INCLUDE</span> (grade);   <span class="tok-comment">-- covering</span></pre>
<div class="out"><b>Without INCLUDE:</b> the index finds the matching rows by <span class="badge">cid</span>, then must jump back to the table for <span class="badge">grade</span> — one extra read per row ("key lookup"). Above a few hundred rows the optimiser decides the jumps are not worth it and scans the whole table instead.<br>
<b>With INCLUDE:</b> <span class="badge">grade</span> is stored inside the index, so the query is answered entirely from it — a <b>covering index</b>. That single word "covering" explains most 100× speed-ups in practice.</div>

<h3>Composite indexes — the leftmost-prefix rule</h3>
<div class="out"><b>Index on (sid, cid, grade).</b> It can be used for:<br>
<span class="badge">WHERE sid = 5</span> ✓ (prefix) · <span class="badge">WHERE sid = 5 AND cid = 'DBI'</span> ✓ · <span class="badge">WHERE sid = 5 AND cid = 'DBI' AND grade &gt; 8</span> ✓<br>
<b>Not usable for</b> <span class="badge">WHERE cid = 'DBI'</span> ✗ — cid alone is not a prefix, exactly as you cannot find a word in a dictionary by its second letter.<br>
<b>Order the columns by:</b> equality filters first, then range filters, then the columns you only need to output.</div>

<h3>Reading an execution plan (Ctrl+M in SSMS)</h3>
<table><thead><tr><th>Operator</th><th>Means</th><th>Verdict</th></tr></thead><tbody>
<tr><td><b>Index Seek</b></td><td>jumped straight to the matching rows</td><td>✓ what you want</td></tr>
<tr><td><b>Index Scan</b></td><td>read the whole index</td><td>acceptable if you needed most rows</td></tr>
<tr><td><b>Table / Clustered Index Scan</b></td><td>read every row of the table</td><td>⚠ suspicious on a big table</td></tr>
<tr><td><b>Key Lookup</b></td><td>index found the row, then fetched the rest</td><td>⚠ fix with INCLUDE</td></tr>
<tr><td><b>Sort</b></td><td>ordering done at run time</td><td>⚠ an index could supply the order</td></tr>
<tr><td><b>Hash Match</b></td><td>hash join or aggregate</td><td>fine on large sets, suspicious on small ones</td></tr>
</tbody></table>
<div class="out"><b>Worked diagnosis.</b> A query on 500,000 enrolments takes 3 s. The plan shows <em>Clustered Index Scan</em> (98% cost) plus a <em>Sort</em>.<br>
Query: <span class="badge">SELECT sid, grade FROM Enrolment WHERE cid = 'DBI202' ORDER BY grade DESC</span>.<br>
<b>Diagnosis:</b> no index on cid → full scan; and the ORDER BY has to sort afterwards.<br>
<b>Fix:</b> <span class="badge">CREATE INDEX ix ON Enrolment(cid) INCLUDE (sid, grade)</span> → the plan becomes an <em>Index Seek</em>, no key lookup (covered), and only the small result set is sorted. Measured: 3 s → 12 ms.<br>
<b>Always compare before/after with</b> <span class="badge">SET STATISTICS IO, TIME ON</span> — "logical reads" is the honest number; elapsed time depends on the cache.</div>

<div class="pitfall"><b>A function on the indexed column disables the index.</b> <span class="badge">WHERE YEAR(order_date) = 2026</span> forces a scan; <span class="badge">WHERE order_date &gt;= '2026-01-01' AND order_date &lt; '2027-01-01'</span> seeks. The same applies to <span class="badge">WHERE CAST(sid AS VARCHAR) = '5'</span> and to <span class="badge">LIKE '%abc'</span> — a leading wildcard has no prefix to seek on. The technical term is a <em>non-sargable</em> predicate.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Every index makes writes slower — that is the whole trade.</b> An INSERT must add a row to the table plus an entry to each nonclustered index, keeping every one of them sorted; a table with eight indexes can write five times slower than the same table with two. Real tuning therefore starts by <em>deleting</em> unused indexes (SQL Server records usage in <span class="badge">sys.dm_db_index_usage_stats</span>), then adding the few that serve the most frequent queries. "Index every column" is not caution — it is a performance bug spread evenly across the schema. <em>Beyond syllabus because the course teaches how to create an index, while the professional skill is deciding which ones not to have.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Hai loại chỉ mục, và cách nhìn ra cái nào đã được dùng</h2>
<p class="lead">Bài 8.1 giải thích vì sao chỉ mục biến O(n) thành O(log n). Giờ là nửa thực hành: nên tạo loại chỉ mục nào, và làm sao chứng minh từ kế hoạch thực thi rằng cơ sở dữ liệu thật sự đã dùng nó.</p>

<h3>Gom cụm (clustered) — chính là cái bảng, được giữ theo thứ tự</h3>
<div class="out">Chỉ mục gom cụm <em>chính là</em> cái bảng: các dòng được lưu vật lý ngay trong các trang lá của chỉ mục, sắp theo khoá của nó. Vì thế <b>mỗi bảng chỉ có một cái</b>. Trong SQL Server, khai báo PRIMARY KEY sẽ mặc định tạo ra nó.<br>
<b>Nó làm nhanh cái gì:</b> quét khoảng theo khoá (<span class="badge">WHERE order_date BETWEEN … AND …</span>), vì các dòng khớp nằm cạnh nhau trên cùng những trang, và tra cứu theo khoá, vì không phải nhảy thêm bước nào.<br>
<b>Chọn khoá cho cẩn thận:</b> hẹp (mọi chỉ mục không gom cụm đều mang theo một bản sao của nó), tăng dần (để phép chèn nối vào cuối thay vì làm tách trang), và ít khi bị sửa. Một <span class="badge">INT IDENTITY</span> thoả cả ba — còn <span class="badge">UNIQUEIDENTIFIER DEFAULT NEWID()</span> không thoả cái nào, và làm phân mảnh bảng nặng nề.</div>

<h3>Không gom cụm — một bản sao đã sắp của vài cột</h3>
<pre><span class="tok-keyword">CREATE INDEX</span> ix_Enrolment_cid <span class="tok-keyword">ON</span> Enrolment(cid);
<span class="tok-keyword">CREATE INDEX</span> ix_Enrolment_cid_grade <span class="tok-keyword">ON</span> Enrolment(cid) <span class="tok-keyword">INCLUDE</span> (grade);   <span class="tok-comment">-- phủ truy vấn</span></pre>
<div class="out"><b>Không có INCLUDE:</b> chỉ mục tìm được các dòng khớp theo <span class="badge">cid</span>, rồi phải nhảy ngược về bảng để lấy <span class="badge">grade</span> — thêm một lần đọc cho mỗi dòng ("key lookup"). Vượt vài trăm dòng là bộ tối ưu thấy các cú nhảy đó không đáng và quay sang quét cả bảng.<br>
<b>Có INCLUDE:</b> <span class="badge">grade</span> được lưu ngay trong chỉ mục, nên truy vấn được trả lời hoàn toàn từ chỉ mục — một <b>chỉ mục phủ</b>. Đúng một chữ "phủ" đó giải thích phần lớn các lần tăng tốc gấp 100 lần trong thực tế.</div>

<h3>Chỉ mục ghép — quy tắc tiền tố trái nhất</h3>
<div class="out"><b>Chỉ mục trên (sid, cid, grade).</b> Nó dùng được cho:<br>
<span class="badge">WHERE sid = 5</span> ✓ (tiền tố) · <span class="badge">WHERE sid = 5 AND cid = 'DBI'</span> ✓ · <span class="badge">WHERE sid = 5 AND cid = 'DBI' AND grade &gt; 8</span> ✓<br>
<b>Không dùng được cho</b> <span class="badge">WHERE cid = 'DBI'</span> ✗ — cid đứng một mình không phải tiền tố, y như bạn không thể tra một từ trong từ điển bằng chữ cái thứ hai của nó.<br>
<b>Sắp thứ tự cột theo:</b> điều kiện bằng trước, rồi điều kiện khoảng, rồi mới tới các cột chỉ cần lấy ra để hiển thị.</div>

<h3>Đọc kế hoạch thực thi (Ctrl+M trong SSMS)</h3>
<table><thead><tr><th>Toán tử</th><th>Nghĩa là</th><th>Đánh giá</th></tr></thead><tbody>
<tr><td><b>Index Seek</b></td><td>nhảy thẳng tới các dòng khớp</td><td>✓ thứ bạn muốn</td></tr>
<tr><td><b>Index Scan</b></td><td>đọc hết cả chỉ mục</td><td>chấp nhận được nếu bạn cần phần lớn số dòng</td></tr>
<tr><td><b>Table / Clustered Index Scan</b></td><td>đọc mọi dòng của bảng</td><td>⚠ đáng ngờ trên bảng lớn</td></tr>
<tr><td><b>Key Lookup</b></td><td>chỉ mục tìm được dòng rồi phải lấy nốt phần còn lại</td><td>⚠ chữa bằng INCLUDE</td></tr>
<tr><td><b>Sort</b></td><td>sắp xếp lúc chạy</td><td>⚠ một chỉ mục có thể cung cấp sẵn thứ tự</td></tr>
<tr><td><b>Hash Match</b></td><td>nối băm hoặc tổng hợp băm</td><td>ổn với tập lớn, đáng ngờ với tập nhỏ</td></tr>
</tbody></table>
<div class="out"><b>Ví dụ chẩn đoán.</b> Truy vấn trên 500.000 đăng ký mất 3 giây. Kế hoạch cho thấy <em>Clustered Index Scan</em> (98% chi phí) cộng một <em>Sort</em>.<br>
Truy vấn: <span class="badge">SELECT sid, grade FROM Enrolment WHERE cid = 'DBI202' ORDER BY grade DESC</span>.<br>
<b>Chẩn đoán:</b> không có chỉ mục trên cid → quét toàn bảng; và mệnh đề ORDER BY phải sắp xếp sau đó.<br>
<b>Cách chữa:</b> <span class="badge">CREATE INDEX ix ON Enrolment(cid) INCLUDE (sid, grade)</span> → kế hoạch chuyển thành <em>Index Seek</em>, không còn key lookup (đã phủ), và chỉ tập kết quả nhỏ phải sắp. Đo thật: 3 giây → 12 mili-giây.<br>
<b>Luôn so trước/sau bằng</b> <span class="badge">SET STATISTICS IO, TIME ON</span> — "logical reads" mới là con số trung thực; thời gian trôi qua còn phụ thuộc bộ nhớ đệm.</div>

<div class="pitfall"><b>Bọc một hàm quanh cột đã đánh chỉ mục là vô hiệu hoá chỉ mục.</b> <span class="badge">WHERE YEAR(order_date) = 2026</span> buộc quét bảng; <span class="badge">WHERE order_date &gt;= '2026-01-01' AND order_date &lt; '2027-01-01'</span> thì seek được. Điều tương tự với <span class="badge">WHERE CAST(sid AS VARCHAR) = '5'</span> và với <span class="badge">LIKE '%abc'</span> — dấu sao đứng đầu thì không còn tiền tố nào để seek. Thuật ngữ kỹ thuật là điều kiện <em>non-sargable</em>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mỗi chỉ mục làm phép ghi chậm đi — đó là toàn bộ phép đánh đổi.</b> Một lệnh INSERT phải thêm một dòng vào bảng cộng một mục vào từng chỉ mục không gom cụm, và giữ mọi chỉ mục đó luôn sắp đúng thứ tự; một bảng tám chỉ mục có thể ghi chậm gấp năm lần chính bảng đó với hai chỉ mục. Vì thế việc tinh chỉnh thật sự bắt đầu bằng <em>xoá</em> các chỉ mục không ai dùng (SQL Server ghi lại mức sử dụng trong <span class="badge">sys.dm_db_index_usage_stats</span>), rồi mới thêm vài cái phục vụ các truy vấn phổ biến nhất. "Đánh chỉ mục mọi cột" không phải cẩn thận — đó là một lỗi hiệu năng rải đều khắp lược đồ. <em>Ngoài giáo trình vì môn học dạy cách tạo chỉ mục, còn kỹ năng chuyên nghiệp là quyết định những chỉ mục nào KHÔNG nên có.</em></div>
</div>
`,
        },
        {
          title: '8.3 — Transactions, ACID & isolation levels|||8.3 — Giao dịch, ACID & mức cô lập',
          slug: 'dbi202-transaction-acid',
          type: 'VIDEO',
          description: 'BEGIN/COMMIT/ROLLBACK, bốn tính chất ACID, ba hiện tượng đọc bẩn và bốn mức cô lập, khoá chết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Making several statements behave as one</h2>
<p class="lead">A bank transfer is two UPDATEs. If the machine dies between them, money has vanished. A <strong>transaction</strong> is the promise that this cannot happen — and the isolation level is how much of that promise you are willing to pay for.</p>

<pre><span class="tok-keyword">BEGIN TRANSACTION</span>;
    <span class="tok-keyword">UPDATE</span> Account <span class="tok-keyword">SET</span> balance = balance - 1000 <span class="tok-keyword">WHERE</span> id = 1;
    <span class="tok-keyword">UPDATE</span> Account <span class="tok-keyword">SET</span> balance = balance + 1000 <span class="tok-keyword">WHERE</span> id = 2;
    <span class="tok-keyword">IF</span> @@ERROR &lt;&gt; 0 <span class="tok-keyword">ROLLBACK TRANSACTION</span>;
<span class="tok-keyword">ELSE COMMIT TRANSACTION</span>;</pre>

<h3>ACID, one line each</h3>
<table><thead><tr><th>Property</th><th>Promise</th><th>Mechanism</th></tr></thead><tbody>
<tr><td><b>A</b>tomicity</td><td>all statements or none</td><td>the transaction log + rollback</td></tr>
<tr><td><b>C</b>onsistency</td><td>constraints hold before and after</td><td>PK/FK/CHECK, triggers</td></tr>
<tr><td><b>I</b>solation</td><td>concurrent transactions do not corrupt each other</td><td>locks / row versioning</td></tr>
<tr><td><b>D</b>urability</td><td>a committed change survives a crash</td><td>write-ahead log flushed to disk</td></tr>
</tbody></table>

<h3>The three anomalies isolation is meant to prevent</h3>
<div class="out"><b>1. Dirty read</b> — T2 reads a row T1 has changed but not committed; T1 then rolls back, so T2 acted on data that never existed.<br>
<b>2. Non-repeatable read</b> — T2 reads a row, T1 updates and commits it, T2 reads it again and gets a different value <em>inside one transaction</em>.<br>
<b>3. Phantom read</b> — T2 runs <span class="badge">SELECT COUNT(*) … WHERE dept = 'IT'</span> twice; between them T1 inserts a new IT employee, so the second count is larger. No row changed — a new one appeared.</div>

<h3>The four isolation levels</h3>
<table><thead><tr><th>Level</th><th>Dirty</th><th>Non-repeatable</th><th>Phantom</th><th>Cost</th></tr></thead><tbody>
<tr><td>READ UNCOMMITTED</td><td>possible</td><td>possible</td><td>possible</td><td>lowest</td></tr>
<tr><td><b>READ COMMITTED</b> (SQL Server default)</td><td>prevented</td><td>possible</td><td>possible</td><td>low</td></tr>
<tr><td>REPEATABLE READ</td><td>prevented</td><td>prevented</td><td>possible</td><td>medium</td></tr>
<tr><td>SERIALIZABLE</td><td>prevented</td><td>prevented</td><td><b>prevented</b></td><td>highest</td></tr>
</tbody></table>
<div class="out"><b>Worked example — why the default is not always enough.</b><br>
Booking the last seat: T1 runs <span class="badge">SELECT seats FROM Course WHERE cid='DBI'</span> → 1, decides it is fine, then <span class="badge">UPDATE … SET seats = seats - 1</span>. T2 does exactly the same, interleaved. Under READ COMMITTED both read 1 and both decrement → <b>seats = −1</b>, two students in one seat.<br>
<b>Three correct fixes:</b> (1) do the check and the change in one atomic statement — <span class="badge">UPDATE Course SET seats = seats - 1 WHERE cid='DBI' AND seats &gt; 0</span> then verify <span class="badge">@@ROWCOUNT = 1</span>; (2) lock the row while reading: <span class="badge">SELECT … WITH (UPDLOCK)</span>; (3) raise the level to SERIALIZABLE. The first is the cheapest and the one to remember.</div>

<h3>Deadlock</h3>
<div class="out"><b>How it happens:</b> T1 locks row A then asks for B; T2 has locked B and asks for A. Neither can proceed. SQL Server detects the cycle, kills the cheaper transaction ("deadlock victim", error 1205) and rolls it back.<br>
<b>How to avoid it:</b> always access tables in the <em>same order</em> everywhere in the application, keep transactions short, and never wait for user input while a transaction is open. <b>How to survive it:</b> catch error 1205 and retry the whole transaction — deadlocks are a normal condition, not a bug to be eliminated.</div>

<div class="pitfall"><b>An open transaction holds locks until COMMIT or ROLLBACK.</b> Running <span class="badge">BEGIN TRAN</span> in SSMS and then going to lunch blocks every other session touching those rows. If a table suddenly "hangs", check <span class="badge">sys.dm_exec_requests</span> for a blocking session — nine times out of ten it is a forgotten transaction in someone's query window.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Snapshot isolation: readers that never block writers.</b> Instead of locking, the engine keeps the previous version of each row and lets a transaction read a consistent snapshot from its start time (MVCC). Readers no longer block writers and writers no longer block readers — at the cost of extra space for versions (tempdb in SQL Server) and possible update conflicts that must be retried. It is the default in PostgreSQL and Oracle, and switched on in SQL Server with <span class="badge">ALTER DATABASE … SET READ_COMMITTED_SNAPSHOT ON</span>. <em>Beyond syllabus because DBI202 teaches lock-based isolation only, while most modern engines are version-based.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Làm cho nhiều câu lệnh hành xử như một</h2>
<p class="lead">Một lệnh chuyển khoản là hai câu UPDATE. Nếu máy chết ở giữa, tiền bốc hơi. <strong>Giao dịch</strong> là lời hứa rằng chuyện đó không thể xảy ra — còn mức cô lập là phần lời hứa mà bạn sẵn lòng trả giá để có.</p>

<pre><span class="tok-keyword">BEGIN TRANSACTION</span>;
    <span class="tok-keyword">UPDATE</span> Account <span class="tok-keyword">SET</span> balance = balance - 1000 <span class="tok-keyword">WHERE</span> id = 1;
    <span class="tok-keyword">UPDATE</span> Account <span class="tok-keyword">SET</span> balance = balance + 1000 <span class="tok-keyword">WHERE</span> id = 2;
    <span class="tok-keyword">IF</span> @@ERROR &lt;&gt; 0 <span class="tok-keyword">ROLLBACK TRANSACTION</span>;
<span class="tok-keyword">ELSE COMMIT TRANSACTION</span>;</pre>

<h3>ACID, mỗi chữ một dòng</h3>
<table><thead><tr><th>Tính chất</th><th>Lời hứa</th><th>Cơ chế</th></tr></thead><tbody>
<tr><td><b>A</b> — Nguyên tử</td><td>hoặc tất cả câu lệnh, hoặc không câu nào</td><td>nhật ký giao dịch + rollback</td></tr>
<tr><td><b>C</b> — Nhất quán</td><td>ràng buộc đúng cả trước lẫn sau</td><td>PK/FK/CHECK, trigger</td></tr>
<tr><td><b>I</b> — Cô lập</td><td>các giao dịch song song không làm hỏng nhau</td><td>khoá / phiên bản dòng</td></tr>
<tr><td><b>D</b> — Bền vững</td><td>thay đổi đã commit sống sót qua sự cố</td><td>nhật ký ghi trước, xả xuống đĩa</td></tr>
</tbody></table>

<h3>Ba hiện tượng mà cô lập sinh ra để ngăn chặn</h3>
<div class="out"><b>1. Đọc bẩn</b> — T2 đọc một dòng mà T1 đã sửa nhưng chưa commit; sau đó T1 quay lui, nên T2 đã hành động trên dữ liệu chưa từng tồn tại.<br>
<b>2. Đọc không lặp lại được</b> — T2 đọc một dòng, T1 sửa và commit nó, T2 đọc lại và nhận giá trị khác <em>ngay trong một giao dịch</em>.<br>
<b>3. Đọc bóng ma</b> — T2 chạy <span class="badge">SELECT COUNT(*) … WHERE dept = 'IT'</span> hai lần; ở giữa, T1 chèn một nhân viên IT mới, nên lần đếm thứ hai lớn hơn. Không dòng nào bị sửa — có một dòng mới xuất hiện.</div>

<h3>Bốn mức cô lập</h3>
<table><thead><tr><th>Mức</th><th>Đọc bẩn</th><th>Không lặp lại</th><th>Bóng ma</th><th>Chi phí</th></tr></thead><tbody>
<tr><td>READ UNCOMMITTED</td><td>có thể</td><td>có thể</td><td>có thể</td><td>thấp nhất</td></tr>
<tr><td><b>READ COMMITTED</b> (mặc định SQL Server)</td><td>ngăn được</td><td>có thể</td><td>có thể</td><td>thấp</td></tr>
<tr><td>REPEATABLE READ</td><td>ngăn được</td><td>ngăn được</td><td>có thể</td><td>trung bình</td></tr>
<tr><td>SERIALIZABLE</td><td>ngăn được</td><td>ngăn được</td><td><b>ngăn được</b></td><td>cao nhất</td></tr>
</tbody></table>
<div class="out"><b>Ví dụ có lời giải — vì sao mức mặc định không phải lúc nào cũng đủ.</b><br>
Đặt chỗ cuối cùng: T1 chạy <span class="badge">SELECT seats FROM Course WHERE cid='DBI'</span> → 1, thấy ổn, rồi <span class="badge">UPDATE … SET seats = seats - 1</span>. T2 làm y hệt, xen kẽ vào giữa. Ở mức READ COMMITTED, cả hai cùng đọc 1 và cùng trừ đi → <b>seats = −1</b>, hai sinh viên một chỗ.<br>
<b>Ba cách chữa đúng:</b> (1) gộp phép kiểm và phép sửa vào một câu lệnh nguyên tử — <span class="badge">UPDATE Course SET seats = seats - 1 WHERE cid='DBI' AND seats &gt; 0</span> rồi kiểm <span class="badge">@@ROWCOUNT = 1</span>; (2) khoá dòng ngay khi đọc: <span class="badge">SELECT … WITH (UPDLOCK)</span>; (3) nâng lên mức SERIALIZABLE. Cách đầu rẻ nhất và là cách cần nhớ.</div>

<h3>Khoá chết (deadlock)</h3>
<div class="out"><b>Nó xảy ra thế nào:</b> T1 khoá dòng A rồi xin dòng B; T2 đang khoá B và xin A. Không ai đi tiếp được. SQL Server phát hiện chu trình, giết giao dịch rẻ hơn ("nạn nhân khoá chết", lỗi 1205) và quay lui nó.<br>
<b>Cách tránh:</b> luôn truy cập các bảng theo <em>cùng một thứ tự</em> ở mọi nơi trong ứng dụng, giữ giao dịch thật ngắn, và đừng bao giờ chờ người dùng nhập liệu khi giao dịch đang mở. <b>Cách sống chung:</b> bắt lỗi 1205 và chạy lại cả giao dịch — khoá chết là tình huống bình thường, không phải lỗi cần xoá sổ.</div>

<div class="pitfall"><b>Giao dịch đang mở thì giữ khoá cho tới khi COMMIT hoặc ROLLBACK.</b> Gõ <span class="badge">BEGIN TRAN</span> trong SSMS rồi đi ăn trưa là chặn mọi phiên khác đụng vào những dòng đó. Nếu một bảng bỗng dưng "treo", hãy soi <span class="badge">sys.dm_exec_requests</span> tìm phiên đang chặn — mười lần thì chín là một giao dịch bị bỏ quên trong cửa sổ truy vấn của ai đó.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cô lập theo ảnh chụp: người đọc không bao giờ chặn người ghi.</b> Thay vì khoá, bộ máy giữ lại phiên bản trước của mỗi dòng và cho một giao dịch đọc một ảnh chụp nhất quán tính từ lúc nó bắt đầu (MVCC). Người đọc thôi chặn người ghi và người ghi thôi chặn người đọc — đổi lại tốn thêm chỗ cho các phiên bản (tempdb trong SQL Server) và có thể phát sinh xung đột cập nhật phải chạy lại. Đây là mặc định của PostgreSQL và Oracle, còn SQL Server thì bật bằng <span class="badge">ALTER DATABASE … SET READ_COMMITTED_SNAPSHOT ON</span>. <em>Ngoài giáo trình vì DBI202 chỉ dạy cô lập dựa trên khoá, trong khi phần lớn bộ máy hiện đại dựa trên phiên bản.</em></div>
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
    /* ══════════════════ ÔN THI ══════════════════ */
    {
      title: 'Exam preparation (Lab · PE · FE)|||Ôn thi (Lab · PE · FE)',
      description: 'Chuẩn bị 5 bài lab, thi thực hành 85 phút và thi trắc nghiệm: chiến lược, khung SQL, ngân hàng câu hỏi.',
      lessons: [
        {
          title: '9.1 — The 85-minute Practical Exam: an SQL playbook|||9.1 — Thi thực hành 85 phút: cẩm nang SQL',
          slug: 'dbi202-on-pe',
          type: 'VIDEO',
          description: 'Cấu trúc điểm DBI202, phân bổ thời gian, thứ tự làm bài, và 10 mẫu truy vấn bao phủ hầu hết đề.',
          content: `
<div class="ml-en">
<span class="eyebrow">Exam prep · Lesson 9.1</span>
<h2>What the PE actually asks — and the order to do it in</h2>
<p class="lead">DBI202 is graded Assignment 20% + Lab 10% (5 labs) + <b>Practical Exam 30%</b> + Progress Tests 10% + Final Exam 30% (FE must reach 4/10). The PE gives you 85 minutes and a schema, and asks for DDL, queries and usually one procedure or trigger.</p>

<h3>Time budget</h3>
<table><thead><tr><th>Minutes</th><th>Task</th><th>Note</th></tr></thead><tbody>
<tr><td>0–5</td><td>Read every question; note the marks</td><td>Queries carry more marks per minute than DDL. Do not start at question 1 by reflex.</td></tr>
<tr><td>5–20</td><td>Write the CREATE TABLE script and insert the sample data</td><td>Everything else depends on it. Parents before children.</td></tr>
<tr><td>20–60</td><td>The queries, easiest first</td><td>Run each one immediately; a query that returns rows is a query that scores.</td></tr>
<tr><td>60–80</td><td>Procedure / trigger / view</td><td>These are worth the most but cost the most — attempt them only with a working script.</td></tr>
<tr><td>80–85</td><td>Re-run the whole script top to bottom on a clean database</td><td>Markers run your file as a whole. A script that fails at line 3 scores almost nothing.</td></tr>
</tbody></table>

<h3>The ten query patterns that cover most papers</h3>
<div class="out"><b>1. Filter + sort:</b> <span class="badge">SELECT … WHERE … ORDER BY col DESC</span><br>
<b>2. Join two or three tables:</b> start from the table you must display, join outward.<br>
<b>3. Aggregate per group:</b> <span class="badge">GROUP BY did HAVING COUNT(*) &gt; 3</span> — WHERE filters rows, HAVING filters groups.<br>
<b>4. Top N:</b> <span class="badge">SELECT TOP 3 … ORDER BY gpa DESC</span> (never <span class="badge">LIMIT</span> in SQL Server).<br>
<b>5. "Has none":</b> LEFT JOIN + <span class="badge">WHERE child.key IS NULL</span> (lesson 6.2).<br>
<b>6. "Above the average":</b> <span class="badge">WHERE salary &gt; (SELECT AVG(salary) FROM Employee)</span>.<br>
<b>7. Per-group maximum:</b> join the table to <span class="badge">(SELECT did, MAX(salary) m FROM Employee GROUP BY did)</span>.<br>
<b>8. "Has all":</b> the double <span class="badge">NOT EXISTS</span>, or COUNT DISTINCT = total (lesson 6.4).<br>
<b>9. Date range:</b> <span class="badge">WHERE d &gt;= '2026-01-01' AND d &lt; '2027-01-01'</span> — never <span class="badge">YEAR(d) = 2026</span>.<br>
<b>10. Update from another table:</b> <span class="badge">UPDATE e SET … FROM Employee e JOIN … WHERE …</span> (lesson 6.5).</div>

<h3>A script skeleton that always works</h3>
<pre><span class="tok-keyword">CREATE DATABASE</span> PE_Test;
<span class="tok-keyword">GO</span>
<span class="tok-keyword">USE</span> PE_Test;
<span class="tok-keyword">GO</span>
<span class="tok-comment">-- 1. tables: parents first</span>
<span class="tok-keyword">CREATE TABLE</span> Department (did <span class="tok-type">INT PRIMARY KEY</span>, dname <span class="tok-type">NVARCHAR</span>(50) <span class="tok-keyword">NOT NULL</span>);
<span class="tok-keyword">CREATE TABLE</span> Employee (
    eid <span class="tok-type">INT PRIMARY KEY</span>, name <span class="tok-type">NVARCHAR</span>(100) <span class="tok-keyword">NOT NULL</span>,
    salary <span class="tok-type">DECIMAL</span>(18,2) <span class="tok-keyword">CHECK</span> (salary &gt; 0),
    did <span class="tok-type">INT REFERENCES</span> Department(did));
<span class="tok-keyword">GO</span>
<span class="tok-comment">-- 2. sample data</span>
<span class="tok-keyword">INSERT INTO</span> Department <span class="tok-keyword">VALUES</span> (10, N<span class="tok-string">'Sales'</span>), (20, N<span class="tok-string">'IT'</span>);
<span class="tok-keyword">INSERT INTO</span> Employee <span class="tok-keyword">VALUES</span> (1, N<span class="tok-string">'An'</span>, 1000, 10), (2, N<span class="tok-string">'Bình'</span>, 2000, 20);
<span class="tok-keyword">GO</span>
<span class="tok-comment">-- 3. Question 1: ...</span></pre>
<p>Keep every answer under a numbered comment. A marker reading 200 lines needs to find question 5 in two seconds.</p>

<div class="pitfall"><b>Three things that lose marks after the SQL is already correct:</b> (1) missing <span class="badge">N</span> before Vietnamese literals, so the marker's data shows "Nguyên Thi Hoa"; (2) forgetting <span class="badge">GO</span> between batches, so <span class="badge">CREATE PROCEDURE</span> fails with "must be the first statement in a batch"; (3) creating objects in the wrong database because you skipped <span class="badge">USE</span>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write the script so it can be run twice.</b> Start each object with <span class="badge">IF OBJECT_ID('dbo.Employee','U') IS NOT NULL DROP TABLE dbo.Employee;</span> (children first). You can then re-run the whole file after every edit instead of hunting for the last statement you changed — and the marker can too. Idempotent scripts are also exactly what migration tools require in production. <em>Beyond syllabus because nobody teaches it, yet it is the difference between a calm 85 minutes and a panicked one.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Ôn thi · Bài 9.1</span>
<h2>PE thật sự hỏi gì — và nên làm theo thứ tự nào</h2>
<p class="lead">DBI202 chấm theo Assignment 20% + Lab 10% (5 bài) + <b>Thi thực hành 30%</b> + Progress Test 10% + Thi cuối kỳ 30% (FE phải đạt 4/10). PE cho bạn 85 phút cùng một lược đồ, và yêu cầu DDL, các truy vấn, và thường là một thủ tục hoặc trigger.</p>

<h3>Phân bổ thời gian</h3>
<table><thead><tr><th>Phút</th><th>Việc</th><th>Ghi chú</th></tr></thead><tbody>
<tr><td>0–5</td><td>Đọc hết mọi câu; ghi lại điểm từng câu</td><td>Truy vấn ăn nhiều điểm trên mỗi phút hơn DDL. Đừng theo phản xạ mà bắt đầu từ câu 1.</td></tr>
<tr><td>5–20</td><td>Viết script CREATE TABLE và chèn dữ liệu mẫu</td><td>Mọi thứ khác phụ thuộc vào nó. Bảng cha trước, bảng con sau.</td></tr>
<tr><td>20–60</td><td>Các truy vấn, dễ trước</td><td>Chạy thử ngay từng câu; truy vấn trả ra dòng là truy vấn ăn điểm.</td></tr>
<tr><td>60–80</td><td>Thủ tục / trigger / view</td><td>Điểm cao nhất nhưng cũng tốn nhất — chỉ làm khi script đã chạy được.</td></tr>
<tr><td>80–85</td><td>Chạy lại toàn bộ script từ đầu tới cuối trên một cơ sở dữ liệu sạch</td><td>Người chấm chạy cả tệp của bạn. Script chết ở dòng 3 thì gần như không được điểm nào.</td></tr>
</tbody></table>

<h3>Mười khuôn truy vấn phủ hầu hết đề thi</h3>
<div class="out"><b>1. Lọc + sắp xếp:</b> <span class="badge">SELECT … WHERE … ORDER BY col DESC</span><br>
<b>2. Nối hai hoặc ba bảng:</b> bắt đầu từ bảng bạn phải hiển thị, rồi nối lan ra.<br>
<b>3. Tổng hợp theo nhóm:</b> <span class="badge">GROUP BY did HAVING COUNT(*) &gt; 3</span> — WHERE lọc dòng, HAVING lọc nhóm.<br>
<b>4. Top N:</b> <span class="badge">SELECT TOP 3 … ORDER BY gpa DESC</span> (đừng bao giờ dùng <span class="badge">LIMIT</span> trong SQL Server).<br>
<b>5. "Không có cái nào":</b> LEFT JOIN + <span class="badge">WHERE khoá_con IS NULL</span> (bài 6.2).<br>
<b>6. "Trên mức trung bình":</b> <span class="badge">WHERE salary &gt; (SELECT AVG(salary) FROM Employee)</span>.<br>
<b>7. Cực đại theo từng nhóm:</b> nối bảng với <span class="badge">(SELECT did, MAX(salary) m FROM Employee GROUP BY did)</span>.<br>
<b>8. "Có tất cả":</b> hai lớp <span class="badge">NOT EXISTS</span>, hoặc COUNT DISTINCT = tổng số (bài 6.4).<br>
<b>9. Khoảng ngày:</b> <span class="badge">WHERE d &gt;= '2026-01-01' AND d &lt; '2027-01-01'</span> — đừng viết <span class="badge">YEAR(d) = 2026</span>.<br>
<b>10. Cập nhật lấy dữ liệu từ bảng khác:</b> <span class="badge">UPDATE e SET … FROM Employee e JOIN … WHERE …</span> (bài 6.5).</div>

<h3>Bộ khung script luôn chạy được</h3>
<pre><span class="tok-keyword">CREATE DATABASE</span> PE_Test;
<span class="tok-keyword">GO</span>
<span class="tok-keyword">USE</span> PE_Test;
<span class="tok-keyword">GO</span>
<span class="tok-comment">-- 1. bảng: cha trước</span>
<span class="tok-keyword">CREATE TABLE</span> Department (did <span class="tok-type">INT PRIMARY KEY</span>, dname <span class="tok-type">NVARCHAR</span>(50) <span class="tok-keyword">NOT NULL</span>);
<span class="tok-keyword">CREATE TABLE</span> Employee (
    eid <span class="tok-type">INT PRIMARY KEY</span>, name <span class="tok-type">NVARCHAR</span>(100) <span class="tok-keyword">NOT NULL</span>,
    salary <span class="tok-type">DECIMAL</span>(18,2) <span class="tok-keyword">CHECK</span> (salary &gt; 0),
    did <span class="tok-type">INT REFERENCES</span> Department(did));
<span class="tok-keyword">GO</span>
<span class="tok-comment">-- 2. dữ liệu mẫu</span>
<span class="tok-keyword">INSERT INTO</span> Department <span class="tok-keyword">VALUES</span> (10, N<span class="tok-string">'Sales'</span>), (20, N<span class="tok-string">'IT'</span>);
<span class="tok-keyword">INSERT INTO</span> Employee <span class="tok-keyword">VALUES</span> (1, N<span class="tok-string">'An'</span>, 1000, 10), (2, N<span class="tok-string">'Bình'</span>, 2000, 20);
<span class="tok-keyword">GO</span>
<span class="tok-comment">-- 3. Câu 1: ...</span></pre>
<p>Đặt mỗi câu trả lời dưới một dòng chú thích có đánh số. Người chấm đọc 200 dòng cần tìm ra câu 5 trong hai giây.</p>

<div class="pitfall"><b>Ba thứ làm mất điểm dù SQL đã đúng:</b> (1) thiếu chữ <span class="badge">N</span> trước hằng chuỗi tiếng Việt, nên dữ liệu của người chấm hiện ra "Nguyên Thi Hoa"; (2) quên <span class="badge">GO</span> giữa các batch, khiến <span class="badge">CREATE PROCEDURE</span> báo "must be the first statement in a batch"; (3) tạo đối tượng nhầm cơ sở dữ liệu vì bỏ qua <span class="badge">USE</span>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hãy viết script sao cho chạy lại lần hai vẫn được.</b> Mở đầu mỗi đối tượng bằng <span class="badge">IF OBJECT_ID('dbo.Employee','U') IS NOT NULL DROP TABLE dbo.Employee;</span> (bảng con trước). Nhờ đó bạn chạy lại cả tệp sau mỗi lần sửa thay vì mò xem câu lệnh cuối mình vừa đổi là câu nào — và người chấm cũng vậy. Script chạy lại được cũng đúng là thứ mà công cụ di trú đòi hỏi trên môi trường thật. <em>Ngoài giáo trình vì không ai dạy điều này, nhưng nó là ranh giới giữa 85 phút bình tĩnh và 85 phút hoảng loạn.</em></div>
</div>
`,
        },
        {
          title: '9.2 — Oral question bank by CLO|||9.2 — Ngân hàng câu hỏi vấn đáp theo CLO',
          slug: 'dbi202-ngan-hang-cau-hoi',
          type: 'VIDEO',
          description: '30 câu hỏi kiến tạo trong syllabus, nhóm theo 7 CLO, kèm câu trả lời mẫu ngắn gọn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Exam prep · Lesson 9.2</span>
<h2>The syllabus questions, answered</h2>
<p class="lead">DBI202 lists 30 constructive questions across its seven CLOs; progress tests and oral checks draw directly from them. A full-mark answer is short, uses the correct term, and gives an example.</p>

<h3>CLO1 — Database concepts</h3>
<div class="out"><b>Why do we need a database rather than files?</b> Files duplicate data, cannot enforce rules, give no concurrent access control and no crash recovery. A DBMS adds a shared model, constraints, transactions and access control.<br>
<b>What is a data model?</b> A set of concepts for describing data, its relationships and its constraints — relational (tables), ER (conceptual), document, graph. It has a structure part, an operations part and a constraint part.<br>
<b>The three-level architecture?</b> External (user views) → conceptual (the logical schema) → internal (physical storage). It buys <em>data independence</em>: change the storage without touching the applications.</div>

<h3>CLO2 — Relational model &amp; algebra</h3>
<div class="out"><b>Schema versus instance?</b> The schema is the definition (columns, types, constraints); the instance is the rows currently stored. The schema rarely changes, the instance changes constantly.<br>
<b>Why do we need an algebraic query language?</b> It gives SQL a precise mathematical semantics and — crucially — algebraic equivalences that let the optimiser rewrite a query into a cheaper but equal one (lesson 2.3).<br>
<b>Constraints on relations?</b> Domain, key, referential integrity, and general constraints; in algebra a foreign key is written π<sub>A</sub>(R) ⊆ π<sub>A</sub>(S) (lesson 2.4).</div>

<h3>CLO3 &amp; CLO4 — Functional dependencies and normalization</h3>
<div class="out"><b>What is a functional dependency?</b> X → Y means two rows agreeing on X must agree on Y. It expresses a business rule, not an observation about the current data.<br>
<b>Super-key, candidate key, closure?</b> A superkey determines the whole row; a candidate key is a minimal superkey; the closure X⁺ is everything X determines, computed by the algorithm in lesson 4.2 — and X is a superkey exactly when X⁺ = R.<br>
<b>What are anomalies and how do we solve them?</b> Insert, update and delete anomalies, all caused by storing facts about different entities in one row; the fix is decomposition into higher normal forms.<br>
<b>1NF, 2NF, 3NF, BCNF in one line each?</b> 1NF: atomic values. 2NF: 1NF + no non-prime attribute depends on part of a key. 3NF: 2NF + no transitive dependency. BCNF: every determinant is a superkey.<br>
<b>The good, the bad and the ugly of decomposition?</b> Good — removes redundancy and anomalies. Bad — more joins, so reads get slower. Ugly — a decomposition that is lossy, or that loses a dependency (lesson 4.3).</div>

<h3>CLO4 — ER modelling</h3>
<div class="out"><b>Entity, entity set, attribute, relationship?</b> An entity is one real-world object; an entity set is the collection of them (becomes a table); attributes describe them; a relationship associates entities (becomes a foreign key or a table depending on cardinality).<br>
<b>Why do conceptual design at all?</b> Because it is cheap to change a diagram and expensive to change a schema with data in it; and the ERD is the artefact the customer can actually read and approve.<br>
<b>Levels of database model?</b> Conceptual (ER, technology-free) → logical (relational schema, normalised) → physical (types, indexes, storage in one specific DBMS).</div>

<h3>CLO5 — SQL</h3>
<div class="out"><b>Difference between WHERE and HAVING?</b> WHERE filters rows before grouping and cannot contain aggregates; HAVING filters groups after aggregation.<br>
<b>Logical order of evaluation?</b> FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. That is why a SELECT alias cannot be used in WHERE, but can in ORDER BY.<br>
<b>INNER versus OUTER join?</b> Inner keeps only matches; outer also keeps unmatched rows from one side (or both), padded with NULL (lesson 6.2).<br>
<b>Correlated versus non-correlated subquery?</b> A correlated one references the outer query and is conceptually evaluated per outer row; a non-correlated one runs once.</div>

<h3>CLO6 &amp; CLO7 — Programmability, indexes, transactions</h3>
<div class="out"><b>View versus table?</b> A view stores a query, not data; it simplifies, secures and decouples. It is updatable only when it maps to exactly one base row (lesson 7.2).<br>
<b>Procedure versus function?</b> Procedures may modify data and use transactions, are called with EXEC; functions return a value or a table, are side-effect free, and are called inside a query.<br>
<b>What is a trigger and when should you use one?</b> Code fired automatically on INSERT/UPDATE/DELETE, with the <em>inserted</em>/<em>deleted</em> virtual tables. Use it for rules that must hold no matter which application writes — audit trails above all. Remember it fires once per statement, not per row.<br>
<b>How does an index speed up a query, and what does it cost?</b> It is a sorted B-tree structure allowing an O(log n) seek instead of an O(n) scan; it costs disk space and slows every write, since each index must be kept sorted (lesson 8.2).<br>
<b>What are the ACID properties?</b> Atomicity, Consistency, Isolation, Durability — give one mechanism for each (log/rollback, constraints, locks or versions, write-ahead logging).<br>
<b>Name the isolation levels and what each prevents.</b> Read uncommitted (nothing), read committed (dirty reads), repeatable read (+ non-repeatable reads), serializable (+ phantoms) — lesson 8.3.</div>

<div class="pitfall"><b>Answer with the term the marker is listening for.</b> "The data would be duplicated" is worth less than "that is an <em>update anomaly</em>, caused by a <em>transitive dependency</em>, removed by <em>3NF</em>". The vocabulary is the assessed skill.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Be ready for "and when would you break this rule?".</b> The strongest answers show you know the limits: denormalise a reporting table for read speed; add an index only after measuring; accept 3NF instead of BCNF when BCNF would lose a dependency; use eventual consistency when a global system cannot afford distributed transactions (CAP). Rules plus the conditions for breaking them is what distinguishes an engineer from someone who has memorised the slides. <em>Beyond syllabus because the question list only asks for the rules.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Ôn thi · Bài 9.2</span>
<h2>Các câu hỏi trong syllabus, kèm câu trả lời</h2>
<p class="lead">DBI202 liệt kê 30 câu hỏi kiến tạo trải trên bảy CLO; các bài progress test và phần hỏi miệng rút thẳng từ đó. Câu trả lời trọn điểm thì ngắn, dùng đúng thuật ngữ, và có một ví dụ.</p>

<h3>CLO1 — Khái niệm cơ sở dữ liệu</h3>
<div class="out"><b>Vì sao cần cơ sở dữ liệu thay vì tệp?</b> Tệp làm dữ liệu trùng lặp, không áp đặt được luật, không kiểm soát được truy cập đồng thời và không phục hồi được sau sự cố. DBMS bổ sung một mô hình dùng chung, các ràng buộc, giao dịch và phân quyền.<br>
<b>Mô hình dữ liệu là gì?</b> Là một bộ khái niệm để mô tả dữ liệu, các mối liên kết và các ràng buộc của nó — quan hệ (bảng), ER (mức khái niệm), tài liệu, đồ thị. Nó gồm phần cấu trúc, phần thao tác và phần ràng buộc.<br>
<b>Kiến trúc ba mức?</b> Ngoài (các view của người dùng) → khái niệm (lược đồ lô-gic) → trong (lưu trữ vật lý). Nó mua được <em>tính độc lập dữ liệu</em>: đổi cách lưu trữ mà không đụng tới ứng dụng.</div>

<h3>CLO2 — Mô hình quan hệ &amp; đại số</h3>
<div class="out"><b>Lược đồ khác thể hiện ở chỗ nào?</b> Lược đồ là phần định nghĩa (cột, kiểu, ràng buộc); thể hiện là các dòng đang lưu tại thời điểm này. Lược đồ hiếm khi đổi, thể hiện thì đổi liên tục.<br>
<b>Vì sao cần một ngôn ngữ truy vấn đại số?</b> Nó cho SQL một ngữ nghĩa toán học chính xác và — quan trọng nhất — các tương đương đại số để bộ tối ưu viết lại truy vấn thành một truy vấn rẻ hơn nhưng tương đương (bài 2.3).<br>
<b>Ràng buộc trên quan hệ gồm những gì?</b> Miền giá trị, khoá, toàn vẹn tham chiếu, và ràng buộc tổng quát; trong đại số, khoá ngoại viết là π<sub>A</sub>(R) ⊆ π<sub>A</sub>(S) (bài 2.4).</div>

<h3>CLO3 &amp; CLO4 — Phụ thuộc hàm và chuẩn hoá</h3>
<div class="out"><b>Phụ thuộc hàm là gì?</b> X → Y nghĩa là hai dòng trùng nhau ở X thì bắt buộc trùng nhau ở Y. Nó diễn đạt một luật nghiệp vụ, chứ không phải một quan sát trên dữ liệu hiện có.<br>
<b>Siêu khoá, khoá dự tuyển, bao đóng?</b> Siêu khoá xác định được cả dòng; khoá dự tuyển là siêu khoá tối tiểu; bao đóng X⁺ là tất cả những gì X xác định, tính bằng thuật toán ở bài 4.2 — và X là siêu khoá đúng khi X⁺ = R.<br>
<b>Bất thường là gì và khắc phục ra sao?</b> Bất thường khi thêm, khi sửa và khi xoá, đều do lưu các sự việc về những thực thể khác nhau trong cùng một dòng; cách chữa là phân rã lên dạng chuẩn cao hơn.<br>
<b>1NF, 2NF, 3NF, BCNF mỗi cái một dòng?</b> 1NF: giá trị nguyên tố. 2NF: 1NF + không thuộc tính không khoá nào phụ thuộc vào một phần khoá. 3NF: 2NF + không có phụ thuộc bắc cầu. BCNF: mọi vế trái đều là siêu khoá.<br>
<b>Cái hay, cái dở và cái tệ của phân rã?</b> Hay — loại bỏ dư thừa và bất thường. Dở — nhiều phép nối hơn nên đọc chậm hơn. Tệ — phép phân rã bị mất mát, hoặc làm mất một phụ thuộc (bài 4.3).</div>

<h3>CLO4 — Mô hình ER</h3>
<div class="out"><b>Thực thể, tập thực thể, thuộc tính, liên kết?</b> Thực thể là một đối tượng có thật; tập thực thể là toàn bộ tập hợp chúng (thành một bảng); thuộc tính mô tả chúng; liên kết nối các thực thể (thành khoá ngoại hoặc một bảng, tuỳ bản số).<br>
<b>Vì sao phải thiết kế ở mức khái niệm?</b> Vì sửa một sơ đồ thì rẻ còn sửa một lược đồ đã có dữ liệu thì đắt; và ERD là thứ khách hàng thật sự đọc và duyệt được.<br>
<b>Có mấy mức mô hình?</b> Khái niệm (ER, không phụ thuộc công nghệ) → lô-gic (lược đồ quan hệ, đã chuẩn hoá) → vật lý (kiểu dữ liệu, chỉ mục, cách lưu trữ trên một DBMS cụ thể).</div>

<h3>CLO5 — SQL</h3>
<div class="out"><b>WHERE khác HAVING ở đâu?</b> WHERE lọc dòng trước khi gom nhóm và không được chứa hàm tổng hợp; HAVING lọc nhóm sau khi đã tổng hợp.<br>
<b>Thứ tự xử lý lô-gic?</b> FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. Vì thế bí danh đặt ở SELECT không dùng được trong WHERE, nhưng dùng được trong ORDER BY.<br>
<b>Nối trong khác nối ngoài?</b> Nối trong chỉ giữ các dòng khớp; nối ngoài giữ thêm các dòng không khớp của một phía (hoặc cả hai), lấp bằng NULL (bài 6.2).<br>
<b>Truy vấn con tương quan khác không tương quan?</b> Loại tương quan tham chiếu tới truy vấn ngoài và về mặt khái niệm được tính cho từng dòng ngoài; loại không tương quan chỉ chạy một lần.</div>

<h3>CLO6 &amp; CLO7 — Lập trình, chỉ mục, giao dịch</h3>
<div class="out"><b>View khác bảng ở đâu?</b> View lưu một truy vấn chứ không lưu dữ liệu; nó đơn giản hoá, bảo mật và tách rời phụ thuộc. Chỉ cập nhật được khi nó ánh xạ tới đúng một dòng gốc (bài 7.2).<br>
<b>Thủ tục khác hàm?</b> Thủ tục được phép sửa dữ liệu và dùng giao dịch, gọi bằng EXEC; hàm trả về một giá trị hoặc một bảng, không có tác dụng phụ, và được gọi ngay trong truy vấn.<br>
<b>Trigger là gì và khi nào nên dùng?</b> Là mã tự chạy khi INSERT/UPDATE/DELETE, có hai bảng ảo <em>inserted</em>/<em>deleted</em>. Dùng cho các luật phải đúng bất kể ứng dụng nào ghi — trước hết là dấu vết kiểm toán. Nhớ rằng nó chạy một lần cho mỗi câu lệnh, không phải mỗi dòng.<br>
<b>Chỉ mục làm truy vấn nhanh lên bằng cách nào, và tốn gì?</b> Nó là cấu trúc B-tree đã sắp cho phép seek O(log n) thay vì quét O(n); đổi lại tốn dung lượng đĩa và làm mọi phép ghi chậm đi, vì mỗi chỉ mục đều phải giữ đúng thứ tự (bài 8.2).<br>
<b>ACID gồm những gì?</b> Nguyên tử, Nhất quán, Cô lập, Bền vững — nêu kèm một cơ chế cho mỗi chữ (nhật ký/rollback, ràng buộc, khoá hoặc phiên bản, ghi nhật ký trước).<br>
<b>Kể tên các mức cô lập và mỗi mức ngăn được gì.</b> Read uncommitted (không ngăn gì), read committed (ngăn đọc bẩn), repeatable read (thêm: đọc không lặp lại), serializable (thêm: bóng ma) — bài 8.3.</div>

<div class="pitfall"><b>Hãy trả lời bằng đúng thuật ngữ mà người chấm đang chờ nghe.</b> "Dữ liệu sẽ bị lặp" đáng ít điểm hơn "đó là <em>bất thường khi sửa</em>, do một <em>phụ thuộc bắc cầu</em>, loại bỏ bằng <em>3NF</em>". Chính vốn từ mới là kỹ năng được đánh giá.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hãy sẵn sàng cho câu "thế khi nào thì phá luật này?".</b> Câu trả lời mạnh nhất cho thấy bạn biết giới hạn: phi chuẩn hoá một bảng báo cáo để đọc nhanh; chỉ thêm chỉ mục sau khi đã đo; chấp nhận 3NF thay vì BCNF khi BCNF làm mất một phụ thuộc; dùng nhất quán cuối cùng khi một hệ thống toàn cầu không kham nổi giao dịch phân tán (định lý CAP). Biết luật cộng với biết điều kiện phá luật là thứ phân biệt một kỹ sư với một người học thuộc slide. <em>Ngoài giáo trình vì danh sách câu hỏi chỉ hỏi phần luật.</em></div>
</div>
`,
        },
      ],
    },

    /* END-SECTIONS-MARKER */
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ gồm PE (thi thực hành) và FE (trắc nghiệm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "PE — Practical Exam|||PE — Thi thực hành",
          "slug": "dbi202-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) is a <strong>hands-on coding exam</strong>: you are given a problem or feature and must write (and usually run) working code on the machine within a time limit. It is graded on correctness, whether it runs, and good practice.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Rebuild small features from a blank file, <em>without notes</em> &mdash; copying tutorials is not enough.</li>\n<li>Practise the core pattern of this subject end-to-end until you can do it from memory.</li>\n<li>Read the requirement twice; build the smallest working version first, then extend.</li>\n<li>Test as you go; a program that runs and does 80% beats one that does not compile.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) là <strong>thi code trực tiếp</strong>: bạn được giao một bài toán/tính năng và phải viết (thường là chạy) code hoạt động trên máy trong thời gian quy định. Chấm theo tính đúng, có chạy được không, và thực hành tốt.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Dựng lại các tính năng nhỏ từ một file trống, <em>không nhìn ghi chú</em> &mdash; chép tutorial là chưa đủ.</li>\n<li>Luyện mẫu cốt lõi của môn đầu-cuối tới khi làm được từ trí nhớ.</li>\n<li>Đọc yêu cầu hai lần; dựng bản chạy được nhỏ nhất trước, rồi mở rộng.</li>\n<li>Test dọc đường; một chương trình chạy và làm được 80% hơn một chương trình không biên dịch nổi.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "dbi202-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "A primary key must be…|||Khóa chính phải…",
                "options": [
                  "nullable and repeatable|||cho phép null và lặp",
                  "unique and never null|||duy nhất và không bao giờ null",
                  "a number|||là một số",
                  "the first column|||là cột đầu tiên"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "A foreign key enforces…|||Khóa ngoại đảm bảo…",
                "options": [
                  "sorting|||sắp xếp",
                  "referential integrity (it must point to an existing row)|||toàn vẹn tham chiếu (phải trỏ tới hàng tồn tại)",
                  "encryption|||mã hóa",
                  "indexing|||đánh chỉ mục"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "The relational-algebra selection σ corresponds to SQL…|||Phép chọn σ trong đại số quan hệ tương ứng SQL…",
                "options": [
                  "SELECT list|||danh sách SELECT",
                  "WHERE",
                  "ORDER BY",
                  "JOIN"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "Projection π corresponds to…|||Phép chiếu π tương ứng…",
                "options": [
                  "choosing rows|||chọn hàng",
                  "choosing columns (the SELECT list)|||chọn cột (danh sách SELECT)",
                  "grouping|||gom nhóm",
                  "deleting|||xóa"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "A many-to-many relationship is stored using…|||Liên kết nhiều-nhiều được lưu bằng…",
                "options": [
                  "one table|||một bảng",
                  "a junction table with two foreign keys|||một bảng trung gian với hai khóa ngoại",
                  "a primary key only|||chỉ một khóa chính",
                  "no table|||không bảng nào"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "A functional dependency A → B means…|||Phụ thuộc hàm A → B nghĩa là…",
                "options": [
                  "B determines A|||B xác định A",
                  "A determines B (one A gives one B)|||A xác định B (một A cho một B)",
                  "they are unrelated|||chúng không liên quan",
                  "A and B are keys|||A và B là khóa"
                ],
                "correctIndex": 1
              }
            ]
          }
        }
      ]
    },
  ],
};
