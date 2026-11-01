/**
 * PostgreSQL · 14.1 — Một kết nối tốn những gì. Đo 15,9× và "đâm tường" max_connections cần MÁY CHỦ THẬT nhiều kết nối
 * (PGlite chỉ có MỘT phiên) ⇒ bài tay. Phần chấm được: phép tính ngân sách kết nối (đọc max_connections từ bảng thiết lập)
 * và truy vấn đếm kết nối theo app trên một ẢNH CHỤP pg_stat_activity của máy chủ thật (nói rõ là ảnh chụp).
 */
import { mod, pg, cs, q, tay, kq, kqAn, ma, pre, tn } from './_chung.mjs';

const T = { thuTu: true };

const DO_KET_NOI = `// measure.mjs — node measure.mjs   (npm i pg; PostgreSQL of lesson 0.3 on port 5444)
import pg from 'pg';
const CFG = { host: 'localhost', port: 5444, user: 'postgres', password: 'postgres', database: 'postgres' };
const N = 50;
const time = async (label, fn) => { const t = performance.now(); await fn(); const ms = performance.now() - t;
  console.log(\`\${label.padEnd(28)}: \${ms.toFixed(2).padStart(8)} ms for \${N} → \${(ms / N).toFixed(3)} ms/query\`); return ms; };

const a = await time('A. new connection per query', async () => {
  for (let i = 0; i < N; i++) { const c = new pg.Client(CFG); await c.connect(); await c.query('SELECT 1'); await c.end(); }
});
const b = await time('B. one connection, reused', async () => {
  const c = new pg.Client(CFG); await c.connect(); for (let i = 0; i < N; i++) await c.query('SELECT 1'); await c.end();
});
await time('C. pool (max 10)', async () => {
  const p = new pg.Pool({ ...CFG, max: 10 }); for (let i = 0; i < N; i++) await p.query('SELECT 1'); await p.end();
});
console.log(\`→ opening a new connection costs \${(a / b).toFixed(1)}× a reused one\`);

// hit the wall on purpose: open connections until the server refuses
const held = [];
try { for (;;) { const c = new pg.Client(CFG); await c.connect(); held.push(c); } }
catch (e) { console.log(\`[postgres] opened \${held.length} connections before failing\\nERROR \${e.code}: \${e.message}\`); }
await Promise.all(held.map((c) => c.end()));`;

const NGAN_SACH = `CREATE TABLE server_setting (name text PRIMARY KEY, setting text NOT NULL);
INSERT INTO server_setting VALUES ('max_connections', '100'), ('superuser_reserved_connections', '3');
CREATE TABLE conn_client (name text PRIMARY KEY, processes int NOT NULL, pool_size int NOT NULL);
INSERT INTO conn_client VALUES
  ('web',      6, 10),
  ('worker',   3, 10),
  ('cron',     1, 10),
  ('relay',    1, 10),
  ('migrate',  1, 10);`;
const LD_NGAN_SACH = { en: `<h4>Tables</h4>${pre(`server_setting (name, setting text)   -- copied from pg_settings: max_connections = 100, superuser_reserved_connections = 3
conn_client (name, processes, pool_size)  -- web 6×10 · worker 3×10 · cron 1×10 · relay 1×10 · migrate 1×10`)}`, vi: `<h4>Bảng</h4>${pre(`server_setting (name, setting text)   -- chép từ pg_settings: max_connections = 100, superuser_reserved_connections = 3
conn_client (name, processes, pool_size)  -- web 6×10 · worker 3×10 · cron 1×10 · relay 1×10 · migrate 1×10`)}` };

const HOAT_DONG = `CREATE TABLE activity (            -- a snapshot of pg_stat_activity taken on a real server
  pid int PRIMARY KEY, backend_type text NOT NULL, application_name text NOT NULL, state text);
INSERT INTO activity VALUES
  (101, 'client backend', 'web', 'active'), (102, 'client backend', 'web', 'active'), (103, 'client backend', 'web', 'idle'),
  (104, 'client backend', 'web', 'idle'), (105, 'client backend', 'web', 'idle'), (106, 'client backend', 'web', 'idle'),
  (107, 'client backend', 'web', 'idle'), (108, 'client backend', 'web', 'active'),
  (201, 'client backend', 'worker', 'active'), (202, 'client backend', 'worker', 'idle'), (203, 'client backend', 'worker', 'idle'),
  (204, 'client backend', 'worker', 'idle in transaction'),
  (301, 'client backend', 'psql', 'active'), (401, 'client backend', 'metrics', 'idle'),
  (11, 'autovacuum launcher', '', NULL), (12, 'logical replication launcher', '', NULL), (13, 'background writer', '', NULL),
  (14, 'checkpointer', '', NULL), (15, 'walwriter', '', NULL);`;
