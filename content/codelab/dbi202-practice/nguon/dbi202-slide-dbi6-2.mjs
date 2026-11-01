/**
 * DBI202 · 2.D Slide trường Chương 5 (15–30) — phép mở rộng: δ, γ, π mở rộng, τ, nối ngoài — viết bằng SQL trên Movies.
 */
import { mod, de, cs, q, bang1, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { MOV, LUOC_DO_MOV } from './_du-lieu.mjs';

const M = { csdl: MOV, tenCsdl: 'Movies', ld: LUOC_DO_MOV };
const THEM = `INSERT INTO Movies VALUES (N'Hook', 1991, 142, N'fantasy', N'Disney', 200), (N'Top Secret!', 1984, 90, N'comedy', N'Paramount', 400),
  (N'King Kong', 1933, 100, N'drama', N'Paramount', 400), (N'King Kong', 2005, 187, N'drama', N'Disney', 200);
INSERT INTO MovieStar VALUES (N'Val Kilmer', NULL, 'M', '1959-12-31'), (N'Naomi Watts', NULL, 'F', '1968-09-28');
INSERT INTO StarsIn VALUES (N'Top Secret!', 1984, N'Val Kilmer'), (N'King Kong', 2005, N'Naomi Watts')`;

export default mod('dbi202-slide-dbi6-2', '2.D Extended operators: δ, γ, extended π, τ, outer joins (slides 15–30)', [
  de({
    ...M, t: 'γ: movies and average length per studio', k: 'EASY', p: 7,
    kn: ['grouping γ', 'COUNT', 'AVG'], tag: ['relational-algebra', 'group-by', 'slide'],
    en: '<p>Write <code>γ<sub>studioName, COUNT(title)→movies, AVG(length)→avgLength</sub>(Movies)</code>.</p>',
    vi: '<p>Viết <code>γ<sub>studioName, COUNT(title)→movies, AVG(length)→avgLength</sub>(Movies)</code>.</p>',
    yc: [['Columns: <code>studioName, movies, avgLength</code>.', 'Cột: <code>studioName, movies, avgLength</code>.'], ['length is INT: like SQL Server, AVG of an INT column is truncated to an integer. Row order does not matter.', 'length là INT: như SQL Server, AVG của cột INT bị cắt thành số nguyên. Thứ tự dòng không quan trọng.']],
    giai: `SELECT studioName, COUNT(title) AS movies, AVG(length) AS avgLength   -- γ: grouping attribute + aggregates
FROM Movies
GROUP BY studioName;`,
    kiem: [kq(['One row per studio', 'Mỗi hãng một dòng']), kqAn(['Two more movies', 'Thêm hai phim'], THEM), ma(['Uses GROUP BY', 'Dùng GROUP BY'], '\\bGROUP\\s+BY\\b')],
    sai: [`SELECT studioName, COUNT(title) AS movies, AVG(length) AS avgLength FROM Movies GROUP BY studioName, genre`, `SELECT studioName, COUNT(DISTINCT genre) AS movies, AVG(length) AS avgLength FROM Movies GROUP BY studioName`],
    gy: [['The grouping attributes of γ go to GROUP BY; the aggregates go to SELECT.', 'Thuộc tính gộp của γ vào GROUP BY; các hàm gộp vào SELECT.'], ['GROUP BY studioName only — adding genre splits the groups.', 'Chỉ GROUP BY studioName — thêm genre là tách nhóm.']],
    lhg: [['Grouping by studioName AND genre — Disney is split into several rows.', 'Gộp theo studioName VÀ genre — Disney bị tách thành nhiều dòng.'], ['COUNT(DISTINCT genre) — counts genres, not movies.', 'COUNT(DISTINCT genre) — đếm thể loại, không đếm phim.']],
    gt: ['<p>γ<sub>L</sub>(R): partition R by the grouping attributes in L, then compute one tuple per group with the aggregates in L. That is exactly SELECT … GROUP BY.</p>', '<p>γ<sub>L</sub>(R): chia R theo thuộc tính gộp trong L, rồi tính một bộ cho mỗi nhóm với các hàm gộp trong L. Đúng là SELECT … GROUP BY.</p>'],
    tn: [TN.groupBy, TN.aggregate],
  }),
  de({
    ...M, t: 'Extended π: length in hours and a renamed column', k: 'EASY', p: 6,
    kn: ['extended projection', 'arithmetic in SELECT', 'renaming'], tag: ['relational-algebra', 'slide'],
    en: '<p>Write <code>π<sub>title, year, length / 60.0 → hours</sub>(σ<sub>genre = \'sciFi\'</sub>(Movies))</code>: the science-fiction movies with their length in hours.</p>',
    vi: '<p>Viết <code>π<sub>title, year, length / 60.0 → hours</sub>(σ<sub>genre = \'sciFi\'</sub>(Movies))</code>: các phim khoa học viễn tưởng kèm độ dài tính bằng giờ.</p>',
    yc: [['Columns: <code>title, year, hours</code>.', 'Cột: <code>title, year, hours</code>.'], ['Divide by <code>60.0</code> (an INT / INT division would truncate). Row order does not matter.', 'Chia cho <code>60.0</code> (INT / INT sẽ cắt phần lẻ). Thứ tự dòng không quan trọng.']],
    giai: `SELECT title, year, length / 60.0 AS hours     -- extended π: an expression, renamed with AS
FROM Movies
WHERE genre = 'sciFi';`,
    kiem: [kq(['sciFi movies with hours', 'Phim sciFi kèm số giờ'], { saiSo: 0.001 }), kqAn(['Another sciFi movie', 'Thêm một phim sciFi'], `INSERT INTO Movies VALUES (N'Minority Report', 2002, 145, N'sciFi', N'Disney', 200)`, { saiSo: 0.001 }), ma(['Renames the expression with AS hours', 'Đặt tên biểu thức bằng AS hours'], '\\bAS\\s+hours\\b')],
    sai: [`SELECT title, year, length / 60 AS hours FROM Movies WHERE genre = 'sciFi'`, `SELECT title, year, length AS hours FROM Movies WHERE genre = 'sciFi'`],
    gy: [['An extended projection may compute expressions and rename them (→ is AS).', 'Phép chiếu mở rộng được tính biểu thức và đặt tên (→ là AS).'], ['124 / 60 = 2 in integer arithmetic; 124 / 60.0 = 2.0666…', '124 / 60 = 2 khi chia số nguyên; 124 / 60.0 = 2.0666…']],
    lhg: [['length / 60 — integer division gives 2 for every 2-hour film.', 'length / 60 — chia nguyên ra 2 cho mọi phim 2 tiếng.'], ['Forgetting the alias — the column has no name (SQL Server shows "(No column name)").', 'Quên bí danh — cột không có tên (SQL Server hiện "(No column name)").']],
    gt: ['<p>The extended π allows expressions (length / 60.0), duplicated attributes and renaming. Both SQL Server and PostgreSQL truncate INT / INT, so write a decimal literal.</p>', '<p>π mở rộng cho phép biểu thức (length / 60.0), lặp thuộc tính và đổi tên. Cả SQL Server lẫn PostgreSQL đều cắt INT / INT nên viết hằng thập phân.</p>'],
    tn: [TN.alias],
  }),
  de({
    ...M, t: 'τ: sort by year (newest first), then by title', k: 'EASY', p: 6,
    kn: ['sorting τ', 'ORDER BY'], tag: ['relational-algebra', 'order-by', 'slide'],
    en: '<p>Write <code>τ<sub>year DESC, title</sub>(π<sub>title, year</sub>(Movies))</code>. τ is the only operator whose result is a <b>list</b>, not a set or bag.</p>',
    vi: '<p>Viết <code>τ<sub>year DESC, title</sub>(π<sub>title, year</sub>(Movies))</code>. τ là phép duy nhất trả <b>danh sách</b>, không phải tập hay túi.</p>',
    yc: [['Columns: <code>title, year</code>.', 'Cột: <code>title, year</code>.'], ['Newest year first; same year ⇒ title A→Z (row order is checked).', 'Năm mới nhất trước; cùng năm ⇒ title A→Z (có kiểm thứ tự).']],
    giai: `SELECT title, year
FROM Movies
ORDER BY year DESC, title;    -- τ: the result is a list`,
    kiem: [kq(['Movies newest first', 'Phim mới nhất trước'], { thuTu: true }), kqAn(['Two movies in the same year', 'Hai phim cùng năm'], `INSERT INTO Movies VALUES (N'Alien', 1977, 117, N'sciFi', N'Fox', NULL), (N'Annie Hall', 1977, 93, N'comedy', N'Fox', NULL)`, { thuTu: true }), ma(['Uses ORDER BY', 'Dùng ORDER BY'], '\\bORDER\\s+BY\\b')],
    sai: [`SELECT title, year FROM Movies ORDER BY year, title`, `SELECT title, year FROM Movies ORDER BY year DESC`],
    gy: [['ORDER BY year DESC, title — the second key only breaks ties.', 'ORDER BY year DESC, title — khoá thứ hai chỉ phá hoà.'], ['DESC applies to the column right before it only.', 'DESC chỉ áp cho cột đứng ngay trước nó.']],
    lhg: [['Forgetting DESC on year.', 'Quên DESC ở year.'], ['No tie-breaker — three 1977 movies may come in any order (hidden check).', 'Không có khoá phá hoà — ba phim 1977 ra theo thứ tự bất kỳ (kiểm ẩn).']],
    gt: ['<p>τ<sub>L</sub> sorts by the attributes in L, in order. In SQL, ORDER BY is the last step; "year DESC, title" means title ascending among movies of the same year.</p>', '<p>τ<sub>L</sub> sắp theo các thuộc tính trong L, theo thứ tự. Trong SQL ORDER BY là bước cuối; "year DESC, title" nghĩa là title tăng dần giữa các phim cùng năm.</p>'],
    tn: [TN.orderBy],
  }),
  de({
    ...M, t: 'Outer join: every movie with its number of stars (0 included)', k: 'MEDIUM', p: 9,
    kn: ['left outer join', 'COUNT(column)', 'dangling tuples'], tag: ['relational-algebra', 'outer-join', 'slide'],
    en: '<p>E.T. and Jaws have no row in StarsIn: an inner join would drop them (dangling tuples). Use <code>Movies ⟕ StarsIn</code> and count the stars of every movie, 0 included.</p>',
    vi: '<p>E.T. và Jaws không có dòng nào trong StarsIn: nối trong sẽ làm mất chúng (bộ treo). Dùng <code>Movies ⟕ StarsIn</code> và đếm số diễn viên của mọi phim, kể cả 0.</p>',
    yc: [['Columns: <code>title, year, stars</code>.', 'Cột: <code>title, year, stars</code>.'], ['Every movie appears; row order does not matter.', 'Phim nào cũng xuất hiện; thứ tự dòng không quan trọng.']],
    giai: `SELECT m.title, m.year, COUNT(si.starName) AS stars     -- COUNT(column) ignores the NULLs of the padding
FROM Movies m
LEFT JOIN StarsIn si ON si.movieTitle = m.title AND si.movieYear = m.year
GROUP BY m.title, m.year;`,
    kiem: [kq(['Star count per movie, zeros included', 'Số diễn viên mỗi phim, có cả số 0']), kqAn(['New movies, one remake (King Kong 1933 / 2005)', 'Phim mới, có một phim làm lại (King Kong 1933 / 2005)'], THEM), ma(['Uses LEFT JOIN', 'Dùng LEFT JOIN'], '\\bLEFT\\s+(OUTER\\s+)?JOIN\\b')],
    sai: [
      `SELECT m.title, m.year, COUNT(*) AS stars FROM Movies m LEFT JOIN StarsIn si ON si.movieTitle = m.title AND si.movieYear = m.year GROUP BY m.title, m.year`,
      `SELECT m.title, m.year, COUNT(si.starName) AS stars FROM Movies m JOIN StarsIn si ON si.movieTitle = m.title AND si.movieYear = m.year GROUP BY m.title, m.year`,
      `SELECT m.title, m.year, COUNT(si.starName) AS stars FROM Movies m LEFT JOIN StarsIn si ON si.movieTitle = m.title GROUP BY m.title, m.year`,
    ],
    gy: [['LEFT JOIN keeps every movie; a movie with no star gets one row padded with NULLs.', 'LEFT JOIN giữ mọi phim; phim không có diễn viên có một dòng điền NULL.'], ['COUNT(si.starName) counts non-NULL values, so the padded row counts 0.', 'COUNT(si.starName) đếm giá trị khác NULL nên dòng điền NULL đếm 0.']],
    lhg: [['COUNT(*) — the padded row counts as 1, so E.T. shows 1 star.', 'COUNT(*) — dòng điền NULL cũng đếm 1, E.T. thành 1 diễn viên.'], ['Joining on title only — the key of Movies is (title, year); remakes would mix.', 'Nối chỉ theo title — khoá của Movies là (title, year); phim làm lại sẽ lẫn.']],
    gt: ['<p>R ⟕ S = R ⋈ S plus the dangling tuples of R padded with ⊥ (NULL). COUNT(*) counts rows; COUNT(col) counts non-NULL values — that difference is the whole trick.</p>', '<p>R ⟕ S = R ⋈ S cộng các bộ treo của R điền ⊥ (NULL). COUNT(*) đếm dòng; COUNT(cột) đếm giá trị khác NULL — khác biệt đó là toàn bộ mẹo.</p>'],
    tn: [TN.leftJoin, tn('dangling tuple', 'bộ treo', 'Bộ không khớp với bộ nào ở bảng kia — nối trong làm mất nó.')],
  }),
  cs({
    t: 'Full, left and right outer join of two tiny relations', k: 'MEDIUM', p: 8, loai: 'table',
    kn: ['outer joins', 'NULL padding'], tag: ['relational-algebra', 'outer-join', 'slide'],
    en: '<p>R(A, B) = {(1, 2), (4, 5)} and S(B, C) = {(2, 3), (6, 7)}. The natural join matches on B. Count the tuples of each result and the number of NULLs (⊥) it contains.</p>',
    vi: '<p>R(A, B) = {(1, 2), (4, 5)} và S(B, C) = {(2, 3), (6, 7)}. Nối tự nhiên khớp trên B. Đếm số bộ của mỗi kết quả và số ô NULL (⊥) trong đó.</p>',
    bang: [bang1('b1', ['Size of each join', 'Kích thước từng phép nối'],
      [{ ma: 'phep', ten: 'Operator / Phép' }, { ma: 'bo', ten: 'tuples / số bộ' }, { ma: 'null', ten: 'NULLs / số ô NULL' }],
      [{ o: { phep: 'R ⋈ S (natural join)' }, a: { bo: '1', null: '0' } },
        { o: { phep: 'R ⟕ S (left outer)' }, a: { bo: '2', null: '1' } },
        { o: { phep: 'R ⟖ S (right outer)' }, a: { bo: '2', null: '1' } },
        { o: { phep: 'R ⟗ S (full outer)' }, a: { bo: '3', null: '2' } }],
      ['Only B = 2 matches: (1, 2, 3). Left adds (4, 5, ⊥); right adds (⊥, 6, 7); full adds both.', 'Chỉ B = 2 khớp: (1, 2, 3). Trái thêm (4, 5, ⊥); phải thêm (⊥, 6, 7); đầy đủ thêm cả hai.'])],
    gy: [['First find the matching tuples, then add the dangling ones of the preserved side(s).', 'Tìm các bộ khớp trước, rồi thêm bộ treo của (các) vế được giữ.'], ['Each padded tuple has exactly one ⊥ here (one attribute is missing).', 'Ở đây mỗi bộ được điền có đúng một ⊥ (thiếu một thuộc tính).']],
    lhg: [['Thinking a full outer join is the product R × S.', 'Tưởng nối ngoài đầy đủ là tích R × S.'], ['Padding the wrong side: in R ⟕ S it is S\'s attribute C that becomes ⊥.', 'Điền sai vế: trong R ⟕ S thuộc tính C của S mới thành ⊥.']],
    tn: [tn('full outer join ⟗', 'nối ngoài đầy đủ')],
  }),
]);
