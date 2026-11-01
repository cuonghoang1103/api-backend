/**
 * PostgreSQL · 14.2 — Pool trong app và PgBouncer. PgBouncer là một tiến trình riêng ⇒ thí nghiệm "làm hỏng prepared
 * statement" chạy trên máy (tay). Chấm được: phép chỉnh cỡ pool bằng SQL (đọc trần từ bảng thiết lập), và bảng
 * "tính năng nào sống sót ở chế độ transaction".
 */
import { mod, pg, cs, q, bang1, tay, kq, kqAn, pre, tn } from './_chung.mjs';

const CO_POOL = `CREATE TABLE server_setting (name text PRIMARY KEY, setting text NOT NULL);
INSERT INTO server_setting VALUES ('max_connections', '100'), ('superuser_reserved_connections', '3');
CREATE TABLE conn_client (name text PRIMARY KEY, processes int NOT NULL, pool_size int NOT NULL);
INSERT INTO conn_client VALUES ('web', 6, 10), ('worker', 3, 10), ('cron', 1, 10), ('relay', 1, 10), ('migrate', 1, 10);`;
const LD_CO_POOL = { en: `<h4>Tables (same as 14.1)</h4>${pre(`server_setting (name, setting text)        -- max_connections 100, superuser_reserved_connections 3
conn_client (name, processes, pool_size)   -- 12 processes in total, every pool 10`)}`, vi: `<h4>Bảng (như 14.1)</h4>${pre(`server_setting (name, setting text)        -- max_connections 100, superuser_reserved_connections 3
conn_client (name, processes, pool_size)   -- tổng 12 tiến trình, mọi pool 10`)}` };

const COMPOSE = `# docker-compose.yml — PostgreSQL + PgBouncer in transaction mode
services:
  db:
    image: postgres:17
    environment: { POSTGRES_PASSWORD: postgres }
    ports: ["5444:5432"]
  bouncer:
    image: edoburu/pgbouncer:v1.23.1-p3
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/postgres
      POOL_MODE: transaction
      DEFAULT_POOL_SIZE: "5"
      MAX_CLIENT_CONN: "500"
      AUTH_TYPE: scram-sha-256
    ports: ["6432:5432"]
    depends_on: [db]`;
const BREAK = `// prepared.mjs — node prepared.mjs   (npm i pg)
import pg from 'pg';
for (const [label, port] of [['direct  ', 5444], ['bouncer ', 6432]]) {
  const pool = new pg.Pool({ host: 'localhost', port, user: 'postgres', password: 'postgres', database: 'postgres', max: 20 });
  let fail = 0;
  await Promise.all(Array.from({ length: 200 }, (_, i) =>
    pool.query({ name: 's0', text: 'SELECT $1::int AS n', values: [i] }).catch((e) => { fail++; if (fail === 1) console.log(label, e.code, e.message); })));
  console.log(\`\${label}: \${fail} of 200 named-prepared queries failed\`);
  await pool.end();
}`;

