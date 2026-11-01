/** PostgreSQL · 3.3 — Ràng buộc cột: NOT NULL, DEFAULT, UNIQUE, CHECK & cột sinh. */
import { mod, pg, sau, chan, duoc, ma, pre, TN, tn } from './_chung.mjs';

const P_DDL = `CREATE TABLE product (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          text NOT NULL UNIQUE,
  name         text NOT NULL,
  price        numeric(12,2) NOT NULL CHECK (price >= 0),
  discount_pct int NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 100),
  final_price  numeric(12,2) GENERATED ALWAYS AS (round(price * (100 - discount_pct) / 100, 2)) STORED,
  created_at   timestamptz NOT NULL DEFAULT now()
);`;

export default mod('postgresql-3-3-rang-buoc-cot', '3.3 Column constraints: NOT NULL, DEFAULT, UNIQUE, CHECK & generated columns', [
  pg({
    t: 'Five rules on one product table', k: 'EASY', p: 10, kn: ['NOT NULL', 'DEFAULT', 'UNIQUE', 'CHECK … BETWEEN'], tag: ['ddl', 'constraints'],
    csdl: '', ld: null,
    en: `<p>Create the product table of lesson 3.3 (without the generated column for now):</p>${pre(`product: id bigint identity PK · sku text required, unique · name text required
         price numeric(12,2) required, ≥ 0 · discount_pct int required, default 0, between 0 and 100
         created_at timestamptz required, default now()`)}`,
    vi: `<p>Tạo bảng product của bài 3.3 (tạm chưa có cột sinh):</p>${pre(`product: id bigint identity PK · sku text bắt buộc, duy nhất · name text bắt buộc
         price numeric(12,2) bắt buộc, ≥ 0 · discount_pct int bắt buộc, mặc định 0, từ 0 tới 100
         created_at timestamptz bắt buộc, mặc định now()`)}`,
    yc: [['Every rule as a constraint in the table definition.', 'Mọi luật là ràng buộc trong định nghĩa bảng.'], ['A product inserted with only sku, name, price must get discount 0.', 'Sản phẩm chèn chỉ có sku, name, price phải nhận giảm giá 0.']],
    giai: `CREATE TABLE product (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          text NOT NULL UNIQUE,
  name         text NOT NULL,
  price        numeric(12,2) NOT NULL CHECK (price >= 0),
  discount_pct int NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 100),
  created_at   timestamptz NOT NULL DEFAULT now()
);`,
    kiem: [
      sau(['Defaults fill discount_pct and created_at', 'Mặc định điền discount_pct và created_at'], "INSERT INTO product (sku, name, price) VALUES ('A2', 'Mouse', 49.99); SELECT sku, price, discount_pct, created_at IS NOT NULL AS has_time FROM product"),
      chan(['Duplicate SKU', 'Trùng SKU'], "INSERT INTO product (sku, name, price) VALUES ('A1', 'x', 1), ('A1', 'Dup SKU', 10)", '23505'),
      chan(['Negative price', 'Giá âm'], "INSERT INTO product (sku, name, price) VALUES ('A3', 'Bad price', -5)", '23514'),
      chan(['Discount 150 %', 'Giảm giá 150 %'], "INSERT INTO product (sku, name, price, discount_pct) VALUES ('A4', 'x', 10, 150)", '23514'),
      chan(['Missing price', 'Thiếu giá'], "INSERT INTO product (sku, name) VALUES ('A5', 'No price')", '23502', { an: true }),
      duoc(['A free item (price 0) and 100 % off are both legal', 'Hàng tặng (giá 0) và giảm 100 % đều hợp lệ'], "INSERT INTO product (sku, name, price, discount_pct) VALUES ('A6', 'Gift', 0, 100)", { an: true }),
    ],
    sai: ['CREATE TABLE product (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, sku text NOT NULL UNIQUE, name text NOT NULL, price numeric(12,2) NOT NULL CHECK (price > 0), discount_pct int NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 100), created_at timestamptz NOT NULL DEFAULT now())', 'CREATE TABLE product (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, sku text NOT NULL UNIQUE, name text NOT NULL, price numeric(12,2) NOT NULL CHECK (price >= 0), discount_pct int CHECK (discount_pct BETWEEN 0 AND 100), created_at timestamptz NOT NULL DEFAULT now())'],
    gy: [['Column constraints follow the type: <code>price numeric(12,2) NOT NULL CHECK (price &gt;= 0)</code>.', 'Ràng buộc cột viết sau kiểu: <code>price numeric(12,2) NOT NULL CHECK (price &gt;= 0)</code>.'], ['<code>BETWEEN 0 AND 100</code> includes both ends.', '<code>BETWEEN 0 AND 100</code> gồm cả hai đầu.']],
    lhg: [['<code>CHECK (price &gt; 0)</code> when the rule says ≥ 0 — gifts at price 0 are refused.', '<code>CHECK (price &gt; 0)</code> khi luật nói ≥ 0 — hàng tặng giá 0 bị từ chối.'], ['A DEFAULT without NOT NULL: an explicit NULL still gets in.', 'DEFAULT mà thiếu NOT NULL: NULL ghi tường minh vẫn lọt vào.']],
    gt: ['<p>Each rule you write in the table is enforced on every INSERT and UPDATE, from every client. DEFAULT fills omitted columns; NOT NULL is what stops an explicit NULL.</p>', '<p>Mỗi luật viết trong bảng được áp ở mọi INSERT và UPDATE, từ mọi client. DEFAULT điền cột bị bỏ qua; NOT NULL mới chặn NULL ghi tường minh.</p>'],
    tn: [TN.check, tn('DEFAULT', 'giá trị mặc định')],
  }),

  pg({
    t: 'A generated final price that can never be wrong', k: 'MEDIUM', p: 8, kn: ['GENERATED ALWAYS AS … STORED'], tag: ['ddl', 'generated'],
    csdl: P_DDL.replace(/\n  final_price[^\n]*\n/, '\n'), tenCsdl: 'product', ld: { en: pre('product (id, sku, name, price, discount_pct, created_at) — empty, no final_price yet'), vi: pre('product (id, sku, name, price, discount_pct, created_at) — rỗng, chưa có final_price') },
    en: '<p>The app sometimes forgets to recompute the final price after a discount change. Add a column <code>final_price numeric(12,2)</code> that PostgreSQL computes itself: <code>round(price × (100 − discount_pct) / 100, 2)</code>, stored, and impossible to write by hand.</p>',
    vi: '<p>App đôi khi quên tính lại giá cuối sau khi đổi giảm giá. Thêm cột <code>final_price numeric(12,2)</code> do chính PostgreSQL tính: <code>round(price × (100 − discount_pct) / 100, 2)</code>, lưu sẵn, và không ai ghi tay được.</p>',
    yc: [['<code>ALTER TABLE product ADD COLUMN final_price numeric(12,2) GENERATED ALWAYS AS (…) STORED</code>.', '<code>ALTER TABLE product ADD COLUMN final_price numeric(12,2) GENERATED ALWAYS AS (…) STORED</code>.'], ['The expression uses only columns of the same row.', 'Biểu thức chỉ dùng cột của cùng dòng.']],
    giai: `ALTER TABLE product
  ADD COLUMN final_price numeric(12,2)
  GENERATED ALWAYS AS (round(price * (100 - discount_pct) / 100, 2)) STORED;   -- recomputed on every write`,
    kiem: [
      sau(['Keyboard 100 −10 % = 90.00, Mouse 49.99 = 49.99', 'Bàn phím 100 −10 % = 90.00, chuột 49.99 = 49.99'], "INSERT INTO product (sku, name, price, discount_pct) VALUES ('A1', 'Keyboard', 100, 10); INSERT INTO product (sku, name, price) VALUES ('A2', 'Mouse', 49.99); SELECT sku, final_price FROM product ORDER BY sku", { thuTu: true }),
      sau(['Follows a later discount change', 'Theo kịp lần đổi giảm giá sau đó'], "INSERT INTO product (sku, name, price) VALUES ('A1', 'Keyboard', 100); UPDATE product SET discount_pct = 25 WHERE sku = 'A1'; SELECT final_price FROM product"),
      chan(['Writing final_price by hand is refused', 'Ghi tay final_price bị từ chối'], "INSERT INTO product (sku, name, price, final_price) VALUES ('A6', 'x', 10, 5)", '428C9'),
      sau(['Rounding to 2 decimals', 'Làm tròn 2 chữ số'], "INSERT INTO product (sku, name, price, discount_pct) VALUES ('A7', 'x', 9.99, 33); SELECT final_price FROM product", { an: true }),
    ],
    sai: ['ALTER TABLE product ADD COLUMN final_price numeric(12,2) DEFAULT 0', 'ALTER TABLE product ADD COLUMN final_price numeric(12,2) GENERATED ALWAYS AS (round(price * ((100 - discount_pct) / 100), 2)) STORED'],
    gy: [['A generated column is declared with <code>GENERATED ALWAYS AS (expression) STORED</code>.', 'Cột sinh khai bằng <code>GENERATED ALWAYS AS (biểu thức) STORED</code>.'], ['Wrap the expression in <code>round(…, 2)</code>.', 'Bọc biểu thức trong <code>round(…, 2)</code>.']],
    lhg: [['A normal column with DEFAULT: computed once (or never), wrong after the next price change.', 'Cột thường có DEFAULT: tính một lần (hoặc không bao giờ), sai ngay lần đổi giá sau.'], ['Writing <code>price * ((100 - discount_pct) / 100)</code>: the parentheses make it integer division — 90 / 100 = 0, so every discounted product costs 0.', 'Viết <code>price * ((100 - discount_pct) / 100)</code>: dấu ngoặc biến nó thành chia nguyên — 90 / 100 = 0, mọi sản phẩm giảm giá thành 0 đồng.']],
    gt: ['<p>A stored generated column is recomputed by PostgreSQL on every INSERT/UPDATE of the row, so it is always consistent with its inputs; writing it directly is an error (428C9).</p>', '<p>Cột sinh dạng STORED được PostgreSQL tính lại ở mọi INSERT/UPDATE của dòng, nên luôn khớp với đầu vào; ghi trực tiếp vào nó là lỗi (428C9).</p>'],
    tn: [tn('generated column', 'cột sinh', 'giá trị do CSDL tính từ cột khác của cùng dòng')],
  }),

  pg({
    t: 'A named composite UNIQUE for enrollments', k: 'MEDIUM', p: 7, kn: ['UNIQUE (a, b)', 'CONSTRAINT name'], tag: ['ddl', 'unique'],
    csdl: '', ld: null,
    en: '<p>Create <code>enrollment (student_id int NOT NULL, course_id int NOT NULL, enrolled_at timestamptz NOT NULL DEFAULT now())</code> where a student enrolls in a course at most once. Name the rule <code>uq_enrollment</code> so error messages (and the app that parses them) are clear.</p>',
    vi: '<p>Tạo <code>enrollment (student_id int NOT NULL, course_id int NOT NULL, enrolled_at timestamptz NOT NULL DEFAULT now())</code> trong đó một sinh viên đăng ký một môn tối đa một lần. Đặt tên luật là <code>uq_enrollment</code> để thông báo lỗi (và app đọc lỗi) rõ ràng.</p>',
    yc: [['<code>CONSTRAINT uq_enrollment UNIQUE (student_id, course_id)</code>.', '<code>CONSTRAINT uq_enrollment UNIQUE (student_id, course_id)</code>.'], ['No primary key is required.', 'Không bắt buộc khoá chính.']],
    giai: `CREATE TABLE enrollment (
  student_id  int NOT NULL,
  course_id   int NOT NULL,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_enrollment UNIQUE (student_id, course_id)   -- the error will say "uq_enrollment"
);`,
    kiem: [
      duoc(['Different pairs are fine', 'Các cặp khác nhau thì được'], 'INSERT INTO enrollment (student_id, course_id) VALUES (1, 10), (1, 20), (2, 10)'),
      chan(['Same pair again is rejected', 'Lại đúng cặp cũ bị chặn'], 'INSERT INTO enrollment (student_id, course_id) VALUES (1, 10), (1, 10)', '23505'),
      sau(['The constraint is called uq_enrollment', 'Ràng buộc tên là uq_enrollment'], "SELECT conname, contype FROM pg_constraint WHERE conrelid = 'enrollment'::regclass AND contype = 'u'"),
    ],
    sai: ['CREATE TABLE enrollment (student_id int NOT NULL, course_id int NOT NULL, enrolled_at timestamptz NOT NULL DEFAULT now(), UNIQUE (student_id, course_id))', 'CREATE TABLE enrollment (student_id int NOT NULL UNIQUE, course_id int NOT NULL UNIQUE, enrolled_at timestamptz NOT NULL DEFAULT now())'],
    gy: [['Table-level form: <code>CONSTRAINT name UNIQUE (col1, col2)</code>.', 'Dạng cấp bảng: <code>CONSTRAINT tên UNIQUE (cột1, cột2)</code>.'], ['Two separate UNIQUEs mean something else entirely.', 'Hai UNIQUE riêng lẻ mang nghĩa khác hẳn.']],
    lhg: [['UNIQUE on each column separately — a student could take only ONE course in total.', 'UNIQUE riêng từng cột — mỗi sinh viên chỉ học được MỘT môn duy nhất.'], ['Leaving the name to PostgreSQL (<code>enrollment_student_id_course_id_key</code>) when the app matches on <code>uq_enrollment</code>.', 'Để PostgreSQL tự đặt tên (<code>enrollment_student_id_course_id_key</code>) trong khi app bắt lỗi theo <code>uq_enrollment</code>.']],
    gt: ['<p>A composite UNIQUE constrains the combination. Naming constraints gives stable, readable errors — your API can translate <code>uq_enrollment</code> into "already enrolled" without parsing messages.</p>', '<p>UNIQUE ghép ràng buộc tổ hợp. Đặt tên ràng buộc cho lỗi ổn định, dễ đọc — API dịch <code>uq_enrollment</code> thành "đã đăng ký rồi" mà không phải phân tích câu chữ.</p>'],
    tn: [tn('composite UNIQUE', 'duy nhất theo tổ hợp')],
  }),

  pg({
    t: 'CT Shop promotions with a table-level CHECK', k: 'HARD', p: 12, kn: ['table-level CHECK', 'date ranges', 'FK + CHECK together'], tag: ['ddl', 'check', 'ctshop'],
    en: '<p>CT Shop runs time-limited promotions. Create <code>promotion</code>: <code>id</code> (identity PK), <code>product_id</code> (required → product), <code>pct int</code> between 1 and 90, <code>starts_on date</code> and <code>ends_on date</code> (both required), <code>note text</code> optional. A promotion must end <b>after</b> it starts — name that rule <code>promotion_dates_check</code>.</p>',
    vi: '<p>CT Shop chạy khuyến mãi có thời hạn. Tạo <code>promotion</code>: <code>id</code> (identity PK), <code>product_id</code> (bắt buộc → product), <code>pct int</code> từ 1 tới 90, <code>starts_on date</code> và <code>ends_on date</code> (đều bắt buộc), <code>note text</code> không bắt buộc. Khuyến mãi phải kết thúc <b>sau</b> khi bắt đầu — đặt tên luật đó là <code>promotion_dates_check</code>.</p>',
    yc: [['A rule comparing two columns is a table-level CHECK.', 'Luật so sánh hai cột là CHECK cấp bảng.'], ['<code>CONSTRAINT promotion_dates_check CHECK (ends_on &gt; starts_on)</code>.', '<code>CONSTRAINT promotion_dates_check CHECK (ends_on &gt; starts_on)</code>.']],
    giai: `CREATE TABLE promotion (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  bigint NOT NULL REFERENCES product(id),
  pct         int    NOT NULL CHECK (pct BETWEEN 1 AND 90),
  starts_on   date   NOT NULL,
  ends_on     date   NOT NULL,
  note        text,
  CONSTRAINT promotion_dates_check CHECK (ends_on > starts_on)    -- two columns ⇒ table level
);`,
    kiem: [
      duoc(['A valid one-week promotion', 'Khuyến mãi một tuần hợp lệ'], "INSERT INTO promotion (product_id, pct, starts_on, ends_on) VALUES (31, 10, '2026-11-01', '2026-11-08')"),
      chan(['Ends before it starts', 'Kết thúc trước khi bắt đầu'], "INSERT INTO promotion (product_id, pct, starts_on, ends_on) VALUES (31, 10, '2026-11-08', '2026-11-01')", '23514'),
      chan(['Starts and ends the same day', 'Bắt đầu và kết thúc cùng ngày'], "INSERT INTO promotion (product_id, pct, starts_on, ends_on) VALUES (31, 10, '2026-11-08', '2026-11-08')", '23514'),
      chan(['95 % off', 'Giảm 95 %'], "INSERT INTO promotion (product_id, pct, starts_on, ends_on) VALUES (31, 95, '2026-11-01', '2026-11-08')", '23514', { an: true }),
      chan(['Unknown product', 'Sản phẩm không tồn tại'], "INSERT INTO promotion (product_id, pct, starts_on, ends_on) VALUES (999, 10, '2026-11-01', '2026-11-08')", '23503', { an: true }),
      sau(['Rule name', 'Tên luật'], "SELECT conname FROM pg_constraint WHERE conrelid = 'promotion'::regclass AND conname = 'promotion_dates_check'", { an: true }),
    ],
    sai: ['CREATE TABLE promotion (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, product_id bigint NOT NULL REFERENCES product(id), pct int NOT NULL CHECK (pct BETWEEN 1 AND 90), starts_on date NOT NULL, ends_on date NOT NULL, note text, CONSTRAINT promotion_dates_check CHECK (ends_on >= starts_on))', 'CREATE TABLE promotion (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, product_id bigint NOT NULL REFERENCES product(id), pct int NOT NULL CHECK (pct BETWEEN 1 AND 90), starts_on date NOT NULL, ends_on date NOT NULL, note text)'],
    gy: [['Column constraints see one column; a rule across columns goes after the column list.', 'Ràng buộc cột chỉ thấy một cột; luật giữa nhiều cột đặt sau danh sách cột.'], ['"After" means strictly greater.', '"Sau" nghĩa là lớn hơn hẳn.']],
    lhg: [['<code>ends_on &gt;= starts_on</code>: a zero-day promotion slips in.', '<code>ends_on &gt;= starts_on</code>: khuyến mãi 0 ngày lọt vào.'], ['Validating dates only in the admin form — a CSV import skips the form.', 'Chỉ kiểm ngày ở form admin — nhập CSV thì bỏ qua form.']],
    gt: ['<p>Table-level CHECKs express invariants between columns of the same row. Combined with a foreign key and NOT NULL, the table refuses every promotion that cannot exist in reality.</p>', '<p>CHECK cấp bảng diễn đạt bất biến giữa các cột của cùng dòng. Kết hợp với khoá ngoại và NOT NULL, bảng từ chối mọi khuyến mãi không thể có trong thực tế.</p>'],
    tn: [tn('table-level CHECK', 'CHECK cấp bảng'), TN.fk],
  }),
]);
