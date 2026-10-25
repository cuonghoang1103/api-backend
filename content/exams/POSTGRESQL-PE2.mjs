/**
 * PostgreSQL — Practical Exam 2 (PE2): 10 câu viết SQL trên CSDL CT Shop, nộp .zip.
 *
 * Đề thứ hai của Phòng thi khoá PostgreSQL, kiểu đề thực hành của trường FPT: một
 * CSDL cho sẵn (CT Shop chuẩn của 9 lab — schema `shop`, 8 bảng, dữ liệu tất định),
 * mười câu, mỗi câu một việc thật, độ khó tăng dần, phủ toàn khoá từ Chương 2 tới
 * Chương 13 (lọc/phân trang → OUTER JOIN → fan-out → NOT EXISTS → JSONB → hàm cửa sổ
 * → CTE đệ quy → DDL + UPSERT → trigger → chỉ mục + EXPLAIN).
 *
 * ⚠️ MỌI `sampleSolution` DƯỚI ĐÂY ĐÃ CHẠY THẬT trên **PostgreSQL 17.11** (Docker
 * `postgres:17`, aarch64, psql 17 TRONG container) với CT Shop nạp từ
 * https://media.cuongthai.com/files/academy/PG/labs/v1/lab3-start.sql (kiểm 26/10/2026:
 * HTTP 200, trùng từng byte với `content/courses/postgresql/lab/sql/lab3-start.sql`).
 * File chạy = `starterCode` với phần "VIẾT LỜI GIẢI" thay bằng `sampleSolution`, chạy
 * bằng `psql -X -q`; `expectedOutput` là NGUYÊN VĂN psql in ra, không phải dự đoán.
 * Toàn bộ SQL + output (kể cả các lời giải SAI dùng làm bẫy) lưu ở
 * ~/Documents/video-bai-giang/src/khung/pg/that/thi-pe2.sql + thi-pe2.out.txt
 * (để agent làm video chữa đề dùng lại).
 *
 * ⚠️ `node scripts/exam-check.mjs` không chạy được SQL: với `language: 'sql'` nó chỉ
 * kiểm CẤU TRÚC (song ngữ, đủ trường, rubric) và in dòng ℹ — đúng như với
 * POSTGRESQL-PE.mjs. Việc kiểm đúng/sai làm bằng psql trên Postgres thật, như trên.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/POSTGRESQL-PE2.mjs --apply
 */
import { B, c, code, codeQ } from './_lib/postgresql-exam-kit.mjs';

/** Rubric riêng từng câu: tổng `maxScore` = `points` của câu (như POSTGRESQL-PE). */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

const START_URL = 'https://media.cuongthai.com/files/academy/PG/labs/v1/lab3-start.sql';

const LOAD_SQL =
  '# 1. A PostgreSQL 17 server with a named volume (skip if your pgdemo from the labs exists)\n' +
  'docker run -d --name pgdemo -e POSTGRES_PASSWORD=123456 \\\n' +
  '  -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:17\n' +
  'docker exec pgdemo createdb -U postgres ctshop        # "already exists" is fine\n' +
  '\n' +
  '# 2. The standard CT Shop — drops and rebuilds schema shop (~2 s)\n' +
  `curl -fLO ${START_URL}\n` +
  'docker cp lab3-start.sql pgdemo:/tmp/\n' +
  'docker exec -i pgdemo psql -U postgres -d ctshop -q -f /tmp/lab3-start.sql\n' +
  '#  categories | products | customers | orders | order_lines | payments\n' +
  '#          12 |       48 |       300 |   2000 |        5000 |     1663     <- must match\n' +
  '\n' +
  '# 3. Run one answer file (psql 17 INSIDE the container, -X -q)\n' +
  'docker exec -i pgdemo psql -U postgres -d ctshop -X -q < Q1.sql\n';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Practical Exam 2 — ten SQL tasks on the CT Shop database.</b> The same shop you built in the labs: schema <code>shop</code>, eight tables (<code>customer</code>, <code>category</code>, <code>product</code>, <code>orders</code>, <code>order_item</code>, <code>payment</code>, <code>stock_movement</code>, <code>review</code>), 300 customers, 2,000 orders. The data is deterministic, so your output must match the expected output exactly.</p>' +
  '<p><b>1 · Load the database.</b> <code>lab3-start.sql</code> (or <code>lab6-start.sql</code>, which builds the identical shop) is the standard shop from the course; it drops and rebuilds schema <code>shop</code>, so whatever a lab left behind is gone:</p>' +
  code(LOAD_SQL) +
  '<p><b>2 · Write ten files</b> <code>Q1.sql … Q10.sql</code>. Start each one from the <b>starter file</b> shown under its question: the lines marked <code>ĐỀ CHO SẴN — KHÔNG SỬA</code> are given (they set <code>search_path = shop</code>, <code>TimeZone = \'Asia/Ho_Chi_Minh\'</code> and <code>VERBOSITY terse</code>, and some open a transaction or run fixed tests); write your answer in the <code>VIẾT LỜI GIẢI</code> part only.</p>' +
  '<p><b>3 · Every file is independent.</b> Q1–Q6 only read. Q7–Q10 change things, so their given lines wrap the file in <code>BEGIN; … ROLLBACK;</code> — PostgreSQL DDL is transactional (Chapters 3 and 11), so even the <code>CREATE TABLE</code>, <code>CREATE TRIGGER</code> and <code>CREATE INDEX</code> you write disappear at the end. You can run any file, in any order, as many times as you like, and the shop stays pristine. Never put <code>COMMIT</code> in your answer.</p>' +
  '<p><b>4 · Check, then submit.</b> Run each file with the command in step 3 and compare with its expected output <b>line for line</b> — column names, row order, decimals, the error messages. Use psql 17 inside the container: an older client draws the same rows with different spacing. Zip the ten files into <b>one .zip</b> and upload it.</p>' +
  '<p><b>How it is graded.</b> The result first: a file that prints the wrong rows cannot score full marks on that question. Then the method — this is a PostgreSQL exam, so <code>= NULL</code>, a filter that collapses an <code>OUTER JOIN</code>, an aggregate inflated by fan-out, <code>NOT IN</code> over a nullable column, a window function filtered at the wrong layer or a hard-coded two-level tree all cost marks <em>even when the output happens to match on this data</em>. Several questions contain a row placed there to catch exactly that shortcut. Suggested pace: 10–12 minutes per question; Q6–Q10 are worth more and take longer.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi thực hành 2 — mười việc SQL trên cơ sở dữ liệu CT Shop.</b> Chính cửa hàng bạn đã dựng trong các lab: schema <code>shop</code>, tám bảng (<code>customer</code>, <code>category</code>, <code>product</code>, <code>orders</code>, <code>order_item</code>, <code>payment</code>, <code>stock_movement</code>, <code>review</code>), 300 khách, 2.000 đơn. Dữ liệu tất định, nên output của bạn phải khớp chính xác output mong đợi.</p>' +
  '<p><b>1 · Nạp cơ sở dữ liệu.</b> <code>lab3-start.sql</code> (hoặc <code>lab6-start.sql</code> — dựng ra đúng cửa hàng đó) là CT Shop chuẩn của khoá; nó xoá rồi dựng lại schema <code>shop</code>, nên mọi thứ lab trước để lại đều mất:</p>' +
  code(LOAD_SQL) +
  '<p><b>2 · Viết mười file</b> <code>Q1.sql … Q10.sql</code>. Bắt đầu mỗi file từ <b>file khởi đầu</b> in dưới câu hỏi: các dòng đánh dấu <code>ĐỀ CHO SẴN — KHÔNG SỬA</code> là đề cho (chúng đặt <code>search_path = shop</code>, <code>TimeZone = \'Asia/Ho_Chi_Minh\'</code> và <code>VERBOSITY terse</code>; vài câu còn mở giao dịch hoặc chạy sẵn các phép thử); bạn chỉ viết vào phần <code>VIẾT LỜI GIẢI</code>.</p>' +
  '<p><b>3 · Mỗi file độc lập.</b> Q1–Q6 chỉ đọc. Q7–Q10 có thay đổi, nên phần đề cho bọc cả file trong <code>BEGIN; … ROLLBACK;</code> — DDL của PostgreSQL nằm trong giao dịch (Chương 3 và 11), nên cả <code>CREATE TABLE</code>, <code>CREATE TRIGGER</code>, <code>CREATE INDEX</code> bạn viết cũng biến mất ở cuối. Chạy file nào, thứ tự nào, bao nhiêu lần cũng được, cửa hàng vẫn nguyên. Tuyệt đối không viết <code>COMMIT</code> trong lời giải.</p>' +
  '<p><b>4 · Kiểm rồi nộp.</b> Chạy từng file bằng lệnh ở bước 3 rồi so với output mong đợi <b>từng dòng</b> — tên cột, thứ tự dòng, số chữ số thập phân, cả câu báo lỗi. Dùng psql 17 trong container: bản client cũ vẽ cùng các dòng đó nhưng giãn cách khác. Nén mười file thành <b>một file .zip</b> rồi tải lên.</p>' +
  '<p><b>Chấm thế nào.</b> Kết quả trước: file in sai dòng thì câu đó không thể đủ điểm. Sau đó tới cách làm — đây là bài thi PostgreSQL, nên <code>= NULL</code>, một điều kiện làm sập <code>OUTER JOIN</code>, một hàm tổng hợp bị fan-out thổi phồng, <code>NOT IN</code> trên cột có NULL, hàm cửa sổ lọc sai tầng hay một cây bị viết cứng hai tầng đều bị trừ điểm <em>kể cả khi output tình cờ khớp trên bộ dữ liệu này</em>. Nhiều câu có một dòng dữ liệu đặt vào đúng để bắt lối đi tắt đó. Nhịp gợi ý: 10–12 phút mỗi câu; Q6–Q10 nhiều điểm hơn và lâu hơn.</p>' +
  '</div>';

/* ── Khung file nộp: hai mốc ĐỀ CHO SẴN / VIẾT LỜI GIẢI giống mọi đề PE ──── */

const COMMON_HEAD =
  '\\set VERBOSITY terse\n' +
  'SET search_path = shop;\n' +
  "SET TimeZone = 'Asia/Ho_Chi_Minh';\n";

const starter = (n, cols, head = '', foot = '') =>
  '-- ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  `-- Q${n}. CT Shop chuẩn đã nạp (lab3-start.sql). Cột kết quả, đúng tên + thứ tự:\n` +
  `--     ${cols}\n` +
  COMMON_HEAD +
  head +
  '\n' +
  '-- ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  "SELECT 'chua cai dat';   -- thay bằng lời giải của bạn\n" +
  '\n' +
  '-- ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  foot +
  `-- Chạy: docker exec -i pgdemo psql -U postgres -d ctshop -X -q < Q${n}.sql\n` +
  '-- rồi so với "kết quả mong đợi" từng dòng một.\n';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_HEAD = '';

const Q1_FOOT = '';

const Q1_SOLUTION =
  'SELECT id, email, full_name, city,\n' +
  '       created_at::date AS joined\n' +
  'FROM customer\n' +
  'WHERE phone IS NULL\n' +
  '  AND city IN (\'Hà Nội\', \'Đà Nẵng\')\n' +
  'ORDER BY created_at DESC, id\n' +
  'LIMIT 7 OFFSET 7;\n';

const Q1_OUTPUT =
  ' id  |      email      |   full_name    |  city   |   joined   \n' +
  '-----+-----------------+----------------+---------+------------\n' +
  ' 259 | kh259@ctshop.vn | Phạm Thị Trang | Đà Nẵng | 2025-08-21\n' +
  ' 126 | kh126@ctshop.vn | Đặng Văn Linh  | Hà Nội  | 2025-08-20\n' +
  ' 266 | kh266@ctshop.vn | Lê Minh Linh   | Hà Nội  | 2025-07-10\n' +
  '  70 | kh070@ctshop.vn | Đặng Thu An    | Đà Nẵng | 2025-06-29\n' +
  '  21 | kh021@ctshop.vn | Vũ Quốc Bình   | Đà Nẵng | 2025-06-10\n' +
  '  49 | kh049@ctshop.vn | Trần Thị Trang | Đà Nẵng | 2025-05-06\n' +
  ' 210 | kh210@ctshop.vn | Lê Văn An      | Hà Nội  | 2025-05-05\n' +
  '(7 rows)';

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_HEAD = '';

