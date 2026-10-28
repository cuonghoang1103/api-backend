/**
 * DBI202 · Chương 6 — LAB 6 (bản in): 8 câu báo cáo trên FUHCompany, mỗi câu một tệp Q1.sql … Q8.sql như PE,
 * thang 10 (8 × 1,25). Đề MỚI theo dạng đề trường; mỗi câu có kiểm mẫu + kiểm ẩn đổi dữ liệu.
 */
import { doiDau, KHOA, FUH, deLonSql, kq, kqAn, TN } from './_chung.mjs';

const THEM = `INSERT INTO tblDepartment (depNum, depName, mgrSSN, mgrAssDate) VALUES (6, N'Phòng Đào tạo', 30121050012, '2026-01-01');
INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES
 (30121050095, N'Ngô Bảo Châu', N'5 Điện Biên Phủ, Q.3, TP Hồ Chí Minh', 39000, 'M', '1987-02-02', 6, 30121050012),
 (30121050096, N'Đinh Thị Hoa', N'18 Lý Tự Trọng, TP Hồ Chí Minh', 38000, 'F', '1989-12-31', 5, 30121050037),
 (30121050097, N'Lạc Văn Phúc', NULL, 70000, 'M', '1980-01-01', 4, 30121050030);
INSERT INTO tblProject (proNum, proName, locNum, depNum) VALUES (7, N'ProjectG', 4, 6), (8, N'ProjectH', 3, 4);
INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES (30121050095, 7, 20.0), (30121050097, 6, 12.0), (30121050097, 8, 9.0), (30121050030, 8, 3.0), (30121050004, 1, 6.0)`;

const MO_HINH = [
  { ten: 'tblEmployee', truong: [['empSSN', 'DECIMAL(18,0)', 'PK'], ['empName', 'NVARCHAR(50)', ''], ['empAddress', 'NVARCHAR(100)', 'NULL allowed'], ['empSalary', 'DECIMAL(10,0)', '> 0'], ['empSex', 'CHAR(1)', "'F' / 'M'"], ['empBirthdate', 'DATE', 'NULL allowed'], ['depNum', 'INT', 'FK → tblDepartment'], ['supervisorSSN', 'DECIMAL(18,0)', 'FK → tblEmployee (NULL = director)']] },
  { ten: 'tblDepartment', truong: [['depNum', 'INT', 'PK'], ['depName', 'NVARCHAR(50)', 'UNIQUE'], ['mgrSSN', 'DECIMAL(18,0)', 'FK → tblEmployee (manager)'], ['mgrAssDate', 'DATE', '']] },
  { ten: 'tblProject', truong: [['proNum', 'INT', 'PK'], ['proName', 'NVARCHAR(50)', ''], ['locNum', 'INT', 'FK → tblLocation'], ['depNum', 'INT', 'FK → tblDepartment (controlling department)']] },
  { ten: 'tblWorksOn', truong: [['empSSN, proNum', 'DECIMAL(18,0), INT', 'PK; FKs'], ['workHours', 'DECIMAL(5,1)', '≥ 0']] },
  { ten: 'tblLocation · tblDepLocation · tblDependent', truong: [['tblLocation', 'locNum PK, locName UNIQUE', ''], ['tblDepLocation', '(depNum, locNum) PK', 'offices of departments'], ['tblDependent', '(empSSN, depName) PK', 'depSex, depBirthdate, depRelationship']] },
];

