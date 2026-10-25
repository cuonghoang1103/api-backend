/**
 * DBI202 · Chữa trọn đề FE (trắc nghiệm) — mục VIDEO tự thêm, NẰM NGOÀI bộ sinh flm-nguon/DBI202/gen (luật chủ kênh 25/10/2026:
 * ~/Documents/video-bai-giang/LUAT-VIDEO-CHUA-DE.md — PE và FE tách mục; mỗi đề = MỘT bài VIDEO dài, slug `<môn>-peN|feN-<kỳ>-chua-tron-de`).
 * Bài chỉ có mô tả + link Phòng thi + mục lục từng câu (chủ đề · chương). Lời giải đầy đủ nằm trong Phòng thi (content/exams/DBI202-*.mjs).
 * Video gắn sau qua content/course-videos/introduction-to-databases.mjs theo slug.
 * Hai mục chữa đề đặt CUỐI danh sách section của DBI202.mjs (sau "Thi cuối kỳ") để không lệch thứ tự chương.
 */

const COURSE = '/courses/introduction-to-databases/learn?lessonSlug=';
const BAI = {
  'dbi202-csdl-dbms': [1, '1.1 Databases & DBMS', '1.1 CSDL & DBMS'],
  'dbi202-mo-hinh-quan-he': [2, '2.1 Relational model', '2.1 Mô hình quan hệ'],
  'dbi202-dai-so-quan-he': [2, '2.2 Relational algebra', '2.2 Đại số quan hệ'],
  'dbi202-dai-so-nang-cao': [2, '2.3 Joins & division in algebra', '2.3 Phép nối & phép chia'],
  'dbi202-rang-buoc-quan-he': [2, '2.4 Constraints on relations', '2.4 Ràng buộc trên quan hệ'],
  'dbi202-er-model': [3, '3.1 Entities & relationships', '3.1 Thực thể & liên kết'],
  'dbi202-er-nang-cao': [3, '3.2 Weak entities & multivalued attributes', '3.2 Thực thể yếu & thuộc tính đa trị'],
  'dbi202-er-subclass': [3, '3.3 Subclasses (ISA)', '3.3 Lớp con (ISA)'],
  'dbi202-er-to-relation': [3, '3.4 ERD → relational schema', '3.4 ERD → lược đồ quan hệ'],
  'dbi202-chuan-hoa': [4, '4.1 FDs & normal forms', '4.1 Phụ thuộc hàm & chuẩn'],
  'dbi202-bao-dong-tim-khoa': [4, '4.2 Closures & keys', '4.2 Bao đóng & tìm khoá'],
  'dbi202-phan-ra': [4, '4.3 Decomposition', '4.3 Phân rã'],
  'dbi202-sql-ddl': [5, '5.1 CREATE TABLE & keys', '5.1 CREATE TABLE & khoá'],
  'dbi202-kieu-du-lieu': [5, '5.2 Data types', '5.2 Kiểu dữ liệu'],
  'dbi202-rang-buoc-sql': [5, '5.3 SQL constraints & ALTER TABLE', '5.3 Ràng buộc SQL & ALTER TABLE'],
  'dbi202-select-join': [6, '6.1 SELECT, WHERE, JOIN', '6.1 SELECT, WHERE, JOIN'],
  'dbi202-join-day-du': [6, '6.2 Every join', '6.2 Mọi phép JOIN'],
  'dbi202-group-by-subquery': [6, '6.3 GROUP BY & aggregates', '6.3 GROUP BY & hàm tổng hợp'],
  'dbi202-truy-van-long': [6, '6.4 Nested queries & NULL logic', '6.4 Truy vấn lồng & lô-gic NULL'],
  'dbi202-cap-nhat-du-lieu': [6, '6.5 INSERT, UPDATE, DELETE', '6.5 INSERT, UPDATE, DELETE'],
  'dbi202-view': [7, '7.2 Views', '7.2 View'],
  'dbi202-proc-function': [7, '7.3 Procedures & functions', '7.3 Procedure & function'],
  'dbi202-trigger-cursor': [7, '7.4 Triggers & cursors', '7.4 Trigger & cursor'],
  'dbi202-chi-muc': [8, '8.1 Indexes', '8.1 Chỉ mục'],
  'dbi202-execution-plan': [8, '8.2 Clustered vs nonclustered', '8.2 Gom cụm vs không gom cụm'],
  'dbi202-transaction-acid': [8, '8.3 Transactions & ACID', '8.3 Giao dịch & ACID'],
};
const link = (slug, vi) => '<a href="' + COURSE + slug + '">' + BAI[slug][vi ? 2 : 1] + '</a>';
const bang = (rows, vi) =>
  '<table><thead><tr><th>' + (vi ? 'Câu' : 'Q') + '</th><th>' + (vi ? 'Chủ đề' : 'Topic') + '</th><th>' + (vi ? 'Chương · bài liên quan' : 'Chapter · related lesson') + '</th></tr></thead><tbody>' +
  rows.map(([n, en, viT, slug]) => '<tr><td>' + n + '</td><td>' + (vi ? viT : en) + '</td><td>' + (vi ? 'Ch.' : 'Ch ') + BAI[slug][0] + ' · ' + link(slug, vi) + '</td></tr>').join('') +
  '</tbody></table>';