const LD_HOAT_DONG = { en: `<h4>Table</h4>${pre(`activity (pid, backend_type, application_name, state)
-- 19 rows copied from pg_stat_activity of a real server: 14 client backends + 5 PostgreSQL helper processes (state NULL, app '')`)}`, vi: `<h4>Bảng</h4>${pre(`activity (pid, backend_type, application_name, state)
-- 19 dòng chép từ pg_stat_activity của một máy chủ thật: 14 client backend + 5 tiến trình phụ của PostgreSQL (state NULL, app '')`)}` };

export default mod('postgresql-14-1-gia-ket-noi', '14.1 What a connection costs', [
  tay({
    t: 'Measure the 15.9×, then hit the wall on purpose', k: 'MEDIUM', p: 15, kn: ['process per connection', 'connection setup cost', 'max_connections', 'error 53300'], tag: ['connections', 'node'],
    en: `<p>Run the script of lesson 14.1 against your own PostgreSQL (lesson 0.3) with Node.js and the <code>pg</code> driver:</p>${pre(DO_KET_NOI)}`,
    vi: `<p>Chạy script của bài 14.1 với PostgreSQL của bạn (bài 0.3), bằng Node.js và driver <code>pg</code>:</p>${pre(DO_KET_NOI)}`,
    yc: [['A is roughly 10–20× slower per query than B; C is about the same as B.', 'A chậm hơn B khoảng 10–20 lần mỗi truy vấn; C xấp xỉ B.'], ['The loop stops at about max_connections with <code>53300 sorry, too many clients already</code>.', 'Vòng lặp dừng ở khoảng max_connections với <code>53300 sorry, too many clients already</code>.'], ['While it holds them, <code>ps aux | grep postgres</code> (inside the container) shows one process per connection.', 'Trong lúc giữ chúng, <code>ps aux | grep postgres</code> (trong container) hiện mỗi kết nối một tiến trình.']],
    lenh: 'npm i pg && node measure.mjs',
    lyDo: ['It needs a real server that accepts many connections; the browser grader is a single in-page PostgreSQL session.', 'Bài cần máy chủ thật nhận nhiều kết nối; máy chấm trình duyệt chỉ là một phiên PostgreSQL trong trang.'],
    tep: { 'measure.mjs': DO_KET_NOI + '\n' },
    giaiTep: { 'measure.mjs': `${DO_KET_NOI}

/* Expected (PostgreSQL 17.11 in Docker, node-postgres 8.13, same machine):
A. new connection per query :   338.25 ms for 50 → 6.765 ms/query
B. one connection, reused   :    21.27 ms for 50 → 0.425 ms/query
C. pool (max 10)            :    22.09 ms for 50 → 0.442 ms/query
→ opening a new connection costs 15.9× a reused one
[postgres] opened 100 connections before failing
ERROR 53300: sorry, too many clients already
   (as a non-superuser role it stops 3 earlier: "remaining connection slots are reserved …") */
` },
    viDu: [{ input: ['node measure.mjs', 'node measure.mjs'], output: ['→ opening a new connection costs ~15× a reused one', '→ mở kết nối mới tốn ~15× kết nối tái dùng'], explanation: ['Most of A is fork + authentication, not the query.', 'Phần lớn thời gian của A là fork + xác thực, không phải truy vấn.'] }],
    gy: [['Run it twice: the first run also warms caches.', 'Chạy hai lần: lần đầu còn tốn thời gian làm ấm bộ đệm.'], ['Connect as a normal role to see the superuser reserve kick in 3 connections earlier.', 'Kết nối bằng role thường để thấy phần dự trữ cho superuser chặn sớm hơn 3 kết nối.']],
    lhg: [['Leaving the held connections open after the test — your psql cannot connect any more either.', 'Để nguyên các kết nối đang giữ sau khi thử — chính psql của bạn cũng không vào được nữa.'], ['Concluding "raise max_connections" — every slot costs memory; the fix is fewer connections.', 'Kết luận "tăng max_connections" — mỗi suất tốn bộ nhớ; cách sửa là ít kết nối hơn.']],
    gt: ['<p>PostgreSQL forks one OS process per connection, so opening one costs milliseconds while a query on an open one costs a fraction of that. A pool keeps the setup cost at zero and caps the number of processes.</p>', '<p>PostgreSQL fork một tiến trình hệ điều hành cho mỗi kết nối, nên mở một kết nối tốn vài mili giây trong khi truy vấn trên kết nối đang mở chỉ tốn một phần nhỏ. Pool giữ chi phí dựng bằng 0 và chặn trần số tiến trình.</p>'],
    tn: [tn('connection pool', 'bể kết nối'), tn('max_connections', 'số kết nối tối đa')],
  }),

  pg({
    csdl: NGAN_SACH, tenCsdl: 'budget', ld: LD_NGAN_SACH,
    t: 'The connection budget: does the fleet fit?', k: 'MEDIUM', p: 10, kn: ['processes × pool size', 'superuser_reserved_connections', 'headroom'], tag: ['connections', 'capacity'],
    en: '<p>Return one row <code>needed, available, headroom, verdict</code>: needed = Σ processes × pool_size; available = max_connections − superuser_reserved_connections <b>read from server_setting</b> (cast the text); headroom = available − needed; verdict = <code>\'fits\'</code> when headroom ≥ 0, else <code>\'over\'</code>.</p>',
    vi: '<p>Trả về một dòng <code>needed, available, headroom, verdict</code>: needed = Σ processes × pool_size; available = max_connections − superuser_reserved_connections <b>đọc từ server_setting</b> (ép kiểu chữ); headroom = available − needed; verdict = <code>\'fits\'</code> khi headroom ≥ 0, ngược lại <code>\'over\'</code>.</p>',
    yc: [['Do not hard-code 100 or 97 — the setting can change.', 'Đừng viết cứng 100 hay 97 — thiết lập có thể đổi.'], ['<code>setting::int</code> to turn the text into a number.', '<code>setting::int</code> để biến chữ thành số.']],
    giai: `WITH need AS (
  SELECT sum(processes * pool_size) AS needed FROM conn_client          -- the pool is PER PROCESS
), cap AS (
  SELECT max(setting::int) FILTER (WHERE name = 'max_connections')
       - max(setting::int) FILTER (WHERE name = 'superuser_reserved_connections') AS available
  FROM server_setting
)
SELECT needed, available, available - needed AS headroom,
       CASE WHEN available - needed >= 0 THEN 'fits' ELSE 'over' END AS verdict
FROM need, cap;`,
    kiem: [
      kq(['12 processes × pool 10 against 97 slots', '12 tiến trình × pool 10 so với 97 suất']),
      kqAn(['After shrinking every pool to 6', 'Sau khi thu mọi pool về 6'], 'UPDATE conn_client SET pool_size = 6'),
      kqAn(['The DBA raised max_connections to 200', 'DBA tăng max_connections lên 200'], "UPDATE server_setting SET setting = '200' WHERE name = 'max_connections'"),
    ],
    sai: ["SELECT sum(processes * pool_size) AS needed, 97 AS available, 97 - sum(processes * pool_size) AS headroom, CASE WHEN 97 - sum(processes * pool_size) >= 0 THEN 'fits' ELSE 'over' END AS verdict FROM conn_client", "SELECT sum(pool_size) AS needed, 97 AS available, 97 - sum(pool_size) AS headroom, 'fits' AS verdict FROM conn_client"],
    gy: [['A pool of 10 is per Node.js process: 6 web containers open up to 60.', 'Pool 10 là cho MỖI tiến trình Node.js: 6 container web mở tới 60.'], ['Conditional aggregation (FILTER) turns two setting rows into two numbers.', 'Tổng hợp có điều kiện (FILTER) biến hai dòng thiết lập thành hai con số.']],
    lhg: [['Summing pool_size only — forgetting that every process has its own pool.', 'Chỉ cộng pool_size — quên rằng mỗi tiến trình có pool riêng.'], ['Comparing with max_connections itself — 3 slots are reserved for superusers.', 'So với chính max_connections — 3 suất dành riêng cho superuser.']],
    gt: ['<p>The total is processes × pool per process, and the ceiling an application role can reach is max_connections − superuser_reserved_connections. The fleet of the lesson needs 120 of 97: over-subscribed at rest, and it fails the first time every pool is busy at once.</p>', '<p>Tổng là số tiến trình × pool mỗi tiến trình, còn trần mà role ứng dụng chạm được là max_connections − superuser_reserved_connections. Hệ thống trong bài cần 120 trên 97: quá tải ngay lúc yên, và sụp lần đầu tiên mọi pool cùng bận.</p>'],
    tn: [tn('headroom', 'khoảng dư'), tn('superuser_reserved_connections', 'suất dành cho superuser')],
  }),

  pg({
    csdl: HOAT_DONG, tenCsdl: 'activity', ld: LD_HOAT_DONG,
    t: 'Who holds the connections? (a pg_stat_activity snapshot)', k: 'MEDIUM', p: 10, kn: ['pg_stat_activity', "backend_type = 'client backend'", 'conditional counts'], tag: ['connections', 'monitoring'],
    en: '<p>On the snapshot, count the <b>client</b> connections per application: <code>app, conns, active, idle, idle_in_txn</code> (idle_in_txn counts both "idle in transaction" and "idle in transaction (aborted)"), most connections first, ties by app. PostgreSQL\'s own helper processes must not be counted.</p>',
    vi: '<p>Trên ảnh chụp, đếm kết nối <b>của client</b> theo từng ứng dụng: <code>app, conns, active, idle, idle_in_txn</code> (idle_in_txn đếm cả "idle in transaction" lẫn "idle in transaction (aborted)"), nhiều kết nối trước, bằng nhau theo app. Không được đếm các tiến trình phụ của PostgreSQL.</p>',
    yc: [["<code>WHERE backend_type = 'client backend'</code>.", "<code>WHERE backend_type = 'client backend'</code>."], ["<code>count(*) FILTER (WHERE state LIKE 'idle in transaction%')</code>.", "<code>count(*) FILTER (WHERE state LIKE 'idle in transaction%')</code>."]],
    giai: `SELECT application_name AS app,
       count(*) AS conns,
       count(*) FILTER (WHERE state = 'active') AS active,
       count(*) FILTER (WHERE state = 'idle') AS idle,
       count(*) FILTER (WHERE state LIKE 'idle in transaction%') AS idle_in_txn
FROM activity
WHERE backend_type = 'client backend'          -- the 5 helper processes are not your clients
GROUP BY application_name
ORDER BY conns DESC, app;`,
    kiem: [
      kq(['Connections per app', 'Kết nối theo app'], T),
      kqAn(['A failed transaction left idle', 'Một giao dịch đã hỏng bị bỏ treo'], "INSERT INTO activity VALUES (205, 'client backend', 'worker', 'idle in transaction (aborted)'), (302, 'client backend', 'psql', 'idle')", T),
      ma(['Filters on backend_type', 'Lọc theo backend_type'], 'backend_type'),
    ],
    sai: ["SELECT application_name AS app, count(*) AS conns, count(*) FILTER (WHERE state = 'active') AS active, count(*) FILTER (WHERE state = 'idle') AS idle, count(*) FILTER (WHERE state LIKE 'idle in transaction%') AS idle_in_txn FROM activity GROUP BY application_name ORDER BY conns DESC, app", "SELECT application_name AS app, count(*) AS conns, count(*) FILTER (WHERE state = 'active') AS active, count(*) FILTER (WHERE state = 'idle') AS idle, count(*) FILTER (WHERE state = 'idle in transaction') AS idle_in_txn FROM activity WHERE backend_type = 'client backend' GROUP BY application_name ORDER BY conns DESC, app"],
    gy: [['Unfiltered, pg_stat_activity also lists autovacuum, checkpointer, walwriter…', 'Không lọc, pg_stat_activity còn liệt kê autovacuum, checkpointer, walwriter…'], ['On a live server, also exclude your own session: <code>pid &lt;&gt; pg_backend_pid()</code>.', 'Trên máy thật, loại cả phiên của chính bạn: <code>pid &lt;&gt; pg_backend_pid()</code>.']],
    lhg: [['Counting the helpers — an empty-named "app" with 5 connections appears.', 'Đếm cả tiến trình phụ — xuất hiện một "app" tên rỗng với 5 kết nối.'], ["<code>state = 'idle in transaction'</code> — misses the aborted ones, which are just as stuck.", "<code>state = 'idle in transaction'</code> — sót các phiên đã hỏng, vốn kẹt y như vậy."]],
    gt: ['<p>This is the query to run in production when the limit gets close: it tells you which process type holds the slots and in which state. The browser grader has a single session, so the data is a snapshot copied from a real server — on yours, replace <code>activity</code> with <code>pg_stat_activity</code>.</p>', '<p>Đây là truy vấn chạy trên production khi sắp chạm trần: nó cho biết loại tiến trình nào giữ suất và ở trạng thái nào. Máy chấm trình duyệt chỉ có một phiên, nên dữ liệu là ảnh chụp từ một máy chủ thật — trên máy bạn, thay <code>activity</code> bằng <code>pg_stat_activity</code>.</p>'],
    tn: [tn('pg_stat_activity', 'bảng phiên đang chạy'), tn('client backend', 'tiến trình phục vụ client')],
  }),

  cs({
    t: 'One connection, one process — consequences', k: 'EASY', p: 6, kn: ['process model', 'error 53300', 'raising max_connections'], tag: ['connections'],
    en: '<p>Lesson 14.1 in four questions.</p>', vi: '<p>Bài 14.1 trong bốn câu.</p>',
    cau: [
      q('q1', ['What does PostgreSQL create for each new client connection?', 'PostgreSQL tạo gì cho mỗi kết nối client mới?'], ['an operating-system process (forked backend)', 'a thread inside one server process', 'a coroutine on an event loop', 'nothing until the first query arrives'], ['One backend process per connection: isolation between sessions, but expensive to create and to keep.', 'Mỗi kết nối một tiến trình backend: các phiên cách ly nhau, nhưng tốn kém để tạo và để giữ.']),
      q('q2', ['The app logs <code>53300 sorry, too many clients already</code>. What is happening to new requests?', 'App ghi log <code>53300 sorry, too many clients already</code>. Yêu cầu mới đang ra sao?'], ['every new connection fails at once, including the one you would use to investigate', 'they queue on the server until a slot frees up', 'they are served more slowly', 'only superuser queries fail'], ['There is no queue on the server side: it refuses. Only the superuser reserve still lets an admin in.', 'Phía máy chủ không có hàng đợi: nó từ chối. Chỉ phần dự trữ cho superuser còn cho quản trị viên vào.']),
      q('q3', ['Why is "just raise max_connections to 1000" usually wrong?', 'Vì sao "cứ tăng max_connections lên 1000" thường sai?'], ['each slot costs memory, and 1000 busy processes fight over few cores', 'PostgreSQL refuses any value above 100 connections', 'it only takes effect after a major version upgrade', 'it silently disables every connection pool in the app'], ['More processes than cores means contention, not throughput. Fewer, pooled connections is the fix.', 'Nhiều tiến trình hơn số nhân là tranh chấp, không phải thông lượng. Ít kết nối hơn, có pool, mới là cách sửa.']),
      q('q4', ['Twelve Node.js containers each use a pool of 10. How many connections can they open?', 'Mười hai container Node.js, mỗi cái pool 10. Chúng mở được bao nhiêu kết nối?'], ['120', '10', '12', '22'], ['The pool is per process: 12 × 10.', 'Pool là cho mỗi tiến trình: 12 × 10.']),
    ],
    gy: [['Think "process", not "thread".', 'Hãy nghĩ "tiến trình", không phải "luồng".'], ['Multiply before comparing with the limit.', 'Nhân trước khi so với trần.']],
    lhg: [['Assuming the server queues connections like a pool does.', 'Tưởng máy chủ xếp hàng kết nối như pool.'], ['Treating pool size as an application-wide number.', 'Coi cỡ pool là con số cho cả ứng dụng.']],
    tn: [tn('backend process', 'tiến trình phục vụ')],
  }),
]);