const Q2_FOOT = '';

const Q2_SOLUTION =
  'SELECT c.id, c.full_name,\n' +
  '       count(o.id) AS orders,\n' +
  '       count(o.id) FILTER (WHERE o.status IN (\'paid\', \'shipped\')) AS paid_orders,\n' +
  '       count(o.id) FILTER (WHERE o.created_at >= \'2026-01-01\'\n' +
  '                             AND o.created_at <  \'2027-01-01\') AS orders_2026,\n' +
  '       max(o.created_at)::date AS last_order\n' +
  'FROM customer c\n' +
  'LEFT JOIN orders o ON o.customer_id = c.id\n' +
  'WHERE c.id BETWEEN 286 AND 295\n' +
  'GROUP BY c.id, c.full_name\n' +
  'ORDER BY c.id;\n';

const Q2_OUTPUT =
  ' id  |    full_name    | orders | paid_orders | orders_2026 | last_order \n' +
  '-----+-----------------+--------+-------------+-------------+------------\n' +
  ' 286 | Đặng Thu Linh   |      8 |           7 |           4 | 2026-07-09\n' +
  ' 287 | Bùi Gia Nam     |      4 |           4 |           2 | 2026-07-12\n' +
  ' 288 | Nguyễn Văn Phúc |     12 |          10 |           6 | 2026-07-28\n' +
  ' 289 | Trần Thị Trang  |      5 |           4 |           2 | 2026-07-26\n' +
  ' 290 | Lê Minh An      |     10 |           7 |           7 | 2026-08-29\n' +
  ' 291 | Phạm Quốc Bình  |      0 |           0 |           0 | \n' +
  ' 292 | Hoàng Thu Chi   |      0 |           0 |           0 | \n' +
  ' 293 | Vũ Gia Dũng     |      0 |           0 |           0 | \n' +
  ' 294 | Đặng Văn Hà     |      0 |           0 |           0 | \n' +
  ' 295 | Bùi Thị Khoa    |      0 |           0 |           0 | \n' +
  '(10 rows)';

/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_HEAD = '';

const Q3_FOOT = '';

const Q3_SOLUTION =
  'WITH units AS (                       -- one row per order: no fan-out\n' +
  '  SELECT order_id, sum(qty) AS units\n' +
  '  FROM order_item\n' +
  '  GROUP BY order_id\n' +
  ')\n' +
  'SELECT c.city,\n' +
  '       count(DISTINCT o.customer_id) AS buyers,\n' +
  '       count(*)                      AS paid_orders,\n' +
  '       sum(u.units)                  AS units,\n' +
  '       sum(p.amount)                 AS revenue,\n' +
  '       round(100 * sum(p.amount) FILTER (WHERE p.method = \'card\')\n' +
  '                 / sum(p.amount), 1) AS card_pct\n' +
  'FROM payment p\n' +
  'JOIN orders   o ON o.id = p.order_id\n' +
  'JOIN customer c ON c.id = o.customer_id\n' +
  'JOIN units    u ON u.order_id = o.id\n' +
  'WHERE p.paid_at >= \'2026-01-01\' AND p.paid_at < \'2027-01-01\'\n' +
  'GROUP BY c.city\n' +
  'HAVING count(*) >= 135\n' +
  'ORDER BY revenue DESC;\n';

const Q3_OUTPUT =
  '   city    | buyers | paid_orders | units |   revenue    | card_pct \n' +
  '-----------+--------+-------------+-------+--------------+----------\n' +
  ' TP.HCM    |     51 |         151 |   787 | 101630000.00 |     13.7\n' +
  ' Hải Phòng |     60 |         160 |   785 |  85560000.00 |     21.1\n' +
  ' Đà Nẵng   |     56 |         138 |   671 |  70320000.00 |     19.1\n' +
  '(3 rows)';

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_HEAD = '';

const Q4_FOOT = '';

const Q4_SOLUTION =
  '-- 4a\n' +
  'SELECT o.status,\n' +
  '       count(*) AS orders,\n' +
  '       count(*) FILTER (WHERE EXISTS (\n' +
  '         SELECT 1 FROM stock_movement m WHERE m.order_id = o.id)) AS logged,\n' +
  '       count(*) FILTER (WHERE NOT EXISTS (\n' +
  '         SELECT 1 FROM stock_movement m WHERE m.order_id = o.id)) AS missing\n' +
  'FROM orders o\n' +
  'WHERE o.status <> \'cancelled\'\n' +
  'GROUP BY o.status\n' +
  'ORDER BY o.status;\n' +
  '\n' +
  '-- 4b\n' +
  'SELECT p.sku, p.name\n' +
  'FROM product p\n' +
  'WHERE NOT EXISTS (\n' +
  '  SELECT 1\n' +
  '  FROM order_item oi\n' +
  '  JOIN orders o ON o.id = oi.order_id\n' +
  '  WHERE oi.product_id = p.id\n' +
  '    AND o.status <> \'cancelled\'\n' +
  '    AND o.created_at >= \'2026-09-01\' AND o.created_at < \'2026-10-01\'\n' +
  ')\n' +
  'ORDER BY p.sku;\n' +
  '\n' +
  '-- Why NOT IN (SELECT order_id FROM stock_movement) returns 0 rows:\n' +
  '-- the 48 \'import\' movements have order_id NULL, so "x NOT IN (..., NULL)"\n' +
  '-- is never TRUE — it is NULL — and WHERE keeps only TRUE.\n';

const Q4_OUTPUT =
  ' status  | orders | logged | missing \n' +
  '---------+--------+--------+---------\n' +
  ' paid    |    753 |     66 |     687\n' +
  ' pending |    180 |     10 |     170\n' +
  ' shipped |    910 |    113 |     797\n' +
  '(3 rows)\n' +
  '\n' +
  '  sku   |              name              \n' +
  '--------+--------------------------------\n' +
  ' CT1103 | Bộ thước ê-ke đo độ Thiên Long\n' +
  '(1 row)';

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_HEAD = '';

const Q5_FOOT = '';

const Q5_SOLUTION =
  '-- 5a\n' +
  'SELECT sku, name, price\n' +
  'FROM product\n' +
  'WHERE is_active\n' +
  '  AND attrs @> \'{"tags": ["học sinh"], "color": "đen"}\'\n' +
  'ORDER BY price DESC, sku;\n' +
  '\n' +
  '-- 5b\n' +
  'SELECT t.tag,\n' +
  '       count(*)                          AS products,\n' +
  '       count(DISTINCT p.attrs->>\'brand\') AS brands,\n' +
  '       round(avg(p.price))               AS avg_price\n' +
  'FROM product p\n' +
  'CROSS JOIN LATERAL jsonb_array_elements_text(p.attrs->\'tags\') AS t(tag)\n' +
  'WHERE p.is_active\n' +
  'GROUP BY t.tag\n' +
  'ORDER BY products DESC, t.tag;\n';

const Q5_OUTPUT =
  '  sku   |               name                |   price   \n' +
  '--------+-----------------------------------+-----------\n' +
  ' CT1004 | Máy tính Casio FX-880BTG          | 790000.00\n' +
  ' CT1005 | Máy tính Casio MX-12B (văn phòng) | 195000.00\n' +
  ' CT0606 | Bút chì màu Faber-Castell 24 màu  | 125000.00\n' +
  ' CT0902 | Sổ tay Klong A5 bìa da            |  65000.00\n' +
  ' CT0803 | Vở kẻ ngang Campus 80 trang       |  13000.00\n' +
  '(5 rows)\n' +
  '\n' +
  '    tag    | products | brands | avg_price \n' +
  '-----------+----------+--------+-----------\n' +
  ' văn phòng |       17 |     12 |     97412\n' +
  ' sinh viên |       16 |      8 |     86313\n' +
  ' học sinh  |       15 |     11 |    154733\n' +
  '(3 rows)';

/* ─────────────────────────── Câu 6 ─────────────────────────── */

const Q6_HEAD = '';

const Q6_FOOT = '';

const Q6_SOLUTION =
  '-- 6a\n' +
  'WITH sold AS (\n' +
  '  SELECT p.category_id, p.sku, p.name, sum(oi.qty) AS units\n' +
  '  FROM payment pm\n' +
  '  JOIN order_item oi ON oi.order_id = pm.order_id\n' +
  '  JOIN product p     ON p.id = oi.product_id\n' +
  '  WHERE pm.paid_at >= \'2026-01-01\' AND pm.paid_at < \'2027-01-01\'\n' +
  '  GROUP BY p.category_id, p.sku, p.name\n' +
  '), ranked AS (\n' +
  '  SELECT s.*, rank() OVER (PARTITION BY s.category_id ORDER BY s.units DESC) AS rk\n' +
  '  FROM sold s\n' +
  ')\n' +
  'SELECT c.name AS category, r.sku, r.name AS product, r.units, r.rk\n' +
  'FROM ranked r\n' +
  'JOIN category c    ON c.id = r.category_id\n' +
  'JOIN category root ON root.id = c.parent_id\n' +
  'WHERE root.name = \'Vở & giấy\'\n' +
  '  AND r.rk <= 3\n' +
  'ORDER BY category, r.rk, r.sku;\n' +
  '\n' +
  '-- 6b\n' +
  'WITH monthly AS (\n' +
  '  SELECT date_trunc(\'month\', paid_at) AS m, sum(amount) AS revenue\n' +
  '  FROM payment\n' +
  '  WHERE paid_at >= \'2026-01-01\' AND paid_at < \'2026-10-01\'\n' +
  '  GROUP BY 1\n' +
  ')\n' +
  'SELECT to_char(m, \'YYYY-MM\') AS month,\n' +
  '       revenue,\n' +
  '       lag(revenue) OVER w AS prev_revenue,\n' +
  '       round(100 * (revenue - lag(revenue) OVER w) / lag(revenue) OVER w, 1) AS change_pct,\n' +
  '       sum(revenue) OVER (w ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total\n' +
  'FROM monthly\n' +
  'WINDOW w AS (ORDER BY m)\n' +
  'ORDER BY m;\n';

const Q6_OUTPUT =
  ' category |  sku   |           product            | units | rk \n' +
  '----------+--------+------------------------------+-------+----\n' +
  ' Sổ tay   | CT0901 | Sổ lò xo Campus A5           |    85 |  1\n' +
  ' Sổ tay   | CT0903 | Sổ chấm bullet journal A5    |    79 |  2\n' +
  ' Sổ tay   | CT0904 | Sổ tay Deli B5 kẻ ngang      |    69 |  3\n' +
  ' Sổ tay   | CT0906 | Sổ tay Moleskine Classic A5  |    69 |  3\n' +
  ' Vở ô ly  | CT0803 | Vở kẻ ngang Campus 80 trang  |   102 |  1\n' +
  ' Vở ô ly  | CT0804 | Vở kẻ ngang Campus 200 trang |    64 |  2\n' +
  ' Vở ô ly  | CT0805 | Lốc 10 vở Hồng Hà 96 trang   |    64 |  2\n' +
  '(7 rows)\n' +
  '\n' +
  '  month  |   revenue   | prev_revenue | change_pct | running_total \n' +
  '---------+-------------+--------------+------------+---------------\n' +
  ' 2026-01 | 48698000.00 |              |            |   48698000.00\n' +
  ' 2026-02 | 31046000.00 |  48698000.00 |      -36.2 |   79744000.00\n' +
  ' 2026-03 | 63914000.00 |  31046000.00 |      105.9 |  143658000.00\n' +
  ' 2026-04 | 37252000.00 |  63914000.00 |      -41.7 |  180910000.00\n' +
  ' 2026-05 | 49290000.00 |  37252000.00 |       32.3 |  230200000.00\n' +
  ' 2026-06 | 40587000.00 |  49290000.00 |      -17.7 |  270787000.00\n' +
  ' 2026-07 | 60560000.00 |  40587000.00 |       49.2 |  331347000.00\n' +
  ' 2026-08 | 37315000.00 |  60560000.00 |      -38.4 |  368662000.00\n' +
  ' 2026-09 | 42485000.00 |  37315000.00 |       13.9 |  411147000.00\n' +
  '(9 rows)';

