/**
 * PostgreSQL · bộ luyện SQL chấm thật — tiện ích soạn đề (31/10/2026, mở rộng 01/11/2026). Đọc content/codelab/README.md
 * mục 3b / 3b′ trước.
 *
 * Khác DBI202 (loại 'sql', giả lập SQL Server): đề ở đây là loại **'sql-pg' = PostgreSQL NGUYÊN BẢN** — mọi cú pháp
 * PostgreSQL chạy (LIMIT, ILIKE, ::, ||, RETURNING, ON CONFLICT, DISTINCT ON, WITH RECURSIVE, hàm cửa sổ, PL/pgSQL…),
 * chuỗi so sánh phân biệt hoa thường, AVG trả numeric. Dữ liệu mẫu nạp NGUYÊN VĂN (không dịch kiểu).
 *
 * Hai lối soạn (cùng ra một đề):
 *   sqlPg({ tieuDe, doKho, phut, moTa:{en,vi}, yeuCau:{en:[],vi:[]}, giai, kiem:[…], … })   — dài, như README mục 2
 *   pg({ t, k, p, en, vi, yc:[[en,vi]], giai, kiem, sai, gy:[[en,vi]], lhg:[[en,vi]], gt:[en,vi], tn, csdl?, … })  — gọn
 * Kiểm: kq / kqAn / sau / chan / duoc / ma — `moTa` nhận chuỗi, [en, vi] (⇒ "EN|||VI") hoặc { en, vi }.
 * Bài không chạy được trong PGlite (đồng thời thật, sao lưu, nhân bản, pg_trgm…) ⇒ cs() (choice/order/table) hoặc
 * tay() (`loai: 'manual'`, chạy trên máy người học rồi tự đánh dấu) — đề phải NÓI RÕ vì sao.
 *
 * `mongDoi` của mọi kiểm do bộ xuất DỰNG bằng cách chạy lời giải (scripts/codelab-sql-node.mjs, chế độ 'pg') —
 * đừng chép tay bảng kết quả. Kiểm ẩn nên ĐỔI DỮ LIỆU (`themCsdl`) để bắt lời giải chép cứng.
 *
 * Giới hạn của máy chấm (đo 01/11/2026, PGlite 0.5.8 = PostgreSQL 18.3 WASM):
 *   - mã người học chạy TRONG một giao dịch rồi ROLLBACK ⇒ cấm BEGIN/COMMIT/ROLLBACK/SAVEPOINT/SET TRANSACTION;
 *     CREATE INDEX CONCURRENTLY / VACUUM không chạy được (25001). ANALYZE, SET LOCAL, REFRESH MATERIALIZED VIEW chạy được.
 *   - MỘT phiên duy nhất ⇒ không có đồng thời thật (khoá, deadlock, mức cô lập chỉ học bằng choice/order/table).
 *   - không extension: pg_trgm, btree_gist, unaccent, pgcrypto KHÔNG có (gen_random_uuid() có sẵn trong lõi).
 *     EXCLUDE trên cột thường: dùng mẹo int4range(x, x, '[]') WITH = (gist range_ops), không cần btree_gist.
 *   - pg_stat_* có nhưng bộ đếm luôn 0 (không có tiến trình thống kê) ⇒ đừng chấm theo số liệu pg_stat.
 *   - TimeZone mặc định = múi giờ của MÁY người học ⇒ mọi CSDL có timestamptz phải `SET TimeZone` ngay đầu (CT_SHOP có sẵn).
 *   - collation C: 'B' < 'a', chữ có dấu xếp sau chữ không dấu ⇒ đừng kiểm thứ tự theo chữ có dấu.
 *
 * ⚠ Đừng đưa câu chạy VÔ HẠN vào `saiMau`: bộ xuất chạy trong Node KHÔNG có giới hạn giờ.
 * ⚠ `<` trong HTML đề phải viết &lt; (bộ kiểm nội dung bắt) — dùng c()/pre() để tự escape.
 */
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';
import { xaoCauHoi, xaoThuTu, loiGiaiTracNghiem } from '../../_chung/tracNghiem.mjs';
import { thangDiemTu } from '../../_chung/deLon.mjs';

export { doiDau };
export const KHOA = 'postgresql';
export const TEP = 'query.sql';

/* ═══════════════════ chữ ═══════════════════ */
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** mã nội dòng (escape) */
export const c = (s) => `<code>${esc(s)}</code>`;
/** khối mã / output (escape) */
export const pre = (s) => `<pre>${esc(Array.isArray(s) ? s.join('\n') : s)}</pre>`;
/** chuỗi | [en, vi] | {en, vi} ⇒ "EN|||VI" (mô tả kiểm, TestPanel đọc cả ba dạng; chuỗi "EN|||VI" là dạng prod đọc được) */
export const hk = (x) => (Array.isArray(x) ? `${x[0]}|||${x[1]}` : x && typeof x === 'object' ? `${x.en}|||${x.vi}` : x);
const bv = (x) => (Array.isArray(x) ? { en: x[0], vi: x[1] } : x);
/** Thuật ngữ: { en, vi, giaiThich } */
export const tn = (en, vi, giaiThich) => ({ en, vi, ...(giaiThich ? { giaiThich } : {}) });

/* ═══════════════════ kiểm SQL ═══════════════════ */
/** Bảng kết quả của câu SELECT cuối cùng trong mã người học. */
export const kq = (moTa, tuy = {}) => ({ kiem: 'ket-qua', moTa: hk(moTa), ...tuy });
/** Như kq nhưng ẨN (chỉ khi Nộp) và đổi dữ liệu: `themCsdl` chạy sau dữ liệu mẫu. */
export const kqAn = (moTa, themCsdl, tuy = {}) => ({ kiem: 'ket-qua', moTa: hk(moTa), an: true, ...(themCsdl ? { themCsdl } : {}), ...tuy });
/** Sau lệnh DML/DDL: chạy bài rồi `kiemTra` (truy vấn của đề — có thể nhiều câu, câu cuối trả bảng). */
export const sau = (moTa, kiemTra, tuy = {}) => ({ kiem: 'sau-lenh', moTa: hk(moTa), kiemTra, ...tuy });
/** Câu thử phải BỊ CHẶN. maLoi: '23505' trùng · '23503' FK · '23502' NOT NULL · '23514' CHECK · '23P01' EXCLUDE · 'P0001' RAISE · 'a|b' nhiều mã. */
export const chan = (moTa, thu, maLoi, tuy = {}) => ({ kiem: 'bi-chan', moTa: hk(moTa), thu, ...(maLoi ? { maLoi } : {}), ...tuy });
/** Câu thử hợp lệ phải chạy được. */
export const duoc = (moTa, thu, tuy = {}) => ({ kiem: 'chay-duoc', moTa: hk(moTa), thu, ...tuy });
/** Regex (cờ i, chú thích -- đã bỏ) trên tệp bài. */
export const ma = (moTa, khop, phuDinh = false, tuy = {}) => ({ kiem: 'ma-nguon', moTa: hk(moTa), khop, tep: tuy.tep ?? TEP, ...(phuDinh ? { phuDinh: true } : {}), ...tuy });

