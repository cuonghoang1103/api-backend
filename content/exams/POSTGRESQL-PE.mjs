/**
 * PostgreSQL — Practical Exam (PE): 5 câu viết SQL, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/postgresql/s00…s16`. Khác đề FE (50 câu
 * trắc nghiệm, đọc SQL), đề này bắt VIẾT SQL: giữ dòng qua OUTER JOIN và đếm
 * đúng cột, thuần hoá fan-out bằng CTE tổng hợp trước, top-N mỗi nhóm bằng hàm
 * cửa sổ, CTE đệ quy có lớp chặn chu trình, và rút giá trị ra khỏi jsonb đúng
 * kiểu.
 *
 * ⚠️ MỌI `sampleSolution` DƯỚI ĐÂY ĐÃ CHẠY THẬT trên **PostgreSQL 16.14**
 * (Docker `postgres:16`) với đúng lược đồ + dữ liệu ghi trong `instructions`.
 * `expectedOutput` là NGUYÊN VĂN bảng psql in ra, không phải dự đoán. Dựng lại
 * môi trường để kiểm:
 *   docker run --rm -d --name pg-de -e POSTGRES_PASSWORD=x -p 55432:5432 postgres:16
 *   # nạp khối SQL trong INSTRUCTIONS, rồi chạy từng sampleSolution
 *
 * ⚠️ `node scripts/exam-check.mjs` chạy `sampleSolution` bằng **Node**, nên với
 * đề SQL nó chỉ kiểm được phần CẤU TRÚC (song ngữ, đủ trường, rubric); bước
 * "chạy lời giải" tất yếu báo lỗi vì SQL không phải JavaScript. Kho này không
 * có gói `pg`, nên không thể bọc lời giải trong một script Node gọi cơ sở dữ
 * liệu mà vẫn giữ được tính tự chứa. Việc kiểm đúng/sai của đề này làm bằng
 * psql trên Postgres thật, như ghi ở trên.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/POSTGRESQL-PE.mjs --apply
 */
import { B, c, code, codeQ } from './_lib/postgresql-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu, nên
 * điểm từng tiêu chí cộng lại ra thẳng điểm câu — không phải quy đổi.
 * `weight` giữ nguyên vai trò cũ (bộ chấm AI in ra kèm tiêu chí).
 */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

/* ── Lược đồ + dữ liệu dùng chung cho cả năm câu ─────────────────────────── */

