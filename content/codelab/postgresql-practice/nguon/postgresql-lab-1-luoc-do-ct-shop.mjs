/**
 * PostgreSQL · LAB 1 (sau Ch3) — CT Shop: từ ERD tới lược đồ chạy được. Đề lớn "bản in": 5 câu × 2 điểm, mỗi câu một tệp.
 * Luật R1–R16 chép từ lab1-start.sql của khoá; phép thử chép từ lab1-check.sql (23 dòng sai phải bị chặn, ON DELETE).
 * Câu sau được chấm trên lược đồ CHUẨN của câu trước (CT_DDL) ⇒ sai Q1 không kéo theo Q3.
 */
import { doiDau, KHOA, deLonPg, CT_DDL, sau, chan, duoc, TN, tn } from './_chung.mjs';

const ROWS = `INSERT INTO customer (email, full_name) VALUES ('an@ctshop.vn', 'Nguyễn Văn An'), ('binh@ctshop.vn', 'Trần Thị Bình');
INSERT INTO category (name) VALUES ('Bút & mực');
INSERT INTO category (name, parent_id) VALUES ('Bút bi', 1);
INSERT INTO product (sku, name, category_id, price, stock) VALUES ('CT0201', 'Bút bi Thiên Long TL-027 (xanh)', 2, 5000, 100), ('CT0202', 'Bút gel Uni-ball Signo 0.5mm', 2, 28000, 50);`;
const NEN3 = `${CT_DDL.customer}\n${CT_DDL.category}\n${CT_DDL.product}\n${ROWS}`;
const NEN4 = `${CT_DDL.customer}\n${CT_DDL.category}\n${CT_DDL.product}\n${CT_DDL.orders}\n${CT_DDL.order_item}\n${ROWS}
INSERT INTO orders (customer_id) VALUES (1);
INSERT INTO orders (customer_id, status) VALUES (1, 'paid');`;
const NEN5 = NEN3;
const cot = (t) => `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '${t}' ORDER BY ordinal_position`;
const E = { csdl: '' };