const theoChuong = (rows, vi) => {
  const c = {};
  for (const r of rows) { const k = BAI[r[3]][0]; c[k] = (c[k] || 0) + 1; }
  return Object.keys(c).sort((a, b) => a - b).map((k) => (vi ? 'Chương ' : 'Chapter ') + k + ': ' + c[k]).join(' · ');
};

const bai = ({ slug, titleEn, titleVi, desc, ky, exam, examVi, leadEn, leadVi, rows }) => ({
  title: titleEn + '|||' + titleVi,
  slug,
  type: 'VIDEO',
  description: desc,
  content: `
<div class="ml-en">
<span class="eyebrow">FE review · real exam, added by this site</span>
<h2>${titleEn}</h2>
<p class="lead">${leadEn}</p>
<div class="callout">Take it first, timed, in the <a href="/exam?course=DBI202&amp;kind=FE">Exam room</a> → DBI202 → <b>${exam}</b>. Every question there has the original paper image and a bilingual model answer; this lesson is the video walkthrough.</div>
<h3>Questions at a glance</h3>
${bang(rows, false)}
<p><b>By chapter:</b> ${theoChuong(rows, false)}</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chữa đề FE · đề thật, phần web tự thêm</span>
<h2>${titleVi}</h2>
<p class="lead">${leadVi}</p>
<div class="callout">Làm thử trước, bấm giờ, trong <a href="/exam?course=DBI202&amp;kind=FE">Phòng thi</a> → DBI202 → <b>${examVi}</b>. Mỗi câu ở đó có ảnh đề gốc và lời giải mẫu song ngữ; bài này là video chữa đề.</div>
<h3>Mục lục từng câu</h3>
${bang(rows, true)}
<p><b>Theo chương:</b> ${theoChuong(rows, true)}</p>
</div>
`,
});