const SCHEMA_SQL =
  '-- Chạy MỘT LẦN vào một cơ sở dữ liệu nháp trước khi làm bài.\n' +
  'DROP SCHEMA IF EXISTS pe CASCADE;\n' +
  'CREATE SCHEMA pe;\n' +
  'SET search_path = pe, public;\n' +
  '\n' +
  'CREATE TABLE customer (\n' +
  '  id    int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n' +
  '  name  text NOT NULL,\n' +
  '  city  text NOT NULL,\n' +
  "  props jsonb NOT NULL DEFAULT '{}'::jsonb\n" +
  ');\n' +
  'INSERT INTO customer (name, city, props) VALUES\n' +
  "  ('An',   'Hanoi',  '{\"tier\":\"gold\",\"credit\":1500}'),\n" +
  "  ('Binh', 'Danang', '{\"tier\":\"silver\",\"credit\":300}'),\n" +
  "  ('Chi',  'Hanoi',  '{\"tier\":\"gold\",\"credit\":90}'),\n" +
  "  ('Dung', 'Hue',    '{\"tier\":\"silver\"}'),\n" +
  "  ('Em',   'Hanoi',  '{}');\n" +
  '\n' +
  'CREATE TABLE category (\n' +
  '  id        int PRIMARY KEY,\n' +
  '  name      text NOT NULL,\n' +
  '  parent_id int REFERENCES category(id)\n' +
  ');\n' +
  'INSERT INTO category (id, name, parent_id) VALUES\n' +
  "  (1,'All',NULL), (2,'Tech',1), (3,'Books',1),\n" +
  "  (4,'Laptops',2), (5,'Phones',2), (6,'Gaming laptops',4);\n" +
  '-- Ba dòng dưới là hậu quả của một lần nhập dữ liệu hỏng: 7 -> 8 -> 9 -> 7.\n' +
  "INSERT INTO category (id, name, parent_id) VALUES (8,'Promo A',NULL);\n" +
  "INSERT INTO category (id, name, parent_id) VALUES (9,'Promo B',8);\n" +
  "INSERT INTO category (id, name, parent_id) VALUES (7,'Promo',9);\n" +
  'UPDATE category SET parent_id = 7 WHERE id = 8;\n' +
  '\n' +
  'CREATE TABLE product (\n' +
  '  id          int PRIMARY KEY,\n' +
  '  category_id int NOT NULL REFERENCES category(id),\n' +
  '  name        text NOT NULL,\n' +
  '  price       numeric(10,2) NOT NULL CHECK (price >= 0)\n' +
  ');\n' +
  'INSERT INTO product VALUES\n' +
  "  (1,4,'Laptop A',1000.00), (2,4,'Laptop B',1500.00), (3,6,'Rig X',2000.00),\n" +
  "  (4,5,'Phone P',700.00),   (5,5,'Phone Q',700.00),   (6,3,'SQL Book',40.00);\n" +
  '\n' +
  'CREATE TABLE orders (\n' +
  '  id          int PRIMARY KEY,\n' +
  '  customer_id int NOT NULL REFERENCES customer(id),\n' +
  '  placed_on   date NOT NULL,\n' +
  "  status      text NOT NULL CHECK (status IN ('paid','refunded'))\n" +
  ');\n' +
  'INSERT INTO orders VALUES\n' +
  "  (1,1,'2026-01-05','paid'),     (2,1,'2026-02-10','paid'),\n" +
  "  (3,2,'2026-01-20','refunded'), (4,3,'2026-03-01','paid'),\n" +
  "  (5,1,'2026-03-15','refunded'), (6,2,'2026-04-02','paid');\n" +
  '\n' +
  'CREATE TABLE order_item (\n' +
  '  order_id   int NOT NULL REFERENCES orders(id),\n' +
  '  product_id int NOT NULL REFERENCES product(id),\n' +
  '  qty        int NOT NULL CHECK (qty > 0),\n' +
  '  PRIMARY KEY (order_id, product_id)\n' +
  ');\n' +
  'INSERT INTO order_item VALUES\n' +
  '  (1,1,1), (1,6,2),\n' +
  '  (2,2,1),\n' +
  '  (3,4,3),\n' +
  '  (4,3,1), (4,5,1),\n' +
  '  (5,6,5),\n' +
  '  (6,4,1);\n';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Start a scratch PostgreSQL 16 and load the schema below <b>exactly as written</b>. One command is enough: <code>docker run --rm -d --name pg-de -e POSTGRES_PASSWORD=x -p 55432:5432 postgres:16</code>, then pipe the block into <code>psql</code>. The reference answers were produced on <b>PostgreSQL 16.14</b> against this data.</li>' +
  '<li>Write five files named <code>Q1.sql … Q5.sql</code>, one query per question unless the question says otherwise. Every file may assume <code>SET search_path = pe, public;</code> has already run.</li>' +
  '<li>Run each file with <code>psql -f Q1.sql</code> and compare with the "expected output" block <b>line for line</b>, including the column names, the row order and the number of decimal places. The <code>ORDER BY</code> in each question is part of the specification.</li>' +
  '<li><b>No procedural code.</b> No PL/pgSQL, no temporary tables, no client-side loops — each answer is SQL the server can plan as one statement.</li>' +
  '<li>Zip the five files into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> The result set first — a query that returns the wrong rows cannot pass. But this is a PostgreSQL exam, so <b>how</b> you got there is graded too: an aggregate computed at the wrong grain, a filter on the optional side of an <code>OUTER JOIN</code> sitting in <code>WHERE</code>, a <code>count(*)</code> where the NULL-padded row must not count, or a NULL assumed away instead of handled all cost marks <em>even when the output matches on this data</em>. Several questions contain a row placed there specifically to catch the shortcut.</p>' +
  '<p><b>The schema.</b></p>' +
  code(SCHEMA_SQL) +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Dựng một PostgreSQL 16 nháp rồi nạp lược đồ bên dưới <b>đúng nguyên văn</b>. Một lệnh là đủ: <code>docker run --rm -d --name pg-de -e POSTGRES_PASSWORD=x -p 55432:5432 postgres:16</code>, rồi đổ khối SQL đó vào <code>psql</code>. Đáp án mẫu được tạo ra trên <b>PostgreSQL 16.14</b> với đúng dữ liệu này.</li>' +
  '<li>Viết năm file tên <code>Q1.sql … Q5.sql</code>, mỗi câu một truy vấn trừ khi đề nói khác. Mọi file được phép giả định <code>SET search_path = pe, public;</code> đã chạy trước đó.</li>' +
  '<li>Chạy từng file bằng <code>psql -f Q1.sql</code> rồi đối chiếu với khối "kết quả mong đợi" <b>từng dòng một</b>, kể cả tên cột, thứ tự dòng và số chữ số thập phân. Mệnh đề <code>ORDER BY</code> trong mỗi câu là một phần của đề bài.</li>' +
  '<li><b>Không dùng mã thủ tục.</b> Không PL/pgSQL, không bảng tạm, không vòng lặp phía client — mỗi lời giải là SQL mà máy chủ lập kế hoạch được trong một câu lệnh.</li>' +
  '<li>Nén năm file thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Tập kết quả trước — truy vấn trả sai dòng thì không thể qua. Nhưng đây là bài thi PostgreSQL, nên <b>cách</b> bạn đi tới kết quả cũng bị chấm: một hàm tổng hợp áp ở sai grain, một điều kiện lọc của phía tuỳ chọn trong <code>OUTER JOIN</code> nằm trong <code>WHERE</code>, một <code>count(*)</code> ở chỗ dòng đệm NULL không được tính, hay một giá trị NULL bị mặc định là không có thay vì được xử lý — tất cả đều bị trừ điểm <em>ngay cả khi kết quả in ra khớp trên bộ dữ liệu này</em>. Nhiều câu có một dòng dữ liệu đặt vào đúng để bắt lối đi tắt.</p>' +
  '<p><b>Lược đồ.</b></p>' +
  code(SCHEMA_SQL) +
  '</div>';

/**
 * Khung cho mỗi file .sql học viên nộp. Hai mốc `ĐỀ CHO SẴN` / `VIẾT LỜI GIẢI`
 * giữ đúng khuôn chung của các đề PE khác trong thư mục này; ở đây chúng là chú
 * thích SQL, nên file vẫn chạy được bằng `psql -f`.
 */
const starter = (n, cols) =>
  '-- ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  `-- Q${n}. Lược đồ đã nạp sẵn; mọi truy vấn chạy với:\n` +
  '--     SET search_path = pe, public;\n' +
  `-- Kết quả phải có đúng các cột, đúng tên, đúng thứ tự: ${cols}\n` +
  '\n' +
  '-- ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  "SELECT 'chua cai dat';   -- thay bằng truy vấn của bạn\n" +
  '\n' +
  '-- ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '-- Chạy `psql -f Q' + n + '.sql` rồi đối chiếu với khối "kết quả mong đợi",\n' +
  '-- từng dòng một, kể cả tên cột và số chữ số thập phân.\n';

