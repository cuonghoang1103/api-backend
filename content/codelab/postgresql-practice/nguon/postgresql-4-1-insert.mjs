/**
 * PostgreSQL · 4.1 — INSERT nhiều dòng, DEFAULT, RETURNING & UPSERT (ON CONFLICT). Bảng note / tag_stat của bài + CT Shop mini
 * (viết lại 01/11/2026 theo dữ liệu lab; giữ nguyên tiêu đề 3 đề cũ để tiến độ người học không mất).
 */
import { mod, pg, kq, kqAn, sau, ma, pre, TN, tn } from './_chung.mjs';
import { O_NOTE } from './_du-lieu.mjs';

const KHOI_INSERT = `-- Write ONE INSERT statement below (with RETURNING when the task asks for it).
-- Viết MỘT lệnh INSERT bên dưới (kèm RETURNING khi đề yêu cầu).

`;
const TAG_STAT = `CREATE TABLE tag_stat (tag text PRIMARY KEY, hits int NOT NULL DEFAULT 0);
INSERT INTO tag_stat VALUES ('sql', 3), ('ops', 1);`;
const MOT_LENH = '^(?![\\s\\S]*\\bINSERT\\b[\\s\\S]*\\bINSERT\\b)[\\s\\S]*\\bINSERT\\b';

