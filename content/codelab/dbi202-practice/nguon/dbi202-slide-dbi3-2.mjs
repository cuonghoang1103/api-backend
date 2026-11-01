/**
 * DBI202 · 2.B Slide trường Chương 2 (12–25) — ∪ ∩ −, σ, π, ×, ⋈, ⋈θ, ρ, cây biểu thức — mỗi phép viết lại bằng SQL
 * trên lược đồ Movies của slide.
 */
import { mod, de, cs, q, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { MOV, LUOC_DO_MOV } from './_du-lieu.mjs';

const M = { csdl: MOV, tenCsdl: 'Movies', ld: LUOC_DO_MOV };
const THEM = `INSERT INTO Movies VALUES (N'Indiana Jones and the Last Crusade', 1989, 127, N'action', N'Paramount', 100), (N'Hook', 1991, 142, N'fantasy', N'Disney', 200), (N'The BFG', 2016, 120, N'fantasy', N'Disney', 200);
INSERT INTO MovieStar VALUES (N'Julia Roberts', N'1 Sunset Blvd.', 'F', '1967-10-28');
INSERT INTO StarsIn VALUES (N'Indiana Jones and the Last Crusade', 1989, N'Harrison Ford'), (N'Hook', 1991, N'Julia Roberts')`;

export default mod('dbi202-slide-dbi3-2', '2.B Set ops, σ, π, joins, ρ & expression trees (slides 12–25)', [
  de({
    ...M, t: 'σ then π: long Disney movies', k: 'EASY', p: 6,
    kn: ['selection σ', 'projection π'], tag: ['relational-algebra', 'slide'],
    en: '<p>Write in SQL: <code>π<sub>title, year</sub>(σ<sub>studioName = \'Disney\' AND length ≥ 120</sub>(Movies))</code>.</p>',
    vi: '<p>Viết bằng SQL: <code>π<sub>title, year</sub>(σ<sub>studioName = \'Disney\' AND length ≥ 120</sub>(Movies))</code>.</p>',
    yc: [['Columns: <code>title, year</code>.', 'Cột: <code>title, year</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT title, year                                   -- π title, year
FROM Movies
WHERE studioName = 'Disney' AND length >= 120;       -- σ`,
    kiem: [kq(['Disney movies of 120+ minutes', 'Phim Disney từ 120 phút']), kqAn(['Hook (142 min, Disney) added', 'Thêm Hook (142 phút, Disney)'], THEM), ma(['Has a WHERE (σ)', 'Có WHERE (σ)'], '\\bWHERE\\b')],
    sai: [`SELECT title, year FROM Movies WHERE studioName = 'Disney' AND length > 120`, `SELECT title, year FROM Movies WHERE studioName = 'Disney' OR length >= 120`],
    gy: [['σ is the WHERE clause, π is the SELECT list.', 'σ là mệnh đề WHERE, π là danh sách SELECT.'], ['≥ is &gt;= in SQL.', '≥ trong SQL là &gt;=.']],
    lhg: [['&gt; instead of &gt;= — a Disney film of exactly 120 minutes is lost (the hidden check has one).', '&gt; thay vì &gt;= — phim Disney đúng 120 phút bị mất (kiểm ẩn có một phim như vậy).'], ['OR instead of AND — every Disney film plus every long film.', 'OR thay vì AND — mọi phim Disney cộng mọi phim dài.']],
    gt: ['<p>σ keeps rows, π keeps columns. The inner operator is evaluated first: σ on Movies, then π on the result.</p>', '<p>σ giữ dòng, π giữ cột. Phép bên trong chạy trước: σ trên Movies, rồi π trên kết quả.</p>'],
    tn: [tn('selection σ', 'phép chọn σ', 'Giữ các bộ thoả điều kiện — WHERE.'), tn('projection π', 'phép chiếu π', 'Giữ các thuộc tính được nêu — danh sách SELECT (+ DISTINCT trên tập).')],
  }),
  de({
    ...M, t: 'π on a set: the distinct genres', k: 'EASY', p: 5,
    kn: ['projection π', 'set semantics', 'DISTINCT'], tag: ['relational-algebra', 'distinct', 'slide'],
    en: '<p>Relational algebra works on <b>sets</b>. Write <code>π<sub>genre</sub>(Movies)</code> so that the result is a set, as the algebra says.</p>',
    vi: '<p>Đại số quan hệ làm việc trên <b>tập</b>. Viết <code>π<sub>genre</sub>(Movies)</code> sao cho kết quả là một tập, đúng như đại số.</p>',
    yc: [['One column: <code>genre</code>.', 'Một cột: <code>genre</code>.'], ['Each genre once.', 'Mỗi thể loại một lần.']],
    giai: `SELECT DISTINCT genre      -- π on a set: duplicates removed
FROM Movies;`,
    kiem: [kq(['Each genre once', 'Mỗi thể loại một lần']), kqAn(['Two more genres appear', 'Thêm hai thể loại'], THEM), ma(['Uses DISTINCT', 'Dùng DISTINCT'], '\\bDISTINCT\\b')],
    sai: ['SELECT genre FROM Movies'],
    gy: [['SQL tables are bags; plain SELECT keeps duplicates.', 'Bảng SQL là túi; SELECT thường giữ trùng.'], ['SELECT DISTINCT genre FROM Movies', 'SELECT DISTINCT genre FROM Movies']],
    lhg: [['SELECT genre without DISTINCT — sciFi appears 5 times.', 'SELECT genre không DISTINCT — sciFi hiện 5 lần.'], ['GROUP BY genre also works, but say DISTINCT when you only want to remove duplicates.', 'GROUP BY genre cũng được, nhưng chỉ muốn bỏ trùng thì dùng DISTINCT.']],
    gt: ['<p>The algebra\'s π returns a set; SQL\'s SELECT returns a bag unless you add DISTINCT. Chapter 2.C (bags) is about exactly this difference.</p>', '<p>π của đại số trả một tập; SELECT của SQL trả túi trừ khi thêm DISTINCT. Chương 2.C (túi) nói đúng về khác biệt này.</p>'],
    tn: [tn('DISTINCT', 'loại trùng')],
  }),
  de({
    ...M, t: 'Natural join: who starred in what, women only', k: 'MEDIUM', p: 8,
    kn: ['natural join', 'join condition'], tag: ['relational-algebra', 'join', 'slide'],
    en: '<p><code>StarsIn</code> and <code>MovieStar</code> share the star\'s name (<code>starName</code> / <code>name</code>). Write <code>π<sub>name, movieTitle, movieYear</sub>(σ<sub>gender = \'F\'</sub>(MovieStar ⋈<sub>name = starName</sub> StarsIn))</code>.</p>',
    vi: '<p><code>StarsIn</code> và <code>MovieStar</code> chung tên diễn viên (<code>starName</code> / <code>name</code>). Viết <code>π<sub>name, movieTitle, movieYear</sub>(σ<sub>gender = \'F\'</sub>(MovieStar ⋈<sub>name = starName</sub> StarsIn))</code>.</p>',
    yc: [['Columns: <code>name, movieTitle, movieYear</code>.', 'Cột: <code>name, movieTitle, movieYear</code>.'], ['Use JOIN … ON (the column names differ, so NATURAL JOIN would not match them — and SQL Server has no NATURAL JOIN).', 'Dùng JOIN … ON (tên cột khác nhau nên NATURAL JOIN không khớp được — và SQL Server không có NATURAL JOIN).']],
    giai: `SELECT s.name, si.movieTitle, si.movieYear
FROM MovieStar s
JOIN StarsIn si ON si.starName = s.name     -- ⋈ on the shared attribute
WHERE s.gender = 'F';                       -- σ`,
    kiem: [kq(['Female stars and their movies', 'Nữ diễn viên và phim của họ']), kqAn(['Julia Roberts in Hook', 'Julia Roberts trong Hook'], THEM), ma(['Uses JOIN … ON', 'Dùng JOIN … ON'], '\\bJOIN\\b[\\s\\S]*\\bON\\b')],
    sai: [`SELECT s.name, si.movieTitle, si.movieYear FROM MovieStar s, StarsIn si WHERE s.gender = 'F'`, `SELECT s.name, si.movieTitle, si.movieYear FROM MovieStar s JOIN StarsIn si ON si.starName = s.name`],
    gy: [['The join condition is si.starName = s.name.', 'Điều kiện nối là si.starName = s.name.'], ['Then filter gender = \'F\' in WHERE.', 'Rồi lọc gender = \'F\' ở WHERE.']],
    lhg: [['A comma join with no join condition — that is the product ×: every woman with every StarsIn row.', 'Nối bằng dấu phẩy không có điều kiện — đó là tích ×: mỗi nữ diễn viên với mọi dòng StarsIn.'], ['Forgetting σ gender = \'F\'.', 'Quên σ gender = \'F\'.']],
    gt: ['<p>⋈<sub>θ</sub> = σ<sub>θ</sub>(R × S). Without the ON condition you get the whole product. A natural join matches on attributes with the SAME name; here the names differ, so we write the θ-join explicitly.</p>', '<p>⋈<sub>θ</sub> = σ<sub>θ</sub>(R × S). Thiếu điều kiện ON là ra cả tích. Nối tự nhiên khớp các thuộc tính CÙNG tên; ở đây tên khác nhau nên viết θ-join tường minh.</p>'],
    tn: [TN.join, tn('product ×', 'tích Đề-các', 'Mỗi bộ của R ghép với mọi bộ của S — |R| × |S| bộ.')],
  }),
  de({
    ...M, t: '∩ and −: stars of Star Wars, with and without Raiders', k: 'MEDIUM', p: 8,
    kn: ['intersection', 'difference', 'union-compatible'], tag: ['relational-algebra', 'set-operations', 'slide'],
    en: '<p>Let <code>A = π<sub>starName</sub>(σ<sub>movieTitle = \'Star Wars\'</sub>(StarsIn))</code> and <code>B = π<sub>starName</sub>(σ<sub>movieTitle = \'Raiders of the Lost Ark\'</sub>(StarsIn))</code>. Return <code>A − B</code>: the Star Wars stars who were <b>not</b> in Raiders.</p>',
    vi: '<p>Cho <code>A = π<sub>starName</sub>(σ<sub>movieTitle = \'Star Wars\'</sub>(StarsIn))</code> và <code>B = π<sub>starName</sub>(σ<sub>movieTitle = \'Raiders of the Lost Ark\'</sub>(StarsIn))</code>. Trả <code>A − B</code>: diễn viên Star Wars <b>không</b> đóng Raiders.</p>',
    yc: [['One column: <code>starName</code>.', 'Một cột: <code>starName</code>.'], ['Use EXCEPT; row order does not matter.', 'Dùng EXCEPT; thứ tự dòng không quan trọng.']],
    giai: `SELECT starName FROM StarsIn WHERE movieTitle = 'Star Wars'
EXCEPT                                                                 -- −  (set difference)
SELECT starName FROM StarsIn WHERE movieTitle = 'Raiders of the Lost Ark';`,
    kiem: [kq(['Star Wars stars not in Raiders', 'Diễn viên Star Wars không đóng Raiders']), kqAn(['Hidden: Mark Hamill gets a Raiders cameo', 'Ẩn: Mark Hamill đóng vai khách mời Raiders'], `INSERT INTO StarsIn VALUES (N'Raiders of the Lost Ark', 1981, N'Mark Hamill')`), ma(['Uses EXCEPT', 'Dùng EXCEPT'], '\\bEXCEPT\\b')],
    sai: [`SELECT starName FROM StarsIn WHERE movieTitle = 'Raiders of the Lost Ark' EXCEPT SELECT starName FROM StarsIn WHERE movieTitle = 'Star Wars'`, `SELECT starName FROM StarsIn WHERE movieTitle = 'Star Wars' INTERSECT SELECT starName FROM StarsIn WHERE movieTitle = 'Raiders of the Lost Ark'`],
    gy: [['− is EXCEPT in SQL (Oracle calls it MINUS).', '− trong SQL là EXCEPT (Oracle gọi MINUS).'], ['Both sides return one column of the same type — they are union-compatible.', 'Hai vế cùng trả một cột cùng kiểu — tương thích hợp.']],
    lhg: [['Swapping the operands — B − A is the Raiders stars not in Star Wars (empty here).', 'Đảo hai vế — B − A là diễn viên Raiders không đóng Star Wars (ở đây rỗng).'], ['INTERSECT — that is A ∩ B (Harrison Ford), the opposite question.', 'INTERSECT — đó là A ∩ B (Harrison Ford), câu hỏi ngược lại.']],
    gt: ['<p>Difference is not commutative: A − B ≠ B − A. Expected: Carrie Fisher, Mark Hamill.</p>', '<p>Phép hiệu không giao hoán: A − B ≠ B − A. Kết quả: Carrie Fisher, Mark Hamill.</p>'],
    tn: [TN.setOp],
  }),
  cs({
    t: 'Expression trees and the rules of the algebra', k: 'MEDIUM', p: 7,
    kn: ['expression tree', 'union compatibility', 'rename ρ', 'σ push-down'], tag: ['relational-algebra', 'slide'],
    en: '<p>Slides 12–25 in five questions.</p>', vi: '<p>Slide 12–25 trong năm câu.</p>',
    cau: [
      q('c1', ['R(name, address) and S(title, year). Is R ∪ S legal?', 'R(name, address) và S(title, year). R ∪ S có hợp lệ?'], ['No — the operands must have the same attributes with compatible domains', 'Yes — both have two attributes, that is enough', 'Yes — SQL converts the types automatically', 'Only if R and S have the same number of tuples'], ['∪, ∩, − need union-compatible operands: same arity AND matching domains (and, in the algebra, the same attribute names).', '∪, ∩, − cần hai vế tương thích: cùng bậc VÀ miền tương ứng khớp (trong đại số còn cùng tên thuộc tính).']),
      q('c2', ['|R| = 3 tuples, |S| = 4 tuples. How many tuples in R × S?', '|R| = 3 bộ, |S| = 4 bộ. R × S có bao nhiêu bộ?'], ['12', '7', '4', 'At most 3'], ['The product pairs every tuple of R with every tuple of S: 3 × 4.', 'Tích ghép mọi bộ của R với mọi bộ của S: 3 × 4.']),
      q('c3', ['Why do we need ρ (rename) for "pairs of stars living at the same address"?', 'Vì sao cần ρ (đổi tên) cho "cặp diễn viên sống cùng địa chỉ"?'], ['To use two copies of MovieStar whose attributes must be told apart', 'To sort the result by name', 'To remove duplicate tuples', 'Because joins are only allowed between different tables'], ['A self-join needs two copies, ρS1(MovieStar) and ρS2(MovieStar), so S1.address and S2.address can be compared.', 'Tự nối cần hai bản sao ρS1(MovieStar), ρS2(MovieStar) để so S1.address với S2.address.']),
      q('c4', ['πtitle(σyear>1990(Movies ⋈ StarsIn)) — which rewrite is equivalent and usually cheaper?', 'πtitle(σyear>1990(Movies ⋈ StarsIn)) — cách viết lại nào tương đương và thường rẻ hơn?'], ['πtitle(σyear>1990(Movies) ⋈ StarsIn)', 'σyear>1990(πtitle(Movies ⋈ StarsIn))', 'πtitle(Movies) ⋈ σyear>1990(StarsIn)', 'σyear>1990(Movies) × StarsIn'], ['Push σ down to the table it mentions: fewer tuples enter the join. Projecting title first would lose year, so σ could no longer be tested.', 'Đẩy σ xuống bảng mà nó nói tới: ít bộ vào phép nối hơn. Chiếu title trước sẽ mất year, σ không kiểm được nữa.']),
      q('c5', ['In an expression tree, which operator is evaluated FIRST?', 'Trong cây biểu thức, phép nào được tính TRƯỚC?'], ['The ones at the leaves\' level, closest to the base tables', 'The root at the top, because it is read first', 'Always π, because it makes the tuples smaller', 'Any of them: the order is chosen at random'], ['A tree is evaluated bottom-up: leaves are relations, each inner node takes the results of its children.', 'Cây được tính từ dưới lên: lá là quan hệ, mỗi nút trong nhận kết quả của các nút con.']),
    ],
    gy: [['Union-compatible = same number of attributes, matching domains.', 'Tương thích hợp = cùng số thuộc tính, miền khớp nhau.'], ['σ can move down past a join when it mentions attributes of one side only.', 'σ được đẩy xuống dưới phép nối khi nó chỉ nhắc thuộc tính của một vế.']],
    lhg: [['Thinking same arity is enough for ∪ — domains must match too.', 'Tưởng cùng bậc là đủ cho ∪ — miền cũng phải khớp.'], ['Projecting away an attribute that a later σ still needs.', 'Chiếu bỏ một thuộc tính mà σ phía sau còn cần.']],
    tn: [tn('rename ρ', 'phép đổi tên ρ'), tn('expression tree', 'cây biểu thức')],
  }),
]);
