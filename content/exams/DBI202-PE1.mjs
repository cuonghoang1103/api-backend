/**
 * DBI202-PE1 — FUOverflow "Đề 1 - Đề Thi PE DBI202 - SP26 -1" (paper.pdf + pe_dbi202_sp26_1_030226.zip → DBscript.sql, DB PE_DBI202_SP2026 / HR schema).
 * Paper = FUOverflow retyped version (marks printed: Q1 1.5, Q2 0.5, Q3–Q10 1). Attribution lines erased from the images.
 * EVERY sampleSolution was run on SQL Server 2022 (localhost:14330) against the paper's DBscript.sql; expectedOutput = real output
 * (Q1: structure check via sys.columns/sys.foreign_keys; Q8–Q10: the paper's test commands, Q9/Q10 inside BEGIN TRAN…ROLLBACK).
 * Built by a scratch generator (not in repo). Given zip: clean paper.pdf + original DBscript.sql.
 */
export default {
  "course": {
    "courseCode": "DBI202"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "CODE",
      "code": "PE1-SP26-1",
      "title": "DBI202 — Practical Exam Đề 1 (SP26-1 · HR database: Employees/Departments/Regions)|||DBI202 — Đề thi thực hành số 1 (SP26-1 · CSDL nhân sự: Employees/Departments/Regions)",
      "description": "Real SP26 DBI202 PE: ERD → tables (1–N, M–N), 6 queries (filter, join, HAVING vs subquery, 4-table join, max per group, relational division), a procedure with OUTPUT parameter, an AFTER INSERT trigger and a DELETE. Reference solutions run on SQL Server 2022, AI-graded.|||Đề PE DBI202 thật kỳ SP26: ERD → bảng (1–N, M–N), 6 truy vấn (lọc, JOIN, HAVING với truy vấn con, nối 4 bảng, max theo nhóm, phép chia), procedure có tham số OUTPUT, trigger AFTER INSERT và một lệnh DELETE. Lời giải mẫu chạy thật trên SQL Server 2022, chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": "https://media.cuongthai.com/files/exam-attachments/DBI202/PE1-Given.zip",
      "attachmentName": "DBI202-PE1-Given.zip",
      "instructions": "<div class=\"ml-en\"><p><b>How to take this practical exam.</b></p><ol><li>This is a real FPTU <b>DBI202 Practical Exam</b> (SP26, Paper 1 — HR database). Download the attachment (<code>paper.pdf</code> + <code>DBscript.sql</code>), run <code>DBscript.sql</code> in SQL Server Management Studio, then write each answer in its box exactly as you would put it in <code>Qn.sql</code>.</li><li>The exam room cannot run SQL Server in the browser: answers are graded by AI against a rubric and a reference solution. The <b>expected output</b> of every question was produced by running the reference solution on SQL Server 2022 — run your own query on your machine and compare row by row.</li><li>Every question has its own original-paper image (“Show original image”).</li></ol><p><b>Paper header + database diagram:</b></p><p><img src=\"https://media.cuongthai.com/images/exam-questions/DBI202/PE1-hdr/q99.png\" alt=\"Submission rules and database diagram of the original paper\" style=\"max-width:100%\"/></p><ul><li>Create a folder <b>RollNo_Name_DBI202_PaperNo</b> (e.g. he170145_LongNT_DBI202_01) with no sub-folder; one file per question: <code>Q1.sql</code> … <code>Q10.sql</code>.</li><li>Do not use any command containing the database name (create database, alter database, use [database name]…).</li><li>Each file contains only the commands that answer the question — e.g. for a trigger/procedure only its CREATE statement; test commands are forbidden.</li><li>Do not use the <code>GO</code> command.</li><li>Only SQL Server, SQL Server Management Studio and offline documents are allowed. <b>If any requirement is not respected, your mark will be 0.</b></li><li>From the 2nd question, use the database created by the provided <code>DBscript.sql</code> (download it with the attachment button).</li></ul></div><div class=\"ml-vi\"><p><b>Cách làm bài thi thực hành.</b></p><ol><li>Đây là đề <b>thi thực hành DBI202</b> thật của FPTU (SP26, Paper 1 — HR database). Tải tệp đính kèm (<code>paper.pdf</code> + <code>DBscript.sql</code>), chạy <code>DBscript.sql</code> trong SQL Server Management Studio, rồi viết lời giải từng câu vào ô trả lời đúng như nội dung file <code>Qn.sql</code>.</li><li>Phòng thi web không chạy được SQL Server: bài được AI chấm theo rubric và lời giải mẫu. <b>Kết quả mong đợi</b> của mỗi câu là output THẬT khi chạy lời giải mẫu trên SQL Server 2022 — hãy chạy truy vấn của bạn trên máy rồi so từng dòng.</li><li>Mỗi câu có ảnh đề gốc riêng (“Xem ảnh đề gốc”).</li></ol><p><b>Phần đầu đề + sơ đồ CSDL:</b></p><p><img src=\"https://media.cuongthai.com/images/exam-questions/DBI202/PE1-hdr/q99.png\" alt=\"Quy định nộp bài và sơ đồ CSDL của đề gốc\" style=\"max-width:100%\"/></p><ul><li>Tạo thư mục <b>RollNo_Name_DBI202_PaperNo</b> (vd he170145_LongNT_DBI202_01), không có thư mục con; mỗi câu một file: <code>Q1.sql</code> … <code>Q10.sql</code>.</li><li>Không dùng lệnh nào chứa tên database (create database, alter database, use [tên database]…).</li><li>Mỗi file chỉ chứa lệnh trả lời câu hỏi — vd câu trigger/procedure thì chỉ có lệnh CREATE của nó; cấm kèm lệnh chạy thử.</li><li>Không dùng lệnh <code>GO</code>.</li><li>Chỉ được dùng SQL Server, SSMS và tài liệu offline. <b>Vi phạm bất kỳ yêu cầu nào ⇒ 0 điểm.</b></li><li>Từ câu 2 trở đi dùng database dựng bằng <code>DBscript.sql</code> đề cho (tải bằng nút tệp đính kèm).</li></ul></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "CODE",
          "points": 1.5,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE1/q1.png",
          "prompt": "<p><b>Question 1</b> (1.5 marks)</p><p>Create a database and write SQL statements to build, inside it, all tables derived from the ERD below, with appropriate attributes, primary keys and foreign keys. Keep the names of tables, relationships, attributes and data types <b>exactly the SAME</b> as in the ERD. Underlined attributes form the primary key; attributes referencing another table's primary key must use the same names. Submit only the CREATE TABLE statements (no create/alter/use database).</p><p><b>ERD (Picture 1.1):</b></p><table><tr><td><b>Building</b></td><td><u>BuildingID</u> int, BuildingName nvarchar(100), TotalFloors int</td></tr><tr><td><b>Floor</b></td><td><u>FloorID</u> int, FloorName nvarchar(100), ApartmentCount int</td></tr><tr><td><b>Equipment</b></td><td><u>EquipmentID</u> int, EquipmentName nvarchar(100), Description nvarchar(255)</td></tr><tr><td><b>Manufacturer</b></td><td><u>ManufacturerID</u> int, ManufacturerName nvarchar(100), Address nvarchar(255)</td></tr></table><p>Relationships: Building <b>has</b> Floor: 1 – N · Manufacturer <b>supply</b> Equipment: 1 – N · Floor <b>setup_Equi</b> Equipment: M – N (with attribute Quantity int).</p>|||<p><b>Câu 1</b> (1.5 điểm)</p><p>Tạo một database và viết lệnh SQL tạo trong đó mọi bảng suy ra từ ERD dưới đây, đủ thuộc tính, khoá chính, khoá ngoại. Giữ tên bảng, tên quan hệ, tên thuộc tính và kiểu dữ liệu <b>GIỐNG HỆT</b> ERD. Thuộc tính gạch chân là khoá chính; thuộc tính tham chiếu khoá chính bảng khác phải trùng tên. Chỉ nộp các lệnh CREATE TABLE (không create/alter/use database).</p><p><b>ERD (Picture 1.1):</b> Building(<u>BuildingID</u> int, BuildingName nvarchar(100), TotalFloors int) · Floor(<u>FloorID</u> int, FloorName nvarchar(100), ApartmentCount int) · Equipment(<u>EquipmentID</u> int, EquipmentName nvarchar(100), Description nvarchar(255)) · Manufacturer(<u>ManufacturerID</u> int, ManufacturerName nvarchar(100), Address nvarchar(255)).</p><p>Quan hệ: Building <b>has</b> Floor 1–N · Manufacturer <b>supply</b> Equipment 1–N · Floor <b>setup_Equi</b> Equipment M–N (có thuộc tính Quantity int).</p>",
          "starterCode": "-- DBI202 PE SP26-1 · Q1.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "CREATE TABLE Building (\n    BuildingID   int PRIMARY KEY,\n    BuildingName nvarchar(100),\n    TotalFloors  int\n);\nCREATE TABLE Floor (\n    FloorID        int PRIMARY KEY,\n    FloorName      nvarchar(100),\n    ApartmentCount int,\n    BuildingID     int REFERENCES Building(BuildingID)\n);\nCREATE TABLE Manufacturer (\n    ManufacturerID   int PRIMARY KEY,\n    ManufacturerName nvarchar(100),\n    Address          nvarchar(255)\n);\nCREATE TABLE Equipment (\n    EquipmentID    int PRIMARY KEY,\n    EquipmentName  nvarchar(100),\n    Description    nvarchar(255),\n    ManufacturerID int REFERENCES Manufacturer(ManufacturerID)\n);\nCREATE TABLE setup_Equi (\n    FloorID     int REFERENCES Floor(FloorID),\n    EquipmentID int REFERENCES Equipment(EquipmentID),\n    Quantity    int,\n    PRIMARY KEY (FloorID, EquipmentID)\n);",
          "expectedOutput": "-- Kiểm cấu trúc sau khi chạy Q1.sql trong một database trống (sys.columns + sys.foreign_keys):\nTableName    | ColumnName       | DataType | Len\n-------------+------------------+----------+----\nBuilding     | BuildingID       | int      | 4  \nBuilding     | BuildingName     | nvarchar | 100\nBuilding     | TotalFloors      | int      | 4  \nEquipment    | EquipmentID      | int      | 4  \nEquipment    | EquipmentName    | nvarchar | 100\nEquipment    | Description      | nvarchar | 255\nEquipment    | ManufacturerID   | int      | 4  \nFloor        | FloorID          | int      | 4  \nFloor        | FloorName        | nvarchar | 100\nFloor        | ApartmentCount   | int      | 4  \nFloor        | BuildingID       | int      | 4  \nManufacturer | ManufacturerID   | int      | 4  \nManufacturer | ManufacturerName | nvarchar | 100\nManufacturer | Address          | nvarchar | 255\nsetup_Equi   | FloorID          | int      | 4  \nsetup_Equi   | EquipmentID      | int      | 4  \nsetup_Equi   | Quantity         | int      | 4  \n(17 rows)\n\nFromTable  | FromCol        | ToTable     \n-----------+----------------+-------------\nEquipment  | ManufacturerID | Manufacturer\nFloor      | BuildingID     | Building    \nsetup_Equi | EquipmentID    | Equipment   \nsetup_Equi | FloorID        | Floor       \n(4 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: the five tables and four foreign keys were created exactly as listed below.</p><p><b>Mapping rules.</b> Each entity → one table. A 1–N relationship adds the PK of the “1” side as a foreign key on the “N” side: <code>Floor.BuildingID → Building</code>, <code>Equipment.ManufacturerID → Manufacturer</code> (no separate table for <i>has</i>/<i>supply</i>). The M–N relationship <b>setup_Equi</b> becomes its own table named exactly <code>setup_Equi</code>, PK = (FloorID, EquipmentID), both FKs, plus its attribute <code>Quantity int</code>.</p><p><b>Traps:</b> creating tables in the wrong order (the referenced table must exist first); naming the M–N table something else (Floor_Equipment…); forgetting the composite PK; changing nvarchar lengths.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: tạo đủ 5 bảng và 4 khoá ngoại đúng như bảng kiểm bên dưới.</p><p><b>Quy tắc chuyển ERD.</b> Mỗi thực thể → một bảng. Quan hệ 1–N: đặt khoá chính bên “1” làm khoá ngoại ở bên “N”: <code>Floor.BuildingID → Building</code>, <code>Equipment.ManufacturerID → Manufacturer</code> (không tạo bảng riêng cho <i>has</i>/<i>supply</i>). Quan hệ M–N <b>setup_Equi</b> thành bảng riêng tên đúng <code>setup_Equi</code>, PK = (FloorID, EquipmentID), hai khoá ngoại, kèm thuộc tính <code>Quantity int</code>.</p><p><b>Bẫy:</b> tạo bảng sai thứ tự (bảng được tham chiếu phải có trước); đặt tên bảng M–N khác (Floor_Equipment…); quên PK ghép; đổi độ dài nvarchar.</p>",
          "rubric": [
            {
              "id": "entities",
              "criterion": "Four entity tables with exactly the ERD names, columns, data types and primary keys.|||Bốn bảng thực thể đúng tên, cột, kiểu dữ liệu và khoá chính như ERD.",
              "weight": 0.5,
              "maxScore": 0.5
            },
            {
              "id": "one-many",
              "criterion": "Both 1–N relationships mapped as foreign keys on the N side (Floor.BuildingID, Equipment.ManufacturerID).|||Hai quan hệ 1–N chuyển thành khoá ngoại bên N (Floor.BuildingID, Equipment.ManufacturerID).",
              "weight": 0.5,
              "maxScore": 0.5
            },
            {
              "id": "many-many",
              "criterion": "Table setup_Equi with composite PK (FloorID, EquipmentID), two FKs and Quantity int.|||Bảng setup_Equi có PK ghép (FloorID, EquipmentID), hai khoá ngoại và Quantity int.",
              "weight": 0.5,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 0.5,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE1/q2.png",
          "prompt": "<p><b>Question 2</b> (0.5 marks)</p><p>Write a query that finds employees whose salary is greater than 15000. The result includes the columns EmployeeID, FirstName, LastName, Email, Phone, JobID, Salary (Picture 2.1 — 3 rows: 100 King, 101 Kochhar, 102 De Haan).</p>|||<p><b>Câu 2</b> (0.5 điểm)</p><p>Viết truy vấn tìm nhân viên có lương lớn hơn 15000. Kết quả gồm các cột EmployeeID, FirstName, LastName, Email, Phone, JobID, Salary (Picture 2.1 — 3 dòng: 100 King, 101 Kochhar, 102 De Haan).</p>",
          "starterCode": "-- DBI202 PE SP26-1 · Q2.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "SELECT EmployeeID, FirstName, LastName, Email, Phone, JobID, Salary\nFROM Employees\nWHERE Salary > 15000;",
          "expectedOutput": "EmployeeID | FirstName | LastName | Email    | Phone        | JobID   | Salary\n-----------+-----------+----------+----------+--------------+---------+-------\n100        | Steven    | King     | SKING    | 515.123.4567 | AD_PRES | 24000 \n101        | Neena     | Kochhar  | NKOCHHAR | 515.123.4568 | AD_VP   | 17000 \n102        | Lex       | De Haan  | LDEHAAN  | 515.123.4569 | AD_VP   | 17000 \n(3 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 3 rows, identical to Picture 2.1.</p><p>A simple <code>WHERE Salary &gt; 15000</code> on one table, selecting exactly the 7 requested columns in the requested order. Trap: <code>&gt;=</code> instead of <code>&gt;</code>, or <code>SELECT *</code> (extra columns ⇒ result no longer matches the picture).</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 3 dòng, khớp Picture 2.1.</p><p>Lọc một bảng bằng <code>WHERE Salary &gt; 15000</code>, chọn đúng 7 cột theo đúng thứ tự đề. Bẫy: dùng <code>&gt;=</code> thay cho <code>&gt;</code>, hoặc <code>SELECT *</code> (thừa cột ⇒ không khớp hình).</p>",
          "rubric": [
            {
              "id": "filter",
              "criterion": "Correct condition Salary > 15000.|||Điều kiện đúng Salary > 15000.",
              "weight": 0.25,
              "maxScore": 0.25
            },
            {
              "id": "cols",
              "criterion": "Exactly the 7 requested columns in order.|||Đúng 7 cột theo thứ tự đề.",
              "weight": 0.25,
              "maxScore": 0.25
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE1/q3.png",
          "prompt": "<p><b>Question 3</b> (1 mark)</p><p>Write a query that finds employees working in the 'IT' department. The result includes the columns EmployeeID, FirstName, LastName, DepartmentID, DepartmentName (Picture 3.1 — 5 rows, employees 103–107, department 60 IT).</p>|||<p><b>Câu 3</b> (1 điểm)</p><p>Viết truy vấn tìm nhân viên làm ở phòng 'IT'. Kết quả gồm EmployeeID, FirstName, LastName, DepartmentID, DepartmentName (Picture 3.1 — 5 dòng, nhân viên 103–107, phòng 60 IT).</p>",
          "starterCode": "-- DBI202 PE SP26-1 · Q3.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "SELECT e.EmployeeID, e.FirstName, e.LastName, d.DepartmentID, d.DepartmentName\nFROM Employees e\nJOIN Departments d ON d.DepartmentID = e.DepartmentID\nWHERE d.DepartmentName = 'IT';",
          "expectedOutput": "EmployeeID | FirstName | LastName  | DepartmentID | DepartmentName\n-----------+-----------+-----------+--------------+---------------\n103        | Alexander | Hunold    | 60           | IT            \n104        | Bruce     | Ernst     | 60           | IT            \n105        | David     | Austin    | 60           | IT            \n106        | Valli     | Pataballa | 60           | IT            \n107        | Diana     | Lorentz   | 60           | IT            \n(5 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 5 rows, identical to Picture 3.1.</p><p>Join Employees with Departments (DepartmentName lives only in Departments) and filter by the <b>name</b> 'IT', not by a hard-coded id 60. Trap: <code>LIKE '%IT%'</code> would also catch “IT Support” / “IT Helpdesk”.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 5 dòng, khớp Picture 3.1.</p><p>JOIN Employees với Departments (DepartmentName chỉ có ở Departments) và lọc theo <b>tên</b> 'IT', không gõ cứng mã 60. Bẫy: <code>LIKE '%IT%'</code> sẽ dính cả “IT Support”, “IT Helpdesk”.</p>",
          "rubric": [
            {
              "id": "join",
              "criterion": "Correct JOIN Employees–Departments on DepartmentID.|||JOIN đúng Employees–Departments theo DepartmentID.",
              "weight": 0.5,
              "maxScore": 0.5
            },
            {
              "id": "filter",
              "criterion": "Filters DepartmentName = 'IT' and returns the 5 requested columns.|||Lọc DepartmentName = 'IT' và trả đúng 5 cột.",
              "weight": 0.5,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE1/q4.png",
          "prompt": "<p><b>Question 4</b> (1 mark)</p><p>Write a query to display JobID, JobTitle of jobs that have more employees than the 'IT_PROG' job (Picture 4.1 — 1 row: ST_CLERK, Shipper Clerk).</p>|||<p><b>Câu 4</b> (1 điểm)</p><p>Viết truy vấn hiển thị JobID, JobTitle của các công việc có nhiều nhân viên hơn công việc 'IT_PROG' (Picture 4.1 — 1 dòng: ST_CLERK, Shipper Clerk).</p>",
          "starterCode": "-- DBI202 PE SP26-1 · Q4.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "SELECT j.JobID, j.JobTitle\nFROM Jobs j\nJOIN Employees e ON e.JobID = j.JobID\nGROUP BY j.JobID, j.JobTitle\nHAVING COUNT(e.EmployeeID) > (SELECT COUNT(*) FROM Employees WHERE JobID = 'IT_PROG');",
          "expectedOutput": "JobID    | JobTitle     \n---------+--------------\nST_CLERK | Shipper Clerk\n(1 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 1 row (ST_CLERK), identical to Picture 4.1.</p><p><code>GROUP BY</code> job + <code>HAVING COUNT(*) &gt; (scalar subquery counting IT_PROG)</code>. In the data IT_PROG has 5 employees; only ST_CLERK (20) has more — ST_MAN, PU_CLERK, FI_ACCOUNT, SA_MAN also have exactly 5 and must NOT appear (strictly greater). Trap: putting the aggregate in <code>WHERE</code> (not allowed), or hard-coding 5.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 1 dòng (ST_CLERK), khớp Picture 4.1.</p><p><code>GROUP BY</code> theo công việc + <code>HAVING COUNT(*) &gt; (truy vấn con vô hướng đếm IT_PROG)</code>. Dữ liệu: IT_PROG có 5 người; chỉ ST_CLERK (20) nhiều hơn — ST_MAN, PU_CLERK, FI_ACCOUNT, SA_MAN cũng đúng 5 nên KHÔNG được hiện (lớn hơn hẳn). Bẫy: đặt hàm gộp trong <code>WHERE</code> (không hợp lệ), hoặc gõ cứng số 5.</p>",
          "rubric": [
            {
              "id": "group",
              "criterion": "Groups by job and counts employees per job.|||Gom nhóm theo công việc và đếm nhân viên mỗi nhóm.",
              "weight": 0.5,
              "maxScore": 0.5
            },
            {
              "id": "having",
              "criterion": "HAVING compares with a subquery counting 'IT_PROG' (no hard-coded number), strictly greater.|||HAVING so với truy vấn con đếm 'IT_PROG' (không gõ cứng số), lớn hơn hẳn.",
              "weight": 0.5,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE1/q5.png",
          "prompt": "<p><b>Question 5</b> (1 mark)</p><p>Write a query that finds employees working in departments located in Europe. The result includes EmployeeID, FirstName, LastName, Email, Phone, JobID, Salary, DepartmentID, DepartmentName, ordered by Salary in descending order (Picture 5.1 — 5 rows, the Sales managers 145–149 of department 80).</p>|||<p><b>Câu 5</b> (1 điểm)</p><p>Viết truy vấn tìm nhân viên làm ở các phòng đặt tại châu Âu (Europe). Kết quả gồm EmployeeID, FirstName, LastName, Email, Phone, JobID, Salary, DepartmentID, DepartmentName, sắp theo Salary giảm dần (Picture 5.1 — 5 dòng, các quản lý Sales 145–149 của phòng 80).</p>",
          "starterCode": "-- DBI202 PE SP26-1 · Q5.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "SELECT e.EmployeeID, e.FirstName, e.LastName, e.Email, e.Phone, e.JobID, e.Salary,\n       d.DepartmentID, d.DepartmentName\nFROM Employees e\nJOIN Departments d ON d.DepartmentID = e.DepartmentID\nJOIN Locations  l ON l.LocationID  = d.LocationID\nJOIN Countries  c ON c.CountryID   = l.CountryID\nJOIN Regions    r ON r.RegionID    = c.RegionID\nWHERE r.RegionName = 'Europe'\nORDER BY e.Salary DESC;",
          "expectedOutput": "EmployeeID | FirstName | LastName  | Email    | Phone              | JobID  | Salary | DepartmentID | DepartmentName\n-----------+-----------+-----------+----------+--------------------+--------+--------+--------------+---------------\n145        | John      | Russell   | JRUSSEL  | 011.44.1344.429268 | SA_MAN | 14000  | 80           | Sales         \n146        | Karen     | Partners  | KPARTNER | 011.44.1344.467268 | SA_MAN | 13500  | 80           | Sales         \n147        | Alberto   | Errazuriz | AERRAZUR | 011.44.1344.429278 | SA_MAN | 12000  | 80           | Sales         \n148        | Gerald    | Cambrault | GCAMBRAU | 011.44.1344.619268 | SA_MAN | 11000  | 80           | Sales         \n149        | Eleni     | Zlotkey   | EZLOTKEY | 011.44.1344.429018 | SA_MAN | 10500  | 80           | Sales         \n(5 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 5 rows in the same order as Picture 5.1.</p><p>The chain Employees → Departments → Locations → Countries → Regions (4 joins) and <code>RegionName = 'Europe'</code>. Europe has departments 40 (Human Resources), 70 (Public Relations) and 80 (Sales), but only Sales has employees ⇒ 5 rows. Trap: stopping at Countries and filtering country names by hand.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 5 dòng, đúng thứ tự Picture 5.1.</p><p>Chuỗi Employees → Departments → Locations → Countries → Regions (4 phép JOIN) và <code>RegionName = 'Europe'</code>. Châu Âu có phòng 40 (Human Resources), 70 (Public Relations), 80 (Sales) nhưng chỉ Sales có nhân viên ⇒ 5 dòng. Bẫy: dừng ở Countries rồi tự liệt kê tên nước.</p>",
          "rubric": [
            {
              "id": "joins",
              "criterion": "Correct join path Employees→Departments→Locations→Countries→Regions.|||Đường JOIN đúng Employees→Departments→Locations→Countries→Regions.",
              "weight": 0.5,
              "maxScore": 0.5
            },
            {
              "id": "filter-order",
              "criterion": "RegionName = 'Europe', the 9 requested columns, ORDER BY Salary DESC.|||RegionName = 'Europe', đủ 9 cột, ORDER BY Salary DESC.",
              "weight": 0.5,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE1/q6.png",
          "prompt": "<p><b>Question 6</b> (1 mark)</p><p>Write a query that finds employees earning the maximum salary in their department. The result includes EmployeeID, FirstName, LastName, Email, Phone, JobID, HireDate, Salary, DepartmentID, DepartmentName, ordered by Salary in descending order (Picture 6.1 — 6 rows: King 24000 Executive, Russell 14000 Sales, Greenberg 12000 Finance, Raphaely 11000 Purchasing, Hunold 9000 IT, Fripp 8200 Shipping).</p>|||<p><b>Câu 6</b> (1 điểm)</p><p>Viết truy vấn tìm nhân viên có lương cao nhất trong phòng của mình. Kết quả gồm EmployeeID, FirstName, LastName, Email, Phone, JobID, HireDate, Salary, DepartmentID, DepartmentName, sắp theo Salary giảm dần (Picture 6.1 — 6 dòng: King 24000 Executive, Russell 14000 Sales, Greenberg 12000 Finance, Raphaely 11000 Purchasing, Hunold 9000 IT, Fripp 8200 Shipping).</p>",
          "starterCode": "-- DBI202 PE SP26-1 · Q6.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "SELECT e.EmployeeID, e.FirstName, e.LastName, e.Email, e.Phone, e.JobID, e.HireDate, e.Salary,\n       d.DepartmentID, d.DepartmentName\nFROM Employees e\nJOIN Departments d ON d.DepartmentID = e.DepartmentID\nWHERE e.Salary = (SELECT MAX(e2.Salary) FROM Employees e2 WHERE e2.DepartmentID = e.DepartmentID)\nORDER BY e.Salary DESC;",
          "expectedOutput": "EmployeeID | FirstName | LastName  | Email    | Phone              | JobID   | HireDate                | Salary | DepartmentID | DepartmentName\n-----------+-----------+-----------+----------+--------------------+---------+-------------------------+--------+--------------+---------------\n100        | Steven    | King      | SKING    | 515.123.4567       | AD_PRES | 2003-06-17 00:00:00.000 | 24000  | 90           | Executive     \n145        | John      | Russell   | JRUSSEL  | 011.44.1344.429268 | SA_MAN  | 2004-10-01 00:00:00.000 | 14000  | 80           | Sales         \n108        | Nancy     | Greenberg | NGREENBE | 515.124.4569       | FI_MGR  | 2002-08-17 00:00:00.000 | 12000  | 100          | Finance       \n114        | Den       | Raphaely  | DRAPHEAL | 515.127.4561       | PU_MAN  | 2002-12-07 00:00:00.000 | 11000  | 30           | Purchasing    \n103        | Alexander | Hunold    | AHUNOLD  | 590.423.4567       | IT_PROG | 2006-01-03 00:00:00.000 | 9000   | 60           | IT            \n121        | Adam      | Fripp     | AFRIPP   | 650.123.2234       | ST_MAN  | 2005-04-10 00:00:00.000 | 8200   | 50           | Shipping      \n(6 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 6 rows in the same order as Picture 6.1.</p><p>Correlated subquery: keep an employee when his salary equals <code>MAX(Salary)</code> of <b>his own</b> department (<code>e2.DepartmentID = e.DepartmentID</code>). Ties would all be kept, which is what “employees earning the maximum” means. Trap: <code>GROUP BY DepartmentID</code> with MAX alone loses the employee columns; comparing with the global MAX returns only King. HireDate is a <code>date</code> column (SSMS shows 2003-06-17).</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 6 dòng, đúng thứ tự Picture 6.1.</p><p>Truy vấn con tương quan: giữ nhân viên có lương bằng <code>MAX(Salary)</code> của <b>chính phòng mình</b> (<code>e2.DepartmentID = e.DepartmentID</code>). Nếu đồng hạng thì giữ hết — đúng nghĩa “những nhân viên có lương cao nhất”. Bẫy: chỉ <code>GROUP BY DepartmentID</code> + MAX thì mất các cột nhân viên; so với MAX toàn bảng thì chỉ ra King. HireDate kiểu <code>date</code> (SSMS hiện 2003-06-17).</p>",
          "rubric": [
            {
              "id": "max-per-dept",
              "criterion": "Maximum computed per department (correlated subquery, window function or join with grouped MAX).|||Tính MAX theo từng phòng (truy vấn con tương quan, hàm cửa sổ hoặc JOIN với bảng MAX đã gom nhóm).",
              "weight": 0.6,
              "maxScore": 0.6
            },
            {
              "id": "cols-order",
              "criterion": "All 10 requested columns incl. DepartmentName, ORDER BY Salary DESC.|||Đủ 10 cột kể cả DepartmentName, ORDER BY Salary DESC.",
              "weight": 0.4,
              "maxScore": 0.4
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE1/q7.png",
          "prompt": "<p><b>Question 7</b> (1 mark)</p><p>Write a query that finds regions where every department has at least one employee. The result includes the column RegionName (Picture 7.1 — Asia, Middle East and Africa, Africa).</p>|||<p><b>Câu 7</b> (1 điểm)</p><p>Viết truy vấn tìm các vùng (region) mà mọi phòng ban trong vùng đều có ít nhất một nhân viên. Kết quả gồm cột RegionName (Picture 7.1 — Asia, Middle East and Africa, Africa).</p>",
          "starterCode": "-- DBI202 PE SP26-1 · Q7.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "SELECT r.RegionName\nFROM Regions r\nWHERE NOT EXISTS (\n    SELECT 1\n    FROM Departments d\n    JOIN Locations l ON l.LocationID = d.LocationID\n    JOIN Countries c ON c.CountryID  = l.CountryID\n    WHERE c.RegionID = r.RegionID\n      AND NOT EXISTS (SELECT 1 FROM Employees e WHERE e.DepartmentID = d.DepartmentID)\n);",
          "expectedOutput": "RegionName            \n----------------------\nAsia                  \nMiddle East and Africa\nAfrica                \n(3 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 3 rows, identical to Picture 7.1.</p><p>“For every … at least one” = relational division ⇒ double <code>NOT EXISTS</code>: a region qualifies when there is <b>no</b> department in it that has <b>no</b> employee. Why do Asia, Middle East and Africa, Africa appear? None of them has any department, so the condition is <b>vacuously true</b> — exactly what the expected picture shows. Europe fails (departments 40, 70 are empty) and Americas fails (10, 20, 110–240 are empty). Trap: an INNER JOIN + <code>GROUP BY … HAVING</code> version never sees regions without departments and returns nothing.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: 3 dòng, khớp Picture 7.1.</p><p>“Mọi … đều có ít nhất một” = phép chia quan hệ ⇒ hai lớp <code>NOT EXISTS</code>: vùng đạt khi <b>không tồn tại</b> phòng nào trong vùng mà <b>không có</b> nhân viên. Vì sao ra Asia, Middle East and Africa, Africa? Ba vùng này không có phòng nào, nên điều kiện <b>đúng một cách rỗng (vacuous truth)</b> — đúng như hình mong đợi. Europe trượt (phòng 40, 70 trống), Americas trượt (10, 20, 110–240 trống). Bẫy: viết bằng INNER JOIN + <code>GROUP BY … HAVING</code> thì không bao giờ thấy vùng không có phòng ⇒ kết quả rỗng.</p>",
          "rubric": [
            {
              "id": "division",
              "criterion": "Expresses “every department has an employee” as division (NOT EXISTS … NOT EXISTS, or equivalent counting that keeps regions without departments).|||Diễn đạt “mọi phòng đều có nhân viên” bằng phép chia (NOT EXISTS … NOT EXISTS, hoặc đếm tương đương mà vẫn giữ vùng không có phòng).",
              "weight": 0.7,
              "maxScore": 0.7
            },
            {
              "id": "path",
              "criterion": "Correct path Regions→Countries→Locations→Departments; returns RegionName only.|||Đường nối đúng Regions→Countries→Locations→Departments; chỉ trả RegionName.",
              "weight": 0.3,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE1/q8.png",
          "prompt": "<p><b>Question 8</b> (1 mark)</p><p>Create a stored procedure named <b>prNumberOfDepartments</b> that calculates the number of departments in a given country, where <code>@countryID varchar(10)</code> is an input parameter and <code>@numberOfDepartments int</code> is an output parameter.</p><pre><code class=\"language-sql\">declare @x int\nexec prNumberOfDepartments 'UK', @x output\nselect @x as NumberOfDepartments</code></pre><p>Expected result (Picture 8.1): NumberOfDepartments = 2.</p>|||<p><b>Câu 8</b> (1 điểm)</p><p>Tạo stored procedure tên <b>prNumberOfDepartments</b> tính số phòng ban ở một quốc gia cho trước, với <code>@countryID varchar(10)</code> là tham số vào và <code>@numberOfDepartments int</code> là tham số ra (output). Chạy đoạn lệnh trên phải ra NumberOfDepartments = 2 (Picture 8.1).</p>",
          "starterCode": "-- DBI202 PE SP26-1 · Q8.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "CREATE PROCEDURE prNumberOfDepartments\n    @countryID varchar(10),\n    @numberOfDepartments int OUTPUT\nAS\nBEGIN\n    SELECT @numberOfDepartments = COUNT(d.DepartmentID)\n    FROM Departments d\n    JOIN Locations l ON l.LocationID = d.LocationID\n    WHERE l.CountryID = @countryID;\nEND",
          "expectedOutput": "-- Lệnh thử (KHÔNG nộp kèm):\ndeclare @x int\nexec prNumberOfDepartments 'UK', @x output\nselect @x as NumberOfDepartments\n\nNumberOfDepartments\n-------------------\n2                  \n(1 rows)\n\nNumberOfDepartments_VN\n----------------------\n0                     \n(1 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: the test block prints 2 (and 0 for a country without departments).</p><p>Departments has no CountryID — the country is reached through <code>Locations</code>. UK has departments 40 and 80 ⇒ 2. Use <code>COUNT(...)</code> so a country with no department gives 0 (not NULL) — checked with 'VN'. Traps: declaring the parameter without <code>OUTPUT</code>; using <code>RETURN</code> or <code>SELECT</code> to show the value instead of assigning the output parameter; submitting the test lines.</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: đoạn thử in 2 (và 0 với nước không có phòng).</p><p>Departments không có CountryID — phải đi qua <code>Locations</code>. UK có phòng 40 và 80 ⇒ 2. Dùng <code>COUNT(...)</code> để nước không có phòng ra 0 (không NULL) — đã thử với 'VN'. Bẫy: khai tham số mà thiếu <code>OUTPUT</code>; dùng <code>RETURN</code>/<code>SELECT</code> hiển thị thay vì gán vào tham số ra; nộp kèm lệnh chạy thử.</p>",
          "rubric": [
            {
              "id": "signature",
              "criterion": "Correct name and parameters @countryID varchar(10), @numberOfDepartments int OUTPUT.|||Đúng tên và tham số @countryID varchar(10), @numberOfDepartments int OUTPUT.",
              "weight": 0.4,
              "maxScore": 0.4
            },
            {
              "id": "count",
              "criterion": "Counts departments through Locations.CountryID and assigns it to the output parameter.|||Đếm phòng qua Locations.CountryID và gán vào tham số ra.",
              "weight": 0.6,
              "maxScore": 0.6
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE1/q9.png",
          "prompt": "<p><b>Question 9</b> (1 mark)</p><p>Create a trigger named <b>Tr1</b> for the insert statement on table Employees so that when one or more employees are inserted, the system displays the EmployeeID, FirstName, LastName, DepartmentID, DepartmentName of the inserted employees.</p><pre><code class=\"language-sql\">insert into Employees(EmployeeID,FirstName,LastName,Email,JobID,DepartmentID) values\n(1003,'Eee','Ggg','eee.ggg@gmail.com','SH_CLERK',50)</code></pre><p>Expected result (Picture 9.1): 1003, Eee, Ggg, 50, Shipping.</p>|||<p><b>Câu 9</b> (1 điểm)</p><p>Tạo trigger tên <b>Tr1</b> cho lệnh insert trên bảng Employees: khi chèn một hoặc nhiều nhân viên, hệ thống hiển thị EmployeeID, FirstName, LastName, DepartmentID, DepartmentName của các nhân viên vừa chèn. Lệnh insert trên phải hiện 1003, Eee, Ggg, 50, Shipping (Picture 9.1).</p>",
          "starterCode": "-- DBI202 PE SP26-1 · Q9.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "CREATE TRIGGER Tr1 ON Employees\nAFTER INSERT\nAS\nBEGIN\n    SELECT i.EmployeeID, i.FirstName, i.LastName, i.DepartmentID, d.DepartmentName\n    FROM inserted i\n    JOIN Departments d ON d.DepartmentID = i.DepartmentID;\nEND",
          "expectedOutput": "-- Lệnh thử (bọc BEGIN TRAN … ROLLBACK để không đổi dữ liệu):\nBEGIN TRAN\ninsert into Employees(EmployeeID,FirstName,LastName,Email,JobID,DepartmentID) values\n(1003,'Eee','Ggg','eee.ggg@gmail.com','SH_CLERK',50)\nROLLBACK\n\nEmployeeID | FirstName | LastName | DepartmentID | DepartmentName\n-----------+-----------+----------+--------------+---------------\n1003       | Eee       | Ggg      | 50           | Shipping      \n(1 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: the test insert displays exactly Picture 9.1.</p><p><code>AFTER INSERT</code> trigger that SELECTs from the pseudo-table <code>inserted</code> joined to Departments for the name. Reading <code>inserted</code> as a set handles multi-row inserts automatically. Traps: <code>DECLARE @id … SELECT @id = EmployeeID FROM inserted</code> (only one row survives); <code>INSTEAD OF</code> (the row would not be saved).</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: lệnh insert thử hiện đúng Picture 9.1.</p><p>Trigger <code>AFTER INSERT</code> SELECT từ bảng ảo <code>inserted</code> JOIN Departments để lấy tên phòng. Đọc <code>inserted</code> như một tập hợp nên tự xử lý được insert nhiều dòng. Bẫy: <code>DECLARE @id … SELECT @id = EmployeeID FROM inserted</code> (chỉ giữ được 1 dòng); dùng <code>INSTEAD OF</code> (dòng không được lưu).</p>",
          "rubric": [
            {
              "id": "trigger",
              "criterion": "CREATE TRIGGER Tr1 ON Employees AFTER/FOR INSERT.|||CREATE TRIGGER Tr1 ON Employees AFTER/FOR INSERT.",
              "weight": 0.4,
              "maxScore": 0.4
            },
            {
              "id": "inserted",
              "criterion": "Selects the 5 columns from inserted joined to Departments (works for many rows).|||SELECT 5 cột từ inserted JOIN Departments (đúng cả khi chèn nhiều dòng).",
              "weight": 0.6,
              "maxScore": 0.6
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "sql",
          "imageUrl": "https://media.cuongthai.com/images/exam-questions/DBI202/PE1/q10.png",
          "prompt": "<p><b>Question 10</b> (1 mark)</p><p>Write a query that deletes employees working in the 'IT' department.</p>|||<p><b>Câu 10</b> (1 điểm)</p><p>Viết câu lệnh xoá các nhân viên làm ở phòng 'IT'.</p>",
          "starterCode": "-- DBI202 PE SP26-1 · Q10.sql\n-- Database: chạy DBscript.sql của đề trước (từ câu 2 trở đi).\n-- Chỉ viết các lệnh trả lời câu hỏi: KHÔNG \"GO\", KHÔNG USE / CREATE DATABASE / ALTER DATABASE,\n-- KHÔNG kèm lệnh chạy thử (exec / insert test…) — sai một điều là 0 điểm cả bài.\n\n",
          "sampleSolution": "DELETE FROM Employees\nWHERE DepartmentID IN (SELECT DepartmentID FROM Departments WHERE DepartmentName = 'IT');",
          "expectedOutput": "-- Kiểm (BEGIN TRAN … ROLLBACK): xoá xong phòng 60 còn 0 người, tổng 50 → 45\nRemainingITEmployees\n--------------------\n0                   \n(1 rows)\n\nTotalEmployees\n--------------\n45            \n(1 rows)",
          "explanation": "<p>✅ <b>Run for real</b> on SQL Server 2022 with the paper's <code>DBscript.sql</code>: 5 rows deleted, no FK error (checked inside a rolled-back transaction).</p><p><code>DELETE … WHERE DepartmentID IN (subquery on DepartmentName = 'IT')</code> — 5 rows. Self-reference trap: employees 104–107 have <code>ManagerID = 103</code> (Hunold, also IT). Because all five are deleted in <b>one</b> statement, SQL Server checks the FK at the end of the statement and it succeeds; deleting Hunold alone first would fail with a REFERENCE constraint error. No other table references Employees by FK (Departments.ManagerID is not a foreign key).</p>|||<p>✅ <b>Đã chạy thật</b> trên SQL Server 2022 với <code>DBscript.sql</code> của đề: xoá 5 dòng, không lỗi khoá ngoại (kiểm trong giao tác rồi ROLLBACK).</p><p><code>DELETE … WHERE DepartmentID IN (truy vấn con DepartmentName = 'IT')</code> — 5 dòng. Bẫy tự tham chiếu: nhân viên 104–107 có <code>ManagerID = 103</code> (Hunold, cũng ở IT). Vì xoá cả 5 trong <b>một</b> câu lệnh, SQL Server kiểm khoá ngoại ở cuối câu lệnh nên thành công; nếu xoá riêng Hunold trước sẽ lỗi REFERENCE constraint. Không bảng nào khác tham chiếu Employees bằng khoá ngoại (Departments.ManagerID không phải FK).</p>",
          "rubric": [
            {
              "id": "delete",
              "criterion": "DELETE FROM Employees filtered by the 'IT' department name (subquery or DELETE … JOIN).|||DELETE FROM Employees lọc theo tên phòng 'IT' (truy vấn con hoặc DELETE … JOIN).",
              "weight": 0.7,
              "maxScore": 0.7
            },
            {
              "id": "scope",
              "criterion": "Deletes only IT employees, in one statement, nothing else.|||Chỉ xoá nhân viên IT, trong một câu lệnh, không xoá gì khác.",
              "weight": 0.3,
              "maxScore": 0.3
            }
          ]
        }
      ]
    }
  ]
};
