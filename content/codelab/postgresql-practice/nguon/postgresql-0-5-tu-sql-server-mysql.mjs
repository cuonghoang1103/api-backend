/**
 * PostgreSQL · 0.5 — Từ SQL Server / MySQL sang PostgreSQL. CSDL `ctmini` của bài (product + customer). Mỗi đề cho một
 * câu T-SQL / MySQL đang chạy ở hệ cũ — người học viết lại bằng PostgreSQL; máy chấm là PostgreSQL thật nên cú pháp
 * T-SQL bị chính PostgreSQL từ chối (kèm gợi ý goiYTsqlChoPg).
 */
import { mod, pg, kq, kqAn, sau, ma, pre, TN, tn } from './_chung.mjs';

export const CTMINI = `CREATE TABLE product (
  id         int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku        text          NOT NULL UNIQUE,
  name       text          NOT NULL,
  price      numeric(12,2) NOT NULL,
  stock      int           NOT NULL DEFAULT 0,
  is_active  boolean       NOT NULL DEFAULT true,
  created_at timestamptz   NOT NULL DEFAULT now()
);
INSERT INTO product (sku, name, price, stock, is_active) VALUES
 ('BUT-01',   'Bút bi Thiên Long',      5000, 120, true),
 ('VO-02',    'Vở kẻ ngang 200 trang', 18000,  40, true),
 ('THUOC-03', 'Thước kẻ 30cm',          7000,   0, false),
 ('BALO-04',  'Balo chống gù',        450000,   8, true),
 ('MAY-05',   'Máy tính Casio fx-580',690000,  15, true);
CREATE TABLE customer (
  id        int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email     text NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone     text
);
INSERT INTO customer (email, full_name, phone) VALUES
 ('an@ctshop.vn',  'Nguyễn Văn An', '0901000001'),
 ('binh@ctshop.vn','Trần Thị Bình', NULL),
 ('chi@ctshop.vn', 'Lê Minh Chi',   '');`;

const LD = {
  en: `<h4>Sample database: ctmini (lesson 0.5)</h4>${pre(`product  (id identity PK, sku UNIQUE, name, price numeric(12,2), stock int DEFAULT 0, is_active boolean DEFAULT true, created_at)
         5 rows: BUT-01, VO-02, THUOC-03 (inactive, stock 0), BALO-04, MAY-05
customer (id identity PK, email UNIQUE, full_name, phone — NULL for Bình, '' (empty string) for Chi)`)}<p>Full script: the <code>ctmini.sql</code> tab.</p>`,
  vi: `<h4>CSDL mẫu: ctmini (bài 0.5)</h4>${pre(`product  (id identity PK, sku UNIQUE, name, price numeric(12,2), stock int DEFAULT 0, is_active boolean DEFAULT true, created_at)
         5 dòng: BUT-01, VO-02, THUOC-03 (ngừng bán, tồn 0), BALO-04, MAY-05
customer (id identity PK, email UNIQUE, full_name, phone — NULL với Bình, '' (chuỗi rỗng) với Chi)`)}<p>Script đầy đủ: tab <code>ctmini.sql</code>.</p>`,
};
const O = { csdl: CTMINI, tenCsdl: 'ctmini', ld: LD };
const PORT = ['port', 'tsql', 'mysql'];

