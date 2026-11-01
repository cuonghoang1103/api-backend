/**
 * DBI202 · Chữa trọn đề PE 2 (SP26 · Paper 1 · CSDL nhạc) — đề thật content/exams/DBI202-PE2 với DBscript.sql gốc (_pe-sp26.mjs).
 *   Đề 1 (trình duyệt): Q2–Q7 + Q10 trên đúng dữ liệu của đề + kiểm ẩn đổi dữ liệu (lọc năm viết bằng khoảng ngày).
 *   Đề 2 (SQL Server của người học): Q1 (ERD: thuộc tính phức hợp, đa trị, lớp con), Q8 (procedure), Q9 (trigger INSTEAD OF INSERT).
 */
import { doiDau, KHOA, deLonSql, kq, kqAn, sau, tsql, ck, tn } from './_chung.mjs';
import { PE_MUSIC, PE_MUSIC_TSQL } from './_pe-sp26.mjs';
import { MO_HINH_NHAC, YC_CHUNG_NHAC, CAU_Q2, CAU_Q6, THEM_TRACK, Q1_NHAC, Q9_NHAC, KIEM_Q1_NHAC, KIEM_Q9_NHAC, SAI_TAY_NHAC, TN_NHAC } from './_pe-nhac.mjs';

const Q8 = `CREATE PROCEDURE listTopArtistByYear
    @year int
AS
BEGIN
    WITH ArtistTotals AS (
        SELECT ar.Country, ar.ID AS ArtistID, ar.Name AS ArtistName,
               COUNT(pt.TrackID) AS TotalPlaylistAdditionsInYear
        FROM Artists ar
        LEFT JOIN Albums al         ON al.ArtistID = ar.ID
        LEFT JOIN Tracks t          ON t.AlbumID = al.ID
        LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID AND YEAR(pt.AddedDate) = @year
        GROUP BY ar.Country, ar.ID, ar.Name
    )
    SELECT Country, ArtistID, ArtistName, TotalPlaylistAdditionsInYear
    FROM ArtistTotals a
    WHERE TotalPlaylistAdditionsInYear =
          (SELECT MAX(TotalPlaylistAdditionsInYear) FROM ArtistTotals b WHERE b.Country = a.Country)
    ORDER BY ArtistID;
END`;
const GIAI_TAY = `-- Q1
${Q1_NHAC}
GO
-- Q8
${Q8}
GO
-- Q9
${Q9_NHAC}`;
const SO_Q8 = (nam) => `DECLARE @r TABLE (Country NVARCHAR(50), ArtistID INT, ArtistName NVARCHAR(100), Tong INT);
INSERT INTO @r EXEC listTopArtistByYear ${nam};
DECLARE @ref TABLE (Country NVARCHAR(50), ArtistID INT, ArtistName NVARCHAR(100), Tong INT);
WITH x AS (SELECT ar.Country, ar.ID AS ArtistID, ar.Name AS ArtistName, COUNT(pt.TrackID) AS Tong FROM Artists ar LEFT JOIN Albums al ON al.ArtistID = ar.ID LEFT JOIN Tracks t ON t.AlbumID = al.ID LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID AND pt.AddedDate >= DATEFROMPARTS(${nam}, 1, 1) AND pt.AddedDate < DATEFROMPARTS(${nam} + 1, 1, 1) GROUP BY ar.Country, ar.ID, ar.Name)
INSERT INTO @ref SELECT * FROM x a WHERE Tong = (SELECT MAX(Tong) FROM x b WHERE b.Country = a.Country);
SET @ok = IIF(NOT EXISTS (SELECT * FROM @r EXCEPT SELECT * FROM @ref) AND NOT EXISTS (SELECT * FROM @ref EXCEPT SELECT * FROM @r) AND (SELECT COUNT(*) FROM @r) = (SELECT COUNT(*) FROM @ref), 1, 0);
SET @info = CONCAT(N'rows = ', (SELECT COUNT(*) FROM @r), N', expected ', (SELECT COUNT(*) FROM @ref));`;

