/**
 * DBI202 · Chữa trọn đề PE (thực hành SQL) — mục VIDEO tự thêm, NẰM NGOÀI bộ sinh flm-nguon/DBI202/gen (luật chủ kênh 25/10/2026:
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
<span class="eyebrow">PE review · real exam, added by this site</span>
<h2>${titleEn}</h2>
<p class="lead">${leadEn}</p>
<div class="callout">Take it first, timed, in the <a href="/exam?course=DBI202&amp;kind=PE">Exam room</a> → DBI202 → <b>${exam}</b>. Every question there has the original paper image and a bilingual model answer; this lesson is the video walkthrough.</div>
<h3>Questions at a glance</h3>
${bang(rows, false)}
<p><b>By chapter:</b> ${theoChuong(rows, false)}</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chữa đề PE · đề thật, phần web tự thêm</span>
<h2>${titleVi}</h2>
<p class="lead">${leadVi}</p>
<div class="callout">Làm thử trước, bấm giờ, trong <a href="/exam?course=DBI202&amp;kind=PE">Phòng thi</a> → DBI202 → <b>${examVi}</b>. Mỗi câu ở đó có ảnh đề gốc và lời giải mẫu song ngữ; bài này là video chữa đề.</div>
<h3>Mục lục từng câu</h3>
${bang(rows, true)}
<p><b>Theo chương:</b> ${theoChuong(rows, true)}</p>
</div>
`,
});

const lessons = [
  bai({
    slug: 'dbi202-pe1-sp26-chua-tron-de',
    titleEn: 'PE review · Exam 1 (SP26-1 · HR database) — all 10 questions',
    titleVi: 'Chữa trọn đề PE1 (SP26-1 · CSDL nhân sự) · 10 câu',
    desc: 'Chữa trọn đề thi thực hành DBI202 kỳ SP26 (Đề 1, CSDL nhân sự Employees/Departments/Regions): ERD → bảng, 6 truy vấn, procedure OUTPUT, trigger, DELETE — chạy thật trên SQL Server.',
    exam: 'Practical Exam Đề 1 (SP26-1)', examVi: 'Đề thi thực hành số 1 (SP26-1)',
    leadEn: 'The real DBI202 Practical Exam SP26-1: 10 questions, 85 minutes, marks 1.5 + 0.5 + 8 × 1. HR database (Employees, Jobs, Departments, Locations, Countries, Regions) plus an ERD to turn into tables. Every query is run on SQL Server against the paper’s DBscript.sql and compared with the expected-result picture.',
    leadVi: 'Đề thi thực hành DBI202 thật kỳ SP26 (Đề 1): 10 câu, 85 phút, điểm 1.5 + 0.5 + 8 × 1. CSDL nhân sự (Employees, Jobs, Departments, Locations, Countries, Regions) và một ERD cần chuyển thành bảng. Mọi truy vấn chạy thật trên SQL Server với DBscript.sql của đề và so với hình kết quả mong đợi.',
    rows: [[1,"ERD → tables: 1–N as FK, M–N setup_Equi as its own table","ERD → bảng: 1–N thành khoá ngoại, M–N setup_Equi thành bảng riêng","dbi202-er-to-relation"],[2,"Filter one table (Salary > 15000)","Lọc một bảng (Salary > 15000)","dbi202-select-join"],[3,"JOIN Employees–Departments, department 'IT'","JOIN Employees–Departments, phòng 'IT'","dbi202-select-join"],[4,"GROUP BY + HAVING compared with a subquery (more than 'IT_PROG')","GROUP BY + HAVING so với truy vấn con (nhiều hơn 'IT_PROG')","dbi202-group-by-subquery"],[5,"4-table join path to Regions (Europe), ORDER BY DESC","Nối 4 bảng tới Regions (Europe), ORDER BY DESC","dbi202-select-join"],[6,"Maximum salary per department (correlated subquery)","Lương cao nhất theo phòng (truy vấn con tương quan)","dbi202-truy-van-long"],[7,"“Every department has an employee”: division with double NOT EXISTS","“Mọi phòng đều có nhân viên”: phép chia bằng hai lớp NOT EXISTS","dbi202-truy-van-long"],[8,"Stored procedure with an OUTPUT parameter","Stored procedure có tham số OUTPUT","dbi202-proc-function"],[9,"AFTER INSERT trigger reading inserted (multi-row)","Trigger AFTER INSERT đọc bảng inserted (nhiều dòng)","dbi202-trigger-cursor"],[10,"DELETE by department name, self-referencing FK","DELETE theo tên phòng, khoá ngoại tự tham chiếu","dbi202-cap-nhat-du-lieu"]],
  }),
  bai({
    slug: 'dbi202-pe2-sp26-chua-tron-de',
    titleEn: 'PE review · Exam 2 (SP26 · Paper 1 · music DB) — all 10 questions',
    titleVi: 'Chữa trọn đề PE2 (SP26 · Paper 1 · CSDL nghe nhạc) · 10 câu',
    desc: 'Chữa trọn đề thi thực hành DBI202 kỳ SP26 Paper No 1 (CSDL nghe nhạc): ERD isA/đa trị/phức hợp, LEFT JOIN, đếm qua outer join, max theo nhóm, procedure, trigger INSTEAD OF, INSERT…SELECT.',
    exam: 'Practical Exam Đề 2 (SP26 · Paper No 1)', examVi: 'Đề thi thực hành số 2 (SP26 · Paper No 1)',
    leadEn: 'The real DBI202 Practical Exam SP26, Paper No 1: 10 questions × 1 mark, 85 minutes. Music streaming database (Artists, Albums, Tracks, Genres, Users, Playlists, PlaylistTracks). Same database and same Q1/Q2/Q6/Q9 as Exam 3 (Paper No 8) — the other six questions differ.',
    leadVi: 'Đề thi thực hành DBI202 thật kỳ SP26, Paper No 1: 10 câu × 1 điểm, 85 phút. CSDL nghe nhạc (Artists, Albums, Tracks, Genres, Users, Playlists, PlaylistTracks). Cùng database và cùng câu 1, 2, 6, 9 với Đề 3 (Paper No 8) — sáu câu còn lại khác.',
    rows: [[1,"ERD → tables: isA (ER style), multi-valued phone, composite address","ERD → bảng: isA (kiểu ER), phone đa trị, address phức hợp","dbi202-er-subclass"],[2,"LIKE '%love%', case-insensitive","LIKE '%love%', không phân biệt hoa thường","dbi202-select-join"],[3,"3-table join: 2020 albums of female artists from the USA","Nối 3 bảng: album 2020 của nghệ sĩ nữ USA","dbi202-select-join"],[4,"LEFT JOIN playlists (tracks never added stay with NULL), 2-key sort","LEFT JOIN playlist (bài chưa vào playlist vẫn hiện NULL), sắp 2 khoá","dbi202-join-day-du"],[5,"All artists: count albums 2020–2024 and Rock tracks (filters in ON, COUNT DISTINCT)","Mọi nghệ sĩ: đếm album 2020–2024 và bài Rock (lọc trong ON, COUNT DISTINCT)","dbi202-group-by-subquery"],[6,"Album(s) with the most tracks per Canadian artist (ties kept)","Album nhiều bài nhất của mỗi nghệ sĩ Canada (giữ đồng hạng)","dbi202-group-by-subquery"],[7,"Album that is top of its country on BOTH all-years and 2023 additions","Album dẫn đầu quốc gia ở CẢ tổng mọi năm lẫn năm 2023","dbi202-truy-van-long"],[8,"Stored procedure listTopArtistByYear(@year): top artist per country, ties","Stored procedure listTopArtistByYear(@year): nghệ sĩ dẫn đầu mỗi nước, đồng hạng","dbi202-proc-function"],[9,"INSTEAD OF INSERT trigger: skip unknown user, fix CreatedAt","Trigger INSTEAD OF INSERT: bỏ user không tồn tại, sửa CreatedAt","dbi202-trigger-cursor"],[10,"INSERT … SELECT tracks of 'Stars Dance' (column is AddedDate)","INSERT … SELECT các bài của 'Stars Dance' (cột là AddedDate)","dbi202-cap-nhat-du-lieu"]],
  }),
  bai({
    slug: 'dbi202-pe3-sp26-chua-tron-de',
    titleEn: 'PE review · Exam 3 (SP26 · Paper 8 · music DB) — all 10 questions',
    titleVi: 'Chữa trọn đề PE3 (SP26 · Paper 8 · CSDL nghe nhạc) · 10 câu',
    desc: 'Chữa trọn đề thi thực hành DBI202 kỳ SP26 Paper No 8 (CSDL nghe nhạc): ERD isA/đa trị/phức hợp, outer join lồng, COUNT DISTINCT, max kép theo quốc gia, hàm trả về bảng, trigger INSTEAD OF, INSERT…SELECT.',
    exam: 'Practical Exam Đề 3 (SP26 · Paper No 8)', examVi: 'Đề thi thực hành số 3 (SP26 · Paper No 8)',
    leadEn: 'The real DBI202 Practical Exam SP26, Paper No 8: 10 questions × 1 mark, 85 minutes, on the same music database as Exam 2. New here: a nested outer join (users → playlists → only Electronic tracks), distinct counting per user, and a table-valued function instead of a procedure.',
    leadVi: 'Đề thi thực hành DBI202 thật kỳ SP26, Paper No 8: 10 câu × 1 điểm, 85 phút, cùng CSDL nghe nhạc với Đề 2. Điểm mới: outer join lồng (user → playlist → chỉ bài Electronic), đếm phân biệt theo user, và hàm trả về bảng thay cho procedure.',
    rows: [[1,"ERD → tables: isA (ER style), multi-valued phone, composite address","ERD → bảng: isA (kiểu ER), phone đa trị, address phức hợp","dbi202-er-subclass"],[2,"LIKE '%love%', case-insensitive","LIKE '%love%', không phân biệt hoa thường","dbi202-select-join"],[3,"3-table join: Rock tracks of albums 2017–2021","Nối 3 bảng: bài Rock của album 2017–2021","dbi202-select-join"],[4,"Free users of 2024 → playlists → only Electronic tracks (nested outer join)","User Free 2024 → playlist → chỉ bài Electronic (outer join lồng)","dbi202-join-day-du"],[5,"All users: playlists of 2024 and distinct English tracks","Mọi user: playlist năm 2024 và số bài English phân biệt","dbi202-group-by-subquery"],[6,"Album(s) with the most tracks per Canadian artist (ties kept)","Album nhiều bài nhất của mỗi nghệ sĩ Canada (giữ đồng hạng)","dbi202-group-by-subquery"],[7,"Album that is top of its country on BOTH all-years and 2024 additions","Album dẫn đầu quốc gia ở CẢ tổng mọi năm lẫn năm 2024","dbi202-truy-van-long"],[8,"Table-valued function returnTopArtistByYear(@year)","Hàm trả về bảng returnTopArtistByYear(@year)","dbi202-proc-function"],[9,"INSTEAD OF INSERT trigger: skip unknown user, fix CreatedAt","Trigger INSTEAD OF INSERT: bỏ user không tồn tại, sửa CreatedAt","dbi202-trigger-cursor"],[10,"INSERT … SELECT tracks of 'Heartbreaker' (column is AddedDate)","INSERT … SELECT các bài của 'Heartbreaker' (cột là AddedDate)","dbi202-cap-nhat-du-lieu"]],
  }),
];

export default {
  title: '🎬 PE review — real practical exams, solved on video|||🎬 Chữa trọn đề PE — đề thực hành thật, chữa bằng video',
  description: 'Mục video tự thêm, tách riêng khỏi mục FE: mỗi đề PE thật (10 câu SQL, 85 phút) là một video dài chữa đủ 10 câu, chạy thật trên SQL Server với DBscript.sql của đề. Bài có link Phòng thi và mục lục từng câu theo chương.',
  lessons,
};