/* ─────────────────────────── Câu 1 ─────────────────────────── */

const Q1_SOLUTION =
  'SELECT c.name AS customer,\n' +
  '       count(o.id)                                  AS orders,\n' +
  "       count(o.id) FILTER (WHERE o.status = 'paid') AS paid_orders\n" +
  'FROM customer c\n' +
  'LEFT JOIN orders o ON o.customer_id = c.id\n' +
  'GROUP BY c.id, c.name\n' +
  'ORDER BY paid_orders DESC, c.name;\n';

const Q1_OUTPUT =
  ' customer | orders | paid_orders \n' +
  '----------+--------+-------------\n' +
  ' An       |      3 |           2\n' +
  ' Binh     |      2 |           1\n' +
  ' Chi      |      1 |           1\n' +
  ' Dung     |      0 |           0\n' +
  ' Em       |      0 |           0\n' +
  '(5 rows)';

/* ─────────────────────────── Câu 2 ─────────────────────────── */

const Q2_SOLUTION =
  'WITH order_total AS (\n' +
  '  SELECT oi.order_id, sum(oi.qty * p.price) AS total\n' +
  '  FROM order_item oi\n' +
  '  JOIN product p ON p.id = oi.product_id\n' +
  '  GROUP BY oi.order_id\n' +
  ')\n' +
  'SELECT c.name AS customer,\n' +
  '       count(o.id)                               AS orders,\n' +
  '       coalesce(sum(ot.total), 0)::numeric(12,2) AS revenue\n' +
  'FROM customer c\n' +
  "LEFT JOIN orders o       ON o.customer_id = c.id AND o.status = 'paid'\n" +
  'LEFT JOIN order_total ot ON ot.order_id = o.id\n' +
  'GROUP BY c.id, c.name\n' +
  'ORDER BY revenue DESC, c.name;\n';

const Q2_OUTPUT =
  ' customer | orders | revenue \n' +
  '----------+--------+---------\n' +
  ' Chi      |      1 | 2700.00\n' +
  ' An       |      2 | 2580.00\n' +
  ' Binh     |      1 |  700.00\n' +
  ' Dung     |      0 |    0.00\n' +
  ' Em       |      0 |    0.00\n' +
  '(5 rows)';

/* ─────────────────────────── Câu 3 ─────────────────────────── */

const Q3_SOLUTION =
  'WITH sold AS (\n' +
  '  SELECT p.category_id, p.id AS product_id, p.name,\n' +
  '         sum(oi.qty * p.price) AS revenue\n' +
  '  FROM order_item oi\n' +
  '  JOIN product p ON p.id = oi.product_id\n' +
  '  JOIN orders  o ON o.id = oi.order_id\n' +
  "  WHERE o.status = 'paid'\n" +
  '  GROUP BY p.category_id, p.id, p.name\n' +
  '), ranked AS (\n' +
  '  SELECT category_id, name, revenue,\n' +
  '         row_number() OVER (PARTITION BY category_id\n' +
  '                            ORDER BY revenue DESC, product_id) AS rn\n' +
  '  FROM sold\n' +
  ')\n' +
  'SELECT cat.name AS category, r.name AS product,\n' +
  '       r.revenue::numeric(12,2) AS revenue, r.rn\n' +
  'FROM ranked r\n' +
  'JOIN category cat ON cat.id = r.category_id\n' +
  'WHERE r.rn <= 2\n' +
  'ORDER BY cat.name, r.rn;\n';

const Q3_OUTPUT =
  '    category    | product  | revenue | rn \n' +
  '----------------+----------+---------+----\n' +
  ' Books          | SQL Book |   80.00 |  1\n' +
  ' Gaming laptops | Rig X    | 2000.00 |  1\n' +
  ' Laptops        | Laptop B | 1500.00 |  1\n' +
  ' Laptops        | Laptop A | 1000.00 |  2\n' +
  ' Phones         | Phone P  |  700.00 |  1\n' +
  ' Phones         | Phone Q  |  700.00 |  2\n' +
  '(6 rows)';

/* ─────────────────────────── Câu 4 ─────────────────────────── */

const Q4_SOLUTION =
  'WITH RECURSIVE tree AS (\n' +
  '  SELECT c.id, c.name, 1 AS depth,\n' +
  '         c.name::text AS path,\n' +
  '         ARRAY[c.id] AS seen\n' +
  '  FROM category c\n' +
  '  WHERE c.id IN (1, 7)\n' +
  '  UNION ALL\n' +
  '  SELECT c.id, c.name, t.depth + 1,\n' +
  "         t.path || ' > ' || c.name,\n" +
  '         t.seen || c.id\n' +
  '  FROM category c\n' +
  '  JOIN tree t ON c.parent_id = t.id\n' +
  '  WHERE t.depth < 10\n' +
  '    AND NOT (c.id = ANY (t.seen))\n' +
  ')\n' +
  'SELECT depth, path FROM tree ORDER BY path;\n';

const Q4_OUTPUT =
  ' depth |                 path                  \n' +
  '-------+---------------------------------------\n' +
  '     1 | All\n' +
  '     2 | All > Books\n' +
  '     2 | All > Tech\n' +
  '     3 | All > Tech > Laptops\n' +
  '     4 | All > Tech > Laptops > Gaming laptops\n' +
  '     3 | All > Tech > Phones\n' +
  '     1 | Promo\n' +
  '     2 | Promo > Promo A\n' +
  '     3 | Promo > Promo A > Promo B\n' +
  '(9 rows)';

/* ─────────────────────────── Câu 5 ─────────────────────────── */