export default doiDau({
  slug: 'dbi202-pe2-sp26-chua-tron-de',
  ten: 'PE review · Exam 2 (SP26 · Paper 1 · music DB) — all 10 questions',
  khoa: KHOA,
  baiHoc: 'dbi202-pe2-sp26-chua-tron-de',
  de: [
    deLonSql({
      dangBai: 'pe',
      tieuDe: 'PE SP26 Paper 1 (music database) — Q2–Q7 and Q10, graded in the browser',
      doKho: 'HARD', phut: 60, diem: 100,
      khaiNiem: ['LIKE', '3-table join', 'LEFT JOIN with filters', 'COUNT DISTINCT over two LEFT JOINs', 'maximum per group with ties', 'two maxima at once', 'INSERT … SELECT'],
      the: ['dbi202', 'pe', 'sql', 'exam-review', 'sp26'],
      csdl: PE_MUSIC, tenCsdl: 'DBscript',
      thuMuc: 'RollNo_Name_DBI202_PE_SP26_P1',
      phu: { en: 'DBI202 · real Practical Exam SP26 Paper 1 · the paper\'s own DBscript.sql (30 artists, 300+ tracks) · 1 mark per question', vi: 'DBI202 · đề thi thực hành thật SP26 Paper 1 · đúng DBscript.sql của đề (30 nghệ sĩ, hơn 300 bài) · mỗi câu 1 điểm' },
      moTa: {
        en: '<p>The real SP26 Paper 1 on the music database (Artists → Albums → Tracks ← Genres; Users → Playlists → PlaylistTracks). The plain-SQL questions are graded here on the paper\'s exact data and again on a modified copy. Q1 (ERD with nvarchar, composite and multi-valued attributes, a subclass), Q8 (procedure) and Q9 (trigger) are the second exercise of this lesson, on your own SQL Server.</p>',
        vi: '<p>Đề SP26 Paper 1 thật trên CSDL nhạc (Artists → Albums → Tracks ← Genres; Users → Playlists → PlaylistTracks). Các câu SQL thuần được chấm ở đây trên đúng dữ liệu của đề và trên một bản đã sửa. Q1 (ERD với nvarchar, thuộc tính phức hợp, đa trị, lớp con), Q8 (procedure) và Q9 (trigger) là bài thứ hai của bài học này, chạy trên SQL Server của bạn.</p>',
      },
      yeuCauChung: YC_CHUNG_NHAC,
      moHinh: MO_HINH_NHAC,
      cau: [
        CAU_Q2,
        {
          ten: { en: 'Q3 · 2020 tracks by female artists from the USA', vi: 'Q3 · Bài hát năm 2020 của nữ nghệ sĩ Mỹ' }, diem: 1,
          moTa: { en: "Tracks of albums released in 2020 and performed by female artists from the USA.", vi: 'Bài hát thuộc album phát hành năm 2020 của nữ nghệ sĩ đến từ Mỹ.' },
          yeuCau: [{ en: 'Columns: <code>ID, TrackTitle, AlbumTitle, ReleaseYear, ArtistName, Gender, Country</code>. Any row order.', vi: 'Cột: <code>ID, TrackTitle, AlbumTitle, ReleaseYear, ArtistName, Gender, Country</code>. Thứ tự dòng tuỳ ý.' }],
          giai: `SELECT t.ID, t.Title AS TrackTitle, al.Title AS AlbumTitle, al.ReleaseYear,
       ar.Name AS ArtistName, ar.Gender, ar.Country
FROM Tracks t
JOIN Albums  al ON al.ID = t.AlbumID
JOIN Artists ar ON ar.ID = al.ArtistID
WHERE al.ReleaseYear = 2020
  AND ar.Gender = 'Female'
  AND ar.Country = 'USA';`,
          kiem: [kq('Q3 · 9 tracks (Chromatica, Rare, Alicia)'), kqAn('Q3 · Selena Gomez listed as a group; a new 2020 track by Taylor Swift', `UPDATE Artists SET Gender = 'Group' WHERE ID = 27; INSERT INTO Albums (ID, Title, ReleaseYear, ArtistID) VALUES (900, 'Folklore X', 2020, 1); ${THEM_TRACK(900, 'Cardigan X', 900, 1)}`)],
          saiMau: ["SELECT t.ID, t.Title AS TrackTitle, al.Title AS AlbumTitle, al.ReleaseYear, ar.Name AS ArtistName, ar.Gender, ar.Country FROM Tracks t JOIN Albums al ON al.ID = t.AlbumID JOIN Artists ar ON ar.ID = al.ArtistID WHERE al.ReleaseYear >= 2020 AND ar.Gender = 'Female' AND ar.Country = 'USA'", "SELECT t.ID, t.Title AS TrackTitle, al.Title AS AlbumTitle, al.ReleaseYear, ar.Name AS ArtistName, ar.Gender, ar.Country FROM Tracks t JOIN Albums al ON al.ID = t.AlbumID JOIN Artists ar ON ar.ID = al.ArtistID WHERE al.ReleaseYear = 2020 AND ar.Country = 'USA'"],
        },
        {
          ten: { en: 'Q4 · Rock tracks after 2020 and their playlists (even none)', vi: 'Q4 · Bài Rock sau 2020 và playlist chứa chúng (kể cả không có)' }, diem: 1,
          moTa: { en: "Tracks of albums released after 2020 in the genre 'Rock', with the playlists they were added to. A track in no playlist still appears (playlist columns NULL).", vi: "Bài hát thuộc album phát hành sau 2020, thể loại 'Rock', kèm các playlist đã thêm chúng. Bài không nằm trong playlist nào vẫn hiện (cột playlist NULL)." },
          yeuCau: [{ en: 'Columns: <code>AlbumTitle, ReleaseYear, TrackID, TrackTitle, GenreName, PlaylistTitle, AddedDate</code>. The paper sorts by PlaylistTitle DESC, TrackTitle; the order is not graded here (NULL ordering differs between engines).', vi: 'Cột: <code>AlbumTitle, ReleaseYear, TrackID, TrackTitle, GenreName, PlaylistTitle, AddedDate</code>. Đề sắp theo PlaylistTitle giảm, TrackTitle; ở đây không chấm thứ tự (hai hệ xếp NULL khác nhau).' }],
          giai: `SELECT al.Title AS AlbumTitle, al.ReleaseYear, t.ID AS TrackID, t.Title AS TrackTitle,
       g.Name AS GenreName, p.Title AS PlaylistTitle, pt.AddedDate
FROM Tracks t
JOIN Albums al ON al.ID = t.AlbumID
JOIN Genres g  ON g.ID  = t.GenreID
LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID          -- keep tracks without playlists
LEFT JOIN Playlists p       ON p.ID = pt.PlaylistID
WHERE al.ReleaseYear > 2020
  AND g.Name = 'Rock'
ORDER BY PlaylistTitle DESC, TrackTitle ASC;`,
          kiem: [kq('Q4 · 9 rows, the last 3 without a playlist'), kqAn('Q4 · a new 2023 Rock album (track in no playlist) and a 2020 one that must NOT appear', `INSERT INTO Albums (ID, Title, ReleaseYear, ArtistID) VALUES (900, 'New Rock', 2023, 2), (901, 'Old Rock', 2020, 2); ${THEM_TRACK(900, 'Loud Night', 900, 2)}; ${THEM_TRACK(901, 'Quiet Night', 901, 2)}`)],
          saiMau: ["SELECT al.Title AS AlbumTitle, al.ReleaseYear, t.ID AS TrackID, t.Title AS TrackTitle, g.Name AS GenreName, p.Title AS PlaylistTitle, pt.AddedDate FROM Tracks t JOIN Albums al ON al.ID = t.AlbumID JOIN Genres g ON g.ID = t.GenreID JOIN PlaylistTracks pt ON pt.TrackID = t.ID JOIN Playlists p ON p.ID = pt.PlaylistID WHERE al.ReleaseYear > 2020 AND g.Name = 'Rock'", "SELECT al.Title AS AlbumTitle, al.ReleaseYear, t.ID AS TrackID, t.Title AS TrackTitle, g.Name AS GenreName, p.Title AS PlaylistTitle, pt.AddedDate FROM Tracks t JOIN Albums al ON al.ID = t.AlbumID JOIN Genres g ON g.ID = t.GenreID LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID LEFT JOIN Playlists p ON p.ID = pt.PlaylistID WHERE al.ReleaseYear >= 2020 AND g.Name = 'Rock'"],
        },
        {
          ten: { en: 'Q5 · Every artist: albums 2020–2024 and their Rock tracks', vi: 'Q5 · Mọi nghệ sĩ: album 2020–2024 và số bài Rock trong đó' }, diem: 1,
          moTa: { en: "Every artist with the number of albums released between 2020 and 2024 (inclusive) and the number of 'Rock' tracks in those albums — 0 when none.", vi: "Mọi nghệ sĩ kèm số album phát hành từ 2020 tới 2024 (gồm hai đầu) và số bài 'Rock' trong các album đó — 0 nếu không có." },
          yeuCau: [{ en: 'Columns: <code>ArtistID, Name, Gender, Country, NumberOfAlbums, NumberOfTracks</code>, ordered by ArtistID.', vi: 'Cột: <code>ArtistID, Name, Gender, Country, NumberOfAlbums, NumberOfTracks</code>, sắp theo ArtistID.' }],
          giai: `SELECT ar.ID AS ArtistID, ar.Name, ar.Gender, ar.Country,
       COUNT(DISTINCT al.ID) AS NumberOfAlbums,
       COUNT(t.ID)          AS NumberOfTracks
FROM Artists ar
LEFT JOIN Albums al ON al.ArtistID = ar.ID AND al.ReleaseYear BETWEEN 2020 AND 2024   -- filters of the optional side go in ON
LEFT JOIN Tracks t  ON t.AlbumID = al.ID
                   AND t.GenreID IN (SELECT ID FROM Genres WHERE Name = 'Rock')
GROUP BY ar.ID, ar.Name, ar.Gender, ar.Country
ORDER BY ar.ID;`,
          kiem: [kq('Q5 · 30 artists', { thuTu: true }), kqAn('Q5 · Taylor Swift releases a 2024 album with one Rock and one Pop track', `INSERT INTO Albums (ID, Title, ReleaseYear, ArtistID) VALUES (900, 'TS 2024', 2024, 1); ${THEM_TRACK(900, 'Rock One', 900, 2)}; ${THEM_TRACK(901, 'Pop One', 900, 1)}`, { thuTu: true })],
          saiMau: ["SELECT ar.ID AS ArtistID, ar.Name, ar.Gender, ar.Country, COUNT(al.ID) AS NumberOfAlbums, COUNT(t.ID) AS NumberOfTracks FROM Artists ar LEFT JOIN Albums al ON al.ArtistID = ar.ID AND al.ReleaseYear BETWEEN 2020 AND 2024 LEFT JOIN Tracks t ON t.AlbumID = al.ID AND t.GenreID IN (SELECT ID FROM Genres WHERE Name = 'Rock') GROUP BY ar.ID, ar.Name, ar.Gender, ar.Country ORDER BY ar.ID", "SELECT ar.ID AS ArtistID, ar.Name, ar.Gender, ar.Country, COUNT(DISTINCT al.ID) AS NumberOfAlbums, COUNT(t.ID) AS NumberOfTracks FROM Artists ar LEFT JOIN Albums al ON al.ArtistID = ar.ID LEFT JOIN Tracks t ON t.AlbumID = al.ID AND t.GenreID IN (SELECT ID FROM Genres WHERE Name = 'Rock') WHERE al.ReleaseYear BETWEEN 2020 AND 2024 GROUP BY ar.ID, ar.Name, ar.Gender, ar.Country ORDER BY ar.ID"],
        },
        CAU_Q6,
        {
          ten: { en: 'Q7 · Per country: the album leading in all-time AND 2023 playlist additions', vi: 'Q7 · Mỗi nước: album dẫn đầu cả tổng lượt thêm vào playlist LẪN lượt năm 2023' }, diem: 1,
          moTa: { en: 'For each country, the album(s) of that country\'s artists that have BOTH the highest total number of playlist additions (all years) AND the highest number of additions in 2023, among the albums of the same country.', vi: 'Với mỗi nước, (các) album của nghệ sĩ nước đó vừa có tổng lượt được thêm vào playlist (mọi năm) cao nhất VỪA có lượt thêm năm 2023 cao nhất, trong các album cùng nước.' },
          yeuCau: [{ en: 'Columns: <code>Country, AlbumID, AlbumTitle, TotalPlaylistAdditions, TotalPlaylistAdditionsIn2023</code>, ordered by Country, AlbumTitle. The year as a date range: AddedDate &gt;= \'2023-01-01\' AND AddedDate &lt; \'2024-01-01\'.', vi: 'Cột: <code>Country, AlbumID, AlbumTitle, TotalPlaylistAdditions, TotalPlaylistAdditionsIn2023</code>, sắp theo Country, AlbumTitle. Năm viết bằng khoảng ngày: AddedDate &gt;= \'2023-01-01\' AND AddedDate &lt; \'2024-01-01\'.' }],
          giai: `WITH AlbumStats AS (
    SELECT ar.Country, al.ID AS AlbumID, al.Title AS AlbumTitle,
           COUNT(pt.TrackID) AS TotalPlaylistAdditions,
           SUM(CASE WHEN pt.AddedDate >= '2023-01-01' AND pt.AddedDate < '2024-01-01' THEN 1 ELSE 0 END) AS TotalPlaylistAdditionsIn2023
    FROM Artists ar
    JOIN Albums al ON al.ArtistID = ar.ID
    JOIN Tracks t  ON t.AlbumID = al.ID
    LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID
    GROUP BY ar.Country, al.ID, al.Title
)
SELECT Country, AlbumID, AlbumTitle, TotalPlaylistAdditions, TotalPlaylistAdditionsIn2023
FROM AlbumStats a
WHERE TotalPlaylistAdditions       = (SELECT MAX(TotalPlaylistAdditions)       FROM AlbumStats b WHERE b.Country = a.Country)
  AND TotalPlaylistAdditionsIn2023 = (SELECT MAX(TotalPlaylistAdditionsIn2023) FROM AlbumStats b WHERE b.Country = a.Country)
ORDER BY Country ASC, AlbumTitle ASC;`,
          kiem: [kq('Q7 · Barbados, Canada, South Korea, UK', { thuTu: true }), kqAn('Q7 · another Barbados album gets a 2023 addition and now leads both counts', "INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate) SELECT 75, MIN(t.ID), '2023-05-05' FROM Tracks t JOIN Albums al ON al.ID = t.AlbumID JOIN Artists ar ON ar.ID = al.ArtistID WHERE ar.Country = 'Barbados' AND al.ID <> 60", { thuTu: true })],
          saiMau: ["WITH AlbumStats AS (SELECT ar.Country, al.ID AS AlbumID, al.Title AS AlbumTitle, COUNT(pt.TrackID) AS TotalPlaylistAdditions, SUM(CASE WHEN pt.AddedDate >= '2023-01-01' AND pt.AddedDate < '2024-01-01' THEN 1 ELSE 0 END) AS TotalPlaylistAdditionsIn2023 FROM Artists ar JOIN Albums al ON al.ArtistID = ar.ID JOIN Tracks t ON t.AlbumID = al.ID LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID GROUP BY ar.Country, al.ID, al.Title) SELECT Country, AlbumID, AlbumTitle, TotalPlaylistAdditions, TotalPlaylistAdditionsIn2023 FROM AlbumStats a WHERE TotalPlaylistAdditions = (SELECT MAX(TotalPlaylistAdditions) FROM AlbumStats b WHERE b.Country = a.Country) ORDER BY Country ASC, AlbumTitle ASC"],
        },
        {
          ten: { en: "Q10 · Add every 'Stars Dance' track to playlist 10", vi: "Q10 · Thêm mọi bài của 'Stars Dance' vào playlist 10" }, diem: 1,
          moTa: { en: "Insert rows into PlaylistTracks so that all tracks of the album titled 'Stars Dance' are added to the playlist with ID = 10, with AddedDate = 6 March 2026 (date only).", vi: "Chèn dòng vào PlaylistTracks để mọi bài của album tên 'Stars Dance' được thêm vào playlist ID = 10, AddedDate = 6/3/2026 (chỉ ngày)." },
          yeuCau: [{ en: 'One INSERT … SELECT; find the album by its title.', vi: 'Một INSERT … SELECT; tìm album theo tên.' }],
          giai: `INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate)
SELECT 10, t.ID, '2026-03-06'
FROM Tracks t
JOIN Albums al ON al.ID = t.AlbumID
WHERE al.Title = 'Stars Dance';`,
          kiem: [
            sau('Q10 · playlist 10 now has its 4 old tracks + 3 from Stars Dance', 'SELECT PlaylistID, TrackID, AddedDate FROM PlaylistTracks WHERE PlaylistID = 10 ORDER BY TrackID', { thuTu: true }),
            sau('Q10 · hidden: Stars Dance has a fourth track', 'SELECT PlaylistID, TrackID, AddedDate FROM PlaylistTracks WHERE PlaylistID = 10 ORDER BY TrackID', { an: true, thuTu: true, themCsdl: THEM_TRACK(900, 'Bonus Dance', 88, 1) }),
          ],
          saiMau: ["INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate) VALUES (10, 265, '2026-03-06'), (10, 266, '2026-03-06'), (10, 267, '2026-03-06')", "INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate) SELECT 10, t.ID, '2026-06-03' FROM Tracks t JOIN Albums al ON al.ID = t.AlbumID WHERE al.Title = 'Stars Dance'"],
        },
      ],
      thuatNgu: [tn('optional side of an outer join', 'phía tuỳ chọn của phép nối ngoài'), tn('fan-out', 'nhân dòng khi nối')],
      goiY: [
        { en: 'Q4/Q5: a condition on the optional (LEFT-joined) table goes in its ON clause; in WHERE it turns the LEFT JOIN back into an inner join.', vi: 'Q4/Q5: điều kiện trên bảng tuỳ chọn (được LEFT JOIN) đặt trong ON của nó; đặt ở WHERE sẽ biến LEFT JOIN thành nối trong.' },
        { en: 'Q5: two LEFT JOINs multiply rows (albums × tracks) ⇒ COUNT(DISTINCT al.ID) for albums.', vi: 'Q5: hai LEFT JOIN nhân dòng (album × bài) ⇒ COUNT(DISTINCT al.ID) cho số album.' },
        { en: 'Q6/Q7: compute the numbers once in a CTE, then compare with the MAX of the same group (artist / country).', vi: 'Q6/Q7: tính số liệu một lần trong CTE, rồi so với MAX của cùng nhóm (nghệ sĩ / nước).' },
      ],
      loiHayGap: [
        { en: 'Q5 with the year filter in WHERE — artists without a 2020–2024 album vanish instead of showing 0.', vi: 'Q5 để điều kiện năm ở WHERE — nghệ sĩ không có album 2020–2024 biến mất thay vì hiện 0.' },
        { en: 'Q7 checking only one of the two maxima.', vi: 'Q7 chỉ kiểm một trong hai mức cao nhất.' },
        { en: 'Q10 typing the three track ids by hand — breaks when the album changes.', vi: 'Q10 gõ tay ba mã bài — hỏng khi album thay đổi.' },
      ],
      giaiThich: { en: '<p>The reference answers are the paper\'s own, with YEAR() rewritten as a date range so they also run on PostgreSQL. Each file is graded on the paper\'s data and again on a modified copy.</p>', vi: '<p>Lời giải mẫu là lời giải của đề, chỉ đổi YEAR() thành khoảng ngày để chạy được cả trên PostgreSQL. Mỗi tệp được chấm trên dữ liệu của đề và trên một bản đã sửa.</p>' },
    }),
    tsql({
      t: 'PE SP26 Paper 1 — Q1, Q8, Q9: ERD → tables, procedure listTopArtistByYear, INSTEAD OF INSERT trigger', k: 'HARD', p: 35, dangBai: 'pe', diem: 100,
      kn: ['composite / multi-valued attribute', 'subclass (ER style)', 'stored procedure', 'INSTEAD OF trigger'], tag: ['pe', 'exam-review', 'sp26'],
      lyDo: ['Q1 needs nvarchar exactly as the ERD says, Q8 is a stored procedure and Q9 an INSTEAD OF trigger using GETDATE() — SQL Server–only, checked on your own server with the paper\'s DBscript.sql.', 'Q1 cần đúng nvarchar như ERD, Q8 là stored procedure và Q9 là trigger INSTEAD OF dùng GETDATE() — chỉ SQL Server có, kiểm trên máy chủ của bạn với đúng DBscript.sql của đề.'],
      en: `<p>The T-SQL half of the real SP26 Paper 1. setup.sql loads the paper's <code>DBscript.sql</code> (music database, IDENTITY keys).</p>
<ol><li><b>Q1</b> — ERD: <code>Universities(universityID int, name nvarchar(200), address = {street nvarchar(50), city nvarchar(50)})</code> 1 —workFor— N <code>Employees(empID int, FullName nvarchar(60), gender nvarchar(10), phone nvarchar(20) multi-valued)</code>; <code>Professors</code> isA Employees with <code>field nvarchar(100)</code>, N —workFor— 1 <code>Departments(depID int, name nvarchar(100))</code>. Multi-valued attribute table = table name + attribute name; subclass in ER style.</li>
<li><b>Q8</b> — <code>listTopArtistByYear @year int</code>: for each country, the artist(s) with the most playlist additions in that year (ties all shown): Country, ArtistID, ArtistName, TotalPlaylistAdditionsInYear.</li>
<li><b>Q9</b> — <code>tr_insertPlaylist</code> on Playlists: unknown UserID ⇒ not inserted; CreatedAt between the user's RegistrationDate and now ⇒ kept; otherwise ⇒ replaced by the current datetime. Several rows at once.</li></ol>`,
      vi: `<p>Nửa T-SQL của đề SP26 Paper 1 thật. setup.sql nạp <code>DBscript.sql</code> của đề (CSDL nhạc, khoá IDENTITY).</p>
<ol><li><b>Q1</b> — ERD: <code>Universities(universityID int, name nvarchar(200), address = {street nvarchar(50), city nvarchar(50)})</code> 1 —workFor— N <code>Employees(empID int, FullName nvarchar(60), gender nvarchar(10), phone nvarchar(20) đa trị)</code>; <code>Professors</code> isA Employees với <code>field nvarchar(100)</code>, N —workFor— 1 <code>Departments(depID int, name nvarchar(100))</code>. Bảng thuộc tính đa trị = tên bảng + tên thuộc tính; lớp con theo kiểu ER.</li>
<li><b>Q8</b> — <code>listTopArtistByYear @year int</code>: mỗi nước, (các) nghệ sĩ có nhiều lượt được thêm vào playlist nhất trong năm đó (hoà hiện hết): Country, ArtistID, ArtistName, TotalPlaylistAdditionsInYear.</li>
<li><b>Q9</b> — <code>tr_insertPlaylist</code> trên Playlists: UserID không tồn tại ⇒ không chèn; CreatedAt nằm giữa RegistrationDate của user và hiện tại ⇒ giữ; ngoài khoảng ⇒ thay bằng thời điểm hiện tại. Nhiều dòng cùng lúc.</li></ol>`,
      yc: [['In the exam each answer is its own file without GO; here solution.sql separates them with GO.', 'Khi thi mỗi câu một tệp không GO; ở đây solution.sql tách bằng GO.'], ['Q8 and Q9 are checked against the paper\'s data and its 4-row INSERT test.', 'Q8 và Q9 được kiểm trên dữ liệu của đề và phép thử INSERT 4 dòng của đề.']],
      setup: PE_MUSIC_TSQL,
      khoi: `-- Q1: CREATE TABLE Universities (...) ... Professors (...)
GO
-- Q8: CREATE PROCEDURE listTopArtistByYear @year int AS ...
GO
-- Q9: CREATE TRIGGER tr_insertPlaylist ON Playlists ...`,
      giai: GIAI_TAY,
      kiem: [
        ...KIEM_Q1_NHAC,
        ck(['Q8 · listTopArtistByYear 2023 = the paper\'s result (USA Taylor Swift 12, UK Adele 12, …)', 'Q8 · listTopArtistByYear 2023 = kết quả của đề (USA Taylor Swift 12, UK Adele 12, …)'], SO_Q8(2023)),
        ck(['Q8 · listTopArtistByYear 2024 (ties shown)', 'Q8 · listTopArtistByYear 2024 (hiện cả hoà)'], SO_Q8(2024)),
        ...KIEM_Q9_NHAC,
      ],
      saiTay: [
        ...SAI_TAY_NHAC(GIAI_TAY),
        GIAI_TAY.replace('WHERE TotalPlaylistAdditionsInYear =\n          (SELECT MAX(TotalPlaylistAdditionsInYear) FROM ArtistTotals b WHERE b.Country = a.Country)', 'WHERE TotalPlaylistAdditionsInYear =\n          (SELECT MAX(TotalPlaylistAdditionsInYear) FROM ArtistTotals b)'),
      ],
      gy: [['Q1: composite attribute ⇒ its parts become columns; multi-valued ⇒ own table EmployeesPhone; subclass ⇒ Professors(empID PK + FK).', 'Q1: thuộc tính phức hợp ⇒ các phần thành cột; đa trị ⇒ bảng riêng EmployeesPhone; lớp con ⇒ Professors(empID vừa PK vừa FK).'], ['Q9: an INSTEAD OF trigger receives the rows in inserted and decides itself what to insert.', 'Q9: trigger INSTEAD OF nhận các dòng trong inserted và tự quyết chèn gì.']],
      lhg: [['Q8 comparing with the MAX of all countries — only the overall leader is shown.', 'Q8 so với MAX của mọi nước — chỉ hiện người dẫn đầu toàn cục.'], ['Q9 with LEFT JOIN Users — the row of the unknown user reaches the INSERT and fails on the foreign key.', 'Q9 dùng LEFT JOIN Users — dòng của user không tồn tại tới INSERT và lỗi khoá ngoại.']],
      gt: ['<p>The paper\'s reference answers, run on SQL Server. Q9\'s INSTEAD OF trigger inserts into the same table without firing itself again (an INSTEAD OF trigger does not recurse on its own table).</p>', '<p>Lời giải mẫu của đề, chạy trên SQL Server. Trigger INSTEAD OF ở Q9 chèn vào chính bảng đó mà không tự kích hoạt lại (trigger INSTEAD OF không đệ quy trên bảng của nó).</p>'],
      tn: TN_NHAC,
    }),
  ],
});