/* ═══════════════════ CSDL mẫu ═══════════════════ */
/**
 * CT Shop MINI — cùng lược đồ 8 bảng với Lab 1–9 của khoá (content/courses/postgresql/lab/sql/ctshop-schema.sql, schema
 * `shop` ⇒ ở đây là public), dữ liệu là một LÁT CẮT nhỏ của dữ liệu lab: 12 danh mục y hệt, 16/48 sản phẩm GIỮ NGUYÊN id,
 * SKU, tên, giá; khách kh001–kh008 đặt tên đúng công thức của ctshop-data.sql; 14 đơn tháng 8–10/2026. Giờ theo
 * Asia/Ho_Chi_Minh như các lab (SET TimeZone ở đầu — PGlite mặc định lấy múi giờ của máy người học).
 */
export const CT_DDL = {
  customer: `CREATE TABLE customer (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text        NOT NULL,
  full_name   text        NOT NULL,
  phone       text,
  city        text        NOT NULL DEFAULT 'Hà Nội',
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customer_email_key   UNIQUE (email),
  CONSTRAINT customer_email_check CHECK (email = lower(email) AND email LIKE '%_@_%.__%')
);`,
  category: `CREATE TABLE category (
  id         int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text NOT NULL UNIQUE,
  parent_id  int  REFERENCES category(id) ON DELETE RESTRICT
);`,
  product: `CREATE TABLE product (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          text          NOT NULL UNIQUE,
  name         text          NOT NULL,
  category_id  int           NOT NULL REFERENCES category(id),
  price        numeric(12,2) NOT NULL CHECK (price > 0),
  stock        int           NOT NULL DEFAULT 0 CHECK (stock >= 0),
  attrs        jsonb         NOT NULL DEFAULT '{}',
  is_active    boolean       NOT NULL DEFAULT true,
  created_at   timestamptz   NOT NULL DEFAULT now()
);`,
  orders: `CREATE TABLE orders (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id  bigint      NOT NULL REFERENCES customer(id),
  status       text        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  note         text
);`,
  order_item: `CREATE TABLE order_item (
  order_id    bigint        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  bigint        NOT NULL REFERENCES product(id),
  qty         int           NOT NULL CHECK (qty > 0),
  unit_price  numeric(12,2) NOT NULL CHECK (unit_price > 0),
  PRIMARY KEY (order_id, product_id)
);`,
  payment: `CREATE TABLE payment (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id  bigint        NOT NULL UNIQUE REFERENCES orders(id),
  amount    numeric(12,2) NOT NULL CHECK (amount > 0),
  method    text          NOT NULL CHECK (method IN ('cod', 'card', 'momo', 'bank')),
  paid_at   timestamptz   NOT NULL DEFAULT now()
);`,
  stock_movement: `CREATE TABLE stock_movement (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  bigint      NOT NULL REFERENCES product(id),
  change      int         NOT NULL CHECK (change <> 0),
  reason      text        NOT NULL CHECK (reason IN ('import', 'sale', 'return', 'adjust')),
  order_id    bigint      REFERENCES orders(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);`,
  review: `CREATE TABLE review (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id   bigint      NOT NULL REFERENCES product(id),
  customer_id  bigint      NOT NULL REFERENCES customer(id),
  rating       smallint    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body         text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, customer_id)
);`,
};
/** DDL đủ 8 bảng (thứ tự tạo đúng khoá ngoại). */
export const CT_SCHEMA = Object.values(CT_DDL).join('\n');