const Q5_SOLUTION =
  '-- 5a\n' +
  'SELECT c.name AS customer,\n' +
  "       coalesce(c.props ->> 'tier', 'none')         AS tier,\n" +
  "       coalesce((c.props ->> 'credit')::numeric, 0) AS credit,\n" +
  "       jsonb_exists(c.props, 'credit')              AS has_credit\n" +
  'FROM customer c\n' +
  'ORDER BY credit DESC, c.name;\n' +
  '\n' +
  '-- 5b\n' +
  "SELECT coalesce(props ->> 'tier', 'none')                           AS tier,\n" +
  '       count(*)                                                     AS customers,\n' +
  "       count(*) FILTER (WHERE (props ->> 'credit')::numeric >= 500) AS rich,\n" +
  "       coalesce(sum((props ->> 'credit')::numeric), 0)              AS total_credit\n" +
  'FROM customer\n' +
  'GROUP BY 1\n' +
  'ORDER BY total_credit DESC, tier;\n';

const Q5_OUTPUT =
  ' customer |  tier  | credit | has_credit \n' +
  '----------+--------+--------+------------\n' +
  ' An       | gold   |   1500 | t\n' +
  ' Binh     | silver |    300 | t\n' +
  ' Chi      | gold   |     90 | t\n' +
  ' Dung     | silver |      0 | f\n' +
  ' Em       | none   |      0 | f\n' +
  '(5 rows)\n' +
  '\n' +
  '  tier  | customers | rich | total_credit \n' +
  '--------+-----------+------+--------------\n' +
  ' gold   |         2 |    1 |         1590\n' +
  ' silver |         2 |    0 |          300\n' +
  ' none   |         1 |    0 |            0\n' +
  '(3 rows)';

