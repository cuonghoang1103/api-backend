/**
 * PostgreSQL · LAB 9 (capstone, sau Ch16) — Node + Prisma trên CT Shop. Phần ỨNG DỤNG (db pull/baseline, endpoint, pool,
 * kiểm thử, cuộc đua hai người mua) cần Node + máy chủ thật ⇒ đề tay. Phần SQL của các bước chấm được THẬT trên PGlite:
 * C1 hai tài khoản (owner/app, quyền mặc định FOR ROLE, timeout trên role), C4 expand (cột mới + trigger đồng bộ hai chiều +
 * backfill), C7a báo cáo doanh thu theo tháng giờ Việt Nam (bẫy múi giờ UTC của Prisma), C7b chỉ mục "Đơn của tôi" không Sort.
 */
import { doiDau, KHOA, deLonPg, tay, CT_SHOP, PLAN_ALL, sau, chan, ma, kq, pre, tn, TN } from './_chung.mjs';

const C1 = `-- 1 · the owner: owns the schema and every table; prisma migrate deploy logs in as this role
CREATE ROLE ctshop_owner LOGIN PASSWORD 'owner-lab9';
ALTER SCHEMA public OWNER TO ctshop_owner;
DO $$
DECLARE t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I OWNER TO ctshop_owner', t.tablename);   -- identity sequences follow their table
  END LOOP;
END $$;

-- 2 · the app: rows only (no CREATE, ALTER, DROP, TRUNCATE)
CREATE ROLE ctshop_app LOGIN PASSWORD 'app-lab9';
GRANT USAGE ON SCHEMA public TO ctshop_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ctshop_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ctshop_app;

-- 3 · tables that FUTURE migrations create (as ctshop_owner) get the same grants
ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ctshop_app;
ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ctshop_app;

-- 4 · timeouts ON THE ROLES
ALTER ROLE ctshop_app SET statement_timeout = '5s';
ALTER ROLE ctshop_app SET idle_in_transaction_session_timeout = '10s';
ALTER ROLE ctshop_app SET lock_timeout = '3s';
ALTER ROLE ctshop_owner SET lock_timeout = '5s';
ALTER ROLE ctshop_owner SET statement_timeout = 0;`;

const C4 = `SET LOCAL lock_timeout = '3s';   -- ADD COLUMN needs a brief ACCESS EXCLUSIVE lock: fail fast

ALTER TABLE orders ADD COLUMN delivery_note text;

-- while v1 (note) and v2 (delivery_note) run side by side, every write to one column is copied to the other
CREATE FUNCTION orders_sync_note() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.delivery_note := coalesce(NEW.delivery_note, NEW.note);
    NEW.note          := coalesce(NEW.note, NEW.delivery_note);
  ELSIF NEW.note IS DISTINCT FROM OLD.note AND NEW.delivery_note IS NOT DISTINCT FROM OLD.delivery_note THEN
    NEW.delivery_note := NEW.note;            -- written by v1
  ELSIF NEW.delivery_note IS DISTINCT FROM OLD.delivery_note AND NEW.note IS NOT DISTINCT FROM OLD.note THEN
    NEW.note := NEW.delivery_note;            -- written by v2
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER orders_sync_note BEFORE INSERT OR UPDATE OF note, delivery_note ON orders
  FOR EACH ROW EXECUTE FUNCTION orders_sync_note();

-- back-fill the rows that already exist (in batches when there are millions)
UPDATE orders SET delivery_note = note WHERE note IS NOT NULL AND delivery_note IS NULL;`;
const NEN_C4 = `${CT_SHOP}
UPDATE orders SET note = 'Giao giờ hành chính' WHERE id IN (2, 9);
UPDATE orders SET note = 'Gọi trước 15 phút' WHERE id = 5;`;