const lessons = [
  bai({
    slug: 'dbi202-fe31-sp26-chua-tron-de',
    titleEn: 'FE review · Exam 31 (SP26 FE) — all 50 questions',
    titleVi: 'Chữa trọn đề FE31 (SP26 FE) · 50 câu',
    desc: 'Chữa trọn đề thi cuối kỳ DBI202 số 31 (SP26 FE): 50 câu trắc nghiệm đúng thứ tự Phòng thi — ảnh đề gốc, dịch tiếng Việt, từ vựng, vì sao từng đáp án sai/đúng, nhãn chương.',
    exam: 'Final Exam Đề 31 (SP26-FE)', examVi: 'Đề 31 — Thi cuối kỳ (SP26-FE)',
    leadEn: 'A full walkthrough of the real DBI202 SP26 final exam (SP26 FE): 50 multiple-choice questions, 60 minutes, marked out of 10 (the FE must reach 4/10). Questions go in exam-room order; each one shows the original question image, a Vietnamese translation, key vocabulary and why every option is right or wrong.',
    leadVi: 'Chữa trọn đề thi cuối kỳ DBI202 thật (SP26 FE): 50 câu trắc nghiệm, 60 phút, thang 10 (FE phải đạt ≥ 4/10). Đi đúng thứ tự Phòng thi; mỗi câu: ảnh đề gốc, dịch tiếng Việt, từ vựng cần nhớ, vì sao từng đáp án sai/đúng.',
    rows: [[1,"Data integrity in a DBMS","Toàn vẹn dữ liệu trong DBMS","dbi202-csdl-dbms"],[2,"ACID: Isolation property","ACID: tính cô lập (Isolation)","dbi202-transaction-acid"],[3,"Role of the database administrator","Vai trò người quản trị CSDL","dbi202-csdl-dbms"],[4,"Rename operation syntax","Cú pháp phép đổi tên (rename)","dbi202-dai-so-quan-he"],[5,"Definition of a database","Định nghĩa cơ sở dữ liệu","dbi202-csdl-dbms"],[6,"Rows of a relation","Tên gọi các dòng của quan hệ","dbi202-mo-hinh-quan-he"],[7,"Operations outside relational algebra","Phép toán không thuộc đại số quan hệ","dbi202-dai-so-quan-he"],[8,"Basic relational algebra operators","Các phép toán cơ bản của đại số quan hệ","dbi202-dai-so-quan-he"],[9,"Defining a table schema in SQL","Định nghĩa lược đồ bảng trong SQL","dbi202-sql-ddl"],[10,"Operator that removes attributes","Phép toán bỏ bớt thuộc tính","dbi202-dai-so-quan-he"],[11,"Purposes of the rename operation","Mục đích của phép đổi tên","dbi202-dai-so-quan-he"],[12,"Main requirement of 1NF","Yêu cầu chính của 1NF","dbi202-chuan-hoa"],[13,"Trivial vs non-trivial FD","FD hiển nhiên và không hiển nhiên","dbi202-chuan-hoa"],[14,"Candidate key as minimal super key","Khoá ứng viên là siêu khoá tối thiểu","dbi202-mo-hinh-quan-he"],[15,"Closure {A}+ of R(A,B,C,D)","Bao đóng {A}+ của R(A,B,C,D)","dbi202-bao-dong-tim-khoa"],[16,"Full dependency on a composite key","Phụ thuộc đầy đủ vào khoá phức hợp","dbi202-chuan-hoa"],[17,"BCNF and lower normal forms","BCNF và các dạng chuẩn thấp hơn","dbi202-chuan-hoa"],[18,"Multi-valued field and normal forms","Trường đa trị vi phạm dạng chuẩn","dbi202-chuan-hoa"],[19,"Benefits of normalization","Lợi ích của chuẩn hoá","dbi202-chuan-hoa"],[20,"Normal form removing transitive dependency","Dạng chuẩn loại phụ thuộc bắc cầu","dbi202-chuan-hoa"],[21,"Weak entity set vs owner multiplicity","Bản số giữa thực thể yếu và chủ sở hữu","dbi202-er-nang-cao"],[22,"Attribute drawn as dashed oval","Thuộc tính vẽ bằng oval nét đứt","dbi202-er-model"],[23,"What an E/R diagram shows","E/R diagram biểu diễn những gì","dbi202-er-model"],[24,"Entity definition in ERD","Định nghĩa thực thể trong ERD","dbi202-er-model"],[25,"Order of rows and columns in a relation","Thứ tự dòng và cột trong quan hệ","dbi202-mo-hinh-quan-he"],[26,"Key of a weak entity set","Khoá của tập thực thể yếu","dbi202-er-nang-cao"],[27,"What an E-R diagram expresses","E-R diagram diễn tả quan hệ gì","dbi202-er-model"],[28,"Mapping a 1-M relationship","Chuyển liên kết 1-N sang quan hệ","dbi202-er-to-relation"],[29,"Referential integrity rule for foreign keys","Quy tắc toàn vẹn tham chiếu của khoá ngoại","dbi202-rang-buoc-quan-he"],[30,"Filtering groups after GROUP BY","Lọc nhóm sau GROUP BY","dbi202-group-by-subquery"],[31,"Modifying table structure in SQL","Sửa cấu trúc bảng trong SQL","dbi202-sql-ddl"],[32,"Foreign key facts: which is false","Đặc điểm khoá ngoại: phát biểu sai","dbi202-rang-buoc-sql"],[33,"Where ORDER BY can be used","ORDER BY dùng được ở đâu","dbi202-select-join"],[34,"Join keeping all left-table rows","Phép nối giữ mọi dòng bảng trái","dbi202-join-day-du"],[35,"How many relations DELETE acts on","DELETE tác động lên mấy quan hệ","dbi202-cap-nhat-du-lieu"],[36,"Keyword to filter grouped results","Từ khoá lọc kết quả đã gom nhóm","dbi202-group-by-subquery"],[37,"Behaviour of the DELETE command","Đặc điểm lệnh DELETE","dbi202-cap-nhat-du-lieu"],[38,"Why the engine uses indexes","Vì sao bộ máy dùng chỉ mục","dbi202-chi-muc"],[39,"Uncontrolled concurrency problems","Sự cố khi tương tranh không kiểm soát","dbi202-transaction-acid"],[40,"Most restrictive isolation level","Mức cô lập chặt nhất","dbi202-transaction-acid"],[41,"Atomicity violations in banking","Vi phạm tính nguyên tố trong ngân hàng","dbi202-transaction-acid"],[42,"Choosing an updatable view definition","Chọn câu lệnh tạo view cập nhật được","dbi202-view"],[43,"What a view is","View là gì","dbi202-view"],[44,"Stored procedure capabilities","Khả năng của stored procedure","dbi202-proc-function"],[45,"Indexes created by constraints","Chỉ mục tự tạo từ ràng buộc","dbi202-chi-muc"],[46,"Reading a scalar function GetLaptopPrice","Đọc hàm vô hướng GetLaptopPrice","dbi202-proc-function"],[47,"What an SQL cursor is","Cursor trong SQL là gì","dbi202-trigger-cursor"],[48,"Kinds of stored procedure parameters","Các loại tham số của stored procedure","dbi202-proc-function"],[49,"Cursor FETCH options","Các kiểu FETCH của cursor","dbi202-trigger-cursor"],[50,"Files created with a new database","Các tệp tạo kèm CSDL mới","dbi202-csdl-dbms"]],
  }),
  bai({
    slug: 'dbi202-fe32-sp26-chua-tron-de',
    titleEn: 'FE review · Exam 32 (SP26 RE) — all 50 questions',
    titleVi: 'Chữa trọn đề FE32 (SP26 RE) · 50 câu',
    desc: 'Chữa trọn đề thi cuối kỳ DBI202 số 32 (SP26 RE): 50 câu trắc nghiệm đúng thứ tự Phòng thi — ảnh đề gốc, dịch tiếng Việt, từ vựng, vì sao từng đáp án sai/đúng, nhãn chương.',
    exam: 'Final Exam Đề 32 (SP26-RE)', examVi: 'Đề 32 — Thi cuối kỳ (SP26-RE)',
    leadEn: 'A full walkthrough of the real DBI202 SP26 re-take exam (SP26 RE): 50 multiple-choice questions, 60 minutes, marked out of 10 (the FE must reach 4/10). Questions go in exam-room order; each one shows the original question image, a Vietnamese translation, key vocabulary and why every option is right or wrong.',
    leadVi: 'Chữa trọn đề thi cuối kỳ DBI202 thật (SP26 RE): 50 câu trắc nghiệm, 60 phút, thang 10 (FE phải đạt ≥ 4/10). Đi đúng thứ tự Phòng thi; mỗi câu: ảnh đề gốc, dịch tiếng Việt, từ vựng cần nhớ, vì sao từng đáp án sai/đúng.',
    rows: [[1,"Query compiler stages: choosing the plan","Các khâu của bộ biên dịch truy vấn: chọn kế hoạch","dbi202-csdl-dbms"],[2,"Data vs information","Dữ liệu và thông tin","dbi202-csdl-dbms"],[3,"Database characteristics: concurrent access","Đặc điểm CSDL: truy cập đồng thời","dbi202-csdl-dbms"],[4,"Network data model drawbacks","Nhược điểm mô hình mạng","dbi202-csdl-dbms"],[5,"Definition of a database","Định nghĩa cơ sở dữ liệu","dbi202-csdl-dbms"],[6,"Network data model properties","Đặc điểm mô hình mạng","dbi202-csdl-dbms"],[7,"Query compiler stages: building the parse tree","Các khâu của bộ biên dịch truy vấn: dựng cây","dbi202-csdl-dbms"],[8,"Components of a data model","Ba thành phần của mô hình dữ liệu","dbi202-csdl-dbms"],[9,"Rows of a relation","Tên gọi các dòng của quan hệ","dbi202-mo-hinh-quan-he"],[10,"Finding the key of R(A,B,C,D)","Tìm khoá của R(A,B,C,D)","dbi202-bao-dong-tim-khoa"],[11,"Referential integrity definition","Định nghĩa toàn vẹn tham chiếu","dbi202-rang-buoc-quan-he"],[12,"Reading an FD from table data","Nhận ra FD từ dữ liệu bảng","dbi202-chuan-hoa"],[13,"Network model relationship type","Kiểu liên kết trong mô hình mạng","dbi202-csdl-dbms"],[14,"Tuples common to R and S","Phép lấy bộ chung của R và S","dbi202-dai-so-quan-he"],[15,"Why identify candidate keys","Vì sao cần xác định khoá ứng viên","dbi202-mo-hinh-quan-he"],[16,"Keys of R(A,B,C,D,E)","Tìm khoá của R(A,B,C,D,E)","dbi202-bao-dong-tim-khoa"],[17,"Key of R(X,Y,Z,W)","Tìm khoá của R(X,Y,Z,W)","dbi202-bao-dong-tim-khoa"],[18,"Equivalent set of FDs","Tập FD tương đương","dbi202-bao-dong-tim-khoa"],[19,"Attribute naming conflicts in transformation","Xung đột tên thuộc tính khi chuyển lược đồ","dbi202-er-to-relation"],[20,"Conditions for 3NF","Điều kiện của dạng chuẩn 3","dbi202-chuan-hoa"],[21,"Highest normal form of R(ABCD)","Dạng chuẩn cao nhất của R(ABCD)","dbi202-chuan-hoa"],[22,"When to denormalize","Khi nào nên phi chuẩn hoá","dbi202-chuan-hoa"],[23,"Line connecting two entities in ERD","Đường nối hai thực thể trong ERD","dbi202-er-model"],[24,"Role of a primary key in ERD","Vai trò khoá chính trong ERD","dbi202-er-model"],[25,"Special movie genres and Movie","Thể loại phim đặc biệt và Movie","dbi202-er-subclass"],[26,"What an entity is","Thực thể là gì","dbi202-er-model"],[27,"One-to-many relationship meaning","Ý nghĩa liên kết một-nhiều","dbi202-er-model"],[28,"Weak entity set notation","Ký hiệu tập thực thể yếu","dbi202-er-nang-cao"],[29,"One instance related to many instances","Một thể hiện liên kết nhiều thể hiện","dbi202-er-model"],[30,"Derived attributes in ERD-to-relation mapping","Thuộc tính dẫn xuất khi chuyển ERD sang quan hệ","dbi202-er-to-relation"],[31,"Three-valued logic with AND","Logic ba trị với AND","dbi202-truy-van-long"],[32,"Which commands are not DDL","Lệnh nào không thuộc DDL","dbi202-sql-ddl"],[33,"Foreign key constraint facts","Đặc điểm ràng buộc khoá ngoại","dbi202-rang-buoc-sql"],[34,"Customers with no orders: anti-join","Khách chưa mua hàng: anti-join","dbi202-truy-van-long"],[35,"Result of CROSS JOIN","Kết quả của CROSS JOIN","dbi202-join-day-du"],[36,"Reading a NOT IN subquery","Đọc truy vấn con NOT IN","dbi202-truy-van-long"],[37,"Aggregates and NULL values","Hàm gộp và giá trị NULL","dbi202-group-by-subquery"],[38,"UPDATE with a WHERE condition","UPDATE có điều kiện WHERE","dbi202-cap-nhat-du-lieu"],[39,"Cost of too many indexes","Cái giá của quá nhiều chỉ mục","dbi202-chi-muc"],[40,"Constraint forcing a value","Ràng buộc bắt buộc có giá trị","dbi202-rang-buoc-sql"],[41,"Transaction methods: begin, save, cancel","Các phương thức giao dịch: bắt đầu, lưu, huỷ","dbi202-transaction-acid"],[42,"Purpose of a transaction","Mục đích của giao dịch","dbi202-transaction-acid"],[43,"Virtual table built from other tables","Bảng ảo dựng từ bảng khác","dbi202-view"],[44,"General constraint forms: assertion","Dạng ràng buộc tổng quát: assertion","dbi202-rang-buoc-sql"],[45,"T-SQL local variable rules","Quy tắc biến cục bộ T-SQL","dbi202-proc-function"],[46,"How triggers are invoked","Trigger được kích hoạt thế nào","dbi202-trigger-cursor"],[47,"User-defined function returning one value","Hàm người dùng trả về một giá trị","dbi202-proc-function"],[48,"Cursor: which statement is false","Cursor: phát biểu không đúng","dbi202-trigger-cursor"],[49,"Main advantage of stored procedures","Lợi ích chính của stored procedure","dbi202-proc-function"],[50,"Declaring local variables","Khai báo biến cục bộ","dbi202-proc-function"]],
  }),
  bai({
    slug: 'dbi202-fe3-fa25-chua-tron-de',
    titleEn: 'FE review · Exam 3 (FA25 Final) — all 50 questions',
    titleVi: 'Chữa trọn đề FE3 (FA25 Final) · 50 câu',
    desc: 'Chữa trọn đề thi cuối kỳ DBI202 số 3 (FA25 Final): 50 câu trắc nghiệm đúng thứ tự Phòng thi — ảnh đề gốc, dịch tiếng Việt, từ vựng, vì sao từng đáp án sai/đúng, nhãn chương.',
    exam: 'Final Exam Đề 3 (FA25-Final-Exam)', examVi: 'Đề 3 — Thi cuối kỳ (FA25-Final-Exam)',
    leadEn: 'A full walkthrough of the real DBI202 FA25 final exam (FA25 Final): 50 multiple-choice questions, 60 minutes, marked out of 10 (the FE must reach 4/10). Questions go in exam-room order; each one shows the original question image, a Vietnamese translation, key vocabulary and why every option is right or wrong.',
    leadVi: 'Chữa trọn đề thi cuối kỳ DBI202 thật (FA25 Final): 50 câu trắc nghiệm, 60 phút, thang 10 (FE phải đạt ≥ 4/10). Đi đúng thứ tự Phòng thi; mỗi câu: ảnh đề gốc, dịch tiếng Việt, từ vựng cần nhớ, vì sao từng đáp án sai/đúng.',
    rows: [[1,"SQL sublanguages: DML vs DDL/DCL/TCL","Phân loại lệnh SQL: DML, DDL, DCL, TCL","dbi202-csdl-dbms"],[2,"Database characteristics: concurrent access","Đặc điểm CSDL: truy cập đồng thời","dbi202-csdl-dbms"],[3,"Network data model drawbacks","Nhược điểm mô hình mạng","dbi202-csdl-dbms"],[4,"Meaning of DBMS","Ý nghĩa viết tắt DBMS","dbi202-csdl-dbms"],[5,"Definition of a database","Định nghĩa cơ sở dữ liệu","dbi202-csdl-dbms"],[6,"Hierarchical model data structure","Cấu trúc dữ liệu của mô hình phân cấp","dbi202-csdl-dbms"],[7,"Query compiler stages: building the parse tree","Các khâu của bộ biên dịch truy vấn: dựng cây","dbi202-csdl-dbms"],[8,"Components of a data model","Ba thành phần của mô hình dữ liệu","dbi202-csdl-dbms"],[9,"Definition of an index","Định nghĩa chỉ mục (index)","dbi202-chi-muc"],[10,"Network model relationship type","Kiểu liên kết trong mô hình mạng","dbi202-csdl-dbms"],[11,"Output of a relational algebra query","Kết quả của biểu thức đại số quan hệ","dbi202-dai-so-quan-he"],[12,"Operation pairing all tuples of two relations","Phép ghép mọi cặp bộ của hai quan hệ","dbi202-dai-so-quan-he"],[13,"What relational algebra is","Đại số quan hệ là gì","dbi202-dai-so-quan-he"],[14,"Changing an existing table schema","Sửa lược đồ bảng đã có","dbi202-sql-ddl"],[15,"Armstrong rules: decomposition vs union","Luật Armstrong: tách và hợp","dbi202-bao-dong-tim-khoa"],[16,"Super key vs candidate vs primary key","Siêu khoá, khoá ứng viên, khoá chính","dbi202-mo-hinh-quan-he"],[17,"Attribute closure concept","Khái niệm bao đóng thuộc tính","dbi202-bao-dong-tim-khoa"],[18,"Closure {AB}+ in R(A,B,C,D,E,G)","Tính bao đóng {AB}+ của R(A,B,C,D,E,G)","dbi202-bao-dong-tim-khoa"],[19,"Redundancy problems in one relation","Vấn đề dư thừa khi dồn vào một quan hệ","dbi202-chuan-hoa"],[20,"Normal form: depend only on the key","Dạng chuẩn: chỉ phụ thuộc vào khoá","dbi202-chuan-hoa"],[21,"Properties of Third Normal Form","Tính chất của dạng chuẩn 3 (3NF)","dbi202-chuan-hoa"],[22,"Purpose of normalization","Mục đích của chuẩn hoá","dbi202-chuan-hoa"],[23,"Primary key with foreign key between tables","Khoá chính kết hợp khoá ngoại giữa hai bảng","dbi202-rang-buoc-quan-he"],[24,"Entity set definition","Định nghĩa tập thực thể","dbi202-er-model"],[25,"What a weak entity is","Thực thể yếu là gì","dbi202-er-nang-cao"],[26,"Composite key in an ERD","Khoá phức hợp trong ERD","dbi202-er-model"],[27,"Derived attribute in an ERD","Thuộc tính dẫn xuất trong ERD","dbi202-er-model"],[28,"Weak entity set notation","Ký hiệu tập thực thể yếu","dbi202-er-nang-cao"],[29,"Mapping composite attributes to relations","Chuyển thuộc tính phức hợp sang quan hệ","dbi202-er-to-relation"],[30,"Derived attributes in ERD-to-relation mapping","Thuộc tính dẫn xuất khi chuyển ERD sang quan hệ","dbi202-er-to-relation"],[31,"Keys and NULL values","Loại khoá và giá trị NULL","dbi202-rang-buoc-sql"],[32,"Data type for Vietnamese names","Kiểu dữ liệu cho tên tiếng Việt","dbi202-kieu-du-lieu"],[33,"Set intersection operator","Phép giao tập hợp","dbi202-dai-so-quan-he"],[34,"LIKE wildcard %","Ký tự đại diện % trong LIKE","dbi202-select-join"],[35,"Maximum size of a join result","Kích thước tối đa của kết quả phép nối","dbi202-dai-so-nang-cao"],[36,"UPDATE statement syntax","Cú pháp lệnh UPDATE","dbi202-cap-nhat-du-lieu"],[37,"WHERE vs HAVING","So sánh WHERE và HAVING","dbi202-group-by-subquery"],[38,"View properties: which statement is wrong","Tính chất của view: phát biểu sai","dbi202-view"],[39,"Foreign key constraint keyword","Từ khoá khai báo khoá ngoại","dbi202-rang-buoc-sql"],[40,"Undoing a transaction’s changes","Huỷ thay đổi của giao dịch","dbi202-transaction-acid"],[41,"Transaction methods: begin, save, cancel","Các phương thức giao dịch: bắt đầu, lưu, huỷ","dbi202-transaction-acid"],[42,"Functions of transaction processing","Chức năng của xử lý giao dịch","dbi202-transaction-acid"],[43,"Updating base tables through a view","Cập nhật bảng gốc qua view","dbi202-view"],[44,"General constraint forms: assertion","Dạng ràng buộc tổng quát: assertion","dbi202-rang-buoc-sql"],[45,"T-SQL local variable rules","Quy tắc biến cục bộ T-SQL","dbi202-proc-function"],[46,"Code fired on events","Đoạn mã tự chạy khi có sự kiện","dbi202-trigger-cursor"],[47,"User-defined function returning one value","Hàm người dùng trả về một giá trị","dbi202-proc-function"],[48,"Cursor: which statement is false","Cursor: phát biểu không đúng","dbi202-trigger-cursor"],[49,"Main advantage of stored procedures","Lợi ích chính của stored procedure","dbi202-proc-function"],[50,"Definition of a stored procedure","Định nghĩa stored procedure","dbi202-proc-function"]],
  }),
];

export default {
  title: '🎬 FE review — real final exams, solved on video|||🎬 Chữa trọn đề FE — đề trắc nghiệm thật, chữa bằng video',
  description: 'Mục video tự thêm, tách riêng khỏi mục PE: mỗi đề FE thật (50 câu, 60 phút) là một video dài chữa đủ 50 câu đúng thứ tự Phòng thi — ảnh đề gốc, dịch, từ vựng, từng đáp án, nhãn chương. Bài có link Phòng thi và mục lục từng câu theo chương.',
  lessons,
};
