/**
 * DBI202 · Chương 4 — LAB 4 (bản in): bài 8 của 4.5 / bảng đơn hàng của 4.4 — từ bảng 1NF tới lược đồ BCNF có dữ liệu thật.
 * 5 câu × 2 điểm: Q1 Customer, Q2 Product, Q3 Orders, Q4 OrderLine (mỗi câu CREATE TABLE + INSERT … SELECT từ Order1NF),
 * Q5 nối lại chứng minh không mất. Câu sau chấm trên lược đồ CHUẨN của câu trước.
 */
import { doiDau, KHOA, deLonSql, sau, chan, kq, kqAn, cot, TN } from './_chung.mjs';
import { ORDER1NF } from './dbi202-chuan-hoa-vi-du.mjs';

const Q1 = `CREATE TABLE Customer (
    cust_id   CHAR(4)     NOT NULL PRIMARY KEY,
    cust_name VARCHAR(40) NOT NULL,
    cust_city VARCHAR(30) NOT NULL
);
INSERT INTO Customer SELECT DISTINCT cust_id, cust_name, cust_city FROM Order1NF;`;
const Q2 = `CREATE TABLE Product (
    product_id CHAR(3)       NOT NULL PRIMARY KEY,
    unit_price DECIMAL(10,0) NOT NULL CHECK (unit_price > 0)
);
INSERT INTO Product SELECT DISTINCT product_id, unit_price FROM Order1NF;`;
const Q3 = `CREATE TABLE Orders (
    order_id   INT     NOT NULL PRIMARY KEY,
    order_date DATE    NOT NULL,
    cust_id    CHAR(4) NOT NULL REFERENCES Customer (cust_id)
);
INSERT INTO Orders SELECT DISTINCT order_id, order_date, cust_id FROM Order1NF;`;
const Q4 = `CREATE TABLE OrderLine (
    order_id   INT     NOT NULL REFERENCES Orders (order_id),
    product_id CHAR(3) NOT NULL REFERENCES Product (product_id),
    qty        INT     NOT NULL CHECK (qty > 0),
    PRIMARY KEY (order_id, product_id)
);
INSERT INTO OrderLine SELECT order_id, product_id, qty FROM Order1NF;`;
const Q5 = `SELECT o.order_id, o.order_date, c.cust_id, c.cust_name, c.cust_city, l.product_id, l.qty, p.unit_price
FROM OrderLine l
JOIN Orders   o ON o.order_id   = l.order_id
JOIN Customer c ON c.cust_id    = o.cust_id
JOIN Product  p ON p.product_id = l.product_id;`;
const MOI = `INSERT INTO Order1NF VALUES (1005, '2026-09-08', 'C004', N'Phạm Dũng', N'Huế', 'P09', 2, 12000), (1005, '2026-09-08', 'C004', N'Phạm Dũng', N'Huế', 'P01', 1, 5000)`;
const CS = ORDER1NF;
const C1 = `${ORDER1NF}\n${Q1}`;
const C12 = `${C1}\n${Q2}`;
const C123 = `${C12}\n${Q3}`;
const CO_SO = `${C123}\n${Q4}`;

