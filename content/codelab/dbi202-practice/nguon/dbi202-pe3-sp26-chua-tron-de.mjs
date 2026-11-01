/**
 * DBI202 · Chữa trọn đề PE 3 (SP26 · Paper 8 · CSDL nhạc) — đề thật content/exams/DBI202-PE3, cùng DBscript.sql với Paper 1.
 *   Đề 1 (trình duyệt): Q2–Q7 + Q10 trên đúng dữ liệu của đề + kiểm ẩn đổi dữ liệu.
 *   Đề 2 (SQL Server của người học): Q1 (ERD), Q8 (hàm trả về bảng), Q9 (trigger INSTEAD OF INSERT).
 */
import { doiDau, KHOA, deLonSql, kq, kqAn, sau, tsql, ck, tn } from './_chung.mjs';
import { PE_MUSIC, PE_MUSIC_TSQL } from './_pe-sp26.mjs';
import { MO_HINH_NHAC, YC_CHUNG_NHAC, CAU_Q2, CAU_Q6, THEM_TRACK, Q1_NHAC, Q9_NHAC, KIEM_Q1_NHAC, KIEM_Q9_NHAC, SAI_TAY_NHAC, TN_NHAC } from './_pe-nhac.mjs';

const Q8 = `CREATE FUNCTION returnTopArtistByYear (@year int)
RETURNS TABLE
AS
RETURN
(
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
);`;
const GIAI_TAY = `-- Q1
${Q1_NHAC}
GO
-- Q8
${Q8}
GO
-- Q9
${Q9_NHAC}`;
const SO_Q8 = (nam) => `DECLARE @r TABLE (Country NVARCHAR(50), ArtistID INT, ArtistName NVARCHAR(100), Tong INT);
INSERT INTO @r SELECT Country, ArtistID, ArtistName, TotalPlaylistAdditionsInYear FROM dbo.returnTopArtistByYear(${nam});
DECLARE @ref TABLE (Country NVARCHAR(50), ArtistID INT, ArtistName NVARCHAR(100), Tong INT);
WITH x AS (SELECT ar.Country, ar.ID AS ArtistID, ar.Name AS ArtistName, COUNT(pt.TrackID) AS Tong FROM Artists ar LEFT JOIN Albums al ON al.ArtistID = ar.ID LEFT JOIN Tracks t ON t.AlbumID = al.ID LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID AND pt.AddedDate >= DATEFROMPARTS(${nam}, 1, 1) AND pt.AddedDate < DATEFROMPARTS(${nam} + 1, 1, 1) GROUP BY ar.Country, ar.ID, ar.Name)
INSERT INTO @ref SELECT * FROM x a WHERE Tong = (SELECT MAX(Tong) FROM x b WHERE b.Country = a.Country);
SET @ok = IIF(NOT EXISTS (SELECT * FROM @r EXCEPT SELECT * FROM @ref) AND NOT EXISTS (SELECT * FROM @ref EXCEPT SELECT * FROM @r) AND (SELECT COUNT(*) FROM @r) = (SELECT COUNT(*) FROM @ref), 1, 0);
SET @info = CONCAT(N'rows = ', (SELECT COUNT(*) FROM @r), N', expected ', (SELECT COUNT(*) FROM @ref));`;

