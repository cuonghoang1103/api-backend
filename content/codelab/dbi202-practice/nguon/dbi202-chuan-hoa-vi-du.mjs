/**
 * DBI202 · 4.4 Một bảng, chuẩn hoá 1NF → BCNF từng bước — bảng đơn hàng của bài: dư thừa đo bằng SQL, khuôn trả lời bốn dòng,
 * bước nào gỡ FD nào. Bản làm thật bằng SQL đầy đủ: Lab 4.
 */
import { mod, de, cs, q, ord, bang1, kq, kqAn, ma, tn } from './_chung.mjs';

export const ORDER1NF = String.raw`
CREATE TABLE Order1NF (
  order_id   INT           NOT NULL,
  order_date DATE          NOT NULL,
  cust_id    CHAR(4)       NOT NULL,
  cust_name  NVARCHAR(40)  NOT NULL,
  cust_city  NVARCHAR(30)  NOT NULL,
  product_id CHAR(3)       NOT NULL,
  qty        INT           NOT NULL,
  unit_price DECIMAL(10,0) NOT NULL,
  CONSTRAINT pk_order1nf PRIMARY KEY (order_id, product_id)
);
INSERT INTO Order1NF VALUES
 (1001, '2026-09-01', 'C001', N'Nguyen An',  N'Ha Noi',    'P01', 2, 5000),
 (1001, '2026-09-01', 'C001', N'Nguyen An',  N'Ha Noi',    'P07', 1, 18000),
 (1002, '2026-09-02', 'C002', N'Tran Binh',  N'Da Nang',   'P01', 10, 5000),
 (1003, '2026-09-05', 'C001', N'Nguyen An',  N'Ha Noi',    'P03', 1, 7000),
 (1003, '2026-09-05', 'C001', N'Nguyen An',  N'Ha Noi',    'P07', 3, 18000),
 (1004, '2026-09-06', 'C003', N'Le Chi',     N'Can Tho',   'P03', 4, 7000);
`;
export const LD_ORDER1NF = {
  en: '<p><b>The 1NF table of lesson 4.4</b> (tab <code>Order1NF.sql</code>): <code>Order1NF(order_id, order_date, cust_id, cust_name, cust_city, product_id, qty, unit_price)</code>, key (order_id, product_id). FDs: order_id → order_date, cust_id · cust_id → cust_name, cust_city · product_id → unit_price · order_id, product_id → qty.</p>',
  vi: '<p><b>Bảng 1NF của bài 4.4</b> (tab <code>Order1NF.sql</code>): <code>Order1NF(order_id, order_date, cust_id, cust_name, cust_city, product_id, qty, unit_price)</code>, khoá (order_id, product_id). FD: order_id → order_date, cust_id · cust_id → cust_name, cust_city · product_id → unit_price · order_id, product_id → qty.</p>',
};
const O = { csdl: ORDER1NF, tenCsdl: 'Order1NF', ld: LD_ORDER1NF };