export const CT_SHOP = `SET TimeZone = 'Asia/Ho_Chi_Minh';
${CT_SCHEMA}
INSERT INTO category (id, name, parent_id) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Bút & mực', NULL), (2, 'Vở & giấy', NULL), (3, 'Dụng cụ học tập', NULL), (4, 'Sách & tài liệu', NULL),
  (5, 'Bút bi', 1), (6, 'Bút chì & tẩy', 1), (7, 'Bút dạ quang', 1), (8, 'Vở ô ly', 2), (9, 'Sổ tay', 2),
  (10, 'Máy tính cầm tay', 3), (11, 'Thước & compa', 3), (12, 'Giáo trình IT', 4);
INSERT INTO product (id, sku, name, category_id, price, stock, attrs, is_active, created_at) OVERRIDING SYSTEM VALUE VALUES
  (1,  'CT0501', 'Bút bi Thiên Long TL-027 (xanh)',       5,   5000, 120, '{"brand": "Thiên Long", "color": "xanh", "tags": ["học sinh"]}', true, '2025-01-02 08:00+07'),
  (2,  'CT0502', 'Bút bi Thiên Long TL-079 (hộp 20 cây)', 5,  78000,  40, '{"brand": "Thiên Long", "color": "xanh", "tags": ["văn phòng"]}', true, '2025-01-03 08:00+07'),
  (4,  'CT0504', 'Bút gel Uni-ball Signo 0.5mm',          5,  28000,  65, '{"brand": "Uni", "color": "đen", "tags": ["sinh viên"]}', true, '2025-01-05 08:00+07'),
  (7,  'CT0601', 'Bút chì gỗ Thiên Long 2B GP-01',        6,   4000, 200, '{"brand": "Thiên Long", "color": "vàng", "tags": ["học sinh"]}', true, '2025-01-02 08:00+07'),
  (10, 'CT0604', 'Tẩy Pentel Hi-Polymer',                 6,   9000,   0, '{"brand": "Pentel", "color": "trắng", "tags": ["học sinh"]}', true, '2025-01-05 08:00+07'),
  (14, 'CT0702', 'Bút dạ quang Stabilo Boss Original',    7,  22000,  80, '{"brand": "Stabilo", "color": "vàng", "tags": ["sinh viên"]}', true, '2025-01-03 08:00+07'),
  (19, 'CT0801', 'Vở ô ly Hồng Hà 48 trang',              8,   6000, 300, '{"brand": "Hồng Hà", "tags": ["học sinh"]}', true, '2025-01-02 08:00+07'),
  (23, 'CT0805', 'Lốc 10 vở Hồng Hà 96 trang',            8, 105000,  25, '{"brand": "Hồng Hà", "tags": ["học sinh"]}', true, '2025-01-06 08:00+07'),
  (25, 'CT0901', 'Sổ lò xo Campus A5',                    9,  32000,  54, '{"brand": "Campus", "color": "xanh", "tags": ["sinh viên"]}', true, '2025-01-02 08:00+07'),
  (30, 'CT0906', 'Sổ tay Moleskine Classic A5',           9, 590000,   6, '{"brand": "Moleskine", "color": "đen", "tags": ["văn phòng"]}', true, '2025-01-07 08:00+07'),
  (31, 'CT1001', 'Máy tính Casio FX-580VN X',            10, 705000,  12, '{"brand": "Casio", "tags": ["học sinh", "sinh viên"]}', true, '2025-01-02 08:00+07'),
  (36, 'CT1006', 'Máy tính Deli D82TL',                  10, 285000,   0, '{"brand": "Deli", "tags": ["văn phòng"]}', false, '2025-01-07 08:00+07'),
  (37, 'CT1101', 'Thước kẻ nhựa Thiên Long 20cm',        11,   5000, 150, '{"brand": "Thiên Long", "tags": ["học sinh"]}', true, '2025-01-02 08:00+07'),
  (41, 'CT1105', 'Compa Staedtler Noris',                11,  85000,   9, '{"brand": "Staedtler", "tags": ["học sinh"]}', true, '2025-01-06 08:00+07'),
  (43, 'CT1201', 'Giáo trình Cơ sở dữ liệu (bản in)',    12,  89000,  30, '{"brand": "CT Books", "tags": ["sinh viên"]}', true, '2025-01-02 08:00+07'),
  (46, 'CT1204', 'Sổ tay SQL bỏ túi',                    12,  59000,  44, '{"brand": "CT Books", "tags": ["sinh viên"]}', true, '2025-01-05 08:00+07');
INSERT INTO customer (id, email, full_name, phone, city, created_at) OVERRIDING SYSTEM VALUE VALUES
  (1, 'kh001@ctshop.vn', 'Trần Thị Bình',    '0910007919', 'Hà Nội',    '2025-02-10 09:00+07'),
  (2, 'kh002@ctshop.vn', 'Lê Minh Chi',      '0930015838', 'TP.HCM',    '2025-03-01 10:30+07'),
  (3, 'kh003@ctshop.vn', 'Phạm Quốc Dũng',   '0940023757', 'Đà Nẵng',   '2025-03-15 14:00+07'),
  (4, 'kh004@ctshop.vn', 'Hoàng Thu Hà',     '0960031676', 'Hà Nội',    '2025-05-20 08:15+07'),
  (5, 'kh005@ctshop.vn', 'Vũ Gia Khoa',      '0970039595', 'Cần Thơ',   '2025-06-02 19:40+07'),
  (6, 'kh006@ctshop.vn', 'Đặng Văn Linh',    '0980047514', 'Hải Phòng', '2025-08-11 11:00+07'),
  (7, 'kh007@ctshop.vn', 'Bùi Thị Nam',      NULL,         'TP.HCM',    '2025-09-09 16:20+07'),
  (8, 'kh008@ctshop.vn', 'Nguyễn Minh Phúc', '0320063352', 'Đà Nẵng',   '2026-07-01 07:00+07');
INSERT INTO orders (id, customer_id, status, created_at) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 'shipped',   '2026-08-03 09:15+07'), (2, 1, 'paid',      '2026-09-12 20:40+07'),
  (3, 2, 'shipped',   '2026-08-10 14:05+07'), (4, 2, 'cancelled', '2026-08-22 10:00+07'),
  (5, 3, 'shipped',   '2026-08-28 16:30+07'), (6, 3, 'paid',      '2026-09-20 08:45+07'),
  (7, 3, 'pending',   '2026-10-01 21:10+07'), (8, 4, 'paid',      '2026-09-05 11:00+07'),
  (9, 5, 'shipped',   '2026-09-08 07:55+07'), (10, 5, 'shipped',  '2026-09-30 19:20+07'),
  (11, 6, 'pending',  '2026-10-02 09:00+07'), (12, 7, 'paid',     '2026-10-03 15:35+07'),
  (13, 1, 'shipped',  '2026-10-05 10:10+07'), (14, 6, 'cancelled', '2026-10-06 18:00+07');
INSERT INTO order_item (order_id, product_id, qty, unit_price) VALUES
  (1, 1, 3, 5000), (1, 19, 5, 6000), (1, 43, 1, 89000),
  (2, 31, 1, 705000), (2, 14, 2, 22000),
  (3, 2, 1, 75000), (3, 25, 2, 32000),
  (4, 30, 1, 590000),
  (5, 23, 1, 105000), (5, 7, 10, 4000), (5, 10, 2, 9000),
  (6, 46, 2, 59000), (6, 43, 1, 89000),
  (7, 41, 1, 85000), (7, 37, 2, 5000),
  (8, 4, 4, 28000), (8, 1, 10, 5000),
  (9, 31, 1, 705000),
  (10, 19, 10, 6000), (10, 25, 1, 32000), (10, 14, 3, 22000),
  (11, 2, 1, 78000),
  (12, 43, 2, 89000), (12, 46, 1, 59000),
  (13, 1, 5, 5000), (13, 4, 1, 28000),
  (14, 31, 1, 705000);
INSERT INTO payment (id, order_id, amount, method, paid_at) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 134000, 'card', '2026-08-03 11:15+07'), (2, 2, 749000, 'momo', '2026-09-12 22:40+07'),
  (3, 3, 139000, 'bank', '2026-08-10 16:05+07'), (4, 5, 163000, 'card', '2026-08-28 18:30+07'),
  (5, 6, 207000, 'momo', '2026-09-20 10:45+07'), (6, 8, 162000, 'cod',  '2026-09-05 13:00+07'),
  (7, 9, 705000, 'card', '2026-09-08 09:55+07'), (8, 10, 158000, 'momo', '2026-09-30 21:20+07'),
  (9, 12, 237000, 'cod', '2026-10-03 17:35+07'), (10, 13, 53000, 'card', '2026-10-05 12:10+07');
INSERT INTO stock_movement (id, product_id, change, reason, order_id, created_at) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 150, 'import', NULL, '2026-08-01 08:00+07'), (2, 19, 320, 'import', NULL, '2026-08-01 08:00+07'),
  (3, 31, 20, 'import', NULL, '2026-08-01 08:00+07'), (4, 1, -3, 'sale', 1, '2026-08-03 09:15+07'),
  (5, 19, -5, 'sale', 1, '2026-08-03 09:15+07'), (6, 43, -1, 'sale', 1, '2026-08-03 09:15+07'),
  (7, 31, -1, 'sale', 9, '2026-09-08 07:55+07');
INSERT INTO review (id, product_id, customer_id, rating, body, created_at) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 1, 5, 'Mực ra đều', '2026-08-08 09:15+07'), (2, 19, 1, 4, 'Giấy dày, viết êm', '2026-08-08 09:20+07'),
  (3, 2, 2, 4, 'Đúng mô tả', '2026-08-15 14:05+07'), (4, 25, 2, 5, 'Rất tốt, giao nhanh', '2026-08-15 14:10+07'),
  (5, 23, 3, 3, 'Tạm được', '2026-09-02 16:30+07'), (6, 31, 5, 5, 'Đóng gói kỹ', '2026-09-13 07:55+07'),
  (7, 14, 5, 2, 'Hơi đắt', '2026-10-05 19:20+07'), (8, 19, 5, 4, 'Đúng mô tả', '2026-10-05 19:25+07');

-- explicit ids above ⇒ move every identity sequence past them (the next INSERT without an id gets max(id) + 1)
SELECT setval(pg_get_serial_sequence('category', 'id'), 12), setval(pg_get_serial_sequence('product', 'id'), 48),
       setval(pg_get_serial_sequence('customer', 'id'), 8), setval(pg_get_serial_sequence('orders', 'id'), 14),
       setval(pg_get_serial_sequence('payment', 'id'), 10), setval(pg_get_serial_sequence('stock_movement', 'id'), 7),
       setval(pg_get_serial_sequence('review', 'id'), 8);`;

