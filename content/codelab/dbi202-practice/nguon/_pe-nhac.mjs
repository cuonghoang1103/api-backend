/**
 * Phần dùng chung của hai đề PE DBI202 SP26 trên CSDL nhạc (Đề 2 = Paper 1, Đề 3 = Paper 8): lược đồ, Q1 (ERD → bảng có thuộc tính
 * đa trị + lớp con), Q2, Q6, Q9 (trigger INSTEAD OF INSERT kiểm dữ liệu) — giống hệt nhau ở hai đề. Lời giải = sampleSolution của đề.
 */
import { kq, kqAn, ck, tn } from './_chung.mjs';

export const MO_HINH_NHAC = [
  { ten: 'Artists', truong: [['ID', 'INT', 'PK'], ['Name', 'NVARCHAR(100)', ''], ['Gender', 'nvarchar(20)', "'Male', 'Female', 'Group'"], ['Country', 'NVARCHAR(50)', ''], ['Birthdate', 'date', '']] },
  { ten: 'Albums', truong: [['ID', 'INT', 'PK'], ['Title', 'NVARCHAR(200)', ''], ['ReleaseYear', 'INT', '> 1900'], ['ArtistID', 'INT', 'FK → Artists']] },
  { ten: 'Genres', truong: [['ID', 'INT', 'PK'], ['Name', 'NVARCHAR(50)', 'UNIQUE (Pop, Rock, Electronic…)']] },
  { ten: 'Tracks', truong: [['ID', 'INT', 'PK'], ['Title', 'NVARCHAR(200)', ''], ['Duration', 'INT', 'seconds'], ['Language', 'nvarchar(100)', ''], ['AlbumID', 'INT', 'FK → Albums'], ['GenreID', 'INT', 'FK → Genres']] },
  { ten: 'Users', truong: [['ID', 'INT', 'PK'], ['Username', 'NVARCHAR(50)', ''], ['Email', 'VARCHAR(100)', 'UNIQUE'], ['SubscriptionType', 'NVARCHAR(20)', "'Free' / 'Premium'"], ['RegistrationDate', 'DATE', '']] },
  { ten: 'Playlists', truong: [['ID', 'INT', 'PK'], ['Title', 'NVARCHAR(100)', ''], ['UserID', 'INT', 'FK → Users'], ['CreatedAt', 'DATETIME', '']] },
  { ten: 'PlaylistTracks', truong: [['PlaylistID', 'INT', 'PK, FK → Playlists'], ['TrackID', 'INT', 'PK, FK → Tracks'], ['AddedDate', 'DATETIME', '']] },
];

export const YC_CHUNG_NHAC = [
  { en: 'One file per question containing ONLY the statement that answers it — no USE, no GO, no test commands (one violation = 0 for the question in the real exam).', vi: 'Mỗi câu một tệp CHỈ chứa câu lệnh trả lời — không USE, không GO, không lệnh chạy thử (thi thật: sai một điều là 0 điểm câu đó).' },
  { en: 'Portable SQL only here: write a year filter as a date range (no YEAR()), no TOP, no ISNULL. The file names keep the paper\'s numbers.', vi: 'Ở đây chỉ dùng SQL chạy cả hai hệ: lọc năm bằng khoảng ngày (không YEAR()), không TOP, không ISNULL. Tên tệp giữ đúng số câu của đề.' },
  { en: 'Row order is graded only where both engines agree. Where NULLs take part in the ORDER BY (Q4) the order is not graded: SQL Server sorts NULL first, PostgreSQL last.', vi: 'Thứ tự dòng chỉ chấm ở câu mà hai hệ cho cùng kết quả. Câu có NULL trong ORDER BY (Q4) không chấm thứ tự: SQL Server xếp NULL đầu, PostgreSQL xếp cuối.' },
];

const TRACK = (id, title, album, genre) => `INSERT INTO Tracks (ID, Title, Duration, Language, AlbumID, GenreID) VALUES (${id}, '${title}', 200, 'English', ${album}, ${genre})`;
export const THEM_TRACK = TRACK;

