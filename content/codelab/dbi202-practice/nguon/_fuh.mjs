/**
 * FUHCompany — CSDL mẫu DÙNG CHUNG của môn DBI202 (slide trường dbi7/dbi8/dbi9), bản T-SQL y như
 * ~/Documents/FLM-nguon/_repo/DBI202/gen/sql/_setup/fuhcompany.sql (gói ch5 sở hữu — đổi dữ liệu là đổi kết quả
 * của mọi bài trong khoá). Ở đây chỉ bỏ chú thích và GO. Máy chấm nạp nó vào PostgreSQL qua csdlChoPg()
 * (NVARCHAR ⇒ CITEXT, PRIMARY KEY ⇒ UNIQUE…) để hành xử như SQL Server.
 *
 * 7 bảng · 14 nhân viên · 5 phòng · 6 dự án · 16 dòng phân công · 5 người phụ thuộc. Điểm đáng nhớ khi soạn đề:
 *   - 30121050021 (Bùi Văn Nam) empAddress NULL · 30121050038 (Phan Hữu Nghĩa) empBirthdate NULL
 *   - 30121050001 là giám đốc (supervisorSSN NULL) ⇒ cột supervisorSSN CÓ NULL (bẫy NOT IN)
 *   - TP Cần Thơ (4) không có phòng/dự án · Phòng Nghiên cứu (5) không có dự án · 037, 038 không làm dự án nào
 *   - tên tiếng Việt có dấu ⇒ ĐỪNG kiểm thứ tự theo tên (collation SQL Server ≠ PostgreSQL) — sắp theo số
 */