export default mod('postgresql-0-5-tu-sql-server-mysql', '0.5 From SQL Server / MySQL to PostgreSQL', [
  pg({
    ...O, t: 'TOP 3 becomes LIMIT 3', k: 'EASY', p: 5,
    kn: ['LIMIT', 'boolean WHERE'], tag: PORT,
    en: `<p>This query ran on SQL Server:</p>${pre(`SELECT TOP 3 sku, price
FROM product
WHERE is_active = 1
ORDER BY price DESC;`)}<p>Rewrite it for PostgreSQL: the three most expensive <b>active</b> products, <code>sku, price</code>, most expensive first.</p>`,
    vi: `<p>Câu này chạy trên SQL Server:</p>${pre(`SELECT TOP 3 sku, price
FROM product
WHERE is_active = 1
ORDER BY price DESC;`)}<p>Viết lại cho PostgreSQL: ba sản phẩm <b>đang bán</b> đắt nhất, <code>sku, price</code>, đắt nhất trước.</p>`,
    yc: [['No <code>TOP</code>; use <code>LIMIT</code>.', 'Không dùng <code>TOP</code>; dùng <code>LIMIT</code>.'], ['<code>is_active</code> is a real boolean in PostgreSQL — compare it like one.', '<code>is_active</code> là boolean thật trong PostgreSQL — so sánh đúng kiểu boolean.']],
    giai: `SELECT sku, price
FROM product
WHERE is_active              -- boolean: no "= 1"
ORDER BY price DESC
LIMIT 3;                     -- T-SQL TOP 3`,
    kiem: [
      kq(['MAY-05, BALO-04, VO-02 in that order', 'MAY-05, BALO-04, VO-02 đúng thứ tự'], { thuTu: true }),
      kqAn(['An expensive but inactive product stays out', 'Sản phẩm đắt nhưng ngừng bán không lọt vào'], "INSERT INTO product (sku, name, price, stock, is_active) VALUES ('LAP-06', 'Laptop cũ', 9000000, 1, false)", { thuTu: true }),
      ma(['Uses LIMIT', 'Dùng LIMIT'], '\\bLIMIT\\s+3\\b'),
    ],
    sai: ['SELECT TOP 3 sku, price FROM product WHERE is_active = 1 ORDER BY price DESC', 'SELECT sku, price FROM product ORDER BY price DESC LIMIT 3'],
    gy: [['Move the row limit to the end: <code>… ORDER BY price DESC LIMIT 3</code>.', 'Dời giới hạn dòng xuống cuối: <code>… ORDER BY price DESC LIMIT 3</code>.'], ['<code>WHERE is_active</code> (or <code>= true</code>); <code>= 1</code> compares boolean with integer and fails.', '<code>WHERE is_active</code> (hoặc <code>= true</code>); <code>= 1</code> so boolean với số nguyên và báo lỗi.']],
    lhg: [['Keeping <code>is_active = 1</code> — PostgreSQL: "operator does not exist: boolean = integer".', 'Giữ <code>is_active = 1</code> — PostgreSQL: "operator does not exist: boolean = integer".'], ['Dropping the WHERE while porting — the inactive THUOC-03 (or any expensive inactive item) sneaks in.', 'Bỏ mất WHERE khi chuyển — THUOC-03 ngừng bán (hay món đắt đã ngừng bán) lọt vào.']],
    gt: ['<p>PostgreSQL spells the row limit <code>LIMIT n</code> (or the standard <code>FETCH FIRST n ROWS ONLY</code>) after ORDER BY, and a boolean column is a condition by itself.</p>', '<p>PostgreSQL viết giới hạn dòng là <code>LIMIT n</code> (hoặc chuẩn <code>FETCH FIRST n ROWS ONLY</code>) sau ORDER BY, và cột boolean tự nó đã là điều kiện.</p>'],
    tn: [TN.limit],
  }),

  pg({
    ...O, t: 'ISNULL and + become COALESCE and ||', k: 'EASY', p: 7,
    kn: ['COALESCE', 'NULLIF', '|| concatenation'], tag: PORT,
    en: `<p>The customer list in SQL Server:</p>${pre(`SELECT full_name + N' <' + email + N'>' AS contact,
       ISNULL(NULLIF(phone, N''), N'no phone') AS phone
FROM customer
ORDER BY id;`)}<p>Port it. <code>contact</code> looks like <code>Nguyễn Văn An &lt;an@ctshop.vn&gt;</code>; a missing phone — NULL <b>or</b> an empty string — shows <code>no phone</code>.</p>`,
    vi: `<p>Danh sách khách trên SQL Server:</p>${pre(`SELECT full_name + N' <' + email + N'>' AS contact,
       ISNULL(NULLIF(phone, N''), N'no phone') AS phone
FROM customer
ORDER BY id;`)}<p>Chuyển sang PostgreSQL. <code>contact</code> có dạng <code>Nguyễn Văn An &lt;an@ctshop.vn&gt;</code>; số điện thoại thiếu — NULL <b>hoặc</b> chuỗi rỗng — hiện <code>no phone</code>.</p>`,
    yc: [['Concatenate with <code>||</code>; replace ISNULL with COALESCE.', 'Nối chuỗi bằng <code>||</code>; thay ISNULL bằng COALESCE.'], ['Columns <code>contact, phone</code>, ordered by id.', 'Cột <code>contact, phone</code>, sắp theo id.']],
    giai: `SELECT full_name || ' <' || email || '>'          AS contact,
       COALESCE(NULLIF(phone, ''), 'no phone')     AS phone   -- '' → NULL → 'no phone'
FROM customer
ORDER BY id;`,
    kiem: [
      kq(['Three contacts, Bình and Chi without phone', 'Ba liên hệ, Bình và Chi không có số'], { thuTu: true }),
      kqAn(['A phone made of spaces is still a phone (only exactly empty is missing)', 'Số chỉ gồm dấu cách vẫn là số (chỉ đúng chuỗi rỗng mới là thiếu)'], "INSERT INTO customer (email, full_name, phone) VALUES ('dung@ctshop.vn', 'Phạm Dũng', '0988000004')", { thuTu: true }),
      ma(['Uses COALESCE', 'Dùng COALESCE'], '\\bCOALESCE\\s*\\('),
    ],
    sai: ["SELECT full_name || ' <' || email || '>' AS contact, COALESCE(phone, 'no phone') AS phone FROM customer ORDER BY id", "SELECT concat(full_name, ' <', email, '>') AS contact, ISNULL(NULLIF(phone, ''), 'no phone') AS phone FROM customer ORDER BY id"],
    gy: [['<code>a || b</code> concatenates text; <code>COALESCE(x, y)</code> returns the first non-NULL.', '<code>a || b</code> nối chữ; <code>COALESCE(x, y)</code> trả giá trị khác NULL đầu tiên.'], ['Turn the empty string into NULL first: <code>NULLIF(phone, \'\')</code>.', 'Biến chuỗi rỗng thành NULL trước: <code>NULLIF(phone, \'\')</code>.']],
    lhg: [['<code>COALESCE(phone, \'no phone\')</code> alone — Chi\'s empty string is not NULL and shows as an empty phone.', 'Chỉ <code>COALESCE(phone, \'no phone\')</code> — chuỗi rỗng của Chi không phải NULL nên hiện số trống.'], ['Keeping <code>ISNULL(…)</code> — PostgreSQL has no such function (it has the <code>IS NULL</code> test).', 'Giữ <code>ISNULL(…)</code> — PostgreSQL không có hàm này (chỉ có phép thử <code>IS NULL</code>).']],
    gt: ['<p>PostgreSQL follows the standard: <code>||</code> joins strings and <code>COALESCE</code> picks the first non-NULL argument. An empty string is a real value, not NULL — <code>NULLIF</code> converts it before COALESCE.</p>', '<p>PostgreSQL theo chuẩn: <code>||</code> nối chuỗi, <code>COALESCE</code> lấy đối số khác NULL đầu tiên. Chuỗi rỗng là giá trị thật, không phải NULL — <code>NULLIF</code> đổi nó trước khi COALESCE.</p>'],
    tn: [tn('COALESCE', 'giá trị khác NULL đầu tiên'), tn('NULLIF(a, b)', 'NULL nếu a = b')],
  }),

  pg({
    ...O, t: 'OUTPUT becomes RETURNING', k: 'MEDIUM', p: 8,
    kn: ['UPDATE … RETURNING', 'boolean'], tag: PORT,
    en: `<p>A nightly job on SQL Server switches off every product that is out of stock and logs which ones it touched:</p>${pre(`UPDATE product
SET is_active = 0
OUTPUT inserted.sku, inserted.is_active
WHERE stock = 0 AND is_active = 1;`)}<p>Write the PostgreSQL version — only port the statement. (In the sample data THUOC-03 is already inactive; the checks add more sold-out products.)</p>`,
    vi: `<p>Một job ban đêm trên SQL Server tắt mọi sản phẩm hết hàng và ghi lại những món nó đã đụng tới:</p>${pre(`UPDATE product
SET is_active = 0
OUTPUT inserted.sku, inserted.is_active
WHERE stock = 0 AND is_active = 1;`)}<p>Viết bản PostgreSQL — chỉ chuyển câu lệnh. (Trong dữ liệu mẫu THUOC-03 đã tắt sẵn; các kiểm thêm sản phẩm hết hàng khác.)</p>`,
    yc: [['One UPDATE ending with <code>RETURNING sku, is_active</code>.', 'Một lệnh UPDATE kết thúc bằng <code>RETURNING sku, is_active</code>.'], ['Only rows that are out of stock AND still active are changed.', 'Chỉ đổi dòng hết hàng VÀ còn đang bán.']],
    giai: `UPDATE product
SET is_active = false
WHERE stock = 0 AND is_active
RETURNING sku, is_active;      -- T-SQL: OUTPUT inserted.sku, inserted.is_active`,
    kiem: [
      sau(['Products after the job', 'Sản phẩm sau job'], 'SELECT sku, stock, is_active FROM product ORDER BY id', { thuTu: true, themCsdl: "UPDATE product SET stock = 0 WHERE sku = 'BALO-04'" }),
      kqAn(['RETURNING lists exactly the switched-off products', 'RETURNING liệt kê đúng các món vừa bị tắt'], "UPDATE product SET stock = 0 WHERE sku IN ('BALO-04', 'VO-02')"),
      ma(['Uses RETURNING', 'Dùng RETURNING'], '\\bRETURNING\\b'),
    ],
    sai: ['UPDATE product SET is_active = false WHERE stock = 0 RETURNING sku, is_active', 'UPDATE product SET is_active = false WHERE stock = 0 AND is_active'],
    gy: [['T-SQL <code>OUTPUT inserted.col</code> = PostgreSQL <code>RETURNING col</code>, placed at the very end.', 'T-SQL <code>OUTPUT inserted.col</code> = PostgreSQL <code>RETURNING col</code>, đặt ở cuối cùng.'], ['Booleans: <code>SET is_active = false</code>, <code>WHERE … AND is_active</code>.', 'Boolean: <code>SET is_active = false</code>, <code>WHERE … AND is_active</code>.']],
    lhg: [['Dropping <code>AND is_active</code>: rows that were already inactive are "touched" again and appear in the log.', 'Bỏ <code>AND is_active</code>: dòng đã tắt sẵn bị "đụng" lại và hiện trong nhật ký.'], ['Forgetting RETURNING — the job no longer knows what it changed.', 'Quên RETURNING — job không còn biết nó đã đổi gì.']],
    gt: ['<p><code>RETURNING</code> returns the new version of every row the UPDATE changed — the same idea as <code>OUTPUT inserted.*</code>, but written last.</p>', '<p><code>RETURNING</code> trả phiên bản mới của mọi dòng UPDATE đã đổi — cùng ý với <code>OUTPUT inserted.*</code>, nhưng viết ở cuối.</p>'],
    tn: [TN.returning],
  }),

  pg({
    ...O, t: 'MERGE / ON DUPLICATE KEY becomes ON CONFLICT', k: 'MEDIUM', p: 10,
    kn: ['INSERT … ON CONFLICT DO UPDATE', 'EXCLUDED'], tag: PORT,
    en: `<p>A delivery arrives: <b>30</b> more BUT-01 (Bút bi Thiên Long, 5000) and <b>10</b> of a new product <b>GOM-07</b> (Gôm tẩy, 3000). In MySQL the shop wrote:</p>${pre(`INSERT INTO product (sku, name, price, stock)
VALUES ('BUT-01', 'Bút bi Thiên Long', 5000, 30), ('GOM-07', 'Gôm tẩy', 3000, 10) AS s
ON DUPLICATE KEY UPDATE stock = product.stock + s.stock;`)}<p>Write ONE PostgreSQL statement that adds the delivered quantity to existing SKUs, creates new ones, and returns <code>sku, stock</code>.</p>`,
    vi: `<p>Một lô hàng về: thêm <b>30</b> cây BUT-01 (Bút bi Thiên Long, 5000) và <b>10</b> cục của sản phẩm mới <b>GOM-07</b> (Gôm tẩy, 3000). Ở MySQL cửa hàng viết:</p>${pre(`INSERT INTO product (sku, name, price, stock)
VALUES ('BUT-01', 'Bút bi Thiên Long', 5000, 30), ('GOM-07', 'Gôm tẩy', 3000, 10) AS s
ON DUPLICATE KEY UPDATE stock = product.stock + s.stock;`)}<p>Viết MỘT lệnh PostgreSQL cộng số giao vào SKU đã có, tạo SKU mới, và trả về <code>sku, stock</code>.</p>`,
    yc: [['<code>INSERT … ON CONFLICT (sku) DO UPDATE SET stock = … + EXCLUDED.stock</code>.', '<code>INSERT … ON CONFLICT (sku) DO UPDATE SET stock = … + EXCLUDED.stock</code>.'], ['End with <code>RETURNING sku, stock</code>.', 'Kết thúc bằng <code>RETURNING sku, stock</code>.']],
    giai: `INSERT INTO product (sku, name, price, stock)
VALUES ('BUT-01', 'Bút bi Thiên Long', 5000, 30),
       ('GOM-07', 'Gôm tẩy',           3000, 10)
ON CONFLICT (sku) DO UPDATE
   SET stock = product.stock + EXCLUDED.stock   -- EXCLUDED = the row you tried to insert
RETURNING sku, stock;`,
    kiem: [
      kq(['BUT-01 goes 120 → 150, GOM-07 is created with 10', 'BUT-01 từ 120 lên 150, GOM-07 được tạo với 10']),
      sau(['Stored stock and price', 'Tồn kho và giá đã lưu'], "SELECT sku, price, stock FROM product WHERE sku IN ('BUT-01', 'GOM-07') ORDER BY sku", { thuTu: true }),
      sau(['Adds to whatever is on the shelf now', 'Cộng vào số đang có trên kệ, không ghi đè'], "SELECT sku, stock FROM product WHERE sku = 'BUT-01'", { an: true, themCsdl: "UPDATE product SET stock = 7 WHERE sku = 'BUT-01'" }),
      ma(['Uses ON CONFLICT', 'Dùng ON CONFLICT'], '\\bON\\s+CONFLICT\\b'),
    ],
    sai: ["INSERT INTO product (sku, name, price, stock) VALUES ('BUT-01', 'Bút bi Thiên Long', 5000, 30), ('GOM-07', 'Gôm tẩy', 3000, 10) ON CONFLICT (sku) DO UPDATE SET stock = EXCLUDED.stock RETURNING sku, stock", "INSERT INTO product (sku, name, price, stock) VALUES ('BUT-01', 'Bút bi Thiên Long', 5000, 30), ('GOM-07', 'Gôm tẩy', 3000, 10) ON CONFLICT DO NOTHING RETURNING sku, stock"],
    gy: [['ON CONFLICT needs the unique column that decides "already there": <code>(sku)</code>.', 'ON CONFLICT cần cột unique quyết định "đã có": <code>(sku)</code>.'], ['MySQL\'s alias <code>s</code> is PostgreSQL\'s <code>EXCLUDED</code>; the current row is <code>product.stock</code>.', 'Bí danh <code>s</code> của MySQL là <code>EXCLUDED</code> của PostgreSQL; dòng hiện có là <code>product.stock</code>.']],
    lhg: [['<code>SET stock = EXCLUDED.stock</code> overwrites 120 pens with 30.', '<code>SET stock = EXCLUDED.stock</code> ghi đè 120 cây bút thành 30.'], ['<code>DO NOTHING</code> silently ignores the delivery for existing products.', '<code>DO NOTHING</code> lặng lẽ bỏ qua lô hàng của sản phẩm đã có.']],
    gt: ['<p>For each row PostgreSQL tries the INSERT; if the UNIQUE index on sku already has the value, it runs DO UPDATE on the existing row instead. One statement, atomic, no race between "check" and "insert".</p>', '<p>Với từng dòng PostgreSQL thử INSERT; nếu chỉ mục UNIQUE trên sku đã có giá trị đó thì chạy DO UPDATE trên dòng cũ. Một lệnh, nguyên tử, không có khe hở giữa "kiểm" và "chèn".</p>'],
    tn: [TN.upsert, TN.excluded],
  }),

  pg({
    ...O, t: 'UPDATE … ORDER BY … LIMIT 1 the PostgreSQL way', k: 'MEDIUM', p: 10,
    kn: ['UPDATE with a subquery', 'ORDER BY … LIMIT in a subquery', 'RETURNING'], tag: PORT,
    en: `<p>A promotion gives away ONE unit of the most expensive product that is still in stock. MySQL allows:</p>${pre(`UPDATE product SET stock = stock - 1
WHERE stock > 0
ORDER BY price DESC
LIMIT 1;`)}<p>PostgreSQL has no ORDER BY / LIMIT on UPDATE. Write the PostgreSQL statement that takes one unit from that product and returns <code>sku, stock</code>.</p>`,
    vi: `<p>Một khuyến mãi tặng MỘT đơn vị của sản phẩm đắt nhất còn hàng. MySQL cho phép:</p>${pre(`UPDATE product SET stock = stock - 1
WHERE stock > 0
ORDER BY price DESC
LIMIT 1;`)}<p>PostgreSQL không có ORDER BY / LIMIT trong UPDATE. Viết lệnh PostgreSQL lấy một đơn vị của sản phẩm đó và trả về <code>sku, stock</code>.</p>`,
    yc: [['Pick the row in a subquery: <code>WHERE id = (SELECT id … ORDER BY price DESC LIMIT 1)</code>.', 'Chọn dòng bằng truy vấn con: <code>WHERE id = (SELECT id … ORDER BY price DESC LIMIT 1)</code>.'], ['Exactly one row changes; finish with <code>RETURNING sku, stock</code>.', 'Đúng một dòng bị đổi; kết thúc bằng <code>RETURNING sku, stock</code>.']],
    giai: `UPDATE product
SET stock = stock - 1
WHERE id = (SELECT id
            FROM product
            WHERE stock > 0
            ORDER BY price DESC, id      -- id breaks a tie in price
            LIMIT 1)
RETURNING sku, stock;`,
    kiem: [
      kq(['MAY-05 goes from 15 to 14', 'MAY-05 từ 15 xuống 14']),
      sau(['No other product changed', 'Không sản phẩm nào khác bị đổi'], 'SELECT sku, stock FROM product ORDER BY id', { thuTu: true }),
      kqAn(['When the priciest item is sold out, the next one in stock is chosen', 'Khi món đắt nhất hết hàng thì chọn món kế tiếp còn hàng'], "UPDATE product SET stock = 0 WHERE sku = 'MAY-05'"),
      ma(['Uses a LIMIT 1 subquery', 'Dùng truy vấn con LIMIT 1'], '\\(\\s*SELECT[\\s\\S]*LIMIT\\s+1[\\s\\S]*\\)'),
    ],
    sai: ['UPDATE product SET stock = stock - 1 WHERE id = (SELECT id FROM product ORDER BY price DESC LIMIT 1) RETURNING sku, stock', 'UPDATE product SET stock = stock - 1 WHERE stock > 0 RETURNING sku, stock'],
    gy: [['Find the id first: <code>SELECT id FROM product WHERE stock &gt; 0 ORDER BY price DESC LIMIT 1</code>.', 'Tìm id trước: <code>SELECT id FROM product WHERE stock &gt; 0 ORDER BY price DESC LIMIT 1</code>.'], ['Then <code>UPDATE … WHERE id = (that subquery)</code>.', 'Rồi <code>UPDATE … WHERE id = (truy vấn con đó)</code>.']],
    lhg: [['Forgetting <code>stock &gt; 0</code> inside the subquery — once MAY-05 is sold out, its stock goes to −1 and the CHECK… there is none here, so it silently goes negative.', 'Quên <code>stock &gt; 0</code> trong truy vấn con — khi MAY-05 hết hàng, tồn kho thành −1 (bảng này không có CHECK nên âm lặng lẽ).'], ['Dropping the subquery: every in-stock product loses one unit.', 'Bỏ truy vấn con: mọi sản phẩm còn hàng đều mất một đơn vị.']],
    gt: ['<p>The subquery chooses exactly one id with the ordering you want; the outer UPDATE touches only that row. The hidden check sells out MAY-05 to prove the choice is computed, not hard-coded.</p>', '<p>Truy vấn con chọn đúng một id theo thứ tự bạn muốn; UPDATE ngoài chỉ đụng dòng đó. Kiểm ẩn cho MAY-05 hết hàng để chứng minh lựa chọn được tính, không chép cứng.</p>'],
    tn: [TN.returning, tn('subquery', 'truy vấn con')],
  }),

  pg({
    ...O, t: 'A T-SQL procedure becomes a PL/pgSQL function', k: 'HARD', p: 15,
    kn: ['CREATE FUNCTION', 'LANGUAGE plpgsql', 'SELECT … INTO', 'COALESCE on aggregates'], tag: [...PORT, 'plpgsql'],
    en: `<p>The SQL Server shop had this procedure:</p>${pre(`CREATE PROCEDURE dbo.stock_value @min_price DECIMAL(12,2)
AS
BEGIN
  DECLARE @total DECIMAL(18,2);
  SELECT @total = SUM(price * stock) FROM product WHERE price >= @min_price AND is_active = 1;
  SELECT ISNULL(@total, 0) AS total;
END;`)}<p>Create the PostgreSQL function <code>stock_value(min_price numeric) RETURNS numeric</code> in PL/pgSQL: the value of the stock of <b>active</b> products whose price is at least <code>min_price</code>, and <b>0</b> (not NULL) when nothing matches.</p>`,
    vi: `<p>Cửa hàng SQL Server có thủ tục:</p>${pre(`CREATE PROCEDURE dbo.stock_value @min_price DECIMAL(12,2)
AS
BEGIN
  DECLARE @total DECIMAL(18,2);
  SELECT @total = SUM(price * stock) FROM product WHERE price >= @min_price AND is_active = 1;
  SELECT ISNULL(@total, 0) AS total;
END;`)}<p>Tạo hàm PostgreSQL <code>stock_value(min_price numeric) RETURNS numeric</code> bằng PL/pgSQL: giá trị tồn kho của các sản phẩm <b>đang bán</b> có giá từ <code>min_price</code> trở lên, và <b>0</b> (không phải NULL) khi không có gì khớp.</p>`,
    yc: [['<code>CREATE FUNCTION stock_value(min_price numeric) RETURNS numeric LANGUAGE plpgsql AS $$ … $$;</code>', '<code>CREATE FUNCTION stock_value(min_price numeric) RETURNS numeric LANGUAGE plpgsql AS $$ … $$;</code>'], ['Inside: <code>DECLARE total numeric;</code>, <code>SELECT … INTO total</code>, <code>RETURN …</code>.', 'Bên trong: <code>DECLARE total numeric;</code>, <code>SELECT … INTO total</code>, <code>RETURN …</code>.']],
    giai: `CREATE FUNCTION stock_value(min_price numeric) RETURNS numeric
LANGUAGE plpgsql AS $$
DECLARE
  total numeric;                         -- T-SQL: DECLARE @total
BEGIN
  SELECT sum(price * stock) INTO total   -- T-SQL: SELECT @total = …
  FROM product
  WHERE price >= min_price AND is_active;
  RETURN COALESCE(total, 0);             -- sum() of no rows is NULL, not 0
END;
$$;`,
    kiem: [
      sau(['stock_value(10000) and stock_value(500000)', 'stock_value(10000) và stock_value(500000)'], 'SELECT stock_value(10000) AS from_10k, stock_value(500000) AS from_500k'),
      sau(['Nothing matches ⇒ 0, not NULL', 'Không khớp gì ⇒ 0, không phải NULL'], 'SELECT stock_value(100000000) AS nothing'),
      sau(['Inactive products are not counted', 'Sản phẩm ngừng bán không được tính'], "SELECT stock_value(0) AS everything", { an: true, themCsdl: "UPDATE product SET stock = 50 WHERE sku = 'THUOC-03'" }),
      ma(['Written in PL/pgSQL', 'Viết bằng PL/pgSQL'], 'LANGUAGE\\s+plpgsql'),
    ],
    sai: [
      `CREATE FUNCTION stock_value(min_price numeric) RETURNS numeric LANGUAGE plpgsql AS $$ DECLARE total numeric; BEGIN SELECT sum(price * stock) INTO total FROM product WHERE price >= min_price AND is_active; RETURN total; END; $$;`,
      `CREATE FUNCTION stock_value(min_price numeric) RETURNS numeric LANGUAGE plpgsql AS $$ DECLARE total numeric; BEGIN SELECT sum(price * stock) INTO total FROM product WHERE price >= min_price; RETURN COALESCE(total, 0); END; $$;`,
    ],
    gy: [['Variables have no @ in PL/pgSQL; parameters are used by name.', 'Biến trong PL/pgSQL không có @; tham số dùng thẳng theo tên.'], ['<code>sum()</code> over zero rows is NULL — wrap the result in <code>COALESCE(total, 0)</code>.', '<code>sum()</code> trên 0 dòng là NULL — bọc kết quả bằng <code>COALESCE(total, 0)</code>.']],
    lhg: [['Returning <code>total</code> directly — a price nobody reaches gives NULL, and the report prints an empty cell.', 'Trả thẳng <code>total</code> — mức giá không món nào đạt cho NULL, báo cáo in ô trống.'], ['Losing <code>is_active</code> while porting <code>is_active = 1</code>.', 'Đánh rơi <code>is_active</code> khi chuyển <code>is_active = 1</code>.']],
    gt: ['<p>A function body is a string between <code>$$</code>; PL/pgSQL adds variables, <code>SELECT … INTO</code> and <code>RETURN</code>. You call it inside SQL: <code>SELECT stock_value(10000)</code> — that is how PostgreSQL replaces most T-SQL procedures that just compute a value.</p>', '<p>Thân hàm là một chuỗi giữa <code>$$</code>; PL/pgSQL thêm biến, <code>SELECT … INTO</code> và <code>RETURN</code>. Gọi nó ngay trong SQL: <code>SELECT stock_value(10000)</code> — đó là cách PostgreSQL thay phần lớn thủ tục T-SQL chỉ để tính một giá trị.</p>'],
    tn: [tn('PL/pgSQL', 'ngôn ngữ thủ tục của PostgreSQL'), tn('dollar quoting $$', 'chuỗi đặt giữa $$, khỏi phải nhân đôi dấu nháy')],
  }),
]);