export const CAU_Q2 = {
  ten: { en: 'Q2 · Tracks whose title contains "love"', vi: 'Q2 · Bài hát có tên chứa "love"' }, diem: 1,
  moTa: { en: 'All tracks whose title contains the string "love", not case-sensitive.', vi: 'Mọi bài hát có tên chứa chuỗi "love", không phân biệt hoa thường.' },
  yeuCau: [{ en: 'Columns: <code>ID, Title, Duration, Language, AlbumID, GenreID</code>. Any row order. LOWER(Title) makes it case-insensitive on every collation.', vi: 'Cột: <code>ID, Title, Duration, Language, AlbumID, GenreID</code>. Thứ tự dòng tuỳ ý. LOWER(Title) giúp không phân biệt hoa thường với mọi collation.' }],
  giai: `SELECT ID, Title, Duration, Language, AlbumID, GenreID
FROM Tracks
WHERE LOWER(Title) LIKE '%love%';`,
  kiem: [kq('Q2 · 23 tracks'), kqAn('Q2 · upper-case LOVE and "Glove" also contain it; "Lo ve" does not', `${TRACK(900, 'ALL YOU NEED IS LOVE', 1, 1)}; ${TRACK(901, 'Glove Box', 1, 1)}; ${TRACK(902, 'Lo ve', 1, 1)}`)],
  saiMau: ["SELECT ID, Title, Duration, Language, AlbumID, GenreID FROM Tracks WHERE Title LIKE 'Love%'", "SELECT ID, Title, Duration, Language, AlbumID, GenreID FROM Tracks WHERE Title LIKE '% love %'"],
};

export const CAU_Q6 = {
  ten: { en: 'Q6 · Canadian artists: album(s) with the most tracks', vi: 'Q6 · Nghệ sĩ Canada: (các) album nhiều bài nhất' }, diem: 1,
  moTa: { en: "For each artist whose Country is 'Canada', the album(s) with the highest number of tracks among that artist's albums. Ties are all shown; an artist without albums is not shown.", vi: "Với mỗi nghệ sĩ có Country = 'Canada', (các) album có nhiều bài nhất trong các album của nghệ sĩ đó. Hoà thì hiện hết; nghệ sĩ không có album thì không hiện." },
  yeuCau: [{ en: 'Columns: <code>ArtistID, ArtistName, AlbumID, AlbumTitle, NumberOfTracks</code>, ordered by ArtistID, AlbumID.', vi: 'Cột: <code>ArtistID, ArtistName, AlbumID, AlbumTitle, NumberOfTracks</code>, sắp theo ArtistID, AlbumID.' }],
  giai: `WITH AlbumCount AS (
    SELECT ar.ID AS ArtistID, ar.Name AS ArtistName, al.ID AS AlbumID, al.Title AS AlbumTitle,
           COUNT(t.ID) AS NumberOfTracks
    FROM Artists ar
    JOIN Albums al     ON al.ArtistID = ar.ID
    LEFT JOIN Tracks t ON t.AlbumID = al.ID
    WHERE ar.Country = 'Canada'
    GROUP BY ar.ID, ar.Name, al.ID, al.Title
)
SELECT ArtistID, ArtistName, AlbumID, AlbumTitle, NumberOfTracks
FROM AlbumCount a
WHERE NumberOfTracks = (SELECT MAX(NumberOfTracks) FROM AlbumCount b WHERE b.ArtistID = a.ArtistID)   -- max of THIS artist
ORDER BY ArtistID, AlbumID;`,
  kiem: [kq('Q6 · 11 rows (Drake, The Weeknd, Shawn Mendes, Justin Bieber)', { thuTu: true }), kqAn('Q6 · Scorpion gets one more track; a Kiss Land track is removed', `${TRACK(900, 'Bonus Track', 16, 1)}; DELETE FROM PlaylistTracks WHERE TrackID IN (SELECT MIN(ID) FROM Tracks WHERE AlbumID = 28); DELETE FROM Tracks WHERE ID IN (SELECT MIN(ID) FROM Tracks WHERE AlbumID = 28)`, { thuTu: true })],
  saiMau: ["WITH AlbumCount AS (SELECT ar.ID AS ArtistID, ar.Name AS ArtistName, al.ID AS AlbumID, al.Title AS AlbumTitle, COUNT(t.ID) AS NumberOfTracks FROM Artists ar JOIN Albums al ON al.ArtistID = ar.ID LEFT JOIN Tracks t ON t.AlbumID = al.ID WHERE ar.Country = 'Canada' GROUP BY ar.ID, ar.Name, al.ID, al.Title) SELECT ArtistID, ArtistName, AlbumID, AlbumTitle, NumberOfTracks FROM AlbumCount WHERE NumberOfTracks = (SELECT MAX(NumberOfTracks) FROM AlbumCount) ORDER BY ArtistID, AlbumID"],
};