export default doiDau({
  slug: 'dbi202-pe3-sp26-chua-tron-de',
  ten: 'PE review · Exam 3 (SP26 · Paper 8 · music DB) — all 10 questions',
  khoa: KHOA,
  baiHoc: 'dbi202-pe3-sp26-chua-tron-de',
  de: [
    deLonSql({
      dangBai: 'pe',
      tieuDe: 'PE SP26 Paper 8 (music database) — Q2–Q7 and Q10, graded in the browser',
      doKho: 'HARD', phut: 60, diem: 100,
      khaiNiem: ['LIKE', 'BETWEEN on years', 'LEFT JOIN to a joined group', 'COUNT DISTINCT', 'maximum per group with ties', 'two maxima at once', 'INSERT … SELECT'],
      the: ['dbi202', 'pe', 'sql', 'exam-review', 'sp26'],
      csdl: PE_MUSIC, tenCsdl: 'DBscript',
      thuMuc: 'RollNo_Name_DBI202_PE_SP26_P8',
      phu: { en: 'DBI202 · real Practical Exam SP26 Paper 8 · same DBscript.sql as Paper 1 · 1 mark per question', vi: 'DBI202 · đề thi thực hành thật SP26 Paper 8 · cùng DBscript.sql với Paper 1 · mỗi câu 1 điểm' },
      moTa: {
        en: '<p>The real SP26 Paper 8 — same music database as Paper 1, different questions for Q3–Q5, Q7, Q8 and Q10. The plain-SQL questions are graded here on the paper\'s data and on a modified copy; Q1, Q8 (a table-valued function) and Q9 (trigger) are the second exercise of this lesson.</p>',
        vi: '<p>Đề SP26 Paper 8 thật — cùng CSDL nhạc với Paper 1, khác câu ở Q3–Q5, Q7, Q8 và Q10. Các câu SQL thuần được chấm ở đây trên dữ liệu của đề và trên một bản đã sửa; Q1, Q8 (hàm trả về bảng) và Q9 (trigger) là bài thứ hai của bài học này.</p>',
      },
      yeuCauChung: YC_CHUNG_NHAC,
      moHinh: MO_HINH_NHAC,
      cau: [
        CAU_Q2,
        {
          ten: { en: "Q3 · Rock tracks of albums from 2017 to 2021", vi: 'Q3 · Bài Rock thuộc album từ 2017 tới 2021' }, diem: 1,
          moTa: { en: "Tracks of albums released between 2017 and 2021 (inclusive) in the genre named 'Rock'.", vi: "Bài hát thuộc album phát hành từ 2017 tới 2021 (gồm hai đầu), thể loại tên 'Rock'." },
          yeuCau: [{ en: 'Columns: <code>TrackID, TrackTitle, AlbumTitle, ReleaseYear, GenreName</code>, ordered by TrackID.', vi: 'Cột: <code>TrackID, TrackTitle, AlbumTitle, ReleaseYear, GenreName</code>, sắp theo TrackID.' }],
          giai: `SELECT t.ID AS TrackID, t.Title AS TrackTitle, al.Title AS AlbumTitle, al.ReleaseYear,
       g.Name AS GenreName
FROM Tracks t
JOIN Albums al ON al.ID = t.AlbumID
JOIN Genres g  ON g.ID  = t.GenreID
WHERE al.ReleaseYear BETWEEN 2017 AND 2021
  AND g.Name = 'Rock'
ORDER BY t.ID;`,
          kiem: [kq('Q3 · 16 tracks', { thuTu: true }), kqAn('Q3 · Rock albums of 2016, 2017, 2021 and 2022 are added', `INSERT INTO Albums (ID, Title, ReleaseYear, ArtistID) VALUES (900, 'R2016', 2016, 2), (901, 'R2017', 2017, 2), (902, 'R2021', 2021, 2), (903, 'R2022', 2022, 2); ${THEM_TRACK(900, 'T2016', 900, 2)}; ${THEM_TRACK(901, 'T2017', 901, 2)}; ${THEM_TRACK(902, 'T2021', 902, 2)}; ${THEM_TRACK(903, 'T2022', 903, 2)}`, { thuTu: true })],
          saiMau: ["SELECT t.ID AS TrackID, t.Title AS TrackTitle, al.Title AS AlbumTitle, al.ReleaseYear, g.Name AS GenreName FROM Tracks t JOIN Albums al ON al.ID = t.AlbumID JOIN Genres g ON g.ID = t.GenreID WHERE al.ReleaseYear > 2017 AND al.ReleaseYear < 2021 AND g.Name = 'Rock' ORDER BY t.ID", "SELECT t.ID AS TrackID, t.Title AS TrackTitle, al.Title AS AlbumTitle, al.ReleaseYear, g.Name AS GenreName FROM Tracks t JOIN Albums al ON al.ID = t.AlbumID JOIN Genres g ON g.ID = t.GenreID WHERE al.ReleaseYear BETWEEN 2017 AND 2021 AND g.ID = 1 ORDER BY t.ID"],
        },
        {
          ten: { en: "Q4 · Free users of 2024, their playlists and Electronic tracks", vi: "Q4 · Người dùng Free đăng ký 2024, playlist và bài Electronic của họ" }, diem: 1,
          moTa: { en: "Users with SubscriptionType 'Free' who registered in 2024, with the playlists they created and the tracks of those playlists that are in the genre 'Electronic'. Users without playlists and playlists without Electronic tracks still appear (NULL columns).", vi: "Người dùng SubscriptionType 'Free' đăng ký năm 2024, kèm các playlist họ tạo và các bài thể loại 'Electronic' trong đó. Người không có playlist và playlist không có bài Electronic vẫn hiện (cột NULL)." },
          yeuCau: [{ en: 'Columns: <code>UserID, Username, SubscriptionType, RegistrationDate, PlaylistTitle, TrackTitle, GenreName</code>. The paper sorts by Username, PlaylistTitle, TrackTitle; the order is not graded here (NULL ordering differs). Registration year as a date range.', vi: 'Cột: <code>UserID, Username, SubscriptionType, RegistrationDate, PlaylistTitle, TrackTitle, GenreName</code>. Đề sắp theo Username, PlaylistTitle, TrackTitle; ở đây không chấm thứ tự (thứ tự NULL khác nhau). Năm đăng ký viết bằng khoảng ngày.' }],
          giai: `SELECT u.ID AS UserID, u.Username, u.SubscriptionType, u.RegistrationDate,
       p.Title AS PlaylistTitle, t.Title AS TrackTitle, g.Name AS GenreName
FROM Users u
LEFT JOIN Playlists p ON p.UserID = u.ID
LEFT JOIN (PlaylistTracks pt                                   -- only ELECTRONIC tracks are attached…
           JOIN Tracks t ON t.ID = pt.TrackID
           JOIN Genres g ON g.ID = t.GenreID AND g.Name = 'Electronic')
       ON pt.PlaylistID = p.ID                                 -- …and a playlist without one still appears
WHERE u.SubscriptionType = 'Free'
  AND u.RegistrationDate >= '2024-01-01' AND u.RegistrationDate < '2025-01-01'
ORDER BY u.Username ASC, PlaylistTitle ASC, TrackTitle ASC;`,
          kiem: [kq('Q4 · 9 rows (ella_m, nora_e, zara_s)'), kqAn('Q4 · a new Free user of 2024 with no playlist; zara_s turns Premium', "INSERT INTO Users (ID, Username, Email, SubscriptionType, RegistrationDate) VALUES (900, 'new_free', 'nf@x.vn', 'Free', '2024-12-31'); UPDATE Users SET SubscriptionType = 'Premium' WHERE ID = 30")],
          saiMau: ["SELECT u.ID AS UserID, u.Username, u.SubscriptionType, u.RegistrationDate, p.Title AS PlaylistTitle, t.Title AS TrackTitle, g.Name AS GenreName FROM Users u LEFT JOIN Playlists p ON p.UserID = u.ID LEFT JOIN PlaylistTracks pt ON pt.PlaylistID = p.ID LEFT JOIN Tracks t ON t.ID = pt.TrackID LEFT JOIN Genres g ON g.ID = t.GenreID WHERE u.SubscriptionType = 'Free' AND u.RegistrationDate >= '2024-01-01' AND u.RegistrationDate < '2025-01-01' AND g.Name = 'Electronic'", "SELECT u.ID AS UserID, u.Username, u.SubscriptionType, u.RegistrationDate, p.Title AS PlaylistTitle, t.Title AS TrackTitle, g.Name AS GenreName FROM Users u JOIN Playlists p ON p.UserID = u.ID LEFT JOIN (PlaylistTracks pt JOIN Tracks t ON t.ID = pt.TrackID JOIN Genres g ON g.ID = t.GenreID AND g.Name = 'Electronic') ON pt.PlaylistID = p.ID WHERE u.SubscriptionType = 'Free' AND u.RegistrationDate >= '2024-01-01' AND u.RegistrationDate < '2025-01-01'"],
        },
        {
          ten: { en: 'Q5 · Every user: playlists of 2024 and distinct English tracks in them', vi: 'Q5 · Mọi người dùng: playlist năm 2024 và số bài tiếng Anh khác nhau trong đó' }, diem: 1,
          moTa: { en: "Every user with the number of playlists they created in 2024 and the number of DISTINCT tracks in the language 'English' in those playlists — 0 when none.", vi: "Mọi người dùng kèm số playlist họ tạo năm 2024 và số bài KHÁC NHAU có Language 'English' trong các playlist đó — 0 nếu không có." },
          yeuCau: [{ en: 'Columns: <code>UserID, Username, NumberOfPlaylists, NumberOfTracks</code>, ordered by UserID. The year as a date range on CreatedAt.', vi: 'Cột: <code>UserID, Username, NumberOfPlaylists, NumberOfTracks</code>, sắp theo UserID. Năm viết bằng khoảng ngày trên CreatedAt.' }],
          giai: `SELECT u.ID AS UserID, u.Username,
       COUNT(DISTINCT p.ID) AS NumberOfPlaylists,
       COUNT(DISTINCT t.ID) AS NumberOfTracks
FROM Users u
LEFT JOIN Playlists p       ON p.UserID = u.ID AND p.CreatedAt >= '2024-01-01' AND p.CreatedAt < '2025-01-01'
LEFT JOIN PlaylistTracks pt ON pt.PlaylistID = p.ID
LEFT JOIN Tracks t          ON t.ID = pt.TrackID AND t.Language = 'English'
GROUP BY u.ID, u.Username
ORDER BY u.ID;`,
          kiem: [kq('Q5 · 30 users', { thuTu: true }), kqAn('Q5 · user 1 creates a 2024 playlist holding an English track twice-listed elsewhere', "INSERT INTO Playlists (ID, Title, UserID, CreatedAt) VALUES (900, 'New 2024', 1, '2024-12-31 23:00:00'); INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate) VALUES (900, 2, '2024-12-31'), (900, 15, '2024-12-31')", { thuTu: true })],
          saiMau: ["SELECT u.ID AS UserID, u.Username, COUNT(p.ID) AS NumberOfPlaylists, COUNT(t.ID) AS NumberOfTracks FROM Users u LEFT JOIN Playlists p ON p.UserID = u.ID AND p.CreatedAt >= '2024-01-01' AND p.CreatedAt < '2025-01-01' LEFT JOIN PlaylistTracks pt ON pt.PlaylistID = p.ID LEFT JOIN Tracks t ON t.ID = pt.TrackID AND t.Language = 'English' GROUP BY u.ID, u.Username ORDER BY u.ID", "SELECT u.ID AS UserID, u.Username, COUNT(DISTINCT p.ID) AS NumberOfPlaylists, COUNT(DISTINCT t.ID) AS NumberOfTracks FROM Users u LEFT JOIN Playlists p ON p.UserID = u.ID LEFT JOIN PlaylistTracks pt ON pt.PlaylistID = p.ID LEFT JOIN Tracks t ON t.ID = pt.TrackID AND t.Language = 'English' WHERE p.CreatedAt >= '2024-01-01' AND p.CreatedAt < '2025-01-01' GROUP BY u.ID, u.Username ORDER BY u.ID"],
        },
        CAU_Q6,
        {
          ten: { en: 'Q7 · Per country: the album leading in all-time AND 2024 playlist additions', vi: 'Q7 · Mỗi nước: album dẫn đầu cả tổng lượt thêm vào playlist LẪN lượt năm 2024' }, diem: 1,
          moTa: { en: 'For each country, the album(s) that have BOTH the highest total number of playlist additions (all years) AND the highest number of additions in 2024, among albums of artists from the same country.', vi: 'Với mỗi nước, (các) album vừa có tổng lượt được thêm vào playlist (mọi năm) cao nhất VỪA có lượt thêm năm 2024 cao nhất, trong các album của nghệ sĩ cùng nước.' },
          yeuCau: [{ en: 'Columns: <code>Country, AlbumID, AlbumTitle, TotalPlaylistAdditions, TotalPlaylistAdditionsIn2024</code>, ordered by Country, AlbumTitle.', vi: 'Cột: <code>Country, AlbumID, AlbumTitle, TotalPlaylistAdditions, TotalPlaylistAdditionsIn2024</code>, sắp theo Country, AlbumTitle.' }],
          giai: `WITH AlbumStats AS (
    SELECT ar.Country, al.ID AS AlbumID, al.Title AS AlbumTitle,
           COUNT(pt.TrackID) AS TotalPlaylistAdditions,
           SUM(CASE WHEN pt.AddedDate >= '2024-01-01' AND pt.AddedDate < '2025-01-01' THEN 1 ELSE 0 END) AS TotalPlaylistAdditionsIn2024
    FROM Artists ar
    JOIN Albums al ON al.ArtistID = ar.ID
    JOIN Tracks t  ON t.AlbumID = al.ID
    LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID
    GROUP BY ar.Country, al.ID, al.Title
)
SELECT Country, AlbumID, AlbumTitle, TotalPlaylistAdditions, TotalPlaylistAdditionsIn2024
FROM AlbumStats a
WHERE TotalPlaylistAdditions       = (SELECT MAX(TotalPlaylistAdditions)       FROM AlbumStats b WHERE b.Country = a.Country)
  AND TotalPlaylistAdditionsIn2024 = (SELECT MAX(TotalPlaylistAdditionsIn2024) FROM AlbumStats b WHERE b.Country = a.Country)
ORDER BY Country ASC, AlbumTitle ASC;`,
          kiem: [kq('Q7 · Barbados, Canada, South Korea, UK', { thuTu: true }), kqAn('Q7 · two more 2024 additions for another Canadian album', "INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate) SELECT p.ID, x.TrackID, '2024-06-06' FROM (SELECT MIN(t.ID) AS TrackID FROM Tracks t WHERE t.AlbumID = 28) x CROSS JOIN (SELECT ID FROM Playlists WHERE ID IN (74, 75)) p", { thuTu: true })],
          saiMau: ["WITH AlbumStats AS (SELECT ar.Country, al.ID AS AlbumID, al.Title AS AlbumTitle, COUNT(pt.TrackID) AS TotalPlaylistAdditions, SUM(CASE WHEN pt.AddedDate >= '2024-01-01' AND pt.AddedDate < '2025-01-01' THEN 1 ELSE 0 END) AS TotalPlaylistAdditionsIn2024 FROM Artists ar JOIN Albums al ON al.ArtistID = ar.ID JOIN Tracks t ON t.AlbumID = al.ID LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID GROUP BY ar.Country, al.ID, al.Title) SELECT Country, AlbumID, AlbumTitle, TotalPlaylistAdditions, TotalPlaylistAdditionsIn2024 FROM AlbumStats a WHERE TotalPlaylistAdditionsIn2024 = (SELECT MAX(TotalPlaylistAdditionsIn2024) FROM AlbumStats b WHERE b.Country = a.Country) ORDER BY Country ASC, AlbumTitle ASC"],
        },
        {
          ten: { en: "Q10 · Add every 'Heartbreaker' track to playlist 11", vi: "Q10 · Thêm mọi bài của 'Heartbreaker' vào playlist 11" }, diem: 1,
          moTa: { en: "Insert rows into PlaylistTracks so that all tracks of the album titled 'Heartbreaker' are added to the playlist with ID = 11, with AddedDate = 5 February 2026 (date only).", vi: "Chèn dòng vào PlaylistTracks để mọi bài của album tên 'Heartbreaker' được thêm vào playlist ID = 11, AddedDate = 5/2/2026 (chỉ ngày)." },
          yeuCau: [{ en: 'One INSERT … SELECT; find the album by its title.', vi: 'Một INSERT … SELECT; tìm album theo tên.' }],
          giai: `INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate)
SELECT 11, t.ID, '2026-02-05'
FROM Tracks t
JOIN Albums al ON al.ID = t.AlbumID
WHERE al.Title = 'Heartbreaker';`,
          kiem: [
            sau('Q10 · playlist 11: its 4 old tracks + the Heartbreaker tracks', 'SELECT PlaylistID, TrackID, AddedDate FROM PlaylistTracks WHERE PlaylistID = 11 ORDER BY TrackID', { thuTu: true }),
            sau('Q10 · hidden: Heartbreaker gets one more track', 'SELECT PlaylistID, TrackID, AddedDate FROM PlaylistTracks WHERE PlaylistID = 11 ORDER BY TrackID', { an: true, thuTu: true, themCsdl: THEM_TRACK(900, 'Bonus Heart', 94, 1) }),
          ],
          saiMau: ["INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate) SELECT 11, t.ID, '2026-05-02' FROM Tracks t JOIN Albums al ON al.ID = t.AlbumID WHERE al.Title = 'Heartbreaker'", "INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate) SELECT 10, t.ID, '2026-02-05' FROM Tracks t JOIN Albums al ON al.ID = t.AlbumID WHERE al.Title = 'Heartbreaker'"],
        },
      ],
      thuatNgu: [tn('parenthesised join', 'phép nối lồng trong ngoặc'), tn('COUNT(DISTINCT x)', 'đếm giá trị khác nhau')],
      goiY: [
        { en: 'Q4: attach only the Electronic tracks with a parenthesised join — LEFT JOIN (PlaylistTracks JOIN Tracks JOIN Genres …) ON … — so playlists without them survive.', vi: 'Q4: chỉ gắn bài Electronic bằng phép nối trong ngoặc — LEFT JOIN (PlaylistTracks JOIN Tracks JOIN Genres …) ON … — để playlist không có bài nào vẫn còn.' },
        { en: 'Q5: the year filter belongs in the ON of Playlists; DISTINCT in both counts.', vi: 'Q5: điều kiện năm nằm trong ON của Playlists; DISTINCT ở cả hai phép đếm.' },
        { en: 'Q7: two equalities with two MAX subqueries over the same CTE.', vi: 'Q7: hai đẳng thức với hai truy vấn con MAX trên cùng CTE.' },
      ],
      loiHayGap: [
        { en: "Q4 with g.Name = 'Electronic' in WHERE — every playlist without an Electronic track disappears.", vi: "Q4 đặt g.Name = 'Electronic' ở WHERE — mọi playlist không có bài Electronic biến mất." },
        { en: 'Q5 without DISTINCT — playlists are multiplied by their tracks.', vi: 'Q5 thiếu DISTINCT — số playlist bị nhân với số bài.' },
        { en: 'Q3 with > and < — BETWEEN includes both 2017 and 2021.', vi: 'Q3 dùng > và < — BETWEEN tính cả 2017 lẫn 2021.' },
      ],
      giaiThich: { en: '<p>The paper\'s reference answers with YEAR() rewritten as date ranges. Each file is graded on the paper\'s data and again on a modified copy.</p>', vi: '<p>Lời giải mẫu của đề, đổi YEAR() thành khoảng ngày. Mỗi tệp được chấm trên dữ liệu của đề và trên một bản đã sửa.</p>' },
    }),
    tsql({
      t: 'PE SP26 Paper 8 — Q1, Q8, Q9: ERD → tables, table-valued function returnTopArtistByYear, INSTEAD OF INSERT trigger', k: 'HARD', p: 35, dangBai: 'pe', diem: 100,
      kn: ['ERD → tables', 'inline table-valued function', 'INSTEAD OF trigger'], tag: ['pe', 'exam-review', 'sp26'],
      lyDo: ['Q1 needs nvarchar exactly as the ERD says, Q8 is an inline table-valued function and Q9 an INSTEAD OF trigger using GETDATE() — SQL Server–only, checked on your own server with the paper\'s DBscript.sql.', 'Q1 cần đúng nvarchar như ERD, Q8 là hàm trả về bảng và Q9 là trigger INSTEAD OF dùng GETDATE() — chỉ SQL Server có, kiểm trên máy chủ của bạn với đúng DBscript.sql của đề.'],
      en: `<p>The T-SQL half of the real SP26 Paper 8 (setup.sql loads the paper's <code>DBscript.sql</code>).</p>
<ol><li><b>Q1</b> — the same ERD as Paper 1: Universities (composite address street/city), Employees (multi-valued phone), Professors isA Employees, Departments; workFor relationships 1–N.</li>
<li><b>Q8</b> — inline table-valued function <code>returnTopArtistByYear(@year int)</code> returning, for each country, the artist(s) with the most playlist additions in that year (ties all included): Country, ArtistID, ArtistName, TotalPlaylistAdditionsInYear. Test: <code>select * from returnTopArtistByYear(2023)</code>.</li>
<li><b>Q9</b> — <code>tr_insertPlaylist</code>: unknown UserID ⇒ not inserted; CreatedAt between RegistrationDate and now ⇒ kept; otherwise ⇒ current datetime; several rows at once.</li></ol>`,
      vi: `<p>Nửa T-SQL của đề SP26 Paper 8 thật (setup.sql nạp <code>DBscript.sql</code> của đề).</p>
<ol><li><b>Q1</b> — cùng ERD với Paper 1: Universities (thuộc tính phức hợp address street/city), Employees (phone đa trị), Professors isA Employees, Departments; các quan hệ workFor 1–N.</li>
<li><b>Q8</b> — hàm trả về bảng <code>returnTopArtistByYear(@year int)</code>: mỗi nước, (các) nghệ sĩ có nhiều lượt được thêm vào playlist nhất trong năm (hoà lấy hết): Country, ArtistID, ArtistName, TotalPlaylistAdditionsInYear. Thử: <code>select * from returnTopArtistByYear(2023)</code>.</li>
<li><b>Q9</b> — <code>tr_insertPlaylist</code>: UserID không tồn tại ⇒ không chèn; CreatedAt giữa RegistrationDate và hiện tại ⇒ giữ; ngoài khoảng ⇒ thời điểm hiện tại; nhiều dòng cùng lúc.</li></ol>`,
      yc: [['An inline TVF: RETURNS TABLE AS RETURN ( one SELECT ) — no BEGIN/END, no ORDER BY.', 'TVF inline: RETURNS TABLE AS RETURN ( một câu SELECT ) — không BEGIN/END, không ORDER BY.'], ['In the exam each answer is its own file without GO.', 'Khi thi mỗi câu một tệp, không GO.']],
      setup: PE_MUSIC_TSQL,
      khoi: `-- Q1: CREATE TABLE Universities (...) ... Professors (...)
GO
-- Q8: CREATE FUNCTION returnTopArtistByYear (@year int) RETURNS TABLE AS RETURN (...)
GO
-- Q9: CREATE TRIGGER tr_insertPlaylist ON Playlists ...`,
      giai: GIAI_TAY,
      kiem: [
        ...KIEM_Q1_NHAC,
        ck(['Q8 · returnTopArtistByYear(2023) = the paper\'s result', 'Q8 · returnTopArtistByYear(2023) = kết quả của đề'], SO_Q8(2023)),
        ck(['Q8 · returnTopArtistByYear(2024) (ties included)', 'Q8 · returnTopArtistByYear(2024) (gồm cả hoà)'], SO_Q8(2024)),
        ...KIEM_Q9_NHAC,
      ],
      saiTay: [
        ...SAI_TAY_NHAC(GIAI_TAY),
        GIAI_TAY.replace('LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID AND YEAR(pt.AddedDate) = @year', 'LEFT JOIN PlaylistTracks pt ON pt.TrackID = t.ID'),
      ],
      gy: [['A TVF is used like a table: SELECT * FROM dbo.returnTopArtistByYear(2023).', 'TVF dùng như một bảng: SELECT * FROM dbo.returnTopArtistByYear(2023).'], ['The year condition of an optional table goes in its ON (otherwise artists with 0 additions vanish).', 'Điều kiện năm của bảng tuỳ chọn đặt trong ON của nó (không thì nghệ sĩ 0 lượt biến mất).']],
      lhg: [['Forgetting the year in the PlaylistTracks join — all-time totals are returned.', 'Quên điều kiện năm khi nối PlaylistTracks — trả tổng mọi năm.'], ['ORDER BY inside an inline TVF — not allowed without TOP.', 'ORDER BY trong TVF inline — không được nếu không có TOP.']],
      gt: ['<p>The paper\'s reference answers, run on SQL Server. Barbados shows Rihanna with 0: with LEFT JOINs every artist is counted, and the maximum of a country with no addition that year is 0.</p>', '<p>Lời giải mẫu của đề, chạy trên SQL Server. Barbados hiện Rihanna với 0: nhờ LEFT JOIN mọi nghệ sĩ đều được đếm, và mức cao nhất của một nước không có lượt nào năm đó là 0.</p>'],
      tn: TN_NHAC,
    }),
  ],
});