export default mod('postgresql-4-1-insert', '4.1 INSERT: many rows, RETURNING & UPSERT', [
  pg({
    ...O_NOTE, t: 'Let DEFAULT do the work', k: 'EASY', p: 5, kn: ['INSERT with a column list', 'DEFAULT', 'RETURNING'], tag: ['dml', 'insert', 'notes'],
    en: '<p>Minh writes a new note: title <b>Weekly plan</b>, no tag, dated <b>2026-04-12</b>. Insert it writing only the columns you have values for, and get back <code>id, title, views, pinned</code> in the same statement.</p>',
    vi: '<p>Minh viết ghi chú mới: tiêu đề <b>Weekly plan</b>, không thẻ, ngày <b>2026-04-12</b>. Chèn nó chỉ ghi những cột bạn có giá trị, và lấy lại <code>id, title, views, pinned</code> trong cùng lệnh.</p>',
    yc: [['Column list <code>(title, author, created_at)</code> — views and pinned come from their DEFAULT.', 'Danh sách cột <code>(title, author, created_at)</code> — views và pinned lấy từ DEFAULT.'], ['<code>RETURNING id, title, views, pinned</code>.', '<code>RETURNING id, title, views, pinned</code>.']],
    khoi: KHOI_INSERT,
    giai: `INSERT INTO note (title, author, created_at)
VALUES ('Weekly plan', 'Minh', '2026-04-12')
RETURNING id, title, views, pinned;        -- id 8, views 0, pinned false: all from the table`,
    kiem: [
      kq(['id 8, views 0, pinned false', 'id 8, views 0, pinned false']),
      sau(['The note is stored with tag NULL', 'Ghi chú được lưu với tag NULL'], "SELECT title, author, tag, created_at FROM note WHERE title = 'Weekly plan'"),
      kqAn(['The id comes from the identity column', 'Id do cột identity cấp'], "INSERT INTO note (title, author, created_at) VALUES ('x', 'Lan', '2026-04-11')"),
    ],
    sai: ["INSERT INTO note (title, author, created_at) VALUES ('Weekly plan', 'Minh', '2026-04-12')", "INSERT INTO note (title, author, tag, views, pinned, created_at) VALUES ('Weekly plan', 'Minh', NULL, NULL, false, '2026-04-12') RETURNING id, title, views, pinned"],
    gy: [['Columns you leave out of the list get their DEFAULT (or NULL if none).', 'Cột không có trong danh sách nhận DEFAULT (hoặc NULL nếu không có).'], ['RETURNING goes at the very end of the INSERT.', 'RETURNING đặt ở cuối lệnh INSERT.']],
    lhg: [['Writing <code>views = NULL</code> explicitly — NOT NULL rejects it; leaving the column out is what triggers the DEFAULT.', 'Ghi tường minh <code>views = NULL</code> — NOT NULL chặn; bỏ cột ra khỏi danh sách mới kích hoạt DEFAULT.'], ['Running a SELECT afterwards to find the new id instead of RETURNING.', 'Chạy thêm SELECT để tìm id mới thay vì RETURNING.']],
    gt: ['<p>The table definition supplies id (identity), views (0) and pinned (false); RETURNING hands the finished row back, so the client sees exactly what was stored.</p>', '<p>Định nghĩa bảng cung cấp id (identity), views (0), pinned (false); RETURNING trả lại dòng hoàn chỉnh, nên client thấy đúng thứ đã lưu.</p>'],
    tn: [TN.returning, tn('DEFAULT', 'giá trị mặc định')],
  }),

  pg({
    t: 'Add a category and get its new id back', k: 'EASY', p: 6, kn: ['INSERT … VALUES', 'identity column', 'RETURNING'], tag: ['dml', 'insert', 'returning', 'ctshop'],
    en: '<p>CT Shop starts selling backpacks. Create the category <b>Balo &amp; túi</b> as a child of <b>Dụng cụ học tập</b> (category id 3) and, in the SAME statement, get back the row PostgreSQL stored: its <code>id</code>, <code>name</code> and <code>parent_id</code>.</p>',
    vi: '<p>CT Shop bắt đầu bán balo. Tạo danh mục <b>Balo &amp; túi</b> là con của <b>Dụng cụ học tập</b> (danh mục id 3) và, trong CÙNG một lệnh, lấy lại dòng PostgreSQL vừa lưu: <code>id</code>, <code>name</code>, <code>parent_id</code>.</p>',
    yc: [['One INSERT into <code>category</code> that does NOT write the <code>id</code> — the identity column assigns it.', 'Một lệnh INSERT vào <code>category</code> KHÔNG ghi cột <code>id</code> — cột identity tự cấp.'], ['End it with <code>RETURNING id, name, parent_id</code>.', 'Kết thúc bằng <code>RETURNING id, name, parent_id</code>.']],
    khoi: KHOI_INSERT,
    giai: `INSERT INTO category (name, parent_id)
VALUES ('Balo & túi', 3)
RETURNING id, name, parent_id;   -- the new id comes back without a second SELECT`,
    kiem: [
      kq(['RETURNING gives back the new row (id 13)', 'RETURNING trả lại dòng mới (id 13)']),
      sau(['The category is stored under Dụng cụ học tập', 'Danh mục được lưu dưới Dụng cụ học tập'], "SELECT c.name, p.name AS parent FROM category c JOIN category p ON p.id = c.parent_id WHERE c.name = 'Balo & túi'"),
      kqAn(['The id is assigned by PostgreSQL, not hard-coded', 'Id do PostgreSQL cấp, không chép cứng'], "INSERT INTO category (name) VALUES ('Đồ chơi')"),
      ma(['Uses RETURNING', 'Dùng RETURNING'], '\\bRETURNING\\b'),
    ],
    sai: ["INSERT INTO category (name, parent_id) VALUES ('Balo & túi', 3)", "INSERT INTO category (id, name, parent_id) OVERRIDING SYSTEM VALUE VALUES (13, 'Balo & túi', 3) RETURNING id, name, parent_id"],
    gy: [['INSERT INTO category (name, parent_id) VALUES (…, …) — leave id out.', 'INSERT INTO category (name, parent_id) VALUES (…, …) — bỏ cột id.'], ['Append RETURNING followed by the columns you want back.', 'Thêm RETURNING và các cột muốn lấy lại.']],
    lhg: [['Forcing the id (OVERRIDING SYSTEM VALUE … 13) — it works once, then collides with the identity sequence the day someone else inserts first.', 'Ép id (OVERRIDING SYSTEM VALUE … 13) — chạy được một lần, rồi đụng sequence của identity ngay khi người khác chèn trước.'], ['Running a second query SELECT max(id) to learn the new id — under concurrent inserts it can return SOMEONE ELSE\'s row. RETURNING is atomic.', 'Chạy thêm SELECT max(id) để biết id mới — khi nhiều người cùng chèn, nó có thể trả về dòng của NGƯỜI KHÁC. RETURNING là nguyên tử.']],
    gt: ['<p>The identity column draws the next number from its sequence (13 here, the sample data used ids 1–12). <code>RETURNING</code> hands that row straight back to the application — the standard way a PostgreSQL backend learns the id of what it just created.</p>', '<p>Cột identity lấy số tiếp theo từ sequence (ở đây 13, dữ liệu mẫu đã dùng 1–12). <code>RETURNING</code> trả ngay dòng đó cho ứng dụng — cách chuẩn để backend PostgreSQL biết id của thứ vừa tạo.</p>'],
    tn: [TN.identity, TN.returning],
  }),

  pg({
    t: 'Three new books in one statement', k: 'MEDIUM', p: 8, kn: ['multi-row INSERT', 'DEFAULT keyword', 'RETURNING'], tag: ['dml', 'insert', 'returning', 'ctshop'],
    en: `<p>Three books arrive for the <b>Giáo trình IT</b> category (id 12). Insert all three with ONE statement:</p>${pre(`sku      name                       price    stock
CT1207   Lập trình Python cơ bản    99000    40
CT1208   Git cho nhóm               69000    25
CT1209   Linux & Bash               85000    (not counted yet)`)}<p>The Linux book\'s stock is not counted yet: let the column\'s <code>DEFAULT</code> decide. Return <code>id, sku, stock</code> of the three new rows.</p>`,
    vi: `<p>Ba cuốn sách mới về cho danh mục <b>Giáo trình IT</b> (id 12). Chèn cả ba bằng MỘT lệnh:</p>${pre(`sku      name                       price    stock
CT1207   Lập trình Python cơ bản    99000    40
CT1208   Git cho nhóm               69000    25
CT1209   Linux & Bash               85000    (chưa kiểm kho)`)}<p>Sách Linux chưa kiểm kho: để <code>DEFAULT</code> của cột quyết định. Trả về <code>id, sku, stock</code> của ba dòng mới.</p>`,
    yc: [['Exactly ONE INSERT statement with three rows after VALUES.', 'Đúng MỘT lệnh INSERT, ba dòng sau VALUES.'], ['Write <code>DEFAULT</code> (not a number) for the Linux book\'s stock.', 'Ghi <code>DEFAULT</code> (không phải con số) cho tồn kho sách Linux.'], ['Finish with <code>RETURNING id, sku, stock</code>.', 'Kết thúc bằng <code>RETURNING id, sku, stock</code>.']],
    khoi: KHOI_INSERT,
    giai: `INSERT INTO product (sku, name, category_id, price, stock)
VALUES ('CT1207', 'Lập trình Python cơ bản', 12, 99000, 40),
       ('CT1208', 'Git cho nhóm',            12, 69000, 25),
       ('CT1209', 'Linux & Bash',            12, 85000, DEFAULT)   -- DEFAULT ⇒ 0, as declared on the column
RETURNING id, sku, stock;`,
    kiem: [
      kq(['RETURNING lists the three new rows (ids 49–51)', 'RETURNING liệt kê ba dòng mới (id 49–51)']),
      sau(['Giáo trình IT now has 5 products, Linux stock = 0', 'Giáo trình IT giờ có 5 sản phẩm, tồn sách Linux = 0'], 'SELECT sku, price, stock FROM product WHERE category_id = 12 ORDER BY sku', { thuTu: true }),
      kqAn(['Ids come from the identity column (another product was added first)', 'Id do cột identity cấp (đã có sản phẩm khác chèn trước)'], "INSERT INTO product (sku, name, category_id, price) VALUES ('CT1210', 'Python nâng cao', 12, 119000)"),
      ma(['One INSERT statement', 'Một lệnh INSERT'], MOT_LENH),
      ma(['Uses DEFAULT for the unknown stock', 'Dùng DEFAULT cho tồn kho chưa biết'], '\\bDEFAULT\\b'),
    ],
    sai: [
      "INSERT INTO product (sku, name, category_id, price, stock) VALUES ('CT1207', 'Lập trình Python cơ bản', 12, 99000, 40) RETURNING id, sku, stock;\nINSERT INTO product (sku, name, category_id, price, stock) VALUES ('CT1208', 'Git cho nhóm', 12, 69000, 25) RETURNING id, sku, stock;\nINSERT INTO product (sku, name, category_id, price) VALUES ('CT1209', 'Linux & Bash', 12, 85000) RETURNING id, sku, stock",
      "INSERT INTO product (sku, name, category_id, price, stock) VALUES ('CT1207', 'Lập trình Python cơ bản', 12, 99000, 40), ('CT1208', 'Git cho nhóm', 12, 69000, 25), ('CT1209', 'Linux & Bash', 12, 85000, NULL) RETURNING id, sku, stock",
    ],
    gy: [['VALUES (…), (…), (…) — rows separated by commas, one statement.', 'VALUES (…), (…), (…) — các dòng cách nhau dấu phẩy, một lệnh.'], ['The keyword DEFAULT can stand in a VALUES list where a value would go.', 'Từ khoá DEFAULT đứng được trong VALUES ở chỗ của một giá trị.']],
    lhg: [['Writing NULL for "unknown stock" — the column is NOT NULL, so PostgreSQL rejects it (23502). DEFAULT means "use the declared default", NULL means "no value".', 'Ghi NULL cho "chưa biết tồn kho" — cột là NOT NULL nên PostgreSQL từ chối (23502). DEFAULT nghĩa là "dùng giá trị mặc định đã khai", NULL là "không có giá trị".'], ['Three separate INSERTs — three round-trips and three transactions in autocommit mode; a multi-row VALUES is one atomic statement and much faster for batches.', 'Ba lệnh INSERT riêng — ba lượt đi về và ba giao dịch ở chế độ autocommit; VALUES nhiều dòng là một lệnh nguyên tử, nhanh hơn nhiều khi chèn lô.']],
    gt: ['<p>A multi-row <code>VALUES</code> list inserts every row or none. <code>DEFAULT</code> inside VALUES picks the column default (<code>stock int NOT NULL DEFAULT 0</code>). RETURNING reports each row with the id the identity column assigned (49, 50, 51 — the lab data reserves 1–48).</p>', '<p>Danh sách <code>VALUES</code> nhiều dòng chèn tất cả hoặc không dòng nào. <code>DEFAULT</code> trong VALUES lấy giá trị mặc định của cột (<code>stock int NOT NULL DEFAULT 0</code>). RETURNING báo lại từng dòng kèm id cột identity đã cấp (49, 50, 51 — dữ liệu lab giữ 1–48).</p>'],
    tn: [TN.returning, tn('DEFAULT', 'giá trị mặc định của cột')],
  }),

  pg({
    t: 'Count tag hits with ON CONFLICT', k: 'MEDIUM', p: 7, kn: ['ON CONFLICT DO UPDATE', 'counter upsert'], tag: ['dml', 'upsert', 'notes'],
    csdl: TAG_STAT, tenCsdl: 'tag_stat', ld: { en: pre("tag_stat (tag text PK, hits int DEFAULT 0) — ('sql', 3), ('ops', 1)"), vi: pre("tag_stat (tag text PK, hits int DEFAULT 0) — ('sql', 3), ('ops', 1)") },
    en: '<p>Each time a reader opens a tag page the app records one hit. Write the ONE statement that records a hit for tags <code>sql</code> and <code>date</code>: an existing tag gets <code>hits + 1</code>, a new tag starts at 1. Return <code>tag, hits</code>.</p>',
    vi: '<p>Mỗi lần người đọc mở trang thẻ, app ghi một lượt. Viết MỘT lệnh ghi một lượt cho thẻ <code>sql</code> và <code>date</code>: thẻ đã có thì <code>hits + 1</code>, thẻ mới bắt đầu từ 1. Trả về <code>tag, hits</code>.</p>',
    yc: [['<code>INSERT … VALUES (\'sql\', 1), (\'date\', 1) ON CONFLICT (tag) DO UPDATE SET hits = tag_stat.hits + 1</code>.', '<code>INSERT … VALUES (\'sql\', 1), (\'date\', 1) ON CONFLICT (tag) DO UPDATE SET hits = tag_stat.hits + 1</code>.'], ['<code>RETURNING tag, hits</code>.', '<code>RETURNING tag, hits</code>.']],
    khoi: KHOI_INSERT,
    giai: `INSERT INTO tag_stat (tag, hits)
VALUES ('sql', 1), ('date', 1)
ON CONFLICT (tag) DO UPDATE
   SET hits = tag_stat.hits + 1          -- existing counter: +1 (not "= 1")
RETURNING tag, hits;`,
    kiem: [
      kq(['sql 3 → 4, date created with 1', 'sql 3 → 4, date được tạo với 1']),
      sau(['Stored counters', 'Bộ đếm đã lưu'], 'SELECT tag, hits FROM tag_stat ORDER BY tag', { thuTu: true }),
      sau(['From any starting count', 'Từ mọi số đếm ban đầu'], 'SELECT tag, hits FROM tag_stat ORDER BY tag', { an: true, thuTu: true, themCsdl: "UPDATE tag_stat SET hits = 41 WHERE tag = 'sql'" }),
    ],
    sai: ["INSERT INTO tag_stat (tag, hits) VALUES ('sql', 1), ('date', 1) ON CONFLICT (tag) DO UPDATE SET hits = EXCLUDED.hits RETURNING tag, hits", "INSERT INTO tag_stat (tag, hits) VALUES ('sql', 1), ('date', 1) ON CONFLICT (tag) DO NOTHING RETURNING tag, hits"],
    gy: [['The conflict target is the primary key <code>(tag)</code>.', 'Đích va chạm là khoá chính <code>(tag)</code>.'], ['Inside DO UPDATE, <code>tag_stat.hits</code> is the stored value.', 'Trong DO UPDATE, <code>tag_stat.hits</code> là giá trị đang lưu.']],
    lhg: [['<code>SET hits = EXCLUDED.hits</code> resets the counter to 1 on every hit.', '<code>SET hits = EXCLUDED.hits</code> đặt lại bộ đếm về 1 mỗi lượt.'], ['<code>DO NOTHING</code>: existing tags never count again.', '<code>DO NOTHING</code>: thẻ đã có không bao giờ đếm thêm.']],
    gt: ['<p>A counter upsert is the classic ON CONFLICT pattern: one atomic statement, safe even when two readers hit the same tag at the same moment (the second waits for the first row lock, then adds its own +1).</p>', '<p>Upsert bộ đếm là mẫu kinh điển của ON CONFLICT: một lệnh nguyên tử, an toàn cả khi hai người đọc cùng mở một thẻ cùng lúc (người sau chờ khoá dòng của người trước rồi cộng +1 của mình).</p>'],
    tn: [TN.upsert],
  }),

  pg({
    t: 'Receive a delivery with UPSERT', k: 'HARD', p: 12, kn: ['INSERT … ON CONFLICT', 'DO UPDATE', 'EXCLUDED', 'RETURNING'], tag: ['dml', 'upsert', 'on-conflict', 'ctshop'],
    en: `<p>A delivery truck brings:</p>${pre(`sku      name                               category_id   price    qty delivered
CT0501   Bút bi Thiên Long TL-027 (xanh)    5              5000    100
CT0604   Tẩy Pentel Hi-Polymer              6              9000     50
CT0505   Bút gel Zebra Sarasa Clip 0.5mm    5             24000     60`)}<p>Products already in the catalogue (same <code>sku</code>) must get the delivered quantity <b>added</b> to their current stock — their name and price stay as they are. Unknown SKUs become new products with that stock. Do it in ONE statement and return <code>sku, stock</code> of every row touched.</p>`,
    vi: `<p>Xe giao hàng chở tới:</p>${pre(`sku      name                               category_id   price    số lượng giao
CT0501   Bút bi Thiên Long TL-027 (xanh)    5              5000    100
CT0604   Tẩy Pentel Hi-Polymer              6              9000     50
CT0505   Bút gel Zebra Sarasa Clip 0.5mm    5             24000     60`)}<p>Sản phẩm đã có trong danh mục (cùng <code>sku</code>) phải được <b>cộng thêm</b> số lượng giao vào tồn kho hiện tại — tên và giá giữ nguyên. SKU chưa có thì thành sản phẩm mới với tồn kho đó. Làm bằng MỘT lệnh và trả về <code>sku, stock</code> của mọi dòng bị đụng tới.</p>`,
    yc: [['One <code>INSERT … ON CONFLICT (sku) DO UPDATE</code> statement.', 'Một lệnh <code>INSERT … ON CONFLICT (sku) DO UPDATE</code>.'], ['Existing rows: <code>stock = old stock + delivered qty</code>; do not touch price or name.', 'Dòng đã có: <code>stock = tồn cũ + số giao</code>; không đụng giá và tên.'], ['Finish with <code>RETURNING sku, stock</code>.', 'Kết thúc bằng <code>RETURNING sku, stock</code>.']],
    khoi: KHOI_INSERT,
    giai: `INSERT INTO product AS p (sku, name, category_id, price, stock)
VALUES ('CT0501', 'Bút bi Thiên Long TL-027 (xanh)', 5,  5000, 100),
       ('CT0604', 'Tẩy Pentel Hi-Polymer',           6,  9000,  50),
       ('CT0505', 'Bút gel Zebra Sarasa Clip 0.5mm', 5, 24000,  60)
ON CONFLICT (sku) DO UPDATE
   SET stock = p.stock + EXCLUDED.stock      -- EXCLUDED = the row we tried to insert
RETURNING sku, stock;`,
    kiem: [
      kq(['RETURNING: CT0501 120 → 220, CT0604 0 → 50, CT0505 created with 60', 'RETURNING: CT0501 120 → 220, CT0604 0 → 50, CT0505 tạo mới với 60']),
      sau(['Stored values: price unchanged, stock added', 'Giá trị đã lưu: giá giữ nguyên, tồn kho được cộng'], "SELECT sku, name, price, stock FROM product WHERE sku IN ('CT0501', 'CT0604', 'CT0505') ORDER BY sku", { thuTu: true }),
      sau(['Still correct when the current stock is different (adds, never overwrites)', 'Vẫn đúng khi tồn kho hiện tại khác (cộng, không ghi đè)'], "SELECT sku, stock FROM product WHERE sku IN ('CT0501', 'CT0604', 'CT0505') ORDER BY sku", { an: true, thuTu: true, themCsdl: "UPDATE product SET stock = 7 WHERE sku = 'CT0604'; UPDATE product SET stock = 1 WHERE sku = 'CT0501'" }),
      ma(['Uses ON CONFLICT … DO UPDATE', 'Dùng ON CONFLICT … DO UPDATE'], '\\bON\\s+CONFLICT\\s*\\(\\s*sku\\s*\\)\\s*DO\\s+UPDATE\\b'),
    ],
    sai: [
      "INSERT INTO product (sku, name, category_id, price, stock) VALUES ('CT0501', 'Bút bi Thiên Long TL-027 (xanh)', 5, 5000, 100), ('CT0604', 'Tẩy Pentel Hi-Polymer', 6, 9000, 50), ('CT0505', 'Bút gel Zebra Sarasa Clip 0.5mm', 5, 24000, 60) ON CONFLICT (sku) DO UPDATE SET stock = EXCLUDED.stock RETURNING sku, stock",
      "INSERT INTO product (sku, name, category_id, price, stock) VALUES ('CT0501', 'Bút bi Thiên Long TL-027 (xanh)', 5, 5000, 100), ('CT0604', 'Tẩy Pentel Hi-Polymer', 6, 9000, 50), ('CT0505', 'Bút gel Zebra Sarasa Clip 0.5mm', 5, 24000, 60) ON CONFLICT (sku) DO NOTHING RETURNING sku, stock",
    ],
    gy: [['ON CONFLICT (sku) names the UNIQUE column that decides "already exists".', 'ON CONFLICT (sku) chỉ ra cột UNIQUE quyết định "đã tồn tại".'], ['Inside DO UPDATE, EXCLUDED.stock is the delivered quantity and the table\'s own column (give the table an alias: INSERT INTO product AS p) is the current stock.', 'Trong DO UPDATE, EXCLUDED.stock là số lượng giao, còn cột của chính bảng (đặt bí danh: INSERT INTO product AS p) là tồn kho hiện tại.']],
    lhg: [['SET stock = EXCLUDED.stock — overwrites the shelf count with the delivery size; 120 pens become 100.', 'SET stock = EXCLUDED.stock — ghi đè tồn kho bằng số lượng giao; 120 cây bút thành 100.'], ['ON CONFLICT DO NOTHING — existing products are silently skipped, and RETURNING does not even list them.', 'ON CONFLICT DO NOTHING — sản phẩm đã có bị bỏ qua âm thầm, và RETURNING cũng không liệt kê chúng.'], ['SELECT first, then INSERT or UPDATE from the application — two clerks receiving at the same time both see "not there" and one gets a duplicate-key error. ON CONFLICT is atomic.', 'SELECT trước rồi INSERT hay UPDATE ở ứng dụng — hai người nhận hàng cùng lúc đều thấy "chưa có" và một người dính lỗi trùng khoá. ON CONFLICT là nguyên tử.']],
    gt: ['<p>For each row PostgreSQL tries the INSERT; when the UNIQUE index on <code>sku</code> already holds that value it runs the <code>DO UPDATE</code> branch instead, on the existing row. <code>EXCLUDED</code> is the proposed row, <code>p</code> the stored one. RETURNING reports both inserted and updated rows.</p>', '<p>Với từng dòng PostgreSQL thử INSERT; khi chỉ mục UNIQUE trên <code>sku</code> đã có giá trị đó thì chạy nhánh <code>DO UPDATE</code> trên dòng cũ. <code>EXCLUDED</code> là dòng định chèn, <code>p</code> là dòng đang lưu. RETURNING báo cả dòng chèn mới lẫn dòng được cập nhật.</p>'],
    tn: [TN.upsert, TN.excluded, TN.returning],
  }),
]);