const LUOC_DO_BANG = `customer       (id PK, email UNIQUE lower-case, full_name, phone NULL, city DEFAULT 'Hà Nội', created_at timestamptz)
category       (id PK, name UNIQUE, parent_id → category.id — NULL = root)       12 rows: 1–4 roots, 5–12 children
product        (id PK, sku UNIQUE, name, category_id → category, price numeric(12,2) &gt; 0, stock int ≥ 0 DEFAULT 0,
                attrs jsonb DEFAULT '{}', is_active boolean DEFAULT true, created_at)          16 rows (ids 1…46, gaps)
orders         (id PK, customer_id → customer, status pending|paid|shipped|cancelled, created_at timestamptz, note)   14 rows
order_item     (order_id → orders ON DELETE CASCADE, product_id → product, qty &gt; 0, unit_price) — PK (order_id, product_id)
payment        (id PK, order_id UNIQUE → orders, amount, method cod|card|momo|bank, paid_at)    one per paid/shipped order
stock_movement (id PK, product_id → product, change ≠ 0, reason import|sale|return|adjust, order_id NULL, created_at)
review         (id PK, product_id → product, customer_id → customer, rating 1–5, body, created_at) — UNIQUE (product_id, customer_id)`;

export const LUOC_DO_CT_SHOP = {
  en: `<h4>Sample database: CT Shop mini (the course's lab project, sliced)</h4>
<pre>${LUOC_DO_BANG}</pre>
<p>Same 8 tables as Labs 1–9 (in schema <code>public</code> instead of <code>shop</code>); the rows are a small slice of the lab data — same category tree, same product ids/SKUs/prices. Every <code>id</code> is <code>GENERATED ALWAYS AS IDENTITY</code>: leave it out of INSERT. Times are <code>timestamptz</code> shown in Asia/Ho_Chi_Minh. Full script: the <code>ctshop.sql</code> tab.</p>`,
  vi: `<h4>CSDL mẫu: CT Shop mini (dự án lab của khoá, cắt nhỏ)</h4>
<pre>${LUOC_DO_BANG}</pre>
<p>Đúng 8 bảng của Lab 1–9 (ở schema <code>public</code> thay vì <code>shop</code>); dữ liệu là một lát nhỏ của dữ liệu lab — cùng cây danh mục, cùng id/SKU/giá sản phẩm. Mọi <code>id</code> là <code>GENERATED ALWAYS AS IDENTITY</code>: bỏ cột id khi INSERT. Thời gian là <code>timestamptz</code> hiển thị theo giờ Asia/Ho_Chi_Minh. Script đầy đủ: tab <code>ctshop.sql</code>.</p>`,
};

const KHOI_DAU_MAC_DINH = `-- Write your PostgreSQL statement(s) below. Each check runs on a fresh copy of the sample database, then rolls back.
-- Viết (các) câu PostgreSQL bên dưới. Mỗi kiểm chạy trên một bản CSDL mẫu sạch rồi huỷ.
-- Ctrl/⌘ + Enter: run sample checks · + Shift: submit.

`;

const tepThamChieu = (ten, csdl) => `-- ${ten}: sample schema + data of this task (READ ONLY — the grader loads it by itself; editing this tab changes nothing).
-- ${ten}: lược đồ + dữ liệu mẫu của bài (CHỈ ĐỂ ĐỌC — máy chấm tự nạp; sửa tab này không ảnh hưởng gì).
-- Plain PostgreSQL: run it as-is in psql to get the same database on your machine.
${csdl.trim()}
`;

