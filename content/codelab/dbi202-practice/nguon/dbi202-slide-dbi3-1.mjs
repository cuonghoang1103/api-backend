/**
 * DBI202 · 2.A Slide trường Chương 2 (1–11) — mô hình dữ liệu, quan hệ, lược đồ, bộ, bậc, lực lượng, khoá.
 */
import { mod, de, cs, q, bang1, chan, duoc, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { MOV, LUOC_DO_MOV } from './_du-lieu.mjs';

const M = { csdl: MOV, tenCsdl: 'Movies', ld: LUOC_DO_MOV };

export default mod('dbi202-slide-dbi3-1', '2.A Data models, relations & keys (slides 1–11)', [
  cs({
    t: 'Read a relation: schema, tuples, degree, cardinality', k: 'EASY', p: 6, loai: 'table',
    kn: ['relation', 'attribute', 'tuple', 'degree', 'cardinality', 'domain'], tag: ['relational-model', 'slide'],
    en: `<p>The relation on slide 5 (a slice of <code>Movies</code>):</p><table><thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th></tr></thead><tbody><tr><td>Gone With the Wind</td><td>1939</td><td>231</td><td>drama</td></tr><tr><td>Star Wars</td><td>1977</td><td>124</td><td>sciFi</td></tr><tr><td>Wayne's World</td><td>1992</td><td>95</td><td>comedy</td></tr></tbody></table><p>Fill in the words and numbers.</p>`,
    vi: `<p>Quan hệ của slide 5 (một lát của <code>Movies</code>) như bảng trên. Điền thuật ngữ và con số.</p>`,
    bang: [bang1('b1', ['Vocabulary of a relation', 'Thuật ngữ của một quan hệ'],
      [{ ma: 'hoi', ten: 'Question / Câu hỏi' }, { ma: 'dap', ten: 'Answer / Đáp án' }],
      [{ o: { hoi: 'Degree (arity) — number of attributes' }, a: { dap: '4' } },
        { o: { hoi: 'Cardinality — number of tuples' }, a: { dap: '3' } },
        { o: { hoi: 'The schema, written Name(attr, …) in order title, year, length, genre' }, a: { dap: ['Movies(title, year, length, genre)', 'Movies(title,year,length,genre)'] } },
        { o: { hoi: 'A row such as (Star Wars, 1977, 124, sciFi) is called a …' }, a: { dap: ['tuple', 'tuples'] } },
        { o: { hoi: 'The set of allowed values of an attribute (e.g. integers for year) is its …' }, a: { dap: ['domain', 'domains'] } }],
      ['Degree counts columns (4), cardinality counts rows (3). A row is a tuple; the type/set of values of an attribute is its domain. The schema is the relation name plus its attribute list.', 'Bậc đếm cột (4), lực lượng đếm dòng (3). Một dòng là một bộ (tuple); tập giá trị cho phép của thuộc tính là miền (domain). Lược đồ là tên quan hệ cùng danh sách thuộc tính.'])],
    gy: [['Degree ↔ columns, cardinality ↔ rows.', 'Bậc ↔ cột, lực lượng ↔ dòng.'], ['Write the schema exactly as Movies(title, year, length, genre).', 'Viết lược đồ đúng dạng Movies(title, year, length, genre).']],
    lhg: [['Swapping degree and cardinality.', 'Đảo bậc với lực lượng.'], ['Calling a row a "record" in an exam that asks for the relational term (tuple).', 'Gọi dòng là "record" khi đề hỏi thuật ngữ quan hệ (tuple).']],
    tn: [tn('tuple', 'bộ'), tn('degree / arity', 'bậc'), tn('cardinality', 'lực lượng'), tn('domain', 'miền giá trị')],
  }),
  cs({
    t: 'Relations are sets: what changes the relation, and what is a key?', k: 'MEDIUM', p: 7,
    kn: ['relation as a set', 'key', 'instance vs schema'], tag: ['relational-model', 'keys', 'slide'],
    en: '<p>Slides 6–11: a relation is a <b>set</b> of tuples, a schema is the structure, an instance is the data at one moment, and a key is a set of attributes no two tuples may share.</p>',
    vi: '<p>Slide 6–11: quan hệ là một <b>tập</b> các bộ, lược đồ là cấu trúc, thể hiện là dữ liệu tại một thời điểm, khoá là tập thuộc tính mà hai bộ không được trùng.</p>',
    cau: [
      q('c1', ['You list the same three tuples of Movies in a different row order. Is it the same relation?', 'Liệt kê cùng ba bộ của Movies theo thứ tự dòng khác. Có phải cùng một quan hệ?'], ['Yes — a relation is a set, row order is irrelevant', 'No — the first row is the key', 'Only if the columns stay in the same order too', 'No — a relation is a list of rows'], ['A set has no order. (Column order is also irrelevant if the attributes are reordered together with their values.)', 'Tập không có thứ tự. (Thứ tự cột cũng không quan trọng nếu đổi chỗ thuộc tính cùng giá trị.)']),
      q('c2', ['Why is {title, year} — not {title} — the key of Movies?', 'Vì sao khoá của Movies là {title, year} chứ không phải {title}?'], ['Remakes share a title, so title alone can repeat', 'title is too long to be a key', 'year must always be part of every key', 'A key needs at least two attributes'], ['King Kong (1933) and King Kong (2005): same title, different films. The pair is unique.', 'King Kong (1933) và King Kong (2005): cùng tên, khác phim. Cặp mới là duy nhất.']),
      q('c3', ['Adding a new film changes…', 'Thêm một phim mới làm thay đổi…'], ['the instance, not the schema', 'the schema, not the instance', 'both the schema and the instance', 'the domain of title'], ['Schema = structure (changes rarely, via ALTER); instance = current set of tuples (changes with every INSERT).', 'Lược đồ = cấu trúc (hiếm đổi, qua ALTER); thể hiện = tập bộ hiện tại (đổi sau mỗi INSERT).']),
      q('c4', ['In the relational model each attribute value must be…', 'Trong mô hình quan hệ, mỗi giá trị thuộc tính phải…'], ['atomic — a single value from the domain', 'a list of values separated by commas', 'a pointer to another tuple', 'unique in the whole relation'], ['First normal form: no lists or nested tables inside a cell. Uniqueness is only required of keys.', 'Dạng chuẩn 1: không danh sách hay bảng lồng trong một ô. Chỉ khoá mới phải duy nhất.']),
      q('c5', ['The three parts of a data model (slide 3) are…', 'Ba thành phần của một mô hình dữ liệu (slide 3) là…'], ['structure, operations and constraints', 'tables, rows and columns', 'DDL, DML and DCL', 'files, pages and records'], ['Structure (tables), operations (queries/updates — the algebra) and constraints (keys, CHECKs…).', 'Cấu trúc (bảng), phép toán (truy vấn/cập nhật — đại số) và ràng buộc (khoá, CHECK…).']),
    ],
    gy: [['Set ⇒ no order, no duplicates.', 'Tập ⇒ không thứ tự, không trùng.'], ['A key must stay unique for EVERY instance the real world allows, not just today\'s rows.', 'Khoá phải duy nhất với MỌI thể hiện mà thực tế cho phép, không chỉ dữ liệu hôm nay.']],
    lhg: [['Thinking a key is decided by today\'s data — today no remake may exist, but the rule must allow one.', 'Tưởng khoá được quyết theo dữ liệu hôm nay — hôm nay có thể chưa có phim làm lại, nhưng luật phải cho phép.'], ['Mixing schema (structure) and instance (data).', 'Nhầm lược đồ (cấu trúc) với thể hiện (dữ liệu).']],
    tn: [TN.pk, tn('schema / instance', 'lược đồ / thể hiện')],
  }),
  de({
    csdl: '', ld: null,
    t: 'Declare Movies with its composite key', k: 'EASY', p: 7,
    kn: ['CREATE TABLE', 'composite key'], tag: ['ddl', 'keys', 'slide'],
    en: '<p>Slide 9 declares <code>Movies(title, year, length, genre)</code> with key <code>(title, year)</code>. Write it in SQL: <code>title VARCHAR(100)</code>, <code>year INT</code>, <code>length INT</code>, <code>genre VARCHAR(10)</code>; title and year are required.</p>',
    vi: '<p>Slide 9 khai <code>Movies(title, year, length, genre)</code> với khoá <code>(title, year)</code>. Viết bằng SQL: <code>title VARCHAR(100)</code>, <code>year INT</code>, <code>length INT</code>, <code>genre VARCHAR(10)</code>; title và year bắt buộc.</p>',
    yc: [['One CREATE TABLE statement named <code>Movies</code>.', 'Một câu CREATE TABLE tên <code>Movies</code>.'], ['The PRIMARY KEY is the pair (title, year).', 'PRIMARY KEY là cặp (title, year).']],
    giai: `CREATE TABLE Movies (
    title  VARCHAR(100) NOT NULL,
    year   INT          NOT NULL,
    length INT          NULL,
    genre  VARCHAR(10)  NULL,
    CONSTRAINT pk_movies PRIMARY KEY (title, year)   -- remakes share a title, not a (title, year)
);`,
    kiem: [
      duoc(['A film can be inserted', 'Thêm được một phim'], `INSERT INTO Movies VALUES ('Star Wars', 1977, 124, 'sciFi')`),
      duoc(['A remake (same title, other year) is accepted', 'Phim làm lại (cùng tên, khác năm) được nhận'], `INSERT INTO Movies VALUES ('King Kong', 1933, 100, 'drama'); INSERT INTO Movies VALUES ('King Kong', 2005, 187, 'drama')`),
      chan(['The same (title, year) twice is rejected', 'Cùng (title, year) hai lần bị từ chối'], `INSERT INTO Movies VALUES ('Star Wars', 1977, 124, 'sciFi'); INSERT INTO Movies VALUES ('Star Wars', 1977, 121, 'sciFi')`, '23505'),
      chan(['A film without a year is rejected', 'Phim thiếu năm bị từ chối'], `INSERT INTO Movies (title, length) VALUES ('Untitled', 90)`, '23502'),
    ],
    sai: [`CREATE TABLE Movies (title VARCHAR(100) NOT NULL PRIMARY KEY, year INT NOT NULL, length INT, genre VARCHAR(10));`, `CREATE TABLE Movies (title VARCHAR(100), year INT, length INT, genre VARCHAR(10));`],
    gy: [['A composite key is declared at table level: PRIMARY KEY (title, year).', 'Khoá ghép khai ở mức bảng: PRIMARY KEY (title, year).'], ['Columns of a primary key are NOT NULL automatically, but writing NOT NULL makes the intent clear.', 'Cột của khoá chính tự là NOT NULL, nhưng ghi NOT NULL cho rõ ý.']],
    lhg: [['PRIMARY KEY on title alone — the remake King Kong (2005) is rejected.', 'PRIMARY KEY chỉ trên title — phim làm lại King Kong (2005) bị từ chối.'], ['No key at all — two identical films can be stored.', 'Không có khoá — lưu được hai phim y hệt.']],
    gt: ['<p>Two separate <code>PRIMARY KEY</code> words on two columns is an error; a composite key needs the table-level form with both columns in one list.</p>', '<p>Viết hai chữ <code>PRIMARY KEY</code> trên hai cột là lỗi; khoá ghép phải khai ở mức bảng với cả hai cột trong một danh sách.</p>'],
    tn: [TN.pk, tn('composite key', 'khoá ghép')],
  }),
  de({
    ...M, t: 'Prove that title alone is not a key', k: 'MEDIUM', p: 8,
    kn: ['key', 'GROUP BY', 'HAVING'], tag: ['keys', 'group-by', 'slide'],
    en: '<p>On the Movies instance, a key candidate is refuted by two tuples that share its value. Find every <b>studioName</b> value that appears in more than one movie — proof that <code>studioName</code> is not a key of Movies — with the number of movies.</p>',
    vi: '<p>Trên thể hiện Movies, một ứng viên khoá bị bác bỏ khi hai bộ có cùng giá trị đó. Tìm mọi giá trị <b>studioName</b> xuất hiện ở hơn một phim — bằng chứng <code>studioName</code> không phải khoá của Movies — kèm số phim.</p>',
    yc: [['Columns: <code>studioName, movies</code>.', 'Cột: <code>studioName, movies</code>.'], ['Only studios with at least 2 movies; row order does not matter.', 'Chỉ hãng có từ 2 phim; thứ tự dòng không quan trọng.']],
    giai: `SELECT studioName, COUNT(*) AS movies
FROM Movies
GROUP BY studioName
HAVING COUNT(*) > 1;      -- any group with 2+ tuples refutes "studioName is a key"`,
    kiem: [kq(['Studios that appear more than once', 'Hãng xuất hiện hơn một lần']), kqAn(['Lucasfilm gets a second film', 'Lucasfilm có thêm phim thứ hai'], `INSERT INTO Movies VALUES ('THX 1138', 1971, 86, N'sciFi', N'Lucasfilm', 100), ('American Graffiti', 1973, 110, N'comedy', N'Lucasfilm', 100)`), ma(['Uses HAVING', 'Dùng HAVING'], '\\bHAVING\\b')],
    sai: [`SELECT studioName, COUNT(*) AS movies FROM Movies GROUP BY studioName`, `SELECT studioName, COUNT(*) AS movies FROM Movies WHERE studioName IS NOT NULL GROUP BY studioName HAVING COUNT(*) > 2`],
    gy: [['Group the tuples by studioName and count each group.', 'Gộp các bộ theo studioName và đếm từng nhóm.'], ['Keep the groups with HAVING COUNT(*) &gt; 1.', 'Giữ nhóm có HAVING COUNT(*) &gt; 1.']],
    lhg: [['Forgetting HAVING — studios with a single film are listed too.', 'Quên HAVING — hãng chỉ có một phim cũng hiện.'], ['HAVING COUNT(*) &gt; 2 — two films already break the key.', 'HAVING COUNT(*) &gt; 2 — chỉ hai phim đã phá khoá.']],
    gt: ['<p>One instance can <i>refute</i> a key (two tuples share the value) but can never <i>prove</i> one — a key is a rule about every allowed instance. This GROUP BY … HAVING COUNT(*) &gt; 1 pattern is also how you find duplicates before adding a UNIQUE constraint.</p>', '<p>Một thể hiện có thể <i>bác bỏ</i> khoá (hai bộ trùng giá trị) nhưng không bao giờ <i>chứng minh</i> được khoá — khoá là luật cho mọi thể hiện hợp lệ. Mẫu GROUP BY … HAVING COUNT(*) &gt; 1 cũng là cách tìm trùng trước khi thêm ràng buộc UNIQUE.</p>'],
    tn: [TN.groupBy, TN.having],
  }),
]);
