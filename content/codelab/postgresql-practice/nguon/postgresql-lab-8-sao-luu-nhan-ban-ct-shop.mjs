/**
 * PostgreSQL · LAB 8 (sau Ch15) — CT Shop: sao lưu, khôi phục, tài khoản chỉ đọc, bản sao. Phần SQL của lab chạy THẬT trên
 * PGlite (role/GRANT/DEFAULT PRIVILEGES/has_table_privilege/SET ROLE đều có; mọi kiểm BEGIN…ROLLBACK nên role không rò):
 * R1 tài khoản chỉ đọc, R1 bẫy bảng do APP tạo, B2 trả lại đúng các dòng bị xoá nhầm từ bảng tạm khôi phục, B1 bẫy sequence
 * sau khi khôi phục --data-only. Phần docker/pg_dump/bản sao (B1, B3, N1, N2) là đề tay thứ hai của module.
 */
import { doiDau, KHOA, deLonPg, tay, CT_SHOP, sau, chan, duoc, ma, pre, tn, TN } from './_chung.mjs';

const R1 = `CREATE ROLE report_ro NOLOGIN;                                  -- a GROUP: holds the privileges
GRANT USAGE ON SCHEMA public TO report_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO report_ro;        -- the tables that exist NOW
CREATE ROLE ketoan LOGIN PASSWORD 'ketoan-lab8' IN ROLE report_ro;   -- a PERSON: logs in, inherits report_ro
ALTER ROLE ketoan SET default_transaction_read_only = on;
ALTER ROLE ketoan SET statement_timeout = '5s';`;
const NEN2 = `${CT_SHOP}
${R1}
CREATE TABLE coupon (code text PRIMARY KEY, percent int NOT NULL CHECK (percent BETWEEN 1 AND 50));   -- next week, by postgres
CREATE ROLE ctshop_app LOGIN PASSWORD 'app-lab8';                                                     -- the app's own account
GRANT USAGE, CREATE ON SCHEMA public TO ctshop_app;
SET ROLE ctshop_app;
CREATE TABLE flash_sale (product_id bigint PRIMARY KEY, price numeric(12,2) NOT NULL, ends_at timestamptz NOT NULL);   -- its migration
RESET ROLE;`;
const R1B = `GRANT SELECT ON coupon, flash_sale TO report_ro;                                   -- the two that already exist
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO report_ro;       -- future tables created by postgres
ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_app IN SCHEMA public GRANT SELECT ON TABLES TO report_ro;   -- … and by the app`;
const NEN3 = `${CT_SHOP}
INSERT INTO review (id, product_id, customer_id, rating, body, created_at) OVERRIDING SYSTEM VALUE VALUES
  (9, 25, 3, 4, 'Gáy chắc, giấy đẹp', '2026-10-10 08:00+07'), (10, 25, 4, 5, 'Mua lần hai', '2026-10-11 09:00+07'),
  (11, 30, 1, 5, 'Sang trọng', '2026-10-12 10:00+07'), (12, 30, 6, 4, 'Hơi đắt nhưng đáng', '2026-10-12 11:00+07'),
  (13, 1, 3, 1, 'SPAM: mua follow giá rẻ tại …', '2026-10-25 23:00+07');
SELECT setval(pg_get_serial_sequence('review', 'id'), 13);
-- 02:00 last night's dump; its review rows were loaded into a staging table (pg_restore --data-only -t review -f - | sed …)
CREATE TABLE review_restore (LIKE review);
INSERT INTO review_restore SELECT * FROM review;
-- 09:00 a moderator deletes the spam review — ON PURPOSE
DELETE FROM review WHERE id = 13;
-- 10:05 a clean-up script with the wrong filter deletes every review of category 9 (Sổ tay)
DELETE FROM review WHERE product_id IN (SELECT id FROM product WHERE category_id = 9);
-- 10:20 customers keep writing reviews — they must survive the repair
INSERT INTO review (product_id, customer_id, rating, body, created_at) VALUES
  (1, 2, 5, 'Mới: viết rất êm', '2026-10-26 10:20+07'), (25, 5, 4, 'Mới: sổ đẹp', '2026-10-26 10:21+07');`;
const B2 = `INSERT INTO review OVERRIDING SYSTEM VALUE              -- keep the ORIGINAL ids
SELECT r.* FROM review_restore r
WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id)                 -- missing now …
  AND r.product_id IN (SELECT id FROM product WHERE category_id = 9);       -- … AND hit by the incident (not the spam)`;