/** Thuật ngữ hay dùng (ghép vào `thuatNgu` của từng đề). */
export const TN = {
  returning: { en: 'RETURNING', vi: 'trả về dòng vừa ghi', giaiThich: 'INSERT/UPDATE/DELETE … RETURNING cột ⇒ lệnh ghi trả lại các dòng nó vừa đụng tới — khỏi phải SELECT lại.' },
  identity: { en: 'identity column', vi: 'cột tự tăng', giaiThich: 'GENERATED … AS IDENTITY: PostgreSQL tự cấp số từ một sequence khi INSERT bỏ cột đó.' },
  upsert: { en: 'UPSERT (ON CONFLICT)', vi: 'chèn hoặc cập nhật', giaiThich: 'INSERT … ON CONFLICT (khoá) DO UPDATE / DO NOTHING: trùng khoá thì sửa dòng cũ hoặc bỏ qua, trong MỘT lệnh nguyên tử.' },
  excluded: { en: 'EXCLUDED', vi: 'dòng định chèn', giaiThich: 'Trong ON CONFLICT DO UPDATE, EXCLUDED là dòng bạn định chèn mà bị trùng khoá.' },
  limit: { en: 'LIMIT / OFFSET', vi: 'giới hạn / bỏ qua', giaiThich: 'LIMIT n lấy tối đa n dòng; OFFSET k bỏ k dòng đầu. Chỉ có nghĩa khi có ORDER BY.' },
  tieBreak: { en: 'tie-breaker', vi: 'khoá phá hoà', giaiThich: 'Cột thêm vào cuối ORDER BY (thường là id) để hai dòng bằng nhau luôn ra cùng một thứ tự.' },
  distinctOn: { en: 'DISTINCT ON', vi: 'mỗi nhóm một dòng', giaiThich: 'DISTINCT ON (a) giữ dòng ĐẦU TIÊN của mỗi giá trị a theo thứ tự ORDER BY (riêng PostgreSQL).' },
  cte: { en: 'CTE (WITH)', vi: 'truy vấn con có tên', giaiThich: 'WITH ten AS (SELECT …) — đặt tên cho một bước trung gian rồi dùng như một bảng.' },
  recursive: { en: 'recursive CTE', vi: 'CTE đệ quy', giaiThich: 'WITH RECURSIVE: phần neo (anchor) UNION ALL phần đệ quy tự nối vào chính nó, lặp tới khi không còn dòng mới.' },
  cycle: { en: 'CYCLE clause', vi: 'chống vòng lặp', giaiThich: 'CYCLE cot SET is_cycle USING path (PostgreSQL 14+): đánh dấu dòng quay lại nút đã đi qua để đệ quy dừng.' },
  pk: { en: 'PRIMARY KEY', vi: 'khoá chính', giaiThich: 'Định danh duy nhất mỗi dòng: UNIQUE + NOT NULL, có sẵn một chỉ mục B-tree.' },
  fk: { en: 'FOREIGN KEY', vi: 'khoá ngoại', giaiThich: 'Giá trị phải có ở cột khoá của bảng được tham chiếu (toàn vẹn tham chiếu).' },
  check: { en: 'CHECK constraint', vi: 'ràng buộc kiểm tra', giaiThich: 'Điều kiện mọi dòng phải thoả; NULL (UNKNOWN) vẫn lọt qua CHECK.' },
  nullT: { en: 'NULL', vi: 'giá trị chưa biết', giaiThich: 'So sánh với NULL bằng = / <> cho UNKNOWN ⇒ dòng bị loại. Dùng IS NULL / IS DISTINCT FROM.' },
  join: { en: 'INNER JOIN', vi: 'nối trong', giaiThich: 'Chỉ giữ cặp dòng thoả điều kiện ON ở cả hai bảng.' },
  leftJoin: { en: 'LEFT JOIN', vi: 'nối ngoài trái', giaiThich: 'Giữ MỌI dòng bảng trái; không có cặp ⇒ cột bảng phải là NULL.' },
  groupBy: { en: 'GROUP BY', vi: 'gộp nhóm', giaiThich: 'Mỗi nhóm giá trị giống nhau ⇒ một dòng kết quả.' },
  having: { en: 'HAVING', vi: 'lọc nhóm', giaiThich: 'Lọc NHÓM sau khi gộp; WHERE lọc dòng trước khi gộp.' },
  filter: { en: 'FILTER (WHERE …)', vi: 'tổng hợp có điều kiện', giaiThich: 'count(*) FILTER (WHERE status = \'paid\') — hàm tổng hợp chỉ đếm/cộng các dòng thoả điều kiện.' },
  window: { en: 'window function', vi: 'hàm cửa sổ', giaiThich: 'Hàm … OVER (PARTITION BY … ORDER BY …): tính trên một nhóm dòng mà KHÔNG gộp các dòng lại.' },
  explain: { en: 'EXPLAIN', vi: 'xem kế hoạch', giaiThich: 'In kế hoạch thực thi bộ lập kế hoạch chọn; EXPLAIN ANALYZE chạy thật và in số đo thật.' },
  index: { en: 'index', vi: 'chỉ mục', giaiThich: 'Cấu trúc phụ (thường B-tree) giúp tìm dòng theo cột mà không đọc cả bảng; đổi lại mỗi lần ghi phải cập nhật nó.' },
  txn: { en: 'transaction', vi: 'giao dịch', giaiThich: 'Nhóm lệnh được tất cả hoặc không gì (BEGIN … COMMIT / ROLLBACK).' },
  jsonb: { en: 'jsonb', vi: 'JSON nhị phân', giaiThich: 'Kiểu tài liệu JSON lưu dạng đã phân tích: so sánh, chứa (@>), đánh chỉ mục GIN được.' },
};

/* ═══════════════════ đề SQL nhỏ ═══════════════════ */
/**
 * Một đề SQL PostgreSQL nhỏ (thẻ kiểu LeetCode). Trường giống README mục 2; thêm:
 *   giai: lời giải (một chuỗi SQL) · khoiDau?: mã khởi đầu · csdl? (mặc định CT_SHOP; '' ⇒ CSDL rỗng) · tenCsdl?
 *   luocDo? ({en,vi} HTML; null ⇒ không in) · tep? (mặc định query.sql) · kiem: [...] · tuy?: tuỳ chọn chung (timeoutMs…)
 */
export function sqlPg({ giai, khoiDau, csdl = CT_SHOP, tenCsdl, luocDo, tep = TEP, kiem, moTa, tuy = {}, ...rest }) {
  const ten = tenCsdl ?? (csdl === CT_SHOP ? 'ctshop' : 'setup');
  const ld = luocDo === null ? null : luocDo ?? (csdl === CT_SHOP ? LUOC_DO_CT_SHOP : null);
  const them = (lang) => (ld ? `\n${ld[lang]}` : '');
  const thamChieu = csdl ? { [`${ten}.sql`]: tepThamChieu(`${ten}.sql`, csdl) } : {};
  return {
    ...rest,
    ngonNgu: 'sql',
    moTa: { en: `${moTa.en}${them('en')}`, vi: `${moTa.vi}${them('vi')}` },
    khoiDau: { [tep]: khoiDau ?? KHOI_DAU_MAC_DINH, ...thamChieu },
    loiGiai: { [tep]: giai, ...thamChieu },
    tests: { loai: 'sql-pg', csdl: csdl ?? '', tepChinh: tep, ...tuy, kiem },
  };
}