export default mod('postgresql-14-2-pool-pgbouncer', '14.2 Pooling: in the app, and in front of it', [
  pg({
    csdl: CO_POOL, tenCsdl: 'budget', ld: LD_CO_POOL,
    t: 'Shrink the pools until the fleet fits', k: 'MEDIUM', p: 10, kn: ['pool sizing', 'headroom for admin/migrations', 'floor division'], tag: ['pool', 'capacity'],
    en: '<p>Keep <b>10 connections</b> free for psql, migrations and monitoring. What is the largest pool size, the same for every process, that still fits? Return <code>processes, available, per_process_pool, total</code>: processes = Σ processes; available = max_connections − superuser_reserved_connections − 10 (read from server_setting); per_process_pool = available ÷ processes rounded <b>down</b>; total = processes × per_process_pool.</p>',
    vi: '<p>Chừa <b>10 kết nối</b> cho psql, migration và giám sát. Cỡ pool lớn nhất, như nhau cho mọi tiến trình, mà vẫn vừa là bao nhiêu? Trả về <code>processes, available, per_process_pool, total</code>: processes = Σ processes; available = max_connections − superuser_reserved_connections − 10 (đọc từ server_setting); per_process_pool = available ÷ processes làm tròn <b>xuống</b>; total = processes × per_process_pool.</p>',
    yc: [['Integer division of two integers already rounds down in PostgreSQL (or use floor()).', 'Chia hai số nguyên trong PostgreSQL đã làm tròn xuống (hoặc dùng floor()).'], ['Read the two settings; do not hard-code 97.', 'Đọc hai thiết lập; đừng viết cứng 97.']],
    giai: `WITH p AS (
  SELECT sum(processes)::int AS processes FROM conn_client
), cap AS (
  SELECT max(setting::int) FILTER (WHERE name = 'max_connections')
       - max(setting::int) FILTER (WHERE name = 'superuser_reserved_connections')
       - 10 AS available                                        -- room for psql, migrations, monitoring
  FROM server_setting
)
SELECT processes, available,
       available / processes AS per_process_pool,              -- int / int rounds down
       processes * (available / processes) AS total
FROM p, cap;`,
    kiem: [
      kq(['12 processes, 87 usable slots', '12 tiến trình, 87 suất dùng được']),
      kqAn(['Autoscaling added 8 web containers', 'Tự co giãn thêm 8 container web'], "UPDATE conn_client SET processes = 14 WHERE name = 'web'"),
      kqAn(['A bigger server: max_connections 300', 'Máy lớn hơn: max_connections 300'], "UPDATE server_setting SET setting = '300' WHERE name = 'max_connections'"),
    ],
    sai: ["SELECT sum(processes)::int AS processes, 87 AS available, 87 / sum(processes)::int AS per_process_pool, sum(processes)::int * (87 / sum(processes)::int) AS total FROM conn_client", "SELECT sum(processes)::int AS processes, 87 AS available, round(87.0 / sum(processes)) AS per_process_pool, sum(processes) * round(87.0 / sum(processes)) AS total FROM conn_client"],
    gy: [['87 / 12 = 7 in integer arithmetic: 12 × 7 = 84 ≤ 87.', '87 / 12 = 7 với phép chia nguyên: 12 × 7 = 84 ≤ 87.'], ['Rounding to nearest can overshoot the limit.', 'Làm tròn gần nhất có thể vượt trần.']],
    lhg: [['round() instead of rounding down — 87 / 12 = 7.25 happens to round to 7, but with 13 processes 87 / 13 = 6.69 rounds to 7 and 13 × 7 = 91 &gt; 87.', 'round() thay vì làm tròn xuống — 87 / 12 = 7,25 tình cờ ra 7, nhưng với 13 tiến trình 87 / 13 = 6,69 làm tròn thành 7 và 13 × 7 = 91 &gt; 87.'], ['Forgetting the admin headroom — the incident you need psql for is the one where every slot is taken.', 'Quên khoảng dư cho quản trị — sự cố mà bạn cần psql chính là lúc mọi suất đã bị chiếm.']],
    gt: ['<p>Pool size × processes must fit under the limit with room to spare. When autoscaling makes the process count unpredictable, the per-process pool collapses (here to 4) — that is the moment PgBouncer earns its place.</p>', '<p>Cỡ pool × số tiến trình phải vừa dưới trần và còn dư. Khi tự co giãn làm số tiến trình khó đoán, pool mỗi tiến trình co lại (ở đây còn 4) — đó là lúc PgBouncer đáng có mặt.</p>'],
    tn: [tn('pool size', 'cỡ pool'), tn('autoscaling', 'tự co giãn')],
  }),

  cs({
    t: 'What breaks in PgBouncer transaction mode', k: 'MEDIUM', p: 8, kn: ['session state', 'transaction pooling', 'pg_advisory_xact_lock', 'LISTEN/NOTIFY'], tag: ['pool', 'pgbouncer'], loai: 'table',
    en: '<p>In transaction mode, two transactions of the same client may run on different server connections. For each feature, say whether it keeps working.</p>',
    vi: '<p>Ở chế độ transaction, hai giao dịch của cùng một client có thể chạy trên hai kết nối máy chủ khác nhau. Với mỗi tính năng, cho biết nó còn chạy đúng không.</p>',
    bang: [bang1('b1', ['Feature → in transaction mode', 'Tính năng → ở chế độ transaction'], [{ ma: 'f', ten: 'Feature / Tính năng' }, { ma: 'ok', ten: 'Works? / Chạy đúng?', luaChon: ['works', 'breaks'] }], [
      { o: { f: 'BEGIN; UPDATE …; UPDATE …; COMMIT;' }, a: { ok: 'works' } },
      { o: { f: 'Named prepared statements (Prisma, pg with name:)' }, a: { ok: 'breaks' } },
      { o: { f: 'SET search_path = app; then later queries' }, a: { ok: 'breaks' } },
      { o: { f: 'SET LOCAL statement_timeout inside BEGIN … COMMIT' }, a: { ok: 'works' } },
      { o: { f: 'pg_advisory_lock(42) … pg_advisory_unlock(42) across transactions' }, a: { ok: 'breaks' } },
      { o: { f: 'pg_advisory_xact_lock(42) inside one transaction' }, a: { ok: 'works' } },
      { o: { f: 'LISTEN orders_changed' }, a: { ok: 'breaks' } },
      { o: { f: 'CREATE TEMP TABLE, used by the next transaction' }, a: { ok: 'breaks' } },
    ], ['Anything that lives in the SESSION (prepared statements, plain SET, session advisory locks, temp tables, LISTEN) is bound to a backend you no longer keep after COMMIT. Anything scoped to ONE transaction still works.', 'Mọi thứ sống trong PHIÊN (prepared statement, SET thường, khoá advisory phiên, bảng tạm, LISTEN) gắn với một backend mà bạn không còn giữ sau COMMIT. Mọi thứ gói trong MỘT giao dịch vẫn chạy.'])],
    gy: [['Ask: does it outlive COMMIT?', 'Tự hỏi: nó có sống quá COMMIT không?'], ['The _xact_ and LOCAL forms are the transaction-scoped twins.', 'Dạng _xact_ và LOCAL là bản gói trong giao dịch.']],
    lhg: [['Thinking SET is safe because "it worked in testing" — testing used one connection.', 'Tưởng SET an toàn vì "thử thì chạy" — lúc thử chỉ có một kết nối.'], ['Running migrations through PgBouncer — use a direct URL (Prisma DIRECT_URL).', 'Chạy migration qua PgBouncer — hãy dùng URL trực tiếp (Prisma DIRECT_URL).']],
    tn: [tn('transaction pooling', 'pool theo giao dịch'), tn('session state', 'trạng thái phiên')],
  }),

  cs({
    t: 'Sizing and deciding', k: 'EASY', p: 6, kn: ['pool size formula', 'queueing', 'when to add PgBouncer'], tag: ['pool'],
    en: '<p>Lesson 14.2 in four questions.</p>', vi: '<p>Bài 14.2 trong bốn câu.</p>',
    cau: [
      q('q1', ['A 4-core VPS on SSD. A sensible starting pool size per process is about…', 'VPS 4 nhân, SSD. Cỡ pool khởi điểm hợp lý mỗi tiến trình là khoảng…'], ['10 ((cores × 2) + effective disks)', '100, so no request ever waits', '1, to avoid contention entirely', '400, one per expected user'], ['(4 × 2) + 1 ≈ 9–10. Bigger pools add contention, not throughput.', '(4 × 2) + 1 ≈ 9–10. Pool lớn hơn chỉ thêm tranh chấp, không thêm thông lượng.']),
      q('q2', ['Why can a request that waits 3 ms for a pool slot beat one that starts immediately?', 'Vì sao yêu cầu chờ 3 ms lấy suất pool có thể nhanh hơn yêu cầu được chạy ngay?'], ['100 queries at once fight for CPU and locks; each takes far longer', 'waiting in the pool warms the shared buffer cache first', 'the pool rewrites the query into a cheaper plan', 'it cannot — a request that waits is always slower'], ['Queueing in the pool keeps the database at the concurrency it handles best.', 'Xếp hàng ở pool giữ CSDL ở mức đồng thời nó xử lý tốt nhất.']),
      q('q3', ['You add PgBouncer but keep 12 processes × pool 10. What changes for the application side?', 'Bạn thêm PgBouncer nhưng giữ 12 tiến trình × pool 10. Phía ứng dụng thay đổi gì?'], ['nothing: it still opens 120 client connections, now to PgBouncer', 'it now opens only 20 connections, one per server slot', 'PgBouncer resizes every application pool automatically', 'PostgreSQL itself now rejects the extra 20 connections'], ['PgBouncer limits SERVER connections; client pools must still be sized.', 'PgBouncer giới hạn kết nối phía MÁY CHỦ; pool phía client vẫn phải chỉnh cỡ.']),
      q('q4', ['When is the application pool alone enough?', 'Khi nào chỉ pool trong ứng dụng là đủ?'], ['few processes, and processes × pool fits under the limit with room', 'whenever the application talks to PostgreSQL through Prisma', 'never — production always needs PgBouncer in front', 'only when PgBouncer would have to run in statement mode'], ['Do not add a component you do not need; PgBouncer is for many or unpredictable processes.', 'Đừng thêm thành phần không cần; PgBouncer dành cho nhiều tiến trình hoặc số tiến trình khó đoán.']),
    ],
    gy: [['Start from cores, not from users.', 'Bắt đầu từ số nhân, không phải số người dùng.'], ['Two layers: client pools and server connections.', 'Hai tầng: pool phía client và kết nối phía máy chủ.']],
    lhg: [['Sizing the pool by expected concurrent users.', 'Chỉnh cỡ pool theo số người dùng đồng thời dự kiến.'], ['Expecting PgBouncer to shrink the app pools.', 'Mong PgBouncer tự thu nhỏ pool của app.']],
    tn: [tn('PgBouncer', 'bộ gom kết nối')],
  }),

  tay({
    t: 'Break a prepared statement behind PgBouncer, then fix it', k: 'HARD', p: 20, kn: ['PgBouncer transaction mode', 'error 26000 / 42P05', 'Prisma pgbouncer=true + directUrl'], tag: ['pgbouncer', 'docker', 'prisma'],
    en: `<p>Start PostgreSQL + PgBouncer (transaction mode):</p>${pre(COMPOSE)}<p>Then send 200 queries using the <b>same named prepared statement</b>, first directly, then through PgBouncer:</p>${pre(BREAK)}<p>Finally write the Prisma datasource that avoids it.</p>`,
    vi: `<p>Dựng PostgreSQL + PgBouncer (chế độ transaction):</p>${pre(COMPOSE)}<p>Rồi gửi 200 truy vấn dùng <b>cùng một prepared statement có tên</b>, trước đi thẳng, sau đi qua PgBouncer:</p>${pre(BREAK)}<p>Cuối cùng viết datasource Prisma tránh được lỗi này.</p>`,
    yc: [['Direct: 0 failures. Through PgBouncer: many failures with <code>26000 prepared statement "s0" does not exist</code> or <code>42P05 … already exists</code>.', 'Đi thẳng: 0 lỗi. Qua PgBouncer: rất nhiều lỗi <code>26000 prepared statement "s0" does not exist</code> hoặc <code>42P05 … already exists</code>.'], ['Prisma: <code>DATABASE_URL</code> → port 6432 with <code>?pgbouncer=true</code>, <code>directUrl = env("DIRECT_URL")</code> → port 5444 for migrations.', 'Prisma: <code>DATABASE_URL</code> → cổng 6432 kèm <code>?pgbouncer=true</code>, <code>directUrl = env("DIRECT_URL")</code> → cổng 5444 cho migration.']],
    lenh: 'docker compose up -d && npm i pg && node prepared.mjs',
    lyDo: ['PgBouncer is a separate network daemon in front of a real server; the browser grader has neither.', 'PgBouncer là một tiến trình mạng riêng đứng trước máy chủ thật; máy chấm trình duyệt không có cả hai.'],
    tep: { 'docker-compose.yml': COMPOSE + '\n', 'prepared.mjs': BREAK + '\n', 'schema.prisma': 'datasource db {\n  provider = "postgresql"\n  // TODO\n}\n' },
    giaiTep: {
      'docker-compose.yml': COMPOSE + '\n',
      'prepared.mjs': `${BREAK}\n\n/* Expected (PgBouncer 1.23, transaction mode, pool 5):\ndirect  : 0 of 200 named-prepared queries failed\nbouncer  26000 prepared statement "s0" does not exist\nbouncer : 181 of 200 named-prepared queries failed   (the exact count varies run to run) */\n`,
      'schema.prisma': `datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // postgresql://postgres:postgres@localhost:6432/postgres?pgbouncer=true
  directUrl = env("DIRECT_URL")     // postgresql://postgres:postgres@localhost:5444/postgres  (prisma migrate)
}
`,
    },
    viDu: [{ input: ['node prepared.mjs', 'node prepared.mjs'], output: ['direct 0 failed · bouncer ~180 failed', 'đi thẳng 0 lỗi · qua bouncer ~180 lỗi'], explanation: ['The statement was prepared on one server backend and executed on another.', 'Câu lệnh được chuẩn bị trên một backend rồi thực thi trên backend khác.'] }],
    gy: [['Named statements live in the backend session; transaction mode hands you a different backend each time.', 'Statement có tên sống trong phiên backend; chế độ transaction mỗi lần đưa bạn một backend khác.'], ['Unnamed queries (no name:) do not fail — that is why the bug hides until an ORM prepares.', 'Truy vấn không tên (không name:) không lỗi — vì thế lỗi này ẩn tới khi ORM chuẩn bị câu lệnh.']],
    lhg: [['Pointing prisma migrate at PgBouncer — advisory locks and long DDL break there.', 'Trỏ prisma migrate vào PgBouncer — khoá advisory và DDL dài sẽ hỏng ở đó.'], ['Switching to session mode "to fix it" — it works, but barely multiplexes any more.', 'Chuyển sang chế độ session "cho hết lỗi" — chạy được, nhưng gần như không gom kết nối nữa.']],
    gt: ['<p>This is the failure the lesson measured (181 of 200). <code>pgbouncer=true</code> makes Prisma stop relying on named prepared statements across transactions; migrations go through <code>directUrl</code>, straight to PostgreSQL.</p>', '<p>Đây là lỗi bài học đã đo (181 trên 200). <code>pgbouncer=true</code> khiến Prisma thôi dựa vào prepared statement có tên qua nhiều giao dịch; migration đi qua <code>directUrl</code>, thẳng tới PostgreSQL.</p>'],
    tn: [tn('prepared statement', 'câu lệnh chuẩn bị sẵn')],
  }),
]);