/* ─────────────────────────── Câu 7 ─────────────────────────── */

const Q7_HEAD =
  'BEGIN;\n' +
  '-- A third level, added for this question only (rolled back at the end):\n' +
  'INSERT INTO category (name, parent_id)\n' +
  'SELECT \'Máy tính khoa học\', id FROM category WHERE name = \'Máy tính cầm tay\';\n' +
  'INSERT INTO category (name, parent_id)\n' +
  'SELECT \'Casio fx\', id FROM category WHERE name = \'Máy tính khoa học\';\n' +
  'UPDATE product SET category_id = (SELECT id FROM category WHERE name = \'Casio fx\')\n' +
  'WHERE sku IN (\'CT1001\', \'CT1002\', \'CT1004\');\n' +
  'UPDATE product SET category_id = (SELECT id FROM category WHERE name = \'Máy tính khoa học\')\n' +
  'WHERE sku = \'CT1003\';\n';

const Q7_FOOT =
  'ROLLBACK;\n';

const Q7_SOLUTION =
  'WITH RECURSIVE tree AS (\n' +
  '  SELECT id, name, 1 AS depth,\n' +
  '         name::text AS path,\n' +
  '         ARRAY[id]  AS lineage            -- this node and all its ancestors\n' +
  '  FROM category\n' +
  '  WHERE parent_id IS NULL\n' +
  '  UNION ALL\n' +
  '  SELECT c.id, c.name, t.depth + 1,\n' +
  '         t.path || \' > \' || c.name,\n' +
  '         t.lineage || c.id\n' +
  '  FROM category c\n' +
  '  JOIN tree t ON c.parent_id = t.id\n' +
  '  WHERE t.depth < 10                      -- guard: a bad import cannot loop for ever\n' +
  ')\n' +
  'SELECT t.depth, t.path,\n' +
  '       (SELECT count(*) FROM product p WHERE p.category_id = t.id) AS direct,\n' +
  '       (SELECT count(*)\n' +
  '          FROM product p\n' +
  '          JOIN tree d ON d.id = p.category_id\n' +
  '         WHERE t.id = ANY (d.lineage))                       AS in_subtree\n' +
  'FROM tree t\n' +
  'ORDER BY t.path;\n';

const Q7_OUTPUT =
  ' depth |                               path                                | direct | in_subtree \n' +
  '-------+-------------------------------------------------------------------+--------+------------\n' +
  '     1 | Bút & mực                                                         |      0 |         18\n' +
  '     2 | Bút & mực > Bút bi                                                |      6 |          6\n' +
  '     2 | Bút & mực > Bút chì & tẩy                                         |      6 |          6\n' +
  '     2 | Bút & mực > Bút dạ quang                                          |      6 |          6\n' +
  '     1 | Dụng cụ học tập                                                   |      0 |         12\n' +
  '     2 | Dụng cụ học tập > Máy tính cầm tay                                |      2 |          6\n' +
  '     3 | Dụng cụ học tập > Máy tính cầm tay > Máy tính khoa học            |      1 |          4\n' +
  '     4 | Dụng cụ học tập > Máy tính cầm tay > Máy tính khoa học > Casio fx |      3 |          3\n' +
  '     2 | Dụng cụ học tập > Thước & compa                                   |      6 |          6\n' +
  '     1 | Sách & tài liệu                                                   |      0 |          6\n' +
  '     2 | Sách & tài liệu > Giáo trình IT                                   |      6 |          6\n' +
  '     1 | Vở & giấy                                                         |      0 |         12\n' +
  '     2 | Vở & giấy > Sổ tay                                                |      6 |          6\n' +
  '     2 | Vở & giấy > Vở ô ly                                               |      6 |          6\n' +
  '(14 rows)';

/* ─────────────────────────── Câu 8 ─────────────────────────── */

const Q8_HEAD =
  'BEGIN;\n';

const Q8_FOOT =
  'SELECT conname, contype, pg_get_constraintdef(oid) AS definition\n' +
  'FROM pg_constraint\n' +
  'WHERE conrelid = \'cart_item\'::regclass\n' +
  'ORDER BY conname;\n' +
  'SELECT indexdef FROM pg_indexes WHERE tablename = \'cart_item\' ORDER BY indexname;\n' +
  'SELECT customer_id, product_id, qty, updated_at IS NOT NULL AS was_updated\n' +
  'FROM cart_item ORDER BY product_id;\n' +
  'SAVEPOINT bad_customer;\n' +
  'INSERT INTO cart_item (customer_id, product_id) VALUES (999, 34);\n' +
  'ROLLBACK TO SAVEPOINT bad_customer;\n' +
  'ROLLBACK;\n';

const Q8_SOLUTION =
  'CREATE TABLE cart_item (\n' +
  '  customer_id bigint      NOT NULL REFERENCES customer(id) ON DELETE CASCADE,\n' +
  '  product_id  bigint      NOT NULL REFERENCES product(id),\n' +
  '  qty         int         NOT NULL DEFAULT 1\n' +
  '              CONSTRAINT cart_item_qty_check CHECK (qty BETWEEN 1 AND 20),\n' +
  '  added_at    timestamptz NOT NULL DEFAULT now(),\n' +
  '  updated_at  timestamptz,\n' +
  '  PRIMARY KEY (customer_id, product_id)\n' +
  ');\n' +
  'CREATE INDEX cart_item_product_id_idx ON cart_item (product_id);\n' +
  '\n' +
  '-- the "add to cart" statement, run four times as the question lists\n' +
  'INSERT INTO cart_item (customer_id, product_id, qty) VALUES (7, 34, 1)\n' +
  'ON CONFLICT (customer_id, product_id)\n' +
  'DO UPDATE SET qty = cart_item.qty + EXCLUDED.qty, updated_at = now()\n' +
  'RETURNING product_id, qty, (xmax = 0) AS inserted;\n' +
  '\n' +
  'INSERT INTO cart_item (customer_id, product_id, qty) VALUES (7, 34, 2)\n' +
  'ON CONFLICT (customer_id, product_id)\n' +
  'DO UPDATE SET qty = cart_item.qty + EXCLUDED.qty, updated_at = now()\n' +
  'RETURNING product_id, qty, (xmax = 0) AS inserted;\n' +
  '\n' +
  'INSERT INTO cart_item (customer_id, product_id, qty) VALUES (7, 12, 2)\n' +
  'ON CONFLICT (customer_id, product_id)\n' +
  'DO UPDATE SET qty = cart_item.qty + EXCLUDED.qty, updated_at = now()\n' +
  'RETURNING product_id, qty, (xmax = 0) AS inserted;\n' +
  '\n' +
  'SAVEPOINT too_many;\n' +
  'INSERT INTO cart_item (customer_id, product_id, qty) VALUES (7, 34, 18)\n' +
  'ON CONFLICT (customer_id, product_id)\n' +
  'DO UPDATE SET qty = cart_item.qty + EXCLUDED.qty, updated_at = now()\n' +
  'RETURNING product_id, qty, (xmax = 0) AS inserted;\n' +
  'ROLLBACK TO SAVEPOINT too_many;\n';

const Q8_OUTPUT =
  ' product_id | qty | inserted \n' +
  '------------+-----+----------\n' +
  '         34 |   1 | t\n' +
  '(1 row)\n' +
  '\n' +
  ' product_id | qty | inserted \n' +
  '------------+-----+----------\n' +
  '         34 |   3 | f\n' +
  '(1 row)\n' +
  '\n' +
  ' product_id | qty | inserted \n' +
  '------------+-----+----------\n' +
  '         12 |   2 | t\n' +
  '(1 row)\n' +
  '\n' +
  'ERROR:  new row for relation "cart_item" violates check constraint "cart_item_qty_check"\n' +
  '          conname           | contype |                             definition                              \n' +
  '----------------------------+---------+---------------------------------------------------------------------\n' +
  ' cart_item_customer_id_fkey | f       | FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE\n' +
  ' cart_item_pkey             | p       | PRIMARY KEY (customer_id, product_id)\n' +
  ' cart_item_product_id_fkey  | f       | FOREIGN KEY (product_id) REFERENCES product(id)\n' +
  ' cart_item_qty_check        | c       | CHECK (((qty >= 1) AND (qty <= 20)))\n' +
  '(4 rows)\n' +
  '\n' +
  '                                          indexdef                                          \n' +
  '--------------------------------------------------------------------------------------------\n' +
  ' CREATE UNIQUE INDEX cart_item_pkey ON shop.cart_item USING btree (customer_id, product_id)\n' +
  ' CREATE INDEX cart_item_product_id_idx ON shop.cart_item USING btree (product_id)\n' +
  '(2 rows)\n' +
  '\n' +
  ' customer_id | product_id | qty | was_updated \n' +
  '-------------+------------+-----+-------------\n' +
  '           7 |         12 |   2 | f\n' +
  '           7 |         34 |   3 | t\n' +
  '(2 rows)\n' +
  '\n' +
  'ERROR:  insert or update on table "cart_item" violates foreign key constraint "cart_item_customer_id_fkey"';

/* ─────────────────────────── Câu 9 ─────────────────────────── */

const Q9_HEAD =
  'BEGIN;\n';

const Q9_FOOT =
  'INSERT INTO review (product_id, customer_id, rating, body) VALUES (33, 7, 5, \'  Máy chạy tốt  \');\n' +
  'INSERT INTO review (product_id, customer_id, rating, body) VALUES (41, 7, 3, \'   \');\n' +
  'SAVEPOINT t;\n' +
  'INSERT INTO review (product_id, customer_id, rating, body) VALUES (22, 7, 4, \'Vở đẹp\');\n' +
  'ROLLBACK TO SAVEPOINT t;\n' +
  'INSERT INTO review (product_id, customer_id, rating, body) VALUES (1, 7, 4, \'Lần hai\');\n' +
  'ROLLBACK TO SAVEPOINT t;\n' +
  'UPDATE review SET product_id = 22 WHERE customer_id = 7 AND product_id = 33;\n' +
  'ROLLBACK TO SAVEPOINT t;\n' +
  'SELECT product_id, rating, body, body IS NULL AS no_body\n' +
  'FROM review WHERE customer_id = 7 ORDER BY product_id;\n' +
  'ROLLBACK;\n';

const Q9_SOLUTION =
  'CREATE FUNCTION review_guard() RETURNS trigger\n' +
  'LANGUAGE plpgsql AS $$\n' +
  'BEGIN\n' +
  '  NEW.body := nullif(btrim(NEW.body), \'\');\n' +
  '  IF NOT EXISTS (\n' +
  '       SELECT 1\n' +
  '       FROM orders o\n' +
  '       JOIN order_item oi ON oi.order_id = o.id\n' +
  '       WHERE o.customer_id = NEW.customer_id\n' +
  '         AND oi.product_id = NEW.product_id\n' +
  '         AND o.status = \'shipped\') THEN\n' +
  '    RAISE EXCEPTION \'customer % has not received product %\',\n' +
  '                    NEW.customer_id, NEW.product_id\n' +
  '          USING ERRCODE = \'check_violation\';\n' +
  '  END IF;\n' +
  '  RETURN NEW;\n' +
  'END;\n' +
  '$$;\n' +
  '\n' +
  'CREATE TRIGGER review_guard\n' +
  'BEFORE INSERT OR UPDATE OF product_id, customer_id, body ON review\n' +
  'FOR EACH ROW EXECUTE FUNCTION review_guard();\n';

const Q9_OUTPUT =
  'ERROR:  customer 7 has not received product 22\n' +
  'ERROR:  duplicate key value violates unique constraint "review_product_id_customer_id_key"\n' +
  'ERROR:  customer 7 has not received product 22\n' +
  ' product_id | rating |     body     | no_body \n' +
  '------------+--------+--------------+---------\n' +
  '          1 |      5 | Đúng mô tả   | f\n' +
  '         13 |      5 | Đúng mô tả   | f\n' +
  '         33 |      5 | Máy chạy tốt | f\n' +
  '         41 |      3 |              | t\n' +
  '(4 rows)';

/* ─────────────────────────── Câu 10 ─────────────────────────── */

const Q10_HEAD =
  'BEGIN;\n';

