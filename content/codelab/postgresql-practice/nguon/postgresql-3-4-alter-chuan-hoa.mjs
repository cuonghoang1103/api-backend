/** PostgreSQL · 3.4 — Tiến hoá lược đồ: ALTER TABLE & chuẩn hoá. Bảng contact / orders_bad của bài. */
import { mod, pg, cs, q, sau, chan, duoc, ma, pre, tn } from './_chung.mjs';

const CONTACT = `CREATE TABLE contact (id int PRIMARY KEY, name text);
INSERT INTO contact VALUES (1, 'Cuong'), (2, 'Lan'), (3, 'Minh');`;
const BAD = `CREATE TABLE orders_bad (
  order_id      int PRIMARY KEY,
  customer_name text,
  customer_city text,
  product       text,
  amount        numeric(12,2)
);
INSERT INTO orders_bad VALUES
 (1, 'Cuong', 'Hanoi',  'Keyboard', 100),
 (2, 'Cuong', 'Hanoi',  'Mouse',     50),
 (3, 'Lan',   'Danang', 'Monitor',  300),
 (4, 'Minh',  'Hue',    'Cable',     15),
 (5, 'Lan',   'Danang', 'Webcam',    80);
CREATE TABLE customer (
  id   int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE,
  city text
);
CREATE TABLE orders (
  id          int PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customer(id),
  product     text NOT NULL,
  amount      numeric(12,2) NOT NULL CHECK (amount >= 0)
);`;