export default {
  course: { slug: 'postgresql' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — write the query, at the right grain',
        'Thi thực hành — viết truy vấn, ở đúng grain',
      ),
      description: B(
        'Five SQL questions on PostgreSQL, submitted as a .zip. Keeping rows through an OUTER JOIN and counting the right column, taming fan-out by pre-aggregating in a CTE, top-N per group with a window function and a deterministic tiebreaker, a recursive CTE that survives a cycle in the data, and pulling typed values out of jsonb — chapters 2, 4, 5, 6, 7, 8 and 13.',
        'Năm câu viết SQL trên PostgreSQL, nộp dưới dạng .zip. Giữ dòng qua OUTER JOIN và đếm đúng cột, thuần hoá fan-out bằng cách tổng hợp trước trong một CTE, top-N mỗi nhóm bằng hàm cửa sổ với cột phá hoà xác định, một CTE đệ quy sống sót qua chu trình trong dữ liệu, và rút giá trị đúng kiểu ra khỏi jsonb — các chương 2, 4, 5, 6, 7, 8 và 13.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · chương 5 + 6 ────────────────────────────────────── */
        codeQ({
          points: 1.5,
          language: 'sql',
          prompt: B(
            '<p><b>Q1 — Keep every customer (chapters 5 and 6).</b> For every customer, report their name, how many orders they have placed in total, and how many of those are <code>paid</code>. Columns must be named <code>customer</code>, <code>orders</code>, <code>paid_orders</code>, and the rows must come back ' + c('ORDER BY paid_orders DESC, customer') + '.</p>' +
            '<ul>' +
            '<li><b>Dung and Em have no orders at all</b> and must still appear, with <code>0</code> and <code>0</code>. That is what makes this an OUTER JOIN, and it is where two separate mistakes live: a plain <code>JOIN</code> drops them, and a <code>count(*)</code> counts the NULL-padded placeholder row and scores them <code>1</code>.</li>' +
            '<li><b>Binh has one paid order and one refunded one</b>, so the two counts must differ on his row. Do it in <b>one pass</b> — the natural tool is ' + c("count(...) FILTER (WHERE ...)") + ', not a second query or a self-join.</li>' +
            '<li>Putting ' + c("status = 'paid'") + ' in the <code>WHERE</code> clause silently turns the OUTER JOIN back into an INNER JOIN and loses Dung, Em and Binh\'s total.</li>' +
            '</ul>',

            '<p><b>Câu 1 — Giữ lại mọi khách hàng (chương 5 và 6).</b> Với mỗi khách hàng, hãy báo tên, tổng số đơn họ đã đặt, và trong đó bao nhiêu đơn ở trạng thái <code>paid</code>. Các cột phải đặt tên <code>customer</code>, <code>orders</code>, <code>paid_orders</code>, và kết quả phải trả về theo ' + c('ORDER BY paid_orders DESC, customer') + '.</p>' +
            '<ul>' +
            '<li><b>Dung và Em không có đơn nào</b> nhưng vẫn phải xuất hiện, với <code>0</code> và <code>0</code>. Đó là lý do câu này cần OUTER JOIN, và đó cũng là chỗ có hai lỗi khác nhau: một phép <code>JOIN</code> trần sẽ làm mất họ, còn <code>count(*)</code> sẽ đếm cả dòng đệm NULL và cho họ <code>1</code>.</li>' +
            '<li><b>Binh có một đơn paid và một đơn refunded</b>, nên hai con số phải khác nhau ở dòng của anh ấy. Hãy làm trong <b>một lượt</b> — công cụ tự nhiên là ' + c("count(...) FILTER (WHERE ...)") + ', không phải một truy vấn thứ hai hay một phép self-join.</li>' +
            '<li>Đặt ' + c("status = 'paid'") + ' vào mệnh đề <code>WHERE</code> sẽ âm thầm biến OUTER JOIN thành INNER JOIN và làm mất Dung, Em cùng tổng số đơn của Binh.</li>' +
            '</ul>',
          ),
          starterCode: starter(1, "customer, orders, paid_orders"),
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['outer',
              'Uses a <code>LEFT JOIN</code> from <code>customer</code> so Dung and Em survive, with no condition on <code>orders</code> in the <code>WHERE</code> clause.',
              'Dùng <code>LEFT JOIN</code> xuất phát từ <code>customer</code> để Dung và Em còn lại, và không có điều kiện nào về <code>orders</code> nằm trong mệnh đề <code>WHERE</code>.',
              0.5],
            ['countcol',
              'Counts a real child column (<code>count(o.id)</code>), not <code>count(*)</code>, so the customers with no orders score 0 rather than 1.',
              'Đếm một cột con thật (<code>count(o.id)</code>) chứ không phải <code>count(*)</code>, nhờ đó những khách không có đơn nào được 0 chứ không phải 1.',
              0.5],
            ['filter',
              'The paid count is computed in the same pass with <code>FILTER</code> (or an equivalent conditional aggregate), and Binh\'s two numbers differ correctly.',
              'Số đơn paid được tính trong cùng một lượt bằng <code>FILTER</code> (hoặc một hàm tổng hợp có điều kiện tương đương), và hai con số của Binh khác nhau đúng như phải thế.',
              0.5],
          ]),
        }),

        /* ── Q2 · chương 6.4 + 7.3 ────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'sql',
          prompt: B(
            '<p><b>Q2 — Revenue without fan-out (chapters 6 and 7).</b> For every customer, report the number of <b>paid</b> orders and the total value of those orders. An order\'s value is ' + c('sum(qty * price)') + ' over its items. Columns: <code>customer</code>, <code>orders</code>, <code>revenue</code>, ordered by ' + c('revenue DESC, customer') + '. <code>revenue</code> must print with two decimal places, and a customer with nothing paid must show <code>0.00</code>, not an empty cell.</p>' +
            '<ul>' +
            '<li>The obvious query — join <code>customer</code> to <code>orders</code> to <code>order_item</code> and aggregate — is <b>wrong</b>, and it is wrong in a way that still returns plausible numbers. An order with two items appears twice, so the order count inflates and any per-order value is added once per item.</li>' +
            '<li>Order 1 has two items and order 4 has two items, which is exactly what makes the shortcut visible: check <code>An</code> against <b>2 / 2580.00</b> and <code>Chi</code> against <b>1 / 2700.00</b>.</li>' +
            '<li>The fix is the one from lesson 7.3: <b>aggregate the many side first</b> in a CTE so there is exactly one row per order, then join to that.</li>' +
            '<li>Orders 3 and 5 are <code>refunded</code> and must not be counted. Keep that condition where it belongs so the customers with no paid orders still appear.</li>' +
            '</ul>',

            '<p><b>Câu 2 — Doanh thu mà không bị fan-out (chương 6 và 7).</b> Với mỗi khách hàng, hãy báo số đơn <b>paid</b> và tổng giá trị của những đơn đó. Giá trị một đơn là ' + c('sum(qty * price)') + ' trên các mặt hàng của nó. Các cột: <code>customer</code>, <code>orders</code>, <code>revenue</code>, sắp theo ' + c('revenue DESC, customer') + '. Cột <code>revenue</code> phải in với hai chữ số thập phân, và khách không có đơn paid nào phải hiện <code>0.00</code> chứ không phải ô trống.</p>' +
            '<ul>' +
            '<li>Truy vấn hiển nhiên — join <code>customer</code> với <code>orders</code> rồi với <code>order_item</code> và tổng hợp — là <b>sai</b>, và sai theo kiểu vẫn trả ra những con số nhìn rất hợp lý. Một đơn có hai mặt hàng sẽ xuất hiện hai lần, nên số đơn bị thổi phồng và mọi giá trị tính theo đơn bị cộng một lần cho mỗi mặt hàng.</li>' +
            '<li>Đơn 1 có hai mặt hàng và đơn 4 cũng có hai mặt hàng, đúng là thứ làm lối đi tắt lộ ra: hãy đối chiếu <code>An</code> với <b>2 / 2580.00</b> và <code>Chi</code> với <b>1 / 2700.00</b>.</li>' +
            '<li>Cách sửa chính là cách của bài 7.3: <b>tổng hợp phía "nhiều" trước</b> trong một CTE để mỗi đơn còn đúng một dòng, rồi mới join tới đó.</li>' +
            '<li>Đơn 3 và đơn 5 là <code>refunded</code> và không được tính. Hãy đặt điều kiện đó vào đúng chỗ của nó để những khách không có đơn paid nào vẫn xuất hiện.</li>' +
            '</ul>',
          ),
          starterCode: starter(2, "customer, orders, revenue"),
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['pregrain',
              'Aggregates <code>order_item</code> to one row per order (a CTE, a derived table or a correlated scalar subquery) <b>before</b> joining it to <code>orders</code>, so no order-level value is multiplied by its item count.',
              'Tổng hợp <code>order_item</code> về đúng một dòng mỗi đơn (bằng CTE, bảng dẫn xuất hoặc một truy vấn con vô hướng tương quan) <b>trước khi</b> join nó với <code>orders</code>, để không giá trị cấp đơn nào bị nhân với số mặt hàng.',
              0.7],
            ['numbers',
              'All five rows match, including the two that expose fan-out: An at 2 / 2580.00 and Chi at 1 / 2700.00.',
              'Cả năm dòng khớp, kể cả hai dòng làm lộ fan-out: An là 2 / 2580.00 và Chi là 1 / 2700.00.',
              0.5],
            ['status',
              'The <code>paid</code> filter is placed so that customers with no paid orders are still returned, rather than in a <code>WHERE</code> clause that collapses the outer join.',
              'Điều kiện lọc <code>paid</code> đặt ở chỗ sao cho những khách không có đơn paid nào vẫn được trả về, chứ không nằm trong <code>WHERE</code> làm sập outer join.',
              0.4],
            ['zero',
              'Empty revenue is coalesced to <code>0.00</code> with two decimals rather than left NULL — an aggregate over zero rows returns NULL, only <code>count</code> returns 0.',
              'Doanh thu rỗng được coalesce về <code>0.00</code> với hai chữ số thập phân chứ không để NULL — một hàm tổng hợp trên không dòng nào trả về NULL, chỉ <code>count</code> mới trả về 0.',
              0.4],
          ]),
        }),

        /* ── Q3 · chương 8 ────────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'sql',
          prompt: B(
            '<p><b>Q3 — Top two products per category (chapter 8).</b> Considering only <code>paid</code> orders, compute each product\'s revenue as ' + c('sum(qty * price)') + ', then return the <b>two highest-earning products in each category</b>. Columns: <code>category</code> (the category name), <code>product</code>, <code>revenue</code> (two decimals), <code>rn</code> — ordered by ' + c('category, rn') + '.</p>' +
            '<ul>' +
            '<li>A window function <b>cannot be filtered in the <code>WHERE</code> of the same <code>SELECT</code></b>: it is computed after <code>WHERE</code> runs. Compute the ranking in a CTE or subquery, then filter <code>rn &lt;= 2</code> outside it.</li>' +
            '<li><b>Phone P and Phone Q both earn exactly 700.00.</b> Pick the ranking function whose numbers are <b>distinct</b> — the expected output shows <code>1</code> then <code>2</code>, not <code>1</code> then <code>1</code> — and give the window a <b>deterministic tiebreaker</b> so the answer cannot change between runs. Break the tie by <code>product_id</code> ascending, which puts Phone P first.</li>' +
            '<li>Categories with no paid sales simply do not appear. Note that <code>Gaming laptops</code> is its own category, not part of <code>Laptops</code>.</li>' +
            '</ul>',

            '<p><b>Câu 3 — Hai sản phẩm dẫn đầu mỗi danh mục (chương 8).</b> Chỉ xét các đơn <code>paid</code>, hãy tính doanh thu mỗi sản phẩm bằng ' + c('sum(qty * price)') + ', rồi trả về <b>hai sản phẩm thu nhiều nhất trong mỗi danh mục</b>. Các cột: <code>category</code> (tên danh mục), <code>product</code>, <code>revenue</code> (hai chữ số thập phân), <code>rn</code> — sắp theo ' + c('category, rn') + '.</p>' +
            '<ul>' +
            '<li>Một hàm cửa sổ <b>không lọc được trong <code>WHERE</code> của chính câu <code>SELECT</code> đó</b>: nó được tính sau khi <code>WHERE</code> chạy xong. Hãy tính thứ hạng trong một CTE hoặc truy vấn con, rồi lọc <code>rn &lt;= 2</code> ở bên ngoài.</li>' +
            '<li><b>Phone P và Phone Q cùng thu đúng 700.00.</b> Hãy chọn hàm xếp hạng cho ra các số <b>phân biệt</b> — kết quả mong đợi hiện <code>1</code> rồi <code>2</code>, chứ không phải <code>1</code> rồi <code>1</code> — và cho cửa sổ một <b>cột phá hoà xác định</b> để câu trả lời không đổi giữa các lần chạy. Hãy phá hoà bằng <code>product_id</code> tăng dần, tức là Phone P đứng trước.</li>' +
            '<li>Danh mục không có đơn paid nào thì đơn giản là không xuất hiện. Lưu ý <code>Gaming laptops</code> là một danh mục riêng, không nằm trong <code>Laptops</code>.</li>' +
            '</ul>',
          ),
          starterCode: starter(3, "category, product, revenue, rn"),
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['ranking',
              'Uses <code>row_number()</code> (not <code>rank</code> or <code>dense_rank</code>) partitioned by category, so the tied 700.00 pair gets 1 and 2 rather than 1 and 1.',
              'Dùng <code>row_number()</code> (không phải <code>rank</code> hay <code>dense_rank</code>) phân vùng theo danh mục, nhờ đó cặp hoà 700.00 nhận 1 và 2 chứ không phải 1 và 1.',
              0.6],
            ['filterlayer',
              'The ranking is computed in a CTE or subquery and filtered in an outer query, not in the <code>WHERE</code> of the same <code>SELECT</code>.',
              'Thứ hạng được tính trong một CTE hoặc truy vấn con rồi lọc ở truy vấn ngoài, không lọc trong <code>WHERE</code> của chính câu <code>SELECT</code> ấy.',
              0.5],
            ['tiebreak',
              'The <code>OVER (... ORDER BY ...)</code> includes a unique tiebreaker so the result is reproducible; Phone P precedes Phone Q.',
              'Phần <code>OVER (... ORDER BY ...)</code> có một cột phá hoà duy nhất để kết quả tái lập được; Phone P đứng trước Phone Q.',
              0.5],
            ['scope',
              'Only <code>paid</code> orders contribute, revenue is <code>qty * price</code> summed per product, and all six expected rows match exactly.',
              'Chỉ các đơn <code>paid</code> được tính, doanh thu là <code>qty * price</code> cộng theo từng sản phẩm, và cả sáu dòng mong đợi khớp chính xác.',
              0.4],
          ]),
        }),

        /* ── Q4 · chương 7.4 ──────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'sql',
          prompt: B(
            '<p><b>Q4 — Walk a tree that contains a cycle (chapter 7).</b> Starting from categories <b>1</b> and <b>7</b>, walk downwards through <code>parent_id</code> and return every category reachable from either one, as <code>depth</code> (the starting rows are depth <code>1</code>) and <code>path</code> — the names from the start down to that node, joined with the three characters <code>&nbsp;&gt;&nbsp;</code> (space, greater-than, space). Order by <code>path</code>.</p>' +
            '<ul>' +
            '<li><b>The data contains a cycle</b>, put there by a bad import: category 7 points at 9, 9 points at 8, and 8 points back at 7. A recursive CTE has <b>no built-in recursion limit</b> — it stops only when the recursive term produces zero rows — so the naive query never terminates and consumes memory until the connection dies.</li>' +
            '<li>Use <b>both</b> guards the course asks for: carry the visited ids in an array and reject a node already in it, <em>and</em> cap the depth. With the cycle broken, the <code>Promo</code> branch stops at <code>Promo &gt; Promo A &gt; Promo B</code>.</li>' +
            '<li>Use <code>UNION ALL</code>, not <code>UNION</code>: plain <code>UNION</code> deduplicates on every pass, which is slower and is not what a tree walk wants. And remember that each pass sees only the rows the <em>previous</em> pass produced.</li>' +
            '<li>The anchor rows need an explicit ' + c('c.name::text') + ' so the recursive term, which appends to that column, agrees with it on type.</li>' +
            '</ul>',

            '<p><b>Câu 4 — Duyệt một cây có chu trình (chương 7).</b> Bắt đầu từ danh mục <b>1</b> và <b>7</b>, hãy đi xuống theo <code>parent_id</code> và trả về mọi danh mục tới được từ một trong hai, dưới dạng <code>depth</code> (các dòng khởi đầu có độ sâu <code>1</code>) và <code>path</code> — tên các nút từ điểm bắt đầu xuống tới nút đó, nối bằng ba ký tự <code>&nbsp;&gt;&nbsp;</code> (dấu cách, dấu lớn hơn, dấu cách). Sắp theo <code>path</code>.</p>' +
            '<ul>' +
            '<li><b>Dữ liệu có một chu trình</b>, do một lần nhập dữ liệu hỏng để lại: danh mục 7 trỏ tới 9, 9 trỏ tới 8, và 8 trỏ ngược về 7. Một CTE đệ quy <b>không có giới hạn đệ quy dựng sẵn nào</b> — nó chỉ dừng khi vế đệ quy sinh ra không dòng nào — nên truy vấn ngây thơ sẽ không bao giờ kết thúc và ngốn bộ nhớ cho tới khi kết nối chết.</li>' +
            '<li>Hãy dùng <b>cả hai</b> lớp chặn mà khoá học yêu cầu: mang theo mảng các id đã thăm rồi loại nút nào đã có trong đó, <em>và</em> chặn độ sâu. Khi chu trình bị cắt, nhánh <code>Promo</code> dừng ở <code>Promo &gt; Promo A &gt; Promo B</code>.</li>' +
            '<li>Dùng <code>UNION ALL</code>, không dùng <code>UNION</code>: <code>UNION</code> trần loại trùng ở mỗi lượt, chậm hơn và không phải thứ một phép duyệt cây cần. Và nhớ rằng mỗi lượt chỉ nhìn thấy các dòng mà lượt <em>trước</em> vừa sinh ra.</li>' +
            '<li>Các dòng khởi đầu cần một phép ' + c('c.name::text') + ' tường minh để vế đệ quy, vốn nối thêm vào cột đó, khớp kiểu với nó.</li>' +
            '</ul>',
          ),
          starterCode: starter(4, "depth, path"),
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['recursive',
              'A <code>WITH RECURSIVE</code> with an anchor selecting ids 1 and 7, joined to the recursive term with <code>UNION ALL</code>, walking downwards via <code>c.parent_id = t.id</code>.',
              'Một <code>WITH RECURSIVE</code> với vế khởi đầu chọn id 1 và 7, nối với vế đệ quy bằng <code>UNION ALL</code>, đi xuống qua <code>c.parent_id = t.id</code>.',
              0.5],
            ['cycleguard',
              'Carries the visited ids (an array or an equivalent) and excludes a node already visited, so the query terminates on the 7→9→8→7 cycle instead of running for ever.',
              'Mang theo các id đã thăm (bằng mảng hoặc cách tương đương) và loại nút đã thăm, nhờ đó truy vấn kết thúc trên chu trình 7→9→8→7 thay vì chạy mãi.',
              0.6],
            ['depthguard',
              'Also caps the depth, as the course asks — the second guard costs nothing and turns a runaway query into a truncated result you can notice.',
              'Đồng thời chặn cả độ sâu, đúng như khoá học yêu cầu — lớp chặn thứ hai chẳng tốn gì mà biến một truy vấn mất kiểm soát thành một kết quả bị cắt ngắn mà bạn nhận ra được.',
              0.5],
            ['path',
              'Depth starts at 1 and the path is built by appending with the exact three-character separator; all nine rows match, ordered by <code>path</code>.',
              'Độ sâu bắt đầu từ 1 và chuỗi path được dựng bằng cách nối thêm với đúng dải phân cách ba ký tự; cả chín dòng khớp, sắp theo <code>path</code>.',
              0.4],
          ]),
        }),

        /* ── Q5 · chương 2 + 6 + 13 ───────────────────────────────── */
        codeQ({
          points: 2.5,
          language: 'sql',
          prompt: B(
            '<p><b>Q5 — Typed values out of jsonb (chapters 2, 6 and 13).</b> <code>customer.props</code> is a <code>jsonb</code> column. Two customers are missing the <code>credit</code> key and one of them is missing <code>tier</code> as well. Write <b>two</b> queries in <code>Q5.sql</code>, in this order.</p>' +
            '<p><b>5a</b> — one row per customer: <code>customer</code>, <code>tier</code> (the string <code>none</code> when the key is absent), <code>credit</code> (numeric, <code>0</code> when absent), and <code>has_credit</code>, a boolean saying whether the key is present at all. Order by ' + c('credit DESC, customer') + '.</p>' +
            '<p><b>5b</b> — one row per tier: <code>tier</code>, <code>customers</code>, <code>rich</code> (how many have a credit of 500 or more), <code>total_credit</code>. Order by ' + c('total_credit DESC, tier') + '.</p>' +
            '<ul>' +
            '<li>Everything out of ' + c('->>') + ' is <b>text, including numbers</b>. Compare or sum without casting and <code>90</code> sorts after <code>1500</code>, silently. Cast at the boundary.</li>' +
            '<li><code>Dung</code> has a tier but no credit, and <code>Em</code> has neither. A missing key yields NULL, not an error — which is why <code>0</code> and <code>none</code> have to be supplied deliberately, and why the <code>none</code> row in 5b must show <code>0</code> rather than an empty cell.</li>' +
            '<li>Distinguish "absent" from "zero": <code>has_credit</code> must be <code>f</code> for Dung and Em even though their <code>credit</code> reads <code>0</code>. The operator for this is ' + c('?') + ', but in almost every driver <code>?</code> is the bind-parameter placeholder — use ' + c("jsonb_exists(props, 'credit')") + ' instead.</li>' +
            '<li>In 5b, <code>rich</code> must be computed in the same pass with <code>FILTER</code>, and a customer with no credit must not be counted as rich.</li>' +
            '</ul>',

            '<p><b>Câu 5 — Rút giá trị đúng kiểu ra khỏi jsonb (chương 2, 6 và 13).</b> <code>customer.props</code> là một cột <code>jsonb</code>. Hai khách hàng thiếu khoá <code>credit</code> và một trong hai người đó còn thiếu cả <code>tier</code>. Hãy viết <b>hai</b> truy vấn trong <code>Q5.sql</code>, theo thứ tự này.</p>' +
            '<p><b>5a</b> — mỗi khách một dòng: <code>customer</code>, <code>tier</code> (là chuỗi <code>none</code> khi khoá không có), <code>credit</code> (kiểu số, bằng <code>0</code> khi không có), và <code>has_credit</code>, một giá trị boolean cho biết khoá đó có tồn tại hay không. Sắp theo ' + c('credit DESC, customer') + '.</p>' +
            '<p><b>5b</b> — mỗi tier một dòng: <code>tier</code>, <code>customers</code>, <code>rich</code> (bao nhiêu người có credit từ 500 trở lên), <code>total_credit</code>. Sắp theo ' + c('total_credit DESC, tier') + '.</p>' +
            '<ul>' +
            '<li>Mọi thứ ra từ ' + c('->>') + ' đều là <b>văn bản, kể cả số</b>. So sánh hay cộng mà không ép kiểu thì <code>90</code> sẽ đứng sau <code>1500</code>, một cách lặng lẽ. Hãy ép kiểu ngay tại biên.</li>' +
            '<li><code>Dung</code> có tier nhưng không có credit, còn <code>Em</code> thì không có cả hai. Một khoá không tồn tại cho ra NULL chứ không báo lỗi — vì thế <code>0</code> và <code>none</code> phải do bạn chủ động đưa vào, và vì thế dòng <code>none</code> trong 5b phải hiện <code>0</code> chứ không phải ô trống.</li>' +
            '<li>Hãy phân biệt "không có" với "bằng không": <code>has_credit</code> phải là <code>f</code> với Dung và Em dù cột <code>credit</code> của họ hiện <code>0</code>. Toán tử cho việc này là ' + c('?') + ', nhưng trong hầu hết driver thì <code>?</code> là ký tự giữ chỗ tham số — hãy dùng ' + c("jsonb_exists(props, 'credit')") + ' thay thế.</li>' +
            '<li>Ở 5b, <code>rich</code> phải được tính trong cùng một lượt bằng <code>FILTER</code>, và một khách không có credit thì không được tính là rich.</li>' +
            '</ul>',
          ),
          starterCode: starter(5, "5a: customer, tier, credit, has_credit  |  5b: tier, customers, rich, total_credit"),
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['cast',
              'Extracts with <code>-&gt;&gt;</code> and casts to <code>numeric</code> before any comparison, sum or ordering, so 1500 / 300 / 90 sort numerically rather than as text.',
              'Rút bằng <code>-&gt;&gt;</code> rồi ép về <code>numeric</code> trước mọi phép so sánh, cộng hay sắp xếp, nhờ đó 1500 / 300 / 90 được sắp theo số chứ không theo chuỗi.',
              0.6],
            ['missing',
              'Missing keys are handled deliberately: <code>tier</code> falls back to <code>none</code> and <code>credit</code> to <code>0</code>, in both queries, including the <code>none</code> row of 5b showing <code>0</code>.',
              'Các khoá thiếu được xử lý có chủ ý: <code>tier</code> lùi về <code>none</code> và <code>credit</code> lùi về <code>0</code>, ở cả hai truy vấn, kể cả dòng <code>none</code> của 5b hiện <code>0</code>.',
              0.6],
            ['exists',
              '<code>has_credit</code> distinguishes an absent key from a zero value — <code>f</code> for Dung and Em — using an existence test rather than comparing the coalesced number to 0.',
              '<code>has_credit</code> phân biệt được khoá vắng mặt với giá trị bằng không — là <code>f</code> với Dung và Em — bằng một phép kiểm tồn tại chứ không phải so con số đã coalesce với 0.',
              0.6],
            ['grouped',
              'Query 5b groups by the same coalesced tier expression, computes <code>rich</code> with <code>FILTER</code> in one pass, and returns the three expected rows in the required order.',
              'Truy vấn 5b gom nhóm theo đúng biểu thức tier đã coalesce, tính <code>rich</code> bằng <code>FILTER</code> trong một lượt, và trả về ba dòng mong đợi theo đúng thứ tự yêu cầu.',
              0.7],
          ]),
        }),
      ],
    },
  ],
};
