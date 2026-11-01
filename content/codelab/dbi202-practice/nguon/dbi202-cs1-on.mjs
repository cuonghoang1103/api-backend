/**
 * DBI202 · ⭐ CS.1.3 — bài tập lịch sử & hệ sinh thái: nhận diện mô hình, sắp mốc, chọn DBMS, CAP, nghề, và dịch một câu T-SQL
 * sang SQL chạy được cả SQL Server lẫn PostgreSQL (chấm trong trình duyệt).
 */
import { mod, de, cs, q, ord, bang1, kq, kqAn, ma, tn } from './_chung.mjs';

const SV = `CREATE TABLE Student (
  id   INT NOT NULL PRIMARY KEY,
  name NVARCHAR(50) NOT NULL,
  gpa  DECIMAL(3,1) NULL
);
INSERT INTO Student (id, name, gpa) VALUES (1, N'An', 8.5), (2, N'Binh', NULL), (3, N'Chi', 9.2), (4, N'Dung', 7.0);`;

export default mod('dbi202-cs1-on', '⭐ CS.1.3 Exercises: history & ecosystem', [
  cs({
    t: 'Exercise 1 — which data model is this?', k: 'EASY', p: 5, loai: 'table',
    kn: ['hierarchical', 'network', 'relational'], tag: ['advanced', 'history'],
    en: '<p>Three short system descriptions. Name the data model and the clue that gives it away.</p>',
    vi: '<p>Ba mô tả hệ thống ngắn. Gọi tên mô hình dữ liệu và dấu hiệu tố cáo nó.</p>',
    bang: [bang1('b1', ['Description → model → clue', 'Mô tả → mô hình → dấu hiệu'],
      [{ ma: 'mt', ten: 'Description / Mô tả' },
        { ma: 'mh', ten: 'Model / Mô hình', luaChon: ['hierarchical', 'network', 'relational'] },
        { ma: 'dh', ten: 'Clue / Dấu hiệu', luaChon: ['each child has exactly one parent', 'several parents, reached by pointers', 'the query never says how to find rows'] }],
      [{ o: { mt: 'Every employee record belongs to exactly one department record; an employee never has two departments.' }, a: { mh: 'hierarchical', dh: 'each child has exactly one parent' } },
        { o: { mt: 'A course record is linked from several student records, and the program follows a direct pointer to read the next record.' }, a: { mh: 'network', dh: 'several parents, reached by pointers' } },
        { o: { mt: 'I write SELECT * FROM Enrollment WHERE studentId = 12 and never say how the DBMS finds the rows.' }, a: { mh: 'relational', dh: 'the query never says how to find rows' } }],
      ['Tree (IMS) → graph with pointers (CODASYL) → declarative tables (Codd).', 'Cây (IMS) → đồ thị con trỏ (CODASYL) → bảng khai báo (Codd).'])],
    gy: [['"Exactly one" ⇒ tree; "pointer the program follows" ⇒ network.', '"Đúng một" ⇒ cây; "con trỏ chương trình đi theo" ⇒ mạng.'], ['A SELECT that never says how ⇒ relational.', 'Một câu SELECT không nói cách làm ⇒ quan hệ.']],
    lhg: [['Calling any "belongs to" relationship relational — the clue is the access style.', 'Gọi mọi quan hệ "thuộc về" là mô hình quan hệ — dấu hiệu nằm ở cách truy cập.'], ['Calling the many-parent case hierarchical.', 'Gọi trường hợp nhiều cha là phân cấp.']],
    tn: [tn('declarative query', 'truy vấn khai báo')],
  }),
  cs({
    t: 'Exercise 2 — put the timeline in order', k: 'EASY', p: 5, loai: 'order',
    kn: ['timeline'], tag: ['advanced', 'history'],
    en: '<p>Eight shuffled milestones. Put them in chronological order.</p>', vi: '<p>Tám mốc bị xáo. Sắp theo thứ tự thời gian.</p>',
    cau: [ord('o1', ['Oldest → newest', 'Cũ nhất → mới nhất'], ['IBM IMS goes live', 'CODASYL DBTG report', 'Codd\'s relational-model paper', 'System R starts at IBM', 'Oracle v2 ships', 'SQL Server 1.0', 'MySQL released', 'PostgreSQL renamed from Postgres95'],
      ['1968 · 1969 · 1970 · 1974 · 1979 · 1989 · 1995 · 1996. System R came first as research; Oracle shipped first as a product.', '1968 · 1969 · 1970 · 1974 · 1979 · 1989 · 1995 · 1996. System R đi trước dưới dạng nghiên cứu; Oracle bán trước dưới dạng sản phẩm.'])],
    gy: [['Two pre-relational models first, then Codd.', 'Hai mô hình trước quan hệ đi trước, rồi tới Codd.'], ['The three engines you know arrive in the order SQL Server, MySQL, PostgreSQL.', 'Ba hệ quen thuộc đến theo thứ tự SQL Server, MySQL, PostgreSQL.']],
    lhg: [['Putting Oracle before System R.', 'Đặt Oracle trước System R.'], ['Putting PostgreSQL before MySQL because Postgres started earlier.', 'Đặt PostgreSQL trước MySQL vì Postgres khởi đầu sớm hơn.']],
  }),
  cs({
    t: 'Exercise 3 — pick the right DBMS, and the right job title', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['choosing a DBMS', 'database careers'], tag: ['advanced', 'ecosystem'],
    en: '<p>Two small tables: choose an engine for each scenario, then match each job-ad snippet to a role.</p>',
    vi: '<p>Hai bảng nhỏ: chọn hệ cho từng tình huống, rồi ghép mỗi đoạn tin tuyển dụng với một vai trò.</p>',
    bang: [
      bang1('b1', ['Scenario → DBMS', 'Tình huống → DBMS'],
        [{ ma: 'th', ten: 'Scenario / Tình huống' }, { ma: 'hqt', ten: 'DBMS', luaChon: ['PostgreSQL', 'Oracle', 'MySQL', 'SQL Server'] }],
        [{ o: { th: 'A student note-taking app with Prisma on a $5/month VPS' }, a: { hqt: 'PostgreSQL' } },
          { o: { th: 'A new module for a bank ledger that has run on Oracle for 30 years' }, a: { hqt: 'Oracle' } },
          { o: { th: 'A large WordPress news site: millions of reads, few writes' }, a: { hqt: 'MySQL' } },
          { o: { th: 'An HR system for a company on Windows Server, .NET, Active Directory and SSRS reports' }, a: { hqt: 'SQL Server' } }],
        ['Free and Prisma-friendly; match the existing engine; WordPress is built on MySQL; stay inside the Microsoft stack.', 'Miễn phí và hợp Prisma; theo hệ đang chạy; WordPress xây trên MySQL; ở lại hệ sinh thái Microsoft.']),
      bang1('b2', ['Job ad → role', 'Tin tuyển dụng → vai trò'],
        [{ ma: 'tin', ten: 'Job ad / Tin' }, { ma: 'vt', ten: 'Role / Vai trò', luaChon: ['DBA', 'backend developer', 'data engineer'] }],
        [{ o: { tin: 'Own backup/restore schedules, tune slow queries, manage permissions on our SQL Server fleet, on-call 24/7.' }, a: { vt: 'DBA' } },
          { o: { tin: 'Design the Prisma schema for a new feature, write the REST endpoints and the SQL behind them.' }, a: { vt: 'backend developer' } },
          { o: { tin: 'Build nightly pipelines moving data from production PostgreSQL into the analytics warehouse.' }, a: { vt: 'data engineer' } }],
        ['Operations of one engine ⇒ DBA; feature code ⇒ backend; moving data between systems ⇒ data engineer.', 'Vận hành một hệ ⇒ DBA; viết tính năng ⇒ backend; chuyển dữ liệu giữa các hệ ⇒ kỹ sư dữ liệu.']),
    ],
    gy: [['An existing engine with decades of data is a strong reason by itself.', 'Một hệ đang chạy với hàng chục năm dữ liệu tự nó đã là lý do mạnh.'], ['A DBA runs one engine; a data engineer moves data between systems.', 'DBA vận hành một hệ; kỹ sư dữ liệu chuyển dữ liệu giữa các hệ.']],
    lhg: [['Choosing by "which is best" instead of by the scenario\'s constraints.', 'Chọn theo "cái nào tốt nhất" thay vì theo ràng buộc của tình huống.'], ['Calling the pipeline job a DBA role.', 'Gọi việc làm đường ống dữ liệu là vai trò DBA.']],
    tn: [tn('data warehouse', 'kho dữ liệu phân tích')],
  }),
  cs({
    t: 'Exercise 4 — CAP in a global chat app, and the GitLab lesson', k: 'MEDIUM', p: 6,
    kn: ['CAP', 'eventual consistency', 'restore test'], tag: ['advanced', 'nosql'],
    en: '<p>A global chat app must stay writable when its US and EU data centres lose their link, and a message may reach the EU a second later than the US.</p>',
    vi: '<p>Một app chat toàn cầu phải ghi được khi trung tâm dữ liệu Mỹ và châu Âu mất kết nối, và tin nhắn có thể tới châu Âu chậm hơn Mỹ một giây.</p>',
    cau: [
      q('c1', ['Which store fits the message history, in CAP terms?', 'Kho nào hợp cho lịch sử tin nhắn, theo CAP?'], ['an eventually consistent store: it chooses A + P', 'a strict RDBMS spanning both sites: it chooses C + P', 'any store, CAP does not apply across continents', 'a single server, which removes the partition'], ['"Must stay writable during a partition" picks availability; "a second later" accepts eventual consistency.', '"Phải ghi được khi chia cắt" là chọn sẵn sàng; "chậm một giây" là chấp nhận nhất quán cuối cùng.']),
      q('c2', ['A strict RDBMS transaction spanning both data centres would, during the partition,…', 'Một giao dịch RDBMS chặt trải hai trung tâm, trong lúc chia cắt, sẽ…'], ['block or refuse the writes', 'accept writes and merge them later', 'silently drop half the messages', 'turn into two independent databases'], ['Keeping consistency means waiting for the other side — exactly what the requirement forbids.', 'Giữ nhất quán nghĩa là chờ phía bên kia — đúng điều yêu cầu cấm.']),
      q('c3', ['GitLab 2017 had five backup mechanisms and still lost six hours. The lesson is…', 'GitLab 2017 có năm cơ chế sao lưu mà vẫn mất sáu giờ. Bài học là…'], ['a backup counts only once a restore is tested', 'five mechanisms is too many to maintain well', 'deleting a directory is always unrecoverable', 'PostgreSQL needs a commercial backup tool'], ['All five were silently broken; nobody owned restore testing.', 'Cả năm cơ chế đều hỏng âm thầm; không ai phụ trách thử khôi phục.']),
    ],
    gy: [['Read the requirement: "stay writable" = availability.', 'Đọc yêu cầu: "vẫn ghi được" = sẵn sàng.'], ['"A second later" = eventual consistency is accepted.', '"Chậm một giây" = chấp nhận nhất quán cuối cùng.']],
    lhg: [['"NoSQL good, RDBMS bad" — CAP is only about distributed systems.', '"NoSQL tốt, RDBMS dở" — CAP chỉ nói về hệ phân tán.'], ['Blaming GitLab\'s outage only on the mistyped command.', 'Đổ sự cố GitLab chỉ cho lệnh gõ nhầm.']],
    tn: [tn('eventual consistency', 'nhất quán cuối cùng')],
  }),
  de({
    csdl: SV, tenCsdl: 'Student', ld: { en: '<p><code>Student(id, name, gpa NULL)</code> — 4 rows, Binh has no GPA yet.</p>', vi: '<p><code>Student(id, name, gpa NULL)</code> — 4 dòng, Binh chưa có điểm.</p>' },
    t: 'Exercise 5 — rewrite a T-SQL query so it runs on SQL Server AND PostgreSQL', k: 'MEDIUM', p: 10,
    kn: ['portable SQL', 'COALESCE', 'CONCAT', 'OFFSET … FETCH'], tag: ['advanced', 'dialect', 'select'],
    en: `<p>This query only runs on SQL Server:</p><pre>SELECT TOP 3 name, ISNULL(gpa, 0) AS gpa, N'Student: ' + name AS label
FROM Student
ORDER BY gpa DESC;</pre><p>Rewrite it so the <b>same text</b> runs on both engines and returns the 3 best students: <code>name</code>, <code>gpa</code> (0 when missing), <code>label</code> = <code>Student: </code> + name, best GPA first. A student without a GPA counts as 0 — on both engines, whatever their default NULL ordering.</p>`,
    vi: `<p>Câu này chỉ chạy trên SQL Server:</p><pre>SELECT TOP 3 name, ISNULL(gpa, 0) AS gpa, N'Student: ' + name AS label
FROM Student
ORDER BY gpa DESC;</pre><p>Viết lại để <b>cùng một đoạn chữ</b> chạy được trên cả hai hệ và trả 3 sinh viên điểm cao nhất: <code>name</code>, <code>gpa</code> (0 khi thiếu), <code>label</code> = <code>Student: </code> + tên, điểm cao trước. Sinh viên chưa có điểm tính là 0 — trên cả hai hệ, bất kể thứ tự NULL mặc định của chúng.</p>`,
    yc: [['No TOP, ISNULL or + on strings: use COALESCE, CONCAT and OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY.', 'Không TOP, ISNULL hay + trên chuỗi: dùng COALESCE, CONCAT và OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY.'], ['Order by COALESCE(gpa, 0) DESC so NULL handling is the same everywhere.', 'Sắp theo COALESCE(gpa, 0) DESC để xử lý NULL giống nhau ở mọi nơi.']],
    giai: `SELECT name,
       COALESCE(gpa, 0)            AS gpa,     -- ISNULL → COALESCE (standard, both engines)
       CONCAT('Student: ', name)   AS label    -- + → CONCAT (both engines)
FROM Student
ORDER BY COALESCE(gpa, 0) DESC                 -- same NULL treatment on both engines
OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY;          -- TOP 3 → standard OFFSET … FETCH`,
    kiem: [
      kq(['The three best students, best first', 'Ba sinh viên điểm cao nhất, cao trước'], { thuTu: true }),
      kqAn(['A new top student and a second one without GPA', 'Thêm người điểm cao nhất và một người nữa chưa có điểm'], "INSERT INTO Student VALUES (5, N'Em', 9.6), (6, N'Giang', NULL)", { thuTu: true }),
      kqAn(['Only two students have a GPA', 'Chỉ hai sinh viên có điểm'], "DELETE FROM Student WHERE id IN (1, 4)", { thuTu: true }),
      ma(['Uses OFFSET … FETCH instead of TOP', 'Dùng OFFSET … FETCH thay cho TOP'], '\\bFETCH\\s+(NEXT|FIRST)\\b'),
    ],
    sai: [
      `SELECT name, COALESCE(gpa, 0) AS gpa, CONCAT('Student: ', name) AS label FROM Student ORDER BY COALESCE(gpa, 0) DESC OFFSET 0 ROWS FETCH NEXT 4 ROWS ONLY;`,
      `SELECT name, COALESCE(gpa, 0) AS gpa, CONCAT('Student: ', name) AS label FROM Student ORDER BY COALESCE(gpa, 0) OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY;`,
      `SELECT name, gpa, CONCAT('Student: ', name) AS label FROM Student ORDER BY COALESCE(gpa, 0) DESC OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY;`,
      `SELECT name, COALESCE(gpa, 0) AS gpa, CONCAT('Student: ', name) AS label FROM Student ORDER BY COALESCE(gpa, 0) DESC OFFSET 1 ROWS FETCH NEXT 3 ROWS ONLY;`,
    ],
    gy: [['COALESCE, CONCAT and OFFSET … FETCH are standard and exist on both engines.', 'COALESCE, CONCAT và OFFSET … FETCH là chuẩn và có trên cả hai hệ.'], ['OFFSET … FETCH needs an ORDER BY.', 'OFFSET … FETCH cần ORDER BY.']],
    lhg: [['ORDER BY gpa DESC: PostgreSQL puts NULL first on DESC, SQL Server last — the top 3 differ.', 'ORDER BY gpa DESC: PostgreSQL xếp NULL đầu khi DESC, SQL Server xếp cuối — top 3 khác nhau.'], ['Leaving gpa unwrapped in the SELECT — a missing GPA prints NULL, not 0.', 'Để gpa trần trong SELECT — thiếu điểm in NULL chứ không phải 0.']],
    gt: ['<p>Four changes: TOP → OFFSET/FETCH (or LIMIT on PostgreSQL only), ISNULL → COALESCE, + → CONCAT (or || on PostgreSQL), and an explicit NULL rule in ORDER BY. The PE asks for SQL Server, but at work portable SQL saves a rewrite.</p>', '<p>Bốn chỗ đổi: TOP → OFFSET/FETCH (hoặc LIMIT chỉ PostgreSQL), ISNULL → COALESCE, + → CONCAT (hoặc || trên PostgreSQL), và luật NULL tường minh trong ORDER BY. PE hỏi SQL Server, nhưng đi làm thì SQL chạy được hai hệ đỡ một lần viết lại.</p>'],
    tn: [tn('portable SQL', 'SQL chạy được nhiều hệ'), tn('NULL ordering', 'thứ tự của NULL')],
  }),
]);
