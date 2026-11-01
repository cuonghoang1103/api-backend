/**
 * DBI202 · 4.B Slide trường Chương 3 (20–38) — dị thường (cập nhật/xoá/chèn), phân rã Movies1 thành hai bảng bằng SQL,
 * nối lại không mất, 1NF và 2NF.
 */
import { mod, de, cs, q, bang1, kq, kqAn, sau, ma, TN, tn } from './_chung.mjs';
import { MOVIES1, LD_MOVIES1 } from './dbi202-slide-dbi4-1.mjs';

const M1 = { csdl: MOVIES1, tenCsdl: 'Movies1', ld: LD_MOVIES1 };
const PHAN_RA = `CREATE TABLE Movies2 (
    title      VARCHAR(40) NOT NULL,
    year       INT         NOT NULL,
    length     INT         NULL,
    genre      VARCHAR(10) NULL,
    studioName VARCHAR(20) NULL,
    PRIMARY KEY (title, year)
);
CREATE TABLE Movies3 (
    title    VARCHAR(40) NOT NULL,
    year     INT         NOT NULL,
    starName VARCHAR(30) NOT NULL,
    PRIMARY KEY (title, year, starName),
    FOREIGN KEY (title, year) REFERENCES Movies2 (title, year)
);
INSERT INTO Movies2 (title, year, length, genre, studioName)
SELECT DISTINCT title, year, length, genre, studioName FROM Movies1;     -- one row per movie
INSERT INTO Movies3 (title, year, starName)
SELECT title, year, starName FROM Movies1;                               -- one row per (movie, star)`;
const THEM = `INSERT INTO Movies1 VALUES (N'Alien', 1979, 117, N'SciFi', N'Fox', N'Sigourney Weaver'), (N'Alien', 1979, 117, N'SciFi', N'Fox', N'Tom Skerritt')`;