export default doiDau({
  slug: 'dbi202-4-lab-chuan-hoa-don-hang',
  ten: 'Lab 4 — Normalize the order table: from 1NF to BCNF with real data',
  khoa: KHOA,
  baiHoc: 'dbi202-on-ch4',
  de: [
    deLonSql({
      dangBai: 'lab',
      tieuDe: 'Lab 4 — Order table: decompose to BCNF and prove nothing was lost',
      doKho: 'HARD', phut: 60, diem: 100,
      khaiNiem: ['2NF / 3NF decomposition', 'INSERT … SELECT DISTINCT', 'foreign keys', 'lossless join'],
      tienQuyet: ['4.1–4.4 of this track'],
      the: ['dbi202', 'lab', 'normalization', 'ddl'],
      csdl: CO_SO, tenCsdl: 'OrderDB',
      thuMuc: 'RollNo_Name_DBI202_Lab4',
      phu: { en: 'DBI202 · Chapter 4 — Normalization · Suggested time: 60 minutes · Total: 10 marks (5 × 2)', vi: 'DBI202 · Chương 4 — Chuẩn hoá · Thời gian gợi ý: 60 phút · Tổng: 10 điểm (5 × 2)' },
      moTa: {
        en: '<p>The shop keeps every order line in one 1NF table <code>Order1NF(order_id, order_date, cust_id, cust_name, cust_city, product_id, qty, unit_price)</code>, key (order_id, product_id), with FDs order_id → order_date, cust_id · cust_id → cust_name, cust_city · product_id → unit_price · order_id, product_id → qty. Decompose it into BCNF tables <b>and move the data</b>, one table per question, then prove the decomposition is lossless.</p>',
        vi: '<p>Cửa hàng lưu mọi dòng đơn trong một bảng 1NF <code>Order1NF(order_id, order_date, cust_id, cust_name, cust_city, product_id, qty, unit_price)</code>, khoá (order_id, product_id), với FD order_id → order_date, cust_id · cust_id → cust_name, cust_city · product_id → unit_price · order_id, product_id → qty. Phân rã về các bảng BCNF <b>và chuyển dữ liệu</b>, mỗi câu một bảng, rồi chứng minh phân rã không mất.</p>',
      },
      yeuCauChung: [
        { en: 'Each question: one CREATE TABLE and one INSERT … SELECT from Order1NF (never type the rows by hand — the grader changes the data).', vi: 'Mỗi câu: một CREATE TABLE và một INSERT … SELECT từ Order1NF (đừng gõ tay dòng nào — máy chấm đổi dữ liệu).' },
        { en: 'Portable types: INT, CHAR(n), VARCHAR(n), DECIMAL(p,s), DATE. The order table is called Orders (ORDER is a reserved word).', vi: 'Kiểu chạy mọi hệ: INT, CHAR(n), VARCHAR(n), DECIMAL(p,s), DATE. Bảng đơn hàng tên Orders (ORDER là từ khoá).' },
      ],
      moHinh: [
        { ten: 'Customer', truong: [['cust_id', 'CHAR(4)', 'PK'], ['cust_name', 'VARCHAR(40)', 'required'], ['cust_city', 'VARCHAR(30)', 'required']] },
        { ten: 'Product', truong: [['product_id', 'CHAR(3)', 'PK'], ['unit_price', 'DECIMAL(10,0)', 'required, > 0']] },
        { ten: 'Orders', truong: [['order_id', 'INT', 'PK'], ['order_date', 'DATE', 'required'], ['cust_id', 'CHAR(4)', 'required, FK → Customer']] },
        { ten: 'OrderLine', truong: [['order_id', 'INT', 'PK, FK → Orders'], ['product_id', 'CHAR(3)', 'PK, FK → Product'], ['qty', 'INT', 'required, > 0']] },
      ],
      cau: [
        {
          ten: { en: 'Customer (3NF: cust_id → cust_name, cust_city)', vi: 'Customer (3NF: cust_id → cust_name, cust_city)' }, diem: 2,
          moTa: { en: 'Create Customer and fill it: each customer once.', vi: 'Tạo Customer và đổ dữ liệu: mỗi khách một lần.' },
          yeuCau: [{ en: 'SELECT DISTINCT — C001 appears in four rows of Order1NF.', vi: 'SELECT DISTINCT — C001 có ở bốn dòng của Order1NF.' }],
          giai: Q1,
          kiem: [
            { ...sau('Q1 · columns', cot(['Customer'])), csdl: CS },
            { ...sau('Q1 · rows', 'SELECT cust_id, cust_name, cust_city FROM Customer'), csdl: CS },
            { ...sau('Q1 · new customer in the data', 'SELECT cust_id FROM Customer'), csdl: CS, themCsdl: MOI, an: true },
          ],
          saiMau: ["CREATE TABLE Customer (cust_id CHAR(4) NOT NULL PRIMARY KEY, cust_name VARCHAR(40) NOT NULL, cust_city VARCHAR(30) NOT NULL); INSERT INTO Customer VALUES ('C001', 'Nguyễn An', 'Hà Nội'), ('C002', 'Trần Bình', 'Đà Nẵng'), ('C003', 'Lê Chi', 'Cần Thơ');"],
        },
        {
          ten: { en: 'Product (2NF: product_id → unit_price)', vi: 'Product (2NF: product_id → unit_price)' }, diem: 2,
          moTa: { en: 'Create Product and fill it: each product once; prices are positive.', vi: 'Tạo Product và đổ dữ liệu: mỗi sản phẩm một lần; giá dương.' },
          yeuCau: [{ en: 'CHECK (unit_price &gt; 0).', vi: 'CHECK (unit_price &gt; 0).' }],
          giai: Q2,
          kiem: [
            { ...sau('Q2 · rows', 'SELECT product_id, unit_price FROM Product'), csdl: C1 },
            { ...chan('Q2 · a price of 0 is rejected', "INSERT INTO Product VALUES ('P99', 0)", '23514'), csdl: C1 },
            { ...sau('Q2 · new product in the data', 'SELECT product_id, unit_price FROM Product'), csdl: C1, themCsdl: MOI, an: true },
          ],
          saiMau: ['CREATE TABLE Product (product_id CHAR(3) NOT NULL PRIMARY KEY, unit_price DECIMAL(10,0) NOT NULL); INSERT INTO Product SELECT DISTINCT product_id, unit_price FROM Order1NF;'],
        },
        {
          ten: { en: 'Orders (2NF: order_id → order_date, cust_id)', vi: 'Orders (2NF: order_id → order_date, cust_id)' }, diem: 2,
          moTa: { en: 'Create Orders and fill it: each order once, with a foreign key to Customer.', vi: 'Tạo Orders và đổ dữ liệu: mỗi đơn một lần, khoá ngoại tới Customer.' },
          yeuCau: [{ en: 'cust_id NOT NULL REFERENCES Customer; do NOT copy cust_name / cust_city (they are in Customer).', vi: 'cust_id NOT NULL REFERENCES Customer; KHÔNG chép cust_name / cust_city (đã ở Customer).' }],
          giai: Q3,
          kiem: [
            { ...sau('Q3 · columns', cot(['Orders'])), csdl: C12 },
            { ...sau('Q3 · rows', 'SELECT order_id, order_date, cust_id FROM Orders'), csdl: C12 },
            { ...chan('Q3 · an order of an unknown customer is rejected', "INSERT INTO Orders VALUES (9999, '2026-10-01', 'C999')", '23503'), csdl: C12 },
          ],
          saiMau: ["CREATE TABLE Orders (order_id INT NOT NULL PRIMARY KEY, order_date DATE NOT NULL, cust_id CHAR(4) NOT NULL REFERENCES Customer(cust_id), cust_city VARCHAR(30)); INSERT INTO Orders SELECT DISTINCT order_id, order_date, cust_id, cust_city FROM Order1NF;"],
        },
        {
          ten: { en: 'OrderLine (the full key: order_id, product_id → qty)', vi: 'OrderLine (khoá đầy đủ: order_id, product_id → qty)' }, diem: 2,
          moTa: { en: 'Create OrderLine and fill it: one row per line, two foreign keys, qty &gt; 0.', vi: 'Tạo OrderLine và đổ dữ liệu: mỗi dòng đơn một dòng, hai khoá ngoại, qty &gt; 0.' },
          yeuCau: [{ en: 'PRIMARY KEY (order_id, product_id).', vi: 'PRIMARY KEY (order_id, product_id).' }],
          giai: Q4,
          kiem: [
            { ...sau('Q4 · rows', 'SELECT order_id, product_id, qty FROM OrderLine'), csdl: C123 },
            { ...chan('Q4 · the same product twice in one order is rejected', "INSERT INTO OrderLine VALUES (1001, 'P01', 5)", '23505'), csdl: C123 },
            { ...chan('Q4 · a line of an unknown product is rejected', "INSERT INTO OrderLine VALUES (1002, 'P99', 1)", '23503'), csdl: C123, an: true },
          ],
          saiMau: ['CREATE TABLE OrderLine (order_id INT NOT NULL REFERENCES Orders(order_id), product_id CHAR(3) NOT NULL REFERENCES Product(product_id), qty INT NOT NULL CHECK (qty > 0)); INSERT INTO OrderLine SELECT order_id, product_id, qty FROM Order1NF;'],
        },
        {
          ten: { en: 'Join everything back (lossless)', vi: 'Nối tất cả lại (không mất)' }, diem: 2,
          moTa: { en: 'Write the query Customer ⋈ Orders ⋈ OrderLine ⋈ Product that reproduces Order1NF exactly, columns in the order of Order1NF.', vi: 'Viết truy vấn Customer ⋈ Orders ⋈ OrderLine ⋈ Product cho lại đúng Order1NF, cột theo thứ tự của Order1NF.' },
          yeuCau: [{ en: 'Columns: order_id, order_date, cust_id, cust_name, cust_city, product_id, qty, unit_price.', vi: 'Cột: order_id, order_date, cust_id, cust_name, cust_city, product_id, qty, unit_price.' }],
          giai: Q5,
          kiem: [
            kq('Q5 · the rebuilt table equals Order1NF'),
            kqAn('Q5 · another order line', "INSERT INTO OrderLine VALUES (1002, 'P03', 2)"),
          ],
          saiMau: ['SELECT o.order_id, o.order_date, c.cust_id, c.cust_name, c.cust_city, l.product_id, l.qty, p.unit_price FROM OrderLine l JOIN Orders o ON o.order_id = l.order_id JOIN Customer c ON 1 = 1 JOIN Product p ON p.product_id = l.product_id'],
        },
      ],
      truDiem: [
        { en: 'Typing rows with INSERT … VALUES instead of moving them with INSERT … SELECT.', vi: 'Gõ dòng bằng INSERT … VALUES thay vì chuyển bằng INSERT … SELECT.' },
        { en: 'Keeping cust_name / cust_city in Orders — the transitive dependency (3NF) is still there.', vi: 'Giữ cust_name / cust_city trong Orders — phụ thuộc bắc cầu (3NF) vẫn còn.' },
        { en: 'Q5: a join condition that pairs every order with every customer.', vi: 'Q5: điều kiện nối ghép mọi đơn với mọi khách.' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q5.sql. Q1–Q4 start from Order1NF plus the reference tables of the previous questions; Q5 runs on the full reference schema (tab OrderDB.sql).',
        vi: 'Các tab Q1.sql … Q5.sql. Q1–Q4 bắt đầu từ Order1NF cộng các bảng chuẩn của câu trước; Q5 chạy trên lược đồ chuẩn đầy đủ (tab OrderDB.sql).',
      },
      thuatNgu: [TN.pk, TN.fk, TN.join],
      goiY: [
        { en: 'Parents before children: Customer and Product, then Orders, then OrderLine.', vi: 'Cha trước con: Customer và Product, rồi Orders, rồi OrderLine.' },
        { en: 'DISTINCT when a table holds the right side of an FD whose left side repeats in Order1NF.', vi: 'DISTINCT khi bảng chứa vế phải của một FD có vế trái lặp trong Order1NF.' },
      ],
      loiHayGap: [
        { en: 'Forgetting DISTINCT: the primary key rejects the duplicated customer rows.', vi: 'Quên DISTINCT: khoá chính từ chối các dòng khách hàng lặp.' },
        { en: 'Q4 without a primary key — the same product could appear twice in an order.', vi: 'Q4 thiếu khoá chính — một sản phẩm có thể xuất hiện hai lần trong một đơn.' },
      ],
      giaiThich: { en: '<p>Four BCNF tables; every join is on a key of one side, so the join back is lossless and reproduces Order1NF exactly.</p>', vi: '<p>Bốn bảng BCNF; mọi phép nối đều trên khoá của một phía nên nối lại không mất và cho đúng Order1NF.</p>' },
    }),
  ],
});
