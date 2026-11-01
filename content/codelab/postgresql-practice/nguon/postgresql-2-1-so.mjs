/** PostgreSQL · 2.1 — Số: số nguyên, numeric & bẫy tiền bạc. Bảng nhỏ của bài + CT Shop mini. */
import { mod, pg, kq, kqAn, sau, chan, duoc, ma, pre, TN, tn } from './_chung.mjs';

const SALE = `CREATE TABLE big_sale (
  id          int PRIMARY KEY,
  qty         int NOT NULL,
  unit_cents  int NOT NULL
);
INSERT INTO big_sale VALUES (1, 3, 1990000), (2, 120, 450000), (3, 50000, 990000), (4, 2500, 1000000);`;
const TIP = `CREATE TABLE tip (
  id        int PRIMARY KEY,
  amount_f  double precision NOT NULL,   -- how the first version stored money
  amount_n  numeric(12,2)    NOT NULL    -- how it should be stored
);
INSERT INTO tip SELECT g, 0.1, 0.10 FROM generate_series(1, 10) g;`;
const TICKET = `CREATE TABLE ticket (
  id    int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL
);
INSERT INTO ticket (title) VALUES ('Printer jam'), ('Wi-Fi down');`;

export default mod('postgresql-2-1-so', '2.1 Numbers: integers, numeric & the money trap', [
  pg({
    t: 'integer out of range: multiply in bigint', k: 'EASY', p: 7, kn: ['int vs bigint', '::bigint cast', 'overflow 22003'], tag: ['types', 'numeric'],
    csdl: SALE, tenCsdl: 'big_sale', ld: { en: pre('big_sale (id int PK, qty int, unit_cents int) — 4 rows; row 3 is 50 000 × 990 000 cents'), vi: pre('big_sale (id int PK, qty int, unit_cents int) — 4 dòng; dòng 3 là 50 000 × 990 000 xu') },
    en: `<p>The report <code>SELECT id, qty * unit_cents AS total_cents FROM big_sale</code> crashes with <code>ERROR: integer out of range</code>: int × int is computed as int (max 2 147 483 647). Return <code>id, total_cents</code> for every row, ordered by id, <b>without</b> changing the table.</p>`,
    vi: `<p>Báo cáo <code>SELECT id, qty * unit_cents AS total_cents FROM big_sale</code> sập với <code>ERROR: integer out of range</code>: int × int được tính bằng int (tối đa 2 147 483 647). Trả về <code>id, total_cents</code> cho mọi dòng, sắp theo id, <b>không</b> sửa bảng.</p>`,
    yc: [['Cast one operand to <code>bigint</code> before multiplying.', 'Ép một toán hạng sang <code>bigint</code> trước khi nhân.'], ['Columns <code>id, total_cents</code>.', 'Cột <code>id, total_cents</code>.']],
    giai: `SELECT id,
       qty::bigint * unit_cents AS total_cents   -- bigint × int ⇒ bigint (max 9.2 × 10^18)
FROM big_sale
ORDER BY id;`,
    kiem: [
      kq(['Four totals, row 3 = 49 500 000 000', 'Bốn tổng, dòng 3 = 49 500 000 000'], { thuTu: true }),
      kqAn(['Even bigger rows still fit', 'Dòng còn lớn hơn vẫn vừa'], 'INSERT INTO big_sale VALUES (5, 2000000000, 2000000000)', { thuTu: true }),
      ma(['Casts to bigint (or numeric)', 'Ép sang bigint (hoặc numeric)'], '::\\s*(bigint|int8|numeric)|CAST\\s*\\('),
    ],
    sai: ['SELECT id, qty * unit_cents AS total_cents FROM big_sale ORDER BY id', 'SELECT id, (qty * unit_cents)::bigint AS total_cents FROM big_sale ORDER BY id'],
    gy: [['The TYPE of an expression is decided by its operands, not by how big the result will be.', 'KIỂU của biểu thức do toán hạng quyết định, không do kết quả lớn cỡ nào.'], ['<code>qty::bigint * unit_cents</code> — the cast must happen BEFORE the multiplication.', '<code>qty::bigint * unit_cents</code> — phải ép TRƯỚC phép nhân.']],
    lhg: [['<code>(qty * unit_cents)::bigint</code> — the overflow already happened inside the parentheses.', '<code>(qty * unit_cents)::bigint</code> — tràn số đã xảy ra bên trong ngoặc.'], ['"Fixing" it with float — the result is approximate, wrong for money.', '"Sửa" bằng float — kết quả gần đúng, sai với tiền.']],
    gt: ['<p>PostgreSQL never silently wraps around: an int result above 2 147 483 647 is an error (SQLSTATE 22003). Promoting one side to bigint makes the whole product bigint.</p>', '<p>PostgreSQL không bao giờ lặng lẽ quay vòng: kết quả int vượt 2 147 483 647 là lỗi (SQLSTATE 22003). Nâng một vế lên bigint thì cả tích là bigint.</p>'],
    tn: [tn('overflow', 'tràn số'), tn('cast (::)', 'ép kiểu')],
  }),

  pg({
    t: 'Money in float vs numeric', k: 'EASY', p: 6, kn: ['numeric', 'double precision', 'exact vs approximate'], tag: ['types', 'numeric', 'money'],
    csdl: TIP, tenCsdl: 'tip', ld: { en: pre('tip (id, amount_f double precision, amount_n numeric(12,2)) — ten tips of 0.10'), vi: pre('tip (id, amount_f double precision, amount_n numeric(12,2)) — mười khoản 0.10') },
    en: '<p>Ten customers each tipped 0.10. Return one row: <code>total</code> (the sum) and <code>is_one</code> (whether the total equals exactly <code>1.00</code>). The answer must be <code>1.00 | true</code> — use the column that stores money correctly.</p>',
    vi: '<p>Mười khách mỗi người tip 0.10. Trả về một dòng: <code>total</code> (tổng) và <code>is_one</code> (tổng có đúng bằng <code>1.00</code> không). Đáp án phải là <code>1.00 | true</code> — dùng cột lưu tiền đúng cách.</p>',
    yc: [['One SELECT with <code>sum(…)</code>; columns <code>total, is_one</code>.', 'Một câu SELECT với <code>sum(…)</code>; cột <code>total, is_one</code>.'], ['Never compare money stored as float for equality.', 'Đừng bao giờ so bằng tiền lưu kiểu float.']],
    giai: `SELECT sum(amount_n)          AS total,    -- numeric: exact decimal arithmetic ⇒ 1.00
       sum(amount_n) = 1.00   AS is_one
FROM tip;
-- with amount_f: 0.9999999999999999 and false`,
    kiem: [
      kq(['1.00 and true', '1.00 và true']),
      kqAn(['A hundred tips of 0.10 add up to 10.00 — is_one false', 'Một trăm khoản 0.10 cộng ra 10.00 — is_one false'], 'INSERT INTO tip SELECT g, 0.1, 0.10 FROM generate_series(11, 100) g'),
      ma(['Sums the numeric column', 'Cộng cột numeric'], 'sum\\s*\\(\\s*amount_n\\s*\\)'),
    ],
    sai: ['SELECT sum(amount_f) AS total, sum(amount_f) = 1.00 AS is_one FROM tip', 'SELECT round(sum(amount_f)::numeric, 2) AS total, true AS is_one FROM tip'],
    gy: [['Look at the column types in the schema.', 'Xem kiểu các cột trong lược đồ.'], ['<code>sum(numeric)</code> stays exact; <code>sum(double precision)</code> accumulates binary rounding error.', '<code>sum(numeric)</code> chính xác; <code>sum(double precision)</code> cộng dồn sai số làm tròn nhị phân.']],
    lhg: [['Summing the float column: 0.9999999999999999, and the equality is false.', 'Cộng cột float: 0.9999999999999999, phép so bằng ra false.'], ['Rounding the float sum to hide the error — the error is still in every row and comes back in the next calculation.', 'Làm tròn tổng float để che lỗi — sai số vẫn nằm trong từng dòng và quay lại ở phép tính sau.']],
    gt: ['<p>0.1 has no exact binary representation, so ten float additions miss 1 by about 10<sup>−16</sup>. <code>numeric</code> stores decimal digits and adds them exactly — the only right type for money.</p>', '<p>0.1 không biểu diễn chính xác được ở hệ nhị phân, nên mười phép cộng float lệch 1 khoảng 10<sup>−16</sup>. <code>numeric</code> lưu chữ số thập phân và cộng chính xác — kiểu duy nhất đúng cho tiền.</p>'],
    tn: [tn('numeric(p,s)', 'số thập phân chính xác'), tn('double precision', 'số thực dấu phẩy động (gần đúng)')],
  }),

  pg({
    t: 'Import legacy ids into an identity column', k: 'MEDIUM', p: 10, kn: ['GENERATED ALWAYS', 'OVERRIDING SYSTEM VALUE', 'setval', 'pg_get_serial_sequence'], tag: ['types', 'identity'],
    csdl: TICKET, tenCsdl: 'ticket', ld: { en: pre('ticket (id int GENERATED ALWAYS AS IDENTITY PK, title) — ids 1, 2 already used'), vi: pre('ticket (id int GENERATED ALWAYS AS IDENTITY PK, title) — id 1, 2 đã dùng') },
    en: '<p>Two tickets from the old system must keep their ids: <b>100</b> "Projector broken" and <b>101</b> "No toner". Insert them with those ids, then make sure the <b>next</b> ticket created normally gets id <b>102</b> (not 3, and not a collision later).</p>',
    vi: '<p>Hai phiếu từ hệ cũ phải giữ id: <b>100</b> "Projector broken" và <b>101</b> "No toner". Chèn chúng với đúng id đó, rồi bảo đảm phiếu <b>kế tiếp</b> tạo bình thường nhận id <b>102</b> (không phải 3, và không đụng nhau về sau).</p>',
    yc: [['<code>INSERT … OVERRIDING SYSTEM VALUE VALUES (100, …), (101, …)</code> — a GENERATED ALWAYS column refuses explicit ids otherwise.', '<code>INSERT … OVERRIDING SYSTEM VALUE VALUES (100, …), (101, …)</code> — cột GENERATED ALWAYS từ chối id ghi tay nếu không có nó.'], ['Move the identity sequence: <code>SELECT setval(pg_get_serial_sequence(\'ticket\', \'id\'), …)</code> computed from the table, not a hard-coded 101.', 'Dời sequence của cột identity: <code>SELECT setval(pg_get_serial_sequence(\'ticket\', \'id\'), …)</code> tính từ bảng, không ghi cứng 101.']],
    giai: `INSERT INTO ticket (id, title) OVERRIDING SYSTEM VALUE
VALUES (100, 'Projector broken'), (101, 'No toner');

-- the sequence still says "next is 3": move it past the largest id actually in the table
SELECT setval(pg_get_serial_sequence('ticket', 'id'), (SELECT max(id) FROM ticket));`,
    kiem: [
      sau(['The next normal insert gets id 102', 'Lần chèn bình thường kế tiếp nhận id 102'], "INSERT INTO ticket (title) VALUES ('New one'); SELECT id, title FROM ticket ORDER BY id", { thuTu: true }),
      chan(['A plain explicit id is still refused (column stays GENERATED ALWAYS)', 'Id ghi tay thường vẫn bị từ chối (cột vẫn GENERATED ALWAYS)'], "INSERT INTO ticket (id, title) VALUES (500, 'x')", '428C9'),
      sau(['Works when the legacy table already went further', 'Đúng cả khi bảng đã đi xa hơn'], "INSERT INTO ticket (title) VALUES ('New one'); SELECT max(id) AS last_id FROM ticket", { an: true, themCsdl: "INSERT INTO ticket (id, title) OVERRIDING SYSTEM VALUE VALUES (250, 'old max')" }),
      ma(['Uses OVERRIDING SYSTEM VALUE', 'Dùng OVERRIDING SYSTEM VALUE'], 'OVERRIDING\\s+SYSTEM\\s+VALUE'),
    ],
    sai: ["INSERT INTO ticket (id, title) OVERRIDING SYSTEM VALUE VALUES (100, 'Projector broken'), (101, 'No toner');", "INSERT INTO ticket (id, title) OVERRIDING SYSTEM VALUE VALUES (100, 'Projector broken'), (101, 'No toner'); SELECT setval(pg_get_serial_sequence('ticket', 'id'), 101);"],
    gy: [['Explicit ids into GENERATED ALWAYS need <code>OVERRIDING SYSTEM VALUE</code> after the column list.', 'Id ghi tay vào cột GENERATED ALWAYS cần <code>OVERRIDING SYSTEM VALUE</code> sau danh sách cột.'], ['<code>setval(seq, n)</code> makes the next value n + 1; take n from <code>max(id)</code>.', '<code>setval(seq, n)</code> làm giá trị kế tiếp là n + 1; lấy n từ <code>max(id)</code>.']],
    lhg: [['Forgetting setval: the next insert gets 3 — fine today, and a duplicate-key error the day the sequence reaches 100.', 'Quên setval: lần chèn sau nhận 3 — hôm nay ổn, và lỗi trùng khoá vào ngày sequence chạm 100.'], ['Hard-coding <code>setval(…, 101)</code>: correct only if nobody imported higher ids.', 'Ghi cứng <code>setval(…, 101)</code>: chỉ đúng khi không ai nhập id cao hơn.']],
    gt: ['<p>An identity column is a sequence plus a default. Writing ids yourself does not advance the sequence, so after an import you move it with <code>setval</code> to the real maximum.</p>', '<p>Cột identity là một sequence cộng một giá trị mặc định. Tự ghi id không đẩy sequence lên, nên sau khi nhập dữ liệu phải dời nó bằng <code>setval</code> tới giá trị lớn nhất thật.</p>'],
    tn: [TN.identity, tn('sequence', 'bộ đếm', 'đối tượng cấp số tăng dần, dùng cho identity')],
  }),

  pg({
    t: 'VAT on an invoice, rounded like an accountant', k: 'HARD', p: 12, kn: ['numeric arithmetic', 'round()', 'integer division trap'], tag: ['numeric', 'money', 'ctshop'],
    en: '<p>Print the invoice of <b>order 5</b>: for each line return <code>sku</code>, <code>qty</code>, <code>unit_price</code>, <code>line_total</code> (qty × unit_price), <code>vat</code> = 8 % of line_total rounded to whole đồng, and <code>avg_unit</code> = the average unit price of the order\'s lines rounded to 2 decimals (same value on each line). Order by sku.</p>',
    vi: '<p>In hoá đơn của <b>đơn 5</b>: với mỗi dòng trả về <code>sku</code>, <code>qty</code>, <code>unit_price</code>, <code>line_total</code> (qty × unit_price), <code>vat</code> = 8 % của line_total làm tròn tới đồng, và <code>avg_unit</code> = đơn giá trung bình của các dòng trong đơn, làm tròn 2 chữ số (cùng giá trị ở mọi dòng). Sắp theo sku.</p>',
    yc: [['Join order_item to product for the sku; filter order 5.', 'Nối order_item với product để lấy sku; lọc đơn 5.'], ['<code>vat = round(line_total * 0.08)</code>; <code>avg_unit</code> from a subquery (or a window function) on the same order.', '<code>vat = round(line_total * 0.08)</code>; <code>avg_unit</code> lấy từ truy vấn con (hoặc hàm cửa sổ) trên cùng đơn.']],
    giai: `SELECT p.sku,
       oi.qty,
       oi.unit_price,
       oi.qty * oi.unit_price                    AS line_total,
       round(oi.qty * oi.unit_price * 0.08)      AS vat,          -- numeric × numeric: exact, then round
       (SELECT round(avg(unit_price), 2)
        FROM order_item WHERE order_id = 5)       AS avg_unit
FROM order_item oi
JOIN product p ON p.id = oi.product_id
WHERE oi.order_id = 5
ORDER BY p.sku;`,
    kiem: [
      kq(['Three lines of order 5', 'Ba dòng của đơn 5'], { thuTu: true }),
      kqAn(['A price with odd cents still rounds VAT correctly', 'Giá lẻ vẫn làm tròn VAT đúng'], 'UPDATE order_item SET unit_price = 4015.55 WHERE order_id = 5 AND product_id = 7', { thuTu: true }),
      ma(['Rounds with round()', 'Làm tròn bằng round()'], '\\bround\\s*\\('),
    ],
    sai: [
      'SELECT p.sku, oi.qty, oi.unit_price, oi.qty * oi.unit_price AS line_total, round(oi.unit_price * 0.08) * oi.qty AS vat, (SELECT round(avg(unit_price), 2) FROM order_item WHERE order_id = 5) AS avg_unit FROM order_item oi JOIN product p ON p.id = oi.product_id WHERE oi.order_id = 5 ORDER BY p.sku',
      'SELECT p.sku, oi.qty, oi.unit_price, oi.qty * oi.unit_price AS line_total, round(oi.qty * oi.unit_price * 0.08) AS vat, (SELECT round(sum(unit_price)::int / count(*), 2) FROM order_item WHERE order_id = 5) AS avg_unit FROM order_item oi JOIN product p ON p.id = oi.product_id WHERE oi.order_id = 5 ORDER BY p.sku',
    ],
    gy: [['<code>round(x)</code> on numeric rounds half away from zero; <code>round(x, 2)</code> keeps 2 decimals.', '<code>round(x)</code> trên numeric làm tròn nửa ra xa số 0; <code>round(x, 2)</code> giữ 2 chữ số.'], ['avg(numeric) is exact; int / int would drop the fraction.', 'avg(numeric) chính xác; int / int sẽ cắt phần lẻ.']],
    lhg: [['Rounding the VAT of ONE unit and multiplying by qty — the rounding error is multiplied too (10 × 321 = 3 210 instead of 3 212).', 'Làm tròn VAT của MỘT đơn vị rồi nhân số lượng — sai số làm tròn bị nhân theo (10 × 321 = 3 210 thay vì 3 212).'], ['Average as <code>sum(…)::int / count(*)</code>: integer division silently drops the fraction.', 'Trung bình bằng <code>sum(…)::int / count(*)</code>: chia nguyên lặng lẽ cắt phần lẻ.']],
    gt: ['<p>Keeping every money value in <code>numeric</code> makes multiplication by 0.08 exact; you round once, at the end, to whole đồng. <code>avg()</code> of numeric returns numeric with full precision, so <code>round(…, 2)</code> gives the right two decimals.</p>', '<p>Giữ mọi giá trị tiền ở <code>numeric</code> thì phép nhân 0.08 chính xác; chỉ làm tròn một lần, ở cuối, tới đồng. <code>avg()</code> của numeric trả numeric đủ chữ số, nên <code>round(…, 2)</code> cho đúng hai chữ số thập phân.</p>'],
    tn: [tn('round half away from zero', 'làm tròn nửa ra xa 0'), TN.join],
  }),
]);