export default mod('dbi202-chuan-hoa-vi-du', '4.4 One table, normalized 1NF → BCNF step by step', [
  de({
    ...O, t: 'Measure the redundancy: how often is each customer\'s city stored?', k: 'EASY', p: 7,
    kn: ['redundancy', 'GROUP BY'], tag: ['normalization', 'group-by'],
    en: '<p>The update anomaly in numbers: for every customer, how many rows of Order1NF repeat their city? (After 3NF it will be exactly 1 each.)</p>',
    vi: '<p>Dị thường cập nhật bằng con số: với mỗi khách hàng, Order1NF lặp thành phố của họ trong bao nhiêu dòng? (Sau 3NF sẽ đúng 1 mỗi người.)</p>',
    yc: [['Columns: <code>cust_id, copies</code>.', 'Cột: <code>cust_id, copies</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT cust_id, COUNT(*) AS copies      -- every row repeats the customer's name and city
FROM Order1NF
GROUP BY cust_id;`,
    kiem: [kq(['Copies of each customer\'s data', 'Số bản sao dữ liệu mỗi khách']), kqAn(['Another order of C002', 'Thêm đơn của C002'], `INSERT INTO Order1NF VALUES (1005, '2026-09-08', 'C002', N'Tran Binh', N'Da Nang', 'P07', 1, 18000), (1005, '2026-09-08', 'C002', N'Tran Binh', N'Da Nang', 'P03', 2, 7000)`), ma(['Uses GROUP BY', 'Dùng GROUP BY'], '\\bGROUP\\s+BY\\b')],
    sai: [`SELECT cust_id, COUNT(DISTINCT order_id) AS copies FROM Order1NF GROUP BY cust_id`],
    gy: [['Each row of Order1NF carries the customer\'s name and city.', 'Mỗi dòng của Order1NF mang tên và thành phố của khách.'], ['COUNT(*) per cust_id.', 'COUNT(*) theo cust_id.']],
    lhg: [['Counting orders (COUNT(DISTINCT order_id)) — the city is stored once per LINE, not per order.', 'Đếm đơn (COUNT(DISTINCT order_id)) — thành phố lưu theo mỗi DÒNG, không theo mỗi đơn.'], ['Counting only orders of one customer.', 'Chỉ đếm đơn của một khách.']],
    gt: ['<p>Expected: C001 4, C002 1, C003 1. If An moves city, four rows must change together — miss one and the data contradicts itself.</p>', '<p>Kết quả: C001 4, C002 1, C003 1. Nếu An chuyển thành phố, bốn dòng phải đổi cùng lúc — sót một là dữ liệu tự mâu thuẫn.</p>'],
    tn: [tn('redundancy', 'dư thừa')],
  }),
  cs({
    t: 'Which step removes which dependency?', k: 'MEDIUM', p: 8, loai: 'table',
    kn: ['1NF', '2NF', '3NF', 'BCNF'], tag: ['normalization'],
    en: '<p>Follow lesson 4.4 on the order table. For each change, say which step (normal form) it belongs to.</p>',
    vi: '<p>Theo bài 4.4 trên bảng đơn hàng. Với mỗi thay đổi, cho biết nó thuộc bước (dạng chuẩn) nào.</p>',
    bang: [bang1('b1', ['Change → step', 'Thay đổi → bước'],
      [{ ma: 'td', ten: 'Change / Thay đổi' }, { ma: 'buoc', ten: 'Step / Bước', luaChon: ['→ 1NF', '→ 2NF', '→ 3NF', 'BCNF check (no change needed)'] }],
      [{ o: { td: 'The column products = "P1:2, P7:1" becomes one row per product; total is dropped (derived)' }, a: { buoc: '→ 1NF' } },
        { o: { td: 'product_id → unit_price is moved to Product(product_id, unit_price)' }, a: { buoc: '→ 2NF' } },
        { o: { td: 'order_id → order_date, cust_id… is moved to Order(order_id, …)' }, a: { buoc: '→ 2NF' } },
        { o: { td: 'cust_id → cust_name, cust_city is moved to Customer(cust_id, cust_name, cust_city)' }, a: { buoc: '→ 3NF' } },
        { o: { td: 'Every determinant of the four tables is checked to be a key' }, a: { buoc: 'BCNF check (no change needed)' } }],
      ['Lists → 1NF; FDs on part of the key (order_id, product_id) → 2NF; non-key → non-key (cust_id → city) → 3NF; final determinant check → BCNF.', 'Danh sách → 1NF; FD trên một phần khoá (order_id, product_id) → 2NF; không khoá → không khoá (cust_id → city) → 3NF; kiểm định thuộc cuối cùng → BCNF.'])],
    gy: [['Partial dependencies are removed at 2NF, transitive ones at 3NF.', 'Phụ thuộc bộ phận gỡ ở 2NF, bắc cầu gỡ ở 3NF.'], ['The customer FD survives 2NF because it hides inside Order.', 'FD khách hàng sống sót qua 2NF vì nó nằm trong Order.']],
    lhg: [['Removing cust_id → cust_city at 2NF — cust_id is not part of the key.', 'Gỡ cust_id → cust_city ở 2NF — cust_id không thuộc khoá.'], ['Keeping total because "it is convenient" — it is derived.', 'Giữ total vì "tiện" — nó là dẫn xuất.']],
    tn: [tn('normal form', 'dạng chuẩn')],
  }),
  cs({
    t: 'The four-line answer template for the exam', k: 'EASY', p: 5, loai: 'order',
    kn: ['exam answer'], tag: ['normalization', 'exam'],
    en: '<p>Markers give half the points for justification. Order the four lines of the answer.</p>',
    vi: '<p>Người chấm cho nửa số điểm cho phần biện luận. Sắp bốn dòng của câu trả lời.</p>',
    cau: [ord('o1', ['The answer template', 'Khuôn trả lời'],
      ['List all FDs and compute the candidate keys', 'Name the violation: "X → Y is a partial / transitive dependency, so not 2NF / 3NF"', 'Decompose and state the key of each new relation', 'Verify: lossless (shared attribute is a key) and dependency preserving'],
      ['Keys first (you cannot judge without them), then the named violation, then the decomposition with keys, then the two checks.', 'Khoá trước (không có thì không xét được), rồi gọi tên vi phạm, rồi phân rã kèm khoá, rồi hai phép kiểm.'])],
    gy: [['You cannot name a partial dependency before you know the key.', 'Chưa biết khoá thì không gọi được phụ thuộc bộ phận.'], ['Verification comes last.', 'Kiểm chứng ở cuối.']],
    lhg: [['Writing only the final schema — half the marks are lost.', 'Chỉ viết lược đồ cuối — mất nửa điểm.'], ['Skipping the lossless check.', 'Bỏ phép kiểm không mất.']],
  }),
  cs({
    t: 'Read the final schema', k: 'MEDIUM', p: 6,
    kn: ['BCNF', 'lossless'], tag: ['normalization'],
    en: '<p>Final schema: Customer(cust_id, cust_name, cust_city), Order(order_id, order_date, cust_id), Product(product_id, unit_price), OrderLine(order_id, product_id, qty).</p>',
    vi: '<p>Lược đồ cuối: Customer(cust_id, cust_name, cust_city), Order(order_id, order_date, cust_id), Product(product_id, unit_price), OrderLine(order_id, product_id, qty).</p>',
    cau: [
      q('c1', ['Key of OrderLine?', 'Khoá của OrderLine?'], ['(order_id, product_id)', 'order_id', 'product_id', '(order_id, product_id, qty)'], ['One line per product per order.', 'Mỗi đơn mỗi sản phẩm một dòng.']),
      q('c2', ['Why is Order ⋈ OrderLine lossless?', 'Vì sao Order ⋈ OrderLine không mất?'], ['their common attribute order_id is the key of Order', 'because both tables have the same number of rows', 'because qty is numeric', 'it is not lossless'], ['Shared attribute = key of one side ⇒ lossless.', 'Thuộc tính chung = khoá của một phía ⇒ không mất.']),
      q('c3', ['A new customer with no order yet can now be stored because…', 'Khách mới chưa có đơn giờ lưu được vì…'], ['Customer has its own table keyed by cust_id', 'order_id can be NULL', 'qty defaults to 0', 'it still cannot be stored'], ['The insertion anomaly is gone.', 'Dị thường chèn đã hết.']),
      q('c4', ['Is the final schema in BCNF?', 'Lược đồ cuối có ở BCNF?'], ['Yes — every determinant is the key of its table', 'No — cust_id → cust_city remains', 'No — OrderLine has a composite key', 'Only 2NF'], ['cust_id → … lives in Customer where cust_id is the key.', 'cust_id → … nằm trong Customer, nơi cust_id là khoá.']),
    ],
    gy: [['Check each table separately.', 'Kiểm từng bảng riêng.'], ['A composite key does not prevent BCNF.', 'Khoá ghép không cản BCNF.']],
    lhg: [['Thinking a composite key means "not BCNF".', 'Tưởng khoá ghép nghĩa là "không BCNF".'], ['Forgetting that the join back must reproduce exactly the original rows.', 'Quên rằng nối lại phải ra đúng các dòng gốc.']],
    tn: [tn('BCNF', 'dạng chuẩn Boyce–Codd')],
  }),
]);