const NEN4 = `${CT_SHOP}
-- the same data, restored with pg_restore --data-only into a freshly created schema: every identity starts again at 1
SELECT setval(pg_get_serial_sequence(t, 'id'), 1, false)
FROM unnest(ARRAY['category', 'product', 'customer', 'orders', 'payment', 'stock_movement', 'review']) AS t;`;
const B1_DON = ['category', 'product', 'customer', 'orders', 'payment', 'stock_movement', 'review']
  .map((t) => `SELECT setval(pg_get_serial_sequence('${t}', 'id'), (SELECT max(id) FROM ${t}));`).join('\n');

const QUYEN = "SELECT c.relname, has_table_privilege('ketoan', c.oid, 'SELECT') AS sel, has_table_privilege('ketoan', c.oid, 'INSERT') AS ins, has_table_privilege('ketoan', c.oid, 'UPDATE') AS upd, has_table_privilege('ketoan', c.oid, 'DELETE') AS del, has_table_privilege('ketoan', c.oid, 'TRUNCATE') AS trunc FROM pg_class c WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r' ORDER BY c.relname";
const VAI = "SELECT r.rolname, r.rolcanlogin, (SELECT array_agg(x ORDER BY x) FROM unnest(s.setconfig) x)::text AS settings, pg_has_role('ketoan', r.oid, 'MEMBER') AS ketoan_is_member FROM pg_roles r LEFT JOIN pg_db_role_setting s ON s.setrole = r.oid WHERE r.rolname IN ('ketoan', 'report_ro') ORDER BY r.rolname";
const SEQ = "SELECT sequencename, last_value FROM pg_sequences WHERE schemaname = 'public' ORDER BY sequencename";

const TAY = `# lab8-docker.sh up · then, from lab8-solution.sh, run the parts in order:
# B1  pg_dump -Fc + pg_dumpall --globals-only, restore on the blank second server — first WITHOUT the globals (trap),
#     then with them; compare both servers with lab8-check.sql and diff
# B3  lab8-backup-naive.sh vs lab8-backup.sh: stop the server, run both, look at exit codes and file sizes,
#     DB=ctshopp (typo), a truncated .gz (gzip -t)
# N1  bash lab8-docker.sh replica  → pg_basebackup -R -X stream -S, pg_is_in_recovery(), a row crosses, writes refused
# N2  node lab8-ryw.mjs 500 (with and without pgbench load): read-your-writes on the replica vs waiting for the LSN
#     stop the replica and watch the slot retain WAL; then fail over by hand with pg_promote()
bash lab8-docker.sh up
docker cp lab8-start.sql pglab8-primary:/tmp/ && docker exec -it pglab8-primary psql -U postgres -d ctshop -f /tmp/lab8-start.sql`;