export const FUH = String.raw`
CREATE TABLE tblLocation (
    locNum   INT           NOT NULL,
    locName  NVARCHAR(50)  NOT NULL,
    CONSTRAINT pk_location      PRIMARY KEY (locNum),
    CONSTRAINT uq_location_name UNIQUE (locName)
);

CREATE TABLE tblDepartment (
    depNum      INT            NOT NULL,
    depName     NVARCHAR(50)   NOT NULL,
    mgrSSN      DECIMAL(18,0)  NULL,
    mgrAssDate  DATE           NULL,
    CONSTRAINT pk_department      PRIMARY KEY (depNum),
    CONSTRAINT uq_department_name UNIQUE (depName)
);

CREATE TABLE tblEmployee (
    empSSN         DECIMAL(18,0)  NOT NULL,
    empName        NVARCHAR(50)   NOT NULL,
    empAddress     NVARCHAR(100)  NULL,
    empSalary      DECIMAL(10,0)  NULL,
    empSex         CHAR(1)        NULL,
    empBirthdate   DATE           NULL,
    depNum         INT            NULL,
    supervisorSSN  DECIMAL(18,0)  NULL,
    CONSTRAINT pk_employee            PRIMARY KEY (empSSN),
    CONSTRAINT ck_employee_sex        CHECK (empSex IN ('F', 'M')),
    CONSTRAINT ck_employee_salary     CHECK (empSalary > 0),
    CONSTRAINT fk_employee_department FOREIGN KEY (depNum)        REFERENCES tblDepartment (depNum),
    CONSTRAINT fk_employee_supervisor FOREIGN KEY (supervisorSSN) REFERENCES tblEmployee (empSSN)
);

CREATE TABLE tblDepLocation (
    depNum  INT  NOT NULL,
    locNum  INT  NOT NULL,
    CONSTRAINT pk_deplocation            PRIMARY KEY (depNum, locNum),
    CONSTRAINT fk_deplocation_department FOREIGN KEY (depNum) REFERENCES tblDepartment (depNum),
    CONSTRAINT fk_deplocation_location   FOREIGN KEY (locNum) REFERENCES tblLocation (locNum)
);

CREATE TABLE tblProject (
    proNum   INT           NOT NULL,
    proName  NVARCHAR(50)  NOT NULL,
    locNum   INT           NULL,
    depNum   INT           NULL,
    CONSTRAINT pk_project            PRIMARY KEY (proNum),
    CONSTRAINT fk_project_location   FOREIGN KEY (locNum) REFERENCES tblLocation (locNum),
    CONSTRAINT fk_project_department FOREIGN KEY (depNum) REFERENCES tblDepartment (depNum)
);

CREATE TABLE tblWorksOn (
    empSSN     DECIMAL(18,0)  NOT NULL,
    proNum     INT            NOT NULL,
    workHours  DECIMAL(5,1)   NULL,
    CONSTRAINT pk_workson          PRIMARY KEY (empSSN, proNum),
    CONSTRAINT ck_workson_hours    CHECK (workHours >= 0),
    CONSTRAINT fk_workson_employee FOREIGN KEY (empSSN) REFERENCES tblEmployee (empSSN),
    CONSTRAINT fk_workson_project  FOREIGN KEY (proNum) REFERENCES tblProject (proNum)
);

CREATE TABLE tblDependent (
    depName          NVARCHAR(50)   NOT NULL,
    empSSN           DECIMAL(18,0)  NOT NULL,
    depSex           CHAR(1)        NULL,
    depBirthdate     DATE           NULL,
    depRelationship  NVARCHAR(30)   NULL,
    CONSTRAINT pk_dependent          PRIMARY KEY (empSSN, depName),
    CONSTRAINT ck_dependent_sex      CHECK (depSex IN ('F', 'M')),
    CONSTRAINT fk_dependent_employee FOREIGN KEY (empSSN) REFERENCES tblEmployee (empSSN)
);

ALTER TABLE tblDepartment
    ADD CONSTRAINT fk_department_manager FOREIGN KEY (mgrSSN) REFERENCES tblEmployee (empSSN);

INSERT INTO tblLocation (locNum, locName) VALUES
    (1, N'TP Hà Nội'),
    (2, N'TP Hồ Chí Minh'),
    (3, N'TP Đà Nẵng'),
    (4, N'TP Cần Thơ');

INSERT INTO tblDepartment (depNum, depName, mgrSSN, mgrAssDate) VALUES
    (1, N'Phòng Phần mềm trong nước', NULL, NULL),
    (2, N'Phòng Phần mềm nước ngoài', NULL, NULL),
    (3, N'Phòng Kinh doanh',          NULL, NULL),
    (4, N'Phòng Hành chính',          NULL, NULL),
    (5, N'Phòng Nghiên cứu',          NULL, NULL);

INSERT INTO tblEmployee (empSSN, empName, empAddress, empSalary, empSex, empBirthdate, depNum, supervisorSSN) VALUES
    (30121050001, N'Trần Minh Quang', N'45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh',     150000, 'M', '1968-03-12', 1, NULL),
    (30121050002, N'Hoàng Thị Hà',    N'12 Lê Lợi, Q.1, TP Hồ Chí Minh',         90000,  'F', '1985-07-20', 1, 30121050001),
    (30121050010, N'Phạm Quốc Bảo',   N'102 Kim Mã, Ba Đình, TP Hà Nội',         95000,  'M', '1978-09-09', 2, 30121050001),
    (30121050020, N'Nguyễn Thị Mai',  N'60 Bạch Đằng, Hải Châu, TP Đà Nẵng',     88000,  'F', '1980-06-25', 3, 30121050001),
    (30121050030, N'Huỳnh Văn Tài',   N'9 Võ Văn Tần, Q.3, TP Hồ Chí Minh',      70000,  'M', '1975-10-10', 4, 30121050001),
    (30121050037, N'Lý Thanh Tâm',    N'77 Hùng Vương, Hải Châu, TP Đà Nẵng',    65000,  'F', '1983-03-03', 5, 30121050001),
    (30121050003, N'Võ Việt Anh',     N'88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh',  60000,  'M', '1990-11-02', 1, 30121050002),
    (30121050004, N'Lê Thị Lan Anh',  N'21 Pasteur, Q.3, TP Hồ Chí Minh',        45000,  'F', '1995-01-15', 1, 30121050002),
    (30121050005, N'Mai Duy An',      N'7 Hàng Bài, Hoàn Kiếm, TP Hà Nội',       55000,  'M', '1992-05-30', 2, 30121050010),
    (30121050011, N'Hồ Ngọc Hân',     N'33 Cầu Giấy, TP Hà Nội',                 72000,  'F', '1988-12-01', 2, 30121050010),
    (30121050012, N'Đặng Tuấn Anh',   N'5 Láng Hạ, Đống Đa, TP Hà Nội',          105000, 'M', '1970-04-18', 2, 30121050010),
    (30121050021, N'Bùi Văn Nam',     NULL,                                      40000,  'M', '1998-02-14', 3, 30121050020),
    (30121050027, N'Trương Thị Thu',  N'14 Nguyễn Văn Linh, TP Đà Nẵng',         52000,  'F', '1993-08-08', 3, 30121050020),
    (30121050038, N'Phan Hữu Nghĩa',  N'3 Lý Thường Kiệt, TP Hà Nội',            38000,  'M', NULL,         5, 30121050037);

UPDATE tblDepartment SET mgrSSN = 30121050001, mgrAssDate = '2015-01-01' WHERE depNum = 1;
UPDATE tblDepartment SET mgrSSN = 30121050010, mgrAssDate = '2018-06-15' WHERE depNum = 2;
UPDATE tblDepartment SET mgrSSN = 30121050020, mgrAssDate = '2019-03-01' WHERE depNum = 3;
UPDATE tblDepartment SET mgrSSN = 30121050030, mgrAssDate = '2020-09-01' WHERE depNum = 4;
UPDATE tblDepartment SET mgrSSN = 30121050037, mgrAssDate = '2022-01-10' WHERE depNum = 5;

INSERT INTO tblDepLocation (depNum, locNum) VALUES
    (1, 1), (1, 2),
    (2, 1), (2, 2),
    (3, 2), (3, 3),
    (4, 1),
    (5, 3);

INSERT INTO tblProject (proNum, proName, locNum, depNum) VALUES
    (1, N'ProjectA', 1, 1),
    (2, N'ProjectB', 2, 1),
    (3, N'ProjectC', 1, 2),
    (4, N'ProjectD', 2, 2),
    (5, N'ProjectE', 3, 3),
    (6, N'ProjectF', 2, 4);

INSERT INTO tblWorksOn (empSSN, proNum, workHours) VALUES
    (30121050001, 1, 10.0),
    (30121050002, 1, 20.0),
    (30121050003, 1, 30.0),
    (30121050003, 2, 12.5),
    (30121050004, 2, 35.0),
    (30121050005, 2, 20.0),
    (30121050003, 3, 10.0),
    (30121050005, 3, 25.0),
    (30121050011, 3, 30.0),
    (30121050012, 3, 15.0),
    (30121050010, 4, 30.0),
    (30121050012, 4, 20.0),
    (30121050020, 5, 15.0),
    (30121050021, 5, 40.0),
    (30121050027, 5, 30.0),
    (30121050030, 6, 40.0);

INSERT INTO tblDependent (depName, empSSN, depSex, depBirthdate, depRelationship) VALUES
    (N'Phạm Thị Hoa',     30121050001, 'F', '1970-01-20', N'Vợ'),
    (N'Trần Minh Khang',  30121050001, 'M', '2000-05-05', N'Con trai'),
    (N'Nguyễn Văn Bình',  30121050002, 'M', '1983-09-12', N'Chồng'),
    (N'Phạm Gia Huy',     30121050010, 'M', '2010-02-02', N'Con trai'),
    (N'Trương Minh Châu', 30121050027, 'F', '2020-07-07', N'Con gái');
`;

