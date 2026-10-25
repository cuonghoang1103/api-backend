/**
 * DBI202-PE2 — FUOverflow "Đề 2 - Đề Thi PE DBI202 - SP26 - PE - 1" (images.rar → one tall scan of the ORIGINAL paper, Paper 1; material_1.zip → DBscript.sql).
 * PE2 (Paper 1) and PE3 (Paper 8) share the same DBscript.sql (music streaming DB PE_DBI202_Sp2026) and Q1/Q2/Q6/Q9; Q3/Q4/Q5/Q7/Q8/Q10 differ.
 * The paper prints no marks per question ⇒ standard DBI202 scale 10 × 1 mark.
 * EVERY sampleSolution was run on SQL Server 2022 (localhost:14330) against the paper's DBscript.sql; expectedOutput = real output
 * and matches the paper's Picture N.1 (Q8/Q9/Q10 via the paper's test commands, Q9/Q10 inside BEGIN TRAN…ROLLBACK).
 * Paper trap kept & explained: Q10 says "CreatedAt" but PlaylistTracks' column is AddedDate.
 * Built by a scratch generator (not in repo). Given zip: paper.pdf rebuilt from the scan + original DBscript.sql.
 */
export default {
  "course": {
    "courseCode": "DBI202"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "CODE",
      "code": "PE2-SP26P1",
      "title": "DBI202 — Practical Exam Đề 2 (SP26 · Paper No 1 · Music streaming DB)|||DBI202 — Đề thi thực hành số 2 (SP26 · Paper No 1 · CSDL nghe nhạc)",
      "description": "Real SP26 DBI202 PE, Paper 1 (music streaming DB): ERD with composite + multi-valued attributes and an isA subclass, LIKE, 3-table join, LEFT JOIN with NULL playlists, outer-join counting with fan-out, max per artist, double-maximum per country, a stored procedure, an INSTEAD OF trigger and INSERT…SELECT. Reference solutions run on SQL Server 2022, AI-graded.|||Đề PE DBI202 thật kỳ SP26, Paper 1 (CSDL nghe nhạc): ERD có thuộc tính phức hợp + đa trị và lớp con isA, LIKE, nối 3 bảng, LEFT JOIN với playlist NULL, đếm qua outer join có fan-out, max theo nghệ sĩ, max kép theo quốc gia, stored procedure, trigger INSTEAD OF và INSERT…SELECT. Lời giải mẫu chạy thật trên SQL Server 2022, chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": "https://media.cuongthai.com/files/exam-attachments/DBI202/PE2-Given.zip",
      "attachmentName": "DBI202-PE2-Given.zip",
      "instructions": "<div class=\"ml-en\"><p><b>How to take this practical exam.</b></p><ol><li>This is a real FPTU <b>DBI202 Practical Exam</b> (SP26, Paper 1 — music streaming database). Download the attachment (<code>paper.pdf</code> + <code>DBscript.sql</code>), run <code>DBscript.sql</code> in SQL Server Management Studio, then write each answer in its box exactly as you would put it in <code>Qn.sql</code>.</li><li>The exam room cannot run SQL Server in the browser: answers are graded by AI against a rubric and a reference solution. The <b>expected output</b> of every question was produced by running the reference solution on SQL Server 2022 — run your own query on your machine and compare row by row.</li><li>Every question has its own original-paper image (“Show original image”).</li></ol><p><b>Paper header + database diagram:</b></p><p><img src=\"https://media.cuongthai.com/images/exam-questions/DBI202/PE2-hdr/q99.png\" alt=\"Submission rules and database diagram of the original paper\" style=\"max-width:100%\"/></p><ul><li>Create a folder <b>RollNo_Name_DBI202_PaperNo</b> (e.g. he170145_LongNT_DBI202_01) with no sub-folder; one file per question: <code>Q1.sql</code> … <code>Q10.sql</code>.</li><li>Do not use any command containing the database name (create database, alter database, use [database name]…).</li><li>Each file contains only the commands that answer the question — e.g. for a trigger/procedure only its CREATE statement; test commands are forbidden.</li><li>Do not use the <code>GO</code> command.</li><li>Only SQL Server, SQL Server Management Studio and offline documents are allowed. <b>If any requirement is not respected, your mark will be 0.</b></li><li>From the 2nd question, use the database created by the provided <code>DBscript.sql</code> (download it with the attachment button).</li></ul></div><div class=\"ml-vi\"><p><b>Cách làm bài thi thực hành.</b></p><ol><li>Đây là đề <b>thi thực hành DBI202</b> thật của FPTU (SP26, Paper 1 — music streaming database). Tải tệp đính kèm (<code>paper.pdf</code> + <code>DBscript.sql</code>), chạy <code>DBscript.sql</code> trong SQL Server Management Studio, rồi viết lời giải từng câu vào ô trả lời đúng như nội dung file <code>Qn.sql</code>.</li><li>Phòng thi web không chạy được SQL Server: bài được AI chấm theo rubric và lời giải mẫu. <b>Kết quả mong đợi</b> của mỗi câu là output THẬT khi chạy lời giải mẫu trên SQL Server 2022 — hãy chạy truy vấn của bạn trên máy rồi so từng dòng.</li><li>Mỗi câu có ảnh đề gốc riêng (“Xem ảnh đề gốc”).</li></ol><p><b>Phần đầu đề + sơ đồ CSDL:</b></p><p><img src=\"https://media.cuongthai.com/images/exam-questions/DBI202/PE2-hdr/q99.png\" alt=\"Quy định nộp bài và sơ đồ CSDL của đề gốc\" style=\"max-width:100%\"/></p><ul><li>Tạo thư mục <b>RollNo_Name_DBI202_PaperNo</b> (vd he170145_LongNT_DBI202_01), không có thư mục con; mỗi câu một file: <code>Q1.sql</code> … <code>Q10.sql</code>.</li><li>Không dùng lệnh nào chứa tên database (create database, alter database, use [tên database]…).</li><li>Mỗi file chỉ chứa lệnh trả lời câu hỏi — vd câu trigger/procedure thì chỉ có lệnh CREATE của nó; cấm kèm lệnh chạy thử.</li><li>Không dùng lệnh <code>GO</code>.</li><li>Chỉ được dùng SQL Server, SSMS và tài liệu offline. <b>Vi phạm bất kỳ yêu cầu nào ⇒ 0 điểm.</b></li><li>Từ câu 2 trở đi dùng database dựng bằng <code>DBscript.sql</code> đề cho (tải bằng nút tệp đính kèm).</li></ul></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE2-v2/q1.png",
          "prompt": "<p><b>Question 1</b> (1 mark)</p><p>Create one database and then write SQL statements to create, in this database, all tables derived from the ERD (Picture 1.1) with appropriate attributes, primary keys and foreign keys. Keep the names of tables, relationships, attributes and data types the SAME as in the ERD. Underlined attributes are primary keys; attributes referencing another table's primary key must have the same name. If a table must be created for a relationship, it is named after the relationship. <b>Use ER-style conversion for subclasses.</b> A table representing a <b>multi-valued attribute</b> is named table name + attribute name (e.g. StudentPhone). Submit only CREATE TABLE statements.</p><p><b>ERD:</b> Universities(<u>universityID</u> int, name nvarchar(200), address = composite {street nvarchar(50), city nvarchar(50)}) —1— <b>workFor</b> —N— Employees(<u>empID</u> int, FullName nvarchar(60), gender nvarchar(10), <b>phone nvarchar(20) — double oval = multi-valued</b>); Professors <b>isA</b> Employees, Professors(field nvarchar(100)) —N— <b>workFor</b> —1— Departments(<u>depID</u> int, name nvarchar(100)).</p>|||<p><b>Câu 1</b> (1 điểm)</p><p>Tạo một database rồi viết lệnh SQL tạo mọi bảng suy ra từ ERD (Picture 1.1), đủ thuộc tính, khoá chính, khoá ngoại. Giữ nguyên tên bảng, quan hệ, thuộc tính, kiểu dữ liệu như ERD. Thuộc tính gạch chân là khoá chính; thuộc tính tham chiếu khoá chính bảng khác phải trùng tên. Nếu phải tạo bảng cho một quan hệ thì đặt theo tên quan hệ. <b>Lớp con chuyển theo kiểu ER (ER style).</b> Bảng biểu diễn <b>thuộc tính đa trị</b> đặt tên = tên bảng + tên thuộc tính (vd StudentPhone). Chỉ nộp lệnh CREATE TABLE.</p><p><b>ERD:</b> Universities(<u>universityID</u> int, name nvarchar(200), address = thuộc tính phức hợp {street nvarchar(50), city nvarchar(50)}) —1— <b>workFor</b> —N— Employees(<u>empID</u> int, FullName nvarchar(60), gender nvarchar(10), <b>phone nvarchar(20) — viền đôi = đa trị</b>); Professors <b>isA</b> Employees, Professors(field nvarchar(100)) —N— <b>workFor</b> —1— Departments(<u>depID</u> int, name nvarchar(100)).</p>",
          "starterCode": "-- DBI202 PE SP26 Paper 1 · Q1.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "CREATE TABLE Universities (\n    universityID int PRIMARY KEY,\n    name         nvarchar(200),\n    street       nvarchar(50),\n    city         nvarchar(50)\n);\nCREATE TABLE Departments (\n    depID int PRIMARY KEY,\n    name  nvarchar(100)\n);\nCREATE TABLE Employees (\n    empID        int PRIMARY KEY,\n    FullName     nvarchar(60),\n    gender       nvarchar(10),\n    universityID int REFERENCES Universities(universityID)\n);\nCREATE TABLE EmployeesPhone (\n    empID int REFERENCES Employees(empID),\n    phone nvarchar(20),\n    PRIMARY KEY (empID, phone)\n);\nCREATE TABLE Professors (\n    empID int PRIMARY KEY REFERENCES Employees(empID),\n    field nvarchar(100),\n    depID int REFERENCES Departments(depID)\n);",
          "expectedOutput": "-- Kiểm cấu trúc sau khi chạy Q1.sql trong một database trống:\nTableName      | ColumnName   | DataType | Len\n---------------+--------------+----------+----\nDepartments    | depID        | int      | 4  \nDepartments    | name         | nvarchar | 100\nEmployees      | empID        | int      | 4  \nEmployees      | FullName     | nvarchar | 60 \nEmployees      | gender       | nvarchar | 10 \nEmployees      | universityID | int      | 4  \nEmployeesPhone | empID        | int      | 4  \nEmployeesPhone | phone        | nvarchar | 20 \nProfessors     | empID        | int      | 4  \nProfessors     | field        | nvarchar | 100\nProfessors     | depID        | int      | 4  \nUniversities   | universityID | int      | 4  \nUniversities   | name         | nvarchar | 200\nUniversities   | street       | nvarchar | 50 \nUniversities   | city         | nvarchar | 50 \n(15 rows)\n\nFromTable      | FromCol      | ToTable     \n---------------+--------------+-------------\nEmployees      | universityID | Universities\nEmployeesPhone | empID        | Employees   \nProfessors     | depID        | Departments \nProfessors     | empID        | Employees   \n(4 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: five tables and four foreign keys created as listed.</p><p>Four decisions decide the mark:</p><ol><li><b>Composite attribute</b> <i>address</i> is flattened into its parts <code>street</code>, <code>city</code> (no “address” column).</li><li><b>Multi-valued</b> <i>phone</i> (double oval) ⇒ separate table <code>EmployeesPhone(empID, phone)</code>, PK = both columns, FK empID → Employees.</li><li><b>isA, ER style</b> ⇒ <code>Professors</code> keeps only the key <code>empID</code> (PK and FK → Employees) plus its own attribute <code>field</code>; it does NOT repeat FullName/gender.</li><li>Both <b>workFor</b> relationships are 1–N ⇒ no table: <code>Employees.universityID → Universities</code>, <code>Professors.depID → Departments</code> (the professor's department belongs to the subclass, not to every employee).</li></ol><p>Traps: object-oriented/null style for the subclass, a table named <code>Phone</code> or <code>EmployeePhone</code>, a <code>workFor</code> table for a 1–N relationship, keeping a column called <code>address</code>.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: tạo đủ 5 bảng và 4 khoá ngoại như bảng kiểm.</p><p>Bốn quyết định quyết định điểm:</p><ol><li><b>Thuộc tính phức hợp</b> <i>address</i> tách thành các thành phần <code>street</code>, <code>city</code> (không có cột “address”).</li><li><b>Thuộc tính đa trị</b> <i>phone</i> (viền đôi) ⇒ bảng riêng <code>EmployeesPhone(empID, phone)</code>, PK gồm cả hai cột, FK empID → Employees.</li><li><b>isA kiểu ER</b> ⇒ <code>Professors</code> chỉ giữ khoá <code>empID</code> (vừa PK vừa FK → Employees) và thuộc tính riêng <code>field</code>; KHÔNG lặp FullName/gender.</li><li>Hai quan hệ <b>workFor</b> đều 1–N ⇒ không tạo bảng: <code>Employees.universityID → Universities</code>, <code>Professors.depID → Departments</code> (phòng ban gắn với lớp con giáo sư, không phải mọi nhân viên).</li></ol><p>Bẫy: chuyển lớp con kiểu hướng đối tượng/null, đặt bảng tên <code>Phone</code> hay <code>EmployeePhone</code>, tạo bảng <code>workFor</code> cho quan hệ 1–N, giữ cột tên <code>address</code>.</p>",
          "rubric": [
            {
              "id": "entities",
              "criterion": "Universities (street, city flattened), Employees, Departments with correct names, types, PKs.|||Universities (tách street, city), Employees, Departments đúng tên, kiểu, khoá chính.",
              "weight": 0.3,
              "maxScore": 0.3
            },
            {
              "id": "multivalued",
              "criterion": "EmployeesPhone(empID, phone) with composite PK and FK to Employees.|||EmployeesPhone(empID, phone) có PK ghép và FK tới Employees.",
              "weight": 0.25,
              "maxScore": 0.25
            },
            {
              "id": "isa",
              "criterion": "Professors(empID PK+FK → Employees, field) — ER-style subclass.|||Professors(empID vừa PK vừa FK → Employees, field) — lớp con kiểu ER.",
              "weight": 0.25,
              "maxScore": 0.25
            },
            {
              "id": "workfor",
              "criterion": "Both 1–N workFor mapped as FKs: Employees.universityID, Professors.depID.|||Hai quan hệ workFor 1–N thành khoá ngoại: Employees.universityID, Professors.depID.",
              "weight": 0.2,
              "maxScore": 0.2
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE2/q2.png",
          "prompt": "<p><b>Question 2</b> (1 mark)</p><p>Write an SQL query to display all tracks whose title contains the string “love” (not case-sensitive), as shown in Picture 2.1 (23 rows: ID, Title, Duration, Language, AlbumID, GenreID — from 2 Love Story to 302 Show Me Love).</p>|||<p><b>Câu 2</b> (1 điểm)</p><p>Viết truy vấn hiển thị mọi bài hát (track) có tiêu đề chứa chuỗi “love” (không phân biệt hoa thường), như Picture 2.1 (23 dòng: ID, Title, Duration, Language, AlbumID, GenreID — từ 2 Love Story tới 302 Show Me Love).</p>",
          "starterCode": "-- DBI202 PE SP26 Paper 1 · Q2.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "SELECT ID, Title, Duration, Language, AlbumID, GenreID\nFROM Tracks\nWHERE LOWER(Title) LIKE '%love%';",
          "expectedOutput": "ID  | Title                 | Duration | Language | AlbumID | GenreID\n----+-----------------------+----------+----------+---------+--------\n2   | Love Story            | 235      | English  | 1       | 1      \n15  | Give Me Love          | 285      | English  | 5       | 1      \n23  | Love of My Life       | 218      | English  | 7       | 2      \n28  | Make You Feel My Love | 213      | English  | 9       | 12     \n34  | Send My Love          | 223      | English  | 11      | 12     \n59  | Fake Love             | 239      | Korean   | 19      | 8      \n79  | Lovesick Girls        | 192      | Korean   | 26      | 8      \n141 | Somebody To Love      | 220      | English  | 47      | 1      \n145 | Love Yourself         | 233      | English  | 48      | 1      \n153 | Love Poem             | 243      | Korean   | 51      | 8      \n169 | This Love             | 206      | English  | 56      | 2      \n170 | She Will Be Loved     | 257      | English  | 56      | 2      \n178 | Nobody’s Love         | 211      | English  | 59      | 2      \n191 | Love On The Brain     | 224      | English  | 63      | 4      \n199 | Love The Way You Lie  | 263      | English  | 66      | 3      \n200 | No Love               | 299      | English  | 66      | 3      \n215 | Stupid Love           | 193      | English  | 71      | 7      \n223 | Love Me More          | 210      | English  | 74      | 1      \n242 | Love Galore           | 215      | English  | 80      | 4      \n255 | LOVE.                 | 214      | English  | 84      | 3      \n270 | Same Old Love         | 229      | English  | 89      | 1      \n271 | Lose You To Love Me   | 206      | English  | 90      | 1      \n302 | Show Me Love          | 214      | English  | 100     | 12     \n(23 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 23 rows, identical to Picture 2.1.</p><p><code>LIKE '%love%'</code>. The default collation of SQL Server is case-insensitive (…_CI_AS), so 'LOVE.' and 'Lovesick Girls' already match; wrapping the column in <code>LOWER()</code> makes the intent explicit and keeps the query correct even on a case-sensitive database. Trap: <code>LIKE 'love%'</code> (only titles starting with it) or <code>= 'love'</code>.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 23 dòng, khớp Picture 2.1.</p><p><code>LIKE '%love%'</code>. Collation mặc định của SQL Server không phân biệt hoa thường (…_CI_AS) nên 'LOVE.' và 'Lovesick Girls' đều khớp; bọc <code>LOWER()</code> cho rõ ý và vẫn đúng nếu database phân biệt hoa thường. Bẫy: <code>LIKE 'love%'</code> (chỉ tiêu đề bắt đầu bằng love) hoặc <code>= 'love'</code>.</p>",
          "rubric": [
            {
              "id": "like",
              "criterion": "LIKE '%love%' (case-insensitive) on Tracks.Title.|||LIKE '%love%' (không phân biệt hoa thường) trên Tracks.Title.",
              "weight": 0.7,
              "maxScore": 0.7
            },
            {
              "id": "cols",
              "criterion": "Returns all track columns as in the picture.|||Trả đủ các cột của Tracks như hình.",
              "weight": 0.3,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE2/q3.png",
          "prompt": "<p><b>Question 3</b> (1 mark)</p><p>Write an SQL query to display all tracks that belong to albums released in 2020 and performed by female artists from the USA. Include ID (track's ID), track's Title (as TrackTitle), album's Title (as AlbumTitle), ReleaseYear, artist's Name (as ArtistName), Gender, Country (Picture 3.1 — 9 rows: Chromatica, Rare, Alicia).</p>|||<p><b>Câu 3</b> (1 điểm)</p><p>Viết truy vấn hiển thị mọi bài hát thuộc album phát hành năm 2020 và do nghệ sĩ nữ đến từ USA thể hiện. Gồm ID (của track), Title (đặt tên TrackTitle), Title của album (AlbumTitle), ReleaseYear, Name của nghệ sĩ (ArtistName), Gender, Country (Picture 3.1 — 9 dòng: Chromatica, Rare, Alicia).</p>",
          "starterCode": "-- DBI202 PE SP26 Paper 1 · Q3.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "SELECT t.ID, t.Title AS TrackTitle, al.Title AS AlbumTitle, al.ReleaseYear,\n       ar.Name AS ArtistName, ar.Gender, ar.Country\nFROM Tracks t\nJOIN Albums  al ON al.ID = t.AlbumID\nJOIN Artists ar ON ar.ID = al.ArtistID\nWHERE al.ReleaseYear = 2020\n  AND ar.Gender = 'Female'\n  AND ar.Country = 'USA';",
          "expectedOutput": "ID  | TrackTitle          | AlbumTitle | ReleaseYear | ArtistName   | Gender | Country\n----+---------------------+------------+-------------+--------------+--------+--------\n213 | Chromatica I        | Chromatica | 2020        | Lady Gaga    | Female | USA    \n214 | Rain On Me          | Chromatica | 2020        | Lady Gaga    | Female | USA    \n215 | Stupid Love         | Chromatica | 2020        | Lady Gaga    | Female | USA    \n271 | Lose You To Love Me | Rare       | 2020        | Selena Gomez | Female | USA    \n272 | Look At Her Now     | Rare       | 2020        | Selena Gomez | Female | USA    \n273 | Rare                | Rare       | 2020        | Selena Gomez | Female | USA    \n300 | Underdog            | Alicia     | 2020        | Alicia Keys  | Female | USA    \n301 | Time Machine        | Alicia     | 2020        | Alicia Keys  | Female | USA    \n302 | Show Me Love        | Alicia     | 2020        | Alicia Keys  | Female | USA    \n(9 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 9 rows, identical to Picture 3.1.</p><p>Tracks → Albums → Artists with three conditions (ReleaseYear = 2020, Gender = 'Female', Country = 'USA'). Tracks and Albums both have a column called <code>Title</code>, so aliases (<code>AS TrackTitle</code>, <code>AS AlbumTitle</code>, <code>AS ArtistName</code>) are mandatory to match the picture. Trap: forgetting a table prefix ⇒ “Ambiguous column name 'Title'”.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 9 dòng, khớp Picture 3.1.</p><p>Tracks → Albums → Artists với ba điều kiện (ReleaseYear = 2020, Gender = 'Female', Country = 'USA'). Tracks và Albums cùng có cột <code>Title</code> nên bắt buộc đặt bí danh (<code>AS TrackTitle</code>, <code>AS AlbumTitle</code>, <code>AS ArtistName</code>) cho khớp hình. Bẫy: quên tiền tố bảng ⇒ lỗi “Ambiguous column name 'Title'”.</p>",
          "rubric": [
            {
              "id": "joins",
              "criterion": "Joins Tracks–Albums–Artists correctly.|||JOIN đúng Tracks–Albums–Artists.",
              "weight": 0.4,
              "maxScore": 0.4
            },
            {
              "id": "filter",
              "criterion": "ReleaseYear = 2020 AND Gender = 'Female' AND Country = 'USA'.|||ReleaseYear = 2020 AND Gender = 'Female' AND Country = 'USA'.",
              "weight": 0.3,
              "maxScore": 0.3
            },
            {
              "id": "alias",
              "criterion": "The 7 columns with the requested aliases.|||Đủ 7 cột với bí danh đúng đề.",
              "weight": 0.3,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE2/q4.png",
          "prompt": "<p><b>Question 4</b> (1 mark)</p><p>Write an SQL query to display all tracks that belong to albums released after 2020 and are in the genre named 'Rock', together with the playlists to which they have been added. Display album's Title (AlbumTitle), ReleaseYear, track's ID (TrackID), track's Title (TrackTitle), genre's Name (GenreName), playlist's Title (PlaylistTitle), and AddedDate. Include all eligible tracks even if they have not been added to any playlist. Sort by PlaylistTitle descending, then TrackTitle ascending (Picture 4.1 — 9 rows, the last 3 Harry's House tracks with NULL playlist).</p>|||<p><b>Câu 4</b> (1 điểm)</p><p>Viết truy vấn hiển thị mọi bài hát thuộc album phát hành SAU 2020 và thuộc thể loại 'Rock', kèm các playlist đã thêm bài đó. Hiển thị Title album (AlbumTitle), ReleaseYear, ID bài (TrackID), Title bài (TrackTitle), Name thể loại (GenreName), Title playlist (PlaylistTitle), AddedDate. Phải gồm cả bài chưa được thêm vào playlist nào. Sắp PlaylistTitle giảm dần, rồi TrackTitle tăng dần (Picture 4.1 — 9 dòng, 3 bài cuối của Harry's House có playlist NULL).</p>",
          "starterCode": "-- DBI202 PE SP26 Paper 1 · Q4.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "SELECT al.Title AS AlbumTitle, al.ReleaseYear, t.ID AS TrackID, t.Title AS TrackTitle,\n       g.Name AS GenreName, p.Title AS PlaylistTitle, pt.AddedDate\nFROM Tracks t\nJOIN Albums al ON al.ID = t.AlbumID\nJOIN Genres g  ON g.ID  = t.GenreID\nLEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID\nLEFT JOIN Playlists p       ON p.ID = pt.PlaylistID\nWHERE al.ReleaseYear > 2020\n  AND g.Name = 'Rock'\nORDER BY PlaylistTitle DESC, TrackTitle ASC;",
          "expectedOutput": "AlbumTitle      | ReleaseYear | TrackID | TrackTitle                   | GenreName | PlaylistTitle    | AddedDate              \n----------------+-------------+---------+------------------------------+-----------+------------------+------------------------\nJordi           | 2021        | 177     | Memories                     | Rock      | Morning Energy   | 2024-02-04 00:00:00.000\nJordi           | 2021        | 179     | Lost                         | Rock      | Italian Classics | 2024-03-04 00:00:00.000\nMercury – Act 1 | 2021        | 129     | Wrecked                      | Rock      | Italian Classics | 2024-03-03 00:00:00.000\nMercury – Act 1 | 2021        | 128     | Enemy                        | Rock      | Hip Hop Vibes    | 2024-02-18 00:00:00.000\nJordi           | 2021        | 178     | Nobody’s Love                | Rock      | Hip Hop Vibes    | 2024-02-19 00:00:00.000\nMercury – Act 1 | 2021        | 130     | Follow You                   | Rock      | Acoustic Mood    | 2024-03-20 00:00:00.000\nHarry’s House   | 2022        | 262     | As It Was                    | Rock      | NULL             | NULL                   \nHarry’s House   | 2022        | 263     | Late Night Talking           | Rock      | NULL             | NULL                   \nHarry’s House   | 2022        | 264     | Music For A Sushi Restaurant | Rock      | NULL             | NULL                   \n(9 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 9 rows in the same order as Picture 4.1.</p><p>INNER JOIN Albums and Genres (they are filters), but <b>LEFT JOIN</b> PlaylistTracks and Playlists so tracks never added to a playlist survive with NULLs. “After 2020” = <code>&gt; 2020</code>. With <code>ORDER BY PlaylistTitle DESC</code>, NULLs come last in SQL Server (NULL is the smallest value), exactly as in the picture. Trap: a WHERE condition on a playlist column would turn the LEFT JOIN back into an INNER JOIN and lose the 3 Harry's House rows.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 9 dòng, đúng thứ tự Picture 4.1.</p><p>INNER JOIN Albums và Genres (chúng là điều kiện lọc), nhưng <b>LEFT JOIN</b> PlaylistTracks và Playlists để bài chưa vào playlist nào vẫn còn với giá trị NULL. “Sau 2020” = <code>&gt; 2020</code>. Với <code>ORDER BY PlaylistTitle DESC</code>, NULL nằm cuối trong SQL Server (NULL được coi là nhỏ nhất), đúng như hình. Bẫy: đặt điều kiện trên cột playlist trong WHERE sẽ biến LEFT JOIN thành INNER JOIN, mất 3 dòng Harry's House.</p>",
          "rubric": [
            {
              "id": "filter",
              "criterion": "ReleaseYear > 2020 and genre 'Rock' via joins with Albums/Genres.|||ReleaseYear > 2020 và thể loại 'Rock' qua JOIN Albums/Genres.",
              "weight": 0.3,
              "maxScore": 0.3
            },
            {
              "id": "left",
              "criterion": "LEFT JOIN PlaylistTracks/Playlists keeps tracks without playlists.|||LEFT JOIN PlaylistTracks/Playlists giữ bài chưa có playlist.",
              "weight": 0.4,
              "maxScore": 0.4
            },
            {
              "id": "order",
              "criterion": "7 aliased columns, ORDER BY PlaylistTitle DESC, TrackTitle ASC.|||7 cột có bí danh, ORDER BY PlaylistTitle DESC, TrackTitle ASC.",
              "weight": 0.3,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE2/q5.png",
          "prompt": "<p><b>Question 5</b> (1 mark)</p><p>Write an SQL query to list all artists together with the total number of albums they released between 2020 and 2024 (inclusive) and the total number of tracks belonging to the genre named 'Rock' in those albums. Display ArtistID, Name, Gender, Country, NumberOfAlbums, NumberOfTracks. Include all artists, even if they released no album between 2020 and 2024, and even if those albums contain no 'Rock' track (Picture 5.1 — 30 rows; only Imagine Dragons, Maroon 5, Harry Styles have 3 Rock tracks).</p>|||<p><b>Câu 5</b> (1 điểm)</p><p>Viết truy vấn liệt kê mọi nghệ sĩ kèm tổng số album phát hành trong 2020–2024 (tính cả hai đầu) và tổng số bài thể loại 'Rock' trong các album đó. Hiển thị ArtistID, Name, Gender, Country, NumberOfAlbums, NumberOfTracks. Phải gồm mọi nghệ sĩ, kể cả không có album nào trong 2020–2024 hoặc album không có bài 'Rock' nào (Picture 5.1 — 30 dòng; chỉ Imagine Dragons, Maroon 5, Harry Styles có 3 bài Rock).</p>",
          "starterCode": "-- DBI202 PE SP26 Paper 1 · Q5.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "SELECT ar.ID AS ArtistID, ar.Name, ar.Gender, ar.Country,\n       COUNT(DISTINCT al.ID) AS NumberOfAlbums,\n       COUNT(t.ID)          AS NumberOfTracks\nFROM Artists ar\nLEFT JOIN Albums al ON al.ArtistID = ar.ID AND al.ReleaseYear BETWEEN 2020 AND 2024\nLEFT JOIN Tracks t  ON t.AlbumID = al.ID\n                   AND t.GenreID IN (SELECT ID FROM Genres WHERE Name = 'Rock')\nGROUP BY ar.ID, ar.Name, ar.Gender, ar.Country\nORDER BY ar.ID;",
          "expectedOutput": "ArtistID | Name            | Gender | Country     | NumberOfAlbums | NumberOfTracks\n---------+-----------------+--------+-------------+----------------+---------------\n1        | Taylor Swift    | Female | USA         | 0              | 0             \n2        | Ed Sheeran      | Male   | UK          | 1              | 0             \n3        | Adele           | Female | UK          | 1              | 0             \n4        | Drake           | Male   | Canada      | 0              | 0             \n5        | BTS             | Group  | South Korea | 1              | 0             \n6        | Billie Eilish   | Female | USA         | 1              | 0             \n7        | Bruno Mars      | Male   | USA         | 0              | 0             \n8        | Blackpink       | Group  | South Korea | 2              | 0             \n9        | The Weeknd      | Male   | Canada      | 1              | 0             \n10       | Ariana Grande   | Female | USA         | 0              | 0             \n11       | Coldplay        | Group  | UK          | 1              | 0             \n12       | Imagine Dragons | Group  | USA         | 1              | 3             \n13       | Shawn Mendes    | Male   | Canada      | 1              | 0             \n14       | Justin Bieber   | Male   | Canada      | 1              | 0             \n15       | IU              | Female | South Korea | 1              | 0             \n16       | Charlie Puth    | Male   | USA         | 1              | 0             \n17       | Maroon 5        | Group  | USA         | 1              | 3             \n18       | Rihanna         | Female | Barbados    | 0              | 0             \n19       | Eminem          | Male   | USA         | 1              | 0             \n20       | Lady Gaga       | Female | USA         | 1              | 0             \n21       | Sam Smith       | Male   | UK          | 1              | 0             \n22       | Dua Lipa        | Female | UK          | 1              | 0             \n23       | Post Malone     | Male   | USA         | 0              | 0             \n24       | SZA             | Female | USA         | 1              | 0             \n25       | Kendrick Lamar  | Male   | USA         | 0              | 0             \n26       | Harry Styles    | Male   | UK          | 1              | 3             \n27       | Selena Gomez    | Female | USA         | 1              | 0             \n28       | Red Velvet      | Group  | South Korea | 0              | 0             \n29       | G-Dragon        | Male   | South Korea | 0              | 0             \n30       | Alicia Keys     | Female | USA         | 1              | 0             \n(30 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 30 rows, identical to Picture 5.1.</p><p>Start from <b>Artists</b> and LEFT JOIN everything; put each filter <b>in the ON clause</b> of the table it filters (year range on Albums, genre on Tracks) so artists without matching rows stay with 0. Count albums with <code>COUNT(DISTINCT al.ID)</code> — joining tracks multiplies album rows (fan-out), so a plain COUNT would count one album three times. Count tracks with <code>COUNT(t.ID)</code> (NULLs ignored ⇒ 0). Trap: <code>WHERE al.ReleaseYear BETWEEN …</code> or <code>WHERE g.Name = 'Rock'</code> drops 20+ artists.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 30 dòng, khớp Picture 5.1.</p><p>Xuất phát từ <b>Artists</b> rồi LEFT JOIN tất cả; đặt mỗi điều kiện lọc <b>trong ON</b> của bảng nó lọc (khoảng năm ở Albums, thể loại ở Tracks) để nghệ sĩ không có dòng khớp vẫn còn với 0. Đếm album bằng <code>COUNT(DISTINCT al.ID)</code> — JOIN thêm Tracks làm nhân bản dòng album (fan-out), COUNT thường sẽ đếm một album ba lần. Đếm bài bằng <code>COUNT(t.ID)</code> (bỏ qua NULL ⇒ 0). Bẫy: <code>WHERE al.ReleaseYear BETWEEN …</code> hoặc <code>WHERE g.Name = 'Rock'</code> làm rơi hơn 20 nghệ sĩ.</p>",
          "rubric": [
            {
              "id": "outer",
              "criterion": "All artists kept (LEFT JOINs, filters in ON, not WHERE).|||Giữ đủ mọi nghệ sĩ (LEFT JOIN, điều kiện trong ON chứ không ở WHERE).",
              "weight": 0.4,
              "maxScore": 0.4
            },
            {
              "id": "albums",
              "criterion": "NumberOfAlbums = distinct albums with ReleaseYear 2020–2024.|||NumberOfAlbums = số album phân biệt có ReleaseYear 2020–2024.",
              "weight": 0.3,
              "maxScore": 0.3
            },
            {
              "id": "tracks",
              "criterion": "NumberOfTracks = Rock tracks in those albums, 0 when none; correct 6 columns.|||NumberOfTracks = số bài Rock trong các album đó, 0 nếu không có; đúng 6 cột.",
              "weight": 0.3,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE2/q6.png",
          "prompt": "<p><b>Question 6</b> (1 mark)</p><p>Write an SQL query to display, for each artist whose Country is 'Canada', the album(s) that have the highest number of tracks among all albums of that artist. Display ArtistID, ArtistName, AlbumID, AlbumTitle, NumberOfTracks. If an artist has several albums with the same highest number of tracks, display all of them; an artist with no album is not displayed (Picture 6.1 — 11 rows: Drake/Scorpion 5; The Weeknd 4 albums × 3; Shawn Mendes 3 albums × 3; Justin Bieber 3 albums × 3).</p>|||<p><b>Câu 6</b> (1 điểm)</p><p>Viết truy vấn hiển thị, với mỗi nghệ sĩ có Country = 'Canada', (các) album có nhiều bài hát nhất trong số album của nghệ sĩ đó. Hiển thị ArtistID, ArtistName, AlbumID, AlbumTitle, NumberOfTracks. Nếu nghệ sĩ có nhiều album cùng số bài cao nhất thì hiện hết; nghệ sĩ không có album thì không hiện (Picture 6.1 — 11 dòng: Drake/Scorpion 5; The Weeknd 4 album × 3; Shawn Mendes 3 album × 3; Justin Bieber 3 album × 3).</p>",
          "starterCode": "-- DBI202 PE SP26 Paper 1 · Q6.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "WITH AlbumCount AS (\n    SELECT ar.ID AS ArtistID, ar.Name AS ArtistName, al.ID AS AlbumID, al.Title AS AlbumTitle,\n           COUNT(t.ID) AS NumberOfTracks\n    FROM Artists ar\n    JOIN Albums al     ON al.ArtistID = ar.ID\n    LEFT JOIN Tracks t ON t.AlbumID = al.ID\n    WHERE ar.Country = 'Canada'\n    GROUP BY ar.ID, ar.Name, al.ID, al.Title\n)\nSELECT ArtistID, ArtistName, AlbumID, AlbumTitle, NumberOfTracks\nFROM AlbumCount a\nWHERE NumberOfTracks = (SELECT MAX(NumberOfTracks) FROM AlbumCount b WHERE b.ArtistID = a.ArtistID)\nORDER BY ArtistID, AlbumID;",
          "expectedOutput": "ArtistID | ArtistName    | AlbumID | AlbumTitle                | NumberOfTracks\n---------+---------------+---------+---------------------------+---------------\n4        | Drake         | 16      | Scorpion                  | 5             \n9        | The Weeknd    | 28      | Kiss Land                 | 3             \n9        | The Weeknd    | 29      | Beauty Behind the Madness | 3             \n9        | The Weeknd    | 30      | Starboy                   | 3             \n9        | The Weeknd    | 31      | After Hours               | 3             \n13       | Shawn Mendes  | 44      | Handwritten               | 3             \n13       | Shawn Mendes  | 45      | Illuminate                | 3             \n13       | Shawn Mendes  | 46      | Wonder                    | 3             \n14       | Justin Bieber | 47      | My World 2.0              | 3             \n14       | Justin Bieber | 48      | Purpose                   | 3             \n14       | Justin Bieber | 49      | Justice                   | 3             \n(11 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 11 rows, identical to Picture 6.1.</p><p>Two levels: (1) count tracks per album of Canadian artists (CTE <code>AlbumCount</code>), (2) keep the albums whose count equals the <b>MAX of the same artist</b>. Ties are kept automatically (The Weeknd shows 4 albums). <code>JOIN Albums</code> (not LEFT) drops artists without albums as required. Trap: <code>TOP 1</code> / <code>TOP 1 WITH TIES</code> over the whole set returns only Drake; comparing with the max over all Canadian albums also returns only Scorpion.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 11 dòng, khớp Picture 6.1.</p><p>Hai tầng: (1) đếm số bài mỗi album của nghệ sĩ Canada (CTE <code>AlbumCount</code>), (2) giữ album có số bài bằng <b>MAX của chính nghệ sĩ đó</b>. Đồng hạng được giữ tự nhiên (The Weeknd hiện 4 album). Dùng <code>JOIN Albums</code> (không LEFT) để loại nghệ sĩ không có album như đề yêu cầu. Bẫy: <code>TOP 1</code> / <code>TOP 1 WITH TIES</code> trên toàn bộ chỉ ra Drake; so với max của mọi album Canada cũng chỉ ra Scorpion.</p>",
          "rubric": [
            {
              "id": "count",
              "criterion": "Counts tracks per album for Canadian artists.|||Đếm số bài mỗi album của nghệ sĩ Canada.",
              "weight": 0.4,
              "maxScore": 0.4
            },
            {
              "id": "max-per-artist",
              "criterion": "Keeps albums equal to the per-artist maximum (ties kept, artists without albums excluded), correct 5 columns.|||Giữ album bằng max theo từng nghệ sĩ (giữ đồng hạng, loại nghệ sĩ không album), đúng 5 cột.",
              "weight": 0.6,
              "maxScore": 0.6
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE2/q7.png",
          "prompt": "<p><b>Question 7</b> (1 mark)</p><p>Write an SQL query to display, for each country, the album(s) of artists from that country that have the highest total number of times their tracks were added to playlists (across all years) compared to all other albums in the same country, <b>and also</b> have the highest total number of times their tracks were added to playlists in the year 2023 compared to all other albums in the same country. Display Country, AlbumID, AlbumTitle, TotalPlaylistAdditions, TotalPlaylistAdditionsIn2023. Order by Country, then AlbumTitle ascending (Picture 7.1 — 4 rows: Barbados, Canada, South Korea, UK).</p>|||<p><b>Câu 7</b> (1 điểm)</p><p>Viết truy vấn hiển thị, với mỗi quốc gia, (các) album của nghệ sĩ nước đó vừa có tổng số lần bài hát được thêm vào playlist (mọi năm) cao nhất so với mọi album khác cùng nước, <b>vừa</b> có tổng số lần được thêm vào playlist trong năm 2023 cao nhất so với mọi album khác cùng nước. Hiển thị Country, AlbumID, AlbumTitle, TotalPlaylistAdditions, TotalPlaylistAdditionsIn2023. Sắp Country rồi AlbumTitle tăng dần (Picture 7.1 — 4 dòng: Barbados, Canada, South Korea, UK).</p>",
          "starterCode": "-- DBI202 PE SP26 Paper 1 · Q7.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "WITH AlbumStats AS (\n    SELECT ar.Country, al.ID AS AlbumID, al.Title AS AlbumTitle,\n           COUNT(pt.TrackID) AS TotalPlaylistAdditions,\n           SUM(CASE WHEN YEAR(pt.AddedDate) = 2023 THEN 1 ELSE 0 END) AS TotalPlaylistAdditionsIn2023\n    FROM Artists ar\n    JOIN Albums al ON al.ArtistID = ar.ID\n    JOIN Tracks t  ON t.AlbumID = al.ID\n    LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID\n    GROUP BY ar.Country, al.ID, al.Title\n)\nSELECT Country, AlbumID, AlbumTitle, TotalPlaylistAdditions, TotalPlaylistAdditionsIn2023\nFROM AlbumStats a\nWHERE TotalPlaylistAdditions = (SELECT MAX(TotalPlaylistAdditions) FROM AlbumStats b WHERE b.Country = a.Country)\n  AND TotalPlaylistAdditionsIn2023 = (SELECT MAX(TotalPlaylistAdditionsIn2023) FROM AlbumStats b WHERE b.Country = a.Country)\nORDER BY Country ASC, AlbumTitle ASC;",
          "expectedOutput": "Country     | AlbumID | AlbumTitle       | TotalPlaylistAdditions | TotalPlaylistAdditionsIn2023\n------------+---------+------------------+------------------------+-----------------------------\nBarbados    | 60      | Music of the Sun | 3                      | 0                           \nCanada      | 16      | Scorpion         | 10                     | 3                           \nSouth Korea | 17      | 2 Cool 4 Skool   | 9                      | 4                           \nUK          | 10      | 21               | 8                      | 4                           \n(4 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 4 rows, identical to Picture 7.1.</p><p>Build one stats row per album (CTE): <code>COUNT(pt.TrackID)</code> for all years and <code>SUM(CASE WHEN YEAR(pt.AddedDate) = 2023 THEN 1 ELSE 0 END)</code> for 2023, with a LEFT JOIN so albums never added still count 0. Then keep an album only if it equals the country maximum on <b>both</b> measures (two correlated MAX subqueries joined by AND). That is why <b>USA disappears</b>: its best all-time album is not its best 2023 album, so no USA album wins both. Traps: <code>WHERE YEAR(AddedDate) = 2023</code> in the CTE destroys the all-years total; ranking by only one measure returns a USA row.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 4 dòng, khớp Picture 7.1.</p><p>Dựng một dòng thống kê cho mỗi album (CTE): <code>COUNT(pt.TrackID)</code> cho mọi năm và <code>SUM(CASE WHEN YEAR(pt.AddedDate) = 2023 THEN 1 ELSE 0 END)</code> cho năm 2023, dùng LEFT JOIN để album chưa từng được thêm vẫn tính 0. Sau đó chỉ giữ album bằng max của quốc gia ở <b>cả hai</b> chỉ số (hai truy vấn con MAX tương quan nối bằng AND). Vì vậy <b>USA biến mất</b>: album dẫn đầu mọi năm của USA không phải album dẫn đầu năm 2023, nên không album USA nào thắng cả hai. Bẫy: đặt <code>WHERE YEAR(AddedDate) = 2023</code> trong CTE làm hỏng tổng mọi năm; chỉ xếp hạng theo một chỉ số sẽ ra thêm dòng USA.</p>",
          "rubric": [
            {
              "id": "stats",
              "criterion": "Per-album totals: all years and year 2023 (conditional aggregation), grouped with Country.|||Tổng theo album: mọi năm và năm 2023 (gộp có điều kiện), nhóm kèm Country.",
              "weight": 0.4,
              "maxScore": 0.4
            },
            {
              "id": "both-max",
              "criterion": "Keeps albums equal to the per-country maximum on BOTH measures.|||Giữ album bằng max theo quốc gia ở CẢ HAI chỉ số.",
              "weight": 0.4,
              "maxScore": 0.4
            },
            {
              "id": "order",
              "criterion": "5 aliased columns, ORDER BY Country, AlbumTitle.|||5 cột có bí danh, ORDER BY Country, AlbumTitle.",
              "weight": 0.2,
              "maxScore": 0.2
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE2/q8.png",
          "prompt": "<p><b>Question 8</b> (1 mark)</p><p>Create a stored procedure named <b>listTopArtistByYear</b> that accepts one input parameter (<code>@year int</code>) and displays, for each country, the artist(s) from that country who have the highest total number of times their tracks were added to playlists in the specified year compared to all other artists in the same country. Display Country, ArtistID, ArtistName and TotalPlaylistAdditionsInYear. If several artists of a country share the highest total, all of them must be displayed.</p><pre><code class=\"language-sql\">execute listTopArtistByYear 2023</code></pre><p>Expected (Picture 8.1): USA 1 Taylor Swift 12 · UK 3 Adele 12 · Canada 4 Drake 10 · South Korea 5 BTS 13 · Barbados 18 Rihanna 0.</p>|||<p><b>Câu 8</b> (1 điểm)</p><p>Tạo stored procedure tên <b>listTopArtistByYear</b> nhận một tham số vào (<code>@year int</code>) và hiển thị, với mỗi quốc gia, (các) nghệ sĩ nước đó có tổng số lần bài hát được thêm vào playlist trong năm chỉ định cao nhất so với các nghệ sĩ khác cùng nước. Hiển thị Country, ArtistID, ArtistName, TotalPlaylistAdditionsInYear. Đồng hạng thì hiện hết. Chạy <code>execute listTopArtistByYear 2023</code> phải ra như Picture 8.1.</p>",
          "starterCode": "-- DBI202 PE SP26 Paper 1 · Q8.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "CREATE PROCEDURE listTopArtistByYear\n    @year int\nAS\nBEGIN\n    WITH ArtistTotals AS (\n        SELECT ar.Country, ar.ID AS ArtistID, ar.Name AS ArtistName,\n               COUNT(pt.TrackID) AS TotalPlaylistAdditionsInYear\n        FROM Artists ar\n        LEFT JOIN Albums al         ON al.ArtistID = ar.ID\n        LEFT JOIN Tracks t          ON t.AlbumID = al.ID\n        LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID AND YEAR(pt.AddedDate) = @year\n        GROUP BY ar.Country, ar.ID, ar.Name\n    )\n    SELECT Country, ArtistID, ArtistName, TotalPlaylistAdditionsInYear\n    FROM ArtistTotals a\n    WHERE TotalPlaylistAdditionsInYear =\n          (SELECT MAX(TotalPlaylistAdditionsInYear) FROM ArtistTotals b WHERE b.Country = a.Country)\n    ORDER BY ArtistID;\nEND",
          "expectedOutput": "-- Lệnh thử (KHÔNG nộp kèm): execute listTopArtistByYear 2023  — rồi 2024 để xem đồng hạng\nCountry     | ArtistID | ArtistName   | TotalPlaylistAdditionsInYear\n------------+----------+--------------+-----------------------------\nUSA         | 1        | Taylor Swift | 12                          \nUK          | 3        | Adele        | 12                          \nCanada      | 4        | Drake        | 10                          \nSouth Korea | 5        | BTS          | 13                          \nBarbados    | 18       | Rihanna      | 0                           \n(5 rows)\n\nCountry     | ArtistID | ArtistName    | TotalPlaylistAdditionsInYear\n------------+----------+---------------+-----------------------------\nUK          | 3        | Adele         | 12                          \nCanada      | 4        | Drake         | 16                          \nSouth Korea | 5        | BTS           | 14                          \nUSA         | 10       | Ariana Grande | 13                          \nUK          | 11       | Coldplay      | 12                          \nBarbados    | 18       | Rihanna       | 8                           \nUSA         | 20       | Lady Gaga     | 13                          \n(7 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: execute listTopArtistByYear 2023 returns exactly Picture 8.1.</p><p>Per artist: LEFT JOIN Albums → Tracks → PlaylistTracks with the year condition <b>in the ON clause</b>, then <code>COUNT(pt.TrackID)</code>. This is what makes <b>Barbados/Rihanna = 0</b> appear: Rihanna has no additions in 2023, a WHERE on the year would remove her and Barbados would vanish. Then keep artists equal to their country's maximum (ties kept — run it with 2024 and the UK shows Adele and Coldplay, both 12). <code>ORDER BY ArtistID</code> reproduces the picture's order. Trap: <code>TOP 1</code> per country loses ties.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: execute listTopArtistByYear 2023 ra đúng Picture 8.1.</p><p>Theo từng nghệ sĩ: LEFT JOIN Albums → Tracks → PlaylistTracks, đặt điều kiện năm <b>trong ON</b>, rồi <code>COUNT(pt.TrackID)</code>. Nhờ vậy mới có dòng <b>Barbados/Rihanna = 0</b>: Rihanna không có lượt thêm nào năm 2023, lọc năm ở WHERE sẽ loại cô ấy và Barbados biến mất. Sau đó giữ nghệ sĩ bằng max của quốc gia (giữ đồng hạng — chạy với 2024 thì UK hiện cả Adele lẫn Coldplay, đều 12). <code>ORDER BY ArtistID</code> cho đúng thứ tự hình. Bẫy: <code>TOP 1</code> mỗi nước làm mất đồng hạng.</p>",
          "rubric": [
            {
              "id": "proc",
              "criterion": "CREATE PROCEDURE listTopArtistByYear @year int.|||CREATE PROCEDURE listTopArtistByYear @year int.",
              "weight": 0.2,
              "maxScore": 0.2
            },
            {
              "id": "totals",
              "criterion": "Per-artist additions in @year with LEFT JOINs so artists with 0 remain (Rihanna 0).|||Tổng theo nghệ sĩ trong @year bằng LEFT JOIN để nghệ sĩ 0 lượt vẫn còn (Rihanna 0).",
              "weight": 0.4,
              "maxScore": 0.4
            },
            {
              "id": "top",
              "criterion": "Artists equal to the per-country maximum, ties kept; 4 columns.|||Nghệ sĩ bằng max theo quốc gia, giữ đồng hạng; đúng 4 cột.",
              "weight": 0.4,
              "maxScore": 0.4
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE2/q9.png",
          "prompt": "<p><b>Question 9</b> (1 mark)</p><p>Create a trigger named <b>tr_insertPlaylist</b> on the Playlists table to validate the data before inserting rows. Rules: if the UserID does not exist in Users, the row must not be inserted; if CreatedAt ≥ the user's RegistrationDate and ≤ the current system datetime, insert it with the provided CreatedAt; if CreatedAt is earlier than the RegistrationDate or later than the current datetime, still insert it but replace CreatedAt with the current system datetime. The trigger must handle multiple rows inserted at the same time.</p><pre><code class=\"language-sql\">INSERT Playlists (Title, UserID,CreatedAt)\nVALUES ('Playlist Test 1',10,'2025-10-12'),\n('Playlist Test 2',50,'2025-11-12'),\n('Playlist Test 3',12,'2020-05-12'),\n('Playlist Test 4',13,'2031-02-15')</code></pre><p>⇒ Test 1 inserted as given; Test 2 not inserted (no user 50); Test 3 and Test 4 inserted with CreatedAt = current datetime.</p>|||<p><b>Câu 9</b> (1 điểm)</p><p>Tạo trigger tên <b>tr_insertPlaylist</b> trên bảng Playlists để kiểm dữ liệu TRƯỚC khi chèn. Luật: UserID không có trong Users ⇒ không chèn dòng đó; CreatedAt ≥ RegistrationDate của user và ≤ thời điểm hiện tại ⇒ chèn với CreatedAt đã cho; CreatedAt sớm hơn RegistrationDate hoặc muộn hơn hiện tại ⇒ vẫn chèn nhưng thay CreatedAt bằng thời điểm hiện tại. Trigger phải xử lý được nhiều dòng chèn cùng lúc. Với lệnh trên: Test 1 chèn nguyên giá trị; Test 2 không chèn (không có user 50); Test 3, Test 4 chèn với CreatedAt = thời điểm hiện tại.</p>",
          "starterCode": "-- DBI202 PE SP26 Paper 1 · Q9.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "CREATE TRIGGER tr_insertPlaylist ON Playlists\nINSTEAD OF INSERT\nAS\nBEGIN\n    INSERT INTO Playlists (Title, UserID, CreatedAt)\n    SELECT i.Title,\n           i.UserID,\n           CASE WHEN i.CreatedAt >= u.RegistrationDate AND i.CreatedAt <= GETDATE()\n                THEN i.CreatedAt\n                ELSE GETDATE()\n           END\n    FROM inserted i\n    JOIN Users u ON u.ID = i.UserID;   -- UserID không tồn tại ⇒ bị loại, không chèn\nEND",
          "expectedOutput": "-- Lệnh thử (BEGIN TRAN … ROLLBACK). Dữ liệu user liên quan + kết quả sau khi chèn\n-- (CreatedAt của Test 3/4 = GETDATE() lúc chạy, nên giờ phút sẽ khác trên máy bạn):\nID | Username | RegistrationDate       \n---+----------+------------------------\n10 | samuel_w | 2024-03-18 00:00:00.000\n12 | olivia_j | 2023-06-01 00:00:00.000\n13 | lucas_m  | 2023-06-14 00:00:00.000\n(3 rows)\n\nMaxPlaylistID | N \n--------------+---\n75            | 75\n(1 rows)\n\nID | Title           | UserID | CreatedAt              \n---+-----------------+--------+------------------------\n76 | Playlist Test 1 | 10     | 2025-10-12 00:00:00.000\n77 | Playlist Test 3 | 12     | 2026-10-25 05:55:32.813\n78 | Playlist Test 4 | 13     | 2026-10-25 05:55:32.813\n(3 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: Test 1 kept 2025-10-12, Test 2 skipped, Test 3/4 got the current datetime (rolled back afterwards).</p><p>“Validate <b>before</b> inserting” + “some rows are skipped, some are changed” ⇒ an <code>INSTEAD OF INSERT</code> trigger that performs the real INSERT itself from <code>inserted</code>:</p><ul><li><code>JOIN Users</code> silently drops rows whose UserID does not exist (Test 2) — no error, no rollback of the other rows.</li><li>A <code>CASE</code> keeps CreatedAt when RegistrationDate ≤ CreatedAt ≤ GETDATE(), otherwise GETDATE() (Test 3: 2020 &lt; registration 2023-06-01; Test 4: 2031 is in the future).</li><li>Do not insert <code>ID</code>: it is an IDENTITY column (new IDs 76–78).</li></ul><p>Traps: <code>AFTER INSERT</code> + <code>ROLLBACK</code> cancels the whole statement (Test 1 would be lost too); reading one row into variables breaks the multi-row requirement; inside an INSTEAD OF trigger, inserting into the same table does not fire the trigger again, so there is no recursion.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: Test 1 giữ 2025-10-12, Test 2 bị bỏ, Test 3/4 nhận thời điểm hiện tại (đã ROLLBACK sau khi kiểm).</p><p>“Kiểm <b>trước</b> khi chèn” + “có dòng bỏ, có dòng sửa” ⇒ trigger <code>INSTEAD OF INSERT</code> tự thực hiện lệnh INSERT thật từ <code>inserted</code>:</p><ul><li><code>JOIN Users</code> tự loại dòng có UserID không tồn tại (Test 2) — không báo lỗi, không huỷ các dòng khác.</li><li><code>CASE</code> giữ CreatedAt khi RegistrationDate ≤ CreatedAt ≤ GETDATE(), ngược lại dùng GETDATE() (Test 3: 2020 &lt; ngày đăng ký 2023-06-01; Test 4: 2031 ở tương lai).</li><li>Không chèn cột <code>ID</code>: nó là IDENTITY (ID mới 76–78).</li></ul><p>Bẫy: <code>AFTER INSERT</code> + <code>ROLLBACK</code> huỷ cả câu lệnh (mất luôn Test 1); đọc một dòng vào biến thì hỏng yêu cầu nhiều dòng; trong trigger INSTEAD OF, lệnh INSERT vào chính bảng đó không kích hoạt lại trigger nên không bị đệ quy.</p>",
          "rubric": [
            {
              "id": "instead",
              "criterion": "INSTEAD OF INSERT trigger named tr_insertPlaylist on Playlists that inserts from inserted (set-based, multi-row).|||Trigger INSTEAD OF INSERT tên tr_insertPlaylist trên Playlists, chèn từ inserted (theo tập, nhiều dòng).",
              "weight": 0.4,
              "maxScore": 0.4
            },
            {
              "id": "user",
              "criterion": "Rows with a non-existing UserID are not inserted.|||Dòng có UserID không tồn tại không được chèn.",
              "weight": 0.3,
              "maxScore": 0.3
            },
            {
              "id": "date",
              "criterion": "CreatedAt kept when RegistrationDate ≤ CreatedAt ≤ GETDATE(), else replaced by GETDATE(); ID (identity) not inserted.|||Giữ CreatedAt khi RegistrationDate ≤ CreatedAt ≤ GETDATE(), ngược lại thay bằng GETDATE(); không chèn ID (identity).",
              "weight": 0.3,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE2/q10.png",
          "prompt": "<p><b>Question 10</b> (1 mark)</p><p>Write SQL statements to insert rows into the PlaylistTracks table so that all tracks from the album titled 'Stars Dance' are added to the playlist with ID = 10, and March 6, 2026 is used as the value for the CreatedAt, specifying only the date (do not include the time).</p>|||<p><b>Câu 10</b> (1 điểm)</p><p>Viết lệnh SQL chèn dòng vào bảng PlaylistTracks sao cho mọi bài hát của album 'Stars Dance' được thêm vào playlist có ID = 10, dùng ngày 2026-03-06 làm giá trị “CreatedAt”, chỉ ghi ngày (không kèm giờ).</p>",
          "starterCode": "-- DBI202 PE SP26 Paper 1 · Q10.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate)\nSELECT 10, t.ID, '2026-03-06'\nFROM Tracks t\nJOIN Albums al ON al.ID = t.AlbumID\nWHERE al.Title = 'Stars Dance';",
          "expectedOutput": "-- Kiểm (BEGIN TRAN … INSERT … ROLLBACK): playlist 10 sau khi chèn\nPlaylistID | TrackID | AddedDate              \n-----------+---------+------------------------\n10         | 10      | 2023-06-03 00:00:00.000\n10         | 34      | 2023-06-03 00:00:00.000\n10         | 59      | 2023-06-04 00:00:00.000\n10         | 84      | 2023-06-05 00:00:00.000\n10         | 265     | 2026-03-06 00:00:00.000\n10         | 266     | 2026-03-06 00:00:00.000\n10         | 267     | 2026-03-06 00:00:00.000\n(7 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 3 new rows added to the playlist (checked inside a rolled-back transaction).</p><p><code>INSERT … SELECT</code>: one row per track of the album, found by joining Tracks with Albums on the <b>title</b> (do not hard-code the track IDs). ⚠️ Paper trap: PlaylistTracks has <b>no CreatedAt column</b> — its date column is <code>AddedDate</code> (CreatedAt belongs to Playlists). Writing <code>CreatedAt</code> gives “Invalid column name”. Write the date literal as <code>'2026-03-06'</code> (ISO yyyy-mm-dd, no time part) — it is stored as 2026-03-06 00:00:00.000.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: thêm 3 dòng mới vào playlist (kiểm trong giao tác rồi ROLLBACK).</p><p><code>INSERT … SELECT</code>: mỗi bài của album một dòng, tìm bằng JOIN Tracks với Albums theo <b>tiêu đề</b> (không gõ cứng ID bài hát). ⚠️ Bẫy của đề: PlaylistTracks <b>không có cột CreatedAt</b> — cột ngày của nó là <code>AddedDate</code> (CreatedAt là của Playlists). Viết <code>CreatedAt</code> sẽ lỗi “Invalid column name”. Ghi ngày dạng <code>'2026-03-06'</code> (ISO yyyy-mm-dd, không có giờ) — được lưu thành 2026-03-06 00:00:00.000.</p>",
          "rubric": [
            {
              "id": "insert-select",
              "criterion": "INSERT INTO PlaylistTracks … SELECT tracks of album 'Stars Dance' (by title, not hard-coded IDs).|||INSERT INTO PlaylistTracks … SELECT các bài của album 'Stars Dance' (theo tiêu đề, không gõ cứng ID).",
              "weight": 0.6,
              "maxScore": 0.6
            },
            {
              "id": "values",
              "criterion": "PlaylistID = 10, AddedDate = '2026-03-06' (date only, correct column).|||PlaylistID = 10, AddedDate = '2026-03-06' (chỉ ngày, đúng tên cột).",
              "weight": 0.4,
              "maxScore": 0.4
            }
          ]
        }
      ]
    }
  ]
};