export default mod('postgresql-3-4-alter-chuan-hoa', '3.4 Evolving a schema: ALTER TABLE & normalization', [
  pg({
    t: 'Grow a table that already has rows', k: 'EASY', p: 8, kn: ['ADD COLUMN', 'SET NOT NULL', 'ADD CONSTRAINT … CHECK'], tag: ['ddl', 'alter'],
    csdl: CONTACT, tenCsdl: 'contact', ld: { en: pre('contact (id int PK, name text NULL) — 3 rows'), vi: pre('contact (id int PK, name text NULL) — 3 dòng') },
    en: '<p>Evolve <code>contact</code> without losing rows: add an optional <code>email text</code>; add <code>status text</code> that is required and starts as <code>active</code> for everyone; make <code>name</code> required; and allow only <code>active</code> / <code>archived</code> as status through a CHECK named <code>contact_status_chk</code>.</p>',
    vi: '<p>Nâng cấp <code>contact</code> mà không mất dòng: thêm <code>email text</code> không bắt buộc; thêm <code>status text</code> bắt buộc và mọi người bắt đầu là <code>active</code>; cho <code>name</code> thành bắt buộc; và chỉ cho status là <code>active</code> / <code>archived</code> bằng CHECK tên <code>contact_status_chk</code>.</p>',
    yc: [['Four ALTER TABLE statements (or one with four actions).', 'Bốn lệnh ALTER TABLE (hoặc một lệnh với bốn hành động).'], ['Existing rows end up with status <code>active</code>.', 'Dòng cũ kết thúc với status <code>active</code>.']],
    giai: `ALTER TABLE contact ADD COLUMN email text;                              -- nullable: instant
ALTER TABLE contact ADD COLUMN status text NOT NULL DEFAULT 'active';    -- the default fills old rows
ALTER TABLE contact ALTER COLUMN name SET NOT NULL;                      -- checks every row, then enforces
ALTER TABLE contact ADD CONSTRAINT contact_status_chk CHECK (status IN ('active', 'archived'));`,
    kiem: [
      sau(['Old rows: email NULL, status active', 'Dòng cũ: email NULL, status active'], 'SELECT id, name, email, status FROM contact ORDER BY id', { thuTu: true }),
      chan(['status = deleted is rejected', 'status = deleted bị chặn'], "UPDATE contact SET status = 'deleted' WHERE id = 1", '23514'),
      chan(['A contact without name is rejected', 'Liên hệ không tên bị chặn'], "INSERT INTO contact (id) VALUES (9)", '23502'),
      duoc(['Archiving is allowed', 'Lưu trữ thì được'], "UPDATE contact SET status = 'archived' WHERE id = 2"),
      chan(['status cannot be set to NULL', 'Không đặt được status = NULL'], "UPDATE contact SET status = NULL WHERE id = 1", '23502', { an: true }),
      sau(['Constraint name', 'Tên ràng buộc'], "SELECT conname FROM pg_constraint WHERE conrelid = 'contact'::regclass AND contype = 'c'", { an: true }),
    ],
    sai: ["ALTER TABLE contact ADD COLUMN email text; ALTER TABLE contact ADD COLUMN status text DEFAULT 'active'; ALTER TABLE contact ALTER COLUMN name SET NOT NULL; ALTER TABLE contact ADD CONSTRAINT contact_status_chk CHECK (status IN ('active', 'archived'));", "ALTER TABLE contact ADD COLUMN email text; ALTER TABLE contact ADD COLUMN status text NOT NULL DEFAULT 'active'; ALTER TABLE contact ADD CONSTRAINT contact_status_chk CHECK (status IN ('active', 'archived'));"],
    gy: [['<code>ADD COLUMN … NOT NULL DEFAULT \'active\'</code> works on a table with rows because the default fills them.', '<code>ADD COLUMN … NOT NULL DEFAULT \'active\'</code> chạy được trên bảng có dòng vì mặc định điền vào chúng.'], ['<code>ALTER COLUMN name SET NOT NULL</code> succeeds only if no row has a NULL name.', '<code>ALTER COLUMN name SET NOT NULL</code> chỉ thành công khi không dòng nào có name NULL.']],
    lhg: [['<code>ADD COLUMN phone text NOT NULL</code> with no default on a table with rows: <code>column "phone" contains null values</code>.', '<code>ADD COLUMN phone text NOT NULL</code> không mặc định trên bảng có dòng: <code>column "phone" contains null values</code>.'], ['Default without NOT NULL: an explicit NULL status can still be written.', 'Có mặc định mà thiếu NOT NULL: vẫn ghi được status NULL tường minh.']],
    gt: ['<p>Since PostgreSQL 11, ADD COLUMN with a constant default is instant (no rewrite). SET NOT NULL and ADD CONSTRAINT CHECK scan the table once to prove existing rows comply, then enforce the rule forever.</p>', '<p>Từ PostgreSQL 11, ADD COLUMN với mặc định hằng là tức thì (không viết lại bảng). SET NOT NULL và ADD CONSTRAINT CHECK quét bảng một lần để chứng minh dòng cũ thoả, rồi áp luật mãi mãi.</p>'],
    tn: [tn('ALTER TABLE', 'sửa cấu trúc bảng')],
  }),

  pg({
    t: 'Add a required column the safe way: add, backfill, enforce', k: 'MEDIUM', p: 10, kn: ['expand → backfill → contract', 'UPDATE backfill', 'SET NOT NULL'], tag: ['ddl', 'alter', 'migration'],
    csdl: CONTACT, tenCsdl: 'contact', ld: { en: pre('contact (id int PK, name text) — 1 Cuong, 2 Lan, 3 Minh'), vi: pre('contact (id int PK, name text) — 1 Cuong, 2 Lan, 3 Minh') },
    en: `<p>Every contact now needs a <code>phone</code>. Support already collected two numbers: Cuong <code>0901000001</code>, Lan <code>0902000002</code>; Minh has none yet and must get the placeholder <code>unknown</code>. Afterwards new contacts must not be created without a phone, and there must be <b>no</b> default (a forgotten phone should fail loudly). <code>ALTER TABLE contact ADD COLUMN phone text NOT NULL</code> fails on a table with rows — do it in steps.</p>`,
    vi: `<p>Mọi liên hệ giờ cần <code>phone</code>. Bộ phận hỗ trợ đã có hai số: Cuong <code>0901000001</code>, Lan <code>0902000002</code>; Minh chưa có và nhận giá trị tạm <code>unknown</code>. Sau đó không được tạo liên hệ mới thiếu số, và <b>không</b> có mặc định (quên số phải lỗi rõ ràng). <code>ALTER TABLE contact ADD COLUMN phone text NOT NULL</code> lỗi trên bảng có dòng — làm theo từng bước.</p>`,
    yc: [['1) ADD COLUMN phone text (nullable) · 2) UPDATE the rows · 3) SET NOT NULL.', '1) ADD COLUMN phone text (cho phép NULL) · 2) UPDATE các dòng · 3) SET NOT NULL.'], ['No DEFAULT left on the column at the end.', 'Cuối cùng cột không còn DEFAULT.']],
    giai: `ALTER TABLE contact ADD COLUMN phone text;                       -- expand: nullable, instant
UPDATE contact SET phone = CASE id WHEN 1 THEN '0901000001'
                                   WHEN 2 THEN '0902000002' END;  -- backfill what we know
UPDATE contact SET phone = 'unknown' WHERE phone IS NULL;           -- placeholder for the rest
ALTER TABLE contact ALTER COLUMN phone SET NOT NULL;                -- contract: enforce from now on`,
    kiem: [
      sau(['Phones after the migration', 'Số điện thoại sau migration'], 'SELECT id, name, phone FROM contact ORDER BY id', { thuTu: true }),
      chan(['A new contact without phone fails loudly', 'Liên hệ mới thiếu số lỗi rõ ràng'], "INSERT INTO contact (id, name) VALUES (9, 'Hoa')", '23502'),
      sau(['No default on phone', 'Cột phone không có mặc định'], "SELECT column_default IS NULL AS no_default, is_nullable FROM information_schema.columns WHERE table_name = 'contact' AND column_name = 'phone'"),
      sau(['Works when there are more contacts', 'Đúng khi có thêm liên hệ'], "SELECT count(*) FILTER (WHERE phone = 'unknown') AS unknown_phones FROM contact", { an: true, themCsdl: "INSERT INTO contact VALUES (4, 'Hoa'), (5, 'Khoa')" }),
    ],
    sai: ["ALTER TABLE contact ADD COLUMN phone text NOT NULL DEFAULT 'unknown'; UPDATE contact SET phone = '0901000001' WHERE id = 1; UPDATE contact SET phone = '0902000002' WHERE id = 2;", "ALTER TABLE contact ADD COLUMN phone text; UPDATE contact SET phone = CASE id WHEN 1 THEN '0901000001' WHEN 2 THEN '0902000002' END; ALTER TABLE contact ALTER COLUMN phone SET NOT NULL;"],
    gy: [['Expand first (nullable column), contract last (NOT NULL).', 'Mở rộng trước (cột cho phép NULL), siết lại sau cùng (NOT NULL).'], ['Fill the unknown rows with <code>WHERE phone IS NULL</code>.', 'Điền dòng chưa biết bằng <code>WHERE phone IS NULL</code>.']],
    lhg: [['Adding <code>NOT NULL DEFAULT \'unknown\'</code>: it works, but the default stays and every future contact silently gets "unknown".', 'Thêm <code>NOT NULL DEFAULT \'unknown\'</code>: chạy được, nhưng mặc định ở lại và mọi liên hệ sau này lặng lẽ nhận "unknown".'], ['SET NOT NULL before the backfill is complete: <code>column "phone" contains null values</code>.', 'SET NOT NULL khi chưa điền xong: <code>column "phone" contains null values</code>.']],
    gt: ['<p>The expand → backfill → contract pattern is how production migrations add required data: each step is valid on its own, and the final constraint only goes on once the data obeys it. Chapter 16 uses the same pattern with Prisma.</p>', '<p>Mẫu mở rộng → điền dữ liệu → siết lại là cách migration trên production thêm dữ liệu bắt buộc: mỗi bước tự hợp lệ, và ràng buộc cuối chỉ được đặt khi dữ liệu đã tuân theo. Chương 16 dùng lại mẫu này với Prisma.</p>'],
    tn: [tn('backfill', 'điền dữ liệu cho dòng cũ'), tn('expand / contract', 'mở rộng / siết lại')],
  }),

  pg({
    t: 'Normalize orders_bad into customer + orders', k: 'HARD', p: 15, kn: ['INSERT … SELECT DISTINCT', 'join back to get ids', 'update anomaly'], tag: ['normalization', 'dml'],
    csdl: BAD, tenCsdl: 'orders_bad', ld: { en: pre(`orders_bad (order_id PK, customer_name, customer_city, product, amount) — 5 rows, customers repeated
customer (id identity PK, name UNIQUE, city)            — empty
orders   (id PK, customer_id → customer, product, amount) — empty`), vi: pre(`orders_bad (order_id PK, customer_name, customer_city, product, amount) — 5 dòng, khách lặp lại
customer (id identity PK, name UNIQUE, city)            — rỗng
orders   (id PK, customer_id → customer, product, amount) — rỗng`) },
    en: '<p>The old table repeats each customer\'s city on every order — the update anomaly of lesson 3.4. Move the data into the normalized tables (already created, empty): one row per customer in <code>customer</code> (name, city), then every order in <code>orders</code> with the same id, pointing at its customer\'s new id.</p>',
    vi: '<p>Bảng cũ lặp thành phố của khách trên mọi đơn — dị thường cập nhật của bài 3.4. Chuyển dữ liệu sang các bảng đã chuẩn hoá (đã tạo sẵn, đang rỗng): mỗi khách một dòng trong <code>customer</code> (name, city), rồi mọi đơn vào <code>orders</code> giữ nguyên id, trỏ tới id mới của khách.</p>',
    yc: [['<code>INSERT INTO customer (name, city) SELECT DISTINCT … FROM orders_bad</code>.', '<code>INSERT INTO customer (name, city) SELECT DISTINCT … FROM orders_bad</code>.'], ['<code>INSERT INTO orders … SELECT … FROM orders_bad JOIN customer ON customer.name = orders_bad.customer_name</code> — never hard-code ids.', '<code>INSERT INTO orders … SELECT … FROM orders_bad JOIN customer ON customer.name = orders_bad.customer_name</code> — không ghi cứng id.']],
    giai: `INSERT INTO customer (name, city)
SELECT DISTINCT customer_name, customer_city      -- one fact, one place
FROM orders_bad
ORDER BY customer_name;

INSERT INTO orders (id, customer_id, product, amount)
SELECT b.order_id, c.id, b.product, b.amount
FROM orders_bad b
JOIN customer c ON c.name = b.customer_name;      -- look the new id up, do not guess it`,
    kiem: [
      sau(['Three customers, each once', 'Ba khách, mỗi người một lần'], 'SELECT name, city FROM customer ORDER BY name', { thuTu: true }),
      sau(['Every order points at the right customer', 'Mọi đơn trỏ đúng khách'], 'SELECT o.id, c.name, o.product, o.amount FROM orders o JOIN customer c ON c.id = o.customer_id ORDER BY o.id', { thuTu: true }),
      sau(['Now a move to Saigon is ONE update', 'Giờ chuyển nhà vào Sài Gòn chỉ là MỘT lệnh cập nhật'], "UPDATE customer SET city = 'Saigon' WHERE name = 'Cuong'; SELECT o.id, c.city FROM orders o JOIN customer c ON c.id = o.customer_id WHERE c.name = 'Cuong' ORDER BY o.id", { thuTu: true }),
      sau(['Works with more customers', 'Đúng khi có thêm khách'], 'SELECT count(*) AS customers, (SELECT count(*) FROM orders) AS orders FROM customer', { an: true, themCsdl: "INSERT INTO orders_bad VALUES (6, 'Hoa', 'Hanoi', 'Pen', 5), (7, 'Hoa', 'Hanoi', 'Ink', 7)" }),
    ],
    sai: ["INSERT INTO customer (name, city) SELECT customer_name, customer_city FROM orders_bad; INSERT INTO orders (id, customer_id, product, amount) SELECT b.order_id, c.id, b.product, b.amount FROM orders_bad b JOIN customer c ON c.name = b.customer_name;", "INSERT INTO customer (name, city) SELECT DISTINCT customer_name, customer_city FROM orders_bad ORDER BY customer_name; INSERT INTO orders (id, customer_id, product, amount) SELECT order_id, order_id, product, amount FROM orders_bad WHERE order_id <= 3;"],
    gy: [['First the parent rows (customer), then the children (orders) — the foreign key needs that order.', 'Dòng cha (customer) trước, dòng con (orders) sau — khoá ngoại cần đúng thứ tự đó.'], ['Find each order\'s customer id by joining on the name you just inserted.', 'Tìm id khách của mỗi đơn bằng cách nối theo tên vừa chèn.']],
    lhg: [['Forgetting DISTINCT: the UNIQUE on name rejects the second "Cuong" and the whole statement fails.', 'Quên DISTINCT: UNIQUE trên name chặn "Cuong" thứ hai và cả lệnh hỏng.'], ['Guessing customer ids from order ids — orders end up assigned to the wrong people.', 'Đoán id khách từ id đơn — đơn bị gán nhầm người.']],
    gt: ['<p>Normalizing means each fact (where a customer lives) is stored once. INSERT … SELECT DISTINCT builds the parent table from the repeated data; joining back on the natural attribute (name) maps every old row to the new surrogate id.</p>', '<p>Chuẩn hoá nghĩa là mỗi sự kiện (khách sống ở đâu) chỉ lưu một lần. INSERT … SELECT DISTINCT dựng bảng cha từ dữ liệu lặp; nối ngược theo thuộc tính tự nhiên (tên) ánh xạ mỗi dòng cũ sang id thay thế mới.</p>'],
    tn: [tn('normalization', 'chuẩn hoá'), tn('update anomaly', 'dị thường cập nhật')],
  }),

  cs({
    t: 'Which ALTER is instant, which rewrites, which scans?', k: 'MEDIUM', p: 5, kn: ['table rewrite', 'ACCESS EXCLUSIVE lock'], tag: ['alter', 'locks'],
    en: '<p>On a 50-million-row table, these statements cost very different amounts of downtime. Pick the right description (PostgreSQL 11+).</p>',
    vi: '<p>Trên bảng 50 triệu dòng, các lệnh này tốn thời gian ngừng rất khác nhau. Chọn mô tả đúng (PostgreSQL 11+).</p>',
    cau: [
      q('q1', ['<code>ALTER TABLE t ADD COLUMN note text;</code>', '<code>ALTER TABLE t ADD COLUMN note text;</code>'], ['instant — only the catalog changes', 'rewrites every row', 'scans every row to check NULLs', 'impossible on a non-empty table'], ['A nullable column without default is metadata only; old rows simply read NULL.', 'Cột cho phép NULL không mặc định chỉ đổi metadata; dòng cũ đọc ra NULL.']),
      q('q2', ['<code>ALTER TABLE t ADD COLUMN status text NOT NULL DEFAULT \'active\';</code>', '<code>ALTER TABLE t ADD COLUMN status text NOT NULL DEFAULT \'active\';</code>'], ['instant — a constant default is stored once in the catalog', 'rewrites the table to write \'active\' into each row', 'fails because rows exist', 'scans the table but does not rewrite it'], ['Since PostgreSQL 11 a non-volatile default is remembered in pg_attribute and returned for old rows without touching them.', 'Từ PostgreSQL 11, mặc định không biến động được ghi một lần trong pg_attribute và trả cho dòng cũ mà không đụng tới chúng.']),
      q('q3', ['<code>ALTER TABLE t ALTER COLUMN price TYPE numeric(14,2);</code> (was numeric(12,2))', '<code>ALTER TABLE t ALTER COLUMN price TYPE numeric(14,2);</code> (trước là numeric(12,2))'], ['instant in modern PostgreSQL — widening numeric precision needs no rewrite', 'always a full rewrite', 'impossible', 'only changes new rows'], ['Some type changes are binary-compatible (varchar(n) → text, widening numeric) and skip the rewrite; others (int → bigint, text → int) rewrite the table under an exclusive lock.', 'Một số đổi kiểu tương thích nhị phân (varchar(n) → text, nới numeric) nên bỏ qua việc viết lại; số khác (int → bigint, text → int) viết lại cả bảng dưới khoá độc quyền.']),
      q('q4', ['<code>ALTER TABLE t ALTER COLUMN email SET NOT NULL;</code>', '<code>ALTER TABLE t ALTER COLUMN email SET NOT NULL;</code>'], ['scans the whole table under an exclusive lock (unless a validated CHECK already proves it)', 'instant', 'rewrites every row', 'locks nothing'], ['PostgreSQL must prove no NULL exists. The trick from lesson 3.4: add CHECK (email IS NOT NULL) NOT VALID, VALIDATE it (weaker lock), then SET NOT NULL uses it and skips the scan.', 'PostgreSQL phải chứng minh không có NULL. Mẹo của bài 3.4: thêm CHECK (email IS NOT NULL) NOT VALID, VALIDATE nó (khoá nhẹ hơn), rồi SET NOT NULL dùng nó và bỏ qua lượt quét.']),
    ],
    gy: [['Ask: does every existing row need to change, or only be checked, or neither?', 'Tự hỏi: mọi dòng cũ phải đổi, hay chỉ cần kiểm, hay không cần gì?'], ['Catalog-only changes are instant.', 'Thay đổi chỉ trong catalog là tức thì.']],
    lhg: [['Running ALTER COLUMN TYPE int → bigint on a big table at peak hour — the table is locked for the whole rewrite.', 'Chạy ALTER COLUMN TYPE int → bigint trên bảng lớn giờ cao điểm — bảng bị khoá suốt lúc viết lại.'], ['Believing every ADD COLUMN with DEFAULT rewrites the table (true only before PostgreSQL 11 or with volatile defaults like random()).', 'Tin rằng mọi ADD COLUMN có DEFAULT đều viết lại bảng (chỉ đúng trước PostgreSQL 11 hoặc với mặc định biến động như random()).']],
    tn: [tn('table rewrite', 'viết lại bảng'), tn('ACCESS EXCLUSIVE', 'khoá độc quyền, chặn cả đọc')],
  }),
]);