const Q10_FOOT =
  'ROLLBACK;\n';

const Q10_SOLUTION =
  '-- before\n' +
  'EXPLAIN (COSTS OFF)\n' +
  'SELECT count(*) AS lines, sum(qty) AS units FROM order_item WHERE product_id = 34;\n' +
  '\n' +
  'CREATE INDEX order_item_product_id_idx ON order_item (product_id);\n' +
  '\n' +
  '-- after: same statement, measured\n' +
  'EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF)\n' +
  'SELECT count(*) AS lines, sum(qty) AS units FROM order_item WHERE product_id = 34;\n' +
  '\n' +
  'SELECT count(*) AS lines, sum(qty) AS units FROM order_item WHERE product_id = 34;\n' +
  '\n' +
  '-- Why the primary key (order_id, product_id) could not serve this:\n' +
  '-- a B-tree is sorted by its LEADING column first; product_id = 34 is spread\n' +
  '-- across the whole index, so there is no contiguous range to descend into.\n';

const Q10_OUTPUT =
  '            QUERY PLAN             \n' +
  '-----------------------------------\n' +
  ' Aggregate\n' +
  '   ->  Seq Scan on order_item\n' +
  '         Filter: (product_id = 34)\n' +
  '(3 rows)\n' +
  '\n' +
  '                                     QUERY PLAN                                      \n' +
  '-------------------------------------------------------------------------------------\n' +
  ' Aggregate (actual rows=1 loops=1)\n' +
  '   ->  Bitmap Heap Scan on order_item (actual rows=99 loops=1)\n' +
  '         Recheck Cond: (product_id = 34)\n' +
  '         Heap Blocks: exact=36\n' +
  '         ->  Bitmap Index Scan on order_item_product_id_idx (actual rows=99 loops=1)\n' +
  '               Index Cond: (product_id = 34)\n' +
  '(6 rows)\n' +
  '\n' +
  ' lines | units \n' +
  '-------+-------\n' +
  '    99 |   191\n' +
  '(1 row)';