/**
 * Lối soạn GỌN của sqlPg:
 *   pg({ t, k:'EASY'|'MEDIUM'|'HARD', p: phút, kn:[khái niệm], tag:[thẻ], en, vi (HTML mô tả), yc:[[en,vi]…],
 *        giai, kiem, sai:[câu sai mẫu], gy:[[en,vi]…] (≥2), lhg:[[en,vi]…] (≥2), gt:[en,vi] (HTML), tn:[thuật ngữ],
 *        csdl?, tenCsdl?, ld? (luocDo), khoi? (mã khởi đầu), tuy?, tq? (tiên quyết), dangBai? })
 */
export function pg(o) {
  return sqlPg({
    tieuDe: o.t, doKho: o.k, phut: o.p, khaiNiem: o.kn || [], the: ['postgresql', ...(o.tag || [])],
    ...(o.tq ? { tienQuyet: o.tq } : {}), ...(o.dangBai ? { dangBai: o.dangBai } : {}), ...(o.diem ? { diem: o.diem } : {}),
    moTa: { en: o.en, vi: o.vi },
    yeuCau: { en: o.yc.map((x) => x[0]), vi: o.yc.map((x) => x[1]) },
    giai: o.giai, ...(o.khoi ? { khoiDau: o.khoi } : {}),
    ...(o.csdl !== undefined ? { csdl: o.csdl } : {}), ...(o.tenCsdl ? { tenCsdl: o.tenCsdl } : {}),
    ...(o.ld !== undefined ? { luocDo: o.ld } : {}),
    kiem: o.kiem, ...(o.sai ? { saiMau: o.sai } : {}), ...(o.tuy ? { tuy: o.tuy } : {}),
    goiY: o.gy.map(bv), loiHayGap: o.lhg.map(bv),
    giaiThich: bv(o.gt), thuatNgu: o.tn || [],
  });
}

