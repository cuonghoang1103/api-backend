/**
 * PostgreSQL · 4.1 — INSERT nhiều dòng, RETURNING & UPSERT (ON CONFLICT). Loại 'sql-pg' (PostgreSQL nguyên bản).
 * Kiểm = chạy lệnh của bạn (bảng RETURNING) rồi truy vấn kiểm của đề; giao dịch huỷ sau mỗi kiểm.
 * CSDL: CT Shop thu gọn. Bài giảng: postgresql-4-1-insert.
 */
import { doiDau, KHOA, sqlPg, kq, kqAn, sau, ma, TN } from './_chung.mjs';

const KHOI_INSERT = `-- Write ONE INSERT statement below (with RETURNING when the task asks for it).
-- Viết MỘT lệnh INSERT bên dưới (kèm RETURNING khi đề yêu cầu).

`;

export default doiDau({
  slug: 'postgresql-4-1-insert',
  ten: '4.1 INSERT: many rows, RETURNING & UPSERT',
  khoa: KHOA,
  baiHoc: 'postgresql-4-1-insert',
  de: [
    sqlPg({
      tieuDe: 'Add a category and get its new id back',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['INSERT … VALUES', 'identity column', 'RETURNING'], the: ['dml', 'insert', 'returning', 'ctshop'],
      moTa: {
        en: '<p>CT Shop starts selling phone cases and chargers. Create the category <b>Phụ kiện</b> as a child of <b>Điện tử</b> (category id 1) and, in the SAME statement, get back the row PostgreSQL stored: its <code>id</code>, <code>name</code> and <code>parent_id</code>.</p>',
        vi: '<p>CT Shop bắt đầu bán ốp lưng và sạc. Tạo danh mục <b>Phụ kiện</b> là con của <b>Điện tử</b> (danh mục id 1) và, trong CÙNG một lệnh, lấy lại dòng PostgreSQL vừa lưu: <code>id</code>, <code>name</code>, <code>parent_id</code>.</p>',
      },
      yeuCau: {
        en: ['One INSERT into <code>category</code> that does NOT write the <code>id</code> — the identity column assigns it.', 'End it with <code>RETURNING id, name, parent_id</code>.'],
        vi: ['Một lệnh INSERT vào <code>category</code> KHÔNG ghi cột <code>id</code> — cột identity tự cấp.', 'Kết thúc bằng <code>RETURNING id, name, parent_id</code>.'],
      },
      khoiDau: KHOI_INSERT,
      giai: `INSERT INTO category (name, parent_id)
VALUES ('Phụ kiện', 1)
RETURNING id, name, parent_id;   -- the new id comes back without a second SELECT`,
      kiem: [
        kq('RETURNING gives back the new row (id 9)'),
        sau('The category is really stored under Điện tử', "SELECT id, name, parent_id FROM category WHERE name = 'Phụ kiện'"),
        kqAn('The id is assigned by PostgreSQL, not hard-coded', "INSERT INTO category (name) VALUES ('Đồ chơi')"),
        ma('Uses RETURNING', '\\bRETURNING\\b'),
      ],
      saiMau: ["INSERT INTO category (name, parent_id) VALUES ('Phụ kiện', 1)", "INSERT INTO category (id, name, parent_id) VALUES (9, 'Phụ kiện', 1) RETURNING id, name, parent_id"],
      goiY: ['INSERT INTO category (name, parent_id) VALUES (…, …) — leave id out.', 'Append RETURNING followed by the columns you want back.'],
      loiHayGap: [
        { en: 'Writing the id yourself (VALUES (9, …)) — it works once, then collides with the identity sequence (duplicate key) the day someone else inserts first.', vi: 'Tự ghi id (VALUES (9, …)) — chạy được một lần, rồi đụng sequence của cột identity (trùng khoá) ngay khi người khác chèn trước.' },
        { en: 'Running a second query SELECT max(id) to learn the new id — under concurrent inserts it can return SOMEONE ELSE\'s row. RETURNING is atomic.', vi: 'Chạy thêm SELECT max(id) để biết id mới — khi nhiều người cùng chèn, nó có thể trả về dòng của NGƯỜI KHÁC. RETURNING là nguyên tử.' },
      ],
      giaiThich: { en: '<p>The identity column draws the next number from its sequence (9 here, because the sample data used ids 1–8). <code>RETURNING</code> hands that row straight back to the application — the standard way a PostgreSQL backend learns the id of what it just created.</p>', vi: '<p>Cột identity lấy số tiếp theo từ sequence của nó (ở đây là 9 vì dữ liệu mẫu đã dùng 1–8). <code>RETURNING</code> trả ngay dòng đó cho ứng dụng — cách chuẩn để backend PostgreSQL biết id của thứ nó vừa tạo.</p>' },
      thuatNgu: [TN.identity, TN.returning],
    }),
    sqlPg({
      tieuDe: 'Three new books in one statement',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['multi-row INSERT', 'DEFAULT keyword', 'RETURNING'], the: ['dml', 'insert', 'returning', 'ctshop'],
      moTa: {
        en: '<p>Three books arrive for the <b>Sách</b> category (id 8). Insert all three with ONE statement:</p><pre>sku      name                 price    stock\nBK-JS    JavaScript từ số 0   180000   50\nBK-GIT   Git cho nhóm         150000   30\nBK-LNX   Linux &amp; Bash         210000   (not counted yet)</pre><p>The Linux book\'s stock is not counted yet: let the column\'s <code>DEFAULT</code> decide. Return <code>id, sku, stock</code> of the three new rows.</p>',
        vi: '<p>Ba cuốn sách mới về cho danh mục <b>Sách</b> (id 8). Chèn cả ba bằng MỘT lệnh:</p><pre>sku      name                 price    stock\nBK-JS    JavaScript từ số 0   180000   50\nBK-GIT   Git cho nhóm         150000   30\nBK-LNX   Linux &amp; Bash         210000   (chưa kiểm kho)</pre><p>Sách Linux chưa kiểm kho: để <code>DEFAULT</code> của cột quyết định. Trả về <code>id, sku, stock</code> của ba dòng mới.</p>',
      },
      yeuCau: {
        en: ['Exactly ONE INSERT statement with three rows after VALUES.', 'Write <code>DEFAULT</code> (not a number) for the Linux book\'s stock.', 'Finish with <code>RETURNING id, sku, stock</code>.'],
        vi: ['Đúng MỘT lệnh INSERT, ba dòng sau VALUES.', 'Ghi <code>DEFAULT</code> (không phải con số) cho tồn kho sách Linux.', 'Kết thúc bằng <code>RETURNING id, sku, stock</code>.'],
      },
      khoiDau: KHOI_INSERT,
      giai: `INSERT INTO product (sku, name, category_id, price, stock)
VALUES ('BK-JS',  'JavaScript từ số 0', 8, 180000, 50),
       ('BK-GIT', 'Git cho nhóm',       8, 150000, 30),
       ('BK-LNX', 'Linux & Bash',       8, 210000, DEFAULT)   -- DEFAULT ⇒ 0, as declared on the column
RETURNING id, sku, stock;`,
      kiem: [
        kq('RETURNING lists the three new rows'),
        sau('The Sách category now has 4 products, Linux stock = 0', "SELECT sku, price, stock FROM product WHERE category_id = 8"),
        kqAn('Ids come from the identity column (another product was added first)', "INSERT INTO product (sku, name, category_id, price) VALUES ('BK-PY', 'Python', 8, 199000)"),
        ma('One INSERT statement', '^(?![\\s\\S]*\\bINSERT\\b[\\s\\S]*\\bINSERT\\b)[\\s\\S]*\\bINSERT\\b'),
        ma('Uses DEFAULT for the unknown stock', '\\bDEFAULT\\b'),
      ],
      saiMau: [
        "INSERT INTO product (sku, name, category_id, price, stock) VALUES ('BK-JS', 'JavaScript từ số 0', 8, 180000, 50) RETURNING id, sku, stock;\nINSERT INTO product (sku, name, category_id, price, stock) VALUES ('BK-GIT', 'Git cho nhóm', 8, 150000, 30) RETURNING id, sku, stock;\nINSERT INTO product (sku, name, category_id, price) VALUES ('BK-LNX', 'Linux & Bash', 8, 210000) RETURNING id, sku, stock",
        "INSERT INTO product (sku, name, category_id, price, stock) VALUES ('BK-JS', 'JavaScript từ số 0', 8, 180000, 50), ('BK-GIT', 'Git cho nhóm', 8, 150000, 30), ('BK-LNX', 'Linux & Bash', 8, 210000, NULL) RETURNING id, sku, stock",
      ],
      goiY: ['VALUES (…), (…), (…) — rows separated by commas, one statement.', 'The keyword DEFAULT can stand in a VALUES list where a value would go.'],
      loiHayGap: [
        { en: 'Writing NULL for "unknown stock" — the column is NOT NULL, so PostgreSQL rejects it (23502). DEFAULT means "use the declared default", NULL means "no value".', vi: 'Ghi NULL cho "chưa biết tồn kho" — cột là NOT NULL nên PostgreSQL từ chối (23502). DEFAULT nghĩa là "dùng giá trị mặc định đã khai", NULL là "không có giá trị".' },
        { en: 'Three separate INSERTs — three round-trips and three transactions in autocommit mode; a multi-row VALUES is one atomic statement and much faster for batches.', vi: 'Ba lệnh INSERT riêng — ba lượt đi về và ba giao dịch ở chế độ autocommit; VALUES nhiều dòng là một lệnh nguyên tử, nhanh hơn nhiều khi chèn lô.' },
      ],
      giaiThich: { en: '<p>A multi-row <code>VALUES</code> list inserts every row or none. <code>DEFAULT</code> inside VALUES picks the column default (<code>stock int NOT NULL DEFAULT 0</code>). RETURNING then reports each row with the id the identity column assigned.</p>', vi: '<p>Danh sách <code>VALUES</code> nhiều dòng chèn tất cả hoặc không dòng nào. <code>DEFAULT</code> trong VALUES lấy giá trị mặc định của cột (<code>stock int NOT NULL DEFAULT 0</code>). RETURNING báo lại từng dòng kèm id cột identity đã cấp.</p>' },
      thuatNgu: [TN.returning, { en: 'DEFAULT', vi: 'giá trị mặc định của cột' }],
    }),
    sqlPg({
      tieuDe: 'Receive a delivery with UPSERT',
      doKho: 'HARD', phut: 12,
      khaiNiem: ['INSERT … ON CONFLICT', 'DO UPDATE', 'EXCLUDED', 'RETURNING'], the: ['dml', 'upsert', 'on-conflict', 'ctshop'],
      moTa: {
        en: '<p>A delivery truck brings:</p><pre>sku       name                 category_id   price    qty delivered\nPH-A15    Galaxy A15           4             4990000  10\nKT-AM     Ấm siêu tốc          7             390000   12\nKT-QUAT   Quạt đứng            7             650000   15</pre><p>Products already in the catalogue (same <code>sku</code>) must get the delivered quantity <b>added</b> to their current stock — their name and price stay as they are. Unknown SKUs become new products with that stock. Do it in ONE statement and return <code>sku, stock</code> of every row touched.</p>',
        vi: '<p>Xe giao hàng chở tới:</p><pre>sku       name                 category_id   price    số lượng giao\nPH-A15    Galaxy A15           4             4990000  10\nKT-AM     Ấm siêu tốc          7             390000   12\nKT-QUAT   Quạt đứng            7             650000   15</pre><p>Sản phẩm đã có trong danh mục (cùng <code>sku</code>) phải được <b>cộng thêm</b> số lượng giao vào tồn kho hiện tại — tên và giá giữ nguyên. SKU chưa có thì thành sản phẩm mới với tồn kho đó. Làm bằng MỘT lệnh và trả về <code>sku, stock</code> của mọi dòng bị đụng tới.</p>',
      },
      yeuCau: {
        en: ['One <code>INSERT … ON CONFLICT (sku) DO UPDATE</code> statement.', 'Existing rows: <code>stock = old stock + delivered qty</code>; do not touch price or name.', 'Finish with <code>RETURNING sku, stock</code>.'],
        vi: ['Một lệnh <code>INSERT … ON CONFLICT (sku) DO UPDATE</code>.', 'Dòng đã có: <code>stock = tồn cũ + số giao</code>; không đụng giá và tên.', 'Kết thúc bằng <code>RETURNING sku, stock</code>.'],
      },
      khoiDau: KHOI_INSERT,
      giai: `INSERT INTO product AS p (sku, name, category_id, price, stock)
VALUES ('PH-A15',  'Galaxy A15',  4, 4990000, 10),
       ('KT-AM',   'Ấm siêu tốc', 7,  390000, 12),
       ('KT-QUAT', 'Quạt đứng',   7,  650000, 15)
ON CONFLICT (sku) DO UPDATE
   SET stock = p.stock + EXCLUDED.stock      -- EXCLUDED = the row we tried to insert
RETURNING sku, stock;`,
      kiem: [
        kq('RETURNING: existing stock increased, new product created'),
        sau('Stored values: price unchanged, stock added', "SELECT sku, name, price, stock FROM product WHERE sku IN ('PH-A15', 'KT-AM', 'KT-QUAT')"),
        sau('Still correct when the current stock is different (adds, never overwrites)', "SELECT sku, stock FROM product WHERE sku IN ('PH-A15', 'KT-AM', 'KT-QUAT')", { an: true, themCsdl: "UPDATE product SET stock = 7 WHERE sku = 'KT-AM'; UPDATE product SET stock = 1 WHERE sku = 'PH-A15'" }),
        ma('Uses ON CONFLICT … DO UPDATE', '\\bON\\s+CONFLICT\\s*\\(\\s*sku\\s*\\)\\s*DO\\s+UPDATE\\b'),
      ],
      saiMau: [
        "INSERT INTO product (sku, name, category_id, price, stock) VALUES ('PH-A15', 'Galaxy A15', 4, 4990000, 10), ('KT-AM', 'Ấm siêu tốc', 7, 390000, 12), ('KT-QUAT', 'Quạt đứng', 7, 650000, 15) ON CONFLICT (sku) DO UPDATE SET stock = EXCLUDED.stock RETURNING sku, stock",
        "INSERT INTO product (sku, name, category_id, price, stock) VALUES ('PH-A15', 'Galaxy A15', 4, 4990000, 10), ('KT-AM', 'Ấm siêu tốc', 7, 390000, 12), ('KT-QUAT', 'Quạt đứng', 7, 650000, 15) ON CONFLICT (sku) DO NOTHING RETURNING sku, stock",
      ],
      goiY: ['ON CONFLICT (sku) names the UNIQUE column that decides "already exists".', 'Inside DO UPDATE, EXCLUDED.stock is the delivered quantity and the table\'s own column (give the table an alias: INSERT INTO product AS p) is the current stock.'],
      loiHayGap: [
        { en: 'SET stock = EXCLUDED.stock — overwrites the shelf count with the delivery size; 25 Galaxy phones become 10.', vi: 'SET stock = EXCLUDED.stock — ghi đè tồn kho bằng số lượng giao; 25 chiếc Galaxy thành 10.' },
        { en: 'ON CONFLICT DO NOTHING — existing products are silently skipped, and RETURNING does not even list them.', vi: 'ON CONFLICT DO NOTHING — sản phẩm đã có bị bỏ qua âm thầm, và RETURNING cũng không liệt kê chúng.' },
        { en: 'SELECT first, then INSERT or UPDATE from the application — two users receiving at the same time both see "not there" and one gets a duplicate-key error. ON CONFLICT is atomic.', vi: 'SELECT trước rồi INSERT hay UPDATE ở ứng dụng — hai người nhận hàng cùng lúc đều thấy "chưa có" và một người dính lỗi trùng khoá. ON CONFLICT là nguyên tử.' },
      ],
      giaiThich: { en: '<p>For each row PostgreSQL tries the INSERT; when the UNIQUE index on <code>sku</code> already holds that value it runs the <code>DO UPDATE</code> branch instead, on the existing row. <code>EXCLUDED</code> is the proposed row, <code>p</code> the stored one. RETURNING reports both inserted and updated rows.</p>', vi: '<p>Với từng dòng PostgreSQL thử INSERT; khi chỉ mục UNIQUE trên <code>sku</code> đã có giá trị đó thì chạy nhánh <code>DO UPDATE</code> trên dòng cũ. <code>EXCLUDED</code> là dòng định chèn, <code>p</code> là dòng đang lưu. RETURNING báo cả dòng chèn mới lẫn dòng được cập nhật.</p>' },
      thuatNgu: [TN.upsert, TN.excluded, TN.returning],
    }),
  ],
});