/* ─── phần T-SQL (Q1, Q9 chung; Q8 riêng mỗi đề) ─── */
export const Q1_NHAC = `CREATE TABLE Universities (
    universityID int PRIMARY KEY,
    name         nvarchar(200),
    street       nvarchar(50),            -- composite attribute address ⇒ its parts become columns
    city         nvarchar(50)
);
CREATE TABLE Departments (
    depID int PRIMARY KEY,
    name  nvarchar(100)
);
CREATE TABLE Employees (
    empID        int PRIMARY KEY,
    FullName     nvarchar(60),
    gender       nvarchar(10),
    universityID int REFERENCES Universities(universityID)       -- workFor 1–N
);
CREATE TABLE EmployeesPhone (                                      -- multi-valued phone ⇒ table name + attribute
    empID int REFERENCES Employees(empID),
    phone nvarchar(20),
    PRIMARY KEY (empID, phone)
);
CREATE TABLE Professors (                                          -- isA (ER style): PK is also FK to the superclass
    empID int PRIMARY KEY REFERENCES Employees(empID),
    field nvarchar(100),
    depID int REFERENCES Departments(depID)                         -- workFor N–1 Departments
);`;
export const Q9_NHAC = `CREATE TRIGGER tr_insertPlaylist ON Playlists
INSTEAD OF INSERT
AS
BEGIN
    INSERT INTO Playlists (Title, UserID, CreatedAt)
    SELECT i.Title,
           i.UserID,
           CASE WHEN i.CreatedAt >= u.RegistrationDate AND i.CreatedAt <= GETDATE()
                THEN i.CreatedAt
                ELSE GETDATE()
           END
    FROM inserted i
    JOIN Users u ON u.ID = i.UserID;            -- an unknown UserID is dropped: not inserted
END`;
const COT = (bang, cot, kieu, dai) => `EXISTS (SELECT 1 FROM sys.columns c JOIN sys.types t ON t.user_type_id = c.user_type_id WHERE c.object_id = OBJECT_ID(N'dbo.${bang}') AND c.name = N'${cot}' AND t.name = N'${kieu}'${dai ? ` AND c.max_length = ${dai * 2}` : ''})`;
const FK = (bang, cot, toi) => `EXISTS (SELECT 1 FROM sys.foreign_key_columns f JOIN sys.columns c ON c.object_id = f.parent_object_id AND c.column_id = f.parent_column_id WHERE f.parent_object_id = OBJECT_ID(N'dbo.${bang}') AND c.name = N'${cot}' AND f.referenced_object_id = OBJECT_ID(N'dbo.${toi}'))`;
export const KIEM_Q1_NHAC = [
  ck(['Q1 · Universities with the composite address split into street, city', 'Q1 · Universities với thuộc tính phức hợp address tách thành street, city'], `SET @ok = IIF(${COT('Universities', 'universityID', 'int')} AND ${COT('Universities', 'name', 'nvarchar', 200)} AND ${COT('Universities', 'street', 'nvarchar', 50)} AND ${COT('Universities', 'city', 'nvarchar', 50)} AND COL_LENGTH(N'dbo.Universities', N'address') IS NULL, 1, 0);
SET @info = N'expected Universities(universityID int, name nvarchar(200), street nvarchar(50), city nvarchar(50))';`),
  ck(['Q1 · Employees → Universities (1–N), no phone column in Employees', 'Q1 · Employees → Universities (1–N), Employees không có cột phone'], `SET @ok = IIF(${COT('Employees', 'FullName', 'nvarchar', 60)} AND ${COT('Employees', 'gender', 'nvarchar', 10)} AND ${FK('Employees', 'universityID', 'Universities')} AND COL_LENGTH(N'dbo.Employees', N'phone') IS NULL, 1, 0);
SET @info = N'multi-valued phone goes to its own table; universityID is a FK';`),
  ck(['Q1 · EmployeesPhone(empID, phone) with a composite PK', 'Q1 · EmployeesPhone(empID, phone) với khoá chính ghép'], `SET @ok = IIF(OBJECT_ID(N'dbo.EmployeesPhone') IS NOT NULL AND ${COT('EmployeesPhone', 'phone', 'nvarchar', 20)} AND ${FK('EmployeesPhone', 'empID', 'Employees')} AND (SELECT COUNT(*) FROM sys.index_columns ic JOIN sys.indexes i ON i.object_id = ic.object_id AND i.index_id = ic.index_id WHERE i.object_id = OBJECT_ID(N'dbo.EmployeesPhone') AND i.is_primary_key = 1) = 2, 1, 0);
SET @info = N'expected EmployeesPhone, PRIMARY KEY (empID, phone)';`),
  ck(['Q1 · Professors: empID is both PK and FK to Employees, depID → Departments', 'Q1 · Professors: empID vừa là khoá chính vừa là khoá ngoại tới Employees, depID → Departments'], `SET @ok = IIF(${FK('Professors', 'empID', 'Employees')} AND ${FK('Professors', 'depID', 'Departments')} AND ${COT('Professors', 'field', 'nvarchar', 100)} AND EXISTS (SELECT 1 FROM sys.index_columns ic JOIN sys.indexes i ON i.object_id = ic.object_id AND i.index_id = ic.index_id JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id WHERE i.object_id = OBJECT_ID(N'dbo.Professors') AND i.is_primary_key = 1 AND c.name = N'empID'), 1, 0);
SET @info = N'ER-style subclass: Professors(empID PK FK, field, depID FK)';`),
];
export const KIEM_Q9_NHAC = [
  ck(['Q9 · the paper\'s 4-row test: Test 1 as given, Test 2 dropped (no user 50), Test 3/4 get the current time', 'Q9 · phép thử 4 dòng của đề: Test 1 giữ nguyên, Test 2 bị loại (không có user 50), Test 3/4 nhận thời điểm hiện tại'], `DECLARE @max INT = (SELECT MAX(ID) FROM Playlists), @e INT = 0;
BEGIN TRAN;
BEGIN TRY
  INSERT INTO Playlists (Title, UserID, CreatedAt) VALUES ('Playlist Test 1', 10, '2025-10-12'), ('Playlist Test 2', 50, '2025-11-12'), ('Playlist Test 3', 12, '2020-05-12'), ('Playlist Test 4', 13, '2031-02-15');
END TRY BEGIN CATCH SET @e = ERROR_NUMBER(); END CATCH;
SET @ok = IIF(@e = 0 AND (SELECT COUNT(*) FROM Playlists WHERE ID > @max) = 3
  AND EXISTS (SELECT 1 FROM Playlists WHERE ID > @max AND Title = 'Playlist Test 1' AND CreatedAt = '2025-10-12')
  AND NOT EXISTS (SELECT 1 FROM Playlists WHERE Title = 'Playlist Test 2')
  AND (SELECT COUNT(*) FROM Playlists WHERE ID > @max AND Title IN ('Playlist Test 3', 'Playlist Test 4') AND ABS(DATEDIFF(SECOND, CreatedAt, GETDATE())) < 120) = 2, 1, 0);
SET @info = CONCAT(N'new rows = ', (SELECT COUNT(*) FROM Playlists WHERE ID > @max), N', error = ', @e);
IF @@TRANCOUNT > 0 ROLLBACK;`),
  ck(['Q9 · a single valid playlist is inserted unchanged', 'Q9 · một playlist hợp lệ được chèn nguyên vẹn'], `DECLARE @max INT = (SELECT MAX(ID) FROM Playlists), @e INT = 0;
BEGIN TRAN;
BEGIN TRY INSERT INTO Playlists (Title, UserID, CreatedAt) VALUES ('Solo', 1, '2024-01-01'); END TRY BEGIN CATCH SET @e = ERROR_NUMBER(); END CATCH;
SET @ok = IIF(@e = 0 AND (SELECT COUNT(*) FROM Playlists WHERE ID > @max) = 1 AND EXISTS (SELECT 1 FROM Playlists WHERE ID > @max AND Title = 'Solo' AND UserID = 1 AND CreatedAt = '2024-01-01')
  AND EXISTS (SELECT 1 FROM sys.triggers WHERE name = N'tr_insertPlaylist' AND parent_id = OBJECT_ID(N'dbo.Playlists')), 1, 0);
SET @info = CONCAT(N'new rows = ', (SELECT COUNT(*) FROM Playlists WHERE ID > @max), N', error = ', @e);
IF @@TRANCOUNT > 0 ROLLBACK;`),
];

export const SAI_TAY_NHAC = (giai) => [
  giai.replace('    street       nvarchar(50),            -- composite attribute address ⇒ its parts become columns\n    city         nvarchar(50)', '    address      nvarchar(100)'),
  giai.replace(`    gender       nvarchar(10),
    universityID int REFERENCES Universities(universityID)       -- workFor 1–N`, `    gender       nvarchar(10),
    phone        nvarchar(20),
    universityID int REFERENCES Universities(universityID)`),
  giai.replace('    FROM inserted i\n    JOIN Users u ON u.ID = i.UserID;            -- an unknown UserID is dropped: not inserted', '    FROM inserted i\n    LEFT JOIN Users u ON u.ID = i.UserID;'),
  giai.replace(`           CASE WHEN i.CreatedAt >= u.RegistrationDate AND i.CreatedAt <= GETDATE()
                THEN i.CreatedAt
                ELSE GETDATE()
           END`, '           i.CreatedAt'),
];

export const TN_NHAC = [tn('multi-valued attribute', 'thuộc tính đa trị'), tn('composite attribute', 'thuộc tính phức hợp'), tn('INSTEAD OF trigger', 'trigger thay thế'), tn('table-valued function', 'hàm trả về bảng')];