/** Lược đồ (HTML) chèn vào mọi đề dùng FUHCompany. Khoá chính gạch chân, khoá ngoại in nghiêng. */
const BANG = [
  ['tblEmployee', '<u>empSSN</u> DECIMAL(18,0), empName NVARCHAR(50), empAddress NVARCHAR(100), empSalary DECIMAL(10,0), empSex CHAR(1) (F/M), empBirthdate DATE, <i>depNum</i> → tblDepartment, <i>supervisorSSN</i> → tblEmployee'],
  ['tblDepartment', '<u>depNum</u> INT, depName NVARCHAR(50) UNIQUE, <i>mgrSSN</i> → tblEmployee, mgrAssDate DATE'],
  ['tblProject', '<u>proNum</u> INT, proName NVARCHAR(50), <i>locNum</i> → tblLocation, <i>depNum</i> → tblDepartment'],
  ['tblWorksOn', '<u><i>empSSN</i>, <i>proNum</i></u>, workHours DECIMAL(5,1)'],
  ['tblLocation', '<u>locNum</u> INT, locName NVARCHAR(50) UNIQUE'],
  ['tblDepLocation', '<u><i>depNum</i>, <i>locNum</i></u>'],
  ['tblDependent', '<u><i>empSSN</i>, depName</u> NVARCHAR(50), depSex CHAR(1), depBirthdate DATE, depRelationship NVARCHAR(30)'],
];
const bangHtml = (tieu) => `<table><thead><tr><th>${tieu[0]}</th><th>${tieu[1]}</th></tr></thead><tbody>${BANG.map(([t, c]) => `<tr><td><code>${t}</code></td><td>${c}</td></tr>`).join('')}</tbody></table>`;
export const LUOC_DO_FUH = {
  en: `<details class="cl-luoc-do" open><summary><b>FUHCompany schema</b> (the course's sample database — full script in the <code>FUHCompany.sql</code> tab)</summary>${bangHtml(['Table', 'Columns (PK underlined, FK in italics)'])}<p>14 employees, 5 departments, 6 projects, 16 work assignments, 5 dependents. Names are Vietnamese with diacritics; text compares case-insensitively as on SQL Server.</p></details>`,
  vi: `<details class="cl-luoc-do" open><summary><b>Lược đồ FUHCompany</b> (CSDL mẫu của môn — script đầy đủ ở tab <code>FUHCompany.sql</code>)</summary>${bangHtml(['Bảng', 'Cột (khoá chính gạch chân, khoá ngoại in nghiêng)'])}<p>14 nhân viên, 5 phòng, 6 dự án, 16 dòng phân công, 5 người phụ thuộc. Tên tiếng Việt có dấu; so chuỗi không phân biệt hoa thường như SQL Server.</p></details>`,
};