/* ═══════════════════ đề tĩnh: choice / order / table (không có gì để chạy) ═══════════════════ */
/** Câu song ngữ cho choice/order/table (EN chính, VI nghiêng ngay dưới). */
export const hai = (en, vi) => `<p>${en}</p>${vi ? `<p style="opacity:.75;font-size:.92em"><i>${vi}</i></p>` : ''}`;
/** Giải thích song ngữ trong một khối. */
export const giai = (en, vi) => `<p>${en}</p>${vi ? `<p><i>VI: ${vi}</i></p>` : ''}`;
const lc = (...ds) => ds.map(([ma_, noiDung]) => ({ ma: ma_, noiDung }));
const chu = (h) => String(h || '').replace(/<\/?[a-zA-Z][^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const MAC_DINH_YC = [
  { en: 'Answer every question in the answer panel, then press <b>Submit</b>.', vi: 'Trả lời mọi câu trong khung trả lời rồi bấm <b>Nộp</b>.' },
  { en: 'All answers must be correct to get <b>Accepted</b>; the explanation of every question appears after you submit.', vi: 'Đúng hết mới được <b>Accepted</b>; giải thích từng câu hiện sau khi nộp.' },
];
const MAC_DINH_VIDU = [{ input: 'Question → choose / fill', output: 'Correct / Incorrect + explanation after Submit|||Đúng / Sai + giải thích sau khi Nộp', explanation: 'Each question (or table cell) is one check.|||Mỗi câu (hoặc ô) là một kiểm.' }];

function tinh(q0) {
  const q = { ...q0 };
  const loai = q.loai || 'choice';
  if (loai === 'choice') { q.cauHoi = xaoCauHoi(q.cauHoi); q.giaiThich = loiGiaiTracNghiem(q.cauHoi, q.giaiThich); }
  if (loai === 'order') { q.cauHoi = q.cauHoi.map(xaoThuTu); if (!q.giaiThich) q.giaiThich = q.cauHoi.map((x) => x.giaiThich).join(''); }
  if (loai === 'table' && !q.giaiThich) q.giaiThich = q.bang.map((b) => b.giaiThich).join('');
  const ds = loai === 'table' ? q.bang : q.cauHoi;
  const de = ds.map((x, i) => `${i + 1}. ${chu(x.de)}`).join('\n');
  let dap;
  if (loai === 'table') {
    dap = ds.map((b, i) => `${i + 1}. ${chu(b.de)}\n${Object.entries(b.dapAn).map(([o, v]) => `   - ${o}: ${Array.isArray(v) ? v.join(' / ') : v}`).join('\n')}\n   ${chu(b.giaiThich)}`).join('\n\n');
  } else {
    dap = ds.map((x, i) => {
      const d = Array.isArray(x.dapAn) ? (Array.isArray(x.dapAn[0]) ? x.dapAn[0] : x.dapAn) : [x.dapAn];
      const muc = x.luaChon || x.muc || [];
      const ten = d.map((m) => `${m}) ${chu(muc.find((y) => y.ma === m)?.noiDung)}`).join(loai === 'order' ? '  →  ' : ' + ');
      return `${i + 1}. ${chu(x.de)}\n   Answer: ${ten}\n   ${chu(x.giaiThich)}`;
    }).join('\n\n');
  }
  const tests = loai === 'table' ? { loai, bang: q.bang } : { loai, cauHoi: q.cauHoi };
  const { cauHoi: _c, bang: _b, loai: _l, ...rest } = q;
  void _c; void _b; void _l;
  const tieu = typeof q.tieuDe === 'string' ? q.tieuDe : q.tieuDe.en;
  const dem = ds.length;
  const them = {
    en: `<p><i>This set has ${dem} ${loai === 'table' ? (dem > 1 ? 'tables' : 'table') : (dem > 1 ? 'questions' : 'question')}. There is nothing to run: answer in the panel on the right and press Submit. Work each one out yourself first (on paper or in psql on your own PostgreSQL), then check — every explanation after Submit says why the tempting wrong answer is wrong.</i></p>`,
    vi: `<p><i>Bộ này có ${dem} ${loai === 'table' ? 'bảng' : 'câu'}. Không có gì để chạy: trả lời trong khung bên phải rồi bấm Nộp. Hãy tự giải trước (ra giấy hoặc chạy trong psql trên PostgreSQL của bạn) rồi mới kiểm — giải thích sau khi Nộp nói rõ vì sao phương án "trông đúng" lại sai.</i></p>`,
  };
  const moTa = { en: q.moTa.en + them.en, vi: (q.moTa.vi || q.moTa.en) + them.vi };
  return {
    ngonNgu: 'text', the: ['postgresql'], dangBai: 'practice', yeuCau: MAC_DINH_YC, viDu: MAC_DINH_VIDU, thuatNgu: [],
    ...rest, moTa, tests,
    khoiDau: { 'answers.md': `# ${tieu}\n\nAnswer in the answer panel (no code needed).\n\n${de}\n` },
    loiGiai: { 'answers.md': `# ${tieu} — answer key\n\n${dap}\n` },
  };
}
/** Một câu trắc nghiệm: đáp án đúng là phương án ĐẦU trong `opts` (tinh() xáo theo nội dung). de/gt = [en, vi]. */
export function q(ma_, de, opts, gt) {
  return { ma: ma_, de: hai(de[0], de[1]), luaChon: lc(...opts.map((t, i) => ['abcdef'[i], t])), dapAn: ['a'], giaiThich: giai(gt[0], gt[1]) };
}
/** Trắc nghiệm nhiều đáp án: `dung` = chỉ số (0-based) các phương án đúng. */
export function qn(ma_, de, opts, dung, gt) {
  return { ma: ma_, de: hai(de[0], de[1]), luaChon: lc(...opts.map((t, i) => ['abcdef'[i], t])), dapAn: [dung.map((i) => 'abcdef'[i]).sort()], nhieu: true, giaiThich: giai(gt[0], gt[1]) };
}
/** Sắp thứ tự: các bước viết ĐÚNG thứ tự; tinh() xáo và đổi mã. */
export function ord(ma_, de, steps, gt) {
  return { ma: ma_, de: hai(de[0], de[1]), muc: steps.map((n, i) => ({ ma: `s${i + 1}`, noiDung: n })), dapAn: steps.map((_, i) => `s${i + 1}`), giaiThich: giai(gt[0], gt[1]) };
}
/** Một bảng: bang1(ma, [en,vi], cot:[{ma,ten,luaChon?}], hang:[{o:{cột:'cho sẵn'}, a:{cột:'đáp án'|[các dạng]}}], [giải en, vi]) */
export function bang1(ma_, de, cot, hang, gt) {
  const dapAn = {};
  hang.forEach((h, i) => { for (const [k, v] of Object.entries(h.a)) dapAn[`r${i + 1}.${k}`] = v; });
  return { ma: ma_, de: hai(de[0], de[1]), cot, hang: hang.map((h, i) => ({ ma: `r${i + 1}`, o: h.o })), dapAn, giaiThich: giai(gt[0], gt[1]) };
}
/** Bộ tĩnh: cs({ t, k, p, en, vi, cau | bang, loai?, gy, lhg, tn?, kn? }) — gy/lhg là [[en, vi]…]; en/vi là HTML. */
export function cs({ t, k, p, en, vi, cau, bang, loai = 'choice', gy, lhg, tn: thuat = [], kn = [], tag = [] }) {
  return tinh({
    tieuDe: t, doKho: k, phut: p, moTa: { en, vi }, loai, ...(loai === 'table' ? { bang } : { cauHoi: cau }),
    goiY: gy.map(bv), loiHayGap: lhg.map(bv), thuatNgu: thuat, khaiNiem: kn, the: ['postgresql', ...tag],
  });
}

/* ═══════════════════ đề chạy TRÊN MÁY người học (không chấm trên web) ═══════════════════ */
/**
 * tay({ t, k, p, en, vi, yc:[[en,vi]], lenh, lyDo:[en,vi], tep:{ 'ten': 'nội dung' } (khởi đầu), giaiTep:{…} (lời giải),
 *       viDu:[{input, output, explanation}], gy, lhg, gt, tn, kn, tag })
 * ⇒ tests { loai: 'manual', chayTaiMay: { lenh, lyDo } }: trang hiện "Tự đánh dấu đã giải", không có gì giả đạt.
 */
export function tay({ t, k, p, en, vi, yc, lenh, lyDo, tep, giaiTep, viDu, gy, lhg, gt, tn: thuat = [], kn = [], tag = [] }) {
  const ghi = {
    en: `<p class="callout warn"><b>Runs on YOUR machine, not in the browser.</b> ${lyDo[0]} Nothing here is graded automatically: do the steps in your own PostgreSQL, compare with the expected output, then press <b>Mark as solved</b>.</p>`,
    vi: `<p class="callout warn"><b>Chạy trên MÁY CỦA BẠN, không chạy trong trình duyệt.</b> ${lyDo[1]} Trang này không tự chấm: làm các bước trên PostgreSQL của bạn, so với output mong đợi, rồi bấm <b>Tự đánh dấu đã giải</b>.</p>`,
  };
  return {
    tieuDe: t, doKho: k, phut: p, khaiNiem: kn, the: ['postgresql', 'chay-tai-may', ...tag], ngonNgu: 'sql',
    moTa: { en: en + ghi.en, vi: vi + ghi.vi },
    yeuCau: { en: yc.map((x) => x[0]), vi: yc.map((x) => x[1]) },
    viDu: viDu.map((v) => ({ input: hk(v.input), output: hk(v.output), explanation: hk(v.explanation) })),
    goiY: gy.map(bv), loiHayGap: lhg.map(bv), giaiThich: bv(gt), thuatNgu: thuat,
    khoiDau: tep, loiGiai: giaiTep,
    tests: { loai: 'manual', chayTaiMay: { lenh, lyDo: hk(lyDo) } },
    loaiKiem: 'manual',
  };
}

/* ═══════════════════ ĐỀ LỚN (Lab chương — "bản in", mỗi câu một tệp Qi.sql) ═══════════════════ */
/**
 * deLonPg({ tieuDe:{en,vi}, phu, moTa, chucNangChinh?, yeuCauChung, csdl, tenCsdl, moHinh:[{ten, truong}], duLieuMau?,
 *           cau:[{ ten:{en,vi}, diem, moTa:{en,vi}, yeuCau:[{en,vi}], giai, kiem:[...], saiMau? }], truDiem, nopBai, thuMuc, … })
 * Kiểm của câu i tự gắn tep 'Qi.sql' + nhom 'fi' (thang điểm theo câu). Câu cần CSDL riêng ⇒ `csdl` trên từng kiểm.
 */
export function deLonPg({ tieuDe, phu, moTa, chucNangChinh, yeuCauChung, csdl, tenCsdl = 'ctshop', moHinh, duLieuMau, cau, truDiem, nopBai, thuMuc, tuy = {}, ...rest }) {
  const tep = (i) => `Q${i + 1}.sql`;
  const en = (x) => (typeof x === 'string' ? x : x.en);
  const thamChieu = csdl ? { [`${tenCsdl}.sql`]: tepThamChieu(`${tenCsdl}.sql`, csdl) } : {};
  const khoiDau = Object.fromEntries(cau.map((x, i) => [tep(i), `-- Q${i + 1}. ${en(x.ten)}\n-- Write only the statement(s) that answer this question. Each question is graded on a fresh copy of ${tenCsdl}.sql.\n-- Chỉ viết (các) lệnh trả lời câu này. Mỗi câu được chấm trên một bản ${tenCsdl}.sql sạch.\n\n`]));
  const loiGiai = Object.fromEntries(cau.map((x, i) => [tep(i), x.giai]));
  const kiem = cau.flatMap((x, i) => x.kiem.map((k) => ({ ...k, tep: tep(i), nhom: `f${i + 1}` })));
  const saiMau = cau.flatMap((x, i) => (x.saiMau || []).map((s) => ({ [tep(i)]: s })));
  const cay = `${thuMuc}/\n${cau.map((x, i) => `├── ${tep(i)}    -- ${en(x.ten)} (${x.diem} ${x.diem === 1 ? 'mark' : 'marks'})`).join('\n')}`;
  const banIn = {
    tieuDe, phu, moTa, chucNangChinh, yeuCauChung,
    tieuDeCay: { en: 'Submission files', vi: 'Tệp nộp bài' }, cayThuMuc: cay, moHinh, duLieuMau,
    chucNang: cau.map((x) => ({ ten: x.ten, diem: x.diem, moTa: x.moTa, yeuCau: x.yeuCau })), truDiem, nopBai,
  };
  void thangDiemTu;
  return {
    ...rest,
    tieuDe: en(tieuDe), ngonNgu: 'sql',
    dauVao: { en: `The database built by ${tenCsdl}.sql (schema below; full script in the ${tenCsdl}.sql tab).`, vi: `CSDL dựng bởi ${tenCsdl}.sql (lược đồ bên dưới; script đầy đủ ở tab ${tenCsdl}.sql).` },
    dauRa: { en: 'One file per question (Q1.sql … Qn.sql) containing only the statement(s) that answer it; each question is graded independently on a fresh database.', vi: 'Mỗi câu một tệp (Q1.sql … Qn.sql) chỉ chứa (các) lệnh trả lời câu đó; mỗi câu chấm độc lập trên một CSDL sạch.' },
    banIn,
    khoiDau: { ...khoiDau, ...thamChieu },
    loiGiai: { ...loiGiai, ...thamChieu },
    tests: { loai: 'sql-pg', csdl: csdl ?? '', tepChinh: tep(0), ...tuy, kiem },
    saiMau,
  };
}

/** Một module = một bài học (slug = slug bài học ⇒ thẻ "🏋️ Luyện tập" dưới video bài đó tự hiện, có nút về đúng bài). */
export const mod = (slug, ten, de) => doiDau({ slug, ten, khoa: KHOA, baiHoc: slug, de });

/* ═══════════════════ tiện ích kiểm kế hoạch (Ch9–Ch10) ═══════════════════ */
/**
 * Hàm trợ giúp đặt vào CSDL của đề: plan_nodes(q) ⇒ mọi "Node Type" (+ tên chỉ mục) trong EXPLAIN (FORMAT JSON) của q.
 * Kiểm "có dùng chỉ mục không" KHÔNG dựa vào chi phí (dữ liệu nhỏ ⇒ planner hay chọn Seq Scan): kiemTra đặt
 * `SET LOCAL enable_seqscan = off` trước — còn chỉ mục DÙNG ĐƯỢC thì planner phải chọn nó; không có thì vẫn Seq Scan.
 */
export const PLAN_FN = `CREATE FUNCTION plan_nodes(q text) RETURNS text LANGUAGE plpgsql AS $f$
DECLARE j json; out text := '';
BEGIN
  EXECUTE 'EXPLAIN (FORMAT JSON, COSTS OFF) ' || q INTO j;
  WITH RECURSIVE n(p) AS (SELECT j -> 0 -> 'Plan' UNION ALL SELECT x FROM n, json_array_elements(n.p -> 'Plans') x)
  SELECT string_agg((p ->> 'Node Type') || coalesce(' on ' || (p ->> 'Index Name'), ''), ' / ') INTO out FROM n;
  RETURN out;
END $f$;`;

/** plan_text(q): EXPLAIN (COSTS OFF) dạng chữ (mỗi dòng một nút/điều kiện) · plan_rows(q): số dòng ƯỚC LƯỢNG của nút gốc ·
 *  plan_analyze(q): EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF) — số dòng thật, Sort Method… (tất định). */
export const PLAN_MORE = `CREATE FUNCTION plan_text(q text) RETURNS text LANGUAGE plpgsql AS $f$
DECLARE r record; out text := '';
BEGIN
  FOR r IN EXECUTE 'EXPLAIN (COSTS OFF) ' || q LOOP out := out || r."QUERY PLAN" || E'\\n'; END LOOP;
  RETURN out;
END $f$;
CREATE FUNCTION plan_rows(q text) RETURNS bigint LANGUAGE plpgsql AS $f$
DECLARE j json;
BEGIN
  EXECUTE 'EXPLAIN (FORMAT JSON) ' || q INTO j;
  RETURN (j -> 0 -> 'Plan' ->> 'Plan Rows')::numeric::bigint;
END $f$;
CREATE FUNCTION plan_analyze(q text) RETURNS text LANGUAGE plpgsql AS $f$
DECLARE r record; out text := '';
BEGIN
  FOR r IN EXECUTE 'EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF, BUFFERS OFF) ' || q LOOP out := out || r."QUERY PLAN" || E'\\n'; END LOOP;
  RETURN out;
END $f$;`;
/** Hàm kiểm kế hoạch dùng chung (plan_nodes + plan_text + plan_rows + plan_analyze). */
export const PLAN_ALL = `${PLAN_FN}\n${PLAN_MORE}`;
