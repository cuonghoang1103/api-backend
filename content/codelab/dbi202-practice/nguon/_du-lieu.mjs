/**
 * CSDL mẫu NHỎ của các bài học DBI202 (ngoài FUHCompany ở _fuh.mjs) — chép đúng dữ liệu bài giảng dùng:
 *   QLL  — QuanLyLop (Lop, SinhVien) của bài 0.3 "Buổi đầu tiên" (gen/sql/_setup/quanlylop.sql)
 *   UNI  — Student / Course / Enroll của bài 2.5 "Thực hành Chương 2" (đại số quan hệ)
 *   MOV  — Movies / StarsIn / MovieStar / MovieExec / Studio — lược đồ ví dụ của slide trường (Ullman–Widom)
 * Viết bằng cú pháp SQL Server (như DBscript.sql của PE): chữ người đọc NVARCHAR, mã/khoá VARCHAR/CHAR.
 * ⚠ Đừng kiểm thứ tự theo tên có dấu; tránh NULL trong khoá ORDER BY của kiểm có thuTu.
 */

export const QLL = String.raw`
CREATE TABLE Lop (
  maLop   VARCHAR(10)  NOT NULL,
  tenLop  NVARCHAR(50) NOT NULL,
  CONSTRAINT pk_lop PRIMARY KEY (maLop)
);
CREATE TABLE SinhVien (
  maSV     VARCHAR(10)   NOT NULL,
  hoTen    NVARCHAR(50)  NOT NULL,
  ngaySinh DATE          NULL,
  diemTB   DECIMAL(4,2)  NULL,
  maLop    VARCHAR(10)   NOT NULL,
  CONSTRAINT pk_sinhvien PRIMARY KEY (maSV),
  CONSTRAINT fk_sinhvien_lop FOREIGN KEY (maLop) REFERENCES Lop(maLop),
  CONSTRAINT ck_sinhvien_diem CHECK (diemTB IS NULL OR (diemTB >= 0 AND diemTB <= 10))
);
INSERT INTO Lop (maLop, tenLop) VALUES
  ('SE1801', N'Kỹ thuật phần mềm 1801'),
  ('SE1802', N'Kỹ thuật phần mềm 1802');
INSERT INTO SinhVien (maSV, hoTen, ngaySinh, diemTB, maLop) VALUES
  ('SV001', N'Nguyễn Văn Cường', '2004-03-12', 8.50, 'SE1801'),
  ('SV002', N'Trần Thị Hoa',     '2004-07-25', 7.20, 'SE1801'),
  ('SV003', N'Lê Văn Bình',      '2004-01-30', 6.80, 'SE1802'),
  ('SV004', N'Phạm Thị Mai',     '2004-11-02', 9.10, 'SE1802'),
  ('SV005', N'Hoàng Văn Đức',    '2004-05-18', NULL, 'SE1801');
`;
export const LUOC_DO_QLL = {
  en: `<details class="cl-luoc-do" open><summary><b>QuanLyLop schema</b> (lesson 0.3 — full script in the <code>QuanLyLop.sql</code> tab)</summary><table><thead><tr><th>Table</th><th>Columns</th></tr></thead><tbody><tr><td><code>Lop</code></td><td><span style="text-decoration:underline">maLop</span> VARCHAR(10), tenLop NVARCHAR(50)</td></tr><tr><td><code>SinhVien</code></td><td><span style="text-decoration:underline">maSV</span> VARCHAR(10), hoTen NVARCHAR(50), ngaySinh DATE, diemTB DECIMAL(4,2) NULL (CHECK 0–10), <i>maLop</i> → Lop NOT NULL</td></tr></tbody></table><p>2 classes (SE1801, SE1802), 5 students; SV005 has no score yet (NULL).</p></details>`,
  vi: `<details class="cl-luoc-do" open><summary><b>Lược đồ QuanLyLop</b> (bài 0.3 — script đầy đủ ở tab <code>QuanLyLop.sql</code>)</summary><table><thead><tr><th>Bảng</th><th>Cột</th></tr></thead><tbody><tr><td><code>Lop</code></td><td><span style="text-decoration:underline">maLop</span> VARCHAR(10), tenLop NVARCHAR(50)</td></tr><tr><td><code>SinhVien</code></td><td><span style="text-decoration:underline">maSV</span> VARCHAR(10), hoTen NVARCHAR(50), ngaySinh DATE, diemTB DECIMAL(4,2) NULL (CHECK 0–10), <i>maLop</i> → Lop NOT NULL</td></tr></tbody></table><p>2 lớp (SE1801, SE1802), 5 sinh viên; SV005 chưa có điểm (NULL).</p></details>`,
};

