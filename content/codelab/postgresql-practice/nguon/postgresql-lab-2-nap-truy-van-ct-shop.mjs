/**
 * PostgreSQL · LAB 2 (sau Ch4) — CT Shop: đổ dữ liệu, hỏi câu hỏi, sửa dữ liệu an toàn. Đề lớn 5 câu × 2 điểm trên CT Shop mini,
 * theo đúng các bước S6 / Q2 / Q6 / Q7 / U4 của lab2-solution.sql (con số đổi theo dữ liệu mini).
 */
import { doiDau, KHOA, deLonPg, CT_SHOP, kq, kqAn, sau, ma, pre, TN, tn } from './_chung.mjs';

export default doiDau({
  slug: 'postgresql-lab-2-nap-truy-van-ct-shop',
  ten: '4.5 Lab 2 — CT Shop: fill the shop, ask it questions',
  khoa: KHOA,
  baiHoc: 'postgresql-lab-2-nap-truy-van-ct-shop',
  de: [
    deLonPg({
      dangBai: 'lab',
      tieuDe: { en: 'Lab 2 — CT Shop: a price list, four questions and one safe clean-up', vi: 'Lab 2 — CT Shop: bảng giá, bốn câu hỏi và một lần dọn dẹp an toàn' },
      doKho: 'HARD', phut: 60, diem: 100,
      khaiNiem: ['INSERT … ON CONFLICT', 'WHERE / ORDER BY / ties', 'NULL trap', 'half-open date range', 'UPDATE … RETURNING'],
      tienQuyet: ['4.1–4.4 of this track'],
      the: ['postgresql', 'lab', 'dml', 'select', 'ctshop'],
      csdl: CT_SHOP, tenCsdl: 'ctshop',
      thuMuc: 'RollNo_Name_PG_Lab2',
      phu: { en: 'PostgreSQL course · after Chapter 4 · Suggested time: 60 minutes · 10 marks (5 × 2)', vi: 'Khoá PostgreSQL · sau Chương 4 · Thời gian gợi ý: 60 phút · 10 điểm (5 × 2)' },
      moTa: {
        en: '<p>The shop is open. Load the supplier\'s price list, answer four questions the owner asks every week, and cancel stale orders without touching anything else. One table per question — JOINs come in Lab 3. Every question is graded on a fresh copy of CT Shop mini (tab <code>ctshop.sql</code>), and the hidden checks change the data, so hard-coded answers fail.</p>',
        vi: '<p>Cửa hàng đã mở. Nạp bảng giá của nhà cung cấp, trả lời bốn câu chủ cửa hàng hỏi hằng tuần, và huỷ các đơn treo mà không đụng gì khác. Mỗi câu một bảng — JOIN để dành cho Lab 3. Mỗi câu được chấm trên một bản CT Shop mini sạch (tab <code>ctshop.sql</code>), kiểm ẩn đổi dữ liệu nên đáp án chép cứng sẽ trượt.</p>',
      },
      yeuCauChung: [
        { en: 'Exact column names and order as asked; every ORDER BY must be total (add a tie-breaker).', vi: 'Tên và thứ tự cột đúng như đề; mọi ORDER BY phải xác định hoàn toàn (thêm khoá phá hoà).' },
        { en: 'No BEGIN/COMMIT — the grader wraps each question in its own transaction.', vi: 'Không BEGIN/COMMIT — máy chấm tự bọc mỗi câu trong một giao dịch.' },
      ],
      moHinh: [
        { ten: 'product', truong: [['id', 'bigint', 'identity PK'], ['sku', 'text', 'UNIQUE'], ['name', 'text', ''], ['category_id', 'int', '→ category'], ['price', 'numeric(12,2)', '> 0'], ['stock', 'int', '≥ 0'], ['is_active', 'boolean', '']] },
        { ten: 'customer', truong: [['id', 'bigint', 'PK'], ['email', 'text', ''], ['full_name', 'text', ''], ['phone', 'text', 'NULL for kh007'], ['city', 'text', '']] },
        { ten: 'orders', truong: [['id', 'bigint', 'PK'], ['customer_id', 'bigint', '→ customer'], ['status', 'text', 'pending|paid|shipped|cancelled'], ['created_at', 'timestamptz', 'Vietnam time'], ['note', 'text', 'optional']] },
      ],
      cau: [
        {
          ten: { en: 'Load the supplier price list (UPSERT)', vi: 'Nạp bảng giá nhà cung cấp (UPSERT)' }, diem: 2,
          moTa: { en: `Apply this list in ONE statement: a known SKU takes the new price and ADDS the delivered units to its stock; an unknown SKU becomes a new product. Return <code>sku, price, stock</code>.${pre(`sku      name                               category_id   price    delivered
CT0501   Bút bi Thiên Long TL-027 (xanh)    5               5500    50
CT1001   Máy tính Casio FX-580VN X          10            690000     5
CT0505   Bút gel Zebra Sarasa Clip 0.5mm    5              24000    30`)}`, vi: `Áp bảng này bằng MỘT lệnh: SKU đã có nhận giá mới và CỘNG số giao vào tồn kho; SKU chưa có thành sản phẩm mới. Trả về <code>sku, price, stock</code>.${pre(`sku      name                               category_id   price    số giao
CT0501   Bút bi Thiên Long TL-027 (xanh)    5               5500    50
CT1001   Máy tính Casio FX-580VN X          10            690000     5
CT0505   Bút gel Zebra Sarasa Clip 0.5mm    5              24000    30`)}` },
          yeuCau: [{ en: '<code>ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, stock = product.stock + EXCLUDED.stock</code>.', vi: '<code>ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, stock = product.stock + EXCLUDED.stock</code>.' }],
          giai: `INSERT INTO product (sku, name, category_id, price, stock)
VALUES ('CT0501', 'Bút bi Thiên Long TL-027 (xanh)', 5, 5500, 50),
       ('CT1001', 'Máy tính Casio FX-580VN X', 10, 690000, 5),
       ('CT0505', 'Bút gel Zebra Sarasa Clip 0.5mm', 5, 24000, 30)
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price,                  -- the supplier's new price
      stock = product.stock + EXCLUDED.stock   -- add the delivery to what is on the shelf
RETURNING sku, price, stock;`,
          kiem: [
            kq(['Q1 · RETURNING of the three rows', 'Q1 · RETURNING của ba dòng']),
            sau(['Q1 · stored rows', 'Q1 · các dòng đã lưu'], "SELECT sku, price, stock FROM product WHERE sku IN ('CT0501', 'CT1001', 'CT0505') ORDER BY sku", { thuTu: true }),
            sau(['Q1 · stock is added, not overwritten', 'Q1 · tồn kho được cộng, không ghi đè'], "SELECT sku, stock FROM product WHERE sku IN ('CT0501', 'CT1001') ORDER BY sku", { an: true, thuTu: true, themCsdl: "UPDATE product SET stock = 3 WHERE sku = 'CT1001'" }),
          ],
          saiMau: ["INSERT INTO product (sku, name, category_id, price, stock) VALUES ('CT0501', 'Bút bi Thiên Long TL-027 (xanh)', 5, 5500, 50), ('CT1001', 'Máy tính Casio FX-580VN X', 10, 690000, 5), ('CT0505', 'Bút gel Zebra Sarasa Clip 0.5mm', 5, 24000, 30) ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock RETURNING sku, price, stock"],
        },
        {
          ten: { en: 'Everything under 10 000 đ', vi: 'Mọi thứ dưới 10 000 đ' }, diem: 2,
          moTa: { en: 'List <code>sku, name, price</code> of every product cheaper than 10 000 đ, cheapest first, ties by sku.', vi: 'Liệt kê <code>sku, name, price</code> của mọi sản phẩm rẻ hơn 10 000 đ, rẻ nhất trước, cùng giá theo sku.' },
          yeuCau: [{ en: '<code>ORDER BY price, sku</code>.', vi: '<code>ORDER BY price, sku</code>.' }],
          giai: `SELECT sku, name, price
FROM product
WHERE price < 10000
ORDER BY price, sku;              -- CT0501 and CT1101 both cost 5 000: sku breaks the tie`,
          kiem: [
            kq(['Q2 · five products', 'Q2 · năm sản phẩm'], { thuTu: true }),
            kqAn(['Q2 · 10 000 exactly is not "cheaper than"', 'Q2 · đúng 10 000 không phải "rẻ hơn"'], "INSERT INTO product (sku, name, category_id, price) VALUES ('CT0703', 'Bút dạ quang Thiên Long HL-03', 7, 7000), ('CT1102', 'Thước thép Deli 30cm', 11, 10000)", { thuTu: true }),
            ma(['Q2 · ties broken by sku', 'Q2 · cùng giá thì phá hoà bằng sku'], 'ORDER\\s+BY\\s+price(\\s+ASC)?\\s*,\\s*sku'),
          ],
          saiMau: ['SELECT sku, name, price FROM product WHERE price < 10000 ORDER BY price', 'SELECT sku, name, price FROM product WHERE price <= 10000 ORDER BY price, sku'],
        },
        {
          ten: { en: 'Who can the 09x SMS gateway NOT reach?', vi: 'Cổng SMS 09x KHÔNG gửi được cho ai?' }, diem: 2,
          moTa: { en: 'The SMS gateway only sends to numbers starting with <code>09</code>. List <code>id, full_name, phone</code> of the customers it cannot reach — including those without a phone. Order by id.', vi: 'Cổng SMS chỉ gửi tới số bắt đầu bằng <code>09</code>. Liệt kê <code>id, full_name, phone</code> của khách nó không gửi được — kể cả khách không có số. Sắp theo id.' },
          yeuCau: [{ en: '<code>phone NOT LIKE \'09%\'</code> alone forgets NULL phones (NULL NOT LIKE … is UNKNOWN).', vi: 'Chỉ <code>phone NOT LIKE \'09%\'</code> sẽ quên khách không có số (NULL NOT LIKE … là UNKNOWN).' }],
          giai: `SELECT id, full_name, phone
FROM customer
WHERE phone NOT LIKE '09%' OR phone IS NULL      -- the NULL trap of lab 2 Q6
ORDER BY id;`,
          kiem: [
            kq(['Q3 · kh007 (no phone) and kh008 (032…)', 'Q3 · kh007 (không số) và kh008 (032…)'], { thuTu: true }),
            kqAn(['Q3 · more customers', 'Q3 · thêm khách'], "INSERT INTO customer (email, full_name, phone) VALUES ('kh009@ctshop.vn', 'Lê Văn Tú', NULL), ('kh010@ctshop.vn', 'Ngô Hà', '0912345678'), ('kh011@ctshop.vn', 'Đỗ Lan', '0861234567')", { thuTu: true }),
          ],
          saiMau: ["SELECT id, full_name, phone FROM customer WHERE phone NOT LIKE '09%' ORDER BY id"],
        },
        {
          ten: { en: 'Orders of September 2026', vi: 'Đơn của tháng 9/2026' }, diem: 2,
          moTa: { en: 'List <code>id, created_at</code> of every order placed in September 2026 (Vietnam time), in time order.', vi: 'Liệt kê <code>id, created_at</code> của mọi đơn đặt trong tháng 9/2026 (giờ Việt Nam), theo thứ tự thời gian.' },
          yeuCau: [{ en: 'A half-open range: <code>&gt;= \'2026-09-01\' AND &lt; \'2026-10-01\'</code> — BETWEEN would stop at 30 Sep 00:00.', vi: 'Khoảng nửa mở: <code>&gt;= \'2026-09-01\' AND &lt; \'2026-10-01\'</code> — BETWEEN sẽ dừng ở 00:00 ngày 30/9.' }],
          giai: `SELECT id, created_at
FROM orders
WHERE created_at >= '2026-09-01' AND created_at < '2026-10-01'
ORDER BY created_at, id;`,
          kiem: [
            kq(['Q4 · five orders, including 30 Sep 19:20', 'Q4 · năm đơn, gồm cả 19:20 ngày 30/9'], { thuTu: true }),
            kqAn(['Q4 · 1 Oct 00:00 is October', 'Q4 · 00:00 ngày 1/10 là tháng 10'], "INSERT INTO orders (customer_id, status, created_at) VALUES (8, 'paid', '2026-10-01 00:00+07'), (8, 'paid', '2026-09-30 23:59+07')", { thuTu: true }),
          ],
          saiMau: ["SELECT id, created_at FROM orders WHERE created_at BETWEEN '2026-09-01' AND '2026-09-30' ORDER BY created_at, id"],
        },
        {
          ten: { en: 'Cancel stale pending orders — for real', vi: 'Huỷ đơn treo — làm thật' }, diem: 2,
          moTa: { en: 'Orders still <code>pending</code> that were created before <b>2 October 2026</b> are stale. Set their status to <code>cancelled</code> and their note to <code>auto-cancel: pending &gt; 24h</code>; touch nothing else. Return <code>id, status, note</code>.', vi: 'Đơn còn <code>pending</code> tạo trước <b>ngày 2/10/2026</b> là đơn treo. Đặt status thành <code>cancelled</code> và note thành <code>auto-cancel: pending &gt; 24h</code>; không đụng gì khác. Trả về <code>id, status, note</code>.' },
          yeuCau: [{ en: 'One UPDATE with both conditions and RETURNING.', vi: 'Một lệnh UPDATE với cả hai điều kiện và RETURNING.' }],
          giai: `UPDATE orders
SET status = 'cancelled',
    note   = 'auto-cancel: pending > 24h'
WHERE status = 'pending'
  AND created_at < '2026-10-02'                -- order 11 (2 Oct 09:00) is not stale yet
RETURNING id, status, note;`,
          kiem: [
            kq(['Q5 · order 7 is cancelled', 'Q5 · đơn 7 bị huỷ']),
            sau(['Q5 · statuses after the clean-up', 'Q5 · trạng thái sau khi dọn'], 'SELECT status, count(*) AS n FROM orders GROUP BY status ORDER BY status', { thuTu: true }),
            kqAn(['Q5 · a paid order from September is not touched', 'Q5 · đơn đã trả tháng 9 không bị đụng'], "INSERT INTO orders (customer_id, status, created_at) VALUES (8, 'pending', '2026-09-15 10:00+07')"),
          ],
          saiMau: ["UPDATE orders SET status = 'cancelled', note = 'auto-cancel: pending > 24h' WHERE status = 'pending' RETURNING id, status, note", "UPDATE orders SET status = 'cancelled', note = 'auto-cancel: pending > 24h' WHERE created_at < '2026-10-02' RETURNING id, status, note"],
        },
      ],
      truDiem: [
        { en: 'Hard-coded ids or results (the hidden checks change the data).', vi: 'Ghi cứng id hay kết quả (kiểm ẩn đổi dữ liệu).' },
        { en: 'An UPDATE/DELETE whose WHERE was never tested as a SELECT first.', vi: 'UPDATE/DELETE mà WHERE chưa từng được thử bằng SELECT trước.' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q5.sql. <b>Run</b> = sample checks; <b>Submit</b> = every check and the 10-mark table.',
        vi: 'Các tab Q1.sql … Q5.sql. <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm và bảng điểm thang 10.',
      },
      thuatNgu: [TN.upsert, TN.excluded, TN.nullT, TN.tieBreak, tn('half-open range', 'khoảng nửa mở')],
      goiY: [
        { en: 'Q1: the alias of the table in DO UPDATE is the table name (<code>product.stock</code>) unless you write <code>INSERT INTO product AS p</code>.', vi: 'Q1: trong DO UPDATE, bảng được gọi bằng tên (<code>product.stock</code>) trừ khi bạn viết <code>INSERT INTO product AS p</code>.' },
        { en: 'Q3: draw the truth table of <code>phone NOT LIKE \'09%\'</code> for phone = NULL.', vi: 'Q3: vẽ bảng chân trị của <code>phone NOT LIKE \'09%\'</code> khi phone = NULL.' },
        { en: 'Q5: run the WHERE as a SELECT first: only order 7 must come back.', vi: 'Q5: chạy WHERE dưới dạng SELECT trước: chỉ đơn 7 được trả về.' },
      ],
      loiHayGap: [
        { en: 'Q1 overwriting the stock with the delivery size.', vi: 'Q1 ghi đè tồn kho bằng số lượng giao.' },
        { en: 'Q2 ordering by price only — CT0501 and CT1101 swap places between runs.', vi: 'Q2 chỉ sắp theo giá — CT0501 và CT1101 đổi chỗ giữa các lần chạy.' },
        { en: 'Q4 BETWEEN \'2026-09-01\' AND \'2026-09-30\' — loses the evening of 30 September.', vi: 'Q4 BETWEEN \'2026-09-01\' AND \'2026-09-30\' — mất buổi tối ngày 30/9.' },
      ],
      giaiThich: { en: '<p>Same steps as <code>lab2-solution.sql</code> of the course (S6, Q2, Q6, Q7, U4), on the mini data set. Each answer states every business condition explicitly and makes the ordering total.</p>', vi: '<p>Cùng các bước với <code>lab2-solution.sql</code> của khoá (S6, Q2, Q6, Q7, U4), trên bộ dữ liệu mini. Mỗi đáp án nêu tường minh mọi điều kiện nghiệp vụ và làm thứ tự xác định hoàn toàn.</p>' },
    }),
  ],
});
