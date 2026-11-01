/** PostgreSQL · 3.1 — Khoá chính: danh tính của một dòng. Bảng tag / note_tag của bài + CT Shop mini. */
import { mod, pg, cs, q, sau, chan, duoc, ma, pre, TN, tn } from './_chung.mjs';

export default mod('postgresql-3-1-khoa-chinh', '3.1 Primary keys: the identity of a row', [
  pg({
    t: 'A natural key for tags', k: 'EASY', p: 6, kn: ['PRIMARY KEY', 'natural key'], tag: ['ddl', 'pk'],
    csdl: '', ld: null,
    en: '<p>Tags are identified by their URL slug (<code>sql</code>, <code>db</code>…). Create <code>tag (slug text, label text)</code> where the slug is the primary key and the label is required, then insert <code>(\'sql\', \'SQL\')</code> and <code>(\'db\', \'Database\')</code>.</p>',
    vi: '<p>Thẻ được định danh bằng slug trên URL (<code>sql</code>, <code>db</code>…). Tạo <code>tag (slug text, label text)</code> với slug là khoá chính và label bắt buộc, rồi chèn <code>(\'sql\', \'SQL\')</code> và <code>(\'db\', \'Database\')</code>.</p>',
    yc: [['<code>slug text PRIMARY KEY</code>, <code>label text NOT NULL</code>.', '<code>slug text PRIMARY KEY</code>, <code>label text NOT NULL</code>.'], ['Then the INSERT of two rows.', 'Rồi lệnh INSERT hai dòng.']],
    giai: `CREATE TABLE tag (
  slug  text PRIMARY KEY,      -- UNIQUE + NOT NULL + an index, in one word
  label text NOT NULL
);
INSERT INTO tag VALUES ('sql', 'SQL'), ('db', 'Database');`,
    kiem: [
      sau(['Two tags stored', 'Đã lưu hai thẻ'], 'SELECT slug, label FROM tag ORDER BY slug', { thuTu: true }),
      chan(['Same slug again is rejected', 'Trùng slug bị chặn'], "INSERT INTO tag VALUES ('sql', 'Structured Query Language')", '23505'),
      chan(['A tag without slug is rejected', 'Thẻ thiếu slug bị chặn'], "INSERT INTO tag (label) VALUES ('No slug')", '23502'),
      sau(['slug is the primary key', 'slug là khoá chính'], "SELECT a.attname FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) WHERE i.indrelid = 'tag'::regclass AND i.indisprimary", { an: true }),
    ],
    sai: ["CREATE TABLE tag (slug text UNIQUE, label text NOT NULL); INSERT INTO tag VALUES ('sql', 'SQL'), ('db', 'Database');", "CREATE TABLE tag (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, slug text, label text NOT NULL); INSERT INTO tag (slug, label) VALUES ('sql', 'SQL'), ('db', 'Database');"],
    gy: [['Write PRIMARY KEY right after the slug column type.', 'Viết PRIMARY KEY ngay sau kiểu của cột slug.'], ['A primary key implies NOT NULL; UNIQUE alone does not.', 'Khoá chính đã bao gồm NOT NULL; UNIQUE thì không.']],
    lhg: [['<code>slug text UNIQUE</code> — a tag with slug NULL is accepted (UNIQUE allows NULLs).', '<code>slug text UNIQUE</code> — thẻ có slug NULL vẫn được nhận (UNIQUE cho phép NULL).'], ['Adding a surrogate id and forgetting any rule on slug — two "sql" tags appear.', 'Thêm id thay thế mà quên luật trên slug — xuất hiện hai thẻ "sql".']],
    gt: ['<p>PRIMARY KEY = UNIQUE + NOT NULL + a B-tree index, and there can be only one per table. A short, stable, meaningful value like a slug can be a natural key.</p>', '<p>PRIMARY KEY = UNIQUE + NOT NULL + một chỉ mục B-tree, và mỗi bảng chỉ có một. Giá trị ngắn, ổn định, có nghĩa như slug có thể làm khoá tự nhiên.</p>'],
    tn: [TN.pk, tn('natural key', 'khoá tự nhiên')],
  }),

  pg({
    t: 'A composite key for a link table', k: 'MEDIUM', p: 8, kn: ['composite PRIMARY KEY', 'many-to-many'], tag: ['ddl', 'pk'],
    csdl: '', ld: null,
    en: '<p>A note can carry many tags and a tag many notes. Create <code>note_tag (note_id bigint, tag_slug text)</code> so that the same pair can never be stored twice — without adding an id column — and insert the pairs (1, sql), (1, db), (2, sql).</p>',
    vi: '<p>Một ghi chú mang nhiều thẻ và một thẻ thuộc nhiều ghi chú. Tạo <code>note_tag (note_id bigint, tag_slug text)</code> sao cho cùng một cặp không bao giờ lưu hai lần — không thêm cột id — rồi chèn các cặp (1, sql), (1, db), (2, sql).</p>',
    yc: [['A table-level <code>PRIMARY KEY (note_id, tag_slug)</code>.', 'Một <code>PRIMARY KEY (note_id, tag_slug)</code> cấp bảng.'], ['No other columns.', 'Không có cột nào khác.']],
    giai: `CREATE TABLE note_tag (
  note_id  bigint,
  tag_slug text,
  PRIMARY KEY (note_id, tag_slug)     -- the PAIR is unique; each column alone may repeat
);
INSERT INTO note_tag VALUES (1, 'sql'), (1, 'db'), (2, 'sql');`,
    kiem: [
      sau(['Three pairs stored', 'Đã lưu ba cặp'], 'SELECT note_id, tag_slug FROM note_tag ORDER BY note_id, tag_slug', { thuTu: true }),
      chan(['The exact same pair is rejected', 'Đúng cặp cũ bị chặn'], "INSERT INTO note_tag VALUES (1, 'sql')", '23505'),
      duoc(['Same note, another tag is fine', 'Cùng ghi chú, thẻ khác thì được'], "INSERT INTO note_tag VALUES (2, 'db')"),
      chan(['NULL in a key column is rejected', 'NULL trong cột khoá bị chặn'], "INSERT INTO note_tag VALUES (3, NULL)", '23502', { an: true }),
      sau(['Only two columns', 'Chỉ hai cột'], "SELECT count(*) AS cols FROM information_schema.columns WHERE table_name = 'note_tag'", { an: true }),
    ],
    sai: ["CREATE TABLE note_tag (note_id bigint PRIMARY KEY, tag_slug text); INSERT INTO note_tag VALUES (1, 'sql'), (1, 'db'), (2, 'sql');", "CREATE TABLE note_tag (note_id bigint, tag_slug text); INSERT INTO note_tag VALUES (1, 'sql'), (1, 'db'), (2, 'sql');"],
    gy: [['A key on several columns is written after the column list: <code>PRIMARY KEY (a, b)</code>.', 'Khoá nhiều cột viết sau danh sách cột: <code>PRIMARY KEY (a, b)</code>.'], ['Putting PRIMARY KEY on note_id alone would allow only one tag per note.', 'Đặt PRIMARY KEY riêng note_id thì mỗi ghi chú chỉ được một thẻ.']],
    lhg: [['PRIMARY KEY on note_id only — the INSERT itself fails at (1, db).', 'PRIMARY KEY chỉ trên note_id — chính lệnh INSERT hỏng ở (1, db).'], ['No key at all — (1, sql) can be inserted ten times and counts go wrong.', 'Không có khoá — (1, sql) chèn mười lần được và số đếm sai.']],
    gt: ['<p>In a link table the pair IS the identity, so the natural primary key is the composite (note_id, tag_slug). Its index also serves "all tags of note N" lookups, because note_id is its first column.</p>', '<p>Trong bảng nối, cặp CHÍNH LÀ danh tính, nên khoá chính tự nhiên là khoá ghép (note_id, tag_slug). Chỉ mục của nó còn phục vụ truy vấn "mọi thẻ của ghi chú N", vì note_id là cột đầu.</p>'],
    tn: [tn('composite key', 'khoá ghép'), tn('link table', 'bảng nối (nhiều-nhiều)')],
  }),

  cs({
    t: 'Surrogate or natural key?', k: 'MEDIUM', p: 5, kn: ['surrogate key', 'natural key'], tag: ['pk', 'design'],
    en: '<p>Pick the better primary key for each table, following lesson 3.1.</p>', vi: '<p>Chọn khoá chính tốt hơn cho từng bảng, theo bài 3.1.</p>',
    cau: [
      q('q1', ['<code>customer</code> — people can change their email.', '<code>customer</code> — người dùng có thể đổi email.'], ['an identity column <code>id</code>; email gets its own UNIQUE constraint', 'email as the primary key', '(full_name, city)', 'phone number'], ['A key should never change. Email changes ⇒ every foreign key pointing at it would have to change too. Keep it unique, but identify the row with a surrogate id.', 'Khoá không bao giờ nên đổi. Email đổi ⇒ mọi khoá ngoại trỏ tới nó cũng phải đổi theo. Giữ nó UNIQUE, còn định danh dòng bằng id thay thế.']),
      q('q2', ['<code>country</code> reference table with ISO codes like VN, JP, US.', 'Bảng tham chiếu <code>country</code> với mã ISO như VN, JP, US.'], ['the ISO code itself (short, standard, stable)', 'an identity id plus the code', 'the country name', '(name, continent)'], ['A short, stable, externally defined code is a perfect natural key; joins become readable (country_code = \'VN\').', 'Mã ngắn, ổn định, do bên ngoài định nghĩa là khoá tự nhiên lý tưởng; phép nối dễ đọc (country_code = \'VN\').']),
      q('q3', ['<code>order_item</code> — one product at most once per order.', '<code>order_item</code> — mỗi sản phẩm tối đa một lần trong một đơn.'], ['the composite key (order_id, product_id)', 'an identity id only', 'product_id', 'order_id'], ['The pair is what must be unique. CT Shop\'s lab schema uses exactly PRIMARY KEY (order_id, product_id).', 'Cặp đó mới là thứ phải duy nhất. Lược đồ lab CT Shop dùng đúng PRIMARY KEY (order_id, product_id).']),
      q('q4', ['Why prefer <code>GENERATED ALWAYS AS IDENTITY</code> over <code>serial</code>?', 'Vì sao nên dùng <code>GENERATED ALWAYS AS IDENTITY</code> thay vì <code>serial</code>?'], ['it is SQL-standard and refuses hand-written ids unless you say OVERRIDING SYSTEM VALUE', 'it is faster', 'serial cannot be a primary key', 'identity values are random'], ['Both draw from a sequence; identity is the standard form and protects the sequence from silent collisions with hand-typed ids.', 'Cả hai đều lấy số từ sequence; identity là dạng chuẩn và bảo vệ sequence khỏi va chạm âm thầm với id gõ tay.']),
    ],
    gy: [['Will this value ever change? Then it is a poor key.', 'Giá trị này có bao giờ đổi không? Nếu có thì là khoá tồi.'], ['Link tables: the pair is the key.', 'Bảng nối: cặp là khoá.']],
    lhg: [['Using email or phone as the primary key.', 'Dùng email hay số điện thoại làm khoá chính.'], ['Giving a link table only a surrogate id and no UNIQUE on the pair.', 'Chỉ cho bảng nối một id thay thế mà không UNIQUE trên cặp.']],
    tn: [tn('surrogate key', 'khoá thay thế'), tn('natural key', 'khoá tự nhiên')],
  }),

  pg({
    t: 'CT Shop wishlist: one heart per product', k: 'HARD', p: 12, kn: ['composite PK', 'foreign keys', 'ON CONFLICT DO NOTHING'], tag: ['ddl', 'pk', 'fk', 'ctshop'],
    en: '<p>CT Shop adds a ❤ button. Create <code>wishlist</code> (<code>customer_id</code> → customer, <code>product_id</code> → product, <code>added_at timestamptz NOT NULL DEFAULT now()</code>) where a customer can heart a product only once, then record that customer 1 hearts products 30 and 31, and customer 2 hearts product 30 — written so that running your INSERT twice would not fail.</p>',
    vi: '<p>CT Shop thêm nút ❤. Tạo <code>wishlist</code> (<code>customer_id</code> → customer, <code>product_id</code> → product, <code>added_at timestamptz NOT NULL DEFAULT now()</code>) trong đó một khách chỉ thả tim một sản phẩm một lần, rồi ghi lại khách 1 thả tim sản phẩm 30 và 31, khách 2 thả tim sản phẩm 30 — viết sao cho chạy lệnh INSERT hai lần cũng không lỗi.</p>',
    yc: [['<code>PRIMARY KEY (customer_id, product_id)</code>; both columns are foreign keys.', '<code>PRIMARY KEY (customer_id, product_id)</code>; cả hai cột là khoá ngoại.'], ['<code>INSERT … ON CONFLICT DO NOTHING</code> so a second heart is ignored.', '<code>INSERT … ON CONFLICT DO NOTHING</code> để lần thả tim thứ hai bị bỏ qua.']],
    giai: `CREATE TABLE wishlist (
  customer_id  bigint      NOT NULL REFERENCES customer(id),
  product_id   bigint      NOT NULL REFERENCES product(id),
  added_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (customer_id, product_id)
);
INSERT INTO wishlist (customer_id, product_id)
VALUES (1, 30), (1, 31), (2, 30)
ON CONFLICT DO NOTHING;                 -- idempotent: a double click does not error`,
    kiem: [
      sau(['Three hearts', 'Ba lượt thả tim'], 'SELECT customer_id, product_id FROM wishlist ORDER BY 1, 2', { thuTu: true }),
      chan(['A plain duplicate heart is rejected by the key', 'Thả tim trùng (INSERT thường) bị khoá chặn'], 'INSERT INTO wishlist (customer_id, product_id) VALUES (1, 30)', '23505'),
      chan(['Heart for a product that does not exist', 'Thả tim sản phẩm không tồn tại'], 'INSERT INTO wishlist (customer_id, product_id) VALUES (1, 999)', '23503'),
      chan(['Heart from a customer that does not exist', 'Thả tim từ khách không tồn tại'], 'INSERT INTO wishlist (customer_id, product_id) VALUES (999, 1)', '23503', { an: true }),
      ma(['Idempotent insert', 'Lệnh chèn chạy lại được'], 'ON\\s+CONFLICT[\\s\\S]*DO\\s+NOTHING'),
    ],
    sai: ['CREATE TABLE wishlist (customer_id bigint NOT NULL REFERENCES customer(id), product_id bigint NOT NULL REFERENCES product(id), added_at timestamptz NOT NULL DEFAULT now()); INSERT INTO wishlist (customer_id, product_id) VALUES (1, 30), (1, 31), (2, 30) ON CONFLICT DO NOTHING;', 'CREATE TABLE wishlist (customer_id bigint NOT NULL, product_id bigint NOT NULL, added_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (customer_id, product_id)); INSERT INTO wishlist (customer_id, product_id) VALUES (1, 30), (1, 31), (2, 30) ON CONFLICT DO NOTHING;'],
    gy: [['Same shape as order_item: two foreign keys whose pair is the primary key.', 'Cùng dạng với order_item: hai khoá ngoại mà cặp của chúng là khoá chính.'], ['ON CONFLICT DO NOTHING only works because there is a unique key to conflict on.', 'ON CONFLICT DO NOTHING chỉ có tác dụng vì có khoá duy nhất để va chạm.']],
    lhg: [['No primary key: ON CONFLICT never triggers and the same heart piles up.', 'Không khoá chính: ON CONFLICT không bao giờ kích hoạt, cùng một tim chồng chất.'], ['Composite key but no foreign keys: hearts for deleted or invented products.', 'Có khoá ghép nhưng không khoá ngoại: tim cho sản phẩm đã xoá hay bịa ra.']],
    gt: ['<p>The composite primary key makes "customer hearts product" a set, not a list. ON CONFLICT DO NOTHING turns a double click into a no-op instead of an error, and the foreign keys keep the pair pointing at real rows.</p>', '<p>Khoá chính ghép biến "khách thả tim sản phẩm" thành một tập hợp, không phải danh sách. ON CONFLICT DO NOTHING biến cú bấm đúp thành không làm gì thay vì lỗi, còn khoá ngoại giữ cặp luôn trỏ tới dòng có thật.</p>'],
    tn: [tn('idempotent', 'chạy lại không đổi kết quả'), TN.pk, TN.fk],
  }),
]);