export default {
  course: { slug: 'postgresql' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE2',
      source: 'SAMPLE',
      sortOrder: 11,
      title: B(
        'Practical Exam 2 — ten SQL tasks on CT Shop',
        'Thi thực hành 2 — mười việc SQL trên CT Shop',
      ),
      description: B(
        'Ten SQL questions on the CT Shop database from the labs, submitted as a .zip, in rising difficulty: filtering and stable pagination, keeping rows through an OUTER JOIN, grouping without fan-out, NOT EXISTS against a nullable column, JSONB containment, ranking with ties plus LAG and a running total, a recursive category tree of any depth, DDL with named constraints plus UPSERT and RETURNING, a validating trigger, and an index proven with EXPLAIN — chapters 2 to 13.',
        'Mười câu viết SQL trên cơ sở dữ liệu CT Shop của các lab, nộp .zip, khó dần: lọc và phân trang ổn định, giữ dòng qua OUTER JOIN, gom nhóm không bị fan-out, NOT EXISTS trên cột có NULL, JSONB và phép chứa, xếp hạng có hoà cùng LAG và tổng luỹ tiến, cây danh mục đệ quy mọi độ sâu, DDL có ràng buộc đặt tên cùng UPSERT và RETURNING, trigger kiểm dữ liệu, và chỉ mục được chứng minh bằng EXPLAIN — chương 2 tới 13.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · chương 2.3 + 4.2 + 4.3 ─────────────────────────────── */
        codeQ({
          points: 0.5,
          language: 'sql',
          prompt: B(
            '<p><b>Q1 — A stable page of a filtered list (chapter 4).</b> Customer care is e-mailing customers in <b>Hà Nội or Đà Nẵng</b> who left <b>no phone number</b>. The list is shown 7 per page, newest sign-up first; return <b>page 2</b>. Columns: <code>id</code>, <code>email</code>, <code>full_name</code>, <code>city</code>, <code>joined</code> (the sign-up date, Vietnam time). Order: newest <code>created_at</code> first, ties broken by <code>id</code> ascending.</p>' +
            '<ul>' +
            '<li>"No phone" is a <code>NULL</code>. ' + c('phone = NULL') + ' is never true — it returns 0 rows, silently.</li>' +
            '<li>' + c("city = 'Hà Nội' OR city = 'Đà Nẵng' AND phone IS NULL") + ' is not what it looks like: <code>AND</code> binds tighter than <code>OR</code>, so every Hà Nội customer slips in (64 rows instead of 19). Use <code>IN</code> or parentheses.</li>' +
            '<li>Customers 210 and 245 signed up at the <b>same instant</b>, and they sit on the boundary between page 2 and page 3. Without a unique tiebreaker the database may return them in either order, so one customer can appear on both pages and the other on neither. That is why the order specification ends with <code>id</code>.</li>' +
            '</ul>',

            '<p><b>Câu 1 — Một trang ổn định của danh sách đã lọc (chương 4).</b> Bộ phận chăm sóc khách hàng gửi e-mail cho khách ở <b>Hà Nội hoặc Đà Nẵng</b> mà <b>không để lại số điện thoại</b>. Danh sách hiện 7 người mỗi trang, người đăng ký mới nhất trước; hãy trả về <b>trang 2</b>. Các cột: <code>id</code>, <code>email</code>, <code>full_name</code>, <code>city</code>, <code>joined</code> (ngày đăng ký theo giờ Việt Nam). Thứ tự: <code>created_at</code> mới nhất trước, hoà thì <code>id</code> tăng dần.</p>' +
            '<ul>' +
            '<li>"Không có số điện thoại" là <code>NULL</code>. ' + c('phone = NULL') + ' không bao giờ đúng — nó trả 0 dòng, lặng lẽ.</li>' +
            '<li>' + c("city = 'Hà Nội' OR city = 'Đà Nẵng' AND phone IS NULL") + ' không như vẻ ngoài: <code>AND</code> buộc chặt hơn <code>OR</code>, nên mọi khách Hà Nội đều lọt vào (64 dòng thay vì 19). Dùng <code>IN</code> hoặc dấu ngoặc.</li>' +
            '<li>Khách 210 và 245 đăng ký <b>cùng một thời điểm</b>, và họ nằm đúng ranh giới trang 2 / trang 3. Không có cột phá hoà duy nhất thì cơ sở dữ liệu được phép trả họ theo thứ tự nào cũng được, nên một người có thể hiện ở cả hai trang còn người kia biến mất. Vì vậy quy định thứ tự kết thúc bằng <code>id</code>.</li>' +
            '</ul>',
          ),
          starterCode: starter(1, 'id, email, full_name, city, joined', Q1_HEAD, Q1_FOOT),
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['null',
              'Tests the missing phone with <code>phone IS NULL</code> and groups the two cities with <code>IN</code> or parentheses, so exactly 19 customers qualify before paging.',
              'Kiểm số điện thoại vắng bằng <code>phone IS NULL</code> và gom hai thành phố bằng <code>IN</code> hoặc dấu ngoặc, để đúng 19 khách đạt điều kiện trước khi phân trang.',
              0.2],
            ['page',
              'Page 2 of 7 is <code>LIMIT 7 OFFSET 7</code> (or <code>OFFSET 7 ROWS FETCH FIRST 7 ROWS ONLY</code>) over an order that ends in a unique column, so 210 is on page 2 and 245 on page 3 on every run.',
              'Trang 2, mỗi trang 7 là <code>LIMIT 7 OFFSET 7</code> (hoặc <code>OFFSET 7 ROWS FETCH FIRST 7 ROWS ONLY</code>) trên một thứ tự kết thúc bằng cột duy nhất, để 210 luôn ở trang 2 còn 245 ở trang 3 ở mọi lần chạy.',
              0.2],
            ['columns',
              'Exactly the five columns in order, <code>joined</code> as a date (the given header already fixes the session to Vietnam time), seven rows matching.',
              'Đúng năm cột theo thứ tự, <code>joined</code> là kiểu ngày (phần đề cho đã đặt phiên về giờ Việt Nam), bảy dòng khớp.',
              0.1],
          ]),
        }),

        /* ── Q2 · chương 5.2 + 6.3 + 2.3 ─────────────────────────────── */
        codeQ({
          points: 0.75,
          language: 'sql',
          prompt: B(
            '<p><b>Q2 — Keep the customers who never bought (chapters 5, 6 and 2).</b> For customers <b>286 to 295</b>, one row each: <code>id</code>, <code>full_name</code>, <code>orders</code> (all their orders, any status), <code>paid_orders</code> (status <code>paid</code> or <code>shipped</code>), <code>orders_2026</code> (orders placed in calendar year 2026, Vietnam time) and <code>last_order</code> (the date of their latest order, empty if none). Order by <code>id</code>.</p>' +
            '<ul>' +
            '<li><b>Customers 291–295 have never ordered</b> and must still appear with <code>0 | 0 | 0</code> and an empty <code>last_order</code>. A plain <code>JOIN</code> drops them; <code>count(*)</code> counts the NULL-padded row and gives them <code>1</code>.</li>' +
            '<li>Do the three counts in <b>one pass</b> with ' + c('count(...) FILTER (WHERE ...)') + '. Putting the 2026 condition in <code>WHERE</code> collapses the LEFT JOIN: the five non-buyers vanish and <code>orders</code> turns into the 2026 count.</li>' +
            '<li>Customer 288 placed order 1761 at 03:31 on 1 January 2026 in Vietnam — still 31 December in UTC. With the given <code>SET TimeZone</code> a half-open range ' + c(">= '2026-01-01' AND < '2027-01-01'") + ' counts it in 2026 (6 orders); a UTC session would say 5.</li>' +
            '</ul>',

            '<p><b>Câu 2 — Giữ lại cả khách chưa từng mua (chương 5, 6 và 2).</b> Với các khách <b>286 tới 295</b>, mỗi người một dòng: <code>id</code>, <code>full_name</code>, <code>orders</code> (mọi đơn, mọi trạng thái), <code>paid_orders</code> (trạng thái <code>paid</code> hoặc <code>shipped</code>), <code>orders_2026</code> (số đơn đặt trong năm 2026 theo giờ Việt Nam) và <code>last_order</code> (ngày của đơn gần nhất, để trống nếu chưa có). Sắp theo <code>id</code>.</p>' +
            '<ul>' +
            '<li><b>Khách 291–295 chưa từng đặt đơn</b> nhưng vẫn phải xuất hiện với <code>0 | 0 | 0</code> và <code>last_order</code> trống. <code>JOIN</code> trần làm mất họ; <code>count(*)</code> đếm cả dòng đệm NULL và cho họ <code>1</code>.</li>' +
            '<li>Tính ba con số trong <b>một lượt</b> bằng ' + c('count(...) FILTER (WHERE ...)') + '. Đặt điều kiện năm 2026 vào <code>WHERE</code> sẽ làm sập LEFT JOIN: năm khách chưa mua biến mất và cột <code>orders</code> biến thành số đơn 2026.</li>' +
            '<li>Khách 288 đặt đơn 1761 lúc 03:31 ngày 1/1/2026 giờ Việt Nam — vẫn là 31/12 theo UTC. Với <code>SET TimeZone</code> của phần đề cho, khoảng nửa mở ' + c(">= '2026-01-01' AND < '2027-01-01'") + ' tính nó vào 2026 (6 đơn); phiên UTC sẽ ra 5.</li>' +
            '</ul>',
          ),
          starterCode: starter(2, 'id, full_name, orders, paid_orders, orders_2026, last_order', Q2_HEAD, Q2_FOOT),
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['outer',
              '<code>customer LEFT JOIN orders</code> with only the customer range in <code>WHERE</code>; customers 291–295 survive.',
              '<code>customer LEFT JOIN orders</code> và trong <code>WHERE</code> chỉ có khoảng id khách; khách 291–295 còn nguyên.',
              0.25],
            ['counts',
              'Counts a child column (<code>count(o.id)</code>) and computes <code>paid_orders</code> and <code>orders_2026</code> with <code>FILTER</code> (or <code>count(CASE …)</code>) in the same pass; non-buyers show 0, not 1.',
              'Đếm một cột của bảng con (<code>count(o.id)</code>) và tính <code>paid_orders</code>, <code>orders_2026</code> bằng <code>FILTER</code> (hoặc <code>count(CASE …)</code>) trong cùng một lượt; khách chưa mua hiện 0 chứ không phải 1.',
              0.3],
            ['time',
              'Year 2026 is a half-open range on <code>created_at</code> evaluated in Vietnam time (288 shows 6), and <code>last_order</code> is <code>max(created_at)::date</code>, empty for non-buyers.',
              'Năm 2026 là khoảng nửa mở trên <code>created_at</code> tính theo giờ Việt Nam (288 ra 6), và <code>last_order</code> là <code>max(created_at)::date</code>, trống với khách chưa mua.',
              0.2],
          ]),
        }),

        /* ── Q3 · chương 6.2–6.4 + 7.3 ───────────────────────────────── */
        codeQ({
          points: 1,
          language: 'sql',
          prompt: B(
            '<p><b>Q3 — Revenue by city without fan-out (chapters 6 and 7).</b> Money counts on <code>payment.paid_at</code>. For payments made in <b>2026</b> (Vietnam time), report per customer city: <code>city</code>, <code>buyers</code> (distinct paying customers), <code>paid_orders</code> (number of payments), <code>units</code> (total quantity in those orders), <code>revenue</code> (sum of <code>payment.amount</code>) and <code>card_pct</code> — the share of revenue paid by <code>card</code>, as a percentage rounded to 1 decimal. Keep only cities with <b>at least 135 paid orders</b>; order by <code>revenue</code> descending.</p>' +
            '<ul>' +
            '<li><code>units</code> lives in <code>order_item</code>, which has 1–4 rows per order. Join <code>payment</code> straight to <code>order_item</code> and every payment amount is added once <b>per line</b>: TP.HCM\'s revenue jumps from 101,630,000 to 317,826,000, the payment count to 394, and all five cities pass the 135 filter. <b>Aggregate the many side first</b> (lesson 6.4 / 7.3), then join one row per order.</li>' +
            '<li>Filtering the group count is a <code>HAVING</code> job — <code>WHERE</code> runs before groups exist. Cần Thơ (133) and Hà Nội (132) must be cut.</li>' +
            '<li>' + c("sum(amount) FILTER (WHERE method = 'card')") + ' computes the card part in the same pass.</li>' +
            '</ul>',

            '<p><b>Câu 3 — Doanh thu theo thành phố mà không bị fan-out (chương 6 và 7).</b> Tiền tính theo <code>payment.paid_at</code>. Với các lần thanh toán trong <b>năm 2026</b> (giờ Việt Nam), hãy báo theo thành phố của khách: <code>city</code>, <code>buyers</code> (số khách khác nhau đã trả tiền), <code>paid_orders</code> (số lần thanh toán), <code>units</code> (tổng số lượng hàng trong các đơn đó), <code>revenue</code> (tổng <code>payment.amount</code>) và <code>card_pct</code> — phần trăm doanh thu trả bằng <code>card</code>, làm tròn 1 chữ số thập phân. Chỉ giữ thành phố có <b>ít nhất 135 đơn đã thanh toán</b>; sắp theo <code>revenue</code> giảm dần.</p>' +
            '<ul>' +
            '<li><code>units</code> nằm trong <code>order_item</code>, mỗi đơn 1–4 dòng. Join thẳng <code>payment</code> với <code>order_item</code> thì mỗi khoản tiền bị cộng một lần <b>cho mỗi dòng hàng</b>: doanh thu TP.HCM nhảy từ 101.630.000 lên 317.826.000, số thanh toán lên 394, và cả năm thành phố đều qua ngưỡng 135. <b>Tổng hợp phía "nhiều" trước</b> (bài 6.4 / 7.3), rồi mới join một dòng mỗi đơn.</li>' +
            '<li>Lọc theo số đếm của nhóm là việc của <code>HAVING</code> — <code>WHERE</code> chạy trước khi có nhóm. Cần Thơ (133) và Hà Nội (132) phải bị loại.</li>' +
            '<li>' + c("sum(amount) FILTER (WHERE method = 'card')") + ' tính phần trả thẻ ngay trong cùng một lượt.</li>' +
            '</ul>',
          ),
          starterCode: starter(3, 'city, buyers, paid_orders, units, revenue, card_pct', Q3_HEAD, Q3_FOOT),
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['pregrain',
              'Quantities are summed to one row per order (CTE, derived table or scalar subquery) before joining to <code>payment</code>, so no amount is multiplied by the number of lines.',
              'Số lượng được cộng về đúng một dòng mỗi đơn (CTE, bảng dẫn xuất hoặc truy vấn con vô hướng) trước khi join với <code>payment</code>, để không khoản tiền nào bị nhân với số dòng hàng.',
              0.4],
            ['having',
              'Year filter on <code>paid_at</code> in <code>WHERE</code> (half-open), group filter <code>count(*) &gt;= 135</code> in <code>HAVING</code>; exactly TP.HCM, Hải Phòng, Đà Nẵng remain.',
              'Điều kiện năm trên <code>paid_at</code> nằm trong <code>WHERE</code> (nửa mở), điều kiện nhóm <code>count(*) &gt;= 135</code> nằm trong <code>HAVING</code>; còn đúng TP.HCM, Hải Phòng, Đà Nẵng.',
              0.3],
            ['numbers',
              '<code>buyers</code> uses <code>count(DISTINCT …)</code>, <code>card_pct</code> uses <code>FILTER</code> and rounds to 1 decimal, and all three rows match exactly.',
              '<code>buyers</code> dùng <code>count(DISTINCT …)</code>, <code>card_pct</code> dùng <code>FILTER</code> và làm tròn 1 chữ số, cả ba dòng khớp chính xác.',
              0.3],
          ]),
        }),

        /* ── Q4 · chương 7.2 ─────────────────────────────────────────── */
        codeQ({
          points: 0.75,
          language: 'sql',
          prompt: B(
            '<p><b>Q4 — Stock reconciliation with NOT EXISTS (chapter 7).</b> The warehouse is supposed to log a <code>stock_movement</code> row for every order it ships. Write <b>two</b> queries.</p>' +
            '<p><b>4a</b> — for every non-cancelled status: <code>status</code>, <code>orders</code>, <code>logged</code> (orders that have at least one <code>stock_movement</code> row pointing at them) and <code>missing</code> (orders with none). Order by <code>status</code>.</p>' +
            '<p><b>4b</b> — products that were <b>not</b> in any non-cancelled order placed in <b>September 2026</b>: <code>sku</code>, <code>name</code>, ordered by <code>sku</code>.</p>' +
            '<ul>' +
            '<li>The obvious ' + c('o.id NOT IN (SELECT order_id FROM stock_movement)') + ' returns <b>zero rows</b> for 4a. The 48 <code>import</code> movements have <code>order_id</code> NULL, and <code>x NOT IN (…, NULL)</code> is never TRUE — it is NULL — so <code>WHERE</code> keeps nothing. No error, just a wrong report. Use <code>NOT EXISTS</code> (and <code>EXISTS</code> for <code>logged</code>).</li>' +
            '<li>In 4b the subquery joins <code>order_item</code> to <code>orders</code> to apply the month and status. Correlate it on the product (' + c('oi.product_id = p.id') + ').</li>' +
            '<li>Add a one-line SQL comment explaining why the <code>NOT IN</code> version returns nothing.</li>' +
            '</ul>',

            '<p><b>Câu 4 — Đối soát kho bằng NOT EXISTS (chương 7).</b> Kho phải ghi một dòng <code>stock_movement</code> cho mỗi đơn xuất đi. Hãy viết <b>hai</b> truy vấn.</p>' +
            '<p><b>4a</b> — với mỗi trạng thái không phải huỷ: <code>status</code>, <code>orders</code>, <code>logged</code> (số đơn có ít nhất một dòng <code>stock_movement</code> trỏ tới) và <code>missing</code> (số đơn không có dòng nào). Sắp theo <code>status</code>.</p>' +
            '<p><b>4b</b> — các sản phẩm <b>không</b> nằm trong đơn không-huỷ nào đặt trong <b>tháng 9/2026</b>: <code>sku</code>, <code>name</code>, sắp theo <code>sku</code>.</p>' +
            '<ul>' +
            '<li>Cách hiển nhiên ' + c('o.id NOT IN (SELECT order_id FROM stock_movement)') + ' trả về <b>không dòng nào</b> ở 4a. 48 dòng <code>import</code> có <code>order_id</code> NULL, mà <code>x NOT IN (…, NULL)</code> không bao giờ TRUE — nó là NULL — nên <code>WHERE</code> chẳng giữ lại gì. Không lỗi, chỉ là báo cáo sai. Dùng <code>NOT EXISTS</code> (và <code>EXISTS</code> cho <code>logged</code>).</li>' +
            '<li>Ở 4b truy vấn con join <code>order_item</code> với <code>orders</code> để áp tháng và trạng thái. Tương quan nó theo sản phẩm (' + c('oi.product_id = p.id') + ').</li>' +
            '<li>Thêm một dòng chú thích SQL giải thích vì sao bản <code>NOT IN</code> không ra dòng nào.</li>' +
            '</ul>',
          ),
          starterCode: starter(4, '4a: status, orders, logged, missing  ·  4b: sku, name', Q4_HEAD, Q4_FOOT),
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['antijoin',
              '4a uses a correlated <code>NOT EXISTS</code> (or <code>LEFT JOIN … IS NULL</code> on a de-duplicated side) instead of <code>NOT IN</code> over the nullable <code>order_id</code>; <code>logged + missing = orders</code> on every row.',
              '4a dùng <code>NOT EXISTS</code> tương quan (hoặc <code>LEFT JOIN … IS NULL</code> trên phía đã khử trùng) thay cho <code>NOT IN</code> trên cột <code>order_id</code> có NULL; mọi dòng có <code>logged + missing = orders</code>.',
              0.35],
            ['onepass',
              'The three numbers per status come from one grouped query (<code>FILTER</code> over <code>EXISTS</code> / <code>NOT EXISTS</code> or equivalent), cancelled excluded, ordered by status.',
              'Ba con số mỗi trạng thái ra từ một truy vấn gom nhóm (<code>FILTER</code> với <code>EXISTS</code> / <code>NOT EXISTS</code> hoặc tương đương), loại trạng thái huỷ, sắp theo trạng thái.',
              0.2],
            ['b',
              '4b correlates on the product, applies the September window as a half-open range plus the status filter inside the subquery, and returns only CT1103; the comment states the NULL reason.',
              '4b tương quan theo sản phẩm, đặt khoảng tháng 9 (nửa mở) và điều kiện trạng thái bên trong truy vấn con, chỉ ra CT1103; dòng chú thích nêu đúng lý do NULL.',
              0.2],
          ]),
        }),

        /* ── Q5 · chương 2.4 + 13.1–13.2 ─────────────────────────────── */
        codeQ({
          points: 0.75,
          language: 'sql',
          prompt: B(
            '<p><b>Q5 — Querying product attributes in jsonb (chapters 2 and 13).</b> <code>product.attrs</code> looks like ' + c('{"tags": ["học sinh"], "brand": "Casio", "color": "đen"}') + ' — <code>tags</code> is an <b>array</b>. Write <b>two</b> queries over <b>active</b> products.</p>' +
            '<p><b>5a</b> — products tagged <code>học sinh</code> whose colour is <code>đen</code>: <code>sku</code>, <code>name</code>, <code>price</code>, ordered by <code>price</code> descending then <code>sku</code>. Use <b>one containment test</b> (<code>@&gt;</code>), the form a GIN index can answer.</p>' +
            '<p><b>5b</b> — one row per tag: <code>tag</code>, <code>products</code>, <code>brands</code> (distinct brands), <code>avg_price</code> (rounded to a whole number). Order by <code>products</code> descending then <code>tag</code>.</p>' +
            '<ul>' +
            '<li>' + c("attrs->>'tags' = 'học sinh'") + ' finds <b>nothing</b>: <code>-&gt;&gt;</code> on an array returns the JSON text <code>["học sinh"]</code>. And ' + c('attrs @> \'{"tags": "học sinh"}\'') + ' also finds nothing — containment compares structure, so the array must be written as an array.</li>' +
            '<li>For 5b the array has to become rows first: ' + c("jsonb_array_elements_text(p.attrs->'tags')") + ' in the <code>FROM</code> clause (a lateral call), then <code>GROUP BY</code> the tag.</li>' +
            '</ul>',

            '<p><b>Câu 5 — Truy vấn thuộc tính sản phẩm trong jsonb (chương 2 và 13).</b> <code>product.attrs</code> có dạng ' + c('{"tags": ["học sinh"], "brand": "Casio", "color": "đen"}') + ' — <code>tags</code> là một <b>mảng</b>. Viết <b>hai</b> truy vấn trên các sản phẩm <b>đang bán</b>.</p>' +
            '<p><b>5a</b> — sản phẩm gắn nhãn <code>học sinh</code> và có màu <code>đen</code>: <code>sku</code>, <code>name</code>, <code>price</code>, sắp theo <code>price</code> giảm dần rồi <code>sku</code>. Dùng <b>một phép chứa</b> (<code>@&gt;</code>), đúng dạng mà chỉ mục GIN trả lời được.</p>' +
            '<p><b>5b</b> — mỗi nhãn một dòng: <code>tag</code>, <code>products</code>, <code>brands</code> (số thương hiệu khác nhau), <code>avg_price</code> (làm tròn tới số nguyên). Sắp theo <code>products</code> giảm dần rồi <code>tag</code>.</p>' +
            '<ul>' +
            '<li>' + c("attrs->>'tags' = 'học sinh'") + ' <b>không tìm thấy gì</b>: <code>-&gt;&gt;</code> trên một mảng trả về chuỗi JSON <code>["học sinh"]</code>. Và ' + c('attrs @> \'{"tags": "học sinh"}\'') + ' cũng không ra gì — phép chứa so cả CẤU TRÚC, nên mảng phải viết thành mảng.</li>' +
            '<li>Ở 5b mảng phải biến thành các dòng trước: ' + c("jsonb_array_elements_text(p.attrs->'tags')") + ' trong mệnh đề <code>FROM</code> (lời gọi lateral), rồi mới <code>GROUP BY</code> theo nhãn.</li>' +
            '</ul>',
          ),
          starterCode: starter(5, '5a: sku, name, price  ·  5b: tag, products, brands, avg_price', Q5_HEAD, Q5_FOOT),
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['contain',
              '5a filters with a single <code>attrs @&gt; \'{"tags": ["học sinh"], "color": "đen"}\'</code> (array written as an array) plus <code>is_active</code>; five rows in price order.',
              '5a lọc bằng một phép <code>attrs @&gt; \'{"tags": ["học sinh"], "color": "đen"}\'</code> (mảng viết đúng là mảng) cùng <code>is_active</code>; năm dòng theo thứ tự giá.',
              0.35],
            ['unnest',
              '5b expands the array with <code>jsonb_array_elements_text</code> (or <code>jsonb_array_elements</code> + <code>-&gt;&gt;</code>) in <code>FROM</code>, groups by the tag, counts distinct <code>attrs-&gt;&gt;\'brand\'</code>.',
              '5b bung mảng bằng <code>jsonb_array_elements_text</code> (hoặc <code>jsonb_array_elements</code> + <code>-&gt;&gt;</code>) trong <code>FROM</code>, gom theo nhãn, đếm khác nhau <code>attrs-&gt;&gt;\'brand\'</code>.',
              0.25],
            ['out',
              'Three rows of 5b match, with <code>avg_price</code> rounded to an integer and the required order.',
              'Ba dòng của 5b khớp, <code>avg_price</code> làm tròn số nguyên và đúng thứ tự yêu cầu.',
              0.15],
          ]),
        }),

        /* ── Q6 · chương 8.1–8.4 + 7.3 ───────────────────────────────── */
        codeQ({
          points: 1.5,
          language: 'sql',
          prompt: B(
            '<p><b>Q6 — Ranking with ties, then month on month (chapter 8).</b> Two queries; money and quantities count on payments made in 2026 (<code>payment.paid_at</code>, Vietnam time).</p>' +
            '<p><b>6a — Top 3 with ties.</b> For each sub-category under the root <code>Vở &amp; giấy</code>, return the best-selling products by <b>units</b> (sum of <code>order_item.qty</code> in paid orders). A product is in the top 3 if <b>fewer than three products in its sub-category sold strictly more</b> — so ties at the boundary are all kept. Columns: <code>category</code>, <code>sku</code>, <code>product</code>, <code>units</code>, <code>rk</code>; order by <code>category</code>, <code>rk</code>, <code>sku</code>.</p>' +
            '<p><b>6b — Month on month.</b> For January to September 2026: <code>month</code> (<code>YYYY-MM</code>), <code>revenue</code> (sum of <code>payment.amount</code>), <code>prev_revenue</code>, <code>change_pct</code> (vs previous month, 1 decimal; empty for January) and <code>running_total</code>. Order by month.</p>' +
            '<ul>' +
            '<li>The definition in 6a is exactly <code>rank()</code>. In <code>Vở ô ly</code> two products tie at 64 units for 2nd place: <code>row_number()</code> drops one of them, <code>dense_rank()</code> lets a fourth product (63 units) in. In <code>Sổ tay</code> two tie at 69 for 3rd — both stay.</li>' +
            '<li>A window function cannot be filtered in the <code>WHERE</code> of its own <code>SELECT</code> (<code>ERROR: window functions are not allowed in WHERE</code>): rank in a CTE, filter outside.</li>' +
            '<li>6b: aggregate per month first, then apply <code>lag()</code> and a running <code>sum() OVER (ORDER BY …)</code> to the monthly rows. Group months with <code>date_trunc(\'month\', paid_at)</code> in the Vietnam session — in UTC, January\'s revenue would change. The September running total, 411,147,000, is the same 9-month figure as Lab 3.</li>' +
            '</ul>',

            '<p><b>Câu 6 — Xếp hạng có hoà, rồi so tháng với tháng (chương 8).</b> Hai truy vấn; tiền và số lượng tính theo các lần thanh toán trong năm 2026 (<code>payment.paid_at</code>, giờ Việt Nam).</p>' +
            '<p><b>6a — Top 3 có hoà.</b> Với mỗi danh mục con thuộc gốc <code>Vở &amp; giấy</code>, trả về các sản phẩm bán chạy nhất theo <b>số lượng</b> (tổng <code>order_item.qty</code> trong các đơn đã thanh toán). Một sản phẩm thuộc top 3 nếu <b>có ít hơn ba sản phẩm cùng danh mục bán được NHIỀU HƠN HẲN nó</b> — nên các sản phẩm hoà nhau ở ranh giới đều được giữ. Cột: <code>category</code>, <code>sku</code>, <code>product</code>, <code>units</code>, <code>rk</code>; sắp theo <code>category</code>, <code>rk</code>, <code>sku</code>.</p>' +
            '<p><b>6b — So tháng với tháng.</b> Từ tháng 1 tới tháng 9/2026: <code>month</code> (<code>YYYY-MM</code>), <code>revenue</code> (tổng <code>payment.amount</code>), <code>prev_revenue</code>, <code>change_pct</code> (so với tháng trước, 1 chữ số thập phân; tháng 1 để trống) và <code>running_total</code> (luỹ tiến). Sắp theo tháng.</p>' +
            '<ul>' +
            '<li>Định nghĩa ở 6a chính là <code>rank()</code>. Ở <code>Vở ô ly</code> có hai sản phẩm hoà 64 cái ở hạng 2: <code>row_number()</code> làm rơi một trong hai, <code>dense_rank()</code> lại cho sản phẩm thứ tư (63 cái) lọt vào. Ở <code>Sổ tay</code> hai sản phẩm hoà 69 ở hạng 3 — cả hai được giữ.</li>' +
            '<li>Hàm cửa sổ không lọc được trong <code>WHERE</code> của chính câu <code>SELECT</code> chứa nó (<code>ERROR: window functions are not allowed in WHERE</code>): xếp hạng trong CTE, lọc ở ngoài.</li>' +
            '<li>6b: tổng hợp theo tháng trước, rồi mới áp <code>lag()</code> và <code>sum() OVER (ORDER BY …)</code> luỹ tiến lên các dòng tháng. Gom tháng bằng <code>date_trunc(\'month\', paid_at)</code> trong phiên giờ Việt Nam — ở UTC doanh thu tháng 1 sẽ khác. Tổng luỹ tiến tháng 9, 411.147.000, đúng bằng con số 9 tháng của Lab 3.</li>' +
            '</ul>',
          ),
          starterCode: starter(6, '6a: category, sku, product, units, rk  ·  6b: month, revenue, prev_revenue, change_pct, running_total', Q6_HEAD, Q6_FOOT),
          expectedOutput: Q6_OUTPUT,
          sampleSolution: Q6_SOLUTION,
          rubric: rubric([
            ['rank',
              '6a uses <code>rank()</code> partitioned by sub-category over units (not <code>row_number</code> / <code>dense_rank</code>), so both 64-unit Vở ô ly products and both 69-unit Sổ tay products appear and nothing else.',
              '6a dùng <code>rank()</code> phân vùng theo danh mục con trên số lượng (không phải <code>row_number</code> / <code>dense_rank</code>), nên cả hai sản phẩm 64 cái của Vở ô ly và cả hai sản phẩm 69 cái của Sổ tay đều có mặt, không thừa dòng nào.',
              0.4],
            ['layer',
              'The rank is computed in a CTE / subquery and filtered outside; the root is found through <code>category.parent_id</code>, not by hard-coding ids 8 and 9.',
              'Thứ hạng tính trong CTE / truy vấn con rồi lọc ở ngoài; gốc được tìm qua <code>category.parent_id</code>, không viết cứng id 8 và 9.',
              0.3],
            ['grain6b',
              '6b aggregates to one row per month before the window functions, with a half-open January–September range on <code>paid_at</code>.',
              '6b tổng hợp về một dòng mỗi tháng trước khi áp hàm cửa sổ, với khoảng nửa mở tháng 1–9 trên <code>paid_at</code>.',
              0.3],
            ['lag',
              '<code>lag()</code> gives the previous month (empty for January), <code>change_pct</code> divides by the previous month and rounds to 1 decimal, and the running total is a cumulative <code>sum() OVER</code> ending at 411147000.00.',
              '<code>lag()</code> cho tháng trước (tháng 1 trống), <code>change_pct</code> chia cho tháng trước và làm tròn 1 chữ số, tổng luỹ tiến là <code>sum() OVER</code> cộng dồn, kết thúc ở 411147000.00.',
              0.5],
          ]),
        }),

        /* ── Q7 · chương 7.4 ─────────────────────────────────────────── */
        codeQ({
          points: 1,
          language: 'sql',
          prompt: B(
            '<p><b>Q7 — The category tree, at any depth (chapter 7).</b> The given lines open a transaction and add a <b>third and fourth level</b> under <code>Máy tính cầm tay</code> — <code>Máy tính khoa học</code> and, below it, <code>Casio fx</code> — and move four calculators into them (rolled back at the end). Return every category with <code>depth</code> (roots are 1), <code>path</code> (names from the root down, joined by the three characters <code>&nbsp;&gt;&nbsp;</code>), <code>direct</code> (products whose <code>category_id</code> is that node) and <code>in_subtree</code> (products in that node <b>or any descendant</b>). Order by <code>path</code>.</p>' +
            '<ul>' +
            '<li>The usual shortcut — a self-join to the parent, ' + c('coalesce(parent.name, c.name)') + ' — only knows two levels. On this tree it reports <code>Dụng cụ học tập</code> with 8 products instead of 12 and invents roots called <code>Máy tính cầm tay</code> and <code>Máy tính khoa học</code>. Use <code>WITH RECURSIVE</code>.</li>' +
            '<li>For <code>in_subtree</code>, carry each node\'s lineage (an array of the ids from the root to it): a product belongs to node <i>t</i>\'s subtree when <i>t</i> is in the lineage of the product\'s category.</li>' +
            '<li>Cast the anchor path to <code>text</code> so the recursive term, which appends to it, agrees on type; use <code>UNION ALL</code>; and add a depth guard — a bad import that makes a category its own ancestor must not loop for ever.</li>' +
            '</ul>',

            '<p><b>Câu 7 — Cây danh mục, ở mọi độ sâu (chương 7).</b> Phần đề cho mở một giao dịch và thêm <b>tầng 3 và tầng 4</b> dưới <code>Máy tính cầm tay</code> — <code>Máy tính khoa học</code> và bên dưới nó là <code>Casio fx</code> — rồi chuyển bốn máy tính vào đó (cuối file rollback). Hãy trả về mọi danh mục với <code>depth</code> (gốc là 1), <code>path</code> (tên từ gốc xuống, nối bằng ba ký tự <code>&nbsp;&gt;&nbsp;</code>), <code>direct</code> (số sản phẩm có <code>category_id</code> đúng là nút đó) và <code>in_subtree</code> (số sản phẩm ở nút đó <b>hoặc bất kỳ nút con cháu nào</b>). Sắp theo <code>path</code>.</p>' +
            '<ul>' +
            '<li>Lối tắt quen thuộc — self-join lên cha, ' + c('coalesce(parent.name, c.name)') + ' — chỉ biết hai tầng. Trên cây này nó báo <code>Dụng cụ học tập</code> có 8 sản phẩm thay vì 12 và bịa ra hai "gốc" tên <code>Máy tính cầm tay</code> và <code>Máy tính khoa học</code>. Hãy dùng <code>WITH RECURSIVE</code>.</li>' +
            '<li>Với <code>in_subtree</code>, mang theo dòng dõi của mỗi nút (mảng các id từ gốc xuống nó): sản phẩm thuộc cây con của nút <i>t</i> khi <i>t</i> nằm trong dòng dõi của danh mục chứa sản phẩm.</li>' +
            '<li>Ép path ở vế khởi đầu về <code>text</code> để vế đệ quy (nối thêm vào nó) khớp kiểu; dùng <code>UNION ALL</code>; và thêm lớp chặn độ sâu — một lần nhập hỏng khiến danh mục thành tổ tiên của chính nó không được làm truy vấn chạy mãi.</li>' +
            '</ul>',
          ),
          starterCode: starter(7, 'depth, path, direct, in_subtree', Q7_HEAD, Q7_FOOT),
          expectedOutput: Q7_OUTPUT,
          sampleSolution: Q7_SOLUTION,
          rubric: rubric([
            ['recursive',
              'A <code>WITH RECURSIVE</code> from the roots (<code>parent_id IS NULL</code>) down via <code>c.parent_id = t.id</code> with <code>UNION ALL</code>; depth 4 reached for <code>Casio fx</code>; no hard-coded levels.',
              'Một <code>WITH RECURSIVE</code> đi từ các gốc (<code>parent_id IS NULL</code>) xuống qua <code>c.parent_id = t.id</code> với <code>UNION ALL</code>; tới được độ sâu 4 ở <code>Casio fx</code>; không viết cứng số tầng.',
              0.35],
            ['subtree',
              '<code>in_subtree</code> rolls products up through every ancestor (lineage array, closure join or a second recursion): roots read 18 / 12 / 6 / 12 and <code>Máy tính cầm tay</code> reads 2 direct, 6 in subtree.',
              '<code>in_subtree</code> cộng dồn sản phẩm lên mọi tổ tiên (mảng dòng dõi, join bao đóng hoặc một lần đệ quy thứ hai): các gốc ra 18 / 12 / 6 / 12 và <code>Máy tính cầm tay</code> ra 2 trực tiếp, 6 trong cây con.',
              0.35],
            ['guards',
              'Anchor path cast to <code>text</code>, exact <code>&nbsp;&gt;&nbsp;</code> separator, a depth (or visited-id) guard, and all 14 rows in <code>path</code> order.',
              'Path ở vế khởi đầu ép về <code>text</code>, đúng dải phân cách <code>&nbsp;&gt;&nbsp;</code>, có lớp chặn độ sâu (hoặc id đã thăm), và đủ 14 dòng theo thứ tự <code>path</code>.',
              0.3],
          ]),
        }),

        /* ── Q8 · chương 3.1–3.3 + 4.1 + 11.1 ───────────────────────── */
        codeQ({
          points: 1.25,
          language: 'sql',
          prompt: B(
            '<p><b>Q8 — A shopping cart: DDL, named constraints, UPSERT (chapters 3, 4 and 11).</b> Inside the given transaction, create table <code>cart_item</code>:</p>' +
            '<ul>' +
            '<li><code>customer_id bigint</code> → <code>customer(id)</code>, deleting a customer deletes their cart; <code>product_id bigint</code> → <code>product(id)</code>; both <code>NOT NULL</code>; the pair is the <b>primary key</b>.</li>' +
            '<li><code>qty int NOT NULL DEFAULT 1</code> with a CHECK named <b><code>cart_item_qty_check</code></b>: 1 to 20.</li>' +
            '<li><code>added_at timestamptz NOT NULL DEFAULT now()</code>, <code>updated_at timestamptz</code> (NULL until the line is changed).</li>' +
            '<li>An index named <b><code>cart_item_product_id_idx</code></b> on <code>product_id</code> — the primary key cannot serve lookups by product (chapter 9, Lab 5).</li>' +
            '</ul>' +
            '<p>Then write the <b>"add to cart"</b> statement — one <code>INSERT … ON CONFLICT (customer_id, product_id) DO UPDATE</code> that <b>adds</b> the new quantity to the existing one and stamps <code>updated_at</code>, ' + c('RETURNING product_id, qty, (xmax = 0) AS inserted') + ' — and run it four times for customer 7: product 34 qty 1, product 34 qty 2, product 12 qty 2, product 34 qty 18. The last one would make 21, so wrap it in <code>SAVEPOINT too_many</code> … <code>ROLLBACK TO SAVEPOINT too_many</code>: without the savepoint the error aborts the whole transaction and the given checks after it all fail with <code>current transaction is aborted</code>.</p>' +
            '<ul>' +
            '<li>' + c('ON CONFLICT DO NOTHING') + ' silently swallows the second "add": <code>RETURNING</code> comes back empty and the quantity stays 1.</li>' +
            '<li>In <code>DO UPDATE SET qty = qty + EXCLUDED.qty</code> the bare <code>qty</code> is ambiguous (<code>ERROR: column reference "qty" is ambiguous</code>) — write <code>cart_item.qty</code>.</li>' +
            '<li><code>(xmax = 0)</code> is the classic tell: it is true for a freshly inserted row and false for one that the conflict branch updated.</li>' +
            '</ul>',

            '<p><b>Câu 8 — Giỏ hàng: DDL, ràng buộc đặt tên, UPSERT (chương 3, 4 và 11).</b> Bên trong giao dịch đề cho, hãy tạo bảng <code>cart_item</code>:</p>' +
            '<ul>' +
            '<li><code>customer_id bigint</code> → <code>customer(id)</code>, xoá khách thì xoá luôn giỏ của họ; <code>product_id bigint</code> → <code>product(id)</code>; cả hai <code>NOT NULL</code>; cặp này là <b>khoá chính</b>.</li>' +
            '<li><code>qty int NOT NULL DEFAULT 1</code> với ràng buộc CHECK tên <b><code>cart_item_qty_check</code></b>: từ 1 tới 20.</li>' +
            '<li><code>added_at timestamptz NOT NULL DEFAULT now()</code>, <code>updated_at timestamptz</code> (NULL cho tới khi dòng bị sửa).</li>' +
            '<li>Một chỉ mục tên <b><code>cart_item_product_id_idx</code></b> trên <code>product_id</code> — khoá chính không phục vụ được việc tra theo sản phẩm (chương 9, Lab 5).</li>' +
            '</ul>' +
            '<p>Rồi viết câu lệnh <b>"thêm vào giỏ"</b> — một <code>INSERT … ON CONFLICT (customer_id, product_id) DO UPDATE</code> <b>cộng</b> số lượng mới vào số lượng sẵn có và đóng dấu <code>updated_at</code>, ' + c('RETURNING product_id, qty, (xmax = 0) AS inserted') + ' — và chạy nó bốn lần cho khách 7: sản phẩm 34 số lượng 1, sản phẩm 34 số lượng 2, sản phẩm 12 số lượng 2, sản phẩm 34 số lượng 18. Lần cuối sẽ thành 21, nên bọc nó trong <code>SAVEPOINT too_many</code> … <code>ROLLBACK TO SAVEPOINT too_many</code>: không có savepoint thì lỗi đó làm hỏng cả giao dịch và mọi phép kiểm đề cho phía sau đều chết với <code>current transaction is aborted</code>.</p>' +
            '<ul>' +
            '<li>' + c('ON CONFLICT DO NOTHING') + ' lặng lẽ nuốt lần "thêm" thứ hai: <code>RETURNING</code> trả về rỗng và số lượng vẫn là 1.</li>' +
            '<li>Trong <code>DO UPDATE SET qty = qty + EXCLUDED.qty</code> chữ <code>qty</code> trần là mơ hồ (<code>ERROR: column reference "qty" is ambiguous</code>) — viết <code>cart_item.qty</code>.</li>' +
            '<li><code>(xmax = 0)</code> là dấu hiệu kinh điển: đúng với dòng vừa chèn mới, sai với dòng mà nhánh xung đột đã cập nhật.</li>' +
            '</ul>',
          ),
          starterCode: starter(8, 'RETURNING product_id, qty, inserted (×3, rồi một lỗi CHECK) — các phép kiểm đề cho in phần còn lại', Q8_HEAD, Q8_FOOT),
          expectedOutput: Q8_OUTPUT,
          sampleSolution: Q8_SOLUTION,
          rubric: rubric([
            ['ddl',
              'Table and constraints exactly as specified — the given <code>pg_constraint</code> check prints the four rows (<code>ON DELETE CASCADE</code> on the customer key only, <code>CHECK</code> named <code>cart_item_qty_check</code>, composite primary key) and <code>pg_indexes</code> shows <code>cart_item_product_id_idx</code>.',
              'Bảng và ràng buộc đúng đặc tả — phép kiểm <code>pg_constraint</code> đề cho in đủ bốn dòng (<code>ON DELETE CASCADE</code> chỉ ở khoá tới customer, <code>CHECK</code> tên <code>cart_item_qty_check</code>, khoá chính tổ hợp) và <code>pg_indexes</code> có <code>cart_item_product_id_idx</code>.',
              0.4],
            ['upsert',
              'One <code>ON CONFLICT (customer_id, product_id) DO UPDATE SET qty = cart_item.qty + EXCLUDED.qty, updated_at = now()</code>; the three <code>RETURNING</code> rows read 34|1|t, 34|3|f, 12|2|t.',
              'Một <code>ON CONFLICT (customer_id, product_id) DO UPDATE SET qty = cart_item.qty + EXCLUDED.qty, updated_at = now()</code>; ba dòng <code>RETURNING</code> ra 34|1|t, 34|3|f, 12|2|t.',
              0.45],
            ['savepoint',
              'The 21-unit add fails on <code>cart_item_qty_check</code> inside a savepoint that is rolled back, so the transaction survives: the final cart is 12×2 (not updated) and 34×3 (updated), and the given foreign-key test still runs.',
              'Lần thêm thành 21 hỏng ở <code>cart_item_qty_check</code> bên trong một savepoint được rollback, nên giao dịch sống: giỏ cuối là 12×2 (chưa sửa) và 34×3 (đã sửa), và phép thử khoá ngoại đề cho vẫn chạy.',
              0.4],
          ]),
        }),

        /* ── Q9 · chương 12.1–12.2 + 7.2 ─────────────────────────────── */
        codeQ({
          points: 1.25,
          language: 'sql',
          prompt: B(
            '<p><b>Q9 — Only buyers may review: a validating trigger (chapter 12).</b> Write a PL/pgSQL trigger function <code>review_guard()</code> and a trigger <code>review_guard</code> on <code>review</code> that fires <b>BEFORE INSERT OR UPDATE OF product_id, customer_id, body … FOR EACH ROW</b> and:</p>' +
            '<ol>' +
            '<li>normalises the body: trims it, and an all-blank body becomes <code>NULL</code> (' + c("nullif(btrim(NEW.body), '')") + ');</li>' +
            '<li>rejects the row unless the customer has a <b><code>shipped</code></b> order containing that product, with exactly ' + c("RAISE EXCEPTION 'customer % has not received product %', NEW.customer_id, NEW.product_id USING ERRCODE = 'check_violation'") + ';</li>' +
            '<li>otherwise returns <code>NEW</code>.</li>' +
            '</ol>' +
            '<p>The given lines then run five tests for customer 7 (shipped products include 33 and 41; product 22 is only in a <code>pending</code> order; product 1 is already reviewed) and print the customer\'s reviews.</p>' +
            '<ul>' +
            '<li>It must be a <b>BEFORE</b> trigger: in an <code>AFTER</code> trigger, changing <code>NEW.body</code> does nothing — the row is already written, the return value is ignored, and <code>\'   \'</code> stays three spaces.</li>' +
            '<li>"Bought" means <b>shipped</b>. Customer 7 does have an order containing product 22 — order 703, still <code>pending</code>. A check on <code>order_item</code> alone lets that review through.</li>' +
            '<li>The trigger runs before the constraints, so the duplicate review of product 1 passes the guard and is then stopped by the existing <code>UNIQUE (product_id, customer_id)</code>.</li>' +
            '<li>Because it also fires on <code>UPDATE OF product_id</code>, moving an existing review onto product 22 is rejected too.</li>' +
            '</ul>',

            '<p><b>Câu 9 — Chỉ người đã mua mới được đánh giá: trigger kiểm dữ liệu (chương 12).</b> Viết hàm trigger PL/pgSQL <code>review_guard()</code> và trigger <code>review_guard</code> trên <code>review</code>, chạy <b>BEFORE INSERT OR UPDATE OF product_id, customer_id, body … FOR EACH ROW</b>, và:</p>' +
            '<ol>' +
            '<li>chuẩn hoá nội dung: cắt khoảng trắng hai đầu, nội dung toàn khoảng trắng thành <code>NULL</code> (' + c("nullif(btrim(NEW.body), '')") + ');</li>' +
            '<li>từ chối dòng nếu khách KHÔNG có đơn <b><code>shipped</code></b> nào chứa sản phẩm đó, đúng câu ' + c("RAISE EXCEPTION 'customer % has not received product %', NEW.customer_id, NEW.product_id USING ERRCODE = 'check_violation'") + ';</li>' +
            '<li>ngược lại trả về <code>NEW</code>.</li>' +
            '</ol>' +
            '<p>Phần đề cho sau đó chạy năm phép thử cho khách 7 (sản phẩm đã giao gồm 33 và 41; sản phẩm 22 chỉ nằm trong một đơn <code>pending</code>; sản phẩm 1 đã được đánh giá) rồi in các đánh giá của khách.</p>' +
            '<ul>' +
            '<li>Phải là trigger <b>BEFORE</b>: trong trigger <code>AFTER</code>, sửa <code>NEW.body</code> chẳng có tác dụng gì — dòng đã được ghi, giá trị trả về bị bỏ qua, và <code>\'   \'</code> vẫn là ba dấu cách.</li>' +
            '<li>"Đã mua" nghĩa là <b>đã giao</b> (shipped). Khách 7 CÓ một đơn chứa sản phẩm 22 — đơn 703, vẫn <code>pending</code>. Chỉ kiểm <code>order_item</code> là để lọt đánh giá đó.</li>' +
            '<li>Trigger chạy trước các ràng buộc, nên đánh giá trùng cho sản phẩm 1 qua được lớp kiểm của bạn rồi bị <code>UNIQUE (product_id, customer_id)</code> sẵn có chặn lại.</li>' +
            '<li>Vì trigger cũng chạy với <code>UPDATE OF product_id</code>, việc chuyển một đánh giá sẵn có sang sản phẩm 22 cũng bị từ chối.</li>' +
            '</ul>',
          ),
          starterCode: starter(9, 'các phép thử đề cho in: 3 dòng ERROR rồi product_id, rating, body, no_body', Q9_HEAD, Q9_FOOT),
          expectedOutput: Q9_OUTPUT,
          sampleSolution: Q9_SOLUTION,
          rubric: rubric([
            ['before',
              'A <code>BEFORE INSERT OR UPDATE OF …</code> row trigger calling a function that returns <code>trigger</code> and ends with <code>RETURN NEW</code>; the body is trimmed (\'Máy chạy tốt\') and the blank one stored as NULL.',
              'Trigger mức dòng <code>BEFORE INSERT OR UPDATE OF …</code> gọi một hàm <code>RETURNS trigger</code> kết thúc bằng <code>RETURN NEW</code>; nội dung được cắt (\'Máy chạy tốt\') và nội dung trống lưu thành NULL.',
              0.45],
            ['shipped',
              'The guard is an <code>EXISTS</code> over <code>orders</code> ⋈ <code>order_item</code> with <code>status = \'shipped\'</code> for <code>NEW.customer_id</code> / <code>NEW.product_id</code>, so product 22 (pending order 703) is refused on both the INSERT and the UPDATE.',
              'Lớp kiểm là một <code>EXISTS</code> trên <code>orders</code> ⋈ <code>order_item</code> với <code>status = \'shipped\'</code> cho <code>NEW.customer_id</code> / <code>NEW.product_id</code>, nên sản phẩm 22 (đơn pending 703) bị từ chối ở cả INSERT lẫn UPDATE.',
              0.5],
            ['message',
              'The exception text and SQLSTATE are exactly as specified, and the final listing shows the four rows 1, 13, 33, 41 with the NULL flag only on 41.',
              'Câu báo lỗi và SQLSTATE đúng y đặc tả, và danh sách cuối có đủ bốn dòng 1, 13, 33, 41, cờ NULL chỉ ở 41.',
              0.3],
          ]),
        }),

        /* ── Q10 · chương 9.1–9.2 + 10.1 ─────────────────────────────── */
        codeQ({
          points: 1.25,
          language: 'sql',
          prompt: B(
            '<p><b>Q10 — Prove an index with EXPLAIN (chapters 9 and 10).</b> The product page asks ' + c('SELECT count(*) AS lines, sum(qty) AS units FROM order_item WHERE product_id = 34;') + ' Inside the given transaction, in this order:</p>' +
            '<ol>' +
            '<li><code>EXPLAIN (COSTS OFF)</code> of that exact statement — the plan before;</li>' +
            '<li>create <code>order_item_product_id_idx</code> on <code>order_item (product_id)</code>;</li>' +
            '<li><code>EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF)</code> of the same statement — the plan after, measured, without the timings that change every run;</li>' +
            '<li>the statement itself;</li>' +
            '<li>a SQL comment of two or three lines: why could the primary key <code>(order_id, product_id)</code> not serve this query?</li>' +
            '</ol>' +
            '<ul>' +
            '<li>Read the plans, do not guess them: before is <code>Seq Scan</code> with <code>Filter</code>; after is a <code>Bitmap Index Scan</code> on your index feeding a <code>Bitmap Heap Scan</code> with a <code>Recheck Cond</code>.</li>' +
            '<li>A B-tree is sorted by its <b>leading</b> column. In <code>order_item_pkey</code> the entries for product 34 are scattered among every <code>order_id</code>, so there is no range to descend into — measured: even with <code>enable_seqscan = off</code> the planner can only read the whole primary-key index end to end.</li>' +
            '<li>Notice <code>Heap Blocks: exact=36</code>: the 99 matching lines sit on 36 of the table\'s 37 pages. On a 5,000-row table the index saves little; on Lab 5\'s 2.5 million lines it is the difference between milliseconds and a full scan. That is also why <code>order_item.product_id</code> — a foreign key with no index — was on Lab 5\'s list.</li>' +
            '<li><code>CREATE INDEX</code> inside a transaction is fine here; <code>CONCURRENTLY</code> is not allowed inside one, which is why the exam uses the plain form and rolls it back.</li>' +
            '</ul>',

            '<p><b>Câu 10 — Chứng minh một chỉ mục bằng EXPLAIN (chương 9 và 10).</b> Trang sản phẩm hỏi ' + c('SELECT count(*) AS lines, sum(qty) AS units FROM order_item WHERE product_id = 34;') + ' Bên trong giao dịch đề cho, theo đúng thứ tự:</p>' +
            '<ol>' +
            '<li><code>EXPLAIN (COSTS OFF)</code> của đúng câu đó — kế hoạch trước;</li>' +
            '<li>tạo <code>order_item_product_id_idx</code> trên <code>order_item (product_id)</code>;</li>' +
            '<li><code>EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF)</code> của cùng câu — kế hoạch sau, có đo, bỏ phần thời gian vốn đổi mỗi lần chạy;</li>' +
            '<li>bản thân câu truy vấn;</li>' +
            '<li>một chú thích SQL hai ba dòng: vì sao khoá chính <code>(order_id, product_id)</code> không phục vụ được truy vấn này?</li>' +
            '</ol>' +
            '<ul>' +
            '<li>Đọc kế hoạch, đừng đoán: trước là <code>Seq Scan</code> kèm <code>Filter</code>; sau là <code>Bitmap Index Scan</code> trên chỉ mục của bạn đổ vào <code>Bitmap Heap Scan</code> kèm <code>Recheck Cond</code>.</li>' +
            '<li>B-tree được sắp theo cột <b>dẫn đầu</b>. Trong <code>order_item_pkey</code> các mục của sản phẩm 34 nằm rải khắp mọi <code>order_id</code>, nên không có khoảng nào để đi xuống — đo thật: kể cả khi <code>enable_seqscan = off</code>, bộ lập kế hoạch cũng chỉ có thể đọc trọn chỉ mục khoá chính từ đầu tới cuối.</li>' +
            '<li>Để ý <code>Heap Blocks: exact=36</code>: 99 dòng khớp nằm trên 36 trong 37 trang của bảng. Với bảng 5.000 dòng, chỉ mục tiết kiệm chẳng bao nhiêu; với 2,5 triệu dòng ở Lab 5 thì đó là khác biệt giữa vài mili-giây và một lần quét trọn bảng. Đó cũng là lý do <code>order_item.product_id</code> — khoá ngoại không có chỉ mục — nằm trong danh sách của Lab 5.</li>' +
            '<li><code>CREATE INDEX</code> trong giao dịch là được; <code>CONCURRENTLY</code> thì không được phép chạy trong giao dịch, nên đề dùng dạng thường rồi rollback.</li>' +
            '</ul>',
          ),
          starterCode: starter(10, 'hai QUERY PLAN rồi lines, units', Q10_HEAD, Q10_FOOT),
          expectedOutput: Q10_OUTPUT,
          sampleSolution: Q10_SOLUTION,
          rubric: rubric([
            ['before',
              'The before-plan is produced with <code>EXPLAIN (COSTS OFF)</code> on the exact statement and shows <code>Seq Scan on order_item</code> + <code>Filter: (product_id = 34)</code>.',
              'Kế hoạch trước được tạo bằng <code>EXPLAIN (COSTS OFF)</code> trên đúng câu lệnh và cho thấy <code>Seq Scan on order_item</code> + <code>Filter: (product_id = 34)</code>.',
              0.3],
            ['after',
              'The index is created with the given name on <code>product_id</code> and the measured after-plan shows <code>Bitmap Index Scan on order_item_product_id_idx</code> with 99 rows, followed by the result 99 | 191.',
              'Chỉ mục được tạo đúng tên trên <code>product_id</code> và kế hoạch sau có đo cho thấy <code>Bitmap Index Scan on order_item_product_id_idx</code> với 99 dòng, tiếp theo là kết quả 99 | 191.',
              0.45],
            ['why',
              'The comment names the leading-column rule: the composite key is ordered by <code>order_id</code> first, so <code>product_id = 34</code> alone has no contiguous range in it.',
              'Chú thích nêu đúng quy tắc cột dẫn đầu: khoá tổ hợp được sắp theo <code>order_id</code> trước, nên riêng <code>product_id = 34</code> không có khoảng liền nào trong đó.',
              0.3],
            ['clean',
              'No <code>COMMIT</code>, no <code>CONCURRENTLY</code> inside the transaction, no <code>SET enable_*</code> left in the answer; the file leaves the shop unchanged.',
              'Không <code>COMMIT</code>, không <code>CONCURRENTLY</code> trong giao dịch, không để <code>SET enable_*</code> trong lời giải; file chạy xong cửa hàng vẫn nguyên.',
              0.2],
          ]),
        }),
      ],
    },
  ],
};