const C7A = `WITH m AS (
  SELECT date_trunc('month', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh') AS thang,   -- the month in VIETNAM time
         count(*) AS so_don, sum(amount) AS doanh_thu
  FROM payment
  WHERE paid_at >= timestamptz '2026-08-01 00:00+07' AND paid_at < timestamptz '2026-11-01 00:00+07'
  GROUP BY 1
)
SELECT to_char(thang, 'YYYY-MM') AS thang, so_don::int AS so_don, doanh_thu,
       sum(doanh_thu) OVER (ORDER BY thang) AS luy_ke,
       round(100 * (doanh_thu / lag(doanh_thu) OVER (ORDER BY thang) - 1), 1) AS tang_pct
FROM m
ORDER BY thang;`;

const C7B = `CREATE INDEX orders_customer_id_created_at_id_idx ON orders (customer_id, created_at DESC, id DESC);
-- on the server: CREATE INDEX CONCURRENTLY …, alone in its own migration file (CONCURRENTLY cannot run in a transaction block)`;
const DON_CUA_TOI = 'SELECT id, status, created_at FROM orders WHERE customer_id = 3 ORDER BY created_at DESC, id DESC LIMIT 2';

const UNG_DUNG = `# Lab 9 — the application part (lesson 16.5 has lab9-starter.zip, lab9-start.sql and the full solution)
docker exec -it pgdemo createdb -U postgres ctlab9
docker cp lab9-start.sql pgdemo:/tmp/ && docker exec -it pgdemo psql -U postgres -d ctlab9 -f /tmp/lab9-start.sql
unzip lab9-starter.zip && cd lab9-starter && npm ci && cp .env.example .env
# C1 sql/roles.sql as postgres · C2 db pull → baseline 0_init (IDENTITY + the 11 CHECKs by hand) → migrate resolve --applied
# C3 BigInt/Decimal JSON, keyset pagination, N+1 (npm run n1) · C4 expand → v1 + v2 side by side → contract
# C5 checkout in ONE interactive transaction, sorted cart, retry on 40001/40P01 (npm run race)
# C6 payment without holding a connection during the gateway call (npm run load)
# C7 report via $queryRaw, EXPLAIN (ANALYZE, BUFFERS) before/after two CONCURRENTLY migrations
# C8 npm test (database rebuilt from the migrations) · C9 sql/kiem-tra.sql + a restore drill
npm test`;