export default doiDau({
  slug: 'postgresql-lab-1-luoc-do-ct-shop',
  ten: '3.5 Lab 1 — CT Shop: from ERD to a working schema',
  khoa: KHOA,
  baiHoc: 'postgresql-lab-1-luoc-do-ct-shop',
  de: [
    deLonPg({
      dangBai: 'lab',
      tieuDe: { en: 'Lab 1 — CT Shop: the 8 tables, every rule enforced by the database', vi: 'Lab 1 — CT Shop: 8 bảng, mọi luật do CSDL giữ' },
      doKho: 'HARD', phut: 90, diem: 100,
      khaiNiem: ['CREATE TABLE', 'identity', 'PRIMARY/FOREIGN KEY', 'UNIQUE', 'CHECK', 'DEFAULT', 'ON DELETE CASCADE/RESTRICT', 'composite key'],
      tienQuyet: ['3.1–3.4 of this track'],
      the: ['postgresql', 'lab', 'ddl', 'constraints', 'ctshop'],
      csdl: `${Object.values(CT_DDL).join('\n')}`, tenCsdl: 'ctshop-reference',
      thuMuc: 'RollNo_Name_PG_Lab1',
      phu: { en: 'PostgreSQL course · after Chapter 3 · Suggested time: 90 minutes · 10 marks (5 × 2)', vi: 'Khoá PostgreSQL · sau Chương 3 · Thời gian gợi ý: 90 phút · 10 điểm (5 × 2)' },
      moTa: {
        en: '<p>CT Shop sells school supplies online. You turn its ERD into the 8 tables every later lab uses. Column names and types are given — your job is the <b>keys and constraints</b> (rules R1–R16, the same as <code>lab1-start.sql</code> of the course). The grader then tries to break each rule the way <code>lab1-check.sql</code> does: valid rows must be accepted, bad rows rejected with the right kind of error. From Q3 on, the earlier tables are the <b>reference</b> versions (tab <code>ctshop-reference.sql</code>), so a mistake in Q1 never costs marks in Q3.</p>',
        vi: '<p>CT Shop bán đồ học tập online. Bạn biến ERD của nó thành 8 bảng mà mọi lab sau dùng. Tên cột và kiểu đã cho — việc của bạn là <b>khoá và ràng buộc</b> (luật R1–R16, y như <code>lab1-start.sql</code> của khoá). Máy chấm sau đó cố phá từng luật như <code>lab1-check.sql</code>: dòng hợp lệ phải vào được, dòng sai phải bị chặn với đúng loại lỗi. Từ Q3, các bảng trước là bản <b>chuẩn</b> (tab <code>ctshop-reference.sql</code>), nên sai ở Q1 không làm mất điểm Q3.</p>',
      },
      yeuCauChung: [
        { en: 'Every id: <code>GENERATED ALWAYS AS IDENTITY</code>. Let PostgreSQL name constraints, except the two on customer.email.', vi: 'Mọi id: <code>GENERATED ALWAYS AS IDENTITY</code>. Để PostgreSQL tự đặt tên ràng buộc, trừ hai ràng buộc của customer.email.' },
        { en: 'Columns in the order of the model. Graded by behaviour (accepted / rejected), plus the column list.', vi: 'Cột theo đúng thứ tự mô hình. Chấm theo hành vi (nhận / chặn), cộng danh sách cột.' },
      ],
      moHinh: [
        { ten: 'customer', truong: [['id', 'bigint', 'identity PK'], ['email', 'text', 'R1 required, UNIQUE (customer_email_key), lower-case and like a@b.cc (customer_email_check)'], ['full_name', 'text', 'R2 required'], ['phone', 'text', 'optional'], ['city', 'text', "required, default 'Hà Nội'"], ['created_at', 'timestamptz', 'required, default now()']] },
        { ten: 'category', truong: [['id', 'int', 'identity PK'], ['name', 'text', 'R3 required, unique'], ['parent_id', 'int', 'R4 → category; root = NULL; a category with children cannot be deleted']] },
        { ten: 'product', truong: [['id', 'bigint', 'identity PK'], ['sku', 'text', 'R5 required, unique'], ['name', 'text', 'required'], ['category_id', 'int', 'required → category'], ['price', 'numeric(12,2)', 'R6 > 0'], ['stock', 'int', '≥ 0, default 0'], ['attrs', 'jsonb', "default '{}'"], ['is_active', 'boolean', 'default true'], ['created_at', 'timestamptz', 'default now()']] },
        { ten: 'orders', truong: [['id', 'bigint', 'identity PK'], ['customer_id', 'bigint', 'R7 required → customer; a customer with orders cannot be deleted'], ['status', 'text', "R8 pending|paid|shipped|cancelled, default 'pending'"], ['created_at', 'timestamptz', 'default now()'], ['note', 'text', 'optional']] },
        { ten: 'order_item', truong: [['order_id', 'bigint', 'R9 key part; R11 deleting the order deletes its lines'], ['product_id', 'bigint', 'R9 key part; a sold product cannot be deleted'], ['qty', 'int', 'R10 > 0'], ['unit_price', 'numeric(12,2)', '> 0 (price at purchase)']] },
        { ten: 'payment', truong: [['id', 'bigint', 'identity PK'], ['order_id', 'bigint', 'R12 at most ONE payment per order'], ['amount', 'numeric(12,2)', '> 0'], ['method', 'text', 'R13 cod|card|momo|bank'], ['paid_at', 'timestamptz', 'default now()']] },
        { ten: 'stock_movement', truong: [['id', 'bigint', 'identity PK'], ['product_id', 'bigint', 'required → product'], ['change', 'int', 'R14 ≠ 0'], ['reason', 'text', 'import|sale|return|adjust'], ['order_id', 'bigint', 'R15 optional → orders'], ['created_at', 'timestamptz', 'default now()']] },
        { ten: 'review', truong: [['id', 'bigint', 'identity PK'], ['product_id', 'bigint', 'required → product'], ['customer_id', 'bigint', 'required → customer'], ['rating', 'smallint', 'R16 1–5'], ['body', 'text', 'optional'], ['created_at', 'timestamptz', 'default now(); one review per (product, customer)']] },
      ],
      cau: [
        {
          ten: { en: 'customer (R1–R2)', vi: 'customer (R1–R2)' }, diem: 2,
          moTa: { en: 'Create customer with its two named email constraints.', vi: 'Tạo customer với hai ràng buộc email có tên.' },
          yeuCau: [{ en: '<code>CONSTRAINT customer_email_key UNIQUE (email)</code> and <code>CONSTRAINT customer_email_check CHECK (email = lower(email) AND email LIKE \'%_@_%.__%\')</code>.', vi: '<code>CONSTRAINT customer_email_key UNIQUE (email)</code> và <code>CONSTRAINT customer_email_check CHECK (email = lower(email) AND email LIKE \'%_@_%.__%\')</code>.' }],
          giai: CT_DDL.customer,
          kiem: [
            { ...sau(['Q1 · columns', 'Q1 · các cột'], cot('customer'), { thuTu: true }), ...E },
            { ...sau(['Q1 · city defaults to Hà Nội', 'Q1 · city mặc định Hà Nội'], "INSERT INTO customer (email, full_name) VALUES ('an@ctshop.vn', 'Nguyễn Văn An'); SELECT email, phone, city, created_at IS NOT NULL AS has_time FROM customer"), ...E },
            { ...chan(['Q1 · T01 duplicate email', 'Q1 · T01 trùng email'], "INSERT INTO customer (email, full_name) VALUES ('an@ctshop.vn', 'A'), ('an@ctshop.vn', 'B')", '23505'), ...E },
            { ...chan(['Q1 · T02 capital letters in email', 'Q1 · T02 email có chữ hoa'], "INSERT INTO customer (email, full_name) VALUES ('An@CTShop.vn', 'Viết hoa')", '23514'), ...E },
            { ...chan(['Q1 · T03 email without @', 'Q1 · T03 email thiếu @'], "INSERT INTO customer (email, full_name) VALUES ('an.ctshop.vn', 'Thiếu a còng')", '23514'), ...E },
            { ...chan(['Q1 · T04 missing full_name', 'Q1 · T04 thiếu full_name'], "INSERT INTO customer (email) VALUES ('chi@ctshop.vn')", '23502'), ...E, an: true },
            { ...chan(['Q1 · T05 typing the id yourself', 'Q1 · T05 tự gõ id'], "INSERT INTO customer (id, email, full_name) VALUES (99, 'x@ctshop.vn', 'X')", '428C9'), ...E, an: true },
            { ...sau(['Q1 · constraint names', 'Q1 · tên ràng buộc'], "SELECT conname FROM pg_constraint WHERE conrelid = 'customer'::regclass AND contype IN ('u', 'c') ORDER BY conname", { thuTu: true }), ...E, an: true },
          ],
          saiMau: ["CREATE TABLE customer (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text NOT NULL UNIQUE, full_name text NOT NULL, phone text, city text NOT NULL DEFAULT 'Hà Nội', created_at timestamptz NOT NULL DEFAULT now())"],
        },
        {
          ten: { en: 'category + product (R3–R6)', vi: 'category + product (R3–R6)' }, diem: 2,
          moTa: { en: 'Create category (a tree) and product.', vi: 'Tạo category (dạng cây) và product.' },
          yeuCau: [{ en: 'A category that still has children must not be deletable; every product belongs to exactly one category.', vi: 'Danh mục còn con thì không xoá được; mỗi sản phẩm thuộc đúng một danh mục.' }],
          giai: `${CT_DDL.category}\n${CT_DDL.product}`,
          kiem: [
            { ...sau(['Q2 · product columns', 'Q2 · các cột của product'], cot('product'), { thuTu: true }), ...E },
            { ...sau(['Q2 · product defaults', 'Q2 · mặc định của product'], "INSERT INTO category (name) VALUES ('Bút & mực'); INSERT INTO category (name, parent_id) VALUES ('Bút bi', 1); INSERT INTO product (sku, name, category_id, price) VALUES ('CT0202', 'Bút gel', 2, 28000); SELECT sku, stock, attrs, is_active FROM product"), ...E },
            { ...chan(['Q2 · T07 price 0', 'Q2 · T07 giá 0'], "INSERT INTO category (name) VALUES ('C'); INSERT INTO product (sku, name, category_id, price) VALUES ('X1', 'x', 1, 0)", '23514'), ...E },
            { ...chan(['Q2 · T08 negative stock', 'Q2 · T08 tồn kho âm'], "INSERT INTO category (name) VALUES ('C'); INSERT INTO product (sku, name, category_id, price, stock) VALUES ('X1', 'x', 1, 10, -1)", '23514'), ...E },
            { ...chan(['Q2 · T09 product of an unknown category', 'Q2 · T09 sản phẩm của danh mục không tồn tại'], "INSERT INTO product (sku, name, category_id, price) VALUES ('X1', 'x', 99, 10)", '23503'), ...E },
            { ...chan(['Q2 · T10 duplicate category name', 'Q2 · T10 trùng tên danh mục'], "INSERT INTO category (name) VALUES ('Bút bi'), ('Bút bi')", '23505'), ...E, an: true },
            { ...chan(['Q2 · T11 delete a category that has children', 'Q2 · T11 xoá danh mục còn con'], "INSERT INTO category (name) VALUES ('Bút & mực'); INSERT INTO category (name, parent_id) VALUES ('Bút bi', 1); DELETE FROM category WHERE id = 1", '23001|23503'), ...E, an: true },
            { ...chan(['Q2 · T12 duplicate SKU', 'Q2 · T12 trùng SKU'], "INSERT INTO category (name) VALUES ('C'); INSERT INTO product (sku, name, category_id, price) VALUES ('X1', 'a', 1, 1), ('X1', 'b', 1, 2)", '23505'), ...E, an: true },
          ],
          saiMau: ["CREATE TABLE category (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, name text NOT NULL UNIQUE, parent_id int REFERENCES category(id) ON DELETE CASCADE); CREATE TABLE product (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, sku text NOT NULL UNIQUE, name text NOT NULL, category_id int NOT NULL REFERENCES category(id), price numeric(12,2) NOT NULL CHECK (price >= 0), stock int NOT NULL DEFAULT 0 CHECK (stock >= 0), attrs jsonb NOT NULL DEFAULT '{}', is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now())"],
        },
        {
          ten: { en: 'orders + order_item (R7–R11)', vi: 'orders + order_item (R7–R11)' }, diem: 2,
          moTa: { en: 'Create orders and order_item. customer, category and product are the reference tables, with 2 customers and 2 products.', vi: 'Tạo orders và order_item. customer, category, product là bảng chuẩn, có 2 khách và 2 sản phẩm.' },
          yeuCau: [{ en: 'order_item has NO id: one product at most once per order. Deleting an order deletes its lines; a sold product and a customer with orders cannot be deleted.', vi: 'order_item KHÔNG có id: mỗi sản phẩm tối đa một lần trong một đơn. Xoá đơn thì xoá dòng; sản phẩm đã bán và khách có đơn không xoá được.' }],
          giai: `${CT_DDL.orders}\n${CT_DDL.order_item}`,
          kiem: [
            { ...sau(['Q3 · a valid order with two lines', 'Q3 · một đơn hợp lệ hai dòng'], "INSERT INTO orders (customer_id) VALUES (1); INSERT INTO order_item VALUES (1, 1, 2, 5000), (1, 2, 1, 28000); SELECT o.id, o.status, count(*) AS lines FROM orders o JOIN order_item i ON i.order_id = o.id GROUP BY o.id, o.status"), csdl: NEN3 },
            { ...chan(['Q3 · T13 unknown status', 'Q3 · T13 trạng thái lạ'], "INSERT INTO orders (customer_id, status) VALUES (1, 'done')", '23514'), csdl: NEN3 },
            { ...chan(['Q3 · T14 same product twice in one order', 'Q3 · T14 một sản phẩm hai lần trong một đơn'], "INSERT INTO orders (customer_id) VALUES (1); INSERT INTO order_item VALUES (1, 1, 1, 5000), (1, 1, 2, 5000)", '23505'), csdl: NEN3 },
            { ...chan(['Q3 · T15 quantity 0', 'Q3 · T15 số lượng 0'], "INSERT INTO orders (customer_id) VALUES (1); INSERT INTO order_item VALUES (1, 1, 0, 5000)", '23514'), csdl: NEN3 },
            { ...sau(['Q3 · deleting an order deletes its lines', 'Q3 · xoá đơn thì xoá dòng'], "INSERT INTO orders (customer_id) VALUES (1); INSERT INTO order_item VALUES (1, 1, 2, 5000); DELETE FROM orders WHERE id = 1; SELECT count(*) AS lines_left FROM order_item"), csdl: NEN3 },
            { ...chan(['Q3 · deleting a customer with orders is refused', 'Q3 · xoá khách có đơn bị từ chối'], "INSERT INTO orders (customer_id) VALUES (1); DELETE FROM customer WHERE id = 1", '23503'), csdl: NEN3, an: true },
            { ...chan(['Q3 · deleting a sold product is refused', 'Q3 · xoá sản phẩm đã bán bị từ chối'], "INSERT INTO orders (customer_id) VALUES (1); INSERT INTO order_item VALUES (1, 2, 1, 28000); DELETE FROM product WHERE id = 2", '23503'), csdl: NEN3, an: true },
            { ...chan(['Q3 · order of an unknown customer', 'Q3 · đơn của khách không tồn tại'], "INSERT INTO orders (customer_id) VALUES (99)", '23503'), csdl: NEN3, an: true },
          ],
          saiMau: [`${CT_DDL.orders}\nCREATE TABLE order_item (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, order_id bigint NOT NULL REFERENCES orders(id), product_id bigint NOT NULL REFERENCES product(id), qty int NOT NULL CHECK (qty > 0), unit_price numeric(12,2) NOT NULL CHECK (unit_price > 0));`],
        },
        {
          ten: { en: 'payment + stock_movement (R12–R15)', vi: 'payment + stock_movement (R12–R15)' }, diem: 2,
          moTa: { en: 'Create payment and stock_movement. Reference tables up to order_item exist, with orders 1 (pending) and 2 (paid).', vi: 'Tạo payment và stock_movement. Bảng chuẩn tới order_item đã có, với đơn 1 (pending) và 2 (paid).' },
          yeuCau: [{ en: 'An order has at most ONE payment. A stock movement may or may not belong to an order.', vi: 'Mỗi đơn tối đa MỘT lần thanh toán. Biến động kho có thể thuộc hoặc không thuộc một đơn.' }],
          giai: `${CT_DDL.payment}\n${CT_DDL.stock_movement}`,
          kiem: [
            { ...sau(['Q4 · a payment and an import movement', 'Q4 · một thanh toán và một lần nhập kho'], "INSERT INTO payment (order_id, amount, method) VALUES (2, 15000, 'momo'); INSERT INTO stock_movement (product_id, change, reason) VALUES (1, 100, 'import'); SELECT (SELECT count(*) FROM payment) AS payments, (SELECT order_id IS NULL FROM stock_movement) AS movement_without_order"), csdl: NEN4 },
            { ...chan(['Q4 · T17 a second payment for the same order', 'Q4 · T17 thanh toán lần hai cho cùng đơn'], "INSERT INTO payment (order_id, amount, method) VALUES (2, 15000, 'momo'), (2, 15000, 'card')", '23505'), csdl: NEN4 },
            { ...chan(['Q4 · T18 method cash', 'Q4 · T18 phương thức cash'], "INSERT INTO payment (order_id, amount, method) VALUES (2, 15000, 'cash')", '23514'), csdl: NEN4 },
            { ...chan(['Q4 · T19 movement with change 0', 'Q4 · T19 biến động bằng 0'], "INSERT INTO stock_movement (product_id, change, reason) VALUES (1, 0, 'adjust')", '23514'), csdl: NEN4 },
            { ...chan(['Q4 · T20 payment amount 0', 'Q4 · T20 số tiền 0'], "INSERT INTO payment (order_id, amount, method) VALUES (2, 0, 'card')", '23514'), csdl: NEN4, an: true },
            { ...chan(['Q4 · T21 reason gift', 'Q4 · T21 lý do gift'], "INSERT INTO stock_movement (product_id, change, reason) VALUES (1, 5, 'gift')", '23514'), csdl: NEN4, an: true },
            { ...chan(['Q4 · payment of an unknown order', 'Q4 · thanh toán cho đơn không tồn tại'], "INSERT INTO payment (order_id, amount, method) VALUES (99, 1, 'cod')", '23503'), csdl: NEN4, an: true },
          ],
          saiMau: [`CREATE TABLE payment (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, order_id bigint NOT NULL REFERENCES orders(id), amount numeric(12,2) NOT NULL CHECK (amount > 0), method text NOT NULL CHECK (method IN ('cod', 'card', 'momo', 'bank')), paid_at timestamptz NOT NULL DEFAULT now());\n${CT_DDL.stock_movement}`],
        },
        {
          ten: { en: 'review (R16)', vi: 'review (R16)' }, diem: 2,
          moTa: { en: 'Create review. Reference customer, category and product exist.', vi: 'Tạo review. Đã có customer, category, product chuẩn.' },
          yeuCau: [{ en: 'rating 1–5; a customer reviews a product at most once; body optional.', vi: 'rating 1–5; mỗi khách đánh giá một sản phẩm tối đa một lần; body không bắt buộc.' }],
          giai: CT_DDL.review,
          kiem: [
            { ...duoc(['Q5 · a valid review without body', 'Q5 · đánh giá hợp lệ không có nội dung'], "INSERT INTO review (product_id, customer_id, rating) VALUES (1, 1, 5)"), csdl: NEN5 },
            { ...chan(['Q5 · T22 rating 6', 'Q5 · T22 điểm 6'], "INSERT INTO review (product_id, customer_id, rating) VALUES (1, 1, 6)", '23514'), csdl: NEN5 },
            { ...chan(['Q5 · T23 second review of the same product', 'Q5 · T23 đánh giá lần hai cùng sản phẩm'], "INSERT INTO review (product_id, customer_id, rating) VALUES (1, 1, 5), (1, 1, 1)", '23505'), csdl: NEN5 },
            { ...chan(['Q5 · rating 0', 'Q5 · điểm 0'], "INSERT INTO review (product_id, customer_id, rating) VALUES (1, 2, 0)", '23514'), csdl: NEN5, an: true },
            { ...chan(['Q5 · unknown product', 'Q5 · sản phẩm không tồn tại'], "INSERT INTO review (product_id, customer_id, rating) VALUES (99, 1, 4)", '23503'), csdl: NEN5, an: true },
            { ...duoc(['Q5 · two customers review the same product', 'Q5 · hai khách đánh giá cùng một sản phẩm'], "INSERT INTO review (product_id, customer_id, rating) VALUES (1, 1, 5), (1, 2, 4), (2, 1, 3)"), csdl: NEN5, an: true },
          ],
          saiMau: ['CREATE TABLE review (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, product_id bigint NOT NULL REFERENCES product(id), customer_id bigint NOT NULL REFERENCES customer(id), rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5), body text, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (product_id))'],
        },
      ],
      truDiem: [
        { en: 'Hand-written ids, serial instead of identity, or a column order different from the model.', vi: 'Tự ghi id, dùng serial thay identity, hoặc thứ tự cột khác mô hình.' },
        { en: 'A rule only enforced "in the app" (a comment, a trigger-less convention) — the grader only trusts constraints.', vi: 'Luật chỉ giữ "ở app" (chú thích, quy ước) — máy chấm chỉ tin ràng buộc.' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q5.sql. <b>Run</b> = sample checks; <b>Submit</b> = every check and the 10-mark table. Q3–Q5 run on top of the reference tables in <code>ctshop-reference.sql</code>.',
        vi: 'Các tab Q1.sql … Q5.sql. <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm và bảng điểm thang 10. Q3–Q5 chạy trên các bảng chuẩn trong <code>ctshop-reference.sql</code>.',
      },
      thuatNgu: [TN.pk, TN.fk, TN.check, TN.identity, tn('ON DELETE RESTRICT', 'cấm xoá cha còn con'), tn('composite key', 'khoá ghép')],
      goiY: [
        { en: 'Write each table from the model, then for every rule ask "which constraint makes the bad row impossible?".', vi: 'Viết từng bảng theo mô hình, rồi với mỗi luật hỏi "ràng buộc nào làm dòng sai không thể tồn tại?".' },
        { en: 'R4 / R7 / R11: the default foreign-key action already refuses deleting a referenced parent; only the order → order_item link needs ON DELETE CASCADE.', vi: 'R4 / R7 / R11: hành động mặc định của khoá ngoại đã từ chối xoá cha còn được trỏ; chỉ mối nối orders → order_item cần ON DELETE CASCADE.' },
        { en: 'R9 / R12 / R16: "at most once" = a PRIMARY KEY or UNIQUE on exactly those columns.', vi: 'R9 / R12 / R16: "tối đa một lần" = PRIMARY KEY hoặc UNIQUE trên đúng các cột đó.' },
      ],
      loiHayGap: [
        { en: 'Q1: UNIQUE but no lower-case CHECK — An@CTShop.vn and an@ctshop.vn become two customers.', vi: 'Q1: có UNIQUE mà thiếu CHECK chữ thường — An@CTShop.vn và an@ctshop.vn thành hai khách.' },
        { en: 'Q2: ON DELETE CASCADE on category.parent_id — deleting "Bút & mực" wipes its sub-categories (and fails later on products).', vi: 'Q2: ON DELETE CASCADE trên category.parent_id — xoá "Bút & mực" là xoá sạch danh mục con.' },
        { en: 'Q3: an id column on order_item — the same pen can appear twice in one order.', vi: 'Q3: thêm cột id cho order_item — cùng một cây bút xuất hiện hai lần trong một đơn.' },
        { en: 'Q4: forgetting UNIQUE on payment.order_id — an order can be charged twice.', vi: 'Q4: quên UNIQUE trên payment.order_id — một đơn bị thu tiền hai lần.' },
      ],
      giaiThich: { en: '<p>The reference DDL is the course\'s <code>ctshop-schema.sql</code> (tab <code>ctshop-reference.sql</code>). Every rule R1–R16 is a constraint, so it holds for every client, every import and every hand-typed statement.</p>', vi: '<p>DDL chuẩn là <code>ctshop-schema.sql</code> của khoá (tab <code>ctshop-reference.sql</code>). Mọi luật R1–R16 đều là ràng buộc, nên đúng với mọi client, mọi lần nhập dữ liệu và mọi lệnh gõ tay.</p>' },
    }),
  ],
});
