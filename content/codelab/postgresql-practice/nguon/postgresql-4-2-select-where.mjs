/** PostgreSQL · 4.2 — SELECT & WHERE: chọn cột, toán tử lọc, LIKE/ILIKE, bẫy NULL. Bảng note + CT Shop mini. */
import { mod, pg, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { O_NOTE } from './_du-lieu.mjs';

export default mod('postgresql-4-2-select-where', '4.2 SELECT & WHERE: getting exactly the rows you want', [
  pg({
    ...O_NOTE, t: 'Computed columns: which notes are popular?', k: 'EASY', p: 5, kn: ['projection', 'expressions in SELECT', 'alias'], tag: ['select', 'notes'],
    en: '<p>For every note return <code>id, title, views</code> and a computed boolean <code>popular</code> that is true when the note has at least 50 views. Order by id.</p>',
    vi: '<p>Với mọi ghi chú trả về <code>id, title, views</code> và cột boolean tính toán <code>popular</code> đúng khi ghi chú có từ 50 lượt xem trở lên. Sắp theo id.</p>',
    yc: [['<code>views &gt;= 50 AS popular</code> — a comparison is already a boolean value.', '<code>views &gt;= 50 AS popular</code> — phép so sánh đã là một giá trị boolean.'], ['Columns exactly <code>id, title, views, popular</code>.', 'Cột đúng <code>id, title, views, popular</code>.']],
    giai: `SELECT id, title, views,
       views >= 50 AS popular      -- an expression becomes a column; AS names it
FROM note
ORDER BY id;`,
    kiem: [
      kq(['Notes 1 and 2 are popular', 'Ghi chú 1 và 2 là phổ biến'], { thuTu: true }),
      kqAn(['Exactly 50 views counts as popular', 'Đúng 50 lượt xem vẫn tính là phổ biến'], 'UPDATE note SET views = 50 WHERE id = 3', { thuTu: true }),
      ma(['Computes popular in SQL', 'Tính popular trong SQL'], '\\bAS\\s+popular\\b'),
    ],
    sai: ['SELECT id, title, views, views > 50 AS popular FROM note ORDER BY id', 'SELECT id, title, views FROM note WHERE views >= 50 ORDER BY id'],
    gy: [['Write the expression in the SELECT list, then <code>AS popular</code>.', 'Viết biểu thức trong danh sách SELECT, rồi <code>AS popular</code>.'], ['"At least 50" means <code>&gt;= 50</code>.', '"Từ 50 trở lên" là <code>&gt;= 50</code>.']],
    lhg: [['<code>&gt; 50</code> — a note with exactly 50 views is wrongly "not popular".', '<code>&gt; 50</code> — ghi chú đúng 50 lượt bị coi nhầm là "không phổ biến".'], ['Filtering with WHERE instead of computing a column — unpopular notes disappear.', 'Lọc bằng WHERE thay vì tính cột — ghi chú không phổ biến biến mất.']],
    gt: ['<p>SELECT can return any expression, not just stored columns. A comparison yields true/false, so it is a perfectly good column value.</p>', '<p>SELECT trả được mọi biểu thức, không chỉ cột đã lưu. Phép so sánh cho ra true/false, nên là một giá trị cột hoàn toàn hợp lệ.</p>'],
    tn: [tn('projection', 'phép chiếu (chọn cột)'), tn('alias', 'bí danh')],
  }),

  pg({
    ...O_NOTE, t: 'AND, IN and BETWEEN on dates', k: 'EASY', p: 6, kn: ['AND', 'IN (…)', 'BETWEEN on date'], tag: ['select', 'where', 'notes'],
    en: '<p>Return <code>id, title, tag, created_at</code> of the notes tagged <code>sql</code> or <code>ops</code> that were created in <b>February or March 2026</b> (the column is a <code>date</code>). Order by created_at.</p>',
    vi: '<p>Trả về <code>id, title, tag, created_at</code> của các ghi chú gắn thẻ <code>sql</code> hoặc <code>ops</code> được tạo trong <b>tháng 2 hoặc tháng 3 năm 2026</b> (cột kiểu <code>date</code>). Sắp theo created_at.</p>',
    yc: [['<code>tag IN (\'sql\', \'ops\')</code>.', '<code>tag IN (\'sql\', \'ops\')</code>.'], ['On a date column, <code>BETWEEN \'2026-02-01\' AND \'2026-03-31\'</code> includes both ends.', 'Trên cột date, <code>BETWEEN \'2026-02-01\' AND \'2026-03-31\'</code> gồm cả hai đầu.']],
    giai: `SELECT id, title, tag, created_at
FROM note
WHERE tag IN ('sql', 'ops')
  AND created_at BETWEEN '2026-02-01' AND '2026-03-31'   -- date: no time of day, so BETWEEN is safe here
ORDER BY created_at;`,
    kiem: [
      kq(['Notes 2 and 4', 'Ghi chú 2 và 4'], { thuTu: true }),
      kqAn(['The last day of March is included', 'Ngày cuối tháng 3 được tính'], "INSERT INTO note (title, author, tag, created_at) VALUES ('Month end', 'Lan', 'ops', '2026-03-31'), ('April', 'Lan', 'ops', '2026-04-01')", { thuTu: true }),
      ma(['Uses IN', 'Dùng IN'], '\\bIN\\s*\\('),
    ],
    sai: ["SELECT id, title, tag, created_at FROM note WHERE tag IN ('sql', 'ops') AND created_at BETWEEN '2026-02-01' AND '2026-03-30' ORDER BY created_at", "SELECT id, title, tag, created_at FROM note WHERE tag = 'sql' OR tag = 'ops' AND created_at BETWEEN '2026-02-01' AND '2026-03-31' ORDER BY created_at"],
    gy: [['Combine conditions with AND; a list of allowed values with IN.', 'Ghép điều kiện bằng AND; danh sách giá trị cho phép bằng IN.'], ['AND binds tighter than OR — parenthesize if you write OR.', 'AND ưu tiên hơn OR — nếu viết OR thì phải có ngoặc.']],
    lhg: [['<code>tag = \'sql\' OR tag = \'ops\' AND …</code> without parentheses — every sql note passes regardless of the date.', '<code>tag = \'sql\' OR tag = \'ops\' AND …</code> không ngoặc — mọi ghi chú sql đều qua bất kể ngày.'], ['Ending the range on 2026-03-30 — 31 March is lost.', 'Kết thúc ở 2026-03-30 — mất ngày 31/3.']],
    gt: ['<p>IN is a compact OR over one column. BETWEEN is inclusive on both sides; on a <code>date</code> column that is exactly what you want (on a timestamp it is not — lesson 2.3).</p>', '<p>IN là OR gọn trên một cột. BETWEEN gồm cả hai đầu; với cột <code>date</code> đó đúng là điều bạn muốn (với timestamp thì không — bài 2.3).</p>'],
    tn: [tn('IN', 'thuộc danh sách'), tn('BETWEEN', 'trong khoảng (gồm hai đầu)')],
  }),

  pg({
    ...O_NOTE, t: 'Search titles: LIKE vs ILIKE', k: 'MEDIUM', p: 6, kn: ['ILIKE', '% wildcard', 'case sensitivity'], tag: ['select', 'like', 'notes'],
    en: '<p>The search box must find every note whose title contains <code>sql</code> in any capitalisation (SQL, Sql, sql…). Return <code>id, title</code> ordered by id.</p>',
    vi: '<p>Ô tìm kiếm phải tìm mọi ghi chú có tiêu đề chứa <code>sql</code> ở bất kỳ kiểu viết hoa nào (SQL, Sql, sql…). Trả về <code>id, title</code> sắp theo id.</p>',
    yc: [['<code>title ILIKE \'%sql%\'</code> (PostgreSQL\'s case-insensitive LIKE).', '<code>title ILIKE \'%sql%\'</code> (LIKE không phân biệt hoa thường của PostgreSQL).'], ['Text comparisons in PostgreSQL ARE case-sensitive by default.', 'So sánh chữ trong PostgreSQL MẶC ĐỊNH phân biệt hoa thường.']],
    giai: `SELECT id, title
FROM note
WHERE title ILIKE '%sql%'      -- LIKE '%sql%' would miss "Intro to SQL"
ORDER BY id;`,
    kiem: [
      kq(['Intro to SQL', 'Intro to SQL'], { thuTu: true }),
      kqAn(['PostgreSQL tips, mysql notes and SQLite all match', 'PostgreSQL tips, mysql notes và SQLite đều khớp'], "INSERT INTO note (title, author, created_at) VALUES ('PostgreSQL tips', 'Lan', '2026-04-20'), ('mysql notes', 'Minh', '2026-04-21'), ('SQLite on phones', 'Cuong', '2026-04-22'), ('Squirrel', 'Lan', '2026-04-23')", { thuTu: true }),
      ma(['Uses ILIKE (or lower())', 'Dùng ILIKE (hoặc lower())'], '\\bILIKE\\b|lower\\s*\\(\\s*title'),
    ],
    sai: ["SELECT id, title FROM note WHERE title LIKE '%sql%' ORDER BY id", "SELECT id, title FROM note WHERE title ILIKE 'sql%' ORDER BY id"],
    gy: [['<code>%</code> matches any run of characters, including none.', '<code>%</code> khớp mọi chuỗi ký tự, kể cả rỗng.'], ['"Contains" = <code>%</code> on both sides.', '"Chứa" = <code>%</code> ở cả hai phía.']],
    lhg: [['Plain LIKE: case-sensitive in PostgreSQL (unlike SQL Server\'s default collation).', 'LIKE trơn: phân biệt hoa thường trong PostgreSQL (khác collation mặc định của SQL Server).'], ['<code>\'sql%\'</code> = starts with — "Intro to SQL" does not start with sql.', '<code>\'sql%\'</code> = bắt đầu bằng — "Intro to SQL" không bắt đầu bằng sql.']],
    gt: ['<p>ILIKE is PostgreSQL\'s case-insensitive LIKE. A leading <code>%</code> means no ordinary B-tree index can help; chapter 13 speeds such searches up with trigram or full-text indexes.</p>', '<p>ILIKE là LIKE không phân biệt hoa thường của PostgreSQL. <code>%</code> ở đầu nghĩa là chỉ mục B-tree thường không giúp được; chương 13 tăng tốc kiểu tìm này bằng chỉ mục trigram hoặc full-text.</p>'],
    tn: [tn('ILIKE', 'LIKE không phân biệt hoa thường')],
  }),

  pg({
    ...O_NOTE, t: 'The NULL trap: "not sql" must include untagged notes', k: 'MEDIUM', p: 7, kn: ['three-valued logic', 'IS DISTINCT FROM', 'IS NULL'], tag: ['select', 'null', 'notes'],
    en: '<p>Return <code>id, title, tag</code> of every note that is <b>not</b> tagged <code>sql</code> — notes without any tag count as "not sql" too. Order by id.</p>',
    vi: '<p>Trả về <code>id, title, tag</code> của mọi ghi chú <b>không</b> gắn thẻ <code>sql</code> — ghi chú chưa có thẻ cũng tính là "không phải sql". Sắp theo id.</p>',
    yc: [['<code>tag &lt;&gt; \'sql\'</code> alone drops the NULL tags (NULL &lt;&gt; \'sql\' is UNKNOWN).', 'Chỉ <code>tag &lt;&gt; \'sql\'</code> sẽ đánh rơi thẻ NULL (NULL &lt;&gt; \'sql\' là UNKNOWN).'], ['Use <code>tag IS DISTINCT FROM \'sql\'</code> or add <code>OR tag IS NULL</code>.', 'Dùng <code>tag IS DISTINCT FROM \'sql\'</code> hoặc thêm <code>OR tag IS NULL</code>.']],
    giai: `SELECT id, title, tag
FROM note
WHERE tag IS DISTINCT FROM 'sql'    -- NULL-safe "not equal": NULL counts as different
ORDER BY id;`,
    kiem: [
      kq(['Notes 3, 5, 6 and 7', 'Ghi chú 3, 5, 6 và 7'], { thuTu: true }),
      kqAn(['A new untagged note appears', 'Ghi chú mới chưa có thẻ được liệt kê'], "INSERT INTO note (title, author, created_at) VALUES ('Untagged idea', 'Lan', '2026-04-15')", { thuTu: true }),
      ma(['Handles NULL explicitly', 'Xử lý NULL tường minh'], 'IS\\s+(NOT\\s+)?DISTINCT\\s+FROM|IS\\s+NULL|coalesce\\s*\\('),
    ],
    sai: ["SELECT id, title, tag FROM note WHERE tag <> 'sql' ORDER BY id", "SELECT id, title, tag FROM note WHERE tag != 'sql' OR tag = NULL ORDER BY id"],
    gy: [['Any comparison with NULL using = or &lt;&gt; is UNKNOWN, and WHERE keeps only TRUE rows.', 'Mọi so sánh với NULL bằng = hay &lt;&gt; đều UNKNOWN, mà WHERE chỉ giữ dòng TRUE.'], ['<code>IS DISTINCT FROM</code> treats NULL as an ordinary, comparable value.', '<code>IS DISTINCT FROM</code> coi NULL như một giá trị bình thường, so sánh được.']],
    lhg: [['<code>tag &lt;&gt; \'sql\'</code>: Minh\'s two untagged notes silently vanish.', '<code>tag &lt;&gt; \'sql\'</code>: hai ghi chú chưa gắn thẻ của Minh lặng lẽ biến mất.'], ['<code>OR tag = NULL</code> — still UNKNOWN; the test for NULL is <code>IS NULL</code>.', '<code>OR tag = NULL</code> — vẫn UNKNOWN; phép thử NULL là <code>IS NULL</code>.']],
    gt: ['<p>SQL uses three-valued logic: a comparison with NULL is UNKNOWN, and WHERE discards UNKNOWN. <code>IS DISTINCT FROM</code> is the NULL-safe inequality — exactly "different from \'sql\', where missing counts as different".</p>', '<p>SQL dùng logic ba giá trị: so sánh với NULL là UNKNOWN, và WHERE loại UNKNOWN. <code>IS DISTINCT FROM</code> là phép khác an toàn với NULL — đúng nghĩa "khác \'sql\', thiếu thẻ cũng tính là khác".</p>'],
    tn: [TN.nullT, tn('IS DISTINCT FROM', 'khác (an toàn với NULL)')],
  }),

  pg({
    t: 'Cheap pens that can ship today', k: 'HARD', p: 10, kn: ['several conditions', 'IN', 'boolean', 'ORDER BY two keys'], tag: ['select', 'where', 'ctshop'],
    en: '<p>A school orders pens by phone and needs the list of <b>pens and pencils</b> (categories 5, 6, 7) that cost <b>less than 25 000 đ</b>, are <b>on sale</b> and have <b>at least one unit in stock</b>. Return <code>sku, name, price, stock</code>, cheapest first, ties by sku.</p>',
    vi: '<p>Một trường đặt bút qua điện thoại cần danh sách <b>bút và bút chì</b> (danh mục 5, 6, 7) có giá <b>dưới 25 000 đ</b>, <b>đang bán</b> và <b>còn ít nhất một đơn vị</b> trong kho. Trả về <code>sku, name, price, stock</code>, rẻ nhất trước, cùng giá thì theo sku.</p>',
    yc: [['Four conditions joined with AND.', 'Bốn điều kiện nối bằng AND.'], ['"Less than 25 000" excludes 25 000 itself.', '"Dưới 25 000" không gồm 25 000.']],
    giai: `SELECT sku, name, price, stock
FROM product
WHERE category_id IN (5, 6, 7)
  AND price < 25000
  AND is_active
  AND stock > 0
ORDER BY price, sku;`,
    kiem: [
      kq(['Three pens: CT0601, CT0501, CT0702', 'Ba cây bút: CT0601, CT0501, CT0702'], { thuTu: true }),
      kqAn(['A pen at exactly 25 000, an inactive pen and a sold-out pen stay out', 'Bút đúng 25 000, bút ngừng bán và bút hết hàng đều bị loại'], "INSERT INTO product (sku, name, category_id, price, stock, is_active) VALUES ('CT0505', 'Bút gel Zebra', 5, 25000, 10, true), ('CT0506', 'Bút bi Deli', 5, 4500, 30, false), ('CT0705', 'Mildliner', 7, 8000, 0, true), ('CT0603', 'Ruột chì Pentel', 6, 12000, 5, true)", { thuTu: true }),
      ma(['Filters on stock', 'Lọc theo tồn kho'], '\\bstock\\s*(>|>=|<>|!=)'),
    ],
    sai: ['SELECT sku, name, price, stock FROM product WHERE category_id IN (5, 6, 7) AND price <= 25000 AND is_active AND stock > 0 ORDER BY price, sku', 'SELECT sku, name, price, stock FROM product WHERE category_id IN (5, 6, 7) AND price < 25000 AND stock > 0 ORDER BY price, sku'],
    gy: [['Write one condition per line; read them as a checklist.', 'Mỗi điều kiện một dòng; đọc như một danh sách kiểm.'], ['ORDER BY price, sku — the second key breaks ties.', 'ORDER BY price, sku — khoá thứ hai phá hoà.']],
    lhg: [['<code>price &lt;= 25000</code> — a 25 000 đ pen is not "less than 25 000".', '<code>price &lt;= 25000</code> — bút 25 000 đ không phải "dưới 25 000".'], ['Forgetting <code>is_active</code>: a discontinued pen gets promised to the school.', 'Quên <code>is_active</code>: hứa với trường một cây bút đã ngừng bán.']],
    gt: ['<p>Each business word maps to one predicate: category IN (…), price &lt;, is_active, stock &gt; 0. Writing them separately makes it easy to check none is missing — the hidden check adds one product per trap.</p>', '<p>Mỗi từ nghiệp vụ ứng với một vị từ: category IN (…), price &lt;, is_active, stock &gt; 0. Viết tách riêng giúp dễ soát không thiếu cái nào — kiểm ẩn thêm một sản phẩm cho mỗi bẫy.</p>'],
    tn: [tn('predicate', 'vị từ (điều kiện)')],
  }),
]);