export default doiDau({
  slug: 'dbi202-6-lab-fuhcompany-reports',
  ten: 'Lab 6 — FUHCompany management reports (8 queries)',
  khoa: KHOA,
  baiHoc: 'dbi202-on-ch6',
  de: [
    deLonSql({
      dangBai: 'lab',
      tieuDe: 'Lab 6 — FUHCompany management reports',
      doKho: 'HARD', phut: 90, diem: 100,
      khaiNiem: ['LIKE', 'multi-table join', 'outer join + COUNT', 'GROUP BY / HAVING', 'relational division', 'minimum per group'],
      tienQuyet: ['6.1–6.4 of this track'],
      the: ['dbi202', 'lab', 'sql', 'fuhcompany'],
      csdl: FUH, tenCsdl: 'FUHCompany',
      thuMuc: 'RollNo_Name_DBI202_Lab6',
      moHinh: MO_HINH,
      phu: { en: 'DBI202 · Chapter 6 — SQL queries · Suggested time: 90 minutes · Total: 10 marks (8 × 1.25)', vi: 'DBI202 · Chương 6 — Truy vấn SQL · Thời gian gợi ý: 90 phút · Tổng: 10 điểm (8 × 1,25)' },
      moTa: {
        en: '<p>The board of FUHCompany asks for eight management reports. The database is the course\'s sample company (7 tables: employees, departments, projects, assignments, locations, department offices, dependents). Write each report as <b>one standard SQL query</b> in its own file — the same rules as the Practical Exam.</p>',
        vi: '<p>Ban giám đốc FUHCompany cần tám báo cáo quản trị. CSDL là công ty mẫu của môn (7 bảng: nhân viên, phòng, dự án, phân công, địa điểm, văn phòng của phòng, người phụ thuộc). Viết mỗi báo cáo bằng <b>một câu SQL chuẩn</b> trong tệp riêng — cùng quy định như bài thi thực hành.</p>',
      },
      chucNangChinh: [
        { en: 'Filtering text and dates, joining up to four tables.', vi: 'Lọc chữ và ngày, nối tới bốn bảng.' },
        { en: 'Counting with outer joins, grouping, HAVING.', vi: 'Đếm có outer join, gộp nhóm, HAVING.' },
        { en: 'Relational division and minimum-per-group with ties.', vi: 'Phép chia quan hệ và nhỏ nhất theo nhóm có hoà.' },
      ],
      yeuCauChung: [
        { en: 'Column names/aliases and their order exactly as listed; row order only matters when the question says "order by".', vi: 'Tên cột/bí danh và thứ tự cột đúng như đề; thứ tự dòng chỉ quan trọng khi đề ghi "sắp theo".' },
        { en: 'Standard SQL that runs on both SQL Server and PostgreSQL: no TOP/LIMIT, ISNULL/IFNULL, YEAR(), ILIKE, ::. Text compares case-insensitively, as on SQL Server.', vi: 'SQL chuẩn chạy cả SQL Server lẫn PostgreSQL: không TOP/LIMIT, ISNULL, YEAR(), ILIKE, ::. Chuỗi so không phân biệt hoa thường như SQL Server.' },
        { en: 'Never hard-code numbers you can read from the data (hidden checks change the data).', vi: 'Không chép cứng con số đọc được từ dữ liệu (kiểm ẩn đổi dữ liệu).' },
      ],
      cau: [
        {
          ten: { en: 'Staff living in TP Hồ Chí Minh', vi: 'Nhân viên sống ở TP Hồ Chí Minh' }, diem: 1.25,
          moTa: { en: 'Employees whose address ends with "TP Hồ Chí Minh".', vi: 'Nhân viên có địa chỉ kết thúc bằng "TP Hồ Chí Minh".' },
          yeuCau: [{ en: 'Columns: <code>empSSN, empName, empAddress</code>; order by empSSN.', vi: 'Cột: <code>empSSN, empName, empAddress</code>; sắp theo empSSN.' }],
          giai: `SELECT empSSN, empName, empAddress
FROM tblEmployee
WHERE empAddress LIKE N'%TP Hồ Chí Minh'
ORDER BY empSSN;`,
          kiem: [kq('Q1 · staff in TP Hồ Chí Minh', { thuTu: true }), kqAn('Q1 · new staff', THEM, { thuTu: true })],
          saiMau: ["SELECT empSSN, empName, empAddress FROM tblEmployee WHERE empAddress LIKE N'%Hồ Chí Minh%' AND depNum = 1 ORDER BY empSSN"],
        },
        {
          ten: { en: 'Project directory', vi: 'Danh bạ dự án' }, diem: 1.25,
          moTa: { en: 'Every project with the name of its controlling department and of its location.', vi: 'Mọi dự án kèm tên phòng quản lý và tên địa điểm.' },
          yeuCau: [{ en: 'Columns: <code>proNum, proName, depName, locName</code>; order by proNum.', vi: 'Cột: <code>proNum, proName, depName, locName</code>; sắp theo proNum.' }],
          giai: `SELECT p.proNum, p.proName, d.depName, l.locName
FROM tblProject p
JOIN tblDepartment d ON d.depNum = p.depNum
JOIN tblLocation  l ON l.locNum = p.locNum
ORDER BY p.proNum;`,
          kiem: [kq('Q2 · project directory', { thuTu: true }), kqAn('Q2 · new projects', THEM, { thuTu: true })],
          saiMau: ['SELECT p.proNum, p.proName, d.depName, l.locName FROM tblProject p JOIN tblDepLocation dl ON dl.depNum = p.depNum JOIN tblDepartment d ON d.depNum = p.depNum JOIN tblLocation l ON l.locNum = dl.locNum ORDER BY p.proNum'],
        },
        {
          ten: { en: 'Projects per location, including empty locations', vi: 'Số dự án mỗi địa điểm, kể cả địa điểm trống' }, diem: 1.25,
          moTa: { en: 'For every location, the number of projects located there (0 if none).', vi: 'Với mọi địa điểm, số dự án đặt tại đó (0 nếu không có).' },
          yeuCau: [{ en: 'Columns: <code>locNum, locName, NumProjects</code>; order by locNum.', vi: 'Cột: <code>locNum, locName, NumProjects</code>; sắp theo locNum.' }],
          giai: `SELECT l.locNum, l.locName, COUNT(p.proNum) AS NumProjects
FROM tblLocation l
LEFT JOIN tblProject p ON p.locNum = l.locNum
GROUP BY l.locNum, l.locName
ORDER BY l.locNum;`,
          kiem: [kq('Q3 · projects per location', { thuTu: true }), kqAn('Q3 · after new projects', THEM, { thuTu: true })],
          saiMau: ['SELECT l.locNum, l.locName, COUNT(*) AS NumProjects FROM tblLocation l LEFT JOIN tblProject p ON p.locNum = l.locNum GROUP BY l.locNum, l.locName ORDER BY l.locNum'],
        },
        {
          ten: { en: 'Born in the 1980s', vi: 'Sinh trong thập niên 1980' }, diem: 1.25,
          moTa: { en: 'Employees born from 1 January 1980 to 31 December 1989, with their department name.', vi: 'Nhân viên sinh từ 01/01/1980 đến 31/12/1989, kèm tên phòng.' },
          yeuCau: [
            { en: 'Columns: <code>empSSN, empName, empBirthdate, depName</code>; order by empBirthdate.', vi: 'Cột: <code>empSSN, empName, empBirthdate, depName</code>; sắp theo empBirthdate.' },
            { en: 'Use a date range, not YEAR() (SQL Server only, and not index-friendly).', vi: 'Dùng khoảng ngày, không YEAR() (chỉ SQL Server và không dùng được chỉ mục).' },
          ],
          giai: `SELECT e.empSSN, e.empName, e.empBirthdate, d.depName
FROM tblEmployee e
JOIN tblDepartment d ON d.depNum = e.depNum
WHERE e.empBirthdate >= '1980-01-01' AND e.empBirthdate < '1990-01-01'
ORDER BY e.empBirthdate;`,
          kiem: [kq('Q4 · born in the 1980s', { thuTu: true }), kqAn('Q4 · with new staff', THEM, { thuTu: true })],
          saiMau: ["SELECT e.empSSN, e.empName, e.empBirthdate, d.depName FROM tblEmployee e JOIN tblDepartment d ON d.depNum = e.depNum WHERE e.empBirthdate > '1980-01-01' AND e.empBirthdate < '1989-12-31' ORDER BY e.empBirthdate"],
        },
        {
          ten: { en: 'Busy projects', vi: 'Dự án bận rộn' }, diem: 1.25,
          moTa: { en: 'Projects whose total working hours are at least 50, with the number of people and the total hours.', vi: 'Dự án có tổng giờ làm từ 50 trở lên, kèm số người và tổng giờ.' },
          yeuCau: [{ en: 'Columns: <code>proNum, proName, NumStaff, TotalHours</code>; order by TotalHours descending, then proNum.', vi: 'Cột: <code>proNum, proName, NumStaff, TotalHours</code>; sắp TotalHours giảm dần, rồi proNum.' }],
          giai: `SELECT p.proNum, p.proName, COUNT(*) AS NumStaff, SUM(w.workHours) AS TotalHours
FROM tblProject p
JOIN tblWorksOn w ON w.proNum = p.proNum
GROUP BY p.proNum, p.proName
HAVING SUM(w.workHours) >= 50
ORDER BY TotalHours DESC, p.proNum;`,
          kiem: [kq('Q5 · busy projects', { thuTu: true }), kqAn('Q5 · after new assignments', THEM, { thuTu: true })],
          saiMau: ['SELECT p.proNum, p.proName, COUNT(*) AS NumStaff, SUM(w.workHours) AS TotalHours FROM tblProject p JOIN tblWorksOn w ON w.proNum = p.proNum GROUP BY p.proNum, p.proName HAVING SUM(w.workHours) > 50 ORDER BY TotalHours DESC, p.proNum'],
        },
        {
          ten: { en: 'Departments and their managers', vi: 'Các phòng và trưởng phòng' }, diem: 1.25,
          moTa: { en: 'Every department with its manager\'s name and the number of employees in the department.', vi: 'Mọi phòng kèm tên trưởng phòng và số nhân viên của phòng.' },
          yeuCau: [{ en: 'Columns: <code>depNum, depName, ManagerName, NumEmployees</code>; order by depNum.', vi: 'Cột: <code>depNum, depName, ManagerName, NumEmployees</code>; sắp theo depNum.' }],
          giai: `SELECT d.depNum, d.depName, m.empName AS ManagerName,
       (SELECT COUNT(*) FROM tblEmployee e WHERE e.depNum = d.depNum) AS NumEmployees
FROM tblDepartment d
LEFT JOIN tblEmployee m ON m.empSSN = d.mgrSSN   -- the manager is ALSO a row of tblEmployee
ORDER BY d.depNum;`,
          kiem: [kq('Q6 · managers and headcount', { thuTu: true }), kqAn('Q6 · new department', THEM, { thuTu: true })],
          saiMau: ['SELECT d.depNum, d.depName, m.empName AS ManagerName, COUNT(*) AS NumEmployees FROM tblDepartment d JOIN tblEmployee m ON m.empSSN = d.mgrSSN JOIN tblEmployee e ON e.supervisorSSN = m.empSSN GROUP BY d.depNum, d.depName, m.empName ORDER BY d.depNum'],
        },
        {
          ten: { en: 'All projects of their own department (division)', vi: 'Làm mọi dự án của phòng mình (phép chia)' }, diem: 1.25,
          moTa: { en: 'Employees who work on <b>every</b> project controlled by their own department. Only consider departments that control at least one project.', vi: 'Nhân viên làm <b>mọi</b> dự án do phòng của họ quản lý. Chỉ xét phòng có ít nhất một dự án.' },
          yeuCau: [{ en: 'Columns: <code>empSSN, empName, depNum</code>; order by empSSN.', vi: 'Cột: <code>empSSN, empName, depNum</code>; sắp theo empSSN.' }],
          giai: `SELECT e.empSSN, e.empName, e.depNum
FROM tblEmployee e
WHERE EXISTS (SELECT 1 FROM tblProject p WHERE p.depNum = e.depNum)        -- the department has projects
  AND NOT EXISTS (SELECT 1                                                 -- no project of the department…
                  FROM tblProject p
                  WHERE p.depNum = e.depNum
                    AND NOT EXISTS (SELECT 1 FROM tblWorksOn w             -- …that the employee does NOT work on
                                    WHERE w.empSSN = e.empSSN AND w.proNum = p.proNum))
ORDER BY e.empSSN;`,
          kiem: [kq('Q7 · relational division', { thuTu: true }), kqAn('Q7 · new projects change the divisor', THEM, { thuTu: true })],
          saiMau: ['SELECT e.empSSN, e.empName, e.depNum FROM tblEmployee e WHERE NOT EXISTS (SELECT 1 FROM tblProject p WHERE p.depNum = e.depNum AND NOT EXISTS (SELECT 1 FROM tblWorksOn w WHERE w.empSSN = e.empSSN AND w.proNum = p.proNum)) ORDER BY e.empSSN'],
        },
        {
          ten: { en: 'Lowest paid of each department', vi: 'Lương thấp nhất mỗi phòng' }, diem: 1.25,
          moTa: { en: 'For each department, the employee(s) with the lowest salary in that department (all of them on a tie).', vi: 'Với mỗi phòng, (các) nhân viên lương thấp nhất phòng (hoà thì hiện hết).' },
          yeuCau: [{ en: 'Columns: <code>depNum, empSSN, empName, empSalary</code>; order by depNum, then empSSN.', vi: 'Cột: <code>depNum, empSSN, empName, empSalary</code>; sắp theo depNum, rồi empSSN.' }],
          giai: `SELECT e.depNum, e.empSSN, e.empName, e.empSalary
FROM tblEmployee e
WHERE e.empSalary = (SELECT MIN(x.empSalary) FROM tblEmployee x WHERE x.depNum = e.depNum)
ORDER BY e.depNum, e.empSSN;`,
          kiem: [kq('Q8 · lowest paid per department', { thuTu: true }), kqAn('Q8 · with a tie', THEM + `;
INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, depNum) VALUES (30121050098, N'Mạc Thị Na', 40000, 'F', 3)`, { thuTu: true })],
          saiMau: ['SELECT e.depNum, MIN(e.empSSN) AS empSSN, MIN(e.empName) AS empName, MIN(e.empSalary) AS empSalary FROM tblEmployee e GROUP BY e.depNum ORDER BY e.depNum'],
        },
      ],
      truDiem: [
        { en: 'Wrong column names/aliases or column order — the checker compares columns by position and name.', vi: 'Sai tên/bí danh hay thứ tự cột — máy chấm so cột theo vị trí và tên.' },
        { en: 'INNER JOIN where the question says "every … including …" (Q3, Q6).', vi: 'Dùng INNER JOIN khi đề ghi "mọi … kể cả …" (Q3, Q6).' },
        { en: 'TOP 1 / FETCH 1 ROW for "the lowest" — drops ties (Q8).', vi: 'TOP 1 / FETCH 1 ROW cho "thấp nhất" — mất dòng hoà (Q8).' },
        { en: 'Hard-coded numbers that only match today\'s data — hidden checks change the data.', vi: 'Chép cứng con số chỉ khớp dữ liệu hôm nay — kiểm ẩn đổi dữ liệu.' },
      ],
      nopBai: {
        en: 'Write each answer in its own tab (Q1.sql … Q8.sql). <b>Run</b> = sample checks; <b>Submit</b> = all checks (hidden ones change the data). The FUHCompany.sql tab is the database script — run it in SSMS to practise on real SQL Server.',
        vi: 'Viết mỗi câu trong tab riêng (Q1.sql … Q8.sql). <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm (kiểm ẩn đổi dữ liệu). Tab FUHCompany.sql là script CSDL — chạy trong SSMS để luyện trên SQL Server thật.',
      },
      thuatNgu: [TN.leftJoin, TN.having, { en: 'relational division', vi: 'phép chia quan hệ ("làm MỌI …")' }, TN.correlated, TN.exists],
      goiY: [
        'Làm câu dễ trước (Q1, Q2, Q4), rồi Q3/Q5/Q6 (gộp nhóm), cuối cùng Q7/Q8.',
        'Q7 "mọi dự án của phòng": KHÔNG tồn tại dự án nào của phòng mà nhân viên KHÔNG làm — hai lớp NOT EXISTS. Đừng quên phòng không có dự án (đề loại nó ra).',
        'Q8: so lương với MIN của chính phòng đó (truy vấn con tương quan) — giữ được người hoà.',
      ],
      loiHayGap: [
        { en: 'Q3 with COUNT(*) — empty locations show 1 instead of 0.', vi: 'Q3 dùng COUNT(*) — địa điểm trống hiện 1 thay vì 0.' },
        { en: 'Q6 counting employees via a second JOIN with GROUP BY on the manager — the count mixes up subordinates and department members.', vi: 'Q6 đếm nhân viên qua phép nối thứ hai gộp theo trưởng phòng — đếm lẫn cấp dưới với thành viên phòng.' },
        { en: 'Q7 with one NOT EXISTS only — employees of a department WITHOUT projects (department 5) qualify "vacuously".', vi: 'Q7 chỉ một tầng NOT EXISTS — nhân viên phòng KHÔNG có dự án (phòng 5) "thoả" một cách rỗng.' },
      ],
      giaiThich: { en: '<p>Each file is graded on a fresh copy of FUHCompany (and on a modified copy for the hidden checks). The reference answers use only standard SQL, so they run unchanged on SQL Server 2019+ and PostgreSQL.</p>', vi: '<p>Mỗi tệp được chấm trên một bản FUHCompany mới (và một bản đã đổi dữ liệu cho kiểm ẩn). Lời giải mẫu chỉ dùng SQL chuẩn nên chạy nguyên văn trên SQL Server 2019+ và PostgreSQL.</p>' },
    }),
  ],
});