export const UNI = String.raw`
CREATE TABLE Student (sid CHAR(4) NOT NULL, name NVARCHAR(20) NOT NULL, major CHAR(2) NOT NULL,
                      CONSTRAINT pk_student PRIMARY KEY (sid));
CREATE TABLE Course  (cid CHAR(6) NOT NULL, title NVARCHAR(30) NOT NULL, credits INT NOT NULL,
                      CONSTRAINT pk_course PRIMARY KEY (cid));
CREATE TABLE Enroll  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(3,1),
                      CONSTRAINT pk_enroll PRIMARY KEY (sid, cid),
                      CONSTRAINT fk_enroll_student FOREIGN KEY (sid) REFERENCES Student(sid),
                      CONSTRAINT fk_enroll_course  FOREIGN KEY (cid) REFERENCES Course(cid));
INSERT INTO Student VALUES ('SE01', N'An', 'SE'), ('SE02', N'Bình', 'SE'), ('AI01', N'Chi', 'AI'),
                           ('SE03', N'An', 'SE'), ('GD01', N'Dũng', 'GD');
INSERT INTO Course VALUES ('DBI202', N'Databases', 3), ('CSD201', N'Data Structures', 3),
                          ('MAE101', N'Mathematics', 3), ('JPD113', N'Japanese 1', 3);
INSERT INTO Enroll VALUES ('SE01', 'DBI202', 8.5), ('SE01', 'CSD201', 7.0), ('SE02', 'DBI202', 6.0),
                          ('SE02', 'MAE101', 9.0), ('AI01', 'DBI202', 9.5), ('AI01', 'CSD201', 8.0),
                          ('SE03', 'CSD201', 5.5);
`;
export const LUOC_DO_UNI = {
  en: `<details class="cl-luoc-do" open><summary><b>University schema</b> (lesson 2.5 — full script in the <code>University.sql</code> tab)</summary><table><thead><tr><th>Table</th><th>Columns</th></tr></thead><tbody><tr><td><code>Student</code></td><td><span style="text-decoration:underline">sid</span> CHAR(4), name NVARCHAR(20), major CHAR(2)</td></tr><tr><td><code>Course</code></td><td><span style="text-decoration:underline">cid</span> CHAR(6), title NVARCHAR(30), credits INT</td></tr><tr><td><code>Enroll</code></td><td><span style="text-decoration:underline"><i>sid</i>, <i>cid</i></span>, score DECIMAL(3,1)</td></tr></tbody></table><p>5 students (two different students are both called <b>An</b>: SE01 and SE03; GD01 Dũng takes nothing), 4 courses (nobody takes JPD113), 7 enrolments.</p></details>`,
  vi: `<details class="cl-luoc-do" open><summary><b>Lược đồ University</b> (bài 2.5 — script đầy đủ ở tab <code>University.sql</code>)</summary><table><thead><tr><th>Bảng</th><th>Cột</th></tr></thead><tbody><tr><td><code>Student</code></td><td><span style="text-decoration:underline">sid</span> CHAR(4), name NVARCHAR(20), major CHAR(2)</td></tr><tr><td><code>Course</code></td><td><span style="text-decoration:underline">cid</span> CHAR(6), title NVARCHAR(30), credits INT</td></tr><tr><td><code>Enroll</code></td><td><span style="text-decoration:underline"><i>sid</i>, <i>cid</i></span>, score DECIMAL(3,1)</td></tr></tbody></table><p>5 sinh viên (hai người khác nhau cùng tên <b>An</b>: SE01 và SE03; GD01 Dũng không học môn nào), 4 môn (không ai học JPD113), 7 lượt đăng ký.</p></details>`,
};

