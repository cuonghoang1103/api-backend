/** PostgreSQL · 2.4 — UUID, enum, array & jsonb. */
import { mod, pg, kq, kqAn, sau, chan, duoc, ma, pre, TN, tn } from './_chung.mjs';

const POST = `CREATE TABLE post (
  id     int PRIMARY KEY,
  title  text NOT NULL,
  tags   text[] NOT NULL DEFAULT '{}'
);
INSERT INTO post VALUES
  (1, 'Indexes in 10 minutes', ARRAY['db', 'sql', 'perf']),
  (2, 'My first psql session', ARRAY['psql']),
  (3, 'JOIN without tears',    ARRAY['sql']),
  (4, 'Weekend notes',         '{}'),
  (5, 'Backups that restore',  ARRAY['db', 'ops']);`;

export default mod('postgresql-2-4-uuid-enum-array-jsonb', '2.4 UUID, enum, array & jsonb', [
  pg({
    t: 'An enum for ticket priority', k: 'EASY', p: 8, kn: ['CREATE TYPE … AS ENUM', 'enum ordering', 'invalid input 22P02'], tag: ['types', 'enum', 'ddl'],
    csdl: '', ld: null,
    en: `<p>Support tickets have a priority that can only be <code>low</code>, <code>normal</code>, <code>high</code> or <code>urgent</code> — in that order of importance. Create the enum type <code>priority</code> and table <code>ticket (id int identity PK, title text NOT NULL, priority priority NOT NULL DEFAULT 'normal')</code>.</p>`,
    vi: `<p>Phiếu hỗ trợ có mức ưu tiên chỉ được là <code>low</code>, <code>normal</code>, <code>high</code> hoặc <code>urgent</code> — theo đúng thứ tự quan trọng đó. Tạo kiểu enum <code>priority</code> và bảng <code>ticket (id int identity PK, title text NOT NULL, priority priority NOT NULL DEFAULT 'normal')</code>.</p>`,
    yc: [['<code>CREATE TYPE priority AS ENUM (…)</code> with the values in importance order.', '<code>CREATE TYPE priority AS ENUM (…)</code> với các giá trị theo thứ tự quan trọng.'], ['Then <code>CREATE TABLE ticket</code>.', 'Rồi <code>CREATE TABLE ticket</code>.']],
    giai: `CREATE TYPE priority AS ENUM ('low', 'normal', 'high', 'urgent');   -- declaration order = sort order
CREATE TABLE ticket (
  id       int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title    text NOT NULL,
  priority priority NOT NULL DEFAULT 'normal'
);`,
    kiem: [
      sau(['ORDER BY priority DESC sorts by importance, not alphabetically', 'ORDER BY priority DESC sắp theo độ quan trọng, không theo chữ cái'], "INSERT INTO ticket (title, priority) VALUES ('a', 'high'), ('b', 'low'), ('c', 'urgent'), ('d', 'normal'); SELECT title, priority FROM ticket ORDER BY priority DESC", { thuTu: true }),
      chan(['An unknown priority is rejected', 'Mức ưu tiên lạ bị chặn'], "INSERT INTO ticket (title, priority) VALUES ('x', 'critical')", '22P02'),
      sau(['Default is normal', 'Mặc định là normal'], "INSERT INTO ticket (title) VALUES ('no priority given'); SELECT priority FROM ticket"),
      sau(['Enum labels in order', 'Nhãn enum đúng thứ tự'], "SELECT enumlabel FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid WHERE t.typname = 'priority' ORDER BY enumsortorder", { thuTu: true, an: true }),
    ],
    sai: [`CREATE TYPE priority AS ENUM ('high', 'low', 'normal', 'urgent'); CREATE TABLE ticket (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, title text NOT NULL, priority priority NOT NULL DEFAULT 'normal');`, `CREATE TABLE ticket (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, title text NOT NULL, priority text NOT NULL DEFAULT 'normal');`],
    gy: [['The order you list enum labels in IS the sort order.', 'Thứ tự liệt kê nhãn enum CHÍNH LÀ thứ tự sắp xếp.'], ['A column of an enum type rejects any other text with error 22P02.', 'Cột kiểu enum từ chối mọi chữ khác bằng lỗi 22P02.']],
    lhg: [['Listing labels alphabetically — then "high" sorts before "low".', 'Liệt kê nhãn theo chữ cái — khi đó "high" đứng trước "low".'], ['A plain text column: \'critical\', \'Urgent \' and \'urgnet\' all get in.', 'Cột text trơn: \'critical\', \'Urgent \' và \'urgnet\' đều lọt vào.']],
    gt: ['<p>An enum is a closed list of labels stored compactly, compared and sorted by declaration order. Adding a value later is <code>ALTER TYPE … ADD VALUE</code>; removing one is hard — use enums for lists that really are fixed.</p>', '<p>Enum là danh sách nhãn đóng, lưu gọn, so sánh và sắp theo thứ tự khai báo. Thêm giá trị sau này bằng <code>ALTER TYPE … ADD VALUE</code>; bỏ một giá trị thì khó — chỉ dùng enum cho danh sách thật sự cố định.</p>'],
    tn: [tn('enum', 'kiểu liệt kê')],
  }),

  pg({
    t: 'Posts tagged sql, with their tag count', k: 'MEDIUM', p: 7, kn: ['text[]', '= ANY(array)', 'cardinality'], tag: ['types', 'array'],
    csdl: POST, tenCsdl: 'post', ld: { en: pre('post (id PK, title, tags text[] DEFAULT \'{}\') — 5 rows'), vi: pre('post (id PK, title, tags text[] DEFAULT \'{}\') — 5 dòng') },
    en: '<p>Return <code>id, title, n_tags</code> of every post whose <code>tags</code> contain <code>\'sql\'</code>, where <code>n_tags</code> is the number of tags of that post. Order by id.</p>',
    vi: '<p>Trả về <code>id, title, n_tags</code> của mọi bài có <code>tags</code> chứa <code>\'sql\'</code>, trong đó <code>n_tags</code> là số thẻ của bài đó. Sắp theo id.</p>',
    yc: [['<code>\'sql\' = ANY(tags)</code> (or <code>tags @&gt; ARRAY[\'sql\']</code>).', '<code>\'sql\' = ANY(tags)</code> (hoặc <code>tags @&gt; ARRAY[\'sql\']</code>).'], ['<code>cardinality(tags)</code> counts elements (0 for an empty array).', '<code>cardinality(tags)</code> đếm phần tử (0 với mảng rỗng).']],
    giai: `SELECT id, title, cardinality(tags) AS n_tags
FROM post
WHERE 'sql' = ANY (tags)          -- membership test on an array
ORDER BY id;`,
    kiem: [
      kq(['Posts 1 and 3', 'Bài 1 và 3'], { thuTu: true }),
      kqAn(['A tag that only CONTAINS the letters sql does not count', 'Thẻ chỉ CHỨA chữ sql thì không tính'], "INSERT INTO post VALUES (6, 'PostgreSQL vs MySQL', ARRAY['mysql', 'postgresql']), (7, 'SQL quiz', ARRAY['quiz', 'sql'])", { thuTu: true }),
      ma(['Array test', 'Phép thử trên mảng'], '\\bANY\\s*\\(|@>'),
    ],
    sai: ["SELECT id, title, cardinality(tags) AS n_tags FROM post WHERE array_to_string(tags, ',') LIKE '%sql%' ORDER BY id", "SELECT id, title, array_length(tags, 1) AS n_tags FROM post WHERE 'sql' = ANY(tags) OR tags = '{}' ORDER BY id"],
    gy: [['<code>value = ANY(array)</code> is true if any element equals the value.', '<code>value = ANY(array)</code> đúng nếu có phần tử bằng giá trị đó.'], ['Count with <code>cardinality(tags)</code>.', 'Đếm bằng <code>cardinality(tags)</code>.']],
    lhg: [['Turning the array into a string and using LIKE \'%sql%\' — "mysql" and "postgresql" match too.', 'Biến mảng thành chuỗi rồi LIKE \'%sql%\' — "mysql" và "postgresql" cũng khớp.'], ['<code>array_length(tags, 1)</code> returns NULL (not 0) for an empty array.', '<code>array_length(tags, 1)</code> trả NULL (không phải 0) với mảng rỗng.']],
    gt: ['<p>Arrays keep a short list inside one row and still allow exact element tests. For lists that need their own attributes or foreign keys, a separate table (post_tag) is the relational answer — lesson 2.4 discusses the trade-off.</p>', '<p>Mảng giữ một danh sách ngắn trong một dòng mà vẫn thử phần tử chính xác được. Danh sách cần thuộc tính riêng hay khoá ngoại thì dùng bảng riêng (post_tag) — bài 2.4 bàn về đánh đổi này.</p>'],
    tn: [tn('array', 'mảng'), tn('ANY', 'bất kỳ phần tử nào')],
  }),

  pg({
    t: 'Read product attributes from jsonb', k: 'MEDIUM', p: 8, kn: ['->>', '@> containment', 'jsonb'], tag: ['types', 'jsonb', 'ctshop'],
    en: '<p>Each product stores <code>attrs</code> like <code>{"brand": "Thiên Long", "color": "xanh", "tags": ["học sinh"]}</code>. Return <code>sku, name, color</code> of every <b>Thiên Long</b> product (color may be missing ⇒ NULL), ordered by sku.</p>',
    vi: '<p>Mỗi sản phẩm lưu <code>attrs</code> dạng <code>{"brand": "Thiên Long", "color": "xanh", "tags": ["học sinh"]}</code>. Trả về <code>sku, name, color</code> của mọi sản phẩm <b>Thiên Long</b> (thiếu màu ⇒ NULL), sắp theo sku.</p>',
    yc: [['Filter with <code>attrs @&gt; \'{"brand": "Thiên Long"}\'</code> or <code>attrs -&gt;&gt; \'brand\' = …</code>.', 'Lọc bằng <code>attrs @&gt; \'{"brand": "Thiên Long"}\'</code> hoặc <code>attrs -&gt;&gt; \'brand\' = …</code>.'], ['<code>color</code> as text.', '<code>color</code> dạng chữ.']],
    giai: `SELECT sku, name, attrs ->> 'color' AS color      -- missing key ⇒ NULL
FROM product
WHERE attrs @> '{"brand": "Thiên Long"}'            -- containment: indexable with GIN (chapter 13)
ORDER BY sku;`,
    kiem: [
      kq(['Four Thiên Long products', 'Bốn sản phẩm Thiên Long'], { thuTu: true }),
      kqAn(['A new Thiên Long product without colour', 'Sản phẩm Thiên Long mới chưa có màu'], "INSERT INTO product (sku, name, category_id, price, attrs) VALUES ('CT1103', 'Bộ thước ê-ke Thiên Long', 11, 18000, '{\"brand\": \"Thiên Long\"}')", { thuTu: true }),
      ma(['color read as text with ->>', 'color đọc thành chữ bằng ->>'], "->>\\s*'color'"),
    ],
    sai: ["SELECT sku, name, attrs ->> 'color' AS color FROM product WHERE attrs::text LIKE '%Thiên Long%' AND attrs ? 'color' ORDER BY sku", "SELECT sku, name, attrs -> 'color' AS color FROM product WHERE attrs @> '{\"brand\": \"Thiên Long\"}' ORDER BY sku"],
    gy: [['<code>-&gt;&gt; \'key\'</code> returns text; a missing key returns NULL, no error.', '<code>-&gt;&gt; \'key\'</code> trả chữ; khoá thiếu trả NULL, không lỗi.'], ['<code>a @&gt; b</code>: does document a contain document b?', '<code>a @&gt; b</code>: tài liệu a có chứa tài liệu b không?']],
    lhg: [['Searching <code>attrs::text LIKE</code> — slow, and it also matches the brand name appearing in any other key.', 'Tìm bằng <code>attrs::text LIKE</code> — chậm, và còn khớp khi tên hãng nằm ở khoá khác.'], ['Filtering out products without a color (<code>attrs ? \'color\'</code>) — the brief keeps them with NULL.', 'Loại sản phẩm không có màu (<code>attrs ? \'color\'</code>) — đề giữ chúng với NULL.']],
    gt: ['<p>jsonb lets products of different categories carry different attributes in one column. Containment (<code>@&gt;</code>) is the operator a GIN index accelerates; <code>-&gt;&gt;</code> extracts a value as text for display.</p>', '<p>jsonb cho sản phẩm khác danh mục mang thuộc tính khác nhau trong một cột. Phép chứa (<code>@&gt;</code>) là toán tử chỉ mục GIN tăng tốc; <code>-&gt;&gt;</code> lấy giá trị dạng chữ để hiển thị.</p>'],
    tn: [TN.jsonb, tn('@>', 'chứa')],
  }),

  pg({
    t: 'API keys with a uuid primary key', k: 'HARD', p: 10, kn: ['uuid', 'gen_random_uuid()', 'DEFAULT', 'REFERENCES'], tag: ['types', 'uuid', 'ddl', 'ctshop'],
    en: '<p>The mobile app needs API keys whose ids cannot be guessed. Create <code>api_key</code>: <code>id uuid</code> primary key generated by the database, <code>customer_id</code> (required, → customer), <code>label text NOT NULL</code>, <code>revoked boolean NOT NULL DEFAULT false</code>, <code>created_at timestamptz NOT NULL DEFAULT now()</code>.</p>',
    vi: '<p>App di động cần API key có id không đoán được. Tạo <code>api_key</code>: <code>id uuid</code> khoá chính do CSDL sinh, <code>customer_id</code> (bắt buộc, → customer), <code>label text NOT NULL</code>, <code>revoked boolean NOT NULL DEFAULT false</code>, <code>created_at timestamptz NOT NULL DEFAULT now()</code>.</p>',
    yc: [['<code>id uuid PRIMARY KEY DEFAULT gen_random_uuid()</code> (built in since PostgreSQL 13).', '<code>id uuid PRIMARY KEY DEFAULT gen_random_uuid()</code> (có sẵn từ PostgreSQL 13).'], ['An INSERT without id must work.', 'INSERT không ghi id phải chạy được.']],
    giai: `CREATE TABLE api_key (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),   -- random v4: 122 random bits
  customer_id  bigint NOT NULL REFERENCES customer(id),
  label        text NOT NULL,
  revoked      boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);`,
    kiem: [
      sau(['Two keys get two different version-4 uuids', 'Hai key nhận hai uuid phiên bản 4 khác nhau'], "INSERT INTO api_key (customer_id, label) VALUES (1, 'iPhone'), (1, 'iPad'); SELECT count(DISTINCT id) AS distinct_ids, bool_and(substr(id::text, 15, 1) = '4') AS v4, bool_and(NOT revoked) AS active FROM api_key"),
      chan(['A key for an unknown customer is rejected', 'Key của khách không tồn tại bị chặn'], "INSERT INTO api_key (customer_id, label) VALUES (999, 'x')", '23503'),
      chan(['A malformed id is rejected by the type', 'Id sai định dạng bị kiểu dữ liệu chặn'], "INSERT INTO api_key (id, customer_id, label) VALUES ('1234', 1, 'x')", '22P02'),
      chan(['The same id twice is rejected', 'Hai lần cùng id bị chặn'], "INSERT INTO api_key (id, customer_id, label) VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'x'), ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 'y')", '23505', { an: true }),
      sau(['id has type uuid', 'id có kiểu uuid'], "SELECT data_type FROM information_schema.columns WHERE table_name = 'api_key' AND column_name = 'id'", { an: true }),
    ],
    sai: ['CREATE TABLE api_key (id text PRIMARY KEY DEFAULT gen_random_uuid()::text, customer_id bigint NOT NULL REFERENCES customer(id), label text NOT NULL, revoked boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now())', 'CREATE TABLE api_key (id uuid PRIMARY KEY, customer_id bigint NOT NULL REFERENCES customer(id), label text NOT NULL, revoked boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now())'],
    gy: [['Type <code>uuid</code> + <code>DEFAULT gen_random_uuid()</code>.', 'Kiểu <code>uuid</code> + <code>DEFAULT gen_random_uuid()</code>.'], ['Do not store uuids as text: 36 bytes instead of 16, and no format check.', 'Đừng lưu uuid dạng text: 36 byte thay vì 16, lại không kiểm định dạng.']],
    lhg: [['<code>id text</code>: \'1234\' becomes a valid key id.', '<code>id text</code>: \'1234\' thành id hợp lệ.'], ['No DEFAULT: every client must invent the uuid itself, and one forgets.', 'Không DEFAULT: mọi client phải tự sinh uuid, và sẽ có client quên.']],
    gt: ['<p><code>uuid</code> is a 16-byte type that validates its input; <code>gen_random_uuid()</code> generates version-4 values in the database, so ids are unguessable and need no coordination between app servers.</p>', '<p><code>uuid</code> là kiểu 16 byte có kiểm định dạng đầu vào; <code>gen_random_uuid()</code> sinh giá trị phiên bản 4 ngay trong CSDL, nên id không đoán được và không cần phối hợp giữa các máy chủ app.</p>'],
    tn: [tn('uuid', 'định danh 128 bit'), tn('gen_random_uuid()', 'sinh uuid ngẫu nhiên v4')],
  }),
]);