export default mod('dbi202-slide-dbi4-2', '4.B Anomalies, decomposition, 1NF & 2NF (slides 20–38)', [
  cs({
    t: 'Name the anomaly', k: 'EASY', p: 6, loai: 'table',
    kn: ['update anomaly', 'deletion anomaly', 'insertion anomaly', 'redundancy'], tag: ['normalization', 'slide'],
    en: '<p>On Movies1 (one row per movie and star — tab <code>Movies1.sql</code>), name the anomaly each event shows (slides 21–22).</p>',
    vi: '<p>Trên Movies1 (mỗi phim × diễn viên một dòng — tab <code>Movies1.sql</code>), gọi tên dị thường mà mỗi sự kiện cho thấy (slide 21–22).</p>',
    bang: [bang1('b1', ['Event → anomaly', 'Sự kiện → dị thường'],
      [{ ma: 'sk', ten: 'Event / Sự kiện' }, { ma: 'dt', ten: 'Anomaly / Dị thường', luaChon: ['redundancy', 'update anomaly', 'deletion anomaly', 'insertion anomaly'] }],
      [{ o: { sk: 'Star Wars\' length 124 is stored three times, once per star.' }, a: { dt: 'redundancy' } },
        { o: { sk: 'The length of Star Wars is corrected in one row only; the three rows now disagree.' }, a: { dt: 'update anomaly' } },
        { o: { sk: 'Vivien Leigh is removed and the movie Gone With the Wind disappears with her.' }, a: { dt: 'deletion anomaly' } },
        { o: { sk: 'A new movie without any star yet cannot be stored (starName is part of the key).' }, a: { dt: 'insertion anomaly' } }],
      ['All four come from one cause: facts about a movie depend on (title, year) only, but the table\'s key is (title, year, starName).', 'Cả bốn có chung một nguyên nhân: thông tin về phim chỉ phụ thuộc (title, year), nhưng khoá của bảng là (title, year, starName).'])],
    gy: [['Update = copies disagree; deletion = deleting one fact loses another; insertion = cannot add a fact alone.', 'Cập nhật = các bản sao lệch nhau; xoá = xoá một sự kiện mất luôn sự kiện khác; chèn = không thêm được một sự kiện riêng.'], ['Redundancy is the root; the three anomalies are its symptoms.', 'Dư thừa là gốc; ba dị thường là triệu chứng.']],
    lhg: [['Calling the deletion case an update anomaly.', 'Gọi trường hợp xoá là dị thường cập nhật.'], ['Thinking redundancy is harmless "because disk is cheap" — the anomalies are the cost.', 'Tưởng dư thừa vô hại "vì đĩa rẻ" — các dị thường mới là cái giá.']],
    tn: [tn('anomaly', 'dị thường')],
  }),
  de({
    ...M1, t: 'Decompose Movies1 into Movies2 and Movies3', k: 'MEDIUM', p: 12,
    kn: ['decomposition', 'INSERT … SELECT DISTINCT', 'composite foreign key'], tag: ['normalization', 'decomposition', 'ddl', 'slide'],
    en: '<p>Slide 23 splits Movies1 into <code>Movies2(title, year, length, genre, studioName)</code> and <code>Movies3(title, year, starName)</code>. Create both tables (VARCHAR(40)/INT/INT/VARCHAR(10)/VARCHAR(20) and VARCHAR(30) for starName; keys (title, year) and (title, year, starName); Movies3 references Movies2) and fill them from Movies1.</p>',
    vi: '<p>Slide 23 tách Movies1 thành <code>Movies2(title, year, length, genre, studioName)</code> và <code>Movies3(title, year, starName)</code>. Tạo hai bảng (VARCHAR(40)/INT/INT/VARCHAR(10)/VARCHAR(20) và VARCHAR(30) cho starName; khoá (title, year) và (title, year, starName); Movies3 tham chiếu Movies2) rồi đổ dữ liệu từ Movies1.</p>',
    yc: [['Two CREATE TABLE, then two INSERT … SELECT.', 'Hai CREATE TABLE, rồi hai INSERT … SELECT.'], ['Movies2 gets each movie ONCE (SELECT DISTINCT).', 'Movies2 nhận mỗi phim MỘT lần (SELECT DISTINCT).'], ['Use VARCHAR in the CREATE TABLE here (the grader flags NVARCHAR as SQL Server–only).', 'Ở đây dùng VARCHAR trong CREATE TABLE (máy chấm báo NVARCHAR là riêng SQL Server).']],
    giai: PHAN_RA,
    kiem: [
      sau(['Movies2 has one row per movie', 'Movies2 có mỗi phim một dòng'], 'SELECT title, year, length, genre, studioName FROM Movies2'),
      sau(['Movies3 has one row per (movie, star)', 'Movies3 có mỗi (phim, diễn viên) một dòng'], 'SELECT title, year, starName FROM Movies3'),
      sau(['Hidden: works on new data too', 'Ẩn: đúng cả với dữ liệu mới'], 'SELECT (SELECT COUNT(*) FROM Movies2) AS movies, (SELECT COUNT(*) FROM Movies3) AS castRows', { an: true, themCsdl: THEM }),
      ma(['Fills the tables with INSERT … SELECT', 'Đổ dữ liệu bằng INSERT … SELECT'], '\\bINSERT\\s+INTO\\s+Movies2\\b[\\s\\S]*\\bSELECT\\b'),
    ],
    sai: [
      PHAN_RA.replace('SELECT DISTINCT title, year, length, genre, studioName FROM Movies1', "SELECT title, year, length, genre, studioName FROM Movies1 WHERE starName IN ('Carrie Fisher', 'Vivien Leigh', 'Dana Carvey')"),
      PHAN_RA.replace("INSERT INTO Movies2 (title, year, length, genre, studioName)\nSELECT DISTINCT title, year, length, genre, studioName FROM Movies1;     -- one row per movie\n", "INSERT INTO Movies2 VALUES ('Star Wars', 1977, 124, 'SciFi', 'Fox'), ('Gone With the Wind', 1939, 231, 'drama', 'MGM'), ('Wayne''s World', 1992, 95, 'comedy', 'Paramount');\n"),
    ],
    gy: [['Without DISTINCT the INSERT into Movies2 fails: Star Wars would appear 3 times and break its key.', 'Thiếu DISTINCT thì INSERT vào Movies2 lỗi: Star Wars xuất hiện 3 lần và phá khoá.'], ['Fill the parent (Movies2) before the child (Movies3) — the foreign key checks every row.', 'Đổ bảng cha (Movies2) trước bảng con (Movies3) — khoá ngoại kiểm từng dòng.']],
    lhg: [['Picking "one star per movie" by name — any new movie is lost (hidden check).', 'Chọn "mỗi phim một diễn viên" theo tên — phim mới bị mất (kiểm ẩn).'], ['Typing the rows by hand — correct today, wrong tomorrow.', 'Gõ tay các dòng — đúng hôm nay, sai ngày mai.']],
    gt: ['<p>The projections are taken with set semantics (DISTINCT). Movies2 now stores each length once: the update, deletion and insertion anomalies are gone. Next exercise: prove nothing was lost.</p>', '<p>Các phép chiếu lấy theo ngữ nghĩa tập (DISTINCT). Movies2 giờ lưu mỗi độ dài một lần: dị thường cập nhật, xoá, chèn đều hết. Bài sau: chứng minh không mất gì.</p>'],
    tn: [tn('decomposition', 'phân rã'), TN.fk],
  }),
  de({
    csdl: `${MOVIES1}\n${PHAN_RA.replace(/VARCHAR/g, 'NVARCHAR')}`, tenCsdl: 'Movies123', ld: { en: '<p><b>Tables</b> (tab <code>Movies123.sql</code>): Movies1 (the original) plus its decomposition Movies2(title, year, length, genre, studioName) and Movies3(title, year, starName), already filled.</p>', vi: '<p><b>Bảng</b> (tab <code>Movies123.sql</code>): Movies1 (gốc) cùng phân rã của nó Movies2(title, year, length, genre, studioName) và Movies3(title, year, starName), đã có dữ liệu.</p>' },
    t: 'Join the pieces back: is the decomposition lossless?', k: 'MEDIUM', p: 8,
    kn: ['lossless join', 'natural join'], tag: ['normalization', 'decomposition', 'join', 'slide'],
    en: '<p>Rebuild the original relation from the two pieces: <code>Movies2 ⋈ Movies3</code> on (title, year). The result must equal Movies1 exactly — no tuple lost, no spurious tuple.</p>',
    vi: '<p>Dựng lại quan hệ gốc từ hai mảnh: <code>Movies2 ⋈ Movies3</code> trên (title, year). Kết quả phải đúng bằng Movies1 — không mất bộ nào, không có bộ thừa.</p>',
    yc: [['Columns in the order of Movies1: <code>title, year, length, genre, studioName, starName</code>.', 'Cột theo thứ tự Movies1: <code>title, year, length, genre, studioName, starName</code>.'], ['Join on BOTH title and year. Row order does not matter.', 'Nối trên CẢ title và year. Thứ tự dòng không quan trọng.']],
    giai: `SELECT m.title, m.year, m.length, m.genre, m.studioName, s.starName
FROM Movies2 m
JOIN Movies3 s ON s.title = m.title AND s.year = m.year;   -- the common attributes = a key of Movies2 ⇒ lossless`,
    kiem: [kq(['The rebuilt Movies1', 'Movies1 dựng lại']), kqAn(['A remake: same title, other year', 'Phim làm lại: cùng tên, khác năm'], `INSERT INTO Movies2 VALUES (N'Star Wars', 2077, 130, N'SciFi', N'Disney'); INSERT INTO Movies3 VALUES (N'Star Wars', 2077, N'Daisy Ridley')`), ma(['Joins the two pieces', 'Nối hai mảnh'], '\\bJOIN\\b|\\bFROM\\s+Movies2\\b[^;]*,')],
    sai: [`SELECT m.title, m.year, m.length, m.genre, m.studioName, s.starName FROM Movies2 m JOIN Movies3 s ON s.title = m.title`],
    gy: [['The common attributes of the pieces are title and year.', 'Thuộc tính chung của hai mảnh là title và year.'], ['ON s.title = m.title AND s.year = m.year', 'ON s.title = m.title AND s.year = m.year']],
    lhg: [['Joining on title only — with a remake, every star of one Star Wars is paired with the other film: spurious tuples.', 'Nối chỉ theo title — có phim làm lại thì diễn viên của Star Wars này ghép nhầm với phim kia: bộ thừa.'], ['Using a comma join without condition — the product.', 'Nối dấu phẩy không điều kiện — thành tích.']],
    gt: ['<p>A binary decomposition is lossless when the common attributes functionally determine one of the pieces: (title, year) → length, genre, studioName, i.e. they are a key of Movies2.</p>', '<p>Phân rã hai mảnh không mất khi thuộc tính chung xác định hàm một trong hai mảnh: (title, year) → length, genre, studioName, tức là khoá của Movies2.</p>'],
    tn: [tn('lossless join', 'nối không mất mát')],
  }),
  cs({
    t: '1NF and 2NF in four questions', k: 'MEDIUM', p: 7,
    kn: ['1NF', '2NF', 'partial dependency', 'prime attribute'], tag: ['normalization', 'slide'],
    en: '<p>Slides 30–38.</p>', vi: '<p>Slide 30–38.</p>',
    cau: [
      q('c1', ['A column skills = "SQL, Java, C#" violates…', 'Cột skills = "SQL, Java, C#" vi phạm…'], ['1NF — values must be atomic', '2NF — partial dependency', '3NF — transitive dependency', 'BCNF only'], ['A list inside one cell is a repeating group: not atomic, not 1NF.', 'Danh sách trong một ô là nhóm lặp: không nguyên tố, không 1NF.']),
      q('c2', ['Movies1, key (title, year, starName), with title, year → length. This FD is…', 'Movies1, khoá (title, year, starName), với title, year → length. FD này là…'], ['a partial dependency: length depends on part of the key', 'a transitive dependency through starName', 'a trivial dependency: length is in the key', 'a BCNF-safe dependency on a superkey'], ['A non-prime attribute depending on a proper subset of a key breaks 2NF.', 'Thuộc tính không khoá phụ thuộc vào tập con thực sự của khoá phá 2NF.']),
      q('c3', ['A relation whose only key has ONE attribute is always in…', 'Quan hệ có khoá duy nhất gồm MỘT thuộc tính luôn ở…'], ['2NF (if it is in 1NF) — no proper part of the key exists', 'BCNF — one-attribute keys forbid every anomaly', '3NF — transitive dependencies are impossible', 'nothing above 1NF — it needs a composite key'], ['Partial dependencies need a composite key; a single-attribute key leaves only transitive problems.', 'Phụ thuộc bộ phận cần khoá ghép; khoá một thuộc tính chỉ còn có thể vướng bắc cầu.']),
      q('c4', ['A "prime" attribute is…', 'Thuộc tính "khoá" (prime) là…'], ['an attribute that belongs to SOME candidate key', 'an attribute of the primary key only', 'a numeric attribute', 'an attribute with a UNIQUE constraint'], ['Prime = member of any candidate key — that is why you must find ALL keys before judging 2NF/3NF.', 'Prime = thuộc một khoá ứng viên nào đó — vì vậy phải tìm MỌI khoá trước khi xét 2NF/3NF.']),
    ],
    gy: [['1NF: atomic values. 2NF: no non-prime attribute depends on part of a key.', '1NF: giá trị nguyên tố. 2NF: không thuộc tính không khoá nào phụ thuộc một phần khoá.'], ['Find all keys first.', 'Tìm mọi khoá trước.']],
    lhg: [['Calling a list column a 2NF problem.', 'Gọi cột danh sách là vấn đề 2NF.'], ['Judging "prime" using only the primary key.', 'Xét "prime" chỉ dựa vào khoá chính.']],
    tn: [tn('partial dependency', 'phụ thuộc bộ phận'), tn('prime attribute', 'thuộc tính khoá')],
  }),
]);