export default doiDau({
  slug: 'postgresql-lab-8-sao-luu-nhan-ban-ct-shop',
  ten: '15.5 Lab 8 — CT Shop: backups, restores, a read-only account and a replica',
  khoa: KHOA,
  baiHoc: 'postgresql-lab-8-sao-luu-nhan-ban-ct-shop',
  de: [
    deLonPg({
      dangBai: 'lab',
      tieuDe: { en: 'Lab 8 (SQL part) — CT Shop: a read-only account, and repairs after a restore', vi: 'Lab 8 (phần SQL) — CT Shop: tài khoản chỉ đọc, và sửa chữa sau khi khôi phục' },
      doKho: 'HARD', phut: 80, diem: 100,
      khaiNiem: ['group role + login role', 'ALTER ROLE … SET', 'ALTER DEFAULT PRIVILEGES [FOR ROLE]', 'OVERRIDING SYSTEM VALUE', 'identity sequences after a data-only restore'],
      tienQuyet: ['15.1–15.3 of this track'],
      the: ['postgresql', 'lab', 'roles', 'backup', 'restore', 'ctshop'],
      csdl: CT_SHOP, tenCsdl: 'ctshop',
      thuMuc: 'RollNo_Name_PG_Lab8',
      phu: { en: 'PostgreSQL course · after Chapter 15 · Suggested time: 80 minutes · 10 marks (2 + 2 + 3 + 3)', vi: 'Khoá PostgreSQL · sau Chương 15 · Thời gian gợi ý: 80 phút · 10 điểm (2 + 2 + 3 + 3)' },
      moTa: {
        en: '<p>The SQL half of Lab 8, graded in the browser: R1 (a read-only account for accounting, and the trap of tables created by the application) and the repairs a real restore needs (B2: bring back exactly the rows deleted by mistake; B1: identity sequences after a data-only restore). The parts that need two servers, pg_dump and Docker (B1 restore, B3 backup script, N1 replica, N2 read-your-writes and failover) are the second exercise of this module, run on your machine.</p>',
        vi: '<p>Nửa SQL của Lab 8, chấm trong trình duyệt: R1 (tài khoản chỉ đọc cho kế toán, và cái bẫy của bảng do ứng dụng tạo) và các sửa chữa mà một lần khôi phục thật cần (B2: trả lại đúng các dòng bị xoá nhầm; B1: sequence identity sau khi khôi phục chỉ dữ liệu). Các phần cần hai máy chủ, pg_dump và Docker (B1 khôi phục, B3 script sao lưu, N1 bản sao, N2 đọc-thấy-mình-ghi và chuyển dự phòng) là đề thứ hai của module này, chạy trên máy bạn.</p>',
      },
      yeuCauChung: [
        { en: 'Schema public stands for the lab\'s schema shop. Exact role names: report_ro, ketoan, ctshop_app.', vi: 'Schema public thay cho schema shop của lab. Đúng tên role: report_ro, ketoan, ctshop_app.' },
        { en: 'Roles are cluster-wide on a real server; here every check runs in a transaction that is rolled back.', vi: 'Trên máy chủ thật role là của cả cluster; ở đây mỗi kiểm chạy trong một giao dịch rồi bị huỷ.' },
      ],
      moHinh: [
        { ten: 'roles', truong: [['report_ro', 'NOLOGIN', 'group: holds SELECT'], ['ketoan', 'LOGIN', 'member of report_ro, read-only by default, 5 s timeout'], ['ctshop_app', 'LOGIN', 'the application (Q2): owns the tables its migrations create']] },
        { ten: 'review / review_restore (Q3)', truong: [['review.id', 'identity ALWAYS', 'original ids must come back'], ['review_restore', 'LIKE review', 'last night\'s rows, staged']] },
      ],
      cau: [
        {
          ten: { en: 'R1 · a read-only account for accounting', vi: 'R1 · tài khoản chỉ đọc cho kế toán' }, diem: 2,
          moTa: { en: 'Create the group <code>report_ro</code> (NOLOGIN) with USAGE on schema public and SELECT on every existing table, and the person <code>ketoan</code> (LOGIN, password <code>ketoan-lab8</code>, member of report_ro) whose sessions default to <code>default_transaction_read_only = on</code> and <code>statement_timeout = \'5s\'</code>.', vi: 'Tạo nhóm <code>report_ro</code> (NOLOGIN) có USAGE trên schema public và SELECT trên mọi bảng hiện có, và người <code>ketoan</code> (LOGIN, mật khẩu <code>ketoan-lab8</code>, thành viên của report_ro) có phiên mặc định <code>default_transaction_read_only = on</code> và <code>statement_timeout = \'5s\'</code>.' },
          yeuCau: [{ en: 'Privileges go to the group, the person only inherits — the next accountant is one CREATE ROLE … IN ROLE report_ro.', vi: 'Quyền gán cho nhóm, người chỉ thừa hưởng — kế toán tiếp theo chỉ cần một CREATE ROLE … IN ROLE report_ro.' }],
          giai: R1,
          kiem: [
            sau(['R1 · what ketoan may do on each table', 'R1 · ketoan được làm gì trên từng bảng'], QUYEN, { thuTu: true }),
            sau(['R1 · the two roles and their settings', 'R1 · hai role và thiết lập của chúng'], VAI, { thuTu: true }),
            chan(['R1 · ketoan cannot write', 'R1 · ketoan không ghi được'], 'SET ROLE ketoan; INSERT INTO orders (customer_id) VALUES (1)', '42501'),
            sau(['R1 · ketoan can read the revenue', 'R1 · ketoan đọc được doanh thu'], 'SET ROLE ketoan; SELECT count(*) AS payments, sum(amount) AS revenue FROM payment', { an: true }),
          ],
          saiMau: [
            R1.replace('GRANT SELECT ON ALL TABLES IN SCHEMA public TO report_ro;', 'GRANT ALL ON ALL TABLES IN SCHEMA public TO report_ro;'),
            R1.replace(" IN ROLE report_ro;", ';'),
            R1.replace("ALTER ROLE ketoan SET default_transaction_read_only = on;\n", ''),
          ],
        },
        {
          ten: { en: 'R1 · the tables nobody granted: future ones, and the app\'s', vi: 'R1 · những bảng chưa ai cấp quyền: bảng tương lai, và bảng của app' }, diem: 2,
          moTa: { en: 'R1 is loaded. Since then postgres created <code>coupon</code> and the application role <code>ctshop_app</code> created <code>flash_sale</code> — ketoan can read neither. Fix both, and make sure every table created <b>from now on</b>, by postgres <b>or by ctshop_app</b>, is readable by report_ro without anyone remembering.', vi: 'R1 đã nạp. Từ đó postgres tạo <code>coupon</code> và role ứng dụng <code>ctshop_app</code> tạo <code>flash_sale</code> — ketoan không đọc được bảng nào. Sửa cả hai, và đảm bảo mọi bảng tạo <b>từ nay về sau</b>, bởi postgres <b>hoặc bởi ctshop_app</b>, report_ro đều đọc được mà không cần ai nhớ.' },
          yeuCau: [{ en: 'ALTER DEFAULT PRIVILEGES applies to tables created by ONE role — the current one, or the one named with FOR ROLE.', vi: 'ALTER DEFAULT PRIVILEGES áp cho bảng do MỘT role tạo — role hiện tại, hoặc role ghi trong FOR ROLE.' }],
          giai: R1B,
          kiem: [
            { ...sau(['R1 · coupon and flash_sale readable now', 'R1 · coupon và flash_sale đọc được ngay'], "SELECT has_table_privilege('ketoan', 'coupon', 'SELECT') AS coupon, has_table_privilege('ketoan', 'flash_sale', 'SELECT') AS flash_sale"), csdl: NEN2 },
            { ...sau(['R1 · a table postgres creates next month', 'R1 · bảng postgres tạo tháng sau'], "CREATE TABLE gift_card (code text PRIMARY KEY, balance numeric(12,2) NOT NULL); SELECT has_table_privilege('ketoan', 'gift_card', 'SELECT') AS gift_card"), csdl: NEN2 },
            { ...sau(['R1 · a table the app\'s next migration creates', 'R1 · bảng mà migration kế tiếp của app tạo'], "SET ROLE ctshop_app; CREATE TABLE promo (code text PRIMARY KEY); RESET ROLE; SELECT has_table_privilege('ketoan', 'promo', 'SELECT') AS promo, has_table_privilege('ketoan', 'promo', 'INSERT') AS promo_insert"), csdl: NEN2 },
          ],
          saiMau: [
            "GRANT SELECT ON coupon, flash_sale TO report_ro; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO report_ro;",
            "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO report_ro; ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_app IN SCHEMA public GRANT SELECT ON TABLES TO report_ro;",
            "GRANT SELECT ON ALL TABLES IN SCHEMA public TO report_ro;",
          ],
        },
        {
          ten: { en: 'B2 · bring back exactly the rows deleted by mistake', vi: 'B2 · trả lại đúng những dòng bị xoá nhầm' }, diem: 3,
          moTa: { en: 'At 10:05 a clean-up script deleted every review of category 9. Last night\'s rows are staged in <code>review_restore</code>. Put back the reviews that are missing now <b>and</b> belong to a category-9 product, with their <b>original ids</b>. Do not resurrect the spam review the moderator deleted on purpose at 09:00, and keep the two reviews written at 10:20.', vi: 'Lúc 10:05 một script dọn dẹp xoá mọi đánh giá của danh mục 9. Các dòng của đêm qua nằm trong bảng tạm <code>review_restore</code>. Trả lại các đánh giá đang thiếu <b>và</b> thuộc sản phẩm danh mục 9, giữ <b>id gốc</b>. Đừng làm sống lại đánh giá spam mà người kiểm duyệt cố ý xoá lúc 09:00, và giữ hai đánh giá viết lúc 10:20.' },
          yeuCau: [{ en: '<code>INSERT INTO review OVERRIDING SYSTEM VALUE SELECT … FROM review_restore WHERE NOT EXISTS (…) AND product_id IN (…)</code>.', vi: '<code>INSERT INTO review OVERRIDING SYSTEM VALUE SELECT … FROM review_restore WHERE NOT EXISTS (…) AND product_id IN (…)</code>.' }],
          giai: B2,
          kiem: [
            { ...sau(['B2 · the review table after the repair', 'B2 · bảng review sau khi sửa'], 'SELECT id, product_id, customer_id, body FROM review ORDER BY id', { thuTu: true }), csdl: NEN3 },
            { ...sau(['B2 · nothing lost, nothing resurrected', 'B2 · không mất gì, không sống lại gì'], "SELECT count(*) AS reviews, count(*) FILTER (WHERE body LIKE 'Mới:%') AS new_kept, count(*) FILTER (WHERE body LIKE 'SPAM%') AS spam FROM review"), csdl: NEN3 },
            { ...ma(['B2 · keeps the original ids', 'B2 · giữ id gốc'], 'OVERRIDING\\s+SYSTEM\\s+VALUE') },
          ],
          saiMau: [
            'INSERT INTO review OVERRIDING SYSTEM VALUE SELECT r.* FROM review_restore r WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id)',
            'INSERT INTO review (product_id, customer_id, rating, body, created_at) SELECT r.product_id, r.customer_id, r.rating, r.body, r.created_at FROM review_restore r WHERE NOT EXISTS (SELECT 1 FROM review x WHERE x.id = r.id) AND r.product_id IN (SELECT id FROM product WHERE category_id = 9)',
          ],
        },
        {
          ten: { en: 'B1 · the sequence trap after a data-only restore', vi: 'B1 · bẫy sequence sau khi khôi phục chỉ dữ liệu' }, diem: 3,
          moTa: { en: 'The shop was restored with <code>pg_restore --data-only</code> into freshly created tables: the rows are all there, but every identity sequence starts again at 1, so the next order would get id 1 — a duplicate key. Move the sequence of each of the seven tables with an <code>id</code> column (category, product, customer, orders, payment, stock_movement, review) to that table\'s <code>max(id)</code>.', vi: 'Cửa hàng được khôi phục bằng <code>pg_restore --data-only</code> vào các bảng vừa tạo: đủ mọi dòng, nhưng mọi sequence identity bắt đầu lại từ 1, nên đơn kế tiếp sẽ nhận id 1 — trùng khoá. Đưa sequence của từng bảng trong bảy bảng có cột <code>id</code> (category, product, customer, orders, payment, stock_movement, review) tới <code>max(id)</code> của bảng đó.' },
          yeuCau: [{ en: '<code>SELECT setval(pg_get_serial_sequence(\'orders\', \'id\'), (SELECT max(id) FROM orders));</code> — seven times, or one query over the list.', vi: '<code>SELECT setval(pg_get_serial_sequence(\'orders\', \'id\'), (SELECT max(id) FROM orders));</code> — bảy lần, hoặc một truy vấn trên danh sách.' }],
          giai: B1_DON,
          kiem: [
            { ...sau(['B1 · every sequence at max(id)', 'B1 · mọi sequence ở max(id)'], SEQ, { thuTu: true }), csdl: NEN4 },
            { ...duoc(['B1 · a new order, payment and product insert without a duplicate key', 'B1 · đơn, thanh toán và sản phẩm mới chèn được không trùng khoá'], "INSERT INTO orders (customer_id) VALUES (8); INSERT INTO payment (order_id, amount, method) VALUES (currval(pg_get_serial_sequence('orders', 'id')), 1000, 'cod'); INSERT INTO product (sku, name, category_id, price) VALUES ('CT0999', 'Thử', 5, 1000)"), csdl: NEN4 },
            { ...sau(['B1 · the next ids handed out', 'B1 · các id kế tiếp được cấp'], "SELECT nextval(pg_get_serial_sequence('orders', 'id')) AS next_order, nextval(pg_get_serial_sequence('product', 'id')) AS next_product, nextval(pg_get_serial_sequence('review', 'id')) AS next_review"), csdl: NEN4, an: true },
          ],
          saiMau: [
            ['category', 'product', 'customer', 'orders', 'payment', 'stock_movement', 'review'].map((t) => `SELECT setval(pg_get_serial_sequence('${t}', 'id'), (SELECT count(*) FROM ${t}));`).join('\n'),
            "SELECT setval(pg_get_serial_sequence('orders', 'id'), (SELECT max(id) FROM orders));",
          ],
        },
      ],
      truDiem: [
        { en: 'GRANT ALL "to be safe" on a reporting account.', vi: 'GRANT ALL "cho chắc" cho tài khoản báo cáo.' },
        { en: 'Restoring a whole table over live data instead of the missing rows only.', vi: 'Khôi phục cả bảng đè lên dữ liệu đang sống thay vì chỉ các dòng thiếu.' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q4.sql (R1, R1 default privileges, B2, B1 sequences). <b>Run</b> = sample checks; <b>Submit</b> = every check and the 10-mark table. Then do the second exercise of this module on your machine.',
        vi: 'Các tab Q1.sql … Q4.sql (R1, R1 quyền mặc định, B2, B1 sequence). <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm và bảng điểm thang 10. Rồi làm đề thứ hai của module trên máy bạn.',
      },
      thuatNgu: [tn('role', 'vai trò'), tn('default privileges', 'quyền mặc định cho bảng tương lai'), tn('OVERRIDING SYSTEM VALUE', 'ghi đè giá trị identity'), TN.identity],
      goiY: [
        { en: 'R1: default_transaction_read_only is a DEFAULT — the user can turn it off; the GRANTs are the wall.', vi: 'R1: default_transaction_read_only là MẶC ĐỊNH — người dùng tắt được; GRANT mới là bức tường.' },
        { en: 'B2: two conditions — missing now AND in category 9.', vi: 'B2: hai điều kiện — đang thiếu VÀ thuộc danh mục 9.' },
        { en: 'B1: count(*) is not max(id) when ids have gaps.', vi: 'B1: count(*) không phải max(id) khi id có lỗ hổng.' },
      ],
      loiHayGap: [
        { en: 'R1 ALTER DEFAULT PRIVILEGES without FOR ROLE ctshop_app — the app\'s next table is invisible to accounting again.', vi: 'R1 ALTER DEFAULT PRIVILEGES thiếu FOR ROLE ctshop_app — bảng kế tiếp của app lại vô hình với kế toán.' },
        { en: 'B2 restoring every missing row — the spam comes back.', vi: 'B2 khôi phục mọi dòng thiếu — spam quay lại.' },
        { en: 'B2 letting identity hand out new ids — links and other tables that pointed to the old ids break.', vi: 'B2 để identity cấp id mới — liên kết và các bảng khác trỏ vào id cũ bị gãy.' },
      ],
      giaiThich: { en: '<p>Reference solutions follow R1 and B2 of <code>lab8-solution.sh</code> (schema shop → public), plus the sequence step every data-only restore needs (lab8-check.sql compares sequences for exactly this reason).</p>', vi: '<p>Lời giải chuẩn theo R1 và B2 của <code>lab8-solution.sh</code> (schema shop → public), cộng bước sequence mà mọi lần khôi phục chỉ dữ liệu đều cần (lab8-check.sql so cả sequence vì đúng lý do này).</p>' },
    }),

    tay({
      t: 'Lab 8 (servers part) — back up, prove the restore, build a replica, fail over', k: 'HARD', p: 120, kn: ['pg_dump + pg_dumpall --globals-only', 'a backup script that cannot lie', 'streaming replica', 'read-your-writes', 'pg_promote'], tag: ['lab', 'backup', 'replication', 'docker'],
      en: `<p>The parts of Lab 8 that need two real servers. Download the lab files from lesson 15.5 (lab8-docker.sh, lab8-start.sql, lab8-check.sql, lab8-backup-naive.sh, lab8-backup.sh, lab8-ryw.mjs, lab8-orders.pgbench, lab8-solution.sh) and follow lab8-solution.sh section by section:</p>${pre(TAY)}`,
      vi: `<p>Các phần của Lab 8 cần hai máy chủ thật. Tải các tệp lab ở bài 15.5 (lab8-docker.sh, lab8-start.sql, lab8-check.sql, lab8-backup-naive.sh, lab8-backup.sh, lab8-ryw.mjs, lab8-orders.pgbench, lab8-solution.sh) và làm theo lab8-solution.sh từng phần:</p>${pre(TAY)}`,
      yc: [
        ['B1: the restore WITHOUT globals fails on role "report_ro" does not exist; with globals, diff of lab8-check.sql on both servers is empty.', 'B1: khôi phục THIẾU globals hỏng ở role "report_ro" does not exist; có globals thì diff lab8-check.sql của hai máy rỗng.'],
        ['B3: the naive script writes tiny "successful" files while the server is down; lab8-backup.sh exits non-zero and leaves nothing behind.', 'B3: script ngây thơ ghi các tệp tí hon "thành công" khi máy chủ tắt; lab8-backup.sh thoát mã khác 0 và không để lại gì.'],
        ['N1/N2: pg_is_in_recovery() = t on the replica; lab8-ryw.mjs shows reads on the replica missing fresh orders, 0 missing when waiting for the LSN or reading from the primary; pg_promote() makes the replica writable.', 'N1/N2: pg_is_in_recovery() = t trên bản sao; lab8-ryw.mjs cho thấy đọc trên bản sao sót đơn mới, 0 sót khi đợi LSN hoặc đọc từ primary; pg_promote() làm bản sao ghi được.'],
      ],
      lenh: 'bash lab8-docker.sh up   # then lab8-solution.sh, part by part; bash lab8-docker.sh down at the end',
      lyDo: ['It needs two PostgreSQL servers, pg_dump/pg_restore, shell scripts and Node.js; the browser grader is a single in-page session.', 'Bài cần hai máy chủ PostgreSQL, pg_dump/pg_restore, script shell và Node.js; máy chấm trình duyệt chỉ là một phiên trong trang.'],
      tep: { 'NOTES.md': '# Lab 8 — servers part\n\nRecord, for each section, the command and the line of output that proves it.\n\n## B1\n\n## B3\n\n## N1\n\n## N2\n' },
      giaiTep: { 'NOTES.md': `# Lab 8 — servers part (expected, PostgreSQL 17.11)

## B1
- ctshop.dump 98 KB + globals.sql; restore without globals → "role \\"report_ro\\" does not exist" (27 errors), acl lines differ in the diff
- with globals first → diff check-primary.txt check-replica.txt → identical

## B3
- naive script with the server stopped: exit code 0, three ~20-byte .sql.gz files (gzip of an empty dump)
- lab8-backup.sh: exit code 1, no file left; DB=ctshopp → exit 1; gzip -t on the truncated copy → "unexpected end of file"

## N1
- pg_is_in_recovery() → t · the row inserted on the primary appears on the replica · INSERT on the replica → read-only error

## N2
- idle: ~121/500 orders not found when reading the replica right after COMMIT; 0/500 when waiting for the commit LSN; 0/500 from the primary
- replica stopped → pg_replication_slots.active = f and retained WAL grows · pg_promote() → writable in ~3 s, timeline 2
` },
      viDu: [{ input: ['diff check-primary.txt check-replica.txt', 'diff check-primary.txt check-replica.txt'], output: ['(empty) ✓ identical', '(rỗng) ✓ giống hệt'], explanation: ['Rows, sequences, privileges and roles all match.', 'Dòng, sequence, quyền và role đều khớp.'] }],
      gy: [['pg_dump does not include roles: pg_dumpall --globals-only does.', 'pg_dump không chứa role: pg_dumpall --globals-only mới có.'], ['A backup script must fail loudly: set -euo pipefail, check the size, test the archive.', 'Script sao lưu phải hỏng ầm ĩ: set -euo pipefail, kiểm cỡ, thử giải nén.']],
      lhg: [['Comparing the restore by eye instead of with lab8-check.sql + diff.', 'So bản khôi phục bằng mắt thay vì bằng lab8-check.sql + diff.'], ['Forgetting the slot of the stopped replica — the primary keeps WAL until the disk is full.', 'Quên khe của bản sao đã dừng — primary giữ WAL tới khi đầy đĩa.']],
      gt: ['<p>Together with the SQL part this is the whole lab: a backup you have restored and reconciled, a script that cannot report success while failing, and a replica whose limits you have measured.</p>', '<p>Cùng với phần SQL, đây là trọn bài lab: một bản sao lưu đã khôi phục và đối soát, một script không thể báo thành công khi đang hỏng, và một bản sao mà bạn đã đo giới hạn của nó.</p>'],
      tn: [tn('pg_dumpall --globals-only', 'sao lưu role và tablespace')],
    }),
  ],
});
