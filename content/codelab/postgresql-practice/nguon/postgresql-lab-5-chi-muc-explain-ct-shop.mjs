/**
 * PostgreSQL · LAB 5 (sau Ch10) — CT Shop: nhiều đơn hàng — chỉ mục và EXPLAIN. Đề lớn 5 câu × 2 điểm theo P2/P3/P4/P5/P6
 * của lab5-solution.sql. Bài giảng dùng 1 triệu đơn; ở đây 20 000 đơn TẤT ĐỊNH (generate_series, không random) + ANALYZE,
 * đủ để bộ lập kế hoạch chọn giống vậy. Không có CONCURRENTLY: máy chấm chạy mọi thứ trong một giao dịch (25001).
 */
import { doiDau, KHOA, deLonPg, CT_DDL, PLAN_ALL, kq, kqAn, sau, ma, tn, TN } from './_chung.mjs';

const lit = (s) => s.replace(/'/g, "''");
const BIG = `SET TimeZone = 'Asia/Ho_Chi_Minh';
${CT_DDL.customer}
${CT_DDL.orders}
-- 5 000 customers (kh0001 … kh5000); only customers 1–500 have orders (40 each)
INSERT INTO customer (email, full_name, city)
SELECT format('kh%s@ctshop.vn', lpad(g::text, 4, '0')), 'Khách ' || g,
       (ARRAY['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'])[g % 5 + 1]
FROM generate_series(1, 5000) g;
-- 20 000 orders, one every 31 minutes from 2025-01-01; pending ≈ 1.6 %, cancelled ≈ 7 %
INSERT INTO orders (customer_id, status, created_at)
SELECT g % 500 + 1,
       CASE WHEN g % 64 = 0 THEN 'pending' WHEN g % 13 = 0 THEN 'cancelled' WHEN g % 2 = 0 THEN 'paid' ELSE 'shipped' END,
       timestamptz '2025-01-01 08:00+07' + g * interval '31 minutes'
FROM generate_series(1, 20000) g;
ANALYZE customer; ANALYZE orders;
-- grader helpers (print plans of a query text)
${PLAN_ALL}`;
const IMPORT = `${BIG}
-- flash sale 11/11: 3 000 new pending orders imported a minute ago — no ANALYZE has run since
INSERT INTO orders (customer_id, status, created_at)
SELECT g % 500 + 1, 'pending', timestamptz '2026-11-11 00:00+07' + g * interval '1 second' FROM generate_series(1, 3000) g;`;
const Q_HIST = 'SELECT id, created_at, status FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20';
const Q_BADGE = 'SELECT status, count(*) FROM orders WHERE customer_id = 42 GROUP BY status';
const Q_QUEUE = "SELECT id, customer_id, created_at FROM orders WHERE status = 'pending' ORDER BY created_at LIMIT 50";

export default doiDau({
  slug: 'postgresql-lab-5-chi-muc-explain-ct-shop',
  ten: '10.5 Lab 5 — CT Shop: many orders — indexes and EXPLAIN',
  khoa: KHOA,
  baiHoc: 'postgresql-lab-5-chi-muc-explain-ct-shop',
  de: [
    deLonPg({
      dangBai: 'lab',
      tieuDe: { en: 'Lab 5 — CT Shop: make the busy pages fast', vi: 'Lab 5 — CT Shop: làm các trang đông khách chạy nhanh' },
      doKho: 'HARD', phut: 80, diem: 100,
      khaiNiem: ['composite index for filter + sort', 'covering index (INCLUDE)', 'partial index', 'lower the input, not the column', 'stale statistics after a bulk import'],
      tienQuyet: ['9.1–10.4 of this track'],
      the: ['postgresql', 'lab', 'index', 'explain', 'ctshop'],
      csdl: BIG, tenCsdl: 'ctshop-big',
      thuMuc: 'RollNo_Name_PG_Lab5',
      phu: { en: 'PostgreSQL course · after Chapter 10 · Suggested time: 80 minutes · 10 marks (5 × 2)', vi: 'Khoá PostgreSQL · sau Chương 10 · Thời gian gợi ý: 80 phút · 10 điểm (5 × 2)' },
      moTa: {
        en: '<p>CT Shop now has thousands of customers and 20 000 orders (the course lab uses a million; the plans are the same). Five pages are slow. For each one, add the right index or rewrite the query — the grader reads the plan PostgreSQL actually chooses (helpers <code>plan_text</code>, <code>plan_rows</code> in the database), not the name you give your index. Production builds indexes <code>CONCURRENTLY</code>; the grader runs everything inside one transaction, so write plain <code>CREATE INDEX</code>.</p>',
        vi: '<p>CT Shop giờ có hàng nghìn khách và 20 000 đơn (lab của khoá dùng một triệu; kế hoạch vẫn như vậy). Năm trang đang chậm. Với mỗi trang, thêm đúng chỉ mục hoặc viết lại truy vấn — máy chấm đọc kế hoạch PostgreSQL thật sự chọn (các hàm <code>plan_text</code>, <code>plan_rows</code> trong CSDL), không đọc tên bạn đặt cho chỉ mục. Trên production phải tạo chỉ mục <code>CONCURRENTLY</code>; máy chấm chạy mọi thứ trong một giao dịch nên hãy viết <code>CREATE INDEX</code> thường.</p>',
      },
      yeuCauChung: [
        { en: 'Each question is graded on a fresh copy of <code>ctshop-big.sql</code> (no index except the keys).', vi: 'Mỗi câu chấm trên một bản <code>ctshop-big.sql</code> sạch (không chỉ mục nào ngoài khoá).' },
        { en: 'Smallest correct index wins: hidden checks look at index size where it matters.', vi: 'Chỉ mục đúng mà nhỏ nhất thì thắng: kiểm ẩn xét kích thước chỉ mục khi cần.' },
      ],
      moHinh: [
        { ten: 'customer', truong: [['id', 'bigint', 'PK (5 000 rows)'], ['email', 'text', 'UNIQUE (customer_email_key), CHECK lower-case'], ['full_name', 'text', ''], ['city', 'text', '']] },
        { ten: 'orders', truong: [['id', 'bigint', 'PK (20 000 rows)'], ['customer_id', 'bigint', '→ customer, NOT indexed (customers 1–500, 40 orders each)'], ['status', 'text', 'pending ≈ 1.6 %'], ['created_at', 'timestamptz', 'one order every 31 minutes']] },
      ],
      cau: [
        {
          ten: { en: 'P2 · the order history page', vi: 'P2 · trang lịch sử đơn' }, diem: 2,
          moTa: { en: `<code>${Q_HIST}</code> scans all orders and sorts. Create one index that finds customer 42's orders already in created_at DESC order (no Sort).`, vi: `<code>${Q_HIST}</code> quét mọi đơn rồi sắp. Tạo một chỉ mục tìm đơn của khách 42 đã sắp sẵn theo created_at DESC (không Sort).` },
          yeuCau: [{ en: 'Composite index, customer_id first.', vi: 'Chỉ mục tổ hợp, customer_id đứng trước.' }],
          giai: 'CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at DESC);',
          kiem: [
            sau(['P2 · seek on customer_id, no Sort', 'P2 · tìm theo customer_id, không Sort'], `SELECT plan_text('${lit(Q_HIST)}') ~ 'Index Cond: \\(customer_id = 42\\)' AS seeks, plan_text('${lit(Q_HIST)}') !~ 'Sort' AS no_sort`),
            sau(['P2 · the index leads with customer_id, then created_at', 'P2 · chỉ mục bắt đầu bằng customer_id, rồi created_at'], "SELECT bool_or(indexdef ~ '\\(customer_id, created_at') AS right_order FROM pg_indexes WHERE tablename = 'orders'"),
            sau(['P2 · the page still returns 20 rows', 'P2 · trang vẫn trả 20 dòng'], `SELECT count(*) AS rows FROM (${Q_HIST}) t`, { an: true }),
          ],
          saiMau: ['CREATE INDEX idx_orders_customer ON orders (customer_id);'],
        },
        {
          ten: { en: 'P3 · the status badge, from the index alone', vi: 'P3 · huy hiệu trạng thái, chỉ từ chỉ mục' }, diem: 2,
          moTa: { en: `<code>${Q_BADGE}</code> must be answered by an <b>Index Only Scan</b> (the check switches bitmap scans off).`, vi: `<code>${Q_BADGE}</code> phải được trả lời bằng <b>Index Only Scan</b> (kiểm tắt bitmap scan).` },
          yeuCau: [{ en: 'Key on customer_id; carry status with INCLUDE (or as a key column).', vi: 'Khoá trên customer_id; mang status bằng INCLUDE (hoặc làm cột khoá).' }],
          giai: 'CREATE INDEX idx_orders_customer_cover ON orders (customer_id, created_at DESC) INCLUDE (status);',
          kiem: [
            sau(['P3 · Index Only Scan', 'P3 · Index Only Scan'], `SET LOCAL enable_bitmapscan = off; SELECT plan_text('${lit(Q_BADGE)}') ~ 'Index Only Scan' AS index_only`),
            sau(['P3 · counts per status for customer 42 (after your index)', 'P3 · số đơn theo trạng thái của khách 42 (sau chỉ mục của bạn)'], `${Q_BADGE} ORDER BY status`, { thuTu: true }),
            sau(['P3 · status is carried by the index', 'P3 · status được chỉ mục mang theo'], "SELECT bool_or(indexdef ~ 'status') AS carries_status FROM pg_indexes WHERE tablename = 'orders' AND indexname NOT LIKE '%pkey'", { an: true }),
          ],
          saiMau: ['CREATE INDEX idx_orders_customer ON orders (customer_id);'],
        },
        {
          ten: { en: 'P4 · the admin queue of pending orders', vi: 'P4 · hàng đợi đơn pending của admin' }, diem: 2,
          moTa: { en: `<code>${Q_QUEUE}</code>: make it read only pending rows, already ordered — with the smallest index.`, vi: `<code>${Q_QUEUE}</code>: làm nó chỉ đọc các dòng pending, đã sắp sẵn — bằng chỉ mục nhỏ nhất.` },
          yeuCau: [{ en: 'A partial index on created_at WHERE status = \'pending\'.', vi: 'Chỉ mục từng phần trên created_at WHERE status = \'pending\'.' }],
          giai: "CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';",
          kiem: [
            sau(['P4 · Index Scan, no Sort', 'P4 · Index Scan, không Sort'], `SELECT plan_text('${lit(Q_QUEUE)}') ~ 'Index Scan' AS index_scan, plan_text('${lit(Q_QUEUE)}') !~ 'Sort' AS no_sort`),
            sau(['P4 · the index is partial', 'P4 · chỉ mục là từng phần'], "SELECT count(*) AS partial FROM pg_index WHERE indrelid = 'orders'::regclass AND indpred IS NOT NULL"),
            sau(['P4 · and small', 'P4 · và nhỏ'], "SELECT bool_and(pg_relation_size(indexrelid) < 40000) AS small FROM pg_index WHERE indrelid = 'orders'::regclass AND NOT indisprimary", { an: true }),
          ],
          saiMau: ['CREATE INDEX idx_orders_status_created ON orders (status, created_at);'],
        },
        {
          ten: { en: 'P5 · login: lower the input, not the column', vi: 'P5 · đăng nhập: hạ chữ ở đầu vào, không phải ở cột' }, diem: 2,
          moTa: { en: 'A customer typed <code>Kh0042@CtShop.vn</code>. <code>WHERE lower(email) = lower(…)</code> cannot use the UNIQUE index on email. The CHECK already guarantees emails are stored lower-case — write the login query <code>SELECT id, full_name FROM customer WHERE …</code> so it uses <code>customer_email_key</code>, without creating any index.', vi: 'Khách gõ <code>Kh0042@CtShop.vn</code>. <code>WHERE lower(email) = lower(…)</code> không dùng được chỉ mục UNIQUE trên email. CHECK đã bảo đảm email lưu chữ thường — viết truy vấn đăng nhập <code>SELECT id, full_name FROM customer WHERE …</code> sao cho dùng <code>customer_email_key</code>, không tạo chỉ mục nào.' },
          yeuCau: [{ en: '<code>WHERE email = lower(\'Kh0042@CtShop.vn\')</code>.', vi: '<code>WHERE email = lower(\'Kh0042@CtShop.vn\')</code>.' }],
          giai: "SELECT id, full_name FROM customer WHERE email = lower('Kh0042@CtShop.vn');   -- the column stays bare ⇒ customer_email_key",
          kiem: [
            kq(['P5 · customer 42 is found', 'P5 · tìm ra khách 42']),
            ma(['P5 · the column is not wrapped in lower()', 'P5 · cột không bị bọc trong lower()'], 'lower\\s*\\(\\s*email\\s*\\)', true),
            sau(['P5 · that predicate uses customer_email_key', 'P5 · vị từ đó dùng customer_email_key'], "SELECT plan_text('SELECT id FROM customer WHERE email = lower(''Kh0042@CtShop.vn'')') ~ 'customer_email_key' AS uses_unique_index", { an: true }),
          ],
          saiMau: ["SELECT id, full_name FROM customer WHERE lower(email) = lower('Kh0042@CtShop.vn')", "SELECT id, full_name FROM customer WHERE email = 'Kh0042@CtShop.vn'"],
        },
        {
          ten: { en: 'P6 · stale statistics after the flash-sale import', vi: 'P6 · thống kê cũ sau đợt nhập flash sale' }, diem: 2,
          moTa: { en: '3 000 pending orders were just imported. The planner still believes about 300 orders are pending and picks plans for that. Fix the estimate.', vi: 'Vừa nhập 3 000 đơn pending. Planner vẫn tin chỉ khoảng 300 đơn pending và chọn kế hoạch theo đó. Sửa ước lượng.' },
          yeuCau: [{ en: 'One statement that refreshes the statistics of orders.', vi: 'Một lệnh làm mới thống kê của orders.' }],
          giai: 'ANALYZE orders;   -- autovacuum would do it eventually; after a bulk load do it yourself',
          kiem: [
            sau(['P6 · the pending estimate is within 5 % of reality', 'P6 · ước lượng pending lệch không quá 5 %'], "SELECT abs(plan_rows('SELECT * FROM orders WHERE status = ''pending''') - (SELECT count(*) FROM orders WHERE status = 'pending')) <= 0.05 * (SELECT count(*) FROM orders WHERE status = 'pending') AS accurate", { csdl: IMPORT }),
            ma(['P6 · ANALYZE', 'P6 · ANALYZE'], '\\bANALY[SZ]E\\b'),
          ],
          saiMau: ["CREATE INDEX idx_orders_status ON orders (status);"],
        },
      ],
      truDiem: [
        { en: 'Several overlapping indexes "just in case" — every one slows down every INSERT of the flash sale.', vi: 'Nhiều chỉ mục chồng chéo "cho chắc" — cái nào cũng làm chậm mọi INSERT của đợt flash sale.' },
        { en: 'Changing the query when the brief asks for an index, or the reverse.', vi: 'Đổi truy vấn khi đề yêu cầu chỉ mục, hoặc ngược lại.' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q5.sql (P2, P3, P4, P5, P6). <b>Run</b> = sample checks; <b>Submit</b> = every check and the 10-mark table.',
        vi: 'Các tab Q1.sql … Q5.sql (P2, P3, P4, P5, P6). <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm và bảng điểm thang 10.',
      },
      thuatNgu: [TN.index, TN.explain, tn('covering index', 'chỉ mục bao phủ'), tn('partial index', 'chỉ mục từng phần'), tn('CONCURRENTLY', 'tạo chỉ mục không khoá ghi')],
      goiY: [
        { en: 'Read the plan first: Seq Scan + Filter + Sort tells you which columns the index needs and in which order.', vi: 'Đọc kế hoạch trước: Seq Scan + Filter + Sort cho biết chỉ mục cần cột nào và theo thứ tự nào.' },
        { en: 'P3: Index Only Scan needs every column of the query inside the index.', vi: 'P3: Index Only Scan cần mọi cột của truy vấn nằm trong chỉ mục.' },
        { en: 'P6: estimates come from statistics, not from counting.', vi: 'P6: ước lượng đến từ thống kê, không đến từ việc đếm.' },
      ],
      loiHayGap: [
        { en: 'P2 an index on customer_id alone — a Sort remains for every page view.', vi: 'P2 chỉ mục riêng customer_id — mỗi lần xem trang vẫn còn một Sort.' },
        { en: 'P4 a full (status, created_at) index — 50× bigger than the partial one.', vi: 'P4 chỉ mục đầy đủ (status, created_at) — lớn gấp 50 lần chỉ mục từng phần.' },
        { en: 'P5 typing the email exactly as entered — "Kh0042@CtShop.vn" is not found.', vi: 'P5 gõ email đúng như khách nhập — không tìm thấy "Kh0042@CtShop.vn".' },
      ],
      giaiThich: { en: '<p>Same steps as <code>lab5-solution.sql</code> (P2–P6) at 20 000 orders. On a real server create each index with <code>CREATE INDEX CONCURRENTLY</code> outside a transaction, then drop the indexes the new ones made redundant.</p>', vi: '<p>Cùng các bước của <code>lab5-solution.sql</code> (P2–P6) ở quy mô 20 000 đơn. Trên máy chủ thật, tạo từng chỉ mục bằng <code>CREATE INDEX CONCURRENTLY</code> ngoài giao dịch, rồi xoá các chỉ mục cũ đã bị chỉ mục mới thay thế.</p>' },
    }),
  ],
});