export default doiDau({
  slug: 'postgresql-lab-9-capstone-node-prisma-ct-shop',
  ten: '16.5 Lab 9 — Capstone: CT Shop behind a Node.js + Prisma API',
  khoa: KHOA,
  baiHoc: 'postgresql-lab-9-capstone-node-prisma-ct-shop',
  de: [
    deLonPg({
      dangBai: 'lab',
      tieuDe: { en: 'Lab 9 (SQL part) — the database side of the capstone', vi: 'Lab 9 (phần SQL) — phía CSDL của đồ án cuối khoá' },
      doKho: 'HARD', phut: 90, diem: 100,
      khaiNiem: ['owner role vs app role', 'ALTER DEFAULT PRIVILEGES FOR ROLE', 'expand / contract with a sync trigger', 'AT TIME ZONE in reports', 'window functions', 'index that removes a Sort'],
      tienQuyet: ['16.1–16.4 of this track, Labs 6 and 8'],
      the: ['postgresql', 'lab', 'capstone', 'roles', 'migration', 'ctshop'],
      csdl: CT_SHOP, tenCsdl: 'ctshop',
      thuMuc: 'RollNo_Name_PG_Lab9',
      phu: { en: 'PostgreSQL course · capstone after Chapter 16 · Suggested time: 90 minutes · 10 marks (3 + 3 + 2 + 2)', vi: 'Khoá PostgreSQL · đồ án sau Chương 16 · Thời gian gợi ý: 90 phút · 10 điểm (3 + 3 + 2 + 2)' },
      moTa: {
        en: '<p>The SQL that Lab 9\'s application stands on, graded in the browser: C1 the two accounts, C4 the expand half of a zero-downtime rename, C7a the revenue report and C7b the index for "My orders". The Node.js + Prisma parts (adopting the database, endpoints, the checkout race, the pool under load, tests, the checklist and the restore drill) are the second exercise of this module, run on your machine. Schema public stands for the lab\'s schema shop.</p>',
        vi: '<p>Phần SQL mà ứng dụng của Lab 9 đứng trên, chấm trong trình duyệt: C1 hai tài khoản, C4 nửa "mở rộng" của một lần đổi tên không gián đoạn, C7a báo cáo doanh thu và C7b chỉ mục cho "Đơn của tôi". Phần Node.js + Prisma (nhận CSDL có sẵn, endpoint, cuộc đua thanh toán, pool khi tải nặng, kiểm thử, checklist và diễn tập khôi phục) là đề thứ hai của module, chạy trên máy bạn. Schema public thay cho schema shop của lab.</p>',
      },
      yeuCauChung: [
        { en: 'Exact names: ctshop_owner, ctshop_app, delivery_note, orders_sync_note, orders_customer_id_created_at_id_idx.', vi: 'Đúng tên: ctshop_owner, ctshop_app, delivery_note, orders_sync_note, orders_customer_id_created_at_id_idx.' },
        { en: 'Every question is graded on a fresh CT Shop inside a transaction that is rolled back (roles included).', vi: 'Mỗi câu chấm trên một CT Shop sạch trong một giao dịch rồi bị huỷ (kể cả role).' },
      ],
      moHinh: [
        { ten: 'roles', truong: [['ctshop_owner', 'LOGIN', 'owns schema + tables, runs migrations'], ['ctshop_app', 'LOGIN', 'SELECT/INSERT/UPDATE/DELETE only']] },
        { ten: 'orders / payment', truong: [['orders.note → delivery_note', 'text', 'renamed with expand/contract'], ['payment.paid_at', 'timestamptz', 'report months in Asia/Ho_Chi_Minh']] },
      ],
      cau: [
        {
          ten: { en: 'C1 · two accounts: the owner and the app', vi: 'C1 · hai tài khoản: chủ sở hữu và ứng dụng' }, diem: 3,
          moTa: { en: 'Create <code>ctshop_owner</code> (LOGIN) and make it the owner of schema public and of every table in it. Create <code>ctshop_app</code> (LOGIN) with USAGE on the schema and SELECT, INSERT, UPDATE, DELETE on every table — nothing more. Tables that ctshop_owner creates later must get the same four privileges for the app automatically. Timeouts on the roles: app <code>statement_timeout 5s</code>, <code>idle_in_transaction_session_timeout 10s</code>, <code>lock_timeout 3s</code>; owner <code>lock_timeout 5s</code>, <code>statement_timeout 0</code>.', vi: 'Tạo <code>ctshop_owner</code> (LOGIN) và cho nó làm chủ schema public cùng mọi bảng trong đó. Tạo <code>ctshop_app</code> (LOGIN) có USAGE trên schema và SELECT, INSERT, UPDATE, DELETE trên mọi bảng — không hơn. Bảng ctshop_owner tạo về sau phải tự có bốn quyền đó cho app. Timeout trên role: app <code>statement_timeout 5s</code>, <code>idle_in_transaction_session_timeout 10s</code>, <code>lock_timeout 3s</code>; owner <code>lock_timeout 5s</code>, <code>statement_timeout 0</code>.' },
          yeuCau: [{ en: 'A DO block with <code>format(\'ALTER TABLE public.%I OWNER TO ctshop_owner\', tablename)</code> over pg_tables.', vi: 'Một khối DO với <code>format(\'ALTER TABLE public.%I OWNER TO ctshop_owner\', tablename)</code> chạy qua pg_tables.' }],
          giai: C1,
          kiem: [
            sau(['C1 · every table belongs to ctshop_owner', 'C1 · mọi bảng thuộc về ctshop_owner'], "SELECT tablename, tableowner FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename", { thuTu: true }),
            sau(['C1 · what the app may do', 'C1 · app được làm gì'], "SELECT c.relname, has_table_privilege('ctshop_app', c.oid, 'SELECT') AS sel, has_table_privilege('ctshop_app', c.oid, 'INSERT') AS ins, has_table_privilege('ctshop_app', c.oid, 'UPDATE') AS upd, has_table_privilege('ctshop_app', c.oid, 'DELETE') AS del, has_table_privilege('ctshop_app', c.oid, 'TRUNCATE') AS trunc FROM pg_class c WHERE c.relnamespace = 'public'::regnamespace AND c.relkind = 'r' ORDER BY c.relname", { thuTu: true }),
            sau(['C1 · a table from next month\'s migration', 'C1 · bảng của migration tháng sau'], "SET ROLE ctshop_owner; CREATE TABLE coupon (code text PRIMARY KEY); RESET ROLE; SELECT has_table_privilege('ctshop_app', 'coupon', 'INSERT') AS app_insert, has_table_privilege('ctshop_app', 'coupon', 'TRUNCATE') AS app_truncate, (SELECT tableowner FROM pg_tables WHERE tablename = 'coupon') AS owner"),
            sau(['C1 · the timeouts live on the roles', 'C1 · timeout nằm trên role'], "SELECT r.rolname, (SELECT array_agg(x ORDER BY x) FROM unnest(s.setconfig) x)::text AS settings FROM pg_roles r JOIN pg_db_role_setting s ON s.setrole = r.oid WHERE r.rolname IN ('ctshop_app', 'ctshop_owner') ORDER BY r.rolname", { thuTu: true }),
            chan(['C1 · the app cannot change the schema', 'C1 · app không đổi được lược đồ'], 'SET ROLE ctshop_app; ALTER TABLE orders ADD COLUMN hacked int', '42501', { an: true }),
          ],
          saiMau: [
            C1.replace('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ctshop_app;', 'GRANT ALL ON ALL TABLES IN SCHEMA public TO ctshop_app;'),
            C1.replace('ALTER DEFAULT PRIVILEGES FOR ROLE ctshop_owner IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ctshop_app;', 'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ctshop_app;'),
            C1.replace("ALTER ROLE ctshop_app SET lock_timeout = '3s';\n", ''),
          ],
        },
        {
          ten: { en: 'C4 · expand: delivery_note next to note, kept in sync both ways', vi: 'C4 · mở rộng: delivery_note cạnh note, đồng bộ hai chiều' }, diem: 3,
          moTa: { en: 'App v1 reads/writes <code>orders.note</code>; v2 uses <code>delivery_note</code>; during the rolling deploy both run. Write the EXPAND migration: <code>SET LOCAL lock_timeout = \'3s\'</code>, add <code>delivery_note text</code>, a BEFORE INSERT OR UPDATE trigger <code>orders_sync_note</code> that copies a write of either column into the other (on INSERT fill whichever is NULL), and back-fill the existing notes. (The CONTRACT — dropping note — is a later deploy.)', vi: 'App v1 đọc/ghi <code>orders.note</code>; v2 dùng <code>delivery_note</code>; trong lúc deploy cuốn chiếu cả hai cùng chạy. Viết migration MỞ RỘNG: <code>SET LOCAL lock_timeout = \'3s\'</code>, thêm <code>delivery_note text</code>, trigger BEFORE INSERT OR UPDATE <code>orders_sync_note</code> chép lần ghi vào một cột sang cột kia (khi INSERT thì điền cột đang NULL), và điền các ghi chú sẵn có. (CONTRACT — xoá note — là một lần deploy sau.)' },
          yeuCau: [{ en: 'Compare OLD and NEW with IS DISTINCT FROM to know which version wrote.', vi: 'So OLD và NEW bằng IS DISTINCT FROM để biết phiên bản nào đã ghi.' }],
          giai: C4,
          kiem: [
            { ...sau(['C4 · existing notes are back-filled', 'C4 · ghi chú sẵn có đã được điền'], 'SELECT id, note, delivery_note FROM orders WHERE note IS NOT NULL OR delivery_note IS NOT NULL ORDER BY id', { thuTu: true }), csdl: NEN_C4 },
            { ...sau(['C4 · v1 updates note → v2 sees it', 'C4 · v1 sửa note → v2 thấy'], "UPDATE orders SET note = 'Gọi trước khi giao' WHERE id = 1; SELECT id, note, delivery_note FROM orders WHERE id = 1"), csdl: NEN_C4 },
            { ...sau(['C4 · v2 updates delivery_note → v1 sees it', 'C4 · v2 sửa delivery_note → v1 thấy'], "UPDATE orders SET delivery_note = 'Để ở phòng bảo vệ' WHERE id = 2; SELECT id, note, delivery_note FROM orders WHERE id = 2"), csdl: NEN_C4 },
            { ...sau(['C4 · new orders from both versions', 'C4 · đơn mới từ cả hai phiên bản'], "INSERT INTO orders (customer_id, note) VALUES (1, 'từ v1'); INSERT INTO orders (customer_id, delivery_note) VALUES (2, 'từ v2'); SELECT customer_id, note, delivery_note FROM orders WHERE id > 14 ORDER BY id", { thuTu: true, an: true }), csdl: NEN_C4 },
            { ...ma(['C4 · sets lock_timeout first', 'C4 · đặt lock_timeout trước'], 'lock_timeout') },
          ],
          saiMau: [
            'ALTER TABLE orders RENAME COLUMN note TO delivery_note;',
            C4.replace(/UPDATE orders SET delivery_note = note WHERE[^\n]*/, ''),
            C4.replace(`  ELSIF NEW.delivery_note IS DISTINCT FROM OLD.delivery_note AND NEW.note IS NOT DISTINCT FROM OLD.note THEN
    NEW.note := NEW.delivery_note;            -- written by v2
`, ''),
          ],
        },
        {
          ten: { en: 'C7a · the revenue report, months in Vietnam time', vi: 'C7a · báo cáo doanh thu, tháng theo giờ Việt Nam' }, diem: 2,
          moTa: { en: 'For payments with paid_at in [1 Aug 2026, 1 Nov 2026) (Vietnam time) return <code>thang</code> (\'YYYY-MM\'), <code>so_don</code> (int), <code>doanh_thu</code>, <code>luy_ke</code> (running total) and <code>tang_pct</code> (growth vs the previous month, %, 1 decimal; NULL for the first), ordered by month. Prisma connects in <b>UTC</b>: the months must be Vietnamese months whatever the session time zone is.', vi: 'Với các thanh toán có paid_at trong [1/8/2026, 1/11/2026) (giờ Việt Nam) trả về <code>thang</code> (\'YYYY-MM\'), <code>so_don</code> (int), <code>doanh_thu</code>, <code>luy_ke</code> (cộng dồn) và <code>tang_pct</code> (tăng so với tháng trước, %, 1 chữ số; NULL cho tháng đầu), sắp theo tháng. Prisma kết nối ở <b>UTC</b>: tháng phải là tháng Việt Nam bất kể múi giờ của phiên.' },
          yeuCau: [{ en: "<code>date_trunc('month', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh')</code>; bounds as <code>timestamptz '2026-08-01 00:00+07'</code>.", vi: "<code>date_trunc('month', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh')</code>; cận viết <code>timestamptz '2026-08-01 00:00+07'</code>." }],
          giai: C7A,
          kiem: [
            kq(['C7a · August to October 2026', 'C7a · tháng 8 tới tháng 10/2026'], { thuTu: true }),
            { ...kq(['C7a · the same report from a UTC session, with a payment at 02:00 on 1 September', 'C7a · cùng báo cáo từ phiên UTC, có một thanh toán lúc 02:00 ngày 1/9'], { thuTu: true, an: true }), themCsdl: "INSERT INTO payment (order_id, amount, method, paid_at) VALUES (7, 95000, 'card', '2026-09-01 02:00+07'); SET TimeZone = 'UTC';" },
            ma(['C7a · uses window functions', 'C7a · dùng hàm cửa sổ'], 'OVER\\s*\\('),
          ],
          saiMau: [
            C7A.replace("date_trunc('month', paid_at AT TIME ZONE 'Asia/Ho_Chi_Minh')", "date_trunc('month', paid_at)"),
            C7A.replace('sum(doanh_thu) OVER (ORDER BY thang) AS luy_ke', 'sum(doanh_thu) OVER () AS luy_ke'),
          ],
        },
        {
          ten: { en: 'C7b · an index that removes the Sort of "My orders"', vi: 'C7b · chỉ mục bỏ được Sort của "Đơn của tôi"' }, diem: 2,
          moTa: { en: `"My orders" runs <code>${DON_CUA_TOI}</code>. Create <code>orders_customer_id_created_at_id_idx</code> so that the plan is an index scan that returns rows already in order — <b>no Sort node</b>, and LIMIT stops early. (On the server it is <code>CREATE INDEX CONCURRENTLY</code>, alone in its own migration; the grader runs inside a transaction, so write the plain form here.)`, vi: `"Đơn của tôi" chạy <code>${DON_CUA_TOI}</code>. Tạo <code>orders_customer_id_created_at_id_idx</code> sao cho kế hoạch là một lượt quét chỉ mục trả dòng đã đúng thứ tự — <b>không có nút Sort</b>, và LIMIT dừng sớm. (Trên máy chủ là <code>CREATE INDEX CONCURRENTLY</code>, đứng riêng trong migration của nó; máy chấm chạy trong giao dịch nên ở đây viết dạng thường.)` },
          yeuCau: [{ en: 'Equality column first, then the ORDER BY columns with the same directions.', vi: 'Cột so bằng đứng đầu, rồi các cột ORDER BY với đúng chiều sắp.' }],
          giai: C7B,
          kiem: [
            { ...sau(['C7b · the plan of "My orders"', 'C7b · kế hoạch của "Đơn của tôi"'], `SET LOCAL enable_seqscan = off; SELECT plan_nodes('${DON_CUA_TOI}') AS plan`), csdl: `${CT_SHOP}\n${PLAN_ALL}` },
            { ...sau(['C7b · still the right two orders', 'C7b · vẫn đúng hai đơn'], DON_CUA_TOI, { thuTu: true }), csdl: `${CT_SHOP}\n${PLAN_ALL}` },
            { ...sau(['C7b · no Sort for another customer either', 'C7b · khách khác cũng không cần Sort'], `SET LOCAL enable_seqscan = off; SELECT plan_nodes('SELECT id FROM orders WHERE customer_id = 1 ORDER BY created_at DESC, id DESC LIMIT 5') !~ 'Sort' AS no_sort`, { an: true }), csdl: `${CT_SHOP}\n${PLAN_ALL}` },
          ],
          saiMau: [
            'CREATE INDEX orders_customer_id_created_at_id_idx ON orders (customer_id);',
            'CREATE INDEX orders_customer_id_created_at_id_idx ON orders (customer_id, id DESC);',
          ],
        },
      ],
      truDiem: [
        { en: 'The app logging in as the owner (or postgres).', vi: 'App đăng nhập bằng chủ sở hữu (hoặc postgres).' },
        { en: 'Renaming a column in one step while v1 still runs.', vi: 'Đổi tên cột một bước trong khi v1 vẫn chạy.' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q4.sql (C1, C4 expand, C7a, C7b). <b>Run</b> = sample checks; <b>Submit</b> = every check and the 10-mark table. Then do the application part (second exercise) on your machine.',
        vi: 'Các tab Q1.sql … Q4.sql (C1, C4 mở rộng, C7a, C7b). <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm và bảng điểm thang 10. Rồi làm phần ứng dụng (đề thứ hai) trên máy bạn.',
      },
      thuatNgu: [tn('expand / contract', 'mở rộng / thu hẹp'), tn('owner role', 'role chủ sở hữu'), tn('AT TIME ZONE', 'đổi sang giờ một múi'), TN.window],
      goiY: [
        { en: 'C1: ALTER DEFAULT PRIVILEGES without FOR ROLE applies to tables YOU create — here that is postgres, not the owner.', vi: 'C1: ALTER DEFAULT PRIVILEGES không FOR ROLE áp cho bảng do CHÍNH BẠN tạo — ở đây là postgres, không phải owner.' },
        { en: 'C4: on INSERT fill whichever column is NULL from the other.', vi: 'C4: khi INSERT, điền cột đang NULL từ cột kia.' },
        { en: 'C7a: test your query after SET TimeZone = \'UTC\'.', vi: 'C7a: thử truy vấn sau SET TimeZone = \'UTC\'.' },
      ],
      loiHayGap: [
        { en: 'C4 a one-way trigger — what v2 writes is invisible to v1 during the deploy.', vi: 'C4 trigger một chiều — thứ v2 ghi vô hình với v1 trong lúc deploy.' },
        { en: 'C7a date_trunc(\'month\', paid_at) — in a UTC session a payment at 02:00 on 1 September lands in August.', vi: 'C7a date_trunc(\'month\', paid_at) — trong phiên UTC, thanh toán lúc 02:00 ngày 1/9 rơi vào tháng 8.' },
        { en: 'C7b (customer_id) alone — the rows still need a Sort before LIMIT.', vi: 'C7b chỉ (customer_id) — các dòng vẫn cần Sort trước LIMIT.' },
      ],
      giaiThich: { en: '<p>Reference solutions are roles.sql, the C4 expand migration, the C7 report and the C7 index migration of the Lab 9 solution, with schema shop → public and the report\'s parameters written as literals.</p>', vi: '<p>Lời giải chuẩn là roles.sql, migration mở rộng C4, báo cáo C7 và migration chỉ mục C7 trong đáp án Lab 9, đổi schema shop → public và tham số của báo cáo viết thành hằng.</p>' },
    }),

    tay({
      t: 'Lab 9 (application part) — CT Shop behind a Node.js + Prisma API', k: 'HARD', p: 300, kn: ['prisma db pull + baseline + migrate resolve', 'BigInt/Decimal in JSON, keyset pagination, N+1', 'interactive transaction + retry on 40001/40P01', 'short transactions around slow calls', 'tests on a database rebuilt from migrations'], tag: ['lab', 'capstone', 'node', 'prisma'],
      en: `<p>The application half of the capstone. Download lab9-start.sql and lab9-starter.zip from lesson 16.5 and follow its steps C1–C9; the SQL exercise above covers C1, C4, C7 — reuse your answers.</p>${pre(UNG_DUNG)}`,
      vi: `<p>Nửa ứng dụng của đồ án cuối khoá. Tải lab9-start.sql và lab9-starter.zip ở bài 16.5 và làm theo các bước C1–C9; đề SQL bên trên đã phủ C1, C4, C7 — dùng lại đáp án của bạn.</p>${pre(UNG_DUNG)}`,
      yc: [
        ['npm test prints 8 pass, 0 fail; <code>prisma migrate diff</code> prints "This is an empty migration."', 'npm test in 8 pass, 0 fail; <code>prisma migrate diff</code> in "This is an empty migration."'],
        ['A database rebuilt from your migrations has 11 CHECK constraints and refuses stock = -5.', 'CSDL dựng lại từ migration của bạn có 11 ràng buộc CHECK và từ chối stock = -5.'],
        ['Two buyers of the last unit: exactly one 201 and one 409; 400 payments with a pool of 5 all succeed.', 'Hai người mua món cuối: đúng một 201 và một 409; 400 lượt thanh toán với pool 5 đều thành công.'],
      ],
      lenh: 'npm test',
      lyDo: ['It is a Node.js application with Prisma, a real PostgreSQL server, concurrent clients and load tests; none of that runs in the browser grader.', 'Đây là ứng dụng Node.js dùng Prisma, một máy chủ PostgreSQL thật, nhiều client đồng thời và thử tải; không thứ nào chạy được trong máy chấm trình duyệt.'],
      tep: { 'NOTES.md': '# Lab 9 — application part\n\nFor each step C1–C9: the command, the output line that proves it, and one sentence of why.\n' },
      giaiTep: { 'NOTES.md': `# Lab 9 — application part (expected, PostgreSQL 17 + Prisma 5.22 + Node 22)

- C2: db pull → 8 models, warning about 11 CHECK constraints; 0_init edited (IDENTITY + CHECKs); migrate resolve --applied 0_init; status "Database schema is up to date"; diff empty
- C3: ids as strings, money as strings; keyset next=<last id>; N+1: 20 orders → 68 statements vs nested select 3 vs json_agg 1
- C4: expand deployed, v1 and v2 read each other's writes; contract while v1 still runs → P2022
- C5: race — read-modify-write sells 2 of 1 unit; atomic UPDATE … WHERE stock >= qty → one 201, one 409; deadlock retried
- C6: holding the connection during the 300 ms gateway → P2024 timeouts; short transactions → 400/400, p50 ≈ 327 ms
- C7: report 75 · 64 · 92 · 69 orders Jan–Apr 2026; EXPLAIN before 2 318 pages → after 25 pages; "My orders" no Sort
- C8: npm test → 8 pass, 0 fail
- C9: kiem-tra.sql read line by line; restore drill row counts match
` },
      viDu: [{ input: ['npm test', 'npm test'], output: ['# pass 8 · # fail 0', '# pass 8 · # fail 0'], explanation: ['The tests run on ctlab9_test, rebuilt from your migrations.', 'Các test chạy trên ctlab9_test, dựng lại từ migration của bạn.'] }],
      gy: [['Retry the WHOLE interactive transaction on 40001/40P01 — Prisma 5.22 reports a deadlock without a code.', 'Thử lại CẢ giao dịch tương tác khi gặp 40001/40P01 — Prisma 5.22 báo deadlock mà không có mã.'], ['Never hold a transaction open while calling a slow external service.', 'Đừng bao giờ giữ giao dịch mở trong lúc gọi dịch vụ ngoài chậm.']],
      lhg: [['Trusting the baseline Prisma writes: SERIAL instead of IDENTITY, no CHECK constraints.', 'Tin bản baseline Prisma viết: SERIAL thay cho IDENTITY, không có CHECK.'], ['Making the pool bigger to "fix" P2024.', 'Tăng pool để "sửa" P2024.']],
      gt: ['<p>The capstone applies the whole course to an application: least-privilege roles, migrations you can replay, a checkout that is correct under concurrency, a pool sized by arithmetic, indexes justified by EXPLAIN, and operations you have rehearsed.</p>', '<p>Đồ án áp cả khoá học vào một ứng dụng: role quyền tối thiểu, migration phát lại được, thanh toán đúng khi đồng thời, pool chỉnh cỡ bằng phép tính, chỉ mục có EXPLAIN chứng minh, và vận hành đã diễn tập.</p>'],
      tn: [tn('baseline migration', 'migration nền'), tn('keyset pagination', 'phân trang theo khoá')],
    }),
  ],
});