/** Lược đồ phim của slide trường (Ullman–Widom), dữ liệu nhỏ tự soạn — dùng cho bài slide Chương 2 / 6. */
export const MOV = String.raw`
CREATE TABLE MovieExec (certNo INT NOT NULL, name NVARCHAR(40) NOT NULL, address NVARCHAR(60) NULL, netWorth DECIMAL(12,0) NULL,
                        CONSTRAINT pk_movieexec PRIMARY KEY (certNo));
CREATE TABLE Studio (name NVARCHAR(30) NOT NULL, address NVARCHAR(60) NULL, presCertNo INT NULL,
                     CONSTRAINT pk_studio PRIMARY KEY (name),
                     CONSTRAINT fk_studio_pres FOREIGN KEY (presCertNo) REFERENCES MovieExec (certNo));
CREATE TABLE Movies (title NVARCHAR(40) NOT NULL, year INT NOT NULL, length INT NULL, genre NVARCHAR(12) NULL,
                     studioName NVARCHAR(30) NULL, producerCertNo INT NULL,
                     CONSTRAINT pk_movies PRIMARY KEY (title, year),
                     CONSTRAINT fk_movies_studio FOREIGN KEY (studioName) REFERENCES Studio (name),
                     CONSTRAINT fk_movies_producer FOREIGN KEY (producerCertNo) REFERENCES MovieExec (certNo));
CREATE TABLE MovieStar (name NVARCHAR(30) NOT NULL, address NVARCHAR(60) NULL, gender CHAR(1) NULL, birthdate DATE NULL,
                        CONSTRAINT pk_moviestar PRIMARY KEY (name));
CREATE TABLE StarsIn (movieTitle NVARCHAR(40) NOT NULL, movieYear INT NOT NULL, starName NVARCHAR(30) NOT NULL,
                      CONSTRAINT pk_starsin PRIMARY KEY (movieTitle, movieYear, starName),
                      CONSTRAINT fk_starsin_movie FOREIGN KEY (movieTitle, movieYear) REFERENCES Movies (title, year),
                      CONSTRAINT fk_starsin_star FOREIGN KEY (starName) REFERENCES MovieStar (name));
INSERT INTO MovieExec VALUES
  (100, N'George Lucas', N'Marin County', 5000000000),
  (200, N'Steven Spielberg', N'Pacific Palisades', 4000000000),
  (300, N'Kathleen Kennedy', N'Brentwood', 200000000),
  (400, N'Ted Turner', N'Atlanta', 2200000000);
INSERT INTO Studio VALUES
  ('Lucasfilm', N'San Rafael', 100), ('Paramount', N'Hollywood', 400), ('Fox', N'Century City', NULL), ('Disney', N'Burbank', 300);
INSERT INTO Movies VALUES
  ('Star Wars', 1977, 124, 'sciFi', 'Fox', 100),
  ('Empire Strikes Back', 1980, 124, 'sciFi', 'Fox', 100),
  ('Raiders of the Lost Ark', 1981, 115, 'action', 'Paramount', 100),
  ('E.T.', 1982, 115, 'sciFi', 'Disney', 200),
  ('Jaws', 1975, 124, 'drama', 'Disney', 200),
  ('Jurassic Park', 1993, 127, 'sciFi', 'Disney', 200),
  ('Wayne''s World', 1992, 95, 'comedy', 'Paramount', 400),
  ('The Force Awakens', 2015, 138, 'sciFi', 'Disney', 300);
INSERT INTO MovieStar VALUES
  ('Carrie Fisher', N'123 Maple St., Hollywood', 'F', '1956-10-21'),
  ('Mark Hamill', N'456 Oak Rd., Brentwood', 'M', '1951-09-25'),
  ('Harrison Ford', N'789 Palm Dr., Beverly Hills', 'M', '1942-07-13'),
  ('Dana Carvey', N'12 Elm St., Malibu', 'M', '1955-06-02'),
  ('Sam Neill', NULL, 'M', '1947-09-14'),
  ('Laura Dern', N'5 Ocean Ave., Malibu', 'F', '1967-02-10');
INSERT INTO StarsIn VALUES
  ('Star Wars', 1977, 'Carrie Fisher'), ('Star Wars', 1977, 'Mark Hamill'), ('Star Wars', 1977, 'Harrison Ford'),
  ('Empire Strikes Back', 1980, 'Carrie Fisher'), ('Empire Strikes Back', 1980, 'Mark Hamill'), ('Empire Strikes Back', 1980, 'Harrison Ford'),
  ('Raiders of the Lost Ark', 1981, 'Harrison Ford'),
  ('Wayne''s World', 1992, 'Dana Carvey'),
  ('Jurassic Park', 1993, 'Sam Neill'), ('Jurassic Park', 1993, 'Laura Dern'),
  ('The Force Awakens', 2015, 'Carrie Fisher'), ('The Force Awakens', 2015, 'Mark Hamill'), ('The Force Awakens', 2015, 'Harrison Ford');
`;
export const LUOC_DO_MOV = {
  en: `<details class="cl-luoc-do" open><summary><b>Movies schema</b> (the running example of the school slides — full script in the <code>Movies.sql</code> tab)</summary><table><thead><tr><th>Table</th><th>Columns</th></tr></thead><tbody><tr><td><code>Movies</code></td><td><span style="text-decoration:underline">title, year</span>, length, genre, <i>studioName</i> → Studio, <i>producerCertNo</i> → MovieExec</td></tr><tr><td><code>StarsIn</code></td><td><span style="text-decoration:underline"><i>movieTitle, movieYear</i>, <i>starName</i></span></td></tr><tr><td><code>MovieStar</code></td><td><span style="text-decoration:underline">name</span>, address, gender, birthdate</td></tr><tr><td><code>MovieExec</code></td><td><span style="text-decoration:underline">certNo</span>, name, address, netWorth</td></tr><tr><td><code>Studio</code></td><td><span style="text-decoration:underline">name</span>, address, <i>presCertNo</i> → MovieExec</td></tr></tbody></table><p>8 movies, 6 stars, 13 StarsIn rows, 4 executives, 4 studios. E.T. and Jaws have no stars listed; Fox has no president (NULL).</p></details>`,
  vi: `<details class="cl-luoc-do" open><summary><b>Lược đồ Movies</b> (ví dụ xuyên suốt của slide trường — script đầy đủ ở tab <code>Movies.sql</code>)</summary><table><thead><tr><th>Bảng</th><th>Cột</th></tr></thead><tbody><tr><td><code>Movies</code></td><td><span style="text-decoration:underline">title, year</span>, length, genre, <i>studioName</i> → Studio, <i>producerCertNo</i> → MovieExec</td></tr><tr><td><code>StarsIn</code></td><td><span style="text-decoration:underline"><i>movieTitle, movieYear</i>, <i>starName</i></span></td></tr><tr><td><code>MovieStar</code></td><td><span style="text-decoration:underline">name</span>, address, gender, birthdate</td></tr><tr><td><code>MovieExec</code></td><td><span style="text-decoration:underline">certNo</span>, name, address, netWorth</td></tr><tr><td><code>Studio</code></td><td><span style="text-decoration:underline">name</span>, address, <i>presCertNo</i> → MovieExec</td></tr></tbody></table><p>8 phim, 6 diễn viên, 13 dòng StarsIn, 4 nhà điều hành, 4 hãng. E.T. và Jaws chưa có diễn viên; Fox không có chủ tịch (NULL).</p></details>`,
};
